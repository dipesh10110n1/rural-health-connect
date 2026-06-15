import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const externalUrl = Deno.env.get('EXTERNAL_SUPABASE_URL')
    const externalKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_KEY')

    if (!externalUrl || !externalKey) {
      throw new Error('External Supabase credentials not configured')
    }

    console.log('Setting up external database schema...')

    // Create client for external Supabase
    const externalSupabase = createClient(externalUrl, externalKey)

    // Execute schema setup SQL
    const schemaSQL = `
-- Create app_role enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('doctor', 'hospital', 'patient', 'health_worker', 'relative');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  age integer,
  gender text,
  phone text,
  village text,
  patient_id text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  specialization text,
  phone text,
  hospital text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create hospitals table
CREATE TABLE IF NOT EXISTS public.hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  address text,
  phone text,
  email text,
  specialty text,
  beds_available integer DEFAULT 0,
  ambulance_available boolean DEFAULT false,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create health_workers table
CREATE TABLE IF NOT EXISTS public.health_workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  phone text,
  village text,
  role text DEFAULT 'ASHA',
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create relatives table
CREATE TABLE IF NOT EXISTS public.relatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  patient_id uuid,
  name text NOT NULL,
  phone text,
  relation_to_patient text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid,
  doctor_id uuid,
  symptoms text NOT NULL,
  diagnosis text,
  treatment text,
  language text DEFAULT 'en',
  consultation_type text DEFAULT 'voice',
  status text DEFAULT 'pending',
  department text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create emergency_cases table
CREATE TABLE IF NOT EXISTS public.emergency_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid,
  assigned_to uuid,
  emergency_type text NOT NULL,
  description text,
  location text,
  status text DEFAULT 'active',
  priority text DEFAULT 'high',
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create relative_link_requests table
CREATE TABLE IF NOT EXISTS public.relative_link_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relative_id uuid NOT NULL,
  patient_id uuid NOT NULL,
  status text DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relative_link_requests ENABLE ROW LEVEL SECURITY;

-- Create public_doctors view
CREATE OR REPLACE VIEW public.public_doctors AS
SELECT id, name, specialization, hospital, available, created_at
FROM public.doctors;

-- Create functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.generate_patient_id()
RETURNS text AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := 'PAT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    SELECT EXISTS(SELECT 1 FROM public.patients WHERE patient_id = new_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.set_patient_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.patient_id IS NULL THEN
    NEW.patient_id := public.generate_patient_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Create triggers
DROP TRIGGER IF EXISTS update_patients_updated_at ON public.patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_doctors_updated_at ON public.doctors;
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_hospitals_updated_at ON public.hospitals;
CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON public.hospitals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_health_workers_updated_at ON public.health_workers;
CREATE TRIGGER update_health_workers_updated_at
  BEFORE UPDATE ON public.health_workers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_relatives_updated_at ON public.relatives;
CREATE TRIGGER update_relatives_updated_at
  BEFORE UPDATE ON public.relatives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultations_updated_at ON public.consultations;
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_patient_id_trigger ON public.patients;
CREATE TRIGGER set_patient_id_trigger
  BEFORE INSERT ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.set_patient_id();
`;

    // Execute each SQL statement directly using the Supabase client
    console.log('Creating schema in external database...')
    
    // Split SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    
    let successCount = 0
    let errorCount = 0
    const errors = []
    
    for (const statement of statements) {
      try {
        console.log('Executing statement:', statement.substring(0, 100) + '...')
        
        // Execute using the SQL editor via REST API
        const { error } = await externalSupabase.rpc('exec', { 
          sql: statement + ';' 
        }).single()
        
        if (error) {
          // Try alternative method - direct query
          const response = await fetch(`${externalUrl}/rest/v1/rpc/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${externalKey}`,
              'apikey': externalKey,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({ query: statement + ';' })
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        }
        
        successCount++
      } catch (error) {
        console.error('Error executing statement:', error.message)
        errorCount++
        errors.push({ statement: statement.substring(0, 100), error: error.message })
        // Continue with other statements even if one fails
      }
    }
    
    console.log(`Schema setup completed: ${successCount} successful, ${errorCount} failed`)
    
    if (errorCount > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Schema partially created: ${successCount} statements succeeded, ${errorCount} failed. You may need to run some SQL manually.`,
          sql: schemaSQL,
          errors: errors
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'External database schema created successfully!' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in setup-external-db:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

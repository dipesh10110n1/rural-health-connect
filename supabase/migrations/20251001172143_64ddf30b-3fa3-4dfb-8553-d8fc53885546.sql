-- Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  phone TEXT,
  village TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  symptoms TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  language TEXT DEFAULT 'en',
  consultation_type TEXT DEFAULT 'voice',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create health_workers table
CREATE TABLE IF NOT EXISTS public.health_workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  village TEXT,
  role TEXT DEFAULT 'ASHA',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialization TEXT,
  phone TEXT,
  hospital TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create emergency_cases table
CREATE TABLE IF NOT EXISTS public.emergency_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  emergency_type TEXT NOT NULL,
  description TEXT,
  location TEXT,
  status TEXT DEFAULT 'active',
  priority TEXT DEFAULT 'high',
  assigned_to UUID REFERENCES public.doctors(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_cases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients
CREATE POLICY "Users can view their own patient records"
  ON public.patients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patient records"
  ON public.patients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patient records"
  ON public.patients FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for consultations
CREATE POLICY "Users can view their own consultations"
  ON public.consultations FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.patients WHERE id = patient_id));

CREATE POLICY "Users can insert their own consultations"
  ON public.consultations FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.patients WHERE id = patient_id));

-- RLS Policies for health_workers
CREATE POLICY "Health workers can view their own profile"
  ON public.health_workers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Health workers can update their own profile"
  ON public.health_workers FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for doctors
CREATE POLICY "Doctors can view their own profile"
  ON public.doctors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can update their own profile"
  ON public.doctors FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for emergency_cases
CREATE POLICY "Anyone can view emergency cases"
  ON public.emergency_cases FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create emergency cases"
  ON public.emergency_cases FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Doctors can update emergency cases"
  ON public.emergency_cases FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM public.doctors));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_workers_updated_at
  BEFORE UPDATE ON public.health_workers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
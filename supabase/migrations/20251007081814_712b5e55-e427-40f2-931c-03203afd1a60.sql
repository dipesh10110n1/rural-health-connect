-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('doctor', 'hospital', 'patient', 'asha_worker', 'relative');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles during signup"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  specialty TEXT,
  beds_available INTEGER DEFAULT 0,
  ambulance_available BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on hospitals
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

-- RLS policies for hospitals
CREATE POLICY "Hospitals can view their own profile"
ON public.hospitals
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Hospitals can update their own profile"
ON public.hospitals
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Hospitals can insert their own profile"
ON public.hospitals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified hospitals"
ON public.hospitals
FOR SELECT
USING (verified = true);

-- Create relatives table
CREATE TABLE public.relatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  relation_to_patient TEXT,
  patient_id UUID REFERENCES public.patients(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on relatives
ALTER TABLE public.relatives ENABLE ROW LEVEL SECURITY;

-- RLS policies for relatives
CREATE POLICY "Relatives can view their own profile"
ON public.relatives
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Relatives can update their own profile"
ON public.relatives
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Relatives can insert their own profile"
ON public.relatives
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_hospitals_updated_at
BEFORE UPDATE ON public.hospitals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_relatives_updated_at
BEFORE UPDATE ON public.relatives
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
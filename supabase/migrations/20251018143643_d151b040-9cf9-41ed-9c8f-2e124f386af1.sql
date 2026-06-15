-- Add INSERT policies for doctors and health_workers tables
-- This allows them to create their own profiles during signup

CREATE POLICY "Doctors can insert their own profile"
ON public.doctors
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Health workers can insert their own profile"
ON public.health_workers
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Fix the emergency_cases security issue
-- Remove the public access policy and restrict to authorized personnel only
DROP POLICY IF EXISTS "Anyone can view emergency cases" ON public.emergency_cases;

-- Allow doctors and health workers to view emergency cases
CREATE POLICY "Medical personnel can view emergency cases"
ON public.emergency_cases
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.doctors
    UNION
    SELECT user_id FROM public.health_workers
  )
);
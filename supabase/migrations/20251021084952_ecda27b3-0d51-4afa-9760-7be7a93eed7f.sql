-- Add doctor_id and department to consultations table
ALTER TABLE public.consultations 
ADD COLUMN IF NOT EXISTS doctor_id uuid REFERENCES public.doctors(id),
ADD COLUMN IF NOT EXISTS department text;

-- Update RLS policies for consultations to allow doctors to see their assigned consultations
DROP POLICY IF EXISTS "Doctors can view assigned consultations" ON public.consultations;
CREATE POLICY "Doctors can view assigned consultations"
ON public.consultations
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM doctors WHERE id = consultations.doctor_id
  )
);

-- Allow doctors to update consultations assigned to them
DROP POLICY IF EXISTS "Doctors can update assigned consultations" ON public.consultations;
CREATE POLICY "Doctors can update assigned consultations"
ON public.consultations
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM doctors WHERE id = consultations.doctor_id
  )
);

-- Allow anyone authenticated to view doctors for consultation booking
DROP POLICY IF EXISTS "Anyone can view doctors for consultation" ON public.doctors;
CREATE POLICY "Anyone can view doctors for consultation"
ON public.doctors
FOR SELECT
USING (auth.uid() IS NOT NULL);
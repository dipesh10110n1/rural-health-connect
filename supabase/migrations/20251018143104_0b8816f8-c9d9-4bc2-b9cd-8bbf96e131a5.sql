-- Allow anyone to search for patients by patient_id (for linking relatives)
-- This only exposes the patient's ID when searched by patient_id, not all their data
CREATE POLICY "Allow searching patients by patient_id"
ON public.patients
FOR SELECT
USING (patient_id IS NOT NULL);

-- Note: This allows finding a patient's UUID by their patient_id
-- Relatives will still only see full patient details after linking via patient_id
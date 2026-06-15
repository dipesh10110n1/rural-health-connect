-- Critical Security Fixes

-- 1. Make user_id NOT NULL on all profile tables (after cleaning up any NULL records)
-- Clean up any existing NULL user_id records first
DELETE FROM patients WHERE user_id IS NULL;
DELETE FROM doctors WHERE user_id IS NULL;
DELETE FROM health_workers WHERE user_id IS NULL;
DELETE FROM hospitals WHERE user_id IS NULL;
DELETE FROM relatives WHERE user_id IS NULL;

-- Now set user_id to NOT NULL
ALTER TABLE patients ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE doctors ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE health_workers ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE hospitals ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE relatives ALTER COLUMN user_id SET NOT NULL;

-- 2. Add foreign key constraints for referential integrity
ALTER TABLE patients
ADD CONSTRAINT fk_patients_user
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE doctors
ADD CONSTRAINT fk_doctors_user
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE health_workers
ADD CONSTRAINT fk_health_workers_user
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE hospitals
ADD CONSTRAINT fk_hospitals_user
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE relatives
ADD CONSTRAINT fk_relatives_user
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Add foreign key constraints for consultations
ALTER TABLE consultations
ADD CONSTRAINT fk_consultations_doctor
FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL;

ALTER TABLE consultations
ADD CONSTRAINT fk_consultations_patient
FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;

-- 4. Remove the overly permissive patient search policy
DROP POLICY IF EXISTS "Allow searching patients by patient_id" ON patients;

-- 5. Create restricted search policy for medical staff only
CREATE POLICY "Medical staff can search patients" ON patients
FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM doctors WHERE user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM health_workers WHERE user_id = auth.uid()
  )
);

-- 6. Create patient approval system for relative linking
CREATE TABLE IF NOT EXISTS public.relative_link_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relative_id uuid REFERENCES relatives(id) ON DELETE CASCADE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at timestamptz DEFAULT now() NOT NULL,
  responded_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(relative_id, patient_id)
);

-- Enable RLS on relative_link_requests
ALTER TABLE public.relative_link_requests ENABLE ROW LEVEL SECURITY;

-- Policies for relative_link_requests
CREATE POLICY "Relatives can view their own requests" ON relative_link_requests
FOR SELECT
USING (
  auth.uid() IN (SELECT user_id FROM relatives WHERE id = relative_link_requests.relative_id)
);

CREATE POLICY "Relatives can create requests" ON relative_link_requests
FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT user_id FROM relatives WHERE id = relative_link_requests.relative_id)
);

CREATE POLICY "Patients can view requests for them" ON relative_link_requests
FOR SELECT
USING (
  auth.uid() IN (SELECT user_id FROM patients WHERE id = relative_link_requests.patient_id)
);

CREATE POLICY "Patients can update requests for them" ON relative_link_requests
FOR UPDATE
USING (
  auth.uid() IN (SELECT user_id FROM patients WHERE id = relative_link_requests.patient_id)
);

-- 7. Create function to approve relative link
CREATE OR REPLACE FUNCTION approve_relative_link(request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_relative_id uuid;
  v_patient_id uuid;
  v_patient_user_id uuid;
BEGIN
  -- Get request details and verify patient is the one approving
  SELECT relative_id, patient_id INTO v_relative_id, v_patient_id
  FROM relative_link_requests
  WHERE id = request_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found or already processed';
  END IF;

  -- Verify the current user is the patient
  SELECT user_id INTO v_patient_user_id
  FROM patients
  WHERE id = v_patient_id;

  IF v_patient_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Update the request status
  UPDATE relative_link_requests
  SET status = 'approved', responded_at = now()
  WHERE id = request_id;

  -- Link the relative to the patient
  UPDATE relatives
  SET patient_id = v_patient_id
  WHERE id = v_relative_id;
END;
$$;

-- 8. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_relative_link_requests_status ON relative_link_requests(status);

-- 9. Create view for public doctor listing (without phone numbers)
CREATE OR REPLACE VIEW public_doctors AS
SELECT 
  id, 
  name, 
  specialization, 
  hospital, 
  available,
  created_at
FROM doctors
WHERE available = true;

-- Enable RLS on the view
ALTER VIEW public_doctors SET (security_invoker = true);

-- 10. Add trigger for consultation input validation
CREATE OR REPLACE FUNCTION validate_consultation_input()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate symptoms length
  IF length(NEW.symptoms) > 2000 THEN
    RAISE EXCEPTION 'Symptoms description too long (max 2000 characters)';
  END IF;
  
  IF length(NEW.symptoms) < 10 THEN
    RAISE EXCEPTION 'Please provide more detailed symptoms (min 10 characters)';
  END IF;

  -- Validate that doctor exists and is available
  IF NEW.doctor_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM doctors WHERE id = NEW.doctor_id) THEN
      RAISE EXCEPTION 'Invalid doctor selected';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_consultation_before_insert
BEFORE INSERT ON consultations
FOR EACH ROW
EXECUTE FUNCTION validate_consultation_input();

-- 11. Add trigger for emergency case input validation
CREATE OR REPLACE FUNCTION validate_emergency_input()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate location length
  IF length(NEW.location) > 200 THEN
    RAISE EXCEPTION 'Location description too long (max 200 characters)';
  END IF;
  
  IF length(NEW.location) < 3 THEN
    RAISE EXCEPTION 'Please provide a valid location (min 3 characters)';
  END IF;

  -- Validate description length
  IF NEW.description IS NOT NULL AND length(NEW.description) > 1000 THEN
    RAISE EXCEPTION 'Description too long (max 1000 characters)';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_emergency_before_insert
BEFORE INSERT ON emergency_cases
FOR EACH ROW
EXECUTE FUNCTION validate_emergency_input();
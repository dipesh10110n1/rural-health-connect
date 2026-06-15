-- Add unique patient_id column to patients table
ALTER TABLE public.patients ADD COLUMN patient_id TEXT UNIQUE;

-- Create function to generate unique patient ID
CREATE OR REPLACE FUNCTION public.generate_patient_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate ID in format: PAT-YYYYMMDD-XXXX
    new_id := 'PAT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if ID already exists
    SELECT EXISTS(SELECT 1 FROM public.patients WHERE patient_id = new_id) INTO id_exists;
    
    -- Exit loop if ID is unique
    EXIT WHEN NOT id_exists;
  END LOOP;
  
  RETURN new_id;
END;
$$;

-- Create trigger to auto-generate patient_id for new patients
CREATE OR REPLACE FUNCTION public.set_patient_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.patient_id IS NULL THEN
    NEW.patient_id := public.generate_patient_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_patient_id
BEFORE INSERT ON public.patients
FOR EACH ROW
EXECUTE FUNCTION public.set_patient_id();

-- Generate patient_id for existing patients
UPDATE public.patients
SET patient_id = public.generate_patient_id()
WHERE patient_id IS NULL;
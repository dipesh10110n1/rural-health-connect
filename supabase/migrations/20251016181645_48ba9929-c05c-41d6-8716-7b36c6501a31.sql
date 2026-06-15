-- Fix security warnings by setting search_path for patient ID functions
CREATE OR REPLACE FUNCTION public.generate_patient_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.set_patient_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.patient_id IS NULL THEN
    NEW.patient_id := public.generate_patient_id();
  END IF;
  RETURN NEW;
END;
$$;
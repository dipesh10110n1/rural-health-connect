-- Create trigger to automatically set patient_id on insert
CREATE TRIGGER set_patient_id_trigger
  BEFORE INSERT ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.set_patient_id();
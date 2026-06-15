-- Create function to sync data to external database
CREATE OR REPLACE FUNCTION sync_to_external_db()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
  function_url text;
BEGIN
  -- Build the function URL
  function_url := current_setting('app.settings.supabase_url') || '/functions/v1/database-sync';
  
  -- Build the payload based on operation
  IF (TG_OP = 'DELETE') THEN
    payload := jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'old_record', row_to_json(OLD)
    );
  ELSE
    payload := jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'record', row_to_json(NEW)
    );
  END IF;

  -- Call the edge function asynchronously using pg_net extension
  PERFORM
    net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := payload
    );

  -- Return the appropriate record
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for all main tables
CREATE TRIGGER sync_patients_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION sync_to_external_db();

CREATE TRIGGER sync_doctors_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION sync_to_external_db();

CREATE TRIGGER sync_consultations_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION sync_to_external_db();

CREATE TRIGGER sync_hospitals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.hospitals
  FOR EACH ROW EXECUTE FUNCTION sync_to_external_db();

CREATE TRIGGER sync_health_workers_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.health_workers
  FOR EACH ROW EXECUTE FUNCTION sync_to_external_db();

CREATE TRIGGER sync_relatives_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.relatives
  FOR EACH ROW EXECUTE FUNCTION sync_to_external_db();

CREATE TRIGGER sync_emergency_cases_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.emergency_cases
  FOR EACH ROW EXECUTE FUNCTION sync_to_external_db();

CREATE TRIGGER sync_user_roles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION sync_to_external_db();

CREATE TRIGGER sync_relative_link_requests_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.relative_link_requests
  FOR EACH ROW EXECUTE FUNCTION sync_to_external_db();
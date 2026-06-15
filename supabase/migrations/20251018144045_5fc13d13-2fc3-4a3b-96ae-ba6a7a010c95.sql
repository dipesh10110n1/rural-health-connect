-- Create profiles for existing doctors and ASHA workers who don't have them yet
-- This fixes accounts created before the INSERT policies were added

-- Insert doctors profiles from user_metadata
INSERT INTO public.doctors (user_id, name, specialization, phone, hospital)
SELECT 
  ur.user_id,
  COALESCE((au.raw_user_meta_data->>'name')::text, 'Doctor'),
  COALESCE((au.raw_user_meta_data->>'specialization')::text, 'General Medicine'),
  COALESCE((au.raw_user_meta_data->>'phone')::text, ''),
  COALESCE((au.raw_user_meta_data->>'hospital')::text, '')
FROM public.user_roles ur
JOIN auth.users au ON au.id = ur.user_id
WHERE ur.role = 'doctor'
AND NOT EXISTS (
  SELECT 1 FROM public.doctors d WHERE d.user_id = ur.user_id
);

-- Insert health workers profiles from user_metadata
INSERT INTO public.health_workers (user_id, name, phone, village, role)
SELECT 
  ur.user_id,
  COALESCE((au.raw_user_meta_data->>'name')::text, 'Health Worker'),
  COALESCE((au.raw_user_meta_data->>'phone')::text, ''),
  COALESCE((au.raw_user_meta_data->>'village')::text, ''),
  'ASHA'
FROM public.user_roles ur
JOIN auth.users au ON au.id = ur.user_id
WHERE ur.role = 'asha_worker'
AND NOT EXISTS (
  SELECT 1 FROM public.health_workers hw WHERE hw.user_id = ur.user_id
);
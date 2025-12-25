-- Sincronizar perfis de pacientes existentes para a tabela patients
INSERT INTO public.patients (
  full_name,
  email,
  phone,
  nutritionist_id,
  auth_user_id,
  status
)
SELECT 
  COALESCE(p.full_name, 'Paciente'),
  u.email,
  p.phone,
  '9a1903b0-1196-4f55-b5b9-caaeabc9a4ae'::uuid as nutritionist_id,
  p.id as auth_user_id,
  'active' as status
FROM public.profiles p
LEFT JOIN auth.users u ON u.id = p.id
WHERE p.role = 'patient'
  AND NOT EXISTS (
    SELECT 1 FROM public.patients pat 
    WHERE pat.auth_user_id = p.id OR pat.email = u.email
  );
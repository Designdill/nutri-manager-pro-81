-- Fix infinite recursion in RLS policies by using security definer functions

-- Drop the problematic policies first
DROP POLICY IF EXISTS "Patients can view their own data" ON public.patients;
DROP POLICY IF EXISTS "Patients can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can view their meal plans" ON public.meal_plans;
DROP POLICY IF EXISTS "Patients can view their questionnaires" ON public.questionnaires;
DROP POLICY IF EXISTS "Patients can update their questionnaire responses" ON public.questionnaires;

-- Create a security definer function to check if user is a patient with access to specific patient record
CREATE OR REPLACE FUNCTION public.is_patient_owner(_patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.patients p
    JOIN auth.users u ON u.email = p.email
    WHERE p.id = _patient_id
      AND u.id = auth.uid()
  )
$$;

-- Create a security definer function to get patient id from auth user
CREATE OR REPLACE FUNCTION public.get_patient_id_from_auth()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id
  FROM public.patients p
  JOIN auth.users u ON u.email = p.email
  WHERE u.id = auth.uid()
  LIMIT 1
$$;

-- Recreate patients policies using security definer functions
CREATE POLICY "Patients can view their own data"
ON public.patients
FOR SELECT
USING (id = public.get_patient_id_from_auth());

-- Recreate appointments policies using security definer functions
CREATE POLICY "Patients can view their appointments"
ON public.appointments
FOR SELECT
USING (patient_id = public.get_patient_id_from_auth());

-- Recreate meal_plans policies using security definer functions
CREATE POLICY "Patients can view their meal plans"
ON public.meal_plans
FOR SELECT
USING (patient_id = public.get_patient_id_from_auth());

-- Recreate questionnaires policies using security definer functions
CREATE POLICY "Patients can view their questionnaires"
ON public.questionnaires
FOR SELECT
USING (patient_id = public.get_patient_id_from_auth());

CREATE POLICY "Patients can update their questionnaire responses"
ON public.questionnaires
FOR UPDATE
USING (patient_id = public.get_patient_id_from_auth())
WITH CHECK (patient_id = public.get_patient_id_from_auth());
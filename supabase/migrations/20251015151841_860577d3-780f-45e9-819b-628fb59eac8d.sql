-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('nutritionist', 'patient');

-- Create user_roles table (security best practice - separate from profiles)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'nutritionist'))
WITH CHECK (public.has_role(auth.uid(), 'nutritionist'));

-- Update profiles table to remove role column (will migrate to user_roles)
-- First, migrate existing roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::text::app_role
FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- Function to automatically create role when profile is created
CREATE OR REPLACE FUNCTION public.handle_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert role from profile (default to patient if not specified)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE(NEW.role::text::app_role, 'patient'::app_role))
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to sync role creation
CREATE TRIGGER on_profile_created_role
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_role();

-- Update RLS policies for patients table to allow patients to view their own data
CREATE POLICY "Patients can view their own data"
ON public.patients
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT p.id 
    FROM patients p
    WHERE p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Allow patients to view their own appointments
CREATE POLICY "Patients can view their appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  patient_id IN (
    SELECT p.id 
    FROM patients p
    WHERE p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Allow patients to view their meal plans
CREATE POLICY "Patients can view their meal plans"
ON public.meal_plans
FOR SELECT
TO authenticated
USING (
  patient_id IN (
    SELECT p.id 
    FROM patients p
    WHERE p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Allow patients to view and respond to their questionnaires
CREATE POLICY "Patients can view their questionnaires"
ON public.questionnaires
FOR SELECT
TO authenticated
USING (
  patient_id IN (
    SELECT p.id 
    FROM patients p
    WHERE p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

CREATE POLICY "Patients can update their questionnaire responses"
ON public.questionnaires
FOR UPDATE
TO authenticated
USING (
  patient_id IN (
    SELECT p.id 
    FROM patients p
    WHERE p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
)
WITH CHECK (
  patient_id IN (
    SELECT p.id 
    FROM patients p
    WHERE p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);
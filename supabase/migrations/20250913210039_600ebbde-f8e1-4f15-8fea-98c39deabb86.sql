-- Fix security vulnerability: Restrict profiles SELECT policy to only allow users to view their own profile
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);
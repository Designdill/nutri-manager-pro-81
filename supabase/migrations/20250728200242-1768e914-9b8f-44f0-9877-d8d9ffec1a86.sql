-- Critical Security Fixes - Phase 1 (Fixed)

-- 1. Enable RLS on patients table (CRITICAL - protects patient data)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- 2. Drop and recreate patients policies to ensure they're secure
DROP POLICY IF EXISTS "Nutritionists can view their patients" ON public.patients;
DROP POLICY IF EXISTS "Nutritionists can insert patients" ON public.patients;
DROP POLICY IF EXISTS "Nutritionists can update their patients" ON public.patients;
DROP POLICY IF EXISTS "Nutritionists can delete their patients" ON public.patients;
DROP POLICY IF EXISTS "Nutritionists can view patient status" ON public.patients;
DROP POLICY IF EXISTS "Nutritionists can insert their patients" ON public.patients;

CREATE POLICY "Nutritionists can view their patients" 
ON public.patients 
FOR SELECT 
USING (nutritionist_id = auth.uid());

CREATE POLICY "Nutritionists can insert patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (nutritionist_id = auth.uid());

CREATE POLICY "Nutritionists can update their patients" 
ON public.patients 
FOR UPDATE 
USING (nutritionist_id = auth.uid());

CREATE POLICY "Nutritionists can delete their patients" 
ON public.patients 
FOR DELETE 
USING (nutritionist_id = auth.uid());

-- 3. Fix notifications table INSERT policy
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR current_user = 'service_role');

-- 4. Add rate limiting for security
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their rate limits" ON public.rate_limits;
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limits;

CREATE POLICY "Users can view their rate limits" 
ON public.rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true) 
WITH CHECK (true);
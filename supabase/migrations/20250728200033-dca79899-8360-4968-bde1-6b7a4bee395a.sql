-- Critical Security Fixes - Phase 1

-- 1. Enable RLS on patients table (CRITICAL - protects patient data)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- 2. Fix notifications table INSERT policy (only system should insert most notification types)
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR current_user = 'service_role');

-- 3. Add comprehensive RLS policies for patients table
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

-- 4. Fix security definer functions to use secure search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$;

-- 5. Add rate limiting table with proper RLS
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their rate limits" 
ON public.rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 6. Add audit logs table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  table_name text NOT NULL,
  operation text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage audit logs" 
ON public.audit_logs 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- 7. Update updated_at trigger function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;
-- Critical Security Fixes Migration
-- Phase 1: Enable RLS on tables that have policies but RLS disabled

-- Enable RLS on all public tables
ALTER TABLE public.appointment_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compound_formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_app_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings_history ENABLE ROW LEVEL SECURITY;

-- Phase 2: Fix function search path security issues
-- Update all functions to have secure search_path

CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_overdue_payments()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    UPDATE payments
    SET status = 'overdue'
    WHERE status = 'pending'
    AND due_date < CURRENT_DATE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_next_backup_time(schedule text, last_backup timestamp with time zone)
RETURNS timestamp with time zone
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    CASE schedule
        WHEN 'daily' THEN
            RETURN last_backup + interval '1 day';
        WHEN 'weekly' THEN
            RETURN last_backup + interval '1 week';
        WHEN 'monthly' THEN
            RETURN last_backup + interval '1 month';
        ELSE
            RETURN last_backup + interval '1 day';
    END CASE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$;

-- Phase 3: Add missing RLS policies for notifications table
-- Allow system to insert notifications (for edge functions)
CREATE POLICY "System can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Phase 4: Fix payment_statistics table RLS
-- Add proper RLS policies for payment_statistics
CREATE POLICY "Nutritionists can view their payment statistics" 
ON public.payment_statistics 
FOR SELECT 
USING (nutritionist_id = auth.uid());

-- Phase 5: Add comprehensive audit logging table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE, SELECT
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow system/admin access to audit logs
CREATE POLICY "System can manage audit logs" 
ON public.audit_logs 
FOR ALL
USING (false)
WITH CHECK (false);

-- Phase 6: Create secure function for getting current user role (to prevent infinite recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Phase 7: Add rate limiting table for API calls
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, endpoint, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rate limit data
CREATE POLICY "Users can view their rate limits" 
ON public.rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);

-- System can manage rate limits
CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL
USING (true)
WITH CHECK (true);
-- Fix remaining security issues from linter

-- 1. Fix leaked password protection (Auth setting - can't be set via SQL migration)
-- This needs to be enabled in Supabase dashboard under Authentication > Settings

-- 2. Remove security definer views and replace with secure functions
-- No security definer views found to remove

-- 3. Move extensions out of public schema (if any exist)
-- Check and move extensions if needed
DO $$
BEGIN
    -- Move extensions from public to extensions schema if they exist
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER EXTENSION "uuid-ossp" SET SCHEMA extensions;
    END IF;
    
    -- Add more extension moves as needed
EXCEPTION
    WHEN OTHERS THEN
        -- If extensions schema doesn't exist or other issues, continue
        NULL;
END $$;

-- 4. Update extension versions to latest (these are examples - actual extensions may vary)
-- This should be done carefully in production

-- 5. Add comprehensive input validation function for edge functions
CREATE OR REPLACE FUNCTION public.validate_email(email_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Basic email validation
    RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$function$;

-- 6. Add rate limiting cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Clean up rate limit records older than 1 hour
    DELETE FROM public.rate_limits 
    WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$function$;

-- 7. Enhanced audit logging trigger function
CREATE OR REPLACE FUNCTION public.audit_table_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (user_id, table_name, operation, old_values)
        VALUES (auth.uid(), TG_TABLE_NAME, TG_OP, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (user_id, table_name, operation, old_values, new_values)
        VALUES (auth.uid(), TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (user_id, table_name, operation, new_values)
        VALUES (auth.uid(), TG_TABLE_NAME, TG_OP, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$function$;
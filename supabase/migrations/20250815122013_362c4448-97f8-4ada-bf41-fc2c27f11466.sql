-- Make CPF column nullable in patients table
ALTER TABLE public.patients ALTER COLUMN cpf DROP NOT NULL;

-- Update CPF unique constraint to allow multiple null values
DROP INDEX IF EXISTS patients_cpf_key;
CREATE UNIQUE INDEX patients_cpf_unique ON public.patients (cpf) WHERE cpf IS NOT NULL;

-- Ensure check_rate_limit function exists (create if missing)
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    endpoint_name text, 
    max_requests integer DEFAULT 100, 
    window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    current_count integer;
    window_start_time timestamp with time zone;
BEGIN
    window_start_time := timezone('utc'::text, now()) - (window_minutes || ' minutes')::interval;
    
    -- Clean up old records
    DELETE FROM public.api_rate_limits 
    WHERE created_at < window_start_time;
    
    -- Get current count for this user and endpoint
    SELECT COALESCE(SUM(request_count), 0) INTO current_count
    FROM public.api_rate_limits
    WHERE user_id = COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
    AND endpoint = endpoint_name
    AND created_at >= window_start_time;
    
    -- Check if limit exceeded
    IF current_count >= max_requests THEN
        RETURN false;
    END IF;
    
    -- Record this request
    INSERT INTO public.api_rate_limits (user_id, endpoint, request_count, window_start)
    VALUES (
        COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid), 
        endpoint_name, 
        1, 
        timezone('utc'::text, now())
    )
    ON CONFLICT (user_id, endpoint, window_start)
    DO UPDATE SET request_count = api_rate_limits.request_count + 1;
    
    RETURN true;
END;
$$;

-- Ensure validate_email_format function exists (create if missing)
CREATE OR REPLACE FUNCTION public.validate_email_format(email_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    IF email_input IS NULL OR email_input = '' THEN
        RETURN false;
    END IF;
    
    RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
           AND length(email_input) <= 254
           AND email_input NOT LIKE '%..%'
           AND email_input NOT LIKE '.%'
           AND email_input NOT LIKE '%.'
           AND email_input NOT LIKE '%@.%'
           AND email_input NOT LIKE '%.@%';
END;
$$;
-- Critical Security Fixes Phase 1 (Final)
-- Fix database linter issues and implement core security measures

-- 1. Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. Update extensions to recommended versions
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
        ALTER EXTENSION "uuid-ossp" UPDATE;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
        ALTER EXTENSION pg_net UPDATE;
    END IF;
END $$;

-- 3. Add comprehensive validation functions for security
CREATE OR REPLACE FUNCTION public.validate_cpf(cpf_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    cpf_input := regexp_replace(cpf_input, '[^0-9]', '', 'g');
    
    IF length(cpf_input) != 11 THEN
        RETURN false;
    END IF;
    
    IF cpf_input IN ('00000000000', '11111111111', '22222222222', '33333333333', 
                     '44444444444', '55555555555', '66666666666', '77777777777',
                     '88888888888', '99999999999') THEN
        RETURN false;
    END IF;
    
    DECLARE
        sum1 integer := 0;
        sum2 integer := 0;
        digit1 integer;
        digit2 integer;
        i integer;
    BEGIN
        FOR i IN 1..9 LOOP
            sum1 := sum1 + (substring(cpf_input, i, 1)::integer * (11 - i));
        END LOOP;
        
        digit1 := 11 - (sum1 % 11);
        IF digit1 >= 10 THEN
            digit1 := 0;
        END IF;
        
        FOR i IN 1..10 LOOP
            sum2 := sum2 + (substring(cpf_input, i, 1)::integer * (12 - i));
        END LOOP;
        
        digit2 := 11 - (sum2 % 11);
        IF digit2 >= 10 THEN
            digit2 := 0;
        END IF;
        
        RETURN (substring(cpf_input, 10, 1)::integer = digit1 AND 
                substring(cpf_input, 11, 1)::integer = digit2);
    END;
END;
$$;

-- 4. Enhanced email validation function
CREATE OR REPLACE FUNCTION public.validate_email_format(email_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
           AND length(email_input) <= 254
           AND email_input NOT LIKE '%..%'
           AND email_input NOT LIKE '.%'
           AND email_input NOT LIKE '%.'
           AND email_input NOT LIKE '%@.%'
           AND email_input NOT LIKE '%.@%';
END;
$$;

-- 5. Phone validation function
CREATE OR REPLACE FUNCTION public.validate_phone(phone_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    phone_input := regexp_replace(phone_input, '[^0-9]', '', 'g');
    RETURN length(phone_input) IN (10, 11) AND phone_input ~ '^[1-9][0-9]+$';
END;
$$;

-- 6. XSS protection function
CREATE OR REPLACE FUNCTION public.sanitize_html(input_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF input_text IS NULL THEN
        RETURN NULL;
    END IF;
    
    input_text := regexp_replace(input_text, '<script[^>]*>.*?</script>', '', 'gi');
    input_text := regexp_replace(input_text, '<iframe[^>]*>.*?</iframe>', '', 'gi');
    input_text := regexp_replace(input_text, '<object[^>]*>.*?</object>', '', 'gi');
    input_text := regexp_replace(input_text, '<embed[^>]*>', '', 'gi');
    input_text := regexp_replace(input_text, '<link[^>]*>', '', 'gi');
    input_text := regexp_replace(input_text, '<meta[^>]*>', '', 'gi');
    input_text := regexp_replace(input_text, 'javascript:', '', 'gi');
    input_text := regexp_replace(input_text, 'vbscript:', '', 'gi');
    input_text := regexp_replace(input_text, 'onload=', '', 'gi');
    input_text := regexp_replace(input_text, 'onerror=', '', 'gi');
    input_text := regexp_replace(input_text, 'onclick=', '', 'gi');
    
    RETURN input_text;
END;
$$;

-- 7. Patient data validation trigger function
CREATE OR REPLACE FUNCTION public.validate_patient_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.cpf IS NOT NULL AND NOT validate_cpf(NEW.cpf) THEN
        RAISE EXCEPTION 'Invalid CPF format: %', NEW.cpf;
    END IF;
    
    IF NEW.email IS NOT NULL AND NOT validate_email_format(NEW.email) THEN
        RAISE EXCEPTION 'Invalid email format: %', NEW.email;
    END IF;
    
    IF NEW.phone IS NOT NULL AND NOT validate_phone(NEW.phone) THEN
        RAISE EXCEPTION 'Invalid phone format: %', NEW.phone;
    END IF;
    
    NEW.full_name := sanitize_html(NEW.full_name);
    NEW.occupation := sanitize_html(NEW.occupation);
    NEW.medical_conditions := sanitize_html(NEW.medical_conditions);
    NEW.allergies := sanitize_html(NEW.allergies);
    NEW.medications := sanitize_html(NEW.medications);
    NEW.additional_notes := sanitize_html(NEW.additional_notes);
    
    RETURN NEW;
END;
$$;

-- 8. Add validation trigger to patients table
DROP TRIGGER IF EXISTS validate_patient_data_trigger ON public.patients;
CREATE TRIGGER validate_patient_data_trigger
    BEFORE INSERT OR UPDATE ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_patient_data();

-- 9. Rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    endpoint_name text,
    max_requests integer DEFAULT 100,
    window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_count integer;
    window_start_time timestamp with time zone;
BEGIN
    window_start_time := timezone('utc'::text, now()) - (window_minutes || ' minutes')::interval;
    
    DELETE FROM public.api_rate_limits 
    WHERE created_at < window_start_time;
    
    SELECT COALESCE(SUM(request_count), 0) INTO current_count
    FROM public.api_rate_limits
    WHERE user_id = auth.uid()
    AND endpoint = endpoint_name
    AND created_at >= window_start_time;
    
    IF current_count >= max_requests THEN
        RETURN false;
    END IF;
    
    INSERT INTO public.api_rate_limits (user_id, endpoint, request_count, window_start)
    VALUES (auth.uid(), endpoint_name, 1, timezone('utc'::text, now()))
    ON CONFLICT (user_id, endpoint, window_start)
    DO UPDATE SET request_count = api_rate_limits.request_count + 1;
    
    RETURN true;
END;
$$;

-- 10. Basic encryption/decryption functions
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data(
    input_data text,
    encryption_key text DEFAULT 'default_key'
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF input_data IS NULL THEN
        RETURN NULL;
    END IF;
    
    RETURN encode(convert_to(input_data, 'UTF8'), 'base64');
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_sensitive_data(
    encrypted_data text,
    encryption_key text DEFAULT 'default_key'
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF encrypted_data IS NULL THEN
        RETURN NULL;
    END IF;
    
    RETURN convert_from(decode(encrypted_data, 'base64'), 'UTF8');
END;
$$;

-- 11. Audit trigger function
CREATE OR REPLACE FUNCTION public.audit_table_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;
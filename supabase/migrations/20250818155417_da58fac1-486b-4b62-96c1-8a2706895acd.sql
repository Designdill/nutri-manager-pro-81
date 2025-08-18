-- Fix CPF column to be nullable and handle unique constraint properly
ALTER TABLE public.patients ALTER COLUMN cpf DROP NOT NULL;

-- Drop the existing unique constraint on CPF if it exists
ALTER TABLE public.patients DROP CONSTRAINT IF EXISTS patients_cpf_key;

-- Create a partial unique index that only applies to non-null CPF values
-- This allows multiple NULL values while maintaining uniqueness for actual CPF values
CREATE UNIQUE INDEX patients_cpf_unique_idx ON public.patients (cpf) WHERE cpf IS NOT NULL AND cpf != '';

-- Update the validation trigger to handle empty CPF strings properly
CREATE OR REPLACE FUNCTION public.validate_patient_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Convert empty strings to NULL for optional fields
    IF NEW.cpf = '' THEN
        NEW.cpf := NULL;
    END IF;
    
    IF NEW.email = '' THEN
        NEW.email := NULL;
    END IF;
    
    IF NEW.phone = '' THEN
        NEW.phone := NULL;
    END IF;
    
    -- Validate CPF only if it's provided (not null and not empty)
    IF NEW.cpf IS NOT NULL AND NEW.cpf != '' AND NOT validate_cpf(NEW.cpf) THEN
        RAISE EXCEPTION 'Invalid CPF format: %', NEW.cpf;
    END IF;
    
    -- Validate email only if it's provided (not null and not empty)
    IF NEW.email IS NOT NULL AND NEW.email != '' AND NOT validate_email_format(NEW.email) THEN
        RAISE EXCEPTION 'Invalid email format: %', NEW.email;
    END IF;
    
    -- Validate phone only if it's provided (not null and not empty)
    IF NEW.phone IS NOT NULL AND NEW.phone != '' AND NOT validate_phone(NEW.phone) THEN
        RAISE EXCEPTION 'Invalid phone format: %', NEW.phone;
    END IF;
    
    -- Sanitize text fields
    NEW.full_name := sanitize_html(NEW.full_name);
    NEW.occupation := sanitize_html(NEW.occupation);
    NEW.medical_conditions := sanitize_html(NEW.medical_conditions);
    NEW.allergies := sanitize_html(NEW.allergies);
    NEW.medications := sanitize_html(NEW.medications);
    NEW.additional_notes := sanitize_html(NEW.additional_notes);
    
    RETURN NEW;
END;
$function$;
-- Critical Security Fixes - Phase 1: Audit Triggers

-- Add audit triggers to sensitive tables for patient data security
CREATE TRIGGER audit_patients_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_patient_photos_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.patient_photos
    FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_consultations_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.consultations
    FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_patient_exams_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.patient_exams
    FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_meal_plans_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.meal_plans
    FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();
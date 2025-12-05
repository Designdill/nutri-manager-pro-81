-- Create enum for alert types
CREATE TYPE public.alert_type AS ENUM (
  'inactive_patient',
  'weight_gain',
  'weight_loss',
  'low_adherence',
  'missed_appointment',
  'no_recent_consultation'
);

-- Create enum for alert severity
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create alerts table
CREATE TABLE public.patient_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nutritionist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  alert_type alert_type NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.patient_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Nutritionists can view their alerts"
ON public.patient_alerts
FOR SELECT
USING (nutritionist_id = auth.uid());

CREATE POLICY "Nutritionists can update their alerts"
ON public.patient_alerts
FOR UPDATE
USING (nutritionist_id = auth.uid());

CREATE POLICY "Nutritionists can delete their alerts"
ON public.patient_alerts
FOR DELETE
USING (nutritionist_id = auth.uid());

CREATE POLICY "System can insert alerts"
ON public.patient_alerts
FOR INSERT
WITH CHECK (nutritionist_id = auth.uid() OR CURRENT_USER = 'service_role');

-- Create index for faster queries
CREATE INDEX idx_patient_alerts_nutritionist ON public.patient_alerts(nutritionist_id);
CREATE INDEX idx_patient_alerts_patient ON public.patient_alerts(patient_id);
CREATE INDEX idx_patient_alerts_unread ON public.patient_alerts(nutritionist_id, is_read, is_dismissed);

-- Trigger for updated_at
CREATE TRIGGER update_patient_alerts_updated_at
BEFORE UPDATE ON public.patient_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
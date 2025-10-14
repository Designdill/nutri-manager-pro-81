-- Add new email template columns to user_settings table
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS reschedule_template text,
ADD COLUMN IF NOT EXISTS cancellation_template text,
ADD COLUMN IF NOT EXISTS questionnaire_template text;
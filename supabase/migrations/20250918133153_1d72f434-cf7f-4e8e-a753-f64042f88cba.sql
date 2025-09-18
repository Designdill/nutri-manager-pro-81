-- Create configuration_profiles table
CREATE TABLE public.configuration_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  settings_data JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.configuration_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own configuration profiles"
ON public.configuration_profiles
FOR ALL
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_configuration_profiles_user_id ON public.configuration_profiles(user_id);
CREATE INDEX idx_configuration_profiles_active ON public.configuration_profiles(user_id, is_active) WHERE is_active = true;

-- Create updated_at trigger
CREATE TRIGGER update_configuration_profiles_updated_at
BEFORE UPDATE ON public.configuration_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create export_history table for tracking exports
CREATE TABLE public.export_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  export_type TEXT NOT NULL DEFAULT 'full',
  categories_exported TEXT[] NOT NULL DEFAULT '{}',
  file_format TEXT NOT NULL DEFAULT 'json',
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.export_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own export history"
ON public.export_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own export history"
ON public.export_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_export_history_user_id ON public.export_history(user_id);
CREATE INDEX idx_export_history_created_at ON public.export_history(user_id, created_at);
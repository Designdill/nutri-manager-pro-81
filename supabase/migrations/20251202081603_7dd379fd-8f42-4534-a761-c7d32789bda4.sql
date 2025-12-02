-- Create anamnesis table for detailed patient assessments
CREATE TABLE public.anamneses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  nutritionist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Basic information
  anamnesis_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Chief complaint
  chief_complaint TEXT,
  complaint_duration TEXT,
  
  -- Medical history
  previous_diseases TEXT,
  current_diseases TEXT,
  hospitalizations TEXT,
  surgeries TEXT,
  chronic_conditions TEXT,
  
  -- Family history
  family_diseases TEXT,
  family_obesity BOOLEAN DEFAULT false,
  family_diabetes BOOLEAN DEFAULT false,
  family_hypertension BOOLEAN DEFAULT false,
  family_heart_disease BOOLEAN DEFAULT false,
  
  -- Medication and supplements
  current_medications TEXT,
  vitamin_supplements TEXT,
  herbal_supplements TEXT,
  
  -- Dietary history
  eating_pattern TEXT,
  food_allergies TEXT,
  food_intolerances TEXT,
  food_aversions TEXT,
  food_preferences TEXT,
  usual_breakfast TEXT,
  usual_lunch TEXT,
  usual_dinner TEXT,
  usual_snacks TEXT,
  water_intake_ml INTEGER,
  alcohol_consumption TEXT,
  caffeine_intake TEXT,
  
  -- Lifestyle
  physical_activity_type TEXT,
  physical_activity_frequency TEXT,
  physical_activity_duration TEXT,
  smoking BOOLEAN DEFAULT false,
  smoking_details TEXT,
  sleep_hours INTEGER,
  sleep_quality TEXT,
  stress_level TEXT,
  
  -- Anthropometric data
  current_weight NUMERIC,
  height NUMERIC,
  bmi NUMERIC,
  waist_circumference NUMERIC,
  hip_circumference NUMERIC,
  body_fat_percentage NUMERIC,
  muscle_mass_percentage NUMERIC,
  
  -- Digestive symptoms
  constipation BOOLEAN DEFAULT false,
  diarrhea BOOLEAN DEFAULT false,
  bloating BOOLEAN DEFAULT false,
  heartburn BOOLEAN DEFAULT false,
  nausea BOOLEAN DEFAULT false,
  digestive_other TEXT,
  
  -- Other symptoms
  fatigue BOOLEAN DEFAULT false,
  headaches BOOLEAN DEFAULT false,
  mood_changes BOOLEAN DEFAULT false,
  skin_problems BOOLEAN DEFAULT false,
  hair_loss BOOLEAN DEFAULT false,
  other_symptoms TEXT,
  
  -- Women's health
  menstrual_cycle TEXT,
  pregnancy_history TEXT,
  lactation BOOLEAN DEFAULT false,
  
  -- Goals and expectations
  weight_goal TEXT,
  primary_goals TEXT,
  expectations TEXT,
  motivation_level TEXT,
  barriers_to_change TEXT,
  
  -- Lab results (if available)
  recent_lab_results TEXT,
  lab_date DATE,
  
  -- Professional observations
  clinical_impression TEXT,
  nutritional_diagnosis TEXT,
  initial_recommendations TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.anamneses ENABLE ROW LEVEL SECURITY;

-- Nutritionists can manage their patients' anamneses
CREATE POLICY "Nutritionists can manage their patients anamneses"
  ON public.anamneses
  FOR ALL
  USING (
    nutritionist_id = auth.uid()
  );

-- Patients can view their own anamneses
CREATE POLICY "Patients can view their own anamneses"
  ON public.anamneses
  FOR SELECT
  USING (
    patient_id = get_patient_id_from_auth()
  );

-- Create updated_at trigger
CREATE TRIGGER update_anamneses_updated_at
  BEFORE UPDATE ON public.anamneses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_anamneses_patient_id ON public.anamneses(patient_id);
CREATE INDEX idx_anamneses_nutritionist_id ON public.anamneses(nutritionist_id);
CREATE INDEX idx_anamneses_date ON public.anamneses(anamnesis_date DESC);
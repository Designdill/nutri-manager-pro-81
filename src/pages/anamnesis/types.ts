import { z } from 'zod';

export const anamnesisFormSchema = z.object({
  patient_id: z.string().min(1, "Selecione um paciente"),
  anamnesis_date: z.string(),
  
  // Chief complaint
  chief_complaint: z.string().optional(),
  complaint_duration: z.string().optional(),
  
  // Medical history
  previous_diseases: z.string().optional(),
  current_diseases: z.string().optional(),
  hospitalizations: z.string().optional(),
  surgeries: z.string().optional(),
  chronic_conditions: z.string().optional(),
  
  // Family history
  family_diseases: z.string().optional(),
  family_obesity: z.boolean().default(false),
  family_diabetes: z.boolean().default(false),
  family_hypertension: z.boolean().default(false),
  family_heart_disease: z.boolean().default(false),
  
  // Medications and supplements
  current_medications: z.string().optional(),
  vitamin_supplements: z.string().optional(),
  herbal_supplements: z.string().optional(),
  
  // Dietary history
  eating_pattern: z.string().optional(),
  food_allergies: z.string().optional(),
  food_intolerances: z.string().optional(),
  food_aversions: z.string().optional(),
  food_preferences: z.string().optional(),
  usual_breakfast: z.string().optional(),
  usual_lunch: z.string().optional(),
  usual_dinner: z.string().optional(),
  usual_snacks: z.string().optional(),
  water_intake_ml: z.coerce.number().optional(),
  alcohol_consumption: z.string().optional(),
  caffeine_intake: z.string().optional(),
  
  // Lifestyle
  physical_activity_type: z.string().optional(),
  physical_activity_frequency: z.string().optional(),
  physical_activity_duration: z.string().optional(),
  smoking: z.boolean().default(false),
  smoking_details: z.string().optional(),
  sleep_hours: z.coerce.number().optional(),
  sleep_quality: z.string().optional(),
  stress_level: z.string().optional(),
  
  // Anthropometric data
  current_weight: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  bmi: z.coerce.number().optional(),
  waist_circumference: z.coerce.number().optional(),
  hip_circumference: z.coerce.number().optional(),
  body_fat_percentage: z.coerce.number().optional(),
  muscle_mass_percentage: z.coerce.number().optional(),
  
  // Digestive symptoms
  constipation: z.boolean().default(false),
  diarrhea: z.boolean().default(false),
  bloating: z.boolean().default(false),
  heartburn: z.boolean().default(false),
  nausea: z.boolean().default(false),
  digestive_other: z.string().optional(),
  
  // Other symptoms
  fatigue: z.boolean().default(false),
  headaches: z.boolean().default(false),
  mood_changes: z.boolean().default(false),
  skin_problems: z.boolean().default(false),
  hair_loss: z.boolean().default(false),
  other_symptoms: z.string().optional(),
  
  // Women's health
  menstrual_cycle: z.string().optional(),
  pregnancy_history: z.string().optional(),
  lactation: z.boolean().default(false),
  
  // Goals
  weight_goal: z.string().optional(),
  primary_goals: z.string().optional(),
  expectations: z.string().optional(),
  motivation_level: z.string().optional(),
  barriers_to_change: z.string().optional(),
  
  // Lab results
  recent_lab_results: z.string().optional(),
  lab_date: z.string().optional(),
  
  // Professional observations
  clinical_impression: z.string().optional(),
  nutritional_diagnosis: z.string().optional(),
  initial_recommendations: z.string().optional(),
});

export type AnamnesisFormValues = z.infer<typeof anamnesisFormSchema>;

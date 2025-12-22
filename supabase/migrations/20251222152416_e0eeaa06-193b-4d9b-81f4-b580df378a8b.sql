-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nutritionist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  preparation_time INTEGER, -- em minutos
  servings INTEGER DEFAULT 1,
  instructions TEXT,
  category TEXT DEFAULT 'Outros',
  total_calories NUMERIC DEFAULT 0,
  total_proteins NUMERIC DEFAULT 0,
  total_carbohydrates NUMERIC DEFAULT 0,
  total_fats NUMERIC DEFAULT 0,
  total_fiber NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipe_ingredients table
CREATE TABLE public.recipe_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
  food_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'g',
  calories NUMERIC DEFAULT 0,
  proteins NUMERIC DEFAULT 0,
  carbohydrates NUMERIC DEFAULT 0,
  fats NUMERIC DEFAULT 0,
  fiber NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes
CREATE POLICY "Nutritionists can manage their recipes"
ON public.recipes
FOR ALL
USING (nutritionist_id = auth.uid());

CREATE POLICY "Patients can view recipes from their nutritionist"
ON public.recipes
FOR SELECT
USING (nutritionist_id IN (
  SELECT nutritionist_id FROM public.patients WHERE id = get_patient_id_from_auth()
));

-- RLS Policies for recipe_ingredients
CREATE POLICY "Users can manage ingredients of their recipes"
ON public.recipe_ingredients
FOR ALL
USING (recipe_id IN (
  SELECT id FROM public.recipes WHERE nutritionist_id = auth.uid()
));

CREATE POLICY "Patients can view ingredients of accessible recipes"
ON public.recipe_ingredients
FOR SELECT
USING (recipe_id IN (
  SELECT id FROM public.recipes WHERE nutritionist_id IN (
    SELECT nutritionist_id FROM public.patients WHERE id = get_patient_id_from_auth()
  )
));

-- Create indexes for performance
CREATE INDEX idx_recipes_nutritionist_id ON public.recipes(nutritionist_id);
CREATE INDEX idx_recipe_ingredients_recipe_id ON public.recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_food_id ON public.recipe_ingredients(food_id);

-- Trigger for updated_at
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
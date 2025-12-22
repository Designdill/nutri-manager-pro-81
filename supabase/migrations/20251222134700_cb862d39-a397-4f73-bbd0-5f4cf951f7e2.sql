-- Tabela de listas de compras
CREATE TABLE public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE SET NULL,
  nutritionist_id UUID NOT NULL,
  title TEXT NOT NULL,
  week_start DATE,
  week_end DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Itens da lista de compras
CREATE TABLE public.shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
  food_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  raw_quantity NUMERIC,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for shopping_lists
CREATE POLICY "Nutritionists can manage their shopping lists"
ON public.shopping_lists FOR ALL
USING (nutritionist_id = auth.uid());

CREATE POLICY "Patients can view their shopping lists"
ON public.shopping_lists FOR SELECT
USING (patient_id = get_patient_id_from_auth());

CREATE POLICY "Patients can update their shopping lists"
ON public.shopping_lists FOR UPDATE
USING (patient_id = get_patient_id_from_auth());

-- RLS policies for shopping_list_items
CREATE POLICY "Users can manage items of their shopping lists"
ON public.shopping_list_items FOR ALL
USING (
  shopping_list_id IN (
    SELECT id FROM public.shopping_lists 
    WHERE nutritionist_id = auth.uid() 
    OR patient_id = get_patient_id_from_auth()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_shopping_lists_updated_at
BEFORE UPDATE ON public.shopping_lists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for better performance
CREATE INDEX idx_shopping_lists_patient_id ON public.shopping_lists(patient_id);
CREATE INDEX idx_shopping_lists_nutritionist_id ON public.shopping_lists(nutritionist_id);
CREATE INDEX idx_shopping_list_items_shopping_list_id ON public.shopping_list_items(shopping_list_id);
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Categorias de supermercado
const FOOD_CATEGORIES: Record<string, string[]> = {
  'Frutas e Legumes': ['fruta', 'legume', 'verdura', 'salada', 'vegetal', 'banana', 'maçã', 'laranja', 'tomate', 'alface', 'cenoura', 'batata', 'cebola', 'alho', 'brócolos', 'espinafre', 'couve', 'pepino', 'pimento', 'abóbora', 'beringela', 'abobrinha', 'melancia', 'melão', 'morango', 'uva', 'pêra', 'pêssego', 'manga', 'abacate', 'limão', 'kiwi', 'ananás'],
  'Talho e Peixaria': ['carne', 'frango', 'peixe', 'bife', 'peito', 'coxa', 'lombo', 'porco', 'vaca', 'peru', 'atum', 'salmão', 'bacalhau', 'camarão', 'lula', 'polvo', 'sardinha', 'pescada', 'robalo', 'dourada', 'linguiça', 'presunto', 'bacon', 'fiambre'],
  'Laticínios': ['leite', 'queijo', 'iogurte', 'manteiga', 'nata', 'requeijão', 'ricota', 'mozzarella', 'parmesão', 'cottage', 'kefir', 'skyr'],
  'Ovos': ['ovo', 'ovos', 'clara', 'gema'],
  'Mercearia': ['arroz', 'massa', 'feijão', 'grão', 'lentilha', 'farinha', 'açúcar', 'sal', 'azeite', 'óleo', 'vinagre', 'molho', 'conserva', 'atum em lata', 'tomate pelado', 'milho', 'ervilha', 'cogumelo', 'azeitona', 'mel', 'cereais', 'aveia', 'granola', 'muesli', 'pão', 'bolachas', 'tostas', 'crackers'],
  'Congelados': ['congelado', 'gelado', 'frozen', 'sorvete'],
  'Bebidas': ['água', 'sumo', 'refrigerante', 'cerveja', 'vinho', 'café', 'chá', 'leite vegetal', 'bebida'],
  'Frutos Secos e Sementes': ['amêndoa', 'noz', 'avelã', 'castanha', 'amendoim', 'pistácio', 'semente', 'chia', 'linhaça', 'girassol', 'abóbora', 'gergelim', 'quinoa'],
  'Temperos e Especiarias': ['sal', 'pimenta', 'orégão', 'manjericão', 'alecrim', 'tomilho', 'canela', 'gengibre', 'curcuma', 'paprika', 'cominhos', 'noz-moscada', 'louro', 'coentros', 'salsa', 'cebolinho'],
};

// Fatores de correção (cru -> cozido)
const CORRECTION_FACTORS: Record<string, number> = {
  'arroz': 0.4,      // 100g cozido = 40g cru
  'massa': 0.45,     // 100g cozida = 45g crua
  'feijão': 0.35,    // 100g cozido = 35g cru
  'grão': 0.38,      // 100g cozido = 38g cru
  'lentilha': 0.35,  // 100g cozida = 35g crua
  'batata': 0.85,    // 100g cozida = 85g crua
  'frango': 0.75,    // 100g cozido = 75g cru
  'carne': 0.70,     // 100g cozida = 70g crua
  'peixe': 0.80,     // 100g cozido = 80g cru
  'legumes': 0.90,   // 100g cozidos = 90g crus
};

interface MealFood {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
}

interface AggregatedItem {
  food_id: string | null;
  food_name: string;
  quantity: number;
  unit: string;
  category: string;
  raw_quantity: number | null;
}

function categorizeFood(foodName: string): string {
  const lowerName = foodName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(FOOD_CATEGORIES)) {
    for (const keyword of keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  return 'Outros';
}

function getCorrectionFactor(foodName: string): number | null {
  const lowerName = foodName.toLowerCase();
  
  for (const [food, factor] of Object.entries(CORRECTION_FACTORS)) {
    if (lowerName.includes(food)) {
      return factor;
    }
  }
  
  return null;
}

function parseMealData(mealData: string | null): MealFood[] {
  if (!mealData) return [];
  
  try {
    const parsed = JSON.parse(mealData);
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        id: item.id || '',
        name: item.name || item.food_name || '',
        quantity: parseFloat(item.quantity) || parseFloat(item.serving_size) || 100,
        unit: item.unit || item.serving_unit || 'g',
        calories: item.calories,
        proteins: item.proteins,
        carbs: item.carbs || item.carbohydrates,
        fats: item.fats,
      }));
    }
  } catch {
    // Se não for JSON, tentar parsear como texto
    const lines = mealData.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const match = line.match(/^(\d+)?\s*(g|kg|ml|L|unidade|un)?\s*(.+)$/i);
      if (match) {
        return {
          id: '',
          name: match[3].trim(),
          quantity: parseFloat(match[1]) || 100,
          unit: match[2] || 'g',
        };
      }
      return {
        id: '',
        name: line.trim(),
        quantity: 100,
        unit: 'g',
      };
    });
  }
  
  return [];
}

function aggregateItems(foods: MealFood[], daysMultiplier: number = 7): AggregatedItem[] {
  const aggregated = new Map<string, AggregatedItem>();
  
  for (const food of foods) {
    const key = `${food.name.toLowerCase()}_${food.unit.toLowerCase()}`;
    
    if (aggregated.has(key)) {
      const existing = aggregated.get(key)!;
      existing.quantity += food.quantity * daysMultiplier;
    } else {
      const category = categorizeFood(food.name);
      const correctionFactor = getCorrectionFactor(food.name);
      const rawQuantity = correctionFactor 
        ? (food.quantity * daysMultiplier * correctionFactor) 
        : null;
      
      aggregated.set(key, {
        food_id: food.id || null,
        food_name: food.name,
        quantity: food.quantity * daysMultiplier,
        unit: food.unit,
        category,
        raw_quantity: rawQuantity,
      });
    }
  }
  
  // Converter unidades quando apropriado
  return Array.from(aggregated.values()).map(item => {
    // Converter gramas para kg se > 1000g
    if (item.unit === 'g' && item.quantity >= 1000) {
      item.quantity = item.quantity / 1000;
      item.unit = 'kg';
      if (item.raw_quantity) {
        item.raw_quantity = item.raw_quantity / 1000;
      }
    }
    // Converter ml para L se > 1000ml
    if (item.unit === 'ml' && item.quantity >= 1000) {
      item.quantity = item.quantity / 1000;
      item.unit = 'L';
    }
    // Arredondar quantidades
    item.quantity = Math.round(item.quantity * 10) / 10;
    if (item.raw_quantity) {
      item.raw_quantity = Math.round(item.raw_quantity * 10) / 10;
    }
    return item;
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { meal_plan_id, patient_id, title, days = 7 } = await req.json();

    if (!meal_plan_id && !patient_id) {
      throw new Error('meal_plan_id ou patient_id é obrigatório');
    }

    console.log('Generating shopping list for:', { meal_plan_id, patient_id, days });

    // Buscar plano alimentar
    let mealPlan;
    if (meal_plan_id) {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*, patients(id, full_name)')
        .eq('id', meal_plan_id)
        .single();
      
      if (error) throw error;
      mealPlan = data;
    } else {
      // Buscar o plano mais recente do paciente
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*, patients(id, full_name)')
        .eq('patient_id', patient_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      mealPlan = data;
    }

    if (!mealPlan) {
      throw new Error('Plano alimentar não encontrado');
    }

    console.log('Meal plan found:', mealPlan.title);

    // Extrair todos os alimentos do plano
    const allFoods: MealFood[] = [];
    const meals = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack'];
    
    for (const meal of meals) {
      const mealData = mealPlan[meal];
      const foods = parseMealData(mealData);
      allFoods.push(...foods);
    }

    console.log(`Found ${allFoods.length} food items in meal plan`);

    // Agregar itens
    const aggregatedItems = aggregateItems(allFoods, days);
    
    console.log(`Aggregated to ${aggregatedItems.length} unique items`);

    // Ordenar por categoria
    aggregatedItems.sort((a, b) => a.category.localeCompare(b.category));

    // Criar lista de compras
    const weekStart = new Date();
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + days);

    const { data: shoppingList, error: listError } = await supabase
      .from('shopping_lists')
      .insert({
        patient_id: mealPlan.patient_id,
        meal_plan_id: mealPlan.id,
        nutritionist_id: user.id,
        title: title || `Lista de Compras - ${mealPlan.patients?.full_name || 'Paciente'}`,
        week_start: weekStart.toISOString().split('T')[0],
        week_end: weekEnd.toISOString().split('T')[0],
        status: 'active',
      })
      .select()
      .single();

    if (listError) throw listError;

    console.log('Shopping list created:', shoppingList.id);

    // Inserir itens
    const items = aggregatedItems.map(item => ({
      shopping_list_id: shoppingList.id,
      food_id: item.food_id,
      food_name: item.food_name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      raw_quantity: item.raw_quantity,
      is_checked: false,
    }));

    const { error: itemsError } = await supabase
      .from('shopping_list_items')
      .insert(items);

    if (itemsError) throw itemsError;

    console.log(`Inserted ${items.length} items into shopping list`);

    // Retornar lista completa
    const { data: completeList, error: fetchError } = await supabase
      .from('shopping_lists')
      .select(`
        *,
        patients(id, full_name),
        shopping_list_items(*)
      `)
      .eq('id', shoppingList.id)
      .single();

    if (fetchError) throw fetchError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        shopping_list: completeList,
        summary: {
          total_items: items.length,
          categories: [...new Set(items.map(i => i.category))],
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error generating shopping list:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

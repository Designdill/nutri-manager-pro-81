import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Recipe, RecipeIngredient, Food, RECIPE_CATEGORIES } from "../types";

interface RecipeFormProps {
  recipe: Recipe | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RecipeForm({ recipe, onSuccess, onCancel }: RecipeFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);

  const [title, setTitle] = useState(recipe?.title || "");
  const [description, setDescription] = useState(recipe?.description || "");
  const [preparationTime, setPreparationTime] = useState(
    recipe?.preparation_time?.toString() || ""
  );
  const [servings, setServings] = useState(recipe?.servings?.toString() || "1");
  const [category, setCategory] = useState(recipe?.category || "Outros");
  const [instructions, setInstructions] = useState(recipe?.instructions || "");
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    recipe?.recipe_ingredients || []
  );

  useEffect(() => {
    const fetchFoods = async () => {
      const { data } = await supabase
        .from("foods")
        .select("*")
        .order("name", { ascending: true });
      setFoods(data || []);
    };
    fetchFoods();
  }, []);

  const nutritionalTotals = useMemo(() => {
    return ingredients.reduce(
      (acc, ing) => ({
        calories: acc.calories + (ing.calories || 0),
        proteins: acc.proteins + (ing.proteins || 0),
        carbohydrates: acc.carbohydrates + (ing.carbohydrates || 0),
        fats: acc.fats + (ing.fats || 0),
        fiber: acc.fiber + (ing.fiber || 0),
      }),
      { calories: 0, proteins: 0, carbohydrates: 0, fats: 0, fiber: 0 }
    );
  }, [ingredients]);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        food_id: null,
        food_name: "",
        quantity: 100,
        unit: "g",
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
        fiber: 0,
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: keyof RecipeIngredient,
    value: string | number | null
  ) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };

    // Recalculate nutrition when food or quantity changes
    if (field === "food_id" || field === "quantity") {
      const food = foods.find((f) => f.id === updated[index].food_id);
      if (food && food.serving_size) {
        const multiplier = updated[index].quantity / food.serving_size;
        updated[index].calories = (food.calories || 0) * multiplier;
        updated[index].proteins = (food.proteins || 0) * multiplier;
        updated[index].carbohydrates = (food.carbohydrates || 0) * multiplier;
        updated[index].fats = (food.fats || 0) * multiplier;
        updated[index].fiber = (food.fiber || 0) * multiplier;
        
        if (field === "food_id") {
          updated[index].food_name = food.name;
          updated[index].unit = food.serving_unit || "g";
        }
      }
    }

    setIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Informe um título para a receita.",
        variant: "destructive",
      });
      return;
    }

    if (ingredients.length === 0) {
      toast({
        title: "Ingredientes obrigatórios",
        description: "Adicione pelo menos um ingrediente.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const recipeData = {
        nutritionist_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        preparation_time: preparationTime ? parseInt(preparationTime) : null,
        servings: parseInt(servings) || 1,
        category,
        instructions: instructions.trim() || null,
        total_calories: nutritionalTotals.calories,
        total_proteins: nutritionalTotals.proteins,
        total_carbohydrates: nutritionalTotals.carbohydrates,
        total_fats: nutritionalTotals.fats,
        total_fiber: nutritionalTotals.fiber,
      };

      let recipeId = recipe?.id;

      if (recipe) {
        // Update existing recipe
        const { error } = await supabase
          .from("recipes")
          .update(recipeData)
          .eq("id", recipe.id);
        if (error) throw error;

        // Delete old ingredients
        await supabase
          .from("recipe_ingredients")
          .delete()
          .eq("recipe_id", recipe.id);
      } else {
        // Create new recipe
        const { data, error } = await supabase
          .from("recipes")
          .insert(recipeData)
          .select()
          .single();
        if (error) throw error;
        recipeId = data.id;
      }

      // Insert ingredients
      if (recipeId && ingredients.length > 0) {
        const ingredientsData = ingredients.map((ing) => ({
          recipe_id: recipeId,
          food_id: ing.food_id,
          food_name: ing.food_name,
          quantity: ing.quantity,
          unit: ing.unit,
          calories: ing.calories,
          proteins: ing.proteins,
          carbohydrates: ing.carbohydrates,
          fats: ing.fats,
          fiber: ing.fiber,
        }));

        const { error } = await supabase
          .from("recipe_ingredients")
          .insert(ingredientsData);
        if (error) throw error;
      }

      toast({
        title: recipe ? "Receita atualizada" : "Receita criada",
        description: "Os dados foram salvos com sucesso.",
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a receita.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome da receita"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECIPE_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prepTime">Tempo de Preparo (min)</Label>
          <Input
            id="prepTime"
            type="number"
            value={preparationTime}
            onChange={(e) => setPreparationTime(e.target.value)}
            placeholder="30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="servings">Porções</Label>
          <Input
            id="servings"
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descrição da receita..."
          rows={2}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Ingredientes
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {ingredients.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Clique em "Adicionar" para incluir ingredientes
            </p>
          ) : (
            ingredients.map((ing, index) => (
              <div
                key={index}
                className="grid gap-3 p-3 border rounded-lg bg-muted/50"
              >
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="md:col-span-2">
                    <Label className="text-xs">Alimento</Label>
                    <Select
                      value={ing.food_id || ""}
                      onValueChange={(value) =>
                        updateIngredient(index, "food_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {foods.map((food) => (
                          <SelectItem key={food.id} value={food.id}>
                            {food.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Quantidade</Label>
                    <Input
                      type="number"
                      value={ing.quantity}
                      onChange={(e) =>
                        updateIngredient(
                          index,
                          "quantity",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label className="text-xs">Unidade</Label>
                      <Input
                        value={ing.unit}
                        onChange={(e) =>
                          updateIngredient(index, "unit", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className="bg-background p-2 rounded text-center">
                    <span className="text-muted-foreground block">Calorias</span>
                    <span className="font-medium">{Math.round(ing.calories)}</span>
                  </div>
                  <div className="bg-background p-2 rounded text-center">
                    <span className="text-muted-foreground block">Prot</span>
                    <span className="font-medium">{Math.round(ing.proteins)}g</span>
                  </div>
                  <div className="bg-background p-2 rounded text-center">
                    <span className="text-muted-foreground block">Carb</span>
                    <span className="font-medium">{Math.round(ing.carbohydrates)}g</span>
                  </div>
                  <div className="bg-background p-2 rounded text-center">
                    <span className="text-muted-foreground block">Gord</span>
                    <span className="font-medium">{Math.round(ing.fats)}g</span>
                  </div>
                  <div className="bg-background p-2 rounded text-center">
                    <span className="text-muted-foreground block">Fibra</span>
                    <span className="font-medium">{Math.round(ing.fiber)}g</span>
                  </div>
                </div>
              </div>
            ))
          )}

          {ingredients.length > 0 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold mb-2">Total Nutricional</h4>
              <div className="grid grid-cols-5 gap-2 text-sm">
                <div className="text-center">
                  <span className="text-muted-foreground block text-xs">Calorias</span>
                  <span className="font-bold">
                    {Math.round(nutritionalTotals.calories)}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-muted-foreground block text-xs">Proteínas</span>
                  <span className="font-bold">
                    {Math.round(nutritionalTotals.proteins)}g
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-muted-foreground block text-xs">Carbos</span>
                  <span className="font-bold">
                    {Math.round(nutritionalTotals.carbohydrates)}g
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-muted-foreground block text-xs">Gorduras</span>
                  <span className="font-bold">
                    {Math.round(nutritionalTotals.fats)}g
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-muted-foreground block text-xs">Fibras</span>
                  <span className="font-bold">
                    {Math.round(nutritionalTotals.fiber)}g
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="instructions">Modo de Preparo</Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Descreva o passo a passo do preparo..."
          rows={5}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : recipe ? "Atualizar" : "Criar Receita"}
        </Button>
      </div>
    </form>
  );
}

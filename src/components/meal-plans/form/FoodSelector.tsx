import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, ChefHat, Apple } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Food } from "@/pages/food-database/types";
import { Recipe } from "@/pages/recipes/types";

export interface MealFood {
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  isRecipe?: boolean;
  servings?: number;
}

interface FoodSelectorProps {
  label: string;
  foods: MealFood[];
  onChange: (foods: MealFood[]) => void;
}

export function FoodSelector({ label, foods, onChange }: FoodSelectorProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"foods" | "recipes">("foods");
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [quantity, setQuantity] = useState<string>("100");
  const [recipeServings, setRecipeServings] = useState<string>("1");

  useEffect(() => {
    loadFoods();
    loadRecipes();
  }, []);

  const loadFoods = async () => {
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .order("name");

    if (!error && data) {
      setAvailableFoods(data);
    }
  };

  const loadRecipes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("nutritionist_id", user.id)
      .order("title");

    if (!error && data) {
      setAvailableRecipes(data as Recipe[]);
    }
  };

  const calculateNutrients = (food: Food, qty: number) => {
    const servingSize = food.serving_size || 100;
    const multiplier = qty / servingSize;

    return {
      calories: Math.round((food.calories || 0) * multiplier),
      proteins: Math.round((food.proteins || 0) * multiplier * 10) / 10,
      carbohydrates: Math.round((food.carbohydrates || 0) * multiplier * 10) / 10,
      fats: Math.round((food.fats || 0) * multiplier * 10) / 10,
    };
  };

  const calculateRecipeNutrients = (recipe: Recipe, servings: number) => {
    const multiplier = servings / (recipe.servings || 1);

    return {
      calories: Math.round((recipe.total_calories || 0) * multiplier),
      proteins: Math.round((recipe.total_proteins || 0) * multiplier * 10) / 10,
      carbohydrates: Math.round((recipe.total_carbohydrates || 0) * multiplier * 10) / 10,
      fats: Math.round((recipe.total_fats || 0) * multiplier * 10) / 10,
    };
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return;

    const nutrients = calculateNutrients(selectedFood, qty);

    const newFood: MealFood = {
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      quantity: qty,
      unit: selectedFood.serving_unit || "g",
      isRecipe: false,
      ...nutrients,
    };

    onChange([...foods, newFood]);
    setSelectedFood(null);
    setQuantity("100");
    setOpen(false);
  };

  const handleAddRecipe = () => {
    if (!selectedRecipe) return;

    const servings = parseFloat(recipeServings);
    if (isNaN(servings) || servings <= 0) return;

    const nutrients = calculateRecipeNutrients(selectedRecipe, servings);

    const newFood: MealFood = {
      foodId: selectedRecipe.id,
      foodName: selectedRecipe.title,
      quantity: servings,
      unit: servings === 1 ? "porção" : "porções",
      isRecipe: true,
      servings: servings,
      ...nutrients,
    };

    onChange([...foods, newFood]);
    setSelectedRecipe(null);
    setRecipeServings("1");
    setOpen(false);
  };

  const handleRemoveFood = (index: number) => {
    const newFoods = foods.filter((_, i) => i !== index);
    onChange(newFoods);
  };

  const filteredFoods = availableFoods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecipes = availableRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      <div className="space-y-2">
        {foods.map((food, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1">
              {food.isRecipe ? (
                <ChefHat className="h-4 w-4 text-primary" />
              ) : (
                <Apple className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <div className="font-medium">{food.foodName}</div>
                <div className="text-sm text-muted-foreground">
                  {food.quantity} {food.unit} • {food.calories}kcal • P:{food.proteins}g C:{food.carbohydrates}g G:{food.fats}g
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveFood(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Alimento ou Receita
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "foods" | "recipes")}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="foods" className="gap-2">
                <Apple className="h-4 w-4" />
                Alimentos
              </TabsTrigger>
              <TabsTrigger value="recipes" className="gap-2">
                <ChefHat className="h-4 w-4" />
                Receitas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="foods" className="m-0">
              <Command>
                <CommandInput
                  placeholder="Buscar alimento..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandEmpty>Nenhum alimento encontrado.</CommandEmpty>
                <CommandGroup className="max-h-48 overflow-auto">
                  {filteredFoods.map((food) => (
                    <CommandItem
                      key={food.id}
                      onSelect={() => setSelectedFood(food)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col w-full">
                        <span className="font-medium">{food.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {food.category} • {food.calories}kcal/{food.serving_size || 100}{food.serving_unit || "g"}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>

              {selectedFood && (
                <div className="p-4 border-t space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantidade ({selectedFood.serving_unit || "g"})</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="100"
                      min="1"
                      step="0.1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleAddFood}
                      className="flex-1"
                      size="sm"
                    >
                      Adicionar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedFood(null)}
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recipes" className="m-0">
              <Command>
                <CommandInput
                  placeholder="Buscar receita..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandEmpty>Nenhuma receita encontrada.</CommandEmpty>
                <CommandGroup className="max-h-48 overflow-auto">
                  {filteredRecipes.map((recipe) => (
                    <CommandItem
                      key={recipe.id}
                      onSelect={() => setSelectedRecipe(recipe)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col w-full">
                        <span className="font-medium">{recipe.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {recipe.category} • {recipe.total_calories}kcal/{recipe.servings || 1} porção
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>

              {selectedRecipe && (
                <div className="p-4 border-t space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium text-sm">{selectedRecipe.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Por porção: {Math.round((selectedRecipe.total_calories || 0) / (selectedRecipe.servings || 1))}kcal
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servings">Número de porções</Label>
                    <Input
                      id="servings"
                      type="number"
                      value={recipeServings}
                      onChange={(e) => setRecipeServings(e.target.value)}
                      placeholder="1"
                      min="0.5"
                      step="0.5"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleAddRecipe}
                      className="flex-1"
                      size="sm"
                    >
                      Adicionar Receita
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedRecipe(null)}
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}

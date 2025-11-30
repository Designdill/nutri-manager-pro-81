import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Food } from "@/pages/food-database/types";
import { Badge } from "@/components/ui/badge";

export interface MealFood {
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
}

interface FoodSelectorProps {
  label: string;
  foods: MealFood[];
  onChange: (foods: MealFood[]) => void;
}

export function FoodSelector({ label, foods, onChange }: FoodSelectorProps) {
  const [open, setOpen] = useState(false);
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState<string>("100");

  useEffect(() => {
    loadFoods();
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
      ...nutrients,
    };

    onChange([...foods, newFood]);
    setSelectedFood(null);
    setQuantity("100");
    setOpen(false);
  };

  const handleRemoveFood = (index: number) => {
    const newFoods = foods.filter((_, i) => i !== index);
    onChange(newFoods);
  };

  const filteredFoods = availableFoods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="flex-1">
              <div className="font-medium">{food.foodName}</div>
              <div className="text-sm text-muted-foreground">
                {food.quantity}{food.unit} • {food.calories}kcal • P:{food.proteins}g C:{food.carbohydrates}g G:{food.fats}g
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
            Adicionar Alimento
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Buscar alimento..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandEmpty>Nenhum alimento encontrado.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
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
        </PopoverContent>
      </Popover>
    </div>
  );
}

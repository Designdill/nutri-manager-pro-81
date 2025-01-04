import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Food } from "../types";

interface FoodFormProps {
  newFood: Partial<Food>;
  setNewFood: (food: Partial<Food>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  categories?: string[];
  onCategoryChange?: (category: string) => void;
}

export function FoodForm({ 
  newFood, 
  setNewFood, 
  onSubmit, 
  onCancel,
  categories,
  onCategoryChange 
}: FoodFormProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={newFood.name || ""}
          onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Input
          id="category"
          value={newFood.category || ""}
          onChange={(e) => {
            setNewFood({ ...newFood, category: e.target.value });
            onCategoryChange?.(e.target.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="calories">Calorias (kcal)</Label>
        <Input
          id="calories"
          type="number"
          value={newFood.calories || ""}
          onChange={(e) => setNewFood({ ...newFood, calories: parseFloat(e.target.value) || null })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proteins">Proteínas (g)</Label>
        <Input
          id="proteins"
          type="number"
          value={newFood.proteins || ""}
          onChange={(e) => setNewFood({ ...newFood, proteins: parseFloat(e.target.value) || null })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="carbohydrates">Carboidratos (g)</Label>
        <Input
          id="carbohydrates"
          type="number"
          value={newFood.carbohydrates || ""}
          onChange={(e) => setNewFood({ ...newFood, carbohydrates: parseFloat(e.target.value) || null })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fats">Gorduras (g)</Label>
        <Input
          id="fats"
          type="number"
          value={newFood.fats || ""}
          onChange={(e) => setNewFood({ ...newFood, fats: parseFloat(e.target.value) || null })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fiber">Fibras (g)</Label>
        <Input
          id="fiber"
          type="number"
          value={newFood.fiber || ""}
          onChange={(e) => setNewFood({ ...newFood, fiber: parseFloat(e.target.value) || null })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serving_size">Porção</Label>
        <Input
          id="serving_size"
          type="number"
          value={newFood.serving_size || ""}
          onChange={(e) => setNewFood({ ...newFood, serving_size: parseFloat(e.target.value) || null })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serving_unit">Unidade da Porção</Label>
        <Input
          id="serving_unit"
          value={newFood.serving_unit || ""}
          onChange={(e) => setNewFood({ ...newFood, serving_unit: e.target.value })}
        />
      </div>

      <div className="col-span-full flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>
          Salvar
        </Button>
      </div>
    </div>
  );
}

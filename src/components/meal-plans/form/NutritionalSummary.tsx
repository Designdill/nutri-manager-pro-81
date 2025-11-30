import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealFood } from "./FoodSelector";
import { Activity, Beef, Wheat, Droplet } from "lucide-react";

interface NutritionalSummaryProps {
  meals: {
    breakfast: MealFood[];
    morningSnack: MealFood[];
    lunch: MealFood[];
    afternoonSnack: MealFood[];
    dinner: MealFood[];
    eveningSnack: MealFood[];
  };
}

export function NutritionalSummary({ meals }: NutritionalSummaryProps) {
  const allFoods = [
    ...meals.breakfast,
    ...meals.morningSnack,
    ...meals.lunch,
    ...meals.afternoonSnack,
    ...meals.dinner,
    ...meals.eveningSnack,
  ];

  const totals = allFoods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      proteins: acc.proteins + food.proteins,
      carbohydrates: acc.carbohydrates + food.carbohydrates,
      fats: acc.fats + food.fats,
    }),
    { calories: 0, proteins: 0, carbohydrates: 0, fats: 0 }
  );

  const macroTotal = totals.proteins + totals.carbohydrates + totals.fats;
  const percentages = {
    proteins: macroTotal > 0 ? (totals.proteins / macroTotal) * 100 : 0,
    carbohydrates: macroTotal > 0 ? (totals.carbohydrates / macroTotal) * 100 : 0,
    fats: macroTotal > 0 ? (totals.fats / macroTotal) * 100 : 0,
  };

  if (allFoods.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Resumo Nutricional Diário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background rounded-lg border-2 border-primary/20">
            <div className="text-3xl font-bold text-primary">{Math.round(totals.calories)}</div>
            <div className="text-sm text-muted-foreground">Calorias</div>
            <div className="text-xs text-muted-foreground mt-1">kcal</div>
          </div>
          
          <div className="text-center p-4 bg-background rounded-lg border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Beef className="h-4 w-4 text-red-500" />
              <div className="text-2xl font-bold">{Math.round(totals.proteins * 10) / 10}g</div>
            </div>
            <div className="text-sm text-muted-foreground">Proteínas</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(percentages.proteins)}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-background rounded-lg border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Wheat className="h-4 w-4 text-amber-500" />
              <div className="text-2xl font-bold">{Math.round(totals.carbohydrates * 10) / 10}g</div>
            </div>
            <div className="text-sm text-muted-foreground">Carboidratos</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(percentages.carbohydrates)}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-background rounded-lg border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Droplet className="h-4 w-4 text-yellow-500" />
              <div className="text-2xl font-bold">{Math.round(totals.fats * 10) / 10}g</div>
            </div>
            <div className="text-sm text-muted-foreground">Gorduras</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(percentages.fats)}%
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Distribuição de Macronutrientes</div>
          <div className="flex h-4 rounded-full overflow-hidden">
            <div
              className="bg-red-500"
              style={{ width: `${percentages.proteins}%` }}
              title={`Proteínas: ${Math.round(percentages.proteins)}%`}
            />
            <div
              className="bg-amber-500"
              style={{ width: `${percentages.carbohydrates}%` }}
              title={`Carboidratos: ${Math.round(percentages.carbohydrates)}%`}
            />
            <div
              className="bg-yellow-500"
              style={{ width: `${percentages.fats}%` }}
              title={`Gorduras: ${Math.round(percentages.fats)}%`}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Proteínas: {Math.round(percentages.proteins)}%</span>
            <span>Carboidratos: {Math.round(percentages.carbohydrates)}%</span>
            <span>Gorduras: {Math.round(percentages.fats)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, UtensilsCrossed, Activity } from "lucide-react";
import { MealPlanWithPatient } from "./types";
import { Badge } from "@/components/ui/badge";
import { MealFood } from "./form/FoodSelector";

interface MealPlansListProps {
  mealPlans: MealPlanWithPatient[];
  isLoading: boolean;
  onCreateNew: () => void;
}

export function MealPlansList({ mealPlans, isLoading, onCreateNew }: MealPlansListProps) {
  const calculateTotals = (mealData: string | null) => {
    if (!mealData) return null;
    try {
      const foods: MealFood[] = JSON.parse(mealData);
      if (!Array.isArray(foods) || foods.length === 0) return null;
      
      return foods.reduce(
        (acc, food) => ({
          calories: acc.calories + (food.calories || 0),
          proteins: acc.proteins + (food.proteins || 0),
          carbohydrates: acc.carbohydrates + (food.carbohydrates || 0),
          fats: acc.fats + (food.fats || 0),
        }),
        { calories: 0, proteins: 0, carbohydrates: 0, fats: 0 }
      );
    } catch {
      return null;
    }
  };

  const getPlanTotals = (plan: MealPlanWithPatient) => {
    const meals = [
      plan.breakfast,
      plan.morning_snack,
      plan.lunch,
      plan.afternoon_snack,
      plan.dinner,
      plan.evening_snack,
    ];

    return meals.reduce(
      (acc, meal) => {
        const mealTotals = calculateTotals(meal);
        if (mealTotals) {
          acc.calories += mealTotals.calories;
          acc.proteins += mealTotals.proteins;
          acc.carbohydrates += mealTotals.carbohydrates;
          acc.fats += mealTotals.fats;
        }
        return acc;
      },
      { calories: 0, proteins: 0, carbohydrates: 0, fats: 0 }
    );
  };

  const renderMealSection = (title: string, mealData: string | null) => {
    if (!mealData) return null;
    
    try {
      const foods: MealFood[] = JSON.parse(mealData);
      if (!Array.isArray(foods) || foods.length === 0) return null;

      const totals = calculateTotals(mealData);
      
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{title}</h4>
            {totals && (
              <Badge variant="secondary" className="text-xs">
                {Math.round(totals.calories)}kcal
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            {foods.map((food, idx) => (
              <div key={idx} className="text-sm text-muted-foreground pl-2">
                • {food.foodName} ({food.quantity}{food.unit})
              </div>
            ))}
          </div>
        </div>
      );
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Carregando planos alimentares...</p>
        </CardContent>
      </Card>
    );
  }

  if (!mealPlans?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground text-center">
            Nenhum plano alimentar criado ainda.
          </p>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Clique no botão abaixo para criar um novo plano.
          </p>
          <Button onClick={onCreateNew}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Criar Plano Alimentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={onCreateNew}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Plano
        </Button>
      </div>
      <div className="grid gap-6">
        {mealPlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{plan.title}</span>
                {plan.patients?.full_name && (
                  <span className="text-sm text-muted-foreground">
                    Paciente: {plan.patients.full_name}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {plan.description && (
                <p className="text-muted-foreground mb-4">{plan.description}</p>
              )}
              
              {(() => {
                const totals = getPlanTotals(plan);
                const hasNutrients = totals.calories > 0;
                
                return hasNutrients ? (
                  <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="font-medium">Total Diário</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-primary">{Math.round(totals.calories)}</div>
                        <div className="text-xs text-muted-foreground">kcal</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{Math.round(totals.proteins * 10) / 10}g</div>
                        <div className="text-xs text-muted-foreground">Proteínas</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{Math.round(totals.carbohydrates * 10) / 10}g</div>
                        <div className="text-xs text-muted-foreground">Carbos</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{Math.round(totals.fats * 10) / 10}g</div>
                        <div className="text-xs text-muted-foreground">Gorduras</div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMealSection("Café da Manhã", plan.breakfast)}
                {renderMealSection("Lanche da Manhã", plan.morning_snack)}
                {renderMealSection("Almoço", plan.lunch)}
                {renderMealSection("Lanche da Tarde", plan.afternoon_snack)}
                {renderMealSection("Jantar", plan.dinner)}
                {renderMealSection("Ceia", plan.evening_snack)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
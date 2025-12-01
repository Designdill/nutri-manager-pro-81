import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Utensils, Download } from 'lucide-react';
import { useAuth } from '@/App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function PatientMealPlans() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMealPlans = async () => {
      if (!session?.user?.email) return;

      const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (patient) {
        const { data, error } = await supabase
          .from('meal_plans')
          .select('*')
          .eq('patient_id', patient.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setMealPlans(data);
        }
      }
      setIsLoading(false);
    };

    fetchMealPlans();
  }, [session]);

  const calculateMealNutrition = (mealData: string | null) => {
    if (!mealData) return null;
    try {
      const foods = JSON.parse(mealData);
      if (!Array.isArray(foods) || foods.length === 0) return null;

      const totals = foods.reduce(
        (acc, food) => ({
          calories: acc.calories + (food.calories || 0),
          proteins: acc.proteins + (food.proteins || 0),
          carbs: acc.carbs + (food.carbohydrates || 0),
          fats: acc.fats + (food.fats || 0),
        }),
        { calories: 0, proteins: 0, carbs: 0, fats: 0 }
      );

      return totals;
    } catch {
      return null;
    }
  };

  const calculateDailyTotals = (plan: any) => {
    const meals = [
      plan.breakfast,
      plan.morning_snack,
      plan.lunch,
      plan.afternoon_snack,
      plan.dinner,
      plan.evening_snack,
    ];

    const totals = meals.reduce(
      (acc, meal) => {
        const nutrition = calculateMealNutrition(meal);
        if (nutrition) {
          return {
            calories: acc.calories + nutrition.calories,
            proteins: acc.proteins + nutrition.proteins,
            carbs: acc.carbs + nutrition.carbs,
            fats: acc.fats + nutrition.fats,
          };
        }
        return acc;
      },
      { calories: 0, proteins: 0, carbs: 0, fats: 0 }
    );

    return totals;
  };

  const handleDownload = (plan: any) => {
    const meals = [
      { name: "Café da Manhã", data: plan.breakfast },
      { name: "Lanche da Manhã", data: plan.morning_snack },
      { name: "Almoço", data: plan.lunch },
      { name: "Lanche da Tarde", data: plan.afternoon_snack },
      { name: "Jantar", data: plan.dinner },
      { name: "Ceia", data: plan.evening_snack },
    ];

    let content = `PLANO ALIMENTAR\n\n`;
    content += `${plan.title}\n`;
    if (plan.description) content += `${plan.description}\n`;
    content += `\n${"=".repeat(50)}\n\n`;

    meals.forEach((meal) => {
      if (meal.data) {
        content += `${meal.name.toUpperCase()}\n`;
        try {
          const foods = JSON.parse(meal.data);
          if (Array.isArray(foods)) {
            foods.forEach((food: any) => {
              content += `- ${food.name} (${food.quantity}${food.serving_unit || "g"})\n`;
            });
            const nutrition = calculateMealNutrition(meal.data);
            if (nutrition) {
              content += `  Calorias: ${nutrition.calories.toFixed(0)} kcal | `;
              content += `Proteínas: ${nutrition.proteins.toFixed(1)}g | `;
              content += `Carbos: ${nutrition.carbs.toFixed(1)}g | `;
              content += `Gorduras: ${nutrition.fats.toFixed(1)}g\n`;
            }
          }
        } catch {
          content += meal.data + "\n";
        }
        content += "\n";
      }
    });

    const totals = calculateDailyTotals(plan);
    content += `\n${"=".repeat(50)}\n`;
    content += `TOTAIS DIÁRIOS\n`;
    content += `Calorias: ${totals.calories.toFixed(0)} kcal\n`;
    content += `Proteínas: ${totals.proteins.toFixed(1)}g\n`;
    content += `Carboidratos: ${totals.carbs.toFixed(1)}g\n`;
    content += `Gorduras: ${totals.fats.toFixed(1)}g\n`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plano-alimentar-${plan.title.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Plano alimentar baixado com sucesso!");
  };

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/patient')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Meus Planos Alimentares</h1>
            <p className="text-muted-foreground">Seus planos nutricionais personalizados</p>
          </div>
        </div>

        {mealPlans.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Você ainda não tem planos alimentares</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {mealPlans.map((plan) => {
              const dailyTotals = calculateDailyTotals(plan);
              return (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{plan.title}</CardTitle>
                        {plan.description && (
                          <CardDescription className="mt-2">
                            {plan.description}
                          </CardDescription>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(plan)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Nutritional Summary */}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Resumo Nutricional Diário</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Calorias</p>
                            <p className="text-xl font-bold">
                              {dailyTotals.calories.toFixed(0)}
                            </p>
                            <p className="text-xs text-muted-foreground">kcal</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Proteínas</p>
                            <p className="text-xl font-bold">
                              {dailyTotals.proteins.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">g</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Carboidratos</p>
                            <p className="text-xl font-bold">
                              {dailyTotals.carbs.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">g</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Gorduras</p>
                            <p className="text-xl font-bold">
                              {dailyTotals.fats.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">g</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Meals */}
                      <div className="space-y-4">
                        {[
                          { name: "Café da Manhã", data: plan.breakfast },
                          { name: "Lanche da Manhã", data: plan.morning_snack },
                          { name: "Almoço", data: plan.lunch },
                          { name: "Lanche da Tarde", data: plan.afternoon_snack },
                          { name: "Jantar", data: plan.dinner },
                          { name: "Ceia", data: plan.evening_snack },
                        ].map(
                          (meal) =>
                            meal.data && (
                              <div key={meal.name} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{meal.name}</Badge>
                                  {(() => {
                                    const nutrition = calculateMealNutrition(meal.data);
                                    return nutrition ? (
                                      <span className="text-sm text-muted-foreground">
                                        {nutrition.calories.toFixed(0)} kcal
                                      </span>
                                    ) : null;
                                  })()}
                                </div>
                                <div className="pl-4 space-y-1">
                                  {(() => {
                                    try {
                                      const foods = JSON.parse(meal.data);
                                      if (Array.isArray(foods)) {
                                        return foods.map((food: any, idx: number) => (
                                          <p key={idx} className="text-sm">
                                            • {food.name}{" "}
                                            <span className="text-muted-foreground">
                                              ({food.quantity}
                                              {food.serving_unit || "g"})
                                            </span>
                                          </p>
                                        ));
                                      }
                                      return <p className="text-sm">{meal.data}</p>;
                                    } catch {
                                      return <p className="text-sm">{meal.data}</p>;
                                    }
                                  })()}
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface MealPlansListProps {
  mealPlans: Tables<"meal_plans">[];
  isLoading: boolean;
}

export function MealPlansList({ mealPlans, isLoading }: MealPlansListProps) {
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
          <p className="text-sm text-muted-foreground text-center">
            Clique no botão acima para criar um novo plano.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {mealPlans.map((plan) => (
        <Card key={plan.id}>
          <CardHeader>
            <CardTitle>{plan.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{plan.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
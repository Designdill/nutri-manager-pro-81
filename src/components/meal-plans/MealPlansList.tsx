import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, UtensilsCrossed } from "lucide-react";
import { MealPlanWithPatient } from "./types";

interface MealPlansListProps {
  mealPlans: MealPlanWithPatient[];
  isLoading: boolean;
  onCreateNew: () => void;
}

export function MealPlansList({ mealPlans, isLoading, onCreateNew }: MealPlansListProps) {
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
              <p className="text-muted-foreground mb-4">{plan.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.breakfast && (
                  <div>
                    <h4 className="font-medium mb-1">Café da Manhã</h4>
                    <p className="text-sm text-muted-foreground">{plan.breakfast}</p>
                  </div>
                )}
                {plan.morning_snack && (
                  <div>
                    <h4 className="font-medium mb-1">Lanche da Manhã</h4>
                    <p className="text-sm text-muted-foreground">{plan.morning_snack}</p>
                  </div>
                )}
                {plan.lunch && (
                  <div>
                    <h4 className="font-medium mb-1">Almoço</h4>
                    <p className="text-sm text-muted-foreground">{plan.lunch}</p>
                  </div>
                )}
                {plan.afternoon_snack && (
                  <div>
                    <h4 className="font-medium mb-1">Lanche da Tarde</h4>
                    <p className="text-sm text-muted-foreground">{plan.afternoon_snack}</p>
                  </div>
                )}
                {plan.dinner && (
                  <div>
                    <h4 className="font-medium mb-1">Jantar</h4>
                    <p className="text-sm text-muted-foreground">{plan.dinner}</p>
                  </div>
                )}
                {plan.evening_snack && (
                  <div>
                    <h4 className="font-medium mb-1">Ceia</h4>
                    <p className="text-sm text-muted-foreground">{plan.evening_snack}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { useState } from "react";
import { useAuth } from "@/App";
import { AppSidebar } from "@/components/AppSidebar";
import { CreateMealPlanForm } from "@/components/meal-plans/CreateMealPlanForm";
import { MealPlansList } from "@/components/meal-plans/MealPlansList";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function MealPlansPage() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const { data: mealPlans, isLoading, error } = useQuery({
    queryKey: ["meal-plans"],
    queryFn: async () => {
      console.log("Fetching meal plans...");
      try {
        const { data, error } = await supabase
          .from("meal_plans")
          .select(`
            *,
            patients (
              id,
              full_name
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching meal plans:", error);
          throw error;
        }

        console.log("Meal plans fetched successfully:", data);
        return data;
      } catch (error) {
        console.error("Failed to fetch meal plans:", error);
        toast({
          title: "Erro ao carregar planos alimentares",
          description: "Por favor, tente novamente mais tarde.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 space-y-8 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Planos Alimentares</h1>
            <p className="text-muted-foreground">
              Gerencie os planos alimentares dos seus pacientes
            </p>
          </div>
        </div>

        {isCreating ? (
          <CreateMealPlanForm onCancel={() => setIsCreating(false)} />
        ) : (
          <MealPlansList
            mealPlans={mealPlans || []}
            isLoading={isLoading}
            onCreateNew={() => setIsCreating(true)}
          />
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
import { useAuth } from "@/App";
import { AppSidebar } from "@/components/AppSidebar";
import { CreateMealPlanForm } from "@/components/meal-plans/CreateMealPlanForm";
import { MealPlansList } from "@/components/meal-plans/MealPlansList";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BookOpen } from "lucide-react";

export default function MealPlansPage() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      console.log("Fetching patients data...");
      try {
        const { data, error } = await supabase
          .from("patients")
          .select(`
            *,
            profiles (
              id,
              full_name,
              avatar_url
            )
          `);

        if (error) throw error;

        console.log("Patients data fetched:", data);
        return data;
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Erro ao carregar pacientes",
          description: "Por favor, tente novamente mais tarde.",
          variant: "destructive",
        });
        throw error;
      }
    },
  });

  const { data: mealPlans, isLoading: mealPlansLoading } = useQuery({
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

        if (error) throw error;

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
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="page-container overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="page-header">
            <div className="flex items-start gap-3">
              <div className="icon-box-primary hidden sm:flex">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Planos Alimentares</h1>
                <p className="text-muted-foreground">
                  Crie e gerencie planos alimentares personalizados para seus pacientes
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {isCreating ? (
            <CreateMealPlanForm
              patients={patients || []}
              patientsLoading={patientsLoading}
              onSuccess={() => setIsCreating(false)}
              onCancel={() => setIsCreating(false)}
            />
          ) : (
            <MealPlansList
              mealPlans={mealPlans || []}
              isLoading={mealPlansLoading}
              onCreateNew={() => setIsCreating(true)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
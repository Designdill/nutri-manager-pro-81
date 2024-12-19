import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { CreateMealPlanForm } from "@/components/meal-plans/CreateMealPlanForm";
import { MealPlansList } from "@/components/meal-plans/MealPlansList";
import { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;

export default function MealPlansPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*");
      
      if (error) {
        console.error("Error fetching patients:", error);
        throw error;
      }

      return data as Patient[];
    },
  });

  const { data: mealPlans, isLoading: mealPlansLoading } = useQuery({
    queryKey: ["meal_plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meal_plans")
        .select("*");
      
      if (error) {
        console.error("Error fetching meal plans:", error);
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Planos Alimentares</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Plano Alimentar</DialogTitle>
              </DialogHeader>
              <CreateMealPlanForm
                patients={patients}
                patientsLoading={patientsLoading}
                onSuccess={() => setIsDialogOpen(false)}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <MealPlansList 
          mealPlans={mealPlans} 
          isLoading={mealPlansLoading} 
        />
      </div>
    </div>
  );
}
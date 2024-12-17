import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, UtensilsCrossed } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function MealPlansPage() {
  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*");
      
      if (error) {
        console.error("Error fetching patients:", error);
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
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        </div>

        <div className="grid gap-6">
          {patients?.length === 0 ? (
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
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Planos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Lista de planos será implementada posteriormente */}
                <p className="text-muted-foreground">
                  Implementação da lista de planos em andamento...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
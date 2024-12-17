import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, UtensilsCrossed } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function MealPlansPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const handleCreatePlan = () => {
    // Por enquanto apenas mostra um toast informativo
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de planos alimentares será implementada em breve.",
    });
    setIsDialogOpen(false);
  };

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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Plano Alimentar</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-muted-foreground">
                  Formulário de criação de plano alimentar será implementado aqui.
                </p>
                <Button onClick={handleCreatePlan}>
                  Criar Plano (Em desenvolvimento)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
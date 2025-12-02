import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnamnesisForm } from "./components/AnamnesisForm";
import { AnamnesisList } from "./components/AnamnesisList";

export default function AnamnesisPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Anamneses</h1>
          <p className="text-muted-foreground">
            Avaliações detalhadas dos pacientes
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Anamnese
        </Button>
      </div>

      <AnamnesisList />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Anamnese</DialogTitle>
          </DialogHeader>
          <AnamnesisForm
            onSuccess={() => setIsCreateDialogOpen(false)}
            nutritionistId={session?.user?.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

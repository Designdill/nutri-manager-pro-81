import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnamnesisForm } from "./components/AnamnesisForm";
import { AnamnesisList } from "./components/AnamnesisList";
import { AnamnesisViewer } from "./components/AnamnesisViewer";

export default function AnamnesisPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const preselectedPatientId = searchParams.get("patient");
  const viewAnamnesisId = searchParams.get("view");

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Auto-open dialogs based on URL params
  useEffect(() => {
    if (preselectedPatientId) {
      setIsCreateDialogOpen(true);
    }
    if (viewAnamnesisId) {
      setIsViewDialogOpen(true);
    }
  }, [preselectedPatientId, viewAnamnesisId]);

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    // Clear URL param
    searchParams.delete("patient");
    setSearchParams(searchParams);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    // Clear URL param
    searchParams.delete("view");
    setSearchParams(searchParams);
  };

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

      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => !open && handleCloseCreateDialog()}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Anamnese</DialogTitle>
          </DialogHeader>
          <AnamnesisForm
            onSuccess={handleCloseCreateDialog}
            nutritionistId={session?.user?.id}
            preselectedPatientId={preselectedPatientId || undefined}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={(open) => !open && handleCloseViewDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Anamnese</DialogTitle>
          </DialogHeader>
          {viewAnamnesisId && <AnamnesisViewer anamnesisId={viewAnamnesisId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

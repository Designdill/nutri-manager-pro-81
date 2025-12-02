import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnamnesisViewer } from "./AnamnesisViewer";

export function AnamnesisList() {
  const [selectedAnamnesis, setSelectedAnamnesis] = useState<any>(null);

  const { data: anamneses, isLoading } = useQuery({
    queryKey: ['anamneses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('anamneses')
        .select(`
          *,
          patients (full_name)
        `)
        .order('anamnesis_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!anamneses || anamneses.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhuma anamnese registrada ainda
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {anamneses.map((anamnesis) => (
          <Card key={anamnesis.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {anamnesis.patients?.full_name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(anamnesis.anamnesis_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAnamnesis(anamnesis)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {anamnesis.chief_complaint && (
                  <div>
                    <span className="font-medium">Queixa Principal: </span>
                    <span className="text-muted-foreground">{anamnesis.chief_complaint}</span>
                  </div>
                )}
                {anamnesis.primary_goals && (
                  <div>
                    <span className="font-medium">Objetivos: </span>
                    <span className="text-muted-foreground">{anamnesis.primary_goals}</span>
                  </div>
                )}
                {anamnesis.nutritional_diagnosis && (
                  <div>
                    <Badge variant="secondary">{anamnesis.nutritional_diagnosis}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedAnamnesis} onOpenChange={() => setSelectedAnamnesis(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Anamnese</DialogTitle>
          </DialogHeader>
          {selectedAnamnesis && <AnamnesisViewer anamnesis={selectedAnamnesis} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

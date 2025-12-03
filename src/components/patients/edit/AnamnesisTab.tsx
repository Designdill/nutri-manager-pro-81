import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCheck2, Plus, Eye, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function AnamnesisTab() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const { data: anamneses, isLoading } = useQuery({
    queryKey: ["patient-anamneses", patientId],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return [];

      const { data, error } = await supabase
        .from("anamneses")
        .select("*")
        .eq("patient_id", patientId)
        .order("anamnesis_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId,
  });

  const handleNewAnamnesis = () => {
    navigate(`/anamnesis?patient=${patientId}`);
  };

  const handleViewAnamnesis = (anamnesisId: string) => {
    navigate(`/anamnesis?view=${anamnesisId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5" />
            Anamneses do Paciente
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/anamnesis")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Todas
            </Button>
            <Button size="sm" onClick={handleNewAnamnesis}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Anamnese
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {anamneses && anamneses.length > 0 ? (
            <div className="space-y-3">
              {anamneses.map((anamnesis) => (
                <div
                  key={anamnesis.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <FileCheck2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Anamnese de {format(new Date(anamnesis.anamnesis_date), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        {anamnesis.nutritional_diagnosis && (
                          <Badge variant="secondary" className="text-xs">
                            Diagnóstico
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        Criada em {format(new Date(anamnesis.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                      {anamnesis.chief_complaint && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          Queixa: {anamnesis.chief_complaint}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewAnamnesis(anamnesis.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileCheck2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="font-medium text-muted-foreground mb-1">
                Nenhuma anamnese encontrada
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Clique no botão acima para criar a primeira anamnese deste paciente.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

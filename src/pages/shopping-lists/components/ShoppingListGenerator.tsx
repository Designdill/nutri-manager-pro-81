import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShoppingCart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShoppingList } from "../types";

interface ShoppingListGeneratorProps {
  patients: { id: string; full_name: string }[];
  mealPlans: { id: string; title: string; patient_id: string }[];
  onGenerated: (list: ShoppingList) => void;
}

export function ShoppingListGenerator({ patients, mealPlans, onGenerated }: ShoppingListGeneratorProps) {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedMealPlan, setSelectedMealPlan] = useState<string>("");
  const [days, setDays] = useState<number>(7);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredMealPlans = selectedPatient
    ? mealPlans.filter(mp => mp.patient_id === selectedPatient)
    : mealPlans;

  const handleGenerate = async () => {
    if (!selectedMealPlan) {
      toast.error("Selecione um plano alimentar");
      return;
    }

    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Não autenticado");
      }

      const { data, error } = await supabase.functions.invoke('generate-shopping-list', {
        body: {
          meal_plan_id: selectedMealPlan,
          days,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success("Lista de compras gerada com sucesso!");
        onGenerated(data.shopping_list);
      } else {
        throw new Error(data.error || "Erro ao gerar lista");
      }
    } catch (error: any) {
      console.error("Error generating shopping list:", error);
      toast.error(error.message || "Erro ao gerar lista de compras");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Gerar Lista de Compras Inteligente</CardTitle>
            <CardDescription>
              Crie uma lista de compras automaticamente a partir do plano alimentar
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Paciente</Label>
            <Select value={selectedPatient} onValueChange={(value) => {
              setSelectedPatient(value);
              setSelectedMealPlan("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por paciente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pacientes</SelectItem>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Plano Alimentar *</Label>
            <Select value={selectedMealPlan} onValueChange={setSelectedMealPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o plano" />
              </SelectTrigger>
              <SelectContent>
                {filteredMealPlans.map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Período (dias)</Label>
            <Input
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 7)}
            />
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedMealPlan}
          className="w-full gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando lista...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Gerar Lista de Compras
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, UtensilsCrossed } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MealPlanFormData {
  patientId: string;
  title: string;
  description: string;
  breakfast: string;
  morningSnack: string;
  lunch: string;
  afternoonSnack: string;
  dinner: string;
  eveningSnack: string;
}

export default function MealPlansPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<MealPlanFormData>();

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, full_name");
      
      if (error) {
        console.error("Error fetching patients:", error);
        throw error;
      }

      return data;
    },
  });

  const handleCreatePlan = async (data: MealPlanFormData) => {
    try {
      // TODO: Implement meal plan creation in database
      console.log("Creating meal plan:", data);
      
      toast({
        title: "Plano alimentar criado",
        description: "O plano alimentar foi criado com sucesso.",
      });
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating meal plan:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o plano alimentar.",
        variant: "destructive",
      });
    }
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
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Plano Alimentar</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreatePlan)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paciente</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={patientsLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um paciente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {patients?.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.full_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Plano</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Plano Base - Redução de Peso" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva os objetivos e observações gerais do plano"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="breakfast"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Café da Manhã</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Detalhes do café da manhã" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="morningSnack"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lanche da Manhã</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Detalhes do lanche da manhã" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lunch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Almoço</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Detalhes do almoço" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="afternoonSnack"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lanche da Tarde</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Detalhes do lanche da tarde" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dinner"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jantar</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Detalhes do jantar" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eveningSnack"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ceia</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Detalhes da ceia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Criar Plano Alimentar</Button>
                  </div>
                </form>
              </Form>
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
                  Lista de planos será implementada após a criação da tabela no banco de dados.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const examFormSchema = z.object({
  exam_type_id: z.string().min(1, "Tipo de exame é obrigatório"),
  exam_date: z.string().min(1, "Data é obrigatória"),
  value: z.string().min(1, "Valor é obrigatório"),
  notes: z.string().optional(),
});

type ExamFormValues = z.infer<typeof examFormSchema>;

interface ExamFormProps {
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ExamForm({ patientId, onSuccess, onCancel }: ExamFormProps) {
  const { toast } = useToast();
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      exam_date: new Date().toISOString().split('T')[0],
      value: "",
      notes: "",
    },
  });

  const { data: examTypes, isLoading: isLoadingExamTypes } = useQuery({
    queryKey: ["examTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exam_types")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const determineStatus = (value: number, examType: any) => {
    if (!examType.min_reference || !examType.max_reference) return 'normal';
    if (value < examType.min_reference) return 'below_reference';
    if (value > examType.max_reference) return 'above_reference';
    return 'normal';
  };

  const onSubmit = async (data: ExamFormValues) => {
    try {
      const examType = examTypes?.find(type => type.id === data.exam_type_id);
      const status = determineStatus(Number(data.value), examType);

      const { error } = await supabase
        .from("patient_exams")
        .insert({
          patient_id: patientId,
          exam_type_id: data.exam_type_id,
          exam_date: data.exam_date,
          value: parseFloat(data.value),
          status,
          notes: data.notes,
        });

      if (error) throw error;

      toast({
        title: "Exame registrado com sucesso",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao registrar exame:", error);
      toast({
        title: "Erro ao registrar exame",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Novo Exame</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="exam_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Exame</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de exame" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {examTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} ({type.unit})
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
                name="exam_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Exame</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">Salvar Exame</Button>
        </div>
      </form>
    </Form>
  );
}
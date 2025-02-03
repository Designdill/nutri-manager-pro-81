import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { QuestionnaireFormProps, QuestionnaireFormValues } from "../types";

interface Props extends QuestionnaireFormProps {
  form: UseFormReturn<QuestionnaireFormValues>;
  onSubmit: (data: QuestionnaireFormValues) => Promise<void>;
}

export function QuestionnaireForm({ form, onSubmit, patients }: Props) {
  const questions = form.watch("questions");

  const addQuestion = () => {
    const currentQuestions = form.getValues("questions");
    form.setValue("questions", [
      ...currentQuestions,
      { question: "", type: "text", options: [] },
    ]);
  };

  const removeQuestion = (index: number) => {
    const currentQuestions = form.getValues("questions");
    form.setValue(
      "questions",
      currentQuestions.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paciente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Perguntas</h3>
            <Button type="button" onClick={addQuestion} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Pergunta
            </Button>
          </div>

          {questions?.map((_, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium">Pergunta {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>

              <FormField
                control={form.control}
                name={`questions.${index}.question`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pergunta</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite a pergunta" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`questions.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Resposta</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="multiple_choice">
                          Múltipla Escolha
                        </SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(form.watch(`questions.${index}.type`) === "multiple_choice" ||
                form.watch(`questions.${index}.type`) === "checkbox") && (
                <FormField
                  control={form.control}
                  name={`questions.${index}.options`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opções</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite as opções separadas por vírgula"
                          onChange={(e) =>
                            field.onChange(e.target.value.split(",").map((o) => o.trim()))
                          }
                          value={(field.value || []).join(", ")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <Button type="submit">Criar Questionário</Button>
      </form>
    </Form>
  );
}
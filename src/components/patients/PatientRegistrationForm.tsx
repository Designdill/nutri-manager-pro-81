import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { AddressForm } from "./AddressForm";
import { MeasurementsForm } from "./MeasurementsForm";
import { HealthHistoryForm } from "./HealthHistoryForm";
import { LifestyleForm } from "./LifestyleForm";
import { GoalsForm } from "./GoalsForm";

interface PatientRegistrationFormProps {
  form: UseFormReturn<PatientFormValues>;
  onSubmit: (values: PatientFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function PatientRegistrationForm({ form, onSubmit, onCancel, isSubmitting = false }: PatientRegistrationFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            <TabsTrigger value="personal">Pessoal</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
            <TabsTrigger value="measurements">Medidas</TabsTrigger>
            <TabsTrigger value="health">Saúde</TabsTrigger>
            <TabsTrigger value="lifestyle">Estilo de Vida</TabsTrigger>
            <TabsTrigger value="goals">Objetivos</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <PersonalInfoForm form={form} />
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <AddressForm form={form} />
          </TabsContent>

          <TabsContent value="measurements" className="space-y-6">
            <MeasurementsForm form={form} />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <HealthHistoryForm form={form} />
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-6">
            <LifestyleForm form={form} />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <GoalsForm form={form} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <User className="mr-2 h-4 w-4" /> 
            {isSubmitting ? "Cadastrando..." : "Cadastrar Paciente"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
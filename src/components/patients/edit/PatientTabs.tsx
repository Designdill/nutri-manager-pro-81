import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "@/components/patients/types";
import { PersonalInfoForm } from "@/components/patients/PersonalInfoForm";
import { AddressForm } from "@/components/patients/AddressForm";
import { MeasurementsForm } from "@/components/patients/MeasurementsForm";
import { HealthHistoryForm } from "@/components/patients/HealthHistoryForm";
import { LifestyleForm } from "@/components/patients/LifestyleForm";
import { GoalsForm } from "@/components/patients/GoalsForm";

interface PatientTabsProps {
  form: UseFormReturn<PatientFormValues>;
}

export function PatientTabs({ form }: PatientTabsProps) {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="w-full justify-start mb-6">
        <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
        <TabsTrigger value="health">Saúde</TabsTrigger>
        <TabsTrigger value="lifestyle">Estilo de Vida</TabsTrigger>
        <TabsTrigger value="goals">Objetivos</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <div className="grid gap-6">
          <Card>
            <CardContent className="pt-6">
              <PersonalInfoForm form={form} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <AddressForm form={form} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="health">
        <div className="grid gap-6">
          <Card>
            <CardContent className="pt-6">
              <MeasurementsForm form={form} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <HealthHistoryForm form={form} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="lifestyle">
        <Card>
          <CardContent className="pt-6">
            <LifestyleForm form={form} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="goals">
        <Card>
          <CardContent className="pt-6">
            <GoalsForm form={form} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
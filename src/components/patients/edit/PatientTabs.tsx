import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "@/components/patients/types";
import { PersonalInfoForm } from "@/components/patients/PersonalInfoForm";
import { AddressForm } from "@/components/patients/AddressForm";
import { MeasurementsForm } from "@/components/patients/MeasurementsForm";
import { HealthHistoryForm } from "@/components/patients/HealthHistoryForm";
import { LifestyleForm } from "@/components/patients/LifestyleForm";
import { GoalsForm } from "@/components/patients/GoalsForm";
import { AnamnesisTab } from "./AnamnesisTab";
import { User, MapPin, Activity, Heart, Utensils, Target, CheckCircle, AlertCircle, FileCheck2 } from "lucide-react";

interface PatientTabsProps {
  form: UseFormReturn<PatientFormValues>;
}

export function PatientTabs({ form }: PatientTabsProps) {
  const [activeTab, setActiveTab] = useState("personal");
  
  const tabs = [
    { 
      value: "personal", 
      label: "Informações Pessoais", 
      icon: User,
      fields: ['full_name', 'cpf', 'email', 'phone', 'birth_date', 'gender', 'occupation']
    },
    { 
      value: "health", 
      label: "Saúde", 
      icon: Heart,
      fields: ['current_weight', 'target_weight', 'height', 'blood_type', 'medical_conditions', 'allergies', 'medications']
    },
    { 
      value: "lifestyle", 
      label: "Estilo de Vida", 
      icon: Activity,
      fields: ['exercise_frequency', 'exercise_type', 'exercise_duration', 'sleep_hours', 'sleep_quality']
    },
    { 
      value: "goals", 
      label: "Objetivos", 
      icon: Target,
      fields: ['nutritional_goals', 'treatment_expectations', 'dietary_restrictions']
    },
    { 
      value: "anamnesis", 
      label: "Anamnese", 
      icon: FileCheck2,
      fields: []
    }
  ];

  const getTabValidation = (fields: string[]) => {
    const errors = form.formState.errors;
    const values = form.getValues();
    
    const hasErrors = fields.some(field => errors[field as keyof typeof errors]);
    const hasValues = fields.some(field => {
      const value = values[field as keyof typeof values];
      return value && value !== '';
    });
    
    return { hasErrors, hasValues };
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start mb-6 h-auto p-1 bg-muted/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const validation = getTabValidation(tab.fields);
          
          return (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {validation.hasErrors && (
                <AlertCircle className="h-3 w-3 text-destructive" />
              )}
              {validation.hasValues && !validation.hasErrors && (
                <CheckCircle className="h-3 w-3 text-primary" />
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="personal" className="space-y-6 animate-fade-in">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalInfoForm form={form} />
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddressForm form={form} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="health" className="space-y-6 animate-fade-in">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Medidas e Biometria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MeasurementsForm form={form} />
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Histórico de Saúde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HealthHistoryForm form={form} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="lifestyle" className="animate-fade-in">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Estilo de Vida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LifestyleForm form={form} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="goals" className="animate-fade-in">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objetivos e Metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoalsForm form={form} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="anamnesis" className="animate-fade-in">
        <AnamnesisTab />
      </TabsContent>
    </Tabs>
  );
}
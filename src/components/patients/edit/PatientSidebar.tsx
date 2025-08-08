import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Calendar, Activity, Target } from "lucide-react";

interface PatientSidebarProps {
  patient: any;
  form: any;
}

export function PatientSidebar({ patient, form }: PatientSidebarProps) {
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: "Abaixo do peso", variant: "secondary" as const };
    if (bmi < 25) return { label: "Peso normal", variant: "default" as const };
    if (bmi < 30) return { label: "Sobrepeso", variant: "destructive" as const };
    return { label: "Obesidade", variant: "destructive" as const };
  };

  const watchedValues = form.watch(['current_weight', 'height', 'email', 'phone']);
  const currentWeight = watchedValues[0] || patient?.current_weight;
  const height = watchedValues[1] || patient?.height;
  const email = watchedValues[2] || patient?.email;
  const phone = watchedValues[3] || patient?.phone;

  const bmi = currentWeight && height ? parseFloat(calculateBMI(parseFloat(currentWeight), parseFloat(height))) : null;
  const bmiStatus = bmi ? getBMIStatus(bmi) : null;

  return (
    <div className="w-80 space-y-6">
      {/* Patient Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={patient?.avatar_url} />
              <AvatarFallback className="text-lg">
                {patient?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'P'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-lg">{patient?.full_name}</h3>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mt-1">
                <Calendar className="h-4 w-4" />
                {patient?.birth_date && (
                  <span>{calculateAge(patient.birth_date)} anos</span>
                )}
              </div>
            </div>
            
            <Badge variant="outline" className="text-xs">
              {patient?.status === 'active' ? 'Ativo' : 
               patient?.status === 'inactive' ? 'Inativo' : 'Criado'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Contato
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{email || "Não informado"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{phone || "Não informado"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Summary */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Resumo de Saúde
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Peso atual</span>
              <span className="font-medium">{currentWeight ? `${currentWeight} kg` : "—"}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Altura</span>
              <span className="font-medium">{height ? `${height} cm` : "—"}</span>
            </div>
            
            {bmi && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">IMC</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{bmi}</span>
                  <Badge variant={bmiStatus?.variant} className="text-xs">
                    {bmiStatus?.label}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Goals Summary */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Objetivos
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Meta de peso</span>
              <span className="font-medium">
                {patient?.target_weight ? `${patient.target_weight} kg` : "—"}
              </span>
            </div>
            
            {patient?.nutritional_goals && (
              <div className="mt-3">
                <span className="text-sm text-muted-foreground">Objetivos nutricionais</span>
                <p className="text-sm mt-1 line-clamp-3">{patient.nutritional_goals}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
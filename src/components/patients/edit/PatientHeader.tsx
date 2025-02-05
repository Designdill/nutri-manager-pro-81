import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

interface PatientHeaderProps {
  patientName?: string;
  onBack: () => void;
  onSave: () => void;
}

export function PatientHeader({ patientName, onBack, onSave }: PatientHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Editar Paciente</h1>
          {patientName && (
            <p className="text-muted-foreground">{patientName}</p>
          )}
        </div>
      </div>
      <Button onClick={onSave}>
        <Save className="h-4 w-4 mr-2" />
        Salvar Alterações
      </Button>
    </div>
  );
}
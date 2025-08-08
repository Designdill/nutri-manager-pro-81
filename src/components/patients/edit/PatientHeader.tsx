import React from 'react';
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Save, Keyboard } from "lucide-react";
import { SaveStatusIndicator } from "./SaveStatusIndicator";

interface PatientHeaderProps {
  patientName?: string;
  onBack: () => void;
  onSave: () => void;
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSaved?: Date;
  isLoading?: boolean;
}

export function PatientHeader({ 
  patientName, 
  onBack, 
  onSave, 
  saveStatus, 
  lastSaved,
  isLoading = false 
}: PatientHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="space-y-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      onClick={onBack} 
                      className="cursor-pointer hover:text-foreground"
                    >
                      Pacientes
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Editar</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <div>
                <h1 className="text-xl font-semibold">Editar Paciente</h1>
                {patientName && (
                  <p className="text-sm text-muted-foreground">{patientName}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} />
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={onSave} 
                disabled={isLoading}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
              
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Keyboard className="h-3 w-3" />
                Ctrl+S
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
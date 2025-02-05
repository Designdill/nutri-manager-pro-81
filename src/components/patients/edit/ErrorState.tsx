import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ErrorState() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados do paciente. Por favor, tente novamente.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
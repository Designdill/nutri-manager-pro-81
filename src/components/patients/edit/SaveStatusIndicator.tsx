import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface SaveStatusIndicatorProps {
  status: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSaved?: Date;
}

export function SaveStatusIndicator({ status, lastSaved }: SaveStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'saved':
        return {
          icon: CheckCircle,
          text: 'Salvo',
          variant: 'default' as const,
          className: 'text-primary'
        };
      case 'saving':
        return {
          icon: Clock,
          text: 'Salvando...',
          variant: 'secondary' as const,
          className: 'text-muted-foreground animate-pulse'
        };
      case 'unsaved':
        return {
          icon: AlertCircle,
          text: 'Não salvo',
          variant: 'destructive' as const,
          className: 'text-destructive'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Erro ao salvar',
          variant: 'destructive' as const,
          className: 'text-destructive'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
      {lastSaved && status === 'saved' && (
        <span className="text-xs text-muted-foreground">
          {lastSaved.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      )}
    </div>
  );
}
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ResendWelcomeEmailButtonProps {
  patientId: string;
  patientName: string;
  patientEmail: string;
  nutritionistId?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ResendWelcomeEmailButton({
  patientId,
  patientName,
  patientEmail,
  nutritionistId,
  variant = "outline",
  size = "sm",
}: ResendWelcomeEmailButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleResend = async () => {
    if (!patientEmail) {
      toast.error("Paciente não possui email cadastrado");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Resending welcome email to:", patientEmail);
      
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          patientData: {
            full_name: patientName,
            email: patientEmail,
          },
          patient_id: patientId,
          nutritionist_id: nutritionistId,
          isResend: true,
          redirectTo: `${window.location.origin}/patient`
        }
      });

      console.log("Resend response:", data, error);

      if (error) {
        console.error("Edge function error:", error);
        toast.error("Erro ao reenviar email de boas-vindas");
        return;
      }

      if (data?.error) {
        console.error("Email service error:", data.error);
        toast.error(data.message || "Erro no envio do email");
        return;
      }

      if (data?.email_sent === false) {
        toast.warning("Email não enviado - verifique a configuração do Resend");
        return;
      }

      toast.success("Email de boas-vindas reenviado com sucesso!");
      setIsOpen(false);
    } catch (err: any) {
      console.error("Error resending email:", err);
      toast.error("Erro ao reenviar email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          Reenviar Email
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reenviar Email de Boas-vindas</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja reenviar o email de boas-vindas para <strong>{patientName}</strong> ({patientEmail})?
            <br /><br />
            O paciente receberá um novo link de acesso e senha temporária.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleResend} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Confirmar Envio"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

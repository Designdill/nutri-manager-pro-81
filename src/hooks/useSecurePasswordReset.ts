import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseSecurePasswordResetReturn {
  sendPasswordReset: (email: string, userId: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useSecurePasswordReset(): UseSecurePasswordResetReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendPasswordReset = async (email: string, userId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!email || !userId) {
        throw new Error('Email and user ID are required');
      }

      // Call secure password reset edge function
      const { data, error: functionError } = await supabase.functions.invoke('secure-password-reset', {
        body: {
          email,
          user_id: userId
        }
      });

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(functionError.message || 'Failed to send password reset email');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Email enviado!",
        description: "Instruções para redefinir a senha foram enviadas para o email.",
        variant: "default"
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao enviar email de redefinição';
      setError(errorMessage);
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendPasswordReset,
    isLoading,
    error
  };
}
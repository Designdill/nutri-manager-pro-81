import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send } from "lucide-react";

export function TestEmailButton() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendTestEmail = async () => {
    if (!email) {
      toast({
        title: "Erro",
        description: "Digite um email para enviar o teste",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Enviando email de teste para:", email);
      
      const { data: result, error } = await supabase.functions.invoke(
        "send-notification-email",
        {
          body: {
            to: email,
            type: "test_email",
            data: {
              name: "Usuário",
              timestamp: new Date().toISOString(),
            },
          },
        }
      );

      if (error) {
        console.error("Erro ao enviar email de teste:", error);
        toast({
          title: "Erro no envio",
          description: `Falha: ${error.message || "Erro desconhecido"}`,
          variant: "destructive",
        });
      } else {
        console.log("Email de teste enviado com sucesso:", result);
        toast({
          title: "Email enviado!",
          description: `Email de teste enviado para ${email} com sucesso${result?.emailId ? ` (ID: ${result.emailId})` : ""}`,
        });
      }
    } catch (err: any) {
      console.error("Erro inesperado:", err);
      toast({
        title: "Erro inesperado",
        description: err.message || "Erro ao conectar com o serviço",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Testar Envio de Email
        </CardTitle>
        <CardDescription>
          Envie um email de teste para verificar se a configuração está funcionando
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-email">Email de destino</Label>
          <Input
            id="test-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleSendTestEmail}
          disabled={isLoading}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {isLoading ? "Enviando..." : "Enviar Email de Teste"}
        </Button>
      </CardContent>
    </Card>
  );
}
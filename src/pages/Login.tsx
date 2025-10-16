import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu email",
        variant: "destructive"
      });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setShowPasswordReset(false);
      setResetEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar email de recuperação",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    console.log("Login page - session state:", session?.user?.id, "isLoading:", isLoading);
    console.log("Current origin:", window.location.origin);
    
    if (session && !isLoading && !roleLoading) {
      console.log("User role:", role);
      
      // Redirect based on role
      if (role === 'patient') {
        console.log("Redirecting to patient portal");
        navigate("/patient");
      } else {
        console.log("Redirecting to nutritionist dashboard");
        navigate("/");
      }
    }
  }, [session, isLoading, roleLoading, role, navigate]);

  // Show loading state while checking authentication
  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-100">
        <div className="animate-pulse text-primary-600 text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch bg-primary-100">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-primary-500 p-8 flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-bold mb-6">Sistema de Gestão Nutricional</h1>
        <p className="text-xl text-center max-w-md">
          Gerencie seus pacientes, planos alimentares e consultas em um só lugar.
        </p>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo - only visible on mobile */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-primary-600">
              Sistema de Gestão Nutricional
            </h1>
          </div>

          {/* Auth UI Container or Password Reset Form */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            {showPasswordReset ? (
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPasswordReset(false)}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                
                <h2 className="text-2xl font-bold text-primary-600 mb-2">
                  Recuperar Senha
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Insira seu email para receber instruções de recuperação de senha.
                </p>
                
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      disabled={isResetting}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isResetting}
                  >
                    {isResetting ? "Enviando..." : "Enviar Email de Recuperação"}
                  </Button>
                </form>
              </div>
            ) : (
              <>
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#4A6741',
                          brandAccent: '#3d5434',
                          inputBackground: 'white',
                          inputBorder: '#E2E8F0',
                          inputBorderHover: '#4A6741',
                          inputBorderFocus: '#4A6741',
                        },
                        space: {
                          inputPadding: '0.75rem',
                          buttonPadding: '0.75rem',
                        },
                        radii: {
                          borderRadiusButton: '0.5rem',
                          buttonBorderRadius: '0.5rem',
                          inputBorderRadius: '0.5rem',
                        },
                      },
                    },
                    className: {
                      container: 'space-y-4',
                      button: 'w-full font-medium',
                      input: 'w-full',
                      label: 'text-sm font-medium text-gray-700',
                    },
                  }}
                  providers={[]}
                  theme="light"
                  redirectTo={window.location.origin}
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: "Email",
                        password_label: "Senha",
                        button_label: "Entrar",
                        loading_button_label: "Entrando...",
                        social_provider_text: "Entrar com {{provider}}",
                        link_text: "Já tem uma conta? Entre",
                      },
                      sign_up: {
                        email_label: "Email",
                        password_label: "Senha",
                        button_label: "Cadastrar",
                        loading_button_label: "Cadastrando...",
                        social_provider_text: "Cadastrar com {{provider}}",
                        link_text: "Não tem uma conta? Cadastre-se",
                      },
                    },
                  }}
                />
                
                <div className="mt-4 text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowPasswordReset(true)}
                    className="text-primary-600"
                  >
                    Esqueceu sua senha?
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
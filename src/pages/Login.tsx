import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Login = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const { resolvedTheme } = useTheme();

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
      const { data, error } = await supabase.functions.invoke('request-password-recovery', {
        body: {
          email: resetEmail,
          redirectTo: `${window.location.origin}/reset-password`
        }
      });

      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-foreground font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch bg-background relative">
      {/* Theme Toggle - fixed position */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary-600 p-12 flex-col justify-center items-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <div className="inline-block p-3 bg-primary-foreground/10 rounded-2xl backdrop-blur-sm mb-4">
            <svg className="w-16 h-16 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-primary-foreground tracking-tight">
            Sistema de Gestão Nutricional
          </h1>
          <p className="text-xl text-primary-foreground/90 leading-relaxed">
            Gerencie seus pacientes, planos alimentares e consultas em um só lugar com eficiência e simplicidade.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Organizado</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Intuitivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile logo - only visible on mobile */}
          <div className="md:hidden text-center space-y-2 mb-8">
            <div className="inline-block p-2 bg-primary/10 rounded-xl mb-3">
              <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Sistema de Gestão Nutricional
            </h1>
            <p className="text-sm text-muted-foreground">
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Auth UI Container or Password Reset Form */}
          <div className="bg-card p-8 rounded-2xl shadow-card border border-border/50 backdrop-blur-sm">
            {showPasswordReset ? (
              <div className="space-y-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPasswordReset(false)}
                  className="mb-2 -ml-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Recuperar Senha
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Insira seu email para receber instruções de recuperação de senha.
                  </p>
                </div>
                
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-foreground">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      disabled={isResetting}
                      className="h-11"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isResetting}
                  >
                    {isResetting ? "Enviando..." : "Enviar Email de Recuperação"}
                  </Button>
                </form>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Bem-vindo de volta</h2>
                  <p className="text-sm text-muted-foreground">Entre com suas credenciais para acessar o sistema</p>
                </div>
                
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#4A6741',
                          brandAccent: '#3B522F',
                          inputBackground: resolvedTheme === 'dark' ? 'hsl(222 47% 15%)' : 'white',
                          inputBorder: resolvedTheme === 'dark' ? 'hsl(222 47% 20%)' : '#E5E7EB',
                          inputBorderHover: '#4A6741',
                          inputBorderFocus: '#4A6741',
                          inputText: resolvedTheme === 'dark' ? 'hsl(210 20% 98%)' : 'hsl(222 47% 11%)',
                          inputLabelText: resolvedTheme === 'dark' ? 'hsl(210 20% 98%)' : 'hsl(222 47% 11%)',
                          inputPlaceholder: resolvedTheme === 'dark' ? 'hsl(220 9% 65%)' : 'hsl(220 9% 46%)',
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
                      button: 'w-full font-medium h-11 transition-all',
                      input: 'w-full h-11',
                      label: 'text-sm font-medium text-foreground',
                      anchor: 'hidden',
                    },
                  }}
                  providers={[]}
                  theme={resolvedTheme}
                  redirectTo={window.location.origin}
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: "Email",
                        password_label: "Senha",
                        email_input_placeholder: "Seu endereço de e-mail",
                        password_input_placeholder: "Sua senha",
                        button_label: "Entrar",
                        loading_button_label: "Entrando...",
                        social_provider_text: "Entrar com {{provider}}",
                        link_text: "Já tem uma conta? Entre",
                      },
                      sign_up: {
                        email_label: "Email",
                        password_label: "Senha",
                        email_input_placeholder: "Seu endereço de e-mail",
                        password_input_placeholder: "Sua senha",
                        button_label: "Cadastrar",
                        loading_button_label: "Cadastrando...",
                        social_provider_text: "Cadastrar com {{provider}}",
                        link_text: "Não tem uma conta? Cadastre-se",
                      },
                    },
                  }}
                />
                
                <div className="mt-6 text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowPasswordReset(true)}
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Esqueceu sua senha?
                  </Button>
                </div>
              </>
            )}
          </div>
          
          <p className="text-center text-xs text-muted-foreground">
            Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
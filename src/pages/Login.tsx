import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Login page - session state:", session?.user?.id, "isLoading:", isLoading);
    console.log("Current origin:", window.location.origin);
    
    if (session && !isLoading) {
      console.log("Redirecting to home - user is authenticated");
      navigate("/");
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const handleError = (error: Error) => {
    console.error("Auth error:", error);
    toast({
      title: "Error during authentication",
      description: "Please try again or contact support if the problem persists",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
          Nutrition Management System
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4A6741',
                  brandAccent: '#3d5434',
                },
              },
            },
          }}
          providers={[]}
          theme="light"
          onError={handleError}
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
      </div>
    </div>
  );
};

export default Login;
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";

export default function Index() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Bem-vindo ao Nutri Manager Pro</h1>
            <p className="text-muted-foreground">
              Gerencie seus pacientes e consultas
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sair
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button
            className="h-32 text-lg"
            onClick={() => navigate("/patients/new")}
          >
            Novo Paciente
          </Button>
          {/* Add more dashboard cards here */}
        </div>
      </div>
    </div>
  );
}
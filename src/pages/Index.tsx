import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, ChartBar, MessageSquare } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const userRole = "nutritionist"; // TODO: Get this from user profile

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const nutritionistDashboard = (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            Pacientes ativos
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            Agendadas para hoje
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Metas Atingidas</CardTitle>
          <ChartBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            Nos últimos 30 dias
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            Não lidas
          </p>
        </CardContent>
      </Card>

      <div className="col-span-full">
        <Button
          className="w-full md:w-auto"
          onClick={() => navigate("/patients/new")}
        >
          Novo Paciente
        </Button>
      </div>
    </div>
  );

  const patientDashboard = (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progresso</CardTitle>
          <ChartBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0%</div>
          <p className="text-xs text-muted-foreground">
            Meta atingida
          </p>
        </CardContent>
      </Card>
      {/* Add more patient-specific cards here */}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              {userRole === "nutritionist" 
                ? "Bem-vindo ao Nutri Manager Pro" 
                : "Meu Painel Nutricional"}
            </h1>
            <p className="text-muted-foreground">
              {userRole === "nutritionist"
                ? "Gerencie seus pacientes e consultas"
                : "Acompanhe seu progresso e plano alimentar"}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sair
          </Button>
        </div>
        {userRole === "nutritionist" ? nutritionistDashboard : patientDashboard}
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Users,
  Calendar,
  ChartBar,
  MessageSquare,
  UserPlus,
  CalendarPlus,
  Bell,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Index() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const userRole = "nutritionist"; // TODO: Get this from user profile

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const currentDateTime = format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR });

  // Sample data for charts
  const progressData = [
    { month: "Jan", patients: 4 },
    { month: "Fev", patients: 6 },
    { month: "Mar", patients: 8 },
    { month: "Abr", patients: 10 },
  ];

  const consultationData = [
    { name: "Segunda", value: 5 },
    { name: "Terça", value: 7 },
    { name: "Quarta", value: 4 },
    { name: "Quinta", value: 6 },
    { name: "Sexta", value: 8 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const upcomingAppointments = [
    {
      patient: "Maria Silva",
      date: "02/01/2025",
      time: "14:00",
    },
    {
      patient: "João Santos",
      date: "02/01/2025",
      time: "15:30",
    },
  ];

  const recentNotifications = [
    {
      title: "Nova mensagem",
      message: "Você recebeu uma mensagem de Maria Silva",
      time: "10 minutos atrás",
    },
    {
      title: "Consulta confirmada",
      message: "João Santos confirmou a consulta de amanhã",
      time: "30 minutos atrás",
    },
  ];

  const nutritionistDashboard = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bem-vindo ao Nutri Manager Pro</h1>
          <p className="text-muted-foreground mt-1">Data e Hora Atual: {currentDateTime}</p>
        </div>
        <Button onClick={handleSignOut} variant="outline">
          Sair
        </Button>
      </div>

      {/* Main Stats */}
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
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          size="lg"
          className="w-full md:w-auto"
          onClick={() => navigate("/patients/new")}
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Novo Paciente
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full md:w-auto"
          onClick={() => navigate("/appointments/new")}
        >
          <CalendarPlus className="mr-2 h-5 w-5" />
          Nova Consulta
        </Button>
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Progresso dos Pacientes</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="patients" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>Consultas por Semana</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={consultationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {consultationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.date} às {appointment.time}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Notificações Recentes</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification, index) => (
                <div key={index} className="flex items-start space-x-4 border-b pb-2">
                  <Bell className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
        {userRole === "nutritionist" ? nutritionistDashboard : patientDashboard}
      </div>
    </div>
  );
}
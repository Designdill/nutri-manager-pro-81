import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, MessageSquare, Utensils } from 'lucide-react';
import { useAuth } from '@/App';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<any>(null);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    activeMealPlans: 0,
    pendingQuestionnaires: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!session?.user?.email) return;

      const { data: patient } = await supabase
        .from('patients')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (patient) {
        setPatientData(patient);

        // Fetch stats
        const [appointments, mealPlans, questionnaires, messages] = await Promise.all([
          supabase
            .from('appointments')
            .select('id')
            .eq('patient_id', patient.id)
            .eq('status', 'confirmed')
            .gte('scheduled_at', new Date().toISOString()),
          supabase
            .from('meal_plans')
            .select('id')
            .eq('patient_id', patient.id),
          supabase
            .from('questionnaires')
            .select('id')
            .eq('patient_id', patient.id)
            .eq('status', 'pending'),
          supabase
            .from('messages')
            .select('id')
            .eq('recipient_id', session.user.id)
            .eq('read', false),
        ]);

        setStats({
          upcomingAppointments: appointments.data?.length || 0,
          activeMealPlans: mealPlans.data?.length || 0,
          pendingQuestionnaires: questionnaires.data?.length || 0,
          unreadMessages: messages.data?.length || 0,
        });
      }
    };

    fetchPatientData();
  }, [session]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Olá, {patientData?.full_name}!</h1>
          <p className="text-muted-foreground">Bem-vindo à sua área do paciente</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/patient/appointments')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Consultas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
              <p className="text-xs text-muted-foreground">consultas agendadas</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/patient/meal-plans')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planos Alimentares</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMealPlans}</div>
              <p className="text-xs text-muted-foreground">planos ativos</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/patient/questionnaires')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questionários</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingQuestionnaires}</div>
              <p className="text-xs text-muted-foreground">para responder</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/patient/messages')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadMessages}</div>
              <p className="text-xs text-muted-foreground">não lidas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Meus Dados</CardTitle>
              <CardDescription>Informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Email:</span> {patientData?.email}
              </div>
              <div>
                <span className="font-medium">Telefone:</span> {patientData?.phone || 'Não informado'}
              </div>
              <div>
                <span className="font-medium">Peso Atual:</span> {patientData?.current_weight ? `${patientData.current_weight} kg` : 'Não informado'}
              </div>
              <div>
                <span className="font-medium">Objetivo:</span> {patientData?.target_weight ? `${patientData.target_weight} kg` : 'Não definido'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Ações</CardTitle>
              <CardDescription>O que você pode fazer agora</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.pendingQuestionnaires > 0 && (
                <div className="p-2 bg-primary/10 rounded">
                  ✓ Responder {stats.pendingQuestionnaires} questionário(s) pendente(s)
                </div>
              )}
              {stats.unreadMessages > 0 && (
                <div className="p-2 bg-primary/10 rounded">
                  ✓ Ler {stats.unreadMessages} mensagem(ns) nova(s)
                </div>
              )}
              {stats.upcomingAppointments === 0 && (
                <div className="p-2 bg-muted rounded">
                  Nenhuma consulta agendada no momento
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

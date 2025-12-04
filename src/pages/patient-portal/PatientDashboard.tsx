import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, MessageSquare, Utensils, TrendingUp, ClipboardList } from 'lucide-react';
import { useAuth } from '@/App';
import { useNavigate } from 'react-router-dom';
import { EvolutionChart } from './components/EvolutionChart';
import { ConsultationHistory } from './components/ConsultationHistory';
import { GoalsProgress } from './components/GoalsProgress';
import { PatientPhotoGallery } from './components/PatientPhotoGallery';
import { NextAppointmentCard } from './components/NextAppointmentCard';
import { HealthSummary } from './components/HealthSummary';

export default function PatientDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [nextAppointment, setNextAppointment] = useState<any>(null);
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

        // Fetch all data in parallel
        const [
          consultationsResult,
          photosResult,
          appointmentsResult,
          mealPlansResult,
          questionnairesResult,
          messagesResult
        ] = await Promise.all([
          supabase
            .from('consultations')
            .select('*')
            .eq('patient_id', patient.id)
            .order('consultation_date', { ascending: true }),
          supabase
            .from('patient_photos')
            .select('*')
            .eq('patient_id', patient.id)
            .order('taken_at', { ascending: false }),
          supabase
            .from('appointments')
            .select('*')
            .eq('patient_id', patient.id)
            .eq('status', 'confirmed')
            .gte('scheduled_at', new Date().toISOString())
            .order('scheduled_at', { ascending: true }),
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

        if (consultationsResult.data) {
          setConsultations(consultationsResult.data);
        }

        if (photosResult.data) {
          setPhotos(photosResult.data);
        }

        if (appointmentsResult.data && appointmentsResult.data.length > 0) {
          setNextAppointment(appointmentsResult.data[0]);
        }

        setStats({
          upcomingAppointments: appointmentsResult.data?.length || 0,
          activeMealPlans: mealPlansResult.data?.length || 0,
          pendingQuestionnaires: questionnairesResult.data?.length || 0,
          unreadMessages: messagesResult.data?.length || 0,
        });
      }
    };

    fetchPatientData();
  }, [session]);

  const getLatestWeight = () => {
    if (consultations.length === 0) return patientData?.current_weight || null;
    return consultations[consultations.length - 1].weight;
  };

  const getInitialWeight = () => {
    if (consultations.length === 0) return patientData?.current_weight || null;
    return consultations[0].weight;
  };

  const getWeightProgress = () => {
    if (consultations.length < 2) return '-';
    const first = Number(consultations[0].weight);
    const last = Number(consultations[consultations.length - 1].weight);
    const diff = first - last;
    return `${diff > 0 ? '-' : '+'}${Math.abs(diff).toFixed(1)} kg`;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
          <h1 className="text-3xl font-bold">Olá, {patientData?.full_name}!</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso e mantenha-se motivado(a)</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
            onClick={() => navigate('/patient/appointments')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Consultas</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
              <p className="text-xs text-muted-foreground">consultas agendadas</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
            onClick={() => navigate('/patient/meal-plans')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planos Alimentares</CardTitle>
              <Utensils className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMealPlans}</div>
              <p className="text-xs text-muted-foreground">planos ativos</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
            onClick={() => navigate('/patient/questionnaires')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questionários</CardTitle>
              <ClipboardList className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingQuestionnaires}</div>
              <p className="text-xs text-muted-foreground">pendentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getLatestWeight() ? `${getLatestWeight()} kg` : '-'}</div>
              <p className="text-xs text-muted-foreground">última medição</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso Total</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getWeightProgress()}</div>
              <p className="text-xs text-muted-foreground">desde o início</p>
            </CardContent>
          </Card>
        </div>

        {/* Next Appointment and Goals Progress */}
        <div className="grid gap-4 md:grid-cols-2">
          <NextAppointmentCard appointment={nextAppointment} />
          <GoalsProgress 
            currentWeight={getLatestWeight()}
            targetWeight={patientData?.target_weight}
            initialWeight={getInitialWeight()}
          />
        </div>

        {/* Evolution Chart */}
        {consultations.length > 0 && (
          <EvolutionChart consultations={consultations} />
        )}

        {/* Health Summary and Photos */}
        <div className="grid gap-4 md:grid-cols-2">
          <HealthSummary patientData={patientData} />
          <PatientPhotoGallery photos={photos} />
        </div>

        {/* My Data and Consultation History */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Meus Dados</CardTitle>
              <CardDescription>Informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{patientData?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Telefone</span>
                <span className="font-medium">{patientData?.phone || 'Não informado'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Peso Atual</span>
                <span className="font-medium">{getLatestWeight() ? `${getLatestWeight()} kg` : '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Objetivo</span>
                <span className="font-medium">{patientData?.target_weight ? `${patientData.target_weight} kg` : 'Não definido'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Altura</span>
                <span className="font-medium">{patientData?.height ? `${patientData.height} cm` : 'Não informado'}</span>
              </div>
            </CardContent>
          </Card>

          <ConsultationHistory consultations={consultations.slice(-3)} />
        </div>

        {/* Actions Card */}
        {(stats.pendingQuestionnaires > 0 || stats.unreadMessages > 0) && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Ações Pendentes</CardTitle>
              <CardDescription>O que você pode fazer agora</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.pendingQuestionnaires > 0 && (
                <div 
                  className="p-3 bg-background rounded-lg cursor-pointer hover:bg-muted transition-colors flex items-center gap-3"
                  onClick={() => navigate('/patient/questionnaires')}
                >
                  <ClipboardList className="h-5 w-5 text-violet-500" />
                  <span>Responder {stats.pendingQuestionnaires} questionário(s) pendente(s)</span>
                </div>
              )}
              {stats.unreadMessages > 0 && (
                <div 
                  className="p-3 bg-background rounded-lg cursor-pointer hover:bg-muted transition-colors flex items-center gap-3"
                  onClick={() => navigate('/messages')}
                >
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span>Ler {stats.unreadMessages} mensagem(ns) nova(s)</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/App';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PatientAppointments() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!session?.user?.email) return;

      const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (patient) {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', patient.id)
          .order('scheduled_at', { ascending: true });

        if (!error && data) {
          setAppointments(data);
        }
      }
      setIsLoading(false);
    };

    fetchAppointments();
  }, [session]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      confirmed: { variant: 'default', label: 'Confirmada' },
      pending: { variant: 'secondary', label: 'Pendente' },
      completed: { variant: 'outline', label: 'Concluída' },
      cancelled: { variant: 'destructive', label: 'Cancelada' },
    };
    return variants[status] || variants.pending;
  };

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/patient')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Minhas Consultas</h1>
            <p className="text-muted-foreground">Acompanhe suas consultas agendadas</p>
          </div>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Você não tem consultas agendadas</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {format(new Date(appointment.scheduled_at), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    </CardTitle>
                    <Badge {...getStatusBadge(appointment.status)}>
                      {getStatusBadge(appointment.status).label}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {format(new Date(appointment.scheduled_at), 'HH:mm')}
                  </CardDescription>
                </CardHeader>
                {appointment.notes && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

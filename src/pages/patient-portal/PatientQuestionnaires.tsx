import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText } from 'lucide-react';
import { useAuth } from '@/App';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PatientQuestionnaires() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      if (!session?.user?.email) return;

      const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (patient) {
        const { data, error } = await supabase
          .from('questionnaires')
          .select('*')
          .eq('patient_id', patient.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setQuestionnaires(data);
        }
      }
      setIsLoading(false);
    };

    fetchQuestionnaires();
  }, [session]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: { variant: 'default', label: 'Concluído' },
      pending: { variant: 'secondary', label: 'Pendente' },
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
            <h1 className="text-3xl font-bold">Meus Questionários</h1>
            <p className="text-muted-foreground">Questionários recebidos do seu nutricionista</p>
          </div>
        </div>

        {questionnaires.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Você não tem questionários no momento</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questionnaires.map((questionnaire) => (
              <Card key={questionnaire.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Questionário Nutricional
                    </CardTitle>
                    <Badge {...getStatusBadge(questionnaire.status)}>
                      {getStatusBadge(questionnaire.status).label}
                    </Badge>
                  </div>
                  <CardDescription>
                    Enviado em {format(new Date(questionnaire.sent_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {questionnaire.status === 'pending' ? (
                    <p className="text-sm text-muted-foreground mb-4">
                      Este questionário está aguardando sua resposta
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">
                      Completado em {format(new Date(questionnaire.completed_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

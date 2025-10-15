import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Utensils } from 'lucide-react';
import { useAuth } from '@/App';
import { useNavigate } from 'react-router-dom';

export default function PatientMealPlans() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMealPlans = async () => {
      if (!session?.user?.email) return;

      const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (patient) {
        const { data, error } = await supabase
          .from('meal_plans')
          .select('*')
          .eq('patient_id', patient.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setMealPlans(data);
        }
      }
      setIsLoading(false);
    };

    fetchMealPlans();
  }, [session]);

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
            <h1 className="text-3xl font-bold">Meus Planos Alimentares</h1>
            <p className="text-muted-foreground">Seus planos nutricionais personalizados</p>
          </div>
        </div>

        {mealPlans.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Você ainda não tem planos alimentares</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {mealPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  {plan.description && (
                    <CardDescription>{plan.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {plan.breakfast && (
                      <AccordionItem value="breakfast">
                        <AccordionTrigger>Café da Manhã</AccordionTrigger>
                        <AccordionContent className="whitespace-pre-wrap">
                          {plan.breakfast}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    {plan.morning_snack && (
                      <AccordionItem value="morning_snack">
                        <AccordionTrigger>Lanche da Manhã</AccordionTrigger>
                        <AccordionContent className="whitespace-pre-wrap">
                          {plan.morning_snack}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    {plan.lunch && (
                      <AccordionItem value="lunch">
                        <AccordionTrigger>Almoço</AccordionTrigger>
                        <AccordionContent className="whitespace-pre-wrap">
                          {plan.lunch}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    {plan.afternoon_snack && (
                      <AccordionItem value="afternoon_snack">
                        <AccordionTrigger>Lanche da Tarde</AccordionTrigger>
                        <AccordionContent className="whitespace-pre-wrap">
                          {plan.afternoon_snack}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    {plan.dinner && (
                      <AccordionItem value="dinner">
                        <AccordionTrigger>Jantar</AccordionTrigger>
                        <AccordionContent className="whitespace-pre-wrap">
                          {plan.dinner}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    {plan.evening_snack && (
                      <AccordionItem value="evening_snack">
                        <AccordionTrigger>Ceia</AccordionTrigger>
                        <AccordionContent className="whitespace-pre-wrap">
                          {plan.evening_snack}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

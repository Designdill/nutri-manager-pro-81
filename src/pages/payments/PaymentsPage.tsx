import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

type Patient = Tables<'patients'> & {
  profiles: Tables<'profiles'>;
};

export default function PaymentsPage() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);

  const { data: patientData, error } = useQuery({
    queryKey: ['patient'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          profiles:nutritionist_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load patient data',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <Card className="p-4">
        {/* Add your payment-related content here */}
        <p>Payment functionality coming soon...</p>
      </Card>
    </div>
  );
}
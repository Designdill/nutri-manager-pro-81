import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PatientAlert {
  id: string;
  nutritionist_id: string;
  patient_id: string;
  alert_type: 'inactive_patient' | 'weight_gain' | 'weight_loss' | 'low_adherence' | 'missed_appointment' | 'no_recent_consultation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  metadata: Record<string, any>;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
  updated_at: string;
  patient?: {
    full_name: string;
  };
}

export function usePatientAlerts() {
  const [alerts, setAlerts] = useState<PatientAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const fetchAlerts = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('patient_alerts')
        .select(`
          *,
          patient:patients(full_name)
        `)
        .eq('nutritionist_id', user.id)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAlerts((data || []) as unknown as PatientAlert[]);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateAlerts = useCallback(async () => {
    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para gerar alertas.',
          variant: 'destructive'
        });
        return;
      }

      const response = await supabase.functions.invoke('generate-patient-alerts', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) throw response.error;

      const result = response.data;
      
      toast({
        title: 'Alertas Gerados',
        description: `${result.alertsGenerated} novos alertas identificados de ${result.totalAnalyzed} pacientes.`
      });

      await fetchAlerts();
    } catch (error: any) {
      console.error('Error generating alerts:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar os alertas.',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  }, [fetchAlerts, toast]);

  const markAsRead = useCallback(async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('patient_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
      
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, is_read: true } : a
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  }, []);

  const dismissAlert = useCallback(async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('patient_alerts')
        .update({ is_dismissed: true })
        .eq('id', alertId);

      if (error) throw error;
      
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      
      toast({
        title: 'Alerta dispensado',
        description: 'O alerta foi removido da lista.'
      });
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  }, [toast]);

  const markAllAsRead = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('patient_alerts')
        .update({ is_read: true })
        .eq('nutritionist_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      
      setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const unreadCount = alerts.filter(a => !a.is_read).length;

  return {
    alerts,
    loading,
    generating,
    unreadCount,
    fetchAlerts,
    generateAlerts,
    markAsRead,
    dismissAlert,
    markAllAsRead
  };
}

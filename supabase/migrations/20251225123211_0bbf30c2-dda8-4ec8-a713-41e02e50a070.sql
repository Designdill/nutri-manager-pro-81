-- 1. Habilitar RLS na tabela checkins
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

-- 2. Adicionar políticas de RLS para checkins (nutricionstas podem gerenciar checkins dos seus pacientes)
CREATE POLICY "Nutritionists can manage their patients checkins"
ON public.checkins
FOR ALL
USING (
  patient_id IN (
    SELECT id FROM public.patients 
    WHERE nutritionist_id = auth.uid()
  )
);

CREATE POLICY "Patients can manage their own checkins"
ON public.checkins
FOR ALL
USING (
  patient_id IN (
    SELECT id FROM public.patients 
    WHERE id = get_patient_id_from_auth()
  )
);

-- 3. Recriar view payment_statistics com SECURITY INVOKER (padrão seguro)
DROP VIEW IF EXISTS public.payment_statistics;

CREATE VIEW public.payment_statistics 
WITH (security_invoker = true)
AS
SELECT 
  payments.nutritionist_id,
  count(*) FILTER (WHERE (payments.status = 'pending'::payment_status)) AS pending_count,
  count(*) FILTER (WHERE (payments.status = 'overdue'::payment_status)) AS overdue_count,
  sum(payments.amount) FILTER (WHERE (payments.status = 'paid'::payment_status)) AS total_paid,
  sum(payments.amount) FILTER (WHERE ((payments.status = 'pending'::payment_status) OR (payments.status = 'overdue'::payment_status))) AS total_pending
FROM payments
GROUP BY payments.nutritionist_id;
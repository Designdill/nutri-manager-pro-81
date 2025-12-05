import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PatientData {
  id: string
  full_name: string
  nutritionist_id: string
  updated_at: string
  current_weight: number | null
}

interface ConsultationData {
  patient_id: string
  consultation_date: string
  weight: number
  meal_plan_adherence: string | null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get authorization header for user context
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const nutritionistId = user.id
    console.log(`Generating alerts for nutritionist: ${nutritionistId}`)

    // Fetch all patients for this nutritionist
    const { data: patients, error: patientsError } = await supabase
      .from('patients')
      .select('id, full_name, nutritionist_id, updated_at, current_weight')
      .eq('nutritionist_id', nutritionistId)

    if (patientsError) {
      console.error('Error fetching patients:', patientsError)
      throw patientsError
    }

    if (!patients || patients.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No patients found', alertsGenerated: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch recent consultations for analysis
    const patientIds = patients.map(p => p.id)
    const { data: consultations, error: consultError } = await supabase
      .from('consultations')
      .select('patient_id, consultation_date, weight, meal_plan_adherence')
      .in('patient_id', patientIds)
      .order('consultation_date', { ascending: false })

    if (consultError) {
      console.error('Error fetching consultations:', consultError)
    }

    const alertsToCreate: any[] = []
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    for (const patient of patients) {
      const patientConsultations = (consultations || [])
        .filter(c => c.patient_id === patient.id)
        .sort((a, b) => new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime())

      // 1. Check for inactive patients (no consultation in 60+ days)
      const lastConsultation = patientConsultations[0]
      if (!lastConsultation || new Date(lastConsultation.consultation_date) < sixtyDaysAgo) {
        const daysSinceConsultation = lastConsultation 
          ? Math.floor((now.getTime() - new Date(lastConsultation.consultation_date).getTime()) / (24 * 60 * 60 * 1000))
          : null

        alertsToCreate.push({
          nutritionist_id: nutritionistId,
          patient_id: patient.id,
          alert_type: 'inactive_patient',
          severity: daysSinceConsultation && daysSinceConsultation > 90 ? 'high' : 'medium',
          title: 'Paciente Inativo',
          message: lastConsultation 
            ? `${patient.full_name} não tem consulta há ${daysSinceConsultation} dias.`
            : `${patient.full_name} nunca realizou uma consulta.`,
          metadata: { days_inactive: daysSinceConsultation, last_consultation: lastConsultation?.consultation_date }
        })
      }

      // 2. Check for significant weight variations
      if (patientConsultations.length >= 2) {
        const recentConsultation = patientConsultations[0]
        const previousConsultation = patientConsultations[1]
        
        if (recentConsultation.weight && previousConsultation.weight) {
          const weightChange = recentConsultation.weight - previousConsultation.weight
          const percentChange = (weightChange / previousConsultation.weight) * 100

          // Alert if weight changed more than 3% between consultations
          if (Math.abs(percentChange) >= 3) {
            const isGain = weightChange > 0
            alertsToCreate.push({
              nutritionist_id: nutritionistId,
              patient_id: patient.id,
              alert_type: isGain ? 'weight_gain' : 'weight_loss',
              severity: Math.abs(percentChange) >= 5 ? 'high' : 'medium',
              title: isGain ? 'Ganho de Peso Significativo' : 'Perda de Peso Significativa',
              message: `${patient.full_name} ${isGain ? 'ganhou' : 'perdeu'} ${Math.abs(weightChange).toFixed(1)}kg (${Math.abs(percentChange).toFixed(1)}%) desde a última consulta.`,
              metadata: { 
                weight_change: weightChange, 
                percent_change: percentChange,
                previous_weight: previousConsultation.weight,
                current_weight: recentConsultation.weight
              }
            })
          }
        }
      }

      // 3. Check for low adherence
      if (lastConsultation?.meal_plan_adherence) {
        const adherence = lastConsultation.meal_plan_adherence.toLowerCase()
        if (adherence.includes('baixa') || adherence.includes('ruim') || adherence.includes('poor') || adherence.includes('low')) {
          alertsToCreate.push({
            nutritionist_id: nutritionistId,
            patient_id: patient.id,
            alert_type: 'low_adherence',
            severity: 'high',
            title: 'Baixa Adesão ao Plano',
            message: `${patient.full_name} apresentou baixa adesão ao plano alimentar na última consulta.`,
            metadata: { adherence_level: lastConsultation.meal_plan_adherence }
          })
        }
      }

      // 4. Check for no recent consultation (30-60 days)
      if (lastConsultation && new Date(lastConsultation.consultation_date) < thirtyDaysAgo && new Date(lastConsultation.consultation_date) >= sixtyDaysAgo) {
        const daysSinceConsultation = Math.floor((now.getTime() - new Date(lastConsultation.consultation_date).getTime()) / (24 * 60 * 60 * 1000))
        
        alertsToCreate.push({
          nutritionist_id: nutritionistId,
          patient_id: patient.id,
          alert_type: 'no_recent_consultation',
          severity: 'low',
          title: 'Consulta de Acompanhamento',
          message: `${patient.full_name} não tem consulta há ${daysSinceConsultation} dias. Considere agendar um retorno.`,
          metadata: { days_since_consultation: daysSinceConsultation }
        })
      }
    }

    // Remove duplicates (check existing alerts)
    const { data: existingAlerts } = await supabase
      .from('patient_alerts')
      .select('patient_id, alert_type')
      .eq('nutritionist_id', nutritionistId)
      .eq('is_dismissed', false)
      .gte('created_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())

    const existingAlertKeys = new Set(
      (existingAlerts || []).map(a => `${a.patient_id}-${a.alert_type}`)
    )

    const newAlerts = alertsToCreate.filter(
      alert => !existingAlertKeys.has(`${alert.patient_id}-${alert.alert_type}`)
    )

    // Insert new alerts
    if (newAlerts.length > 0) {
      const { error: insertError } = await supabase
        .from('patient_alerts')
        .insert(newAlerts)

      if (insertError) {
        console.error('Error inserting alerts:', insertError)
        throw insertError
      }
    }

    console.log(`Generated ${newAlerts.length} new alerts`)

    return new Response(
      JSON.stringify({ 
        message: 'Alerts generated successfully',
        alertsGenerated: newAlerts.length,
        totalAnalyzed: patients.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating alerts:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

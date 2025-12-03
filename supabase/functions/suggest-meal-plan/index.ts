import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating meal plan suggestion for patient:", patientData?.full_name);

    const systemPrompt = `Você é um nutricionista especializado em criar planos alimentares personalizados. 
Baseado nos dados do paciente, crie um plano alimentar completo e equilibrado.

IMPORTANTE: Responda APENAS com um JSON válido, sem explicações adicionais. O JSON deve seguir exatamente esta estrutura:
{
  "title": "Título do plano alimentar",
  "description": "Descrição breve do objetivo do plano",
  "breakfast": "Descrição detalhada do café da manhã com alimentos e porções",
  "morningSnack": "Descrição do lanche da manhã",
  "lunch": "Descrição detalhada do almoço",
  "afternoonSnack": "Descrição do lanche da tarde",
  "dinner": "Descrição detalhada do jantar",
  "eveningSnack": "Descrição da ceia"
}

Considere:
- Restrições alimentares e alergias do paciente
- Objetivos nutricionais (perda de peso, ganho de massa, etc.)
- Preferências alimentares
- Condições médicas
- Nível de atividade física
- Peso atual e meta`;

    const userPrompt = `Dados do paciente:
- Nome: ${patientData?.full_name || 'Não informado'}
- Peso atual: ${patientData?.current_weight ? patientData.current_weight + ' kg' : 'Não informado'}
- Peso meta: ${patientData?.target_weight ? patientData.target_weight + ' kg' : 'Não informado'}
- Altura: ${patientData?.height ? patientData.height + ' cm' : 'Não informada'}
- Gênero: ${patientData?.gender || 'Não informado'}
- Idade/Nascimento: ${patientData?.birth_date || 'Não informado'}
- Restrições alimentares: ${patientData?.dietary_restrictions || 'Nenhuma'}
- Alergias: ${patientData?.allergies || 'Nenhuma'}
- Condições médicas: ${patientData?.medical_conditions || 'Nenhuma'}
- Objetivos nutricionais: ${patientData?.nutritional_goals || 'Não informado'}
- Frequência de exercícios: ${patientData?.exercise_frequency || 'Não informada'}
- Tipo de exercício: ${patientData?.exercise_type || 'Não informado'}
- Preferências alimentares: ${patientData?.food_preferences || 'Não informadas'}
- Tipo de dieta: ${patientData?.dietary_type || 'Não informado'}
- Refeições por dia: ${patientData?.meals_per_day || '6'}

Crie um plano alimentar personalizado e detalhado para este paciente.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response received:", content?.substring(0, 200));

    // Parse the JSON response
    let mealPlan;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        mealPlan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      // Return a default structure if parsing fails
      mealPlan = {
        title: "Plano Alimentar Personalizado",
        description: content || "Plano gerado automaticamente",
        breakfast: "",
        morningSnack: "",
        lunch: "",
        afternoonSnack: "",
        dinner: "",
        eveningSnack: ""
      };
    }

    return new Response(JSON.stringify({ mealPlan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in suggest-meal-plan:", error);
    return new Response(JSON.stringify({ error: error.message || "Erro ao gerar sugestão" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

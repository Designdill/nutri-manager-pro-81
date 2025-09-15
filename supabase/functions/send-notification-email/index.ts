import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface EmailData {
  to: string;
  type: "welcome" | "registration" | "appointment_reminder" | "appointment_confirmation" | "profile_update" | "exam_results" | "follow_up_reminder" | "account_deactivation" | "integration_update";
  data: Record<string, string>;
}

const emailTemplates = {
  welcome: {
    subject: "Bem-vindo ao Nosso Sistema de Nutrição",
    html: (data: Record<string, string>) => `
      <h2>Olá, ${data.name}!</h2>
      <p>Bem-vindo ao nosso sistema de nutrição. Estamos felizes em tê-lo(a) conosco.</p>
      <p>Você pode acessar seu perfil através do link abaixo:</p>
      <p><a href="${data.loginUrl}">${data.loginUrl}</a></p>
    `,
  },
  appointment_reminder: {
    subject: "Lembrete de Consulta",
    html: (data: Record<string, string>) => `
      <h2>Olá, ${data.name}!</h2>
      <p>Lembramos que você tem uma consulta agendada para ${data.date} às ${data.time}.</p>
      <p>Por favor, não esqueça de comparecer.</p>
    `,
  },
  appointment_confirmation: {
    subject: "Consulta Agendada - Confirmação",
    html: (data: Record<string, string>) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Consulta Agendada com Sucesso!</h2>
        <p>Olá, <strong>${data.name}</strong>!</p>
        <p>Sua consulta foi agendada com sucesso. Aqui estão os detalhes:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #334155;">Detalhes da Consulta</h3>
          <p><strong>Data:</strong> ${data.date}</p>
          <p><strong>Horário:</strong> ${data.time}</p>
          <p><strong>Tipo:</strong> ${data.appointmentType === 'consulta_inicial' ? 'Consulta Inicial' : 
                                  data.appointmentType === 'retorno' ? 'Retorno' : 
                                  data.appointmentType === 'emergencia' ? 'Emergência' : 'Telemedicina'}</p>
          ${data.notes ? `<p><strong>Observações:</strong> ${data.notes}</p>` : ''}
        </div>
        
        <p>Por favor, chegue com 10 minutos de antecedência.</p>
        <p>Em caso de dúvidas ou necessidade de reagendar, entre em contato conosco.</p>
        
        <p>Atenciosamente,<br>
        <strong>Equipe de Nutrição</strong></p>
      </div>
    `,
  },
  profile_update: {
    subject: "Atualização de Perfil",
    html: (data: Record<string, string>) => `
      <h2>Olá, ${data.name}!</h2>
      <p>Seu perfil foi atualizado com sucesso.</p>
      <p>Confira as novas informações no seu perfil.</p>
    `,
  },
  exam_results: {
    subject: "Resultado de Exame Disponível",
    html: (data: Record<string, string>) => `
      <h2>Olá, ${data.name}!</h2>
      <p>Seus resultados de exame estão disponíveis.</p>
      <p>Por favor, faça login no sistema para visualizá-los.</p>
    `,
  },
  follow_up_reminder: {
    subject: "Lembrete de Reconsulta",
    html: (data: Record<string, string>) => `
      <h2>Olá, ${data.name}!</h2>
      <p>Está na hora da sua reconsulta.</p>
      <p>Agende sua próxima consulta para continuar seu acompanhamento nutricional.</p>
    `,
  },
  account_deactivation: {
    subject: "Conta Desativada",
    html: (data: Record<string, string>) => `
      <h2>Olá, ${data.name}!</h2>
      <p>Sua conta foi desativada temporariamente.</p>
      <p>Se desejar reativá-la, por favor, entre em contato conosco.</p>
    `,
  },
  integration_update: {
    subject: "Integração com Google Calendar Ativada",
    html: (data: Record<string, string>) => `
      <h2>Olá, ${data.name}!</h2>
      <p>Sua integração com o Google Calendar foi ativada com sucesso.</p>
      <p>Suas consultas serão sincronizadas automaticamente.</p>
    `,
  },
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // For external calls or service functions, we can optionally verify auth
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError) {
        console.log("Auth verification failed, proceeding without user context");
      }
    }

    const { to, type, data }: EmailData = await req.json();

    if (!to || !type || !data) {
      throw new Error("Missing required fields");
    }

    const template = emailTemplates[type];
    if (!template) {
      throw new Error("Invalid email type");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sistema Nutricional <onboarding@resend.dev>",
        to: [to],
        subject: template.subject,
        html: template.html(data),
      }),
    });

    if (!emailResponse.ok) {
      throw new Error("Failed to send email");
    }

    // Create notification record - supabase client already created above
    
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: data.userId,
        type,
        title: template.subject,
        message: `Email enviado para ${to}`,
      });

    if (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);

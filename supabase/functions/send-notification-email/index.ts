import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

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
  type: "welcome" | "registration" | "appointment_reminder" | "appointment_confirmation" | "appointment_reschedule" | "appointment_cancellation" | "questionnaire_sent" | "profile_update" | "exam_results" | "follow_up_reminder" | "account_deactivation" | "integration_update" | "test_email";
  data: Record<string, string>;
  from?: string;
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
  appointment_reschedule: {
    subject: "Consulta Reagendada",
    html: (data: Record<string, string>) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Consulta Reagendada</h2>
        <p>Olá, <strong>${data.name}</strong>!</p>
        <p>Sua consulta foi reagendada com sucesso.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #334155;">Nova Data e Horário</h3>
          <p><strong>Data Anterior:</strong> ${data.date_old} às ${data.time_old}</p>
          <p><strong>Nova Data:</strong> ${data.date_new} às ${data.time_new}</p>
        </div>
        
        <p>Por favor, chegue com 10 minutos de antecedência.</p>
        <p>Em caso de dúvidas, entre em contato conosco.</p>
        
        <p>Atenciosamente,<br>
        <strong>Equipe de Nutrição</strong></p>
      </div>
    `,
  },
  appointment_cancellation: {
    subject: "Consulta Cancelada",
    html: (data: Record<string, string>) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Consulta Cancelada</h2>
        <p>Olá, <strong>${data.name}</strong>!</p>
        <p>Sua consulta foi cancelada.</p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3 style="margin-top: 0; color: #991b1b;">Detalhes</h3>
          <p><strong>Data:</strong> ${data.date} às ${data.time}</p>
          ${data.reason ? `<p><strong>Motivo:</strong> ${data.reason}</p>` : ''}
        </div>
        
        <p>Para reagendar sua consulta, entre em contato conosco.</p>
        
        <p>Atenciosamente,<br>
        <strong>Equipe de Nutrição</strong></p>
      </div>
    `,
  },
  questionnaire_sent: {
    subject: "Novo Questionário Disponível",
    html: (data: Record<string, string>) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Novo Questionário</h2>
        <p>Olá, <strong>${data.name}</strong>!</p>
        <p>Enviamos um questionário para você responder.</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <p>Por favor, responda o questionário o mais breve possível para que possamos continuar seu acompanhamento nutricional.</p>
          <p>Acesse o sistema para visualizar e responder o questionário.</p>
        </div>
        
        <p>Atenciosamente,<br>
        <strong>Equipe de Nutrição</strong></p>
      </div>
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
  test_email: {
    subject: "Email de Teste - Sistema Funcionando",
    html: (data: Record<string, string>) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Email de Teste</h2>
        <p>Este é um email de teste para verificar se o sistema está funcionando corretamente.</p>
        <p>Enviado em: ${new Date().toLocaleString('pt-BR')}</p>
        <p>Status: ✅ Sucesso</p>
      </div>
    `,
  },
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY não configurada");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const resend = new Resend(RESEND_API_KEY);
    
    console.log("Processando requisição de email...");

    const { to, type, data, from }: EmailData = await req.json();
    console.log("Dados recebidos:", { to, type, dataKeys: Object.keys(data || {}) });

    if (!to || !type || !data) {
      throw new Error("Campos obrigatórios: to, type, data");
    }

    const template = emailTemplates[type];
    if (!template) {
      throw new Error(`Tipo de email inválido: ${type}`);
    }

    const emailFrom = from || "Sistema Nutricional <onboarding@resend.dev>";
    console.log("Enviando email de:", emailFrom, "para:", to);

    const emailResponse = await resend.emails.send({
      from: emailFrom,
      to: [to],
      subject: template.subject,
      html: template.html(data),
    });

    console.log("Resposta do Resend:", emailResponse);

    if (emailResponse.error) {
      console.error("Erro do Resend:", emailResponse.error);
      throw new Error(`Erro do Resend: ${emailResponse.error.message}`);
    }

    // Create notification record
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: data.userId || data.nutritionist_id,
        type,
        title: template.subject,
        message: `Email enviado para ${to}`,
      });

    if (notificationError) {
      console.error("Erro ao criar notificação:", notificationError);
    }

    console.log("Email enviado com sucesso! ID:", emailResponse.data?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        message: "Email enviado com sucesso" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Erro detalhado na função send-notification-email:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack || "Stack não disponível"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);

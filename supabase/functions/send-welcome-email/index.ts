import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");
const RESEND_FROM_NAME = Deno.env.get("RESEND_FROM_NAME") || "Nutri Manager";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Generate secure temporary password
function generateSecureToken() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// HTML sanitization to prevent XSS
function sanitizeHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Log email to database
async function logEmail(
  supabase: any,
  data: {
    patient_id?: string;
    nutritionist_id?: string;
    recipient_email: string;
    recipient_name?: string;
    email_type: string;
    status: string;
    resend_id?: string;
    error_message?: string;
    metadata?: any;
  }
) {
  try {
    const { error } = await supabase.from('email_logs').insert({
      patient_id: data.patient_id || null,
      nutritionist_id: data.nutritionist_id || null,
      recipient_email: data.recipient_email,
      recipient_name: data.recipient_name || null,
      email_type: data.email_type,
      status: data.status,
      resend_id: data.resend_id || null,
      error_message: data.error_message || null,
      metadata: data.metadata || null,
    });
    if (error) {
      console.error("Error logging email:", error);
    } else {
      console.log("Email logged successfully");
    }
  } catch (err) {
    console.error("Failed to log email:", err);
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("=== send-welcome-email: START ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Method:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    const missingVars = [];
    if (!RESEND_API_KEY) missingVars.push("RESEND_API_KEY");
    if (!SUPABASE_URL) missingVars.push("SUPABASE_URL");
    if (!SUPABASE_SERVICE_ROLE_KEY) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
    
    console.log("Environment check:", {
      RESEND_API_KEY: !!RESEND_API_KEY,
      SUPABASE_URL: !!SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
      RESEND_FROM_EMAIL: RESEND_FROM_EMAIL || "not set",
      RESEND_FROM_NAME: RESEND_FROM_NAME
    });
    
    if (missingVars.length > 0) {
      console.error("Missing environment variables:", missingVars);
      return new Response(JSON.stringify({ 
        error: "Configuração incompleta",
        details: `Variáveis faltando: ${missingVars.join(", ")}`,
        code: "CONFIG_ERROR"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Parse request
    const requestBody = await req.json();
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    const { patientData, redirectTo, nutritionist_id, patient_id, isResend } = requestBody;
    
    if (!patientData?.email || !patientData?.full_name) {
      console.error("Missing required fields");
      return new Response(JSON.stringify({ 
        error: "Dados incompletos",
        details: "Email e nome são obrigatórios",
        code: "VALIDATION_ERROR"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    const { full_name, email } = patientData;
    const sanitizedName = sanitizeHtml(full_name);
    const tempPassword = generateSecureToken();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        error: "Email inválido",
        details: "Formato de email inválido",
        code: "VALIDATION_ERROR"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Processing:", { email, name: sanitizedName, isResend: !!isResend });

    let userId: string | undefined;
    
    // Create or get user
    if (!isResend) {
      console.log("Creating new auth user...");
      const { data: authData, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        password: tempPassword,
        user_metadata: { full_name: sanitizedName, must_change_password: true }
      });

      if (createError) {
        const errorMessage = (createError.message || '').toLowerCase();
        const isExistingUser = errorMessage.includes('already') || 
                               errorMessage.includes('exists') || 
                               errorMessage.includes('registered');
        
        if (isExistingUser) {
          console.log("User already exists, fetching ID...");
          const { data: { users } } = await supabase.auth.admin.listUsers();
          const existingUser = users?.find((u: any) => u.email === email);
          userId = existingUser?.id;
        } else {
          console.error("Error creating user:", createError);
          await logEmail(supabase, {
            nutritionist_id,
            recipient_email: email,
            recipient_name: sanitizedName,
            email_type: 'welcome',
            status: 'failed',
            error_message: createError.message
          });
          return new Response(JSON.stringify({ 
            error: "Erro ao criar conta",
            details: createError.message,
            code: "AUTH_ERROR"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          });
        }
      } else {
        userId = authData.user?.id;
        console.log("Created user:", userId);
      }

      // Setup profile and role
      if (userId) {
        await supabase.from('profiles').upsert({
          id: userId,
          full_name: sanitizedName,
          role: 'patient'
        }, { onConflict: 'id' });

        await supabase.from('user_roles').upsert({
          user_id: userId,
          role: 'patient'
        }, { onConflict: 'user_id,role', ignoreDuplicates: true });
      }
    }

    // Generate magic link
    console.log("Generating magic link...");
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: redirectTo || undefined }
    } as any);

    if (linkError) {
      console.error("Magic link error:", linkError);
      await logEmail(supabase, {
        patient_id,
        nutritionist_id,
        recipient_email: email,
        recipient_name: sanitizedName,
        email_type: 'welcome',
        status: 'failed',
        error_message: linkError.message
      });
      return new Response(JSON.stringify({ 
        error: "Erro ao gerar link de acesso",
        details: linkError.message,
        code: "LINK_ERROR"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const magicLink = (linkData as any)?.properties?.action_link;
    if (!magicLink) {
      console.error("Magic link not generated");
      return new Response(JSON.stringify({ 
        error: "Link não gerado",
        details: "Não foi possível gerar o link de acesso",
        code: "LINK_ERROR"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Configure sender
    const fromEmail = RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const fromField = `${RESEND_FROM_NAME} <${fromEmail}>`;
    
    console.log("Sending email via Resend...");
    console.log("From:", fromField);
    console.log("To:", email);

    // Email HTML template
    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao Nutri Manager</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
          🥗 Nutri Manager
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
          Seu portal de saúde e nutrição
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
          Olá, ${sanitizedName}! 👋
        </h2>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Sua conta foi criada com sucesso no <strong>Nutri Manager</strong>!
        </p>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
          Acesse seu painel exclusivo para acompanhar seus planos alimentares, consultas e mensagens.
        </p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin: 0 0 25px 0; border-left: 4px solid #10b981;">
          <tr>
            <td style="padding: 20px;">
              <p style="color: #166534; font-size: 14px; margin: 0 0 8px 0;">
                <strong>🔗 Link de acesso:</strong> Clique no botão abaixo
              </p>
              <p style="color: #166534; font-size: 14px; margin: 0 0 8px 0;">
                <strong>👤 Usuário:</strong> ${email}
              </p>
              <p style="color: #166534; font-size: 14px; margin: 0;">
                <strong>🔒 Senha temporária:</strong> ${tempPassword}
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding: 10px 0 30px 0;">
              <a href="${magicLink}" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
                ✨ Acessar Minha Conta
              </a>
            </td>
          </tr>
        </table>

        <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <p style="color: #92400e; font-size: 14px; margin: 0;">
            <strong>⚠️ Importante:</strong> Por segurança, recomendamos que você troque sua senha no primeiro acesso.
          </p>
        </div>

        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
          Se o botão não funcionar, copie e cole este link no navegador:<br>
          <span style="word-break: break-all; color: #10b981; font-size: 12px;">${magicLink}</span>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; padding: 25px 30px; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
          Este link expira em 24 horas. Se você não solicitou esta conta, ignore este email.<br><br>
          © ${new Date().getFullYear()} Nutri Manager - Todos os direitos reservados
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromField,
        to: [email],
        subject: "Bem-vindo ao Nutri Manager! 🥗",
        html: emailHtml,
      }),
    });

    const responseText = await emailResponse.text();
    console.log("Resend response:", emailResponse.status, responseText);

    if (!emailResponse.ok) {
      let errorDetails = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetails = errorJson.message || errorJson.error || responseText;
      } catch (e) {}
      
      console.error("Resend API error:", errorDetails);
      
      await logEmail(supabase, {
        patient_id,
        nutritionist_id,
        recipient_email: email,
        recipient_name: sanitizedName,
        email_type: 'welcome',
        status: 'failed',
        error_message: errorDetails,
        metadata: { resend_status: emailResponse.status }
      });

      return new Response(JSON.stringify({ 
        success: true,
        user_id: userId,
        email_sent: false,
        email_error: errorDetails,
        message: "Usuário criado, mas houve problema no envio do email. Verifique a configuração do domínio no Resend.",
        code: "EMAIL_ERROR"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const emailResult = JSON.parse(responseText);
    console.log("Email sent successfully! ID:", emailResult.id);
    
    // Log successful email
    await logEmail(supabase, {
      patient_id,
      nutritionist_id,
      recipient_email: email,
      recipient_name: sanitizedName,
      email_type: 'welcome',
      status: 'sent',
      resend_id: emailResult.id,
      metadata: { temp_password_sent: true }
    });
    
    console.log("=== send-welcome-email: SUCCESS ===");
    
    return new Response(JSON.stringify({ 
      success: true,
      user_id: userId,
      email_sent: true,
      email_id: emailResult.id,
      message: "Usuário criado e email de boas-vindas enviado com sucesso!"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error: any) {
    console.error("=== CRITICAL ERROR ===");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      error: "Erro interno",
      details: error.message,
      code: "INTERNAL_ERROR"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function generateTemporaryPassword() {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientData } = await req.json();
    const { full_name, email } = patientData;

    if (!email) {
      throw new Error("Email is required");
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Generate temporary password
    const temporaryPassword = generateTemporaryPassword();

    // Create auth user with email and temporary password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
    });

    if (authError) {
      throw new Error(`Error creating auth user: ${authError.message}`);
    }

    // Send welcome email using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sistema Nutricional <onboarding@resend.dev>",
        to: [email],
        subject: "Bem-vindo ao Sistema Nutricional!",
        html: `
          <h2>Olá, ${full_name}!</h2>
          <p>Sua nutricionista cadastrou você no sistema. Aqui estão suas informações de acesso:</p>
          <ul>
            <li><strong>Usuário:</strong> ${email}</li>
            <li><strong>Senha Temporária:</strong> ${temporaryPassword}</li>
          </ul>
          <p>Por favor, acesse o sistema pelo link abaixo e altere sua senha no primeiro login:</p>
          <p><a href="${SUPABASE_URL}">${SUPABASE_URL}</a></p>
          <p>Atenciosamente,<br>Equipe do Sistema Nutricional</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error("Failed to send welcome email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
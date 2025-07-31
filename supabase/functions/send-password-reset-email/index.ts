import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://rthwkkiddqvcignwrofj.supabase.co",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface EmailData {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT token for security
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Invalid or expired token");
    }

    const { email, resetLink }: EmailData = await req.json();

    console.log("Sending password reset email to:", email);
    console.log("Reset link:", resetLink);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sistema Nutricional <onboarding@resend.dev>",
        to: [email],
        subject: "Redefinição de Senha - Sistema Nutricional",
        html: `
          <h2>Redefinição de Senha</h2>
          <p>Você solicitou a redefinição de sua senha.</p>
          <p>Clique no link abaixo para criar uma nova senha:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p>Se você não solicitou esta redefinição, ignore este email.</p>
          <p>Este link expira em 24 horas.</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error("Failed to send email");
    }

    // Create notification record - supabase client already created above
    
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: user.id, // Use actual user UUID instead of email for security
        type: "password_reset",
        title: "Solicitação de Redefinição de Senha",
        message: `Email de redefinição de senha enviado para ${email}`,
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
    console.error("Error in send-password-reset-email function:", error);
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
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// HTML sanitization function to prevent XSS
function sanitizeHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("request-password-recovery: Starting function execution");
    
    if (!RESEND_API_KEY) {
      console.error("request-password-recovery: RESEND_API_KEY not configured");
      throw new Error("RESEND_API_KEY not configured");
    }
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    console.log("request-password-recovery: Processing request");
    
    const { email, redirectTo } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Validate email format using our security function
    const { data: emailValid } = await supabase.rpc('validate_email_format', {
      email_input: email
    });

    if (!emailValid) {
      throw new Error("Invalid email format");
    }

    console.log("request-password-recovery: Generating recovery link for:", email);

    // Generate a recovery link
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: redirectTo || `${new URL(req.url).origin}/reset-password`
      }
    } as any);

    if (linkError) {
      console.error('Error generating recovery link:', linkError);
      throw new Error('Failed to generate recovery link');
    }

    const recoveryLink = (linkData as any)?.properties?.action_link;

    if (!recoveryLink) {
      console.error('Recovery link not available:', linkData);
      throw new Error('Recovery link not available');
    }

    console.log("request-password-recovery: Sending recovery link via Resend to:", email);

    // Send recovery email using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sistema Nutricional <onboarding@resend.dev>",
        to: [email],
        subject: "Redefinir sua senha - Sistema Nutricional",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">Redefinição de Senha</h2>
            <p>Você solicitou a redefinição de senha para sua conta no Sistema Nutricional.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="margin-top: 0; color: #007bff;">Clique no botão abaixo para redefinir sua senha:</h3>
              <p style="margin: 16px 0;">
                <a href="${recoveryLink}" style="display:inline-block;background-color:#007bff;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;">Redefinir Senha</a>
              </p>
              <p style="color:#555; font-size: 14px;">Se o botão não funcionar, copie e cole este link no navegador:<br/>
                <span style="word-break: break-all;">${recoveryLink}</span>
              </p>
            </div>
            <p>Por segurança, o link expira após 1 hora. Se não solicitou esta redefinição, ignore este email.</p>
            <p style="color: #666; font-size: 12px;">
              Se você não solicitou a redefinição de senha, pode ignorar este email com segurança.<br>
              Atenciosamente,<br>Equipe do Sistema Nutricional
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error("Failed to send recovery email");
    }

    const emailResult = await emailResponse.json();
    console.log('Password recovery email sent successfully:', emailResult);
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Password recovery email sent successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in request-password-recovery function:", error);
    
    // Sanitize error message to prevent information disclosure
    const safeErrorMessage = error.message.includes('Invalid email format') || 
                           error.message.includes('Email is required') ||
                           error.message.includes('Rate limit exceeded')
                           ? error.message 
                           : 'An error occurred while processing your request';
    
    return new Response(JSON.stringify({ error: safeErrorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: error.message.includes('Rate limit exceeded') ? 429 : 500,
    });
  }
};

serve(handler);

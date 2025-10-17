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

// Security enhancement: Generate secure token instead of password
function generateSecureToken() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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
    console.log("send-welcome-email: Starting function execution");
    
    if (!RESEND_API_KEY) {
      console.error("send-welcome-email: RESEND_API_KEY not configured");
      throw new Error("RESEND_API_KEY not configured");
    }
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check rate limit for security
    const { data: rateLimitCheck } = await supabase.rpc('check_rate_limit', {
      endpoint_name: 'send-welcome-email',
      max_requests: 10,
      window_minutes: 60
    });

    if (!rateLimitCheck) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("send-welcome-email: Processing request");
    
    const { patientData, redirectTo } = await req.json();
    const { full_name, email } = patientData;

    if (!email || !full_name) {
      throw new Error("Email and full name are required");
    }

    // Validate email format using our security function
    const { data: emailValid } = await supabase.rpc('validate_email_format', {
      email_input: email
    });

    if (!emailValid) {
      throw new Error("Invalid email format");
    }

    // Sanitize inputs to prevent XSS
    const sanitizedName = sanitizeHtml(full_name);
    
    // Generate secure token for password reset instead of plaintext password
    const tempPassword = generateSecureToken().slice(0, 12);

    // Create auth user with a temporary password
    const { data: authData, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      password: tempPassword,
      user_metadata: {
        full_name: sanitizedName,
        must_change_password: true
      }
    });

    if (createError) {
      console.error('Error creating user:', createError);
      throw new Error(`Error creating auth user: ${createError.message}`);
    }

    console.log("send-welcome-email: Generating magic link for:", email);

    // Generate a Magic Link for first access
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: redirectTo || undefined
      }
    } as any);

    if (linkError) {
      console.error('Error generating magic link:', linkError);
      throw new Error('Failed to generate magic link');
    }

    const magicLink = (linkData as any)?.properties?.action_link;

    if (!magicLink) {
      console.error('Magic link not available:', linkData);
      throw new Error('Magic link not available');
    }

    console.log("send-welcome-email: Sending magic link via Resend to:", email);

    // Send welcome email with Magic Link using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sistema Nutricional <onboarding@resend.dev>",
        to: [email],
        subject: "Bem-vindo ao Sistema Nutricional - Acesse com seu link mágico",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">Olá, ${sanitizedName}!</h2>
            <p>Sua nutricionista cadastrou você no Sistema Nutricional.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="margin-top: 0; color: #007bff;">Clique no botão abaixo para acessar com seu Link Mágico:</h3>
              <p style="margin: 16px 0;">
                <a href="${magicLink}" style="display:inline-block;background-color:#007bff;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;">Acessar minha conta</a>
              </p>
              <p style="color:#555; font-size: 14px;">Se o botão não funcionar, copie e cole este link no navegador:<br/>
                <span style="word-break: break-all;">${magicLink}</span>
              </p>
            </div>
            <p>Por segurança, o link expira após alguns minutos. Se precisar, solicite um novo link na tela de login.</p>
            <p style="color: #666; font-size: 12px;">
              Se você não solicitou esta conta, pode ignorar este email com segurança.<br>
              Atenciosamente,<br>Equipe do Sistema Nutricional
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error("Failed to send welcome email");
    }

    const emailResult = await emailResponse.json();
    console.log('Welcome magic link email sent successfully:', emailResult);
    return new Response(JSON.stringify({ 
      success: true,
      user_id: authData.user?.id,
      message: 'User created and magic link email sent successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    
    // Sanitize error message to prevent information disclosure
    const safeErrorMessage = error.message.includes('Invalid email format') || 
                           error.message.includes('Email and full name are required') ||
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
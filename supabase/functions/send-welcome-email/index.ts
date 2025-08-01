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

    // Verify JWT token for security
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Invalid or expired token");
    }

    const { patientData } = await req.json();
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
    const resetToken = generateSecureToken();

    // Create auth user without password - they'll set it via secure link
    const { data: authData, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: sanitizedName,
        reset_token: resetToken,
        token_expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }
    });

    if (createError) {
      console.error('Error creating user:', createError);
      throw new Error(`Error creating auth user: ${createError.message}`);
    }

    // Generate secure password setup link
    const setupLink = `${SUPABASE_URL}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}&type=signup`;

    // Send secure welcome email using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sistema Nutricional <onboarding@resend.dev>",
        to: [email],
        subject: "Bem-vindo ao Sistema Nutricional - Configure sua senha",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">Olá, ${sanitizedName}!</h2>
            <p>Sua nutricionista cadastrou você no Sistema Nutricional. Para começar a usar, você precisa configurar sua senha de acesso.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="margin-top: 0; color: #007bff;">Como configurar sua conta:</h3>
              <ol>
                <li>Clique no botão abaixo</li>
                <li>Crie uma senha segura (mínimo 8 caracteres)</li>
                <li>Faça login no sistema</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${setupLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Configurar Senha</a>
            </div>

            <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #ffeaa7;">
              <p style="margin: 0;"><strong>⚠️ Importante:</strong> Este link é válido por 24 horas por segurança.</p>
            </div>

            <p><strong>Seu email de acesso:</strong> ${email}</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
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
    console.log('Welcome email sent successfully:', emailResult);

    return new Response(JSON.stringify({ 
      success: true,
      user_id: authData.user?.id,
      message: 'User created and setup email sent successfully'
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
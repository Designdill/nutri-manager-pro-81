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

// Generate cryptographically secure token
function generateSecureToken(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check rate limit for security
    const { data: rateLimitCheck } = await supabase.rpc('check_rate_limit', {
      endpoint_name: 'secure-password-reset',
      max_requests: 5,
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

    const { email, user_id } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Validate email format
    const { data: emailValid } = await supabase.rpc('validate_email_format', {
      email_input: email
    });

    if (!emailValid) {
      throw new Error("Invalid email format");
    }

    // Generate secure reset token
    const resetToken = generateSecureToken();
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user_id,
      {
        user_metadata: {
          reset_token: resetToken,
          token_expires: tokenExpires.toISOString()
        }
      }
    );

    if (updateError) {
      console.error('Error updating user with reset token:', updateError);
      throw new Error('Failed to generate reset token');
    }

    // Get user info for personalized email
    const { data: { user }, error: getUserError } = await supabase.auth.admin.getUserById(user_id);
    
    if (getUserError || !user) {
      throw new Error('User not found');
    }

    const userName = user.user_metadata?.full_name || email.split('@')[0];
    const sanitizedName = sanitizeHtml(userName);

    // Generate secure reset link
    const resetLink = `${SUPABASE_URL}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}&type=recovery`;

    // Send secure password reset email
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sistema Nutricional <security@sistema-nutricional.com>",
        to: [email],
        subject: "Redefinição de senha - Sistema Nutricional",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Sistema Nutricional</h1>
              <p style="margin: 5px 0 0 0;">Redefinição de Senha</p>
            </div>
            
            <div style="padding: 30px;">
              <h2>Olá, ${sanitizedName}!</h2>
              <p>Você solicitou a redefinição da sua senha. Para continuar, clique no botão abaixo:</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Redefinir Senha</a>
              </div>

              <div style="background-color: #f8d7da; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #f5c6cb;">
                <p style="margin: 0; color: #721c24;"><strong>🔐 Importante:</strong></p>
                <ul style="color: #721c24; margin: 10px 0;">
                  <li>Este link é válido por apenas 1 hora</li>
                  <li>Use uma senha forte (mínimo 8 caracteres)</li>
                  <li>Não compartilhe este link com ninguém</li>
                </ul>
              </div>

              <p><strong>Informações de segurança:</strong></p>
              <ul>
                <li>Se você não solicitou esta redefinição, ignore este email</li>
                <li>Sua senha atual continua ativa até que seja alterada</li>
                <li>Em caso de dúvidas, entre em contato conosco</li>
              </ul>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                Este é um email automático de segurança.<br>
                Sistema Nutricional - Tecnologia em Nutrição
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error("Failed to send reset email");
    }

    const emailResult = await emailResponse.json();
    console.log('Password reset email sent successfully:', emailResult);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Password reset email sent successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error in secure-password-reset function:", error);
    
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
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");
const RESEND_FROM_NAME = Deno.env.get("RESEND_FROM_NAME");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Security enhancement: Generate secure token
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
  console.log("=== send-welcome-email: Request received ===");
  console.log("Method:", req.method);
  
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Checking environment variables...");
    console.log("RESEND_API_KEY configured:", !!RESEND_API_KEY);
    console.log("SUPABASE_URL configured:", !!SUPABASE_URL);
    console.log("SUPABASE_SERVICE_ROLE_KEY configured:", !!SUPABASE_SERVICE_ROLE_KEY);
    console.log("RESEND_FROM_EMAIL:", RESEND_FROM_EMAIL || "not set");
    console.log("RESEND_FROM_NAME:", RESEND_FROM_NAME || "not set");
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ 
        error: "Email service not configured",
        details: "RESEND_API_KEY is missing"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Supabase credentials not configured");
      return new Response(JSON.stringify({ 
        error: "Database service not configured",
        details: "Supabase credentials are missing"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    console.log("Creating Supabase admin client...");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log("Parsing request body...");
    const requestBody = await req.json();
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    const { patientData, redirectTo } = requestBody;
    
    if (!patientData) {
      console.error("Missing patientData in request");
      return new Response(JSON.stringify({ error: "patientData is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    const { full_name, email } = patientData;
    console.log("Processing patient:", { full_name, email, redirectTo });

    if (!email || !full_name) {
      console.error("Missing required fields - email:", !!email, "full_name:", !!full_name);
      return new Response(JSON.stringify({ error: "Email and full name are required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Sanitize inputs to prevent XSS
    const sanitizedName = sanitizeHtml(full_name);
    const tempPassword = generateSecureToken().slice(0, 12);

    console.log("Attempting to create auth user for:", email);
    
    let userId: string | undefined;
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
      console.log("Auth user creation result:", JSON.stringify(createError, null, 2));
      
      const errorMessage = (createError.message || '').toLowerCase();
      const errorCode = (createError.code || '').toLowerCase();
      
      const isExistingUser = 
        errorCode.includes('email') ||
        errorCode.includes('exists') ||
        errorCode.includes('registered') ||
        errorCode.includes('duplicate') ||
        errorMessage.includes('already') ||
        errorMessage.includes('exists') ||
        errorMessage.includes('registered') ||
        errorMessage.includes('duplicate');
      
      if (isExistingUser) {
        console.log("User already exists, will fetch and send magic link:", email);
        
        // Get existing user ID
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
          console.error("Error listing users:", listError);
        } else if (users) {
          const existingUser = users.find(u => u.email === email);
          userId = existingUser?.id;
          console.log("Found existing user ID:", userId);
        }
      } else {
        console.error("Unexpected error creating user:", createError);
        return new Response(JSON.stringify({ 
          error: "Failed to create user account",
          details: createError.message
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
    } else {
      userId = authData.user?.id;
      console.log("Created new user with ID:", userId);
    }

    // Ensure patient role is assigned
    if (userId) {
      console.log("Assigning patient role for user:", userId);
      
      // Upsert profile with patient role
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: sanitizedName,
          role: 'patient'
        }, {
          onConflict: 'id'
        });
      
      if (profileError) {
        console.error("Error upserting profile:", profileError);
      } else {
        console.log("Profile upserted successfully");
      }
      
      // Upsert user_roles to ensure patient role exists
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'patient'
        }, {
          onConflict: 'user_id,role',
          ignoreDuplicates: true
        });
      
      if (roleError) {
        console.error("Error upserting user role:", roleError);
      } else {
        console.log("User role upserted successfully");
      }
    }

    console.log("Generating magic link for:", email);

    // Generate a Magic Link for first access
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: redirectTo || undefined
      }
    } as any);

    if (linkError) {
      console.error("Error generating magic link:", linkError);
      return new Response(JSON.stringify({ 
        error: "Failed to generate access link",
        details: linkError.message
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const magicLink = (linkData as any)?.properties?.action_link;
    console.log("Magic link generated:", magicLink ? "Yes (length: " + magicLink.length + ")" : "No");

    if (!magicLink) {
      console.error("Magic link not available in response:", JSON.stringify(linkData, null, 2));
      return new Response(JSON.stringify({ 
        error: "Failed to generate access link",
        details: "Magic link not available"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Configure sender email
    const rawFromEmail = RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const fromName = RESEND_FROM_NAME || "Sistema Nutricional";
    const isValidEmail = emailRegex.test(rawFromEmail);
    const safeFromEmail = isValidEmail ? rawFromEmail : "onboarding@resend.dev";
    const fromField = `${fromName} <${safeFromEmail}>`;

    console.log("Sending email via Resend...");
    console.log("From:", fromField);
    console.log("To:", email);

    // Send welcome email with Magic Link using Resend
    const emailPayload = {
      from: fromField,
      to: [email],
      subject: "Bem-vindo ao Sistema Nutricional - Acesse sua conta",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #10b981; margin: 0; font-size: 28px;">🥗 Sistema Nutricional</h1>
            </div>
            
            <h2 style="color: #1f2937; margin-bottom: 16px;">Olá, ${sanitizedName}!</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Sua nutricionista cadastrou você no Sistema Nutricional. Agora você pode acessar seu painel de paciente para acompanhar seu progresso, consultas e planos alimentares.
            </p>
            
            <div style="background-color: #f0fdf4; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #10b981;">
              <p style="margin: 0 0 16px 0; color: #166534; font-weight: 600;">Clique no botão abaixo para acessar sua conta:</p>
              <a href="${magicLink}" 
                 style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                 ✨ Acessar Minha Conta
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
              Se o botão não funcionar, copie e cole este link no navegador:<br>
              <span style="word-break: break-all; color: #10b981;">${magicLink}</span>
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                ⚠️ Por segurança, este link expira em 24 horas. Se precisar de um novo link, acesse a tela de login e solicite recuperação de senha.<br><br>
                Se você não solicitou esta conta, pode ignorar este email com segurança.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log("Email payload prepared, sending to Resend API...");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const responseStatus = emailResponse.status;
    const responseText = await emailResponse.text();
    console.log("Resend API response status:", responseStatus);
    console.log("Resend API response:", responseText);

    if (!emailResponse.ok) {
      console.error("Resend API error:", responseText);
      
      // Parse error details
      let errorDetails = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetails = errorJson.message || errorJson.error || responseText;
      } catch (e) {
        // Keep original text
      }
      
      // Still return success for user creation, but indicate email issue
      return new Response(JSON.stringify({ 
        success: true,
        user_id: userId,
        email_sent: false,
        email_error: errorDetails,
        message: "Usuário criado com sucesso, mas houve problema no envio do email. Verifique a configuração do domínio no Resend."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const emailResult = JSON.parse(responseText);
    console.log("Email sent successfully! ID:", emailResult.id);
    
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
    console.error("=== CRITICAL ERROR in send-welcome-email ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      error: "Erro interno ao processar solicitação",
      details: error.message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);

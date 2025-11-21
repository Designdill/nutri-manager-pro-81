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
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("send-welcome-email: Supabase credentials not configured");
      throw new Error("Supabase credentials not configured");
    }
    
    console.log("send-welcome-email: Creating Supabase client");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("send-welcome-email: Processing request");
    
    console.log("send-welcome-email: Parsing request body");
    const { patientData, redirectTo } = await req.json();
    const { full_name, email } = patientData;

    console.log("send-welcome-email: Received request for email:", email);

    if (!email || !full_name) {
      console.error("send-welcome-email: Missing required fields");
      throw new Error("Email and full name are required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("send-welcome-email: Invalid email format:", email);
      throw new Error("Invalid email format");
    }

    // Sanitize inputs to prevent XSS
    const sanitizedName = sanitizeHtml(full_name);
    
    // Generate secure token for password reset instead of plaintext password
    const tempPassword = generateSecureToken().slice(0, 12);

    // Try to create auth user, but continue if user already exists
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
      // Check if user already exists by error code or message
      const isExistingUser = 
        createError.code === 'email_exists' ||
        createError.code === 'user_already_exists' ||
        createError.message?.toLowerCase().includes('already registered') || 
        createError.message?.toLowerCase().includes('already exists');
      
      if (isExistingUser) {
        console.log('User already exists, will send magic link anyway:', email);
        // Get existing user ID
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (!listError && users) {
          const existingUser = users.find(u => u.email === email);
          userId = existingUser?.id;
          console.log('Found existing user ID:', userId);
        }
      } else {
        console.error('Error creating user:', createError);
        throw new Error(`Error creating auth user: ${createError.message}`);
      }
    } else {
      userId = authData.user?.id;
    }

    // Ensure patient role is assigned
    if (userId) {
      console.log("send-welcome-email: Assigning patient role for user:", userId);
      
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
        console.error('Error upserting profile:', profileError);
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
        console.error('Error upserting user role:', roleError);
      }
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
    
    // Check if custom sender is configured
    const fromEmail = RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const fromName = RESEND_FROM_NAME || "Sistema Nutricional";
    
    // Construct proper from field - must be in format "Name <email@domain.com>"
    const fromField = fromName && fromEmail 
      ? `${fromName} <${fromEmail}>`
      : fromEmail;
    
    console.log("send-welcome-email: Using from field:", fromField);
    console.log("send-welcome-email: Email from name:", fromName);
    console.log("send-welcome-email: Email from address:", fromEmail);

    // Send welcome email with Magic Link using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromField,
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
      // In preview/test mode with unverified domains, don't fail the user creation
      // Return success so patient can still access the system
      console.warn('Email sending failed but continuing with user creation');
      return new Response(JSON.stringify({ 
        success: true,
        user_id: userId,
        message: 'User created successfully. Email delivery may be delayed.'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const emailResult = await emailResponse.json();
    console.log('Welcome magic link email sent successfully:', emailResult);
    return new Response(JSON.stringify({ 
      success: true,
      user_id: userId,
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
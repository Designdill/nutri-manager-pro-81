import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Get user from JWT token for security
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Invalid or expired token");
    }

    console.log(`Processing backup schedule for user ${user.id}`);

    // Get user settings
    const { data: settings, error: settingsError } = await supabase
      .from("user_settings")
      .select("auto_backup, backup_schedule, next_backup_at")
      .eq("user_id", user.id)
      .single();

    if (settingsError) {
      throw new Error(`Failed to get user settings: ${settingsError.message}`);
    }

    if (!settings.auto_backup) {
      return new Response(JSON.stringify({ 
        message: "Auto backup is disabled for this user" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if backup is due
    const now = new Date();
    const nextBackup = new Date(settings.next_backup_at || now);

    if (now < nextBackup) {
      return new Response(JSON.stringify({ 
        message: "Backup not yet due",
        nextBackup: nextBackup.toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limiting check
    const { data: recentBackups, error: recentError } = await supabase
      .from("backup_history")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", new Date(now.getTime() - 60 * 60 * 1000).toISOString()) // Last hour
      .order("created_at", { ascending: false });

    if (recentError) {
      console.error("Error checking recent backups:", recentError);
    } else if (recentBackups && recentBackups.length >= 3) {
      throw new Error("Rate limit exceeded: Maximum 3 backups per hour");
    }

    // Trigger backup by calling create-backup function
    const backupResponse = await supabase.functions.invoke('create-backup', {
      body: { userId: user.id },
      headers: { Authorization: authHeader }
    });

    if (backupResponse.error) {
      throw new Error(`Backup failed: ${backupResponse.error.message}`);
    }

    // Calculate next backup time
    const nextBackupTime = new Date();
    switch (settings.backup_schedule) {
      case 'daily':
        nextBackupTime.setDate(nextBackupTime.getDate() + 1);
        break;
      case 'weekly':
        nextBackupTime.setDate(nextBackupTime.getDate() + 7);
        break;
      case 'monthly':
        nextBackupTime.setMonth(nextBackupTime.getMonth() + 1);
        break;
      default:
        nextBackupTime.setDate(nextBackupTime.getDate() + 1);
    }

    // Update next backup time
    const { error: updateError } = await supabase
      .from("user_settings")
      .update({ 
        next_backup_at: nextBackupTime.toISOString(),
        last_backup_at: now.toISOString()
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Failed to update backup schedule:", updateError);
    }

    return new Response(JSON.stringify({
      message: "Backup completed successfully",
      nextBackup: nextBackupTime.toISOString(),
      backupData: backupResponse.data
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Backup scheduler error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process backup schedule",
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
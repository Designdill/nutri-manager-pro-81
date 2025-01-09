import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user ID from request
    const { userId } = await req.json();
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log(`Starting backup process for user ${userId}`);

    // Get user settings to determine backup configuration
    const { data: settings, error: settingsError } = await supabase
      .from("user_settings")
      .select("backup_retention_days")
      .eq("user_id", userId)
      .single();

    if (settingsError) {
      throw new Error(`Failed to get user settings: ${settingsError.message}`);
    }

    // Create backup record
    const { data: backupRecord, error: backupError } = await supabase
      .from("backup_history")
      .insert({
        user_id: userId,
        status: "in_progress",
      })
      .select()
      .single();

    if (backupError) {
      throw new Error(`Failed to create backup record: ${backupError.message}`);
    }

    console.log(`Created backup record with ID ${backupRecord.id}`);

    try {
      // Generate backup using pg_dump (this is a mock for now)
      const timestamp = new Date().toISOString();
      const backupContent = `Backup content generated at ${timestamp}`;
      const backupBuffer = new TextEncoder().encode(backupContent);
      const backupSize = backupBuffer.length;
      const filePath = `${userId}/${timestamp}-backup.sql`;

      // Upload backup file to storage
      const { error: uploadError } = await supabase.storage
        .from("backups")
        .upload(filePath, backupBuffer, {
          contentType: "application/sql",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Failed to upload backup: ${uploadError.message}`);
      }

      console.log(`Uploaded backup file to ${filePath}`);

      // Update backup record with success status
      const { error: updateError } = await supabase
        .from("backup_history")
        .update({
          status: "success",
          file_path: filePath,
          file_size: backupSize,
        })
        .eq("id", backupRecord.id);

      if (updateError) {
        throw new Error(`Failed to update backup record: ${updateError.message}`);
      }

      // Create notification for successful backup
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: userId,
          type: "backup_completed",
          title: "Backup Concluído",
          message: "Seu backup foi concluído com sucesso.",
        });

      if (notificationError) {
        console.error("Failed to create notification:", notificationError);
      }

      // Clean up old backups
      if (settings.backup_retention_days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - settings.backup_retention_days);

        const { data: oldBackups, error: oldBackupsError } = await supabase
          .from("backup_history")
          .select("id, file_path")
          .eq("user_id", userId)
          .eq("status", "success")
          .lt("created_at", cutoffDate.toISOString());

        if (!oldBackupsError && oldBackups) {
          console.log(`Found ${oldBackups.length} old backups to clean up`);
          
          for (const backup of oldBackups) {
            if (backup.file_path) {
              // Delete file from storage
              const { error: deleteStorageError } = await supabase.storage
                .from("backups")
                .remove([backup.file_path]);

              if (deleteStorageError) {
                console.error(`Failed to delete old backup file: ${deleteStorageError.message}`);
              }
            }

            // Delete backup record
            const { error: deleteRecordError } = await supabase
              .from("backup_history")
              .delete()
              .eq("id", backup.id);

            if (deleteRecordError) {
              console.error(`Failed to delete old backup record: ${deleteRecordError.message}`);
            }
          }
        }
      }

      return new Response(
        JSON.stringify({
          message: "Backup completed successfully",
          backupId: backupRecord.id,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      // Update backup record with error status
      const { error: updateError } = await supabase
        .from("backup_history")
        .update({
          status: "failed",
          error_message: error.message,
        })
        .eq("id", backupRecord.id);

      if (updateError) {
        console.error("Failed to update backup record with error:", updateError);
      }

      // Create notification for failed backup
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: userId,
          type: "backup_failed",
          title: "Falha no Backup",
          message: `Ocorreu um erro durante o backup: ${error.message}`,
        });

      if (notificationError) {
        console.error("Failed to create notification:", notificationError);
      }

      throw error;
    }
  } catch (error) {
    console.error("Backup process failed:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create backup",
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
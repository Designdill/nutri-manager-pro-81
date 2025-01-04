export interface UserSettingsTable {
  Row: {
    user_id: string;
    theme: 'light' | 'dark' | 'system';
    language: 'pt-BR' | 'en-US';
    email_notifications: boolean;
    open_food_facts_api_key: string | null;
    google_calendar_connected: boolean;
    google_fit_connected: boolean;
    apple_health_connected: boolean;
    account_active: boolean;
    created_at: string;
    updated_at: string;
    auto_dark_mode: boolean;
    dark_mode_start: string;
    dark_mode_end: string;
    custom_theme: {
      primary: string;
      secondary: string;
      accent: string;
    };
    push_notifications: boolean;
    notification_preferences: {
      appointments: boolean;
      messages: boolean;
      updates: boolean;
    };
    email_signature: string | null;
    email_filters: string[];
    auto_backup: boolean;
    backup_frequency: 'daily' | 'weekly' | 'monthly';
    cloud_storage_provider: string | null;
    cloud_storage_settings: {
      provider: string;
      credentials?: Record<string, string>;
      bucket?: string;
    } | null;
    meal_delivery_connected: boolean;
    recipe_planning_connected: boolean;
    appointment_reminder_emails: boolean;
    progress_report_emails: boolean;
    newsletter_emails: boolean;
    email_frequency: 'daily' | 'weekly' | 'monthly';
    appointment_reminder_template: string | null;
    progress_report_template: string | null;
    usda_fooddata_api_key: string | null;
    email_service: 'resend' | 'smtp';
    resend_api_key: string | null;
    smtp_host: string | null;
    smtp_port: string | null;
    smtp_user: string | null;
    smtp_password: string | null;
    smtp_secure: boolean;
  };
  Insert: Omit<UserSettingsTable['Row'], 'created_at' | 'updated_at'>;
  Update: Partial<UserSettingsTable['Insert']>;
}
export interface ThemeSettings {
  primary: string;
  secondary: string;
  accent: string;
}

export interface NotificationPreferences {
  appointments: boolean;
  messages: boolean;
  updates: boolean;
}

export interface CloudStorageSettings {
  provider: string;
  credentials?: Record<string, string>;
  bucket?: string;
}

export interface UserSettingsTable {
  Row: {
    user_id: string;
    theme: 'light' | 'dark' | 'system';
    language: 'pt-BR' | 'en-US';
    email_notifications: boolean;
    open_food_facts_api_key: string | null;
    google_calendar_connected: boolean;
    account_active: boolean;
    created_at: string;
    updated_at: string;
    auto_dark_mode: boolean;
    dark_mode_start: string;
    dark_mode_end: string;
    custom_theme: ThemeSettings;
    push_notifications: boolean;
    notification_preferences: NotificationPreferences;
    email_signature: string | null;
    email_filters: string[];
    auto_backup: boolean;
    backup_frequency: 'daily' | 'weekly' | 'monthly';
    cloud_storage_provider: string | null;
    cloud_storage_settings: CloudStorageSettings | null;
  };
  Insert: Omit<UserSettingsTable['Row'], 'created_at' | 'updated_at'>;
  Update: Partial<UserSettingsTable['Insert']>;
}
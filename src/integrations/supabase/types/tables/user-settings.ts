export interface UserSettingsTable {
  Row: {
    user_id: string;
    theme: 'light' | 'dark';
    language: 'pt-BR' | 'en-US';
    email_notifications: boolean;
    open_food_facts_api_key: string | null;
    google_calendar_connected: boolean;
    account_active: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: Omit<UserSettingsTable['Row'], 'created_at' | 'updated_at'>;
  Update: Partial<UserSettingsTable['Insert']>;
}
export interface UserSettingsTable {
  Row: {
    account_active: boolean | null;
    created_at: string;
    email_notifications: boolean | null;
    google_calendar_connected: boolean | null;
    language: string | null;
    open_food_facts_api_key: string | null;
    theme: string | null;
    updated_at: string;
    user_id: string;
  };
  Insert: {
    account_active?: boolean | null;
    created_at?: string;
    email_notifications?: boolean | null;
    google_calendar_connected?: boolean | null;
    language?: string | null;
    open_food_facts_api_key?: string | null;
    theme?: string | null;
    updated_at?: string;
    user_id: string;
  };
  Update: {
    account_active?: boolean | null;
    created_at?: string;
    email_notifications?: boolean | null;
    google_calendar_connected?: boolean | null;
    language?: string | null;
    open_food_facts_api_key?: string | null;
    theme?: string | null;
    updated_at?: string;
    user_id?: string;
  };
}

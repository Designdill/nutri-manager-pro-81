export interface ProfilesTable {
  Row: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: string;
    created_at: string;
    updated_at: string;
    phone: string | null;
  };
  Insert: {
    id: string;
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    role?: string;
    created_at?: string;
    updated_at?: string;
    phone?: string | null;
  };
  Update: {
    id?: string;
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    role?: string;
    created_at?: string;
    updated_at?: string;
    phone?: string | null;
  };
}
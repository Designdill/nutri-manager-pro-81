export interface ProfilesTable {
  Row: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: 'patient' | 'nutritionist';
    phone: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: Omit<ProfilesTable['Row'], 'created_at' | 'updated_at'>;
  Update: Partial<ProfilesTable['Insert']>;
}
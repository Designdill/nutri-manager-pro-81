export interface ProfileTable {
  Row: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: 'patient' | 'nutritionist';
    phone: string | null;
    address_street: string | null;
    address_number: string | null;
    address_complement: string | null;
    address_neighborhood: string | null;
    address_city: string | null;
    address_state: string | null;
    address_postal_code: string | null;
    address_country: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: Omit<ProfileTable['Row'], 'created_at' | 'updated_at'>;
  Update: Partial<ProfileTable['Insert']>;
}
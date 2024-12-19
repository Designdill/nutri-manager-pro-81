export interface AppointmentsTable {
  Row: {
    id: string;
    patient_id: string;
    nutritionist_id: string;
    scheduled_at: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    notes: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: Omit<AppointmentsTable['Row'], 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<AppointmentsTable['Insert']>;
}
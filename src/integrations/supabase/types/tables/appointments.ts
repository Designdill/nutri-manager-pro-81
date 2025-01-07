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
    cancellation_reason?: string | null;
    cancellation_time?: string | null;
    previous_scheduled_at?: string | null;
    feedback?: string | null;
    last_reminder_sent?: string | null;
    cancellation_policy_accepted?: boolean;
  };
  Insert: Omit<AppointmentsTable['Row'], 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<AppointmentsTable['Insert']>;
}
export interface AppointmentsTable {
  Row: {
    created_at: string;
    id: string;
    notes: string | null;
    nutritionist_id: string;
    patient_id: string;
    scheduled_at: string;
    status: "confirmed" | "pending" | "cancelled";
    updated_at: string;
  };
  Insert: {
    created_at?: string;
    id?: string;
    notes?: string | null;
    nutritionist_id: string;
    patient_id: string;
    scheduled_at: string;
    status?: "confirmed" | "pending" | "cancelled";
    updated_at?: string;
  };
  Update: {
    created_at?: string;
    id?: string;
    notes?: string | null;
    nutritionist_id?: string;
    patient_id?: string;
    scheduled_at?: string;
    status?: "confirmed" | "pending" | "cancelled";
    updated_at?: string;
  };
}
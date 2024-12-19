export interface PatientPhotosTable {
  Row: {
    id: string;
    patient_id: string | null;
    photo_url: string;
    photo_type: string;
    taken_at: string;
  };
  Insert: Omit<PatientPhotosTable['Row'], 'id'>;
  Update: Partial<PatientPhotosTable['Insert']>;
}
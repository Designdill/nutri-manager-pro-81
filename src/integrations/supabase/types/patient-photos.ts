export interface PatientPhotosTable {
  Row: {
    id: string;
    patient_id: string | null;
    photo_type: string;
    photo_url: string;
    taken_at: string;
  };
  Insert: {
    id?: string;
    patient_id?: string | null;
    photo_type: string;
    photo_url: string;
    taken_at?: string;
  };
  Update: {
    id?: string;
    patient_id?: string | null;
    photo_type?: string;
    photo_url?: string;
    taken_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "patient_photos_patient_id_fkey";
      columns: ["patient_id"];
      isOneToOne: false;
      referencedRelation: "patients";
      referencedColumns: ["id"];
    },
  ];
}

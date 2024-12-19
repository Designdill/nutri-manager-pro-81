import { 
  AppointmentsTable,
  ConsultationsTable,
  FoodsTable,
  MealPlansTable,
  MessagesTable,
  PatientPhotosTable,
  PatientsTable,
  ProfilesTable,
  UserSettingsTable 
} from './';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: AppointmentsTable;
      consultations: ConsultationsTable;
      foods: FoodsTable;
      meal_plans: MealPlansTable;
      messages: MessagesTable;
      patient_photos: PatientPhotosTable;
      patients: PatientsTable;
      profiles: ProfilesTable;
      user_settings: UserSettingsTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      appointment_status: "confirmed" | "pending" | "cancelled";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
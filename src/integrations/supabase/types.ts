export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          nutritionist_id: string
          patient_id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          nutritionist_id: string
          patient_id: string
          scheduled_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          nutritionist_id?: string
          patient_id?: string
          scheduled_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_nutritionist_id_fkey"
            columns: ["nutritionist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_photos: {
        Row: {
          id: string
          patient_id: string | null
          photo_type: string
          photo_url: string
          taken_at: string
        }
        Insert: {
          id?: string
          patient_id?: string | null
          photo_type: string
          photo_url: string
          taken_at?: string
        }
        Update: {
          id?: string
          patient_id?: string | null
          photo_type?: string
          photo_url?: string
          taken_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_photos_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          additional_notes: string | null
          allergies: string | null
          birth_date: string | null
          blood_type: string | null
          city: string | null
          complement: string | null
          cpf: string
          created_at: string
          current_weight: number | null
          dietary_restrictions: string | null
          email: string | null
          exercise_duration: string | null
          exercise_frequency: string | null
          exercise_type: string | null
          family_history: string | null
          full_name: string
          gender: string | null
          height: number | null
          id: string
          meals_per_day: number | null
          medical_conditions: string | null
          medications: string | null
          neighborhood: string | null
          number: string | null
          nutritional_goals: string | null
          nutritionist_id: string | null
          occupation: string | null
          phone: string | null
          postal_code: string | null
          sleep_hours: number | null
          sleep_quality: string | null
          state: string | null
          street: string | null
          target_weight: number | null
          treatment_expectations: string | null
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          allergies?: string | null
          birth_date?: string | null
          blood_type?: string | null
          city?: string | null
          complement?: string | null
          cpf: string
          created_at?: string
          current_weight?: number | null
          dietary_restrictions?: string | null
          email?: string | null
          exercise_duration?: string | null
          exercise_frequency?: string | null
          exercise_type?: string | null
          family_history?: string | null
          full_name: string
          gender?: string | null
          height?: number | null
          id?: string
          meals_per_day?: number | null
          medical_conditions?: string | null
          medications?: string | null
          neighborhood?: string | null
          number?: string | null
          nutritional_goals?: string | null
          nutritionist_id?: string | null
          occupation?: string | null
          phone?: string | null
          postal_code?: string | null
          sleep_hours?: number | null
          sleep_quality?: string | null
          state?: string | null
          street?: string | null
          target_weight?: number | null
          treatment_expectations?: string | null
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          allergies?: string | null
          birth_date?: string | null
          blood_type?: string | null
          city?: string | null
          complement?: string | null
          cpf?: string
          created_at?: string
          current_weight?: number | null
          dietary_restrictions?: string | null
          email?: string | null
          exercise_duration?: string | null
          exercise_frequency?: string | null
          exercise_type?: string | null
          family_history?: string | null
          full_name?: string
          gender?: string | null
          height?: number | null
          id?: string
          meals_per_day?: number | null
          medical_conditions?: string | null
          medications?: string | null
          neighborhood?: string | null
          number?: string | null
          nutritional_goals?: string | null
          nutritionist_id?: string | null
          occupation?: string | null
          phone?: string | null
          postal_code?: string | null
          sleep_hours?: number | null
          sleep_quality?: string | null
          state?: string | null
          street?: string | null
          target_weight?: number | null
          treatment_expectations?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_nutritionist_id_fkey"
            columns: ["nutritionist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      appointment_status: "confirmed" | "pending" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

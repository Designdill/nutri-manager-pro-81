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
      consultations: {
        Row: {
          bmi: number
          body_fat_percentage: number | null
          consultation_date: string
          created_at: string
          diet_related_symptoms: string | null
          id: string
          long_term_goals: string | null
          meal_plan: string | null
          meal_plan_adherence: string | null
          nutritional_interventions: string | null
          observations: string | null
          patient_id: string
          physical_activity_level: string | null
          updated_at: string
          waist_circumference: number | null
          weight: number
        }
        Insert: {
          bmi: number
          body_fat_percentage?: number | null
          consultation_date: string
          created_at?: string
          diet_related_symptoms?: string | null
          id?: string
          long_term_goals?: string | null
          meal_plan?: string | null
          meal_plan_adherence?: string | null
          nutritional_interventions?: string | null
          observations?: string | null
          patient_id: string
          physical_activity_level?: string | null
          updated_at?: string
          waist_circumference?: number | null
          weight: number
        }
        Update: {
          bmi?: number
          body_fat_percentage?: number | null
          consultation_date?: string
          created_at?: string
          diet_related_symptoms?: string | null
          id?: string
          long_term_goals?: string | null
          meal_plan?: string | null
          meal_plan_adherence?: string | null
          nutritional_interventions?: string | null
          observations?: string | null
          patient_id?: string
          physical_activity_level?: string | null
          updated_at?: string
          waist_circumference?: number | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          max_reference: number | null
          min_reference: number | null
          name: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          max_reference?: number | null
          min_reference?: number | null
          name: string
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          max_reference?: number | null
          min_reference?: number | null
          name?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      foods: {
        Row: {
          calories: number | null
          carbohydrates: number | null
          category: string
          created_at: string
          fats: number | null
          fiber: number | null
          id: string
          name: string
          proteins: number | null
          serving_size: number | null
          serving_unit: string | null
          updated_at: string
        }
        Insert: {
          calories?: number | null
          carbohydrates?: number | null
          category: string
          created_at?: string
          fats?: number | null
          fiber?: number | null
          id?: string
          name: string
          proteins?: number | null
          serving_size?: number | null
          serving_unit?: string | null
          updated_at?: string
        }
        Update: {
          calories?: number | null
          carbohydrates?: number | null
          category?: string
          created_at?: string
          fats?: number | null
          fiber?: number | null
          id?: string
          name?: string
          proteins?: number | null
          serving_size?: number | null
          serving_unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      health_app_data: {
        Row: {
          app_name: string
          created_at: string | null
          data_type: string
          id: string
          recorded_at: string | null
          user_id: string
          value: Json
        }
        Insert: {
          app_name: string
          created_at?: string | null
          data_type: string
          id?: string
          recorded_at?: string | null
          user_id: string
          value: Json
        }
        Update: {
          app_name?: string
          created_at?: string | null
          data_type?: string
          id?: string
          recorded_at?: string | null
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
      meal_plans: {
        Row: {
          afternoon_snack: string | null
          breakfast: string | null
          created_at: string
          description: string | null
          dinner: string | null
          evening_snack: string | null
          id: string
          lunch: string | null
          morning_snack: string | null
          patient_id: string
          title: string
          updated_at: string
        }
        Insert: {
          afternoon_snack?: string | null
          breakfast?: string | null
          created_at?: string
          description?: string | null
          dinner?: string | null
          evening_snack?: string | null
          id?: string
          lunch?: string | null
          morning_snack?: string | null
          patient_id: string
          title: string
          updated_at?: string
        }
        Update: {
          afternoon_snack?: string | null
          breakfast?: string | null
          created_at?: string
          description?: string | null
          dinner?: string | null
          evening_snack?: string | null
          id?: string
          lunch?: string | null
          morning_snack?: string | null
          patient_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      patient_exams: {
        Row: {
          created_at: string
          exam_date: string
          exam_type_id: string
          id: string
          notes: string | null
          patient_id: string
          status: Database["public"]["Enums"]["exam_status"]
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          exam_date: string
          exam_type_id: string
          id?: string
          notes?: string | null
          patient_id: string
          status: Database["public"]["Enums"]["exam_status"]
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          exam_date?: string
          exam_type_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          status?: Database["public"]["Enums"]["exam_status"]
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_exams_exam_type_id_fkey"
            columns: ["exam_type_id"]
            isOneToOne: false
            referencedRelation: "exam_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_exams_patient_id_fkey"
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
          dietary_type: string | null
          email: string | null
          exercise_duration: string | null
          exercise_frequency: string | null
          exercise_type: string | null
          family_history: string | null
          food_preferences: string | null
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
          surgery_history: string | null
          target_weight: number | null
          treatment_expectations: string | null
          updated_at: string
          water_intake: number | null
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
          dietary_type?: string | null
          email?: string | null
          exercise_duration?: string | null
          exercise_frequency?: string | null
          exercise_type?: string | null
          family_history?: string | null
          food_preferences?: string | null
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
          surgery_history?: string | null
          target_weight?: number | null
          treatment_expectations?: string | null
          updated_at?: string
          water_intake?: number | null
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
          dietary_type?: string | null
          email?: string | null
          exercise_duration?: string | null
          exercise_frequency?: string | null
          exercise_type?: string | null
          family_history?: string | null
          food_preferences?: string | null
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
          surgery_history?: string | null
          target_weight?: number | null
          treatment_expectations?: string | null
          updated_at?: string
          water_intake?: number | null
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
          phone: string | null
          role: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      settings_history: {
        Row: {
          changed_at: string
          id: string
          new_value: string | null
          old_value: string | null
          setting_name: string
          user_id: string
        }
        Insert: {
          changed_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          setting_name: string
          user_id: string
        }
        Update: {
          changed_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          setting_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          accessibility_settings: Json | null
          account_active: boolean | null
          apple_health_connected: boolean | null
          created_at: string
          email_notifications: boolean | null
          google_calendar_connected: boolean | null
          language: string | null
          meal_delivery_connected: boolean | null
          notification_preferences: Json | null
          open_food_facts_api_key: string | null
          recipe_planning_connected: boolean | null
          security_settings: Json | null
          theme: string | null
          updated_at: string
          usda_fooddata_api_key: string | null
          user_id: string
        }
        Insert: {
          accessibility_settings?: Json | null
          account_active?: boolean | null
          apple_health_connected?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          google_calendar_connected?: boolean | null
          language?: string | null
          meal_delivery_connected?: boolean | null
          notification_preferences?: Json | null
          open_food_facts_api_key?: string | null
          recipe_planning_connected?: boolean | null
          security_settings?: Json | null
          theme?: string | null
          updated_at?: string
          usda_fooddata_api_key?: string | null
          user_id: string
        }
        Update: {
          accessibility_settings?: Json | null
          account_active?: boolean | null
          apple_health_connected?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          google_calendar_connected?: boolean | null
          language?: string | null
          meal_delivery_connected?: boolean | null
          notification_preferences?: Json | null
          open_food_facts_api_key?: string | null
          recipe_planning_connected?: boolean | null
          security_settings?: Json | null
          theme?: string | null
          updated_at?: string
          usda_fooddata_api_key?: string | null
          user_id?: string
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
      dietary_type: "omnivoro" | "vegetariano" | "vegano" | "outro"
      exam_status: "normal" | "above_reference" | "below_reference"
      notification_type:
        | "welcome"
        | "registration"
        | "appointment_reminder"
        | "profile_update"
        | "exam_results"
        | "follow_up_reminder"
        | "account_deactivation"
        | "integration_update"
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

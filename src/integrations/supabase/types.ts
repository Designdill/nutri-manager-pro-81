export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      api_rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          request_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          request_count?: number
          user_id: string
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          request_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      appointment_changes: {
        Row: {
          appointment_id: string | null
          change_type: string
          changed_by: string | null
          created_at: string | null
          id: string
          new_time: string | null
          previous_time: string | null
          reason: string | null
        }
        Insert: {
          appointment_id?: string | null
          change_type: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_time?: string | null
          previous_time?: string | null
          reason?: string | null
        }
        Update: {
          appointment_id?: string | null
          change_type?: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_time?: string | null
          previous_time?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_changes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          cancellation_policy_accepted: boolean | null
          cancellation_reason: string | null
          cancellation_time: string | null
          created_at: string
          feedback: string | null
          id: string
          last_reminder_sent: string | null
          notes: string | null
          nutritionist_id: string
          patient_id: string
          previous_scheduled_at: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          cancellation_policy_accepted?: boolean | null
          cancellation_reason?: string | null
          cancellation_time?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          last_reminder_sent?: string | null
          notes?: string | null
          nutritionist_id: string
          patient_id: string
          previous_scheduled_at?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          cancellation_policy_accepted?: boolean | null
          cancellation_reason?: string | null
          cancellation_time?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          last_reminder_sent?: string | null
          notes?: string | null
          nutritionist_id?: string
          patient_id?: string
          previous_scheduled_at?: string | null
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
      audit_logs: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          operation: string
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          operation: string
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          operation?: string
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      backup_history: {
        Row: {
          backup_time: string | null
          created_at: string | null
          error_message: string | null
          file_path: string | null
          file_size: number | null
          id: string
          status: Database["public"]["Enums"]["backup_status"]
          user_id: string | null
        }
        Insert: {
          backup_time?: string | null
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          status: Database["public"]["Enums"]["backup_status"]
          user_id?: string | null
        }
        Update: {
          backup_time?: string | null
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          status?: Database["public"]["Enums"]["backup_status"]
          user_id?: string | null
        }
        Relationships: []
      }
      compound_formulas: {
        Row: {
          created_at: string | null
          description: string | null
          dosage: string | null
          duration: string | null
          id: string
          ingredients: Json
          instructions: string | null
          nutritionist_id: string
          patient_id: string
          prescribed_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dosage?: string | null
          duration?: string | null
          id?: string
          ingredients: Json
          instructions?: string | null
          nutritionist_id: string
          patient_id: string
          prescribed_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dosage?: string | null
          duration?: string | null
          id?: string
          ingredients?: Json
          instructions?: string | null
          nutritionist_id?: string
          patient_id?: string
          prescribed_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compound_formulas_nutritionist_id_fkey"
            columns: ["nutritionist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compound_formulas_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      configuration_profiles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          settings_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          settings_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          settings_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      export_history: {
        Row: {
          categories_exported: string[]
          created_at: string
          export_type: string
          file_format: string
          file_size: number | null
          id: string
          user_id: string
        }
        Insert: {
          categories_exported?: string[]
          created_at?: string
          export_type?: string
          file_format?: string
          file_size?: number | null
          id?: string
          user_id: string
        }
        Update: {
          categories_exported?: string[]
          created_at?: string
          export_type?: string
          file_format?: string
          file_size?: number | null
          id?: string
          user_id?: string
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
          activation_sent_at: string | null
          additional_notes: string | null
          allergies: string | null
          birth_date: string | null
          blood_type: string | null
          city: string | null
          complement: string | null
          cpf: string | null
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
          last_login: string | null
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
          status: string
          street: string | null
          surgery_history: string | null
          target_weight: number | null
          treatment_expectations: string | null
          updated_at: string
          water_intake: number | null
        }
        Insert: {
          activation_sent_at?: string | null
          additional_notes?: string | null
          allergies?: string | null
          birth_date?: string | null
          blood_type?: string | null
          city?: string | null
          complement?: string | null
          cpf?: string | null
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
          last_login?: string | null
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
          status?: string
          street?: string | null
          surgery_history?: string | null
          target_weight?: number | null
          treatment_expectations?: string | null
          updated_at?: string
          water_intake?: number | null
        }
        Update: {
          activation_sent_at?: string | null
          additional_notes?: string | null
          allergies?: string | null
          birth_date?: string | null
          blood_type?: string | null
          city?: string | null
          complement?: string | null
          cpf?: string | null
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
          last_login?: string | null
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
          status?: string
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
      payments: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          nutritionist_id: string
          paid_at: string | null
          patient_id: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          receipt_url: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          nutritionist_id: string
          paid_at?: string | null
          patient_id: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          nutritionist_id?: string
          paid_at?: string | null
          patient_id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_nutritionist_id_fkey"
            columns: ["nutritionist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_country: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_postal_code: string | null
          address_state: string | null
          address_street: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string | null
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_country?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_postal_code?: string | null
          address_state?: string | null
          address_street?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_country?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_postal_code?: string | null
          address_state?: string | null
          address_street?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      questionnaires: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          nutritionist_id: string
          patient_id: string
          responses: Json | null
          sent_at: string | null
          status: Database["public"]["Enums"]["questionnaire_status"] | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          nutritionist_id: string
          patient_id: string
          responses?: Json | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["questionnaire_status"] | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          nutritionist_id?: string
          patient_id?: string
          responses?: Json | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["questionnaire_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaires_nutritionist_id_fkey"
            columns: ["nutritionist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionnaires_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          request_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          request_count?: number
          user_id: string
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          request_count?: number
          user_id?: string
          window_start?: string
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          accessibility_settings: Json | null
          account_active: boolean | null
          apple_health_connected: boolean | null
          appointment_reminder_emails: boolean | null
          appointment_reminder_template: string | null
          auto_backup: boolean | null
          auto_dark_mode: boolean | null
          backup_frequency: string | null
          backup_retention_days: number | null
          backup_schedule: string | null
          cancellation_template: string | null
          cloud_storage_provider: string | null
          cloud_storage_settings: Json | null
          created_at: string
          custom_theme: Json | null
          dark_mode_end: string | null
          dark_mode_start: string | null
          email_filters: Json | null
          email_frequency: string | null
          email_notifications: boolean | null
          email_service: string | null
          email_signature: string | null
          google_calendar_connected: boolean | null
          google_fit_connected: boolean | null
          language: string | null
          last_backup_at: string | null
          meal_delivery_connected: boolean | null
          newsletter_emails: boolean | null
          next_backup_at: string | null
          notification_preferences: Json | null
          open_food_facts_api_key: string | null
          progress_report_emails: boolean | null
          progress_report_template: string | null
          push_notifications: boolean | null
          questionnaire_template: string | null
          recipe_planning_connected: boolean | null
          reschedule_template: string | null
          resend_api_key: string | null
          security_settings: Json | null
          sender_email: string | null
          sender_name: string | null
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: string | null
          smtp_secure: boolean | null
          smtp_user: string | null
          theme: string | null
          updated_at: string
          usda_fooddata_api_key: string | null
          user_id: string
        }
        Insert: {
          accessibility_settings?: Json | null
          account_active?: boolean | null
          apple_health_connected?: boolean | null
          appointment_reminder_emails?: boolean | null
          appointment_reminder_template?: string | null
          auto_backup?: boolean | null
          auto_dark_mode?: boolean | null
          backup_frequency?: string | null
          backup_retention_days?: number | null
          backup_schedule?: string | null
          cancellation_template?: string | null
          cloud_storage_provider?: string | null
          cloud_storage_settings?: Json | null
          created_at?: string
          custom_theme?: Json | null
          dark_mode_end?: string | null
          dark_mode_start?: string | null
          email_filters?: Json | null
          email_frequency?: string | null
          email_notifications?: boolean | null
          email_service?: string | null
          email_signature?: string | null
          google_calendar_connected?: boolean | null
          google_fit_connected?: boolean | null
          language?: string | null
          last_backup_at?: string | null
          meal_delivery_connected?: boolean | null
          newsletter_emails?: boolean | null
          next_backup_at?: string | null
          notification_preferences?: Json | null
          open_food_facts_api_key?: string | null
          progress_report_emails?: boolean | null
          progress_report_template?: string | null
          push_notifications?: boolean | null
          questionnaire_template?: string | null
          recipe_planning_connected?: boolean | null
          reschedule_template?: string | null
          resend_api_key?: string | null
          security_settings?: Json | null
          sender_email?: string | null
          sender_name?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: string | null
          smtp_secure?: boolean | null
          smtp_user?: string | null
          theme?: string | null
          updated_at?: string
          usda_fooddata_api_key?: string | null
          user_id: string
        }
        Update: {
          accessibility_settings?: Json | null
          account_active?: boolean | null
          apple_health_connected?: boolean | null
          appointment_reminder_emails?: boolean | null
          appointment_reminder_template?: string | null
          auto_backup?: boolean | null
          auto_dark_mode?: boolean | null
          backup_frequency?: string | null
          backup_retention_days?: number | null
          backup_schedule?: string | null
          cancellation_template?: string | null
          cloud_storage_provider?: string | null
          cloud_storage_settings?: Json | null
          created_at?: string
          custom_theme?: Json | null
          dark_mode_end?: string | null
          dark_mode_start?: string | null
          email_filters?: Json | null
          email_frequency?: string | null
          email_notifications?: boolean | null
          email_service?: string | null
          email_signature?: string | null
          google_calendar_connected?: boolean | null
          google_fit_connected?: boolean | null
          language?: string | null
          last_backup_at?: string | null
          meal_delivery_connected?: boolean | null
          newsletter_emails?: boolean | null
          next_backup_at?: string | null
          notification_preferences?: Json | null
          open_food_facts_api_key?: string | null
          progress_report_emails?: boolean | null
          progress_report_template?: string | null
          push_notifications?: boolean | null
          questionnaire_template?: string | null
          recipe_planning_connected?: boolean | null
          reschedule_template?: string | null
          resend_api_key?: string | null
          security_settings?: Json | null
          sender_email?: string | null
          sender_name?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: string | null
          smtp_secure?: boolean | null
          smtp_user?: string | null
          theme?: string | null
          updated_at?: string
          usda_fooddata_api_key?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      payment_statistics: {
        Row: {
          nutritionist_id: string | null
          overdue_count: number | null
          pending_count: number | null
          total_paid: number | null
          total_pending: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_nutritionist_id_fkey"
            columns: ["nutritionist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_next_backup_time: {
        Args: { last_backup: string; schedule: string }
        Returns: string
      }
      check_rate_limit: {
        Args: {
          endpoint_name: string
          max_requests?: number
          window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      decrypt_sensitive_data: {
        Args: { encrypted_data: string; encryption_key?: string }
        Returns: string
      }
      encrypt_sensitive_data: {
        Args: { encryption_key?: string; input_data: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      sanitize_html: {
        Args: { input_text: string }
        Returns: string
      }
      update_overdue_payments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_cpf: {
        Args: { cpf_input: string }
        Returns: boolean
      }
      validate_email: {
        Args: { email_input: string }
        Returns: boolean
      }
      validate_email_format: {
        Args: { email_input: string }
        Returns: boolean
      }
      validate_phone: {
        Args: { phone_input: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "nutritionist" | "patient"
      appointment_status: "confirmed" | "pending" | "cancelled"
      backup_status: "success" | "failed" | "in_progress"
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
      patient_status: "created" | "invited" | "active" | "inactive"
      payment_method: "pix" | "credit_card" | "bank_transfer" | "cash" | "other"
      payment_status: "pending" | "paid" | "overdue" | "cancelled"
      questionnaire_status: "pending" | "completed"
      user_role: "admin" | "nutritionist" | "patient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["nutritionist", "patient"],
      appointment_status: ["confirmed", "pending", "cancelled"],
      backup_status: ["success", "failed", "in_progress"],
      dietary_type: ["omnivoro", "vegetariano", "vegano", "outro"],
      exam_status: ["normal", "above_reference", "below_reference"],
      notification_type: [
        "welcome",
        "registration",
        "appointment_reminder",
        "profile_update",
        "exam_results",
        "follow_up_reminder",
        "account_deactivation",
        "integration_update",
      ],
      patient_status: ["created", "invited", "active", "inactive"],
      payment_method: ["pix", "credit_card", "bank_transfer", "cash", "other"],
      payment_status: ["pending", "paid", "overdue", "cancelled"],
      questionnaire_status: ["pending", "completed"],
      user_role: ["admin", "nutritionist", "patient"],
    },
  },
} as const

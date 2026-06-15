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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      consultations: {
        Row: {
          consultation_type: string | null
          created_at: string | null
          department: string | null
          diagnosis: string | null
          doctor_id: string | null
          id: string
          language: string | null
          patient_id: string | null
          status: string | null
          symptoms: string
          treatment: string | null
          updated_at: string | null
        }
        Insert: {
          consultation_type?: string | null
          created_at?: string | null
          department?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          id?: string
          language?: string | null
          patient_id?: string | null
          status?: string | null
          symptoms: string
          treatment?: string | null
          updated_at?: string | null
        }
        Update: {
          consultation_type?: string | null
          created_at?: string | null
          department?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          id?: string
          language?: string | null
          patient_id?: string | null
          status?: string | null
          symptoms?: string
          treatment?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "public_doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_consultations_doctor"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_consultations_doctor"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "public_doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_consultations_patient"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available: boolean | null
          created_at: string | null
          hospital: string | null
          id: string
          name: string
          phone: string | null
          specialization: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          hospital?: string | null
          id?: string
          name: string
          phone?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          hospital?: string | null
          id?: string
          name?: string
          phone?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emergency_cases: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          emergency_type: string
          id: string
          location: string | null
          patient_id: string | null
          priority: string | null
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          emergency_type: string
          id?: string
          location?: string | null
          patient_id?: string | null
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          emergency_type?: string
          id?: string
          location?: string | null
          patient_id?: string | null
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_cases_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_cases_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "public_doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      health_workers: {
        Row: {
          created_at: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
          village: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          village?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          village?: string | null
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          address: string | null
          ambulance_available: boolean | null
          beds_available: number | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          specialty: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          ambulance_available?: boolean | null
          beds_available?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          specialty?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          ambulance_available?: boolean | null
          beds_available?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          specialty?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          age: number | null
          created_at: string | null
          gender: string | null
          id: string
          name: string
          patient_id: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
          village: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          gender?: string | null
          id?: string
          name: string
          patient_id?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
          village?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          gender?: string | null
          id?: string
          name?: string
          patient_id?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          village?: string | null
        }
        Relationships: []
      }
      relative_link_requests: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          relative_id: string
          requested_at: string
          responded_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          relative_id: string
          requested_at?: string
          responded_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          relative_id?: string
          requested_at?: string
          responded_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relative_link_requests_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relative_link_requests_relative_id_fkey"
            columns: ["relative_id"]
            isOneToOne: false
            referencedRelation: "relatives"
            referencedColumns: ["id"]
          },
        ]
      }
      relatives: {
        Row: {
          created_at: string | null
          id: string
          name: string
          patient_id: string | null
          phone: string | null
          relation_to_patient: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          patient_id?: string | null
          phone?: string | null
          relation_to_patient?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          patient_id?: string | null
          phone?: string | null
          relation_to_patient?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatives_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_doctors: {
        Row: {
          available: boolean | null
          created_at: string | null
          hospital: string | null
          id: string | null
          name: string | null
          specialization: string | null
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          hospital?: string | null
          id?: string | null
          name?: string | null
          specialization?: string | null
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          hospital?: string | null
          id?: string | null
          name?: string | null
          specialization?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_relative_link: {
        Args: { request_id: string }
        Returns: undefined
      }
      generate_patient_id: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "doctor" | "hospital" | "patient" | "asha_worker" | "relative"
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
      app_role: ["doctor", "hospital", "patient", "asha_worker", "relative"],
    },
  },
} as const

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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      floor_occupancy: {
        Row: {
          created_at: string
          floor: string
          id: string
          square_meters_available: number
          square_meters_occupied: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          floor: string
          id?: string
          square_meters_available?: number
          square_meters_occupied?: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          floor?: string
          id?: string
          square_meters_available?: number
          square_meters_occupied?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      lease_agreements: {
        Row: {
          contract_file_path: string | null
          created_at: string
          id: string
          lease_end: string
          lease_start: string
          monthly_rent: number
          tenant_id: string
          tenant_reference: string | null
          terms_summary: string | null
          updated_at: string
        }
        Insert: {
          contract_file_path?: string | null
          created_at?: string
          id?: string
          lease_end: string
          lease_start: string
          monthly_rent: number
          tenant_id: string
          tenant_reference?: string | null
          terms_summary?: string | null
          updated_at?: string
        }
        Update: {
          contract_file_path?: string | null
          created_at?: string
          id?: string
          lease_end?: string
          lease_start?: string
          monthly_rent?: number
          tenant_id?: string
          tenant_reference?: string | null
          terms_summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lease_agreements_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_repairs: {
        Row: {
          assigned_vendor: string | null
          completion_date: string | null
          cost: number | null
          created_at: string
          date_reported: string
          description: string
          floor: string
          id: string
          issue_reporter: string
          issue_type: string
          material_affected: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_vendor?: string | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string
          date_reported?: string
          description: string
          floor: string
          id?: string
          issue_reporter: string
          issue_type: string
          material_affected: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_vendor?: string | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string
          date_reported?: string
          description?: string
          floor?: string
          id?: string
          issue_reporter?: string
          issue_type?: string
          material_affected?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      parking_allocations: {
        Row: {
          company: string
          created_at: string
          id: string
          spots_allowed: number
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          id?: string
          spots_allowed?: number
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          id?: string
          spots_allowed?: number
          updated_at?: string
        }
        Relationships: []
      }
      parking_statistics: {
        Row: {
          created_at: string
          id: string
          spots_available: number
          spots_occupied: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          spots_available?: number
          spots_occupied?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          spots_available?: number
          spots_occupied?: number
          updated_at?: string
        }
        Relationships: []
      }
      rent_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          last_paid_rent_date: string | null
          method: string
          month_year_range: string
          payment_date: string
          tenant_id: string
          tenant_reference: string | null
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          last_paid_rent_date?: string | null
          method: string
          month_year_range: string
          payment_date: string
          tenant_id: string
          tenant_reference?: string | null
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          last_paid_rent_date?: string | null
          method?: string
          month_year_range?: string
          payment_date?: string
          tenant_id?: string
          tenant_reference?: string | null
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          business_type: string
          created_at: string
          email: string | null
          first_payment_date: string | null
          floor: string[]
          id: string
          monthly_rent: number
          name: string
          phone_number: string | null
          registration_date: string
          space_type: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          business_type: string
          created_at?: string
          email?: string | null
          first_payment_date?: string | null
          floor: string[]
          id?: string
          monthly_rent: number
          name: string
          phone_number?: string | null
          registration_date?: string
          space_type: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          business_type?: string
          created_at?: string
          email?: string | null
          first_payment_date?: string | null
          floor?: string[]
          id?: string
          monthly_rent?: number
          name?: string
          phone_number?: string | null
          registration_date?: string
          space_type?: string
          status?: string
          tenant_id?: string
          updated_at?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const

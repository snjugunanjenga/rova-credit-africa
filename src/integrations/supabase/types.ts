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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          path: string | null
          payload: Json | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          path?: string | null
          payload?: Json | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          path?: string | null
          payload?: Json | null
          session_id?: string | null
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          author_clerk_id: string | null
          author_name: string | null
          body: string
          created_at: string
          id: string
          lead_id: string
        }
        Insert: {
          author_clerk_id?: string | null
          author_name?: string | null
          body: string
          created_at?: string
          id?: string
          lead_id: string
        }
        Update: {
          author_clerk_id?: string | null
          author_name?: string | null
          body?: string
          created_at?: string
          id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          agreement_accepted_at: string | null
          agreement_signatory_name: string | null
          agreement_version: string | null
          assigned_to: string | null
          computed_down_payment: number | null
          consent_given: boolean
          country: string | null
          created_at: string
          eligibility_down_payment_pct: number | null
          eligibility_tier: string | null
          email: string | null
          employment_type: string | null
          full_name: string
          id: string
          id_type: string | null
          latitude: number | null
          lead_ref: string | null
          location_label: string | null
          longitude: number | null
          message: string | null
          metadata: Json | null
          monthly_income: string | null
          phone: string | null
          product_id: string | null
          product_snapshot: Json | null
          repayment_cadence: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          subject: string | null
          updated_at: string
        }
        Insert: {
          agreement_accepted_at?: string | null
          agreement_signatory_name?: string | null
          agreement_version?: string | null
          assigned_to?: string | null
          computed_down_payment?: number | null
          consent_given?: boolean
          country?: string | null
          created_at?: string
          eligibility_down_payment_pct?: number | null
          eligibility_tier?: string | null
          email?: string | null
          employment_type?: string | null
          full_name: string
          id?: string
          id_type?: string | null
          latitude?: number | null
          lead_ref?: string | null
          location_label?: string | null
          longitude?: number | null
          message?: string | null
          metadata?: Json | null
          monthly_income?: string | null
          phone?: string | null
          product_id?: string | null
          product_snapshot?: Json | null
          repayment_cadence?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          subject?: string | null
          updated_at?: string
        }
        Update: {
          agreement_accepted_at?: string | null
          agreement_signatory_name?: string | null
          agreement_version?: string | null
          assigned_to?: string | null
          computed_down_payment?: number | null
          consent_given?: boolean
          country?: string | null
          created_at?: string
          eligibility_down_payment_pct?: number | null
          eligibility_tier?: string | null
          email?: string | null
          employment_type?: string | null
          full_name?: string
          id?: string
          id_type?: string | null
          latitude?: number | null
          lead_ref?: string | null
          location_label?: string | null
          longitude?: number | null
          message?: string | null
          metadata?: Json | null
          monthly_income?: string | null
          phone?: string | null
          product_id?: string | null
          product_snapshot?: Json | null
          repayment_cadence?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          alt_text: string | null
          asset_model: string | null
          asset_price: number
          available: boolean
          badges: string[] | null
          brand: string
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          down_payment: number
          id: string
          image_url: string | null
          name: string
          price_label: string | null
          ram: string | null
          rating: number | null
          sort_order: number
          specifications: Json | null
          specs: string[] | null
          storage: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          asset_model?: string | null
          asset_price: number
          available?: boolean
          badges?: string[] | null
          brand: string
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          down_payment: number
          id?: string
          image_url?: string | null
          name: string
          price_label?: string | null
          ram?: string | null
          rating?: number | null
          sort_order?: number
          specifications?: Json | null
          specs?: string[] | null
          storage?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          asset_model?: string | null
          asset_price?: number
          available?: boolean
          badges?: string[] | null
          brand?: string
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          down_payment?: number
          id?: string
          image_url?: string | null
          name?: string
          price_label?: string | null
          ram?: string | null
          rating?: number | null
          sort_order?: number
          specifications?: Json | null
          specs?: string[] | null
          storage?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          clerk_user_id: string
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          clerk_user_id: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          clerk_user_id?: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_any_role: { Args: { _clerk_user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _clerk_user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin_owner" | "developer" | "analyst" | "marketer"
      lead_source: "marketplace" | "partner" | "direct" | "dsr"
      lead_status: "new" | "contacted" | "qualified" | "converted" | "lost"
      product_category: "budget" | "mid-range" | "flagship"
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
      app_role: ["admin_owner", "developer", "analyst", "marketer"],
      lead_source: ["marketplace", "partner", "direct", "dsr"],
      lead_status: ["new", "contacted", "qualified", "converted", "lost"],
      product_category: ["budget", "mid-range", "flagship"],
    },
  },
} as const

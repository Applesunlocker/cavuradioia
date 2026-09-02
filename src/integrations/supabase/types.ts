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
          broadcast_id: string | null
          created_at: string
          event_type: string
          id: string
          metadata: Json
          occurred_at: string
          owner_id: string
          platform: string | null
          value: number
        }
        Insert: {
          broadcast_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          occurred_at?: string
          owner_id: string
          platform?: string | null
          value?: number
        }
        Update: {
          broadcast_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          owner_id?: string
          platform?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_broadcast_id_fkey"
            columns: ["broadcast_id"]
            isOneToOne: false
            referencedRelation: "broadcasts"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcasts: {
        Row: {
          created_at: string
          duration_seconds: number
          engagement: number
          host_name: string | null
          id: string
          owner_id: string
          peak_viewers: number
          platforms: string[]
          scheduled_at: string | null
          status: Database["public"]["Enums"]["broadcast_status"]
          tags: string[]
          thumbnail: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number
          engagement?: number
          host_name?: string | null
          id?: string
          owner_id: string
          peak_viewers?: number
          platforms?: string[]
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["broadcast_status"]
          tags?: string[]
          thumbnail?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          engagement?: number
          host_name?: string | null
          id?: string
          owner_id?: string
          peak_viewers?: number
          platforms?: string[]
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["broadcast_status"]
          tags?: string[]
          thumbnail?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          color: string | null
          config: Json
          connected: boolean
          created_at: string
          display_name: string
          id: string
          owner_id: string
          platform: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          config?: Json
          connected?: boolean
          created_at?: string
          display_name: string
          id?: string
          owner_id: string
          platform: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          config?: Json
          connected?: boolean
          created_at?: string
          display_name?: string
          id?: string
          owner_id?: string
          platform?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_domain_audit: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string
          created_at: string
          dns_provider: string | null
          domain: string
          id: string
          notes: string | null
          ns_records: string[]
          score: number | null
          statuses: Json
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id: string
          created_at?: string
          dns_provider?: string | null
          domain: string
          id?: string
          notes?: string | null
          ns_records?: string[]
          score?: number | null
          statuses?: Json
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string
          created_at?: string
          dns_provider?: string | null
          domain?: string
          id?: string
          notes?: string | null
          ns_records?: string[]
          score?: number | null
          statuses?: Json
        }
        Relationships: []
      }
      launch_waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          plan_interest: string | null
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          plan_interest?: string | null
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          plan_interest?: string | null
          source?: string
        }
        Relationships: []
      }
      library_items: {
        Row: {
          broadcast_id: string | null
          created_at: string
          duration_seconds: number
          id: string
          item_type: string
          owner_id: string
          tags: string[]
          thumbnail: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          broadcast_id?: string | null
          created_at?: string
          duration_seconds?: number
          id?: string
          item_type?: string
          owner_id: string
          tags?: string[]
          thumbnail?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          broadcast_id?: string | null
          created_at?: string
          duration_seconds?: number
          id?: string
          item_type?: string
          owner_id?: string
          tags?: string[]
          thumbnail?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_items_broadcast_id_fkey"
            columns: ["broadcast_id"]
            isOneToOne: false
            referencedRelation: "broadcasts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          invited_email: string | null
          member_user_id: string | null
          owner_id: string
          role: Database["public"]["Enums"]["team_role"]
          status: Database["public"]["Enums"]["team_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          invited_email?: string | null
          member_user_id?: string | null
          owner_id: string
          role?: Database["public"]["Enums"]["team_role"]
          status?: Database["public"]["Enums"]["team_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          invited_email?: string | null
          member_user_id?: string | null
          owner_id?: string
          role?: Database["public"]["Enums"]["team_role"]
          status?: Database["public"]["Enums"]["team_status"]
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin_if_none: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      list_users_with_roles: {
        Args: never
        Returns: {
          avatar_url: string
          created_at: string
          display_name: string
          email: string
          roles: string[]
          user_id: string
        }[]
      }
      set_user_role: {
        Args: {
          _grant: boolean
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      broadcast_status: "live" | "scheduled" | "completed" | "draft"
      team_role: "admin" | "host" | "producer" | "guest"
      team_status: "pending" | "active" | "removed"
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
      app_role: ["admin", "user"],
      broadcast_status: ["live", "scheduled", "completed", "draft"],
      team_role: ["admin", "host", "producer", "guest"],
      team_status: ["pending", "active", "removed"],
    },
  },
} as const

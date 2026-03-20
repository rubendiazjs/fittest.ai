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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      checkin_questions: {
        Row: {
          ai_relevance: string[] | null
          category: string
          config: Json | null
          cooldown_days: number | null
          created_at: string | null
          id: string
          input_type: string
          options: Json | null
          priority: number | null
          slug: string
          subcategory: string | null
          subtitle_es: string | null
          title_es: string
          trigger_conditions: Json | null
          updated_at: string | null
        }
        Insert: {
          ai_relevance?: string[] | null
          category: string
          config?: Json | null
          cooldown_days?: number | null
          created_at?: string | null
          id?: string
          input_type: string
          options?: Json | null
          priority?: number | null
          slug: string
          subcategory?: string | null
          subtitle_es?: string | null
          title_es: string
          trigger_conditions?: Json | null
          updated_at?: string | null
        }
        Update: {
          ai_relevance?: string[] | null
          category?: string
          config?: Json | null
          cooldown_days?: number | null
          created_at?: string | null
          id?: string
          input_type?: string
          options?: Json | null
          priority?: number | null
          slug?: string
          subcategory?: string | null
          subtitle_es?: string | null
          title_es?: string
          trigger_conditions?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      checkin_responses: {
        Row: {
          id: string
          question_id: string
          responded_at: string | null
          response_date: string
          response_value: Json
          skipped: boolean | null
          user_id: string
        }
        Insert: {
          id?: string
          question_id: string
          responded_at?: string | null
          response_date?: string
          response_value: Json
          skipped?: boolean | null
          user_id: string
        }
        Update: {
          id?: string
          question_id?: string
          responded_at?: string | null
          response_date?: string
          response_value?: Json
          skipped?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkin_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "checkin_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      checkin_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_checkin_date: string | null
          longest_streak: number | null
          total_checkins: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_checkin_date?: string | null
          longest_streak?: number | null
          total_checkins?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_checkin_date?: string | null
          longest_streak?: number | null
          total_checkins?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      coach_profiles: {
        Row: {
          bio: string | null
          certifications: string[] | null
          created_at: string
          id: string
          is_verified: boolean | null
          organization_name: string | null
          specialties: string[] | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          id: string
          is_verified?: boolean | null
          organization_name?: string | null
          specialties?: string[] | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          organization_name?: string | null
          specialties?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_profiles: {
        Row: {
          activity_level: string
          created_at: string
          endurance: string
          fitness_level: string
          fitness_score: number
          frequency: string
          game_experience_level: string
          game_experience_score: number
          id: string
          injury_status: string
          life_context: string
          motivation: string
          preferred_time: string
          primary_goal: string
          skills: string[]
          sleep_quality: string
          tournament_level: string
          updated_at: string
          user_id: string
          weekly_hours: string
          years_playing: string
        }
        Insert: {
          activity_level: string
          created_at?: string
          endurance: string
          fitness_level: string
          fitness_score: number
          frequency: string
          game_experience_level: string
          game_experience_score: number
          id?: string
          injury_status: string
          life_context: string
          motivation: string
          preferred_time: string
          primary_goal: string
          skills?: string[]
          sleep_quality: string
          tournament_level: string
          updated_at?: string
          user_id: string
          weekly_hours: string
          years_playing: string
        }
        Update: {
          activity_level?: string
          created_at?: string
          endurance?: string
          fitness_level?: string
          fitness_score?: number
          frequency?: string
          game_experience_level?: string
          game_experience_score?: number
          id?: string
          injury_status?: string
          life_context?: string
          motivation?: string
          preferred_time?: string
          primary_goal?: string
          skills?: string[]
          sleep_quality?: string
          tournament_level?: string
          updated_at?: string
          user_id?: string
          weekly_hours?: string
          years_playing?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          role_selected_at: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          role_selected_at?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          role_selected_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      roster_links: {
        Row: {
          athlete_id: string
          coach_id: string
          created_at: string
          id: string
          shared_data_access: boolean | null
          status: Database["public"]["Enums"]["roster_status"]
          updated_at: string
        }
        Insert: {
          athlete_id: string
          coach_id: string
          created_at?: string
          id?: string
          shared_data_access?: boolean | null
          status?: Database["public"]["Enums"]["roster_status"]
          updated_at?: string
        }
        Update: {
          athlete_id?: string
          coach_id?: string
          created_at?: string
          id?: string
          shared_data_access?: boolean | null
          status?: Database["public"]["Enums"]["roster_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roster_links_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roster_links_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      warmup_sessions: {
        Row: {
          coaching_notes: string | null
          created_at: string
          duration_minutes: number
          exercises: Json
          expected_sensations: string[]
          feedback_prompt: string | null
          generated_at: string
          generation_context: Json | null
          id: string
          match_benefits: string | null
          player_profile_id: string | null
          title: string
          user_feedback: Json | null
          user_id: string
        }
        Insert: {
          coaching_notes?: string | null
          created_at?: string
          duration_minutes: number
          exercises?: Json
          expected_sensations?: string[]
          feedback_prompt?: string | null
          generated_at?: string
          generation_context?: Json | null
          id?: string
          match_benefits?: string | null
          player_profile_id?: string | null
          title: string
          user_feedback?: Json | null
          user_id: string
        }
        Update: {
          coaching_notes?: string | null
          created_at?: string
          duration_minutes?: number
          exercises?: Json
          expected_sensations?: string[]
          feedback_prompt?: string | null
          generated_at?: string
          generation_context?: Json | null
          id?: string
          match_benefits?: string | null
          player_profile_id?: string | null
          title?: string
          user_feedback?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warmup_sessions_player_profile_id_fkey"
            columns: ["player_profile_id"]
            isOneToOne: false
            referencedRelation: "player_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      roster_status: "pending" | "active" | "terminated"
      user_role: "athlete" | "coach" | "admin"
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
      roster_status: ["pending", "active", "terminated"],
      user_role: ["athlete", "coach", "admin"],
    },
  },
} as const

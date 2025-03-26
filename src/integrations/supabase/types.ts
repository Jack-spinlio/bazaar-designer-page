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
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      "Component Categories": {
        Row: {
          component_group: number | null
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          component_group?: number | null
          description?: string | null
          id: number
          name?: string | null
        }
        Update: {
          component_group?: number | null
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      "Component subcategories": {
        Row: {
          component_category: number | null
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          component_category?: number | null
          description?: string | null
          id: number
          name?: string | null
        }
        Update: {
          component_category?: number | null
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      Component_groups: {
        Row: {
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          description?: string | null
          id: number
          name?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      designs: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      exhibitor_gallery: {
        Row: {
          id: string
          exhibitor_id: string
          image_url: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          exhibitor_id: string
          image_url: string
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          exhibitor_id?: string
          image_url?: string
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exhibitor_gallery_exhibitor_id_fkey"
            columns: ["exhibitor_id"]
            isOneToOne: false
            referencedRelation: "exhibitors"
            referencedColumns: ["id"]
          }
        ]
      }
      exhibitors: {
        Row: {
          id: string
          name: string
          slug: string
          booth_info: string | null
          address: string | null
          telephone: string | null
          fax: string | null
          website: string | null
          email: string | null
          products: string | null
          description: string | null
          thumbnail_url: string | null
          source_url: string | null
          created_at: string
          updated_at: string
          claimed: boolean
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          booth_info?: string | null
          address?: string | null
          telephone?: string | null
          fax?: string | null
          website?: string | null
          email?: string | null
          products?: string | null
          description?: string | null
          thumbnail_url?: string | null
          source_url?: string | null
          created_at?: string
          updated_at?: string
          claimed?: boolean
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          booth_info?: string | null
          address?: string | null
          telephone?: string | null
          fax?: string | null
          website?: string | null
          email?: string | null
          products?: string | null
          description?: string | null
          thumbnail_url?: string | null
          source_url?: string | null
          created_at?: string
          updated_at?: string
          claimed?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exhibitors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      product_parameters: {
        Row: {
          created_at: string
          id: string
          name: string
          product_id: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          product_id: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          product_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_parameters_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          manufacturer: string
          model_url: string | null
          name: string
          price: number
          thumbnail_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          manufacturer: string
          model_url?: string | null
          name: string
          price: number
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          manufacturer?: string
          model_url?: string | null
          name?: string
          price?: number
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      standard_product_attributes: {
        Row: {
          attributecategory: string | null
          attributeid: number
          attributename: string | null
          datatype: string | null
          description: string | null
          unit: string | null
        }
        Insert: {
          attributecategory?: string | null
          attributeid: number
          attributename?: string | null
          datatype?: string | null
          description?: string | null
          unit?: string | null
        }
        Update: {
          attributecategory?: string | null
          attributeid?: number
          attributename?: string | null
          datatype?: string | null
          description?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      "Taipei 3D models": {
        Row: {
          created_at: string
          email_address: string | null
          file_name: string | null
          id: number
        }
        Insert: {
          created_at?: string
          email_address?: string | null
          file_name?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          email_address?: string | null
          file_name?: string | null
          id?: number
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

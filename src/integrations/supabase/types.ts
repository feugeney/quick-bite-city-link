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
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      client_preferences: {
        Row: {
          created_at: string
          dietary_restrictions: string[] | null
          favorite_cuisines: string[] | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dietary_restrictions?: string[] | null
          favorite_cuisines?: string[] | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dietary_restrictions?: string[] | null
          favorite_cuisines?: string[] | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      commandes: {
        Row: {
          adresse_livraison: string
          client_id: string
          date_commande: string | null
          date_derniere_mise_a_jour: string | null
          date_livraison: string | null
          frais_livraison: number | null
          id: string
          instructions: string | null
          latitude_livraison: number | null
          livreur_id: string | null
          longitude_livraison: number | null
          methode_paiement: string | null
          montant_total: number
          paiement_effectue: boolean | null
          reference_paiement: string | null
          restaurant_id: string
          statut: Database["public"]["Enums"]["order_status"] | null
        }
        Insert: {
          adresse_livraison: string
          client_id: string
          date_commande?: string | null
          date_derniere_mise_a_jour?: string | null
          date_livraison?: string | null
          frais_livraison?: number | null
          id?: string
          instructions?: string | null
          latitude_livraison?: number | null
          livreur_id?: string | null
          longitude_livraison?: number | null
          methode_paiement?: string | null
          montant_total: number
          paiement_effectue?: boolean | null
          reference_paiement?: string | null
          restaurant_id: string
          statut?: Database["public"]["Enums"]["order_status"] | null
        }
        Update: {
          adresse_livraison?: string
          client_id?: string
          date_commande?: string | null
          date_derniere_mise_a_jour?: string | null
          date_livraison?: string | null
          frais_livraison?: number | null
          id?: string
          instructions?: string | null
          latitude_livraison?: number | null
          livreur_id?: string | null
          longitude_livraison?: number | null
          methode_paiement?: string | null
          montant_total?: number
          paiement_effectue?: boolean | null
          reference_paiement?: string | null
          restaurant_id?: string
          statut?: Database["public"]["Enums"]["order_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "commandes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commandes_livreur_id_fkey"
            columns: ["livreur_id"]
            isOneToOne: false
            referencedRelation: "livreurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commandes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_applications: {
        Row: {
          address: string
          created_at: string
          first_name: string
          id: string
          id_card_photo_url: string | null
          id_number: string
          last_name: string
          phone: string
          profile_photo_url: string | null
          status: string
          updated_at: string
          user_id: string
          vehicle_type: string
        }
        Insert: {
          address: string
          created_at?: string
          first_name: string
          id?: string
          id_card_photo_url?: string | null
          id_number: string
          last_name: string
          phone: string
          profile_photo_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
          vehicle_type: string
        }
        Update: {
          address?: string
          created_at?: string
          first_name?: string
          id?: string
          id_card_photo_url?: string | null
          id_number?: string
          last_name?: string
          phone?: string
          profile_photo_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      delivery_profiles: {
        Row: {
          address: string
          created_at: string
          id: string
          id_card_image_url: string | null
          national_id_number: string
          phone_number: string
          profile_photo_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          id_card_image_url?: string | null
          national_id_number: string
          phone_number: string
          profile_photo_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          id_card_image_url?: string | null
          national_id_number?: string
          phone_number?: string
          profile_photo_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      details_commande: {
        Row: {
          commande_id: string | null
          id: string
          notes: string | null
          plat_id: string
          prix_unitaire: number
          quantite: number
        }
        Insert: {
          commande_id?: string | null
          id?: string
          notes?: string | null
          plat_id: string
          prix_unitaire: number
          quantite: number
        }
        Update: {
          commande_id?: string | null
          id?: string
          notes?: string | null
          plat_id?: string
          prix_unitaire?: number
          quantite?: number
        }
        Relationships: [
          {
            foreignKeyName: "details_commande_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: false
            referencedRelation: "commandes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "details_commande_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
        ]
      }
      dishes: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          menu_category_id: string | null
          name: string
          price: number
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          menu_category_id?: string | null
          name: string
          price: number
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          menu_category_id?: string | null
          name?: string
          price?: number
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dishes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dishes_menu_category_id_fkey"
            columns: ["menu_category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dishes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      livreurs: {
        Row: {
          current_latitude: number | null
          current_longitude: number | null
          id: string
          is_active: boolean | null
          last_updated_position: string | null
        }
        Insert: {
          current_latitude?: number | null
          current_longitude?: number | null
          id: string
          is_active?: boolean | null
          last_updated_position?: string | null
        }
        Update: {
          current_latitude?: number | null
          current_longitude?: number | null
          id?: string
          is_active?: boolean | null
          last_updated_position?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "livreurs_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          menu_id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          menu_id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          menu_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menus_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          dish_id: string
          id: string
          notes: string | null
          order_id: string
          price: number
          quantity: number
        }
        Insert: {
          created_at?: string
          dish_id: string
          id?: string
          notes?: string | null
          order_id: string
          price: number
          quantity: number
        }
        Update: {
          created_at?: string
          dish_id?: string
          id?: string
          notes?: string | null
          order_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_transitions: {
        Row: {
          action_description: string | null
          action_name: string
          from_status_id: number
          id: number
          requires_role: string | null
          to_status_id: number
        }
        Insert: {
          action_description?: string | null
          action_name: string
          from_status_id: number
          id?: number
          requires_role?: string | null
          to_status_id: number
        }
        Update: {
          action_description?: string | null
          action_name?: string
          from_status_id?: number
          id?: number
          requires_role?: string | null
          to_status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_status_transitions_from_status_id_fkey"
            columns: ["from_status_id"]
            isOneToOne: false
            referencedRelation: "order_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_transitions_to_status_id_fkey"
            columns: ["to_status_id"]
            isOneToOne: false
            referencedRelation: "order_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      order_statuses: {
        Row: {
          code: string
          color: string
          description: string | null
          display_order: number
          id: number
          name: string
        }
        Insert: {
          code: string
          color: string
          description?: string | null
          display_order?: number
          id?: number
          name: string
        }
        Update: {
          code?: string
          color?: string
          description?: string | null
          display_order?: number
          id?: number
          name?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          delivery_address: string | null
          delivery_fee: number | null
          delivery_latitude: number | null
          delivery_longitude: number | null
          delivery_person_id: string | null
          id: string
          notes: string | null
          payment_completed: boolean | null
          payment_method: string | null
          restaurant_id: string
          status: Database["public"]["Enums"]["order_status"]
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_person_id?: string | null
          id?: string
          notes?: string | null
          payment_completed?: boolean | null
          payment_method?: string | null
          restaurant_id: string
          status?: Database["public"]["Enums"]["order_status"]
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_person_id?: string | null
          id?: string
          notes?: string | null
          payment_completed?: boolean | null
          payment_method?: string | null
          restaurant_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_delivery_person_id_fkey"
            columns: ["delivery_person_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          current_latitude: number | null
          current_longitude: number | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          last_updated_position: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          last_updated_position?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          last_updated_position?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          party_size: number
          reservation_date: string
          reservation_time: string
          restaurant_id: string
          status: Database["public"]["Enums"]["reservation_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          party_size: number
          reservation_date: string
          reservation_time: string
          restaurant_id: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          party_size?: number
          reservation_date?: string
          reservation_time?: string
          restaurant_id?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_applications: {
        Row: {
          created_at: string
          first_name: string
          id: string
          id_card_photo_url: string | null
          id_number: string
          last_name: string
          phone: string
          restaurant_address: string
          restaurant_description: string | null
          restaurant_logo_url: string | null
          restaurant_name: string
          restaurant_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name: string
          id?: string
          id_card_photo_url?: string | null
          id_number: string
          last_name: string
          phone: string
          restaurant_address: string
          restaurant_description?: string | null
          restaurant_logo_url?: string | null
          restaurant_name: string
          restaurant_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          id_card_photo_url?: string | null
          id_number?: string
          last_name?: string
          phone?: string
          restaurant_address?: string
          restaurant_description?: string | null
          restaurant_logo_url?: string | null
          restaurant_name?: string
          restaurant_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address: string
          coordinates: unknown | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          opening_hours: Json | null
          owner_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address: string
          coordinates?: unknown | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          opening_hours?: Json | null
          owner_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          coordinates?: unknown | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          opening_hours?: Json | null
          owner_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_create_user: {
        Args: {
          admin_id: string
          first_name: string
          last_name: string
          email: string
          password: string
          phone: string
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: string
      }
      admin_get_users: {
        Args: { user_ids: string[] }
        Returns: {
          id: string
          email: string
        }[]
      }
      get_available_order_status_transitions: {
        Args: { current_status_code: string; user_role: string }
        Returns: {
          to_status_code: string
          to_status_name: string
          action_name: string
          action_description: string
        }[]
      }
      is_valid_order_status_transition: {
        Args: { from_status: string; to_status: string }
        Returns: boolean
      }
      update_delivery_location: {
        Args: { user_id: string; latitude: number; longitude: number }
        Returns: undefined
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "preparing"
        | "ready"
        | "delivered"
        | "cancelled"
        | "out_for_delivery"
      reservation_status: "pending" | "confirmed" | "cancelled"
      user_role: "client" | "restaurant" | "livreur" | "supermarche" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
        "out_for_delivery",
      ],
      reservation_status: ["pending", "confirmed", "cancelled"],
      user_role: ["client", "restaurant", "livreur", "supermarche", "admin"],
    },
  },
} as const

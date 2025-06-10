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
      chauffeurs: {
        Row: {
          created_at: string
          dateexpiration: string
          id: string
          nom: string
          numeropermis: string
          prenom: string
          referencechauffeur: string
          statut: string
          telephone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dateexpiration: string
          id?: string
          nom: string
          numeropermis: string
          prenom: string
          referencechauffeur: string
          statut?: string
          telephone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dateexpiration?: string
          id?: string
          nom?: string
          numeropermis?: string
          prenom?: string
          referencechauffeur?: string
          statut?: string
          telephone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adresse: string
          codepostal: string
          created_at: string
          dateinscription: string
          datenaissance: string
          email: string
          id: string
          nom: string
          numerocarteid: string | null
          numeropermis: string
          photocarteid: string | null
          prenom: string
          statut: string
          telephone: string
          updated_at: string
          user_id: string
          ville: string
        }
        Insert: {
          adresse: string
          codepostal: string
          created_at?: string
          dateinscription?: string
          datenaissance: string
          email: string
          id?: string
          nom: string
          numerocarteid?: string | null
          numeropermis: string
          photocarteid?: string | null
          prenom: string
          statut?: string
          telephone: string
          updated_at?: string
          user_id: string
          ville: string
        }
        Update: {
          adresse?: string
          codepostal?: string
          created_at?: string
          dateinscription?: string
          datenaissance?: string
          email?: string
          id?: string
          nom?: string
          numerocarteid?: string | null
          numeropermis?: string
          photocarteid?: string | null
          prenom?: string
          statut?: string
          telephone?: string
          updated_at?: string
          user_id?: string
          ville?: string
        }
        Relationships: []
      }
      contract_terms: {
        Row: {
          companyinfo: string
          created_at: string
          generalterms: string
          id: string
          paymentterms: string
          updated_at: string
          user_id: string
        }
        Insert: {
          companyinfo: string
          created_at?: string
          generalterms: string
          id?: string
          paymentterms: string
          updated_at?: string
          user_id: string
        }
        Update: {
          companyinfo?: string
          created_at?: string
          generalterms?: string
          id?: string
          paymentterms?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          adresselivraison: string | null
          caution: number
          chauffeurid: string | null
          clientid: string
          conditions: string | null
          created_at: string
          datedebut: string
          datefin: string
          etatvehiculedepart: string | null
          etatvehiculeretour: string | null
          heurerecuperation: string | null
          heurerendu: string | null
          id: string
          kilometragedepart: number | null
          kilometrageretour: number | null
          niveaucarburantdepart: string | null
          niveaucarburantretour: string | null
          notes: string | null
          numerocontrat: string
          prixtotal: number
          statut: string
          updated_at: string
          user_id: string
          vehicleid: string
        }
        Insert: {
          adresselivraison?: string | null
          caution?: number
          chauffeurid?: string | null
          clientid: string
          conditions?: string | null
          created_at?: string
          datedebut: string
          datefin: string
          etatvehiculedepart?: string | null
          etatvehiculeretour?: string | null
          heurerecuperation?: string | null
          heurerendu?: string | null
          id?: string
          kilometragedepart?: number | null
          kilometrageretour?: number | null
          niveaucarburantdepart?: string | null
          niveaucarburantretour?: string | null
          notes?: string | null
          numerocontrat: string
          prixtotal: number
          statut?: string
          updated_at?: string
          user_id: string
          vehicleid: string
        }
        Update: {
          adresselivraison?: string | null
          caution?: number
          chauffeurid?: string | null
          clientid?: string
          conditions?: string | null
          created_at?: string
          datedebut?: string
          datefin?: string
          etatvehiculedepart?: string | null
          etatvehiculeretour?: string | null
          heurerecuperation?: string | null
          heurerendu?: string | null
          id?: string
          kilometragedepart?: number | null
          kilometrageretour?: number | null
          niveaucarburantdepart?: string | null
          niveaucarburantretour?: string | null
          notes?: string | null
          numerocontrat?: string
          prixtotal?: number
          statut?: string
          updated_at?: string
          user_id?: string
          vehicleid?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_clientid_fkey"
            columns: ["clientid"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_vehicleid_fkey"
            columns: ["vehicleid"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          annee: number
          couleur: string
          created_at: string
          description: string | null
          equipements: string[] | null
          id: string
          immatriculation: string
          kilometrage: number
          marque: string
          modele: string
          nombreplaces: number
          photos: string[] | null
          prixparjour: number
          statut: string
          typecarburant: string
          updated_at: string
          user_id: string
        }
        Insert: {
          annee: number
          couleur: string
          created_at?: string
          description?: string | null
          equipements?: string[] | null
          id?: string
          immatriculation: string
          kilometrage: number
          marque: string
          modele: string
          nombreplaces: number
          photos?: string[] | null
          prixparjour: number
          statut: string
          typecarburant: string
          updated_at?: string
          user_id: string
        }
        Update: {
          annee?: number
          couleur?: string
          created_at?: string
          description?: string | null
          equipements?: string[] | null
          id?: string
          immatriculation?: string
          kilometrage?: number
          marque?: string
          modele?: string
          nombreplaces?: number
          photos?: string[] | null
          prixparjour?: number
          statut?: string
          typecarburant?: string
          updated_at?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const

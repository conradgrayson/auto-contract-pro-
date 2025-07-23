export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chauffeurs: {
        Row: {
          created_at: string
          dateexpiration: string
          id: string
          nom: string
          numeropermis: string
          photo_permis: string | null
          prenom: string
          referencechauffeur: string
          statut: string
          telephone: string
          updated_at: string
          url_permis: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          dateexpiration: string
          id?: string
          nom: string
          numeropermis: string
          photo_permis?: string | null
          prenom: string
          referencechauffeur: string
          statut?: string
          telephone: string
          updated_at?: string
          url_permis?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          dateexpiration?: string
          id?: string
          nom?: string
          numeropermis?: string
          photo_permis?: string | null
          prenom?: string
          referencechauffeur?: string
          statut?: string
          telephone?: string
          updated_at?: string
          url_permis?: string | null
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
          photo_carte_id: string | null
          photocarteid: string | null
          prenom: string
          statut: string
          telephone: string
          updated_at: string
          url_carte_id: string | null
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
          photo_carte_id?: string | null
          photocarteid?: string | null
          prenom: string
          statut?: string
          telephone: string
          updated_at?: string
          url_carte_id?: string | null
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
          photo_carte_id?: string | null
          photocarteid?: string | null
          prenom?: string
          statut?: string
          telephone?: string
          updated_at?: string
          url_carte_id?: string | null
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
          avec_chauffeur: boolean | null
          caution: number
          chauffeur_id: string | null
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
          montant_reduction: number | null
          niveaucarburantdepart: string | null
          niveaucarburantretour: string | null
          notes: string | null
          numerocontrat: string
          prixtotal: number
          reduction_type: string | null
          reduction_value: number | null
          statut: string
          updated_at: string
          user_id: string
          vehicleid: string
        }
        Insert: {
          adresselivraison?: string | null
          avec_chauffeur?: boolean | null
          caution?: number
          chauffeur_id?: string | null
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
          montant_reduction?: number | null
          niveaucarburantdepart?: string | null
          niveaucarburantretour?: string | null
          notes?: string | null
          numerocontrat: string
          prixtotal: number
          reduction_type?: string | null
          reduction_value?: number | null
          statut?: string
          updated_at?: string
          user_id: string
          vehicleid: string
        }
        Update: {
          adresselivraison?: string | null
          avec_chauffeur?: boolean | null
          caution?: number
          chauffeur_id?: string | null
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
          montant_reduction?: number | null
          niveaucarburantdepart?: string | null
          niveaucarburantretour?: string | null
          notes?: string | null
          numerocontrat?: string
          prixtotal?: number
          reduction_type?: string | null
          reduction_value?: number | null
          statut?: string
          updated_at?: string
          user_id?: string
          vehicleid?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_chauffeur_id_fkey"
            columns: ["chauffeur_id"]
            isOneToOne: false
            referencedRelation: "chauffeurs"
            referencedColumns: ["id"]
          },
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
      contrats_partenaires: {
        Row: {
          adresse_partenaire: string
          conditions_particulieres: string | null
          created_at: string
          date_debut: string
          date_fin: string
          email_partenaire: string
          id: string
          montant_total: number
          nom_partenaire: string
          numero_contrat: string
          objet_contrat: string
          statut: string
          telephone_partenaire: string
          type_partenariat: string
          updated_at: string
          user_id: string
        }
        Insert: {
          adresse_partenaire: string
          conditions_particulieres?: string | null
          created_at?: string
          date_debut: string
          date_fin: string
          email_partenaire: string
          id?: string
          montant_total?: number
          nom_partenaire: string
          numero_contrat: string
          objet_contrat: string
          statut?: string
          telephone_partenaire: string
          type_partenariat: string
          updated_at?: string
          user_id: string
        }
        Update: {
          adresse_partenaire?: string
          conditions_particulieres?: string | null
          created_at?: string
          date_debut?: string
          date_fin?: string
          email_partenaire?: string
          id?: string
          montant_total?: number
          nom_partenaire?: string
          numero_contrat?: string
          objet_contrat?: string
          statut?: string
          telephone_partenaire?: string
          type_partenariat?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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

/* Tipos das tabelas do Supabase (espelham supabase/migrations/). Atualize junto com as migrations.
   Precisam ser `type` (não `interface`) para encaixar no formato que o supabase-js espera. */

export type PapelMesa = 'mestre' | 'jogador';

export type Perfil = {
  id: string;
  nome: string;
  avatar_url: string | null;
  criado_em: string;
};

export type Mesa = {
  id: string;
  nome: string;
  codigo_convite: string;
  criado_por: string;
  criado_em: string;
};

export type Membro = {
  mesa_id: string;
  usuario_id: string;
  papel: PapelMesa;
  entrou_em: string;
};

export type Database = {
  public: {
    Tables: {
      perfis: {
        Row: Perfil;
        Insert: { [_ in never]: never };
        Update: { nome?: string; avatar_url?: string | null };
        Relationships: [];
      };
      mesas: {
        Row: Mesa;
        Insert: { [_ in never]: never };
        Update: { nome?: string };
        Relationships: [];
      };
      membros: {
        Row: Membro;
        Insert: { [_ in never]: never };
        Update: { papel?: PapelMesa };
        Relationships: [
          {
            foreignKeyName: 'membros_mesa_id_fkey';
            columns: ['mesa_id'];
            isOneToOne: false;
            referencedRelation: 'mesas';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'membros_usuario_id_fkey';
            columns: ['usuario_id'];
            isOneToOne: false;
            referencedRelation: 'perfis';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      criar_mesa: { Args: { p_nome: string }; Returns: string };
      entrar_na_mesa: { Args: { p_codigo: string }; Returns: string };
      novo_convite: { Args: { p_mesa: string }; Returns: string };
      ver_convite: {
        Args: { p_codigo: string };
        Returns: { mesa_id: string; nome: string; ja_sou_membro: boolean }[];
      };
      eh_membro: { Args: { p_mesa: string }; Returns: boolean };
      eh_mestre: { Args: { p_mesa: string }; Returns: boolean };
    };
    Enums: { papel_mesa: PapelMesa };
    CompositeTypes: { [_ in never]: never };
  };
};

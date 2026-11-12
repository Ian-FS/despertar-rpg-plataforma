/* Tipos das tabelas do Supabase (espelham supabase/migrations/). Atualize junto com as migrations.
   Precisam ser `type` (não `interface`) para encaixar no formato que o supabase-js espera. */

import type { EstadoCombate } from '@/regras/combate';
import type { Rolagem } from '@/regras/rolagem';

export type PapelMesa = 'mestre' | 'jogador';

export type Perfil = {
  id: string;
  nome: string;
  avatar_url: string | null;
  criado_em: string;
};

export type RegrasMesa = {
  metodoPadrao: boolean;
  escolhaGuiada: boolean;
  marcos: boolean;
  provacao: boolean;
};

export type Mesa = {
  id: string;
  nome: string;
  codigo_convite: string;
  criado_por: string;
  criado_em: string;
  regras: RegrasMesa;
};

export type EtapaFicha = 'conceito' | 'atributos' | 'despertar' | 'avaliacao' | 'pronta';

export type ResumoFicha = {
  nome: string;
  nivel: number;
  rank: string;
  despertar: string;
  pvMax: number;
  pmMax: number;
  pvAtual: number;
  pmAtual: number;
  condicoes: string;
};

export type FichaLinha = {
  id: string;
  mesa_id: string;
  dono_id: string;
  tipo: 'jogador' | 'npc';
  ativa: boolean;
  etapa: EtapaFicha;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dados: any;
  resumo: ResumoFicha | Record<string, never>;
  sorteios_liberados: string[];
  criado_em: string;
  atualizado_em: string;
  /** quem fez a última alteração (para avisar quem está com a ficha aberta) */
  alterado_por: string | null;
};

export type SorteioLinha = {
  id: string;
  ficha_id: string;
  mesa_id: string;
  autor_id: string;
  tipo: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resultado: any;
  criado_em: string;
};

export type RolagemLinha = {
  id: string;
  mesa_id: string;
  ficha_id: string | null;
  autor_id: string;
  quem: string;
  rotulo: string;
  resultado: Rolagem;
  margem_critico: number;
  secreta: boolean;
  criado_em: string;
};

export type FichaPublicoLinha = {
  id: string;
  mesa_id: string;
  dono_id: string;
  tipo: 'jogador' | 'npc';
  ativa: boolean;
  etapa: EtapaFicha;
  resumo: ResumoFicha | Record<string, never>;
  atualizado_em: string;
};

export type CombateLinha = {
  mesa_id: string;
  estado: EstadoCombate;
  versao: number;
  atualizado_em: string;
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
        Update: { nome?: string; regras?: RegrasMesa };
        Relationships: [];
      };
      fichas: {
        Row: FichaLinha;
        Insert: Partial<FichaLinha> & Pick<FichaLinha, 'mesa_id' | 'dono_id' | 'dados'>;
        Update: Partial<FichaLinha>;
        Relationships: [];
      };
      fichas_publico: {
        Row: FichaPublicoLinha;
        Insert: { [_ in never]: never };
        Update: { [_ in never]: never };
        Relationships: [];
      };
      combates: {
        Row: CombateLinha;
        Insert: Omit<CombateLinha, 'atualizado_em'> & { atualizado_em?: string };
        Update: Partial<CombateLinha>;
        Relationships: [];
      };
      rolagens: {
        Row: RolagemLinha;
        Insert: Omit<RolagemLinha, 'id' | 'criado_em'>;
        Update: Partial<RolagemLinha>;
        Relationships: [];
      };
      sorteios: {
        Row: SorteioLinha;
        Insert: Omit<SorteioLinha, 'id' | 'criado_em'>;
        Update: Partial<SorteioLinha>;
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
      resumo_fichas: {
        Args: { p_mesa: string };
        Returns: { id: string; dono_id: string; ativa: boolean; etapa: EtapaFicha; resumo: ResumoFicha }[];
      };
      eh_membro: { Args: { p_mesa: string }; Returns: boolean };
      eh_mestre: { Args: { p_mesa: string }; Returns: boolean };
    };
    Enums: { papel_mesa: PapelMesa };
    CompositeTypes: { [_ in never]: never };
  };
};

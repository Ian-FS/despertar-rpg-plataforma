import type { RegrasMesa } from '@/lib/supabase/tipos-banco';

/** Regras opcionais da mesa: todas desligadas = regras padrão do livro. */
export const REGRAS_PADRAO: RegrasMesa = { metodoPadrao: false, escolhaGuiada: false, marcos: false, provacao: false };

export const DESCRICAO_REGRAS: { chave: keyof RegrasMesa; nome: string; desc: string }[] = [
  {
    chave: 'metodoPadrao',
    nome: 'Método Padrão de atributos',
    desc: 'Em vez de sortear, todos usam base 8 e distribuem 7, 7, 6, 6, 5 e 4.',
  },
  {
    chave: 'escolhaGuiada',
    nome: 'Escolha Guiada do Despertar',
    desc: 'O d100 do Despertar é rolado duas vezes e o jogador fica com o que preferir.',
  },
  {
    chave: 'marcos',
    nome: 'Marcos em vez de XP',
    desc: 'Sem contar XP: o grupo sobe 1 nível a cada 2 aventuras, quando o Mestre decidir.',
  },
  {
    chave: 'provacao',
    nome: 'Provação de Ascensão',
    desc: 'Do 19 ao 20 e do 29 ao 30, só sobe quem vencer a Instância especial (o Mestre libera).',
  },
];

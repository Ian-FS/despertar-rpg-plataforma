/* O que o jogador pode mudar na própria ficha, e o que só o Mestre ou os sorteios mudam.
   O servidor chama mesclarEdicaoJogador() e depois validarFicha() antes de gravar. */
import { HAB } from './dados';
import { checarRequisitos, computarFicha, phDisponiveis } from './ficha';
import type { HabilidadeAdquirida, Item, Personagem } from './personagem';
import { ATRIBUTO_IDS, type AtributoId } from './tipos';

const texto = (v: unknown, max: number) => String(v ?? '').slice(0, max);
const inteiro = (v: unknown, min = 0, max = 1_000_000) => {
  const n = Math.trunc(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
};
const objeto = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

function limparHabs(v: unknown): HabilidadeAdquirida[] {
  if (!Array.isArray(v)) return [];
  const vistos = new Set<string>();
  const out: HabilidadeAdquirida[] = [];
  for (const x of v) {
    const o = objeto(x);
    const id = texto(o.id, 20);
    if (!HAB[id] || vistos.has(id)) continue;
    vistos.add(id);
    out.push({ id, nv: inteiro(o.nv, 1, 5), gratis: o.gratis === true });
  }
  return out;
}

function limparItens(v: unknown): Item[] {
  if (!Array.isArray(v)) return [];
  // itens são livres (o jogador registra o que ganha); só limitamos o tamanho
  return v.slice(0, 300).filter((x) => x && typeof x === 'object') as Item[];
}

/**
 * Junta a edição enviada pelo jogador com a ficha atual: campos protegidos (sorteados ou dados
 * pelo Mestre) sempre vêm da ficha atual; os demais vêm da edição, já limpos.
 */
export function mesclarEdicaoJogador(antes: Personagem, edicao: unknown): Personagem {
  const e = objeto(edicao);
  const atrE = objeto(e.atr);
  const despE = objeto(e.despertar);
  const pericias: Record<string, number> = {};
  for (const [k, v] of Object.entries(objeto(e.pericias))) pericias[texto(k, 40)] = inteiro(v, 0, 50);

  return {
    ...antes,
    // livres
    nome: texto(e.nome, 80) || antes.nome,
    jogador: texto(e.jogador, 80),
    conceito: texto(e.conceito, 500),
    idade: texto(e.idade, 20),
    ocupacao: texto(e.ocupacao, 80),
    motivo: texto(e.motivo, 500),
    notas: texto(e.notas, 20_000),
    condicoes: texto(e.condicoes, 500),
    ouro: inteiro(e.ouro, 0, 1_000_000_000),
    pvAtual: e.pvAtual === null ? null : inteiro(e.pvAtual, -100_000, 100_000),
    pmAtual: e.pmAtual === null ? null : inteiro(e.pmAtual, 0, 100_000),
    itens: limparItens(e.itens),
    // validados em validarFicha()
    atr: Object.fromEntries(ATRIBUTO_IDS.map((a) => [a, inteiro(atrE[a], 1, 500)])) as Record<AtributoId, number>,
    statusPend: inteiro(e.statusPend, 0, 10_000),
    pericias,
    habs: limparHabs(e.habs),
    despertar: { id: antes.despertar.id, nv: inteiro(despE.nv, 1, 5) },
    titulo: texto(e.titulo, 20),
    // protegidos: sempre da ficha atual
    // (nivel, xp, phNiveis, phExtra, potencial, compPot, compDesp, rankOficial, atrBase, titulosObtidos, bonus)
  };
}

/** Confere as regras de uma ficha editada pelo jogador. Devolve a lista de problemas (vazia = ok). */
export function validarFicha(antes: Personagem, depois: Personagem): string[] {
  const erros: string[] = [];

  // Pontos de Status: o total distribuído + pendente não muda; nenhum atributo abaixo do sorteado
  const soma = (p: Personagem) => ATRIBUTO_IDS.reduce((t, a) => t + p.atr[a] - p.atrBase[a], 0) + p.statusPend;
  if (soma(depois) !== soma(antes)) erros.push('Os Pontos de Status distribuídos não batem com os disponíveis.');
  for (const a of ATRIBUTO_IDS)
    if (depois.atr[a] < depois.atrBase[a]) erros.push(`${a} não pode ficar abaixo do valor sorteado (${depois.atrBase[a]}).`);

  // Habilidades grátis só vêm da Avaliação do Sistema (ou do Mestre)
  for (const h of depois.habs)
    if (h.gratis && !antes.habs.some((x) => x.id === h.id && x.gratis))
      erros.push(`${HAB[h.id].n} não foi recebida de graça.`);

  // Habilidades novas precisam cumprir os requisitos
  for (const h of depois.habs) {
    if (h.gratis || antes.habs.some((x) => x.id === h.id)) continue;
    const faltando = checarRequisitos(HAB[h.id], depois).filter((r) => !r.ok);
    if (faltando.length) erros.push(`${HAB[h.id].n}: falta ${faltando.map((r) => r.txt).join(', ')}.`);
  }

  // Pontos de Habilidade
  const ph = phDisponiveis(depois);
  if (ph < 0) erros.push(`Faltam ${-ph} PH para essas habilidades.`);

  // Perícias: total e grau máximo pelo nível
  const f = computarFicha(depois);
  const totalPericias = Object.values(depois.pericias).reduce((t, v) => t + v, 0);
  if (totalPericias > f.periciaTotal)
    erros.push(`Perícias: ${totalPericias} pontos usados de ${f.periciaTotal} disponíveis.`);
  for (const [nome, grau] of Object.entries(depois.pericias))
    if (grau > f.periciaMax) erros.push(`${nome}: grau máximo no nível ${depois.nivel} é ${f.periciaMax}.`);

  // Título equipado precisa ter sido conquistado
  if (depois.titulo && !depois.titulosObtidos.includes(depois.titulo)) erros.push('Esse Título ainda não foi conquistado.');

  return erros;
}

/** Resumo público da ficha (o que os outros membros da mesa veem). */
export function resumoFicha(p: Personagem) {
  const f = computarFicha(p);
  return {
    nome: p.nome,
    nivel: f.nivel,
    rank: f.rank,
    despertar: p.despertar.id,
    pvMax: f.pvMax,
    pmMax: f.pmMax,
    pvAtual: p.pvAtual ?? f.pvMax,
    pmAtual: p.pmAtual ?? f.pmMax,
    condicoes: p.condicoes,
  };
}

/** Completa campos que fichas antigas podem não ter. */
export function normalizarPersonagem(p: Personagem): Personagem {
  return {
    ...p,
    idade: p.idade ?? '',
    ocupacao: p.ocupacao ?? '',
    atrBase: p.atrBase ?? { ...p.atr },
    titulosObtidos: p.titulosObtidos ?? (p.titulo ? [p.titulo] : []),
  };
}

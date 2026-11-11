/* O que o jogador pode mudar na própria ficha, e o que só o Mestre (ou o servidor) muda.
   O servidor chama mesclarEdicaoJogador() e depois validarFicha() antes de gravar.

   O jogador PODE: nome e textos; distribuir Pontos de Status, gastar PH e pontos de perícia
   (sem desfazer o que já confirmou); equipar e desequipar; descartar itens; escolher o Título
   entre os conquistados.
   Só o MESTRE: PV, PM, condições, descansos, Ouro, criar ou modificar itens, nível, XP, PH extra.
   Pelo SERVIDOR (ações próprias): usar consumíveis, gastar PM em habilidades, sorteios. */
import { ARMAS, HAB } from './dados';
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

/** Itens: o jogador só equipa/desequipa e descarta. Itens novos ou alterados são ignorados. */
function mesclarItens(antes: Item[], edicao: unknown): Item[] {
  const lista = Array.isArray(edicao) ? edicao.map(objeto) : [];
  const porUid = new Map(lista.map((o) => [String(o.uid), o]));
  return antes
    .filter((it) => porUid.has(it.uid)) // ausente na edição = descartado
    .map((it) => ({ ...it, equip: porUid.get(it.uid)!.equip === true }));
}

/**
 * Junta a edição enviada pelo jogador com a ficha atual: campos protegidos sempre vêm da
 * ficha atual; os demais vêm da edição, já limpos.
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
    itens: mesclarItens(antes.itens, e.itens),
    titulo: texto(e.titulo, 20),
    // progressão: validada em validarFicha()
    atr: Object.fromEntries(ATRIBUTO_IDS.map((a) => [a, inteiro(atrE[a], 1, 500)])) as Record<AtributoId, number>,
    statusPend: inteiro(e.statusPend, 0, 10_000),
    pericias,
    habs: limparHabs(e.habs),
    despertar: { id: antes.despertar.id, nv: inteiro(despE.nv, 1, 5) },
    // protegidos (vêm de `antes`): pvAtual, pmAtual, condicoes, ouro, nivel, xp, phNiveis, phExtra,
    // potencial, compPot, compDesp, rankOficial, atrBase, titulosObtidos, bonus
  };
}

/* ---------------- equipamento ---------------- */

const duasMaos = (it: Item) => it.cat === 'arma' && /duas mãos/.test(ARMAS.find((a) => a.n === it.base)?.tags ?? '');

/** Conflitos de equipamento pelas regras de armas e escudos (vale para jogador e Mestre). */
export function conflitosEquipamento(p: Personagem): string[] {
  const eq = p.itens.filter((i) => i.equip);
  const armas = eq.filter((i) => i.cat === 'arma');
  const erros: string[] = [];
  if (eq.filter((i) => i.cat === 'armadura').length > 1) erros.push('Só uma armadura pode ficar equipada.');
  if (eq.filter((i) => i.cat === 'escudo').length > 1) erros.push('Só um escudo pode ficar equipado.');
  const pesada = armas.find(duasMaos);
  if (pesada && eq.some((i) => i.cat === 'escudo')) erros.push(`${pesada.nome} é de duas mãos: não dá para usar escudo junto.`);
  if (pesada && armas.length > 1) erros.push(`${pesada.nome} é de duas mãos: não dá para empunhar outra arma junto.`);
  if (armas.length > 2) erros.push('No máximo duas armas equipadas (uma em cada mão).');
  if (armas.length === 2 && eq.some((i) => i.cat === 'escudo')) erros.push('Com escudo, só uma arma fica equipada.');
  return erros;
}

/* ---------------- validação ---------------- */

/** Confere as regras de uma ficha editada pelo jogador. Devolve a lista de problemas (vazia = ok). */
export function validarFicha(antes: Personagem, depois: Personagem): string[] {
  const erros: string[] = [];

  // Pontos de Status: o total distribuído + pendente não muda; o que já foi confirmado não volta
  const soma = (p: Personagem) => ATRIBUTO_IDS.reduce((t, a) => t + p.atr[a] - p.atrBase[a], 0) + p.statusPend;
  if (soma(depois) !== soma(antes)) erros.push('Os Pontos de Status distribuídos não batem com os disponíveis.');
  for (const a of ATRIBUTO_IDS)
    if (depois.atr[a] < antes.atr[a]) erros.push(`${a}: pontos já confirmados não podem ser retirados (fale com o Mestre).`);

  // Habilidades: grátis só pela Avaliação; o que foi confirmado não diminui nem some
  for (const h of depois.habs)
    if (h.gratis && !antes.habs.some((x) => x.id === h.id && x.gratis)) erros.push(`${HAB[h.id].n} não foi recebida de graça.`);
  for (const h of antes.habs) {
    const agora = depois.habs.find((x) => x.id === h.id);
    if (!agora) erros.push(`${HAB[h.id].n}: habilidades confirmadas não podem ser removidas (fale com o Mestre).`);
    else if (agora.nv < h.nv) erros.push(`${HAB[h.id].n}: níveis confirmados não podem ser desfeitos (fale com o Mestre).`);
  }
  if (depois.despertar.nv < antes.despertar.nv) erros.push('Níveis do Despertar confirmados não podem ser desfeitos.');

  // Habilidades novas precisam cumprir os requisitos
  for (const h of depois.habs) {
    if (h.gratis || antes.habs.some((x) => x.id === h.id)) continue;
    const faltando = checarRequisitos(HAB[h.id], depois).filter((r) => !r.ok);
    if (faltando.length) erros.push(`${HAB[h.id].n}: falta ${faltando.map((r) => r.txt).join(', ')}.`);
  }

  // Pontos de Habilidade
  const ph = phDisponiveis(depois);
  if (ph < 0) erros.push(`Faltam ${-ph} PH para essas habilidades.`);

  // Perícias: total, grau máximo do nível, e nada de desfazer o confirmado
  const f = computarFicha(depois);
  const totalPericias = Object.values(depois.pericias).reduce((t, v) => t + v, 0);
  if (totalPericias > f.periciaTotal) erros.push(`Perícias: ${totalPericias} pontos usados de ${f.periciaTotal} disponíveis.`);
  for (const [nome, grau] of Object.entries(depois.pericias))
    if (grau > f.periciaMax) erros.push(`${nome}: grau máximo no nível ${depois.nivel} é ${f.periciaMax}.`);
  for (const [nome, grau] of Object.entries(antes.pericias))
    if ((depois.pericias[nome] ?? 0) < grau) erros.push(`${nome}: graus confirmados não podem ser retirados.`);

  // Equipamento
  erros.push(...conflitosEquipamento(depois));

  // Título equipado precisa ter sido conquistado
  if (depois.titulo && !depois.titulosObtidos.includes(depois.titulo)) erros.push('Esse Título ainda não foi conquistado.');

  return erros;
}

/** A edição mexe em pontos de progressão (Status, PH, perícias)? Esses pedem confirmação. */
export function mudouProgressao(a: Personagem, b: Personagem): boolean {
  return (
    JSON.stringify([a.atr, a.statusPend, a.habs, a.despertar.nv, a.pericias]) !==
    JSON.stringify([b.atr, b.statusPend, b.habs, b.despertar.nv, b.pericias])
  );
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

/* Sincronia da ficha em tempo real: junta a versão que chegou do banco com o que está sendo
   editado na tela, e descreve a mudança para o aviso ("PV 20 → 16 · +Envenenado"). */
import { computarFicha, condicoesAtivas } from './ficha';
import type { Personagem } from './personagem';

/** JSON com as chaves em ordem (o banco devolve o jsonb com as chaves em outra ordem). */
export function estavel(x: unknown): string {
  return JSON.stringify(x, (_k, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, (v as Record<string, unknown>)[k]]))
      : v,
  );
}

/**
 * Junta a versão remota com a local. Campo que a pessoa mudou aqui e ainda não foi gravado fica
 * como está na tela; o resto vem do banco. Devolve null se a remota é a mesma que já temos.
 */
export function mesclarRemota(local: Personagem, salvo: Personagem, remota: Personagem): Personagem | null {
  if (estavel(remota) === estavel(salvo)) return null;
  const r: Record<string, unknown> = { ...remota };
  const l = local as unknown as Record<string, unknown>;
  const s = salvo as unknown as Record<string, unknown>;
  for (const k of Object.keys(l)) if (estavel(l[k]) !== estavel(s[k])) r[k] = l[k];
  return r as unknown as Personagem;
}

/** Resumo do que mudou, para o aviso na tela. Vazio se não houver nada visível. */
export function descreverMudanca(antes: Personagem, depois: Personagem): string {
  const fa = computarFicha(antes);
  const fd = computarFicha(depois);
  const partes: string[] = [];
  const pv = [antes.pvAtual ?? fa.pvMax, depois.pvAtual ?? fd.pvMax];
  const pm = [antes.pmAtual ?? fa.pmMax, depois.pmAtual ?? fd.pmMax];
  if (pv[0] !== pv[1]) partes.push(`PV ${pv[0]} → ${pv[1]}`);
  if (pm[0] !== pm[1]) partes.push(`PM ${pm[0]} → ${pm[1]}`);
  const ca = condicoesAtivas(antes);
  const cd = condicoesAtivas(depois);
  for (const c of cd) if (!ca.includes(c)) partes.push(`+${c}`);
  for (const c of ca) if (!cd.includes(c)) partes.push(`−${c}`);
  const ea = antes.efeitosAtivos.map((e) => e.nome);
  const ed = depois.efeitosAtivos.map((e) => e.nome);
  for (const e of ed) if (!ea.includes(e) && !cd.includes(e)) partes.push(`efeito ${e}`);
  for (const e of ea) if (!ed.includes(e) && !ca.includes(e)) partes.push(`${e} terminou`);
  if (antes.nivel !== depois.nivel) partes.push(`Nível ${antes.nivel} → ${depois.nivel}`);
  if (antes.xp !== depois.xp) partes.push(`XP ${antes.xp} → ${depois.xp}`);
  if (antes.ouro !== depois.ouro) partes.push(`Ouro ${antes.ouro} → ${depois.ouro}`);
  if (estavel(antes.itens) !== estavel(depois.itens)) partes.push('inventário mudou');
  return partes.join(' · ');
}

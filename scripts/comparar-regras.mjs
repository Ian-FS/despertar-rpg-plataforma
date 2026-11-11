// Compara os dados do data.js com o texto do regras.md e lista o que não foi encontrado.
// Uso: node scripts/comparar-regras.mjs <caminho/para/js/data.js> [caminho/regras.md]
//
// O regras.md foi extraído de um PDF em colunas, então quebras de linha e trechos
// intercalados geram falsos positivos: cada item listado precisa de conferência humana.

import { readFileSync } from 'node:fs';
import { carregarDataJs } from './carregar-data-js.mjs';

const D = carregarDataJs(process.argv[2]);
const livroBruto = readFileSync(process.argv[3] ?? 'regras.md', 'utf8');

const norm = (s) =>
  String(s)
    .replace(/\s+/g, ' ')
    .replace(/(\p{L})- (\p{L})/gu, '$1-$2')
    .trim();
const livro = norm(livroBruto);
const semEspaco = livro.replace(/ /g, '');

/** Encontrado literalmente, ou ignorando espaços (para quebras de coluna dentro de uma frase). */
const achou = (txt) => livro.includes(norm(txt)) || semEspaco.includes(norm(txt).replace(/ /g, ''));

const problemas = [];
const conferir = (grupo, item, campo, txt) => {
  if (txt && !achou(txt)) problemas.push({ grupo, item, campo, txt });
};

const HAB = Object.fromEntries(D.HABILIDADES.map((h) => [h.id, h]));
const ARV = Object.fromEntries(D.ARVORES.map((a) => [a.id, a]));

for (const h of D.HABILIDADES) {
  const a = ARV[h.t];
  const rk = D.RANKS[h.r];
  const pre = h.pre.map(([id, nv]) => `${HAB[id].n} nv${nv}`);
  const req = [
    `${h.attr.split('/').join(' ou ')} ${rk.attr}`,
    ...(pre.length ? [h.preAny ? 'um entre: ' + pre.join(' / ') : pre.join(' · ')] : []),
    `Nível ${rk.nivel}`,
  ].join(' · ');
  conferir('Habilidade', h.n, 'cabeçalho', `${h.r} ${h.n} ${a.icone} ${a.nome} · Adquirir ${rk.custo} PH · Requisitos: ${req}`);
  conferir('Habilidade', h.n, 'alcance', `Alcance: ${h.alc} · Duração: ${h.dur}${h.freq ? ' · ' + h.freq : ''}`);
  if (h.tipo === 'Ativa') conferir('Habilidade', h.n, 'uso', `Ativa · ${h.acao}${h.pm ? ' · ' + h.pm + ' PM' : ''}`);
  conferir('Habilidade', h.n, 'efeito', `Efeito: ${h.ef}`);
  conferir('Habilidade', h.n, 'por nível', `Por nível: ${h.esc}`);
  conferir('Habilidade', h.n, 'nível 3', `Nível 3: ${h.m3}`);
  conferir('Habilidade', h.n, 'nível 5', `Nível 5: ${h.m5}`);
}

const faixa = (x) =>
  x.d[0] === x.d[1] ? String(x.d[0]).padStart(2, '0') : `${String(x.d[0]).padStart(2, '0')}–${String(x.d[1]).padStart(2, '0')}`;
for (const x of D.DESPERTARES) {
  conferir('Despertar', x.n, 'faixa e nome', null);
  if (!livro.includes(`${faixa(x)} ${x.n}`) && !livro.includes(`${x.n} ${faixa(x)}`) && !livro.includes(`${x.n} ${x.d[0] === 100 ? '100' : faixa(x)}`))
    problemas.push({ grupo: 'Despertar', item: x.n, campo: 'faixa no d100', txt: faixa(x) });
  conferir('Despertar', x.n, 'afinidades', `Afinidades: ${x.afin.map((a) => `${ARV[a].icone} ${ARV[a].nome}`).join(' · ')}`);
  conferir('Despertar', x.n, 'descrição', x.desc);
  conferir('Despertar', x.n, 'efeito', `Efeito: ${x.ef}`);
  conferir('Despertar', x.n, 'por nível', `Por nível: ${x.esc}`);
  conferir('Despertar', x.n, 'nível 3', `Nível 3: ${x.m3}`);
  conferir('Despertar', x.n, 'nível 5', `Nível 5: ${x.m5}`);
  conferir('Despertar', x.n, 'forma evoluída', `Forma Evoluída: ${x.forma}`);
}

for (const t of D.TITULOS) {
  conferir('Título', t.n, 'condição', `${t.n} Como obter: ${t.cond}`);
  conferir('Título', t.n, 'efeito', t.txt);
}

for (const [cat, lista] of Object.entries(D.AFIXOS))
  for (const [n, s, desc] of lista) conferir(`Afixo (${cat})`, n, 'texto', `${n} / ${s}: ${desc}`);
for (const [n, desc] of D.SELOS) conferir('Selo', n, 'texto', desc);
for (const [n, desc] of D.CONSUMIVEIS) conferir('Consumível', n, 'texto', desc);
for (const [n, desc] of D.CONDICOES) conferir('Condição', n, 'texto', `${n}. ${desc}`);
for (const t of D.PORTAL_TIPO) conferir('Tipo de Portal', t.n, 'texto', t.d);
for (const [n, desc] of D.PORTAL_CRIATURAS) conferir('Criaturas', n, 'texto', `${n}: ${desc}`);
for (const c of D.PORTAL_COMPLICACAO) conferir('Complicação', c, 'texto', c);

// Bestiário: os números do livro devem bater com a fórmula statsAmeaca.
for (const b of D.BESTIARIO) {
  const s = D.statsAmeaca(b.L, b.cat);
  const reac = b.cat === 'Lacaio' ? `Reação +${s.reac} (Defesa Fixa ${s.defFixa})` : `Reação +${s.reac}`;
  conferir('Bestiário', b.n, 'números', `PV ${s.pv} · Ataque +${s.atk} · ${reac} · Dano ${s.dano} · Ações ${s.acoes} · RD ${s.rd} · CD ${s.cd} · Resistências +${s.res}`);
  conferir('Bestiário', b.n, 'traços', b.tr);
}

console.log(`${problemas.length} trechos do data.js não encontrados no regras.md\n`);
for (const p of problemas) console.log(`[${p.grupo}] ${p.item} · ${p.campo}\n    ${p.txt}\n`);

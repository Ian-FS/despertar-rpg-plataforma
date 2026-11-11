// Gera src/regras/dados/*.ts a partir do js/data.js do site original
// (https://github.com/maickon/-SISTEMA-DESPERTAR).
//
// Uso: node scripts/importar-data-js.mjs <caminho/para/js/data.js>
//
// Só os dados puros são gerados. As funções do data.js (EFEITOS_HAB, EFEITOS_DESP,
// statsAmeaca) foram portadas à mão em src/regras/efeitos.ts e src/regras/ameacas.ts.
// Depois de gerar, rode `npm test` para conferir que nada quebrou.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { carregarDataJs } from './carregar-data-js.mjs';

const origem = process.argv[2];
if (!origem) {
  console.error('Uso: node scripts/importar-data-js.mjs <caminho/para/js/data.js>');
  process.exit(1);
}

const D = carregarDataJs(origem);
const destino = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'regras', 'dados');
mkdirSync(destino, { recursive: true });

const json = (v) => JSON.stringify(v, null, 2);
const cabecalho =
  '/* Gerado por scripts/importar-data-js.mjs a partir do data.js do site original.\n' +
  '   Pode ser editado à mão; se reimportar, revise o diff. */\n';

function arquivo(nome, tipos, consts) {
  const imp = tipos.length ? `import type { ${tipos.join(', ')} } from '../tipos';\n\n` : '\n';
  const corpo = consts.map(([n, tipo, valor]) => `export const ${n}: ${tipo} = ${json(valor)};\n`).join('\n');
  writeFileSync(join(destino, nome), cabecalho + imp + corpo);
  console.log('gerado', nome);
}

const descritivos = (pares) => pares.map(([n, desc]) => ({ n, desc }));

arquivo(
  'base.ts',
  ['Atributo', 'Pericia', 'Rank', 'InfoRank', 'Descritivo'],
  [
    ['ATRIBUTOS', 'Atributo[]', D.ATRIBUTOS],
    ['PERICIAS', 'Pericia[]', D.PERICIAS],
    ['RANKS', 'Record<Rank, InfoRank>', D.RANKS],
    ['CONDICOES', 'Descritivo[]', descritivos(D.CONDICOES)],
  ],
);

arquivo(
  'habilidades.ts',
  ['Arvore', 'Habilidade'],
  [
    ['ARVORES', 'Arvore[]', D.ARVORES],
    ['HABILIDADES', 'Habilidade[]', D.HABILIDADES],
  ],
);

arquivo(
  'despertares.ts',
  ['RaridadeDespertar', 'InfoRaridadeDespertar', 'Despertar'],
  [
    ['RARIDADE_DESPERTAR', 'Record<RaridadeDespertar, InfoRaridadeDespertar>', D.RARIDADE_DESPERTAR],
    ['DESPERTARES', 'Despertar[]', D.DESPERTARES],
  ],
);

arquivo(
  'itens.ts',
  ['Arma', 'Armadura', 'InfoRaridadeItem', 'Afixo', 'Descritivo', 'Rank'],
  [
    ['ARMAS', 'Arma[]', D.ARMAS],
    ['ARMADURAS', 'Armadura[]', D.ARMADURAS],
    ['ACESSORIOS', 'string[]', D.ACESSORIOS],
    ['RARIDADES', 'InfoRaridadeItem[]', D.RARIDADES],
    [
      'AFIXOS',
      'Record<"arma" | "armadura" | "acessorio", Afixo[]>',
      Object.fromEntries(
        Object.entries(D.AFIXOS).map(([cat, lista]) => [cat, lista.map(([n, sufixo, desc]) => ({ n, sufixo, desc }))]),
      ),
    ],
    ['SELOS', 'Descritivo[]', descritivos(D.SELOS)],
    ['NOMES_RELIQUIA', 'string[]', D.NOMES_RELIQUIA],
    ['CONSUMIVEIS', 'Descritivo[]', descritivos(D.CONSUMIVEIS)],
    ['PRECO_BASE', 'Record<Rank, number>', D.PRECO_BASE],
  ],
);

arquivo(
  'portais.ts',
  ['Rank', 'PortalTipo', 'Descritivo', 'Monstro', 'Encontro'],
  [
    ['PORTAL_RANK', '{ r: Rank; max: number }[]', D.PORTAL_RANK],
    ['PORTAL_NIVEL', 'Record<Rank, [number, number]>', D.PORTAL_NIVEL],
    ['PORTAL_TIPO', 'PortalTipo[]', D.PORTAL_TIPO],
    ['PORTAL_AMBIENTE', 'string[]', D.PORTAL_AMBIENTE],
    ['PORTAL_CRIATURAS', 'Descritivo[]', descritivos(D.PORTAL_CRIATURAS)],
    ['CHEFE_TITULO', 'string[]', D.CHEFE_TITULO],
    ['CHEFE_EPITETO', 'string[]', D.CHEFE_EPITETO],
    ['PORTAL_COMPLICACAO', 'string[]', D.PORTAL_COMPLICACAO],
    ['BESTIARIO', 'Monstro[]', D.BESTIARIO],
    [
      'ENCONTROS',
      'Record<"Fácil" | "Médio" | "Difícil" | "Chefe", Encontro[]>',
      Object.fromEntries(
        Object.entries(D.ENCONTROS).map(([dif, lista]) => [
          dif,
          lista.map(([cat, deltaNivel, qtd]) => ({ cat, deltaNivel, qtd })),
        ]),
      ),
    ],
  ],
);

arquivo('titulos.ts', ['Titulo'], [['TITULOS', 'Titulo[]', D.TITULOS]]);

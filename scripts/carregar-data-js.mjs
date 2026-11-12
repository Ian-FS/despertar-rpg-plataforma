// Carrega o js/data.js do site original num contexto isolado (sem acesso a require/process)
// e devolve as constantes declaradas nele.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export const NOMES = [
  'ATRIBUTOS', 'PERICIAS', 'RANKS', 'RANK_ORDEM', 'ARVORES', 'HABILIDADES', 'RARIDADE_DESPERTAR', 'DESPERTARES',
  'CONDICOES', 'ARMAS', 'ARMADURAS', 'ACESSORIOS', 'RARIDADES', 'AFIXOS', 'SELOS', 'NOMES_RELIQUIA', 'CONSUMIVEIS',
  'PRECO_BASE', 'PORTAL_RANK', 'PORTAL_NIVEL', 'PORTAL_TIPO', 'PORTAL_AMBIENTE', 'PORTAL_CRIATURAS', 'CHEFE_TITULO',
  'CHEFE_EPITETO', 'PORTAL_COMPLICACAO', 'BESTIARIO', 'EFEITOS_HAB', 'EFEITOS_DESP', 'TITULOS', 'ENCONTROS', 'statsAmeaca',
  'USOS_DESP', 'USOS_HAB',
];

export function carregarDataJs(caminho) {
  const codigo = readFileSync(caminho, 'utf8');
  const ctx = vm.createContext({ Math });
  vm.runInContext(`${codigo}\n;globalThis.__saida = { ${NOMES.join(', ')} };`, ctx, { timeout: 2000 });
  return ctx.__saida;
}

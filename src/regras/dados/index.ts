/* Ponto único de acesso aos dados do jogo, com índices por id. */
import { HABILIDADES, ARVORES } from './habilidades';
import { DESPERTARES } from './despertares';
import { TITULOS } from './titulos';
import type { Arvore, ArvoreId, Despertar, Habilidade, Titulo } from '../tipos';

export * from './base';
export * from './habilidades';
export * from './despertares';
export * from './itens';
export * from './portais';
export * from './titulos';

const indexar = <T extends { id: string }>(lista: T[]) => Object.fromEntries(lista.map((x) => [x.id, x])) as Record<string, T>;

export const HAB: Record<string, Habilidade> = indexar(HABILIDADES);
export const DESP: Record<string, Despertar> = indexar(DESPERTARES);
export const TIT: Record<string, Titulo> = indexar(TITULOS);
export const ARV = indexar(ARVORES) as Record<ArvoreId, Arvore>;

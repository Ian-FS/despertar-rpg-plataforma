/* Gerado por scripts/importar-data-js.mjs a partir do data.js do site original.
   Pode ser editado à mão; se reimportar, revise o diff. */
import type { Atributo, Pericia, Rank, InfoRank, Descritivo } from '../tipos';

export const ATRIBUTOS: Atributo[] = [
  {
    "id": "FOR",
    "nome": "Força",
    "desc": "Potência física, ataques corpo a corpo, Defender, Atletismo."
  },
  {
    "id": "AGI",
    "nome": "Agilidade",
    "desc": "Velocidade, precisão, ataques à distância, Esquivar, Iniciativa, Deslocamento."
  },
  {
    "id": "VIT",
    "nome": "Vitalidade",
    "desc": "Pontos de Vida, resistência física, venenos, exaustão."
  },
  {
    "id": "INT",
    "nome": "Inteligência",
    "desc": "Pontos de Mana, poderes de controle preciso, conhecimento."
  },
  {
    "id": "PER",
    "nome": "Percepção",
    "desc": "Sentidos, instinto, detectar mana, perceber ataques ocultos."
  },
  {
    "id": "PRE",
    "nome": "Presença",
    "desc": "Vontade, liderança, intimidação, comando de invocações."
  }
];

export const PERICIAS: Pericia[] = [
  {
    "n": "Atletismo",
    "a": "FOR"
  },
  {
    "n": "Acrobacia",
    "a": "AGI"
  },
  {
    "n": "Furtividade",
    "a": "AGI"
  },
  {
    "n": "Prestidigitação",
    "a": "AGI"
  },
  {
    "n": "Resistência",
    "a": "VIT"
  },
  {
    "n": "Conhecimento",
    "a": "INT"
  },
  {
    "n": "Investigação",
    "a": "INT"
  },
  {
    "n": "Medicina",
    "a": "INT"
  },
  {
    "n": "Percepção",
    "a": "PER"
  },
  {
    "n": "Sentir Mana",
    "a": "PER"
  },
  {
    "n": "Sobrevivência",
    "a": "PER"
  },
  {
    "n": "Intuição",
    "a": "PER"
  },
  {
    "n": "Persuasão",
    "a": "PRE"
  },
  {
    "n": "Intimidação",
    "a": "PRE"
  },
  {
    "n": "Enganação",
    "a": "PRE"
  }
];

export const RANKS: Record<Rank, InfoRank> = {
  "E": {
    "nome": "Rank E",
    "nivel": 1,
    "attr": 12,
    "custo": 1,
    "br": 0,
    "cor": "#9aa5b1"
  },
  "D": {
    "nome": "Rank D",
    "nivel": 5,
    "attr": 16,
    "custo": 2,
    "br": 1,
    "cor": "#5ad17a"
  },
  "C": {
    "nome": "Rank C",
    "nivel": 10,
    "attr": 20,
    "custo": 3,
    "br": 2,
    "cor": "#4aa8ff"
  },
  "B": {
    "nome": "Rank B",
    "nivel": 15,
    "attr": 25,
    "custo": 4,
    "br": 3,
    "cor": "#b06cff"
  },
  "A": {
    "nome": "Rank A",
    "nivel": 20,
    "attr": 30,
    "custo": 5,
    "br": 4,
    "cor": "#ffb340"
  },
  "S": {
    "nome": "Rank S",
    "nivel": 25,
    "attr": 36,
    "custo": 6,
    "br": 6,
    "cor": "#ff4d6d"
  }
};

export const CONDICOES: Descritivo[] = [
  {
    "n": "Agarrado",
    "desc": "Deslocamento 0 e −2 em ataques. Para escapar: Ação Principal e teste oposto de Atletismo ou Acrobacia."
  },
  {
    "n": "Amedrontado",
    "desc": "−2 em ataques e testes; não pode se aproximar voluntariamente da fonte do medo."
  },
  {
    "n": "Atordoado",
    "desc": "Não pode usar Reações nem Ações Especiais; no seu turno, apenas uma Ação Principal ou de Movimento."
  },
  {
    "n": "Cego",
    "desc": "Não percebe ataques (não pode Reagir), exceto de adjacentes com Percepção CD 15. −5 em ataques."
  },
  {
    "n": "Derrubado",
    "desc": "−4 em ataques corpo a corpo e em Esquivar. Levantar custa uma Ação de Movimento."
  },
  {
    "n": "Envenenado",
    "desc": "Sofre o dano indicado no início do turno. −2 em Resistências de VIT."
  },
  {
    "n": "Exausto",
    "desc": "−2 em todos os testes e deslocamento pela metade. Removido por descanso longo."
  },
  {
    "n": "Imobilizado",
    "desc": "Deslocamento 0. Não pode Esquivar."
  },
  {
    "n": "Incapacitado",
    "desc": "Causado só por efeitos que digam isso (medo extremo, por exemplo). Pode falar e perceber, mas não pode agir, reagir nem se mover. Ataques contra você usam a Defesa Passiva."
  },
  {
    "n": "No Limite",
    "desc": "Seus PV estão em 0 ou menos. Ao entrar nesse estado você cai Derrubado, mas continua lutando, com só 1 Ação Principal por rodada (mais a Ação de Movimento). A cura conta a partir do valor negativo. Morre ao chegar a −PV máximos. Se o combate terminar e você continuar No Limite, desmaia até receber cura que o leve acima de 0 PV ou até um descanso longo (que o deixa com todos os PV)."
  },
  {
    "n": "Inconsciente",
    "desc": "Não age, não reage, não percebe nada."
  },
  {
    "n": "Invisível",
    "desc": "Quem não o detecta não pode Reagir aos seus ataques nem mirar você normalmente."
  },
  {
    "n": "Lento",
    "desc": "Deslocamento pela metade e −1 Ação Principal por rodada (mínimo 1)."
  },
  {
    "n": "Queimando",
    "desc": "Sofre o dano indicado no início do turno. Uma Ação de Movimento apaga as chamas."
  },
  {
    "n": "Sangrando",
    "desc": "Perde o valor indicado de PV no início do turno até receber cura ou Medicina CD 15."
  },
  {
    "n": "Surpreso",
    "desc": "Na primeira rodada de combate, não age nem reage."
  }
];

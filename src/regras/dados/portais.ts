/* Gerado por scripts/importar-data-js.mjs a partir do data.js do site original.
   Pode ser editado à mão; se reimportar, revise o diff. */
import type { Rank, PortalTipo, Descritivo, Monstro, Encontro } from '../tipos';

export const PORTAL_RANK: { r: Rank; max: number }[] = [
  {
    "r": "E",
    "max": 40
  },
  {
    "r": "D",
    "max": 65
  },
  {
    "r": "C",
    "max": 80
  },
  {
    "r": "B",
    "max": 90
  },
  {
    "r": "A",
    "max": 97
  },
  {
    "r": "S",
    "max": 100
  }
];

export const PORTAL_NIVEL: Record<Rank, [number, number]> = {
  "E": [
    1,
    4
  ],
  "D": [
    5,
    9
  ],
  "C": [
    10,
    14
  ],
  "B": [
    15,
    19
  ],
  "A": [
    20,
    24
  ],
  "S": [
    25,
    30
  ]
};

export const PORTAL_TIPO: PortalTipo[] = [
  {
    "max": 13,
    "n": "Portal Comum",
    "d": "Masmorra padrão. O Portal permanece aberto e os Caçadores podem sair a qualquer momento.",
    "xp": 1,
    "raridade": 0
  },
  {
    "max": 15,
    "n": "Portal Vermelho",
    "d": "O Portal se fecha atrás do grupo. O tempo lá dentro corre diferente (1 dia dentro = 1 hora fora). Só se sai derrotando o Chefe.",
    "xp": 2,
    "raridade": 15
  },
  {
    "max": 16,
    "n": "Masmorra Dupla",
    "d": "Após o Chefe aparente, uma segunda masmorra oculta se abre — com um Chefe de Rank superior e regras estranhas.",
    "xp": 2,
    "raridade": 20
  },
  {
    "max": 18,
    "n": "Ruptura Iminente",
    "d": "O Portal está prestes a romper e liberar monstros na cidade. Há um prazo em horas (1d6 × 4).",
    "xp": 1.5,
    "raridade": 5
  },
  {
    "max": 19,
    "n": "Portal Instável",
    "d": "O Rank medido está errado: role novamente o Rank e use o maior.",
    "xp": 1.5,
    "raridade": 10
  },
  {
    "max": 20,
    "n": "Instância do Sistema",
    "d": "Uma masmorra visível apenas para os Portadores do Sistema. Regras e recompensas próprias.",
    "xp": 2,
    "raridade": 15
  }
];

export const PORTAL_AMBIENTE: string[] = [
  "Cavernas de cristal azul",
  "Floresta subterrânea com céu vermelho",
  "Fortaleza em ruínas",
  "Templo de pedra com estátuas",
  "Cidade fantasma submersa",
  "Pântano de névoa venenosa",
  "Planície congelada",
  "Deserto de cinzas",
  "Castelo flutuante",
  "Colmeia orgânica",
  "Labirinto de espelhos",
  "Mina abandonada tomada por fungos"
];

export const PORTAL_CRIATURAS: Descritivo[] = [
  {
    "n": "Goblins",
    "desc": "em bandos numerosos, com xamãs e arqueiros"
  },
  {
    "n": "Lobos de Presas de Aço",
    "desc": "caçam em matilhas e cercam presas feridas"
  },
  {
    "n": "Orcs de Guerra",
    "desc": "brutos disciplinados com tambores de guerra"
  },
  {
    "n": "Insetos Gigantes",
    "desc": "colônia com operárias, soldados e uma rainha"
  },
  {
    "n": "Mortos-vivos",
    "desc": "esqueletos e cavaleiros que voltam se não forem destruídos"
  },
  {
    "n": "Golens",
    "desc": "construtos de pedra e mana que guardam salões"
  },
  {
    "n": "Nagas",
    "desc": "serpentes humanoides que dominam a água"
  },
  {
    "n": "Elementais",
    "desc": "seres de fogo, gelo ou raio"
  },
  {
    "n": "Homens-lagarto",
    "desc": "emboscadores com lanças venenosas"
  },
  {
    "n": "Aranhas de Mana",
    "desc": "teias invisíveis e veneno paralisante"
  },
  {
    "n": "Ogros e Gigantes",
    "desc": "poucos, enormes e devastadores"
  },
  {
    "n": "Demônios Menores",
    "desc": "astutos, voadores e cruéis"
  }
];

export const CHEFE_TITULO: string[] = [
  "Rei",
  "Rainha",
  "General",
  "Senhor",
  "Guardião",
  "Devorador",
  "Carrasco",
  "Profeta",
  "Alfa",
  "Colosso",
  "Arauto",
  "Tirano"
];

export const CHEFE_EPITETO: string[] = [
  "de Presas Negras",
  "da Chama Pálida",
  "do Gelo Eterno",
  "das Mil Lâminas",
  "de Olhos Vermelhos",
  "da Coroa de Ossos",
  "do Abismo",
  "da Tempestade",
  "de Ferro",
  "Sem Rosto",
  "do Lamento",
  "Devorador de Mana"
];

export const PORTAL_COMPLICACAO: string[] = [
  "Uma guilda rival quer o mesmo Portal.",
  "Civis estão presos lá dentro.",
  "O Chefe tem uma segunda fase escondida.",
  "A mana do Portal bloqueia comunicação com o exterior.",
  "Um Caçador do grupo de reconhecimento desapareceu.",
  "Armadilhas antigas cobrem os corredores.",
  "Os monstros estão estranhamente organizados — alguém os comanda.",
  "O Portal está encolhendo: há pouco tempo.",
  "Uma Missão do Sistema exige algo específico aqui.",
  "Um item amaldiçoado está entre as recompensas.",
  "A Associação exige um relatório detalhado (Investigação CD 15).",
  "Nenhuma — por enquanto."
];

export const BESTIARIO: Monstro[] = [
  {
    "n": "Goblin Lanceiro",
    "r": "E",
    "L": 1,
    "cat": "Lacaio",
    "tr": "Em grupo: +1 no ataque para cada outro goblin adjacente ao alvo."
  },
  {
    "n": "Lobo de Presas de Aço",
    "r": "E",
    "L": 3,
    "cat": "Soldado",
    "tr": "Mordida derruba (Resistência FOR). Uiva: aliados lobos +2 no ataque por 1 rodada."
  },
  {
    "n": "Xamã Goblin",
    "r": "E",
    "L": 4,
    "cat": "Elite",
    "tr": "Projétil de fogo (18 m). Cura 2d8 em um goblin (Ação Principal)."
  },
  {
    "n": "Esqueleto Guardião",
    "r": "D",
    "L": 6,
    "cat": "Soldado",
    "tr": "RD 3 contra perfurante. Volta com metade dos PV em 1d4 rodadas se não for destruído com dano sagrado ou crítico."
  },
  {
    "n": "Orc Berserker",
    "r": "D",
    "L": 8,
    "cat": "Elite",
    "tr": "Abaixo da metade dos PV: +1 Ação Principal. Brado: Lacaios orcs não podem ficar Amedrontados."
  },
  {
    "n": "Naga Sentinela",
    "r": "C",
    "L": 11,
    "cat": "Elite",
    "tr": "Na água: +4 em Reações. Olhar paralisante: Resistência PRE ou Imobilizado 1 rodada."
  },
  {
    "n": "Cavaleiro da Lâmina Partida",
    "r": "C",
    "L": 13,
    "cat": "Chefe",
    "tr": "Fase 2 (50% PV): suas armas ganham alcance 4,5 m. Contra-ataque gratuito ao Defender com sucesso."
  },
  {
    "n": "Golem de Mana",
    "r": "B",
    "L": 16,
    "cat": "Elite",
    "tr": "RD dobrada contra dano físico; núcleo exposto após um crítico (RD 0 por 1 rodada)."
  },
  {
    "n": "Aranha Rainha do Véu",
    "r": "B",
    "L": 18,
    "cat": "Chefe",
    "tr": "Teias invisíveis: área Imobiliza. Invoca 1d4 Lacaios-aranha por rodada."
  },
  {
    "n": "Gigante da Geada",
    "r": "A",
    "L": 22,
    "cat": "Chefe",
    "tr": "Tamanho Enorme (alcance 4,5 m). Pisotear: cone 9 m, Derrubado. Aura gélida: Lento a 3 m."
  },
  {
    "n": "Arauto Demoníaco",
    "r": "A",
    "L": 24,
    "cat": "Elite",
    "tr": "Voo. Chamas infernais ignoram RD de fogo. Ao morrer, explode (6d10, raio 6 m)."
  },
  {
    "n": "Dragão Ancião",
    "r": "S",
    "L": 30,
    "cat": "Chefe",
    "tr": "Tamanho Colossal. Sopro (cone 30 m, 15d10). Presença: Resistência PRE ou Amedrontado. Ações Lendárias: 1 ação extra no fim do turno de cada inimigo."
  }
];

export const ENCONTROS: Record<"Fácil" | "Médio" | "Difícil" | "Chefe", Encontro[]> = {
  "Fácil": [
    {
      "cat": "Lacaio",
      "deltaNivel": 0,
      "qtd": 6
    }
  ],
  "Médio": [
    {
      "cat": "Soldado",
      "deltaNivel": 0,
      "qtd": 3
    },
    {
      "cat": "Lacaio",
      "deltaNivel": 0,
      "qtd": 4
    }
  ],
  "Difícil": [
    {
      "cat": "Elite",
      "deltaNivel": 1,
      "qtd": 1
    },
    {
      "cat": "Soldado",
      "deltaNivel": 0,
      "qtd": 3
    }
  ],
  "Chefe": [
    {
      "cat": "Chefe",
      "deltaNivel": 2,
      "qtd": 1
    },
    {
      "cat": "Elite",
      "deltaNivel": 0,
      "qtd": 2
    }
  ]
};

/* Gerado por scripts/importar-data-js.mjs a partir do data.js do site original.
   Pode ser editado à mão; se reimportar, revise o diff. */
import type { Arma, Armadura, InfoRaridadeItem, Afixo, Descritivo, Rank } from '../tipos';

export const ARMAS: Arma[] = [
  {
    "n": "Adaga",
    "dano": "1d4",
    "alc": "1,5 m",
    "a": "AGI",
    "tags": "leve, arremessável (9 m)"
  },
  {
    "n": "Espada Curta",
    "dano": "1d6",
    "alc": "1,5 m",
    "a": "AGI",
    "tags": "leve"
  },
  {
    "n": "Katana",
    "dano": "1d8",
    "alc": "1,5 m",
    "a": "AGI",
    "tags": "precisa (crítico 19–20 com Refino +5)"
  },
  {
    "n": "Espada",
    "dano": "1d8",
    "alc": "1,5 m",
    "a": "FOR",
    "tags": ""
  },
  {
    "n": "Espada Pesada",
    "dano": "1d10",
    "alc": "1,5 m",
    "a": "FOR",
    "tags": "duas mãos"
  },
  {
    "n": "Machado",
    "dano": "1d8",
    "alc": "1,5 m",
    "a": "FOR",
    "tags": ""
  },
  {
    "n": "Machado Pesado",
    "dano": "1d12",
    "alc": "1,5 m",
    "a": "FOR",
    "tags": "duas mãos"
  },
  {
    "n": "Lança",
    "dano": "1d8",
    "alc": "3 m",
    "a": "FOR",
    "tags": "duas mãos, alcance"
  },
  {
    "n": "Martelo",
    "dano": "1d8",
    "alc": "1,5 m",
    "a": "FOR",
    "tags": ""
  },
  {
    "n": "Martelo Pesado",
    "dano": "2d6",
    "alc": "1,5 m",
    "a": "FOR",
    "tags": "duas mãos"
  },
  {
    "n": "Manoplas",
    "dano": "1d6",
    "alc": "1,5 m",
    "a": "FOR",
    "tags": "conta como ataque desarmado"
  },
  {
    "n": "Foice",
    "dano": "1d10",
    "alc": "3 m",
    "a": "FOR",
    "tags": "duas mãos, alcance"
  },
  {
    "n": "Cajado",
    "dano": "1d6",
    "alc": "1,5 m",
    "a": "INT",
    "tags": "foco: soma o Bônus de Rank ao dano de poderes"
  },
  {
    "n": "Arco",
    "dano": "1d6",
    "alc": "30 m",
    "a": "AGI",
    "tags": "duas mãos, distância"
  },
  {
    "n": "Arco Longo",
    "dano": "1d8",
    "alc": "45 m",
    "a": "AGI",
    "tags": "duas mãos, distância"
  },
  {
    "n": "Besta",
    "dano": "1d10",
    "alc": "30 m",
    "a": "AGI",
    "tags": "duas mãos, distância, recarga (Ação de Movimento)"
  },
  {
    "n": "Facas de Arremesso",
    "dano": "1d4",
    "alc": "9 m",
    "a": "AGI",
    "tags": "distância, leve"
  }
];

export const ARMADURAS: Armadura[] = [
  {
    "n": "Traje de Combate",
    "tipo": "Leve",
    "def": 1,
    "esq": 0
  },
  {
    "n": "Couraça de Couro de Besta",
    "tipo": "Média",
    "def": 2,
    "esq": -1
  },
  {
    "n": "Armadura de Placas",
    "tipo": "Pesada",
    "def": 3,
    "esq": -3
  }
];

export const ACESSORIOS: string[] = [
  "Anel",
  "Colar",
  "Brinco",
  "Bracelete",
  "Cinto",
  "Manto",
  "Botas",
  "Luvas"
];

export const RARIDADES: InfoRaridadeItem[] = [
  {
    "n": "Comum",
    "min": 1,
    "max": 45,
    "afx": 0,
    "selos": 0,
    "cor": "#9aa5b1",
    "mult": 1
  },
  {
    "n": "Incomum",
    "min": 46,
    "max": 70,
    "afx": 1,
    "selos": 0,
    "cor": "#5ad17a",
    "mult": 2
  },
  {
    "n": "Raro",
    "min": 71,
    "max": 87,
    "afx": 2,
    "selos": 1,
    "cor": "#4aa8ff",
    "mult": 5
  },
  {
    "n": "Épico",
    "min": 88,
    "max": 97,
    "afx": 3,
    "selos": 2,
    "cor": "#b06cff",
    "mult": 15
  },
  {
    "n": "Lendário",
    "min": 98,
    "max": 109,
    "afx": 3,
    "selos": 3,
    "cor": "#ffb340",
    "mult": 50
  },
  {
    "n": "Relíquia",
    "min": 110,
    "max": 999,
    "afx": 4,
    "selos": 3,
    "cor": "#ff4d6d",
    "mult": 150
  }
];

export const AFIXOS: Record<"arma" | "armadura" | "acessorio", Afixo[]> = {
  "arma": [
    {
      "n": "Afiada",
      "sufixo": "da Precisão",
      "desc": "+X nas rolagens de ataque."
    },
    {
      "n": "Brutal",
      "sufixo": "da Ruína",
      "desc": "+2X de dano."
    },
    {
      "n": "Flamejante",
      "sufixo": "das Brasas",
      "desc": "+Xd4 de dano de fogo; críticos deixam Queimando (1d6)."
    },
    {
      "n": "Gélida",
      "sufixo": "do Inverno",
      "desc": "+Xd4 de dano de gelo; acertos reduzem 1,5 m de deslocamento do alvo."
    },
    {
      "n": "Trovejante",
      "sufixo": "da Tempestade",
      "desc": "+Xd4 de dano de raio; críticos deixam Atordoado."
    },
    {
      "n": "Venenosa",
      "sufixo": "da Víbora",
      "desc": "Acertos deixam Envenenado (Xd4 por 2 rodadas)."
    },
    {
      "n": "Vampírica",
      "sufixo": "da Sede",
      "desc": "Você recupera PV iguais a 1/4 do dano causado."
    },
    {
      "n": "Faminta",
      "sufixo": "do Abismo",
      "desc": "Cada acerto recupera X PM."
    },
    {
      "n": "Letal",
      "sufixo": "do Carrasco",
      "desc": "Margem de crítico +1 (+2 se o item for Rank A ou S)."
    },
    {
      "n": "Perfurante",
      "sufixo": "do Rompimento",
      "desc": "Ignora 2X de RD."
    },
    {
      "n": "Caçadora",
      "sufixo": "da Caçada",
      "desc": "+3X de dano contra criaturas de nível maior que o seu."
    },
    {
      "n": "Ressonante",
      "sufixo": "da Mana",
      "desc": "+X de dano em habilidades usadas com esta arma."
    },
    {
      "n": "Veloz",
      "sufixo": "do Vento",
      "desc": "+X em Iniciativa e +1,5 m de deslocamento."
    },
    {
      "n": "Pesada",
      "sufixo": "do Impacto",
      "desc": "Acertos empurram o alvo 1,5 m (3 m se o item for Rank A ou S)."
    },
    {
      "n": "Ceifadora",
      "sufixo": "da Colheita",
      "desc": "Ao derrubar um inimigo, +X no próximo ataque desta rodada."
    },
    {
      "n": "Sagrada",
      "sufixo": "da Aurora",
      "desc": "+Xd4 de dano contra mortos-vivos, demônios e criaturas de sombra."
    },
    {
      "n": "Silenciosa",
      "sufixo": "do Silêncio",
      "desc": "+2X em Furtividade; ataques contra alvos Surpresos causam +X de dano."
    },
    {
      "n": "Leal",
      "sufixo": "da Lealdade",
      "desc": "Não pode ser desarmada; volta à sua mão como Ação Livre."
    },
    {
      "n": "Quebradora",
      "sufixo": "da Ruptura",
      "desc": "O alvo atingido sofre −X na próxima Reação de Defender."
    },
    {
      "n": "Sedenta",
      "sufixo": "do Fluxo",
      "desc": "Ao causar um crítico, recupera X PV e X PM."
    }
  ],
  "armadura": [
    {
      "n": "Robusta",
      "sufixo": "da Muralha",
      "desc": "+X na Reação de Defender."
    },
    {
      "n": "Esguia",
      "sufixo": "da Brisa",
      "desc": "Remove a penalidade de Esquivar e concede +X em Esquivar."
    },
    {
      "n": "Vital",
      "sufixo": "da Vida",
      "desc": "+5X PV máximos."
    },
    {
      "n": "Arcana",
      "sufixo": "da Mana",
      "desc": "+5X PM máximos."
    },
    {
      "n": "Ignífuga",
      "sufixo": "da Chama Fria",
      "desc": "RD 2X contra fogo."
    },
    {
      "n": "Térmica",
      "sufixo": "do Calor",
      "desc": "RD 2X contra gelo."
    },
    {
      "n": "Isolante",
      "sufixo": "da Terra",
      "desc": "RD 2X contra raio."
    },
    {
      "n": "Espinhosa",
      "sufixo": "dos Espinhos",
      "desc": "Atacantes corpo a corpo que o acertarem sofrem Xd6."
    },
    {
      "n": "Regenerativa",
      "sufixo": "da Renovação",
      "desc": "Recupera X PV no início de cada turno em combate."
    },
    {
      "n": "Firme",
      "sufixo": "da Montanha",
      "desc": "+X em Resistências de FOR e VIT; não pode ser Derrubado por criaturas de nível menor."
    },
    {
      "n": "Sombria",
      "sufixo": "das Sombras",
      "desc": "+2X em Furtividade."
    },
    {
      "n": "Refletora",
      "sufixo": "do Espelho",
      "desc": "1× por combate, ao resistir a um poder, devolva Xd6 de dano ao conjurador."
    }
  ],
  "acessorio": [
    {
      "n": "Forte",
      "sufixo": "do Touro",
      "desc": "+2X de Força."
    },
    {
      "n": "Ágil",
      "sufixo": "do Gato",
      "desc": "+2X de Agilidade."
    },
    {
      "n": "Vigoroso",
      "sufixo": "do Urso",
      "desc": "+2X de Vitalidade."
    },
    {
      "n": "Sábio",
      "sufixo": "da Coruja",
      "desc": "+2X de Inteligência."
    },
    {
      "n": "Atento",
      "sufixo": "do Falcão",
      "desc": "+2X de Percepção."
    },
    {
      "n": "Imponente",
      "sufixo": "do Leão",
      "desc": "+2X de Presença."
    },
    {
      "n": "Sortudo",
      "sufixo": "da Fortuna",
      "desc": "X vezes por dia, role novamente um d20."
    },
    {
      "n": "Focado",
      "sufixo": "da Concentração",
      "desc": "+X na CD de todos os seus poderes."
    },
    {
      "n": "Profundo",
      "sufixo": "do Poço",
      "desc": "+5X PM máximos."
    },
    {
      "n": "Resiliente",
      "sufixo": "da Raiz",
      "desc": "+5X PV máximos."
    },
    {
      "n": "Ligeiro",
      "sufixo": "da Lebre",
      "desc": "+X m de deslocamento."
    },
    {
      "n": "Vigilante",
      "sufixo": "da Vigília",
      "desc": "+X em Iniciativa."
    }
  ]
};

export const SELOS: Descritivo[] = [
  {
    "n": "Fome de Sangue",
    "desc": "Ao derrotar um inimigo, ganhe uma Ação de Movimento extra imediatamente."
  },
  {
    "n": "Eco",
    "desc": "1× por combate, repita o último poder usado sem custo de PM."
  },
  {
    "n": "Laço",
    "desc": "Você pode invocar este item para a sua mão como Ação Livre, de qualquer distância."
  },
  {
    "n": "Memória do Antigo Dono",
    "desc": "+1 nível em uma habilidade (escolhida pelo Mestre) enquanto o item estiver equipado."
  },
  {
    "n": "Estandarte",
    "desc": "Aliados a 9 m recebem +1 em Reações."
  },
  {
    "n": "Fúria Contida",
    "desc": "Abaixo da metade dos PV, +2X de dano (ou +X Defender, se armadura)."
  },
  {
    "n": "Proteção Final",
    "desc": "1× por dia, anule um golpe que o reduziria a 0 PV."
  },
  {
    "n": "Absorção",
    "desc": "Críticos causados ou recebidos restauram 2X PM."
  },
  {
    "n": "Voz da Arma",
    "desc": "O item sussurra avisos: você nunca é Surpreendido e recebe +2 em Intuição."
  },
  {
    "n": "Retorno",
    "desc": "Arremessável a 9 m; volta para a sua mão no fim do turno."
  },
  {
    "n": "Despertar Elemental",
    "desc": "Converta todo o dano do item em fogo, gelo ou raio à vontade; +Xd6 de dano elemental."
  },
  {
    "n": "Inquebrável",
    "desc": "O item não pode ser destruído, desarmado nem tirado de você contra a sua vontade."
  }
];

export const NOMES_RELIQUIA: string[] = [
  "do Rei Caído",
  "da Primeira Ruptura",
  "do Monarca Esquecido",
  "da Lua Negra",
  "do Vigia Eterno",
  "da Coroa Partida",
  "do Último Portal",
  "do Dragão Adormecido",
  "da Estrela Cadente",
  "do Imperador Sem Nome"
];

export const CONSUMIVEIS: Descritivo[] = [
  {
    "n": "Poção de Cura",
    "desc": "Recupera (2 + 2×BR)d8 PV. Ação Principal (ou de Movimento, se o Rank da poção for inferior ao seu)."
  },
  {
    "n": "Poção de Mana",
    "desc": "Recupera (2 + 2×BR)d6 PM."
  },
  {
    "n": "Antídoto",
    "desc": "Remove Envenenado e concede imunidade a veneno de Rank igual ou inferior por 1 hora."
  },
  {
    "n": "Pedra de Retorno",
    "desc": "Teleporta o usuário para fora do Portal (não funciona em Portais Vermelhos)."
  },
  {
    "n": "Pergaminho de Habilidade",
    "desc": "Ensina uma habilidade sorteada deste Rank sem custo de aquisição (requisitos de nível e atributo ainda valem)."
  },
  {
    "n": "Elixir de Despertar",
    "desc": "Muito raro: +1 permanente em um atributo à sua escolha (máximo de 1 por Rank do personagem)."
  },
  {
    "n": "Cristal de Mana",
    "desc": "Mana solidificada, com Rank. Moeda e material de Refino. Vende por: E 10 · D 40 · C 160 · B 600 · A 2.400 · S 10.000 Ouro."
  },
  {
    "n": "Núcleo de Chefe",
    "desc": "Coração cristalizado de um Chefe, com o Rank do Portal. Todo Chefe deixa 1. Serve para Ascender itens (Núcleo do Rank seguinte ao do item) ou Forjar."
  },
  {
    "n": "Pó de Purificação",
    "desc": "Remove a maldição de um item (o item continua com seus afixos e Selos)."
  },
  {
    "n": "Pergaminho de Selo",
    "desc": "Revela todos os Selos ocultos de um item (não os desbloqueia)."
  },
  {
    "n": "Chave de Instância",
    "desc": "Abre uma Instância do Sistema privada do Rank da chave (uma masmorra só para o grupo, com recompensas normais)."
  }
];

export const PRECO_BASE: Record<Rank, number> = {
  "E": 50,
  "D": 200,
  "C": 800,
  "B": 3000,
  "A": 12000,
  "S": 50000
};

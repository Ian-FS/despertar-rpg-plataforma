/* Gerado por scripts/importar-data-js.mjs a partir do data.js do site original.
   Pode ser editado à mão; se reimportar, revise o diff. */
import type { UsoDespertarSite, UsoHabilidadeSite } from '../tipos';

export const USOS_DESP: Record<string, UsoDespertarSite[]> = {
  "d01": [
    {
      "n": "Dobrar a RD",
      "acao": "Ação de Movimento",
      "pm": 2,
      "freq": "À vontade"
    },
    {
      "n": "Forma de Aço",
      "acao": "Ação Livre",
      "pm": 15,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d02": [
    {
      "n": "Revestir a arma",
      "acao": "Ação Livre",
      "pm": 1,
      "pm5": 0,
      "freq": "1× por rodada"
    },
    {
      "n": "Lâmina Absoluta",
      "acao": "Ação Principal",
      "pm": 10,
      "freq": "À vontade",
      "forma": true
    }
  ],
  "d04": [
    {
      "n": "Velocidade Divina",
      "acao": "Ação Livre",
      "pm": 0,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d05": [
    {
      "n": "Projétil de fogo",
      "acao": "Ação Principal",
      "pm": 2,
      "freq": "À vontade"
    }
  ],
  "d06": [
    {
      "n": "Cura",
      "acao": "Ação Principal",
      "acao5": "Ação de Movimento",
      "pm": 2,
      "freq": "À vontade"
    }
  ],
  "d07": [
    {
      "n": "Barreira (+Defender)",
      "acao": "Reação",
      "pm": 2,
      "freq": "1× por rodada"
    },
    {
      "n": "Parede",
      "acao": "Ação Principal",
      "pm": 4,
      "freq": "1 parede por vez",
      "desde": 3
    },
    {
      "n": "Domo",
      "acao": "Ação Especial",
      "pm": 20,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d08": [
    {
      "n": "Tiro Inevitável",
      "acao": "Ação Livre",
      "pm": 0,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d09": [
    {
      "n": "Entrar em Fúria",
      "acao": "Ação Livre",
      "pm": 2,
      "freq": "1× por rodada"
    }
  ],
  "d10": [
    {
      "n": "Toque Gélido",
      "acao": "Ação Principal",
      "pm": 2,
      "freq": "À vontade"
    },
    {
      "n": "Criar gelo sólido",
      "acao": "Ação Principal",
      "pm": 2,
      "freq": "À vontade",
      "desde": 3
    },
    {
      "n": "Inverno Eterno",
      "acao": "Ação Especial",
      "pm": 20,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d13": [
    {
      "n": "Raio em linha",
      "acao": "Ação Principal",
      "pm": 3,
      "freq": "À vontade"
    },
    {
      "n": "Teleporte de raio",
      "acao": "Ação de Movimento",
      "pm": 3,
      "freq": "À vontade",
      "desde": 3
    },
    {
      "n": "Tempestade Viva",
      "acao": "Ação Livre",
      "pm": 20,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d14": [
    {
      "n": "Mover / arremessar",
      "acao": "Ação Principal",
      "pm": 2,
      "freq": "À vontade"
    },
    {
      "n": "Parar projéteis",
      "acao": "Reação",
      "pm": 0,
      "freq": "1× por rodada",
      "desde": 5
    },
    {
      "n": "Mão do Céu",
      "acao": "Ação Principal",
      "pm": 20,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d15": [
    {
      "n": "Forma bestial",
      "acao": "Ação de Movimento",
      "pm": 4,
      "freq": "À vontade"
    }
  ],
  "d16": [
    {
      "n": "Gravar runa",
      "acao": "10 minutos, fora de combate",
      "pm": 0,
      "freq": "Runas ativas: 1 por nível"
    },
    {
      "n": "Runa armadilha",
      "acao": "10 minutos",
      "pm": 0,
      "freq": "Conta como runa ativa",
      "desde": 3
    },
    {
      "n": "Escriba do Sistema",
      "acao": "Fora de combate",
      "pm": 0,
      "freq": "1× por mês",
      "forma": true
    }
  ],
  "d17": [
    {
      "n": "Amedrontar",
      "acao": "Ação Livre",
      "pm": 3,
      "freq": "1× por rodada"
    }
  ],
  "d18": [
    {
      "n": "Envenenar o próximo acerto",
      "acao": "Ação Livre",
      "pm": 2,
      "freq": "1× por rodada"
    },
    {
      "n": "Nuvem tóxica",
      "acao": "Ação Principal",
      "pm": 4,
      "freq": "À vontade",
      "desde": 3
    }
  ],
  "d19": [
    {
      "n": "Criar clone",
      "acao": "Ação Principal",
      "pm": 4,
      "freq": "Até o máximo de clones"
    },
    {
      "n": "Trocar com um clone",
      "acao": "Reação",
      "pm": 0,
      "freq": "1× por rodada",
      "desde": 5
    }
  ],
  "d20": [
    {
      "n": "Absorver poder",
      "acao": "Reação",
      "pm": 5,
      "freq": "1× por rodada",
      "desde": 5
    },
    {
      "n": "Devorar",
      "acao": "Ao derrotar um Chefe",
      "pm": 0,
      "freq": "1× por aventura",
      "forma": true
    }
  ],
  "d21": [
    {
      "n": "Crescer",
      "acao": "Ação de Movimento",
      "pm": 6,
      "freq": "À vontade"
    }
  ],
  "d22": [
    {
      "n": "Área de gravidade",
      "acao": "Ação Principal",
      "pm": 4,
      "freq": "À vontade"
    },
    {
      "n": "Singularidade",
      "acao": "Ação Especial",
      "pm": 25,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d23": [
    {
      "n": "Teleporte",
      "acao": "Ação de Movimento",
      "pm": 3,
      "freq": "À vontade"
    },
    {
      "n": "Teleporte de esquiva",
      "acao": "Reação",
      "pm": 6,
      "freq": "1× por rodada",
      "desde": 5
    },
    {
      "n": "Portal Pessoal",
      "acao": "10 minutos",
      "pm": 20,
      "freq": "1× por dia",
      "forma": true
    }
  ],
  "d24": [
    {
      "n": "Explosão de luz",
      "acao": "Ação Principal",
      "pm": 4,
      "freq": "À vontade"
    },
    {
      "n": "Milagre",
      "acao": "1 hora de ritual",
      "pm": 50,
      "freq": "1× por semana",
      "forma": true
    }
  ],
  "d25": [
    {
      "n": "Lâmina de vento",
      "acao": "Ação Principal",
      "pm": 3,
      "freq": "À vontade"
    },
    {
      "n": "Furacão",
      "acao": "Ação Especial",
      "pm": 25,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d26": [
    {
      "n": "Criar arma",
      "acao": "Ação Livre",
      "pm": 2,
      "freq": "1× por rodada"
    },
    {
      "n": "Arsenal Infinito",
      "acao": "Ação Especial",
      "pm": 25,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d27": [
    {
      "n": "Mil Futuros",
      "acao": "Ação Livre",
      "pm": 0,
      "freq": "1× por dia",
      "forma": true
    }
  ],
  "d28": [
    {
      "n": "Lâmina de sangue",
      "acao": "Ação Principal",
      "pm": 3,
      "freq": "À vontade"
    },
    {
      "n": "Maré Carmesim",
      "acao": "Ação Principal",
      "pm": 20,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d29": [
    {
      "n": "Sopro de fogo negro",
      "acao": "Ação Principal",
      "pm": 6,
      "freq": "À vontade"
    },
    {
      "n": "Forma Dracônica",
      "acao": "Ação Especial",
      "pm": 30,
      "freq": "1× por dia",
      "forma": true
    }
  ],
  "d31": [
    {
      "n": "Invocar enxame",
      "acao": "Ação Principal",
      "pm": 5,
      "freq": "Até o máximo de enxames"
    },
    {
      "n": "Colmeia",
      "acao": "Ação Especial",
      "pm": 20,
      "freq": "1× por combate",
      "forma": true
    }
  ],
  "d32": [
    {
      "n": "Erguer Sombra",
      "acao": "Ação Especial",
      "pm": 5,
      "freq": "Até 3 tentativas por corpo"
    },
    {
      "n": "Invocar Sombra",
      "acao": "Ação de Movimento",
      "pmRank": true,
      "freq": "Até o máximo de Sombras invocadas"
    },
    {
      "n": "Trocar de lugar com uma Sombra",
      "acao": "Ação de Movimento",
      "pm": 0,
      "freq": "À vontade",
      "desde": 3
    }
  ]
};

export const USOS_HAB: Record<string, UsoHabilidadeSite[]> = {
  "lam2": [
    {
      "n": "Primeiro Corte Rápido da rodada",
      "pm": 0,
      "desde": 5
    }
  ],
  "pun2": [
    {
      "n": "Primeiro Contra-Ataque da rodada",
      "pm": 0,
      "desde": 5
    }
  ],
  "bas5": [
    {
      "n": "Primeiro Guardião da rodada",
      "pm": 0,
      "desde": 5
    }
  ],
  "res6": [
    {
      "n": "Primeira Égide da rodada",
      "pm": 0,
      "desde": 5
    }
  ],
  "dom6": [
    {
      "n": "Primeira Troca da rodada",
      "pm": 0,
      "desde": 5
    }
  ],
  "res1": [
    {
      "n": "Cura como Ação de Movimento",
      "pm": 6,
      "desde": 3
    }
  ],
  "ele1": [
    {
      "n": "Dois projéteis numa Ação Principal",
      "pm": 4,
      "desde": 5
    }
  ],
  "aur6": [
    {
      "n": "Como Reação contra ataque à distância",
      "pm": 24,
      "desde": 3
    }
  ],
  "sen2": [
    {
      "n": "Análise sem custo",
      "pm": 0,
      "desde": 5,
      "substitui": true
    }
  ],
  "lam9": [
    {
      "n": "Primeira resposta da rodada",
      "pm": 0,
      "desde": 5
    }
  ],
  "aur9": [
    {
      "n": "Desviar projétil (Reação)",
      "pm": 8,
      "desde": 3
    }
  ]
};

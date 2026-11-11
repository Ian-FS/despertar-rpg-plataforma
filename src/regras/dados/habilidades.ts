/* Gerado por scripts/importar-data-js.mjs a partir do data.js do site original.
   Pode ser editado à mão; se reimportar, revise o diff. */
import type { Arvore, Habilidade } from '../tipos';

export const ARVORES: Arvore[] = [
  {
    "id": "lamina",
    "nome": "Lâmina",
    "atr": "FOR/AGI",
    "cor": "#4aa8ff",
    "icone": "⚔",
    "desc": "Domínio de armas brancas: cortes precisos, golpes pesados e lâminas de mana projetadas."
  },
  {
    "id": "punho",
    "nome": "Punho",
    "atr": "FOR/VIT",
    "cor": "#ff7a45",
    "icone": "✊",
    "desc": "Combate desarmado. O corpo do Caçador torna-se sua arma mais confiável."
  },
  {
    "id": "vulto",
    "nome": "Vulto",
    "atr": "AGI/PER",
    "cor": "#8a7dff",
    "icone": "☾",
    "desc": "Furtividade, velocidade e golpes letais contra quem não consegue reagir."
  },
  {
    "id": "disparo",
    "nome": "Disparo",
    "atr": "AGI/PER",
    "cor": "#3fd0c9",
    "icone": "➶",
    "desc": "Arcos, bestas e projéteis. Precisão absoluta à longa distância."
  },
  {
    "id": "bastiao",
    "nome": "Bastião",
    "atr": "VIT/FOR",
    "cor": "#c7a64a",
    "icone": "⛨",
    "desc": "Defesa, provocação e proteção de aliados. A linha de frente de qualquer raide."
  },
  {
    "id": "elementos",
    "nome": "Elementos",
    "atr": "INT",
    "cor": "#ff4d6d",
    "icone": "✹",
    "desc": "Fogo, gelo e raio moldados pela mana. Dano em área e controle do campo."
  },
  {
    "id": "restauracao",
    "nome": "Restauração",
    "atr": "INT/PRE",
    "cor": "#5ad17a",
    "icone": "✚",
    "desc": "Cura, purificação e reforço. Nenhum raide sobrevive sem um curandeiro."
  },
  {
    "id": "dominio",
    "nome": "Domínio",
    "atr": "PRE/INT",
    "cor": "#b06cff",
    "icone": "♛",
    "desc": "Invocações, feras domadas e correntes de mana. Lutar através de outros."
  },
  {
    "id": "sentidos",
    "nome": "Sentidos",
    "atr": "PER",
    "cor": "#e4e46a",
    "icone": "◉",
    "desc": "Detectar mana, analisar inimigos, prever ataques e revelar fraquezas."
  },
  {
    "id": "aura",
    "nome": "Aura",
    "atr": "VIT/PRE",
    "cor": "#6ad0ff",
    "icone": "❂",
    "desc": "Mana circulando pelo corpo: fortalecimento, presença opressora e explosões de poder."
  }
];

export const HABILIDADES: Habilidade[] = [
  {
    "id": "lam1",
    "t": "lamina",
    "r": "E",
    "n": "Domínio de Armas",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "FOR/AGI",
    "pre": [],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "+1 nas rolagens de ataque com armas corpo a corpo.",
    "esc": "+1 ataque por nível.",
    "m3": "Margem de crítico 19–20 com armas corpo a corpo.",
    "m5": "Margem de crítico 18–20 e você pode sacar ou trocar de arma como Ação Livre."
  },
  {
    "id": "lam2",
    "t": "lamina",
    "r": "E",
    "n": "Corte Rápido",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 2,
    "attr": "AGI",
    "pre": [],
    "alc": "Arma",
    "dur": "Instantânea",
    "ef": "Ataque corpo a corpo com +1d6 de dano. Se acertar, você pode se mover 3 m sem provocar Ataques de Oportunidade.",
    "esc": "+1d6 de dano por nível.",
    "m3": "O movimento gratuito passa a 6 m.",
    "m5": "A primeira utilização em cada rodada não custa PM."
  },
  {
    "id": "lam3",
    "t": "lamina",
    "r": "D",
    "n": "Lâminas Gêmeas",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "AGI",
    "pre": [
      [
        "lam1",
        2
      ]
    ],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "Empunhando duas armas leves, 1×/rodada, ao acertar um ataque com uma delas, faça um ataque extra com a outra (sem gastar Ação Principal). O ataque extra não soma o modificador ao dano.",
    "esc": "+1 de dano no ataque extra por nível.",
    "m3": "O ataque extra passa a somar o modificador de atributo ao dano.",
    "m5": "Até 2 ataques extras por rodada."
  },
  {
    "id": "lam4",
    "t": "lamina",
    "r": "D",
    "n": "Golpe Esmagador",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 4,
    "attr": "FOR",
    "pre": [
      [
        "lam1",
        2
      ]
    ],
    "alc": "Arma",
    "dur": "1 rodada",
    "ef": "Ataque corpo a corpo com +2d8 de dano. Se acertar, o alvo faz Resistência (VIT) contra sua CD (FOR) ou fica Atordoado até o fim do próximo turno dele.",
    "esc": "+1d8 de dano por nível.",
    "m3": "A CD do Atordoamento recebe +2.",
    "m5": "Atordoamento dura 2 rodadas; chefes ficam apenas Lentos."
  },
  {
    "id": "lam5",
    "t": "lamina",
    "r": "C",
    "n": "Corte Vácuo",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 6,
    "attr": "FOR/AGI",
    "pre": [
      [
        "lam2",
        2
      ],
      [
        "lam4",
        1
      ]
    ],
    "alc": "12 m",
    "dur": "Instantânea",
    "preAny": true,
    "ef": "Você dispara uma lâmina de mana: ataque à distância usando o atributo da arma. Dano da arma +3d6.",
    "esc": "+1d6 de dano e +6 m de alcance por nível.",
    "m3": "A lâmina atravessa: faça a rolagem contra todos em uma linha.",
    "m5": "Ignora toda Redução de Dano (RD)."
  },
  {
    "id": "lam6",
    "t": "lamina",
    "r": "B",
    "n": "Dança das Lâminas",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 10,
    "attr": "AGI",
    "pre": [
      [
        "lam5",
        2
      ]
    ],
    "alc": "Deslocamento ×2",
    "dur": "Instantânea",
    "ef": "Mova-se até o dobro do seu Deslocamento e faça um ataque corpo a corpo contra cada inimigo pelo qual passar (máximo 3 alvos).",
    "esc": "+1 alvo máximo por nível.",
    "m3": "O movimento não provoca Ataques de Oportunidade.",
    "m5": "Cada ataque causa +2d6 de dano."
  },
  {
    "id": "lam7",
    "t": "lamina",
    "r": "A",
    "n": "Intenção Cortante",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "FOR/AGI",
    "pre": [
      [
        "lam6",
        3
      ]
    ],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "Seus ataques com armas ignoram 5 de RD e causam +2 de dano.",
    "esc": "+2 de dano por nível.",
    "m3": "Alvos atingidos sofrem −2 em Reações até o seu próximo turno.",
    "m5": "Em um acerto crítico, os dados de dano da arma são maximizados antes de dobrar."
  },
  {
    "id": "lam8",
    "t": "lamina",
    "r": "S",
    "n": "Corte do Horizonte",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 30,
    "attr": "FOR/AGI",
    "pre": [
      [
        "lam7",
        3
      ]
    ],
    "alc": "Linha de 60 m",
    "dur": "Instantânea",
    "freq": "1× por combate",
    "ef": "Um único corte que divide o campo. Faça uma rolagem de ataque contra todos na linha. Dano: 10d10 + modificador + metade do nível. Quem reagir com sucesso sofre metade.",
    "esc": "+2d10 de dano por nível.",
    "m3": "Estruturas na linha são partidas ao meio.",
    "m5": "Pode ser usado 2× por combate."
  },
  {
    "id": "pun1",
    "t": "punho",
    "r": "E",
    "n": "Punhos de Ferro",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "FOR",
    "pre": [],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "Seu ataque desarmado causa 1d6 e conta como arma do seu Rank (recebe o Bônus de Rank).",
    "esc": "O dado sobe: 1d8 (nv2), 1d10 (nv3), 2d6 (nv4), 2d8 (nv5).",
    "m3": "Você pode atacar desarmado com qualquer parte do corpo, mesmo com as mãos ocupadas.",
    "m5": "Ataques desarmados ignoram 5 de RD."
  },
  {
    "id": "pun2",
    "t": "punho",
    "r": "E",
    "n": "Contra-Ataque",
    "tipo": "Ativa",
    "acao": "Reação",
    "pm": 2,
    "attr": "FOR/AGI",
    "pre": [],
    "alc": "Corpo a corpo",
    "dur": "Instantânea",
    "ef": "Após Defender com sucesso um ataque corpo a corpo, faça imediatamente um ataque desarmado contra o atacante.",
    "esc": "+1d6 de dano no contra-ataque por nível.",
    "m3": "Também funciona após uma Esquiva bem-sucedida.",
    "m5": "Não custa PM uma vez por rodada."
  },
  {
    "id": "pun3",
    "t": "punho",
    "r": "D",
    "n": "Agarrão Brutal",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 3,
    "attr": "FOR",
    "pre": [
      [
        "pun1",
        2
      ]
    ],
    "alc": "Corpo a corpo",
    "dur": "Sustentada",
    "ef": "Teste oposto de Atletismo. Se vencer, o alvo fica Agarrado e sofre seu dano desarmado automaticamente no início de cada turno seu.",
    "esc": "+1d6 ao dano automático por nível.",
    "m3": "Ação Principal: arremesse o alvo agarrado até 6 m (dano desarmado + 2d6).",
    "m5": "Pode agarrar criaturas de qualquer tamanho."
  },
  {
    "id": "pun4",
    "t": "punho",
    "r": "D",
    "n": "Fôlego de Combate",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "VIT",
    "pre": [
      [
        "pun2",
        1
      ]
    ],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "Enquanto estiver com metade ou menos dos PV, recupera 2 PV no início de cada turno seu.",
    "esc": "+2 PV por turno por nível.",
    "m3": "Também recupera 2 PM por turno nessas condições.",
    "m5": "No início do turno, remove uma condição entre Atordoado, Lento ou Amedrontado."
  },
  {
    "id": "pun5",
    "t": "punho",
    "r": "C",
    "n": "Sequência Relâmpago",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 6,
    "attr": "FOR/AGI",
    "pre": [
      [
        "pun1",
        3
      ]
    ],
    "alc": "Corpo a corpo",
    "dur": "Instantânea",
    "ef": "Realize 4 ataques desarmados contra alvos ao seu alcance, podendo dar 1,5 m de passo entre eles sem provocar Ataques de Oportunidade.",
    "esc": "+1 ataque por nível.",
    "m3": "Cada acerto empurra o alvo 1,5 m (você pode acompanhá-lo).",
    "m5": "Se todos os ataques acertarem o mesmo alvo, ele fica Atordoado."
  },
  {
    "id": "pun6",
    "t": "punho",
    "r": "B",
    "n": "Impacto Sísmico",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 10,
    "attr": "FOR",
    "pre": [
      [
        "pun5",
        2
      ],
      [
        "pun3",
        2
      ]
    ],
    "alc": "Raio 4,5 m",
    "dur": "Instantânea",
    "ef": "Você golpeia o chão. Criaturas no raio sofrem 4d8 + mod FOR e fazem Resistência (FOR) ou ficam Derrubadas. Sucesso: metade do dano.",
    "esc": "+1d8 de dano e +1,5 m de raio por nível.",
    "m3": "O terreno no raio vira terreno difícil (deslocamento pela metade).",
    "m5": "Criaturas voadoras a até 9 m de altura também são atingidas."
  },
  {
    "id": "pun7",
    "t": "punho",
    "r": "A",
    "n": "Corpo Inquebrável",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "VIT",
    "pre": [
      [
        "pun4",
        3
      ]
    ],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "Você recebe RD 4 e imunidade a Sangramento.",
    "esc": "+2 RD por nível.",
    "m3": "Imune a Atordoado.",
    "m5": "Imune a ser empurrado ou derrubado contra a sua vontade."
  },
  {
    "id": "pun8",
    "t": "punho",
    "r": "S",
    "n": "Golpe do Colapso",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 30,
    "attr": "FOR",
    "pre": [
      [
        "pun6",
        3
      ],
      [
        "pun7",
        1
      ]
    ],
    "alc": "Corpo a corpo",
    "dur": "Instantânea",
    "freq": "1× por combate",
    "ef": "Um soco que concentra toda a sua mana. Se acertar, role o dano normalmente e multiplique o total por 3. Errar ainda causa o dano normal a estruturas.",
    "esc": "Nível 2: ×3 + 10; nível 3: ×3 + 20; nível 4: ×4; nível 5: ×4 + 20.",
    "m3": "A onda de choque causa metade do dano a todos em 6 m do alvo.",
    "m5": "O alvo não pode usar Reação contra este golpe se estiver Agarrado ou Derrubado."
  },
  {
    "id": "vul1",
    "t": "vulto",
    "r": "E",
    "n": "Passos Silenciosos",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "AGI",
    "pre": [],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "+2 em Furtividade. Seus passos não produzem som.",
    "esc": "+2 em Furtividade por nível.",
    "m3": "Você pode se esconder mesmo sendo observado, se houver sombra ou cobertura.",
    "m5": "Ao ficar parado, criaturas sem detecção de mana não o percebem."
  },
  {
    "id": "vul2",
    "t": "vulto",
    "r": "E",
    "n": "Golpe Furtivo",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "AGI",
    "pre": [],
    "alc": "Arma",
    "dur": "Permanente",
    "ef": "Ataques contra um alvo que não pode usar Reação contra você causam +1d6 de dano.",
    "esc": "+1d6 por nível.",
    "m3": "Também se aplica contra alvos Derrubados, Agarrados ou Cegos.",
    "m5": "Também se aplica quando um aliado está adjacente ao alvo (flanquear)."
  },
  {
    "id": "vul3",
    "t": "vulto",
    "r": "D",
    "n": "Rastro Fantasma",
    "tipo": "Ativa",
    "acao": "Ação de Movimento",
    "pm": 3,
    "attr": "AGI",
    "pre": [
      [
        "vul1",
        2
      ]
    ],
    "alc": "Pessoal",
    "dur": "Até o fim do turno",
    "ef": "Você se move com +3 m de deslocamento e sem provocar Ataques de Oportunidade.",
    "esc": "+3 m por nível.",
    "m3": "Pode atravessar o espaço de inimigos.",
    "m5": "Pode correr sobre paredes e superfícies verticais durante o movimento."
  },
  {
    "id": "vul4",
    "t": "vulto",
    "r": "D",
    "n": "Lâmina Venenosa",
    "tipo": "Ativa",
    "acao": "Ação Livre",
    "pm": 2,
    "attr": "AGI/INT",
    "pre": [
      [
        "vul2",
        1
      ]
    ],
    "alc": "Arma",
    "dur": "3 rodadas",
    "ef": "Seu próximo acerto deixa o alvo Envenenado: 1d6 de dano no início de cada turno dele por 3 rodadas (Resistência VIT anula).",
    "esc": "+1d6 de dano de veneno por nível.",
    "m3": "Envenenado também sofre −2 em Reações.",
    "m5": "O veneno impede qualquer cura enquanto durar."
  },
  {
    "id": "vul5",
    "t": "vulto",
    "r": "C",
    "n": "Ocultar Presença",
    "tipo": "Ativa",
    "acao": "Ação de Movimento",
    "pm": 6,
    "attr": "AGI/PER",
    "pre": [
      [
        "vul1",
        3
      ]
    ],
    "alc": "Pessoal",
    "dur": "1 minuto",
    "ef": "Você apaga sua presença: fica Invisível para criaturas sem detecção de mana. O efeito termina quando você ataca.",
    "esc": "+1 minuto de duração por nível.",
    "m3": "Após atacar, Ação de Movimento + teste de Furtividade (CD 15 + nível do inimigo mais forte) para ocultar-se de novo sem PM.",
    "m5": "Até criaturas com detecção de mana precisam vencer seu teste de Furtividade para percebê-lo."
  },
  {
    "id": "vul6",
    "t": "vulto",
    "r": "B",
    "n": "Passo Instantâneo",
    "tipo": "Ativa",
    "acao": "Reação",
    "pm": 8,
    "attr": "AGI",
    "pre": [
      [
        "vul3",
        3
      ]
    ],
    "alc": "6 m",
    "dur": "Instantânea",
    "freq": "1× por rodada",
    "ef": "Quando for alvo de um ataque que perceba, teleporte-se até 6 m antes da rolagem: o ataque erra automaticamente.",
    "esc": "+3 m de distância por nível.",
    "m3": "Pode usar 2× por rodada.",
    "m5": "Você pode reaparecer atrás do atacante e fazer um ataque imediato contra ele (que não pode reagir)."
  },
  {
    "id": "vul7",
    "t": "vulto",
    "r": "A",
    "n": "Ponto Vital",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "AGI/PER",
    "pre": [
      [
        "vul2",
        4
      ],
      [
        "vul5",
        2
      ]
    ],
    "alc": "Arma",
    "dur": "Permanente",
    "ef": "Sua margem de crítico aumenta em 1 (cumulativo com outras fontes). Críticos causam +1d10 de dano.",
    "esc": "+1d10 de dano em críticos por nível.",
    "m3": "Críticos deixam o alvo Sangrando (5 PV por turno).",
    "m5": "Golpe Furtivo também dobra seus dados em críticos."
  },
  {
    "id": "vul8",
    "t": "vulto",
    "r": "S",
    "n": "Execução Silenciosa",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 25,
    "attr": "AGI",
    "pre": [
      [
        "vul7",
        3
      ],
      [
        "vul6",
        2
      ]
    ],
    "alc": "Arma",
    "dur": "Instantânea",
    "freq": "1× por combate",
    "ef": "Ataque contra um alvo que não pode reagir. Se, após o dano, o alvo estiver com 25% ou menos dos PV máximos, ele morre. Chefes fazem Resistência (VIT) para sobreviver com 1 PV.",
    "esc": "+5% no limiar por nível (30%, 35%…).",
    "m3": "Ao matar com esta habilidade, ela é recarregada.",
    "m5": "Chefes sofrem a Resistência com −5."
  },
  {
    "id": "dis1",
    "t": "disparo",
    "r": "E",
    "n": "Mira Firme",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "AGI/PER",
    "pre": [],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "+1 nas rolagens de ataque à distância.",
    "esc": "+1 por nível.",
    "m3": "Ignora cobertura parcial.",
    "m5": "Atacar à distância adjacente a inimigos não provoca Ataque de Oportunidade."
  },
  {
    "id": "dis2",
    "t": "disparo",
    "r": "E",
    "n": "Tiro Duplo",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 2,
    "attr": "AGI",
    "pre": [],
    "alc": "Arma",
    "dur": "Instantânea",
    "ef": "Faça dois ataques à distância, cada um com −4.",
    "esc": "A penalidade diminui em 1 por nível (−3, −2, −1, 0).",
    "m3": "Os dois disparos podem ter alvos diferentes.",
    "m5": "Três disparos sem penalidade."
  },
  {
    "id": "dis3",
    "t": "disparo",
    "r": "D",
    "n": "Flecha de Mana",
    "tipo": "Ativa",
    "acao": "Ação Livre",
    "pm": 3,
    "attr": "AGI/INT",
    "pre": [
      [
        "dis1",
        2
      ]
    ],
    "alc": "Arma",
    "dur": "1 ataque",
    "ef": "Cria um projétil de mana: o próximo ataque à distância causa +1d8 de dano e não precisa de munição.",
    "esc": "+1d8 por nível.",
    "m3": "Você escolhe o tipo do dano: fogo, gelo, raio ou mana pura.",
    "m5": "O projétil persegue o alvo: ignora cobertura total se você souber onde ele está."
  },
  {
    "id": "dis4",
    "t": "disparo",
    "r": "D",
    "n": "Olho de Falcão",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "PER",
    "pre": [
      [
        "dis1",
        1
      ]
    ],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "O alcance das suas armas à distância é dobrado e você recebe +2 em Percepção visual.",
    "esc": "+2 em Percepção visual por nível.",
    "m3": "Alcance triplicado; você enxerga através de neblina e fumaça.",
    "m5": "Seus ataques à distância não sofrem penalidade por alvos invisíveis que você tenha visto nesta rodada."
  },
  {
    "id": "dis5",
    "t": "disparo",
    "r": "C",
    "n": "Chuva de Flechas",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 8,
    "attr": "AGI",
    "pre": [
      [
        "dis2",
        3
      ]
    ],
    "alc": "Raio 6 m no alcance",
    "dur": "Instantânea",
    "ef": "Faça uma rolagem de ataque contra todas as criaturas na área. Dano: arma + 2d6.",
    "esc": "+1d6 de dano por nível.",
    "m3": "Você pode excluir aliados da área.",
    "m5": "A área se torna terreno difícil coberto de flechas por 1 rodada."
  },
  {
    "id": "dis6",
    "t": "disparo",
    "r": "B",
    "n": "Tiro Perfurante",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 10,
    "attr": "AGI",
    "pre": [
      [
        "dis3",
        3
      ]
    ],
    "alc": "Linha (alcance da arma)",
    "dur": "Instantânea",
    "ef": "O disparo atravessa tudo em linha. Rolagem de ataque contra cada alvo; o bônus de escudo e a RD não se aplicam. Dano: arma + 4d8.",
    "esc": "+1d8 por nível.",
    "m3": "Atravessa barreiras e paredes de até 1 m.",
    "m5": "Alvos atingidos sofrem −2 em Reações por 1 rodada."
  },
  {
    "id": "dis7",
    "t": "disparo",
    "r": "A",
    "n": "Marca do Caçador",
    "tipo": "Ativa",
    "acao": "Ação Livre",
    "pm": 6,
    "attr": "PER",
    "pre": [
      [
        "dis4",
        3
      ]
    ],
    "alc": "90 m",
    "dur": "Fim do combate",
    "ef": "Marque um alvo. Seus ataques contra ele recebem +2 no acerto e +1d6 de dano, e ele não pode ficar Invisível ou se esconder de você.",
    "esc": "+1 acerto e +1d6 de dano por nível.",
    "m3": "Aliados também recebem metade dos bônus contra o alvo marcado.",
    "m5": "Ao derrotar o alvo marcado, transfira a marca para outro sem custo."
  },
  {
    "id": "dis8",
    "t": "disparo",
    "r": "S",
    "n": "Disparo Estelar",
    "tipo": "Ativa",
    "acao": "Ação Especial (carregar 1 rodada)",
    "pm": 30,
    "attr": "AGI/PER",
    "pre": [
      [
        "dis6",
        3
      ],
      [
        "dis7",
        2
      ]
    ],
    "alc": "1 km",
    "dur": "Instantânea",
    "freq": "1× por combate",
    "ef": "Concentre-se por uma rodada (sem Reações). No turno seguinte, dispare: ataque com +10 contra um alvo, causando 12d12 de dano. Se for interrompido, o PM é perdido.",
    "esc": "+2d12 por nível.",
    "m3": "Explode no impacto: metade do dano em raio de 6 m.",
    "m5": "Não exige rodada de carga."
  },
  {
    "id": "bas1",
    "t": "bastiao",
    "r": "E",
    "n": "Pele Resistente",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "VIT",
    "pre": [],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "RD 1 contra todo dano físico.",
    "esc": "+1 RD por nível.",
    "m3": "A RD também se aplica a dano elemental.",
    "m5": "Você recebe +10 PV máximos."
  },
  {
    "id": "bas2",
    "t": "bastiao",
    "r": "E",
    "n": "Provocar",
    "tipo": "Ativa",
    "acao": "Ação Livre",
    "pm": 2,
    "attr": "VIT/PRE",
    "pre": [],
    "alc": "9 m",
    "dur": "1 rodada",
    "ef": "Um inimigo faz Resistência (PRE). Se falhar, sofre −4 em ataques contra qualquer alvo que não seja você.",
    "esc": "+3 m de alcance por nível.",
    "m3": "Afeta até 3 inimigos.",
    "m5": "Afeta todos os inimigos no alcance; dura 2 rodadas."
  },
  {
    "id": "bas3",
    "t": "bastiao",
    "r": "D",
    "n": "Escudo de Mana",
    "tipo": "Ativa",
    "acao": "Reação (junto ao Defender)",
    "pm": 3,
    "attr": "VIT/FOR",
    "pre": [
      [
        "bas1",
        2
      ]
    ],
    "alc": "Pessoal",
    "dur": "Instantânea",
    "ef": "Ao Defender, some +2 à rolagem.",
    "esc": "+2 por nível.",
    "m3": "Se a Defesa vencer por 5 ou mais, o atacante é empurrado 3 m.",
    "m5": "Pode ser usado para um aliado adjacente: você rola a Reação de Defender por ele."
  },
  {
    "id": "bas4",
    "t": "bastiao",
    "r": "D",
    "n": "Postura Inabalável",
    "tipo": "Ativa",
    "acao": "Ação de Movimento",
    "pm": 3,
    "attr": "VIT",
    "pre": [
      [
        "bas1",
        1
      ]
    ],
    "alc": "Pessoal",
    "dur": "Até seu próximo turno",
    "ef": "Seu deslocamento vira 0, mas você não pode ser movido nem derrubado e recebe +3 em Defender e +3 de RD.",
    "esc": "+1 Defender e +1 RD por nível.",
    "m3": "Inimigos adjacentes que tentarem se afastar de você não podem usar Corrida.",
    "m5": "Ataques que você Defender com sucesso não causam nenhum efeito secundário."
  },
  {
    "id": "bas5",
    "t": "bastiao",
    "r": "C",
    "n": "Guardião",
    "tipo": "Ativa",
    "acao": "Reação",
    "pm": 4,
    "attr": "VIT/FOR",
    "pre": [
      [
        "bas2",
        2
      ],
      [
        "bas3",
        2
      ]
    ],
    "alc": "3 m",
    "dur": "Instantânea",
    "ef": "Quando um aliado no alcance for alvo de um ataque, você troca de lugar com ele e se torna o alvo.",
    "esc": "+1,5 m de alcance por nível.",
    "m3": "Você recebe +4 na Reação contra esse ataque.",
    "m5": "Sem custo uma vez por rodada."
  },
  {
    "id": "bas6",
    "t": "bastiao",
    "r": "B",
    "n": "Fortaleza Viva",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "VIT",
    "pre": [
      [
        "bas4",
        3
      ]
    ],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "Seus PV máximos aumentam em 1 × seu Nível de personagem.",
    "esc": "+1 × Nível por nível de habilidade (nv5 = +5 × Nível).",
    "m3": "Você não fica Incapacitado ao chegar a 0 PV até o fim do seu próximo turno.",
    "m5": "Imune a efeitos de morte instantânea vindos de habilidades."
  },
  {
    "id": "bas7",
    "t": "bastiao",
    "r": "A",
    "n": "Muralha de Mana",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 15,
    "attr": "VIT/INT",
    "pre": [
      [
        "bas5",
        3
      ]
    ],
    "alc": "18 m",
    "dur": "1 minuto",
    "ef": "Cria uma barreira de 9 m × 3 m com 30 PV + 5 × seu Nível. Ataques e projéteis não a atravessam até que seja destruída.",
    "esc": "+20 PV na barreira por nível.",
    "m3": "Pode ter formato de cúpula (raio 4,5 m).",
    "m5": "A barreira recupera 10% dos PV no início do seu turno."
  },
  {
    "id": "bas8",
    "t": "bastiao",
    "r": "S",
    "n": "Último Bastião",
    "tipo": "Ativa",
    "acao": "Reação",
    "pm": 30,
    "attr": "VIT",
    "pre": [
      [
        "bas6",
        3
      ],
      [
        "bas7",
        2
      ]
    ],
    "alc": "18 m",
    "dur": "2 rodadas",
    "freq": "1× por combate",
    "ef": "Quando você ou um aliado no alcance sofreria dano que o reduziria a 0 PV ou menos, ignore todo esse dano. Por 2 rodadas, todos os aliados no alcance recebem RD 10.",
    "esc": "+1 rodada de duração e +2 RD por nível.",
    "m3": "Aliados no alcance também ficam imunes a Amedrontado.",
    "m5": "Pode ser usado 2× por combate."
  },
  {
    "id": "ele1",
    "t": "elementos",
    "r": "E",
    "n": "Projétil Elemental",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 2,
    "attr": "INT",
    "pre": [],
    "alc": "18 m",
    "dur": "Instantânea",
    "ef": "Ataque à distância (INT). Dano 1d10 + mod INT + metade do nível. Escolha o elemento: Fogo (Queimando 1d4 por 1 rodada), Gelo (−3 m de deslocamento por 1 rodada) ou Raio (−1 em Reações por 1 rodada).",
    "esc": "+1d10 de dano por nível.",
    "m3": "Alcance 36 m.",
    "m5": "Pode disparar dois projéteis com uma única Ação Principal (custo dobrado)."
  },
  {
    "id": "ele2",
    "t": "elementos",
    "r": "E",
    "n": "Afinidade Elemental",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "INT",
    "pre": [],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "Escolha um elemento (fogo, gelo ou raio). Você recebe RD 3 contra ele e +1 de dano em todos os poderes desse elemento.",
    "esc": "+3 RD e +1 dano por nível.",
    "m3": "Pode escolher um segundo elemento.",
    "m5": "Imunidade ao elemento principal."
  },
  {
    "id": "ele3",
    "t": "elementos",
    "r": "D",
    "n": "Explosão de Chamas",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 5,
    "attr": "INT",
    "pre": [
      [
        "ele1",
        2
      ]
    ],
    "alc": "Raio 3 m a até 30 m",
    "dur": "Instantânea",
    "ef": "Uma esfera de fogo explode. Faça uma rolagem de ataque (INT) contra cada criatura na área. Dano 3d6 + mod INT; atingidos ficam Queimando (1d6 por 2 rodadas).",
    "esc": "+1d6 de dano por nível.",
    "m3": "Raio 4,5 m.",
    "m5": "Raio 6 m; o fogo permanece na área por 2 rodadas."
  },
  {
    "id": "ele4",
    "t": "elementos",
    "r": "D",
    "n": "Prisão de Gelo",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 5,
    "attr": "INT",
    "pre": [
      [
        "ele1",
        2
      ]
    ],
    "alc": "18 m",
    "dur": "1 rodada",
    "ef": "O alvo faz Resistência (AGI). Se falhar, fica Imobilizado e sofre 2d6 de dano de gelo.",
    "esc": "+1d6 de dano por nível.",
    "m3": "A duração passa a 2 rodadas.",
    "m5": "Afeta até 3 alvos."
  },
  {
    "id": "ele5",
    "t": "elementos",
    "r": "C",
    "n": "Corrente de Raios",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 8,
    "attr": "INT",
    "pre": [
      [
        "ele3",
        2
      ],
      [
        "ele4",
        1
      ]
    ],
    "preAny": true,
    "alc": "18 m",
    "dur": "Instantânea",
    "ef": "Um raio salta entre até 3 alvos (cada um a até 9 m do anterior). Rolagem de ataque contra cada um; dano 4d8.",
    "esc": "+1 alvo e +1d8 de dano por nível.",
    "m3": "Atingidos sofrem −2 em Reações até o seu próximo turno.",
    "m5": "O raio nunca atinge aliados e pode retornar ao primeiro alvo."
  },
  {
    "id": "ele6",
    "t": "elementos",
    "r": "B",
    "n": "Tempestade Elemental",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 14,
    "attr": "INT",
    "pre": [
      [
        "ele5",
        2
      ]
    ],
    "alc": "Raio 9 m a até 60 m",
    "dur": "3 rodadas",
    "ef": "Cria uma zona de tempestade. Criaturas que comecem o turno ou entrem nela sofrem 5d8 de dano do seu elemento (Resistência AGI reduz à metade).",
    "esc": "+1d8 por nível.",
    "m3": "Você pode mover a zona 9 m por rodada como Ação de Movimento.",
    "m5": "Duração de 5 rodadas."
  },
  {
    "id": "ele7",
    "t": "elementos",
    "r": "A",
    "n": "Encarnação Elemental",
    "tipo": "Ativa",
    "acao": "Ação de Movimento",
    "pm": 20,
    "attr": "INT",
    "pre": [
      [
        "ele6",
        3
      ],
      [
        "ele2",
        3
      ]
    ],
    "alc": "Pessoal",
    "dur": "1 minuto",
    "ef": "Você se torna feito do seu elemento: imune a ele, quem o acerta corpo a corpo sofre 2d10, e seus poderes elementais custam metade dos PM.",
    "esc": "+1d10 no dano de toque por nível.",
    "m3": "Você pode voar com seu Deslocamento.",
    "m5": "Seus poderes elementais ignoram imunidades e resistências."
  },
  {
    "id": "ele8",
    "t": "elementos",
    "r": "S",
    "n": "Cataclismo",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 40,
    "attr": "INT",
    "pre": [
      [
        "ele7",
        3
      ]
    ],
    "alc": "Raio 30 m a até 300 m",
    "dur": "Instantânea",
    "freq": "1× por dia",
    "ef": "Uma calamidade elemental. Rolagem de ataque (INT) contra todos na área; dano 15d10. Quem reagir com sucesso sofre metade.",
    "esc": "+3d10 por nível.",
    "m3": "Você escolhe quem é afetado dentro da área.",
    "m5": "Pode ser usado 1× por combate (em vez de por dia)."
  },
  {
    "id": "res1",
    "t": "restauracao",
    "r": "E",
    "n": "Cura",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 3,
    "attr": "INT/PRE",
    "pre": [],
    "alc": "9 m",
    "dur": "Instantânea",
    "ef": "Um aliado recupera 2d8 + mod INT PV.",
    "esc": "+1d8 por nível.",
    "m3": "Alcance 18 m; pode ser usada como Ação de Movimento (custo dobrado).",
    "m5": "Remove a condição Incapacitado mesmo que a cura não traga o alvo a 1 PV (ele fica com 1 PV)."
  },
  {
    "id": "res2",
    "t": "restauracao",
    "r": "E",
    "n": "Bênção de Vigor",
    "tipo": "Ativa",
    "acao": "Ação de Movimento",
    "pm": 2,
    "attr": "PRE/INT",
    "pre": [],
    "alc": "9 m",
    "dur": "3 rodadas",
    "ef": "Um aliado recebe +1 em ataques e Reações.",
    "esc": "+1 por nível.",
    "m3": "Afeta até 3 aliados.",
    "m5": "Afeta todos os aliados no alcance."
  },
  {
    "id": "res3",
    "t": "restauracao",
    "r": "D",
    "n": "Purificar",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 4,
    "attr": "INT/PRE",
    "pre": [
      [
        "res1",
        2
      ]
    ],
    "alc": "9 m",
    "dur": "Instantânea",
    "ef": "Remove uma condição entre Envenenado, Queimando, Sangrando, Cego ou Amedrontado de um aliado.",
    "esc": "Remove +1 condição por nível.",
    "m3": "Também remove Atordoado e Lento.",
    "m5": "O alvo fica imune à condição removida por 1 minuto."
  },
  {
    "id": "res4",
    "t": "restauracao",
    "r": "D",
    "n": "Regeneração",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 5,
    "attr": "INT",
    "pre": [
      [
        "res1",
        2
      ]
    ],
    "alc": "9 m",
    "dur": "1 minuto",
    "ef": "O alvo recupera 1d6 PV no início de cada turno dele.",
    "esc": "+1d6 por nível.",
    "m3": "Pode manter dois alvos ao mesmo tempo.",
    "m5": "A regeneração funciona mesmo com o alvo Incapacitado."
  },
  {
    "id": "res5",
    "t": "restauracao",
    "r": "C",
    "n": "Onda Restauradora",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 10,
    "attr": "INT/PRE",
    "pre": [
      [
        "res1",
        3
      ]
    ],
    "alc": "Raio 9 m",
    "dur": "Instantânea",
    "ef": "Todos os aliados na área recuperam 3d8 + mod INT PV.",
    "esc": "+1d8 por nível.",
    "m3": "Raio 18 m.",
    "m5": "Também remove uma condição de cada aliado."
  },
  {
    "id": "res6",
    "t": "restauracao",
    "r": "B",
    "n": "Égide Sagrada",
    "tipo": "Ativa",
    "acao": "Reação",
    "pm": 8,
    "attr": "PRE/INT",
    "pre": [
      [
        "res2",
        3
      ],
      [
        "res3",
        2
      ]
    ],
    "alc": "18 m",
    "dur": "1 minuto",
    "ef": "Quando um aliado for atingido, conceda a ele 15 PV temporários antes de aplicar o dano.",
    "esc": "+10 PV temporários por nível.",
    "m3": "Enquanto tiver esses PV temporários, o aliado é imune a Atordoado.",
    "m5": "Uma vez por rodada sem custo."
  },
  {
    "id": "res7",
    "t": "restauracao",
    "r": "A",
    "n": "Sopro de Vida",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 20,
    "attr": "INT/PRE",
    "pre": [
      [
        "res4",
        3
      ],
      [
        "res5",
        3
      ]
    ],
    "alc": "Toque",
    "dur": "Instantânea",
    "freq": "1× por dia",
    "ef": "Um aliado que morreu há no máximo 1 rodada volta à vida com 1 PV (o corpo precisa estar razoavelmente intacto).",
    "esc": "+1 rodada de janela por nível.",
    "m3": "O alvo volta com metade dos PV máximos.",
    "m5": "Restaura membros perdidos e pode ser usado 2× por dia."
  },
  {
    "id": "res8",
    "t": "restauracao",
    "r": "S",
    "n": "Santuário",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 40,
    "attr": "PRE/INT",
    "pre": [
      [
        "res6",
        3
      ],
      [
        "res7",
        1
      ]
    ],
    "alc": "Raio 18 m",
    "dur": "3 rodadas",
    "freq": "1× por combate",
    "ef": "Uma área sagrada: aliados dentro dela recuperam 20 PV no início de cada turno e são imunes a condições.",
    "esc": "+1 rodada e +5 PV por turno por nível.",
    "m3": "Inimigos que entram na área ficam Lentos.",
    "m5": "Aliados que morrerem dentro do Santuário ficam com 1 PV no lugar (1× por aliado)."
  },
  {
    "id": "dom1",
    "t": "dominio",
    "r": "E",
    "n": "Invocar Familiar",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 3,
    "attr": "PRE/INT",
    "pre": [],
    "alc": "9 m",
    "dur": "1 hora",
    "ef": "Invoca um espírito de mana (Lacaio de nível igual ao seu). Ele age no seu turno usando sua Ação de Movimento e uma Ação Principal sua.",
    "esc": "O familiar ganha +1 nível efetivo por nível.",
    "m3": "Pode manter 2 familiares.",
    "m5": "Familiares viram Soldados (veja Criação de Ameaças)."
  },
  {
    "id": "dom2",
    "t": "dominio",
    "r": "E",
    "n": "Elo de Comando",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "PRE",
    "pre": [],
    "alc": "30 m",
    "dur": "Permanente",
    "ef": "Suas invocações e feras domadas recebem +1 em ataques e Reações e podem agir sem gastar suas ações (1 invocação por rodada).",
    "esc": "+1 por nível e +1 invocação que age livremente a cada 2 níveis.",
    "m3": "Você compartilha os sentidos de uma invocação como Ação Livre.",
    "m5": "Invocações usam o seu bônus de Nível + mod PRE em ataques, se for melhor."
  },
  {
    "id": "dom3",
    "t": "dominio",
    "r": "D",
    "n": "Domar Fera",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 6,
    "attr": "PRE",
    "pre": [
      [
        "dom2",
        1
      ]
    ],
    "alc": "9 m",
    "dur": "Permanente",
    "ef": "Uma besta com metade ou menos dos PV e nível ≤ ao seu faz Resistência (PRE). Se falhar, torna-se sua companheira leal. Máximo de companheiros: 1.",
    "esc": "+1 companheiro máximo por nível.",
    "m3": "Pode domar Elites.",
    "m5": "Pode tentar domar um Chefe derrotado (a Resistência tem −5)."
  },
  {
    "id": "dom4",
    "t": "dominio",
    "r": "D",
    "n": "Correntes de Mana",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 5,
    "attr": "INT/PRE",
    "pre": [
      [
        "dom1",
        2
      ]
    ],
    "alc": "18 m",
    "dur": "1 rodada",
    "ef": "Correntes surgem do chão. O alvo faz Resistência (FOR) ou fica Imobilizado.",
    "esc": "+1 de CD por nível.",
    "m3": "Duração de 2 rodadas; o alvo também fica Agarrado.",
    "m5": "Afeta até 3 alvos."
  },
  {
    "id": "dom5",
    "t": "dominio",
    "r": "C",
    "n": "Legião",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "PRE",
    "pre": [
      [
        "dom1",
        3
      ]
    ],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "Você pode manter +2 invocações ativas. Suas invocações recebem +5 PV.",
    "esc": "+1 invocação e +5 PV por nível.",
    "m3": "Invocar Familiar passa a invocar 2 familiares por uso.",
    "m5": "Quando uma invocação morre, você recupera 5 PM."
  },
  {
    "id": "dom6",
    "t": "dominio",
    "r": "B",
    "n": "Troca de Alma",
    "tipo": "Ativa",
    "acao": "Ação de Movimento",
    "pm": 6,
    "attr": "PRE/INT",
    "pre": [
      [
        "dom5",
        2
      ]
    ],
    "alc": "60 m",
    "dur": "Instantânea",
    "ef": "Troque de lugar instantaneamente com uma de suas invocações ou feras.",
    "esc": "+30 m de alcance por nível.",
    "m3": "Pode ser usada como Reação ao ser atacado (o ataque atinge a invocação).",
    "m5": "Sem custo uma vez por rodada."
  },
  {
    "id": "dom7",
    "t": "dominio",
    "r": "A",
    "n": "Invocar Guardião",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 20,
    "attr": "PRE",
    "pre": [
      [
        "dom6",
        2
      ],
      [
        "dom4",
        2
      ]
    ],
    "alc": "18 m",
    "dur": "1 minuto",
    "ef": "Invoca um Guardião de mana: uma Elite de nível igual ao seu, com uma habilidade de Rank C à sua escolha.",
    "esc": "Guardião +1 nível efetivo por nível; +1 minuto.",
    "m3": "O Guardião ganha a forma que você quiser (cavaleiro, fera, dragão menor…) e uma habilidade Rank B.",
    "m5": "O Guardião se torna um Chefe."
  },
  {
    "id": "dom8",
    "t": "dominio",
    "r": "S",
    "n": "Exército de Mana",
    "tipo": "Ativa",
    "acao": "Ação Especial",
    "pm": 40,
    "attr": "PRE",
    "pre": [
      [
        "dom7",
        3
      ],
      [
        "dom5",
        3
      ]
    ],
    "alc": "60 m",
    "dur": "10 minutos",
    "freq": "1× por dia",
    "ef": "Invoca 10 Soldados de nível igual ao seu, que agem juntos como uma única tropa no seu turno.",
    "esc": "+5 Soldados por nível.",
    "m3": "Uma das unidades é uma Elite que comanda as demais.",
    "m5": "Todas as unidades recebem as passivas de Domínio que você possui."
  },
  {
    "id": "sen1",
    "t": "sentidos",
    "r": "E",
    "n": "Detectar Mana",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "PER",
    "pre": [],
    "alc": "9 m",
    "dur": "Permanente",
    "ef": "Você sente fontes de mana no alcance, mesmo invisíveis ou atrás de paredes, e estima o Rank de criaturas (teste de Sentir Mana).",
    "esc": "+9 m de alcance por nível.",
    "m3": "Você pode Reagir a ataques de criaturas invisíveis dentro do alcance.",
    "m5": "Você identifica o tipo de poder (elemento, invocação, etc.) de quem detecta."
  },
  {
    "id": "sen2",
    "t": "sentidos",
    "r": "E",
    "n": "Análise",
    "tipo": "Ativa",
    "acao": "Ação Livre",
    "pm": 1,
    "attr": "PER/INT",
    "pre": [],
    "alc": "18 m",
    "dur": "Instantânea",
    "ef": "Abre a \"janela de status\" de um alvo: você descobre nível e PV atuais.",
    "esc": "nv2: Reações e RD; nv3: resistências e fraquezas; nv4: habilidades ativas; nv5: tudo, inclusive habilidades ocultas.",
    "m3": "Funciona também em itens (revela afixos e Selos ocultos).",
    "m5": "Sem custo."
  },
  {
    "id": "sen3",
    "t": "sentidos",
    "r": "D",
    "n": "Instinto de Perigo",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "PER",
    "pre": [
      [
        "sen1",
        2
      ]
    ],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "Você nunca fica Surpreso e recebe +2 em Iniciativa.",
    "esc": "+2 Iniciativa por nível.",
    "m3": "Pode Reagir a ataques que não percebe, com −5.",
    "m5": "A penalidade para Reagir a ataques não percebidos é removida."
  },
  {
    "id": "sen4",
    "t": "sentidos",
    "r": "D",
    "n": "Ponto Fraco",
    "tipo": "Ativa",
    "acao": "Ação Livre",
    "pm": 3,
    "attr": "PER/INT",
    "pre": [
      [
        "sen2",
        2
      ]
    ],
    "alc": "18 m",
    "dur": "Até o fim da rodada",
    "ef": "Após usar Análise em um alvo, revele seu ponto fraco: todos os ataques de aliados contra ele causam +2 de dano.",
    "esc": "+2 de dano por nível.",
    "m3": "Ataques contra o alvo têm margem de crítico +1.",
    "m5": "Dura 2 rodadas."
  },
  {
    "id": "sen5",
    "t": "sentidos",
    "r": "C",
    "n": "Visão Além",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "PER",
    "pre": [
      [
        "sen1",
        3
      ]
    ],
    "alc": "3 m",
    "dur": "Permanente",
    "ef": "Você enxerga criaturas invisíveis e através de paredes até a espessura indicada no alcance.",
    "esc": "+3 m por nível.",
    "m3": "Você enxerga normalmente em escuridão total, inclusive mágica.",
    "m5": "Você vê ilusões como elas realmente são."
  },
  {
    "id": "sen6",
    "t": "sentidos",
    "r": "B",
    "n": "Leitura de Combate",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "PER",
    "pre": [
      [
        "sen3",
        3
      ]
    ],
    "alc": "Pessoal",
    "dur": "Fim do combate",
    "ef": "Cada vez que um mesmo inimigo atacar você, você recebe +1 cumulativo nas Reações contra ele (máximo +3).",
    "esc": "+1 no máximo por nível.",
    "m3": "O bônus também se aplica aos seus ataques contra esse inimigo.",
    "m5": "Começa o combate com +2 contra inimigos já analisados."
  },
  {
    "id": "sen7",
    "t": "sentidos",
    "r": "A",
    "n": "Precisão Absoluta",
    "tipo": "Ativa",
    "acao": "Ação Livre",
    "pm": 15,
    "attr": "PER",
    "pre": [
      [
        "sen6",
        2
      ],
      [
        "sen4",
        3
      ]
    ],
    "alc": "Pessoal",
    "dur": "2 rodadas",
    "ef": "Suas rolagens de ataque usam 2d20 e ficam com o maior.",
    "esc": "+1 rodada de duração por nível (nv5 = 6 rodadas).",
    "m3": "Também se aplica às suas Reações.",
    "m5": "Um 19 natural também conta como 20 natural."
  },
  {
    "id": "sen8",
    "t": "sentidos",
    "r": "S",
    "n": "Olhar do Destino",
    "tipo": "Ativa",
    "acao": "Reação",
    "pm": 30,
    "attr": "PER",
    "pre": [
      [
        "sen7",
        3
      ],
      [
        "sen5",
        2
      ]
    ],
    "alc": "30 m",
    "dur": "Instantânea",
    "freq": "1× por combate",
    "ef": "Você vê o futuro imediato: anule completamente uma ação de um inimigo depois de ver o resultado. A ação é perdida.",
    "esc": "nv3: 2× por combate; nv5: 3× por combate.",
    "m3": "Você pode, em vez de anular, redirecionar o efeito para outro alvo válido.",
    "m5": "Aliados em 9 m recebem +2 em Reações durante a rodada em que você usar este poder."
  },
  {
    "id": "aur1",
    "t": "aura",
    "r": "E",
    "n": "Fortalecimento",
    "tipo": "Ativa",
    "acao": "Ação de Movimento",
    "pm": 2,
    "attr": "VIT/FOR",
    "pre": [],
    "alc": "Pessoal",
    "dur": "1 minuto",
    "ef": "Mana flui pelos músculos: +1 em ataques e +2 de dano corpo a corpo.",
    "esc": "+1 ataque e +2 dano por nível.",
    "m3": "Também +3 m de deslocamento.",
    "m5": "Ativar passa a ser Ação Livre."
  },
  {
    "id": "aur2",
    "t": "aura",
    "r": "E",
    "n": "Circulação de Mana",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "VIT/INT",
    "pre": [],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "Recupera 1 PM no início de cada turno seu em combate e +5 PM máximos.",
    "esc": "+1 PM por turno e +5 PM máximos por nível.",
    "m3": "Descanso curto recupera metade dos PM (em vez de um quarto).",
    "m5": "Ao chegar a 0 PM pela primeira vez no dia, recupera metade imediatamente."
  },
  {
    "id": "aur3",
    "t": "aura",
    "r": "D",
    "n": "Aura Intimidante",
    "tipo": "Ativa",
    "acao": "Ação Livre",
    "pm": 4,
    "attr": "PRE",
    "pre": [
      [
        "aur1",
        1
      ]
    ],
    "alc": "9 m",
    "dur": "2 rodadas",
    "ef": "Inimigos no alcance fazem Resistência (PRE) ou ficam Amedrontados.",
    "esc": "+3 m de alcance e +1 de CD por nível.",
    "m3": "Lacaios que falharem fogem.",
    "m5": "Inimigos de nível 5+ abaixo do seu falham automaticamente."
  },
  {
    "id": "aur4",
    "t": "aura",
    "r": "D",
    "n": "Sobrecarga",
    "tipo": "Ativa",
    "acao": "Ação Livre",
    "pm": 5,
    "attr": "VIT",
    "pre": [
      [
        "aur2",
        2
      ]
    ],
    "alc": "Pessoal",
    "dur": "1 ataque/poder",
    "ef": "Seu próximo ataque ou poder causa +2d8 de dano, mas você sofre 1d6 de dano (não reduzível).",
    "esc": "+1d8 de dano por nível.",
    "m3": "O dano que você sofre passa a 1d4.",
    "m5": "Se o ataque for crítico, você não sofre dano."
  },
  {
    "id": "aur5",
    "t": "aura",
    "r": "C",
    "n": "Corpo de Mana",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "VIT",
    "pre": [
      [
        "aur2",
        3
      ]
    ],
    "alc": "Pessoal",
    "dur": "Permanente",
    "ef": "+5 PV e +5 PM máximos por nível desta habilidade, e +1 em Resistências.",
    "esc": "+5 PV, +5 PM e +1 em Resistências por nível.",
    "m3": "Você não precisa respirar nem comer.",
    "m5": "Você não envelhece e é imune a doenças."
  },
  {
    "id": "aur6",
    "t": "aura",
    "r": "B",
    "n": "Explosão de Aura",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 12,
    "attr": "PRE/VIT",
    "pre": [
      [
        "aur3",
        2
      ],
      [
        "aur4",
        2
      ]
    ],
    "alc": "Raio 6 m",
    "dur": "Instantânea",
    "ef": "Sua mana explode. Inimigos no raio sofrem 6d6 e são empurrados 6 m (Resistência FOR: metade e não é empurrado).",
    "esc": "+1d6 por nível.",
    "m3": "Projéteis em voo dentro do raio são destruídos (pode ser usada como Reação a ataques à distância, custo dobrado).",
    "m5": "Raio 12 m."
  },
  {
    "id": "aur7",
    "t": "aura",
    "r": "A",
    "n": "Modo Limite",
    "tipo": "Ativa",
    "acao": "Ação Livre",
    "pm": 20,
    "attr": "VIT/PRE",
    "pre": [
      [
        "aur5",
        3
      ],
      [
        "aur6",
        1
      ]
    ],
    "alc": "Pessoal",
    "dur": "3 rodadas",
    "freq": "1× por combate",
    "ef": "Você ultrapassa seus limites: +1 Ação Principal por rodada e +4 em todos os ataques, Reações e dano. Ao terminar, fica Exausto.",
    "esc": "+1 rodada de duração por nível.",
    "m3": "Ao terminar, você não fica Exausto, apenas Lento por 1 rodada.",
    "m5": "+2 Ações Principais em vez de +1."
  },
  {
    "id": "aur8",
    "t": "aura",
    "r": "S",
    "n": "Presença Soberana",
    "tipo": "Passiva",
    "acao": "—",
    "pm": 0,
    "attr": "PRE",
    "pre": [
      [
        "aur7",
        3
      ],
      [
        "aur3",
        4
      ]
    ],
    "alc": "18 m",
    "dur": "Permanente",
    "ef": "Sua presença esmaga os fracos. Inimigos de nível menor que o seu, no alcance, sofrem −2 em ataques e Resistências. Aliados recebem +1 em ataques.",
    "esc": "+1 de penalidade/bônus e +6 m por nível.",
    "m3": "Lacaios de nível menor que o seu não conseguem se aproximar de você voluntariamente.",
    "m5": "Uma vez por combate, Ação Livre: todos os inimigos no alcance fazem Resistência (PRE) ou ficam Incapacitados de medo por 1 rodada."
  }
];

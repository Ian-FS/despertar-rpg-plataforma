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
    "freq": "Sempre ativa",
    "ef": "+1 nas rolagens de ataque com armas corpo a corpo.",
    "esc": "+1 nesse bônus por nível (nv5 = +5).",
    "m3": "Sua margem de crítico com armas corpo a corpo passa a 19–20.",
    "m5": "Sua margem de crítico com armas corpo a corpo passa a 18–20, e equipar ou trocar de arma passa a ser Ação Livre (1× por rodada)."
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
    "alc": "Alcance da arma",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Faça um ataque corpo a corpo com sua arma. Se acertar, causa o dano normal da arma +1d6, e você pode se mover 3 m logo em seguida sem provocar Ataque de Oportunidade (esse movimento não gasta sua Ação de Movimento).",
    "esc": "+1d6 de dano por nível (nv5 = +5d6).",
    "m3": "O movimento após o acerto passa a 6 m.",
    "m5": "O primeiro Corte Rápido de cada rodada custa 0 PM."
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
    "alc": "Alcance da arma",
    "dur": "Permanente",
    "freq": "1× por rodada (2× no nv5)",
    "ef": "Empunhando uma arma leve em cada mão: quando acertar um ataque com uma delas, faça imediatamente 1 ataque extra com a outra contra o mesmo alvo ou outro ao alcance, sem gastar Ação Principal. O ataque extra causa o dado da arma + metade do Nível + bônus do item, sem somar o modificador de atributo.",
    "esc": "+1 de dano no ataque extra por nível (nv5 = +4).",
    "m3": "O ataque extra passa a somar o modificador de atributo ao dano.",
    "m5": "Você pode fazer até 2 ataques extras por rodada (cada um exige um acerto anterior com a outra arma)."
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
    "alc": "Alcance da arma",
    "dur": "Até o fim do próximo turno do alvo",
    "freq": "À vontade",
    "ef": "Faça um ataque corpo a corpo com sua arma. Se acertar, causa o dano normal da arma +2d8, e o alvo faz Resistência (VIT) contra sua CD (FOR). Se falhar, fica Atordoado até o fim do próximo turno dele.",
    "esc": "+1d8 de dano por nível (nv5 = +6d8).",
    "m3": "A CD do Atordoamento recebe +2.",
    "m5": "Quem falhar fica Atordoado até o fim do segundo turno dele. Um Chefe que falhar fica Lento pelo mesmo tempo, em vez de Atordoado."
  },
  {
    "id": "lam9",
    "t": "lamina",
    "r": "D",
    "n": "Aparar e Responder",
    "tipo": "Ativa",
    "acao": "Reação",
    "pm": 3,
    "attr": "FOR/AGI",
    "pre": [
      [
        "lam1",
        2
      ]
    ],
    "alc": "Alcance da arma",
    "dur": "Instantânea",
    "freq": "1× por rodada (2× no nv5)",
    "ef": "Logo depois de vencer com Defender um ataque corpo a corpo, estando com uma arma corpo a corpo empunhada, faça 1 ataque com essa arma contra o atacante, se ele estiver ao seu alcance. O ataque causa o dano normal da arma.",
    "esc": "+1d6 de dano na resposta por nível (nv5 = +4d6).",
    "m3": "Se o seu Defender vencer o ataque por 5 ou mais, a resposta acerta automaticamente, sem rolagem de ataque (não é crítico).",
    "m5": "Pode ser usado 2× por rodada, e o primeiro de cada rodada custa 0 PM."
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
    "freq": "À vontade",
    "preAny": true,
    "ef": "Você dispara uma lâmina de mana com a arma corpo a corpo que empunha: faça um ataque à distância usando o atributo da arma contra 1 alvo no alcance. Se acertar, causa o dano normal da arma +3d6. Não provoca Ataque de Oportunidade.",
    "esc": "+1d6 de dano e +6 m de alcance por nível (nv5 = +7d6, 36 m).",
    "m3": "A lâmina atravessa: faça uma única rolagem de ataque e compare com a Reação de cada criatura numa linha do comprimento do alcance (é ataque em área: Reação bem-sucedida sofre metade).",
    "m5": "O dano ignora toda a RD do alvo."
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
    "alc": "Até o dobro do seu Deslocamento",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Mova-se até o dobro do seu Deslocamento. Durante o movimento, faça 1 ataque corpo a corpo com sua arma contra cada inimigo que ficar ao seu alcance em algum momento do trajeto, até 3 inimigos diferentes. Cada ataque causa o dano normal da arma. O movimento provoca Ataques de Oportunidade normalmente.",
    "esc": "+1 inimigo no máximo por nível (nv5 = 7).",
    "m3": "O movimento da Dança não provoca Ataques de Oportunidade.",
    "m5": "Cada ataque da Dança causa +2d6 de dano."
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
    "freq": "Sempre ativa",
    "ef": "Seus ataques com armas ignoram 5 pontos de RD do alvo e causam +2 de dano.",
    "esc": "+2 de dano por nível (nv5 = +10).",
    "m3": "Cada criatura que você acertar com arma sofre −2 em todas as Reações até o início do seu próximo turno (não acumula com ela mesma).",
    "m5": "Num acerto crítico com arma, os dados de dano da arma rolam com o valor máximo e só então são dobrados."
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
    "freq": "1× por combate (2× no nv5)",
    "ef": "Um único corte que divide o campo. Faça uma rolagem de ataque com sua arma e compare com a Reação de cada criatura numa linha de 60 m a partir de você. Dano: 10d10 + mod do atributo da arma + metade do Nível. Quem reagir com sucesso sofre metade.",
    "esc": "+2d10 de dano por nível (nv5 = 18d10).",
    "m3": "Objetos e estruturas na linha (paredes, portões, veículos) são partidos ao meio, sem rolagem.",
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
    "freq": "Sempre ativa",
    "ef": "Seu ataque desarmado causa 1d6 (em vez de 1d4) e recebe o Bônus de Rank do seu Rank de personagem, como se fosse uma arma desse Rank (+BR no ataque e +2×BR no dano).",
    "esc": "O dado do ataque desarmado sobe: nv2 1d8, nv3 1d10, nv4 2d6, nv5 2d8.",
    "m3": "Você pode atacar desarmado (com joelhos, cotovelos, cabeça) mesmo com as duas mãos ocupadas.",
    "m5": "Seus ataques desarmados ignoram 5 pontos de RD do alvo."
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
    "freq": "1× por rodada",
    "ef": "Logo depois de vencer com Defender um ataque corpo a corpo, faça 1 ataque desarmado contra o atacante, se ele estiver ao seu alcance. O ataque causa o dano desarmado normal.",
    "esc": "+1d6 de dano no contra-ataque por nível (nv5 = +4d6).",
    "m3": "Também pode ser usado logo depois de vencer com Esquivar.",
    "m5": "Pode ser usado 2× por rodada, e o primeiro de cada rodada custa 0 PM."
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
    "dur": "Enquanto mantiver o agarrão",
    "freq": "À vontade",
    "ef": "Teste oposto: seu Atletismo contra o Atletismo ou a Acrobacia do alvo (ele escolhe). Se vencer, o alvo fica Agarrado por você. No início de cada turno seu, enquanto ele continuar Agarrado, ele sofre seu dano desarmado automaticamente (sem rolagem de ataque e sem custo). O agarrão acaba se o alvo escapar, se você soltar (Ação Livre) ou se você se afastar.",
    "esc": "+1d6 no dano automático por nível (nv5 = +4d6).",
    "m3": "Ação Principal: arremesse o alvo Agarrado até 6 m. Ele sofre seu dano desarmado +2d6, cai Derrubado e deixa de estar Agarrado.",
    "m5": "Você pode agarrar criaturas de qualquer tamanho (sem o limite de 1 tamanho acima do seu)."
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
    "freq": "No início de cada turno seu",
    "ef": "No início de cada turno seu, se estiver com metade dos PV máximos ou menos (inclusive No Limite), recupere 2 PV.",
    "esc": "+2 PV por turno por nível (nv5 = 10 PV).",
    "m3": "Nessa mesma condição, também recupera 2 PM no início de cada turno seu.",
    "m5": "Nessa mesma condição, no início de cada turno seu, encerre uma condição à sua escolha entre Atordoado, Lento e Amedrontado."
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
    "freq": "À vontade",
    "ef": "Faça 4 ataques desarmados, cada um contra qualquer inimigo ao seu alcance. Entre um ataque e outro você pode se mover 1,5 m sem provocar Ataque de Oportunidade. Cada ataque causa o dano desarmado normal.",
    "esc": "+1 ataque por nível (nv5 = 8 ataques).",
    "m3": "Cada acerto empurra o alvo 1,5 m para longe de você; você pode acompanhá-lo 1,5 m sem gastar movimento.",
    "m5": "Se todos os ataques forem contra o mesmo alvo e todos acertarem, ele fica Atordoado até o fim do próximo turno dele (um Chefe fica Lento)."
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
    "alc": "Raio de 4,5 m ao seu redor",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Você golpeia o chão. Cada criatura no raio (exceto você) faz Resistência (FOR) contra sua CD (FOR). Falha: sofre 4d8 + mod FOR + metade do Nível e fica Derrubada. Sucesso: sofre metade e não cai.",
    "esc": "+1d8 de dano e +1,5 m de raio por nível (nv5 = 8d8, raio 10,5 m).",
    "m3": "O chão no raio vira terreno difícil (custa o dobro de deslocamento) até o fim do combate.",
    "m5": "Também atinge criaturas voando ou saltando a até 9 m de altura dentro do raio."
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
    "freq": "Sempre ativa",
    "ef": "Você recebe RD 4 contra todo dano e imunidade à condição Sangrando.",
    "esc": "+2 de RD por nível (nv5 = RD 12).",
    "m3": "Imune à condição Atordoado.",
    "m5": "Você não pode ser empurrado, puxado ou Derrubado contra a sua vontade."
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
    "ef": "Faça 1 ataque desarmado. Se acertar, role o dano desarmado normal e multiplique o total (dados + modificadores) por 3, antes de subtrair a RD. Se errar, o golpe atinge o chão ou a parede atrás do alvo: objetos e estruturas ali sofrem o dano normal.",
    "esc": "Multiplicador e bônus: nv2 ×3 +10, nv3 ×3 +20, nv4 ×4, nv5 ×4 +20.",
    "m3": "Se acertar, cada outra criatura a até 6 m do alvo sofre metade do dano final (sem rolagem).",
    "m5": "Um alvo Agarrado ou Derrubado não pode usar Reação contra este golpe."
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
    "freq": "Sempre ativa",
    "ef": "+2 em Furtividade, e seus passos não produzem som.",
    "esc": "+2 em Furtividade por nível (nv5 = +10).",
    "m3": "Você pode tentar se esconder (teste de Furtividade) mesmo sendo observado, desde que esteja em sombra ou atrás de cobertura.",
    "m5": "Enquanto você não se mover nem agir no turno, criaturas sem Detectar Mana (ou poder parecido) não o percebem, sem teste."
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
    "freq": "Em todo ataque que cumprir a condição",
    "ef": "Seus ataques com arma ou desarmados causam +1d6 de dano contra um alvo que não pode usar Reação contra eles (Surpreso, você Invisível para ele, ou ataque que ele não percebe).",
    "esc": "+1d6 por nível (nv5 = +5d6).",
    "m3": "O bônus também vale contra alvos Derrubados, Agarrados ou Cegos, mesmo que possam reagir.",
    "m5": "O bônus também vale contra um alvo que tenha um aliado seu adjacente a ele."
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
    "dur": "Até o fim do seu turno",
    "freq": "À vontade",
    "ef": "Você se move até seu Deslocamento +3 m, e esse movimento não provoca Ataques de Oportunidade.",
    "esc": "+3 m por nível (nv5 = Deslocamento +15 m).",
    "m3": "Durante esse movimento, você pode atravessar espaços ocupados por inimigos (não pode terminar neles).",
    "m5": "Durante esse movimento, você pode correr por paredes e tetos; se terminar fora do chão, cai."
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
    "freq": "1× por rodada",
    "ef": "Seu próximo acerto com arma ou desarmado nesta rodada envenena o alvo: ele faz Resistência (VIT) contra sua CD (AGI ou INT, o maior). Falha: fica Envenenado por 3 rodadas, sofrendo 1d6 de dano no início de cada turno dele. Se você não acertar nada até o fim do turno, os PM se perdem.",
    "esc": "+1d6 de dano de veneno por nível (nv5 = 5d6).",
    "m3": "Enquanto estiver Envenenado por esta habilidade, o alvo também sofre −2 em Reações.",
    "m5": "Enquanto estiver Envenenado por esta habilidade, o alvo não recupera PV por nenhum meio."
  },
  {
    "id": "vul9",
    "t": "vulto",
    "r": "D",
    "n": "Lâminas Arremessadas",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 3,
    "attr": "AGI",
    "pre": [
      [
        "vul2",
        1
      ]
    ],
    "alc": "9 m",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Com a arma leve ou de arremesso que você empunha, faça 2 ataques à distância usando AGI, cada um com −2, contra o mesmo alvo ou alvos diferentes a até 9 m. Cada acerto causa o dano normal da arma. Fios de mana trazem a arma de volta à sua mão no fim do seu turno.",
    "esc": "+3 m de alcance e +1d4 de dano em cada acerto por nível (nv5 = 21 m, +4d4).",
    "m3": "Os ataques deixam de ter a penalidade de −2 e não provocam Ataque de Oportunidade.",
    "m5": "Passam a ser 3 ataques (em vez de 2)."
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
    "dur": "1 minuto (10 rodadas)",
    "freq": "À vontade",
    "ef": "Você fica Invisível para criaturas que não tenham Detectar Mana (ou poder parecido). O efeito termina quando você ataca, usa uma habilidade contra alguém ou a duração acaba.",
    "esc": "+1 minuto de duração por nível (nv5 = 5 minutos).",
    "m3": "Depois de atacar, você pode gastar uma Ação de Movimento e fazer um teste de Furtividade contra CD 15 + nível do inimigo mais forte que o vê: se passar, volta a ficar Invisível pelo resto da duração, sem gastar PM.",
    "m5": "Até criaturas com Detectar Mana precisam vencer um teste de Percepção contra seu teste de Furtividade para percebê-lo."
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
    "freq": "1× por rodada (2× no nv3)",
    "ef": "Quando você for alvo de um ataque que perceba, antes da rolagem, teleporte-se para um ponto que possa ver a até 6 m. O ataque erra automaticamente. Usar esta habilidade substitui a sua Reação de Defender ou Esquivar contra esse ataque (não conta para a Pressão).",
    "esc": "+3 m de distância por nível (nv5 = 18 m).",
    "m3": "Pode ser usado 2× por rodada.",
    "m5": "Você pode reaparecer ao lado do atacante e fazer imediatamente 1 ataque com arma contra ele, que não pode usar Reação contra esse ataque."
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
    "freq": "Sempre ativa",
    "ef": "Sua margem de crítico com armas e ataques desarmados aumenta em 1 (soma com outras fontes). Seus acertos críticos causam +1d10 de dano (esse dado não é dobrado).",
    "esc": "+1d10 de dano em críticos por nível (nv5 = +5d10).",
    "m3": "Seus críticos deixam o alvo Sangrando: perde 5 PV no início de cada turno dele, até ser curado ou tratado (Medicina CD 15).",
    "m5": "Nos seus críticos, os dados do Golpe Furtivo também são dobrados."
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
    "freq": "1× por rodada",
    "ef": "Faça 1 ataque com arma contra um alvo que não pode usar Reação contra você. Se acertar, causa o dano normal. Depois do dano, se o alvo estiver com 25% dos PV máximos ou menos, ele morre. Um Chefe faz Resistência (VIT) contra sua CD (AGI): se passar, fica com 1 PV em vez de morrer.",
    "esc": "+5% no limite por nível (nv5 = 45%).",
    "m3": "Se a Execução matar o alvo, você pode usá-la de novo nesta mesma rodada.",
    "m5": "Chefes fazem a Resistência com −5."
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
    "freq": "Sempre ativa",
    "ef": "+1 nas rolagens de ataque à distância.",
    "esc": "+1 nesse bônus por nível (nv5 = +5).",
    "m3": "Seus ataques à distância ignoram a cobertura parcial do alvo.",
    "m5": "Atacar à distância estando adjacente a um inimigo não provoca Ataque de Oportunidade."
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
    "alc": "Alcance da arma",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Faça 2 ataques à distância com sua arma contra o mesmo alvo, cada um com −4. Cada acerto causa o dano normal da arma.",
    "esc": "A penalidade diminui 1 por nível (nv2 −3, nv3 −2, nv4 −1, nv5 0).",
    "m3": "Cada um dos disparos pode ir para um alvo diferente.",
    "m5": "Passam a ser 3 disparos, sem penalidade."
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
    "alc": "Alcance da arma",
    "dur": "Até o fim do seu turno",
    "freq": "1× por rodada",
    "ef": "Você cria um projétil de mana para o seu próximo ataque à distância neste turno: ele não gasta munição e causa +1d8 de dano. Se você não atacar à distância até o fim do turno, os PM se perdem.",
    "esc": "+1d8 por nível (nv5 = +5d8).",
    "m3": "Você escolhe o tipo do dano extra: fogo, gelo, raio ou mana pura (importa para RD e imunidades de cada tipo).",
    "m5": "O projétil faz curva: ignora cobertura, inclusive total, contra um alvo cuja posição você conheça."
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
    "freq": "Sempre ativa",
    "ef": "O alcance das suas armas à distância dobra, e você recebe +2 em Percepção.",
    "esc": "+2 em Percepção por nível (nv5 = +10).",
    "m3": "O alcance das suas armas à distância triplica (em vez de dobrar), e neblina e fumaça não bloqueiam sua visão.",
    "m5": "Se você viu um alvo Invisível nesta rodada (por qualquer meio), ele pode reagir aos seus ataques à distância, mas você não sofre nenhuma penalidade para atacá-lo."
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
    "alc": "Raio de 6 m, centrado num ponto dentro do alcance da arma",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Faça uma única rolagem de ataque à distância e compare com a Reação de cada criatura no raio. Dano: dano normal da arma +2d6. Quem reagir com sucesso sofre metade.",
    "esc": "+1d6 de dano por nível (nv5 = +6d6).",
    "m3": "Você escolhe quais criaturas no raio não são atingidas.",
    "m5": "O chão no raio vira terreno difícil (custa o dobro de deslocamento) até o início do seu próximo turno."
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
    "alc": "Linha do comprimento do alcance da arma",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "O disparo atravessa tudo em linha. Faça uma única rolagem de ataque e compare com a Reação de cada criatura na linha; o bônus de escudo delas não conta. Dano: dano normal da arma +4d8, ignorando toda a RD. Quem reagir com sucesso sofre metade.",
    "esc": "+1d8 por nível (nv5 = +8d8).",
    "m3": "O disparo atravessa barreiras e paredes de até 1 m de espessura, atingindo quem está atrás.",
    "m5": "Cada criatura atingida sofre −2 em Reações até o início do seu próximo turno."
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
    "dur": "Até o fim do combate",
    "freq": "1× por rodada; só 1 alvo marcado por vez",
    "ef": "Marque 1 criatura que você veja. Seus ataques contra ela recebem +2 no acerto e +1d6 de dano, e ela não consegue ficar Invisível nem se esconder de você. Marcar outra criatura encerra a marca anterior.",
    "esc": "+1 no acerto e +1d6 de dano por nível (nv5 = +6 e +5d6).",
    "m3": "Seus aliados recebem metade desses bônus (arredondado para baixo) contra o alvo marcado.",
    "m5": "Quando o alvo marcado for derrotado, você pode marcar outra criatura imediatamente, sem ação e sem custo."
  },
  {
    "id": "dis8",
    "t": "disparo",
    "r": "S",
    "n": "Disparo Estelar",
    "tipo": "Ativa",
    "acao": "Ação Especial",
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
    "ef": "Rodada 1 (Ação Especial): você começa a concentrar e paga os PM; até o seu próximo turno você não pode usar Reações. Rodada 2 (sua Ação Principal): dispare contra 1 alvo com +10 na rolagem de ataque. Dano: 12d12 + mod AGI ou PER (o maior) + metade do Nível. Se você ficar Atordoado, Incapacitado ou for movido contra a vontade antes de disparar, o disparo se perde junto com os PM.",
    "esc": "+2d12 por nível (nv5 = 20d12).",
    "m3": "No impacto, o disparo explode: cada outra criatura a até 6 m do alvo sofre metade do dano (sem rolagem).",
    "m5": "Não precisa mais da rodada de concentração: dispare na mesma Ação Especial."
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
    "freq": "Sempre ativa",
    "ef": "RD 1 contra dano físico (armas, garras, quedas, impactos).",
    "esc": "+1 de RD por nível (nv5 = RD 5).",
    "m3": "Essa RD também vale contra dano de fogo, gelo e raio.",
    "m5": "Você também recebe +10 PV máximos."
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
    "dur": "Até o início do seu próximo turno",
    "freq": "1× por rodada",
    "ef": "1 inimigo que você veja no alcance faz Resistência (PRE) contra sua CD (VIT ou PRE, o maior). Falha: até o início do seu próximo turno, ele sofre −4 em ataques contra qualquer alvo que não seja você.",
    "esc": "+3 m de alcance por nível (nv5 = 21 m).",
    "m3": "Afeta até 3 inimigos no alcance (cada um resiste separadamente).",
    "m5": "Afeta todos os inimigos no alcance, e o efeito dura até o início do seu segundo turno seguinte."
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
    "freq": "1× por ataque recebido",
    "ef": "Ao rolar Defender, antes de ver o resultado, pague os PM e some +2 à rolagem.",
    "esc": "+2 por nível (nv5 = +10).",
    "m3": "Se o seu Defender vencer o ataque por 5 ou mais, o atacante é empurrado 3 m para longe de você.",
    "m5": "Você pode usá-lo para um aliado adjacente que vai ser atacado: você rola o Defender no lugar dele (com seus valores e este bônus), e o resultado vale para ele."
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
    "dur": "Até o início do seu próximo turno",
    "freq": "À vontade",
    "ef": "Seu Deslocamento vira 0, você não pode ser empurrado, puxado nem Derrubado, e recebe +3 em Defender e +3 de RD.",
    "esc": "+1 em Defender e +1 de RD por nível (nv5 = +7 e +7).",
    "m3": "Inimigos adjacentes a você não podem usar Corrida para se afastar.",
    "m5": "Ataques que você vencer com Defender não aplicam nenhum efeito extra (empurrão, veneno, condição)."
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
    "freq": "1× por rodada",
    "ef": "Quando um aliado a até 3 m de você for alvo de um ataque, antes da rolagem, troque de lugar com ele: você se torna o alvo desse ataque e reage normalmente.",
    "esc": "+1,5 m de alcance por nível (nv5 = 9 m).",
    "m3": "Você recebe +4 na Reação contra esse ataque.",
    "m5": "Pode ser usado 2× por rodada, e o primeiro de cada rodada custa 0 PM."
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
    "freq": "Sempre ativa",
    "ef": "Seus PV máximos aumentam em 1 × o seu Nível de personagem.",
    "esc": "+1 × Nível por nível de habilidade (nv5 = +5 × Nível).",
    "m3": "Estar No Limite não reduz suas Ações Principais.",
    "m5": "Você é imune a efeitos de habilidades que causam morte instantânea (como Execução Silenciosa)."
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
    "dur": "1 minuto (10 rodadas)",
    "freq": "Só 1 muralha ativa por vez",
    "ef": "Crie uma parede reta de 9 m de comprimento × 3 m de altura num ponto que você veja no alcance. Ela tem 30 + 5 × seu Nível PV e RD 0. Nada atravessa a parede (criaturas, ataques, projéteis, poderes) até ela chegar a 0 PV ou a duração acabar.",
    "esc": "+20 PV na muralha por nível (nv5 = +80).",
    "m3": "Você pode criar a muralha como uma cúpula de raio 4,5 m.",
    "m5": "No início de cada turno seu, a muralha recupera 10% dos PV máximos dela."
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
    "freq": "1× por combate (2× no nv5)",
    "ef": "Quando você ou um aliado a até 18 m for sofrer dano que o deixaria com 0 PV ou menos, anule todo esse dano. Em seguida, por 2 rodadas, você e todos os aliados a até 18 m de você recebem +10 de RD.",
    "esc": "+1 rodada de duração e +2 de RD por nível (nv5 = 6 rodadas, RD +18).",
    "m3": "Durante o efeito, você e esses aliados são imunes a Amedrontado.",
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
    "freq": "À vontade",
    "ef": "Ataque de poder à distância (1d20 + Nível + mod INT) contra 1 alvo. Dano: 1d10 + mod INT + metade do Nível, do elemento escolhido. Efeito extra se acertar: Fogo: Queimando (1d4 no início do próximo turno dele). Gelo: −3 m de Deslocamento até o fim do próximo turno dele. Raio: −1 em Reações até o início do seu próximo turno.",
    "esc": "+1d10 de dano por nível (nv5 = 5d10).",
    "m3": "Alcance de 36 m.",
    "m5": "Com uma única Ação Principal você pode disparar 2 projéteis (contra o mesmo alvo ou alvos diferentes), pagando 4 PM."
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
    "freq": "Sempre ativa",
    "ef": "Escolha um elemento ao adquirir (fogo, gelo ou raio; não muda depois). Você recebe RD 3 contra esse elemento e +1 de dano em todas as suas habilidades e Despertar que causem dano desse elemento.",
    "esc": "+3 de RD e +1 de dano por nível (nv5 = RD 15, +5).",
    "m3": "Escolha um segundo elemento: ele recebe os mesmos benefícios.",
    "m5": "Você fica imune ao primeiro elemento escolhido."
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
    "alc": "Raio de 3 m, centrado num ponto a até 30 m",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Uma esfera de fogo explode. Faça uma única rolagem de ataque de poder (INT) e compare com a Reação de cada criatura no raio. Dano: 3d6 + mod INT + metade do Nível de fogo, e quem for atingido fica Queimando (1d6 no início de cada turno dele, por 2 rodadas). Quem reagir com sucesso sofre metade e não fica Queimando.",
    "esc": "+1d6 de dano por nível (nv5 = 7d6).",
    "m3": "Raio de 4,5 m.",
    "m5": "Raio de 6 m, e o fogo continua na área por 2 rodadas: quem começar o turno nela fica Queimando."
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
    "dur": "Até o fim do próximo turno do alvo",
    "freq": "À vontade",
    "ef": "1 alvo que você veja no alcance faz Resistência (AGI) contra sua CD (INT). Falha: sofre 2d6 + mod INT + metade do Nível de gelo e fica Imobilizado até o fim do próximo turno dele. Sucesso: sofre metade e não fica Imobilizado.",
    "esc": "+1d6 de dano por nível (nv5 = 6d6).",
    "m3": "Imobilizado até o fim do segundo turno dele.",
    "m5": "Afeta até 3 alvos no alcance (cada um resiste separadamente)."
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
    "alc": "18 m até o primeiro alvo",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Um raio salta entre até 3 alvos diferentes: o primeiro a até 18 m, e cada um seguinte a até 9 m do anterior. Faça uma rolagem de ataque de poder (INT) separada contra cada um. Dano em cada acerto: 4d8 + mod INT + metade do Nível de raio.",
    "esc": "+1 alvo e +1d8 de dano por nível (nv5 = 7 alvos, 8d8).",
    "m3": "Cada criatura atingida sofre −2 em Reações até o início do seu próximo turno.",
    "m5": "O raio nunca salta para aliados, e o último salto pode voltar ao primeiro alvo (atingindo-o 2 vezes)."
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
    "alc": "Raio de 9 m, centrado num ponto a até 60 m",
    "dur": "3 rodadas",
    "freq": "Só 1 tempestade ativa por vez",
    "ef": "Crie uma zona de tempestade do elemento escolhido (fogo, gelo ou raio). Cada criatura que começar o turno dentro dela, ou entrar nela, faz Resistência (AGI) contra sua CD (INT): falha, sofre 5d8 + mod INT + metade do Nível; sucesso, metade. Uma criatura só sofre esse dano 1× por rodada.",
    "esc": "+1d8 por nível (nv5 = 9d8).",
    "m3": "Ação de Movimento: mova a zona até 9 m.",
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
    "dur": "1 minuto (10 rodadas)",
    "freq": "1× por combate",
    "ef": "Seu corpo vira o elemento de Afinidade Elemental (o primeiro escolhido). Enquanto durar: você é imune a esse elemento; quem acertá-lo com ataque corpo a corpo sofre 2d10 desse elemento (sem rolagem); e suas habilidades de Elementos custam metade dos PM (arredondado para cima).",
    "esc": "+1d10 no dano de toque por nível (nv5 = 6d10).",
    "m3": "Enquanto durar, você voa com seu Deslocamento.",
    "m5": "Enquanto durar, o dano das suas habilidades de Elementos ignora imunidades e RD contra elementos."
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
    "alc": "Raio de 30 m, centrado num ponto a até 300 m",
    "dur": "Instantânea",
    "freq": "1× por dia (1× por combate no nv5)",
    "ef": "Uma calamidade elemental. Faça uma única rolagem de ataque de poder (INT) e compare com a Reação de cada criatura no raio, inclusive aliados. Dano: 15d10 + mod INT + metade do Nível. Quem reagir com sucesso sofre metade.",
    "esc": "+3d10 por nível (nv5 = 27d10).",
    "m3": "Você escolhe quais criaturas no raio não são atingidas.",
    "m5": "Pode ser usado 1× por combate, em vez de 1× por dia."
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
    "freq": "À vontade",
    "ef": "1 criatura que você veja no alcance (pode ser você) recupera 2d8 + mod INT ou PRE (o maior) PV, sem passar do máximo. A cura conta a partir dos PV atuais, mesmo negativos.",
    "esc": "+1d8 por nível (nv5 = 6d8).",
    "m3": "Alcance de 18 m, e você pode usar a Cura como Ação de Movimento pagando 6 PM.",
    "m5": "Um alvo que esteja No Limite recupera o dobro."
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
    "freq": "À vontade (não acumula com ela mesma)",
    "ef": "1 aliado que você veja no alcance (pode ser você) recebe +1 em ataques e Reações por 3 rodadas.",
    "esc": "+1 por nível (nv5 = +5).",
    "m3": "Afeta até 3 aliados no alcance.",
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
    "freq": "À vontade",
    "ef": "1 criatura que você veja no alcance perde 1 condição à sua escolha entre Envenenado, Queimando, Sangrando, Cego e Amedrontado.",
    "esc": "Remove +1 condição por nível (nv5 = 5 condições).",
    "m3": "Também pode remover Atordoado e Lento.",
    "m5": "O alvo fica imune às condições removidas por 1 minuto."
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
    "dur": "1 minuto (10 rodadas)",
    "freq": "1 alvo regenerando por vez (2 no nv3)",
    "ef": "1 criatura que você veja no alcance recupera 1d6 PV no início de cada turno dela, por 1 minuto.",
    "esc": "+1d6 por nível (nv5 = 5d6).",
    "m3": "Você pode manter 2 alvos regenerando ao mesmo tempo.",
    "m5": "Cada alvo também recupera 1d6 PM no início de cada turno dele."
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
    "alc": "Raio de 9 m ao seu redor",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Você e todos os aliados no raio recuperam 3d8 + mod INT ou PRE (o maior) PV.",
    "esc": "+1d8 por nível (nv5 = 7d8).",
    "m3": "Raio de 18 m.",
    "m5": "Cada criatura curada também perde 1 condição à escolha dela."
  },
  {
    "id": "res9",
    "t": "restauracao",
    "r": "C",
    "n": "Aceleração",
    "tipo": "Ativa",
    "acao": "Ação de Movimento",
    "pm": 6,
    "attr": "PRE/INT",
    "pre": [
      [
        "res2",
        2
      ]
    ],
    "alc": "9 m",
    "dur": "Até o fim do próximo turno do aliado",
    "freq": "1× por rodada (não acumula com ela mesma)",
    "ef": "1 aliado que você veja no alcance (não pode ser você) recebe 1 Ação de Movimento extra no próximo turno dele e +3 m de Deslocamento até o fim desse turno.",
    "esc": "+1,5 m de Deslocamento por nível (nv5 = +9 m).",
    "m3": "O aliado também recebe +2 em Iniciativa e em Esquivar até o fim do próximo turno dele.",
    "m5": "Em vez da Ação de Movimento extra, o aliado pode receber 1 Ação Principal extra no próximo turno dele (só 1× por combate para cada aliado)."
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
    "dur": "1 minuto (10 rodadas)",
    "freq": "1× por rodada",
    "ef": "Quando um aliado que você veja no alcance for acertado, antes de aplicar o dano, ele recebe 15 PV temporários (somem primeiro; não se somam com outros PV temporários, vale o maior; acabam em 1 minuto).",
    "esc": "+10 PV temporários por nível (nv5 = 55).",
    "m3": "Enquanto tiver esses PV temporários, o aliado é imune a Atordoado.",
    "m5": "A primeira Égide de cada rodada custa 0 PM."
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
    "freq": "1× por dia (2× no nv5)",
    "ef": "Uma criatura que morreu há no máximo 1 rodada volta à vida com 1 PV. Não funciona se o corpo foi desintegrado, decapitado ou destruído.",
    "esc": "+1 rodada no prazo por nível (nv5 = até 5 rodadas).",
    "m3": "O alvo volta com metade dos PV máximos.",
    "m5": "Também restaura membros perdidos, e pode ser usado 2× por dia."
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
    "alc": "Raio de 18 m ao seu redor (a área não se move)",
    "dur": "3 rodadas",
    "freq": "1× por combate",
    "ef": "Cria uma área sagrada. Aliados dentro dela recuperam 20 PV no início de cada turno deles e não podem receber condições (as que já tinham ficam suspensas enquanto estiverem dentro).",
    "esc": "+1 rodada e +5 PV por turno por nível (nv5 = 7 rodadas, 40 PV).",
    "m3": "Inimigos que entrarem na área ou começarem o turno nela ficam Lentos até saírem.",
    "m5": "Um aliado que morreria dentro da área fica com 1 PV em vez disso (1× por aliado, por Santuário)."
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
    "dur": "1 hora, ou até chegar a 0 PV",
    "freq": "Máximo de 1 familiar ativo (2 no nv3)",
    "ef": "Invoca 1 espírito de mana num ponto livre no alcance: um Lacaio de nível igual ao seu (valores da tabela de ameaças). Ele segue a regra de Invocações: age logo depois de você, e cada Ação Principal dele gasta uma Ação Principal sua. Ao chegar a 0 PV, ele some.",
    "esc": "+1 no nível do familiar por nível de habilidade (nv5 = seu Nível +4).",
    "m3": "Você pode manter 2 familiares ativos ao mesmo tempo (cada um custa uma invocação).",
    "m5": "Seus familiares passam a ser Soldados (em vez de Lacaios)."
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
    "freq": "Sempre ativa",
    "ef": "Suas invocações e companheiros a até 30 m recebem +1 em ataques e Reações. Além disso, 1 deles por rodada, à sua escolha, age sem gastar suas Ações Principais: ele usa as Ações Principais da própria categoria na tabela de ameaças.",
    "esc": "+1 no bônus por nível (nv5 = +5); nv3: 2 deles agem livres por rodada; nv5: 3.",
    "m3": "Ação Livre (1× por rodada): você passa a ver e ouvir pelos sentidos de 1 invocação até o fim do seu turno.",
    "m5": "Nos ataques, suas invocações podem usar o seu Nível + mod PRE no lugar do bônus de ataque delas, se for maior."
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
    "freq": "À vontade (respeitando o máximo de companheiros)",
    "ef": "Uma besta (não humanoide, não morta-viva) com metade dos PV máximos ou menos e nível igual ou menor que o seu faz Resistência (PRE) contra sua CD (PRE). Falha: ela vira sua companheira leal, mantendo nível e categoria (só Lacaio ou Soldado). Companheiros seguem a regra de Invocações e não somem com o tempo. Máximo de companheiros: 1. Se o máximo estiver cheio, você precisa liberar um antes.",
    "esc": "+1 companheiro no máximo por nível (nv5 = 5).",
    "m3": "Pode domar Elites.",
    "m5": "Pode tentar domar um Chefe derrotado (com 0 PV ou menos, ainda vivo); a Resistência dele tem −5. O Chefe domado vira Elite."
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
    "dur": "Até o fim do próximo turno do alvo",
    "freq": "À vontade",
    "ef": "Correntes surgem do chão sob 1 alvo que você veja no alcance. Ele faz Resistência (FOR) contra sua CD (INT ou PRE, o maior). Falha: fica Imobilizado até o fim do próximo turno dele.",
    "esc": "+1 na CD por nível (nv5 = +4).",
    "m3": "Quem falhar fica Imobilizado e Agarrado até o fim do segundo turno dele (para escapar antes, teste oposto contra a sua CD).",
    "m5": "Afeta até 3 alvos no alcance (cada um resiste separadamente)."
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
    "freq": "Sempre ativa",
    "ef": "O máximo de invocações ativas de cada uma das suas habilidades e do seu Despertar aumenta em +1. Suas invocações e companheiros recebem +5 PV máximos.",
    "esc": "+1 no máximo e +5 PV por nível (nv5 = +5 e +25 PV).",
    "m3": "Cada uso de Invocar Familiar invoca 2 familiares (respeitando o máximo).",
    "m5": "Quando uma invocação sua chega a 0 PV, você recupera 5 PM."
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
    "freq": "À vontade",
    "ef": "Você troca de lugar instantaneamente com 1 invocação ou companheiro seu que esteja no alcance. Não provoca Ataque de Oportunidade.",
    "esc": "+30 m de alcance por nível (nv5 = 180 m).",
    "m3": "Pode ser usada como Reação quando você for alvo de um ataque, antes da rolagem (1× por rodada): a invocação passa a ser o alvo e reage no seu lugar.",
    "m5": "A primeira Troca de cada rodada custa 0 PM."
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
    "dur": "1 minuto (10 rodadas), ou até chegar a 0 PV",
    "freq": "Máximo de 1 Guardião ativo; 1× por combate",
    "ef": "Invoca um Guardião de mana: uma Elite de nível igual ao seu (tabela de ameaças). Ao adquirir esta habilidade, escolha 1 habilidade Rank C de qualquer árvore: o Guardião pode usá-la 1× por rodada, sem gastar PM, com o nível dela igual ao nível desta habilidade. Ele segue a regra de Invocações.",
    "esc": "+1 no nível do Guardião e +1 minuto de duração por nível (nv5 = seu Nível +4, 5 minutos).",
    "m3": "O Guardião ganha a aparência que você escolher e mais 1 habilidade, agora de Rank B (mesma regra de uso).",
    "m5": "O Guardião passa a ser um Chefe (em vez de Elite)."
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
    "dur": "10 minutos, ou até chegar a 0 PV",
    "freq": "1× por dia",
    "ef": "Invoca uma Tropa de 10 Soldados de nível igual ao seu. A Tropa conta como 1 invocação: ocupa um quadrado de 9 m, tem PV = 10 × PV de um Soldado do seu nível e usa os valores de ataque e Reação de um Soldado. Cada Ação Principal da Tropa é 1 rolagem de ataque contra cada inimigo dentro ou adjacente ao quadrado dela, com o dano de um Soldado. Quando a Tropa perde PV, perde unidades (1 a cada 10% dos PV), e o dano dela cai na mesma proporção.",
    "esc": "+5 Soldados por nível (nv5 = 30), aumentando os PV da Tropa na mesma proporção.",
    "m3": "A Tropa é comandada por uma Elite: ela usa o ataque e a Reação de uma Elite do seu nível.",
    "m5": "A Tropa recebe os bônus das suas passivas de Domínio (Elo de Comando e Legião)."
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
    "freq": "Sempre ativa",
    "ef": "Você sente toda fonte de mana no alcance (criaturas, itens, armadilhas), mesmo Invisível ou atrás de paredes, e sabe a direção e a distância. Com um teste de Sentir Mana (CD 10 + nível da criatura), descobre o Rank dela.",
    "esc": "+9 m de alcance por nível (nv5 = 45 m).",
    "m3": "Você pode usar Reação contra ataques de criaturas Invisíveis dentro do alcance.",
    "m5": "Você também sabe o tipo de poder de cada fonte (elemento, invocação, cura, maldição etc.)."
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
    "freq": "1× por rodada",
    "ef": "Abre a janela de status de 1 criatura que você veja no alcance. O Mestre diz o nível e os PV atuais dela.",
    "esc": "Cada nível revela mais: nv2 Reações e RD; nv3 Resistências, imunidades e fraquezas; nv4 habilidades ativas; nv5 tudo, inclusive habilidades e traços ocultos.",
    "m3": "Também funciona em itens: revela afixos, Selos ocultos e maldições.",
    "m5": "Custa 0 PM."
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
    "freq": "Sempre ativa",
    "ef": "Você nunca fica Surpreso e recebe +2 em Iniciativa.",
    "esc": "+2 em Iniciativa por nível (nv5 = +10).",
    "m3": "Você pode usar Reação contra ataques que não percebe, com −5 na rolagem.",
    "m5": "A penalidade de −5 contra ataques que não percebe deixa de existir."
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
    "dur": "Até o início do seu próximo turno",
    "freq": "1× por rodada",
    "ef": "Escolha 1 criatura que você analisou com Análise neste combate. Até o início do seu próximo turno, todo ataque seu e dos seus aliados que a acertar causa +2 de dano.",
    "esc": "+2 de dano por nível (nv5 = +10).",
    "m3": "Ataques contra ela também têm margem de crítico +1.",
    "m5": "O efeito dura até o início do seu segundo turno seguinte."
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
    "alc": "3 m de espessura",
    "dur": "Permanente",
    "freq": "Sempre ativa",
    "ef": "Você enxerga criaturas Invisíveis como se fossem visíveis, e enxerga através de paredes e objetos de até 3 m de espessura.",
    "esc": "+3 m de espessura por nível (nv5 = 15 m).",
    "m3": "Você enxerga normalmente em escuridão total, inclusive mágica.",
    "m5": "Você vê ilusões como elas realmente são, sem teste."
  },
  {
    "id": "sen9",
    "t": "sentidos",
    "r": "C",
    "n": "Dissipar Mana",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 6,
    "attr": "PER/INT",
    "pre": [
      [
        "sen2",
        2
      ]
    ],
    "alc": "18 m",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Escolha 1 efeito ativo criado por habilidade ou poder que você veja no alcance: uma barreira, uma zona, um bônus temporário de um inimigo ou uma invocação. Faça um teste de Sentir Mana (1d20 + mod PER + grau) contra 10 + o Nível de quem criou o efeito. Sucesso: o efeito termina na hora (a barreira desaparece, a invocação some). Não afeta efeitos permanentes (passivas, afixos, Selos) nem Formas Evoluídas de Despertar.",
    "esc": "+2 no teste por nível (nv5 = +8).",
    "m3": "Silenciar: em vez de dissipar, 1 criatura no alcance faz Resistência (PRE) contra sua CD (PER ou INT, o maior). Falha: ela não pode usar habilidades nem poderes que gastem PM até o fim do próximo turno dela. Um Chefe que falhar fica silenciado só até o início do seu próximo turno.",
    "m5": "O Dissipar afeta todos os efeitos que você escolher num raio de 6 m dentro do alcance, com um teste para cada um."
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
    "dur": "Até o fim do combate",
    "freq": "Sempre ativa",
    "ef": "Cada vez que um mesmo inimigo atacar você, você recebe +1 cumulativo nas Reações contra ele, até no máximo +3. O bônus some no fim do combate.",
    "esc": "+1 no máximo por nível (nv5 = +7).",
    "m3": "O mesmo bônus também vale nos seus ataques contra esse inimigo.",
    "m5": "Contra inimigos que você analisou com Análise, o combate já começa com +2."
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
    "freq": "1× por combate",
    "ef": "Enquanto durar, nas suas rolagens de ataque, role 2d20 e use o maior.",
    "esc": "+1 rodada de duração por nível (nv5 = 6 rodadas).",
    "m3": "Enquanto durar, também role 2d20 e use o maior nas suas Reações.",
    "m5": "Enquanto durar, um 19 natural no ataque conta como 20 natural."
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
    "freq": "1× por combate (2× no nv3, 3× no nv5)",
    "ef": "Depois de ver o resultado de uma ação de um inimigo no alcance (ataque, habilidade ou movimento), anule-a completamente: ela não acontece e a ação gasta se perde. Um Chefe faz Resistência (PER) contra sua CD (PER): se passar, a ação acontece com metade do efeito (metade do dano, condições duram metade).",
    "esc": "nv3: 2× por combate; nv5: 3× por combate.",
    "m3": "Em vez de anular, você pode redirecionar a ação para outro alvo válido no alcance dela.",
    "m5": "Na rodada em que usar este poder, você e os aliados a até 9 m recebem +2 em Reações."
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
    "dur": "1 minuto (10 rodadas)",
    "freq": "À vontade (não acumula com ele mesmo)",
    "ef": "Mana flui pelos músculos: +1 em ataques e +2 de dano corpo a corpo por 1 minuto.",
    "esc": "+1 de ataque e +2 de dano por nível (nv5 = +5 e +10).",
    "m3": "Enquanto durar, também +3 m de Deslocamento.",
    "m5": "Ativar passa a ser Ação Livre (1× por rodada)."
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
    "freq": "Sempre ativa",
    "ef": "+5 PM máximos. Em combate, recupere 1 PM no início de cada turno seu.",
    "esc": "+5 PM máximos e +1 PM por turno por nível (nv5 = +25 PM e 5 PM por turno).",
    "m3": "O descanso curto recupera metade dos seus PM máximos (em vez de 1/4).",
    "m5": "Na primeira vez em cada dia que você chegar a 0 PM, recupere metade dos PM máximos imediatamente."
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
    "alc": "Raio de 9 m ao seu redor",
    "dur": "2 rodadas",
    "freq": "1× por rodada",
    "ef": "Cada inimigo no raio faz Resistência (PRE) contra sua CD (PRE). Falha: fica Amedrontado por 2 rodadas (sua fonte do medo é você).",
    "esc": "+3 m de raio e +1 na CD por nível (nv5 = 21 m, +4).",
    "m3": "Lacaios que falharem fogem de você pelo caminho mais rápido durante o efeito.",
    "m5": "Inimigos 5 ou mais níveis abaixo do seu falham automaticamente."
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
    "dur": "Até o fim do seu turno",
    "freq": "1× por rodada",
    "ef": "Seu próximo ataque ou habilidade de dano neste turno causa +2d8 de dano (a 1 alvo; em área, só ao primeiro alvo que você escolher). Ao ativar, você sofre 1d6 de dano que nenhuma RD reduz. Se não causar dano até o fim do turno, o bônus se perde.",
    "esc": "+1d8 de dano por nível (nv5 = +6d8).",
    "m3": "O dano que você sofre passa a 1d4.",
    "m5": "Se o ataque com Sobrecarga for crítico, você não sofre o dano (role o 1d4 só se não for crítico)."
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
    "freq": "Sempre ativa",
    "ef": "+5 PV máximos, +5 PM máximos e +1 em todas as Resistências.",
    "esc": "+5 PV, +5 PM e +1 em Resistências por nível (nv5 = +25, +25, +5).",
    "m3": "Você não precisa respirar, comer nem beber.",
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
    "alc": "Raio de 6 m ao seu redor",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Sua mana explode. Cada inimigo no raio faz Resistência (FOR) contra sua CD (PRE ou VIT, o maior). Falha: sofre 6d6 + mod PRE ou VIT (o maior) + metade do Nível e é empurrado 6 m para longe de você. Sucesso: metade do dano e não é empurrado.",
    "esc": "+1d6 por nível (nv5 = 10d6).",
    "m3": "Pode ser usada como Reação quando você for alvo de um ataque à distância, pagando 24 PM (1× por rodada): o projétil é destruído antes de atingi-lo (o ataque erra) e a explosão acontece normalmente.",
    "m5": "Raio de 12 m."
  },
  {
    "id": "aur9",
    "t": "aura",
    "r": "B",
    "n": "Mão Invisível",
    "tipo": "Ativa",
    "acao": "Ação Principal",
    "pm": 8,
    "attr": "PRE",
    "pre": [
      [
        "aur3",
        2
      ]
    ],
    "alc": "18 m",
    "dur": "Instantânea",
    "freq": "À vontade",
    "ef": "Sua mana agarra à distância uma criatura de até 1 tamanho acima do seu, ou um objeto solto de até 500 kg, no alcance. Escolha 1: Arrastar: a criatura faz Resistência (FOR) contra sua CD (PRE); falha, é movida até 9 m na direção que você escolher e cai Derrubada. Esmagar: a criatura faz Resistência (FOR) contra sua CD (PRE); falha, sofre 4d8 + mod PRE + metade do Nível e fica Agarrada por você até o fim do próximo turno dela; sucesso, metade do dano e não fica Agarrada. Objeto: mova o objeto até 18 m (arremessá-lo contra alguém é um ataque de poder PRE, com 4d8 + mod PRE + metade do Nível).",
    "esc": "+1d8 de dano e +3 m na distância do Arrastar por nível (nv5 = 8d8, 21 m).",
    "m3": "Ativa (Reação, 8 PM, 1× por rodada): quando um ataque à distância com projétil físico (flecha, bala, lâmina arremessada) for feito contra você ou um aliado a até 18 m, desvie-o antes da rolagem: o ataque erra.",
    "m5": "Arrastar e Esmagar podem atingir até 3 criaturas no alcance com o mesmo uso (cada uma resiste separadamente)."
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
    "ef": "Você ultrapassa seus limites por 3 rodadas: +1 Ação Principal por rodada (a partir da próxima passada) e +4 em ataques, Reações e dano. Quando o efeito acaba, você fica Exausto.",
    "esc": "+1 rodada de duração por nível (nv5 = 7 rodadas).",
    "m3": "Ao terminar, você fica Lento por 1 rodada em vez de Exausto.",
    "m5": "+2 Ações Principais por rodada (em vez de +1)."
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
    "alc": "Raio de 18 m ao seu redor",
    "dur": "Permanente",
    "freq": "Sempre ativa",
    "ef": "Inimigos de nível menor que o seu, dentro do raio, sofrem −2 em ataques e Resistências. Aliados dentro do raio recebem +1 em ataques.",
    "esc": "+1 na penalidade e no bônus, e +6 m de raio, por nível (nv5 = −6, +5, 42 m).",
    "m3": "Lacaios de nível menor que o seu não conseguem se mover para ficar mais perto de você.",
    "m5": "1× por combate, como Ação Livre: cada inimigo no raio faz Resistência (PRE) contra sua CD (PRE). Falha: fica Incapacitado de medo até o fim do próximo turno dele (um Chefe fica só Amedrontado)."
  }
];

/* Gerado por scripts/importar-data-js.mjs a partir do data.js do site original.
   Pode ser editado à mão; se reimportar, revise o diff. */
import type { RaridadeDespertar, InfoRaridadeDespertar, Despertar } from '../tipos';

export const RARIDADE_DESPERTAR: Record<RaridadeDespertar, InfoRaridadeDespertar> = {
  "Comum": {
    "cor": "#9aa5b1",
    "ph": 2,
    "status": 4,
    "txt": "+2 PH e +4 Pontos de Status extras na criação."
  },
  "Raro": {
    "cor": "#4aa8ff",
    "ph": 1,
    "status": 2,
    "txt": "+1 PH e +2 Pontos de Status extras na criação."
  },
  "Épico": {
    "cor": "#b06cff",
    "ph": 0,
    "status": 0,
    "txt": "Sem compensação."
  },
  "Lendário": {
    "cor": "#ffb340",
    "ph": 0,
    "status": 0,
    "txt": "Sem compensação. O Mestre ganha 1 Complicação para usar contra você por aventura."
  },
  "Anomalia": {
    "cor": "#ff4d6d",
    "ph": 0,
    "status": 0,
    "txt": "Sem compensação. Você está sujeito à Missão Diária obrigatória e à Zona de Penalidade."
  }
};

export const DESPERTARES: Despertar[] = [
  {
    "id": "d01",
    "d": [
      1,
      4
    ],
    "n": "Corpo Endurecido",
    "rar": "Comum",
    "afin": [
      "bastiao",
      "punho"
    ],
    "desc": "Sua pele ganhou a densidade do aço quando a mana entrou em seu corpo.",
    "ef": "RD 2 contra todo dano. Ação de Movimento (2 PM): até o fim da rodada, RD dobrada.",
    "esc": "+1 RD por nível.",
    "m3": "Seus ataques desarmados causam +1d6.",
    "m5": "A RD dobrada dura 1 minuto.",
    "forma": "Forma de Aço — Ação Livre, 15 PM, 1×/combate: por 3 rodadas, imune a dano físico de criaturas de nível menor que o seu."
  },
  {
    "id": "d02",
    "d": [
      5,
      8
    ],
    "n": "Lâmina de Mana",
    "rar": "Comum",
    "afin": [
      "lamina",
      "elementos"
    ],
    "desc": "Sua mana reveste naturalmente qualquer arma que você segura.",
    "ef": "Ação Livre (1 PM): sua arma causa +1d6 de dano de mana até o fim do turno.",
    "esc": "+1d6 por nível.",
    "m3": "O alcance de suas armas corpo a corpo aumenta em 1,5 m.",
    "m5": "Ativação sem custo.",
    "forma": "Lâmina Absoluta — sua lâmina de mana pode se estender até 30 m em um corte (Ação Principal, 10 PM)."
  },
  {
    "id": "d03",
    "d": [
      9,
      12
    ],
    "n": "Olhos de Caçador",
    "rar": "Comum",
    "afin": [
      "sentidos",
      "disparo"
    ],
    "desc": "Você vê o fluxo de mana nos corpos e identifica onde ele é mais frágil.",
    "ef": "+2 em Percepção e Sentir Mana. Margem de crítico +1 contra alvos que você analisou nesta cena.",
    "esc": "+1 em Percepção e Sentir Mana por nível.",
    "m3": "Você vê através de ilusões de Rank igual ou inferior ao seu.",
    "m5": "Margem de crítico +2 contra alvos analisados.",
    "forma": "Olhar Penetrante — seus ataques contra alvos analisados ignoram toda RD."
  },
  {
    "id": "d04",
    "d": [
      13,
      16
    ],
    "n": "Passos Velozes",
    "rar": "Comum",
    "afin": [
      "vulto",
      "aura"
    ],
    "desc": "O mundo parece mais lento desde o seu despertar.",
    "ef": "+3 m de deslocamento e +2 em Iniciativa.",
    "esc": "+1,5 m e +1 Iniciativa por nível.",
    "m3": "Corrida multiplica o deslocamento por 5.",
    "m5": "Você recebe 1 Ação de Movimento extra por rodada.",
    "forma": "Velocidade Divina — 1×/combate, ganhe um turno extra completo imediatamente após o seu."
  },
  {
    "id": "d05",
    "d": [
      17,
      20
    ],
    "n": "Chama Interior",
    "rar": "Comum",
    "afin": [
      "elementos",
      "aura"
    ],
    "desc": "Um fogo arde dentro de você e responde à sua vontade.",
    "ef": "RD 3 contra fogo. Ação Principal (2 PM): projétil de fogo 2d8 + mod INT (18 m).",
    "esc": "+1d8 por nível.",
    "m3": "Imune a fogo.",
    "m5": "Seus ataques corpo a corpo deixam o alvo Queimando (1d6, 2 rodadas).",
    "forma": "Fênix — 1×/dia, ao morrer, renasce em chamas com metade dos PV causando 6d10 em raio de 9 m."
  },
  {
    "id": "d06",
    "d": [
      21,
      24
    ],
    "n": "Toque Restaurador",
    "rar": "Comum",
    "afin": [
      "restauracao",
      "aura"
    ],
    "desc": "Suas mãos irradiam uma mana morna que fecha feridas.",
    "ef": "Ação Principal (2 PM): toque cura 1d8 + mod PRE. Você recupera 1 PV extra em toda cura recebida.",
    "esc": "+1d8 por nível.",
    "m3": "Pode curar a 9 m.",
    "m5": "Curar é Ação de Movimento.",
    "forma": "Mãos de Santo — sua cura também recupera PM igual à metade do valor curado."
  },
  {
    "id": "d07",
    "d": [
      25,
      28
    ],
    "n": "Barreira Menor",
    "rar": "Comum",
    "afin": [
      "bastiao",
      "restauracao"
    ],
    "desc": "Você cria películas de mana sólida, translúcidas e azuladas.",
    "ef": "Reação (2 PM): conceda +2 na Reação de Defender a você ou um aliado a 9 m.",
    "esc": "+1 por nível.",
    "m3": "Ação Principal: crie uma parede de 3 m com 10 PV por nível.",
    "m5": "A barreira também bloqueia efeitos de área contra quem estiver atrás dela.",
    "forma": "Domo — Ação Especial, 20 PM: domo de raio 9 m com 50 PV × nível do Despertar."
  },
  {
    "id": "d08",
    "d": [
      29,
      32
    ],
    "n": "Arqueiro Nato",
    "rar": "Comum",
    "afin": [
      "disparo",
      "sentidos"
    ],
    "desc": "Qualquer coisa que você arremessa ou dispara encontra o alvo.",
    "ef": "+1 em ataques à distância e +1d4 de dano à distância.",
    "esc": "+1 ataque por nível; +1d4 nos níveis 3 e 5.",
    "m3": "Você pode atacar à distância sem munição (projéteis de mana).",
    "m5": "Seus ataques à distância contam como críticos com 19–20.",
    "forma": "Tiro Inevitável — 1×/combate, um ataque à distância acerta automaticamente como crítico."
  },
  {
    "id": "d09",
    "d": [
      33,
      36
    ],
    "n": "Fúria",
    "rar": "Comum",
    "afin": [
      "punho",
      "lamina"
    ],
    "desc": "A dor alimenta sua mana. Quanto mais você sangra, mais forte fica.",
    "ef": "Ação Livre (2 PM): entre em Fúria por 1 minuto: +2 de dano corpo a corpo e RD 2, mas −2 em Esquivar.",
    "esc": "+1 dano e +1 RD por nível.",
    "m3": "Enquanto estiver abaixo da metade dos PV, o bônus de dano dobra.",
    "m5": "Em Fúria, você não fica Incapacitado até chegar a −metade dos PV máximos.",
    "forma": "Besta Interior — em Fúria, ganha +1 Ação Principal por rodada."
  },
  {
    "id": "d10",
    "d": [
      37,
      40
    ],
    "n": "Toque Gélido",
    "rar": "Comum",
    "afin": [
      "elementos",
      "bastiao"
    ],
    "desc": "O ar congela ao seu redor quando você se concentra.",
    "ef": "RD 3 contra gelo. Ação Principal (2 PM): o alvo a 9 m faz Resistência (VIT) ou fica Lento por 1 rodada e sofre 2d6.",
    "esc": "+1d6 por nível.",
    "m3": "Você cria gelo sólido (pontes, paredes, armas temporárias).",
    "m5": "O alvo que falhar por 5+ fica Imobilizado.",
    "forma": "Inverno Eterno — zona de raio 18 m por 1 minuto: inimigos ficam Lentos e sofrem 3d10 por turno."
  },
  {
    "id": "d11",
    "d": [
      41,
      44
    ],
    "n": "Vínculo Bestial",
    "rar": "Comum",
    "afin": [
      "dominio",
      "sentidos"
    ],
    "desc": "Bestas mágicas hesitam diante de você — algumas até o seguem.",
    "ef": "Você começa com um companheiro animal (Lacaio do seu nível) e entende a intenção de bestas.",
    "esc": "O companheiro ganha +1 nível efetivo por nível.",
    "m3": "O companheiro vira Soldado.",
    "m5": "O companheiro vira Elite e pode usar uma habilidade sua da árvore Domínio.",
    "forma": "Rei das Feras — bestas de nível menor que o seu precisam de Resistência (PRE) para atacá-lo."
  },
  {
    "id": "d12",
    "d": [
      45,
      48
    ],
    "n": "Sangue Fervente",
    "rar": "Comum",
    "afin": [
      "aura",
      "bastiao"
    ],
    "desc": "Seu corpo se recupera em velocidade anormal.",
    "ef": "Recupera 1 PV no início de cada turno em combate. Descanso curto recupera metade dos PV.",
    "esc": "+1 PV por turno por nível.",
    "m3": "Imune a veneno e doenças comuns.",
    "m5": "Membros perdidos voltam a crescer em 1 dia.",
    "forma": "Imortal Menor — 1×/dia, ao chegar a 0 PV, volta imediatamente com 25% dos PV."
  },
  {
    "id": "d13",
    "d": [
      49,
      52
    ],
    "n": "Senhor do Trovão",
    "rar": "Raro",
    "afin": [
      "elementos",
      "vulto"
    ],
    "desc": "Eletricidade corre por seus nervos; você se move como um relâmpago.",
    "ef": "Ação Principal (3 PM): raio em linha de 18 m, 2d10. Seus ataques corpo a corpo causam +1d4 de raio.",
    "esc": "+1d10 no raio por nível.",
    "m3": "Ação de Movimento (3 PM): teleporte-se 9 m como um raio.",
    "m5": "Inimigos atingidos pelo raio não podem usar Reação até seu próximo turno.",
    "forma": "Tempestade Viva — você se torna raio por 3 rodadas: +2 Ações Principais e imunidade a ataques corpo a corpo."
  },
  {
    "id": "d14",
    "d": [
      53,
      56
    ],
    "n": "Telecinese",
    "rar": "Raro",
    "afin": [
      "dominio",
      "elementos"
    ],
    "desc": "Você move objetos com a mente.",
    "ef": "Ação Principal (2 PM): mova um objeto ou criatura de até 50 kg a 18 m (Resistência FOR para criaturas). Arremessar causa 2d6.",
    "esc": "Peso ×2 e +1d6 por nível.",
    "m3": "Pode voar levitando a si mesmo (deslocamento normal).",
    "m5": "Pode segurar até 10 projéteis no ar como Reação (1×/rodada).",
    "forma": "Mão do Céu — mova até 10 toneladas; esmagar causa 10d10."
  },
  {
    "id": "d15",
    "d": [
      57,
      60
    ],
    "n": "Pele de Fera",
    "rar": "Raro",
    "afin": [
      "punho",
      "aura"
    ],
    "desc": "Você se transforma em uma besta humanoide.",
    "ef": "Ação de Movimento (4 PM): forma bestial por 1 minuto: garras 1d8, +2 FOR, +2 AGI (atributo), +3 m deslocamento.",
    "esc": "+2 FOR/AGI por nível.",
    "m3": "Regenera 3 PV por turno na forma bestial.",
    "m5": "Na forma bestial, suas garras ignoram 5 de RD e você pode escalar qualquer superfície.",
    "forma": "Fera Ancestral — forma Grande: dobro de alcance, +20 PV temporários por nível do Despertar."
  },
  {
    "id": "d16",
    "d": [
      61,
      64
    ],
    "n": "Mestre das Runas",
    "rar": "Raro",
    "afin": [
      "restauracao",
      "dominio"
    ],
    "desc": "Você enxerga a linguagem da mana e pode escrevê-la em objetos.",
    "ef": "Em 10 minutos, grave uma runa em um item: +1 ataque/Defender ou um afixo Comum temporário (1 dia). +4 em Testes de Refino.",
    "esc": "+1 runa simultânea por nível.",
    "m3": "Runas armadilha: explodem com 4d6 quando ativadas.",
    "m5": "Uma runa pode se tornar permanente (1×/semana).",
    "forma": "Escriba do Sistema — você pode Ascender um item sem Núcleo de Chefe (1×/mês)."
  },
  {
    "id": "d17",
    "d": [
      65,
      68
    ],
    "n": "Presença Opressora",
    "rar": "Raro",
    "afin": [
      "aura",
      "dominio"
    ],
    "desc": "Sua mana pesa sobre todos que estão por perto.",
    "ef": "+2 em Intimidação. Ação Livre (3 PM): um inimigo a 9 m faz Resistência (PRE) ou fica Amedrontado por 1 rodada.",
    "esc": "+1 Intimidação e +1 CD por nível.",
    "m3": "Afeta todos os inimigos a 9 m.",
    "m5": "Amedrontados por você também ficam Lentos.",
    "forma": "Reino do Medo — inimigos que falharem ficam Incapacitados por 1 rodada."
  },
  {
    "id": "d18",
    "d": [
      69,
      72
    ],
    "n": "Toxina Viva",
    "rar": "Raro",
    "afin": [
      "vulto",
      "restauracao"
    ],
    "desc": "Você produz e controla venenos com sua mana.",
    "ef": "Imune a venenos. Ação Livre (2 PM): seu próximo acerto deixa o alvo Envenenado (2d4 por 3 rodadas).",
    "esc": "+1d4 por nível.",
    "m3": "Ação Principal: nuvem tóxica de raio 3 m.",
    "m5": "Seu veneno afeta até criaturas imunes.",
    "forma": "Praga — o veneno se espalha para inimigos adjacentes ao envenenado."
  },
  {
    "id": "d19",
    "d": [
      73,
      76
    ],
    "n": "Duplo de Mana",
    "rar": "Raro",
    "afin": [
      "vulto",
      "dominio"
    ],
    "desc": "Você cria cópias de si mesmo feitas de mana pura.",
    "ef": "Ação Principal (4 PM): crie 1 clone com 1 PV, sua Defesa e seu ataque (dano metade) por 1 minuto.",
    "esc": "+1 clone por nível.",
    "m3": "Clones têm 10% dos seus PV.",
    "m5": "Você pode trocar de lugar com um clone como Reação.",
    "forma": "Exército de Um — clones causam dano completo e podem usar habilidades Rank E/D suas."
  },
  {
    "id": "d20",
    "d": [
      77,
      80
    ],
    "n": "Absorção",
    "rar": "Raro",
    "afin": [
      "aura",
      "sentidos"
    ],
    "desc": "Você drena a mana do que toca.",
    "ef": "Ao acertar um ataque corpo a corpo, recupera 1 PM e o alvo perde 1 PM.",
    "esc": "+1 PM por nível.",
    "m3": "Ao derrotar um inimigo, recupera PV igual ao nível dele.",
    "m5": "Reação (5 PM): absorva um poder que o atinja, anulando metade do dano.",
    "forma": "Devorar — ao derrotar um Chefe, copie uma habilidade dele até o fim da aventura."
  },
  {
    "id": "d21",
    "d": [
      81,
      82
    ],
    "n": "Titã",
    "rar": "Épico",
    "afin": [
      "punho",
      "bastiao"
    ],
    "desc": "Seu corpo cresce até proporções gigantescas.",
    "ef": "Ação de Movimento (6 PM): cresça para tamanho Grande por 1 minuto: alcance 3 m, +4 de dano corpo a corpo, +10 PV temporários.",
    "esc": "+10 PV temporários e +2 de dano por nível.",
    "m3": "Tamanho Enorme: alcance 4,5 m.",
    "m5": "Tamanho Colossal: alcance 9 m, seus golpes atingem todos em um cone de 4,5 m.",
    "forma": "Gigante Primordial — como Colossal, mas imune a Derrubado, Agarrado e empurrões."
  },
  {
    "id": "d22",
    "d": [
      83,
      84
    ],
    "n": "Gravidade",
    "rar": "Épico",
    "afin": [
      "elementos",
      "dominio"
    ],
    "desc": "Você dobra o peso do mundo.",
    "ef": "Ação Principal (4 PM): área de raio 3 m a 18 m: Resistência (FOR) ou Derrubado e Lento.",
    "esc": "+1,5 m de raio por nível.",
    "m3": "Você pode andar em paredes e tetos.",
    "m5": "Criaturas na área também sofrem 4d10.",
    "forma": "Singularidade — ponto de colapso que puxa tudo em 18 m e causa 10d10 por rodada."
  },
  {
    "id": "d23",
    "d": [
      85,
      86
    ],
    "n": "Passo Espacial",
    "rar": "Épico",
    "afin": [
      "vulto",
      "sentidos"
    ],
    "desc": "Para você, o espaço é uma porta.",
    "ef": "Ação de Movimento (3 PM): teleporte-se até 9 m para um ponto que possa ver.",
    "esc": "+9 m por nível.",
    "m3": "Pode levar um aliado adjacente.",
    "m5": "Reação (6 PM): teleporte-se para evitar um ataque.",
    "forma": "Portal Pessoal — crie um portal entre dois pontos que conheça (até 10 km)."
  },
  {
    "id": "d24",
    "d": [
      87,
      88
    ],
    "n": "Luz Sagrada",
    "rar": "Épico",
    "afin": [
      "restauracao",
      "elementos"
    ],
    "desc": "Uma luz dourada que cura aliados e queima monstros.",
    "ef": "Ação Principal (4 PM): raio de luz que cura 2d8 em aliados ou causa 2d8 em monstros (raio 6 m).",
    "esc": "+1d8 por nível.",
    "m3": "Mortos-vivos e demônios sofrem dano dobrado.",
    "m5": "Raio 12 m.",
    "forma": "Milagre — 1×/semana, ressuscita uma criatura morta há até 1 dia."
  },
  {
    "id": "d25",
    "d": [
      89,
      90
    ],
    "n": "Senhor dos Ventos",
    "rar": "Épico",
    "afin": [
      "elementos",
      "disparo"
    ],
    "desc": "O vento obedece aos seus gestos.",
    "ef": "Você pode planar. Ação Principal (3 PM): lâmina de vento a 18 m, 2d8, empurra 3 m.",
    "esc": "+1d8 por nível.",
    "m3": "Voo com o dobro do seu deslocamento.",
    "m5": "Projéteis contra você sofrem −4.",
    "forma": "Furacão — tornado de 9 m que dura 3 rodadas, 8d8 por rodada e arremessa criaturas."
  },
  {
    "id": "d26",
    "d": [
      91,
      92
    ],
    "n": "Forja Viva",
    "rar": "Épico",
    "afin": [
      "lamina",
      "bastiao"
    ],
    "desc": "Você materializa armas e armaduras de mana sólida.",
    "ef": "Ação Livre (2 PM): crie qualquer arma ou escudo da tabela, com Rank igual ao seu, que dura 1 cena.",
    "esc": "A arma ganha +1 de refino por nível.",
    "m3": "A arma criada ganha um afixo à sua escolha.",
    "m5": "Pode criar até 3 armas simultâneas e arremessá-las (Ação Principal).",
    "forma": "Arsenal Infinito — 20 armas surgem e caem sobre uma área de 9 m (8d10)."
  },
  {
    "id": "d27",
    "d": [
      93,
      94
    ],
    "n": "Precognição",
    "rar": "Épico",
    "afin": [
      "sentidos",
      "vulto"
    ],
    "desc": "Lampejos de segundos à frente.",
    "ef": "1× por rodada, role novamente uma Reação.",
    "esc": "+1 rerrolagem por combate por nível.",
    "m3": "Você nunca é surpreendido e sabe a ordem de Iniciativa antes de rolar.",
    "m5": "1× por rodada, role novamente um ataque.",
    "forma": "Mil Futuros — 1×/dia, desfaça a última rodada inteira (tudo volta como estava)."
  },
  {
    "id": "d28",
    "d": [
      95,
      96
    ],
    "n": "Hemomancia",
    "rar": "Épico",
    "afin": [
      "vulto",
      "aura"
    ],
    "desc": "Você controla o sangue — o seu e o dos outros.",
    "ef": "Pode pagar custos de PM com PV. Ação Principal (3 PM): lâmina de sangue 2d10 a 9 m; o alvo fica Sangrando (2/turno).",
    "esc": "+1d10 por nível.",
    "m3": "Você cura metade do dano causado por esta habilidade.",
    "m5": "Inimigos Sangrando não podem se curar.",
    "forma": "Maré Carmesim — controle o corpo de um inimigo Sangrando por 1 rodada (Resistência VIT)."
  },
  {
    "id": "d29",
    "d": [
      97,
      97
    ],
    "n": "Coração de Dragão",
    "rar": "Lendário",
    "afin": [
      "elementos",
      "aura"
    ],
    "desc": "Algo antigo e escamoso dormia dentro de você.",
    "ef": "RD 3 contra tudo. Ação Principal (6 PM): sopro em cone de 9 m, 4d10 de fogo negro.",
    "esc": "+2d10 por nível.",
    "m3": "Asas: voo com o dobro do deslocamento.",
    "m5": "O fogo negro ignora imunidades.",
    "forma": "Forma Dracônica — vira um dragão Enorme por 1 minuto (o Mestre usa a ficha de um Chefe do seu nível)."
  },
  {
    "id": "d30",
    "d": [
      98,
      98
    ],
    "n": "Corpo Imortal",
    "rar": "Lendário",
    "afin": [
      "bastiao",
      "punho"
    ],
    "desc": "Seu corpo se recusa a morrer.",
    "ef": "Regenera 3 PV por turno, mesmo Incapacitado. Você só morre ao atingir −2× seus PV máximos.",
    "esc": "+3 PV por turno por nível.",
    "m3": "Você não fica Incapacitado ao chegar a 0 PV, apenas Lento.",
    "m5": "Só pode morrer por morte instantânea.",
    "forma": "Eterno — ao morrer, renasce em 1 hora com todos os PV (a menos que o corpo seja totalmente destruído)."
  },
  {
    "id": "d31",
    "d": [
      99,
      99
    ],
    "n": "Rei do Enxame",
    "rar": "Lendário",
    "afin": [
      "dominio",
      "sentidos"
    ],
    "desc": "Milhares de criaturas de mana nascem da sua sombra.",
    "ef": "Ação Principal (5 PM): invoca um enxame (Soldado de nível igual ao seu) que ocupa 3 m e ataca todos na área.",
    "esc": "+1 enxame simultâneo por nível.",
    "m3": "Você vê através de todos os enxames.",
    "m5": "Enxames viram Elites.",
    "forma": "Colmeia — um enxame pode se transformar em uma Rainha (Chefe do seu nível) por 1 minuto."
  },
  {
    "id": "d32",
    "d": [
      100,
      100
    ],
    "n": "Herdeiro das Sombras",
    "rar": "Anomalia",
    "afin": [
      "dominio",
      "vulto"
    ],
    "desc": "O Sistema escolheu você. Os mortos que você derrota se recusam a partir.",
    "ef": "Erguer Sombra — Ação Especial (5 PM), até 1 minuto após a morte de uma criatura: teste de PRE (1d20 + Nível + mod PRE) contra CD 10 + nível da criatura. Sucesso: ela se torna sua Sombra leal (mesmo nível, guardada em sua sombra). Até 3 tentativas por corpo. Invocar uma Sombra custa 2 PM por Rank dela (E=1). Máximo de Sombras guardadas: 2 + mod PRE.",
    "esc": "+2 Sombras guardadas por nível; Sombras ganham +1 nível por nível do Despertar.",
    "m3": "Ação de Movimento: troque de lugar com uma Sombra invocada.",
    "m5": "Sombras destruídas voltam após um descanso longo; você pode erguer Chefes (a CD recebe +5).",
    "forma": "Monarca da Noite — Sombras invocadas não custam PM e recebem +1 Rank (Lacaio→Soldado→Elite)."
  }
];

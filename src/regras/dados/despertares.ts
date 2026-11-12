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
    "ef": "Passiva: RD 2 contra todo dano. Ativa (Ação de Movimento, 2 PM, à vontade): sua RD deste Despertar dobra até o início do seu próximo turno.",
    "esc": "+1 de RD por nível (nv5 = RD 6).",
    "m3": "Seus ataques desarmados causam +1d6 de dano.",
    "m5": "A RD dobrada passa a durar 1 minuto (10 rodadas).",
    "forma": "Forma de Aço (Ação Livre, 15 PM, 1× por combate): por 3 rodadas, você não sofre dano físico de criaturas de nível menor que o seu."
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
    "ef": "Ativa (Ação Livre, 1 PM, 1× por rodada): até o fim do seu turno, seus ataques com arma causam +1d6 de dano de mana.",
    "esc": "+1d6 por nível (nv5 = +5d6).",
    "m3": "O alcance das suas armas corpo a corpo aumenta 1,5 m.",
    "m5": "Ativar passa a custar 0 PM.",
    "forma": "Lâmina Absoluta (Ação Principal, 10 PM, à vontade): faça 1 ataque com a arma contra 1 alvo a até 30 m em linha reta, como se ele estivesse ao seu alcance (dano normal da arma +5d6 de mana)."
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
    "ef": "Passiva: +2 em Percepção e Sentir Mana. Sua margem de crítico aumenta em 1 contra criaturas que você analisou com Análise neste combate.",
    "esc": "+1 em Percepção e Sentir Mana por nível (nv5 = +6).",
    "m3": "Você percebe ilusões de Rank igual ou menor que o seu como ilusões, sem teste.",
    "m5": "O aumento de margem de crítico contra analisados passa a 2.",
    "forma": "Olhar Penetrante (passiva): seus ataques contra criaturas que você analisou neste combate ignoram toda a RD."
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
    "ef": "Passiva: +3 m de Deslocamento e +2 em Iniciativa.",
    "esc": "+1,5 m e +1 em Iniciativa por nível (nv5 = +9 m, +6).",
    "m3": "Sua Corrida multiplica o Deslocamento por 5 (em vez de 4).",
    "m5": "Você recebe 1 Ação de Movimento extra por rodada.",
    "forma": "Velocidade Divina (Ação Livre, 0 PM, 1× por combate): logo depois do seu turno, faça um turno extra completo (Movimento + todas as suas Ações Principais)."
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
    "ef": "Passiva: RD 3 contra fogo. Ativa (Ação Principal, 2 PM, à vontade): ataque de poder à distância (INT) contra 1 alvo a até 18 m; dano 2d8 + mod INT + metade do Nível de fogo.",
    "esc": "+1d8 no projétil por nível (nv5 = 6d8).",
    "m3": "Imune a fogo.",
    "m5": "Seus acertos corpo a corpo deixam o alvo Queimando (1d6 no início de cada turno dele, por 2 rodadas).",
    "forma": "Fênix (automática, 1× por dia): na primeira vez no dia em que você morreria, você renasce em chamas com metade dos PV máximos, e cada outra criatura a até 9 m faz Resistência (AGI) contra sua CD (INT): falha, 6d10 de fogo; sucesso, metade."
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
    "ef": "Passiva: toda cura que você recebe recupera +1 PV. Ativa (Ação Principal, 2 PM, à vontade): 1 criatura que você toque recupera 1d8 + mod PRE PV.",
    "esc": "+1d8 na cura por nível (nv5 = 5d8).",
    "m3": "A cura ativa alcança 9 m (não precisa tocar).",
    "m5": "A cura ativa passa a ser Ação de Movimento.",
    "forma": "Mãos de Santo (passiva): sua cura ativa também recupera PM ao alvo, igual à metade dos PV curados (arredondado para baixo)."
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
    "ef": "Ativa (Reação, 2 PM, 1× por rodada): quando você ou um aliado a até 9 m rolar Defender, some +2 à rolagem.",
    "esc": "+1 no bônus por nível (nv5 = +6).",
    "m3": "Ativa (Ação Principal, 4 PM, 1 parede por vez): crie uma parede de 3 m × 3 m a até 9 m, com 10 PV por nível do Despertar, que dura 1 minuto. Nada a atravessa até chegar a 0 PV.",
    "m5": "Quem estiver atrás da parede (em relação à origem) não é atingido por ataques nem efeitos em área que venham do outro lado.",
    "forma": "Domo (Ação Especial, 20 PM, 1× por combate): cúpula de raio 9 m centrada em você, com 50 × nível do Despertar PV, que dura 1 minuto. Nada a atravessa até chegar a 0 PV."
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
    "ef": "Passiva: +1 em ataques à distância e +1d4 de dano à distância.",
    "esc": "+1 no ataque por nível; +1d4 de dano nos níveis 3 e 5 (nv5 = +5, +3d4).",
    "m3": "Você pode atacar com arma à distância sem munição (cria projéteis de mana).",
    "m5": "Sua margem de crítico com ataques à distância passa a 19–20.",
    "forma": "Tiro Inevitável (Ação Livre, 0 PM, 1× por combate): seu próximo ataque à distância neste turno acerta automaticamente e é crítico."
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
    "ef": "Ativa (Ação Livre, 2 PM, 1× por rodada): entre em Fúria por 1 minuto (10 rodadas): +2 de dano corpo a corpo e RD 2, mas −2 em Esquivar. Você pode encerrar a Fúria como Ação Livre.",
    "esc": "+1 de dano e +1 de RD por nível (nv5 = +6, RD 6).",
    "m3": "Em Fúria, enquanto estiver com metade dos PV ou menos, o bônus de dano dobra.",
    "m5": "Em Fúria, estar No Limite não reduz suas Ações Principais.",
    "forma": "Besta Interior (passiva): em Fúria, você recebe +1 Ação Principal por rodada."
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
    "ef": "Passiva: RD 3 contra gelo. Ativa (Ação Principal, 2 PM, à vontade): 1 alvo a até 9 m faz Resistência (VIT) contra sua CD (INT). Falha: sofre 2d6 + mod INT + metade do Nível de gelo e fica Lento até o fim do próximo turno dele. Sucesso: metade do dano.",
    "esc": "+1d6 por nível (nv5 = 6d6).",
    "m3": "Ação Principal, 2 PM: crie um objeto de gelo sólido de até 3 m (ponte, parede, escada) a até 9 m; ele tem 10 PV por nível do Despertar e derrete em 1 hora.",
    "m5": "Quem falhar na Resistência por 5 ou mais fica Imobilizado em vez de Lento.",
    "forma": "Inverno Eterno (Ação Especial, 20 PM, 1× por combate): zona de raio 18 m centrada em você, por 1 minuto. Inimigos dentro dela ficam Lentos e sofrem 3d10 de gelo no início de cada turno deles."
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
    "ef": "Você tem 1 companheiro animal permanente: um Lacaio de nível igual ao seu (tabela de ameaças). Ele segue a regra de Invocações; se chegar a 0 PV, volta após um descanso longo. Você entende a intenção (fome, medo, raiva) de qualquer besta.",
    "esc": "+1 no nível do companheiro por nível (nv5 = seu Nível +4).",
    "m3": "O companheiro passa a ser Soldado.",
    "m5": "O companheiro passa a ser Elite e pode usar 1 habilidade de Domínio que você possua, 1× por rodada, pagando os PM dela com os seus.",
    "forma": "Rei das Feras (passiva): uma besta de nível menor que o seu precisa passar numa Resistência (PRE) contra sua CD (PRE) para atacá-lo; se falhar, não pode atacá-lo até o fim do combate."
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
    "ef": "Passiva: em combate, recupere 1 PV no início de cada turno seu. O descanso curto recupera metade dos seus PV máximos (em vez de 1/4).",
    "esc": "+1 PV por turno por nível (nv5 = 5).",
    "m3": "Imune a veneno e doenças.",
    "m5": "Membros perdidos voltam a crescer em 1 dia.",
    "forma": "Imortal Menor (automática, 1× por dia): na primeira vez no dia em que chegar a 0 PV ou menos, volte imediatamente a 25% dos PV máximos."
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
    "ef": "Passiva: seus ataques corpo a corpo causam +1d4 de raio. Ativa (Ação Principal, 3 PM, à vontade): faça uma única rolagem de ataque de poder (INT) e compare com a Reação de cada criatura numa linha de 18 m; dano 2d10 + mod INT + metade do Nível de raio; quem reagir com sucesso sofre metade.",
    "esc": "+1d10 no raio por nível (nv5 = 6d10).",
    "m3": "Ativa (Ação de Movimento, 3 PM): teleporte-se até 9 m para um ponto que veja, sem provocar Ataque de Oportunidade.",
    "m5": "Criaturas atingidas pelo raio em linha (que não reagiram com sucesso) não podem usar Reação até o início do seu próximo turno.",
    "forma": "Tempestade Viva (Ação Livre, 20 PM, 1× por combate): por 3 rodadas, você recebe +2 Ações Principais por rodada e ataques corpo a corpo contra você erram automaticamente."
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
    "ef": "Ativa (Ação Principal, 2 PM, à vontade): mova até 9 m um objeto ou criatura de até 50 kg que você veja a até 18 m. Uma criatura faz Resistência (FOR) contra sua CD (INT) para não ser movida. Arremessar contra alguém: ataque de poder (INT), dano 2d6 + mod INT + metade do Nível ao objeto arremessado e ao alvo.",
    "esc": "O peso máximo dobra e o dano sobe +1d6 por nível (nv5 = 800 kg, 6d6).",
    "m3": "Você pode voar levitando a si mesmo com seu Deslocamento.",
    "m5": "Ativa (Reação, 0 PM, 1× por rodada): pare no ar todos os projéteis físicos (flechas, balas, pedras) que seriam disparados contra você nesta rodada; esses ataques erram.",
    "forma": "Mão do Céu (Ação Principal, 20 PM, 1× por combate): mova até 10 toneladas; esmagar uma criatura com isso exige Resistência (FOR) contra sua CD (INT): falha, 10d10 + mod INT; sucesso, metade."
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
    "ef": "Ativa (Ação de Movimento, 4 PM, à vontade): forma bestial por 1 minuto (10 rodadas): garras como ataque desarmado de 1d8, +2 em FOR e AGI (no valor do atributo), +3 m de Deslocamento. Você pode encerrar como Ação Livre.",
    "esc": "+2 em FOR e AGI por nível (nv5 = +10 cada).",
    "m3": "Na forma bestial, recupere 3 PV no início de cada turno seu.",
    "m5": "Na forma bestial, suas garras ignoram 5 de RD e você escala qualquer superfície com seu Deslocamento.",
    "forma": "Fera Ancestral (passiva): sua forma bestial passa a ser de tamanho Grande, com o dobro de alcance corpo a corpo e +20 PV temporários por nível do Despertar ao se transformar."
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
    "ef": "Ativa (10 minutos, 0 PM, fora de combate): grave 1 runa num item seu: ou +1 em ataque (arma) / Defender (armadura ou escudo), ou um afixo de Rank igual ao do item escolhido da tabela, que dura 1 dia. Passiva: quando você refinar um item, cada nível de Refino custa 1 cristal a menos (mínimo 1).",
    "esc": "+1 runa ativa ao mesmo tempo por nível (nv5 = 5).",
    "m3": "Runa armadilha (10 minutos): grave num objeto ou chão; quando uma criatura tocar, ela explode, causando 4d6 em raio de 3 m (Resistência AGI contra sua CD INT reduz à metade).",
    "m5": "1× por semana, uma runa de afixo pode ficar permanente.",
    "forma": "Escriba do Sistema (1× por mês): Ascenda um item com Refino +10 sem gastar Núcleo de Chefe."
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
    "ef": "Passiva: +2 em Intimidação. Ativa (Ação Livre, 3 PM, 1× por rodada): 1 inimigo a até 9 m faz Resistência (PRE) contra sua CD (PRE). Falha: fica Amedrontado até o fim do próximo turno dele.",
    "esc": "+1 em Intimidação e +1 na CD por nível (nv5 = +6, +4).",
    "m3": "A ativa afeta todos os inimigos a até 9 m.",
    "m5": "Quem ficar Amedrontado por você também fica Lento pelo mesmo tempo.",
    "forma": "Reino do Medo (passiva): quem falhar na Resistência da ativa fica Incapacitado até o fim do próximo turno dele, em vez de Amedrontado (um Chefe fica Amedrontado e Lento)."
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
    "ef": "Passiva: imune a veneno. Ativa (Ação Livre, 2 PM, 1× por rodada): seu próximo acerto neste turno faz o alvo resistir (VIT) contra sua CD (INT ou AGI, o maior); falha, fica Envenenado por 3 rodadas, sofrendo 2d4 no início de cada turno dele.",
    "esc": "+1d4 por nível (nv5 = 6d4).",
    "m3": "Ativa (Ação Principal, 4 PM): nuvem tóxica de raio 3 m a até 18 m, que dura 2 rodadas; quem começar o turno nela resiste ou fica Envenenado como acima.",
    "m5": "Seu veneno afeta até criaturas imunes a veneno.",
    "forma": "Praga (passiva): no início de cada turno de uma criatura Envenenada por você, cada inimigo adjacente a ela também resiste ou fica Envenenado."
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
    "ef": "Ativa (Ação Principal, 4 PM, máximo de 1 clone ativo): crie 1 clone num espaço livre adjacente, por 1 minuto. Ele tem 1 PV, usa seus valores de ataque, Defender e Esquivar, causa metade do dano das suas armas e não usa habilidades. Segue a regra de Invocações.",
    "esc": "+1 clone ativo no máximo por nível (nv5 = 5).",
    "m3": "Cada clone tem PV igual a 10% dos seus PV máximos.",
    "m5": "Ativa (Reação, 0 PM, 1× por rodada): quando for alvo de um ataque, troque de lugar com um clone; ele vira o alvo.",
    "forma": "Exército de Um (passiva): seus clones causam o dano completo e podem usar suas habilidades de Rank E e D (pagando os PM com os seus)."
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
    "ef": "Passiva: ao acertar um ataque corpo a corpo, você recupera 1 PM e o alvo perde 1 PM.",
    "esc": "+1 PM drenado por nível (nv5 = 5).",
    "m3": "Ao derrotar um inimigo, recupere PV iguais ao nível dele.",
    "m5": "Ativa (Reação, 5 PM, 1× por rodada): quando sofrer dano de uma habilidade ou poder, reduza esse dano à metade.",
    "forma": "Devorar (ao derrotar um Chefe, 1× por aventura): escolha 1 poder dele (o Mestre descreve as opções); você pode usá-lo até o fim da aventura, com o custo em PM que o Mestre definir."
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
    "ef": "Ativa (Ação de Movimento, 6 PM, à vontade): fique Grande por 1 minuto (10 rodadas): alcance corpo a corpo 3 m, +4 de dano corpo a corpo e +10 PV temporários.",
    "esc": "+10 PV temporários e +2 de dano por nível (nv5 = +50, +12).",
    "m3": "Você fica Enorme (em vez de Grande): alcance 4,5 m.",
    "m5": "Você fica Colossal: alcance 9 m, e cada ataque corpo a corpo atinge todas as criaturas que você escolher num cone de 4,5 m (uma rolagem, comparada à Reação de cada uma).",
    "forma": "Gigante Primordial (passiva): enquanto estiver Colossal, você é imune a Derrubado, Agarrado e a ser empurrado."
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
    "ef": "Ativa (Ação Principal, 4 PM, à vontade): área de raio 3 m centrada num ponto a até 18 m. Cada criatura na área faz Resistência (FOR) contra sua CD (INT). Falha: fica Derrubada e Lenta até o fim do próximo turno dela.",
    "esc": "+1,5 m de raio por nível (nv5 = 9 m).",
    "m3": "Você pode andar em paredes e tetos.",
    "m5": "Quem falhar também sofre 4d10 + mod INT + metade do Nível.",
    "forma": "Singularidade (Ação Especial, 25 PM, 1× por combate): ponto de colapso a até 36 m, por 3 rodadas. No início de cada turno seu, cada criatura a até 18 m do ponto é puxada 6 m para ele e faz Resistência (FOR) contra sua CD (INT): falha, 10d10; sucesso, metade."
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
    "ef": "Ativa (Ação de Movimento, 3 PM, à vontade): teleporte-se até 9 m para um ponto que possa ver. Não provoca Ataque de Oportunidade.",
    "esc": "+9 m por nível (nv5 = 45 m).",
    "m3": "Você pode levar junto 1 aliado adjacente (ele aparece adjacente a você).",
    "m5": "Ativa (Reação, 6 PM, 1× por rodada): quando for alvo de um ataque que perceba, antes da rolagem, teleporte-se; o ataque erra.",
    "forma": "Portal Pessoal (10 minutos, 20 PM, 1× por dia): crie um portal entre o seu local e um lugar que você já visitou a até 10 km, que fica aberto por 1 minuto para qualquer um atravessar."
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
    "ef": "Ativa (Ação Principal, 4 PM, à vontade): explosão de luz de raio 6 m centrada num ponto a até 18 m. Aliados na área recuperam 2d8 + mod PRE PV. Inimigos na área fazem Resistência (PRE) contra sua CD (PRE): falha, sofrem 2d8 + mod PRE + metade do Nível; sucesso, metade.",
    "esc": "+1d8 na cura e no dano por nível (nv5 = 6d8).",
    "m3": "Mortos-vivos e demônios sofrem o dobro do dano.",
    "m5": "Raio de 12 m.",
    "forma": "Milagre (1 hora de ritual, 50 PM, 1× por semana): ressuscita uma criatura morta há até 1 dia, com 1 PV."
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
    "ef": "Passiva: você não sofre dano de queda e pode planar (desce 1,5 m a cada 9 m que avança). Ativa (Ação Principal, 3 PM, à vontade): ataque de poder à distância (INT) contra 1 alvo a até 18 m; dano 2d8 + mod INT + metade do Nível, e o alvo é empurrado 3 m.",
    "esc": "+1d8 por nível (nv5 = 6d8).",
    "m3": "Você voa com o dobro do seu Deslocamento.",
    "m5": "Ataques à distância com projéteis contra você sofrem −4.",
    "forma": "Furacão (Ação Especial, 25 PM, 1× por combate): tornado de raio 9 m a até 36 m, por 3 rodadas. No início de cada turno seu, cada criatura dentro faz Resistência (FOR) contra sua CD (INT): falha, 8d8 e é arremessada 9 m em direção à sua escolha; sucesso, metade e fica no lugar."
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
    "ef": "Ativa (Ação Livre, 2 PM, 1× por rodada): crie na sua mão qualquer arma ou escudo da tabela, Comum, do seu Rank de personagem. Ela some se sair da sua mão por mais de 1 rodada ou no fim da cena. Máximo de 1 arma criada por vez.",
    "esc": "A arma criada ganha +1 de Refino por nível (nv5 = +4).",
    "m3": "A arma criada ganha 1 afixo à sua escolha da tabela do tipo dela.",
    "m5": "Você pode manter até 3 armas criadas e, como Ação Principal, arremessá-las: 1 ataque à distância (30 m) por arma, com o atributo de cada uma.",
    "forma": "Arsenal Infinito (Ação Especial, 25 PM, 1× por combate): 20 armas caem sobre um raio de 9 m a até 36 m. Uma rolagem de ataque (FOR ou AGI, o maior) contra a Reação de cada criatura na área; dano 8d10 + mod + metade do Nível; Reação bem-sucedida sofre metade."
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
    "ef": "Passiva: 1× por rodada, depois de rolar uma Reação, role-a de novo e fique com o novo resultado.",
    "esc": "+1 rerrolagem de Reação por combate por nível, que pode ser usada além da de cada rodada (nv5 = +4 por combate).",
    "m3": "Você nunca fica Surpreso, e o Mestre lhe diz a ordem de Iniciativa dos inimigos antes de você agir.",
    "m5": "1× por rodada, depois de rolar um ataque, role-o de novo e fique com o novo resultado.",
    "forma": "Mil Futuros (Ação Livre, 0 PM, 1× por dia): desfaça a última rodada inteira: tudo volta ao estado do início dela (PV, PM, posições, condições), e só você se lembra do que aconteceu."
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
    "ef": "Passiva: você pode pagar qualquer custo de PM com PV, na proporção de 1 PV por PM, sem ficar Exausto (não pode se levar a 0 PV ou menos assim). Ativa (Ação Principal, 3 PM, à vontade): ataque de poder à distância (INT) contra 1 alvo a até 9 m; dano 2d10 + mod INT + metade do Nível, e o alvo fica Sangrando (perde 2 PV no início de cada turno dele, até ser curado ou tratado com Medicina CD 15).",
    "esc": "+1d10 por nível (nv5 = 6d10).",
    "m3": "Você recupera PV iguais à metade do dano causado pela ativa.",
    "m5": "Inimigos Sangrando por você não recuperam PV por nenhum meio.",
    "forma": "Maré Carmesim (Ação Principal, 20 PM, 1× por combate): 1 inimigo Sangrando a até 18 m faz Resistência (VIT) contra sua CD (INT). Falha: no próximo turno dele, você decide tudo o que ele faz (não pode fazê-lo se matar)."
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
    "ef": "Passiva: RD 3 contra todo dano. Ativa (Ação Principal, 6 PM, à vontade): sopro em cone de 9 m. Uma rolagem de ataque de poder (VIT) contra a Reação de cada criatura no cone; dano 4d10 + mod VIT + metade do Nível de fogo negro; Reação bem-sucedida sofre metade.",
    "esc": "+2d10 no sopro por nível (nv5 = 12d10).",
    "m3": "Asas: você voa com o dobro do seu Deslocamento.",
    "m5": "O fogo negro ignora imunidade e RD contra fogo.",
    "forma": "Forma Dracônica (Ação Especial, 30 PM, 1× por dia): por 1 minuto, você vira um dragão Enorme e usa os valores de um Chefe do seu nível (PV, ataque, Reação, dano, ações e RD da tabela de ameaças), mais o seu sopro. Ao terminar, volta com os PV que tinha antes da transformação, menos o dano que o dragão sofreu acima dos PV dele."
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
    "ef": "Passiva: recupere 3 PV no início de cada turno seu, em combate e fora dele, inclusive No Limite. Você só morre ao chegar a −2 × seus PV máximos (em vez de −1 ×).",
    "esc": "+3 PV por turno por nível (nv5 = 15).",
    "m3": "Estar No Limite não reduz suas Ações Principais.",
    "m5": "Você só pode morrer por morte instantânea (desintegração, decapitação ou efeito que diga explicitamente que mata).",
    "forma": "Eterno (automática): se você morrer, renasce 1 hora depois com todos os PV, a menos que o corpo tenha sido totalmente destruído."
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
    "ef": "Ativa (Ação Principal, 5 PM, máximo de 1 enxame ativo): invoque 1 enxame num ponto a até 9 m, por 1 minuto ou até chegar a 0 PV. Ele é um Soldado de nível igual ao seu que ocupa um quadrado de 3 m; criaturas podem atravessá-lo. Cada Ação Principal do enxame é 1 rolagem de ataque contra cada inimigo dentro do quadrado dele, com o dano de um Soldado. Segue a regra de Invocações.",
    "esc": "+1 enxame ativo no máximo por nível (nv5 = 5).",
    "m3": "Você vê e ouve através de todos os seus enxames, sem ação.",
    "m5": "Seus enxames passam a ser Elites.",
    "forma": "Colmeia (Ação Especial, 20 PM, 1× por combate): 1 enxame seu vira uma Rainha por 1 minuto: um Chefe do seu nível (tabela de ameaças), que segue a regra de Invocações."
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
    "ef": "Erguer Sombra (Ação Especial, 5 PM): até 1 minuto depois da morte de uma criatura a até 9 m, role 1d20 + Nível + mod PRE contra CD 10 + nível da criatura. Sucesso: ela vira sua Sombra leal, com o mesmo nível e a mesma categoria (Lacaio, Soldado ou Elite), e fica guardada na sua sombra. Até 3 tentativas por corpo; depois, ele se desfaz. Sombras guardadas: no máximo 2 + mod PRE (mínimo 2). Invocar uma Sombra guardada: Ação de Movimento, 2 PM por Rank dela (E 2, D 4, C 6, B 8, A 10, S 12), aparecendo adjacente a você. Sombras invocadas ao mesmo tempo: no máximo o nível do Despertar + 1. Sombras seguem a regra de Invocações; uma Sombra que chega a 0 PV volta para a sua sombra e só pode ser invocada de novo depois de um descanso curto.",
    "esc": "+2 Sombras guardadas no máximo e +1 no nível de todas as Sombras por nível do Despertar.",
    "m3": "Ação de Movimento, 0 PM: troque de lugar com uma Sombra invocada a até 60 m.",
    "m5": "Você pode erguer Chefes (a CD recebe +5); um Chefe erguido vira uma Sombra Elite.",
    "forma": "Monarca da Noite (passiva): invocar Sombras custa 0 PM, e todas as Sombras sobem 1 categoria (Lacaio → Soldado → Elite → Chefe)."
  }
];

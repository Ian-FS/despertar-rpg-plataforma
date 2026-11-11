/* Gerado por scripts/importar-data-js.mjs a partir do data.js do site original.
   Pode ser editado à mão; se reimportar, revise o diff. */
import type { Titulo } from '../tipos';

export const TITULOS: Titulo[] = [
  {
    "id": "t01",
    "n": "Sobrevivente",
    "cond": "Chegar a 0 PV ou menos e sair vivo do Portal.",
    "txt": "+2 em Resistências de VIT.",
    "ef": {
      "res.VIT": 2
    }
  },
  {
    "id": "t02",
    "n": "Primeiro a Entrar",
    "cond": "Ser o primeiro a atravessar 10 Portais.",
    "txt": "+2 em Iniciativa.",
    "ef": {
      "ini": 2
    }
  },
  {
    "id": "t03",
    "n": "Muralha",
    "cond": "Defender com sucesso 20 ataques em uma única aventura.",
    "txt": "+1 em Defender.",
    "ef": {
      "def": 1
    }
  },
  {
    "id": "t04",
    "n": "Sombra Silenciosa",
    "cond": "Concluir um Portal inteiro sem ser detectado por nenhum monstro.",
    "txt": "+3 em Furtividade.",
    "ef": {
      "per.Furtividade": 3
    }
  },
  {
    "id": "t05",
    "n": "Destruidor de Chefes",
    "cond": "Desferir o golpe final em 5 Chefes.",
    "txt": "+1 em todos os ataques.",
    "ef": {
      "atk": 1
    }
  },
  {
    "id": "t06",
    "n": "Salvador",
    "cond": "Salvar civis durante uma Ruptura de Masmorra.",
    "txt": "+3 em Persuasão.",
    "ef": {
      "per.Persuasão": 3
    }
  },
  {
    "id": "t07",
    "n": "Incansável",
    "cond": "Cumprir 30 Missões Diárias seguidas.",
    "txt": "+10 PV máximos.",
    "ef": {
      "pv": 10
    }
  },
  {
    "id": "t08",
    "n": "Erudito da Mana",
    "cond": "Usar Análise ou Conhecimento em 20 tipos de criatura diferentes.",
    "txt": "+10 PM máximos.",
    "ef": {
      "pm": 10
    }
  },
  {
    "id": "t09",
    "n": "Conquistador do Portal Vermelho",
    "cond": "Sair vivo de um Portal Vermelho.",
    "txt": "+1 em todas as Resistências.",
    "ef": {
      "res": 1
    }
  },
  {
    "id": "t10",
    "n": "Matador de Gigantes",
    "cond": "Derrotar uma criatura 5 ou mais níveis acima do seu.",
    "txt": "+2 de dano em todos os ataques.",
    "ef": {
      "dano": 2
    }
  },
  {
    "id": "t11",
    "n": "Lâmina Veloz",
    "cond": "Derrotar 3 inimigos em uma única rodada.",
    "txt": "+1,5 m de Deslocamento.",
    "ef": {
      "desl": 1.5
    }
  },
  {
    "id": "t12",
    "n": "Olhos do Caçador",
    "cond": "Encontrar 5 passagens ou tesouros secretos em Portais.",
    "txt": "+3 em Percepção.",
    "ef": {
      "per.Percepção": 3
    }
  }
];

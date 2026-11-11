# Divergências entre o site original e o livro

Comparação feita em 2026-11-11 entre o `js/data.js` + `js/app.js` do site original e o `regras.md`.
Para refazer a comparação de textos: `node scripts/comparar-regras.mjs <caminho/para/data.js>`.

## Textos e tabelas: sem divergência

- Todos os textos de habilidades (80), Despertares (32), títulos, afixos, Selos, consumíveis, condições, tipos de Portal e bestiário aparecem iguais no livro. Os 7 trechos que o script não acha são defeitos da extração do PDF, que intercalou duas colunas (Atordoado, Cego, Derrubado, Envenenado, Ruptura Iminente, Instância do Sistema, Goblins). Conferidos à mão: o texto é o mesmo.
- Os números do bestiário batem com a fórmula de ameaças por nível.
- Conferidas à mão e iguais: Ranks (nível, atributo, custo em PH, BR, requisito de item, preço), raridades de item, Rank e tipo de Portal, armas, armaduras, encontros.

## Cálculo da ficha: decisões pendentes

O motor portado (`src/regras/ficha.ts`) faz exatamente o que o site original faz. Os pontos abaixo são regras do livro que o site **não** aplica automaticamente. Nenhum foi alterado ainda.

| # | Regra no livro | O que o site faz hoje | Proposta |
|---|---|---|---|
| 1 | **Punhos de Ferro**: o ataque desarmado "conta como arma do seu Rank (recebe o Bônus de Rank)". | Muda o dado do desarmado, mas não soma o BR. | Somar o BR do Rank do personagem pelo nível (+BR no ataque, +2×BR no dano). Exemplo: nível 10 (Rank C, BR 2) dá +2 ataque e +4 dano. |
| 2 | **Arqueiro Nato**: "+1d4 de dano à distância", +1d4 nos níveis 3 e 5. | Soma só o +1 no ataque. | Somar os d4 extras no dano dos ataques à distância. |
| 3 | **Pele Resistente**: RD só contra dano físico até o nível 3. | Soma na RD geral. | Manter a soma, mas mostrar "(físico)" ao lado até o nível 3. |
| 4 | **Olho de Falcão**: "+2 em Percepção visual". | Soma em toda a Percepção. | Manter e mostrar a observação "visual" na perícia. |
| 5 | **Domínio de Armas** nv3/nv5, **Letal**, **Arqueiro Nato** nv5 etc.: margem de crítico 19–20 ou 18–20. | Não mostra a margem de crítico. | Calcular e mostrar a margem de crítico em cada ataque, e a rolagem marcar o crítico sozinha. |

Responda cada item com "sim", "não" ou outra ideia; o que for decidido vira código com teste.

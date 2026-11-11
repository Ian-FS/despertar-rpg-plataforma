# Divergências entre o site original e o livro

Comparação feita em 2026-11-11 entre o `js/data.js` + `js/app.js` do site original e o `regras.md`.
Para refazer a comparação de textos: `node scripts/comparar-regras.mjs <caminho/para/data.js>`.

## Textos e tabelas: sem divergência

- Todos os textos de habilidades (80), Despertares (32), títulos, afixos, Selos, consumíveis, condições, tipos de Portal e bestiário aparecem iguais no livro. Os 7 trechos que o script não acha são defeitos da extração do PDF, que intercalou duas colunas (Atordoado, Cego, Derrubado, Envenenado, Ruptura Iminente, Instância do Sistema, Goblins). Conferidos à mão: o texto é o mesmo.
- Os números do bestiário batem com a fórmula de ameaças por nível.
- Conferidas à mão e iguais: Ranks (nível, atributo, custo em PH, BR, requisito de item, preço), raridades de item, Rank e tipo de Portal, armas, armaduras, encontros.

## Cálculo da ficha: decidido em 2026-11-11

Regras do livro que o site original **não** aplicava automaticamente. Todas as propostas abaixo foram aprovadas e implementadas em `src/regras/ficha.ts`, com testes em `src/regras/ficha.test.ts`.

Interpretações adotadas na margem de crítico:
- "Margem 19–20" (Domínio de Armas nv3, Katana com Refino +5, Arqueiro Nato nv5) define o ponto de partida; vale a melhor delas.
- "Margem +1" (Letal, Ponto Vital) amplia a partir desse ponto e soma entre si. Ex.: Domínio nv3 + Letal = 18–20.
- Domínio de Armas vale só para armas corpo a corpo (não para o desarmado). Ponto Vital vale para todos os ataques, inclusive o desarmado.
- Margens que dependem da cena (Olhos de Caçador e Ponto Fraco contra alvos analisados) não entram no cálculo fixo; serão tratadas no combate.

| # | Regra no livro | O que o site faz hoje | Proposta |
|---|---|---|---|
| 1 | **Punhos de Ferro**: o ataque desarmado "conta como arma do seu Rank (recebe o Bônus de Rank)". | Muda o dado do desarmado, mas não soma o BR. | Somar o BR do Rank do personagem pelo nível (+BR no ataque, +2×BR no dano). Exemplo: nível 10 (Rank C, BR 2) dá +2 ataque e +4 dano. |
| 2 | **Arqueiro Nato**: "+1d4 de dano à distância", +1d4 nos níveis 3 e 5. | Soma só o +1 no ataque. | Somar os d4 extras no dano dos ataques à distância. |
| 3 | **Pele Resistente**: RD só contra dano físico até o nível 3. | Soma na RD geral. | Manter a soma, mas mostrar "(físico)" ao lado até o nível 3. |
| 4 | **Olho de Falcão**: "+2 em Percepção visual". | Soma em toda a Percepção. | Manter e mostrar a observação "visual" na perícia. |
| 5 | **Domínio de Armas** nv3/nv5, **Letal**, **Arqueiro Nato** nv5 etc.: margem de crítico 19–20 ou 18–20. | Não mostra a margem de crítico. | Calcular e mostrar a margem de crítico em cada ataque, e a rolagem marcar o crítico sozinha. |

Na ficha calculada: `rdFisico` traz a RD só contra físico, `perVisual` a Percepção para visão e `critico` em cada ataque o menor d20 natural que é crítico.

Os itens 1, 2 e 5 também afetam o site original; vale avisar o autor.

## Poderes: rolagens e CD (decidido em 2026-11-11)

Ao usar uma habilidade ativa ou um poder do Despertar, o servidor rola ataque, dano ou cura e mostra a CD da Resistência do alvo. A tabela está em `src/regras/poderes.ts`. Interpretações adotadas:

- **CD** = 10 + Nível + mod do atributo-chave (+ bônus do próprio poder, como "+1 de CD por nível"). Em "FOR/AGI", vale o atributo de maior modificador.
- **Atributo-chave do Despertar**: o livro não define. Usamos o atributo citado no texto do poder (Chama Interior: INT; Toque Restaurador e Presença Opressora: PRE). Nos outros casos, vale o da primeira árvore afim (ex.: Toque Gélido → Elementos → INT).
- **Dano**: segue o texto de cada poder. Só soma mod e metade do Nível quando o texto diz (ex.: Projétil Elemental "1d10 + mod INT + metade do nível"). Poderes que somam dados ao ataque com arma ("+1d6 de dano") somam ao dano normal da arma.
- **Poderes ofensivos do Despertar sem "Resistência"** no texto (Raio, Lâmina de vento, Lâmina de sangue, Sopro, Projétil de fogo) usam ataque de poder: 1d20 + Nível + mod do atributo-chave.
- **Crítico**: todos os dados rolam duas vezes, inclusive os do poder; os modificadores não dobram.
- Ataque e dano são rolados juntos; quem decide se acertou (Reação do alvo) é o Mestre. Danos por turno (veneno, regeneração, zona) aparecem como fórmula ou rolagem do 1º turno.

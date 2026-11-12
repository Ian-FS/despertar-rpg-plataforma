# Plano — Plataforma DESPERTAR

Mesa virtual para o RPG **DESPERTAR** (d20, inspirado em Solo Leveling, obra de fã sem fins lucrativos).
Visão do produto pronto (protótipo visual): https://claude.ai/artifact/U8JKBFKvQx6YtsXSuVw2nD

---

## 1. Objetivo e decisões fechadas

Uma plataforma web, usada no PC e no celular, onde o grupo:

- cria e mantém as fichas com as contas das regras feitas automaticamente;
- rola dados que todos veem em tempo real;
- conduz combates (passadas, Pressão, Reação, dano − RD) e um mapa tático;
- tem um Mestre que vê e edita todas as fichas, gera Portais, ameaças e saques, distribui XP e Ouro e envia notificações do Sistema.

| Decisão | Escolha |
|---|---|
| Público | Só o nosso grupo, por enquanto |
| Custo | Zero; pequenos gastos aceitáveis se necessário |
| Dispositivos | PC e celular (layout responsivo desde o início) |
| Login | Google |
| Voz e vídeo | **Discord**. A plataforma envia as rolagens a um canal por webhook. Activity do Discord fica como extra futuro. |
| Combate | **Conduzido pela plataforma, confirmado pelo Mestre**: o atacante rola, o alvo escolhe Defender ou Esquivar, a plataforma compara e calcula o dano; o dano entra na ficha do alvo quando o Mestre clica em **Aplicar**. O Mestre pode corrigir qualquer número. |
| Visibilidade das fichas | Jogador vê a própria ficha completa; das outras, só nome, nível, PV, PM e condições. O Mestre vê e edita tudo. |
| Fonte das regras | `js/data.js` e `js/app.js` do site do Maickon (<https://github.com/maickon/-SISTEMA-DESPERTAR>), com permissão. O `regras.md` serve para conferência. |

---

## 2. Tecnologias

| Parte | Ferramenta | Plano grátis |
|---|---|---|
| Aplicação web | **Next.js** (App Router) + **TypeScript** | — |
| Estilo | **Tailwind CSS** + componentes próprios no visual "janela do Sistema" | — |
| Login, banco, tempo real, arquivos | **Supabase** (Auth com Google, Postgres, Realtime, Storage) | 500 MB de banco, 1 GB de arquivos. Projetos grátis pausam após ~7 dias sem uso; basta reativar no painel. |
| Hospedagem | **Vercel**, ligada ao GitHub (cada push na `main` publica) | Plano Hobby |
| Testes | **Vitest** para o motor de regras; **Playwright** para alguns fluxos principais | — |
| Mapa | **Konva** (canvas) via `react-konva` | — |
| Discord | Webhook de canal (só envia mensagens) | — |

---

## 3. Arquitetura

```
Navegador (PC/celular)
   │  páginas e ações
   ▼
Next.js na Vercel ───── webhook ─────▶ Discord #rolagens
   │  (rotas de servidor: rolar dados, conceder XP, etc.)
   ▼
Supabase
   ├─ Auth (Google)
   ├─ Postgres + RLS (quem pode ler/escrever o quê)
   ├─ Realtime (rolagens, chat, combate e tokens chegam a todos)
   └─ Storage (imagens de mapas e retratos)
```

### Princípios

0. **A plataforma calcula e mostra; o Mestre decide** (combinado em 12/11/2026). Automático só o que mexe na própria ficha: contas, custos de PM, rolagens, CD, duração de efeitos, passivas e descansos. Entre personagens (dano no alvo, efeitos em aliados, área) a plataforma calcula e oferece um botão "aplicar em…" que o Mestre confirma; nada muda sozinho na ficha de outra pessoa. O Mestre sempre pode editar qualquer valor na mão. Regras novas só são automatizadas se fizerem falta jogando.

1. **O motor de regras é TypeScript puro**, em `src/regras/`, sem React e sem banco. A ficha, o combate e o painel do Mestre usam as mesmas funções. Tudo coberto por testes, começando pelos exemplos do livro (Rafa, Jin contra o Orc).
2. **O banco guarda as escolhas, não os resultados.** A ficha salva atributos sorteados, nível, habilidades, perícias e itens. PV máximo, Defender, CD e o resto são recalculados pelo motor. Assim uma correção numa regra vale para todas as fichas na hora.
3. **Dados rolados no servidor.** A rolagem é feita numa rota de servidor, gravada na tabela `rolagens` e distribuída pelo Realtime. Ninguém consegue "rolar 20" pelo console do navegador, e o histórico fica salvo. O webhook do Discord também é chamado do servidor, para a URL não vazar.
4. **Permissões no banco (RLS).** Mesmo que alguém mexa no navegador, o Postgres só deixa o jogador alterar a própria ficha e só deixa o Mestre ver as notas secretas.

### Estrutura de pastas

```
src/
  app/                 páginas (Next.js App Router)
    (auth)/            login
    mesas/             lista de mesas, convite
    mesas/[id]/        ficha, árvores, mesa ao vivo, combate, mapa, mestre
    api/               rotas de servidor (rolar, discord, mestre)
  regras/              motor de regras puro (TS) + testes
    dados/             dados portados do data.js (habilidades, despertares, itens…)
    ficha.ts           cálculo da ficha (porte do computar())
    dados-rolagem.ts   parser e rolagem de fórmulas (2d8+5)
    combate.ts         passadas, Pressão, ataque × Reação, dano
    progressao.ts      subir de nível, Rank, Avaliação do Sistema
    geradores.ts       Portal, ameaças, saque
  componentes/         UI reutilizável
  lib/supabase/        clientes do Supabase (navegador e servidor)
supabase/
  migrations/          tabelas, RLS e funções em SQL versionado
docs/
  PLANO.md             este arquivo
regras.md              livro de regras (texto extraído do PDF)
```

### Tabelas principais (Postgres)

| Tabela | Conteúdo |
|---|---|
| `perfis` | usuário (nome, avatar), ligado ao login Google |
| `mesas` | campanha: nome, código de convite, webhook do Discord |
| `membros` | quem está em cada mesa e o papel (`mestre` ou `jogador`) |
| `fichas` | personagem: dono, mesa, tipo (`jogador`/`npc`), `dados` (JSON com as escolhas), PV e PM atuais, condições |
| `rolagens` | histórico: quem, rótulo, fórmula, resultados, total, secreta |
| `mensagens` | chat da mesa |
| `combates` | combate ativo: rodada, passada, de quem é a vez |
| `combatentes` | participantes: ficha ou ameaça, iniciativa, ações, Pressão, PV |
| `ameacas` | bestiário da mesa (gerado pela tabela de níveis ou feito à mão) |
| `mapas` / `tokens` | imagem, grade, névoa, posição dos tokens |
| `notificacoes` | mensagens do Sistema enviadas pelo Mestre |
| `notas` | anotações (do Mestre ou de cada jogador), com visibilidade |

---

## 4. Fases

Cada fase termina com algo que o grupo já usa. Trabalho em branches, uma por tarefa, com merge na `main`.

### Fase 0 — Fundação
- [x] Projeto Next.js + TypeScript + Tailwind + Vitest; lint
- [x] Portar `data.js` para `src/regras/dados/` em TypeScript tipado
- [x] Portar `computar()` e funções auxiliares (requisitos, custo de PH, afinidade, `EFEITOS_HAB`, `EFEITOS_DESP`)
- [x] Testes: exemplo da Rafa (PV 12, PM 11, Desloc. 11 m, Esquivar +6, Ataque +6), mods, custos de PH, requisitos
- [x] Conferir `data.js` contra `regras.md` e listar divergências para você decidir ([divergencias.md](divergencias.md))
- [x] Decidir as divergências de cálculo e implementar
- [x] Projeto Supabase, login com Google, tabelas `perfis`, `mesas`, `membros` com RLS
- [x] Criar mesa, gerar link de convite, entrar na mesa
- [x] Deploy na Vercel (https://despertar-rpg-plataforma.vercel.app)

**Pronto quando:** cada um entra com o Google e vê a mesa do grupo no endereço da Vercel.

### Fase 1 — Ficha
- [x] Criação guiada nos 8 passos: Potencial e Atributos (sorteio), Despertar (d100, com Escolha Guiada opcional), Avaliação do Sistema, PH, Perícias, derivados, equipamento inicial
- [x] Ficha com todos os valores calculados; clicar num valor rola o dado
- [x] Árvores: mapa das 10 árvores, comprar e evoluir habilidades respeitando requisitos e afinidade
- [x] Subir de nível guiado (2 de Status e 1d6 de PH com Bênção do Sistema, perícias, PV e PM; novo Rank a cada 5 níveis)
- [x] Equipamento: Rank, Refino, afixos, Selos e Sincronia; inventário de 20 espaços; Ouro; Títulos
- [x] PV/PM atuais, condições, descansos curto e longo
- [ ] Layout testado no celular
- [x] Sorteios no servidor com registro; Mestre libera novo sorteio
- [x] Regras opcionais por mesa (Método Padrão, Escolha Guiada, Marcos, Provação)
- [x] Várias fichas por jogador, uma ativa; resumo do grupo para todos

**Pronto quando:** o grupo cria os personagens na plataforma e joga uma sessão usando a ficha.

### Fase 2 — Mesa ao vivo
- [x] Rolagem no servidor, histórico em tempo real, rolagem secreta do Mestre
- [x] Campo de fórmula no registro da mesa (bandeja de dados visual fica para depois, se fizer falta)
- [x] Ficha atualiza sozinha nas outras telas, com aviso do que o Mestre mudou
- [ ] Chat da mesa
- [ ] Webhook do Discord (rolagens públicas vão para o canal)
- [x] Painel do grupo (PV, PM, condições de todos), ao vivo
- [x] Rastreador de combate: iniciativa, passadas, Pressão, turnos, Surpreso; o Início do turno das fichas dispara sozinho (inimigos rápidos com PV no próprio rastreador; NPC com ficha fica para a Fase 3)
- [ ] Ataque × Reação conduzido (Defender/Esquivar, crítico, área = metade, Defesa Passiva e Defesa Fixa de Lacaios); o dano no alvo entra com a confirmação do Mestre
- Sobras de regras (em [divergencias.md](divergencias.md): "1× por rodada", gatilhos de acerto e derrota, PV temporários, efeitos em aliados) só entram se fizerem falta em sessão; até lá o Mestre resolve na mão

**Pronto quando:** uma sessão inteira, combate incluído, roda pela plataforma.

### Fase 3 — Ferramentas do Mestre
- [ ] Painel do Mestre: ver e editar todas as fichas, criar NPCs
- [ ] Gerador de ameaças pela tabela de níveis 1–30 e bestiário da mesa
- [ ] Gerador de Portal e gerador de saque (raridade, afixos, Selos)
- [ ] Concluir Portal: XP (com multiplicadores), Ouro e itens para o grupo
- [ ] Notificações do Sistema na tela dos jogadores (missões diárias, de emergência, ocultas)
- [ ] Notas da campanha (secretas e compartilhadas)

**Pronto quando:** o Mestre prepara e conduz um Portal só pela plataforma.

### Fase 4 — Mapa tático
- [ ] Upload da imagem do mapa e grade de 1,5 m ajustável
- [ ] Tokens de jogadores e inimigos, ligados ao combate
- [ ] Movimento em tempo real; cada jogador move o próprio token
- [ ] Névoa de guerra controlada pelo Mestre
- [ ] Régua de distância e alcance de deslocamento (área: o mapa mostra o raio, o Mestre escolhe os alvos)

**Pronto quando:** um combate tático acontece no mapa.

### Fase 5 — Extras (sob demanda)
- Activity do Discord (plataforma dentro da chamada)
- Loja do Sistema dentro da plataforma
- Retratos de personagens e NPCs, imagens para mostrar aos jogadores
- Trilha sonora ambiente
- Diário da campanha

---

## 5. O que preciso de você (quando chegarmos lá)

| Quando | O quê | Eu te guio passo a passo |
|---|---|---|
| Fase 0 | Criar conta e projeto no **Supabase** e me passar a URL do projeto e a chave `anon` (a `service_role` fica só no `.env.local` e na Vercel, nunca no repositório) | sim |
| Fase 0 | Criar credencial **OAuth do Google** no Google Cloud Console (ID e segredo do cliente) e colar no Supabase | sim |
| Fase 0 | Conectar este repositório à **Vercel** e cadastrar as variáveis de ambiente | sim |
| Fase 2 | Criar um **webhook** no canal do Discord do grupo | sim |
| Sempre | Testar com o grupo e decidir divergências de regra | — |

---

## 6. Riscos e cuidados

- **`data.js` e `regras.md` podem divergir.** O `data.js` é a base; cada divergência vira uma pergunta para você antes de virar código.
- **Regras com julgamento do Mestre** (ex.: o Golpe Furtivo vale nesta cena?) não são automatizadas: a plataforma sugere e o Mestre confirma ou corrige.
- **Supabase grátis pausa por inatividade.** Se o grupo ficar mais de uma semana sem jogar, é preciso reativar o projeto no painel (um clique).
- **Obra de fã.** Sem arte oficial de Solo Leveling e sem fins lucrativos.
- **Segredos.** Chaves e webhooks ficam em `.env.local` (ignorado pelo git) e nas variáveis da Vercel.

---

## 7. Convenções

- Nomes do domínio em português, iguais aos das regras (`ficha`, `pericia`, `despertar`, `pressao`); termos técnicos em inglês quando forem do framework.
- Commits pequenos e descritivos; uma branch por tarefa (`fase0/porte-dados`, `fase1/criacao-ficha`…).
- Toda regra nova no motor vem com teste.

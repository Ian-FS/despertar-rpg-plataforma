# DESPERTAR — Plataforma de mesa

Mesa virtual para o RPG de mesa **DESPERTAR** (d20, sem classes, inspirado em Solo Leveling): fichas com cálculo automático, dados em tempo real, combate conduzido, mapa tático e painel do Mestre. Voz e vídeo pelo Discord.

- Plano e decisões: [docs/PLANO.md](docs/PLANO.md)
- Livro de regras (texto): [regras.md](regras.md)
- Site de regras original (Maickon): <https://maickon.github.io/-SISTEMA-DESPERTAR/>

## Desenvolvimento

Precisa de Node.js 20 ou mais novo.

```bash
npm install        # instala as dependências
npm run dev        # abre em http://localhost:3000
npm test           # testes do motor de regras
npm run typecheck  # checagem de tipos
npm run lint       # lint
```

### Onde fica cada coisa

- `src/regras/` — motor de regras em TypeScript puro (sem React, sem banco), com testes `*.test.ts`
  - `dados/` — habilidades, Despertares, itens, Portais etc., gerados do `data.js` do site original
  - `ficha.ts` — cálculo da ficha, PH e requisitos
  - `rolagem.ts` — fórmulas de dados (`2d8+5`)
  - `ameacas.ts` — estatísticas de monstros por nível
- `src/app/` — páginas (Next.js)
- `scripts/` — importar o `data.js` original e comparar com o `regras.md`
- `docs/` — plano e divergências de regras

Obra de fã, sem fins lucrativos. Solo Leveling pertence a Chugong / DUBU / Redice Studio.

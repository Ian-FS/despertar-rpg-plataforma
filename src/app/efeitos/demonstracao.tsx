'use client';

import { useState } from 'react';
import { TelaCarregando, Carregando } from '@/componentes/efeitos/carregando';
import { ControlesEfeitos } from '@/componentes/efeitos/controles';
import { ProvedorEfeitos, useEfeitos } from '@/componentes/efeitos/provedor';
import { Rolador, useRolar } from '@/componentes/rolador';
import { potencialDoD6 } from '@/regras/criacao';

export function Demonstracao() {
  return (
    <ProvedorEfeitos>
      <Rolador>
        <Botoes />
      </Rolador>
    </ProvedorEfeitos>
  );
}

function Botoes() {
  const efeitos = useEfeitos();
  const rolar = useRolar();
  const [carregando, setCarregando] = useState(false);
  const [pv, setPv] = useState(30);

  const grupo = (titulo: string, children: React.ReactNode) => (
    <section className="caixa flex flex-col gap-3 p-4">
      <h2 className="rotulo">{titulo}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ControlesEfeitos />
      </div>

      {grupo(
        'Criação',
        <>
          <button
            className="botao"
            onClick={() =>
              efeitos.abrir({
                tipo: 'atributos',
                dados: {
                  d6: 3,
                  potencial: potencialDoD6(3),
                  rolagens: { FOR: [3, 4], AGI: [5, 5], VIT: [2, 4], INT: [1, 4], PER: [4, 5], PRE: [2, 2] },
                  atr: { FOR: 15, AGI: 18, VIT: 14, INT: 13, PER: 17, PRE: 12 },
                },
              })
            }
          >
            🎲 Atributos
          </button>
          <button className="botao" onClick={() => efeitos.abrir({ tipo: 'despertar', d100: [33], opcoes: ['d09'] })}>
            ✦ Despertar Comum
          </button>
          <button className="botao" onClick={() => efeitos.abrir({ tipo: 'despertar', d100: [85], opcoes: ['d23'] })}>
            ✦ Despertar Épico
          </button>
          <button className="botao" onClick={() => efeitos.abrir({ tipo: 'despertar', d100: [97, 41], opcoes: ['d29', 'd11'] })}>
            ✦ Escolha Guiada (Lendário)
          </button>
          <button className="botao" onClick={() => efeitos.abrir({ tipo: 'despertar', d100: [100], opcoes: ['d32'] })}>
            ✦ Anomalia
          </button>
        </>,
      )}

      {grupo(
        'Progressão',
        <>
          <button
            className="botao"
            onClick={() =>
              efeitos.abrir({
                tipo: 'nivel',
                dados: {
                  nivelAntes: 4,
                  nivelDepois: 5,
                  status: { rolagens: [4], valor: 4 },
                  ph: { rolagens: [1, 3], valor: 3 },
                  novoRank: 'D',
                  pv: [34, 41],
                  pm: [22, 27],
                  acoes: [1, 2],
                },
              })
            }
          >
            ▲ Subir de nível
          </button>
          <button
            className="botao"
            onClick={() => efeitos.abrir({ tipo: 'notificacao', cabecalho: '[ SISTEMA ]', titulo: 'Habilidade adquirida.', linhas: ['Golpe Furtivo · Rank E · nível 1'] })}
          >
            Habilidade adquirida
          </button>
          <button className="botao" onClick={() => (efeitos.som('raro'), efeitos.aviso('[ SISTEMA ] Golpe Furtivo subiu para o nível 5', 'ouro'))}>
            Aviso rápido
          </button>
          <button
            className="botao"
            onClick={() =>
              efeitos.abrir({
                tipo: 'notificacao',
                cabecalho: '[ MISSÃO DE EMERGÊNCIA ]',
                titulo: 'Elimine o Orc Berserker em 3 rodadas.',
                linhas: ['Recompensa: +1 Ponto de Status', 'Falha: o Portal se fecha mais rápido'],
                tom: 'perigo',
              })
            }
          >
            Missão de emergência
          </button>
        </>,
      )}

      {grupo(
        'Dados e vida',
        <>
          <button className="botao" onClick={() => rolar('Ataque · Espada', '1d20+8', { margemCritico: 19 })}>
            Rolar ataque
          </button>
          <button className="botao" onClick={() => rolar('Crítico garantido (exemplo)', '1d20+8', { margemCritico: 1 })}>
            Crítico
          </button>
          <button
            className="botao botao-discreto"
            onClick={() => {
              efeitos.som('dano');
              setPv((v) => v - 11);
            }}
          >
            Sofrer 11 de dano
          </button>
          <button
            className="botao botao-discreto"
            onClick={() => {
              efeitos.som('cura');
              efeitos.aviso('[ SISTEMA ] Poção de Cura: +14 PV', 'ok');
              setPv((v) => v + 14);
            }}
          >
            Beber poção
          </button>
          <span className="font-mono text-sm text-apagado">PV de exemplo: {pv}</span>
        </>,
      )}

      {grupo(
        'Carregamento',
        <>
          <button
            className="botao"
            onClick={() => {
              setCarregando(true);
              setTimeout(() => setCarregando(false), 2000);
            }}
          >
            Tela de carregamento
          </button>
        </>,
      )}
      {carregando && <TelaCarregando texto="Registrando novo Jogador" />}
      <div className="caixa">
        <Carregando />
      </div>
    </div>
  );
}

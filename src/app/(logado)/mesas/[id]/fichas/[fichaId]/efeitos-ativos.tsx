'use client';

import { useState, useTransition } from 'react';
import { useEfeitos } from '@/componentes/efeitos/provedor';
import { useMostrarRolagem } from '@/componentes/rolador';
import { CONDICOES } from '@/regras/dados';
import { ativarEfeito, encerrarEfeito, NOME_EVENTO, resumoBonus, type Evento } from '@/regras/gatilhos';
import { normalizarFormula } from '@/regras/rolagem';
import { eventoFicha } from '../acoes';
import type { PropsAba } from './ficha-editor';

const duracao = (r: number | null) => (r === null ? 'até o fim do combate' : r === 1 ? 'até o próximo turno' : `${r} rodadas`);

/** Botões do Mestre: início do turno, fim do combate e descansos (aplicados no servidor). */
export function EventosMestre({ fichaId, aplicarMudanca }: PropsAba) {
  const efeitos = useEfeitos();
  const mostrar = useMostrarRolagem();
  const [pendente, iniciar] = useTransition();
  const disparar = (evento: Evento) =>
    iniciar(async () => {
      const r = await eventoFicha(fichaId, evento);
      if (r.erro || !r.evento) {
        efeitos.som('falha');
        efeitos.aviso(r.erro ?? 'Não foi possível aplicar.', 'perigo');
        return;
      }
      if (r.mudanca) aplicarMudanca(r.mudanca);
      for (const x of r.evento.rolagens) mostrar(x.rotulo, x.r);
      efeitos.som(evento.startsWith('descanso') ? 'cura' : 'sistema');
      efeitos.aviso(`[ ${NOME_EVENTO[evento].toUpperCase()} ] ${r.evento.linhas.join(' ') || 'Nada a aplicar.'}`, 'sys');
    });
  const botoes: { e: Evento; dica: string }[] = [
    { e: 'inicioTurno', dica: 'Passivas de início de turno (Circulação de Mana, regenerações), dano/cura por turno e duração dos efeitos' },
    { e: 'fimCombate', dica: 'Encerra os efeitos ativos e libera os usos "por combate"' },
    { e: 'descansoCurto', dica: '1 hora, até 2 por dia: 1/4 dos PV e PM (ou metade, com as habilidades certas)' },
    { e: 'descansoLongo', dica: '8 horas: tudo de volta, remove Exausto, encerra efeitos e libera usos "por dia"' },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {botoes.map(({ e, dica }) => (
        <button key={e} className="botao botao-discreto text-sm" disabled={pendente} onClick={() => disparar(e)} title={dica}>
          {NOME_EVENTO[e]}
        </button>
      ))}
    </div>
  );
}

/** Lista dos efeitos ativos; o Mestre encerra e cria efeitos (venenos, bênçãos, maldições). */
export function EfeitosAtivos({ p, alterar, souMestre }: PropsAba) {
  const [criando, setCriando] = useState(false);
  if (!p.efeitosAtivos.length && !souMestre) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="rotulo">Efeitos ativos</span>
      {!p.efeitosAtivos.length && <span className="text-xs text-apagado">Nenhum.</span>}
      <ul className="flex flex-col gap-1.5">
        {p.efeitosAtivos.map((e) => {
          const bonus = resumoBonus(e);
          return (
            <li key={e.uid} className="flex items-start gap-2 border border-linha bg-painel-2 px-2 py-1 text-xs">
              <span className="min-w-0 flex-1">
                <b className="text-ok">{e.nome}</b> <span className="text-apagado">· {duracao(e.rodadas)}</span>
                {bonus && <span className="block font-mono text-sys">{bonus}</span>}
                {e.porTurno && (
                  <span className="block text-perigo">
                    {e.porTurno.cura ? 'Cura' : 'Dano'} {e.porTurno.formula} {e.porTurno.alvo === 'pm' ? 'PM' : 'PV'} no início do turno
                  </span>
                )}
                {e.condicao && <span className="block text-apagado">Condição: {e.condicao}</span>}
                {e.aoTerminar && <span className="block text-apagado">Ao terminar: {e.aoTerminar}</span>}
                {e.nota && <span className="block text-apagado">{e.nota}</span>}
              </span>
              {souMestre && (
                <button className="text-apagado hover:text-perigo" title="Encerrar efeito" aria-label={`Encerrar ${e.nome}`} onClick={() => alterar((r) => encerrarEfeito(r, e.uid))}>
                  ✕
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {souMestre &&
        (criando ? (
          <NovoEfeito
            onCancelar={() => setCriando(false)}
            onCriar={(e) => {
              alterar((r) => void ativarEfeito(r, 'mestre', e));
              setCriando(false);
            }}
          />
        ) : (
          <button className="self-start text-xs text-sys hover:underline" onClick={() => setCriando(true)}>
            + Novo efeito (veneno, queimadura, bênção…)
          </button>
        ))}
    </div>
  );
}

function NovoEfeito({ onCriar, onCancelar }: { onCriar: (e: Parameters<typeof ativarEfeito>[2]) => void; onCancelar: () => void }) {
  const [nome, setNome] = useState('');
  const [condicao, setCondicao] = useState('');
  const [rodadas, setRodadas] = useState('3');
  const [formula, setFormula] = useState('');
  const [tipo, setTipo] = useState<'dano' | 'cura'>('dano');
  const formulaOk = !formula || !!normalizarFormula(formula);
  const nomeFinal = nome.trim() || condicao;
  const escolherCondicao = (c: string) => {
    setCondicao(c);
    if (!nome) setNome(c);
  };
  return (
    <div className="flex flex-col gap-2 border border-linha p-2 text-xs">
      <div className="flex flex-wrap gap-2">
        <label className="flex flex-col gap-1">
          Condição
          <select className="campo" value={condicao} onChange={(e) => escolherCondicao(e.target.value)}>
            <option value="">Nenhuma</option>
            {CONDICOES.map((c) => (
              <option key={c.n}>{c.n}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          Nome
          <input className="campo w-36" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Veneno da Aranha" />
        </label>
        <label className="flex flex-col gap-1">
          Duração (rodadas)
          <input className="campo w-24" value={rodadas} onChange={(e) => setRodadas(e.target.value)} placeholder="vazio = combate" />
        </label>
        <label className="flex flex-col gap-1">
          Por turno
          <span className="flex gap-1">
            <select className="campo" value={tipo} onChange={(e) => setTipo(e.target.value as 'dano' | 'cura')}>
              <option value="dano">Dano</option>
              <option value="cura">Cura</option>
            </select>
            <input className={`campo w-20 ${formulaOk ? '' : 'border-perigo'}`} value={formula} onChange={(e) => setFormula(e.target.value)} placeholder="2d4" />
          </span>
        </label>
      </div>
      <div className="flex gap-2">
        <button
          className="botao px-2 py-0.5 text-xs"
          disabled={!nomeFinal || !formulaOk}
          onClick={() =>
            onCriar({
              nome: nomeFinal,
              rodadas: rodadas.trim() ? Math.max(1, Math.trunc(Number(rodadas)) || 1) : null,
              condicao: condicao || undefined,
              porTurno: formula ? { formula: normalizarFormula(formula)!, cura: tipo === 'cura' } : undefined,
            })
          }
        >
          Aplicar
        </button>
        <button className="botao botao-discreto px-2 py-0.5 text-xs" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

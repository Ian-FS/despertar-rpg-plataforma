'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { Rolador } from '@/componentes/rolador';
import type { RegrasMesa } from '@/lib/supabase/tipos-banco';
import { computarFicha, type FichaCalculada } from '@/regras/ficha';
import type { Personagem } from '@/regras/personagem';
import { validarFicha } from '@/regras/validacao';
import { salvarFicha } from '../acoes';
import { AbaFicha } from './aba-ficha';
import { AbaHabilidades } from './aba-habilidades';
import { AbaInventario } from './aba-inventario';
import { AbaNotas } from './aba-notas';

export interface PropsAba {
  p: Personagem;
  f: FichaCalculada;
  /** altera uma cópia do personagem e salva automaticamente */
  alterar: (fn: (rascunho: Personagem) => void) => void;
  podeEditar: boolean;
  souMestre: boolean;
  regras: RegrasMesa;
  fichaId: string;
}

const ABAS = [
  { id: 'ficha', nome: 'Ficha' },
  { id: 'habilidades', nome: 'Habilidades' },
  { id: 'inventario', nome: 'Inventário' },
  { id: 'notas', nome: 'Notas' },
] as const;
type Aba = (typeof ABAS)[number]['id'];

type Estado = 'salvo' | 'pendente' | 'salvando' | 'invalido' | 'erro';

export function FichaEditor({
  fichaId,
  inicial,
  souMestre,
  regras,
  podeEditar,
}: {
  fichaId: string;
  inicial: Personagem;
  souMestre: boolean;
  regras: RegrasMesa;
  podeEditar: boolean;
}) {
  const [p, setP] = useState(inicial);
  const [salvo, setSalvo] = useState(inicial);
  const [aba, setAba] = useState<Aba>('ficha');
  const [estado, setEstado] = useState<Estado>('salvo');
  const [errosServidor, setErrosServidor] = useState<string[]>([]);
  const [, iniciar] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const f = useMemo(() => computarFicha(p), [p]);
  const erros = useMemo(() => (souMestre ? [] : validarFicha(salvo, p)), [souMestre, salvo, p]);

  const alterar = (fn: (r: Personagem) => void) => {
    if (!podeEditar) return;
    const copia: Personagem = structuredClone(p);
    fn(copia);
    setP(copia);
    setEstado('pendente');
  };

  // salvamento automático: 800 ms depois da última mudança, se não houver erro de regra
  useEffect(() => {
    if (p === salvo || erros.length) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setEstado('salvando');
      iniciar(async () => {
        const r = await salvarFicha(fichaId, p);
        if (r.erro || r.erros?.length) {
          setErrosServidor(r.erros ?? [r.erro!]);
          setEstado('erro');
        } else {
          setErrosServidor([]);
          setSalvo(p);
          setEstado('salvo');
        }
      });
    }, 800);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [p, salvo, erros, fichaId]);

  const props: PropsAba = { p, f, alterar, podeEditar, souMestre, regras, fichaId };
  const listaErros = erros.length ? erros : errosServidor;

  return (
    <Rolador>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Seções da ficha" className="flex flex-wrap gap-1">
            {ABAS.map((a) => (
              <button
                key={a.id}
                role="tab"
                aria-selected={aba === a.id}
                onClick={() => setAba(a.id)}
                className={`border px-3 py-1.5 text-sm font-semibold ${
                  aba === a.id ? 'border-sys bg-sys/10 text-sys' : 'border-transparent text-apagado hover:text-texto'
                }`}
              >
                {a.nome}
              </button>
            ))}
          </div>
          {podeEditar && <IndicadorSalvo estado={erros.length && p !== salvo ? 'invalido' : estado} />}
        </div>

        {listaErros.length > 0 && (
          <div role="alert" className="caixa border-perigo/60 p-3 text-sm">
            <p className="font-semibold text-perigo">Corrija para salvar:</p>
            <ul className="list-disc pl-5 text-perigo">
              {listaErros.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {aba === 'ficha' && <AbaFicha {...props} />}
        {aba === 'habilidades' && <AbaHabilidades {...props} />}
        {aba === 'inventario' && <AbaInventario {...props} />}
        {aba === 'notas' && <AbaNotas {...props} />}
      </div>
    </Rolador>
  );
}

function IndicadorSalvo({ estado }: { estado: Estado }) {
  const txt: Record<Estado, string> = {
    salvo: '✓ sincronizado com o Sistema',
    pendente: 'alterado…',
    salvando: 'salvando…',
    invalido: 'não salvo: corrija os erros',
    erro: 'não salvo',
  };
  const cor = estado === 'salvo' ? 'text-ok' : estado === 'invalido' || estado === 'erro' ? 'text-perigo' : 'text-apagado';
  return <span className={`font-mono text-xs ${cor}`}>{txt[estado]}</span>;
}

'use client';
/* Número que "gira" como um dado ou caça-níquel antes de parar no resultado. */
import { useEffect, useState } from 'react';
import { useAnimar } from './preferencias';

export function NumeroGirando({
  final,
  faces,
  duracao = 600,
  atraso = 0,
  className = '',
  instantaneo = false,
  onParar,
}: {
  /** mostra o resultado na hora (usuário pulou a animação) */
  instantaneo?: boolean;
  final: number;
  /** maior valor possível durante o giro (ex.: 6, 20, 100) */
  faces: number;
  duracao?: number;
  atraso?: number;
  className?: string;
  onParar?: () => void;
}) {
  const animar = useAnimar() && !instantaneo;
  const [valor, setValor] = useState<number | null>(null);
  const [parado, setParado] = useState(false);

  useEffect(() => {
    if (!animar) {
      onParar?.();
      return;
    }
    let intervalo: ReturnType<typeof setInterval> | undefined;
    const inicio = setTimeout(() => {
      intervalo = setInterval(() => setValor(1 + Math.floor(Math.random() * faces)), 55);
    }, atraso);
    const fim = setTimeout(() => {
      clearInterval(intervalo);
      setParado(true);
      onParar?.();
    }, atraso + duracao);
    return () => {
      clearTimeout(inicio);
      clearTimeout(fim);
      clearInterval(intervalo);
    };
    // onParar muda a cada render; o giro só depende do resultado
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [final, faces, duracao, atraso, animar]);

  if (!animar || parado) return <span className={`numero-parou ${className}`}>{final}</span>;
  return <span className={`opacity-70 ${className}`}>{valor ?? '·'}</span>;
}

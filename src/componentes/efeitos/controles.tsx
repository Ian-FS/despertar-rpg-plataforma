'use client';
/* Botões da barra do topo: efeitos rápidos e som. */
import { mudarPreferencias, usePreferencias } from './preferencias';
import { tocar } from './sons';

export function ControlesEfeitos() {
  const { rapido, som } = usePreferencias();
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-pressed={rapido}
        title={rapido ? 'Efeitos rápidos ligados: animações longas são puladas' : 'Ligar efeitos rápidos (pular animações longas)'}
        onClick={() => mudarPreferencias({ rapido: !rapido })}
        className={`border px-2 py-1 text-xs ${rapido ? 'border-ouro text-ouro' : 'border-linha text-apagado hover:text-texto'}`}
      >
        ⚡<span className="sr-only">Efeitos rápidos</span>
      </button>
      <button
        type="button"
        aria-pressed={som}
        title={som ? 'Som ligado' : 'Ligar som'}
        onClick={() => {
          mudarPreferencias({ som: !som });
          if (!som) tocar('sistema');
        }}
        className={`border px-2 py-1 text-xs ${som ? 'border-sys text-sys' : 'border-linha text-apagado hover:text-texto'}`}
      >
        {som ? '🔊' : '🔇'}
        <span className="sr-only">Som</span>
      </button>
    </div>
  );
}

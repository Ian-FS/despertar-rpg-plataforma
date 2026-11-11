'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { clienteNavegador } from '@/lib/supabase/navegador';
import { destinoSeguro } from '@/lib/destino-seguro';

export function BotaoGoogle() {
  const params = useSearchParams();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(params.get('erro'));

  async function entrar() {
    setCarregando(true);
    setErro(null);
    const next = destinoSeguro(params.get('next'));
    const { error } = await clienteNavegador().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setErro('Não foi possível abrir o login do Google. Tente de novo.');
      setCarregando(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button type="button" className="botao" onClick={entrar} disabled={carregando}>
        {carregando ? 'Abrindo o Google…' : 'Entrar com Google'}
      </button>
      {erro && (
        <p role="alert" className="text-sm text-perigo">
          {erro}
        </p>
      )}
    </div>
  );
}

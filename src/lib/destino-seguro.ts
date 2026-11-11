/** Só aceita caminhos internos ("/mesas/…") como destino depois do login, para ninguém
 *  montar um link que redirecione para outro site. */
export function destinoSeguro(next: string | null | undefined, padrao = '/mesas'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return padrao;
  return next;
}

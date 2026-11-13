import { describe, expect, it } from 'vitest';
import { rolar } from '@/regras/rolagem';
import { linhaRolagem, webhookValido } from './discord-formato';

describe('Discord', () => {
  it('só aceita webhooks do Discord', () => {
    expect(webhookValido('https://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz_-0123')).toBe(true);
    expect(webhookValido('https://discordapp.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz')).toBe(true);
    expect(webhookValido('https://example.com/api/webhooks/1/x')).toBe(false);
    expect(webhookValido('http://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz')).toBe(false);
    expect(webhookValido('https://discord.com.evil.io/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz')).toBe(false);
  });

  it('formata a rolagem e marca o 20 natural', () => {
    const r = rolar('1d20+5', () => 20)!;
    expect(linhaRolagem('Ataque · Espada', r)).toBe('Ataque · Espada: **25**  `1d20[20] +5` · **20 natural!**');
    // crases e quebras de linha do rótulo (digitado pelo jogador) viram espaço
    expect(linhaRolagem('`x`\nquebra', rolar('2', () => 1)!)).toBe(' x  quebra: **2**  `2`');
  });
});

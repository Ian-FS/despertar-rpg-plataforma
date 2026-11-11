/* Sons curtos sintetizados pelo navegador (Web Audio), sem arquivos de áudio.
   Só tocam se o usuário ligou o som; o navegador exige um clique antes do primeiro som. */

export type Som = 'sistema' | 'dado' | 'nivel' | 'cura' | 'dano' | 'critico' | 'falha' | 'raro' | 'clique';

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Um tom com ataque e decaimento suaves. */
function tom(a: AudioContext, freq: number, inicio: number, dur: number, tipo: OscillatorType = 'sine', vol = 0.12, freqFim?: number) {
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = tipo;
  const t = a.currentTime + inicio;
  osc.frequency.setValueAtTime(freq, t);
  if (freqFim) osc.frequency.exponentialRampToValueAtTime(freqFim, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export function tocar(som: Som) {
  const a = audio();
  if (!a) return;
  switch (som) {
    case 'sistema': // "plim" da janela do Sistema
      tom(a, 880, 0, 0.18, 'sine', 0.1);
      tom(a, 1320, 0.09, 0.35, 'sine', 0.09);
      break;
    case 'dado': // dado rolando na mesa
      for (let i = 0; i < 6; i++) tom(a, 900 + Math.random() * 900, i * 0.045, 0.03, 'square', 0.03);
      break;
    case 'nivel': // arpejo de subida de nível
      [523, 659, 784, 1047, 1319].forEach((f, i) => tom(a, f, i * 0.08, 0.4, 'triangle', 0.09));
      break;
    case 'cura':
      tom(a, 420, 0, 0.45, 'sine', 0.1, 900);
      tom(a, 630, 0.05, 0.4, 'sine', 0.05, 1300);
      break;
    case 'dano':
      tom(a, 140, 0, 0.25, 'triangle', 0.18, 60);
      tom(a, 90, 0, 0.18, 'square', 0.04, 50);
      break;
    case 'critico':
      [784, 988, 1175, 1568].forEach((f) => tom(a, f, 0, 0.6, 'triangle', 0.06));
      tom(a, 2093, 0.12, 0.5, 'sine', 0.05);
      break;
    case 'falha':
      tom(a, 300, 0, 0.5, 'sawtooth', 0.05, 90);
      break;
    case 'raro': // revelação de algo raro
      [440, 554, 659, 880, 1109].forEach((f, i) => tom(a, f, i * 0.06, 0.7, 'sine', 0.06));
      break;
    case 'clique':
      tom(a, 1500, 0, 0.04, 'sine', 0.04);
      break;
  }
}

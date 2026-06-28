export const API =
  typeof window !== 'undefined'
    ? (window as any).COMPRESSOR_API_BASE || ''
    : '';

export const C = {
  bg: '#06080F',
  sf: '#0D1324',
  sfH: '#111927',
  br: '#1C2A40',
  cy: '#00E5FF',
  cyD: '#00B8CC',
  am: '#FFB800',
  rd: '#FF4560',
  gr: '#00E396',
  pu: '#A78BFA',
  bl: '#3B82F6',
  gh: '#E8EDF5',
  mu: '#6B7A99',
  mL: '#9BAAC0',
} as const;

export const FF = "'Space Grotesk',system-ui,sans-serif";

export async function ai(prompt: string, fallback: string): Promise<string> {
  try {
    const r = await fetch(API + '/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, fallback }),
    });
    if (!r.ok) throw 0;
    const d = await r.json();
    return d.text || fallback;
  } catch {
    return fallback;
  }
}

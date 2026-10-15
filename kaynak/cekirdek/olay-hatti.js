// Olay hattı (Y6): modüller birbirini doğrudan çağırmaz, buradan haberleşir.
const dinleyiciler = new Map();

export function dinle(olay, fn) {
  if (!dinleyiciler.has(olay)) dinleyiciler.set(olay, new Set());
  dinleyiciler.get(olay).add(fn);
  return () => dinleyiciler.get(olay).delete(fn);
}

export function yayinla(olay, veri) {
  const kume = dinleyiciler.get(olay);
  if (!kume) return;
  for (const fn of [...kume]) {
    try { fn(veri); } catch (hata) { console.error('[olay-hatti]', olay, hata); }
  }
}

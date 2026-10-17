// v0.24.0 Benzersiz kimlik üretimi — tek yer. Aynı milisaniyede (çift dokunma, toplu ekleme) üretilen kimlikler de
// çakışmaz: zaman + oturum içi artan sayaç + rastgele ek. crypto.randomUUID varsa rastgele ek oradan gelir.
let sayac = 0;
let sonZaman = 0;

function rastgele() {
  try { if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') return globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 8); } catch { /* yok */ }
  return Math.random().toString(36).slice(2, 10);
}

export function yeniKimlik(onek = '') {
  const simdi = Date.now();
  sayac = simdi === sonZaman ? sayac + 1 : 0;
  sonZaman = simdi;
  const govde = `${simdi.toString(36)}${sayac.toString(36)}${rastgele()}`;
  return onek ? `${onek}-${govde}` : govde;
}

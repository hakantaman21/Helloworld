// Y16: Arayüz metinleri koda yazılmaz; hepsi metinler/ klasöründeki tablodan gelir.
import tr from '../metinler/tr.js';

const tablo = tr;

export function t(anahtar, degerler) {
  const parcalar = anahtar.split('.');
  let deger = tablo;
  for (const p of parcalar) {
    deger = deger == null ? undefined : deger[p];
  }
  if (deger === undefined) {
    console.warn('[metin] eksik anahtar:', anahtar);
    return anahtar;
  }
  if (typeof deger !== 'string' || !degerler) return deger;
  return deger.replace(/\{(\w+)\}/g, (_, ad) => (degerler[ad] !== undefined ? String(degerler[ad]) : `{${ad}}`));
}

// Cümle defteri (HelloTalk "Favoriler" / Speak "kaydet"): sohbetten ya da Dil Anları'ndan beğenilen cümleler.
// Yalnız cihazda; en çok DEFTER_SINIRI cümle, en yeni üstte. Aynı cümle iki kez eklenmez.
import { al, degistir } from './depo.js';

export const DEFTER_SINIRI = 100;

export function cumleKayitli(metin) {
  return (al().kayitliCumleler || []).some((c) => c.metin === metin);
}

// Döner: true (eklendi) | false (zaten vardı, çıkarıldı)
export function cumleKaydetDegistir(metin, kimden = '') {
  let eklendi = false;
  degistir((v) => {
    const liste = v.kayitliCumleler || [];
    if (liste.some((c) => c.metin === metin)) v.kayitliCumleler = liste.filter((c) => c.metin !== metin);
    else { v.kayitliCumleler = [{ metin: String(metin).slice(0, 400), kimden, zaman: Date.now() }, ...liste].slice(0, DEFTER_SINIRI); eklendi = true; }
  });
  return eklendi;
}

export function cumleSil(metin) {
  degistir((v) => { v.kayitliCumleler = (v.kayitliCumleler || []).filter((c) => c.metin !== metin); });
}

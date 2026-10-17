// AI adaptörü (Y9): ekranlar koçla yalnız buradan konuşur. Her çağrı maliyet sayacına yazılır.
// Sağlayıcı değiştirmek tek ayardır; ekranlar ve modüller değişmez.
// Gerçek sağlayıcı (canlı sesli AI) eklenirken: sunucu kısa ömürlü anahtar üretir, anahtar asla buraya yazılmaz (Y8).
import { demoSaglayici, senaryoBul } from './demo-koc.js';
import { aiCagrisiKaydet } from '../olcum.js';

const saglayicilar = {
  demo: demoSaglayici,
};

// v0.24.0 Oturum yaşam döngüsü adaptörde korunur (her sağlayıcı için aynı): koç "bitti" dedikten ya da oturum
// bitirildikten sonra gelen geç/çift cevap sağlayıcıya iletilmez ve maliyet sayılmaz; bitir() bir kez hesaplanır.
const KAPALI_CEVAP = Object.freeze({ metin: '', bitti: true, kapali: true, ceviriler: [] });

export function oturumBaslat(ayar) {
  const saglayici = saglayicilar[ayar.saglayici] || saglayicilar.demo;
  const ic = saglayici.oturumAc(ayar);
  const sayac = () => aiCagrisiKaydet(saglayici.cagriMaliyeti);
  let kapandi = false;
  let ozet = null;
  return {
    kaynak: ic.kaynak,
    acilis() { sayac(); return ic.acilis(); },
    cevapla(metin, guven) {
      if (kapandi) return { ...KAPALI_CEVAP };
      sayac();
      const yanit = ic.cevapla(metin, guven);
      if (yanit && yanit.bitti) kapandi = true;
      return yanit;
    },
    ipucu() { return ic.ipucu(); },
    ilerleme() { return ic.ilerleme(); },
    durum() { return ic.durum(); },
    kapali() { return kapandi; },
    bitir(sureSn) {
      kapandi = true;
      if (!ozet) ozet = ic.bitir(sureSn);
      return ozet;
    },
  };
}

export { senaryoBul };

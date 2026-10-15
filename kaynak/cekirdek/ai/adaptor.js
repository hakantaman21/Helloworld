// AI adaptörü (Y9): ekranlar koçla yalnız buradan konuşur. Her çağrı maliyet sayacına yazılır.
// Sağlayıcı değiştirmek tek ayardır; ekranlar ve modüller değişmez.
// Gerçek sağlayıcı (canlı sesli AI) eklenirken: sunucu kısa ömürlü anahtar üretir, anahtar asla buraya yazılmaz (Y8).
import { demoSaglayici, senaryoBul } from './demo-koc.js';
import { aiCagrisiKaydet } from '../olcum.js';

const saglayicilar = {
  demo: demoSaglayici,
};

export function oturumBaslat(ayar) {
  const saglayici = saglayicilar[ayar.saglayici] || saglayicilar.demo;
  const ic = saglayici.oturumAc(ayar);
  const sayac = () => aiCagrisiKaydet(saglayici.cagriMaliyeti);
  return {
    kaynak: ic.kaynak,
    acilis() { sayac(); return ic.acilis(); },
    cevapla(metin, guven) { sayac(); return ic.cevapla(metin, guven); },
    ipucu() { return ic.ipucu(); },
    ilerleme() { return ic.ilerleme(); },
    durum() { return ic.durum(); },
    bitir(sureSn) { return ic.bitir(sureSn); },
  };
}

export { senaryoBul };

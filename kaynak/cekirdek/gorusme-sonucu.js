// Bir görüşme bitince sonucunu depoya işler: günlük döngü, dakika, kelimeler, Hata Hafızası, karne.
import { al, degistir } from './depo.js';
import { gunuGuncelle } from './gunluk.js';
import { kayitOlustur, hafizayaEkle, tekrarSonucu } from './hafiza.js';
import { tarihAnahtari } from './zaman.js';

const SAKLANAN_GORUSME = 30;
const TELAFFUZ_ESIGI = 60;

export function sonucuIsle(ozet) {
  const kaynakEtiketi = `konusma-kocu/${ozet.senaryoId}`;
  const baglam = ozet.baslik; // { tr, en }: ekranda yerel() ile gösterilir

  // 1. Hata Hafızası kayıtları (ortak format)
  const kayitlar = [];
  for (const d of ozet.duzeltmeler) {
    kayitlar.push(kayitOlustur({ tur: d.tur, dogru: d.dogru, kullanici: d.kullanici, baglam, seviye: ozet.seviye, kaynak: kaynakEtiketi, kuralId: d.kuralId }));
  }
  for (const c of ozet.ceviriler) {
    kayitlar.push(kayitOlustur({ tur: 'kelime', dogru: c.en, kullanici: c.tr, baglam, seviye: ozet.seviye, kaynak: kaynakEtiketi, kuralId: null }));
  }
  for (const p of ozet.telaffuz || []) {
    if (p.puan < TELAFFUZ_ESIGI) {
      kayitlar.push(kayitOlustur({ tur: 'telaffuz', dogru: p.metin, kullanici: p.metin, baglam, seviye: ozet.seviye, kaynak: kaynakEtiketi, kuralId: null }));
    }
  }
  const eklenen = hafizayaEkle(kayitlar);

  // 2. Tekrar edilen hafıza öğelerinin sonucu
  for (const s of ozet.hafizaSonuclari) tekrarSonucu(s.id, s.basari);

  // 3. Günlük döngü ve sayılar
  const konustu = ozet.cumleler.length > 0;
  gunuGuncelle((gun) => {
    if (konustu && (ozet.tur === 'sabah' || ozet.tur === 'aksam')) gun[ozet.tur] = true;
    if (konustu && ozet.tur === 'senaryo') gun.senaryo = true;
    gun.dakika += Math.round((ozet.sureSn / 60) * 10) / 10;
    for (const k of ozet.yeniKelimeler) if (!gun.yeniKelime.includes(k)) gun.yeniKelime.push(k);
    if (ozet.akicilik) gun.akicilik.push(ozet.akicilik);
  });

  // 4. Profil, senaryo tamamlama, karne
  degistir((v) => {
    if (ozet.tur === 'tanisma' && konustu) {
      v.profil.seviye = ozet.seviyeTahmini;
      v.profil.tanismaYapildi = true;
    }
    if (ozet.tur === 'senaryo' && ozet.gorevTamam) v.tamamlananSenaryolar[ozet.senaryoId] = tarihAnahtari();
    const kayit = { ...ozet, tarih: tarihAnahtari(), eklenenHafiza: eklenen };
    v.sonGorusme = kayit;
    v.gorusmeler.unshift(kayit);
    v.gorusmeler = v.gorusmeler.slice(0, SAKLANAN_GORUSME);
    v.yarimKalan = null;
  });

  return { eklenen };
}

export function yarimKalaniKaydet(bilgi) {
  degistir((v) => { v.yarimKalan = { ...bilgi, tarih: tarihAnahtari() }; });
}

export function yarimKalan() {
  const y = al().yarimKalan;
  return y && y.tarih === tarihAnahtari() ? y : null;
}

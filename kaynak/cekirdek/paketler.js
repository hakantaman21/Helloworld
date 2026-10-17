// v0.18.0 Paketler ve üyelik (Hakan, 17.10.2026). Üç paket: Ücretsiz · Plus · Premium.
// Paket tanımları "düzenleme modu"nda değiştirilebilir (ad, fiyat, günlük yeni kişi sınırı, özellikler, açıklama satırları)
// ve bu cihazda saklanır (v.paketTanimlari). Gerçek yayında tanımlar sunucudan gelir ve ödeme bir sağlayıcıyla
// (Google Play Faturalandırma / Stripe) doğrulanır; o karar verilene kadar paket etkinleştirme TEST amaçlıdır ve öyle yazılır.
import { al, degistir } from './depo.js';
import { tarihAnahtari } from './zaman.js';
import { VARSAYILAN_PAKETLER } from '../veri/paketler.js';

export const PAKET_SIRASI = ['ucretsiz', 'plus', 'premium'];
// Özellik anahtarları (ekranda t(`paket.ozellik.${k}`) ile yazılır).
// Yalnız GERÇEKTEN çalışan özellikler listelenir (boş vaat yok). Yeni özellik eklenince buraya da eklenir.
export const OZELLIKLER = ['uygulamaKilidi', 'ekosistemIndirimi'];

// Varsayılan paket tanımları veri katmanında (metinler orada): veri/paketler.js

export function paketTanimlari() {
  const kayit = al().paketTanimlari || {};
  return Object.fromEntries(PAKET_SIRASI.map((k) => {
    const v = VARSAYILAN_PAKETLER[k]; const d = kayit[k] || {};
    return [k, { ...v, ...d, ad: { ...v.ad, ...(d.ad || {}) }, ozellikler: { ...v.ozellikler, ...(d.ozellikler || {}) }, satirlar: { ...v.satirlar, ...(d.satirlar || {}) } }];
  }));
}
export function paketTanimiDegistir(kimlik, fn) {
  degistir((v) => {
    const tum = paketTanimlari();
    const kopya = JSON.parse(JSON.stringify(tum[kimlik]));
    fn(kopya);
    v.paketTanimlari = { ...(v.paketTanimlari || {}), [kimlik]: kopya };
  });
}
export function paketleriVarsayilanaDondur() { degistir((v) => { delete v.paketTanimlari; }); }

export function aktifPaketKimligi() { const u = al().uyelik; return u && PAKET_SIRASI.includes(u.paket) ? u.paket : 'ucretsiz'; }
export function aktifPaket() { return paketTanimlari()[aktifPaketKimligi()]; }
export function ozellikVar(ozellik) { return Boolean(aktifPaket().ozellikler[ozellik]); }
// TEST: ödeme yokken paketi bu cihazda etkinleştirir (kaynak: 'test').
export function paketEtkinlestir(kimlik) { degistir((v) => { v.uyelik = { paket: kimlik, baslangic: Date.now(), kaynak: 'test' }; }); }

// ---- Günlük yeni kişi sınırı ----
// "Yeni kişi": bugün ilk kez yazdığın (daha önce hiç mesajın olmayan) kişi. Zaten konuştuğun kişilere yazmak sayılmaz.
export function bugunYeniKisiler() { return ((al().test || {}).yeniKisiGunluk || {})[tarihAnahtari()] || []; }
export function yeniKisiSiniri() { return aktifPaket().gunlukYeniKisi || 0; } // 0 = sınırsız
// { izin, kalan, sinir } — kimlik bugün zaten sayıldıysa ya da önceden konuşulmuşsa her zaman izin.
export function yeniKisiIzni(kimlik, oncedenKonusuldu) {
  const sinir = yeniKisiSiniri();
  const bugun = bugunYeniKisiler();
  if (oncedenKonusuldu || bugun.includes(kimlik) || !sinir) return { izin: true, kalan: sinir ? Math.max(0, sinir - bugun.length) : null, sinir };
  return { izin: bugun.length < sinir, kalan: Math.max(0, sinir - bugun.length), sinir };
}
export function yeniKisiSay(kimlik) {
  degistir((v) => {
    const tr = tarihAnahtari();
    const t = { ...(v.test || {}) };
    const eski = (t.yeniKisiGunluk || {})[tr] || [];
    if (eski.includes(kimlik)) return;
    t.yeniKisiGunluk = { [tr]: [...eski, kimlik] }; // yalnız bugün tutulur
    v.test = t;
  });
}

// İlk mesaj (selam dahil) gönderilmeden önce: önceden mesaj yoksa bu kişi "yeni" sayılır.
export function ilkMesajKontrolu(kimlik, mesajlar) {
  const onceden = (mesajlar || []).some((m) => m.kim === 'ben');
  return yeniKisiIzni(kimlik, onceden);
}

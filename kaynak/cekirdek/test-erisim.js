// v0.24.0 Test kişilerine erişim politikası — tek yer. Engelleme ve "test modu kapalı" durumu her okuma ve yazma
// noktasında aynı kuralla uygulanır (yorum, mesaj, istek, bildirim, gecikmeli otomatik yanıt).
// Gerçek topluluk açılınca aynı politika sunucuda da uygulanmalıdır.
import { al } from './depo.js';

const tst = () => al().test || {};

export function testAcik() { return Boolean(tst().acik); }
export function engelliMi(kimlik) { return (tst().engelli || []).includes(kimlik); }

// Test kişisi şu an görünebilir/ulaşabilir mi: test modu açık ve kişi engellenmemiş.
// 'ben' (kullanıcının kendisi) her zaman erişilebilirdir.
export function kisiErisilebilir(kimlik) {
  if (kimlik === 'ben') return true;
  // v0.26.0: hesap askıdayken kimseyle iletişim yoktur (profil görünmez, kimse yazamaz, kimse görünmez).
  if (al().profil.hesapAskida) return false;
  return testAcik() && !engelliMi(kimlik);
}

// Liste süzgeci: anahtar, öğeden kişi kimliğini çıkarır.
export function erisilebilirler(liste, anahtar = (x) => x) {
  return (liste || []).filter((x) => kisiErisilebilir(anahtar(x)));
}

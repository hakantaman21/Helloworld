// Koç araması zamanlayıcısı. Uygulama açıkken sabah/akşam saati gelince "Koç arıyor" ekranını tetikler.
// Uygulama kapalıyken arama için sunucudan bildirim gerekir; o, sunucu bağlanınca eklenecek.
// Y20: uygulama kendiliğinden günde en fazla iki arama bildirimi gönderir.
import { al, degistir } from './depo.js';
import { yayinla } from './olay-hatti.js';
import { gunKaydi } from './gunluk.js';
import { tarihAnahtari, saatGeldiMi } from './zaman.js';
import { t } from './metin.js';

export const GUNLUK_BILDIRIM_SINIRI = 2;
// v0.24.0 Erteleme ayrı sayılır: kullanıcının istediği erteleme, uygulamanın kendiliğinden gönderdiği iki aramalık
// günlük sınırı geri açmaz. Her arama türü için günde en çok ERTELEME_SINIRI erteleme; sonra arama o gün için kapanır.
export const ERTELEME_SINIRI = 2;
const EN_KISA_ERTELEME_DK = 1;
// v0.24.0 Tam ekran arama yalnız vakti uygulama AÇIKKEN gelirse çalar. Uygulama açılmadan önce vakti geçmiş arama
// açılışta ekranın önüne geçmez (kurulum, Bugün ya da başka iş yarıda kalmasın); "cevapsız arama" olarak bildirim
// kutusuna düşer. Açılıştan hemen önceki kısa pay (ACILIS_PAYI) canlı sayılır.
const ACILIS_PAYI_MS = 2 * 60000;
let acilisZamani = Date.now();
function vadeAni(saat) {
  const [s, d] = String(saat).split(':').map(Number);
  const x = new Date();
  x.setHours(s || 0, d || 0, 0, 0);
  return x.getTime();
}
const KONTROL_ARALIGI_MS = 30000;

function bugunkuDurum() {
  const bugun = tarihAnahtari();
  const d = al().aramaDurumu;
  if (!d[bugun]) return { bildirim: 0, reddedildi: {}, ertelendi: {}, erteleme: {} };
  return { erteleme: {}, ...d[bugun] };
}

function durumuGuncelle(fn) {
  const bugun = tarihAnahtari();
  degistir((v) => {
    // Eski günlerin kayıtları atılır; yalnız bugün kalır.
    const mevcut = v.aramaDurumu[bugun] || { bildirim: 0, reddedildi: {}, ertelendi: {}, erteleme: {} };
    mevcut.erteleme = mevcut.erteleme || {};
    v.aramaDurumu = { [bugun]: mevcut };
    fn(mevcut);
  });
}

// Ertelenmiş ve vakti gelmiş arama mı (kullanıcının isteğiyle yeniden çalan): günlük sınıra sayılmaz.
const ertelemeVadesi = (durum, tur, simdi) => Number.isFinite(durum.ertelendi[tur]) && durum.ertelendi[tur] < Number.MAX_SAFE_INTEGER && durum.ertelendi[tur] <= simdi;

function vadesiGelenArama() {
  const ayar = al().profil.ayarlar;
  const gun = gunKaydi();
  const durum = bugunkuDurum();
  const simdi = Date.now();
  for (const tur of ['sabah', 'aksam']) {
    const saat = tur === 'sabah' ? ayar.sabahSaati : ayar.aksamSaati;
    if (gun[tur] || durum.reddedildi[tur]) continue;
    if (!saatGeldiMi(saat)) continue;
    if (tur === 'sabah' && saatGeldiMi(ayar.aksamSaati)) continue; // sabah araması için geç kalındı
    if (ertelemeVadesi(durum, tur, simdi)) return { tur, erteleme: true };
    if (durum.ertelendi[tur] && durum.ertelendi[tur] > simdi) continue;
    if (vadeAni(saat) < acilisZamani - ACILIS_PAYI_MS) return { tur, kacirildi: true };
    if (durum.bildirim >= GUNLUK_BILDIRIM_SINIRI) continue;
    return { tur, erteleme: false };
  }
  return null;
}

function aramaYap({ tur, erteleme, kacirildi }) {
  if (kacirildi) {
    durumuGuncelle((d) => { d.ertelendi[tur] = Number.MAX_SAFE_INTEGER; });
    // Daha önce hiç konuşmamış yeni kullanıcıya "cevapsız arama" denmez (kurulum günü).
    if ((al().gorusmeler || []).length) yayinla('arama:kacirildi', { tur, tarih: tarihAnahtari() });
    return;
  }
  durumuGuncelle((d) => { if (!erteleme) d.bildirim += 1; d.ertelendi[tur] = Number.MAX_SAFE_INTEGER; });
  yayinla('arama:geldi', { tur });
  if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(t('arama.bildirimBaslik', { koc: t('koc.ad') }), { body: t(`arama.bildirimMetin.${tur}`) });
    } catch (hata) {
      // bazı tarayıcılar sayfadan bildirim açmayı engeller; uygulama içi arama yine çalışır
    }
  }
}

export function kontrolEt() {
  const vade = vadesiGelenArama();
  if (vade) aramaYap(vade);
}

export function zamanlayiciBaslat() {
  acilisZamani = Date.now();
  setTimeout(kontrolEt, 1500);
  setInterval(kontrolEt, KONTROL_ARALIGI_MS);
}

// Döner: true (ertelendi) | false (bugünkü erteleme hakkı bitti; arama bugün için kapatıldı).
export function ertele(tur, dakika = 10) {
  let ertelendi = false;
  durumuGuncelle((d) => {
    const n = d.erteleme[tur] || 0;
    if (n >= ERTELEME_SINIRI) { d.reddedildi[tur] = true; return; }
    d.erteleme[tur] = n + 1;
    d.ertelendi[tur] = Date.now() + Math.max(EN_KISA_ERTELEME_DK, Number(dakika) || 0) * 60000;
    ertelendi = true;
  });
  return ertelendi;
}

export function reddet(tur) {
  durumuGuncelle((d) => { d.reddedildi[tur] = true; });
}

// Ayarlar'daki deneme düğmesi ve Bugün ekranındaki kartlar için: sınırı saymadan arar.
export function simdiAra(tur) {
  yayinla('arama:geldi', { tur });
}

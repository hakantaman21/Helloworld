// Koç araması zamanlayıcısı. Uygulama açıkken sabah/akşam saati gelince "Koç arıyor" ekranını tetikler.
// Uygulama kapalıyken arama için sunucudan bildirim gerekir; o, sunucu bağlanınca eklenecek.
// Y20: uygulama kendiliğinden günde en fazla iki arama bildirimi gönderir.
import { al, degistir } from './depo.js';
import { yayinla } from './olay-hatti.js';
import { gunKaydi } from './gunluk.js';
import { tarihAnahtari, saatGeldiMi } from './zaman.js';
import { t } from './metin.js';

export const GUNLUK_BILDIRIM_SINIRI = 2;
const KONTROL_ARALIGI_MS = 30000;

function bugunkuDurum() {
  const bugun = tarihAnahtari();
  const d = al().aramaDurumu;
  if (!d[bugun]) return { bildirim: 0, reddedildi: {}, ertelendi: {} };
  return d[bugun];
}

function durumuGuncelle(fn) {
  const bugun = tarihAnahtari();
  degistir((v) => {
    // Eski günlerin kayıtları atılır; yalnız bugün kalır.
    const mevcut = v.aramaDurumu[bugun] || { bildirim: 0, reddedildi: {}, ertelendi: {} };
    v.aramaDurumu = { [bugun]: mevcut };
    fn(mevcut);
  });
}

function vadesiGelenArama() {
  const ayar = al().profil.ayarlar;
  const gun = gunKaydi();
  const durum = bugunkuDurum();
  if (durum.bildirim >= GUNLUK_BILDIRIM_SINIRI) return null;
  const simdi = Date.now();
  for (const tur of ['sabah', 'aksam']) {
    const saat = tur === 'sabah' ? ayar.sabahSaati : ayar.aksamSaati;
    if (gun[tur] || durum.reddedildi[tur]) continue;
    if (!saatGeldiMi(saat)) continue;
    if (tur === 'sabah' && saatGeldiMi(ayar.aksamSaati)) continue; // sabah araması için geç kalındı
    if (durum.ertelendi[tur] && durum.ertelendi[tur] > simdi) continue;
    return tur;
  }
  return null;
}

function aramaYap(tur) {
  durumuGuncelle((d) => { d.bildirim += 1; d.ertelendi[tur] = Number.MAX_SAFE_INTEGER; });
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
  const tur = vadesiGelenArama();
  if (tur) aramaYap(tur);
}

export function zamanlayiciBaslat() {
  setTimeout(kontrolEt, 1500);
  setInterval(kontrolEt, KONTROL_ARALIGI_MS);
}

export function ertele(tur, dakika = 10) {
  durumuGuncelle((d) => { d.ertelendi[tur] = Date.now() + dakika * 60000; d.bildirim = Math.max(0, d.bildirim - 1); });
}

export function reddet(tur) {
  durumuGuncelle((d) => { d.reddedildi[tur] = true; });
}

// Ayarlar'daki deneme düğmesi ve Bugün ekranındaki kartlar için: sınırı saymadan arar.
export function simdiAra(tur) {
  yayinla('arama:geldi', { tur });
}

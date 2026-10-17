// Giriş noktası: stiller (katman sırasıyla), çekirdek servisler, modül kaydı, yönlendirici.
import './stiller/katmanlar.css';
import './stiller/jetonlar.css';
import './stiller/temel.css';
import './stiller/bilesenler.css';
import './stiller/tema-koyu.css';
import './stiller/erisim.css';

import { yukle, al, degistir, bozukKayitVardi } from './cekirdek/depo.js';
import { kaydet } from './cekirdek/modul-kaydi.js';
import { baslat, git, aktifEkran } from './cekirdek/yonlendirici.js';
import { temaBaslat } from './cekirdek/tema.js';
import { dinle } from './cekirdek/olay-hatti.js';
import { zamanlayiciBaslat } from './cekirdek/zamanlayici.js';
import { duyur } from './cekirdek/duyuru.js';
import { t, dilAyarla, tarayiciDili } from './cekirdek/metin.js';
import { pwaBaslat } from './cekirdek/pwa.js';
import { medyaHazirla } from './cekirdek/fotograf.js';
import { sekmeKaydirmaBaslat, ortaDugmeAyarla, ortaIpucuGoster } from './cekirdek/arayuz.js';
import { simdiAra } from './cekirdek/zamanlayici.js';
import { siradaki } from './cekirdek/gunluk.js';
import { oneriSenaryo } from './cekirdek/oneri.js';

import karsilama from './moduller/karsilama/index.js';
import sohbetler from './moduller/sohbetler/index.js';
import kesfet from './moduller/kesfet/index.js';
import dilAnlari from './moduller/dil-anlari/index.js';
import bugun from './moduller/bugun/index.js';
import arama from './moduller/arama/index.js';
import karne from './moduller/karne/index.js';
import senaryolar from './moduller/senaryolar/index.js';
import hafiza from './moduller/hafiza/index.js';
import gelisim from './moduller/gelisim/index.js';
import ayarlar from './moduller/ayarlar/index.js';
import telaffuz from './moduller/telaffuz/index.js';
import mesaj from './moduller/mesaj/index.js';
import rehberModulu from './moduller/rehber/index.js';
import ekosistemModulu from './moduller/ekosistem/index.js';
import { ikonBaslat } from './cekirdek/ikon.js';
import { ekosistemBaslat } from './cekirdek/ekosistem.js';
import { rehberBaslat } from './cekirdek/rehber.js';
import { rehberArayuzBaslat } from './cekirdek/rehber-arayuz.js';
// v0.19.0–v0.21.0 ortak bileşen stilleri: modül stillerinden sonra gelsin diye modüllerden sonra yüklenir.
import './stiller/bilesenler-rehber.css';

// Bayrakla kapatılan modüller burada listelenir; uygulama diğerleriyle çalışmaya devam eder.
const KAPALI_MODULLER = [];

const MESGUL_EKRANLAR = ['gorusme', 'gelen-arama', 'karsilama'];

function uygulamayiBaslat() {
  yukle();

  // Arayüz dili: kullanıcının seçimi, yoksa tarayıcının dili (desteklenmiyorsa İngilizce)
  if (!al().profil.ayarlar.arayuzDili) degistir((v) => { v.profil.ayarlar.arayuzDili = tarayiciDili(); });
  dilAyarla(al().profil.ayarlar.arayuzDili);
  temaBaslat();
  for (const m of [karsilama, sohbetler, kesfet, dilAnlari, bugun, arama, karne, senaryolar, hafiza, gelisim, ayarlar, mesaj, telaffuz, rehberModulu, ekosistemModulu]) kaydet(m, KAPALI_MODULLER);
  // v0.20.0 İkon paketi ve benzersiz ikonlar; uygulama ailesi üyelik paylaşımı.
  ikonBaslat();
  ekosistemBaslat();
  // v0.19.0 Rehberlik: ilk ekran çizilmeden önce dinlemeye başlar (ilk ekran da kullanım sayılır, tur/yenilikler açılabilir).
  rehberBaslat();
  rehberArayuzBaslat();

  dinle('arama:geldi', ({ tur }) => {
    if (MESGUL_EKRANLAR.includes(aktifEkran())) return;
    git(`/gelen-arama?tur=${tur}`);
  });

  // v0.13.0 Kayıt güvenliği: yazılamayan değişiklik ve okunamayan eski kayıt kullanıcıya söylenir.
  let sonYazmaUyarisi = 0;
  dinle('depo:yazilamadi', () => {
    if (Date.now() - sonYazmaUyarisi < 60000) return;
    sonYazmaUyarisi = Date.now();
    duyur(t('depo.yazilamadi'), 8000);
  });

  window.addEventListener('offline', () => duyur(t('genel.cevrimdisi'), 5000));
  window.addEventListener('online', () => duyur(t('genel.cevrimiciOldu')));

  baslat(document.getElementById('uygulama'));
  if (bozukKayitVardi()) duyur(t('depo.bozukKayit'), 9000);
  // v0.14.0: fotoğraflar IndexedDB'den arka planda belleğe alınır; ekranlar beklemez. Fotoğraf varsa açık ekran bir kez yenilenir.
  // v0.16.0: fotoğraflar geç yüklenince ekran yeniden çizilir — ama kullanıcı o an yazı yazıyorsa taslağı gitmesin diye
  // yazı alanından çıkana kadar beklenir.
  const yaziyor = () => { const a = document.activeElement; return !!a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && !['button', 'checkbox', 'radio', 'range', 'file'].includes(a.type)) || a.isContentEditable); };
  medyaHazirla().then((yuklendi) => {
    if (!yuklendi) return;
    const adres = location.hash;
    const yenile = () => { if (location.hash === adres) git((location.hash.slice(1) || '/bugun'), {}); };
    if (!yaziyor()) { yenile(); return; }
    const bekle = () => { setTimeout(() => { if (yaziyor()) return; document.removeEventListener('focusout', bekle); yenile(); }, 0); };
    document.addEventListener('focusout', bekle);
  });
  zamanlayiciBaslat();
  sekmeKaydirmaBaslat(git);
  // Orta Pratik düğmesi: basılı tutunca hızlı işlemler; "atanabilir" olanlar dokunma kısayolu olarak seçilebilir.
  ortaDugmeAyarla({
    eylemler: () => [
      { kimlik: 'pratik', ikon: 'pratik', ad: t('orta.eylem.pratik'), kisa: t('gezinme.pratik'), atanabilir: true, calistir: () => git('/bugun') },
      { kimlik: 'arama', ikon: 'bildirim', ad: t('orta.eylem.arama'), kisa: t('orta.kisa.arama'), atanabilir: true, calistir: () => simdiAra(siradaki() === 'aksam' ? 'aksam' : 'sabah') },
      { kimlik: 'senaryo', ikon: 'senaryo', ad: t('orta.eylem.senaryo'), kisa: t('orta.kisa.senaryo'), atanabilir: true, calistir: () => git('/senaryolar') },
      { kimlik: 'telaffuz', ikon: 'telaffuz', ad: t('orta.eylem.telaffuz'), kisa: t('orta.kisa.telaffuz'), atanabilir: true, calistir: () => git('/telaffuz') },
      { kimlik: 'hafiza', ikon: 'hafiza', ad: t('orta.eylem.hafiza'), calistir: () => git('/hafiza') },
      { kimlik: 'partner', ikon: 'baglanti', ad: t('orta.eylem.partner'), calistir: () => git('/kesfet') },
    ],
    atamaKaydet: (k) => { degistir((v) => { v.profil.ayarlar.ortaDugme = k; }); duyur(t('orta.kaydedildi'), 1800); },
  });
  pwaBaslat();
  setTimeout(() => ortaIpucuGoster((al().profil.ayarlar.ortaIpucu || 0) < 2, () => degistir((v) => { v.profil.ayarlar.ortaIpucu = (v.profil.ayarlar.ortaIpucu || 0) + 1; })), 1500);
}

uygulamayiBaslat();

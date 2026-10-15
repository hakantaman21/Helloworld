// Giriş noktası: stiller (katman sırasıyla), çekirdek servisler, modül kaydı, yönlendirici.
import './stiller/katmanlar.css';
import './stiller/jetonlar.css';
import './stiller/temel.css';
import './stiller/bilesenler.css';
import './stiller/tema-koyu.css';
import './stiller/erisim.css';

import { yukle, al, degistir } from './cekirdek/depo.js';
import { kaydet } from './cekirdek/modul-kaydi.js';
import { baslat, git, aktifEkran } from './cekirdek/yonlendirici.js';
import { temaBaslat } from './cekirdek/tema.js';
import { dinle } from './cekirdek/olay-hatti.js';
import { zamanlayiciBaslat } from './cekirdek/zamanlayici.js';
import { duyur } from './cekirdek/duyuru.js';
import { t, dilAyarla, tarayiciDili } from './cekirdek/metin.js';
import { pwaBaslat } from './cekirdek/pwa.js';

import karsilama from './moduller/karsilama/index.js';
import sohbetler from './moduller/sohbetler/index.js';
import kesfet from './moduller/kesfet/index.js';
import bugun from './moduller/bugun/index.js';
import arama from './moduller/arama/index.js';
import karne from './moduller/karne/index.js';
import senaryolar from './moduller/senaryolar/index.js';
import hafiza from './moduller/hafiza/index.js';
import gelisim from './moduller/gelisim/index.js';
import ayarlar from './moduller/ayarlar/index.js';

// Bayrakla kapatılan modüller burada listelenir; uygulama diğerleriyle çalışmaya devam eder.
const KAPALI_MODULLER = [];

const MESGUL_EKRANLAR = ['gorusme', 'gelen-arama', 'karsilama'];

function uygulamayiBaslat() {
  yukle();
  // Arayüz dili: kullanıcının seçimi, yoksa tarayıcının dili (desteklenmiyorsa İngilizce)
  if (!al().profil.ayarlar.arayuzDili) degistir((v) => { v.profil.ayarlar.arayuzDili = tarayiciDili(); });
  dilAyarla(al().profil.ayarlar.arayuzDili);
  temaBaslat();
  for (const m of [karsilama, sohbetler, kesfet, bugun, arama, karne, senaryolar, hafiza, gelisim, ayarlar]) kaydet(m, KAPALI_MODULLER);

  dinle('arama:geldi', ({ tur }) => {
    if (MESGUL_EKRANLAR.includes(aktifEkran())) return;
    git(`/gelen-arama?tur=${tur}`);
  });

  window.addEventListener('offline', () => duyur(t('genel.cevrimdisi'), 5000));
  window.addEventListener('online', () => duyur(t('genel.cevrimiciOldu')));

  baslat(document.getElementById('uygulama'));
  zamanlayiciBaslat();
  pwaBaslat();
}

uygulamayiBaslat();

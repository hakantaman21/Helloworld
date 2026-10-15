// Mesaj ekranı (şimdilik yalnız TEST MODU): yazılı mesajlaşma, gönderim öncesi düzeltme önerisi, partner düzeltmesi,
// konu önerisi, şikâyet ve engelleme. Karşı taraf test profilidir; yanıtlar otomatik kalıptır ve öyle etiketlenir.
// Gerçek topluluk açılınca aynı ekran sunucudaki gerçek sohbete bağlanır. Test mesajları gelişime sayılmaz.
import './mesaj.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, durumKutusu, yerlestir, testEtiketi, farkCiz, onayIste } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { kelimeFarki } from '../../cekirdek/dil/fark.js';
import { testProfili, testMesajlari, testMesajEkle, otomatikYanit, gonderimOncesiOneri, testEngelle, testSikayet } from '../../cekirdek/test-modu.js';
import { TEST_KONULARI } from '../../veri/test-profiller.js';

const YANIT_GECIKMESI = 1300;
const SIKAYET_NEDENLERI = ['taciz', 'spam', 'uygunsuz', 'konuDisi'];

function saat(zaman) {
  const d = new Date(zaman);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function ciz(kok, b) {
  const profil = testProfili(b.p.k);
  if (!profil) {
    yerlestir(kok, durumKutusu('bos', t('test.profilYok'), { metin: t('genel.geri'), fn: () => b.geri('/kesfet') }));
    return null;
  }
  let zamanlayici = null;
  let yaziyor = false;
  const liste = h('div', { class: 'msj-liste', role: 'log', 'aria-live': 'polite', 'aria-label': t('test.mesajlar') });
  const girdi = h('textarea', { class: 'b-girdi msj-girdi', rows: 1, maxlength: 600, 'aria-label': t('test.mesajYazEtiket'), placeholder: t('test.mesajYazEtiket') });
  const oneriAlani = h('div', { class: 'msj-oneri-alani' });

  function balon(m) {
    if (m.kim === 'ben') {
      return h('div', { class: 'msj-satir msj-ben' },
        h('div', { class: 'msj-balon msj-balon-ben' }, h('p', null, m.metin), h('span', { class: 'msj-saat' }, saat(m.zaman), m.duzeltildi ? ` · ${t('test.duzeltilerekGonderildi')}` : '')));
    }
    return h('div', { class: 'msj-satir msj-o' },
      h('span', { class: `msj-av msj-av-${profil.renk}`, 'aria-hidden': 'true' }, profil.bas),
      h('div', { class: 'msj-o-ic' },
        m.duzeltme ? h('div', { class: 'msj-duzeltme' },
          h('span', { class: 'msj-duzeltme-baslik' }, ikon('onay', 16), t('test.partnerDuzeltmesi', { ad: profil.ad })),
          farkCiz(kelimeFarki(m.duzeltme.kaynak, m.duzeltme.dogru))) : null,
        h('div', { class: 'msj-balon msj-balon-o' }, h('p', null, m.metin),
          h('span', { class: 'msj-saat' }, saat(m.zaman), ' · ', t('test.otomatikYanit'))),
      ),
    );
  }

  function yenile() {
    const mesajlar = testMesajlari(profil.kimlik);
    yerlestir(liste,
      h('div', { class: 'msj-uyari' }, testEtiketi(), h('span', null, t('test.sohbetUyari'))),
      mesajlar.length ? null : h('p', { class: 'b-kucuk msj-bos' }, t('test.ilkMesaj', { ad: profil.ad })),
      mesajlar.map(balon),
      yaziyor ? h('div', { class: 'msj-satir msj-o' }, h('span', { class: `msj-av msj-av-${profil.renk}`, 'aria-hidden': 'true' }, profil.bas), h('div', { class: 'msj-balon msj-balon-o msj-yaziyor' }, t('test.yaziyor', { ad: profil.ad }))) : null,
    );
    requestAnimationFrame(() => window.scrollTo(0, document.body.scrollHeight));
  }

  function gonder(metin, duzeltildi) {
    const temiz = metin.trim();
    if (!temiz) return;
    testMesajEkle(profil.kimlik, { kim: 'ben', metin: temiz, duzeltildi: Boolean(duzeltildi) });
    girdi.value = '';
    yerlestir(oneriAlani);
    yaziyor = true;
    yenile();
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(() => {
      testMesajEkle(profil.kimlik, otomatikYanit(profil, temiz));
      yaziyor = false;
      yenile();
    }, YANIT_GECIKMESI);
  }

  // Gönderim öncesi isteğe bağlı düzeltme önerisi (yerel kurallar; ağ çağrısı yok).
  function gonderDene() {
    const metin = girdi.value.trim();
    if (!metin) { girdi.focus(); return; }
    const oneri = gonderimOncesiOneri(metin);
    if (!oneri) { gonder(metin, false); return; }
    yerlestir(oneriAlani, h('div', { class: 'b-kart msj-oneri', role: 'region', 'aria-label': t('test.oneriBaslik') },
      h('span', { class: 'b-ust-etiket' }, t('test.oneriBaslik')),
      farkCiz(kelimeFarki(metin, oneri.dogru)),
      h('p', { class: 'b-kucuk' }, oneri.aciklamalar.map((a) => t(a)).join(' ')),
      h('div', { class: 'b-izgara-2' },
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => gonder(oneri.dogru, true) }, t('test.duzeltilmisiGonder')),
        h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => gonder(metin, false) }, t('test.oldugGibiGonder')),
      ),
    ));
  }

  async function sikayetEt() {
    const secim = await new Promise((coz) => {
      const kapat = (deger) => { perde.remove(); coz(deger); };
      const perde = h('div', { class: 'b-perde', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'msj-sikayet-baslik' },
        h('div', { class: 'b-pencere' },
          h('h2', { class: 'b-bolum-baslik', id: 'msj-sikayet-baslik' }, t('test.sikayetBaslik', { ad: profil.ad })),
          h('div', { class: 'b-yigin' }, SIKAYET_NEDENLERI.map((n) => h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => kapat(n) }, t(`test.sikayetNeden.${n}`))),
            h('button', { type: 'button', class: 'b-dugme', onClick: () => kapat(null) }, t('genel.vazgec'))),
        ),
      );
      document.body.append(perde);
      perde.querySelector('button').focus();
    });
    if (!secim) return;
    testSikayet(profil.kimlik, secim);
    duyur(t('test.sikayetAlindi'), 4000);
  }

  async function engelle() {
    const evet = await onayIste({ baslik: t('test.engelleBaslik', { ad: profil.ad }), metin: t('test.engelleMetin'), evet: t('test.engelle'), hayir: t('genel.vazgec') });
    if (!evet) return;
    testEngelle(profil.kimlik);
    duyur(t('test.engellendi', { ad: profil.ad }));
    b.git('/kesfet', { degistir: true });
  }

  girdi.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); gonderDene(); } });

  yerlestir(kok,
    h('header', { class: 'msj-ust' },
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve b-dugme-yuvarlak', 'aria-label': t('genel.geri'), onClick: () => b.geri('/kesfet') }, ikon('sol', 20)),
      h('span', { class: `msj-av msj-av-${profil.renk}`, 'aria-hidden': 'true' }, profil.bas),
      h('div', { class: 'msj-kim' },
        h('div', { class: 'msj-ad' }, h('b', null, profil.ad), testEtiketi()),
        h('span', { class: 'b-kucuk' }, `${yerel(profil.ulke)} · ${profil.seviye}`),
      ),
    ),
    h('div', { class: 'msj-araclar' },
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve msj-arac-dugme', onClick: sikayetEt }, ikon('kalkan', 18), t('test.sikayetEt')),
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve msj-arac-dugme', onClick: engelle }, ikon('kapat', 18), t('test.engelle')),
    ),
    liste,
    h('div', { class: 'msj-alt' },
      oneriAlani,
      h('div', { class: 'msj-konular', role: 'group', 'aria-label': t('test.konuOnerisi') },
        h('span', { class: 'b-kucuk msj-konu-etiket' }, ikon('ampul', 16), t('test.konuOnerisi')),
        TEST_KONULARI.map((k) => h('button', { type: 'button', class: 'msj-konu-dugme', onClick: () => { girdi.value = k.cumle; girdi.focus(); } }, yerel(k.baslik))),
      ),
      h('div', { class: 'msj-yaz' },
        girdi,
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana b-dugme-yuvarlak', 'aria-label': t('test.gonder'), onClick: gonderDene }, ikon('gonder', 20)),
      ),
    ),
  );
  yenile();
  return () => clearTimeout(zamanlayici);
}

export default {
  kimlik: 'mesaj',
  surum: '0.2.8',
  onek: 'msj',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'metin', 'test-modu'],
  ekranlar: {
    mesaj: ekran({ baslikAnahtari: 'ekran.mesaj', durumlar: DORT_DURUM, ciz }),
  },
};

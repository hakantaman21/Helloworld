// Dil Anları: HelloTalk "Moments" esinli topluluk akışı.
// Gerçek topluluk (hesap + moderasyon) açılana dek gerçek gönderi yoktur; dürüst boş durum gösterilir.
// Test modunda TEST rozetli sanal kullanıcıların gönderileri: beğen, yorum, gönderiyi düzelt, şikâyet, kendi anını paylaş.
// Beğeni/yorum sayıları uydurulmaz; yalnız bu cihazdaki etkileşimler sayılır. Test verisi gelişime yazılmaz.
import './anlar.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, altGezinme, ustBaslik, durumKutusu, ikon, yerlestir, testEtiketi, testAvatar, goreliZaman, farkCiz } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { kelimeFarki } from '../../cekirdek/dil/fark.js';
import { testModuAcik, testModuAyarla, testAnlari, anBegen, anBegenildi, anYorumlari, anYorumEkle, anDuzeltmesi, anDuzelt, anPaylas, anOtomatikYorum, testProfiliHam, testSikayet } from '../../cekirdek/test-modu.js';

const OTOMATIK_YORUM_GECIKMESI = 1500;

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const acikYorum = new Set();
  let duzeltilen = null;
  let zamanlayici = null;
  const akis = h('div', { class: 'anl-akis', 'aria-live': 'polite' });

  function yazarBilgisi(an) {
    if (an.benim) {
      const ad = al().profil.ad || t('anlar.sen');
      return { ad, alt: t('anlar.sen'), avatar: h('span', { class: 'b-av b-av-ben anl-av', 'aria-hidden': 'true' }, ad.charAt(0).toLocaleUpperCase()) };
    }
    const p = an.profil || testProfiliHam(an.yazar);
    return { ad: p.ad, alt: `${yerel(p.ulke)} · ${t(`diller.${p.anaDil}`)} → ${t(`diller.${p.ogrenilenDil}`)}`, avatar: testAvatar(p, 44), profil: p };
  }

  function yorumSatiri(y) {
    const p = y.yazar === 'ben' ? null : testProfiliHam(y.yazar);
    return h('div', { class: 'anl-yorum' },
      p ? testAvatar(p, 28) : h('span', { class: 'b-av b-av-ben', style: 'width:28px;height:28px;font-size:12px', 'aria-hidden': 'true' }, (al().profil.ad || '?').charAt(0)),
      h('div', { class: 'anl-yorum-ic' },
        h('b', null, p ? p.ad : (al().profil.ad || t('anlar.sen'))), ' ',
        h('span', null, y.metin),
        y.otomatik ? h('span', { class: 'b-kucuk anl-oto' }, ` · ${t('test.otomatikYanit')}`) : null,
      ),
    );
  }

  function kart(an) {
    const y = yazarBilgisi(an);
    const begendi = anBegenildi(an.kimlik);
    const yorumlar = anYorumlari(an.kimlik);
    const duz = anDuzeltmesi(an.kimlik);
    const yorumGirdi = h('input', { class: 'b-girdi anl-yorum-girdi', maxlength: 300, placeholder: t('anlar.yorumYaz'), 'aria-label': t('anlar.yorumYaz') });
    const duzGirdi = h('textarea', { class: 'b-girdi anl-duz-girdi', rows: 3, 'aria-label': t('anlar.duzeltEtiket') });
    duzGirdi.value = an.metin;
    return h('article', { class: 'b-kart anl-kart', 'aria-label': `${y.ad}${an.benim ? '' : ' · ' + t('test.rozet')}` },
      h('header', { class: 'anl-bas' },
        y.profil ? h('button', { type: 'button', class: 'anl-kim-dugme', onClick: () => b.git(`/kisi?k=${y.profil.kimlik}`), 'aria-label': t('anlar.profiliAc', { ad: y.ad }) }, y.avatar) : y.avatar,
        h('div', { class: 'anl-kim' },
          h('div', { class: 'anl-ad' }, h('b', null, y.ad), an.benim ? null : testEtiketi()),
          h('span', { class: 'b-kucuk' }, `${y.alt} · ${goreliZaman(an.zaman)}`),
        ),
      ),
      an.etiket ? h('span', { class: 'b-cip anl-etiket' }, `#${yerel(an.etiket)}`) : null,
      h('p', { class: 'anl-metin' }, an.metin),
      duz ? h('div', { class: 'anl-duzeltme' }, h('span', { class: 'anl-duzeltme-baslik' }, ikon('onay', 16), t('anlar.seninDuzeltmen')), farkCiz(kelimeFarki(duz.kaynak, duz.dogru))) : null,
      h('div', { class: 'anl-eylemler', role: 'group', 'aria-label': t('anlar.eylemler') },
        h('button', { type: 'button', class: 'anl-eylem', 'aria-pressed': String(begendi), onClick: () => { anBegen(an.kimlik); yenile(); } }, ikon('yildiz', 18), t(begendi ? 'anlar.begenildi' : 'anlar.begen')),
        h('button', { type: 'button', class: 'anl-eylem', 'aria-expanded': String(acikYorum.has(an.kimlik)), onClick: () => { if (acikYorum.has(an.kimlik)) acikYorum.delete(an.kimlik); else acikYorum.add(an.kimlik); yenile(); } }, ikon('sohbet', 18), yorumlar.length ? `${t('anlar.yorum')} · ${yorumlar.length}` : t('anlar.yorum')),
        an.benim ? null : h('button', { type: 'button', class: 'anl-eylem', onClick: () => { duzeltilen = duzeltilen === an.kimlik ? null : an.kimlik; yenile(); } }, ikon('onay', 18), t('anlar.duzelt')),
        an.benim ? null : h('button', { type: 'button', class: 'anl-eylem anl-eylem-ikon', 'aria-label': t('test.sikayetEt'), title: t('test.sikayetEt'), onClick: () => sikayet(an, y) }, ikon('kalkan', 18)),
      ),
      duzeltilen === an.kimlik ? h('div', { class: 'anl-duz-alan' },
        h('label', { class: 'b-kucuk' }, t('anlar.duzeltAciklama')),
        duzGirdi,
        h('div', { class: 'b-izgara-2' },
          h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => { const v = duzGirdi.value.trim(); if (!v || v === an.metin) { duyur(t('anlar.degisiklikYok')); return; } anDuzelt(an.kimlik, an.metin, v); duzeltilen = null; duyur(t('anlar.duzeltmeGonderildi')); yenile(); } }, t('anlar.duzeltmeyiGonder')),
          h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => { duzeltilen = null; yenile(); } }, t('genel.vazgec')),
        ),
      ) : null,
      acikYorum.has(an.kimlik) ? h('div', { class: 'anl-yorumlar' },
        yorumlar.map(yorumSatiri),
        h('form', { class: 'anl-yorum-form', onSubmit: (e) => { e.preventDefault(); const v = yorumGirdi.value.trim(); if (!v) return; anYorumEkle(an.kimlik, { yazar: 'ben', metin: v }); yenile(); } },
          yorumGirdi, h('button', { type: 'submit', class: 'b-dugme b-dugme-ana b-dugme-yuvarlak', 'aria-label': t('test.gonder') }, ikon('gonder', 18))),
      ) : null,
    );
  }

  async function sikayet(an, y) {
    const n = await new Promise((coz) => {
      const kapat = (d) => { perde.remove(); coz(d); };
      const perde = h('div', { class: 'b-perde', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'anl-sik' },
        h('div', { class: 'b-pencere' },
          h('h2', { class: 'b-bolum-baslik', id: 'anl-sik' }, t('test.sikayetBaslik', { ad: y.ad })),
          h('div', { class: 'b-yigin' }, ['taciz', 'spam', 'uygunsuz', 'konuDisi'].map((k) => h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => kapat(k) }, t(`test.sikayetNeden.${k}`))),
            h('button', { type: 'button', class: 'b-dugme', onClick: () => kapat(null) }, t('genel.vazgec'))),
        ));
      document.body.append(perde);
      perde.querySelector('button').focus();
    });
    if (!n) return;
    testSikayet(an.yazar, n);
    duyur(t('test.sikayetAlindi'), 4000);
  }

  const paylasGirdi = h('textarea', { class: 'b-girdi anl-paylas-girdi', rows: 2, maxlength: 500, placeholder: t('anlar.paylasOrnek'), 'aria-label': t('anlar.paylasBaslik') });
  function paylas() {
    const v = paylasGirdi.value.trim();
    if (!v) { paylasGirdi.focus(); return; }
    const kimlik = anPaylas(v);
    paylasGirdi.value = '';
    duyur(t('anlar.paylasildi'));
    yenile();
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(() => { anOtomatikYorum(kimlik); yenile(); }, OTOMATIK_YORUM_GECIKMESI);
  }

  function yenile() {
    const liste = testAnlari();
    yerlestir(akis, liste.length ? liste.map(kart) : durumKutusu('bos', t('anlar.akisBos')));
  }

  if (!testModuAcik()) {
    yerlestir(kok,
      ustBaslik({ baslik: t('anlar.baslik'), alt: t('anlar.alt') }),
      h('section', { class: 'b-kart anl-bos' },
        h('span', { class: 'b-ust-etiket' }, t('anlar.yakinda')),
        durumKutusu('bos', t('anlar.aciklama')),
        h('p', { class: 'anl-bilgi' }, t('anlar.guvenlik')),
      ),
      h('section', { class: 'b-kart anl-davet' },
        h('div', { class: 'anl-davet-bas' }, testEtiketi(), h('h2', { class: 'b-bolum-baslik' }, t('test.davetBaslik'))),
        h('p', { class: 'b-kucuk' }, t('test.davetAciklama')),
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => { testModuAyarla(true); duyur(t('test.acildi'), 3000); b.git('/dil-anlari', { degistir: true }); } }, ikon('yildiz', 20), t('test.davetDugme')),
      ),
      altGezinme('/dil-anlari'),
    );
    return null;
  }

  yerlestir(kok,
    ustBaslik({ baslik: t('anlar.baslik'), alt: t('anlar.alt') }),
    h('div', { class: 'anl-uyari' }, testEtiketi(), h('span', null, t('anlar.testUyari'))),
    h('section', { class: 'b-kart anl-paylas', 'aria-labelledby': 'anl-paylas-baslik' },
      h('span', { class: 'b-ust-etiket', id: 'anl-paylas-baslik' }, t('anlar.paylasBaslik')),
      paylasGirdi,
      h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: paylas }, ikon('paylas', 20), t('anlar.paylas')),
    ),
    akis,
    altGezinme('/dil-anlari'),
  );
  yenile();
  return () => clearTimeout(zamanlayici);
}

export default {
  kimlik: 'dil-anlari',
  surum: '0.2.9',
  onek: 'anl',
  semaSurumu: 1,
  cekirdekServisleri: ['metin', 'depo', 'test-modu'],
  ekranlar: { 'dil-anlari': ekran({ baslikAnahtari: 'ekran.dilAnlari', durumlar: DORT_DURUM, ciz }) },
};

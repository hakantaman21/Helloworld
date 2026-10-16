// Dil Anları (HelloTalk "Moments" düzeni): üstte arama + bildirim + yaz, Güncel / Senin için / Başkalarına yardım et /
// Takip sekmeleri, düz akış: dil çifti, takip et, görsel, beğen · yorum · düzelt · paylaş ve satır içi yorum önizlemesi.
// Gerçek topluluk (hesap + moderasyon) açılana dek gerçek gönderi yoktur; dürüst boş durum gösterilir.
// Test modunda TEST rozetli sanal kullanıcıların gönderileri. Beğeni sayıları uydurulmaz (yalnız bu cihazdaki).
import './anlar.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, altGezinme, basBant, afisKaydirici, ustBaslik, durumKutusu, ikon, ikon3d, yerlestir, testEtiketi, testAvatar, goreliZaman, farkCiz, htUst, htIkon, sekmeler, dilCifti, benAvatar } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { kelimeFarki } from '../../cekirdek/dil/fark.js';
import { cumleKayitli, cumleKaydetDegistir } from '../../cekirdek/cumle-defteri.js';
import { destek, soyle } from '../../cekirdek/ses/ses-hatti.js';
import { testModuAcik, testModuAyarla, testAnlari, anBegen, anBegenildi, anYorumlari, anYorumEkle, anDuzeltmesi, anDuzelt, anPaylas, anOtomatikYorum, testProfiliHam, testSikayet, takipte, takipDegistir, eslesme, aktiflik, saatFarki, YAKIN_SAAT_FARKI } from '../../cekirdek/test-modu.js';

const OTOMATIK_YORUM_GECIKMESI = 1500;
const ONIZLEME_YORUM = 2;

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const ben = al().profil;
  const acikYorum = new Set();
  let duzeltilen = null;
  let zamanlayici = null;
  let sekme = 'guncel';
  let arama = '';
  let yaziyor = false;
  const akis = h('div', { class: 'anl-akis', 'aria-live': 'polite' });
  const paylasAlani = h('div');

  const benimAvatar = (boyut) => benAvatar(boyut);

  function yazarBilgisi(an) {
    if (an.benim) return { ad: ben.ad || t('anlar.sen'), avatar: benimAvatar(44), dil: dilCifti(ben.anaDil || 'tr', ben.ogrenilenDil || 'en', ben.seviye) };
    const p = an.profil || testProfiliHam(an.yazar);
    return { ad: p.ad, avatar: testAvatar(p, 44, { cevrimici: aktiflik(p).cevrimici }), profil: p, dil: dilCifti(p.anaDil, p.ogrenilenDil, p.seviye) };
  }

  function yorumAdi(y) {
    if (y.yazar === 'ben') return ben.ad || t('anlar.sen');
    const p = testProfiliHam(y.yazar);
    return p ? p.ad : '?';
  }

  function yorumOnizleme(y) {
    return h('p', { class: 'anl-yorum-satir' }, h('b', null, `${yorumAdi(y)}: `), y.metin, y.otomatik ? h('span', { class: 'anl-oto' }, ` · ${t('test.otomatikYanit')}`) : null);
  }

  async function paylasDis(an) {
    const metin = `${an.metin}\n— ${t('uygulama.ad')}`;
    try {
      if (navigator.share) { await navigator.share({ text: metin }); return; }
      await navigator.clipboard.writeText(metin);
      duyur(t('ht.kopyalandi'));
    } catch { /* kullanıcı vazgeçti */ }
  }

  function kart(an) {
    const y = yazarBilgisi(an);
    const begendi = anBegenildi(an.kimlik);
    const yorumlar = anYorumlari(an.kimlik);
    const duz = anDuzeltmesi(an.kimlik);
    const acik = acikYorum.has(an.kimlik);
    const yorumGirdi = h('input', { class: 'b-girdi anl-yorum-girdi', maxlength: 300, placeholder: t('anlar.yorumYaz'), 'aria-label': t('anlar.yorumYaz') });
    const duzGirdi = h('textarea', { class: 'b-girdi anl-duz-girdi', rows: 3, 'aria-label': t('anlar.duzeltEtiket') });
    duzGirdi.value = an.metin;
    const takipVar = y.profil ? takipte(y.profil.kimlik) : false;
    return h('article', { class: 'anl-kart', 'data-an': an.kimlik, 'aria-label': `${y.ad}${an.benim ? '' : ' · ' + t('test.rozet')}` },
      h('header', { class: 'anl-bas' },
        y.profil ? h('button', { type: 'button', class: 'anl-kim-dugme', onClick: () => b.git(`/kisi?k=${y.profil.kimlik}`), 'aria-label': t('anlar.profiliAc', { ad: y.ad }) }, y.avatar) : y.avatar,
        h('div', { class: 'anl-kim' },
          h('div', { class: 'anl-ad' }, h('b', null, y.ad), an.benim ? null : testEtiketi(), h('span', { class: 'anl-zaman' }, goreliZaman(an.zaman))),
          y.dil,
        ),
        y.profil ? h('button', { type: 'button', class: `anl-takip${takipVar ? ' anl-takip-var' : ''}`, 'aria-pressed': String(takipVar), onClick: () => { const s = takipDegistir(y.profil.kimlik); duyur(s ? t('ht.takipEdildi', { ad: y.ad }) : t('ht.takiptenCikti', { ad: y.ad })); yenile(); } }, takipVar ? t('ht.takiptesin') : t('ht.takipEt')) : null,
        y.profil ? h('button', { type: 'button', class: 'anl-menu', 'aria-label': t('test.sikayetEt'), title: t('test.sikayetEt'), onClick: () => sikayet(an, y) }, ikon('nokta3', 20)) : null,
      ),
      h('p', { class: 'anl-metin' }, an.etiket ? h('span', { class: 'anl-etiket' }, `#${yerel(an.etiket)} `) : null, an.metin),
      an.gorsel ? h('figure', { class: `b-gorsel b-kutu-${an.gorsel.kutu} anl-gorsel` }, ikon3d(an.gorsel.ikon, 64), h('figcaption', { class: 'b-gorsel-yazi' }, yerel(an.gorsel.yazi))) : null,
      duz ? h('div', { class: 'anl-duzeltme' }, h('span', { class: 'anl-duzeltme-baslik' }, ikon('onay', 16), t('anlar.seninDuzeltmen')), farkCiz(kelimeFarki(duz.kaynak, duz.dogru))) : null,
      h('div', { class: 'anl-eylemler', role: 'group', 'aria-label': t('anlar.eylemler') },
        h('button', { type: 'button', class: 'anl-eylem', 'aria-pressed': String(begendi), 'aria-label': t(begendi ? 'anlar.begenildi' : 'anlar.begen'), onClick: () => { anBegen(an.kimlik); yenile(); } }, ikon('begen', 20), begendi ? '1' : ''),
        h('button', { type: 'button', class: 'anl-eylem', 'aria-expanded': String(acik), 'aria-label': t('anlar.yorum'), onClick: () => { if (acik) acikYorum.delete(an.kimlik); else acikYorum.add(an.kimlik); yenile(); } }, ikon('sohbet', 20), yorumlar.length ? String(yorumlar.length) : ''),
        h('span', { class: 'anl-bosluk' }),
        an.benim ? null : h('button', { type: 'button', class: 'anl-eylem anl-eylem-duz', 'aria-pressed': String(duzeltilen === an.kimlik), onClick: () => { duzeltilen = duzeltilen === an.kimlik ? null : an.kimlik; yenile(); } }, ikon('onay', 20), t('anlar.duzelt')),
        destek.sentez ? h('button', { type: 'button', class: 'anl-eylem', 'aria-label': t('defter.dinle'), onClick: () => soyle(an.metin) }, ikon('hoparlor', 20)) : null,
        h('button', { type: 'button', class: 'anl-eylem', 'aria-pressed': String(cumleKayitli(an.metin)), 'aria-label': t('defter.kaydet'), onClick: () => { const e = cumleKaydetDegistir(an.metin, y.ad); duyur(e ? t('defter.kaydedildi') : t('defter.cikarildi'), 1800); yenile(); } }, ikon('yerImi', 20)),
        h('button', { type: 'button', class: 'anl-eylem', 'aria-label': t('ht.paylas'), onClick: () => paylasDis(an) }, ikon('paylas', 20)),
      ),
      duzeltilen === an.kimlik ? h('div', { class: 'anl-duz-alan' },
        h('label', { class: 'b-kucuk' }, t('anlar.duzeltAciklama')),
        duzGirdi,
        h('div', { class: 'b-izgara-2' },
          h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => { const v = duzGirdi.value.trim(); if (!v || v === an.metin) { duyur(t('anlar.degisiklikYok')); return; } anDuzelt(an.kimlik, an.metin, v); duzeltilen = null; duyur(t('anlar.duzeltmeGonderildi')); yenile(); } }, t('anlar.duzeltmeyiGonder')),
          h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => { duzeltilen = null; yenile(); } }, t('genel.vazgec')),
        ),
      ) : null,
      yorumlar.length || acik ? h('div', { class: 'anl-yorumlar' },
        (acik ? yorumlar : yorumlar.slice(0, ONIZLEME_YORUM)).map(yorumOnizleme),
        !acik && yorumlar.length > ONIZLEME_YORUM ? h('button', { type: 'button', class: 'anl-tumu', onClick: () => { acikYorum.add(an.kimlik); yenile(); } }, t('ht.tumYorumlar', { n: yorumlar.length })) : null,
        acik ? h('form', { class: 'anl-yorum-form', onSubmit: (e) => { e.preventDefault(); const v = yorumGirdi.value.trim(); if (!v) return; anYorumEkle(an.kimlik, { yazar: 'ben', metin: v }); yenile(); } },
          yorumGirdi, h('button', { type: 'submit', class: 'b-dugme b-dugme-ana b-dugme-yuvarlak', 'aria-label': t('test.gonder') }, ikon('gonder', 18))) : null,
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
            h('button', { type: 'button', class: 'b-dugme', 'data-vazgec': '', onClick: () => kapat(null) }, t('genel.vazgec'))),
        ));
      document.body.append(perde);
      perde.querySelector('button').focus();
    });
    if (!n) return;
    testSikayet(an.yazar, n);
    duyur(t('test.sikayetAlindi'), 4000);
  }

  const paylasGirdi = h('textarea', { class: 'b-girdi anl-paylas-girdi', rows: 3, maxlength: 500, placeholder: t('anlar.paylasOrnek'), 'aria-label': t('anlar.paylasBaslik') });
  function paylas() {
    const v = paylasGirdi.value.trim();
    if (!v) { paylasGirdi.focus(); return; }
    const kimlik = anPaylas(v);
    paylasGirdi.value = '';
    yaziyor = false;
    paylasCiz();
    duyur(t('anlar.paylasildi'));
    sekme = 'guncel';
    yenile();
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(() => { anOtomatikYorum(kimlik); yenile(); }, OTOMATIK_YORUM_GECIKMESI);
  }
  function paylasCiz() {
    yerlestir(paylasAlani, yaziyor
      ? h('section', { class: 'anl-paylas', 'aria-label': t('anlar.paylasBaslik') },
        paylasGirdi,
        h('div', { class: 'anl-paylas-eylem' },
          h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => { yaziyor = false; paylasCiz(); } }, t('genel.vazgec')),
          h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: paylas }, ikon('paylas', 18), t('anlar.paylas')),
        ))
      : h('button', { type: 'button', class: 'anl-paylas-kapali', onClick: () => { yaziyor = true; paylasCiz(); paylasGirdi.focus(); } },
        benimAvatar(36), h('span', null, t('anlar.paylasOrnek')), ikon('kalem', 18)));
  }

  function suz(liste) {
    let s = liste;
    if (arama) s = s.filter((a) => `${a.metin} ${a.profil ? a.profil.ad : ''}`.toLocaleLowerCase().includes(arama));
    if (sekme === 'senin') s = s.filter((a) => !a.benim).sort((x, y) => eslesme(y.profil).puan - eslesme(x.profil).puan);
    if (sekme === 'yardim') s = s.filter((a) => !a.benim && (a.duzeltilebilir || (ben.anaDil && a.profil.ogrenilenDil === ben.anaDil)));
    if (sekme === 'takip') s = s.filter((a) => a.benim || takipte(a.yazar));
    // v0.12.1 HelloTalk'taki gibi ek süzgeçler (hepsi cihazdaki TEST verisinden çalışır):
    if (sekme === 'yakin') s = s.filter((a) => !a.benim && saatFarki(a.profil) <= YAKIN_SAAT_FARKI);
    if (sekme === 'ogren') s = s.filter((a) => !a.benim && a.profil.anaDil === (ben.ogrenilenDil || 'en'));
    if (sekme === 'sinif') s = s.filter((a) => !a.benim && a.profil.seviye === ben.seviye);
    return s;
  }

  function yenile() {
    const liste = suz(testAnlari());
    const bosMetin = sekme === 'takip' ? t('ht.takipBos') : t('anlar.akisBos');
    yerlestir(akis, liste.length ? liste.map(kart) : durumKutusu('bos', bosMetin));
  }

  if (!testModuAcik()) {
    yerlestir(kok,
      basBant(ustBaslik({ baslik: t('anlar.baslik'), alt: t('anlar.alt'), ikon: 'anlar' })),
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

  const kendiYorumSayisi = testAnlari().filter((a) => a.benim).reduce((n, a) => n + anYorumlari(a.kimlik).length, 0);

  // v0.10.0 Pano (kayan): tanıtım, öneri, en çok paylaşan, en çok etkileşim alan, ipucu.
  // Sayılar bu cihazdaki TEST verisinden hesaplanır (gönderi, yorum ve senin beğenin); uydurulmaz.
  const sekmeyeGec = (id) => { const d = kok.querySelector(`.b-sekme[data-id="${id}"]`); if (d) d.click(); };
  const tumAnlar = testAnlari();
  const digerleri = tumAnlar.filter((a) => !a.benim);
  const yardimSayisi = digerleri.filter((a) => a.duzeltilebilir || (ben.anaDil && a.profil.ogrenilenDil === ben.anaDil)).length;
  const sayac = {};
  // Katkı = gönderi + yorum (yalnız TEST yazarları; senin yorumların sayılmaz).
  digerleri.forEach((a) => { sayac[a.yazar] = (sayac[a.yazar] || 0) + 1; });
  tumAnlar.forEach((a) => anYorumlari(a.kimlik).forEach((y) => { if (y.yazar && y.yazar !== 'ben') sayac[y.yazar] = (sayac[y.yazar] || 0) + 1; }));
  const enCokKimlik = Object.keys(sayac).sort((x, y) => sayac[y] - sayac[x])[0];
  const enCok = enCokKimlik ? testProfiliHam(enCokKimlik) : null;
  const etkilesim = (a) => anYorumlari(a.kimlik).length + (anBegenildi(a.kimlik) ? 1 : 0);
  const hit = digerleri.slice().sort((x, y) => etkilesim(y) - etkilesim(x))[0];
  const kisalt = (m) => (m.length > 60 ? `${m.slice(0, 58)}…` : m);
  const pano = afisKaydirici([
    { ikon: 'kalem', renk: 1, etiket: t('pano.paylasEtiket'), baslik: t('pano.paylasBaslik'), alt: t('pano.paylasAlt'), dugme: t('pano.paylasDugme'), git: () => { yaziyor = true; paylasCiz(); paylasGirdi.focus(); } },
    yardimSayisi ? { test: true, ikon: 'ipucu', renk: 4, etiket: t('pano.yardimEtiket'), baslik: t('pano.yardimBaslik'), alt: t('pano.yardimAlt', { n: yardimSayisi }), dugme: t('pano.yardimDugme'), git: () => sekmeyeGec('yardim') } : null,
    enCok && sayac[enCokKimlik] > 1 ? { test: true, renk: 5, etiket: t('pano.paylasanEtiket'), baslik: t('pano.paylasanBaslik', { ad: enCok.ad, n: sayac[enCokKimlik] }), alt: t('pano.paylasanAlt', { ulke: yerel(enCok.ulke), seviye: enCok.seviye }), gorsel: testAvatar(enCok, 76, { cevrimici: aktiflik(enCok).cevrimici }), git: () => b.git(`/kisi?k=${enCok.kimlik}`) } : null,
    hit && etkilesim(hit) ? { test: true, ikon: 'yildiz', renk: 6, etiket: t('pano.hitEtiket'), baslik: `“${kisalt(hit.metin)}”`, alt: t('pano.hitAlt', { ad: hit.profil.ad, n: anYorumlari(hit.kimlik).length }), dugme: t('pano.hitDugme'), git: () => { sekmeyeGec('guncel'); const k = akis.querySelector(`[data-an="${hit.kimlik}"]`); if (k) k.scrollIntoView({ behavior: 'smooth', block: 'start' }); } } : null,
    { ikon: 'kitap', renk: 3, etiket: t('pano.defterEtiket'), baslik: t('pano.defterBaslik'), alt: t('pano.defterAlt'), dugme: t('pano.defterDugme'), git: () => b.git('/gelisim?sekme=profil') },
  ].filter(Boolean), { etiket: t('pano.anlarEtiket'), pano: true });

  yerlestir(kok,
    basBant(htUst({
      sol: htIkon(ikon3d('hedef', 30), t('ht.hedefim'), () => b.git('/gelisim')),
      orta: h('label', { class: 'b-ht-arama anl-arama' }, ikon('ara', 18),
        h('input', { type: 'search', placeholder: t('ht.ara'), 'aria-label': t('ht.anAra'), onInput: (e) => { arama = e.target.value.trim().toLocaleLowerCase(); yenile(); } })),
      sag: [
        htIkon('zil', t('ht.bildirimler'), () => { sekme = 'takip'; yenile(); duyur(t('ht.bildirimOzet', { n: kendiYorumSayisi })); }, { rozet: kendiYorumSayisi || null }),
        htIkon('kalem', t('anlar.paylasBaslik'), () => { yaziyor = true; paylasCiz(); paylasGirdi.focus(); }),
      ],
    }),
    sekmeler([['guncel', t('ht.guncel')], ['senin', t('ht.seninIcin')], ['yardim', t('ht.yardimEt')], ['takip', t('ht.takipEdilen')], ['ogren', t('ht.ogren')], ['yakin', t('ht.yakinSaat')], ['sinif', t('ht.sinif')]], sekme, (id) => { sekme = id; yenile(); }, { etiket: t('anlar.baslik') })),
    pano,
    h('p', { class: 'anl-uyari' }, testEtiketi(), ' ', t('anlar.testUyari')),
    paylasAlani,
    akis,
    altGezinme('/dil-anlari'),
  );
  paylasCiz();
  yenile();
  return () => clearTimeout(zamanlayici);
}

export default {
  kimlik: 'dil-anlari',
  surum: '0.4.0',
  onek: 'anl',
  semaSurumu: 1,
  cekirdekServisleri: ['metin', 'depo', 'test-modu'],
  ekranlar: { 'dil-anlari': ekran({ baslikAnahtari: 'ekran.dilAnlari', durumlar: DORT_DURUM, ciz }) },
};

// Ayarlar (v0.5.0): sıcak ve sıkı düzen. Üstte profil kartı (misafirse tamamlama şeridi), altında simgeli gruplar;
// her satır solda etiket, sağda denetim. Kontrol kullanıcıda (Anayasa bölüm 3): veriler indirilebilir ve silinebilir.
import './ayarlar.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, ikon3d, ustBaslik, onayIste, yerlestir, dilCifti, logo, kurallarSeridi, benAvatar } from '../../cekirdek/arayuz.js';
import { fotografEkle } from '../../cekirdek/fotograf.js';
import { t, yerel, dilAyarla, ARAYUZ_DILLERI } from '../../cekirdek/metin.js';
import { ILGI_ALANLARI, ILGI_SINIRI } from '../../veri/ilgi-alanlari.js';
import { al, degistir, sifirla, disaAktarMetni } from '../../cekirdek/depo.js';
import { siradaki } from '../../cekirdek/gunluk.js';
import { simdiAra } from '../../cekirdek/zamanlayici.js';
import { SEVIYE_SIRASI } from '../../cekirdek/oneri.js';
import { SURUM } from '../../cekirdek/surum.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { destek } from '../../cekirdek/ses/ses-hatti.js';
import { testModuAcik, testModuAyarla, testVerileriniSil } from '../../cekirdek/test-modu.js';

const DILLER = ['tr', 'en', 'es', 'ar', 'de', 'fr', 'ru', 'pt', 'fa', 'ko', 'ja', 'diger'];

// Test modu bölümü varsayılan gizlidir: sürüm satırına 5 kez dokununca ya da test modu açıkken görünür.
let surumDokunma = 0;

function ayarKaydet(fn, sessiz = false) {
  degistir((v) => fn(v.profil));
  if (!sessiz) duyur(t('ayarlar.kaydedildi'), 1500);
}

// Bölümlü seçim (segmented): küçük haplar, 48px dokunma alanı.
function bolumlu(etiketId, secenekler, aktif, degisti) {
  return h('div', { class: 'ayr-seg', role: 'radiogroup', 'aria-labelledby': etiketId },
    secenekler.map(([deger, metin]) => h('button', {
      type: 'button', class: 'ayr-seg-oge', role: 'radio', 'aria-checked': String(deger === aktif),
      onClick: (e) => {
        for (const d of e.currentTarget.parentElement.children) d.setAttribute('aria-checked', 'false');
        e.currentTarget.setAttribute('aria-checked', 'true');
        degisti(deger);
      },
    }, metin)));
}

// Renk seçici: yuvarlak renk örnekleri (seçim rengi / zemin rengi). Renkler jetonlardan önizlenir.
function renkSecici(etiketId, tur, secenekler, aktif, degisti) {
  return h('div', { class: 'ayr-renkler', role: 'radiogroup', 'aria-labelledby': etiketId },
    secenekler.map((k) => h('button', {
      type: 'button', class: `ayr-renk ayr-renk-${tur}`, role: 'radio', 'aria-checked': String(k === aktif), 'data-renk': k, 'aria-label': t(`ayarlar.renkAd.${k}`), title: t(`ayarlar.renkAd.${k}`),
      onClick: (e) => {
        for (const d of e.currentTarget.parentElement.children) d.setAttribute('aria-checked', 'false');
        e.currentTarget.setAttribute('aria-checked', 'true');
        degisti(k);
      },
    }, h('span', { class: 'ayr-renk-ornek', 'aria-hidden': 'true' }))));
}

let satirSayac = 0;
// Satır: solda etiket (+ isteğe bağlı açıklama), sağda denetim. altta: true ise denetim tam genişlikte alta iner.
function satir(etiket, denetim, { aciklama, altta = false, kimlik } = {}) {
  const id = kimlik || `ayr-s${++satirSayac}`;
  return h('div', { class: `ayr-satir${altta ? ' ayr-satir-altta' : ''}` },
    h('div', { class: 'ayr-satir-metin' },
      h('span', { class: 'ayr-satir-etiket', id }, etiket),
      aciklama ? h('span', { class: 'ayr-satir-aciklama' }, aciklama) : null),
    typeof denetim === 'function' ? denetim(id) : denetim,
  );
}

function anahtar(etiket, acik, degisti, aciklama) {
  const girdi = h('input', { type: 'checkbox', class: 'ayr-anahtar-girdi', checked: acik, onChange: (e) => degisti(e.currentTarget.checked) });
  return h('label', { class: 'ayr-satir ayr-anahtar' },
    h('span', { class: 'ayr-satir-metin' }, h('span', { class: 'ayr-satir-etiket' }, etiket), aciklama ? h('span', { class: 'ayr-satir-aciklama' }, aciklama) : null),
    girdi, h('span', { class: 'ayr-anahtar-iz', 'aria-hidden': 'true' }));
}

function grup(kimlik, ik, baslik, ...satirlar) {
  return h('section', { class: 'ayr-grup', id: `ayr-g-${kimlik}`, 'aria-labelledby': `ayr-g-${kimlik}-b` },
    h('h2', { class: 'ayr-grup-baslik', id: `ayr-g-${kimlik}-b` }, ikon3d(ik, 26), baslik),
    h('div', { class: 'ayr-grup-ic' }, ...satirlar));
}

function ciz(kok, b) {
  kok.classList.add('ayr-ekran');
  let aktifGrup = null;
  const p = al().profil;
  const a = p.ayarlar;

  const adGirdisi = h('input', { id: 'ayr-ad', class: 'ayr-girdi', type: 'text', value: p.ad, autocomplete: 'given-name', maxlength: 40 });
  adGirdisi.addEventListener('change', () => { const ad = adGirdisi.value.trim(); if (ad) ayarKaydet((pr) => { pr.ad = ad; if (pr.misafir && ad !== t('misafir.ad')) pr.misafir = false; }); });
  const saatGirdisi = (anahtarAd) => (id) => {
    const g = h('input', { class: 'ayr-girdi ayr-saat', type: 'time', value: a[anahtarAd], 'aria-labelledby': id });
    g.addEventListener('change', () => { if (g.value) ayarKaydet((pr) => { pr.ayarlar[anahtarAd] = g.value; }); });
    return g;
  };
  const dilSecimi = (alan) => (id) => {
    const sec = h('select', { class: 'ayr-girdi ayr-secim', 'aria-labelledby': id },
      h('option', { value: '' }, t('ayarlar.dilSeciniz')),
      DILLER.map((d) => h('option', { value: d }, t(`diller.${d}`))));
    sec.value = p[alan] || '';
    sec.addEventListener('change', () => ayarKaydet((pr) => { pr[alan] = sec.value || null; }));
    return sec;
  };
  const hedefGirdisi = h('input', { class: 'ayr-girdi', type: 'text', maxlength: 120, value: p.dilHedefi || '', placeholder: t('ayarlar.hedefOrnek'), 'aria-label': t('ayarlar.dilHedefi') });
  hedefGirdisi.addEventListener('change', () => ayarKaydet((pr) => { pr.dilHedefi = hedefGirdisi.value.trim().slice(0, 120); }));
  const tanitimGirdisi = h('textarea', { class: 'ayr-girdi ayr-tanitim', rows: 3, maxlength: 300, placeholder: t('ayarlar.tanitimOrnek'), 'aria-label': t('ayarlar.tanitim') });
  tanitimGirdisi.value = p.tanitimMetni || '';
  tanitimGirdisi.addEventListener('change', () => ayarKaydet((pr) => { pr.tanitimMetni = tanitimGirdisi.value.trim().slice(0, 300); }));

  // İlgi alanları: en çok ILGI_SINIRI; sessiz kayıt (bildirim yığılmasın), sayaç aria-live ile söyler.
  const ilgiSayac = h('span', { class: 'ayr-ilgi-sayac', 'aria-live': 'polite' });
  const ilgiSecici = h('div', { class: 'b-karolar', role: 'group', 'aria-label': t('ilgi.baslik') });
  function ilgiCiz() {
    const secili = al().profil.ilgiler || [];
    ilgiSayac.textContent = t('ilgi.sayac', { n: secili.length, en: ILGI_SINIRI });
    yerlestir(ilgiSecici, ILGI_ALANLARI.map((i) => {
      const var_ = secili.includes(i.kimlik);
      return h('button', { type: 'button', class: 'b-karo', 'aria-pressed': String(var_), onClick: () => {
        const simdiki = al().profil.ilgiler || [];
        if (!var_ && simdiki.length >= ILGI_SINIRI) { duyur(t('ilgi.sinir', { en: ILGI_SINIRI })); return; }
        ayarKaydet((pr) => { pr.ilgiler = var_ ? simdiki.filter((k) => k !== i.kimlik) : [...simdiki, i.kimlik]; }, true);
        ilgiCiz();
      } }, h('span', { class: 'b-karo-simge', 'aria-hidden': 'true' }, i.simge), yerel(i));
    }));
  }
  ilgiCiz();

  const ilgiAcik = b.p.bolum === 'ilgi';
  const seviyeler = SEVIYE_SIRASI.slice(0, 4);

  yerlestir(kok,
    ustBaslik({ baslik: t('ayarlar.baslik'), ikon: 'ayarlar', geri: () => (aktifGrup ? b.geri('/ayarlar') : b.geri('/gelisim')) }),

    h('section', { class: 'ayr-profil' },
      h('button', { type: 'button', class: 'ayr-foto-dugme', 'aria-label': t('foto.degistir'), onClick: async () => { const s = await fotografEkle({ profilYap: true }); if (s === 'eklendi') { duyur(t('foto.eklendi')); ciz(kok, b); } else if (s === 'hata') duyur(t('foto.hata')); } },
        benAvatar(64, 'ayr-profil-av'), h('span', { class: 'ayr-foto-rozet', 'aria-hidden': 'true' }, ikon('kamera', 14))),
      h('div', { class: 'ayr-profil-ic' },
        h('b', { class: 'ayr-profil-ad' }, p.ad || t('misafir.ad')),
        dilCifti(p.anaDil || 'tr', p.ogrenilenDil || 'en', p.seviye),
        h('span', { class: 'ayr-profil-alt' }, `${p.seviye} · ${t(`gelisim.rol.${p.rol || 'ogrenen'}`)}${(p.ilgiler || []).length ? ` · ${t('ayarlar.ilgiSayisi', { n: p.ilgiler.length })}` : ''}`),
      ),
    ),
    p.misafir ? h('div', { class: 'ayr-misafir', role: 'note' },
      ikon('kisi', 20),
      h('span', { class: 'ayr-misafir-metin' }, h('b', null, t('misafir.serit')), h('small', null, t('misafir.seritAlt'))),
      h('button', { type: 'button', class: 'ayr-misafir-dugme', onClick: () => { adGirdisi.focus(); adGirdisi.select(); } }, t('misafir.tamamla')),
    ) : null,

    grup('profil', 'profil', t('ayarlar.grup.profil'),
      satir(t('ayarlar.ad'), () => adGirdisi),
      satir(t('ayarlar.seviye'), (id) => bolumlu(id, seviyeler.map((s) => [s, s]), p.seviye, (s) => ayarKaydet((pr) => { pr.seviye = s; }))),
      satir(t('ayarlar.rol'), (id) => bolumlu(id, ['ogrenen', 'yardimci'].map((r) => [r, t(`gelisim.rol.${r}`)]), p.rol, (r) => ayarKaydet((pr) => { pr.rol = r; })), { altta: true }),
      h('details', { class: 'ayr-acilir' },
        h('summary', { class: 'ayr-acilir-baslik' }, h('span', null, t('ayarlar.tanitim')), h('small', null, p.tanitimMetni ? t('ilgi.duzenle') : t('ilgi.ekle'))),
        tanitimGirdisi,
        h('p', { class: 'ayr-not' }, t('ayarlar.profilGizlilik'))),
      h('details', { class: 'ayr-acilir', id: 'ayr-ilgi', open: ilgiAcik },
        h('summary', { class: 'ayr-acilir-baslik' }, h('span', null, t('ilgi.baslik')), ilgiSayac),
        h('p', { class: 'ayr-not' }, t('ilgi.aciklama')),
        ilgiSecici),
    ),

    grup('dil', 'dil', t('ayarlar.grup.dil'),
      satir(t('ayarlar.arayuzDili'), (id) => bolumlu(id, ARAYUZ_DILLERI.map((d) => [d, d.toUpperCase()]), a.arayuzDili, (d) => { degistir((v) => { v.profil.ayarlar.arayuzDili = d; }); dilAyarla(d); ciz(kok, b); })),
      satir(t('ayarlar.anaDil'), dilSecimi('anaDil')),
      satir(t('ayarlar.ogrenilenDil'), dilSecimi('ogrenilenDil')),
      satir(t('ayarlar.dilHedefi'), hedefGirdisi, { altta: true }),
    ),

    grup('bildirim', 'bildirim', t('ayarlar.grup.bildirim'),
      satir(t('ayarlar.sabah'), saatGirdisi('sabahSaati'), { aciklama: t('ayarlar.sabahAciklama') }),
      satir(t('ayarlar.aksam'), saatGirdisi('aksamSaati'), { aciklama: t('ayarlar.aksamAciklama') }),
      satir(t('ayarlar.deneme'), h('button', { type: 'button', class: 'ayr-kucuk-dugme', onClick: () => { const s = siradaki(); simdiAra(s === 'aksam' ? 'aksam' : 'sabah'); } }, ikon('oynat', 16), t('ayarlar.demoArama'))),
    ),

    grup('koc', 'yz', t('ayarlar.grup.koc'),
      satir(t('ayarlar.duzeltme'), (id) => bolumlu(id, ['az', 'orta', 'cok'].map((k) => [k, t(`ayarlar.duzeltmeSecenek.${k}`)]), a.duzeltmeYogunlugu, (k) => ayarKaydet((pr) => { pr.ayarlar.duzeltmeYogunlugu = k; })), { aciklama: t('ayarlar.duzeltmeAciklama'), altta: true }),
      satir(t('ayarlar.hiz'), (id) => bolumlu(id, ['yavas', 'normal', 'hizli'].map((k) => [k, t(`ayarlar.hizSecenek.${k}`)]), a.kocHizi, (k) => ayarKaydet((pr) => { pr.ayarlar.kocHizi = k; })), { altta: true }),
      anahtar(t('ayarlar.gonderimOneri'), a.gonderimOneri !== false, (v) => ayarKaydet((pr) => { pr.ayarlar.gonderimOneri = v; }), t('ayarlar.gonderimOneriAciklama')),
      destek.tanima ? anahtar(t('ayarlar.yazili'), a.yaziliMod, (v) => ayarKaydet((pr) => { pr.ayarlar.yaziliMod = v; })) : null,
    ),

    grup('gorunum', 'gorunum', t('ayarlar.grup.gorunum'),
      satir(t('ayarlar.tema'), (id) => bolumlu(id, ['sistem', 'acik', 'koyu'].map((k) => [k, t(`ayarlar.temaSecenek.${k}`)]), a.tema, (k) => ayarKaydet((pr) => { pr.ayarlar.tema = k; })), { altta: true }),
      satir(t('ayarlar.gorunum'), (id) => bolumlu(id, ['dengeli', 'kompakt'].map((k) => [k, t(`ayarlar.gorunumSecenek.${k}`)]), a.gorunum || 'dengeli', (k) => ayarKaydet((pr) => { pr.ayarlar.gorunum = k; }))),
      satir(t('ayarlar.yaziBoyutu'), (id) => bolumlu(id, ['normal', 'buyuk'].map((k) => [k, t(`ayarlar.yaziSecenek.${k}`)]), a.yaziBoyutu || 'normal', (k) => ayarKaydet((pr) => { pr.ayarlar.yaziBoyutu = k; }))),
      satir(t('ayarlar.secimRengi'), (id) => renkSecici(id, 'secim', ['altin', 'mavi', 'yesil', 'mercan', 'mor', 'turkuaz'], a.secimRengi || 'altin', (k) => ayarKaydet((pr) => { pr.ayarlar.secimRengi = k; }, true)), { aciklama: t('ayarlar.secimRengiAciklama'), altta: true }),
      satir(t('ayarlar.zeminRengi'), (id) => renkSecici(id, 'zemin', ['varsayilan', 'notr', 'mavi', 'mor', 'yesil'], a.zemin || 'varsayilan', (k) => ayarKaydet((pr) => { pr.ayarlar.zemin = k; }, true)), { aciklama: t('ayarlar.zeminRengiAciklama'), altta: true }),
      satir(t('ayarlar.ortaDugme'), (id) => bolumlu(id, ['pratik', 'arama', 'senaryo', 'telaffuz'].map((k) => [k, t(`ayarlar.ortaSecenek.${k}`)]), a.ortaDugme || 'pratik', (k) => ayarKaydet((pr) => { pr.ayarlar.ortaDugme = k; })), { aciklama: t('ayarlar.ortaDugmeAciklama'), altta: true }),
    ),

    grup('gizlilik', 'kilit', t('ayarlar.grup.gizlilik'),
      h('p', { class: 'ayr-not ayr-not-kutu' }, t('ayarlar.gizlilikMetni')),
      h('button', { type: 'button', class: 'ayr-satir ayr-satir-dugme', onClick: () => {
        const blob = new Blob([disaAktarMetni()], { type: 'application/json' });
        const baglanti = h('a', { href: URL.createObjectURL(blob), download: 'konusma-kocu-verilerim.json' });
        document.body.append(baglanti); baglanti.click(); baglanti.remove();
      } }, h('span', { class: 'ayr-satir-etiket' }, t('ayarlar.disaAktar')), ikon('sag', 18)),
      h('details', { class: 'ayr-acilir' },
        h('summary', { class: 'ayr-acilir-baslik' }, h('span', null, t('kesfet.kurallarBaslik')), ikon('sag', 16)),
        kurallarSeridi()),
      h('button', { type: 'button', class: 'ayr-satir ayr-satir-dugme ayr-tehlike', onClick: async () => {
        const evet = await onayIste({ metin: t('ayarlar.silOnay'), evet: t('ayarlar.silEvet'), hayir: t('genel.vazgec') });
        if (!evet) return;
        sifirla(); duyur(t('ayarlar.silindi')); b.git('/karsilama', { degistir: true });
      } }, h('span', { class: 'ayr-satir-etiket' }, t('ayarlar.sil')), ikon('kapat', 18)),
    ),

    testModuAcik() || surumDokunma >= 5 ? grup('test', 'kupa', t('test.ayarBaslik'),
      h('p', { class: 'ayr-not' }, t('test.ayarAciklama')),
      anahtar(t('test.ayarAnahtar'), testModuAcik(), (v) => { testModuAyarla(v); duyur(t(v ? 'test.acildi' : 'test.kapandi'), 2500); }),
      h('button', { type: 'button', class: 'ayr-satir ayr-satir-dugme', onClick: async () => {
        const evet = await onayIste({ metin: t('test.silOnay'), evet: t('test.silEvet'), hayir: t('genel.vazgec') });
        if (!evet) return;
        testVerileriniSil(); duyur(t('test.silindi'));
      } }, h('span', { class: 'ayr-satir-etiket' }, t('test.sil')), ikon('sag', 18)),
    ) : null,

    h('button', { type: 'button', class: 'ayr-hakkinda', onClick: () => { surumDokunma += 1; if (surumDokunma === 5) { duyur(t('test.gorunur'), 2500); b.git('/ayarlar', { degistir: true }); } } },
      logo(40),
      h('span', { class: 'ayr-hakkinda-ic' }, h('b', null, t('uygulama.ad')), h('small', null, t('ayarlar.surum', { s: SURUM, saglayici: a.saglayici }))),
    ),
  );
  // HelloTalk düzeni: ana sayfada renkli simgeli kategori listesi; dokununca yalnız o grup açılır (az kaydırma).
  const gruplar = [...kok.querySelectorAll('.ayr-grup')];
  const baslikYazi = kok.querySelector('.b-ht-baslik span');
  const ozet = {
    profil: `${p.ad || t('misafir.ad')} · ${p.seviye}`,
    dil: `${(p.anaDil || 'tr').toUpperCase()} → ${(p.ogrenilenDil || 'en').toUpperCase()} · ${(a.arayuzDili || 'tr').toUpperCase()}`,
    bildirim: `${a.sabahSaati} · ${a.aksamSaati}`,
    koc: t(`ayarlar.duzeltmeSecenek.${a.duzeltmeYogunlugu}`),
    gorunum: `${t(`ayarlar.temaSecenek.${a.tema}`)} · ${t(`ayarlar.yaziSecenek.${a.yaziBoyutu || 'normal'}`)}`,
    gizlilik: t('ayarlar.gizlilikOzet'),
    test: testModuAcik() ? t('ayarlar.acik') : t('ayarlar.kapali'),
  };
  const KATEGORILER = [['profil'], ['bildirim', 'gizlilik'], ['koc', 'dil'], ['gorunum'], ['test']];
  const RENK = { profil: 1, bildirim: 4, gizlilik: 3, koc: 5, dil: 2, gorunum: 6, test: 2 };
  const menu = h('nav', { class: 'ayr-menu', 'aria-label': t('ayarlar.baslik') },
    KATEGORILER.map((kume) => {
      const varolan = kume.filter((k) => gruplar.some((g) => g.id === `ayr-g-${k}`));
      if (!varolan.length) return null;
      return h('div', { class: 'ayr-menu-kart' }, varolan.map((k) => {
        const g = gruplar.find((x) => x.id === `ayr-g-${k}`);
        const simge = g.querySelector('.ayr-grup-baslik .b-ikon3d');
        return h('button', { type: 'button', class: 'ayr-menu-satir', onClick: () => b.git(`/ayarlar?grup=${k}`) },
          h('span', { class: `ayr-menu-simge b-kutu-${RENK[k]}` }, simge ? Object.assign(simge.cloneNode(true), { className: 'b-ikon3d ayr-menu-ikon' }) : null),
          h('span', { class: 'ayr-menu-metin' }, h('b', null, g.querySelector('.ayr-grup-baslik').textContent), h('small', null, ozet[k] || '')),
          ikon('sag', 18));
      }));
    }));
  const misafirSerit = kok.querySelector('.ayr-misafir');
  (misafirSerit || kok.querySelector('.ayr-profil')).after(menu);
  function goster(k) {
    aktifGrup = k;
    menu.hidden = Boolean(k);
    kok.querySelector('.ayr-profil').hidden = Boolean(k);
    if (misafirSerit) misafirSerit.hidden = Boolean(k);
    kok.querySelector('.ayr-hakkinda').hidden = Boolean(k);
    gruplar.forEach((g) => { g.hidden = g.id !== `ayr-g-${k}`; });
    if (baslikYazi) baslikYazi.textContent = k ? gruplar.find((g) => g.id === `ayr-g-${k}`).querySelector('.ayr-grup-baslik').textContent : t('ayarlar.baslik');
    window.scrollTo(0, 0);
  }
  goster(ilgiAcik ? 'profil' : (b.p.grup || null));
  if (ilgiAcik) requestAnimationFrame(() => { const hedef = kok.querySelector('#ayr-ilgi'); if (hedef) hedef.scrollIntoView({ block: 'start' }); });
  return null;
}

export default {
  kimlik: 'ayarlar',
  surum: '0.5.0',
  onek: 'ayr',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'zamanlayici'],
  ekranlar: {
    ayarlar: ekran({ baslikAnahtari: 'ekran.ayarlar', durumlar: DORT_DURUM, ciz }),
  },
};

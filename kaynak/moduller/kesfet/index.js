// Bağlan (HelloTalk "Dil Ortakları Bul" düzeni): metin sekmeleri, dil hapları, süzgeç paneli, otomatik eşleşme
// ve el sallama (selam). Hesap ve sunucu olmadan gerçek kişi gösterilmez.
// Test modunda TEST rozetli sanal kullanıcılar listelenir; yaş, çevrimiçi durumu ve rozetler de TEST verisidir.
import { kullanildi } from '../../cekirdek/rehber.js';
import './kesfet.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, ikon3d, altGezinme, basBant, afisKaydirici, durumKutusu, yerlestir, testEtiketi, testAvatar, htUst, htIkon, sekmeler, dilCifti, goreliZaman, kurallarSeridi, aralikKaydirici } from '../../cekirdek/arayuz.js';
import { benDugmesi } from '../../cekirdek/yan-menu.js';
import { kisiEylemleri, basiliTut, yeniKisiOnayi } from '../../cekirdek/kisi-eylemleri.js';
import { arkadasMi, favoriMi, gelenIstekler } from '../../cekirdek/arkadaslik.js';
import { arkadasPaneli } from './arkadaslar.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al, degistir } from '../../cekirdek/depo.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { uyumDuzeyi, saatFarki, YAKIN_SAAT_FARKI, testModuAcik, testModuAyarla, testProfilleri, aktiflik, eslesme, enIyiEslesmeler, selamVer, selamVerildi, selamYaniti, testMesajEkle, ortakIlgiler, testYanitVerir } from '../../cekirdek/test-modu.js';
import { SEVIYE_SIRASI } from '../../cekirdek/oneri.js';
import { ILGI_ALANLARI, ilgiKimligi } from '../../veri/ilgi-alanlari.js';
import { TEST_PROFILLERI } from '../../veri/test-profiller.js';
import { aktiflikMetni, yasRozeti, rozetler } from '../../cekirdek/test-gorunum.js';

const SELAM_YANIT_GECIKMESI = 1500;
const kayitli = { durum: null, suzgec: null };
// v0.14.0: Bağlan seçimi uygulama kapanıp açılınca da hatırlanır (cihazda, ayarlar.kesfetSecimi).
function secimiOku() {
  const k = al().profil.ayarlar.kesfetSecimi;
  if (!k || kayitli.durum) return;
  kayitli.durum = { sekme: k.sekme || 'tum', dil: k.dil || 'hedef', eslesmeSira: -1 };
  const f = bosSuzgec();
  kayitli.suzgec = { ...f, ...k.suzgec, hizli: new Set(((k.suzgec || {}).hizli || []).filter((x) => HIZLI_SUZGECLER.some(([a]) => a === x))), ulkeler: new Set(((k.suzgec || {}).ulkeler || []).map(ulkeAnahtari)), ilgiler: new Set((k.suzgec || {}).ilgiler || []), yas: (k.suzgec || {}).yas || f.yas, seviye: (k.suzgec || {}).seviye || f.seviye };
}
function secimiYaz(d, f) {
  const yeni = { sekme: d.sekme, dil: d.dil, suzgec: { ...f, hizli: [...f.hizli], ulkeler: [...f.ulkeler], ilgiler: [...f.ilgiler] } };
  if (JSON.stringify(yeni) === JSON.stringify(al().profil.ayarlar.kesfetSecimi || null)) return;
  degistir((v) => { v.profil.ayarlar.kesfetSecimi = yeni; });
}
const YAS_MIN = 18;
const YAS_MAX = 60;

async function selamla(p, yenile, b) {
  // v0.18.0: el sallamak da yeni kişiye ilk mesajdır; günlük sınıra tabidir. Çevrimdışı test kişisi yanıt vermez.
  if (!(await yeniKisiOnayi(p, b))) return;
  selamVer(p.kimlik, t('ht.selamMetni'));
  duyur(t('ht.selamGitti', { ad: p.ad }), 3000);
  if (testYanitVerir(p)) setTimeout(() => testMesajEkle(p.kimlik, selamYaniti(p)), SELAM_YANIT_GECIKMESI);
  yenile();
}

// Hızlı süzgeçler (Sık kullanılan sekmesi): her biri tek dokunuşla açılıp kapanır.
const HIZLI_SUZGECLER = [
  // v0.16.0: "Çevrimiçi" ve "Yeni" üst sekmelerde olduğu için burada tekrarlanmaz (aynı iş iki yerde olmasın).
  ['yakin', '🎯'], ['ortakIlgi', '♥'], ['hizli', '⚡'],
  ['karsilikli', '🤝'], ['ciddi', '🎓'], ['saat', '🕒'],
];

function bosSuzgec() {
  return { hizli: new Set(), yas: [YAS_MIN, YAS_MAX], cinsiyet: 'tum', anaDil: 'tum', ogrDil: 'tum', seviye: [0, SEVIYE_SIRASI.length - 1], ulkeler: new Set(), ilgiler: new Set() };
}

function etkinSayisi(f) {
  return f.hizli.size + f.ulkeler.size + f.ilgiler.size
    + (f.yas[0] !== YAS_MIN || f.yas[1] !== YAS_MAX ? 1 : 0)
    + (f.seviye[0] !== 0 || f.seviye[1] !== SEVIYE_SIRASI.length - 1 ? 1 : 0)
    + ['cinsiyet', 'anaDil', 'ogrDil'].filter((k) => f[k] !== 'tum').length;
}

const ulkeAdi = (k) => yerel(k.ulke).split(' · ')[0];
// v0.16.0: ülke süzgeci dilden bağımsız sabit anahtarla saklanır (İngilizce ülke adı); ad yalnız gösterimde çevrilir.
const ulkeKodu = (k) => String((k.ulke && k.ulke.en) || yerel(k.ulke)).split(' · ')[0];
const ulkeGoster = (kod) => { const k = TEST_PROFILLERI.find((p) => ulkeKodu(p) === kod); return k ? ulkeAdi(k) : kod; };
// Eski kayıtlarda (v0.14–0.15) çevrilmiş ad saklanmıştı: herhangi bir dildeki adı anahtara çevir.
const ulkeAnahtari = (ad) => { const k = TEST_PROFILLERI.find((p) => ulkeKodu(p) === ad || Object.values(p.ulke || {}).some((u) => String(u).split(' · ')[0] === ad)); return k ? ulkeKodu(k) : ad; };

function suzgecUygula(liste, f) {
  const ben = al().profil;
  const benimSeviye = SEVIYE_SIRASI.indexOf(ben.seviye);
  return liste.filter((k) => {
    if (f.hizli.has('cevrimici') && !aktiflik(k).cevrimici) return false;
    if (f.hizli.has('yeni') && k.katildiGun > 90) return false;
    if (f.hizli.has('yakin') && Math.abs(SEVIYE_SIRASI.indexOf(k.seviye) - benimSeviye) > 1) return false;
    if (f.hizli.has('ortakIlgi') && !ortakIlgiler(k).length) return false;
    if (f.hizli.has('hizli') && !(k.rozetler || []).includes('hizli')) return false;
    // v0.16.0: karşılıklı = iki yönlü (o senin dilini öğreniyor VE senin öğrendiğin dil onun ana dili), sekmeyle aynı kural.
    if (f.hizli.has('karsilikli') && !(ben.anaDil && k.ogrenilenDil === ben.anaDil && k.anaDil === (ben.ogrenilenDil || 'en'))) return false;
    if (f.hizli.has('ciddi') && !(k.rozetler || []).includes('ciddi')) return false;
    if (f.hizli.has('saat') && saatFarki(k) > YAKIN_SAAT_FARKI) return false;
    if (k.yas < f.yas[0] || (f.yas[1] < YAS_MAX && k.yas > f.yas[1])) return false;
    const sv = SEVIYE_SIRASI.indexOf(k.seviye);
    if (sv < f.seviye[0] || sv > f.seviye[1]) return false;
    if (f.cinsiyet !== 'tum' && k.cinsiyet !== f.cinsiyet) return false;
    if (f.anaDil !== 'tum' && k.anaDil !== f.anaDil) return false;
    if (f.ogrDil !== 'tum' && k.ogrenilenDil !== f.ogrDil) return false;
    if (f.ulkeler.size && !f.ulkeler.has(ulkeKodu(k))) return false;
    if (f.ilgiler.size && !k.ilgi.some((i) => f.ilgiler.has(ilgiKimligi(i)))) return false;
    return true;
  });
}

function suz(liste, d, f) {
  const ben = al().profil;
  const benimSeviye = SEVIYE_SIRASI.indexOf(ben.seviye);
  let sonuc = suzgecUygula(liste, f);
  if (d.dil === 'hedef') sonuc = sonuc.filter((k) => k.anaDil === (ben.ogrenilenDil || 'en'));
  if (d.dil === 'benimDilim') sonuc = sonuc.filter((k) => ben.anaDil && k.ogrenilenDil === ben.anaDil);
  if (d.sekme === 'cevrimici') sonuc = sonuc.filter((k) => aktiflik(k).cevrimici);
  if (d.sekme === 'arkadaslar') sonuc = sonuc.filter((k) => arkadasMi(k.kimlik));
  if (d.sekme === 'yeni') sonuc = sonuc.filter((k) => k.katildiGun <= 90);
  if (d.sekme === 'yakin') sonuc = sonuc.filter((k) => Math.abs(SEVIYE_SIRASI.indexOf(k.seviye) - benimSeviye) <= 1);
  if (d.sekme === 'ciddi') sonuc = sonuc.filter((k) => (k.rozetler || []).includes('ciddi'));
  if (d.sekme === 'saat') sonuc = sonuc.filter((k) => saatFarki(k) <= YAKIN_SAAT_FARKI);
  if (d.sekme === 'kadin' || d.sekme === 'erkek') sonuc = sonuc.filter((k) => k.cinsiyet === (d.sekme === 'kadin' ? 'k' : 'e'));
  if (d.sekme === 'karsilikli') sonuc = sonuc.filter((k) => ben.anaDil && k.ogrenilenDil === ben.anaDil && k.anaDil === (ben.ogrenilenDil || 'en'));
  if (d.sekme === 'uygun') return [...sonuc].sort((a, b) => eslesme(b).puan - eslesme(a).puan);
  return [...sonuc].sort((a, b) => aktiflik(a).dk - aktiflik(b).dk);
}

// İki sekmeli süzgeç penceresi: Sık kullanılan (tek dokunuş karoları) · Detaylı (yaş, cinsiyet, diller, seviye, ülke, ilgi).
// Değişiklikler canlı sayılır ("N kişiyi göster"); Uygula'ya kadar listeye yansımaz, Sıfırla hepsini temizler.
function suzgecPenceresi(mevcut, uygula, say = (f) => suzgecUygula(testProfilleri(), f).length) {
  const f = { ...mevcut, hizli: new Set(mevcut.hizli), yas: [...mevcut.yas], seviye: [...mevcut.seviye], ulkeler: new Set(mevcut.ulkeler), ilgiler: new Set(mevcut.ilgiler) };
  const tum = testProfilleri();
  let sekme = 'sik';
  const ic = h('div', { class: 'b-alt-pencere-ic' });
  const gosterDugmesi = h('button', { type: 'button', class: 'b-dugme b-dugme-ana' });
  const kapat = () => { perde.remove(); document.removeEventListener('keydown', tus); };
  const tus = (e) => { if (e.key === 'Escape') kapat(); };

  const tekli = (anahtar, secenekler, sutun = 4) => h('div', { class: `b-karolar b-karolar-${sutun}` }, secenekler.map(([deger, ad]) =>
    h('button', { type: 'button', class: 'b-karo b-karo-kisa', 'aria-pressed': String(f[anahtar] === deger), onClick: () => { f[anahtar] = deger; ciz(); } }, ad)));
  const coklu = (kume, secenekler, sutun = 3) => h('div', { class: `b-karolar${sutun === 3 ? '' : ` b-karolar-${sutun}`}` }, secenekler.map(([deger, ad, simge]) =>
    h('button', { type: 'button', class: 'b-karo', 'aria-pressed': String(kume.has(deger)), onClick: () => { if (kume.has(deger)) kume.delete(deger); else kume.add(deger); ciz(); } },
      simge ? h('span', { class: 'b-karo-simge', 'aria-hidden': 'true' }, simge) : null, ad)));
  const grupla = (etiket, ...cocuk) => h('section', { class: 'b-platform' }, h('h3', { class: 'b-grup-etiket' }, etiket), ...cocuk);
  // v0.15.0: çok öğeli gruplar (ilgi alanı, ülke) dokununca açılır; kapalıyken seçili sayısı görünür.
  const acikGruplar = new Set();
  const katla = (anahtar, etiket, kume, ...cocuk) => {
    const d = h('details', { class: 'b-platform b-katla', open: acikGruplar.has(anahtar) || null },
      h('summary', { class: 'b-katla-ust' }, h('span', { class: 'b-grup-etiket' }, etiket),
        kume.size ? h('span', { class: 'b-katla-sayi' }, String(kume.size)) : null),
      ...cocuk);
    d.addEventListener('toggle', () => { if (d.open) acikGruplar.add(anahtar); else acikGruplar.delete(anahtar); });
    return d;
  };

  function sayiGuncelle() {
    // v0.13.0: sayı, ana listedeki sekme ve dil haplarıyla AYNI hesaplamadan gelir ("N kişiyi göster" = açılan liste).
    const sayi = say(f);
    yerlestir(gosterDugmesi, t('suzgec.goster', { n: sayi }));
    gosterDugmesi.disabled = sayi === 0;
  }
  function ciz() {
    sayiGuncelle();
    const diller = (alan) => [['tum', t('ht.cins.tum')], ...[...new Set(tum.map((k) => k[alan]))].map((d) => [d, t(`diller.${d}`)])];
    if (sekme === 'sik') {
      yerlestir(ic,
        grupla(t('suzgec.sikBaslik'), coklu(f.hizli, HIZLI_SUZGECLER.map(([k, simge]) => [k, t(`suzgec.hizli.${k}`), simge]))),
        h('section', { class: 'b-platform b-platform-sikisik' }, aralikKaydirici({ min: YAS_MIN, max: YAS_MAX, deger: f.yas, etiket: t('ht.yas'), bicim: (v) => (v === null ? t('suzgec.tumYaslar') : v >= YAS_MAX ? `${YAS_MAX}+` : String(v)), degisti: (d) => { f.yas = d; sayiGuncelle(); } })),
        h('section', { class: 'b-platform b-platform-sikisik' }, h('h3', { class: 'b-grup-etiket' }, t('ht.cinsiyet')), tekli('cinsiyet', [['tum', t('ht.cins.tum')], ['k', t('ht.cins.k')], ['e', t('ht.cins.e')]], 3)),
        h('p', { class: 'b-kucuk' }, t('suzgec.ucretsiz')),
      );
    } else {
      const ulkeler = [...new Map(tum.map((k) => [ulkeKodu(k), [ulkeAdi(k), k.bayrak]])).entries()];
      const ilgiler = ILGI_ALANLARI.filter((i) => tum.some((k) => k.ilgi.some((x) => ilgiKimligi(x) === i.kimlik)));
      yerlestir(ic,
        grupla(t('suzgec.anaDili'), tekli('anaDil', diller('anaDil'), 3)),
        grupla(t('suzgec.ogreniyor'), tekli('ogrDil', diller('ogrenilenDil'), 3)),
        h('section', { class: 'b-platform' }, aralikKaydirici({ min: 0, max: SEVIYE_SIRASI.length - 1, deger: f.seviye, etiket: t('suzgec.seviye'), noktalar: true, bicim: (v) => (v === null ? `${SEVIYE_SIRASI[0]} – ${SEVIYE_SIRASI[SEVIYE_SIRASI.length - 1]}` : SEVIYE_SIRASI[v]), degisti: (d) => { f.seviye = d; sayiGuncelle(); } })),
        katla('ulke', t('suzgec.ulke'), f.ulkeler, coklu(f.ulkeler, ulkeler.map(([kod, [ad, bayrak]]) => [kod, ad, bayrak]))),
        katla('ilgi', t('ilgi.baslik'), f.ilgiler, coklu(f.ilgiler, ilgiler.map((i) => [i.kimlik, yerel(i), i.simge]))),
      );
    }
  }

  const perde = h('div', { class: 'b-alt-pencere-perde', onClick: (e) => { if (e.target === perde) kapat(); } },
    h('div', { class: 'b-alt-pencere', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'kft-sz-baslik' },
      h('div', { class: 'b-alt-pencere-tutamak', 'aria-hidden': 'true' }),
      h('div', { class: 'b-alt-pencere-ust' },
        h('h2', { class: 'b-alt-pencere-baslik', id: 'kft-sz-baslik' }, t('ht.suzgecler')),
        h('button', { type: 'button', class: 'b-ht-ikon b-ht-ikon-saydam', 'aria-label': t('genel.kapat'), onClick: kapat }, ikon('kapat', 20))),
      h('div', { class: 'kft-sz-sekme' }, sekmeler([['sik', t('suzgec.sik')], ['detay', t('suzgec.detay')]], sekme, (id) => { sekme = id; ciz(); }, { tur: 'hap', etiket: t('ht.suzgecler') })),
      ic,
      h('div', { class: 'b-alt-pencere-alt' },
        h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => { Object.assign(f, bosSuzgec()); ciz(); } }, t('suzgec.sifirla')),
        gosterDugmesi),
    ));
  gosterDugmesi.addEventListener('click', () => { uygula(f); kapat(); });
  document.addEventListener('keydown', tus);
  ciz();
  document.body.append(perde);
  perde.querySelector('.b-alt-pencere-ust button').focus();
}

function satir(k, b, yenile) {
  const a = aktiflik(k);
  const selamlandi = selamVerildi(k.kimlik);
  // v0.17.0: basılı tut → kişi eylemleri (arkadaş ekle, favori…).
  return basiliTut(h('div', { class: 'kft-satir' },
    h('button', { type: 'button', class: 'kft-satir-ana', onClick: () => b.git(`/kisi?k=${k.kimlik}`), 'aria-label': `${k.ad} · ${t('test.rozet')} · ${t('test.profiliGor')}` },
      h('span', { class: 'kft-av-sutun' }, testAvatar(k, 60, { cevrimici: a.cevrimici }), a.cevrimici || a.gizli ? null : h('span', { class: 'b-aktiflik kft-aktiflik' }, aktiflikMetni(k))),
      h('span', { class: 'b-liste-ic' },
        h('span', { class: 'b-liste-ust' }, h('b', null, k.ad), yasRozeti(k), testEtiketi(),
          favoriMi(k.kimlik) ? h('span', { class: 'kft-isaret', 'aria-label': t('arkadas.favori') }, ikon('yildiz', 14)) : null,
          arkadasMi(k.kimlik) ? h('span', { class: 'b-etiket-hap b-etiket-hap-iyi kft-ark-hap' }, t('arkadas.arkadas')) : null),
        dilCifti(k.anaDil, k.ogrenilenDil, k.seviye),
        h('span', { class: 'kft-tanitim b-iki-satir' }, yerel(k.tanitim)),
        h('span', { class: 'b-etiketler' },
          ortakIlgiler(k).slice(0, 2).map((i) => h('span', { class: 'b-etiket-hap b-etiket-hap-iyi' }, `♥ ${yerel(i)}`)),
          rozetler(k)),
      ),
    ),
    h('button', { type: 'button', class: `kft-el${selamlandi ? ' kft-el-tamam' : ''}`, 'aria-label': selamlandi ? t('ht.mesajGonder', { ad: k.ad }) : t('ht.selamVer', { ad: k.ad }), title: selamlandi ? t('test.mesajYaz') : t('ht.selam'),
      onClick: () => (selamlandi ? b.git(`/mesaj?k=${k.kimlik}`) : selamla(k, yenile, b)) }, ikon(selamlandi ? 'sohbet' : 'el', 22)),
  ), () => kisiEylemleri(k, { b, yenile }));
}

function eslesmeKarti(sonuc, b, { sonraki, kapat, yenile }) {
  const p = sonuc.profil;
  return h('section', { class: 'b-kart kft-eslesme', 'aria-labelledby': 'kft-eslesme-baslik' },
    h('div', { class: 'kft-eslesme-ust' },
      ikon3d('seri', 28),
      h('h2', { class: 'b-bolum-baslik kft-eslesme-baslik', id: 'kft-eslesme-baslik' }, t('ht.eslesmeBaslik')),
      h('button', { type: 'button', class: 'b-ht-ikon kft-kapat', 'aria-label': t('genel.kapat'), onClick: kapat }, ikon('kapat', 18)),
    ),
    h('div', { class: 'kft-eslesme-kisi' },
      testAvatar(p, 64, { cevrimici: aktiflik(p).cevrimici }),
      h('div', { class: 'b-liste-ic' },
        h('span', { class: 'b-liste-ust' }, h('b', null, p.ad), yasRozeti(p), testEtiketi()),
        dilCifti(p.anaDil, p.ogrenilenDil, p.seviye),
        h('span', { class: 'b-kucuk' }, [yerel(p.ulke), aktiflikMetni(p)].filter(Boolean).join(' · ')),
      ),
      h('span', { class: 'kft-puan', style: `--kft-puan:${sonuc.puan}%`, 'aria-label': t(`ht.uyumDuzey.${uyumDuzeyi(sonuc.puan)}`) }, h('b', { class: 'kft-puan-duzey' }, t(`ht.uyumDuzey.${uyumDuzeyi(sonuc.puan)}`))),
    ),
    h('ul', { class: 'kft-nedenler' }, sonuc.nedenler.map((n) => h('li', null, ikon('onay', 14), t(`ht.neden.${n}`, { dil: t(`diller.${n === 'karsilikli' ? p.ogrenilenDil : p.anaDil}`), ortak: sonuc.ortak.map((i) => yerel(i)).join(', ') })))),
    h('div', { class: 'kft-eslesme-eylem' },
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve kft-eylem-dugme', onClick: sonraki }, t('ht.sonraki')),
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve kft-eylem-dugme', onClick: () => b.git(`/kisi?k=${p.kimlik}`) }, t('test.profiliGor')),
      h('button', { type: 'button', class: 'b-dugme b-dugme-ana kft-eslesme-selam kft-eylem-dugme', onClick: async () => { if (!selamVerildi(p.kimlik)) await selamla(p, yenile, b); if (selamVerildi(p.kimlik)) b.git(`/mesaj?k=${p.kimlik}`); } }, ikon('el', 18), t('ht.selam')),
    ),
    h('p', { class: 'b-kucuk' }, t('ht.eslesmeAciklama')),
  );
}

function testsizCiz(kok, b) {
  yerlestir(kok,
    basBant(htUst({ baslik: t('ht.ortakBul') })),
    afisKaydirici([
      { ikon: 'baglanti', renk: 4, etiket: t('pano.nasilEtiket'), baslik: t('pano.nasilBaslik'), alt: t('pano.nasilAlt') },
      { ikon: 'kilit', renk: 2, etiket: t('pano.guvenEtiket'), baslik: t('pano.guvenBaslik'), alt: t('pano.guvenAlt') },
    ], { etiket: t('pano.kesfetEtiket'), pano: true }),
    h('section', { class: 'b-kart kft-hero', 'aria-labelledby': 'kft-giris' },
      h('span', { class: 'b-ust-etiket' }, t('kesfet.heroEtiket')),
      h('h2', { class: 'b-bolum-baslik', id: 'kft-giris' }, t('kesfet.heroBaslik')),
      h('p', { class: 'b-kucuk kft-hero-alt' }, t('kesfet.heroAlt')),
      durumKutusu('bos', t('kesfet.partnerBos')),
    ),
    h('section', { class: 'b-kart kft-davet' },
      h('div', { class: 'kft-davet-bas' }, testEtiketi(), h('h2', { class: 'b-bolum-baslik' }, t('test.davetBaslik'))),
      h('p', { class: 'b-kucuk' }, t('test.davetAciklama')),
      h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => { testModuAyarla(true); duyur(t('test.acildi'), 3000); b.git('/kesfet', { degistir: true }); } }, ikon('kisi', 20), t('test.davetDugme')),
    ),
    kurallarSeridi(),
    altGezinme('/kesfet'),
  );
}

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  if (!testModuAcik()) { testsizCiz(kok, b); return null; }

  const ben = al().profil;
  // v0.13.0: sekme, dil hapı ve süzgeç ekran yeniden kurulunca (profile girip geri dönünce) korunur.
  secimiOku();
  const durum = kayitli.durum || { sekme: 'tum', dil: 'hedef', eslesmeSira: -1 };
  durum.eslesmeSira = -1;
  // v0.14.0: üst sekmeler 4'e indi (Tümü · Sana uygun · Çevrimiçi · Yeni); diğer ölçütler süzgeç penceresinde.
  // v0.19.0: "Arkadaşlar" sekmesi de geçerli (önceden profilden dönünce Tümü'ne sıfırlanıyordu); adresle de açılır.
  const SEKMELER = ['tum', 'uygun', 'cevrimici', 'yeni', 'arkadaslar'];
  if (SEKMELER.includes(b.p.sekme)) durum.sekme = b.p.sekme;
  if (!SEKMELER.includes(durum.sekme)) durum.sekme = 'tum';
  let suzgec = kayitli.suzgec || bosSuzgec();
  const liste = h('div', { class: 'b-liste kft-liste', 'aria-live': 'polite' });
  const eslesmeAlani = h('div');
  const etkinAlani = h('div');
  let suzgecDugmesi;

  function suzgecRozeti() {
    const n = etkinSayisi(suzgec);
    yerlestir(suzgecDugmesi, ikon('suzgec', 22), n ? h('span', { class: 'b-ht-rozet' }, String(n)) : null);
    // v0.14.0: etkin süzgeçler adlarıyla, tek tek kaldırılabilir haplar olarak görünür.
    const haplar = [];
    const ekle = (ad, kaldir) => haplar.push(h('button', { type: 'button', class: 'kft-etkin-hap', 'aria-label': `${ad} — ${t('suzgec.kaldir')}`, onClick: () => { kaldir(); yenile(); } }, ad, ' ×'));
    suzgec.hizli.forEach((k) => ekle(t(`suzgec.hizli.${k}`), () => suzgec.hizli.delete(k)));
    if (suzgec.cinsiyet !== 'tum') ekle(t(`ht.cins.${suzgec.cinsiyet}`), () => { suzgec.cinsiyet = 'tum'; });
    if (suzgec.anaDil !== 'tum') ekle(`${t('suzgec.anaDili')}: ${t(`diller.${suzgec.anaDil}`)}`, () => { suzgec.anaDil = 'tum'; });
    if (suzgec.ogrDil !== 'tum') ekle(`${t('suzgec.ogreniyor')}: ${t(`diller.${suzgec.ogrDil}`)}`, () => { suzgec.ogrDil = 'tum'; });
    if (suzgec.yas[0] !== YAS_MIN || suzgec.yas[1] !== YAS_MAX) ekle(`${suzgec.yas[0]}–${suzgec.yas[1] >= YAS_MAX ? `${YAS_MAX}+` : suzgec.yas[1]}`, () => { suzgec.yas = [YAS_MIN, YAS_MAX]; });
    if (suzgec.seviye[0] !== 0 || suzgec.seviye[1] !== SEVIYE_SIRASI.length - 1) ekle(`${SEVIYE_SIRASI[suzgec.seviye[0]]}–${SEVIYE_SIRASI[suzgec.seviye[1]]}`, () => { suzgec.seviye = [0, SEVIYE_SIRASI.length - 1]; });
    suzgec.ulkeler.forEach((u) => ekle(ulkeGoster(u), () => suzgec.ulkeler.delete(u)));
    suzgec.ilgiler.forEach((i) => ekle(yerel(ILGI_ALANLARI.find((x) => x.kimlik === i) || { tr: i, en: i }), () => suzgec.ilgiler.delete(i)));
    yerlestir(etkinAlani, n ? h('div', { class: 'kft-etkin' },
      h('div', { class: 'kft-etkin-haplar' }, haplar),
      h('button', { type: 'button', class: 'kft-etkin-temizle', onClick: () => { suzgec = bosSuzgec(); yenile(); } }, t('suzgec.temizle'))) : null);
  }

  function eslesmeCiz() {
    if (durum.eslesmeSira < 0) { yerlestir(eslesmeAlani); return; }
    const sirali = enIyiEslesmeler();
    if (!sirali.length) { yerlestir(eslesmeAlani, durumKutusu('bos', t('test.hepsiEngelli'))); return; }
    const sonuc = sirali[durum.eslesmeSira % sirali.length];
    yerlestir(eslesmeAlani, eslesmeKarti(sonuc, b, {
      sonraki: () => { durum.eslesmeSira += 1; eslesmeCiz(); },
      kapat: () => { durum.eslesmeSira = -1; eslesmeCiz(); },
      yenile,
    }));
  }

  function yenile() {
    kayitli.durum = durum; kayitli.suzgec = suzgec;
    secimiYaz(durum, suzgec);
    suzgecRozeti();
    if (durum.sekme === 'arkadaslar') { yerlestir(liste, arkadasPaneli(b, yenile, (k) => satir(k, b, yenile))); return; }
    const kisiler = suz(testProfilleri(), durum, suzgec);
    const temizle = () => { durum.sekme = 'tum'; durum.dil = 'tum'; kayitli.durum = durum; kayitli.suzgec = bosSuzgec(); b.git('/kesfet', { degistir: true }); };
    yerlestir(liste, kisiler.length ? kisiler.map((k) => satir(k, b, yenile)) : durumKutusu('bos', testProfilleri().length ? t('kesfet.suzgecBos') : t('test.hepsiEngelli'), testProfilleri().length ? { metin: t('kesfet.suzgecGevset'), fn: temizle } : undefined));
  }

  suzgecDugmesi = htIkon('suzgec', t('ht.suzgecler'), () => suzgecPenceresi(suzgec, (yeni) => { suzgec = yeni; yenile(); }, (f) => suz(testProfilleri(), durum, f).length));

  // v0.10.0 Bilgi panosu (kayan): en iyi eşleşme, şu an çevrimiçi sayısı, ilgi ipucu, tanışma ve güvenlik.
  // Sayılar ve eşleşme bu cihazdaki TEST verisinden hesaplanır; uydurulmaz.
  const sekmeyeGec = (id) => { const d = kok.querySelector(`.b-sekme[data-id="${id}"]`); if (d) { d.click(); d.scrollIntoView({ block: 'nearest', inline: 'center' }); } };
  const enIyi = enIyiEslesmeler()[0];
  const cevrimiciSayisi = testProfilleri().filter((p) => aktiflik(p).cevrimici).length;
  const ilgiVar = (ben.ilgiler || []).length > 0;
  const pano = afisKaydirici([
    enIyi ? { test: true, renk: 5, etiket: t('pano.eslesmeEtiket'), baslik: t('pano.eslesmeBaslik', { ad: enIyi.profil.ad, duzey: t(`ht.uyumDuzey.${uyumDuzeyi(enIyi.puan)}`) }), alt: `${yerel(enIyi.profil.ulke)} · ${enIyi.profil.seviye}`, dugme: t('pano.eslesmeDugme'), gorsel: testAvatar(enIyi.profil, 76, { cevrimici: aktiflik(enIyi.profil).cevrimici }), git: () => b.git(`/kisi?k=${enIyi.profil.kimlik}`) } : null,
    cevrimiciSayisi ? { test: true, ikon: 'baglanti', renk: 4, etiket: t('pano.cevrimiciEtiket'), baslik: t('pano.cevrimiciBaslik', { n: cevrimiciSayisi }), alt: t('pano.cevrimiciAlt'), dugme: t('pano.cevrimiciDugme'), git: () => sekmeyeGec('cevrimici') } : null,
    { ikon: 'hedef', renk: 1, etiket: t('pano.ilgiEtiket'), baslik: t('pano.ilgiBaslik'), alt: ilgiVar ? t('pano.ilgiVarAlt') : t('pano.ilgiAlt'), dugme: ilgiVar ? t('pano.ilgiVarDugme') : t('pano.ilgiDugme'), git: () => (ilgiVar ? sekmeyeGec('uygun') : b.git('/ayarlar?bolum=ilgi')) },
    { ikon: 'mektup', renk: 3, etiket: t('pano.selamEtiket'), baslik: t('pano.selamBaslik'), alt: t('pano.selamAlt'), git: () => sekmeyeGec('uygun') },
    { ikon: 'kilit', renk: 2, etiket: t('pano.guvenEtiket'), baslik: t('pano.guvenBaslik'), alt: t('pano.guvenAlt'), dugme: t('pano.guvenDugme'), git: () => { const k = kok.querySelector('.b-kurallar'); if (k) k.scrollIntoView({ behavior: 'smooth', block: 'center' }); } },
  ].filter(Boolean), { etiket: t('pano.kesfetEtiket'), pano: true });

  yerlestir(kok,
    basBant(htUst({
      // v0.16.0: solda profil fotoğrafı (yan menü); otomatik eşleşme düğmesi sağa, süzgecin yanına taşındı.
      sol: benDugmesi(b),
      baslik: t('ht.ortakBul'),
      sag: [htIkon(ikon3d('seri', 30), t('ht.eslesmeBaslik'), () => { durum.eslesmeSira = durum.eslesmeSira < 0 ? 0 : -1; eslesmeCiz(); if (durum.eslesmeSira >= 0) eslesmeAlani.scrollIntoView({ block: 'nearest' }); }), suzgecDugmesi],
    }),
    sekmeler([['tum', t('kesfet.suzgec.tum')], ['uygun', t('ht.sanaUygun')], ['cevrimici', t('ht.cevrimici')], ['yeni', t('ht.yeni')], ['arkadaslar', gelenIstekler().length ? `${t('arkadas.arkadaslar')} · ${gelenIstekler().length}` : t('arkadas.arkadaslar')]], durum.sekme, (id) => { durum.sekme = id; kullanildi(`kesfet:${id}`); yenile(); }, { etiket: t('kesfet.filtreBaslik') })),
    pano,
    sekmeler([
      ['hedef', t(`diller.${ben.ogrenilenDil || 'en'}`)],
      ['benimDilim', t('ht.dilimiOgrenen', { dil: t(`diller.${ben.anaDil || 'tr'}`) })],
      ['tum', t('ht.tumDiller')],
    ], durum.dil, (id) => { durum.dil = id; yenile(); }, { tur: 'hap', etiket: t('ht.dil') }),
    etkinAlani,
    durum.eslesmeSira < 0 ? h('button', { type: 'button', class: 'kft-eslesme-serit', onClick: () => { durum.eslesmeSira = 0; eslesmeCiz(); } },
      ikon3d('seri', 26), h('span', null, h('b', null, t('ht.eslesmeBaslik')), h('small', null, t('ht.eslesmeSerit'))), ikon('sag', 18)) : null,
    eslesmeAlani,
    (ben.ilgiler || []).length ? null : h('button', { type: 'button', class: 'kft-ilgi-davet', onClick: () => b.git('/ayarlar?bolum=ilgi') }, '♥ ', t('ilgi.davet'), ikon('sag', 16)),
    h('p', { class: 'kft-uyari' }, testEtiketi(), ' ', t('ht.testNotu')),
    liste,
    kurallarSeridi(),
    altGezinme('/kesfet'),
  );
  yenile();
  if (b.p.eslesme) { durum.eslesmeSira = 0; eslesmeCiz(); }
  return null;
}

export default {
  kimlik: 'kesfet',
  surum: '0.7.0',
  onek: 'kft',
  semaSurumu: 1,
  cekirdekServisleri: ['metin', 'depo', 'test-modu'],
  ekranlar: {
    kesfet: ekran({ baslikAnahtari: 'ekran.kesfet', durumlar: DORT_DURUM, ciz }),
  },
};

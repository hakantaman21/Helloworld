// Bugün: günün döngüsü, sıradaki adım (tabela), Hata Hafızası kısayolu ve tek dokunuşla "Konuş".
import { kutuDugmesi } from '../../cekirdek/rehber-arayuz.js';
import './bugun.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, yerlestir, yzEtiketi, ikon3d, htUst, testAvatar, sekmeler, testEtiketi, enUsteKaydir, ustBaslik } from '../../cekirdek/arayuz.js';
import { benDugmesi } from '../../cekirdek/yan-menu.js';
import { testModuAcik, testModuAyarla, testProfilleri, aktiflik } from '../../cekirdek/test-modu.js';
import tumSenaryolar from '../../veri/senaryolar/index.js';
import { t, yerel, aktifDil } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { gunKaydi, siradaki, seriHesapla, bugunkuSenaryo } from '../../cekirdek/gunluk.js';
import { vadesiGelenler } from '../../cekirdek/hafiza.js';
import { yarimKalan } from '../../cekirdek/gorusme-sonucu.js';
import { gunBolumu } from '../../cekirdek/zaman.js';
import { simdiAra } from '../../cekirdek/zamanlayici.js';
import { oneriSenaryo, SEVIYE_SIRASI } from '../../cekirdek/oneri.js';
import alanlar from '../../veri/alanlar.js';
import { kareKart, genisKart, senaryoIsareti, raporAc, ALAN_IKON } from '../../cekirdek/senaryo-kart.js';
import { istatistik } from '../../cekirdek/senaryo-istatistik.js';
import { basiliTut } from '../../cekirdek/kisi-eylemleri.js';

// v0.21.0 Konu odaları seçimi ekranlar arasında korunur: tam sayfadan geri dönünce aynı kategori, alta açılmış
// kategoriler ve her şeridin yatay kaydırma konumu yerinde durur.
const odaDurumu = { alan: 'tum', acik: new Set(), kaydirma: {} };

function alanAdi(kimlik) {
  const alan = alanlar.find((a) => a.kimlik === kimlik);
  return alan ? t(alan.metin) : '';
}

// v0.24.0 Sade Pratik: günün planı tek kartta, sayfanın en üstünde. Sıradaki adım tek baskın eylemdir ("Şimdi başla");
// üç adım (sabah · senaryo · akşam) kartın içinde küçük adımlar olarak durur, her biri ayrıca başlatılabilir.
// Yarım kalan konuşma varsa kartın asıl eylemi odur. Eskiden bu bilgi sayfanın en altındaki "Günün döngüsü"ndeydi.
function planKarti({ v, gun, sira, oneri, vadesi, yarim, baslat, senaryoyaGit, git }) {
  const ayar = v.profil.ayarlar;
  const ADIMLAR = ['sabah', 'senaryo', 'aksam'];
  const tamamSayisi = ADIMLAR.filter((a) => gun[a]).length;
  let baslik; let alt; let eylem; let dugme = t('bugun.plan.basla');
  if (yarim) { baslik = t('bugun.devamBaslik'); alt = t('bugun.devamAlt', { baslik: yarim.baslik }); eylem = () => git(`/gorusme?${yarim.sorgu}&devam=1`); dugme = t('bugun.plan.devam'); }
  else if (sira === 'sabah') { baslik = t('bugun.sabahBaslik'); alt = t('bugun.bekliyor', { saat: ayar.sabahSaati }); eylem = () => baslat('sabah'); }
  else if (sira === 'senaryo') { baslik = yerel(oneri.baslik); alt = t('bugun.senaryoAlt', { alan: alanAdi(oneri.alan) }); eylem = senaryoyaGit; }
  else if (sira === 'aksam') { baslik = t('bugun.aksamBaslik'); alt = t('bugun.aksamAlt', { saat: ayar.aksamSaati, n: Math.min(vadesi.length, 3) }); eylem = () => baslat('aksam'); }
  else { baslik = t('bugun.plan.bittiBaslik'); alt = t('bugun.siradaMetin.tamam'); eylem = senaryoyaGit; dugme = t('bugun.plan.serbest'); }
  const durumu = (a) => (gun[a] ? 'tamam' : !yarim && sira === a ? 'siradaki' : 'bekliyor');
  return h('section', { class: 'bgn-plan', 'aria-labelledby': 'bgn-plan-baslik' },
    h('p', { class: 'bgn-plan-selam' },
      h('b', null, t(`bugun.selam.${gunBolumu()}`, { ad: v.profil.ad })), ' · ',
      new Date().toLocaleDateString(aktifDil() === 'tr' ? 'tr-TR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
      ' · ', t('bugun.seviye', { s: v.profil.seviye })),
    h('div', { class: 'bgn-plan-ust' },
      h('span', { class: 'bgn-plan-etiket' }, yzEtiketi(), t('bugun.plan.baslik')),
      h('span', { class: 'bgn-plan-sayac' }, t('bugun.plan.ilerleme', { n: tamamSayisi }))),
    h('h2', { class: 'bgn-plan-baslik', id: 'bgn-plan-baslik' }, baslik),
    h('p', { class: 'bgn-plan-alt' }, alt),
    h('div', { class: 'bgn-plan-adimlar', role: 'list' }, ADIMLAR.map((a, i) => h('button', {
      type: 'button', role: 'listitem', class: 'bgn-plan-adim', 'data-durum': durumu(a),
      'aria-label': `${t(`bugun.plan.adim.${a}`)} · ${t(`bugun.plan.durum.${durumu(a)}`)}`,
      onClick: () => (a === 'senaryo' ? senaryoyaGit() : baslat(a)),
    }, h('span', { class: 'bgn-plan-adim-isaret', 'aria-hidden': 'true' }, gun[a] ? ikon('onay', 14, 3) : String(i + 1)), t(`bugun.plan.adim.${a}`)))),
    h('button', { type: 'button', class: 'b-dugme b-dugme-ana bgn-plan-dugme', onClick: eylem }, ikon('oynat', 18, 2.5), dugme),
  );
}

let pratikSekme = 'ai';

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const v = al();
  const ayar = v.profil.ayarlar;
  const gun = gunKaydi();
  const sira = siradaki();
  const oneri = oneriSenaryo().senaryo;
  const vadesi = vadesiGelenler();
  const yarim = yarimKalan();
  const seri = seriHesapla();

  const senaryoyaGit = () => b.git(`/gorusme?tur=senaryo&id=${oneri.kimlik}`);
  const baslat = (tur) => {
    if (tur === 'senaryo') senaryoyaGit();
    else simdiAra(tur);
  };

  // Konu odaları (HelloTalk "Ses" odalarından esinli): her oda bir senaryoya bağlanır; katılınca yapay zekâ koçla konuşulur.
  // Test modunda ilgilenen TEST kullanıcılarının avatarları görünür; gerçek katılımcı sayısı uydurulmaz.
  const testler = testModuAcik() ? testProfilleri() : [];
  // v0.12.0: konu odaları tüm senaryolardan üretilir; yaşam alanına göre süzülür (Günlük, Seyahat, İş, Sağlık, Teknoloji ve YZ…).
  const ODALAR = tumSenaryolar.map((s, i) => ({ id: s.kimlik, alan: s.alan, seviye: s.seviye, baslik: yerel(s.baslik), renk: (i % 6) + 1 }));
  // v0.21.0: "Tümü"nde her kategori bir yatay şerit (ekranda iki kare kart; kaydırarak seç). "Genişlet":
  //   Tümü seçiliyken → kategori tam sayfa açılır (/odalar?alan=…), geniş sohbet kartlarıyla;
  //   tek kategori seçiliyken → senaryolar şeridin yerine alta geniş kartlar olarak açılır ("Daralt" ile kapanır).
  const seviyeUzakligi = (sn) => Math.abs(SEVIYE_SIRASI.indexOf(sn.seviye) - Math.max(0, SEVIYE_SIRASI.indexOf(v.profil.seviye)));
  const alandakiler = (k) => tumSenaryolar.filter((sn) => sn.alan === k).sort((x, y) => seviyeUzakligi(x) - seviyeUzakligi(y) || SEVIYE_SIRASI.indexOf(x.seviye) - SEVIYE_SIRASI.indexOf(y.seviye));
  const ODA_ALANLARI = alanlar.filter((a) => tumSenaryolar.some((sn) => sn.alan === a.kimlik));
  const odaListe = h('div', { class: 'bgn-raflar' });
  const raf = (a, ri) => {
    const liste = alandakiler(a.kimlik);
    const tum = odaDurumu.alan === 'tum';
    const acik = !tum && odaDurumu.acik.has(a.kimlik);
    const denenen = liste.filter((sn) => istatistik(sn.kimlik).durum).length;
    const serit = h('div', { class: 'bgn-serit', role: 'list', 'aria-label': t(a.metin), onScroll: (e) => { odaDurumu.kaydirma[a.kimlik] = e.currentTarget.scrollLeft; } },
      liste.map((sn, i) => h('div', { class: 'bgn-serit-oge', role: 'listitem' }, kareKart(sn, { git: b.git, renk: ((ri + i) % 6) + 1 }))));
    if (odaDurumu.kaydirma[a.kimlik]) requestAnimationFrame(() => { serit.scrollLeft = odaDurumu.kaydirma[a.kimlik]; });
    return h('section', { class: 'bgn-raf', 'aria-labelledby': `bgn-raf-${a.kimlik}` },
      h('div', { class: 'bgn-raf-ust' },
        h('h3', { id: `bgn-raf-${a.kimlik}` }, t(a.metin)),
        h('small', null, t('snk.rafOzet', { n: liste.length, y: denenen })),
        h('button', { type: 'button', class: 'bgn-genislet', 'aria-expanded': tum ? null : String(acik), onClick: () => {
          if (tum) { b.git(`/odalar?alan=${a.kimlik}`); return; }
          if (acik) odaDurumu.acik.delete(a.kimlik); else odaDurumu.acik.add(a.kimlik);
          odaListeCiz();
        } }, tum || !acik ? t('snk.genislet') : t('snk.daralt'), ikon(tum ? 'sag' : acik ? 'yukari' : 'asagi', 16))),
      acik ? h('div', { class: 'bgn-genis-liste' }, liste.map((sn) => genisKart(sn, { git: b.git }))) : serit);
  };
  const odaListeCiz = () => yerlestir(odaListe,
    (odaDurumu.alan === 'tum' ? ODA_ALANLARI : ODA_ALANLARI.filter((a) => a.kimlik === odaDurumu.alan)).map(raf),
    h('p', { class: 'b-kucuk' }, t('snk.ipucuBasili')));
  odaListeCiz();
  // Üç sekme (HelloTalk Ses · Canlı · Öğren karşılığı): AI sohbet · Gerçek sohbet · Öğren.
  const pratikSekmeleri = sekmeler([['ai', t('pratik.sekme.ai')], ['gercek', t('pratik.sekme.gercek')], ['ogren', t('pratik.sekme.ogren')]], pratikSekme, (id) => { pratikSekme = id; pratikSekmeGoster(); enUsteKaydir(); }, { etiket: t('gezinme.pratik') });

  // Gerçek sohbet: şu an aktif dil ortakları (test modunda TEST rozetli sanal kullanıcılar), renkli 2 sütunlu kartlar.
  const aktifler = testler.slice().sort((x, y) => aktiflik(x).dk - aktiflik(y).dk).slice(0, 6);
  const gercekBolumu = h('section', { class: 'bgn-gercek', 'aria-labelledby': 'bgn-gercek-baslik' },
    h('div', { class: 'bgn-dongu-ust' }, h('h2', { class: 'bgn-dongu-baslik', id: 'bgn-gercek-baslik' }, t('pratik.gercekBaslik')),
      h('button', { type: 'button', class: 'bgn-tumu', onClick: () => b.git('/kesfet') }, t('pratik.tumunuGor'), ikon('sag', 16))),
    aktifler.length ? h('div', { class: 'bgn-canli-izgara' }, aktifler.map((p, i) => h('button', { type: 'button', class: `bgn-canli b-kutu-${(i % 6) + 1}`, onClick: () => b.git(`/kisi?k=${p.kimlik}`) },
      h('span', { class: 'bgn-oda-etiketler' }, h('span', { class: 'bgn-oda-hap' }, p.anaDil.toUpperCase()), h('span', { class: 'bgn-oda-hap' }, `# ${yerel(p.ilgi[0])}`), testEtiketi()),
      h('span', { class: 'bgn-canli-av' }, testAvatar(p, 72, { cevrimici: aktiflik(p).cevrimici })),
      h('span', { class: 'bgn-canli-ad' }, p.ad),
      h('b', { class: 'bgn-canli-konu' }, t('pratik.konusalim', { dil: t(`diller.${p.ogrenilenDil}`) })),
      h('span', { class: 'bgn-canli-alt' }, aktiflik(p).cevrimici ? t('ht.cevrimiciSimdi') : `${p.seviye} · ${yerel(p.ulke).split(' · ')[0]}`),
    ))) : h('div', { class: 'b-platform bgn-gercek-bos' },
      h('p', null, t('pratik.gercekBos')),
      h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => { testModuAyarla(true); b.git('/bugun', { degistir: true }); } }, ikon('kisi', 18), t('test.davetDugme'))),
    h('p', { class: 'b-kucuk' }, t('pratik.gercekNot')),
  );

  // Öğren: yatay kayan kart sıraları (HelloTalk Öğren · Kelimeler): senaryolar ve araçlar.
  const tamam = v.tamamlananSenaryolar || {};
  const SENARYO_SIMGE = { alisveris: 'hediye', ulasim: 'senaryo' };
  const ogrenBolumu = h('section', { class: 'bgn-ogren', 'aria-label': t('pratik.sekme.ogren') },
    h('h2', { class: 'bgn-dongu-baslik' }, t('pratik.onerilen')),
    h('div', { class: 'b-kart-sirasi', 'data-yatay': '' }, tumSenaryolar.map((s, i) => basiliTut(h('button', { type: 'button', class: 'bgn-ogren-kart', onClick: () => b.git(`/gorusme?tur=senaryo&id=${s.kimlik}`) },
      h('span', { class: `bgn-ogren-gorsel b-kutu-${(i % 6) + 1}` }, ikon3d(ALAN_IKON[s.alan] || SENARYO_SIMGE[s.alan] || 'senaryo', 64), senaryoIsareti(s.kimlik, { kisa: true, kose: true })),
      h('b', null, yerel(s.baslik)),
      h('small', null, `${s.seviye} · ${alanAdi(s.alan)}`)), () => raporAc(s, { git: b.git })))),
    h('h2', { class: 'bgn-dongu-baslik' }, t('pratik.araclar')),
    h('div', { class: 'b-kart-sirasi', 'data-yatay': '' }, [
      ['hafiza', t('ht.merkez.hafiza'), t('pratik.tekrarSayisi', { n: vadesi.length }), () => b.git('/hafiza'), 3],
      ['kitap', t('defter.baslik'), t('pratik.cumleSayisi', { n: (v.kayitliCumleler || []).length }), () => b.git('/gelisim'), 6],
      ['kupa', t('ht.merkez.karne'), t('pratik.karneAlt'), () => b.git('/gelisim'), 2],
      ['senaryo', t('ht.merkez.senaryolar'), t('yanMenu.senaryoAlt'), () => b.git('/senaryolar'), 1],
      // v0.20.0: kelime ve gramer için kardeş uygulama
      ['ekosistem', t('eko.kartBaslik'), t('eko.kartAlt'), () => b.git('/uygulamalar?u=english-prime'), 4],
    ].map(([ik, ad, alt, fn, renk]) => h('button', { type: 'button', class: 'bgn-ogren-kart', onClick: fn },
      h('span', { class: `bgn-ogren-gorsel b-kutu-${renk}` }, ikon3d(ik, 64)), h('b', null, ad), h('small', null, alt)))),
  );
  function pratikSekmeGoster() { kok.querySelectorAll('[data-psekme]').forEach((c) => { c.hidden = c.dataset.psekme !== pratikSekme; }); }

  yerlestir(kok, 
    htUst({
      sol: benDugmesi(b),
      baslik: t('gezinme.pratik'),
      sag: [h('span', { class: 'bgn-seri', title: t('bugun.seri', { n: seri }) }, ikon3d('seri', 22), String(seri)), kutuDugmesi(b.git)],
    }),
    pratikSekmeleri,
    planKarti({ v, gun, sira, oneri, vadesi, yarim, baslat, senaryoyaGit, git: b.git }),
    h('nav', { class: 'b-uygulamalar bgn-uygulamalar', 'aria-label': t('bugun.yollarBaslik') },
      [['senaryo', t('ht.merkez.senaryolar'), () => b.git('/senaryolar'), 1, 0],
        ['telaffuz', t('ht.merkez.telaffuz'), () => b.git('/telaffuz'), 5, 0],
        ['hafiza', t('ht.merkez.hafiza'), () => b.git('/hafiza'), 3, vadesi.length],
        ['gelisim', t('bugun.gelisimKutu.baslik'), () => b.git('/gelisim'), 4, 0],
        ['baglanti', t('ht.merkez.partner'), () => b.git('/kesfet'), 2, 0],
      ].map(([ik, ad, fn, renk, rozet]) => h('button', { type: 'button', class: 'b-uygulama', onClick: fn },
        h('span', { class: `b-uygulama-ikon b-kutu-${renk} bgn-uyg` }, ikon3d(ik, 38), rozet ? h('span', { class: 'b-ht-rozet' }, String(rozet)) : null), ad)),
    ),
    gercekBolumu,
    ogrenBolumu,
    h('section', { class: 'bgn-odalar', 'aria-labelledby': 'bgn-oda-baslik' },
      h('div', { class: 'bgn-dongu-ust' }, h('h2', { class: 'bgn-dongu-baslik', id: 'bgn-oda-baslik' }, t('odalar.baslik')), h('span', { class: 'b-kucuk' }, t('odalar.alt'))),
      sekmeler([['tum', t('sohbetler.tumFiltre')], ...alanlar.filter((a) => ODALAR.some((o) => o.alan === a.kimlik)).map((a) => [a.kimlik, t(a.metin)])], odaDurumu.alan, (id) => { odaDurumu.alan = id; odaListeCiz(); }, { tur: 'hap', etiket: t('odalar.kategori') }),
      odaListe,
      h('p', { class: 'b-kucuk bgn-oda-not' }, yzEtiketi(), ' ', t('odalar.not')),
    ),
    altGezinme('/bugun'),
  );
  [...kok.children].forEach((c) => {
    if (c === pratikSekmeleri || c.classList.contains('b-ht-ust') || c.classList.contains('b-gezinme')) return;
    c.dataset.psekme = c === gercekBolumu ? 'gercek' : (c === ogrenBolumu || c.classList.contains('bgn-uygulamalar')) ? 'ogren' : 'ai';
  });
  pratikSekmeGoster();
}

// v0.21.0 Konu odaları › bir kategori tam sayfa: seviyeye göre gruplu geniş sohbet kartları. Geri: Pratik'e (seçim korunur).
function odalarEkrani(kok, b) {
  const alan = alanlar.find((a) => a.kimlik === b.p.alan);
  if (!alan) { b.git('/bugun', { degistir: true }); return null; }
  const v = al();
  const liste = tumSenaryolar.filter((sn) => sn.alan === alan.kimlik);
  const denenen = liste.filter((sn) => istatistik(sn.kimlik).durum).length;
  yerlestir(kok,
    ustBaslik({ baslik: t(alan.metin), ikon: ALAN_IKON[alan.kimlik] || 'senaryo', geri: () => b.geri('/bugun'), alt: t('snk.tamAlt', { n: liste.length, y: denenen }) }),
    h('p', { class: 'b-kucuk' }, t('snk.ipucuBasili')),
    SEVIYE_SIRASI.filter((sv) => liste.some((sn) => sn.seviye === sv)).map((sv) => [
      h('h2', { class: 'bgn-seviye-baslik' }, sv, sv === v.profil.seviye ? h('span', { class: 'b-etiket-hap' }, t('snk.seninSeviyen')) : null),
      h('div', { class: 'bgn-genis-liste' }, liste.filter((sn) => sn.seviye === sv).map((sn) => genisKart(sn, { git: b.git }))),
    ]));
  return null;
}

export default {
  kimlik: 'bugun',
  surum: '0.5.0',
  onek: 'bgn',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'gunluk', 'hafiza', 'zamanlayici'],
  ekranlar: {
    bugun: ekran({ baslikAnahtari: 'ekran.bugun', durumlar: DORT_DURUM, ciz }),
    odalar: ekran({ baslikAnahtari: 'ekran.odalar', durumlar: DORT_DURUM, ciz: odalarEkrani }),
  },
};

// Bugün: günün döngüsü, sıradaki adım (tabela), Hata Hafızası kısayolu ve tek dokunuşla "Konuş".
import './bugun.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, yerlestir, yzEtiketi, ikon3d, htUst, htIkon, testAvatar, sekmeler, afisKaydirici, testEtiketi } from '../../cekirdek/arayuz.js';
import { testModuAcik, testModuAyarla, testProfilleri, aktiflik } from '../../cekirdek/test-modu.js';
import tumSenaryolar from '../../veri/senaryolar/index.js';
import { t, yerel, aktifDil } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { gunKaydi, siradaki, seriHesapla, bugunkuSenaryo } from '../../cekirdek/gunluk.js';
import { vadesiGelenler } from '../../cekirdek/hafiza.js';
import { yarimKalan } from '../../cekirdek/gorusme-sonucu.js';
import { gunBolumu } from '../../cekirdek/zaman.js';
import { simdiAra } from '../../cekirdek/zamanlayici.js';
import { oneriSenaryo } from '../../cekirdek/oneri.js';
import alanlar from '../../veri/alanlar.js';

function alanAdi(kimlik) {
  const alan = alanlar.find((a) => a.kimlik === kimlik);
  return alan ? t(alan.metin) : '';
}

function donguOgesi({ baslik, alt, durum, onClick }) {
  const daireSinifi = durum === 'tamam' ? 'b-ikon-daire b-ikon-daire-iyi' : durum === 'siradaki' ? 'b-ikon-daire b-ikon-daire-vurgu' : 'b-ikon-daire';
  const ikonAdi = durum === 'tamam' ? 'onay' : durum === 'siradaki' ? 'oynat' : 'saat';
  return h('button', {
    class: `bgn-satir${durum === 'siradaki' ? ' bgn-satir-vurgu' : ''}`,
    type: 'button',
    onClick,
  },
    h('span', { class: daireSinifi }, ikon(ikonAdi, 18, 2.5)),
    h('span', { class: 'bgn-oge-metin' },
      h('span', { class: 'bgn-oge-baslik' }, baslik),
      h('span', { class: 'b-kucuk' }, alt),
    ),
    durum === 'siradaki' ? h('span', { class: 'bgn-siradaki' }, t('bugun.siradaki')) : null,
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
  const ODALAR = [
    { k: 'kafe', id: 'alisveris-kafe-01', seviye: 'A2', renk: 1 },
    { k: 'market', id: 'alisveris-market-01', seviye: 'A1', renk: 3 },
    { k: 'yol', id: 'ulasim-yol-01', seviye: 'A1', renk: 4 },
    { k: 'bilet', id: 'ulasim-bilet-01', seviye: 'A2', renk: 5 },
  ];
  const odayaGit = (o) => b.git(`/gorusme?tur=senaryo&id=${o.id}`);
  const ilgilenenler = (i) => testler.filter((_, j) => (j + i) % 3 === 0).slice(0, 4);
  const odaKarti = (o, i) => h('button', { type: 'button', class: `bgn-oda b-kutu-${o.renk}`, onClick: () => odayaGit(o) },
    h('span', { class: 'bgn-oda-etiketler' }, h('span', { class: 'bgn-oda-hap' }, 'EN'), h('span', { class: 'bgn-oda-hap' }, `# ${t(`odalar.etiket.${o.k}`)}`), h('span', { class: 'bgn-oda-hap' }, o.seviye)),
    h('b', { class: 'bgn-oda-baslik' }, ikon('dalgaCizgi', 16), t(`odalar.konu.${o.k}`)),
    h('span', { class: 'bgn-oda-alt' },
      h('span', { class: 'bgn-oda-sunucu' }, ikon3d('yz', 26), t('koc.ad')),
      ilgilenenler(i).length ? h('span', { class: 'bgn-oda-yigin' }, ilgilenenler(i).map((p) => h('span', { class: 'bgn-oda-kisi' }, testAvatar(p, 28))), h('small', null, t('odalar.ilgilenen', { n: ilgilenenler(i).length }))) : null),
  );
  let odaSira = ODALAR.findIndex((o) => o.seviye === v.profil.seviye);
  if (odaSira < 0) odaSira = 0;
  const hizliOda = h('div', { class: 'bgn-hizli-oda' });
  function hizliOdaCiz() {
    const o = ODALAR[odaSira % ODALAR.length];
    yerlestir(hizliOda,
      h('span', { class: 'bgn-hizli-etiket' }, t('odalar.hizliEtiket')),
      h('b', { class: 'bgn-hizli-baslik' }, t(`odalar.konu.${o.k}`), ' · ', o.seviye),
      h('div', { class: 'bgn-hizli-eylem' },
        h('button', { type: 'button', class: 'bgn-hizli-degistir', 'aria-label': t('odalar.degistir'), onClick: () => { odaSira += 1; hizliOdaCiz(); } }, ikon('degis', 20)),
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana bgn-hizli-katil', onClick: () => odayaGit(o) }, ikon('mikrofon', 18), t('odalar.hizliKatil'))));
  }
  hizliOdaCiz();
  // Üç sekme (HelloTalk Ses · Canlı · Öğren karşılığı): AI sohbet · Gerçek sohbet · Öğren.
  const pratikSekmeleri = sekmeler([['ai', t('pratik.sekme.ai')], ['gercek', t('pratik.sekme.gercek')], ['ogren', t('pratik.sekme.ogren')]], pratikSekme, (id) => { pratikSekme = id; pratikSekmeGoster(); window.scrollTo(0, 0); }, { etiket: t('gezinme.pratik') });

  // En üstte kayan tanıtım afişleri: uygulamanın kendi özelliklerini tanıtır, dokununca ilgili yere götürür.
  const afisler = afisKaydirici([
    { ikon: 'telaffuz', renk: 1, etiket: t('pratik.afis.1.etiket'), baslik: t('pratik.afis.1.baslik'), alt: t('pratik.afis.1.alt'), dugme: t('pratik.afis.1.dugme'), git: senaryoyaGit },
    { ikon: 'baglanti', renk: 4, etiket: t('pratik.afis.2.etiket'), baslik: t('pratik.afis.2.baslik'), alt: t('pratik.afis.2.alt'), dugme: t('pratik.afis.2.dugme'), git: () => b.git('/kesfet') },
    { ikon: 'kitap', renk: 3, etiket: t('pratik.afis.3.etiket'), baslik: t('pratik.afis.3.baslik'), alt: t('pratik.afis.3.alt'), dugme: t('pratik.afis.3.dugme'), git: () => b.git('/gelisim?sekme=profil') },
    { ikon: 'anlar', renk: 6, etiket: t('pratik.afis.4.etiket'), baslik: t('pratik.afis.4.baslik'), alt: t('pratik.afis.4.alt'), dugme: t('pratik.afis.4.dugme'), git: () => b.git('/dil-anlari') },
    { ikon: 'kupa', renk: 5, etiket: t('pratik.afis.5.etiket'), baslik: t('pratik.afis.5.baslik'), alt: t('pratik.afis.5.alt'), dugme: t('pratik.afis.5.dugme'), git: () => b.git('/gelisim?sekme=gelisim') },
  ], { etiket: t('pratik.afisEtiket') });

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
    h('div', { class: 'b-kart-sirasi', 'data-yatay': '' }, tumSenaryolar.map((s, i) => h('button', { type: 'button', class: 'bgn-ogren-kart', onClick: () => b.git(`/gorusme?tur=senaryo&id=${s.kimlik}`) },
      h('span', { class: `bgn-ogren-gorsel b-kutu-${(i % 6) + 1}` }, ikon3d(SENARYO_SIMGE[s.alan] || 'senaryo', 64), tamam[s.kimlik] ? h('span', { class: 'bgn-ogren-rozet' }, ikon('onay', 14)) : null),
      h('b', null, yerel(s.baslik)),
      h('small', null, `${s.seviye} · ${alanAdi(s.alan)}`)))),
    h('h2', { class: 'bgn-dongu-baslik' }, t('pratik.araclar')),
    h('div', { class: 'b-kart-sirasi', 'data-yatay': '' }, [
      ['hafiza', t('ht.merkez.hafiza'), t('pratik.tekrarSayisi', { n: vadesi.length }), () => b.git('/hafiza'), 3],
      ['kitap', t('defter.baslik'), t('pratik.cumleSayisi', { n: (v.kayitliCumleler || []).length }), () => b.git('/gelisim?sekme=profil'), 6],
      ['kupa', t('ht.merkez.karne'), t('pratik.karneAlt'), () => b.git('/gelisim?sekme=gelisim'), 2],
      ['senaryo', t('ht.merkez.senaryolar'), t('yanMenu.senaryoAlt'), () => b.git('/senaryolar'), 1],
    ].map(([ik, ad, alt, fn, renk]) => h('button', { type: 'button', class: 'bgn-ogren-kart', onClick: fn },
      h('span', { class: `bgn-ogren-gorsel b-kutu-${renk}` }, ikon3d(ik, 64)), h('b', null, ad), h('small', null, alt)))),
  );
  function pratikSekmeGoster() { kok.querySelectorAll('[data-psekme]').forEach((c) => { c.hidden = c.dataset.psekme !== pratikSekme; }); }

  let siradaMetni;
  if (sira === 'sabah') siradaMetni = t('bugun.siradaMetin.sabah', { saat: ayar.sabahSaati });
  else if (sira === 'senaryo') siradaMetni = t('bugun.siradaMetin.senaryo', { ad: yerel(oneri.baslik) });
  else if (sira === 'aksam') siradaMetni = t('bugun.siradaMetin.aksam', { saat: ayar.aksamSaati });
  else siradaMetni = t('bugun.siradaMetin.tamam');

  const durumu = (tur) => (gun[tur] ? 'tamam' : sira === tur ? 'siradaki' : 'bekliyor');

  yerlestir(kok, 
    htUst({
      sol: h('span', { class: 'bgn-seri', title: t('bugun.seri', { n: seri }) }, ikon3d('seri', 22), String(seri)),
      baslik: t('gezinme.pratik'),
      sag: htIkon(ikon3d('hedef', 28), t('ht.hedefim'), () => b.git('/gelisim')),
    }),
    pratikSekmeleri,
    afisler,
    h('p', { class: 'bgn-selam' },
      h('b', null, t(`bugun.selam.${gunBolumu()}`, { ad: v.profil.ad })), ' · ',
      new Date().toLocaleDateString(aktifDil() === 'tr' ? 'tr-TR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
      ' · ', t('bugun.seviye', { s: v.profil.seviye })),
    h('nav', { class: 'b-uygulamalar bgn-uygulamalar', 'aria-label': t('bugun.yollarBaslik') },
      [['senaryo', t('ht.merkez.senaryolar'), () => b.git('/senaryolar'), 1, 0],
        ['telaffuz', t('ht.merkez.telaffuz'), senaryoyaGit, 5, 0],
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
      hizliOda,
      h('div', { class: 'bgn-oda-liste' }, ODALAR.map((o, i) => odaKarti(o, i))),
      h('p', { class: 'b-kucuk bgn-oda-not' }, yzEtiketi(), ' ', t('odalar.not')),
    ),
    yarim ? h('button', { class: 'bgn-satir bgn-satir-vurgu', type: 'button', onClick: () => b.git(`/gorusme?${yarim.sorgu}&devam=1`) },
      h('span', { class: 'b-ikon-daire b-ikon-daire-vurgu' }, ikon('oynat', 18, 2.5)),
      h('span', { class: 'bgn-oge-metin' },
        h('span', { class: 'bgn-oge-baslik' }, t('bugun.devamBaslik')),
        h('span', { class: 'b-kucuk' }, t('bugun.devamAlt', { baslik: yarim.baslik })),
      ),
    ) : null,
    h('section', { class: 'bgn-dongu', 'aria-labelledby': 'bgn-dongu' },
      h('div', { class: 'bgn-dongu-ust' },
        h('h2', { class: 'bgn-dongu-baslik', id: 'bgn-dongu' }, t('bugun.donguBaslik')),
        h('span', { class: 'b-kucuk', role: 'status' }, siradaMetni),
      ),
      donguOgesi({
        baslik: t('bugun.sabahBaslik'),
        alt: gun.sabah ? t('bugun.tamamlandi') : t('bugun.bekliyor', { saat: ayar.sabahSaati }),
        durum: durumu('sabah'),
        onClick: () => baslat('sabah'),
      }),
      donguOgesi({
        baslik: gun.senaryo && bugunkuSenaryo() ? yerel(bugunkuSenaryo().baslik) : yerel(oneri.baslik),
        alt: gun.senaryo ? t('bugun.tamamlandi') : t('bugun.senaryoAlt', { alan: alanAdi(oneri.alan) }),
        durum: durumu('senaryo'),
        onClick: senaryoyaGit,
      }),
      donguOgesi({
        baslik: t('bugun.aksamBaslik'),
        alt: gun.aksam ? t('bugun.tamamlandi') : t('bugun.aksamAlt', { saat: ayar.aksamSaati, n: Math.min(vadesi.length, 3) }),
        durum: durumu('aksam'),
        onClick: () => baslat('aksam'),
      }),
    ),
    altGezinme('/bugun'),
  );
  [...kok.children].forEach((c) => {
    if (c === pratikSekmeleri || c.classList.contains('b-ht-ust') || c.classList.contains('b-gezinme')) return;
    if (c === afisler) return;
    c.dataset.psekme = c === gercekBolumu ? 'gercek' : (c === ogrenBolumu || c.classList.contains('bgn-uygulamalar')) ? 'ogren' : 'ai';
  });
  pratikSekmeGoster();
}

export default {
  kimlik: 'bugun',
  surum: '0.4.0',
  onek: 'bgn',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'gunluk', 'hafiza', 'zamanlayici'],
  ekranlar: {
    bugun: ekran({ baslikAnahtari: 'ekran.bugun', durumlar: DORT_DURUM, ciz }),
  },
};

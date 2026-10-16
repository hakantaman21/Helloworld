// Bugün: günün döngüsü, sıradaki adım (tabela), Hata Hafızası kısayolu ve tek dokunuşla "Konuş".
import './bugun.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, yerlestir, yzEtiketi, ikon3d, htUst, htIkon, testAvatar, sekmeler } from '../../cekirdek/arayuz.js';
import { testModuAcik, testProfilleri } from '../../cekirdek/test-modu.js';
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

let pratikSekme = 'bugun';

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
  const pratikSekmeleri = sekmeler([['bugun', t('bugun.sekme.bugun')], ['odalar', t('odalar.baslik')]], pratikSekme, (id) => { pratikSekme = id; pratikSekmeGoster(); }, { etiket: t('gezinme.pratik') });
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
    h('p', { class: 'bgn-selam' },
      h('b', null, t(`bugun.selam.${gunBolumu()}`, { ad: v.profil.ad })), ' · ',
      new Date().toLocaleDateString(aktifDil() === 'tr' ? 'tr-TR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
      ' · ', t('bugun.seviye', { s: v.profil.seviye })),
    h('section', { class: 'bgn-afis', 'aria-labelledby': 'bgn-afis-baslik' },
      h('div', { class: 'bgn-afis-metin' },
        h('span', { class: 'bgn-afis-etiket' }, t('bugun.hizliEtiket')),
        h('h2', { class: 'bgn-afis-baslik', id: 'bgn-afis-baslik' }, t('bugun.hizliBaslik')),
        h('p', { class: 'bgn-secim-bilgi' }, yzEtiketi(), ' ', t('bugun.partnerSecim.bilgi')),
      ),
      ikon3d('telaffuz', 72),
      h('div', { class: 'bgn-afis-eylem' },
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana bgn-afis-dugme', onClick: senaryoyaGit }, ikon('mikrofon', 18), t('bugun.partnerSecim.yz')),
        h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve bgn-afis-dugme', onClick: () => b.git('/kesfet') }, ikon('kisi', 18), t('bugun.partnerSecim.insan')),
      ),
    ),
    h('nav', { class: 'b-uygulamalar bgn-uygulamalar', 'aria-label': t('bugun.yollarBaslik') },
      [['senaryo', t('ht.merkez.senaryolar'), () => b.git('/senaryolar'), 1, 0],
        ['telaffuz', t('ht.merkez.telaffuz'), senaryoyaGit, 5, 0],
        ['hafiza', t('ht.merkez.hafiza'), () => b.git('/hafiza'), 3, vadesi.length],
        ['gelisim', t('bugun.gelisimKutu.baslik'), () => b.git('/gelisim'), 4, 0],
        ['baglanti', t('ht.merkez.partner'), () => b.git('/kesfet'), 2, 0],
      ].map(([ik, ad, fn, renk, rozet]) => h('button', { type: 'button', class: 'b-uygulama', onClick: fn },
        h('span', { class: `b-uygulama-ikon b-kutu-${renk} bgn-uyg` }, ikon3d(ik, 38), rozet ? h('span', { class: 'b-ht-rozet' }, String(rozet)) : null), ad)),
    ),
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
    c.dataset.psekme = c.classList.contains('bgn-odalar') ? 'odalar' : 'bugun';
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

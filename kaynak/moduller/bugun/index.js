// Bugün: günün döngüsü, sıradaki adım (tabela), Hata Hafızası kısayolu ve tek dokunuşla "Konuş".
import './bugun.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, yerlestir, yzEtiketi, ikon3d, htUst, htIkon } from '../../cekirdek/arayuz.js';
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

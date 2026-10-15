// Bugün: günün döngüsü, sıradaki adım (tabela), Hata Hafızası kısayolu ve tek dokunuşla "Konuş".
import './bugun.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, yerlestir } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
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
    class: `b-kart b-kart-satir b-kart-tiklanir${durum === 'siradaki' ? ' b-kart-vurgulu' : ''}`,
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

function aracKarti({ href, ikonAdi, baslik, alt, pasif }) {
  const icerik = [
    h('span', { class: 'b-ikon-daire' }, ikon(ikonAdi, 18)),
    h('span', { class: 'bgn-oge-baslik' }, baslik),
    h('span', { class: 'b-kucuk' }, alt),
  ];
  return pasif
    ? h('div', { class: 'b-kart bgn-arac bgn-arac-pasif', 'aria-disabled': 'true' }, icerik)
    : h('a', { class: 'b-kart bgn-arac', href }, icerik);
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

  const pratikSecenekleri = [
    { baslik: t('bugun.hizli.baslik'), alt: t('bugun.hizli.alt'), ikonAdi: 'mikrofon', git: () => b.git(`/gorusme?tur=senaryo&id=${oneri.kimlik}`) },
    { baslik: t('bugun.hedefli.baslik'), alt: t('bugun.hedefli.alt'), ikonAdi: 'harita', git: () => b.git('/senaryolar') },
    { baslik: t('bugun.tekrar.baslik'), alt: t('bugun.tekrar.alt', { n: vadesi.length }), ikonAdi: 'liste', git: () => b.git('/hafiza') },
  ];
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
    h('header', { class: 'b-ust' },
      h('div', { class: 'b-ust-metin' },
        h('div', { class: 'b-tabela' }, new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })),
        h('h1', { class: 'b-baslik' }, t(`bugun.selam.${gunBolumu()}`, { ad: v.profil.ad })),
      ),
    ),
    h('section', { class: 'b-kart bgn-secim', 'aria-labelledby': 'bgn-secim-baslik' },
      h('h2', { class: 'b-bolum-baslik', id: 'bgn-secim-baslik' }, t('bugun.partnerSecim.baslik')),
      h('div', { class: 'b-izgara-2' },
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: senaryoyaGit }, ikon('dalga', 20), t('bugun.partnerSecim.yz')),
        h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => b.git('/kesfet') }, ikon('kisi', 20), t('bugun.partnerSecim.insan')),
      ),
      h('p', { class: 'b-kucuk' }, t('bugun.partnerSecim.bilgi')),
    ),
    h('div', { class: 'b-cipler' },
      h('span', { class: 'b-cip b-cip-vurgu' }, t('bugun.seri', { n: seri })),
      h('span', { class: 'b-cip' }, t('bugun.seviye', { s: v.profil.seviye })),
    ),
    h('section', { class: 'b-kart bgn-hizli', 'aria-labelledby': 'bgn-hizli-baslik' },
      h('span', { class: 'b-ust-etiket' }, t('bugun.hizliEtiket')),
      h('h2', { class: 'b-bolum-baslik', id: 'bgn-hizli-baslik' }, t('bugun.hizliBaslik')),
      h('p', { class: 'b-kucuk' }, t('bugun.hizliAciklama')),
      h('button', { class: 'b-dugme b-dugme-ana', type: 'button', onClick: senaryoyaGit },
        ikon('mikrofon', 20), t('bugun.hizliDugme')),
    ),
    h('section', { class: 'b-yigin', 'aria-labelledby': 'bgn-yollar' },
      h('h2', { class: 'b-bolum-baslik', id: 'bgn-yollar' }, t('bugun.yollarBaslik')),
      h('div', { class: 'bgn-yollar' }, pratikSecenekleri.map((secenek) =>
        h('button', { class: 'b-kart b-kart-satir b-kart-tiklanir bgn-yol', type: 'button', onClick: secenek.git },
          h('span', { class: 'b-ikon-daire' }, ikon(secenek.ikonAdi, 20)),
          h('span', { class: 'bgn-oge-metin' },
            h('span', { class: 'bgn-oge-baslik' }, secenek.baslik),
            h('span', { class: 'b-kucuk' }, secenek.alt),
          ),
          ikon('sag', 18),
        ))),
    ),
    h('div', { class: 'b-kart bgn-tabela', role: 'status' },
      h('span', { class: 'b-ust-etiket' }, t('bugun.sirada')),
      h('span', null, siradaMetni),
    ),
    yarim ? h('button', { class: 'b-kart b-kart-satir b-kart-tiklanir', type: 'button', onClick: () => b.git(`/gorusme?${yarim.sorgu}&devam=1`) },
      h('span', { class: 'b-ikon-daire b-ikon-daire-vurgu' }, ikon('oynat', 18, 2.5)),
      h('span', { class: 'bgn-oge-metin' },
        h('span', { class: 'bgn-oge-baslik' }, t('bugun.devamBaslik')),
        h('span', { class: 'b-kucuk' }, t('bugun.devamAlt', { baslik: yarim.baslik })),
      ),
    ) : null,
    h('section', { class: 'b-yigin', 'aria-labelledby': 'bgn-dongu' },
      h('h2', { class: 'b-bolum-baslik', id: 'bgn-dongu' }, t('bugun.donguBaslik')),
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
    h('section', { class: 'b-yigin', 'aria-labelledby': 'bgn-araclar' },
      h('h2', { class: 'b-bolum-baslik', id: 'bgn-araclar' }, t('bugun.araclarBaslik')),
      h('div', { class: 'b-izgara-2' },
        aracKarti({ href: '#/senaryolar', ikonAdi: 'harita', baslik: t('bugun.arac.senaryolar'), alt: t('bugun.arac.senaryolarAlt') }),
        aracKarti({ href: '#/hafiza', ikonAdi: 'liste', baslik: t('bugun.arac.hafiza'), alt: t('bugun.arac.hafizaAlt', { n: vadesi.length }) }),
        aracKarti({ ikonAdi: 'ses', baslik: t('bugun.arac.telaffuz'), alt: t('bugun.arac.telaffuzAlt'), pasif: true }),
        aracKarti({ href: '#/kesfet', ikonAdi: 'kisi', baslik: t('bugun.arac.partner'), alt: t('bugun.arac.partnerAlt') }),
      ),
    ),
    h('button', { class: 'b-dugme b-dugme-ana b-ana-eylem', onClick: () => baslat(sira || 'senaryo') },
      ikon('mikrofon', 22), t('bugun.konus')),
    altGezinme('/bugun'),
  );
}

export default {
  kimlik: 'bugun',
  surum: '0.2.7',
  onek: 'bgn',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'gunluk', 'hafiza', 'zamanlayici'],
  ekranlar: {
    bugun: ekran({ baslikAnahtari: 'ekran.bugun', durumlar: DORT_DURUM, ciz }),
  },
};

// Gelişim: haftalık/aylık Büyüme Karnesi (paylaşılabilir kart), seviye yolu, haftanın günleri ve seri.
import './gelisim.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, altGezinme, durumKutusu, ikon, yerlestir } from '../../cekirdek/arayuz.js';
import { t } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { donemOzeti, dondurmaHakki } from '../../cekirdek/gunluk.js';
import { tarihAnahtari, gunEkle, haftaBaslangici, kisaTarih } from '../../cekirdek/zaman.js';
import { SEVIYE_SIRASI, oneriSenaryo } from '../../cekirdek/oneri.js';
import { vadesiGelenler } from '../../cekirdek/hafiza.js';
import { jeton } from '../../cekirdek/tema.js';
import { duyur } from '../../cekirdek/duyuru.js';

let donem = 'hafta';

function ortalama(dizi) {
  return dizi.length ? dizi.reduce((a, b) => a + b, 0) / dizi.length : null;
}

function donemHesapla() {
  const bugun = tarihAnahtari();
  const gunSayisi = donem === 'hafta' ? 7 : 30;
  const baslangic = donem === 'hafta' ? haftaBaslangici(bugun) : gunEkle(bugun, -29);
  const simdi = donemOzeti(baslangic, gunSayisi);
  const onceki = donemOzeti(gunEkle(baslangic, -gunSayisi), gunSayisi);
  const o1 = ortalama(simdi.akicilik);
  const o0 = ortalama(onceki.akicilik);
  let akicilikMetni = t('gelisim.akicilikYok');
  if (o1 !== null && o0) akicilikMetni = `${o1 >= o0 ? '+' : ''}%${Math.round(((o1 - o0) / o0) * 100)}`;
  else if (o1 !== null) akicilikMetni = String(Math.round(o1));
  return {
    aralik: `${kisaTarih(baslangic)}–${kisaTarih(gunEkle(baslangic, gunSayisi - 1))}`,
    dakika: simdi.dakika < 10 ? Math.round(simdi.dakika * 10) / 10 : Math.round(simdi.dakika),
    kelime: simdi.kelimeler.size,
    akicilikMetni,
    tamamGun: simdi.tamamGun,
    gunSayisi,
  };
}

async function karttanGorsel(ozet) {
  const tuval = document.createElement('canvas');
  tuval.width = 1080;
  tuval.height = 1920;
  const c = tuval.getContext('2d');
  const yazi = jeton('--yazi-aile') || 'sans-serif';
  c.fillStyle = jeton('--renk-gece');
  c.fillRect(0, 0, tuval.width, tuval.height);
  c.fillStyle = jeton('--renk-gece-soluk');
  c.font = `600 44px ${yazi}`;
  c.fillText(t('gelisim.karneBaslik', { aralik: ozet.aralik }), 96, 260);
  const satirlar = [
    [t('genel.dk', { n: ozet.dakika }), t('gelisim.konustun')],
    [String(ozet.kelime), t('gelisim.yeniKelime')],
    [ozet.akicilikMetni, t('gelisim.akicilik')],
    [`${ozet.tamamGun} / ${ozet.gunSayisi}`, t('gelisim.gun')],
  ];
  satirlar.forEach(([deger, etiket], i) => {
    const y = 520 + i * 300;
    c.fillStyle = i === 2 ? jeton('--renk-gece-vurgu') : jeton('--renk-gece-metin');
    c.font = `700 150px ${yazi}`;
    c.fillText(deger, 96, y);
    c.fillStyle = jeton('--renk-gece-soluk');
    c.font = `500 52px ${yazi}`;
    c.fillText(etiket, 96, y + 80);
  });
  c.fillStyle = jeton('--renk-gece-metin');
  c.font = `700 56px ${yazi}`;
  c.fillText(t('uygulama.ad'), 96, 1780);
  return new Promise((coz) => tuval.toBlob(coz, 'image/png'));
}

async function paylas(ozet) {
  const blob = await karttanGorsel(ozet);
  if (!blob) return;
  const dosya = new File([blob], 'buyume-karnesi.png', { type: 'image/png' });
  const metin = t('gelisim.paylasimMetni', { koc: t('uygulama.ad'), dk: ozet.dakika });
  if (navigator.canShare && navigator.canShare({ files: [dosya] })) {
    try { await navigator.share({ files: [dosya], title: t('gelisim.paylasimBaslik'), text: metin }); return; } catch (hata) { /* kullanıcı vazgeçti */ return; }
  }
  const baglanti = h('a', { href: URL.createObjectURL(blob), download: dosya.name });
  document.body.append(baglanti);
  baglanti.click();
  baglanti.remove();
  duyur(t('gelisim.indirildi'));
}

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const v = al();
  const ozet = donemHesapla();
  const hicVeriYok = Object.keys(v.gunluk).length === 0;
  const seviye = SEVIYE_SIRASI.indexOf(v.profil.seviye);
  const yol = SEVIYE_SIRASI.slice(0, 4);
  const bugun = tarihAnahtari();
  const hafta = haftaBaslangici(bugun);
  const tekrarSayisi = vadesiGelenler().length;
  const oneri = oneriSenaryo().senaryo;

  yerlestir(kok, 
    h('header', { class: 'gls-profil' },
      h('span', { class: 'gls-avatar', 'aria-hidden': 'true' }, (v.profil.ad || '?').charAt(0).toLocaleUpperCase()),
      h('div', { class: 'b-ust-metin b-buyut' },
        h('div', { class: 'b-tabela' }, t('gelisim.baslik')),
        h('h1', { class: 'b-baslik' }, v.profil.ad),
        h('div', { class: 'b-cipler' },
          h('span', { class: 'b-cip b-cip-vurgu' }, v.profil.seviye),
          h('span', { class: 'b-cip' }, t(`gelisim.rol.${v.profil.rol || 'ogrenen'}`)),
          v.profil.anaDil ? h('span', { class: 'b-cip' }, t('gelisim.anaDil', { dil: t(`diller.${v.profil.anaDil}`) })) : null,
        ),
      ),
      h('a', { class: 'b-dugme b-dugme-cerceve b-dugme-yuvarlak', href: '#/ayarlar', 'aria-label': t('gelisim.ayarlar') }, ikon('ayar', 20)),
    ),
    h('section', { class: 'b-kart gls-siradaki', 'aria-labelledby': 'gls-sonraki-adim' },
      h('span', { class: 'b-ust-etiket' }, t('gelisim.siradakiEtiket')),
      h('h2', { class: 'b-bolum-baslik', id: 'gls-sonraki-adim' }, tekrarSayisi ? t('gelisim.tekrarBaslik', { n: tekrarSayisi }) : t('gelisim.pratikBaslik')),
      h('p', { class: 'b-kucuk' }, tekrarSayisi ? t('gelisim.tekrarAciklama') : t('gelisim.pratikAciklama')),
      h('button', { class: 'b-dugme b-dugme-ana', type: 'button', onClick: () => b.git(tekrarSayisi ? '/hafiza' : `/gorusme?tur=senaryo&id=${oneri.kimlik}`) },
        ikon('oynat', 18), t('gelisim.baslatDugme')),
    ),
    h('div', { class: 'b-cipler', role: 'radiogroup', 'aria-label': t('gelisim.donem') },
      ['hafta', 'ay'].map((d) => h('button', {
        class: 'b-dugme b-dugme-cerceve gls-donem',
        role: 'radio',
        'aria-checked': d === donem ? 'true' : 'false',
        onClick: () => { donem = d; ciz(kok, b); },
      }, t(`gelisim.${d}`)))),
    hicVeriYok ? durumKutusu('bos', t('gelisim.bos')) : h('section', { class: 'gls-karne', 'aria-label': t('gelisim.paylasimBaslik') },
      h('span', { class: 'gls-karne-baslik' }, t('gelisim.karneBaslik', { aralik: ozet.aralik })),
      h('div', { class: 'b-izgara-2' },
        h('div', { class: 'gls-olcu' }, h('span', { class: 'gls-deger' }, t('genel.dk', { n: ozet.dakika })), h('span', { class: 'gls-etiket' }, t('gelisim.konustun'))),
        h('div', { class: 'gls-olcu' }, h('span', { class: 'gls-deger' }, String(ozet.kelime)), h('span', { class: 'gls-etiket' }, t('gelisim.yeniKelime'))),
        h('div', { class: 'gls-olcu' }, h('span', { class: 'gls-deger gls-deger-vurgu' }, ozet.akicilikMetni), h('span', { class: 'gls-etiket' }, t('gelisim.akicilik'))),
        h('div', { class: 'gls-olcu' }, h('span', { class: 'gls-deger' }, `${ozet.tamamGun} / ${ozet.gunSayisi}`), h('span', { class: 'gls-etiket' }, t('gelisim.gun'))),
      ),
      h('button', { class: 'b-dugme b-dugme-ana', onClick: () => paylas(ozet) }, ikon('paylas', 20), t('gelisim.paylas')),
    ),
    h('details', { class: 'b-kart gls-aciklama' },
      h('summary', { class: 'b-bolum-baslik' }, t('gelisim.olcumAciklamaBaslik')),
      h('p', { class: 'b-kucuk' }, t('gelisim.olcumAciklama')),
    ),
    h('section', { class: 'b-kart', 'aria-labelledby': 'gls-yol' },
      h('h2', { class: 'b-bolum-baslik', id: 'gls-yol' }, t('gelisim.seviyeYolu')),
      h('div', { class: 'gls-yol' }, yol.map((s, i) => h('span', { class: i < seviye ? 'gls-parca gls-parca-tamam' : i === seviye ? 'gls-parca gls-parca-simdi' : 'gls-parca' }))),
      h('div', { class: 'gls-yol-etiketler' }, yol.map((s, i) => h('span', { class: i === seviye ? 'gls-yol-simdi' : null }, i === seviye ? `${s} · ${t('gelisim.buradasin')}` : s))),
      seviye < yol.length - 1 ? h('p', { class: 'b-kucuk' }, t('gelisim.sonrakiHedef', { s: SEVIYE_SIRASI[seviye + 1] })) : null,
    ),
    h('section', { class: 'b-kart', 'aria-labelledby': 'gls-hafta' },
      h('div', { class: 'b-satir' },
        h('h2', { class: 'b-bolum-baslik b-buyut', id: 'gls-hafta' }, t('gelisim.buHafta')),
        h('span', { class: 'b-kucuk' }, t('gelisim.dondurma', { n: dondurmaHakki(bugun) })),
      ),
      h('div', { class: 'gls-gunler' },
        Array.from({ length: 7 }, (_, i) => {
          const gun = gunEkle(hafta, i);
          const kayit = v.gunluk[gun];
          const aktif = Boolean(kayit && (kayit.sabah || kayit.senaryo || kayit.aksam));
          const sinif = aktif ? 'gls-gun-daire gls-gun-aktif' : gun === bugun ? 'gls-gun-daire gls-gun-bugun' : 'gls-gun-daire';
          return h('div', { class: 'gls-gun' },
            h('span', { class: sinif }, aktif ? ikon('onay', 16, 2.8) : null),
            h('span', { class: 'b-kucuk' }, t(`gelisim.gunler.${i}`)),
          );
        }),
      ),
    ),
    altGezinme('/gelisim'),
  );
  return null;
}

export default {
  kimlik: 'gelisim',
  surum: '0.2.5',
  onek: 'gls',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'gunluk'],
  ekranlar: {
    gelisim: ekran({ baslikAnahtari: 'ekran.gelisim', durumlar: DORT_DURUM, ciz }),
  },
};

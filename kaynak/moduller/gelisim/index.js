// Gelişim: haftalık/aylık Büyüme Karnesi (paylaşılabilir kart), seviye yolu, haftanın günleri ve seri.
import './gelisim.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, altGezinme, durumKutusu, ikon, yerlestir, ikon3d, htUst, htIkon, dilCifti, benAvatar, testAvatar } from '../../cekirdek/arayuz.js';
import { benDugmesi } from '../../cekirdek/yan-menu.js';
import { arkadaslarim, benimGizlilik } from '../../cekirdek/arkadaslik.js';
import { testAnlari, takipSayisi, testProfili } from '../../cekirdek/test-modu.js';
import { fotografEkle, profilFotografiYap, fotografSil, FOTO_SINIRI, fotoAdresi, fotograflarEkle } from '../../cekirdek/fotograf.js';
import { cumleSil } from '../../cekirdek/cumle-defteri.js';
import { destek, soyle } from '../../cekirdek/ses/ses-hatti.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { ILGI_ALANLARI } from '../../veri/ilgi-alanlari.js';
import { al, degistir } from '../../cekirdek/depo.js';
import { donemOzeti, dondurmaHakki, seriHesapla } from '../../cekirdek/gunluk.js';
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

// Fotoğraf görüntüleyici: profil fotoğrafı yap · sil · kapat.
// v0.15.0 Kapak seçici (Facebook gibi): 6 sistem kapağı ya da kendi fotoğrafın. profil.kapak = 'sistem-N' | 'mdy:…'.
const KAPAK_SAYISI = 6;
function kapakSinifi(kapak) {
  if (kapak && !String(kapak).startsWith('sistem-')) return 'b-kapak b-kapak-foto';
  const n = Number(String(kapak || 'sistem-1').split('-')[1]) || 1;
  return `b-kapak b-kapak-${((n - 1) % KAPAK_SAYISI) + 1}`;
}
function kapakSec(yenile) {
  const kapat = () => perde.remove();
  const sec = (deger) => { degistir((v) => { v.profil.kapak = deger; }); kapat(); yenile(); };
  const perde = h('div', { class: 'b-alt-pencere-perde', onClick: (e) => { if (e.target === perde) kapat(); } },
    h('div', { class: 'b-alt-pencere', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('kapak.baslik') },
      h('div', { class: 'b-alt-pencere-tutamak', 'aria-hidden': 'true' }),
      h('div', { class: 'b-alt-pencere-ust' }, h('h2', { class: 'b-alt-pencere-baslik' }, t('kapak.baslik'))),
      h('div', { class: 'b-alt-pencere-ic' },
        h('div', { class: 'gls-kapak-secenekler' }, Array.from({ length: KAPAK_SAYISI }, (_, i) => h('button', {
          type: 'button', class: `gls-kapak-ornek ${kapakSinifi(`sistem-${i + 1}`)}`, 'aria-label': t('kapak.sistem', { n: i + 1 }), onClick: () => sec(`sistem-${i + 1}`),
        }))),
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: async () => { const [ref] = await fotograflarEkle(1); if (ref) sec(ref); } }, ikon('kamera', 18), t('kapak.foto')),
        h('p', { class: 'b-kucuk' }, t('kapak.not'))),
    ));
  document.body.append(perde);
  perde.querySelector('button').focus();
}

function fotoGoster(veri, yenile) {
  const kapat = () => perde.remove();
  const perde = h('div', { class: 'b-alt-pencere-perde', onClick: (e) => { if (e.target === perde) kapat(); } },
    h('div', { class: 'b-alt-pencere', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('foto.baslik') },
      h('div', { class: 'b-alt-pencere-tutamak', 'aria-hidden': 'true' }),
      h('div', { class: 'b-alt-pencere-ic' }, h('img', { class: 'gls-foto-buyuk', src: fotoAdresi(veri), alt: '' })),
      h('div', { class: 'b-alt-pencere-alt' },
        h('button', { type: 'button', class: 'b-dugme b-dugme-tehlike', onClick: () => { fotografSil(veri); kapat(); duyur(t('foto.silindi')); yenile(); } }, t('foto.sil')),
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => { profilFotografiYap(veri); kapat(); duyur(t('foto.profilYapildi')); yenile(); } }, t('foto.profilYap')),
      ),
    ));
  document.body.append(perde);
  perde.querySelector('button').focus();
}

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const v = al();
  const ozet = donemHesapla();
  const hicVeriYok = Object.keys(v.gunluk).length === 0;
  const seviye = SEVIYE_SIRASI.indexOf(v.profil.seviye);
  const yol = SEVIYE_SIRASI;
  const bugun = tarihAnahtari();
  const hafta = haftaBaslangici(bugun);
  const tekrarSayisi = vadesiGelenler().length;
  const oneri = oneriSenaryo().senaryo;
  const seri = seriHesapla();
  const benimAnSayisi = testAnlari().filter((a) => a.benim).length;
  const gunKayitlari = Object.values(v.gunluk || {});
  const toplamDakika = Math.round(gunKayitlari.reduce((n, g) => n + (g.dakika || 0), 0));
  const kelimeSayisi = new Set(gunKayitlari.flatMap((g) => g.yeniKelime || [])).size;
  const ilkGun = Object.keys(v.gunluk || {}).sort()[0];
  const katilimGunu = ilkGun ? Math.max(1, Math.round((Date.now() - new Date(ilkGun).getTime()) / 86400000) + 1) : 1;
  // v0.16.0: eski "?sekme=profil" adresleri kimlik sayfasına gider (Profil artık profil fotoğrafının arkasında).
  if (b.p.sekme === 'profil') { b.git('/profil', { degistir: true }); return null; }

  yerlestir(kok,
    htUst({
      sol: benDugmesi(b),
      baslik: t('gezinme.gelisim'),
      sag: htIkon('paylas', t('gelisim.paylas'), () => paylas(ozet)),
    }),
    h('div', { class: 'gls-istat' },
      h('button', { type: 'button', class: 'gls-istat-kutu', onClick: () => b.git('/bugun') },
        h('span', { class: 'gls-istat-deger' }, ikon3d('seri', 26), String(seri)), h('span', null, t('ht.gunlukSeri'))),
      h('button', { type: 'button', class: 'gls-istat-kutu', onClick: () => b.git('/hafiza') },
        h('span', { class: 'gls-istat-deger' }, ikon3d('hafiza', 26), String(tekrarSayisi)), h('span', null, t('ht.tekrarBekleyen'))),
    ),
    h('section', { class: 'b-platform gls-puanlar', 'aria-labelledby': 'gls-puan-baslik' },
      h('h2', { class: 'b-grup-etiket', id: 'gls-puan-baslik' }, h('span', null, t('puan.baslik')), h('span', null, t('puan.katildi', { n: katilimGunu }))),
      h('div', { class: 'b-karolar' }, [
        ['saat', toplamDakika, t('puan.dakika')], ['kitap', kelimeSayisi, t('puan.kelime')], ['onay', (v.hafiza || []).length, t('puan.hata')],
        ['yerImi', (v.kayitliCumleler || []).length, t('puan.cumle')], ['kalem', benimAnSayisi, t('puan.an')], ['kisi', takipSayisi(), t('puan.takip')],
      ].map(([ik, deger, ad]) => h('span', { class: 'b-karo gls-puan' }, h('span', { class: 'gls-puan-ikon', 'aria-hidden': 'true' }, ikon(ik, 20)), h('b', { class: 'gls-puan-deger' }, String(deger)), ad))),
    ),
    h('section', { class: 'b-kart gls-siradaki', 'aria-labelledby': 'gls-sonraki-adim' },
      h('span', { class: 'b-ust-etiket' }, t('gelisim.siradakiEtiket')),
      h('h2', { class: 'b-bolum-baslik', id: 'gls-sonraki-adim' }, tekrarSayisi ? t('gelisim.tekrarBaslik', { n: tekrarSayisi }) : t('gelisim.pratikBaslik')),
      h('p', { class: 'b-kucuk gls-siradaki-alt' }, tekrarSayisi ? t('gelisim.tekrarAciklama') : t('gelisim.pratikAciklama')),
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
      h('p', { class: 'gls-ne-anlama-metin', id: 'gls-ne-anlama', hidden: true }, t('gelisim.olcumAciklama')),
      h('div', { class: 'gls-karne-alt' },
        h('button', { type: 'button', class: 'gls-ne-anlama', 'aria-expanded': 'false', 'aria-controls': 'gls-ne-anlama', onClick: (e) => {
          const metin = kok.querySelector('#gls-ne-anlama');
          metin.hidden = !metin.hidden;
          e.currentTarget.setAttribute('aria-expanded', String(!metin.hidden));
        } }, t('gelisim.olcumAciklamaBaslik'))),
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
    h('section', { class: 'b-platform gls-defter', 'aria-labelledby': 'gls-defter-baslik' },
      h('h2', { class: 'b-grup-etiket', id: 'gls-defter-baslik' }, h('span', null, t('defter.baslik')), h('span', null, String((v.kayitliCumleler || []).length))),
      (v.kayitliCumleler || []).length
        ? h('ul', { class: 'gls-defter-liste' }, v.kayitliCumleler.slice(0, 8).map((c) => h('li', { class: 'gls-defter-satir' },
          h('span', { class: 'gls-defter-metin' }, c.metin, c.kimden ? h('small', null, c.kimden) : null),
          destek.sentez ? h('button', { type: 'button', class: 'gls-defter-dugme', 'aria-label': t('defter.dinle'), onClick: () => soyle(c.metin) }, ikon('hoparlor', 18)) : null,
          h('button', { type: 'button', class: 'gls-defter-dugme', 'aria-label': t('defter.sil'), onClick: () => { cumleSil(c.metin); ciz(kok, b); } }, ikon('kapat', 16)))))
        : h('p', { class: 'b-kucuk' }, t('defter.bos')),
    ),
    h('section', { class: 'b-platform gls-merkez', 'aria-labelledby': 'gls-merkez-baslik' },
      h('h2', { class: 'gls-merkez-baslik', id: 'gls-merkez-baslik' }, t('ht.ogrenmeMerkezi')),
      h('div', { class: 'b-uygulamalar gls-uygulamalar' },
        [['senaryo', 'senaryolar', '/senaryolar', 1], ['telaffuz', 'telaffuz', '/telaffuz', 5], ['hafiza', 'hafiza', '/hafiza', 3], ['kupa', 'karne', '/karne', 2], ['baglanti', 'partner', '/kesfet', 4]].map(([ik, ad, yol, renk]) =>
          h('button', { type: 'button', class: 'b-uygulama', onClick: () => b.git(yol) }, h('span', { class: `b-uygulama-ikon b-kutu-${renk}` }, ikon3d(ik, 38)), t(`ht.merkez.${ad}`))),
      ),
    ),
    altGezinme('/gelisim'),
  );
  return null;
}

// v0.16.0 Kimlik sayfası (/profil): kapak, fotoğraf, ad, dil çifti, ilgi alanları, fotoğraflar, Dil Anları, davet.
// Üst banttaki profil fotoğrafından → yan menü → "Profilini gör" ile açılır; düzenleme Ayarlar › Kişisel bilgiler.
function profilCiz(kok, b) {
  const v = al();
  const benimAnSayisi = testAnlari().filter((a) => a.benim).length;
  kok.classList.add('gls-profil-ekran');
  yerlestir(kok,
    htUst({
      sol: htIkon('sol', t('genel.geri'), () => b.geri('/gelisim')),
      baslik: t('ekran.profil'),
      sag: htIkon(ikon3d('ayarlar', 28), t('ayarlar.baslik'), () => b.git('/ayarlar')),
    }),
    h('div', { class: `gls-kapak ${kapakSinifi(v.profil.kapak)}` },
      v.profil.kapak && !String(v.profil.kapak).startsWith('sistem-') ? h('img', { src: fotoAdresi(v.profil.kapak), alt: '' }) : null,
      h('button', { type: 'button', class: 'b-ht-ikon gls-kapak-dugme', 'aria-label': t('kapak.degistir'), onClick: () => kapakSec(() => profilCiz(kok, b)) }, ikon('kamera', 18))),
    h('button', { type: 'button', class: 'gls-ben', onClick: () => b.git('/ayarlar?grup=profil'), 'aria-label': t('gelisim.kimlik.duzenle') },
      benAvatar(76, 'gls-ben-av'),
      h('span', { class: 'gls-ben-ic' },
        h('span', { class: 'gls-ben-ad' }, h('b', null, v.profil.ad || '?'), h('span', { class: 'b-etiket-hap' }, v.profil.seviye)),
        dilCifti(v.profil.anaDil || 'tr', v.profil.ogrenilenDil || 'en', v.profil.seviye),
        h('span', { class: 'gls-ben-sayilar' }, h('b', null, String(takipSayisi())), ` ${t('ht.takipEdilenSayi')}`, h('b', null, ' 0'), ` ${t('ht.takipci')}`),
      ),
      ikon('sag', 20),
    ),
    h('button', { type: 'button', class: 'gls-satir', onClick: () => b.git('/dil-anlari') },
      ikon3d('anlar', 28), h('b', null, t('anlar.baslik')), h('span', { class: 'gls-satir-sayi' }, String(benimAnSayisi)), ikon('sag', 18)),
    h('button', { type: 'button', class: 'gls-ilgi', onClick: () => b.git('/ayarlar?bolum=ilgi') },
      h('span', { class: 'gls-ilgi-ust' }, h('b', null, t('ilgi.baslik')), h('span', { class: 'b-kucuk' }, (v.profil.ilgiler || []).length ? t('ilgi.duzenle') : t('ilgi.ekle')), ikon('sag', 18)),
      (v.profil.ilgiler || []).length
        ? h('span', { class: 'b-karolar gls-ilgi-karolar' }, ILGI_ALANLARI.filter((i) => v.profil.ilgiler.includes(i.kimlik)).map((i) => h('span', { class: 'b-karo' }, h('span', { class: 'b-karo-simge', 'aria-hidden': 'true' }, i.simge), yerel(i))))
        : h('span', { class: 'b-kucuk' }, t('ilgi.davet')),
    ),
    h('section', { class: 'b-platform gls-fotolar', 'aria-labelledby': 'gls-foto-baslik' },
      h('h2', { class: 'b-grup-etiket', id: 'gls-foto-baslik' }, h('span', null, t('foto.baslik')), h('span', null, `${(v.profil.fotograflar || []).length} / ${FOTO_SINIRI}`)),
      h('div', { class: 'b-karolar gls-foto-izgara' },
        (v.profil.fotograflar || []).map((f, i) => h('button', { type: 'button', class: `gls-foto${f === v.profil.foto ? ' gls-foto-profil' : ''}`, 'aria-label': t('foto.ac', { n: i + 1 }), onClick: () => fotoGoster(f, () => profilCiz(kok, b)) }, h('img', { src: fotoAdresi(f), alt: '' }))),
        (v.profil.fotograflar || []).length < FOTO_SINIRI ? h('button', { type: 'button', class: 'b-karo gls-foto-ekle', onClick: async () => {
          const s = await fotografEkle();
          if (s === 'eklendi') { duyur(t('foto.eklendi')); profilCiz(kok, b); } else if (s === 'hata') duyur(t('foto.hata')); else if (s === 'sinir') duyur(t('foto.sinir', { n: FOTO_SINIRI }));
        } }, h('span', { class: 'b-karo-simge', 'aria-hidden': 'true' }, ikon('kamera', 22)), t('foto.ekle')) : null,
      ),
      h('p', { class: 'b-kucuk' }, t('foto.gizlilik')),
    ),
    // v0.17.0 Arkadaşlarım (yalnız sen ve gizlilik ayarının izin verdikleri görür).
    h('section', { class: 'b-platform gls-arkadaslar', 'aria-labelledby': 'gls-ark-baslik' },
      h('h2', { class: 'b-grup-etiket', id: 'gls-ark-baslik' }, h('span', null, t('arkadas.arkadaslarim')), h('span', null, String(arkadaslarim().length))),
      arkadaslarim().length ? h('div', { class: 'gls-ark-liste', 'data-yatay': '' }, arkadaslarim().map((k) => testProfili(k)).filter(Boolean).map((p) =>
        h('button', { type: 'button', class: 'gls-ark', onClick: () => b.git(`/kisi?k=${p.kimlik}`) }, testAvatar(p, 48), h('span', null, p.ad))))
        : h('p', { class: 'b-kucuk' }, t('arkadas.arkadasYok')),
      h('button', { type: 'button', class: 'b-dugme b-dugme-metin', onClick: () => b.git('/ayarlar?grup=gizlilik') }, `${t('arkadas.gizlilik.arkadasListesi')}: ${t(`arkadas.secenek.${benimGizlilik().arkadasListesi}`)}`)),
    h('section', { class: 'b-platform gls-davet' },
      h('div', { class: 'gls-davet-metin' }, h('b', null, t('davet.baslik')), h('span', null, t('davet.alt'))),
      h('button', { type: 'button', class: 'b-dugme b-dugme-ana gls-davet-dugme', onClick: async () => {
        const veri = { title: t('uygulama.ad'), text: t('davet.metin'), url: location.href.split('#')[0] };
        try { if (navigator.share) await navigator.share(veri); else { await navigator.clipboard.writeText(`${veri.text} ${veri.url}`); duyur(t('ht.kopyalandi')); } } catch { /* vazgeçildi */ }
      } }, ikon('paylas', 18), t('davet.dugme')),
    ),
  );
  return null;
}

export default {
  kimlik: 'gelisim',
  surum: '0.6.0',
  onek: 'gls',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'gunluk'],
  ekranlar: {
    gelisim: ekran({ baslikAnahtari: 'ekran.gelisim', durumlar: DORT_DURUM, ciz }),
    profil: ekran({ baslikAnahtari: 'ekran.profil', durumlar: DORT_DURUM, ciz: profilCiz }),
  },
};

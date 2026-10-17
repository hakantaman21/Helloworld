// v0.26.0 Destek merkezi (/destek): şikâyet, hata, öneri ve görüş gönder; geçmişini gör, sonuçlanmamış kaydı geri al;
// yönetimin yanıtı kaydın altında. Kişi şikâyetleri kişi profilinden/mesajdan yapılır ve burada geçmişte görünür.
// Şimdilik kayıtlar cihazda; sunucu açılınca aynı ekran sunucudaki kayıtları gösterir (dürüstlük notu ekranda).
import './destek.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, ustBaslik, yerlestir, sekmeler, onayIste, goreliZaman, testEtiketi } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { destekKayitlari, destekGonder, geriAl, GERI_ALINABILIR } from '../../cekirdek/destek.js';
import { DESTEK_TURLERI } from '../../veri/destek-kurallari.js';
import { testProfiliHam } from '../../cekirdek/test-modu.js';
let sekme = 'yeni';
let secilenTur = 'gorus';

function ciz(kok, b) {
  kok.classList.add('dst-ekran');
  if (b.p.k) sekme = 'gecmis';
  const yenile = () => ciz(kok, b);
  const kayitlar = destekKayitlari();
  const govde = h('div', { class: 'dst-govde' });

  function yeniCiz() {
    const metin = h('textarea', { class: 'b-girdi dst-metin', rows: '6', maxlength: '2000', placeholder: t(`destek.ornek.${secilenTur}`), 'aria-label': t('destek.metinEtiket') });
    const turler = h('div', { class: 'dst-turler', role: 'radiogroup', 'aria-label': t('destek.turEtiket') },
      DESTEK_TURLERI.map((tur) => h('button', { type: 'button', role: 'radio', class: 'dst-tur', 'aria-checked': String(tur === secilenTur), onClick: () => { secilenTur = tur; yeniCiz(); } },
        h('b', null, t(`destek.tur.${tur}`)), h('small', null, t(`destek.turAlt.${tur}`)))));
    yerlestir(govde,
      turler,
      secilenTur === 'sikayet' ? h('p', { class: 'dst-not' }, ikon('kalkan', 16), h('span', null, t('destek.kisiSikayetNotu'))) : null,
      metin,
      h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => {
        const m = metin.value.trim();
        if (m.length < 5) { duyur(t('destek.kisaMetin')); metin.focus(); return; }
        destekGonder({ tur: secilenTur, kategori: secilenTur === 'sikayet' ? 'diger' : null, metin: m });
        duyur(t('destek.gonderildi'), 3500);
        sekme = 'gecmis'; yenile();
      } }, ikon('gonder', 18), t('destek.gonder')),
      h('p', { class: 'dst-not dst-not-kutu' }, t('destek.durustluk')),
    );
  }

  function kayitKarti(k) {
    const kisi = k.hedef && k.hedef.kimlik ? testProfiliHam(k.hedef.kimlik) : null;
    const hedefAdi = (k.hedef && k.hedef.ad) || (kisi && kisi.ad) || null;
    return h('article', { class: `dst-kayit${b.p.k === k.kimlik ? ' dst-kayit-odak' : ''}`, id: `dst-${k.kimlik}` },
      h('div', { class: 'dst-kayit-ust' },
        h('span', { class: `dst-etiket dst-etiket-${k.tur}` }, t(`destek.tur.${k.tur}`)),
        h('span', { class: `dst-durum dst-durum-${k.durum}` }, t(`destek.durum.${k.durum}`)),
        h('span', { class: 'b-kucuk dst-zaman' }, goreliZaman(k.zaman))),
      hedefAdi ? h('p', { class: 'dst-hedef' }, ikon('kisi', 14), t(k.hedef.tur === 'an' ? 'destek.hedefAn' : 'destek.hedefKisi', { ad: hedefAdi }), kisi ? testEtiketi() : null) : null,
      k.kategori && k.kategori !== 'diger' ? h('p', { class: 'b-kucuk' }, t(`test.sikayetNeden.${k.kategori}`)) : null,
      k.metin ? h('p', { class: 'dst-kayit-metin' }, k.metin) : null,
      (k.yanitlar || []).map((y) => h('div', { class: 'dst-yanit' }, h('b', null, t('destek.yonetimYaniti')), h('p', null, yerel(y.metin)), h('small', null, goreliZaman(y.zaman)))),
      GERI_ALINABILIR.includes(k.durum) ? h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve dst-geri-al', onClick: async () => {
        if (!(await onayIste({ metin: t('destek.geriAlOnay'), evet: t('destek.geriAl'), hayir: t('genel.vazgec') }))) return;
        duyur(geriAl(k.kimlik) ? t('destek.geriAlindi') : t('destek.geriAlinamaz')); yenile();
      } }, ikon('sol', 16), t(k.tur === 'sikayet' ? 'destek.sikayetiGeriAl' : 'destek.geriAl')) : null);
  }

  function gecmisCiz() {
    yerlestir(govde, kayitlar.length ? kayitlar.map(kayitKarti)
      : h('div', { class: 'b-durum' }, ikon('kalem', 28), h('p', null, t('destek.gecmisBos'))));
    if (b.p.k) requestAnimationFrame(() => { const el = kok.querySelector(`#dst-${CSS.escape(b.p.k)}`); if (el) el.scrollIntoView({ block: 'center' }); });
  }

  yerlestir(kok,
    ustBaslik({ baslik: t('destek.baslik'), ikon: 'kalem', alt: t('destek.alt'), geri: () => b.geri('/bugun') }),
    sekmeler([['yeni', t('destek.sekme.yeni')], ['gecmis', t('destek.sekme.gecmis', { n: kayitlar.length })]], sekme, (id) => { sekme = id; (id === 'yeni' ? yeniCiz : gecmisCiz)(); }, { tur: 'hap' }),
    govde);
  (sekme === 'yeni' ? yeniCiz : gecmisCiz)();
  return null;
}

export default {
  kimlik: 'destek',
  surum: '0.26.0',
  onek: 'dst',
  semaSurumu: 1,
  ekranlar: { destek: ekran({ baslikAnahtari: 'destek.baslik', durumlar: DORT_DURUM, ciz }) },
};

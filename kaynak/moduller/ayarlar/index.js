// Profil ve ayarlar: kontrol kullanıcıda (Anayasa bölüm 3). Gizlilik görünür; veriler indirilebilir ve silinebilir.
import './ayarlar.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ustBaslik, onayIste, yerlestir } from '../../cekirdek/arayuz.js';
import { t, dilAyarla, ARAYUZ_DILLERI } from '../../cekirdek/metin.js';
import { al, degistir, sifirla, disaAktarMetni } from '../../cekirdek/depo.js';
import { siradaki } from '../../cekirdek/gunluk.js';
import { simdiAra } from '../../cekirdek/zamanlayici.js';
import { SEVIYE_SIRASI } from '../../cekirdek/oneri.js';
import { SURUM } from '../../cekirdek/surum.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { destek } from '../../cekirdek/ses/ses-hatti.js';

function secimGrubu({ etiket, aciklama, secenekler, aktif, degisti }) {
  const kimlik = 'ayr-' + Math.random().toString(36).slice(2, 7);
  return h('div', { class: 'ayr-satir' },
    h('div', { class: 'b-etiket', id: kimlik }, etiket),
    aciklama ? h('p', { class: 'b-kucuk' }, aciklama) : null,
    h('div', { class: 'b-cipler', role: 'radiogroup', 'aria-labelledby': kimlik },
      secenekler.map(([deger, metin]) => h('button', {
        class: 'b-dugme b-dugme-cerceve',
        role: 'radio',
        'aria-checked': deger === aktif ? 'true' : 'false',
        onClick: (e) => {
          for (const d of e.currentTarget.parentElement.children) d.setAttribute('aria-checked', 'false');
          e.currentTarget.setAttribute('aria-checked', 'true');
          degisti(deger);
        },
      }, metin))),
  );
}

function ayarKaydet(fn) {
  degistir((v) => fn(v.profil));
  duyur(t('ayarlar.kaydedildi'), 1500);
}

function ciz(kok, b) {
  const p = al().profil;
  const a = p.ayarlar;
  const adGirdisi = h('input', { id: 'ayr-ad', class: 'b-girdi', type: 'text', value: p.ad, autocomplete: 'given-name' });
  adGirdisi.addEventListener('change', () => { const ad = adGirdisi.value.trim(); if (ad) ayarKaydet((pr) => { pr.ad = ad; }); });
  const saatGirdisi = (kimlik, anahtar) => {
    const g = h('input', { id: kimlik, class: 'b-girdi', type: 'time', value: a[anahtar] });
    g.addEventListener('change', () => { if (g.value) ayarKaydet((pr) => { pr.ayarlar[anahtar] = g.value; }); });
    return g;
  };

  yerlestir(kok, 
    ustBaslik({ tabela: t('ayarlar.tabela'), baslik: t('ayarlar.baslik'), geri: () => b.geri('/gelisim') }),

    h('section', { class: 'b-kart ayr-bolum' },
      secimGrubu({
        etiket: t('ayarlar.arayuzDili'),
        secenekler: ARAYUZ_DILLERI.map((d) => [d, d.toUpperCase()]),
        aktif: a.arayuzDili,
        degisti: (d) => { degistir((v) => { v.profil.ayarlar.arayuzDili = d; }); dilAyarla(d); ciz(kok, b); },
      }),
      secimGrubu({
        etiket: t('ayarlar.rol'),
        secenekler: ['ogrenen', 'yardimci'].map((r) => [r, t(`gelisim.rol.${r}`)]),
        aktif: p.rol,
        degisti: (r) => ayarKaydet((pr) => { pr.rol = r; }),
      }),
    ),

    h('section', { class: 'b-kart ayr-bolum' },
      h('div', { class: 'ayr-satir' }, h('label', { class: 'b-etiket', for: 'ayr-ad' }, t('ayarlar.ad')), adGirdisi),
      secimGrubu({
        etiket: t('ayarlar.seviye'),
        secenekler: SEVIYE_SIRASI.slice(0, 4).map((s) => [s, s]),
        aktif: p.seviye,
        degisti: (s) => ayarKaydet((pr) => { pr.seviye = s; }),
      }),
    ),

    h('section', { class: 'b-kart ayr-bolum' },
      h('h2', { class: 'b-bolum-baslik' }, t('ayarlar.saatler')),
      h('div', { class: 'b-izgara-2' },
        h('div', { class: 'ayr-satir' }, h('label', { class: 'b-etiket', for: 'ayr-sabah' }, t('ayarlar.sabah')), saatGirdisi('ayr-sabah', 'sabahSaati')),
        h('div', { class: 'ayr-satir' }, h('label', { class: 'b-etiket', for: 'ayr-aksam' }, t('ayarlar.aksam')), saatGirdisi('ayr-aksam', 'aksamSaati')),
      ),
    ),

    h('section', { class: 'b-kart ayr-bolum' },
      secimGrubu({
        etiket: t('ayarlar.duzeltme'),
        aciklama: t('ayarlar.duzeltmeAciklama'),
        secenekler: ['az', 'orta', 'cok'].map((k) => [k, t(`ayarlar.duzeltmeSecenek.${k}`)]),
        aktif: a.duzeltmeYogunlugu,
        degisti: (k) => ayarKaydet((pr) => { pr.ayarlar.duzeltmeYogunlugu = k; }),
      }),
      secimGrubu({
        etiket: t('ayarlar.hiz'),
        secenekler: ['yavas', 'normal', 'hizli'].map((k) => [k, t(`ayarlar.hizSecenek.${k}`)]),
        aktif: a.kocHizi,
        degisti: (k) => ayarKaydet((pr) => { pr.ayarlar.kocHizi = k; }),
      }),
      h('h2', { class: 'b-bolum-baslik' }, t('ayarlar.gorunumBaslik')),
      secimGrubu({
        etiket: t('ayarlar.gorunum'),
        aciklama: t('ayarlar.gorunumAciklama'),
        secenekler: ['dengeli', 'kompakt'].map((k) => [k, t('ayarlar.gorunumSecenek.' + k)]),
        aktif: a.gorunum || 'dengeli',
        degisti: (k) => ayarKaydet((pr) => { pr.ayarlar.gorunum = k; }),
      }),
      secimGrubu({
        etiket: t('ayarlar.tema'),
        secenekler: ['sistem', 'acik', 'koyu'].map((k) => [k, t(`ayarlar.temaSecenek.${k}`)]),
        aktif: a.tema,
        degisti: (k) => ayarKaydet((pr) => { pr.ayarlar.tema = k; }),
      }),
      destek.tanima ? h('label', { class: 'ayr-anahtar' },
        h('input', {
          type: 'checkbox',
          checked: a.yaziliMod,
          onChange: (e) => ayarKaydet((pr) => { pr.ayarlar.yaziliMod = e.currentTarget.checked; }),
        }),
        h('span', null, t('ayarlar.yazili')),
      ) : null,
    ),

    h('section', { class: 'b-kart ayr-bolum' },
      h('h2', { class: 'b-bolum-baslik' }, t('ayarlar.deneme')),
      h('button', {
        class: 'b-dugme',
        onClick: () => {
          const sira = siradaki();
          simdiAra(sira === 'aksam' ? 'aksam' : 'sabah');
        },
      }, t('ayarlar.demoArama')),
    ),

    h('section', { class: 'b-kart ayr-bolum' },
      h('h2', { class: 'b-bolum-baslik' }, t('ayarlar.gizlilik')),
      h('p', { class: 'b-kucuk' }, t('ayarlar.gizlilikMetni')),
      h('div', { class: 'b-yigin' },
        h('button', {
          class: 'b-dugme b-dugme-cerceve',
          onClick: () => {
            const blob = new Blob([disaAktarMetni()], { type: 'application/json' });
            const baglanti = h('a', { href: URL.createObjectURL(blob), download: 'konusma-kocu-verilerim.json' });
            document.body.append(baglanti);
            baglanti.click();
            baglanti.remove();
          },
        }, t('ayarlar.disaAktar')),
        h('button', {
          class: 'b-dugme b-dugme-tehlike',
          onClick: async () => {
            const evet = await onayIste({ metin: t('ayarlar.silOnay'), evet: t('ayarlar.silEvet'), hayir: t('genel.vazgec') });
            if (!evet) return;
            sifirla();
            duyur(t('ayarlar.silindi'));
            b.git('/karsilama', { degistir: true });
          },
        }, t('ayarlar.sil')),
      ),
    ),

    h('p', { class: 'b-kucuk ayr-surum' }, t('ayarlar.surum', { s: SURUM, saglayici: a.saglayici })),
  );
  return null;
}

export default {
  kimlik: 'ayarlar',
  surum: '0.2.6',
  onek: 'ayr',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'zamanlayici'],
  ekranlar: {
    ayarlar: ekran({ baslikAnahtari: 'ekran.ayarlar', durumlar: DORT_DURUM, ciz }),
  },
};

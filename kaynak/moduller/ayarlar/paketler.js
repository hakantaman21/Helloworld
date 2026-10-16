// v0.18.0 Paketler ekranı (/paketler) ve Ayarlar › Uygulama kilidi grubu.
// Paketler: üç paket kartı, bugünkü yeni kişi kullanımı, TEST etkinleştirme (ödeme sağlayıcısı kararına kadar) ve
// English Prime'daki gibi DÜZENLEME MODU: ad, fiyat, günlük yeni kişi sınırı, özellikler ve açıklama satırları.
import { h, ikon, ikon3d, ustBaslik, yerlestir, onayIste } from '../../cekirdek/arayuz.js';
import { t, yerel, aktifDil } from '../../cekirdek/metin.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { PAKET_SIRASI, OZELLIKLER, paketTanimlari, paketTanimiDegistir, paketleriVarsayilanaDondur, aktifPaketKimligi, paketEtkinlestir, bugunYeniKisiler, yeniKisiSiniri, ozellikVar } from '../../cekirdek/paketler.js';
import { kilitAyari, kilitEtkin, KAPSAMLAR, SURELER, sifreKaydet, kilidiKapat, pinTuslari, desenAlani, biyometriDestekli, biyometriKaydet, biyometriKapat, kilitEkrani, acikSay } from '../../cekirdek/kilit.js';
import { degistir } from '../../cekirdek/depo.js';

let duzenleModu = false;
const fiyat = (n) => (n ? new Intl.NumberFormat(aktifDil(), { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n) : t('paket.bedava'));

export function paketlerCiz(kok, b) {
  kok.classList.add('ayr-ekran');
  const tanim = paketTanimlari();
  const aktif = aktifPaketKimligi();
  const sinir = yeniKisiSiniri();
  const yenile = () => paketlerCiz(kok, b);

  const kart = (k) => {
    const p = tanim[k];
    const benim = k === aktif;
    return h('section', { class: `b-platform ayr-pkt ayr-pkt-${k}${benim ? ' ayr-pkt-aktif' : ''}`, 'aria-labelledby': `ayr-pkt-${k}` },
      h('div', { class: 'ayr-pkt-ust' },
        h('span', { class: `ayr-pkt-ikon b-kutu-${p.renk}` }, ikon3d(k === 'premium' ? 'kupa' : k === 'plus' ? 'yildiz' : 'hediye', 34)),
        h('div', { class: 'ayr-pkt-ad' }, h('h2', { id: `ayr-pkt-${k}` }, yerel(p.ad)), benim ? h('span', { class: 'b-etiket-hap b-etiket-hap-iyi' }, t('paket.seninPaketin')) : null),
        p.aylik ? h('div', { class: 'ayr-pkt-fiyat' }, h('b', null, fiyat(p.aylik)), p.aylik ? h('small', null, t('paket.ayda')) : null, p.yillik ? h('small', null, t('paket.yillik', { f: fiyat(p.yillik) })) : null) : null),
      h('ul', { class: 'ayr-pkt-satirlar' }, (p.satirlar[aktifDil()] || p.satirlar.tr).map((s) => h('li', null, ikon('onay', 14), s))),
      h('ul', { class: 'ayr-pkt-ozellikler' },
        h('li', null, h('span', null, t('paket.gunlukYeniKisi')), h('b', null, p.gunlukYeniKisi ? String(p.gunlukYeniKisi) : t('paket.sinirsiz'))),
        OZELLIKLER.map((o) => h('li', { class: p.ozellikler[o] ? null : 'ayr-pkt-yok' }, h('span', null, t(`paket.ozellik.${o}`)), ikon(p.ozellikler[o] ? 'onay' : 'kapat', 14)))),
      benim ? null : h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: async () => {
        const evet = await onayIste({ baslik: t('paket.etkinlestirBaslik', { ad: yerel(p.ad) }), metin: t('paket.etkinlestirMetin'), evet: t('paket.testEtkinlestir'), hayir: t('genel.vazgec') });
        if (!evet) return;
        paketEtkinlestir(k); duyur(t('paket.etkinlesti', { ad: yerel(p.ad) })); yenile();
      } }, t('paket.sec', { ad: yerel(p.ad) })),
      duzenleModu ? duzenleAlani(k, p, yenile) : null);
  };

  yerlestir(kok,
    ustBaslik({ baslik: t('paket.baslik'), ikon: 'hediye', geri: () => b.geri('/ayarlar') }),
    h('div', { class: 'b-kart ayr-pkt-kullanim' },
      h('span', { class: 'b-ust-etiket' }, t('paket.bugun')),
      h('b', null, sinir ? t('paket.kullanim', { n: bugunYeniKisiler().length, s: sinir }) : t('paket.kullanimSinirsiz', { n: bugunYeniKisiler().length })),
      h('p', { class: 'b-kucuk' }, t('paket.kullanimAciklama'))),
    PAKET_SIRASI.map(kart),
    h('p', { class: 'ayr-not ayr-not-kutu' }, t('paket.odemeNotu')),
    h('label', { class: 'ayr-satir ayr-anahtar ayr-pkt-duzen' },
      h('span', { class: 'ayr-satir-metin' }, h('span', { class: 'ayr-satir-etiket' }, t('paket.duzenleModu')), h('span', { class: 'ayr-satir-aciklama' }, t('paket.duzenleAciklama'))),
      h('input', { type: 'checkbox', class: 'ayr-anahtar-girdi', checked: duzenleModu, onChange: (e) => { duzenleModu = e.currentTarget.checked; yenile(); } }),
      h('span', { class: 'ayr-anahtar-iz', 'aria-hidden': 'true' })),
    duzenleModu ? h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: async () => {
      if (!(await onayIste({ metin: t('paket.varsayilanOnay'), evet: t('paket.varsayilan'), hayir: t('genel.vazgec') }))) return;
      paketleriVarsayilanaDondur(); duyur(t('paket.varsayilanaDondu')); yenile();
    } }, t('paket.varsayilan')) : null,
  );
  return null;
}

function duzenleAlani(k, p, yenile) {
  const dil = aktifDil() === 'en' ? 'en' : 'tr';
  const say = (etiket, deger, yaz) => h('label', { class: 'ayr-pkt-alan' }, h('span', null, etiket),
    h('input', { type: 'number', min: '0', step: '1', class: 'b-girdi', value: String(deger), onChange: (e) => { const n = Math.max(0, Math.round(Number(e.currentTarget.value) || 0)); paketTanimiDegistir(k, (x) => yaz(x, n)); duyur(t('paket.kaydedildi'), 1500); } }));
  return h('div', { class: 'ayr-pkt-duzenle' },
    h('span', { class: 'b-ust-etiket' }, t('paket.duzenleBaslik')),
    h('label', { class: 'ayr-pkt-alan' }, h('span', null, t('paket.alan.ad')),
      h('input', { type: 'text', class: 'b-girdi', value: p.ad[dil], maxlength: 24, onChange: (e) => { const v = e.currentTarget.value.trim(); if (v) { paketTanimiDegistir(k, (x) => { x.ad[dil] = v; }); yenile(); } } })),
    say(t('paket.alan.aylik'), p.aylik, (x, n) => { x.aylik = n; }),
    say(t('paket.alan.yillik'), p.yillik, (x, n) => { x.yillik = n; }),
    say(t('paket.alan.gunluk'), p.gunlukYeniKisi, (x, n) => { x.gunlukYeniKisi = n; }),
    h('fieldset', { class: 'ayr-pkt-oz' }, h('legend', null, t('paket.alan.ozellikler')),
      OZELLIKLER.map((o) => h('label', { class: 'ayr-pkt-oz-satir' },
        h('input', { type: 'checkbox', checked: Boolean(p.ozellikler[o]), onChange: (e) => { const v = e.currentTarget.checked; paketTanimiDegistir(k, (x) => { x.ozellikler[o] = v; }); yenile(); } }),
        t(`paket.ozellik.${o}`)))),
    h('label', { class: 'ayr-pkt-alan' }, h('span', null, t('paket.alan.satirlar')),
      h('textarea', { class: 'b-girdi', rows: 4, onChange: (e) => { const satirlar = e.currentTarget.value.split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 8); paketTanimiDegistir(k, (x) => { x.satirlar[dil] = satirlar; }); yenile(); } }, (p.satirlar[dil] || []).join('\n'))));
}

// ---- Ayarlar › Uygulama kilidi ----
export function kilitGrubu(b, yeniden) {
  const k = kilitAyari();
  const kap = h('div', { class: 'ayr-kilit' });
  if (!ozellikVar('uygulamaKilidi')) {
    yerlestir(kap,
      h('p', { class: 'ayr-not ayr-not-kutu' }, t('kilit.premiumNotu')),
      h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => b.git('/paketler') }, t('paket.paketleriGor')));
    return kap;
  }
  const satirAnahtar = (etiket, acik, fn, aciklama) => h('label', { class: 'ayr-satir ayr-anahtar' },
    h('span', { class: 'ayr-satir-metin' }, h('span', { class: 'ayr-satir-etiket' }, etiket), aciklama ? h('span', { class: 'ayr-satir-aciklama' }, aciklama) : null),
    h('input', { type: 'checkbox', class: 'ayr-anahtar-girdi', checked: acik, onChange: (e) => fn(e.currentTarget.checked, e.currentTarget) }),
    h('span', { class: 'ayr-anahtar-iz', 'aria-hidden': 'true' }));
  const seg = (deger, secenekler, fn) => h('div', { class: 'ayr-seg', role: 'radiogroup' }, secenekler.map(([d, ad]) => h('button', { type: 'button', class: 'ayr-seg-oge', role: 'radio', 'aria-checked': String(d === deger), onClick: () => fn(d) }, ad)));
  const ayarla = (fn) => { degistir((v) => { const x = kilitAyari(); fn(x); v.profil.ayarlar.kilit = x; }); yeniden(); };

  yerlestir(kap,
    h('p', { class: 'ayr-not ayr-not-kutu' }, t('kilit.durustluk')),
    satirAnahtar(t('kilit.ac'), kilitEtkin(), async (acik, girdi) => {
      if (!acik) { kilidiKapat(); duyur(t('kilit.kapandi')); yeniden(); return; }
      girdi.checked = false;
      const tamam = await kurulumPenceresi(k.yontem || 'pin');
      if (tamam) { ayarla((x) => { x.acik = true; }); duyur(t('kilit.acildi')); }
    }, t('kilit.acAciklama')),
    kilitEtkin() ? h('div', { class: 'ayr-kilit-ayarlar' },
      h('span', { class: 'ayr-satir-etiket' }, t('kilit.kapsam')),
      seg(k.kapsam, KAPSAMLAR.map((x) => [x, t(`kilit.kapsamSecenek.${x}`)]), (x) => ayarla((y) => { y.kapsam = x; })),
      h('span', { class: 'ayr-satir-etiket' }, t('kilit.yontem')),
      seg(k.yontem, [['pin', t('kilit.yontemPin')], ['desen', t('kilit.yontemDesen')]], async (x) => { if (x === k.yontem) return; if (await kurulumPenceresi(x)) { duyur(t('kilit.degisti')); yeniden(); } }),
      h('span', { class: 'ayr-satir-etiket' }, t('kilit.otomatik')),
      seg(k.sureDk, SURELER.map((d) => [d, d ? t('kilit.dk', { n: d }) : t('kilit.hemen')]), (d) => ayarla((y) => { y.sureDk = d; })),
      biyoSatiri(k, yeniden),
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => kilitEkrani(() => duyur(t('kilit.denemeTamam'))) }, t('kilit.dene'))) : null);
  return kap;
}

function biyoSatiri(k, yeniden) {
  const satir = h('div', { class: 'ayr-kilit-biyo' }, h('p', { class: 'b-kucuk' }, t('kilit.biyoDenetleniyor')));
  biyometriDestekli().then((var_) => {
    if (!var_) { yerlestir(satir, h('p', { class: 'b-kucuk' }, t('kilit.biyoYok'))); return; }
    yerlestir(satir, h('label', { class: 'ayr-satir ayr-anahtar' },
      h('span', { class: 'ayr-satir-metin' }, h('span', { class: 'ayr-satir-etiket' }, t('kilit.biyo')), h('span', { class: 'ayr-satir-aciklama' }, t('kilit.biyoAciklama'))),
      h('input', { type: 'checkbox', class: 'ayr-anahtar-girdi', checked: Boolean(k.biyometri), onChange: async (e) => {
        if (!e.currentTarget.checked) { biyometriKapat(); yeniden(); return; }
        try { await biyometriKaydet(); duyur(t('kilit.biyoEklendi')); } catch { e.currentTarget.checked = false; duyur(t('kilit.biyoOlmadi')); }
        yeniden();
      } }),
      h('span', { class: 'ayr-anahtar-iz', 'aria-hidden': 'true' })));
  });
  return satir;
}

// PIN ya da desen belirleme: iki kez girilir; eşleşirse kaydedilir. Döner: true/false.
function kurulumPenceresi(yontem) {
  return new Promise((coz) => {
    let ilk = null;
    const mesaj = h('p', { class: 'b-kilit-mesaj', role: 'status', 'aria-live': 'polite' }, t(yontem === 'pin' ? 'kilit.pinBelirle' : 'kilit.desenBelirle'));
    const kapat = (s) => { perde.remove(); coz(s); };
    const al = async (d) => {
      if (!ilk) { ilk = d; mesaj.textContent = t(yontem === 'pin' ? 'kilit.pinTekrar' : 'kilit.desenTekrar'); return; }
      if (d !== ilk) { ilk = null; mesaj.textContent = t('kilit.eslesmedi'); return; }
      await sifreKaydet(yontem, d);
      acikSay();
      kapat(true);
    };
    const giris = yontem === 'pin' ? pinTuslari(al) : desenAlani(al);
    if (yontem !== 'pin') giris.firstChild.addEventListener('kisa', () => { mesaj.textContent = t('kilit.desenKisa'); });
    const perde = h('div', { class: 'b-perde', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('kilit.kurulum') },
      h('div', { class: 'b-pencere ayr-kilit-kurulum' },
        h('h2', { class: 'b-bolum-baslik' }, t('kilit.kurulum')), mesaj, giris,
        h('button', { type: 'button', class: 'b-dugme', 'data-vazgec': '', onClick: () => kapat(false) }, t('genel.vazgec'))));
    document.body.append(perde);
    const odak = perde.querySelector('button, [tabindex="0"]'); if (odak) odak.focus();
  });
}

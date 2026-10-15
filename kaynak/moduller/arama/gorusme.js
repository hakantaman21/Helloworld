// Görüşme ekranı. Yalnız dört öğe öne çıkar: koç, canlı altyazı, ipucu çekmecesi, bitir (Anayasa bölüm 4).
// Y19: konuşma sırasında düzeltme gösterilmez; düzeltmeler karnede toplanır.
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, durumKutusu, onayIste, yerlestir, yzEtiketi } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { oturumBaslat } from '../../cekirdek/ai/adaptor.js';
import { destek, soyle, sus, dinle } from '../../cekirdek/ses/ses-hatti.js';
import { izinDurumu, mikrofonIste } from '../../cekirdek/izin.js';
import { vadesiGelenler } from '../../cekirdek/hafiza.js';
import { sonucuIsle, yarimKalaniKaydet, yarimKalan } from '../../cekirdek/gorusme-sonucu.js';
import { sureYaz } from '../../cekirdek/zaman.js';
import { duyur } from '../../cekirdek/duyuru.js';

const SESSIZLIK_MS = 3000;
const YAZILI_IPUCU_MS = 9000;
const BOS_DINLEME_SINIRI = 3;

export const gorusme = ekran({
  baslikAnahtari: 'ekran.gorusme',
  durumlar: DORT_DURUM,
  ciz(kok, b) {
    const tur = ['sabah', 'aksam', 'tanisma', 'tekrar', 'senaryo'].includes(b.p.tur) ? b.p.tur : 'senaryo';
    const v = al();
    const ayar = v.profil.ayarlar;
    const sorguParametreleri = new URLSearchParams(b.p);
    sorguParametreleri.delete('devam');
    sorguParametreleri.delete('yazili');
    const sorgu = sorguParametreleri.toString();

    const hafizaOgeleri = tur === 'aksam' || tur === 'tekrar' ? vadesiGelenler() : [];
    if (tur === 'tekrar' && !hafizaOgeleri.length) {
      yerlestir(kok, durumKutusu('bos', t('gorusme.tekrarYok'), { metin: t('genel.geri'), fn: () => b.geri('/hafiza') }));
      return null;
    }

    const yarim = b.p.devam === '1' ? yarimKalan() : null;
    let yazili = b.p.yazili === '1' || ayar.yaziliMod || !destek.tanima;
    if (!navigator.onLine && !yazili) {
      yazili = true;
      duyur(t('gorusme.aglarYok'), 5000);
    }

    let oturum;
    try {
      oturum = oturumBaslat({
        tur,
        senaryoId: b.p.id,
        profil: v.profil,
        hafizaOgeleri,
        yazili,
        onceki: yarim && yarim.sorgu === sorgu ? yarim.durum : null,
        saglayici: ayar.saglayici,
      });
    } catch (hata) {
      yerlestir(kok, durumKutusu('hata', t('gorusme.bulunamadi'), { metin: t('genel.geri'), fn: () => b.geri() }));
      return null;
    }

    const kaynak = oturum.kaynak;
    const baslik = tur === 'senaryo' ? yerel(kaynak.baslik) : t(`gorusme.baslik.${tur}`);
    const kocAdi = tur === 'senaryo' ? yerel(kaynak.roller.koc) : t('koc.ad');

    // --- durum ---
    let aktif = true;
    let bitti = false;
    let sure = 0;
    let dinleyici = null;
    let bosDinleme = 0;
    let ipucuZamanlayici = null;
    let durum = 'basliyor';

    // --- öğeler ---
    const sureOgesi = h('span', { class: 'b-kucuk' }, '00:00');
    const ilerlemeOgesi = h('span', { class: 'b-kucuk' });
    const mikCip = h('span', { class: 'b-cip ara-mik' });
    const durumOgesi = h('p', { class: 'b-kucuk ara-durum', 'aria-live': 'polite' });
    const avatar = h('button', { class: 'ara-avatar', type: 'button', 'aria-label': kocAdi, onClick: () => { if (durum === 'koc') sus(); } }, ikon('dalga', 56, 2));
    const kocMetni = h('p', { class: 'ara-koc-metni', lang: 'en' });
    const kullaniciMetni = h('p', { class: 'ara-kullanici-metni', lang: 'en' });
    const altyazi = h('section', { class: 'b-kart ara-altyazi', 'aria-label': t('gorusme.altyaziBaslik') },
      h('span', { class: 'b-ust-etiket' }, t('gorusme.altyaziBaslik')), kocMetni, kullaniciMetni);
    const ipucuIcerik = h('div', { class: 'b-yigin' });
    const ipucu = h('section', { class: 'ara-ipucu', hidden: true, 'aria-live': 'polite' },
      h('div', { class: 'b-satir' },
        h('span', { class: 'ara-ipucu-baslik b-buyut' }, t('gorusme.ipucuBaslik')),
        h('button', { class: 'b-dugme b-dugme-metin ara-ipucu-kapat', 'aria-label': t('gorusme.ipucuKapat'), onClick: () => ipucuKapat() }, ikon('kapat', 18)),
      ),
      ipucuIcerik,
    );
    const girdi = h('input', { class: 'b-girdi', type: 'text', lang: 'en', autocomplete: 'off', placeholder: t('gorusme.yazYerTutucu'), 'aria-label': t('gorusme.yazEtiket') });
    const yaziSatiri = h('form', {
      class: 'ara-yazi-satiri',
      onSubmit: (e) => {
        e.preventDefault();
        const metin = girdi.value.trim();
        if (!metin || durum === 'dusunuyor' || bitti) return;
        girdi.value = '';
        kullaniciSoyledi(metin, 0);
      },
    }, girdi, h('button', { class: 'b-dugme b-dugme-yuvarlak ara-gonder', type: 'submit', 'aria-label': t('gorusme.gonder') }, ikon('gonder', 20)));
    girdi.addEventListener('input', () => ipucuZamanlayiciIptal());
    const konusDugmesi = h('button', { class: 'b-dugme ara-konus', hidden: true, onClick: () => { konusDugmesi.hidden = true; bosDinleme = 0; dinlemeBaslat(); } }, ikon('mikrofon', 20), t('gorusme.konusDugmesi'));
    const modDugmesi = h('button', { class: 'b-dugme b-dugme-cerceve ara-alt-dugme', onClick: () => (yazili ? sesliyeGec() : yaziliyaGec()) });
    const altyaziDugmesi = h('button', {
      class: 'b-dugme b-dugme-cerceve ara-alt-dugme',
      'aria-pressed': 'true',
      onClick: () => {
        altyazi.hidden = !altyazi.hidden;
        altyaziDugmesi.setAttribute('aria-pressed', altyazi.hidden ? 'false' : 'true');
      },
    }, ikon('altyazi', 20), t('gorusme.altyazi'));

    kok.classList.add('b-ekran-tam', 'ara-gorusme');
    yerlestir(kok, 
      h('header', { class: 'ara-ust' },
        h('div', { class: 'b-ust-metin' },
          h('h1', { class: 'ara-baslik' }, baslik),
          h('div', { class: 'b-satir' }, yzEtiketi(), sureOgesi, ilerlemeOgesi),
        ),
        mikCip,
      ),
      h('div', { class: 'ara-sahne' },
        avatar,
        h('p', { class: 'ara-koc-adi' }, kocAdi),
        durumOgesi,
        tur === 'senaryo' ? h('p', { class: 'b-kucuk ara-gorev' }, t('gorusme.gorev', { gorev: yerel(kaynak.gorev.aciklama) })) : null,
      ),
      altyazi,
      h('div', { class: 'b-buyut' }),
      h('div', { class: 'ara-alt' },
        ipucu,
        konusDugmesi,
        yaziSatiri,
        h('div', { class: 'ara-alt-cubuk' },
          altyaziDugmesi,
          h('button', { class: 'b-dugme b-dugme-cerceve ara-alt-dugme', onClick: () => (ipucu.hidden ? ipucuAc() : ipucuKapat()) }, ikon('ampul', 20), t('gorusme.ipucu')),
          modDugmesi,
          h('button', { class: 'b-dugme ara-bitir', onClick: bitirIstegi }, ikon('kapat', 18, 2.4), t('gorusme.bitir')),
        ),
      ),
    );

    // --- yardımcılar ---
    function arayuzuGuncelle() {
      durumOgesi.textContent = t(`gorusme.durum.${durum}`);
      avatar.classList.toggle('ara-avatar-konusuyor', durum === 'koc');
      avatar.classList.toggle('ara-avatar-dinliyor', durum === 'dinliyor');
      if (yazili) {
        mikCip.textContent = t('gorusme.yaziliMod');
        mikCip.className = 'b-cip ara-mik';
      } else if (durum === 'dinliyor') {
        mikCip.replaceChildren(ikon('mikrofon', 14, 2.4), t('gorusme.mikAcik'));
        mikCip.className = 'b-cip b-cip-iyi ara-mik';
      } else {
        mikCip.textContent = t('gorusme.mikKapali');
        mikCip.className = 'b-cip ara-mik';
      }
      yaziSatiri.hidden = !yazili;
      if (yazili) konusDugmesi.hidden = true;
      modDugmesi.replaceChildren(ikon(yazili ? 'mikrofon' : 'klavye', 20), t(yazili ? 'gorusme.sesliyeGec' : 'gorusme.yaziyaGec'));
      modDugmesi.hidden = !destek.tanima;
      const il = oturum.ilerleme();
      ilerlemeOgesi.textContent = '· ' + t('gorusme.ilerleme', { adim: Math.min(il.adim + 1, il.toplam), toplam: il.toplam });
    }

    function durumAyarla(yeni) {
      durum = yeni;
      arayuzuGuncelle();
    }

    function ipucuZamanlayiciIptal() {
      if (ipucuZamanlayici) { clearTimeout(ipucuZamanlayici); ipucuZamanlayici = null; }
    }

    function ipucuAc(ceviriler) {
      const veri = oturum.ipucu();
      const liste = ceviriler && ceviriler.length ? ceviriler : veri.ceviriler;
      yerlestir(ipucuIcerik, 
        liste.map((c) => h('p', { class: 'ara-ipucu-ceviri' }, t('gorusme.ipucuCeviri', { tr: c.tr, en: c.en }))),
        veri.kaliplar.map((k, i) => h('p', { class: 'ara-ipucu-kalip', lang: 'en' }, `${i + 1}. ${k}`)),
      );
      ipucu.hidden = false;
    }

    function ipucuKapat() {
      ipucu.hidden = true;
    }

    function dinlemeyiDurdur() {
      if (dinleyici) { dinleyici.iptal(); dinleyici = null; }
    }

    function yaziliyaGec(mesaj) {
      yazili = true;
      dinlemeyiDurdur();
      if (mesaj) duyur(mesaj, 5000);
      if (durum === 'dinliyor' || durum === 'bekliyor') siraKullanicida();
      else arayuzuGuncelle();
    }

    async function sesliyeGec() {
      if (!destek.tanima) return;
      if (izinDurumu() !== 'verildi') {
        const sonuc = await mikrofonIste();
        if (sonuc !== 'verildi') {
          if (sonuc === 'reddedildi') duyur(t('izin.reddedildi'), 5000);
          return;
        }
      }
      yazili = false;
      if (durum === 'bekliyor' || durum === 'dinliyor') siraKullanicida();
      else arayuzuGuncelle();
    }

    function dinlemeBaslat() {
      if (!aktif || yazili || bitti) return;
      kullaniciMetni.textContent = '';
      durumAyarla('dinliyor');
      try {
        dinleyici = dinle({
          sessizlikMs: SESSIZLIK_MS,
          onBasladi: () => ipucuZamanlayiciIptal(),
          onAra: (m) => { kullaniciMetni.textContent = t('gorusme.sen', { metin: m }); },
          onSessizlik: () => { if (aktif && !yazili) ipucuAc(); },
          onHata: (kod) => {
            if (kod === 'not-allowed' || kod === 'service-not-allowed') yaziliyaGec(t('izin.reddedildi'));
            else if (kod === 'network') yaziliyaGec(t('gorusme.aglarYok'));
            else if (kod === 'audio-capture') yaziliyaGec(t('gorusme.tanimaHatasi'));
          },
          onSonuc: ({ metin, guven }) => {
            dinleyici = null;
            if (!aktif || yazili || bitti) return;
            if (!metin) {
              bosDinleme += 1;
              if (bosDinleme >= BOS_DINLEME_SINIRI) {
                durumAyarla('bekliyor');
                konusDugmesi.hidden = false;
              } else {
                dinlemeBaslat();
              }
              return;
            }
            bosDinleme = 0;
            kullaniciSoyledi(metin, guven);
          },
        });
      } catch (hata) {
        yaziliyaGec(hata.message === 'izin-yok' ? null : t('gorusme.tanimaHatasi'));
      }
    }

    function siraKullanicida() {
      if (!aktif || bitti) return;
      if (yazili) {
        durumAyarla('bekliyor');
        ipucuZamanlayiciIptal();
        ipucuZamanlayici = setTimeout(() => { if (aktif && !girdi.value) ipucuAc(); }, YAZILI_IPUCU_MS);
        girdi.focus({ preventScroll: true });
      } else {
        dinlemeBaslat();
      }
    }

    async function kocSoyle(metin, yavas) {
      kocMetni.textContent = metin;
      durumAyarla('koc');
      if (!yazili && destek.sentez) await soyle(metin, yavas ? 'yavas' : ayar.kocHizi);
      if (!aktif) return;
      if (bitti) {
        // Yazılı modda koçun son cümlesi okunabilsin diye kısa bir bekleme
        if (yazili) await new Promise((coz) => setTimeout(coz, 2500));
        gorusmeyiBitir();
        return;
      }
      siraKullanicida();
    }

    function kullaniciSoyledi(metin, guven) {
      ipucuZamanlayiciIptal();
      ipucuKapat();
      kullaniciMetni.textContent = t('gorusme.sen', { metin });
      durumAyarla('dusunuyor');
      const cevap = oturum.cevapla(metin, guven);
      if (cevap.ceviriler && cevap.ceviriler.length) ipucuAc(cevap.ceviriler);
      if (cevap.bitti) bitti = true;
      kocSoyle(cevap.metin, cevap.yavas);
    }

    function gorusmeyiBitir() {
      if (!aktif) return;
      aktif = false;
      bitti = true;
      dinlemeyiDurdur();
      sus();
      const ozet = oturum.bitir(sure);
      sonucuIsle(ozet);
      b.git('/karne', { degistir: true });
    }

    async function bitirIstegi() {
      if (oturum.durum().cumleler.length === 0) {
        const cik = await onayIste({ metin: t('gorusme.bosBitir'), evet: t('gorusme.bosBitirEvet'), hayir: t('gorusme.bosBitirHayir') });
        if (cik) { aktif = false; dinlemeyiDurdur(); sus(); b.geri(); }
        return;
      }
      gorusmeyiBitir();
    }

    // --- başlat ---
    const saat = setInterval(() => { if (aktif) { sure += 1; sureOgesi.textContent = sureYaz(sure); } }, 1000);
    arayuzuGuncelle();

    (async () => {
      if (!yazili && izinDurumu() !== 'verildi') {
        const sonuc = await mikrofonIste();
        if (sonuc !== 'verildi') {
          yazili = true;
          if (sonuc === 'reddedildi') duyur(t('izin.reddedildi'), 5000);
        }
      }
      if (!aktif) return;
      kocSoyle(oturum.acilis().metin);
    })();

    return () => {
      const yarimda = aktif && !bitti && oturum.durum().cumleler.length > 0;
      aktif = false;
      clearInterval(saat);
      ipucuZamanlayiciIptal();
      dinlemeyiDurdur();
      sus();
      if (yarimda) yarimKalaniKaydet({ sorgu, baslik, durum: oturum.durum() });
    };
  },
});

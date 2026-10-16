// v0.17.0 Kişi eylemleri: Sohbet ve Bağlan'da bir kişiye basılı tutunca (ya da "…" ile) açılan ortak alt pencere.
// Arkadaş ekle / isteği geri al / kabul et / arkadaşlıktan çıkar · Favori · Başa sabitle · Profili gör · Mesaj.
import { h, ikon, onayIste } from './arayuz.js';
import { t } from './metin.js';
import { duyur } from './duyuru.js';
import { arkadasDurumu, istekGonder, istekGeriAl, arkadasYap, istekReddet, arkadasliktanCikar, favoriMi, favoriDegistir, sabitliMi, sabitleDegistir, SABIT_SINIRI } from './arkadaslik.js';
import { testYanitVerir, testMesajlari } from './test-modu.js';
import { ilkMesajKontrolu, yeniKisiSay, aktifPaketKimligi } from './paketler.js';

const KABUL_GECIKMESI = 2500;

// Arkadaşlık isteği gönder (test: etkin kişi kısa süre sonra kabul eder; çevrimdışı kişi beklemede kalır).
export function arkadaslikIstegi(profil, sonra) {
  istekGonder(profil.kimlik);
  duyur(t('arkadas.istekGonderildi', { ad: profil.ad }));
  if (testYanitVerir(profil)) {
    setTimeout(() => {
      if (arkadasDurumu(profil.kimlik) !== 'gonderildi') return;
      arkadasYap(profil.kimlik);
      duyur(t('arkadas.kabulEtti', { ad: profil.ad }), 3500);
      if (sonra) sonra();
    }, KABUL_GECIKMESI);
  }
}

export function arkadasEylemi(profil, sonra) {
  const d = arkadasDurumu(profil.kimlik);
  if (d === 'yok') { arkadaslikIstegi(profil, sonra); return; }
  if (d === 'gonderildi') { istekGeriAl(profil.kimlik); duyur(t('arkadas.istekGeriAlindi')); return; }
  if (d === 'gelen') { arkadasYap(profil.kimlik); duyur(t('arkadas.artikArkadas', { ad: profil.ad })); return; }
  arkadasliktanCikar(profil.kimlik); duyur(t('arkadas.cikarildi', { ad: profil.ad }));
}

export function arkadasEtiketi(kimlik) {
  return t(`arkadas.dugme.${arkadasDurumu(kimlik)}`);
}

export function kisiEylemleri(profil, { b, yenile, sohbetVar = false } = {}) {
  const kapat = () => perde.remove();
  const sonra = () => { if (yenile) yenile(); };
  const sec = (fn) => () => { kapat(); fn(); sonra(); };
  const d = arkadasDurumu(profil.kimlik);
  const secenekler = [
    [arkadasEtiketi(profil.kimlik), d === 'arkadas' ? 'kisi' : 'arti', () => arkadasEylemi(profil, sonra)],
    d === 'gelen' ? [t('arkadas.reddet'), 'kapat', () => { istekReddet(profil.kimlik); duyur(t('arkadas.reddedildi')); }] : null,
    [favoriMi(profil.kimlik) ? t('arkadas.favoridenCikar') : t('arkadas.favoriyeEkle'), 'yildiz', () => duyur(favoriDegistir(profil.kimlik) ? t('arkadas.favoriyeEklendi', { ad: profil.ad }) : t('arkadas.favoridenCikti'))],
    sohbetVar ? [sabitliMi(profil.kimlik) ? t('arkadas.sabitKaldir') : t('arkadas.basaSabitle'), 'yerImi', () => {
      const s = sabitleDegistir(profil.kimlik);
      duyur(s === 'sinir' ? t('arkadas.sabitSiniri', { n: SABIT_SINIRI }) : s === 'sabitlendi' ? t('arkadas.sabitlendi') : t('arkadas.sabitKalkti'));
    }] : null,
    b ? [t('test.profiliGor'), 'kisi', () => b.git(`/kisi?k=${profil.kimlik}`)] : null,
    b ? [t('arkadas.mesajYaz'), 'sohbet', () => b.git(`/mesaj?k=${profil.kimlik}`)] : null,
  ].filter(Boolean);
  const perde = h('div', { class: 'b-perde', role: 'dialog', 'aria-modal': 'true', 'aria-label': profil.ad, onClick: (e) => { if (e.target === perde) kapat(); } },
    h('div', { class: 'b-pencere b-kisi-eylem' },
      h('h2', { class: 'b-bolum-baslik' }, profil.ad),
      secenekler.map(([ad, ik, fn]) => h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve b-kisi-eylem-dugme', onClick: sec(fn) }, ikon(ik, 18), ad)),
      h('button', { type: 'button', class: 'b-dugme', 'data-vazgec': '', onClick: kapat }, t('genel.vazgec'))));
  document.body.append(perde);
  perde.querySelector('button').focus();
}

// Basılı tutma (dokunmatik ve fare): 500 ms. Basılı tutulduysa ardından gelen tıklama yutulur.
export function basiliTut(el, fn) {
  let zaman = null;
  let tutuldu = false;
  const iptal = () => { clearTimeout(zaman); zaman = null; };
  el.addEventListener('pointerdown', () => { tutuldu = false; iptal(); zaman = setTimeout(() => { tutuldu = true; fn(); }, 500); });
  ['pointerup', 'pointerleave', 'pointercancel', 'pointermove'].forEach((o) => el.addEventListener(o, (e) => { if (o !== 'pointermove' || (e.movementX ** 2 + e.movementY ** 2) > 25) iptal(); }));
  el.addEventListener('click', (e) => { if (tutuldu) { e.preventDefault(); e.stopImmediatePropagation(); tutuldu = false; } }, true);
  el.addEventListener('contextmenu', (e) => { e.preventDefault(); iptal(); fn(); });
  return el;
}

// v0.18.0 Günlük yeni kişi sınırı: ilk mesajdan (selam dahil) önce çağrılır. İzin varsa kişiyi bugünün listesine
// yazar ve true döner; yoksa nedenini ve paketleri gösterir, false döner. Zaten konuşulan kişiler sınıra sayılmaz.
export async function yeniKisiOnayi(profil, b) {
  const izin = ilkMesajKontrolu(profil.kimlik, testMesajlari(profil.kimlik));
  if (izin.izin) { yeniKisiSay(profil.kimlik); return true; }
  const paketlereGit = await onayIste({
    baslik: t('paket.sinirBaslik'),
    metin: t('paket.sinirMetin', { n: izin.sinir, paket: t(`paket.kisaAd.${aktifPaketKimligi()}`) }),
    evet: t('paket.paketleriGor'), hayir: t('kural.tamam'),
  });
  if (paketlereGit && b) b.git('/paketler');
  return false;
}

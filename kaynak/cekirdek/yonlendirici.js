// Yönlendirici: '#/ekran?ani=deger' biçimindeki adresleri ekranlara bağlar.
// Y21: geri her zaman gelinen yere döner; modüller history ya da location'a doğrudan dokunmaz.
import { ekranAl } from './modul-kaydi.js';
import { al } from './depo.js';
import { yayinla } from './olay-hatti.js';
import { t } from './metin.js';
import { h, gezinmeGizle } from './arayuz.js';

let kok = null;
let aktifTemizle = null;
let aktifEkranId = null;
const gecmis = [];

function coz() {
  const ham = location.hash.slice(1) || '/bugun';
  const [yol, sorgu] = ham.split('?');
  const id = yol.replace(/^\//, '').replace(/\//g, '-') || 'bugun';
  const parametreler = Object.fromEntries(new URLSearchParams(sorgu || ''));
  return { id, parametreler, adres: ham };
}

function ciz() {
  const { id, parametreler, adres } = coz();
  const veri = al();

  if ((!veri.profil.kurulumTamam || !veri.profil.yasOnayi) && id !== 'karsilama' && id !== 'gorusme' && id !== 'karne') {
    git('/karsilama', { degistir: true });
    return;
  }

  let ekran = ekranAl(id);
  if (!ekran) {
    git('/bugun', { degistir: true });
    return;
  }

  // Geçmiş: tarayıcıda geri gidildiyse son kaydı düşür, değilse ekle.
  if (gecmis.length > 1 && gecmis[gecmis.length - 2] === adres) gecmis.pop();
  else if (gecmis[gecmis.length - 1] !== adres) gecmis.push(adres);

  if (aktifTemizle) {
    try { aktifTemizle(); } catch (hata) { console.error(hata); }
  }
  aktifTemizle = null;
  aktifEkranId = id;

  const kap = h('main', { class: 'b-ekran', 'data-ekran': id, tabindex: '-1' });
  kok.replaceChildren(kap);
  document.title = `${t(ekran.baslikAnahtari)} · ${t('uygulama.ad')}`;
  gezinmeGizle();
  try {
    aktifTemizle = ekran.ciz(kap, { p: parametreler, git, geri }) || null;
    // v0.4.0: HelloTalk düzeninde her ana sekme kendi ince üst çubuğunu (htUst) çizer; ortak şerit kaldırıldı.
  } catch (hata) {
    console.error('[yonlendirici]', id, hata);
    kap.replaceChildren(h('div', { class: 'b-durum', role: 'alert' }, t('genel.hata')));
  }
  kok.scrollTo(0, 0);
  kap.focus({ preventScroll: true });
  yayinla('ekran:degisti', { id, parametreler });
}

// v0.11.0 Üstten açılan katmanlar (süzgeç, yan menü, alt pencere, onay) telefonun geri tuşuyla kapanır.
// Her açılan katman için aynı adresle bir geçmiş kaydı eklenir; geri tuşu önce en üstteki katmanı kapatır,
// alttaki sayfaya dokunmaz. Katman kendi düğmesiyle kapanınca eklenen kayıt sessizce geri alınır.
const KATMAN = '.b-alt-pencere-perde, .b-katman, .b-perde';
let katmanDerinligi = 0;
let yoksay = 0;
const aciklar = () => [...document.querySelectorAll(KATMAN)];

function katmanKapat(el) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  // Esc dinlemeyen katman: varsa "vazgeç" türü ikincil düğmeye bas (bekleyen soru yanıtsız kalmasın), yoksa kaldır.
  setTimeout(() => {
    if (!el.isConnected) return;
    const vazgec = el.querySelector('.b-dugme-cerceve');
    if (vazgec) vazgec.click();
    if (el.isConnected) el.remove();
  }, 0);
}

function katmanIzle() {
  new MutationObserver(() => {
    const n = aciklar().length;
    if (n > katmanDerinligi) {
      while (katmanDerinligi < n) { katmanDerinligi += 1; history.pushState({ katman: katmanDerinligi }, ''); }
    } else if (n < katmanDerinligi) {
      const fark = katmanDerinligi - n;
      katmanDerinligi = n;
      // Kapanırken başka sayfaya gidildiyse (kayıt bizim değilse) geri alma; ölü kayıt popstate'te atlanır.
      if (history.state && history.state.katman) { yoksay += 1; history.go(-fark); }
    }
  }).observe(document.body, { childList: true, subtree: true });

  window.addEventListener('popstate', (e) => {
    if (yoksay > 0) { yoksay -= 1; return; }
    const hedef = (e.state && e.state.katman) || 0;
    const acik = aciklar();
    if (acik.length > hedef) {
      katmanDerinligi = hedef;
      acik.slice(hedef).reverse().forEach(katmanKapat);
    } else if (hedef > 0 && acik.length === 0) {
      // Katman kapatılıp başka sayfaya gidilmişti: arta kalan kaydı atla.
      katmanDerinligi = 0;
      history.back();
    }
  });
}

export function baslat(kokOge) {
  kok = kokOge;
  window.addEventListener('hashchange', ciz);
  katmanIzle();
  ciz();
}

export function git(yol, secenek = {}) {
  if (secenek.degistir) {
    history.replaceState(null, '', '#' + yol);
    if (gecmis.length) gecmis.pop();
    ciz();
  } else if (location.hash === '#' + yol) {
    ciz();
  } else {
    location.hash = yol;
  }
}

export function geri(yedekYol = '/bugun') {
  if (gecmis.length > 1) history.back();
  else git(yedekYol, { degistir: true });
}

export function aktifEkran() {
  return aktifEkranId;
}

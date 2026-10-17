// Yönlendirici: '#/ekran?ani=deger' biçimindeki adresleri ekranlara bağlar.
// Y21: geri her zaman gelinen yere döner; modüller history ya da location'a doğrudan dokunmaz.
import { ekranAl } from './modul-kaydi.js';
import { al } from './depo.js';
import { yayinla } from './olay-hatti.js';
import { t } from './metin.js';
import { h, gezinmeGizle, markaSeridi } from './arayuz.js';
import { kilitGerekli, kilitEkrani, kilitEkraniniKaldir, kilitIzle } from './kilit.js';
import { adresOku, bellekModu, bellegeYaz } from './adres.js';

let kok = null;
let aktifTemizle = null;
let aktifEkranId = null;
const gecmis = [];
const konumlar = new Map();
let aktifAdres = null;

function coz() {
  const ham = adresOku();
  const [yol, sorgu] = ham.split('?');
  const id = yol.replace(/^\//, '').replace(/\//g, '-') || 'bugun';
  const parametreler = Object.fromEntries(new URLSearchParams(sorgu || ''));
  return { id, parametreler, adres: ham };
}

function ciz() {
  const { id, parametreler, adres } = coz();
  const veri = al();

  const kurulu = veri.profil.kurulumTamam && veri.profil.yasOnayi;
  if (!kurulu && id !== 'karsilama' && id !== 'gorusme' && id !== 'karne') {
    git('/karsilama', { degistir: true });
    return;
  }
  // v0.24.0: kurulum bittiyse karşılama ekranına (geri tuşu, eski bağlantı) dönülmez; ana ekran açılır.
  if (kurulu && id === 'karsilama') {
    git('/bugun', { degistir: true });
    return;
  }

  let ekran = ekranAl(id);
  if (!ekran) {
    git('/bugun', { degistir: true });
    return;
  }

  // v0.18.0 Uygulama kilidi: kapsamdaki ekran açılmadan önce kilit ekranı gelir; açılınca aynı ekran çizilir.
  if (kilitGerekli(id, ekran.kilitKapsami)) { kilitEkrani(() => ciz()); return; }
  kilitEkraniniKaldir();

  // v0.13.0: ayrılınan sayfanın kaydırma konumu saklanır; geri dönülünce aynı yere gelinir (liste bağlamı kaybolmaz).
  if (aktifAdres) konumlar.set(aktifAdres, kok.scrollTop);
  // Geçmiş: tarayıcıda geri gidildiyse son kaydı düşür, değilse ekle.
  const geriDonus = gecmis.length > 1 && gecmis[gecmis.length - 2] === adres;
  if (geriDonus) gecmis.pop();
  else if (gecmis[gecmis.length - 1] !== adres) gecmis.push(adres);
  aktifAdres = adres;

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
    // Ana sekmelerde (alt menülü ekranlar) en üstte ince marka şeridi.
    if (kap.classList.contains('b-ekran-gezinmeli')) kap.prepend(markaSeridi());
    // v0.4.0: HelloTalk düzeninde her ana sekme kendi ince üst çubuğunu (htUst) çizer; ortak şerit kaldırıldı.
  } catch (hata) {
    console.error('[yonlendirici]', id, hata);
    kap.replaceChildren(h('div', { class: 'b-durum', role: 'alert' }, t('genel.hata')));
  }
  const konum = geriDonus ? konumlar.get(adres) : 0;
  kok.scrollTo(0, 0);
  if (konum) requestAnimationFrame(() => kok.scrollTo(0, konum));
  kap.focus({ preventScroll: true });
  yayinla('ekran:degisti', { id, parametreler });
}

// v0.11.0 Üstten açılan katmanlar (süzgeç, yan menü, alt pencere, onay) telefonun geri tuşuyla kapanır.
// Her açılan katman için aynı adresle bir geçmiş kaydı eklenir; geri tuşu önce en üstteki katmanı kapatır,
// alttaki sayfaya dokunmaz. Katman kendi düğmesiyle kapanınca eklenen kayıt sessizce geri alınır.
const KATMAN = '.b-alt-pencere-perde, .b-katman, .b-perde';
let katmanDerinligi = 0;
let yoksay = 0;
// v0.24.0 Katman kapanınca geçmişte geri gidilir (history.go, eşzamansız). O sırada bir sayfaya gidilirse (pencere
// "Tamam"ına basınca yönlendirme gibi) geri gitme yeni sayfanın kaydını yer ve kullanıcı eski sayfaya zıplar
// (misafir girişi → karşılama). Bu yüzden geri gitme sürerken yönlendirme bekletilir, bitince yapılır.
let bekleyenGit = null;
let bekleyenZamanlayici = null;
function bekleyeniCalistir() {
  clearTimeout(bekleyenZamanlayici);
  bekleyenZamanlayici = null;
  const b = bekleyenGit;
  bekleyenGit = null;
  if (b) b();
}
const aciklar = () => [...document.querySelectorAll(KATMAN)];

function katmanKapat(el) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  // Esc dinlemeyen katman: varsa "vazgeç" türü ikincil düğmeye bas (bekleyen soru yanıtsız kalmasın), yoksa kaldır.
  setTimeout(() => {
    if (!el.isConnected) return;
    const vazgec = el.querySelector('[data-vazgec]') || (el.querySelectorAll('.b-dugme-cerceve').length === 1 ? el.querySelector('.b-dugme-cerceve') : null);
    if (vazgec) vazgec.click();
    if (el.isConnected) el.remove();
  }, 0);
}

// v0.16.0 Ortak odak yönetimi (erişilebilirlik): açık pencerede Tab odağı pencere içinde döner; pencere kapanınca odak
// onu açan öğeye (pencerelerin dışında en son odaklanan öğe) geri döner. Her pencere bunu ayrıca yazmak zorunda kalmaz.
let sonOdak = null;
const ODAKLANABILIR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
function odakYonetimi() {
  document.addEventListener('focusin', (e) => {
    if (e.target instanceof Element && !e.target.closest(KATMAN)) sonOdak = e.target;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const ust = aciklar().pop();
    if (!ust) return;
    const ogeler = [...ust.querySelectorAll(ODAKLANABILIR)].filter((x) => x.offsetParent !== null || x === document.activeElement);
    if (!ogeler.length) return;
    const ilk = ogeler[0]; const son = ogeler[ogeler.length - 1];
    if (!ust.contains(document.activeElement)) { e.preventDefault(); ilk.focus(); }
    else if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus(); }
    else if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus(); }
  });
}
function odagiGeriVer() {
  if (aciklar().length) return;
  if (sonOdak && sonOdak.isConnected) { try { sonOdak.focus({ preventScroll: true }); } catch { /* odaklanamıyor */ } }
}

function katmanIzle() {
  odakYonetimi();
  new MutationObserver(() => {
    const n = aciklar().length;
    if (n < katmanDerinligi) setTimeout(odagiGeriVer, 0);
    if (n > katmanDerinligi) {
      // Geçmiş API'si kapalıysa (korumalı çerçeve) katmanlar geri tuşuna bağlanmaz; kendi düğmeleriyle kapanır.
      while (katmanDerinligi < n) { katmanDerinligi += 1; if (!bellekModu()) { try { history.pushState({ katman: katmanDerinligi }, ''); } catch { /* izin yok */ } } }
    } else if (n < katmanDerinligi) {
      const fark = katmanDerinligi - n;
      katmanDerinligi = n;
      // Kapanırken başka sayfaya gidildiyse (kayıt bizim değilse) geri alma; ölü kayıt popstate'te atlanır.
      if (!bellekModu() && history.state && history.state.katman) {
        try {
          yoksay += 1;
          history.go(-fark);
          // popstate gelmezse (tarayıcı geri gitmeyi yutarsa) bekleyen yönlendirme yine de yapılır.
          clearTimeout(bekleyenZamanlayici);
          bekleyenZamanlayici = setTimeout(() => { yoksay = 0; bekleyeniCalistir(); }, 400);
        } catch { yoksay -= 1; }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });

  // Koyu perdeli pencerelerde (şikâyet, onay…) boş alana dokununca da kapanır — "Vazgeç" gibi.
  document.addEventListener('click', (e) => {
    const el = e.target;
    if (el instanceof Element && el.classList.contains('b-perde') && el.isConnected) katmanKapat(el);
  });

  window.addEventListener('popstate', (e) => {
    if (yoksay > 0) { yoksay -= 1; if (yoksay === 0) bekleyeniCalistir(); return; }
    const hedef = (e.state && e.state.katman) || 0;
    const acik = aciklar();
    if (acik.length > hedef) {
      katmanDerinligi = hedef;
      acik.slice(hedef).reverse().forEach(katmanKapat);
    } else if (hedef > 0 && acik.length === 0) {
      // Katman kapatılıp başka sayfaya gidilmişti: arta kalan kaydı atla.
      katmanDerinligi = 0;
      try { history.back(); } catch { /* izin yok */ }
    }
  });
}

export function baslat(kokOge) {
  kok = kokOge;
  window.addEventListener('hashchange', () => {
    // Bellek kipinde adres çubuğu değişirse (ör. bağlantıya dokunuldu) bellekteki adres de onu izler.
    if (bellekModu()) { try { bellegeYaz(location.hash.slice(1) || '/bugun'); } catch { /* okunamıyor */ } }
    ciz();
  });
  // Bellek kipinde "#/…" bağlantıları adres çubuğuna gitmez; yönlendiriciden geçer.
  document.addEventListener('click', (e) => {
    if (!bellekModu() || e.defaultPrevented) return;
    const a = e.target instanceof Element ? e.target.closest('a[href^="#/"]') : null;
    if (!a) return;
    e.preventDefault();
    git(a.getAttribute('href').slice(1));
  });
  katmanIzle();
  kilitIzle(() => ciz());
  ciz();
}

// v0.23.0: geçmiş API'si izin vermezse (SecurityError) yönlendirici bellek kipine geçer: adres bellekte tutulur,
// geri gitme kendi geçmiş listesinden yapılır. Böylece uygulama korumalı önizlemelerde de boş ekranda kalmaz.
function bellekteGit(yol, degistir) {
  if (degistir && gecmis.length) gecmis.pop();
  bellegeYaz(yol);
  ciz();
}

export function git(yol, secenek = {}) {
  if (bellekModu()) { bellekteGit(yol, secenek.degistir); return; }
  if (yoksay > 0) { bekleyenGit = () => git(yol, secenek); return; }
  try {
    if (secenek.degistir) {
      history.replaceState(null, '', '#' + yol);
      if (gecmis.length) gecmis.pop();
      ciz();
    } else if (location.hash === '#' + yol) {
      ciz();
    } else {
      location.hash = yol;
    }
  } catch {
    bellekteGit(yol, secenek.degistir);
  }
}

export function geri(yedekYol = '/bugun') {
  if (bellekModu()) { bellekteGit(gecmis.length > 1 ? gecmis[gecmis.length - 2] : yedekYol, gecmis.length <= 1); return; }
  if (yoksay > 0) { bekleyenGit = () => geri(yedekYol); return; }
  if (gecmis.length > 1) { try { history.back(); return; } catch { /* izin yok */ } }
  git(yedekYol, { degistir: true });
}

export function aktifEkran() {
  return aktifEkranId;
}

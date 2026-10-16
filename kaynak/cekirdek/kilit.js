// v0.18.0 Uygulama kilidi (Premium): PIN, desen ve isteğe bağlı parmak izi / yüz (cihazın kendi doğrulaması, WebAuthn).
// Kapsam: tüm uygulama · yalnız Ayarlar · yalnız Kişiler ve sohbetler. Otomatik kilit: arka plana alındıktan sonra süre.
// DÜRÜSTLÜK: Bu kilit, telefonu eline alan birine karşı bir GİZLİLİK PERDESİDİR; verileri şifrelemez. Tarayıcının
// geliştirici araçlarını bilen biri cihazdaki veriye yine ulaşabilir. Ekranda da böyle yazar.
// PIN ve desen düz metin saklanmaz: tuzlu SHA-256 özeti saklanır. 5 yanlış denemede bekleme süresi artar.
import { al, degistir } from './depo.js';
import { h, ikon, logo } from './arayuz.js';
import { t } from './metin.js';
import { ozellikVar } from './paketler.js';

export const KAPSAMLAR = ['uygulama', 'ayarlar', 'kisiler'];
export const SURELER = [0, 1, 5, 15];
const KAPSAM_EKRANLARI = {
  ayarlar: ['ayarlar', 'paketler'],
  kisiler: ['sohbetler', 'mesaj', 'kisi', 'kesfet'],
};
const SERBEST = ['karsilama']; // ilk kurulum kilitlenmez

let acikZaman = 0; // bu oturumda en son açıldığı an (0 = kilitli)
let arkaPlanZamani = 0;
let yanlis = 0;
let beklemeBitis = 0;

export function kilitAyari() { return { acik: false, kapsam: 'uygulama', yontem: 'pin', biyometri: false, sureDk: 1, ...((al().profil.ayarlar || {}).kilit || {}) }; }
function kilitYaz(fn) { degistir((v) => { const k = kilitAyari(); fn(k); v.profil.ayarlar.kilit = k; }); }

export function kilitEtkin() { const k = kilitAyari(); return k.acik && ozellikVar('uygulamaKilidi') && Boolean(k.pinOzet || k.desenOzet); }
export function kilitGerekli(ekranId) {
  if (!kilitEtkin() || acikZaman || SERBEST.includes(ekranId)) return false;
  const k = kilitAyari();
  return k.kapsam === 'uygulama' || (KAPSAM_EKRANLARI[k.kapsam] || []).includes(ekranId);
}
export function kilitle() { acikZaman = 0; }
// Kilidi yeni kuran kişi o an doğrulanmış sayılır (kurar kurmaz kilit ekranı gelmez).
export function acikSay() { acikZaman = Date.now(); }

// ---- Özet (tuzlu SHA-256; crypto.subtle yoksa basit yedek özet) ----
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
async function ozet(metin, tuz) {
  try {
    if (window.crypto && crypto.subtle) return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${tuz}:${metin}`)));
  } catch { /* yedek aşağıda */ }
  let x = 2166136261; for (const c of `${tuz}:${metin}`) { x ^= c.charCodeAt(0); x = Math.imul(x, 16777619) >>> 0; } return `f${x.toString(16)}`;
}
const rastgele = (n) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return a; };
const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const b64Coz = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export async function sifreKaydet(yontem, deger) {
  const tuz = hex(rastgele(8));
  const o = await ozet(deger, tuz);
  kilitYaz((k) => { k.tuz = tuz; k.yontem = yontem; if (yontem === 'pin') { k.pinOzet = o; k.desenOzet = null; } else { k.desenOzet = o; k.pinOzet = null; } });
}
async function dogrula(deger) {
  const k = kilitAyari();
  const beklenen = k.yontem === 'pin' ? k.pinOzet : k.desenOzet;
  return Boolean(beklenen) && (await ozet(deger, k.tuz)) === beklenen;
}
export function kilidiKapat() { kilitYaz((k) => { k.acik = false; }); }

// ---- Biyometri (parmak izi / yüz): yalnız https ve cihazda doğrulayıcı varsa ----
export async function biyometriDestekli() {
  try {
    return location.protocol === 'https:' && !!window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch { return false; }
}
export async function biyometriKaydet() {
  const kimlik = await navigator.credentials.create({ publicKey: {
    challenge: rastgele(32), rp: { name: 'helloworld' },
    user: { id: rastgele(16), name: 'helloworld-kilit', displayName: al().profil.ad || 'helloworld' },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' }, timeout: 60000,
  } });
  kilitYaz((k) => { k.biyometri = true; k.biyoKimlik = b64(kimlik.rawId); });
}
export function biyometriKapat() { kilitYaz((k) => { k.biyometri = false; k.biyoKimlik = null; }); }
async function biyometriDogrula() {
  const k = kilitAyari();
  if (!k.biyometri || !k.biyoKimlik) return false;
  try {
    await navigator.credentials.get({ publicKey: { challenge: rastgele(32), allowCredentials: [{ type: 'public-key', id: b64Coz(k.biyoKimlik) }], userVerification: 'required', timeout: 60000 } });
    return true;
  } catch { return false; }
}

// ---- Giriş bileşenleri ----
// PIN tuş takımı: 4–8 hane. tamam(deger) çağrılır.
export function pinTuslari(tamam, { uzunluk = null } = {}) {
  let deger = '';
  const noktalar = h('div', { class: 'b-kilit-noktalar', 'aria-live': 'polite' });
  const ciz = () => { noktalar.replaceChildren(...Array.from({ length: Math.max(4, deger.length) }, (_, i) => h('span', { class: i < deger.length ? 'b-kilit-nokta b-kilit-nokta-dolu' : 'b-kilit-nokta' }))); noktalar.setAttribute('aria-label', t('kilit.haneSayisi', { n: deger.length })); };
  const bas = (r) => { if (deger.length >= 8) return; deger += r; ciz(); if (uzunluk && deger.length === uzunluk) { const d = deger; deger = ''; ciz(); tamam(d); } };
  const tus = (r) => h('button', { type: 'button', class: 'b-kilit-tus', onClick: () => bas(r) }, r);
  const ciz2 = h('div', { class: 'b-kilit-tuslar' },
    ...['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(tus),
    h('button', { type: 'button', class: 'b-kilit-tus b-kilit-tus-ikincil', 'aria-label': t('kilit.sil'), onClick: () => { deger = deger.slice(0, -1); ciz(); } }, ikon('sol', 20)),
    tus('0'),
    h('button', { type: 'button', class: 'b-kilit-tus b-kilit-tus-ana', 'aria-label': t('kilit.tamam'), onClick: () => { if (deger.length >= 4) { const d = deger; deger = ''; ciz(); tamam(d); } } }, ikon('onay', 22)));
  ciz();
  return h('div', { class: 'b-kilit-pin' }, noktalar, ciz2);
}

// Desen: 3×3 nokta, parmakla ya da fareyle çiz; en az 4 nokta. tamam("0-1-2-5").
export function desenAlani(tamam) {
  const secili = [];
  let basili = false;
  const noktalar = Array.from({ length: 9 }, (_, i) => h('span', { class: 'b-desen-nokta', 'data-i': String(i), role: 'button', tabindex: '0', 'aria-label': t('kilit.noktaN', { n: i + 1 }) }));
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'b-desen-cizgi'); svg.setAttribute('viewBox', '0 0 300 300'); svg.setAttribute('aria-hidden', 'true');
  const izgara = h('div', { class: 'b-desen' }, svg, ...noktalar);
  const merkez = (i) => [50 + (i % 3) * 100, 50 + Math.floor(i / 3) * 100];
  const ciz = () => {
    noktalar.forEach((n, i) => n.classList.toggle('b-desen-secili', secili.includes(i)));
    svg.innerHTML = secili.length > 1 ? `<polyline points="${secili.map((i) => merkez(i).join(',')).join(' ')}" />` : '';
  };
  const ekle = (i) => { if (!secili.includes(i)) { secili.push(i); ciz(); } };
  const bitir = () => {
    if (!basili) return; basili = false;
    const d = secili.join('-'); const n = secili.length;
    secili.length = 0; setTimeout(ciz, 250);
    if (n >= 4) tamam(d); else if (n) izgara.dispatchEvent(new CustomEvent('kisa'));
  };
  const noktaAl = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.classList && el.classList.contains('b-desen-nokta') ? Number(el.dataset.i) : null; };
  izgara.addEventListener('pointerdown', (e) => { basili = true; secili.length = 0; izgara.setPointerCapture(e.pointerId); const i = noktaAl(e.clientX, e.clientY); if (i !== null) ekle(i); });
  izgara.addEventListener('pointermove', (e) => { if (!basili) return; const i = noktaAl(e.clientX, e.clientY); if (i !== null) ekle(i); });
  izgara.addEventListener('pointerup', bitir);
  izgara.addEventListener('pointercancel', bitir);
  // Klavye/ekran okuyucu: noktalara sırayla Enter, sonra "Bitti".
  noktalar.forEach((n, i) => n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); basili = true; ekle(i); } }));
  const bitti = h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve b-desen-bitti', onClick: bitir }, t('kilit.desenBitti'));
  return h('div', { class: 'b-desen-kap' }, izgara, bitti);
}

// ---- Kilit ekranı (tam ekran; geri tuşuyla ya da dışarı dokunarak kapanmaz) ----
let acikEkran = null;
export function kilitEkrani(acildi) {
  if (acikEkran) { acikEkran.remove(); acikEkran = null; }
  const k = kilitAyari();
  const mesaj = h('p', { class: 'b-kilit-mesaj', role: 'status', 'aria-live': 'assertive' }, t(k.yontem === 'pin' ? 'kilit.pinGir' : 'kilit.desenCiz'));
  const ac = () => { acikZaman = Date.now(); yanlis = 0; ekran.remove(); acikEkran = null; acildi(); };
  const dene = async (deger) => {
    if (Date.now() < beklemeBitis) { mesaj.textContent = t('kilit.bekle', { n: Math.ceil((beklemeBitis - Date.now()) / 1000) }); return; }
    if (await dogrula(deger)) { ac(); return; }
    yanlis += 1;
    if (yanlis >= 5) { beklemeBitis = Date.now() + 30000 * (yanlis - 4); mesaj.textContent = t('kilit.cokYanlis', { n: 30 * (yanlis - 4) }); }
    else mesaj.textContent = t('kilit.yanlis', { n: 5 - yanlis });
    ekran.classList.remove('b-kilit-salla'); void ekran.offsetWidth; ekran.classList.add('b-kilit-salla');
  };
  const giris = k.yontem === 'pin' ? pinTuslari(dene) : desenAlani(dene);
  if (k.yontem !== 'pin') giris.firstChild.addEventListener('kisa', () => { mesaj.textContent = t('kilit.desenKisa'); });
  const biyo = k.biyometri ? h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve b-kilit-biyo', onClick: async () => { if (await biyometriDogrula()) ac(); else mesaj.textContent = t('kilit.biyoOlmadi'); } }, ikon('kilit', 18), t('kilit.biyoIle')) : null;
  const ekran = h('div', { class: 'b-kilit', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('kilit.baslik') },
    h('div', { class: 'b-kilit-ic' },
      logo(56),
      h('h2', { class: 'b-kilit-baslik' }, t('kilit.baslik')),
      mesaj,
      giris,
      biyo,
      h('details', { class: 'b-kilit-unuttum' }, h('summary', null, t('kilit.unuttum')), h('p', null, t('kilit.unuttumMetin')))));
  document.body.append(ekran);
  acikEkran = ekran;
  if (biyo && !document.hidden) biyo.click(); // varsa önce parmak izi / yüz sorulur
  else { const ilk = ekran.querySelector('button, [tabindex="0"]'); if (ilk) ilk.focus(); }
}

// Kilit gerektirmeyen bir ekrana geçilince (ör. geri tuşu) açık kilit ekranı kaldırılır.
export function kilitEkraniniKaldir() { if (acikEkran) { acikEkran.remove(); acikEkran = null; } }

// Uygulama arka plana gidip süre dolunca yeniden kilitlenir.
export function kilitIzle(yeniden) {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { arkaPlanZamani = Date.now(); return; }
    const k = kilitAyari();
    if (acikZaman && kilitEtkin() && Date.now() - arkaPlanZamani >= (k.sureDk || 0) * 60000) { kilitle(); yeniden(); }
  });
}

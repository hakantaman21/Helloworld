// v0.20.0 İkon paketleri ve benzersiz kart ikonları (English Prime v4.7.4 mantığı).
//
// Dört paket: Klasik 3B (uygulamanın ilk 3B ikonları) · Buz cam · Neon · Yumuşak kil (English Prime paketleri).
// "Otomatik" seçilirse paket, Ayarlar › Görünüm'deki tasarım paketini izler (renkler birbirine uysun).
//
// Kural: 3B görsel YALNIZ anlamı birebir tutan ikonda kullanılır. Diğer her anlam kendi çizimiyle (glif), paketin
// vurgu rengini taşıyan 3B görünümlü bir rozette çizilir. Aynı ekranda iki kart aynı resmi taşıyorsa ikincisi
// anlamca yakın başka bir çizime geçer (benzersizlestir). Böylece yeni kart eklense de ekranda tekrar oluşmaz.
import { al } from './depo.js';
import { dinle } from './olay-hatti.js';
import { IKON3D } from '../veri/ikon3d.js';
import { PAKET_RESIMLERI, GLIFLER, GLIF_TON } from '../veri/ikon-paketleri.js';

const SVG = 'http://www.w3.org/2000/svg';
const IKON_PAKETLERI = ['klasik', 'buz', 'neon', 'kil'];
// Tasarım paketi → uyumlu ikon paketi (Otomatik seçiliyken).
const TASARIM_IKON = { akilli: 'klasik', prime: 'klasik', gece: 'buz', mor: 'neon', bordo: 'kil', minimal: 'buz', ozel: 'klasik' };

// Uygulamaya özgü ek glifler (English Prime çiziminde karşılığı olmayan anlamlar).
const EK_GLIF = {
  kilit: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.2"/>',
  dunya: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21M12 3C9.5 5.6 8.2 8.6 8.2 12s1.3 6.4 3.8 9"/>',
  hoparlor: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  arsiv: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>',
  oynat: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>',
  kupaGlif: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4"/>',
};
const glifCiz = (k) => GLIFLER[k] || EK_GLIF[k] || '';

// Anlam → çizim seçenekleri (ilki asıl; tekrar olursa sırayla sonrakiler denenir).
const ALTERNATIF = {
  kitap: ['ic_bookstack', 'ic_notebook', 'ic_book_plus', 'ic_dict'], anlar: ['ic_journal', 'ic_sentence', 'ic_bubble'],
  hedef: ['ic_flag', 'ic_compass', 'ic_map'], hafiza: ['ic_recall_mem', 'ic_dna', 'ic_think'], yz: ['ic_ai', 'ic_magic'],
  telaffuz: ['ic_mic', 'ic_speech'], seri: ['ic_motivation_spark', 'ic_sun'], kupa: ['kupaGlif', 'ic_report', 'ic_chart'],
  senaryo: ['ic_masks', 'ic_topics'], ipucu: ['ic_info', 'ic_think', 'ic_magic'], sohbet: ['ic_bubble', 'ic_speech'],
  baglanti: ['ic_handshake', 'ic_compass'], profil: ['ic_user', 'ic_avatar'], ayarlar: ['ic_gear', 'ic_layout_rows'],
  gorunum: ['ic_palette', 'ic_layout_bento'], bildirim: ['ic_bell', 'ic_letter'], kilit: ['kilit', 'ic_eye_off'],
  dil: ['dunya', 'ic_abc'], arama: ['ic_search', 'ic_eye'], pratik: ['oynat', 'ic_spontane'], gelisim: ['ic_trend', 'ic_chart', 'ic_curve'],
  takvim: ['ic_calendar', 'ic_checklist'], kalem: ['ic_pen', 'ic_contract'], mektup: ['ic_letter', 'ic_bell'], aile: ['ic_family', 'ic_handshake'],
  hediye: ['ic_gift', 'ic_pack'], yildiz: ['ic_star', 'ic_heart', 'ic_magic'], ses: ['hoparlor', 'ic_speech'], yedek: ['arsiv', 'ic_cloud', 'ic_sync'],
  tema: ['ic_magic', 'ic_palette'], ekosistem: ['ic_layout_bento', 'ic_puzzle_pair'],
};
// 3B görselin anlamı birebir tuttuğu ikonlar (yalnız bunlar paketlerde 3B çizilir).
const CEKIRDEK = {
  kitap: 'core_book_closed', anlar: 'core_book_open', hedef: 'core_target', hafiza: 'core_brain', yz: 'core_headphones',
  telaffuz: 'core_mic', seri: 'core_bolt', kupa: 'core_trophy', senaryo: 'core_masks', ipucu: 'core_bulb',
};
const HAVUZ = [...new Set([...Object.values(ALTERNATIF).flat(), ...Object.keys(GLIFLER)])].filter(glifCiz);

function ikonPaketiSecimi() { return (al().profil.ayarlar || {}).ikonPaketi || 'otomatik'; }
function aktifIkonPaketi() {
  const a = al().profil.ayarlar || {};
  const s = a.ikonPaketi || 'otomatik';
  return s === 'otomatik' ? (TASARIM_IKON[a.tasarimPaketi] || 'klasik') : (IKON_PAKETLERI.includes(s) ? s : 'klasik');
}

function tonu(k) {
  if (GLIF_TON[k] != null) return GLIF_TON[k];
  let x = 0; for (const c of String(k)) x = ((x << 5) - x + c.charCodeAt(0)) | 0;
  return Math.abs(x) % 360;
}

function glifOgesi(ad, glif, boyut) {
  // <i>: metin aramak için 'span' seçen eski kodlar (başlık yazısı gibi) rozeti yazı sanmasın.
  const kap = document.createElement('i');
  kap.className = 'b-ikon3d b-glif';
  kap.setAttribute('aria-hidden', 'true');
  kap.dataset.ik = ad; kap.dataset.glif = glif;
  kap.style.cssText = `width:${boyut}px;height:${boyut}px;--gh:${tonu(glif)}`;
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.9'); svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
  svg.innerHTML = glifCiz(glif);
  kap.append(svg);
  return kap;
}

// ikon3d() buraya gelir. paket verilirse (önizleme) o paket kullanılır; glif verilirse doğrudan o çizim.
function ikonOgesi(ad, boyut = 40, { paket = null, glif = null } = {}) {
  const pk = paket || aktifIkonPaketi();
  if (!glif) {
    const src = pk === 'klasik' ? IKON3D[ad] : (CEKIRDEK[ad] && (PAKET_RESIMLERI[pk] || {})[CEKIRDEK[ad]]);
    if (src) {
      const img = document.createElement('img');
      img.className = 'b-ikon3d'; img.src = src; img.width = boyut; img.height = boyut; img.alt = '';
      img.setAttribute('aria-hidden', 'true'); img.loading = 'lazy'; img.decoding = 'async';
      img.dataset.ik = ad; img.dataset.paket = pk;
      return img;
    }
  }
  return glifOgesi(ad, glif || (ALTERNATIF[ad] || [])[0] || HAVUZ[tonu(ad) % HAVUZ.length], boyut);
}

// ---- Benzersizleştirme: aynı kapsamda (ekran, yan menü, alt pencere) aynı resim/çizim iki kez görünmez ----
const KAPSAMLAR = 'main.b-ekran, .b-ymenu, .b-alt-pencere';
const HARIC = '.b-ht-ust, .b-gezinme, .b-marka-serit, .ayr-renkler, .ayr-ikonlar, .ayr-grup-baslik';
const anahtar = (e) => (e.tagName === 'IMG' ? `R:${e.getAttribute('src').length}:${e.getAttribute('src').slice(-40)}` : `G:${e.dataset.glif}`);
function benzersizlestir(kok) {
  // Yalnız kart ikonları (≥30 px): satırlardaki küçük kimlik simgeleri (ör. her oda kartındaki "Koç") aynı kalmalı.
  const boyu = (e) => Number(e.getAttribute('width')) || parseInt(e.style.width, 10) || 0;
  const ogeler = [...kok.querySelectorAll('.b-ikon3d')].filter((e) => !e.closest(HARIC) && e.closest(KAPSAMLAR) === kok && boyu(e) >= 30);
  const kullanilan = new Set();
  for (const e of ogeler) {
    const k = anahtar(e);
    if (!kullanilan.has(k)) { kullanilan.add(k); continue; }
    const ad = e.dataset.ik || '';
    const adaylar = [...(ALTERNATIF[ad] || []), ...HAVUZ];
    const glif = adaylar.find((g) => glifCiz(g) && !kullanilan.has(`G:${g}`));
    if (!glif) continue;
    const boyut = Number(e.getAttribute('width')) || parseInt(e.style.width, 10) || 40;
    const yeni = glifOgesi(ad, glif, boyut);
    yeni.className = e.className.includes('b-glif') ? e.className : `${e.className} b-glif`;
    yeni.dataset.ikAsil = ad;
    e.replaceWith(yeni);
    kullanilan.add(`G:${glif}`);
  }
}
let bekliyor = false;
function tara() {
  if (bekliyor) return;
  bekliyor = true;
  requestAnimationFrame(() => { bekliyor = false; document.querySelectorAll(KAPSAMLAR).forEach(benzersizlestir); });
}

// Paket değişince ekran dışında kalan kalıcı ikonlar (alt menü) da yeni pakete geçer.
let sonPaket = null;
function paketDegistiyse() {
  const pk = aktifIkonPaketi();
  document.documentElement.dataset.ikonPaketi = pk;
  if (sonPaket && sonPaket !== pk) {
    document.querySelectorAll('.b-ikon3d[data-ik]').forEach((e) => {
      if (e.dataset.ikAsil) return;
      const boyut = Number(e.getAttribute('width')) || parseInt(e.style.width, 10) || 40;
      const yeni = ikonOgesi(e.dataset.ik, boyut);
      yeni.className = e.className.replace(/\bb-glif\b/, '').trim();
      if (yeni.tagName !== 'IMG') yeni.classList.add('b-glif');
      e.replaceWith(yeni);
    });
    tara();
  }
  sonPaket = pk;
}

function ikonBaslat() {
  paketDegistiyse();
  dinle('depo:degisti', paketDegistiyse);
  dinle('ekran:degisti', tara);
  new MutationObserver((kayitlar) => {
    for (const k of kayitlar) for (const n of k.addedNodes) {
      if (n.nodeType === 1 && (n.classList.contains('b-ikon3d') || n.querySelector('.b-ikon3d'))) { tara(); return; }
    }
  }).observe(document.body, { childList: true, subtree: true });
}

export { IKON_PAKETLERI, TASARIM_IKON, ikonOgesi, aktifIkonPaketi, ikonPaketiSecimi, benzersizlestir, ikonBaslat };

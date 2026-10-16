// Ortak arayüz yardımcıları: öğe oluşturma, ikonlar, üst başlık, alt gezinme, durum kutuları.
import { t } from './metin.js';
import { IKON3D } from '../veri/ikon3d.js';
import { al } from './depo.js';

const SVG_AD_ALANI = 'http://www.w3.org/2000/svg';

// h('div', { class: 'b-kart', onClick: fn }, 'metin', cocukOge)
export function h(etiket, ozellikler, ...cocuklar) {
  const oge = document.createElement(etiket);
  const oz = ozellikler || {};
  for (const anahtar of Object.keys(oz)) {
    const deger = oz[anahtar];
    if (deger === false || deger === null || deger === undefined) continue;
    if (anahtar.startsWith('on') && typeof deger === 'function') {
      oge.addEventListener(anahtar.slice(2).toLowerCase(), deger);
    } else if (anahtar === 'ref' && typeof deger === 'function') {
      deger(oge);
    } else if (anahtar === 'value') {
      oge.value = deger;
    } else if (anahtar === 'checked') {
      oge.checked = Boolean(deger);
    } else {
      oge.setAttribute(anahtar, deger === true ? '' : String(deger));
    }
  }
  ekle(oge, cocuklar);
  return oge;
}

// Bir öğenin içini baştan kurar; null ve false çocuklar atlanır, iç içe diziler düzleştirilir.
export function yerlestir(kok, ...cocuklar) {
  kok.replaceChildren();
  return ekle(kok, cocuklar);
}

export function ekle(ebeveyn, cocuklar) {
  for (const c of cocuklar.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    ebeveyn.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return ebeveyn;
}

const IKONLAR = {
  ev: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
  harita: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  liste: '<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/>',
  grafik: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
  mikrofon: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  telefon: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  kapat: '<path d="M6 6l12 12M18 6L6 18"/>',
  onay: '<path d="M5 12l5 5L20 7"/>',
  saat: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  oynat: '<path d="M8 5l11 7-11 7z"/>',
  sag: '<path d="M9 6l6 6-6 6"/>',
  sol: '<path d="M15 6l-6 6 6 6"/>',
  ayar: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  paylas: '<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v7h14v-7"/>',
  dalga: '<path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 10v4M21 12h0"/>',
  ses: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
  ampul: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
  altyazi: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 11h4M13 11h4M7 15h10"/>',
  klavye: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h0M10 10h0M14 10h0M18 10h0M7 14h10"/>',
  gonder: '<path d="M4 12l16-8-6 16-3-7z"/>',
  nokta: '<circle cx="12" cy="12" r="5"/>',
  dalgaCizgi: '<path d="M3 12c3-4 5 4 9 0s6 4 9 0"/>',
  sohbet: '<path d="M4 5h16v11H9l-5 4z"/>',
  pusula: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  kisi: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  yildiz: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  kalkan: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/>',
  kilit: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  degis: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
  arti: '<path d="M12 5v14M5 12h14"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  asagi: '<path d="M6 9l6 6 6-6"/>',
  yukari: '<path d="M6 15l6-6 6 6"/>',
  kamera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  hoparlor: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  yerImi: '<path d="M6 4h12v16l-6-4-6 4z"/>',
  ara: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  zil: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  suzgec: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  el: '<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.6 0-4.2-1.4-5.6-3.6L4 13.2a1.5 1.5 0 0 1 2.5-1.6L8 13"/>',
  paylas: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 13v6h14v-6"/>',
  begen: '<path d="M7 11v9H4v-9zM7 11l4-7c1.5 0 2.5 1 2.2 2.6L12.6 10H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/>',
  nokta3: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  kalem: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
  takvim: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  saat: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
};

export function ikon(ad, boyut = 22, kalinlik = 2) {
  const svg = document.createElementNS(SVG_AD_ALANI, 'svg');
  svg.setAttribute('width', boyut);
  svg.setAttribute('height', boyut);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', kalinlik);
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = IKONLAR[ad] || '';
  return svg;
}

// English Prime 3B ikonu (görsel). Süs amaçlıdır: ekran okuyucudan gizli, yanında her zaman metin vardır.
export function ikon3d(ad, boyut = 40) {
  return h('img', { class: 'b-ikon3d', src: IKON3D[ad] || IKON3D.yildiz, width: boyut, height: boyut, alt: '', 'aria-hidden': 'true', loading: 'lazy', decoding: 'async' });
}

// Üst başlık: tabela (nerede olduğun), başlık, alt başlık, sağda isteğe bağlı içerik.
const ikonCiz = (...a) => ikon(...a);

export function ustBaslik({ tabela, baslik, alt, sag, geri, ikon }) {
  // v0.4.0: ikonlu başlık HelloTalk tarzı ince üst çubuk olur (geri · 3B ikon + başlık · sağ), açıklama altta küçük.
  if (ikon) {
    return [
      htUst({
        sol: geri ? h('button', { type: 'button', class: 'b-ht-ikon b-ht-ikon-saydam', 'aria-label': t('genel.geri'), onClick: geri }, ikonCiz('sol', 22)) : null,
        orta: h('h1', { class: 'b-ht-baslik b-ht-baslik-ikonlu' }, ikon3d(ikon, 28), h('span', null, baslik)),
        sag: sag || null,
      }),
      alt ? h('p', { class: 'b-altbaslik b-ht-alt' }, alt) : null,
    ];
  }
  return h('header', { class: 'b-ust' },
    h('div', { class: 'b-ust-metin' },
      tabela ? h('div', { class: 'b-tabela' }, tabela) : null,
      h('h1', { class: 'b-baslik' }, baslik),
      alt ? h('p', { class: 'b-altbaslik' }, alt) : null,
    ),
    geri ? h('button', { class: 'b-dugme b-dugme-cerceve b-dugme-yuvarlak', 'aria-label': t('genel.geri'), onClick: geri }, ikonCiz('sol', 20)) : null,
    sag || null,
  );
}

// Beş sekme (Anayasa bölüm 14): Sohbet · Bağlantı · Dil Anları · Pratik · Profil
const GEZINME = [
  { yol: '/sohbetler', ikon: 'sohbet', anahtar: 'gezinme.sohbetler' },
  { yol: '/kesfet', ikon: 'baglanti', anahtar: 'gezinme.baglanti' },
  { yol: '/dil-anlari', ikon: 'anlar', anahtar: 'gezinme.dilAnlari' },
  { yol: '/bugun', ikon: 'pratik', anahtar: 'gezinme.pratik' },
  { yol: '/gelisim', ikon: 'profil', anahtar: 'gezinme.profil' },
];

export function altGezinme(aktifYol) {
  return h('nav', { class: 'b-gezinme', 'aria-label': t('gezinme.etiket') },
    h('div', { class: 'b-gezinme-ic' },
      GEZINME.map((g) => h('a', {
        class: 'b-gezinme-oge',
        href: '#' + g.yol,
        'aria-current': g.yol === aktifYol ? 'page' : false,
      }, ikon3d(g.ikon, 30), t(g.anahtar))),
    ),
  );
}

// English Prime esinli: her ana ekranda tek satır profil / ayarlar, gerçek hedeflere gider.
export function ustKontroller(ad, git) {
  return h('div', { class: 'b-ust-kontroller' },
    h('button', { type: 'button', class: 'b-ust-profil', onClick: () => git('/gelisim'), 'aria-label': t('gezinme.profil') },
      h('span', { class: 'b-ust-avatar', 'aria-hidden': 'true' }, (ad || '?').charAt(0).toLocaleUpperCase()),
      h('span', null, t('gezinme.profil'))),
    h('span', { class: 'b-ust-marka' }, t('uygulama.ad')),
    h('button', { type: 'button', class: 'b-ust-ayar', onClick: () => git('/ayarlar'), 'aria-label': t('ayarlar.baslik') }, ikon3d('ayarlar', 30)),
  );
}

// Y26: yapay zekâ içerikleri her zaman bu etiketi taşır; yapay zekâ kendini insan gibi göstermez.
export function yzEtiketi() {
  return h('span', { class: 'b-cip b-yz', title: t('ortak.yzAciklama') }, ikon('yildiz', 14, 2.2), t('ortak.yz'));
}

// Test modu rozeti: test profilleri ve test mesajları hiçbir zaman gerçek kişi gibi görünmez.
export function testEtiketi() {
  return h('span', { class: 'b-cip b-test', title: t('test.rozetAciklama') }, t('test.rozet'));
}

// Sanal (test) kullanıcı avatarı: baş harf, 6 renk; gerçek fotoğraf kullanılmaz.
// Çizim avatar (HelloTalk tarzı profil resmi): ten, saç rengi ve saç biçimi profilden gelir; renkler jetonlardan.
const SAC_BICIMI = {
  kisa: { arka: '', on: '<path d="M20.5 29c-.6-9.6 4.6-15.5 11.5-15.5S44.1 19.4 43.5 29c-1.6-4.6-5-7.3-11.5-7.3S22.1 24.4 20.5 29z"/>' },
  uzun: { arka: '<path d="M18.5 31c0-11 5.8-18 13.5-18s13.5 7 13.5 18v15h-27z"/>', on: '<path d="M20.5 28c.4-8.6 5-14 11.5-14s11.1 5.4 11.5 14c-3.6-3.4-7-6-11.5-6.4-3.2 2.6-7.6 5.4-11.5 6.4z"/>' },
  topuz: { arka: '<circle cx="32" cy="12.5" r="6"/>', on: '<path d="M20.5 29c-.6-9.6 4.6-15.5 11.5-15.5S44.1 19.4 43.5 29c-2.4-4.2-6.2-6.6-11.5-6.6S22.9 24.8 20.5 29z"/>' },
  ortu: { arka: '<path d="M17.5 32c0-11.6 6.4-19 14.5-19s14.5 7.4 14.5 19c0 6-2 10.6-5 14H22.5c-3-3.4-5-8-5-14z"/>', on: '<path d="M20 31c0-10 5.2-16 12-16s12 6 12 16c-1.8-6.4-6-9.4-12-9.4S21.8 24.6 20 31z"/>' },
};

function cizimAvatar(profil) {
  const svg = document.createElementNS(SVG_AD_ALANI, 'svg');
  svg.setAttribute('viewBox', '0 0 64 64');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'b-av-svg');
  const sac = SAC_BICIMI[profil.sacTip] || SAC_BICIMI.kisa;
  svg.innerHTML = `<rect class="b-avc-zemin" width="64" height="64"/>`
    + `<g class="b-avc-sac b-avc-sac-${profil.sac || 1}${profil.sacTip === 'ortu' ? ' b-avc-ortu' : ''}">${sac.arka}</g>`
    + `<path class="b-avc-govde" d="M11 66c1.6-12 10-18.5 21-18.5S51.4 54 53 66z"/>`
    + `<rect class="b-avc-ten b-avc-ten-${profil.ten || 1}" x="28" y="38" width="8" height="10" rx="3"/>`
    + `<circle class="b-avc-ten b-avc-ten-${profil.ten || 1}" cx="32" cy="30" r="11.5"/>`
    + `<g class="b-avc-sac b-avc-sac-${profil.sac || 1}${profil.sacTip === 'ortu' ? ' b-avc-ortu' : ''}">${sac.on}</g>`
    + `<circle class="b-avc-goz" cx="27.8" cy="31" r="1.5"/><circle class="b-avc-goz" cx="36.2" cy="31" r="1.5"/>`
    + `<path class="b-avc-agiz" d="M28.6 35.6c2 1.8 4.8 1.8 6.8 0"/>`;
  return svg;
}

export function testAvatar(profil, boyut = 44, { cevrimici = false } = {}) {
  if (profil && profil.ten) {
    return h('span', { class: `b-av b-av-cizim b-av-${profil.renk || 6}`, style: `width:${boyut}px;height:${boyut}px`, 'aria-hidden': 'true' },
      cizimAvatar(profil),
      profil.bayrak && boyut >= 32 ? h('span', { class: 'b-av-bayrak', style: `font-size:${Math.max(12, Math.round(boyut * 0.3))}px` }, profil.bayrak) : null,
      cevrimici ? h('span', { class: 'b-av-cevrimici' }) : null,
    );
  }
  return h('span', { class: `b-av b-av-${(profil && profil.renk) || 6}`, style: `width:${boyut}px;height:${boyut}px;font-size:${Math.round(boyut * 0.42)}px`, 'aria-hidden': 'true' }, (profil && profil.bas) || '?');
}

// "3 saat önce" gibi göreli zaman.
export function goreliZaman(zaman) {
  const dk = Math.max(0, Math.round((Date.now() - zaman) / 60000));
  if (dk < 1) return t('zamanOnce.simdi');
  if (dk < 60) return t('zamanOnce.dk', { n: dk });
  const sa = Math.round(dk / 60);
  if (sa < 24) return t('zamanOnce.saat', { n: sa });
  return t('zamanOnce.gun', { n: Math.round(sa / 24) });
}

// Y18: boş, yükleniyor, hata, çevrimdışı durumları için ortak kutu.
export function durumKutusu(tur, mesaj, eylem) {
  return h('div', { class: 'b-durum', 'data-durum': tur, role: tur === 'hata' ? 'alert' : 'status' },
    h('p', null, mesaj),
    eylem ? h('button', { class: 'b-dugme', onClick: eylem.fn }, eylem.metin) : null,
  );
}

// Düzeltme farkı: silinen kırmızı ve üstü çizili, eklenen yeşil, kalın ve altı çizili (Y15).
export function farkCiz(segmentler) {
  return h('p', { class: 'b-fark' },
    segmentler.map((s, i) => {
      const bosluk = i < segmentler.length - 1 ? ' ' : '';
      if (s.tur === 'sil') return [h('del', { class: 'b-fark-sil' }, s.metin), bosluk];
      if (s.tur === 'ekle') return [h('ins', { class: 'b-fark-ekle' }, s.metin), bosluk];
      return s.metin + bosluk;
    }),
  );
}

// Basit onay penceresi; Promise<boolean> döndürür.
export function onayIste({ baslik, metin, evet, hayir }) {
  return new Promise((coz) => {
    const kapat = (sonuc) => { perde.remove(); coz(sonuc); };
    const perde = h('div', { class: 'b-perde', role: 'dialog', 'aria-modal': 'true' },
      h('div', { class: 'b-pencere' },
        baslik ? h('h2', { class: 'b-bolum-baslik' }, baslik) : null,
        h('p', null, metin),
        h('div', { class: 'b-yigin' },
          h('button', { class: 'b-dugme b-dugme-ana', onClick: () => kapat(true) }, evet),
          h('button', { class: 'b-dugme b-dugme-cerceve', onClick: () => kapat(false) }, hayir),
        ),
      ),
    );
    document.body.append(perde);
    perde.querySelector('button').focus();
  });
}

// ===== HelloTalk düzeni (v0.4.0): ince üst çubuk, metin sekmeleri, dil çifti =====
// Üst çubuk: solda/sağda simge düğmeleri, ortada başlık. Sayfa kayarken üstte kalır.
export function htUst({ sol, baslik, sag, orta }) {
  return h('header', { class: 'b-ht-ust' },
    h('div', { class: 'b-ht-ust-sol' }, sol || null),
    orta || h('h1', { class: 'b-ht-baslik' }, baslik),
    h('div', { class: 'b-ht-ust-sag' }, sag || null),
  );
}

export function htIkon(icerik, etiket, onClick, { rozet } = {}) {
  return h('button', { type: 'button', class: 'b-ht-ikon', 'aria-label': etiket, title: etiket, onClick },
    typeof icerik === 'string' ? ikon(icerik, 22) : icerik,
    rozet ? h('span', { class: 'b-ht-rozet' }, String(rozet)) : null,
  );
}

// Yatay kayan metin sekmeleri (Güncel / Senin için ...) veya hap sekmeler (tur: 'hap').
export function sekmeler(secenekler, aktif, degisti, { tur = 'metin', etiket } = {}) {
  const kap = h('div', { class: `b-sekmeler b-sekmeler-${tur}`, role: 'group', 'aria-label': etiket || null });
  secenekler.forEach(([id, ad]) => {
    kap.append(h('button', { type: 'button', class: 'b-sekme', 'aria-pressed': String(id === aktif), onClick: () => {
      kap.querySelectorAll('.b-sekme').forEach((d) => d.setAttribute('aria-pressed', 'false'));
      kap.querySelector(`[data-id="${id}"]`).setAttribute('aria-pressed', 'true');
      degisti(id);
    }, 'data-id': id }, ad));
  });
  return kap;
}

// HelloTalk dil çifti: ana dil (yeşil çizgi) ⇄ öğrenilen dil (seviye noktaları).
const NOKTA_SEVIYE = ['A1', 'A2', 'B1', 'B2', 'C1'];
export function seviyeNoktalari(seviye) {
  const n = Math.max(1, NOKTA_SEVIYE.indexOf(seviye) + 1);
  return h('span', { class: 'b-noktalar', 'aria-hidden': 'true' }, NOKTA_SEVIYE.map((_, i) => h('i', { class: i < n ? 'b-nokta-dolu' : '' })));
}

export function dilCifti(anaDil, ogrenilenDil, seviye, { adlarla = false } = {}) {
  const kod = (d) => (d || '?').toUpperCase();
  return h('span', { class: 'b-dil-cift', 'aria-label': `${t(`diller.${anaDil}`)} → ${t(`diller.${ogrenilenDil}`)} ${seviye || ''}` },
    h('span', { class: 'b-dil-ana' }, h('b', null, kod(anaDil)), h('i', { class: 'b-dil-cizgi' }), adlarla ? h('small', null, t(`diller.${anaDil}`)) : null),
    h('span', { class: 'b-dil-ok', 'aria-hidden': 'true' }, ikon('degis', 16)),
    h('span', { class: 'b-dil-ogr' }, h('b', null, kod(ogrenilenDil)), seviyeNoktalari(seviye), adlarla ? h('small', null, t(`diller.${ogrenilenDil}`)) : null),
  );
}

// Uygulama logosu: iki konuşma balonu (biri öğrenilen dil, biri ses dalgası). Renkler jetonlardan (Y3).
let logoSayac = 0;
export function logo(boyut = 64) {
  logoSayac += 1;
  const z = `b-lz${logoSayac}`, a = `b-la${logoSayac}`;
  const svg = document.createElementNS(SVG_AD_ALANI, 'svg');
  svg.setAttribute('viewBox', '0 0 64 64');
  svg.setAttribute('width', boyut);
  svg.setAttribute('height', boyut);
  svg.setAttribute('class', 'b-logo');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `<defs><linearGradient id="${z}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="b-logo-zemin-1"/><stop offset="1" class="b-logo-zemin-2"/></linearGradient>`
    + `<linearGradient id="${a}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="b-logo-altin-1"/><stop offset="1" class="b-logo-altin-2"/></linearGradient></defs>`
    + `<rect width="64" height="64" rx="16" fill="url(#${z})"/>`
    + `<rect class="b-logo-arka" x="10" y="11" width="32" height="22" rx="9"/><path class="b-logo-arka" d="M16 30l-3 10 11-7z"/>`
    + `<path class="b-logo-arka-cizgi" d="M17 20h18M17 25.5h11" fill="none" stroke-width="3" stroke-linecap="round"/>`
    + `<rect x="22" y="27" width="32" height="23" rx="9" fill="url(#${a})"/><path d="M46 47l5 9-11-6z" fill="url(#${a})"/>`
    + `<path class="b-logo-on-cizgi" d="M30.5 36v5.5M35.5 33v11.5M40.5 35v7.5M45.5 37v3.5" fill="none" stroke-width="3" stroke-linecap="round"/>`;
  return svg;
}

// Kompakt topluluk kuralları: 4 kısa madde, iki sütun.
export function kurallarSeridi() {
  return h('section', { class: 'b-kurallar', 'aria-label': t('kesfet.kurallarBaslik') },
    h('div', { class: 'b-kurallar-ust' }, ikon('kalkan', 16), t('kesfet.kurallarBaslik')),
    h('ul', { class: 'b-kurallar-liste' }, [1, 2, 3, 4].map((n) => h('li', null, t(`kurallarKisa.${n}`)))),
  );
}

// Kullanıcının kendi avatarı: profil fotoğrafı varsa o, yoksa adının baş harfi (altın zemin).
export function benAvatar(boyut = 44, sinif = '') {
  const p = al().profil;
  if (p.foto) return h('img', { class: `b-av b-av-foto ${sinif}`, src: p.foto, alt: '', width: boyut, height: boyut, style: `width:${boyut}px;height:${boyut}px` });
  return h('span', { class: `b-av b-av-ben ${sinif}`, style: `width:${boyut}px;height:${boyut}px;font-size:${Math.round(boyut * 0.42)}px`, 'aria-hidden': 'true' }, (p.ad || '?').charAt(0).toLocaleUpperCase());
}

// İkili aralık kaydırıcısı (seviye, yaş): iki yerel range girdisi üst üste; klavye ve ekran okuyucu ile çalışır.
export function aralikKaydirici({ min, max, adim = 1, deger, etiket, bicim = (v) => String(v), degisti, noktalar = false }) {
  let [alt, ust] = deger;
  const ozet = h('span', { class: 'b-aralik-deger' });
  const dolgu = h('span', { class: 'b-aralik-dolgu' });
  const girdi = (v, ad) => h('input', { type: 'range', class: 'b-aralik-girdi', min, max, step: adim, value: v, 'aria-label': `${etiket} ${ad}` });
  const g1 = girdi(alt, '↓'); const g2 = girdi(ust, '↑');
  function guncelle(oynayan) {
    alt = Number(g1.value); ust = Number(g2.value);
    if (alt > ust) { if (oynayan === g1) { ust = alt; g2.value = ust; } else { alt = ust; g1.value = alt; } }
    const y = (v) => ((v - min) / (max - min)) * 100;
    dolgu.style.left = `${y(alt)}%`; dolgu.style.right = `${100 - y(ust)}%`;
    ozet.textContent = alt === min && ust === max ? bicim(null) : `${bicim(alt)} – ${bicim(ust)}`;
  }
  g1.addEventListener('input', () => { guncelle(g1); degisti([alt, ust]); });
  g2.addEventListener('input', () => { guncelle(g2); degisti([alt, ust]); });
  guncelle();
  return h('div', { class: 'b-aralik' },
    h('div', { class: 'b-aralik-ust' }, h('span', { class: 'b-aralik-etiket' }, etiket), ozet),
    h('div', { class: 'b-aralik-ray' }, h('span', { class: 'b-aralik-iz' }), dolgu, g1, g2),
    noktalar ? h('div', { class: 'b-aralik-noktalar', 'aria-hidden': 'true' }, Array.from({ length: (max - min) / adim + 1 }, (_, i) => h('span', null, bicim(min + i * adim)))) : null,
  );
}

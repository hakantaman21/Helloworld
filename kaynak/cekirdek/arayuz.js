// Ortak arayüz yardımcıları: öğe oluşturma, ikonlar, üst başlık, alt gezinme, durum kutuları.
import { t } from './metin.js';

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

// Üst başlık: tabela (nerede olduğun), başlık, alt başlık, sağda isteğe bağlı içerik.
export function ustBaslik({ tabela, baslik, alt, sag, geri }) {
  return h('header', { class: 'b-ust' },
    h('div', { class: 'b-ust-metin' },
      tabela ? h('div', { class: 'b-tabela' }, tabela) : null,
      h('h1', { class: 'b-baslik' }, baslik),
      alt ? h('p', { class: 'b-altbaslik' }, alt) : null,
    ),
    geri ? h('button', { class: 'b-dugme b-dugme-cerceve b-dugme-yuvarlak', 'aria-label': t('genel.geri'), onClick: geri }, ikon('sol', 20)) : null,
    sag || null,
  );
}

// Dört sekme (Anayasa bölüm 4): Sohbetler · Keşfet · Pratik · Profil
const GEZINME = [
  { yol: '/sohbetler', ikon: 'sohbet', anahtar: 'gezinme.sohbetler' },
  { yol: '/kesfet', ikon: 'pusula', anahtar: 'gezinme.baglanti' },
  { yol: '/dil-anlari', ikon: 'yildiz', anahtar: 'gezinme.dilAnlari' },
  { yol: '/bugun', ikon: 'dalga', anahtar: 'gezinme.pratik' },
  { yol: '/gelisim', ikon: 'kisi', anahtar: 'gezinme.profil' },
];

export function altGezinme(aktifYol) {
  return h('nav', { class: 'b-gezinme', 'aria-label': t('gezinme.etiket') },
    h('div', { class: 'b-gezinme-ic' },
      GEZINME.map((g) => h('a', {
        class: 'b-gezinme-oge',
        href: '#' + g.yol,
        'aria-current': g.yol === aktifYol ? 'page' : false,
      }, ikon(g.ikon), t(g.anahtar))),
    ),
  );
}

// English Prime esinli: her ana ekranda tek satır profil / ayarlar, gerçek hedeflere gider.
export function ustKontroller(ad) {
  return h('div', { class: 'b-ust-kontroller' },
    h('a', { class: 'b-ust-profil', href: '#/gelisim', 'aria-label': t('gezinme.profil') },
      h('span', { class: 'b-ust-avatar', 'aria-hidden': 'true' }, (ad || '?').charAt(0).toLocaleUpperCase()),
      h('span', null, t('gezinme.profil'))),
    h('span', { class: 'b-ust-marka' }, t('uygulama.ad')),
    h('a', { class: 'b-ust-ayar', href: '#/ayarlar', 'aria-label': t('ayarlar.baslik') }, ikon('ayar', 22)),
  );
}

// Y26: yapay zekâ içerikleri her zaman bu etiketi taşır; yapay zekâ kendini insan gibi göstermez.
export function yzEtiketi() {
  return h('span', { class: 'b-cip b-yz', title: t('ortak.yzAciklama') }, ikon('yildiz', 14, 2.2), t('ortak.yz'));
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

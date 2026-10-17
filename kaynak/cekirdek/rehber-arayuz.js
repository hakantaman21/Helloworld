// v0.19.0 Rehberliğin ekrandaki parçaları: uygulama turu (gerçek öğelerin üstünde ışık), yenilikler penceresi,
// ekran ipucu şeridi, "Yeni" etiketi ve okunmamış rozetleri. Kurallar cekirdek/rehber.js'te.
import { h, ikon, ikon3d } from './arayuz.js';
import { t, yerel } from './metin.js';
import { al } from './depo.js';
import { dinle } from './olay-hatti.js';
import { git } from './yonlendirici.js';
import { TUR_ADIMLARI } from '../veri/rehber-dizini.js';
import * as rehber from './rehber.js';

const ANA_EKRANLAR = ['sohbetler', 'kesfet', 'bugun', 'dil-anlari', 'gelisim'];
const MESGUL = ['karsilama', 'gorusme', 'gelen-arama'];
let turAcik = false;
let turDenendi = false;

const kilitAcik = () => Boolean(document.querySelector('.b-kilit'));
const katmanAcik = () => Boolean(document.querySelector('.b-alt-pencere-perde, .b-perde, .b-katman'));

// ---- "Yeni" etiketi ----
function yeniEtiketi(kimlik) {
  return rehber.yeniMi(kimlik) ? h('span', { class: 'b-yeni', title: t('rehber.yeniAciklama') }, t('rehber.yeni')) : null;
}
function yolYeniEtiketi(yol) {
  return rehber.yolYeniMi(yol) ? h('span', { class: 'b-yeni', title: t('rehber.yeniAciklama') }, t('rehber.yeni')) : null;
}

// ---- Bir özelliği aç: yol ya da eylem; "Yeni" etiketi kalkar ----
function ozellikAc(o, gitFn = git) {
  if (!o) return;
  rehber.yeniGoruldu(o.kimlik);
  if (o.eylem === 'tur') { turBaslat(gitFn); return; }
  if (o.eylem === 'yenilikler') { yeniliklerAc({ tumu: true }); return; }
  if (o.yol) gitFn(o.yol);
}

// ---- Okunmamış rozeti: profil fotoğrafı düğmesinde ve yan menüde; kutu değişince yerinde güncellenir ----
let rozetZamanlayici = null;
function rozetleriYenile() {
  clearTimeout(rozetZamanlayici);
  rozetZamanlayici = setTimeout(() => {
    const n = rehber.okunmamisSayisi();
    document.querySelectorAll('[data-kutu-rozet]').forEach((el) => {
      el.textContent = n > 99 ? '99+' : String(n);
      el.hidden = n === 0;
    });
    document.querySelectorAll('[data-kutu-etiket]').forEach((el) => { el.setAttribute('aria-label', `${el.dataset.kutuEtiket}${n ? ` · ${t('rehber.okunmamisN', { n })}` : ''}`); });
  }, 120);
}
function kutuRozeti() {
  const n = rehber.okunmamisSayisi();
  return h('span', { class: 'b-ht-rozet b-kutu-rozet', 'data-kutu-rozet': '', hidden: n === 0, 'aria-hidden': 'true' }, n > 99 ? '99+' : String(n));
}

// Üst bant için zil düğmesi: kutuya gider, okunmamış sayısını taşır.
function kutuDugmesi(gitFn = git) {
  const etiket = t('rehber.kutu.baslik');
  const n = rehber.okunmamisSayisi();
  return h('button', { type: 'button', class: 'b-ht-ikon b-zil', title: etiket, 'aria-label': n ? `${etiket} · ${t('rehber.okunmamisN', { n })}` : etiket, 'data-kutu-etiket': etiket, onClick: () => gitFn('/kutu') },
    ikon('zil', 22), kutuRozeti());
}

// ---- Yenilikler penceresi (alt pencere) ----
function yeniliklerAc({ tumu = false } = {}) {
  const liste = tumu ? rehber.YENILIKLER : rehber.bekleyenYenilikler();
  rehber.yeniliklerGosterildi();
  if (!liste.length) return;
  const kapat = () => { perde.remove(); document.removeEventListener('keydown', tus); };
  const tus = (e) => { if (e.key === 'Escape') kapat(); };
  const perde = h('div', { class: 'b-alt-pencere-perde', onClick: (e) => { if (e.target === perde) kapat(); } },
    h('div', { class: 'b-alt-pencere b-yenilik', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'b-yenilik-baslik' },
      h('div', { class: 'b-alt-pencere-tutamak', 'aria-hidden': 'true' }),
      h('div', { class: 'b-alt-pencere-ust' },
        h('h2', { class: 'b-alt-pencere-baslik', id: 'b-yenilik-baslik' }, ikon3d('hediye', 28), t('rehber.yenilik.baslik')),
        h('button', { type: 'button', class: 'b-ht-ikon b-ht-ikon-saydam', 'aria-label': t('genel.kapat'), onClick: kapat }, ikon('kapat', 20))),
      h('div', { class: 'b-alt-pencere-ic' },
        liste.map((y) => h('section', { class: 'b-yenilik-surum' },
          h('h3', { class: 'b-grup-etiket' }, t('rehber.yenilik.surum', { s: y.surum })),
          h('ul', { class: 'b-yenilik-liste' }, y.maddeler.map((m) => {
            const o = rehber.ozellik(m.ozellik);
            return h('li', null,
              h('button', { type: 'button', class: 'b-yenilik-madde', onClick: () => { kapat(); ozellikAc(o); } },
                ikon3d(o ? o.ikon : 'yildiz', 32),
                h('span', { class: 'b-yenilik-metin' }, h('b', null, o ? yerel(o.ad) : ''), h('span', null, yerel(m.metin))),
                ikon('sag', 16)));
          })))),
        h('div', { class: 'b-yenilik-alt' },
          h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => { kapat(); git('/kilavuz'); } }, t('rehber.kilavuzAc')),
          h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: kapat }, t('rehber.tamam')))),
    ));
  document.addEventListener('keydown', tus);
  document.body.append(perde);
  const ilk = perde.querySelector('.b-yenilik-madde'); if (ilk) ilk.focus();
}

// ---- Ekran ipucu şeridi: ekrana ilk girişte bir kez ----
function ipucuSeridi(id) {
  if (turAcik || MESGUL.includes(id)) return;
  const o = rehber.ekranIpucu(id);
  if (!o) return;
  const kap = document.querySelector('main.b-ekran');
  if (!kap || kap.dataset.ekran !== id || kap.querySelector('.b-ipucu-serit')) return;
  rehber.ipucuGoruldu(o.kimlik);
  const serit = h('aside', { class: 'b-ipucu-serit', role: 'note', 'aria-label': t('rehber.ipucu') },
    ikon3d('ipucu', 30),
    h('span', { class: 'b-ipucu-metin' }, h('b', null, t('rehber.ipucu')), ' ', yerel(o.ipucu)),
    h('span', { class: 'b-ipucu-dugmeler' },
      h('button', { type: 'button', class: 'b-ipucu-dugme', onClick: () => git('/kilavuz') }, t('rehber.dahaFazla')),
      h('button', { type: 'button', class: 'b-ht-ikon b-ht-ikon-saydam b-ipucu-kapat', 'aria-label': t('rehber.anladim'), title: t('rehber.anladim'), onClick: () => serit.remove() }, ikon('kapat', 18))));
  // Üst bandın/başlığın hemen altına; başlık yoksa en üste.
  let ust = kap.querySelector(':scope > .b-bas-bant') || kap.querySelector(':scope > .b-ht-ust');
  if (ust && ust.nextElementSibling && ust.nextElementSibling.classList.contains('b-ht-alt')) ust = ust.nextElementSibling;
  if (ust) ust.after(serit); else kap.prepend(serit);
}

// ---- Uygulama turu ----
// Gerçek öğe ışıkla çevrelenir, kart yanında açıklar. Öğe yoksa (gizli, bulunamadı) adım ortada kart olarak gösterilir.
function turBaslat(gitFn = git) {
  if (turAcik) return;
  turAcik = true;
  turDenendi = true;
  document.querySelectorAll('.b-alt-pencere-perde, .b-ymenu-perde').forEach((x) => x.remove());
  gitFn('/bugun');
  setTimeout(() => turCiz(0), 450);
}

function turCiz(baslangic) {
  let sira = baslangic;
  const delik = h('div', { class: 'b-tur-delik', 'aria-hidden': 'true' });
  const sayac = h('span', { class: 'b-tur-sayac' });
  const baslik = h('h2', { class: 'b-tur-baslik', id: 'b-tur-baslik' });
  const metin = h('p', { class: 'b-tur-metin', id: 'b-tur-metin' });
  const resim = h('span', { class: 'b-tur-resim', 'aria-hidden': 'true' });
  const geriD = h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve b-tur-geri', onClick: () => adim(sira - 1) }, t('rehber.tur.geri'));
  const ileriD = h('button', { type: 'button', class: 'b-dugme b-dugme-ana b-tur-ileri', onClick: () => (sira >= TUR_ADIMLARI.length - 1 ? bitir() : adim(sira + 1)) });
  const kart = h('div', { class: 'b-tur-kart', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'b-tur-baslik', 'aria-describedby': 'b-tur-metin' },
    h('div', { class: 'b-tur-ust' }, sayac, h('button', { type: 'button', class: 'b-tur-gec', 'data-vazgec': '', onClick: () => bitir() }, t('rehber.tur.gec'))),
    resim, baslik, metin,
    h('div', { class: 'b-tur-noktalar', 'aria-hidden': 'true' }, TUR_ADIMLARI.map(() => h('i'))),
    h('div', { class: 'b-tur-dugmeler' }, geriD, ileriD));
  const katman = h('div', { class: 'b-tur b-katman' }, delik, kart);

  const tus = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); bitir(); }
    else if (e.key === 'ArrowRight') ileriD.click();
    else if (e.key === 'ArrowLeft' && sira > 0) adim(sira - 1);
  };
  const yerlestirAdim = () => {
    const a = TUR_ADIMLARI[sira];
    const hedef = a.hedef ? [...document.querySelectorAll(a.hedef)].find((x) => x.offsetParent !== null || x.getClientRects().length) : null;
    const kutu = hedef ? hedef.getBoundingClientRect() : null;
    katman.classList.toggle('b-tur-ortada', !kutu);
    if (kutu) {
      const p = 6;
      Object.assign(delik.style, { top: `${kutu.top - p}px`, left: `${kutu.left - p}px`, width: `${kutu.width + p * 2}px`, height: `${kutu.height + p * 2}px` });
      const altta = kutu.top + kutu.height / 2 > window.innerHeight / 2;
      kart.style.top = altta ? '' : `${Math.min(window.innerHeight - 40, kutu.bottom + 14)}px`;
      kart.style.bottom = altta ? `${Math.max(12, window.innerHeight - kutu.top + 14)}px` : '';
    } else {
      // Hedef yok: ışık ortada sıfır boyutta (yalnız karartma), kart ortada.
      Object.assign(delik.style, { top: '50%', left: '50%', width: '0px', height: '0px' });
      kart.style.top = ''; kart.style.bottom = '';
    }
  };
  function adim(i) {
    sira = Math.max(0, Math.min(TUR_ADIMLARI.length - 1, i));
    const a = TUR_ADIMLARI[sira];
    sayac.textContent = t('rehber.tur.adim', { n: sira + 1, toplam: TUR_ADIMLARI.length });
    baslik.textContent = yerel(a.baslik);
    metin.textContent = yerel(a.metin);
    resim.replaceChildren(...(a.ikon ? [ikon3d(a.ikon, 56)] : []));
    geriD.hidden = sira === 0;
    ileriD.textContent = sira >= TUR_ADIMLARI.length - 1 ? t('rehber.tur.bitir') : t('rehber.tur.ileri');
    kart.querySelectorAll('.b-tur-noktalar i').forEach((n, j) => n.classList.toggle('b-tur-aktif', j === sira));
    yerlestirAdim();
    ileriD.focus({ preventScroll: true });
  }
  function bitir() {
    window.removeEventListener('resize', yerlestirAdim);
    document.removeEventListener('keydown', tus, true);
    katman.remove();
    turAcik = false;
    rehber.turBitti();
  }
  window.addEventListener('resize', yerlestirAdim);
  document.addEventListener('keydown', tus, true);
  document.body.append(katman);
  adim(sira);
}

// ---- Başlatma: ekran değişince ipucu şeridi, ilk girişte tur, güncellemeden sonra yenilikler ----
function rehberArayuzBaslat() {
  dinle('kutu:degisti', rozetleriYenile);
  dinle('depo:degisti', rozetleriYenile);
  dinle('ekran:degisti', ({ id }) => {
    rozetleriYenile();
    if (MESGUL.includes(id) || turAcik) return;
    setTimeout(() => {
      // Bu arada başka ekrana geçildiyse (ör. koç araması geldi) hiçbir şey açma.
      const kap = document.querySelector('main.b-ekran');
      if (turAcik || kilitAcik() || !kap || kap.dataset.ekran !== id) return;
      const v = al();
      if (!v.profil.kurulumTamam) return;
      const tur = rehber.turDurumu();
      if (!tur.tamam && !turDenendi && ANA_EKRANLAR.includes(id) && !katmanAcik()) { turBaslat(); return; }
      if (tur.tamam && ANA_EKRANLAR.includes(id) && rehber.bekleyenYenilikler().length && !katmanAcik()) { yeniliklerAc(); return; }
      ipucuSeridi(id);
    }, 600);
  });
}

export { yeniEtiketi, yolYeniEtiketi, ozellikAc, kutuRozeti, kutuDugmesi, rozetleriYenile, yeniliklerAc, turBaslat, rehberArayuzBaslat };

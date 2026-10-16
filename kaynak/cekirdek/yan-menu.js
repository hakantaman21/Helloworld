// v0.16.0 Ortak yan menü ve "ben" düğmesi (Hakan onayı, 17.10.2026): beş ana sayfanın üst bandında solda profil
// fotoğrafı; dokununca bu menü açılır. Menünün üstü "Profilini gör" (kimlik sayfası /profil), altında kısa yollar,
// Gelişim ve Ayarlar. Sağ alttaki sekme artık "Gelişim" (öğrenme ilerlemesi); kimlik bilgileri fotoğrafın arkasında.
import { h, ikon, ikon3d, benAvatar, htIkon } from './arayuz.js';
import { t } from './metin.js';
import { al } from './depo.js';
import { oneriSenaryo } from './oneri.js';

const KAPAMA_ESIGI = 70;

export function yanMenuAc(b) {
  const kapat = () => { perde.remove(); document.removeEventListener('keydown', tus); };
  const tus = (e) => { if (e.key === 'Escape') kapat(); };
  const git = (yol) => () => { kapat(); b.git(typeof yol === 'function' ? yol() : yol); };
  const satir = (ik, ad, alt, yol) => h('button', { type: 'button', class: 'b-ymenu-satir', onClick: git(yol) },
    ikon3d(ik, 30), h('span', { class: 'b-ymenu-metin' }, h('b', null, ad), alt ? h('small', null, alt) : null), ikon('sag', 16));
  const grup = (baslik, ...satirlar) => h('section', { class: 'b-ymenu-grup' }, h('h3', { class: 'b-ymenu-grup-baslik' }, baslik), h('div', { class: 'b-ymenu-kart' }, ...satirlar));
  const v = al();
  const perde = h('div', { class: 'b-ymenu-perde b-katman', onClick: (e) => { if (e.target === perde) kapat(); } },
    h('aside', { class: 'b-ymenu b-katman-ic', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('yanMenu.baslik') },
      h('div', { class: 'b-ymenu-ust' },
        h('button', { type: 'button', class: 'b-ymenu-profil', onClick: git('/profil'), 'aria-label': t('yanMenu.profiliGor') },
          benAvatar(48),
          h('span', { class: 'b-ymenu-kim' }, h('b', null, v.profil.ad || t('misafir.ad')), h('small', null, t('yanMenu.profiliGor')))),
        h('button', { type: 'button', class: 'b-ht-ikon b-ht-ikon-saydam', 'aria-label': t('genel.kapat'), onClick: kapat }, ikon('kapat', 20))),
      h('button', { type: 'button', class: 'b-ymenu-afis', onClick: git(() => `/gorusme?tur=senaryo&id=${oneriSenaryo().senaryo.kimlik}`) },
        h('span', { class: 'b-ymenu-afis-metin' }, h('small', null, t('yanMenu.afisEtiket')), h('b', null, t('yanMenu.afisBaslik')), h('span', null, t('yanMenu.afisAlt'))),
        ikon3d('telaffuz', 56)),
      grup(t('yanMenu.ogren'),
        satir('senaryo', t('ht.merkez.senaryolar'), t('yanMenu.senaryoAlt'), '/senaryolar'),
        satir('telaffuz', t('telaffuz.baslik'), t('yanMenu.telaffuzAlt'), '/telaffuz'),
        satir('hafiza', t('ht.merkez.hafiza'), t('yanMenu.hafizaAlt'), '/hafiza'),
        satir('kitap', t('defter.baslik'), t('yanMenu.defterAlt'), '/gelisim')),
      grup(t('yanMenu.topluluk'),
        satir('baglanti', t('ht.ortakBul'), t('yanMenu.ortakAlt'), '/kesfet'),
        satir('anlar', t('anlar.baslik'), t('yanMenu.anlarAlt'), '/dil-anlari')),
      grup(t('yanMenu.hesap'),
        satir('profil', t('yanMenu.profiliGor'), t('yanMenu.profilAlt'), '/profil'),
        satir('kupa', t('gezinme.gelisim'), t('yanMenu.gelisimAlt'), '/gelisim'),
        satir('ayarlar', t('ayarlar.baslik'), t('yanMenu.ayarlarAlt'), '/ayarlar')),
    ));
  // Parmakla sola sürükleyince kapanır; az sürüklenirse yerine döner.
  const menu = perde.querySelector('.b-ymenu');
  let bas = null;
  let dx = 0;
  menu.addEventListener('touchstart', (e) => { bas = { x: e.touches[0].clientX, y: e.touches[0].clientY, yatay: null }; dx = 0; }, { passive: true });
  menu.addEventListener('touchmove', (e) => {
    if (!bas) return;
    const x = e.touches[0].clientX - bas.x;
    const y = e.touches[0].clientY - bas.y;
    if (bas.yatay === null && (Math.abs(x) > 8 || Math.abs(y) > 8)) bas.yatay = Math.abs(x) > Math.abs(y);
    if (!bas.yatay) return;
    dx = Math.min(0, x);
    menu.classList.add('b-ymenu-surukle');
    menu.style.transform = `translateX(${dx}px)`;
  }, { passive: true });
  const birak = () => {
    if (!bas) return;
    bas = null;
    menu.classList.remove('b-ymenu-surukle');
    if (dx < -KAPAMA_ESIGI) { menu.style.transform = 'translateX(-105%)'; setTimeout(kapat, 200); } else menu.style.transform = '';
  };
  menu.addEventListener('touchend', birak, { passive: true });
  menu.addEventListener('touchcancel', birak, { passive: true });
  document.addEventListener('keydown', tus);
  document.body.append(perde);
  perde.querySelector('button').focus();
}

// Üst bandın solundaki profil fotoğrafı (tek giriş noktası; ayrı ☰ yok).
export function benDugmesi(b) {
  return htIkon(benAvatar(36, 'b-ben-av'), t('yanMenu.baslik'), () => yanMenuAc(b));
}

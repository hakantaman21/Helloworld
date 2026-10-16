// Sohbetler (HelloTalk "Dil Sohbetleri" düzeni): üstte hızlı erişim simgeleri, arama, hap süzgeçler, düz sohbet listesi.
// Yapay zekâ koçu ve konuşma geçmişi her zaman "yapay zekâ" etiketi taşır (Y26); gerçek kişi uydurulmaz.
// Test modunda TEST rozetli sanal kullanıcıların sohbetleri ve sana uygun ilk eşleşme önerisi görünür.
import './sohbetler.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, ikon3d, altGezinme, basBant, durumKutusu, yzEtiketi, yerlestir, testEtiketi, testAvatar, htUst, htIkon, sekmeler, goreliZaman, benAvatar } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { kisaTarih } from '../../cekirdek/zaman.js';
import { oneriSenaryo } from '../../cekirdek/oneri.js';
import { testModuAcik, testSohbetOzetleri, aktiflik, enIyiEslesmeler } from '../../cekirdek/test-modu.js';

const SON_KONUSMA_SAYISI = 30;

// İlk satır (5 kısayol) her zaman görünür; bandın altındaki tutamak ikinci satırı açar (HelloTalk'taki genişleyen ızgara).
// v0.10.0: v0.6.0'daki ilk satır geri geldi (Dil Anları dahil 5 kısayol); "Daha fazla" artık bir sütun yemiyor.
const HIZLI = [
  ['senaryo', 'senaryolar', '/senaryolar', 1],
  ['hafiza', 'hafiza', '/hafiza', 3],
  ['yz', 'koc', null, 4],
  ['baglanti', 'partner', '/kesfet', 5],
  ['anlar', 'anlar', '/dil-anlari', 2],
  ['telaffuz', 'telaffuz', null, 5],
  ['kitap', 'defter', '/gelisim?sekme=profil', 6],
  ['kupa', 'karne', '/gelisim?sekme=gelisim', 2],
  ['pratik', 'odalar', '/bugun', 1],
];
let hizliAcik = false;
const MENU_KAPAMA_ESIGI = 70;

// Yan menü (HelloTalk ☰): kategorilere ayrılmış kısa yollar; üstte günün önerisi.
function yanMenu(b, kocaGit) {
  const kapat = () => { perde.remove(); document.removeEventListener('keydown', tus); };
  const tus = (e) => { if (e.key === 'Escape') kapat(); };
  const git = (yol) => () => { kapat(); if (yol) b.git(yol); else kocaGit(); };
  const satir = (ik, ad, alt, yol) => h('button', { type: 'button', class: 'shb-menu-satir', onClick: git(yol) },
    ikon3d(ik, 30), h('span', { class: 'shb-menu-metin' }, h('b', null, ad), alt ? h('small', null, alt) : null), ikon('sag', 16));
  const grup = (baslik, ...satirlar) => h('section', { class: 'shb-menu-grup' }, h('h3', { class: 'shb-menu-grup-baslik' }, baslik), h('div', { class: 'shb-menu-kart' }, ...satirlar));
  const v = al();
  const perde = h('div', { class: 'shb-menu-perde b-katman', onClick: (e) => { if (e.target === perde) kapat(); } },
    h('aside', { class: 'shb-menu b-katman-ic', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('yanMenu.baslik') },
      h('div', { class: 'shb-menu-ust' },
        // Üstteki ad ve fotoğraf = alt menüdeki "Profil" sekmesinin kısayolu (tek profil sayfası; tutarlılık v0.11.0).
        h('button', { type: 'button', class: 'shb-menu-profil', onClick: git('/gelisim?sekme=profil'), 'aria-label': t('yanMenu.profiliGor') },
          benAvatar(48),
          h('span', { class: 'shb-menu-kim' }, h('b', null, v.profil.ad || t('misafir.ad')), h('small', null, t('yanMenu.profiliGor')))),
        h('button', { type: 'button', class: 'b-ht-ikon b-ht-ikon-saydam', 'aria-label': t('genel.kapat'), onClick: kapat }, ikon('kapat', 20))),
      h('button', { type: 'button', class: 'shb-menu-afis', onClick: git(null) },
        h('span', { class: 'shb-menu-afis-metin' }, h('small', null, t('yanMenu.afisEtiket')), h('b', null, t('yanMenu.afisBaslik')), h('span', null, t('yanMenu.afisAlt'))),
        ikon3d('telaffuz', 56)),
      grup(t('yanMenu.ogren'),
        satir('senaryo', t('ht.merkez.senaryolar'), t('yanMenu.senaryoAlt'), '/senaryolar'),
        satir('hafiza', t('ht.merkez.hafiza'), t('yanMenu.hafizaAlt'), '/hafiza'),
        satir('kitap', t('defter.baslik'), t('yanMenu.defterAlt'), '/gelisim?sekme=profil')),
      grup(t('yanMenu.topluluk'),
        satir('baglanti', t('ht.ortakBul'), t('yanMenu.ortakAlt'), '/kesfet'),
        satir('anlar', t('anlar.baslik'), t('yanMenu.anlarAlt'), '/dil-anlari'),
        satir('pratik', t('odalar.baslik'), t('yanMenu.odalarAlt'), '/bugun')),
      grup(t('yanMenu.hesap'),
        satir('profil', t('gezinme.profil'), t('yanMenu.profilAlt'), '/gelisim?sekme=profil'),
        satir('ayarlar', t('ayarlar.baslik'), t('yanMenu.ayarlarAlt'), '/ayarlar')),
    ));
  // Parmakla sola (dış kenara) sürükleyince kapanır; az sürüklenirse yerine döner.
  const menu = perde.querySelector('.shb-menu');
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
    menu.classList.add('shb-menu-surukle');
    menu.style.transform = `translateX(${dx}px)`;
  }, { passive: true });
  const birak = () => {
    if (!bas) return;
    bas = null;
    menu.classList.remove('shb-menu-surukle');
    if (dx < -MENU_KAPAMA_ESIGI) { menu.style.transform = 'translateX(-105%)'; setTimeout(kapat, 200); } else menu.style.transform = '';
  };
  menu.addEventListener('touchend', birak, { passive: true });
  menu.addEventListener('touchcancel', birak, { passive: true });
  document.addEventListener('keydown', tus);
  document.body.append(perde);
  perde.querySelector('button').focus();
}

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const v = al();
  const gecmis = (v.gorusmeler || []).slice(0, SON_KONUSMA_SAYISI);
  const testOzet = testSohbetOzetleri();
  const kocaGit = () => b.git(`/gorusme?tur=senaryo&id=${oneriSenaryo().senaryo.kimlik}`);
  let filtre = 'tum';
  let arama = '';
  const liste = h('div', { class: 'b-liste shb-liste', role: 'region', 'aria-live': 'polite', 'aria-label': t('sohbetler.listeBaslik') });

  const kocSatiri = () => h('button', { type: 'button', class: 'b-liste-satir', onClick: kocaGit },
    h('span', { class: 'shb-av-yz', 'aria-hidden': 'true' }, ikon3d('yz', 36)),
    h('span', { class: 'b-liste-ic' },
      h('span', { class: 'b-liste-ust' }, h('b', null, t('koc.ad')), yzEtiketi()),
      h('span', { class: 'b-liste-alt' }, t('sohbetler.yzKartAlt')),
    ));

  const gecmisSatiri = (g) => h('button', { type: 'button', class: 'b-liste-satir', onClick: kocaGit },
    h('span', { class: 'shb-av-yz shb-av-gecmis', 'aria-hidden': 'true' }, ikon3d('senaryo', 30)),
    h('span', { class: 'b-liste-ic' },
      h('span', { class: 'b-liste-ust' }, h('b', null, yerel(g.baslik)), h('span', { class: 'b-liste-zaman' }, kisaTarih(g.tarih))),
      h('span', { class: 'b-liste-alt' }, t('genel.dk', { n: Math.max(0.1, Math.round((g.sureSn / 60) * 10) / 10) }), ' · ', t('ht.yzPratik')),
    ));

  const testSatiri = (o) => {
    const a = aktiflik(o.profil);
    return h('button', { type: 'button', class: 'b-liste-satir', onClick: () => b.git(`/mesaj?k=${o.profil.kimlik}`) },
      testAvatar(o.profil, 52, { cevrimici: a.cevrimici }),
      h('span', { class: 'b-liste-ic' },
        h('span', { class: 'b-liste-ust' }, h('b', null, o.profil.ad), testEtiketi(), h('span', { class: 'b-liste-zaman' }, goreliZaman(o.son.zaman))),
        h('span', { class: 'b-liste-alt' }, o.son.kim === 'ben' ? `${t('ht.sen')}: ` : '', o.son.metin),
      ));
  };

  function yenile() {
    const ara = (metin) => String(metin).toLocaleLowerCase().includes(arama);
    const yzGoster = filtre === 'tum' || filtre === 'yz';
    const insanGoster = filtre === 'tum' || filtre === 'insan' || filtre === 'cevrimici';
    const testler = testOzet.filter((o) => ara(o.profil.ad) && (filtre !== 'cevrimici' || aktiflik(o.profil).cevrimici));
    const gecmisler = yzGoster ? gecmis.filter((g) => ara(yerel(g.baslik))) : [];
    const kocVar = yzGoster && ara(t('koc.ad'));
    const oneri = testModuAcik() && !arama && filtre !== 'yz' ? enIyiEslesmeler()[0] : null;
    yerlestir(liste,
      kocVar ? kocSatiri() : null,
      insanGoster ? testler.map(testSatiri) : null,
      gecmisler.map(gecmisSatiri),
      oneri && !testOzet.some((o) => o.profil.kimlik === oneri.profil.kimlik) ? h('button', { type: 'button', class: 'b-liste-satir shb-oneri', onClick: () => b.git(`/kisi?k=${oneri.profil.kimlik}`) },
        testAvatar(oneri.profil, 52, { cevrimici: aktiflik(oneri.profil).cevrimici }),
        h('span', { class: 'b-liste-ic' },
          h('span', { class: 'b-liste-ust' }, h('b', null, oneri.profil.ad), testEtiketi(), h('span', { class: 'b-etiket-hap b-etiket-hap-iyi shb-uyum' }, t('ht.uyum', { n: oneri.puan }))),
          h('span', { class: 'b-liste-alt shb-oneri-alt' }, t('ht.oneriSatir')),
        )) : null,
      !kocVar && !testler.length && !gecmisler.length
        ? durumKutusu('bos', filtre === 'insan' || filtre === 'cevrimici' ? t('sohbetler.insanBos') : t('sohbetler.aramaBos'), filtre === 'insan' ? { metin: t('sohbetler.kesfeteGit'), fn: () => b.git('/kesfet') } : undefined)
        : null,
    );
  }

  const hizliIzgara = h('nav', { class: 'b-platform shb-hizli', 'aria-label': t('ht.hizliErisim') });
  const tutamak = h('button', { type: 'button', class: 'b-bant-tutamak', onClick: () => { hizliAcik = !hizliAcik; hizliCiz(); } });
  function hizliCiz() {
    const gorunen = hizliAcik ? HIZLI : HIZLI.slice(0, 5);
    yerlestir(hizliIzgara, h('div', { class: 'b-uygulamalar shb-hizli-izgara' },
      gorunen.map(([ik, anahtar, yol, renk]) => h('button', { type: 'button', class: 'b-uygulama', onClick: yol ? () => b.git(yol) : kocaGit },
        h('span', { class: `b-uygulama-ikon b-kutu-${renk}` }, ikon3d(ik, 38)), t(`ht.hizli.${anahtar}`)))));
    tutamak.setAttribute('aria-expanded', String(hizliAcik));
    yerlestir(tutamak, ikon(hizliAcik ? 'yukari' : 'asagi', 16), t(hizliAcik ? 'ht.gizle' : 'ht.dahaFazla'));
  }
  hizliCiz();

  yerlestir(kok,
    basBant(
      htUst({
        // Profil fotoğrafı (v0.6.0'daki gibi) sol üstte; dokununca yan menü açılır (HelloTalk).
        sol: htIkon(benAvatar(36, 'shb-ben-av'), t('yanMenu.baslik'), () => yanMenu(b, kocaGit)),
        baslik: t('ht.sohbetBaslik'),
        sag: htIkon('arti', t('sohbetler.yeniKisi'), () => b.git('/kesfet')),
      }),
      hizliIzgara,
      tutamak,
    ),
    h('label', { class: 'b-ht-arama' }, ikon('ara', 18),
      h('input', { type: 'search', placeholder: t('ht.ara'), 'aria-label': t('sohbetler.ara'), onInput: (e) => { arama = e.target.value.trim().toLocaleLowerCase(); yenile(); } })),
    sekmeler([['tum', t('sohbetler.tumFiltre')], ['cevrimici', t('ht.cevrimici')], ['insan', t('sohbetler.insanFiltre')], ['yz', t('sohbetler.yzFiltre')]], filtre, (id) => { filtre = id; yenile(); }, { tur: 'hap', etiket: t('sohbetler.filtreBaslik') }),
    liste,
    testModuAcik() ? null : h('p', { class: 'b-kucuk shb-bilgi' }, t('sohbetler.insanBilgi')),
    altGezinme('/sohbetler'),
  );
  yenile();
  return null;
}

export default {
  kimlik: 'sohbetler',
  surum: '0.4.0',
  onek: 'shb',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'metin', 'test-modu'],
  ekranlar: { sohbetler: ekran({ baslikAnahtari: 'ekran.sohbetler', durumlar: DORT_DURUM, ciz }) },
};

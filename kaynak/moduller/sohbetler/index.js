// Sohbetler: HelloTalk'tan esinlenen arama ve filtreleme; AI ve gerçek kişiler kesin ayrılır.
// Arama yalnızca cihazdaki geçmişin başlığını filtreler, sunucu/gerçek kişi uydurulmaz.
import './sohbetler.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, ustBaslik, durumKutusu, yzEtiketi, yerlestir, testEtiketi } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { kisaTarih } from '../../cekirdek/zaman.js';
import { testSohbetOzetleri } from '../../cekirdek/test-modu.js';

const SON_KONUSMA_SAYISI = 30;

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const gecmis = (al().gorusmeler || []).slice(0, SON_KONUSMA_SAYISI);
  const testOzet = testSohbetOzetleri();
  let filtre = 'tum';
  let arama = '';
  const liste = h('div', { class: 'shb-liste', role: 'region', 'aria-live': 'polite' });
  const dugmeler = {};
  const aramaKutusu = h('input', { class: 'b-girdi shb-arama-girdi', type: 'search', 'aria-label': t('sohbetler.ara'), placeholder: t('sohbetler.ara'), onInput: (e) => { arama = e.target.value.trim().toLocaleLowerCase(); yenile(); } });
  // h() yalnız olay işleyicisi fonksiyonlarını bağlar. DOM input olayı yereldir.
  function yenile() {
    Object.entries(dugmeler).forEach(([anahtar, oge]) => oge.setAttribute('aria-pressed', String(filtre === anahtar)));
    const gorunen = gecmis.filter(g => yerel(g.baslik).toLocaleLowerCase().includes(arama));
    const yzVar = t('sohbetler.yzKart', { koc: t('koc.ad') }).toLocaleLowerCase().includes(arama);
    yerlestir(liste,
      filtre !== 'insan' && yzVar ? h('div', { class: 'b-kart b-kart-satir' },
        h('span', { class: 'shb-avatar shb-avatar-yz', 'aria-hidden': 'true' }, ikon('dalga', 22)),
        h('span', { class: 'shb-metin' },
          h('span', { class: 'shb-ad' }, t('sohbetler.yzKart', { koc: t('koc.ad') })),
          h('span', { class: 'b-kucuk' }, t('sohbetler.yzKartAlt')),
        ), yzEtiketi()) : null,
      filtre !== 'insan' ? gorunen.map(g => h('div', { class: 'b-kart b-kart-satir' },
        h('span', { class: 'shb-avatar shb-avatar-yz', 'aria-hidden': 'true' }, ikon('dalga', 18)),
        h('span', { class: 'shb-metin' },
          h('span', { class: 'shb-ad' }, yerel(g.baslik)),
          h('span', { class: 'b-kucuk' }, `${kisaTarih(g.tarih)} · ${t('genel.dk', { n: Math.max(0.1, Math.round((g.sureSn / 60) * 10) / 10) })}`),
        ), yzEtiketi())) : null,
      // Test modu: test sohbetleri "İnsanlar" altında, TEST rozetiyle (gerçek kişi değildir).
      filtre !== 'yz' ? testOzet.filter((o) => o.profil.ad.toLocaleLowerCase().includes(arama)).map((o) => h('button', { type: 'button', class: 'b-kart b-kart-satir b-kart-tiklanir shb-test', onClick: () => b.git(`/mesaj?k=${o.profil.kimlik}`) },
        h('span', { class: 'shb-avatar shb-avatar-test', 'aria-hidden': 'true' }, o.profil.bas),
        h('span', { class: 'shb-metin' },
          h('span', { class: 'shb-ad' }, o.profil.ad),
          h('span', { class: 'b-kucuk shb-son' }, o.son.metin),
        ), testEtiketi())) : null,
      filtre === 'insan' && !testOzet.length ? durumKutusu('bos', t('sohbetler.insanBos'), { metin: t('sohbetler.kesfeteGit'), fn: () => b.git('/kesfet') }) : null,
      filtre !== 'insan' && !yzVar && !gorunen.length ? durumKutusu('bos', t('sohbetler.aramaBos')) : null,
      filtre === 'tum' && !arama ? h('p', { class: 'b-kucuk shb-bilgi' }, t('sohbetler.insanBilgi')) : null,
    );
  }
  const secenekler = [['tum', t('sohbetler.tumFiltre')], ['yz', t('sohbetler.yzFiltre')], ['insan', t('sohbetler.insanFiltre')]];
  const filtreler = h('div', { class: 'shb-filtreler', role: 'group', 'aria-label': t('sohbetler.filtreBaslik') },
    secenekler.map(([id, anahtar]) => {
      const oge = h('button', { type: 'button', class: 'shb-filtre', 'aria-pressed': String(filtre === id), onClick: () => { filtre = id; yenile(); } }, anahtar);
      dugmeler[id] = oge;
      return oge;
    }),
  );
  yerlestir(kok,
    ustBaslik({ baslik: t('sohbetler.baslik'), alt: t('sohbetler.alt'), ikon: 'sohbet' }),
    h('p', { class: 'b-kucuk shb-bilgi' }, t('sohbetler.gecmisBilgi')),
    h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => b.git('/kesfet') }, t('sohbetler.yeniKisi'), ikon('sag', 18)),
    h('section', { class: 'b-yigin', 'aria-label': t('sohbetler.listeBaslik') },
      h('label', { class: 'b-etiket', for: 'shb-arama' }, t('sohbetler.ara')),
      h('div', { class: 'shb-arama' }, ikon('pusula', 18), aramaKutusu),
      filtreler,
      liste,
    ),
    altGezinme('/sohbetler'),
  );
  aramaKutusu.id = 'shb-arama';
  yenile();
  return null;
}
export default {
  kimlik: 'sohbetler',
  surum: '0.2.8',
  onek: 'shb',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'metin'],
  ekranlar: { sohbetler: ekran({ baslikAnahtari: 'ekran.sohbetler', durumlar: DORT_DURUM, ciz }) },
};

// Sohbetler (HelloTalk "Dil Sohbetleri" düzeni): üstte hızlı erişim simgeleri, arama, hap süzgeçler, düz sohbet listesi.
// Yapay zekâ koçu ve konuşma geçmişi her zaman "yapay zekâ" etiketi taşır (Y26); gerçek kişi uydurulmaz.
// Test modunda TEST rozetli sanal kullanıcıların sohbetleri ve sana uygun ilk eşleşme önerisi görünür.
import './sohbetler.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, ikon3d, altGezinme, basBant, durumKutusu, yzEtiketi, yerlestir, testEtiketi, testAvatar, htUst, htIkon, sekmeler, goreliZaman, dilCifti } from '../../cekirdek/arayuz.js';
import { benDugmesi } from '../../cekirdek/yan-menu.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { kisaTarih } from '../../cekirdek/zaman.js';
import { oneriSenaryo } from '../../cekirdek/oneri.js';
import { testModuAcik, testSohbetOzetleri, aktiflik, enIyiEslesmeler, saatFarki, YAKIN_SAAT_FARKI, okunmamis, uyumDuzeyi } from '../../cekirdek/test-modu.js';

const SON_KONUSMA_SAYISI = 30;

// İlk satır (5 kısayol) her zaman görünür; bandın altındaki tutamak ikinci satırı açar (HelloTalk'taki genişleyen ızgara).
// v0.10.0: v0.6.0'daki ilk satır geri geldi (Dil Anları dahil 5 kısayol); "Daha fazla" artık bir sütun yemiyor.
const HIZLI = [
  ['senaryo', 'senaryolar', '/senaryolar', 1],
  ['hafiza', 'hafiza', '/hafiza', 3],
  ['yz', 'koc', null, 4],
  ['baglanti', 'partner', '/kesfet', 5],
  ['anlar', 'anlar', '/dil-anlari', 2],
  ['telaffuz', 'telaffuz', '/telaffuz', 5],
  ['kitap', 'defter', '/gelisim', 6],
  ['kupa', 'karne', '/gelisim', 2],
  ['pratik', 'odalar', '/bugun', 1],
];
let hizliAcik = false;

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

  // v0.13.0: geçmiş görüşmeye dokununca yeni senaryo değil, O görüşmenin karnesi açılır.
  const gecmisSatiri = (g) => h('button', { type: 'button', class: 'b-liste-satir', onClick: () => b.git(g.kimlik ? `/karne?g=${g.kimlik}` : `/karne?i=${gecmis.indexOf(g)}`) },
    h('span', { class: 'shb-av-yz shb-av-gecmis', 'aria-hidden': 'true' }, ikon3d('senaryo', 30)),
    h('span', { class: 'b-liste-ic' },
      h('span', { class: 'b-liste-ust' }, h('b', null, yerel(g.baslik)), h('span', { class: 'b-liste-zaman' }, kisaTarih(g.tarih))),
      h('span', { class: 'b-liste-alt' }, t('genel.dk', { n: Math.max(0.1, Math.round((g.sureSn / 60) * 10) / 10) }), ' · ', t('ht.yzPratik')),
    ));

  const testSatiri = (o) => {
    const a = aktiflik(o.profil);
    return h('button', { type: 'button', class: 'b-liste-satir shb-kisi', onClick: () => b.git(`/mesaj?k=${o.profil.kimlik}`) },
      testAvatar(o.profil, 64, { cevrimici: a.cevrimici }),
      h('span', { class: 'b-liste-ic shb-kisi-ic' },
        h('span', { class: 'b-liste-ust' }, h('b', null, o.profil.ad), testEtiketi(), okunmamis(o) ? h('span', { class: 'shb-okunmamis', 'aria-label': t('ht.okunmamis') }) : null, h('span', { class: 'b-liste-zaman' }, goreliZaman(o.son.zaman))),
        h('span', { class: 'shb-kisi-dil' }, dilCifti(o.profil.anaDil, o.profil.ogrenilenDil, o.profil.seviye), a.cevrimici ? t('ht.cevrimiciSimdi') : yerel(o.profil.ulke).split(' · ')[0]),
        h('span', { class: 'b-liste-alt' }, o.son.kim === 'ben' ? `${t('ht.sen')}: ` : '', o.son.foto ? `📷 ${t('kural.fotoMesaj')}` : o.son.metin),
      ));
  };

  function yenile() {
    const ara = (metin) => String(metin).toLocaleLowerCase().includes(arama);
    const yzGoster = filtre === 'tum' || filtre === 'yz';
    const kisiSuzgeci = ['saat', 'okunmamis'].includes(filtre) || filtre.startsWith('dil-');
    const insanGoster = filtre === 'tum' || filtre === 'insan' || filtre === 'cevrimici' || kisiSuzgeci;
    const testler = testOzet.filter((o) => ara(o.profil.ad) && (filtre !== 'cevrimici' || aktiflik(o.profil).cevrimici)
      && (filtre !== 'saat' || saatFarki(o.profil) <= YAKIN_SAAT_FARKI)
      && (filtre !== 'okunmamis' || okunmamis(o))
      && (!filtre.startsWith('dil-') || o.profil.anaDil === filtre.slice(4)));
    const gecmisler = yzGoster ? gecmis.filter((g) => ara(yerel(g.baslik))) : [];
    const kocVar = yzGoster && ara(t('koc.ad'));
    const oneri = testModuAcik() && !arama && (filtre === 'tum' || filtre === 'insan') ? enIyiEslesmeler()[0] : null;
    yerlestir(liste,
      kocVar ? kocSatiri() : null,
      insanGoster ? testler.map(testSatiri) : null,
      gecmisler.map(gecmisSatiri),
      oneri && !testOzet.some((o) => o.profil.kimlik === oneri.profil.kimlik) ? h('button', { type: 'button', class: 'b-liste-satir shb-oneri', onClick: () => b.git(`/kisi?k=${oneri.profil.kimlik}`) },
        testAvatar(oneri.profil, 52, { cevrimici: aktiflik(oneri.profil).cevrimici }),
        h('span', { class: 'b-liste-ic' },
          h('span', { class: 'b-liste-ust' }, h('b', null, oneri.profil.ad), testEtiketi(), h('span', { class: 'b-etiket-hap b-etiket-hap-iyi shb-uyum' }, t(`ht.uyumDuzey.${uyumDuzeyi(oneri.puan)}`))),
          h('span', { class: 'b-liste-alt shb-oneri-alt' }, t('ht.oneriSatir')),
        )) : null,
      !kocVar && !testler.length && !gecmisler.length
        ? durumKutusu('bos', filtre === 'insan' || filtre === 'cevrimici' || kisiSuzgeci ? t('sohbetler.insanBos') : t('sohbetler.aramaBos'), filtre === 'insan' ? { metin: t('sohbetler.kesfeteGit'), fn: () => b.git('/kesfet') } : undefined)
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
        sol: benDugmesi(b),
        baslik: t('ht.sohbetBaslik'),
        sag: htIkon('arti', t('sohbetler.yeniKisi'), () => b.git('/kesfet')),
      }),
      hizliIzgara,
      tutamak,
    ),
    h('label', { class: 'b-ht-arama' }, ikon('ara', 18),
      h('input', { type: 'search', placeholder: t('ht.ara'), 'aria-label': t('sohbetler.ara'), onInput: (e) => { arama = e.target.value.trim().toLocaleLowerCase(); yenile(); } })),
    sekmeler([['tum', t('sohbetler.tumFiltre')], ['cevrimici', t('ht.cevrimici')], ['insan', t('sohbetler.insanFiltre')], ['yz', t('sohbetler.yzFiltre')], ['okunmamis', t('ht.okunmamis')], ['saat', t('ht.yakinSaat')],
      ...[...new Set(testOzet.map((o) => o.profil.anaDil))].map((d) => [`dil-${d}`, t(`diller.${d}`)])], filtre, (id) => { filtre = id; yenile(); }, { tur: 'hap', etiket: t('sohbetler.filtreBaslik') }),
    liste,
    testModuAcik() ? null : h('p', { class: 'b-kucuk shb-bilgi' }, t('sohbetler.insanBilgi')),
    altGezinme('/sohbetler'),
  );
  yenile();
  return null;
}

export default {
  kimlik: 'sohbetler',
  surum: '0.5.0',
  onek: 'shb',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'metin', 'test-modu'],
  ekranlar: { sohbetler: ekran({ baslikAnahtari: 'ekran.sohbetler', durumlar: DORT_DURUM, ciz }) },
};

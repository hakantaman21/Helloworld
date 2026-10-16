// Mesaj ekranı (şimdilik yalnız TEST MODU): yazılı mesajlaşma, gönderim öncesi düzeltme önerisi, partner düzeltmesi,
// konu önerisi, şikâyet ve engelleme. Karşı taraf test profilidir; yanıtlar otomatik kalıptır ve öyle etiketlenir.
// Gerçek topluluk açılınca aynı ekran sunucudaki gerçek sohbete bağlanır. Test mesajları gelişime sayılmaz.
import './mesaj.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, ikon3d, durumKutusu, yerlestir, testEtiketi, farkCiz, onayIste, testAvatar, goreliZaman, dilCifti, sekmeler, enAltaKaydir } from '../../cekirdek/arayuz.js';
import { aktiflikMetni, yasRozeti, rozetler } from '../../cekirdek/test-gorunum.js';
import { arkadasDurumu, favoriMi, favoriDegistir, sabitliMi, sabitleDegistir, SABIT_SINIRI, arkadasListesiGorunurluk, onunArkadaslari, mesajDurumu } from '../../cekirdek/arkadaslik.js';
import { arkadasEylemi, arkadasEtiketi } from '../../cekirdek/kisi-eylemleri.js';
import { TEST_PROFILLERI } from '../../veri/test-profiller.js';
import { t, yerel, aktifDil } from '../../cekirdek/metin.js';
import { mesajIzni, fotoIzni, iletisimBilgisiVar, iletisimIzni, ILETISIM_GUN } from '../../cekirdek/topluluk-kurallari.js';
import { fotograflarEkle, fotoAdresi } from '../../cekirdek/fotograf.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { al } from '../../cekirdek/depo.js';
import { kelimeFarki } from '../../cekirdek/dil/fark.js';
import { testProfili, testMesajlari, testMesajEkle, otomatikYanit, gonderimOncesiOneri, testEngelle, testSikayet, testYazarAnlari, aktiflik, yerelSaat, eslesme, takipte, takipDegistir, selamVer, selamVerildi, selamYaniti, okunduIsaretle, uyumDuzeyi, testSohbetBaslangici, testYanitVerir } from '../../cekirdek/test-modu.js';
import { TEST_KONULARI } from '../../veri/test-profiller.js';
import { hizliYanitlar } from '../../veri/hizli-yanitlar.js';
import { ILGI_ALANLARI, ilgiKimligi } from '../../veri/ilgi-alanlari.js';
import { cumleKayitli, cumleKaydetDegistir } from '../../cekirdek/cumle-defteri.js';
import { destek, soyle } from '../../cekirdek/ses/ses-hatti.js';

const YANIT_GECIKMESI = 1300;
// v0.16.0 Yazılmakta olan mesaj, sohbetten çıkıp dönünce kaybolmaz (uygulama açık kaldıkça).
const taslaklar = new Map();
const SIKAYET_NEDENLERI = ['taciz', 'spam', 'uygunsuz', 'konuDisi'];

function saat(zaman) {
  const d = new Date(zaman);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function ciz(kok, b) {
  const profil = testProfili(b.p.k);
  if (!profil) {
    yerlestir(kok, durumKutusu('bos', t('test.profilYok'), { metin: t('genel.geri'), fn: () => b.geri('/kesfet') }));
    return null;
  }
  let zamanlayici = null;
  let yaziyor = false;
  const liste = h('div', { class: 'msj-liste', role: 'log', 'aria-live': 'polite', 'aria-label': t('test.mesajlar') });
  const girdi = h('textarea', { class: 'b-girdi msj-girdi', rows: 1, maxlength: 600, 'aria-label': t('test.mesajYazEtiket'), placeholder: t('test.mesajYazEtiket') });
  const oneriAlani = h('div', { class: 'msj-oneri-alani' });
  girdi.value = taslaklar.get(profil.kimlik) || '';
  girdi.addEventListener('input', () => { if (girdi.value) taslaklar.set(profil.kimlik, girdi.value); else taslaklar.delete(profil.kimlik); });
  const yazAlani = h('div', { class: 'msj-yaz-alani' });
  const tarihYaz = (z) => new Date(z).toLocaleDateString(aktifDil(), { day: 'numeric', month: 'long', weekday: 'long' });

  function balon(m, i, tum) {
    if (m.kim === 'ben') {
      // v0.17.0 Mesaj durumu: ✓ gönderildi · ✓✓ iletildi · mavi ✓✓ okundu (okundu bilgisi karşılıklıdır).
      const durum = mesajDurumu(tum, i, profil);
      return h('div', { class: 'msj-satir msj-ben' },
        h('div', { class: 'msj-balon msj-balon-ben' }, m.foto ? h('img', { class: 'msj-foto', src: fotoAdresi(m.foto), alt: t('kural.fotoMesaj') }) : null, m.metin ? h('p', null, m.metin) : null,
          h('span', { class: 'msj-saat' }, saat(m.zaman), m.duzeltildi ? ` · ${t('test.duzeltilerekGonderildi')}` : '',
            h('span', { class: `msj-tik msj-tik-${durum}`, role: 'img', 'aria-label': t(`arkadas.durum.${durum}`), title: t(`arkadas.durum.${durum}`) }, durum === 'gonderildi' ? '✓' : '✓✓'))));
    }
    return h('div', { class: 'msj-satir msj-o' },
      testAvatar(profil, 32),
      h('div', { class: 'msj-o-ic' },
        m.duzeltme ? h('div', { class: 'msj-duzeltme' },
          h('span', { class: 'msj-duzeltme-baslik' }, ikon('onay', 16), t('test.partnerDuzeltmesi', { ad: profil.ad })),
          farkCiz(kelimeFarki(m.duzeltme.kaynak, m.duzeltme.dogru))) : null,
        h('div', { class: 'msj-balon msj-balon-o' }, h('p', null, m.metin),
          h('span', { class: 'msj-saat' }, saat(m.zaman), ' · ', t('test.otomatikYanit'))),
        mesajAraclari(m.metin, profil.ad),
      ),
    );
  }

  // Başlıktaki hızlı yanıt şeridi: son gelen mesaja göre öneriler; ilk mesajda açılış cümleleri ve konular.
  const hizliSerit = h('div', { class: 'msj-hizli', role: 'group', 'aria-label': t('hizliYanit.etiket') });
  function hizliCiz() {
    const mesajlar = testMesajlari(profil.kimlik);
    const sonGelen = [...mesajlar].reverse().find((m) => m.kim === 'o');
    const oneriler = sonGelen ? hizliYanitlar(sonGelen) : [...hizliYanitlar(null), ...TEST_KONULARI.map((k) => k.cumle)];
    yerlestir(hizliSerit,
      h('span', { class: 'msj-hizli-etiket', 'aria-hidden': 'true' }, ikon('ampul', 16)),
      oneriler.map((o) => h('button', { type: 'button', class: 'msj-hizli-oge', onClick: () => { girdi.value = o; girdi.focus(); girdi.setSelectionRange(o.length, o.length); } }, o)),
    );
  }

  // v0.16.0: eski mesajları okurken yeni mesaj gelirse ekran zorla en alta inmez; yalnız zaten alttaysan ya da sen gönderdiysen.
  function enAltta() { const a = kok.closest('#uygulama') || document.scrollingElement; return !a || a.scrollHeight - a.scrollTop - a.clientHeight < 120; }
  function yenile(zorla = false) {
    const alttaydi = zorla || enAltta();
    const mesajlar = testMesajlari(profil.kimlik);
    const son = mesajlar[mesajlar.length - 1];
    okunduIsaretle(profil.kimlik);
    hizliCiz();
    yerlestir(liste,
      h('div', { class: 'msj-uyari' }, testEtiketi(), h('span', null, t('test.sohbetUyari'))),
      mesajlar.length ? null : h('p', { class: 'b-kucuk msj-bos' }, t('test.ilkMesaj', { ad: profil.ad })),
      mesajlar.map((m, i) => balon(m, i, mesajlar)),
      yaziyor ? h('div', { class: 'msj-satir msj-o' }, testAvatar(profil, 32), h('div', { class: 'msj-balon msj-balon-o msj-yaziyor' }, t('test.yaziyor', { ad: profil.ad }))) : null,
      !yaziyor && son && son.kim === 'ben' && !testYanitVerir(profil) ? h('p', { class: 'b-kucuk msj-bos' }, t('kural.cevrimdisi', { ad: profil.ad })) : null,
    );
    yazCiz();
    if (alttaydi) requestAnimationFrame(enAltaKaydir);
  }

  // v0.16.0 Topluluk kuralları: yanıtsız mesaj sınırı yazma alanının yerine açıklama koyar.
  function yazCiz() {
    const izin = mesajIzni(testMesajlari(profil.kimlik));
    if (!izin.izin) {
      yerlestir(yazAlani, h('div', { class: 'b-kart msj-kilit', role: 'status' },
        h('b', null, t('kural.kilitBaslik', { ad: profil.ad })),
        h('p', { class: 'b-kucuk' }, t('kural.kilitMetin', { tarih: tarihYaz(izin.acilis) })),
        h('p', { class: 'b-kucuk' }, t('kural.neden'))));
      return;
    }
    yerlestir(yazAlani,
      izin.haftalik ? h('p', { class: 'b-kucuk msj-kural' }, t('kural.haftalik')) : izin.kalan <= 2 ? h('p', { class: 'b-kucuk msj-kural' }, t('kural.kalan', { n: izin.kalan })) : null,
      h('div', { class: 'msj-yaz' },
        h('button', { type: 'button', class: 'b-ht-ikon msj-foto-dugme', 'aria-label': t('kural.fotoEkle'), onClick: fotoGonder }, ikon('kamera', 20)),
        girdi,
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana b-dugme-yuvarlak', 'aria-label': t('test.gonder'), onClick: gonderDene }, ikon('gonder', 20))));
  }

  function kuralPenceresi(baslik, ...metinler) {
    return onayIste({ baslik, metin: metinler.join(' '), evet: t('kural.tamam') });
  }

  async function fotoGonder() {
    const mesajlar = testMesajlari(profil.kimlik);
    const f = fotoIzni(mesajlar);
    if (!f.izin) { duyur(t('kural.fotoKilit', { n: f.n, gerekli: f.gerekli }), 5000); return; }
    if (!mesajIzni(mesajlar).izin) { yazCiz(); return; }
    const refler = await fotograflarEkle(1);
    if (!refler || !refler.length) return;
    testMesajEkle(profil.kimlik, { kim: 'ben', metin: '', foto: refler[0] });
    yanitPlanla('');
    yenile(true);
  }

  function yanitPlanla(metin) {
    clearTimeout(zamanlayici);
    if (!testYanitVerir(profil)) { yaziyor = false; return; }
    yaziyor = true;
    zamanlayici = setTimeout(() => {
      testMesajEkle(profil.kimlik, otomatikYanit(profil, metin));
      yaziyor = false;
      yenile();
    }, YANIT_GECIKMESI);
  }

  function gonder(metin, duzeltildi) {
    const temiz = metin.trim();
    if (!temiz) return;
    const mesajlar = testMesajlari(profil.kimlik);
    if (!mesajIzni(mesajlar).izin) { yazCiz(); return; }
    // İletişim bilgisi (telefon, e-posta) belirli bir tanışıklıktan önce gönderilmez; mesaj yazma alanında kalır.
    if (iletisimBilgisiVar(temiz)) {
      const i = iletisimIzni(mesajlar, testSohbetBaslangici(profil.kimlik));
      if (!i.izin) { kuralPenceresi(t('kural.iletisimBaslik'), t('kural.iletisimMetin', { gun: ILETISIM_GUN, gerekli: i.gerekli, kalanGun: i.kalanGun, n: i.n }), t('kural.iletisimNeden')); return; }
    }
    testMesajEkle(profil.kimlik, { kim: 'ben', metin: temiz, duzeltildi: Boolean(duzeltildi) });
    girdi.value = '';
    taslaklar.delete(profil.kimlik);
    yerlestir(oneriAlani);
    yanitPlanla(temiz);
    yenile(true);
  }

  // Gönderim öncesi isteğe bağlı düzeltme önerisi (yerel kurallar; ağ çağrısı yok).
  function gonderDene() {
    const metin = girdi.value.trim();
    if (!metin) { girdi.focus(); return; }
    const oneri = al().profil.ayarlar.gonderimOneri === false ? null : gonderimOncesiOneri(metin);
    if (!oneri) { gonder(metin, false); return; }
    yerlestir(oneriAlani, h('div', { class: 'b-kart msj-oneri', role: 'region', 'aria-label': t('test.oneriBaslik') },
      h('span', { class: 'b-ust-etiket' }, t('test.oneriBaslik')),
      farkCiz(kelimeFarki(metin, oneri.dogru)),
      h('p', { class: 'b-kucuk' }, oneri.aciklamalar.map((a) => t(a)).join(' ')),
      h('div', { class: 'b-izgara-2' },
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => gonder(oneri.dogru, true) }, t('test.duzeltilmisiGonder')),
        h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => gonder(metin, false) }, t('test.oldugGibiGonder')),
      ),
    ));
  }

  async function sikayetEt() {
    const secim = await new Promise((coz) => {
      const kapat = (deger) => { perde.remove(); coz(deger); };
      const perde = h('div', { class: 'b-perde', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'msj-sikayet-baslik' },
        h('div', { class: 'b-pencere' },
          h('h2', { class: 'b-bolum-baslik', id: 'msj-sikayet-baslik' }, t('test.sikayetBaslik', { ad: profil.ad })),
          h('div', { class: 'b-yigin' }, SIKAYET_NEDENLERI.map((n) => h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => kapat(n) }, t(`test.sikayetNeden.${n}`))),
            h('button', { type: 'button', class: 'b-dugme', 'data-vazgec': '', onClick: () => kapat(null) }, t('genel.vazgec'))),
        ),
      );
      document.body.append(perde);
      perde.querySelector('button').focus();
    });
    if (!secim) return;
    testSikayet(profil.kimlik, secim);
    duyur(t('test.sikayetAlindi'), 4000);
  }

  async function engelle() {
    const evet = await onayIste({ baslik: t('test.engelleBaslik', { ad: profil.ad }), metin: t('test.engelleMetin'), evet: t('test.engelle'), hayir: t('genel.vazgec') });
    if (!evet) return;
    testEngelle(profil.kimlik);
    duyur(t('test.engellendi', { ad: profil.ad }));
    b.git('/kesfet', { degistir: true });
  }

  girdi.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); gonderDene(); } });

  yerlestir(kok,
    h('header', { class: 'msj-ust' },
      h('button', { type: 'button', class: 'b-ht-ikon msj-geri', 'aria-label': t('genel.geri'), onClick: () => b.geri('/sohbetler') }, ikon('sol', 22)),
      h('button', { type: 'button', class: 'msj-av-dugme', onClick: () => b.git(`/kisi?k=${profil.kimlik}`), 'aria-label': t('test.profiliGor') }, testAvatar(profil, 40, { cevrimici: aktiflik(profil).cevrimici })),
      h('div', { class: 'msj-kim' },
        h('div', { class: 'msj-ad' }, h('b', null, profil.ad), testEtiketi()),
        h('span', { class: 'b-kucuk' }, [aktiflikMetni(profil), yerelSaat(profil)].filter(Boolean).join(' · ')),
      ),
      h('button', { type: 'button', class: 'b-ht-ikon msj-menu', 'aria-label': t('ht.dahaFazla'), onClick: () => eylemMenusu([
        [t('test.profiliGor'), () => b.git(`/kisi?k=${profil.kimlik}`)],
        [arkadasEtiketi(profil.kimlik), () => arkadasEylemi(profil)],
        [favoriMi(profil.kimlik) ? t('arkadas.favoridenCikar') : t('arkadas.favoriyeEkle'), () => duyur(favoriDegistir(profil.kimlik) ? t('arkadas.favoriyeEklendi', { ad: profil.ad }) : t('arkadas.favoridenCikti'))],
        [sabitliMi(profil.kimlik) ? t('arkadas.sabitKaldir') : t('arkadas.basaSabitle'), () => { const r = sabitleDegistir(profil.kimlik); duyur(r === 'sinir' ? t('arkadas.sabitSiniri', { n: SABIT_SINIRI }) : r === 'sabitlendi' ? t('arkadas.sabitlendi') : t('arkadas.sabitKalkti')); }],
        [t('test.sikayetEt'), sikayetEt],
        [t('test.engelle'), engelle, true],
      ]) }, ikon('nokta3', 22)),
    ),
    hizliSerit,
    liste,
    h('div', { class: 'msj-alt' },
      oneriAlani,
      yazAlani,
    ),
  );
  yenile(true);
  return () => clearTimeout(zamanlayici);
}

// Kişi profili (HelloTalk profil sayfası esinli): dil kimliği, seviye, tanıtım, ilgiler, anları; mesaj, şikâyet, engelle.
async function sikayetPenceresi(ad) {
  return new Promise((coz) => {
    const kapat = (d) => { perde.remove(); coz(d); };
    const perde = h('div', { class: 'b-perde', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'msj-ks' },
      h('div', { class: 'b-pencere' },
        h('h2', { class: 'b-bolum-baslik', id: 'msj-ks' }, t('test.sikayetBaslik', { ad })),
        h('div', { class: 'b-yigin' }, SIKAYET_NEDENLERI.map((n) => h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => kapat(n) }, t(`test.sikayetNeden.${n}`))),
          h('button', { type: 'button', class: 'b-dugme', 'data-vazgec': '', onClick: () => kapat(null) }, t('genel.vazgec'))),
      ));
    document.body.append(perde);
    perde.querySelector('button').focus();
  });
}

// Basit eylem menüsü (HelloTalk "…"): alttan açılan pencere.
// Gelen mesajın altında: sesli dinle (cihazın konuşma sentezi) ve cümle defterine kaydet.
function mesajAraclari(metin, kimden) {
  const kaydet = h('button', { type: 'button', class: 'msj-arac', 'aria-pressed': String(cumleKayitli(metin)), 'aria-label': t('defter.kaydet') });
  kaydet.append(ikon('yerImi', 16));
  kaydet.addEventListener('click', () => {
    const eklendi = cumleKaydetDegistir(metin, kimden);
    kaydet.setAttribute('aria-pressed', String(eklendi));
    duyur(eklendi ? t('defter.kaydedildi') : t('defter.cikarildi'), 1800);
  });
  return h('div', { class: 'msj-araclar-satir' },
    destek.sentez ? h('button', { type: 'button', class: 'msj-arac', 'aria-label': t('defter.dinle'), onClick: () => soyle(metin) }, ikon('hoparlor', 16)) : null,
    kaydet);
}

function eylemMenusu(secenekler) {
  const kapat = () => perde.remove();
  const perde = h('div', { class: 'b-perde', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('ht.dahaFazla'), onClick: (e) => { if (e.target === perde) kapat(); } },
    h('div', { class: 'b-pencere msj-menu-pencere' },
      secenekler.map(([ad, fn, tehlike]) => h('button', { type: 'button', class: `b-dugme ${tehlike ? 'b-dugme-tehlike' : 'b-dugme-cerceve'}`, onClick: () => { kapat(); fn(); } }, ad)),
      h('button', { type: 'button', class: 'b-dugme', 'data-vazgec': '', onClick: kapat }, t('genel.vazgec')),
    ));
  document.body.append(perde);
  perde.querySelector('button').focus();
}

// Kişi profili (v0.5.0): HelloTalk'tan daha sade. Yumuşak kapak, ortalanmış kimlik, tek satır etkinlik,
// ince uyum çubuğu, tanıtım kartı, ilgi hapları (ortaklar önde), simgeli bilgi satırları; altta Takip · Sohbet · Selam.
function kisiCiz(kok, b) {
  const p = testProfili(b.p.k);
  if (!p) {
    yerlestir(kok, durumKutusu('bos', t('test.profilYok'), { metin: t('genel.geri'), fn: () => b.geri('/kesfet') }));
    return null;
  }
  kok.classList.add('msj-kisi-ekran');
  const anlar = testYazarAnlari(p.kimlik);
  const uyum = eslesme(p);
  const a = aktiflik(p);
  let sekme = 'profil';
  const icerik = h('div', { class: 'msj-kisi-icerik' });
  const takipDugmesi = h('button', { type: 'button', class: 'msj-alt-takip' });
  const DURUM_IKON = { yok: 'arti', gonderildi: 'saat', gelen: 'arti', arkadas: 'onay' };

  async function sikayet() { const n = await sikayetPenceresi(p.ad); if (!n) return; testSikayet(p.kimlik, n); duyur(t('test.sikayetAlindi'), 4000); }
  async function engelle() {
    const evet = await onayIste({ baslik: t('test.engelleBaslik', { ad: p.ad }), metin: t('test.engelleMetin'), evet: t('test.engelle'), hayir: t('genel.vazgec') });
    if (!evet) return;
    testEngelle(p.kimlik); duyur(t('test.engellendi', { ad: p.ad })); b.git('/kesfet', { degistir: true });
  }
  // v0.17.0: alt çubuktaki ilk düğme ARKADAŞLIK (istek → kabul); takip "…" menüsünde.
  function takipCiz() {
    const d = arkadasDurumu(p.kimlik);
    takipDugmesi.setAttribute('aria-pressed', String(d === 'arkadas'));
    takipDugmesi.setAttribute('aria-label', arkadasEtiketi(p.kimlik));
    takipDugmesi.title = arkadasEtiketi(p.kimlik);
    takipDugmesi.dataset.durum = d;
    yerlestir(takipDugmesi, ikon(DURUM_IKON[d], 22));
  }
  const takipEylemi = () => { const sonra = takipDegistir(p.kimlik); duyur(sonra ? t('ht.takipEdildi', { ad: p.ad }) : t('ht.takiptenCikti', { ad: p.ad })); };
  const kisiMenusu = () => eylemMenusu([
    [favoriMi(p.kimlik) ? t('arkadas.favoridenCikar') : t('arkadas.favoriyeEkle'), () => duyur(favoriDegistir(p.kimlik) ? t('arkadas.favoriyeEklendi', { ad: p.ad }) : t('arkadas.favoridenCikti'))],
    [sabitliMi(p.kimlik) ? t('arkadas.sabitKaldir') : t('arkadas.basaSabitle'), () => { const r = sabitleDegistir(p.kimlik); duyur(r === 'sinir' ? t('arkadas.sabitSiniri', { n: SABIT_SINIRI }) : r === 'sabitlendi' ? t('arkadas.sabitlendi') : t('arkadas.sabitKalkti')); }],
    [takipte(p.kimlik) ? t('ht.takiptesin') : t('ht.takipEt'), takipEylemi],
    [t('test.sikayetEt'), sikayet],
    [t('test.engelle'), engelle, true],
  ]);
  const bilgiSatiri = (ik, etiket, deger) => h('div', { class: 'msj-bilgi' }, h('span', { class: 'msj-bilgi-ikon' }, ikon(ik, 18)), h('span', { class: 'msj-bilgi-etiket' }, etiket), h('span', { class: 'msj-bilgi-deger' }, deger));
  const ortakMi = (i) => uyum.ortak.includes(i);

  function icerikCiz() {
    if (sekme === 'anlar') {
      yerlestir(icerik, anlar.length ? anlar.map((an) => h('button', { type: 'button', class: 'msj-an', onClick: () => b.git('/dil-anlari') },
        h('span', null, an.metin),
        an.gorsel ? h('span', { class: `msj-an-gorsel b-kutu-${an.gorsel.kutu}` }, ikon3d(an.gorsel.ikon, 32), yerel(an.gorsel.yazi)) : null,
        h('span', { class: 'b-kucuk' }, goreliZaman(an.zaman)))) : h('p', { class: 'b-kucuk' }, t('test.anYok')));
      return;
    }
    const ilgiler = [...p.ilgi].sort((x, y) => Number(ortakMi(y)) - Number(ortakMi(x)));
    yerlestir(icerik,
      h('section', { class: 'msj-kart' },
        h('h2', { class: 'msj-kart-baslik' }, t('ht.hobiler')),
        // v0.15.0 Hobiler yatay kayan ince şerit (daha çok hobi, daha az yer).
        h('div', { class: 'msj-hobiler', 'data-yatay': '' }, ilgiler.map((i) => {
          const k = ILGI_ALANLARI.find((x) => x.kimlik === ilgiKimligi(i));
          return h('span', { class: `msj-hobi${ortakMi(i) ? ' msj-hobi-ortak' : ''}` }, h('span', { 'aria-hidden': 'true' }, ortakMi(i) ? '♥' : (k ? k.simge : '•')), yerel(i));
        })),
      ),
      h('section', { class: 'msj-kart msj-bilgiler' },
        bilgiSatiri('kalem', t('ht.meslek'), yerel(p.meslek)),
        bilgiSatiri('pusula', t('ht.gezilecek'), (p.gezilecek || []).join(' · ')),
        bilgiSatiri('takvim', t('kisi.katildi'), t('ht.katildi', { n: p.katildiGun })),
        bilgiSatiri('saat', t('kisi.yerelSaat'), yerelSaat(p)),
        h('div', { class: 'msj-bilgi msj-bilgi-rozet' }, h('span', { class: 'msj-bilgi-ikon' }, ikon('sohbet', 18)), h('span', { class: 'msj-bilgi-etiket' }, t('ht.ozellikler')), h('span', { class: 'msj-bilgi-rozetler' }, rozetler(p))),
      ),
      arkadasBolumu(),
      h('button', { type: 'button', class: 'b-dugme b-dugme-metin msj-sikayet-baglanti', onClick: sikayet }, ikon('kalkan', 16), t('test.sikayetEt')),
    );
  }

  // v0.17.0 Arkadaş listesi (karşılıklı gizlilik): görünmüyorsa nedeni dürüstçe söylenir.
  function arkadasBolumu() {
    const g = arkadasListesiGorunurluk(p.kimlik);
    if (!g.gorunur) {
      return h('section', { class: 'msj-kart' }, h('h2', { class: 'msj-kart-baslik' }, t('arkadas.onunArkadaslari')),
        h('p', { class: 'b-kucuk' }, g.neden === 'o' ? t('arkadas.gizliO', { ad: p.ad }) : t(`arkadas.gizli.${g.neden}`)),
        g.neden !== 'o' ? h('button', { type: 'button', class: 'b-dugme b-dugme-metin', onClick: () => b.git('/ayarlar?grup=gizlilik') }, t('arkadas.ayaraGit')) : null);
    }
    const liste = onunArkadaslari(p.kimlik);
    return h('section', { class: 'msj-kart' }, h('h2', { class: 'msj-kart-baslik' }, `${t('arkadas.onunArkadaslari')} · ${liste.length}`),
      h('div', { class: 'msj-ark-liste', 'data-yatay': '' }, liste.map((k) => {
        if (k === 'ben') return h('span', { class: 'msj-ark' }, h('span', { class: 'msj-ark-ben' }, t('ht.sen')));
        const kisi = TEST_PROFILLERI.find((x) => x.kimlik === k);
        return kisi ? h('button', { type: 'button', class: 'msj-ark', onClick: () => b.git(`/kisi?k=${k}`) }, testAvatar(kisi, 48), h('span', null, kisi.ad)) : null;
      })));
  }

  takipCiz();
  yerlestir(kok,
    // v0.15.0 Kapak: profil fotoğrafının arkasında sistem kapağı (kişiye göre değişir; kendi profilinde seçilebilir).
    h('div', { class: `msj-kapak b-kapak b-kapak-${((p.renk || 1) - 1) % 6 + 1}` },
      h('button', { type: 'button', class: 'b-ht-ikon msj-kapak-dugme', 'aria-label': t('genel.geri'), onClick: () => b.geri('/kesfet') }, ikon('sol', 22)),
      testEtiketi(),
      h('button', { type: 'button', class: 'b-ht-ikon msj-kapak-dugme', 'aria-label': t('ht.dahaFazla'), onClick: kisiMenusu }, ikon('nokta3', 22)),
    ),
    h('section', { class: 'msj-kimlik' },
      h('span', { class: 'msj-av-cerceve' }, testAvatar(p, 104, { cevrimici: a.cevrimici })),
      h('div', { class: 'msj-ad-satir' }, h('h1', { class: 'msj-ad-buyuk' }, p.ad), yasRozeti(p)),
      h('span', { class: 'msj-kunye' }, `@${p.kullanici} · ${yerel(p.ulke)}`),
      h('span', { class: `msj-aktif${a.cevrimici ? ' msj-aktif-var' : ''}` }, a.cevrimici ? h('i') : null, aktiflikMetni(p)),
      h('div', { class: 'msj-dil' }, dilCifti(p.anaDil, p.ogrenilenDil, p.seviye, { adlarla: true })),
    ),
    h('section', { class: 'msj-uyum', 'aria-label': t(`ht.uyumDuzey.${uyumDuzeyi(uyum.puan)}`) },
      h('div', { class: 'msj-uyum-ust' }, h('b', null, t('ht.uyumBaslik')), h('span', { class: 'msj-uyum-puan' }, t(`ht.uyumDuzey.${uyumDuzeyi(uyum.puan)}`))),
      h('span', { class: 'msj-uyum-cubuk' }, h('i', { style: `width:${uyum.puan}%` })),
      h('div', { class: 'msj-uyum-nedenler' }, uyum.nedenler.slice(0, 3).map((n) => h('span', null, ikon('onay', 12), t(`ht.neden.${n}`, { dil: t(`diller.${n === 'karsilikli' ? p.ogrenilenDil : p.anaDil}`), ortak: uyum.ortak.map((i) => yerel(i)).join(', ') })))),
    ),
    h('blockquote', { class: 'msj-tanitim-kart' }, yerel(p.tanitim)),
    sekmeler([['profil', t('ht.profilSekme')], ['anlar', t('ht.anlarSekme', { n: anlar.length })]], sekme, (id) => { sekme = id; icerikCiz(); }, { tur: 'hap' }),
    icerik,
    h('div', { class: 'msj-alt-cubuk' },
      takipDugmesi,
      h('button', { type: 'button', class: 'b-dugme b-dugme-ana msj-alt-sohbet', onClick: () => b.git(`/mesaj?k=${p.kimlik}`) }, ikon('sohbet', 20), t('ht.sohbet')),
      h('button', { type: 'button', class: 'msj-alt-selam', 'aria-label': t('ht.selamVer', { ad: p.ad }), onClick: () => {
        if (!selamVerildi(p.kimlik)) { selamVer(p.kimlik, t('ht.selamMetni')); setTimeout(() => testMesajEkle(p.kimlik, selamYaniti(p)), YANIT_GECIKMESI); }
        b.git(`/mesaj?k=${p.kimlik}`);
      } }, ikon('el', 22)),
    ),
  );
  takipDugmesi.addEventListener('click', () => { arkadasEylemi(p, () => { takipCiz(); icerikCiz(); }); takipCiz(); icerikCiz(); });
  icerikCiz();
  return null;
}

export default {
  kimlik: 'mesaj',
  surum: '0.6.0',
  onek: 'msj',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'metin', 'test-modu'],
  ekranlar: {
    mesaj: ekran({ baslikAnahtari: 'ekran.mesaj', durumlar: DORT_DURUM, ciz }),
    kisi: ekran({ baslikAnahtari: 'ekran.kisi', durumlar: DORT_DURUM, ciz: kisiCiz }),
  },
};

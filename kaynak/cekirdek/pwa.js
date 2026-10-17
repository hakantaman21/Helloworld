// Uygulama sunucudan (https) açıldığında çevrimdışı çalışabilmesi için servis çalışanını kaydeder.
// Chrome'da tek dosya olarak açıldığında (file://) bu adım atlanır.
// v0.26.0 Yeni sürüm denetimi: ana ekrana eklenmiş uygulama arka planda açık kalınca yeni sürümü kendiliğinden yüklemez;
// kullanıcı düzeltilmiş hatayı hâlâ görür. Uygulama öne geldiğinde (ve 30 dakikada bir) sunucudaki sürüm okunur; daha
// yeniyse üstte "Yeni sürüm hazır" şeridi çıkar, dokununca yenilenir. Yazı yazılırken kendiliğinden yenilenmez.
import { h } from './arayuz.js';
import { t } from './metin.js';
import { SURUM } from './surum.js';
import { agIstegi } from './ai/ag.js';

const DENETIM_ARALIGI = 30 * 60000;
let sonDenetim = 0;
let seritVar = false;

const sayi = (s) => String(s).split('.').map((x) => Number(x) || 0);
export function surumYeniMi(sunucu, yerel = SURUM) {
  const a = sayi(sunucu); const b = sayi(yerel);
  for (let i = 0; i < 3; i += 1) { if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) > (b[i] || 0); }
  return false;
}

async function surumDenetle() {
  if (seritVar || Date.now() - sonDenetim < 60000) return;
  sonDenetim = Date.now();
  try {
    const yanit = await agIstegi(`./?surum-denetimi=${Date.now()}`, { cache: 'no-store' });
    if (!yanit.ok) return;
    const m = (await yanit.text()).match(/SURUM = '(\d+\.\d+\.\d+)'/);
    if (m && surumYeniMi(m[1])) seritGoster(m[1]);
  } catch { /* çevrimdışı: sonra yine denenir */ }
}

function seritGoster(yeni) {
  seritVar = true;
  const serit = h('button', { type: 'button', class: 'b-surum-serit', role: 'status', onClick: () => { try { location.reload(); } catch { /* izin yok */ } } },
    h('b', null, t('pwa.yeniSurum', { s: yeni })), h('span', null, t('pwa.yeniSurumAlt')));
  document.body.append(serit);
}

export function pwaBaslat() {
  // Korumalı çerçevelerde navigator.serviceWorker'a erişmek bile hata atabilir.
  try {
    // Sürüm denetimi sunucudan açılan her kopyada (dosya olarak açılınca değil).
    if (/^https?:$/.test(location.protocol)) {
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') surumDenetle(); });
      setInterval(surumDenetle, DENETIM_ARALIGI);
      setTimeout(surumDenetle, 5000);
    }
    if (!('serviceWorker' in navigator) || location.protocol !== 'https:') return;
    navigator.serviceWorker.register('sw.js').catch(() => {});
  } catch { /* izin yok */ }
}

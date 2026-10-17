// v0.26.0 Arkadaşlarını davet et (Hakan, 17.10.2026): telefon rehberinden birden çok kişi seçip SMS ile davet,
// ya da paylaşım menüsüyle (WhatsApp, Telegram…) bağlantı gönderme. Rehber cihazdan ÇIKMAZ: seçilen numaralar yalnız
// SMS uygulamasına verilir, hiçbir yere kaydedilmez. "Rehberimde bu uygulamayı kullananlar" sunucu gerektirir
// (numaraların özetiyle eşleştirme); sunucu bağlanınca eklenecek.
const CANLI_ADRES = 'https://helloworld-gules.vercel.app';

export function davetAdresi() {
  try { return /^https?:$/.test(location.protocol) ? location.origin : CANLI_ADRES; } catch { return CANLI_ADRES; }
}

// Kişi seçici (Contact Picker API) yalnız bazı tarayıcılarda (Android Chrome) vardır.
export function rehberDestekleniyor() {
  return typeof navigator !== 'undefined' && 'contacts' in navigator && typeof navigator.contacts.select === 'function';
}

// Döner: [{ ad, tel }] (numarası olanlar) ya da [] (vazgeçti / desteklenmiyor).
export async function rehberdenSec() {
  if (!rehberDestekleniyor()) return [];
  try {
    const secilen = await navigator.contacts.select(['name', 'tel'], { multiple: true });
    return secilen.filter((k) => (k.tel || []).length).map((k) => ({ ad: (k.name || [])[0] || k.tel[0], tel: String(k.tel[0]).replace(/[^\d+]/g, '') }));
  } catch { return []; }
}

// Birden çok alıcılı SMS bağlantısı (Android virgül, iOS tek alıcı; iOS'ta ilk kişi ile açılır).
export function smsAdresi(numaralar, metin) {
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  const alicilar = ios ? numaralar.slice(0, 1).join('') : numaralar.join(',');
  return `sms:${alicilar}${ios ? '&' : '?'}body=${encodeURIComponent(metin)}`;
}

// Paylaşım menüsü; yoksa panoya kopyalar. Döner: 'paylasildi' | 'kopyalandi' | 'olmadi'.
export async function davetPaylas(metin) {
  try {
    if (navigator.share) { await navigator.share({ text: metin, url: davetAdresi() }); return 'paylasildi'; }
  } catch (hata) { if (hata && hata.name === 'AbortError') return 'olmadi'; }
  try { await navigator.clipboard.writeText(`${metin} ${davetAdresi()}`); return 'kopyalandi'; } catch { return 'olmadi'; }
}

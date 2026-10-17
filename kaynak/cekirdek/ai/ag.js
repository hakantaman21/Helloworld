// v0.26.0 Ağ adaptörü (Y9): uygulamadaki BÜTÜN ağ çağrıları buradan geçer — yapay zekâ sağlayıcısı, sunucu giden
// kutusu (cekirdek/sunucu.js) ve yeni sürüm denetimi (cekirdek/pwa.js). Tek yerde: zaman aşımı, hata biçimi ve
// ileride kimlik belirteci ekleme burada yapılır.
const ZAMAN_ASIMI_MS = 15000;

export async function agIstegi(adres, secenek = {}) {
  const denetci = typeof AbortController === 'function' ? new AbortController() : null;
  const zaman = denetci ? setTimeout(() => denetci.abort(), secenek.zamanAsimi || ZAMAN_ASIMI_MS) : null;
  try {
    return await fetch(adres, { ...secenek, signal: denetci ? denetci.signal : undefined });
  } finally { if (zaman) clearTimeout(zaman); }
}

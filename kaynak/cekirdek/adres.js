// v0.23.0 Geçerli adres tek yerden okunur. Normalde adres çubuğundaki "#/ekran?…" kullanılır. Tarayıcı geçmiş
// API'sine izin vermeyen korumalı çerçevelerde (ör. Claude'un dosya önizlemesi, bazı uygulama içi görüntüleyiciler)
// history.pushState / replaceState "SecurityError" atar; o zaman adres bellekte tutulur ve uygulama yine çalışır.
let bellek = null;

export function adresOku() {
  if (bellek !== null) return bellek;
  try { return location.hash.slice(1) || '/bugun'; } catch { return '/bugun'; }
}
export function bellekModu() { return bellek !== null; }
export function bellegeYaz(adres) { bellek = adres; }

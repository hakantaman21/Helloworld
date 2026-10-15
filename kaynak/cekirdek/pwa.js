// Uygulama sunucudan (https) açıldığında çevrimdışı çalışabilmesi için servis çalışanını kaydeder.
// Chrome'da tek dosya olarak açıldığında (file://) bu adım atlanır.
export function pwaBaslat() {
  if (!('serviceWorker' in navigator) || location.protocol !== 'https:') return;
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

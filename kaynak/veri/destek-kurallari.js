// v0.26.0 Destek ve şikâyet ön ayıklama kuralları (veri). cekirdek/destek.js › onemSiniflandir bunları kullanır;
// sunucu açılınca aynı dosya sunucuda da kullanılır. Kural: emin olunan ağır durumlar ACİL olarak yöneticiye en üstte;
// açık spam otomatik süzgece; geri kalan her şey yöneticiye. Otomatik süzgeç kimseyi CEZALANDIRMAZ, yalnız sıraya koyar.
export const DESTEK_TURLERI = ['sikayet', 'hata', 'oneri', 'gorus'];
export const SIKAYET_NEDENLERI = ['taciz', 'spam', 'uygunsuz', 'konuDisi', 'guvenlik', 'resit'];
// Neden → başlangıç önemi
export const NEDEN_ONEMI = { guvenlik: 'acil', resit: 'acil', taciz: 'yuksek', uygunsuz: 'yuksek', konuDisi: 'normal', spam: 'dusuk' };
// Metinde geçerse önemi ACİL'e yükselten sözcükler (Türkçe + İngilizce, küçük harf, kök biçimi).
export const ACIL_SOZCUKLER = ['tehdit', 'öldür', 'şantaj', 'intihar', 'kendime zarar', 'çocuk', 'reşit', 'yaşında', 'adresimi', 'threat', 'kill', 'blackmail', 'suicide', 'self-harm', 'minor', 'underage', 'years old'];
// Açık spam işaretleri (bağlantı yığını, kripto, para teklifi).
export const SPAM_SOZCUKLER = ['http', 'www.', 't.me/', 'kripto', 'crypto', 'bitcoin', 'yatırım', 'investment', 'kazan', 'earn money'];
// Yöneticinin yanıt şablonları (sunucuda yönetici panelinde seçilir; burada TEST yanıtı için).
export const TEST_YANITLARI = {
  sikayet: { tr: 'TEST · Şikâyetin incelendi. Kişi uyarıldı ve 7 gün boyunca yeni kişilere yazması kısıtlandı. Bildirdiğin için teşekkürler.', en: 'TEST · Your report was reviewed. The person was warned and limited from messaging new people for 7 days. Thanks for reporting.' },
  hata: { tr: 'TEST · Hata kaydını aldık; bir sonraki sürümde düzeltmeyi planlıyoruz.', en: 'TEST · We logged the bug and plan to fix it in the next release.' },
  oneri: { tr: 'TEST · Önerin ürün listemize eklendi. Teşekkürler!', en: 'TEST · Your suggestion was added to our product list. Thanks!' },
  gorus: { tr: 'TEST · Görüşünü okuduk, teşekkür ederiz.', en: 'TEST · We read your feedback, thank you.' },
};

// v0.18.0 Varsayılan paketler (Ücretsiz · Plus · Premium). Düzenleme modundaki değişiklikler bunların üstüne yazılır.
// Fiyatlar örnektir (₺). gunlukYeniKisi: 0 = sınırsız. ozellikler: yalnız gerçekten çalışan özellikler (cekirdek/paketler.js OZELLIKLER).
export const VARSAYILAN_PAKETLER = {
  ucretsiz: { ad: { tr: 'Ücretsiz', en: 'Free' }, aylik: 0, yillik: 0, gunlukYeniKisi: 7, renk: 2,
    ozellikler: { uygulamaKilidi: false, ekosistemIndirimi: false },
    satirlar: { tr: ['Yapay zekâ koçla günlük pratik', 'Tüm süzgeçler', 'Günde 7 yeni kişiye mesaj'], en: ['Daily practice with the AI coach', 'All filters', 'Message 7 new people a day'] } },
  plus: { ad: { tr: 'Plus', en: 'Plus' }, aylik: 99, yillik: 799, gunlukYeniKisi: 30, renk: 4,
    ozellikler: { uygulamaKilidi: false, ekosistemIndirimi: true },
    satirlar: { tr: ['Günde 30 yeni kişiye mesaj', 'Diğer uygulamalarımızda indirim'], en: ['Message 30 new people a day', 'Discounts in our other apps'] } },
  premium: { ad: { tr: 'Premium', en: 'Premium' }, aylik: 179, yillik: 1399, gunlukYeniKisi: 0, renk: 5,
    ozellikler: { uygulamaKilidi: true, ekosistemIndirimi: true },
    satirlar: { tr: ['Sınırsız yeni kişi', 'Uygulama kilidi (PIN, desen, parmak izi / yüz)', 'Diğer uygulamalarımızda indirim'], en: ['Unlimited new people', 'App lock (PIN, pattern, fingerprint / face)', 'Discounts in our other apps'] } },
};

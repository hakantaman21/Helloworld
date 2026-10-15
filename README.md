# Konuşma Koçu

Dil pratiği platformu: gerçek kişilerle (topluluk) ya da her an hazır yapay zekâ partnerle İngilizce konuşma pratiği.
Tüm kararlar `ANAYASA.md`'de, kısa kurallar `KURALLAR.md`'de, güncel durum `DEVIR.md`'dedir.

## Hızlı başlangıç

- **Denemek:** Vercel deneme linki (Vercel → helloworld → Deployments). İstenirse `npm run derle` ile `teslim/` altında tek dosya da üretilir.
- **Derlemek:** `npm run derle` (yalnız Node.js gerekir, paket kurulmaz).
- **Yayınlamak:** Projeyi GitHub'a gönder; Vercel `npm run build` çalıştırıp `dist/` klasörünü yayınlar (`vercel.json` hazır).

## Klasör yapısı

```
kaynak/
  main.js              giriş: stiller, çekirdek, modül kaydı
  index.html           şablon (derleyici stil ve betiği içine yerleştirir)
  cekirdek/            depo, göçler, olay hattı, yönlendirici, metin, arayüz, tema,
                       izin, ses hattı, Hata Hafızası, günlük döngü, zamanlayıcı,
                       ai/ (adaptör + demo koç), dil/ (düzeltme motoru, kelime farkı)
  moduller/            karsilama, bugun, arama (koç arıyor + görüşme), karne,
                       senaryolar, hafiza, gelisim, ayarlar
  stiller/             katmanlar, jetonlar, tema-koyu, temel, bilesenler, erisim
  metinler/tr.js       tüm arayüz metinleri
  veri/                senaryolar, günlük aramalar, sözlük, tekrar soruları, koç dili
araclar/
  derle.mjs            bağımlılıksız derleyici
  yasa-denetcisi.mjs   test robotu (Y1–Y23)
  ornek-ihlal/         robotun kendini sınaması için bilerek hatalı örnek
genel/                 manifest, servis çalışanı, simge (Vercel sürümüne kopyalanır)
```

## Şu an ne çalışıyor (v0.1.0)

- İlk açılış (3 adım), Bugün, Koç arıyor, Görüşme, Konuşma karnesi, Senaryolar, Hata Hafızası, Gelişim, Ayarlar.
- **Demo koç:** Sunucu olmadan senaryo verisine göre konuşur. Sesli modda tarayıcının ses tanıma ve seslendirmesini kullanır (en iyi Chrome'da); yazılı mod her yerde çalışır.
- **Düzeltme motoru:** Türk öğrencilerin sık yaptığı 10 hata türünü yakalar. Koç konuşma sırasında doğal tekrarla düzeltir; ayrıntılar karnede.
- **Hata Hafızası:** Ortak kayıt formatı. Öğeler 1-3-7-14 gün aralıkla geri gelir, akşam aramasına gizlenir, 4 başarıda "öğrenildi" olur.
- **İçerik:** Alışveriş ve Ulaşım alanlarında 4 senaryo (A1–A2), sabah/akşam araması, tanışma, hata tekrarı.
- **Veri:** Bu cihazda (localStorage); şema sürümlü, göçten önce otomatik yedek. Ayarlar'dan indirilebilir ve silinebilir.

## Bilinçli sınırlar (sunucu bağlanınca açılacak)

| Konu | Şimdi | Sunucuyla |
| --- | --- | --- |
| Koç | Senaryoya bağlı demo koç | Canlı sesli AI, adaptöre yeni sağlayıcı olarak takılır |
| Söz kesme | Konuşan koça dokununca susar | Gerçek söz kesme (eko giderimli canlı ses) |
| Telaffuz | Cümle bazında tahmini puan | Harf bazlı puanlama |
| Koç araması | Uygulama açıkken | Uygulama kapalıyken de bildirim |
| Akıcılık | Basit demo ölçüm | Gerçek ölçüm |

## Devir notu

Güncel durum ve sürüm kayıtları `DEVIR.md`'dedir. Yeni bir yapay zekâ işe oradan başlar.

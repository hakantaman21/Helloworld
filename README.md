# Konuşma Koçu

Günlük yaşam İngilizcesini konuşarak öğreten, kullanıcıyı tanıyan tek bir koç etrafında kurulu uygulama.
Ana döngü: **koçla hazırlan → (ileride) insanla konuş → koçla pekiştir.**
Tüm kararlar ve yasalar **Konuşma Koçu — Anayasa** belgesindedir; kısa kurallar için `KURALLAR.md`.

## Hızlı başlangıç

- **Denemek:** `teslim/KonusmaKocu-v<sürüm>.html` dosyasını Chrome'da aç. Kurulum gerekmez.
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

**Son durum (15.10.2026, v0.1.0):** İlk taslak tamamlandı. Robot 24 denetimin tamamını geçiyor, kendi sınamasında 8 ihlalin hepsini yakalıyor. Tüm ekranlar başsız Chrome'da gezildi, telefon genişliğinde (390 px) açık ve koyu temada kontrol edildi.

**Açık kararlar:** uygulamanın kalıcı adı · koçun adı ve kişiliği (şimdilik "Koç", `metinler/tr.js` → `koc.ad`) · canlı ses AI sağlayıcısı · sunucu (Vercel mi, Türkiye'de VPS mi) · paketler ve günlük dakika kotaları · GitHub deposunun adı.

**Bilinen eksikler:** modüllerin kendi testleri henüz yok (sözleşmedeki 6. madde) · ergen ve akademik profiller yok · 4 yaşam alanı boş ("Yakında").

**Sıradaki mantıklı adım:** Koçun adı ve kişiliğini belirleyip metin tablosuna ve koç diline işlemek; ardından kalan yaşam alanlarına senaryo eklemek.

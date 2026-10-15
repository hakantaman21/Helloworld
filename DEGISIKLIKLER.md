# Değişiklikler

Her teslimde sürüm bir artar ve en üste bir kayıt eklenir (Y10). Test robotu, `kaynak/cekirdek/surum.js`,
`package.json` ve buradaki son kaydın aynı olduğunu denetler.

## 0.2.2 — 16.10.2026 · Keşfet kullanıcı deneyimi ilk dalga

- HelloTalk referansı: insan/AI keşif ayrımı, eşleşme kriterlerinin açık sunumu; sahte profil veya canlı durum yok.
- Speak referansı: ilk ekranda tek dokunuşla kısa konuşma.
- ELSA referansı: telaffuz çalışma yolu; gerçek ses düzeyi puanı varmış gibi gösterilmez.
- İki dilli metinler, erişilebilir 48 px sekmeler, mobil kartlar, açılır topluluk kuralları.
- Başlangıç dalı: deneme v0.2.1. Ayrı tasarım dalı; ana dala aktarılmadı.
- İnceleme: GitHub PR ve gerçek cihaz/robot testi bekleniyor.

## 0.2.1 — 15.10.2026 · Demo ölçümlerinin ayrılması

- Demo telaffuz, akıcılık ve seviye puanları kaldırıldı; profil seviyesi ve Hata Hafızası demo ile değişmez.
- İki dilde ölçüm sınırı açıklaması eklendi; süre ve pratik geçmişi korunur.
- Şema 3 eski demo kanıtlarını arşivler; eski akıcılık ve telaffuz puanları gelişim hesabından çıkarılır.
- Ortak çalışma: https://github.com/hakantaman21/Helloworld/issues/1

## 0.2.0 — 15.10.2026 · Yön düzeltmesi: dil pratiği platformu

- Yeni yön: gerçek kişilerle pratik (topluluk) + her an hazır yapay zekâ partner. İlk öğrenilen dil İngilizce.
- Dört sekme: Sohbetler · Keşfet · Pratik · Profil. Senaryolar ve Hata Hafızası Pratik altında.
- Arayüz İngilizce + Türkçe (metinler/en.js, tr.js); dil ilk açılışta ve Ayarlar'da seçilir.
- Yeni karşılama: dil, ad, ana dil, rol (öğrenen / yardımcı partner), 18 yaş ve topluluk kuralları onayı.
- Senaryo içerikleri iki dilli (durum, rol, görev, kültür notu).
- Yapay zekâ her yerde etiketli (Y26). Sohbetler ve Keşfet'te topluluk için dürüst boş durumlar.
- Şema göçü 2: arayüz dili, ana dil, öğrenilen dil, rol, yaş onayı.
- Devir protokolü: DEVIR.md, ANAYASA.md; robota Y24 (devir kaydı), Y25 (dil eşitliği), Y26 (yapay zekâ etiketi).

## 0.1.0 — 15.10.2026 · İlk taslak

- Modüler iskelet: çekirdek + 8 modül (karşılama, bugün, arama, karne, senaryolar, hafıza, gelişim, ayarlar).
- Bağımlılıksız derleyici: tek HTML dosyası (Chrome) + `dist/` (Vercel).
- Test robotu: Y1–Y23 yasaları ve robotun kendini sınaması.
- Demo koç: sunucu olmadan senaryo verisiyle konuşur; tarayıcının ses tanıma ve seslendirmesini kullanır.
- Hata Hafızası: ortak kayıt formatı, 1-3-7-14 gün aralıklı tekrar, akşam aramasına gizlenen sorular.
- İçerik: 2 yaşam alanında 4 senaryo (A1–A2), sabah/akşam araması, tanışma, hata tekrarı.

# Değişiklikler

Her teslimde sürüm bir artar ve en üste bir kayıt eklenir (Y10). Test robotu, `kaynak/cekirdek/surum.js`,
`package.json` ve buradaki son kaydın aynı olduğunu denetler.

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

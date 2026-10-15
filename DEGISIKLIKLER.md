## 0.2.9 — 16.10.2026 · English Prime görünümü ve HelloTalk öğeleri

- Görünüm English Prime'a geçti: koyu mat yüzey, kabartmalı kartlar ve düğmeler, altın vurgu, yüzen alt menü, bölüm renkli üst etiketler. Açık tema da aynı dille. Yalnız tasarım jetonları değişti (Y3), kontrast denetimi geçti (Y14).
- Dil Anları (HelloTalk "Moments"): test modunda sanal kullanıcı gönderileri; beğen, yorum, gönderiyi düzelt (yeşil/kırmızı fark), şikâyet, kendi anını paylaş (otomatik test yorumu gelir).
- Bağlantı (HelloTalk "Dil ortakları"): süzgeçler (Tümü / Ana dili İngilizce / Seviyeme yakın / Türkçe öğrenenler) ve kişi satırları; yeni Kişi profili ekranı (dil kimliği, seviye çubuğu, ilgiler, paylaşımları, mesaj, şikâyet, engelle).
- Test modu kapalıyken Bağlantı ve Dil Anları'nda "Sanal kullanıcılarla dene" daveti.
- Sanal kullanıcılar her yerde TEST rozetli; beğeni/yorum sayıları uydurulmaz, gelişime yazılmaz.

## 0.2.8 — 16.10.2026 · Test modu

- Ayarlar › Test modu (sürüm satırına 5 dokunuşla görünür; varsayılan kapalı).
- Açıkken Bağlantı'da 6 TEST rozetli profil; "Mesaj yaz" ile yeni Mesaj ekranı.
- Mesaj ekranı: gönderim öncesi düzeltme önerisi, partner düzeltmesi (yeşil fark), konu önerisi, şikâyet (4 neden) ve engelleme.
- Yanıtlar otomatik kalıptır ve "Otomatik test yanıtı" diye etiketlenir; yapay zekâ değildir, gerçek kişi gibi sunulmaz.
- Test sohbetleri Sohbetler › İnsanlar altında TEST rozetiyle; gelişim, seviye ve Hata Hafızası'na yazılmaz. Şema 6 → 7 (test alanı).

## 0.2.7 — 16.10.2026 · Anayasal bölüm ayrımı

- Sohbet geçmiş iletişim odağına taşındı; hızlı pratik kartı kaldırıldı.
- Bağlantı'da konuşma eylemleri Pratik ekranına yönlendirildi.
- Üst profil ve ayarlar kontrolleri merkezi yönlendiriciyle çalışır.
- Beşli menü adları ve TR/EN açıklamaları uyumlaştırıldı.
- Eski fonksiyonlar üzerine CSS yaması eklenmedi; yeni important yok.
- Claude: derleme engeli giderildi (Y16b, Y24, Y25, Y26); denetçi 0 ihlal, robot 8/8, 360 px Chromium sınaması geçti.
- Claude: tanıtım metni konuşma rahatlığı alanını eziyordu → ayrı alan ve şema 5 → 6 göçü.
- Claude: Bağlantı başlığı sekmeyle aynı; gece "Günaydın" yerine "İyi akşamlar"; tarih arayüz dilinde.
- Gerçek telefon ve Vercel Preview testi bekliyor; ana/deneme merge yok.

## 0.2.6 — 16.10.2026 · Beşli menü ve English Prime esinli görünüm

- Ana menü: Sohbet, Bağlantı, Dil Anları, AI, Profil.
- Mevcut ekran eşlemeleri: Sohbet→sohbetler, Bağlantı→kesfet, AI→bugun, Profil→gelisim.
- Dil Anları ayrı modül; moderasyon/sunucu olmadığı için sahte gönderi yok.
- Beş ana ekranda sol üst profil, sağ üst ayarlar; merkezde marka.
- Ayarlarda dengeli/kompakt görünüm ve mevcut açık/koyu/sistem teması; şema 3→4 güvenli göç.
- Navigasyon dokunma hedefleri, CSS jeton tabanlı yüzey ve ikon gölgeleri.
- Testler henüz çalıştırılmadı. Ayrı dal, merge yok.

# Değişiklikler

Her teslimde sürüm bir artar ve en üste bir kayıt eklenir (Y10). Test robotu, `kaynak/cekirdek/surum.js`,
`package.json` ve buradaki son kaydın aynı olduğunu denetler.

## 0.2.5 — 16.10.2026 · Profil gelişim ve sonraki adım

- Profilde Hata Hafızası vadesine göre bir sonraki adım önerisi.
- Veri kartı için ölçüm sınırlarını açıklayan açılır bilgi.
- Mevcut dönem raporu, paylaşım, seviye yolu ve haftalık takvim korunur.
- TR/EN anahtarları eşleştirildi; gerçek telaffuz veya geçerli seviye ölçümü iddia edilmez.
- Derleme/robot/telefon doğrulaması bekliyor; PR taslak, merge yok.

## 0.2.4 — 16.10.2026 · Pratik ekranı konuşma yolları

- Speak esinli hızlı konuşma kartı, tek dokunuşla önerilen senaryo.
- Üç açık pratik yolu: hızlı konuş, senaryo seç, Hata Hafızası.
- ELSA/English Prime ilkeleri: gerçek ölçüm olmayan demoda telaffuz veya ustalık puanı üretilmez.
- TR/EN metinleri; mevcut işleyen akışlar korunur.
- Kod, robot, cihaz testleri ve Claude incelemesi bekleniyor; merge yok.

## 0.2.3 — 16.10.2026 · Sohbetler ilk UX dalgası

- HelloTalk esinli konuşma araması ve Tümü / Yapay zekâ / İnsanlar sekmeleri.
- Speak esinli tek dokunuşla konuşma başlatma kartı.
- Arama yalnızca cihazdaki konuşma başlıklarını filtreler; gerçek kullanıcı ve mesajlaşma henüz yok.
- Türkçe/İngilizce metinler, 48px dokunma alanları, ayrı AI kimliği.
- Teknik derleme ve cihaz testleri bekliyor; PR #3 taslak ve birleştirilmedi.

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

# Devir Notu

> **Bu projede çalışan her yapay zekâ işe buradan başlar.** Sıra: bu dosya → `KURALLAR.md` → `ANAYASA.md`'nin ilgili bölümü.
> İş bitince en üstteki "Şu anki durum" güncellenir ve aşağıya yeni sürüm kaydı eklenir. Kaydı ve "Yapan" bilgisi olmayan sürümü robot derlemez (Y24).

## Şu anki durum

- **Sürüm:** v0.2.4 tasarim-kesfet-v0.2.2 dalında, v0.2.1 deneme üzerine; ana dal kaynak sürümü kontrol sırasında v0.2.0 (8780227). Canlı Vercel sürümü ayrıca doğrulanmalı; dal sürümü yayın kanıtı değildir.
- **Ortak çalışma:** https://github.com/hakantaman21/Helloworld/issues/1 · uygulayıcı Codex; Claude incelemesi bekleniyor.
- **Depo:** `hakantaman21/helloworld` · Vercel projesi: `helloworld` (Hakan 21). Canlı ve deneme linkleri Vercel → helloworld → Deployments'ta.
- **Ne çalışıyor:** İlk açılış (4 adım), dört sekme, yapay zekâ partnerle demo konuşma (senaryolar, sabah/akşam araması, tanışma, hata tekrarı), karne, Hata Hafızası, profil/gelişim, ayarlar, İngilizce + Türkçe arayüz. Veri yalnız cihazda.
- **Ne çalışmıyor / henüz yok:** gerçek kişilerle sohbet (topluluk, Evre 3), hesap ve sunucu, gerçek yapay zekâ sağlayıcısı (şimdilik demo koç), harf düzeyinde telaffuz.
- **Sıradaki adım:** English Prime ve akıllı asistan uygulamasındaki tasarım, ilke, hesap ve profil öğelerinin bu projeye taşınması (Benimle'nin isteği, 15.10.2026).
- **Açık kararlar:** platformun kalıcı adı · arka uç hizmeti · yapay zekâ sağlayıcıları · paketler ve kotalar · yapay zekâ partnerin adı.

## Sürüm kayıtları

## v0.2.4 — 16.10.2026

- **Yapan:** ChatGPT; Speak, ELSA ve English Prime ilkeleriyle Pratik ekranı ilk dalga.
- **Yapılan:** Önerilen senaryoya tek dokunuş, üç pratik yolu (hızlı/senaryo/tekrar), TR/EN metinleri; var olan döngü korunur.
- **Yapılmayan:** Fonem düzeyinde gerçek telaffuz analizi, sunucu, canlı AI, güvenilir seviye puanlaması.
- **Dokunulanlar:** bugun/index.js, bugun.css, metinler/{tr,en}.js, sürüm ve devir kayıtları.
- **Test:** Derleme, robot, gerçek cihaz ve Vercel doğrulanmadı. PR #3 açık taslak, ana/deneme dallarına merge yok.
- **Sıradaki:** Robot ve tarayıcı testleri; gerekirse önceki Keşfet/Sohbetler UX değişikliklerini düzeltme, Claude incelemesi.


## v0.2.3 — 16.10.2026

- **Yapan:** ChatGPT, HelloTalk/Speak/ELSA tasarım devamı.
- **Ne yapıldı:** Sohbetler sayfasına cihaz içi geçmiş araması, AI/insan filtreleri, hızlı konuşma kartı, dürüst topluluk boş durumu, iki dilli metinler eklendi.
- **Sınır:** Gerçek mesajlaşma ve sunucu yok; filtreler cihazdaki AI pratiklerine uygulanır.
- **Dokunulanlar:** sohbetler/index.js, sohbetler.css, metinler/{tr,en}.js, sürüm ve devir dosyaları.
- **Test:** Robot/derleme/Android henüz doğrulanmadı. PR #3 taslak, deneme/main değiştirilmedi.
- **Sonraki:** CSS/etkileşim kod incelemesi, robot testleri, Claude değerlendirmesi, cihaz testi.


## v0.2.2 — 16.10.2026

- **Yapan:** ChatGPT (GitHub bağlı sohbet), Hakan'ın HelloTalk ekran görüntüleri ve ELSA/Speak tasarım isteğiyle.
- **Ne yapıldı:** Keşfet ekranı; hızlı konuşma kartı, gerçek insan/AI sekmeleri, planlanan eşleşme ölçütleri, telaffuz/senaryo yolu, iki dilli içerik ve erişilebilir düzen.
- **Güvenilirlik:** Gerçek kişi listesi üretilmedi, sahte puan yok. Demo koç açıkça etiketli. Hesap/sunucu/gerçek fonem puanı yok.
- **Dokunulan dosyalar:** kesfet/index.js, kesfet.css, metinler/tr.js ve en.js, sürüm ve devir belgeleri.
- **Kontrol durumu:** Kod incelemesi ve cihaz/robot testleri bekliyor. PR onaylanmadan deneme/main'e alınmaz.
- **Sıradaki:** Claude incelemesi; onay sonrası deneme dalına alma, sonra telefon testi.


## v0.2.1 — 15.10.2026

- **Yapan:** ChatGPT / Codex; Hakan'ın çalışma devri üzerine.
- **Ne yapıldı:** Demo ölçüm puanları kaldırıldı; demo hafızaya kanıt yazmaz, tekrar ustalığını veya profil seviyesini değiştirmez. İki dilde açıklama, şema 3 ile eski demo verisini arşivleme ve gelişimden ayırma.
- **Dokunulan dosyalar:** ai/demo-koc.js, gorusme-sonucu.js, gocler.js, moduller/karne/index.js, metinler/{tr,en}.js, sürüm ve devir belgeleri, araclar/demo-sinama.mjs.
- **Kontroller:** `npm run derle`, `node araclar/demo-sinama.mjs` ve `npm run robot-sinama` geçti. Gerçek cihaz ve görsel tarayıcı testi yapılmadı.
- **Sınırlama:** Eski profil seviyesinin kullanıcı mı demo mu kaynaklı olduğu bilinmediği için korunur. Eski hafıza kayıtları demoArsivi içinde tutulur. Yeni gerçek sağlayıcı henüz yok.
- **Sıradaki:** Claude incelemesi; hesap ve gerçek partner altyapısı için sağlayıcı/maliyet kararı. Anayasa Y9/Y12 ve çok dilli model önerileri issue #1'de, henüz uygulanmadı.
- **Yayın:** main'e alınmadı; deneme sonucu/onay bekleniyor.


## v0.2.0 — 15.10.2026

- **Yapan:** Claude (Opus 5.5), Benimle'nin claude.ai sohbeti
- **Ne yapıldı:** Yön düzeltmesi: dört sekme, İngilizce + Türkçe arayüz, yeni karşılama (dil, ana dil, rol, 18+), iki dilli senaryolar, yapay zekâ etiketleri, Sohbetler ve Keşfet modülleri, göç 2, DEVIR.md, ANAYASA.md, robota Y24–Y26.
- **Dokunulan dosyalar:** kaynak/metinler/{tr,en}.js, cekirdek/{metin,gocler,arayuz,yonlendirici,gorusme-sonucu}.js, moduller/{karsilama,sohbetler,kesfet,bugun,senaryolar,hafiza,gelisim,ayarlar,arama,karne}, veri/senaryolar/*, veri/gunluk/*, araclar/yasa-denetcisi.mjs, main.js, stiller/bilesenler.css.
- **Yarım kalan:** Y27 ve Y28 robot denetimleri topluluk modülüyle eklenecek.
- **Sıradaki:** English Prime / akıllı asistan öğelerini taşımak; ardından arka uç ve hesap (Evre 1'in kalanı).

## v0.1.0 — 15.10.2026

- **Yapan:** Claude (Opus 5.5), Benimle'nin claude.ai sohbeti
- **Ne yapıldı:** İlk taslak: modüler iskelet, bağımsız derleyici, test robotu (Y1–Y23), demo koç, Hata Hafızası, düzeltme motoru, 9 ekran.
- **Yarım kalan:** Yön yapay zekâ koç merkezliydi; v0.2.0'da platform yönüne çevrildi.

# Devir Notu

> **Bu projede çalışan her yapay zekâ işe buradan başlar.** Sıra: bu dosya → `KURALLAR.md` → `ANAYASA.md`'nin ilgili bölümü.
> İş bitince en üstteki "Şu anki durum" güncellenir ve aşağıya yeni sürüm kaydı eklenir. Kaydı ve "Yapan" bilgisi olmayan sürümü robot derlemez (Y24).

## Şu anki durum

- **Sürüm:** v0.2.1 deneme teslimi; ana dal kaynak sürümü kontrol sırasında v0.2.0 (8780227). Canlı Vercel sürümü ayrıca doğrulanmalı; dal sürümü yayın kanıtı değildir.
- **Ortak çalışma:** https://github.com/hakantaman21/Helloworld/issues/1 · uygulayıcı Codex; Claude incelemesi bekleniyor.
- **Depo:** `hakantaman21/helloworld` · Vercel projesi: `helloworld` (Hakan 21). Canlı ve deneme linkleri Vercel → helloworld → Deployments'ta.
- **Ne çalışıyor:** İlk açılış (4 adım), dört sekme, yapay zekâ partnerle demo konuşma (senaryolar, sabah/akşam araması, tanışma, hata tekrarı), karne, Hata Hafızası, profil/gelişim, ayarlar, İngilizce + Türkçe arayüz. Veri yalnız cihazda.
- **Ne çalışmıyor / henüz yok:** gerçek kişilerle sohbet (topluluk, Evre 3), hesap ve sunucu, gerçek yapay zekâ sağlayıcısı (şimdilik demo koç), harf düzeyinde telaffuz.
- **Sıradaki adım:** English Prime ve akıllı asistan uygulamasındaki tasarım, ilke, hesap ve profil öğelerinin bu projeye taşınması (Benimle'nin isteği, 15.10.2026).
- **Açık kararlar:** platformun kalıcı adı · arka uç hizmeti · yapay zekâ sağlayıcıları · paketler ve kotalar · yapay zekâ partnerin adı.

## Sürüm kayıtları

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

# Devir Notu

> **Bu projede çalışan her yapay zekâ işe buradan başlar.** Sıra: bu dosya → `KURALLAR.md` → `ANAYASA.md`'nin ilgili bölümü.
> İş bitince en üstteki "Şu anki durum" güncellenir ve aşağıya yeni sürüm kaydı eklenir. Kaydı ve "Yapan" bilgisi olmayan sürümü robot derlemez (Y24).

## Şu anki durum

- **Sürüm:** v0.2.0 (deneme dalında, onay bekliyor). Ana dalda (canlı): v0.1.0.
- **Depo:** `hakantaman21/helloworld` · Vercel projesi: `helloworld` (Hakan 21). Canlı ve deneme linkleri Vercel → helloworld → Deployments'ta.
- **Ne çalışıyor:** İlk açılış (4 adım), dört sekme, yapay zekâ partnerle demo konuşma (senaryolar, sabah/akşam araması, tanışma, hata tekrarı), karne, Hata Hafızası, profil/gelişim, ayarlar, İngilizce + Türkçe arayüz. Veri yalnız cihazda.
- **Ne çalışmıyor / henüz yok:** gerçek kişilerle sohbet (topluluk, Evre 3), hesap ve sunucu, gerçek yapay zekâ sağlayıcısı (şimdilik demo koç), harf düzeyinde telaffuz.
- **Sıradaki adım:** English Prime ve akıllı asistan uygulamasındaki tasarım, ilke, hesap ve profil öğelerinin bu projeye taşınması (Benimle'nin isteği, 15.10.2026).
- **Açık kararlar:** platformun kalıcı adı · arka uç hizmeti · yapay zekâ sağlayıcıları · paketler ve kotalar · yapay zekâ partnerin adı.

## Sürüm kayıtları

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

## Vercel Preview derleme engeli — 16.10.2026 / ChatGPT

- Kullanıcı Vercel Preview logunu iletti: commit `8882d8b`, `npm run build` dört ihlal ile durdu (Y4: bugun.css, gelisim.css; Y16b: kesfet/index.js, sohbetler/index.js).
- Y4 için modüle özgü `bgn-hizli-alt` ve `gls-siradaki-alt` sınıfları CSS ve ilgili metin elemanlarına eklendi.
- Y16b için hesaplanmış çeviri anahtarları yerine doğrudan `t('...')` çağrıları kullanıldı.
- Kalite denetçisi gevşetilmedi, `!important` eklenmedi.
- **Henüz derleme ve Vercel yeniden dağıtım sonucu doğrulanmadı.** Kullanıcının logu eski commit'e aitti. Yeni Preview çıktısı incelenmeli.

## Profil düzenleme ve veri göçü — 16.10.2026 / ChatGPT

- Ayarlar ekranına ana dil, öğrenilen dil, kişisel dil hedefi ve kısa tanıtım düzenleme alanları eklendi; değişiklikler mevcut `degistir` deposuna kaydedilir.
- Profil ekranı kişisel dil hedefini mevcut genel hedef yerine gösterir; mevcut büyüme karnesi korunur.
- Şema 4→5 göçü `dilHedefi` alanını mevcut verileri koruyarak ekler.
- TR/EN metinler eklendi; EN alt menüde eksik `gezinme.baglanti`, `gezinme.dilAnlari` ve `ekran.dilAnlari` tamamlandı.
- Mevcut dil seçimi uygulamanın desteklediği dil etiketleriyle sınırlıdır; `diger` genel kategoridir. Toplulukta kamuya açık profil hâlâ yok.
- Çalıştırılmış derleme, robot, mobil ve şema göç testi yok. Main/deneme değişmedi.

## Profil kimlik kartı — 16.10.2026 / ChatGPT

- Profil üstüne ana dil, öğrenilen dil, mevcut seviye ve konuşma pratiği hedefi görünümü eklendi; mevcut büyüme karnesi ve ölçüm açıklamaları korunuyor.
- Bilinmeyen dil için boş durum ve yerel depolama/gizlilik açıklaması gösteriliyor; kamuya açık profil veya sosyal bağlantı varmış gibi davranılmıyor.
- Türkçe/İngilizce etiketler ve `gls-` kapsamlı CSS eklendi; yeni important yok. Tek ayarlar erişimi korunuyor.
- Önemli sınır: Düzenle mevcut ayarlar ekranına gider; bu ekranda ana dil/öğrenilen dil/hedef alanları henüz düzenlenemiyor. Bu özellik tamamlandı denmemeli.
- Testler çalıştırılmadı: derleme, robot, mobil ve erişilebilirlik. Main/deneme merge yok.

## Pratik ve Dil Anları görev ayrımı — 16.10.2026 / ChatGPT

- Pratik ekranına açık AI / gerçek kişi seçimi eklendi; AI mevcut demo senaryoya, gerçek kişi Bağlantı keşfine gider. Canlı insan görüşmesi henüz yok.
- Pratik'teki mükerrer ayarlar kısayolu ve kullanılmayan `bgn-profil` CSS kuralı kaldırıldı.
- Dil Anları'nda senaryo pratiği kısayolu yerine Bağlantı keşfine geçiş verildi; topluluk boş durumu korunuyor.
- TR/EN metin anahtarları eş zamanlı güncellendi. Yeni important eklenmedi.
- Eksik: gerçek partner servisi, paylaşımlar, profil bilgi düzenleme, otomatik denetim/derleme/Android testi. Main/deneme değiştirilmedi.

## Bağlantı görev ayrımı — 16.10.2026 / ChatGPT

- Beşli menüde Bağlantı yalnız gerçek kişi keşfine ayrıldı. AI sekmesi, hızlı pratik ve telaffuz/senaryo kartı kaldırıldı.
- Eski `kft-sekme`, `kft-sekmeler`, `kft-demo-not`, `kft-ogren` ve `shb-basla` CSS kuralları silindi; yeni `!important` yok.
- TR/EN keşif başlığı ve açıklaması gerçek insan bağlantısına göre düzeltildi.
- Gerçek hesap/partner altyapısı olmadığından dürüst boş durum devam ediyor.
- Derleme, robot, mobil test ve tüm dosyalarda artık denetimi henüz yapılmadı. Main/deneme değiştirilmedi.

## HelloTalk ekran kaydı incelemesi — 16.10.2026 / ChatGPT

- Kaynak: kullanıcının yaklaşık 74 saniyelik HelloTalk Android ekran kaydı; 9 örnek kare incelendi.
- Görülen ekranlar: Dil Sohbetleri, Dil Ortakları Bul, Dil Anları akışı, Öğren araçları, profil ve menü.
- Benimsenecek: sohbet araması ve çip filtreler; dil partneri keşfi ve kişi kartları; topluluk paylaşımları ve etkinlikleri; profilin kategorili sunumu; alt gezinmede açık aktif durum.
- Kaçınılacak: reklam/VIP baskısı, yoğun promosyon, kalabalık yüzey, görevleri karıştıran sekmeler.
- Ürün sınırları: Sohbet=geçmiş; Bağlantı=yeni kişi; Dil Anları=paylaşımlar; Pratik=insan veya AI; Profil=kişisel bilgi. AI insanmış gibi sunulmaz.
- Uygulama sırası: 1) mevcut beşli menü ve yönlendirme temizliği, 2) ortak mat siyah/gri token ve bileşenleri, 3) filtre/arama, 4) profil ve güvenli topluluk altyapısı, 5) mobil/erişilebilirlik/robot testleri.
- Bu kayıt analiz ve karar notudur; yeni UI kodu/testi olarak raporlanmamalıdır. Main ve deneme dalları değişmedi.

## Anayasa uyum kaydı — 16.10.2026 / ChatGPT

- ANAYASA.md dört sekme ve zorunlu sıcak palet tanımlarını kullanıcının son beş sekme, mat siyah/gri, English Prime UX kararlarıyla uyumlaştıracak şekilde güncellendi.
- Korunan hükümler: önce konuşma, insan/AI dürüst ayrımı, 18+ başlangıç, gizlilik, güvenli topluluk, çok dillilik, erişilebilirlik, Y1–Y28.
- Kalite kaynağı: MIMARI_KALITE_KURALLARI.md; yeni important ve CSS yaması yığılması yasak.
- Bu teslim belge/karar uyumlaştırmasıdır; UI kodunun tümü tamamlanmış veya test edilmiş değildir. Ana/deneme dalı değişmedi.

## v0.2.6 — 16.10.2026 / ChatGPT / Beşli menü

- Kullanıcı kararı: Sohbet · Bağlantı · Dil Anları · AI · Profil; sol üst profil, sağ üst ayarlar.
- Tasarım: English Prime'dan ilhamla sade kartlar, 5 eşit tab, vurgu yüzeyi, dengeli/kompakt yerleşim.
- Bağlantı mevcut Keşfet modülüne, AI mevcut Pratik modülüne bağlı; yeni Dil Anları güvenli boş durumdur.
- Ayarlar: mevcut sistem/açık/koyu ve yeni görünüm seçimi; veri göçü 3→4.
- Dal: tasarim-besli-menu-v0.2.6, taban: tasarim-kesfet-v0.2.2. Henüz test edilmedi, main/deneme değişmedi.
- Sonraki geliştirici: Y1–Y26 denetçisi, robot, gerçek Android, tema ve erişilebilirlik testleri; Claude incelemesi.
- Hakan onayı olmadan merge yok.

# Devir Notu

> **Bu projede çalışan her yapay zekâ işe buradan başlar.** Sıra: bu dosya → `KURALLAR.md` → `ANAYASA.md`'nin ilgili bölümü.
> İş bitince en üstteki "Şu anki durum" güncellenir ve aşağıya yeni sürüm kaydı eklenir. Kaydı ve "Yapan" bilgisi olmayan sürümü robot derlemez (Y24).

## Şu anki durum

- **Sürüm:** v0.2.5 tasarim-kesfet-v0.2.2 dalında, v0.2.1 deneme üzerine; ana dal kaynak sürümü kontrol sırasında v0.2.0 (8780227). Canlı Vercel sürümü ayrıca doğrulanmalı; dal sürümü yayın kanıtı değildir.
- **Ortak çalışma:** https://github.com/hakantaman21/Helloworld/issues/1 · uygulayıcı Codex; Claude incelemesi bekleniyor.
- **Depo:** `hakantaman21/helloworld` · Vercel projesi: `helloworld` (Hakan 21). Canlı ve deneme linkleri Vercel → helloworld → Deployments'ta.
- **Ne çalışıyor:** İlk açılış (4 adım), dört sekme, yapay zekâ partnerle demo konuşma (senaryolar, sabah/akşam araması, tanışma, hata tekrarı), karne, Hata Hafızası, profil/gelişim, ayarlar, İngilizce + Türkçe arayüz. Veri yalnız cihazda.
- **Ne çalışmıyor / henüz yok:** gerçek kişilerle sohbet (topluluk, Evre 3), hesap ve sunucu, gerçek yapay zekâ sağlayıcısı (şimdilik demo koç), harf düzeyinde telaffuz.
- **Sıradaki adım:** English Prime ve akıllı asistan uygulamasındaki tasarım, ilke, hesap ve profil öğelerinin bu projeye taşınması (Benimle'nin isteği, 15.10.2026).
- **Açık kararlar:** platformun kalıcı adı · arka uç hizmeti · yapay zekâ sağlayıcıları · paketler ve kotalar · yapay zekâ partnerin adı.

## Sürüm kayıtları

## v0.2.5 — 16.10.2026

- **Yapan:** ChatGPT. Profil ekranına sonraki adım önerisi (Hata Hafızası vadesi veya önerilen senaryo), ölçüm sınırı açıklaması, TR/EN metinleri eklendi.
- **Korunan:** Haftalık/aylık karne, paylaşım, seviye yolu, etkin günler.
- **Yapılmayan:** Gerçek ELSA fonem ölçümü, bağımsız doğrulanmış ustalık modeli, sunucu.
- **Test:** Derleme/robot/Android testleri henüz çalıştırılmadı. PR #3 taslak ve merge yok.
- **İnceleme:** Profil önerisi ve arayüzün kod/test denetimi, Claude geri bildirimi.


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

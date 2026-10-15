# HELLOWORLD — GELİŞTİRİCİ DEVİR NOTU
**Tarih:** 16 Ekim 2026  
**Hazırlayan:** ChatGPT  
**Durum:** Geliştirme sürüyor; üretim yayınına alınmadı. Bu belge son kullanıcıya teslim edilen kapsamlı devir notunun GitHub sürümüdür.

## 1. Ürün hedefi
Helloworld; başlangıçta Türkçe/İngilizce, ileride çok dilli, mobil öncelikli sosyal dil öğrenme PWA'sıdır. HelloTalk, Speak, ELSA ve English Prime'dan ilham alınır, birebir kopyalanmaz. Öncelikler: az tıklama/kaydırma, şeffaf gezinme, erişilebilirlik, AI ile gerçek insan etkileşiminin dürüst ayrımı.

## 2. Depo, dallar ve yayın
- Depo: `hakantaman21/Helloworld`
- Geliştirme dalı: `tasarim-besli-menu-v0.2.6`; PR #4: https://github.com/hakantaman21/Helloworld/pull/4
- **Kullanıcı onayı olmadan `main` veya `deneme` dallarına merge yapılmayacak.**
- Önceki karşılaştırmada dal `main`den 95 commit önde, 31 dosya farklıydı; bu rakam zamanla değişebilir.
- Vercel `helloworld` projesinde Production eski `v0.2.0` sürümünü gösteriyordu.
- Önceki Preview `8882d8b` commit'inde `npm run build` başarısız oldu. Kullanıcı videosunda ayrıca `Resource is limited — try again in 24 hours` uyarısı görüldü. Yeni Preview'ın başarıyla yayınlandığı **doğrulanmadı**.

## 3. Beş ana bölüm — kesin sorumluluklar
1. **Sohbet:** Var olan konuşmalar/geçmiş; arama ve AI/insan filtreleri. Buradan AI pratik başlatılmaz.
2. **Bağlantı:** Yalnız gerçek kişi keşfi. Sunucu/eşleşme yoksa sahte kullanıcı, çevrimiçi durumu veya görüşme gösterilmez.
3. **Dil Anları:** Topluluk gönderileri/yorumlar; güvenlik ve moderasyon hazır olana kadar dürüst boş durum.
4. **Pratik:** AI ve gerçek insan ayrı seçenekler. AI demo senaryoya, gerçek insan Bağlantı'ya gider; canlı görüşme varmış gibi davranılmaz.
5. **Profil:** Ana dil, öğrenilen dil, seviye, kişisel hedef, kısa tanıtım ve mevcut gelişim raporları; ortak üst bantta ayarlar.

## 4. Uygulanan GitHub değişiklikleri
- Sohbet hızlı AI pratik kartı kaldırıldı; geçmiş, filtreler ve Bağlantı yönlendirmesi düzenlendi.
- Bağlantı AI sekmesi/senaryo/telaffuz öğeleri kaldırıldı; ilgili eski CSS temizlendi.
- Pratik ekranına AI/insan seçimi eklendi, mükerrer ayarlar kısayolu kaldırıldı.
- Dil Anları'nda senaryo pratiği yerine kişi keşfi bağlantısı kullanıldı.
- Profil kimlik kartı eklendi; büyüme karnesi korundu.
- Ayarlar'a ana dil, öğrenilen dil, kişisel hedef ve tanıtım düzenleme alanları eklendi. Veriler mevcut cihaz içi depoya yazılır.
- Veri şeması 4→5 göçü `dilHedefi` alanını korumalı biçimde eklemek üzere yazıldı.
- TR/EN çeviriler, İngilizce Bağlantı/Dil Anları gezinme etiketleri güncellendi.
- Son görülen `package.json` ve `kaynak/cekirdek/surum.js` sürümü `0.2.7`.

## 5. Vercel'de görülen dört kural ihlali ve düzeltme
Kullanıcının `8882d8b` Preview logunda:
- **Y4:** `bugun/bugun.css` içindeki `.bgn-hizli .b-kucuk`.
- **Y4:** `gelisim/gelisim.css` içindeki `.gls-siradaki .b-kucuk`.
- **Y16b:** `kesfet/index.js` içinde dinamik `kesfet.filtre.` anahtarı.
- **Y16b:** `sohbetler/index.js` içinde dinamik `sohbetler.` anahtarı.

Düzeltmeler geliştirme dalına işlendi: `bgn-hizli-alt` ve `gls-siradaki-alt` modül sınıfları ve DOM eşlemeleri; statik `t('...')` çeviri çağrıları. Denetçi devre dışı bırakılmadı, `!important` eklenmedi. **Bu düzeltmelerden sonra yerel build/robot ve güncel Vercel Preview başarı sonucu henüz doğrulanmadı.**

## 6. Yeni teslim zorunluluğu: Chrome'da inceleme
Kullanıcı her geliştirme sonrasında Samsung telefonundaki Chrome'da açıp deneyebileceği bağlantı/dosya istiyor. Her teslim: açılabilir **gerçek uygulama Preview'ı** veya mümkünse yerel test paketi, sürüm, yapılanlar, çalışmayanlar, test sonucu.

Önceki sohbette `Helloworld_Chrome_Kontrol_v0_2_7.html` adlı **bağımsız kontrol prototipi** teslim edildi: beşli menü, profil/dil/hedef/tanıtım düzenleme, localStorage ve dürüst boş durumlar. **GitHub uygulamasının gerçek derlemesi değildir**; AI, sohbet, topluluk, sunucu ve gerçek öğrenme motoru bağlı değildir. Prototipi gerçek uygulama gibi sunmayın. Bu HTML dosyası GitHub'a yüklenmedi; sohbet eki olarak kullanıcıya verildi.

## 7. Mimari ve kalite sözleşmesi
Önce `ANAYASA.md`, `KURALLAR.md`, `MIMARI_KALITE_KURALLARI.md`, `DEVIR.md`, `DEGISIKLIKLER.md` okunmalı. `!important` yasak; CSS modül önekleri ve `@layer` korunur. TR/EN anahtarları eşlenik ve denetçiye uygun olmalı. Modüller arası sınırlar ve merkezi router korunur. Sürüm/değişiklik notu tutarlı; veri şeması göçlü. Sahte gerçek kullanıcı, sahte çevrimiçi durum, ölçüm veya backend yok. Topluluk açılmadan önce yaş güvenliği, şikâyet/engelleme, gizlilik ve moderasyon gerekir.

## 8. Öncelik ve kabul ölçütleri
**P0:** En güncel dalda `npm run build`, anayasa/robot testlerini gerçekten çalıştırıp hataları giderin. Vercel kotası izin verdiğinde **güncel commit** için Preview `Ready` ve mobil Chrome açılışını doğrulayın. Eski `8882d8b` dağıtımını tekrar yayınlamak yeterli değil.
**P1:** Profil düzenleme/persist, boş değerler, 4→5 göç, TR/EN eşlenikliği, etiket/erişilebilirlik; beş rota, üst bar, geri davranışı, alt menü, mobil kaydırma testleri.
**P2:** Gerçek sosyal servis ve moderasyon ayrı tasarım/uygulama aşaması. Her teslimde gerçek Chrome kontrol imkânı.

**Tamamlanma ölçütleri:** build başarılı, denetçi sıfır ihlal, güncel Preview Ready, mobil test başarılı, kullanıcıya gerçek test bağlantısı veya paket ve rapor sunulmuş, izinsiz merge yapılmamış. **Bunlar henüz karşılandı diye raporlanmamalıdır.**

## 9. İşbirliği
İş bölümü ve teknik itirazlar için GitHub Issue #1: https://github.com/hakantaman21/Helloworld/issues/1 . Claude/Codex önce güncel dalı, bu notu ve PR #4'ü incelemeli; yeni tespitleri gerekçeleriyle Issue #1'de tartışmalı. Belge, PR ve Issue kayıtları birbirine bağlanmalı; kullanıcı onayı olmadan üretim değişikliği yapılmamalı.

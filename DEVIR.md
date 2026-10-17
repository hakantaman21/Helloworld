# Devir Notu

> **Bu projede çalışan her yapay zekâ işe buradan başlar.** Sıra: bu dosya → `KURALLAR.md` → `ANAYASA.md`'nin ilgili bölümü.
> İş bitince en üstteki "Şu anki durum" güncellenir ve aşağıya yeni sürüm kaydı eklenir. Kaydı ve "Yapan" bilgisi olmayan sürümü robot derlemez (Y24).

## Şu anki durum

- **Sürüm:** v0.22.0 · `deneme` dalında (v0.16.0–v0.22.0 Hakan onayı bekliyor). `main` (canlı, helloworld-gules.vercel.app) v0.15.0'da (17.10.2026, PR #18). Canlıya alma yalnız Hakan onayıyla.
- **v0.19–v0.21 notu:** Bu üç sürüm Hakan'a önce tek dosya olarak teslim edildi (ikinci Claude hesabı, depo erişimi yokken); v0.22.0'da kaynak ağacına aktarıldı. Ayrıntılı devir: aşağıdaki kayıtlar ve issue #1.
- **Çalışma kuralı:** Yeni iş `deneme`'den açılan dalda; aynı dalda aynı anda tek yazan (issue #1, madde 4). Vercel ücretsiz planı günde 100 dağıtım: küçük işleri tek commit'te topla.
- **Ortak çalışma:** https://github.com/hakantaman21/Helloworld/issues/1 · ayrıntılı ChatGPT devri: `DEVIR_2026-10-16_CHATGPT.md`.
- **Ürün yapısı (beşli menü):** Sohbet = geçmiş konuşmalar · Bağlan = yalnız gerçek insan keşfi (+ test modunda TEST profilleri) · Dil Anları = topluluk (dürüst boş durum) · Pratik = AI ya da gerçek insan, açık etiketli · Profil = dil kimliği ve gelişim.
- **Görünüm:** Renk ve ikonlar English Prime'dan (koyu petrol zemin, altın vurgu, 3B ikonlar `veri/ikon3d.js`); düzen ve yoğunluk HelloTalk'tan (ince üst çubuk `htUst`, metin/hap sekmeler, düz liste satırları, tam genişlik alt menü). Renk yalnız jetonlarda (Y3).
- **Ne çalışıyor:** İlk açılış, beşli gezinme, yapay zekâ demo konuşma, karne, Hata Hafızası, profil düzenleme, görünüm, TR + EN. **Test modu (10 sanal kullanıcı, TEST rozetli):** Dil Ortakları Bul (sekmeler, dil hapları, yaş/cinsiyet/hızlı yanıt süzgeci, kural tabanlı otomatik eşleşme, el sallama), zengin kişi profili (yaş, ülke, yerel saat, etkinlik, hobiler, meslek, takip), Dil Anları (Güncel / Senin için / Yardım et / Takip; beğen, yorum, düzelt, paylaş), mesajlaşma, düzeltme önerisi, partner düzeltmesi, şikâyet/engelleme (yanıtlar otomatik kalıp). Veri yalnız cihazda.
- **Ne çalışmıyor / henüz yok:** gerçek hesap ve sunucu, gerçek kişilerle mesajlaşma, sesli mesaj (Y12 kararı bekliyor), çeviri, gerçek yapay zekâ sağlayıcısı, harf düzeyinde telaffuz.
- **Sıradaki adım:** Hakan'ın canlı v0.9.0'ı telefonda denemesi (alt menü, orta düğme, renkler) ve geri bildirimi → arka uç kararı (Supabase / Firebase) → Mesaj ve Bağlantı ekranlarını gerçek hesaplarla bağlamak.
- **Açık kararlar:** arka uç hizmeti · yapay zekâ sağlayıcıları · paketler ve kotalar · sesli mesaj ve Y12 · yapay zekâ partnerin adı.

## Sürüm kayıtları

## v0.22.0

- **Yapan:** Claude (Opus 5.5, ikinci hesap), 17.10.2026
- **Neden:** Hakan (17.10, 12:29): GitHub'a bağlan, canlıya alma ve düzeltme; devir notu ve issue'da planlama/işbölümü.
- **Ne:** v0.19–v0.21 dosya teslimlerinin kaynak ağacına aktarımı (derlenmiş tek dosyadan modül modül geri çevrildi; `derle(deneme v0.18.0)` = teslim edilen v0.18.0 dosyası birebir doğrulandı, aktarım bu eşitlik üstüne satır farkıyla yapıldı). Yasa uyumu: Y1 (`!important` yok; turda hedefsiz adım JS ile ortalanır), Y3 (ikon renkleri jetonlarda, glif zemini `::before` + `hue-rotate`), Y4 (ortak sınıflar `b-`; `rhb-`, `eko-`, `bgn-`, `ayr-` modül önekleri; modüller birbirinin sınıfını kullanmaz), Y5 (`--z-tur`, `--z-icerik`), Y13 (48 px), Y16 (önerilen aramalar `veri/rehber-dizini.js`'te).
- **Şema:** 19. **Durum:** `deneme`'de.

## v0.21.0

- **Yapan:** Claude (Opus 5.5, ikinci hesap), 17.10.2026 (dosya teslimi; depoya v0.22.0 ile)
- **Neden:** Hakan (17.10, 12:29): Pratik'teki senaryo kartları sayfayı uzatıyor ve çok yoğun; kategori başına yatay şerit (ekranda 2 kare), "Genişlet" ile tam sayfa / alta açılan geniş sohbet kartları; geri dönünce aynı yer; denenen senaryoya işaret; tam görünümde kullanım ve başarı bilgisi; basılı tutunca rapor.
- **Ne:**
  - `cekirdek/senaryo-istatistik.js`: `v.senaryoIst[id] = { d, t, i, s, sn, c, dz }` (deneme, tamam, ilk, son, süre, cümle, düzeltme); `isle(v, ozet)` `gorusme-sonucu.sonucuIsle` içinden; `istatistik(id)` başarı oranı ve durum (tamam/denendi). Göç 19 eski görüşmelerden ve `tamamlananSenaryolar`'dan doldurur.
  - `cekirdek/senaryo-kart.js`: `kareKart`, `genisKart`, `senaryoIsareti`, `raporAc` (alt pencere). Pratik (Konu odaları, Öğren) ve Senaryolar ekranı aynı bileşeni kullanır.
  - bugun: `odaDurumu` (modül düzeyi: seçili kategori, alta açılanlar, şerit kaydırmaları) · yeni ekran `/odalar?alan=…` (tam sayfa, seviyeye göre gruplu).
- **Şema:** 19.

## v0.20.0

- **Yapan:** Claude (Opus 5.5, ikinci hesap), 17.10.2026 (dosya teslimi; depoya v0.22.0 ile)
- **Neden:** Hakan kuyruğu (v0.17 kaydı): 4 ikon paketi + her kartta benzersiz ikon + tasarım paketiyle uyum; English Prime ve Yoldaş'a yönlendirme, birinde ücretli olana diğerlerinde indirim; B1 içerik.
- **Ne:**
  - `cekirdek/ikon.js` + `veri/ikon-paketleri.js` (English Prime paketlerinden 3×12 çekirdek 3B görsel ve 69 glif): `ikonOgesi(ad, boyut)` = `arayuz.ikon3d`; paket `profil.ayarlar.ikonPaketi` (otomatik → `TASARIM_IKON[tasarimPaketi]`). `benzersizlestir()` MutationObserver ile ekran/yan menü/alt pencerede ≥30 px kart ikonlarını tekilleştirir (başlık, gezinme ve grup başlıkları hariç).
  - `veri/ekosistem.js` + `cekirdek/ekosistem.js` + `/uygulamalar`: üyelik paylaşımı `localStorage['ekosistem:uyelikler']` (`{ uygulama: { paket, zaman } }`), indirim oranı ve adresler `profil.ayarlar.ekosistem`. Paketler ekranında indirimli fiyat.
  - 5 B1 senaryosu (`veri/senaryolar/*-b1-01.js`).
- **Açık:** English Prime ve Yoldaş canlı adresleri (düzenleme modundan girilecek); çapraz indirimin sunucuda doğrulanması; diğer uygulamaların aynı anahtara üyelik yazması.

## v0.19.0

- **Yapan:** Claude (Opus 5.5, ikinci hesap), 17.10.2026 (dosya teslimi; depoya v0.22.0 ile)
- **Neden:** Hakan kuyruğu: kategorili bildirim ve mesaj kutusu, toplu silme; ilk girişte tur; güncellemede "Yeni" etiketi ve yenilikler; eksik bilgi hatırlatması ve bilgilendirme; kullanım takibi ve öneriler; arama dizini, ipucu, kılavuz, uygulama haritası.
- **Ne:**
  - `veri/rehber-dizini.js`: tek özellik dizini (OZELLIKLER, HARITA_GRUPLARI, YENILIKLER, TUR_ADIMLARI, ONERILEN_ARAMALAR). Yeni özellik = buraya bir satır.
  - `cekirdek/rehber.js`: kutu (saklanan öğeler + `kutuKaynagiEkle(kat, fn)` canlı kaynaklar: okunmamış mesaj, istek, arkadaş haberi, paylaşım yorumu, tekrar), kullanım sayacı (cihazda), Yeni etiketleri (14 gün), planlayıcı (hatırlatma 2 günde bir, öneri 3 günde bir, bilgi; günde en çok bir sistem mesajı), arama (`katla()` Türkçe karakter katlama).
  - `cekirdek/rehber-arayuz.js`: tur, yenilikler penceresi, ipucu şeridi, rozetler (`data-kutu-rozet`), `kutuDugmesi`.
  - `moduller/rehber`: `/kutu`, `/ara`, `/kilavuz`, `/harita`. Ayarlar › Rehber ve ipuçları.
  - Kilit: `ekran({ kilitKapsami })` (kutu = kisiler). Bağlan "Arkadaşlar" sekmesi korunur ve `?sekme=arkadaslar` ile açılır.
- **Şema:** 18 (`v.rehber`).

## v0.18.0

- **Yapan:** Claude (Opus 5.5), 17.10.2026
- **Neden:** Hakan (17.10, 01:04) kuyruğu: paketler + düzenleme modu, ücretsize günde 6–8 kişi sınırı (7 seçildi, düzenlenebilir), premium kilit (PIN/desen/parmak izi/yüz; kapsam).
- **Ne:**
  - `veri/paketler.js` (varsayılanlar) + `cekirdek/paketler.js`: `paketTanimlari()` (v.paketTanimlari üstüne yazar), `aktifPaket()`, `ozellikVar()`, `paketEtkinlestir()` (kaynak 'test'), `yeniKisiIzni/ilkMesajKontrolu/yeniKisiSay` (test.yeniKisiGunluk yalnız bugün). OZELLIKLER yalnız çalışanlar: uygulamaKilidi, ekosistemIndirimi (v0.20'de kullanılacak).
  - `kisi-eylemleri.yeniKisiOnayi(profil, b)`: mesaj (ilk mesaj), kişi sayfası ve Bağlan'daki el sallama bunu çağırır. El sallamaya da çevrimdışı test kişisi artık yanıt vermez.
  - `cekirdek/kilit.js`: tuzlu SHA-256 özet, `pinTuslari`, `desenAlani` (pointer + klavye), `kilitEkrani` (tam ekran, KATMAN değil → geri tuşuyla kapanmaz), WebAuthn platform doğrulayıcı (yalnız https), `kilitIzle` (visibilitychange + süre), `acikSay` (kurulumdan hemen sonra kilit gelmez). Yönlendirici: `kilitGerekli(id)` → kilit ekranı, açılınca aynı ekran.
  - ayarlar: `/paketler` ekranı ve "Uygulama kilidi" grubu (`moduller/ayarlar/paketler.js`); gizlilik grubunun simgesi `yedek` (kilit simgesi kilit grubunda; simgeler benzersiz).
- **Sunucu notu:** Paket doğrulaması, günlük sınır ve ödeme sunucuda yapılmalı; istemci sınırı aşılabilir.
- **Şema:** 17 (yeni alanlar isteğe bağlı: v.uyelik, v.paketTanimlari, profil.ayarlar.kilit, test.yeniKisiGunluk). **Durum:** `deneme`'de.

## v0.17.0

- **Yapan:** Claude (Opus 5.5), 17.10.2026
- **Neden:** Hakan (17.10, 01:04): Bağlan kart ışığı; favori, başa sabitleme, arkadaş ekleme, arkadaş güncellemeleri; arkadaş listesini kimin göreceği ve WhatsApp gibi karşılıklılık. Aynı mesajdaki diğer istekler kuyrukta: v0.18 paketler + günlük sınır + kilit, v0.19 bildirim kutusu/tur/yenilikler/hatırlatmalar/arama-ipucu-kılavuz-harita, v0.20 ikon paketleri + ekosistem + B1.
- **Ne:**
  - `cekirdek/arkadaslik.js`: durum (arkadas/gonderildi/gelen/yok), istek, kabul, ret, çıkar; favori; sabitleme (SABIT_SINIRI 3); `karsilikli()` = iki yönde izin (önce karşı taraf → neden 'o', sonra sen → 'benKimse'/'benArkadas'); `okunduGorunur`; `arkadasHaberleri()` (tercihlere göre); `mesajDurumu()`.
  - `veri/test-profiller.js` → `TEST_SOSYAL` (gizlilik, arkadaşlar, istekGonderir, haberler). Priya ve Yuna sana istek gönderir.
  - `test-modu.aktiflik()` son görülme gizliyse `{ gizli: true }` döner (çevrimiçi sekmesine de girmez); `aktiflikMetni` boş döner.
  - `cekirdek/kisi-eylemleri.js`: `kisiEylemleri()` alt penceresi, `basiliTut()`, `arkadaslikIstegi()` (etkin test kişisi 2,5 sn sonra kabul eder).
  - kesfet: "Arkadaşlar" sekmesi (`moduller/kesfet/arkadaslar.js`); sohbetler: favori/arkadaş süzgeci, sabitliler üstte; mesaj: ✓ tikleri, kişi alt çubuğunda arkadaşlık düğmesi, "Arkadaşları"; ayarlar: gizlilik ve haber tercihleri; gelisim/profil: Arkadaşlarım.
  - Ayarlar: `profil.ayarlar.gizlilik`, `profil.ayarlar.arkadasHaberleri` (yoksa varsayılan; göç gerekmedi). Test verisi: `test.arkadaslar, istekler, reddedilenIstekler, favoriler, sabitli, arkadaslikZamani`.
- **Sunucu notu:** Karşılıklılık ve görünürlük kuralları sunucuda da uygulanmalı (istemci kuralı tek başına gizlilik güvencesi değildir).
- **Şema:** 17. **Durum:** `deneme`'de.

## v0.16.0

- **Yapan:** Claude (Opus 5.5), 17.10.2026
- **Neden:** Hakan (17.10, 00:36): değerlendirmelerden (Gemini/Grok/ChatGPT) mimariye uyanlar + C1 içerik + topluluk kuralları (yanıtsız mesaj sınırı, karşılıklılıkla fotoğraf, gerçek engelleme, gecikmeli numara paylaşımı) + h–i önerisi ("gerisi sana katılıyorum").
- **Ne:**
  - `cekirdek/topluluk-kurallari.js` (saf işlevler; sunucuda da aynısı uygulanmalı): `mesajIzni` (YANITSIZ_SINIR 5, 7 gün), `fotoIzni` (karşılıklı 5), `iletisimIzni` (7 gün + karşılıklı 10), `iletisimBilgisiVar` (telefon ≥7 rakam, e-posta). mesaj ekranı bunları kullanır; `testYanitVerir` (sonAktifDk ≤ 30).
  - `test-modu`: `testProfili` engellileri süzer; `engellenenler`, `testEngelKaldir`, `testSohbetBaslangici` (sohbet `baslangic` alanı).
  - `depo`: `iceAktarHazirla` / `iceAktarUygula` (şablona göre doğrulama, `goc(ham, yedekle=false)`); ayarlar fotoğrafları yalnız hazırlık başarılıysa yazar.
  - `fotograf`: `tumBasvurular()` (verinin tamamında `mdy:`), yetim silme, tam medya yedeği. `main.js`: yazı alanı odaktayken yeniden çizim ertelenir.
  - `cekirdek/yan-menu.js`: `yanMenuAc(b)`, `benDugmesi(b)`; CSS `b-ymenu-*` bilesenler.css'te. Gezinme: `/gelisim` = "Gelişim" (ikon kupa). gelisim modülünde iki ekran: `gelisim` (ilerleme) ve `profil` (kimlik). Eski `?sekme=profil` → `/profil`.
  - `yonlendirici`: ortak odak tuzağı ve odağı geri verme.
  - Düzeltme: `AYIRAC` + although/though/whereas/while/unless/if; yeni kural `edat-kalibi`; `araclar/duzeltme-sinama.mjs` derlemede çalışır.
  - `hafiza`: `OGRENILDI_GUN = 2`, `basariGunleri`.
  - Telaffuz: düzenleme uzaklığıyla hizalama (tamam/eksik/farkli/fazla), `dinlemeyiDurdur`, Hafızaya ekle. `ses-hatti.tanimaDili()`.
  - 9 yeni senaryo (B2 ×4, C1 ×5); seviye seçicileri A1–C1.
  - kesfet: `ulkeKodu` (İngilizce ülke adı, eski kayıtlar `ulkeAnahtari` ile çevrilir), 60+, iki yönlü karşılıklı, Çevrimiçi/Yeni hızlı süzgeçten çıktı.
  - karsilama: misafir penceresinde ana dil seçimi; `ogrenilenDil = 'en'`, ana dil İngilizce ise rol `yardimci`.
  - `data-yazi="cokbuyuk"` (1.25).
- **Bilerek yapılmayanlar / kalanlar:** gerçek sunucu tarafı kural uygulaması (istemci kuralı aşılabilir), canlı yapay zekâ, gerçek hesap/mesajlaşma, moderasyon, çok kişili odalar; B1 içeriği hâlâ 2 senaryo; genel artikel kuralı (yanlış düzeltme riski); kaydırınca küçülen üst bant.
- **Şema:** 17. **Durum:** `deneme`'de; canlıya alma Hakan onayıyla.

## v0.15.0

- **Yapan:** Claude (Opus 5.5), 17.10.2026
- **Neden:** Hakan (16.10, 23:51): marka şeridi banda değsin ve sola dayalı; üst bant çizgisiz, hafif kabartma; kişi kartlarında renkli çizgi olmasın; Dil Anları'nda HelloTalk gibi 4'lü fotoğraf; Facebook gibi kapak görseli; hobiler kaydırmalı ve daha çok; süzgeçte daha sık bantlar ve açılır çok öğeli gruplar.
- **Ne:**
  - `bilesenler.css` v0.15.0 blokları: `.b-marka-serit` sola dayalı, `:has(+ .b-bas-bant)` ile banda değer; `.b-bas-bant` çizgisiz; `.b-ekran .b-liste-satir` renkli halkasız; `.b-kapak-1..6` (`--kapak` değişkeni); `.b-platform-sikisik`, `.b-katla` (details/summary, `.b-katla-sayi`).
  - `cekirdek/fotograf.js`: `dosyalarSec()`, `fotograflarEkle(sinir=9)` → `mdy:` referansları.
  - `test-modu.anPaylas(metin, fotolar)`; dil-anlari `fotoIzgarasi()` (`anl-fotolar-{1..4}`).
  - mesaj: `.msj-kapak` (sistem kapağı kişinin renginden), `.msj-hobiler` yatay şerit, ortak hobi vurgusu. gelisim: `.gls-kapak` + `kapakSec()` (6 sistem kapağı ya da kendi fotoğrafı; `profil.kapak`).
  - kesfet `suzgecPenceresi`: `katla(anahtar, …)` ülke ve ilgi grupları için; açık gruplar yeniden çizimde korunur.
- **Bekleyen (Hakan onayı):** h–i önerisi — profil fotoğrafı tüm ana sayfaların üst bandında solda, dokununca yan menü (Profilini gör, kısayollar, Ayarlar); sağ alt sekme "Gelişim" (Profil modülü ikiye bölünür: kimlik fotoğrafın arkasında, gelişim sekmede).
- **Şema:** 16. **Durum:** canlıda (PR #18, Hakan onayı: "Önceki sürümü de yayınla", 17.10.2026).
- **Değerlendirme (17.10, Gemini/Grok/ChatGPT 0.12.1 ve 0.14.0 raporları) — kodda doğrulanan açıklar, v0.16.0 adayı:**
  - `depo.iceAktar` yalnız `profil` nesnesine bakıyor: `{"semaSurumu":15,"profil":{}}` kabul edilir (ayarlar yok → ekranlar bozulur). Ayarlar'da `medyaIceAktar` doğrulamadan ÖNCE çalışıyor.
  - `test-modu.testProfili(kimlik)` engellileri süzmüyor (doğrudan `/kisi?k=` ve mesaj açılır).
  - Telaffuz `karsilastir` sözcük kümesi (sıra/tekrar/ek sözcük yok); `sus()` yalnız sentezi durdurur, tanıma ekrandan çıkışta sürer.
  - Düzeltme: "I work today although I was sick yesterday." → "worked" (yan cümle ayrımı yok).
  - `demo-koc` `sapma.konu` ölü dal (koşul hep `kendiSorusu`).
  - Bağlan: ülke süzgeci çevrilmiş adla saklanıyor (dil değişince kayboluyor); etkin yaş hapında "60+" yerine "60"; hızlı `karsilikli` tek yönlü (sekme iki yönlü).
  - Misafir girişinde İngilizce arayüz → anaDil 'en', öğrenilen 'tr' (Ayarlar'daki yalnız-İngilizce kuralıyla çelişir).
  - Karne adresi `?i=<sıra>`; kalıcı kimlik yok.

## v0.14.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan: "Dediklerine katılıyorum. Yapmadıklarını da kota bitmeden tamamla." (v0.13.0'daki "yapılmayanlar" listesi + Bağlan sadeleştirme önerim.)
- **Ne:**
  - Bağlan: üst sekmeler 4 (tum/uygun/cevrimici/yeni); `HIZLI_SUZGECLER` + ciddi, saat; `.kft-etkin-hap` adlı süzgeç hapları; `ayarlar.kesfetSecimi` ile kalıcı seçim (`secimiOku/secimiYaz`).
  - `test-modu.uyumDuzeyi(puan)` → cok/iyi/olasi; yüzde gösterimi kalktı (sohbet önerisi, eşleşme kartı, pano, kişi sayfası).
  - Yeni modül `moduller/telaffuz` (önek `tlf`): `/telaffuz`. Kaynak: senaryo ipucu cümleleri (seviye/tümü) ya da Hata Hafızası telaffuz öğeleri. Sözcük karşılaştırması sıra gözetmez ve puan değildir.
  - `ses-hatti.ingilizceSesler()`, `ayarlar.kocSesi`; `soyle` seçili sesi ve dilini kullanır.
  - `demo-koc`: karşı soru (`?` ile biten, dal/düzeltme yok) → `kocDili.sapma.soru` + aynı adım, adım başına bir kez. Konu dışı tahmini bilerek yok.
  - Senaryo satırı: `~(adım+2) dk` ve `gorev.aciklama` başarı ölçütü olarak.
  - `cekirdek/fotograf.js`: IndexedDB `helloworld-medya/foto`; profilde `mdy:<id>`; `medyaHazirla()` arka planda (ekranlar beklemez; fotoğraf yüklenince açık ekran bir kez yeniden çizilir — dosyadan açılışta IndexedDB geç yanıt verebildiği için; karşılaştırma aracı bu gecikmeyi yakaladı); `fotoAdresi(ref)`; yedekte `medya` alanı; `medyaSil()`.
  - Yazı ölçeği: tüm `font-size: Npx` → `calc(Npx * var(--yazi-olcek))`; `data-yazi="buyuk"` → 1.12; zoom kaldırıldı. Yeni CSS'te de bu biçim kullanılmalı.
  - Koyu tema: `tema-koyu.css` yalnız `[data-tema="koyu"]`; `tema.js` sistem temasını matchMedia ile çözer; `index.html` başında erken tema betiği.
  - `araclar/davranis-sinama.py` (isteğe bağlı, Playwright).
- **Hâlâ yapılmayan (arka uç/sağlayıcı kararı):** canlı yapay zekâ, gerçek hesap/mesajlaşma, sunucu tarafı engelle/şikâyet/moderasyon, çok kişili odalar.
- **Şema:** 15. **Durum:** canlıda (PR #17, Hakan onayı, 16.10.2026).

## v0.13.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan üç dış değerlendirmeyi (ChatGPT, Gemini, Grok; v0.12.1 tek dosyası üzerinden) paylaştı: "Mimari ve vizyonumuza uyanları uyarla, yapıp yapmadıklarını listele."
- **Yapılanlar:**
  - Veri: `depo.sifirla` kk:veri + kk:yedek + kk:bozuk siler; `degistir` yazma başarısızsa `depo:yazilamadi` yayınlar (main.js dakikada en çok bir uyarı); `yukle` bozuk JSON'u kk:bozuk'a saklar ve duyurur; `iceAktar(metin)` doğrulamalı geri yükleme (Ayarlar › Gizlilik).
  - Düzeltme motoru: `gecmis-zaman` present perfect / since / ever / never / already / just içeren yan cümleye dokunmaz; yeni kurallar `yas-kalibi`, `sayilamaz` (+ tekrar soruları, tr/en açıklama). `koc-dili.genelOvgu` nötr onay.
  - Bağlan: `suzgecPenceresi(..., say)` sayıyı `suz(testProfilleri(), durum, f)` ile hesaplar; modül düzeyi `kayitli` durum/süzgeç; boş sonuçta "Süzgeçleri temizle".
  - Yönlendirici: adres başına kaydırma konumu; geri dönüşte geri yüklenir.
  - Sohbet: `okunduIsaretle`/`okunmamis` (test.okundu), okunmamış noktası; geçmiş görüşme → `/karne?i=N` (karne `b.p.i` destekler).
  - Ayarlar: öğrenilen dil yalnız `en` (diğerleri disabled "yakında"); Görünüm'de `details.ayr-gelismis`, "Görünümü varsayılana döndür", `ozelIsaretle()`.
  - Alt menü: `etiketleriYenile()` (dil değişimi + orta düğme atanan işin kısa adı); `ortaIpucuGoster` ilk iki açılış.
  - Hata Hafızası metin araması; duyuru süresi metin uzunluğuna göre; en.js çift virgül.
- **Yapılmayanlar ve nedeni:**
  - Bağlan sekmelerini 4'e indirmek, cinsiyeti üstten kaldırmak, marka şeridi ya da bandı kaldırmak, renk paketlerini dondurmak (Grok/ChatGPT) — Hakan bunları bu gün açıkça istedi; Hakan'ın kararı olmadan geri alınmadı. Öneri olarak Hakan'a sunuldu.
  - IndexedDB'ye fotoğraf taşıma, `zoom` yerine rem ölçek, koyu tema CSS tekrarını azaltma, kaydırınca küçülen üst bant — doğru ama geniş kapsamlı; ayrı sürümde.
  - Canlı yapay zekâ, serbest konuşma/sapma dalları, bağımsız telaffuz akışı, senaryoya amaç/süre/başarı ölçütü alanları, koç ses seçimi — ürün yol haritası (arka uç + sağlayıcı kararı bekliyor).
  - Gerçek hesap, mesajlaşma, moderasyon, sunucu tarafı engelle/şikâyet — arka uç kararı bekliyor (Supabase/Firebase).
  - "N süzgeç etkin" şeridinde süzgeç adlarının tek tek gösterilmesi, eşleşme yüzdesini kaldırma — küçük; sonraki tur.
  - Dört durum sözleşmesinin davranış testleri — robot genişletmesi gerekir; sonraki tur.
- **Şema:** 14 (`ayarlar.ortaIpucu`, `test.okundu`).
- **Durum:** `deneme` dalında; canlıya alma Hakan onayıyla.

## v0.12.2

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan: "Yayına al, ismi de helloworld." Platformun kalıcı adı kararı verildi.
- **Ne:** `metinler` `uygulama.ad` = 'helloworld' (tr + en), davet metni, `index.html` `<title>`, `genel/manifest.webmanifest` name/short_name; marka şeridi büyük harfe çevirmez (ad Hakan'ın yazdığı gibi küçük harf). Derleme çıktı dosya adı (`teslim/KonusmaKocu-v*.html`) karşılaştırma aracıyla uyum için değişmedi.
- **Şema:** değişmedi (13). **Durum:** v0.12.0 + v0.12.1 + v0.12.2 canlıya (Hakan onayı).

## v0.12.1

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan (ekran görüntüsü + HelloTalk ekran kaydı): üst barın hatları solda-sağda kayboluyor, üstten de belli olmalı; en üstte ince marka bölümü (simge + uygulama adı); Sohbet'te kişi blokları Bağlan'daki gibi geniş; videodaki kaydırılan süzgeçlerden işlevsel olup bizde eksik olanları ekle.
- **Videodaki HelloTalk süzgeçleri:** Bağla: Tüm, Ciddi Öğrenenler, Yakında, Şehir, Cinsiyet, Ücretli Pratik · Dil Sohbetleri: Yakın Zaman Dilimi, dile göre · Dil Anları: Güncel, Senin için, Yardım et, Yakında, Selfie, Takip, Öğren, Ses, Sınıf arkadaşları. Eklenmeyenler: Şehir/Yakında (konum tutmuyoruz → Yakın saat dilimi), Ücretli pratik (ödeme yok), Ses ve Selfie (sesli/fotoğraflı gönderi verisi yok).
- **Ne:** `test-modu.js` `saatFarki(p)`, `YAKIN_SAAT_FARKI = 3`; kesfet/sohbetler/dil-anlari süzgeçleri; `arayuz.js` `markaSeridi()` — yönlendirici `.b-ekran-gezinmeli` ekranlara ekler; `bilesenler.css` v0.12.1 (bant ayrık kart + tam çerçeve); `sohbetler` `.shb-kisi` geniş kart.
- **Şema:** değişmedi (13). **Durum:** `deneme` dalında (v0.12.0 ile birlikte); canlıya alma Hakan onayıyla.

## v0.12.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan: şikâyet penceresi Vazgeç dışında boş alana dokununca da kapansın; Ayarlar'da renk geçişine uyumlu hazır tasarım paketleri; English Prime'daki gibi akıllı renk eşleşmesi — her sayfa içeriğiyle bilişsel eşleşen tonlar, kullanıcı menüye bakmadan sayfayı anlasın; yapay zekâ ve farklı ortamlar için daha çok senaryo kategorisi.
- **Ne:**
  - `yonlendirici.js`: `.b-perde` boş alanına dokunma → `katmanKapat` (Esc, sonra `[data-vazgec]` ya da `.b-dugme-cerceve`). Vazgeç düğmelerine `data-vazgec` eklendi (mesaj, dil-anlari).
  - Sayfa renk eşlemesi: Sohbet/mesaj = `--renk-sayfa-yesil`, Bağlan/kişi = `--renk-sayfa-mavi` (yer değişti), Pratik kırmızı, Dil Anları amber, Profil/Ayarlar mor. `bilesenler.css` v0.12.0: `.b-ekran` üstte sayfa renginde ışık; `data-bant="sayfa"` bant çizgisi ve başlık sayfa tonunda.
  - `ayarlar/index.js` `TASARIM_PAKETLERI` + `paketSecici`; tek ayar değişince `tasarimPaketi = 'ozel'`.
  - Senaryolar: 9 yeni dosya (`veri/senaryolar/*.js`), `alanlar.js` + teknoloji, egitim, resmi. Anayasa bölüm 2'deki "6 alan" Hakan isteğiyle 9'a çıktı (Anayasa metni sonraki turda güncellenmeli). Güvenlik düzeltmesi: geri tuşu ya da boş alana dokunma artık yalnız `[data-vazgec]` düğmesine basar; şikâyet penceresinde ilk nedeni ("Taciz") seçme riski giderildi (v0.11.x'te geri tuşu şikâyet penceresinde ilk ikincil düğmeye basabiliyordu). Onay ve mikrofon izni pencerelerinde de `data-vazgec` var.
  - `bugun/index.js`: ODALAR tüm senaryolardan üretilir, alan hapı ile süzülür (`odalar.kategori`).
- **Şema:** 13 (`ayarlar.tasarimPaketi = 'akilli'`; `bantRengi` 'yesil' ise 'sayfa'ya geçer).
- **Durum:** `deneme` dalında; canlıya alma Hakan onayıyla.

## v0.11.3

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan (canlı v0.11.2 ekran görüntüsü): "Alanı sıkışma yaratmadan maksimum daralt; aşağıda ve solda bölümün hatları kaybolmamalı"; sohbet satırlarında "Hatları görünsün, sağda-solda kaybolmasın".
- **Ne:** `bilesenler.css` v0.11.3 bloğu: bant alt boşluğu 4 px, simge 38 px, yazı 11 px, tutamak negatif boşluklu; bant `border` (altın %38, üst hariç); kart/satır çerçevesi `color-mix(--sayfa 38%, --renk-cizgi-guclu)`; `kesfet.css` kişi kartı aynı çerçeve. Profil terim düzeni (v0.11.0'da kuruldu) tamamlandı: başka kişinin sayfasındaki sekme `ht.profilSekme` = "Hakkında". Kural: "Profil" yalnız alt menü sekmesi ve kişi sayfası başlığıdır; görüntüleme Profil'de, düzenleme Ayarlar › Kişisel bilgiler'de; yan menü ve Ayarlar kartı yalnız "Profilini gör" kısayoludur.
- **Şema:** değişmedi (12). **Durum:** canlıya (Hakan'ın bu turdaki istekleri canlı sürüm üzerinden).

## v0.11.2

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan: "Tekrar dikkat et ekran resmi ve videosuna. Unuttukların var." Kayıt tam çözünürlükte yeniden incelendi. Kalanlar: Bağlan'daki şeritler (Otomatik eşleş, ilgi daveti, TEST notu) "Güvenli pratik" slaytı örneğindeki gibi koyu renk geçişli ve kabartmalı; kişi kartları kabartmalı; seçili/dokunulan öğe ışıklı; Pratik hızlı oda daha kompakt; Dil Anları gönderi arası boşluk belirgin.
- **Ne:** `kesfet.css`, `bugun.css`, `anlar.css` v0.11.2 ekleri; `bilesenler.css` dokunma ışığı (`.b-liste-satir:active/:focus-visible`).
- **Şema:** değişmedi (12). **Durum:** canlıya (Hakan "yayına al" onayı bu tur için de geçerli: önceki istek "Yayına al ve şunu da incele").

## v0.11.1

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan v0.10.0 üzerinde notlu ekran kaydı + v0.11.0 ekran görüntüsü ("buraya daralt"). Kayıttaki notların bir kısmı v0.11.0'da zaten yapılmıştı (simgeler zeminde, kabartmalı süzgeç, yan menü sürükleyerek kapanma, Profil/Ayarlar adları). Kalanlar: Sohbet bandını daralt; sohbet satırları arası boşluk + daha koyu geçiş; seçili öğe ışıklı; Bağlan/Dil Anları panoları siyah ya da çok koyu sayfa rengi (Güvenli pratik slaytı örnek); Pratik konu odaları daha kompakt, günün döngüsünde biraz boşluk; Dil Anları gönderi ayrımı belirgin; şikâyet penceresi temaya uygun zemin; Profil'de simgeler doğrudan zeminde.
- **Ne:** `bilesenler.css` v0.11.1 bloğu; `bugun.css`, `anlar.css` ekleri; `gls-merkez` → `b-platform`; koyu kart jetonları koyulaştı.
- **Şema:** değişmedi (12). **Durum:** Hakan "yayına al" dedi → v0.9.1–v0.11.1 birlikte canlıya.

## v0.11.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan (v0.10.0 sonrası): Sohbet'in üst öğeleri doğrudan zemine otursun (ayrı kutuda değil); bant siyaha yakın yeşil; yan menü dışa sürükleyince kapansın; koyu temada sohbet satırları koyu ve zeminden ayrışsın, yüzeyler tek ton olmasın (yer yer gölge, yer yer ışık); alt menü siyah + yer yer turkuaz (yan menüdeki "siyah zeminde turkuaz" ve "koçla 5 dk konuş" geçişini övdü); Bağlan ve Dil Anları'nda üst bant aşağısına göre çok koyu; tüm sayfalarda süzgeçler kabartmalı; yatay kartlarda renk ve koyuluk geçişi; Pratik oku daha büyük ve ortada; "Profil" adının üç farklı yerde üç farklı şey olması tutarsız; Bağlan'da süzgeç açıkken geri tuşu alttaki sayfaya uygulanıyor. Pratik'e dokunulmadı.
- **Ne:**
  - `jetonlar.css`: bant renkleri siyaha yakın; `--renk-gezinme-*` (siyah + turkuaz, her temada aynı); `--renk-kart-ust/-alt/-parilti/-alt-golge` (kart geçişi; koyu değerler `tema-koyu.css` iki blokta); bant içinde kart jetonları yeniden tanımlı.
  - `bilesenler.css` v0.11.0 bloğu: kart/satır/platform geçişi; süzgeç tepsisi gömük, `.b-sekme` kabartmalı (klasik seçili = altın kabartma, dolu = sayfa rengi, çizgi düz, çerçeve, beyaz); alt menü siyah-turkuaz, seçili gösterge turkuaz; orta ok büyük, `translateX(4px)` ile optik orta.
  - Sohbet: kısayollar bantta kutusuz (`.b-bas-bant .b-platform` saydam); yan menü sola sürükleyince kapanır (eşik 70 px); yan menü üstü = "Profilini gör" düğmesi.
  - Profil tutarlılığı: alt menü "Profil" tek görüntüleme yeri (içindeki sekme "Hakkımda"); Ayarlar'da grup adı "Kişisel bilgiler" (düzenleme yeri), kartta "Profilini gör"; Profil'deki kimlik satırı → `/ayarlar?grup=profil`.
  - `yonlendirici.js` katman geçmişi: `.b-alt-pencere-perde, .b-katman, .b-perde` açılınca aynı adresle `history.pushState({ katman })`; geri tuşu (popstate) en üstteki katmanı kapatır (Esc gönderir; dinlemiyorsa `.b-dugme-cerceve`'ye basar ya da kaldırır). Katman kendi düğmesiyle kapanınca kayıt `history.go(-n)` ile sessizce geri alınır; kapanıp başka sayfaya gidildiyse arta kalan kayıt popstate'te atlanır.
- **Kural:** Yeni üstten açılan pencere bu üç sınıftan birini taşısın ve Esc ile kapansın; geri tuşu kendiliğinden çalışır, modülde history kullanma (Y21).
- **Karşılaştırma:** `python3 araclar/karsilastir.py 0.10.0 0.11.0` — kaybolan öğe yok (yalnız ad değişiklikleri: Profil sekmesi → Hakkımda).
- **Şema:** değişmedi (12).
- **Durum:** `deneme` dalında; canlıya alma Hakan onayıyla.

## v0.10.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan: "Sohbet sayfasında kayıp öğeler var, eskisini karşılaştır; bir şey yaparken önceki ile de karşılaştır. Alt menü yine aşağı kayıyor." Sohbet'in ilk yatay bölümü, Bağlan'ın ve Dil Anları'nın ilk iki yatay öğesi çok koyu (sayfa onların altından başlasın, "kâğıdın en üstünden başlayan dilekçe" gibi olmasın); arama kutularının içi siyah; "Bağlantı" → "Bağlan"; süzgeç renkleri için tasarım seçenekleri; Dil Anları'nda süzgeçlerden sonra kayan pano (tanıtım, öneri, en çok paylaşan, en çok etkileşim); Bağlan'da kayan bilgilendirme zemini. Pratik'e dokunulmadı.
- **Karşılaştırma (yeni kural):** Sohbet v0.4.0 → v0.9.2 ekran ekran karşılaştırıldı (`araclar/karsilastir.py`). Kaybolanlar: sol üstteki profil fotoğrafı (v0.7.0'da ☰ ile değişmişti) ve ilk satırdaki 5. kısayol "Dil Anları" (v0.7.0'da "Daha fazla" sütunu yer kaplıyordu). İkisi geri getirildi; yeni öğeler (yan menü, genişleyen ızgara) korundu.
- **Kök neden (alt menü):** v0.9.1'de `#uygulama { position: fixed; inset: 0 }` ekranı tam dolduran bir kaydırıcıydı; Android Chrome bunu "örtük kök kaydırıcı" yapıp kaydırırken adres/araç çubuğunu gizleyip açıyor, görüntü alanı değişince sabit menü aşağı kayıp geri geliyordu. Çözüm: `#uygulama` ekranı tam doldurmuyor — alt menü görünürken `bottom: var(--gezinme-alan)` (menü yüksekliği ResizeObserver ile ölçülür), değilken `bottom: 1px`. Yan etkisi olumlu: son liste öğesi artık menünün altında kalmıyor; `.b-ekran-gezinmeli` büyük alt boşluğu kalktı.
- **Ne:** `arayuz.js` `basBant()` (koyu baş bandı), `afisKaydirici(..., { pano: true })` + slaytta `test: true` (TEST rozeti) ve `gorsel`; `jetonlar.css` bant renkleri (`--renk-bant-*`, `data-bant`), bant içi jeton yeniden tanımı (`.b-bas-bant`), siyah arama jetonları, beyaz süzgeç jetonları; `bilesenler.css` v0.10.0 bloğu (bant, arama, `data-suzgec` biçimleri, pano, tutamak); `tema.js` `data-bant`, `data-suzgec`; Sohbet/Bağlan/Dil Anları üst düzeni; Ayarlar › Görünüm: Üst bant rengi, Süzgeç biçimi.
- **Şema:** 12 (ayarlar.bantRengi = 'yesil', ayarlar.suzgecBicimi = 'klasik').
- **Kural:** Ekranı tam dolduran yeni bir kaydırıcı (`position: fixed; inset: 0; overflow: auto`) ekleme — Android Chrome kök kaydırıcı yapar. Bir ekranı değiştirince `araclar/karsilastir.py` ile önceki sürümle yan yana bak; kaybolan öğe varsa bilerek kaldırılmış olmalı ve DEVIR'de yazmalı.
- **Durum:** `deneme` dalında; canlıya alma Hakan onayıyla.

## v0.9.2

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan bir alt menü örneği gösterdi (yüzen çubuk, ortada kalın siyah çerçeveli altın daire içinde ▶ BAŞLA, seçili öğe mor kutu): "Öğeyi de buna benzet."
- **Ne:** `bilesenler.css` v0.9.2 bloğu: `.b-gezinme-ic` yüzen yuvarlak çubuk, `.b-gezinme-isik::before` seçim rengi karışımlı kutu + alt çizgi, `.b-orta-daire` 76 px altın daire (6 px koyu çerçeve), `.b-orta-oynat` CSS üçgeni; `arayuz.js` orta öğe içeriği (▶ + ad dairenin içinde).
- **Şema:** değişmedi (11).
- **Durum:** `deneme` dalında; canlıya alma Hakan onayıyla.

## v0.9.1

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan ekran kaydıyla: "Alt menüde ortaya geçiş yaparken halen alt öğe aşağı kayıp kaybolup gidiyor, sonra yine geliyor." Kayıtta menü geçişte ~0,25 sn ekran dışına iniyordu.
- **Kök neden:** Yönlendirici her geçişte `window.scrollTo(0, 0)` yapıyordu; Android Chrome'da bu, gizlenmiş adres çubuğunu geri açıp görüntü alanını yeniden boyutlandırıyor ve `position: fixed; bottom: 0` menüyü bir kare aşağıda çiziyordu.
- **Ne:** `temel.css`: `html, body { height: 100%; overflow: hidden }`, `#uygulama { position: fixed; inset: 0; overflow-y: auto }` — belge kaymaz, kaydırma #uygulama içinde. `arayuz.js` `kaydirmaAlani()`, `enUsteKaydir()`, `enAltaKaydir()`; yönlendirici `kok.scrollTo(0, 0)`. Pencere açıkken `:root:has(perde) #uygulama { overflow: hidden }`.
- **Kural:** Yeni kodda `window.scrollTo`/`document.body.scrollHeight` kullanma; `enUsteKaydir()` / `enAltaKaydir()` ya da `kaydirmaAlani()` kullan.
- **Şema:** değişmedi (11).
- **Durum:** `deneme` dalında; canlıya alma Hakan onayıyla.

## v0.9.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan: alt menüde seçili öğenin üstünde gezinen ışıklı kare; Pratik ortada büyük (Yoldaş Akıllı Asistan gibi), seçilince çerçevesi seçim rengi, basılı tutunca atama/hızlı işlem seçenekleri (AI telefon araması, senaryo, telaffuz); üstten açılan sayfalarda kaydırırken alt öğe kaymasın (kural); alt menü kaydırırken kaybolup gelmesin; sekmelere Google renk anlamları; ayarlardan zemin ve seçim rengi; profil ayarlarında geri tuşu bir adım gelsin.
- **Ne:** `arayuz.js`: alt menü `gezinmeKur()` ile body'de tek kez kurulur (`altGezinme()` artık durumu günceller, `null` döner; yönlendirici her ekranda önce `gezinmeGizle()`), `.b-gezinme-isik` (`--i` ile konum, `gostergeKaydir/Sifirla` canlı izleme), orta düğme `b-gezinme-orta` (uzun basış 480 ms → `ortaMenuAc()`), `ortaDugmeAyarla({ eylemler, atamaKaydet })` main.js'te. Sekme sırası: sohbetler, kesfet, bugun (orta), dil-anlari, gelisim. Neden kalıcı: ekran canlandırması `transform` kullandığı için ekran içindeki `position: fixed` menü onunla birlikte kayıyordu.
- **Kural (pencereler):** Üstten açılan her pencere `.b-alt-pencere-perde`, `.b-perde` ya da `.b-katman` sınıfını taşımalı; `:root:has(...) body { overflow: hidden }` arka sayfayı ve alt menüyü kilitler, iç kaydırma `overscroll-behavior: contain`.
- **Renkler:** `--renk-sayfa-{mavi,yesil,kirmizi,sari,mor}` (açık/koyu), `.b-ekran[data-ekran]` → `--sayfa`; kart/platform/sekme/başlık `color-mix` ile. Seçim rengi `:root[data-secim]`, zemin `:root[data-zemin]` (jetonlar.css + tema-koyu.css, koyu tema iki seçiciyle). `tema.js` öznitelikleri yazar.
- **Geri:** Ayarlar grupları artık `/ayarlar?grup=` geçmiş kaydıdır; başlıktaki geri ve telefonun geri tuşu bir adım geri gider.
- **Şema:** göç 11 (`secimRengi`, `zemin`, `ortaDugme`), GUNCEL_SEMA 11.
- **Durum:** Canlıda (PR #12, Hakan onayı, 16.10.2026).

## v0.8.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan (HelloTalk ekran kaydı ve görüntüleriyle): Pratik'in en üstünde sağa sola kayan resimli tanıtımlar; ana sayfada menüler arasında kaydırarak geçiş; Ses · Canlı · Öğren yerine 1 AI sohbet · 2 Gerçek sohbet · 3 Öğren.
- **Ne:** `arayuz.js` `afisKaydirici()` (scroll-snap, kendiliğinden ilerleme, noktalar, dokununca durur) ve `sekmeKaydirmaBaslat(git)` (main.js'te çağrılır; `[data-yatay]`, `.b-sekmeler`, `.b-uygulamalar`, `.b-aralik`, girdiler ve pencereler hariç; `data-gecis` ile canlandırma); `.b-kart-sirasi`; `bugun` sekmeleri `ai/gercek/ogren` (`data-psekme`), Gerçek sohbet ızgarası (test profilleri, `aktiflik`), Öğren kart sıraları (`veri/senaryolar`), eski büyük afiş kartı kaldırıldı (yerine kayan afişler).
- **Şema:** değişmedi (10).
- **Durum:** Canlıda (PR #11, Hakan onayı, 16.10.2026).

## v0.7.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan HelloTalk ekranlarını (yan menü, genişleyen ızgara, Ses odaları, Ben, Ayarlar, Filtre) emsal gösterdi: daha modern, en az kaydırma ve tıklama, renk uyumu, sade, kategorili ve gruplu tasarım.
- **Ne:** `ayarlar` kategori menüsü (grupları gizle/göster; `?grup=` ve `?bolum=ilgi` derin bağlantı); `arayuz.js` `aralikKaydirici()` (ikili range); `erisim.css` son katmanda `[hidden] { display: none; }`; `kesfet` süzgeç durumu `yas:[min,max]`, `seviye:[i,j]`; `sohbetler` `yanMenu()` + genişleyen `HIZLI` (modül değişkeni `hizliAcik`); `bugun` konu odaları (`ODALAR` → senaryo kimlikleri), sekmeler (`data-psekme`); `gelisim` Profil/Gelişim sekmeleri (`data-sekme`, `?sekme=`), puanlar, davet.
- **Şema:** değişmedi (10).
- **Durum:** Canlıda (PR #9, Hakan onayı, 16.10.2026).

## v0.6.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan: iki sekmeli (sık kullanılan + detaylı) ve HelloTalk'tan iyi kişi süzgeci; üst süzgeçler kabartmalı platformda; ilgi alanları ve benzerleri English Prime gibi simetrik platformda; telefondan profile resim; karne açıklaması kartın sağ altında gri etiket; rakiplerin kritik özelliklerinden uyarlama; devir notuyla canlıya al.
- **Ne:** `bilesenler.css` `.b-platform`, `.b-karolar/.b-karo`, `.b-alt-pencere*`, `.b-sekmeler` platform görünümü; `kesfet` `suzgecPenceresi()` + `suzgecUygula()` (state: hizli/yas/cinsiyet/anaDil/ogrDil/seviyeler/ulkeler/ilgiler); `cekirdek/fotograf.js` (seç → canvas ile 480px JPEG, ≤220KB, en çok 6); `arayuz.js` `benAvatar()`; `cekirdek/cumle-defteri.js`; mesaj ve Dil Anları'nda sesli dinle (`soyle`) + yer imi; Ben ekranında Fotoğraflarım, Cümle defterim, karne etiketi.
- **Şema:** göç 10 (`profil.foto`, `profil.fotograflar`, `kayitliCumleler`), GUNCEL_SEMA 10.
- **Gizlilik:** Fotoğraflar sunucuya gitmez; yalnız cihazda, küçültülmüş. Sesli dinleme cihazın kendi sentezi (ağ yok, kayıt yok — Y12 ile uyumlu).
- **Durum:** Canlıda (PR #7, Hakan onayı, 16.10.2026).

## v0.5.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan'ın el yazısı listesi: misafir girişi · güzel logo · bağlantı/sohbetlerde kişiler arasında boşluk · kompakt topluluk kuralları · daha kapsamlı, kompakt ve sıcak Ayarlar · başlıkta hızlı yanıt önerileri · HelloTalk'tan daha sade kişi sayfası.
- **Ne:** `karsilama` misafirGirisi() (onayIste ile 18+ ve kural onayı; varsayılan dil/seviye; `profil.misafir`); `arayuz.js` `logo()` (jeton renkli SVG) ve `kurallarSeridi()`; `genel/simge.svg` yeni logo; `.b-liste-satir` ve `.kft-satir` ayrı kart; `veri/hizli-yanitlar.js` + mesaj başlığında yapışkan öneri şeridi (eski alt konu satırı kaldırıldı); `ayarlar` baştan yazıldı (gruplar, bölümlü seçim, anahtar, açılır alanlar); `tema.js` `data-yazi`; kişi sayfası yeni düzen.
- **Şema:** göç 9 (`profil.misafir`, `ayarlar.yaziBoyutu = 'normal'`, `ayarlar.gonderimOneri = true`), GUNCEL_SEMA 9.
- **Durum:** Canlıda (PR #6, Hakan onayı, 16.10.2026).

## v0.4.1

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** v0.4.0 devir notundaki sıradaki adım: kullanıcının kendi ilgi alanları, eşleşmede ortak ilgi.
- **Ne:** `veri/ilgi-alanlari.js` (26 ilgi, `ILGI_SINIRI = 8`, `ilgiKimligi` test profillerinin {tr,en} ilgilerini kataloğa bağlar); göç 8 (`profil.ilgiler = []`, GUNCEL_SEMA 8); test-modu.js `ortakIlgiler`, `eslesme()` artık `ortak` döndürür ve `ilgi` nedeni ekler; Ayarlar'da ilgi seçici (`/ayarlar?bolum=ilgi` doğrudan kaydırır); Bağlantı satırında ♥ ortak ilgi; kişi profilinde ortak hobi vurgusu; Ben ekranında ilgi kartı. `duyur()` aynı metni yığmaz (önceki kopyayı kaldırır).
- **Durum:** `deneme` dalında; canlı (main) yalnız Hakan "canlıya al" derse.

## v0.4.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan HelloTalk ekran görüntüleriyle: "Butonlar, öğeler çok büyük, kompakt değil; sayfa çok kaydırılıyor; profil detaylarında çevrimiçi bilgi, yaş, ülke, otomatik eşleşme eksik. HelloTalk'ı araştır, daha mantıklı ve kullanıcı dostu birleştir."
- **Ne:** Çekirdek: `htUst`, `htIkon`, `sekmeler`, `dilCifti`, `seviyeNoktalari` (arayuz.js); `test-gorunum.js` (yaş rozeti, etkinlik metni, rozetler); test-modu.js: `takipte/takipDegistir/takipSayisi`, `selamVer/selamVerildi`, `aktiflik`, `yerelSaat`, `eslesme` + `enIyiEslesmeler` (kural tabanlı uyum puanı, nedenleriyle), hazır TEST yorumları. Yönlendiricideki ortak üst şerit kaldırıldı; `ustBaslik({ ikon })` artık ince çubuk çizer.
- **Ekranlar:** sohbetler, kesfet, dil-anlari, bugun, gelisim, mesaj (kişi profili + sohbet başlığı) yeniden düzenlendi; ayarlar kutuları 3 sütun.
- **Veri:** 10 test profili; yeni alanlar `kullanici, yas, cinsiyet, saatDilimi, sonAktifDk, katildiGun, meslek, gezilecek, rozetler`. `v.test` içine `takip`, `selamlar` (varsayılanla birleşir, göç gerekmedi).
- **Dürüstlük:** Çevrimiçi/yaş/rozet yalnız TEST profillerinde ve "test verisidir" notuyla; beğeni sayısı uydurulmaz. Sekmeler 48px dokunma alanını korur (Y13).
- **Durum:** `deneme` dalında; canlı (main) yalnız Hakan "canlıya al" derse.

## v0.3.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan: "Ne English Prime gibi tasarım var ne de HelloTalk gibi içerik, resimler, menü, ayarlar var. Zemin rengi, ikonlar."
- **Ne:** `kaynak/veri/ikon3d.js` (EP 3B ikonları, webp data URI) + `ikon3d(ad, boyut)` yardımcı; `ustBaslik({ ikon })` EP başlığı; EP jetonları (zemin, mücevher yüzey, `--renk-baslik`, `--renk-kutu-1..6`, ten/saç jetonları); `.b-kutu`, `.b-menu`, `.b-gorsel`, çizim avatar (`testAvatar` profil `ten/sac/sacTip/bayrak` alanlarıyla SVG çizer).
- **Ekranlar:** Pratik kutuları, Profil menüsü, Ayarlar grup kutuları, Dil Anları gönderi görselleri, test profillerine bayrak.
- **Kurallar:** Renkler yalnız jetonlarda (Y3), kontrast geçti (Y14), yeni metinler tr+en (Y25). Göç gerekmedi (yeni kayıt alanı yok).
- **Durum:** `deneme` dalında; canlı (main) yalnız Hakan "canlıya al" derse.

## v0.2.9 — 16.10.2026 · English Prime görünümü ve HelloTalk öğeleri

- **Yapan:** Claude (Opus 5.5), Hakan'ın isteği ("mimari ve görünüm English Prime'dan, HelloTalk öğeleri sanal kullanıcılarla")
- **Ne yapıldı:** Jetonlar EP paletine geçti (koyu mat #0B0C10 / yüzey #1B1D24, altın vurgu #E0B03C; açık tema eşleniği) + yeni jetonlar (`--renk-yuzey-ust`, `--renk-kabartma-isik`, `--renk-vurgu-parlak`, `--renk-grup-1..5`). `bilesenler.css`: kabartmalı kart/düğme/girdi, yüzen alt menü ve altın etkin sekme, bölüm renkli üst etiket, `b-av` avatarları. Dil Anları akışı (test), Bağlantı süzgeç + kişi satırı, Mesaj modülüne `kisi` ekranı, `testAvatar()` ve `goreliZaman()` ortak yardımcıları, `veri/test-profiller.js`'e TEST_ANLARI ve yorum kalıpları, `diller.ja`.
- **Anayasa uyumu:** Sanal kullanıcılar TEST rozetli, çevrimiçi durumu yok, sayılar uydurulmaz (yalnız kendi etkileşimin). Renkler yalnız jetonlardan (Y3), kontrast AA (Y14).
- **Sınama:** `npm run build` 0 ihlal, robot 8/8. Başsız Chromium 360 px, koyu ve açık tema: davetle test modunu aç → akış 6 gönderi → beğen/düzelt/yorum kaydı → paylaş → otomatik yorum → Bağlantı 4 süzgeç → kişi profili → mesaj; taşma 0, sayfa hatası 0.
- **Dokunulan dosyalar:** stiller/{jetonlar,tema-koyu,bilesenler}.css, cekirdek/{arayuz,test-modu,surum}.js, veri/test-profiller.js, moduller/{dil-anlari,kesfet,mesaj}/*, metinler/{tr,en}.js, package.json, DEGISIKLIKLER.md, DEVIR.md

## v0.2.8 — 16.10.2026 · Test modu

- **Yapan:** Claude (Opus 5.5), Hakan'ın isteği ("sahte profillerle sohbet denemesi")
- **Ne yapıldı:** Ayarlar'da varsayılan kapalı **Test modu** (sürüm satırına 5 dokunuşla görünür). Açıkken Bağlantı'da 6 TEST rozetli profil (`veri/test-profiller.js`), yeni **Mesaj** modülü (`moduller/mesaj`, önek `msj`): yazılı mesaj, gönderim öncesi düzeltme önerisi (yerel kurallar), partner düzeltmesi, konu önerisi, şikâyet (4 neden) ve engelleme. Sohbetler › İnsanlar'da test sohbetleri. Ortak `testEtiketi()` bileşeni. Şema 6 → 7 (`test` alanı).
- **Anayasa uyumu:** Test profilleri her yerde TEST rozetli, çevrimiçi durumu uydurulmaz, gerçek fotoğraf yok. Yanıtlar kalıptır ve "Otomatik test yanıtı" diye etiketlenir (yapay zekâ değil, insan gibi sunulmaz). Test verisi `v.test` alanında; gelişim, seviye ve Hata Hafızası'na yazılmaz (sınandı). Ses kaydı yok (Y12).
- **Sınama:** `npm run build` denetçi 0 ihlal; robot 8/8; başsız Chromium 360 px uçtan uca: test modu kapalıyken hiçbir test kartı yok → 5 dokunuş → aç → 6 profil → mesaj → öneri → partner düzeltmesi + otomatik yanıt → şikâyet kaydı → Sohbetler'de görünüyor → engelle → 5 profil → kapat → hepsi gizli; yatay taşma 0, sayfa hatası 0.
- **Yarım kalan:** sesli mesaj, çeviri, gerçek sunucu. Gerçek Samsung testi Hakan'da.
- **Dokunulan dosyalar:** veri/test-profiller.js, cekirdek/{test-modu,gocler,arayuz,surum}.js, moduller/mesaj/*, moduller/{kesfet,sohbetler,ayarlar}/*, stiller/bilesenler.css, metinler/{tr,en}.js, main.js, package.json, DEGISIKLIKLER.md, DEVIR.md

## v0.2.7 — 16.10.2026 · Anayasal bölüm ayrımı ve derleme düzeltmesi

- **Yapan:** ChatGPT (bölüm ayrımı, profil düzenleme, 4→5 göçü) · Claude (Opus 5.5, derleme düzeltmesi ve devir düzeni)
- **Claude — 16.10.2026:** Güncel dalda `npm run build` gerçekten çalıştırıldı; eski Vercel logundaki dört ihlal giderilmişti ama 5 yeni ihlal vardı. Düzeltmeler:
  - Y16b: `ayarlar/index.js` hesaplanan anahtarlar `t(`diller.${d}`)` ve `t(`ayarlar.gorunumSecenek.${k}`)` biçimine çevrildi (denetçinin tanıdığı önek biçimi).
  - Y25: kullanılmayan `gezinme.ai` anahtarı tr.js'den kaldırıldı (en.js'de yoktu, kodda kullanılmıyordu).
  - Y26: Pratik ekranındaki "AI ile pratik" düğmesine `yzEtiketi()` eklendi (gerçek eksikti). Bağlantı artık yalnız insan keşfi olduğundan robotun Y26 listesinde `kesfet` yerine `bugun` (Pratik) denetlenir; kural metni değişmedi.
  - Y24: ChatGPT notları "# Devir Notu" başlığının üstüne eklenmişti; protokol sırası geri kuruldu, notlar aşağıda bu sürümün altına aynen taşındı.
  - Hata: "Kendimi tanıtıyorum" metni, ilk açılıştaki konuşma rahatlığı alanına (`kendiniTanim`: hic/basit/rahat) yazılıyordu; profilde "basit" görünüyor, tanıtım yazınca rahatlık bilgisi siliniyordu. Tanıtım `tanitimMetni` alanına ayrıldı; **şema 5 → 6 göçü** kod dışı eski değeri tanıtıma taşır, rahatlık kodunu korur (iki durum da sınandı).
  - Bağlantı ekranının başlığı sekmeyle aynı yapıldı (TR "Bağlantı", EN "Connect"; önceden "Keşfet/Discover").
  - Pratik ekranı: gece yarısından sonra "Günaydın" yerine "İyi akşamlar"; tarih arayüz diline göre (EN arayüzde Türkçe tarih yazıyordu). AI etiketi düğmenin içine değil açıklamanın başına kondu (düğme metni taşıyordu).
  - Sınama (gerçek derleme `teslim/KonusmaKocu-v0.2.7.html`, başsız Chromium, 360 px): ilk açılış, beş sekme, Ayarlar; sayfa hatası 0, yatay taşma 0, tanıtım kaydet → yeniden aç → profilde görünüyor. `npm run build`: denetçi 0 ihlal; `npm run robot-sinama`: 8/8.
  - Yapılmayan: gerçek Samsung/Chrome ve Vercel Preview (Vercel kaynak sınırı uyarısı vardı), ekran okuyucu testi.
- **Dokunulan dosyalar (Claude):** kaynak/moduller/{ayarlar,bugun,gelisim}/index.js, kaynak/cekirdek/{gocler,zaman}.js, kaynak/metinler/{tr,en}.js, araclar/yasa-denetcisi.mjs, DEVIR.md, DEGISIKLIKLER.md

### Vercel Preview derleme engeli — 16.10.2026 / ChatGPT

- Kullanıcı Vercel Preview logunu iletti: commit `8882d8b`, `npm run build` dört ihlal ile durdu (Y4: bugun.css, gelisim.css; Y16b: kesfet/index.js, sohbetler/index.js).
- Y4 için modüle özgü `bgn-hizli-alt` ve `gls-siradaki-alt` sınıfları CSS ve ilgili metin elemanlarına eklendi.
- Y16b için hesaplanmış çeviri anahtarları yerine doğrudan `t('...')` çağrıları kullanıldı.
- Kalite denetçisi gevşetilmedi, `!important` eklenmedi.
- **Henüz derleme ve Vercel yeniden dağıtım sonucu doğrulanmadı.** Kullanıcının logu eski commit'e aitti. Yeni Preview çıktısı incelenmeli.

### Profil düzenleme ve veri göçü — 16.10.2026 / ChatGPT

- Ayarlar ekranına ana dil, öğrenilen dil, kişisel dil hedefi ve kısa tanıtım düzenleme alanları eklendi; değişiklikler mevcut `degistir` deposuna kaydedilir.
- Profil ekranı kişisel dil hedefini mevcut genel hedef yerine gösterir; mevcut büyüme karnesi korunur.
- Şema 4→5 göçü `dilHedefi` alanını mevcut verileri koruyarak ekler.
- TR/EN metinler eklendi; EN alt menüde eksik `gezinme.baglanti`, `gezinme.dilAnlari` ve `ekran.dilAnlari` tamamlandı.
- Mevcut dil seçimi uygulamanın desteklediği dil etiketleriyle sınırlıdır; `diger` genel kategoridir. Toplulukta kamuya açık profil hâlâ yok.
- Çalıştırılmış derleme, robot, mobil ve şema göç testi yok. Main/deneme değişmedi.

### Profil kimlik kartı — 16.10.2026 / ChatGPT

- Profil üstüne ana dil, öğrenilen dil, mevcut seviye ve konuşma pratiği hedefi görünümü eklendi; mevcut büyüme karnesi ve ölçüm açıklamaları korunuyor.
- Bilinmeyen dil için boş durum ve yerel depolama/gizlilik açıklaması gösteriliyor; kamuya açık profil veya sosyal bağlantı varmış gibi davranılmıyor.
- Türkçe/İngilizce etiketler ve `gls-` kapsamlı CSS eklendi; yeni important yok. Tek ayarlar erişimi korunuyor.
- Önemli sınır: Düzenle mevcut ayarlar ekranına gider; bu ekranda ana dil/öğrenilen dil/hedef alanları henüz düzenlenemiyor. Bu özellik tamamlandı denmemeli.
- Testler çalıştırılmadı: derleme, robot, mobil ve erişilebilirlik. Main/deneme merge yok.

### Pratik ve Dil Anları görev ayrımı — 16.10.2026 / ChatGPT

- Pratik ekranına açık AI / gerçek kişi seçimi eklendi; AI mevcut demo senaryoya, gerçek kişi Bağlantı keşfine gider. Canlı insan görüşmesi henüz yok.
- Pratik'teki mükerrer ayarlar kısayolu ve kullanılmayan `bgn-profil` CSS kuralı kaldırıldı.
- Dil Anları'nda senaryo pratiği kısayolu yerine Bağlantı keşfine geçiş verildi; topluluk boş durumu korunuyor.
- TR/EN metin anahtarları eş zamanlı güncellendi. Yeni important eklenmedi.
- Eksik: gerçek partner servisi, paylaşımlar, profil bilgi düzenleme, otomatik denetim/derleme/Android testi. Main/deneme değiştirilmedi.

### Bağlantı görev ayrımı — 16.10.2026 / ChatGPT

- Beşli menüde Bağlantı yalnız gerçek kişi keşfine ayrıldı. AI sekmesi, hızlı pratik ve telaffuz/senaryo kartı kaldırıldı.
- Eski `kft-sekme`, `kft-sekmeler`, `kft-demo-not`, `kft-ogren` ve `shb-basla` CSS kuralları silindi; yeni `!important` yok.
- TR/EN keşif başlığı ve açıklaması gerçek insan bağlantısına göre düzeltildi.
- Gerçek hesap/partner altyapısı olmadığından dürüst boş durum devam ediyor.
- Derleme, robot, mobil test ve tüm dosyalarda artık denetimi henüz yapılmadı. Main/deneme değiştirilmedi.

### HelloTalk ekran kaydı incelemesi — 16.10.2026 / ChatGPT

- Kaynak: kullanıcının yaklaşık 74 saniyelik HelloTalk Android ekran kaydı; 9 örnek kare incelendi.
- Görülen ekranlar: Dil Sohbetleri, Dil Ortakları Bul, Dil Anları akışı, Öğren araçları, profil ve menü.
- Benimsenecek: sohbet araması ve çip filtreler; dil partneri keşfi ve kişi kartları; topluluk paylaşımları ve etkinlikleri; profilin kategorili sunumu; alt gezinmede açık aktif durum.
- Kaçınılacak: reklam/VIP baskısı, yoğun promosyon, kalabalık yüzey, görevleri karıştıran sekmeler.
- Ürün sınırları: Sohbet=geçmiş; Bağlantı=yeni kişi; Dil Anları=paylaşımlar; Pratik=insan veya AI; Profil=kişisel bilgi. AI insanmış gibi sunulmaz.
- Uygulama sırası: 1) mevcut beşli menü ve yönlendirme temizliği, 2) ortak mat siyah/gri token ve bileşenleri, 3) filtre/arama, 4) profil ve güvenli topluluk altyapısı, 5) mobil/erişilebilirlik/robot testleri.
- Bu kayıt analiz ve karar notudur; yeni UI kodu/testi olarak raporlanmamalıdır. Main ve deneme dalları değişmedi.

### Anayasa uyum kaydı — 16.10.2026 / ChatGPT

- ANAYASA.md dört sekme ve zorunlu sıcak palet tanımlarını kullanıcının son beş sekme, mat siyah/gri, English Prime UX kararlarıyla uyumlaştıracak şekilde güncellendi.
- Korunan hükümler: önce konuşma, insan/AI dürüst ayrımı, 18+ başlangıç, gizlilik, güvenli topluluk, çok dillilik, erişilebilirlik, Y1–Y28.
- Kalite kaynağı: MIMARI_KALITE_KURALLARI.md; yeni important ve CSS yaması yığılması yasak.
- Bu teslim belge/karar uyumlaştırmasıdır; UI kodunun tümü tamamlanmış veya test edilmiş değildir. Ana/deneme dalı değişmedi.

## v0.2.6 — 16.10.2026 · Beşli menü

- **Yapan:** ChatGPT

- Kullanıcı kararı: Sohbet · Bağlantı · Dil Anları · AI · Profil; sol üst profil, sağ üst ayarlar.
- Tasarım: English Prime'dan ilhamla sade kartlar, 5 eşit tab, vurgu yüzeyi, dengeli/kompakt yerleşim.
- Bağlantı mevcut Keşfet modülüne, AI mevcut Pratik modülüne bağlı; yeni Dil Anları güvenli boş durumdur.
- Ayarlar: mevcut sistem/açık/koyu ve yeni görünüm seçimi; veri göçü 3→4.
- Dal: tasarim-besli-menu-v0.2.6, taban: tasarim-kesfet-v0.2.2. Henüz test edilmedi, main/deneme değişmedi.
- Sonraki geliştirici: Y1–Y26 denetçisi, robot, gerçek Android, tema ve erişilebilirlik testleri; Claude incelemesi.
- Hakan onayı olmadan merge yok.


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

# Devir Notu

> **Bu projede çalışan her yapay zekâ işe buradan başlar.** Sıra: bu dosya → `KURALLAR.md` → `ANAYASA.md`'nin ilgili bölümü.
> İş bitince en üstteki "Şu anki durum" güncellenir ve aşağıya yeni sürüm kaydı eklenir. Kaydı ve "Yapan" bilgisi olmayan sürümü robot derlemez (Y24).

## Şu anki durum

- **Sürüm:** v0.6.0 · `main` (canlı, helloworld-gules.vercel.app) ve `deneme` aynı içerikte (16.10.2026, Hakan onayıyla: "Devir notuyla birlikte canlıya al"). Canlıya alma yine yalnız Hakan onayıyla.
- **Çalışma kuralı:** Yeni iş `deneme`'den açılan dalda; aynı dalda aynı anda tek yazan (issue #1, madde 4). Vercel ücretsiz planı günde 100 dağıtım: küçük işleri tek commit'te topla.
- **Ortak çalışma:** https://github.com/hakantaman21/Helloworld/issues/1 · ayrıntılı ChatGPT devri: `DEVIR_2026-10-16_CHATGPT.md`.
- **Ürün yapısı (beşli menü):** Sohbet = geçmiş konuşmalar · Bağlantı = yalnız gerçek insan keşfi (+ test modunda TEST profilleri) · Dil Anları = topluluk (dürüst boş durum) · Pratik = AI ya da gerçek insan, açık etiketli · Profil = dil kimliği ve gelişim.
- **Görünüm:** Renk ve ikonlar English Prime'dan (koyu petrol zemin, altın vurgu, 3B ikonlar `veri/ikon3d.js`); düzen ve yoğunluk HelloTalk'tan (ince üst çubuk `htUst`, metin/hap sekmeler, düz liste satırları, tam genişlik alt menü). Renk yalnız jetonlarda (Y3).
- **Ne çalışıyor:** İlk açılış, beşli gezinme, yapay zekâ demo konuşma, karne, Hata Hafızası, profil düzenleme, görünüm, TR + EN. **Test modu (10 sanal kullanıcı, TEST rozetli):** Dil Ortakları Bul (sekmeler, dil hapları, yaş/cinsiyet/hızlı yanıt süzgeci, kural tabanlı otomatik eşleşme, el sallama), zengin kişi profili (yaş, ülke, yerel saat, etkinlik, hobiler, meslek, takip), Dil Anları (Güncel / Senin için / Yardım et / Takip; beğen, yorum, düzelt, paylaş), mesajlaşma, düzeltme önerisi, partner düzeltmesi, şikâyet/engelleme (yanıtlar otomatik kalıp). Veri yalnız cihazda.
- **Ne çalışmıyor / henüz yok:** gerçek hesap ve sunucu, gerçek kişilerle mesajlaşma, sesli mesaj (Y12 kararı bekliyor), çeviri, gerçek yapay zekâ sağlayıcısı, harf düzeyinde telaffuz.
- **Sıradaki adım:** Hakan'ın canlı v0.6.0'ı telefonda denemesi ve geri bildirimi → arka uç kararı (Supabase / Firebase) → Mesaj ve Bağlantı ekranlarını gerçek hesaplarla bağlamak.
- **Açık kararlar:** platformun kalıcı adı · arka uç hizmeti · yapay zekâ sağlayıcıları · paketler ve kotalar · sesli mesaj ve Y12 · yapay zekâ partnerin adı.

## Sürüm kayıtları

## v0.6.0

- **Yapan:** Claude (Opus 5.5), 16.10.2026
- **Neden:** Hakan: iki sekmeli (sık kullanılan + detaylı) ve HelloTalk'tan iyi kişi süzgeci; üst süzgeçler kabartmalı platformda; ilgi alanları ve benzerleri English Prime gibi simetrik platformda; telefondan profile resim; karne açıklaması kartın sağ altında gri etiket; rakiplerin kritik özelliklerinden uyarlama; devir notuyla canlıya al.
- **Ne:** `bilesenler.css` `.b-platform`, `.b-karolar/.b-karo`, `.b-alt-pencere*`, `.b-sekmeler` platform görünümü; `kesfet` `suzgecPenceresi()` + `suzgecUygula()` (state: hizli/yas/cinsiyet/anaDil/ogrDil/seviyeler/ulkeler/ilgiler); `cekirdek/fotograf.js` (seç → canvas ile 480px JPEG, ≤220KB, en çok 6); `arayuz.js` `benAvatar()`; `cekirdek/cumle-defteri.js`; mesaj ve Dil Anları'nda sesli dinle (`soyle`) + yer imi; Ben ekranında Fotoğraflarım, Cümle defterim, karne etiketi.
- **Şema:** göç 10 (`profil.foto`, `profil.fotograflar`, `kayitliCumleler`), GUNCEL_SEMA 10.
- **Gizlilik:** Fotoğraflar sunucuya gitmez; yalnız cihazda, küçültülmüş. Sesli dinleme cihazın kendi sentezi (ağ yok, kayıt yok — Y12 ile uyumlu).
- **Durum:** Hakan'ın önceden verdiği onayla canlıya alındı (PR ile deneme → main).

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

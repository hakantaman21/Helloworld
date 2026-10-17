## 0.25.1 — 17.10.2026 · Yatay şerit kaydırması sekme değiştiriyordu; karnede taşan değer

- **Kaydırma çakışması (Hakan, 17:22):** Konu odalarının yatay şeridini kaydırırken alt menü sekmesi değişiyordu. Kök neden: sekme kaydırma hareketi yatay alanları elle tutulan bir sınıf listesinden tanıyordu; v0.21'de eklenen şerit listede yoktu. Artık dokunulan yerden yukarı doğru gerçekten yatay kayabilen bir kap (taşan içerik + `overflow-x: auto/scroll`) aranıyor; bundan sonra eklenecek her yatay şerit de kendiliğinden korunuyor.
- **Karne:** "Ölçülmedi" gibi sözcük değerler büyük sayı yazısıyla kutudan taşıyordu; sözcük değerler daha küçük yazılıyor ve kutuya sığacak biçimde bölünüyor. Gelişim ekranındaki değer kutularına da aynı taşma koruması eklendi.

## 0.25.0 — 17.10.2026 · Pratik sadeleşti, Karne'den hafızaya ekleme, görünüm ayarları

Hakan'ın v0.24 kararları (17.10, 17:06): 2) Bugün sadeleştirmesi önizlemeyle gösterilsin, 3) Karne düğmesi Claude'un kararına, 4) daha iyi ve kullanıcı dostuysa görünüm ayarları.

- **Pratik › AI sohbet:** en üstte tek "Bugünkü planın" kartı: selam, sıradaki adım, üç adım (sabah · senaryo · akşam) ve tek "Şimdi başla". Yarım kalan konuşma varsa kartın asıl eylemi o olur. Kaldırılanlar: tanıtım afişleri (rehber/kılavuz bu işi yapıyor), "Seviyene uygun · Şimdi katıl" satırı (plan kartıyla tekrar ediyordu), en alttaki "Günün döngüsü" listesi (karta taşındı). Konu odaları aynen kaldı.
- **Yatay kart sıraları** (`b-kart-sirasi`): ilk kart ekranın sol kenarına yapışıyordu (kaydırma yakalaması iç boşluğu yok sayıyordu); ortak bileşende `scroll-padding-inline` ile bütün sıralar düzeldi.
- **Karne › Hata Hafızama ekle:** her düzeltme kullanıcının kendi seçimiyle hafızaya eklenip çıkarılabilir (`hafiza.js` › `hafizayaElleDegistir`, kaynak `karne-elle`). Demo koç kanıtı yine kendiliğinden yazılmaz; demo notu buna göre güncellendi.
- **Ayarlar › Görünüm:** üstte gerçek bileşenlerden canlı önizleme; ilk düzeyde tasarım paketi, tema, yazı boyutu; kart yerleşimi, ikon paketi ve renkler "İnce ayar"da; "Varsayılana döndür" tek dokunuşla geri alınabilir.

## 0.24.0 — 17.10.2026 · Dış sınamaların (ChatGPT, Grok, Gemini) doğrulanan bulguları

Üç asistanın v0.22.0 sınama raporu güncel koda karşı yeniden çalıştırıldı; tekrar eden her bulgu kökünden düzeltildi.

- **Veri sözleşmesi** (`cekirdek/veri-sozlesmesi.js`): açılış, geri yükleme ve sekmeler arası eşitleme aynı kurala bağlandı. Sürümü güncel ama bozuk kayıt (ör. `profil: null`) artık uygulamayı düşürmez; bozuk bölüm varsayılana döner, geri kalan veri korunur, ham kayıt `kk:bozuk`'ta saklanır ve kullanıcıya söylenir. Geri yüklemede iç içe alanlar da denetlenir (`hafiza: null`, `test.sohbetler.x.mesajlar: null` gibi yedekler reddedilir, istisna fırlatmaz).
- **İki sekme:** bir sekmenin değişikliği diğerininkini ezmez; her yazma diskteki güncel veriye uygulanır, `storage` olayıyla bellek eşitlenir.
- **Erişim politikası** (`cekirdek/test-erisim.js`): engellenen kişi ve test modu kapalıyken test kişileri her okuma ve yazma noktasında aynı kuralla süzülür: sonradan yazılan yorumlar, arkadaşlık istekleri, bildirim kutusu, gecikmeli otomatik yanıtlar.
- **Benzersiz kimlik** (`cekirdek/kimlik.js`): aynı milisaniyede üretilen kimlikler çakışmaz (gönderi, hata kaydı, görüşme, fotoğraf).
- **Koç oturumu:** bitmiş oturuma gelen geç/çift cevap sağlayıcıya iletilmez (adaptör düzeyinde, her sağlayıcı için).
- **Arama ve erteleme:** erteleme günlük iki aramalık sınırı geri açmaz; her arama için günde en çok iki erteleme. Uygulama kapalıyken vakti geçen arama açılışta ekranın önüne geçmez, bildirimlerde "Cevapsız arama" olur.
- **Misafir girişi:** pencere kapanırken yapılan yönlendirme artık karşılama ekranına geri zıplamaz (yönlendirici, katmanın geçmiş kaydı geri alınırken yönlendirmeyi bekletir; bütün pencereler için). Kurulum bitince karşılamaya dönülmez.
- **Düzeltme motoru:** fiil tabloları kuralla üretilir (düzenli fiiller, 3. tekil biçimler); "Did you went", "arrive to … yesterday", bağlaçla gelen öznesiz fiil ("…and buy bread") yakalanır; düşünce fiillerine dokunulmaz ("I think he left yesterday" doğru kalır).
- **İletişim süzgeci:** yıl/yıl aralığı, tarih, ondalık, sürüm numarası ve tutar telefon sayılmaz.
- Senaryolar alt başlığı katalogdan hesaplanır (alan sayısı ve seviye aralığı; artık C1 dahil).

## 0.23.0 — 17.10.2026 · Önizlemede boş ekran düzeltmesi

- Uygulama, tarayıcı geçmişinin yasak olduğu korumalı önizlemelerde (ör. Claude uygulamasındaki dosya önizlemesi) boş ekranda kalıp kırmızı `SecurityError` veriyordu. Yönlendirici artık bu durumda adresi bellekte tutar; gezinme, menü ve geri düğmesi çalışır. Böyle önizlemelerde kayıt yapılamaz; uygulama bunu bildirir.
- Bağlan ekranında (test modu kapalı) üst çubuğa menü/profil düğmesi eklendi.

## 0.22.0 — 17.10.2026 · v0.19–v0.21 depoya aktarıldı, yasa uyumu

- v0.19.0, v0.20.0 ve v0.21.0 Hakan'a dosya olarak teslim edilmişti; bu sürümde kaynak ağacına (`kaynak/`) aktarıldı ve robotun bütün yasalarına uyduruldu.
- Dokunma alanları en az 48 px (kutu, arama, kılavuz, tur, ipucu şeridi, "Genişlet" düğmeleri).
- İkon paketlerinin bütün renkleri jetonlarda (`--renk-ikon-*`, `--renk-glif-*`); glif zemini `::before` + ton döndürme.
- Uygulama turu kendi katman jetonunda (`--z-tur`); ortak bileşen stilleri `stiller/bilesenler-rehber.css` ("b-" önekiyle). Modüller birbirinin sınıfını kullanmıyor (ekosistem kendi anahtar/satır stillerini taşıyor).

## 0.21.0 — 17.10.2026 · Konu odaları ve senaryo raporu

- Pratik › Konu odaları: "Tümü"nde her kategori bir yatay şerit; ekranda iki kare kart, kaydırarak seçilir. "Genişlet": Tümü'ndeyken kategori tam sayfa açılır (seviyeye göre gruplu geniş sohbet kartları); tek kategori seçiliyken senaryolar alta geniş kartlar olarak açılır, "Daralt" ile kapanır. Seçim, açık kategoriler ve şerit kaydırması geri dönünce korunur.
- Denenen senaryolar işaretli: "Tamamlandı" / "Denendi" (Pratik, Öğren, Senaryolar).
- Geniş kartta son kullanım, deneme sayısı ve başarı oranı; basılı tutunca (ya da "Rapor") kullanım raporu: başarı oranı, son kullanım, ilk deneme, deneme/tamamlama, toplam süre, cümle, düzeltme/cümle, son görüşmeler (karneye gider).
- Senaryo başına kalıcı özet (şema 19); eski görüşmelerden ve tamamlananlardan geriye dönük doldurulur.

## 0.20.0 — 17.10.2026 · İkon paketleri, uygulama ailesi, B1

- 4 ikon paketi (Klasik 3B, Buz cam, Neon, Yumuşak kil; Otomatik = tasarım paketine uyar). 3B görsel yalnız anlamı birebir tutan yerde; diğerleri paketin vurgusunu taşıyan glif rozeti. Aynı ekranda tekrar eden kart ikonları kendiliğinden ayrışır.
- Uygulama ailemiz: English Prime ve Yoldaş tanıtımı; ücretli üyeye diğerlerinde indirim teklifi, diğer uygulamada üyeye helloworld paketlerinde indirimli fiyat (ödeme bağlanana kadar yalnız gösterim). Adresler ve indirim oranı düzenleme modunda.
- 5 yeni B1 senaryosu: ürün iadesi, eczane, gürültülü komşu, hafta sonu planı, ödev için ek süre.

## 0.19.0 — 17.10.2026 · Rehberlik

- Bildirim ve mesaj kutusu: 6 kategori, toplu seç/sil/okundu, kategori temizleme; arkadaşlık isteği kutudan kabul/ret. Okunmamış sayısı profil fotoğrafında ve zilde.
- İlk girişte uygulama turu (gerçek öğeler üstünde); güncellemeden sonra yenilikler penceresi ve "Yeni" etiketleri.
- Eksik (zorunlu olmayan) profil bilgisi hatırlatmaları, bilgilendirme mesajları, az kullanılan bölümler için öneriler (yalnız cihazda; günde en çok bir sistem mesajı).
- Uygulamada arama (40 özellik), ipuçları ve kılavuz, uygulama haritası, ekran ipucu şeridi; Ayarlar › Rehber ve ipuçları.
- Düzeltme: Bağlan "Arkadaşlar" sekmesi geri dönünce sıfırlanıyordu. Kilit kapsamı ekran tanımında bildirilebiliyor (kutu = kişiler ve sohbetler).

## 0.18.0 — 17.10.2026 · Paketler, günlük sınır, uygulama kilidi

- Paketler (Ayarlar › Üyelik ve paketler): Ücretsiz · Plus · Premium; her pakette günlük yeni kişi sınırı ve özellikler. Yalnız gerçekten çalışan özellikler listelenir.
- Düzenleme modu: paket adı, aylık/yıllık fiyat, günlük sınır, özellikler ve açıklama satırları düzenlenir; "Varsayılana döndür".
- Ücretsiz pakette günde en çok 7 yeni kişiye ilk mesaj (el sallama dahil). Zaten konuştuğun kişilere yazmak sayılmaz; sayaç gece yarısı sıfırlanır. Sınır dolunca nedeni ve paketler gösterilir.
- Ödeme henüz bağlı değil: paket seçimi bu cihazda TEST olarak etkinleşir ve ücret alınmaz (ekranda yazıyor).
- Uygulama kilidi (Premium): PIN (4–8 hane) ya da desen; isteğe bağlı parmak izi / yüz (telefonun kendi doğrulaması; canlı sitede çalışır). Kapsam: tüm uygulama, Ayarlar ya da kişiler ve sohbetler. Uygulamadan çıkınca: hemen / 1 / 5 / 15 dk. 5 yanlış denemede bekleme. PIN ve desen düz metin saklanmaz.
- Kilit dürüstçe tanımlanır: telefonu eline alan birine karşı gizlilik perdesi; veri şifrelemesi değildir.

## 0.17.0 — 17.10.2026 · Arkadaşlık ve karşılıklı gizlilik

- Bağlan'daki kişi kartlarının etrafındaki ince ışık çizgisi kalktı (Sohbet'teki gibi hafif kabartma).
- Arkadaşlık: kişi profilindeki + ile istek gönder; kabul edilince arkadaşsınız. Gelen istekleri kabul et ya da reddet. Bağlan'da yeni "Arkadaşlar" sekmesi: gelen istekler, arkadaş haberleri, arkadaşlarım, gönderdiğin istekler.
- Arkadaş haberleri: yeni Dil Anı, seviye atlama, seri rekoru, fotoğraf güncelleme, yeni ilgi alanı, yardım/düzeltme isteği. Hangi haberleri göreceğin Ayarlar › Gizlilik › Arkadaş haberleri'nden seçilir.
- Favori ve başa sabitleme: Sohbet ya da Bağlan'da bir kişiye basılı tut (ya da kişi/sohbet "…" menüsü). En çok 3 sohbet sabitlenir; sabitliler en üstte. Sohbet'te "Favoriler" ve "Arkadaşlar" süzgeçleri.
- Karşılıklı gizlilik (WhatsApp mantığı), Ayarlar › Gizlilik: "Arkadaş listemi kim görebilir" ve "Son görülme ve çevrimiçi" (Herkes / Arkadaşlarım / Kimse), "Okundu bilgisi" (açık/kapalı). Kapattığın bilgiyi başkalarında da göremezsin; görünmüyorsa nedeni yazılır.
- Mesaj durumu: ✓ gönderildi · ✓✓ iletildi · turkuaz ✓✓ okundu (okundu iki taraf da açıksa).
- Kişi profilinde "Arkadaşları" bölümü; kendi Profil sayfanda "Arkadaşlarım". Takip etme kişi "…" menüsüne taşındı.

## 0.16.0 — 17.10.2026 · Güvenilirlik, topluluk kuralları, C1, yeni menü

- Yeni menü düzeni: beş ana sayfanın üst bandında solda profil fotoğrafın; dokununca yan menü açılır (Profilini gör, kısa yollar, Gelişim, Ayarlar). Sağ alttaki sekme artık "Gelişim" (seri, puanlar, karne, Cümle Defteri, seviye yolu). Kimlik bilgileri (kapak, fotoğraflar, ilgi alanları) ayrı "Profil" sayfasında.
- Topluluk kuralları (sohbet): karşı taraf yanıt vermeden en çok 5 mesaj; yanıt gelmezse haftada bir mesaj. Fotoğraf göndermek iki taraf da en az 5 mesaj yazınca açılır. Telefon numarası ve e-posta, sohbet 7 gün sürüp iki taraf da 10 mesaj yazınca paylaşılabilir. Engellenen kişi artık doğrudan adresle de açılmaz; engel Ayarlar › Gizlilik › Engellenenler'den kaldırılır.
- Sohbette fotoğraf gönderme; yazılan mesaj taslağı sohbetten çıkınca kaybolmuyor; eski mesajları okurken ekran zorla en alta inmiyor. Çevrimdışı test kişileri otomatik yanıt vermiyor (sınır gerçekçi sınanabilsin diye).
- Yedekten geri yükleme: eksik ya da bozuk yedek reddediliyor (mevcut veri değişmez); fotoğraflar yalnız yedek kabul edilirse yazılıyor. Yedeğe kapak, gönderi ve mesaj fotoğrafları da giriyor; kullanılmayan fotoğraflar depodan temizleniyor. Fotoğraflar geç yüklenince yazmakta olduğun metin kaybolmuyor.
- Düzeltme: "although/though/while/if" yan cümleleri ayrı değerlendiriliyor ("I work today although I was sick yesterday" artık bozulmuyor). Yeni kesin edat kalıpları: good at, married to (him/her), depend on, interested in, listen to, discuss (edatsız), explain to me how…, arrive at, on Monday, in 1995. Her derlemede 23 doğru cümle ve 10 hatalı cümleyle sınanıyor.
- Koç: çok kısa ve beklenen yanıtı karşılamayan cevapta soruyu bir kez daha soruyor.
- Hata Hafızası: "öğrenildi" için başarılar en az iki farklı günde olmalı. "Yeni kelime" sayacı dürüst adıyla: "hedef kelime".
- Telaffuz: sözcükler sırayla hizalanıyor; eksik, farklı duyulan ve fazladan sözcükler ayrı gösteriliyor ("happy am I" artık doğru sayılmıyor). "Kaçanı yavaş dinle" ve isteğe bağlı "Hafızaya ekle". Ekrandan çıkınca ya da cümle değişince dinleme duruyor. Seçilen koç sesinin aksanı ses tanımada da kullanılıyor.
- C1: seviye seçilebiliyor; 4 B2 ve 5 C1 senaryo (toplantıda itiraz, ev sahibiyle tamir, uzaktan çalışma tartışması, iptal edilen uçuş, sunum sonrası zor sorular, fatura şikâyeti, yapay zekâ politikası, akademik eleştiri, maaş pazarlığı). Bir alanda seçilen seviyede senaryo yoksa en yakın seviyeden öneri.
- Bağlan: ülke süzgeci dil değişince bozulmuyor; yaş hapı "60+"; "Karşılıklı" iki yönlü; Çevrimiçi/Yeni artık yalnız üst sekmede.
- Misafir girişinde ana dil soruluyor (arayüz dili ana dil sayılmıyor); öğrenilen dil İngilizce.
- Karnedeki kelimeler ve kültür notu tek dokunuşla Cümle Defteri'ne. "Çok büyük" yazı boyutu. Açılan pencerelerde klavye odağı pencere içinde kalıyor, kapanınca açan düğmeye dönüyor.
- Şema 17: görüşmelere kalıcı kimlik (karne adresi sıra numarasına bağlı değil).

## 0.15.0 — 17.10.2026 · Üst bant, kartlar, kapak görseli, çoklu fotoğraf

- Marka şeridi (logo + helloworld) sola dayalı ve sayfa adının yazdığı banda değiyor.
- Üst bandın çevresindeki çizgi tüm sayfalarda kalktı; yalnız hafif kabartma.
- Sohbet ve Bağlan kişi kartları hafif kabartmalı; çevrelerindeki renkli ışık çizgisi kalktı.
- Dil Anları: bir gönderiye en çok 9 fotoğraf; akışta 1/2/3/4'lü ızgara, 4'ten fazlasında dördüncü karede "+N".
- Kişi kartında profil fotoğrafının arkasında kapak görseli (uygulamanın varsayılan kapakları); kendi profilinde kapağı değiştir: 6 hazır kapak ya da kendi fotoğrafın.
- Hobiler kişi kartında yana kaydırılan, daha ince bir şeritte; ortak ilgiler vurgulu. TEST profillerinin ilgi alanları 7'ye çıktı.
- Süzgeç penceresi: yaş ve cinsiyet bantları daha ince; Detaylı karoları daha sık; ülke ve ilgi alanı gruplarına dokununca açılıyor (kapalıyken seçili sayısı görünür).
- Şema 16: profil.kapak, Dil Anları gönderisinde fotolar.

## 0.14.0 — 16.10.2026 · Değerlendirmelerden kalanların tamamı

- Bağlan sadeleşti: üstte yalnız Tümü · Sana uygun · Çevrimiçi · Yeni. Ciddi öğrenen, yakın saat dilimi, karşılıklı, seviye ve cinsiyet süzgeç penceresinde.
- Etkin süzgeçler adlarıyla görünür ve tek tek × ile kaldırılır; Bağlan seçimi uygulama kapanıp açılınca da hatırlanır.
- "%93 uyum" yerine sözlü düzey: Çok uygun / Uygun / Olası eşleşme (puan bilimsel bir olasılık değil, kural toplamı).
- Yeni ekran: Telaffuz çalışması — dinle, yavaş dinle, söyle, tanınan sözcükleri karşılaştır (tanınmayanlar altı çizili), yeniden dene, deftere kaydet. Puan verilmez; ses tanıma telaffuz puanı değildir. Orta düğmenin "Telaffuz" kısayolu ve Pratik/Profil kısayolları buraya gider.
- Koç sesi seçimi (Ayarlar › Koç ve pratik): cihazdaki İngilizce sesler (ABD, İngiltere, Avustralya…), seçince örnek cümle çalar.
- Koç, kullanıcı soruya cevap yerine kendi sorusunu sorarsa bunu kabul edip aynı soruyu bir kez yeniden soruyor.
- Senaryo satırlarında tahmini süre ve başarı ölçütü (görev).
- Fotoğraflar artık tarayıcının IndexedDB deposunda (localStorage kota sorunu yok); eski fotoğraflar açılışta taşınır; yedek dosyası fotoğrafları da içerir; "Verileri sil" fotoğrafları da siler.
- "Büyük yazı" artık ekranı zoom ile büyütmüyor; tüm yazı boyutları ölçeklenir (alt menü ve yapışkan başlık kaymaz).
- Koyu tema tek blokta; "Sistem" teması sayfa açılmadan önce belirlenir (koyu cihazda açık ekran yanıp sönmez).
- Geliştirici: araclar/davranis-sinama.py — her ekranı boş veri ve test moduyla açar, hata/boş ekran/çevrimdışı duyurusunu denetler.
- Şema 15: ayarlar.kocSesi, ayarlar.kesfetSecimi.

## 0.13.0 — 16.10.2026 · Güvenilirlik sürümü (ChatGPT, Gemini ve Grok değerlendirmelerinden)

- Veri güvenliği: "Verileri sil" artık yedek kopyaları da siliyor; kayıt yazılamazsa ekran "kaydedilemedi" diyor; bozuk eski kayıt sessizce silinmiyor; indirilen yedek Ayarlar'dan geri yüklenebiliyor.
- Doğru öğretme: "I have not seen him since yesterday" gibi doğru present perfect cümleler artık bozulmuyor; iki yeni kesin kural (yaş kalıbı "I am 20 years old", sayılamayan isimler "information/advice/homework"); kural hata bulamayınca koç övmüyor, nötr onaylıyor.
- Bağlan: süzgeç penceresindeki "N kişiyi göster" sayısı artık listeyle aynı; sekme, dil ve süzgeç profilden dönünce korunuyor; sonuç yoksa "Süzgeçleri temizle".
- Geri dönünce sayfa kaldığın kaydırma konumunda açılıyor.
- Sohbet: "Okunmamış" gerçek okunma durumuna göre (sohbet açılınca okundu); okunmamışta nokta; geçmiş yapay zekâ görüşmesine dokununca o görüşmenin karnesi açılıyor.
- Öğrendiğim dil: şimdilik yalnız İngilizce seçilebiliyor, diğerleri "yakında" (koç, sözlük ve düzeltme yalnız İngilizce).
- Alt menü: arayüz dili değişince etiketler de değişiyor; orta düğme atanan işin adını yazıyor; ilk iki açılışta "Basılı tut: hızlı işlemler" ipucu.
- Ayarlar › Görünüm: renkler "Gelişmiş özelleştirme" altında, "Görünümü varsayılana döndür", elle değişince "Özel görünüm" işareti ve paket seçimi kalkıyor.
- Hata Hafızası'nda arama; uzun bildirimler okunacak kadar ekranda kalıyor; İngilizce metindeki çift virgül düzeltildi.
- Şema 14: ayarlar.ortaIpucu, test.okundu.

## 0.12.2 — 16.10.2026 · Uygulamanın adı: helloworld

- Uygulamanın görünen adı "helloworld" oldu (marka şeridi, sekme başlığı, ana ekrana ekleme adı, davet mesajı; Türkçe ve İngilizce).

## 0.12.1 — 16.10.2026 · Marka şeridi, hatları her yerde görünen üst bant, geniş sohbet kartları, HelloTalk'taki eksik süzgeçler

- Ana sekmelerin en üstünde ince marka şeridi: uygulama simgesi + "Konuşma Koçu".
- Üst bant artık kenarlardan ayrık bir kart: üstte, solda, sağda ve altta hattı görünür.
- Sohbet: kişi satırları Bağlan'daki kartlar kadar geniş (büyük fotoğraf, dil çifti, çevrimiçi/ülke, son mesaj).
- Yeni süzgeçler (HelloTalk'ta olup bizde eksik olanlar, hepsi çalışır):
  - Bağlan: Ciddi öğrenenler, Yakın saat dilimi, Karşılıklı (senin dilini öğrenen ve senin hedef dilini konuşan), Kadın, Erkek.
  - Sohbet: Sen yazmadın (yanıt bekleyen), Yakın saat dilimi, kişinin diline göre (İngilizce, İspanyolca…).
  - Dil Anları: Öğren (hedef dilini ana dil olarak konuşanların paylaşımları), Yakın saat dilimi, Sınıf arkadaşları (aynı seviye).
- Konum tutulmadığı için HelloTalk'taki "Yakında/Şehir" yerine "Yakın saat dilimi" (±3 saat) kullanılır.

## 0.12.0 — 16.10.2026 · Akıllı sayfa renkleri, tasarım paketleri, 9 yeni senaryo ve 3 yeni kategori

- Akıllı renk: her sayfa içeriğiyle eşleşen bir renk tonu taşır — Sohbet yeşil (sakin konuşma), Bağlan mavi (güven, insanlar), Pratik kırmızı-mercan (enerji, eylem), Dil Anları amber (paylaşım, sıcaklık), Profil ve Ayarlar mor (kimlik, gelişim). Ton üst bantta, sayfanın üst ışığında, başlıkta, kart çerçevelerinde görünür; menüye bakmadan hangi sayfada olduğun anlaşılır.
- Ayarlar › Görünüm › Tasarım paketi: Akıllı renk (varsayılan), English Prime, Gece turkuaz, Mor akşam, Bordo klasik, Antrasit sade. Tek tek değiştirince paket "Özel" olur.
- Üst bant varsayılanı artık "Sayfa rengi" (her sayfanın kendi renginin çok koyu tonu).
- Şikâyet, onay ve benzeri pencereler boş alana dokununca da kapanır ("Vazgeç" gibi).
- Düzeltme: şikâyet penceresi açıkken telefonun geri tuşu artık yanlışlıkla bir şikâyet nedeni seçmez; yalnız Vazgeç'e basar.
- 9 yeni yapay zekâ senaryosu: Kiralık daire, Doktorda, İş görüşmesi, Partide tanışma, Yapay zekâ aracı toplantısı, Teknik destek, Dil kursuna kayıt, Otelde giriş, Bankada hesap açma.
- 3 yeni yaşam alanı: Teknoloji ve yapay zekâ, Okul ve eğitim, Banka ve resmî işler ("İş ve okul" artık "İş hayatı").
- Pratik › Konu odaları tüm senaryolardan oluşur ve kategoriye göre süzülür.
- Şema 13: ayarlar.tasarimPaketi.

## 0.11.3 — 16.10.2026 · Sohbet bandı en sıkı hâl, belirgin kart hatları

- Sohbet üst bandı sıkışma yaratmadan en dar hâline getirildi (başlık, simgeler, yazılar ve "Daha fazla" arası).
- Bandın alt ve yan hatları ince altın çizgiyle her yerde görünür.
- Kart ve sohbet satırlarının çerçevesi belirginleşti; koyu temada sağda-solda kaybolmuyor.
- Profil adları: başka bir kişinin sayfasındaki "Profil" sekmesi "Hakkında" oldu (kendi Profil sayfandaki "Hakkımda" ile uyumlu).

## 0.11.2 — 16.10.2026 · Video notlarından kalanlar

- Bağlan: "Otomatik eşleş", ilgi daveti ve TEST notu şeritleri "Güvenli pratik" slaytı gibi koyu, kendi renkleriyle ışık-koyuluk geçişli ve kabartmalı; kişi kartları da geçişli ve kabartmalı, aralarında daha çok boşluk.
- Dokunulan kart ve kısayol ışıklanır (seçili öğe ayrıca ışıklı).
- Pratik: hızlı oda kartı tek satır (solda konu, sağda değiştir + Şimdi katıl) — daha kompakt; oda kartları alçaldı.
- Dil Anları: gönderiler arası boşluk ve ayırıcı çizgi daha belirgin.

## 0.11.1 — 16.10.2026 · Hakan'ın video notları

- Sohbet: üst bant daraltıldı (başlık, simgeler ve "Daha fazla" arası sıkı).
- Kısayol simgeleri her yerde (Profil › Öğrenme merkezi dahil) kutusuz, doğrudan zeminde.
- Sohbet satırları arasında daha çok boşluk; koyu temada daha koyu ışık-gölge geçişi.
- Seçili süzgeç ayrıca ışıklı.
- Bağlan ve Dil Anları panoları siyaha yakın, sayfa rengiyle ışık-koyuluk geçişli ("Güvenli pratik" slaytı örnek alındı).
- Pratik: konu odaları kartları daha kompakt; günün döngüsü satırları arasında biraz daha boşluk.
- Dil Anları: gönderiler arası ayrım daha belirgin.
- Şikâyet, onay ve alt pencereler temaya uygun koyu geçişli zemin.

## 0.11.0 — 16.10.2026 · Siyaha yakın bant, ışık-gölge geçişli kartlar, kabartmalı süzgeçler, siyah-turkuaz alt menü, geri tuşu düzeltmesi

- Üst bant siyaha yakın (varsayılan çok koyu yeşil); diğer bant renkleri de koyulaştı.
- Sohbet: üstteki kısayol simgeleri ayrı bir kutuda değil, doğrudan koyu bandın üstünde (altlarında hafif turkuaz ışık).
- Yan menü parmakla sola (dış kenara) sürüklenince de kapanıyor.
- Kartlar ve liste satırları her sayfada üst-solda ışık, alt-sağa doğru koyuluk geçişi taşıyor; koyu temada sohbet satırları koyu ve zeminden ayrışıyor.
- Süzgeçler kabartmalı: tepsi içe gömük, her süzgeç öğesi kabarık, seçili olan daha yüksek ve parlak (tüm sayfalarda).
- Alt menü her temada siyah; üst ışık çizgisi, seçili kutu ve seçili yazı turkuaz. Ortadaki Pratik oku daha büyük ve tam ortada.
- Profil tutarlılığı: tek profil sayfası alt menüdeki "Profil". Yan menünün üstündeki ad/fotoğraf "Profilini gör" kısayolu; Profil içindeki sekme "Hakkımda"; Ayarlar'daki grup "Kişisel bilgiler" (düzenleme yeri) ve oradan "Profilini gör" bağlantısı.
- Düzeltme: Bağlan'da süzgeç penceresi açıkken telefonun geri tuşu artık alttaki sayfayı değil pencereyi kapatıyor (tüm üstten açılan pencerelerde).

## 0.10.0 — 16.10.2026 · Koyu üst bant, siyah arama, Bağlan, kayan panolar, alt menü kayması düzeltmesi

- Düzeltme: alt menü artık kaydırırken ya da sekme değiştirirken aşağı kayıp geri gelmiyor. Sebep: ekranı tam dolduran kaydırma alanını Android Chrome "kök kaydırıcı" sayıp adres çubuğunu gizleyip açıyordu. İçerik alanı artık alt menünün üstünde bitiyor; son öğe de menünün altında kalmıyor.
- Sohbet: v0.6.0'dan kaybolan öğeler geri geldi — sol üstte profil fotoğrafı (dokununca yan menü), ilk satırda 5 kısayol (Dil Anları dahil); "Daha fazla" artık bandın altında küçük bir tutamak.
- Koyu baş bandı: Sohbet, Bağlan ve Dil Anları'nda sayfanın ilk yatay bölümleri çok koyu bir şeritte; sayfa onun altından başlıyor. Renk Ayarlar › Görünüm › Üst bant rengi: Yeşil (varsayılan), Gece mavisi, Mor, Bordo, Antrasit, Sayfa rengi.
- Arama kutularının içi her temada siyah.
- Süzgeç (sekme) biçimi seçeneği: Klasik, Dolu, Çizgi, Çerçeve, Beyaz.
- "Bağlantı" menü öğesi "Bağlan" oldu.
- Bağlan'da kayan bilgi panosu: sana en uygun kişi, şu an çevrimiçi sayısı, ilgi ipucu, tanışma, güvenlik.
- Dil Anları'nda süzgeçlerden sonra kayan pano: tanıtım, yardım bekleyen paylaşımlar, en çok paylaşan, en çok etkileşim alan, cümle defteri ipucu. Sayılar cihazdaki TEST verisinden hesaplanır, uydurulmaz.
- Şema 12: ayarlar.bantRengi, ayarlar.suzgecBicimi.

## 0.9.2 — 16.10.2026 · Alt menü yeni görünüm

- Alt menü yüzen, yuvarlak köşeli bir çubuk oldu.
- Orta düğme: kalın koyu çerçeveli altın daire, içinde ▶ ve "PRATİK" yazısı; seçilince çerçeve ve parıltı seçim rengini alır.
- Seçili öğe: seçim rengine boyanmış yuvarlak kutu, altında açık renkli çizgi; sekmeler arasında kayarak gider.

## 0.9.1 — 16.10.2026 · Alt menü sayfa geçişinde artık kaybolmuyor

- Düzeltme: Android Chrome'da sekme değiştirirken (özellikle ortaya, Pratik'e geçerken) alt menü bir an aşağı kayıp kayboluyor, sonra geri geliyordu. Sebep: her geçişte sayfa en üste kaydırılınca tarayıcının adres çubuğu yeniden açılıyor, ekran yüksekliği değişiyor ve tarayıcı sabit menüyü bir an aşağıda bırakıyordu. Artık belge hiç kaymıyor; kaydırma uygulamanın kendi alanında (#uygulama) oluyor. Adres çubuğu yerinde kalıyor, alt menü de.
- Üstten açılan pencere kilidi bu yeni kaydırma alanına taşındı.

## 0.9.0 — 16.10.2026 · Kalıcı alt menü, ışıklı gösterge, orta Pratik düğmesi, sayfa renkleri, kişisel renkler

- Alt menü artık tek ve kalıcı: sayfa geçişlerinde ve kaydırırken yerinde durur, kaybolup gelmez.
- Seçili öğenin üstünde saydam, ışıklı bir kare gezinir; parmakla sekme kaydırırken parmağı izler.
- Pratik ortada büyük yuvarlak düğme (Yoldaş Akıllı Asistan düzeni): normalde koyu çerçeveli, seçilince çerçevesi seçim rengini alır ve parlar; üstünde küçük ok. Basılı tutunca "Hızlı işlemler": Koç araması (yapay zekâ), Senaryo, Telaffuz, Hata Hafızası, Dil ortağı bul; dokunma kısayolu buradan ya da Ayarlar'dan atanır.
- Sekme sırası: Sohbet · Bağlantı · Pratik · Dil Anları · Profil (kaydırarak geçiş de bu sırayla).
- Üstten açılan pencereler (süzgeç, yan menü, onay pencereleri) açıkken arka sayfa ve alt menü kaymaz.
- Sayfa renkleri Google renk anlamlarıyla: Sohbet mavi, Bağlantı yeşil, Pratik kırmızı, Dil Anları sarı, Profil ve Ayarlar mor. Zemin hariç başlıklar, kartlar ve sekme platformları bu rengi açık-koyu geçişlerle taşır.
- Ayarlar › Görünüm: seçim rengi (Altın, Mavi, Yeşil, Mercan, Mor, Turkuaz), zemin rengi (Varsayılan, Nötr, Mavi, Mor, Yeşil), orta düğme kısayolu.
- Düzeltme: Ayarlar'da bir gruba girip geri dönünce (telefonun geri tuşu dahil) bir adım geri gelinir; artık iki adım atlanmaz.
- Şema 11: ayarlar.secimRengi, ayarlar.zemin, ayarlar.ortaDugme.

## 0.8.0 — 16.10.2026 · Kayan afişler, Pratik üç sekme, kaydırarak sekme geçişi

- Pratik'in en üstünde kayan tanıtım afişleri: 4,5 saniyede bir kendiliğinden ilerler, parmakla kaydırılır, dokununca ilgili yere götürür ("hareketi azalt" açıksa kendiliğinden ilerlemez).
- Pratik üç sekme (HelloTalk Ses · Canlı · Öğren karşılığı): AI sohbet (konu odaları, günün döngüsü) · Gerçek sohbet (şu an aktif dil ortakları, renkli 2 sütunlu kartlar; TEST rozetli) · Öğren (senin için önerilen senaryolar ve araçlar, yatay kayan kart sıraları).
- Ana sekmeler arasında sağa/sola kaydırarak geçiş (Sohbet ↔ Bağlantı ↔ Dil Anları ↔ Pratik ↔ Profil), kısa geçiş canlandırmasıyla. Yatay kayan alanlarda (afiş, sekmeler, kaydırıcı) devreye girmez.

## 0.7.0 — 16.10.2026 · HelloTalk örnekleriyle gruplu, az kaydırmalı düzen

- Ayarlar: ana sayfada renkli simgeli kategori kartları (Profilim · Bildirimler, Gizlilik · Koç ve pratik, Dil · Görünüm), her satırda güncel değer özeti; dokununca yalnız o grup açılır, geri ile listeye dönülür.
- Kişi süzgeci: yaş ve seviye için aralık kaydırıcıları (HelloTalk Filtre ekranı gibi), canlı sonuç sayısı korunur.
- Sohbetler: ☰ yan menü (günün önerisi afişi + Öğren / Topluluk / Hesabım grupları); hızlı erişim ızgarası platformda, "Daha fazla / Gizle" ile ikinci satır açılır.
- Pratik: "Bugün / Konu odaları" sekmeleri; konu odaları (HelloTalk Ses odalarından esinli) ve "Seviyene uygun · Şimdi katıl" kartı. Katılınca o konuda yapay zekâ koçla konuşulur (açıkça etiketli).
- Ben: "Profil / Gelişim" sekmeleri; Öğrenme puanları ızgarası (dakika, kelime, hata, cümle, Dil Anı, takip), Arkadaşını davet et.

## 0.6.0 — 16.10.2026 · İki sekmeli süzgeç, platformlar, profil fotoğrafı, cümle defteri

- Kişi süzgeci yeniden: alttan açılan pencerede "Sık kullanılan" (tek dokunuş karoları: çevrimiçi, yeni, seviyeme yakın, ortak ilgi, hızlı yanıt, dilimi öğrenen; yaş, cinsiyet) ve "Detaylı" (ana dil, öğrendiği dil, seviye, ülke, ilgi alanları). Canlı sonuç sayısı, Sıfırla, etkin süzgeç şeridi. Tüm süzgeçler ücretsiz.
- Dil Anları, Bağlantı ve Sohbetler'deki üst süzgeçler kabartmalı bir platform üzerinde; zeminden ve içerikten ayrılıyor.
- İlgi alanları ve benzer seçim grupları English Prime'daki gibi simetrik karo ızgarasında, platform üzerinde (Ayarlar, Ben, kişi sayfası, süzgeç).
- Profil fotoğrafı: telefondan resim seç ya da çek; küçültülüp yalnız cihazda saklanır (en çok 6). Ben ekranında "Fotoğraflarım", Ayarlar'da avatara dokunarak değiştir.
- Karne: "Bu rakamlar ne anlama geliyor?" kartın sağ altında gri etiket; dokununca açıklama kartın içinde açılır. Ayrı açılır kart kaldırıldı.
- Rakiplerden: gelen mesajları ve Dil Anları gönderilerini sesli dinle (cihazın konuşma sentezi); cümleyi yer imiyle "Cümle defterim"e kaydet (Ben ekranında, sesli dinle ve sil).
- Şema 10: profil.foto, profil.fotograflar, kayitliCumleler.

## 0.5.0 — 16.10.2026 · Misafir girişi, logo, yeni Ayarlar, hızlı yanıtlar, sade kişi sayfası

- Misafir girişi: ilk açılışta "Misafir olarak devam et" (18 yaş ve kural onayı yine zorunlu); Ayarlar'da tamamlama şeridi.
- Logo: iki konuşma balonu (yazı + altın ses dalgası); uygulama simgesi, karşılama ve Ayarlar › Hakkında.
- Kişiler arasında boşluk: Sohbetler ve Bağlantı'da her kişi ayrı, yumuşak kart; çizgiyle bitişik liste yok.
- Topluluk kuralları kompakt: dört kısa madde, iki sütun (Bağlantı ve Ayarlar).
- Ayarlar yeniden: profil kartı + simgeli gruplar (Profilim, Dil, Bildirimler, Koç ve pratik, Görünüm, Gizlilik), bölümlü seçimler, anahtarlar, açılır tanıtım ve ilgi alanları. Yeni: yazı boyutu, göndermeden önce düzeltme önerisi aç/kapa.
- Sohbet başlığında hızlı yanıt önerileri: son mesaja göre kural tabanlı İngilizce öneriler; dokununca yazı kutusuna gelir.
- Kişi sayfası sadeleşti: yumuşak kapak, ortalanmış kimlik, ince uyum çubuğu, tanıtım kartı, simgeli bilgi satırları.
- Şema 9: profil.misafir, ayarlar.yaziBoyutu, ayarlar.gonderimOneri (mevcut veriler korunur).

## 0.4.1 — 16.10.2026 · İlgi alanları ve ortak ilgiye göre eşleşme

- Ayarlar › Dil profili: 26 ilgi alanından en çok 8'ini seç (HelloTalk "Hobiler").
- Otomatik eşleşme ortak ilgiyi de sayar (ilgi başına +6, en çok +12) ve nedeni yazar: "Ortak ilgi: Yemek, Seyahat".
- Dil Ortakları listesinde ortak ilgiler ♥ ile, kişi profilinde ortak hobiler yeşil görünür.
- Ben ekranında "İlgi alanların" kartı; ilgi seçilmemişse Bağlantı'da davet şeridi.
- Şema 8: profil.ilgiler (varsayılan boş; mevcut veriler korunur).
- Düzeltme: aynı bildirim art arda dokunuşlarda üst üste yığılmıyor (ör. ayarlarda "Kaydedildi").

## 0.4.0 — 16.10.2026 · HelloTalk düzeni: sıkı, dolu, kullanıcı dostu

- Yoğunluk: daha küçük aralıklar, ince üst çubuk (geri · başlık · simgeler), düz liste satırları, tam genişlik alt menü; ekranlar daha az kaydırılıyor.
- Sohbetler ("Dil Sohbetleri"): üstte hızlı erişim simgeleri, arama, Tümü / Çevrimiçi / İnsanlar / Yapay zekâ hapları, avatar + bayrak + son mesaj + zaman satırları, sana uygun ortak önerisi.
- Bağlantı ("Dil Ortakları Bul"): Tümü / Sana uygun / Çevrimiçi / Yeni / Seviyeme yakın sekmeleri, dil hapları, yaş-cinsiyet-hızlı yanıt süzgeci, dil çifti (EN ⇄ TR + seviye noktaları), yaş rozeti, "x dk önce aktifti", rozetler, el sallama (selam), otomatik eşleşme kartı (uyum yüzdesi ve nedenleri).
- Kişi profili: noktalı dünya kapağı, yerel saat, büyük avatar + bayrak + çevrimiçi noktası, yaş, @kullanıcı adı, dil çifti, uyum, katılma günü, hobiler, meslek, gezilecek yerler, Profil / Dil Anları sekmeleri; altta Takip · Sohbet · Selam çubuğu; şikâyet/engelle "…" menüsünde.
- Dil Anları: arama + bildirim + yaz; Güncel / Senin için / Başkalarına yardım et / Takip sekmeleri; takip et, beğen, yorum, düzelt, paylaş; satır içi yorum önizlemesi.
- Pratik: tek afiş (yapay zekâ / gerçek kişi), uygulama simgeleri, günün döngüsü; yinelenen bölümler ve üstte kalan Konuş düğmesi kaldırıldı.
- Ben (Profil): avatar, dil çifti, takip sayıları, günlük seri ve tekrar kutuları, Dil Anları satırı, Öğrenme merkezi simgeleri.
- Sanal kullanıcı sayısı 10'a çıktı (ABD, Avustralya, Hindistan, Kore eklendi). Yaş, etkinlik ve rozetler TEST verisidir ve öyle yazılır.

## 0.3.0 — 16.10.2026 · Gerçek English Prime görünümü + HelloTalk içeriği

- English Prime'ın kendi 3B ikonları (30 ikon, webp) uygulamaya gömüldü: alt menü, sayfa başlıkları, Pratik kutuları, Profil menüsü, Ayarlar grupları.
- Zemin ve renkler English Prime'dan: koyu mat zemin (köşeden ışık alan degrade), petrol-yeşili mücevher kartlar, altın düğmeler, serif çerçeveli başlıklar; açık tema da aynı dille.
- Pratik: seçenekler renkli 2 sütunlu kutular (Senaryolar, Telaffuz, Hata Hafızası, Gelişimim).
- Profil: HelloTalk "Ben" menüsü (Ayarlar, Hata Hafızam, Senaryolar, Dil Anları, Dil partneri bul).
- Ayarlar: üstte 6 renkli grup kutusu; dokununca ilgili bölüme kayar.
- Sanal kullanıcılar (TEST): çizim profil resimleri ve ülke bayrakları; Dil Anları gönderilerinde görseller.

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

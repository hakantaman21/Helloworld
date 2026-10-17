# Sunucu hazırlığı (v0.26.0)

Bu klasör **sunucunun kendisi değildir**. Sunucu kurulduğunda (öneri: Supabase = Postgres + kimlik + depolama + gerçek zamanlı) ne kurulacağını ve istemcinin sunucudan ne beklediğini yazar. Amaç: sunucu geldiğinde uygulama kodunun değişmemesi, yalnız `kaynak/veri/sunucu-ayari.js` içindeki `adres` alanının doldurulması.

| Dosya | Ne |
| --- | --- |
| `SOZLESME.md` | İstemci ↔ sunucu sözleşmesi: giden kutusu kanalları, gövdeler, yanıtlar, bildirimler |
| `sema.sql` | Postgres tabloları ve satır düzeyi güvenlik (RLS) taslağı; 3 uygulama tek veritabanında |
| `YONETIM-MERKEZI.md` | Tek yönetim merkezi (3 uygulama için 1 yönetici uygulaması) önerisi ve depo/Vercel düzeni |

## İstemcide hazır olanlar

- **Giden kutusu** (`kaynak/cekirdek/sunucu.js`, `v.giden`, şema 21): sunucuya gidecek her iş (destek kaydı, geri alma, hesap durumu, ayar, kişi tercihi, arkadaşlık askısı) şimdiden kuyruğa yazılıyor. Her iş benzersiz kimlik taşır (`idempotency-key`). Sunucu bağlanınca sırayla gönderilir, başarılı olanlar silinir, sıra korunur.
- **Sunucuda AYNEN çalışacak saf kurallar** (istemcideki kural tek başına aşılabilir; sunucu aynı kuralı yeniden uygular):
  - `cekirdek/topluluk-kurallari.js`: yanıtsız mesaj sınırı, fotoğraf ve iletişim bilgisi izinleri, telefon/sayı ayrımı
  - `cekirdek/test-erisim.js` → sunucuda `erisebilir(gonderen, alici)`: engel, hesap askısı
  - `cekirdek/iletisim-saatleri.js`: alıcının saat diliminde teslim zamanı (`teslimDurumu`, `sonrakiUygunAn`)
  - `cekirdek/destek.js › onemSiniflandir` + `veri/destek-kurallari.js`: şikâyet ön ayıklama
  - `cekirdek/paketler.js`: günlük yeni kişi sınırı
  - `cekirdek/veri-sozlesmesi.js`: kayıt/yedek doğrulama
- **Hesap durumu** (`cekirdek/hesap.js`), **iletişim saatleri**, **destek kayıtları** sunucu tablolarıyla birebir alan adlarına sahip.

## Sunucu olmadan yapılamayanlar (issue #1'de takipte)

1. Gerçek hesap ve giriş (e-posta/Google/Apple), çok cihaz
2. Gerçek kişilerle mesajlaşma, teslim kuyruğu (iletişim saatleri sunucuda bekletme), okundu bilgisi
3. Uygulama kapalıyken bildirim (Web Push / FCM), sessiz saatlere uyan gönderim
4. Sesli sohbet odaları (WebRTC; öneri: LiveKit) ve planlanmış sesli sohbet/arama
5. Yönetim merkezi (şikâyet kuyruğu, yanıt, askıya alma/silme yetkisi, denetim kaydı)
6. Rehberde uygulamayı kullananları bulma (numaraların tek yönlü özetiyle eşleştirme)
7. Ödeme doğrulama (Google Play Faturalandırma / Stripe) ve 3 uygulama arası üyelik/indirim doğrulaması
8. Gerçek yapay zekâ sağlayıcısı (anahtar yalnız sunucuda; istemciye kısa ömürlü belirteç)
9. Gerçek hesap silme (sunucudaki tüm veri + fotoğraflar)

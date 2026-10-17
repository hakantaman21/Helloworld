# İstemci ↔ sunucu sözleşmesi (taslak, v0.26.0)

Tüm istekler `SUNUCU.adres` altındadır, JSON gövde, oturum çerezi ya da kısa ömürlü belirteç. **Anahtar istemciye yazılmaz.**

## Giden kutusu kanalları (istemci → sunucu)

Her istek: `POST /{kanal}` · başlık `idempotency-key: <is.kimlik>` · gövde `{ kimlik, uygulama, zaman, veri }`.
Yanıt `2xx` → başarılı, iş silinir. `409` → aynı kimlik zaten alınmış, başarılı sayılır. Diğerleri → yeniden denenir (en çok 8), sıra korunur.

| Kanal | `veri` | Sunucu ne yapar |
| --- | --- | --- |
| `destek` | `{ kimlik, tur, kategori, metin, hedef, zaman, onem, yol }` | `destek_kayitlari`na yazar; `onemSiniflandir` sunucuda YENİDEN çalışır (istemciye güvenilmez); `acil` ise yönetim merkezine anlık bildirim |
| `destekGeriAl` | `{ kimlik }` | Durum `alindi/inceleniyor` ise `geriAlindi` |
| `hesap` | `{ askida: bool }` ya da `{ guvende: zaman }` | Hesap durumu; askıda profil aramada görünmez, gelen mesaj reddedilir |
| `ayar` | `{ bildirimSaatleri }` | Teslim kuyruğu bu saatleri kullanır |
| `kisiTercih` | `{ kimlik, tercih }` | Arkadaş başına haber/bildirim süzgeci |
| `arkadaslik` | `{ kimlik, islem: 'aski'|'askiKaldir', bitis }` | Askı süresi; süre bitince sunucu kaldırır |
| `engel` | `{ kimlik, engelli: bool }` | Engel (iki yönlü görünmezlik) |
| `mesaj` | `{ alici, metin, foto }` | `erisebilir` + topluluk kuralları + iletişim saati → hemen teslim ya da `teslim_zamani` ile bekletme |

## Sunucu → istemci

| Uç | Ne |
| --- | --- |
| `GET /destek?sonra=<zaman>` | Kullanıcının kayıtları ve yanıtları (istemcide `destek.js › yanitEkle` ile birleştirilir) |
| `GET /bildirimler?sonra=<zaman>` | Kutu öğeleri (`kat`: mesaj, arkadas, anlar, ogrenme, hesap, uygulama, destek) |
| Web Push | Yanıt geldi, mesaj teslim edildi, planlı sohbet hatırlatması. Gönderimde **alıcının uygulama/arkadaş saatleri** uygulanır |
| Gerçek zamanlı kanal | Mesaj, yazıyor, okundu (Supabase Realtime) |

## Kurallar (sunucuda zorunlu)

- Günlük yeni kişi sınırı (`paketler.js`), yanıtsız mesaj sınırı, fotoğraf/iletişim izinleri (`topluluk-kurallari.js`).
- Karşılıklı gizlilik (`arkadaslik.js › karsilikli`): sunucu veriyi ZATEN süzülmüş döndürür.
- 18 yaş altı hesaplar yetişkinlerle eşleşmez (Y27); `resit` nedenli şikâyet → `acil`.
- Yönetim işlemleri (askıya alma, silme, yanıt) `denetim_kaydi`na yazılır.

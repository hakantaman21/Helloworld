# Tek yönetim merkezi (öneri, v0.26.0)

**Soru (Hakan, 17.10):** Admin ayrı uygulama olacaksa her uygulama için iki uygulama mı olacak? Üç uygulama × iki = altı uygulama sürdürülemez.

**Öneri: 3 kullanıcı uygulaması + 1 yönetim merkezi = 4.** Yönetim merkezi üç uygulamanın hepsini tek ekrandan yönetir (üstte uygulama seçici: Tümü · helloworld · English Prime · Yoldaş).

| | Depo (GitHub) | Vercel projesi | Adres |
| --- | --- | --- | --- |
| helloworld | `Helloworld` (bugünkü) | helloworld | helloworld-gules.vercel.app |
| English Prime | kendi deposu (bugünkü) | english-prime | — |
| Yoldaş | `Smart-yoldas-assistans` (bugünkü) | smart-yoldas-assistans | smart-yoldas-assistans-ttuq.vercel.app |
| **Yönetim merkezi** | **yeni tek depo** (`yonetim-merkezi`) | **tek proje** | yalnız yönetici girişiyle |
| Sunucu | Supabase (tek proje, tek veritabanı) | — | `sunucu/sema.sql` |

## Neden tek merkez

- Hakan tek yerden takip eder: şikâyet kuyruğu, geri bildirimler, kullanıcılar, ödemeler, bildirim gönderme — üç uygulama için.
- Yönetici kodu kullanıcı uygulamalarının içinde **yoktur** (tarayıcıda çalışan kod herkesçe indirilebilir; yönetici ekranları ve yetkileri sızmaz).
- Yetki sunucuda: yönetim merkezi de aynı veritabanına bağlanır ama yalnız `rol = yonetici/moderator` olan hesapla açılır (RLS).

## Düzeltmeler nasıl yayılır

- **Kullanıcı uygulamasında düzeltme** (ör. helloworld'de bir ekran): yalnız o deponun `deneme` → onay → `main` akışı. Yönetim merkezini etkilemez, ona dokunmak gerekmez.
- **Ortak kural değişirse** (ör. şikâyet önem kuralı, iletişim saatleri): kural sunucuda tek yerde çalışır; uygulamaların istemci kopyası yalnız ön bilgi verir. Önce sunucu, sonra istemci kopyaları güncellenir. Sözleşme `sunucu/SOZLESME.md`'de; değişiklik issue'da duyurulur.
- **Yeni alan** (ör. kayda yeni sütun): sunucu göçü + yönetim merkezinde gösterim + ilgili uygulamada gönderim. Sürüm notu üçünde de.

## Yönetim merkezinde neler olacak (ilk sürüm)

1. **Şikâyet kuyruğu:** acil en üstte (kırmızı), otomatik süzgeçtekiler ayrı sekmede toplu onay; kayıt açılınca kişi, geçmiş şikâyetleri, ilgili mesaj/Dil Anı.
2. **Yanıt:** hazır şablonlar + serbest metin → kullanıcıya bildirim kutusu ("Destek" kategorisi) + anlık bildirim.
3. **Yaptırımlar:** uyar, yeni kişilere yazmayı 7 gün kısıtla, hesabı askıya al, sil. Hepsi denetim kaydına.
4. **Geri bildirim panosu:** hata/öneri/görüş, uygulamaya göre süzgeç, "yapılacak" listesine aktar.
5. **Duyuru:** seçili uygulamaya, seçili kullanıcı grubuna bildirim (alıcının bildirim saatlerine uyarak).
6. **Üyelik ve ödeme:** üç uygulamadaki üyelikler tek kişide birleşik; çapraz indirim doğrulaması.

## Sırası

1. Supabase projesi + `sema.sql` (ChatGPT/Codex taslağı, Hakan onayı)
2. helloworld `SUNUCU.adres` doldurulur → giden kutusu akar (destek, hesap, ayar)
3. Yönetim merkezi ilk sürüm: şikâyet kuyruğu + yanıt
4. English Prime ve Yoldaş aynı `destek` sözleşmesini ekler (aynı `veri/destek-kurallari.js`)

# Helloworld — Mimari ve CSS kalite sözleşmesi

Durum: Geliştirme standardı. Bu belge tek başına testin çalıştığı anlamına gelmez.

## Değişmez ilkeler

1. Yeni `!important` eklenmez. Var olanlar envantere alınır ve nedenleri incelenerek güvenli şekilde kaldırılır.
2. CSS kuralı üzerine yeni yama yığılmaz. Asıl seçici/kural düzeltilir; eski ve erişilemeyen varyantlar temizlenir.
3. Renk, yüzey, gölge, kabartma, köşe, boşluk ve tipografi merkezi tasarım tokenlarıyla tanımlanır. Modüllerde rastgele renk kodları çoğaltılmaz.
4. Ortak `b-` bileşenleri ortak katmanda, modül seçicileri kendi `shb-`, `kft-`, `anl-`, `bgn-`, `gls-` önekleriyle yönetilir.
5. Bir bileşenin aktif durumu ve davranışı tek kaynaktan yönetilir. Farklı katmanlarda aynı davranış tekrar tanımlanmaz.
6. Gereksiz olay dinleyicisi, yinelenen render ve kaydırma müdahalesi bırakılmaz. Kaydırma ve jestler ilgili yüzeyle sınırlıdır; arka plan kaymaz.
7. Erişilebilir dokunma hedefleri, görünür odak, açık/kapalı/aktif durumları ve koyu temada kontrast korunur.
8. Yeni özelliğin kullanıcıya çalışır görünmesi, gerçek veri ve servis yoksa yasaktır; açıkça `yakında` / `demo` denir.
9. Bir değişiklik ilgili eski stil/işlevi gerçekten gereksiz kılıyorsa aynı PR'da temizlenir. Veri kaybı riski taşıyan temizlik ayrı ve testli yapılır.
10. Her PR: amaç, değişen dosyalar, silinen/yenilenen kurallar, risk, test sonuçları, yapılmayanlar ve sonraki geliştiriciye devir notu içerir.

## Tasarım yönü

Mat siyah/antrasit/gri yüzeyler, kontrollü gölge ve kabartma; eşit/hizalı platform butonları, tablet çipler, beşli alt gezinme; gereksiz süs yerine anlaşılır hiyerarşi. 3D ikonlar özgün, lisanslı ve performans bütçesine uygun tek bir paket olarak ele alınır; rastgele ikon karması yapılmaz.

## Kabul kapıları

- CSS: yeni `!important` sayısı **0**; gereksiz yinelenen seçici ve kullanılmayan tokenlar raporlanır.
- Modül sınırları, tasarım tokenları ve metin anahtarları statik kontrolden geçer.
- `npm run derle`, `npm run robot-sinama` ve varsa mimari denetçiler çalıştırılır.
- Android Chrome: 5 alt sekme, yatay/dikey kaydırma, açılır paneller, koyu tema, geri tuşu, 320px genişlik ve ekran okuyucu kontrol edilir.
- Başarısız veya çalıştırılmamış test **başarılı** diye yazılmaz.
- Hakan onayı olmadan tasarım dalı `deneme` veya `main` ile birleştirilmez.

## Bilgi mimarisi

Sohbet = geçmiş mesajlar; Bağlantı = yeni kişiler; Dil Anları = kişi/grup etkinlik ve paylaşımları; Pratik = gerçek kişi veya AI ile konuşma; Profil/Ayarlar = kimlik, ülke, dil, hedef, seviye, görünüm ve gizlilik.

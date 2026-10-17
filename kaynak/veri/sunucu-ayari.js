// v0.26.0 Sunucu ayarı (tek yer). adres null iken uygulama "yerel" kipte çalışır: sunucuya gidecek işler giden
// kutusunda (v.giden) bekler. Sunucu kurulunca yalnız adres yazılır; kod değişmez. Anahtar/sır BURAYA YAZILMAZ (Y8):
// kimlik doğrulama sunucunun verdiği kısa ömürlü oturum belirteciyle yapılır.
export const SUNUCU = {
  adres: null, // örn. 'https://api.helloworld.app/v1'
  uygulama: 'helloworld', // Yönetim merkezi bu kimlikle uygulamaları ayırır (English Prime: 'english-prime', Yoldaş: 'yoldas')
  kuyrukSiniri: 500,
  enCokDeneme: 8,
};

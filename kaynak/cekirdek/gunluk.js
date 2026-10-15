// Günlük döngü kayıtları: sabah araması, gün içi senaryo, akşam araması; dakika ve kelime sayıları; seri.
import { al, degistir } from './depo.js';
import { tarihAnahtari, gunEkle, haftaBaslangici, saatGeldiMi } from './zaman.js';

export const DONGU_SIRASI = ['sabah', 'senaryo', 'aksam'];

function bosGun() {
  return { sabah: false, senaryo: false, aksam: false, dakika: 0, yeniKelime: [], akicilik: [], dondurulmus: false };
}

export function gunKaydi(anahtar = tarihAnahtari()) {
  return al().gunluk[anahtar] || bosGun();
}

export function gunuGuncelle(fn, anahtar = tarihAnahtari()) {
  degistir((v) => {
    if (!v.gunluk[anahtar]) v.gunluk[anahtar] = bosGun();
    fn(v.gunluk[anahtar]);
  });
}

// Sıradaki adım. Akşam araması saati geçtiyse yapılmamış sabah araması atlanır.
export function siradaki(anahtar = tarihAnahtari()) {
  const gun = gunKaydi(anahtar);
  const gecti = anahtar === tarihAnahtari() && saatGeldiMi(al().profil.ayarlar.aksamSaati);
  return DONGU_SIRASI.find((tur) => !gun[tur] && !(tur === 'sabah' && gecti)) || null;
}

// Bugün tamamlanan gün içi senaryo (varsa).
export function bugunkuSenaryo(anahtar = tarihAnahtari()) {
  return al().gorusmeler.find((g) => g.tarih === anahtar && g.tur === 'senaryo') || null;
}

function aktifMi(gun) {
  return Boolean(gun && (gun.sabah || gun.senaryo || gun.aksam || gun.dondurulmus));
}

// Seri: bugünden geriye kesintisiz aktif gün sayısı. Bugün henüz aktif değilse seri dünden sayılır.
// Bir günlük boşluk, o haftanın dondurma hakkı varsa seriyi bozmaz.
export function seriHesapla(bugun = tarihAnahtari()) {
  const gunluk = al().gunluk;
  let seri = 0;
  let gun = aktifMi(gunluk[bugun]) ? bugun : gunEkle(bugun, -1);
  const kullanilanHaklar = new Set();
  for (let i = 0; i < 400; i++) {
    if (aktifMi(gunluk[gun])) {
      seri++;
    } else {
      const hafta = haftaBaslangici(gun);
      const oncekiAktif = aktifMi(gunluk[gunEkle(gun, -1)]);
      if (seri > 0 && oncekiAktif && !kullanilanHaklar.has(hafta)) kullanilanHaklar.add(hafta);
      else break;
    }
    gun = gunEkle(gun, -1);
  }
  return seri;
}

export function dondurmaHakki(bugun = tarihAnahtari()) {
  const gunluk = al().gunluk;
  const hafta = haftaBaslangici(bugun);
  for (let i = 0; i < 7; i++) {
    const gun = gunEkle(hafta, i);
    if (gun >= bugun) break;
    const onceki = gunEkle(gun, -1);
    const sonraki = gunEkle(gun, 1);
    if (!aktifMi(gunluk[gun]) && aktifMi(gunluk[onceki]) && aktifMi(gunluk[sonraki])) return 0;
  }
  return 1;
}

export function donemOzeti(baslangic, gunSayisi) {
  const gunluk = al().gunluk;
  const ozet = { dakika: 0, kelimeler: new Set(), akicilik: [], tamamGun: 0, gunler: [] };
  for (let i = 0; i < gunSayisi; i++) {
    const anahtar = gunEkle(baslangic, i);
    const gun = gunluk[anahtar];
    ozet.gunler.push({ anahtar, aktif: aktifMi(gun) });
    if (!gun) continue;
    ozet.dakika += gun.dakika;
    gun.yeniKelime.forEach((k) => ozet.kelimeler.add(k));
    ozet.akicilik.push(...gun.akicilik);
    if (gun.sabah && gun.senaryo && gun.aksam) ozet.tamamGun++;
  }
  return ozet;
}

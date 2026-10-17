// Hata Hafızası: ekosistemle ortak kayıt formatı (Anayasa bölüm 8). Kaydın sahibi onu üreten uygulamadır.
import { al, degistir } from './depo.js';
import { tarihAnahtari, gunEkle } from './zaman.js';

export const KAYIT_SEMA_SURUMU = 1;
export const TEKRAR_ARALIKLARI = [1, 3, 7, 14];
export const OGRENILDI_SERISI = 4;
export const OGRENILDI_GUN = 2;

function yeniKimlik() {
  return 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function kayitOlustur({ tur, dogru, kullanici, baglam, seviye, kaynak, kuralId }) {
  const bugun = tarihAnahtari();
  return {
    id: yeniKimlik(),
    tur,
    dogru,
    kullanici,
    baglam,
    seviye,
    kaynak,
    kuralId: kuralId || null,
    ilkGorulme: bugun,
    sonGorulme: bugun,
    tekrar: 0,
    seri: 0,
    durum: 'aktif',
    sonrakiTekrar: gunEkle(bugun, TEKRAR_ARALIKLARI[0]),
    semaSurumu: KAYIT_SEMA_SURUMU,
  };
}

// Aynı kural ve aynı doğru biçimle aktif bir kayıt varsa yenisini açmak yerine onu tazeler.
export function hafizayaEkle(kayitlar) {
  let eklenen = 0;
  degistir((v) => {
    for (const k of kayitlar) {
      const var_olan = v.hafiza.find((h) => h.durum === 'aktif' && h.tur === k.tur && h.dogru.toLowerCase() === k.dogru.toLowerCase());
      if (var_olan) {
        var_olan.sonGorulme = k.sonGorulme;
        var_olan.seri = 0;
        var_olan.sonrakiTekrar = gunEkle(k.sonGorulme, TEKRAR_ARALIKLARI[0]);
      } else {
        v.hafiza.unshift(k);
        eklenen++;
      }
    }
  });
  return eklenen;
}

export function vadesiGelenler(bugun = tarihAnahtari()) {
  return al().hafiza.filter((k) => k.durum === 'aktif' && k.sonrakiTekrar <= bugun);
}

export function tekrarSonucu(id, basarili) {
  degistir((v) => {
    const k = v.hafiza.find((x) => x.id === id);
    if (!k) return;
    const bugun = tarihAnahtari();
    k.tekrar += 1;
    k.sonGorulme = bugun;
    if (basarili) {
      k.seri += 1;
      // v0.16.0: "öğrenildi" için art arda başarı yetmez; başarılar en az iki FARKLI günde olmalı (aynı gün dört doğru
      // kalıcılık göstermez).
      k.basariGunleri = [...new Set([...(k.basariGunleri || []), bugun])].slice(-8);
      if (k.seri >= OGRENILDI_SERISI && k.basariGunleri.length >= OGRENILDI_GUN) k.durum = 'ogrenildi';
      else k.sonrakiTekrar = gunEkle(bugun, TEKRAR_ARALIKLARI[Math.min(k.seri, TEKRAR_ARALIKLARI.length - 1)]);
    } else {
      k.seri = 0;
      k.sonrakiTekrar = gunEkle(bugun, TEKRAR_ARALIKLARI[0]);
    }
  });
}

// "Bu düzeltme yanlış": kayıt hafızadan çıkar, gözden geçirme listesine düşer.
export function itirazEt(kayit) {
  degistir((v) => {
    v.hafiza = v.hafiza.filter((k) => !(k.kuralId === kayit.kuralId && k.kullanici === kayit.kullanici));
    v.itirazlar.unshift({ ...kayit, itirazTarihi: tarihAnahtari() });
  });
}

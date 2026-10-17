// v0.26.0 Sunucu adaptörü ve giden kutusu (outbox). Ekranlar ve servisler sunucuya doğrudan gitmez; işi kuyruga()
// ile bırakır. Yerel kipte (adres yok) iş v.giden'de bekler; sunucu bağlanınca gonderDene() sırayla gönderir,
// başarılıları siler. Her iş benzersiz kimlik taşır: sunucu aynı kimliği ikinci kez alırsa yok sayar (tekil teslim).
// Kanallar ve gövdeleri: sunucu/SOZLESME.md. Bu dosya sunucunun kendisini içermez; yalnız istemci sözleşmesidir.
import { al, degistir } from './depo.js';
import { yeniKimlik } from './kimlik.js';
import { SUNUCU } from '../veri/sunucu-ayari.js';
import { agIstegi } from './ai/ag.js';

export const KANALLAR = ['destek', 'destekGeriAl', 'hesap', 'ayar', 'kisiTercih', 'arkadaslik', 'engel', 'mesaj'];

export function sunucuKipi() { return SUNUCU.adres ? 'bagli' : 'yerel'; }
export function bekleyenler() { return [...(al().giden || [])]; }

export function kuyruga(kanal, veri) {
  if (!KANALLAR.includes(kanal)) throw new Error(`bilinmeyen kanal: ${kanal}`);
  const is = { kimlik: yeniKimlik('g'), kanal, veri, zaman: Date.now(), deneme: 0, uygulama: SUNUCU.uygulama };
  degistir((v) => { v.giden = [...(v.giden || []), is].slice(-SUNUCU.kuyrukSiniri); });
  if (sunucuKipi() === 'bagli') setTimeout(() => { gonderDene(); }, 0);
  return is.kimlik;
}

// Sunucu bağlıyken kuyruğu sırayla gönderir. gonderici: test için değiştirilebilir (varsayılan fetch POST).
let gonderiliyor = false;
export async function gonderDene(gonderici = varsayilanGonderici) {
  if (gonderiliyor || sunucuKipi() !== 'bagli') return { gonderilen: 0 };
  gonderiliyor = true;
  let gonderilen = 0;
  try {
    for (const is of bekleyenler()) {
      let tamam = false;
      try { tamam = await gonderici(is); } catch { tamam = false; }
      degistir((v) => {
        v.giden = (v.giden || []).flatMap((x) => {
          if (x.kimlik !== is.kimlik) return [x];
          if (tamam) return [];
          const d = (x.deneme || 0) + 1;
          return d >= SUNUCU.enCokDeneme ? [{ ...x, deneme: d, durdu: true }] : [{ ...x, deneme: d }];
        });
      });
      if (!tamam) break; // sıra korunur: biri gitmezse sonrakiler beklesin
      gonderilen += 1;
    }
  } finally { gonderiliyor = false; }
  return { gonderilen };
}

async function varsayilanGonderici(is) {
  if (is.durdu) return false;
  const yanit = await agIstegi(`${SUNUCU.adres}/${is.kanal}`, {
    method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': is.kimlik },
    body: JSON.stringify({ kimlik: is.kimlik, uygulama: is.uygulama, zaman: is.zaman, veri: is.veri }), credentials: 'include',
  });
  return yanit.ok || yanit.status === 409; // 409: aynı kimlik zaten alınmış
}

// Profil fotoğrafları: telefondan seçilen ya da çekilen resim cihazda küçültülür (en uzun kenar 480 px, JPEG)
// ve yalnız bu cihazda saklanır; sunucuya gönderilmez. En çok FOTO_SINIRI fotoğraf.
import { al, degistir } from './depo.js';

export const FOTO_SINIRI = 6;
const EN_UZUN_KENAR = 480;
const EN_BUYUK_BOYUT = 220 * 1024;

function dosyaSec() {
  return new Promise((coz) => {
    const girdi = document.createElement('input');
    girdi.type = 'file';
    girdi.accept = 'image/*';
    girdi.addEventListener('change', () => coz(girdi.files && girdi.files[0] ? girdi.files[0] : null), { once: true });
    girdi.click();
  });
}

async function kucult(dosya) {
  const resim = await new Promise((coz, red) => {
    const adres = URL.createObjectURL(dosya);
    const r = new Image();
    r.onload = () => { URL.revokeObjectURL(adres); coz(r); };
    r.onerror = () => { URL.revokeObjectURL(adres); red(new Error('resim')); };
    r.src = adres;
  });
  const oran = Math.min(1, EN_UZUN_KENAR / Math.max(resim.naturalWidth, resim.naturalHeight));
  const tuval = document.createElement('canvas');
  tuval.width = Math.round(resim.naturalWidth * oran);
  tuval.height = Math.round(resim.naturalHeight * oran);
  tuval.getContext('2d').drawImage(resim, 0, 0, tuval.width, tuval.height);
  let kalite = 0.82;
  let veri = tuval.toDataURL('image/jpeg', kalite);
  while (veri.length > EN_BUYUK_BOYUT && kalite > 0.4) { kalite -= 0.12; veri = tuval.toDataURL('image/jpeg', kalite); }
  return veri;
}

// Döner: 'eklendi' | 'vazgecti' | 'sinir' | 'hata'
export async function fotografEkle({ profilYap = false } = {}) {
  const p = al().profil;
  if ((p.fotograflar || []).length >= FOTO_SINIRI && !profilYap) return 'sinir';
  const dosya = await dosyaSec();
  if (!dosya) return 'vazgecti';
  try {
    const veri = await kucult(dosya);
    degistir((v) => {
      const liste = (v.profil.fotograflar || []).slice(0, FOTO_SINIRI - 1);
      v.profil.fotograflar = [veri, ...liste];
      if (profilYap || !v.profil.foto) v.profil.foto = veri;
    });
    return 'eklendi';
  } catch {
    return 'hata';
  }
}

export function profilFotografiYap(veri) {
  degistir((v) => { v.profil.foto = veri; });
}

export function fotografSil(veri) {
  degistir((v) => {
    v.profil.fotograflar = (v.profil.fotograflar || []).filter((f) => f !== veri);
    if (v.profil.foto === veri) v.profil.foto = v.profil.fotograflar[0] || null;
  });
}

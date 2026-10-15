// Tarih yardımcıları. Tarihler yerel saatle 'YYYY-AA-GG' anahtarı olarak tutulur.

function iki(n) { return String(n).padStart(2, '0'); }

export function tarihAnahtari(tarih = new Date()) {
  return `${tarih.getFullYear()}-${iki(tarih.getMonth() + 1)}-${iki(tarih.getDate())}`;
}

export function anahtardanTarih(anahtar) {
  const [y, a, g] = anahtar.split('-').map(Number);
  return new Date(y, a - 1, g);
}

export function gunEkle(anahtar, gun) {
  const t = anahtardanTarih(anahtar);
  t.setDate(t.getDate() + gun);
  return tarihAnahtari(t);
}

export function haftaBaslangici(anahtar) {
  const t = anahtardanTarih(anahtar);
  const haftaGunu = (t.getDay() + 6) % 7; // Pazartesi = 0
  t.setDate(t.getDate() - haftaGunu);
  return tarihAnahtari(t);
}

export function saatGeldiMi(saat, simdi = new Date()) {
  const [s, d] = saat.split(':').map(Number);
  return simdi.getHours() > s || (simdi.getHours() === s && simdi.getMinutes() >= d);
}

export function gunBolumu(simdi = new Date()) {
  const s = simdi.getHours();
  if (s < 12) return 'sabah';
  if (s < 18) return 'ogle';
  return 'aksam';
}

export function sureYaz(saniye) {
  const dk = Math.floor(saniye / 60);
  return `${iki(dk)}:${iki(Math.floor(saniye % 60))}`;
}

export function kisaTarih(anahtar) {
  const t = anahtardanTarih(anahtar);
  return `${iki(t.getDate())}.${iki(t.getMonth() + 1)}`;
}

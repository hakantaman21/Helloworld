// Kısa duyurular: ekranın üstünde görünür, kendiliğinden kaybolur, sağa-sola kaydırılarak kapatılır.
import { h } from './arayuz.js';

export function duyur(mesaj, sure = 3500) {
  const kap = document.getElementById('duyurular');
  if (!kap) return;
  // Aynı metin zaten ekrandaysa eskisini kaldır: art arda dokunuşlarda bildirimler yığılmaz.
  [...kap.children].forEach((c) => { if (c.textContent === String(mesaj)) c.remove(); });
  const oge = h('div', { class: 'b-duyuru', role: 'status' }, mesaj);
  let baslangicX = null;
  let kapandi = false;

  const kapat = () => {
    if (kapandi) return;
    kapandi = true;
    oge.style.opacity = '0';
    setTimeout(() => oge.remove(), 200);
  };

  oge.addEventListener('pointerdown', (e) => { baslangicX = e.clientX; oge.setPointerCapture(e.pointerId); });
  oge.addEventListener('pointermove', (e) => {
    if (baslangicX === null) return;
    oge.style.transform = `translateX(${e.clientX - baslangicX}px)`;
  });
  oge.addEventListener('pointerup', (e) => {
    const fark = e.clientX - (baslangicX ?? e.clientX);
    baslangicX = null;
    if (Math.abs(fark) > 80) kapat();
    else oge.style.transform = '';
  });

  kap.append(oge);
  // Uzun metin daha uzun kalır (okuma süresi: harf başına ~55 ms, en az verilen süre, en çok 12 sn).
  setTimeout(kapat, Math.min(12000, Math.max(sure, String(mesaj).length * 55)));
}

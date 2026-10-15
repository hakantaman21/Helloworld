// Ses hattı: konuşmayı metne çevirme ve koçu seslendirme.
// Şimdilik tarayıcının kendi ses tanıma ve seslendirme motoru kullanılır (en iyi Chrome'da).
// Sunucu bağlanınca bu dosyanın arkasına canlı sesli AI bağlantısı takılır; ekranlar değişmez.
import { izinDurumu } from '../izin.js';

const TanimaSinifi = window.SpeechRecognition || window.webkitSpeechRecognition;

export const destek = {
  tanima: Boolean(TanimaSinifi),
  sentez: 'speechSynthesis' in window,
};

const HIZLAR = { yavas: 0.8, normal: 1, hizli: 1.15 };

function sesSec() {
  const sesler = window.speechSynthesis.getVoices();
  return (
    sesler.find((s) => /^en-US/i.test(s.lang) && /Google|Samantha|Natural|Aria|Jenny/i.test(s.name)) ||
    sesler.find((s) => /^en-(US|GB)/i.test(s.lang)) ||
    sesler.find((s) => /^en/i.test(s.lang)) ||
    null
  );
}

if (destek.sentez) {
  // Bazı tarayıcılar ses listesini geç yükler; erkenden tetikleyelim.
  window.speechSynthesis.getVoices();
}

// Koçun cümlesini seslendirir; bitince ya da iptal edilince çözülür.
export function soyle(metin, hiz = 'normal') {
  return new Promise((coz) => {
    if (!destek.sentez || !metin) { coz(); return; }
    const soz = new SpeechSynthesisUtterance(metin);
    soz.lang = 'en-US';
    const ses = sesSec();
    if (ses) soz.voice = ses;
    soz.rate = HIZLAR[hiz] || 1;
    let bitti = false;
    const bitir = () => { if (!bitti) { bitti = true; coz(); } };
    soz.onend = bitir;
    soz.onerror = bitir;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(soz);
    // Güvenlik ağı: bazı tarayıcılar onend olayını kaçırır.
    setTimeout(bitir, 1200 + metin.length * 90);
  });
}

export function sus() {
  if (destek.sentez) window.speechSynthesis.cancel();
}

// Bir konuşma turunu dinler. Kullanıcı susarsa (sessizlikMs) onSessizlik çağrılır; ipucu çekmecesi bunu kullanır.
export function dinle({ onBasladi, onAra, onSonuc, onSessizlik, onHata, sessizlikMs = 3000 }) {
  if (!destek.tanima) throw new Error('tanima-desteklenmiyor');
  if (izinDurumu() !== 'verildi') throw new Error('izin-yok');

  const tanima = new TanimaSinifi();
  tanima.lang = 'en-US';
  tanima.interimResults = true;
  tanima.continuous = false;
  tanima.maxAlternatives = 1;

  let konustu = false;
  let iptal = false;
  let kesin = '';
  let guven = 0;
  const zamanlayici = setTimeout(() => { if (!konustu && !iptal && onSessizlik) onSessizlik(); }, sessizlikMs);

  tanima.onspeechstart = () => {
    konustu = true;
    if (onBasladi) onBasladi();
  };
  tanima.onresult = (olay) => {
    let ara = '';
    for (let i = olay.resultIndex; i < olay.results.length; i++) {
      const sonuc = olay.results[i];
      if (sonuc.isFinal) {
        kesin += sonuc[0].transcript;
        guven = sonuc[0].confidence || guven;
      } else {
        ara += sonuc[0].transcript;
      }
    }
    if (!konustu && (kesin || ara)) { konustu = true; if (onBasladi) onBasladi(); }
    if (onAra) onAra((kesin + ara).trim());
  };
  tanima.onerror = (olay) => {
    if (!iptal && onHata) onHata(olay.error);
  };
  tanima.onend = () => {
    clearTimeout(zamanlayici);
    if (iptal) return;
    iptal = true;
    if (onSonuc) onSonuc({ metin: kesin.trim(), guven });
  };

  tanima.start();

  return {
    bitir() { try { tanima.stop(); } catch (hata) { /* zaten bitmiş */ } },
    iptal() {
      iptal = true;
      clearTimeout(zamanlayici);
      try { tanima.abort(); } catch (hata) { /* zaten bitmiş */ }
    },
  };
}

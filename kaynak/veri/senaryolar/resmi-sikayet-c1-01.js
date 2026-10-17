// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.16.0'da eklendi (C1).
export default {
  kimlik: "resmi-sikayet-c1-01",
  alan: "resmi",
  seviye: "C1",
  baslik: {"tr": "Fatura hatası için resmî şikâyet ve üst birime aktarma", "en": "Escalating a billing complaint"},
  durum: {"tr": "Üç aydır internet faturan yanlış kesiliyor ve iki kez aradığın hâlde düzelmedi. Müşteri hizmetlerinde sorunu net bir zaman çizelgesiyle anlatıp iade ve üst birime aktarma istemelisin.", "en": "Your internet bill has been wrong for three months and two calls have not fixed it. With customer service you need to set out a clear timeline and ask for a refund and escalation."},
  roller: { koc: {"tr": "Müşteri hizmetleri temsilcisi", "en": "Customer service agent"}, aksan: "Amerikan" },
  gorev: { aciklama: {"tr": "Zaman çizelgesini özetle, net bir sonuç iste (iade + düzeltme) ve çözülmezse üst birime aktarılmasını talep et.", "en": "Summarise the timeline, ask for a clear outcome (refund + correction) and request escalation if it is not resolved."}, kelimeler: ["refund", "escalate", "reference", "timeline", "overcharged", "supervisor"] },
  hedefKaliplar: [{"kalip": "To summarise, ...", "anahtar": "to summarise"}, {"kalip": "What I am asking for is ...", "anahtar": "asking for"}, {"kalip": "I would like this escalated to ...", "anahtar": "escalated"}],
  anahtarKelimeler: [{"en": "overcharged", "tr": "fazla ücretlendirilmiş"}, {"en": "refund", "tr": "iade"}, {"en": "reference number", "tr": "başvuru numarası"}, {"en": "escalate", "tr": "üst birime aktarmak"}, {"en": "supervisor", "tr": "yetkili / amir"}, {"en": "in writing", "tr": "yazılı olarak"}, {"en": "goodwill credit", "tr": "iyi niyet indirimi"}],
  acilis: { koc: "Thank you for calling. How can I help you today?", ipucu: ["To summarise, I have been overcharged for three months and this is my third call.", "I’m calling about a billing error that still hasn’t been fixed after two calls."], dallar: [{"kelimeler": ["summarise", "three months", "third"], "koc": "I’m sorry to hear that. Let me pull up your account."}, {"kelimeler": ["billing", "error", "fixed"], "koc": "I’m sorry about that. Let me take a look."}] },
  adimlar: [
    { koc: "I can see a price change in March. It might be a promotional rate that ended.", ipucu: ["My contract guarantees this price for twelve months, so that can’t be the reason.", "I was told on both previous calls that it was a system error."], dallar: [{"kelimeler": ["contract", "guarantees", "twelve"], "koc": "You’re right, I can see the guarantee here."}, {"kelimeler": ["told", "previous", "system"], "koc": "I can see notes from those calls."}] },
    { koc: "What would you like us to do?", ipucu: ["What I am asking for is a full refund of the difference and a corrected bill from now on.", "I’d like a refund for all three months and written confirmation."], dallar: [{"kelimeler": ["refund", "difference", "corrected"], "koc": "That sounds reasonable."}, {"kelimeler": ["written", "confirmation", "three"], "koc": "I can email you a confirmation."}] },
    { koc: "I can only refund the last month myself.", ipucu: ["In that case, I would like this escalated to a supervisor today.", "Could you give me a reference number and tell me when a supervisor will call me?"], dallar: [{"kelimeler": ["escalated", "supervisor"], "koc": "Understood, I’ll escalate it now."}, {"kelimeler": ["reference", "number", "call"], "koc": "Your reference is CX-4471; you’ll hear back within 48 hours."}] },
  ],
  ustAdim: { koc: "A supervisor offers a goodwill credit instead of a full refund. Do you accept?", ipucu: ["I appreciate the offer, but the overcharge was your error, so I expect a full refund.", "I could accept it if it covers the full amount and the bill is corrected."] },
  sapmalar: [],
  seviyeVaryasyonlari: {"alt": "Temsilci hemen iade yapar; kullanıcı yalnız sorunu ve isteğini söyler.", "ust": "Temsilci sorumluluğu kullanıcıya yükler; kullanıcı sözleşme ve kayıtlara dayanarak ısrar eder."},
  kapanis: "I’ve escalated your case. You’ll receive a written confirmation by email within the hour.",
  karneOdagi: ["gecmis-zaman", "did-yalin", "how-much"],
  kulturelNot: {"tr": "İngilizce konuşulan ülkelerde şikâyette sakin ama kararlı ton, zaman çizelgesi ve başvuru numarası istemek en etkili yoldur; sonucu yazılı istemek olağandır.", "en": "In English-speaking countries a calm but firm tone, a clear timeline and asking for a reference number are the most effective way to complain; asking for the outcome in writing is normal."},
};

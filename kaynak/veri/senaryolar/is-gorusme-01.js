// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.12.0'da eklendi.
export default {
  kimlik: "is-gorusme-01",
  alan: "is",
  seviye: "B1",
  baslik: {"tr": "İş görüşmesi", "en": "Job interview"},
  durum: {"tr": "Bir şirkette iş görüşmesindesin; işe alım uzmanı seni tanımak istiyor.", "en": "You are in a job interview; the recruiter wants to get to know you."},
  roller: { koc: {"tr": "İşe alım uzmanı", "en": "Recruiter"}, aksan: "İngiliz" },
  gorev: { aciklama: {"tr": "Kendini tanıt, deneyimini anlat ve şirket hakkında bir soru sor.", "en": "Introduce yourself, describe your experience and ask a question about the company."}, kelimeler: ["experience", "team", "project", "skills", "job", "company"] },
  hedefKaliplar: [{"kalip": "I have worked as ... for ... years.", "anahtar": "I have worked"}, {"kalip": "I am good at ...", "anahtar": "good at"}, {"kalip": "Could you tell me more about ...?", "anahtar": "Could you tell me"}],
  anahtarKelimeler: [{"en": "experience", "tr": "deneyim"}, {"en": "strength", "tr": "güçlü yön"}, {"en": "deadline", "tr": "son tarih"}, {"en": "team", "tr": "ekip"}, {"en": "salary", "tr": "maaş"}, {"en": "responsibility", "tr": "sorumluluk"}, {"en": "opportunity", "tr": "fırsat"}],
  acilis: { koc: "Thanks for coming in today. Could you tell me a little about yourself?", ipucu: ["I am a software developer from Istanbul.", "I have worked as an accountant for five years."], dallar: [{"kelimeler": ["developer", "software"], "koc": "Interesting, a developer."}, {"kelimeler": ["worked", "years"], "koc": "That is good experience."}] },
  adimlar: [
    { koc: "What are your main strengths?", ipucu: ["I am good at solving problems.", "I work well in a team."], dallar: [{"kelimeler": ["problems", "solving"], "koc": "Problem solving is important here."}, {"kelimeler": ["team"], "koc": "Teamwork matters a lot to us."}] },
    { koc: "Tell me about a difficult project and what you did.", ipucu: ["Last year we had a very short deadline, so I planned the work in small steps.", "I helped my team when a colleague was ill."], dallar: [{"kelimeler": ["deadline"], "koc": "Good, you stayed calm."}, {"kelimeler": ["helped", "team"], "koc": "That shows responsibility."}] },
    { koc: "Do you have any questions for us?", ipucu: ["Could you tell me more about the team?", "What does a normal day look like?"], dallar: [{"kelimeler": ["team"], "koc": "The team has eight people and is very friendly."}, {"kelimeler": ["day"], "koc": "We start at nine with a short meeting."}] },
  ],
  ustAdim: { koc: "Our team uses AI tools every day. How would you use them in this job, and what would you be careful about?", ipucu: ["I would use them for first drafts, but I would always check the results.", "I would not share private customer data with them."] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Uzman yavaş konuşur, kısa cevap kabul eder.", ust: "Uzman yapay zekâ araçlarını nasıl kullanacağını sorar; kullanıcı fikrini gerekçelendirir." },
  kapanis: "Thank you, it was nice to meet you. We will be in touch next week.",
  karneOdagi: ["meslek-a", "gecmis-zaman", "more-better"],
  kulturelNot: {"tr": "İngiltere'de görüşme sonunda soru sormak ilgili olduğunu gösterir; maaşı ilk görüşmede sormamak daha yaygındır.", "en": "In the UK asking questions at the end shows interest; asking about salary in the first interview is less common."},
};

#!/usr/bin/env python3
"""Davranış sınaması (v0.14.0): ekranların dört durumu sözleşmesinin gerçekten çalıştığını tarayıcıda dener.
DORT_DURUM bildirimi yetmez; bu betik her ana ekranı test verisiyle açar ve şunları denetler:
  - sayfa hatası (pageerror) yok, "Bir şeyler ters gitti" hata kutusu çıkmıyor (hazır durumu),
  - boş veriyle açılınca ekran çökmeden boş durum kutusu (.b-durum[data-durum=bos]) ya da içerik gösteriyor,
  - çevrimdışı olayı gelince kullanıcıya duyuru çıkıyor.
Kullanım: python3 araclar/davranis-sinama.py [sürüm]   (teslim/KonusmaKocu-v<sürüm>.html; Playwright + Chromium gerekir)
"""
import asyncio, json, pathlib, sys
from playwright.async_api import async_playwright

KOK = pathlib.Path(__file__).resolve().parent.parent
EKRANLAR = ['sohbetler', 'kesfet', 'bugun', 'dil-anlari', 'gelisim', 'ayarlar', 'hafiza', 'senaryolar', 'karne', 'telaffuz', 'profil', 'mesaj?k=test-lucia']

def veri(test_acik):
    return {"semaSurumu": 7, "test": {"acik": test_acik, "anlar": [], "sohbetler": {}, "engelli": [], "sikayetler": []},
            "profil": {"ad": "Deneme", "kendiniTanim": "basit", "seviye": "A2", "kurulumTamam": True, "tanismaYapildi": True, "yasOnayi": True,
                       "mikrofonIzni": "sorulmadi", "anaDil": "tr", "ogrenilenDil": "en", "rol": "ogrenen", "dilHedefi": "", "tanitimMetni": "",
                       "ayarlar": {"sabahSaati": "08:30", "aksamSaati": "21:00", "duzeltmeYogunlugu": "orta", "kocHizi": "normal", "tema": "koyu",
                                   "yaziliMod": False, "saglayici": "demo", "arayuzDili": "tr", "gorunum": "dengeli"}},
            "hafiza": [], "itirazlar": [], "gunluk": {}, "gorusmeler": [], "sonGorusme": None, "yarimKalan": None,
            "tamamlananSenaryolar": {}, "aramaDurumu": {}, "olcum": {"aiCagrisi": 0, "tahminiMaliyet": 0}}

async def main():
    surum = sys.argv[1] if len(sys.argv) > 1 else json.loads((KOK / 'package.json').read_text())['version']
    adres = (KOK / 'teslim' / f'KonusmaKocu-v{surum}.html').as_uri()
    hatalar = []
    async with async_playwright() as p:
        t = await p.chromium.launch()
        for test_acik in (False, True):
            s = await (await t.new_context(viewport={'width': 360, 'height': 780})).new_page()
            sayfa_hatalari = []
            s.on('pageerror', lambda e: sayfa_hatalari.append(str(e)))
            await s.goto(adres)
            await s.evaluate("(v) => localStorage.setItem('kk:veri', JSON.stringify(v))", veri(test_acik))
            await s.reload(); await s.wait_for_timeout(300)
            for e in EKRANLAR:
                await s.evaluate(f"location.hash = '#/{e}'"); await s.wait_for_timeout(350)
                if await s.evaluate("!!document.querySelector('.b-durum[data-durum=hata], [role=alert].b-durum')"):
                    hatalar.append(f'{e} (test {"açık" if test_acik else "kapalı"}): hata durumu çizildi')
                if not await s.evaluate("(document.getElementById('uygulama').innerText || '').trim().length > 20"):
                    hatalar.append(f'{e}: ekran boş kaldı')
            await s.evaluate("window.dispatchEvent(new Event('offline'))"); await s.wait_for_timeout(200)
            if not await s.evaluate("document.querySelectorAll('.b-duyuru').length > 0"):
                hatalar.append('çevrimdışı olayında duyuru çıkmadı')
            hatalar += [f'sayfa hatası: {x}' for x in sayfa_hatalari]
        await t.close()
    if hatalar:
        print('✗ Davranış sınaması:'); [print('  - ' + h) for h in hatalar]; sys.exit(1)
    print(f'✓ Davranış sınaması: {len(EKRANLAR)} ekran × 2 kip (boş veri, test modu), çevrimdışı duyurusu — sorun yok.')

asyncio.run(main())

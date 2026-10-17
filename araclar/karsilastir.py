#!/usr/bin/env python3
"""Önceki sürümle karşılaştırma (Hakan kuralı, v0.10.0): "Bir şey yaparken önceki ile de karşılaştır."

Kullanım:
  python3 araclar/karsilastir.py 0.9.2 0.10.0                 # tüm ana ekranlar, açık tema
  python3 araclar/karsilastir.py 0.9.2 0.10.0 sohbetler koyu  # tek ekran, koyu tema

teslim/KonusmaKocu-v<sürüm>.html dosyalarını aynı test verisiyle (test modu açık, 8 test sohbeti) açar,
her ekranın tam sayfa görüntüsünü yan yana koyar (karsilastirma/<ekran>.png) ve ekranda görünen
etiketlerin (düğme, başlık, sekme) farkını yazar: "- " önceki sürümde olup yenisinde OLMAYAN öğedir —
bilerek kaldırılmadıysa kayıptır. Gerekli: pip install playwright pillow (Chromium kurulu olmalı).
"""
import asyncio, json, sys, pathlib
from playwright.async_api import async_playwright
from PIL import Image

KOK = pathlib.Path(__file__).resolve().parent.parent
EKRANLAR = ['sohbetler', 'kesfet', 'bugun', 'dil-anlari', 'gelisim', 'profil', 'ayarlar']

VERI = """(tema) => { const n = Date.now(); const gun = new Date().toLocaleDateString('sv');
const d = { semaSurumu: 7, test: { acik: true, anlar: [], sohbetler: {}, engelli: [], sikayetler: [] },
 profil: { ad: 'Hakan', kendiniTanim: 'basit', seviye: 'A2', kurulumTamam: true, tanismaYapildi: true, yasOnayi: true, mikrofonIzni: 'sorulmadi', anaDil: 'tr', ogrenilenDil: 'en', rol: 'ogrenen', dilHedefi: '', tanitimMetni: '',
  ayarlar: { sabahSaati: '08:30', aksamSaati: '21:00', duzeltmeYogunlugu: 'orta', kocHizi: 'normal', tema, yaziliMod: false, saglayici: 'demo', arayuzDili: 'tr', gorunum: 'dengeli' } },
 hafiza: [], itirazlar: [], gunluk: { [gun]: { sabah: true, akicilik: [], dakika: 6, yeniKelime: ['cozy', 'commute'] } }, gorusmeler: [], sonGorusme: null, yarimKalan: null, tamamlananSenaryolar: {},
 aramaDurumu: { [gun]: { bildirim: 2, reddedildi: { sabah: true, aksam: true }, ertelendi: {} } }, olcum: { aiCagrisi: 0, tahminiMaliyet: 0 } };
['test-lucia','test-kenji','test-amira','test-tom','test-marie','test-carlos','test-emma','test-jack'].forEach((k, i) => {
 d.test.sohbetler[k] = { mesajlar: [{ kim: 'ben', metin: 'Hi! How are you?', zaman: n - i * 36e5 }, { kim: 'o', metin: 'Great, thanks! Shall we practise?', zaman: n - i * 36e5 + 6e4 }] }; });
localStorage.setItem('kk:veri', JSON.stringify(d)); }"""

ETIKETLER = """() => { const g = new Set(); const kok = document.getElementById('uygulama') || document.body;
kok.querySelectorAll('button, a, h1, h2, h3, [role=tab], .b-sekme, .b-uygulama, input[placeholder]').forEach((e) => {
 const m = (e.getAttribute('aria-label') || e.innerText || e.getAttribute('placeholder') || '').replace(/\\s+/g, ' ').trim();
 if (m && m.length < 60) g.add(e.tagName.toLowerCase() + ': ' + m); });
document.querySelectorAll('.b-gezinme a').forEach((a) => g.add('alt-menü: ' + a.innerText.replace(/\\s+/g, ' ').trim()));
return [...g]; }"""


async def ekran_al(tarayici, surum, ekran, tema, klasor):
    ctx = await tarayici.new_context(viewport={'width': 360, 'height': 780}, device_scale_factor=2, has_touch=True, is_mobile=True)
    s = await ctx.new_page()
    await s.goto((KOK / 'teslim' / f'KonusmaKocu-v{surum}.html').as_uri())
    await s.evaluate(VERI, tema)
    await s.reload(); await s.wait_for_timeout(400)
    await s.evaluate(f"location.hash = '#/{ekran}'"); await s.wait_for_timeout(800)
    # Kaydırma alanı (#uygulama ya da belge) tam boyutuyla görüntülensin diye görüntü alanını içerik kadar uzat.
    yuk = await s.evaluate("Math.max(document.documentElement.scrollHeight, (document.getElementById('uygulama') || {}).scrollHeight || 0)")
    await s.set_viewport_size({'width': 360, 'height': min(int(yuk) + 120, 4000)}); await s.wait_for_timeout(300)
    yol = klasor / f'{ekran}-v{surum}.png'
    await s.screenshot(path=str(yol))
    etiketler = await s.evaluate(ETIKETLER)
    await ctx.close()
    return yol, etiketler


async def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    eski, yeni = sys.argv[1], sys.argv[2]
    ekranlar = [sys.argv[3]] if len(sys.argv) > 3 and sys.argv[3] != 'hepsi' else EKRANLAR
    tema = sys.argv[4] if len(sys.argv) > 4 else 'acik'
    klasor = KOK / 'karsilastirma'; klasor.mkdir(exist_ok=True)
    async with async_playwright() as p:
        t = await p.chromium.launch()
        for ekran in ekranlar:
            (y1, e1), (y2, e2) = await ekran_al(t, eski, ekran, tema, klasor), await ekran_al(t, yeni, ekran, tema, klasor)
            a, b = Image.open(y1), Image.open(y2)
            birlesik = Image.new('RGB', (a.width + b.width + 20, max(a.height, b.height)), 'white')
            birlesik.paste(a, (0, 0)); birlesik.paste(b, (a.width + 20, 0))
            birlesik.save(klasor / f'{ekran}.png'); y1.unlink(); y2.unlink()
            kayip, yeniler = sorted(set(e1) - set(e2)), sorted(set(e2) - set(e1))
            print(f'\n== {ekran}: v{eski} → v{yeni}  ({klasor / (ekran + ".png")})')
            for k in kayip: print('  - ' + k)
            for k in yeniler: print('  + ' + k)
            if not kayip and not yeniler: print('  (görünen etiketler aynı)')
        await t.close()

asyncio.run(main())

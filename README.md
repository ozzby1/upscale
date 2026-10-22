# upscale
Minimalistický AI upscaler. Obrázky se zpracovávají pouze v prohlížeči.

## Struktura

- `index.html`, `cs/index.html` – markup a texty pro jednotlivé jazyky
- `app.js` – sdílená logika aplikace (obě jazykové verze načítají stejný soubor)
- `illustration-worker.js` – inference ONNX modelů (Fotografie, Ilustrace) ve Web Workerech
- `sw.js`, `manifest.webmanifest`, `icons/` – instalovatelná aplikace (PWA), offline režim, sdílení z Androidu a hlavičky pro vícevláknové WASM
- `tools/convert-realesr-general.py` – převod Real-ESRGAN general x4v3 (+ wdn) do ONNX bez PyTorch; výsledek ověřuje `models/photo/model.onnx.sha256`
- `scripts/build-site.sh`, `scripts/test-site.sh` – sestavení `_site/` a testy (používají oba workflow)
- `tests/` – testy spouštěné v CI před nasazením; `browser-e2e.cjs` běží ve skutečném Chromiu se skutečnými modely

## Funkce

- **AI modely:** Fotografie (Real-ESRGAN general x4v3 s nastavitelným potlačením šumu), Ilustrace (Real-ESRGAN animevideo v3), Rychlý (ESRGAN slim).
- **Porovnání modelů na výřezu:** klik do obrázku zvolí oblast, všechny modely ji zpracují vedle sebe.
- **Tiskový formát:** A5–A2, fotoformáty nebo vlastní rozměr; aplikace sama zvolí AI 2×/4× a přepočítá výstup přesně na formát.
- **PWA:** instalace, offline režim po prvním použití, „Sdílet do“ na Androidu, vícevláknový výpočet díky izolaci přes service worker.

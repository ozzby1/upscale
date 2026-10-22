# upscale
Minimalistický AI upscaler. Obrázky se zpracovávají pouze v prohlížeči.

## Struktura

- `index.html`, `cs/index.html` – markup a texty pro jednotlivé jazyky
- `app.js` – sdílená logika aplikace (obě jazykové verze načítají stejný soubor)
- `illustration-worker.js` – inference modelu pro ilustrace ve Web Workeru
- `tests/` – testy spouštěné v CI před nasazením; `browser-e2e.cjs` běží ve skutečném Chromiu se skutečnými modely

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


## Search visibility and English guide

- `info/index.html`: static English guide and visible FAQ; linked in the footer.
- `robots.txt`, `sitemap.xml`, `llms.txt`: copied by the build, alongside the app.
- Home pages have self-canonical URLs, reciprocal EN/CS/x-default annotations,
  social metadata and Schema.org data. `app.js` keeps localized metadata consistent.
- `tests/seo.cjs` checks the assembled site; browser e2e also checks localized
  metadata and responsive header alignment.

Keyword research checked on 2026-10-22. The public Semrush report for
[image-upscaling.net](https://www.semrush.com/website/image-upscaling.net/overview/)
shows estimated monthly Google search volumes in its **United States database,
September 2026**: `ai image upscaler` 18,100; `ai upscaler` 18,100;
`picture upscaler` 8,100; `image upscaling` 1,900;
`free ai image upscaler` 1,600. These are a competitor report's sampled keyword
set, not a complete worldwide keyword ranking. They are third-party estimates,
not this site's traffic or a Google Keyword Planner export. Do not add them
or interpret overlapping variants as unique users.

[MicroSaaSHQ](https://microsaashq.com/keyword-research/free-image-upscaler)
also reports 27.1K monthly searches for `free image upscaler`, but the public
page does not establish a comparable geography or methodology; it is supporting
intent evidence, not part of the ranked comparison above.

The homepage targets free AI enlargement; the guide answers model choice,
2×/4× pixel dimensions, 4K, transparency, batch processing, privacy/offline
conditions and printing/DPI questions. No fake reviews, quality benchmarks,
unlimited-size claims or keyword-stuffed doorway pages are used.

Implementation references:
- [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features)
- [Google guidance on generative AI optimization](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [OpenAI crawlers](https://developers.openai.com/api/docs/bots)
- [llms.txt proposal](https://llmstxt.org/)

`llms.txt` is an optional factual summary, not an indexing permission or a ranking
guarantee. Google does not require or use it specially for AI search. Structured
FAQ data matches visible answers, but this general-purpose tool should not
expect Google's restricted FAQ rich results. No ratings have been invented to
qualify for software rich results.

After deployment, submit `https://photoupscale.online/sitemap.xml` in the verified
Google Search Console and Bing Webmaster Tools properties, request indexing of
the English homepage and guide, and monitor actual impressions and queries.
The current change does not create webmaster accounts or claim to guarantee
indexing, rankings or recommendations.

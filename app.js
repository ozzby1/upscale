// Paths work at a domain root, a GitHub Pages project path, and /cs/.
const language = /\/cs(?:\/index\.html)?\/?$/.test(location.pathname) ? 'cs' : 'en';
const locale = language === 'cs' ? 'cs-CZ' : 'en-US';
const basePath = location.pathname.replace(/\/cs(?:\/index\.html)?\/?$/, '/').replace(/index\.html$/, '');
const appBase = new URL(basePath.endsWith('/') ? basePath : basePath + '/', location.origin);
const assetUrl = path => new URL(path, appBase).href;
const messages = {
  "en": {
    "pageTitle": "Free AI Image Upscaler – 2× & 4× | Photoupscale.online",
    "description": "Upscale photos and illustrations 2× or 4× with free AI in your browser. No sign-up or watermark. Private image processing, batch exports and print-size settings.",
    "home": "Upscale — home",
    "local": "Processed on your device",
    "heading": "More pixels.",
    "headingAccent": "More detail.",
    "intro": "Free AI image upscaler for photos and illustrations. Enlarge 2× or 4×, right in your browser.",
    "workspace": "Image upscaler",
    "drop": "Drop your images here",
    "choose": "Choose images",
    "dropHint": "or click to browse",
    "formats": "JPG, PNG, WebP · original file up to 20 MB",
    "change": "Change image",
    "originalAlt": "Original image",
    "resultAlt": "AI upscaled image",
    "original": "Original",
    "result": "AI result",
    "compare": "Compare original and upscaled image",
    "compareHint": "Drag to compare",
    "scale": "Upscale",
    "scaleGroup": "Upscale factor",
    "dpi": "Print resolution",
    "dpiHelp": "DPI controls print size. Use 2× or 4× to add pixels.",
    "sourceDpi": "Original DPI: {value}",
    "unknown": "not specified",
    "format": "Export format",
    "formatNote": "Transparent areas will be white in JPG.",
    "upscale": "Upscale image",
    "download": "Download {format}",
    "preparing": "Preparing AI…",
    "cancel": "Cancel",
    "progress": "Upscaling progress",
    "privacy": "Your image stays on your device. No image is uploaded.",
    "footer": "No sign-up. No watermark.",
    "dpiInvalid": "Choose a DPI between 72 and 600.",
    "jpegMemory": "Could not save JPG. Try a smaller image.",
    "jpegFailed": "Could not save JPG.",
    "fileType": "Please choose a JPG, PNG, or WebP image.",
    "fileSize": "The original file is too large. Upload an image up to 20 MB before upscaling.",
    "inputSize": "This image is too large. Use an image up to 12 MP and 12,000 px per side.",
    "fileOpen": "Could not open this file. Choose another JPG, PNG, or WebP image.",
    "cancelling": "Cancelling…",
    "memory": "Your device does not have enough memory for this image. Try 2× or a smaller image.",
    "failed": "Upscaling failed. Try a smaller image or choose the other AI model.",
    "outputSize4": "The result would be too large for your browser. Choose 2× or a smaller image (output up to {mp} MP and 8,192 px per side).",
    "outputSize2": "The result would be too large for your browser. Use a smaller image (output up to {mp} MP and 8,192 px per side).",
    "loadFailed": "Could not load AI. Check your connection and try again.",
    "backendFailed": "Could not start AI processing. Try refreshing the page.",
    "cancelled": "Cancelled",
    "loading": "Loading AI… This may take a moment on first use.",
    "processor": "Switching to processor…",
    "loadingModel": "Loading AI model…",
    "browserMemory": "Your browser does not have enough memory. Try a smaller image.",
    "processing": "Upscaling image… {percent}%",
    "encoding": "Preparing your image…",
    "saveFailed": "Could not save the image. Try a smaller file.",
    "done": "Done",
    "validDpi": "Enter a valid DPI.",
    "pngDpi": "Could not write DPI to PNG.",
    "pixelDimensions": "Output dimensions",
    "printDimensions": "Print size",
    "quality": "JPG quality",
    "qualityHelp": "Higher quality creates a larger file.",
    "exportSize": "File size: {size}",
    "detail": "Detail at 100%",
    "detailTitle": "Compare at equal size · output at 100%",
    "detailHelp": "The output is shown at 100%. Both views have equal dimensions; the original uses standard browser interpolation. Scroll to explore.",
    "close": "Close",
    "batch": "Batch upscaling",
    "batchChoose": "Choose images",
    "batchHelp": "Up to 10 images, 20 MB each, 100 MB total. The settings above apply to all images.",
    "batchStart": "Upscale all images",
    "batchZip": "Download ZIP",
    "batchCount": "{count} images selected",
    "batchLimit": "Choose up to 10 images, up to 100 MB in total.",
    "pending": "Waiting",
    "working": "Processing…",
    "cancelledShort": "Cancelled",
    "batchProgress": "Image {current} of {total} · {message}",
    "batchComplete": "{done} of {total} images ready. Download the completed files in ZIP.",
    "zipPreparing": "Preparing ZIP…",
    "zipLimit": "The output queue reached the 100 MB limit. Download completed files and process the remaining images separately.",
    "batchDpi": "One DPI value for all images",
    "batchDimensions": "Varies by image",
    "batchFormatNote": "JPG uses white for transparent areas. PNG keeps transparency.",
    "singleImage": "Back to one image",
    "zipName": "processed-images.zip",
    "skipped": "Skipped",
    "batchNone": "No files are ready. Check the errors next to each image.",
    "detailSource": "Original · enlarged {scale}× for comparison",
    "smoothing": "Edge smoothing",
    "smoothingProgress": "Smoothing edges…",
    "aiModel": "AI model",
    "modelPhoto": "Photo",
    "modelIllustration": "Illustration",
    "illustrationHelp": "For drawings, cartoons and graphics with clean outlines. Not suited to photos, where it can smooth away fine detail. The model always computes 4×, so 2× takes about as long as 4×.",
    "illustrationLoading": "Loading illustration model…",
    "illustrationFailed": "The illustration model could not start. Try again or choose Photo.",
    "illustrationGpu": "GPU",
    "illustrationCpu": "CPU (slower)",
    "illustrationEta": " · about {time} left",
    "illustrationSeconds": "{count} s",
    "illustrationMinutes": "{count} min",
    "cpuPower": "CPU performance",
    "cpuAuto": "Automatic",
    "cpuHigh": "Higher performance",
    "cpuHelp": "Higher performance runs up to six tasks at once, depending on your device. Uses more CPU and memory and may slow other apps. Choose before starting.",
    "illustrationCpuCount": "CPU ×{count}",
    "settings": "Image settings",
    "batchUpdating": "Updating ZIP with the new settings… {current}/{total}",
    "batchUpdated": "ZIP updated with the new settings.",
    "photoHelp": "Real-ESRGAN for photos: adds detail and removes noise and JPEG artefacts. More demanding – without a graphics card it takes longer; the first run downloads about 10 MB.",
    "photoLoading": "Loading photo model…",
    "photoFailed": "The photo model could not start. Try again or choose Illustration.",
    "denoise": "Noise reduction",
    "sizeMode": "Output size",
    "sizeScale": "Scale 2× / 4×",
    "sizePrint": "Print format",
    "paper": "Format",
    "paperCustom": "Custom size",
    "paperWidth": "Width (cm)",
    "paperHeight": "Height (cm)",
    "paperInvalid": "Enter a width and height between 1 and 300 cm.",
    "printPlan": "AI {factor}× and resampling to {width} × {height} px.",
    "printLow": "The image is too small for this format: after AI 4× it reaches only about {dpi} DPI; the rest is ordinary resampling.",
    "printEnough": "The image already has enough pixels; AI 2× adds detail and is then reduced.",
    "printBatch": "Each image is fitted to {paper} at the chosen DPI.",
    "printTooLarge": "This format and DPI would exceed the output limit ({mp} MP, 8,192 px per side). Choose a smaller format or lower DPI.",
    "printRescale": "The new format or DPI needs a different AI scale. Click Upscale again.",
    "previewOpen": "Compare models on a crop",
    "previewTitle": "Model comparison · {size} px crop · {scale}×",
    "previewHelp": "Each model processes only the selected area (without edge smoothing). Choose the one you like and upscale the whole image.",
    "previewSource": "Original (browser enlargement)",
    "previewUse": "Use this model",
    "previewProgress": "Preview: {model} ({current}/{total})",
    "previewTime": "{seconds} s",
    "previewDone": "Done. Choose a model for the whole image."
  },
  "cs": {
    "pageTitle": "Zvětšení obrázků pomocí AI zdarma | Photoupscale.online",
    "description": "Zvětšete fotografie a ilustrace 2× nebo 4× pomocí AI přímo v prohlížeči. Zdarma, bez registrace a vodoznaku. Hromadné zpracování a rozměry pro tisk.",
    "home": "Upscale — úvod",
    "local": "Zpracování ve vašem zařízení",
    "heading": "Více pixelů.",
    "headingAccent": "Více detailů.",
    "intro": "Zvětšete fotografie a ilustrace pomocí AI 2× nebo 4×. Zdarma a přímo v prohlížeči.",
    "workspace": "Zvětšení obrázku",
    "drop": "Přetáhněte sem obrázky",
    "choose": "Vybrat obrázky",
    "dropHint": "nebo klikněte pro výběr",
    "formats": "JPG, PNG, WebP · nahrávaný soubor do 20 MB",
    "change": "Změnit obrázek",
    "originalAlt": "Původní obrázek",
    "resultAlt": "Obrázek zvětšený pomocí AI",
    "original": "Původní",
    "result": "AI výsledek",
    "compare": "Porovnat původní obrázek a výsledek",
    "compareHint": "Posunutím porovnáte výsledek",
    "scale": "Zvětšení",
    "scaleGroup": "Měřítko zvětšení",
    "dpi": "Rozlišení pro tisk",
    "dpiHelp": "DPI určuje velikost pro tisk. Počet pixelů změníte volbou 2× nebo 4×.",
    "sourceDpi": "Původní DPI: {value}",
    "unknown": "neuvedeno",
    "format": "Formát exportu",
    "formatNote": "Průhledná místa budou v JPG bílá.",
    "upscale": "Zvětšit obrázek",
    "download": "Stáhnout {format}",
    "preparing": "Připravuji AI…",
    "cancel": "Zrušit",
    "progress": "Průběh zvětšování",
    "privacy": "Váš obrázek zůstává ve vašem zařízení. Nikam ho neodesíláme.",
    "footer": "Bez registrace. Bez vodoznaku.",
    "dpiInvalid": "Zvolte DPI od 72 do 600.",
    "jpegMemory": "Nepodařilo se uložit JPG. Zkuste menší obrázek.",
    "jpegFailed": "Nepodařilo se uložit JPG.",
    "fileType": "Vyberte prosím obrázek ve formátu JPG, PNG nebo WebP.",
    "fileSize": "Nahrávaný soubor je příliš velký. Limit 20 MB platí pro obrázek před zvětšením.",
    "inputSize": "Obrázek je příliš velký. Použijte vstup nejvýše 12 Mpx a 12 000 px na stranu.",
    "fileOpen": "Tento soubor se nepodařilo otevřít. Vyberte jiný JPG, PNG nebo WebP.",
    "cancelling": "Ruším zpracování…",
    "memory": "Zařízení nemá dostatek paměti pro tento obrázek. Zkuste měřítko 2× nebo menší obrázek.",
    "failed": "Zvětšení se nepodařilo. Zkuste menší obrázek nebo zvolte jiný AI model.",
    "outputSize4": "Výsledek by byl příliš velký pro prohlížeč. Zvolte 2× nebo použijte menší obrázek (výstup nejvýše {mp} Mpx a 8 192 px na stranu).",
    "outputSize2": "Výsledek by byl příliš velký pro prohlížeč. Použijte menší obrázek (výstup nejvýše {mp} Mpx a 8 192 px na stranu).",
    "loadFailed": "Nepodařilo se načíst AI. Zkontrolujte připojení a zkuste to znovu.",
    "backendFailed": "Nepodařilo se spustit AI výpočet. Zkuste stránku obnovit.",
    "cancelled": "Zrušeno",
    "loading": "Načítám AI… Při prvním použití to může chvíli trvat.",
    "processor": "Přepínám na výpočet přes procesor…",
    "loadingModel": "Načítám AI model…",
    "browserMemory": "Prohlížeč nemá dostatek paměti. Zkuste menší obrázek.",
    "processing": "Zvětšuji obrázek… {percent} %",
    "encoding": "Připravuji obrázek ke stažení…",
    "saveFailed": "Nepodařilo se uložit obrázek. Zkuste menší soubor.",
    "done": "Hotovo",
    "validDpi": "Zadejte platné DPI.",
    "pngDpi": "Nepodařilo se zapsat DPI do PNG.",
    "pixelDimensions": "Výsledné rozměry",
    "printDimensions": "Velikost pro tisk",
    "quality": "Kvalita JPG",
    "qualityHelp": "Vyšší kvalita znamená větší soubor.",
    "exportSize": "Velikost souboru: {size}",
    "detail": "Detail ve 100 %",
    "detailTitle": "Porovnání ve stejné velikosti · výstup 100 %",
    "detailHelp": "Výstup je zobrazený ve 100 %. Oba náhledy mají stejné rozměry; originál je zvětšený běžnou interpolací prohlížeče. Posouváním prohlédnete detaily.",
    "close": "Zavřít",
    "batch": "Hromadné zvětšení",
    "batchChoose": "Vybrat obrázky",
    "batchHelp": "Nejvýše 10 obrázků, každý do 20 MB, celkem do 100 MB. Nastavení výše platí pro všechny obrázky.",
    "batchStart": "Zvětšit všechny obrázky",
    "batchZip": "Stáhnout ZIP",
    "batchCount": "Vybrané obrázky: {count}",
    "batchLimit": "Vyberte nejvýše 10 obrázků o celkové velikosti do 100 MB.",
    "pending": "Čeká",
    "working": "Zpracovávám…",
    "cancelledShort": "Zrušeno",
    "batchProgress": "Obrázek {current} z {total} · {message}",
    "batchComplete": "Hotovo {done} z {total} obrázků. Dokončené soubory stáhnete v ZIPu.",
    "zipPreparing": "Připravuji ZIP…",
    "zipLimit": "Výstupy ve frontě dosáhly limitu 100 MB. Stáhněte dokončené soubory a zbývající obrázky zpracujte zvlášť.",
    "batchDpi": "Stejné DPI pro všechny obrázky",
    "batchDimensions": "Podle obrázku",
    "batchFormatNote": "JPG nahradí průhlednost bílou. PNG průhlednost zachová.",
    "singleImage": "Zpět na jeden obrázek",
    "zipName": "upravene-obrazky.zip",
    "skipped": "Přeskočeno",
    "batchNone": "Žádný soubor není připravený. Zkontrolujte chyby u jednotlivých obrázků.",
    "detailSource": "Původní · pro porovnání zvětšený {scale}×",
    "smoothing": "Vyhlazení hran",
    "smoothingProgress": "Vyhlazuji hrany…",
    "aiModel": "AI model",
    "modelPhoto": "Fotografie",
    "modelIllustration": "Ilustrace",
    "illustrationHelp": "Pro kresby, komiksy a grafiku s čistými obrysy. Na fotografie se nehodí – může vyhladit jemné detaily. Model vždy počítá 4×, proto 2× trvá zhruba stejně dlouho jako 4×.",
    "illustrationLoading": "Načítám model pro ilustrace…",
    "illustrationFailed": "Model pro ilustrace se nepodařilo spustit. Zkuste to znovu nebo zvolte Fotografie.",
    "illustrationGpu": "Grafika",
    "illustrationCpu": "Procesor (pomalejší)",
    "illustrationEta": " · zbývá přibližně {time}",
    "illustrationSeconds": "{count} s",
    "illustrationMinutes": "{count} min",
    "cpuPower": "Výkon procesoru",
    "cpuAuto": "Automaticky",
    "cpuHigh": "Vyšší výkon",
    "cpuHelp": "Vyšší výkon zapojí až šest výpočtů současně podle možností zařízení. Více zatíží procesor a paměť a může zpomalit ostatní aplikace. Zvolte před spuštěním.",
    "illustrationCpuCount": "Procesor ×{count}",
    "settings": "Nastavení obrázku",
    "batchUpdating": "Aktualizuji ZIP podle nového nastavení… {current}/{total}",
    "batchUpdated": "ZIP je aktualizovaný podle nového nastavení.",
    "photoHelp": "Real-ESRGAN pro fotografie: doplní detaily a potlačí šum a JPEG artefakty. Náročnější – bez grafické karty počítá déle; první spuštění stáhne asi 10 MB.",
    "photoLoading": "Načítám model pro fotografie…",
    "photoFailed": "Model pro fotografie se nepodařilo spustit. Zkuste to znovu nebo zvolte Ilustrace.",
    "denoise": "Potlačení šumu",
    "sizeMode": "Výstupní velikost",
    "sizeScale": "Měřítko 2× / 4×",
    "sizePrint": "Tiskový formát",
    "paper": "Formát",
    "paperCustom": "Vlastní rozměr",
    "paperWidth": "Šířka (cm)",
    "paperHeight": "Výška (cm)",
    "paperInvalid": "Zadejte šířku a výšku od 1 do 300 cm.",
    "printPlan": "AI {factor}× a přepočet na {width} × {height} px.",
    "printLow": "Obrázek na tento formát nestačí: po AI 4× vychází jen asi {dpi} DPI, zbytek dopočítá běžné převzorkování.",
    "printEnough": "Obrázek už má dost pixelů; AI 2× doplní detaily a výsledek se zmenší.",
    "printBatch": "Každý obrázek se přizpůsobí formátu {paper} při zvoleném DPI.",
    "printTooLarge": "Tento formát a DPI by překročily limit výstupu ({mp} Mpx, 8 192 px na stranu). Zvolte menší formát nebo nižší DPI.",
    "printRescale": "Nový formát nebo DPI vyžaduje jiné AI zvětšení. Klikněte znovu na Zvětšit obrázek.",
    "previewOpen": "Porovnat modely na výřezu",
    "previewTitle": "Porovnání modelů · výřez {size} px · {scale}×",
    "previewHelp": "Každý model zpracuje jen vybranou oblast (bez vyhlazení hran). Vyberte, který se vám líbí, a zvětšete celý obrázek.",
    "previewSource": "Původní (zvětšení prohlížečem)",
    "previewUse": "Použít tento model",
    "previewProgress": "Náhled: {model} ({current}/{total})",
    "previewTime": "{seconds} s",
    "previewDone": "Hotovo. Vyberte model pro celý obrázek."
  }
};
function t(key, values = {}) {
  return messages[language][key].replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}
function localize() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');
  document.querySelector('meta[name="description"]').content = t('description');
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of document.querySelectorAll('[data-i18n-aria]')) el.setAttribute('aria-label', t(el.dataset.i18nAria));
  for (const el of document.querySelectorAll('[data-i18n-alt]')) el.alt = t(el.dataset.i18nAlt);
  for (const el of document.querySelectorAll('[data-i18n-title]')) el.title = t(el.dataset.i18nTitle);
  for (const link of document.querySelectorAll('[data-language]')) {
    link.href = new URL(link.dataset.language === 'cs' ? 'cs/' : './', appBase).href;
    if (link.dataset.language === language) link.setAttribute('aria-current', 'page');
  }
  document.querySelector('.brand').href = new URL(language === 'cs' ? 'cs/' : './', appBase).href;
}

const isKnownMessage = value => Object.values(messages[language]).includes(value);


// Physical resolution metadata only. Never infer DPI from pixel dimensions.
const text = (bytes, start, length) => String.fromCharCode(...bytes.subarray(start, start + length));
const isDpi = value => Number.isFinite(value) && value > 0 && value <= 10000000;
const resolution = (x, y, source) => isDpi(x) && isDpi(y) ? { x, y, source } : null;

function exifResolution(bytes, start, end) {
  try {
    if (text(bytes, start, 6) === 'Exif\0\0') start += 6;
    const little = text(bytes, start, 2) === 'II';
    if (!little && text(bytes, start, 2) !== 'MM') return null;
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const u16 = offset => { if (offset < start || offset + 2 > end) throw new Error(); return view.getUint16(offset, little); };
    const u32 = offset => { if (offset < start || offset + 4 > end) throw new Error(); return view.getUint32(offset, little); };
    if (u16(start + 2) !== 42) return null;
    const ifd = start + u32(start + 4), count = u16(ifd);
    if (count > 1024 || ifd + 2 + count * 12 > end) return null;
    let x, y, unit = 2, orientation = 1;
    for (let index = 0; index < count; index++) {
      const offset = ifd + 2 + index * 12, tag = u16(offset), type = u16(offset + 2), length = u32(offset + 4);
      if ((tag === 0x11a || tag === 0x11b) && type === 5 && length === 1) {
        const pointer = start + u32(offset + 8), denominator = u32(pointer + 4);
        const value = denominator ? u32(pointer) / denominator : NaN;
        if (tag === 0x11a) x = value; else y = value;
      }
      if (type === 3 && length === 1) {
        if (tag === 0x128) unit = u16(offset + 8);
        if (tag === 0x112) orientation = u16(offset + 8);
      }
    }
    if (unit !== 2 && unit !== 3) return null;
    const factor = unit === 3 ? 2.54 : 1;
    return orientation >= 5 && orientation <= 8
      ? resolution(y * factor, x * factor, 'EXIF')
      : resolution(x * factor, y * factor, 'EXIF');
  } catch { return null; }
}

async function readResolution(file) {
  try { return readResolutionBytes(new Uint8Array(await file.arrayBuffer())); }
  catch { return null; }
}

function readResolutionBytes(bytes) {
  try {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (bytes.length >= 8 && view.getUint32(0) === 0x89504e47 && view.getUint32(4) === 0x0d0a1a0a) {
      let exif = null;
      for (let offset = 8; offset + 12 <= bytes.length;) {
        const length = view.getUint32(offset), type = text(bytes, offset + 4, 4), data = offset + 8;
        if (length > bytes.length - offset - 12) return exif;
        if (type === 'pHYs' && length === 9 && bytes[data + 8] === 1) {
          const found = resolution(view.getUint32(data) * 0.0254, view.getUint32(data + 4) * 0.0254, 'PNG');
          if (found) return found;
        }
        if (type === 'eXIf') exif = exifResolution(bytes, data, data + length);
        if (type === 'IEND') break;
        offset += length + 12;
      }
      return exif;
    }
    if (bytes[0] === 0xff && bytes[1] === 0xd8) {
      let jfif = null;
      for (let offset = 2; offset + 4 <= bytes.length;) {
        if (bytes[offset++] !== 0xff) break;
        while (bytes[offset] === 0xff) offset++;
        const marker = bytes[offset++];
        if (marker === 0xda || marker === 0xd9) break;
        if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
        const length = view.getUint16(offset), data = offset + 2, end = offset + length;
        if (length < 2 || end > bytes.length) break;
        if (marker === 0xe1 && text(bytes, data, 6) === 'Exif\0\0') {
          const exif = exifResolution(bytes, data, end);
          if (exif) return exif;
        }
        if (marker === 0xe0 && length >= 16 && text(bytes, data, 5) === 'JFIF\0') {
          const unit = bytes[data + 7], factor = unit === 1 ? 1 : unit === 2 ? 2.54 : 0;
          if (factor) jfif = resolution(view.getUint16(data + 8) * factor, view.getUint16(data + 10) * factor, 'JFIF');
        }
        offset = end;
      }
      return jfif;
    }
    if (bytes.length >= 12 && text(bytes, 0, 4) === 'RIFF' && text(bytes, 8, 4) === 'WEBP') {
      const end = Math.min(bytes.length, view.getUint32(4, true) + 8);
      for (let offset = 12; offset + 8 <= end;) {
        const length = view.getUint32(offset + 4, true), data = offset + 8;
        if (length > end - data) break;
        if (text(bytes, offset, 4) === 'EXIF') return exifResolution(bytes, data, data + length);
        offset = data + length + (length % 2);
      }
    }
  } catch { /* Missing or malformed metadata must not prevent image processing. */ }
  return null;
}

// Pixel dimensions from the file header, read before the browser decodes the
// whole image, so oversized files are rejected without allocating their bitmap.
function readDimensionsBytes(bytes) {
  try {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (bytes.length >= 24 && view.getUint32(0) === 0x89504e47 && text(bytes, 12, 4) === 'IHDR') {
      return { width: view.getUint32(16), height: view.getUint32(20) };
    }
    if (bytes[0] === 0xff && bytes[1] === 0xd8) {
      for (let offset = 2; offset + 4 <= bytes.length;) {
        if (bytes[offset++] !== 0xff) return null;
        while (bytes[offset] === 0xff) offset++;
        const marker = bytes[offset++];
        if (marker === 0xd9 || marker === 0xda) return null;
        if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
        const length = view.getUint16(offset);
        if (length < 2) return null;
        // SOF0–SOF15, excluding DHT (C4), JPG (C8) and DAC (CC).
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { width: view.getUint16(offset + 5), height: view.getUint16(offset + 3) };
        }
        offset += length;
      }
      return null;
    }
    if (bytes.length >= 30 && text(bytes, 0, 4) === 'RIFF' && text(bytes, 8, 4) === 'WEBP') {
      const type = text(bytes, 12, 4), data = 20;
      if (type === 'VP8X') return { width: 1 + (bytes[data + 4] | bytes[data + 5] << 8 | bytes[data + 6] << 16), height: 1 + (bytes[data + 7] | bytes[data + 8] << 8 | bytes[data + 9] << 16) };
      if (type === 'VP8L' && bytes[data] === 0x2f) {
        const b1 = bytes[data + 1], b2 = bytes[data + 2], b3 = bytes[data + 3], b4 = bytes[data + 4];
        return { width: 1 + (b1 | (b2 & 0x3f) << 8), height: 1 + ((b2 >> 6) | b3 << 2 | (b4 & 0x0f) << 10) };
      }
      if (type === 'VP8 ' && bytes[data + 3] === 0x9d && bytes[data + 4] === 0x01 && bytes[data + 5] === 0x2a) {
        return { width: view.getUint16(data + 6, true) & 0x3fff, height: view.getUint16(data + 8, true) & 0x3fff };
      }
    }
  } catch { /* Unknown or malformed headers fall back to the post-decode check. */ }
  return null;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

async function writePngResolution(blob, dpi) {
  if (dpi && (!isDpi(dpi.x) || !isDpi(dpi.y))) throw new Error(t('validDpi'));
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const view = new DataView(bytes.buffer);
  if (view.getUint32(0) !== 0x89504e47 || view.getUint32(4) !== 0x0d0a1a0a) throw new Error(t('pngDpi'));
  const parts = [bytes.subarray(0, 8)];
  for (let offset = 8; offset + 12 <= bytes.length;) {
    const length = view.getUint32(offset), end = offset + length + 12;
    if (end > bytes.length) throw new Error(t('pngDpi'));
    const type = text(bytes, offset + 4, 4);
    // Remove the canvas's default 96 DPI and any previous physical metadata.
    if (type !== 'pHYs') parts.push(bytes.subarray(offset, end));
    if (type === 'IHDR' && dpi) {
      const chunk = new Uint8Array(21), chunkView = new DataView(chunk.buffer);
      chunkView.setUint32(0, 9); chunk.set([112, 72, 89, 115], 4);
      chunkView.setUint32(8, Math.round(dpi.x / 0.0254));
      chunkView.setUint32(12, Math.round(dpi.y / 0.0254)); chunk[16] = 1;
      chunkView.setUint32(17, crc32(chunk.subarray(4, 17))); parts.push(chunk);
    }
    if (type === 'IEND') break;
    offset = end;
  }
  return new Blob(parts, { type: 'image/png' });
}

async function writeJpegResolution(blob, dpi) {
  if (!dpi || !isDpi(dpi.x) || !isDpi(dpi.y) || dpi.x > 65535 || dpi.y > 65535) throw new Error(t('validDpi'));
  const bytes = new Uint8Array(await blob.arrayBuffer());
  if (bytes[0] !== 255 || bytes[1] !== 216) throw new Error(t('jpegFailed'));
  // JFIF APP0: absolute X/Y density in dots per inch. Keep the encoded scan intact.
  const jfif = new Uint8Array([255,224,0,16,74,70,73,70,0,1,1,1,0,0,0,0,0,0]);
  const density = new DataView(jfif.buffer);
  density.setUint16(12, Math.round(dpi.x)); density.setUint16(14, Math.round(dpi.y));
  const parts = [bytes.subarray(0, 2), jfif];
  const view = new DataView(bytes.buffer);
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    const markerStart = offset;
    if (bytes[offset++] !== 255) throw new Error(t('jpegFailed'));
    while (bytes[offset] === 255) offset++;
    const marker = bytes[offset++];
    if (marker === 218 || marker === 217) { parts.push(bytes.subarray(markerStart)); offset = bytes.length; break; }
    if (marker === 1 || (marker >= 208 && marker <= 215)) { parts.push(bytes.subarray(markerStart, offset)); continue; }
    const length = view.getUint16(offset), end = offset + length;
    if (length < 2 || end > bytes.length) throw new Error(t('jpegFailed'));
    if (!(marker === 224 && text(bytes, offset + 2, 5) === 'JFIF\0')) parts.push(bytes.subarray(markerStart, end));
    offset = end;
  }
  if (offset !== bytes.length) throw new Error(t('jpegFailed'));
  return new Blob(parts, { type: 'image/jpeg' });
}


// The illustration runtime is lazy-loaded in a dedicated worker. Cancellation
// terminates it immediately, including an in-flight WASM/GPU call or download.
// The same worker pool runs both ONNX models (Photos and Illustrations).
const onnxModels = {
  illustration: { padding: 32, loading: 'illustrationLoading', failed: 'illustrationFailed' },
  // 34 conv layers: larger receptive field, so more context around each tile.
  photo: { padding: 40, loading: 'photoLoading', failed: 'photoFailed' },
};
let illustrationWorker, illustrationReady, illustrationProvider, illustrationModel = null;
let illustrationWorkers = [];
let illustrationCpuMode = 'auto';
let illustrationThreads = 1, illustrationRequestedThreads = 1, illustrationThreadsBroken = false;
// sw.js adds COOP/COEP headers; once the page is cross-origin isolated, each
// worker can run multi-threaded WASM and fewer workers are needed.
const crossOriginReady = () => typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated === true && !illustrationThreadsBroken;
function illustrationCpuWorkerCount() {
  const cores = Math.max(1, navigator.hardwareConcurrency || 2);
  const memory = navigator.deviceMemory;
  // ~150 MB per worker.
  const limit = memory && memory < 4 ? 1 : memory && memory <= 4 ? 2 : 6;
  if (crossOriginReady()) return Math.max(1, Math.min(limit, cores >= 8 ? 2 : 1));
  const target = illustrationCpuMode === 'high' ? Math.max(2, cores - 1) : cores >= 8 ? 4 : cores >= 4 ? 2 : 1;
  return Math.max(1, Math.min(cores, target, limit));
}
function illustrationThreadCount(workers) {
  if (!crossOriginReady()) return 1;
  const cores = Math.max(1, navigator.hardwareConcurrency || 2);
  const budget = illustrationCpuMode === 'high' ? cores - 1 : Math.ceil(cores / 2);
  return Math.max(1, Math.min(8, Math.floor(budget / workers)));
}
let illustrationRequest = 0;
const illustrationPending = new Map();
// Idle workers hold the model and WASM heap; release them after a quiet period.
let illustrationIdleTimer;
const ILLUSTRATION_IDLE_MS = 60000;
function stopIllustration(error = new DOMException(t('cancelled'), 'AbortError')) {
  clearTimeout(illustrationIdleTimer); illustrationIdleTimer = null;
  for (const worker of illustrationWorkers) worker.terminate();
  illustrationWorkers = []; illustrationWorker = null; illustrationReady = null; illustrationProvider = null; illustrationModel = null;
  for (const request of illustrationPending.values()) request.reject(error);
  illustrationPending.clear();
}
function illustrationMessage(message, transfer = [], worker = illustrationWorker) {
  return new Promise((resolve, reject) => {
    const id = ++illustrationRequest;
    illustrationPending.set(id, { resolve, reject, worker });
    try { worker.postMessage({ ...message, id }, transfer); }
    catch (error) { illustrationPending.delete(id); reject(error); }
  });
}
function createIllustrationWorker(optional = false) {
  const worker = new Worker(assetUrl('./illustration-worker.js?v=6'));
  illustrationWorkers.push(worker);
  worker.onmessage = ({ data }) => {
    const request = illustrationPending.get(data.id);
    if (!request) return;
    illustrationPending.delete(data.id);
    if (data.error) request.reject(Object.assign(new Error(data.error), { illustrationInit: data.initializing, gpuAttempt: data.gpuAttempt })); else request.resolve(data);
  };
  worker.onerror = () => {
    const error = Object.assign(new Error(t(onnxModels[illustrationModel]?.failed || 'illustrationFailed')), { illustrationInit: !illustrationProvider });
    if (!optional) { stopIllustration(error); return; }
    worker.terminate(); illustrationWorkers = illustrationWorkers.filter(item => item !== worker);
    for (const [id, request] of illustrationPending) if (request.worker === worker) {
      illustrationPending.delete(id); request.reject(error);
    }
  };
  return worker;
}
async function startIllustration(cpuOnly, model = 'illustration') {
  if (illustrationReady && illustrationModel !== model) stopIllustration();
  if (!illustrationReady) {
    illustrationModel = model;
    const count = illustrationCpuWorkerCount(), threads = illustrationThreadCount(count);
    illustrationRequestedThreads = threads;
    illustrationWorker = createIllustrationWorker();
    illustrationReady = illustrationMessage({ type: 'init', cpuOnly, model, threads }).then(async result => {
      illustrationProvider = result.provider; illustrationThreads = result.threads || 1;
      // Separate CPU workers use real cores; keep the pool bounded.
      const target = illustrationProvider === 'wasm' ? count : 1;
      while (illustrationWorkers.length < target) {
        const extra = createIllustrationWorker(true);
        try { await illustrationMessage({ type: 'init', cpuOnly: true, model, threads }, [], extra); }
        catch (error) {
          extra.terminate(); illustrationWorkers = illustrationWorkers.filter(worker => worker !== extra);
          if (!illustrationWorker) throw error;
          break;
        }
      }
    }).catch(error => { stopIllustration(error); throw error; });
  }
  try { await illustrationReady; }
  catch (error) {
    // Multi-threaded WASM is new; if it cannot start, fall back to single-threaded workers.
    if (illustrationRequestedThreads > 1 && !illustrationThreadsBroken && error.name !== 'AbortError') {
      illustrationThreadsBroken = true; console.warn('Multi-threaded WASM unavailable; using single-threaded workers.', error);
      return startIllustration(cpuOnly, model);
    }
    throw error;
  }
}
function illustrationOrigins(length, core, stride) {
  const count = Math.max(1, Math.ceil((length - core) / stride) + 1);
  return Array.from({ length: count }, (_, index) => index * stride);
}

// Weighted overlap with a bounded row band. Never allocate a full floating-point
// output image; transparent pixels are restored independently after RGB inference.
function blendIllustrationTile(band, width, height, rgba, x, y, core, stride, factor) {
  const tileSide = core * factor, overlap = (core - stride) * factor;
  const targetX = x * factor, targetY = y * factor;
  const w = Math.min(tileSide, width - targetX), h = Math.min(tileSide, height - targetY);
  for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
    let wx = 1, wy = 1;
    if (x > 0 && px < overlap) wx *= px / overlap;
    if (targetX + tileSide < width && px >= tileSide - overlap) wx *= (tileSide - px) / overlap;
    if (y > 0 && py < overlap) wy *= py / overlap;
    if (targetY + tileSide < height && py >= tileSide - overlap) wy *= (tileSide - py) / overlap;
    const weight = wx * wy, source = (py * tileSide + px) * 4, dest = (py * width + targetX + px) * 4;
    band[dest] += rgba[source] * weight; band[dest + 1] += rgba[source + 1] * weight; band[dest + 2] += rgba[source + 2] * weight; band[dest + 3] += weight;
  }
}
function illustrationBandPixels(band, width, rows) {
  const pixels = new Uint8ClampedArray(width * rows * 4);
  for (let p = 0; p < pixels.length; p += 4) {
    const weight = band[p + 3];
    if (!(weight > 0)) throw new Error('Incomplete illustration tile coverage.');
    pixels[p] = Math.round(band[p] / weight); pixels[p + 1] = Math.round(band[p + 1] / weight); pixels[p + 2] = Math.round(band[p + 2] / weight); pixels[p + 3] = 255;
  }
  return pixels;
}
async function enhanceIllustration(image, factor, options) {
  const { signal, progress } = options;
  clearTimeout(illustrationIdleTimer); illustrationIdleTimer = null;
  validateSize(image.naturalWidth, image.naturalHeight, factor); check(signal);
  const abort = () => stopIllustration();
  signal.addEventListener('abort', abort, { once: true });
  try {
    try { return await renderIllustration(image, factor, options, false); }
    catch (error) {
      if (signal.aborted || (illustrationProvider !== 'webgpu' && !error.gpuAttempt)) throw error;
      stopIllustration(error); progress(0, t('processor'));
      return await renderIllustration(image, factor, options, true);
    }
  } catch (error) {
    stopIllustration(error);
    if (error.illustrationInit && error.name !== 'AbortError') throw new Error(t(onnxModels[options.model || 'illustration'].failed));
    throw error;
  } finally {
    signal.removeEventListener('abort', abort);
    if (illustrationWorkers.length) illustrationIdleTimer = setTimeout(() => stopIllustration(), ILLUSTRATION_IDLE_MS);
  }
}
async function renderIllustration(image, factor, { signal, progress, model = 'illustration', denoise = 0.5 }, cpuOnly) {
  const config = onnxModels[model];
  check(signal); progress(0, t(config.loading));
  await startIllustration(cpuOnly, model); check(signal);
  const { width, height } = validateSize(image.naturalWidth, image.naturalHeight, factor);
  const sourceWidth = image.naturalWidth, sourceHeight = image.naturalHeight;
  // The compact model keeps intermediate tensors at input resolution. Smaller
  // inputs use smaller tiles to avoid spending time on unnecessary padding. On the
  // CPU a larger tile wastes less work on the 32 px context (~25 % less per pixel);
  // WebGPU keeps the smaller tile to bound GPU buffer sizes.
  const maxCore = illustrationProvider === 'webgpu' ? 192 : 256;
  const core = Math.min(maxCore, Math.max(32, Math.ceil(Math.max(sourceWidth, sourceHeight) / 16) * 16)), padding = config.padding, stride = core - 16, side = core + padding * 2;
  const xs = illustrationOrigins(sourceWidth, core, stride), ys = illustrationOrigins(sourceHeight, core, stride);
  const workers = illustrationWorkers.slice();
  const backend = illustrationProvider === 'webgpu' ? t('illustrationGpu') : t('illustrationCpuCount', { count: workers.length * illustrationThreads });
  const started = performance.now();
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = side;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const output = document.createElement('canvas'); output.width = width; output.height = height;
  const out = output.getContext('2d');
  if (!ctx || !out) throw new Error(t('browserMemory'));
  const prepared = bleedSource(image);
  let band, failure = null;
  try {
    band = new Float32Array(width * core * factor * 4);
    const tiles = ys.flatMap(y => xs.map(x => ({ x, y })));
    const total = tiles.length, results = new Array(total);
    // Workers pull tiles from one queue, so none waits for the slowest tile of a
    // chunk. Look-ahead past the current row is bounded to cap memory.
    const lookahead = xs.length + workers.length * 2;
    let next = 0, consumed = 0, finished = 0, waiting = [];
    const notify = () => { const list = waiting; waiting = []; for (const resolve of list) resolve(); };
    const changed = () => new Promise(resolve => waiting.push(resolve));
    const render = ({ x, y }) => {
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, side, side);
      ctx.drawImage(prepared.source, padding - x, padding - y);
      if (x < padding) ctx.drawImage(canvas, padding - x, 0, 1, side, 0, 0, padding - x, side);
      if (y < padding) ctx.drawImage(canvas, 0, padding - y, side, 1, 0, 0, side, padding - y);
      const right = padding + sourceWidth - x, bottom = padding + sourceHeight - y;
      if (right < side) ctx.drawImage(canvas, Math.max(0, right - 1), 0, 1, side, right, 0, side - right, side);
      if (bottom < side) ctx.drawImage(canvas, 0, Math.max(0, bottom - 1), side, 1, 0, bottom, side, side - bottom);
      return ctx.getImageData(0, 0, side, side).data;
    };
    const runWorker = async worker => {
      while (!failure && next < total) {
        if (next - consumed >= lookahead) { await changed(); continue; }
        const index = next++, rgba = render(tiles[index]);
        const result = await illustrationMessage({ type: 'tile', rgba, side, padding, core, factor, denoise }, [rgba.buffer], worker);
        results[index] = result.pixels; finished++; notify();
      }
    };
    const pool = Promise.all(workers.map(worker => runWorker(worker).catch(error => { failure ??= error; notify(); })));
    const report = () => {
      const percent = Math.round(finished / total * 100);
      const seconds = Math.max(1, Math.ceil((performance.now() - started) / Math.max(1, finished) * (total - finished) / 1000));
      const eta = finished && finished < total ? t('illustrationEta', { time: seconds < 60 ? t('illustrationSeconds', { count: seconds }) : t('illustrationMinutes', { count: Math.ceil(seconds / 60) }) }) : '';
      progress(5 + Math.round(finished / total * 92), t('processing', { percent }) + ' · ' + backend + eta);
    };
    for (let row = 0; row < ys.length; row++) {
      const y = ys[row], first = row * xs.length;
      for (let index = first; index < first + xs.length; index++) {
        while (!results[index]) { if (failure) throw failure; check(signal); await changed(); report(); }
      }
      check(signal);
      for (let index = first; index < first + xs.length; index++) {
        blendIllustrationTile(band, width, height, results[index], tiles[index].x, y, core, stride, factor);
        results[index] = true;
      }
      consumed = first + xs.length; notify(); report();
      const rows = row === ys.length - 1 ? height - y * factor : stride * factor;
      out.putImageData(new ImageData(illustrationBandPixels(band, width, rows), width, rows), 0, y * factor);
      band.copyWithin(0, rows * width * 4); band.fill(0, Math.max(0, band.length - rows * width * 4));
      await pause();
    }
    await pool; if (failure) throw failure;
    check(signal);
    out.globalCompositeOperation = 'destination-in'; out.imageSmoothingEnabled = true; out.imageSmoothingQuality = 'high';
    out.drawImage(image, 0, 0, width, height); out.globalCompositeOperation = 'source-over';
    progress(99, t('encoding'));
    const blob = await new Promise(resolve => output.toBlob(resolve, 'image/png'));
    check(signal); if (!blob) throw new Error(t('saveFailed'));
    progress(100, t('done')); return { blob, width, height };
  } finally {
    failure ??= new DOMException(t('cancelled'), 'AbortError');
    band = null; prepared.release(); canvas.width = canvas.height = output.width = output.height = 1;
  }
}

// Networks see RGB only. Filling transparency with white made semi-transparent
// edges lighter once alpha was restored (a white halo on dark backgrounds).
// Give every pixel its true colour and extend edge colours into transparent areas;
// alpha is still restored from the original afterwards.
function bleedSource(image) {
  const width = image.naturalWidth, height = image.naturalHeight;
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const release = () => { canvas.width = canvas.height = 1; };
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) { release(); throw new Error(t('browserMemory')); }
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, width, height), data = pixels.data, count = width * height;
  let transparent = false;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 255) { transparent = true; break; }
  if (!transparent) { release(); return { source: image, release() {} }; }
  // Colours of nearly invisible pixels are heavily quantised; recompute them too.
  const state = new Uint8Array(count), queue = new Int32Array(count);
  for (let p = 0; p < count; p++) if (data[p * 4 + 3] >= 8) state[p] = 1;
  const neighbours = (p, visit) => {
    const x = p % width, y = (p - x) / width;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if ((dx || dy) && x + dx >= 0 && x + dx < width && y + dy >= 0 && y + dy < height) visit(p + dy * width + dx);
    }
  };
  let tail = 0;
  for (let p = 0; p < count; p++) if (!state[p]) neighbours(p, q => { if (state[p] === 0 && state[q] === 1) { state[p] = 2; queue[tail++] = p; } });
  // Breadth-first layers: each pixel takes the mean of already known neighbours.
  for (let head = 0; head < tail;) {
    const end = tail;
    for (let i = head; i < end; i++) {
      const p = queue[i]; let r = 0, g = 0, b = 0, n = 0;
      neighbours(p, q => { if (state[q] === 1) { r += data[q * 4]; g += data[q * 4 + 1]; b += data[q * 4 + 2]; n++; } });
      data[p * 4] = r / n; data[p * 4 + 1] = g / n; data[p * 4 + 2] = b / n;
    }
    for (let i = head; i < end; i++) state[queue[i]] = 1;
    for (let i = head; i < end; i++) neighbours(queue[i], q => { if (state[q] === 0) { state[q] = 2; queue[tail++] = q; } });
    head = end;
  }
  for (let p = 0; p < count; p++) {
    if (!state[p]) data[p * 4] = data[p * 4 + 1] = data[p * 4 + 2] = 255; // fully transparent image
    data[p * 4 + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  return { source: canvas, release };
}

// Local inference only. ESRGAN Slim (RDN) expects and returns RGB in [0, 255].
// Tiles with context keep memory bounded and avoid a full-size output tensor.
let runtimePromise;
let cachedModel;
let cachedScale;

// iOS/iPadOS Safari refuses canvases above 16,777,216 px (4096²); larger
// outputs would fail late with a blank canvas or a null blob.
const canvasLimited = /iP(?:hone|ad|od)/.test(navigator.userAgent || '') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const maxOutputPixels = canvasLimited ? 16777216 : 24000000;
function validateSize(width, height, scale) {
  const w = width * scale, h = height * scale;
  if (w > 8192 || h > 8192 || w * h > maxOutputPixels) {
    const mp = Math.floor(maxOutputPixels / 1e6);
    throw new Error(scale === 4
      ? t('outputSize4', { mp })
      : t('outputSize2', { mp }));
  }
  return { width: w, height: h };
}

const scriptLoads = new Map();
function loadRuntimeScript(path) {
  if (!scriptLoads.has(path)) {
    scriptLoads.set(path, new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = assetUrl(path);
      script.onload = resolve;
      script.onerror = () => { script.remove(); scriptLoads.delete(path); reject(new Error(t('loadFailed'))); };
      document.head.append(script);
    }));
  }
  return scriptLoads.get(path);
}

async function useProcessor(tf) {
  try {
    await loadRuntimeScript('./vendor/tf-backend-wasm.min.js');
    tf.wasm.setWasmPaths(assetUrl('./vendor/'));
    if (await tf.setBackend('wasm')) { await tf.ready(); return; }
  } catch (error) {
    console.warn('WASM unavailable; using JavaScript CPU fallback.', error);
  }
  if (!await tf.setBackend('cpu')) throw new Error(t('backendFailed'));
  await tf.ready();
}

async function runtime() {
  if (!runtimePromise) {
    runtimePromise = (async () => {
      if (!window.tf) await loadRuntimeScript('./vendor/tf.min.js');
      const tf = window.tf;
      const supported = await tf.setBackend('webgl').catch(() => false);
      if (supported) await tf.ready();
      else await useProcessor(tf);
      return tf;
    })().catch(error => { runtimePromise = null; throw error; });
  }
  return runtimePromise;
}

function check(signal) { if (signal.aborted) throw new DOMException(t('cancelled'), 'AbortError'); }
const pause = () => new Promise(resolve => setTimeout(resolve, 0));

async function enhance(image, scale, options) {
  validateSize(image.naturalWidth, image.naturalHeight, scale);
  check(options.signal);
  options.progress(0, t('loading'));
  const tf = await runtime();
  check(options.signal);
  try {
    return await enhanceWithBackend(image, scale, tf, options);
  } catch (error) {
    if (error.name === 'AbortError' || tf.getBackend() !== 'webgl' ||
      !/webgl|texture|memory|allocation|context|shader|backend|kernel/i.test(error.message)) throw error;
    cachedModel?.dispose(); cachedModel = null; cachedScale = null;
    options.progress(0, t('processor'));
    await useProcessor(tf);
    check(options.signal);
    return enhanceWithBackend(image, scale, tf, options);
  }
}

async function enhanceWithBackend(image, scale, tf, { signal, progress }) {
  const size = validateSize(image.naturalWidth, image.naturalHeight, scale);
  check(signal);
  if (!cachedModel || cachedScale !== scale) {
    cachedModel?.dispose(); cachedModel = null; cachedScale = null;
    cachedModel = await tf.loadLayersModel(assetUrl(`./models/x${scale}/model.json`), {
      onProgress: fraction => progress(Math.round(fraction * 5), t('loadingModel')),
    });
    cachedScale = scale;
  }
  check(signal);
  const width = image.naturalWidth, height = image.naturalHeight;
  // 12 px of context on each side; a 32 px CPU tile spent ~3× the useful work on it.
  const tileSize = tf.getBackend() === 'cpu' ? 48 : 64, padding = 12, side = tileSize + 2 * padding;
  const input = document.createElement('canvas'); input.width = input.height = side;
  const ctx = input.getContext('2d', { willReadFrequently: true });
  const tile = document.createElement('canvas'); tile.width = tile.height = tileSize * scale;
  const tileCtx = tile.getContext('2d');
  const output = document.createElement('canvas'); output.width = size.width; output.height = size.height;
  const out = output.getContext('2d');
  if (!ctx || !tileCtx || !out) throw new Error(t('browserMemory'));
  const total = Math.ceil(width / tileSize) * Math.ceil(height / tileSize);
  let completed = 0;
  const prepared = bleedSource(image);
  try {
    for (let y = 0; y < height; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        check(signal);
        // Replicate boundary pixels. Transparent areas were filled by bleedSource.
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, side, side);
        ctx.drawImage(prepared.source, padding - x, padding - y);
        ctx.imageSmoothingEnabled = false;
        if (x < padding) ctx.drawImage(input, padding - x, 0, 1, side, 0, 0, padding - x, side);
        if (y < padding) ctx.drawImage(input, 0, padding - y, side, 1, 0, 0, side, padding - y);
        const right = padding + width - x, bottom = padding + height - y;
        if (right < side) ctx.drawImage(input, Math.max(0, right - 1), 0, 1, side, right, 0, side - right, side);
        if (bottom < side) ctx.drawImage(input, 0, Math.max(0, bottom - 1), side, 1, 0, bottom, side, side - bottom);
        let pixels;
        try {
          pixels = tf.tidy(() => {
            const batch = tf.browser.fromPixels(input, 3).toFloat().expandDims(0);
            const predicted = cachedModel.predict(batch);
            return predicted.squeeze([0]).slice([padding * scale, padding * scale, 0], [tileSize * scale, tileSize * scale, 3]).clipByValue(0, 255).round().toInt();
          });
          const rgb = await pixels.data();
          check(signal);
          const rgba = new Uint8ClampedArray(tile.width * tile.height * 4);
          for (let p = 0, q = 0; p < rgb.length; p += 3, q += 4) {
            rgba[q] = rgb[p]; rgba[q + 1] = rgb[p + 1]; rgba[q + 2] = rgb[p + 2]; rgba[q + 3] = 255;
          }
          tileCtx.putImageData(new ImageData(rgba, tile.width, tile.height), 0, 0);
          out.drawImage(tile, x * scale, y * scale);
        } finally { pixels?.dispose(); }
        completed++;
        progress(5 + Math.round(completed / total * 92), t('processing', { percent: Math.round(completed / total * 100) }));
        await pause();
      }
    }
    check(signal);
    // Keep alpha separate from the RGB neural network; scale it smoothly.
    out.globalCompositeOperation = 'destination-in';
    out.imageSmoothingEnabled = true; out.imageSmoothingQuality = 'high';
    out.drawImage(image, 0, 0, size.width, size.height);
    out.globalCompositeOperation = 'source-over';
    progress(99, t('encoding'));
    const blob = await new Promise(resolve => output.toBlob(resolve, 'image/png'));
    check(signal);
    if (!blob) throw new Error(t('saveFailed'));
    progress(100, t('done'));
    return { blob, ...size };
  } finally {
    prepared.release();
    output.width = output.height = input.width = input.height = tile.width = tile.height = 1;
  }
}



function validateUpload(file) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error(t('fileType'));
  if (file.size > 20 * 1048576) throw new Error(t('fileSize'));
}
const inputTooLarge = (width, height) => width * height > 12000000 || Math.max(width, height) > 12000;
function validateInput(image) {
  if (!image.naturalWidth || inputTooLarge(image.naturalWidth, image.naturalHeight)) throw new Error(t('inputSize'));
}
// Reject oversized images from the header before decoding them; returns the bytes.
async function validateHeader(file) {
  const bytes = new Uint8Array(await file.arrayBuffer()), size = readDimensionsBytes(bytes);
  if (size && inputTooLarge(size.width, size.height)) throw new Error(t('inputSize'));
  return bytes;
}
async function encodeExport(raw, stats, { format, quality, dpi }) {
  if (format === 'png') return writePngResolution(raw, dpi);
  const image = new Image(), url = URL.createObjectURL(raw);
  const canvas = document.createElement('canvas');
  canvas.width = stats.width; canvas.height = stats.height;
  try {
    image.src = url; await image.decode();
    const context = canvas.getContext('2d');
    if (!context) throw new Error(t('jpegMemory'));
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality / 100));
    if (!blob || blob.type !== 'image/jpeg') throw new Error(t('jpegFailed'));
    return writeJpegResolution(blob, dpi);
  } finally { URL.revokeObjectURL(url); canvas.width = canvas.height = 1; }
}
const zipTable = Uint32Array.from({ length: 256 }, (_, n) => {
  for (let k = 0; k < 8; k++) n = (n >>> 1) ^ ((n & 1) ? 0xedb88320 : 0);
  return n >>> 0;
});
async function makeZip(files) {
  const parts = [], directory = []; let offset = 0, directorySize = 0;
  const now = new Date(), dosTime = now.getHours() << 11 | now.getMinutes() << 5 | now.getSeconds() >> 1;
  const dosDate = Math.max(0, now.getFullYear() - 1980) << 9 | (now.getMonth() + 1) << 5 | now.getDate();
  for (const file of files) {
    const name = new TextEncoder().encode(file.name.replace(/[\\/\x00-\x1f]/g, '_'));
    const bytes = new Uint8Array(await file.blob.arrayBuffer());
    let crc = 0xffffffff;
    for (const value of bytes) crc = (crc >>> 8) ^ zipTable[(crc ^ value) & 255];
    crc = (crc ^ 0xffffffff) >>> 0;
    const local = new Uint8Array(30), l = new DataView(local.buffer);
    l.setUint32(0, 0x04034b50, true); l.setUint16(4, 20, true); l.setUint16(6, 0x800, true); l.setUint16(10, dosTime, true); l.setUint16(12, dosDate, true);
    l.setUint32(14, crc, true); l.setUint32(18, bytes.length, true); l.setUint32(22, bytes.length, true); l.setUint16(26, name.length, true);
    const central = new Uint8Array(46), c = new DataView(central.buffer);
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x800, true); c.setUint16(12, dosTime, true); c.setUint16(14, dosDate, true);
    c.setUint32(16, crc, true); c.setUint32(20, bytes.length, true); c.setUint32(24, bytes.length, true); c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
    parts.push(local, name, file.blob); directory.push(central, name);
    offset += local.length + name.length + bytes.length; directorySize += central.length + name.length;
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  const end = new Uint8Array(22), e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
  e.setUint32(12, directorySize, true); e.setUint32(16, offset, true);
  return new Blob([...parts, ...directory, end], { type: 'application/zip' });
}


// Directional, contrast-adaptive edge antialiasing. The source alpha is retained.
// Related method: NVIDIA FXAA white paper, Timothy Lottes (2011).
function antialiasBand(data, width, height, from, to, strength) {
  const amount = Math.max(0, Math.min(100, strength)) / 100;
  const output = new Uint8ClampedArray(data.subarray(from * width * 4, to * width * 4));
  if (!amount || width < 2 || height < 2) return output;
  const samples = new Float64Array(12);
  const luma = i => data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114;
  const sample = (x, y, offset, center) => {
    x = Math.max(0, Math.min(width - 1, x)); y = Math.max(0, Math.min(height - 1, y));
    const x0 = Math.floor(x), y0 = Math.floor(y), x1 = Math.min(width - 1, x0 + 1), y1 = Math.min(height - 1, y0 + 1);
    const fx = x - x0, fy = y - y0, a = (y0 * width + x0) * 4, b = (y0 * width + x1) * 4, c = (y1 * width + x0) * 4, d = (y1 * width + x1) * 4;
    if (data[a + 3] < 255 || data[b + 3] < 255 || data[c + 3] < 255 || data[d + 3] < 255) { for (let ch = 0; ch < 3; ch++) samples[offset + ch] = data[center + ch]; return; }
    for (let ch = 0; ch < 3; ch++) samples[offset + ch] = (data[a + ch] * (1 - fx) + data[b + ch] * fx) * (1 - fy) + (data[c + ch] * (1 - fx) + data[d + ch] * fx) * fy;
  };
  for (let y = from; y < to; y++) {
    const up = Math.max(0, y - 1), down = Math.min(height - 1, y + 1);
    for (let x = 0; x < width; x++) {
      const left = Math.max(0, x - 1), right = Math.min(width - 1, x + 1), center = (y * width + x) * 4;
      const nw = (up * width + left) * 4, ne = (up * width + right) * 4, sw = (down * width + left) * 4, se = (down * width + right) * 4;
      // Do not mix RGB across transparency boundaries.
      if (data[center + 3] < 255 || data[nw + 3] < 255 || data[ne + 3] < 255 || data[sw + 3] < 255 || data[se + 3] < 255) continue;
      const lnw = luma(nw), lne = luma(ne), lsw = luma(sw), lse = luma(se), lm = luma(center);
      const low = Math.min(lm, lnw, lne, lsw, lse), high = Math.max(lm, lnw, lne, lsw, lse);
      if (high - low < Math.max(12, high * .08)) continue;
      let dx = -((lnw + lne) - (lsw + lse)), dy = (lnw + lsw) - (lne + lse);
      const reduce = Math.max((lnw + lne + lsw + lse) / 32, 255 / 128);
      const reciprocal = 1 / (Math.min(Math.abs(dx), Math.abs(dy)) + reduce);
      dx = Math.max(-8, Math.min(8, dx * reciprocal)); dy = Math.max(-8, Math.min(8, dy * reciprocal));
      sample(x - dx / 6, y - dy / 6, 0, center); sample(x + dx / 6, y + dy / 6, 3, center);
      sample(x - dx / 2, y - dy / 2, 6, center); sample(x + dx / 2, y + dy / 2, 9, center);
      const ar = (samples[0] + samples[3]) / 2, ag = (samples[1] + samples[4]) / 2, ab = (samples[2] + samples[5]) / 2;
      const br = ar / 2 + (samples[6] + samples[9]) / 4, bg = ag / 2 + (samples[7] + samples[10]) / 4, bb = ab / 2 + (samples[8] + samples[11]) / 4;
      const lb = br * .299 + bg * .587 + bb * .114, chooseA = lb < low || lb > high, dest = ((y - from) * width + x) * 4;
      output[dest] = data[center] + amount * ((chooseA ? ar : br) - data[center]);
      output[dest + 1] = data[center + 1] + amount * ((chooseA ? ag : bg) - data[center + 1]);
      output[dest + 2] = data[center + 2] + amount * ((chooseA ? ab : bb) - data[center + 2]);
    }
  }
  return output;
}
async function smoothResult(blob, stats, strength, signal, onProgress = () => {}) {
  if (!strength) return blob;
  const checkAbort = () => { if (signal?.aborted) throw new DOMException(t('cancelled'), 'AbortError'); };
  checkAbort();
  const url = URL.createObjectURL(blob), image = new Image(), canvas = document.createElement('canvas');
  canvas.width = stats.width; canvas.height = stats.height;
  try {
    image.src = url; await image.decode(); checkAbort();
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error(t('browserMemory'));
    context.drawImage(image, 0, 0);
    const width = canvas.width, height = canvas.height, band = 64, radius = 5, stride = width * 4;
    let carry;
    for (let y = 0; y < height; y += band) {
      checkAbort();
      const rows = Math.min(band, height - y), top = Math.max(0, y - radius), bottom = Math.min(height, y + rows + radius);
      const pixels = context.getImageData(0, top, width, bottom - top);
      // Restore unfiltered overlap so the result does not depend on band boundaries.
      if (carry) pixels.data.set(carry, 0);
      if (y + rows < height) carry = pixels.data.slice((y + rows - radius - top) * stride, (y + rows - top) * stride);
      const result = antialiasBand(pixels.data, width, bottom - top, y - top, y - top + rows, strength);
      context.putImageData(new ImageData(result, width, rows), 0, y);
      onProgress((y + rows) / height);
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    checkAbort();
    const output = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    checkAbort(); if (!output) throw new Error(t('saveFailed'));
    return output;
  } finally { URL.revokeObjectURL(url); canvas.width = canvas.height = 1; }
}



localize();
const $ = id => document.getElementById(id);
let sourceImage, sourceFile, sourceURL, outputURL, previewURL, sourceDpi = null, rawOutput = null, outputStats;
let exportController, processedOutput, processedRaw, processedStrength, processedSize, previewBlob, rawFactor = 2, finalStats;
let exportRevision = 0, exportPending = false, exportTimer, pointerSliding = false;
let scale = 2, busy = false, controller, loadRevision = 0;
let dpiChosen = false, formatChosen = false;
let aiModel = 'photo', sizeMode = 'scale', cropCenter = null;
let queueMode = false, queue = [], batchURL, batchTimer, batchExportController, batchRevision = 0;
const scales = [...document.querySelectorAll('.scale')];
const formatOptions = [...document.querySelectorAll('.format-option')];
const pretty = value => value.toLocaleString(locale);
const bytes = value => `${(value / 1048576).toLocaleString(locale, { maximumFractionDigits: 1 })} MB`;
const exportBytes = value => value < 1048576 ? `${Math.max(1, Math.round(value / 1024)).toLocaleString(locale)} KB` : bytes(value);
const showError = text => { $('message').textContent = text; $('message').hidden = !text; };
const formatDpi = dpi => {
  const x = Math.round(dpi.x), y = Math.round(dpi.y);
  const fmt = value => value.toLocaleString(locale, { maximumFractionDigits: 0 });
  return x === y ? fmt(x) : `${fmt(x)} × ${fmt(y)}`;
};
function exportDpi() {
  const value = Number($('dpi').value);
  if (!Number.isInteger(value) || value < 72 || value > 600) throw new Error(t('dpiInvalid'));
  return { x: value, y: value };
}
function exportSettings() {
  return { dpi: exportDpi(), format: $('format').value, quality: Number($('quality').value), smoothing: Number($('smoothing').value), size: sizeSettings() };
}
const denoiseValue = () => Number($('denoise').value) / 100;
// Print formats in centimetres (portrait). Orientation follows the image.
const papers = { a5: [14.8, 21, 'A5'], a4: [21, 29.7, 'A4'], a3: [29.7, 42, 'A3'], a2: [42, 59.4, 'A2'], p10x15: [10, 15, '10x15cm'], p13x18: [13, 18, '13x18cm'], p20x30: [20, 30, '20x30cm'] };
function sizeSettings() {
  if (sizeMode !== 'print') return null;
  const key = $('paper').value;
  if (key !== 'custom') { const [width, height, label] = papers[key] || papers.a4; return { width, height, label }; }
  const width = Number($('paper-width').value), height = Number($('paper-height').value);
  if (!(width >= 1 && width <= 300 && height >= 1 && height <= 300)) throw new Error(t('paperInvalid'));
  return { width, height, label: `${width}x${height}cm` };
}
// Pixel size that fills the paper at the chosen DPI (contain), and the AI scale
// needed to get there: AI 2× or 4×, then high-quality resampling to the target.
function printTarget(width, height, settings) {
  const size = settings.size;
  if (!size) return null;
  const dpi = settings.dpi.x;
  let paperWidth = size.width, paperHeight = size.height;
  if ((width >= height) !== (paperWidth >= paperHeight)) [paperWidth, paperHeight] = [paperHeight, paperWidth];
  const ratio = Math.min(paperWidth / 2.54 * dpi / width, paperHeight / 2.54 * dpi / height);
  return {
    width: Math.max(1, Math.round(width * ratio)), height: Math.max(1, Math.round(height * ratio)),
    ratio, factor: ratio <= 2 ? 2 : 4, effectiveDpi: ratio > 4 ? Math.floor(dpi * 4 / ratio) : dpi, label: size.label,
  };
}
function checkTarget(target) {
  if (target && (target.width > 8192 || target.height > 8192 || target.width * target.height > maxOutputPixels)) {
    throw new Error(t('printTooLarge', { mp: Math.floor(maxOutputPixels / 1e6) }));
  }
}
// Resample the AI output to the exact print size. Large reductions go in halving
// steps so fine detail does not alias.
async function resizeResult(blob, stats, target, signal) {
  if (!target || (target.width === stats.width && target.height === stats.height)) return { blob, width: stats.width, height: stats.height };
  const url = URL.createObjectURL(blob), image = new Image(), canvases = [];
  try {
    image.src = url; await image.decode(); check(signal);
    let source = image, width = stats.width, height = stats.height;
    while (width / 2 > target.width && height / 2 > target.height) {
      const step = document.createElement('canvas'); canvases.push(step);
      step.width = Math.round(width / 2); step.height = Math.round(height / 2);
      const context = step.getContext('2d'); if (!context) throw new Error(t('browserMemory'));
      context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
      context.drawImage(source, 0, 0, step.width, step.height);
      source = step; width = step.width; height = step.height;
    }
    const canvas = document.createElement('canvas'); canvases.push(canvas);
    canvas.width = target.width; canvas.height = target.height;
    const context = canvas.getContext('2d'); if (!context) throw new Error(t('browserMemory'));
    context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
    context.drawImage(source, 0, 0, target.width, target.height);
    const output = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    check(signal); if (!output) throw new Error(t('saveFailed'));
    return { blob: output, width: target.width, height: target.height };
  } finally { URL.revokeObjectURL(url); for (const canvas of canvases) canvas.width = canvas.height = 1; }
}
const rescaleError = () => Object.assign(new Error(t('printRescale')), { rescale: true });
function updateDpiLabel() {
  $('dpi-value').value = `${$('dpi').value} DPI`;
  $('dpi').setAttribute('aria-valuetext', `${$('dpi').value} DPI`);
  $('dpi').style.setProperty('--fill', `${(Number($('dpi').value) - 72) / 528 * 100}%`);
  updateSettings();
}
function updateFormatNote() {
  syncFormatControl();
  $('format-note').textContent = t(queueMode ? 'batchFormatNote' : 'formatNote');
  $('format-note').hidden = $('format').value !== 'jpeg' || (!queueMode && sourceFile?.type === 'image/jpeg');
  updateSettings();
}
function updateSettings() {
  $('model-help').hidden = false;
  $('model-help').textContent = t({ photo: 'photoHelp', illustration: 'illustrationHelp' }[aiModel]);
  $('cpu-control').hidden = false;
  $('denoise-control').hidden = aiModel !== 'photo';
  $('denoise-value').value = `${$('denoise').value} %`;
  $('print-target').hidden = sizeMode !== 'print';
  $('custom-size').hidden = $('paper').value !== 'custom';
  document.querySelector('.scale-control').classList.toggle('inactive', sizeMode === 'print');
  for (const button of scales) button.disabled = busy || sizeMode === 'print';
  const previewAvailable = Boolean(sourceImage && !queueMode);
  $('preview-open').hidden = !previewAvailable; $('preview-open').disabled = busy || !previewAvailable;
  $('smoothing-value').value = `${$('smoothing').value} %`;
  $('quality-control').hidden = $('format').value !== 'jpeg';
  $('quality-value').value = `${$('quality').value} %`;
  const detailAvailable = Boolean(rawOutput && outputURL && !queueMode);
  $('detail-open').hidden = !detailAvailable;
  $('detail-open').disabled = busy || exportPending || !detailAvailable;
  if (queueMode) {
    $('output-pixels').textContent = t('batchDimensions'); $('output-print').textContent = t('batchDimensions');
  } else if (sourceImage) {
    let w = sourceImage.naturalWidth * scale, h = sourceImage.naturalHeight * scale;
    const dpi = Number($('dpi').value) || 300;
    if (sizeMode === 'print') {
      try {
        const target = printTarget(sourceImage.naturalWidth, sourceImage.naturalHeight, { dpi: { x: dpi }, size: sizeSettings() });
        w = target.width; h = target.height;
        let plan = t('printPlan', { factor: target.factor, width: pretty(w), height: pretty(h) });
        if (target.ratio > 4) plan += ' ' + t('printLow', { dpi: target.effectiveDpi });
        else if (target.ratio < 1) plan += ' ' + t('printEnough');
        $('print-plan').textContent = plan;
      } catch (error) { $('print-plan').textContent = error.message; }
    }
    $('output-pixels').textContent = `${pretty(w)} × ${pretty(h)} px`;
    const cm = value => (value / dpi * 2.54).toLocaleString(locale, { maximumFractionDigits: 2 });
    $('output-print').textContent = `${cm(w)} × ${cm(h)} cm`;
  } else {
    $('output-pixels').textContent = '— px'; $('output-print').textContent = '— cm';
  }
  if (sizeMode === 'print' && (queueMode || !sourceImage)) {
    try { $('print-plan').textContent = t('printBatch', { paper: sizeSettings().label.replace('x', ' × ').replace('cm', ' cm') }); }
    catch (error) { $('print-plan').textContent = error.message; }
  }
}
function closeDetail() {
  if ($('detail-dialog').open) $('detail-dialog').close();
  $('detail-original').removeAttribute('src'); $('detail-result').removeAttribute('src');
}
async function refreshExport() {
  if (!rawOutput || !outputStats) return;
  const revision = ++exportRevision, settings = exportSettings();
  const input = rawOutput, name = sourceFile.name, factor = rawFactor;
  const target = printTarget(sourceImage.naturalWidth, sourceImage.naturalHeight, settings);
  if (target && target.factor !== factor) { clearOutput(); throw rescaleError(); }
  checkTarget(target);
  const stats = target ? { width: target.width, height: target.height } : outputStats, sizeKey = `${stats.width}x${stats.height}`;
  exportController?.abort();
  const localController = new AbortController(); exportController = localController;
  const inferenceController = controller;
  const abortExport = () => localController.abort();
  if (inferenceController?.signal.aborted) localController.abort();
  else inferenceController?.signal.addEventListener('abort', abortExport, { once: true });
  exportPending = true; $('download').setAttribute('aria-disabled', 'true'); updateSettings();
  $('export-size').textContent = t('encoding');
  try {
    const filtered = processedRaw === input && processedStrength === settings.smoothing && processedSize === sizeKey && processedOutput
      ? processedOutput
      : await smoothResult((await resizeResult(input, outputStats, target, localController.signal)).blob, stats, settings.smoothing, localController.signal, fraction => {
        if (revision === exportRevision && busy) { $('progress-text').textContent = t('smoothingProgress'); $('progress').value = 97 + fraction * 2; }
      });
    if (revision !== exportRevision || localController.signal.aborted) return;
    const blob = await encodeExport(filtered, stats, settings);
    if (revision !== exportRevision || localController.signal.aborted) return;
    if (previewBlob !== filtered) {
      const nextPreview = URL.createObjectURL(filtered), nextImage = new Image();
      try { nextImage.src = nextPreview; await nextImage.decode(); }
      catch (error) { URL.revokeObjectURL(nextPreview); throw error; }
      if (revision !== exportRevision || localController.signal.aborted) { URL.revokeObjectURL(nextPreview); return; }
      if (previewURL) URL.revokeObjectURL(previewURL);
      previewURL = nextPreview; previewBlob = filtered; $('result').src = previewURL;
    }
    processedOutput = filtered; processedRaw = input; processedStrength = settings.smoothing; processedSize = sizeKey; finalStats = stats;
    if (revision !== exportRevision) return;
    closeDetail();
    if (outputURL) URL.revokeObjectURL(outputURL);
    outputURL = URL.createObjectURL(blob);
    $('download').href = outputURL;
    const extension = settings.format === 'jpeg' ? 'jpg' : 'png';
    $('download').download = `${name.replace(/\.[^.]+$/, '')}-${target ? `${target.label}-${settings.dpi.x}dpi` : `${factor}x`}.${extension}`;
    $('download-label').textContent = t('download', { format: extension.toUpperCase() });
    $('download').setAttribute('aria-disabled', 'false');
    $('output-info').textContent = `${pretty(stats.width)} × ${pretty(stats.height)} px · ${exportBytes(blob.size)} · ${formatDpi(settings.dpi)} DPI`;
    $('export-size').textContent = t('exportSize', { size: exportBytes(blob.size) });
    $('export-size').hidden = false;
  } finally { inferenceController?.signal.removeEventListener('abort', abortExport); if (exportController === localController) exportController = null; if (revision === exportRevision) { exportPending = false; updateSettings(); } }
}
// keepResults: export settings (DPI, format, quality, smoothing) changed. The AI
// outputs stay valid and only the files in the ZIP are re-encoded. Scale, model
// or a new queue discard the AI outputs as before.
function invalidateBatch(keepResults = false) {
  clearTimeout(batchTimer); batchExportController?.abort(); batchExportController = null; batchRevision++;
  if (batchURL) URL.revokeObjectURL(batchURL);
  batchURL = null; $('batch-download').hidden = true; $('batch-download').removeAttribute('href');
  $('batch-status').textContent = '';
  if (keepResults) return;
  for (const item of queue) { item.result = null; item.status.textContent = t('pending'); item.row.classList.remove('failed'); }
}
const batchLimitBytes = 100 * 1048576;
const batchFileName = (index, file, suffix, format) => `${String(index + 1).padStart(2, '0')}-${file.name.replace(/\.[^.]+$/, '')}-${suffix}.${format === 'jpeg' ? 'jpg' : 'png'}`;
const batchSuffix = (result, settings) => { const target = printTarget(result.sourceWidth, result.sourceHeight, settings); return target ? `${target.label}-${settings.dpi.x}dpi` : `${result.factor}x`; };
async function exportBatchItem(result, settings, signal, onProgress) {
  const target = printTarget(result.sourceWidth, result.sourceHeight, settings);
  if (target && target.factor !== result.factor) throw rescaleError();
  checkTarget(target);
  const resized = await resizeResult(result.blob, result, target, signal);
  const filtered = await smoothResult(resized.blob, resized, settings.smoothing, signal, onProgress);
  return encodeExport(filtered, resized, settings);
}
async function publishBatchZip(completed, revision = batchRevision) {
  const zip = await makeZip(completed);
  if (revision !== batchRevision) return false;
  batchURL = URL.createObjectURL(zip);
  $('batch-download').href = batchURL; $('batch-download').download = t('zipName'); $('batch-download').hidden = false;
  return true;
}
function scheduleBatchExport() {
  invalidateBatch(true);
  const total = queue.filter(item => item.result).length;
  $('batch-status').textContent = t('batchUpdating', { current: 0, total });
  batchTimer = setTimeout(() => rebuildBatch().catch(error => {
    if (error.name === 'AbortError') return;
    if (error.rescale) invalidateBatch();
    showError(friendlyError(error));
  }), 400);
}
async function rebuildBatch() {
  const revision = batchRevision, local = new AbortController(); batchExportController = local;
  const settings = exportSettings(), done = queue.filter(item => item.result), completed = [];
  let totalBytes = 0, current = 0;
  for (const [index, item] of queue.entries()) {
    if (!item.result) continue;
    check(local.signal);
    $('batch-status').textContent = t('batchUpdating', { current: ++current, total: done.length });
    const blob = await exportBatchItem(item.result, settings, local.signal);
    if (revision !== batchRevision || local.signal.aborted) return;
    if (totalBytes + blob.size > batchLimitBytes) { showError(t('zipLimit')); item.status.textContent = t('skipped'); continue; }
    completed.push({ name: batchFileName(index, item.file, batchSuffix(item.result, settings), settings.format), blob }); totalBytes += blob.size;
    item.status.textContent = `${t('done')} · ${exportBytes(blob.size)}`;
  }
  if (revision !== batchRevision) return;
  if (completed.length && !await publishBatchZip(completed, revision)) return;
  $('batch-status').textContent = completed.length ? t('batchUpdated') : t('batchNone');
  batchExportController = null;
}
function scheduleExport(immediate = false) {
  clearTimeout(exportTimer); exportController?.abort(); showError('');
  if (queueMode) { if (!busy && queue.some(item => item.result)) scheduleBatchExport(); else invalidateBatch(); updateSettings(); return; }
  if (!rawOutput || busy) return;
  exportRevision++; exportPending = true;
  $('download').setAttribute('aria-disabled', 'true'); updateSettings();
  exportTimer = setTimeout(() => refreshExport().catch(error => { if (error.name !== 'AbortError') showError(friendlyError(error)); }), immediate ? 0 : 220);
}
function clearOutput() {
  clearTimeout(exportTimer); exportController?.abort(); exportController = null; closeDetail();
  processedOutput = processedRaw = processedStrength = processedSize = previewBlob = finalStats = null;
  if (outputURL) URL.revokeObjectURL(outputURL);
  if (previewURL) URL.revokeObjectURL(previewURL);
  outputURL = previewURL = rawOutput = outputStats = null;
  exportRevision++; exportPending = false;
  $('original').style.clipPath = 'none';
  $('result').removeAttribute('src'); $('download').removeAttribute('href');
  for (const id of ['result-layer', 'compare-labels', 'divider', 'compare', 'result-meta', 'download', 'export-size']) $(id).hidden = true;
  $('upscale').hidden = false; updateSettings();
}
function setBusy(value) {
  busy = value; document.body.classList.toggle('busy', value);
  if (value) closeFormatMenu();
  for (const id of ['dpi', 'format', 'format-toggle', 'quality', 'change', 'dropzone', 'batch-choose', 'batch-start', 'batch-clear', 'file', 'batch-files', 'smoothing', 'model-photo', 'model-illustration', 'cpu-auto', 'cpu-high', 'denoise', 'size-scale', 'size-print', 'paper', 'paper-width', 'paper-height']) $(id).disabled = value;
  $('upscale').disabled = value || !sourceImage || queueMode;
  for (const button of scales) button.disabled = value || sizeMode === 'print';
  $('progress-wrap').hidden = !value; $('cancel').disabled = false; updateSettings();
}
function selectScale(value) {
  if (busy || ![2, 4].includes(value) || scale === value) return;
  scale = value;
  scales.forEach(item => { item.classList.toggle('active', Number(item.dataset.scale) === scale); item.setAttribute('aria-pressed', String(Number(item.dataset.scale) === scale)); });
  $('upscale-label').textContent = t('upscale');
  clearOutput(); if (queueMode) invalidateBatch(); showError(''); updateSettings();
}
function restoreSingle() {
  if (busy) return;
  invalidateBatch(); queue = []; queueMode = false; document.body.classList.remove('batch-mode');
  $('batch-list').replaceChildren(); $('batch-queue').hidden = true;
  $('dropzone').hidden = Boolean(sourceImage); $('editor').hidden = !sourceImage;
  document.body.classList.toggle('has-image', Boolean(sourceImage));
  $('source-dpi').textContent = t('sourceDpi', { value: sourceDpi ? formatDpi(sourceDpi) : t('unknown') });
  $('upscale').disabled = !sourceImage; updateFormatNote(); updateSettings();
}
async function loadFile(file) {
  if (!file || busy) return;
  const revision = ++loadRevision; showError('');
  try { validateUpload(file); } catch (error) { showError(error.message); return; }
  const url = URL.createObjectURL(file), img = new Image();
  try {
    const header = await validateHeader(file);
    img.src = url; await img.decode();
    const dpi = readResolutionBytes(header);
    if (revision !== loadRevision || busy) { URL.revokeObjectURL(url); return; }
    validateInput(img);
    if (queueMode) restoreSingle();
    clearOutput();
    if (sourceURL) URL.revokeObjectURL(sourceURL);
    sourceImage = img; sourceFile = file; sourceURL = url; sourceDpi = dpi; cropCenter = null;
    $('source-dpi').textContent = t('sourceDpi', { value: dpi ? formatDpi(dpi) : t('unknown') });
    if (!dpiChosen) $('dpi').value = String(Math.max(72, Math.min(600, Math.round(dpi?.x || 300))));
    updateDpiLabel();
    if (!formatChosen) $('format').value = file.type === 'image/jpeg' ? 'jpeg' : 'png';
    updateFormatNote();
    document.body.classList.add('has-image');
    $('comparison').style.setProperty('--image-ratio', String(img.naturalWidth / img.naturalHeight));
    $('original').src = url; $('filename').textContent = file.name;
    $('dimensions').textContent = `${pretty(img.naturalWidth)} × ${pretty(img.naturalHeight)} px · ${bytes(file.size)}`;
    $('dropzone').hidden = true; $('editor').hidden = false; $('upscale').disabled = false;
    updateSettings(); $('upscale').focus({ preventScroll: true });
  } catch (error) {
    URL.revokeObjectURL(url); showError(error.message === t('inputSize') ? error.message : t('fileOpen'));
  }
}
function enterQueue(files) {
  if (busy || !files.length) return;
  if (files.length > 10 || files.reduce((sum, file) => sum + file.size, 0) > 100 * 1048576) return showError(t('batchLimit'));
  try { for (const file of files) validateUpload(file); } catch (error) { showError(error.message); return; }
  loadRevision++; clearOutput(); invalidateBatch(); showError('');
  queueMode = true; document.body.classList.add('batch-mode', 'has-image');
  $('batch-list').replaceChildren();
  queue = files.map(file => {
    const row = document.createElement('li'), name = document.createElement('span'), status = document.createElement('span');
    name.textContent = file.name; name.title = file.name; status.textContent = t('pending'); row.append(name, status); $('batch-list').append(row);
    return { file, row, status };
  });
  $('batch-count').textContent = t('batchCount', { count: queue.length }); $('batch-queue').hidden = false;
  $('dropzone').hidden = $('editor').hidden = true;
  if (!formatChosen) $('format').value = files[0].type === 'image/jpeg' ? 'jpeg' : 'png';
  $('source-dpi').textContent = t('batchDpi'); $('upscale').disabled = true;
  updateFormatNote(); updateSettings();
}
function acceptFiles(files) {
  const list = [...files];
  if (list.length > 1) enterQueue(list); else loadFile(list[0]);
}
$('dropzone').addEventListener('click', () => $('file').click());
$('change').addEventListener('click', () => $('file').click());
$('file').addEventListener('change', event => { acceptFiles(event.target.files); event.target.value = ''; });
for (const eventName of ['dragenter', 'dragover']) $('dropzone').addEventListener(eventName, event => { event.preventDefault(); if (!busy) $('dropzone').classList.add('dragging'); });
for (const eventName of ['dragleave', 'drop']) $('dropzone').addEventListener(eventName, () => $('dropzone').classList.remove('dragging'));
document.addEventListener('dragover', event => event.preventDefault());
document.addEventListener('drop', event => { event.preventDefault(); if (!busy) acceptFiles(event.dataTransfer.files); });
scales.forEach(button => button.addEventListener('click', () => selectScale(Number(button.dataset.scale))));
$('compare').addEventListener('input', event => {
  const position = event.target.value;
  $('original').style.clipPath = `inset(0 ${100 - Number(position)}% 0 0)`;
  $('result-layer').style.clipPath = `inset(0 0 0 ${position}%)`; $('divider').style.left = `${position}%`;
});
$('dpi').addEventListener('pointerdown', () => { pointerSliding = true; });
document.addEventListener('pointerup', () => { pointerSliding = false; });
document.addEventListener('pointercancel', () => { pointerSliding = false; });
$('dpi').addEventListener('input', () => {
  dpiChosen = true;
  const value = Number($('dpi').value);
  if (pointerSliding) { const snap = [150, 300].find(point => Math.abs(point - value) <= 5); if (snap !== undefined) $('dpi').value = String(snap); }
  updateDpiLabel(); scheduleExport();
});
$('dpi').addEventListener('change', () => { dpiChosen = true; updateDpiLabel(); scheduleExport(true); });
$('format').addEventListener('change', () => { formatChosen = true; updateFormatNote(); scheduleExport(true); });
function syncFormatControl() {
  const label = $('format').value === 'jpeg' ? 'JPG' : 'PNG';
  $('format-value').textContent = label;
  $('format-toggle').setAttribute('aria-label', `${t('format')}: ${label}`);
  for (const option of formatOptions) option.setAttribute('aria-selected', String(option.dataset.format === $('format').value));
}
function closeFormatMenu(focus = false) {
  $('format-menu').hidden = true; $('format-toggle').setAttribute('aria-expanded', 'false');
  if (focus && !$('format-toggle').disabled) $('format-toggle').focus({ preventScroll: true });
}
function openFormatMenu() {
  if (busy || $('format-toggle').disabled) return;
  $('format-menu').hidden = false; $('format-toggle').setAttribute('aria-expanded', 'true');
  formatOptions.find(option => option.dataset.format === $('format').value)?.focus({ preventScroll: true });
}
function chooseFormat(value) {
  if (busy || !['png', 'jpeg'].includes(value)) return;
  closeFormatMenu(true); formatChosen = true;
  if ($('format').value === value) return;
  $('format').value = value; updateFormatNote(); scheduleExport(true);
}
$('format-toggle').addEventListener('click', () => $('format-menu').hidden ? openFormatMenu() : closeFormatMenu(true));
$('format-toggle').addEventListener('keydown', event => {
  if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); openFormatMenu(); }
});
formatOptions.forEach((option, index) => {
  option.addEventListener('click', () => chooseFormat(option.dataset.format));
  option.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? formatOptions.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + formatOptions.length) % formatOptions.length;
      formatOptions[next].focus({ preventScroll: true });
    } else if (['Enter', ' '].includes(event.key)) { event.preventDefault(); chooseFormat(option.dataset.format); }
    else if (event.key === 'Escape') { event.preventDefault(); closeFormatMenu(true); }
    else if (event.key === 'Tab') closeFormatMenu(true);
    else if (['p', 'j'].includes(event.key.toLowerCase())) { event.preventDefault(); chooseFormat(event.key.toLowerCase() === 'p' ? 'png' : 'jpeg'); }
  });
});
document.addEventListener('pointerdown', event => { if (!$('format-control').contains(event.target)) closeFormatMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('format-menu').hidden) { event.preventDefault(); closeFormatMenu(true); } });

$('smoothing').addEventListener('input', () => { updateSettings(); scheduleExport(); });
$('smoothing').addEventListener('change', () => scheduleExport(true));
$('quality').addEventListener('input', () => { updateSettings(); scheduleExport(); });
$('quality').addEventListener('change', () => scheduleExport(true));
$('download').addEventListener('click', event => { if (exportPending || $('download').getAttribute('aria-disabled') === 'true' || !$('dpi').validity.valid) event.preventDefault(); });
const modelNames = ['photo', 'illustration'];
function selectModel(value) {
  if (busy || !modelNames.includes(value) || aiModel === value) return;
  aiModel = value;
  stopIllustration();
  for (const name of modelNames) {
    $('model-' + name).classList.toggle('active', value === name);
    $('model-' + name).setAttribute('aria-pressed', String(value === name));
  }
  clearOutput(); if (queueMode) invalidateBatch(); showError(''); updateSettings();
}
function selectCpuMode(value) {
  if (busy || !['auto', 'high'].includes(value) || illustrationCpuMode === value) return;
  illustrationCpuMode = value; stopIllustration();
  for (const mode of ['auto', 'high']) {
    $('cpu-' + mode).classList.toggle('active', mode === value);
    $('cpu-' + mode).setAttribute('aria-pressed', String(mode === value));
  }
}
$('cpu-auto').addEventListener('click', () => selectCpuMode('auto'));
$('cpu-high').addEventListener('click', () => selectCpuMode('high'));
$('model-photo').addEventListener('click', () => selectModel('photo'));
// Noise reduction changes the AI result itself, so finished results are discarded.
$('denoise').addEventListener('input', () => { if (rawOutput) clearOutput(); if (queueMode) invalidateBatch(); updateSettings(); });
function selectSizeMode(value) {
  if (busy || !['scale', 'print'].includes(value) || sizeMode === value) return;
  sizeMode = value;
  for (const mode of ['scale', 'print']) {
    $('size-' + mode).classList.toggle('active', mode === value);
    $('size-' + mode).setAttribute('aria-pressed', String(mode === value));
  }
  clearOutput(); if (queueMode) invalidateBatch(); showError(''); updateSettings();
}
$('size-scale').addEventListener('click', () => selectSizeMode('scale'));
$('size-print').addEventListener('click', () => selectSizeMode('print'));
for (const id of ['paper', 'paper-width', 'paper-height']) $(id).addEventListener(id === 'paper' ? 'change' : 'input', () => { updateSettings(); scheduleExport(); });
$('model-illustration').addEventListener('click', () => selectModel('illustration'));
$('batch-choose').addEventListener('click', () => $('batch-files').click());
$('batch-files').addEventListener('change', event => { enterQueue([...event.target.files]); event.target.value = ''; });
$('batch-clear').addEventListener('click', restoreSingle);
$('detail-open').addEventListener('click', () => {
  const stats = finalStats || outputStats;
  if (busy || !stats || !outputURL || exportPending) return;
  $('detail-original').src = sourceURL; $('detail-result').src = outputURL;
  $('detail-source-label').textContent = t('detailSource', { scale: +(stats.width / sourceImage.naturalWidth).toFixed(2) });
  const dims = `${pretty(stats.width)} × ${pretty(stats.height)} px`;
  $('detail-help').textContent = t('detailHelp') + ' ' + dims;
  const format = $('format').value === 'jpeg' ? `JPG · ${$('quality').value} %` : 'PNG';
  for (const id of ['detail-original', 'detail-result']) { $(id).style.width = `${stats.width}px`; $(id).style.height = `${stats.height}px`; }
  $('detail-result-label').textContent = `${t('result')} · ${format}`;
  $('detail-result').alt = t('resultAlt');
  $('detail-dialog').showModal();
  for (const id of ['detail-original-pane', 'detail-result-pane']) { $(id).scrollLeft = 0; $(id).scrollTop = 0; }
});
$('detail-close').addEventListener('click', closeDetail);
for (const [from, to] of [['detail-original-pane', 'detail-result-pane'], ['detail-result-pane', 'detail-original-pane']]) {
  $(from).addEventListener('scroll', () => { if ($(to).scrollLeft !== $(from).scrollLeft) $(to).scrollLeft = $(from).scrollLeft; if ($(to).scrollTop !== $(from).scrollTop) $(to).scrollTop = $(from).scrollTop; });
}
$('cancel').addEventListener('click', () => { controller?.abort(); $('cancel').disabled = true; $('progress-text').textContent = t('cancelling'); });
const runModel = (model, image, factor, options) => enhanceIllustration(image, factor, { ...options, model, denoise: denoiseValue() });
const processImage = (image, file, factor, options) => runModel(aiModel, image, factor, options);
function friendlyError(error) {
  if (isKnownMessage(error.message)) return error.message;
  return /memory|texture|WebGL|allocation|context lost/i.test(error.message) ? t('memory') : t('failed');
}
$('upscale').addEventListener('click', async () => {
  if (busy || !sourceImage || queueMode) return;
  showError('');
  let factor = scale;
  try {
    const target = printTarget(sourceImage.naturalWidth, sourceImage.naturalHeight, exportSettings());
    if (target) { factor = target.factor; checkTarget(target); }
    validateSize(sourceImage.naturalWidth, sourceImage.naturalHeight, factor);
  } catch (error) { showError(error.message); return; }
  clearOutput(); controller = new AbortController(); setBusy(true); $('progress').value = 0;
  $('progress-text').textContent = t('preparing');
  let succeeded = false;
  try {
    const result = await processImage(sourceImage, sourceFile, factor, { signal: controller.signal, progress: (value, text) => { if (!controller.signal.aborted) { $('progress').value = value * .95; $('progress-text').textContent = text; } } });
    if (controller.signal.aborted) throw new DOMException(t('cancelled'), 'AbortError');
    rawOutput = result.blob; rawFactor = factor; outputStats = { width: result.width, height: result.height }; await refreshExport();
    if (controller.signal.aborted) throw new DOMException(t('cancelled'), 'AbortError');
    $('result-label').textContent = t('result'); $('result').alt = t('resultAlt');
    $('original').style.clipPath = 'inset(0 50% 0 0)'; $('compare').value = 50; $('divider').style.left = '50%'; $('result-layer').style.clipPath = 'inset(0 0 0 50%)';
    for (const id of ['result-layer', 'compare-labels', 'divider', 'compare', 'result-meta', 'download']) $(id).hidden = false;
    $('upscale').hidden = true; succeeded = true;
    globalThis.usageCounter?.record();
  } catch (error) { clearOutput(); if (error.name !== 'AbortError') { console.error('Upscale:', error); showError(friendlyError(error)); } }
  finally { setBusy(false); controller = null; if (succeeded) $('download').focus({ preventScroll: true }); }
});
$('batch-start').addEventListener('click', async () => {
  if (busy || !queueMode || !queue.length) return;
  let settings; try { settings = exportSettings(); } catch (error) { showError(error.message); return; }
  const completed = []; let totalBytes = 0, stoppedForLimit = false;
  invalidateBatch(); showError(''); controller = new AbortController(); setBusy(true); $('progress').value = 0;
  try {
    for (let index = 0; index < queue.length; index++) {
      if (controller.signal.aborted) break;
      const item = queue[index], url = URL.createObjectURL(item.file), image = new Image(); item.status.textContent = t('working');
      const report = (value, message) => { $('progress').value = (index * 100 + value) / queue.length; $('progress-text').textContent = t('batchProgress', { current: index + 1, total: queue.length, message }); };
      try {
        report(0, t('preparing')); await validateHeader(item.file); image.src = url; await image.decode(); validateInput(image);
        const target = printTarget(image.naturalWidth, image.naturalHeight, settings), factor = target ? target.factor : scale;
        checkTarget(target); validateSize(image.naturalWidth, image.naturalHeight, factor);
        const result = await processImage(image, item.file, factor, { signal: controller.signal, progress: (value, message) => report(value * .95, message) });
        if (controller.signal.aborted) break;
        const kept = { blob: result.blob, width: result.width, height: result.height, factor, sourceWidth: image.naturalWidth, sourceHeight: image.naturalHeight };
        const blob = await exportBatchItem(kept, settings, controller.signal, fraction => report(95 + fraction * 4, t('smoothingProgress')));
        if (controller.signal.aborted) break;
        if (totalBytes + blob.size > batchLimitBytes) { stoppedForLimit = true; showError(t('zipLimit')); break; }
        item.result = kept;
        completed.push({ name: batchFileName(index, item.file, batchSuffix(kept, settings), settings.format), blob }); totalBytes += blob.size;
        item.status.textContent = `${t('done')} · ${exportBytes(blob.size)}`; report(100, t('done'));
        globalThis.usageCounter?.record();
      } catch (error) {
        if (error.name === 'AbortError') break;
        item.status.textContent = friendlyError(error); item.row.classList.add('failed');
      } finally { URL.revokeObjectURL(url); }
    }
    for (const item of queue) if ([t('pending'), t('working')].includes(item.status.textContent)) item.status.textContent = t(controller.signal.aborted ? 'cancelledShort' : 'skipped');
    if (completed.length) {
      $('cancel').disabled = true; $('progress-text').textContent = t('zipPreparing');
      await publishBatchZip(completed);
      $('batch-status').textContent = t('batchComplete', { done: completed.length, total: queue.length });
    } else $('batch-status').textContent = t(controller.signal.aborted ? 'cancelledShort' : 'batchNone');
    if (stoppedForLimit) showError(t('zipLimit'));
  } catch (error) { showError(friendlyError(error)); }
  finally { setBusy(false); controller = null; }
});
// Model comparison on a crop: runs every model on a small area with real context
// around it, so the user can choose before spending minutes on the whole image.
const previewSize = 128, previewMargin = 48;
const modelLabels = { photo: 'modelPhoto', illustration: 'modelIllustration' };
let previewURLs = [];
function cropRect() {
  const width = sourceImage.naturalWidth, height = sourceImage.naturalHeight, size = Math.min(previewSize, width, height);
  const center = cropCenter || { x: width / 2, y: height / 2 };
  return {
    x: Math.round(Math.min(width - size, Math.max(0, center.x - size / 2))),
    y: Math.round(Math.min(height - size, Math.max(0, center.y - size / 2))), size,
  };
}
async function canvasBlob(source, x, y, width, height) {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  try {
    const context = canvas.getContext('2d'); if (!context) throw new Error(t('browserMemory'));
    context.drawImage(source, -x, -y);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error(t('saveFailed'));
    return blob;
  } finally { canvas.width = canvas.height = 1; }
}
async function blobImage(blob) {
  const url = URL.createObjectURL(blob), image = new Image();
  try { image.src = url; await image.decode(); return image; } finally { URL.revokeObjectURL(url); }
}
function clearPreview() {
  for (const url of previewURLs) URL.revokeObjectURL(url);
  previewURLs = []; $('preview-grid').replaceChildren();
}
function previewCard(title, size, model) {
  const card = document.createElement('figure'), heading = document.createElement('figcaption'), frame = document.createElement('div');
  const image = document.createElement('img'), status = document.createElement('span');
  card.className = 'preview-card'; frame.className = 'preview-frame'; status.className = 'control-hint';
  heading.textContent = title; image.alt = title; image.width = size; image.height = size; image.hidden = true;
  frame.append(image); card.append(heading, frame, status);
  // Scroll all crops together so the same detail stays side by side.
  frame.addEventListener('scroll', () => {
    for (const other of $('preview-grid').querySelectorAll('.preview-frame')) if (other !== frame && (other.scrollLeft !== frame.scrollLeft || other.scrollTop !== frame.scrollTop)) { other.scrollLeft = frame.scrollLeft; other.scrollTop = frame.scrollTop; }
  });
  if (model) {
    const use = document.createElement('button');
    use.type = 'button'; use.className = 'text-button'; use.textContent = t('previewUse'); use.disabled = true;
    use.addEventListener('click', () => { closePreview(); selectModel(model); $('upscale').focus({ preventScroll: true }); });
    card.append(use); card.use = use;
  }
  card.image = image; card.status = status;
  $('preview-grid').append(card);
  return card;
}
async function showPreviewImage(card, blob) {
  const url = URL.createObjectURL(blob); previewURLs.push(url);
  card.image.src = url;
  await card.image.decode();
  card.image.hidden = false;
}
function closePreview() {
  if (busy && controller) controller.abort();
  if ($('preview-dialog').open) $('preview-dialog').close();
}
async function runPreview() {
  if (busy || !sourceImage || queueMode) return;
  showError('');
  let settings, factor = scale;
  try {
    settings = exportSettings();
    const target = printTarget(sourceImage.naturalWidth, sourceImage.naturalHeight, settings);
    if (target) factor = target.factor;
  } catch (error) { showError(error.message); return; }
  const width = sourceImage.naturalWidth, height = sourceImage.naturalHeight, { x, y, size } = cropRect();
  const left = Math.max(0, x - previewMargin), top = Math.max(0, y - previewMargin);
  const right = Math.min(width, x + size + previewMargin), bottom = Math.min(height, y + size + previewMargin);
  clearPreview();
  $('preview-title').textContent = t('previewTitle', { size, scale: factor });
  const original = previewCard(t('previewSource'), size * factor);
  const cards = Object.fromEntries(modelNames.map(model => [model, previewCard(t(modelLabels[model]), size * factor, model)]));
  for (const card of Object.values(cards)) card.status.textContent = t('pending');
  $('preview-dialog').showModal();
  controller = new AbortController(); setBusy(true); $('progress').value = 0;
  const signal = controller.signal;
  // Run the currently selected model last so its workers stay ready for the full image.
  const order = [...modelNames.filter(model => model !== aiModel), aiModel];
  try {
    await showPreviewImage(original, await canvasBlob(sourceImage, x, y, size, size));
    const context = await blobImage(await canvasBlob(sourceImage, left, top, right - left, bottom - top));
    for (const [index, model] of order.entries()) {
      check(signal);
      const card = cards[model], started = performance.now();
      card.status.textContent = t('working');
      const report = (value, message) => {
        if (signal.aborted) return;
        $('progress').value = (index * 100 + value) / order.length;
        const text = t('previewProgress', { model: t(modelLabels[model]), current: index + 1, total: order.length }) + ' · ' + message;
        $('progress-text').textContent = text; $('preview-status').textContent = text;
      };
      try {
        const result = await runModel(model, context, factor, { signal, progress: report });
        check(signal);
        const output = await blobImage(result.blob);
        await showPreviewImage(card, await canvasBlob(output, (x - left) * factor, (y - top) * factor, size * factor, size * factor));
        card.status.textContent = t('previewTime', { seconds: ((performance.now() - started) / 1000).toLocaleString(locale, { maximumFractionDigits: 1 }) });
        card.use.disabled = false;
      } catch (error) {
        if (error.name === 'AbortError') throw error;
        console.error('Preview:', error); card.status.textContent = friendlyError(error);
      }
    }
    $('preview-status').textContent = t('previewDone');
  } catch (error) {
    if (error.name !== 'AbortError') { console.error('Preview:', error); $('preview-status').textContent = friendlyError(error); }
    else { for (const card of Object.values(cards)) if (card.image.hidden) card.status.textContent = t('cancelledShort'); $('preview-status').textContent = t('cancelled'); }
  } finally { setBusy(false); controller = null; for (const card of Object.values(cards)) if (card.use && !card.image.hidden) card.use.disabled = false; }
}
$('preview-open').addEventListener('click', runPreview);
$('preview-close').addEventListener('click', closePreview);
$('preview-dialog').addEventListener('close', () => { if (busy && controller) controller.abort(); clearPreview(); });

// Installable, offline-capable app. sw.js caches the app and models after first
// use and adds the headers that enable multi-threaded WASM.
if (navigator.serviceWorker && /^https?:$/.test(location.protocol || '')) {
  navigator.serviceWorker.register(assetUrl('./sw.js')).catch(error => console.warn('Service worker registration failed.', error));
}
// Android share target: sw.js stores shared images and redirects here with ?shared.
async function importSharedFiles() {
  if (!new URLSearchParams(location.search || '').has('shared') || typeof caches === 'undefined') return;
  history.replaceState(null, '', location.pathname);
  const cache = await caches.open('upscale-share'), files = [];
  for (const request of await cache.keys()) {
    const response = await cache.match(request), blob = await response.blob();
    files.push(new File([blob], decodeURIComponent(response.headers.get('x-file-name') || 'image'), { type: blob.type }));
    await cache.delete(request);
  }
  if (files.length) acceptFiles(files.slice(0, 10));
}
importSharedFiles().catch(error => console.warn('Shared files could not be opened.', error));
syncFormatControl();
updateSettings();


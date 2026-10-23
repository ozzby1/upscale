// Abacus, also used by Photoengraving.online, stores the shared aggregate.
// This separate namespace counts only Photoupscale's completed full images.
// No images, filenames or persistent visitor IDs are sent to the counter.
(() => {
  'use strict';
  const root = 'https://abacus.jasoncameron.dev';
  const counter = 'photoupscale-online-8d06bf2f/upscaled-images';
  const output = document.getElementById('usage-counter');
  const cs = document.documentElement.lang === 'cs';
  let total = null, queue = Promise.resolve(), reading = false;
  function render() {
    if (!output) return;
    const label = cs ? 'Celkem zvětšených obrázků' : 'Total images upscaled';
    output.textContent = `${label}: ${total === null ? '—' : total.toLocaleString(cs ? 'cs-CZ' : 'en-US')}`;
  }
  async function request(operation) {
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${root}/${operation}/${counter}`, {
        mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer',
        cache: 'no-store', keepalive: true, signal: controller.signal,
      });
      // Abacus creates a missing counter on its first hit. Before that it is 0.
      if (operation === 'get' && response.status === 404) return 0;
      if (!response.ok) throw new Error('Counter unavailable');
      const { value } = await response.json();
      if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid counter');
      return value;
    } finally { clearTimeout(timeout); }
  }
  function accept(value) {
    // A slower GET must not replace a newer increment response with old data.
    total = Math.max(total ?? 0, value);
    render();
  }
  async function refresh() {
    if (reading) return;
    reading = true;
    try { accept(await request('get')); }
    catch { render(); }
    finally { reading = false; }
  }
  function record() {
    // Called once per successful result, outside download/re-export handlers.
    // Serialize batch hits, and never retry a hit after an ambiguous failure:
    // Abacus has no completion-ID deduplication, so a retry could count twice.
    queue = queue.then(async () => {
      try { accept(await request('hit')); }
      catch { /* A statistics outage must not fail an image operation. */ }
    });
    return queue;
  }
  globalThis.usageCounter = { record };
  render();
  void refresh();
  addEventListener('online', () => { void refresh(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void refresh();
  });
})();

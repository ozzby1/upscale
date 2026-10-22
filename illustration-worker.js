/* Real-ESRGAN x4plus anime 6B. All inference stays in this dedicated worker. */
let session, provider;
const base = new URL('./', self.location.href);
async function init(cpuOnly, variant) {
  provider = 'wasm';
  if (!cpuOnly && self.navigator.gpu) {
    const adapter = await self.navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (adapter && !adapter.info?.isFallbackAdapter) provider = 'webgpu';
  }
  const gpu = provider === 'webgpu';
  importScripts(new URL(gpu ? 'vendor/ort/ort.webgpu.min.js' : 'vendor/ort/ort.wasm.min.js', base).href);
  const runtime = 'ort-wasm-simd-threaded' + (gpu ? '.asyncify' : '');
  ort.env.wasm.wasmPaths = {
    mjs: new URL(`vendor/ort/${runtime}.mjs?v=1.30.0`, base).href,
    wasm: new URL(`vendor/ort/${runtime}.wasm?v=1.30.0`, base).href,
  };
  ort.env.wasm.numThreads = 1;
  if (gpu) ort.env.webgpu.powerPreference = 'high-performance';
  const model = new URL(variant === 'detail' ? 'models/illustration/model.onnx' : 'models/illustration-quick/model.onnx', base).href;
  // Request a single provider: a rejected GPU must not silently become a CPU
  // session labelled as GPU. The main thread retries in a fresh CPU worker.
  session = await ort.InferenceSession.create(model, {
    executionProviders: [provider],
  });
  return { provider };
}

// Crop away contextual padding, then area-downsample the native 4x output for 2x.
function illustrationPixels(data, side, padding, core, factor) {
  const outputSide = side * 4, plane = outputSide * outputSide;
  const size = core * factor, step = 4 / factor;
  const pixels = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const target = (y * size + x) * 4;
    for (let channel = 0; channel < 3; channel++) {
      let sum = 0;
      for (let dy = 0; dy < step; dy++) for (let dx = 0; dx < step; dx++) {
        const source = (padding * 4 + y * step + dy) * outputSide + padding * 4 + x * step + dx;
        sum += data[channel * plane + source];
      }
      pixels[target + channel] = Math.round(Math.min(1, Math.max(0, sum / (step * step))) * 255);
    }
    pixels[target + 3] = 255;
  }
  return pixels;
}

self.onmessage = async ({ data: message }) => {
  const { id, type } = message;
  try {
    if (type === 'init') { self.postMessage({ id, ...await init(message.cpuOnly, message.variant) }); return; }
    if (type !== 'tile' || !session) throw new Error('Illustration session is not ready.');
    const { rgba, side, padding, core, factor } = message;
    const plane = side * side, values = new Float32Array(plane * 3);
    for (let p = 0; p < plane; p++) for (let c = 0; c < 3; c++) values[c * plane + p] = rgba[p * 4 + c] / 255;
    const input = new ort.Tensor('float32', values, [1, 3, side, side]);
    let outputs;
    try {
      outputs = await session.run({ [session.inputNames[0]]: input });
      const output = outputs[session.outputNames[0]];
      if (output.dims.join(',') !== `1,3,${side * 4},${side * 4}`) throw new Error('Unexpected illustration model dimensions.');
      const pixels = illustrationPixels(await output.getData(), side, padding, core, factor);
      self.postMessage({ id, pixels, provider }, [pixels.buffer]);
    } finally {
      input.dispose();
      if (outputs) for (const output of Object.values(outputs)) output.dispose();
    }
  } catch (error) { self.postMessage({ id, error: error.message, provider, initializing: type === 'init', gpuAttempt: type === 'init' && !message.cpuOnly && !!self.navigator.gpu }); }
};

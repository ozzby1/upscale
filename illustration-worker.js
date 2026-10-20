/* Real-ESRGAN x4plus anime 6B. All inference stays in this dedicated worker. */
let session, provider;
const base = new URL('./', self.location.href);
async function init(cpuOnly) {
  importScripts(new URL('vendor/ort/ort.webgpu.min.js', base).href);
  ort.env.wasm.wasmPaths = {
    mjs: new URL('vendor/ort/ort-wasm-simd-threaded.asyncify.mjs?v=1.30.0', base).href,
    wasm: new URL('vendor/ort/ort-wasm-simd-threaded.asyncify.wasm?v=1.30.0', base).href,
  };
  ort.env.wasm.numThreads = 1;
  const model = new URL('models/illustration/model.onnx', base).href;
  provider = !cpuOnly && self.navigator.gpu ? 'webgpu' : 'wasm';
  // A failed WASM initialization poisons this runtime instance. Let the main
  // thread retry in a fresh worker rather than reusing a failed instance.
  session = await ort.InferenceSession.create(model, {
    executionProviders: provider === 'webgpu' ? ['webgpu', 'wasm'] : ['wasm'],
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
    if (type === 'init') { self.postMessage({ id, ...await init(message.cpuOnly) }); return; }
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

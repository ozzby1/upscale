#!/usr/bin/env bash
# Assemble the deployable static site in _site/. Used by .github/workflows/pages.yml
# (deploy) and .github/workflows/audit.yml (pull requests).
set -euo pipefail
cd "$(dirname "$0")/.."

npm install --no-save --ignore-scripts --no-audit --no-fund \
  @tensorflow/tfjs@4.11.0 @tensorflow/tfjs-backend-wasm@4.11.0 @upscalerjs/esrgan-slim@1.0.0 \
  onnxruntime-web@1.30.0 linkedom@0.18.12 @napi-rs/canvas@0.1.80 playwright@1.56.1

rm -rf _site
mkdir -p _site/info _site/cs _site/tests _site/icons _site/vendor/ort _site/models/x2 _site/models/x4 _site/models/illustration-quick _site/models/photo

# App
cp index.html app.js usage-counter.js sw.js manifest.webmanifest illustration-worker.js robots.txt sitemap.xml llms.txt _site/
cp info/index.html _site/info/
cp cs/index.html cs/manifest.webmanifest _site/cs/
cp icons/*.png _site/icons/
cp tests/browser-performance.html tests/batch-fixtures.html _site/tests/
# The service worker cache is versioned per deployed commit.
BUILD_ID="${GITHUB_SHA:-$(git rev-parse HEAD 2>/dev/null || date +%s)}"
sed -i "s/__BUILD__/${BUILD_ID}/" _site/sw.js

# TensorFlow.js runtime + ESRGAN-slim ("Fast" model)
cp node_modules/@tensorflow/tfjs/dist/tf.min.js _site/vendor/
cp node_modules/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.min.js _site/vendor/
cp node_modules/@tensorflow/tfjs-backend-wasm/dist/*.wasm _site/vendor/
cp node_modules/@upscalerjs/esrgan-slim/models/x2/* _site/models/x2/
cp node_modules/@upscalerjs/esrgan-slim/models/x4/* _site/models/x4/
cp node_modules/@upscalerjs/esrgan-slim/LICENSE _site/models/LICENSE-esrgan.txt
curl --retry 3 -fsSL https://raw.githubusercontent.com/tensorflow/tfjs/tfjs-v4.11.0/LICENSE -o _site/vendor/LICENSE-tensorflow.txt

# ONNX Runtime Web + Real-ESRGAN models ("Illustrations" and "Photos")
cp node_modules/onnxruntime-web/dist/ort.{webgpu,wasm}.min.js _site/vendor/ort/
cp node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded{,.asyncify}.{mjs,wasm} _site/vendor/ort/
curl --retry 3 -fsSL https://raw.githubusercontent.com/microsoft/onnxruntime/v1.30.0/LICENSE -o _site/vendor/ort/LICENSE-onnxruntime.txt
curl --retry 3 -fsSL https://raw.githubusercontent.com/xinntao/Real-ESRGAN/v0.3.0/LICENSE -o _site/models/illustration-quick/LICENSE-Real-ESRGAN.txt
cp _site/models/illustration-quick/LICENSE-Real-ESRGAN.txt _site/models/photo/LICENSE-Real-ESRGAN.txt
curl --retry 3 -fsSL https://huggingface.co/skillsafe-ai/realesr-animevideov3/resolve/185e9142d439d17e3fb99395600fb7d08af09de5/model.onnx -o _site/models/illustration-quick/model.onnx
echo "78baa685a1a92cac6e14ab2af2a8ad0ef56fa48629563b1414e3a7acc54d86e2  _site/models/illustration-quick/model.onnx" | sha256sum --check
# Photo model: Real-ESRGAN general x4v3 + its weak-denoise variant, converted to one
# ONNX file by tools/convert-realesr-general.py (numpy only). The conversion is
# deterministic, so the result is pinned by models/photo/model.onnx.sha256.
if [ ! -f models/photo/model.onnx ]; then
  mkdir -p .cache/photo
  for name in realesr-general-x4v3 realesr-general-wdn-x4v3; do
    [ -f ".cache/photo/$name.pth" ] || curl --retry 3 -fsSL "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/$name.pth" -o ".cache/photo/$name.pth"
  done
  (cd .cache/photo && sha256sum --check <<'SUMS'
8dc7edb9ac80ccdc30c3a5dca6616509367f05fbc184ad95b731f05bece96292  realesr-general-x4v3.pth
1641f8c4464b9f097c9fdda5589273713f67cf59f3d909e0bd688f0cee269dca  realesr-general-wdn-x4v3.pth
SUMS
  )
  python3 -c 'import numpy' 2>/dev/null || { python3 -m venv .cache/venv && .cache/venv/bin/pip install --quiet 'numpy>=1.24'; PY=.cache/venv/bin/python; }
  "${PY:-python3}" tools/convert-realesr-general.py .cache/photo/realesr-general-x4v3.pth .cache/photo/realesr-general-wdn-x4v3.pth models/photo/model.onnx
fi
(cd models/photo && sha256sum --check model.onnx.sha256)
cp models/photo/model.onnx _site/models/photo/

touch _site/.nojekyll
echo "Site assembled in _site (build ${BUILD_ID})"

#!/usr/bin/env bash
# Run all checks against the assembled _site/. Any failure stops the deploy.
set -euo pipefail
cd "$(dirname "$0")/.."
node tests/seo.cjs _site
npx playwright install --with-deps chromium
node tests/cpu-performance.cjs
node tests/browser-runtime.cjs _site
node tests/batch.cjs _site
node tests/browser-e2e.cjs _site

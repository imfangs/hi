#!/bin/zsh
cd "${0:A:h}" || exit 1
if [[ ! -d node_modules ]]; then
  npm ci --registry=https://registry.npmjs.org || exit 1
fi
npm run dev -- --open

#!/usr/bin/env bash
# fila.sh pasta1 pasta2 ... : espera renders anteriores e roda render + mixagem em sequência
cd "$(dirname "$0")/.."
for d in "$@"; do
  while pgrep -f "node ../_lib/render.js$" >/dev/null; do sleep 5; done
  (cd "$d" && node ../_lib/render.js > build/render.log 2>&1 && bash ../_lib/montar.sh >> build/render.log 2>&1; echo DONE >> build/render.log)
done

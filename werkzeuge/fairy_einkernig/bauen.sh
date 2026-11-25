#!/usr/bin/env bash
# Baut Fairy-Stockfish einkernig nach WebAssembly (ohne Threads, ohne SharedArrayBuffer), für die
# Schachvarianten des Schach-Abenteuers (docs/spiel/10_Sprueche_Schauplaetze_Varianten.md 3a).
# Grund: Das npm-Paket fairy-stockfish-nnue.wasm braucht Threads und damit Cross-Origin-Isolation,
# die GitHub Pages nicht setzt (Entscheidung 13.10.2026: keine COOP/COEP-Kopfzeilen).
# Voraussetzung: emsdk (source emsdk_env.sh), git, node. Aufruf: werkzeuge/fairy_einkernig/bauen.sh
# Ergebnis: app/public/engine-varianten/fairy-stockfish-einkernig.{js,wasm} und Lizenztexte.
set -euo pipefail
HIER="$(cd "$(dirname "$0")" && pwd)"
ZIEL="$HIER/../../app/public/engine-varianten"
QUELLE="${FAIRY_QUELLE:-/tmp/fairy-stockfish.wasm}"
STAND=718ebc6801702408f6650598cc52bcf87946696c   # fairy-stockfish/fairy-stockfish.wasm, Zweig nnue
if [ ! -d "$QUELLE/.git" ]; then git clone https://github.com/fairy-stockfish/fairy-stockfish.wasm.git "$QUELLE"; fi
git -C "$QUELLE" fetch -q origin "$STAND" || true
git -C "$QUELLE" checkout -q -f "$STAND"
git -C "$QUELLE" apply "$HIER/einkernig.patch"
( cd "$QUELLE/src" && make build ARCH=wasm nnue=no largeboards=no COMP=em++ -j"$(nproc)" )
mkdir -p "$ZIEL"
cat "$QUELLE/src/stockfish.js" "$HIER/worker-ende.js" > "$ZIEL/fairy-stockfish-einkernig.js"
cp "$QUELLE/src/stockfish.wasm" "$ZIEL/fairy-stockfish-einkernig.wasm"
cp "$QUELLE/Copying.txt" "$ZIEL/LIZENZ-fairy-stockfish.txt"
cp "$QUELLE/AUTHORS" "$ZIEL/AUTOREN-fairy-stockfish.txt"
git -C "$QUELLE" checkout -q -f "$STAND"
echo "fertig: $ZIEL"

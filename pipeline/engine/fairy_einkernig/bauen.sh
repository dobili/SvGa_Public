#!/usr/bin/env bash
# Baut Fairy-Stockfish einkernig nach WebAssembly (Schachvarianten, Auftrag des Hauptchats, 26.11.2026).
#
# Warum selbst bauen: Das npm-Paket fairy-stockfish-nnue.wasm braucht Threads, also SharedArrayBuffer
# und COOP/COEP-Kopfzeilen, die GitHub Pages nicht setzt. Die App rechnet bewusst auf einem Kern
# (Entscheidung 13.10.2026). einkernig.patch lässt die Suche synchron im Worker laufen.
#
# Voraussetzung: emsdk aktiv (source …/emsdk_env.sh), git, make, node.
# Aufruf: pipeline/engine/fairy_einkernig/bauen.sh [ZIELORDNER]   (Vorgabe: app/public/engine/fairy)
# Ergebnis: stockfish.js, stockfish.wasm, LIZENZ-fairy-stockfish.txt, AUTHORS, QUELLE.txt im Ziel.
set -euo pipefail

# fairy-stockfish/fairy-stockfish.wasm, Zweig nnue, Stand 19.11.2026 (mit „duck“ und allen Varianten).
QUELLE=https://github.com/fairy-stockfish/fairy-stockfish.wasm.git
COMMIT=718ebc6801702408f6650598cc52bcf87946696c

HIER=$(cd "$(dirname "$0")" && pwd)
ZIEL=${1:-"$HIER/../../../app/public/engine/fairy"}
ARBEIT=$(mktemp -d)
trap 'rm -rf "$ARBEIT"' EXIT

git clone -q "$QUELLE" "$ARBEIT/fsw"
git -C "$ARBEIT/fsw" checkout -q "$COMMIT"
git -C "$ARBEIT/fsw" apply "$HIER/einkernig.patch"

EMVERSION=$(emcc --version | head -n 1 | sed 's/.* \([0-9][0-9.]*\) .*/\1/')
# NNUE aus: Fairy-Stockfish bewertet Varianten dann klassisch; kein Netz im Download (etwa 1 MB).
make -C "$ARBEIT/fsw/src" -j"$(nproc)" emscripten_einkernig \
  ARCH=wasm einkernig=yes embedded_nnue=no minify_js=yes \
  EM_COMMIT="${COMMIT:0:7}" EM_UPSTREAM="${COMMIT:0:7}" EM_EMSCRIPTEN="$EMVERSION"

mkdir -p "$ZIEL"
cp "$ARBEIT/fsw/src/stockfish.js" "$ARBEIT/fsw/src/stockfish.wasm" "$ZIEL/"
cp "$ARBEIT/fsw/Copying.txt" "$ZIEL/LIZENZ-fairy-stockfish.txt"
cp "$ARBEIT/fsw/AUTHORS" "$ZIEL/AUTHORS"
printf 'Fairy-Stockfish (GPL 3), %s @ %s, einkernig gebaut mit emscripten %s und pipeline/engine/fairy_einkernig/einkernig.patch\n' \
  "$QUELLE" "$COMMIT" "$EMVERSION" > "$ZIEL/QUELLE.txt"

node "$HIER/pruefe.mjs" "$ZIEL"
ls -la "$ZIEL"

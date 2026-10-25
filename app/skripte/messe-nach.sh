#!/bin/bash
# Nachmessung nach Plan C (Nachtarbeit 25./26.10.2026), ein Teil je Chat: die Paarungen aus
# messplan-nach/<fassung>/teil-N.txt (erzeugt von src/engine/messplan-nach.messung.ts) mit je 24
# Partien, ohne Anker (die der Neumessung gelten weiter). Ergebnis auf Zweig messung-nach-<fassung>-N.
# Aufruf (im Ordner app/): skripte/messe-nach.sh ohne 3
# Fertige Paarungen (Datei vorhanden) werden beim Neustart übersprungen.
set -euo pipefail
set -f  # Kürzel mit „*“ (Maia) nicht als Dateimuster lesen
FASSUNG=${1:?Fassung ohne oder mit}
N=${2:?Teil 1 bis 10}
APP=$(cd "$(dirname "$0")/.." && pwd)
cd "$APP"
PLAN="$APP/messplan-nach/$FASSUNG/teil-$N.txt"
ZIEL="$APP/../messdaten/nach/$FASSUNG/teil-$N"
mkdir -p "$ZIEL/neu-nach"
[ -d node_modules ] || npm ci
npm run vorbereiten > /dev/null
ENGINE="$APP/.engine/stockfish-ubuntu-x86-64-avx2"
if [ ! -x "$ENGINE" ]; then
  mkdir -p "$APP/.engine"
  curl -sSL -o "$APP/.engine/stockfish.tar" \
    https://github.com/official-stockfish/Stockfish/releases/download/sf_17.1/stockfish-ubuntu-x86-64-avx2.tar
  tar -xf "$APP/.engine/stockfish.tar" -C "$APP/.engine" --strip-components=1 stockfish/stockfish-ubuntu-x86-64-avx2
  chmod +x "$ENGINE"
fi
export MESSUNG_ENGINE_PFAD="$ENGINE" VITE_CONFIG_NATIVE_IGNORE_WARNING=true
PAARE=$(sed -n 1p "$PLAN")
REST=$(for p in $PAARE; do [ -s "$ZIEL/neu-nach/$p.json" ] || echo "$p"; done)
[ -z "$REST" ] || node skripte/messe-stufen.mjs $REST --partien 24 --parallel 4 --ziel "$ZIEL/neu-nach"
echo "fertig $(date -u +%FT%TZ)" > "$ZIEL/fertig.txt"
cd "$APP/.."
git checkout -q -B "messung-nach-$FASSUNG-$N"
git add "messdaten/nach/$FASSUNG/teil-$N"
git commit -q -m "Nachmessung nach Plan C, $FASSUNG Maia, Teil $N

Warum: 24 Partien mehr je Bot und Gruppe, damit die Zahlen weniger streuen (0.2.144)." || echo "nichts zu committen"
git push -u origin "messung-nach-$FASSUNG-$N"
echo "FERTIG: messdaten/nach/$FASSUNG/teil-$N auf Zweig messung-nach-$FASSUNG-$N"

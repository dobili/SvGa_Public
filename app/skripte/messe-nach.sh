#!/bin/bash
# Nachmessung nach Plan C (Nachtarbeit 25./26.10.2026), ein Teil je Chat: die Paarungen aus
# messplan-nach/<fassung>/teil-N.txt (erzeugt von src/engine/messplan-nach.messung.ts) mit je 24
# Partien, ohne Anker (die der Neumessung gelten weiter). Ergebnis auf Zweig messung-nach-<fassung>-N.
# Aufruf (im Ordner app/): skripte/messe-nach.sh ohne 3
# Mit PLANORDNER, ZIELNAME und PARTIEN auch für andere Pläne (etwa die Gruppen nach der neuen
# Ordnung, 0.2.144): PLANORDNER=messplan-gruppen ZIELNAME=gruppen PARTIEN=36 skripte/messe-nach.sh mit 1
# Fertige Paarungen (Datei vorhanden) werden beim Neustart übersprungen.
set -euo pipefail
set -f  # Kürzel mit „*“ (Maia) nicht als Dateimuster lesen
FASSUNG=${1:?Fassung ohne oder mit}
N=${2:?Teil 1 bis 10}
APP=$(cd "$(dirname "$0")/.." && pwd)
cd "$APP"
PLANORDNER=${PLANORDNER:-messplan-nach}
ZIELNAME=${ZIELNAME:-nach}
PARTIEN=${PARTIEN:-24}
PLAN="$APP/$PLANORDNER/$FASSUNG/teil-$N.txt"
ZIEL="$APP/../messdaten/$ZIELNAME/$FASSUNG/teil-$N"
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
[ -z "$REST" ] || node skripte/messe-stufen.mjs $REST --partien "$PARTIEN" --parallel 4 --ziel "$ZIEL/neu-nach"
echo "fertig $(date -u +%FT%TZ)" > "$ZIEL/fertig.txt"
cd "$APP/.."
git checkout -q -B "messung-$ZIELNAME-$FASSUNG-$N"
git add "messdaten/$ZIELNAME/$FASSUNG/teil-$N"
git commit -q -m "Messung $ZIELNAME, $FASSUNG Maia, Teil $N

Warum: mehr Partien je Bot und Gruppe, damit die Zahlen weniger streuen (0.2.144)." || echo "nichts zu committen"
git push -u origin "messung-$ZIELNAME-$FASSUNG-$N"
echo "FERTIG: messdaten/$ZIELNAME/$FASSUNG/teil-$N auf Zweig messung-$ZIELNAME-$FASSUNG-$N"

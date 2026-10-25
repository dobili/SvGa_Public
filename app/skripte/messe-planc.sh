#!/bin/bash
# Neumessung von Plan C (0.2.143, Freigabe des Autors 25.10.2026), ein Teil je Chat: erst die Anker
# des Teils (Nm gegen Nm, ohne und mit Maia, 40 Partien, Bewertung in Tiefe 18), dann die Paarungen
# (Bots, Gruppen, Neuling-Kandidaten gegen Nm-Stufen, je 12 Partien). Plan: messplan/<fassung>/
# teil-N.txt (erzeugt von src/engine/messplan.messung.ts), Fassung „ohne“ oder „mit“ Maia.
# Ergebnis auf Zweig messung-planc-<fassung>-N.
# Aufruf (im Ordner app/): skripte/messe-planc.sh ohne 3
# Fertige Paarungen (Datei vorhanden) werden beim Neustart übersprungen.
set -euo pipefail
set -f  # Kürzel mit „*“ (Maia) nicht als Dateimuster lesen
FASSUNG=${1:?Fassung ohne oder mit}
N=${2:?Teil 1 bis 10}
APP=$(cd "$(dirname "$0")/.." && pwd)
cd "$APP"
PLAN="$APP/messplan/$FASSUNG/teil-$N.txt"
ZIEL="$APP/../messdaten/planc/$FASSUNG/teil-$N"
mkdir -p "$ZIEL/anker-s$N" "$ZIEL/neu-bots"
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
ANKER=$(sed -n 1p "$PLAN")
PAARE=$(sed -n 2p "$PLAN")
node skripte/messe-stufen.mjs $ANKER --partien 40 --parallel 4 --ziel "$ZIEL/anker-s$N"
node skripte/anker-zu-jsonl.mjs "$ZIEL"
# Höchstens 150 Minuten: eine Partie mit mehreren Damen kann die Bewertung festhalten (25.10.2026).
timeout 150m node skripte/eichung-rechnen.mjs --ordner "$ZIEL/anker-bewertung" --quellen stufen \
  --parallel 4 --minuten 145 > "$ZIEL/log-bewertung.txt" 2>&1 || true
REST=$(for p in $PAARE; do [ -s "$ZIEL/neu-bots/$p.json" ] || echo "$p"; done)
[ -z "$REST" ] || node skripte/messe-stufen.mjs $REST --partien 12 --parallel 4 --ziel "$ZIEL/neu-bots"
echo "fertig $(date -u +%FT%TZ)" > "$ZIEL/fertig.txt"
cd "$APP/.."
git checkout -q -B "messung-planc-$FASSUNG-$N"
git add "messdaten/planc/$FASSUNG/teil-$N"
git commit -q -m "Neumessung Plan C, $FASSUNG Maia, Teil $N (Anker und Paarungen)

Warum: Zahlen der Stufen, Bots und Gruppen nach Plan C und mit Maia (0.2.143)." || echo "nichts zu committen"
git push -u origin "messung-planc-$FASSUNG-$N"
echo "FERTIG: messdaten/planc/$FASSUNG/teil-$N auf Zweig messung-planc-$FASSUNG-$N"

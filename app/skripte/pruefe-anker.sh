#!/bin/bash
# Prüfmessung 0.2.131 (docs/ENTSCHEIDUNGEN.md, „Bots als ein Mensch mit drei Wertungen“): die
# Nm-Stufe gegen sich selbst in einer Zeitklasse (40 Partien mit Uhr), bewertet in Tiefe 18.
# Warum: Die Genauigkeit dieser Partien zeigt, wie stark die Stufe in Blitz bzw. Klassisch spielt;
# sie soll zur umgerechneten Zahl passen (engine/zeitklassenabstand.ts).
# Aufruf (im Ordner app/): skripte/pruefe-anker.sh blitz 3 → Zweig pruefung-blitz-3
#   skripte/pruefe-anker.sh blitz 3 r2 → Zweig pruefung-blitz-3-r2 (weitere Runde)
#   skripte/pruefe-anker.sh blitz 3 maia mit → mit Maia (Kürzel „3m*“), Zweig pruefung-blitz-3-maia
#   (0.2.143: prüft die Umrechnung je Zeitklasse auch für den Zahlensatz mit Maia)
# Achtung: Die Partien hängen nur von Stand und Zufallssaat ab. Eine weitere Runde auf demselben
# Stand liefert genau dieselben Partien (26.10.2026: pruefung-blitz-8-r2 glich pruefung-blitz-8-planc
# Zug für Zug). Für eine neue Stichprobe die Saaten verschieben, etwa
#   MESSUNG_SAAT_AB=1000 skripte/pruefe-anker.sh blitz 8 r3
set -euo pipefail
set -f  # Kürzel mit „*“ (Maia) nicht als Dateimuster lesen
ZEITKLASSE=${1:?Zeitklasse blitz oder klassisch}
N=${2:?Stufe}
RUNDE=${3:+-$3}
STERN=""
[ "${4:-}" = "mit" ] && STERN="*"
case "$ZEITKLASSE" in blitz) UHR="180+2" ;; klassisch) UHR="1800+20" ;; *) exit 1 ;; esac
APP=$(cd "$(dirname "$0")/.." && pwd)
cd "$APP"
ZIEL="$APP/../pruefung/$ZEITKLASSE/stufe-$N$RUNDE"
mkdir -p "$ZIEL"
[ -d node_modules ] || npm ci
ENGINE="$APP/.engine/stockfish-ubuntu-x86-64-avx2"
if [ ! -x "$ENGINE" ]; then
  mkdir -p "$APP/.engine"
  curl -sSL -o "$APP/.engine/stockfish.tar" \
    https://github.com/official-stockfish/Stockfish/releases/download/sf_17.1/stockfish-ubuntu-x86-64-avx2.tar
  tar -xf "$APP/.engine/stockfish.tar" -C "$APP/.engine" --strip-components=1 stockfish/stockfish-ubuntu-x86-64-avx2
  chmod +x "$ENGINE"
fi
export MESSUNG_ENGINE_PFAD="$ENGINE" VITE_CONFIG_NATIVE_IGNORE_WARNING=true
node skripte/messe-stufen.mjs "${N}m${STERN}~${UHR}-${N}m${STERN}~${UHR}" --partien 40 --parallel 4 --ziel "$ZIEL/anker-s$N"
node skripte/anker-zu-jsonl.mjs "$ZIEL"
# Höchstens 100 Minuten: Eine Partie mit mehreren Damen kann die Bewertung festhalten (25.10.2026).
timeout 100m node skripte/eichung-rechnen.mjs --ordner "$ZIEL/anker-bewertung" --quellen stufen \
  --parallel 4 --minuten 95 > "$ZIEL/log-bewertung.txt" 2>&1 || true
echo "fertig $(date -u +%FT%TZ)" > "$ZIEL/fertig.txt"
cd "$APP/.."
git checkout -q -B "pruefung-$ZEITKLASSE-$N$RUNDE"
git add "pruefung/$ZEITKLASSE/stufe-$N$RUNDE"
git commit -q -m "Prüfmessung $ZEITKLASSE Stufe $N$RUNDE (Anker, Tiefe 18)

Warum: Prüfung der Umrechnung je Zeitklasse (0.2.131)." || echo "nichts zu committen"
git push -u origin "pruefung-$ZEITKLASSE-$N$RUNDE"
echo "FERTIG: pruefung/$ZEITKLASSE/stufe-$N$RUNDE auf Zweig pruefung-$ZEITKLASSE-$N$RUNDE"

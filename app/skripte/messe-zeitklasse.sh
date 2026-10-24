#!/bin/bash
# Messung der Bots einer Gruppe in einer Zeitklasse (Blitz 3+2 oder Klassisch 30+20), für die drei
# Zahlen je Bot (R51). Läuft je Gruppe in einem eigenen Chat; der Koordinierungschat wertet alle
# Ordner zusammen aus (engine/botstaerke.messung.ts mit BOTELO_TEMPO und BOTELO_ORDNER).
#
# Warum so: Ein Chat allein bräuchte für eine Zeitklasse vier bis fünf Stunden (Engpass ist die
# Tiefe-18-Bewertung der Ankerpartien); zehn Chats mit je einer Gruppe schaffen es in etwa einer
# Stunde. Jeder Chat spielt die Anker seiner Nm-Stufe (40 Partien gegen sich selbst), bewertet sie
# in Tiefe 18 mit vier Läufen und lässt die Bots seiner Gruppe gegen die zwei nächsten Nm-Stufen
# spielen (je 10 Partien, mit Uhr). Gruppe 10 misst dazu die reinen Spitzenstufen.
#
# Aufruf (im Ordner app/, Netz nötig für Engine und Pakete):
#   skripte/messe-zeitklasse.sh blitz 3        → messdaten/blitz/gruppe-3/, Zweig messung-blitz-3
#   skripte/messe-zeitklasse.sh klassisch 7
# Ergebnis: Rohdaten (Partien, Bewertungen) in messdaten/<zeitklasse>/gruppe-N/, committet und
# gepusht auf den Zweig messung-<zeitklasse>-N. Keine Buchinhalte, nur Bot-Partien.
set -euo pipefail
ZEITKLASSE=${1:?Zeitklasse blitz oder klassisch}
GRUPPE=${2:?Gruppe 1 bis 10}
case "$ZEITKLASSE" in
  blitz) UHR="180+2" ;;
  klassisch) UHR="1800+20" ;;
  *) echo "Zeitklasse blitz oder klassisch"; exit 1 ;;
esac
APP=$(cd "$(dirname "$0")/.." && pwd)
cd "$APP"
ZIEL="$APP/../messdaten/$ZEITKLASSE/gruppe-$GRUPPE"
mkdir -p "$ZIEL"

# 1. Pakete und native Engine (Stockfish 17.1, GPL; viel schneller als die WASM-Engine der App)
[ -d node_modules ] || npm ci
ENGINE="$APP/.engine/stockfish-ubuntu-x86-64-avx2"
if [ ! -x "$ENGINE" ]; then
  mkdir -p "$APP/.engine"
  curl -sSL -o "$APP/.engine/stockfish.tar" \
    https://github.com/official-stockfish/Stockfish/releases/download/sf_17.1/stockfish-ubuntu-x86-64-avx2.tar
  tar -xf "$APP/.engine/stockfish.tar" -C "$APP/.engine" --strip-components=1 stockfish/stockfish-ubuntu-x86-64-avx2
  chmod +x "$ENGINE"
fi
export MESSUNG_ENGINE_PFAD="$ENGINE"
export VITE_CONFIG_NATIVE_IGNORE_WARNING=true

# 2. Anker: die Nm-Stufe der Gruppe gegen sich selbst, mit Uhr (40 Partien)
echo "Anker ${GRUPPE}m mit $UHR"
node skripte/messe-stufen.mjs "${GRUPPE}m~${UHR}-${GRUPPE}m~${UHR}" --partien 40 --parallel 3 --ziel "$ZIEL/anker-s$GRUPPE"
node skripte/anker-zu-jsonl.mjs "$ZIEL"

# 3. Bewertung in Tiefe 18 (vier Läufe) im Hintergrund, parallel die Bot-Partien
node skripte/eichung-rechnen.mjs --ordner "$ZIEL/anker-bewertung" --quellen stufen --parallel 4 --minuten 300 > "$ZIEL/log-bewertung.txt" 2>&1 &
BEWERTUNG=$!

# 4. Die Bots der Gruppe gegen die zwei nächsten Nm-Stufen (Gruppe 9 und 10: 9m und die reine 10)
BOTS=$(node skripte/gruppen-bots.mjs "$GRUPPE")
if [ "$GRUPPE" -ge 9 ]; then GEGNER="9m 10"; else GEGNER="${GRUPPE}m $((GRUPPE + 1))m"; fi
PAARUNGEN=""
for b in $BOTS; do for g in $GEGNER; do PAARUNGEN="$PAARUNGEN @${b}~${UHR}-${g}~${UHR}"; done; done
if [ "$GRUPPE" -eq 10 ]; then PAARUNGEN="$PAARUNGEN 10~${UHR}-9m~${UHR} 9~${UHR}-9m~${UHR} 8~${UHR}-8m~${UHR} 9~${UHR}-8m~${UHR}"; fi
echo "Paarungen: $PAARUNGEN"
# shellcheck disable=SC2086
node skripte/messe-stufen.mjs $PAARUNGEN --partien 10 --parallel 3 --ziel "$ZIEL/neu-gruppe$GRUPPE"
wait $BEWERTUNG
echo "fertig $(date -u +%FT%TZ)" > "$ZIEL/fertig.txt"

# 5. Ergebnis auf einen eigenen Zweig
cd "$APP/.."
git checkout -q -B "messung-$ZEITKLASSE-$GRUPPE"
git add "messdaten/$ZEITKLASSE/gruppe-$GRUPPE"
git commit -q -m "Messdaten $ZEITKLASSE Gruppe $GRUPPE (Anker ${GRUPPE}m, Bots gegen Nm-Nachbarn, Tiefe 18)

Warum: Rohdaten für die Zahlen je Zeitklasse (R51); der Koordinierungschat wertet alle Gruppen
zusammen aus." || echo "nichts zu committen"
git push -u origin "messung-$ZEITKLASSE-$GRUPPE"
echo "FERTIG: messdaten/$ZEITKLASSE/gruppe-$GRUPPE auf Zweig messung-$ZEITKLASSE-$GRUPPE"

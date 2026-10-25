#!/bin/bash
# Sammelt die Anker der Prüfmessung je Zeitklasse (Zweige pruefung-<zeitklasse>-<stufe>-<runde>,
# skripte/pruefe-anker.sh) in einen Ordner für src/engine/botstaerke.messung.ts (BOTELO_ORDNER,
# BOTELO_TEMPO): anker-sN und anker-bewertung (Dateien nach Stufe umbenannt).
# Aufruf (im Ordner app/): skripte/sammle-pruefung.sh blitz maia ../buch/arbeit/zeitklassen/blitz-maia "2 3 4"
set -euo pipefail
ZEITKLASSE=${1:?blitz oder klassisch}
RUNDE=${2:?Runde, etwa planc oder maia}
ZIEL=${3:?Zielordner}
STUFEN=${4:-"2 3 4 5 6 7 8 9"}
mkdir -p "$ZIEL"
ZIEL=$(cd "$ZIEL" && pwd)
cd "$(git rev-parse --show-toplevel)"
ARBEIT=$(mktemp -d)
rm -rf "$ZIEL"; mkdir -p "$ZIEL/anker-bewertung" "$ZIEL/neu-hilfe"
# Die Auswertung braucht eine Leiter, auf der die Anker liegen; dafür genügt je Stufe eine alte
# Bot-Paarung derselben Zeitklasse (lokal buch/arbeit/zeitklassen/<zeitklasse>/neu-gruppeN). Es
# zählt nur die Ankertabelle des Berichts.
HILFE="$(git rev-parse --show-toplevel)/buch/arbeit/zeitklassen/$ZEITKLASSE"
for n in $STUFEN; do
  ZWEIG="pruefung-$ZEITKLASSE-$n-$RUNDE"
  git fetch -q origin "$ZWEIG" 2>/dev/null || { echo "Stufe $n: Zweig fehlt"; continue; }
  PFAD="pruefung/$ZEITKLASSE/stufe-$n-$RUNDE"
  git archive "origin/$ZWEIG" "$PFAD" | tar -x -C "$ARBEIT"
  cp -r "$ARBEIT/$PFAD/anker-s$n" "$ZIEL/"
  cp "$(ls "$HILFE/neu-gruppe$n"/*-"${n}"m~*.json | head -1)" "$ZIEL/neu-hilfe/"
  for f in "$ARBEIT/$PFAD"/anker-bewertung/bewertet-*.jsonl; do
    cp "$f" "$ZIEL/anker-bewertung/bewertet-$n-$(basename "$f" .jsonl | sed 's/^bewertet-//').jsonl"
  done
done
rm -rf "$ARBEIT"
echo "gesammelt: $ZEITKLASSE $RUNDE → $ZIEL"

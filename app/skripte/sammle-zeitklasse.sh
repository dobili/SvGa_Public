#!/bin/bash
# Sammelt die Messdaten aller Gruppen-Zweige einer Zeitklasse in einen Ordner für die Auswertung
# (docs/MESSUNG_ZEITKLASSEN.md, Abschnitt „Auswertung im Koordinierungschat“, Schritt 1).
#
# Warum ein Skript: Die Bewertungsdateien heißen in jedem Zweig gleich (bewertet-0.jsonl …) und
# müssen beim Zusammenlegen umbenannt werden (bewertet-N-k.jsonl), sonst überschreiben sie sich.
#
# Aufruf (im Ordner app/): skripte/sammle-zeitklasse.sh blitz ../buch/arbeit/zeitklassen/blitz
# Ergebnis: <ziel>/anker-sN, <ziel>/neu-gruppeN, <ziel>/anker-bewertung/bewertet-N-k.jsonl.
# Fehlt ein Zweig oder sein fertig.txt, bricht das Skript mit Meldung ab.
set -euo pipefail
ZEITKLASSE=${1:?Zeitklasse blitz oder klassisch}
ZIEL=${2:?Zielordner}
GRUPPEN=${3:-"1 2 3 4 5 6 7 8 9 10"}
mkdir -p "$ZIEL"
ZIEL=$(cd "$ZIEL" && pwd)
cd "$(git rev-parse --show-toplevel)"
git fetch -q origin 'refs/heads/messung-*:refs/remotes/origin/messung-*'
ARBEIT=$(mktemp -d)
rm -rf "$ZIEL"
mkdir -p "$ZIEL/anker-bewertung"
for n in $GRUPPEN; do
  ZWEIG="origin/messung-$ZEITKLASSE-$n"
  PFAD="messdaten/$ZEITKLASSE/gruppe-$n"
  git show "$ZWEIG:$PFAD/fertig.txt" > /dev/null || { echo "Gruppe $n: nicht fertig"; exit 1; }
  git archive "$ZWEIG" "$PFAD" | tar -x -C "$ARBEIT"
  cp -r "$ARBEIT/$PFAD/anker-s$n" "$ARBEIT/$PFAD/neu-gruppe$n" "$ZIEL/"
  for f in "$ARBEIT/$PFAD"/anker-bewertung/bewertet-*.jsonl; do
    k=$(basename "$f" .jsonl | sed 's/^bewertet-//')
    cp "$f" "$ZIEL/anker-bewertung/bewertet-$n-$k.jsonl"
  done
done
rm -rf "$ARBEIT"
echo "gesammelt: $ZEITKLASSE, Gruppen $GRUPPEN → $ZIEL"

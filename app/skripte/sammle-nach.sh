#!/bin/bash
# Legt die Nachmessung nach Plan C (Zweige messung-nach-<fassung>-N) zu einem schon gesammelten
# Durchgang der Neumessung (skripte/sammle-planc.sh) in den Unterordner neu-nach; die Auswertung
# (src/engine/botstaerke.messung.ts) liest ihn als weitere Leiter-Ergebnisse.
# Aufruf (im Ordner app/): skripte/sammle-nach.sh ohne ../buch/arbeit/planc/ohne
set -euo pipefail
FASSUNG=${1:?ohne oder mit}
ZIEL=${2:?Ordner des gesammelten Durchgangs}
TEILE=${3:-"1 2 3 4 5 6 7 8 9 10"}
ZIEL=$(cd "$ZIEL" && pwd)
cd "$(git rev-parse --show-toplevel)"
git fetch -q origin "refs/heads/messung-nach-$FASSUNG-*:refs/remotes/origin/messung-nach-$FASSUNG-*"
ARBEIT=$(mktemp -d)
rm -rf "$ZIEL/neu-nach"; mkdir -p "$ZIEL/neu-nach"
for n in $TEILE; do
  ZWEIG="origin/messung-nach-$FASSUNG-$n"
  PFAD="messdaten/nach/$FASSUNG/teil-$n"
  git show "$ZWEIG:$PFAD/fertig.txt" > /dev/null || { echo "Teil $n: nicht fertig"; exit 1; }
  git archive "$ZWEIG" "$PFAD" | tar -x -C "$ARBEIT"
  cp "$ARBEIT/$PFAD"/neu-nach/*.json "$ZIEL/neu-nach/"
done
rm -rf "$ARBEIT"
echo "Nachmessung $FASSUNG, Teile $TEILE → $ZIEL/neu-nach"

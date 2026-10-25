#!/bin/bash
# Gruppen nach der festen Ordnung der Bots (0.2.144) neu messen: kopiert einen gesammelten
# Durchgang der Neumessung (skripte/sammle-planc.sh, sammle-nach.sh), nimmt die alten
# Gruppenpartien heraus und legt die neuen (Zweige messung-gruppen-<fassung>-1/2) in neu-gruppen.
# Danach wertet src/engine/botstaerke.messung.ts den Ordner aus; es zählen nur die Zeilen gruppe-N.
# Aufruf (im Ordner app/): skripte/sammle-gruppen.sh ohne ../buch/arbeit/planc/ohne ../buch/arbeit/planc/ohne-gruppen
set -euo pipefail
FASSUNG=${1:?ohne oder mit}
QUELLE=$(cd "${2:?gesammelter Durchgang}" && pwd)
ZIEL=${3:?Zielordner}
rm -rf "$ZIEL"; cp -r "$QUELLE" "$ZIEL"; ZIEL=$(cd "$ZIEL" && pwd)
find "$ZIEL" -name "@gruppe-*" -delete
mkdir -p "$ZIEL/neu-gruppen"
cd "$(git rev-parse --show-toplevel)"
for n in 1 2; do
  ZWEIG="origin/messung-gruppen-$FASSUNG-$n"
  PFAD="messdaten/gruppen/$FASSUNG/teil-$n"
  git fetch -q origin "messung-gruppen-$FASSUNG-$n"
  git show "$ZWEIG:$PFAD/fertig.txt" > /dev/null || { echo "Teil $n: nicht fertig"; exit 1; }
  ARBEIT=$(mktemp -d)
  git archive "$ZWEIG" "$PFAD" | tar -x -C "$ARBEIT"
  cp "$ARBEIT/$PFAD"/neu-nach/*.json "$ZIEL/neu-gruppen/"
  rm -rf "$ARBEIT"
done
echo "Gruppen $FASSUNG → $ZIEL/neu-gruppen"

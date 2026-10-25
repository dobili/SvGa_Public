#!/bin/bash
# Sammelt die zehn Teile eines Durchgangs der Neumessung von Plan C (Zweige messung-planc-<fassung>-N)
# in einen Ordner für src/engine/botstaerke.messung.ts (BOTELO_ORDNER): anker-sN, neu-bots und
# anker-bewertung (Dateien umbenannt nach Teil, damit sie sich nicht überschreiben).
# Aufruf (im Ordner app/): skripte/sammle-planc.sh ohne ../buch/arbeit/planc/ohne
set -euo pipefail
set -f
FASSUNG=${1:?ohne oder mit}
ZIEL=${2:?Zielordner}
TEILE=${3:-"1 2 3 4 5 6 7 8 9 10"}
mkdir -p "$ZIEL"
ZIEL=$(cd "$ZIEL" && pwd)
cd "$(git rev-parse --show-toplevel)"
git fetch -q origin "refs/heads/messung-planc-$FASSUNG-*:refs/remotes/origin/messung-planc-$FASSUNG-*"
ARBEIT=$(mktemp -d)
rm -rf "$ZIEL"; mkdir -p "$ZIEL/anker-bewertung" "$ZIEL/neu-bots"
for n in $TEILE; do
  ZWEIG="origin/messung-planc-$FASSUNG-$n"
  PFAD="messdaten/planc/$FASSUNG/teil-$n"
  git show "$ZWEIG:$PFAD/fertig.txt" > /dev/null || { echo "Teil $n: nicht fertig"; exit 1; }
  git archive "$ZWEIG" "$PFAD" | tar -x -C "$ARBEIT"
  cp -r "$ARBEIT/$PFAD/anker-s$n" "$ZIEL/"
  cp "$ARBEIT/$PFAD"/neu-bots/*.json "$ZIEL/neu-bots/"
  for f in "$ARBEIT/$PFAD"/anker-bewertung/bewertet-*.jsonl; do
    cp "$f" "$ZIEL/anker-bewertung/bewertet-$n-$(basename "$f" .jsonl | sed 's/^bewertet-//').jsonl"
  done
done
rm -rf "$ARBEIT"
echo "gesammelt: $FASSUNG, Teile $TEILE → $ZIEL"

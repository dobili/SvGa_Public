"""Bildwunsch: Reiher im Tierformat „reihen“ (spiel/eigene/reiher_reihen.png), Entwurf von mittel-1.

Warum: Im Bayou fotografiert eine Statistin die Reiher; ohne eigenes Bild zeichnete die App sie als
Möwe (Gutachten Runde 9). Der Autor hat mit Gemini einen Reiherbogen erzeugt (``reiher_bogen.png``,
128 × 128, Rahmen 32 × 32; privat ffb5d0e1): Reihe 1 Stand in vier Richtungen (vorn, rechts,
rechts, hinten), Reihen 2 und 3 Flug nach links, Reihe 4 Stand von der Seite. Das Werkzeug legt
daraus einen Bogen im Format, das ``tierarten.json`` mit Schnitt „reihen“ liest
(``pipeline/abenteuer/belebungsbilder.py``):

- Reihe 0: vier Standbilder in der Reihenfolge rechts, oben, links, unten (links gespiegelt).
- Reihe 1: 24 Bewegungsbilder, je Richtung sechs: rechts der gespiegelte Flug aus Reihe 2, links
  der Flug aus Reihe 2, oben und unten der Flug aus Reihe 3 (oben gespiegelt), jeweils die vier
  Flügelschläge und noch einmal die ersten zwei.

Bild: ``reiher_reihen.png`` (768 × 64).

Aufruf: ``python reiher_reihen.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import sys
from pathlib import Path

from PIL import Image

K = 32
QUELLE = "spiel/eigene/reiher_bogen.png"
JE_RICHTUNG = 6
SPIEGEL = Image.Transpose.FLIP_LEFT_RIGHT


def rahmen(bogen: Image.Image, reihe: int, spalte: int) -> Image.Image:
    return bogen.crop((spalte * K, reihe * K, (spalte + 1) * K, (reihe + 1) * K))


def flug(bogen: Image.Image, reihe: int, gespiegelt: bool) -> list[Image.Image]:
    bilder = [rahmen(bogen, reihe, s) for s in range(4)]
    if gespiegelt:
        bilder = [b.transpose(SPIEGEL) for b in bilder]
    return [bilder[i % 4] for i in range(JE_RICHTUNG)]


def reiher_reihen(bogen: Image.Image) -> Image.Image:
    rechts, vorn, hinten = rahmen(bogen, 0, 1), rahmen(bogen, 0, 0), rahmen(bogen, 0, 3)
    stand = [rechts, hinten, rechts.transpose(SPIEGEL), vorn]  # rechts, oben, links, unten
    bewegung = flug(bogen, 1, True) + flug(bogen, 2, True) + flug(bogen, 1, False) + flug(bogen, 2, False)
    ziel = Image.new("RGBA", (4 * JE_RICHTUNG * K, 2 * K))
    for i, bild in enumerate(stand):
        ziel.paste(bild, (i * K, 0))
    for i, bild in enumerate(bewegung):
        ziel.paste(bild, (i * K, K))
    return ziel


def main() -> None:
    privat = Path(sys.argv[1])
    reiher_reihen(Image.open(privat / QUELLE).convert("RGBA")).save(
        privat / "spiel" / "eigene" / "reiher_reihen.png"
    )
    print("reiher_reihen.png geschrieben")


if __name__ == "__main__":
    main()

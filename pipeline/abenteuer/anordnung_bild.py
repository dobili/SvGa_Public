"""Hilfen für die Anordnungsregeln (KARTENREGELN 10.79 ff.): sichtbare Fläche der Bilder, Lage im Raum.

Warum: Ob ein Tisch mittig zwischen zwei Stühlen steht oder ein Hocker an der Theke, sieht man nicht an
der Bildgröße, sondern an den deckenden Pixeln (ein Stuhlbild von 16 × 32 hat oben 10 Pixel Luft, eine
Theke von 16 × 48 zeigt nur die Pixel 13 bis 33). Dieses Modul liest die Bilder aus dem privaten Paket
und gibt die deckende Fläche eines gesetzten Möbels in Kartenpixeln. Ohne Paket (GitHub Actions) gibt
es ``None`` zurück; die Regeln, die Pixel brauchen, schweigen dann.

Rolle im Gesamtbild: nur von ``anordnung.py`` benutzt.
"""

import importlib.util
import os
from functools import cache
from pathlib import Path
from typing import TYPE_CHECKING

from pipeline.abenteuer.kartenbau import HAUPT

if TYPE_CHECKING:
    from PIL import Image

# Ab dieser Deckkraft zählt ein Pixel zum Bild (Schatten von LimeZu haben 100).
DECKEND = 200
# Anteil wasserblauer Pixel, ab dem ein Bild eingemaltes Wasser hat (Steg aus dem Campingpaket).
WASSERANTEIL = 0.1
NAME_PAKET = "schach-abenteuer-inhalte"

Flaeche = tuple[int, int, int, int]


def privat() -> Path | None:
    """Das private Paket: Umgebungsvariable ``SVGA_PRIVAT`` oder ein Ordner ``schach-abenteuer-inhalte``
    neben dem Repository oder neben einem seiner Elternordner (Arbeitskopien unter ``.claude/worktrees``)."""
    if os.environ.get("SVGA_PRIVAT"):
        return Path(os.environ["SVGA_PRIVAT"])
    for ordner in (HAUPT, *HAUPT.parents):
        kandidat = ordner.parent / NAME_PAKET
        if kandidat.is_dir():
            return kandidat
    return None


def bilder_da() -> bool:
    """Liegen die Bilder bereit (privates Paket und Pillow)? In GitHub Actions fehlt beides; dann prüft
    der Kartenbau nur die Anordnungsregeln, die ohne Pixel auskommen (``anordnung.pruefe_anordnung``)."""
    paket = privat()
    return paket is not None and (paket / "spiel").is_dir() and importlib.util.find_spec("PIL") is not None


@cache
def _bild(quelle: str) -> "Image.Image | None":
    if not bilder_da():
        return None
    paket = privat()
    if paket is None or not (paket / quelle).is_file():
        return None
    from PIL import Image  # erst hier: Pillow fehlt in GitHub Actions

    return Image.open(paket / quelle).convert("RGBA")


@cache
def deckend(quelle: str, ausschnitt: tuple[int, ...] | None = None) -> Flaeche | None:
    """Deckende Fläche eines Bilds (links, oben, rechts, unten; rechts und unten ausschließlich).

    Beispiel: ``Kitchen_Shadow_Singles_282.png`` (Stuhl 16 × 32) → ``(2, 1, 15, 22)``.
    """
    bild = _bild(quelle)
    if bild is None:
        return None
    if ausschnitt:
        bild = bild.crop(ausschnitt)
    return bild.getchannel("A").point(lambda v: 255 if v > DECKEND else 0).getbbox()


@cache
def wasserpixel(quelle: str) -> tuple[tuple[int, int], ...]:
    """Lage (x, y) der wasserblauen deckenden Pixel im Bild, wenn es eingemaltes Wasser hat (mehr als
    ein Zehntel blaue Pixel), sonst leer. Beispiel: Steg ``Pier_26``, offenes Schleusentor."""
    bild = _bild(quelle)
    if bild is None:
        return ()
    breite, roh = bild.width, bild.tobytes()
    deckend_zahl, blau = 0, []
    for i in range(0, len(roh), 4):
        r, g, b, a = roh[i : i + 4]
        if a <= DECKEND:
            continue
        deckend_zahl += 1
        if b > r + 30 and b >= g - 10:
            blau.append(((i // 4) % breite, (i // 4) // breite))
    return tuple(blau) if deckend_zahl and len(blau) / deckend_zahl > WASSERANTEIL else ()


def wasser_im_bild(quelle: str) -> bool:
    """Hat das Bild eingemaltes Wasser (mehr als ein Zehntel blaue Pixel)? Beispiel: Steg ``Pier_26``."""
    return bool(wasserpixel(quelle))


def flaeche(stueck: dict, angabe: dict) -> Flaeche:
    """Deckende Fläche eines gesetzten Möbels in Kartenpixeln; ohne Paket die ganze Bildfläche."""
    innen = deckend(angabe.get("quelle", ""), tuple(angabe["ausschnitt"]) if "ausschnitt" in angabe else None)
    x, y = stueck["x"], stueck["y"]
    if not innen:
        return (x, y, x + stueck["breite"], y + stueck["hoehe"])
    return (x + innen[0], y + innen[1], x + innen[2], y + innen[3])


def mitte(f: Flaeche) -> tuple[float, float]:
    return ((f[0] + f[2]) / 2, (f[1] + f[3]) / 2)


def ueberlappen(a: Flaeche, b: Flaeche) -> bool:
    return a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]

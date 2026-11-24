"""Deckende Bildränder je Katalogeintrag (AP8a, 24.11.2026).

Warum: Mehrere Querschnittsprüfungen brauchen, wo ein Möbelbild wirklich Pixel hat, nicht nur sein
Bildrechteck (LimeZu-Bilder haben oft leere Ränder): kronenhoehe.py (reicht ein Objekt in die
Mauerkrone?) und untergrund.py. Die Bilder liegen im privaten Paket; gespeichert werden nur Zahlen,
damit die Prüfungen auch in GitHub Actions ohne Paket laufen (wie ``bildhoehen.json`` von
proportionen.py).

Ablage: ``inhalte/abenteuer/katalog_korrekturen/deckrahmen.json``, je Eintrag ``[links, oben,
rechts, unten]`` in Bildpixeln (rechts und unten ausschließlich), nur wo ein Rand leer ist.
Neu messen: ``python -m pipeline.abenteuer.deckrahmen PRIVAT`` (braucht Pillow).
"""

import json
import sys
from pathlib import Path

from pipeline.abenteuer.moebelliste import lade_moebel

WURZEL = Path(__file__).resolve().parents[2]
ABLAGE = WURZEL / "inhalte" / "abenteuer" / "katalog_korrekturen" / "deckrahmen.json"
DECKEND_AB = 40  # ab dieser Deckkraft (0 bis 255) zählt ein Bildpunkt, wie proportionen.py

Rahmen = tuple[int, int, int, int]


def lade() -> dict[str, Rahmen]:
    """Die gespeicherten Rahmen (leer, wenn noch nicht gemessen)."""
    if not ABLAGE.exists():
        return {}
    return {k: tuple(v) for k, v in json.loads(ABLAGE.read_text(encoding="utf-8")).items()}


def rahmen_von(name: str, angabe: dict, rahmen: dict[str, Rahmen]) -> Rahmen:
    """Der deckende Rahmen eines Eintrags, ohne Messung das ganze Bild.

    Beispiel: Schrank 32 × 48 mit leerer oberer Reihe → (0, 3, 32, 48); unbekannt → (0, 0, 32, 48).
    """
    return rahmen.get(name, (0, 0, angabe["breite"], angabe["hoehe"]))


def _bild(privat: Path, angabe: dict):
    """Das Bild eines Eintrags (zugeschnitten), oder None."""
    from PIL import Image

    for basis in (privat, privat / "spiel"):
        pfad = basis / angabe["quelle"]
        if pfad.exists():
            bild = Image.open(pfad).convert("RGBA")
            if "ausschnitt" in angabe:
                bild = bild.crop(tuple(angabe["ausschnitt"]))
            return bild
    return None


def miss(privat: Path, katalog: dict) -> dict[str, Rahmen]:
    """Misst den deckenden Rahmen jedes Eintrags; ganz gefüllte Bilder bleiben weg (Vorgabe)."""
    ergebnis: dict[str, Rahmen] = {}
    for name, angabe in sorted(katalog.items()):
        bild = _bild(privat, angabe)
        if bild is None:
            continue
        box = bild.getchannel("A").point(lambda a: 255 if a > DECKEND_AB else 0).getbbox()
        if box and box != (0, 0, *bild.size):
            ergebnis[name] = tuple(box)
    return ergebnis


def main(argv: list[str]) -> int:
    """Misst mit dem privaten Paket aus ``argv[0]`` und schreibt die Ablage."""
    if len(argv) != 1:
        print(__doc__)
        return 1
    gemessen = miss(Path(argv[0]), lade_moebel())
    zeilen = [f"  {json.dumps(k)}: {json.dumps(list(v))}" for k, v in sorted(gemessen.items())]
    ABLAGE.write_text("{\n" + ",\n".join(zeilen) + "\n}\n", encoding="utf-8")
    print(f"{len(gemessen)} Rahmen nach {ABLAGE}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

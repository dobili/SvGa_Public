"""Statisten und Tiere in den Vorschaubildern der Karten (kartenbild.py).

Warum: Der Autor beurteilt die Karten auf der Revisionsseite nach den Vorschaubildern. Seit Runde 7
(Rückmeldung vom 10.11.2026: „erheblich mehr Figuren, Menschen, auch Tiere“) gehören Statisten und
Tiere dazu; ohne sie sähe er die neue Belebung nicht. Die Auswahl der Bilder folgt der App
(``app/src/abenteuer/oberwelt/tiere.ts`` und ``belebung.ts``) nur sinngemäß: Statisten bekommen
fest nach dem Namen einen Bogen aus dem Vorrat, Tiere den Bogen ihrer Art oder einen nahen Ersatz.
Das Standbild „von vorn“ ist bei LimeZu das vierte der oberen Reihe.

Abhängigkeiten: Pillow (nur über kartenbild.py, lokal).
"""

import json
import zlib
from pathlib import Path

from PIL import Image

K = 16
STATISTEN = 40
VORN = 3  # Reihenfolge der Standbilder: rechts, oben, links, unten
SITZ_RAHMEN = ("rechts", "oben", "links", "unten")
# Zeile der Füße im 32er-Rahmen (app/skripte/figurenbogen.mjs, FUSSZEILE).
FUSSZEILE = 30
# Richtungen der PixelLab-Exporte in derselben Ordnung.
PIXELLAB = ("east", "north", "west", "south")
SITZ_HUB = 6  # sitzende Statisten stehen so viel höher (oberwelt/sitzrichtung.ts)
# Arten und Wortstämme wie in der App (app/src/abenteuer/oberwelt/tierarten.json, eine Quelle).
_TIERARTEN = json.loads(
    (Path(__file__).resolve().parents[2] / "app/src/abenteuer/oberwelt/tierarten.json").read_text(
        encoding="utf-8"
    )
)
TIERBILDER = {art: (a["breite"], a["hoehe"]) for art, a in _TIERARTEN["arten"].items()}
STAEMME = _TIERARTEN["staemme"]
# Zeichengröße je Art im Verhältnis zum Bogen (Feld massstab, ohne Angabe 1), wie in der App.
MASSSTAB = {art: a.get("massstab", 1) for art, a in _TIERARTEN["arten"].items()}
# Tiere von der Seite (Standbild „rechts“): Von vorn wirken Hund und Fuchs, als stünden sie aufrecht
# (Gutachter 10.11.2026); Statisten weiter von vorn.
SEITE = 0
# Schwimmer zeigen nur den Teil über der Wasserlinie (Regel 10.55), wie in der App.
WASSERLINIE = 0.85
SCHAR = (
    "tauben",
    "moewen",
    "kraehen",
    "enten",
    "gaense",
    "huehner",
    "ziegen",
    "schafe",
    "kuehe",
    "herde",
    "spatzen",
)


def tierart(name: str) -> str | None:
    """Art eines Tiers nach seinem Namen; längster passender Wortstamm gewinnt, sonst None."""
    klein = name.lower()
    treffer = [s for s in STAEMME if s in klein]
    return STAEMME[max(treffer, key=len)] if treffer else None


def statistenbogen(name: str, bild: str | None = None) -> str:
    """Bogen eines Statisten: eigenes Bild („statist-07“ oder Name einer Figur wie „otis“, wie in der
    App), sonst fest nach dem Namen.

    Beispiel: ``statistenbogen("schuelerin", "statist-07")`` → „figuren/statist-07.png“.
    """
    if bild:
        return f"figuren/{bild}.png"
    return f"figuren/statist-{zlib.crc32(name.encode()) % STATISTEN + 1:02d}.png"


def rgba(pfad: Path) -> Image.Image:
    """Öffnet ein Bild als RGBA (``oeffne`` für teile und figurbild)."""
    return Image.open(pfad).convert("RGBA")


def figurbild(privat: Path, bogen: str, rahmen: int, oeffne) -> Image.Image | None:
    """Standbild einer Figur in Blickrichtung ``rahmen`` (Ordnung wie SITZ_RAHMEN).

    Zuerst der PixelLab-Export ``figuren-neu/<name>/rotations/<richtung>.png`` (32 × 32, wie der
    Paketbau in app/skripte/figurenbogen.mjs), sonst der alte Bogen ``figuren/<name>.png`` (16 × 32),
    sonst None. Beispiel: „figuren/ada.png“, 3 → figuren-neu/ada/rotations/south.png.
    """
    neu = privat / "spiel" / "figuren-neu" / Path(bogen).stem / "rotations" / f"{PIXELLAB[rahmen]}.png"
    if neu.exists():
        # Füße auf FUSSZEILE wie im Paketbau (Kinder stehen im Export oft höher).
        bild = oeffne(neu)
        umriss = bild.getbbox()
        if not umriss:
            return None
        gesetzt = Image.new("RGBA", bild.size)
        gesetzt.paste(bild, (0, FUSSZEILE + 1 - umriss[3]))
        return gesetzt
    alt = privat / "spiel" / bogen
    return oeffne(alt).crop((rahmen * K, 0, (rahmen + 1) * K, 2 * K)) if alt.exists() else None


def teile(szene: dict, privat: Path, oeffne) -> list[tuple[int, int, int, object]]:
    """Bildteile (tiefe, x, y, bild) für alle Statisten und Tiere einer Szene.

    Eingaben: Szene, privates Repository, ``oeffne(pfad) -> Image`` (RGBA).
    Sonderfall: Ohne Bogen (Art unbekannt oder Datei fehlt) wird nichts gezeichnet, wie in der App;
    Schwimmer (``verhalten: schwimmen``) nur bis zur Wasserlinie.
    """
    ergebnis = []
    for b in szene.get("belebung", []):
        x, y = b["feld"][0] * K, b["feld"][1] * K
        if b.get("typ") == "statist":
            ergebnis += _statist(b, privat, oeffne, x, y)
            continue
        art = tierart(b["name"])
        pfad = privat / "spiel" / "tiere" / f"{art}.png"
        if art is None or not pfad.exists():
            continue
        breite, hoehe = TIERBILDER[art]
        sichtbar = _sichtbar(b, hoehe)
        bild = oeffne(pfad).crop((SEITE * breite, 0, (SEITE + 1) * breite, sichtbar))
        massstab = MASSSTAB.get(art, 1)
        if massstab != 1:
            breite, sichtbar = round(breite * massstab), round(sichtbar * massstab)
            bild = bild.resize((breite, sichtbar), Image.Resampling.NEAREST)
        anzahl = 3 if any(w in b["name"].lower() for w in SCHAR) else 1
        for i in range(anzahl):
            dx, dy = i * (breite // 2 + 4), (i % 2) * 6
            ergebnis.append((y + K + dy, x + dx, y + K - sichtbar + dy, bild))
    return ergebnis


def _sichtbar(b: dict, hoehe: int) -> int:
    """Sichtbare Höhe: Schwimmer (``verhalten: schwimmen``) nur bis zur Wasserlinie (Regel 10.55)."""
    if b.get("eigenschaften", {}).get("verhalten") == "schwimmen":
        return round(hoehe * WASSERLINIE)
    return hoehe


def _statist(b: dict, privat: Path, oeffne, x: int, y: int) -> list[tuple[int, int, int, object]]:
    """Bildteil eines Statisten: Standbild von vorn (sitzend in Blickrichtung, SITZ_HUB höher, R020),
    unten mittig auf seinem Feld; PixelLab 32 × 32 oder LimeZu 16 × 32 (figurbild)."""
    eigenschaften = b.get("eigenschaften", {})
    sitzt = "unten" if eigenschaften.get("sitzt") == "ja" else eigenschaften.get("sitzt")
    rahmen = SITZ_RAHMEN.index(sitzt) if sitzt in SITZ_RAHMEN else VORN
    bogen = statistenbogen(b["name"], eigenschaften.get("bild"))
    bild = figurbild(privat, bogen, rahmen, oeffne)
    if bild is None:
        return []
    sichtbar = _sichtbar(b, bild.height)
    bild = bild.crop((0, 0, bild.width, sichtbar))
    hub = SITZ_HUB if sitzt in SITZ_RAHMEN else 0
    return [(y + K, x + (K - bild.width) // 2, y + K - sichtbar - hub, bild)]

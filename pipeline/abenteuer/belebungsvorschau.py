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
    """Bogen eines Statisten: eigenes Bild („statist-07“, wie in der App), sonst fest nach dem Namen.

    Beispiel: ``statistenbogen("schuelerin", "statist-07")`` → „figuren/statist-07.png“.
    """
    if bild and bild.startswith("statist-"):
        return f"figuren/{bild}.png"
    return f"figuren/statist-{zlib.crc32(name.encode()) % STATISTEN + 1:02d}.png"


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
            bogen = statistenbogen(b["name"], b.get("eigenschaften", {}).get("bild"))
            pfad, (breite, hoehe) = privat / "spiel" / bogen, (16, 32)
        else:
            art = tierart(b["name"])
            if art is None:
                continue
            pfad, (breite, hoehe) = privat / "spiel" / "tiere" / f"{art}.png", TIERBILDER[art]
        if not pfad.exists():
            continue
        sichtbar = hoehe
        if b.get("eigenschaften", {}).get("verhalten") == "schwimmen":
            sichtbar = round(hoehe * WASSERLINIE)
        rahmen = VORN if b.get("typ") == "statist" else SEITE
        bild = oeffne(pfad).crop((rahmen * breite, 0, (rahmen + 1) * breite, sichtbar))
        massstab = 1 if b.get("typ") == "statist" else MASSSTAB.get(art, 1)
        if massstab != 1:
            breite, sichtbar = round(breite * massstab), round(sichtbar * massstab)
            bild = bild.resize((breite, sichtbar), Image.Resampling.NEAREST)
        anzahl = 3 if any(w in b["name"].lower() for w in SCHAR) else 1
        for i in range(anzahl):
            dx, dy = i * (breite // 2 + 4), (i % 2) * 6
            # Schwimmer sinken um den abgeschnittenen Teil tiefer ins Wasser.
            ergebnis.append((y + K + dy, x + dx, y + K - sichtbar + dy, bild))
    return ergebnis

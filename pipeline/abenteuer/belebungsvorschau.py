"""Statisten und Tiere in den Vorschaubildern der Karten (kartenbild.py).

Warum: Der Autor beurteilt die Karten auf der Revisionsseite nach den Vorschaubildern. Seit Runde 7
(Rückmeldung vom 10.11.2026: „erheblich mehr Figuren, Menschen, auch Tiere“) gehören Statisten und
Tiere dazu; ohne sie sähe er die neue Belebung nicht. Die Auswahl der Bilder folgt der App
(``app/src/abenteuer/oberwelt/tiere.ts`` und ``belebung.ts``) nur sinngemäß: Statisten bekommen
fest nach dem Namen einen Bogen aus dem Vorrat, Tiere den Bogen ihrer Art oder einen nahen Ersatz.
Das Standbild „von vorn“ ist bei LimeZu das vierte der oberen Reihe.

Abhängigkeiten: Pillow (nur über kartenbild.py, lokal).
"""

import zlib
from pathlib import Path

K = 16
STATISTEN = 40
VORN = 3  # Reihenfolge der Standbilder: rechts, oben, links, unten
# Art → Rahmengröße (wie TIERBILDER in tiere.ts)
TIERBILDER = {
    "taube": (16, 16),
    "huhn": (16, 16),
    "ente": (32, 32),
    "hase": (32, 32),
    "schwein": (32, 32),
    "ziege": (32, 48),
    "schaf": (32, 32),
    "kuh": (48, 48),
    "esel": (48, 48),
    "hund": (48, 32),
    "katze": (32, 32),
    "drohne": (16, 16),
}
# Wortstamm im Namen → Art (Auszug aus STAEMME in tiere.ts)
STAEMME = {
    "moewe": "taube",
    "kraehe": "taube",
    "rabe": "taube",
    "geier": "taube",
    "falke": "taube",
    "adler": "taube",
    "eule": "taube",
    "specht": "taube",
    "roadrunner": "huhn",
    "huehner": "huhn",
    "gans": "ente",
    "gaense": "ente",
    "reiher": "ente",
    "pelikan": "ente",
    "kaninchen": "hase",
    "eichhoernchen": "hase",
    "murmeltier": "hase",
    "reh": "ziege",
    "kueh": "kuh",
    "rind": "kuh",
    "bison": "kuh",
    "pferd": "esel",
    "kojote": "hund",
    "fuchs": "hund",
    **{art: art for art in TIERBILDER},
}
# Schwimmer zeigen nur den Teil über der Wasserlinie (Regel 10.55), wie in der App.
WASSERLINIE = 0.85
SCHAR = ("tauben", "moewen", "kraehen", "enten", "gaense", "huehner", "ziegen", "schafe", "kuehe", "herde")


def tierart(name: str) -> str | None:
    """Art eines Tiers nach seinem Namen; längster passender Wortstamm gewinnt, sonst None."""
    klein = name.lower()
    treffer = [s for s in STAEMME if s in klein]
    return STAEMME[max(treffer, key=len)] if treffer else None


def statistenbogen(name: str) -> str:
    """Fester Bogen aus dem Vorrat für einen Statisten (gleicher Name, gleiches Bild)."""
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
            pfad, (breite, hoehe) = privat / "spiel" / statistenbogen(b["name"]), (16, 32)
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
        bild = oeffne(pfad).crop((VORN * breite, 0, (VORN + 1) * breite, sichtbar))
        anzahl = 3 if any(w in b["name"].lower() for w in SCHAR) else 1
        for i in range(anzahl):
            dx, dy = i * (breite // 2 + 4), (i % 2) * 6
            # Schwimmer sinken um den abgeschnittenen Teil tiefer ins Wasser.
            ergebnis.append((y + K + dy, x + dx, y + K - sichtbar + dy, bild))
    return ergebnis

"""Sitzende Figuren und Statisten auf ihrem Sitzmöbel, für die Vorschaubilder (kartenbild.py).

Warum: Dieselbe Regel wie in der App (``app/src/abenteuer/oberwelt/sitzplatz.ts``), damit Vorschau
und Spiel gleich aussehen. Ein Stuhl von LimeZu ist 16 × 32 groß, zeichnet aber nur die oberen
22 Pixel; dazu tragen Stühle oft einen Feinschub (``versatz``). Sitzende standen deshalb neben
oder unter ihrem Stuhl (Spieltest Variante B, 16.11.2026, F2: Sam im Clubraum, Calloway auf der
Terrasse). Jetzt rückt die Figur mit den Füßen an die sichtbare Unterkante ihres Sitzmöbels,
waagerecht auf seine sichtbare Mitte, und liegt in der Tiefe knapp darüber, auch von hinten
gesehen (Schüler der Akademie in Silicon Bay vor Stühlen mit hoher Lehne).
Lange Bänke und Sofas (breiter als eine Kachel oder höher als zwei) tragen mehrere Leute: Dort
zählt nur der Feinschub des Möbels gegen das Raster.
Ohne Sitzmöbel sitzt man am Boden (Lily auf dem Bordstein, wie BODENSITZ in sitzplatz.ts):
``sitzlage_auf`` gibt None, die Vorschau rückt dann nicht und hebt nicht an (``am_boden``).

Abhängigkeiten: Pillow nur über die gemessenen Bilder (kartenbild.py).
"""

import math

K = 16
# Arten im Möbelkatalog, auf denen man sitzt (wie SITZMOEBEL in kartenregeln.py).
SITZARTEN = ("stuhl", "bank", "sessel", "sofa", "hocker", "couch")
# So weit liegt eine Sitzende in der Tiefe über (oder hinter) ihrem Möbel.
SITZ_TIEFENABSTAND = 0.5
# Ab dieser Deckkraft (0–255) zählt ein Pixel als sichtbar (wie SICHTBAR_AB in sitzumriss.ts).
SICHTBAR_AB = 40


def ist_sitzmoebel(name: str, art: str | None) -> bool:
    """Ist ein Möbel ein Sitzplatz? Nach der Art im Katalog, ohne Art nach dem Namen.

    Beispiel: art „stuhl“ → ja; „cc4StuhlVorn“ ohne Art → ja; art „gebaeude“ → nein.
    """
    if art is not None:
        return art in SITZARTEN
    return any(w in name.lower() for w in SITZARTEN)


def sichtbarer_umriss(bild) -> tuple[int, int, int, int] | None:
    """Rechteck (links, oben, Breite, Höhe) der Pixel ab SICHTBAR_AB Deckkraft, sonst None."""
    maske = bild.getchannel("A").point(lambda a: 255 if a >= SICHTBAR_AB else 0)
    rand = maske.getbbox()
    return None if rand is None else (rand[0], rand[1], rand[2] - rand[0], rand[3] - rand[1])


def sitzmoebel(gesetzt: list[dict], katalog: dict, bilder: list) -> list[dict]:
    """Die Sitzmöbel einer Karte mit ganzem Rechteck, sichtbarem Teil, Tiefe und Blick.

    Eingaben: gesetzte Stücke (kartenbau.platziere), Möbelkatalog, je Stück sein fertig geformtes
    Bild (gleiche Reihenfolge wie ``gesetzt``). Beispiel: Schulstuhl bei (85, 117), 16 × 32 →
    sichtbar (88, 118, 12, 21).
    """
    sitze = []
    for stueck, bild in zip(gesetzt, bilder, strict=True):
        angabe = katalog.get(stueck["name"], {})
        if not ist_sitzmoebel(stueck["name"], angabe.get("art")):
            continue
        x, y = stueck["x"], stueck["y"]
        innen = sichtbarer_umriss(bild)
        sitze.append(
            {
                "x": x,
                "y": y,
                "breite": bild.width,
                "hoehe": bild.height,
                "tiefe": stueck["tiefe"],
                "sichtbar": None if innen is None else (x + innen[0], y + innen[1], innen[2], innen[3]),
            }
        )
    return sitze


def finde_sitz(sitze: list[dict], feld: tuple[int, int]) -> dict | None:
    """Das kleinste Sitzmöbel, dessen ganzes Rechteck die Mitte des Feldes enthält, sonst None."""
    mx, my = feld[0] * K + K / 2, feld[1] * K + K / 2
    treffer = [s for s in sitze if s["x"] <= mx < s["x"] + s["breite"] and s["y"] <= my < s["y"] + s["hoehe"]]
    return min(treffer, key=lambda s: s["breite"] * s["hoehe"], default=None)


def _rasterrest(wert: float) -> float:
    """Rest einer Lage gegen das Kachelraster, zwischen −K/2 (ausschließlich) und K/2."""
    rest = wert - _runde(wert / K) * K
    return rest + K if rest <= -K / 2 else rest


def _runde(wert: float) -> int:
    """Runden wie Math.round in JavaScript (halbe Werte nach oben)."""
    return math.floor(wert + 0.5)


def sitzlage(sitz: dict, feld: tuple[int, int]) -> tuple[int, int, float]:
    """Verschiebung (dx, dy) des Bildes in Kartenpixeln und Tiefe einer Sitzenden.

    Beispiel: Sam (5, 8) auf dem Schulstuhl, sichtbar 88–100 × 118–139, Tiefe 141 →
    (6, −5, 141,5). Wie ``sitzlage`` in sitzplatz.ts.
    """
    sx, sy, sb, sh = sitz["sichtbar"] or (sitz["x"], sitz["y"], sitz["breite"], sitz["hoehe"])
    mitte, fuss = feld[0] * K + K / 2, (feld[1] + 1) * K
    waagerecht = sx + sb / 2 - mitte if sitz["breite"] <= K else _rasterrest(sitz["x"])
    senkrecht = sy + sh - fuss if sitz["hoehe"] <= 2 * K else _rasterrest(sitz["y"])
    return _begrenzt(waagerecht), _begrenzt(senkrecht), sitz["tiefe"] + SITZ_TIEFENABSTAND


def _begrenzt(wert: float) -> int:
    """Auf ±K begrenzt und gerundet: Eine Sitzende rückt höchstens eine Kachel weg."""
    return _runde(max(-K, min(K, wert)))


def am_boden(sitze: list[dict], feld: tuple[int, int]) -> bool:
    """Sitzt eine Sitzende auf ``feld`` am Boden (kein Sitzmöbel)? Dann ohne Hub und Verschiebung.

    Beispiel: Lily auf dem Bordstein in Maple Falls (14, 24) → True; Sam im Clubraum → False.
    """
    return finde_sitz(sitze, feld) is None


def sitzlage_auf(sitze: list[dict], feld: tuple[int, int]) -> tuple[int, int, float] | None:
    """Lage auf dem Sitzmöbel unter ``feld``; ohne Möbel None (Kachelmitte, Tiefe der Fußlinie)."""
    sitz = finde_sitz(sitze, feld)
    return None if sitz is None else sitzlage(sitz, feld)

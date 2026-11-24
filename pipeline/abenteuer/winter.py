"""Winter ohne Schneebilder: Karten im Winterzustand werden umgefärbt (Entscheidung 10.11.2026).

Zwei Jahreszeiten (Szeneneigenschaft ``jahreszeit``, RO53.5 vom 24.11.2026):
- ``winter``: Schnee (Norden und Berge). Gras wird Schnee, Bäume und Büsche tragen Schneekappen, auch
  Herbstlaub; Häuser tragen Schnee auf dem Dach (``dachschnee``).
- ``winter_mild``: Winter ohne Schnee (Süden). Gras wird fahl (``fahlfarbe``), Laubbäume kahl
  (``kahlbaum.py``), Büsche und Hecken gedämpft; Nadelbäume und Häuser bleiben.
Welche Sorte ein Möbel ist, sagt ``sorte`` nach Katalogart und Name.

Warum: Die gekauften Pakete haben keinen Schnee. Die Geschichte spielt aber im Winter (Ironwood,
KARTENREGELN 10.63). ``kartenbild`` färbt den Hintergrund einer Szene mit ``"jahreszeit":
"winter"`` um; dieselbe Regel steht in ``app/src/abenteuer/oberwelt/winter.ts`` für die Möbel
(Bäume, Büsche), die die App zeichnet. Möbel bekommen Schneekappen statt ganz weißer Kronen
(``schneekappen``, Regel 10.67). Änderungen gehören in beide.

Regel je Farbe (Farbton H, Helligkeit L, Sättigung S nach ``colorsys.rgb_to_hls``):
- Grün (0,17 < H < 0,45, S > 0,15): Schnee, die Helligkeit bleibt (v = 0,72 + 0,28 · L).
- Braun (0,05 ≤ H ≤ 0,17, S > 0,2, L > 0,35): halb zum Grau gezogen (Erde wird entsättigt).
- Wasser (0,45 ≤ H ≤ 0,6), nur wenn ``wasser``: kühler, × (0,7; 0,8; 0,9).
Beispiel: Gras (106, 170, 72) → Schnee (222, 221, 219); Erde (150, 110, 70) → (130, 110, 90).
"""

import colorsys
import math
import re

from PIL import Image

from pipeline.abenteuer.kahlbaum import ist_herbstbaum, ist_warm, kahl
from pipeline.abenteuer.kartentiled import JAHRESZEITEN

GRUEN = (0.17, 0.45)
GRUEN_SAETTIGUNG = 0.15
BRAUN = (0.05, 0.17)
BRAUN_SAETTIGUNG = 0.2
BRAUN_HELLIGKEIT = 0.35
WASSER = (0.45, 0.6)
WASSER_FAKTOR = (0.7, 0.8, 0.9)
SCHNEE_GRUND, SCHNEE_ANTEIL = 0.72, 0.28
SCHNEE_FARBE = ((225, 30), (232, 23), (245, 10))
VOLL = 255


def _runde(x: float) -> int:
    """Wie ``Math.round`` in JavaScript (,5 nach oben), damit App und Pipeline gleich rechnen."""
    return math.floor(x + 0.5)


def _schneeton(r: int, g: int, b: int) -> tuple[int, int, int]:
    """Schnee mit der Helligkeit der Farbe (Schatten im Schnee bleiben sichtbar)."""
    v = SCHNEE_GRUND + SCHNEE_ANTEIL * colorsys.rgb_to_hls(r / VOLL, g / VOLL, b / VOLL)[1]
    return tuple(min(VOLL, _runde(f * v + d)) for f, d in SCHNEE_FARBE)


def winterfarbe(r: int, g: int, b: int, wasser: bool = True) -> tuple[int, int, int]:
    """Die Winterfarbe einer Farbe (Regel im Dateikopf); andere Farben bleiben."""
    h, hell, s = colorsys.rgb_to_hls(r / VOLL, g / VOLL, b / VOLL)
    if GRUEN[0] < h < GRUEN[1] and s > GRUEN_SAETTIGUNG:
        return _schneeton(r, g, b)
    if BRAUN[0] <= h <= BRAUN[1] and s > BRAUN_SAETTIGUNG and hell > BRAUN_HELLIGKEIT:
        grau = (r + g + b) / 3
        return tuple(_runde((c + grau) / 2) for c in (r, g, b))
    if wasser and WASSER[0] <= h <= WASSER[1]:
        return tuple(_runde(c * f) for c, f in zip((r, g, b), WASSER_FAKTOR, strict=True))
    return (r, g, b)


# Bäume und Büsche (Möbel, Regel 10.67): nur oben Schnee, darunter gedämpftes Wintergrün, der
# dunkle Kronenrand bleibt. Sonst wurden Laubbäume zu weißen Kugeln ohne Stamm („Schneebälle“).
KAPPE_ANTEIL = 0.35
KAPPE_MINDESTENS = 2
RAND_HELLIGKEIT = 0.22
LAUB_GRAU, LAUB_DUNKEL = 0.45, 0.85


def _laub(r: int, g: int, b: int, herbst: bool = False) -> tuple[bool, bool]:
    """(ist Laub, ist dunkler Rand) nach der Regel für Grün; bei Herbstbäumen auch Rot, Orange, Gelb."""
    h, hell, s = colorsys.rgb_to_hls(r / VOLL, g / VOLL, b / VOLL)
    laub = (GRUEN[0] < h < GRUEN[1] and s > GRUEN_SAETTIGUNG) or (herbst and ist_warm((r, g, b, VOLL)))
    return laub, laub and hell < RAND_HELLIGKEIT


def _ist_laub(p: tuple, herbst: bool) -> bool:
    return bool(p[3]) and _laub(*p[:3], herbst)[0]


def winterlaub(r: int, g: int, b: int) -> tuple[int, int, int]:
    """Laub unter der Schneekappe: zum Grau gezogen und etwas dunkler (Wintergrün)."""
    grau = (r + g + b) / 3
    return tuple(_runde((c * (1 - LAUB_GRAU) + grau * LAUB_GRAU) * LAUB_DUNKEL) for c in (r, g, b))


def schneekappen(breite: int, hoehe: int, pixel: list[tuple[int, int, int, int]]) -> list:
    """Möbel im Winter: je Spalte bekommt die oberste Laubstrecke oben eine Schneekappe (35 %,
    mindestens 2 Pixel), darunter und in tieferen Strecken Wintergrün; dunkle Ränder bleiben;
    alles andere wie ``winterfarbe`` ohne Wasser (Stamm graubraun). ``pixel`` zeilenweise RGBA,
    Ergebnis ebenso.
    Herbstbäume (mehr Rot, Orange, Gelb als Grün) bekommen die Kappe auf ihr warmes Laub.
    Beispiel: eine Spalte aus 10 hellgrünen Pixeln → 4 Schnee, 6 Wintergrün."""
    herbst = ist_herbstbaum(pixel)
    neu = list(pixel)
    for x in range(breite):
        y, oben = 0, True  # nur die oberste Laubstrecke einer Spalte trägt Schnee
        while y < hoehe:
            r, g, b, a = pixel[y * breite + x]
            if not a or not _laub(r, g, b, herbst)[0]:
                neu[y * breite + x] = (*winterfarbe(r, g, b, wasser=False), a)
                y += 1
                continue
            ende = y
            while (
                ende < hoehe
                and pixel[ende * breite + x][3]
                and _laub(*pixel[ende * breite + x][:3], herbst)[0]
            ):
                ende += 1
            kappe = max(KAPPE_MINDESTENS, math.ceil((ende - y) * KAPPE_ANTEIL)) if oben else 0
            oben = False
            for t, yy in enumerate(range(y, ende)):
                r, g, b, a = pixel[yy * breite + x]
                if _laub(r, g, b, herbst)[1]:
                    continue
                farbe = _schneeton(r, g, b) if t < kappe else winterlaub(r, g, b)
                neu[yy * breite + x] = (*farbe, a)
            y = ende
    return neu


# Winter ohne Schnee: Grün wird fahles Wintergras (zum Grau mit einem Stich Stroh, 70 %).
FAHL_ANTEIL = 0.7
FAHL_STROH = ((1.08, 6), (1.0, 4), (0.72, 0))


def fahlfarbe(r: int, g: int, b: int) -> tuple[int, int, int]:
    """Winter ohne Schnee: Grün wird fahl, alles andere bleibt.
    Beispiel: Gras (106, 170, 72) → (124, 135, 80)."""
    h, _, s = colorsys.rgb_to_hls(r / VOLL, g / VOLL, b / VOLL)
    if not (GRUEN[0] < h < GRUEN[1] and s > GRUEN_SAETTIGUNG):
        return (r, g, b)
    grau = (r + g + b) / 3
    stroh = [grau * f + d for f, d in FAHL_STROH]
    return tuple(
        _runde(c * (1 - FAHL_ANTEIL) + z * FAHL_ANTEIL) for c, z in zip((r, g, b), stroh, strict=True)
    )


# Häuser im Schnee: je Spalte von oben (nach höchstens zwei dunklen Umrisspixeln) Schnee bis zur
# nächsten dunklen Linie (Traufe, Dachkante), höchstens 60 % der Bildhöhe.
DACH_ANTEIL = 0.6
DACH_UMRISS = 2
DACH_DUNKEL = 0.25


def dachschnee(breite: int, hoehe: int, pixel: list[tuple[int, int, int, int]]) -> list:
    """Schnee auf dem Dach (Regel oben), der Rest wie ``winterfarbe`` ohne Wasser.
    Beispiel: Spalte aus Umriss, 5 roten Ziegeln, dunkler Traufe, Wand → Umriss, 5 Schnee, Traufe, Wand."""
    neu = [(*winterfarbe(*p[:3], wasser=False), p[3]) if p[3] else p for p in pixel]
    grenze = max(DACH_UMRISS, math.floor(hoehe * DACH_ANTEIL))
    for x in range(breite):
        y = next((y for y in range(hoehe) if pixel[y * breite + x][3]), hoehe)
        ende, umriss = min(hoehe, y + grenze), 0
        while y < ende and umriss < DACH_UMRISS and _hell(pixel[y * breite + x]) < DACH_DUNKEL:
            y, umriss = y + 1, umriss + 1
        while y < ende and pixel[y * breite + x][3] and _hell(pixel[y * breite + x]) >= DACH_DUNKEL:
            neu[y * breite + x] = (*_schneeton(*pixel[y * breite + x][:3]), pixel[y * breite + x][3])
            y += 1
    return neu


def _hell(p: tuple) -> float:
    return colorsys.rgb_to_hls(p[0] / VOLL, p[1] / VOLL, p[2] / VOLL)[1]


def gedaempft(breite: int, hoehe: int, pixel: list) -> list:
    """Büsche und Hecken im Winter ohne Schnee: Laub wird Wintergrün, der Rest bleibt."""
    return [(*winterlaub(*p[:3]), p[3]) if p[3] and _laub(*p[:3])[0] else p for p in pixel]


HECKE = re.compile(r"hecke|busch", re.I)
NADEL = re.compile(r"nadel|kiefer|tanne|zeder|zypresse|pinie|kegelbaum|mammut", re.I)


def sorte(name: str, art: str | None) -> str:
    """Wie ein Möbel im Winter gefärbt wird: laubbaum, nadelbaum, busch, pflanze, haus oder sonst.
    Beispiel: (``pw7Tanne``, baum) → nadelbaum; (``wg4Laubbaum``, baum) → laubbaum."""
    if art == "baum":
        return "nadelbaum" if NADEL.search(name) else "laubbaum"
    if art in ("busch", "hecke") or HECKE.search(name):
        return "busch"
    if art == "pflanze":
        return "pflanze"
    return "haus" if art in ("gebaeude", "haus") else "sonst"


def faerbe(wie: str, zeit: str, breite: int, hoehe: int, pixel: list) -> list:
    """Ein Möbelbild (zeilenweise RGBA) für die Jahreszeit nach seiner ``sorte``."""
    if zeit == "winter_mild":
        if wie == "laubbaum":  # der Schatten am Boden wird fahl wie das Gras
            return [(*fahlfarbe(*p[:3]), p[3]) if p[3] else p for p in kahl(breite, hoehe, pixel)]
        if wie == "pflanze":  # Schilf, Strandgras: fahl wie das Gras
            return [(*fahlfarbe(*p[:3]), p[3]) if p[3] else p for p in pixel]
        return gedaempft(breite, hoehe, pixel) if wie == "busch" else list(pixel)
    return dachschnee(breite, hoehe, pixel) if wie == "haus" else schneekappen(breite, hoehe, pixel)


def winterliche_moebel(bild: Image.Image, name: str = "", art: str | None = None, szene=None) -> Image.Image:
    """Ein Möbelbild in der Jahreszeit der Szene (ohne Szene: Schnee wie bisher)."""
    rgba = bild.convert("RGBA")
    zeit = jahreszeit(szene) if szene is not None else "winter"
    neu = Image.new("RGBA", rgba.size)
    neu.putdata(faerbe(sorte(name, art), zeit or "winter", rgba.width, rgba.height, list(rgba.getdata())))
    return neu


def winterlich(bild: Image.Image, szene=None, wasser: bool = True) -> Image.Image:
    """Das ganze Bild umgefärbt (RGBA, Transparenz bleibt); je Farbe nur einmal gerechnet.
    Im Winter ohne Schnee (``szene`` mit ``winter_mild``) wird Grün fahl statt Schnee."""
    rgba = bild.convert("RGBA")
    mild = szene is not None and jahreszeit(szene) == "winter_mild"
    gemerkt: dict[tuple[int, int, int], tuple[int, int, int]] = {}

    def farbe(px: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
        rgb = px[:3]
        if rgb not in gemerkt:
            gemerkt[rgb] = fahlfarbe(*rgb) if mild else winterfarbe(*rgb, wasser=wasser)
        return (*gemerkt[rgb], px[3])

    neu = Image.new("RGBA", rgba.size)
    neu.putdata([farbe(px) for px in rgba.getdata()])
    return neu


def jahreszeit(szene: dict) -> str | None:
    """Die Jahreszeit der Szene (``winter``, ``winter_mild``) oder None (wie die Bilder der Pakete)."""
    wert = szene.get("jahreszeit")
    return wert if wert in JAHRESZEITEN else None


def ist_winter(szene: dict) -> bool:
    """Szene mit Schnee (``"jahreszeit": "winter"``, Entscheidung 10.11.2026)."""
    return szene.get("jahreszeit") == "winter"


# Blumen und Pilze bleiben beim Umfärben bunt; in Winterszenen (mit und ohne Schnee) kommen sie weg.
BLUEHT = re.compile(r"blume|pilz(?!kiosk)", re.I)


def winterbefunde(szene: dict) -> list[str]:
    """Blumen und Pilze in einer Winterszene (sie gehören weg); sonst nichts."""
    if not jahreszeit(szene):
        return []
    namen = sorted({o["moebel"] for o in szene.get("objekte", []) if BLUEHT.search(o.get("moebel", ""))})
    return [f"{n}: Blumen und Pilze gehören nicht in eine Winterszene" for n in namen]

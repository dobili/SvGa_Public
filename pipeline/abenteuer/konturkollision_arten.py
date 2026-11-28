"""Sperre nach der Draufsicht für Tische, Theken, Betten, niedrige Schränke und längs laufende Zäune
(Teil von ``konturkollision.py``, Phase 2A, KARTENREGELN 10.95).

Warum (Auftrag des Autors, 28.11.2026): Kollision pixelgenau an den Konturen, Held vor und hinter
richtig. Die feinen Masken von 10.88 verfeinerten nur die grobe Kachelmaske, die die oberste
Kachelreihe immer frei ließ. Bei Tischen lag so die hintere Hälfte der Platte frei: Der Held stand
„hinter der Tischplatte im Tisch“. Grundsatz: Es sperrt der Bodenkontakt des Objekts plus seine Tiefe
in der Draufsicht, nicht mehr; hohe Teile (Lehne, Kopfteil, Schrankoberteil, Mast) verdecken nur.

Regeln je Art (Pixel des ungeformten Katalogbilds, Zellen 4 × 4):

- **Platte** (Tische, Schreibtische; niedrige Schränke, Kommoden, Theken und Tresen bis
  ``NIEDRIG`` Pixel sichtbarer Höhe, nicht Buden und Stände mit Dach; Zäune und Geländer, die
  längs laufen): Alle dichten Zellen ab der Zelle unter der obersten deckenden Pixelreihe sperren
  (hintere Kante 1 bis 4 Pixel frei), höchstens eine Kachel über der bisherigen Sperre (so bleibt
  ein Sonnenschirm über dem Tisch frei); die bisherige Sperre bleibt. Steht in einer Szene ein Stuhl
  in der obersten Kachelreihe des Tisches (an den Tisch gerückt), behält diese Stelle die bisherige
  Maske (``maske_fein`` am Objekt): Der Stuhl sperrt dort ohnehin.
- **Liegefläche** (Betten, Liegen): von der obersten breiten Reihe (Matratze, ohne die Pfosten des
  Kopfteils) bis zum Fuß; das Kopfteil darüber verdeckt nur.
"""

from typing import NamedTuple

from pipeline.abenteuer.feinmasken import DECKEND, FELD_GROB, FELD_HAND, MINDEST_PIXEL, deckende_zellen
from pipeline.abenteuer.kollisionfein import ZP, K, Z

Zelle = tuple[int, int]


class Artbefund(NamedTuple):
    """Ergebnis von ``artbefund``: neue Sperre, Grund (Katalogtext), Befund, Sortierlinie oder None."""

    sperre: set[tuple[int, int]]
    grund: str
    befund: str
    linie: int | None


# Die hintere Kante (oberste Pixel) gehört nicht zur Standfläche, wie bei der Sitzfläche (SITZ_RAND).
RAND = ZP - 1
# Schränke, Kommoden, Geräte bis zu dieser sichtbaren Höhe sind niedrig: Ihre Oberseite ist Tiefe.
NIEDRIG = 24
# Breite Reihe einer Liegefläche: Anteil der breitesten Reihe (wie SITZ_BREITE).
LIEGE_BREITE = 0.7
PLATTE_ARTEN = {"tisch", "schreibtisch", "couchtisch", "billard"}
# Niedrig wie ein Tisch: Oberseite ist Tiefe. Höhere Theken, Schalter und Buden (Rückwand, Dach,
# Fenster) behalten ihre Sperre: Dahinter steht die Bedienung.
NIEDRIG_ARTEN = {
    "schrank", "kommode", "regal", "buecherregal", "vitrine", "geraet", "kuehlschrank", "theke", "tresen",
}  # fmt: skip
ZAUN_ARTEN = {"zaun", "gelaender", "absperrung"}
BETT_ARTEN = {"bett"}
EINZELN = ("pfosten", "poller")  # Namensteile einzelner Pfosten in Zaunreihen: nur der Fuß sperrt
# Ausnahmen mit Grund: Die Regel der Draufsicht passt nicht, die bisherige Sperre bleibt.
AUSNAHMEN = {
    "ca27Cafetisch": "Tisch mit Stühlen und Schirmen in einem Bild: Lehnen und Schirme oben verdecken",
}
GRUND_PLATTE = (
    "Kontur (konturkollision_arten.py, 28.11.2026): Platte oder Oberseite in der Draufsicht sperrt "
    "ab der Zelle unter der hinteren Kante, man steht nicht hinter der Platte im Möbel"
)
GRUND_ZAUN = (
    "Kontur (konturkollision_arten.py, 28.11.2026): längs laufender Zaun sperrt seine ganze Linie "
    "ab 3 Pixeln unter der Oberkante"
)
GRUND_BETT = (
    "Kontur (konturkollision_arten.py, 28.11.2026): Liegefläche sperrt, das Kopfteil darüber verdeckt nur"
)


# Felder, mit denen ein Eintrag eigenen Regeln folgt: Handangaben (``maske_fein_von_hand``,
# ``ohne_maske_fein``, eine grobe ``maske`` mit Grund wie die Theke im Diner, deren Hocker an der
# Vorderkante stehen), Bauteile, Türen, Wandschmuck.
EIGENE = (
    FELD_HAND,
    FELD_GROB,
    "maske",
    "frei_unten",
    "tuer",
    "verbund",
    "begehbar",
    "bodenoeffnung",
    "an_wand",
)


def automatisch(angabe: dict) -> bool:
    """Ob die Regeln der Draufsicht den Eintrag ändern dürfen: mit Kollision und ohne ``EIGENE``.
    Beispiel: Rundtisch mit Kollision → True; mf5ThekeMitte (grobe ``maske`` mit Grund) → False."""
    return bool(angabe.get("kollision")) and not any(f in angabe for f in EIGENE)


def sichtbar(alpha: bytes, breite: int, hoehe: int) -> tuple[int, int, int, int] | None:
    """Rahmen der deckenden Pixel (x0, y0, x1, y1, Ende ausschließlich) oder None.

    Beispiel: Tisch 32 × 32, deckend in x 2 bis 29 und y 6 bis 27 → (2, 6, 30, 28).
    """
    xs, ys = [], []
    for y in range(hoehe):
        for x in range(breite):
            if alpha[y * breite + x] > DECKEND:
                xs.append(x)
                ys.append(y)
    return (min(xs), min(ys), max(xs) + 1, max(ys) + 1) if xs else None


def laengs(name: str, rahmen: tuple[int, int, int, int]) -> bool:
    """Ob ein Zaun längs (Nord–Süd) läuft: schmal (bis eine halbe Kachel breit) und kein einzelner
    Pfosten oder Poller (deren Fuß allein sperrt). Warum nicht nach dem Seitenverhältnis: Die Mauer
    wr5Mauer (16 × 48) steht von vorn gesehen in einer Ost–West-Reihe.
    Beispiel: gt7ZaunML (Pfostenreihe 4 Pixel breit) → True; mf4Poller → False; Zaunmitte → False."""
    breite = rahmen[2] - rahmen[0]
    return breite <= K // 2 and not any(t in name.lower() for t in EINZELN)


def regel(name: str, angabe: dict, rahmen: tuple[int, int, int, int]) -> str | None:
    """Welche Regel gilt: „platte“, „zaun“, „bett“ oder None (Art bleibt, wie sie ist)."""
    art = angabe.get("art")
    if art in PLATTE_ARTEN:
        return "platte"
    if art in NIEDRIG_ARTEN and rahmen[3] - rahmen[1] <= NIEDRIG:
        return "platte"
    if art in ZAUN_ARTEN and laengs(name, rahmen):
        return "zaun"
    return "bett" if art in BETT_ARTEN else None


def platte(alpha: bytes, breite: int, hoehe: int, alt: set[Zelle], oben: int) -> set[Zelle]:
    """Dichte Zellen, die unter der obersten deckenden Reihe ``oben`` beginnen, höchstens eine Kachel
    über der alten Sperre, dazu die alte. Warum nicht RAND wie bei der Sitzfläche: Die Platte liegt
    nicht im Zellraster; bei einer Kante auf Pixel 6 blieben sonst 6 Pixel der Platte frei (mf5Buffet).

    Beispiel: Buffet 32 × 32, Platte ab Pixel 6, alte Sperre Zellreihe 4 → Zellreihen 2 bis 4.
    """
    grenze = min((y for _, y in alt), default=0) - Z
    dicht = {z for z, n in deckende_zellen(alpha, breite, hoehe).items() if n >= MINDEST_PIXEL}
    return alt | {(x, y) for x, y in dicht if y * ZP > oben and y >= grenze}


def liegeflaeche(alpha: bytes, breite: int, hoehe: int) -> set[Zelle]:
    """Dichte Zellen ab der obersten breiten Reihe (Matratze) plus RAND bis zum Fuß.

    Beispiel: Bett mit Kopfpfosten 4 Pixel über der Matratze → die Pfosten bleiben frei.
    """
    werte = [sum(1 for a in alpha[y * breite : (y + 1) * breite] if a > DECKEND) for y in range(hoehe)]
    breit = [y for y, w in enumerate(werte) if w and w >= LIEGE_BREITE * max(werte)]
    if not breit:
        return set()
    kante = breit[0]
    dicht = {z for z, n in deckende_zellen(alpha, breite, hoehe).items() if n >= MINDEST_PIXEL}
    return {(x, y) for x, y in dicht if y * ZP >= kante + RAND}


def artbefund(name: str, angabe: dict, alpha: bytes, alt: set[Zelle]) -> Artbefund | None:
    """Neue Sperre, Grund, Befund und Sortierlinie für Tische, Betten, niedrige Schränke und
    Längszäune, wenn die Sperre von der bisherigen abweicht; sonst None.

    Sortierlinie der Platte: die Oberkante der bisherigen Sperre. Warum: Neben einem Tisch stehen
    Stühle mit der Linie in der Mitte ihrer Sitzfläche (Pilot); läge die Linie des Tisches tiefer,
    stünde der Held hinter dem Stuhl und zugleich neben dem Tisch über Kreuz (heldtiefe.karten.test.ts,
    Klapptische der Capital Arena). Längszaun ebenso (Zaunpfahl zwischen den Villen,
    heldtiefe.karten.test.ts: Tiefe wie bisher). Bett: die Linie
    nach ``linienbefund`` (None hier).

    Eingaben: Katalogangabe, Alphakanal in Katalogsgröße, die bisherige Sperre (Zellen).
    Sonderfälle: Bild nicht im Kachelraster oder ohne Kollision → None.
    """
    breite, hoehe = angabe["breite"], angabe["hoehe"]
    if name in AUSNAHMEN:
        return None
    rahmen = sichtbar(alpha, breite, hoehe)
    if rahmen is None or not alt or breite % K or hoehe % K:
        return None
    art = regel(name, angabe, rahmen)
    if art is None:
        return None
    if art == "bett":
        neu, grund = liegeflaeche(alpha, breite, hoehe), GRUND_BETT
    else:
        neu = platte(alpha, breite, hoehe, alt, rahmen[1])
        grund = GRUND_ZAUN if art == "zaun" else GRUND_PLATTE
    spalten, reihen = breite // K * Z, hoehe // K * Z
    neu = {(x, y) for x, y in neu if x < spalten and y < reihen}
    if not neu or neu == alt:
        return None
    mehr, weniger = len(neu - alt), len(alt - neu)
    oben = min(y for _, y in alt) * ZP
    linie = oben if art in ("platte", "zaun") else None
    return Artbefund(neu, grund, f"Draufsicht ({art}): {mehr} Zellen mehr, {weniger} weniger", linie)

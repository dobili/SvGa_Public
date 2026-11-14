"""Brettbild-Schneider: ein gezeichnetes Schachbrett (Gemini) gerade, ohne Rand, 512 × 512.

Warum: Der Autor lässt je Ort ein schöneres Brett zeichnen (Brettstile des Schach-Abenteuers,
docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 5). Gemini liefert ein quadratisches Bild mit
8 × 8 Feldern von oben, oft mit einem dünnen Rand oder Rahmen und nicht genau mittig. Die App legt
das Bild über die 64 Felder (abenteuer/brett/Bilderzeichnung.tsx); es muss deshalb genau an den
Feldgrenzen beginnen und enden.

Verfahren: Die Feldgrenzen sind Linien, an denen sich die Helligkeit über die ganze Länge sprunghaft
ändert. Je Richtung entsteht ein Profil der Helligkeitssprünge; gesucht sind Abstand und Beginn, bei
denen die sieben inneren Grenzen auf die stärksten Sprünge fallen (der äußere Rahmen zählt nicht
mit). Unter den besten Kandidaten gewinnt der mit dem deutlichsten Schachmuster. Danach wird
ausgeschnitten, auf 512 × 512 gebracht und geprüft, ob a8 (oben links) hell ist; sonst wird das
Bild um 90 Grad gedreht.

Eingabe: ein Pillow-Bild. Ausgabe: Brettschnitt mit Bild, mittleren Feldfarben und Hinweisen.
Abhängigkeiten: numpy, Pillow (beide nur lokal, wie bei den übrigen Grafikwerkzeugen).
"""

from dataclasses import dataclass, field

import numpy as np
from PIL import Image

BRETTGROESSE = 512
FELDER = 8
# Das Brett nimmt mindestens diesen Anteil der Bildbreite ein (sonst ist es kein Brettbild).
MINDESTANTEIL = 0.55
# Feinheit der Suche nach dem Feldabstand in Pixeln.
SCHRITT = 0.25
# Abweichung zwischen Feldbreite und Feldhöhe, ab der gewarnt wird (schräg fotografiert o. ä.).
QUADRAT_TOLERANZ = 0.03
# Mindestabstand der mittleren Helligkeit heller und dunkler Felder (0 bis 255).
SCHACHMUSTER_MIN = 12
# Kleinere Vorlagen werden stark vergrößert und unscharf.
VORLAGE_MIN = 384
# Anteil des Feldes, der für die mittlere Feldfarbe zählt (Mitte, ohne Grenzlinien).
FELDKERN = 0.6
# Ein Raster gilt, wenn sein Schachmuster mindestens so deutlich ist wie dieser Anteil des besten.
MUSTERANTEIL = 0.9


@dataclass
class Brettschnitt:
    """Ergebnis: Bild 512 × 512, mittlere Farben der Felder, Hinweise für den Bericht."""

    bild: Image.Image
    hell: tuple[int, int, int]
    dunkel: tuple[int, int, int]
    hinweise: list[str] = field(default_factory=list)
    warnungen: list[str] = field(default_factory=list)


def helligkeit(bild: Image.Image) -> np.ndarray:
    """Helligkeit je Pixel als Gleitkommazahl (Graustufen nach ITU-R 601, wie Pillow „L“)."""
    return np.asarray(bild.convert("L"), dtype=np.float64)


def sprungprofil(grau: np.ndarray, senkrecht: bool) -> np.ndarray:
    """Summe der Helligkeitssprünge je Pixelkante: Eintrag i misst den Sprung von Pixel i - 1 zu i.

    Leicht geglättet (1-2-1), damit weiche Kanten über zwei Pixel ihre Mitte behalten.
    Senkrecht: Kanten zwischen Spalten (senkrechte Linien), sonst zwischen Zeilen.
    """
    flaeche = grau if senkrecht else grau.T
    sprung = np.abs(np.diff(flaeche, axis=1)).sum(axis=0)
    roh = np.concatenate([[0.0], sprung, [0.0]])
    return np.convolve(roh, [0.25, 0.5, 0.25], mode="same")


def rasterkandidaten(profil: np.ndarray, anzahl: int = 4) -> list[tuple[float, float]]:
    """Die besten (Beginn, Feldabstand), bei denen die sieben inneren Grenzen auf Sprünge fallen.

    Mehrere Kandidaten, weil ein kräftiger Rahmen wie eine Feldgrenze aussehen kann; welcher gilt,
    entscheidet das Schachmuster (waehle_raster). Beispiel: 600 Pixel breit, 40 Pixel Rand, Felder
    zu 65 Pixel → zuerst etwa (40, 65).
    """
    laenge = len(profil) - 1
    alle = []
    # Abstände auf Vielfachen von SCHRITT, damit ganze Pixel (häufigster Fall) darunter sind.
    kleinster = np.floor(laenge * MINDESTANTEIL / FELDER / SCHRITT) * SCHRITT
    for abstand in np.arange(kleinster, laenge / FELDER + SCHRITT, SCHRITT):
        spielraum = laenge - FELDER * abstand
        if spielraum < 0:
            continue
        beginne = np.arange(0.0, spielraum + 1.0, 1.0)
        innen = beginne[:, None] + abstand * np.arange(1, FELDER)[None, :]
        wert = profil[np.clip(np.rint(innen).astype(int), 0, laenge)].sum(axis=1)
        i = int(np.argmax(wert))
        alle.append((float(wert[i]), float(beginne[i]), float(abstand)))
    alle.sort(key=lambda k: (-k[0], -k[2]))
    gewaehlt: list[tuple[float, float]] = []
    for _, beginn, abstand in alle:
        if all(abs(beginn - b) > 2 or abs(abstand - a) > 2 for b, a in gewaehlt):
            gewaehlt.append((beginn, abstand))
        if len(gewaehlt) == anzahl:
            break
    return gewaehlt


def schachguete(grau: np.ndarray, x: tuple[float, float], y: tuple[float, float]) -> float:
    """Wie deutlich die 64 Feldkerne ein Schachmuster bilden: Abstand der Klassen minus Streuung.

    Ein Raster, das um ein Feld verrutscht ist, nimmt den Rahmen als Feldreihe mit; dort passt
    das Muster nicht, die Güte sinkt.
    """
    (x0, breite), (y0, hoehe) = x, y
    klassen: dict[bool, list[float]] = {True: [], False: []}
    for zeile in range(FELDER):
        for spalte in range(FELDER):
            xa = round(x0 + (spalte + (1 - FELDKERN) / 2) * breite)
            ya = round(y0 + (zeile + (1 - FELDKERN) / 2) * hoehe)
            kern = grau[ya : ya + max(1, round(FELDKERN * hoehe)), xa : xa + max(1, round(FELDKERN * breite))]
            klassen[(zeile + spalte) % 2 == 0].append(float(kern.mean()) if kern.size else 0.0)
    a, b = np.array(klassen[True]), np.array(klassen[False])
    return abs(a.mean() - b.mean()) - (a.std() + b.std()) / 2


def waehle_raster(grau: np.ndarray) -> tuple[tuple[float, float], tuple[float, float]]:
    """(Beginn, Abstand) waagrecht und senkrecht: das Raster mit den stärksten Grenzen unter denen
    mit (fast) dem deutlichsten Schachmuster.

    Warum zwei Stufen: Das Muster unterscheidet ein um ein ganzes Feld verrutschtes Raster sicher,
    aber nicht eines, das um wenige Pixel daneben liegt (die Feldkerne sehen gleich aus); das
    entscheiden die Grenzen.
    """
    xs = rasterkandidaten(sprungprofil(grau, True))
    ys = rasterkandidaten(sprungprofil(grau, False))
    paare = [(x, y) for x in xs for y in ys]  # nach Stärke der Grenzen geordnet
    guete = [schachguete(grau, x, y) for x, y in paare]
    beste = max(guete)
    return next(p for p, g in zip(paare, guete, strict=True) if g >= MUSTERANTEIL * beste)


def feldfarben(bild: Image.Image) -> tuple[np.ndarray, np.ndarray]:
    """Mittlere Farbe der hellen und der dunklen Felder (a8 hell gedacht), je aus dem Feldkern."""
    rgb = np.asarray(bild.convert("RGB"), dtype=np.float64)
    feld = bild.width / FELDER
    rand = feld * (1 - FELDKERN) / 2
    summen = {True: [], False: []}
    for zeile in range(FELDER):
        for spalte in range(FELDER):
            x0, y0 = round(spalte * feld + rand), round(zeile * feld + rand)
            x1, y1 = round((spalte + 1) * feld - rand), round((zeile + 1) * feld - rand)
            kern = rgb[y0:y1, x0:x1].reshape(-1, 3).mean(axis=0)
            summen[(zeile + spalte) % 2 == 0].append(kern)
    return np.mean(summen[True], axis=0), np.mean(summen[False], axis=0)


def _hellwert(farbe: np.ndarray) -> float:
    return float(farbe @ np.array([0.299, 0.587, 0.114]))


def _als_farbe(werte: np.ndarray) -> tuple[int, int, int]:
    r, g, b = (int(round(w)) for w in werte)
    return r, g, b


def schneide_brett(vorlage: Image.Image, groesse: int = BRETTGROESSE) -> Brettschnitt:
    """Das Brett gerade, ohne Rand, a8 hell, in groesse × groesse Pixeln.

    Beispiel: Gemini-Bild 1024 × 1024 mit Holzrahmen von 60 Pixeln → nur die 64 Felder, 512 × 512.
    Sonderfälle: a8 dunkel → um 90 Grad gedreht (Hinweis); kein Schachmuster erkennbar,
    ungleiche Feldbreite und -höhe oder eine kleine Vorlage → Warnung im Bericht.
    """
    hinweise, warnungen = [], []
    if min(vorlage.size) < VORLAGE_MIN:
        warnungen.append(f"Vorlage nur {vorlage.width} × {vorlage.height} Pixel, wird unscharf")
    grau = helligkeit(vorlage)
    (x0, breite), (y0, hoehe) = waehle_raster(grau)
    if abs(breite - hoehe) > QUADRAT_TOLERANZ * max(breite, hoehe):
        warnungen.append(f"Felder nicht quadratisch: {breite:.1f} × {hoehe:.1f} Pixel")
    kasten = (x0, y0, x0 + FELDER * breite, y0 + FELDER * hoehe)
    hinweise.append(
        f"Brett erkannt: Rand links {x0:.0f}, oben {y0:.0f}, Feld {breite:.1f} × {hoehe:.1f} Pixel"
    )
    bild = vorlage.convert("RGB").resize((groesse, groesse), Image.Resampling.LANCZOS, box=kasten)
    hell, dunkel = feldfarben(bild)
    if _hellwert(hell) < _hellwert(dunkel):
        bild = bild.transpose(Image.Transpose.ROTATE_90)
        hell, dunkel = dunkel, hell
        hinweise.append("a8 war dunkel: Brett um 90 Grad gedreht (a8 und h1 müssen hell sein)")
    if _hellwert(hell) - _hellwert(dunkel) < SCHACHMUSTER_MIN:
        warnungen.append("Kein deutliches Schachmuster: helle und dunkle Felder fast gleich")
    return Brettschnitt(bild, _als_farbe(hell), _als_farbe(dunkel), hinweise, warnungen)

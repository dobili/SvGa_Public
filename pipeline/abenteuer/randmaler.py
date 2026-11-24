"""Randmaler: Farben für den geglätteten Rand von Wasser und Wegen (braucht Pillow).

Warum: ``weichrand.py`` ersetzt die Rand- und Eckkacheln von LimeZu durch einen geglätteten Umriss
(randzug.py). Damit das Ergebnis weiter wie LimeZu aussieht, malt dieses Modul den Rand mit dessen
Farben und dessen Blick von schräg oben nach: Am Nordufer sieht man die Erdkante und ihren Schatten
auf dem Wasser, am Südufer nur eine dünne Kante mit Grasbüscheln davor. Die Farbwerte sind an den
Uferkacheln von LimeZu abgelesen (Bogen „gelaende“, Wasserblock ab Feld [0, 35], Erdblock ab
[0, 30]) und werden für anderes Wasser (Moor) als Anteile der Grundfarbe gerechnet.

Rolle im Gesamtbild: ``weichrand.male`` fragt je Pixel ``wasserfarbe``, ``wegfarbe`` oder
``landfarbe``; die Ringe um den Umriss liefert ``Ringe``.
"""

from dataclasses import dataclass

from PIL import Image, ImageDraw, ImageFilter

Farbe = tuple[int, int, int, int]

# Kantenlänge einer Kachel in Pixeln (wie kartenbau.K).
K = 16
VOLL = 255
# Die Fläche wird in dieser Vergrößerung gefüllt und dann auf Pixel gerundet (``maske``).
FEINHEIT = 4
# Erdkante des Grasufers: Grundton, heller Rücken, dunkler Fuß (LimeZu).
ERDE, ERDE_HELL, ERDE_DUNKEL = (168, 95, 70, VOLL), (181, 117, 77, VOLL), (154, 86, 73, VOLL)
# Grasbüschel am Rand: zwei helle Töne und der dunkle Schattenpunkt (LimeZu).
HALM_HELL, HALM, HALM_DUNKEL = (121, 161, 92, VOLL), (83, 166, 93, VOLL), (55, 133, 78, VOLL)
# Wasser vom Ufer zur Mitte als Anteile der Grundfarbe: tiefer Schatten unter der Nordkante,
# mittlerer Ton, flacher Ton, heller Saum (aus (34,100,141) … (54,154,176) gegen (60,163,178)).
TIEF, MITTEL, FLACH, SAUM = (0.57, 0.61, 0.79), (0.70, 0.69, 0.87), (0.68, 0.83, 0.93), (0.90, 0.94, 0.99)
# Höhe der Erdkante am Nordufer in Pixeln, danach die Töne des Schattens je Pixelreihe darunter;
# an den Seiten und im Süden ist die Erdkante ``KANTE_SEITE`` Pixel breit.
KANTE_NORD, KANTE_SEITE = 3, 2
SCHATTEN_NORD = (FLACH, TIEF, TIEF, MITTEL, FLACH, SAUM)
# Loser Boden am Wasser (Sand, Watt, Schotter): Der Boden wird zum Wasser hin feucht und dunkler
# (Anteile je Pixelreihe, erste Reihe am Wasser), das Wasser beginnt mit einer Schaumlinie und
# zwei Reihen flachem, hellerem Wasser (Aufhellung je Reihe; von 256 Würfen reißt der Schaum so
# oft ab).
FEUCHT, SEICHT, WURF_SCHAUMLUECKE = (0.78, 0.86, 0.93), (0.62, 0.22, 0.10), 40
# Wegrand: Abdunklung der Kante unten und seitlich, der dunkleren Sprenkel, des Rückens oben.
WEGKANTE, WEGSPRENKEL, WEGRUECKEN = (0.82, 0.70, 0.91), (0.63, 0.56, 0.91), (0.95, 0.87, 0.89)
# Ränder zu anderem als Gras: nur eine leichte Abdunklung ringsum.
WEGKANTE_SCHLICHT = (0.88, 0.86, 0.86)
# Von 256 Würfen: so oft steht in der ersten, zweiten, dritten Pixelreihe am Rand ein Büschel
# (je zwei Pixel breit), so oft ein Schattenpunkt, ein Halm vor der Erdkante, ein heller Fleck
# auf dem Erdrücken, ein dunkler Sprenkel.
WURF_BUESCHEL = (120, 70, 28)
WURF_PUNKT, WURF_VORN, WURF_RUECKEN, WURF_SPRENKEL = 22, 84, 80, 76
# Weiter nach oben wird nicht nach dem Ufer gesucht (Länge des Schattens plus Erdkante).
SUCHE_NORD = KANTE_NORD + len(SCHATTEN_NORD)


def wurf(x: int, y: int, salz: int = 0) -> int:
    """Fester Zufall je Pixel (0 bis 255), damit das Bild bei jedem Bau gleich bleibt."""
    wert = (x * 374761393 + y * 668265263 + salz * 2246822519) & 0xFFFFFFFF
    wert = ((wert ^ (wert >> 13)) * 1274126177) & 0xFFFFFFFF
    return (wert ^ (wert >> 16)) & 0xFF


def getoent(farbe: Farbe, anteil: tuple[float, float, float] | float) -> Farbe:
    """Die Farbe, je Kanal mit dem Anteil malgenommen (ein Wert gilt für alle drei Kanäle)."""
    r, g, b = anteil if isinstance(anteil, tuple) else (anteil, anteil, anteil)
    return (int(farbe[0] * r), int(farbe[1] * g), int(farbe[2] * b), farbe[3])


def aufgehellt(farbe: Farbe, anteil: float) -> Farbe:
    """Die Farbe, um ``anteil`` (0 bis 1) zu Weiß hin gemischt (Schaumkante am Sand)."""
    return (*(int(k + (VOLL - k) * anteil) for k in farbe[:3]), farbe[3])


def maske(
    groesse: tuple[int, int], zuege: list[list[tuple[float, float]]], flaechen: list[float]
) -> Image.Image:
    """Die gefüllte Fläche der Züge als Graubild (255 innen).

    Eingaben: Bildgröße, Züge (größter zuerst, ``randzug.randzuege``), ihre Flächen mit Vorzeichen
    (negativ: Insel, wird ausgespart). Beispiel: Quadrat (0,0)–(16,16) → genau die Pixel 0 bis 15.
    Sonderfall: Pillow füllt auch die Pixel auf der Kante mit. Deshalb wird in ``FEINHEIT``-facher
    Größe gefüllt und ein Pixel zählt, wenn mindestens die Hälfte bedeckt ist: Ein Zug auf den
    Kachelkanten füllt so genau seine Kacheln.
    """
    fein = Image.new("L", (groesse[0] * FEINHEIT, groesse[1] * FEINHEIT), 0)
    zeichner = ImageDraw.Draw(fein)
    for zug, flaeche in zip(zuege, flaechen, strict=True):
        zeichner.polygon([(x * FEINHEIT, y * FEINHEIT) for x, y in zug], fill=VOLL if flaeche > 0 else 0)
    return fein.resize(groesse, Image.BOX).point(lambda wert: VOLL if wert > VOLL // 2 else 0)


@dataclass
class Ringe:
    """Pixelzugriff auf die Fläche und ihre Ringe (innen eingezogen, außen erweitert)."""

    innen: list  # innen[i]: Fläche, um i + 1 Pixel eingezogen
    aussen: list  # aussen[i]: Fläche, um i + 1 Pixel erweitert
    flaeche: object  # die Fläche selbst
    offen: object  # Fläche samt der Nachbarfelder, in die sie ohne Rand weiterläuft
    groesse: tuple[int, int]

    def drin(self, x: int, y: int) -> bool:
        """Ob das Pixel zur Fläche gehört."""
        return self.flaeche[x, y] > 0

    def tiefe(self, x: int, y: int) -> int:
        """Abstand eines Pixels der Fläche vom Rand: 0 (Randpixel) bis 4 (weiter innen)."""
        for i, ring in enumerate(self.innen):
            if not ring[x, y]:
                return i
        return len(self.innen)

    def ferne(self, x: int, y: int) -> int:
        """Abstand eines Pixels außerhalb von der Fläche: 1 bis 3 oder 0 (weiter weg)."""
        for i, ring in enumerate(self.aussen):
            if ring[x, y]:
                return i + 1
        return 0

    def nordabstand(self, x: int, y: int) -> int:
        """So viele Pixel liegt das Ufer senkrecht über dem Pixel (1 = direkt darüber); ohne Ufer
        in Reichweite ``SUCHE_NORD + 1``."""
        for n in range(1, SUCHE_NORD + 1):
            if y - n < 0:
                break
            if not self.offen[x, y - n]:
                return n
        return SUCHE_NORD + 1

    def land_darunter(self, x: int, y: int) -> bool:
        """Ob direkt unter dem Pixel Land liegt (Südufer)."""
        return y + 1 < self.groesse[1] and not self.offen[x, y + 1]


def ringe(flaeche: Image.Image, offene_felder: set[tuple[int, int]]) -> Ringe:
    """Die Ringe zur Fläche; ``offene_felder`` (Steg, anderer Belag) zählen für die Ringe dazu,
    damit dort kein Rand entsteht."""
    offen = flaeche.copy()
    zeichner = ImageDraw.Draw(offen)
    for x, y in offene_felder:
        zeichner.rectangle((x * K, y * K, x * K + K - 1, y * K + K - 1), fill=VOLL)
    innen = [offen.filter(ImageFilter.MinFilter(2 * i + 1)).load() for i in (1, 2, 3, 4)]
    aussen = [offen.filter(ImageFilter.MaxFilter(2 * i + 1)).load() for i in (1, 2, 3)]
    return Ringe(innen, aussen, flaeche.load(), offen.load(), flaeche.size)


def wasserfarbe(r: Ringe, x: int, y: int, wasser: Farbe, land: Farbe, stil: str) -> Farbe:
    """Die Farbe eines Wasserpixels nahe am Ufer.

    Eingaben: Ringe, Pixel, Grundfarbe des Wassers und des Landes an dieser Stelle, ``stil``:
    „gras“ (Erdkante, Schatten) oder „boden“ (Schaumlinie, flaches Wasser; ``land`` zählt nicht).
    Beispiel: zwei Pixel unter einem Grasufer im Norden → Erdbraun; fünf Pixel darunter → tiefer
    Schatten; mitten im See → Grundfarbe.
    """
    tiefe, nord = r.tiefe(x, y), r.nordabstand(x, y)
    if stil == "boden":
        if tiefe >= len(SEICHT):
            return wasser
        luecke = tiefe == 0 and wurf(x // 3, y // 3, 8) < WURF_SCHAUMLUECKE
        return aufgehellt(wasser, SEICHT[1] if luecke else SEICHT[tiefe])
    if tiefe < KANTE_SEITE or nord <= KANTE_NORD:
        if tiefe == 0 and nord > 1 and wurf(x // 2, y // 2, 1) < WURF_VORN:
            return HALM  # Gras hängt über die Kante (nicht am Nordufer, dort sieht man die Erde)
        if nord == 1 and wurf(x // 2, y, 2) < WURF_RUECKEN:
            return ERDE_HELL
        return ERDE_DUNKEL if wurf(x, y, 3) < WURF_SPRENKEL else ERDE
    if nord <= SUCHE_NORD:
        return getoent(wasser, SCHATTEN_NORD[nord - KANTE_NORD - 1])
    if tiefe == KANTE_SEITE:
        return getoent(wasser, MITTEL)
    return getoent(wasser, SAUM) if tiefe == KANTE_SEITE + 1 else wasser


def wegfarbe(r: Ringe, x: int, y: int, weg: Farbe, stil: str) -> Farbe:
    """Die Farbe eines Wegpixels nahe am Rand.

    ``stil`` „gras“: wie LimeZus Erdweg, oben ohne Kante (das Gras wächst herein), unten und
    seitlich eine dunkle Kante mit Sprenkeln; sonst nur eine leichte Abdunklung ringsum.
    Beispiel: unterste Pixelreihe eines Feldwegs im Gras → dunkles Erdbraun.
    """
    tiefe = r.tiefe(x, y)
    if stil != "gras":
        return getoent(weg, WEGKANTE_SCHLICHT) if tiefe == 0 else weg
    if tiefe > 1:
        return weg
    if wurf(x // 2, y // 2, 1) < WURF_VORN // (tiefe + 1):
        return HALM if tiefe else HALM_DUNKEL  # Gras wächst in den Weg
    if tiefe == 1:
        return weg
    if r.nordabstand(x, y) == 1:
        return getoent(weg, WEGRUECKEN) if wurf(x // 2, y, 4) < WURF_RUECKEN else weg
    return getoent(weg, WEGSPRENKEL if wurf(x, y, 5) < WURF_SPRENKEL else WEGKANTE)


def landfarbe(r: Ringe, x: int, y: int, land: Farbe, stil: str) -> Farbe:
    """Die Farbe eines Landpixels am Rand: bei Gras stehen Büschel und Schattenpunkte am Rand.

    Beispiel: Graspixel direkt neben dem Wasser → in knapp der Hälfte der Fälle ein helles
    Büschel (je zwei Pixel breit); loser Boden am Wasser („boden“) wird in drei Reihen feucht.
    """
    ferne = r.ferne(x, y)
    if ferne == 0 or stil not in ("gras", "boden"):
        return land
    if stil == "boden":
        return getoent(land, FEUCHT[ferne - 1])
    w = wurf(x // 2, y // 2, 6)
    if w < WURF_BUESCHEL[ferne - 1]:
        return HALM_HELL if wurf(x, y, 7) % 2 else HALM
    return HALM_DUNKEL if w > VOLL - WURF_PUNKT else land

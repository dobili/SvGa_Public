"""Bodenstreuung: Naturböden mit frei gestreuten Büscheln, Steinchen, Körnung und Tonflecken.

Warum (Kartenblick M01, 24.11.2026): Grasbüschel, Sandsteinchen und Schotterpunkte standen in Reih
und Glied, weil jede Kachel ihre Streuteile an derselben Stelle trägt; Erde und Sand waren ganz
glatte Farbflächen. Der Autor bat ausdrücklich, das Kachelraster loszuwerden.

Wie: Ein Nachlauf über den fertigen Hintergrund (aus ``bodenvariation.variiere``), je Boden mit
einer dieser Angaben in ``variation`` (``materialien.json``):
- ``eben``: Innenkacheln werden zur Grundfarbe eingeebnet; ihre Streuteile (Büschel, Blümchen,
  Steinchen: zusammenhängende Pixel in anderer Farbe) werden aus den Kacheln gelesen und mit
  ``streu`` (mittlere Zahl je Feld) an beliebigen Pixelstellen neu gestreut, auch über
  Kachelgrenzen hinweg. So bleiben Farben und Formen von LimeZu, nur das Gitter verschwindet.
- ``kiesel``: Anteil der Felder mit einem gemalten Steinchen (für Böden ohne eigene Streuteile).
- ``koernung``: mittlere Zahl kleiner hellerer und dunklerer Punkte und Striche je Feld.
- ``wolken``: Stärke großer, unregelmäßiger Tonflecken (0,04 = 4 % heller oder dunkler).
Gemalt wird nur auf Pixel des Bodens selbst: Innenkacheln ganz, in Randkacheln nur Pixel in den
Farben der Innenkachel (der Grasrand eines Erdwegs bleibt, wie er ist).
Der Zufall ist fest je Karte, Boden und Feld (sha256), also gleiches Bild bei jedem Lauf.
"""

import hashlib
import random
from collections import Counter

from PIL import Image, ImageChops

K = 16
VOLL = 255
# Größer als so viele Pixel ist kein Streuteil mehr, sondern Zeichnung der Kachel.
STREUTEIL_GROESSE = 40
# Kantenlänge der Zellen des groben und des feinen Rauschens der Tonflecken in Pixeln.
WOLKE_GROB, WOLKE_FEIN = 40, 7
# Anteil des feinen Rauschens (franst die Ränder der Tonflecken aus).
WOLKE_FRANSEN = 0.22
# Unter bzw. über diesen Werten des Rauschens (0 bis 255) wird der Boden dunkler bzw. heller.
WOLKE_DUNKEL, WOLKE_HELL = 108, 150
# Töne der Körnung und der Kiesel als Faktor auf die Farbe des Bodens.
KORN_DUNKEL, KORN_HELL = 0.91, 1.07
KIESEL_LICHT, KIESEL_KOERPER, KIESEL_SCHATTEN = 1.22, 1.08, 0.78
# Formen der Kiesel: Zeilen aus L (Licht), K (Körper), S (Schatten), Punkt = frei.
KIESELFORMEN = (("LK", "KS"), ("LKK", "KKS"), (".LK", "LKS", "KS."), ("LK", "SS"))
TON = {"L": KIESEL_LICHT, "K": KIESEL_KOERPER, "S": KIESEL_SCHATTEN}

Feld = tuple[int, int]
Farbe = tuple[int, int, int, int]
Streuteil = list[tuple[int, int, Farbe]]


def zufall(*teile: object) -> random.Random:
    """Fester Zufall aus den Teilen (unabhängig von PYTHONHASHSEED)."""
    samen = hashlib.sha256(":".join(map(str, teile)).encode()).digest()
    return random.Random(int.from_bytes(samen[:8], "big"))


def grundfarbe(kachel: Image.Image) -> Farbe:
    """Die häufigste Farbe der Kachel (Gras: das Grün ohne Büschel)."""
    return Counter(kachel.get_flattened_data()).most_common(1)[0][0]


def getoent(farbe: Farbe, faktor: float) -> Farbe:
    """Die Farbe um den Faktor heller oder dunkler (Deckkraft bleibt)."""
    r, g, b, a = farbe
    return (min(VOLL, round(r * faktor)), min(VOLL, round(g * faktor)), min(VOLL, round(b * faktor)), a)


def streuteile(kacheln: list[Image.Image], grund: Farbe) -> list[Streuteil]:
    """Die Streuteile der Kacheln: zusammenhängende Pixelgruppen (auch schräg), die nicht Grund sind.

    Warum: Büschel und Steinchen von LimeZu sollen bleiben, nur nicht im Gitter. Eingaben: die
    Innenkacheln eines Bodens und seine Grundfarbe. Ausgabe: je Teil die Pixel (dx, dy, Farbe) ab
    seiner linken oberen Ecke. Beispiel: Graskachel [1, 7] gibt sechs Büschel aus je 5 bis 7 Pixeln.
    Sonderfall: Gruppen über ``STREUTEIL_GROESSE`` Pixel (Zeichnung der ganzen Kachel) entfallen.
    """
    teile: list[Streuteil] = []
    for kachel in kacheln:
        px = kachel.load()
        offen = {(x, y) for x in range(K) for y in range(K) if px[x, y] != grund}
        while offen:
            gruppe, rand = [], [offen.pop()]
            while rand:
                x, y = rand.pop()
                gruppe.append((x, y))
                nachbarn = {(x + dx, y + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1)} & offen
                offen -= nachbarn
                rand.extend(nachbarn)
            if len(gruppe) <= STREUTEIL_GROESSE:
                x0, y0 = min(x for x, _ in gruppe), min(y for _, y in gruppe)
                teile.append(sorted((x - x0, y - y0, px[x, y]) for x, y in gruppe))
    return teile


def kiesel(grund: Farbe) -> list[Streuteil]:
    """Gemalte Steinchen in Tönen der Grundfarbe (Licht oben links, Schatten unten rechts)."""
    return [
        [
            (x, y, getoent(grund, TON[z]))
            for y, zeile in enumerate(form)
            for x, z in enumerate(zeile)
            if z in TON
        ]
        for form in KIESELFORMEN
    ]


def bodenmaske(bild: Image.Image, innen: set[Feld], rand: set[Feld], farben: set[Farbe]) -> Image.Image:
    """Maske (Modus „L“) der Pixel, auf die gestreut werden darf.

    Eingaben: Hintergrund, Innenfelder (ganz erlaubt), Randfelder (nur Pixel in den ``farben`` der
    Innenkachel). Beispiel: Erdweg im Gras: Die Erde der Randkacheln ist erlaubt, ihr Grasrand nicht.
    """
    maske = Image.new("L", bild.size, 0)
    for x, y in innen:
        maske.paste(VOLL, (x * K, y * K, (x + 1) * K, (y + 1) * K))
    px, mx = bild.load(), maske.load()
    for x, y in rand:
        for py in range(y * K, (y + 1) * K):
            for qx in range(x * K, (x + 1) * K):
                if px[qx, py] in farben:
                    mx[qx, py] = VOLL
    return maske


def _rauschen(groesse: tuple[int, int], zelle: int, r: random.Random) -> Image.Image:
    """Weiches Rauschen: Zufallswerte im Raster von ``zelle`` Pixeln, weich vergrößert."""
    breite, hoehe = groesse[0] // zelle + 2, groesse[1] // zelle + 2
    klein = Image.frombytes("L", (breite, hoehe), bytes(r.randrange(VOLL + 1) for _ in range(breite * hoehe)))
    return klein.resize(groesse, Image.Resampling.BICUBIC)


def wolken(bild: Image.Image, maske: Image.Image, staerke: float, r: random.Random) -> None:
    """Große, ausgefranste Tonflecken: Teile der Fläche etwas dunkler, andere etwas heller.

    Warum: Eine große Fläche in einer einzigen Farbe wirkt wie Karton (Jahrmarkt, Bergstraße).
    Eingaben: Hintergrund (wird verändert), Maske des Bodens, Stärke (0,04 = 4 %), Zufall.
    Sonderfall: harte Kanten statt Verlauf, damit es Pixelgrafik bleibt.
    """
    rauschen = Image.blend(
        _rauschen(bild.size, WOLKE_GROB, r), _rauschen(bild.size, WOLKE_FEIN, r), WOLKE_FRANSEN
    )
    deckung = round(VOLL * staerke)
    for farbe, wahl in (
        ((0, 0, 0, VOLL), lambda v: deckung if v < WOLKE_DUNKEL else 0),
        ((VOLL, VOLL, VOLL, VOLL), lambda v: deckung if v > WOLKE_HELL else 0),
    ):
        fleck = ImageChops.multiply(rauschen.point(wahl), maske)
        bild.paste(farbe, (0, 0), fleck)


def _anzahl(mittel: float, r: random.Random) -> int:
    """Eine ganze Zahl mit Mittelwert ``mittel`` (ganzer Teil sicher, der Rest nach Wurf)."""
    return int(mittel) + (r.random() < mittel - int(mittel))


def koernung(bild: Image.Image, maske: Image.Image, felder: list[Feld], mittel: float, samen: tuple) -> None:
    """Kleine Punkte und kurze Striche, heller oder dunkler als der Boden an der Stelle.

    Eingaben: Hintergrund (wird verändert), Maske, Felder des Bodens, mittlere Zahl je Feld, Samen.
    Beispiel: Erde am Jahrmarkt mit 5 je Feld: feine Krume statt glatter Fläche.
    """
    px, mx = bild.load(), maske.load()
    breite = bild.width
    for fx, fy in felder:
        r = zufall(*samen, "korn", fx, fy)
        for _ in range(_anzahl(mittel, r)):
            x, y = fx * K + r.randrange(K), fy * K + r.randrange(K)
            faktor = KORN_DUNKEL if r.random() < 0.6 else KORN_HELL
            for qx in range(x, min(breite, x + r.choice((1, 1, 2, 3)))):
                if mx[qx, y]:
                    px[qx, y] = getoent(px[qx, y], faktor)


def streue(
    bild: Image.Image, maske: Image.Image, felder: list[Feld], teile: list[Streuteil], mittel: float, samen
) -> None:
    """Streut Teile an freie Pixelstellen der Felder (nicht übereinander, nur auf die Maske).

    Warum: Die Stelle innerhalb der Kachel ist frei, deshalb entsteht kein Gitter. Eingaben:
    Hintergrund (wird verändert), Maske, Felder, Streuteile, mittlere Zahl je Feld, Samen.
    Sonderfall: Ein Teil, das die Maske verließe oder ein anderes berührte, entfällt ganz (kein
    halbes Büschel am Wegrand).
    """
    if not teile:
        return
    px, mx = bild.load(), maske.load()
    breite, hoehe = bild.size
    belegt: set[tuple[int, int]] = set()
    for fx, fy in felder:
        r = zufall(*samen, "streu", fx, fy)
        for _ in range(_anzahl(mittel, r)):
            teil = r.choice(teile)
            x0, y0 = fx * K + r.randrange(K), fy * K + r.randrange(K)
            orte = [(x0 + dx, y0 + dy) for dx, dy, _ in teil]
            hof = {(x + ex, y + ey) for x, y in orte for ex in (-1, 0, 1) for ey in (-1, 0, 1)}
            if any(not (x < breite and y < hoehe and mx[x, y]) for x, y in orte) or hof & belegt:
                continue
            belegt.update(orte)
            for (x, y), (_, _, farbe) in zip(orte, teil, strict=True):
                px[x, y] = farbe

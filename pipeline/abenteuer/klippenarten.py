"""Kachelsätze für Höhen: Fels aus dem Paket, Böschung und Stützmauer selbst gezeichnet (braucht Pillow).

Warum: Jede Höhe im Spiel war dieselbe braune Felswand, nur umgefärbt. Ein Deich las sich als
„Schokoladenriegel“, die Kaimauer als Geländer (Kartenblick M02, 24.11.2026). Bis der Autor eigene
Wandzeichnungen liefert (Bildauftrag „Wandzeichnungen für Höhen“), zeichnet dieses Modul zwei Arten
Pixel für Pixel selbst: die Grasböschung (Deich, Bahndamm) und die Stützmauer aus Quadern (Hafen,
Stadt). Sie liegen in derselben Kachellage wie LimeZus Klippe, sodass ``klippe.klippenfeld`` und
``klippenbild`` alle Arten gleich behandeln.

Rolle im Gesamtbild: ``kachelsatz`` liefert für eine Szene den Bogen und dazu eine Maske, die sagt,
welche Pixel einer Kachel Wand sind (nicht Wiese oben, nicht Grasfuß unten). ``klippenbild`` braucht
die Maske für Felsvarianten, Umriss und den Fuß nach dem Boden darunter. Außerdem heilt der Satz den
halb durchsichtigen Strich in LimeZus linker Fußkachel: Auf dunklem Grund war er der „schwarze
Schrägstrich“ neben Treppen und linken Ecken (Beleg mapleFalls.park_7).
"""

from functools import cache
from pathlib import Path
from typing import NamedTuple

from PIL import Image

from pipeline.abenteuer.kartenbau import INHALTE, K, lade
from pipeline.abenteuer.klippe import (
    REIHE_FUSS,
    REIHE_KANTE,
    REIHE_OBEN,
    REIHE_WAND,
    SPALTEN,
    TREPPE,
    klippenart,
    klippenbogen,
)

Farbe = tuple[int, int, int, int]
DECKEND = 255
# Stützmauer: Quader, heller Rand oben, Fuge, Umriss, Abdeckstein, Sockel.
STEIN: Farbe = (146, 150, 160, DECKEND)
STEIN_HELL: Farbe = (178, 182, 190, DECKEND)
FUGE: Farbe = (92, 96, 110, DECKEND)
UMRISS: Farbe = (58, 58, 80, DECKEND)
ABDECKUNG: Farbe = (206, 208, 214, DECKEND)
SOCKEL: Farbe = (122, 126, 138, DECKEND)
# Höhe einer Steinlage und Breite eines Quaders in Pixeln; jede zweite Lage ist um die Hälfte versetzt.
LAGE, QUADER = 8, 16
# Bis zu dieser Zeile zeigt die Kantenkachel die Fläche oben; darunter beginnt die Wand.
DECKE_BIS = 7
# Böschung: Helligkeit von Hang, Halmstrich, Kamm, Hangfuß und Umriss gegenüber der Wiese oben.
HANG, STRICH, KAMM, HANGFUSS, HANGRAND = 0.84, 0.68, 1.1, 0.78, 0.55
# Ab dieser Zeile liegt der Hangfuß im Schatten.
HANGFUSS_AB = 10
# Halme auf dem Hang: Anfang je Strich (drei Pixel schräg nach unten), fest für jede Kachel.
HALME = ((2, 2), (10, 0), (6, 6), (13, 8), (3, 11), (9, 13))
# Trittstufen: Höhe einer Stufe in Pixeln; Böschung: so viele Pixel Hang bleiben seitlich stehen.
STUFE, STUFENRAND = 4, 2


class Kachelsatz(NamedTuple):
    """Bogen in der Lage des Geländebogens, Wandmaske dazu („L“, 255 = Wand), Art und Umrissfarbe."""

    bogen: Image.Image
    wand: Image.Image
    art: str
    umriss: Farbe

    def kachel(self, feld: tuple[int, int]) -> Image.Image:
        """Die Kachel am Feld (Spalte, Reihe) des Bogens."""
        return self.bogen.crop(_rahmen(feld))

    def maske(self, feld: tuple[int, int]) -> Image.Image:
        """Die Wandmaske derselben Kachel."""
        return self.wand.crop(_rahmen(feld))

    def hat(self, feld: tuple[int, int]) -> bool:
        """Ob der Bogen an diesem Feld etwas zeichnet (der rote Bogen hat keine Grasfassung)."""
        return self.kachel(feld).getbbox() is not None


def _rahmen(feld: tuple[int, int]) -> tuple[int, int, int, int]:
    return (feld[0] * K, feld[1] * K, (feld[0] + 1) * K, (feld[1] + 1) * K)


def _gruen(p: Farbe) -> bool:
    """Ob ein Pixel Gras ist (Grün überwiegt); Fels und Umriss sind es nicht."""
    return p[3] > 0 and p[1] > p[0] and p[1] > p[2]


def _getoent(farbe: Farbe, faktor: float) -> Farbe:
    return (*(min(DECKEND, round(c * faktor)) for c in farbe[:3]), farbe[3])


def wandmaske(gelaende: Image.Image) -> Image.Image:
    """Maske der Wandpixel aus der Zeichnung des Geländebogens (alle Fassungen haben seine Form).

    Die Erdfassung bekommt die Maske der Grasfassung: Dort ist die Fläche oben braun wie der Fels
    und ließe sich an der Farbe nicht trennen. Beispiel: Fußkachel → alles Wand außer den
    Grasbüscheln am unteren Rand.
    """
    maske = Image.new("L", gelaende.size, 0)
    for stelle, spalte in enumerate(SPALTEN["gras"]):
        for reihe in (REIHE_KANTE, REIHE_WAND, REIHE_FUSS):
            kachel = gelaende.crop(_rahmen((spalte, reihe)))
            teil = Image.new("L", (K, K), 0)
            teil.putdata([0 if p[3] == 0 or _gruen(p) else DECKEND for p in kachel.get_flattened_data()])
            for name in SPALTEN:
                maske.paste(teil, _rahmen((SPALTEN[name][stelle], reihe))[:2])
    return maske


def geheilt(bogen: Image.Image) -> Image.Image:
    """Der Bogen ohne halb durchsichtige Pixel in den Wandkacheln (Kopie).

    Warum: LimeZus linke Fußkachel hat einen schrägen, halb durchsichtigen Strich; auf dem dunklen
    Bildgrund wurde er schwarz. Jedes solche Pixel bekommt die Farbe des nächsten deckenden Pixels
    rechts (am Rand: links) in seiner Zeile.
    """
    bild = bogen.copy()
    px = bild.load()
    for spalten in SPALTEN.values():
        for spalte in spalten:
            for reihe in (REIHE_KANTE, REIHE_WAND, REIHE_FUSS):
                x0, y0 = spalte * K, reihe * K
                for y in range(y0, y0 + K):
                    zeile = [px[x, y] for x in range(x0, x0 + K)]
                    if not any(p[3] == DECKEND for p in zeile):
                        continue  # leere Kachel (fehlende Fassung): bleibt leer
                    for i, p in enumerate(zeile):
                        if p[3] != DECKEND:
                            px[x0 + i, y] = _naechstes_deckendes(zeile, i)
    return bild


def _naechstes_deckendes(zeile: list[Farbe], stelle: int) -> Farbe:
    rechts = [p for p in zeile[stelle + 1 :] if p[3] == DECKEND]
    links = [p for p in reversed(zeile[:stelle]) if p[3] == DECKEND]
    return (rechts or links)[0]


def _mauerpixel(x: int, y: int, reihe: int) -> Farbe:
    """Farbe der Stützmauer am Pixel (x, y) der Kachel einer Reihe (Kante, Wand oder Fuß)."""
    if reihe == REIHE_KANTE and y < DECKE_BIS + 4:
        return UMRISS if y == DECKE_BIS else FUGE if y == DECKE_BIS + 3 else ABDECKUNG
    if reihe == REIHE_FUSS and y >= LAGE:
        return STEIN_HELL if y == LAGE else UMRISS if y == K - 1 else SOCKEL
    # Lagen von LAGE Pixeln; die Kante endet mit einer ganzen Lage, darunter wechselt der Versatz.
    obere_lage = y < LAGE
    versetzt = obere_lage if reihe != REIHE_KANTE else False
    stelle = (x + (QUADER // 2 if versetzt else 0)) % QUADER
    in_lage = y % LAGE
    if in_lage == LAGE - 1 or stelle == QUADER - 1:
        return FUGE
    return STEIN_HELL if in_lage == (3 if reihe == REIHE_KANTE else 0) else STEIN


def _hangpixel(x: int, y: int, reihe: int, wiese: Farbe) -> Farbe:
    """Farbe der Böschung am Pixel (x, y): Kamm oben, Hang mit Halmen, dunklerer Fuß."""
    if reihe == REIHE_KANTE and y < DECKE_BIS + 2:
        return _getoent(wiese, KAMM if y == DECKE_BIS or x % 4 < 2 else HANG)
    for hx, hy in HALME:
        if (x, y) in ((hx, hy), (hx, (hy + 1) % K), ((hx + 1) % K, (hy + 2) % K)):
            return _getoent(wiese, STRICH)
    return _getoent(wiese, HANGFUSS if reihe == REIHE_FUSS and y >= HANGFUSS_AB else HANG)


def _wandkachel(
    art: str, reihe: int, stelle: int, grund: Image.Image, wiese: Farbe
) -> tuple[Image.Image, Image.Image]:
    """Eine Kachel der gezeichneten Art mit ihrer Wandmaske.

    ``stelle`` 0 links, 1 Mitte, 2 rechts. ``grund`` ist für die Kante die Fläche oben, für den Fuß
    die Fußkachel des Ausgangsbogens (ihre Grasbüschel am unteren Rand bleiben in der Böschung).
    """
    kachel, maske = grund.copy(), Image.new("L", (K, K), 0)
    px, wand = kachel.load(), maske.load()
    rand = {0: 0, 2: K - 1}.get(stelle)
    for y in range(DECKE_BIS if reihe == REIHE_KANTE else 0, K):
        for x in range(K):
            if art == "stuetzmauer":
                px[x, y] = UMRISS if x == rand else _mauerpixel(x, y, reihe)
            elif reihe == REIHE_FUSS and y >= K - STUFE and _gruen(px[x, y]):
                continue  # Grasbüschel am Fuß der Böschung bleiben
            else:
                px[x, y] = _getoent(wiese, HANGRAND) if x == rand else _hangpixel(x, y, reihe, wiese)
            wand[x, y] = DECKEND
    return kachel, maske


def _treppenkachel(art: str, wiese: Farbe) -> Image.Image:
    """Trittstufen aus Stein; in der Böschung bleibt links und rechts ein Streifen Hang stehen."""
    kachel = Image.new("RGBA", (K, K), UMRISS)
    px = kachel.load()
    rand = STUFENRAND if art == "boeschung" else 0
    for y in range(K):
        for x in range(K):
            if x < rand or x >= K - rand:
                px[x, y] = _hangpixel(x, y, REIHE_WAND, wiese)
            elif rand < x < K - rand - 1:
                px[x, y] = (STEIN_HELL, STEIN, STEIN, FUGE)[y % STUFE]
    return kachel


def _haeufigste(kachel: Image.Image) -> Farbe:
    farben = sorted(kachel.getcolors(K * K) or [(1, UMRISS)])
    return farben[-1][1]


def gezeichnet(
    art: str, vorlage: Image.Image, gelaende_maske: Image.Image
) -> tuple[Image.Image, Image.Image]:
    """Bogen und Wandmaske einer selbst gezeichneten Art („boeschung“, „stuetzmauer“).

    Eingaben: Art, Ausgangsbogen (Fläche oben, Rand und Grasfuß bleiben von dort), Wandmaske des
    Geländebogens. Ausgabe: (Bogen, Maske) in derselben Kachellage.
    Beispiel: Böschung über dem grünen Klippenbogen → Hang im Grün der Wiese oben, etwas dunkler.
    """
    bogen, maske = vorlage.copy(), gelaende_maske.copy()
    wiese = _haeufigste(vorlage.crop(_rahmen((SPALTEN["gras"][1], REIHE_OBEN))))
    for spalten in SPALTEN.values():
        for stelle, spalte in enumerate(spalten):
            for reihe in (REIHE_KANTE, REIHE_WAND, REIHE_FUSS):
                feld = (spalte, reihe)
                if vorlage.crop(_rahmen(feld)).getbbox() is None:
                    continue  # diese Fassung fehlt im Ausgangsbogen
                grund = vorlage.crop(_rahmen((spalte, REIHE_OBEN) if reihe == REIHE_KANTE else feld))
                kachel, wand = _wandkachel(art, reihe, stelle, grund, wiese)
                bogen.paste(kachel, _rahmen(feld)[:2])
                maske.paste(wand, _rahmen(feld)[:2])
    return mit_treppen(art, bogen), maske


def mit_treppen(art: str, bogen: Image.Image) -> Image.Image:
    """Die selbst gezeichneten Trittstufen der Art in den Bogen (im Grün der Wiese oben).

    Warum: Auch ein gezeichneter Bogen (Grasböschung von Gemini) hat keine eigenen Stufen; die
    Treppenkachel des Ausgangsbogens ist eine rotbraune Holztreppe und fiel im Hang heraus
    (Foto Bahndamm und Deich, Kartenregel 10.94).
    """
    wiese = _haeufigste(bogen.crop(_rahmen((SPALTEN["gras"][1], REIHE_OBEN))))
    for feld in TREPPE.values():
        bogen.paste(_treppenkachel(art, wiese), _rahmen(feld)[:2])
    return bogen


@cache
def _bogen(pfad: Path) -> Image.Image:
    return Image.open(pfad).convert("RGBA")


def kachelsatz(szene: dict, privat: Path) -> Kachelsatz:
    """Der Kachelsatz für die Höhen einer Szene.

    Eingaben: Szene (``fels``: „rot“, „gras“, „grau“, „boeschung“, „stuetzmauer“ oder nichts),
    privates Paket. Ausgabe: Bogen ohne halb durchsichtige Wandpixel, Wandmaske, Art, Umrissfarbe.
    Beispiel: Deich mit ``"fels": "boeschung"`` → gezeichneter Grashang über dem grünen Bogen.
    Sonderfall: Fehlt ein umgefärbter Bogen im Paket, gilt der Geländebogen (``klippenbogen``).
    """
    boegen = lade(INHALTE / "materialien.json")["boegen"]
    maske = wandmaske(_bogen(privat / boegen["gelaende"]))
    bogen = geheilt(_bogen(privat / boegen[klippenbogen(szene, privat)]))
    art = klippenart(szene)
    # Liegt ein gezeichneter Bogen für die Art vor (Grasböschung von Gemini), gilt er statt der
    # selbst gezeichneten Kacheln.
    if art != "fels" and klippenbogen(szene, privat) != "klippeBoeschung":
        bogen, maske = gezeichnet(art, bogen, maske)
    elif art != "fels":
        bogen = mit_treppen(art, bogen.copy())
    dunkelste = min(
        (p for p in bogen.crop(_rahmen((SPALTEN["erde"][0], REIHE_WAND))).get_flattened_data() if p[3]),
        key=lambda p: p[0] + p[1] + p[2],
        default=UMRISS,
    )
    return Kachelsatz(bogen, maske, art, dunkelste)

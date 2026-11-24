"""Weichrand: Ufer und Wegränder als geglätteter Umriss statt als Rand- und Eckkacheln (braucht Pillow).

Warum: Die Gutachter sahen an 27 Karten Ufer in rechtwinkligen Treppenstufen und an 43 Karten Wege,
die alle zwei, drei Kacheln um eine Kachel springen oder Pfeilspitzen bilden (Kartenblick
24.11.2026, M03 und M04). Die Kacheln von LimeZu können das nicht besser. Dieses Modul malt deshalb
nach dem Kachelbild die Ränder neu: Es nimmt den Umriss jeder Wasser- und Wegfläche, glättet ihn
(randzug.py), füllt ihn und zeichnet den Rand in LimeZus Farben hinein (randmaler.py).

Rolle im Gesamtbild: ``kartenbild.zeichne`` ruft ``weiche_raender`` nach Bodenvariation, Säumen und
Markierung auf, vor dem Winter. Was weich wird, entscheidet für Wasser ``uferart.weich`` (Kaimauern
bleiben Kacheln), für Wege jede Bodenart mit Randkacheln (``rand`` in materialien.json).

Begriffe: „offen“ ist ein Nachbarfeld, in das die Fläche ohne Rand weiterläuft (Steg, anderer
Belag, Fels); „Land“ ein Nachbarfeld, gegen das sie ihren Rand zeigt. Nur Felder am Rand werden neu
gemalt; die Mitte der Fläche bleibt, wie die Kacheln sie gezeichnet haben (Wellen, Körnung).
"""

from collections.abc import Callable
from dataclasses import dataclass, field

from PIL import Image

from pipeline.abenteuer.bodenraster import HOLZ_BOEDEN
from pipeline.abenteuer.kartenbau import WASSER, K, raster
from pipeline.abenteuer.randmaler import Ringe, landfarbe, maske, ringe, wasserfarbe, wegfarbe
from pipeline.abenteuer.randzug import flaeche, randzuege
from pipeline.abenteuer.saum import GRUEN
from pipeline.abenteuer.uferart import gezeichnetes_raster, uferart, weich

Feld = tuple[int, int]
ACHT = ((0, -1), (1, 0), (0, 1), (-1, 0), (1, 1), (-1, 1), (1, -1), (-1, -1))
# Watt ist dem Namen nach Wasser, im Raster aber ein Boden mit Rand wie Sand oder Erde.
WATT = "wasser_watt"


@dataclass
class Auftrag:
    """Eine Fläche, deren Rand neu gemalt wird."""

    felder: set[Feld]  # Felder der Fläche (Wasser oder eine Wegart)
    innen: Image.Image  # Kachel der Fläche (Wasser, Erde)
    stil: Callable[[str], str]  # Bodenart des Landes → Stil des Randes („gras“, „boden“, …)
    wasser: bool
    land: dict[Feld, str] = field(default_factory=dict)  # Landfelder am Rand → Bodenart
    offen: set[Feld] = field(default_factory=set)  # Nachbarfelder ohne Rand
    hart: set[Feld] = field(default_factory=set)  # Felder der Fläche, die Kacheln bleiben
    stirn: set[tuple[Feld, Feld]] = field(default_factory=set)  # feste Kanten (Wegende an der Tür)

    def fest(self, feld: Feld, richtung: Feld) -> bool:
        """Ob die Kante des Felds zu diesem Nachbarn bleibt, wo sie ist."""
        nachbar = (feld[0] + richtung[0], feld[1] + richtung[1])
        return feld in self.hart or nachbar not in self.land or (feld, richtung) in self.stirn


def _nachbarn(auftrag: Auftrag, gezeichnet: dict, ist_land: Callable[[str], bool]) -> None:
    """Trägt die Nachbarfelder der Fläche als Land oder offen ein.

    Felder ohne Eintrag in ``gezeichnet`` (Klippe, Felswand, Wandfläche) sind offen: Dort steht die
    Fläche am Fuß der Wand und hat keinen eigenen Rand.
    """
    for x, y in auftrag.felder:
        for dx, dy in ACHT:
            nachbar = (x + dx, y + dy)
            if nachbar in auftrag.felder:
                continue
            art = gezeichnet.get(nachbar, (None, None))[0]
            if art is not None and ist_land(art):
                auftrag.land[nachbar] = art
            else:
                auftrag.offen.add(nachbar)


def wasserauftrag(szene: dict, gezeichnet: dict, kachel_aus: Callable[[str], Image.Image]) -> Auftrag:
    """Der Auftrag für alles Wasser der Szene.

    Eingaben: Szene, ``gezeichnet`` aus ``kartenbild.hintergrund`` (Feld → (Bodenart, Kachel)),
    ``kachel_aus(bodenart)``: die Innenkachel einer Bodenart. Ausgabe: Auftrag; ``hart`` sind die
    Felder an Kaimauern und eigenen Ufern (``uferart.weich``) und die Felder unter einer Brücke
    (Szene „bruecken“): Dort läuft das Kachelufer gerade unter dem Brückenbild durch.
    Beispiel: Seeufer → Land sind Strand und Gras, offen der Steg; nichts ist hart.
    """
    zeilen, roh, bruecken = gezeichnetes_raster(szene), raster(szene), set(szene.get("bruecken", []))
    felder = {(x, y) for y, zeile in enumerate(zeilen) for x, z in enumerate(zeile) if z == WASSER}
    ufer = szene.get("ufer")
    auftrag = Auftrag(
        felder=felder,
        innen=kachel_aus(f"wasser_{ufer}" if ufer else "wasser"),
        stil=lambda art: uferart(ufer, art),
        wasser=True,
        hart={f for f in felder if not weich(szene, zeilen, *f) or roh[f[1]][f[0]] in bruecken},
    )
    _nachbarn(auftrag, gezeichnet, lambda art: art not in HOLZ_BOEDEN)
    return auftrag


def wegauftraege(
    szene: dict, gezeichnet: dict, boeden: dict, kachel_aus: Callable[[str], Image.Image]
) -> list[Auftrag]:
    """Je Bodenart mit Randkacheln (Erdweg, Sandplatz, Strand, Piste, Watt) ein Auftrag.

    Land ist für einen Weg der Grundboden, Gras, die Hecke am Rand (``wandart``) und was die Bodenart in
    ``rand_gegen`` nennt; alles andere (Pflaster, Wasser, Steg) ist offen, dort läuft der Weg ohne
    Rand weiter. Beispiel: Erdweg der Hütten → Land ist Gras, offen sind Steg und Steinplatte.
    Für das Watt ist jeder Boden Land außer Wasser und Holz (Raststätte am Wattenmeer: Vorher
    stieß es in Kachelstufen an den Strand).
    Sonderfall: Der Grundboden der Szene selbst bekommt keinen Auftrag.
    """
    grund = szene.get("boden", "gras")
    auftraege = []
    for art in sorted({a for a, _ in gezeichnet.values()}):
        angabe = boeden.get(art, {})
        if "rand" not in angabe or art == grund or (art.startswith("wasser") and art != WATT):
            continue
        gegen = {grund, szene.get("wandart"), *GRUEN, *angabe.get("rand_gegen", [])}
        auftrag = Auftrag(
            felder={f for f, (a, _) in gezeichnet.items() if a == art},
            innen=kachel_aus(art),
            stil=lambda land: "gras" if land in GRUEN else "schlicht",
            wasser=False,
        )
        # Watt liegt wie Wasser in der Landschaft: Sein Rand ist gegen jeden Boden weich.
        watt = art == WATT
        _nachbarn(
            auftrag, gezeichnet, lambda land, gegen=gegen, watt=watt: land in gegen or _watt_land(watt, land)
        )
        auftraege.append(auftrag)
    return auftraege


def _watt_land(watt: bool, land: str) -> bool:
    """Ob ``land`` für das Watt Land ist: alles außer Wasser und Holz (Steg)."""
    return watt and land not in HOLZ_BOEDEN and not land.startswith("wasser")


def _naechste_art(nachbarn: list[tuple[int, int, str]], u: int, v: int) -> str:
    """Die Bodenart des Landfelds, das dem Pixel (u, v) im Feld am nächsten liegt."""

    def abstand(eintrag: tuple[int, int, str]) -> int:
        dx, dy, _ = eintrag
        quer = u + 1 if dx < 0 else K - u if dx > 0 else 0
        hoch = v + 1 if dy < 0 else K - v if dy > 0 else 0
        return quer * quer + hoch * hoch

    return min(nachbarn, key=abstand)[2]


def _male_feld(px, r: Ringe, auftrag: Auftrag, feld: Feld, kacheln: Callable) -> None:
    """Malt ein Feld am Rand neu: Fläche innerhalb des Umrisses, Land außerhalb, dazu der Rand.

    Ein Feld der Fläche wird ganz neu gemalt (die alte Randkachel verschwindet), ein Landfeld nur,
    wo der Umriss hineinreicht oder Büschel am Rand stehen.
    """
    eigen = auftrag.land.get(feld)
    nachbarn = [
        (dx, dy, auftrag.land[n]) for dx, dy in ACHT if (n := (feld[0] + dx, feld[1] + dy)) in auftrag.land
    ]
    innen = kacheln(None)
    einheitlich = eigen or (nachbarn[0][2] if len({n[2] for n in nachbarn}) == 1 else None)
    for v in range(K):
        for u in range(K):
            x, y = feld[0] * K + u, feld[1] * K + v
            drin = r.drin(x, y)
            if eigen and not drin and not r.ferne(x, y):
                continue
            art = einheitlich or _naechste_art(nachbarn, u, v)
            stil = auftrag.stil(art)
            land = px[x, y] if eigen else kacheln(art)[u, v]
            if not drin:
                px[x, y] = landfarbe(r, x, y, land, stil)
            elif auftrag.wasser:
                px[x, y] = wasserfarbe(r, x, y, innen[u, v], land, stil)
            else:
                px[x, y] = wegfarbe(r, x, y, innen[u, v], stil)


def male(bild: Image.Image, auftrag: Auftrag, kachel_aus: Callable[[str], Image.Image]) -> int:
    """Malt den Rand eines Auftrags ins Bild; gibt die Zahl der neu gemalten Felder zurück.

    Eingaben: Bodenbild (K Pixel je Feld), Auftrag, ``kachel_aus`` wie in ``wasserauftrag``.
    Beispiel: Bach im Zedernwald, der alle drei Felder um eins nach rechts springt → ein Ufer,
    das schräg und leicht geschwungen läuft, mit Erdkante im Norden.
    Sonderfälle: Felder ohne Land in der Nachbarschaft und harte Felder bleiben unberührt.
    """
    frei = {
        f
        for f in auftrag.felder - auftrag.hart
        if any((f[0] + dx, f[1] + dy) in auftrag.land for dx, dy in ACHT)
    }
    if not frei:
        return 0
    zuege = randzuege(auftrag.felder, auftrag.fest)
    r = ringe(maske(bild.size, zuege, [flaeche(z) for z in zuege]), auftrag.offen)
    lager: dict[str | None, object] = {None: auftrag.innen.load()}

    def kacheln(art: str | None):
        if art not in lager:
            lager[art] = kachel_aus(art).load()
        return lager[art]

    am_rand = {n for f in frei for dx, dy in ACHT if (n := (f[0] + dx, f[1] + dy)) in auftrag.land}
    px = bild.load()
    for feld in sorted(frei) + sorted(am_rand):
        _male_feld(px, r, auftrag, feld, kacheln)
    return len(frei) + len(am_rand)


def weiche_raender(
    bild: Image.Image,
    szene: dict,
    gezeichnet: dict,
    boeden: dict,
    kachel_aus: Callable[[str], Image.Image],
    stirn: set[tuple[Feld, Feld]] = frozenset(),
) -> int:
    """Malt alle weichen Ränder einer Außenkarte: erst die Wege, dann das Wasser.

    Eingaben: Bodenbild nach Variation und Säumen, Szene, ``gezeichnet`` und Böden wie oben,
    ``kachel_aus(bodenart)`` für die Innenkachel, ``stirn``: Kanten von Wegenden an Tür oder Tor,
    die gerade bleiben (``treppenrand.stirnkanten``). Ausgabe: Zahl der neu gemalten Felder.
    Beispiel: Hütten am Long Ridge Trail → der Erdweg schwingt, der Bach hat schräge Ufer.
    Sonderfall: Innenkarten bleiben unverändert (0).
    """
    if szene.get("art") != "aussen":
        return 0
    gemalt = 0
    for auftrag in wegauftraege(szene, gezeichnet, boeden, kachel_aus):
        auftrag.stirn = set(stirn)
        gemalt += male(bild, auftrag, kachel_aus)
    return gemalt + male(bild, wasserauftrag(szene, gezeichnet, kachel_aus), kachel_aus)

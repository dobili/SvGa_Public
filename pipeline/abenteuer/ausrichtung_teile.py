"""Gesetzte Bilder als Teile mit Lage und Richtung: Grundlage der Ausrichtungsprüfung (``ausrichtung.py``).

Warum: Die Regeln von KARTENREGELN 10.78 fragen immer dasselbe: Wo liegt ein Bild, in welche Richtung
läuft oder schaut es, welche Bilder gehören zu derselben Anlage (Kegelbahn, Gleis) und liegt es an
deren Ende? Diese Fragen beantwortet ``Teil``; die Regeln selbst stehen in ``ausrichtung.py``.

Koordinaten: Kacheln, x nach rechts (Osten), y nach unten (Süden). Die Fußfläche eines Teils ist die
der Kartenregeln (``kartenregeln._felder``: bei hohen Bildern ohne die oberste Reihe).
"""

from dataclasses import dataclass, field
from pathlib import Path

from pipeline.abenteuer.kartenbau import K, platziere
from pipeline.abenteuer.kartenregeln import _felder
from pipeline.abenteuer.objektrichtung import ausgerichtet, form_von, katalogrichtung

RICHTUNG = {"unten": (0, 1), "oben": (0, -1), "links": (-1, 0), "rechts": (1, 0)}
GEGENSEITE = {
    "unten": "oben",
    "oben": "unten",
    "links": "rechts",
    "rechts": "links",
    "nord": "sued",
    "sued": "nord",
    "west": "ost",
    "ost": "west",
    "waagrecht": "senkrecht",
    "senkrecht": "waagrecht",
}
# Himmelsrichtung eines Endes → Schritt in Kacheln.
SEITE = {"nord": (0, -1), "sued": (0, 1), "west": (-1, 0), "ost": (1, 0)}
BLICK_ZU_ACHSE = {"unten": "senkrecht", "oben": "senkrecht", "links": "waagrecht", "rechts": "waagrecht"}
# Bei diesen Arten folgt die Laufrichtung aus ``blick`` (Fahrzeug von vorn: fährt Nord–Süd).
LAUF_AUS_BLICK = {"fahrzeug", "boot"}
# Eine Anlage gilt als gerichtet, wenn sie mindestens so viele Teile hat und so viel länger als breit ist.
ANLAGE_MINDEST = 3
ANLAGE_VERHAELTNIS = 2
# Höchstens so viele Kacheln unter einem Wandbild wird nach Boden gesucht (Wandfläche ist zwei hoch).
WANDTIEFE = 4


def lauf_von(angabe: dict) -> str | None:
    """Laufrichtung eines Bildes: ``lauf`` aus dem Katalog, bei Fahrzeugen und Booten aus ``blick``.

    Beispiel: ``Car_Down_4`` (blick unten) → „senkrecht“; ``kegelbahn_kugelfang`` → „senkrecht“;
    ein Stuhl → None (Stühle schauen, sie laufen nicht).
    """
    if angabe.get("lauf") in ("waagrecht", "senkrecht"):
        return angabe["lauf"]
    if angabe.get("art") in LAUF_AUS_BLICK:
        return BLICK_ZU_ACHSE.get(angabe.get("blick", ""))
    return None


@dataclass
class Teil:
    """Ein gesetztes Bild: Name, Katalogangabe, Pixelrechteck und die Angaben der Szene."""

    name: str
    angabe: dict
    stueck: dict
    an_wand: bool = False
    auf: bool = False
    nachbarn: list = field(default_factory=list)

    @property
    def kollision(self) -> bool:
        return bool(self.stueck["kollision"])

    @property
    def verbund(self) -> str | None:
        return self.angabe.get("verbund")

    @property
    def feld(self) -> tuple[int, int]:
        return self.stueck["x"] // K, self.stueck["y"] // K

    @property
    def flaeche(self) -> tuple[int, int, int, int]:
        """Fußfläche in Kacheln: links, oben, rechts, unten."""
        return _felder(self.stueck)

    @property
    def bildflaeche(self) -> tuple[int, int, int, int]:
        """Das ganze Bild in Kacheln: links, oben, rechts, unten."""
        s = self.stueck
        return s["x"] // K, s["y"] // K, (s["x"] + s["breite"] - 1) // K, (s["y"] + s["hoehe"] - 1) // K

    @property
    def mitte(self) -> tuple[float, float]:
        s = self.stueck
        return (s["x"] + s["breite"] / 2) / K, (s["y"] + s["hoehe"] / 2) / K

    @property
    def fuss(self) -> tuple[int, int]:
        """Feld unter der Mitte, eine halbe Kachel über der Unterkante (wie ``fahrzeuge.py``)."""
        s = self.stueck
        return (s["x"] + s["breite"] // 2) // K, (s["y"] + s["hoehe"] - 1 - K // 2) // K

    def abstand(self, anderes: "Teil") -> int:
        """Abstand der Fußflächen in Kacheln (0: überlappen, 1: berühren sich)."""
        a, b = self.flaeche, anderes.flaeche
        dx = max(0, b[0] - a[2], a[0] - b[2])
        dy = max(0, b[1] - a[3], a[1] - b[3])
        return max(dx, dy)

    def bildluecke(self, anderes: "Teil") -> int:
        """Lücke zwischen den Bildern in Pixeln (0, wenn sie sich überlappen oder berühren)."""
        a, b = self.stueck, anderes.stueck
        dx = max(0, b["x"] - (a["x"] + a["breite"]), a["x"] - (b["x"] + b["breite"]))
        dy = max(0, b["y"] - (a["y"] + a["hoehe"]), a["y"] - (b["y"] + b["hoehe"]))
        return max(dx, dy)

    def _zu(self, anderes: "Teil") -> tuple[float, float]:
        """Vektor von der Mitte der Fußfläche zur Mitte der Fußfläche des anderen Teils."""
        a, b = self.flaeche, anderes.flaeche
        return (b[0] + b[2]) / 2 - (a[0] + a[2]) / 2, (b[1] + b[3]) / 2 - (a[1] + a[3]) / 2

    def richtung_zu(self, anderes: "Teil") -> str:
        """Hauptrichtung (unten, oben, links, rechts) zum anderen Teil."""
        vx, vy = self._zu(anderes)
        if abs(vx) > abs(vy):
            return "rechts" if vx > 0 else "links"
        return "unten" if vy > 0 else "oben"

    def schaut_zu(self, anderes: "Teil", blick: str) -> bool:
        """Liegt das andere Teil vor der Vorderseite? Die Querabweichung darf die halbe Breite des
        anderen Teils plus eine Kachel nicht übersteigen (Stuhl schräg an einem langen Tisch)."""
        dx, dy = RICHTUNG[blick]
        vx, vy = self._zu(anderes)
        vorn = dx * vx + dy * vy
        b = anderes.flaeche
        halb = (b[2] - b[0]) / 2 if dy else (b[3] - b[1]) / 2
        quer = abs(vy) if dx else abs(vx)
        return vorn > 0 and quer <= halb + 1

    def schaut_weg_von(self, anderes: "Teil", blick: str) -> bool:
        dx, dy = RICHTUNG[blick]
        vx, vy = self._zu(anderes)
        return dx * vx + dy * vy < 0

    def seite_an(self, anderes: "Teil") -> str | None:
        """Auf welcher Seite des anderen Teils (unten, oben, links, rechts) liegt dieses Teil, wenn
        sich beide auf der anderen Achse überlappen? Sonst None (schräg daneben, etwa am Thekenende)."""
        a, b = self.flaeche, anderes.flaeche
        ueber_x = min(a[2], b[2]) >= max(a[0], b[0])
        ueber_y = min(a[3], b[3]) >= max(a[1], b[1])
        if ueber_x and not ueber_y:
            return "unten" if a[1] > b[3] else "oben"
        if ueber_y and not ueber_x:
            return "rechts" if a[0] > b[2] else "links"
        return None

    def randfelder(self, seite: str) -> list[tuple[int, int]]:
        """Die Felder direkt jenseits der Fußfläche auf einer Seite (nord, sued, west, ost)."""
        x0, y0, x1, y1 = self.flaeche
        if seite == "nord":
            return [(x, y0 - 1) for x in range(x0, x1 + 1)] + [(x, y0 - 2) for x in range(x0, x1 + 1)]
        if seite == "sued":
            return [(x, y1 + 1) for x in range(x0, x1 + 1)]
        spalte = x0 - 1 if seite == "west" else x1 + 1
        return [(spalte, y) for y in range(y0, y1 + 1)]

    def nachbarseiten(self, anlage: list["Teil"]) -> set[str]:
        """Seiten (nord, sued, west, ost), an denen ein anderes Teil der Anlage anliegt.

        Anliegen heißt: höchstens eine halbe Kachel Lücke und auf der anderen Achse überlappend.
        Beispiel: Kugelfang rechts neben dem Kegelsatz → {"west"}.
        """
        a = self.stueck
        seiten = set()
        for t in anlage:
            b = t.stueck
            if t is self or self.bildluecke(t) > K // 2:
                continue
            quer_y = min(a["y"] + a["hoehe"], b["y"] + b["hoehe"]) - max(a["y"], b["y"]) > 0
            quer_x = min(a["x"] + a["breite"], b["x"] + b["breite"]) - max(a["x"], b["x"]) > 0
            if quer_y and not quer_x:
                seiten.add("ost" if b["x"] > a["x"] else "west")
            elif quer_x and not quer_y:
                seiten.add("sued" if b["y"] > a["y"] else "nord")
        return seiten

    def oertliche_achse(self, anlage: list["Teil"]) -> str | None:
        """Achse aus den anliegenden Teilen: nur links/rechts → waagrecht, nur oben/unten → senkrecht.

        Örtlich statt über die ganze Anlage, damit Abzweige und Bögen eines Gleisnetzes nicht stören.
        """
        seiten = self.nachbarseiten(anlage)
        waag, senk = bool(seiten & {"west", "ost"}), bool(seiten & {"nord", "sued"})
        if waag and not senk:
            return "waagrecht"
        if senk and not waag:
            return "senkrecht"
        return None

    def liegt_am_ende(self, anlage: list["Teil"]) -> bool:
        """Liegt das Teil an dem Ende, das ``ende`` nennt? Ja, wenn dort kein Teil der Anlage anliegt."""
        return self.angabe["ende"] not in self.nachbarseiten(anlage)

    def ende_fuer(self, anlage: list["Teil"]) -> str | None:
        """Das Ende, das an dieser Stelle richtig wäre: die Gegenseite der anliegenden Teile (nur bei
        Teilen mit ``ende`` und Nachbarn auf genau einer Seite)."""
        seiten = self.nachbarseiten(anlage)
        if not self.angabe.get("ende") or len(seiten) != 1:
            return None
        return GEGENSEITE[next(iter(seiten))]

    def ueber_boden(self, zeilen: list[str]) -> bool:
        """Liegt unter dem Bild (bis WANDTIEFE Kacheln) in einer seiner Spalten Boden (Nordwand)?"""
        x0, _, x1, y1 = self.bildflaeche
        for x in range(max(0, x0), min(len(zeilen[0]) - 1, x1) + 1):
            for y in range(y1, min(len(zeilen), y1 + WANDTIEFE + 1)):
                if zeilen[y][x] not in {"#", " "}:
                    return True
        return False

    def an_seitenwand(self, zeilen: list[str]) -> bool:
        """Grenzt das Bild links oder rechts an Boden (es hängt an einer Seitenwand)?"""
        x0, y0, x1, y1 = self.bildflaeche
        for y in range(max(0, y0), min(len(zeilen) - 1, y1) + 1):
            for x in (x0 - 1, x1 + 1):
                if 0 <= x < len(zeilen[0]) and zeilen[y][x] not in {"#", " "}:
                    return True
        return False


def teile_der_szene(szene: dict, moebel: dict) -> list[Teil]:
    """Alle gesetzten Bilder einer Szene als Teile, mit ``an_wand`` und ``auf`` aus der Szene.

    Gedrehte und gespiegelte Bilder (Karteneditor) tragen Blick, Lauf und Ende so, wie sie auf der
    Karte liegen (``objektrichtung.ausgerichtet``), damit keine falschen Befunde zur Richtung entstehen.
    """
    eintraege = {e.get("id", f"{e['moebel']}@{i}"): e for i, e in enumerate(szene.get("objekte", []))}
    teile = []
    for s in platziere(szene, moebel)[0]:
        eintrag = eintraege.get(s["id"], {})
        angabe = ausgerichtet(moebel.get(s["name"], {}), s)
        teile.append(Teil(s["name"], angabe, s, bool(eintrag.get("an_wand")), "auf" in eintrag))
    return teile


def anlagen(teile: list[Teil]) -> list[list[Teil]]:
    """Teile desselben Verbunds, deren Bilder höchstens eine Kachel auseinander liegen, als Anlagen."""
    rest = [t for t in teile if t.verbund]
    ergebnis = []
    while rest:
        anlage, offen = [], [rest.pop()]
        while offen:
            teil = offen.pop()
            anlage.append(teil)
            nah = [t for t in rest if t.verbund == teil.verbund and teil.bildluecke(t) <= K]
            for t in nah:
                rest.remove(t)
            offen += nah
        ergebnis.append(anlage)
    return ergebnis


def achse_der_anlage(anlage: list[Teil]) -> str | None:
    """Richtung einer Anlage aus ihrer Ausdehnung (alle Bilder), None bei kleinen oder runden.

    Beispiel: 13 Bandenstücke, Kegel und Kugel über 15 × 3 Kacheln → „waagrecht“.
    """
    if len(anlage) < ANLAGE_MINDEST:
        return None
    x0 = min(t.bildflaeche[0] for t in anlage)
    y0 = min(t.bildflaeche[1] for t in anlage)
    x1 = max(t.bildflaeche[2] for t in anlage)
    y1 = max(t.bildflaeche[3] for t in anlage)
    breite, hoehe = x1 - x0 + 1, y1 - y0 + 1
    if breite >= ANLAGE_VERHAELTNIS * hoehe:
        return "waagrecht"
    if hoehe >= ANLAGE_VERHAELTNIS * breite:
        return "senkrecht"
    return None


# Privates Paket für die Suche nach Varianten im Bestand (``--privat``); ohne Paket keine Suche.
PRIVAT_PAKET: list[Path | None] = [None]


@dataclass
class Befund:
    """Ein Befund: Karte, Möbel, Feld (Kachel links oben), Text und Vorschlag."""

    karte: str
    moebel: str
    feld: tuple[int, int]
    text: str
    vorschlag: str = ""

    def __str__(self) -> str:
        zusatz = f" Vorschlag: {self.vorschlag}" if self.vorschlag else ""
        return f"{self.karte} {self.moebel} {self.feld}: {self.text}.{zusatz}"


def variante(teil: Teil, richtung: str) -> str:
    """Vorschlag mit dem Bild einer anderen Richtung aus ``varianten``, sonst ein Hinweis darauf.

    Sonderfälle: Ist das Bild gedreht oder gespiegelt, gelten die Varianten des Katalogs in seiner
    Richtung (``katalogrichtung``), und der Vorschlag nennt auch das Drehen im Editor. Eine
    Bodenkachel aus einem Bogen (``ausschnitt``) hat keine Varianten im Bestand.
    """
    form = form_von(teil.stueck)
    if form.get("drehung") or form.get("spiegeln"):
        return (
            f"im Karteneditor drehen oder spiegeln, bis es {richtung} zeigt "
            f"(Katalogbild der Richtung {katalogrichtung(richtung, form)})"
        )
    varianten = teil.angabe.get("varianten", {})
    if richtung in varianten:
        return f"Bild der Richtung {richtung} nehmen: {varianten[richtung]}"
    from pipeline.abenteuer.katalogausrichtung import varianten_im_bestand

    quelle = "" if "ausschnitt" in teil.angabe else teil.angabe.get("quelle", "")
    bestand = varianten_im_bestand(quelle, PRIVAT_PAKET[0])
    if bestand:
        return (
            f"Bild der Richtung {richtung} wählen, im Bestand: {', '.join(Path(b).name for b in bestand[:4])}"
        )
    return f"Bild der Richtung {richtung} suchen oder zeichnen (im Katalog keine Variante)"

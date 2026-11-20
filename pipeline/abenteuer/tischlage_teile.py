"""Gesetzte Bilder mit Lage, Platte und deckender Fläche: Grundlage der Prüfung ``tischlage.py``.

Warum: Die Regeln von KARTENREGELN 10.79 fragen immer dasselbe: Wo liegt ein Bild in Pixeln der
Karte, wo ist die Tischplatte (Katalogangabe ``platte``), welche Fläche des Bilds deckt wirklich
(ohne durchsichtigen Rand), welche Tischstücke bilden einen Langtisch und wo sind die Plätze? Diese
Fragen beantworten ``Stueck`` und die Hilfen hier; die Regeln selbst stehen in ``tischlage.py``.

Koordinaten: Pixel der Karte, x nach rechts (Osten), y nach unten (Süden).
"""

import re
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.kartenbau import K, platziere
from pipeline.abenteuer.objektrichtung import ausgerichtet, formschluessel

# Bilddateien von Brettern und Uhren (Dateiname beginnt so).
BRETT = re.compile(r"^schachbrett")
UHR = re.compile(r"^schachuhr")
HOCKER = re.compile(r"hocker", re.I)
# Unterlagen, die eine Platte brauchen, wenn etwas Spielbares darauf liegt.
TISCHARTEN = {"tisch", "schreibtisch", "tresen", "theke"}
# Privates Grafikpaket für die deckende Fläche (``--privat``, sonst neben dem Repository, wenn es
# da ist); None: ganzes Bild. Eine Liste, damit Prüfung und Tests den Wert setzen können.
_NEBEN = Path(__file__).resolve().parents[3] / "schach-abenteuer-inhalte"
BESTAND: list[Path | None] = [_NEBEN if (_NEBEN / "spiel").exists() else None]
_DECKEND: dict[tuple, tuple[int, int, int, int] | None] = {}

Rechteck = tuple[float, float, float, float]


@dataclass
class Stueck:
    """Ein gesetztes Bild mit Katalogangabe und Szeneneintrag (Lage in Pixeln der Karte)."""

    angabe: dict
    s: dict
    eintrag: dict

    @property
    def name(self) -> str:
        return self.s["name"]

    @property
    def datei(self) -> str:
        return self.angabe.get("quelle", "").split("/")[-1]

    @property
    def feld(self) -> tuple[int, int]:
        return self.s["x"] // K, self.s["y"] // K

    @property
    def rahmen(self) -> Rechteck:
        s = self.s
        return s["x"], s["y"], s["x"] + s["breite"], s["y"] + s["hoehe"]

    @property
    def deckend(self) -> Rechteck:
        """Deckende Fläche (Bildinhalt ohne durchsichtigen Rand), ohne Grafikpaket das ganze Bild.
        Mit Ausschnitt (Bodenkachel) und Form (gedreht, gespiegelt, skaliert) wie auf der Karte."""
        ausschnitt = tuple(self.angabe["ausschnitt"]) if "ausschnitt" in self.angabe else None
        innen = _deckend_im_bild(self.angabe.get("quelle", ""), ausschnitt, formschluessel(self.s))
        if innen is None:
            return self.rahmen
        return self.s["x"] + innen[0], self.s["y"] + innen[1], self.s["x"] + innen[2], self.s["y"] + innen[3]

    @property
    def platte(self) -> Rechteck | None:
        p = self.angabe.get("platte")
        return (
            None
            if not p
            else (self.s["x"] + p[0], self.s["y"] + p[1], self.s["x"] + p[2], self.s["y"] + p[3])
        )

    def versatz_plus(self, dx: float, dy: float) -> str:
        alt = self.eintrag.get("versatz", [0, 0])
        return f"versatz [{alt[0] + round(dx)}, {alt[1] + round(dy)}]"


def _deckend_im_bild(
    quelle: str, ausschnitt: tuple[int, ...] | None = None, form: tuple = ()
) -> tuple[int, int, int, int] | None:
    """Begrenzungsrechteck der deckenden Pixel eines Bilds im privaten Paket (zwischengespeichert).

    ``ausschnitt``: Teil eines Bogens (Bodenkacheln, ``bodenkacheln.json``); ``form``: Drehung,
    Spiegeln, Maßstab (``objektrichtung.formschluessel``), gerechnet mit ``objektform.formbild``.
    """
    if BESTAND[0] is None or not quelle:
        return None
    schluessel = (quelle, ausschnitt, form)
    if schluessel not in _DECKEND:
        pfad = BESTAND[0] / quelle
        if not pfad.exists():
            _DECKEND[schluessel] = None
        else:
            from PIL import Image

            from pipeline.abenteuer.objektform import formbild

            with Image.open(pfad) as roh:
                bild = roh.convert("RGBA")
            bild = formbild(bild.crop(ausschnitt) if ausschnitt else bild, dict(form))
            _DECKEND[schluessel] = bild.getchannel("A").point(lambda a: 255 if a > 128 else 0).getbbox()
    return _DECKEND[schluessel]


def mitte(r: Rechteck) -> tuple[float, float]:
    """Mittelpunkt eines Rechtecks (x0, y0, x1, y1)."""
    return (r[0] + r[2]) / 2, (r[1] + r[3]) / 2


def vereinige(rechtecke: list[Rechteck]) -> Rechteck:
    """Kleinstes Rechteck, das alle umfasst."""
    return (
        min(r[0] for r in rechtecke),
        min(r[1] for r in rechtecke),
        max(r[2] for r in rechtecke),
        max(r[3] for r in rechtecke),
    )


def stuecke_der_szene(szene: dict, moebel: dict) -> list[Stueck]:
    """Alle gesetzten Bilder einer Szene mit ihrem Szeneneintrag; die Angabe so, wie das Bild auf der
    Karte liegt (Platte und Blick gedreht und gespiegelt, ``objektrichtung.ausgerichtet``)."""
    eintraege = {e.get("id", f"{e['moebel']}@{i}"): e for i, e in enumerate(szene.get("objekte", []))}
    return [
        Stueck(ausgerichtet(moebel.get(s["name"], {}), s), s, eintraege.get(s["id"], {}))
        for s in platziere(szene, moebel)[0]
    ]


def tischgruppen(stuecke: list[Stueck]) -> list[list[Stueck]]:
    """Tische mit Platte, deren Platten lückenlos nebeneinanderliegen, als ein Tisch (Langtisch).

    Beispiel Raststätte Crossroads: Anfang, drei Mittelstücke und Ende ergeben eine Platte.
    """
    rest = [t for t in stuecke if t.platte and "auf" not in t.eintrag]
    gruppen = []
    while rest:
        gruppe, offen = [], [rest.pop()]
        while offen:
            t = offen.pop()
            gruppe.append(t)
            nah = [u for u in rest if _platten_beruehren(t.platte, u.platte)]
            for u in nah:
                rest.remove(u)
            offen += nah
        gruppen.append(sorted(gruppe, key=lambda t: t.s["x"]))
    return gruppen


def _platten_beruehren(a: Rechteck, b: Rechteck) -> bool:
    gleiche_hoehe = abs(a[1] - b[1]) <= 1 and abs(a[3] - b[3]) <= 1
    return gleiche_hoehe and (abs(a[2] - b[0]) <= 1 or abs(b[2] - a[0]) <= 1)


def plaetze(platte: Rechteck, anzahl: int) -> list[tuple[float, float]]:
    """Mitten von ``anzahl`` gleichen Plätzen längs der Platte.

    Beispiel: Platte 4..57 × 10..25 mit zwei Brettern → (17,25 | 17,5) und (43,75 | 17,5).
    """
    x0, y0, x1, y1 = platte
    if x1 - x0 >= y1 - y0:
        schritt = (x1 - x0) / anzahl
        return [(x0 + (i + 0.5) * schritt, (y0 + y1) / 2) for i in range(anzahl)]
    schritt = (y1 - y0) / anzahl
    return [((x0 + x1) / 2, y0 + (i + 0.5) * schritt) for i in range(anzahl)]


def ist_tisch(st: Stueck) -> bool:
    """Tisch im Sinn der Regel: Art Tisch, Schreibtisch, Tresen, Theke, oder ein Bild mit ``platte``."""
    return st.angabe.get("art") in TISCHARTEN or bool(st.angabe.get("platte"))


def _sitzplaetze(
    tisch: Stueck, breite: Rechteck, anzahl: int, stuhlbreite: float
) -> list[tuple[float, float]]:
    """Plätze für Stühle oben oder unten: ``plaetze`` aus dem Katalog (Mitten in Pixeln des Bilds,
    etwa die zwei Bildschirme des Bildschirmtischs), wenn es so viele Stühle sind, sonst gleich geteilt.

    Sonderfall: Sind die gleichen Plätze schmaler als ein Stuhl (zwei Stühle an einem kleinen
    Rundtisch), stehen die Stühle Seite an Seite mittig vor der Platte.
    """
    eigene = tisch.angabe.get("plaetze", [])
    if len(eigene) == anzahl:
        return [(tisch.s["x"] + x, breite[1]) for x in eigene]
    gleich = plaetze(breite, anzahl)
    if anzahl > 1 and gleich[1][0] - gleich[0][0] < stuhlbreite:
        mx = (breite[0] + breite[2]) / 2
        return [(mx + (i - (anzahl - 1) / 2) * stuhlbreite, breite[1]) for i in range(anzahl)]
    return gleich

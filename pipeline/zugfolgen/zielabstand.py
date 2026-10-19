"""Abstand einer Stellung zu einer Zielstellung: wie viele Züge fehlen ungefähr noch?

Wozu diese Datei da ist:
    Die Suche nach konstruierten Partien (``pipeline/zugfolgen/konstruktion.py``, Entscheidung des
    Autors vom 18.10.2026) braucht eine Schätzung, welche Stellung der Abbildung näher ist. Jede
    Figur des Ziels bekommt genau eine passende Figur der Stellung zugeordnet (kleinste Summe der
    Wege); was übrig bleibt, muss geschlagen werden. Bauern ziehen nur vorwärts und wechseln die
    Linie nur durch Schlagen; ein Zielbauer, den kein Bauer mehr erreicht, macht das Ziel
    unerreichbar. Reine Rechnung ohne Engine.

Beispiel:
    Grundstellung gegen Abb. 8.25 (König e2, Bauer e4 gegen König e8): der e-Bauer braucht zwei
    Züge, der König einen; 30 Steine sind zu viel.
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

import chess

UNERREICHBAR = 99
# Gewicht je überzähligem Stein: Er muss im Tausch verschwinden, das kostet mindestens zwei Züge.
GEWICHT_UEBERZAHL = 4
# Gewicht je Zielstein ohne passende Quelle: praktisch eine Sackgasse.
GEWICHT_FEHLT = 40
# Ein Linienwechsel des Bauern verlangt einen Schlag; zählt mehr als ein einfacher Schritt.
GEWICHT_LINIENWECHSEL = 3
WERT = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}


def _springertabelle() -> tuple[tuple[int, ...], ...]:
    """Kürzeste Springerwege zwischen allen Feldern (Breitensuche)."""
    tabelle = []
    for start in chess.SQUARES:
        weite = [UNERREICHBAR] * 64
        weite[start] = 0
        rand = [start]
        while rand:
            naechste = []
            for feld in rand:
                for ziel in chess.SquareSet(chess.BB_KNIGHT_ATTACKS[feld]):
                    if weite[ziel] == UNERREICHBAR:
                        weite[ziel] = weite[feld] + 1
                        naechste.append(ziel)
            rand = naechste
        tabelle.append(tuple(weite))
    return tuple(tabelle)


_SPRINGER = _springertabelle()


def figurenweg(typ: int, von: int, nach: int) -> int:
    """Züge einer Figur von ``von`` nach ``nach`` auf leerem Brett (Läufer: Feldfarbe zählt).

    Beispiel: Läufer c1 → h6 ein Zug, c1 → c3 zwei Züge, c1 → c2 unerreichbar.
    """
    if von == nach:
        return 0
    linien = abs(chess.square_file(von) - chess.square_file(nach))
    reihen = abs(chess.square_rank(von) - chess.square_rank(nach))
    if typ == chess.KNIGHT:
        return _SPRINGER[von][nach]
    if typ == chess.KING:
        return max(linien, reihen)
    gerade = linien == 0 or reihen == 0
    schraeg = linien == reihen
    if typ == chess.BISHOP:
        return UNERREICHBAR if (linien + reihen) % 2 else (1 if schraeg else 2)
    if typ == chess.ROOK:
        return 1 if gerade else 2
    return 1 if gerade or schraeg else 2


def bauernweg(farbe: chess.Color, von: int, nach: int) -> int:
    """Züge eines Bauern; Linienwechsel nur schräg nach vorn (je ein Schlag), sonst unerreichbar.

    Beispiel: Weiß e2 → e4 zwei Züge; e2 → d3 ein Schlag (Gewicht 3 + 1); e4 → e2 unerreichbar.
    """
    linien = abs(chess.square_file(von) - chess.square_file(nach))
    vor = chess.square_rank(nach) - chess.square_rank(von)
    if farbe == chess.BLACK:
        vor = -vor
    if vor < linien:
        return UNERREICHBAR
    return vor + GEWICHT_LINIENWECHSEL * linien


@lru_cache(maxsize=200_000)
def zuordnung(kosten: tuple[tuple[int, ...], ...]) -> tuple[int, int, int]:
    """Kleinste Summe einer eindeutigen Zuordnung Ziel → Quelle (Bitmaske über die Quellen).

    Ausgabe: (Summe der erreichbaren Wege, Zahl der Ziele ohne erreichbare Quelle, Maske der
    benutzten Quellen). Sonderfall: mehr Ziele als Quellen → die übrigen zählen als „ohne Quelle“.
    Beispiel: Ziele e4, d4, Quellen e2, d2 → Summe 4, kein Ziel offen, Maske 0b11.
    """
    beste: dict[int, tuple[int, int]] = {0: (0, 0)}
    for zeile in kosten:
        neu: dict[int, tuple[int, int]] = {}
        for maske, (offen, summe) in beste.items():
            _merke(neu, maske, (offen + 1, summe))
            for j, k in enumerate(zeile):
                if k < UNERREICHBAR and not maske & (1 << j):
                    _merke(neu, maske | (1 << j), (offen, summe + k))
        beste = neu
    maske, (offen, summe) = min(beste.items(), key=lambda eintrag: eintrag[1])
    return summe, offen, maske


def _merke(tabelle: dict[int, tuple[int, int]], maske: int, wert: tuple[int, int]) -> None:
    if maske not in tabelle or wert < tabelle[maske]:
        tabelle[maske] = wert


@dataclass(frozen=True)
class Abstand:
    """Ergebnis der Schätzung: Wege, überzählige Steine, Zielsteine ohne Quelle, Wert der Überzahl."""

    wege: int
    ueberzahl: int
    fehlt: int
    # Wert der überzähligen Steine je Seite (Bauerneinheiten); sie müssen vom Brett.
    ueberschuss_weiss: int = 0
    ueberschuss_schwarz: int = 0

    @property
    def summe(self) -> int:
        return self.wege + GEWICHT_UEBERZAHL * self.ueberzahl + GEWICHT_FEHLT * self.fehlt

    def abzugeben(self, farbe: chess.Color) -> int:
        """Wert, den ``farbe`` ohne Gegenwert hergeben muss: ihre Überzahl über der des Gegners."""
        eigen, fremd = self.ueberschuss_weiss, self.ueberschuss_schwarz
        if farbe == chess.BLACK:
            eigen, fremd = fremd, eigen
        return eigen - fremd

    def ueberschuss(self, farbe: chess.Color) -> int:
        return self.ueberschuss_weiss if farbe == chess.WHITE else self.ueberschuss_schwarz


# Schlagweg: Ein überzähliger Stein soll verschwinden; die nächste gegnerische Figur (König
# eingeschlossen) zählt mit ihrem Weg dorthin, höchstens so viele Züge je Stein.
SCHLAGWEG_HOECHSTENS = 4
# Nur im Endspiel, wenn höchstens so viel Überzähliges (Bauerneinheiten, beide Seiten) bleibt;
# vorher lockt der Schlagweg Figuren zu früh auf Materialjagd (gemessen an Abb. 8.25 und 9.24).
# 12 statt 4: Zwei überzählige Türme sollen sich zum Tausch suchen (Abb. 8.26 schob sie sonst
# fünfzig Züge hin und her).
SCHLAGWEG_AB = 12


def abstand(brett: chess.Board, ziel: chess.Board) -> Abstand:
    """Schätzt den Abstand der Stellung zum Ziel (ohne Zugrecht; das prüft die Suche).

    Beispiel: Grundstellung gegen sich selbst → Abstand 0.
    """
    wege = ueberzahl = fehlt = 0
    ueberschuss = {chess.WHITE: 0, chess.BLACK: 0}
    uebrig: list[tuple[chess.Color, int]] = []
    for farbe in chess.COLORS:
        for typ in chess.PIECE_TYPES:
            soll = tuple(ziel.pieces(typ, farbe))
            ist = tuple(brett.pieces(typ, farbe))
            summe, offen, maske = _teilabstand(typ, farbe, soll, ist)
            frei = [feld for j, feld in enumerate(ist) if not maske & (1 << j)]
            wege += summe
            fehlt += offen
            ueberzahl += len(frei)
            ueberschuss[farbe] += WERT[typ] * len(frei)
            uebrig.extend((farbe, feld) for feld in frei)
    if ueberschuss[chess.WHITE] + ueberschuss[chess.BLACK] <= SCHLAGWEG_AB:
        wege += sum(_schlagweg(brett, farbe, feld) for farbe, feld in uebrig)
    return Abstand(wege, ueberzahl, fehlt, ueberschuss[chess.WHITE], ueberschuss[chess.BLACK])


def _schlagweg(brett: chess.Board, farbe: chess.Color, feld: int) -> int:
    """Weg der nächsten gegnerischen Figur zum überzähligen Stein auf ``feld`` (gedeckelt)."""
    beste = SCHLAGWEG_HOECHSTENS
    for typ in (chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN, chess.KING):
        for von in brett.pieces(typ, not farbe):
            beste = min(beste, figurenweg(typ, von, feld))
    return beste


@lru_cache(maxsize=400_000)
def _teilabstand(
    typ: int, farbe: chess.Color, soll: tuple[int, ...], ist: tuple[int, ...]
) -> tuple[int, int, int]:
    if not soll or not ist:
        return 0, len(soll), 0
    if typ == chess.PAWN:
        kosten = tuple(tuple(bauernweg(farbe, q, z) for q in ist) for z in soll)
    else:
        kosten = tuple(tuple(figurenweg(typ, q, z) for q in ist) for z in soll)
    return zuordnung(kosten)

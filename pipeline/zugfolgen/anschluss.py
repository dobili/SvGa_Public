"""Anschlusssuche: An welcher Stellung setzt eine Zugfolge des Textes an?

Wozu diese Datei da ist:
    Der Nachspieler (``nachspielen.py``) bekommt Zugfolgen in Textreihenfolge. Für jede sucht
    diese Klasse die Stellung, an der sie weitergeht: eine Abbildung, die Spitze der zuletzt
    gespielten Variante, ein Knoten eines Beispiels oder eine neue Wurzel. Die Reihenfolge der
    Kandidaten steht im Dateikopf von ``nachspielen.py``.

Lösungen der Übungen:
    Eine Lösung bleibt im Baum ihrer Übung. Ihre Zugnummern zählen oft ab der Übung („1. Dd8+!!“
    in Abb. 7.56, deren FEN bei Zug 9 steht); deshalb gilt dort auch die relative Zugnummer.
"""

from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass

import chess

from pipeline.lesen.zugfolgen import Zug, Zugfolge
from pipeline.zugfolgen.baum import Beispiel, Knoten, stellungsschluessel

GRUNDSTELLUNG = chess.STARTING_FEN
_UEBUNGSKONTEXTE = ("loesung", "uebung")


@dataclass
class Abbildungsstellung:
    """Eine Abbildung des Kapitels, soweit das Nachspielen sie braucht."""

    nummer: str
    fen: str
    position: int  # Zeichenposition im Kapitel
    abschnitt: str | None
    titel: str  # Abschnitts- oder Unterabschnittstitel, für den Namen des Beispiels
    unterschriftszuege: list[Zug] | None  # „Nach 4. Sc3! Lc5 5. Sd5!“
    fundstelle: str
    # Beginnt die Unterschrift mit „Nach …“? Sonst stehen die Züge mitten im Satz („… Matt nach
    # 1. Te8#“) und beschreiben oft, was folgt; dann zählen sie nur, wenn sie die Stellung erreichen.
    unterschrift_am_anfang: bool = True

    @property
    def schluessel(self) -> str:
        return stellungsschluessel(chess.Board(self.fen))


@dataclass
class Anschluss:
    """Ein möglicher Anschluss: ein vorhandener Knoten oder eine neue Wurzel."""

    knoten: Knoten | None
    wurzel_fen: str | None = None
    wurzel_abbildung: Abbildungsstellung | None = None
    nummer_weicht_ab: bool = False
    fremd: bool = False  # Knoten eines früheren Kapitels
    versatz: int = 0  # Zugnummer der Übung minus 1, für relative Zählung in Lösungen

    def brett(self) -> chess.Board:
        return self.knoten.brett if self.knoten else chess.Board(self.wurzel_fen)


class Anschlusssuche:
    """Kandidaten und Wahl des Anschlusses; der Nachspieler erbt davon und hält den Zustand."""

    abbildungen: list[Abbildungsstellung]
    uebungen: dict[str, list[str]]
    fruehere: list[Beispiel]
    beispiele: list[Beispiel]
    _nach_nummer: dict[str, Abbildungsstellung]
    _verknuepft: dict[str, Knoten]
    _spitze: Knoten | None
    _nebenlinie: Knoten | None
    _letzte_abbildung: Abbildungsstellung | None
    _aktuell: Beispiel | None

    def _waehle_anschluss(self, zugfolge: Zugfolge, ziel: Abbildungsstellung | None) -> Anschluss | None:
        """Der erste Anschluss, an dem alle Züge legal sind; sonst der erste mit legalem ersten Zug.

        Nennt der Text eine Zielabbildung, gewinnt unter den vollständig legalen Anschlüssen der,
        der zu ihrer Stellung führt. Anschlüsse in früheren Kapiteln zählen nur vollständig legal.
        """
        erster = zugfolge.zuege[0]
        zielschluessel = self._zielschluessel(zugfolge, ziel)
        # Ein Einzelzug und jede Zugfolge in Übung oder Lösung muss die Zugnummer treffen (dort
        # auch ab der Übung gezählt); sonst landete etwa „4... Se7“ aus der Aufgabe zu Abb. 4.55
        # an einer beliebigen Stellung mit schwarzem Springerzug.
        in_uebung = zugfolge.kontext in _UEBUNGSKONTEXTE
        stufen = (True,) if in_uebung or (len(zugfolge.zuege) == 1 and ziel is None) else (True, False)
        for streng in stufen:
            passende = [k for k in self._kandidaten(zugfolge, ziel) if self._passt(k, erster, streng)]
            # Anschlüsse, an denen auch jedes „+“ stimmt, zuerst. Ein Einzelzug ohne „+“, der dort
            # Schach gäbe, gehört nicht dorthin („3. Lb5“ gegen 2... Sc6, nicht nach 2... d6).
            if len(zugfolge.zuege) == 1 and ziel is None:
                passende = [k for k in passende if self._schachzeichen_stimmen(k.brett(), zugfolge.zuege)]
            vollstaendig = [
                k for k in passende if self._legale_zuege(k.brett(), zugfolge.zuege) == len(zugfolge.zuege)
            ]
            vollstaendig.sort(key=lambda k: not self._schachzeichen_stimmen(k.brett(), zugfolge.zuege))
            if zielschluessel is not None:
                treffer = next(
                    (k for k in vollstaendig if self._endschluessel(k, zugfolge) == zielschluessel), None
                )
                if treffer is not None:
                    return self._markiere(treffer, not streng)
            if vollstaendig:
                return self._markiere(vollstaendig[0], not streng)
            teilweise = next(
                (k for k in passende if not k.fremd and self._legale_zuege(k.brett(), zugfolge.zuege) > 0),
                None,
            )
            if teilweise is not None:
                return self._markiere(teilweise, not streng)
        return None

    @staticmethod
    def _markiere(anschluss: Anschluss, nummer_weicht_ab: bool) -> Anschluss:
        anschluss.nummer_weicht_ab = nummer_weicht_ab
        return anschluss

    def _zielschluessel(self, zugfolge: Zugfolge, ziel: Abbildungsstellung | None) -> str | None:
        """Stellung, zu der die Zugfolge laut Text führt: die Unterschrift-Abbildung oder „(\\abb{X})“."""
        abbildung = ziel or (self._nach_nummer.get(zugfolge.ziel) if zugfolge.ziel else None)
        return abbildung.schluessel if abbildung else None

    def _erreicht(self, anschluss: Anschluss, zugfolge: Zugfolge, ziel: Abbildungsstellung) -> bool:
        """Die ganze Zugfolge ist ab dem Anschluss legal und endet in der Stellung der Abbildung."""
        if self._legale_zuege(anschluss.brett(), zugfolge.zuege) != len(zugfolge.zuege):
            return False
        return self._endschluessel(anschluss, zugfolge) == ziel.schluessel

    @staticmethod
    def _endschluessel(anschluss: Anschluss, zugfolge: Zugfolge) -> str:
        probe = anschluss.brett().copy()
        for zug in zugfolge.zuege:
            probe.push_san(zug.san)  # vorher als vollständig legal geprüft
        return stellungsschluessel(probe)

    def _kandidaten(self, zugfolge: Zugfolge, ziel: Abbildungsstellung | None) -> Iterator[Anschluss]:
        """Alle Anschlüsse in der Reihenfolge aus dem Dateikopf, ohne Dubletten."""
        gesehen: set[int | tuple[str | None, int]] = set()

        def einmal(anschluss: Anschluss) -> Iterator[Anschluss]:
            kennung = (
                id(anschluss.knoten)
                if anschluss.knoten
                else (anschluss.wurzel_fen, id(anschluss.wurzel_abbildung))
            )
            if kennung not in gesehen and not self._fremde_uebung(anschluss, zugfolge):
                gesehen.add(kennung)
                yield anschluss

        uebung = self._uebungsanschluesse(zugfolge) if zugfolge.kontext in _UEBUNGSKONTEXTE else []
        uebungsknoten = self._uebungsknoten(zugfolge) if uebung else []
        loesung = zugfolge.kontext == "loesung"
        # Eine Lösung beginnt am Übungsdiagramm; der Aufgabentext erzählt dagegen oft die
        # Vorgeschichte („… auf 4. Sf3 mit 4... e6. In Abb. 2.151 hat Weiß 4. h4 gespielt“): Dort
        # geht die laufende Linie vor, das Diagramm kommt nach der Spitze.
        for anschluss in [*uebung, *uebungsknoten] if loesung else uebungsknoten:
            yield from einmal(anschluss)
        if uebungsknoten and loesung:
            return  # Eine Lösung bleibt im Baum ihrer Übung; sonst lieber „ohne Anschluss“.
        for nummer in zugfolge.verweise:
            abbildung = self._nach_nummer.get(nummer)
            if abbildung and abbildung is not ziel:
                yield from einmal(self._anschluss_an(abbildung))
        if self._nebenlinie is not None and self._setzt_nebenlinie_fort(zugfolge):
            yield from einmal(Anschluss(self._nebenlinie))
        if self._spitze is not None:
            yield from einmal(Anschluss(self._spitze))
        if not loesung:
            for anschluss in uebung:
                yield from einmal(anschluss)
        if self._letzte_abbildung is not None and self._letzte_abbildung is not ziel:
            yield from einmal(self._anschluss_an(self._letzte_abbildung))
        eigene = [b for b in self._beispiele_nach_aktualitaet() if b.abschnitt == zugfolge.abschnitt]
        fremde = [b for b in self._beispiele_nach_aktualitaet() if b.abschnitt != zugfolge.abschnitt]
        for beispiel in eigene:
            for knoten in sorted(beispiel.knoten(), key=lambda k: -k.zuletzt):
                if not self._fremder_erster_zug(knoten, zugfolge):
                    yield from einmal(Anschluss(knoten))
        if len(zugfolge.zuege) == 1 and ziel is None:
            return  # Ein Einzelzug gehört in den laufenden Abschnitt oder ist eine Erwähnung
        if zugfolge.zuege[0].nummer == 1 and zugfolge.zuege[0].farbe == "w":
            # Jeder andere erste Zug ist ein eigenes Beispiel (eine Eröffnung je Baum).
            yield from einmal(Anschluss(None, GRUNDSTELLUNG))
        for abbildung in sorted(self.abbildungen, key=lambda a: abs(a.position - zugfolge.position)):
            if abbildung is not ziel:
                yield from einmal(self._anschluss_an(abbildung))
        for beispiel in fremde:
            for knoten in sorted(beispiel.knoten(), key=lambda k: -k.zuletzt):
                yield from einmal(Anschluss(knoten))
        for beispiel in reversed(self.fruehere):
            for knoten in beispiel.knoten():
                yield from einmal(Anschluss(knoten, fremd=True))

    def _fremde_uebung(self, anschluss: Anschluss, zugfolge: Zugfolge) -> bool:
        """Liegt der Anschluss im Baum einer anderen Übung, während Aufgabe oder Lösung laufen?

        Warum: „4... Se7“ aus der Aufgabe zu Abb. 4.55 landete sonst im Baum der vorigen Übung
        (Abb. 4.54). Eröffnungsbäume bleiben erlaubt: Die Lösung zu Abb. 0.26 erzählt die Partie
        ab dem ersten Zug nach und gehört dorthin.
        """
        if zugfolge.kontext not in _UEBUNGSKONTEXTE or anschluss.knoten is None:
            return False
        wurzel = anschluss.knoten
        while wurzel.eltern is not None:
            wurzel = wurzel.eltern
        beispiel = next((b for b in self.beispiele if b.wurzel is wurzel), None)
        eigene = set(self.uebungen.get(zugfolge.bezug or "", []))
        if beispiel is None or beispiel.wurzel_abbildung is None or beispiel.wurzel_abbildung in eigene:
            return False
        return any(beispiel.wurzel_abbildung in nummern for nummern in self.uebungen.values())

    def _setzt_nebenlinie_fort(self, zugfolge: Zugfolge) -> bool:
        """Nach „5... Dg6??“ zeigt „6. Sxc7+!“ die Strafe: Ein „!“ oder ein grober Fehler davor
        setzt die Nebenvariante fort; sonst kehrt der Text zur Hauptlinie zurück („Nach 1... h4“)."""
        assert self._nebenlinie is not None
        return "!" in zugfolge.zuege[0].zeichen or self._nebenlinie.zeichen == "??"

    @staticmethod
    def _fremder_erster_zug(knoten: Knoten, zugfolge: Zugfolge) -> bool:
        """Eine Wurzel in der Grundstellung nimmt nur Zugfolgen auf, deren erster Zug dort schon steht."""
        if knoten.eltern is not None or knoten.brett.fen() != GRUNDSTELLUNG:
            return False
        try:
            return knoten.kind_mit(knoten.brett.parse_san(zugfolge.zuege[0].san)) is None
        except ValueError:
            return True

    def _anschluss_an(self, abbildung: Abbildungsstellung) -> Anschluss:
        knoten = self._verknuepft.get(abbildung.nummer)
        return Anschluss(knoten) if knoten else Anschluss(None, abbildung.fen, abbildung)

    def _beispiele_nach_aktualitaet(self) -> list[Beispiel]:
        return sorted(
            self.beispiele, key=lambda b: (b is not self._aktuell, -max(k.zuletzt for k in b.knoten()))
        )

    def _uebungsanschluesse(self, zugfolge: Zugfolge) -> list[Anschluss]:
        """Die Abbildungen der Übung, auf die sich eine Lösung bezieht, mit relativer Zugzählung."""
        anschluesse = []
        for nummer in self.uebungen.get(zugfolge.bezug or "", []):
            abbildung = self._nach_nummer.get(nummer)
            if abbildung is not None:
                anschluss = self._anschluss_an(abbildung)
                anschluss.versatz = chess.Board(abbildung.fen).fullmove_number - 1
                anschluesse.append(anschluss)
        return anschluesse

    def _uebungsknoten(self, zugfolge: Zugfolge) -> list[Anschluss]:
        """Alle Knoten der Beispiele, die eine Abbildung der Übung enthalten.

        Reihenfolge wie außerhalb der Übungen: erst die Spitze einer widerlegten Nebenvariante
        (wenn die Zugfolge sie fortsetzt), dann die Spitze, dann alle übrigen Knoten nach
        Aktualität. So kehrt „Nach 1... h4“ nach „etwa 1. Kh7?“ zur Hauptlinie zurück (Lösung zu
        Abb. 10.26).
        """
        genannte = set(self.uebungen.get(zugfolge.bezug or "", []))
        beispiele = [b for b in self.beispiele if genannte & set(b.abbildungen())]
        knoten = sorted((k for b in beispiele for k in b.knoten()), key=lambda k: -k.zuletzt)
        nebenlinie = self._nebenlinie
        fortsetzen = nebenlinie is not None and self._setzt_nebenlinie_fort(zugfolge)
        vorne = [k for k in (nebenlinie if fortsetzen else None, self._spitze) if k is not None]
        vorhanden = {id(k) for k in knoten}
        rest = [k for k in knoten if all(k is not v for v in vorne)]
        knoten = [k for k in [*vorne, *rest] if id(k) in vorhanden]
        return [Anschluss(k, versatz=self._versatz_von(k)) for k in knoten]

    @staticmethod
    def _versatz_von(knoten: Knoten) -> int:
        wurzel = knoten
        while wurzel.eltern is not None:
            wurzel = wurzel.eltern
        return wurzel.brett.fullmove_number - 1

    @staticmethod
    def _passt(anschluss: Anschluss, zug: Zug, streng: bool) -> bool:
        """Zugseite stimmt; streng auch die Zugnummer, in Lösungen absolut oder ab der Übung gezählt."""
        brett = anschluss.brett()
        if ("w" if brett.turn else "b") != zug.farbe:
            return False
        nummern = {brett.fullmove_number, brett.fullmove_number - anschluss.versatz}
        return not streng or zug.nummer is None or zug.nummer in nummern

    @staticmethod
    def _schachzeichen_stimmen(brett: chess.Board, zuege: list[Zug]) -> bool:
        """Keiner der spielbaren Züge gibt Schach, ohne dass das Buch „+“ oder „#“ schreibt."""
        probe = brett.copy()
        for zug in zuege:
            bewegung = spiele_zug(probe, zug)
            if isinstance(bewegung, str):
                return True  # Ob der Rest spielbar ist, entscheidet ``_legale_zuege``.
            probe.push(bewegung)
            if fehlendes_schachzeichen(probe, zug):
                return False
        return True

    @staticmethod
    def _legale_zuege(brett: chess.Board, zuege: list[Zug]) -> int:
        """Wie viele Züge der Folge ab dieser Stellung spielbar sind (mit richtigem Schachzeichen)."""
        probe = brett.copy()
        for anzahl, zug in enumerate(zuege):
            bewegung = spiele_zug(probe, zug)
            if isinstance(bewegung, str):
                return anzahl
            probe.push(bewegung)
        return len(zuege)


def spiele_zug(brett: chess.Board, zug: Zug) -> chess.Move | str:
    """Prüft einen Zug samt Schach- und Mattzeichen und liefert ihn oder den Grund der Ablehnung.

    Warum: python-chess übergeht „+“, „#“ und „x“. Das Buch meint sie aber ernst: „Tb7+“ ohne Schach
    zeigt, dass die Zugfolge zu einer anderen Stellung gehört, oder einen Fehler im Buch.
    """
    try:
        bewegung = brett.parse_san(zug.san)
    except ValueError:
        return "nicht möglich"
    if "x" in zug.san and not brett.is_capture(bewegung):
        return "schlägt nichts"  # python-chess nähme „Sxe5“ auch als Sf3-e5 ohne Schlagen
    probe = brett.copy()
    probe.push(bewegung)
    if zug.san.endswith("#") and not probe.is_checkmate():
        return "ist kein Matt"
    if zug.san.endswith("+") and not probe.is_check():
        return "gibt kein Schach"
    return bewegung


def fehlendes_schachzeichen(brett_danach: chess.Board, zug: Zug) -> bool:
    """Der Zug gibt Schach, das Buch schreibt aber kein „+“ (Hinweis, kein Grund zur Ablehnung)."""
    return brett_danach.is_check() and not zug.san.endswith(("+", "#"))

"""Spielt die Zugfolgen eines Kapitels nach und ordnet die Abbildungen den Stellungen zu.

Wozu diese Datei da ist:
    Schritt 3 „Zugfolgen vorschlagen“ (Konzept Abschnitt 5): Aus den Zugfolgen im Text, in den
    Unterschriften und in den Lösungen entstehen Variantenbäume (Beispiele). Für jede Abbildung
    wird der Halbzug gesucht, an dem ihre Stellung erreicht ist. Was nicht aufgeht (unlesbarer
    oder illegaler Zug, Zugfolge ohne Anschluss, Abbildung ohne Zugfolge), wird ein Befund für
    den Autor, nie eine stille Korrektur (Pflichtenheft, Abschnitt 3).

Wie eine Zugfolge ihren Anschluss findet (in dieser Reihenfolge):
    1. in einer Lösung oder Übung: die Stellung der Übung und alle Knoten ihres Baumes (Spitze
       zuerst); eine Lösung verlässt diesen Baum nicht. Zugnummern zählen dort auch ab der Übung.
    2. die Abbildungen, die der Absatz davor nennt („In \\abb{7.6} …“), nächste zuerst
    3. die Spitze der zuletzt gespielten Variante (nach einer widerlegten Nebenvariante zuerst
       deren Spitze, wenn die neue Zugfolge mit „!“ antwortet oder der Fehler ein „??“ war)
    4. die zuletzt gezeigte Abbildung
    5. jeder Knoten der Beispiele desselben Abschnitts, nach Aktualität
    6. die Grundstellung als neues Beispiel des Abschnitts, wenn die Zugfolge mit „1.“ beginnt
    7. alle Abbildungen des Kapitels als neue Wurzel, nach Abstand im Text
    8. die Knoten der Beispiele anderer Abschnitte
    9. die Beispiele früherer Kapitel (Kapitel 5 und 6 greifen Eröffnungen aus Kapitel 2 auf)
    Nennt der Text hinter der Zugfolge eine Abbildung („… 8. d5 Se7 (\\abb{5.27})“), gewinnt der
    Anschluss, der genau zu dieser Stellung führt.
    Ein Anschluss passt, wenn Zugseite und Zugnummer stimmen und die Züge legal sind;
    bevorzugt wird der Anschluss, an dem die ganze Zugfolge legal ist. Je Abschnitt entsteht
    höchstens ein Beispiel ab der Grundstellung, damit etwa jedes Gambit ein eigenes Beispiel ist.
    Ein nummerierter Einzelzug ohne Anschluss („im Englund-Gambit (6. Lc3??)“) ist eine Erwähnung.
    Schach- und Mattzeichen zählen mit: „Tb7+“ ohne Schach passt nicht. Eine Zugfolge, deren
    erster Zug ein Fragezeichen trägt, ist eine Nebenvariante und verschiebt die Spitze nicht.
"""

from __future__ import annotations

from dataclasses import dataclass, replace

import chess

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.zugfolgen import Zugfolge, auf_deutsch
from pipeline.zugfolgen.anschluss import (
    GRUNDSTELLUNG,
    Abbildungsstellung,
    Anschluss,
    Anschlusssuche,
    fehlendes_schachzeichen,
    spiele_zug,
)
from pipeline.zugfolgen.baum import Beispiel, Knoten, neuer_knoten, stabile_kennung
from pipeline.zugfolgen.zuordnung import (
    Abbildungszuordnung,
    als_text,
    ohne_schachzeichen,
    uebernimm_zugzeichen,
)


@dataclass
class Statistik:
    zugfolgen: int = 0
    unterschriften: int = 0  # Unterschriften mit lesbaren Zügen
    beispiele: int = 0
    zuege: int = 0
    abzweigungen: int = 0
    abbildungen: int = 0
    verknuepft: int = 0
    ohne_zugfolge: int = 0
    illegal: int = 0
    ohne_anschluss: int = 0
    einzelzuege: int = 0  # nummerierte Einzelzüge ohne Anschluss, als Erwähnung gewertet


@dataclass
class Kapitelzugfolgen:
    beispiele: list[Beispiel]
    befunde: list[Befund]
    statistik: Statistik


class Nachspieler(Anschlusssuche, Abbildungszuordnung):
    """Baut die Beispiele eines Kapitels aus Abbildungen und Zugfolgen in Textreihenfolge."""

    def __init__(
        self,
        kapitel: int,
        abbildungen: list[Abbildungsstellung],
        uebungen: dict[str, list[str]],
        fruehere: list[Beispiel] | None = None,
    ):
        self.kapitel = kapitel
        self.abbildungen = abbildungen
        self.uebungen = uebungen  # Übungslabel → Abbildungsnummern
        self.fruehere = fruehere or []  # Beispiele früherer Kapitel
        self.beispiele: list[Beispiel] = []
        self.befunde: list[Befund] = []
        self.statistik = Statistik(abbildungen=len(abbildungen))
        self._nach_nummer = {a.nummer: a for a in abbildungen}
        self._knoten_nach_schluessel: dict[str, list[Knoten]] = {}
        self._verknuepft: dict[str, Knoten] = {}
        self._spitze: Knoten | None = None
        self._nebenlinie: Knoten | None = None  # Spitze der zuletzt gespielten widerlegten Nebenvariante
        self._letzte_abbildung: Abbildungsstellung | None = None
        self._uhr = 0
        self._aktuell: Beispiel | None = None
        self._uebung: str | None = None  # Label der Übung, deren Lösung gerade läuft
        self._offene_unterschriften: list[tuple[Abbildungsstellung, Zugfolge]] = []

    def verarbeite(self, zugfolgen: list[Zugfolge]) -> Kapitelzugfolgen:
        """Geht Abbildungen und Zugfolgen in Textreihenfolge durch und liefert das Ergebnis."""
        ereignisse: list[tuple[int, int, object]] = [(a.position, 0, a) for a in self.abbildungen]
        ereignisse += [(z.position, 1, z) for z in zugfolgen]
        for _, art, ereignis in sorted(ereignisse, key=lambda e: (e[0], e[1])):
            if art == 0:
                self._bei_abbildung(ereignis)  # type: ignore[arg-type]
            else:
                self._bei_zugfolge(ereignis)  # type: ignore[arg-type]
        self._abschluss()
        return Kapitelzugfolgen(self.beispiele, self.befunde, self.statistik)

    # --- Ereignisse -------------------------------------------------------------------------

    def _bei_abbildung(self, abbildung: Abbildungsstellung) -> None:
        """Eine Abbildung erscheint: erst die Züge ihrer Unterschrift spielen, dann zuordnen."""
        if abbildung.unterschriftszuege:
            self.statistik.unterschriften += 1
            datei, _, zeile = abbildung.fundstelle.partition(":")
            zugfolge = Zugfolge(
                abbildung.unterschriftszuege,
                "",
                datei,
                int(zeile or 0),
                "unterschrift",
                abbildung.nummer,
                abbildung.position,
                abschnitt=abbildung.abschnitt,
            )
            ende = self._spiele(zugfolge, ziel=abbildung)
            if ende is None:
                self._offene_unterschriften.append((abbildung, zugfolge))
        self._verknuepfe_falls_bekannt(abbildung)
        self._letzte_abbildung = abbildung

    def _bei_zugfolge(self, zugfolge: Zugfolge) -> None:
        self.statistik.zugfolgen += 1
        bezug = zugfolge.bezug if zugfolge.kontext in ("loesung", "uebung") else None
        if bezug != self._uebung:
            # Eine neue Übung beginnt: Spitze und Nebenvariante der vorigen gelten nicht mehr.
            self._spitze, self._nebenlinie, self._uebung = None, None, bezug
        if bezug is not None:
            # Aufgabe und Lösung gehören zum Abschnitt ihres Übungsdiagramms („Übung 8“): So bilden
            # „1. e4 e5 2. Sf3 Sc6 3. Lc4 Lc5“ aus der Aufgabe und Abb. 2.148 einen Baum.
            abschnitte = [
                self._nach_nummer[n].abschnitt for n in self.uebungen.get(bezug, []) if n in self._nach_nummer
            ]
            uebungsabschnitt = next((a for a in abschnitte if a and a.startswith("Übung")), None)
            if uebungsabschnitt is not None:
                zugfolge = replace(zugfolge, abschnitt=uebungsabschnitt)
        self._spiele(zugfolge)

    def _abschluss(self) -> None:
        """Abbildungen ohne Zugfolge melden und die Statistik vervollständigen."""
        for abbildung in self.abbildungen:
            self._verknuepfe_falls_bekannt(abbildung, auch_fremd=True)
            if abbildung.nummer not in self._verknuepft:
                self._hole_aus_frueherem_kapitel(abbildung)
        for abbildung, zugfolge in self._offene_unterschriften:
            self._pruefe_unterschrift(abbildung, zugfolge)
        for abbildung in self.abbildungen:
            if abbildung.nummer in self._verknuepft:
                continue
            self.statistik.ohne_zugfolge += 1
            self.befunde.append(
                Befund(
                    Schwere.HINWEIS,
                    "abbildung-ohne-zugfolge",
                    "Keine Zugfolge führt zu dieser Abbildung",
                    abbildung.fundstelle,
                    abbildung.nummer,
                )
            )
        vergeben: set[str] = set()
        for beispiel in self.beispiele:
            beispiel.id = stabile_kennung(beispiel, vergeben)
        self.statistik.beispiele = len(self.beispiele)
        self.statistik.zuege = sum(b.anzahl_zuege() for b in self.beispiele)
        self.statistik.abzweigungen = sum(b.anzahl_abzweigungen() for b in self.beispiele)
        self.statistik.verknuepft = len(self._verknuepft)

    # --- Nachspielen ------------------------------------------------------------------------

    def _spiele(self, zugfolge: Zugfolge, ziel: Abbildungsstellung | None = None) -> Knoten | None:
        """Sucht den Anschluss und spielt die Zugfolge; liefert den letzten erreichten Knoten."""
        erwaehnt = self._erneut_erwaehnt(zugfolge)
        if erwaehnt is not None and ziel is None:
            uebernimm_zugzeichen(erwaehnt, zugfolge.zuege)
            self._beruehre(erwaehnt)
            self._spitze, self._nebenlinie = erwaehnt, None
            return erwaehnt
        anschluss = self._waehle_anschluss(zugfolge, ziel)
        kommende = None if ziel else self._kommende_zielabbildung(zugfolge)
        muss_erreichen = ziel or kommende
        if muss_erreichen is not None and (
            anschluss is None
            or not self._erreicht(anschluss, zugfolge, muss_erreichen)
            or anschluss.nummer_weicht_ab
        ):
            # Unterschrift oder Text vor seiner Abbildung: nur spielen, wenn die Zugfolge die
            # Abbildung mit passender Zugnummer erreicht. Ein Umweg mit falscher Nummer erreicht sie
            # manchmal auch („nach 1... Tb7+ 2. Kd8 Tb8+“ unter Abb. 9.6 nach 3. Kc7) und wäre falsch.
            return None
        if anschluss is None and len(zugfolge.zuege) == 1 and ziel is None:
            self.statistik.einzelzuege += 1
            return None
        if anschluss is None:
            self.statistik.ohne_anschluss += 1
            self.befunde.append(
                Befund(
                    Schwere.WARNUNG,
                    "zugfolge-ohne-anschluss",
                    f"Kein Anschluss für „{zugfolge.buchtext or als_text(zugfolge.zuege)}“",
                    zugfolge.fundstelle,
                    zugfolge.bezug if zugfolge.kontext == "unterschrift" else None,
                )
            )
            return None
        if anschluss.nummer_weicht_ab:
            self.befunde.append(
                Befund(
                    Schwere.HINWEIS,
                    "zugnummer",
                    f"Zugnummer passt nicht zur Stellung: „{zugfolge.buchtext or als_text(zugfolge.zuege)}“",
                    zugfolge.fundstelle,
                )
            )
        if anschluss.fremd and anschluss.knoten is not None:
            knoten = self._kopiere_aus_frueherem_kapitel(anschluss.knoten, zugfolge.abschnitt)
        else:
            knoten = anschluss.knoten or self._neue_wurzel(anschluss, zugfolge.abschnitt)
        return self._anwenden(knoten, zugfolge)

    def _anwenden(self, knoten: Knoten, zugfolge: Zugfolge) -> Knoten:
        """Spielt die Züge ab ``knoten``; vorhandene Züge werden weiterverfolgt, neue angehängt."""
        self._beruehre(knoten)
        for zug in zugfolge.zuege:
            bewegung = spiele_zug(knoten.brett, zug)
            if isinstance(bewegung, str):
                self.statistik.illegal += 1
                davor = " ".join(auf_deutsch(san) for san in knoten.pfad()[-4:]) or "Anfang"
                text = f"Zug „{zug.buchtext}“ {bewegung} (Stellung nach {davor})"
                self.befunde.append(Befund(Schwere.WARNUNG, "zug-illegal", text, zugfolge.fundstelle))
                break
            kind = knoten.kind_mit(bewegung)
            if kind is None:
                kind = neuer_knoten(knoten, bewegung, zug.buchtext, zug.zeichen, zugfolge.fundstelle)
                self._knoten_nach_schluessel.setdefault(kind.schluessel, []).append(kind)
                self._verknuepfe_abbildungen_mit(kind)
            elif zug.zeichen and not kind.zeichen:
                kind.zeichen, kind.buchtext = zug.zeichen, zug.buchtext
            if fehlendes_schachzeichen(kind.brett, zug):
                text = f"„{zug.buchtext}“ gibt Schach, das Buch schreibt kein „+“"
                self.befunde.append(Befund(Schwere.HINWEIS, "schachzeichen", text, zugfolge.fundstelle))
            kind.zuletzt = self._uhr
            knoten = kind
        # Eine widerlegte Nebenvariante („etwa 1. Kh7?“) und eine Alternative in Klammern
        # verschieben die Spitze nicht: Der Text kehrt danach zur Hauptlinie zurück.
        if "?" in zugfolge.zuege[0].zeichen or zugfolge.in_klammern:
            self._nebenlinie = knoten
        else:
            self._spitze, self._nebenlinie = knoten, None
        self._aktuell = self._beispiel_von(knoten)
        return knoten

    def _beruehre(self, knoten: Knoten) -> None:
        """Der Knoten und seine Vorgänger gelten als berührt: Der Text spricht über diese Linie.

        So findet „Geht Schwarz stattdessen mit 1... Kc7“ den Hauptzug 1. Kg7, nicht die zuvor
        erwähnte Nebenvariante 1. Kh7? (Lösung zu Abb. 10.26), und „2. c3“ (Alapin) hängt an
        1... c5, über dessen Linie der Abschnitt gerade spricht.
        """
        self._uhr += 1
        vorgaenger: Knoten | None = knoten
        while vorgaenger is not None:
            vorgaenger.zuletzt = self._uhr
            vorgaenger = vorgaenger.eltern

    def _erneut_erwaehnt(self, zugfolge: Zugfolge) -> Knoten | None:
        """Der Knoten einer schon gezeigten Abbildung, wenn die Zugfolge genau ihre letzten Züge nennt.

        Beispiel: „In der Hauptvariante folgt 7. Lg5 h6 8. Lh4 Le6 9. Sbd2 (\\abb{2.23})“ in einer
        Lösung zu Kapitel 2. Die Züge stehen schon im Baum der Italienischen Partie; neu angehängt
        entstünde eine zweite Kopie. Die Zugfolge setzt dort an, der Text spielt von hier weiter.
        Nur die Abbildung direkt hinter der Zugfolge zählt, nicht jede im Absatz genannte:
        „… da Schwarz mit 2... Ke7 die Opposition nimmt“ gehört zu 2. Ke5?, nicht zu Abb. 8.33.
        """
        knoten = self._verknuepft.get(zugfolge.ziel) if zugfolge.ziel else None
        if knoten is None or not self._im_eigenen_abschnitt(knoten, zugfolge):
            return None
        genannt = [ohne_schachzeichen(z.san) for z in zugfolge.zuege]
        davor = [ohne_schachzeichen(san) for san in knoten.pfad()[-len(genannt) :]]
        return knoten if davor == genannt else None

    def _im_eigenen_abschnitt(self, knoten: Knoten, zugfolge: Zugfolge) -> bool:
        """Der Knoten gehört zu einem Beispiel dieses Kapitels und desselben Abschnitts (oder der Übung).

        Warum: Abb. 3.70 (Lettisches Gambit) ist zunächst mit 1. e4 e5 2. Sf3 f5 aus Kapitel 2
        verknüpft. Die Zugfolge des Kapitels 3 soll aber ihr eigenes Beispiel weiterführen.
        """
        beispiel = self._beispiel_von(knoten)
        if beispiel is None or beispiel.kapitel != self.kapitel:
            return False
        return zugfolge.kontext in ("loesung", "uebung") or beispiel.abschnitt == zugfolge.abschnitt

    def _kommende_zielabbildung(self, zugfolge: Zugfolge) -> Abbildungsstellung | None:
        """Die Abbildung, die der Text hinter der Zugfolge nennt, wenn sie erst später erscheint.

        Beispiel: „2. Kb5 Td5+ (\\abb{10.2})“ steht vor den Diagrammen der Saavedra-Studie. Die
        Züge passen erst an Abb. 10.1, die noch nicht gezeigt ist; an einer anderen Stellung
        angehängt, entstünde ein falscher Zweig. Auch eine Zugumstellung mit falscher Zugnummer
        (über Abb. 10.4 erreicht „3. Kb5 Td5+“ dieselbe Stellung) zählt dann nicht.
        """
        abbildung = self._nach_nummer.get(zugfolge.ziel) if zugfolge.ziel else None
        if abbildung is None or abbildung.position < zugfolge.position:
            return None
        return None if abbildung.nummer in self._verknuepft else abbildung

    def _neue_wurzel(self, anschluss: Anschluss, abschnitt: str | None) -> Knoten:
        """Beginnt ein neues Beispiel an der Grundstellung oder an einer Abbildung."""
        fen = anschluss.wurzel_fen or GRUNDSTELLUNG
        wurzel = Knoten(chess.Board(fen), None, "", "", "", "")
        abbildung = anschluss.wurzel_abbildung
        nummer = len(self.beispiele) + 1
        titel = abbildung.titel if abbildung else "Grundstellung"
        beispiel = Beispiel(
            f"k{self.kapitel:02d}-{nummer:02d}",
            self.kapitel,
            abbildung.abschnitt if abbildung else abschnitt,
            titel,
            wurzel,
        )
        self.beispiele.append(beispiel)
        self._knoten_nach_schluessel.setdefault(wurzel.schluessel, []).append(wurzel)
        if abbildung:
            beispiel.wurzel_abbildung = abbildung.nummer
            self._verknuepfe(abbildung, wurzel)
        return wurzel

    # --- Anschluss suchen -------------------------------------------------------------------


__all__ = ["Abbildungsstellung", "Kapitelzugfolgen", "Nachspieler", "Statistik", "spiele_zug"]

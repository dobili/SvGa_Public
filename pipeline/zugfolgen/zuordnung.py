"""Abbildungen den Knoten zuordnen und Unterschriften prüfen (Teil des Nachspielers).

Wozu diese Datei da ist:
    ``nachspielen.py`` baut die Bäume; diese Klasse verknüpft jede Abbildung mit dem Knoten, der
    ihre Stellung zeigt, prüft am Kapitelende die Züge der Bildunterschriften und kopiert Wege aus
    früheren Kapiteln, wenn ein Kapitel eine Linie oder Stellung von dort wieder aufnimmt. Ausgelagert,
    damit beide Dateien unter 400 Zeilen bleiben (CLAUDE.md, Regel 4).
"""

from __future__ import annotations

import chess

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.zugfolgen import Zug, Zugfolge, auf_deutsch
from pipeline.zugfolgen.anschluss import Abbildungsstellung, Anschluss
from pipeline.zugfolgen.baum import Beispiel, Knoten, neuer_knoten


class Abbildungszuordnung:
    """Verknüpft Abbildungen mit Knoten; der Nachspieler erbt davon und hält den Zustand."""

    kapitel: int
    abbildungen: list[Abbildungsstellung]
    beispiele: list[Beispiel]
    fruehere: list[Beispiel]
    befunde: list[Befund]
    _verknuepft: dict[str, Knoten]
    _knoten_nach_schluessel: dict[str, list[Knoten]]

    def _pruefe_unterschrift(self, abbildung: Abbildungsstellung, zugfolge: Zugfolge) -> None:
        """Eine Unterschrift, deren Züge allein die Stellung nicht erreichen, am Kapitelende prüfen.

        Warum: „Nach 5. Sc3“ unter Abb. 2.55 nennt nur den letzten Zug; die Stellung erreicht
        erst der Text danach („Durch 4. Sxd4 Sf6 5. Sc3 …“). Das ist richtig, wenn die Züge der
        Unterschrift die letzten Züge vor der verknüpften Stellung sind. Sonst passt die
        Unterschrift nicht zur Abbildung (Warnung), oder es fehlt jeder Anschluss (Warnung).
        """
        knoten = self._verknuepft.get(abbildung.nummer)
        genannt = [ohne_schachzeichen(z.san) for z in zugfolge.zuege]
        unterschrift = mit_nummern(zugfolge.zuege)
        if not abbildung.unterschrift_am_anfang:
            return  # „… nach 1. Te8#“ mitten im Satz beschreibt oft, was folgt: kein Befund
        if knoten is not None and len(knoten.pfad()) < len(genannt):
            return  # Die Abbildung beginnt ein Beispiel; die Vorgeschichte steht nicht im Baum.
        if knoten is None:
            kennung = "unterschrift-ohne-anschluss"
            text = f"Die Züge der Unterschrift („{unterschrift}“) haben keinen Anschluss"
        else:
            davor = knoten.pfad()[-len(genannt) :]
            if [ohne_schachzeichen(san) for san in davor] == genannt:
                return
            kennung = "unterschrift-stellung"
            text = (
                f"Die Züge der Unterschrift („{unterschrift}“) sind nicht die Züge vor der Stellung "
                f"der Abbildung („{' '.join(auf_deutsch(san) for san in davor)}“)"
            )
        self.befunde.append(Befund(Schwere.WARNUNG, kennung, text, abbildung.fundstelle, abbildung.nummer))

    def _verknuepfe_falls_bekannt(self, abbildung: Abbildungsstellung, auch_fremd: bool = False) -> None:
        """Verknüpft eine Abbildung mit einem Knoten ihres Abschnitts, der ihre Stellung zeigt.

        Warum nur der eigene Abschnitt: Alle Eröffnungen mit 1. e4 e5 teilen die ersten Züge; die
        Abbildung „Nach 1. e4 e5“ der Italienischen Partie gehört aber zu deren Beispiel, nicht zur
        Sizilianischen. Erst am Kapitelende (``auch_fremd``) zählt jeder passende Knoten.
        """
        if abbildung.nummer in self._verknuepft:
            return
        passende = [
            k
            for k in self._knoten_nach_schluessel.get(abbildung.schluessel, [])
            if auch_fremd or self._passt_abschnitt(abbildung, k)
        ]
        if passende:
            self._verknuepfe(abbildung, max(passende, key=lambda k: k.zuletzt))

    def _verknuepfe_abbildungen_mit(self, knoten: Knoten) -> None:
        for abbildung in self.abbildungen:
            if (
                abbildung.nummer not in self._verknuepft
                and abbildung.schluessel == knoten.schluessel
                and self._passt_abschnitt(abbildung, knoten)
            ):
                self._verknuepfe(abbildung, knoten)

    def _passt_abschnitt(self, abbildung: Abbildungsstellung, knoten: Knoten) -> bool:
        """Derselbe Abschnitt, oder ein Beispiel eines früheren Kapitels (Fortsetzung einer Eröffnung)."""
        beispiel = self._beispiel_von(knoten)
        return (
            beispiel is None or beispiel.kapitel != self.kapitel or beispiel.abschnitt == abbildung.abschnitt
        )

    def _verknuepfe(self, abbildung: Abbildungsstellung, knoten: Knoten) -> None:
        self._verknuepft[abbildung.nummer] = knoten
        knoten.abbildungen.append(abbildung.nummer)
        beispiel = self._beispiel_von(knoten)
        if beispiel is not None and beispiel.titel == "Grundstellung":
            beispiel.titel = abbildung.titel  # das Beispiel heißt nach seiner ersten Abbildung
        buch = chess.Board(abbildung.fen)
        rochade_buch, rochade_spiel = buch.castling_xfen(), knoten.brett.castling_xfen()
        if rochade_buch != rochade_spiel:
            text = (
                f"Rochaderechte der FEN ({rochade_buch}) weichen von der nachgespielten "
                f"Stellung ({rochade_spiel}) ab"
            )
            self.befunde.append(
                Befund(Schwere.HINWEIS, "fen-rochade", text, abbildung.fundstelle, abbildung.nummer)
            )

    def _beispiel_von(self, knoten: Knoten) -> Beispiel | None:
        wurzel = knoten
        while wurzel.eltern is not None:
            wurzel = wurzel.eltern
        return next((b for b in [*self.beispiele, *self.fruehere] if b.wurzel is wurzel), None)

    # --- Kopien aus früheren Kapiteln -------------------------------------------------------

    def _neue_wurzel(self, anschluss: Anschluss, abschnitt: str | None) -> Knoten:
        raise NotImplementedError  # im Nachspieler

    def _hole_aus_frueherem_kapitel(self, abbildung: Abbildungsstellung) -> None:
        """Zeigt eine Abbildung eine Stellung aus einem früheren Kapitel, kommt deren Weg als Kopie mit.

        Beispiel: „Das griechische Geschenk aus Kapitel 1“ (Abb. 11.10) nennt keine Züge; die Stellung
        steht aber im Baum von Kapitel 1. Nur Knoten mit Vorgeschichte zählen (keine Wurzel).
        """
        for beispiel in reversed(self.fruehere):
            knoten = next(
                (
                    k
                    for k in beispiel.knoten()
                    if k.eltern is not None and k.schluessel == abbildung.schluessel
                ),
                None,
            )
            if knoten is not None:
                kopie = self._kopiere_aus_frueherem_kapitel(knoten, abbildung.abschnitt)
                if abbildung.nummer not in self._verknuepft:  # beim Kopieren schon verknüpft?
                    self._verknuepfe(abbildung, kopie)
                return

    def _kopiere_aus_frueherem_kapitel(self, fremd: Knoten, abschnitt: str | None) -> Knoten:
        """Kopiert den Weg zu einem Knoten eines früheren Kapitels in ein neues Beispiel dieses Kapitels.

        Warum: „Die Najdorf-Hauptvariante aus Kapitel 2 nach … 8. O-O O-O“ (Abb. 5.8) setzt eine
        Linie aus Kapitel 2 fort. Hinge die Abbildung am Beispiel von Kapitel 2, stünde sie in
        keinem Entwurf von Kapitel 5 (der von Kapitel 2 ist dann schon geschrieben). Als Kopie ist
        jedes Kapitel vollständig, und man sieht in der App, wie die Stellung entstanden ist.
        """
        weg = []
        knoten: Knoten | None = fremd
        while knoten is not None and knoten.eltern is not None:
            weg.append(knoten)
            knoten = knoten.eltern
        assert knoten is not None
        erster = weg[-1].zug if weg else None
        vorhanden = next(
            (
                b.wurzel
                for b in self.beispiele
                if b.abschnitt == abschnitt
                and b.wurzel.brett.fen() == knoten.brett.fen()
                and erster is not None
                and b.wurzel.kind_mit(erster) is not None
            ),
            None,
        )  # Derselbe Abschnitt hat schon einen Baum mit diesem ersten Zug (ein Baum je Eröffnung).
        kopie = vorhanden or self._neue_wurzel(Anschluss(None, knoten.brett.fen()), abschnitt)
        for vorlage in reversed(weg):
            assert vorlage.zug is not None
            kind = kopie.kind_mit(vorlage.zug)
            if kind is None:
                kind = neuer_knoten(kopie, vorlage.zug, vorlage.buchtext, vorlage.zeichen, vorlage.fundstelle)
                self._knoten_nach_schluessel.setdefault(kind.schluessel, []).append(kind)
                self._verknuepfe_abbildungen_mit(kind)
            kopie = kind
        return kopie


def uebernimm_zugzeichen(knoten: Knoten, zuege: list[Zug]) -> None:
    """Zugzeichen einer erneuten Erwähnung („16. Db8+!!“) an die Knoten bis ``knoten`` hängen."""
    for zug in reversed(zuege):
        if zug.zeichen and not knoten.zeichen:
            knoten.zeichen, knoten.buchtext = zug.zeichen, zug.buchtext
        if knoten.eltern is None:
            return
        knoten = knoten.eltern


def ohne_schachzeichen(san: str) -> str:
    return san.rstrip("+#")


def mit_nummern(zuege: list[Zug]) -> str:
    """„4. Dxd4“ oder „1... Lxa2? 2. b3!“: Züge mit Nummern, wie sie in der Unterschrift stehen."""
    teile = []
    for index, zug in enumerate(zuege):
        if zug.farbe == "w" and zug.nummer is not None:
            teile.append(f"{zug.nummer}. {zug.buchtext}")
        elif index == 0 and zug.nummer is not None:
            teile.append(f"{zug.nummer}... {zug.buchtext}")
        else:
            teile.append(zug.buchtext)
    return " ".join(teile)


def als_text(zuege: list[Zug]) -> str:
    return " ".join(z.buchtext for z in zuege)


__all__ = ["Abbildungszuordnung", "als_text", "mit_nummern", "ohne_schachzeichen", "uebernimm_zugzeichen"]

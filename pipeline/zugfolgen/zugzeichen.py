"""Engine-Prüfung der Zugzeichen: Passen „!“, „?“, „??“ zu dem, was Stockfish rechnet?

Wozu diese Datei da ist:
    Schritt 5 „Engine-Prüfung“ (Konzept Abschnitt 5): Zugzeichen werden nach dem Verlust gegenüber
    dem besten Zug beurteilt, wie bei der Buchprüfung. Abweichungen gehen als Hinweis an den Autor;
    nichts wird geändert. Die Engine ist Stockfish 19 lite (ein Kern) aus dem npm-Paket der App,
    gestartet unter Node, damit Pipeline und App dieselbe Engine nutzen.

Maßstab (Startwerte, mit dem Autor abzustimmen):
    ??  Verlust mindestens 2,0 Bauerneinheiten (oder Matt übersehen/ hineingelaufen)
    ?   Verlust mindestens 0,8
    ?!  Verlust mindestens 0,3
    !, !!  der Zug ist der beste oder höchstens 0,3 schlechter als der beste
    Gemessen wird aus Sicht der ziehenden Seite, Werte in Bauerneinheiten, Matt als ±100.
    Führen bester und gespielter Zug beide in ein Matt derselben Seite, gilt der Verlust als 0.
    Erst Tiefe 14 für alle Züge; was abweicht, wird mit Tiefe 22 bestätigt oder verworfen. Jede
    Suche beginnt als neue Partie, damit jeder Datenlauf dieselben Werte liefert.
"""

from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass
from pathlib import Path

import chess
import chess.engine

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.zugfolgen import auf_deutsch
from pipeline.zugfolgen.baum import Beispiel, Knoten

HAUPTORDNER = Path(__file__).resolve().parents[2]
ENGINE_DATEI = HAUPTORDNER / "app" / "node_modules" / "stockfish" / "bin" / "stockfish-19-lite-single.js"

# Rechentiefe je Stellung: reproduzierbar, auf einem Kern etwa eine Sekunde.
RECHENTIEFE = 14
# Was bei Tiefe 14 abweicht, rechnet die Engine mit Tiefe 22 nach; nur was dann noch abweicht,
# wird gemeldet. Bei Tiefe 14 übersah sie etwa „Txd7+!“ und „g5!“ in Kapitel 11.
NACHPRUEFTIEFE = 22
# Verlust in Bauerneinheiten, ab dem ein Zeichen gerechtfertigt ist.
VERLUST_FEHLER = 2.0  # „??“
VERLUST_SCHWACH = 0.8  # „?“
VERLUST_UNGENAU = 0.3  # „?!“, und Obergrenze für „!“
MATTWERT = 100.0


@dataclass(frozen=True)
class Urteil:
    knoten: Knoten
    verlust: float  # Bauerneinheiten gegenüber dem besten Zug
    bester: str  # bester Zug laut Engine in Kurznotation


class Zugzeichenpruefer:
    """Hält die Engine offen und beurteilt annotierte Züge."""

    def __init__(self, engine_datei: Path = ENGINE_DATEI) -> None:
        self.engine = chess.engine.SimpleEngine.popen_uci(["node", str(engine_datei)])
        self.engine.configure({"Hash": 16})

    def schliesse(self) -> None:
        self.engine.quit()

    def pruefe(self, beispiele: list[Beispiel]) -> Iterator[Befund]:
        """Beurteilt jeden Zug mit Zugzeichen in allen Beispielen."""
        for beispiel in beispiele:
            for knoten in beispiel.knoten():
                if knoten.zeichen and knoten.eltern is not None and knoten.zug is not None:
                    befund = _vergleiche(knoten, self.beurteile(knoten, RECHENTIEFE), RECHENTIEFE)
                    if befund is not None:
                        befund = _vergleiche(knoten, self.beurteile(knoten, NACHPRUEFTIEFE), NACHPRUEFTIEFE)
                    if befund is not None:
                        yield befund

    def beurteile(self, knoten: Knoten, tiefe: int = RECHENTIEFE) -> Urteil:
        """Verlust des gespielten Zugs gegenüber dem besten Zug der Engine, aus Sicht des Ziehenden."""
        assert knoten.eltern is not None and knoten.zug is not None
        davor = knoten.eltern.brett
        # Jede Suche als neue Partie („ucinewgame“ leert die Hashtabelle): Sonst hängt das
        # Ergebnis von den Stellungen davor ab, und jeder Datenlauf meldete andere Werte.
        bester = self.engine.analyse(davor, chess.engine.Limit(depth=tiefe), game=object())
        bester_zug = bester["pv"][0] if bester.get("pv") else knoten.zug
        if bester_zug == knoten.zug:
            return Urteil(knoten, 0.0, davor.san(bester_zug))  # zwei Suchen desselben Zugs streuen
        gespielt = self.engine.analyse(
            davor, chess.engine.Limit(depth=tiefe), root_moves=[knoten.zug], game=object()
        )
        bewertung_bester, bewertung_gespielt = (
            bester["score"].pov(davor.turn),
            gespielt["score"].pov(davor.turn),
        )
        if _beide_matt_fuer_dieselbe_seite(bewertung_bester, bewertung_gespielt):
            # Saavedra 5... Td4!!: Schwarz verliert in jeder Variante; „schlechter“ hieße nur
            # „früher matt“. Das Zugzeichen bewertet dort die Idee (Pattfalle), nicht die Matt-Distanz.
            return Urteil(knoten, 0.0, davor.san(bester_zug))
        wert_bester, wert_gespielt = _bauern(bewertung_bester), _bauern(bewertung_gespielt)
        return Urteil(knoten, max(0.0, wert_bester - wert_gespielt), davor.san(bester_zug))


def _beide_matt_fuer_dieselbe_seite(bester: chess.engine.Score, gespielt: chess.engine.Score) -> bool:
    """Beide Züge führen zu einem erzwungenen Matt derselben Seite (nur die Distanz unterscheidet sich)."""
    matt_bester, matt_gespielt = bester.mate(), gespielt.mate()
    return matt_bester is not None and matt_gespielt is not None and (matt_bester > 0) == (matt_gespielt > 0)


def _bauern(wert: chess.engine.Score) -> float:
    return wert.score(mate_score=int(MATTWERT * 100)) / 100


def _vergleiche(knoten: Knoten, urteil: Urteil, tiefe: int) -> Befund | None:
    """Passt das Zugzeichen des Buches zum Verlust? Sonst ein Hinweis mit beiden Werten."""
    zeichen = knoten.zeichen
    erwartet_mindestens = {"??": VERLUST_FEHLER, "?": VERLUST_SCHWACH, "?!": VERLUST_UNGENAU}.get(zeichen)
    passt = (
        urteil.verlust >= erwartet_mindestens
        if erwartet_mindestens is not None
        else urteil.verlust <= VERLUST_UNGENAU  # „!“, „!!“, „!?“: nicht schlechter als der beste Zug
    )
    if passt:
        return None
    if urteil.bester == knoten.san:
        text = f"„{knoten.buchtext}“: Die Engine hält diesen Zug für den besten (Tiefe {tiefe})"
    else:
        text = (
            f"„{knoten.buchtext}“: Verlust {urteil.verlust:.1f} gegenüber dem besten Zug "
            f"{auf_deutsch(urteil.bester)} (Tiefe {tiefe})"
        )
    return Befund(Schwere.HINWEIS, "zugzeichen", text, knoten.fundstelle)

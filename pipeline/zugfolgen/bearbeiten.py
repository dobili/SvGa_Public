"""PGN-Dateien von Hand bearbeiten: zusammenführen, Vorlauf, aufteilen, Zweig löschen, freigeben.

Wozu diese Datei da ist:
    Bei der Freigabe (AP 4, Teil E der Aufgaben des Autors) setzt Claude die angenommenen
    Empfehlungen aus ``inhalte/de/empfehlungen.json`` in den PGN-Dateien um. Diese Werkzeuge tun
    das reproduzierbar mit python-chess statt mit Textersetzungen: Züge werden über die Stellung
    zusammengeführt, Kommentare mit Abbildungen bleiben erhalten, die Kopfzeile ``Abbildungen``
    wird neu bestimmt.

Begriffe: Ein „Baum“ ist ein ``chess.pgn.Game`` mit Varianten. Ein „Pfad“ ist eine Liste von
Zügen in englischer Kurznotation ab der Startstellung, wie in den App-Daten.
"""

from __future__ import annotations

import io
import re
from pathlib import Path

import chess
import chess.pgn

from pipeline.zugfolgen.baum import stellungsschluessel
from pipeline.zugfolgen.pgn import STATUS_GEPRUEFT, STATUS_VERWORFEN

_ABBILDUNG = re.compile(r"Abb\. (\d+\.\d+)")


def lies(pfad: Path) -> chess.pgn.Game:
    """Liest eine PGN-Datei; eine unlesbare Datei ist ein Fehler, kein leerer Baum."""
    with pfad.open(encoding="utf-8") as datei:
        spiel = chess.pgn.read_game(datei)
    if spiel is None:
        raise ValueError(f"{pfad}: keine Partie lesbar")
    return spiel


def schreibe(spiel: chess.pgn.Game, pfad: Path) -> None:
    """Schreibt den Baum und bestimmt vorher die Kopfzeile ``Abbildungen`` neu."""
    spiel.headers["Abbildungen"] = " ".join(abbildungen(spiel))
    pfad.write_text(str(spiel) + "\n", encoding="utf-8")


def abbildungen(spiel: chess.pgn.Game) -> list[str]:
    """Alle Abbildungen in den Kommentaren, in Reihenfolge des Baumes (Hauptlinie zuerst)."""
    gefunden: list[str] = []
    stapel: list[chess.pgn.GameNode] = [spiel]
    while stapel:
        knoten = stapel.pop()
        for nummer in _ABBILDUNG.findall(knoten.comment):
            if nummer not in gefunden:
                gefunden.append(nummer)
        stapel.extend(reversed(knoten.variations))
    return gefunden


def _vereinige_kommentar(ziel: chess.pgn.GameNode, kommentar: str) -> None:
    """Hängt die Abbildungen eines Kommentars an, ohne doppelte."""
    vorhanden = _ABBILDUNG.findall(ziel.comment)
    neu = [n for n in _ABBILDUNG.findall(kommentar) if n not in vorhanden]
    if neu:
        ziel.comment = ", ".join(f"Abb. {n}" for n in [*vorhanden, *neu])


def pfropfe(ziel: chess.pgn.GameNode, quelle: chess.pgn.GameNode) -> None:
    """Setzt alle Fortsetzungen von ``quelle`` unter ``ziel`` ein (gleiche Stellung vorausgesetzt).

    Gleiche Züge werden zusammengelegt (Kommentare und Zugzeichen vereinigt), neue Züge kommen
    als Nebenvariante hinzu. Die Hauptvariante von ``ziel`` bleibt Hauptvariante.
    """
    _vereinige_kommentar(ziel, quelle.comment)
    for kind in quelle.variations:
        gleich = next((v for v in ziel.variations if v.move == kind.move), None)
        if gleich is None:
            gleich = ziel.add_variation(kind.move, nags=set(kind.nags))
        else:
            gleich.nags |= kind.nags
        pfropfe(gleich, kind)


def finde_stellung(spiel: chess.pgn.Game, brett: chess.Board) -> chess.pgn.GameNode | None:
    """Der erste Knoten (Hauptlinie zuerst, dann Varianten) mit derselben Stellung und Zugseite."""
    gesucht = stellungsschluessel(brett)
    stapel: list[chess.pgn.GameNode] = [spiel]
    while stapel:
        knoten = stapel.pop(0)
        if stellungsschluessel(knoten.board()) == gesucht:
            return knoten
        stapel.extend(knoten.variations)
    return None


def fuehre_zusammen(ziel_pfad: Path, quell_pfad: Path) -> None:
    """Hängt das Beispiel aus ``quell_pfad`` in den Baum von ``ziel_pfad`` und verwirft die Quelle.

    Beispiel aus dem Buch: k10-a2 (Saavedra ab Abb. 10.2) in k10-a1 nach 2... Td5+.
    Sonderfälle: Kommt die Startstellung der Quelle im Ziel nicht vor, ist das ein Fehler.
    """
    ziel, quelle = lies(ziel_pfad), lies(quell_pfad)
    knoten = finde_stellung(ziel, quelle.board())
    if knoten is None:
        raise ValueError(f"Startstellung von {quell_pfad.name} kommt in {ziel_pfad.name} nicht vor")
    pfropfe(knoten, quelle)
    schreibe(ziel, ziel_pfad)
    setze_status(quell_pfad, STATUS_VERWORFEN)


def mit_vorlauf(quell_pfad: Path, vorlauf: chess.pgn.Game) -> None:
    """Setzt die Züge aus ``vorlauf`` bis zur Startstellung der Quelle vor das Beispiel.

    Warum: Eine Falle, die mitten in der Eröffnung beginnt (Abb. 4.32), soll ab der Grundstellung
    spielbar sein. Kommentare des Vorlaufs werden nicht übernommen; seine Abbildungen gehören
    zu ihrem eigenen Beispiel.
    """
    quelle = lies(quell_pfad)
    knoten = finde_stellung(vorlauf, quelle.board())
    if knoten is None:
        raise ValueError(f"Startstellung von {quell_pfad.name} kommt im Vorlauf nicht vor")
    zuege = [k.move for k in reversed(list(_vorfahren(knoten)))]
    neu = chess.pgn.Game()
    neu.setup(vorlauf.board())
    for schluessel, wert in quelle.headers.items():
        if schluessel not in ("FEN", "SetUp"):
            neu.headers[schluessel] = wert
    if vorlauf.board().fen() != chess.STARTING_FEN:
        neu.headers["FEN"], neu.headers["SetUp"] = vorlauf.board().fen(), "1"
    ende: chess.pgn.GameNode = neu
    for zug in zuege:
        ende = ende.add_variation(zug)
    pfropfe(ende, quelle)
    schreibe(neu, quell_pfad)


def _vorfahren(knoten: chess.pgn.GameNode):
    """Die Knoten vom gegebenen bis vor die Wurzel (ohne die Wurzel)."""
    while knoten.parent is not None:
        yield knoten
        knoten = knoten.parent


def knoten_am_pfad(spiel: chess.pgn.Game, pfad: list[str]) -> chess.pgn.GameNode:
    """Der Knoten nach den Zügen ``pfad`` (englische Kurznotation); fehlt ein Zug, ein Fehler."""
    knoten: chess.pgn.GameNode = spiel
    for san in pfad:
        zug = knoten.board().parse_san(san)
        naechster = next((v for v in knoten.variations if v.move == zug), None)
        if naechster is None:
            raise ValueError(f"Zug {san} fehlt nach {' '.join(pfad)}")
        knoten = naechster
    return knoten


def trenne_ab(quell_pfad: Path, pfad: list[str], ziel_pfad: Path, kennung: str, abschnitt: str) -> None:
    """Schneidet den Zweig, der mit dem letzten Zug von ``pfad`` beginnt, als eigenes Beispiel aus.

    Das neue Beispiel beginnt bei derselben Startstellung, mit den Zügen von ``pfad`` als Vorlauf
    (ohne deren Kommentare). Der Zweig verschwindet aus der Quelle.
    Beispiel aus dem Buch: k04-a6, Pfad ["e4", "c5"] → die Falle im Smith-Morra-Gambit (Abb. 4.27).
    """
    quelle = lies(quell_pfad)
    zweig = knoten_am_pfad(quelle, pfad)
    neu = chess.pgn.Game()
    neu.setup(quelle.board())
    for schluessel, wert in quelle.headers.items():
        neu.headers[schluessel] = wert
    neu.headers["Beispiel"], neu.headers["Abschnitt"] = kennung, abschnitt
    ende: chess.pgn.GameNode = neu
    for zug in [k.move for k in reversed(list(_vorfahren(zweig)))][:-1]:
        ende = ende.add_variation(zug)
    kopie = ende.add_variation(zweig.move, nags=set(zweig.nags))
    pfropfe(kopie, zweig)
    assert zweig.parent is not None
    zweig.parent.remove_variation(zweig)
    schreibe(neu, ziel_pfad)
    schreibe(quelle, quell_pfad)


def loesche_zweig(pfad_datei: Path, pfad: list[str]) -> None:
    """Löscht den Zweig, der mit dem letzten Zug von ``pfad`` beginnt (falsch angehängte Erwähnung)."""
    spiel = lies(pfad_datei)
    zweig = knoten_am_pfad(spiel, pfad)
    assert zweig.parent is not None
    zweig.parent.remove_variation(zweig)
    schreibe(spiel, pfad_datei)


def neues_beispiel(
    ziel_pfad: Path, fen: str, zuege: list[tuple[str, str]], kopf: dict[str, str], start_kommentar: str
) -> None:
    """Legt ein Beispiel ab einer Abbildung an: Züge mit Kommentar (etwa „Abb. 0.13“) und Zeichen.

    Eingabe ``zuege``: Paare (Zug in englischer Kurznotation mit Zeichen wie „Kd3!“, Kommentar).
    Beispiel aus dem Buch: Abb. 0.12 → 1. O-O → Abb. 0.13.
    """
    spiel = chess.pgn.Game()
    spiel.setup(chess.Board(fen))
    for schluessel, wert in kopf.items():
        spiel.headers[schluessel] = wert
    spiel.comment = start_kommentar
    knoten: chess.pgn.GameNode = spiel
    for san, kommentar in zuege:
        zeichen = re.search(r"[!?]+$", san)
        rein = san[: zeichen.start()] if zeichen else san
        knoten = knoten.add_variation(knoten.board().parse_san(rein), comment=kommentar)
        if zeichen:
            knoten.nags.add({"!": 1, "?": 2, "!!": 3, "??": 4, "!?": 5, "?!": 6}[zeichen.group()])
    spiel.headers["Status"] = STATUS_GEPRUEFT
    schreibe(spiel, ziel_pfad)


def setze_status(pfad: Path, status: str) -> None:
    """Setzt die Kopfzeile ``Status`` (entwurf, freigegeben, verworfen), sonst bleibt alles gleich."""
    text = pfad.read_text(encoding="utf-8")
    pfad.write_text(re.sub(r'\[Status "[^"]*"\]', f'[Status "{status}"]', text), encoding="utf-8")


def ergaenze(pfad_datei: Path, pfad: list[str], zugtext: str) -> None:
    """Fügt nach ``pfad`` Züge in PGN-Schreibweise ein, mit Varianten, Zeichen und Kommentaren.

    ``zugtext`` beginnt mit dem nächsten Zug, etwa ``"3... Sxe5 ( 3... Kf8 4. Kf6 )"`` in englischer
    Kurznotation (``"3... Nxe5"``). Gleiche Züge werden zusammengelegt (pfropfe), neue kommen als
    Nebenvariante dazu; ``zur_hauptlinie`` macht sie danach zur Hauptlinie.
    Beispiel aus dem Buch: k08-a4, nach 3. Kg6 die Abzweigung „3... Kf8 4. Kf6“.
    """
    spiel = lies(pfad_datei)
    knoten = knoten_am_pfad(spiel, pfad)
    fen = knoten.board().fen()
    stueck = chess.pgn.read_game(io.StringIO(f'[FEN "{fen}"]\n[SetUp "1"]\n\n{zugtext} *'))
    if stueck is None or stueck.errors:
        raise ValueError(f"Züge nicht lesbar nach {' '.join(pfad)}: {zugtext} ({stueck and stueck.errors})")
    pfropfe(knoten, stueck)
    schreibe(spiel, pfad_datei)


def zur_hauptlinie(pfad_datei: Path, pfad: list[str]) -> None:
    """Macht die Variante, die mit dem letzten Zug von ``pfad`` beginnt, zur Hauptlinie an ihrer Stelle.

    Warum: Die Pipeline macht den zuerst erwähnten Zug zur Hauptlinie; das Buch meint oft einen
    später genannten (Lösung nach dem Fehlversuch). Beispiel: k10-a1, 6. c8=T!! statt 6. c8=D??.
    """
    spiel = lies(pfad_datei)
    knoten = knoten_am_pfad(spiel, pfad)
    assert knoten.parent is not None
    knoten.parent.promote_to_main(knoten)
    schreibe(spiel, pfad_datei)


def setze_kopf(pfad_datei: Path, schluessel: str, wert: str) -> None:
    """Setzt eine Kopfzeile, etwa den Titel (``Event``: „Kapitel 2: Caro-Kann-Verteidigung“)."""
    spiel = lies(pfad_datei)
    spiel.headers[schluessel] = wert
    schreibe(spiel, pfad_datei)

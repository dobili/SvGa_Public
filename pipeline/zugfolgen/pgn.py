"""PGN-Dateien der Beispiele schreiben (Entwürfe) und lesen (freigegebene).

Wozu diese Datei da ist:
    Jedes Beispiel des Buches wird eine PGN-Datei in ``inhalte/de/zugfolgen/kapNN/`` (Konzept
    Abschnitt 3 und 4.2). Die Pipeline schreibt Entwürfe mit ``[Status "entwurf"]``; der Autor
    prüft sie und setzt ``[Status "freigegeben"]``. Eine freigegebene Datei wird nie überschrieben
    (Konzept Abschnitt 5, Schritt 3). Nur freigegebene Beispiele kommen in die Daten der App.

Aufbau einer Datei:
    [Event "Kapitel 1: Die drei Ziele in der Praxis: das London-System"]
    [Beispiel "k01-a2"] [Kapitel "1"] [Abschnitt "1.1"] [Status "entwurf"]
    [Abbildungen "1.2 1.3 1.4"]      [FEN "…"] [SetUp "1"], wenn nicht die Grundstellung
    1. d4 d5 2. Bf4 { Abb. 1.2 } Nf6 ( 2... e6 ) 3. e3 …
    Züge in englischer Kurznotation (PGN-Norm), Zugzeichen als NAG ($1 = !, $2 = ?, …),
    Abbildungen als Kommentar am Zug, an dem ihre Stellung erreicht ist.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import chess
import chess.pgn

from pipeline.befunde import Befund, Schwere
from pipeline.zugfolgen.baum import Beispiel, Knoten, stellungsschluessel

STATUS_ENTWURF = "entwurf"
STATUS_FREIGEGEBEN = "freigegeben"
STATUS_VERWORFEN = "verworfen"  # vom Autor verworfen: nie überschrieben, nie in der App
# Von Claude nach der Prüfung korrigiert, Freigabe des Autors steht aus: nie überschrieben, in der
# App nur mit --mit-entwuerfen (als Entwurf).
STATUS_GEPRUEFT = "geprueft"
# Von Claude konstruierte Partie zu einer Abbildung ohne Zugfolge im Buch (Entscheidung des Autors,
# 18.10.2026; pipeline/zugfolgen/konstruktion.py): nie überschrieben, immer in den Daten, in der App
# mit dem Hinweis „Zugfolge von einer KI konstruiert, nicht aus dem Buch“ (Regel 1: Das Buch ist die
# einzige Quelle, darum deutlich gekennzeichnet).
STATUS_KONSTRUIERT = "konstruiert"
_VOM_AUTOR = (STATUS_FREIGEGEBEN, STATUS_VERWORFEN, STATUS_GEPRUEFT, STATUS_KONSTRUIERT)
_NAG_JE_ZEICHEN = {"!": 1, "?": 2, "!!": 3, "??": 4, "!?": 5, "?!": 6}
_ZEICHEN_JE_NAG = {nag: zeichen for zeichen, nag in _NAG_JE_ZEICHEN.items()}
_ABBILDUNG_IM_KOMMENTAR = re.compile(r"Abb\. (\d+\.\d+)")


def schreibe_entwurf(beispiel: Beispiel, ordner: Path) -> tuple[Path, bool]:
    """Schreibt ein Beispiel als PGN-Entwurf; eine freigegebene oder verworfene Datei bleibt unangetastet.

    Ausgabe: der Pfad und ob geschrieben wurde.
    Beispiel: ``k01-a2`` → ``inhalte/de/zugfolgen/kap01/k01-a2.pgn``.
    """
    pfad = ordner / f"kap{beispiel.kapitel:02d}" / f"{beispiel.id}.pgn"
    if pfad.exists() and lies_status(pfad) in _VOM_AUTOR:
        return pfad, False
    pfad.parent.mkdir(parents=True, exist_ok=True)
    pfad.write_text(str(als_pgn(beispiel)) + "\n", encoding="utf-8")
    return pfad, True


def abweichung_von_der_datei(pfad: Path, beispiel: Beispiel) -> str | None:
    """Hat die freigegebene oder verworfene Datei andere Abbildungen als der neue Entwurf?

    Warum: Die Pipeline überschreibt solche Dateien nie. Ordnet sie später anders zu, soll der
    Autor das erfahren, statt dass der neue Vorschlag still liegen bleibt.
    Ausgabe: ein Satz für den Befund, oder None, wenn die Abbildungen gleich sind.
    """
    treffer = re.search(r'\[Abbildungen "([^"]*)"\]', pfad.read_text(encoding="utf-8"))
    in_datei = treffer.group(1).split() if treffer else []
    neu = beispiel.abbildungen()
    if sorted(in_datei) == sorted(neu):
        return None
    return (
        f"Neuer Entwurf zu {beispiel.id} hat andere Abbildungen ({' '.join(neu) or '–'}) als die "
        f"Datei mit Status „{lies_status(pfad)}“ ({' '.join(in_datei) or '–'})"
    )


def raeume_entwuerfe_auf(ordner: Path, kapitel: int, geschrieben: set[Path]) -> list[Path]:
    """Löscht Entwürfe eines Kapitels, die der aktuelle Lauf nicht mehr erzeugt hat.

    Warum: Ordnet das Nachspielen eine Zugfolge anders zu, kann ein Beispiel wegfallen (etwa ein
    Baum, der nur aus einer falsch angehängten Lösung bestand). Sein alter Entwurf darf dann nicht
    liegen bleiben. Freigegebene und verworfene Dateien bleiben immer erhalten.
    Ausgabe: die gelöschten Pfade.
    """
    geloescht = []
    for pfad in sorted((ordner / f"kap{kapitel:02d}").glob("*.pgn")):
        if pfad not in geschrieben and lies_status(pfad) not in _VOM_AUTOR:
            pfad.unlink()
            geloescht.append(pfad)
    return geloescht


def als_pgn(beispiel: Beispiel) -> chess.pgn.Game:
    """Baut das PGN-Spiel eines Beispiels mit Kopfzeilen, Varianten, Zugzeichen und Abbildungen."""
    spiel = chess.pgn.Game()
    spiel.setup(beispiel.wurzel.brett)
    spiel.headers["Event"] = f"Kapitel {beispiel.kapitel}: {beispiel.titel}"
    spiel.headers["Site"] = "Schach von Grund auf"
    spiel.headers["Beispiel"] = beispiel.id
    spiel.headers["Kapitel"] = str(beispiel.kapitel)
    spiel.headers["Abschnitt"] = beispiel.abschnitt or ""
    spiel.headers["Status"] = STATUS_ENTWURF
    spiel.headers["Abbildungen"] = " ".join(beispiel.abbildungen())
    if beispiel.wurzel.abbildungen:
        spiel.comment = _kommentar(beispiel.wurzel)
    _haenge_an(spiel, beispiel.wurzel)
    return spiel


def _haenge_an(pgn_knoten: chess.pgn.GameNode, knoten: Knoten) -> None:
    """Überträgt die Kinder eines Knotens in das PGN (Hauptvariante zuerst)."""
    for kind in knoten.kinder:
        assert kind.zug is not None
        neu = pgn_knoten.add_variation(kind.zug)
        if kind.zeichen in _NAG_JE_ZEICHEN:
            neu.nags.add(_NAG_JE_ZEICHEN[kind.zeichen])
        if kind.abbildungen:
            neu.comment = _kommentar(kind)
        _haenge_an(neu, kind)


def _kommentar(knoten: Knoten) -> str:
    return ", ".join(f"Abb. {nummer}" for nummer in knoten.abbildungen)


def lies_status(pfad: Path) -> str:
    """Der Status einer PGN-Datei: „entwurf“ (auch ohne Kopfzeile) oder „freigegeben“."""
    treffer = re.search(r'\[Status "([^"]*)"\]', pfad.read_text(encoding="utf-8"))
    return treffer.group(1) if treffer else STATUS_ENTWURF


@dataclass
class Freigegebenes:
    """Ein freigegebenes Beispiel als App-Daten plus die Verknüpfungen seiner Abbildungen."""

    daten: dict[str, Any]
    verknuepfungen: dict[str, list[str]]  # Abbildungsnummer → Pfad (Züge bis zur Stellung)
    befunde: list[Befund] = field(default_factory=list)


def lies_freigegebene(
    ordner: Path, kapitel: int, abbildungs_fen: dict[str, str], mit_entwuerfen: bool = False
) -> list[Freigegebenes]:
    """Liest alle freigegebenen PGN eines Kapitels und gleicht sie mit den Abbildungen ab.

    ``mit_entwuerfen`` nimmt auch Entwürfe mit (Status „entwurf“ in den Daten), damit der Autor
    sie bis zur Veröffentlichung in der App prüfen kann; verworfene bleiben immer draußen.
    Freigegebene stehen vorn, damit sie bei einer Abbildung in zwei Beispielen gewinnen.

    Schritt 4 „Zugfolgen abgleichen“ (Konzept Abschnitt 5): Illegale Züge meldet das Lesen als
    Fehler; eine Abbildung, deren Stellung am genannten Zug nicht erreicht ist, wird eine Warnung.
    Eingabe: Ordner ``inhalte/de/zugfolgen``, Kapitelnummer, Abbildungsnummer → FEN aus den Daten.
    """
    erlaubt = (
        (STATUS_FREIGEGEBEN, STATUS_KONSTRUIERT, STATUS_GEPRUEFT, STATUS_ENTWURF)
        if mit_entwuerfen
        else (STATUS_FREIGEGEBEN, STATUS_KONSTRUIERT)
    )
    dateien = sorted((ordner / f"kap{kapitel:02d}").glob("*.pgn"))
    ergebnis: list[Freigegebenes] = []
    for status in erlaubt:
        for pfad in dateien:
            if lies_status(pfad) == status:
                ergebnis.append(_lies_datei(pfad, kapitel, abbildungs_fen, _daten_status(status)))
    return ergebnis


def _daten_status(status: str) -> str:
    """Der Status in den App-Daten: freigegeben und konstruiert bleiben, alles andere ist Entwurf."""
    return status if status in (STATUS_FREIGEGEBEN, STATUS_KONSTRUIERT) else STATUS_ENTWURF


def _lies_datei(pfad: Path, kapitel: int, abbildungs_fen: dict[str, str], status: str) -> Freigegebenes:
    with pfad.open(encoding="utf-8") as datei:
        spiel = chess.pgn.read_game(datei)
    befunde: list[Befund] = []
    fundstelle = pfad.name
    if spiel is None:
        return Freigegebenes({}, {}, [Befund(Schwere.FEHLER, "pgn", "Datei nicht lesbar", fundstelle)])
    for fehler in spiel.errors:
        befunde.append(Befund(Schwere.FEHLER, "pgn-zug", str(fehler), fundstelle))
    verknuepfungen: dict[str, list[str]] = {}
    knoten_daten = _knoten_daten(spiel, [], abbildungs_fen, verknuepfungen, befunde, fundstelle)
    if status == STATUS_KONSTRUIERT:
        befunde.extend(_pruefe_konstruierte(spiel, abbildungs_fen, fundstelle))
    daten = {
        "id": spiel.headers.get("Beispiel", pfad.stem),
        "kapitel": kapitel,
        "abschnitt": spiel.headers.get("Abschnitt") or None,
        "titel": spiel.headers.get("Event", "").split(": ", 1)[-1],
        "startFen": spiel.board().fen(),
        "zuege": knoten_daten["weiter"],
        "abbildungen": [{"nummer": n, "pfad": p} for n, p in verknuepfungen.items()],
        "status": status,
    }
    return Freigegebenes(daten, verknuepfungen, befunde)


def genauer_schluessel(brett: chess.Board) -> str:
    """Stellung, Zugseite, Rochaderechte und ein schlagbarer En-passant-Bauer (ohne Zähler).

    Warum: Eine konstruierte Partie soll die Abbildung exakt erreichen (Wunsch des Autors), also
    strenger als ``stellungsschluessel``. En passant zählt nur, wenn das Schlagen auch legal ist.
    Beispiel: Grundstellung → „rnbqkbnr/… w KQkq -“.
    """
    return " ".join(brett.fen(en_passant="legal").split()[:4])


def _pruefe_konstruierte(
    spiel: chess.pgn.Game, abbildungs_fen: dict[str, str], fundstelle: str
) -> list[Befund]:
    """Eine konstruierte Partie beginnt in der Grundstellung und endet genau in ihrer Abbildung.

    Warum: Sie ersetzt keine Buchzugfolge, sondern führt nur zur Stellung des Buches hin; erreicht
    sie die Abbildung nicht exakt (Stellung, Zugrecht, Rochaderechte, en passant), ist sie falsch.
    Ausgabe: Fehler-Befunde (leer, wenn alles stimmt).
    Beispiel: k08-a25-k endet nach 38... Ke8 in der Stellung von Abb. 8.25.
    """
    befunde: list[Befund] = []
    if spiel.board().fen() != chess.STARTING_FEN:
        befunde.append(
            Befund(Schwere.FEHLER, "konstruiert", "beginnt nicht in der Grundstellung", fundstelle)
        )
    ende = spiel.end()
    nummern = _ABBILDUNG_IM_KOMMENTAR.findall(ende.comment)
    if not nummern:
        befunde.append(Befund(Schwere.FEHLER, "konstruiert", "letzter Zug ohne Abbildung", fundstelle))
    for nummer in nummern:
        fen = abbildungs_fen.get(nummer)
        if fen is None or genauer_schluessel(chess.Board(fen)) != genauer_schluessel(ende.board()):
            text = f"erreicht Abb. {nummer} nicht exakt"
            befunde.append(Befund(Schwere.FEHLER, "konstruiert", text, fundstelle, nummer))
    return befunde


def _knoten_daten(
    pgn_knoten: chess.pgn.GameNode,
    pfad: list[str],
    abbildungs_fen: dict[str, str],
    verknuepfungen: dict[str, list[str]],
    befunde: list[Befund],
    fundstelle: str,
) -> dict[str, Any]:
    """Wandelt einen PGN-Knoten samt Varianten in das Datenformat (Schema beispiel)."""
    brett = pgn_knoten.board()
    for nummer in _ABBILDUNG_IM_KOMMENTAR.findall(pgn_knoten.comment):
        fen = abbildungs_fen.get(nummer)
        if fen is None:
            befunde.append(
                Befund(Schwere.WARNUNG, "pgn-abbildung", f"Abb. {nummer} gibt es nicht", fundstelle, nummer)
            )
        elif stellungsschluessel(chess.Board(fen)) != stellungsschluessel(brett):
            befunde.append(
                Befund(
                    Schwere.WARNUNG,
                    "pgn-stellung",
                    f"Abb. {nummer} steht an einem Zug, der ihre Stellung nicht erreicht",
                    fundstelle,
                    nummer,
                )
            )
        else:
            verknuepfungen[nummer] = list(pfad)
    weiter = []
    for kind in pgn_knoten.variations:
        assert kind.move is not None
        san = pgn_knoten.board().san(kind.move)
        daten = _knoten_daten(kind, [*pfad, san], abbildungs_fen, verknuepfungen, befunde, fundstelle)
        daten = {
            "zug": san,
            "zeichen": next((_ZEICHEN_JE_NAG[n] for n in kind.nags if n in _ZEICHEN_JE_NAG), ""),
        } | daten
        weiter.append(daten)
    return {"abbildungen": _ABBILDUNG_IM_KOMMENTAR.findall(pgn_knoten.comment), "weiter": weiter}

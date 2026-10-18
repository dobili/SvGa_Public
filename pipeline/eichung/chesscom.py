"""Eichpartien von chess.com über die öffentliche Schnittstelle (api.chess.com/pub).

Vorgehen: Spieler aus den Länderlisten in fester, gemischter Reihenfolge, abwechselnd mit
Titelträgern (CM, NM, FM, WCM, WFM; ohne sie füllen sich die Bänder ab 2000 kaum); je Spieler die
Schnellschach-Wertung (nur sichere, Abweichung höchstens 100); fehlen im Band dieses Spielers noch
Partien, seine letzten Monate durchsehen. Eine Partie taugt, wenn sie gewertetes Schnellschach
aus der Grundstellung ist, beide Seiten mindestens zehn Züge gemacht haben, niemand die Partie
verlassen hat und chess.com die Genauigkeit beider Seiten berechnet hat (nur dann gibt es
„accuracies“). Höchstens drei Partien je Spieler.
"""

from __future__ import annotations

import io
import random
from collections.abc import Iterator

import chess.pgn

from .auswahl import HOECHSTE_ABWEICHUNG, JE_SPIELER, Eichpartie, Seite, band_von, genug_zuege
from .netz import hole_json

BASIS = "https://api.chess.com/pub"
LAENDER = ("DE", "AT", "CH", "US", "GB", "IN", "FR", "ES", "NL", "PL")
TITEL = ("CM", "NM", "WCM", "WFM", "FM")
MONATE_ZURUECK = 3
STARTWERT = 18102026
VERLASSEN = "abandoned"


def _liste(url: str, schluessel: str, zufall: random.Random) -> list[str]:
    antwort = hole_json(url)
    namen = list(antwort.get(schluessel, [])) if isinstance(antwort, dict) else []
    zufall.shuffle(namen)
    return namen


def _aus_listen(urls: list[str], zufall: random.Random) -> Iterator[str]:
    for url in urls:
        yield from _liste(url, "players", zufall)


def spieler(zufall: random.Random) -> Iterator[str]:
    """Spielernamen aus Länderlisten und Titellisten im Wechsel, gemischt (fester Startwert)."""
    laender = _aus_listen([f"{BASIS}/country/{land}/players" for land in LAENDER], zufall)
    titel = _aus_listen([f"{BASIS}/titled/{t}" for t in TITEL], zufall)
    quellen = [laender, titel]
    while quellen:
        for quelle in list(quellen):
            name = next(quelle, None)
            if name is None:
                quellen.remove(quelle)
            else:
                yield name


def schnellschach_wertung(name: str) -> int | None:
    """Aktuelle Schnellschach-Wertung, wenn sie sicher ist (Abweichung höchstens 100), sonst None."""
    werte = hole_json(f"{BASIS}/player/{name}/stats")
    letzte = werte.get("chess_rapid", {}).get("last") if isinstance(werte, dict) else None
    if not letzte or letzte.get("rd", HOECHSTE_ABWEICHUNG + 1) > HOECHSTE_ABWEICHUNG:
        return None
    return int(letzte["rating"])


def _zuege(pgn: str) -> list[str]:
    partie = chess.pgn.read_game(io.StringIO(pgn))
    if partie is None:
        return []
    brett = partie.board()
    zuege: list[str] = []
    for zug in partie.mainline_moves():
        zuege.append(brett.san(zug))
        brett.push(zug)
    return zuege


def eichpartie(spiel: dict, name: str) -> Eichpartie | None:
    """Die Partie als Eichpartie aus Sicht des Spielers ``name``, oder None, wenn sie nicht taugt."""
    genau = spiel.get("accuracies")
    if spiel.get("rules") != "chess" or spiel.get("time_class") != "rapid" or not spiel.get("rated"):
        return None
    if not genau or "initial_setup" in spiel and spiel["initial_setup"] != chess.STARTING_FEN:
        return None
    weiss, schwarz = spiel["white"], spiel["black"]
    if VERLASSEN in (weiss.get("result"), schwarz.get("result")):
        return None
    seite = "white" if weiss.get("username", "").lower() == name.lower() else "black"
    band = band_von(int((weiss if seite == "white" else schwarz)["rating"]))
    zuege = _zuege(spiel.get("pgn", ""))
    if band is None or not genug_zuege(len(zuege)):
        return None
    return Eichpartie(
        plattform="chesscom",
        kennung=spiel.get("uuid") or spiel["url"].rsplit("/", 1)[-1],
        bedenkzeit=spiel.get("time_control", ""),
        weiss=Seite(int(weiss["rating"]), genau.get("white")),
        schwarz=Seite(int(schwarz["rating"]), genau.get("black")),
        zuege=tuple(zuege),
        ergebnis=f"{weiss.get('result')}-{schwarz.get('result')}",
        band=band,
        seite=seite,
    )


def partien_von(name: str) -> list[Eichpartie]:
    """Bis zu drei taugliche Partien des Spielers aus seinen letzten drei Monaten, neueste zuerst."""
    archiv = hole_json(f"{BASIS}/player/{name}/games/archives")
    monate = list(archiv.get("archives", [])) if isinstance(archiv, dict) else []
    gefunden: list[Eichpartie] = []
    for monat in reversed(monate[-MONATE_ZURUECK:]):
        antwort = hole_json(monat)
        spiele = antwort.get("games", []) if isinstance(antwort, dict) else []
        for spiel in reversed(spiele):
            partie = eichpartie(spiel, name)
            if partie is not None:
                gefunden.append(partie)
            if len(gefunden) >= JE_SPIELER:
                return gefunden
    return gefunden

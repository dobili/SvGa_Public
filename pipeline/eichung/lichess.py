"""Eichpartien von Lichess über die öffentliche Schnittstelle (lichess.org/api).

Vorgehen: Spielernamen aus großen offenen Teams (neueste Mitglieder zuerst, also Spieler aller
Stärken), ihre Schnellschach-Wertung gesammelt abfragen (bis zu 300 Spieler je Anfrage; nur
sichere Wertungen, keine vorläufigen), dann bei Spielern aus Bändern, denen noch Partien fehlen,
die gewerteten, schon ausgewerteten Schnellschach-Partien holen. Lichess liefert dazu die
offizielle Genauigkeit beider Seiten (``accuracy=true``). Eine Partie taugt wie bei chess.com:
Grundstellung, beide Seiten mindestens zehn Züge, kein Abbruch, keine vorläufige Wertung.
Höchstens drei Partien je Spieler.
"""

from __future__ import annotations

import time
from collections.abc import Iterator

from .auswahl import HOECHSTE_ABWEICHUNG, JE_SPIELER, Eichpartie, Seite, band_von, genug_zuege
from .netz import hole_json, hole_zeilen

BASIS = "https://lichess.org/api"
TEAMS = ("lichess-swiss", "lichess-blitz", "lichess-rapid-team")
MITGLIEDER_JE_TEAM = 3000
JE_ABFRAGE = 300
PARTIEN_JE_SPIELER = 60
PAUSE_S = 1.0
UNTAUGLICHE_ENDEN = {"aborted", "noStart", "cheat", "unknownFinish"}


def spieler() -> Iterator[str]:
    """Namen aus den Teams, neueste Mitglieder zuerst; jeder Name nur einmal."""
    gesehen: set[str] = set()
    for team in TEAMS:
        for mitglied in hole_zeilen(f"{BASIS}/team/{team}/users?max={MITGLIEDER_JE_TEAM}"):
            name = mitglied.get("id")
            if name and name not in gesehen:
                gesehen.add(name)
                yield name
        time.sleep(PAUSE_S)


def schnellschach_wertungen(namen: list[str]) -> dict[str, int]:
    """Sichere Schnellschach-Wertung je Name (vorläufige und unsichere fallen weg)."""
    antwort = hole_json(f"{BASIS}/users", daten=",".join(namen).encode("utf-8"))
    time.sleep(PAUSE_S)
    wertungen: dict[str, int] = {}
    for nutzer in antwort if isinstance(antwort, list) else []:
        schnell = nutzer.get("perfs", {}).get("rapid", {})
        if schnell.get("prov") or schnell.get("rd", HOECHSTE_ABWEICHUNG + 1) > HOECHSTE_ABWEICHUNG:
            continue
        if "rating" in schnell:
            wertungen[nutzer["id"]] = int(schnell["rating"])
    return wertungen


def _seite(spieler_daten: dict) -> Seite | None:
    genau = spieler_daten.get("analysis", {}).get("accuracy")
    if genau is None or spieler_daten.get("provisional") or "rating" not in spieler_daten:
        return None
    return Seite(int(spieler_daten["rating"]), float(genau))


def eichpartie(spiel: dict, name: str) -> Eichpartie | None:
    """Die Partie als Eichpartie aus Sicht des Spielers ``name``, oder None, wenn sie nicht taugt."""
    if spiel.get("variant") != "standard" or spiel.get("speed") != "rapid" or not spiel.get("rated"):
        return None
    if spiel.get("status") in UNTAUGLICHE_ENDEN or spiel.get("initialFen"):
        return None
    weiss_roh, schwarz_roh = spiel["players"]["white"], spiel["players"]["black"]
    weiss, schwarz = _seite(weiss_roh), _seite(schwarz_roh)
    zuege = tuple(spiel.get("moves", "").split())
    if weiss is None or schwarz is None or not genug_zuege(len(zuege)):
        return None
    seite = "white" if weiss_roh.get("user", {}).get("id") == name else "black"
    band = band_von((weiss if seite == "white" else schwarz).wertung)
    if band is None:
        return None
    uhr = spiel.get("clock", {})
    return Eichpartie(
        plattform="lichess",
        kennung=spiel["id"],
        bedenkzeit=f"{uhr.get('initial', 0)}+{uhr.get('increment', 0)}",
        weiss=weiss,
        schwarz=schwarz,
        zuege=zuege,
        ergebnis=f"{spiel.get('status')}-{spiel.get('winner', 'remis')}",
        band=band,
        seite=seite,
    )


def partien_von(name: str) -> list[Eichpartie]:
    """Bis zu drei taugliche, schon ausgewertete Schnellschach-Partien des Spielers, neueste zuerst."""
    url = (
        f"{BASIS}/games/user/{name}?max={PARTIEN_JE_SPIELER}&rated=true&perfType=rapid"
        "&analysed=true&accuracy=true&evals=false&opening=false"
    )
    gefunden: list[Eichpartie] = []
    for spiel in hole_zeilen(url):
        partie = eichpartie(spiel, name)
        if partie is not None:
            gefunden.append(partie)
        if len(gefunden) >= JE_SPIELER:
            break
    time.sleep(PAUSE_S)
    return gefunden

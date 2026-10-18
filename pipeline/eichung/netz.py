"""Abfragen bei chess.com und Lichess: nacheinander, mit Kennung, mit Warten bei Überlast.

Regeln (Entscheidung 6 vom 18.10.2026 und Vorgaben der Plattformen): Anfragen nie gleichzeitig;
als Kennung nur der Name der Website, keine Adresse; bei „429 Too Many Requests“ eine Minute
warten und neu versuchen. Lichess bittet zusätzlich um eine kleine Pause zwischen den Anfragen.
"""

from __future__ import annotations

import json
import time
import urllib.error
import urllib.request
from collections.abc import Iterator

KENNUNG = "schach-von-grund-auf.com"
WARTEN_BEI_UEBERLAST_S = 61
WARTEN_BEI_FEHLER_S = 5
VERSUCHE = 4
ZEITGRENZE_S = 60
NICHT_GEFUNDEN = 404
UEBERLAST = 429


class Abfragefehler(RuntimeError):
    """Eine Abfrage ist nach allen Versuchen gescheitert."""


def _oeffne(url: str, annahme: str, daten: bytes | None = None):
    """Öffnet die Adresse; None bei 404. Wartet bei 429 und vorübergehenden Fehlern."""
    kopf = {"User-Agent": KENNUNG, "Accept": annahme}
    if daten is not None:
        kopf["Content-Type"] = "text/plain"
    letzter: Exception | None = None
    for _ in range(VERSUCHE):
        try:
            anfrage = urllib.request.Request(url, data=daten, headers=kopf)
            return urllib.request.urlopen(anfrage, timeout=ZEITGRENZE_S)
        except urllib.error.HTTPError as fehler:
            if fehler.code == NICHT_GEFUNDEN:
                return None
            letzter = fehler
            time.sleep(WARTEN_BEI_UEBERLAST_S if fehler.code == UEBERLAST else WARTEN_BEI_FEHLER_S)
        except (urllib.error.URLError, TimeoutError, ConnectionError) as fehler:
            letzter = fehler
            time.sleep(WARTEN_BEI_FEHLER_S)
    raise Abfragefehler(f"{url}: {letzter}")


def hole_json(url: str, daten: bytes | None = None) -> dict | list | None:
    """Eine JSON-Antwort, oder None, wenn es die Adresse nicht gibt."""
    antwort = _oeffne(url, "application/json", daten)
    if antwort is None:
        return None
    with antwort:
        return json.loads(antwort.read().decode("utf-8"))


def hole_zeilen(url: str) -> Iterator[dict]:
    """Eine Antwort mit einem JSON-Objekt je Zeile (Lichess, „ndjson“), Zeile für Zeile."""
    antwort = _oeffne(url, "application/x-ndjson")
    if antwort is None:
        return
    with antwort:
        for zeile in antwort:
            if zeile.strip():
                yield json.loads(zeile.decode("utf-8"))

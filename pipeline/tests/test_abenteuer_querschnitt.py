"""Dauertest der Querschnittsprüfungen aus AP8a (Gutachten des Autors, 24.11.2026).

Warum: Die Prüfungen kamen mit Befunden auf die Welt; behoben werden sie in Welle 2. Bis dahin hält
dieser Test den Stand vom 24.11.2026 als Obergrenze fest: Die Zahl der Befunde je Prüfung darf nur
sinken, nie steigen. Wer Befunde behebt, senkt die Zahl hier mit (Ziel 0). Ausnahmen stehen mit
Grund im jeweiligen Werkzeug, nicht hier.

Alle Prüfungen laufen ohne das private Paket (gespeicherte Zahlen in ``katalog_korrekturen``).
"""

import pytest

pytest.importorskip("PIL.Image")  # Pillow fehlt in Actions (kartenbild, belebungsvorschau)

from pipeline.abenteuer import kronenhoehe, proportionen, untergrund, waldrand, wiederholung  # noqa: E402
from pipeline.abenteuer import zusammenhang_enden as z  # noqa: E402
from pipeline.abenteuer.deckrahmen import lade as lade_rahmen  # noqa: E402
from pipeline.abenteuer.moebelliste import lade_moebel  # noqa: E402

# Prüfung → höchstens so viele Befunde (Stand 24.11.2026 nach Welle 2: alle 0).
OBERGRENZE = {
    "kronenhoehe": 0,
    "zusammenhang_enden": 0,
    "waldrand": 0,
    "wiederholung": 0,
    "untergrund": 0,
    "proportionen_aussen": 0,
    "proportionen_unscharf": 0,
}


def _enden() -> list[str]:
    katalog = lade_moebel()
    szenen = proportionen.lade_szenen()
    return [b for name, szene in szenen.items() for b in z.pruefe_szene(name, szene, katalog)]


PRUEFUNGEN = {
    "kronenhoehe": lambda: kronenhoehe.pruefe(),
    "zusammenhang_enden": _enden,
    "waldrand": waldrand.pruefe,
    "wiederholung": wiederholung.pruefe,
    "untergrund": untergrund.pruefe,
    "proportionen_aussen": lambda: proportionen.pruefe_aussen(
        proportionen.lade_szenen(), proportionen.lade_katalog(), lade_rahmen()
    ),
    "proportionen_unscharf": lambda: proportionen.pruefe_unscharf(
        proportionen.lade_szenen(), proportionen.lade_katalog()
    ),
}


@pytest.mark.parametrize("name", sorted(OBERGRENZE))
def test_befunde_nur_weniger(name):
    befunde = PRUEFUNGEN[name]()
    assert len(befunde) <= OBERGRENZE[name], (
        f"{name}: {len(befunde)} Befunde, erlaubt höchstens {OBERGRENZE[name]}. Neue Stelle beheben "
        f"oder mit Grund ins Werkzeug; Beispiele: {[str(b) for b in befunde[:5]]}"
    )


def test_untergrund_steht_im_katalog():
    # Das neue Katalogfeld ist gesetzt (untergrund.py --messen), nur mit bekannten Werten.
    werte = {a["untergrund"] for a in lade_moebel().values() if "untergrund" in a}
    assert werte and werte <= {"gras", "wasser", "erde", "stein", "innen"}


def test_gleis_endet_am_prellbock_nicht_frei():
    # Gleis von x 5 bis 9 mitten in der Karte: links frei, rechts am Prellbock oder Bahnübergang gut.
    zeilen = ["." * 20] * 10
    assert not z._gleis_endet_gut([(5, 5)], (-1, 0), zeilen, set(), set(), set())
    assert z._gleis_endet_gut([(9, 5)], (1, 0), zeilen, set(), {(10, 5)}, set())
    assert z._gleis_endet_gut([(9, 5)], (1, 0), zeilen, {(12, 5)}, set(), set())
    assert z._gleis_endet_gut([(9, 5)], (1, 0), ["." * 11] * 10, set(), set(), set())  # Kartenrand

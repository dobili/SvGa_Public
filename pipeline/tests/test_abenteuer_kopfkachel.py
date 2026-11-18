"""Tests für die Kopfkacheln (``pipeline/abenteuer/kopfkachel.py``).

Warum: Seit dem 18.11.2026 sperren Figuren in der App nur noch ihre Fußkachel; vorher sperrte ein
hohes Figurenbild auch die Kachel darüber. Die Tests halten fest, dass dadurch auf keiner Karte ein
Bereich erreichbar wurde, den die Figur vorher verschloss (hinter einem Lehrertisch, neben einem
Automaten), und dass die Prüfung neue Bereiche, Abkürzungen und harmlose Kacheln unterscheidet.

Aufruf: ``python -m pytest pipeline/tests/test_abenteuer_kopfkachel.py``
"""

from pipeline.abenteuer.kopfkachel import UMWEG_AB, bericht, pruefe, pruefe_szene

# Zwei Räume, dazwischen eine Wand mit einer Lücke, die zwei Kacheln hoch ist (Reihen 2 und 3).
ZWEI_RAEUME = [
    "#########",
    "#...#...#",
    "#.......#",
    "#.......#",
    "#...#...#",
    "#########",
]
# Dieselben Räume mit einer zweiten Lücke weit unten: Der rechte Raum war schon vorher erreichbar.
ZWEI_LUECKEN = ZWEI_RAEUME[:5] + ["#...#...#", "#.......#", "#########"]
RECHTER_RAUM = {(x, y) for x in (5, 6, 7) for y in (1, 2, 3, 4)}


def _szene(zeilen: list[str], figuren: list[dict]) -> dict:
    start = {"name": "start", "feld": [1, 1]}
    return {"karte": "test.raum", "raster": zeilen, "objekte": [], "ausloeser": [start], "figuren": figuren}


def _pruefe(zeilen: list[str], figuren: list[dict]):
    return pruefe_szene(_szene(zeilen, figuren), {}, set(), "test-raum")


def test_keine_karte_hat_einen_neuen_bereich():
    """Alle Szenen: Über keiner Figur öffnet sich ein Bereich, der vorher verschlossen war."""
    assert [(b.szene, sorted(b.bereich)) for b in pruefe() if b.bereich] == []


def test_figur_in_der_luecke_oeffnet_den_raum_dahinter():
    befund = _pruefe(ZWEI_RAEUME, [{"name": "waechter", "feld": [4, 3]}])
    assert befund.bereich == RECHTER_RAUM
    (kopf,) = befund.neu
    assert (kopf.figur, kopf.feld, kopf.erreichbar, kopf.umweg) == ("waechter", (4, 2), True, None)
    assert any("NEUER BEREICH, 12 Felder" in z for z in bericht([befund], alle=False))


def test_zweiter_weg_macht_aus_dem_bereich_eine_abkuerzung():
    befund = _pruefe(ZWEI_LUECKEN, [{"name": "waechter", "feld": [4, 3]}])
    assert befund.bereich == set()
    (kopf,) = befund.neu
    assert kopf.umweg is not None and kopf.umweg >= UMWEG_AB
    assert befund.abkuerzungen == [kopf]


def test_frei_stehende_figur_ist_harmlos():
    befund = _pruefe(ZWEI_LUECKEN, [{"name": "gast", "feld": [2, 3], "sitzt": "unten"}])
    (kopf,) = befund.neu
    assert (kopf.feld, kopf.sitzt, kopf.erreichbar) == ((2, 2), True, True)
    assert kopf.umweg is not None and kopf.umweg < UMWEG_AB
    assert not befund.auffaellig
    assert bericht([befund], alle=False) == [
        "1 neu begehbare Kopfkacheln in 1 Szenen, 0 Szenen mit Abkürzung, 0 mit neuem Bereich."
    ]


def test_kopfkachel_in_der_wand_oder_unter_einer_figur_zaehlt_nicht():
    figuren = [{"name": "oben", "feld": [2, 1]}, {"name": "unten", "feld": [2, 2]}]
    assert _pruefe(ZWEI_RAEUME, figuren).neu == []


def test_sperren_schliesst_den_bereich_wieder():
    szene = _szene(ZWEI_RAEUME, [{"name": "waechter", "feld": [4, 3]}])
    szene["sperren"] = [[4, 2]]
    befund = pruefe_szene(szene, {}, set(), "test-raum")
    assert befund.neu == [] and befund.bereich == set()

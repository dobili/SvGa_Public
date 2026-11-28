"""Tests für die feinen Katalogmasken nach der Standfläche (KARTENREGELN 10.88, ``feinmasken.py``).

Warum: Grundsatz des Autors (16.11.2026): Hinter Lehnen, Lampen und Baumkronen kann man optisch
entlanggehen; gesperrt wird nur die Standfläche. Die Tests prüfen das Verfahren an Kunstbildern, den
Katalog an typischen Möbeln (ohne Bilder, also auch in GitHub Actions) und die Übernahme der
Katalogmaske in Kartenbau und Form (``objektform.geformt``).
"""

import json

from pipeline.abenteuer import feinmasken
from pipeline.abenteuer.feinmasken import (
    FELD_GROB,
    FELD_HAND,
    alte_zellen,
    deckende_zellen,
    gruppe,
    vorschlag,
)
from pipeline.abenteuer.katalogfeld import setze
from pipeline.abenteuer.kollisionfein import Z, grob_aus_fein
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.objektform import geformt

DECKEND, LEER = 255, 0
# Typische Möbel mit Lehne oder hohem oberen Teil: Die obere Hälfte des Bildes bleibt frei.
TYPISCHE = ("cc4StuhlVorn", "mf8SchulstuhlVorn", "mf3StuhlDunkelLinks", "mf4Gartenbank", "mf4Laterne")


def _bild(breite: int, hoehe: int, deckend) -> bytes:
    """Alphakanal eines Kunstbilds: ``deckend(x, y)`` sagt, welche Pixel deckend sind."""
    return bytes(DECKEND if deckend(x, y) else LEER for y in range(hoehe) for x in range(breite))


def _zellen(maske: list[str]) -> set[tuple[int, int]]:
    return {(x, y) for y, zeile in enumerate(maske) for x, c in enumerate(zeile) if c == "#"}


def test_stuhl_sperrt_nur_die_untere_haelfte():
    """Stuhl 16 × 32, deckend in den Reihen 1 bis 21: Lehne frei, gesperrt die Reihen 16 bis 24."""
    stuhl = {"breite": 16, "hoehe": 32, "kollision": True, "art": "stuhl"}
    fein = vorschlag("stuhl", stuhl, _bild(16, 32, lambda x, y: 1 <= y <= 21))
    assert fein is not None and len(fein) == 2 * Z
    assert all(set(z) == {"."} for z in fein[:Z])  # obere Kachel (Lehne) frei
    assert {y for _, y in _zellen(fein)} == {4, 5}


def test_lampe_sperrt_nur_den_fuss_und_baum_nur_den_stamm():
    lampe = {"breite": 16, "hoehe": 48, "kollision": True, "art": "lampe"}
    fein = vorschlag("lampe", lampe, _bild(16, 48, lambda x, y: 6 <= x < 10 or y >= 44))
    assert {y for _, y in _zellen(fein)} == {10, 11}
    baum = {"breite": 64, "hoehe": 64, "kollision": True, "art": "baum"}
    krone_und_fleck = _bild(64, 64, lambda x, y: y < 48 or (28 <= x < 36) or y >= 58)
    spalten = {x for x, _ in _zellen(vorschlag("baum", baum, krone_und_fleck))}
    assert spalten and max(spalten) - min(spalten) < 6  # nur die Mitte, nicht der ganze Erdfleck


def test_nur_verfeinern_und_ausnahmen():
    """Eine Katalogmaske ist eine Entscheidung: Was sie frei lässt, bleibt frei."""
    tor = {"breite": 32, "hoehe": 32, "kollision": True, "art": "kiste", "maske": ["..", "#."]}
    fein = vorschlag("tor", tor, _bild(32, 32, lambda x, y: True))
    assert fein is None or _zellen(fein) <= alte_zellen(tor)
    assert gruppe({"kollision": True, "art": "gebaeude"}) is None
    assert gruppe({"kollision": False, "art": "stuhl"}) is None
    assert gruppe({"kollision": True, "art": "sofa", "frei_unten": 1}) is None
    assert gruppe({"kollision": True, "art": "stuhl", FELD_GROB: "Grund"}) is None
    assert gruppe({"kollision": True}, "parkbank") == "sitz"


def test_deckende_zellen_zaehlen_pixel():
    assert deckende_zellen(_bild(4, 4, lambda x, y: True), 4, 4) == {(0, 0): 16}
    assert deckende_zellen(_bild(8, 4, lambda x, y: x == 5), 8, 4) == {(1, 0): 4}


def test_katalog_typische_moebel_oben_frei():
    """Für typische Möbel mit Lehne oder Mast sind die oberen drei Achtel des Bildes frei (Lehne,
    Mast; seit der Kontur vom 28.11.2026 sperrt bei Seitenstühlen die ganze Sitzfläche,
    konturkollision.py)."""
    moebel = lade_moebel()
    for name in TYPISCHE:
        fein = moebel[name]["maske_fein"]
        assert all(set(z) == {"."} for z in fein[: len(fein) * 3 // 8]), name
        assert any("#" in z for z in fein), name


def test_katalog_feine_masken_im_raster_und_innerhalb_der_alten():
    for name, angabe in lade_moebel().items():
        fein = angabe.get("maske_fein")
        if fein is None:
            continue
        assert FELD_GROB not in angabe, name
        spalten, reihen = max(1, angabe["breite"] // 16) * Z, max(1, angabe["hoehe"] // 16) * Z
        assert len(fein) == reihen and {len(z) for z in fein} == {spalten}, name
        if FELD_HAND not in angabe:
            assert _zellen(fein) <= alte_zellen(angabe), name


def test_geformt_nimmt_katalogmaske_nur_ohne_massstab_und_eigene_maske():
    stuhl = {
        "breite": 16,
        "hoehe": 32,
        "kollision": True,
        "maske_fein": ["...."] * 4 + ["##..", "##.."] + ["...."] * 2,
    }
    ohne = geformt(stuhl, {"moebel": "s", "feld": [0, 0]})
    assert ohne["maske"] == grob_aus_fein(stuhl["maske_fein"]) == [".", "#"]
    gespiegelt = geformt(stuhl, {"moebel": "s", "feld": [0, 0], "spiegeln": True})
    assert gespiegelt["maske_fein"][4] == "..##"
    assert "maske_fein" not in geformt(stuhl, {"moebel": "s", "feld": [0, 0], "massstab": 2})
    eigene = geformt(stuhl, {"moebel": "s", "feld": [0, 0], "maske": ["#", "."]})
    assert "maske_fein" not in eigene and eigene["maske"] == ["#", "."]


def test_katalogfeld_setzt_nur_das_feld():
    text = '{\n  "moebel": {\n    "a": {\n      "breite": 16,\n      "platte": [1, 2, 3, 4]\n    }\n  }\n}\n'
    neu = setze(text, "a", "maske_fein", ["#...", "...."])
    assert json.loads(neu)["moebel"]["a"]["maske_fein"] == ["#...", "...."]
    assert '      "platte": [1, 2, 3, 4],\n      "maske_fein": ["#...", "...."]\n' in neu
    assert setze(neu, "a", "maske_fein", None) == text


def test_regeln_decken_alle_gruppen():
    assert set(feinmasken.GRUPPEN) | {"sonst"} == set(feinmasken.REGELN)

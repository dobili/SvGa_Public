"""Tests für pipeline/abenteuer/konturkollision.py (Kollision und Zeichentiefe nach der Kontur,
KARTENREGELN 10.95): Sitzfläche aus dem Bild, alte und neue Sortierlinie, Bodenebene, Handangaben,
und der Pilot Maple Falls bleibt ohne offenen Befund (nur Handprüfung der Villa)."""

from pipeline.abenteuer.konturkollision import (
    BODEN,
    alte_linie,
    feine_maske,
    ist_boden,
    linienbefund,
    mittellinie,
    moebel_der_orte,
    vorschlaege,
    vorschlag,
    zellen_der_rechtecke,
)
from pipeline.abenteuer.konturkollision_sitz import sitzflaeche
from pipeline.abenteuer.moebelliste import lade_moebel

DECKEND = 255


def _bild(breite: int, hoehe: int, deckend) -> bytes:
    """Alphakanal eines Kunstbilds: ``deckend(x, y)`` sagt, welche Pixel deckend sind."""
    return bytes(DECKEND if deckend(x, y) else 0 for y in range(hoehe) for x in range(breite))


def _seitenstuhl(x: int, y: int) -> bool:
    """Wie mf3StuhlDunkelLinks: Lehne rechts (Spalten 10 bis 13, Reihen 1 bis 7), Sitz 8 bis 21."""
    return (10 <= x <= 13 and 1 <= y <= 7) or (1 <= x <= 13 and 8 <= y <= 21)


def test_sitzflaeche_sperrt_den_sitz_und_laesst_die_lehne_frei():
    zellen = sitzflaeche(_bild(16, 32, _seitenstuhl), 16, 32)
    assert {y for _, y in zellen} == {3, 4, 5}
    assert all(y >= 3 for _, y in zellen)  # die Lehne (Reihen 1 bis 7) sperrt nicht
    assert mittellinie(zellen) == 18


def test_vorschlag_fuer_einen_seitenstuhl_mit_alter_maske():
    angabe = {
        "breite": 16,
        "hoehe": 32,
        "kollision": True,
        "art": "stuhl",
        "maske_fein": ["...."] * 4 + ["####", "..#."] + ["...."] * 2,
    }
    kontur = vorschlag("probe", angabe, _bild(16, 32, _seitenstuhl))
    assert kontur.neue_sperre and kontur.sortierlinie == 18
    assert feine_maske(kontur.sperre, 16, 32)[3] == "####"
    # Von Hand gesetzt: kein neuer Vorschlag.
    hand = {**angabe, "maske_fein_von_hand": "Grund"}
    assert not vorschlag("probe", hand, _bild(16, 32, _seitenstuhl)).neue_sperre


def test_alte_linie_wie_die_app():
    assert alte_linie({"breite": 16, "hoehe": 64}) == 56
    villa = {"breite": 48, "hoehe": 64, "maske": ["...", "###", "#.#", "..."]}
    assert alte_linie(villa) == 24


def test_linienbefund_meldet_zu_tief_und_zu_hoch():
    sperre = {(0, 4), (0, 5)}  # Pixel 16 bis 24
    assert linienbefund(sperre, 56)[0] == 24
    assert linienbefund(sperre, 4)[0] == 24
    assert linienbefund(sperre, 24) == (None, None)


def test_bodenebene_fuer_treppen_nicht_fuer_loecher():
    assert ist_boden("treppeZumBetrachter", {"art": "treppe"})
    assert not ist_boden("mf15TreppeLochZimmer", {"art": "treppe"})
    assert not ist_boden("svHausMitTreppe", {"art": "gebaeude"})
    kontur = vorschlag("treppeZumBetrachter", {"breite": 48, "hoehe": 96, "kollision": True, "art": "treppe"})
    assert kontur.ebene == BODEN


def test_zellen_der_rechtecke():
    assert zellen_der_rechtecke([[0, 0, 8, 4]]) == {(0, 0), (1, 0)}
    assert zellen_der_rechtecke([[0, 0, 5, 4]]) == {(0, 0)}  # Mitte der zweiten Zelle (6) liegt außen


def test_pilot_maple_falls_ohne_offenen_befund():
    """Nach dem Pilot (28.11.2026) bleibt in Maple Falls nur die Villa Whitlock zur Handprüfung."""
    moebel = lade_moebel()
    konturen = vorschlaege(moebel_der_orte(["mapleFalls"]), moebel)
    offen = {
        n: k.befunde for n, k in konturen.items() if not all(b.startswith("von Hand") for b in k.befunde)
    }
    assert offen == {}
    assert moebel["treppeZumBetrachter"].get("ebene") == BODEN

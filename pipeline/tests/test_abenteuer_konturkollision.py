"""Tests für pipeline/abenteuer/konturkollision.py (Kollision und Zeichentiefe nach der Kontur,
KARTENREGELN 10.95): Sitzfläche aus dem Bild, Draufsicht (Tische, Längszäune, Betten, Phase 2A),
alte und neue Sortierlinie, Bodenebene, Handangaben, und der Pilot Maple Falls bleibt ohne offenen
Befund (nur Handprüfung der Villa); dazu die Z-Prüfung aller Karten (konturkollision_tiefe.py,
Phase 2C) als Dauertest „0 Befunde“."""

from pipeline.abenteuer.konturkollision import (
    BODEN,
    Kontur,
    alte_linie,
    feine_maske,
    handkontur,
    ist_boden,
    linienbefund,
    mittellinie,
    moebel_der_orte,
    vorschlaege,
    vorschlag,
    zellen_der_rechtecke,
)
from pipeline.abenteuer.konturkollision_arten import artbefund, laengs, liegeflaeche
from pipeline.abenteuer.konturkollision_sitz import ohne_lehne, sitzflaeche
from pipeline.abenteuer.konturkollision_tiefe import app_tiefe, betretbar, steht_dahinter
from pipeline.abenteuer.konturkollision_tiefe import pruefe as pruefe_z
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


def test_keine_kiste_als_steg():
    """„kisteGrau“ enthält „steg“ (ki-steg-rau), ist aber kein Boden (Phase 2C, 28.11.2026)."""
    assert not ist_boden("kisteGrau", {"kollision": True})


def test_handkontur_mit_kollision_linie_und_leerer_sperre():
    hand = {"sperre": [], "kollision": True, "sortierlinie": 44, "grund": "Probe"}
    kontur = handkontur(Kontur("boot", set(), 56), hand, {"breite": 32, "hoehe": 64})
    assert kontur.kollision and kontur.sortierlinie == 44 and kontur.neue_sperre
    assert set("".join(feine_maske(kontur.sperre, 32, 64))) == {"."}
    # Steht alles schon im Katalog, gibt es keinen Befund mehr.
    fertig = {"breite": 32, "hoehe": 64, "kollision": True, "sortierlinie": 44}
    assert not handkontur(Kontur("boot", set(), 56), hand, fertig).befunde


def test_tiefe_wie_die_app():
    stueck = {"name": "x", "x": 0, "y": 100, "breite": 16, "hoehe": 64, "tiefe": 156}
    assert app_tiefe(stueck, {"sortierlinie": 60}) == 160
    assert app_tiefe(stueck, {"ebene": "boden"}) == 1
    assert app_tiefe({**stueck, "tiefe": 1}, {}) == 1  # flach (ohne Kollision)
    assert app_tiefe(stueck, {}) == 156  # Bildunterkante minus halbe Kachel


def test_steht_dahinter_wie_heldtiefe():
    wange = {(x, 10) for x in range(8)}  # Sperre in Pixelreihe 40 bis 44, Spalten 0 bis 32
    assert steht_dahinter(wange, 16, 30)  # darüber im Lauf der Treppe: die Wange reicht tiefer
    assert not steht_dahinter(wange, 16, 50)  # davor
    assert not steht_dahinter(wange, 60, 40)  # daneben


def test_betretbar_nach_art_und_name():
    assert betretbar("gt27SaloonTreppe", {"art": "treppe"})
    assert betretbar("dd6Bruecke1879", {"art": "bruecke"})
    assert not betretbar("pd6Turnmatte", {"art": "deko"})  # Mattenstapel, keine Matte am Boden
    assert not betretbar("kisteGrau", {})


def test_z_pruefung_ohne_befund():
    """Dauertest (Auftrag des Autors, 28.11.2026: „lag eine Treppe über dem Helden“): Kein Bild liegt
    über dem Helden, der darauf steht, und kein aufrechtes Bild unter ihm, wenn er dahinter steht."""
    assert [b.text() for b in pruefe_z()] == []


def _rundtisch(x: int, y: int) -> bool:
    """Tisch 32 × 32: Platte von Pixel 6 bis 23, Beine bis 29 (wie ca7Rundtisch)."""
    return (2 <= x <= 29 and 6 <= y <= 23) or (x in (4, 5, 26, 27) and 24 <= y <= 29)


def test_draufsicht_tisch_sperrt_die_ganze_platte():
    """Phase 2A: Die Platte sperrt ab der Zelle unter der hinteren Kante, nicht nur die untere
    Kachel (man steht nicht hinter der Tischplatte im Tisch)."""
    alt = {(x, y) for x in range(8) for y in range(4, 8)}
    bild = _bild(32, 32, _rundtisch)
    neu, grund, befund, linie = artbefund("probe", {"breite": 32, "hoehe": 32, "art": "tisch"}, bild, alt)
    assert {y for _, y in neu} == {2, 3, 4, 5, 6, 7} and alt <= neu
    assert "Draufsicht (platte)" in befund and "Platte" in grund and linie == 16
    # Buden mit Dach und Ausnahmen mit Grund bleiben, wie sie sind.
    assert artbefund("probe", {"breite": 32, "hoehe": 32, "art": "stand"}, bild, alt) is None
    assert artbefund("ca27Cafetisch", {"breite": 32, "hoehe": 32, "art": "tisch"}, bild, alt) is None


def test_laengszaun_aber_kein_pfosten_und_keine_mauer():
    assert laengs("gt7ZaunML", (6, 0, 10, 16))
    assert not laengs("mf4Poller", (6, 2, 10, 16))
    assert not laengs("wr5Mauer", (0, 0, 16, 48))  # Mauer von vorn in einer Ost-West-Reihe


def test_bett_liegeflaeche_ohne_kopfpfosten():
    def bett(x: int, y: int) -> bool:
        return (x <= 2 and 2 <= y <= 30) or (3 <= x <= 45 and 8 <= y <= 30)

    zellen = liegeflaeche(_bild(48, 32, bett), 48, 32)
    assert min(y for _, y in zellen) * 4 >= 8 + 3  # Pfosten (ab Pixel 2) und hintere Kante frei


def test_bank_ohne_lehne_und_laengs():
    assert ohne_lehne(14, 46)  # flache Bank von vorn
    assert ohne_lehne(46, 14)  # Bank längs
    assert not ohne_lehne(14, 14, flach_moeglich=False)  # Stuhl von hinten: Lehne vorn
    assert not ohne_lehne(22, 14)  # Stuhl


def test_handangabe_mit_sortierlinie_und_teilbereichen():
    """Phase 2B: Handangaben tragen Sortierlinie und Teilbereiche (Veranda der Villa) mit."""
    hand = {
        "sperre": [[0, 16, 32, 48]],
        "sortierlinie": 60,
        "teilbereiche": [{"rechteck": [0, 0, 16, 48], "sortierlinie": 40}],
        "grund": "Probe",
    }
    kontur = handkontur(Kontur("probe", set(), 56), hand, {"breite": 32, "hoehe": 64})
    assert kontur.neue_sperre and kontur.sortierlinie == 60
    assert kontur.teilbereiche == hand["teilbereiche"]
    assert kontur.befunde
    fertig = {"sortierlinie": 60, "teilbereiche": hand["teilbereiche"]}
    assert handkontur(Kontur("probe", kontur.sperre, 56), hand, fertig).befunde == []


def test_gebaeude_akt_1_bis_2_ohne_offenen_befund():
    """Phase 2B (28.11.2026): Die Gebäude von Cedar Creek bis Port Delacroix stehen im Katalog wie in
    kontur_hand.json; die Villa in Port Delacroix hat ihre Teilbereiche."""
    moebel = lade_moebel()
    orte = ["cedarCreek", "riverton", "ironwood", "portDelacroix", "lockport", "steinbruch"]
    orte += ["sternwarte", "goldmine", "wegMapleCedar", "wegCedarRiverton", "wegRivertonIronwood"]
    konturen = vorschlaege(moebel_der_orte(orte), moebel)
    offen = {n: k.befunde for n, k in konturen.items() if any(b.startswith("von Hand") for b in k.befunde)}
    assert offen == {}
    assert moebel["pd7Villa2"]["teilbereiche"][0]["sortierlinie"] == 170

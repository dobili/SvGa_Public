"""Tests für die Fortsetzungen der Eröffnungen aus der Praxis (Wunsch des Autors zu N2538)."""

from __future__ import annotations

from pipeline.praxisbuch import fortsetzungen as f
from pipeline.praxisbuch.baue import BAENDER

#: Band 1200 (Index 4); Zelle = Zeitklasse · 13 + Band.
BAND = 4
BLITZ = 0 * len(BAENDER) + BAND
RAPID = 1 * len(BAENDER) + BAND


def eintraege_einer_linie(zuege: list[str], anzahl: int, zelle: int = BLITZ):
    """Zählungen einer einzigen Linie: Hash i → i + 1, je Zug `anzahl` Partien."""
    return [(zelle, i, i + 1, zug, anzahl) for i, zug in enumerate(zuege)]


def test_haeufigster_zug_ueber_alle_zeitklassen_des_bandes() -> None:
    eintraege = [
        (BLITZ, 0, 1, "e4", 60),
        (BLITZ, 0, 2, "d4", 70),
        (RAPID, 0, 1, "e4", 30),
    ]
    kinder, _ = f.kinder_nach_stellung(eintraege)
    assert f.haeufigster(kinder, 0, BAND) == ("e4", 1)


def test_zu_selten_oder_unklar_ergibt_nichts() -> None:
    kinder, _ = f.kinder_nach_stellung([(BLITZ, 0, 1, "e4", f.MINDEST_PARTIEN - 1)])
    assert f.haeufigster(kinder, 0, BAND) is None
    # Zehn gleich häufige Züge: keiner erreicht den Mindestanteil
    viele = [(BLITZ, 0, i + 1, f"z{i}", 15) for i in range(10)]
    kinder, _ = f.kinder_nach_stellung(viele)
    assert f.haeufigster(kinder, 0, BAND) is None


def test_fortsetzung_ab_dem_namen_hoechstens_zehn_halbzuege() -> None:
    zuege = [f"m{i}" for i in range(16)]
    kinder, kante = f.kinder_nach_stellung(eintraege_einer_linie(zuege, 500))
    assert f.fortsetzung(zuege[:2], BAND, kinder, kante) == zuege[2:12]
    # Die Zählung endet nach 20 Halbzügen: ab Halbzug 14 bleiben höchstens 6
    lang = [f"m{i}" for i in range(24)]
    kinder, kante = f.kinder_nach_stellung(eintraege_einer_linie(lang, 500))
    assert len(f.fortsetzung(lang[:14], BAND, kinder, kante)) == 6


def test_kurze_fortsetzung_und_unbekannte_folge_fallen_weg() -> None:
    zuege = ["e4", "c5", "Nf3"]
    kinder, kante = f.kinder_nach_stellung(eintraege_einer_linie(zuege, 500))
    # Nach e4 c5 bliebe nur ein Halbzug (Nf3): zu kurz
    assert f.fortsetzung(["e4", "c5"], BAND, kinder, kante) == []
    assert f.fortsetzung(["d4"], BAND, kinder, kante) == []
    # Anderes Band: keine Partien
    assert f.fortsetzung(["e4"], BAND + 1, kinder, kante) == []


def test_baue_fortsetzungen_je_band_und_nur_mit_inhalt() -> None:
    zuege = ["e4", "c5", "Nf3", "Nc6", "d4"]
    baender = {
        "familien": [
            {"folge": "e4 c5", "varianten": [{"folge": "e4 c5 Nf3 Nc6"}]},
            {"folge": "d4", "varianten": []},
        ],
        "gambits": [],
    }
    aus = f.baue_fortsetzungen(baender, eintraege_einer_linie(zuege, 500))
    assert list(aus) == ["e4 c5"]
    assert aus["e4 c5"][BAND] == "Nf3 Nc6 d4"
    assert aus["e4 c5"][0] == ""
    assert len(aus["e4 c5"]) == len(BAENDER)

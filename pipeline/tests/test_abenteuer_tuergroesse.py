"""Tests: Türen in Menschengröße (KARTENREGELN 10.92, pipeline/abenteuer/tuergroesse.py)."""

from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.tuergroesse import FIGUR_HOEHE, pruefe_szene, tuermasse

MOEBEL = lade_moebel()


def _szene(massstab: float | None) -> dict:
    eintrag = {"moebel": "mf11HausHintenBBlau", "feld": [3, 33]}
    if massstab:
        eintrag["massstab"] = massstab
    return {"art": "aussen", "objekte": [eintrag]}


def test_haus_hinten_braucht_den_massstab_des_autors():
    # Regel: KARTENREGELN 10.92; der Autor hat die Häuser auf 125 % gesetzt (16.11.2026).
    assert pruefe_szene(_szene(None), MOEBEL)
    assert pruefe_szene(_szene(1.25), MOEBEL) == []


def test_innenraum_und_masse():
    assert pruefe_szene({**_szene(None), "art": "innen"}, MOEBEL) == []
    _, o, _, u = tuermasse()["haus_hinten_b_blau.png"]
    assert u - o < FIGUR_HOEHE <= (u - o) * 1.25


def test_herkunft_und_bericht():
    # tuermasse.json kennt „von Hand“, „gemessen“ (tuermessung.py), „verworfen“ und „nicht messbar“.
    from pipeline.abenteuer.tuergroesse import bericht, tuerangaben

    angaben = tuerangaben()
    assert angaben["haus_hinten_b_blau.png"]["herkunft"] == "von Hand"
    assert {e["herkunft"] for e in angaben.values()} <= {"von Hand", "gemessen", "verworfen", "nicht messbar"}
    assert all("rahmen" in e for e in angaben.values() if e["herkunft"] in ("von Hand", "gemessen"))
    assert all("grund" in e for e in angaben.values() if e["herkunft"] in ("verworfen", "nicht messbar"))
    assert not any(n for n, e in angaben.items() if e["herkunft"] == "verworfen" and n in tuermasse())
    text = bericht(MOEBEL)
    assert "## Türen kleiner als die Figur" in text


def test_innentueren_in_figurgroesse(tmp_path):
    # Regel: KARTENREGELN 10.92 innen; Südwand-Ausgänge (Regel 38) zählen nicht.
    import pytest

    image = pytest.importorskip("PIL.Image")
    from pipeline.abenteuer.tuergroesse import pruefe_innen

    def tuerbild(name: str, breite: int, hoehe: int) -> str:
        bild = image.new("RGBA", (16, 48), (0, 0, 0, 0))
        for x in range(breite):
            for y in range(hoehe):
                bild.putpixel((x, 48 - hoehe + y), (120, 80, 40, 255))
        bild.save(tmp_path / name)
        return name

    moebel = {
        "gross": {"quelle": tuerbild("gross.png", 14, 21), "art": "tuer"},
        "klein": {"quelle": tuerbild("klein.png", 14, 15), "art": "tuer"},
    }
    raster = ["#" * 8] * 3 + ["#......#"] * 5 + ["###.####", "#" * 8]
    szene = {
        "art": "innen",
        "raster": raster,
        "objekte": [
            {"moebel": "gross", "feld": [2, 1]},
            {"moebel": "klein", "feld": [5, 1]},
            {"moebel": "klein", "feld": [3, 9]},
        ],
    }
    befunde = pruefe_innen(szene, moebel, tmp_path)
    assert len(befunde) == 1 and "klein (5, 1)" in befunde[0]
    szene["objekte"][1]["massstab"] = 1.4
    assert pruefe_innen(szene, moebel, tmp_path) == []
    assert pruefe_innen({**szene, "art": "aussen"}, moebel, tmp_path) == []

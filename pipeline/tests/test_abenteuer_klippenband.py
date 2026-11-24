"""Tests zu Höhen als Gelände (Kartenblick M02, 24.11.2026): Bänder, Zeichnung, Dauerprüfung.

Warum: Felswände waren gerade Zickzackbänder aus Klötzen, am Wandfuß saß ein schwarzer Schrägstrich,
der Grasfuß stand auch auf Schotter. Die Tests laufen ohne privates Paket: Ein kleiner Bogen in der
Lage des Geländebogens wird im Test selbst gemalt.
"""

from pathlib import Path

import pytest

from pipeline.abenteuer import klippenband as kb
from pipeline.abenteuer.klippe import (
    REIHE_FUSS,
    REIHE_KANTE,
    REIHE_OBEN,
    REIHE_WAND,
    SPALTEN,
    klippenart,
    klippenbogen,
    klippenfeld,
)
from pipeline.abenteuer.klippenrolle import Stapel, baender

GRAS = {"."}
# Die Wand springt bei Spalte 4 um eine Reihe nach unten; Spalten 9–10 sind eine Treppe.
VERSATZ = [
    "............",
    "####.....ee#",
    "#########ee#",
    "#########ee#",
    "ssss#####ee#",
    "ssssssssssss",
]


def test_versatz_ist_ein_band_und_kein_wandende():
    """Regel: Kartenblick M02 – ein Vor- oder Rücksprung ist eine Ecke im Fels, kein Ende."""
    alle = baender(tuple(VERSATZ))
    assert [len(b) for b in alle] == [9, 1]  # links der Treppe ein Band trotz Versatz, rechts eins
    assert alle[0][3] == Stapel(3, 1, 3) and alle[0][4] == Stapel(4, 2, 4)
    mitte = SPALTEN["gras"][1]
    assert klippenfeld(VERSATZ, 3, 1, GRAS) == (mitte, REIHE_KANTE)  # früher Randkachel rechts
    assert klippenfeld(VERSATZ, 4, 4, GRAS) == (mitte, REIHE_FUSS)  # früher Randkachel links
    assert klippenfeld(VERSATZ, 8, 3, GRAS)[0] == SPALTEN["gras"][2]  # echtes Ende vor der Treppe


def test_deckstreifen_gilt_fuer_das_ganze_band():
    """Regel: Kartenblick M02 – der Deckstreifen wechselt nicht mitten in der Wand."""
    zeilen = ["....kkkkkkkk....", "#" * 16, "#" * 16, "#" * 16, "s" * 16]
    arten = {klippenfeld(zeilen, x, 1, GRAS)[0] in SPALTEN["gras"] for x in range(1, 15)}
    assert arten == {True}  # acht Felder Schotter über der Wand machen sie nicht zur Erdklippe
    assert kb.pruefe_szene("probe", {"kante": "klippe", "boden": "gras", "raster": zeilen}, {}) == []


def test_gerades_band_ueber_zwanzig_felder_ist_ein_befund():
    lang = ["." * 30, "#" * 30, "#" * 30, "#" * 30, "s" * 30]
    szene = {"kante": "klippe", "boden": "gras", "raster": lang}
    befunde = kb.pruefe_szene("probe", szene, {})
    assert [b.art for b in befunde] == ["gerade"] and "30 Felder" in befunde[0].stelle
    # Ein Versatz nach 15 Feldern genügt.
    gestuft = [
        "." * 30,
        "#" * 15 + "." * 15,
        "#" * 30,
        "#" * 30,
        "s" * 15 + "#" * 15,
        "s" * 30,
    ]
    assert kb.pruefe_szene("probe", {**szene, "raster": gestuft}, {}) == []
    # Ein Deich ist gebaut und darf gerade sein.
    assert kb.pruefe_szene("probe", {**szene, "fels": "boeschung"}, {}) == []
    assert kb.pruefe_szene("probe", {"boden": "gras", "raster": lang}, {}) == []  # ohne Klippe


def test_freies_ende_und_schiefe_treppe_sind_befunde():
    frei = ["." * 12, "#######.....", "#######.....", "#######.....", "s" * 12]
    arten = [b.art for b in kb.pruefe_szene("probe", {"kante": "klippe", "raster": frei}, {})]
    assert arten == ["ende"]
    schief = ["." * 10, "####..####", "####..####", "####..####", "ssss..####", "s" * 10]
    funde = kb.pruefe_szene("probe", {"kante": "klippe", "raster": schief}, {})
    assert {b.art for b in funde} == {"treppe"} and "links „wand“, rechts „kante“" in funde[0].stelle


def test_wandarten_boeschung_und_stuetzmauer(tmp_path: Path):
    """Regel: Kartenblick M02 – ein Deich ist kein Fels, eine Kaimauer kein Geländer."""
    assert klippenart({"fels": "rot"}) == "fels" and klippenart({}) == "fels"
    assert klippenart({"fels": "gras"}) == "boeschung"
    assert klippenart({"fels": "stuetzmauer"}) == "stuetzmauer"
    assert klippenbogen({"fels": "stuetzmauer"}, tmp_path) == "gelaende"  # grauer Bogen fehlt


def test_klippen_aller_karten_sind_gelaende():
    # Dauertest: 0 Befunde außerhalb der offenen Liste für Welle 2 (Ausnahmen mit Grund im Werkzeug).
    assert [b.text() for b in kb.alle_befunde()] == []


def test_offene_liste_enthaelt_nur_offenes():
    # Wer in Welle 2 eine Szene behebt, streicht ihren Eintrag; sonst verdeckt er neue Funde.
    assert kb.erledigte_ausnahmen() == []


# ── Zeichnung (braucht Pillow; der Bogen entsteht im Test) ──────────────────────────────────────

FELS, WIESE, BLAU, UMRISS = (150, 90, 60, 255), (70, 150, 90, 255), (60, 60, 200, 255), (40, 40, 60, 255)
SAND = (200, 180, 140, 255)
K = 16


def _bogen():
    """Ein Bogen in der Lage des Geländebogens: Kante oben halb Wiese, Fuß mit drei Zeilen Gras;
    die linke Fußkachel der Grasfassung hat ein halb durchsichtiges Pixel (LimeZus Schrägstrich)."""
    from PIL import Image

    bogen = Image.new("RGBA", (32 * K, 74 * K), (0, 0, 0, 0))
    for spalten in SPALTEN.values():
        for spalte in spalten:
            for reihe in (REIHE_OBEN, REIHE_KANTE, REIHE_WAND, REIHE_FUSS):
                for y in range(K):
                    oben = reihe == REIHE_OBEN or (reihe == REIHE_KANTE and y < K // 2)
                    unten = reihe == REIHE_FUSS and y >= K - 3
                    farbe = WIESE if oben or unten else FELS
                    for x in range(K):
                        bogen.putpixel((spalte * K + x, reihe * K + y), farbe)
    bogen.putpixel((SPALTEN["gras"][0] * K + 2, REIHE_FUSS * K + 9), (0, 0, 0, 120))
    bogen.putpixel((SPALTEN["erde"][0] * K, REIHE_WAND * K + 3), UMRISS)  # dunkelste Farbe: der Umriss
    return bogen


@pytest.fixture
def privat(tmp_path: Path) -> Path:
    pytest.importorskip("PIL")
    from pipeline.abenteuer.kartenbau import INHALTE, lade

    pfad = tmp_path / lade(INHALTE / "materialien.json")["boegen"]["gelaende"]
    pfad.parent.mkdir(parents=True)
    _bogen().save(pfad)
    return tmp_path


def _szene(raster: list[str], **mehr) -> dict:
    return {"karte": "probe.aussen", "kante": "klippe", "boden": "gras", "raster": raster, **mehr}


def _grund(szene: dict, farben: dict[str, tuple]):
    from PIL import Image

    zeilen = szene["raster"]
    bild = Image.new("RGBA", (len(zeilen[0]) * K, len(zeilen) * K), (26, 22, 18, 255))
    for y, zeile in enumerate(zeilen):
        for x, z in enumerate(zeile):
            if z in farben:
                bild.paste(farben[z], (x * K, y * K, x * K + K, y * K + K))
    return bild


def test_kein_schwarzer_schraegstrich_am_wandfuss(privat: Path):
    """Regel: Kartenblick M02, Beleg mapleFalls.park_7 – der Strich war ein halb durchsichtiges
    Stück in LimeZus linker Fußkachel auf dunklem Grund."""
    from pipeline.abenteuer.klippenarten import kachelsatz
    from pipeline.abenteuer.klippenbild import veredle

    satz = kachelsatz({"kante": "klippe"}, privat)
    fuss_links = satz.kachel((SPALTEN["gras"][0], REIHE_FUSS))
    assert all(p[3] == 255 for p in fuss_links.get_flattened_data())
    szene = _szene(["......", ".####.", ".####.", ".####.", "......"])
    bild = veredle(szene, _grund(szene, {".": WIESE}), privat)
    dunkel = [p for p in bild.get_flattened_data() if sum(p[:3]) < 3 * 30]
    assert dunkel == []  # weder Bildgrund noch Schrägstrich scheint durch


def test_fuss_richtet_sich_nach_dem_boden_darunter_und_wirft_schatten(privat: Path):
    from pipeline.abenteuer.klippenbild import veredle

    raster = ["......", "######", "######", "######", "ssssss", "ssssss"]
    szene = _szene(raster, boeden={"s": "sand"})
    bild = veredle(szene, _grund(szene, {".": WIESE, "s": SAND}), privat)
    # Unterste Zeile der Fußkachel: Sand statt Grasbüschel.
    assert bild.getpixel((3 * K + 5, 4 * K - 1)) == SAND
    # Auf dem Sand davor liegt Schatten, weiter unten nicht mehr.
    assert sum(bild.getpixel((3 * K + 5, 4 * K))[:3]) < sum(SAND[:3])
    assert bild.getpixel((3 * K + 5, 4 * K + 8)) == SAND
    # Über einer Wiese bleibt der Grasfuß.
    wiese = _szene(raster[:4] + ["......", "......"])
    gruen = veredle(wiese, _grund(wiese, {".": WIESE}), privat).getpixel((3 * K + 5, 4 * K - 1))
    assert gruen[1] > gruen[0] and gruen[1] > gruen[2]


def test_versatz_bekommt_einen_umriss_und_felsflaechen_variieren(privat: Path):
    from pipeline.abenteuer.klippenbild import veredle

    szene = _szene(VERSATZ, boeden={"s": "sand"})
    bild = veredle(szene, _grund(szene, {".": WIESE, "s": SAND}), privat)
    # Spalte 4 reicht eine Reihe tiefer als Spalte 3: Am Fuß (Reihe 4) stößt Fels links an Sand.
    assert bild.getpixel((4 * K, 4 * K + 4)) == UMRISS
    assert bild.getpixel((4 * K + 6, 4 * K + 4)) != UMRISS
    lang = _szene(["." * 40, "#" * 40, "#" * 40, "#" * 40, "." * 40])
    wand = veredle(lang, _grund(lang, {".": WIESE}), privat).crop((0, 2 * K, 40 * K, 3 * K))
    assert len(set(wand.get_flattened_data())) >= 3  # nicht mehr eine Farbe über 40 Felder
    # Gleiches Bild bei jedem Bau.
    nochmal = veredle(lang, _grund(lang, {".": WIESE}), privat).crop((0, 2 * K, 40 * K, 3 * K))
    assert list(wand.get_flattened_data()) == list(nochmal.get_flattened_data())


def test_ohne_klippe_bleibt_das_bild_unveraendert(privat: Path):
    from pipeline.abenteuer.klippenbild import veredle

    szene = {"karte": "probe.aussen", "raster": ["....", "####", "####", "####", "...."]}
    grund = _grund(szene, {".": WIESE})
    vorher = list(grund.get_flattened_data())
    assert list(veredle(szene, grund, privat).get_flattened_data()) == vorher


def test_stuetzmauer_und_boeschung_werden_gezeichnet(privat: Path):
    from pipeline.abenteuer.klippenarten import FUGE, kachelsatz

    mauer = kachelsatz({"kante": "klippe", "fels": "stuetzmauer"}, privat)
    wand = mauer.kachel((SPALTEN["gras"][1], REIHE_WAND))
    assert FUGE in set(wand.get_flattened_data()) and FELS not in set(wand.get_flattened_data())
    hang = kachelsatz({"kante": "klippe", "fels": "boeschung"}, privat)
    farben = set(hang.kachel((SPALTEN["gras"][1], REIHE_WAND)).get_flattened_data())
    assert all(p[1] > p[0] and p[1] > p[2] for p in farben)  # ein Grashang ist grün
    kante = hang.kachel((SPALTEN["gras"][1], REIHE_KANTE))
    assert kante.getpixel((5, 0)) == WIESE  # oben bleibt die Wiese der Hochfläche

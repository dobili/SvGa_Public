"""Tests für ``pipeline.abenteuer.objektmassstab``: Kollision skalierter Objekte.

Warum: Mit ``massstab`` sperrte der Kartenbau nur ganze Kacheln ab der linken oberen Ecke; der
angefangene Rest rechts und unten (bei einer Fassade die Reihe mit der Tür) blieb begehbar. Jetzt
sperrt eine Kachel, wenn die skalierte Standfläche sie zu mehr als einem Viertel deckt. Ohne
Maßstab darf sich nichts ändern. Kleine Kunstdaten, ohne private Bilder.
"""

import pytest

from pipeline.abenteuer.kartenbau import platziere, sperrfelder, tiled
from pipeline.abenteuer.objektform import geformt
from pipeline.abenteuer.objektkollision import kollisionsbefunde
from pipeline.abenteuer.objektmassstab import (
    deckmaske,
    geformte_flaeche,
    skalierte_maske,
    skalierte_tuerfelder,
    standflaeche,
)

FASSADE = {"quelle": "f.png", "breite": 128, "hoehe": 144, "kollision": True}
HUETTE = {"quelle": "h.png", "breite": 80, "hoehe": 80, "kollision": True}
TOR = {"quelle": "t.png", "breite": 32, "hoehe": 48, "kollision": True, "maske": ["..", "#.", "#."]}
TEPPICH = {"quelle": "b.png", "breite": 32, "hoehe": 32, "kollision": False}
MOEBEL = {"fassade": FASSADE, "huette": HUETTE, "tor": TOR, "teppich": TEPPICH}
VORLAGE = {"tilesets": []}


def test_standflaeche_folgt_maske_oder_standardregel():
    assert standflaeche(FASSADE) == [(0, 16, 128, 144)]
    assert standflaeche({**FASSADE, "frei_unten": 1}) == [(0, 16, 128, 128)]
    assert standflaeche(TOR) == [(0, 16, 16, 32), (0, 32, 16, 48)]
    # Ein Bild von einer Kachelreihe sperrt ab der oberen Kante (maske.py).
    assert standflaeche({"breite": 32, "hoehe": 16}) == [(0, 0, 32, 16)]


def test_fassade_mit_1_2_sperrt_die_angefangene_reihe_mit_der_tuer():
    # 154 × 173: neun ganze Spalten und 10 Pixel, zehn ganze Reihen und 13 Pixel.
    maske = skalierte_maske(FASSADE, {"massstab": 1.2})
    assert maske == ["." * 10] + ["#" * 10] * 10
    gesetzt, _ = platziere({"objekte": [{"moebel": "fassade", "feld": [2, 3], "massstab": 1.2}]}, MOEBEL)
    felder = sperrfelder(gesetzt[0])
    assert (2 + 9, 3 + 10) in felder  # früher frei: Rest rechts unten
    assert all((x, 3) not in felder for x in range(2, 12))  # oberste Reihe bleibt frei


def test_genau_ein_viertel_sperrt_nicht():
    # 80 × 80 mit 1,25 → 100 × 100: Rest 4 Pixel rechts und unten, genau ein Viertel.
    assert skalierte_maske(HUETTE, {"massstab": 1.25}) == ["......."] + ["######."] * 5 + ["......."]
    # Mit 1,5 → 120 × 120: Rest 8 Pixel sperrt; der freie Streifen oben ist 24 Pixel hoch, die
    # Ecke oben rechts (8 × 8 Pixel) bleibt unter einem Viertel.
    assert skalierte_maske(HUETTE, {"massstab": 1.5}) == ["........", "#######."] + ["########"] * 5 + [
        "#######."
    ]
    assert deckmaske([(0, 16, 20, 40)], 20, 40) == ["..", "#.", "#."]


def test_katalogmaske_und_frei_unten_wachsen_mit():
    assert geformt(TOR, {"massstab": 1.5})["maske"] == ["...", "#..", "##.", "##.", "#.."]
    veranda = geformt({**FASSADE, "frei_unten": 1}, {"massstab": 1.2})
    assert veranda["maske"] == ["." * 10] + ["#" * 10] * 9 + ["." * 10]


def test_spiegeln_und_drehung_formen_die_flaeche_wie_das_bild():
    assert geformt(TOR, {"massstab": 1.5, "spiegeln": True})["maske"] == ["...", "..#", ".##", ".##", "..#"]
    gedreht = geformt(FASSADE, {"massstab": 1.2, "drehung": 90})
    assert (gedreht["breite"], gedreht["hoehe"]) == (173, 154)
    assert gedreht["maske"] == ["#" * 10 + "."] * 10  # der freie Streifen liegt jetzt rechts
    flaeche = geformte_flaeche([(0, 16, 128, 144)], FASSADE, {"massstab": 1.2, "drehung": 90})
    assert flaeche[0][0] == 0 and flaeche[0][2] == pytest.approx(173 - 16 * 173 / 144)


def test_ohne_massstab_aendert_sich_nichts():
    assert geformt(FASSADE, {"moebel": "fassade", "feld": [1, 1]}) is FASSADE
    assert "maske" not in geformt(FASSADE, {"drehung": 90})
    assert geformt(TOR, {"spiegeln": True})["maske"] == ["..", ".#", ".#"]
    gesetzt, _ = platziere({"objekte": [{"moebel": "fassade", "feld": [2, 3]}]}, MOEBEL)
    assert "objektmaske" not in gesetzt[0]
    assert sperrfelder(gesetzt[0]) == {(2 + a, 3 + b) for a in range(8) for b in range(1, 9)}


def test_eigene_maske_der_szene_bleibt_und_darf_den_rest_nennen():
    eigene = ["." * 10] + ["#" * 10] * 9 + ["####..####"]
    eintrag = {"moebel": "fassade", "feld": [2, 3], "massstab": 1.2, "maske": eigene}
    assert geformt(FASSADE, eintrag)["maske"] == eigene
    assert kollisionsbefunde({"objekte": [eintrag]}, MOEBEL) == []
    zu_gross = {**eintrag, "maske": [*eigene, "#" * 10]}
    assert "größer als das Bild" in kollisionsbefunde({"objekte": [zu_gross]}, MOEBEL)[0]
    # Ohne Maßstab gilt weiter das Raster der ganzen Kacheln (8 × 9).
    ohne = {"moebel": "fassade", "feld": [2, 3], "maske": ["#" * 9]}
    assert "größer als das Bild" in kollisionsbefunde({"objekte": [ohne]}, MOEBEL)[0]


def test_karte_traegt_die_maske_fuer_die_app():
    szene = {
        "karte": "test",
        "objekte": [
            {"moebel": "fassade", "feld": [1, 1], "massstab": 1.2},
            {"moebel": "teppich", "feld": [1, 14], "massstab": 1.5},
            {"moebel": "fassade", "feld": [14, 1]},
        ],
    }
    gesetzt, _ = platziere(szene, MOEBEL)
    karte = tiled(szene, ["." * 30] * 20, gesetzt, VORLAGE)
    eigenschaften = [
        {e["name"]: e["value"] for e in o["properties"]}
        for o in karte["layers"][3]["objects"]
        if o["type"] == "moebel"
    ]
    # Die App rechnet selbst (oberwelt/moebelform.ts); die Maske am Objekt gibt ihr dieselben Kacheln.
    assert eigenschaften[0]["maske"] == "/".join(["." * 10] + ["#" * 10] * 10)
    assert "maske" not in eigenschaften[1]  # ohne Kollision keine Maske
    assert "maske" not in eigenschaften[2]  # ohne Maßstab bleibt die Karte, wie sie war


def test_tuerfelder_ohne_massstab_bleiben():
    assert skalierte_tuerfelder([[1, 9], [2, 9]], FASSADE, {"breite": 128, "hoehe": 144}) == {(1, 9), (2, 9)}
    beschnitten = {"breite": 100, "hoehe": 144, "zuschnitt": [28, 0, 0, 0]}
    assert skalierte_tuerfelder([[3, 9]], FASSADE, beschnitten) == {(3, 9)}  # wie bisher


def test_tuerfelder_wandern_mit_dem_massstab():
    # Blockhütte 80 × 80, Tür in Spalte 1, Feld davor in Reihe 5 (unter dem Bild).
    assert skalierte_tuerfelder([[1, 5]], HUETTE, {"massstab": 1.25}) == {(1, 6)}
    # Mit 1,5 sperrt die angefangene Reihe 7 mit (deckmaske); das Türfeld liegt in Reihe 8. Die
    # einflügelige Tür bleibt eine Kachel breit, zwei Türfelder werden drei.
    assert skalierte_tuerfelder([[1, 5]], HUETTE, {"massstab": 1.5}) == {(1, 8)}
    assert skalierte_tuerfelder([[1, 5], [2, 5]], HUETTE, {"massstab": 1.5}) == {(1, 8), (2, 8), (3, 8)}
    assert (1, 7) in {
        (a, b)
        for b, z in enumerate(skalierte_maske(HUETTE, {"massstab": 1.5}))
        for a in range(8)
        if z[a] == "#"
    }
    # Kantine Ironwood: Halle 208 × 160 mit 1,7, Tür in den Spalten 7 und 8.
    halle = {"breite": 208, "hoehe": 160}
    assert skalierte_tuerfelder([[7, 10], [8, 10]], halle, {"massstab": 1.7}) == {
        (12, 17),
        (13, 17),
        (14, 17),
    }
    # Pavillon 128 × 144 mit 1,375: Die Tür beginnt mitten in Kachel 5 und bleibt eine Kachel breit.
    assert skalierte_tuerfelder([[4, 9]], FASSADE, {"massstab": 1.375}) == {(5, 12)}


def test_tuerfelder_mit_zuschnitt_spiegeln_und_mehreren_tueren():
    # Villa 144 × 208 mit Zuschnitt rechts und 1,1: Feld in der Tür (2, 10) → (2, 11).
    villa = {"breite": 144, "hoehe": 208}
    assert skalierte_tuerfelder([[2, 10]], villa, {"massstab": 1.1, "zuschnitt": [0, 0, 14, 0]}) == {(2, 11)}
    # Ein Zuschnitt links zieht die Tür nach links: Spalte 4 (64 px) liegt 32 px weiter links.
    assert skalierte_tuerfelder([[4, 9]], FASSADE, {"massstab": 1.5, "zuschnitt": [32, 0, 0, 0]}) == {(3, 14)}
    # Gespiegelt liegt die Tür von rechts gezählt: 192 − 48 = 144 Pixel → Kachel 9.
    assert skalierte_tuerfelder([[1, 9]], FASSADE, {"massstab": 1.5, "spiegeln": True}) == {(9, 14)}
    # Zwei Türen in einer Reihe sind zwei Läufe.
    assert skalierte_tuerfelder([[1, 9], [5, 9]], FASSADE, {"massstab": 1.25}) == {(1, 11), (6, 11)}

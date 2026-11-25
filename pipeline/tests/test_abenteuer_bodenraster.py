"""Tests der Kachelwahl für Böden (pipeline/abenteuer/bodenraster.py), ohne Pillow."""

from pipeline.abenteuer.bodenraster import (
    bodenfeld,
    brueckenzeichen,
    gleicher_boden,
    randergaenzt,
    randkachel,
    randnachbar,
    uferfelder,
)

WASSER_ART = {"rand": [0, 0]}
HOLZ = frozenset({"h"})


def test_brücke_unterbricht_den_bach_nicht():
    zeilen = ["..~..", "..h..", "..h..", "..~.."]
    assert gleicher_boden(zeilen, 2, 0, 0, 1, HOLZ)
    assert gleicher_boden(zeilen, 2, 3, 0, -1, HOLZ)
    # Unter der Brücke und am Kartenrand kein Ufer oben oder unten: Mittelstück.
    assert bodenfeld(WASSER_ART, zeilen, 2, 3, HOLZ) == [1, 1]


def test_steg_im_wasser_hat_kein_ufer():
    # Kartenblick 24.11.2026 (M03): Stege trugen grüne Kappen, weil das Wasser an ihnen ein Ufer bekam.
    zeilen = ["~~~", "~h.", "~~~"]
    assert gleicher_boden(zeilen, 0, 1, 1, 0, HOLZ)
    assert bodenfeld(WASSER_ART, zeilen, 0, 0, HOLZ) == [1, 1]
    # Zum Gras daneben bleibt das Ufer.
    assert bodenfeld(WASSER_ART, zeilen, 2, 0, HOLZ) == [1, 2]


def test_weg_laeuft_bis_ans_wasser():
    # Das Ufer zeichnet das Wasser; der Weg zeigt zum Wasser keinen eigenen Grasrand.
    zeilen = ["....", "ee~~", "...."]
    assert bodenfeld({"rand": [0, 0]}, zeilen, 1, 1) == [1, 1]


def test_innenecke_an_einer_ufer_stufe():
    # Wasser unten links, Stufe nach rechts oben: (1,1) hat Wasser ringsum, nur oben rechts Gras.
    zeilen = ["~~.", "~~~", "~~~"]
    assert bodenfeld(WASSER_ART, zeilen, 1, 1) == [3, 1]


def test_weg_ohne_grasnaht_am_pflaster():
    zeilen = ["....", "eegg", "...."]
    erde = {"rand": [0, 0]}
    # Rechts Pflaster: kein Rand nach rechts, oben und unten Gras.
    assert bodenfeld(erde, zeilen, 1, 1) == [1, 1]


def test_randwand_zeigt_das_feld_dahinter():
    # Weg verlässt die Karte links: Die Randwand über ihm zeigt Gras, also Grasrand oben.
    zeilen = ["#####", "#....", "eeeee", "eeeee", "#...."]
    erde = {"rand": [0, 0]}
    assert bodenfeld(erde, zeilen, 0, 2) == [1, 0]


def test_gras_zwischen_wasser_ist_keine_bruecke():
    # Bach versetzt um eine Spalte: (1,0) Wasser hat unten Gras, darunter wieder Wasser.
    zeilen = ["~~.", "~..", "~~."]
    assert not gleicher_boden(zeilen, 1, 0, 0, 1)
    assert bodenfeld(WASSER_ART, zeilen, 1, 0) == [2, 2]


def test_schattenkachel_nur_direkt_unter_der_wand():
    """Room-Builder-Böden: Schattenreihe unter der Wand, sonst die gleichmäßige Kachel (Punkt e)."""
    dielen = {"feld": [5, 13], "unter_wand": [5, 12]}
    zeilen = ["####", "#..#", "#..#"]
    assert bodenfeld(dielen, zeilen, 1, 1) == [5, 12]
    assert bodenfeld(dielen, zeilen, 1, 2) == [5, 13]


def test_nur_holzboeden_sind_bruecken():
    """Sinter, Erde, Pflaster zwischen zwei Wassern sind keine Brücke (auch nicht schräg)."""
    zeilen = ["..~..", "..s..", "..~.."]
    assert not gleicher_boden(zeilen, 2, 0, 0, 1, HOLZ)
    # Ohne Brücke hat das obere Wasser unten sein Ufer.
    assert bodenfeld(WASSER_ART, zeilen, 2, 0, HOLZ) == [1, 2]
    assert gleicher_boden(["~", "h", "~"], 0, 0, 0, 1, HOLZ)


def test_brueckenzeichen_aus_den_holzboeden_der_szene():
    szene = {"boeden": {"b": "holzDunkel", "s": "sinter", "d": "dielen", "e": "erde"}}
    assert brueckenzeichen(szene) == {"b", "d"}
    assert brueckenzeichen({}) == frozenset()


def test_randsichten_machen_genannte_boeden_zum_grund():
    """Ein Weg mit ``rand_gegen`` zeigt seinen Rand auch an rotem Sand (Canyonrand, 11.11.2026)."""
    from pipeline.abenteuer.bodenraster import bodenfeld, randsichten

    weg = {"feld": [1, 1], "rand": [0, 0], "rand_gegen": ["sandRot"]}
    boeden = {"erdeRot": weg, "sandRot": {"feld": [2, 0]}, "gras": {"feld": [3, 8]}}
    roh = ["sss", "EEE", "EEE", "sss"]
    sichten = randsichten(roh, {"E": "erdeRot", "s": "sandRot"}, "gras", boeden)
    assert sichten == {"erdeRot": ["...", "EEE", "EEE", "..."]}
    # Ohne die Sicht gilt Sand als gleicher Boden (Mitte), mit ihr liegt oben der Rand.
    assert bodenfeld(weg, roh, 1, 1) == [1, 1]
    assert bodenfeld(weg, sichten["erdeRot"], 1, 1) == [1, 0]


def test_strasse_reicht_fuer_die_linien_bis_in_die_randspalte():
    # Kanalweg (R118): „#“ am Rand trägt den Boden des Nachbarn; Hecken am Rand und Innenräume bleiben.
    zeilen = ["####", "#sss", "#sss", "#sss", "##.."]
    neu = randergaenzt(zeilen)
    assert [z[0] for z in neu[1:4]] == ["s", "s", "s"]
    # Eine Hecke, die zwei Spalten breit an den Rand reicht, bleibt Wand.
    assert randergaenzt(["##..", "##..", "##.."])[1][0] == "#"
    assert randergaenzt(zeilen, aussen=False) == zeilen


# Böden wie in materialien.json: gewöhnliches Wasser im Geländebogen, rotes Ufer im eigenen Bogen.
BOEDEN = {
    "wasser": {"bogen": "gelaende", "rand": [0, 35]},
    "wasser_rot": {"bogen": "wasser_rot", "rand": [0, 0], "diagonalen": True},
    "fels": {"bogen": "gelaende", "feld": [7, 7]},
}
# Fluss, der unten aus der Karte läuft: Rand aus „#“, dahinter Wasser (Spalten 2–3) zwischen Fels.
FLUSS = ["######", "#f~~f#", "#f~~f#", "#f~~f#"]
FLUSS_RAND = ["######", "#f~~f#", "#f~~f#", "######"]


def test_uferfelder_legen_die_kachel_in_den_bogen_des_ufers():
    feld, eigen = uferfelder(BOEDEN, "wasser_rot", FLUSS_RAND, 2, 1)
    assert feld == [0, 36] and eigen == [0, 1]  # linkes Randstück, in beiden Bögen dieselbe Lage
    assert uferfelder(BOEDEN, "wasser", FLUSS_RAND, 2, 1) == ([0, 36], [0, 36])


def test_randfeld_vor_wasser_bekommt_das_ufer_der_szene():
    # Canyonrand: Am unteren Bildrand standen zwei Grasstücke, weil das Randfeld vor dem Fluss aus
    # dem gewöhnlichen Wasserbogen (Grasufer) gezeichnet wurde statt aus dem roten.
    for x, spalte in ((2, 0), (3, 2)):
        innen = randnachbar(FLUSS_RAND, x, 3)
        artname, bogenart, feld, eigen = randkachel(
            BOEDEN, "wasser_rot", (FLUSS_RAND, FLUSS_RAND), innen, "fels"
        )
        assert (artname, bogenart) == ("wasser", "wasser_rot")
        # Seitliches Ufer ja, zum Kartenrand hin keines: Reihe 1 des Blocks (der Fluss läuft hinaus).
        assert feld == [spalte, 36] and eigen == [spalte, 1]


def test_wasser_in_der_randreihe_hat_zum_rand_kein_ufer():
    for x, spalte in ((2, 0), (3, 2)):
        assert uferfelder(BOEDEN, "wasser_rot", FLUSS, x, 3)[1] == [spalte, 1]


def test_randfeld_vor_anderem_boden_bleibt_wie_bisher():
    innen = randnachbar(FLUSS_RAND, 1, 3)
    assert randkachel(BOEDEN, "wasser_rot", (FLUSS_RAND, FLUSS_RAND), innen, "fels") == (
        "fels",
        "fels",
        [7, 7],
        [7, 7],
    )


def test_textur_legt_das_stueck_nach_dem_ort_lueckenlos():
    """Regel: Kartenblick Paket A (26.11.2026), nahtlose Gemini-Böden laufen über Kachelgrenzen."""
    art = {"feld": [2, 5], "textur": [3, 2], "varianten": [[9, 9]]}
    zeilen = ["aaaa", "aaaa", "aaaa"]
    assert bodenfeld(art, zeilen, 0, 0) == [2, 5]
    assert bodenfeld(art, zeilen, 3, 1) == [2, 6]
    assert bodenfeld(art, zeilen, 2, 2) == [4, 5]

"""Prüfung der Zauntore (pipeline/abenteuer/zauntor.py).

Warum: Notiz des Autors (20.11.2026): Die Tore vor den Häusern in Maple Falls passten nicht zum
Eisenzaun und sahen geschlossen aus, obwohl man hindurchging. Der erste Test hält den Stand aller
Karten fest, die übrigen die Regeln an kleinen Beispielen ohne Bilder.
"""

from pipeline.abenteuer.zauntor import ZAUNARTEN, art_nach, pruefe, pruefe_tor, tore_der_szene

EISEN = "x/ME_Singles_Terrains_and_Fences_16x16_Fence_1_6.png"
GELAENDER = "x/24_Additional_Houses_Fence_4_Top_Right_16x16.png"
HOFTOR = "x/Wooden_Fence_Type_4_Brown_Gate_1_16x16.png"


def stueck(name: str, x: int, y: int = 0) -> dict:
    """Gesetztes Stück wie aus kartenbau.platziere (Pixel)."""
    return {"name": name, "x": x * 16, "y": y * 16, "breite": 16, "hoehe": 16}


def katalog(zaun: str, tor_begehbar: bool = False) -> dict:
    """Kleiner Katalog: ein Zaun, ein Torstück."""
    return {
        "zaun": {"quelle": zaun, "art": "zaun"},
        "tor": {"quelle": HOFTOR, "art": "zaun", "begehbar": tor_begehbar},
    }


def test_alle_zauntore_passen():
    """Kein Tor auf einer Karte ist offen, falsch oder täuscht den Spieler."""
    befunde = pruefe()
    assert befunde == [], "\n".join(befunde)


def test_hoftor_im_holzgelaender_passt():
    """Holz an Holz, bündig auf beiden Seiten: kein Befund."""
    gesetzt = [stueck("zaun", 0), stueck("tor", 1), stueck("tor", 2), stueck("zaun", 3)]
    tore = tore_der_szene(gesetzt, katalog(GELAENDER))
    assert len(tore) == 1 and len(tore[0]) == 2
    assert pruefe_tor("k", tore[0], gesetzt, katalog(GELAENDER)) == []


def test_hoftor_im_eisenzaun_und_offene_seite():
    """Maple Falls vorher: Hoftor im Eisenzaun, rechts ein Briefkasten statt Zaun, begehbar."""
    gesetzt = [stueck("zaun", 0), stueck("tor", 1), stueck("tor", 2)]
    befunde = pruefe_tor("k", tore_der_szene(gesetzt, katalog(EISEN, True))[0], gesetzt, katalog(EISEN, True))
    assert any("passt nicht zum eisenzaun" in b and "Gemini" in b for b in befunde)
    assert any("rechts kein Zaun" in b for b in befunde)
    assert sum("sieht aber geschlossen aus" in b for b in befunde) == 2


def test_frei_stehendes_tor_wird_nicht_geprueft():
    """Ein Gatter quer über der Straße hat keinen Zaun daneben."""
    gesetzt = [stueck("tor", 5)]
    assert pruefe_tor("k", [gesetzt[0]], gesetzt, katalog(EISEN, True)) == []


def test_zaunart_nach_dateiname():
    """Die Zaunart folgt dem Dateinamen des Bildes."""
    assert art_nach(EISEN, ZAUNARTEN) == "eisenzaun"
    assert art_nach(GELAENDER, ZAUNARTEN) == "holzgelaender"
    assert art_nach("x/Wooden_Fence_Type_1_Brown_3_16x16.png", ZAUNARTEN) == "lattenzaun"

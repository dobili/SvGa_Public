"""Tests der Bildprüfung an Übergängen (pipeline/abenteuer/uebergangsbilder.py, KARTENREGELN 10.77)."""

from pipeline.abenteuer.uebergangsbilder import ebene, pruefe_alle

MOEBEL = {
    "tuerSued": {
        "quelle": "spiel/eigene/tuer_sued_holz.png",
        "breite": 16,
        "hoehe": 16,
        "kollision": False,
        "art": "tuer",
        "stil": "klassisch",
    },
    "fenster": {"quelle": "x.png", "breite": 16, "hoehe": 16, "kollision": False, "art": "fenster"},
    "treppeHoch": {
        "quelle": "x.png",
        "breite": 16,
        "hoehe": 32,
        "kollision": False,
        "art": "treppe",
        "richtung": "hoch",
    },
    "schacht": {
        "quelle": "x.png",
        "breite": 16,
        "hoehe": 32,
        "kollision": False,
        "art": "treppe",
        "richtung": "runter",
    },
    "raetsel": {"quelle": "x.png", "breite": 16, "hoehe": 16, "kollision": False},
    "haus": {
        "quelle": "haus.png",
        "breite": 64,
        "hoehe": 48,
        "kollision": True,
        "art": "gebaeude",
        "stil": "klassisch",
    },
}
RAUM = ["######", "#....#", "#....#", "#....#", "###.##", "######"]
WIESE = ["........", "........", "........", "........"]


def regel(karte: str, name: str, ziel: str, ziel_name: str) -> dict:
    return {
        "name": name,
        "art": "uebergang",
        "karte": karte,
        "ort": karte.split(".")[0],
        "ziel": {"karte": ziel, "ausloeser": ziel_name},
    }


def szene(
    karte: str, art: str, raster: list[str], ausloeser: list, objekte: list | None = None, **mehr
) -> dict:
    return {
        "karte": karte,
        "art": art,
        "raster": raster,
        "ausloeser": ausloeser,
        "objekte": objekte or [],
        **mehr,
    }


def texte(alle: dict, liste: list) -> list[str]:
    return [str(b) for b in pruefe_alle(alle, liste, MOEBEL)]


def treppenpaar(bild_unten: str, unten_feld: list, oben_feld: list) -> tuple[dict, list]:
    unten = szene(
        "t.wohnzimmer",
        "innen",
        RAUM,
        [{"name": "treppeOben", "feld": unten_feld}],
        [{"moebel": bild_unten, "feld": [unten_feld[0], unten_feld[1] - 1]}],
    )
    oben = szene(
        "t.zimmer",
        "innen",
        RAUM,
        [{"name": "treppeUnten", "feld": oben_feld}],
        [{"moebel": "schacht", "feld": [oben_feld[0], oben_feld[1] - 1]}],
    )
    liste = [
        regel("t.wohnzimmer", "treppeOben", "t.zimmer", "treppeUnten"),
        regel("t.zimmer", "treppeUnten", "t.wohnzimmer", "treppeOben"),
    ]
    return {"t.wohnzimmer": unten, "t.zimmer": oben}, liste


def test_ebene_nach_kartenname():
    """Keller unten, Zimmer oben, Dachboden ganz oben; das Hinterzimmer bleibt im Erdgeschoss."""
    assert ebene("cedarCreek.archiv") == -1
    assert ebene("mapleFalls.zimmer") == 1
    assert ebene("mapleFalls.dachboden") == 2
    assert ebene("mapleFalls.wohnzimmer") == 0
    assert ebene("wegDesertSummit.hinterzimmer") == 0


def test_treppe_in_richtung_und_an_derselben_stelle_ist_in_ordnung():
    alle, liste = treppenpaar("treppeHoch", [2, 2], [2, 2])
    assert texte(alle, liste) == []


def test_treppe_nach_unten_auf_der_unteren_karte_ist_ein_befund():
    """Auf der unteren Karte führt der Aufgang hoch; ein Schacht nach unten dort ist falsch."""
    alle, liste = treppenpaar("schacht", [2, 2], [2, 2])
    befunde = texte(alle, liste)
    assert any("zeigt eine Treppe runter, der Übergang führt hoch" in b for b in befunde), befunde


def test_aufgang_an_anderer_stelle_ist_ein_befund():
    alle, liste = treppenpaar("treppeHoch", [1, 2], [4, 3])
    assert any("nicht an derselben Stelle" in b for b in texte(alle, liste))


def test_tuer_braucht_ein_tuerbild_kein_fenster():
    """Innen nach draußen: Am Auslöser in der Südwand steht ein Türbild, kein Fenster."""
    haus = szene(
        "t.aussen",
        "aussen",
        WIESE + ["........"] * 2,
        [{"name": "hausTuer", "feld": [2, 3]}],
        [{"moebel": "haus", "feld": [1, 0]}],
    )
    liste = [
        regel("t.raum", "ausgang", "t.aussen", "hausTuer"),
        regel("t.aussen", "hausTuer", "t.raum", "ausgang"),
    ]
    mit_tuer = szene(
        "t.raum",
        "innen",
        RAUM,
        [{"name": "ausgang", "feld": [3, 4]}],
        [{"moebel": "tuerSued", "feld": [3, 5]}],
    )
    assert not any("erwartet" in b for b in texte({"t.raum": mit_tuer, "t.aussen": haus}, liste))
    fenster = szene(
        "t.raum",
        "innen",
        RAUM,
        [{"name": "ausgang", "feld": [3, 4]}],
        [{"moebel": "fenster", "feld": [3, 5]}],
    )
    befunde = texte({"t.raum": fenster, "t.aussen": haus}, liste)
    assert any("erwartet Türbild, am Auslöser: fenster" in b for b in befunde), befunde


def test_tuer_innen_in_der_falschen_wand_und_schmaler_als_aussen():
    """Außen liegt die Tür vorn (Süd) und ist zwei Felder breit; innen in der Nordwand und schmal."""
    haus = szene(
        "t.aussen",
        "aussen",
        WIESE + ["........"] * 2,
        [{"name": "hausTuer", "feld": [2, 3]}, {"name": "hausTuer", "feld": [3, 3]}],
        [{"moebel": "haus", "feld": [1, 0]}],
    )
    nordtuer = szene(
        "t.raum",
        "innen",
        ["###.##", "#....#", "#....#", "######"],
        [{"name": "ausgang", "feld": [3, 0]}],
        [{"moebel": "tuerSued", "feld": [3, 0]}],
    )
    liste = [
        regel("t.raum", "ausgang", "t.aussen", "hausTuer"),
        regel("t.aussen", "hausTuer", "t.raum", "ausgang"),
    ]
    befunde = texte({"t.raum": nordtuer, "t.aussen": haus}, liste)
    assert any("Tür innen in der Nordwand, außen liegt sie auf der Südseite" in b for b in befunde), befunde
    assert any("Südtür in der Nordwand" in b for b in befunde), befunde
    assert any("1 Feld(er) breit, außen an haus 2" in b for b in befunde), befunde


def test_weg_am_rand_und_gleicher_belag():
    """Am Kartenrand liegt ein sichtbarer Weg, auf beiden Karten mit demselben Belag (10.72)."""

    def karte(name: str, zeichen: str, x: int, ausloeser: str, boden: str) -> dict:
        raster = ["....", zeichen * 4, "...."]
        return szene(
            name,
            "aussen",
            raster,
            [{"name": ausloeser, "feld": [x, 1]}],
            boden="gras",
            boeden={"e": "erde", "p": "pflaster"} if boden else {},
        )

    liste = [regel("a.aussen", "ost", "b.aussen", "west"), regel("b.aussen", "west", "a.aussen", "ost")]
    gleich = {
        "a.aussen": karte("a.aussen", "e", 3, "ost", "e"),
        "b.aussen": karte("b.aussen", "e", 0, "west", "e"),
    }
    assert texte(gleich, liste) == []
    wechsel = {**gleich, "b.aussen": karte("b.aussen", "p", 0, "west", "p")}
    assert any("Belag wechselt am Kartenrand: erde ↔ pflaster" in b for b in texte(wechsel, liste))
    wiese = {**gleich, "b.aussen": karte("b.aussen", ".", 0, "west", "")}
    assert any("erwartet Weg, am Auslöser: nichts" in b for b in texte(wiese, liste))


def test_bild_ohne_art_am_uebergang_wird_gemeldet():
    alle, liste = treppenpaar("treppeHoch", [2, 2], [2, 2])
    alle["t.wohnzimmer"]["objekte"].append({"moebel": "raetsel", "feld": [3, 2]})
    assert any("raetsel am Übergang hat keine Art" in b for b in texte(alle, liste))

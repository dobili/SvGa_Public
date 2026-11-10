"""Raumregeln des Kartenbauers (docs/spiel/KARTENREGELN.md, Abschnitt 8.6) an kleinen Beispielszenen.

Warum: Die Regeln stammen aus den Beispielräumen des Zeichners (Belegung, freier Gang, Stühle am
Tisch, Blickabstand, Platz vor Türen, Teppiche). Jede Regel wird hier mit einem Fall geprüft, der
passt, und einem, der einen Befund liefern muss.
"""

from pipeline.abenteuer.kartenbau import platziere
from pipeline.abenteuer.kartenregeln import (
    pruefe_belegung,
    pruefe_blickabstand,
    pruefe_eingaenge,
    pruefe_stuehle,
    pruefe_teppiche,
    pruefe_tueren,
)

MOEBEL = {
    "tisch": {"breite": 32, "hoehe": 32, "kollision": True, "art": "tisch", "quelle": "t.png"},
    "stuhlR": {
        "breite": 16,
        "hoehe": 32,
        "kollision": True,
        "art": "stuhl",
        "blick": "rechts",
        "quelle": "s.png",
    },
    "sofa": {"breite": 48, "hoehe": 32, "kollision": True, "art": "sofa", "blick": "oben", "quelle": "o.png"},
    "fernseher": {
        "breite": 32,
        "hoehe": 32,
        "kollision": True,
        "art": "fernseher",
        "blick": "unten",
        "quelle": "f.png",
    },
    "lowboard": {
        "breite": 48,
        "hoehe": 32,
        "kollision": True,
        "art": "schrank",
        "blick": "unten",
        "quelle": "l.png",
    },
    "tv": {"breite": 32, "hoehe": 32, "kollision": False, "art": "fernseher", "quelle": "v.png"},
    "schrank": {
        "breite": 32,
        "hoehe": 48,
        "kollision": True,
        "art": "schrank",
        "blick": "unten",
        "quelle": "k.png",
    },
    "teppich": {"breite": 48, "hoehe": 48, "kollision": False, "art": "teppich", "quelle": "p.png"},
    "tuer": {"breite": 16, "hoehe": 32, "kollision": False, "art": "tuer", "quelle": "d.png"},
    "kiste": {"breite": 16, "hoehe": 16, "kollision": True, "art": "kiste", "quelle": "x.png"},
}


def _raum(breite: int = 10, hoehe: int = 10, tuer_unten: int | None = 5) -> list[str]:
    """Innenraum: Nordwand drei Reihen, sonst eine Reihe; optional eine Lücke in der Südwand."""
    zeilen = ["#" * breite] * 3 + ["#" + "." * (breite - 2) + "#"] * (hoehe - 4)
    sued = ["#"] * breite
    if tuer_unten is not None:
        sued[tuer_unten] = "."
    return zeilen + ["".join(sued)]


def _szene(objekte: list[dict], **mehr) -> tuple[dict, list[str], list[dict]]:
    szene = {"art": "innen", "raster": _raum(), "objekte": objekte, **mehr}
    gesetzt, befunde = platziere(szene, MOEBEL)
    assert not befunde
    return szene, szene["raster"], gesetzt


def test_belegung_karg_und_vollgestellt():
    # 8 × 6 = 48 Bodenkacheln; ein Tisch belegt 2 (4 %), fünf Schränke in jeder Reihe zu viel.
    szene, zeilen, gesetzt = _szene([{"moebel": "tisch", "feld": [3, 4]}])
    assert "karg" in pruefe_belegung(szene, zeilen, gesetzt)[0]
    voll = [{"moebel": "schrank", "feld": [x, y]} for x in (1, 3, 5, 7) for y in (2, 4, 6)]
    szene, zeilen, gesetzt = _szene(voll)
    assert "vollgestellt" in pruefe_belegung(szene, zeilen, gesetzt)[0]
    mittel = [{"moebel": "schrank", "feld": [x, 2]} for x in (1, 3, 5, 7)] + [
        {"moebel": "tisch", "feld": [3, 6]}
    ]
    szene, zeilen, gesetzt = _szene(mittel)
    assert pruefe_belegung(szene, zeilen, gesetzt) == []


def test_belegung_stollen_darf_leerer_sein():
    """Ein Stollen mit 12 % Belegung ist kein karger Raum (Gutachten Goldmine, Runde 9)."""
    zeilen = ["#" * 12] + ["#" + "." * 10 + "#"] * 5 + ["#" * 12]
    szene = {
        "art": "innen",
        "objekte": [{"moebel": "tisch", "feld": [x, 1]} for x in (1, 4, 7)],
    }
    gesetzt, _ = platziere(szene, MOEBEL)
    assert pruefe_belegung(szene, zeilen, gesetzt)
    assert not pruefe_belegung({**szene, "stollen": True}, zeilen, gesetzt)


def test_belegung_nur_innen():
    szene, zeilen, gesetzt = _szene([], art="aussen")
    assert pruefe_belegung(szene, zeilen, gesetzt) == []


def test_eingang_braucht_freien_gang():
    ausgang = [{"name": "tuer", "feld": [5, 9]}]
    szene, zeilen, gesetzt = _szene([{"moebel": "kiste", "feld": [5, 7]}], ausloeser=ausgang)
    assert pruefe_eingaenge(szene, zeilen, gesetzt) == ["Eingang tuer: kein freier Gang von 2 Kacheln"]
    szene, zeilen, gesetzt = _szene([{"moebel": "kiste", "feld": [5, 6]}], ausloeser=ausgang)
    assert pruefe_eingaenge(szene, zeilen, gesetzt) == []


def test_stuhl_direkt_am_tisch():
    nah = [{"moebel": "tisch", "feld": [4, 4], "id": "t"}, {"moebel": "stuhlR", "feld": [3, 4], "zu": "t"}]
    szene, _, gesetzt = _szene(nah)
    assert pruefe_stuehle(szene, gesetzt, MOEBEL) == []
    fern = [{"moebel": "tisch", "feld": [4, 4], "id": "t"}, {"moebel": "stuhlR", "feld": [2, 4], "zu": "t"}]
    szene, _, gesetzt = _szene(fern)
    assert pruefe_stuehle(szene, gesetzt, MOEBEL) == ["stuhlR steht nicht direkt am Tisch t"]


def test_sofa_zwei_bis_vier_kacheln_vor_dem_fernseher():
    def befunde(sofa_y: int) -> list[str]:
        objekte = [
            {"moebel": "fernseher", "feld": [3, 2], "id": "tv"},
            {"moebel": "sofa", "feld": [3, sofa_y], "zu": "tv"},
        ]
        szene, _, gesetzt = _szene(objekte)
        return pruefe_blickabstand(szene, gesetzt, MOEBEL)

    assert befunde(4) == []  # Fernseher Fuß Reihe 3, Sofa Fuß Reihe 5: 2 Kacheln
    assert "1 Kacheln" in befunde(3)[0]
    assert "5 Kacheln" in befunde(7)[0]


def test_sofa_zum_lowboard_mit_fernseher():
    objekte = [
        {"moebel": "lowboard", "feld": [3, 2], "id": "lb"},
        {"moebel": "tv", "auf": "lb"},
        {"moebel": "sofa", "feld": [3, 3], "zu": "lb"},
    ]
    szene, _, gesetzt = _szene(objekte)
    assert "1 Kacheln vor lb" in pruefe_blickabstand(szene, gesetzt, MOEBEL)[0]


def test_tuer_an_der_wand_braucht_freie_kachel():
    tuer = {"moebel": "tuer", "feld": [4, 1], "an_wand": True}
    szene, zeilen, gesetzt = _szene([tuer])
    assert pruefe_tueren(szene, zeilen, gesetzt, MOEBEL) == []
    szene, zeilen, gesetzt = _szene([tuer, {"moebel": "kiste", "feld": [4, 3]}])
    assert pruefe_tueren(szene, zeilen, gesetzt, MOEBEL) == ["tuer: keine freie Kachel vor der Tür"]


def test_haustuer_in_der_suedwand_oeffnet_nach_oben():
    # Regel 10.7/10.8: Haustür als Bild in der Südwand; frei sein muss das Feld über dem Türbild.
    tuer = {"moebel": "tuer", "feld": [5, 8], "an_wand": True}
    szene, zeilen, gesetzt = _szene([tuer])
    assert pruefe_tueren(szene, zeilen, gesetzt, MOEBEL) == []
    szene, zeilen, gesetzt = _szene([tuer, {"moebel": "kiste", "feld": [5, 7]}])
    assert pruefe_tueren(szene, zeilen, gesetzt, MOEBEL) == ["tuer: keine freie Kachel vor der Tür"]


def test_tuer_in_der_suedwand_braucht_freie_kachel_im_raum():
    # Regel 10.7/10.8: Der Ausgang in der Südwand ist ein Türbild; davor (im Raum darüber) liegt die
    # Fußmatte, also muss die Kachel über der Tür frei sein.
    zeilen = _raum() + ["#" * 10]
    tuer = {"moebel": "tuer", "feld": [5, 9], "an_wand": True}
    szene = {"art": "innen", "raster": zeilen, "objekte": [tuer]}
    gesetzt, _ = platziere(szene, MOEBEL)
    assert pruefe_tueren(szene, zeilen, gesetzt, MOEBEL) == []
    szene["objekte"] = [tuer, {"moebel": "kiste", "feld": [5, 8]}]
    gesetzt, _ = platziere(szene, MOEBEL)
    assert pruefe_tueren(szene, zeilen, gesetzt, MOEBEL) == ["tuer: keine freie Kachel vor der Tür"]


def test_teppich_nie_unter_schrank():
    szene, _, gesetzt = _szene([{"moebel": "teppich", "feld": [1, 3]}, {"moebel": "schrank", "feld": [2, 2]}])
    assert pruefe_teppiche(gesetzt, MOEBEL) == ["teppich liegt unter schrank"]
    szene, _, gesetzt = _szene([{"moebel": "teppich", "feld": [4, 5]}, {"moebel": "schrank", "feld": [1, 1]}])
    assert pruefe_teppiche(gesetzt, MOEBEL) == []


def test_innenwand_braucht_wandflaeche():
    from pipeline.abenteuer.kartenregeln import pruefe_wandflaechen

    # Waagerechte Innenwand nur eine Reihe dick: von oben gesehen, ohne Fläche (Regel 10.39).
    zeilen = _raum()
    zeilen[6] = "#" * 10
    befunde = pruefe_wandflaechen({"art": "innen"}, zeilen)
    assert befunde and "Wand ohne Wandfläche" in befunde[0]
    # Drei Reihen dick wie die Nordwand: in Ordnung.
    zeilen[4] = zeilen[5] = "#" * 10
    assert pruefe_wandflaechen({"art": "innen"}, zeilen) == []


def test_gleiches_einzelmoebel_zweimal():
    from pipeline.abenteuer.kartenregeln import pruefe_doppelte

    moebel = {
        "schrankA": {"art": "schrank", "quelle": "alt.png"},
        "schrankB": {"art": "schrank", "quelle": "alt.png"},
        "arbeitsplatte": {"art": "schrank", "quelle": "platte.png"},
    }
    gesetzt = [{"name": n} for n in ("schrankA", "schrankB", "arbeitsplatte", "arbeitsplatte")]
    befunde = pruefe_doppelte({"art": "innen"}, gesetzt, moebel)
    assert len(befunde) == 1 and "schrankA" in befunde[0]

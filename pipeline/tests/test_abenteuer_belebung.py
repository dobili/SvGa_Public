"""Tests der Belebung (Regel 10.53): Statisten und Tiere auf Stadt- und Wegkarten, Sätze vorhanden."""

from pipeline.abenteuer.belebung import pruefe_belebung, pruefe_saetze, pruefe_standorte


def _statist(name: str, sagt: str | None = None) -> dict:
    eig = {"sagt": sagt} if sagt else {}
    return {"name": name, "typ": "statist", "feld": [1, 1], "eigenschaften": eig}


def _tier(name: str) -> dict:
    return {"name": name, "typ": "tier", "feld": [1, 1], "eigenschaften": {"verhalten": "ausweichen"}}


def test_weg_mit_wenig_leben_gemeldet() -> None:
    szene = {"karte": "wegA.wald", "art": "aussen", "belebung": [_statist("wanderer"), _tier("hase")]}
    befunde = pruefe_belebung(szene, "weg", False, {})
    assert befunde and befunde[0].startswith("Weg wirkt leer: 1 Statisten (0 ansprechbar), 1 Tiere")


def test_weg_mit_genug_leben_still() -> None:
    texte = {f"statist.wegA.wald.s{i}": "Satz" for i in range(4)}
    belebung = [_statist(f"s{i}", f"statist.wegA.wald.s{i}") for i in range(4)]
    belebung += [_tier(f"t{i}") for i in range(6)]
    szene = {"karte": "wegA.wald", "art": "aussen", "belebung": belebung}
    assert pruefe_belebung(szene, "weg", False, texte) == []


def test_stadt_braucht_zwoelf_statisten() -> None:
    belebung = [_statist(f"s{i}") for i in range(11)] + [_tier(f"t{i}") for i in range(4)]
    szene = {"karte": "ortA.aussen", "art": "aussen", "belebung": belebung}
    assert pruefe_belebung(szene, "stadt", True, {})


def test_fehlender_satz_auch_innen_gemeldet() -> None:
    szene = {"karte": "ortA.laden", "art": "innen", "belebung": [_statist("kundin", "statist.x")]}
    assert pruefe_saetze(szene, {}) == [
        "Satz fehlt: kundin sagt „statist.x“, der Schlüssel steht nicht in texte/de.json"
    ]
    assert pruefe_belebung(szene, "stadt", False, {"statist.x": "Hallo"}) == []


def _standort(name: str, feld: list[int], typ: str = "tier", verhalten: str = "ausweichen") -> dict:
    return {"name": name, "typ": typ, "feld": feld, "eigenschaften": {"verhalten": verhalten}}


ZEILEN = ["....", "..~~", "#.~~"]


def test_tier_im_wasser_gemeldet() -> None:
    befunde = pruefe_standorte({"belebung": [_standort("reiher", [2, 1])]}, ZEILEN, {"#", "~", " "}, {})
    assert befunde == ["reiher steht im Wasser bei (2, 1) (Regel 10.55)"]


def test_schwimmer_an_land_gemeldet_im_wasser_still() -> None:
    szene = {
        "belebung": [
            _standort("enten", [0, 0], verhalten="schwimmen"),
            _standort("gans", [3, 2], verhalten="schwimmen"),
        ]
    }
    assert pruefe_standorte(szene, ZEILEN, {"#", "~", " "}, {}) == [
        "enten schwimmt an Land bei (0, 0) (Regel 10.55)"
    ]


def test_tier_im_baum_gemeldet_statist_auf_bank_still() -> None:
    belegt = {(1, 0): "mfAhorn", (0, 0): "mf2BankLang"}
    szene = {
        "belebung": [
            _standort("specht", [1, 0], verhalten="sitzen"),
            _standort("rentner", [0, 0], typ="statist"),
        ]
    }
    assert pruefe_standorte(szene, ZEILEN, {"#", "~", " "}, belegt) == [
        "specht steht in mfAhorn bei (1, 0) (Regel 10.55)"
    ]


def test_wegpunkt_und_flieger() -> None:
    hase = {"name": "hase", "typ": "tier", "feld": [0, 0], "eigenschaften": {"bis": "0,2"}}
    kraehe = _standort("kraehen", [2, 2], verhalten="fliegen")
    befunde = pruefe_standorte({"belebung": [hase, kraehe]}, ZEILEN, {"#", "~", " "}, {})
    assert befunde == ["hase steht auf Wand oder außerhalb bei (0, 2) (Regel 10.55)"]

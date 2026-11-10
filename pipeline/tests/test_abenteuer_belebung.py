"""Tests der Belebung (Regel 10.53): Statisten und Tiere auf Stadt- und Wegkarten, Sätze vorhanden."""

from pipeline.abenteuer.belebung import pruefe_belebung, pruefe_saetze


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

"""Tests des Weltpuzzles (pipeline/abenteuer/weltpuzzle.py): Legen, Ringe, Überlappung, Randbruch."""

from pipeline.abenteuer import weltpuzzle
from pipeline.abenteuer.weltpuzzle import Naht, legen, naehte, randbrueche, ueberlappungen


def _karte(zeilen: list[str], ausloeser: dict[str, list[tuple[int, int]]], **mehr) -> dict:
    felder = [{"name": n, "feld": list(f)} for n, liste in ausloeser.items() for f in liste]
    return {"art": "aussen", "boden": "gras", "raster": zeilen, "ausloeser": felder, **mehr}


def _uebergang(karte: str, name: str, ziel: str, ziel_name: str) -> dict:
    ort = karte.split(".")[0]
    return {
        "art": "uebergang",
        "name": name,
        "karte": karte,
        "ort": ort,
        "ziel": {"karte": ziel, "ausloeser": ziel_name},
    }


WIESE = ["....", "....", "....", "...."]
WEST = _karte(WIESE, {"ost": [(3, 1), (3, 2)]})
OST = _karte(WIESE, {"west": [(0, 2), (0, 3)]})
PAAR = [_uebergang("a.west", "ost", "a.ost", "west"), _uebergang("a.ost", "west", "a.west", "ost")]


def test_naht_legt_die_zielkarte_buendig_und_auf_hoehe_der_ausloeser():
    """Ostrand Reihen 1–2 trifft Westrand Reihen 2–3: vier Kacheln rechts, eine höher."""
    gefunden = naehte({"a.west": WEST, "a.ost": OST}, PAAR)
    assert Naht("a.west", "ost", "a.ost", "ost", (4, -1)) in gefunden
    assert Naht("a.ost", "west", "a.west", "west", (-4, 1)) in gefunden


def test_legen_ergibt_eine_insel_ohne_befund():
    aussen = {"a.west": WEST, "a.ost": OST}
    inseln, befunde = legen(aussen, naehte(aussen, PAAR), [])
    assert inseln == [{"a.west": (0, 0), "a.ost": (4, -1)}]
    assert befunde == []
    assert ueberlappungen(inseln[0], aussen) == []


def test_ring_der_sich_nicht_schliesst_wird_gemeldet():
    """Wie Zedernpfad gegen Landstraße plus Flussweg (R032): Zwei Wege zum selben Ort sind
    verschieden lang."""
    aussen = {
        "a.start": _karte(WIESE, {"ost": [(3, 1)], "nord": [(1, 0)]}),
        "a.lang": _karte(["........"] * 4, {"west": [(0, 1)], "ost": [(7, 1)]}),
        "a.kurz": _karte(WIESE, {"sued": [(1, 3)], "ost": [(3, 1)]}),
        "a.ziel": _karte(WIESE, {"west": [(0, 1)], "west2": [(0, 2)]}),
    }
    liste = [
        _uebergang("a.start", "ost", "a.lang", "west"),
        _uebergang("a.lang", "west", "a.start", "ost"),
        _uebergang("a.lang", "ost", "a.ziel", "west"),
        _uebergang("a.ziel", "west", "a.lang", "ost"),
        _uebergang("a.start", "nord", "a.kurz", "sued"),
        _uebergang("a.kurz", "sued", "a.start", "nord"),
        _uebergang("a.kurz", "ost", "a.ziel", "west2"),
        _uebergang("a.ziel", "west2", "a.kurz", "ost"),
    ]
    alle_naehte = naehte(aussen, liste)
    _, befunde = legen(aussen, alle_naehte, [])
    assert len(befunde) == 1 and befunde[0].startswith("Ring schließt nicht")
    # Mit Zwischenstück am kurzen Weg legt der lange Weg fest, der Sprung bleibt klein.
    frei = [{"karte": "a.kurz", "ausloeser": "ost", "hinweis": "ungezeichnetes Wegstück"}]
    assert legen(aussen, alle_naehte, frei)[1] == []


def test_zwischenstueck_mit_festem_sprung_legt_die_karte_versetzt():
    """Zedernpfad: Der ungezeichnete Aufstieg hebt die Karte um den Sprung an."""
    aussen = {"a.west": WEST, "a.ost": OST}
    frei = [{"karte": "a.west", "ausloeser": "ost", "sprung": [3, -5], "hinweis": "Aufstieg"}]
    inseln, befunde = legen(aussen, naehte(aussen, PAAR), frei)
    assert inseln == [{"a.west": (0, 0), "a.ost": (7, -6)}]
    assert befunde == []


def test_zu_grosser_sprung_am_zwischenstueck(monkeypatch):
    monkeypatch.setattr(weltpuzzle, "SPRUNG_HOECHSTENS", 2)
    aussen = {
        "a.start": _karte(WIESE, {"ost": [(3, 1)], "nord": [(1, 0)]}),
        "a.lang": _karte(["................"] * 4, {"west": [(0, 1)], "ost": [(15, 1)]}),
        "a.kurz": _karte(WIESE, {"sued": [(1, 3)], "ost": [(3, 1)]}),
        "a.ziel": _karte(WIESE, {"west": [(0, 1)], "west2": [(0, 2)]}),
    }
    liste = [
        _uebergang("a.start", "ost", "a.lang", "west"),
        _uebergang("a.lang", "ost", "a.ziel", "west"),
        _uebergang("a.start", "nord", "a.kurz", "sued"),
        _uebergang("a.kurz", "ost", "a.ziel", "west2"),
    ]
    frei = [{"karte": "a.kurz", "ausloeser": "ost", "hinweis": "Test"}]
    befunde = legen(aussen, naehte(aussen, liste), frei)[1]
    assert len(befunde) == 1 and befunde[0].startswith("Zwischenstück zu groß")


def test_ueberlappung_zweier_karten():
    aussen = {"a.eins": WEST, "a.zwei": OST}
    assert ueberlappungen({"a.eins": (0, 0), "a.zwei": (2, 2)}, aussen) == [
        "Überlappung: a.eins und a.zwei liegen 2 × 2 Kacheln aufeinander"
    ]


def test_randbruch_wasser_hoert_am_rand_auf():
    """R034: „plötzlich kein Wasser mehr, wo es im Anschluss noch Wasser gab“."""
    fluss = _karte(["....", "....", "~~~~", "~~~~"], {"ost": [(3, 0)]})
    wiese = _karte(WIESE, {"west": [(0, 0)]})
    naht = Naht("a.fluss", "ost", "a.wiese", "ost", (4, 0))
    assert randbrueche(naht, {"a.fluss": fluss, "a.wiese": wiese}) == [
        "Randbruch: a.fluss „ost“ (ost) y 2–3: Wasser, auf a.wiese (y 2–3): Natur"
    ]
    assert randbrueche(naht, {"a.fluss": fluss, "a.wiese": fluss}) == []


def test_randbruch_strasse_wird_zum_weg_aber_stadtboden_zaehlt_nicht():
    """R036: Die Stadtstraße wird am Kartenrand zum Trampelpfad. Ein breiter befestigter Rand
    (Stadtboden über die ganze Kante) ist dagegen kein Bruch."""
    stadt = _karte(["sss.", "sss.", "sss."], {"ost": [(3, 1)]}, boeden={"s": "asphalt"}, boden="asphalt")
    land = _karte(["....", "eeee", "...."], {"west": [(0, 1)]}, boeden={"e": "erde"})
    naht = Naht("a.stadt", "ost", "a.land", "ost", (4, 0))
    befunde = randbrueche(naht, {"a.stadt": stadt, "a.land": land})
    assert befunde == [
        "Randbruch: a.stadt „ost“ (ost) y 0–0: Straße, auf a.land (y 0–0): Natur",
        "Randbruch: a.stadt „ost“ (ost) y 1–1: Straße, auf a.land (y 1–1): Weg",
        "Randbruch: a.stadt „ost“ (ost) y 2–2: Straße, auf a.land (y 2–2): Natur",
    ]
    hoch = _karte(["sss."] * 9, {"ost": [(3, 1)]}, boden="asphalt")
    assert randbrueche(naht, {"a.stadt": hoch, "a.land": _karte(["...."] * 9, {"west": [(0, 1)]})}) == []


def test_echte_karten_lassen_sich_legen():
    """Das Werkzeug läuft über alle Außenkarten, jede liegt in genau einer Insel."""
    from pipeline.abenteuer.uebergaenge import szenen, uebergaenge

    alle = szenen()
    inseln, _, _ = weltpuzzle.pruefe(alle, uebergaenge())
    karten = [k for insel in inseln for k in insel]
    assert sorted(karten) == sorted(weltpuzzle.aussenkarten(alle))

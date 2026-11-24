"""Tests der Bildwahl für Statisten (statistenwahl.py) und ihrer Dauerprüfung (statistenrolle.py).

Befund des Kartenblicks (M05, 24.11.2026): 633 von 682 Statisten bekamen ihr Bild durchs Los, in
App und Vorschau verschieden; jeder fünfte trug den Bauhelm. Jetzt wählt die Rolle. Ohne privates
Paket; nur der Abgleich der Typen mit den Bildordnern braucht es (sonst übersprungen).
"""

import os
from pathlib import Path

import pytest

pytest.importorskip("PIL.Image")  # Pillow fehlt in Actions (kartenbild, belebungsvorschau)

from pipeline.abenteuer import statistenrolle as R  # noqa: E402
from pipeline.abenteuer import statistenwahl as W  # noqa: E402
from pipeline.abenteuer.belebungsvorschau import statistenboegen, statistenbogen  # noqa: E402

PRIVAT = Path(
    os.environ.get("SVGA_PRIVAT") or Path(__file__).resolve().parents[2].parent / "schach-abenteuer-inhalte"
)
BAUHELM = "statist.arbeiter"


def _statist(name: str, x: int, y: int = 0, **mehr) -> W.Angabe:
    return W.Angabe(name=name, feld=(x, y), **mehr)


def test_rolle_aus_name_tun_und_eigenschaft():
    rolle = lambda *a: W.regel_fuer(*a)["rolle"]  # noqa: E731
    assert rolle("empfangsdame") == "konzern"
    assert rolle("kantinenkoch") == "koch"
    assert (rolle("kellnerin"), rolle("kellner")) == ("service", "kellner")
    assert (rolle("rentnerinnen"), rolle("rentnerPicknick")) == ("seniorin", "senior")
    assert (rolle("stegbauer"), rolle("bauer")) == ("bau", "land")
    # Das längste Wort gewinnt: Kinderwagen ist kein Kind, ein Radfahrer kein Fahrer.
    assert rolle("mutterMitKinderwagen") == "alltag"
    assert rolle("radfahrer") == "unterwegs"
    # Erst der Name, dann das tun, sonst Alltag; die Eigenschaft rolle geht vor.
    assert rolle("zuschauer", "sitzt mit Kapuze am Klapptisch") == "jugend"
    assert rolle("zuschauer", "schaut gebannt auf die Bretter") == "alltag"
    assert rolle("finn", "angelt Flaschen aus dem Becken") == "wasser"
    assert rolle("finn", "angelt Flaschen aus dem Becken", "kind") == "kind"
    assert rolle("kellner", "", "gibtesnicht") == "kellner"


def test_geschlecht_kennbild_und_streuwert():
    assert [W.geschlecht(n) for n in ("fotografin", "wanderinBeimEssen", "frauMitBesen")] == ["w"] * 3
    assert [W.geschlecht(n) for n in ("alterHerr", "zuschauer")] == ["m", "m"]
    assert [W.geschlecht(n) for n in ("kinder", "touristen", "pfadfinderB")] == [None] * 3
    assert W.kennbild("statist-07") == "statist.kindA"
    assert W.kennbild("statist-41") == "statist-41" and W.kennbild("otis") == "otis"
    # FNV-1a wie in der App (belebung.ts): bekannte Werte des Verfahrens.
    assert W.streuwert("") == 0x811C9DC5
    assert W.streuwert("a") == 0xE40C292C


def test_wahl_nach_rolle_ohne_gleiche_nachbarn():
    bilder = W.waehle([_statist("empfangsdame", 0), _statist("kantinenkoch", 20), _statist("angler", 40)])
    assert bilder == ["statist.konzern", "schiffskoch", "statist.fischer"]
    erster, zweiter = W.waehle([_statist("rentner", 5), _statist("rentner", 7)])
    assert erster == "statist.rentner" and zweiter != erster
    # Weiter als NAH auseinander darf es dasselbe Bild sein; ein Bild von Hand zählt als Nachbar.
    assert W.waehle([_statist("rentner", 5), _statist("rentner", 6 + W.NAH)]) == ["statist.rentner"] * 2
    assert W.waehle([_statist("rentner", 5), _statist("x", 6, bild="statist-10")])[0] != "statist.rentner"
    # Abwechslung innerhalb einer Rolle: fünf Passanten einer Straße, fünf Bilder.
    passanten = [_statist(f"passant{b}", i * 2) for i, b in enumerate("ABCDE")]
    assert len(set(W.waehle(passanten))) == len(passanten)


def test_sitzende_bekommen_ein_sitzbild_und_frauen_ein_frauenbild():
    for name in ("gast1", "gast2", "zuschauer", "kundin", "wartender"):
        assert W.TYPEN[W.waehle([_statist(name, 0, sitzt=True)])[0]]["sitzbild"], name
    assert W.TYPEN[W.waehle([_statist("besucherin", 0)])[0]].get("geschlecht") in (None, "w")
    assert W.sitzt({"sitzt": "oben"}) and W.sitzt({"zustand": "sitzboden"})
    assert not W.sitzt({"tun": "sitzt am Tresen"}) and not W.sitzt({"sitzt": "oben", "zustand": "stehen"})


def test_bauhelm_nur_bei_bauarbeit():
    assert W.waehle([_statist("bauarbeiter", 0)]) == [BAUHELM]
    for regel in W.ROLLEN["regeln"]:
        assert (BAUHELM in regel["typen"] + regel["ausweich"]) == (regel["rolle"] == "bau")
    # Über alle Szenen: Wer den Helm trägt, hat die Regel bau.
    for szene in R.lade_szenen().values():
        angaben = W.angaben_der_szene(szene)
        for a, bild in zip(angaben, W.waehle(angaben), strict=True):
            if W.kennbild(bild) == BAUHELM:
                assert W.regel_fuer(a.name, a.tun, a.rolle)["rolle"] == "bau", a.name


def test_erinnerungskarten_nur_historisch():
    szene = {
        "karte": "erinnerungLondon.strand",
        "belebung": [
            {"name": "passanten", "typ": "statist", "feld": [1, 1], "eigenschaften": {"tun": "gehen vorbei"}}
        ],
    }
    assert any("Erinnerungskarte" in satz for satz in R.befunde_der_szene("probe", szene))
    szene["belebung"][0]["eigenschaften"]["rolle"] = "historisch"
    assert R.befunde_der_szene("probe", szene) == []
    assert W.bilder_der_szene(szene) == ["statist.hist"]


def test_befunde_bild_von_hand_unbekannte_rolle_nachbarn():
    def szene(*statisten):
        return {
            "karte": "probe.karte",
            "belebung": [
                {"name": n, "typ": "statist", "feld": [x, 0], "eigenschaften": e} for n, x, e in statisten
            ],
        }

    falsch = R.befunde_der_szene("probe", szene(("eisverkaeufer", 0, {"bild": "statist-05"})))
    assert len(falsch) == 1 and "passt nicht zur Rolle service" in falsch[0]
    helm = R.befunde_der_szene("probe", szene(("gast", 0, {"bild": "statist-21"})))
    assert any("Bauhelm ohne Bauarbeit" in satz for satz in helm)
    assert "steht nicht in" in R.befunde_der_szene("probe", szene(("gast", 0, {"rolle": "x"})))[0]
    doppelt = szene(("a", 0, {"bild": "statist-09"}), ("b", 3, {"bild": "statist-11"}))
    assert any("beide statist.rentnerin" in satz for satz in R.befunde_der_szene("probe", doppelt))
    # Bilder eigener Figuren sind immer recht.
    assert R.befunde_der_szene("probe", szene(("angler", 0, {"bild": "silas"}))) == []


def test_vorschau_nimmt_dieselbe_wahl():
    szene = R.lade_szenen()["silicon-bay-akademie"]
    boegen = statistenboegen(szene)
    assert boegen == [f"figuren/{b}.png" for b in W.bilder_der_szene(szene)]
    namen = [a.name for a in W.angaben_der_szene(szene)]
    assert boegen[namen.index("empfangsdame")] == "figuren/statist.konzern.png"
    assert statistenbogen("schuelerin", "statist-07") == "figuren/statist-07.png"
    assert statistenbogen("bauarbeiter") == "figuren/statist.arbeiter.png"


def test_probe_fuer_die_app_ist_aktuell():
    # Vitest (statistenwahl.test.ts) rechnet diese Datei in der App nach: Vorschau und Spiel gleich.
    assert R.PROBEDATEI.read_text(encoding="utf-8") == R.probentext(), (
        "Probe veraltet: python -m pipeline.abenteuer.statistenrolle --probe"
    )
    assert sum(len(s["statisten"]) for s in R.probe()["szenen"]) >= 50


def test_keine_befunde_in_allen_szenen():
    # Dauertest: Bild passt zur Rolle, kein gleiches Bild in der Nähe, Erinnerung nur historisch.
    assert [f"{szene}: {satz}" for szene, satz in R.alle_befunde()] == []
    for (szene, _name), grund in R.GEPRUEFT.items():
        assert szene in R.lade_szenen() and grund


@pytest.mark.skipif(not (PRIVAT / "spiel" / "figuren-neu").exists(), reason="privates Repository fehlt")
def test_typen_liegen_im_paket_mit_passendem_sitzbild():
    assert R.listenbefunde(PRIVAT) == []

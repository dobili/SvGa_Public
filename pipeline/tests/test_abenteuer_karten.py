"""Die Tiled-Karten des Schach-Abenteuers müssen den Regeln der Oberwelt genügen.

Warum: Die Oberwelt (``app/src/abenteuer/oberwelt/szene.ts``) braucht feste Ebenen, einen
Startpunkt, erklärte Auslöser und erreichbare Ziele. Die Regeln stehen in
``inhalte/abenteuer/README.md`` (Abschnitt Tiled-Karten); dieser Test prüft jede Karte, die
``orte.json`` nennt, damit neue Karten (Cedar Creek und weitere) nichts kaputtmachen.
"""

import json
from pathlib import Path

import pytest

from pipeline.abenteuer import karten as k

HAUPTORDNER = Path(__file__).resolve().parents[2]
INHALTE = HAUPTORDNER / "inhalte" / "abenteuer"
ORTE = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
BILD = "../grafik/platzhalter.png"

FAELLE = [(ort, eintrag) for ort in ORTE for eintrag in ort["karten"]]

# Bekannte Befunde, die der Haupt-Chat entscheidet (Karte und orte.json bleiben unverändert).
# strict: Wird der Befund behoben, schlägt der Test fehl, und der Eintrag muss hier weg.
BEFUNDE_ERKLAERT = {
    "mapleFalls.wohnzimmer": "Auslöser treppeOben ist nur Ziel von treppe, nicht in orte.json erklärt",
}


def _mit_befund(befunde: dict[str, str]) -> list:
    return [
        pytest.param(
            ort, e, id=e["kennung"], marks=pytest.mark.xfail(reason=befunde[e["kennung"]], strict=True)
        )
        if e["kennung"] in befunde
        else pytest.param(ort, e, id=e["kennung"])
        for ort, e in FAELLE
    ]


KENNUNGEN = [eintrag["kennung"] for _, eintrag in FAELLE]


def _karte(eintrag: dict) -> dict:
    return k.lade_karte(INHALTE / eintrag["datei"])


def _uebergaenge(ort: dict) -> list[dict]:
    return [a for a in ort["ausloeser"] if a["art"] == "uebergang"]


@pytest.mark.parametrize(("ort", "eintrag"), FAELLE, ids=KENNUNGEN)
def test_ebenen_und_kachelsatz(ort: dict, eintrag: dict):
    karte = _karte(eintrag)
    flaeche = karte["width"] * karte["height"]
    for name in k.KACHELEBENEN:
        schicht = k.ebene(karte, name)
        assert schicht is not None and schicht["type"] == "tilelayer", name
        assert len(schicht["data"]) == flaeche, name
    assert (k.ebene(karte, k.OBJEKTEBENE) or {}).get("type") == "objectgroup"
    assert [e["name"] for e in karte["layers"]] == [*k.KACHELEBENEN, k.OBJEKTEBENE]
    for satz in karte["tilesets"]:
        assert "source" not in satz and satz["image"] == BILD


@pytest.mark.parametrize(("ort", "eintrag"), FAELLE, ids=KENNUNGEN)
def test_genau_ein_start_mit_richtung(ort: dict, eintrag: dict):
    starts = [o for o in k.objekte(_karte(eintrag)) if o.name == "start" and not o.figur]
    assert len(starts) == 1
    assert starts[0].eigenschaften.get("richtung") in k.RICHTUNGEN


@pytest.mark.parametrize(("ort", "eintrag"), _mit_befund(BEFUNDE_ERKLAERT))
def test_ausloeser_und_figuren_erklaert(ort: dict, eintrag: dict):
    erklaert = {a["name"] for a in ort["ausloeser"]}
    figuren = {f["kennung"].split(".", 1)[1] for f in ort["figuren"]}
    for objekt in k.objekte(_karte(eintrag)):
        if objekt.figur:
            assert objekt.name in figuren, f"Figur {objekt.name} fehlt in orte.json"
        else:
            assert objekt.name in erklaert, f"Auslöser {objekt.name} fehlt in orte.json"


def test_uebergaenge_haben_zielobjekt():
    dateien = {e["kennung"]: e for _, e in FAELLE}
    offen = 0
    for ort in ORTE:
        for uebergang in _uebergaenge(ort):
            ziel = uebergang.get("ziel")
            if ziel is None:
                offen += 1
                continue
            namen = {o.name for o in k.objekte(_karte(dateien[ziel["karte"]]))}
            assert ziel["ausloeser"] in namen, f"{uebergang['name']} → {ziel}"
    print(f"Übergänge ohne Ziel (offen): {offen}")


@pytest.mark.parametrize(("ort", "eintrag"), FAELLE, ids=KENNUNGEN)
def test_alles_von_start_erreichbar(ort: dict, eintrag: dict):
    karte = _karte(eintrag)
    alle = k.objekte(karte)
    start = next(o for o in alle if o.name == "start")
    begehbar, gesperrt = k.erreichbar(karte, start.feld), k.blockiert(karte)
    assert begehbar, "Start liegt auf einer Kollisionskachel"
    for objekt in alle:
        assert k.objekt_erreichbar(objekt, begehbar, gesperrt), objekt.name


@pytest.mark.parametrize(("ort", "eintrag"), FAELLE, ids=KENNUNGEN)
def test_rand_geschlossen(ort: dict, eintrag: dict):
    karte = _karte(eintrag)
    namen = {a["name"] for a in _uebergaenge(ort)}
    tueren = {o.feld for o in k.objekte(karte) if o.name in namen and not o.figur}
    assert k.offene_randfelder(karte, tueren) == []

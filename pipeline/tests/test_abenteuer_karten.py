"""Die Tiled-Karten des Schach-Abenteuers müssen den Regeln der Oberwelt genügen.

Warum: Die Oberwelt (``app/src/abenteuer/oberwelt/szene.ts``) braucht feste Ebenen, einen
Startpunkt, erklärte Auslöser und erreichbare Ziele. Die Regeln stehen in
``inhalte/abenteuer/README.md`` (Abschnitt Tiled-Karten); dieser Test prüft jede Karte, die
``orte.json`` nennt, damit neue Karten (Cedar Creek und weitere) nichts kaputtmachen.
"""

import json
import re
from pathlib import Path

import pytest

from pipeline.abenteuer import karten as k
from pipeline.abenteuer import moebelliste

HAUPTORDNER = Path(__file__).resolve().parents[2]
INHALTE = HAUPTORDNER / "inhalte" / "abenteuer"
ORTE = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
BILD = "../grafik/platzhalter.png"

FAELLE = [(ort, eintrag) for ort in ORTE for eintrag in ort["karten"]]

# Bekannte Befunde, die der Haupt-Chat entscheidet (Karte und orte.json bleiben unverändert).
# strict: Wird der Befund behoben, schlägt der Test fehl, und der Eintrag muss hier weg.
BEFUNDE_ERKLAERT: dict[str, str] = {}


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
    """Lädt die Karte; eine in orte.json genannte, aber noch nicht gezeichnete Karte überspringt
    den Test (die Spieldaten eines Ortes kommen vor seinen Karten, die Oberwelt meldet die Lücke)."""
    datei = INHALTE / eintrag["datei"]
    if not datei.exists():
        pytest.skip(f"Karte {eintrag['kennung']} noch nicht gezeichnet ({eintrag['datei']})")
    return k.lade_karte(datei)


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
    # start ist laut README immer der Standardeinstieg, auch ohne Eintrag in orte.json.
    erklaert = {"start"} | {a["name"] for a in ort["ausloeser"]}
    figuren = {f["kennung"].split(".", 1)[1] for f in ort["figuren"]}
    for objekt in k.objekte(_karte(eintrag)):
        # Statisten und Tiere (09_Weltbeschreibung, 4a) stehen nicht in orte.json.
        if objekt.belebung or objekt.moebel:
            continue
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
            zielkarte = INHALTE / dateien[ziel["karte"]]["datei"]
            if not zielkarte.exists():
                offen += 1
                continue
            namen = {o.name for o in k.objekte(k.lade_karte(zielkarte))}
            assert ziel["ausloeser"] in namen, f"{uebergang['name']} → {ziel}"
    print(f"Übergänge ohne Ziel (offen): {offen}")


@pytest.mark.parametrize(("ort", "eintrag"), FAELLE, ids=KENNUNGEN)
def test_alles_von_start_erreichbar(ort: dict, eintrag: dict):
    karte = _karte(eintrag)
    alle = k.objekte(karte)
    start = next(o for o in alle if o.name == "start")
    begehbar, gesperrt = k.erreichbar(karte, start.feld), k.blockiert(karte)
    assert begehbar, "Start liegt auf einer Kollisionskachel"
    # Eine Sperre (Stamm, Tor) darf eine Karte teilen: Jeder Teil hat dann einen eigenen Eingang.
    # Erreichbar ist, was vom Start oder von einem Übergang der Karte aus zu Fuß erreichbar ist.
    namen = {a["name"] for a in _uebergaenge(ort)}
    for eingang in (o for o in alle if o.name in namen and not o.figur):
        x, y = eingang.feld
        for feld in [(x, y), (x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]:
            begehbar |= k.erreichbar(karte, feld)
    for objekt in alle:
        # Möbel, Statisten und Tiere muss man nicht erreichen (Schmuck und Belebung).
        if objekt.moebel or objekt.belebung:
            continue
        assert k.objekt_erreichbar(objekt, begehbar, gesperrt), objekt.name


@pytest.mark.parametrize(("ort", "eintrag"), FAELLE, ids=KENNUNGEN)
def test_rand_geschlossen(ort: dict, eintrag: dict):
    karte = _karte(eintrag)
    namen = {a["name"] for a in _uebergaenge(ort)}
    tueren = {o.feld for o in k.objekte(karte) if o.name in namen and not o.figur}
    assert k.offene_randfelder(karte, tueren) == []


def _namen_auf_karten(ort: dict) -> set[str] | None:
    """Namen aller Objekte auf den gezeichneten Karten eines Ortes; None, wenn keine gezeichnet ist."""
    dateien = [INHALTE / e["datei"] for e in ort["karten"] if (INHALTE / e["datei"]).exists()]
    if not dateien:
        return None
    return {o.name for datei in dateien for o in k.objekte(k.lade_karte(datei))}


@pytest.mark.parametrize("ort", ORTE, ids=[o["kennung"] for o in ORTE])
def test_jede_figur_und_jeder_ausloeser_steht_auf_einer_karte(ort: dict):
    # Warum: Eine Figur ohne Platz ist im Spiel unerreichbar und kann die Handlung sperren
    # (Befund der Gesamtsimulation, 08.11.2026: der Bibliothekar in Maple Falls fehlte).
    namen = _namen_auf_karten(ort)
    if namen is None:
        pytest.skip(f"Ort {ort['kennung']} hat noch keine gezeichnete Karte")
    fehlend = [f["kennung"] for f in ort["figuren"] if f["kennung"].split(".", 1)[1] not in namen]
    fehlend += [a["name"] for a in ort["ausloeser"] if a["name"] not in namen]
    assert not fehlend, f"nicht auf einer Karte: {fehlend}"


def test_moebel_bekannt_und_frei_von_ausloesern():
    # Möbel stehen in inhalte/abenteuer/moebel/ und versperren keinen Auslöser und keine Figur.
    for ort, eintrag in FAELLE:
        datei = INHALTE / eintrag["datei"]
        if not datei.exists():
            continue
        karte = k.lade_karte(datei)
        gesperrt = k.moebelfelder(karte)
        # Gegenstände zum Ansehen dürfen auf einem Möbel liegen (man steht davor, wie beim Brett).
        ansehen = {a["name"] for a in ort["ausloeser"] if a["art"] == "gegenstand"}
        for objekt in k.objekte(karte):
            if objekt.moebel:
                assert objekt.name in k.MOEBEL, f"{eintrag['kennung']}: Möbel {objekt.name} fehlt"
            elif not objekt.belebung and objekt.name not in ansehen:
                assert objekt.feld not in gesperrt, f"{eintrag['kennung']}: {objekt.name} zugestellt"


def test_moebel_namen_eindeutig():
    # Jeder Ort hat seine eigene Möbeldatei (inhalte/abenteuer/moebel/); Szenen und Karten kennen ein
    # Möbel nur über seinen Namen, deshalb darf kein Name in zwei Dateien stehen.
    assert moebelliste.moebeldateien(), "inhalte/abenteuer/moebel/ ist leer"
    assert moebelliste.doppelte_namen() == []


def test_doppelter_moebelname_bricht_ab(tmp_path: Path):
    # Ein doppelter Name wird gemeldet und nicht still überschrieben.
    eintrag = {"quelle": "x.png", "breite": 16, "hoehe": 16}
    for ort in ("maple-falls", "cedar-creek"):
        (tmp_path / f"{ort}.json").write_text(json.dumps({"moebel": {"kiste": eintrag}}), "utf-8")
    assert moebelliste.doppelte_namen(tmp_path) == ["kiste (cedar-creek.json, maple-falls.json)"]
    with pytest.raises(ValueError, match="kiste"):
        moebelliste.lade_moebel(tmp_path)


def test_startposition_der_app_ist_der_start_des_dachbodens():
    """Die App beginnt ein neues Abenteuer an STARTPOSITION (app/src/abenteuer/regeln/spielstand.ts).
    Warum: Nach dem Umbau des Dachbodens in Runde 4 stand der Held dort noch an der alten Stelle;
    die Stelle muss der Auslöser „start“ der Karte sein, mit seiner Blickrichtung."""
    quelle = (HAUPTORDNER / "app/src/abenteuer/regeln/spielstand.ts").read_text(encoding="utf-8")
    block = re.search(r"STARTPOSITION: Weltposition = \{(.*?)\};", quelle, re.S)
    assert block, "STARTPOSITION nicht gefunden"
    werte = dict(re.findall(r"(\w+): \"?([\w.]+)\"?,", block.group(1)))
    eintrag = next(e for _, e in FAELLE if e["kennung"] == werte["karte"])
    start = next(o for o in k.objekte(_karte(eintrag)) if o.name == "start" and not o.figur)
    assert start.feld == (int(werte["x"]), int(werte["y"]))
    assert start.eigenschaften.get("richtung") == werte["richtung"]

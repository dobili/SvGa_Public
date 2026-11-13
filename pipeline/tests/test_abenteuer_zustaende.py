"""Zustände der Karten (``zustaende`` in ``orte.json``) und Bedingungen an Übergängen (``wenn``).

Warum: Runde 6 (zweite Fassung einer Karte) und Runde 8 (Bedingungen, Zustände je Karte). Die App
findet einen Zustand nur über ``zustaende`` der Karte (Bedingung → Datei, der letzte passende gilt);
eine Szene mit ``zustand_der_karte`` ohne Eintrag dort würde nie geladen. Bedingungen haben eine
eigene kleine Sprache (``pipeline/abenteuer/bedingung.py``), Tippfehler fielen sonst erst im Spiel
auf. Beispiel: ``port-delacroix-musikhaus-neu.json`` mit ``musikhausOffen``.
"""

import json
import re
from pathlib import Path

from pipeline.abenteuer.bedingung import Bedingungsfehler, variablen
from pipeline.abenteuer.zustaende import zustandsname, zustandssatz

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
# Variablen, die die App selbst setzt (regeln/dialogvariablen.ts) und nicht als VAR im Ink stehen.
ERZEUGT = re.compile(r"^(hat|gefunden|besucht|nadel|ausgang)[A-Z]|Bestanden$|^muenzen$")


def _orte() -> list[dict]:
    return json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]


def _karten() -> dict[str, dict]:
    return {k["kennung"]: k for ort in _orte() for k in ort["karten"]}


def _szenen() -> dict[str, dict]:
    ergebnis = {}
    for datei in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(datei.read_text(encoding="utf-8"))
        ergebnis[szene.get("datei", "")] = {**szene, "_name": datei.name}
    return ergebnis


def _ink_variablen() -> set[str]:
    namen = set()
    for datei in (INHALTE / "dialoge").glob("*/*.ink"):
        namen |= set(re.findall(r"^VAR\s+(\w+)", datei.read_text(encoding="utf-8"), re.M))
    return namen


def _bedingungen() -> list[tuple[str, str]]:
    """(Fundstelle, Bedingung) für alle Schlüssel von zustaende und alle wenn."""
    ergebnis = []
    for ort in _orte():
        for k in ort["karten"]:
            ergebnis += [(f"{k['kennung']}.zustaende", b) for b in k.get("zustaende", {})]
        ergebnis += [
            (f"{ort['kennung']}.{a['name']}.wenn", a["wenn"]) for a in ort["ausloeser"] if a.get("wenn")
        ]
        ergebnis += [(f"{f['kennung']}.wenn", f["wenn"]) for f in ort["figuren"] if f.get("wenn")]
    for datei in sorted((INHALTE / "szenen").rglob("*.json")):
        objekte = json.loads(datei.read_text(encoding="utf-8")).get("objekte", [])
        ergebnis += [(f"{datei.name}.{o['moebel']}.wenn", o["wenn"]) for o in objekte if o.get("wenn")]
    return ergebnis


def test_zweite_fassungen_sind_eingetragen():
    karten = _karten()
    befunde = []
    for datei in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(datei.read_text(encoding="utf-8"))
        flag = szene.get("zustand_der_karte")
        if not flag:
            continue
        eintrag = karten.get(szene["karte"], {}).get("zustaende", {})
        if eintrag.get(flag) != szene["datei"]:
            befunde.append(f"{datei.name}: {szene['karte']} braucht zustaende[{flag!r}] = {szene['datei']}")
    assert not befunde, "\n".join(befunde)


def test_dateien_der_zustaende_gibt_es():
    for kennung, karte in _karten().items():
        for flag, datei in karte.get("zustaende", {}).items():
            assert (INHALTE / datei).exists(), f"{kennung}: {flag} → {datei} fehlt"


def test_zustaende_heissen_nach_der_grundkarte_und_sagen_wann():
    """Datei ``<basis>-<zustand>.json``, Szene mit „Zustand: …“ am Anfang der Beschreibung."""
    szenen = _szenen()
    befunde = []
    for kennung, karte in _karten().items():
        for datei in karte.get("zustaende", {}).values():
            if zustandsname(datei, karte["datei"]) == Path(datei).stem:
                befunde.append(f"{kennung}: {datei} heißt nicht {Path(karte['datei']).stem}-<zustand>.json")
            szene = szenen.get(datei)
            if not szene:
                befunde.append(f"{kennung}: keine Szene mit datei {datei}")
            elif not szene.get("beschreibung", "").startswith("Zustand:"):
                befunde.append(f"{szene['_name']}: beschreibung beginnt nicht mit „Zustand:“")
    assert not befunde, "\n".join(befunde)


def test_bedingungen_sind_lesbar_und_kennen_ihre_variablen():
    bekannt = _ink_variablen()
    befunde = []
    for stelle, bedingung in _bedingungen():
        try:
            namen = variablen(bedingung)
        except Bedingungsfehler as fehler:
            befunde.append(f"{stelle}: {fehler}")
            continue
        unbekannt = sorted(n for n in namen if n not in bekannt and not ERZEUGT.search(n))
        if unbekannt:
            befunde.append(f"{stelle}: unbekannte Variable {', '.join(unbekannt)} in „{bedingung}“")
    assert not befunde, "\n".join(befunde)


def test_zustandssatz_endet_nicht_an_abkuerzungen():
    """„Mr. Pratt“ ist kein Satzende (Gutachten der Zustände aus Runde 8)."""
    text = "Zustand: Nach der ersten Nadel: Mr. Pratt hat den Steg erneuert. Der Park liegt am Fluss."
    assert zustandssatz(text) == "Nach der ersten Nadel: Mr. Pratt hat den Steg erneuert."
    assert zustandssatz("Ohne Zustand.") is None

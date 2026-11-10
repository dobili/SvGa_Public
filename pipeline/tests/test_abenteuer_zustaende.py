"""Jede zweite Fassung einer Karte (``zustand_der_karte`` in der Szene) steht in ``orte.json``.

Warum: Runde 6. Die App findet die zweite Fassung nur über ``zustaende`` der Karte in
``orte.json`` (Dialogvariable → Datei); eine Szene mit ``zustand_der_karte`` ohne Eintrag dort
würde nie geladen. Beispiel: ``port-delacroix-musikhaus-neu.json`` mit ``musikhausOffen``.
"""

import json
from pathlib import Path

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"


def _karten() -> dict[str, dict]:
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))
    return {k["kennung"]: k for ort in orte["orte"] for k in ort["karten"]}


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
            befunde.append(f"{datei.name}: {szene['karte']} braucht zustaende.{flag} = {szene['datei']}")
    assert not befunde, "\n".join(befunde)


def test_dateien_der_zustaende_gibt_es():
    for kennung, karte in _karten().items():
        for flag, datei in karte.get("zustaende", {}).items():
            assert (INHALTE / datei).exists(), f"{kennung}: {flag} → {datei} fehlt"

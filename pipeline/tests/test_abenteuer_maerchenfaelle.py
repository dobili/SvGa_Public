"""Form der Testfälle für Falke und Bison (seirawan) und Drache (pipeline/abenteuer/maerchenfaelle.py).

Warum: Die App prüft ihre Regelschicht (ffish) gegen diese Datei; sie muss vollständig und in sich
stimmig sein. Ohne pyffish: Nur die gespeicherte Datei wird gelesen.
"""

import json
from pathlib import Path

from pipeline.abenteuer.maerchenfaelle import DRACHE_INI, SONDERFAELLE, VARIANTEN

DATEI = Path(__file__).resolve().parents[2] / "app/src/abenteuer/regeln/maerchenfaelle.json"


def test_jeder_fall_hat_seinen_zug_unter_den_legalen():
    daten = json.loads(DATEI.read_text(encoding="utf-8"))
    assert daten["ini"] == DRACHE_INI
    for variante in VARIANTEN:
        faelle = daten["varianten"][variante]["faelle"]
        assert len(faelle) > len(SONDERFAELLE[variante])
        for fall in faelle:
            assert fall["zug"] in fall["legal"].split(), fall
            assert fall["danach"] != fall["fen"]


def test_einsetzen_kommt_vor():
    daten = json.loads(DATEI.read_text(encoding="utf-8"))
    figur = {"seirawan": "he", "drache": "d"}
    for variante, zeichen in figur.items():
        zuege = [f["zug"] for f in daten["varianten"][variante]["faelle"]]
        assert any(len(z) == 5 and z[4] in zeichen for z in zuege), variante
    start = daten["varianten"]["drache"]["start"]
    assert start.split()[0].endswith("[Dd]")

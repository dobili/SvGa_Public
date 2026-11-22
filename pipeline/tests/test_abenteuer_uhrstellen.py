"""Dauertest der Spieluhr-Stellen (pipeline/abenteuer/uhrstellen.py): Wo die Geschichte eine
Tageszeit erzählt, setzt sie die Uhr (``#uhr``), außer an geprüften Stellen mit Grund."""

import re

from pipeline.abenteuer import uhrstellen

ANGABE = re.compile(r"#uhr:(morgen|mittag|tag|abend|nacht|\d{1,2})\b")


def test_keine_tageszeit_ohne_uhr():
    assert uhrstellen.befunde() == []


def test_uhrangaben_sind_gueltig():
    falsch = [s for s in uhrstellen.gesetzt() if not ANGABE.search(s)]
    assert falsch == [] and len(uhrstellen.gesetzt()) >= 30


def test_geprueft_gibt_es_noch():
    """Jede Ausnahme zeigt auf eine vorhandene Zeile (sonst ist sie überflüssig)."""
    fehlt = []
    for datei, anfang in uhrstellen.GEPRUEFT:
        text = (uhrstellen.DIALOGE / datei).read_text(encoding="utf-8")
        if not any(z.strip().lstrip("- ").startswith(anfang) for z in text.splitlines()):
            fehlt.append((datei, anfang))
    assert fehlt == []

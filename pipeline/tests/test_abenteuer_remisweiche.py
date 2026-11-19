"""Remis in kurzen Partieformen: Jede Weiche, die den Ausgang abfragt, behandelt das Remis eigens.

Warum: In Stellungsduell und Vorteil (Regelwerk R13, R13b) und im Endspiel „gewinnen“ (R13a) ist
ein Remis ein eigener Ausgang: Vorteil da, aber unter dem Mindestvorteil. Zwölf Weichen fragten
nur „niederlage“ ab und schickten alles andere in `…_nach_sieg`. Ein Remis brachte dann
„Gewonnen“ und eine Karte (Sol, Summit City; Spieler-Durchlauf mit schwachem Spieler,
19.11.2026). Die Gesamtsimulation spielt kaum Remis und sah es nicht.

Regel dieses Tests: Fragt eine Weiche (ein Block `{ - … }`) `ausgang<Begegnung> == "niederlage"`
ab und kann die Begegnung remis enden, dann fragt derselbe Block auch `== "remis"` ab, oder er
fragt `== "sieg"` ab (dann ist der Rest bewusst gemeint).
"""

import json
import re
from pathlib import Path

HAUPTORDNER = Path(__file__).resolve().parents[2]
DIALOGE = HAUPTORDNER / "inhalte" / "abenteuer" / "dialoge" / "de"
BEGEGNUNGEN = HAUPTORDNER / "inhalte" / "abenteuer" / "begegnungen.json"

# Ein Block mit Zweigen, wie Ink ihn schreibt: „{“ allein, dann Zeilen „- Bedingung: …“, dann „}“.
WEICHE = re.compile(r"^\{\n((?:[ \t]*- .*\n|[ \t]*//.*\n)+)\}", re.M)


def ausgangsvariable(kennung: str) -> str:
    """Name der Dialogvariable zum Ausgang einer Begegnung: summitCity.sol → ausgangSummitCitySol."""
    ort, name = kennung.split(".", 1)
    return f"ausgang{ort[0].upper()}{ort[1:]}{name[0].upper()}{name[1:]}"


def kann_remis(format_: dict) -> bool:
    """Kann eine Begegnung dieses Formats remis enden, obwohl ein Sieg verlangt ist?"""
    art = format_.get("art")
    return art in ("stellungsduell", "vorteil") or (art == "endspiel" and format_.get("ziel") == "sieg")


def remisvariablen() -> set[str]:
    daten = json.loads(BEGEGNUNGEN.read_text(encoding="utf-8"))
    return {ausgangsvariable(b["kennung"]) for b in daten["begegnungen"] if kann_remis(b.get("format", {}))}


def luecken(quelle: str, variablen: set[str]) -> list[str]:
    """Variablen, deren Weiche die Niederlage abfragt, aber weder Remis noch Sieg."""
    funde = []
    for block in WEICHE.finditer(quelle):
        text = block.group(1)
        for v in sorted(variablen):
            if f'{v} == "niederlage"' not in text:
                continue
            if f'{v} == "remis"' in text or f'{v} == "sieg"' in text:
                continue
            funde.append(v)
    return funde


def test_beispiel_ohne_remis_wird_gefunden():
    quelle = '{\n- ausgangX == "niederlage": -> x_nach_niederlage\n- else: -> x_nach_sieg\n}\n'
    assert luecken(quelle, {"ausgangX"}) == ["ausgangX"]
    mit = '{\n- ausgangX == "remis": -> r\n- ausgangX == "niederlage": -> n\n- else: -> s\n}\n'
    assert luecken(mit, {"ausgangX"}) == []


def test_alle_weichen_behandeln_das_remis():
    variablen = remisvariablen()
    assert "ausgangSummitCitySol" in variablen
    funde = []
    for datei in sorted(DIALOGE.glob("*.ink")):
        funde += [f"{datei.name}: {v}" for v in luecken(datei.read_text(encoding="utf-8"), variablen)]
    assert funde == []

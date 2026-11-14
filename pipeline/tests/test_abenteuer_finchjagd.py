"""Finch-Jagd und Sammelstränge: Kein Neuladen und kein ausgelassenes Versteck darf sie hängen lassen.

Warum: Die Chaos-Prüfung (Startwert 3, Gebiet Hochebene, N 1000, 14.11.2026) fand die Nebenquest
``wegGhostCapital.finchJagd`` hängend bei Odette: 14 von 15 Figuren, die Figur in der Schule auf der
Hochebene fehlte. Zwei Ursachen, zwei Absicherungen:

1. Odette zählte ``finchFiguren``, eine Ink-Variable, die ein Neuladen mitten im Fund-Dialog verlieren
   konnte, während der Fund selbst schon im Spielstand stand. Sie zählt jetzt die Funde der Hülle
   (``gefundenFinch…``) und nennt im Hinweis das Versteck der ersten fehlenden Figur (früher nur
   „an den Wegen, im Steinbruch, in der Sternwarte und auf der Pelikaninsel“, ohne Hochebene und
   Bayou). Geprüft mit dem echten Ink-Compiler.
2. Die Simulation holt fehlende Stücke der Sammelstränge vor der Rückkehr zu den Quests
   (``sammeln`` in ``gesamtsimulation-rueckkehr.cjs``); dafür braucht jedes Stück einen Auslöser in
   ``orte.json``.
"""

import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest

HAUPTORDNER = Path(__file__).resolve().parents[2]
DIALOGE = HAUPTORDNER / "inhalte" / "abenteuer" / "dialoge" / "de"
ODETTE = DIALOGE / "weg-ghost-capital.ink"
INKJS = HAUPTORDNER / "app" / "node_modules" / "inkjs"
ZEITGRENZE = 120
FIGUREN_ZAHL = 15

# Spielt Odettes Dialog mit gesetzten Variablen und gibt alle Zeilen aus (inkjs wie die App).
ODETTE_SKRIPT = r"""
const fs = require("fs");
const path = require("path");
const [inkjs, datei, variablenJson] = process.argv.slice(1);
const { Compiler } = require(path.join(inkjs, "compiler", "Compiler"));
const { CompilerOptions } = require(path.join(inkjs, "compiler", "CompilerOptions"));
const { Story } = require(path.join(inkjs, "engine", "Story"));
const quelle = fs.readFileSync(datei, "utf8");
const json = new Compiler(quelle, new CompilerOptions(null, [], true)).Compile().ToJson();
const story = new Story(json);
for (const name of ["beginneAufgaben", "beginneSimultan", "zeigeVorfuehrung", "beginnePartie", "gibFund"])
  story.BindExternalFunction(name, () => null);
for (const [k, v] of Object.entries(JSON.parse(variablenJson))) story.variablesState.$(k, v);
story.ChoosePathString("odette");
let text = "";
while (story.canContinue) text += story.Continue();
console.log(text);
"""

# Jedes Stück jedes Sammelstrangs hat eine Fundstelle in orte.json (für sammeln in der Simulation).
FUNDORT_SKRIPT = r"""
const path = require("path");
const abenteuer = path.join(process.argv[1], "pipeline", "abenteuer");
const { ladeWelt } = require(path.join(abenteuer, "gesamtsimulation-regeln.cjs"));
const { fundort } = require(path.join(abenteuer, "gesamtsimulation-rueckkehr.cjs"));
const { straenge } = require(path.join(abenteuer, "gesamtsimulation-sammlung.cjs"));
const welt = ladeWelt();
const ohne = Object.values(straenge()).flat().filter((s) => !fundort(welt, s.knoten));
console.log(JSON.stringify(ohne.map((s) => s.knoten)));
"""


def _figurenfunde() -> list[str]:
    """Funde aller Knoten, die ``finchFiguren`` um eins erhöhen (der Sammelstrang der Finch-Jagd)."""
    funde = []
    for ink in sorted(DIALOGE.glob("*.ink")):
        for teil in re.split(r"^=== ", ink.read_text(encoding="utf-8"), flags=re.M)[1:]:
            if re.search(r"~\s*finchFiguren\s*=\s*finchFiguren\s*\+\s*1", teil):
                funde += re.findall(r'gibFund\("(finch\w+)"\)', teil)
    return funde


def _gross(wort: str) -> str:
    return wort[0].upper() + wort[1:]


def _odette(variablen: dict[str, object]) -> str:
    if shutil.which("node") is None or not INKJS.exists():
        pytest.skip("Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)")
    lauf = subprocess.run(
        ["node", "-e", ODETTE_SKRIPT, str(INKJS), str(ODETTE), json.dumps(variablen)],
        capture_output=True,
        text=True,
        timeout=ZEITGRENZE,
        check=True,
    )
    return lauf.stdout


def test_odette_kennt_jede_figur():
    funde = _figurenfunde()
    assert len(funde) == FIGUREN_ZAHL
    quelle = ODETTE.read_text(encoding="utf-8")
    for fund in funde:
        name = "gefunden" + _gross(fund)
        assert f"VAR {name} = false" in quelle, f"{name} fehlt in weg-ghost-capital.ink"
        assert f"eins({name})" in quelle, f"{name} fehlt in finchGefunden()"
        assert f"- not {name}:" in quelle, f"{name} fehlt in finchVersteck()"


def test_odette_zaehlt_funde_statt_zaehler():
    # Alle Funde da, der Zähler aber durch ein Neuladen eins zurück: Odette gibt trotzdem den König.
    alle = {"gefunden" + _gross(f): True for f in _figurenfunde()}
    text = _odette({**alle, "finchFiguren": FIGUREN_ZAHL - 1, "odetteGetroffen": True})
    assert "Alle fünfzehn" in text


def test_odette_nennt_fehlendes_versteck():
    alle = {"gefunden" + _gross(f): True for f in _figurenfunde()}
    text = _odette({**alle, "gefundenFinchTurmB": False, "odetteGetroffen": True})
    assert "14 von fünfzehn" in text
    assert "Hochebene" in text


def test_jedes_sammelstueck_hat_eine_fundstelle():
    if shutil.which("node") is None or not INKJS.exists():
        pytest.skip("Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)")
    lauf = subprocess.run(
        ["node", "-e", FUNDORT_SKRIPT, str(HAUPTORDNER)],
        capture_output=True,
        text=True,
        timeout=ZEITGRENZE,
        check=True,
    )
    assert json.loads(lauf.stdout) == []

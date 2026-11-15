"""Ambrose nennt den Helden erst im Archiv von Cedar Creek beim Namen (RO9 Nr. 4).

Warum: Im Roman (Kapitel 12, Erinnerung an New York 1858) sagt Ambrose im Archiv zum ersten Mal den
Namen; vorher heißt der Held bei ihm „Kind“ oder „Lehrling“ (Story-Bibel, Abschnitt 5.2, Regel
„Erst im Archiv der Name“). Der Knoten ``cedar-creek-archiv.name_im_archiv`` setzt dafür
``ambroseNenntNamen``; Ambrose-Zeilen in Akt 1, die auch nach dem Archiv laufen können, schreiben
``{ambroseNenntNamen:{held}|Lehrling}``.

Zwei Absicherungen:

1. Ohne Compiler: Jede Ambrose-Zeile mit ``{held}`` in den Dialogen der Orte vor dem Archiv steht im
   Knoten ``name_im_archiv`` oder hinter der Bedingung ``ambroseNenntNamen``.
2. Mit dem echten Ink-Compiler (inkjs wie die App): Jeder Knoten dieser Dialoge wird mit einem
   Testnamen und mehreren zufälligen Wahlfolgen gespielt; eine Ambrose-Zeile mit dem Namen ist nur
   erlaubt, wenn ``ambroseNenntNamen`` in diesem Moment wahr ist.
"""

import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest

HAUPTORDNER = Path(__file__).resolve().parents[2]
DIALOGE = HAUPTORDNER / "inhalte" / "abenteuer" / "dialoge" / "de"
ORTE = HAUPTORDNER / "inhalte" / "abenteuer" / "orte.json"
INKJS = HAUPTORDNER / "app" / "node_modules" / "inkjs"
ZEITGRENZE = 300
# Orte, die vor dem Archiv (Kapitel 12) erreichbar sind: Akt 1 bis Cedar Creek mit dem Weg dorthin
# und dem Nebenort Kürbishof an der Landstraße.
ORTE_VOR_DEM_ARCHIV = ("mapleFalls", "wegMapleCedar", "cedarCreek", "kuerbishof")
ARCHIV_KNOTEN = "name_im_archiv"
BEDINGUNG = "{ambroseNenntNamen:"
TESTNAME = "Quirinus"
# Zufällige Wahlfolgen je Knoten und höchstens so viele Zeilen je Lauf.
WAHLFOLGEN = 6
SCHRITTE = 400

SPIEL_SKRIPT = r"""
const fs = require("fs");
const path = require("path");
const [inkjs, dateienJson, name, folgen, schritte] = process.argv.slice(1);
const { Compiler } = require(path.join(inkjs, "compiler", "Compiler"));
const { CompilerOptions } = require(path.join(inkjs, "compiler", "CompilerOptions"));
const { Story } = require(path.join(inkjs, "engine", "Story"));
// Fester Zufall (Startwert je Lauf), damit ein Fund wiederholbar ist.
function zufall(start) {
  let s = start + 1;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}
const funde = [];
const fehler = [];
let laeufe = 0;
for (const datei of JSON.parse(dateienJson)) {
  const quelle = fs.readFileSync(datei, "utf8");
  const json = new Compiler(quelle, new CompilerOptions(null, [], true)).Compile().ToJson();
  const knoten = [...quelle.matchAll(/^===\s*(\w+)\s*===\s*$/gm)].map((t) => t[1]);
  const externe = [...quelle.matchAll(/^EXTERNAL\s+(\w+)/gm)].map((t) => t[1]);
  // Eine Datei ohne VAR held oder ambroseNenntNamen kennt den Namen nicht bzw. nennt ihn nie.
  const mitHeld = /^VAR held\b/m.test(quelle);
  const mitSchalter = /^VAR ambroseNenntNamen\b/m.test(quelle);
  for (const k of knoten) {
    for (let f = 0; f < Number(folgen); f++) {
      const story = new Story(json);
      for (const e of externe) story.BindExternalFunction(e, () => 0);
      if (mitHeld) story.variablesState.$("held", name);
      story.ChoosePathString(k);
      const wahl = zufall(f);
      laeufe++;
      try {
        for (let n = 0; n < Number(schritte); n++) {
          if (story.canContinue) {
            const zeile = story.Continue();
            const ambrose = story.currentTags.some((t) => t.replace(/\s/g, "") === "sprecher:ambrose");
            const erlaubt = mitSchalter && story.variablesState.$("ambroseNenntNamen");
            if (ambrose && zeile.includes(name) && !erlaubt)
              funde.push(`${path.basename(datei)} ${k}: ${zeile.trim()}`);
          } else if (story.currentChoices.length > 0) {
            story.ChooseChoiceIndex(Math.floor(wahl() * story.currentChoices.length));
          } else break;
        }
      } catch (e) {
        // Ein Tunnel (Knoten mit ->->) endet so, wenn man ihn direkt anspringt: kein Fehler.
        if (!String(e.message).includes("tunnel onwards"))
          fehler.push(`${path.basename(datei)} ${k}: ${e.message}`);
      }
    }
  }
}
console.log(JSON.stringify({ funde: [...new Set(funde)], fehler, laeufe }));
"""


def _dateien_vor_dem_archiv() -> list[Path]:
    """Die Ink-Dateien, die die Orte vor dem Archiv in orte.json als Dialog nennen."""
    orte = json.loads(ORTE.read_text(encoding="utf-8"))["orte"]
    namen: set[str] = set()
    for ort in orte:
        if ort["kennung"] in ORTE_VOR_DEM_ARCHIV:
            namen |= set(re.findall(r'"dialog": "([a-z0-9-]+)\.', json.dumps(ort)))
    return sorted(DIALOGE / f"{name}.ink" for name in namen)


def _ambrose_mit_namen(zeile: str) -> bool:
    """Ein Abschnitt der Zeile (getrennt durch | in Bedingungen) mit {held}, gesprochen von Ambrose."""
    return any("{held}" in teil and "#sprecher:ambrose" in teil for teil in zeile.split("|"))


def test_dateien_vor_dem_archiv_gefunden():
    namen = {d.name for d in _dateien_vor_dem_archiv()}
    assert {"maple-falls-dachboden.ink", "weg-maple-cedar.ink", "cedar-creek-archiv.ink"} <= namen


def test_ambrose_nennt_den_namen_nur_mit_bedingung():
    funde = []
    for datei in _dateien_vor_dem_archiv():
        knoten = ""
        for nummer, zeile in enumerate(datei.read_text(encoding="utf-8").split("\n"), 1):
            kopf = re.match(r"^===\s*(\w+)", zeile)
            knoten = kopf.group(1) if kopf else knoten
            if zeile.lstrip().startswith("//") or not _ambrose_mit_namen(zeile):
                continue
            if knoten != ARCHIV_KNOTEN and BEDINGUNG not in zeile:
                funde.append(f"{datei.name}:{nummer}: {zeile.strip()}")
    assert funde == [], "Ambrose nennt den Namen vor dem Archiv:\n" + "\n".join(funde)


def test_gespielte_pfade_vor_dem_archiv_ohne_namen():
    if shutil.which("node") is None or not INKJS.exists():
        pytest.skip("Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)")
    dateien = json.dumps([str(d) for d in _dateien_vor_dem_archiv()])
    lauf = subprocess.run(
        ["node", "-e", SPIEL_SKRIPT, str(INKJS), dateien, TESTNAME, str(WAHLFOLGEN), str(SCHRITTE)],
        capture_output=True,
        text=True,
        timeout=ZEITGRENZE,
        check=True,
    )
    ergebnis = json.loads(lauf.stdout)
    assert ergebnis["fehler"] == [], "Knoten brachen ab:\n" + "\n".join(ergebnis["fehler"])
    assert ergebnis["laeufe"] > 0
    assert ergebnis["funde"] == [], "Ambrose nennt den Namen vor dem Archiv:\n" + "\n".join(ergebnis["funde"])

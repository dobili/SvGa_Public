"""Das ganze Schach-Abenteuer muss vom Dachboden bis zum Abspann spielbar sein.

Warum: Sackgassen entstehen aus der Reihenfolge (etwa Mama vor Ambrose, Weggehen vor dem letzten
Gespräch), und die zeigt nur ein ganzer Durchlauf. Der Test ruft die Gesamtsimulation
``pipeline/abenteuer/gesamtsimulation.cjs`` mit Node auf; sie spielt wie die Oberwelt der App und
meldet hängende Quests, einen fehlenden Abspann und Figuren, die auf keiner Karte stehen.

Der Lauf dauert für einen Startwert etwa eine Minute; deshalb läuft der Test nur mit
``ABENTEUER_SIMULATION=1``, damit der gewöhnliche Testlauf schnell bleibt.
"""

import os
import re
import shutil
import subprocess
from pathlib import Path

import pytest

HAUPTORDNER = Path(__file__).resolve().parents[2]
SKRIPT = HAUPTORDNER / "pipeline" / "abenteuer" / "gesamtsimulation.cjs"
INKJS = HAUPTORDNER / "app" / "node_modules" / "inkjs"
STARTWERT = 1
ZEITBUDGET_SEKUNDEN = 240


def _lauf() -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["node", str(SKRIPT), "--startwert", str(STARTWERT), "--sekunden", str(ZEITBUDGET_SEKUNDEN)],
        cwd=HAUPTORDNER,
        capture_output=True,
        text=True,
        timeout=ZEITBUDGET_SEKUNDEN + 120,
        check=False,
    )


def _figuren_ohne_karte(ausgabe: str) -> set[str]:
    treffer = re.search(r"^Figuren ohne Karte: (.*)$", ausgabe, re.M)
    assert treffer, "Die Ausgabe nennt keine Zeile „Figuren ohne Karte“"
    text = treffer.group(1).strip()
    return set() if text == "keine" else {f.strip() for f in text.split(",")}


@pytest.fixture(scope="module")
def ausgabe() -> str:
    if os.environ.get("ABENTEUER_SIMULATION") != "1":
        pytest.skip("Gesamtsimulation dauert etwa eine Minute; mit ABENTEUER_SIMULATION=1 starten")
    if shutil.which("node") is None or not INKJS.exists():
        pytest.skip("Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)")
    lauf = _lauf()
    assert lauf.returncode == 0, f"Sackgasse oder fehlender Abspann:\n{lauf.stdout}\n{lauf.stderr}"
    return lauf.stdout


def test_abspann_und_alle_hauptquests(ausgabe: str):
    assert "Abspann: ja" in ausgabe
    assert "Hauptquest" not in ausgabe.split("Nie erreichte Knoten:")[0]


def test_jede_figur_steht_auf_einer_karte(ausgabe: str):
    ohne = _figuren_ohne_karte(ausgabe)
    assert not ohne, f"Figuren ohne Platz auf einer gezeichneten Karte: {sorted(ohne)}"

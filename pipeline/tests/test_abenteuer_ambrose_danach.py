"""Nach dem Abschied im Finale spricht Ambrose nicht mehr und sitzt an keinem Brett.

Warum: Entscheidung des Autors (Story-Bibel Abschnitt 33, Frage 5; ``ENTSCHEIDUNGEN.md``, Q21-5).
``pipeline/abenteuer/ambrose-danach.cjs`` spielt das Schach-Abenteuer bis nach dem Abschied, geht
die Welt danach noch einmal ab und meldet jede Zeile mit Sprecher Ambrose, jede Partie gegen ihn und
jeden seiner Partiemomente. Dieser Test verlangt „0 Funde“ für den gründlichen und den eiligen
Spieler; wer eine neue Ambrose-Zeile schreibt, hängt sie an ``{not abschiedGesehen: …}``.

Der Lauf dauert etwa zwei Minuten; deshalb läuft er wie die Gesamtsimulation und die Lesefassung nur
mit ``ABENTEUER_SIMULATION=1``. Die Bausteine ohne Durchlauf (Sprecher aus den Tags, was der
launische Spieler nie liegen lässt) werden immer geprüft.
"""

import os
import shutil
import subprocess
from pathlib import Path

import pytest

HAUPTORDNER = Path(__file__).resolve().parents[2]
ORDNER = HAUPTORDNER / "pipeline" / "abenteuer"
SKRIPT = ORDNER / "ambrose-danach.cjs"
BEOBACHTER = ORDNER / "ambrose-danach-beobachter.cjs"
LAUNISCH = ORDNER / "ambrose-danach-launisch.cjs"
REGELN = ORDNER / "gesamtsimulation-regeln.cjs"
INKJS = HAUPTORDNER / "app" / "node_modules" / "inkjs"
ZEITBUDGET_SEKUNDEN = 300
SPIELER = ("gruendlich", "eilig")
# Knoten der Hauptquests: Der launische Spieler darf sie nie liegen lassen.
HAUPTKNOTEN = (
    "maple-falls-dachboden.ambrose_erwacht",
    "capital-arena-aussen.abschied",
)
# Reine Kulisse ohne Folgen für die Hauptgeschichte: darf liegen bleiben.
NEBENKNOTEN = ("ansehen-cedar-creek.globus",)

ohne_node = pytest.mark.skipif(
    shutil.which("node") is None or not INKJS.exists(),
    reason="Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)",
)


def node(skript: str) -> str:
    """Führt ein kurzes Node-Skript im Hauptordner aus und gibt seine Ausgabe zurück."""
    lauf = subprocess.run(["node", "-e", skript], cwd=HAUPTORDNER, capture_output=True, text=True, check=True)
    return lauf.stdout.strip()


@pytest.fixture(scope="module")
def ausgabe() -> str:
    """Ein Lauf mit Startwert 1 für beide Spieler; gibt die Ausgabe des Werkzeugs zurück."""
    if os.environ.get("ABENTEUER_SIMULATION") != "1":
        pytest.skip("Der Lauf dauert etwa zwei Minuten; mit ABENTEUER_SIMULATION=1 starten")
    if shutil.which("node") is None or not INKJS.exists():
        pytest.skip("Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)")
    befehl = ["node", str(SKRIPT), "--startwert", "1", "--sekunden", str(ZEITBUDGET_SEKUNDEN)]
    lauf = subprocess.run(
        befehl,
        cwd=HAUPTORDNER,
        capture_output=True,
        text=True,
        timeout=len(SPIELER) * ZEITBUDGET_SEKUNDEN + 120,
    )
    assert lauf.returncode == 0, f"Ambrose spricht nach dem Abschied noch:\n{lauf.stdout}\n{lauf.stderr}"
    return lauf.stdout


def test_null_funde_nach_dem_abschied(ausgabe: str):
    assert ausgabe.strip().splitlines()[-1] == "0 Funde"


def test_beide_spieler_erreichen_den_abschied_und_gehen_die_welt_ab(ausgabe: str):
    """Jeder Spieler kommt bis zum Abschied; danach mehrere Durchgänge ohne Zeitnot."""
    for spieler in SPIELER:
        assert f"Spieler „{spieler}“: beim Abschied" in ausgabe
    assert "nicht erreicht" not in ausgabe
    assert "Zeitbudget erreicht" not in ausgabe
    assert ausgabe.count("Durchgänge") == len(SPIELER)


def test_der_eilige_spieler_laesst_abstecher_fuer_danach(ausgabe: str):
    """Pinewood Camp und Hochebene besucht er erst nach dem Abschied; betreten werden sie dann."""
    zeile = next(z for z in ausgabe.splitlines() if z.startswith("Spieler „eilig“"))
    assert "pinewoodCamp" in zeile and "hochebene" in zeile
    assert "auch danach nie betreten" not in ausgabe


@ohne_node
def test_sprecher_aus_den_tags():
    """Ambrose spricht nur mit dem Tag „sprecher:ambrose“; der Erzähler, der ihn nennt, zählt nicht."""
    skript = (
        f"const {{ sprecherAus }} = require({str(BEOBACHTER)!r});"
        "const a = [['sprecher:ambrose', 'stimmung:fern'], ['sprecher:erzaehler'], ['pause'], []];"
        "console.log(a.map((t) => String(sprecherAus(t))).join(','));"
    )
    assert node(skript) == "ambrose,erzaehler,null,null"


@ohne_node
def test_launischer_spieler_laesst_nichts_liegen_was_die_hauptgeschichte_braucht():
    skript = (
        f"const {{ ladeWelt }} = require({str(REGELN)!r});"
        f"const {{ gebrauchteKnoten }} = require({str(LAUNISCH)!r});"
        "const g = gebrauchteKnoten(ladeWelt());"
        f"console.log({list(HAUPTKNOTEN + NEBENKNOTEN)!r}.map((k) => g.has(k)).join(','));"
    )
    erwartet = ["true"] * len(HAUPTKNOTEN) + ["false"] * len(NEBENKNOTEN)
    assert node(skript) == ",".join(erwartet)

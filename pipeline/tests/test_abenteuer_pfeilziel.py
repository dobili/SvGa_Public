"""Der Hauptpfeil zeigt auf ein Ziel, das den Questschritt voranbringt, nicht auf eines, das weiterschickt.

Warum: Auftrag des Hauptchats (20.11.2026). In Desert Springs zeigte der Pfeil auf Mira, die nur
„Dot sagt, du sollst erst zu Mr. Okoro.“ sagte. Questschritte können seither ``umwege`` tragen
(Bedingung und Ziel); ``pipeline/abenteuer/pfeilziel.cjs`` spricht mit der Gesamtsimulation jedes
Pfeilziel einer Hauptquest an und meldet, wo das Gespräch nicht weiterbringt.

Der ganze Lauf dauert einige Minuten und läuft wie die Gesamtsimulation nur mit
``ABENTEUER_SIMULATION=1``, einmal ohne Uhr und einmal je Tagesphase (SIM_STUNDE,
gesamtsimulation-uhr.cjs: Tagesabläufe der Figuren, Regel 1). Die Wahl des Pfeilziels (Umweg vor
Ziel vor Gegner) wird immer geprüft.
"""

import json
import os
import shutil
import subprocess
from pathlib import Path

import pytest

HAUPTORDNER = Path(__file__).resolve().parents[2]
SKRIPT = HAUPTORDNER / "pipeline" / "abenteuer" / "pfeilziel.cjs"
INKJS = HAUPTORDNER / "app" / "node_modules" / "inkjs"
ZEITBUDGET_SEKUNDEN = 300

ohne_node = pytest.mark.skipif(
    shutil.which("node") is None or not INKJS.exists(),
    reason="Node oder app/node_modules/inkjs fehlt",
)


def auswertung(ausdruck: str):
    """Wertet einen Ausdruck mit dem Modul ``p`` (pfeilziel.cjs) in Node aus, Ergebnis als JSON."""
    skript = f"const p = require({json.dumps(str(SKRIPT))}); console.log(JSON.stringify({ausdruck}));"
    lauf = subprocess.run(["node", "-e", skript], cwd=HAUPTORDNER, capture_output=True, text=True, check=True)
    return json.loads(lauf.stdout)


@ohne_node
def test_umweg_vor_ziel_vor_gegner():
    daten = '{ begegnungen: [{ kennung: "o.kampf", gegner: "o.mira" }], runden: [] }'
    schritt = (
        '{ ereignis: { art: "partie", begegnung: "o.kampf" },'
        ' umwege: [{ wenn: "nicht briefGelesen", ziel: { karte: "o.laden", objekt: "okoro" } }] }'
    )
    assert auswertung(f"p.pfeilziel({schritt}, {{}}, {daten})") == {
        "karte": "o.laden",
        "objekt": "okoro",
        "umweg": "nicht briefGelesen",
    }
    assert auswertung(f"p.pfeilziel({schritt}, {{ briefGelesen: true }}, {daten})") == {"figur": "o.mira"}


@ohne_node
def test_loest_aus():
    partie = '{ art: "partie", begegnung: "o.kampf" }'
    assert auswertung(f'p.loestAus({{ partie: "o.kampf" }}, {partie})') is True
    assert auswertung(f"p.loestAus({{}}, {partie})") is False
    dialog = '{ art: "dialog", knoten: "d.ende" }'
    assert auswertung(f'p.loestAus({{ besucht: ["d.ende"] }}, {dialog})') is True
    # Ein Dialogschritt nach einer Partie: Das Gespräch startet sie, das bringt weiter.
    assert auswertung(f'p.loestAus({{ partie: "o.vorrunde" }}, {dialog})') is True


# Spieluhr und Tagesabläufe (22.11.2026): je Tagesphase ein Lauf mit fester Uhr (Morgen, Mittag,
# Abend, Nacht wie ZIELE in regeln/spieluhr.ts); ohne Wert der Lauf ohne Uhr wie bisher.
PHASEN = [None, "7", "12", "19", "22"]


@pytest.mark.parametrize("stunde", PHASEN)
def test_ganze_pruefung_ohne_funde(stunde):
    if os.environ.get("ABENTEUER_SIMULATION") != "1":
        pytest.skip("Der Lauf dauert einige Minuten; mit ABENTEUER_SIMULATION=1 starten")
    if shutil.which("node") is None or not INKJS.exists():
        pytest.skip("Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)")
    befehl = ["node", str(SKRIPT), "--sekunden", str(ZEITBUDGET_SEKUNDEN)]
    umgebung = {**os.environ, **({"SIM_STUNDE": stunde} if stunde else {})}
    lauf = subprocess.run(befehl, cwd=HAUPTORDNER, capture_output=True, text=True, env=umgebung)
    assert lauf.returncode == 0, lauf.stdout[-4000:]
    assert lauf.stdout.strip().endswith("0 Funde")

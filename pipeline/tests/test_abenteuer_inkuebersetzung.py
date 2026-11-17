"""Alle Ink-Dialoge müssen sich übersetzen lassen (pipeline/abenteuer/inkuebersetzung.cjs).

Warum: Am 17.11.2026 stand in ironwood-kantine.ink zweimal ``VAR kaufGesehen``. Die Komponententests
der App übersetzen die echten Dialoge nicht (nur kleine Beispiele im Test selbst) und blieben grün;
erst die Gesamtsimulation brach mit „Compilation failed“ ab, ohne Datei und Zeile. Dieser Test
übersetzt jede Datei unter inhalte/abenteuer/dialoge/de mit demselben Compiler und denselben
Optionen wie Paketbau und Gesamtsimulation (inkjs, alle Besuche gezählt) und läuft ohne
Umgebungsschalter in jedem ``python -m pytest pipeline/tests`` (etwa zwei Sekunden).

Übersprungen wird nur, wenn Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ ``npm ci``).
"""

import shutil
import subprocess
from pathlib import Path

import pytest

HAUPTORDNER = Path(__file__).resolve().parents[2]
SKRIPT = HAUPTORDNER / "pipeline" / "abenteuer" / "inkuebersetzung.cjs"
INKJS = HAUPTORDNER / "app" / "node_modules" / "inkjs"
ZEITGRENZE = 120

pytestmark = pytest.mark.skipif(
    shutil.which("node") is None or not INKJS.exists(),
    reason="Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)",
)

# Wie ironwood-kantine.ink am 17.11.2026: dieselbe Variable zweimal deklariert (Zeilen 1 und 3).
DOPPELTE_VAR = """VAR kaufGesehen = false
VAR muenzen = 0
VAR kaufGesehen = false
=== kantine ===
Guten Morgen.
-> END
"""

# Übersetzt sich, aber der Dialog läuft nach der Wahl ins Leere (Warnung „Apparent loose end“).
LOSES_ENDE = """=== kantine ===
Guten Morgen.
* [Kaffee]
    Bitte sehr.
"""

SAUBER = """VAR kaufGesehen = false
=== kantine ===
Guten Morgen.
-> END
"""


def _pruefe(*argumente: str) -> subprocess.CompletedProcess[str]:
    """Ruft das Skript auf; ohne Argumente prüft es die deutschen Dialoge des Spiels."""
    return subprocess.run(
        ["node", str(SKRIPT), *argumente],
        capture_output=True,
        text=True,
        timeout=ZEITGRENZE,
        check=False,
    )


def _pruefe_quelle(tmp_path: Path, quelle: str) -> subprocess.CompletedProcess[str]:
    (tmp_path / "probe.ink").write_text(quelle, encoding="utf-8")
    return _pruefe("--ordner", str(tmp_path))


def test_alle_dialoge_uebersetzen_sich_ohne_fehler_und_warnungen():
    lauf = _pruefe()
    bericht = "Ink-Übersetzung (node pipeline/abenteuer/inkuebersetzung.cjs):\n" + lauf.stdout + lauf.stderr
    assert lauf.returncode == 0, bericht
    schluss = lauf.stdout.strip().splitlines()[-1]
    assert schluss.endswith(", 0 Warnungen, 0 Fehler"), bericht
    assert int(schluss.split()[0]) > 0, bericht


def test_doppelte_var_wird_mit_datei_und_zeile_gemeldet(tmp_path):
    lauf = _pruefe_quelle(tmp_path, DOPPELTE_VAR)
    assert lauf.returncode == 1
    zeilen = lauf.stdout.strip().splitlines()
    assert zeilen[0].startswith("probe.ink:3: Fehler: "), lauf.stdout
    assert "'kaufGesehen' that was already declared" in zeilen[0]
    assert zeilen[-1] == "1 Dateien, 0 Warnungen, 1 Fehler"


def test_warnung_wird_gezaehlt_und_aendert_den_rueckgabewert_nicht(tmp_path):
    lauf = _pruefe_quelle(tmp_path, LOSES_ENDE)
    assert lauf.returncode == 0, lauf.stdout + lauf.stderr
    zeilen = lauf.stdout.strip().splitlines()
    assert zeilen[0].startswith("probe.ink:4: Warnung: "), lauf.stdout
    assert zeilen[-1] == "1 Dateien, 1 Warnungen, 0 Fehler"


def test_saubere_quelle_ohne_befund(tmp_path):
    lauf = _pruefe_quelle(tmp_path, SAUBER)
    assert lauf.returncode == 0
    assert lauf.stdout.strip() == "1 Dateien, 0 Warnungen, 0 Fehler"


def test_ordner_ohne_ink_ist_ein_fehler(tmp_path):
    lauf = _pruefe("--ordner", str(tmp_path))
    assert lauf.returncode == 1
    assert "keine .ink-Datei gefunden" in lauf.stdout

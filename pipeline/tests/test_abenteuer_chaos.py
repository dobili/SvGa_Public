"""Sackgassen durch fast zufälliges Spielen (Chaos-Prüfung der Gesamtsimulation), schnelle Fassung.

Warum: Wunsch des Autors (14.11.2026): „Es sollte nichts kaputt gehen, sodass man das Spiel nicht mehr
beenden kann“, auch wenn Spieler sich dämlich oder fast zufällig verhalten. Der Chaos-Spieler in
``pipeline/abenteuer/gesamtsimulation-chaos.cjs`` fasst Zufälliges an, bricht Dialoge ab (Taste
Zurück oder Neuladen), verliert Partien und fällt durch Runden; danach übernimmt der gründliche
Spieler. Dieser Test prüft nur Akt 1 (bis Riverton) mit wenigen festen Startwerten, damit er unter
einer Minute bleibt. Die Startwerte 2 und 7 fanden die ersten Sackgassen: Ambrose am Schreibtisch vor
dem Dachboden (Fassung der Karte) und Sams Aufgaben vor dem Coach (Quest „Das vierte Brett“ hing).

Der lange Lauf über das ganze Spiel (etwa 200 Startwerte, Stunden):
``node pipeline/abenteuer/gesamtsimulation.cjs --chaos --startwerte 1-200``.
"""

import shutil
import subprocess
from pathlib import Path

import pytest

HAUPTORDNER = Path(__file__).resolve().parents[2]
SKRIPT = HAUPTORDNER / "pipeline" / "abenteuer" / "gesamtsimulation.cjs"
INKJS = HAUPTORDNER / "app" / "node_modules" / "inkjs"
STARTWERTE = "1-8"
SCHRITTE = "100,250"
SEKUNDEN_JE_LAUF = 40
ZEITGRENZE = 120


def test_akt1_ohne_sackgasse_bei_chaos():
    if shutil.which("node") is None or not INKJS.exists():
        pytest.skip("Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)")
    lauf = subprocess.run(
        [
            "node",
            str(SKRIPT),
            "--chaos",
            "--schnell",
            "--startwerte",
            STARTWERTE,
            "--schritte",
            SCHRITTE,
            "--lauf-sekunden",
            str(SEKUNDEN_JE_LAUF),
        ],
        cwd=HAUPTORDNER,
        capture_output=True,
        text=True,
        timeout=ZEITGRENZE,
        check=False,
    )
    assert lauf.returncode == 0, f"Sackgasse nach Chaos in Akt 1:\n{lauf.stdout}\n{lauf.stderr}"

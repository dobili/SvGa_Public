"""Jede Partie, Runde, jedes Rätsel, Simultan und jede Gedächtnisstellung aus Ink bekommt eine Reaktion.

Warum: Wunsch des Autors nach dem ersten Anspielen (19.11.2026): „Wenn aus einem Dialog eine
Schachpartie oder ein Rätsel startet, soll es nach dem Ende auch eine Reaktion darauf geben.“ Die
App öffnet nach der Ergebniskarte den Dialog wieder, der die Folge gestartet hat (oder ``danach``
aus den Daten), ``pipeline/abenteuer/rueckmeldung.cjs`` prüft mit der Gesamtsimulation, dass diese
Rückmeldung eine Zeile zeigt und das Ergebnis aufgreift.

Der Lauf dauert einige Minuten; er läuft wie die Gesamtsimulation nur mit
``ABENTEUER_SIMULATION=1``. Die Auswertung (welche Rückmeldung gilt als Reaktion) wird immer
geprüft, an kleinen Beispielen ohne Durchlauf.
"""

import json
import os
import shutil
import subprocess
from pathlib import Path

import pytest

HAUPTORDNER = Path(__file__).resolve().parents[2]
SKRIPT = HAUPTORDNER / "pipeline" / "abenteuer" / "rueckmeldung.cjs"
INKJS = HAUPTORDNER / "app" / "node_modules" / "inkjs"
ZEITBUDGET_SEKUNDEN = 300

ohne_node = pytest.mark.skipif(shutil.which("node") is None, reason="Node fehlt")


def auswertung(ausdruck: str):
    """Wertet einen Ausdruck mit dem Modul ``r`` (rueckmeldung.cjs) in Node aus, Ergebnis als JSON."""
    skript = f"const r = require({json.dumps(str(SKRIPT))}); console.log(JSON.stringify({ausdruck}));"
    lauf = subprocess.run(["node", "-e", skript], cwd=HAUPTORDNER, capture_output=True, text=True, check=True)
    return json.loads(lauf.stdout)


@ohne_node
def test_ergebnisvariablen():
    assert auswertung('r.ergebnisvariablen("partie", "mapleFalls.ersteLektion")') == [
        "ausgangMapleFallsErsteLektion",
        "siegeMapleFallsErsteLektion",
        "zuegeMapleFallsErsteLektion",
    ]
    assert auswertung('r.ergebnisvariablen("runde", "cedarCreek.reiheDex")') == [
        "reiheDexBestanden",
        "cedarCreekReiheDexBestanden",
        "reiheDexPunkte",
    ]


@ohne_node
def test_weiterleitung_zaehlt_nur_mit_passender_bedingung():
    assert auswertung('r.passtZumAusgang("not reiheDexBestanden", ["reiheDexBestanden"], "nicht bestanden")')
    assert not auswertung('r.passtZumAusgang("not reiheDexBestanden", ["reiheDexBestanden"], "bestanden")')
    assert auswertung('r.passtZumAusgang(\'ausgangX == "niederlage"\', ["ausgangX"], "niederlage")')
    assert not auswertung('r.passtZumAusgang(\'ausgangX == "niederlage"\', ["ausgangX"], "sieg")')


@ohne_node
def test_alltag_nach_der_runde_ist_keine_reaktion():
    # Wie „dex“: Nach bestandener Runde führt der Einstieg nur in den Alltag.
    dex = "{\\n- not reiheDexBestanden: -> dex_reihe\\n- else: -> dex_alltag\\n}"
    v = '["reiheDexBestanden"]'
    assert not auswertung(f'r.reagiert("{dex}", "d", ["d.dex", "d.dex_alltag"], {v}, "bestanden")')
    assert auswertung(f'r.reagiert("{dex}", "d", ["d.dex", "d.dex_reihe"], {v}, "nicht bestanden")')
    # Wie „rosa“: Niederlage geprüft, sonst die Reaktion auf den Sieg.
    rosa = '{\\n- ausgangR == \\"niederlage\\": -> r_nach_niederlage\\n- else: -> r_nach_sieg\\n}'
    assert auswertung(f'r.reagiert("{rosa}", "d", ["d.rosa", "d.r_nach_sieg"], ["ausgangR"], "sieg")')


@ohne_node
def test_falscher_zweig_nach_dem_ausgang():
    # Wie Sol vor dem 19.11.2026: Remis landete in sol_nach_sieg.
    remis = '{ausgang:"remis", besucht:["s.sol","s.sol_nach_sieg"]}'
    assert auswertung(f"r.falscherZweig({remis})") == "s.sol_nach_sieg"
    sieg = '{ausgang:"sieg", besucht:["s.sol","s.sol_nach_sieg"]}'
    assert auswertung(f"r.falscherZweig({sieg})") is None
    # Ein Clubknoten, der das Remis selbst abfragt, ist richtig.
    club = '{ausgang:"remis", besucht:["g.mira","g.mira_nach_sieg"]}'
    knoten = '{"g.mira_nach_sieg": "{ausgangX == \\"remis\\": Remis.}"}'
    assert auswertung(f"r.falscherZweig({club}, {knoten})") is None


@ohne_node
def test_funde_aus_beispieldaten():
    starts = 'new Map([["runde|o.reiheA", new Set(["d"])], ["partie|o.b", new Set(["d"])]])'
    rueck = (
        '[{art:"runde",kennung:"o.reiheA",ausgang:"bestanden",knoten:"d.a",zeilen:1,besucht:["d.a"]},'
        '{art:"partie",kennung:"o.b",ausgang:"sieg",knoten:"d.b",zeilen:0,besucht:["d.b"]}]'
    )
    knoten = '{"d.a": "Gut gemacht.", "d.b": "{ausgangOB: x}"}'
    funde = auswertung(f"r.funde({starts}, {rueck}, {knoten}, {{}})")
    assert funde == [
        "partie o.b (sieg): Rückmeldung d.b ohne Zeile",
        "runde o.reiheA (bestanden): Rückmeldung d.a ohne Bezug auf das Ergebnis",
    ]
    # Mit `danach` der Runde gilt die Rückmeldung als Reaktion.
    funde = auswertung(f'r.funde({starts}, {rueck}, {knoten}, {{"o.reiheA": "d.a"}})')
    assert funde == ["partie o.b (sieg): Rückmeldung d.b ohne Zeile"]


def test_ganze_pruefung_ohne_funde():
    if os.environ.get("ABENTEUER_SIMULATION") != "1":
        pytest.skip("Der Lauf dauert einige Minuten; mit ABENTEUER_SIMULATION=1 starten")
    if shutil.which("node") is None or not INKJS.exists():
        pytest.skip("Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)")
    befehl = ["node", str(SKRIPT), "--startwerte", "1,2,3", "--sekunden", str(ZEITBUDGET_SEKUNDEN)]
    lauf = subprocess.run(befehl, cwd=HAUPTORDNER, capture_output=True, text=True)
    assert lauf.returncode == 0, lauf.stdout[-4000:]
    assert " 0 Funde" in lauf.stdout

"""Prüfungen rund um das Repository (R57, Punkte 2, 5, 6 und 7).

Was geprüft wird:
    - CI: letzter Lauf „Prüfen“ auf main grün; Läufe der letzten zwei Wochen, die erst beim
      Wiederholen grün wurden (wackelige Tests).
    - Abhängigkeiten: ``npm audit`` (bekannte Sicherheitslücken) und neue Hauptversionen der
      wichtigsten Pakete (React, Vite, chessops, Stockfish, vite-plugin-pwa, TypeScript).
    - Lichess: Ist die freie Eröffnungsliste (inhalte/lichess) noch gleich der Quelle?
    - Autor: offene Testpunkte und Rückfragen in docs/AUFGABEN_AUTOR.md (nur zur Kenntnis).
"""

from __future__ import annotations

import json
import os
import re
import subprocess
from collections.abc import Callable
from datetime import datetime, timedelta
from pathlib import Path

from .netz import Antwort, abrufen
from .punkte import Ampel, Pruefpunkt

REPO = "dobili/SvGa_Public"
WORKFLOW = "pruefen.yml"
ERFOLG = 200
WACKEL_ZEITRAUM = timedelta(days=14)
LICHESS_QUELLE = "https://raw.githubusercontent.com/lichess-org/chess-openings/master/{name}"
#: Pakete, deren neue Hauptversion der Autor wissen sollte.
BEOBACHTET = ["react", "vite", "chessops", "stockfish", "vite-plugin-pwa", "typescript", "wrangler"]
OFFENER_PUNKT = re.compile(r"^- \[ \] ([A-Z]{1,2}\d+)", re.MULTILINE)


def _github(pfad: str, abruf: Callable[..., Antwort]) -> Antwort:
    kopf = {"Accept": "application/vnd.github+json"}
    if token := os.environ.get("GITHUB_TOKEN"):
        kopf["Authorization"] = f"Bearer {token}"
    return abruf(f"https://api.github.com/repos/{REPO}/{pfad}", kopf=kopf)


def bewerte_laeufe(laeufe: list[dict[str, object]], jetzt: datetime) -> tuple[Ampel, str, list[str]]:
    """Ampel des neuesten abgeschlossenen Laufs und die wackeligen Läufe.

    ``laeufe`` wie die GitHub-API sie liefert (neuester zuerst).
    """
    fertig = [lauf for lauf in laeufe if lauf.get("status") == "completed"]
    if not fertig:
        return Ampel.GELB, "kein abgeschlossener Lauf", []
    neuester = fertig[0]
    ergebnis = str(neuester.get("conclusion"))
    ampel = Ampel.GRUEN if ergebnis == "success" else Ampel.ROT
    text = f"letzter Lauf #{neuester.get('run_number')}: {ergebnis}"
    wackelig = []
    for lauf in fertig:
        zeit = datetime.fromisoformat(str(lauf.get("created_at")).replace("Z", "+00:00"))
        versuch = lauf.get("run_attempt")
        if (
            jetzt - zeit <= WACKEL_ZEITRAUM
            and isinstance(versuch, int)
            and versuch > 1
            and lauf.get("conclusion") == "success"
        ):
            wackelig.append(f"#{lauf.get('run_number')} erst im {versuch}. Versuch grün")
    return ampel, text, wackelig


def pruefe_ci(jetzt: datetime, abruf: Callable[..., Antwort] = abrufen) -> list[Pruefpunkt]:
    antwort = _github(f"actions/workflows/{WORKFLOW}/runs?branch=main&per_page=30", abruf)
    if antwort.status != ERFOLG:
        return [
            Pruefpunkt(
                "ci", "CI", "Prüfen auf main", Ampel.GELB, f"GitHub-API: {antwort.status or antwort.fehler}"
            )
        ]
    laeufe = antwort.json().get("workflow_runs", [])  # type: ignore[union-attr]
    ampel, text, wackelig = bewerte_laeufe(laeufe, jetzt)
    return [
        Pruefpunkt("ci", "CI", "Prüfen auf main", ampel, text),
        Pruefpunkt(
            "ci-wackelig",
            "CI",
            "Wackelige Tests",
            Ampel.GELB if wackelig else Ampel.GRUEN,
            "\n".join(wackelig),
        ),
    ]


def bewerte_audit(bericht: dict[str, object]) -> tuple[Ampel, str]:
    """Ampel aus ``npm audit --json``: hoch oder kritisch → rot, mittel → gelb."""
    meta = bericht.get("metadata", {})
    zahlen = meta.get("vulnerabilities", {}) if isinstance(meta, dict) else {}
    hoch = int(zahlen.get("high", 0)) + int(zahlen.get("critical", 0))
    mittel = int(zahlen.get("moderate", 0))
    if hoch:
        return Ampel.ROT, f"{hoch} hohe oder kritische Lücken (npm audit)"
    if mittel:
        return Ampel.GELB, f"{mittel} mittlere Lücken (npm audit)"
    return Ampel.GRUEN, "keine bekannten Lücken"


def pruefe_audit(hauptordner: Path) -> Pruefpunkt:
    """``npm audit`` für die ausgelieferten Pakete (ohne Entwicklungswerkzeuge)."""
    try:
        lauf = subprocess.run(
            ["npm", "audit", "--json", "--omit=dev"],
            cwd=hauptordner / "app",
            capture_output=True,
            text=True,
            timeout=180,
            check=False,
        )
        ampel, text = bewerte_audit(json.loads(lauf.stdout or "{}"))
    except (OSError, subprocess.TimeoutExpired, json.JSONDecodeError) as fehler:
        ampel, text = Ampel.GELB, f"npm audit nicht ausführbar: {fehler}"
    return Pruefpunkt("audit", "Abhängigkeiten", "Sicherheitslücken", ampel, text)


def hauptversion(version: str) -> int:
    """``"^19.3.0"`` → 19."""
    treffer = re.search(r"\d+", version)
    return int(treffer.group(0)) if treffer else 0


def pruefe_hauptversionen(hauptordner: Path, abruf: Callable[..., Antwort] = abrufen) -> Pruefpunkt:
    paket = json.loads((hauptordner / "app/package.json").read_text(encoding="utf-8"))
    alle = {**paket.get("dependencies", {}), **paket.get("devDependencies", {})}
    neu = []
    for name in BEOBACHTET:
        if name not in alle:
            continue
        antwort = abruf(f"https://registry.npmjs.org/{name}/latest")
        if antwort.status != ERFOLG:
            continue
        neueste = str(antwort.json().get("version", ""))  # type: ignore[union-attr]
        if hauptversion(neueste) > hauptversion(alle[name]):
            neu.append(f"{name}: {alle[name]} → {neueste}")
    return Pruefpunkt(
        "hauptversionen",
        "Abhängigkeiten",
        "Neue Hauptversionen",
        Ampel.GELB if neu else Ampel.GRUEN,
        "\n".join(neu),
    )


def pruefe_lichess(hauptordner: Path, abruf: Callable[..., Antwort] = abrufen) -> Pruefpunkt:
    """Vergleicht inhalte/lichess/*.tsv mit der Quelle auf GitHub."""
    anders = []
    for datei in sorted((hauptordner / "inhalte/lichess").glob("*.tsv")):
        antwort = abruf(LICHESS_QUELLE.format(name=datei.name))
        if antwort.status != ERFOLG:
            anders.append(f"{datei.name}: Quelle {antwort.status or antwort.fehler}")
        elif antwort.text.strip() != datei.read_text(encoding="utf-8").strip():
            anders.append(f"{datei.name} geändert")
    text = "\n".join(anders)
    if anders:
        text += "\nNeu einlesen: python -m pipeline.eroeffnungsliste"
    return Pruefpunkt(
        "lichess-liste", "Lichess", "Eröffnungsliste", Ampel.GELB if anders else Ampel.GRUEN, text
    )


def pruefe_aufgaben(hauptordner: Path) -> Pruefpunkt:
    """Offene Punkte des Autors (nur zur Kenntnis)."""
    text = (hauptordner / "docs/AUFGABEN_AUTOR.md").read_text(encoding="utf-8")
    offen = OFFENER_PUNKT.findall(text)
    tests = [k for k in offen if k.startswith("N")]
    return Pruefpunkt(
        "aufgaben",
        "Autor",
        "Offene Punkte",
        Ampel.INFO,
        f"{len(tests)} Testpunkte, {len(offen) - len(tests)} weitere offene Punkte",
    )

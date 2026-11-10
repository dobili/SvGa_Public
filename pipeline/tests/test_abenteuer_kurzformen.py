"""Kurzformen der Dialogvariablen sind eindeutig (R42): ``<name>Bestanden`` und ``<name>Punkte``.

Warum: Die Hülle setzt nach einer Aufgabenrunde, einer Gedächtnisstellung oder einem Simultan die
Kurzform aus dem letzten Teil der Kennung (``portDelacroix.simultan`` → ``simultanBestanden``) und die
Langform mit Ort (``portDelacroixSimultanBestanden``; app/src/abenteuer/regeln/dialogvariablen.ts,
variablenNachRunde). Am Weltschachtag fragte ein Dialog ``simultanBestanden`` ab, das auch die Runde
in Port Delacroix setzt (Meldung mittel-1, 10.11.2026). Diese Prüfung meldet jeden Ink-Text, der eine
Kurzform liest, die mehr als eine Quelle setzen würde, und empfiehlt die Langform.
"""

import json
import re
from collections import defaultdict
from pathlib import Path

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
ENDUNGEN = ("Bestanden", "Punkte")


def _lade(name: str) -> dict:
    return json.loads((INHALTE / name).read_text(encoding="utf-8"))


def _gross(text: str) -> str:
    return text[:1].upper() + text[1:]


def _langform(kennung: str, endung: str) -> str:
    """„portDelacroix.simultan“ → „portDelacroixSimultanBestanden“ (wie variablenNachRunde)."""
    *ort, name = kennung.split(".")
    return f"{''.join(ort)}{_gross(name)}{endung}"


def quellen_der_kurzformen() -> dict[str, list[str]]:
    """Kurzname (letzter Teil) → Kennungen, die ihn setzen: Aufgabenrunden und Partieformen."""
    kennungen = [r["kennung"] for r in _lade("runden.json")["runden"]]
    formen = _lade("partieformen.json")
    kennungen += [g["kennung"] for g in formen["gedaechtnis"]] + [s["kennung"] for s in formen["simultan"]]
    quellen = defaultdict(list)
    for k in kennungen:
        quellen[k.split(".")[-1]].append(k)
    return quellen


def befunde_der_kurzformen(texte: dict[str, str], quellen: dict[str, list[str]]) -> list[str]:
    """Ink-Dateien (Name → Text), die eine mehrdeutige Kurzform lesen, mit Empfehlung."""
    befunde = []
    for kurz, kennungen in sorted(quellen.items()):
        if len(kennungen) < 2:
            continue
        for endung in ENDUNGEN:
            muster = re.compile(rf"\b{re.escape(kurz)}{endung}\b")
            for datei, text in sorted(texte.items()):
                if muster.search(text):
                    lang = " oder ".join(_langform(k, endung) for k in kennungen)
                    befunde.append(f"{datei}: {kurz}{endung} setzen {', '.join(kennungen)}; besser {lang}")
    return befunde


def test_kurzformen_sind_eindeutig():
    texte = {p.name: p.read_text(encoding="utf-8") for p in (INHALTE / "dialoge").rglob("*.ink")}
    befunde = befunde_der_kurzformen(texte, quellen_der_kurzformen())
    assert not befunde, "Mehrdeutige Kurzformen (R42), bitte die Langform lesen:\n" + "\n".join(befunde)


def test_befund_mit_langform():
    quellen = {"simultan": ["portDelacroix.simultan", "wegGhostCapital.simultan"], "tafel": ["x.tafel"]}
    texte = {"weltschachtag.ink": "{simultanBestanden: Gut.}", "x.ink": "{tafelBestanden: ok}"}
    befunde = befunde_der_kurzformen(texte, quellen)
    assert len(befunde) == 1
    assert "portDelacroixSimultanBestanden oder wegGhostCapitalSimultanBestanden" in befunde[0]

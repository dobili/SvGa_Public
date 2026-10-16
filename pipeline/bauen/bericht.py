"""Schreibt den Bericht eines Datenlaufs für den Autor.

Wozu diese Datei da ist:
    Schritt 9 „Bericht“ (Konzept Abschnitt 5). Der Autor soll ohne Programmkenntnisse
    sehen, was die Pipeline gefunden hat: nach Kapitel und Abbildung sortiert, mit
    Fundstelle im LaTeX. Der Bericht zitiert keine Buchtexte, nur Nummern und Befunde.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from pipeline.befunde import Befund, Schwere
from pipeline.zugfolgen.nachspielen import Statistik

_REIHENFOLGE = {Schwere.FEHLER: 0, Schwere.WARNUNG: 1, Schwere.HINWEIS: 2}
_SYMBOL = {Schwere.FEHLER: "Fehler", Schwere.WARNUNG: "Warnung", Schwere.HINWEIS: "Hinweis"}


def schreibe_bericht(
    befunde: list[Befund],
    kapiteldaten: list[dict[str, Any]],
    datum: str,
    ordner: Path,
    zugfolgen: dict[int, Statistik] | None = None,
) -> Path:
    """Schreibt ``datenlauf-<datum>.md`` und liefert den Pfad."""
    ordner.mkdir(parents=True, exist_ok=True)
    zeilen = [f"# Datenlauf vom {datum}", ""]
    zeilen += _uebersicht(befunde, kapiteldaten)
    if zugfolgen:
        zeilen += _zugfolgentabelle(zugfolgen)
    for daten in kapiteldaten:
        kapitel = daten["kapitel"]
        eigene = [b for b in befunde if _kapitel_von(b) == kapitel]
        zeilen += ["", f"## Kapitel {kapitel}: {daten['titel']}", ""]
        if not eigene:
            zeilen.append("Keine Befunde.")
            continue
        zeilen += ["| Schwere | Abbildung | Prüfung | Befund | Fundstelle |", "|---|---|---|---|---|"]
        ohne_zugfolge = [
            b.abbildung for b in eigene if b.kennung == "abbildung-ohne-zugfolge" and b.abbildung
        ]
        if ohne_zugfolge:
            # Eine Zeile statt einer je Abbildung: Lehrbilder ohne Zugfolge sind meist beabsichtigt.
            liste = ", ".join(ohne_zugfolge)
            zeilen.append(
                f"| Hinweis | – | abbildung-ohne-zugfolge | Keine Zugfolge führt zu Abb. {liste} | – |"
            )
            eigene = [b for b in eigene if b.kennung != "abbildung-ohne-zugfolge"]
        for befund in sorted(eigene, key=_sortierschluessel):
            zeilen.append(
                f"| {_SYMBOL[befund.schwere]} | {befund.abbildung or '–'} | {befund.kennung} "
                f"| {befund.text} | {befund.fundstelle} |"
            )
    ohne_kapitel = [b for b in befunde if _kapitel_von(b) is None]
    if ohne_kapitel:
        zeilen += ["", "## Allgemein", ""]
        zeilen += [f"- {_SYMBOL[b.schwere]}: {b.text} ({b.fundstelle})" for b in ohne_kapitel]
    pfad = ordner / f"datenlauf-{datum}.md"
    pfad.write_text("\n".join(zeilen) + "\n", encoding="utf-8")
    return pfad


def _uebersicht(befunde: list[Befund], kapiteldaten: list[dict[str, Any]]) -> list[str]:
    abbildungen = sum(len(d["abbildungen"]) for d in kapiteldaten)
    uebungen = sum(len(d.get("uebungen", [])) for d in kapiteldaten)
    bilanzen = sum(len(d.get("bilanzen", [])) for d in kapiteldaten)
    steckbriefe = sum(len(d.get("steckbriefe", [])) for d in kapiteldaten)
    anzahl = {schwere: sum(1 for b in befunde if b.schwere == schwere) for schwere in Schwere}
    return [
        f"- Kapitel: {', '.join(str(d['kapitel']) for d in kapiteldaten)}",
        f"- Abbildungen: {abbildungen}",
        f"- Übungen: {uebungen}, Steckbriefe: {steckbriefe}, "
        f"Bilanzen (Ziel, Faktoren, Skelett, Plan): {bilanzen}",
        f"- Fehler: {anzahl[Schwere.FEHLER]}, Warnungen: {anzahl[Schwere.WARNUNG]}, "
        f"Hinweise: {anzahl[Schwere.HINWEIS]}",
    ]


def _zugfolgentabelle(zugfolgen: dict[int, Statistik]) -> list[str]:
    """Je Kapitel: wie viele Zugfolgen nachgespielt, wie viele Abbildungen erreicht wurden."""
    zeilen = [
        "",
        "## Zugfolgen (AP 3): Entwürfe in `inhalte/de/zugfolgen/`",
        "",
        "| Kapitel | Zugfolgen | Beispiele | Züge | Abzweigungen | Abbildungen erreicht "
        "| ohne Zugfolge | nicht spielbar | ohne Anschluss |",
        "|---|---|---|---|---|---|---|---|---|",
    ]
    for kapitel, s in sorted(zugfolgen.items()):
        zeilen.append(
            f"| {kapitel} | {s.zugfolgen} | {s.beispiele} | {s.zuege} | {s.abzweigungen} "
            f"| {s.verknuepft} von {s.abbildungen} | {s.ohne_zugfolge} | {s.illegal} | {s.ohne_anschluss} |"
        )
    gesamt = Statistik()
    for s in zugfolgen.values():
        for feld in vars(gesamt):
            setattr(gesamt, feld, getattr(gesamt, feld) + getattr(s, feld))
    zeilen.append(
        f"| **alle** | {gesamt.zugfolgen} | {gesamt.beispiele} | {gesamt.zuege} | {gesamt.abzweigungen} "
        f"| {gesamt.verknuepft} von {gesamt.abbildungen} | {gesamt.ohne_zugfolge} | {gesamt.illegal} "
        f"| {gesamt.ohne_anschluss} |"
    )
    return zeilen


def _kapitel_von(befund: Befund) -> int | None:
    """Kapitel eines Befunds aus der Abbildungsnummer oder dem Dateinamen."""
    if befund.abbildung:
        return int(befund.abbildung.split(".")[0])
    if befund.fundstelle.startswith("kap"):
        return int(befund.fundstelle[3:5])
    if befund.fundstelle.startswith("Kapitel "):
        return int(befund.fundstelle.split()[1])
    return None


def _sortierschluessel(befund: Befund) -> tuple[int, tuple[int, int], str]:
    nummer = (0, 0)
    if befund.abbildung:
        kapitel, _, laufend = befund.abbildung.partition(".")
        nummer = (int(kapitel), int(laufend))
    return _REIHENFOLGE[befund.schwere], nummer, befund.kennung

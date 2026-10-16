"""Baut Übungen, Steckbriefe, Bilanzen und das Glossar im Format der Schemas.

Wozu diese Datei da ist:
    Schritt 8 „Bauen“ (Konzept Abschnitt 5) für alles außer den Abbildungen: Die Rohdaten aus
    ``lesen/uebungen.py``, ``lesen/bilanzen.py`` und ``lesen/glossar.py`` werden zu Textteilen
    gewandelt (mit aufgelösten Verweisen) und in die Form von ``schemas/uebung.schema.json``,
    ``bilanz.schema.json`` und ``glossar.schema.json`` gebracht.
"""

from __future__ import annotations

from dataclasses import asdict
from typing import Any

from pipeline.befunde import Befund
from pipeline.lesen.bilanzen import Rohbilanz, Rohtabelle, Rohzelle, lies_bilanzen
from pipeline.lesen.fallenchecks import Rohfallencheck, lies_fallenchecks
from pipeline.lesen.glossar import lies_glossar
from pipeline.lesen.quellen import Quelldatei
from pipeline.lesen.text import als_klartext, wandle_text
from pipeline.lesen.uebungen import lies_uebungen
from pipeline.lesen.verzeichnis import Verweisverzeichnis


class _Wandler:
    """Wandelt LaTeX in Textteile und sammelt die Befunde dabei."""

    def __init__(self, verzeichnis: Verweisverzeichnis) -> None:
        self.verzeichnis = verzeichnis
        self.befunde: list[Befund] = []

    def teile(self, latex: str, fundstelle: str) -> list[dict[str, str]]:
        umwandlung = wandle_text(latex, fundstelle, self.verzeichnis)
        self.befunde.extend(umwandlung.befunde)
        return [teil.als_daten() for teil in umwandlung.teile]

    def klartext(self, latex: str, fundstelle: str) -> str:
        umwandlung = wandle_text(latex, fundstelle, self.verzeichnis)
        self.befunde.extend(umwandlung.befunde)
        return als_klartext(umwandlung.teile)


def baue_kapitelinhalte(
    quelle: Quelldatei, verzeichnis: Verweisverzeichnis
) -> tuple[dict[str, Any], list[Befund]]:
    """Übungen, Steckbriefe und Bilanzen eines Kapitels.

    Ausgabe: die vier Listen für die Kapiteldatei (dazu die Fallenchecks) und alle Befunde.
    Beispiel: Kapitel 2 liefert sechs Übungen, 13 Steckbriefe und 17 Zielbilanzen.
    """
    wandler = _Wandler(verzeichnis)
    uebungsquelle = lies_uebungen(quelle, verzeichnis)
    bilanzquelle = lies_bilanzen(quelle)
    befunde = uebungsquelle.befunde + bilanzquelle.befunde
    uebungen = [
        {
            "id": u.label,
            "nummer": u.nummer,
            "kapitel": u.kapitel,
            "titel": wandler.klartext(u.titel, u.fundstelle) if u.titel else None,
            "abbildungen": u.abbildungen,
            "aufgabe": wandler.teile(u.aufgabe_latex, u.fundstelle),
            "loesung": wandler.teile(u.loesung_latex or "", u.fundstelle),
            "quelle": {"datei": u.datei, "zeile": u.zeile},
        }
        for u in uebungsquelle.uebungen
    ]
    steckbriefe = [
        {
            "name": wandler.klartext(s.name_latex, f"{s.datei}:{s.zeile}"),
            "abschnitt": s.abschnitt,
            "zeilen": [
                {
                    "frage": wandler.klartext(frage, f"{s.datei}:{s.zeile}"),
                    "antwort": wandler.teile(antwort, f"{s.datei}:{s.zeile}"),
                }
                for frage, antwort in s.zeilen
            ],
            "quelle": {"datei": s.datei, "zeile": s.zeile},
        }
        for s in bilanzquelle.steckbriefe
    ]
    bilanzen = [_bilanz(b, wandler) for b in bilanzquelle.bilanzen]
    fallenquelle = lies_fallenchecks(quelle)
    fallenchecks = [_fallencheck(f, wandler) for f in fallenquelle.fallenchecks]
    inhalte = {
        "uebungen": uebungen,
        "steckbriefe": steckbriefe,
        "bilanzen": bilanzen,
        "fallenchecks": fallenchecks,
    }
    return inhalte, befunde + fallenquelle.befunde + wandler.befunde


def _fallencheck(check: Rohfallencheck, wandler: _Wandler) -> dict[str, Any]:
    """Ein Fallencheck im Format von ``bilanz.schema.json#/$defs/fallencheck``."""
    stelle = f"{check.datei}:{check.zeile}"
    steller = check.fallensteller
    return {
        "name": wandler.klartext(check.name, stelle),
        "wer": wandler.teile(check.wer_latex, stelle),
        "stopp": check.stopp,
        "zeilen": [
            {
                "kennung": z.kennung,
                "titel": wandler.klartext(z.titel_latex, stelle),
                "text": wandler.teile(z.text_latex, stelle),
                "wertung": z.wertung,
            }
            for z in check.zeilen
        ],
        "rettung": wandler.teile(check.rettung_latex, stelle) if check.rettung_latex else None,
        "fallensteller": (
            {"wertung": steller[0], "text": wandler.teile(steller[1], stelle)} if steller else None
        ),
        "abschnitt": check.abschnitt,
        "quelle": {"datei": check.datei, "zeile": check.zeile},
    }


def _bilanz(bilanz: Rohbilanz, wandler: _Wandler) -> dict[str, Any]:
    stelle = f"{bilanz.datei}:{bilanz.zeile}"

    def zelle(z: Rohzelle) -> dict[str, Any]:
        return {"wertung": z.wertung, "text": wandler.teile(z.latex, stelle)}

    def block(b: str | Rohtabelle) -> dict[str, Any]:
        if isinstance(b, str):
            return {"art": "text", "text": wandler.teile(b, stelle)}
        zeilen = [
            {"name": wandler.klartext(z.name, stelle), "links": zelle(z.links), "rechts": zelle(z.rechts)}
            for z in b.zeilen
        ]
        return {
            "art": "tabelle",
            "spalten": [wandler.klartext(s, stelle) for s in b.spalten],
            "zeilen": zeilen,
        }

    return {
        "art": bilanz.art,
        "titel": wandler.teile(bilanz.titel_latex, stelle),
        "abschnitt": bilanz.abschnitt,
        "abbildung": bilanz.abbildung,
        "bloecke": [block(b) for b in bilanz.bloecke],
        "haltbarkeit": wandler.teile(bilanz.haltbarkeit_latex, stelle) if bilanz.haltbarkeit_latex else None,
        "urteil": wandler.teile(bilanz.urteil_latex, stelle) if bilanz.urteil_latex else None,
        "quelle": {"datei": bilanz.datei, "zeile": bilanz.zeile},
    }


def baue_glossar(quelle: Quelldatei, verzeichnis: Verweisverzeichnis) -> tuple[dict[str, Any], list[Befund]]:
    """Das Glossar im Format von ``schemas/glossar.schema.json``.

    Beispiel: „Abzugsangriff“ mit den Stellen „abzugsangriff-3“ (Abschnitt 3.6) und
    „abzugsangriff-7“ (Abschnitt 7.2) und dem Querverweis „Langschrittfigur“.
    """
    wandler = _Wandler(verzeichnis)
    glossarquelle = lies_glossar(quelle)
    eintraege = []
    for eintrag in glossarquelle.eintraege:
        stelle = f"{quelle.name}:{eintrag.zeile}"
        stellen = [
            {"anker": anker} | asdict(verzeichnis.anker[anker])
            for anker in eintrag.anker
            if anker in verzeichnis.anker
        ]
        eintraege.append(
            {
                "begriff": wandler.klartext(eintrag.begriff_latex, stelle),
                "text": wandler.teile(eintrag.text_latex, stelle),
                "stellen": stellen,
                "verweise": eintrag.verweise,
            }
        )
    return {"schemaVersion": 1, "eintraege": eintraege}, glossarquelle.befunde + wandler.befunde

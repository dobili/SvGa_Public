"""Prüfhilfe der Übersetzung: Deutsch und Englisch nebeneinander (nur lokal, buch/arbeit/).

Wozu diese Datei da ist:
    Die Tabellen in ``inhalte/en/a1/`` enthalten absichtlich keinen deutschen Text. Wer eine
    Übersetzung durchsieht (der Autor, ein Übersetzer), braucht beides nebeneinander. Diese Datei
    schreibt es als Markdown, Fundort für Fundort, Fehler und Warnungen zuerst.

Rolle im Gesamtbild: Teil der Übersetzungsschicht ``pipeline/uebersetzen``; die Ausgabe liegt
in ``buch/arbeit/uebersetzung/`` und kommt nie ins Repository (CLAUDE.md, Regel 2).
"""

from __future__ import annotations

from pipeline.uebersetzen.uebertragen import Bericht


def _zelle(text: str) -> str:
    return text.replace("|", "\\|").replace("\n", " ")


def pruefhilfe(bericht: Bericht) -> str:
    """Markdown mit Kopfzahlen, Fehlern, Warnungen und der Tabelle Ort | Deutsch | Englisch.

    Beispiel: „# kap01.json – 257 von 257 Stellen übersetzt“, dann je Stelle eine Zeile;
    Offenes und Abgelehntes steht als „**offen**“ in der Spalte Englisch.
    """
    zeilen = [f"# {bericht.datei} – {bericht.uebersetzt} von {bericht.gesamt} Stellen übersetzt", ""]
    for titel, meldungen in (("Fehler", bericht.fehler), ("Warnungen", bericht.warnungen)):
        if meldungen:
            zeilen += [f"## {titel}", "", *[f"- {m}" for m in meldungen], ""]
    zeilen += ["## Alle Stellen", "", "| Ort | Deutsch | Englisch |", "| --- | --- | --- |"]
    for ort, deutsch, englisch in bericht.zeilen:
        spalte_en = "**offen**" if englisch is None else _zelle(englisch)
        zeilen.append(f"| {_zelle(ort)} | {_zelle(deutsch)} | {spalte_en} |")
    return "\n".join(zeilen) + "\n"

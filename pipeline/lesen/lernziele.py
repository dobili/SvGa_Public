"""Lernziele je Kapitel: die Liste „Bevor du weiterliest, solltest du Folgendes können“.

Wozu diese Datei da ist:
    Fast jedes Kapitel endet vor den Übungen mit einem Satz wie „Bevor du mit Kapitel 2
    weiterliest, solltest du Folgendes sicher können:“ und einer Aufzählung; Kapitel 12 sagt
    „Bevor du das Buch zuklappst“. Die App macht daraus die Abhakliste der Gesamt-Checkliste
    (Wunsch des Autors nach dem Test von 0.2.0). Die Punkte kommen wörtlich aus dem Buch
    (Regel 1); die App formuliert nichts selbst.

Eingabe: die Kapiteldateien ``kapNN_*.tex``. Ausgabe: je Kapitel Einleitungssatz und Punkte für
``nachschlagen.json`` (Schema ``schemas/nachschlagen.schema.json``, Feld ``lernziele``) und Befunde.
"""

from __future__ import annotations

import re
from typing import Any

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.quellen import Quelldatei
from pipeline.lesen.text import als_klartext, wandle_text

# „solltest du Folgendes können:“ oder „… Folgendes sicher können:“, auch über Zeilen hinweg.
_ANKUENDIGUNG = re.compile(r"solltest\s+du\s+Folgendes\s+(?:sicher\s+)?können:")
# Der Einleitungssatz beginnt mit „Bevor du“ (Kapitel 0 bis 12).
_SATZANFANG = "Bevor du"
# Fließtext-Aufzählung (Kapitel 0): Punkte getrennt durch Komma oder „sowie“.
_TRENNER = re.compile(r",\s+|\s+sowie\s+")
# Satzende in der Fließtext-Aufzählung: Punkt vor Leerraum und Großbuchstaben.
_SATZENDE = re.compile(r"\.\s+(?=[A-ZÄÖÜ\\])")


def _klartext(latex: str, fundstelle: str, befunde: list[Befund]) -> str:
    """LaTeX eines Punktes als schlichter Text, ohne Satzzeichen am Ende („…;“ → „…“)."""
    umwandlung = wandle_text(latex, fundstelle)
    befunde.extend(umwandlung.befunde)
    return " ".join(als_klartext(umwandlung.teile).split()).rstrip(";.").strip()


def _punkte(rest: str) -> list[str]:
    """Die Punkte als LaTeX: aus ``itemize`` oder aus dem Rest des Satzes (Fließtext)."""
    rumpf = rest.lstrip()
    if rumpf.startswith("\\begin{itemize}"):
        inhalt = rumpf[len("\\begin{itemize}") : rumpf.index("\\end{itemize}")]
        return [punkt for punkt in inhalt.split("\\item") if punkt.strip()]
    satz = _SATZENDE.split(rumpf, maxsplit=1)[0]
    return [punkt for punkt in _TRENNER.split(satz) if punkt.strip()]


def lies_lernziele(quelle: Quelldatei, kapitel: int) -> tuple[dict[str, Any] | None, list[Befund]]:
    """Liest die Lernziele eines Kapitels.

    Warum: Diese Liste nennt das Buch selbst als Voraussetzung für das nächste Kapitel; sie ist
    der natürliche Inhalt einer Abhakliste.
    Eingabe: Kapiteldatei und Kapitelnummer. Ausgabe: ``{kapitel, einleitung, punkte}`` oder
    ``None`` mit einem Hinweis-Befund, wenn das Kapitel keine solche Liste hat.
    Beispiel aus dem Buch: Kapitel 1, „… solltest du Folgendes sicher können:“ → sechs Punkte,
    der erste „die drei Eröffnungsziele an einer Stellung prüfen“.
    Sonderfälle: Kapitel 0 zählt die Punkte im Fließtext auf („…, …, … sowie …“); gibt es die
    Ankündigung mehrmals, gilt die letzte (sie steht direkt vor den Übungen).
    """
    befunde: list[Befund] = []
    treffer = list(_ANKUENDIGUNG.finditer(quelle.text))
    if not treffer:
        meldung = "Keine Liste „solltest du Folgendes können“ gefunden; keine Lernziele"
        return None, [Befund(Schwere.HINWEIS, "lernziele", meldung, quelle.name)]
    ankuendigung = treffer[-1]
    anfang = quelle.text.rfind(_SATZANFANG, 0, ankuendigung.start())
    einleitung = _klartext(quelle.text[anfang : ankuendigung.end()], quelle.name, befunde)
    punkte = [_klartext(punkt, quelle.name, befunde) for punkt in _punkte(quelle.text[ankuendigung.end() :])]
    daten = {"kapitel": kapitel, "einleitung": einleitung, "punkte": punkte}
    return daten, befunde


def baue_lernziele(quellen: list[Quelldatei]) -> tuple[list[dict[str, Any]], list[Befund]]:
    """Lernziele aller Kapitel in Kapitelreihenfolge; Kapitel ohne Liste fehlen (mit Hinweis)."""
    lernziele: list[dict[str, Any]] = []
    befunde: list[Befund] = []
    for quelle in sorted(quellen, key=lambda q: q.name):
        if quelle.kapitel is None:
            continue
        daten, neue = lies_lernziele(quelle, quelle.kapitel)
        befunde.extend(neue)
        if daten:
            lernziele.append(daten)
    return lernziele, befunde

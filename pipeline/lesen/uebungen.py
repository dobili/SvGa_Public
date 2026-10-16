"""Liest die Übungen („Übung N“) und ihre Lösungen aus den Kapiteln.

Wozu diese Datei da ist:
    Jedes Kapitel endet mit einem Kasten „Übungen zu diesem Kapitel“: Umgebungen ``zugamzug`` mit
    einem ``\\label{ueb:…}``, einem Diagramm (meist ``\\diagrammbox``) und der Aufgabe. Die Lösungen
    stehen im Kasten ``loesungen`` als ``\\loesungeintrag{ueb:…}{Text}``. Die Nummer „Übung 12“
    zählt LaTeX buchweit durch (Zähler ``zugamzugz``, preamble.tex).

Rolle im Gesamtbild:
    Schritt 1 „Lesen“ (Konzept Abschnitt 5) für das Format „Übung“ (Konzept 4.3). Die Felder, die
    der Autor erst freigeben muss (Lösungszüge, akzeptierte Züge, knappe Erklärung, Motive), kommen
    später aus ``inhalte/de/``; hier steht nur, was im Buch steht.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.diagramme import DIAGRAMMBEFEHLE
from pipeline.lesen.latex import (
    LatexFehler,
    finde_befehle,
    lies_argumente,
    lies_optionales_argument,
    zeile_von,
)
from pipeline.lesen.quellen import Quelldatei
from pipeline.lesen.verzeichnis import Verweisverzeichnis

_UEBUNG = re.compile(r"\\begin\{zugamzug\}(?P<inhalt>.*?)\\end\{zugamzug\}", re.S)
_LOESUNGEN = re.compile(r"\\begin\{loesungen\}(?P<inhalt>.*?)\\end\{loesungen\}", re.S)


@dataclass
class Rohuebung:
    """Eine Übung, wie sie im LaTeX steht."""

    label: str
    nummer: int
    kapitel: int
    titel: str | None
    abbildungen: list[str]
    aufgabe_latex: str
    loesung_latex: str | None
    datei: str
    zeile: int
    verweise: list[str] = field(default_factory=list)  # \\abb{…} im Aufgabentext, etwa Abb. 4.18

    @property
    def fundstelle(self) -> str:
        return f"{self.datei}:{self.zeile}"


@dataclass
class Uebungsquelle:
    uebungen: list[Rohuebung] = field(default_factory=list)
    befunde: list[Befund] = field(default_factory=list)


def lies_uebungen(quelle: Quelldatei, verzeichnis: Verweisverzeichnis) -> Uebungsquelle:
    """Liest alle Übungen eines Kapitels mit ihren Lösungen.

    Beispiel: Kapitel 1 liefert Übung 4 bis 7, die erste mit Label „ueb:droh-ignorieren“,
    Abb. 1.40 und der Lösung „Die erste Frage der …“.
    Befunde: Übung ohne Label (Fehler), ohne Lösung oder Lösung ohne Übung (Warnung).
    """
    ergebnis = Uebungsquelle()
    loesungen = _lies_loesungen(quelle, ergebnis.befunde)
    for m in _UEBUNG.finditer(quelle.text):
        fundstelle = f"{quelle.name}:{zeile_von(quelle.text, m.start())}"
        titel, inhalt = _titel_und_inhalt(m.group("inhalt"))
        label = re.search(r"\\label\{(ueb:[^}]+)\}", inhalt)
        if not label:
            ergebnis.befunde.append(
                Befund(Schwere.FEHLER, "uebung-label", "Übung ohne \\label{ueb:…}", fundstelle)
            )
            continue
        name = label.group(1)
        if name not in loesungen:
            ergebnis.befunde.append(
                Befund(Schwere.WARNUNG, "uebung-loesung", f"{name} ohne Lösung", fundstelle)
            )
        # Reine Textübungen (Notation lesen, Trainingsplan) haben kein Diagramm; das ist kein Befund.
        abbildungen = [n.strip() for n in re.findall(r"\\abbziel\{([^}]*)\}", inhalt)]
        ergebnis.uebungen.append(
            Rohuebung(
                label=name,
                nummer=verzeichnis.uebungsnummern.get(name, 0),
                kapitel=quelle.kapitel or 0,
                titel=titel,
                abbildungen=abbildungen,
                aufgabe_latex=_ohne_diagramme(inhalt),
                loesung_latex=loesungen.pop(name, None),
                datei=quelle.name,
                zeile=zeile_von(quelle.text, m.start()),
                verweise=[n.strip() for n in re.findall(r"\\abb\{([^}]*)\}", inhalt)],
            )
        )
    for name in loesungen:
        ergebnis.befunde.append(
            Befund(Schwere.WARNUNG, "loesung-ohne-uebung", f"Lösung zu {name} ohne Übung", quelle.name)
        )
    return ergebnis


def _titel_und_inhalt(inhalt: str) -> tuple[str | None, str]:
    """Trennt den optionalen Titel ``\\begin{zugamzug}[Titel]`` vom Inhalt."""
    try:
        titel, ende = lies_optionales_argument(inhalt, 0)
    except LatexFehler:
        return None, inhalt
    return (titel.strip() if titel else None), inhalt[ende:]


def _lies_loesungen(quelle: Quelldatei, befunde: list[Befund]) -> dict[str, str]:
    """Alle ``\\loesungeintrag{label}{Text}`` eines Kapitels, nach Label."""
    loesungen: dict[str, str] = {}
    for kasten in _LOESUNGEN.finditer(quelle.text):
        text = kasten.group("inhalt")
        for treffer in finde_befehle(text, ["loesungeintrag"]):
            try:
                (label, inhalt), _ = lies_argumente(text, treffer.ende_name, 2)
            except LatexFehler as fehler:
                stelle = f"{quelle.name}:{zeile_von(quelle.text, kasten.start() + treffer.start)}"
                befunde.append(Befund(Schwere.FEHLER, "latex-klammer", f"\\loesungeintrag: {fehler}", stelle))
                continue
            loesungen[label.strip()] = inhalt
    return loesungen


def _ohne_diagramme(inhalt: str) -> str:
    """Der Aufgabentext ohne Diagrammbefehle, Label und Diagrammreihen-Rahmen."""
    stuecke: list[str] = []
    position = 0
    for treffer in finde_befehle(inhalt, list(DIAGRAMMBEFEHLE)):
        if treffer.start < position:
            continue
        stuecke.append(inhalt[position : treffer.start])
        position = _ende_des_diagramms(inhalt, treffer.name, treffer.ende_name)
    stuecke.append(inhalt[position:])
    text = "".join(stuecke)
    text = re.sub(r"\\label\{[^}]*\}", "", text)
    return re.sub(r"\\(begin|end)\{diagrammreihe\}(\[[^\]]*\])?", "", text)


def _ende_des_diagramms(inhalt: str, befehl: str, position: int) -> int:
    """Position hinter dem letzten Argument eines Diagrammbefehls."""
    mit_optional, anzahl = DIAGRAMMBEFEHLE[befehl]
    try:
        if mit_optional:
            _, position = lies_optionales_argument(inhalt, position)
        _, position = lies_argumente(inhalt, position, anzahl)
    except LatexFehler:
        return position
    return position


__all__ = ["Rohuebung", "Uebungsquelle", "lies_uebungen"]

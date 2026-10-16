"""Liest das Glossar (Anhang) mit Begriffen, Erklärungen, Stellen und Querverweisen.

Wozu diese Datei da ist:
    ``anhang_glossar.tex`` ist eine ``description``-Liste: ``\\item[Begriff] Erklärung (Kapitel~7,
    S.~\\glseite{abzug-7})``. Ein Pfeil ``$\\rightarrow$~Zugzwang`` verweist auf einen anderen
    Eintrag. Für die App (Bereich Nachschlagen, Konzept 4.4 „Glossareintrag“) werden daraus
    Begriff, Erklärung als Textteile, die Stellen im Buch und die Querverweise.

Pfeilverweise:
    Hinter dem Pfeil steht der Begriff im Fließtext, manchmal gebeugt. Gesucht wird der längste
    Eintrag, mit dem der Text dort beginnt (ohne Rücksicht auf Groß- und Kleinschreibung). Wird
    keiner gefunden, bleibt der Pfeil als Text stehen und es gibt einen Hinweis im Bericht.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.latex import LatexFehler, lies_gruppe, zeile_von
from pipeline.lesen.quellen import Quelldatei

_LISTE = re.compile(r"\\begin\{description\}(?P<inhalt>.*?)\\end\{description\}", re.S)
_PFEIL = re.compile(r"\$\\rightarrow\$(?:~|\s)*")


@dataclass
class Roheintrag:
    """Ein Glossareintrag, wie er im LaTeX steht (Pfeile schon als \\begriffsverweis)."""

    begriff_latex: str
    text_latex: str
    anker: list[str]
    verweise: list[str]
    zeile: int


@dataclass
class Glossarquelle:
    eintraege: list[Roheintrag] = field(default_factory=list)
    befunde: list[Befund] = field(default_factory=list)


def lies_glossar(quelle: Quelldatei) -> Glossarquelle:
    """Liest alle Einträge des Glossars.

    Beispiel: „Abzug“ → Text „→ Abzugsangriff.“ mit Querverweis auf „Abzugsangriff“;
    „Abzugsangriff“ → Stellen „abzugsangriff-3“ und „abzugsangriff-7“.
    """
    ergebnis = Glossarquelle()
    liste = _LISTE.search(quelle.text)
    if not liste:
        ergebnis.befunde.append(
            Befund(Schwere.FEHLER, "glossar", "Keine description-Liste gefunden", quelle.name)
        )
        return ergebnis
    roh = _zerlege(quelle, liste.start("inhalt"), liste.group("inhalt"), ergebnis.befunde)
    begriffe = [_klar(b) for b, _, _ in roh]
    for begriff, text, zeile in roh:
        text, verweise = _setze_begriffsverweise(text, begriffe, f"{quelle.name}:{zeile}", ergebnis.befunde)
        anker = re.findall(r"\\glseite\{([^}]+)\}", text)
        ergebnis.eintraege.append(Roheintrag(begriff, text, anker, verweise, zeile))
    return ergebnis


def _zerlege(
    quelle: Quelldatei, versatz: int, inhalt: str, befunde: list[Befund]
) -> list[tuple[str, str, int]]:
    """Zerlegt die Liste in (Begriff, Text, Zeile) je ``\\item[…]``."""
    starts = [m.start() for m in re.finditer(r"\\item\s*\[", inhalt)]
    eintraege = []
    for nummer, start in enumerate(starts):
        ende = starts[nummer + 1] if nummer + 1 < len(starts) else len(inhalt)
        zeile = zeile_von(quelle.text, versatz + start)
        try:
            begriff, nach = lies_gruppe(inhalt, inhalt.index("[", start), "[", "]")
        except LatexFehler as fehler:
            befunde.append(
                Befund(Schwere.FEHLER, "latex-klammer", f"\\item: {fehler}", f"{quelle.name}:{zeile}")
            )
            continue
        eintraege.append((begriff.strip(), inhalt[nach:ende].strip(), zeile))
    return eintraege


def _klar(latex: str) -> str:
    """Begriff als einfacher Text für den Vergleich („Aktiver Turm“)."""
    return " ".join(latex.replace("~", " ").replace("\\-", "").split())


def _setze_begriffsverweise(
    text: str, begriffe: list[str], fundstelle: str, befunde: list[Befund]
) -> tuple[str, list[str]]:
    """Ersetzt ``$\\rightarrow$~Begriff`` durch ``\\begriffsverweis{Begriff}{Anzeige}``."""
    # Suchnamen: der volle Begriff und der Begriff ohne Zusatz in Klammern („Bauernhebel (Hebel)“).
    namen = {b: b for b in begriffe} | {re.sub(r"\s*\(.*\)$", "", b): b for b in begriffe}
    nach_laenge = sorted(namen, key=len, reverse=True)
    verweise: list[str] = []
    teile: list[str] = []
    position = 0
    for pfeil in _PFEIL.finditer(text):
        teile.append(text[position : pfeil.start()])
        position = pfeil.end()
        danach = " ".join(text[position : position + 80].replace("~", " ").split())
        treffer = next((b for b in nach_laenge if danach.lower().startswith(b.lower())), None)
        if treffer is None:
            befunde.append(
                Befund(Schwere.HINWEIS, "glossar-pfeil", "Pfeil ohne passenden Eintrag", fundstelle)
            )
            teile.append("$\\rightarrow$ ")
            continue
        laenge = _quelllaenge(text, position, len(treffer))
        anzeige = " ".join(text[position : position + laenge].replace("~", " ").split())
        teile.append(f"→ \\begriffsverweis{{{namen[treffer]}}}{{{anzeige}}}")
        verweise.append(namen[treffer])
        position += laenge
    teile.append(text[position:])
    return "".join(teile), verweise


def _quelllaenge(text: str, start: int, zeichen: int) -> int:
    """Wie viele Quelltextzeichen ab ``start`` ``zeichen`` Zeichen des bereinigten Textes ergeben."""
    gezaehlt = 0
    index = start
    vorher_leer = False
    while index < len(text) and gezaehlt < zeichen:
        leer = text[index] in " \n\t~"
        if not (leer and vorher_leer):
            gezaehlt += 1
        vorher_leer = leer
        index += 1
    return index - start

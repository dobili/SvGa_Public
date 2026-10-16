"""Buchweite Prüfungen, übernommen aus ``werkzeuge/pruefe_buch.py`` der Buchquellen.

Wozu diese Datei da ist:
    Der Autor prüfte seine Quellen bisher mit ``pruefe_buch.py`` (Stand 12.10.2026). Dessen
    Prüfungen laufen jetzt bei jedem Datenlauf mit und landen im Bericht, statt als eigenes
    Skript. Was nur eine Abbildung betrifft (FEN, Zugseite, Matt), steht in
    ``pruefen/abbildungen.py``; hier steht alles, was das ganze Buch braucht:

    Nummern    ``\\abbziel`` je Kapitel lückenlos K.1 … K.n in Textreihenfolge, keine doppelt,
               jedes ``\\abb``/``\\abbnr`` hat ein Ziel (auch Fotos zählen als Ziel)
    Glossar    ``\\glanker`` eindeutig, jedes ``\\glseite`` hat einen ``\\glanker``,
               unbenutzte Anker als Hinweis
    Verweise   ``\\ref``, ``\\pageref``, ``\\hyperref``, ``\\drkap`` haben ein Label in den
               Kapiteln (Hinweis), jedes ``\\cite`` hat ein ``\\bibitem``
    Regel R10.4  „Kapitel~12“ steht in Kapitel 1–11 nur im Trainingskasten (Hinweis)
    Stil       „Stein“ statt „Figur“ (R7.8), gerade Anführungszeichen (R7.6), je als Hinweis

Schwere wie in ``pruefe_buch.py``: dort „FEHLER“ wird hier FEHLER, wenn die Daten der App
davon betroffen wären (Nummern, Glossar), sonst WARNUNG; dort „HINWEISE“ werden HINWEIS.
Der Bericht ist öffentlich (GPL-Repository): Befunde nennen Datei, Zeile und Schlüssel,
aber keine Sätze aus dem Buch.
"""

from __future__ import annotations

import re

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.latex import zeile_von
from pipeline.lesen.quellen import Quelldatei, lies_quellen

__all__ = ["Quelldatei", "lies_quellen", "pruefe_buch"]

_KAPITEL_MIT_TRAININGSKASTEN = range(1, 12)  # Regel R10.4 gilt für Kapitel 1 bis 11


def pruefe_buch(quellen: list[Quelldatei]) -> list[Befund]:
    """Führt alle buchweiten Prüfungen aus.

    Beispiel: Für die Buchquellen vom 13.10.2026 meldet sie keine Fehler; Hinweise betreffen
    etwa unbenutzte Glossaranker.
    """
    return (
        pruefe_abbildungsnummern(quellen)
        + pruefe_glossaranker(quellen)
        + pruefe_verweise(quellen)
        + pruefe_kapitel12_hinweise(quellen)
        + pruefe_stil(quellen)
    )


def _fundstelle(quelle: Quelldatei, position: int) -> str:
    return f"{quelle.name}:{zeile_von(quelle.text, position)}"


def pruefe_abbildungsnummern(quellen: list[Quelldatei]) -> list[Befund]:
    """Nummern je Kapitel lückenlos und in Reihenfolge, keine doppelt, jeder Verweis mit Ziel."""
    befunde: list[Befund] = []
    ziele: dict[str, str] = {}
    for quelle in quellen:
        treffer = list(re.finditer(r"\\abbziel\{(\d+)\.(\d+)\}", quelle.text))
        for m in treffer:
            nummer = f"{m.group(1)}.{m.group(2)}"
            if nummer in ziele:
                befunde.append(
                    Befund(
                        Schwere.FEHLER,
                        "abb-doppelt",
                        f"Abb. {nummer} doppelt (auch {ziele[nummer]})",
                        _fundstelle(quelle, m.start()),
                        nummer,
                    )
                )
            ziele.setdefault(nummer, _fundstelle(quelle, m.start()))
        befunde += _pruefe_reihenfolge(quelle, treffer)
    for quelle in quellen:
        for m in re.finditer(r"\\abb(?:nr)?\{([\d.]+)\}", quelle.text):
            if m.group(1) not in ziele:
                befunde.append(
                    Befund(
                        Schwere.WARNUNG,
                        "abb-verweis",
                        f"Verweis auf Abb. {m.group(1)} ohne Ziel",
                        _fundstelle(quelle, m.start()),
                    )
                )
    return befunde


def _pruefe_reihenfolge(quelle: Quelldatei, treffer: list[re.Match[str]]) -> list[Befund]:
    """Meldet die erste Stelle, an der die Nummern eines Kapitels nicht K.1, K.2, … lauten."""
    if quelle.kapitel is None:
        return []
    for laufend, m in enumerate(treffer, start=1):
        if (int(m.group(1)), int(m.group(2))) != (quelle.kapitel, laufend):
            nummer = f"{m.group(1)}.{m.group(2)}"
            erwartet = f"{quelle.kapitel}.{laufend}"
            text = f"Nummern nicht lückenlos: an {laufend}. Stelle steht Abb. {nummer}, erwartet {erwartet}"
            return [Befund(Schwere.FEHLER, "abb-reihenfolge", text, _fundstelle(quelle, m.start()), nummer)]
    return []


def pruefe_glossaranker(quellen: list[Quelldatei]) -> list[Befund]:
    """Jeder ``\\glseite`` braucht genau einen ``\\glanker`` (Regel aus pruefe_buch.py, Teil 3)."""
    befunde: list[Befund] = []
    anker: dict[str, str] = {}
    benutzt: set[str] = set()
    for quelle in quellen:
        for m in re.finditer(r"\\glanker\{([^}]+)\}", quelle.text):
            if m.group(1) in anker:
                befunde.append(
                    Befund(
                        Schwere.FEHLER,
                        "glanker-doppelt",
                        f"\\glanker{{{m.group(1)}}} mehrfach (auch {anker[m.group(1)]})",
                        _fundstelle(quelle, m.start()),
                    )
                )
            anker.setdefault(m.group(1), _fundstelle(quelle, m.start()))
    for quelle in quellen:
        for m in re.finditer(r"\\glseite\{([^}]+)\}", quelle.text):
            benutzt.add(m.group(1))
            if m.group(1) not in anker:
                befunde.append(
                    Befund(
                        Schwere.FEHLER,
                        "glseite-ohne-anker",
                        f"\\glseite{{{m.group(1)}}} ohne \\glanker",
                        _fundstelle(quelle, m.start()),
                    )
                )
    for name in sorted(set(anker) - benutzt):
        befunde.append(
            Befund(
                Schwere.HINWEIS,
                "glanker-unbenutzt",
                f"\\glanker{{{name}}} wird im Glossar nicht benutzt",
                anker[name],
            )
        )
    return befunde


def pruefe_verweise(quellen: list[Quelldatei]) -> list[Befund]:
    """``\\ref`` und Verwandte brauchen ein Label, ``\\cite`` ein ``\\bibitem`` (Teil 4)."""
    gesamt = "\n".join(q.text for q in quellen)
    labels = set(re.findall(r"\\label\{([^}]+)\}", gesamt))
    labels |= {"gl:" + a for a in re.findall(r"\\glanker\{([^}]+)\}", gesamt)}
    literatur = set(re.findall(r"\\bibitem(?:\[[^]]*\])?\{([^}]+)\}", gesamt))
    befunde: list[Befund] = []
    muster = r"\\(?:page)?ref\*?\{([^}]+)\}|\\hyperref\[([^]]+)\]|\\drkap\{([^}]+)\}"
    for quelle in quellen:
        for m in re.finditer(muster, quelle.text):
            ziel = next(g for g in m.groups() if g)
            if ziel not in labels:
                befunde.append(
                    Befund(
                        Schwere.HINWEIS,
                        "ref-ohne-label",
                        f"Verweis auf „{ziel}“ ohne Label in den Kapiteln",
                        _fundstelle(quelle, m.start()),
                    )
                )
        for m in re.finditer(r"\\cite\{([^}]+)\}", quelle.text):
            for schluessel in (s.strip() for s in m.group(1).split(",")):
                if literatur and schluessel not in literatur:
                    befunde.append(
                        Befund(
                            Schwere.WARNUNG,
                            "cite-ohne-bibitem",
                            f"\\cite{{{schluessel}}} ohne \\bibitem",
                            _fundstelle(quelle, m.start()),
                        )
                    )
    return befunde


def pruefe_kapitel12_hinweise(quellen: list[Quelldatei]) -> list[Befund]:
    """Regel R10.4: In Kapitel 1–11 verweist nur der Trainingskasten auf Kapitel 12."""
    befunde: list[Befund] = []
    for quelle in quellen:
        if quelle.kapitel not in _KAPITEL_MIT_TRAININGSKASTEN:
            continue
        kaesten = [
            (m.start(), m.end())
            for m in re.finditer(r"\\begin\{trainingskasten\}.*?\\end\{trainingskasten\}", quelle.text, re.S)
        ]
        for m in re.finditer(r"Kapitel~12", quelle.text):
            if not any(anfang <= m.start() < ende for anfang, ende in kaesten):
                befunde.append(
                    Befund(
                        Schwere.HINWEIS,
                        "r10-4-kapitel12",
                        "„Kapitel~12“ außerhalb des Trainingskastens (Regel R10.4)",
                        _fundstelle(quelle, m.start()),
                    )
                )
    return befunde


def pruefe_stil(quellen: list[Quelldatei]) -> list[Befund]:
    """Stilregeln R7.8 („Figur“ statt „Stein“) und R7.6 (keine geraden Anführungszeichen)."""
    befunde: list[Befund] = []
    for quelle in quellen:
        if quelle.name.startswith("anhang_kopiervorlage"):
            continue
        for m in re.finditer(r"\bSteine?n?\b", quelle.text):
            befunde.append(
                Befund(
                    Schwere.HINWEIS,
                    "r7-8-stein",
                    f"„{m.group(0)}“ (Figur statt Stein?, Regel R7.8)",
                    _fundstelle(quelle, m.start()),
                )
            )
        for m in re.finditer(r'(?<![\\=])"', quelle.text):
            befunde.append(
                Befund(
                    Schwere.HINWEIS,
                    "r7-6-anfuehrung",
                    "gerades Anführungszeichen (Regel R7.6)",
                    _fundstelle(quelle, m.start()),
                )
            )
    return befunde

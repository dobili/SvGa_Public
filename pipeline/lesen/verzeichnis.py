"""Verweisverzeichnis: wohin ``\\ref``, ``\\cite`` und ``\\glseite`` im Buch zeigen.

Wozu diese Datei da ist:
    In Übungen, Lösungen und im Glossar stehen Verweise wie „Abschnitt~\\ref{sec:k5-inaktion}“,
    „Übung~\\ref{ueb:notation-lesen-1}“, „\\cite{heisman}“ oder „S.~\\glseite{abzug-7}“. LaTeX setzt
    dafür Nummern und Seitenzahlen ein. Die App hat keine Seiten; sie braucht die Nummern und für
    Glossarstellen den Ort im Buch (Kapitel, Abschnitt, nächste Abbildung).

Wie LaTeX ein Label auflöst (nachgebildet):
    ``\\label`` merkt sich die Nummer des zuletzt hochgezählten Zählers: Kapitel (``\\chapter``),
    Abschnitt (``\\section``), Übung (Umgebung ``zugamzug``, buchweit durchgezählt) oder
    Tabelle (``\\caption`` in ``table``, je Kapitel als K.n). Literatur wird in der Reihenfolge der
    ``\\bibitem`` mit [1], [2] … nummeriert (``anhang_quellen.tex``).
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from pipeline.lesen.quellen import Quelldatei

# Ereignisse, die einen Zähler weiterstellen oder ein Label setzen, in Textreihenfolge.
_EREIGNIS = re.compile(
    r"\\(?P<befehl>chapter|section|label|caption|glanker|abbziel)(?P<stern>\*?)(?:\[[^\]]*\])?\{(?P<arg>[^}]*)\}"
    r"|\\begin\{(?P<umgebung>zugamzug|table|figure)\}"
)


@dataclass(frozen=True)
class Stelle:
    """Ort eines Glossarankers im Buch, für den Sprung aus dem Glossar in die App."""

    kapitel: int
    abschnitt: str | None  # „1.4“, oder None vor dem ersten gezählten Abschnitt
    abbildung: str | None  # nächste Abbildung ab der Stelle, sonst die vorige im Kapitel


@dataclass
class Verweisverzeichnis:
    """Alle Ziele von Verweisen eines Buches."""

    labels: dict[str, str] = field(default_factory=dict)
    literatur: dict[str, int] = field(default_factory=dict)
    anker: dict[str, Stelle] = field(default_factory=dict)
    uebungsnummern: dict[str, int] = field(default_factory=dict)

    def ziel(self, label: str) -> str | None:
        """Die Nummer, die LaTeX für ``\\ref{label}`` setzen würde, etwa „5.3“ oder „12“."""
        return self.labels.get(label)


@dataclass
class _Zaehler:
    kapitel: int = 0
    abschnitt: int = 0
    tabelle: int = 0
    uebung: int = 0
    zuletzt: str = ""
    in_tabelle: bool = False


def baue_verzeichnis(quellen: list[Quelldatei]) -> Verweisverzeichnis:
    """Baut das Verweisverzeichnis aus allen Quellen in Buchreihenfolge.

    Beispiel: ``ziel("sec:k5-inaktion")`` → „5.6“ (je nach Buchstand), ``literatur["heisman"]`` → 9,
    ``anker["abzug-7"]`` → Stelle(kapitel=7, abschnitt="7.2", abbildung="7.5").
    """
    verzeichnis = Verweisverzeichnis()
    zaehler = _Zaehler()
    for quelle in quellen:
        if quelle.kapitel is not None:
            zaehler.kapitel, zaehler.abschnitt, zaehler.tabelle = quelle.kapitel, 0, 0
            zaehler.zuletzt = str(quelle.kapitel)
        _lies_ereignisse(quelle, zaehler, verzeichnis)
    for nummer, schluessel in enumerate(_bibitems(quellen), start=1):
        verzeichnis.literatur[schluessel] = nummer
    return verzeichnis


def _lies_ereignisse(quelle: Quelldatei, zaehler: _Zaehler, verzeichnis: Verweisverzeichnis) -> None:
    """Geht Zähler, Labels und Anker einer Datei in Textreihenfolge durch."""
    offene_anker: list[str] = []
    letzte_abbildung: str | None = None
    for m in _EREIGNIS.finditer(quelle.text):
        befehl, argument = m.group("befehl"), m.group("arg")
        if m.group("umgebung") == "zugamzug":
            zaehler.uebung += 1
            zaehler.zuletzt = str(zaehler.uebung)
        elif m.group("umgebung") in ("table", "figure"):
            zaehler.in_tabelle = m.group("umgebung") == "table"
        elif befehl == "section" and not m.group("stern"):
            zaehler.abschnitt += 1
            zaehler.zuletzt = f"{zaehler.kapitel}.{zaehler.abschnitt}"
        elif befehl == "caption" and zaehler.in_tabelle:
            zaehler.tabelle += 1
            zaehler.zuletzt = f"{zaehler.kapitel}.{zaehler.tabelle}"
        elif befehl == "label":
            verzeichnis.labels[argument] = zaehler.zuletzt
            if argument.startswith("ueb:"):
                verzeichnis.uebungsnummern[argument] = zaehler.uebung
        elif befehl == "glanker" and quelle.kapitel is not None:
            abschnitt = f"{zaehler.kapitel}.{zaehler.abschnitt}" if zaehler.abschnitt else None
            verzeichnis.anker[argument] = Stelle(quelle.kapitel, abschnitt, letzte_abbildung)
            offene_anker.append(argument)
        elif befehl == "abbziel":
            # Anker vor dieser Abbildung im selben Abschnitt zeigen auf sie (die nächste ab der Stelle).
            for name in offene_anker:
                alt = verzeichnis.anker[name]
                if alt.abschnitt == (f"{zaehler.kapitel}.{zaehler.abschnitt}" if zaehler.abschnitt else None):
                    verzeichnis.anker[name] = Stelle(alt.kapitel, alt.abschnitt, argument.strip())
            offene_anker.clear()
            letzte_abbildung = argument.strip()


def _bibitems(quellen: list[Quelldatei]) -> list[str]:
    """Schlüssel aller ``\\bibitem`` in Buchreihenfolge."""
    return [s for q in quellen for s in re.findall(r"\\bibitem(?:\[[^\]]*\])?\{([^}]+)\}", q.text)]

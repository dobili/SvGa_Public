"""Zerlegt einen Trainingskasten oder den Abschnitt „Dein Werkzeugkasten“ in Blöcke.

Wozu diese Datei da ist:
    Die Website zeigt die Kästen als Absätze, Listen, Tabellen und Kleingedrucktes, in der
    Reihenfolge des Buches. Diese Datei findet die Grenzen im LaTeX (``\\medskip`` oder Leerzeile
    trennt Absätze; ``itemize``, ``table`` und ``{\\footnotesize …}`` sind eigene Blöcke) und lässt
    den Text jedes Blocks von ``pipeline/training.py`` umwandeln.

Beispiel (Kapitel 12, Werkzeugkasten): Einleitungsabsätze, dann die Tabelle mit den Spalten
„Wofür“, „Funktion und Menüweg“, „Passt zu“, dann die Adressen klein gedruckt, dann die Liste
„Wenn du mehr willst: kostenlos“.
"""

from __future__ import annotations

import re
from collections.abc import Callable

from pipeline.lesen.latex import lies_gruppe

Teile = list[dict[str, str]]
Umwandler = Callable[[str], Teile]

_SONDER = re.compile(r"\\begin\{(?P<umgebung>table|itemize)\}|\{\\footnotesize")
_ABSATZGRENZE = re.compile(r"\\medskip|\n[ \t]*\n")
# Satzanweisungen ohne Inhalt in Tabellen und Kästen.
_SATZ = re.compile(
    r"\\(centering|small|toprule|midrule|bottomrule|par)\b|\\setlength\{[^}]*\}\{[^}]*\}|\\label\{[^}]*\}"
)
_ZEILENENDE = re.compile(r"\\\\(?:\[[^\]]*\])?")


def bloecke_aus(latex: str, wandle: Umwandler) -> list[dict[str, object]]:
    """Blöcke in Buchreihenfolge.

    Eingabe: LaTeX des Kastens (ohne ``\\begin``/``\\end``), Umwandler für Text.
    Ausgabe: Liste von Blöcken ``absatz``, ``klein``, ``liste``, ``tabelle``.
    Beispiel: Trainingskasten Kapitel 0 → sechs Absätze und der klein gedruckte Verweis auf den
    Werkzeugkasten.
    """
    bloecke: list[dict[str, object]] = []
    stand = 0
    while True:
        treffer = _SONDER.search(latex, stand)
        ende = treffer.start() if treffer else len(latex)
        bloecke += _absaetze(latex[stand:ende], wandle)
        if not treffer:
            return bloecke
        block, stand = _sonderblock(latex, treffer, wandle)
        bloecke.append(block)


def _absaetze(latex: str, wandle: Umwandler) -> list[dict[str, object]]:
    """Gewöhnliche Absätze, getrennt durch ``\\medskip`` oder Leerzeile."""
    stuecke = (_SATZ.sub(" ", s).strip() for s in _ABSATZGRENZE.split(latex))
    return [{"art": "absatz", "teile": wandle(s)} for s in stuecke if s]


def _sonderblock(latex: str, treffer: re.Match[str], wandle: Umwandler) -> tuple[dict[str, object], int]:
    """Liste, Tabelle oder Kleingedrucktes ab ``treffer``; dazu die Position danach."""
    umgebung = treffer.group("umgebung")
    if umgebung is None:  # {\footnotesize …}
        inhalt, ende = lies_gruppe(latex, treffer.start())
        text = _SATZ.sub(" ", inhalt.replace("\\footnotesize", "", 1)).strip()
        return {"art": "klein", "teile": wandle(text)}, ende
    schluss = f"\\end{{{umgebung}}}"
    ende = latex.index(schluss, treffer.end())
    inhalt = latex[treffer.end() : ende]
    block = _liste(inhalt, wandle) if umgebung == "itemize" else _tabelle(inhalt, wandle)
    return block, ende + len(schluss)


def _liste(inhalt: str, wandle: Umwandler) -> dict[str, object]:
    """``itemize``: je ``\\item`` ein Punkt."""
    punkte = [p.strip() for p in inhalt.split("\\item")[1:]]
    return {"art": "liste", "punkte": [wandle(p) for p in punkte if p]}


def _tabelle(inhalt: str, wandle: Umwandler) -> dict[str, object]:
    """``table`` mit ``tabular``: Kopfzeile, Zeilen, Unterschrift (``\\caption``)."""
    unterschrift: Teile = []
    position = inhalt.find("\\caption")
    if position >= 0:
        text, _ = lies_gruppe(inhalt, position + len("\\caption"))
        unterschrift = wandle(text)
    start = inhalt.index("\\begin{tabular}")
    _, nach_spec = lies_gruppe(inhalt, inhalt.index("}", start) + 1)  # Spaltenangabe überspringen
    tabular = inhalt[nach_spec : inhalt.index("\\end{tabular}")]
    kopf_latex, _, rumpf = tabular.partition("\\midrule")
    zeilen = [z for z in (_SATZ.sub(" ", z).strip() for z in _ZEILENENDE.split(rumpf)) if z]
    return {
        "art": "tabelle",
        "kopf": _zellen(_ZEILENENDE.split(kopf_latex)[0], wandle),
        "zeilen": [_zellen(z, wandle) for z in zeilen],
        "unterschrift": unterschrift,
    }


def _zellen(zeile: str, wandle: Umwandler) -> list[Teile]:
    """Zellen einer Tabellenzeile, getrennt durch ``&`` (``\\&`` gehört zum Text)."""
    zellen = re.split(r"(?<!\\)&", _SATZ.sub(" ", zeile))
    return [wandle(z.strip()) for z in zellen]

"""Liest die Fallenchecks aus Kapitel 4 (Umgebung ``fallencheck``).

Wozu diese Datei da ist:
    Jede Falle in Kapitel 4 endet mit einem Fallencheck: wer hineintappt (mit dem Stopp-Moment
    als Abbildung), eine Tabelle mit Warnsignalen und Prüffragen (W1 bis W5, F1 bis F3, je mit
    ja, teils, nein oder entfällt), der rettende Zug und der Fallensteller-Test. Das Werkzeug
    k4-falle zeigt den Fallencheck des Buches an der Abbildung des Stopp-Moments (Pflichtenheft
    6.2: „Für die Fallen des Buches zusätzlich der Fallencheck aus dem Buch“).

Aufbau im LaTeX (preamble.tex):
    \\begin{fallencheck}{Name}
      \\checkwer{Text … Stopp-Moment: \\abb{4.2}.}
      \\begin{checktabelle} \\checkzeile{\\regelkz{W1} Titel}{Text}{\\checkja} … \\end{checktabelle}
      \\checkrettung{Text}
      \\checkfallensteller{\\checkja}{Text}
    \\end{fallencheck}
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.latex import LatexFehler, finde_befehle, lies_argumente, lies_gruppe, zeile_von
from pipeline.lesen.quellen import Quelldatei, abschnittsnummer
from pipeline.lesen.text import ZEICHEN

# Kennzeichen am Anfang einer Prüfzeile: \regelkz{W1} oder \regelkz{F2}.
_KENNZEICHEN = re.compile(r"\s*\\regelkz\{([^}]*)\}\s*")
# Der Stopp-Moment im Text „Wer tappt hinein?“.
_STOPP = re.compile(r"Stopp-Moment:?\s*\\abb\{([^}]*)\}")


@dataclass
class Rohpruefzeile:
    kennung: str | None  # „W1“, „F3“ …
    titel_latex: str
    text_latex: str
    wertung: str | None  # „ja“, „teils“, „nein“, „entfaellt“


@dataclass
class Rohfallencheck:
    name: str
    wer_latex: str
    stopp: str | None  # Abbildung des Stopp-Moments
    zeilen: list[Rohpruefzeile]
    rettung_latex: str | None
    fallensteller: tuple[str | None, str] | None  # (Wertung, Text)
    abschnitt: str | None
    datei: str
    zeile: int


@dataclass
class Fallenquelle:
    fallenchecks: list[Rohfallencheck] = field(default_factory=list)
    befunde: list[Befund] = field(default_factory=list)


def _wertung(latex: str) -> str | None:
    """Das Zustandszeichen einer Zelle (``\\checkja`` → „ja“)."""
    m = re.match(r"\s*\\([A-Za-z]+)", latex)
    return ZEICHEN[m.group(1)][0] if m and m.group(1) in ZEICHEN else None


def _argumente(text: str, befehl: str, anzahl: int) -> list[list[str]]:
    ergebnis = []
    for treffer in finde_befehle(text, [befehl]):
        argumente, _ = lies_argumente(text, treffer.ende_name, anzahl)
        ergebnis.append(argumente)
    return ergebnis


def _pruefzeile(titel: str, text: str, wertung: str) -> Rohpruefzeile:
    m = _KENNZEICHEN.match(titel)
    kennung = m.group(1).strip() if m else None
    rest = titel[m.end() :] if m else titel
    return Rohpruefzeile(kennung, rest.strip(), text.strip(), _wertung(wertung))


def _fallencheck(quelle: Quelldatei, start: int, name: str, inhalt: str) -> Rohfallencheck:
    wer = _argumente(inhalt, "checkwer", 1)
    rettung = _argumente(inhalt, "checkrettung", 1)
    steller = _argumente(inhalt, "checkfallensteller", 2)
    wer_latex = wer[0][0] if wer else ""
    stopp = _STOPP.search(wer_latex)
    return Rohfallencheck(
        name=name.strip(),
        wer_latex=wer_latex,
        stopp=stopp.group(1).strip() if stopp else None,
        zeilen=[_pruefzeile(*z) for z in _argumente(inhalt, "checkzeile", 3)],
        rettung_latex=rettung[0][0] if rettung else None,
        fallensteller=(_wertung(steller[0][0]), steller[0][1]) if steller else None,
        abschnitt=abschnittsnummer(quelle, start),
        datei=quelle.name,
        zeile=zeile_von(quelle.text, start),
    )


def lies_fallenchecks(quelle: Quelldatei) -> Fallenquelle:
    """Liest alle Fallenchecks einer Kapiteldatei.

    Beispiel: Kapitel 4 liefert 14 Fallenchecks, der erste ist die „Klammerfalle“ mit dem
    Stopp-Moment Abb. 4.2 und vier Prüfzeilen (W1, F1, F2, F3).
    """
    ergebnis = Fallenquelle()
    for m in re.finditer(r"\\begin\{fallencheck\}", quelle.text):
        try:
            name, nach_name = lies_gruppe(quelle.text, m.end())
        except LatexFehler as fehler:
            stelle = f"{quelle.name}:{zeile_von(quelle.text, m.start())}"
            ergebnis.befunde.append(Befund(Schwere.FEHLER, "latex-klammer", f"fallencheck: {fehler}", stelle))
            continue
        ende = quelle.text.find("\\end{fallencheck}", nach_name)
        ergebnis.fallenchecks.append(_fallencheck(quelle, m.start(), name, quelle.text[nach_name:ende]))
    return ergebnis

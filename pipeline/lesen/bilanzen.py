"""Liest Eröffnungssteckbriefe, Ziel-, Faktoren-, Skelett- und Planbilanzen.

Wozu diese Datei da ist:
    Kapitel 2 stellt jede Eröffnung mit einem Steckbrief vor (``eroeffnungssteckbrief``) und
    bewertet Stellungen in Zielbilanzen (Zentrum, Entwicklung, Königssicherheit je Seite mit ✓, ◐,
    ✗). Kapitel 3, 6 und 11 bewerten mit Faktorenbilanzen (Material, Zeit, Königssicherheit,
    Aktivität, mit Waage ⚖ und Zustandszeichen, dazu Haltbarkeit und Urteil). Kapitel 5 und 11
    lesen das Skelett mit Skelettbilanzen (eine Zeile je Leitfrage, darunter „Was folgt daraus?“),
    Kapitel 6 und 11 planen mit Planbilanzen (eine Zeile je Planfrage, darunter der Plan in einem
    Satz). Die App zeigt sie an (Konzept 4.4 „Eröffnung“), und die Werkzeuge der Kapitel 2, 3, 5
    und 6 werden an genau diesen Bilanzen kalibriert (Konzept 13: mindestens 90 Prozent).

Aufbau im LaTeX (preamble.tex):
    \\begin{eroeffnungssteckbrief}{Name} \\steckbriefzeile{Frage}{Antwort} … \\end{…}
    \\begin{zielbilanz}{Titel} \\begin{zieltabelle} \\zielzeile{Ziel}{Weiß}{Schwarz} … \\end{zieltabelle} Text
    \\begin{faktorenbilanz}{Titel} \\begin{faktortabelle}{Links}{Rechts} \\faktorzeile{F}{L}{R} …
        \\end{faktortabelle} \\faktorhaltbarkeit{…} \\faktorurteil{…} Text
    \\begin{skelettbilanz}[Stand]{Titel} \\begin{skeletttabelle} \\skelettzeile{Leitfrage}{Weiß}{Schwarz} …
        \\end{skeletttabelle} \\skelettfolgerung{…}
    \\begin{planbilanz}{Titel} \\begin{plantabelle} \\planzeile{Planfrage}{Weiß}{Schwarz} …
        \\end{plantabelle} \\planplan{…}
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.latex import LatexFehler, finde_befehle, lies_argumente, lies_gruppe, zeile_von
from pipeline.lesen.quellen import Quelldatei, abschnittsnummer
from pipeline.lesen.text import ZEICHEN

# Spaltenköpfe der Ziel-, Skelett- und Plantabellen sind fest (preamble.tex).
ZIELSPALTEN = ("Weiß", "Schwarz")

# Je Bilanzart: Umgebung, Tabellenumgebung, Zeilenbefehl und der Befehl für das Fazit darunter
# (Faktorenbilanz: ``faktorurteil``; Skelettbilanz: „Was folgt daraus?“; Planbilanz: „Plan in
# einem Satz“). Das Fazit landet immer im Feld ``urteil``.
BILANZARTEN = {
    "ziel": ("zielbilanz", "zieltabelle", "zielzeile", None),
    "faktor": ("faktorenbilanz", "faktortabelle", "faktorzeile", "faktorurteil"),
    "skelett": ("skelettbilanz", "skeletttabelle", "skelettzeile", "skelettfolgerung"),
    "plan": ("planbilanz", "plantabelle", "planzeile", "planplan"),
}


@dataclass
class Rohzelle:
    wertung: str | None  # „ja“, „teils“, „nein“, „vornlinks“ … aus dem Zeichen am Zellenanfang
    latex: str


@dataclass
class Rohzeile:
    name: str
    links: Rohzelle
    rechts: Rohzelle


@dataclass
class Rohtabelle:
    spalten: tuple[str, str]
    zeilen: list[Rohzeile]


@dataclass
class Rohbilanz:
    """Ziel- oder Faktorenbilanz. Der Inhalt ist eine Folge aus Text und Tabellen, wie im Buch
    (eine Zielbilanz kann mehrere Varianten mit je eigener Tabelle enthalten, Kapitel 2)."""

    art: str  # "ziel", "faktor", "skelett" oder "plan"
    titel_latex: str
    bloecke: list[str | Rohtabelle]
    haltbarkeit_latex: str | None
    urteil_latex: str | None
    abbildung: str | None  # letzte Abbildung vor der Bilanz
    abschnitt: str | None
    datei: str
    zeile: int


@dataclass
class Rohsteckbrief:
    name_latex: str
    zeilen: list[tuple[str, str]]
    abschnitt: str | None
    datei: str
    zeile: int


@dataclass
class Bilanzquelle:
    steckbriefe: list[Rohsteckbrief] = field(default_factory=list)
    bilanzen: list[Rohbilanz] = field(default_factory=list)
    befunde: list[Befund] = field(default_factory=list)


def lies_bilanzen(quelle: Quelldatei) -> Bilanzquelle:
    """Liest alle Steckbriefe und Bilanzen einer Kapiteldatei.

    Beispiel: Kapitel 2 liefert den Steckbrief „Spanische Partie“ (vier Zeilen) und die
    Zielbilanz „Spanische Partie: Hauptvariante nach 16... Ld7“ mit drei Zeilen, alle ✓.
    """
    ergebnis = Bilanzquelle()
    for start, titel, inhalt in _umgebungen(quelle, "eroeffnungssteckbrief", ergebnis.befunde):
        zeilen = _befehlsargumente(inhalt, "steckbriefzeile", 2)
        ergebnis.steckbriefe.append(
            Rohsteckbrief(
                titel,
                [(z[0], z[1]) for z in zeilen],
                abschnittsnummer(quelle, start),
                quelle.name,
                zeile_von(quelle.text, start),
            )
        )
    for art, (umgebung, _, _, _) in BILANZARTEN.items():
        for start, titel, inhalt in _umgebungen(quelle, umgebung, ergebnis.befunde):
            ergebnis.bilanzen.append(_bilanz(quelle, art, start, titel, inhalt))
    ergebnis.bilanzen.sort(key=lambda b: b.zeile)
    return ergebnis


def _umgebungen(quelle: Quelldatei, name: str, befunde: list[Befund]) -> list[tuple[int, str, str]]:
    """Findet ``\\begin{name}[…]{Titel} … \\end{name}`` und liefert (Position, Titel, Inhalt).

    Ein optionales Argument in eckigen Klammern (der Stand der Skelettbilanz, ``[3]``) wird
    übersprungen.
    """
    gefunden = []
    for m in re.finditer(r"\\begin\{" + name + r"\}(\[[^\]]*\])?", quelle.text):
        try:
            titel, nach_titel = lies_gruppe(quelle.text, m.end())
        except LatexFehler as fehler:
            stelle = f"{quelle.name}:{zeile_von(quelle.text, m.start())}"
            befunde.append(Befund(Schwere.FEHLER, "latex-klammer", f"{name}: {fehler}", stelle))
            continue
        ende = quelle.text.find("\\end{" + name + "}", nach_titel)
        gefunden.append((m.start(), titel, quelle.text[nach_titel:ende]))
    return gefunden


def _befehlsargumente(text: str, befehl: str, anzahl: int) -> list[list[str]]:
    """Die Argumente aller Vorkommen eines Befehls im Text."""
    ergebnis = []
    for treffer in finde_befehle(text, [befehl]):
        argumente, _ = lies_argumente(text, treffer.ende_name, anzahl)
        ergebnis.append(argumente)
    return ergebnis


def _bilanz(quelle: Quelldatei, art: str, start: int, titel: str, inhalt: str) -> Rohbilanz:
    """Zerlegt den Inhalt einer Bilanz in Text- und Tabellenblöcke, Haltbarkeit und Urteil."""
    _, tabelle, _, fazitbefehl = BILANZARTEN[art]
    haltbarkeit, inhalt = _nimm_befehl(inhalt, "faktorhaltbarkeit")
    urteil, inhalt = _nimm_befehl(inhalt, fazitbefehl) if fazitbefehl else (None, inhalt)
    bloecke: list[str | Rohtabelle] = []
    position = 0
    for m in re.finditer(r"\\begin\{" + tabelle + r"\}(.*?)\\end\{" + tabelle + r"\}", inhalt, re.S):
        bloecke.append(inhalt[position : m.start()])
        bloecke.append(_tabelle(art, m.group(1)))
        position = m.end()
    bloecke.append(inhalt[position:])
    return Rohbilanz(
        art=art,
        titel_latex=titel,
        bloecke=[b for b in bloecke if not isinstance(b, str) or b.strip()],
        haltbarkeit_latex=haltbarkeit,
        urteil_latex=urteil,
        abbildung=_abbildung_zur_bilanz(quelle.text[:start], titel),
        abschnitt=abschnittsnummer(quelle, start),
        datei=quelle.name,
        zeile=zeile_von(quelle.text, start),
    )


def _tabelle(art: str, inhalt: str) -> Rohtabelle:
    """Eine Ziel- oder Faktorentabelle; Faktorentabellen nennen ihre Spalten selbst."""
    spalten = ZIELSPALTEN
    if art == "faktor":
        (links, rechts), nach = lies_argumente(inhalt, 0, 2)
        spalten, inhalt = (links.strip(), rechts.strip()), inhalt[nach:]
    befehl = BILANZARTEN[art][2]
    zeilen = [
        Rohzeile(name.strip(), _zelle(links), _zelle(rechts))
        for name, links, rechts in _befehlsargumente(inhalt, befehl, 3)
    ]
    return Rohtabelle(spalten, zeilen)


def _zelle(latex: str) -> Rohzelle:
    """Trennt das Zustandszeichen am Zellenanfang (``\\zielja{}``, ``\\faktorvornlinks``) ab."""
    m = re.match(r"\s*\\([A-Za-z]+)(\{\})?\s*", latex)
    if m and m.group(1) in ZEICHEN:
        return Rohzelle(ZEICHEN[m.group(1)][0], latex[m.end() :].strip())
    return Rohzelle(None, latex.strip())


def _nimm_befehl(text: str, befehl: str) -> tuple[str | None, str]:
    """Liest das Argument eines Befehls und entfernt ihn aus dem Text."""
    treffer = finde_befehle(text, [befehl])
    if not treffer:
        return None, text
    argument, ende = lies_gruppe(text, treffer[0].ende_name)
    return argument, text[: treffer[0].start] + text[ende:]


# So viele Zeichen nach ``\abbziel{…}`` gelten als Anfang der Bildunterschrift.
UNTERSCHRIFT_ANFANG = 160


def _abbildung_zur_bilanz(text: str, titel: str) -> str | None:
    r"""Die Abbildung, deren Stellung die Bilanz bewertet.

    Nennt der Titel die Abbildung selbst (``Carlsbad-Struktur (\abb{5.32})``, die Skelett- und
    Planbilanzen), gilt sie. Nennt er einen Zug (``nach \zugfolge{6. Le2!}``), ist es die letzte
    Abbildung vor der Bilanz, deren Unterschrift mit diesem Zug beginnt („Nach 6. Le2!“). Sonst,
    oder wenn keine passt, die letzte Abbildung vor der Bilanz.
    Warum: Beim Stafford-Gambit (Kapitel 3) steht zwischen der Stellung nach 6. Le2! (Abb. 3.65)
    und der Bilanz noch Abb. 3.66 mit der Fortsetzung 6... Sg4 7. Lxg4 Dh4; die Bilanz gehört aber
    zu 3.65 (Material und Zeit stimmen nur dort, Kalibrierung von k3-faktorenbilanz).
    """
    genannt = re.search(r"\\abb(?:nr)?\{([^}]*)\}", titel)
    if genannt:
        return genannt.group(1).strip()
    treffer = list(re.finditer(r"\\abbziel\{([^}]*)\}", text))
    if not treffer:
        return None
    zug = re.search(r"\\zugfolge\{([^}]*)\}", titel)
    if zug:
        gesucht = zug.group(1).strip()
        for m in reversed(treffer):
            anfang = text[m.end() : m.end() + UNTERSCHRIFT_ANFANG]
            if re.match(r"\s*:\s*Nach\s+" + re.escape(gesucht) + r"(?![\w])", anfang):
                return m.group(1).strip()
    return treffer[-1].group(1).strip()

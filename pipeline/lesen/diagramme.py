"""Findet alle Diagramme eines Kapitels mit Stellung, Markierungen und Unterschrift.

Wozu diese Datei da ist:
    Jede Abbildung des Buches entsteht aus einem der Diagrammbefehle der Preamble.
    Diese Datei findet sie, liest ihre Argumente und merkt sich den Zusammenhang:
    in welchem Abschnitt, in welchem Kasten und in welcher Diagrammreihe sie stehen.

Die Befehle (preamble.tex und preamble_zusatz.tex, Stand 05.10.2026):

    \\grossdiagrammtaktik[Unterschrift]{FEN}{Pfeile}{Felder}
    \\diagrammschritttaktik{FEN}{Pfeile}{Felder}{Unterschrift}
    \\diagrammschritt{FEN}{Unterschrift}
    \\diagramm[Unterschrift]{FEN}
    \\diagrammbox[Unterschrift]{FEN}
    \\diagrammpfeile[Unterschrift]{FEN}{Züge}          (einfarbige Pfeile)
    \\diagrammfotopaar{FEN}{Bild}{Unterschrift Brett}{Unterschrift Foto}

    Pfeile:  gold/e2-e4,rot/a8-h1      Felder:  gold/e4,grau/d4

Rolle im Gesamtbild:
    Schritt 1 „Lesen“ (Konzept Abschnitt 5). Das Ergebnis sind Rohdiagramme, die
    ``pipeline.bauen`` zu Abbildungen nach ``schemas/abbildung.schema.json`` macht.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.latex import (
    LatexFehler,
    entferne_kommentare,
    finde_befehle,
    lies_argumente,
    lies_gruppe,
    lies_optionales_argument,
    zeile_von,
)

# Befehl → (hat optionale Unterschrift vorn, Zahl der Pflichtargumente)
DIAGRAMMBEFEHLE = {
    "grossdiagrammtaktik": (True, 3),
    "diagrammschritttaktik": (False, 4),
    "diagrammschritt": (False, 2),
    "diagramm": (True, 1),
    "diagrammbox": (True, 1),
    "diagrammpfeile": (True, 2),
    "diagrammfotopaar": (False, 4),
}

# Umgebung im Buch → Art der Abbildung (Konzept Abschnitt 4.1, Feld „art“).
# Die innerste passende Umgebung entscheidet.
ART_JE_UMGEBUNG = {
    "uebungenkasten": "uebung",
    "zugamzug": "uebung",
    "loesungen": "loesung",
    "trainingskasten": "trainingskasten",
    "vorsichtfalle": "vorsicht",
    "schachtipp": "tipp",
    "merksatz": "merksatz",
}

FARBEN = ("gold", "rot", "grau")
_FELD = re.compile(r"^[a-h][1-8]$")
_ABBZIEL = re.compile(r"\\abbziel\{([^}]*)\}\s*:?\s*")


@dataclass(frozen=True)
class Pfeil:
    farbe: str
    von: str
    nach: str


@dataclass(frozen=True)
class Feldmarke:
    farbe: str
    feld: str


@dataclass(frozen=True)
class Abschnitt:
    nummer: str  # zum Beispiel "1.4"
    label: str  # zum Beispiel "sec:k1-roentgen"
    titel: str


@dataclass
class Rohdiagramm:
    """Ein Diagramm, wie es im LaTeX steht, noch ohne Prüfung."""

    befehl: str
    nummer: str | None  # Abbildungsnummer aus \abbziel, etwa "1.26"
    fen: str
    pfeile: list[Pfeil]
    felder: list[Feldmarke]
    unterschrift_latex: str
    datei: str
    zeile: int
    art: str
    abschnitt: Abschnitt | None
    unterabschnitt: str | None
    reihe: int | None  # laufende Nummer der umgebenden diagrammreihe
    befunde: list[Befund] = field(default_factory=list)

    @property
    def fundstelle(self) -> str:
        return f"{self.datei}:{self.zeile}"


@dataclass
class Kapitelquelle:
    """Alles, was aus einer Kapiteldatei gelesen wurde."""

    nummer: int
    titel: str
    datei: str
    abschnitte: list[Abschnitt]
    diagramme: list[Rohdiagramm]
    befunde: list[Befund]


def lies_kapitel(pfad: Path) -> Kapitelquelle:
    """Liest eine Kapiteldatei und findet Kapitelnummer, Abschnitte und Diagramme.

    Beispiel: ``lies_kapitel(Path("buch/a1/chapters/kap01_grundprinzipien.tex"))``
    liefert Kapitel 1 „Grundprinzipien des Schachs“ mit Abb. 1.1 bis 1.43.
    """
    quelltext = entferne_kommentare(pfad.read_text(encoding="utf-8"))
    datei = pfad.name
    befunde: list[Befund] = []
    nummer, titel = _kapitelkopf(quelltext, datei, befunde)
    ereignisse = _strukturereignisse(quelltext, nummer)
    abschnitte = [e.abschnitt for e in ereignisse if e.abschnitt is not None]
    diagramme = []
    for treffer in finde_befehle(quelltext, list(DIAGRAMMBEFEHLE)):
        zustand = _zustand_bei(ereignisse, treffer.start)
        diagramm = _lies_diagramm(quelltext, treffer.name, treffer.ende_name, datei, zustand)
        diagramm.zeile = zeile_von(quelltext, treffer.start)
        diagramme.append(diagramm)
    return Kapitelquelle(nummer, titel, datei, abschnitte, diagramme, befunde)


def _kapitelkopf(quelltext: str, datei: str, befunde: list[Befund]) -> tuple[int, str]:
    """Kapitelnummer und Titel aus \\kapitelauftakt{N}{Titel}.

    Kapitel 0 („Dein Einstieg ins Schachbuch“) hat keinen Kapitelauftakt, sondern
    \\chapter*{Titel}; die Nummer kommt dann aus dem Dateinamen (kap00_…).
    """
    treffer = re.search(r"\\kapitelauftakt\{(\d+)\}\{([^}]*)\}", quelltext)
    if treffer:
        return int(treffer.group(1)), treffer.group(2).strip()
    zahl = re.search(r"kap(\d+)", datei)
    ohne_nummer = re.search(r"\\chapter\*\{([^}]*)\}", quelltext)
    if zahl and ohne_nummer:
        return int(zahl.group(1)), _rein(ohne_nummer.group(1))
    befunde.append(Befund(Schwere.WARNUNG, "kapitelkopf", "Kein \\kapitelauftakt gefunden", f"{datei}:1"))
    return (int(zahl.group(1)) if zahl else 0), ""


@dataclass
class _Ereignis:
    position: int
    art: str  # "begin", "end", "section", "subsection"
    name: str = ""
    abschnitt: Abschnitt | None = None


@dataclass
class _Zustand:
    umgebungen: list[str]
    abschnitt: Abschnitt | None
    unterabschnitt: str | None
    reihe: int | None


def _strukturereignisse(quelltext: str, kapitel: int) -> list[_Ereignis]:
    """Sammelt \\begin, \\end, \\section und \\subsection in Textreihenfolge."""
    ereignisse: list[_Ereignis] = []
    for m in re.finditer(r"\\(begin|end)\{([A-Za-z*]+)\}", quelltext):
        ereignisse.append(_Ereignis(m.start(), m.group(1), m.group(2)))
    zaehler = 0
    # Mit Kurztitel für Kopfzeile und Verzeichnis: \section[kurz]{lang} (Kapitel 2, 4, 5, 6 …).
    for m in re.finditer(r"\\section(\*?)(?:\[[^\]]*\])?\{", quelltext):
        titel, ende = lies_gruppe(quelltext, m.end() - 1)
        label = re.match(r"\s*\\label\{([^}]*)\}", quelltext[ende:])
        if m.group(1) == "*":
            continue  # ungezählte Abschnitte gibt es im Buch nicht; sicherheitshalber übergehen
        zaehler += 1
        abschnitt = Abschnitt(f"{kapitel}.{zaehler}", label.group(1) if label else "", _rein(titel))
        ereignisse.append(_Ereignis(m.start(), "section", abschnitt=abschnitt))
    for m in re.finditer(r"\\subsection\*?(?:\[[^\]]*\])?\{", quelltext):
        titel, _ = lies_gruppe(quelltext, m.end() - 1)
        ereignisse.append(_Ereignis(m.start(), "subsection", _rein(titel)))
    return sorted(ereignisse, key=lambda e: e.position)


def _zustand_bei(ereignisse: list[_Ereignis], position: int) -> _Zustand:
    """Welche Umgebungen, welcher Abschnitt und welche Diagrammreihe gelten an ``position``."""
    umgebungen: list[str] = []
    abschnitt: Abschnitt | None = None
    unterabschnitt: str | None = None
    reihen_gezaehlt = 0
    aktuelle_reihe: int | None = None
    for ereignis in ereignisse:
        if ereignis.position >= position:
            break
        if ereignis.art == "begin":
            umgebungen.append(ereignis.name)
            if ereignis.name == "diagrammreihe":
                reihen_gezaehlt += 1
                aktuelle_reihe = reihen_gezaehlt
        elif ereignis.art == "end":
            if ereignis.name in umgebungen:
                # von innen her schließen; das Buch verschachtelt sauber
                while umgebungen and umgebungen.pop() != ereignis.name:
                    pass
            if ereignis.name == "diagrammreihe":
                aktuelle_reihe = None
        elif ereignis.art == "section":
            abschnitt, unterabschnitt = ereignis.abschnitt, None
        elif ereignis.art == "subsection":
            unterabschnitt = ereignis.name
    return _Zustand(list(umgebungen), abschnitt, unterabschnitt, aktuelle_reihe)


def _lies_diagramm(quelltext: str, befehl: str, position: int, datei: str, zustand: _Zustand) -> Rohdiagramm:
    """Liest die Argumente eines Diagrammbefehls und zerlegt sie."""
    mit_optional, anzahl = DIAGRAMMBEFEHLE[befehl]
    befunde: list[Befund] = []
    fundstelle = f"{datei}:{zeile_von(quelltext, position)}"
    unterschrift = ""
    try:
        if mit_optional:
            optional, position = lies_optionales_argument(quelltext, position)
            unterschrift = optional or ""
        argumente, _ = lies_argumente(quelltext, position, anzahl)
    except LatexFehler as fehler:
        befunde.append(Befund(Schwere.FEHLER, "latex-klammer", str(fehler), fundstelle))
        argumente = [""] * anzahl
    fen, pfeile_roh, felder_roh, unterschrift = _ordne_argumente(befehl, argumente, unterschrift)
    nummer, unterschrift = _trenne_nummer(unterschrift)
    if nummer is None:
        befunde.append(Befund(Schwere.HINWEIS, "ohne-nummer", f"\\{befehl} ohne \\abbziel", fundstelle))
    if befehl == "diagrammpfeile":
        befunde.append(
            Befund(Schwere.WARNUNG, "einfarbig", "einfarbige Pfeile, als grau übernommen", fundstelle)
        )
        pfeile_roh = ",".join(f"grau/{zug}" for zug in pfeile_roh.split(",") if zug.strip())
    pfeile = _lies_pfeile(pfeile_roh, fundstelle, befunde)
    felder = _lies_felder(felder_roh, fundstelle, befunde)
    art = next(
        (ART_JE_UMGEBUNG[u] for u in reversed(zustand.umgebungen) if u in ART_JE_UMGEBUNG),
        "fliesstext",
    )
    return Rohdiagramm(
        befehl=befehl,
        nummer=nummer,
        fen=" ".join(fen.split()),
        pfeile=pfeile,
        felder=felder,
        unterschrift_latex=unterschrift,
        datei=datei,
        zeile=0,
        art=art,
        abschnitt=zustand.abschnitt,
        unterabschnitt=zustand.unterabschnitt,
        reihe=zustand.reihe,
        befunde=befunde,
    )


def _ordne_argumente(befehl: str, argumente: list[str], optional: str) -> tuple[str, str, str, str]:
    """Bringt die Argumente jedes Befehls in die Form (FEN, Pfeile, Felder, Unterschrift)."""
    if befehl == "grossdiagrammtaktik":
        return argumente[0], argumente[1], argumente[2], optional
    if befehl == "diagrammschritttaktik":
        return argumente[0], argumente[1], argumente[2], argumente[3]
    if befehl == "diagrammschritt":
        return argumente[0], "", "", argumente[1]
    if befehl == "diagrammpfeile":
        return argumente[0], argumente[1], "", optional
    if befehl == "diagrammfotopaar":
        return argumente[0], "", "", argumente[2]
    return argumente[0], "", "", optional  # \diagramm und \diagrammbox


def _trenne_nummer(unterschrift: str) -> tuple[str | None, str]:
    """Trennt „\\abbziel{1.26}: “ vom Text der Unterschrift."""
    treffer = _ABBZIEL.search(unterschrift)
    if not treffer:
        return None, unterschrift.strip()
    rest = unterschrift[: treffer.start()] + unterschrift[treffer.end() :]
    return treffer.group(1).strip(), rest.strip()


def _lies_pfeile(roh: str, fundstelle: str, befunde: list[Befund]) -> list[Pfeil]:
    pfeile = []
    for eintrag in _eintraege(roh):
        farbe, _, rest = eintrag.partition("/")
        von, _, nach = rest.partition("-")
        if farbe not in FARBEN or not _FELD.match(von) or not _FELD.match(nach):
            befunde.append(Befund(Schwere.FEHLER, "pfeil", f"Pfeil „{eintrag}“ nicht lesbar", fundstelle))
            continue
        pfeile.append(Pfeil(farbe, von, nach))
    return pfeile


def _lies_felder(roh: str, fundstelle: str, befunde: list[Befund]) -> list[Feldmarke]:
    felder = []
    for eintrag in _eintraege(roh):
        farbe, _, feld = eintrag.partition("/")
        if farbe not in FARBEN or not _FELD.match(feld):
            befunde.append(Befund(Schwere.FEHLER, "feld", f"Feldmarke „{eintrag}“ nicht lesbar", fundstelle))
            continue
        felder.append(Feldmarke(farbe, feld))
    return felder


def _eintraege(roh: str) -> list[str]:
    return [teil.strip() for teil in roh.split(",") if teil.strip()]


def _rein(titel: str) -> str:
    """Abschnittstitel ohne Zeilenumbrüche und mit deutschen Anführungszeichen."""
    titel = titel.replace("\\glqq", "\u201e").replace("\\grqq{}", "\u201c").replace("\\grqq", "\u201c")
    titel = titel.replace("--", "\u2013")
    return " ".join(titel.split())

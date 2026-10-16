"""Wandelt LaTeX-Text (vor allem Bildunterschriften) in Textteile für die App.

Wozu diese Datei da ist:
    Die App zeigt jede Bildunterschrift eins zu eins wie im Buch (Pflichtenheft,
    Bildunterschriften). Fettdruck, Hervorhebungen, Züge und Abbildungsverweise
    sollen dabei erhalten bleiben. Deshalb wird eine Unterschrift nicht zu reinem
    Text, sondern zu einer Liste von Teilen:

        {"art": "text", "text": "Nach 2. Lf4 – ", "stil": "normal"}
        {"art": "text", "text": "Ziel 1", "stil": "fett"}
        {"art": "zug", "text": "Dxf7#"}
        {"art": "verweis", "abbildung": "1.15", "text": "Abb. 1.15"}
        {"art": "stelle", "anker": "abzug-7", "text": "Abschnitt 7.2"}   (aus \\glseite)
        {"art": "zeichen", "zeichen": "ja", "text": "✓"}                (\\zielja und Verwandte)
        {"art": "begriff", "begriff": "Zugzwang", "text": "Zugzwang"}  (Pfeil im Glossar)
        {"art": "absatz", "text": "¶"}                                  (Leerzeile, \\par, \\\\)

Rolle im Gesamtbild:
    Teil von Schritt 1 „Lesen“ der Pipeline (Konzept Abschnitt 5). Unbekannte Befehle
    werden als Befund gemeldet und sichtbar markiert, nie geraten.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.latex import LatexFehler, lies_gruppe
from pipeline.lesen.verzeichnis import Verweisverzeichnis

# Ersetzungen ohne Argument. Reihenfolge wichtig: --- vor --.
_ZEICHEN = [
    ("---", "—"),  # Geviertstrich
    ("--", "–"),  # Halbgeviertstrich, im Buch als Gedankenstrich
    ("~", " "),  # geschütztes Leerzeichen
]

# Befehle ohne Argument und ihr Ergebnis im Text.
_EINFACHE_BEFEHLE = {
    "glqq": "„",  # „
    "grqq": "“",  # “
    "/": "",  # Kursivkorrektur, im Bildschirmsatz ohne Bedeutung
    ",": " ",  # schmales Leerzeichen
    " ": " ",
    "#": "#",
    "&": "&",
    "%": "%",
    "_": "_",
    "ldots": "…",
    "dots": "…",
}

# Befehle mit einem Argument, deren Inhalt in einem bestimmten Stil erscheint.
# \regelkz setzt Regelkennzeichen wie „W1“ fett (preamble.tex), \texttt Feldnamen wie „e4“.
_STIL_BEFEHLE = {
    "textbf": "fett",
    "regelkz": "fett",
    "emph": "kursiv",
    "textit": "kursiv",
    "texttt": "normal",
    "textsf": "normal",
}

# Befehle mit einem Argument, die im Text nichts erzeugen. \color färbt nur (Denkroutine).
_STUMME_BEFEHLE = {"glanker", "label", "abbziel", "color"}

# Befehle ohne Argument, die im Text nichts erzeugen (Satzanweisungen). \itshape setzt in der
# Denkroutine nur die graue Erläuterung kursiv; die App setzt sie selbst ab.
_STUMME_SCHALTER = {"ohnezugzeiger", "noindent", "smallskip", "medskip", "bigskip", "itshape"}

# Zustandszeichen der Ziel-, Faktoren- und Fallenbilanzen (preamble.tex) → (Zeichen, Anzeige).
ZEICHEN = {
    "zielja": ("ja", "✓"),
    "faktorgut": ("ja", "✓"),
    "checkja": ("ja", "✓"),
    "zielteils": ("teils", "◐"),
    "faktorteils": ("teils", "◐"),
    "checkteils": ("teils", "◐"),
    "zielnein": ("nein", "✗"),
    "faktorschlecht": ("nein", "✗"),
    "checknein": ("nein", "✗"),
    "checkentfaellt": ("entfaellt", "–"),
    "faktorvornlinks": ("vornlinks", "⚖"),
    "faktorvornrechts": ("vornrechts", "⚖"),
    "faktorgleichstand": ("gleichstand", "⚖"),
    "faktorplus": ("plus", "↑"),
    "faktorminus": ("minus", "↓"),
    "faktorgleich": ("gleich", "="),
}

# Absatzwechsel: Leerzeile im Quelltext, \par oder \\ (Zeilenumbruch).
_ABSATZ = "¶"
_LEERZEILE = re.compile(r"\n[ \t]*\n\s*")

# Mathematik, die im Buch vorkommt. Alles andere zwischen $ ... $ ist ein Befund.
_MATHE = {"-": "−", "+": "+", "\\rightarrow": "→"}


@dataclass
class Textteil:
    """Ein Stück der Bildunterschrift mit seiner Art."""

    art: str  # "text", "zug", "verweis", "stelle", "zeichen", "begriff" oder "absatz"
    text: str
    stil: str = "normal"
    abbildung: str | None = None
    anker: str | None = None
    zeichen: str | None = None
    begriff: str | None = None

    def als_daten(self) -> dict[str, str]:
        daten = {"art": self.art, "text": self.text}
        if self.art == "text":
            daten["stil"] = self.stil
        for name in ("abbildung", "anker", "zeichen", "begriff"):
            wert = getattr(self, name)
            if wert is not None:
                daten[name] = wert
        return daten


@dataclass
class Umwandlung:
    """Ergebnis einer Umwandlung: die Teile und alle Befunde dazu."""

    teile: list[Textteil] = field(default_factory=list)
    befunde: list[Befund] = field(default_factory=list)
    verzeichnis: Verweisverzeichnis | None = None


def wandle_text(latex: str, fundstelle: str, verzeichnis: Verweisverzeichnis | None = None) -> Umwandlung:
    """Wandelt einen LaTeX-Textabschnitt in Textteile.

    Eingabe: der LaTeX-Text (zum Beispiel die Unterschrift von Abb. 1.2) und eine
    Fundstelle für Befunde („kap01_grundprinzipien.tex:93“).
    Ausgabe: Teile mit zusammengefassten Leerräumen und die Befunde.

    Beispiel: ``Nach 2. Lf4 -- \\textbf{Ziel 1}: Der Bauer`` ergibt drei Teile:
    „Nach 2. Lf4 – “, „Ziel 1“ (fett) und „: Der Bauer“.
    Mit Verweisverzeichnis werden auch ``\\ref``, ``\\cite`` und ``\\glseite`` aufgelöst
    (Übungen, Lösungen, Glossar); ohne Verzeichnis sind sie unbekannte Befehle.
    """
    ergebnis = Umwandlung(verzeichnis=verzeichnis)
    _wandle_in(_LEERZEILE.sub("\\\\par ", latex), "normal", ergebnis, fundstelle)
    ergebnis.teile = _fasse_zusammen(ergebnis.teile)
    return ergebnis


def _wandle_in(latex: str, stil: str, ergebnis: Umwandlung, fundstelle: str) -> None:
    """Geht den Text Zeichen für Zeichen durch und hängt Teile an ``ergebnis`` an."""
    puffer: list[str] = []
    index = 0

    def schreibe_puffer() -> None:
        if puffer:
            ergebnis.teile.append(Textteil("text", _ersetze_zeichen("".join(puffer)), stil))
            puffer.clear()

    while index < len(latex):
        zeichen = latex[index]
        if zeichen == "\\":
            schreibe_puffer()
            index = _verarbeite_befehl(latex, index, stil, ergebnis, fundstelle)
        elif zeichen == "$":
            schreibe_puffer()
            index = _verarbeite_mathe(latex, index, stil, ergebnis, fundstelle)
        elif zeichen in "{}":
            index += 1  # einfache Gruppierung wie {} nach \grqq hat keine Bedeutung
        else:
            puffer.append(zeichen)
            index += 1
    schreibe_puffer()


def _verarbeite_befehl(latex: str, index: int, stil: str, ergebnis: Umwandlung, fundstelle: str) -> int:
    """Verarbeitet einen Befehl ab dem Backslash und liefert die Position danach."""
    name, nach_name = _befehlsname(latex, index)
    if name in _EINFACHE_BEFEHLE:
        ergebnis.teile.append(Textteil("text", _EINFACHE_BEFEHLE[name], stil))
        return nach_name
    if name in ("par", "\\"):
        ergebnis.teile.append(Textteil("absatz", _ABSATZ))
        return nach_name
    if name in ZEICHEN:
        zeichen, anzeige = ZEICHEN[name]
        ergebnis.teile.append(Textteil("zeichen", anzeige, zeichen=zeichen))
        return _ueberspringe_leere_gruppe(latex, nach_name)
    if name in _STUMME_SCHALTER:
        return nach_name
    try:
        if ergebnis.verzeichnis is not None and name in ("ref", "cite", "glseite", "begriffsverweis"):
            return _verarbeite_verweis(latex, name, nach_name, ergebnis, fundstelle)
        if name in _STIL_BEFEHLE:
            inhalt, ende = lies_gruppe(latex, nach_name)
            _wandle_in(inhalt, _STIL_BEFEHLE[name], ergebnis, fundstelle)
            return ende
        if name in ("zugfolge", "zug"):
            inhalt, ende = lies_gruppe(latex, nach_name)
            ergebnis.teile.append(Textteil("zug", _bereinige_zug(inhalt)))
            return ende
        if name in ("abb", "abbnr"):
            inhalt, ende = lies_gruppe(latex, nach_name)
            nummer = inhalt.strip()
            anzeige = f"Abb. {nummer}" if name == "abb" else nummer
            ergebnis.teile.append(Textteil("verweis", anzeige, abbildung=nummer))
            return ende
        if name in _STUMME_BEFEHLE:
            _, ende = lies_gruppe(latex, nach_name)
            return ende
    except LatexFehler as fehler:
        ergebnis.befunde.append(Befund(Schwere.FEHLER, "latex-klammer", f"\\{name}: {fehler}", fundstelle))
        return nach_name
    # Unbekannt: sichtbar markieren und melden, nie raten.
    ergebnis.befunde.append(
        Befund(Schwere.FEHLER, "latex-unbekannt", f"Unbekannter Befehl \\{name}", fundstelle)
    )
    ergebnis.teile.append(Textteil("text", f"‹\\{name}›", stil))
    return nach_name


def _verarbeite_verweis(latex: str, name: str, index: int, ergebnis: Umwandlung, fundstelle: str) -> int:
    """Löst \\ref, \\cite, \\glseite und \\begriffsverweis mit dem Verweisverzeichnis auf."""
    verzeichnis = ergebnis.verzeichnis
    assert verzeichnis is not None
    inhalt, ende = lies_gruppe(latex, index)
    schluessel = inhalt.strip()
    if name == "ref":
        ziel = verzeichnis.ziel(schluessel)
        if ziel is None:
            ergebnis.befunde.append(
                Befund(Schwere.WARNUNG, "ref-unbekannt", f"\\ref{{{schluessel}}} ohne Ziel", fundstelle)
            )
        ergebnis.teile.append(Textteil("text", ziel or "?"))
    elif name == "cite":
        nummern = [verzeichnis.literatur.get(s.strip()) for s in schluessel.split(",")]
        if None in nummern:
            ergebnis.befunde.append(
                Befund(Schwere.WARNUNG, "cite-unbekannt", f"\\cite{{{schluessel}}} ohne Eintrag", fundstelle)
            )
        ergebnis.teile.append(Textteil("text", "[" + ", ".join(str(n or "?") for n in nummern) + "]"))
    elif name == "glseite":
        stelle = verzeichnis.anker.get(schluessel)
        if stelle is None:
            ergebnis.befunde.append(
                Befund(
                    Schwere.WARNUNG, "glseite-unbekannt", f"\\glseite{{{schluessel}}} ohne Anker", fundstelle
                )
            )
        anzeige = (
            f"Abschnitt {stelle.abschnitt}"
            if stelle and stelle.abschnitt
            else f"Kapitel {stelle.kapitel if stelle else '?'}"
        )
        # „S.~\\glseite{…}“: Die App hat keine Seiten; das „S.“ davor entfällt.
        vorher = ergebnis.teile[-1] if ergebnis.teile else None
        if vorher is not None and vorher.art == "text" and re.search(r"S\.\s*$", vorher.text):
            ergebnis.teile[-1] = Textteil("text", re.sub(r"S\.\s*$", "", vorher.text), vorher.stil)
        ergebnis.teile.append(Textteil("stelle", anzeige, anker=schluessel))
    else:  # begriffsverweis{Begriff}{Anzeige}, von lesen/glossar.py eingesetzt
        anzeige, ende = lies_gruppe(latex, ende)
        ergebnis.teile.append(Textteil("begriff", anzeige.strip(), begriff=schluessel))
    return ende


def _ueberspringe_leere_gruppe(latex: str, index: int) -> int:
    """Überspringt ``{}`` hinter einem Befehl ohne Argument (``\\zielja{} Text``)."""
    return index + 2 if latex.startswith("{}", index) else index


def _verarbeite_mathe(latex: str, index: int, stil: str, ergebnis: Umwandlung, fundstelle: str) -> int:
    """Übersetzt die wenigen Formeln des Buches (etwa ``$-$3``)."""
    ende = latex.find("$", index + 1)
    if ende < 0:
        ergebnis.befunde.append(Befund(Schwere.FEHLER, "latex-mathe", "Schließendes $ fehlt", fundstelle))
        return len(latex)
    formel = latex[index + 1 : ende].strip()
    if formel in _MATHE:
        ergebnis.teile.append(Textteil("text", _MATHE[formel], stil))
    else:
        ergebnis.befunde.append(
            Befund(Schwere.FEHLER, "latex-mathe", f"Unbekannte Formel ${formel}$", fundstelle)
        )
        ergebnis.teile.append(Textteil("text", f"‹{formel}›", stil))
    return ende + 1


def _befehlsname(latex: str, index: int) -> tuple[str, int]:
    """Liest den Namen nach dem Backslash: Buchstabenfolge oder ein einzelnes Zeichen."""
    treffer = re.match(r"[A-Za-z]+", latex[index + 1 :])
    if treffer:
        # Wie in LaTeX: Leerraum nach einem Befehlswort gehört zum Befehl
        # („\\glqq gut“ ergibt „„gut“, nicht „„ gut“).
        ende = index + 1 + treffer.end()
        while ende < len(latex) and latex[ende] in " \t\n":
            ende += 1
        return treffer.group(0), ende
    return latex[index + 1 : index + 2], index + 2


def _bereinige_zug(inhalt: str) -> str:
    """Zugtext ohne LaTeX: ``Dxf7\\#`` wird zu ``Dxf7#``."""
    return " ".join(inhalt.replace("\\#", "#").split())


def _ersetze_zeichen(text: str) -> str:
    for alt, neu in _ZEICHEN:
        text = text.replace(alt, neu)
    return text


def _fasse_zusammen(teile: list[Textteil]) -> list[Textteil]:
    """Fasst Leerraum zusammen und verbindet benachbarte Textteile gleichen Stils."""
    zusammen: list[Textteil] = []
    for teil in teile:
        if teil.art == "absatz":
            # Kein Absatz am Anfang und keine zwei Absätze hintereinander.
            if zusammen and zusammen[-1].art != "absatz":
                if zusammen[-1].art == "text":
                    zusammen[-1] = Textteil("text", zusammen[-1].text.rstrip(), zusammen[-1].stil)
                zusammen.append(teil)
            continue
        if teil.art == "text" and zusammen and zusammen[-1].art == "absatz":
            teil = Textteil("text", teil.text.lstrip(), teil.stil)
        if teil.art == "text":
            teil = Textteil("text", re.sub(r"\s+", " ", teil.text), teil.stil)
            if not teil.text:
                continue
            if zusammen and zusammen[-1].art == "text" and zusammen[-1].stil == teil.stil:
                zusammen[-1] = Textteil("text", zusammen[-1].text + teil.text, teil.stil)
                continue
        zusammen.append(teil)
    # Leerraum am Anfang und am Ende der ganzen Unterschrift entfernen.
    if zusammen and zusammen[0].art == "text":
        zusammen[0] = Textteil("text", zusammen[0].text.lstrip(), zusammen[0].stil)
    while zusammen and zusammen[-1].art == "absatz":
        zusammen.pop()
    if zusammen and zusammen[-1].art == "text":
        zusammen[-1] = Textteil("text", zusammen[-1].text.rstrip(), zusammen[-1].stil)
    return [teil for teil in zusammen if teil.text]


def als_klartext(teile: list[Textteil]) -> str:
    """Die Unterschrift als einfacher Text, etwa für Prüfungen und den Bericht."""
    return "".join("\n" if teil.art == "absatz" else teil.text for teil in teile)

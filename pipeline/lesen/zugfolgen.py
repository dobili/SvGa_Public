"""Liest Zugfolgen (``\\zugfolge{…}``) eines Kapitels mit ihrem Zusammenhang im Text.

Wozu diese Datei da ist:
    Das Buch schreibt Zugfolgen als Fließtext in deutscher Notation: „1. e4 e5 2. Sf3 Sc6“,
    „3... g6! 4. Df3“, „6... c5 7. c3 Sc6“. Für die App müssen daraus nachspielbare Züge werden
    (Pflichtenheft, Abschnitt 3 „Zugfolgen“; Konzept Abschnitt 5, Schritt 3). Diese Datei findet
    jede Zugfolge, zerlegt sie in Züge und merkt sich, wo sie steht:

    fliesstext     im laufenden Text; die zuletzt gezeigte Abbildung ist bekannt
    unterschrift   in der Bildunterschrift einer Abbildung („Nach 4. Sc3! Lc5 5. Sd5!“)
    uebung         in einer Übung (Umgebung ``zugamzug`` mit Label)
    loesung        in ``\\loesungeintrag{label}{…}``; die Züge gehören zur Übung mit diesem Label

Erwähnungen einzelner Züge ohne Zugnummer („vermeide Randentwicklung wie \\zugfolge{Sa3}“) sind
keine Zugfolgen; sie werden übergangen. Das Nachspielen selbst macht ``pipeline/zugfolgen/``.

Rolle im Gesamtbild: Schritt 1 „Lesen“ der Pipeline. Nichts wird geändert oder geraten:
Was sich nicht als Zug lesen lässt, wird ein Befund.
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
from pipeline.lesen.quellen import Quelldatei, abschnittsnummer

# Deutsche Figurenbuchstaben (Kapitel 0) → englische, wie python-chess sie liest.
FIGURENBUCHSTABEN = {"K": "K", "D": "Q", "T": "R", "L": "B", "S": "N"}
_DEUTSCHE_BUCHSTABEN = {englisch: deutsch for deutsch, englisch in FIGURENBUCHSTABEN.items()}

# Ein Zug in deutscher Kurz- oder Langnotation, mit optionalem Zugzeichen.
_ZUG = re.compile(
    r"^(?P<zug>O-O-O|O-O|[KDTLS]?[a-h]?[1-8]?[x\-]?[a-h][1-8](?:=[DTLS])?)(?P<schach>\+\+|\+|#)?(?P<zeichen>[!?]{1,2})?$"
)
_ZUGNUMMER = re.compile(r"^(?P<nummer>\d+)\.(?P<schwarz>\.\.)?$")
_PUNKTE_VORN = re.compile(r"^\.\.\.(?=\S)")


@dataclass(frozen=True)
class Zug:
    """Ein Zug, wie er im Buch steht."""

    san: str  # englische Kurznotation ohne Zugzeichen, etwa „Nxc7+“, „O-O“, „e8=Q“
    buchtext: str  # wie im Buch: „Sxc7+!“
    zeichen: str  # „!“, „?“, „!!“, „??“, „!?“, „?!“ oder leer
    nummer: int | None  # Zugnummer, falls im Text; sonst aus dem Zusammenhang
    farbe: str  # „w“ oder „b“


@dataclass
class Zugfolge:
    """Eine Zugfolge mit Fundstelle und Zusammenhang."""

    zuege: list[Zug]
    buchtext: str
    datei: str
    zeile: int
    kontext: str  # fliesstext, unterschrift, uebung, loesung
    bezug: str | None  # Abbildungsnummer (unterschrift) oder Übungslabel (uebung, loesung)
    position: int  # Zeichenposition im Kapitel, für die Reihenfolge
    verweise: list[str] = field(
        default_factory=list
    )  # Abbildungen, die der Absatz davor nennt, nächste zuerst
    abschnitt: str | None = None
    ziel: str | None = None  # Abbildung direkt hinter der Zugfolge: „… 8. d5 Se7 (\\abb{5.27})“
    in_klammern: bool = False  # „(Unangenehmer wäre 10. Sxd4 …)“: eine Alternative, keine Hauptlinie

    @property
    def fundstelle(self) -> str:
        return f"{self.datei}:{self.zeile}"


@dataclass
class Zugfolgenquelle:
    zugfolgen: list[Zugfolge] = field(default_factory=list)
    erwaehnungen: int = 0  # übergangene Einzelzüge ohne Nummer
    befunde: list[Befund] = field(default_factory=list)


def lies_zuege(text: str) -> list[Zug] | None:
    """Zerlegt den Text einer ``\\zugfolge`` in Züge.

    Ausgabe: die Züge, oder None, wenn es nur eine Erwähnung ist (keine Zugnummer im Text;
    „...axb5“ allein zählt auch als Erwähnung).
    Beispiel: „3... g6! 4. Df3 Sf6“ → g6 (Schwarz, 3, „!“), Qf3 (Weiß, 4), Nf6 (Schwarz, 4).
    „Sa3“ → None. Nicht lesbare Wörter führen zu ValueError mit dem Wort.
    """
    zuege: list[Zug] = []
    nummer: int | None = None
    farbe: str | None = None
    nummeriert = False
    for wort in _woerter(text):
        treffer = _ZUGNUMMER.match(wort)
        if treffer:
            nummer, farbe, nummeriert = (
                int(treffer.group("nummer")),
                "b" if treffer.group("schwarz") else "w",
                True,
            )
            continue
        if _PUNKTE_VORN.match(wort):
            wort, farbe = wort[3:], "b"  # „...Sxd4“ ohne Nummer bleibt eine Erwähnung
        zug = _ZUG.match(wort)
        if not zug:
            raise ValueError(wort)
        if farbe is None:
            farbe = "w"
        zuege.append(
            Zug(
                _als_san(zug.group("zug"), zug.group("schach")),
                wort,
                zug.group("zeichen") or "",
                nummer,
                farbe,
            )
        )
        if farbe == "b" and nummer is not None:
            nummer += 1
        farbe = "b" if farbe == "w" else "w"
    return zuege if nummeriert else None


def _woerter(text: str) -> list[str]:
    """Wörter der Zugfolge ohne LaTeX-Rest: „\\#“ → „#“, „e.p.“ und „~“ entfallen."""
    text = text.replace("\\#", "#").replace("~", " ").replace("--", "-")
    text = re.sub(r"\s*e\.p\.", "", text)
    # „8...\nSxd4“: Nummer und Punkte können vom Zug getrennt stehen; „...“ allein bleibt ein Wort.
    return text.split()


def _als_san(zug: str, schach: str | None) -> str:
    """Deutsche Notation nach englisch: „Sxc7“ → „Nxc7“, „Ld7-b5“ → „Bd7-b5“; „++“ wird „+“."""
    san = "".join(
        FIGURENBUCHSTABEN.get(z, z) if i == 0 or zug[i - 1] == "=" else z for i, z in enumerate(zug)
    )
    if schach:
        san += "#" if schach == "#" else "+"
    return san


def auf_deutsch(san: str) -> str:
    """Englische Kurznotation zurück in die deutsche des Buches: „Nxc7+“ → „Sxc7+“, „e8=Q“ → „e8=D“.

    Warum: Befunde und Prüfhilfe sprechen den Autor an; er liest die Züge wie im Buch.
    Sonderfall: Rochade („O-O“) und Bauernzüge bleiben unverändert.
    """
    return "".join(
        _DEUTSCHE_BUCHSTABEN.get(z, z) if i == 0 or san[i - 1] == "=" else z for i, z in enumerate(san)
    )


def lies_zugfolgen(quelle: Quelldatei) -> Zugfolgenquelle:
    """Findet alle Zugfolgen eines Kapitels mit Zusammenhang, in Textreihenfolge.

    Beispiel: Kapitel 1 liefert unter anderem „1. d4 d5 2. Lf4 Sf6 3. e3 e6 4. Sf3 Le7 5. Ld3 O-O
    6. O-O“ (fliesstext) und in der Unterschrift von Abb. 1.9 „4. Sc3! Lc5 5. Sd5!“.
    """
    ergebnis = Zugfolgenquelle()
    spannen = _kontextspannen(quelle, ergebnis.befunde)
    for treffer in finde_befehle(quelle.text, ["zugfolge"]):
        fundstelle = f"{quelle.name}:{zeile_von(quelle.text, treffer.start)}"
        try:
            (inhalt,), _ = lies_argumente(quelle.text, treffer.ende_name, 1)
        except LatexFehler as fehler:
            ergebnis.befunde.append(
                Befund(Schwere.FEHLER, "latex-klammer", f"\\zugfolge: {fehler}", fundstelle)
            )
            continue
        try:
            zuege = lies_zuege(inhalt)
        except ValueError as fehler:
            ergebnis.befunde.append(
                Befund(Schwere.WARNUNG, "zugfolge-unlesbar", f"Zug „{fehler}“ nicht lesbar", fundstelle)
            )
            continue
        if zuege is None:
            ergebnis.erwaehnungen += 1
            continue
        kontext, bezug = _kontext(spannen, treffer.start)
        ergebnis.zugfolgen.append(
            Zugfolge(
                zuege,
                " ".join(inhalt.split()),
                quelle.name,
                zeile_von(quelle.text, treffer.start),
                kontext,
                bezug,
                treffer.start,
                _verweise_davor(quelle.text, treffer.start),
                abschnittsnummer(quelle, treffer.start),
                _verweis_danach(quelle.text, treffer.start),
                _in_klammern(quelle.text, treffer.start),
            )
        )
    return ergebnis


def _in_klammern(text: str, position: int) -> bool:
    """Steht die Zugfolge in einer offenen runden Klammer ihres Absatzes?

    Warum: Schachtexte setzen Alternativen in Klammern: „Nach 10. cxd4 … (Unangenehmer wäre
    10. Sxd4, …) Schwarz entwickelt mit 10... Le7“. Die Klammer darf die Hauptlinie nicht umstellen.
    """
    absatzanfang = text.rfind("\n\n", 0, position)
    davor = text[absatzanfang if absatzanfang >= 0 else 0 : position]
    return davor.count("(") > davor.count(")")


def _verweise_davor(text: str, position: int) -> list[str]:
    """Abbildungen, auf die der Absatz vor der Zugfolge verweist („In \\abb{7.6} …“), nächste zuerst.

    Warum: Im Taktik- und Endspielteil steht die Abbildung im LaTeX oft erst nach dem Absatz, der
    ihre Züge bespricht. Der Verweis im Absatz sagt, zu welcher Stellung die Züge gehören.
    """
    absatzanfang = text.rfind("\n\n", 0, position)
    davor = text[absatzanfang if absatzanfang >= 0 else 0 : position]
    return list(reversed(re.findall(r"\\abb(?:nr)?\{([\d.]+)\}", davor)))


_VERWEIS_DANACH = re.compile(r"\\zugfolge\{[^{}]*\}\s*\(?(?:siehe\s+)?\\abb(?:nr)?\{([\d.]+)\}")


def _verweis_danach(text: str, position: int) -> str | None:
    """Die Abbildung, die unmittelbar hinter der Zugfolge steht: die Stellung nach den Zügen."""
    treffer = _VERWEIS_DANACH.match(text, position)
    return treffer.group(1) if treffer else None


@dataclass(frozen=True)
class _Spanne:
    anfang: int
    ende: int
    kontext: str
    bezug: str | None


def _kontextspannen(quelle: Quelldatei, befunde: list[Befund]) -> list[_Spanne]:
    """Bereiche mit besonderem Zusammenhang: Diagrammargumente, Übungen, Lösungseinträge."""
    text = quelle.text
    spannen: list[_Spanne] = []
    for treffer in finde_befehle(text, list(DIAGRAMMBEFEHLE)):
        mit_optional, anzahl = DIAGRAMMBEFEHLE[treffer.name]
        try:
            position = treffer.ende_name
            if mit_optional:
                _, position = lies_optionales_argument(text, position)
            _, ende = lies_argumente(text, position, anzahl)
        except LatexFehler:
            continue  # meldet lesen/diagramme.py
        nummer = re.search(r"\\abbziel\{([^}]*)\}", text[treffer.start : ende])
        spannen.append(
            _Spanne(treffer.start, ende, "unterschrift", nummer.group(1).strip() if nummer else None)
        )
    for m in re.finditer(r"\\begin\{zugamzug\}(.*?)\\end\{zugamzug\}", text, re.S):
        label = re.search(r"\\label\{(ueb:[^}]+)\}", m.group(1))
        spannen.append(_Spanne(m.start(), m.end(), "uebung", label.group(1) if label else None))
    for treffer in finde_befehle(text, ["loesungeintrag"]):
        try:
            (label, _), ende = lies_argumente(text, treffer.ende_name, 2)
        except LatexFehler as fehler:
            stelle = f"{quelle.name}:{zeile_von(text, treffer.start)}"
            befunde.append(Befund(Schwere.FEHLER, "latex-klammer", f"\\loesungeintrag: {fehler}", stelle))
            continue
        spannen.append(_Spanne(treffer.start, ende, "loesung", label.strip()))
    return spannen


def _kontext(spannen: list[_Spanne], position: int) -> tuple[str, str | None]:
    """Der innerste Bereich, in dem eine Position liegt; sonst Fließtext."""
    passende = [s for s in spannen if s.anfang <= position < s.ende]
    if not passende:
        return "fliesstext", None
    innerste = min(passende, key=lambda s: s.ende - s.anfang)
    return innerste.kontext, innerste.bezug


# Wörter, mit denen eine Bildunterschrift die Zugfolge einleitet, die zur Abbildung führt.
# „Nach 4. Sc3 …“ am Anfang, oder „… nach 1. e4 …“ mitten im ersten Satz, sofern eine Zugnummer folgt
# („Das Kieseritzky-Gambit aus Kapitel 3 nach 1. e4 e5 2. f4 …“, „Stellung nach 1. e4 g6 2. d4 h6“).
_EINLEITUNG = re.compile(r"^\s*Nach\s+|(?:^|[\s(,])[Nn]ach\s+(?=\d+\.)")
_SATZZEICHEN = ",;:.)–—"


def lies_unterschriftszuege(klartext: str) -> list[Zug] | None:
    """Liest die Züge einer Bildunterschrift: „Nach 4. Sc3! Lc5 5. Sd5! – …“ oder „… nach 1. e4 …“.

    Warum: Die meisten Unterschriften nennen die Züge zur Abbildung als Klartext, nicht in
    ``\\zugfolge``. Diese Züge verbinden die Abbildung mit der Zugfolge des Textes.
    Ausgabe: Züge bis zum ersten Wort, das kein Zug ist, oder None ohne „nach“ vor einer Zugnummer.
    Sicherheit: Der Nachspieler spielt Unterschriftszüge nur, wenn sie die Abbildung erreichen.
    Beispiel: „Nach 5... Db6, Weiß am Zug.“ → Qb6 (Schwarz, 5).
    """
    einleitung = _EINLEITUNG.search(klartext)
    if einleitung is None:
        return None
    woerter: list[str] = []
    for wort in klartext[einleitung.end() :].split():
        if _ZUGNUMMER.match(wort):
            woerter.append(wort)
            continue
        rein = wort.rstrip(_SATZZEICHEN)
        if not rein or not _ZUG.match(_PUNKTE_VORN.sub("", rein)):
            break
        woerter.append(rein)
        if rein != wort:
            break  # Satzzeichen hinter dem Zug: „5. Se5.“ oder „Db6,“ beendet die Zugfolge
    try:
        return lies_zuege(" ".join(woerter)) if woerter else None
    except ValueError:
        return None

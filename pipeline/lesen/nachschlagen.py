"""Denkroutine (Kopiervorlage), Gesamt-Checkliste (Kapitel 12) und Lernziele für Nachschlagen.

Wozu diese Datei da ist:
    Pflichtenheft 4 verlangt die Kopiervorlage als aufklappbare Karte (vier Schritte,
    Sicherheitsblick, Werkzeuge je Partiephase) und die Tabelle aus Kapitel 12 als
    Nachschlagekarte. Beides steht im Buch als TikZ-Bild bzw. Tabelle; hier wird es in Daten
    übersetzt, damit die App nichts davon selbst schreibt (Regel 1: Das Buch ist die einzige Quelle).

Eingabe: ``anhang_kopiervorlage.tex`` und ``kap12_training.tex``. Ausgabe: die Inhalte von
``nachschlagen.json`` (Schema ``schemas/nachschlagen.schema.json``) und Befunde.
"""

from __future__ import annotations

import re
from typing import Any

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.latex import LatexFehler, lies_gruppe
from pipeline.lesen.lernziele import baue_lernziele
from pipeline.lesen.quellen import Quelldatei
from pipeline.lesen.text import als_klartext, wandle_text

KOPIERVORLAGE = "anhang_kopiervorlage.tex"
TRAININGSKAPITEL = "kap12_training.tex"

# Satzanweisungen am Anfang der Kästen (\raggedright\leftskip=6mm…) und Symbole (\faCheck).
_SATZ = re.compile(r"\\(raggedright|selectfont|leftskip=\S+|linespread\{[^}]*\}|fa[A-Za-z]+)\\?\s?")


class _Text:
    """Wandelt LaTeX in Klartext und sammelt die Befunde dabei."""

    def __init__(self, fundstelle: str) -> None:
        self.fundstelle = fundstelle
        self.befunde: list[Befund] = []

    def __call__(self, latex: str) -> str:
        umwandlung = wandle_text(_SATZ.sub("", latex), self.fundstelle)
        self.befunde.extend(umwandlung.befunde)
        return " ".join(als_klartext(umwandlung.teile).split())


def _gruppen(latex: str, start: int, anzahl: int) -> tuple[list[str], int]:
    """Liest ``anzahl`` Klammergruppen ab ``start``."""
    gruppen: list[str] = []
    position = start
    for _ in range(anzahl):
        inhalt, position = lies_gruppe(latex, position)
        gruppen.append(inhalt)
    return gruppen, position


def _knotentexte(latex: str, merkmal: str) -> list[str]:
    """Inhalte aller TikZ-Knoten, deren Optionen ``merkmal`` enthalten (Text nach „at (…)“)."""
    texte: list[str] = []
    for treffer in re.finditer(re.escape(merkmal), latex):
        nach_at = latex.index(" at ", treffer.end())
        inhalt, _ = lies_gruppe(latex, latex.index("{", nach_at))
        texte.append(inhalt)
    return texte


def _titel_und_text(latex: str, text: _Text) -> dict[str, str]:
    """Erster fetter Teil als Titel, der Rest als Text: „Stellung erfassen.“ / „Was hat …“."""
    rumpf = _SATZ.sub("", latex)
    if rumpf.startswith("\\parbox"):
        (_, rumpf), _ = _gruppen(rumpf, len("\\parbox"), 2)
        rumpf = _SATZ.sub("", rumpf).strip()
    anfang = rumpf.index("\\textbf") + len("\\textbf")
    titel, ende = lies_gruppe(rumpf, anfang)
    return {"titel": text(titel), "text": text(rumpf[ende:])}


def _schritte(latex: str, text: _Text) -> list[dict[str, Any]]:
    """Die vier Schritte (\\kvschritt{Name}{Lage}{Nummer}{Text}) in Buchreihenfolge."""
    schritte: list[dict[str, Any]] = []
    for treffer in re.finditer(r"\\kvschritt\{", latex):
        (_, _, nummer, inhalt), _ = _gruppen(latex, treffer.end() - 1, 4)
        schritte.append({"nummer": int(nummer), **_titel_und_text(inhalt, text)})
    return schritte


def _phasen(latex: str, text: _Text) -> list[dict[str, Any]]:
    """Die drei Partiephasen (\\kvphase{Name}{x}{Kopf}{Inhalt}) mit ihren Punkten."""
    phasen: list[dict[str, Any]] = []
    for treffer in re.finditer(r"\\kvphase\{", latex):
        (_, _, kopf, inhalt), _ = _gruppen(latex, treffer.end() - 1, 4)
        wann, nach_wann = lies_gruppe(inhalt, inhalt.index("{"))
        abschnitte = []
        for teil in re.split(r"\\kvzwischen", inhalt[nach_wann:])[1:]:
            ueberschrift, rest = lies_gruppe(teil, 0)
            punkte = [text(punkt) for punkt in teil[rest:].split("\\drpunkt") if punkt.strip()]
            abschnitte.append({"titel": text(ueberschrift), "punkte": punkte})
        phasen.append({"name": text(kopf), "wann": text(wann), "abschnitte": abschnitte})
    return phasen


def lies_denkroutine(quelle: Quelldatei) -> tuple[dict[str, Any], list[Befund]]:
    """Liest die Kopiervorlage: zwei Karten, Schritte, Sicherheitsblick, Phasen.

    Beispiel aus dem Buch: Schritt 1 „Stellung erfassen.“, Sicherheitsblick „Steht mein König
    danach sicher? …“, Phase „Eröffnung“ mit „Ruhiger Zug mit“ und „Achte besonders auf“.
    Sonderfälle: Fehlt ein Teil oder ist eine Klammer offen, gibt es einen Fehler-Befund und die
    Denkroutine bleibt leer, statt halb gefüllt in die App zu gehen.
    """
    text = _Text(quelle.name)
    latex = quelle.text
    try:
        karten = [text(titel) for titel in _knotentexte(latex, r"font=\sffamily\bfseries\Large")]
        daten = {
            "titel": karten[0],
            "schritte": _schritte(latex, text),
            "sicherheitsblick": _titel_und_text(_knotentexte(latex, "dr/sicher")[0], text),
            "zurueck": text(_knotentexte(latex, "text=fallenrot, anchor=north]")[0]),
            "abschluss": text(_knotentexte(latex, "dr/ziehen")[0]),
            "phasenTitel": karten[1],
            "phasen": _phasen(latex, text),
            "zuerst": text(_knotentexte(latex, "text=chessnavy, align=center]")[0]),
        }
    except (LatexFehler, ValueError, IndexError) as fehler:
        befund = Befund(Schwere.FEHLER, "denkroutine", f"Kopiervorlage nicht lesbar: {fehler}", quelle.name)
        return {}, [befund]
    return daten, text.befunde


def lies_checkliste(quelle: Quelldatei) -> tuple[dict[str, Any], list[Befund]]:
    """Liest Tabelle „Gesamt-Checkliste“ (tab:checkliste) aus Kapitel 12.

    Ausgabe: Spaltentitel, Zeilen mit Kapitel, Kernfrage, Werkzeug, Fehlerart, Bildunterschrift.
    Beispiel: Zeile 1 „Was passiert jetzt?“ → „Schach-Röntgen-Regel …“ → „Schach oder Schlag übersehen“.
    """
    text = _Text(quelle.name)
    latex = quelle.text
    try:
        ende = latex.index("\\label{tab:checkliste}")
        anfang = latex.rindex("\\begin{tabular}", 0, ende)
        tabelle = latex[anfang : latex.index("\\end{tabular}", anfang)]
        kopf = tabelle[tabelle.index("\\toprule") + len("\\toprule") : tabelle.index("\\midrule")]
        rumpf = tabelle[tabelle.index("\\midrule") + len("\\midrule") : tabelle.index("\\bottomrule")]
        unterschrift, _ = lies_gruppe(latex, latex.rindex("\\caption", 0, ende) + len("\\caption"))
    except (LatexFehler, ValueError) as fehler:
        befund = Befund(Schwere.FEHLER, "checkliste", f"Tabelle nicht lesbar: {fehler}", quelle.name)
        return {}, [befund]
    zeilen = []
    for zeile in rumpf.split("\\\\"):
        zellen = [text(zelle) for zelle in zeile.split("&")]
        if len(zellen) == 4 and zellen[0].isdigit():
            kapitel, kernfrage, werkzeug, fehlerart = zellen
            zeilen.append(
                {
                    "kapitel": int(kapitel),
                    "kernfrage": kernfrage,
                    "werkzeug": werkzeug,
                    "fehlerart": fehlerart,
                }
            )
    spalten = [text(zelle) for zelle in kopf.replace("\\\\", "").split("&")]
    daten = {"titel": text(unterschrift).rstrip("."), "spalten": spalten, "zeilen": zeilen}
    return daten, text.befunde


def baue_nachschlagen(quellen: list[Quelldatei]) -> tuple[dict[str, Any], list[Befund]]:
    """``nachschlagen.json``: Denkroutine, Gesamt-Checkliste und Lernziele je Kapitel.

    Fehlende Quellen ergeben leere Teile (Testbuch). Die Lernziele bilden die Abhakliste der
    Gesamt-Checkliste in der App (lernziele.py).
    """
    lernziele, befunde = baue_lernziele(quellen)
    daten: dict[str, Any] = {
        "schemaVersion": 1,
        "denkroutine": None,
        "checkliste": None,
        "lernziele": lernziele,
    }
    nach_name = {quelle.name: quelle for quelle in quellen}
    if KOPIERVORLAGE in nach_name:
        denkroutine, neue = lies_denkroutine(nach_name[KOPIERVORLAGE])
        daten["denkroutine"] = denkroutine or None
        befunde.extend(neue)
    if TRAININGSKAPITEL in nach_name:
        checkliste, neue = lies_checkliste(nach_name[TRAININGSKAPITEL])
        daten["checkliste"] = checkliste or None
        befunde.extend(neue)
    return daten, befunde

"""Erzeugt den Figurensatz „Gold“ der App aus dem freien Satz Cburnett.

Wozu diese Datei da ist:
    Der Figurensatz „Gold“ ist ein freischaltbares Extra (Gamifizierung P7, Entscheidung E8):
    Wer die Stufe 5 erreicht, darf ihn wählen. Einen freien goldenen Satz gibt es nicht. Deshalb
    färbt dieses Skript die Figuren von Cburnett (GPLv2 oder später) um: Weiße Figuren bekommen
    einen goldenen Verlauf mit dunkelbrauner Kontur, schwarze Figuren das Navy der App mit
    goldener Kontur und goldenen Innenlinien, passend zum Brett „Nacht und Gold“. Die Formen
    bleiben unverändert.

Rolle im Gesamtbild:
    Ein einmaliger Schritt der Pipeline wie ``holz_maserung.py``. Er muss nur erneut laufen, wenn
    sich die Farben ändern sollen. Das Ergebnis liegt in ``saetze/gold`` und als Kopie in
    ``app/public/figuren/gold``.

Lizenz:
    Die Bearbeitung steht unter der Lizenz des Originals (``saetze/LIZENZEN.md``).

Aufruf:
    python -m pipeline.figuren.gold_umfaerben
"""

from __future__ import annotations

import re
from pathlib import Path

HIER = Path(__file__).parent
SAETZE = HIER / "saetze"
QUELLE = SAETZE / "klassisch-cburnett"
NAME = "gold"
APP_ZIEL = HIER.parent.parent / "app" / "public" / "figuren" / NAME

FARBEN = ("w", "b")
FIGUREN = ("K", "Q", "R", "B", "N", "P")

# Kennung des goldenen Verlaufs der weißen Figuren.
VERLAUF = "gGold"
# Goldener Verlauf von hell oben nach dunkel unten (Gold der App #D9A514 in der Mitte).
VERLAUF_SVG = (
    f'<defs><linearGradient id="{VERLAUF}" x1="0" y1="0" x2="0" y2="1">'
    '<stop offset="0" stop-color="#FBE38A"/>'
    '<stop offset="0.55" stop-color="#D9A514"/>'
    '<stop offset="1" stop-color="#A8770A"/>'
    "</linearGradient></defs>"
)

# Farben des Originals → neue Farben, getrennt nach Füllung und Kontur.
WEISS = {
    "fill": {"#fff": f"url(#{VERLAUF})", "#000": "#4A3000"},
    "stroke": {"#000": "#4A3000"},
}
SCHWARZ = {
    "fill": {"#000": "#1B2A44", "#ececec": "#F2D27A"},
    "stroke": {"#000": "#D9A514", "#ececec": "#F2D27A"},
}


def farben_ersetzen(svg: str, zuordnung: dict[str, dict[str, str]]) -> str:
    """Ersetzt jede Füll- und Konturfarbe nach der Zuordnung; andere Farben bleiben."""

    def ersetze(treffer: re.Match[str]) -> str:
        art, farbe = treffer.group(1), treffer.group(2).lower()
        neu = zuordnung[art].get(farbe)
        return f'{art}="{neu}"' if neu else treffer.group(0)

    return re.sub(r'(fill|stroke)="(#[0-9a-fA-F]{3,6})"', ersetze, svg)


def goldfigur(svg: str, farbe: str) -> str:
    """Macht aus einer Cburnett-Figur die Goldfigur (``farbe`` ist ``w`` oder ``b``)."""
    if farbe == "b":
        return farben_ersetzen(svg, SCHWARZ)
    svg = farben_ersetzen(svg, WEISS)
    return re.sub(r"(<svg[^>]*>)", r"\1" + VERLAUF_SVG, svg, count=1)


def erzeuge(ziel: Path) -> None:
    """Schreibt die 12 Goldfiguren nach ``ziel``."""
    ziel.mkdir(parents=True, exist_ok=True)
    for farbe in FARBEN:
        for figur in FIGUREN:
            original = (QUELLE / f"{farbe}{figur}.svg").read_text(encoding="utf-8")
            (ziel / f"{farbe}{figur}.svg").write_text(goldfigur(original, farbe), encoding="utf-8")


def main() -> None:
    """Erzeugt den Satz in der Pipeline und kopiert ihn in die App."""
    for ziel in (SAETZE / NAME, APP_ZIEL):
        erzeuge(ziel)
        print(f"{ziel}: 12 Figuren geschrieben")


if __name__ == "__main__":
    main()

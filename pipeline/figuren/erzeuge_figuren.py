"""Wandelt die Figuren der Schrift SkakNew-Diagram in Vektorpfade für die App um.

Wozu diese Datei da ist:
    Das Buch setzt seine Diagramme mit der Schachschrift SkakNew von Ulrich Dirr
    (preamble.tex: ``boardfontencoding=LSBC3``). Damit die App genau dieselben Figuren
    zeigt, liest dieses Skript die Schriftdatei einmalig aus und schreibt die Umrisse
    als SVG-Pfade in eine TypeScript-Datei, die das Brett der App zeichnet.

Rolle im Gesamtbild:
    Ein einmaliger Schritt der Pipeline (Konzept Abschnitt 3, ``public/figuren``).
    Er muss nur erneut laufen, wenn sich die Schrift oder das Ausgabeformat ändert.

Aufbau der Schrift (geprüft am 13.10.2026 an einer Glyphentafel):
    K Q R B N P   weiße Figuren: Umriss und Innenlinien, das Innere ist offen
    k q r b n p   schwarze Figuren: gefüllt, Innenlinien als Aussparungen
    1 bis 6       „Masken“: ein volles Feld, aus dem der Schattenriss der Figur
                  ausgespart ist (1 König, 2 Springer, 3 Turm, 4 Läufer, 5 Dame, 6 Bauer)

    Das Buch färbt so (preamble.tex, ``\\setchessboard``): Figur in chessnavy, Maske
    in chesscream. Der Schattenriss unter der Figur ist also cremefarben, darüber
    liegt die navyfarbene Figur. Genau das bildet die App nach.

Lizenz:
    SkakNew steht unter der LaTeX Project Public License 1.2 oder neuer
    (``quelle/SkakNew.tex``, Zeile 25). Die erzeugten Pfade sind eine abgeleitete,
    umgewandelte Fassung und werden in der App mit Quelle und Lizenz genannt
    (``docs/LIZENZEN.md``).

Aufruf:
    python -m pipeline.figuren.erzeuge_figuren
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

# Pfade relativ zum Hauptordner des Repositorys.
HAUPTORDNER = Path(__file__).resolve().parents[2]
SCHRIFTDATEI = HAUPTORDNER / "pipeline" / "figuren" / "quelle" / "SkakNew-Diagram.otf"
ZIELDATEI = HAUPTORDNER / "app" / "src" / "ui" / "brett" / "figurenpfade.generiert.ts"

# Die Schrift arbeitet mit 1000 Einheiten je Feld (Em-Quadrat), y zeigt nach oben.
# SVG zählt y nach unten. Die Transformation spiegelt deshalb an der Waagerechten.
EINHEITEN_JE_FELD = 1000
SPIEGELUNG = (1, 0, 0, -1, 0, EINHEITEN_JE_FELD)

# Zuordnung FEN-Buchstabe → Zeichen der Schrift für die Maske (siehe Dateikopf).
MASKE_JE_FIGUR = {"k": "one", "n": "two", "r": "three", "b": "four", "q": "five", "p": "six"}

# Eine Kontur gilt als Rand des vollen Feldes, wenn sie fast das ganze Feld umschließt.
# Die Masken reichen von 0 bis 1000; 20 Einheiten Spielraum fangen Rundungen ab.
TOLERANZ_FELDRAND = 20


@dataclass(frozen=True)
class Figurenpfade:
    """Die beiden Pfade, aus denen eine Figur auf dem Brett besteht."""

    schattenriss: str  # wird cremefarben gefüllt (Maske des Buches)
    figur: str  # wird navyfarben gefüllt (eigentliche Figur)


def _konturen(glyphensatz, glyphenname: str) -> list[list[tuple]]:
    """Zerlegt ein Zeichen in einzelne geschlossene Konturen.

    Warum: Die Masken bestehen aus dem Feldrand und dem ausgesparten Schattenriss.
    Um nur den Schattenriss zu behalten, müssen die Konturen einzeln vorliegen.
    """
    aufnahme = RecordingPen()
    glyphensatz[glyphenname].draw(aufnahme)
    konturen: list[list[tuple]] = []
    aktuelle: list[tuple] = []
    for befehl in aufnahme.value:
        aktuelle.append(befehl)
        if befehl[0] in ("closePath", "endPath"):
            konturen.append(aktuelle)
            aktuelle = []
    if aktuelle:
        konturen.append(aktuelle)
    return konturen


def _ist_feldrand(kontur: list[tuple]) -> bool:
    """Erkennt die Kontur, die das ganze Feld umschließt (Rand der Maske)."""
    punkte = [punkt for _, argumente in kontur for punkt in argumente]
    if not punkte:
        return False
    xs = [x for x, _ in punkte]
    ys = [y for _, y in punkte]
    breite = max(xs) - min(xs)
    hoehe = max(ys) - min(ys)
    grenze = EINHEITEN_JE_FELD - TOLERANZ_FELDRAND
    return breite >= grenze and hoehe >= grenze


def _als_svg_pfad(glyphensatz, konturen: list[list[tuple]]) -> str:
    """Schreibt Konturen als SVG-Pfad in Bildschirmkoordinaten (y nach unten)."""
    stift = SVGPathPen(glyphensatz, ntos=lambda zahl: str(round(zahl)))
    gespiegelt = TransformPen(stift, SPIEGELUNG)
    for kontur in konturen:
        for befehl, argumente in kontur:
            getattr(gespiegelt, befehl)(*argumente)
    return stift.getCommands()


def lies_figuren(schriftdatei: Path = SCHRIFTDATEI) -> dict[str, Figurenpfade]:
    """Liest alle zwölf Figuren aus der Schrift.

    Eingabe: Pfad zur Datei SkakNew-Diagram.otf.
    Ausgabe: Wörterbuch mit FEN-Buchstaben als Schlüssel („K“ weißer König,
    „k“ schwarzer König) und den beiden Pfaden je Figur.
    Beispiel: ``lies_figuren()["N"]`` liefert den weißen Springer, wie er in
    Abb. 1.26 auf f3 steht.
    """
    schrift = TTFont(str(schriftdatei))
    glyphensatz = schrift.getGlyphSet()
    zeichentabelle = schrift.getBestCmap()
    ergebnis: dict[str, Figurenpfade] = {}
    for kleinbuchstabe, maskenname in MASKE_JE_FIGUR.items():
        # Schattenriss: alle Konturen der Maske außer dem Feldrand.
        maskenkonturen = [
            kontur for kontur in _konturen(glyphensatz, maskenname) if not _ist_feldrand(kontur)
        ]
        schattenriss = _als_svg_pfad(glyphensatz, maskenkonturen)
        for buchstabe in (kleinbuchstabe.upper(), kleinbuchstabe):
            glyphenname = zeichentabelle[ord(buchstabe)]
            figur = _als_svg_pfad(glyphensatz, _konturen(glyphensatz, glyphenname))
            ergebnis[buchstabe] = Figurenpfade(schattenriss=schattenriss, figur=figur)
    return ergebnis


def schreibe_typescript(figuren: dict[str, Figurenpfade], zieldatei: Path = ZIELDATEI) -> None:
    """Schreibt die Pfade als TypeScript-Modul für das Brett der App."""
    zeilen = [
        "// ERZEUGTE DATEI – nicht von Hand bearbeiten.",
        "// Quelle: pipeline/figuren/erzeuge_figuren.py aus SkakNew-Diagram.otf",
        "// (Ulrich Dirr, LaTeX Project Public License 1.2 oder neuer; umgewandelte Fassung).",
        "// Koordinaten: 1000 Einheiten je Feld, y nach unten.",
        "",
        "/** Die beiden Pfade einer Figur: Schattenriss (Creme) und Figur (Navy). */",
        "export interface Figurenpfad {",
        "  readonly schattenriss: string;",
        "  readonly figur: string;",
        "}",
        "",
        "/** Einheiten je Feld in den Pfaden. Das Brett skaliert damit auf seine Feldgröße. */",
        f"export const EINHEITEN_JE_FELD = {EINHEITEN_JE_FELD};",
        "",
        "/** Figuren nach FEN-Buchstaben: K D T L S B heißen hier K Q R B N P. */",
        "export const FIGURENPFADE: Readonly<Record<string, Figurenpfad>> = {",
    ]
    for buchstabe in "KQRBNPkqrbnp":
        pfade = figuren[buchstabe]
        zeilen.append(f"  {buchstabe}: {{")
        zeilen.append(f'    schattenriss: "{pfade.schattenriss}",')
        zeilen.append(f'    figur: "{pfade.figur}",')
        zeilen.append("  },")
    zeilen.append("};")
    zieldatei.parent.mkdir(parents=True, exist_ok=True)
    zieldatei.write_text("\n".join(zeilen) + "\n", encoding="utf-8")


if __name__ == "__main__":
    schreibe_typescript(lies_figuren())
    print(f"geschrieben: {ZIELDATEI.relative_to(HAUPTORDNER)}")

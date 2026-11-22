"""Geschlechtsneutral über {held} sprechen (Wunsch des Autors, 22.11.2026: Heldin wählbar).

Warum: Seit dem 22.11.2026 wählt der Leser beim Spielbeginn Held oder Heldin (app/src/abenteuer/
regeln/heldfigur.ts). Die Wahl ändert nur das Bild; die Texte bleiben gleich und müssen deshalb
für beide passen (Story-Bibel 5.2: Name wählbar, keine Substantive mit Geschlecht für {held},
Tagebuch in der Ich-Form). Dieses Werkzeug findet Stellen, die das verletzen:

1. ein Pronomen mit Geschlecht (er, sie, ihn, ihm, sein…, ihr…) im selben Satz nach {held};
2. eine Anrede oder Bezeichnung mit Geschlecht: „mein Junge“, „meine Tochter“, „junger Mann“,
   „Kleiner,“, „der Neue“, „Heldin“ und ähnliche, als Anrede am Satzanfang oder nach einem Komma.

Geprüft werden die gesprochenen Zeilen aller Ink-Dateien (ohne Kommentare und Tags) und die
Spieltexte (inhalte/abenteuer/texte/de.json). Ausnahmen stehen mit Grund in GEPRUEFT (Datei und
Textanfang) und SPRECHER_ANREDE (Figuren, die alle so nennen). Ein Dauertest verlangt 0 Befunde.

Aufruf: ``python -m pipeline.abenteuer.heldneutral`` (Befunde, sonst „0 Befunde“).
"""

import json
import re
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parents[2]
DIALOGE = WURZEL / "inhalte" / "abenteuer" / "dialoge" / "de"
SPIELTEXTE = WURZEL / "inhalte" / "abenteuer" / "texte" / "de.json"

PRONOMEN_NACH_HELD = re.compile(r"\{held\}[^.!?„“\"]*?\b(er|sie|ihn|ihm|sein\w*|ihr\w*)\b")
ANREDE = re.compile(
    r"(?:^|[„\"“.!?,:–]\s*)((?:mein|meine|lieber|liebe|kleiner|kleine)\s+)?"
    r"(Junge|Mädchen|Sohn|Tochter|Kleiner|Kleine|Großer|Kumpel|Bursche|Mädel|Jungchen|Held|Heldin"
    r"|junger Mann|junge Dame|Süßer|Süße)\s*[,!?.…]"
)
BEZEICHNUNG = re.compile(r"\b(der Neue|die Neue|den Neuen|dem Neuen|unser Held|unsere Heldin|Heldin)\b")

# Sprecher, die alle Menschen so anreden (Story-Bibel: Big Joe „nennt alle Kumpel“, Mr. Kerrigan
# wie er). „Kumpel“ ist umgangssprachlich für jedes Geschlecht gebräuchlich („sie ist ein Kumpel“).
SPRECHER_ANREDE = {("bigJoe", "Kumpel"), ("kerrigan", "Kumpel")}

# (Datei, Anfang des Textes): Grund, warum die Stelle nicht den Helden meint oder neutral bleibt.
GEPRUEFT: dict[tuple[str, str], str] = {
    ("maple-falls-dachboden.ink", "Auf Mrs. Calloways Veranda verliert sie"): (
        "Epilog: „den Neuen“ sind neue Schüler von Carla (Mehrzahl), nicht der Held"
    ),
}


def _sprecher(zeile: str) -> str:
    treffer = re.search(r"#sprecher:(\w+)", zeile)
    return treffer.group(1) if treffer else ""


def pruefe_text(text: str, sprecher: str = "") -> list[str]:
    """Stellen mit Geschlecht für {held} in einem Text; leer, wenn er neutral ist.

    Beispiel: pruefe_text("{held} nickt, er ist bereit.") → ["Pronomen nach {held}: er"];
    pruefe_text("Komm her, mein Junge.") → ["Anrede: mein Junge"]; pruefe_text("Ein Junge, Finn,
    kniet am Kai.") → [] (ein anderer Junge, kein Satzanfang).
    """
    befunde = []
    for t in PRONOMEN_NACH_HELD.finditer(text):
        befunde.append(f"Pronomen nach {{held}}: {t.group(1)}")
    for t in ANREDE.finditer(text):
        wort = t.group(2)
        if (sprecher, wort) not in SPRECHER_ANREDE:
            befunde.append(f"Anrede: {(t.group(1) or '') + wort}")
    for t in BEZEICHNUNG.finditer(text):
        befunde.append(f"Bezeichnung: {t.group(1)}")
    return befunde


def _geprueft(datei: str, text: str) -> bool:
    return any(datei == d and text.lstrip("- ").startswith(a) for d, a in GEPRUEFT)


def ink_befunde(ordner: Path = DIALOGE) -> list[str]:
    """Befunde aus den gesprochenen Zeilen der Ink-Dateien."""
    ergebnis = []
    for datei in sorted(ordner.glob("*.ink")):
        for nummer, zeile in enumerate(datei.read_text(encoding="utf-8").splitlines(), 1):
            text = zeile.split("//")[0].split("#")[0].strip()
            if not text or text.startswith(("~", "VAR", "CONST", "INCLUDE", "===", "=", "->")):
                continue
            if _geprueft(datei.name, text):
                continue
            for befund in pruefe_text(text, _sprecher(zeile)):
                ergebnis.append(f"{datei.name}:{nummer}: {befund}: {text[:90]}")
    return ergebnis


def spieltext_befunde(pfad: Path = SPIELTEXTE) -> list[str]:
    """Befunde aus den Spieltexten; der Sprecher steht im Schlüssel (tisch.figur.<ort>.<figur>…)."""
    ergebnis = []
    for schluessel, text in json.loads(pfad.read_text(encoding="utf-8")).items():
        if not isinstance(text, str) or _geprueft(pfad.name, text):
            continue
        teile = schluessel.split(".")
        sprecher = next((t for t in teile if (t, "Kumpel") in SPRECHER_ANREDE), "")
        for befund in pruefe_text(text, sprecher):
            ergebnis.append(f"{pfad.name}:{schluessel}: {befund}: {text[:90]}")
    return ergebnis


def befunde() -> list[str]:
    """Alle Befunde aus Ink und Spieltexten."""
    return ink_befunde() + spieltext_befunde()


def main() -> int:
    gefunden = befunde()
    for zeile in gefunden:
        print(zeile)
    print(f"{len(gefunden)} Befunde")
    return 1 if gefunden else 0


if __name__ == "__main__":
    sys.exit(main())

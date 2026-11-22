"""Rivale Victor oder Rivalin Victoria: kein festes „Victor“ mehr in den Texten (22.11.2026).

Warum: Seit dem 22.11.2026 wählt der Leser beim Spielbeginn Rivale Victor oder Rivalin Victoria
(app/src/abenteuer/regeln/rivalform.ts). Die Texte schreiben dafür Platzhalter, die die App je nach
Wahl füllt: {rivale} für den Namen, {rv_er}, {rv_ihn}, {rv_ihm}, {rv_sein} (mit Endung:
{rv_sein}e = seine/ihre) und groß {rv_Er}, {rv_Ihn}, {rv_Ihm}, {rv_Sein}; alles andere als
Ink-Bedingung {rivalin:die Rivalin|der Rivale}. Die Wörter stehen in
inhalte/abenteuer/rivalformen.json. Dieses Werkzeug findet, was dabei durchrutscht:

1. ein festes „Victor“ oder „Victors“ im gesprochenen Text (Ink ohne Kommentare, Tags und Logik;
   Spieltexte inhalte/abenteuer/texte/de.json);
2. ein männliches Pronomen (er, ihn, ihm, sein…) im selben Satz nach {rivale};
3. ein Wort mit Geschlecht (Junge, Sohn, der Rivale) in einer Zeile mit {rivale} ohne {rivalin:…};
4. eine Ink-Datei, die die Platzhalter nutzt, ohne alle Variablen zu erklären (VAR rivale … ).

Pronomen, die in Victors Szenen andere meinen (Ambrose, Graham Hale, der Vorfahr Hale), findet
das Werkzeug bewusst nicht: Sie wurden beim Umstellen von Hand geprüft (Liste in
buch/arbeit/rivalin/umformuliert.md). Ausnahmen stehen mit Grund in GEPRUEFT. Dauertest: 0 Befunde.

Aufruf: ``python -m pipeline.abenteuer.rivalneutral`` (Befunde, sonst „0 Befunde“).
"""

import json
import re
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parents[2]
DIALOGE = WURZEL / "inhalte" / "abenteuer" / "dialoge" / "de"
SPIELTEXTE = WURZEL / "inhalte" / "abenteuer" / "texte" / "de.json"
FORMEN = WURZEL / "inhalte" / "abenteuer" / "rivalformen.json"

NAME = re.compile(r"\bVictors?\b")
PRONOMEN_NACH = re.compile(r"\{rivale\}[^.!?„“\"]*?\b(er|ihn|ihm|sein\w*)\b")
GESCHLECHT = re.compile(r"\b(Junge|Jungen|Sohn|Sohnes|Rivale|Rivalen|Bursche)\b")
PLATZHALTER = re.compile(r"\{(rivale|rv_\w+)\}|\{rivalin:")
LOGIK = ("~", "VAR", "CONST", "EXTERNAL", "INCLUDE", "===", "->")

# (Datei, Anfang des Textes): Grund, warum die Stelle bleibt.
GEPRUEFT: dict[tuple[str, str], str] = {}


def variablen() -> list[str]:
    """Die Namen aller Platzhalter: rivalin und die Schlüssel aus rivalformen.json."""
    formen = json.loads(FORMEN.read_text(encoding="utf-8"))["de"]["rivale"]
    return ["rivalin", *formen]


def pruefe_text(text: str) -> list[str]:
    """Befunde in einem Text ohne Tags.

    Beispiel: pruefe_text("Victor nickt.") → ["festes Victor"]; pruefe_text("{rivale} nickt, er
    ist bereit.") → ["Pronomen nach {rivale}: er"]; pruefe_text("{rivale} und {rv_sein} Vater") → [].
    """
    befunde = [f"festes {t.group(0)}" for t in NAME.finditer(text)]
    befunde += [f"Pronomen nach {{rivale}}: {t.group(1)}" for t in PRONOMEN_NACH.finditer(text)]
    if "{rivale}" in text and "{rivalin:" not in text:
        befunde += [f"Wort mit Geschlecht: {t.group(1)}" for t in GESCHLECHT.finditer(text)]
    return befunde


def _geprueft(datei: str, text: str) -> bool:
    return any(datei == d and text.lstrip("- *").startswith(a) for d, a in GEPRUEFT)


def ink_befunde(ordner: Path = DIALOGE) -> list[str]:
    """Befunde aus den Ink-Dateien: Texte und fehlende Variablen."""
    namen = variablen()
    ergebnis = []
    for datei in sorted(ordner.glob("*.ink")):
        inhalt = datei.read_text(encoding="utf-8")
        if PLATZHALTER.search(inhalt):
            fehlend = [n for n in namen if not re.search(rf"^VAR {n} =", inhalt, re.M)]
            if fehlend:
                ergebnis.append(f"{datei.name}: Variablen fehlen: {', '.join(fehlend)}")
        for nummer, zeile in enumerate(inhalt.splitlines(), 1):
            text = zeile.split("//")[0].split("#")[0].strip()
            if not text or text.startswith(LOGIK) or _geprueft(datei.name, text):
                continue
            ohne_logik = re.sub(r"\{[^{}:|]*(==|!=|>=|<=|\band\b|\bor\b|\bnot\b)[^{}:|]*:", "{", text)
            for befund in pruefe_text(ohne_logik):
                ergebnis.append(f"{datei.name}:{nummer}: {befund}: {text[:90]}")
    return ergebnis


def spieltext_befunde(pfad: Path = SPIELTEXTE) -> list[str]:
    """Befunde aus den Spieltexten (Werte, nicht Schlüssel)."""
    ergebnis = []
    for schluessel, text in json.loads(pfad.read_text(encoding="utf-8")).items():
        if not isinstance(text, str) or _geprueft(pfad.name, text):
            continue
        ergebnis += [f"{pfad.name}:{schluessel}: {b}: {text[:90]}" for b in pruefe_text(text)]
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

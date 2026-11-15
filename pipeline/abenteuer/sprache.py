"""Sprachprüfung der Spieltexte des Schach-Abenteuers: Zeichensetzung, Anrede, Namen, Tippfehler.

Warum: Die Dialoge (inhalte/abenteuer/dialoge/de/*.ink) und Texte (inhalte/abenteuer/texte/de.json)
entstehen in vielen Runden und von mehreren Helfern. Damit Anführungszeichen, Gedankenstriche,
Apostrophe, die Anrede „du“ und die Schreibweise der Namen überall gleich bleiben, prüft dieses
Werkzeug sie wiederholbar (Auftrag des Hauptchats, 15.11.2026). Stil und Inhalt prüft es nicht.

Regeln (je Fund Ort und Ausschnitt):

- ``anfuehrung``: keine geraden Anführungszeichen ("), und „ und “ sowie ‚ und ‘ paarweise.
- ``strich``: Gedankenstrich als – mit Leerzeichen, nicht als - oder --.
- ``auslassung``: … statt drei Punkten.
- ``leerzeichen``: keine doppelten Leerzeichen, keins vor Satzzeichen.
- ``apostroph``: Apostroph einheitlich als ' (die Mehrheit der Texte, 15.11.2026), nicht ’.
- ``anrede``: „du“, „dich“, „dir“, „dein…“ klein, auch mitten im Satz (Story-Bibel 5.2).
- ``doppelwort``: dasselbe Wort zweimal hintereinander.
- ``name``: Figurennamen aus texte/de.json (figur.*.name) nur in einer Schreibweise, auch bei
  Akzenten (Tomás, nicht Tomas).

Mit ``--woerterbuch`` meldet das Werkzeug zusätzlich seltene Wörter, die das deutsche Wörterbuch von
pyspellchecker (MIT, per pip) nicht kennt, als Hinweis zum Durchsehen, nicht als Fehler: Komposita
und Namen kennt das Wörterbuch oft nicht.

Aufruf: ``python -m pipeline.abenteuer.sprache [--woerterbuch]``; Rückgabe 1, wenn es Funde gibt.
"""

import argparse
import collections
import json
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path

HAUPTORDNER = Path(__file__).resolve().parents[2]
DIALOGE = HAUPTORDNER / "inhalte" / "abenteuer" / "dialoge" / "de"
TEXTE = HAUPTORDNER / "inhalte" / "abenteuer" / "texte" / "de.json"
# Platzhalter für den Namen des Helden, damit Sätze mit {held} wie echte Sätze aussehen.
HELDENNAME = "Robin"
# Platzhalter für eingesetzte Werte ({punkte}, {ligapunkte()}): ein Zeichen, das keine Regel trifft.
WERT = "◇"
# Zeilen der Ink-Dateien, die keinen Text zeigen (Logik, Kopf, Variablen).
OHNE_TEXT = ("//", "VAR ", "CONST ", "EXTERNAL ", "INCLUDE ", "===", "= ", "~", "->", "<-")
# Bedingungen vor dem Text: „{x == "sieg": …“, „{not y: …“, „- else: …“, „- "remis": …“.
OPERAND = r"(not\s+)?(\"[^\"]*\"|[\w.()]+)"
BEDINGUNG = re.compile(rf"\{{\s*{OPERAND}(\s*(==|!=|>=|<=|<|>|&&|\|\||\band\b|\bor\b)\s*{OPERAND})*\s*:")
FALL = re.compile(
    r'^\s*-\s*("[^"]*"|else|[\w.()<>=!"\s]*?(==|!=|>=|<=|<|>|\bnot\b|\band\b|\bor\b)[^:]*'
    r"|[\w.()]+)\s*:(\s|$)"
)
# Tags am Zeilenende oder vor | und } (sprecher, stimmung, musik, …).
TAG = re.compile(r"\s*#\s*\w+(?::[^\s#|}]*)?")
UMLEITUNG = re.compile(r"->\s*[\w.]*(\s*->)?")
FUNKTION = re.compile(r"\b\w+\([^()]*\)")
WAHLBEDINGUNG = re.compile(r"^\{[^{}]*\}\s*")
# Für die Anrede: ein großes Du nach einem Kleinbuchstaben oder Komma ist mitten im Satz.
ANREDE = re.compile(r"(?<=[a-zäöüß,]) (Du|Dich|Dir|Dein|Deine|Deinen|Deinem|Deiner|Deines)\b")
DOPPELWORT = re.compile(r"\b(\w+) \1\b", re.I)
# Wiederholungen, die so gemeint sind (Satz im Ausschnitt): „stellt sie sie“, „der Turm Turm“.
DOPPELWORT_ERLAUBT = ("sie sie", "turm turm")
# Schlüssel mit fremdsprachigen Namen und Werktiteln (Abspann): keine deutschen Regeln.
SCHLUESSEL_OHNE_PRUEFUNG = ("abspann.mitwirkende",)


@dataclass(frozen=True)
class Fund:
    """Ein Verstoß: Regel, Ort (Datei:Zeile oder Schlüssel) und der betroffene Text."""

    regel: str
    ort: str
    text: str

    def __str__(self) -> str:
        return f"{self.regel:12} {self.ort}: {self.text[:140]}"


def ink_text(zeile: str) -> list[str]:
    """Die sichtbaren Texte einer Ink-Zeile, ohne Logik, Tags und Umleitungen; je Alternative einer.

    Beispiel: ``{teamAngekommen: Das Team. #sprecher:okafor|Ihr seid die Vorhut. #sprecher:okafor}``
    → ``["Das Team.", "Ihr seid die Vorhut."]``. Sonderfall: Kopf- und Logikzeilen → ``[]``.
    """
    s = zeile.strip()
    if not s or s.startswith(OHNE_TEXT):
        return []
    s = re.sub(r"(?<!:)//.*$", "", s)
    s = UMLEITUNG.sub("", s)
    s = FALL.sub("", s)
    s = re.sub(r"^[*+\-\s]+(\(\w+\))?\s*", "", s)
    while WAHLBEDINGUNG.match(s) and "[" in s:
        s = WAHLBEDINGUNG.sub("", s, count=1)
    s = TAG.sub("", s)
    s = BEDINGUNG.sub("", s)
    s = re.sub(r"~\s*\w+\s*=[^|}]*", "", s)
    s = FUNKTION.sub(WERT, s).replace("{held}", HELDENNAME)
    s = re.sub(r"\{\w+\}", WERT, s)
    s = re.sub(r"\{[~&!]?", "", s).replace("}", "").replace("[", "").replace("]", "")
    return [teil.strip() for teil in s.split("|") if teil.strip()]


def sammle_ink(ordner: Path = DIALOGE) -> list[tuple[str, str]]:
    """Alle sichtbaren Texte der Ink-Dateien als (Datei:Zeile, Text)."""
    texte = []
    for datei in sorted(ordner.glob("*.ink")):
        for nummer, zeile in enumerate(datei.read_text(encoding="utf-8").split("\n"), 1):
            texte += [(f"{datei.name}:{nummer}", teil) for teil in ink_text(zeile)]
    return texte


def sammle_texte(datei: Path = TEXTE) -> list[tuple[str, str]]:
    """Alle Texte aus texte/de.json als (Schlüssel, Text), Platzhalter {x} durch WERT ersetzt."""
    daten = json.loads(datei.read_text(encoding="utf-8"))
    texte = []
    for schluessel, wert in daten.items():
        if schluessel.startswith(SCHLUESSEL_OHNE_PRUEFUNG) or not isinstance(wert, str):
            continue
        texte.append((schluessel, re.sub(r"\{\w+\}", WERT, wert)))
    return texte


def pruefe_zeichen(ort: str, text: str) -> list[Fund]:
    """Anführungszeichen, Striche, Auslassung, Leerzeichen und Apostroph eines Textes.

    Beispiel: ``Er sagt "Hallo" - und geht...`` → Funde anfuehrung, strich, auslassung.
    """
    funde = []
    if '"' in text or text.count("„") != text.count("“") or text.count("‚") != text.count("‘"):
        funde.append(Fund("anfuehrung", ort, text))
    if re.search(r"\s--?\s|--", text):
        funde.append(Fund("strich", ort, text))
    if "..." in text:
        funde.append(Fund("auslassung", ort, text))
    if re.search(r"\S {2,}\S|\s[,.!?;:](\s|$)", text):
        funde.append(Fund("leerzeichen", ort, text))
    if "’" in text:
        funde.append(Fund("apostroph", ort, text))
    return funde


def pruefe_woerter(ort: str, text: str) -> list[Fund]:
    """Anrede mitten im Satz und doppelte Wörter. Beispiel: ``Ich sehe Dich.`` → anrede."""
    funde = []
    if ANREDE.search(text):
        funde.append(Fund("anrede", ort, text))
    for treffer in DOPPELWORT.finditer(text):
        if treffer.group(0).lower() not in DOPPELWORT_ERLAUBT and not treffer.group(1).isdigit():
            funde.append(Fund("doppelwort", ort, text))
    return funde


def ohne_akzente(wort: str) -> str:
    """Das Wort ohne Akzente: „Tomás“ → „Tomas“, „Pépé“ → „Pepe“."""
    zerlegt = unicodedata.normalize("NFD", wort)
    return "".join(z for z in zerlegt if unicodedata.category(z) != "Mn")


def figurennamen(datei: Path = TEXTE) -> set[str]:
    """Die Namensteile aller Figuren (figur.*.name), ab vier Buchstaben. Beispiel: „Tomás“, „Okafor“."""
    daten = json.loads(datei.read_text(encoding="utf-8"))
    namen = set()
    for schluessel, wert in daten.items():
        if re.fullmatch(r"figur\.\w+\.name", schluessel) and isinstance(wert, str):
            namen |= {teil for teil in re.findall(r"[^\W\d_][\w-]+", wert) if len(teil) >= 4}
    return namen


def pruefe_namen(texte: list[tuple[str, str]], namen: set[str]) -> list[Fund]:
    """Schreibweisen, die sich von einem Figurennamen nur in Akzenten unterscheiden.

    Beispiel: „Tomas“ bei der Figur „Tomás“. Sonderfall: Ein Name, den es so auch als eigene Figur
    gibt, ist kein Fund.
    """
    schluessel = {ohne_akzente(n): n for n in namen}
    funde = []
    for ort, text in texte:
        for wort in re.findall(r"[^\W\d_][\w]+", text):
            richtig = schluessel.get(ohne_akzente(wort))
            if richtig and wort != richtig and wort not in namen:
                funde.append(Fund("name", ort, f"{wort} statt {richtig}: {text}"))
    return funde


def pruefe_alles(
    ink: list[tuple[str, str]] | None = None, texte: list[tuple[str, str]] | None = None
) -> list[Fund]:
    """Alle Regeln über Dialoge und Texte. Ausgabe: Funde in Dateireihenfolge."""
    alle = (sammle_ink() if ink is None else ink) + (sammle_texte() if texte is None else texte)
    funde = []
    for ort, text in alle:
        funde += pruefe_zeichen(ort, text) + pruefe_woerter(ort, text)
    return funde + pruefe_namen(alle, figurennamen())


def unbekannte_woerter(texte: list[tuple[str, str]], hoechstens: int = 2) -> list[tuple[str, str]]:
    """Seltene Wörter, die das Wörterbuch von pyspellchecker nicht kennt, mit der ersten Fundstelle.

    Warum: Tippfehler stehen fast immer nur einmal da. Sonderfall: ohne pyspellchecker → Fehler
    mit Hinweis zur Installation (kein stilles Überspringen).
    """
    try:
        from spellchecker import SpellChecker
    except ImportError as fehler:
        raise SystemExit("pyspellchecker fehlt: pip install pyspellchecker") from fehler
    woerterbuch = SpellChecker(language="de", case_sensitive=False)
    zaehler: collections.Counter[str] = collections.Counter()
    erste: dict[str, str] = {}
    for ort, text in texte:
        for wort in re.findall(r"[A-Za-zÄÖÜäöüßÀ-ÿ]{3,}", text):
            zaehler[wort] += 1
            erste.setdefault(wort, ort)
    selten = [w for w, n in zaehler.items() if n <= hoechstens]
    return sorted((w, erste[w]) for w in woerterbuch.unknown(selten) if w in erste or w.lower() in erste)


def main(argumente: list[str] | None = None) -> int:
    """Befehlszeile: Funde ausgeben; mit --woerterbuch auch unbekannte Wörter."""
    leser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    leser.add_argument("--woerterbuch", action="store_true", help="seltene unbekannte Wörter zeigen")
    optionen = leser.parse_args(argumente)
    funde = pruefe_alles()
    for fund in funde:
        print(fund)
    if optionen.woerterbuch:
        for wort, ort in unbekannte_woerter(sammle_ink() + sammle_texte()):
            print(f"{'unbekannt':12} {ort}: {wort}")
    print(f"{len(funde)} Funde")
    return 1 if funde else 0


if __name__ == "__main__":
    sys.exit(main())

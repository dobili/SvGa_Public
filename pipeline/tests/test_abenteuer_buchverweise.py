"""Spieltexte ohne Buchverweise (Runde 10, Entscheidung „Dialoge: glaubwürdig, keine Buchverweise“).

Warum: Ambrose sagte auf dem Dachboden „Wer mehr wissen will: Kapitel 1, Abschnitt 1.4“. Niemand in
der Spielwelt kennt das Handbuch; Kapitel, Abschnitte und „im Buch“ reißen aus der Geschichte. Der
Test liest die Spieltexte (inhalte/abenteuer/texte), die gesprochenen Zeilen der Ink-Dialoge und die
Abenteuertexte der App (``abenteuer.*`` und ``imSpiel.*``) und meldet jeden Verweis.

Ausnahme ist nur der Abspann (Mitwirkende: Dort wird das Buch als Quelle genannt). Die verlorenen
Seiten des Wanderers bleiben als Gegenstand im Spiel, nennen aber kein Kapitel mehr.
"""

import json
import re
from pathlib import Path

HAUPT = Path(__file__).resolve().parents[2]
TEXTE = HAUPT / "inhalte" / "abenteuer" / "texte"
DIALOGE = HAUPT / "inhalte" / "abenteuer" / "dialoge"
APPTEXTE = HAUPT / "app" / "src" / "i18n"
APPSPRACHEN = ("de", "en")
APPBEREICHE = ("abenteuer.", "imSpiel.")

# Wörter, die auf das Handbuch zeigen; Abschnittsnummern wie „1.4“; der Platzhalter {kapitel}.
VERWEIS = re.compile(
    r"Kapitel|Abschnitt|Handbuch|Lehrbuch|\bim Buch\b|\baus dem Buch\b|\b[dm]ein(em|es|e)? Buch\b"
    r"|nachlesen|nachschlagen|\blies nach\b|Lektion|\{kapitel\}|\b\d{1,2}\.\d{1,2}\b"
    r"|\bchapter\b|\bhandbook\b|\bin the book\b|\blesson\b",
    re.IGNORECASE,
)
# Schlüssel, die das Buch nennen dürfen: der Abspann dankt dem Buch als Quelle.
AUSNAHMEN = {"abspann.mitwirkende.buch"}
# Zeilen eines Ink-Dialogs ohne gesprochenen Text: Kommentar, Code, Variable, Knoten, Sprung, Weiche.
KEIN_TEXT = re.compile(r"^\s*(//|~|VAR\b|CONST\b|EXTERNAL\b|INCLUDE\b|=+|->|-\s*\w[^:]*:\s*(->.*)?$|\{[^~])")


def verweise_in_texten(texte: dict[str, str]) -> list[str]:
    """Schlüssel mit Buchverweis. Beispiel: {"a": "Kapitel 1, Abschnitt 1.4"} → ["a: Kapitel 1, …"]."""
    return [
        f"{schluessel}: {text}"
        for schluessel, text in texte.items()
        if schluessel not in AUSNAHMEN and VERWEIS.search(text)
    ]


def verweise_in_ink(inhalt: str, name: str) -> list[str]:
    """Gesprochene Zeilen eines Ink-Dialogs mit Buchverweis (ohne die Marken hinter „#“)."""
    treffer = []
    for nummer, zeile in enumerate(inhalt.splitlines(), start=1):
        if KEIN_TEXT.search(zeile):
            continue
        text = zeile.split(" #", 1)[0]
        if VERWEIS.search(text):
            treffer.append(f"{name}:{nummer}: {text.strip()}")
    return treffer


def test_spieltexte_ohne_buchverweis():
    falsch = []
    for datei in sorted(TEXTE.glob("*.json")):
        falsch += verweise_in_texten(json.loads(datei.read_text(encoding="utf-8")))
    assert falsch == []


def test_dialoge_ohne_buchverweis():
    falsch = []
    for datei in sorted(DIALOGE.glob("*/*.ink")):
        falsch += verweise_in_ink(datei.read_text(encoding="utf-8"), datei.name)
    assert falsch == []


def test_abenteuertexte_der_app_ohne_buchverweis():
    falsch = []
    for sprache in APPSPRACHEN:
        alle = json.loads((APPTEXTE / f"{sprache}.json").read_text(encoding="utf-8"))
        falsch += verweise_in_texten({s: t for s, t in alle.items() if s.startswith(APPBEREICHE)})
    assert falsch == []


def test_pruefung_erkennt_die_alten_verweise():
    """Die Muster greifen bei den Sätzen, die der Autor beanstandet hat (sonst prüfte der Test nichts)."""
    alt = "Wer mehr wissen will: Kapitel 1, Abschnitt 1.4. Ein Buch, das ich gern geschrieben hätte."
    assert verweise_in_ink(f"{alt} #sprecher:ambrose", "dachboden.ink") != []
    assert verweise_in_ink("// Kapitel 1\n~ kapitel = 1\n=== lily_lektion ===", "x.ink") == []
    assert verweise_in_texten({"a": "Du hast im Buch gezählt.", "b": "Lies in 4.2 nach."}) != []
    assert verweise_in_texten({"a": "Victor legt die Seite in sein Buch.", "b": "Brett 3 von 12."}) == []

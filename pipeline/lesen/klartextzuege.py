"""Erkennt Züge im Klartext von Bildunterschriften und markiert sie als Textteil „zug“.

Wozu diese Datei da ist:
    In den Bildunterschriften stehen Züge meist als Klartext („Nach 2. Lf4 – …“), nicht in
    ``\\zugfolge``. Für die englische Fassung (AP 18) muss die App solche Züge in der Notation
    der Sprache zeigen können (Lf4 → Bf4). Dafür markiert diese Datei sie als eigene Teile:

        „Nach 2. Lf4 – Ziel 1“  →  „Nach “, zug „2. Lf4“, „ – Ziel 1“

    Auf Deutsch sieht der Leser keinen Unterschied (ein Zugteil erscheint wie Text).

Regeln, damit nichts geraten wird:
    - Eine Zugfolge beginnt immer mit einer Zugnummer („2.“, „5...“). Einzelne Felder oder Züge
      ohne Nummer („der Bauer e4“, „Sa3“) bleiben Text.
    - Jedes Wort danach muss ein Zug in deutscher Notation sein (wie ``lies_zuege``); das erste
      andere Wort beendet die Folge. Satzzeichen bleiben im Text.
    - Was ``lies_zuege`` nicht lesen kann, bleibt Text.
    - Nur Text im normalen Stil; fette oder kursive Stellen bleiben, wie sie sind.

Rolle im Gesamtbild: Schritt 1 „Lesen“ der Pipeline, aufgerufen in ``bauen/kapitel.py`` für die
Unterschriften. Vorarbeit für AP 18; Übungen und Glossar folgen bei Bedarf.
"""

from __future__ import annotations

import re

from pipeline.lesen.text import Textteil
from pipeline.lesen.zugfolgen import lies_zuege

# Ein Zug in deutscher Kurz- oder Langnotation mit Schach und Zugzeichen (wie lesen/zugfolgen.py).
_ZUG = r"(?:O-O-O|O-O|[KDTLS]?[a-h]?[1-8]?[x\-]?[a-h][1-8](?:=[DTLS])?)(?:\+\+|\+|#)?(?:[!?]{1,2})?"
# Zugnummer: „2.“ für Weiß, „5...“ für Schwarz; danach höchstens ein Leerzeichen.
_NUMMER = r"\d+\.(?:\.\.)?"
# Eine Folge: Nummer, Zug, dann weitere Züge, jeweils mit oder ohne neue Nummer.
_FOLGE = re.compile(rf"(?<![\w.]){_NUMMER} ?{_ZUG}(?: +(?:{_NUMMER} ?)?{_ZUG})*(?![\w\-=])")


def _zerlege(teil: Textteil) -> list[Textteil]:
    """Zerlegt einen Textteil in Text und erkannte Zugfolgen."""
    ergebnis: list[Textteil] = []
    rest = 0
    for treffer in _FOLGE.finditer(teil.text):
        try:
            lesbar = lies_zuege(treffer.group(0)) is not None
        except ValueError:
            lesbar = False
        if not lesbar:
            continue
        if treffer.start() > rest:
            ergebnis.append(Textteil("text", teil.text[rest : treffer.start()], teil.stil))
        ergebnis.append(Textteil("zug", treffer.group(0)))
        rest = treffer.end()
    if rest < len(teil.text):
        ergebnis.append(Textteil("text", teil.text[rest:], teil.stil))
    return ergebnis


def markiere_klartextzuege(teile: list[Textteil]) -> list[Textteil]:
    """Markiert Zugfolgen im Klartext einer Unterschrift als Teile der Art „zug“.

    Eingabe: Teile aus ``wandle_text``. Ausgabe: dieselben Teile, normale Textteile an den
    erkannten Zugfolgen geteilt; der Klartext (``als_klartext``) bleibt Zeichen für Zeichen gleich.
    Beispiel: „Nach 5... Db6, Weiß am Zug.“ → „Nach “, zug „5... Db6“, „, Weiß am Zug.“
    Sonderfälle: „Abb. 2.3“, „Feld e4“ und „Regel 2. Die …“ bleiben Text (keine Nummer mit Zug).
    """
    ergebnis: list[Textteil] = []
    for teil in teile:
        if teil.art == "text" and teil.stil == "normal":
            ergebnis.extend(_zerlege(teil))
        else:
            ergebnis.append(teil)
    return ergebnis


def zaehle_klartextzuege(teile: list[Textteil]) -> int:
    """Wie viele Zugteile eine Unterschrift hat (für den Bericht der Pipeline)."""
    return sum(1 for teil in teile if teil.art == "zug")

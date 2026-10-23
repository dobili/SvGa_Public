"""Prüft englische Texte: keine deutschen Züge, kein übrig gebliebenes Deutsch.

Wozu diese Datei da ist:
    Ein Übersetzer schreibt Züge im Fließtext selbst („the bishop goes to f4 with 5. Bf4“). Ein
    stehen gebliebenes „Lf4“ wäre für englische Leser falsch (ENGLISCH_BEGRIFFE.md, Notation) und
    ist ein Fehler. Deutsche Wörter in einem übersetzten Text sind meist ein vergessener Satzteil;
    sie sind nur eine Warnung, weil Eigennamen Umlaute haben dürfen („Göring-Gambit“, „Grünfeld“).

Rolle im Gesamtbild: Teil der Übersetzungsschicht ``pipeline/uebersetzen``.
"""

from __future__ import annotations

import re

# Deutscher Zug im Fließtext: Figurenbuchstabe D, T, L, S vor einem Feld („Lf4“, „Sxd5“, „Tae1“).
_DEUTSCHER_ZUG = re.compile(r"(?<![A-Za-z0-9])[DTLS][a-h]?[1-8]?x?[a-h][1-8](?![A-Za-z0-9])|=[DTLS]\b")
# Häufige deutsche Wörter, die in englischem Text nicht vorkommen.
_DEUTSCHE_WOERTER = re.compile(
    r"\b(der|die|das|und|nicht|ist|mit|auf|ein|eine|einen|wird|sich|auch|nach|zum|zur|dem|den|"
    r"Weiß|Schwarz|Zug|Bauer|Läufer|Springer|Turm|Dame|König|Abb|Kapitel|Abschnitt|Übung)\b"
)
_UMLAUT = re.compile(r"[äöüÄÖÜß]")
# Eigennamen mit Umlaut, die im Englischen so bleiben (Spieler, Eröffnungen, Orte).
_EIGENNAMEN = re.compile(
    r"Göring|Grünfeld|Réti|Nimzowitsch|Spielmann|Löwenthal|Hübner|Möller|Rubinstein|Sämisch|"
    r"Müller|Jänisch|Lärobok|Schlüssel|Röntgen|München|Kärnten|Bücker|Kortschnoi|Schmid|Tröger|"
    r"Lasker|Nürnberg|Düsseldorf|Köln|Zürich|Göteborg|Mährisch|Völker|Krämer|Bönsch|Würzburg"
)


def deutsche_zuege(text: str) -> list[str]:
    """Züge mit deutschen Figurenbuchstaben in einem englischen Text.

    Beispiel: „With 5. Lf4 White …“ → [„Lf4“]; „With 5. Bf4 White …“ → [].
    """
    return [treffer.group(0) for treffer in _DEUTSCHER_ZUG.finditer(text)]


def restdeutsch(text: str) -> list[str]:
    """Deutsche Wörter und Umlaute außerhalb bekannter Eigennamen (Warnung, kein Fehler).

    Beispiel: „The bishop und the knight“ → [„und“]; „the Göring Gambit“ → [].
    """
    ohne_namen = _EIGENNAMEN.sub("", text)
    funde = [treffer.group(0) for treffer in _DEUTSCHE_WOERTER.finditer(ohne_namen)]
    funde += [treffer.group(0) for treffer in _UMLAUT.finditer(ohne_namen)]
    return funde

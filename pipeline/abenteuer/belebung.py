"""Belebung: genug Statisten und Tiere auf Stadt- und Wegkarten, und Statisten haben etwas zu sagen.

Warum: Rückmeldung des Autors zur Revision der Karten von Akt 2 bis 4 (10.11.2026, morgens):
„Insgesamt erheblich mehr Figuren, Menschen, auch Tiere. Die Charaktere sollen etwas zu sagen
haben über die Welt, über Schach, ihren Lieblingszug, Schachgeschichte. Auf den Routen können Tiere
herumlaufen, die vom Helden weglaufen.“ Daraus Regel 10.53 in ``docs/spiel/KARTENREGELN.md`` und
Dokument ``docs/spiel/16_Statisten_und_Tiere.md``.

Eine Belebung ist ein Eintrag in ``belebung`` mit ``typ`` statist oder tier. Ein Statist mit
``eigenschaften.sagt`` ist ansprechbar; ``sagt`` nennt einen Textschlüssel in
``inhalte/abenteuer/texte/de.json`` (``statist.<karte>.<name>``). Eine Schar (``moewen``,
``bisonherde``) zählt als ein Tier.
"""

import json
from pathlib import Path

TEXTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "texte" / "de.json"
# Mindestzahlen je Außenkarte: (Statisten, davon ansprechbar, Tiere)
STADT = (12, 6, 4)
WEG = (4, 3, 6)


def _zaehle(szene: dict) -> tuple[int, int, int]:
    """Statisten, ansprechbare Statisten und Tiere einer Szene."""
    belebung = szene.get("belebung", [])
    statisten = [b for b in belebung if b.get("typ") == "statist"]
    sprechend = [b for b in statisten if b.get("eigenschaften", {}).get("sagt")]
    tiere = [b for b in belebung if b.get("typ") == "tier"]
    return len(statisten), len(sprechend), len(tiere)


def lade_texte(pfad: Path = TEXTE) -> dict:
    """Die deutschen Texte des Abenteuers (flaches Wörterbuch Schlüssel → Text)."""
    return json.loads(pfad.read_text(encoding="utf-8"))


def pruefe_saetze(szene: dict, texte: dict) -> list[str]:
    """Jeder ``sagt``-Schlüssel einer Szene steht in den Texten.

    Beispiel: ``"sagt": "statist.riverton.aussen.taubenfrau"`` ohne Eintrag in ``de.json`` meldet
    „Satz fehlt“.
    """
    befunde = []
    for b in szene.get("belebung", []):
        schluessel = b.get("eigenschaften", {}).get("sagt")
        if schluessel and schluessel not in texte:
            befunde.append(
                f"Satz fehlt: {b['name']} sagt „{schluessel}“, der Schlüssel steht nicht in texte/de.json"
            )
    return befunde


def pruefe_belebung(szene: dict, art_des_orts: str | None, stadtkarte: bool, texte: dict) -> list[str]:
    """Meldet zu leere Stadt- und Wegkarten (Regel 10.53) und fehlende Sätze.

    Eingaben: Szene; Art des Orts aus ``orte.json`` (``weg``, ``stadt`` oder None); ob die Karte die
    Außenkarte oder ein Viertel einer Stadt ist (``stadtgroesse.zaehlt_als_stadtkarte``); Texte.
    Ausgabe: Befundliste.
    Beispiel: ``wegPinewoodGhost.canyonrand`` mit einem Statisten meldet „Weg wirkt leer“.
    Sonderfall: Innenräume, Erinnerungen und Plätze einer Stadt prüft nur ``pruefe_saetze``.
    """
    befunde = pruefe_saetze(szene, texte)
    if szene.get("art") != "aussen":
        return befunde
    if stadtkarte:
        soll, wort = STADT, "Stadt"
    elif art_des_orts == "weg":
        soll, wort = WEG, "Weg"
    else:
        return befunde
    ist = _zaehle(szene)
    if any(i < s for i, s in zip(ist, soll, strict=True)):
        befunde.append(
            f"{wort} wirkt leer: {ist[0]} Statisten ({ist[1]} ansprechbar), {ist[2]} Tiere; "
            f"mindestens {soll[0]} ({soll[1]} ansprechbar) und {soll[2]} Tiere (Regel 10.53)"
        )
    return befunde

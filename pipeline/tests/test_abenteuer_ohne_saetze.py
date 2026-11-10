"""Daten des Abenteuers enthalten keinen sichtbaren Text: Sätze stehen nur in ``texte/<sprache>.json``.

Warum: Dokument 17 (Mehrsprachigkeit), Regel 1 und Abschnitt 3, Punkt 4: Für eine spätere
englische Fassung darf kein Satz, den der Spieler sieht, in Orten, Quests, Szenen oder Karten
stehen; dort stehen nur Kennungen und Textschlüssel. Ausgenommen sind Notizfelder für Menschen,
die das Spiel nie zeigt (``beschreibung``, ``hinweis``, ``tun`` …), Partieangaben (FEN, PGN,
Quelle) und Bauhilfen des Kartenbauers (Ortsprofile, Katalogkorrekturen, Materialien, Möbel).
Beispiel: ``"titel": "Der verlorene Läufer"`` in ``quests.json`` wäre ein Befund; richtig ist ein
Schlüssel wie ``"titel": "quest.verlorenerLaeufer.titel"``.
"""

import json
import re
from pathlib import Path

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
# Notizen, Partieangaben und Verweise: nie im Spiel zu sehen.
NOTIZFELDER = {
    "beschreibung",
    "hinweis",
    "tun",
    "erklaerung",
    "partie",
    "quelle",
    "fen",
    "pgn",
    "eroeffnungen",
    "wert",
    # Bedingungen (Zustände, Übergänge): Logik in der Bedingungssprache, kein Text für den Spieler.
    "zustand_der_karte",
    "wenn",
}
# Bauhilfen des Kartenbauers; sie kommen nicht ins Spielpaket.
BAUHILFEN = ("ortsprofile.json", "materialien.json", "katalog_korrekturen/", "moebel/", "texte/")
# Ein Wort: Buchstaben, höchstens ein Satzzeichen dahinter, mindestens zwei Buchstaben.
WORT = re.compile(r"^[A-Za-zÄÖÜäöüß]{2,}[,.!?;:]?$")
WOERTER_FUER_SATZ = 4


def _satzartig(text: str) -> bool:
    """Vier oder mehr echte Wörter: „zündet die Laternen an“ ja, eine FEN oder ein Pfad nein."""
    return sum(1 for teil in text.split() if WORT.match(teil)) >= WOERTER_FUER_SATZ


def _funde(objekt, feld: str | None = None):
    """(Feld, Text) aller satzartigen Zeichenketten außerhalb der Notizfelder, rekursiv."""
    if isinstance(objekt, dict):
        if isinstance(objekt.get("name"), str) and "value" in objekt:  # Tiled-Eigenschaft
            yield from _funde(objekt["value"], objekt["name"])
            return
        for schluessel, wert in objekt.items():
            yield from _funde(wert, schluessel)
    elif isinstance(objekt, list):
        for wert in objekt:
            yield from _funde(wert, feld)
    elif isinstance(objekt, str) and feld not in NOTIZFELDER and _satzartig(objekt):
        yield feld, objekt


def test_satzerkennung():
    assert _satzartig("Der Turm geht auf die offene Linie.")
    assert not _satzartig("3rkb1r/p2nqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR3R w k - 3 13")
    assert not _satzartig("statist.riverton.aussen.taubenmann")
    assert not _satzartig("figuren/statist-07.png")


def test_daten_ohne_saetze():
    befunde = []
    for datei in sorted(INHALTE.rglob("*.json")):
        relativ = datei.relative_to(INHALTE).as_posix()
        if any(relativ.startswith(b) or relativ == b for b in BAUHILFEN):
            continue
        for feld, text in _funde(json.loads(datei.read_text(encoding="utf-8"))):
            befunde.append(f"{relativ}: {feld} = „{text[:60]}“")
    assert not befunde, "Sätze gehören nach texte/<sprache>.json:\n" + "\n".join(befunde[:30])

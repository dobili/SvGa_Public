"""Stadtgröße: Städte des Schach-Abenteuers brauchen genug Gebäude, damit sie wie Städte wirken.

Warum: Rückmeldung des Autors zur Revision der Karten von Akt 2 bis 4 (10.11.2026, morgens): „Die
Städte haben relativ wenig Gebäude. Wir wollten uns an den Pokémon-Städten orientieren, und die
haben sehr viel mehr Gebäude. Nicht alle sind begehbar, aber sie sind da, damit ein Gefühl von
Größe vermittelt wird.“ Daraus Regel 10.51 in ``docs/spiel/KARTENREGELN.md``: Jede Außenkarte
einer Stadt hat je nach Ortsgröße (``groesse`` in ``orte.json``) eine Mindestzahl von Gebäuden;
die meisten sind Kulissenhäuser ohne Innenraum.

Was als Gebäude zählt: ein Möbel mit ``"gebaeude": true`` oder mit ``art`` haus/gebaeude, sonst
jedes Möbel mit Kollision ab 5 × 5 Kacheln, das nach Art oder Namen kein Baum, Fels, Fahrzeug,
Zaun, Steg oder keine Brücke ist. ``"gebaeude": false`` schließt ein großes Möbel aus.
"""

import json
from pathlib import Path

ORTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "orte.json"
KACHEL = 16
MINDESTMASS = 5 * KACHEL  # kleinere Dinge sind Kioske, Buden, Schuppen
MINDESTZAHL = {"klein": 12, "mittel": 20, "gross": 20}  # je Außenkarte (bei „gross“ je Viertel)
KEINE_GEBAEUDE_ARTEN = {"baum", "busch", "hecke", "zaun", "fahrzeug", "steg", "bruecke", "boden", "stein"}
KEINE_GEBAEUDE_NAMEN = (
    "baum",
    "tanne",
    "fels",
    "zaun",
    "bus",
    "auto",
    "wagen",
    "zug",
    "lok",
    "bruecke",
    "steg",
    "hecke",
    "boot",
    "faehre",
)


def ist_gebaeude(name: str, angabe: dict) -> bool:
    """Zählt dieses Möbel als Gebäude einer Stadt?

    Eingaben: Möbelname und Angabe aus der Möbelliste.
    Ausgabe: True für Häuser, Läden, Hallen, Hütten ab 5 × 5 Kacheln.
    Beispiel: ``iw5Reihenhaus`` (Ironwood, 96 × 112 Pixel) zählt; ``iwTanne`` nicht.
    Sonderfall: ``"gebaeude"`` in der Angabe entscheidet immer zuerst.
    """
    if "gebaeude" in angabe:
        return bool(angabe["gebaeude"])
    art = angabe.get("art")
    if art in ("haus", "gebaeude"):
        return True
    if art in KEINE_GEBAEUDE_ARTEN or any(w in name.lower() for w in KEINE_GEBAEUDE_NAMEN):
        return False
    gross = angabe.get("breite", 0) >= MINDESTMASS and angabe.get("hoehe", 0) >= MINDESTMASS
    return gross and angabe.get("kollision", True)


def ortseintrag(karte: str, orte_pfad: Path = ORTE) -> dict | None:
    """Der Eintrag in ``orte.json`` zu einer Karte (``riverton.aussen`` → Ort ``riverton``)."""
    ort = karte.split(".")[0]
    for eintrag in json.loads(orte_pfad.read_text(encoding="utf-8"))["orte"]:
        if eintrag["kennung"] == ort:
            return eintrag
    return None


def ortsgroesse(karte: str, orte_pfad: Path = ORTE) -> str | None:
    """Größe des Orts, zu dem eine Karte gehört (``klein``, ``mittel``, ``gross`` oder None).

    Beispiel: ``riverton.aussen`` → ``mittel``. Wege und Erinnerungen haben keine Größe.
    """
    eintrag = ortseintrag(karte, orte_pfad)
    return eintrag.get("groesse") if eintrag else None


def zaehlt_als_stadtkarte(szene: dict) -> bool:
    """Die Außenkarte einer Stadt: ``<ort>.aussen`` oder eine Karte mit ``"viertel": true``.

    Häfen, Plätze und Felder einer Stadt (``siliconBay.hafen``) zählen nicht.
    """
    stadtteil = szene["karte"].endswith(".aussen") or szene.get("viertel", False)
    return szene.get("art") == "aussen" and stadtteil


def pruefe_gebaeude(szene: dict, gesetzt: list[dict], moebel: dict, orte_pfad: Path = ORTE) -> list[str]:
    """Meldet Stadtkarten mit zu wenigen Gebäuden (Regel 10.51).

    Eingaben: Szene, gesetzte Möbel (mit ``name``), Möbelliste.
    Ausgabe: Befundliste, leer wenn genug Gebäude stehen oder die Karte keine Stadtkarte ist.
    Beispiel: ``capitalArena.aussen`` mit einem Gebäude meldet „Stadt wirkt leer: 1 Gebäude …“.
    """
    if not zaehlt_als_stadtkarte(szene):
        return []
    groesse = ortsgroesse(szene["karte"], orte_pfad)
    if groesse not in MINDESTZAHL:
        return []
    anzahl = sum(1 for s in gesetzt if ist_gebaeude(s["name"], moebel.get(s["name"], {})))
    soll = MINDESTZAHL[groesse]
    if anzahl < soll:
        return [
            f"Stadt wirkt leer: {anzahl} Gebäude, bei Ortsgröße „{groesse}“ mindestens {soll} "
            "(Regel 10.51; Kulissenhäuser ohne Innenraum zählen mit)"
        ]
    return []

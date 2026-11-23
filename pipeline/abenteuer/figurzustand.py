"""Zustand und Standbild einer Figur oder eines Tiers an einer Stelle der Szene (Editor 1.9).

Warum: Der Autor hat alle Figuren und Tiere in PixelLab neu gemacht; die Bögen haben Reihen für
Stehen, Gehen, Rennen und Zustände (Menschen: Sitzen auf dem Stuhl, am Boden, Liegen; Tiere:
sitzen, schlafen, grasen, schwimmen), dazu weitere Standbilder (Abe mit oder ohne Teleskop). Bisher
galt an jeder Stelle die Regel (Sitzmöbel, Verhalten, Tagesablauf) und für alle Vorkommen dasselbe
Standbild. Wunsch des Autors (23.11.2026): „zwischen den verschiedenen States wechseln … damit ich
kleine Ungereimtheiten in der Darstellung selbst im Editor ändern kann.“

Felder in der Szene (alle optional, leer heißt Regel wie bisher):
- Figur (``figuren``) und Statist (``belebung``, unter ``eigenschaften``): ``zustand`` ∈
  MENSCHENZUSTAENDE und ``standbild`` (Kennung eines Standbilds aus PixelLab, figuren32/standbilder.json).
- Tier (``belebung`` mit typ „tier“, unter ``eigenschaften``): ``zustand`` ∈ TIERZUSTAENDE.

Die Karte trägt beide als Eigenschaften; die App liest sie in oberwelt/figurzustand.ts.
Rolle im Gesamtbild: gelesen von kartentiled.py (Figuren), editorrueck.py (Rückweg) und dem
Szenen-Dauertest (test_abenteuer_figurzustand.py).
"""

import re

MENSCHENZUSTAENDE = ("stehen", "sitzstuhl", "sitzboden", "liegt")
TIERZUSTAENDE = ("stehen", "sitzen", "schlafen", "grasen", "schwimmen")
KENNUNG = re.compile(r"^[a-z0-9][a-z0-9-]{0,39}$")


def zustand_gueltig(wert: object, tier: bool = False) -> bool:
    """Ist ``wert`` ein erlaubter Zustand? Beispiel: ("sitzboden") → True; ("grasen", tier=True) → True."""
    return wert in (TIERZUSTAENDE if tier else MENSCHENZUSTAENDE)


def standbild_gueltig(wert: object) -> bool:
    """Ist ``wert`` eine Kennung eines Standbilds? Beispiel: "ohne-teleskop" → True; "Mit Hut" → False."""
    return isinstance(wert, str) and bool(KENNUNG.match(wert))


def figureigenschaften(eintrag: dict) -> list[dict]:
    """Tiled-Eigenschaften ``zustand`` und ``standbild`` einer Figur der Szene, nur gültige.

    Beispiel: {"name": "abe", "zustand": "sitzboden", "standbild": "ohne-teleskop"} → zwei
    Eigenschaften; ein unbekannter Zustand fällt weg (der Dauertest meldet ihn).
    """
    eig = []
    if zustand_gueltig(eintrag.get("zustand")):
        eig.append({"name": "zustand", "type": "string", "value": eintrag["zustand"]})
    if standbild_gueltig(eintrag.get("standbild")):
        eig.append({"name": "standbild", "type": "string", "value": eintrag["standbild"]})
    return eig


def befunde(szene: dict) -> list[str]:
    """Ungültige Zustände und Standbilder einer Szene (Figuren und Belebung)."""
    ergebnis = []
    for f in szene.get("figuren", []):
        if "zustand" in f and not zustand_gueltig(f["zustand"]):
            ergebnis.append(f"Figur {f.get('name')}: Zustand „{f['zustand']}“ unbekannt")
        if "standbild" in f and not standbild_gueltig(f["standbild"]):
            ergebnis.append(f"Figur {f.get('name')}: Standbild „{f['standbild']}“ ist keine Kennung")
    for b in szene.get("belebung", []):
        eig = b.get("eigenschaften", {})
        tier = b.get("typ") == "tier"
        if "zustand" in eig and not zustand_gueltig(eig["zustand"], tier):
            ergebnis.append(f"{b.get('typ')} {b.get('name')}: Zustand „{eig['zustand']}“ unbekannt")
        if "standbild" in eig and (tier or not standbild_gueltig(eig["standbild"])):
            ergebnis.append(f"{b.get('typ')} {b.get('name')}: Standbild „{eig['standbild']}“ ungültig")
    return ergebnis


def zustandstext(eintrag: dict) -> str:
    """Zustand und Standbild als Text für den Bericht des Editors (editorrueck.py).

    Beispiel: {"zustand": "sitzboden", "standbild": "idle"} → „sitzboden, Standbild idle“; ein Tier
    mit ``eigenschaften.zustand`` „grasen“ → „grasen“; ohne Angabe → „Regel“.
    """
    quelle = eintrag if "zustand" in eintrag or "standbild" in eintrag else eintrag.get("eigenschaften", {})
    teile = [quelle["zustand"]] if quelle.get("zustand") else []
    if quelle.get("standbild"):
        teile.append(f"Standbild {quelle['standbild']}")
    return ", ".join(teile) or "Regel"


def bereinige(szene: dict) -> None:
    """Ungültige Zustände und Standbilder entfernen (der Editor setzt nur gültige; die Grenze gilt
    auch für Änderungen von Hand), damit Karte und App nie etwas Unbekanntes lesen."""
    for f in szene.get("figuren", []):
        if "zustand" in f and not zustand_gueltig(f["zustand"]):
            del f["zustand"]
        if "standbild" in f and not standbild_gueltig(f["standbild"]):
            del f["standbild"]
    for b in szene.get("belebung", []):
        eig = b.get("eigenschaften", {})
        tier = b.get("typ") == "tier"
        if "zustand" in eig and not zustand_gueltig(eig["zustand"], tier):
            del eig["zustand"]
        if "standbild" in eig and (tier or not standbild_gueltig(eig["standbild"])):
            del eig["standbild"]

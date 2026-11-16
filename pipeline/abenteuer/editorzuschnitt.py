"""Rücklauf des Karteneditors: Zuschnitte im Bericht und Vorschläge für eigene Katalogeinträge.

Warum: Ab Editor 1.5 beschneidet der Autor Bilder (Objektfeld ``zuschnitt``, ``objektzuschnitt.py``),
etwa einen Pfosten aus einem Zaunstück (Wunsch des Autors, 16.11.2026). Der Bericht nennt jeden
neuen oder geänderten Zuschnitt mit der neuen Größe. Kommt derselbe Zuschnitt desselben Bildes an
mehreren Stellen vor, ist ein eigener Katalogeintrag übersichtlicher; der Bericht schlägt ihn vor,
legt ihn aber nicht an (der Katalog bleibt Sache des Hauptchats).
Dazu die Deckkraft (Objektfeld ``deckkraft``, 25 bis 100 %, ebenfalls Editor 1.5).
Rolle: von ``editorrueck.py`` aufgerufen, damit der Rücklauf klein bleibt.
"""

from collections import defaultdict

from pipeline.abenteuer.objektform import deckkraft_von, geformt
from pipeline.abenteuer.objektzuschnitt import beschnittene_groesse, zuschnitt_von

# Ab so vielen Karten oder Stellen mit demselben Zuschnitt schlägt der Bericht einen Eintrag vor.
KARTEN_FUER_VORSCHLAG = 2
STELLEN_FUER_VORSCHLAG = 3
SEITEN = ("links", "oben", "rechts", "unten")


def zuschnitttext(eintrag: dict, angabe: dict | None) -> str:
    """Der Zuschnitt als Text. Beispiel: Zaun 64 × 32, [26, 0, 32, 0] →
    „beschnitten auf 6 × 32: links 26, oben 0, rechts 32, unten 0 (Katalog 64 × 32)“."""
    z = zuschnitt_von(eintrag) or (0, 0, 0, 0)
    seiten = ", ".join(f"{s} {w}" for s, w in zip(SEITEN, z, strict=True))
    if not angabe or "breite" not in angabe:
        return f"beschnitten: {seiten}"
    b, h = beschnittene_groesse(angabe["breite"], angabe["hoehe"], z)
    return f"beschnitten auf {b} × {h}: {seiten} (Katalog {angabe['breite']} × {angabe['hoehe']})"


def zuschnittzeilen(vorher: dict, nachher: dict, angabe: dict | None, wo: str) -> list[str]:
    """Eine Berichtszeile, wenn sich der Zuschnitt eines Objekts geändert hat (oder neu ist).

    Beispiel: „Zuschnitt: zaunHolz (4, 6) beschnitten auf 6 × 32: links 26, …“; aufgehoben →
    „Zuschnitt: zaunHolz (4, 6) aufgehoben (wieder ganzes Bild)“.
    """
    alt, neu = zuschnitt_von(vorher), zuschnitt_von(nachher)
    if alt == neu:
        return []
    name = nachher["moebel"]
    if neu is None:
        return [f"Zuschnitt: {name} {wo} aufgehoben (wieder ganzes Bild)"]
    return [f"Zuschnitt: {name} {wo} {zuschnitttext(nachher, angabe)}"]


def deckkraftzeilen(vorher: dict, nachher: dict, wo: str) -> list[str]:
    """Eine Berichtszeile, wenn sich die Deckkraft geändert hat.

    Beispiel: „Deckkraft: mf12Lichtkegel (6, 3) 100 → 50 %“.
    """
    alt, neu = deckkraft_von(vorher), deckkraft_von(nachher)
    return [] if alt == neu else [f"Deckkraft: {nachher['moebel']} {wo} {alt} → {neu} %"]


def _katalogvorschlag(name: str, z: tuple, angabe: dict | None) -> str:
    """Der vorgeschlagene Katalogeintrag als kurzer Text (Quelle, Ausschnitt, Größe, Maske)."""
    if not angabe or "breite" not in angabe:
        return f"Katalogeintrag für {name} mit zuschnitt {list(z)} (Möbel fehlt im Katalog)"
    x0, y0 = (angabe.get("ausschnitt") or [0, 0])[:2]
    b, h = beschnittene_groesse(angabe["breite"], angabe["hoehe"], z)
    ausschnitt = [x0 + z[0], y0 + z[1], x0 + z[0] + b, y0 + z[1] + h]
    maske = "/".join((geformt(angabe, {"zuschnitt": list(z)}) or {}).get("maske", []))
    return (
        f"Vorschlag: eigener Katalogeintrag aus {name} (quelle {angabe['quelle']}, "
        f"ausschnitt {ausschnitt}, breite {b}, hoehe {h}, maske {maske})"
    )


def zuschnittvorschlaege(szenen: list[dict], moebel: dict) -> list[str]:
    """Wiederholte Zuschnitte in den Szenen der Änderungsdatei (``nachher``) mit Vorschlag.

    Eingaben: Einträge der Änderungsdatei (je ``datei`` und ``nachher``), Möbelkatalog.
    Ausgabe: Berichtszeilen, leer ohne Wiederholung.
    Beispiel: Pfosten aus zaunHolz in drei Karten → „zaunHolz, zuschnitt [26, 0, 32, 0]: 3 Stellen in
    3 Karten (a.json, b.json, c.json). Vorschlag: eigener Katalogeintrag …“.
    """
    stellen: dict[tuple, list[str]] = defaultdict(list)
    for eintrag in szenen:
        for objekt in eintrag["nachher"].get("objekte", []):
            if z := zuschnitt_von(objekt):
                stellen[(objekt["moebel"], z)].append(eintrag["datei"])
    zeilen = []
    for (name, z), dateien in sorted(stellen.items()):
        karten = sorted(set(dateien))
        if len(karten) < KARTEN_FUER_VORSCHLAG and len(dateien) < STELLEN_FUER_VORSCHLAG:
            continue
        zeilen.append(
            f"{name}, zuschnitt {list(z)}: {len(dateien)} Stellen in {len(karten)} Karten "
            f"({', '.join(karten)}). {_katalogvorschlag(name, z, moebel.get(name))}"
        )
    return zeilen

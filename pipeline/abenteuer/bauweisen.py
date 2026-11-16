"""Bauweisen aus dem Karteneditor, die die Prüfungen des Kartenbaus kennen müssen.

Warum: Der Autor hat am 16.11.2026 mit dem Karteneditor 1.6 im Whitlock-Haus (Maple Falls) Treppenlöcher
aus Bildern gebaut: das Loch als Leere „ “ im Raster, darin eine durchscheinende, beschnittene Treppe,
ringsum ein Geländer aus Zaun- und Relingteilen, feine Kollision. Dazu hat er Sessel, Stühle und eine
gedrehte Treppe so gesetzt, wie es die alten Prüfungen nicht kannten. Die Prüfungen rechneten dort
grob (je Kachel) oder ohne Drehung und meldeten Befunde, die das Spiel nicht hat:

- Ein Geländer steht am Rand eines Lochs zwangsläufig auf einer Leere-Kachel („steht auf Wand oder
  Wasser“), und seine Teile liegen pixelgenau übereinander („überlappt“).
- Ein Auslöser zwischen fein gesetzten Geländerkanten ist erreichbar, wenn die Mitte des Helden auf
  der Kachel stehen kann (``durchgang.betretbare_kacheln``), auch wenn die Kachel nach der
  Ganzkachel-Regel als gesperrt gilt („zugestellt“, „liegt auf einer feinen Sperre“).
- Eine um 180 Grad gedrehte Treppe hinauf hat ihren Antritt oben, nicht unten.
- Ein Möbel, dessen Kollision der Autor mit dem Pinsel gemalt hat (``kollision: false`` und
  ``sperren_fein``), belegt den Boden wie vorher („Raum wirkt karg“).

Neu dazu ein Befund für echte Fehler: Ein Eintrag, der zweimal gleich in einer Szene steht, entsteht
beim doppelten Übertragen auf Fassungen („Auswahl auf Fassungen übertragen“) und war im Zimmer, auf dem
Dachboden und im Diner der Grund für mehrere Überlappungen.

Regeln: KARTENREGELN 10.84 (Loch im Boden), 10.69 (begehbar mit Grund), 8.2.6 (Belegung).
"""

import json

from pipeline.abenteuer.kartentiled import GESPERRT, LEER, K
from pipeline.abenteuer.kollisionfein import feinlisten
from pipeline.abenteuer.kollisionspinsel import pinselfelder
from pipeline.abenteuer.objektkollision import kollision_an
from pipeline.abenteuer.objektrichtung import drehe_richtung, form_von

Feld = tuple[int, int]
GELAENDER = "zaun"  # Katalogart der Zaun- und Relingteile, aus denen der Autor Geländer baut
NACHBARN = ((1, 0), (-1, 0), (0, 1), (0, -1))


def art_von(name: str, moebel: dict | None) -> str | None:
    """Katalogart eines Möbels; ohne Katalog None. Beispiel: „sd6RelingCOben“ → „zaun“."""
    return (moebel or {}).get(name, {}).get("art")


def am_loch(zeilen: list[str], feld: Feld) -> bool:
    """Liegt die Kachel in einem Loch im Boden: Leere „ “ mit Boden daneben?

    Warum: Das Geländer eines Treppenlochs steht am Rand der Öffnung; im Kachelraster liegt sein Fuß
    auf der Leere. Beispiel: Zimmer, Raster „#  ...“ in Reihe 4 → (2, 4) ja, (0, 4) (Wand) nein.
    """
    x, y = feld
    if not (0 <= y < len(zeilen) and 0 <= x < len(zeilen[0])) or zeilen[y][x] != LEER:
        return False
    return any(
        0 <= y + dy < len(zeilen) and 0 <= x + dx < len(zeilen[0]) and zeilen[y + dy][x + dx] not in GESPERRT
        for dx, dy in NACHBARN
    )


def gelaender_am_loch(name: str, moebel: dict | None, zeilen: list[str], feld: Feld) -> bool:
    """Ein Geländerteil, dessen Fuß am Rand eines Lochs steht (kein Befund „auf Wand oder Wasser“).

    Beispiel: gt7ZaunMR auf (2, 4) im Zimmer, rechts neben der Öffnung → ja.
    """
    return art_von(name, moebel) == GELAENDER and am_loch(zeilen, feld)


def darf_ueberlappen(name: str, anderer: str, moebel: dict | None) -> bool:
    """Geländerteile liegen pixelgenau übereinander und über der Treppe im Loch (innen).

    Warum: Eckpfosten, Seitenteil und Querlatte eines Geländers teilen sich Kacheln; das ist kein
    doppelt gestelltes Möbel. Doppelte Einträge meldet ``doppelte_eintraege``.
    Beispiel: sd6RelingCOben und sd6RelingCObenLinks bei (1, 5) → ja; Sessel und Lampe → nein.
    """
    arten = {art_von(name, moebel), art_von(anderer, moebel)}
    return GELAENDER in arten and arten <= {GELAENDER, "treppe"}


def doppelte_eintraege(szene: dict, moebel: dict, mit_kollision: bool = True) -> list[str]:
    """Objekte, die mit allen Angaben zweimal in der Szene stehen.

    ``mit_kollision=True``: nur sperrende (Befund, sie überlappen sich selbst); ``False``: nur flache
    (Hinweis, doppelt gezeichnet, etwa zwei gleiche Grasbüschel). Beispiel: zweimal
    ``{"moebel": "gt7ZaunMR", "feld": [2, 4], "maske": ["#"]}`` →
    „gt7ZaunMR (2, 4) steht doppelt in der Szene (zweimal übertragen?)“.
    """
    gesehen: set[str] = set()
    befunde = []
    for eintrag in szene.get("objekte", []):
        schluessel = json.dumps(eintrag, sort_keys=True, ensure_ascii=False)
        angabe = moebel.get(eintrag["moebel"], {})
        sperrt = kollision_an(angabe, eintrag) and "auf" not in eintrag and not eintrag.get("an_wand")
        if schluessel in gesehen and sperrt == mit_kollision:
            wo = tuple(eintrag["feld"]) if "feld" in eintrag else f"auf {eintrag.get('auf')}"
            befunde.append(f"{eintrag['moebel']} {wo} steht doppelt in der Szene (zweimal übertragen?)")
        gesehen.add(schluessel)
    return befunde


def im_loch(stueck: dict, zeilen: list[str]) -> bool:
    """Liegt ein Bild zum größeren Teil über Leere „ “ (Treppe unter dem Boden eines Treppenlochs)?

    Warum: Die durchscheinende Treppe im Loch ist nur Bild; wer sie betritt, regelt der Auslöser am
    Loch, und den prüft ``uebergaenge`` (Erreichbarkeit mit feiner Kollision). Einen Antritt vor ihrer
    Kante gibt es nicht. Beispiel: Dachboden, Treppe auf (1, 8) bis (2, 8), Raster „#  ...“ → ja.
    """
    x0, x1 = stueck["x"] // K, (stueck["x"] + stueck["breite"] - 1) // K
    y0, y1 = stueck["y"] // K, (stueck["y"] + stueck["hoehe"] - 1) // K
    felder = [(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)]
    leer = [
        f
        for f in felder
        if 0 <= f[1] < len(zeilen) and 0 <= f[0] < len(zeilen[0]) and zeilen[f[1]][f[0]] == LEER
    ]
    return 2 * len(leer) > len(felder)


def antritt(
    stueck: dict,
    felder: tuple[int, int, int, int],
    abgang: bool,
    eintrag: dict,
    grundseite: str | None = None,
) -> tuple[str, list[Feld]]:
    """Seite und Kacheln, von denen man eine Treppe betritt, so wie sie auf der Karte liegt.

    Eine Treppe hinauf betritt man vor ihrer unteren Kante, einen Abgang (Öffnung mit Geländer) in
    seiner obersten Reihe; Drehung und Spiegeln drehen die Seite mit (``objektrichtung``).
    ``grundseite`` ist das Katalogfeld ``antritt`` für Bilder, die anders gezeichnet sind: Die
    Treppe zum Betrachter (``treppeZumBetrachter``) steigt nach Süden an, ihre unterste Stufe ist
    oben im Bild; man betritt sie vor der oberen Kante.
    Beispiel: Treppe zum Dachboden im Zimmer, ``drehung`` 180 → Seite „oben“, Kacheln der Reihe über
    dem Bild (vorher wurde unten gesucht, an der Südwand: „Treppe ohne freien Antritt unten“).
    """
    x0, y0, x1, y1 = felder
    grund = grundseite or ("oben" if abgang else "unten")
    seite = drehe_richtung(grund, form_von(eintrag)) or grund
    oben = stueck["y"] // K
    if seite in ("oben", "unten"):
        y = (oben if abgang else oben - 1) if seite == "oben" else (y1 if abgang else y1 + 1)
        return seite, [(x, y) for x in range(x0, x1 + 1)]
    x = (x0 if abgang else x0 - 1) if seite == "links" else (x1 if abgang else x1 + 1)
    return seite, [(x, y) for y in range(y0, y1 + 1)]


def gemalt_belegt(szene: dict, gesetzt: list[dict], moebel: dict | None) -> set[Feld]:
    """Kacheln unter einem Möbel, das laut Katalog sperrt, deren Sperre der Autor gemalt hat.

    Warum: Im Wohnzimmer (Fassung mit Esstisch) sind die Sessel ``kollision: false``; ihre Lehnen
    sperren über ``sperren_fein``. Für die Belegung (8.2.6) bleibt der Sessel ein Möbel.
    Beispiel: Sessel auf (6, 6) bis (7, 7), feine Sperre auf (6, 6) → (6, 6).
    """
    gemalt = set(pinselfelder(szene)[0]) | {f for f, m in feinlisten(szene)[0].items() if "#" in m}
    belegt: set[Feld] = set()
    for s in gesetzt:
        if not (moebel or {}).get(s["name"], {}).get("kollision") or s.get("tiefe", 0) <= 1:
            continue
        x0, x1 = s["x"] // K, (s["x"] + s["breite"] - 1) // K
        y0, y1 = s["y"] // K, (s["y"] + s["hoehe"] - 1) // K
        belegt |= {f for f in gemalt if x0 <= f[0] <= x1 and y0 <= f[1] <= y1}
    return belegt


def bodenkacheln_mit_kollision(szene: dict, moebel: dict) -> list[str]:
    """Hinweise: Bodenkacheln (Art ``boden_teil``), die hier sperren.

    Warum: Regel 10.90 (Autor, 16.11.2026): Ein Möbel sperrt mit seiner Katalogmaske; gibt es seine
    Kollision ausnahmsweise ab, dann an den Pinsel. Eine unsichtbare Bodenkachel mit Kollision (so
    stand eine weiße Fliese unter der Jukebox im Diner) ist ein Hinweis. Beispiel:
    ``{"moebel": "bkFliesenWeiss", "feld": [8, 6], "kollision": true}`` → „Bodenkachel …“.
    """
    return [
        f"Bodenkachel {e['moebel']} {tuple(e['feld'])} sperrt: Möbel mit Katalogmaske sperren lassen "
        "oder den Kollisionspinsel nehmen (Regel 10.90)"
        for e in szene.get("objekte", [])
        if art_von(e["moebel"], moebel) == "boden_teil"
        and kollision_an(moebel.get(e["moebel"], {}), e)
        and "feld" in e
    ]

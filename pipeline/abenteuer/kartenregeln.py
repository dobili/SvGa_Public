"""Logikregeln des Kartenbauers: Drehung, Beziehungen, Zustand und Stil der Möbel.

Warum: Rückmeldungen des Autors (9.11.2026) zu den ersten Karten: Stühle zeigen vom Tisch weg, Möbel
mit Schubladen zur Wand, Pflanzen und Lampen allein mitten im Raum, kaputte neben neuen Möbeln,
Gegenstände über Figuren, Treppen ohne Antritt. Die Regeln brauchen Angaben in moebel.json:
``art`` (stuhl, tisch, pflanze, lampe, treppe, …), ``blick`` (unten, oben, links, rechts: wohin die
Vorderseite zeigt), ``zustand`` (neu, gebraucht, alt, kaputt) und ``stil`` (modern, rustikal, alt,
industrie, natur …). Szenen legen fest, welche Zustände und Stile erlaubt sind.
"""

K = 16
GESPERRT = {"#", "~", " "}
RICHTUNG = {"unten": (0, 1), "oben": (0, -1), "links": (-1, 0), "rechts": (1, 0)}
ALLEIN_VERBOTEN = {"pflanze", "lampe"}
STANDARD_ZUSTAND = ("neu", "gebraucht")


def _felder(s: dict) -> tuple[int, int, int, int]:
    """Fußfläche eines Möbels in Kacheln: links, oben, rechts, unten (unterste Reihe zählt)."""
    x0, x1 = s["x"] // K, (s["x"] + s["breite"] - 1) // K
    y1 = (s["y"] + s["hoehe"] - 1) // K
    y0 = y1 if s["hoehe"] <= K else (s["y"] // K) + 1
    return x0, y0, x1, y1


def _gesperrt(zeilen: list[str], x: int, y: int) -> bool:
    return not (0 <= y < len(zeilen) and 0 <= x < len(zeilen[0])) or zeilen[y][x] in GESPERRT


def _vorne(s: dict, blick: str) -> list[tuple[int, int]]:
    x0, y0, x1, y1 = _felder(s)
    dx, dy = RICHTUNG[blick]
    if dx:
        return [(x1 + 1 if dx > 0 else x0 - 1, y) for y in range(y0, y1 + 1)]
    return [(x, y1 + 1 if dy > 0 else y0 - 1) for x in range(x0, x1 + 1)]


def pruefe_regeln(szene: dict, zeilen: list[str], gesetzt: list[dict], moebel: dict) -> list[str]:
    befunde: list[str] = []
    zustaende = set(szene.get("zustand", STANDARD_ZUSTAND))
    stile = set(szene.get("stil", []))
    nach_id = {s["id"]: s for s in gesetzt}
    eintraege = {
        f"{e['moebel']}@{i}" if "id" not in e else e["id"]: e for i, e in enumerate(szene.get("objekte", []))
    }
    figurfelder = {tuple(f["feld"]) for f in szene.get("figuren", [])}
    figurfelder |= {(x, y - 1) for x, y in figurfelder}
    for s in gesetzt:
        angabe = moebel.get(s["name"], {})
        eintrag = eintraege.get(s["id"], {})
        name = s["name"]
        if "zustand" in angabe and angabe["zustand"] not in zustaende:
            befunde.append(
                f"{name}: Zustand „{angabe['zustand']}“ passt nicht zum Ort ({', '.join(sorted(zustaende))})"
            )
        if stile and "stil" in angabe and angabe["stil"] not in stile:
            befunde.append(
                f"{name}: Stil „{angabe['stil']}“ passt nicht zum Ort ({', '.join(sorted(stile))})"
            )
        if s["tiefe"] > 1:
            x0, x1 = s["x"] // K, (s["x"] + s["breite"] - 1) // K
            y0, y1 = s["y"] // K, (s["y"] + s["hoehe"] - 1) // K
            nah = [f for f in figurfelder if x0 <= f[0] <= x1 and y0 <= f[1] <= y1]
            if nah:
                befunde.append(f"{name} überdeckt eine Figur bei {nah[0]}")
        blick = angabe.get("blick")
        if blick in RICHTUNG and s["kollision"] and all(_gesperrt(zeilen, x, y) for x, y in _vorne(s, blick)):
            befunde.append(f"{name} zeigt mit der Vorderseite zur Wand ({blick})")
        if "zu" in eintrag and blick in RICHTUNG:
            ziel = nach_id.get(eintrag["zu"])
            if ziel:
                mx = (ziel["x"] + ziel["breite"] / 2) - (s["x"] + s["breite"] / 2)
                my = (ziel["y"] + ziel["hoehe"]) - (s["y"] + s["hoehe"])
                dx, dy = RICHTUNG[blick]
                if dx * mx + dy * my <= 0:
                    befunde.append(f"{name} schaut nicht zu {eintrag['zu']} ({blick})")
        art = angabe.get("art")
        if art in ALLEIN_VERBOTEN and not eintrag.get("an_wand"):
            x0, y0, x1, y1 = _felder(s)
            rand = [(x, y) for x in range(x0 - 1, x1 + 2) for y in range(y0 - 1, y1 + 2)]
            andere = [o for o in gesetzt if o is not s and o["kollision"]]
            neben_moebel = any(
                o["x"] // K - 1 <= x <= (o["x"] + o["breite"] - 1) // K + 1
                and (o["y"] + o["hoehe"] - 1) // K - 1 <= y <= (o["y"] + o["hoehe"] - 1) // K + 1
                for o in andere
                for x, y in rand
            )
            if not neben_moebel and not any(_gesperrt(zeilen, x, y) for x, y in rand):
                befunde.append(f"{name} ({art}) steht allein mitten im Raum")
        if art == "treppe":
            x0, _, x1, y1 = _felder(s)
            if all(_gesperrt(zeilen, x, y1 + 1) for x in range(x0, x1 + 1)):
                befunde.append(f"{name}: Treppe ohne freien Antritt unten")
    return befunde

"""Logikregeln des Kartenbauers: Drehung, Beziehungen, Zustand und Stil der Möbel.

Warum: Rückmeldungen des Autors (9.11.2026) zu den ersten Karten: Stühle zeigen vom Tisch weg, Möbel
mit Schubladen zur Wand, Pflanzen und Lampen allein mitten im Raum, kaputte neben neuen Möbeln,
Gegenstände über Figuren, Treppen ohne Antritt. Die Regeln brauchen Angaben in inhalte/abenteuer/moebel/:
``art`` (stuhl, tisch, pflanze, lampe, treppe, …), ``blick`` (unten, oben, links, rechts: wohin die
Vorderseite zeigt), ``zustand`` (neu, gebraucht, alt, kaputt) und ``stil`` (modern, rustikal, alt,
industrie, natur …). Szenen legen fest, welche Zustände und Stile erlaubt sind.
"""

K = 16
GESPERRT = {"#", "~", " "}
WAND = "#"
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
        # Nur innen: Draußen stehen Laternen und Kübel frei am Weg (KARTENREGELN 10.19).
        innen = szene.get("art") != "aussen"
        if innen and art in ALLEIN_VERBOTEN and not eintrag.get("an_wand"):
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
    return befunde + pruefe_raum(szene, zeilen, gesetzt, moebel)


# ---------------------------------------------------------------- Raumregeln (KARTENREGELN.md, 8.6)
# Abgeleitet aus den Beispielräumen des Zeichners (docs/spiel/KARTENREGELN.md, Abschnitt 8).

BELEGUNG_MIN, BELEGUNG_MAX = 0.20, 0.45  # Anteil der Bodenkacheln unter Möbeln mit Kollision (8.2.6)
# Lager und Archive leben von dichten Regalreihen (Rückmeldung des Autors zum Archiv, 9.11.2026):
# Szenen mit "dicht": true dürfen bis zu diesem Anteil belegt sein.
BELEGUNG_DICHT = 0.60
GANG_TIEFE = 2  # freie Kacheln vor jedem Eingang am Kartenrand (8.2.1)
BLICK_MIN, BLICK_MAX = 2, 4  # Abstand Sofa oder Sessel zu Fernseher oder Kamin in Kacheln (8.2.5)
SITZ = {"sofa", "sessel"}
BLICKZIELE = {"fernseher", "kamin"}
SCHRANKARTEN = {"schrank", "regal"}


def _sperrfelder(gesetzt: list[dict]) -> set[tuple[int, int]]:
    """Kacheln unter Möbeln mit Kollision (Fußfläche ohne die oberste Reihe hoher Möbel)."""
    felder: set[tuple[int, int]] = set()
    for s in gesetzt:
        if s["kollision"]:
            x0, y0, x1, y1 = _felder(s)
            felder |= {(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)}
    return felder


def _art(s: dict, moebel: dict) -> str | None:
    return moebel.get(s["name"], {}).get("art")


def pruefe_belegung(szene: dict, zeilen: list[str], gesetzt: list[dict]) -> list[str]:
    """Innenräume: 20–45 % der Bodenkacheln unter Möbeln (Lager und Archive mit "dicht": true bis
    60 %), sonst „karg“ oder „vollgestellt“.

    Beispiel: Generic Home des Zeichners, etwa ein Drittel der Bodenkacheln belegt.
    """
    if szene.get("art") != "innen":
        return []
    boden = {(x, y) for y, z in enumerate(zeilen) for x, c in enumerate(z) if c not in GESPERRT}
    if not boden:
        return []
    anteil = len(_sperrfelder(gesetzt) & boden) / len(boden)
    hoechstens = BELEGUNG_DICHT if szene.get("dicht") else BELEGUNG_MAX
    if anteil < BELEGUNG_MIN:
        return [f"Raum wirkt karg: {anteil:.0%} der Bodenkacheln belegt (Vorbild 20–45 %)"]
    if anteil > hoechstens:
        return [f"Raum wirkt vollgestellt: {anteil:.0%} der Bodenkacheln belegt (höchstens {hoechstens:.0%})"]
    return []


def _nach_innen(zeilen: list[str], x: int, y: int) -> tuple[int, int] | None:
    """Richtung vom Kartenrand ins Innere für ein Randfeld, sonst None."""
    hoehe, breite = len(zeilen), len(zeilen[0])
    if y == hoehe - 1:
        return (0, -1)
    if y == 0:
        return (0, 1)
    if x == 0:
        return (1, 0)
    if x == breite - 1:
        return (-1, 0)
    return None


def pruefe_eingaenge(szene: dict, zeilen: list[str], gesetzt: list[dict]) -> list[str]:
    """Vor jedem Eingang am Kartenrand liegen zwei freie Kacheln Boden (Gang, 8.2.1).

    Beispiel: Eisdiele des Zeichners, Gang drei Kacheln breit von der Tür zur Theke.
    """
    befunde, gesperrt = [], _sperrfelder(gesetzt)
    for a in szene.get("ausloeser", []):
        x, y = a["feld"]
        richtung = _nach_innen(zeilen, x, y)
        if not richtung:
            continue
        for schritt in range(1, GANG_TIEFE + 1):
            fx, fy = x + richtung[0] * schritt, y + richtung[1] * schritt
            if _gesperrt(zeilen, fx, fy) or (fx, fy) in gesperrt:
                befunde.append(f"Eingang {a['name']}: kein freier Gang von {GANG_TIEFE} Kacheln")
                break
    return befunde


def _luecke(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> tuple[int, int]:
    """Freie Kacheln zwischen zwei Rechtecken waagerecht und senkrecht (0 = berühren sich)."""
    dx = max(0, b[0] - a[2] - 1, a[0] - b[2] - 1)
    dy = max(0, b[1] - a[3] - 1, a[1] - b[3] - 1)
    return dx, dy


def pruefe_stuehle(szene: dict, gesetzt: list[dict], moebel: dict) -> list[str]:
    """Stühle mit ``zu`` stehen ohne Lücke an ihrem Tisch (8.2.3).

    Beispiel: Eisdiele des Zeichners, je zwei Stühle direkt links und rechts am Tisch.
    """
    befunde, nach_id = [], {s["id"]: s for s in gesetzt}
    for s, e in _mit_eintrag(szene, gesetzt):
        ziel = nach_id.get(e.get("zu", ""))
        if _art(s, moebel) == "stuhl" and ziel and _luecke(_felder(s), _felder(ziel)) != (0, 0):
            befunde.append(f"{s['name']} steht nicht direkt am Tisch {e['zu']}")
    return befunde


def _mit_eintrag(szene: dict, gesetzt: list[dict]) -> list[tuple[dict, dict]]:
    """Gesetzte Möbel mit ihrem Eintrag aus der Szene (gleiche Kennung wie in ``platziere``)."""
    eintraege = {e.get("id", f"{e['moebel']}@{i}"): e for i, e in enumerate(szene.get("objekte", []))}
    return [(s, eintraege.get(s["id"], {})) for s in gesetzt]


def _blickziel(ziel: dict, szene: dict, gesetzt: list[dict], moebel: dict) -> bool:
    """Ist ``ziel`` ein Fernseher oder Kamin oder trägt es einen (``auf``)?"""
    if _art(ziel, moebel) in BLICKZIELE:
        return True
    return any(
        e.get("auf") == ziel["id"] and _art(s, moebel) in BLICKZIELE for s, e in _mit_eintrag(szene, gesetzt)
    )


def pruefe_blickabstand(szene: dict, gesetzt: list[dict], moebel: dict) -> list[str]:
    """Sofa oder Sessel mit ``zu`` auf Fernseher oder Kamin steht 2–4 Kacheln davor (8.2.5).

    Abstand = Reihen (oder Spalten) zwischen den Fußflächen plus eins. Beispiel: TV-Studio des
    Zeichners, Zuschauerstühle drei Reihen vor dem Moderationstisch.
    """
    befunde, nach_id = [], {s["id"]: s for s in gesetzt}
    for s, e in _mit_eintrag(szene, gesetzt):
        ziel = nach_id.get(e.get("zu", ""))
        if _art(s, moebel) not in SITZ or not ziel or not _blickziel(ziel, szene, gesetzt, moebel):
            continue
        dx, dy = _luecke(_felder(s), _felder(ziel))
        abstand = max(dx, dy) + 1
        if not BLICK_MIN <= abstand <= BLICK_MAX:
            befunde.append(f"{s['name']} steht {abstand} Kacheln vor {e['zu']} (Vorbild 2–4)")
    return befunde


def pruefe_tueren(szene: dict, zeilen: list[str], gesetzt: list[dict], moebel: dict) -> list[str]:
    """Vor jeder Tür an der Wand (``art`` tuer, ``an_wand``) ist die Kachel davor frei (Platz für
    die Fußmatte, 8.1.5 und 10.8). Vor einer Tür der Nordwand liegt diese Kachel darunter; eine Tür
    in der Südwand (ihr Fuß steht auf der letzten Reihe) öffnet nach oben in den Raum. Türen ``auf``
    einem Gebäude prüft die Regel nicht: Dort steht der Auslöser vor dem Gebäude, und der
    Kartenbauer prüft ihn schon auf Erreichbarkeit.

    Beispiel: Haustür Whitlock in der Südwand (5, 12), frei sein muss (5, 10) über dem Türbild.
    """
    befunde, gesperrt = [], _sperrfelder(gesetzt)
    for s, e in _mit_eintrag(szene, gesetzt):
        if _art(s, moebel) != "tuer" or not e.get("an_wand"):
            continue
        x0, x1 = s["x"] // K, (s["x"] + s["breite"] - 1) // K
        fuss = (s["y"] + s["hoehe"] - 1) // K
        suedwand = fuss >= len(zeilen) - 1
        vor = s["y"] // K - 1 if suedwand else fuss + 1
        if all(_gesperrt(zeilen, x, vor) or (x, vor) in gesperrt for x in range(x0, x1 + 1)):
            befunde.append(f"{s['name']}: keine freie Kachel vor der Tür")
    return befunde


def pruefe_teppiche(gesetzt: list[dict], moebel: dict) -> list[str]:
    """Teppiche liegen nie unter Schränken oder Regalen (8.4.1)."""
    befunde = []
    for t in gesetzt:
        if _art(t, moebel) != "teppich":
            continue
        tx0, ty0 = t["x"] // K, t["y"] // K
        tx1, ty1 = (t["x"] + t["breite"] - 1) // K, (t["y"] + t["hoehe"] - 1) // K
        for s in gesetzt:
            if _art(s, moebel) not in SCHRANKARTEN:
                continue
            x0, y0, x1, y1 = _felder(s)
            if x0 <= tx1 and tx0 <= x1 and y0 <= ty1 and ty0 <= y1:
                befunde.append(f"{t['name']} liegt unter {s['name']}")
    return befunde


# Einzelmöbel, die zweimal gleich im selben Raum seltsam aussehen (KARTENREGELN 10.43).
EINZELSTUECK = {"schrank", "sofa", "fernseher", "globus", "vitrine", "pinnwand", "bild"}
# Teile von Zeilen und Serien (Küchenzeile, Theke, Spinde) dürfen sich wiederholen.
SERIENTEIL = ("arbeitsplatte", "theke", "tresen", "buffet", "spind", "modular", "links", "rechts", "mitte")


def pruefe_wandflaechen(szene: dict, zeilen: list[str]) -> list[str]:
    """Innen: Eine Wand, unter der Boden liegt, ist drei Reihen hoch (Krone und zwei Reihen
    Wandfläche), sonst sieht man sie nur von oben (KARTENREGELN 10.39).

    Warum: Im Diner waren die Wände der WCs und zur Küche nur Kronenstriche; dem Autor fehlte die
    dritte Dimension (9.11.2026).
    Beispiel: Boden bei (5, 9), Wand bei (5, 8), Boden bei (5, 7): Wand ohne Wandfläche.
    """
    if szene.get("art") != "innen":
        return []
    stellen = []
    for y in range(1, len(zeilen)):
        for x, z in enumerate(zeilen[y]):
            if z in GESPERRT or zeilen[y - 1][x] != WAND:
                continue
            if not all(y - d >= 0 and zeilen[y - d][x] == WAND for d in (1, 2, 3)):
                stellen.append((x, y - 1))
    return [f"Wand ohne Wandfläche bei {stellen[0]} ({len(stellen)} Felder)"] if stellen else []


def pruefe_doppelte(szene: dict, gesetzt: list[dict], moebel: dict) -> list[str]:
    """Innen: dasselbe Bild eines Einzelmöbels (Schrank, Sofa, Fernseher …) nicht zweimal im Raum,
    auch nicht unter zwei Namen (KARTENREGELN 10.43; zwei gleiche Schränke im Dachboden C)."""
    if szene.get("art") != "innen":
        return []
    zaehler: dict[str, list[str]] = {}
    for s in gesetzt:
        angabe = moebel.get(s["name"], {})
        teil = any(w in (s["name"] + angabe.get("quelle", "")).lower() for w in SERIENTEIL)
        if angabe.get("art") in EINZELSTUECK and not teil:
            zaehler.setdefault(angabe["quelle"], []).append(s["name"])
    return [
        f"{namen[0]} steht {len(namen)}-mal im Raum (gleiches Bild, Einzelstück)"
        for namen in zaehler.values()
        if len(namen) > 1
    ]


def pruefe_raum(szene: dict, zeilen: list[str], gesetzt: list[dict], moebel: dict) -> list[str]:
    """Alle Raumregeln aus Abschnitt 8.6 der Kartenregeln."""
    return (
        pruefe_belegung(szene, zeilen, gesetzt)
        + pruefe_eingaenge(szene, zeilen, gesetzt)
        + pruefe_stuehle(szene, gesetzt, moebel)
        + pruefe_blickabstand(szene, gesetzt, moebel)
        + pruefe_tueren(szene, zeilen, gesetzt, moebel)
        + pruefe_teppiche(gesetzt, moebel)
        + pruefe_wandflaechen(szene, zeilen)
        + pruefe_doppelte(szene, gesetzt, moebel)
    )

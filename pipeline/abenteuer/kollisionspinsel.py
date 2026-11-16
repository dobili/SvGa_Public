"""Kollisionspinsel: Kacheln einer Szene unabhängig von Bildern sperren oder freigeben.

Warum: Der Autor will im Karteneditor Kacheln einfach als gesperrt oder frei malen (Wunsch des
Autors, 16.11.2026): Ein Gebäudebild sperrt eine Fläche, durch die man gehen können soll, oder am
Rand fehlt eine unsichtbare Sperre. „Kollision bearbeiten“ je Bild (``objektkollision.py``) hilft
dabei nicht, weil es nur das eine Bild ändert. Drei optionale Felder auf Szenenebene:

- ``sperren`` (Liste ``[x, y]``): Diese Kacheln sperren zusätzlich.
- ``freigeben`` (Liste ``[x, y]``): Diese Kacheln sind begehbar, egal welches Möbel, welche Maske
  oder welches Rasterzeichen darunter liegt. Figuren und Statisten sperren weiter.
- ``freigeben_grund`` (Text): Pflicht, wenn eine Freigabe auf Wand, Wasser oder Leere des Rasters
  liegt (bewusst durch eine Wand gehen); sonst Befund im Kartenbau.

Regel (Freigabe bei Möbeln): Eine Maskenkachel eines Möbels entfällt, wenn ihr Pixelrechteck eine
freigegebene Kachel berührt (wie ``oberwelt/begehbar.ts``: Ein Möbel mit Feinschub sperrt jede
berührte Kachel). Der Kartenbau schreibt die so geänderte Maske an das Objekt (Eigenschaft
``maske``) und die Rasterkacheln in die Ebenen ``boden`` und ``waende``; dazu die Eigenschaften
``sperren`` und ``freigeben`` der Karte („3,4;5,6“), die ``begehbar.ts`` liest. Ohne die Felder
bleibt jede Karte gleich. Spiegel: Editor ``werkzeuge/karteneditor/js/geometrie.js``.
"""

from pipeline.abenteuer.maske import maskenfelder

K = 16
FELDER = ("sperren", "freigeben", "freigeben_grund")
GESPERRT = {"#", "~", " "}  # wie kartentiled.GESPERRT (Kreisimport vermeiden)
TRENNER = ";"  # zwischen den Kacheln in der Tiled-Eigenschaft
FELDTRENNER = ","
Feld = tuple[int, int]


def _ist_feld(wert: object) -> bool:
    return (
        isinstance(wert, list)
        and len(wert) == 2
        and all(isinstance(z, int) and not isinstance(z, bool) for z in wert)
    )


def _felder(szene: dict, name: str) -> set[Feld]:
    """Die gültigen Kacheln einer Liste (``sperren`` oder ``freigeben``); Ungültiges übergeht sie."""
    werte = szene.get(name, [])
    return {(w[0], w[1]) for w in werte if _ist_feld(w)} if isinstance(werte, list) else set()


def pinselfelder(szene: dict) -> tuple[set[Feld], set[Feld]]:
    """(gesperrte, freigegebene) Kacheln. Beispiel: ``{"sperren": [[0, 3]]}`` → ({(0, 3)}, set())."""
    return _felder(szene, "sperren"), _felder(szene, "freigeben")


def wende_an(gesperrt: set[Feld], szene: dict) -> set[Feld]:
    """Gesperrte Kacheln nach dem Pinsel: dazu die Sperren, ohne die Freigaben (die Freigabe sticht).

    Eingabe: Kacheln, die Raster und Möbel sperren (ohne Figuren, die bleiben gesperrt).
    Beispiel: {(1, 1), (2, 1)} mit ``sperren`` [[5, 5]] und ``freigeben`` [[2, 1]] → {(1, 1), (5, 5)}.
    """
    sperren, freigeben = pinselfelder(szene)
    return (gesperrt | sperren) - freigeben


def beruehrt(px: int, py: int) -> set[Feld]:
    """Die Kacheln, die ein 16 × 16 großes Pixelrechteck ab (px, py) berührt (1, 2 oder 4)."""
    return {
        (x, y) for x in range(px // K, (px + K - 1) // K + 1) for y in range(py // K, (py + K - 1) // K + 1)
    }


def _maske_aus(zellen: set[Feld], spalten: int, reihen: int) -> list[str]:
    breite = max([spalten] + [x + 1 for x, _ in zellen])
    hoehe = max([reihen] + [y + 1 for _, y in zellen])
    return ["".join("#" if (x, y) in zellen else "." for x in range(breite)) for y in range(hoehe)]


def gib_frei(gesetzt: list[dict], szene: dict) -> None:
    """Entfernt aus den Masken der gesetzten Möbel jede Kachel, die eine Freigabe berührt.

    Warum: So sehen Kartenbau, Prüfungen (``sperrfelder``, ``maskenfelder``) und App dieselbe
    Fläche, ohne dass jede Stelle den Pinsel kennen muss. Ändert ``maske`` und ``objektmaske`` (für
    die Tiled-Eigenschaft) nur, wenn wirklich eine gesperrte Kachel wegfällt.
    Beispiel: Sofa 64 × 32 auf (1, 1) sperrt (1..4, 2); ``freigeben`` [[2, 2]] → maske [„....“, „#.##“].
    """
    freigeben = pinselfelder(szene)[1]
    if not freigeben:
        return
    for s in gesetzt:
        if not s["kollision"]:
            continue
        zellen = maskenfelder(s)
        bleiben = {(a, b) for a, b in zellen if not beruehrt(s["x"] + a * K, s["y"] + b * K) & freigeben}
        if bleiben != zellen:
            s["maske"] = _maske_aus(bleiben, max(1, s["breite"] // K), max(1, s["hoehe"] // K))
            s["objektmaske"] = s["maske"]


def grundsperren(zeilen: list[str], gesetzt: list[dict]) -> set[Feld]:
    """Was Raster und Möbel ohne Pinsel sperren (für Hinweise und den Bericht des Rücklaufs)."""
    felder = {(x, y) for y, zeile in enumerate(zeilen) for x, z in enumerate(zeile) if z in GESPERRT}
    for s in gesetzt:
        if s["kollision"]:
            for a, b in maskenfelder(s):
                felder |= beruehrt(s["x"] + a * K, s["y"] + b * K)
    return felder


def eigenschaften(szene: dict) -> list[dict]:
    """Die Tiled-Eigenschaften ``sperren`` und ``freigeben`` der Karte (nur, wenn vorhanden).

    Beispiel: ``{"sperren": [[0, 3], [0, 4]]}`` → [{"name": "sperren", …, "value": "0,3;0,4"}].
    """
    ergebnis = []
    for name, felder in zip(("sperren", "freigeben"), pinselfelder(szene), strict=True):
        if felder:
            wert = TRENNER.join(f"{x}{FELDTRENNER}{y}" for x, y in sorted(felder, key=lambda f: (f[1], f[0])))
            ergebnis.append({"name": name, "type": "string", "value": wert})
    return ergebnis


def _formbefunde(szene: dict) -> list[str]:
    befunde = []
    for name in ("sperren", "freigeben"):
        werte = szene.get(name)
        if werte is None:
            continue
        if not isinstance(werte, list) or not all(_ist_feld(w) for w in werte):
            befunde.append(f"{name} muss eine Liste von [x, y] sein")
        elif len({tuple(w) for w in werte}) != len(werte):
            befunde.append(f"{name}: Kacheln doppelt")
    if "freigeben_grund" in szene and not isinstance(szene["freigeben_grund"], str):
        befunde.append("freigeben_grund muss ein Text sein")
    return befunde


def pinselbefunde(szene: dict, zeilen: list[str]) -> list[str]:
    """Befunde zu den gemalten Kacheln einer Szene.

    Regel (Wunsch des Autors, 16.11.2026): Eine Freigabe auf Wand, Wasser oder Leere braucht
    ``freigeben_grund``; Kacheln außerhalb der Karte, Kacheln in beiden Listen und Auslöser auf einer
    gemalten Sperre (außer ``auf_moebel``) sind Befunde.
    Beispiel: ``"freigeben": [[0, 0]]`` auf „#“ ohne Grund → „Freigabe (0, 0) auf Wand oder Wasser
    „#“ ohne freigeben_grund“.
    """
    befunde = _formbefunde(szene)
    sperren, freigeben = pinselfelder(szene)
    hoehe, breite = len(zeilen), len(zeilen[0]) if zeilen else 0
    grund = str(szene.get("freigeben_grund", "")).strip()
    for name, felder in (("Sperre", sperren), ("Freigabe", freigeben)):
        for x, y in sorted(felder):
            if not (0 <= x < breite and 0 <= y < hoehe):
                befunde.append(f"{name} ({x}, {y}) liegt außerhalb der Karte")
            elif name == "Freigabe" and zeilen[y][x] in GESPERRT and not grund:
                befunde.append(
                    f"Freigabe ({x}, {y}) auf Wand oder Wasser {zeilen[y][x]!r} ohne freigeben_grund"
                )
    for x, y in sorted(sperren & freigeben):
        befunde.append(f"Kachel ({x}, {y}) ist zugleich gesperrt und freigegeben")
    for a in szene.get("ausloeser", []):
        if tuple(a["feld"]) in sperren - freigeben and not a.get("auf_moebel"):
            befunde.append(f"{a['name']} liegt auf einer gemalten Sperre {tuple(a['feld'])}")
    return befunde


def pinselhinweise(szene: dict, zeilen: list[str], gesetzt_ohne_pinsel: list[dict]) -> list[str]:
    """Hinweise: Freigaben, die ohnehin begehbar sind, und Sperren auf ohnehin gesperrten Kacheln.

    Eingabe: die Möbel, gesetzt ohne die Freigaben (``platziere`` mit leerem ``freigeben``).
    Beispiel: ``"sperren": [[0, 0]]`` auf der Randwand → „Sperre (0, 0) ist ohnehin gesperrt“.
    """
    zu = grundsperren(zeilen, gesetzt_ohne_pinsel)
    sperren, freigeben = pinselfelder(szene)
    hinweise = [f"Sperre ({x}, {y}) ist ohnehin gesperrt" for x, y in sorted(sperren & zu)]
    hinweise += [f"Freigabe ({x}, {y}) ist ohnehin begehbar" for x, y in sorted(freigeben - zu)]
    return hinweise


def _flaeche(s: dict) -> set[Feld]:
    return {
        (x, y)
        for x in range(s["x"] // K, (s["x"] + s["breite"] - 1) // K + 1)
        for y in range(s["y"] // K, (s["y"] + s["hoehe"] - 1) // K + 1)
    }


def _was_dort_liegt(feld: Feld, zeilen: list[str], gesetzt: list[dict]) -> str:
    """Was an einer Kachel ohne Pinsel liegt: sperrende Bilder, sonst Bilder darüber, sonst das Raster."""
    sperrend = sorted(
        {
            s["name"]
            for s in gesetzt
            if s["kollision"]
            and any(feld in beruehrt(s["x"] + a * K, s["y"] + b * K) for a, b in maskenfelder(s))
        }
    )
    if sperrend:
        return f"unter {', '.join(sperrend)} (sperrte dort)"
    darueber = sorted({s["name"] for s in gesetzt if feld in _flaeche(s)})
    x, y = feld
    zeichen = zeilen[y][x] if 0 <= y < len(zeilen) and 0 <= x < len(zeilen[y]) else None
    raster = "außerhalb der Karte" if zeichen is None else f"Raster {zeichen!r}"
    if darueber:
        return f"unter {', '.join(darueber)} (sperrte dort nicht), {raster}"
    return f"kein Bild, {raster}"


def pinselzeilen(vorher: dict, nachher: dict, moebel: dict | None = None) -> list[str]:
    """Berichtszeilen des Rücklaufs: neue und entfernte Pinselkacheln, gruppiert nach dem Bild darunter.

    Warum: Daraus lernt der Hauptchat, welche Katalogmasken falsch sind (Wunsch des Autors,
    16.11.2026). Beispiel: „Kollision: Pinsel gibt frei unter mf4Sofa (sperrte dort): (2, 2), (3, 2)“.
    """
    from pipeline.abenteuer.kartenbau import platziere, raster
    from pipeline.abenteuer.moebelliste import lade_moebel

    if all(vorher.get(k) == nachher.get(k) for k in FELDER) or not nachher.get("raster"):
        return []
    moebel = lade_moebel() if moebel is None else moebel
    zeilen = raster(nachher)
    gesetzt = platziere({**nachher, "freigeben": []}, moebel)[0]
    ergebnis = []
    for name, wort in (("sperren", "sperrt"), ("freigeben", "gibt frei")):
        alt, neu = _felder(vorher, name), _felder(nachher, name)
        gruppen: dict[str, list[Feld]] = {}
        for feld in sorted(neu - alt, key=lambda f: (f[1], f[0])):
            gruppen.setdefault(_was_dort_liegt(feld, zeilen, gesetzt), []).append(feld)
        for was, felder in gruppen.items():
            ergebnis.append(f"Kollision: Pinsel {wort} {was}: {', '.join(map(str, felder))}")
        if weg := sorted(alt - neu, key=lambda f: (f[1], f[0])):
            ergebnis.append(f"Pinsel entfernt ({name}): {', '.join(map(str, weg))}")
    if vorher.get("freigeben_grund") != nachher.get("freigeben_grund") and nachher.get("freigeben_grund"):
        ergebnis.append(f"Grund der Freigaben: {nachher['freigeben_grund']}")
    return ergebnis

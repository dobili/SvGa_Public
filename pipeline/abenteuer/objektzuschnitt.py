"""Zuschnitt eines Objekts in einer Szene: links, oben, rechts und unten Pixel wegnehmen (Karteneditor).

Warum: Der Autor möchte vorhandene Bilder beschneiden, etwa aus einem Zaunstück mit Pfosten nur den
Pfosten machen (Wunsch des Autors, 16.11.2026). Die Szene speichert das im optionalen Objektfeld
``zuschnitt``: ``[links, oben, rechts, unten]`` in Pixeln des Katalogbilds (nach dessen
``ausschnitt``). Fehlt das Feld, bleibt alles wie vorher.

Regeln (gleich in ``objektform.py``, App ``oberwelt/moebelform.ts`` und Editor ``js/zuschnitt.js``):

- Der Zuschnitt wirkt zuerst, vor Maßstab, Spiegeln und Drehung. Das Objekt ist danach so groß wie
  der Ausschnitt; ``feld`` und ``versatz`` nennen die linke obere Ecke des Ausschnitts.
- Die Katalogmaske (auch die Standardregel aus ``maske.py`` mit ``frei_unten``) wird mitbeschnitten.
  Das Raster des Ausschnitts beginnt an seiner linken oberen Ecke und zählt angefangene Kacheln
  mit (aufgerundet). Eine neue Kachel sperrt, wenn sie eine gesperrte Katalogkachel berührt:
  Kacheln, die ganz wegfallen, verschwinden, eine angeschnittene gilt, solange etwas übrig ist.
- Eine eigene Maske am Eintrag gilt im Raster des beschnittenen (und skalierten) Bildes.
- Die Tiefe folgt der unteren Kante des beschnittenen Bildes (der Kartenbau rechnet mit ``hoehe``).

Beispiel: Zaun 64 × 32 (oberste Reihe frei) mit ``zuschnitt`` [26, 0, 32, 0] → Pfosten 6 × 32,
Maske [".", "#"].
"""

K = 16
Zuschnitt = tuple[int, int, int, int]


def zuschnitt_von(eintrag: dict) -> Zuschnitt | None:
    """Der Zuschnitt eines Eintrags oder gesetzten Stücks, oder None ohne (oder bei lauter Nullen).

    Warum: Die Szene schreibt eine Liste, die Tiled-Karte einen Text („26,0,32,0“, Tiled kennt keine
    Listen) und die Pixelprüfungen ein Tupel (hashbarer Formschlüssel). Alle drei gelten.
    Beispiel: ``{"zuschnitt": [26, 0, 32, 0]}`` → (26, 0, 32, 0); ``{"zuschnitt": "0,0,0,0"}`` → None.
    """
    wert = eintrag.get("zuschnitt")
    if wert is None:
        return None
    teile = wert.split(",") if isinstance(wert, str) else list(wert)
    if len(teile) != 4:
        return None
    z = tuple(max(0, int(t)) for t in teile)
    return None if not any(z) else z  # type: ignore[return-value]


def beschnittene_groesse(breite: int, hoehe: int, z: Zuschnitt) -> tuple[int, int]:
    """Breite und Höhe des Ausschnitts, mindestens 1 Pixel. Beispiel: 64 × 32, [26, 0, 32, 0] → (6, 32)."""
    return max(1, breite - z[0] - z[2]), max(1, hoehe - z[1] - z[3])


def raster(breite: int, hoehe: int) -> tuple[int, int]:
    """Spalten und Reihen der Maske eines beschnittenen Bildes (angefangene Kacheln zählen).

    Beispiel: 6 × 32 → (1, 2); 40 × 16 → (3, 1).
    """
    return max(1, -(-breite // K)), max(1, -(-hoehe // K))


def standardmaske(spalten: int, reihen: int, frei_unten: int = 0) -> list[str]:
    """Die Standardregel aus ``maske.py`` als Maske: alles außer der obersten Reihe (bei mehr als
    einer) und den untersten ``frei_unten``. Beispiel: (2, 2) → ["..", "##"]."""
    oben = 1 if reihen > 1 else 0
    return [("#" if oben <= y < reihen - frei_unten else ".") * spalten for y in range(reihen)]


def katalogmaske(angabe: dict) -> list[str]:
    """Die wirksame Maske des Katalogbilds (eigene ``maske`` oder Standardregel), voll aufgefüllt.

    Beispiel: Zaun 64 × 32 ohne Maske → ["....", "####"].
    """
    spalten, reihen = max(1, angabe["breite"] // K), max(1, angabe["hoehe"] // K)
    if "maske" in angabe:
        zeilen = [z.ljust(spalten, ".")[:spalten] for z in angabe["maske"][:reihen]]
        return zeilen + ["." * spalten] * (reihen - len(zeilen))
    return standardmaske(spalten, reihen, angabe.get("frei_unten", 0))


def _beruehrte(anfang: int, laenge: int, versatz: int, anzahl: int) -> range:
    """Neue Kacheln, die die alte Kachel [anfang, anfang + 16) nach dem Versatz berührt."""
    links = max(0, anfang - versatz)
    rechts = min(laenge, anfang + K - versatz)
    if rechts <= links:
        return range(0)
    return range(links // K, min(anzahl, (rechts - 1) // K + 1))


def beschneide_maske(maske: list[str], z: Zuschnitt, breite: int, hoehe: int) -> list[str]:
    """Eine Maske im Kachelraster des Katalogbilds auf den Ausschnitt gebracht.

    Eingaben: volle Maske (``katalogmaske``), Zuschnitt, Größe des Ausschnitts in Pixeln.
    Ausgabe: Maske im Raster des Ausschnitts (``raster``).
    Beispiel: ["....", "####"] mit [26, 0, 32, 0], Ausschnitt 6 × 32 → [".", "#"].
    Sonderfall: Ein Zuschnitt, der nicht auf 16 px fällt, verschiebt das Raster; eine gesperrte
    Katalogkachel kann dann zwei neue Kacheln berühren und sperrt beide.
    """
    spalten, reihen = raster(breite, hoehe)
    neu = [["."] * spalten for _ in range(reihen)]
    for y, zeile in enumerate(maske):
        for x, zeichen in enumerate(zeile):
            if zeichen != "#":
                continue
            for ny in _beruehrte(y * K, hoehe, z[1], reihen):
                for nx in _beruehrte(x * K, breite, z[0], spalten):
                    neu[ny][nx] = "#"
    return ["".join(z) for z in neu]


def beschnitten(angabe: dict, eintrag: dict) -> tuple[dict, bool]:
    """Die Angabe nach dem Zuschnitt (vor Maßstab und Drehung) und ob beschnitten wurde.

    Ausgabe: Kopie mit ``breite``, ``hoehe`` des Ausschnitts und beschnittener Katalogmaske, ohne
    ``frei_unten`` (steckt in der Maske) und ohne ``sichtbar_breite`` des ganzen Bildes (``platte``
    rechnet ``objektrichtung.forme_rechteck`` um). Ohne Zuschnitt dieselbe Angabe.
    Beispiel: Zaun 64 × 32, [26, 0, 32, 0] → breite 6, hoehe 32, maske [".", "#"].
    """
    z = zuschnitt_von(eintrag)
    if z is None:
        return angabe, False
    breite, hoehe = beschnittene_groesse(angabe["breite"], angabe["hoehe"], z)
    neu = {k: v for k, v in angabe.items() if k not in ("frei_unten", "sichtbar_breite")}
    neu.update(breite=breite, hoehe=hoehe, maske=beschneide_maske(katalogmaske(angabe), z, breite, hoehe))
    return neu, True


def beschneide_rechteck(r: tuple, breite: int, hoehe: int, z: Zuschnitt | None) -> tuple:
    """Ein Rechteck (links, oben, rechts, unten) im Katalogbild in den Ausschnitt verschoben und
    auf ihn begrenzt. Beispiel: Platte (0, 0, 32, 8) im Bild 32 × 16, [8, 0, 0, 0] → (0, 0, 24, 8)."""
    if z is None:
        return r
    b, h = beschnittene_groesse(breite, hoehe, z)
    x0, y0 = min(b, max(0, r[0] - z[0])), min(h, max(0, r[1] - z[1]))
    return x0, y0, max(x0, min(b, r[2] - z[0])), max(y0, min(h, r[3] - z[1]))


def zuschnittbefunde(szene: dict, moebel: dict) -> list[str]:
    """Ungültige Zuschnitte: keine vier ganzen Zahlen ab 0, oder nichts mehr übrig.

    Beispiel: Zaun 64 breit mit [40, 0, 30, 0] → „zaun (2, 3): zuschnitt lässt nichts übrig“.
    """
    befunde = []
    for eintrag in szene.get("objekte", []):
        wert = eintrag.get("zuschnitt")
        if wert is None:
            continue
        wo = f"{eintrag.get('moebel')} {tuple(eintrag.get('feld', ()))}"
        if (
            not isinstance(wert, list)
            or len(wert) != 4
            or not all(isinstance(t, int) and t >= 0 for t in wert)
        ):
            befunde.append(f"{wo}: zuschnitt muss vier ganze Zahlen ab 0 sein (links, oben, rechts, unten)")
            continue
        angabe = moebel.get(eintrag.get("moebel", ""))
        if angabe and (wert[0] + wert[2] >= angabe["breite"] or wert[1] + wert[3] >= angabe["hoehe"]):
            befunde.append(f"{wo}: zuschnitt lässt nichts übrig")
    return befunde

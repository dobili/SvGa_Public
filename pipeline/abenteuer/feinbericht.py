"""Kollision fein: Befunde und Hinweise im Kartenbau, Zeilen für den Bericht des Rücklaufs.

Warum: Die feinen Felder (``kollisionfein.py``) kommen aus dem Karteneditor (Wunsch des Autors,
16.11.2026). Der Kartenbau prüft ihre Form und Lage wie beim groben Pinsel
(``kollisionspinsel.pinselbefunde``), der Rücklauf nennt jede feine Sperre und Freigabe mit Kachel
und Anteil, etwa „(5, 7) obere Hälfte“, damit der Hauptchat sieht, was der Autor wollte.
"""

from pipeline.abenteuer.kollisionfein import (
    FELDER,
    ZELLEN,
    Z,
    feinlisten,
    ist_feinmaske,
    sperrzellen,
    zellen_der_maske,
)
from pipeline.abenteuer.kollisionspinsel import GESPERRT, pinselfelder

Feld = tuple[int, int]
# Wörter für einen Teil an einer Kante: Zahl der Zellen → (Artikelform, Wort).
TEILE = {1: ("es", "Viertel"), 2: ("e", "Hälfte"), 3: ("e", "drei Viertel")}


def _teil(nummern: list[int], anfang: str, ende: str, richtung: str) -> str:
    """Ein zusammenhängender Teil einer Kachelkante in Worten.

    Beispiel: [0, 1] mit „ober“, „unter“ → „obere Hälfte“; [3] → „unteres Viertel“;
    [1, 2] → „mittlere Hälfte (waagrecht)“; [1] → „2. Viertel von oben“.
    """
    endung, wort = TEILE[len(nummern)]
    if nummern[0] == 0:
        return f"{anfang}{endung} {wort}"
    if nummern[-1] == Z - 1:
        return f"{ende}{endung} {wort}"
    if len(nummern) == 2:
        return f"mittlere Hälfte ({richtung})"
    return f"{nummern[0] + 1}. Viertel von {'oben' if anfang == 'ober' else 'links'}"


def anteil(maske: str) -> str:
    """Der Anteil einer Kachelmaske in Worten.

    Beispiele: „########........“ → „obere Hälfte“; „#...#...#...#...“ → „linkes Viertel“;
    „##..##..........“ → „obere Hälfte, linke Hälfte“; unregelmäßig → „5 von 16 Zellen“.
    """
    zellen = {(i % Z, i // Z) for i, c in enumerate(maske) if c == "#"}
    if not zellen:
        return "nichts"
    if len(zellen) == ZELLEN:
        return "ganze Kachel"
    spalten = sorted({x for x, _ in zellen})
    reihen = sorted({y for _, y in zellen})
    rechteck = len(zellen) == len(spalten) * len(reihen)
    am_stueck = spalten[-1] - spalten[0] == len(spalten) - 1 and reihen[-1] - reihen[0] == len(reihen) - 1
    if not (rechteck and am_stueck):
        return f"{len(zellen)} von {ZELLEN} Zellen"
    teile = []
    if len(reihen) < Z:
        teile.append(_teil(reihen, "ober", "unter", "waagrecht"))
    if len(spalten) < Z:
        teile.append(_teil(spalten, "link", "recht", "senkrecht"))
    return ", ".join(teile)


def _formbefunde(szene: dict) -> list[str]:
    befunde = []
    for name in FELDER:
        werte = szene.get(name)
        if werte is None:
            continue
        gut = isinstance(werte, list) and all(
            isinstance(w, list)
            and len(w) == 3
            and all(isinstance(z, int) for z in w[:2])
            and ist_feinmaske(w[2])
            for w in werte
        )
        if not gut:
            befunde.append(f"{name} muss eine Liste von [x, y, 16 Zeichen „#“ oder „.“] sein")
        elif len({(w[0], w[1]) for w in werte}) != len(werte):
            befunde.append(f"{name}: Kacheln doppelt")
    return befunde


def feinbefunde(szene: dict, zeilen: list[str], betretbar: frozenset = frozenset()) -> list[str]:
    """Befunde zu den feinen Feldern einer Szene.

    Regel (Wunsch des Autors, 16.11.2026, wie beim groben Pinsel): Kacheln außerhalb der Karte,
    Kacheln grob und fein zugleich, Zellen zugleich gesperrt und frei, eine feine Freigabe in Wand,
    Wasser oder Leere ohne ``freigeben_grund`` und Auslöser auf einer feinen Sperre (außer
    ``auf_moebel``: Der Held kann dort nicht mittig stehen) sind Befunde. Ausnahme: Die Kachel ist in
    ``betretbar`` (``durchgang.betretbare_kacheln``), die Mitte des Helden passt also zwischen die
    feinen Sperren; ein Übergang löst aus, sobald sie auf dem Auslöser steht (Treppe im Wohnzimmer
    zwischen den fein gesetzten Geländerkanten, Karteneditor 16.11.2026).
    Beispiel: ``"sperren_fein": [[0, 0, …]]`` und ``"sperren": [[0, 0]]`` → „Kachel (0, 0) ist grob
    und fein bemalt“.
    """
    befunde = _formbefunde(szene)
    sperren, freigeben = feinlisten(szene)
    grob = pinselfelder(szene)[0] | pinselfelder(szene)[1]
    hoehe, breite = len(zeilen), len(zeilen[0]) if zeilen else 0
    grund = str(szene.get("freigeben_grund", "")).strip()
    for wort, felder in (("Feine Sperre", sperren), ("Feine Freigabe", freigeben)):
        for x, y in sorted(felder):
            if not (0 <= x < breite and 0 <= y < hoehe):
                befunde.append(f"{wort} ({x}, {y}) liegt außerhalb der Karte")
            elif wort == "Feine Freigabe" and zeilen[y][x] in GESPERRT and not grund:
                befunde.append(
                    f"Feine Freigabe ({x}, {y}) in Wand oder Wasser {zeilen[y][x]!r} ohne freigeben_grund"
                )
    for x, y in sorted((set(sperren) | set(freigeben)) & grob):
        befunde.append(f"Kachel ({x}, {y}) ist grob und fein bemalt")
    for feld in sorted(set(sperren) & set(freigeben)):
        if zellen_der_maske(feld, sperren[feld]) & zellen_der_maske(feld, freigeben[feld]):
            befunde.append(f"Kachel {feld}: Zellen zugleich fein gesperrt und frei")
    zu = {f for f, m in sperren.items() if "#" in m}
    for a in szene.get("ausloeser", []):
        if tuple(a["feld"]) in zu and not a.get("auf_moebel") and tuple(a["feld"]) not in betretbar:
            befunde.append(
                f"{a['name']} liegt auf einer feinen Sperre {tuple(a['feld'])}: "
                "Der Held kann dort nicht mittig stehen"
            )
    return befunde


def feinhinweise(szene: dict, zeilen: list[str], gesetzt_ohne_pinsel: list[dict]) -> list[str]:
    """Hinweise: ganze oder leere feine Kacheln, Sperren auf schon gesperrten und Freigaben auf
    schon freien Zellen. Eingabe: die Möbel ohne Freigaben gesetzt (wie ``pinselhinweise``).

    Beispiel: ``"sperren_fein": [[0, 0, „################“]]`` → „Feine Sperre (0, 0) ist ganz
    gesperrt: grob schreiben“.
    """
    sperren, freigeben = feinlisten(szene)
    grund = sperrzellen(zeilen, gesetzt_ohne_pinsel, {})
    hinweise = []
    for wort, felder, gesperrt in (("Feine Sperre", sperren, True), ("Feine Freigabe", freigeben, False)):
        for feld, maske in sorted(felder.items()):
            zellen = zellen_der_maske(feld, maske)
            if len(zellen) in (0, ZELLEN):
                hinweise.append(
                    f"{wort} {feld} ist {'leer' if not zellen else 'eine ganze Kachel'}: grob schreiben"
                )
            elif gesperrt and zellen <= grund:
                hinweise.append(f"{wort} {feld} ist ohnehin gesperrt")
            elif not gesperrt and not zellen & grund:
                hinweise.append(f"{wort} {feld} ist ohnehin begehbar")
    return hinweise


def _liste(felder: dict[Feld, str]) -> str:
    return ", ".join(f"{f} {anteil(m)}" for f, m in sorted(felder.items(), key=lambda e: e[0][::-1]))


def feinzeilen(vorher: dict, nachher: dict, moebel: dict | None = None) -> list[str]:
    """Berichtszeilen des Rücklaufs zu den feinen Feldern einer Karte.

    Warum: Der Bericht nennt jede feine Sperre und Freigabe mit Kachel und Anteil (Wunsch des
    Autors, 16.11.2026) und, wie beim groben Pinsel (``pinselzeilen``), das Bild darunter.
    Beispiel: „Kollision: Pinsel sperrt fein kein Bild, Raster '.': (5, 7) obere Hälfte“.
    """
    from pipeline.abenteuer.kartenbau import platziere, raster
    from pipeline.abenteuer.kollisionspinsel import _was_dort_liegt
    from pipeline.abenteuer.moebelliste import lade_moebel

    if all(vorher.get(k) == nachher.get(k) for k in FELDER) or not nachher.get("raster"):
        return []
    moebel = lade_moebel() if moebel is None else moebel
    zeilen = raster(nachher)
    gesetzt = platziere({**nachher, "freigeben": [], "freigeben_fein": []}, moebel)[0]
    ergebnis = []
    for name, wort, nummer in (("sperren_fein", "sperrt", 0), ("freigeben_fein", "gibt frei", 1)):
        alt, neu = feinlisten(vorher)[nummer], feinlisten(nachher)[nummer]
        gruppen: dict[str, dict[Feld, str]] = {}
        for feld, maske in neu.items():
            if alt.get(feld) != maske:
                gruppen.setdefault(_was_dort_liegt(feld, zeilen, gesetzt), {})[feld] = maske
        for was, felder in gruppen.items():
            ergebnis.append(f"Kollision: Pinsel {wort} fein {was}: {_liste(felder)}")
        if weg := sorted(set(alt) - set(neu), key=lambda f: f[::-1]):
            ergebnis.append(f"Pinsel entfernt ({name}): {', '.join(map(str, weg))}")
    return ergebnis


def maske_fein_text(fein: list[str]) -> str:
    """Eine feine Objektmaske kurz beschrieben, je Kachel mit Anteil.

    Beispiel: ["####", "####", "....", "...."] → „(0, 0) obere Hälfte“.
    """
    teile = []
    reihen, spalten = -(-len(fein) // Z), max([0] + [-(-len(z) // Z) for z in fein])
    for b in range(reihen):
        for a in range(spalten):
            maske = "".join(
                (fein[b * Z + j] if b * Z + j < len(fein) else "").ljust((a + 1) * Z, ".")[a * Z : a * Z + Z]
                for j in range(Z)
            )
            if "#" in maske:
                teile.append(f"({a}, {b}) {anteil(maske)}")
    return "; ".join(teile) or "nichts gesperrt"

"""Treppenloch aus Bildern (KARTENREGELN 10.89): Loch im Raster, Treppe darunter, Geländer ringsum.

Warum: Der Autor baut Abgänge im Karteneditor nicht mehr mit fertigen Lochbildern, sondern aus Teilen
(Antwort zu RO32, 16.11.2026): „Loch im Boden, darunter ein Ausschnitt von der im unteren Raum
verwendeten Treppe mit 25 % Transparenz, und um das Loch herum an den Stellen, wo man nicht
durchgehen soll, Geländer.“ Die Gemini-Lochbilder (``bodenoeffnung``) fand er unschön und unflexibel.

Regeln je Abgang (Übergang eines Innenraums auf eine Karte mit tieferer Ebene, ``uebergangsbilder.ebene``):

1. **Kein Lochbild:** Am Auslöser liegt kein deckendes Bild mit ``bodenoeffnung`` oder einer Treppe
   nach unten (``richtung`` „runter“, etwa ``mf12TreppenlochZimmer``, ``cc12TreppeAb``).
2. **Loch im Raster:** Die Auslöser liegen auf Leere („ “), der ersten Reihe des Lochs.
3. **Treppe darunter:** Im Loch liegt ein Treppenbild (Art ``treppe``) mit Deckkraft 25. Es ist ein
   Ausschnitt der Treppe, die im unteren Raum am Gegenauslöser steht (dieselbe ``quelle``).
4. **Geländer:** An jeder Seite des Lochs, die weder Wand noch Zugang ist, steht ein Geländerteil
   (Art ``zaun``) auf der Kante (höchstens eine halbe Kachel daneben). Zugang ist die Seite, an der
   die Ankunft liegt.
5. **Ankunft davor:** Jeder Auslöser nennt seine ``ankunft``, eine Bodenkachel neben dem Loch.

Aufruf: ``python -m pipeline.abenteuer.treppenloch`` listet die Befunde aller Szenen; im Kartenbau als
Befund „Treppenloch:“. Beispiel aus dem Spiel: Zimmer in Maple Falls (Loch (1..2, 4..5), Zugang von
Norden, Geländer unten und rechts, links die Wand).
"""

import sys
from functools import cache

from pipeline.abenteuer.objektform import deckkraft_von
from pipeline.abenteuer.uebergangsbilder import ebene

K = 16
LEER = " "
GESPERRT = {"#", "~", LEER}
DECKKRAFT_LOCH = 25
# Geländer liegt auf der Kante: höchstens eine halbe Kachel neben ihr (Pixel).
KANTENBAND = K // 2
RICHTUNGEN = {"nord": (0, -1), "sued": (0, 1), "west": (-1, 0), "ost": (1, 0)}
Feld = tuple[int, int]


@cache
def _uebergaenge() -> tuple[tuple[dict, ...], dict[str, dict]]:
    from pipeline.abenteuer.uebergaenge import szenen, uebergaenge

    return tuple(uebergaenge()), szenen()


def abgaenge(szene: dict) -> dict[str, dict]:
    """Auslösernamen eines Innenraums, die auf eine tiefere Karte führen → Regel aus orte.json.

    Beispiel: Bibliothek Cedar Creek → {"kellertreppe": {… "ziel": {"karte": "cedarCreek.archiv"}}}.
    """
    if szene.get("art") != "innen":
        return {}
    from pipeline.abenteuer.uebergaenge import regel_fuer

    liste, _ = _uebergaenge()
    karte, ergebnis = szene.get("karte", ""), {}
    for name in sorted({a["name"] for a in szene.get("ausloeser", [])}):
        regel = regel_fuer(list(liste), karte, name)
        ziel = (regel or {}).get("ziel", {}).get("karte")
        if regel and regel.get("art") == "uebergang" and ziel and ebene(ziel) < ebene(karte):
            ergebnis[name] = regel
    return ergebnis


def loch(zeilen: list[str], start: set[Feld]) -> set[Feld]:
    """Die zusammenhängende Leere, in der die Auslöser liegen (vier Nachbarn)."""
    offen, gesehen = [f for f in start if _zeichen(zeilen, f) == LEER], set()
    while offen:
        x, y = offen.pop()
        if (x, y) in gesehen:
            continue
        gesehen.add((x, y))
        offen += [
            (x + dx, y + dy) for dx, dy in RICHTUNGEN.values() if _zeichen(zeilen, (x + dx, y + dy)) == LEER
        ]
    return gesehen


def _zeichen(zeilen: list[str], feld: Feld) -> str:
    x, y = feld
    return zeilen[y][x] if 0 <= y < len(zeilen) and 0 <= x < len(zeilen[y]) else "#"


def _rechteck(s: dict) -> tuple[int, int, int, int]:
    return s["x"], s["y"], s["x"] + s["breite"], s["y"] + s["hoehe"]


def _schneidet(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> bool:
    return a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]


def _kachel(feld: Feld) -> tuple[int, int, int, int]:
    return feld[0] * K, feld[1] * K, (feld[0] + 1) * K, (feld[1] + 1) * K


def _kantenband(feld: Feld, richtung: str) -> tuple[int, int, int, int]:
    """Streifen um die Kante einer Lochkachel zur Seite ``richtung`` (je halbe Kachel innen und außen)."""
    x0, y0, x1, y1 = _kachel(feld)
    return {
        "nord": (x0, y0 - KANTENBAND, x1, y0 + KANTENBAND),
        "sued": (x0, y1 - KANTENBAND, x1, y1 + KANTENBAND),
        "west": (x0 - KANTENBAND, y0, x0 + KANTENBAND, y1),
        "ost": (x1 - KANTENBAND, y0, x1 + KANTENBAND, y1),
    }[richtung]


def zugaenge(szene: dict, name: str, flaeche: set[Feld]) -> set[str]:
    """Seiten des Lochs, an denen die Ankünfte der Auslöser liegen. Beispiel: Ankunft „1,3“ über
    dem Auslöser (1, 4) → {"nord"}."""
    seiten = set()
    for a in szene.get("ausloeser", []):
        ankunft = str(a.get("eigenschaften", {}).get("ankunft", ""))
        if a["name"] != name or "," not in ankunft:
            continue
        ax, ay = (int(t) for t in ankunft.split(",")[:2])
        x, y = a["feld"]
        seiten |= {r for r, (dx, dy) in RICHTUNGEN.items() if (x + dx, y + dy) == (ax, ay)}
    return seiten


def _gelaenderbefunde(zeilen: list[str], flaeche: set[Feld], zugang: set[str], zaeune: list) -> list[str]:
    """Regel 4: offene Kanten (Boden daneben, nicht Zugang) ohne Geländerteil auf der Kante."""
    offen = []
    for feld in sorted(flaeche, key=lambda f: (f[1], f[0])):
        for richtung, (dx, dy) in RICHTUNGEN.items():
            nachbar = (feld[0] + dx, feld[1] + dy)
            if richtung in zugang or nachbar in flaeche or _zeichen(zeilen, nachbar) in GESPERRT:
                continue
            band = _kantenband(feld, richtung)
            if not any(_schneidet(_rechteck(z), band) for z in zaeune):
                offen.append(f"{feld} {richtung}")
    return (
        [f"Loch ohne Geländer an {', '.join(offen)} (Geländer aus einem Reling- oder Zaunsatz)"]
        if offen
        else []
    )


def _treppe_unten(regel: dict, moebel: dict) -> set[str]:
    """Bildquellen der Treppen am Gegenauslöser im unteren Raum (leer, wenn die Karte fehlt)."""
    from pipeline.abenteuer.kartenbau import platziere

    _, alle = _uebergaenge()
    ziel = regel.get("ziel", {})
    unten = alle.get(ziel.get("karte", ""))
    if not unten:
        return set()
    felder = {tuple(a["feld"]) for a in unten.get("ausloeser", []) if a["name"] == ziel.get("ausloeser")}
    quellen = set()
    for s in platziere(unten, moebel)[0]:
        angabe = moebel.get(s["name"], {})
        if angabe.get("art") == "treppe" and any(_schneidet(_rechteck(s), _kachel(f)) for f in felder):
            quellen.add(angabe.get("quelle", ""))
    return quellen


def _lochbild(angabe: dict, stueck: dict) -> bool:
    """Ein fertiges Bild eines Abgangs (Öffnung oder Treppe nach unten eingemalt), deckend gesetzt."""
    eingemalt = angabe.get("bodenoeffnung") or angabe.get("richtung") == "runter"
    return bool(eingemalt) and deckkraft_von(stueck) > DECKKRAFT_LOCH


def pruefe_abgang(
    szene: dict, zeilen: list[str], gesetzt: list[dict], moebel: dict, name: str, regel: dict
) -> list[str]:
    """Regeln 1 bis 5 für einen Abgang; Befunde als Text (ohne Kartenname)."""
    felder = {tuple(a["feld"]) for a in szene.get("ausloeser", []) if a["name"] == name}
    befunde = []
    for s in gesetzt:
        if _lochbild(moebel.get(s["name"], {}), s) and any(
            _schneidet(_rechteck(s), _kachel(f)) for f in felder
        ):
            befunde.append(
                f"{s['name']} ist ein Lochbild: Loch im Raster mit Treppe darunter und Geländer bauen"
            )
    ausserhalb = sorted(f for f in felder if _zeichen(zeilen, f) != LEER)
    if ausserhalb:
        befunde.append(f"Auslöser {ausserhalb} liegt nicht im Loch (Leere „ “ im Raster)")
    flaeche = loch(zeilen, felder)
    if not flaeche:
        return befunde
    treppen = [
        s
        for s in gesetzt
        if moebel.get(s["name"], {}).get("art") == "treppe"
        and deckkraft_von(s) == DECKKRAFT_LOCH
        and any(_schneidet(_rechteck(s), _kachel(f)) for f in flaeche)
    ]
    if not treppen:
        befunde.append(f"keine Treppe mit Deckkraft {DECKKRAFT_LOCH} im Loch")
    unten = _treppe_unten(regel, moebel)
    if treppen and unten and not any(moebel[s["name"]].get("quelle") in unten for s in treppen):
        befunde.append("Treppe im Loch ist kein Ausschnitt der Treppe im unteren Raum")
    zugang = zugaenge(szene, name, flaeche)
    if not zugang:
        befunde.append("Auslöser ohne Ankunft neben dem Loch (Zugangsseite unbekannt)")
    zaeune = [s for s in gesetzt if moebel.get(s["name"], {}).get("art") == "zaun"]
    return befunde + _gelaenderbefunde(zeilen, flaeche, zugang, zaeune)


def pruefe_szene(szene: dict, zeilen: list[str], gesetzt: list[dict], moebel: dict) -> list[str]:
    """Befunde aller Abgänge einer Szene („Auslöser: was“)."""
    return [
        f"{name}: {b}"
        for name, regel in abgaenge(szene).items()
        for b in pruefe_abgang(szene, zeilen, gesetzt, moebel, name, regel)
    ]


def main() -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    from pipeline.abenteuer.kartenbau import INHALTE, lade, platziere, raster
    from pipeline.abenteuer.moebelliste import lade_moebel

    moebel, anzahl = lade_moebel(), 0
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = lade(pfad)
        for b in pruefe_szene(szene, raster(szene), platziere(szene, moebel)[0], moebel):
            print(f"{pfad.name}: {b}")
            anzahl += 1
    print(f"{anzahl} Befunde an Treppenlöchern")
    return 1 if anzahl else 0


if __name__ == "__main__":
    sys.exit(main())

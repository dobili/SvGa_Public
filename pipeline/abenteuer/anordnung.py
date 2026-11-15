"""Anordnung der Möbel (KARTENREGELN 10.80 bis 10.87): Regeln aus den Kartennotizen des Autors zu Akt 1.

Warum: Der Autor fand in der Prüfmappe (15.11.2026) Fehler, die kein Werkzeug gemeldet hatte: ein Tisch,
der tiefer steht als die Stühle daneben; eine Schachuhr zwischen Brett und Spieler; ein Brett auf dem
Buch, das im Tischbild schon liegt; ein Steg mit eingemaltem Wasser auf dem Gras; Hocker eine halbe
Kachel vor der Theke und eine Theke mitten im Raum; Stufen ohne Loch im Boden; ein Wohnhaus so groß wie
eine Hundehütte; eine Doppeltür mit nur einer Fußmatte; eine Straße, die um eine Kachel springt.

Lage am Tisch (Brett mittig, Uhr am Brett, Stühle mit gleichem Abstand, Hocker an der Theke) prüft
``tischlage.py`` (Regel 10.79). Dieses Modul ergänzt, was dort nicht steht.

Regeln (Nummern wie in KARTENREGELN):
- 10.80 Tisch und Spieler: Stehen links und rechts eines Tischs Stühle, die zu ihm schauen, beginnt
  die Tischplatte auf Höhe der Lehnen (± 10 Pixel; üblich sind 7), und eine Schachuhr liegt vor oder
  hinter dem Brett, nie zwischen Brett und Spieler.
- 10.81 Nichts übereinander: Was auf derselben Platte steht, überdeckt sich nicht, und nichts steht
  auf dem, was im Tischbild schon liegt (``BELEGT``).
- 10.82 Steg über Wasser: Ein Stegbild liegt über Wasser oder Brückenboden (eine Brücke darf auch
  über eine Schlucht führen); eingemaltes Wasser im Bild liegt über Wasser (Pixel für Pixel, die
  Mauern eines Schleusentors dürfen auf dem Ufer stehen).
- 10.83 Theke an der Wand: Hinter einer Theke mit Hockern (Bar, Diner) liegt höchstens ein Gang von
  zwei Reihen bis zur Wand, gemessen ab der sichtbaren Oberkante, die kürzeste Strecke (eine
  Durchreiche in der Rückwand zählt nicht; die Hocker selbst prüft ``tischlage.py``).
- 10.84 Loch im Boden: Ein Aufgang nach unten auf einer oberen Karte zeigt eine Öffnung im Boden
  (Möbelangabe ``bodenoeffnung``).
- 10.85 Häuser in Menschengröße (10.66): Ein Gebäude draußen ist mindestens 5 × 5 Kacheln groß, außer
  Schuppen, Kiosk, Garage, Hütte, Gartenhaus, Zelt, Stand, Wartehaus, Stall und Anbau und außer Häusern
  in einer geschlossenen Häuserzeile, Bildern mit ``kleinbau`` im Katalog (Pfahlhütten) und schmalen
  Stadthäusern ab drei Geschossen (mindestens 3 breit).
- 10.86 Fußmatte: Innen liegt vor jedem Feld einer Außentür eine Fußmatte, außer auf einer Treppe.
- 10.87 Gerade Straßen: Ein Straßenzug springt nicht um eine Kachel zur Seite und zurück (eine
  Schlangenlinie aus schrägen Stufen ist erlaubt).

Aufruf: ``python -m pipeline.abenteuer.anordnung [--ort KENNUNG]`` listet die Befunde aller Szenen.
Im Kartenbau sind sie seit dem 15.11.2026 Befunde (``kartenbau.baue``), nachdem alle Orte nachgezogen
sind; ``pipeline/tests/test_abenteuer_anordnung.py`` prüft alle Szenen (außer Bildwünschen). Ohne
privates Paket oder Pillow (GitHub Actions) laufen nur die Regeln ohne Pixel (10.84, 10.86, 10.87).
"""

import re
import sys
from functools import cache
from pathlib import Path

from pipeline.abenteuer.anordnung_bild import bilder_da, flaeche, mitte, ueberlappen, wasserpixel
from pipeline.abenteuer.anordnung_raum import pruefe_fussmatten, pruefe_strassen, pruefe_theke_an_wand
from pipeline.abenteuer.kartenbau import INHALTE, K, lade, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.uebergangsbilder import ebene, lade_grundrisse

# Tischbilder, auf deren Platte schon etwas gezeichnet ist: Bilddatei → (Fläche im Bild, was).
BELEGT = {
    "Classroom_and_Library_Singles_25.png": ((9, 7, 28, 20), "aufgeschlagenes Buch und Flasche"),
}
HOEHE_TOLERANZ = 10
# Höchstens dieser Anteil des eingemalten Wassers eines Stegs oder einer Brücke liegt neben dem Wasser.
WASSER_DANEBEN = 0.1
MINDESTGROESSE = 5 * K
# Stadthäuser ab so vielen Geschossen dürfen schmal sein (Reihenhaus in Capital: 3 breit, 4 Geschosse).
STADTHAUS_GESCHOSSE = 3
STADTHAUS_BREITE = 3 * K
KLEINBAU = re.compile(
    r"schuppen|kiosk|garage|h(ü|ue)tte|gartenhaus|storage|shed|zelt|tent|stand|bude|wartehaus|haltestelle|"
    r"anbau|eingang|stellwerk|toilette|klo|bauteil|steuerhaus|pf(ö|oe)rtner|umkleide|stall|container",
    re.I,
)
# Nur Wohnhäuser zählen (Regel 10.66): Name, Bild oder Hinweis nennt ein Haus.
WOHNHAUS = re.compile(r"haus|villa|h(ü|ue)tte|house|cottage|home", re.I)
BRETT = re.compile(r"brett", re.I)
UHR = re.compile(r"uhr", re.I)
PFOSTEN = re.compile(r"poller|pfahl|pfosten", re.I)


def _setzen(szene: dict) -> tuple[list[dict], dict, dict]:
    moebel = lade_moebel()
    gesetzt, _ = platziere(szene, moebel)
    eintraege = {e.get("id", f"{e['moebel']}@{i}"): e for i, e in enumerate(szene.get("objekte", []))}
    return gesetzt, moebel, eintraege


def _sitze_am_tisch(tisch: dict, gesetzt: list[dict], moebel: dict) -> dict[str, dict]:
    """Stühle links und rechts direkt am Tisch, die zu ihm schauen (Blick rechts bzw. links)."""
    ft = flaeche(tisch, moebel[tisch["name"]])
    sitze: dict[str, dict] = {}
    for s in gesetzt:
        angabe = moebel.get(s["name"], {})
        if angabe.get("art") != "stuhl" or angabe.get("blick") not in ("links", "rechts"):
            continue
        fs = flaeche(s, angabe)
        if not (fs[1] < ft[3] and ft[1] < fs[3]):
            continue
        if angabe["blick"] == "rechts" and 0 <= ft[0] - fs[2] <= K // 2:
            sitze["links"] = s
        elif angabe["blick"] == "links" and 0 <= fs[0] - ft[2] <= K // 2:
            sitze["rechts"] = s
    return sitze


def pruefe_tische(szene: dict, gesetzt: list[dict], moebel: dict, eintraege: dict) -> list[str]:
    """10.80: Tisch auf Höhe der Stühle; Uhr nicht zwischen Brett und Spieler.

    Beispiel: Mrs. Calloways Verandatisch stand eine Kachel unter den Sitzflächen; im Clubraum lag die
    Uhr rechts neben dem Brett, also genau vor dem rechten Spieler.
    """
    befunde = []
    for tisch in (s for s in gesetzt if moebel.get(s["name"], {}).get("art") == "tisch"):
        sitze = _sitze_am_tisch(tisch, gesetzt, moebel)
        if len(sitze) < 2:
            continue
        ft = flaeche(tisch, moebel[tisch["name"]])
        fl, fr = (flaeche(sitze[s], moebel[sitze[s]["name"]]) for s in ("links", "rechts"))
        # Die Tischplatte beginnt kurz unter der Oberkante der Lehnen (alle Clubtische: 7 Pixel).
        lehne = (fl[1] + fr[1]) / 2
        if not -HOEHE_TOLERANZ <= ft[1] - lehne <= HOEHE_TOLERANZ:
            befunde.append(f"10.80 {tisch['name']} {_feld(tisch)}: steht nicht auf Höhe der Stühle")
        befunde += _uhr_vor_spieler(tisch, gesetzt, moebel, eintraege)
    return befunde


def _uhr_vor_spieler(tisch: dict, gesetzt: list[dict], moebel: dict, eintraege: dict) -> list[str]:
    darauf = [s for s in gesetzt if eintraege.get(s["id"], {}).get("auf") == tisch["id"]]
    befunde = []
    for brett in (s for s in darauf if BRETT.search(s["name"])):
        mb = mitte(flaeche(brett, moebel[brett["name"]]))
        for uhr in (s for s in darauf if UHR.search(s["name"])):
            mu = mitte(flaeche(uhr, moebel[uhr["name"]]))
            if abs(mu[0] - mb[0]) > abs(mu[1] - mb[1]):
                befunde.append(f"10.80 {uhr['name']} auf {tisch['id']}: Uhr zwischen Brett und Spieler")
    return befunde


def pruefe_platten(gesetzt: list[dict], moebel: dict, eintraege: dict) -> list[str]:
    """10.81: Nichts übereinander auf einer Platte, nichts auf dem, was im Tischbild schon liegt."""
    nach_id = {s["id"]: s for s in gesetzt}
    befunde = []
    darauf: dict[str, list[dict]] = {}
    for s in gesetzt:
        basis = eintraege.get(s["id"], {}).get("auf")
        if basis in nach_id:
            darauf.setdefault(basis, []).append(s)
    for basis, stuecke in darauf.items():
        unter = nach_id[basis]
        belegt = BELEGT.get(Path(moebel[unter["name"]].get("quelle", "")).name)
        flaechen = [(s, flaeche(s, moebel[s["name"]])) for s in stuecke]
        for i, (a, fa) in enumerate(flaechen):
            if belegt:
                fx = belegt[0]
                fb = (unter["x"] + fx[0], unter["y"] + fx[1], unter["x"] + fx[2], unter["y"] + fx[3])
                if ueberlappen(fa, fb):
                    befunde.append(f"10.81 {a['name']} liegt auf {belegt[1]} im Bild von {unter['name']}")
            for b, fb2 in flaechen[i + 1 :]:
                if ueberlappen(fa, fb2):
                    befunde.append(f"10.81 {a['name']} und {b['name']} übereinander auf {basis}")
    return befunde


def pruefe_stege(gesetzt: list[dict], moebel: dict, zeilen: list[str], bruecken: set[str]) -> list[str]:
    """10.82: Steg- und Brückenbilder über Wasser; eingemaltes Wasser liegt über Wasser.

    Gemessen wird Pixel für Pixel: Das Wasser im Bild liegt auf Wasserfeldern (höchstens ein Zehntel
    daneben). Teile ohne Wasser dürfen auf dem Ufer stehen, etwa die Mauern eines offenen
    Schleusentors (Schleusentreppe zwischen Riverton und Ironwood); der Steg mit Wasser auf dem Gras im
    Stadtpark von Maple Falls bleibt ein Befund.
    """
    befunde = []
    for s in gesetzt:
        angabe = moebel.get(s["name"], {})
        if angabe.get("art") not in ("steg", "bruecke") or PFOSTEN.search(s["name"]):
            continue
        felder = _felder(flaeche(s, angabe), zeilen)
        nass = [(x, y) for x, y in felder if zeilen[y][x] == "~" or zeilen[y][x] in bruecken]
        # Eine Brücke darf auch über eine Schlucht führen; nur ein Steg braucht Wasser.
        if not nass and angabe["art"] == "steg":
            befunde.append(f"10.82 {s['name']} {_feld(s)}: Steg ohne Wasser darunter")
        elif _wasser_auf_land(s, angabe, zeilen, set(nass) if "ausschnitt" not in angabe else None):
            befunde.append(f"10.82 {s['name']} {_feld(s)}: Bild mit Wasser steht teils auf Land")
    return befunde


def _wasser_auf_land(s: dict, angabe: dict, zeilen: list[str], nass: set | None) -> bool:
    """Liegt mehr als ein Zehntel des eingemalten Wassers auf Land? Ohne Pixellage (Ausschnitt eines
    Bogens) gilt die alte, strengere Regel: Das ganze Bild liegt über Wasser."""
    pixel = wasserpixel(angabe.get("quelle", ""))
    if not pixel:
        return False
    if nass is None:
        felder = _felder(flaeche(s, angabe), zeilen)
        return any(zeilen[y][x] != "~" for x, y in felder)
    trocken = sum(1 for px, py in pixel if ((s["x"] + px) // K, (s["y"] + py) // K) not in nass)
    return trocken / len(pixel) > WASSER_DANEBEN


def pruefe_loecher(szene: dict, gesetzt: list[dict], moebel: dict) -> list[str]:
    """10.84: Aufgänge nach unten auf oberen Karten zeigen eine Öffnung im Boden."""
    if ebene(szene.get("karte", "")) < 1:
        return []
    return [
        f"10.84 {s['name']} {_feld(s)}: Aufgang nach unten ohne Loch im Boden (Bildwunsch)"
        for s in gesetzt
        if moebel.get(s["name"], {}).get("richtung") == "runter"
        and not moebel[s["name"]].get("bodenoeffnung")
    ]


def pruefe_hausgroesse(szene: dict, gesetzt: list[dict], moebel: dict) -> list[str]:
    """10.85: Gebäude draußen in Menschengröße (mindestens 5 × 5 Kacheln), außer Kleinbauten."""
    if szene.get("art") != "aussen":
        return []
    befunde = []
    for s in gesetzt:
        angabe = moebel.get(s["name"], {})
        if angabe.get("art") not in ("gebaeude", "haus") and not angabe.get("gebaeude"):
            continue
        text = f"{s['name']} {angabe.get('quelle', '')} {angabe.get('hinweis', '')}"
        if KLEINBAU.search(text) or angabe.get("kleinbau") or not WOHNHAUS.search(text):
            continue
        if _in_zeile(s, gesetzt, moebel):
            continue
        fl = flaeche(s, angabe)
        # Ein schmales Stadthaus mit vielen Geschossen (Grundriss, 10.74) ist schmal, aber kein Spielzeug.
        breit_genug = MINDESTGROESSE if _geschosse(angabe) < STADTHAUS_GESCHOSSE else STADTHAUS_BREITE
        if fl[2] - fl[0] < breit_genug - K // 2 or fl[3] - fl[1] < MINDESTGROESSE - K // 2:
            groesse = f"{(fl[2] - fl[0]) / K:.1f} × {(fl[3] - fl[1]) / K:.1f}"
            befunde.append(f"10.85 {s['name']} {_feld(s)}: Haus nur {groesse} Kacheln (Hundehütte?)")
    return befunde


@cache
def _grundrisse() -> dict[str, dict]:
    return lade_grundrisse()


def _geschosse(angabe: dict) -> int:
    """Geschosse an der Front laut Grundriss (10.74); ohne Grundriss 1."""
    return int((_grundrisse().get(angabe.get("quelle", "")) or {}).get("geschosse") or 1)


def _in_zeile(haus: dict, gesetzt: list[dict], moebel: dict) -> bool:
    """Steht das Haus in einer Häuserzeile (berührt links oder rechts ein anderes Gebäude)?
    Schmale Reihenhäuser und Ladenfronten in London sind dann in Ordnung."""
    fh = flaeche(haus, moebel[haus["name"]])
    for s in gesetzt:
        angabe = moebel.get(s["name"], {})
        if s is haus or (angabe.get("art") not in ("gebaeude", "haus") and not angabe.get("gebaeude")):
            continue
        fs = flaeche(s, angabe)
        if fs[1] < fh[3] and fh[1] < fs[3] and (abs(fs[0] - fh[2]) <= 2 or abs(fh[0] - fs[2]) <= 2):
            return True
    return False


def _feld(s: dict) -> tuple[int, int]:
    return (s["x"] // K, s["y"] // K)


def _felder(f: tuple, zeilen: list[str]) -> list[tuple[int, int]]:
    return [
        (x, y)
        for y in range(f[1] // K, (f[3] - 1) // K + 1)
        for x in range(f[0] // K, (f[2] - 1) // K + 1)
        if 0 <= y < len(zeilen) and 0 <= x < len(zeilen[0])
    ]


def pruefe_anordnung(szene: dict, mit_bildern: bool | None = None) -> list[str]:
    """Alle Anordnungsregeln für eine Szene; Ausgabe: Befunde als Text („10.8x Möbel Feld: was“).

    Ohne Bilder (``mit_bildern`` falsch; ohne Angabe: privates Paket und Pillow vorhanden?) laufen nur
    die Regeln, die keine Pixel brauchen: Loch im Boden, Fußmatte und gerade Straßen. Sonst gälte die
    ganze Bildfläche als deckend, und Tische, Platten und Häuser würden falsch gemessen.
    """
    gesetzt, moebel, eintraege = _setzen(szene)
    zeilen = raster(szene)
    befunde = (
        pruefe_loecher(szene, gesetzt, moebel)
        + pruefe_fussmatten(szene, gesetzt, moebel, zeilen)
        + pruefe_strassen(szene, zeilen)
    )
    if not (bilder_da() if mit_bildern is None else mit_bildern):
        return befunde
    bruecken = set(szene.get("bruecken", []))
    return (
        pruefe_tische(szene, gesetzt, moebel, eintraege)
        + pruefe_platten(gesetzt, moebel, eintraege)
        + pruefe_stege(gesetzt, moebel, zeilen, bruecken)
        + pruefe_theke_an_wand(szene, gesetzt, moebel, zeilen)
        + pruefe_hausgroesse(szene, gesetzt, moebel)
        + befunde
    )


def main(argumente: list[str]) -> int:
    ort = argumente[argumente.index("--ort") + 1] if "--ort" in argumente else None
    anzahl = 0
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = lade(pfad)
        if ort and not szene.get("karte", "").startswith(f"{ort}."):
            continue
        befunde = pruefe_anordnung(szene)
        for b in befunde:
            print(f"{pfad.name}: {b}")
        anzahl += len(befunde)
    print(f"{anzahl} Befunde")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

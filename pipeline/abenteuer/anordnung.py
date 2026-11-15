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
  über eine Schlucht führen); hat ein Steg- oder Brückenbild eingemaltes Wasser, liegt es ganz über
  Wasser.
- 10.83 Theke an der Wand: Hinter einer Theke mit Hockern (Bar, Diner) liegt höchstens ein Gang von
  zwei Reihen bis zur Wand (die Hocker selbst prüft ``tischlage.py``).
- 10.84 Loch im Boden: Ein Aufgang nach unten auf einer oberen Karte zeigt eine Öffnung im Boden
  (Möbelangabe ``bodenoeffnung``).
- 10.85 Häuser in Menschengröße (10.66): Ein Gebäude draußen ist mindestens 5 × 5 Kacheln groß, außer
  Schuppen, Kiosk, Garage, Hütte, Gartenhaus, Zelt, Stand, Wartehaus, Stall und Anbau und außer Häusern
  in einer geschlossenen Häuserzeile.
- 10.86 Fußmatte: Innen liegt vor jedem Feld einer Außentür eine Fußmatte.
- 10.87 Gerade Straßen: Ein Straßenzug springt nicht um eine Kachel zur Seite.

Aufruf: ``python -m pipeline.abenteuer.anordnung [--ort KENNUNG]`` listet die Befunde aller Szenen.
Im Kartenbau erscheinen sie als Hinweis (``kartenbau.hinweise``); für Maple Falls und Cedar Creek
prüft ``pipeline/tests/test_abenteuer_anordnung.py``, dass nichts offen ist (außer Bildwünschen).
"""

import re
import sys
from pathlib import Path

from pipeline.abenteuer.anordnung_bild import flaeche, mitte, ueberlappen, wasser_im_bild
from pipeline.abenteuer.anordnung_raum import pruefe_fussmatten, pruefe_strassen, pruefe_theke_an_wand
from pipeline.abenteuer.kartenbau import INHALTE, K, lade, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.uebergangsbilder import ebene

# Tischbilder, auf deren Platte schon etwas gezeichnet ist: Bilddatei → (Fläche im Bild, was).
BELEGT = {
    "Classroom_and_Library_Singles_25.png": ((9, 7, 28, 20), "aufgeschlagenes Buch und Flasche"),
}
HOEHE_TOLERANZ = 10
MINDESTGROESSE = 5 * K
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
    """10.82: Steg- und Brückenbilder über Wasser; mit eingemaltem Wasser ganz über Wasser."""
    befunde = []
    for s in gesetzt:
        angabe = moebel.get(s["name"], {})
        if angabe.get("art") not in ("steg", "bruecke") or PFOSTEN.search(s["name"]):
            continue
        felder = _felder(flaeche(s, angabe), zeilen)
        unter = [zeilen[y][x] for x, y in felder]
        nass = [z for z in unter if z == "~" or z in bruecken]
        # Eine Brücke darf auch über eine Schlucht führen; nur ein Steg braucht Wasser.
        if not nass and angabe["art"] == "steg":
            befunde.append(f"10.82 {s['name']} {_feld(s)}: Steg ohne Wasser darunter")
        elif wasser_im_bild(angabe.get("quelle", "")) and len(nass) < len(unter):
            befunde.append(f"10.82 {s['name']} {_feld(s)}: Bild mit Wasser steht teils auf Land")
    return befunde


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
        if KLEINBAU.search(text) or not WOHNHAUS.search(text) or _in_zeile(s, gesetzt, moebel):
            continue
        fl = flaeche(s, angabe)
        if fl[2] - fl[0] < MINDESTGROESSE - K // 2 or fl[3] - fl[1] < MINDESTGROESSE - K // 2:
            groesse = f"{(fl[2] - fl[0]) / K:.1f} × {(fl[3] - fl[1]) / K:.1f}"
            befunde.append(f"10.85 {s['name']} {_feld(s)}: Haus nur {groesse} Kacheln (Hundehütte?)")
    return befunde


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


def pruefe_anordnung(szene: dict) -> list[str]:
    """Alle Anordnungsregeln für eine Szene; Ausgabe: Befunde als Text („10.8x Möbel Feld: was“)."""
    gesetzt, moebel, eintraege = _setzen(szene)
    zeilen = raster(szene)
    bruecken = set(szene.get("bruecken", []))
    return (
        pruefe_tische(szene, gesetzt, moebel, eintraege)
        + pruefe_platten(gesetzt, moebel, eintraege)
        + pruefe_stege(gesetzt, moebel, zeilen, bruecken)
        + pruefe_theke_an_wand(szene, gesetzt, moebel, zeilen)
        + pruefe_loecher(szene, gesetzt, moebel)
        + pruefe_hausgroesse(szene, gesetzt, moebel)
        + pruefe_fussmatten(szene, gesetzt, moebel, zeilen)
        + pruefe_strassen(szene, zeilen)
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

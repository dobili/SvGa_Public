"""Zauntore: Ein Tor im Zaun muss bündig an beide Zaunenden anschließen und zur Art des Zauns passen.

Warum: Notiz des Autors (20.11.2026, Foto vor dem Haus des Helden in Maple Falls): Die Tore passen
nicht zum Zaun. Dort stand ein braunes Holztor vom Bauernhof (modern-farm, Wooden_Fence_Type_4) im
dunklen Eisenzaun (Modern Exteriors, Fence_1), und es sah geschlossen aus, obwohl man hindurchging.

Regeln:

- Ein Tor ist ein Katalogeintrag mit einem Torbild (``Gate`` im Dateinamen) oder ein eigenes Tor
  (``EIGENE_TORE``). Nebeneinander liegende Torstücke in einer Reihe sind ein Tor.
- Links und rechts muss ein Zaunstück liegen, dessen Bildkante genau an der Torkante endet, auf der
  Höhe der unteren Torreihe. Ein Tor ganz ohne Zaun daneben steht frei (etwa ein Viehgatter quer
  über der Straße) und wird nicht geprüft.
- Die Zaunart (``zaunart``, aus dem Dateinamen) muss zum Tor passen (``PASSEND``). Für Zaunarten
  ohne passendes Tor im Paket steht ein Gemini-Wunsch in ``OHNE_TOR``; bis dahin bleibt der
  Durchgang offen (die Zaunenden tragen eigene Pfosten).
- Ein begehbares Tor darf nicht wie ein geschlossenes aussehen (``GESCHLOSSENE_BILDER``).

Aufruf: ``python -m pipeline.abenteuer.zauntor [--ort KENNUNG]``; Rückgabe 1 bei Befunden.
Dauertest: pipeline/tests/test_abenteuer_zauntor.py. Abhängigkeiten: kartenbau, durchgang,
uebergaenge, moebelliste. Braucht keine Bilder (CI ohne privates Paket).
"""

import re
import sys

from pipeline.abenteuer.durchgang import alle_fassungen
from pipeline.abenteuer.kartenbau import platziere

K = 16  # Kachel in Pixeln

# Zaunart nach dem Dateinamen des Bildes (erste Regel, die passt).
ZAUNARTEN: list[tuple[str, str]] = [
    (r"Terrains_and_Fences_16x16_Fence_1_", "eisenzaun"),
    (r"Terrains_and_Fences_16x16_Fence_2_", "gartenzaun_me2"),
    (r"24_Additional_Houses_Fence_4_", "holzgelaender"),
    (r"24_Additional_Houses_Fence_6_", "gelaender6"),
    (r"24_Additional_Houses_Fence_2_", "gelaender2"),
    (r"Wooden_Fence_Type_1_", "lattenzaun"),
    (r"Wooden_Fence_Type_3_", "bohlenzaun"),
    (r"Wooden_Fence_Type_4_", "hofzaun"),
]

# Tore nach dem Dateinamen; dazu die eigenen Zeichnungen (spiel/eigene).
TORARTEN: list[tuple[str, str]] = [
    (r"Wooden_Fence_Type_4_.*Gate", "hoftor"),
    (r"Wooden_Fence_Type_3_.*Gate", "bohlentor"),
    (r"ME_Singles_Garden_16x16_Gate", "heckentor"),
    (r"holztor_", "holztor"),
    (r"ranger_tor", "rangertor"),
    (r"viehgatter", "viehgatter"),
]
EIGENE_TORE = ("holztor_", "ranger_tor", "viehgatter")

# Welche Zaunarten ein Tor aufnehmen darf (beide Seiten). Geprüft am 20.11.2026 an Bildern.
PASSEND: dict[str, set[str]] = {
    # Holz an Holz, Pfosten bündig: das Hoftor im Holzgeländer (Kürbishof, Weide an der Landstraße).
    "hoftor": {"hofzaun", "holzgelaender", "lattenzaun"},
    "bohlentor": {"bohlenzaun"},
    "heckentor": set(),  # sitzt in einer eigenen Hecke, nie in einem Zaun
    "holztor": {"holzgelaender"},  # eigens zum Geländer gezeichnet (Landstraße)
    "rangertor": {"lattenzaun"},  # Bogen über dem Lattenzaun (Geysirbecken)
    "viehgatter": set(),
}

# Zaunarten ohne passendes Tor im Paket: Gemini-Wunsch (an den Hauptchat, 20.11.2026).
OHNE_TOR: dict[str, str] = {
    "eisenzaun": "Gartentor im dunklen Eisenzaun (Modern Exteriors Fence_1), 2 Kacheln breit "
    "(32 × 16), Stäbe wie der Zaun, zwei schmale Pfosten außen; einmal geschlossen, einmal offen "
    "(Flügel nach innen geklappt).",
    "lattenzaun": "Tor im hellen Lattenzaun (modern-farm Wooden_Fence_Type_1_Brown), 2 Kacheln, "
    "geschlossen und offen. Bis dahin steht das Hoftor (Type_4) darin, Holz an Holz.",
}

# Torbilder, die geschlossen aussehen; ein begehbares Tor mit diesem Bild täuscht den Spieler.
GESCHLOSSENE_BILDER = r"Wooden_Fence_Type_[34]_.*Gate_[12]_|holztor_zu"


def art_nach(quelle: str, regeln: list[tuple[str, str]]) -> str | None:
    """Erste Art, deren Muster im Dateinamen vorkommt.

    Beispiel: „…Fence_1_6.png“ → „eisenzaun“; „…Type_4_Brown_Gate_1…“ mit TORARTEN → „hoftor“.
    """
    return next((art for muster, art in regeln if re.search(muster, quelle)), None)


def ist_tor(angabe: dict) -> bool:
    """Ein Katalogeintrag mit Torbild oder ein eigenes Tor."""
    quelle = angabe.get("quelle", "")
    return "Gate" in quelle or any(e in quelle for e in EIGENE_TORE)


def tore_der_szene(gesetzt: list[dict], katalog: dict) -> list[list[dict]]:
    """Gesetzte Torstücke, zu Toren gruppiert (gleiche Reihe, Kante an Kante)."""
    stuecke = sorted(
        (s for s in gesetzt if ist_tor(katalog.get(s["name"], {}))),
        key=lambda s: (s["y"] + s["hoehe"], s["x"]),
    )
    tore: list[list[dict]] = []
    for s in stuecke:
        letztes = tore[-1][-1] if tore else None
        if (
            letztes
            and letztes["y"] + letztes["hoehe"] == s["y"] + s["hoehe"]
            and letztes["x"] + letztes["breite"] == s["x"]
        ):
            tore[-1].append(s)
        else:
            tore.append([s])
    return tore


def nachbar(gesetzt: list[dict], katalog: dict, kante: int, unten: int, links: bool) -> dict | None:
    """Zaunstück, dessen Bild genau an der Kante endet (links) oder beginnt (rechts)."""
    for s in gesetzt:
        angabe = katalog.get(s["name"], {})
        if angabe.get("art") != "zaun" or ist_tor(angabe):
            continue
        rand = s["x"] + s["breite"] if links else s["x"]
        if rand == kante and s["y"] <= unten - 1 < s["y"] + s["hoehe"]:
            return s
    return None


def pruefe_tor(marke: str, tor: list[dict], gesetzt: list[dict], katalog: dict) -> list[str]:
    """Befunde eines Tors: offene Seite, falsche Zaunart, begehbar mit geschlossenem Bild."""
    quelle = katalog[tor[0]["name"]].get("quelle", "")
    torart = art_nach(quelle, TORARTEN) or "unbekannt"
    x0, x1 = tor[0]["x"], tor[-1]["x"] + tor[-1]["breite"]
    unten = max(s["y"] + s["hoehe"] for s in tor)
    seiten = {
        "links": nachbar(gesetzt, katalog, x0, unten, True),
        "rechts": nachbar(gesetzt, katalog, x1, unten, False),
    }
    if not any(seiten.values()):
        return []  # steht frei, kein Zauntor
    wo = f"{marke}: {tor[0]['name']} ({x0 // K}, {(unten - 1) // K})"
    befunde = []
    for seite, zaun in seiten.items():
        if zaun is None:
            befunde.append(f"{wo}: {seite} kein Zaun bündig an der Torkante")
            continue
        zaunart = art_nach(katalog[zaun["name"]].get("quelle", ""), ZAUNARTEN) or "unbekannt"
        if zaunart not in PASSEND.get(torart, set()):
            wunsch = " (Gemini-Wunsch offen)" if zaunart in OHNE_TOR else ""
            befunde.append(f"{wo}: {torart} passt nicht zum {zaunart} {seite} ({zaun['name']}){wunsch}")
    for s in tor:
        angabe = katalog[s["name"]]
        if angabe.get("begehbar") and re.search(GESCHLOSSENE_BILDER, angabe.get("quelle", "")):
            befunde.append(f"{wo}: {s['name']} ist begehbar, sieht aber geschlossen aus")
    return befunde


def befunde_der_szene(marke: str, szene: dict, katalog: dict) -> list[str]:
    """Alle Torbefunde einer Fassung."""
    gesetzt = platziere(szene, katalog)[0]
    befunde = []
    for tor in tore_der_szene(gesetzt, katalog):
        befunde += pruefe_tor(marke, tor, gesetzt, katalog)
    return befunde


def pruefe(ort: str | None = None) -> list[str]:
    """Befunde aller Fassungen aller Karten (optional nur eines Orts), ohne Doppel."""
    from pipeline.abenteuer.moebelliste import lade_moebel
    from pipeline.abenteuer.uebergaenge import szenen

    katalog = lade_moebel()
    befunde: list[str] = []
    for marke, szene in alle_fassungen(szenen()):
        if ort and szene["karte"].split(".")[0] != ort:
            continue
        befunde += [b for b in befunde_der_szene(marke, szene, katalog) if b not in befunde]
    return befunde


def main() -> int:
    """Befehlszeile; Aufruf im Dateikopf."""
    ort = sys.argv[sys.argv.index("--ort") + 1] if "--ort" in sys.argv else None
    befunde = pruefe(ort)
    for b in befunde:
        print(b)
    print(f"{len(befunde)} Befunde")
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main())

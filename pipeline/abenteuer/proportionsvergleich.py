"""Vergleichsseite zur Figurengröße für den Autor (20.11.2026): Varianten nebeneinander, mit Zahlen.

Warum: Die Möbel der gekauften Grafiksätze (LimeZu) sind für größere Figuren gezeichnet als unsere.
Der Autor wählt, ob Möbel kleiner werden oder die Figur (innen) größer. Bevor etwas im Spiel
geändert wird, zeigt diese Seite jede Variante an denselben Stellen in der echten Vergrößerung des
Spiels (Kartenpixel mal 3) und zählt, was sie berührt.

Varianten (Entscheidung des Autors, 20.11.2026: kleinere Möbel oder Räume innen fallen weg):
- Innen: Figuren größer, × gemessener Faktor (Paketfigur durch unsere), × 1,25 und × 1,33, in sieben
  Räumen; dazu, wo Gänge oder Türen für die breitere Figur zu eng würden (durchlass.py).
- Außen: jedes zu große Möbel auf den vorgeschlagenen Maßstab (proportionen.py), ganze Karte und
  Ausschnitt vorher und nachher, mit freiem Boden und Deckung durch Möbel.

Bilder: aus den Kartenvorschauen der Pipeline (kartenbild.zeichne, belebungsvorschau), also mit den
Figuren aus ``spiel/figuren-neu`` (PixelLab), wenn das private Paket sie hat; sonst mit den alten
LimeZu-Bögen (die Seite sagt dann, dass die Figuren nicht stimmen).

Aufruf: ``python -m pipeline.abenteuer.proportionsvergleich PRIVAT ZIEL`` schreibt eine einzige Datei
``ZIEL/index.html`` (Bilder eingebettet, unter 2 MB); Seite und Text: proportionsseite.py.
"""

import contextlib
import copy
import json
import sys
from pathlib import Path

from PIL import Image

from pipeline.abenteuer import belebungsvorschau, durchlass, proportionen
from pipeline.abenteuer.kartenbau import INHALTE, K, platziere, raster, sperrfelder
from pipeline.abenteuer.kartenbild import zeichne
from pipeline.abenteuer.kartentiled import GESPERRT
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.proportionsfiguren import figurhoehen, gesicht
from pipeline.abenteuer.proportionsseite import schreibe_seite, uri

ZOOM = 3  # Bildschirmpixel je Kartenpixel im Spiel (weltmassstab.ts)
# Dazu der gemessene Faktor (Paketfigur durch unsere). 1,5 ist die Originalgröße der PixelLab-Figur
# (heute mit 2/3 gezeichnet): Ein Figurenpixel wird genau drei Bildschirmpixel.
INNEN_FAKTOREN = (1.25, 4 / 3, 1.5)
FENSTER = (6, 8)  # Ausschnitt in Kacheln (das Spiel zeigt hoch 8 × 15); klein, damit die Seite leicht bleibt
ANSICHT_KARTE = 4  # ganze Karte: ein Bildpunkt je vier Pixel der Vorschau (halbe Kartengröße)
KOERPER = 12  # Körper der Figur in Kartenpixeln (durchlass.py)
# Möbelarten, die zum Raum gehören und nie verkleinert werden.
RAUMTEILE = {"teppich", "boden", "boden_teil", "fenster", "bild", "treppe", "tuer", "markierung"}
ZELLE = 4  # Zellengröße von durchlass.py

# Innenräume: Name, Szene, Feld des Helden (x, y) oder None (freie Mitte).
INNEN = [
    ("Wohnzimmer", "maple-falls-wohnzimmer-tisch", (12, 7)),
    ("Dachboden", "maple-falls-dachboden", None),
    ("Clubraum", "maple-falls-clubraum", (9, 8)),
    ("Waschsalon", "cedar-creek-waschsalon", (6, 8)),
    ("Diner", "maple-falls-diner", (3, 8)),
    ("Kantine Ironwood", "ironwood-kantine", (16, 11)),
    ("Wards Hütte", "summit-city-huette", None),
]
# Außenkarten: Name, Szene, Stelle für den Ausschnitt in Spielvergrößerung.
AUSSEN = [
    ("Maple Falls, Park (Bank des Autors)", "maple-falls-park", (5, 12)),
    ("Maple Falls, Hauptstraße", "maple-falls-aussen", (20, 12)),
    ("Cedar Creek (Picknicktisch bei Kettering)", "cedar-creek-aussen", (38, 29)),
    ("Riverton", "riverton-aussen", (50, 48)),
    ("Desert Springs (Akt 3)", "desert-springs-aussen", (30, 32)),
]


def lade_szene(name: str) -> dict:
    return json.loads((INHALTE / "szenen" / f"{name}.json").read_text())


@contextlib.contextmanager
def figuren_mal(faktor: float):
    """Zeichnet alle Figuren der Vorschau ``faktor``-mal so groß (Füße bleiben unten mittig).

    PixelLab-Figuren werden aus dem Original neu verkleinert (2/3 mal Faktor, bei 1,5 also gar nicht);
    alte LimeZu-Bögen (16 breit) mit dem Faktor vergrößert.
    """
    alt, alt_massstab = belebungsvorschau.figurbild, belebungsvorschau.PIXELLAB_MASSSTAB

    def gross(*args, **kwargs):
        bild = alt(*args, **kwargs)
        if bild is None or faktor == 1 or bild.width >= 2 * K:
            return bild
        return bild.resize((round(bild.width * faktor), round(bild.height * faktor)), Image.NEAREST)

    belebungsvorschau.figurbild = gross
    belebungsvorschau.PIXELLAB_MASSSTAB = min(1.0, alt_massstab * faktor)
    try:
        yield
    finally:
        belebungsvorschau.figurbild, belebungsvorschau.PIXELLAB_MASSSTAB = alt, alt_massstab


def moebel_mal(szene: dict, faktor: float, nur: set[str] | None = None) -> dict:
    """Kopie der Szene, in der Möbel ``faktor``-mal so groß sind, unten mittig ausgerichtet.

    ``nur``: nur diese Katalogeinträge (Variante D); sonst alle außer RAUMTEILE und Wandbildern.
    Was auf einem Möbel liegt (``auf``), wird mit ihm kleiner.
    """
    katalog = lade_moebel()
    neu = copy.deepcopy(szene)
    skaliert: set[str] = set()
    for objekt in neu.get("objekte", []):
        angabe = katalog.get(objekt.get("moebel"), {})
        if nur is not None and objekt.get("moebel") not in nur:
            continue
        if nur is None and (angabe.get("art") in RAUMTEILE or objekt.get("an_wand")):
            continue
        if "auf" in objekt and objekt["auf"] not in skaliert:
            continue
        alt = float(objekt.get("massstab", 1))
        objekt["massstab"] = round(alt * faktor, 3)
        if "auf" not in objekt:
            breite, hoehe = angabe.get("breite", K) * alt, angabe.get("hoehe", K) * alt
            dx, dy = objekt.get("versatz", [0, 0])
            objekt["versatz"] = [dx + round(breite * (1 - faktor) / 2), dy + round(hoehe * (1 - faktor))]
        if "id" in objekt:
            skaliert.add(objekt["id"])
    return neu


def freier_boden(szene: dict) -> tuple[int, int]:
    """(freie Bodenfelder, alle Bodenfelder) nach Kollision der Möbel (kartenbau.sperrfelder)."""
    zeilen = raster(szene)
    boden = {(x, y) for y, z in enumerate(zeilen) for x, c in enumerate(z) if c not in GESPERRT}
    gesetzt, _ = platziere(szene, lade_moebel())
    belegt = set().union(*(sperrfelder(s) for s in gesetzt)) if gesetzt else set()
    return len(boden - belegt), len(boden)


def ausschnitt(bild: Image.Image, feld: tuple[int, int], massstab: float = 1) -> Image.Image:
    """Fenster um das Feld in Spielvergrößerung (vorschau ist schon doppelt; ``massstab`` für B)."""
    fx, fy = feld
    breite, hoehe = FENSTER[0] * K * 2, FENSTER[1] * K * 2
    links = max(0, min(bild.width - breite, fx * K * 2 + K - breite // 2))
    oben = max(0, min(bild.height - hoehe, fy * K * 2 + K - hoehe * 3 // 5))
    teil = bild.crop((links, oben, links + breite, oben + hoehe))
    ziel = (round(teil.width * ZOOM / 2 * massstab), round(teil.height * ZOOM / 2 * massstab))
    return teil.resize(ziel, Image.NEAREST)


def mit_held(szene: dict, feld: tuple[int, int]) -> dict:
    """Szene mit dem Helden als Figur auf dem Feld (für die Vorschau)."""
    neu = copy.deepcopy(szene)
    neu.setdefault("figuren", []).append({"name": "__held__", "feld": list(feld), "blick": "unten"})
    return neu


def vorschau(szene: dict, privat: Path, feld: tuple[int, int], figurfaktor: float = 1) -> Image.Image:
    """Kartenvorschau mit Held, Figuren mal ``figurfaktor``."""
    orte = json.loads((INHALTE / "orte.json").read_text())["orte"]
    ort = next(o for o in orte if o["kennung"] == szene["karte"].split(".")[0])
    held = {"kennung": f"{ort['kennung']}.__held__", "sprite": "figuren/held-0.png"}
    ort.setdefault("figuren", []).append(held)
    with figuren_mal(figurfaktor), _orte_mit(orte):
        return zeichne(mit_held(szene, feld), privat)[1]


FEHLT: set[str] = set()  # Bilder, die im privaten Paket fehlen (älterer Stand)


@contextlib.contextmanager
def _orte_mit(orte: list[dict]):
    """kartenbild liest orte.json selbst; hier mit dem Helden als Figur des Ortes. Fehlende Möbelbilder
    (älteres privates Paket) werden durchsichtig gezeichnet und gemerkt."""
    from pipeline.abenteuer import kartenbild

    alt, altbild = kartenbild.lade, kartenbild.moebelbild

    def lade(pfad):
        return {"orte": orte} if Path(pfad).name == "orte.json" else alt(pfad)

    def moebelbild(privat, quelle):
        try:
            return altbild(privat, quelle)
        except FileNotFoundError:
            FEHLT.add(quelle["quelle"] if isinstance(quelle, dict) else quelle)
            return Image.new("RGBA", (K, K))

    kartenbild.lade, kartenbild.moebelbild = lade, moebelbild
    try:
        yield
    finally:
        kartenbild.lade, kartenbild.moebelbild = alt, altbild


def durchlass_befunde(koerper_zellen: int) -> list[str]:
    """Befunde von durchlass.py mit einem breiteren Körper (Zellen zu 4 px), nur Innenräume."""
    innen = [
        p.stem
        for p in sorted((INHALTE / "szenen").glob("*.json"))
        if lade_szene(p.stem).get("art") == "innen"
    ]
    alt = durchlass.HELD
    durchlass.HELD = koerper_zellen
    try:
        return durchlass.pruefe(innen)[0]
    finally:
        durchlass.HELD = alt


def befunde_zusammen(innenfaktor: float, aussenfigur: float = proportionen.FIGUR_AUSSEN) -> list:
    """Befunde von proportionen.py bei anderer Figurhöhe (innen und außen)."""
    alt = proportionen.FIGUR_AUSSEN
    proportionen.FIGUR_AUSSEN = aussenfigur
    try:
        return proportionen.pruefe(
            proportionen.lade_szenen(), proportionen.lade_katalog(), proportionen.lade_hoehen(), innenfaktor
        )
    finally:
        proportionen.FIGUR_AUSSEN = alt


def mitte(szene: dict) -> tuple[int, int]:
    """Ein freies Bodenfeld nahe der Mitte (für Räume ohne vorgegebene Stelle)."""
    zeilen = raster(szene)
    gesetzt, _ = platziere(szene, lade_moebel())
    belegt = set().union(*(sperrfelder(s) for s in gesetzt)) if gesetzt else set()
    mx, my = len(zeilen[0]) // 2, len(zeilen) // 2
    frei = [
        (x, y)
        for y, z in enumerate(zeilen)
        for x, c in enumerate(z)
        if c not in GESPERRT and (x, y) not in belegt
    ]
    return min(frei, key=lambda f: (f[0] - mx) ** 2 + (f[1] - my) ** 2)


def deckung(szene: dict, privat: Path) -> float:
    """Anteil der Kartenfläche, den Möbel bedecken (deckende Pixel mal Maßstab², ohne Raumteile)."""
    from pipeline.abenteuer.kartenbild import moebelbild

    katalog = lade_moebel()
    zeilen = raster(szene)
    flaeche = len(zeilen) * len(zeilen[0]) * K * K
    summe = 0.0
    for objekt in szene.get("objekte", []):
        angabe = katalog.get(objekt.get("moebel"))
        if not angabe or angabe.get("art") in RAUMTEILE | {"gebaeude", "haus", "boden_teil", "bordstein"}:
            continue
        try:
            alpha = moebelbild(privat, angabe).getchannel("A")
        except FileNotFoundError:
            continue
        summe += sum(alpha.histogram()[proportionen.DECKEND_AB + 1 :]) * float(objekt.get("massstab", 1)) ** 2
    return summe / flaeche


def verkleinert_aussen(szene: dict, vorschlaege: dict[str, float]) -> tuple[dict, int]:
    """Szene mit jedem zu großen Möbel auf seinen vorgeschlagenen Maßstab; dazu die Zahl der Stellen."""
    neu = copy.deepcopy(szene)
    zahl = 0
    for nummer, objekt in enumerate(neu.get("objekte", [])):
        faktor = vorschlaege.get(objekt.get("moebel"))
        if faktor is None or objekt.get("drehung", 0) % 180:
            continue
        kleiner = moebel_mal({"objekte": [objekt]}, faktor, {objekt["moebel"]})["objekte"][0]
        neu["objekte"][nummer] = kleiner
        zahl += 1
        for anderes in neu["objekte"]:  # was darauf liegt, mit
            if anderes.get("auf") and anderes.get("auf") == objekt.get("id"):
                anderes["massstab"] = round(float(anderes.get("massstab", 1)) * faktor, 3)
    return neu, zahl


def speichere(ziel: Path, bild: Image.Image, name: str) -> str:
    """Bild als data-URI (proportionsseite.uri); ziel und name bleiben für eine Fassung mit Dateien."""
    del ziel, name
    return uri(bild)


def innenraeume(ziel: Path, privat: Path, faktoren: list[float]) -> list[dict]:
    """Je Raum: heute und jede größere Figur, Ausschnitt in Spielvergrößerung."""
    ergebnis = []
    for nummer, (titel, name, feld) in enumerate(INNEN):
        szene = lade_szene(name)
        feld = feld or mitte(szene)
        bilder = {"heute": speichere(ziel, ausschnitt(vorschau(szene, privat, feld), feld), f"i{nummer}-1")}
        for faktor in faktoren:
            bild = ausschnitt(vorschau(szene, privat, feld, faktor), feld)
            bilder[f"× {faktor:.2f}".replace(".", ",")] = speichere(ziel, bild, f"i{nummer}-{faktor:.2f}")
        ergebnis.append({"titel": titel, "szene": name, "bilder": bilder})
        print(titel)
    return ergebnis


def aussenkarten(ziel: Path, privat: Path, vorschlaege: dict[str, float]) -> list[dict]:
    """Je Außenkarte: ganze Karte und Ausschnitt vorher/nachher, freier Boden und Deckung."""
    ergebnis = []
    for nummer, (titel, name, feld) in enumerate(AUSSEN):
        szene = lade_szene(name)
        klein, zahl = verkleinert_aussen(szene, vorschlaege)
        vorher_bild, nachher_bild = vorschau(szene, privat, feld), vorschau(klein, privat, feld)
        halb = (vorher_bild.width // ANSICHT_KARTE, vorher_bild.height // ANSICHT_KARTE)
        bilder = {
            "karte vorher": speichere(
                ziel, vorher_bild.resize(halb, Image.NEAREST), f"a{nummer}-karte-vorher"
            ),
            "karte nachher": speichere(
                ziel, nachher_bild.resize(halb, Image.NEAREST), f"a{nummer}-karte-nachher"
            ),
            "Ausschnitt vorher": speichere(ziel, ausschnitt(vorher_bild, feld), f"a{nummer}-vorher"),
            "Ausschnitt nachher": speichere(ziel, ausschnitt(nachher_bild, feld), f"a{nummer}-nachher"),
        }
        frei_v, boden = freier_boden(szene)
        frei_n, _ = freier_boden(klein)
        ergebnis.append(
            {
                "titel": titel,
                "szene": name,
                "bilder": bilder,
                "stellen": zahl,
                "boden": boden,
                "frei_vorher": frei_v,
                "frei_nachher": frei_n,
                "deckung_vorher": deckung(szene, privat),
                "deckung_nachher": deckung(klein, privat),
            }
        )
        print(titel, zahl)
    return ergebnis


def main() -> int:
    privat, ziel = Path(sys.argv[1]), Path(sys.argv[2])
    ziel.mkdir(parents=True, exist_ok=True)
    figuren = figurhoehen(privat)
    held = figuren["held"] if figuren["pixellab"] else proportionen.FIGUR_AUSSEN
    gemessen = round(figuren["limezu_median"] / held, 2)
    faktoren = sorted({gemessen, *INNEN_FAKTOREN})
    befunde = befunde_zusammen(1)
    # Zu groß sind die Möbel überall gleich (Figur 20 px); verkleinert wird nur auf den Außenkarten.
    aussen = [b for b in befunde if b.verhaeltnis > b.band[1]]
    daten = {
        "figuren": figuren,
        "gemessen": gemessen,
        "faktoren": faktoren,
        "innen": innenraeume(ziel, privat, faktoren),
        "aussen": aussenkarten(ziel, privat, {b.moebel: b.vorschlag for b in aussen}),
        "aussen_befunde": aussen,
        "innen_rest": {
            f: [
                b
                for b in befunde_zusammen(f)
                if b.verhaeltnis > b.band[1]
                and any(lade_szene(s.split()[0]).get("art") == "innen" for s in b.stellen)
            ]
            for f in faktoren
        },
        "durchlass": {f: durchlass_befunde(-(-round(KOERPER * f) // ZELLE)) for f in faktoren},
    }
    daten["fehlt"] = sorted(FEHLT)
    daten["gesichter"] = {f: speichere(ziel, g, "") for f in [1, *faktoren] if (g := gesicht(privat, f))}
    schreibe_seite(ziel, daten, privat)
    groesse = (ziel / "index.html").stat().st_size
    print(f"{ziel / 'index.html'}: {groesse // 1024} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())

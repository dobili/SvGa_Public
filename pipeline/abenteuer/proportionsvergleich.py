"""Vergleichsseite zur Figurengröße für den Autor (20.11.2026): Varianten nebeneinander, mit Zahlen.

Warum: Die Möbel der gekauften Grafiksätze (LimeZu) sind für größere Figuren gezeichnet als unsere.
Der Autor wählt, ob Möbel kleiner werden oder die Figur (innen) größer. Bevor etwas im Spiel
geändert wird, zeigt diese Seite jede Variante an denselben Stellen in der echten Vergrößerung des
Spiels (Kartenpixel mal 3) und zählt, was sie berührt.

Varianten (Auftrag des Haupt-Chats):
- Ist: wie heute.
- A: Möbel innen × 0,75 (Wände, Böden, Figuren bleiben); gezählt: wie viel Boden frei wird.
- B: ganzer Innenraum × 0,75 (wie C, aber jede Kachel kleiner, Einzelheiten gehen verloren).
- C: Figuren innen × FIGURFAKTOR_C (alle, auch Statisten), Möbel und Räume bleiben.
- D: außen nur die zu großen Möbel aus demselben Paket verkleinern (Maßstab aus proportionen.py).

Bilder: aus den Kartenvorschauen der Pipeline (kartenbild.zeichne, belebungsvorschau), also mit den
Figuren aus ``spiel/figuren-neu`` (PixelLab), wenn das private Paket sie hat; sonst mit den alten
LimeZu-Bögen (die Seite sagt dann, dass die Figuren nicht stimmen).

Aufruf: ``python -m pipeline.abenteuer.proportionsvergleich PRIVAT ZIEL`` schreibt ``ZIEL/index.html``
und die Bilder; Seite und Text: proportionsseite.py.
"""

import contextlib
import copy
import json
import statistics
import sys
from pathlib import Path

from PIL import Image

from pipeline.abenteuer import belebungsvorschau, durchlass, proportionen
from pipeline.abenteuer.kartenbau import INHALTE, K, platziere, raster, sperrfelder
from pipeline.abenteuer.kartenbild import zeichne
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.proportionsseite import schreibe_seite

ZOOM = 3  # Bildschirmpixel je Kartenpixel im Spiel (weltmassstab.ts)
FIGURFAKTOR_C = 4 / 3  # 1 / 0,75
RAUMFAKTOR = 0.75
FENSTER = (8, 11)  # sichtbare Kacheln um die Stelle (Hochformat zeigt 8 × 15)
FREI = {".", ",", "_"}  # Bodenzeichen im Raster (kartentiled), grob

# Stellen der Seite: Name, Szene, Feld des Helden (x, y).
STELLEN = [
    ("Parkbank (Bild des Autors)", "maple-falls-park", (5, 12)),
    ("Picknicktisch bei Kettering", "cedar-creek-aussen", (38, 29)),
    ("Wohnzimmer", "maple-falls-wohnzimmer-tisch", (12, 7)),
    ("Clubraum", "maple-falls-clubraum", (9, 8)),
    ("Diner", "maple-falls-diner", (3, 8)),
    ("Kantine Ironwood", "ironwood-kantine", (16, 11)),
    ("Waschsalon", "cedar-creek-waschsalon", (6, 8)),
    ("Hauptstraße mit Türen", "maple-falls-aussen", (20, 12)),
]
# Möbelarten, die in Variante A nicht kleiner werden (gehören zum Raum).
RAUMTEILE = {"teppich", "boden", "boden_teil", "fenster", "bild", "treppe", "tuer", "markierung"}


def lade_szene(name: str) -> dict:
    return json.loads((INHALTE / "szenen" / f"{name}.json").read_text())


def figurhoehen(privat: Path) -> dict:
    """Gemessene Figurhöhen: Median der LimeZu-Figuren und unser Held (Kartenpixel)."""
    limezu = []
    ordner = privat / "modern-interiors" / "2_Characters" / "Old" / "Single_Characters_Legacy" / "16x16"
    for datei in sorted(ordner.glob("*idle*16x16.png")):
        bild = Image.open(datei).convert("RGBA")
        if bild.height != 2 * K:
            continue
        rahmen = [bild.crop((i * K, 0, (i + 1) * K, 2 * K)).getbbox() for i in range(min(4, bild.width // K))]
        hoehen = [r[3] - r[1] for r in rahmen if r]
        if hoehen:
            limezu.append(max(hoehen))
    held = belebungsvorschau.figurbild(privat, "figuren/held-0.png", 3, belebungsvorschau.rgba)
    umriss = held.getbbox() if held else None
    pixellab = (privat / "spiel" / "figuren-neu").exists()
    return {
        "limezu_median": statistics.median(limezu) if limezu else None,
        "limezu_anzahl": len(limezu),
        "held": (umriss[3] - umriss[1]) if umriss else None,
        "pixellab": pixellab,
    }


@contextlib.contextmanager
def figuren_mal(faktor: float):
    """Zeichnet alle Figuren der Vorschau ``faktor``-mal so groß (Füße bleiben unten mittig)."""
    alt = belebungsvorschau.figurbild

    def gross(*args, **kwargs):
        bild = alt(*args, **kwargs)
        if bild is None or faktor == 1:
            return bild
        return bild.resize((round(bild.width * faktor), round(bild.height * faktor)), Image.NEAREST)

    belebungsvorschau.figurbild = gross
    try:
        yield
    finally:
        belebungsvorschau.figurbild = alt


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
    boden = {(x, y) for y, z in enumerate(zeilen) for x, c in enumerate(z) if c in FREI}
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


def main() -> int:
    privat, ziel = Path(sys.argv[1]), Path(sys.argv[2])
    (ziel / "bilder").mkdir(parents=True, exist_ok=True)
    daten = {"figuren": figurhoehen(privat), "stellen": [], "boden": []}
    befunde = befunde_zusammen(1)
    aussen_d = {
        b.moebel: b.vorschlag
        for b in befunde
        if b.verhaeltnis > b.band[1]
        and any(lade_szene(s.split()[0]).get("art") == "aussen" for s in b.stellen)
    }
    for nummer, (titel, name, feld) in enumerate(STELLEN):
        szene = lade_szene(name)
        innen = szene.get("art") == "innen"
        bilder = {"ist": ausschnitt(vorschau(szene, privat, feld), feld)}
        if innen:
            bilder["A"] = ausschnitt(vorschau(moebel_mal(szene, RAUMFAKTOR), privat, feld), feld)
            gross = vorschau(szene, privat, feld, FIGURFAKTOR_C)
            bilder["C"] = ausschnitt(gross, feld)
            bilder["B"] = ausschnitt(gross, feld, RAUMFAKTOR)
            vorher, alle = freier_boden(szene)
            nachher, _ = freier_boden(moebel_mal(szene, RAUMFAKTOR))
            daten["boden"].append({"stelle": titel, "vorher": vorher, "nachher": nachher, "alle": alle})
        else:
            d = moebel_mal(szene, 1, set())  # Kopie
            for objekt in d.get("objekte", []):
                if objekt.get("moebel") in aussen_d:
                    objekt.update(
                        moebel_mal({"objekte": [objekt]}, aussen_d[objekt["moebel"]], {objekt["moebel"]})[
                            "objekte"
                        ][0]
                    )
            bilder["D"] = ausschnitt(vorschau(d, privat, feld), feld)
        dateien = {}
        for variante, bild in bilder.items():
            datei = f"bilder/{nummer:02d}-{variante}.png"
            bild.convert("RGB").save(ziel / datei, optimize=True)
            dateien[variante] = datei
        daten["stellen"].append({"titel": titel, "szene": name, "innen": innen, "bilder": dateien})
        print(f"{titel}: {', '.join(dateien)}")
    daten["befunde_ist"] = befunde
    daten["befunde_c"] = befunde_zusammen(FIGURFAKTOR_C)
    daten["aussen_d"] = aussen_d
    daten["durchlass_12"] = durchlass_befunde(durchlass.HELD)
    daten["durchlass_16"] = durchlass_befunde(durchlass.HELD + 1)
    daten["fehlt"] = sorted(FEHLT)
    schreibe_seite(ziel, daten, privat)
    groesse = sum(p.stat().st_size for p in ziel.rglob("*") if p.is_file())
    print(f"{ziel / 'index.html'}: {groesse // 1024} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())

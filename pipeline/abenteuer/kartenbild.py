"""Hintergrundbild und Vorschau einer gebauten Karte aus der gekauften Grafik (braucht Pillow).

Warum: Wände im Stil von LimeZu sind mehr als eine Kachel: weiße Wandkrone mit dunklem Rand, darunter
zwei Reihen Wandfläche (oben, unten mit Sockelleiste). Der Kartenbauer legt nur das Raster fest; dieses
Skript zeichnet daraus den Hintergrund (``spiel/grafik/karten/<kennung>.png`` im privaten Repository)
und eine Vorschau mit Möbeln und Figuren für die Bildprüfung.
Aufruf: ``python -m pipeline.abenteuer.kartenbild PRIVAT VORSCHAUORDNER inhalte/abenteuer/szenen/*.json``
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

from pipeline.abenteuer.bodenraster import bodenfeld, randnachbar
from pipeline.abenteuer.kartenbau import GESPERRT, INHALTE, LEER, WAND, WASSER, K, lade, platziere, raster
from pipeline.abenteuer.katalog import katalogbefund, katalogeintraege
from pipeline.abenteuer.moebelliste import lade_moebel

KRONE = (246, 246, 248, 255)
KRONENRAND = (58, 58, 80, 255)
DUNKEL = (26, 22, 18, 255)
# Deckender Festschatten der Standardbilder von LimeZu (wirkt auf unseren Böden wie ein Schleier).
GRAUSCHATTEN = (167, 151, 150, 255)


def kachel(privat: Path, boegen: dict, angabe: dict, feld: list[int]) -> Image.Image:
    bogen = Image.open(privat / boegen[angabe["bogen"]]).convert("RGBA")
    return bogen.crop((feld[0] * K, feld[1] * K, (feld[0] + 1) * K, (feld[1] + 1) * K))


def moebelbild(privat: Path, quelle: str) -> Image.Image:
    """Das Bild eines Möbels; die umgefärbte Fassung (spiel/schatten/, durchscheinender statt grauer
    Festschatten, werkzeuge/schatten.py) geht vor, wie im Paketbau der App."""
    umgefaerbt = privat / "spiel" / "schatten" / quelle
    return Image.open(umgefaerbt if umgefaerbt.exists() else privat / quelle).convert("RGBA")


def grauer_schatten(privat: Path, quelle: str) -> bool:
    """Ob das Möbel ohne umgefärbte Fassung noch den deckenden grauen Schatten von LimeZu trägt."""
    return GRAUSCHATTEN in set(moebelbild(privat, quelle).get_flattened_data())


def wellenbild(art: dict, feld: list[int], x: int, y: int) -> str | None:
    """Ein Wellen- oder Glanzbild für offenes Wasser an (x, y), oder None.

    Warum: Einfarbiges Wasser wirkte auf den Autor langweilig (KARTENREGELN 10.4). Nur auf
    Mittelstücken (kein Ufer), fest je Ort gestreut, damit das Bild bei jedem Bau gleich bleibt.
    """
    wellen = art.get("wellen")
    if not wellen or feld != [art["rand"][0] + 1, art["rand"][1] + 1]:
        return None
    wurf = (x * 92821 + y * 68917 + x * y * 31) % 100
    if wurf >= wellen["anteil"]:
        return None
    return wellen["bilder"][(x * 13 + y * 7) % len(wellen["bilder"])]


def flaechen(zeilen: list[str]) -> dict[tuple[int, int], str]:
    """Wandflächen: die zwei Wandkacheln direkt über einem Boden werden Fläche (oben, unten)."""
    flaeche = {}
    for y in range(2, len(zeilen)):
        for x, z in enumerate(zeilen[y]):
            if z not in GESPERRT and zeilen[y - 1][x] == WAND and zeilen[y - 2][x] == WAND:
                flaeche[(x, y - 1)] = "unten"
                flaeche[(x, y - 2)] = "oben"
    return flaeche


def hintergrund(szene: dict, privat: Path) -> Image.Image:
    mat = lade(INHALTE / "materialien.json")
    boegen, boeden, waende = mat["boegen"], mat["boeden"], mat["waende"]
    # Brückenfelder (Szene „bruecken“) sind begehbar, gezeichnet wird darunter aber Wasser mit
    # durchgehendem Ufer; die Brücke selbst ist ein Bild aus dem Katalog (KARTENREGELN 10.6).
    bruecken = set(szene.get("bruecken", []))
    zeilen = ["".join(WASSER if z in bruecken else z for z in zeile) for zeile in raster(szene)]
    bild = Image.new("RGBA", (len(zeilen[0]) * K, len(zeilen) * K), DUNKEL)
    zeichner = ImageDraw.Draw(bild)
    grund = szene.get("boden", "holzHell")
    sonder = szene.get("boeden", {})
    wand = waende[szene.get("wand", "creme")]
    # Draußen ist „#“ eine Hecke (oder ein anderer Boden aus „wandart“), keine Wandkrone.
    wandart = boeden.get(szene["wandart"]) if szene.get("wandart") else None
    flaeche = {} if wandart else flaechen(zeilen)
    for y, zeile in enumerate(zeilen):
        for x, z in enumerate(zeile):
            ort = (x * K, y * K)
            if z == WASSER:
                art = boeden["wasser"]
                feld = bodenfeld(art, zeilen, x, y)
                bild.alpha_composite(kachel(privat, boegen, art, feld), ort)
                if (welle := wellenbild(art, feld, x, y)) is not None:
                    bild.alpha_composite(Image.open(privat / welle).convert("RGBA"), ort)
            elif z == WAND and wandart and (innen := randnachbar(zeilen, x, y)) is not None:
                # Außen ist der Rand nur Kollision: Er zeigt den Boden dahinter, damit Felder und
                # Wege bis an den Bildrand reichen (Regel 5.1, 6.3; Hinweis von niedrig-1).
                nz = zeilen[innen[1]][innen[0]]
                art = boeden["wasser"] if nz == WASSER else boeden[sonder.get(nz, grund)]
                bild.alpha_composite(kachel(privat, boegen, art, bodenfeld(art, zeilen, *innen)), ort)
            elif z == WAND and wandart:
                bild.alpha_composite(kachel(privat, boegen, wandart, wandart["feld"]), ort)
            elif z == WAND and (x, y) in flaeche:
                teil = wand[flaeche[(x, y)]]
                bild.alpha_composite(kachel(privat, boegen, wand, teil), ort)
            elif z == WAND:
                zeichner.rectangle((*ort, ort[0] + K - 1, ort[1] + K - 1), fill=KRONE)
            elif z != LEER:
                art = boeden[sonder.get(z, grund)]
                bild.alpha_composite(kachel(privat, boegen, art, bodenfeld(art, zeilen, x, y)), ort)
    if not wandart:
        _kronenrand(zeichner, zeilen, flaeche)
    return bild


def _kronenrand(zeichner: ImageDraw.ImageDraw, zeilen: list[str], flaeche: dict) -> None:
    """Dunkler Rand der Wandkrone, wo sie an Boden, Fläche oder Leere grenzt (wie bei LimeZu)."""

    def krone(x: int, y: int) -> bool:
        return (
            0 <= y < len(zeilen)
            and 0 <= x < len(zeilen[0])
            and zeilen[y][x] == WAND
            and (x, y) not in flaeche
        )

    for y in range(len(zeilen)):
        for x in range(len(zeilen[0])):
            if not krone(x, y):
                continue
            x0, y0, x1, y1 = x * K, y * K, x * K + K - 1, y * K + K - 1
            if not krone(x, y - 1):
                zeichner.line((x0, y0, x1, y0), fill=KRONENRAND, width=2)
            if not krone(x, y + 1):
                zeichner.line((x0, y1 - 1, x1, y1 - 1), fill=KRONENRAND, width=2)
            if not krone(x - 1, y):
                zeichner.line((x0, y0, x0, y1), fill=KRONENRAND, width=2)
            if not krone(x + 1, y):
                zeichner.line((x1 - 1, y0, x1 - 1, y1), fill=KRONENRAND, width=2)


# Ab so vielen hellen, deckenden Pixeln an der linken, rechten oder oberen Bildkante gilt ein Bild als
# angeschnitten (ein Bauteil eines größeren Möbels); die Unterkante zählt nicht (Schatten am Boden).
ANSCHNITT = 6


def angeschnitten(bild: Image.Image) -> list[str]:
    """Kanten, an denen das Bild angeschnitten wirkt (deckende, helle Pixel statt dunklem Umriss).

    Warum: Viele Einzelbilder von LimeZu sind Teile größerer Möbel (halber Tisch, Regalstück); allein
    gesetzt wirken sie abgeschnitten (Rückmeldung des Autors, 9.11.2026).
    """
    rgba = bild.convert("RGBA")
    breite, hoehe = rgba.size
    px = rgba.load()

    def hell(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        return a > 0 and r * 0.3 + g * 0.59 + b * 0.11 > 100

    kanten = {
        "oben": sum(hell(x, 0) for x in range(breite)),
        "links": sum(hell(0, y) for y in range(hoehe)),
        "rechts": sum(hell(breite - 1, y) for y in range(hoehe)),
    }
    return [k for k, n in kanten.items() if n >= ANSCHNITT]


def bildbefunde(szene: dict, privat: Path) -> list[str]:
    """Befunde, die nur mit den Bildern prüfbar sind: angeschnittene Bauteile, unsichere Einträge."""
    moebel = lade_moebel()
    katalog = katalogeintraege(privat)
    befunde = []
    for eintrag in szene.get("objekte", []):
        angabe = moebel.get(eintrag["moebel"])
        if angabe and grauer_schatten(privat, angabe["quelle"]):
            befunde.append(
                f"{eintrag['moebel']} hat den grauen Festschatten: werkzeuge/schatten.py im privaten "
                "Repository laufen lassen (oder die Black_Shadow-Fassung nehmen)"
            )
        if not angabe or eintrag.get("bauteil_ok"):
            continue
        befund = katalogbefund(eintrag["moebel"], katalog.get(angabe["quelle"]))
        if befund:
            befunde.append(befund)
        kanten = angeschnitten(Image.open(privat / angabe["quelle"]))
        if kanten:
            befunde.append(f"{eintrag['moebel']} wirkt angeschnitten ({', '.join(kanten)}): Bauteil?")
    return befunde


def vorschau(szene: dict, privat: Path, grund: Image.Image) -> Image.Image:
    """Hintergrund mit Möbeln (nach Tiefe) und Figuren von vorn, doppelt vergrößert."""
    moebel = lade_moebel()
    gesetzt, _ = platziere(szene, moebel)
    bild = grund.copy()
    teile = [(s["tiefe"], s["x"], s["y"], moebelbild(privat, moebel[s["name"]]["quelle"])) for s in gesetzt]
    orte = {o["kennung"]: o for o in lade(INHALTE / "orte.json")["orte"]}
    ort = orte.get(szene["karte"].split(".")[0], {"figuren": []})
    for f in szene.get("figuren", []):
        figur = next((x for x in ort["figuren"] if x["kennung"].split(".", 1)[1] == f["name"]), None)
        sprite = privat / "spiel" / figur["sprite"] if figur else None
        if sprite and sprite.exists():
            teil = Image.open(sprite).convert("RGBA").crop((48, 0, 64, 32))
            x, y = f["feld"][0] * K, f["feld"][1] * K - K
            teile.append((y + K + K // 2, x, y, teil))
    for _, x, y, teil in sorted(teile, key=lambda t: t[0]):
        bild.alpha_composite(teil, (max(0, x), max(0, y)))
    return bild.resize((bild.width * 2, bild.height * 2), Image.NEAREST)


def main() -> None:
    privat, vorschauordner = Path(sys.argv[1]), Path(sys.argv[2])
    vorschauordner.mkdir(parents=True, exist_ok=True)
    (privat / "spiel" / "grafik" / "karten").mkdir(parents=True, exist_ok=True)
    for name in sys.argv[3:]:
        szene = lade(Path(name))
        grund = hintergrund(szene, privat)
        grund.convert("RGB").save(privat / "spiel" / "grafik" / "karten" / f"{szene['karte']}.png")
        vorschau(szene, privat, grund).convert("RGB").save(vorschauordner / f"{szene['karte']}.png")
        befunde = sorted(set(bildbefunde(szene, privat)))
        print(f"{szene['karte']}: Hintergrund und Vorschau gezeichnet")
        for b in befunde:
            print(f"  - {b}")


if __name__ == "__main__":
    main()

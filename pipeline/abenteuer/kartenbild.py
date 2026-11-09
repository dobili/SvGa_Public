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

from pipeline.abenteuer.kartenbau import GESPERRT, INHALTE, LEER, WAND, WASSER, K, lade, platziere, raster

KRONE = (246, 246, 248, 255)
KRONENRAND = (58, 58, 80, 255)
DUNKEL = (26, 22, 18, 255)


def kachel(privat: Path, boegen: dict, angabe: dict, feld: list[int]) -> Image.Image:
    bogen = Image.open(privat / boegen[angabe["bogen"]]).convert("RGBA")
    return bogen.crop((feld[0] * K, feld[1] * K, (feld[0] + 1) * K, (feld[1] + 1) * K))


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
    zeilen = raster(szene)
    bild = Image.new("RGBA", (len(zeilen[0]) * K, len(zeilen) * K), DUNKEL)
    zeichner = ImageDraw.Draw(bild)
    grund = szene.get("boden", "holzHell")
    sonder = szene.get("boeden", {})
    wand = waende[szene.get("wand", "creme")]
    flaeche = flaechen(zeilen)
    for y, zeile in enumerate(zeilen):
        for x, z in enumerate(zeile):
            ort = (x * K, y * K)
            if z == WASSER:
                bild.alpha_composite(kachel(privat, boegen, boeden["wasser"], boeden["wasser"]["feld"]), ort)
            elif z == WAND and (x, y) in flaeche:
                teil = wand[flaeche[(x, y)]]
                bild.alpha_composite(kachel(privat, boegen, wand, teil), ort)
            elif z == WAND:
                zeichner.rectangle((*ort, ort[0] + K - 1, ort[1] + K - 1), fill=KRONE)
            elif z != LEER:
                art = boeden[sonder.get(z, grund)]
                bild.alpha_composite(kachel(privat, boegen, art, art["feld"]), ort)
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


def vorschau(szene: dict, privat: Path, grund: Image.Image) -> Image.Image:
    """Hintergrund mit Möbeln (nach Tiefe) und Figuren von vorn, doppelt vergrößert."""
    moebel = lade(INHALTE / "moebel.json")["moebel"]
    gesetzt, _ = platziere(szene, moebel)
    bild = grund.copy()
    teile = [
        (s["tiefe"], s["x"], s["y"], Image.open(privat / moebel[s["name"]]["quelle"]).convert("RGBA"))
        for s in gesetzt
    ]
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
        print(f"{szene['karte']}: Hintergrund und Vorschau gezeichnet")


if __name__ == "__main__":
    main()

"""Schräge Geländerstücke (45°) aus LimeZus weißem Metallgeländer „Fence_2“ für achteckige Decks.

Warum: Der offene Pavillon in Riverton ist ein Achteck (Wunsch des Autors, 17.11.2026). An den vier
Schrägen stand das Geländer als Treppe aus Eckstücken (``sd6RelingObenLinks`` …): Jede Stufe war
ein eigenes Eckstück, zwischen den Stufen fehlte die Verbindung, und der Dielenboden ragte außen
über die Stufen hinaus (Rückmeldung des Autors, 17.11.2026: „mehrfach abgeschnitten, Lücken“).
LimeZu hat keine schrägen Stücke; dieses Werkzeug zeichnet sie aus Farben und Profil der geraden
Stücke, so dass sie fugenlos an die Geraden und an die Seiten anschließen.

Verfahren (je Ecke ein Bild über ``ZELLEN`` Kacheln Breite und eine Kachel mehr Höhe):

- **Profil:** Die Spalten des geraden Stücks (``Top_Middle`` oben, ``Bottom_Middle`` unten) von
  oben nach unten: Holm, Pfosten mit Schatten, Brett, Fuß. Zwei Brettreihen kommen doppelt dazu,
  damit das Band genau eine Kachel hoch ist; so deckt es die Stufen des Kachelrasters ganz.
- **Scherung:** Jede Spalte des Bilds trägt das Profil eine Reihe tiefer (oder höher) als ihre
  Nachbarin. Die Pfosten bleiben senkrecht wie im Draufsicht-Stil von LimeZu, der Holm läuft
  unter 45°. Das Muster nimmt die Spalte modulo 16 wie die geraden Stücke.
- **Anschlüsse:** Oben schließt der Holm an der Reihe des geraden Holms an (Pixelreihe 1 der Kachel);
  unten an der Reihe des geraden Holms von ``Bottom_Middle``. An der Seite steht ein Eckpfosten aus
  ``Top_Left`` oder ``Bottom_Left`` (Spalten 0 bis 4), an den das Seitenstück (``Middle_Left``)
  anschließt.
- **Wiese außen:** Was außerhalb des Bands liegt, bekommt die Graskachel der Szene (``wandart``
  „gras“). So endet der Dielenboden am Geländer, auch wo der Kartenrand Boden zeigt.
- **Geraden:** ``gerade_oben`` trägt dasselbe Profil über die ganze Kachel, damit Holm und Fuß an der
  Schräge in derselben Reihe liegen und keine Graszeile zwischen Geländer und Dielen bleibt.
  ``gerade_unten`` und ``durchgang`` sind LimeZus Stücke mit Wiese in der untersten Reihe.
- **Rechts** ist das Spiegelbild von links (das Profil von LimeZu ist spiegelgleich gebaut).

Geometrie für ein Deck mit Eckschnitt ``c`` (``ZELLEN = c + 2``): Deckfelder ``(i, j)`` im Bild
oben links mit ``i, j ≥ 1`` und ``i + j ≥ ZELLEN``; das Band liegt bei ``x + y`` von ``16·ZELLEN − 1``
bis ``16·ZELLEN + 14`` (Pixel im Bild). Unten links gelten ``i ≥ j`` und ``y − x`` von 1 bis 16.

Aufruf (Bilder liegen nur im privaten Repository, Grafik ist gekauft):
``python -m pipeline.abenteuer.schraegzaun PRIVAT`` schreibt ``PRIVAT/spiel/eigene/schraegzaun_<ecke>.png``
für ``oben_links``, ``oben_rechts``, ``unten_links``, ``unten_rechts`` (80 × 96 Pixel), dazu
``gerade_oben`` und ``gerade_unten`` (16 × 16) und ``durchgang`` (48 × 16). ``--ziel ORDNER``
schreibt woandershin, ``--masken`` gibt die feinen Kollisionsmasken für den Katalog aus.
"""

import json
import sys
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:  # Pillow nur zum Zeichnen; Geometrie und Masken gehen ohne
    from PIL import Image

K = 16
ZELLEN = 5  # Kacheln je Schräge: Eckschnitt 3 des Pavillons und je eine Kachel Anschluss
ORDNER = Path(
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/24_Additional_Houses_Singles_16x16"
)
TEIL = "24_Additional_Houses_Fence_2_{}_16x16.png"
GRAS_BOGEN = Path(
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/1_Terrains_and_Fences_16x16.png"
)
GRAS_FELD = (3, 8)  # materialien.json, Boden „gras“ (wandart des Pavillons)
# Reihen des geraden Stücks: 1–5 Holm, 6–8 Pfosten und Schatten, 9–12 Brett, 13–14 Fuß.
PROFIL_REIHEN = tuple(range(1, 10)) + (10, 10, 11, 11) + tuple(range(12, 15))
PFOSTEN = 5  # Breite des Eckpfostens (Spalten 0 bis 4 von Top_Left, Bottom_Left, Middle_Left)
PFOSTEN_OBEN = 3  # Der Pfostenkopf steht so viele Reihen über dem Holm der Schräge an der Seite.
MINDEST_PIXEL = 4  # wie feinmasken.MINDEST_PIXEL: ab so vielen Bandpixeln sperrt eine Zelle
ZELLE = 4  # Pixel je Zelle der feinen Maske (kollisionfein.ZP)
DURCHGANG_FREI = range(16, 32)  # Lücke in Fence_2_Pass zwischen den Pfosten (Spalten 16 bis 31)
ECKEN = ("oben_links", "oben_rechts", "unten_links", "unten_rechts")

Farbe = tuple[int, int, int, int]
LEER: Farbe = (0, 0, 0, 0)


def bandreihe(unten: bool, x: int, y: int, zellen: int = ZELLEN) -> int | None:
    """Reihe des Profils für das Pixel (x, y) einer linken Schräge oder None außerhalb des Bands.

    Beispiel: oben links, ZELLEN 5: (79, 0) → 0 (Holmkante, gleiche Reihe wie das gerade Stück
    ``gerade_oben`` rechts daneben); (0, 79) → 0 (an der Seite); (40, 39) → 0; (40, 38) → None.
    Unten links: (79, 80) → 0, eine Reihe über dem Holm von ``Bottom_Middle`` (45° bis an die Gerade).
    """
    reihe = y - x - 1 if unten else x + y - (K * zellen - 1)
    return reihe if 0 <= reihe < len(PROFIL_REIHEN) else None


def ist_aussen(unten: bool, x: int, y: int, zellen: int = ZELLEN) -> bool:
    """Ob das Pixel einer linken Schräge außerhalb des Geländers liegt (dort kommt Wiese hin)."""
    return (y - x - 1 >= len(PROFIL_REIHEN)) if unten else (x + y < K * zellen - 1)


def ist_deck(unten: bool, i: int, j: int, zellen: int = ZELLEN) -> bool:
    """Ob die Kachel (i, j) im Bild einer linken Schräge Dielenboden ist (Raster „.“).

    Warum: Gesperrt wird nur über dem Deck; Wiese ist im Raster schon „#“ und gesperrt, und ein Möbel,
    das dort sperrte, „stünde auf der Wand“ (kartenbau.pruefe_platz).
    Beispiel: oben links (4, 1) → ja (erste Dielenkachel der Reihe unter dem Holm), (3, 1) → nein.
    """
    if unten:
        return i >= 1 and i >= j and j <= zellen - 1
    return i >= 1 and j >= 1 and i + j >= zellen


def profil(gerade: "Image.Image") -> list[list[Farbe]]:
    """Die 16 Reihen des Bands aus dem geraden Stück, je Reihe 16 Farben (Spalte modulo 16)."""
    px = gerade.convert("RGBA").load()
    return [[px[x, r] for x in range(K)] for r in PROFIL_REIHEN]


def pfosten(ecke: "Image.Image", seite: "Image.Image", hoehe: int) -> "Image.Image":
    """Eckpfosten (PFOSTEN Pixel breit): Kopf und Körper aus dem Eckstück, darunter die Seite.

    Beispiel: Top_Left → Kopf in den Reihen 0–4, darunter der weiße Seitenholm aus Middle_Left.
    """
    from PIL import Image

    streifen = Image.new("RGBA", (PFOSTEN, hoehe), LEER)
    streifen.alpha_composite(ecke.convert("RGBA").crop((0, 0, PFOSTEN, min(K, hoehe))), (0, 0))
    for y in range(K, hoehe, K):
        streifen.alpha_composite(seite.convert("RGBA").crop((0, 0, PFOSTEN, K)), (0, y))
    return streifen


def schraege(teile: dict, gras: "Image.Image", unten: bool, zellen: int = ZELLEN) -> "Image.Image":
    """Das Bild einer linken Schräge: Wiese außen, geschertes Band, Eckpfosten an der Seite.

    Eingaben: ``teile`` mit den Bildern ``Top_Middle``/``Bottom_Middle``, ``Top_Left``/``Bottom_Left``
    und ``Middle_Left``; ``gras`` eine Kachel 16 × 16. Ausgabe: RGBA, 16·zellen × 16·(zellen + 1).
    """
    from PIL import Image

    breite, hoehe = K * zellen, K * (zellen + 1)
    band = profil(teile["Bottom_Middle" if unten else "Top_Middle"])
    wiese = gras.convert("RGBA").load()
    bild = Image.new("RGBA", (breite, hoehe), LEER)
    px = bild.load()
    for y in range(hoehe):
        for x in range(breite):
            reihe = bandreihe(unten, x, y, zellen)
            if reihe is not None:
                px[x, y] = band[reihe][x % K]
            elif ist_aussen(unten, x, y, zellen):
                px[x, y] = wiese[x % K, y % K]
    if unten:
        bild.alpha_composite(pfosten(teile["Bottom_Left"], teile["Middle_Left"], K + PFOSTEN), (0, 0))
    else:
        oben = K * zellen - 1 - PFOSTEN_OBEN
        bild.alpha_composite(pfosten(teile["Top_Left"], teile["Middle_Left"], hoehe - oben), (0, oben))
    return bild


def feinmaske(unten: bool, zellen: int = ZELLEN, rechts: bool = False) -> list[str]:
    """Feine Kollisionsmaske (Format ``maske_fein``, Zellen 4 × 4) einer Schräge.

    Gesperrt ist eine Zelle über Dielenboden (``ist_deck``), wenn mindestens MINDEST_PIXEL ihrer
    16 Pixel im Band liegen: Man läuft bis an den Fuß des Geländers, nicht hindurch.
    Beispiel: oben links, Kachel (4, 1) → die Zellen ihrer oberen linken Hälfte sperren.
    """
    zeilen = []
    for zy in range(K * (zellen + 1) // ZELLE):
        zeile = ""
        for zx in range(K * zellen // ZELLE):
            x0, y0 = zx * ZELLE, zy * ZELLE
            treffer = sum(
                bandreihe(unten, x, y, zellen) is not None
                for x in range(x0, x0 + ZELLE)
                for y in range(y0, y0 + ZELLE)
            )
            deck = ist_deck(unten, x0 // K, y0 // K, zellen)
            zeile += "#" if deck and treffer >= MINDEST_PIXEL else "."
        zeilen.append(zeile[::-1] if rechts else zeile)
    return zeilen


def lade_teile(privat: Path) -> dict:
    """Die geraden Stücke, Ecken und die Seite von Fence_2 aus dem privaten Repository."""
    from PIL import Image

    namen = ("Top_Middle", "Bottom_Middle", "Top_Left", "Bottom_Left", "Middle_Left")
    return {n: Image.open(privat / ORDNER / TEIL.format(n)).convert("RGBA") for n in namen}


def graskachel(privat: Path) -> "Image.Image":
    """Die Graskachel der Wiese (Boden „gras“ aus materialien.json)."""
    from PIL import Image

    x, y = GRAS_FELD
    return Image.open(privat / GRAS_BOGEN).convert("RGBA").crop((x * K, y * K, (x + 1) * K, (y + 1) * K))


def gerade_oben(teile: dict) -> "Image.Image":
    """Gerades Stück oben (16 × 16): das Profil der Schräge über die ganze Kachel.

    Warum: ``Top_Middle`` lässt die unterste Reihe frei; über Wiese („#“) blitzte dort zwischen
    Geländer und Dielen eine Reihe Gras durch, und sein Fuß lag zwei Reihen über dem der Schräge.
    """
    from PIL import Image

    band = profil(teile["Top_Middle"])
    bild = Image.new("RGBA", (K, K), LEER)
    for y, reihe in enumerate(band):
        for x in range(K):
            bild.putpixel((x, y), reihe[x])
    return bild


def mit_wiese_unten(bild: "Image.Image", gras: "Image.Image", frei: range = range(0)) -> "Image.Image":
    """Das Bild mit Wiese in den leeren Pixeln der untersten Reihe, außer in den Spalten ``frei``.

    Warum: Am unteren Kartenrand zeigt das Raster unter dem Geländer den Boden dahinter
    (bodenraster.randnachbar); ohne Wiese ragten die Dielen eine Reihe unter dem Geländer hervor.
    Beispiel: ``Fence_2_Pass`` (48 × 16) mit ``frei`` 16–31: Die Lücke bleibt Dielenboden (Weg).
    """
    neu, wiese = bild.convert("RGBA").copy(), gras.convert("RGBA").load()
    y = neu.height - 1
    for x in range(neu.width):
        if x not in frei and neu.getpixel((x, y))[3] == 0:
            neu.putpixel((x, y), wiese[x % K, y % K])
    return neu


def alle_bilder(teile: dict, gras: "Image.Image", pass_bild: "Image.Image", zellen: int = ZELLEN) -> dict:
    """Alle Bilder nach Namen: vier Schrägen (rechts gespiegelt), Geraden und Durchgang."""
    from PIL import ImageOps

    links = {u: schraege(teile, gras, u, zellen) for u in (False, True)}
    return {
        "oben_links": links[False],
        "oben_rechts": ImageOps.mirror(links[False]),
        "unten_links": links[True],
        "unten_rechts": ImageOps.mirror(links[True]),
        "gerade_oben": gerade_oben(teile),
        "gerade_unten": mit_wiese_unten(teile["Bottom_Middle"], gras),
        "durchgang": mit_wiese_unten(pass_bild, gras, DURCHGANG_FREI),
    }


def masken(zellen: int = ZELLEN) -> dict[str, list[str]]:
    """Die feinen Masken je Ecke (für den Katalog, ``--masken``)."""
    return {e: feinmaske(e.startswith("unten"), zellen, e.endswith("rechts")) for e in ECKEN}


def main(argv: list[str]) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    if "--masken" in argv:
        print(json.dumps(masken(), ensure_ascii=False, indent=2))
        return 0
    if not argv:
        print(__doc__)
        return 1
    privat = Path(argv[0])
    ziel = Path(argv[argv.index("--ziel") + 1]) if "--ziel" in argv else privat / "spiel" / "eigene"
    ziel.mkdir(parents=True, exist_ok=True)
    from PIL import Image

    pass_bild = Image.open(privat / ORDNER / TEIL.format("Pass"))
    for ecke, bild in alle_bilder(lade_teile(privat), graskachel(privat), pass_bild).items():
        bild.save(ziel / f"schraegzaun_{ecke}.png")
        print(ziel / f"schraegzaun_{ecke}.png")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

"""Graue Felswand mit Moos für Wasserfälle (spiel/eigene/klippe_grau.png).

Warum: Im Stadtpark von Maple Falls fiel der Wasserfall zwischen zwei grauen Felsblöcken herab, die
links und rechts einfach aufhörten; daneben lag Gras (Rückmeldung des Autors, mehrfach, 16.11.2026).
Ein Wasserfall fällt eine Felswand hinunter (KARTENREGELN Regel 45), und eine Felswand hört nie frei
auf (Regel 10.74, ``pipeline/abenteuer/hoehen.py``). Die Felskanten aus LimeZus Klippenkacheln
(Szene ``"kante": "klippe"``) gibt es nur als braune Erdwand; die Steine im Gemini-Wasserfall sind
grau mit Moos. Das Werkzeug färbt die Kacheln der Klippe (Spalten 8–10 mit Grasoberkante und 14–16
mit Erde, Reihen 42–46) und die Felstreppe (Spalte 25, Reihen 46–48) Ton für Ton in Grau um und
streut Moosflecken auf die Wand. Gras und Umrisse bleiben, wie LimeZu sie gezeichnet hat.

- ``klippe_grau.png``: derselbe Zuschnitt wie der Geländebogen, nur diese Kacheln, sonst
  durchsichtig. ``pipeline/abenteuer/klippe.py`` nimmt sie mit Szene ``"fels": "grau"``.

Aufruf: ``python klippe_grau.py <privates Repository>``.
"""

import sys
from pathlib import Path

from PIL import Image

K = 16
GELAENDE = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/1_Terrains_and_Fences_16x16.png"
WAND = [(x, y) for x in (8, 9, 10, 14, 15, 16) for y in range(42, 47)]  # Gras- und Erdvariante
TREPPE = [(25, y) for y in (46, 47, 48)]
# Die sechs Brauntöne der Erdklippe, von hell (Krone) nach dunkel (Schatten), und ihr Grau. Die
# Grautöne liegen zwischen dem Wunsch (#8a8a86, #6b6b6b, #4a4a48) und den kühleren Steinen im
# Gemini-Wasserfall (#7b8687, #545863), passend zu LimeZus blaugrauem Umriss.
GRAU = {
    (202, 136, 84): (160, 164, 160),
    (181, 117, 77): (134, 138, 138),
    (168, 95, 70): (118, 122, 124),
    (154, 86, 73): (103, 107, 110),
    (126, 72, 66): (86, 89, 94),
    (110, 62, 65): (72, 74, 80),
}
# Moos auf der Wand (#5a7a3a und ein Lichtton): nur auf mittleren Grautönen, in kleinen Flecken.
MOOS, MOOS_HELL = (90, 122, 58), (112, 142, 70)
MOOSTOENE = {(134, 138, 138), (118, 122, 124)}
# Ein Moosfleck je etwa 40 Pixel der passenden Töne, fest nach Lage (gleiches Bild bei jedem Lauf).
MOOS_TEILER, MOOS_REST = 41, (0, 1, 7)


def umfaerben(farbe: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    """Ein Pixel der braunen Klippe in Grau; Gras, Umriss und unbekannte Töne bleiben."""
    grau = GRAU.get(farbe[:3])
    return farbe if grau is None else (*grau, farbe[3])


def _moos(x: int, y: int, farbe: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    """Moosfleck an festen Stellen der Wand (x, y im ganzen Bogen), sonst die Farbe selbst."""
    if farbe[:3] not in MOOSTOENE:
        return farbe
    rest = (x * 7 + y * 13 + (x // 3) * (y // 2)) % MOOS_TEILER
    if rest not in MOOS_REST:
        return farbe
    return (*(MOOS_HELL if rest == MOOS_REST[0] else MOOS), farbe[3])


def klippe_grau(privat: Path) -> Image.Image:
    """Bogen in der Größe des Geländebogens mit der grau umgefärbten Klippe und Treppe."""
    bogen = Image.open(privat / GELAENDE).convert("RGBA")
    ziel = Image.new("RGBA", bogen.size)
    for sx, sy in WAND + TREPPE:
        kachel = bogen.crop((sx * K, sy * K, (sx + 1) * K, (sy + 1) * K))
        neu = Image.new("RGBA", kachel.size)
        for py in range(K):
            for px in range(K):
                farbe = umfaerben(kachel.getpixel((px, py)))
                if (sx, sy) in WAND and (sy > 44 or (sy == 44 and py > K // 2)):  # nur die Wand
                    farbe = _moos(sx * K + px, sy * K + py, farbe)
                neu.putpixel((px, py), farbe)
        ziel.alpha_composite(neu, (sx * K, sy * K))
    return ziel


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    klippe_grau(privat).save(privat / "spiel" / "eigene" / "klippe_grau.png")
    print("Graue Felswand nach", privat / "spiel" / "eigene")


if __name__ == "__main__":
    main()

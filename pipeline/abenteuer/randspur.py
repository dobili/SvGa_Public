"""Randspur: zieht an der fertigen Zeichnung die Ränder von Wasser und Wegen nach (ohne Pillow).

Warum: Der Autor fand in den gezeichneten Karten Lücken in Ufern und Wegrändern, die im Raster nicht
zu sehen sind (falsche Rand- oder Eckkachel). Ein Farbvergleich der Pixel taugt dafür nicht, weil
schon LimeZus richtige Uferkacheln Wasser- neben Graspixeln haben. Stattdessen prüft die Spur Kachel
für Kachel, was tatsächlich gezeichnet wurde: Grenzt Wasser oder Erde an Gras, muss die Kachel auf
genau dieser Seite ihren Rand zeigen, und an einer inneren Ecke muss die Innenecke liegen
(KARTENREGELN 10.1, 10.32).
Eingaben: je Feld die gezeichnete Bodenart und Kachel (kartenbild.hintergrund). Ausgabe: Befunde.
"""

# Höchstens so viele Felder je Befund nennen; der Rest steht als Zahl dabei.
NENNEN = 6
# Innenecken rechts neben dem 3×3-Block: Versatz → Richtung der Graskachel (diagonal).
INNENECKE = {(3, 0): (1, 1), (4, 0): (-1, 1), (3, 1): (1, -1), (4, 1): (-1, -1)}


def _hat_rand(versatz: tuple[int, int], dx: int, dy: int) -> bool:
    """Ob eine Kachel des 3×3-Blocks auf der Seite (dx, dy) ihren Rand zeigt (Innenecken: nie)."""
    spalte, reihe = versatz
    if spalte > 2:
        return False
    return {(-1, 0): spalte == 0, (1, 0): spalte == 2, (0, -1): reihe == 0, (0, 1): reihe == 2}[(dx, dy)]


def randluecken(
    gezeichnet: dict, raender: dict[str, list[int]], trennt: set[str], bruecken: frozenset = frozenset()
) -> list[str]:
    """Felder mit fehlendem Rand.

    ``gezeichnet``: (x, y) → (Bodenart, [Spalte, Reihe]) der gezeichneten Kachel; ``raender``:
    Bodenart → linke obere Ecke ihres 3×3-Blocks; ``trennt``: Bodenarten, an denen ein Rand nötig ist
    (Gras, Hecke); ``bruecken``: Bodenarten, unter denen das Wasser ohne Ufer weiterläuft (Holz).
    Wasser braucht seinen Rand an allem außer Wasser und Brücken.

    Beispiel: Ein Bach, der um eine Spalte versetzt weiterläuft, bekam die gerade Randkachel statt
    der Ecke; nach unten grenzte Gras ohne Ufer (Park, 9.11.2026). Die Spur meldet dieses Feld.
    """
    fehlt: dict[str, set[tuple[int, int]]] = {}
    for (x, y), (art, feld) in gezeichnet.items():
        if art not in raender:
            continue
        versatz = (feld[0] - raender[art][0], feld[1] - raender[art][1])

        def braucht(dx: int, dy: int, x: int = x, y: int = y, art: str = art) -> bool:
            nachbar = gezeichnet.get((x + dx, y + dy))
            if nachbar is None:
                return False  # Kartenrand
            if nachbar[0] == art or (art == "wasser" and nachbar[0] in bruecken):
                return False
            return art == "wasser" or nachbar[0] in trennt

        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            if braucht(dx, dy) and not _hat_rand(versatz, dx, dy):
                fehlt.setdefault(art, set()).add((x, y))
        if versatz == (1, 1):
            for dx, dy in INNENECKE.values():
                if braucht(dx, dy) and not braucht(dx, 0) and not braucht(0, dy):
                    fehlt.setdefault(art, set()).add((x, y))
    befunde = []
    for art, felder in sorted(fehlt.items()):
        liste = ", ".join(str(f) for f in sorted(felder, key=lambda f: (f[1], f[0]))[:NENNEN])
        mehr = f" und {len(felder) - NENNEN} weitere" if len(felder) > NENNEN else ""
        befunde.append(f"Randlücke {art} bei {liste}{mehr}")
    return befunde

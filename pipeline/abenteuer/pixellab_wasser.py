"""PixelLab-Tiere: mitgezeichnetes Wasser auf unsere Wasserfarbe ziehen.

Warum: PixelLab hat schwimmende Tiere (Ente, Alligator, Robbe …) mit eigener Wasserfläche und Wellen
erzeugt (Hinweis des Autors, 23.11.2026). Die Wellen sollen bleiben, das Wasser aber die Farbe
unserer Karten haben, damit das Tier im Teich nicht auf einem fremden blauen Fleck schwimmt.

Weg (Auftrag des Hauptchats): Wasserpixel erkennen (Farben, die im Tier ohne Wasser nicht vorkommen
und im Farbton von Wasser liegen, dazu helle Schaumkronen), Helligkeit und Struktur behalten,
Farbton und Sättigung auf unsere Wasserpalette ziehen, den Rand nach außen weich ausblenden.

Wasserpaletten: die häufigsten Farben des Wassers in den gezeichneten Karten (``spiel/grafik/karten``)
an den Feldern der Schwimmer, gemessen am 23.11.2026: „standard“ (Teiche, Flüsse, Meer; Grundfarbe
#3ca3b2) und „moor“ (Bayou, dunkles Moorwasser #1d221b).
Abhängigkeiten: Pillow.
"""

import colorsys

from PIL import Image

WASSERPALETTEN: dict[str, tuple[str, ...]] = {
    "standard": ("#3ca3b2", "#369ab0", "#3690ae", "#3fabb7", "#47babd"),
    "moor": ("#1d221b", "#191e18", "#1c221b", "#181c17", "#1a2019", "#161b15"),
}
# Farbton von Wasser (0 bis 1, Kreis): Türkis bis Blau, 150° bis 260°.
WASSER_FARBTON = (150 / 360, 260 / 360)
WASSER_MIN_SAETTIGUNG = 0.2
# Schaumkronen: fast weiß oder blass, aber nicht im Tier.
SCHAUM_MAX_SAETTIGUNG = 0.35
SCHAUM_MIN_HELLIGKEIT = 0.75
# Abstand im RGB-Würfel, ab dem eine Farbe nicht mehr zum Tier gehört.
TIERFARBE_ABSTAND = 40
# Deckkraft der Wasserpixel nach Abstand zum durchsichtigen Rand (1, 2, 3 Pixel; danach voll).
RANDVERLAUF = (0.35, 0.6, 0.85)
DECKEND_AB = 8  # Alpha, ab dem ein Pixel als gezeichnet gilt
# Wie stark die Helligkeitsunterschiede (Wellen) erhalten bleiben; im dunklen Moor gedämpft.
KONTRAST = {"standard": 0.8, "moor": 0.35}
# Deckkraft des Wassers: Moorwasser halb durchsichtig, weil der Alligator auch auf dem blauen Wasser
# der Pelikaninsel schwimmt (Foto 23.11.2026: dunkler Ring); auf dem Moor fällt es nicht auf.
DECKKRAFT = {"standard": 1.0, "moor": 0.45}


def _hex(farbe: str) -> tuple[int, int, int]:
    """„#3ca3b2“ → (60, 163, 178)."""
    return int(farbe[1:3], 16), int(farbe[3:5], 16), int(farbe[5:7], 16)


def _hls(rgb: tuple[int, int, int]) -> tuple[float, float, float]:
    return colorsys.rgb_to_hls(*(k / 255 for k in rgb))


def zielfarbe(palette: str) -> tuple[float, float, float]:
    """Mittlerer Farbton, Helligkeit und Sättigung einer Wasserpalette (HLS, je 0 bis 1)."""
    werte = [_hls(_hex(f)) for f in WASSERPALETTEN[palette]]
    return tuple(sum(w[i] for w in werte) / len(werte) for i in range(3))  # type: ignore[return-value]


def _nah(rgb: tuple[int, int, int], farben: list[tuple[int, int, int]]) -> bool:
    grenze = TIERFARBE_ABSTAND**2
    return any(sum((a - b) ** 2 for a, b in zip(rgb, f, strict=True)) < grenze for f in farben)


def ist_wasser(rgb: tuple[int, int, int], tierfarben: list[tuple[int, int, int]]) -> bool:
    """Gehört eine Farbe zum mitgezeichneten Wasser?

    Eingaben: die Farbe und die Farben des Tiers ohne Wasser (Standbilder anderer Zustände).
    Beispiel: Türkis der Ente im Teich → ja; das Grün ihres Kopfes (im Standbild) → nein.
    Sonderfall: Ein blaues Tier (Delfin, Qualle) schützt sich über ``tierfarben``.
    """
    if _nah(rgb, tierfarben):
        return False
    farbton, hell, satt = _hls(rgb)
    v = max(rgb) / 255
    if WASSER_FARBTON[0] <= farbton <= WASSER_FARBTON[1] and satt >= WASSER_MIN_SAETTIGUNG:
        return True
    return satt <= SCHAUM_MAX_SAETTIGUNG and v >= SCHAUM_MIN_HELLIGKEIT and hell < 1


def wassermaske(bild: Image.Image, tierfarben: list[tuple[int, int, int]]) -> set[tuple[int, int]]:
    """Alle Wasserpixel eines Bildes als Menge von (x, y)."""
    px = bild.load()
    cache: dict[tuple[int, int, int], bool] = {}
    maske = set()
    for y in range(bild.height):
        for x in range(bild.width):
            r, g, b, a = px[x, y]
            if a < DECKEND_AB:
                continue
            if (r, g, b) not in cache:
                cache[(r, g, b)] = ist_wasser((r, g, b), tierfarben)
            if cache[(r, g, b)]:
                maske.add((x, y))
    return maske


def mittlere_helligkeit(bilder: list[Image.Image], tierfarben: list[tuple[int, int, int]]) -> float:
    """Mittlere Helligkeit (HLS) aller Wasserpixel; 0,5 ohne Wasser."""
    werte = []
    for bild in bilder:
        px = bild.load()
        werte += [_hls(px[x, y][:3])[1] for x, y in wassermaske(bild, tierfarben)]
    return sum(werte) / len(werte) if werte else 0.5


def _randabstand(maske: set[tuple[int, int]], bild: Image.Image, x: int, y: int) -> int:
    """Abstand eines Wasserpixels zum nächsten durchsichtigen Pixel (1 bis len(RANDVERLAUF)+1)."""
    px = bild.load()
    for d in range(1, len(RANDVERLAUF) + 1):
        for dy in range(-d, d + 1):
            for dx in range(-d, d + 1):
                nx, ny = x + dx, y + dy
                aussen = not (0 <= nx < bild.width and 0 <= ny < bild.height)
                if aussen or px[nx, ny][3] < DECKEND_AB:
                    return d
    return len(RANDVERLAUF) + 1


def umfaerben(
    bild: Image.Image, tierfarben: list[tuple[int, int, int]], palette: str, quelle_l: float
) -> Image.Image:
    """Das Wasser eines Bildes in die Palette ziehen, Rand weich ausblenden (neues Bild).

    Eingaben: Bild (RGBA), Tierfarben (Schutz), Name der Palette, mittlere Helligkeit des Wassers
    aller Bilder dieses Tiers (``mittlere_helligkeit``, damit alle Bilder gleich umgefärbt werden).
    Beispiel: Ente schwimmend, Palette „standard“ → Wellen bleiben, Fläche wird #3ca3b2-artig.
    """
    ziel_h, ziel_l, ziel_s = zielfarbe(palette)
    kontrast = KONTRAST[palette]
    neu = bild.copy()
    px = neu.load()
    maske = wassermaske(bild, tierfarben)
    for x, y in maske:
        r, g, b, a = px[x, y]
        quelle_hell = _hls((r, g, b))[1]
        hell = min(1.0, max(0.0, ziel_l + (quelle_hell - quelle_l) * kontrast))
        nr, ng, nb = colorsys.hls_to_rgb(ziel_h, hell, ziel_s)
        d = _randabstand(maske, bild, x, y)
        faktor = RANDVERLAUF[d - 1] if d <= len(RANDVERLAUF) else 1.0
        alpha = round(a * faktor * DECKKRAFT[palette])
        px[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), alpha)
    return neu


def tierfarben_aus(bilder: list[Image.Image]) -> list[tuple[int, int, int]]:
    """Alle deckenden Farben einer Bilderliste (Standbilder ohne Wasser)."""
    farben: set[tuple[int, int, int]] = set()
    for bild in bilder:
        farben |= {p[:3] for p in bild.convert("RGBA").getdata() if p[3] >= DECKEND_AB}
    return sorted(farben)

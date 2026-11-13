"""Straßenarten: Trampelpfad, Landstraße, Stadtstraße und der Übergang dazwischen (R036, R037).

Warum: Der Autor sah die Landstraße, auf der der Bus fährt, mit demselben braunen Belag wie den
Zedernpfad, einen Trampelpfad durch den Wald. Und am Kartenwechsel wurde aus der Stadtstraße mit
Markierung ohne Übergang ein Erdweg. Drei Arten, die man unterscheidet (Entscheidung 3 im Auftrag
Runde 11, KARTENREGELN 10.73):

- **Trampelpfad:** Boden ``erde`` (braun, mit Grasrand). Nur zu Fuß.
- **Landstraße:** Boden ``landstrasse``: alter, ausgeblichener Asphalt ohne Bordstein, mit Bankett
  (saum.py) und zwei dunkleren Fahrspuren je Fahrbahn, ohne Mittellinie. Hier fährt der Bus.
- **Stadtstraße:** Boden ``asphalt`` mit ``markierung`` (strasse.py) und Gehweg aus Pflaster.

Der **Übergang** zwischen zwei Arten liegt auf einer Karte und ist sichtbar: Wo zwei Straßenbeläge
längs aneinanderstoßen, bricht der festere Belag unregelmäßig ab (ausgefranste Kante mit dunkler
Bruchlinie), statt mit einem geraden Schnitt zu enden.

Rolle im Gesamtbild: ``strasse.markiere`` ruft ``landstrassen`` und ``belagwechsel`` nach den Säumen
auf; beide lesen ``gezeichnet`` aus ``kartenbild.hintergrund`` (Feld → Bodenart).
"""

K = 16
LANDSTRASSE = "landstrasse"
# Festigkeit der Beläge: Der höhere bricht am Wechsel über dem niedrigeren ab.
RANG = {"erde": 0, "erdeRot": 0, "schotter": 1, LANDSTRASSE: 2, "asphalt": 3}
# Ausbleichen der Landstraße: Anteil, um den jeder Farbkanal zum warmen Grau wandert.
BLEICHE, GRAU = 0.35, (150, 142, 132)
# Fahrspuren: Lage quer zur Fahrbahn (Anteil der Breite), halbe Breite in Pixeln, Abdunklung.
SPUREN, SPUR_HALB, SPUR_DUNKEL = (0.3, 0.7), 2, 0.86
# Belagwechsel: so tief (in Pixeln) bricht der festere Belag höchstens aus.
BRUCH_TIEFE = 6
BRUCH_FARBE = (58, 54, 58, 255)
RICHTUNGEN = ((0, -1), (0, 1), (-1, 0), (1, 0))


def _zufall(x: int, y: int) -> int:
    """Fester Zufall (0 bis 255) je Stelle, damit das Bild bei jedem Bau gleich bleibt."""
    wert = (x * 374761393 + y * 668265263) & 0xFFFFFFFF
    wert = ((wert ^ (wert >> 13)) * 1274126177) & 0xFFFFFFFF
    return (wert ^ (wert >> 16)) & 0xFF


def _lauf(felder: set, x: int, y: int, dx: int, dy: int) -> tuple[int, int]:
    """Erstes Feld und Länge des Laufs von Landstraßenfeldern durch (x, y) entlang (dx, dy)."""
    while (x - dx, y - dy) in felder:
        x, y = x - dx, y - dy
    laenge = 1
    while (x + laenge * dx, y + laenge * dy) in felder:
        laenge += 1
    return (x if dx else y), laenge


def landstrassen(bild, gezeichnet: dict) -> int:
    """Bleicht alle Felder der Landstraße aus und zeichnet die Fahrspuren; gibt die Feldzahl zurück.

    Die Fahrtrichtung eines Felds ist die Richtung, in der die Straße länger ist; quer dazu liegen
    bei 30 % und 70 % der Breite zwei dunklere Spuren von vier Pixeln, hier und da unterbrochen.
    Beispiel: Landstraße von West nach Ost, drei Felder breit → zwei waagerechte Spuren.
    Sonderfall: Plätze (gleich lang wie breit) werden nur ausgeblichen.
    """
    px = bild.load()
    felder = {f for f, (art, _) in gezeichnet.items() if art == LANDSTRASSE}
    for x, y in felder:
        (ax, quer), (ay, hoch) = _lauf(felder, x, y, 1, 0), _lauf(felder, x, y, 0, 1)
        laengs_x = quer > hoch  # Fahrt von West nach Ost: Spuren liegen in festen Bildzeilen
        anfang, breite = (ay, hoch) if laengs_x else (ax, quer)
        spuren = [] if quer == hoch else [int((anfang + breite * s) * K) for s in SPUREN]
        for py in range(y * K, (y + 1) * K):
            for px_x in range(x * K, (x + 1) * K):
                r, g, b, a = px[px_x, py]
                r, g, b = (int(c + (z - c) * BLEICHE) for c, z in zip((r, g, b), GRAU, strict=True))
                q, laengs = (py, px_x) if laengs_x else (px_x, py)
                if any(abs(q - s) < SPUR_HALB for s in spuren) and _zufall(laengs // 3, q) > 40:
                    r, g, b = (int(c * SPUR_DUNKEL) for c in (r, g, b))
                px[px_x, py] = (r, g, b, a)
    return len(felder)


def belagwechsel(bild, gezeichnet: dict) -> int:
    """Zeichnet jeden Wechsel zwischen zwei Straßenbelägen als Bruchkante; gibt die Zahl zurück.

    An der Kante zwischen zwei Belägen aus ``RANG`` greift der weichere Belag unregelmäßig bis zu
    sechs Pixel in den festeren, davor liegt eine dunkle Bruchlinie. Beispiel: Stadtstraße
    („asphalt“) geht am Ortsrand in die Landstraße über → der Asphalt endet ausgefranst.
    Sonderfall: Gleicher Rang (Erde neben roter Erde) bleibt ohne Bruch.
    """
    px, wechsel = bild.load(), 0
    for (x, y), (art, _) in gezeichnet.items():
        for dx, dy in RICHTUNGEN:
            nachbar = gezeichnet.get((x + dx, y + dy), (None, None))[0]
            if art not in RANG or nachbar not in RANG or RANG[art] <= RANG[nachbar]:
                continue
            wechsel += 1
            for laengs in range(K):
                welt = ((x if dy else y) * K + laengs) // 2
                tiefe = 1 + _zufall(welt, (y if dy else x) * 31 + dx + 2 * dy) % BRUCH_TIEFE
                for t in range(tiefe + 1):
                    hier = _pixel(x, y, dx, dy, t, laengs)
                    dort = _pixel(x + dx, y + dy, -dx, -dy, t % K, laengs)
                    px[hier] = BRUCH_FARBE if t == tiefe else px[dort]
    return wechsel


def _pixel(x: int, y: int, dx: int, dy: int, tiefe: int, laengs: int) -> tuple[int, int]:
    """Pixel im Feld (x, y): ``tiefe`` Pixel von der Kante in Richtung (dx, dy) nach innen."""
    if dx:
        return (x * K + (K - 1 - tiefe if dx > 0 else tiefe), y * K + laengs)
    return (x * K + laengs, y * K + (K - 1 - tiefe if dy > 0 else tiefe))

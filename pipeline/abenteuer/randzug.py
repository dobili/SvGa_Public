"""Randzug: der Umriss einer Bodenfläche als geglätteter Linienzug (ohne Pillow, deshalb testbar).

Warum: Ufer und Wegränder bestanden aus den Rand- und Eckkacheln von LimeZu. Damit wird jede Stufe
im Raster zu einer rechtwinkligen Treppe, größere Sprünge zu Pfeilspitzen, und an schrägen Knicken
schmaler Bäche blieben Wasserquadrate ohne Rand stehen (Kartenblick 24.11.2026, Muster M03 und M04).
Kacheln können nur Steigungen von genau einer Spalte je Reihe schräg zeichnen. Dieses Modul geht
deshalb vom Umriss aus: Es läuft die Kanten der Fläche ab, setzt alle vier Pixel einen Stützpunkt
und glättet den Zug. Eine Treppe mit Stufen beliebiger Länge wird so zu einer schrägen, leicht
geschwungenen Linie, eine Ecke zu einem Bogen.

Rolle im Gesamtbild: ``weichrand.py`` füllt den geglätteten Umriss und malt den Rand hinein;
``treppenrand.py`` prüft, welche Kanten noch als Kachelstufen gezeichnet werden.

Zwei Schranken halten das Bild beim Raster, an dem die Begehbarkeit hängt:
- Feste Kanten (Kartenrand, Anschluss an einen anderen Belag, Kaimauer) bleiben, wo sie sind.
- Kein Stützpunkt wandert weiter als ``AUSSCHLAG`` Pixel (eine halbe Kachel) von seiner Kante weg.
  Das reicht genau, um eine Treppe mit Stufen von einer Kachel Höhe zur Geraden zu ziehen, und ein
  kleiner Teich schrumpft nicht zusammen.
"""

from collections.abc import Callable

# Kantenlänge einer Kachel in Pixeln (wie kartenbau.K; hier ohne Import, das Modul bleibt frei).
K = 16
# Abstand der Stützpunkte entlang der Kante in Pixeln.
STUETZABSTAND = 4
# So weit darf ein Stützpunkt höchstens von seinem Platz auf der Kachelkante wandern (Pixel).
AUSSCHLAG = 8.0
# Durchgänge der Glättung: Jeder mittelt einen Punkt mit seinen beiden Nachbarn. 120 Durchgänge
# entsprechen einem Weichzeichner von etwa zwei Kacheln Breite: Stufen bis etwa fünf Kacheln Länge
# verschwinden in einer Schrägen, längere werden zu flachen S-Bögen.
DURCHGAENGE = 120
# Die vier Seiten eines Felds im Uhrzeigersinn: Richtung zum Nachbarn → Anfang und Ende der Kante
# (in Feldecken, Fläche rechts der Laufrichtung).
SEITEN = {
    (0, -1): ((0, 0), (1, 0)),
    (1, 0): ((1, 0), (1, 1)),
    (0, 1): ((1, 1), (0, 1)),
    (-1, 0): ((0, 1), (0, 0)),
}

Punkt = tuple[float, float]
Feld = tuple[int, int]
Ecke = tuple[int, int]
# Ein geschlossener Zug: Stützpunkte und je Punkt, ob er fest ist.
Zug = tuple[list[Punkt], list[bool]]


def randkanten(felder: set[Feld], fest: Callable[[Feld, Feld], bool]) -> dict[Ecke, list[tuple[Ecke, bool]]]:
    """Alle Kanten zwischen der Fläche und ihrer Umgebung, gerichtet im Uhrzeigersinn.

    Eingaben: ``felder`` (Felder der Fläche), ``fest(feld, richtung)``: ob die Kante dieses Felds
    zu diesem Nachbarn fest bleibt. Ausgabe: Anfangsecke → Liste (Endecke, fest).
    Beispiel: ein einzelnes Feld (2, 3) → vier Kanten, von (2, 3) nach (3, 3) und so fort.
    """
    kanten: dict[Ecke, list[tuple[Ecke, bool]]] = {}
    for x, y in sorted(felder):
        for (dx, dy), (von, bis) in SEITEN.items():
            if (x + dx, y + dy) in felder:
                continue
            anfang, ende = (x + von[0], y + von[1]), (x + bis[0], y + bis[1])
            kanten.setdefault(anfang, []).append((ende, fest((x, y), (dx, dy))))
    return kanten


def _naechste(kanten: dict, vorher: Ecke, ecke: Ecke) -> tuple[Ecke, bool]:
    """Die Kante, mit der der Zug an ``ecke`` weiterläuft, und nimmt sie aus dem Vorrat.

    Sonderfall: Berühren sich zwei Felder der Fläche nur über Eck, gehen von der Ecke zwei Kanten
    ab. Dann biegt der Zug nach rechts ab (zur Fläche hin), sodass die beiden Felder zwei getrennte
    Umrisse bekommen und zwischen ihnen ein Rand entsteht.
    """
    wahl = kanten[ecke]
    if len(wahl) > 1:
        rx, ry = ecke[0] - vorher[0], ecke[1] - vorher[1]
        # Rechts der Laufrichtung (Bildschirm, y nach unten): (rx, ry) → (−ry, rx).
        wahl.sort(key=lambda k: (k[0][0] - ecke[0], k[0][1] - ecke[1]) != (-ry, rx))
    kante = wahl.pop(0)
    if not wahl:
        del kanten[ecke]
    return kante


def umrisse(felder: set[Feld], fest: Callable[[Feld, Feld], bool]) -> list[list[tuple[Ecke, bool]]]:
    """Die geschlossenen Umrisse der Fläche als Folgen von Kanten (Anfangsecke, fest).

    Beispiel: ein Teich aus 2 × 2 Feldern → ein Umriss mit acht Kanten; ein Ring aus Wasser um eine
    Insel → zwei Umrisse (außen im Uhrzeigersinn, die Insel gegen ihn).
    """
    kanten = randkanten(felder, fest)
    zuege = []
    while kanten:
        start = min(kanten)
        ecke, (ziel, haelt) = start, _naechste(kanten, start, start)
        zug = [(ecke, haelt)]
        while ziel != start:
            vorher, ecke = ecke, ziel
            ziel, haelt = _naechste(kanten, vorher, ecke)
            zug.append((ecke, haelt))
        zuege.append(zug)
    return zuege


def stuetzpunkte(umriss: list[tuple[Ecke, bool]]) -> Zug:
    """Stützpunkte alle ``STUETZABSTAND`` Pixel entlang des Umrisses, dazu je Punkt „fest“.

    Ein Punkt auf einer Ecke ist fest, wenn eine der beiden Kanten an der Ecke fest ist: Der Rand
    schließt dann genau an der Feldecke an den festen Teil an (Kartenrand, Belag, Kaimauer).
    """
    punkte: list[Punkt] = []
    haelt: list[bool] = []
    schritte = K // STUETZABSTAND
    for i, (ecke, fest) in enumerate(umriss):
        ziel = umriss[(i + 1) % len(umriss)][0]
        davor = umriss[i - 1][1]
        for s in range(schritte):
            t = s / schritte
            punkte.append(((ecke[0] + (ziel[0] - ecke[0]) * t) * K, (ecke[1] + (ziel[1] - ecke[1]) * t) * K))
            haelt.append(fest or (s == 0 and davor))
    return punkte, haelt


def _begrenzt(punkt: Punkt, heimat: Punkt) -> Punkt:
    """Der Punkt, höchstens ``AUSSCHLAG`` Pixel von seiner Heimat auf der Kachelkante entfernt."""
    dx, dy = punkt[0] - heimat[0], punkt[1] - heimat[1]
    weite = (dx * dx + dy * dy) ** 0.5
    if weite <= AUSSCHLAG:
        return punkt
    return (heimat[0] + dx * AUSSCHLAG / weite, heimat[1] + dy * AUSSCHLAG / weite)


def glaette(zug: Zug, durchgaenge: int = DURCHGAENGE) -> list[Punkt]:
    """Der geglättete Zug: Jeder freie Punkt rückt wiederholt zur Mitte seiner Nachbarn.

    Warum so: Das gleitende Mittel entlang des Umrisses verschiebt beide Ränder eines schräg
    gestuften Wegs gleich, der Weg behält seine Breite. Ein Weichzeichner über die Fläche würde
    einen zwei Kacheln breiten Weg dagegen ausdünnen.
    Eingaben: Zug aus ``stuetzpunkte``, Zahl der Durchgänge. Ausgabe: die neuen Punkte.
    Beispiel: Uferkante, die alle drei Felder um eins nach unten springt → eine Schräge, die
    höchstens ``AUSSCHLAG`` Pixel von den Stufen abweicht.
    Sonderfälle: Feste Punkte bleiben; ein Zug ganz aus festen Punkten kommt unverändert zurück.
    """
    heimat, haelt = zug
    if all(haelt):
        return list(heimat)
    punkte, zahl = list(heimat), len(heimat)
    for _ in range(durchgaenge):
        neu = []
        for i, punkt in enumerate(punkte):
            if haelt[i]:
                neu.append(punkt)
                continue
            a, b = punkte[i - 1], punkte[(i + 1) % zahl]
            mitte = ((a[0] + 2 * punkt[0] + b[0]) / 4, (a[1] + 2 * punkt[1] + b[1]) / 4)
            neu.append(_begrenzt(mitte, heimat[i]))
        punkte = neu
    return punkte


def flaeche(punkte: list[Punkt]) -> float:
    """Die Fläche des Zugs mit Vorzeichen (Pixel²): positiv für Außenumrisse, negativ für Inseln."""
    summe = 0.0
    for i, (x0, y0) in enumerate(punkte):
        x1, y1 = punkte[(i + 1) % len(punkte)]
        summe += x0 * y1 - x1 * y0
    return summe / 2


def flaechentreu(punkte: list[Punkt], heimat: list[Punkt]) -> list[Punkt]:
    """Der Zug, um seinen Schwerpunkt so gestreckt, dass er wieder die Fläche der Kacheln hat.

    Warum: Das Mitteln zieht jeden geschlossenen Umriss nach innen. Ein Teich aus 2 × 2 Feldern
    verlor so mehr als die Hälfte seiner Fläche, eine kleine Insel ebenso.
    Eingaben: geglätteter Zug ohne feste Punkte, seine Punkte auf den Kachelkanten. Ausgabe: neuer
    Zug; jeder Punkt bleibt höchstens ``AUSSCHLAG`` von seiner Heimat.
    Beispiel: Teich 2 × 2 → fast ein Kreis mit der Fläche von vier Feldern.
    """
    ist, soll = abs(flaeche(punkte)), abs(flaeche(heimat))
    if ist <= 0:
        return list(heimat)
    faktor = (soll / ist) ** 0.5
    mx, my = sum(p[0] for p in punkte) / len(punkte), sum(p[1] for p in punkte) / len(punkte)
    gestreckt = [(mx + (x - mx) * faktor, my + (y - my) * faktor) for x, y in punkte]
    return [_begrenzt(p, h) for p, h in zip(gestreckt, heimat, strict=True)]


def randzuege(felder: set[Feld], fest: Callable[[Feld, Feld], bool]) -> list[list[Punkt]]:
    """Die geglätteten Umrisse einer Fläche, größter zuerst (so füllt ``weichrand`` sie: erst die
    Außenumrisse, dann die Inseln darin).

    Eingaben wie ``randkanten``. Beispiel: Teich mit Insel → [Außenumriss, Inselumriss].
    """
    zuege = []
    for umriss in umrisse(felder, fest):
        heimat, haelt = stuetzpunkte(umriss)
        glatt = glaette((heimat, haelt))
        zuege.append(glatt if any(haelt) else flaechentreu(glatt, heimat))
    return sorted(zuege, key=lambda z: -abs(flaeche(z)))

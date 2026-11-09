"""Welche Kacheln eines Möbels sperren: Standard, ``frei_unten`` oder eine eigene ``maske``.

Warum: Ein Möbel sperrte bisher seine ganze Fläche außer der obersten Kachelreihe. Für hohe oder
offene Bilder passt das nicht: ein offenes Tor (Durchgang in der Mitte), ein Viehgatter quer über
die Straße (oberste Reihe muss mitsperren), ein Mammutbaum (nur der Stammfuß sperrt). Die Helfer
behalfen sich mit unsichtbaren Zaunpfosten (Nacht 9./10.11.2026). Kartenbau, Prüfungen und App
lesen die Angabe gleich; die App spiegelt diese Regel in app/src/abenteuer/oberwelt/moebel.ts.

Angaben am Möbel (inhalte/abenteuer/moebel/<ort>.json):
- keine: alle Kacheln außer der obersten Reihe (bei Bildern höher als eine Kachel).
- ``"frei_unten": N``: zusätzlich die untersten N Reihen frei (Gang, Veranda).
- ``"maske": ["..", "##", "#."]``: je Kachelreihe eine Zeichenkette, ``#`` sperrt, ``.`` ist frei;
  sie ersetzt beide Regeln oben. Kürzere Zeilen oder fehlende Reihen gelten als frei.
"""

K = 16


def maskenfelder(angabe: dict) -> set[tuple[int, int]]:
    """Gesperrte Kacheln relativ zur linken oberen Ecke des Bildes (Spalte, Reihe).

    Beispiel: Ein offenes Tor 64 × 48 mit ``maske`` ``["....", "#..#", "#..#"]`` sperrt nur die
    Pfosten in den Spalten 0 und 3, der Durchgang in der Mitte bleibt frei.
    """
    if "maske" in angabe:
        return {(x, y) for y, zeile in enumerate(angabe["maske"]) for x, z in enumerate(zeile) if z == "#"}
    spalten, reihen = max(1, angabe["breite"] // K), max(1, angabe["hoehe"] // K)
    oben = 1 if reihen > 1 else 0
    unten = reihen - angabe.get("frei_unten", 0)
    return {(x, y) for x in range(spalten) for y in range(oben, unten)}

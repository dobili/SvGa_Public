"""Kollision eines skalierten Objekts: die Standfläche des Katalogs wächst mit dem Bild.

Warum: Mit ``massstab`` sperrte der Kartenbau nur ganze Kacheln ab der linken oberen Ecke
(``round(maß · m) // 16``); ein angefangener Rest rechts oder unten war Bild ohne Kollision. Bei
einer Fassade 128 × 144 mit 1,2 (Bild 154 × 173) blieb so die Reihe mit der Tür begehbar, und die
Figur lief in die Hauswand (Befund des Autors, 17.11.2026). Außerdem fiel eine Katalogmaske mit
Maßstab weg (Veranda, Durchgang).

Regel: Die Standfläche des ungeskalierten Bildes (eigene ``maske`` des Katalogs, sonst die
Standardregel aus ``maske.py``: alles unter der obersten Kachelreihe, ohne ``frei_unten``) wird wie
das Bild skaliert, gespiegelt und gedreht. Im Kachelraster des gesetzten Bildes (ab seiner linken
oberen Ecke, angefangene Kacheln zählen mit) sperrt eine Kachel, wenn die Standfläche sie zu mehr
als einem Viertel deckt. Ohne Maßstab rechnet ``objektform.geformt`` wie bisher.

Die App rechnet die Kollision aus Katalog und Kartenobjekt selbst (``oberwelt/moebelform.ts``,
``begehbar.ts``, ``moebel.ts``); damit sie dasselbe sperrt, schreibt der Kartenbau die Maske eines
skalierten Möbels als Eigenschaft ``maske`` an das Objekt (``kartenbau.platziere``).
Beispiel: Fassade 128 × 144 mit ``massstab`` 1.2 → 10 Spalten und 11 Reihen, Reihe 0 frei, alle
anderen gesperrt (Rest rechts 10 Pixel, unten 13 Pixel: beide über einem Viertel).

Dazu die Türfelder (``tuer`` im Katalog, Regel 5 in ``durchgang.py``): ``skalierte_tuerfelder``
rechnet sie mit demselben Maßstab um, damit der Auslöser vor der Tür des skalierten Bildes liegt.
"""

import math

from pipeline.abenteuer.objektzuschnitt import raster, zuschnitt_von

K = 16
# Anteil einer Kachel, den die Standfläche überschreiten muss, damit die Kachel sperrt.
SPERRANTEIL = 0.25
# Spiel für Rundungsfehler der Gleitkommarechnung: genau ein Viertel sperrt nicht.
RUNDUNGSSPIEL = 1e-9
VIERTELDREHUNG = 90
# Anteil einer Kachelreihe, den die skalierte Türreihe überschreiten muss, damit sie Türreihe ist.
TUERANTEIL = 0.5
# Aufschlag beim Runden der skalierten Türbreite (wie uebergangstueren.TUER_RUNDUNG): 1,5 Kacheln
# bleiben eine Tür, 1,7 werden zwei.
TUER_RUNDUNG = 0.4
Rechteck = tuple[float, float, float, float]


def standflaeche(angabe: dict) -> list[Rechteck]:
    """Die sperrende Fläche des ungeskalierten Bildes als Rechtecke (links, oben, rechts, unten).

    Eingabe: Möbelangabe (nach einem Zuschnitt mit dessen Maske). Mit ``maske`` je gesperrter
    Kachel ein Rechteck, auf das Bild begrenzt; sonst die Standardregel als ein Rechteck bis zur
    unteren Bildkante (wie die App in ``begehbar.sperreMoebel``).
    Beispiel: Fassade 128 × 144 ohne Maske → [(0, 16, 128, 144)]; mit ``frei_unten`` 1 →
    [(0, 16, 128, 128)]. Sonderfall: Ein Bild unter zwei Kacheln Höhe sperrt ab der oberen Kante.
    """
    breite, hoehe = angabe["breite"], angabe["hoehe"]
    if "maske" in angabe:
        return [
            (x * K, y * K, min(breite, (x + 1) * K), min(hoehe, (y + 1) * K))
            for y, zeile in enumerate(angabe["maske"])
            for x, zeichen in enumerate(zeile)
            if zeichen == "#" and x * K < breite and y * K < hoehe
        ]
    oben = K if hoehe // K > 1 else 0
    unten = hoehe - angabe.get("frei_unten", 0) * K
    return [(0, oben, breite, unten)] if unten > oben else []


def geformte_flaeche(flaeche: list[Rechteck], angabe: dict, eintrag: dict) -> list[Rechteck]:
    """Die Rechtecke so, wie das Bild auf der Karte liegt: skaliert, gespiegelt, dann gedreht.

    Reihenfolge wie ``objektform.formbild``. Der Faktor je Achse folgt der gerundeten Bildgröße,
    damit die Fläche genau an der Bildkante endet.
    Beispiel: (0, 16, 128, 144) in 128 × 144 mit ``massstab`` 1.2 → (0, 19.22, 154, 173); mit
    ``drehung`` 90 dazu liegt der freie Streifen rechts: (0, 0, 153.78, 154).
    """
    massstab = float(eintrag.get("massstab", 1))
    breite, hoehe = max(1, round(angabe["breite"] * massstab)), max(1, round(angabe["hoehe"] * massstab))
    fx, fy = breite / angabe["breite"], hoehe / angabe["hoehe"]
    neu = [(x0 * fx, y0 * fy, x1 * fx, y1 * fy) for x0, y0, x1, y1 in flaeche]
    if eintrag.get("spiegeln"):
        neu = [(breite - x1, y0, breite - x0, y1) for x0, y0, x1, y1 in neu]
    for _ in range((eintrag.get("drehung", 0) % 360) // VIERTELDREHUNG):
        # Uhrzeigersinn: Der Punkt (x, y) wandert nach (hoehe − y, x), Breite und Höhe tauschen.
        neu = [(hoehe - y1, x0, hoehe - y0, x1) for x0, y0, x1, y1 in neu]
        breite, hoehe = hoehe, breite
    return neu


def deckmaske(flaeche: list[Rechteck], breite: int, hoehe: int) -> list[str]:
    """Die Maske im Kachelraster eines Bildes ``breite`` × ``hoehe``: ``#``, wo die Rechtecke eine
    Kachel zu mehr als einem Viertel decken. Angefangene Kacheln rechts und unten zählen mit.

    Eingabe: Rechtecke ohne Überlappung (Kacheln einer Maske oder ein einzelnes Rechteck).
    Beispiel: [(0, 16, 20, 40)] in 20 × 40 → ["..", "#.", "#."]: Der Rest rechts (4 Pixel) ist genau
    ein Viertel und sperrt nicht, der Rest unten (8 Pixel) sperrt.
    """
    spalten, reihen = raster(breite, hoehe)
    zeilen = []
    for reihe in range(reihen):
        zeile = ""
        for spalte in range(spalten):
            links, oben = spalte * K, reihe * K
            gedeckt = sum(
                max(0.0, min(x1, links + K) - max(x0, links)) * max(0.0, min(y1, oben + K) - max(y0, oben))
                for x0, y0, x1, y1 in flaeche
            )
            zeile += "#" if gedeckt > SPERRANTEIL * K * K + RUNDUNGSSPIEL else "."
        zeilen.append(zeile)
    return zeilen


def skalierte_maske(angabe: dict, eintrag: dict) -> list[str]:
    """Die Sperrmaske eines Objekts mit ``massstab``, so wie es auf der Karte liegt.

    Regel: KARTENREGELN 10.88 (Kollision nach Standfläche), hier für skalierte Bilder.
    Eingaben: Möbelangabe des ungeskalierten Bildes (nach einem Zuschnitt), Szeneneintrag mit
    ``massstab`` und, falls gesetzt, ``spiegeln`` und ``drehung``.
    Ausgabe: Maskenreihen im Raster des gesetzten (gedrehten) Bildes.
    Beispiel: Eisenwarenladen Crossroads (128 × 144, ``massstab`` 1.2) → 11 Reihen zu 10 Zeichen,
    die erste frei, die anderen ganz gesperrt; die Türreihe (Reihe 10) sperrt jetzt mit.
    Sonderfall: Eine eigene ``maske`` oder ``maske_fein`` am Eintrag ersetzt diese Rechnung
    (``objektform.geformt``).
    """
    flaeche = geformte_flaeche(standflaeche(angabe), angabe, eintrag)
    massstab = float(eintrag.get("massstab", 1))
    breite, hoehe = max(1, round(angabe["breite"] * massstab)), max(1, round(angabe["hoehe"] * massstab))
    if eintrag.get("drehung", 0) % (2 * VIERTELDREHUNG) == VIERTELDREHUNG:
        breite, hoehe = hoehe, breite
    return deckmaske(flaeche, breite, hoehe)


def _tuerreihe(von: float, bis: float) -> int:
    """Die erste Kachelreihe, die die Strecke [von, bis) in Pixeln zu mehr als der Hälfte deckt.

    Warum mehr als die Hälfte: Die angefangene unterste Reihe eines skalierten Gebäudes sperrt mit
    (``deckmaske``); das Türfeld davor liegt in der Reihe darunter.
    Beispiel: Blockhütte 80 hoch mit 1.5, Türreihe 5 → 120 bis 144 → Reihe 8 (Reihe 7 nur halb).
    """
    for reihe in range(int(von // K), int(-(-bis // K))):
        if min(bis, (reihe + 1) * K) - max(von, reihe * K) > TUERANTEIL * K + RUNDUNGSSPIEL:
            return reihe
    return int((von + bis) / 2 // K)


def _tuerlaeufe(tuer: list) -> list[tuple[int, int, int]]:
    """Die Türfelder als Läufe (Reihe, erste Spalte, letzte Spalte) nebeneinanderliegender Felder.
    Beispiel: [[7, 10], [8, 10]] → [(10, 7, 8)]."""
    laeufe: list[tuple[int, int, int]] = []
    for spalte, reihe in sorted((a, b) for a, b in tuer):
        passt = [i for i, (r, _, bis) in enumerate(laeufe) if r == reihe and bis == spalte - 1]
        if passt:
            laeufe[passt[0]] = (reihe, laeufe[passt[0]][1], spalte)
        else:
            laeufe.append((reihe, spalte, spalte))
    return laeufe


def skalierte_tuerfelder(tuer: list, angabe: dict, stueck: dict) -> set[tuple[int, int]]:
    """Die Türfelder eines gesetzten Gebäudes (Spalte, Reihe ab seiner linken oberen Kachel).

    Warum: ``tuer`` im Katalog nennt Felder im Raster des ungeskalierten Bildes. Mit ``massstab``
    liegt die Tür weiter rechts und unten und ist breiter; ohne Umrechnung meldete die Prüfung der
    Übergänge (``durchgang.tuerbefund``) einen Auslöser, der im Bild genau vor der Tür liegt.
    Regel (Gedanke wie ``uebergangstueren.tuerstellen``): Die Strecke nebeneinanderliegender
    Türfelder wird mit dem Bild skaliert (ein Zuschnitt links oder oben abgezogen, gespiegelt mit dem
    Bild). Die Tür beginnt in der ersten Kachel, die sie zu mehr als einem Viertel deckt (wie die
    Kollision); ihre Breite ist die skalierte Breite, auf ganze Kacheln gerundet (eine einflügelige
    Tür bleibt bis Faktor 1,5 eine Kachel breit, mit 1,7 sind es zwei). Die Reihe ist die erste, die
    die skalierte Türreihe zu mehr als der Hälfte deckt (``_tuerreihe``).
    Eingaben: ``tuer`` und Möbelangabe aus dem Katalog, das gesetzte Stück (``kartenbau.platziere``).
    Beispiel: Kantine Ironwood 208 × 160, ``tuer`` [[7, 10], [8, 10]], gesetzt mit 1.7 →
    {(12, 17), (13, 17), (14, 17)}. Blockhütte 80 × 80, ``tuer`` [[1, 5]], mit 1.25 → {(1, 6)}.
    Sonderfall: Ohne Maßstab bleiben die Felder, wie sie im Katalog stehen; eine Drehung rechnet
    die Funktion nicht um (Gebäude mit Tür stehen ungedreht).
    """
    massstab = float(stueck.get("massstab", 1))
    if massstab == 1:
        return {(a, b) for a, b in tuer}
    links, oben, rechts, unten = zuschnitt_von(stueck) or (0, 0, 0, 0)
    breite, hoehe = max(1, angabe["breite"] - links - rechts), max(1, angabe["hoehe"] - oben - unten)
    gesetzt = max(1, round(breite * massstab))
    fx, fy = gesetzt / breite, max(1, round(hoehe * massstab)) / hoehe
    felder = set()
    for reihe, von, bis in _tuerlaeufe(tuer):
        x0, x1 = (von * K - links) * fx, ((bis + 1) * K - links) * fx
        if stueck.get("spiegeln"):
            x0, x1 = gesetzt - x1, gesetzt - x0
        neue_reihe = _tuerreihe((reihe * K - oben) * fy, ((reihe + 1) * K - oben) * fy)
        erste = math.floor(x0 / K + SPERRANTEIL + RUNDUNGSSPIEL)
        anzahl = max(1, math.floor((bis - von + 1) * fx + TUER_RUNDUNG))
        felder |= {(erste + i, neue_reihe) for i in range(anzahl)}
    return felder

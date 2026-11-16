"""Kollision fein: Sperren und Freigaben in Viertelkacheln (Zellen von 4 × 4 Pixeln).

Warum: Der Autor will feiner sperren als ganze Kacheln (Wunsch des Autors, 16.11.2026): ein
Viertel, die Hälfte oder drei Viertel einer Kachel, waagrecht und senkrecht getrennt, mit dem
Kollisionspinsel und mit „Kollision bearbeiten“ an einem Bild. Jede Kachel hat dafür 4 × 4 Zellen.

Felder (alle optional, ohne sie bleibt jede Karte gleich):

- Szene ``sperren_fein``: Liste ``[x, y, maske]``; ``maske`` sind 16 Zeichen „#“ oder „.“ für die
  Zellen der Kachel (x, y), Reihe für Reihe von oben links. „#“ sperrt die Zelle.
- Szene ``freigeben_fein``: ebenso; „#“ heißt hier: Diese Zelle ist frei, auch wenn Wand, Wasser,
  Leere oder ein Möbel darunter sperren. Freigaben in Wand, Wasser oder Leere brauchen wie beim
  groben Pinsel ``freigeben_grund``.
- Objekt ``maske_fein``: Liste von Zeichenketten, je Kachel der Breite 4 Zeichen, je Kachel der
  Höhe 4 Zeilen, im Raster des ungedrehten (beschnittenen, skalierten) Bildes wie ``maske``; sie
  ersetzt ``maske`` (``objektform.geformt`` dreht und spiegelt sie mit).

Regeln:

- Der Held ist 12 × 12 Pixel groß (``oberwelt/szene.ts``). Wer in ganzen Kacheln rechnet (Ankunft,
  Tiere, Statisten, Tippschritt, Erreichbarkeit, Durchgang), zählt eine Kachel als gesperrt, wenn
  ein Held mittig auf ihr (Pixel 2 bis 14) eine gesperrte Zelle überlappte. Weil jede Zelle der
  Kachel diesen Bereich berührt, heißt das: Eine Kachel mit irgendeiner gesperrten Zelle ist
  gesperrt. Gleiche Regel: App ``oberwelt/feinsperren.ts``, Editor ``js/fein.js``.
- Eine ganz gesperrte oder ganz freigegebene Kachel schreibt der Editor als grobe Kachel
  (``sperren``, ``freigeben``). Eine Kachel steht nie zugleich grob und fein in der Szene.
- Freigaben stechen Möbel: Eine Zelle eines Möbels entfällt, wenn sie eine freigegebene Zelle
  berührt (``gib_frei_fein``); das Möbel trägt dann eine feine Maske.
- Tiled: Wand, Wasser oder Leere mit feiner Freigabe werden Boden; was dort sperrt, und alle feinen
  Sperren stehen in der Karteneigenschaft ``sperren_fein`` („x,y,maske;…“). Möbel tragen
  ``maske_fein`` („..##/..##/…“, schon geformt) und dazu die grobe ``maske``.
"""

from pipeline.abenteuer.kollisionspinsel import GESPERRT, pinselfelder
from pipeline.abenteuer.maske import maskenfelder

K = 16
Z = 4  # Zellen je Kachelkante
ZP = K // Z  # Pixel je Zelle
ZELLEN = Z * Z
FELDER = ("sperren_fein", "freigeben_fein")
TRENNER, FELDTRENNER, REIHENTRENNER = ";", ",", "/"
Feld = tuple[int, int]
Zelle = tuple[int, int]


def ist_feinmaske(wert: object) -> bool:
    """Ob ein Wert eine Kachelmaske aus 16 Zeichen „#“ oder „.“ ist."""
    return isinstance(wert, str) and len(wert) == ZELLEN and set(wert) <= {"#", "."}


def _ist_eintrag(wert: object) -> bool:
    return (
        isinstance(wert, list)
        and len(wert) == 3
        and all(isinstance(z, int) and not isinstance(z, bool) for z in wert[:2])
        and ist_feinmaske(wert[2])
    )


def feinlisten(szene: dict) -> tuple[dict[Feld, str], dict[Feld, str]]:
    """(feine Sperren, feine Freigaben) je Kachel; Ungültiges übergeht sie (Befund in feinbericht).

    Beispiel: ``{"sperren_fein": [[5, 7, "########........"]]}`` → ({(5, 7): "####…"}, {}).
    """
    ergebnis = []
    for name in FELDER:
        werte = szene.get(name, [])
        werte = werte if isinstance(werte, list) else []
        ergebnis.append({(w[0], w[1]): w[2] for w in werte if _ist_eintrag(w)})
    return ergebnis[0], ergebnis[1]


def hat_fein(szene: dict) -> bool:
    """Ob eine Szene feine Sperren oder Freigaben hat (sonst rechnet alles wie bisher)."""
    return bool(szene.get("sperren_fein") or szene.get("freigeben_fein"))


def zellen_der_maske(feld: Feld, maske: str) -> set[Zelle]:
    """Die gesperrten (bei Freigaben: freien) Zellen einer Kachelmaske in Kartenzellen.

    Beispiel: (1, 0) mit „#…“ (nur die erste Zelle) → {(4, 0)}.
    """
    x, y = feld
    return {(x * Z + i % Z, y * Z + i // Z) for i, c in enumerate(maske) if c == "#"}


def kachelzellen(feld: Feld) -> set[Zelle]:
    """Alle 16 Zellen einer Kachel. Beispiel: (0, 0) → {(0, 0), …, (3, 3)}."""
    return {(feld[0] * Z + a, feld[1] * Z + b) for a in range(Z) for b in range(Z)}


def feinzellen(szene: dict) -> tuple[set[Zelle], set[Zelle]]:
    """(gesperrte, freigegebene) Zellen der feinen Felder einer Szene in Kartenzellen."""
    sperren, freigeben = feinlisten(szene)
    zu = {z for f, m in sperren.items() for z in zellen_der_maske(f, m)}
    frei = {z for f, m in freigeben.items() for z in zellen_der_maske(f, m)}
    return zu, frei


def zellen_im_rechteck(px: int, py: int, b: int, h: int) -> set[Zelle]:
    """Die Kartenzellen, die ein Pixelrechteck berührt. Beispiel: (6, 0, 4, 4) → {(1, 0), (2, 0)}."""
    return {
        (x, y)
        for x in range(px // ZP, (px + b - 1) // ZP + 1)
        for y in range(py // ZP, (py + h - 1) // ZP + 1)
    }


def maskenzellen(stueck: dict) -> set[Zelle]:
    """Gesperrte Zellen eines Möbels relativ zu seiner Ecke: ``maske_fein`` oder die Kachelmaske.

    Beispiel: Kachelmaske ["#"] → die 16 Zellen (0..3, 0..3); ``maske_fein`` ["##..", …] → (0, 0), (1, 0).
    """
    fein = stueck.get("maske_fein")
    if isinstance(fein, list):
        return {(x, y) for y, zeile in enumerate(fein) for x, c in enumerate(str(zeile)) if c == "#"}
    return {(a * Z + i, b * Z + j) for a, b in maskenfelder(stueck) for i in range(Z) for j in range(Z)}


def stueckzellen(stueck: dict) -> set[Zelle]:
    """Die Kartenzellen, die ein Möbel mit Kollision sperrt (Feinschub: jede berührte Zelle)."""
    if not stueck["kollision"]:
        return set()
    ergebnis: set[Zelle] = set()
    for a, b in maskenzellen(stueck):
        ergebnis |= zellen_im_rechteck(stueck["x"] + a * ZP, stueck["y"] + b * ZP, ZP, ZP)
    return ergebnis


def kacheln_aus(zellen: set[Zelle]) -> set[Feld]:
    """Die Kacheln mit mindestens einer dieser Zellen (Regel des mittig stehenden Helden)."""
    return {(x // Z, y // Z) for x, y in zellen}


def sperrzellen(zeilen: list[str], gesetzt: list[dict], szene: dict) -> set[Zelle]:
    """Alle gesperrten Zellen einer Karte ohne Figuren.

    Reihenfolge wie ``kollisionspinsel.wende_an``: Raster und Möbel, dazu grobe Sperren, ohne grobe
    Freigaben; dann ohne feine Freigaben, dazu feine Sperren.
    Beispiel: Boden 2 × 1, ``sperren_fein`` [[1, 0, „########……“]] → die oberen 8 Zellen von (1, 0).
    """
    sperren, freigeben = pinselfelder(szene)
    zu, frei = feinzellen(szene)
    zellen: set[Zelle] = set()
    for y, zeile in enumerate(zeilen):
        for x, zeichen in enumerate(zeile):
            if zeichen in GESPERRT or (x, y) in sperren:
                zellen |= kachelzellen((x, y))
    for s in gesetzt:
        zellen |= stueckzellen(s)
    for feld in sperren:
        zellen |= kachelzellen(feld)
    for feld in freigeben:
        zellen -= kachelzellen(feld)
    return (zellen - frei) | zu


def hat_feine_moebel(gesetzt: list[dict]) -> bool:
    """Ob ein gesetztes Möbel mit Kollision eine feine Maske trägt."""
    return any(s["kollision"] and isinstance(s.get("maske_fein"), list) for s in gesetzt)


def grob_aus_fein(fein: list[str]) -> list[str]:
    """Die Kachelmaske zu einer feinen Maske: Eine Kachel sperrt, wenn eine ihrer Zellen sperrt.

    Beispiel: ["..##", "....", "....", "...."] → ["#"]; ["....", …] → ["."].
    """
    reihen = max(1, -(-len(fein) // Z))
    spalten = max([1] + [-(-len(str(z)) // Z) for z in fein])
    ergebnis = []
    for b in range(reihen):
        zeile = ""
        for a in range(spalten):
            teil = [str(fein[y])[a * Z : a * Z + Z] for y in range(b * Z, min(len(fein), b * Z + Z))]
            zeile += "#" if any("#" in t for t in teil) else "."
        ergebnis.append(zeile)
    return ergebnis


def _feine_maske_aus(zellen: set[Zelle], spalten: int, reihen: int) -> list[str]:
    breite = max([spalten] + [x + 1 for x, _ in zellen])
    hoehe = max([reihen] + [y + 1 for _, y in zellen])
    return ["".join("#" if (x, y) in zellen else "." for x in range(breite)) for y in range(hoehe)]


def gib_frei_fein(gesetzt: list[dict], szene: dict) -> None:
    """Nimmt aus den Möbeln jede Zelle, die eine feine Freigabe berührt; das Möbel wird dann fein.

    Warum: Wie ``kollisionspinsel.gib_frei`` sehen so Kartenbau, Prüfungen und App dieselbe Fläche.
    Schreibt ``maske_fein`` und die grobe ``maske`` (beide auch als ``objektmaske…`` für Tiled).
    Beispiel: Kiste 16 × 16 (Maske ["#"]) auf (2, 2), ``freigeben_fein`` [[2, 2, „########……“]] →
    ``maske_fein`` ["....", "....", "####", "####"], ``maske`` ["#"].
    """
    frei = feinzellen(szene)[1]
    if not frei:
        return
    freie_kacheln = kacheln_aus(frei)
    for s in gesetzt:
        if not s["kollision"] or not kacheln_aus(stueckzellen(s)) & freie_kacheln:
            continue
        zellen = maskenzellen(s)
        bleiben = {
            (a, b)
            for a, b in zellen
            if not zellen_im_rechteck(s["x"] + a * ZP, s["y"] + b * ZP, ZP, ZP) & frei
        }
        if bleiben == zellen:
            continue
        spalten, reihen = max(1, s["breite"] // K) * Z, max(1, s["hoehe"] // K) * Z
        s["maske_fein"] = _feine_maske_aus(bleiben, spalten, reihen)
        s["maske"] = grob_aus_fein(s["maske_fein"])
        s["objektmaske"], s["objektmaske_fein"] = s["maske"], s["maske_fein"]


def maske_der_zellen(feld: Feld, zellen: set[Zelle]) -> str:
    """Die 16 Zeichen einer Kachel aus Kartenzellen. Beispiel: (0, 0), {(0, 0)} → „#……“ (16)."""
    x0, y0 = feld[0] * Z, feld[1] * Z
    return "".join("#" if (x0 + i % Z, y0 + i // Z) in zellen else "." for i in range(ZELLEN))


def frei_im_raster(zeilen: list[str], szene: dict) -> set[Feld]:
    """Kacheln aus Wand, Wasser oder Leere mit feiner Freigabe: In Tiled werden sie Boden."""
    freigeben = feinlisten(szene)[1]
    return {
        (x, y)
        for x, y in freigeben
        if 0 <= y < len(zeilen) and 0 <= x < len(zeilen[y]) and zeilen[y][x] in GESPERRT
    }


def tiled_feinsperren(zeilen: list[str], szene: dict) -> dict[Feld, str]:
    """Was die Tiled-Karte fein sperren muss: feine Sperren und der Rest freigegebener Wände.

    Beispiel: Wand (0, 0) mit ``freigeben_fein`` „########……“ → {(0, 0): „……########“}.
    """
    zu, frei = feinzellen(szene)
    sperren, freigeben = pinselfelder(szene)
    ergebnis = {}
    for feld in kacheln_aus(zu) | frei_im_raster(zeilen, szene):
        zellen = zu & kachelzellen(feld)
        if feld in frei_im_raster(zeilen, szene) and feld not in freigeben:
            zellen |= kachelzellen(feld) - frei
        if zellen and feld not in sperren:
            ergebnis[feld] = maske_der_zellen(feld, zellen)
    return ergebnis


def eigenschaften(zeilen: list[str], szene: dict) -> list[dict]:
    """Die Tiled-Eigenschaft ``sperren_fein`` der Karte (nur, wenn es feine Sperren gibt).

    Beispiel: {(5, 7): „########……“} → [{"name": "sperren_fein", …, "value": "5,7,########…"}].
    """
    felder = tiled_feinsperren(zeilen, szene)
    if not felder:
        return []
    wert = TRENNER.join(
        f"{x}{FELDTRENNER}{y}{FELDTRENNER}{m}"
        for (x, y), m in sorted(felder.items(), key=lambda f: f[0][::-1])
    )
    return [{"name": "sperren_fein", "type": "string", "value": wert}]


def feinsperren_der_karte(karte: dict) -> dict[Feld, str]:
    """Die Eigenschaft ``sperren_fein`` einer Tiled-Karte gelesen (Prüfung karten.blockiert)."""
    werte = {e.get("name"): e.get("value") for e in karte.get("properties", [])}
    text = werte.get("sperren_fein")
    ergebnis = {}
    for teil in text.split(TRENNER) if isinstance(text, str) and text else []:
        x, y, maske = teil.split(FELDTRENNER)
        if ist_feinmaske(maske):
            ergebnis[(int(x), int(y))] = maske
    return ergebnis

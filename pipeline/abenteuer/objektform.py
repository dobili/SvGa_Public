"""Form eines Objekts in einer Szene: Drehung, Spiegelung, Maßstab und Ebene (Karteneditor).

Warum: Der Karteneditor (``werkzeuge/karteneditor/``, Wunsch des Autors, 15.11.2026) lässt den
Autor Bilder drehen, spiegeln, vergrößern und nach vorn oder hinten legen. Die Szene speichert das in
vier neuen, optionalen Feldern je Objekt; fehlen sie, bleibt alles wie vorher (bestehende Karten
ändern sich nicht). Kartenbau, Vorschau, App und Editor rechnen nach denselben Regeln:

- ``drehung``: 0, 90, 180 oder 270 Grad im Uhrzeigersinn um die Bildmitte.
- ``spiegeln``: waagrecht gespiegelt (links und rechts vertauscht), vor der Drehung.
- ``massstab``: Faktor 0,5 bis 3 (50 bis 300 %), vor der Drehung.
- ``ebene``: ganze Zahl, die zur berechneten ``tiefe`` addiert wird (Verschiebung, keine feste
  Tiefe). Warum Verschiebung: Die Tiefe hängt am Fuß des Bildes; so bleibt ein Möbel beim
  Verschieben richtig vor oder hinter den Figuren, und die Ebene wirkt nur zwischen Nachbarn.

Lage: ``feld`` und ``versatz`` nennen die linke obere Ecke des *gedrehten* Rechtecks. Bei 90 und
270 Grad tauschen Breite und Höhe (auch für die Kollision). Eine eigene ``maske`` dreht und spiegelt
mit, ``frei_unten`` gilt nur ungedreht. Mit Maßstab wächst die Standfläche des Katalogs (``maske``
oder Standardregel aus ``maske.py``) mit dem Bild; eine Kachel sperrt, wenn sie zu mehr als einem
Viertel gedeckt ist, auch ein angefangener Rest rechts oder unten (``objektmassstab.py``). Eine Maske
am Szeneneintrag (Übersteuerung, ``objektkollision.py``) formt sich wie die Katalogmaske und gilt
auch mit Maßstab, dann im Raster des skalierten Bildes (angefangene Kacheln zählen mit).
Deckkraft (``deckkraft``, Editor 1.5): 25, 50, 75 oder 100 Prozent (100 = Standard, dann fehlt das
Feld); nur das Bild wird durchsichtig, Kollision und Tiefe bleiben.
Zuschnitt (``zuschnitt``, Editor 1.5): Pixel links, oben, rechts und unten weg, vor allem anderen;
Regeln in ``objektzuschnitt.py``.
Spiegel der Regeln in der App: ``app/src/abenteuer/oberwelt/moebelform.ts``; im Editor:
``werkzeuge/karteneditor/js/geometrie.js``.
"""

from typing import TYPE_CHECKING

from pipeline.abenteuer.kollisionfein import Z as ZELLEN_JE_KACHEL
from pipeline.abenteuer.kollisionfein import grob_aus_fein
from pipeline.abenteuer.objektmassstab import skalierte_maske
from pipeline.abenteuer.objektzuschnitt import beschnitten, raster, zuschnitt_von

if TYPE_CHECKING:  # Pillow nur für die Bilder; Kartenbau und Tests laufen ohne
    from PIL.Image import Image as Bild

K = 16
DREHUNGEN = (0, 90, 180, 270)
MASSSTAB_MIN, MASSSTAB_MAX = 0.5, 3.0
# Stufen der Deckkraft in Prozent (Wunsch des Autors, 16.11.2026: Transparenz in Stufen).
DECKKRAFT_STUFEN = (25, 50, 75, 100)
VOLL_DECKEND = 100
# Felder, die die Form eines Objekts beschreiben (für Bericht und Tiled-Eigenschaften).
FORMFELDER = ("drehung", "spiegeln", "massstab", "zuschnitt")


def hat_form(eintrag: dict) -> bool:
    """Ob ein Szeneneintrag gedreht, gespiegelt, skaliert oder beschnitten ist.

    Beispiel: ``{"moebel": "mf4Sofa", "feld": [2, 3], "drehung": 90}`` → True; ohne die Felder
    (alle bestehenden Karten) → False.
    """
    return (
        eintrag.get("drehung", 0) % 360 != 0
        or bool(eintrag.get("spiegeln"))
        or float(eintrag.get("massstab", 1)) != 1
        or zuschnitt_von(eintrag) is not None
    )


def wirksame_groesse(breite: int, hoehe: int, eintrag: dict) -> tuple[int, int]:
    """Breite und Höhe des gezeichneten Rechtecks nach Maßstab und Drehung, in Pixeln.

    Beispiel: Sofa 64 × 32 mit ``drehung`` 90 → (32, 64); mit ``massstab`` 1.5 → (96, 48).
    Sonderfall: Gerundet auf ganze Pixel, mindestens 1. ``breite`` und ``hoehe`` sind schon
    beschnitten (``objektzuschnitt.beschnitten``), der Zuschnitt wirkt hier nicht noch einmal.
    """
    massstab = float(eintrag.get("massstab", 1))
    b, h = max(1, round(breite * massstab)), max(1, round(hoehe * massstab))
    return (h, b) if eintrag.get("drehung", 0) % 180 == 90 else (b, h)


def _maskenraster(maske: list[str], spalten: int, reihen: int) -> list[str]:
    """Die Maske auf volle Größe gebracht (fehlende Stellen gelten als frei, wie in maske.py)."""
    zeilen = [z.ljust(spalten, ".")[:spalten] for z in maske[:reihen]]
    return zeilen + ["." * spalten] * (reihen - len(zeilen))


def drehe_maske(maske: list[str], spalten: int, reihen: int, drehung: int, spiegeln: bool) -> list[str]:
    """Eine Sperrmaske (je Reihe „#“ und „.“) gespiegelt und dann im Uhrzeigersinn gedreht.

    Beispiel: ``["#.", ".."]`` (2 × 2) mit 90 Grad → ``[".#", ".."]``: Die Ecke oben links wandert
    nach oben rechts. Spiegeln: ``["#.", ".."]`` → ``[".#", ".."]``.
    """
    raster = _maskenraster(maske, spalten, reihen)
    if spiegeln:
        raster = [z[::-1] for z in raster]
    for _ in range((drehung % 360) // 90):
        # Uhrzeigersinn: neue Reihe r = alte Spalte r, von unten nach oben gelesen.
        raster = [
            "".join(raster[len(raster) - 1 - y][x] for y in range(len(raster))) for x in range(len(raster[0]))
        ]
    return raster


def geformt(angabe: dict | None, eintrag: dict) -> dict | None:
    """Die Möbelangabe so, wie das Objekt in der Szene liegt: Größe und Maske nach der Form.

    Warum: Der Kartenbau rechnet Lage, Kollision und Prüfungen mit ``breite``, ``hoehe`` und
    ``maske`` der Angabe; mit der geformten Angabe gelten alle Regeln ohne weitere Änderung.
    Eingaben: Angabe aus ``moebel/<ort>.json`` (oder None, wenn das Möbel fehlt), Szeneneintrag.
    Ausgabe: dieselbe Angabe (ohne Form und eigene Maske) oder eine Kopie mit neuer Größe und Maske.
    Beispiel: ``{"breite": 64, "hoehe": 32, "maske": ["....", "##.."]}`` mit ``drehung`` 90 →
    ``breite`` 32, ``hoehe`` 64, ``maske`` ["#.", "#.", "..", ".."].
    Sonderfall: Eine ``maske`` am Eintrag (objektkollision.py) ersetzt die Katalogmaske. Sie gilt im
    Raster des skalierten, ungedrehten Bildes und dreht und spiegelt mit. Ohne sie rechnet
    ``objektmassstab.skalierte_maske`` bei einem Maßstab die Standfläche des Katalogs um: Fassade
    128 × 144 mit ``massstab`` 1.2 → Maske mit 10 Spalten und 11 Reihen, nur die oberste frei.
    """
    if angabe is None:
        return None
    eigene = eintrag.get("maske")
    fein = _feine_maske_von(angabe, eintrag)
    if not hat_form(eintrag):
        neu = angabe if eigene is None else {**angabe, "maske": list(eigene)}
        spalten, reihen = max(1, angabe["breite"] // K), max(1, angabe["hoehe"] // K)
        return _mit_feiner_maske(neu, fein, eintrag, spalten, reihen)
    # Zuschnitt zuerst (objektzuschnitt.py): kleineres Bild, Katalogmaske mitbeschnitten.
    angabe, beschnitt = beschnitten(angabe, eintrag)
    neu = dict(angabe)
    neu["breite"], neu["hoehe"] = wirksame_groesse(angabe["breite"], angabe["hoehe"], eintrag)
    drehung, massstab = eintrag.get("drehung", 0) % 360, float(eintrag.get("massstab", 1))
    # Raster des skalierten, ungedrehten Bildes (ohne Maßstab: das Raster des Katalogs); beschnitten
    # oder skaliert zählen angefangene Kacheln mit (objektzuschnitt.raster).
    breite, hoehe = wirksame_groesse(angabe["breite"], angabe["hoehe"], {"massstab": massstab})
    angefangen = beschnitt or massstab != 1
    spalten, reihen = raster(breite, hoehe) if angefangen else (max(1, breite // K), max(1, hoehe // K))
    if massstab != 1 and eigene is None:
        # Mit Maßstab wächst die Standfläche des Katalogs mit dem Bild (objektmassstab.py).
        neu["maske"] = skalierte_maske(angabe, eintrag)
    else:
        maske = eigene if eigene is not None else angabe.get("maske")
        if maske is not None:
            neu["maske"] = drehe_maske(list(maske), spalten, reihen, drehung, bool(eintrag.get("spiegeln")))
    if drehung:
        neu.pop("frei_unten", None)
    return _mit_feiner_maske(neu, fein, eintrag, spalten, reihen)


def _feine_maske_von(angabe: dict, eintrag: dict) -> list | None:
    """Die feine Maske, die für das Objekt gilt: die des Eintrags, sonst die des Katalogs.

    Warum: Der Katalog trägt seit 16.11.2026 feine Masken nach der Standfläche (``feinmasken.py``,
    KARTENREGELN 10.88). Sie gilt wie die Katalogmaske nur ohne Maßstab und ohne Zuschnitt (sonst die
    grobe Regel) und nicht, wenn der Eintrag eine eigene ``maske`` hat.
    Beispiel: Stuhl mit Katalog-``maske_fein`` und ``drehung`` 90 → die Katalogmaske (dreht mit);
    mit ``massstab`` 2 → None.
    """
    fein = eintrag.get("maske_fein")
    if fein is None and "maske" not in eintrag and float(eintrag.get("massstab", 1)) == 1:
        fein = angabe.get("maske_fein") if zuschnitt_von(eintrag) is None else None
    if not isinstance(fein, list) or not all(isinstance(z, str) for z in fein):
        return None
    return fein


def _mit_feiner_maske(angabe: dict, fein: list | None, eintrag: dict, spalten: int, reihen: int) -> dict:
    """Die feine Maske (kollisionfein.py), gedreht und gespiegelt wie das Bild, und dazu die grobe
    ``maske`` (eine Kachel sperrt, wenn eine ihrer Zellen sperrt). Ohne feine Maske fällt eine
    ``maske_fein`` des Katalogs weg, die Angabe bleibt sonst, wie sie ist.

    Beispiel: Kiste 16 × 16 mit ``maske_fein`` ["##..", "##..", "....", "...."] und ``spiegeln`` →
    ``maske_fein`` ["..##", "..##", "....", "...."], ``maske`` ["#"].
    """
    if fein is None:
        return {k: v for k, v in angabe.items() if k != "maske_fein"} if "maske_fein" in angabe else angabe
    z = ZELLEN_JE_KACHEL
    drehung, spiegeln = eintrag.get("drehung", 0) % 360, bool(eintrag.get("spiegeln"))
    geformte = drehe_maske(list(fein), spalten * z, reihen * z, drehung, spiegeln)
    return {**angabe, "maske_fein": geformte, "maske": grob_aus_fein(geformte)}


def formangaben(eintrag: dict) -> dict:
    """Die Formfelder eines Eintrags für das gesetzte Stück (nur die gesetzten).

    Beispiel: ``{"drehung": 90, "feld": [1, 2]}`` → ``{"drehung": 90}``; ohne Form → ``{}``.
    """
    if not hat_form(eintrag):
        return {}
    return {
        k: eintrag[k] for k in FORMFELDER if k in eintrag and (k != "zuschnitt" or zuschnitt_von(eintrag))
    }


def formeigenschaften(stueck: dict) -> list[dict]:
    """Tiled-Eigenschaften der Form (App, oberwelt/moebelform.ts); ohne Form eine leere Liste.

    Beispiel: ``{"drehung": 90, "spiegeln": True}`` →
    ``[{"name": "drehung", "type": "int", "value": 90}, {"name": "spiegeln", …}]``. Der Zuschnitt
    steht als Text „links,oben,rechts,unten“ da (Tiled kennt keine Listen).
    """

    def als_text(wert: object) -> str:
        return ",".join(str(t) for t in zuschnitt_von({"zuschnitt": wert}) or (0, 0, 0, 0))

    typen = {
        "drehung": ("int", int),
        "spiegeln": ("bool", bool),
        "massstab": ("float", float),
        "zuschnitt": ("string", als_text),
    }
    return [
        {"name": k, "type": typen[k][0], "value": typen[k][1](stueck[k])} for k in FORMFELDER if k in stueck
    ]


def formbefunde(szene: dict) -> list[str]:
    """Ungültige Formfelder in den Objekten einer Szene.

    Beispiel: ``"drehung": 45`` → „mf4Sofa (2, 3): drehung 45 ist nicht 0, 90, 180 oder 270“.
    """
    befunde = []
    for eintrag in szene.get("objekte", []):
        wo = f"{eintrag.get('moebel')} {tuple(eintrag.get('feld', ()))}"
        if eintrag.get("drehung", 0) not in DREHUNGEN:
            befunde.append(f"{wo}: drehung {eintrag['drehung']} ist nicht 0, 90, 180 oder 270")
        massstab = eintrag.get("massstab", 1)
        if not isinstance(massstab, int | float) or not MASSSTAB_MIN <= massstab <= MASSSTAB_MAX:
            befunde.append(f"{wo}: massstab {massstab} liegt nicht zwischen 0,5 und 3")
        if not isinstance(eintrag.get("ebene", 0), int):
            befunde.append(f"{wo}: ebene {eintrag['ebene']} ist keine ganze Zahl")
        if eintrag.get("deckkraft", VOLL_DECKEND) not in DECKKRAFT_STUFEN:
            befunde.append(f"{wo}: deckkraft {eintrag['deckkraft']} ist nicht 25, 50, 75 oder 100")
        if not isinstance(eintrag.get("spiegeln", False), bool):
            befunde.append(f"{wo}: spiegeln muss true oder false sein")
    return befunde


def formbild(bild: "Bild", eintrag: dict) -> "Bild":
    """Ein Möbelbild in seiner Form (Vorschau in kartenbild.py, Rücklauf des Editors).

    Reihenfolge wie in App und Editor: Zuschnitt, Maßstab, Spiegeln, dann Drehung im Uhrzeigersinn.
    Beispiel: Sofa 64 × 32 mit ``drehung`` 90 → Bild 32 × 64; Zaun 64 × 32 mit ``zuschnitt``
    [26, 0, 32, 0] → Bild 6 × 32.
    """
    if not hat_form(eintrag):
        return bild
    from PIL import Image  # erst hier: Kartenbau und App-Prüfungen laufen ohne Pillow

    z = zuschnitt_von(eintrag)
    if z is not None:
        breite, hoehe = max(1, bild.width - z[0] - z[2]), max(1, bild.height - z[1] - z[3])
        bild = bild.crop((z[0], z[1], z[0] + breite, z[1] + hoehe))

    massstab = float(eintrag.get("massstab", 1))
    if massstab != 1:
        groesse = (max(1, round(bild.width * massstab)), max(1, round(bild.height * massstab)))
        bild = bild.resize(groesse, Image.NEAREST)
    if eintrag.get("spiegeln"):
        bild = bild.transpose(Image.FLIP_LEFT_RIGHT)
    # Pillow dreht gegen den Uhrzeigersinn: -90 heißt 90 Grad im Uhrzeigersinn.
    drehung = eintrag.get("drehung", 0) % 360
    return bild.rotate(-drehung, expand=True) if drehung else bild


def deckkraft_von(eintrag: dict) -> int:
    """Die Deckkraft eines Eintrags oder Stücks in Prozent; ohne Feld (oder ungültig) 100.

    Beispiel: ``{"deckkraft": 50}`` → 50; ``{}`` → 100.
    """
    wert = eintrag.get("deckkraft", VOLL_DECKEND)
    return wert if wert in DECKKRAFT_STUFEN else VOLL_DECKEND


def deckkraftangabe(eintrag: dict) -> dict:
    """Für das gesetzte Stück: ``{"deckkraft": 50}`` oder ``{}`` bei voller Deckkraft."""
    wert = deckkraft_von(eintrag)
    return {} if wert == VOLL_DECKEND else {"deckkraft": wert}


def mit_deckkraft(bild: "Bild", eintrag: dict) -> "Bild":
    """Das Bild mit der Deckkraft des Eintrags (Vorschau in kartenbild.py und im Rücklauf).

    Warum: Die App zeichnet das Möbel mit ``setAlpha``; die Vorschau soll gleich aussehen. Die
    Pixelprüfungen nehmen ``formbild`` ohne Deckkraft. Beispiel: Alpha 255 bei 50 % → 128.
    """
    wert = deckkraft_von(eintrag)
    if wert == VOLL_DECKEND:
        return bild
    rot, gruen, blau, alpha = bild.convert("RGBA").split()
    alpha = alpha.point(lambda a: round(a * wert / VOLL_DECKEND))
    from PIL import Image  # erst hier: Kartenbau läuft ohne Pillow

    return Image.merge("RGBA", (rot, gruen, blau, alpha))

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
mit; mit Maßstab gilt die Standardregel aus ``maske.py`` auf der neuen Größe, ``frei_unten`` gilt nur
ungedreht. Eine Maske am Szeneneintrag (Übersteuerung, ``objektkollision.py``) formt sich genauso,
bleibt aber auch mit Maßstab erhalten.
Spiegel der Regeln in der App: ``app/src/abenteuer/oberwelt/moebelform.ts``; im Editor:
``werkzeuge/karteneditor/js/geometrie.js``.
"""

from typing import TYPE_CHECKING

if TYPE_CHECKING:  # Pillow nur für die Bilder; Kartenbau und Tests laufen ohne
    from PIL.Image import Image as Bild

K = 16
DREHUNGEN = (0, 90, 180, 270)
MASSSTAB_MIN, MASSSTAB_MAX = 0.5, 3.0
# Felder, die die Form eines Objekts beschreiben (für Bericht und Tiled-Eigenschaften).
FORMFELDER = ("drehung", "spiegeln", "massstab")


def hat_form(eintrag: dict) -> bool:
    """Ob ein Szeneneintrag gedreht, gespiegelt oder skaliert ist.

    Beispiel: ``{"moebel": "mf4Sofa", "feld": [2, 3], "drehung": 90}`` → True; ohne die Felder
    (alle bestehenden Karten) → False.
    """
    return (
        eintrag.get("drehung", 0) % 360 != 0
        or bool(eintrag.get("spiegeln"))
        or float(eintrag.get("massstab", 1)) != 1
    )


def wirksame_groesse(breite: int, hoehe: int, eintrag: dict) -> tuple[int, int]:
    """Breite und Höhe des gezeichneten Rechtecks nach Maßstab und Drehung, in Pixeln.

    Beispiel: Sofa 64 × 32 mit ``drehung`` 90 → (32, 64); mit ``massstab`` 1.5 → (96, 48).
    Sonderfall: Gerundet auf ganze Pixel, mindestens 1.
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
    Raster des skalierten, ungedrehten Bildes und dreht und spiegelt mit; anders als die
    Katalogmaske bleibt sie auch mit Maßstab erhalten.
    """
    if angabe is None:
        return None
    eigene = eintrag.get("maske")
    if not hat_form(eintrag):
        return angabe if eigene is None else {**angabe, "maske": list(eigene)}
    neu = dict(angabe)
    neu["breite"], neu["hoehe"] = wirksame_groesse(angabe["breite"], angabe["hoehe"], eintrag)
    drehung, massstab = eintrag.get("drehung", 0) % 360, float(eintrag.get("massstab", 1))
    maske = eigene if eigene is not None else angabe.get("maske") if massstab == 1 else None
    if maske is not None:
        # Raster des skalierten, ungedrehten Bildes (ohne Maßstab: das Raster des Katalogs).
        breite, hoehe = wirksame_groesse(angabe["breite"], angabe["hoehe"], {"massstab": massstab})
        spalten, reihen = max(1, breite // K), max(1, hoehe // K)
        neu["maske"] = drehe_maske(list(maske), spalten, reihen, drehung, bool(eintrag.get("spiegeln")))
    else:
        neu.pop("maske", None)
    if drehung:
        neu.pop("frei_unten", None)
    return neu


def formangaben(eintrag: dict) -> dict:
    """Die Formfelder eines Eintrags für das gesetzte Stück (nur die gesetzten).

    Beispiel: ``{"drehung": 90, "feld": [1, 2]}`` → ``{"drehung": 90}``; ohne Form → ``{}``.
    """
    if not hat_form(eintrag):
        return {}
    return {k: eintrag[k] for k in FORMFELDER if k in eintrag}


def formeigenschaften(stueck: dict) -> list[dict]:
    """Tiled-Eigenschaften der Form (App, oberwelt/moebelform.ts); ohne Form eine leere Liste.

    Beispiel: ``{"drehung": 90, "spiegeln": True}`` →
    ``[{"name": "drehung", "type": "int", "value": 90}, {"name": "spiegeln", …}]``.
    """
    typen = {"drehung": ("int", int), "spiegeln": ("bool", bool), "massstab": ("float", float)}
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
        if not isinstance(eintrag.get("spiegeln", False), bool):
            befunde.append(f"{wo}: spiegeln muss true oder false sein")
    return befunde


def formbild(bild: "Bild", eintrag: dict) -> "Bild":
    """Ein Möbelbild in seiner Form (Vorschau in kartenbild.py, Rücklauf des Editors).

    Reihenfolge wie in App und Editor: Maßstab, Spiegeln, dann Drehung im Uhrzeigersinn.
    Beispiel: Sofa 64 × 32 mit ``drehung`` 90 → Bild 32 × 64.
    """
    if not hat_form(eintrag):
        return bild
    from PIL import Image  # erst hier: Kartenbau und App-Prüfungen laufen ohne Pillow

    massstab = float(eintrag.get("massstab", 1))
    if massstab != 1:
        groesse = (max(1, round(bild.width * massstab)), max(1, round(bild.height * massstab)))
        bild = bild.resize(groesse, Image.NEAREST)
    if eintrag.get("spiegeln"):
        bild = bild.transpose(Image.FLIP_LEFT_RIGHT)
    # Pillow dreht gegen den Uhrzeigersinn: -90 heißt 90 Grad im Uhrzeigersinn.
    drehung = eintrag.get("drehung", 0) % 360
    return bild.rotate(-drehung, expand=True) if drehung else bild

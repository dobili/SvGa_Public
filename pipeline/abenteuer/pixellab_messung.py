"""PixelLab-Tiere, Messungen: Kasten der deckenden Pixel, Maßstab aus Höhe und Länge, Fußweg.

Warum: ausgelagert aus pixellab_tiere.py, damit beide Dateien unter 400 Zeilen bleiben (Regel 4).
Die Messungen arbeiten nur auf Bildern und Zahlen, nicht auf den Exporten.
Abhängigkeiten: Pillow, tierplan.py (Zielhöhen).
"""

from PIL import Image

DECKEND_AB = 8  # Alpha, ab dem ein Pixel als gezeichnet gilt (wie pixellab_wasser.py)


def _kasten(bilder: list[Image.Image]) -> tuple[int, int, int, int]:
    """Gemeinsamer Kasten (links, oben, rechts, unten) der deckenden Pixel mehrerer Bilder."""
    kaesten = [
        k for b in bilder if (k := b.getchannel("A").point(lambda a: 255 if a >= DECKEND_AB else 0).getbbox())
    ]
    return (
        min(k[0] for k in kaesten),
        min(k[1] for k in kaesten),
        max(k[2] for k in kaesten),
        max(k[3] for k in kaesten),
    )


# Ab diesem Verhältnis Länge zu Höhe (echte Maße, tierplan_daten) bestimmt auch die Länge den Maßstab.
LANG_AB = 1.5
# Höchste Vergrößerung; darüber ist das Bild zu klein erzeugt und wird gemeldet (Hauptchat).
HOECHSTENS_VERGROESSERN = 1.1


def massstab(art: str, hoehe: int, laenge: int) -> tuple[float, str]:
    """Faktor, mit dem das Tier im Spiel die Zielhöhe des Tierplans hat, und wonach er sich richtet.

    Lange Tiere (Alligator, Delfin, Dackel) dürfen auch die Ziellänge nicht überschreiten: dann
    gilt der kleinere der beiden Faktoren. Ein Faktor für den ganzen Bogen (Bewegung und Zustände
    springen nicht). Beispiel: Ente, Höhe 21, Ziel 11 → 0.52 nach der Höhe.
    """
    from pipeline.abenteuer import tierplan
    from pipeline.abenteuer.tierplan_daten import ARTEN

    a = ARTEN[art]
    nach_hoehe = tierplan.zielhoehe(a) / hoehe
    if a.laenge >= LANG_AB * a.hoehe:
        nach_laenge = tierplan.ziellaenge(a) / laenge
        if nach_laenge < nach_hoehe:
            return round(nach_laenge, 2), "laenge"
    return round(nach_hoehe, 2), "hoehe"


# Bewegungen ohne Füße am Boden: keine Schrittweite (Fliegen, Schwimmen, Wippen, Hüpfen im Wechsel).
OHNE_SCHRITT = ("flying", "swimming", "wippen", "wechsel")


def fussweg(bilder: list[Image.Image]) -> int:
    """Weg der Füße in einem Gehzyklus nach rechts (px im Bogen): größte Spanne der untersten
    Pixelzeile über die sechs Bilder, vorn oder hinten.

    Warum: Rutschen beim Gehen (Hauptchat, 23.11.2026). Die App lässt die Gehbilder so schnell
    laufen, dass ein Zyklus etwa so weit trägt, wie die Füße gehen (tiere.ts, gangfaktor).
    Beispiel Pferd: 9 px im Bogen, mit Faktor 0,76 knapp 7 Spielpixel je Zyklus.
    """
    vorn, hinten = [], []
    for bild in bilder:
        maske = bild.getchannel("A").point(lambda a: 255 if a >= DECKEND_AB else 0)
        unten = maske.getbbox()[3] - 1
        sohle = [x for x in range(bild.width) if maske.getpixel((x, unten)) or maske.getpixel((x, unten - 1))]
        hinten.append(min(sohle))
        vorn.append(max(sohle))
    return max(max(vorn) - min(vorn), max(hinten) - min(hinten))

"""Kontaktbögen der Kontur je Katalogeintrag (Übersicht für den Autor, ``konturkollision.py``).

Warum: Ob der Held vor, hinter oder auf einem Pixel stehen darf, sieht man nur am Bild (Auftrag des
Autors, 28.11.2026). Je Eintrag das Bild vergrößert, jeder deckende Pixel eingefärbt: rot Sperre
(weder davor noch dahinter), gelb Held dahinter (der Pixel verdeckt ihn), grün Held davor oder darauf
(Pixel unter ihm); blaue Linie die Sortierlinie, gestrichelt grau die alte Linie, wenn sie abweicht.
Darunter Name, Art und Befund. Ablage nur lokal (Bilder aus dem privaten Paket).
"""

from collections.abc import Callable
from pathlib import Path

from pipeline.abenteuer.konturkollision import Kontur, pixelklassen

FELD = 240  # Breite eines Felds auf dem Bogen in Pixeln
TEXT = 48  # Höhe der Beschriftung
HOECHSTENS = 4  # größter Vergrößerungsfaktor
JE_BOGEN = 40
SPALTEN = 8
FARBEN = {"s": (230, 30, 30, 150), "h": (240, 200, 20, 110), "v": (30, 180, 60, 120)}
BLAU, GRAU = (30, 80, 240, 255), (110, 110, 110, 255)
GRUND = (238, 238, 232, 255)


def _faktor(breite: int, hoehe: int) -> float:
    """Vergrößerungsfaktor, der ins Feld passt: ganzzahlig bis HOECHSTENS, große Bilder kleiner."""
    passt = (FELD - 8) / max(breite, hoehe)
    return float(min(HOECHSTENS, int(passt))) if passt >= 1 else passt


def _deckschicht(klassen: list[list[str]], groesse: tuple[int, int]):
    """Die Farbschicht in Bildgröße: je Pixel die Farbe seiner Klasse (durchsichtig sonst)."""
    from PIL import Image

    deck = Image.new("RGBA", groesse, (0, 0, 0, 0))
    deck.putdata([FARBEN.get(k, (0, 0, 0, 0)) for zeile in klassen for k in zeile])
    return deck


def feld(kontur: Kontur, angabe: dict, alpha: bytes | None, quelle):
    """Ein Feld des Bogens: Bild vergrößert, Klassen eingefärbt, Linien, Beschriftung."""
    from PIL import Image, ImageDraw

    bild = Image.new("RGBA", (FELD, FELD + TEXT), GRUND)
    schrift = ImageDraw.Draw(bild)
    if alpha is not None and quelle is not None:
        b, h = angabe["breite"], angabe["hoehe"]
        f = _faktor(b, h)
        eingefaerbt = quelle.copy()
        eingefaerbt.alpha_composite(_deckschicht(pixelklassen(kontur, alpha, b, h), (b, h)))
        gross = eingefaerbt.resize((max(1, round(b * f)), max(1, round(h * f))), Image.NEAREST)
        ox, oy = (FELD - gross.width) // 2, (FELD - gross.height) // 2
        bild.alpha_composite(gross, (ox, oy))
        schrift.rectangle([ox - 1, oy - 1, ox + gross.width, oy + gross.height], outline=GRAU)
        if kontur.ebene is None:
            if kontur.sortierlinie is not None and kontur.linie_alt != kontur.linie:
                y_alt = oy + round(kontur.linie_alt * f)
                for x in range(ox - 6, ox + gross.width + 6, 6):
                    schrift.line([x, y_alt, x + 3, y_alt], fill=GRAU, width=1)
            y = oy + round(kontur.linie * f)
            schrift.line([ox - 6, y, ox + gross.width + 6, y], fill=BLAU, width=2)
    schrift.text((4, FELD), kontur.name, fill=(0, 0, 0, 255))
    zeile = f"{angabe.get('art')}" + (" · Boden" if kontur.ebene else f" · Linie {kontur.linie}")
    schrift.text((4, FELD + 14), zeile, fill=(60, 60, 60, 255))
    if kontur.befunde:
        schrift.text((4, FELD + 28), kontur.befunde[0][:38], fill=(170, 20, 20, 255))
        schrift.rectangle([0, 0, FELD - 1, FELD + TEXT - 1], outline=(200, 40, 40, 255), width=2)
    return bild


def _bild(angabe: dict, privat: Path):
    """Das Katalogbild als RGBA (mit ``ausschnitt``) oder None."""
    from PIL import Image

    pfad = privat / angabe["quelle"]
    if not pfad.is_file():
        return None
    bild = Image.open(pfad).convert("RGBA")
    return bild.crop(tuple(angabe["ausschnitt"])) if "ausschnitt" in angabe else bild


def kontaktboegen(
    ziel: Path,
    privat: Path,
    moebel: dict[str, dict],
    konturen: dict[str, Kontur],
    alpha_von: Callable[[dict, Path], bytes | None],
) -> list[Path]:
    """Schreibt je Art Bögen ``kontur-<art>-<n>.png`` (Einträge mit Befund zuerst); Pfade zurück."""
    from PIL import Image

    ziel.mkdir(parents=True, exist_ok=True)
    je_art: dict[str, list[str]] = {}
    for name in konturen:
        je_art.setdefault(str(moebel[name].get("art")), []).append(name)
    pfade = []
    for art, namen in sorted(je_art.items()):
        namen.sort(key=lambda n: (not konturen[n].befunde, n))
        for nummer in range(0, len(namen), JE_BOGEN):
            teil = namen[nummer : nummer + JE_BOGEN]
            spalten = min(SPALTEN, len(teil))
            reihen = -(-len(teil) // spalten)
            bogen = Image.new("RGBA", (spalten * FELD, reihen * (FELD + TEXT)), (255, 255, 255, 255))
            for i, name in enumerate(teil):
                angabe = moebel[name]
                stueck = feld(konturen[name], angabe, alpha_von(angabe, privat), _bild(angabe, privat))
                bogen.paste(stueck, ((i % spalten) * FELD, (i // spalten) * (FELD + TEXT)))
            pfad = ziel / f"kontur-{art}-{nummer // JE_BOGEN + 1}.png"
            bogen.convert("RGB").save(pfad)
            pfade.append(pfad)
    return pfade

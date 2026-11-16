"""Kontaktbögen der feinen Kollisionsmasken je Art (Übersicht für den Autor, ``feinmasken.py``).

Warum: Der Autor prüft auf einen Blick, ob jedes Möbel nur seine Standfläche sperrt (KARTENREGELN
10.88): Je Möbel das Bild in dreifacher Größe, darüber die gesperrten Zellen halbdurchsichtig rot,
darunter Name, Art und die gesperrte Fläche vorher und nachher in Prozent. Möbel, die grob bleiben,
stehen mit grauem Rahmen dabei, damit auch sie auffallen.
Ablage nur lokal (Bilder aus dem privaten Paket), etwa im Notizordner der Sitzung.
"""

from pathlib import Path

from pipeline.abenteuer.feinmasken import (
    FELD_GROB,
    FELD_HAND,
    alpha_von,
    alte_zellen,
    anteil,
    genutzte_moebel,
    gruppe,
)
from pipeline.abenteuer.kollisionfein import ZP

FAKTOR = 3
ZELLE = 240  # Breite eines Felds auf dem Bogen in Pixeln
TEXT = 36  # Höhe der Beschriftung
JE_BOGEN = 48
ROT = (230, 30, 30, 110)
GRUND = (238, 238, 232, 255)


def _zellen(maske: list[str]) -> set[tuple[int, int]]:
    return {(x, y) for y, zeile in enumerate(maske) for x, c in enumerate(zeile) if c == "#"}


def feld(name: str, angabe: dict, privat: Path, fein: list[str] | None):
    """Ein Feld des Bogens: Bild ×3, gesperrte Zellen rot, Beschriftung darunter."""
    from PIL import Image, ImageDraw

    alt = alte_zellen(angabe)
    neu = _zellen(fein) if fein else alt
    bild = Image.new("RGBA", (ZELLE, ZELLE + TEXT), GRUND)
    pfad = privat / angabe["quelle"]
    if pfad.is_file():
        quelle = Image.open(pfad).convert("RGBA")
        if "ausschnitt" in angabe:
            quelle = quelle.crop(tuple(angabe["ausschnitt"]))
        massstab = min(FAKTOR, (ZELLE - 8) / max(quelle.width, quelle.height))
        gross = quelle.resize(
            (max(1, round(quelle.width * massstab)), max(1, round(quelle.height * massstab)))
        )
        ox, oy = (ZELLE - gross.width) // 2, (ZELLE - gross.height) // 2
        bild.alpha_composite(gross, (ox, oy))
        deck = Image.new("RGBA", bild.size, (0, 0, 0, 0))
        zeichner = ImageDraw.Draw(deck)
        s = ZP * massstab
        for x, y in neu:
            zeichner.rectangle([ox + x * s, oy + y * s, ox + (x + 1) * s - 1, oy + (y + 1) * s - 1], fill=ROT)
        zeichner.rectangle([ox - 1, oy - 1, ox + gross.width, oy + gross.height], outline=(90, 90, 90, 255))
        bild.alpha_composite(deck)
    schrift = ImageDraw.Draw(bild)
    vermerk = " (von Hand)" if FELD_HAND in angabe else " (grob)" if fein is None else ""
    schrift.text((4, ZELLE), f"{name}{vermerk}", fill=(0, 0, 0, 255))
    schrift.text(
        (4, ZELLE + 16),
        f"{angabe.get('art')}: {anteil(alt, angabe):.0f} % -> {anteil(neu, angabe):.0f} %",
        fill=(60, 60, 60, 255),
    )
    if fein is None:
        schrift.rectangle([0, 0, ZELLE - 1, ZELLE + TEXT - 1], outline=(150, 150, 150, 255), width=2)
    return bild


def kontaktboegen(ziel: Path, privat: Path, moebel: dict, masken: dict[str, list[str]]) -> list[Path]:
    """Schreibt je Art einen oder mehrere Bögen ``feinmasken-<art>-<n>.png``; gibt die Pfade zurück.

    ``masken``: Name → feine Maske (Vorschläge); von Hand gesetzte Masken stehen im Katalog.
    """
    from PIL import Image

    ziel.mkdir(parents=True, exist_ok=True)
    je_art: dict[str, list[str]] = {}
    for name in sorted(genutzte_moebel() & set(moebel)):
        angabe = moebel[name]
        hand = FELD_HAND in angabe or FELD_GROB in angabe
        if (gruppe(angabe, name) is None and not hand) or alpha_von(angabe, privat) is None:
            continue
        je_art.setdefault(str(angabe.get("art")), []).append(name)
    pfade = []
    for art, namen in sorted(je_art.items()):
        for nummer in range(0, len(namen), JE_BOGEN):
            teil = namen[nummer : nummer + JE_BOGEN]
            spalten = min(8, len(teil))
            reihen = -(-len(teil) // spalten)
            bogen = Image.new("RGBA", (spalten * ZELLE, reihen * (ZELLE + TEXT)), (255, 255, 255, 255))
            for i, name in enumerate(teil):
                angabe = moebel[name]
                fein = angabe.get("maske_fein") if FELD_HAND in angabe else masken.get(name)
                bogen.paste(
                    feld(name, angabe, privat, fein), ((i % spalten) * ZELLE, (i // spalten) * (ZELLE + TEXT))
                )
            pfad = ziel / f"feinmasken-{art}-{nummer // JE_BOGEN + 1}.png"
            bogen.convert("RGB").save(pfad)
            pfade.append(pfad)
    return pfade

"""Bilder zur Ausrichtungsprüfung (KARTENREGELN 10.78): je Befund ein Ausschnitt, dazu Übersichten.

Warum: Daten sehen nicht alles (Wunsch des Autors, 15.11.2026, wie bei den Übergangsbildern 10.77).
Ob ein Kugelfang zur Bahn passt oder ein Hocker hinter der Theke steht, entscheidet am Ende das
Auge. Je Befund (gleiche Befunde eines Möbels auf einer Karte zusammengefasst) zeigt ein Ausschnitt
von FENSTER_BREITE × FENSTER_HOEHE Kacheln um das Möbel die Vorschau mit Möbeln, rote Rahmen um die
betroffenen Bilder und die Beschriftung (Karte, Möbel, Befund, Vorschlag). Dazu zeichnet
``uebersichten`` jede Karte verkleinert für die Durchsicht von Hand (Innenräume, dichte Außenkarten).

Aufruf: ``python -m pipeline.abenteuer.ausrichtung --bilder ORDNER [--privat PFAD] [--ort KENNUNG]``
und ``python -m pipeline.abenteuer.ausrichtungsbilder ORDNER PRIVAT [innen|aussen|alle]``.
"""

import sys
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw

from pipeline.abenteuer.kartenbau import K
from pipeline.abenteuer.uebergangsbogen import GRUND, ROT, WEISS, kartenbild

FENSTER_BREITE, FENSTER_HOEHE = 14, 9
# Die Vorschau ist doppelt groß.
VORSCHAU = 2
BEFUNDE_JE_BOGEN = 6
ZEILE = 14
RAND = 8
ZEICHEN_JE_ZEILE = 110
UEBERSICHT_BREITE = 1400


def _rahmen(szene: dict, moebel: str, felder: list[tuple[int, int]]) -> list[tuple[int, int, int, int]]:
    """Pixelrahmen (in der Vorschau) der gesetzten Bilder dieses Möbels an den genannten Feldern."""
    from pipeline.abenteuer.kartenbau import platziere
    from pipeline.abenteuer.moebelliste import lade_moebel

    rahmen = []
    for s in platziere(szene, lade_moebel())[0]:
        if s["name"] == moebel and (s["x"] // K, s["y"] // K) in felder:
            x, y = s["x"] * VORSCHAU, s["y"] * VORSCHAU
            rahmen.append((x, y, x + s["breite"] * VORSCHAU - 1, y + s["hoehe"] * VORSCHAU - 1))
    return rahmen


def befundbild(szene: dict, gruppe: list, privat: Path, zwischen: dict) -> Image.Image:
    """Ausschnitt um das erste Feld einer Befundgruppe, Bilder rot umrandet, Beschriftung darunter."""
    bild = kartenbild(szene, privat, zwischen)
    breite, hoehe = FENSTER_BREITE * K * VORSCHAU, FENSTER_HOEHE * K * VORSCHAU
    erster = gruppe[0]
    x0 = max(0, (erster.feld[0] - FENSTER_BREITE // 2) * K * VORSCHAU)
    y0 = max(0, (erster.feld[1] - FENSTER_HOEHE // 2) * K * VORSCHAU)
    teil = Image.new("RGBA", (breite, hoehe), GRUND)
    if bild is not None:
        teil.alpha_composite(bild.crop((x0, y0, x0 + breite, y0 + hoehe)).convert("RGBA"))
    zeichner = ImageDraw.Draw(teil)
    for a, b, c, d in _rahmen(szene, erster.moebel, [g.feld for g in gruppe]):
        zeichner.rectangle((a - x0, b - y0, c - x0, d - y0), outline=ROT, width=2)
    felder = ", ".join(str(g.feld) for g in gruppe[:6]) + (" …" if len(gruppe) > 6 else "")
    zeilen = [f"{erster.karte} · {erster.moebel} · {len(gruppe)}× {felder}"]
    zeilen += textwrap.wrap(erster.text, ZEICHEN_JE_ZEILE) + textwrap.wrap(
        "Vorschlag: " + erster.vorschlag if erster.vorschlag else "", ZEICHEN_JE_ZEILE
    )
    gesamt = Image.new("RGBA", (breite + 2 * RAND, hoehe + RAND * 2 + ZEILE * len(zeilen)), GRUND)
    gesamt.alpha_composite(teil, (RAND, RAND))
    schrift = ImageDraw.Draw(gesamt)
    for i, z in enumerate(zeilen):
        schrift.text((RAND, RAND + hoehe + 4 + i * ZEILE), z, fill=WEISS)
    return gesamt


def gruppiere(befunde: list) -> list[list]:
    """Befunde mit gleicher Karte, gleichem Möbel und gleichem Text zu einer Gruppe."""
    gruppen: dict[tuple[str, str, str], list] = {}
    for b in befunde:
        gruppen.setdefault((b.karte, b.moebel, b.text.split(" (")[0]), []).append(b)
    return list(gruppen.values())


def befundbilder(befunde: list, alle: dict[str, dict], ziel: Path, privat: Path) -> list[Path]:
    """Bögen mit je BEFUNDE_JE_BOGEN Befundgruppen: ``ziel/ausrichtung-01.png`` …; leer ohne Paket."""
    if not (privat / "spiel").exists() or not befunde:
        return []
    ziel.mkdir(parents=True, exist_ok=True)
    gruppen = gruppiere(befunde)
    zwischen: dict = {}
    pfade = []
    for start in range(0, len(gruppen), BEFUNDE_JE_BOGEN):
        bilder = [
            befundbild(alle[g[0].karte], g, privat, zwischen)
            for g in gruppen[start : start + BEFUNDE_JE_BOGEN]
        ]
        bogen = Image.new("RGBA", (max(b.width for b in bilder), sum(b.height for b in bilder)), GRUND)
        y = 0
        for b in bilder:
            bogen.alpha_composite(b, (0, y))
            y += b.height
        pfad = ziel / f"ausrichtung-{start // BEFUNDE_JE_BOGEN + 1:02d}.png"
        bogen.convert("RGB").save(pfad)
        pfade.append(pfad)
    return pfade


def uebersichten(alle: dict[str, dict], ziel: Path, privat: Path, auswahl: str = "innen") -> list[Path]:
    """Jede Karte (``innen``, ``aussen`` oder ``alle``) als verkleinerte Vorschau mit Namen."""
    ziel.mkdir(parents=True, exist_ok=True)
    zwischen: dict = {}
    pfade = []
    for karte, szene in sorted(alle.items()):
        if auswahl != "alle" and szene.get("art", "aussen") != auswahl:
            continue
        bild = kartenbild(szene, privat, zwischen)
        if bild is None:
            continue
        faktor = min(1.0, UEBERSICHT_BREITE / bild.width)
        klein = bild.resize((int(bild.width * faktor), int(bild.height * faktor)), Image.LANCZOS)
        blatt = Image.new("RGBA", (klein.width, klein.height + ZEILE + RAND), GRUND)
        blatt.alpha_composite(klein.convert("RGBA"), (0, ZEILE + RAND))
        ImageDraw.Draw(blatt).text((RAND, 2), f"{karte} ({szene.get('datei', '')})", fill=WEISS)
        pfad = ziel / f"karte-{karte}.png"
        blatt.convert("RGB").save(pfad)
        pfade.append(pfad)
        zwischen.clear()
    return pfade


def main(argumente: list[str]) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    from pipeline.abenteuer.uebergaenge import szenen

    ziel, privat = Path(argumente[0]), Path(argumente[1])
    auswahl = argumente[2] if len(argumente) > 2 else "innen"
    for pfad in uebersichten(szenen(), ziel, privat, auswahl):
        print(pfad)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

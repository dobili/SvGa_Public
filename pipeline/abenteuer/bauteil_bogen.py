"""Kontaktbögen der Bauteile: je Eintrag das Bild mit beschrifteten Bauteilrahmen und die abgeleitete
Kollision daneben (Regel 10.95, bauteilregeln.py).

Warum: Ob Gemini (oder die Hand) Treppe, Mauer und Veranda richtig erkannt hat, sieht man nur am Bild
(Anlass: Treppen und Mauer der Schule vertauscht, 28.11.2026). Links das Bild mit farbigen Rahmen je
Typ und Namen, rechts die Ableitung: rot Sperre, grün begehbar oder Held davor, gelb verdeckt (Held
dahinter), blaue Linie die Sortierlinie, weiß gestrichelt die Zugänge der Türen. Ablage nur lokal
(Bilder aus dem privaten Paket), Vorgabe ``buch/arbeit/bauteile/``, dazu ``index.html``.

Aufruf: ``python -m pipeline.abenteuer.bauteil_bogen [NAME …] [--ziel ORDNER] [--privat PAKET]``
(ohne Namen alle Einträge mit Bauteilen).
"""

from __future__ import annotations

import argparse
import html
from pathlib import Path

from pipeline.abenteuer.bauteilpruefung import verdacht
from pipeline.abenteuer.bauteilregeln import ableiten, lade_bauteile, pixelklassen
from pipeline.abenteuer.moebelliste import lade_moebel

FARBEN_TYP = {
    "dach": (200, 40, 40), "schornstein": (120, 40, 40), "wand": (40, 90, 220), "sockel": (20, 40, 140),
    "fenster": (90, 200, 240), "tuer": (240, 140, 20), "treppe": (30, 200, 60), "absatz": (140, 230, 80),
    "veranda": (20, 150, 110), "gelaender": (230, 60, 200), "saeule": (150, 60, 220),
    "markise": (250, 220, 30),
    "schild": (250, 250, 250), "zaun": (110, 70, 20), "mauer": (0, 0, 0), "pflanze": (60, 120, 20),
    "steg": (180, 140, 60), "bruecke": (200, 160, 90), "sonstiges": (128, 128, 128),
}  # fmt: skip
KLASSEN = {"s": (230, 30, 30, 150), "h": (240, 200, 20, 110), "v": (30, 180, 60, 120)}
BLAU, WEISS = (30, 80, 240, 255), (255, 255, 255, 255)
GRUND = (60, 60, 60, 255)
ZIELKANTE = 420  # längste Kante eines Bildes auf dem Bogen
TEXT = 40
ZEILE = 14  # Höhe einer weiteren Textzeile (Verdacht)


def _bild(angabe: dict, privat: Path):
    """Das Katalogbild (mit Ausschnitt) als RGBA."""
    from PIL import Image

    bild = Image.open(privat / angabe["quelle"]).convert("RGBA")
    return bild.crop(tuple(angabe["ausschnitt"])) if "ausschnitt" in angabe else bild


def bogen(name: str, angabe: dict, eintrag: dict, privat: Path):
    """Ein Bogen: links Bauteile, rechts Ableitung, unten Name, Herkunft und Kennzahlen."""
    from PIL import Image, ImageDraw

    quelle = _bild(angabe, privat)
    b, h = quelle.size
    f = max(1, ZIELKANTE // max(b, h))
    erg = ableiten(eintrag["bauteile"])
    links = Image.new("RGBA", (b, h), GRUND)
    links.alpha_composite(quelle)
    rechts = links.copy()
    deck = Image.new("RGBA", (b, h))
    klassen = pixelklassen(erg, quelle.getchannel("A").tobytes(), b, h)
    deck.putdata([KLASSEN.get(k, (0, 0, 0, 0)) for zeile in klassen for k in zeile])
    rechts.alpha_composite(deck)
    links, rechts = (x.resize((b * f, h * f), Image.NEAREST) for x in (links, rechts))
    zl, zr = ImageDraw.Draw(links), ImageDraw.Draw(rechts)
    for teil in eintrag["bauteile"]:
        x0, y0, x1, y1 = (v * f for v in teil["rahmen"])
        farbe = FARBEN_TYP.get(teil["typ"], (255, 0, 255))
        zl.rectangle([x0, y0, x1 - 1, y1 - 1], outline=farbe + (255,), width=2)
        zl.text(
            (x0 + 3, y0 + 2),
            teil["typ"] + (f" {teil['richtung']}" if teil.get("richtung") else ""),
            fill=farbe + (255,),
        )
    if erg.sortierlinie is not None:
        zr.line([0, erg.sortierlinie * f, b * f, erg.sortierlinie * f], fill=BLAU, width=2)
    for z in erg.zugaenge + erg.boden_bereiche:
        zr.rectangle([v * f for v in z], outline=WEISS, width=1)
    zusatz = ZEILE * len(verdacht(eintrag["bauteile"]))
    gesamt = Image.new("RGBA", (2 * b * f + 12, h * f + TEXT + zusatz), GRUND)
    gesamt.alpha_composite(links, (0, 0))
    gesamt.alpha_composite(rechts, (b * f + 12, 0))
    text = (
        f"{name} ({angabe.get('art')}, {b}x{h}) - {eintrag.get('geprueft', '')}\n"
        f"Linie {erg.sortierlinie}, Ebene {erg.ebene}, Zugaenge {len(erg.zugaenge)}, "
        f"Bodenbereiche {len(erg.boden_bereiche)}"
        + "".join(f"\nVerdacht: {v}" for v in verdacht(eintrag["bauteile"]))
    )
    ImageDraw.Draw(gesamt).multiline_text((4, h * f + 4), text, fill=WEISS)
    return gesamt


def boegen(namen: list[str], ziel: Path, privat: Path) -> list[Path]:
    """Alle Bögen nach ZIEL/<name>.png und eine Übersicht ZIEL/index.html."""
    bauteile, moebel = lade_bauteile(), lade_moebel()
    ziel.mkdir(parents=True, exist_ok=True)
    pfade = []
    for name in namen:
        if name not in bauteile or name not in moebel or not (privat / moebel[name]["quelle"]).is_file():
            continue
        pfad = ziel / f"{name}.png"
        bogen(name, moebel[name], bauteile[name], privat).save(pfad)
        pfade.append(pfad)
    zeilen = [
        f'<figure><img src="{p.name}" loading="lazy"><figcaption>{html.escape(p.stem)}</figcaption></figure>'
        for p in pfade
    ]
    (ziel / "index.html").write_text(
        "<!doctype html><meta charset=utf-8><title>Bauteile</title><style>body{background:#222;color:#eee;"
        "font:14px sans-serif}img{max-width:100%;image-rendering:pixelated}</style>"
        "<p>Links Bauteile, rechts Kollision: rot Sperre, grün begehbar/davor, gelb verdeckt, "
        "blau Sortierlinie.</p>" + "\n".join(zeilen),
        encoding="utf-8",
    )
    return pfade


def main(argv: list[str] | None = None) -> int:
    """Befehlszeile; Aufruf im Dateikopf."""
    teil = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teil.add_argument("namen", nargs="*")
    teil.add_argument("--ziel", type=Path, default=Path("buch/arbeit/bauteile"))
    teil.add_argument("--privat", type=Path, default=None)
    args = teil.parse_args(argv)
    from pipeline.abenteuer.anordnung_bild import privat as privat_paket

    privat = args.privat or privat_paket()
    if privat is None:
        print("Kein privates Paket: keine Bögen.")
        return 1
    namen = args.namen or sorted(lade_bauteile())
    print(f"{len(boegen(namen, args.ziel, privat))} Bögen nach {args.ziel}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

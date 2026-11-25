"""Befehl: Übersichtsseite aller PixelLab-Figuren für den Autor (Standbilder, Laufen, Zustände).

Warum: Nach dem Import (pixellabimport.py) soll der Autor alle Menschen auf einen Blick prüfen
(Auftrag des Haupt-Chats, 23.11.2026): je Figur die vier Standbilder, das Gehen und Rennen als
laufender Filmstreifen (CSS, Bild für Bild aus dem Bogen) und die Zustände Sitzen und Liegen, dazu
Altersgruppe, gemessene Höhe und Höhenfaktor (pixellabhoehen.py). Die Seite liest die Bögen, die der
Paketbau aus figuren-neu baut (app/skripte/figurenbogen.mjs, Rahmen 32 × 32, 24 Rahmen je Reihe).
Hohe Rahmen (32 × 48, Schiffskoch, 25.11.2026) stehen in BOEGEN/rahmenhoehen.json
(figurenboegen-ordner.mjs); die Seite schneidet diese Bögen in ihrer Höhe.

Ablauf (im Hauptordner):
    python -m pipeline.abenteuer.pixellabuebersicht BOEGEN ZIEL [--privat PRIVAT]
BOEGEN ist ein Ordner mit <name>.png (app/skripte/figurenboegen-ordner.mjs; das Paket hat WebP),
ZIEL etwa buch/arbeit/pixellab (nur lokal: Die Bilder gehören ins private Paket).
"""

import argparse
import html
import json
import shutil
import struct
from pathlib import Path

RAHMEN = 32
SPALTEN = 24
ZOOM = 3
LAUFBILDER = 6
RICHTUNGEN = ("unten", "links", "oben", "rechts")
# Spalte des Standbilds je Richtung (Ordnung von LimeZu: rechts, oben, links, unten).
SPALTE = {"rechts": 0, "oben": 1, "links": 2, "unten": 3}
REIHEN = {2: "Stuhl", 3: "Boden", 4: "Liegen"}
GEHEN_AB = 24
RENNEN_AB = 120
RENNEN_REIHE = 5
PNG_KOPF = 16
# Index der hohen Rahmen im Bogenordner (app/skripte/figurenboegen-ordner.mjs).
RAHMENINDEX = "rahmenhoehen.json"
FIGURHOEHEN = (
    Path(__file__).resolve().parents[2] / "app" / "src" / "abenteuer" / "oberwelt" / "figurhoehen.json"
)


def bildgroesse(pfad: Path) -> tuple[int, int]:
    """Breite und Höhe eines PNG aus dem Kopf (ohne Pillow)."""
    with pfad.open("rb") as datei:
        kopf = datei.read(PNG_KOPF + 8)
    return struct.unpack(">II", kopf[PNG_KOPF : PNG_KOPF + 8])


def _rahmen(bogen: str, nummer: int, extra: str = "", hoehe: int = RAHMEN) -> str:
    """Ein Rahmen als div mit Hintergrundausschnitt (Rahmenhöhe 32, bei hohen Bögen mehr)."""
    x, y = (nummer % SPALTEN) * RAHMEN * ZOOM, (nummer // SPALTEN) * hoehe * ZOOM
    stil = f"background-image:url('{bogen}');background-position:-{x}px -{y}px;height:{hoehe * ZOOM}px"
    return f"<div class='r{extra}' style=\"{stil}\"></div>"


def _film(bogen: str, beginn: int, titel: str, hoehe: int = RAHMEN) -> str:
    """Gehen oder Rennen nach unten als laufender Filmstreifen (sechs Bilder, CSS steps)."""
    erstes = beginn + SPALTE["unten"] * LAUFBILDER
    x, y = (erstes % SPALTEN) * RAHMEN * ZOOM, (erstes // SPALTEN) * hoehe * ZOOM
    stil = (
        f"background-image:url('{bogen}');--x:-{x}px;background-position:-{x}px -{y}px;"
        f"height:{hoehe * ZOOM}px"
    )
    return f"<figure><div class='r film' style=\"{stil}\"></div><figcaption>{titel}</figcaption></figure>"


def karte(name: str, bogen: str, hoehe_px: int, faktor: float | None, rahmen: int = RAHMEN) -> str:
    """Abschnitt einer Figur: Standbilder, Gehen, Rennen, Zustände (`rahmen`: Rahmenhöhe)."""
    reihen = hoehe_px // rahmen
    teile = [
        f"<figure>{_rahmen(bogen, SPALTE[r], hoehe=rahmen)}<figcaption>{r}</figcaption></figure>"
        for r in RICHTUNGEN
    ]
    teile.append(_film(bogen, GEHEN_AB, "gehen", rahmen))
    if reihen > RENNEN_REIHE:
        teile.append(_film(bogen, RENNEN_AB, "rennen", rahmen))
    for reihe, titel in REIHEN.items():
        if reihe < reihen:
            spalte = SPALTE["unten"] if titel != "Liegen" else 0
            bild = _rahmen(bogen, reihe * SPALTEN + spalte, hoehe=rahmen)
            teile.append(f"<figure>{bild}<figcaption>{titel}</figcaption></figure>")
    angabe = f"Faktor {faktor}" if faktor else "Faktor 1"
    kopf = f"<h2>{html.escape(name)} <small>{angabe}</small></h2>"
    return f"<section>{kopf}<div class=z>{''.join(teile)}</div></section>"


def seite(abschnitte: list[str]) -> str:
    """Die ganze Seite mit Stil und Animation."""
    gross = RAHMEN * ZOOM
    stil = (
        "body{font:16px system-ui;margin:16px;background:#e9e4d8;color:#222}"
        "section{background:#fff;border-radius:8px;padding:6px 10px;margin:10px 0}"
        "h2{font-size:17px;margin:4px 0}.z{display:flex;flex-wrap:wrap;gap:6px}"
        "figure{margin:0;text-align:center}"
        f".r{{width:{gross}px;height:{gross}px;image-rendering:pixelated;background-repeat:no-repeat;"
        f"background-size:{SPALTEN * gross}px auto;background-color:#cfe3c4}}"
        f".film{{animation:lauf .6s steps({LAUFBILDER}) infinite}}"
        f"@keyframes lauf{{to{{background-position-x:calc(var(--x) - {LAUFBILDER * gross}px)}}}}"
        "figcaption{font-size:12px}"
    )
    return (
        '<!doctype html><html lang="de"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1"><title>PixelLab-Figuren</title>'
        f"<style>{stil}</style></head><body><h1>PixelLab-Figuren</h1>{''.join(abschnitte)}</body></html>\n"
    )


def main() -> None:
    """Kopiert die Bögen nach ZIEL/boegen und schreibt ZIEL/index.html."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("boegen", type=Path)
    parser.add_argument("ziel", type=Path)
    args = parser.parse_args()
    faktoren = json.loads(FIGURHOEHEN.read_text(encoding="utf-8"))["faktoren"]
    index = args.boegen / RAHMENINDEX
    rahmenhoehen = json.loads(index.read_text(encoding="utf-8")) if index.exists() else {}
    (args.ziel / "boegen").mkdir(parents=True, exist_ok=True)
    abschnitte = []
    for pfad in sorted(args.boegen.glob("*.png")):
        if pfad.stem.startswith("statist-"):
            continue
        shutil.copy(pfad, args.ziel / "boegen" / pfad.name)
        _, hoehe = bildgroesse(pfad)
        rahmen = rahmenhoehen.get(pfad.stem, RAHMEN)
        abschnitte.append(karte(pfad.stem, f"boegen/{pfad.name}", hoehe, faktoren.get(pfad.stem), rahmen))
    (args.ziel / "index.html").write_text(seite(abschnitte), encoding="utf-8")
    print(f"{len(abschnitte)} Figuren → {args.ziel / 'index.html'}")


if __name__ == "__main__":
    main()

"""Standbilder der Figuren und Statisten für den Karteneditor (Editor 1.7, Blickrichtung R008).

Warum: Seit dem 16.11.2026 tragen stehende Figuren ``blick`` (oben, unten, links, rechts) und
Statisten ``eigenschaften.blick`` (Rückmeldung R008, App: ``oberwelt/sitzrichtung.ts``). Der Autor
stellt die Richtung im Editor ein und will dabei sehen, wohin die Person schaut. Dazu bekommt das
Paket je Bogen die vier Standbilder in der Ordnung der App (rechts, oben, links, unten), so wie
die Kartenvorschau sie zeichnet (``belebungsvorschau.figurbild``, PixelLab mit Maßstab 2/3), und
je Szene, welche Person welchen Bogen hat.

Schlüssel der Zuordnung: ``f:<name>`` für eine Figur (Bogen aus ``orte.json``, ``sprite``),
``b:<name>|<bild>`` für einen Statisten (``statistenboegen``, Bild nach der Rolle;
``bild`` leer ohne eigenes Bild).
Eine Kopie im Editor (Strg+D) behält Name und Bild und damit den Bogen.

Aufruf: aus ``editorpaket.baue_daten``. Braucht Pillow; ohne Pillow oder ohne Bogen fehlt das Bild,
der Editor zeichnet dann den Kreis mit einem Pfeil in Blickrichtung.
"""

import base64
import io
from pathlib import Path

from pipeline.abenteuer.belebungsvorschau import (
    FUSSZEILE,
    PIXELLAB,
    PIXELLAB_MASSSTAB,
    SITZ_RAHMEN,
    figurbild,
    rgba,
    statistenboegen,
)


def personenschluessel(liste: str, eintrag: dict) -> str:
    """Schlüssel einer Person im Paket. Beispiel: Figur hector → „f:hector“; Statist gast mit
    ``bild`` „statist-07“ → „b:gast|statist-07“, ohne Bild → „b:gast|“."""
    if liste == "figuren":
        return f"f:{eintrag['name']}"
    return f"b:{eintrag['name']}|{eintrag.get('eigenschaften', {}).get('bild', '')}"


def boegen_der_szene(szene: dict, orte: list[dict]) -> dict[str, str]:
    """Bogen je Person einer Szene (Schlüssel wie ``personenschluessel``); Tiere zählen nicht.

    Beispiel: Diner → {"f:hector": "figuren/hector.png", "b:lkwFahrer|": "figuren/statist-12.png"}.
    Figuren ohne Eintrag in orte.json (oder ohne ``sprite``) fehlen.
    """
    ort = szene["karte"].split(".")[0]
    sprites = {
        f["kennung"].removeprefix(f"{ort}."): f["sprite"]
        for o in orte
        if o["kennung"] == ort
        for f in o.get("figuren", [])
        if f.get("sprite")
    }
    boegen = {}
    for f in szene.get("figuren", []):
        if f["name"] in sprites:
            boegen[personenschluessel("figuren", f)] = sprites[f["name"]]
    # Statisten wie im Spiel: Bild nach der Rolle, für die ganze Szene gewählt (statistenwahl.py).
    statisten = [b for b in szene.get("belebung", []) if b.get("typ") == "statist"]
    for b, bogen in zip(statisten, statistenboegen(szene), strict=True):
        boegen[personenschluessel("belebung", b)] = bogen
    return boegen


def als_url(bild) -> str:
    puffer = io.BytesIO()
    bild.save(puffer, "PNG")
    return "data:image/png;base64," + base64.b64encode(puffer.getvalue()).decode("ascii")


def standbilder(privat: Path, boegen: set[str]) -> dict[str, list[str]]:
    """Je Bogen die vier Standbilder (rechts, oben, links, unten) als data-URL; Bögen ohne Bild fehlen.

    Beispiel: {"figuren/hector.png": ["data:image/png;base64,…", …]}.
    """
    ergebnis = {}
    for bogen in sorted(boegen):
        bilder = [figurbild(privat, bogen, SITZ_RAHMEN.index(r), rgba) for r in SITZ_RAHMEN]
        if all(bilder):
            ergebnis[bogen] = [als_url(b) for b in bilder]
    return ergebnis


# Sitzbilder (Editor 1.8, feiner Figurversatz): Zustand „Sitzen auf dem Stuhl“ aus PixelLab, wie der
# Paketbau ihn in die dritte Reihe des Bogens legt (app/skripte/figurenzustaende.mjs).
SITZSTUHL = "sitzstuhl"
KOPFANTEIL = 0.4  # der Kopf: die oberen zwei Fünftel der Figur (wie KOPFANTEIL in figurenzustaende.mjs)


def kopfbreite(bild) -> int:
    """Größte Breite in den oberen zwei Fünfteln der deckenden Zeilen; 0 bei leerem Bild."""
    alpha = bild.getchannel("A").load()
    zeilen = []
    for y in range(bild.height):
        xs = [x for x in range(bild.width) if alpha[x, y] > 0]
        if xs:
            zeilen.append(xs[-1] - xs[0] + 1)
    kopf = zeilen[: max(1, int(len(zeilen) * KOPFANTEIL))]
    return max(kopf) if kopf else 0


def _sitzordner(privat: Path, bogen: str) -> Path | None:
    """Ordner mit ``rotations/`` des Stuhlzustands einer PixelLab-Figur, sonst None."""
    basis = privat / "spiel" / "figuren-neu" / Path(bogen).stem / "zustaende" / SITZSTUHL
    if not basis.exists():
        return None
    if (basis / "rotations").exists():
        return basis
    unter = [p for p in sorted(basis.iterdir()) if (p / "rotations").exists()]
    return unter[0] if len(unter) == 1 else None


def sitzbilder(privat: Path, boegen: set[str]) -> dict[str, list[str]]:
    """Je Bogen mit Stuhlzustand die vier Sitzbilder (rechts, oben, links, unten) als data-URL.

    Wie der Paketbau: Der Zustand ist größer gezeichnet; er wird um das Verhältnis der Kopfbreiten
    (Stehen gegen Sitzen, Südbild) verkleinert, die Füße auf FUSSZEILE, dann mit 2/3 wie die
    Standbilder (belebungsvorschau.figurbild). Bögen ohne Zustand fehlen; der Editor zeigt dann das
    Standbild 6 Figurenpixel höher, wie die App ohne Sitzreihe.
    """
    from PIL import Image  # nur hier gebraucht; ohne Pillow fehlen die Bilder

    ergebnis = {}
    for bogen in sorted(boegen):
        ordner = _sitzordner(privat, bogen)
        stehend = privat / "spiel" / "figuren-neu" / Path(bogen).stem / "rotations" / "south.png"
        if ordner is None or not stehend.exists():
            continue
        bilder = [ordner / "rotations" / f"{r}.png" for r in PIXELLAB]
        if not all(b.exists() for b in bilder):
            continue
        roh = [rgba(b) for b in bilder]
        sued = roh[PIXELLAB.index("south")]
        faktor = min(1.0, kopfbreite(rgba(stehend)) / max(1, kopfbreite(sued)))
        ergebnis[bogen] = [als_url(auf_fusszeile(b, faktor, Image)) for b in roh]
    return ergebnis


def auf_fusszeile(bild, faktor: float, image):
    """Verkleinert (nächster Nachbar) um ``faktor`` und 2/3, Füße auf FUSSZEILE, mittig im Rahmen."""
    umriss = bild.getbbox()
    rahmen = image.new("RGBA", bild.size)
    if not umriss:
        return rahmen
    teil = bild.crop(umriss)
    massstab = faktor * PIXELLAB_MASSSTAB
    groesse = (max(1, round(teil.width * massstab)), max(1, round(teil.height * massstab)))
    klein = teil.resize(groesse, image.Resampling.NEAREST)
    # Unterkante auf FUSSZEILE, wie die Standbilder aus figurbild (die Füße stehen auf der Kachel).
    rahmen.paste(klein, ((bild.width - klein.width) // 2, FUSSZEILE + 1 - klein.height))
    return rahmen

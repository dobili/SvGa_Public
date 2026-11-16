"""Standbilder der Figuren und Statisten für den Karteneditor (Editor 1.7, Blickrichtung R008).

Warum: Seit dem 16.11.2026 tragen stehende Figuren ``blick`` (oben, unten, links, rechts) und
Statisten ``eigenschaften.blick`` (Rückmeldung R008, App: ``oberwelt/sitzrichtung.ts``). Der Autor
stellt die Richtung im Editor ein und will dabei sehen, wohin die Person schaut. Dazu bekommt das
Paket je Bogen die vier Standbilder in der Ordnung der App (rechts, oben, links, unten), so wie
die Kartenvorschau sie zeichnet (``belebungsvorschau.figurbild``, PixelLab mit Maßstab 2/3), und
je Szene, welche Person welchen Bogen hat.

Schlüssel der Zuordnung: ``f:<name>`` für eine Figur (Bogen aus ``orte.json``, ``sprite``),
``b:<name>|<bild>`` für einen Statisten (``statistenbogen``; ``bild`` leer ohne eigenes Bild).
Eine Kopie im Editor (Strg+D) behält Name und Bild und damit den Bogen.

Aufruf: aus ``editorpaket.baue_daten``. Braucht Pillow; ohne Pillow oder ohne Bogen fehlt das Bild,
der Editor zeichnet dann den Kreis mit einem Pfeil in Blickrichtung.
"""

import base64
import io
from pathlib import Path

from pipeline.abenteuer.belebungsvorschau import SITZ_RAHMEN, figurbild, rgba, statistenbogen


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
    for b in szene.get("belebung", []):
        if b.get("typ") == "statist":
            bild = b.get("eigenschaften", {}).get("bild")
            boegen[personenschluessel("belebung", b)] = statistenbogen(b["name"], bild)
    return boegen


def _als_url(bild) -> str:
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
            ergebnis[bogen] = [_als_url(b) for b in bilder]
    return ergebnis

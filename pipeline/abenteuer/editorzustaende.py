"""Vorschaubilder der Zustände und Standbilder für den Karteneditor (Editor 1.9, 23.11.2026).

Warum: Der Autor wählt im Editor je Figur, Statist oder Tier den Zustand an dieser Stelle
(figurzustand.py) und sieht die Wahl sofort im Bild. Dazu bringt das Paket je Bogen die Bilder mit,
so wie die App sie zeigt:
- Menschen (je Bogen, Schlüssel wie editorpersonen.boegen_der_szene): ``sitzstuhl`` und
  ``sitzboden`` je vier Bilder (rechts, oben, links, unten), ``liegt`` ein Bild (Kopf rechts), dazu
  ``standbilder``: die weiteren Standbilder aus PixelLab (figuren-neu/<name>/standbilder.json,
  skripte/figurstandbilder.mjs) mit Kennung, Name und vier Bildern; der Standard steht mit
  ``standard: true`` und den gewöhnlichen Standbildern darin.
- Tiere (je Art, tierarten.json): ``stehen``, die Zustände der Reihe 2 (``zustaende``) und
  ``schwimmen``, je ein Bild in Seitenansicht wie die Kartenvorschau (belebungsvorschau.teile).
Alle Bilder als data-URL, im Maß der Karte (PixelLab mit 2/3, Tiere mit ihrem Maßstab).
Zustände wie Sitzen sind größer gezeichnet; sie werden um das Verhältnis der Kopfbreiten verkleinert
(wie skripte/figurenzustaende.mjs und editorpersonen.sitzbilder).

Aufruf: aus ``editorpaket.baue_daten``. Braucht Pillow; ohne Pillow oder ohne Bild fehlt der Eintrag,
der Editor bietet dann nur die Zustände ohne Vorschau an.
"""

import json
from pathlib import Path

from pipeline.abenteuer import editorpersonen as ep
from pipeline.abenteuer.belebungsvorschau import MASSSTAB, PIXELLAB, SEITE, TIERBILDER, rgba, tierart

ZUSTANDSORDNER = {"sitzstuhl": "sitzstuhl", "sitzboden": "sitzboden", "liegt": "schlaf"}
LIEGEN_KOPF_RECHTS = "west"  # wie LIEGERICHTUNGEN in app/skripte/figurenzustaende.mjs
TIERE = Path(__file__).resolve().parents[2] / "app/src/abenteuer/oberwelt/tierarten.json"
REIHE_ZUSTAENDE = 2
REIHE_SCHWIMMEN = 3
SPALTEN_JE_ZUSTAND = 4


def _figurordner(privat: Path, bogen: str) -> Path:
    return privat / "spiel" / "figuren-neu" / Path(bogen).stem


def _rotationsordner(basis: Path) -> Path | None:
    """``basis`` selbst oder sein einziger Unterordner mit ``rotations/`` (Zustandsexporte)."""
    if (basis / "rotations").exists():
        return basis
    if not basis.exists():
        return None
    unter = [p for p in sorted(basis.iterdir()) if (p / "rotations").exists()]
    return unter[0] if len(unter) == 1 else None


def _bilder(ordner: Path, richtungen, faktor_von: Path | None, image) -> list[str] | None:
    """Bilder der Richtungen als data-URL, auf FUSSZEILE und mit 2/3; ``faktor_von``: stehendes
    Südbild, an dessen Kopfbreite der Zustand gemessen wird (None: nicht verkleinern)."""
    pfade = [ordner / "rotations" / f"{r}.png" for r in richtungen]
    if not all(p.exists() for p in pfade):
        return None
    roh = [rgba(p) for p in pfade]
    faktor = 1.0
    if faktor_von is not None and faktor_von.exists():
        sued = (
            rgba(ordner / "rotations" / "south.png") if (ordner / "rotations/south.png").exists() else roh[0]
        )
        faktor = min(1.0, ep.kopfbreite(rgba(faktor_von)) / max(1, ep.kopfbreite(sued)))
    return [ep.als_url(ep.auf_fusszeile(b, faktor, image)) for b in roh]


def _standbilder(figur: Path, image) -> list[dict]:
    """Die Standbilder aus standbilder.json mit vier Bildern; der Standard aus ``rotations/``.
    Leer, wenn es nur den Standard gibt."""
    liste_pfad = figur / "standbilder.json"
    if not liste_pfad.exists():
        return []
    eintraege = json.loads(liste_pfad.read_text(encoding="utf-8"))
    if not any(not e.get("standard") for e in eintraege):
        return []  # nur der Standard: nichts zu wählen, kein Platz im Paket
    ergebnis = []
    for e in eintraege:
        ordner = figur if e.get("standard") else figur / "standbilder" / e.get("kennung", "")
        bilder = _bilder(ordner, PIXELLAB, None, image)
        if bilder:
            ergebnis.append(
                {
                    "kennung": e["kennung"],
                    "name": e.get("name", ""),
                    "standard": bool(e.get("standard")),
                    "bilder": bilder,
                }
            )
    return ergebnis


def personenzustaende(privat: Path, boegen: set[str]) -> dict[str, dict]:
    """Je Bogen die Bilder der Zustände und weiteren Standbilder (siehe Dateikopf); leere fehlen."""
    try:
        from PIL import Image
    except ImportError:
        return {}
    ergebnis = {}
    for bogen in sorted(boegen):
        figur = _figurordner(privat, bogen)
        stehend = figur / "rotations" / "south.png"
        eintrag = {}
        for zustand, ordnername in ZUSTANDSORDNER.items():
            ordner = _rotationsordner(figur / "zustaende" / ordnername)
            richtungen = (LIEGEN_KOPF_RECHTS,) if zustand == "liegt" else PIXELLAB
            bilder = _bilder(ordner, richtungen, stehend, Image) if ordner else None
            if bilder:
                eintrag[zustand] = bilder
        if standbilder := _standbilder(figur, Image):
            eintrag["standbilder"] = standbilder
        if eintrag:
            ergebnis[bogen] = eintrag
    return ergebnis


def tierarten_der_szene(szene: dict) -> dict[str, str]:
    """Art je Tier einer Szene (Name → Art, wie die App nach Wortstamm oder ``bild``)."""
    arten = {}
    for b in szene.get("belebung", []):
        if b.get("typ") == "tier":
            art = b.get("eigenschaften", {}).get("bild") or tierart(b["name"])
            if art in TIERBILDER:
                arten[b["name"]] = art
    return arten


def tierzustaende(privat: Path, arten: set[str]) -> dict[str, dict[str, str]]:
    """Je Art die Bilder ``stehen``, der Zustände und ``schwimmen`` (Seitenansicht, Maßstab der Art)."""
    try:
        from PIL import Image
    except ImportError:
        return {}
    angaben = json.loads(TIERE.read_text(encoding="utf-8"))["arten"]
    ergebnis = {}
    for art in sorted(arten):
        pfad = privat / "spiel" / "tiere" / f"{art}.png"
        a = angaben.get(art, {})
        if not pfad.exists() or a.get("schnitt") != "pixellab":
            continue
        bogen = rgba(pfad)
        felder = {"stehen": (0, SEITE)}
        for k, zustand in enumerate(a.get("zustaende", [])):
            felder[zustand] = (REIHE_ZUSTAENDE, k * SPALTEN_JE_ZUSTAND + SEITE)
        if "schwimmen" in a:
            felder["schwimmen"] = (REIHE_SCHWIMMEN, SEITE)
        breite, hoehe = TIERBILDER[art]
        massstab = MASSSTAB.get(art, 1)
        bilder = {}
        for zustand, (reihe, spalte) in felder.items():
            if (reihe + 1) * hoehe > bogen.height:
                continue
            teil = bogen.crop((spalte * breite, reihe * hoehe, (spalte + 1) * breite, (reihe + 1) * hoehe))
            if massstab != 1:
                groesse = (max(1, round(breite * massstab)), max(1, round(hoehe * massstab)))
                teil = teil.resize(groesse, Image.Resampling.NEAREST)
            bilder[zustand] = ep.als_url(teil)
        ergebnis[art] = bilder
    return ergebnis

"""Tierplan, Ausgabe: Liste, Prompts, Animationen, Messung der Bögen und Seite für den Autor.

Warum: Der Autor entscheidet auf dem Handy, welche Tiere er in PixelLab neu macht (Auftrag des
Hauptchats, 21.11.2026). Die Seite zeigt je Art ein Kärtchen mit heutigem Bild, Zielhöhe, einer
Vergleichsskizze neben Erwachsenem (20) und Kind (14), dem fertigen Prompt und den Animationen.
Sie bettet Bilder aus dem privaten Paket ein und gehört deshalb nur nach buch/arbeit/tiere/.
Abhängigkeiten: Pillow, tierplan.py.
"""

import base64
import io
import json
from pathlib import Path

from PIL import Image

from pipeline.abenteuer import tierplan as tp
from pipeline.abenteuer.tierplan_daten import ARTEN, Art

ZOOM = 4  # etwas größer als im Spiel (3), damit kleine Tiere auf dem Handy erkennbar sind
SKIZZE_HOEHE = 26
STIL = (
    "cute chibi RPG animal sprite, slightly oversized head, bold dark outline, saturated colours, "
    "soft shading, low top-down view, single animal, no background"
)
NEGATIV = "human, clothes, text, ground tile, cast shadow, multiple animals"
BEWEGUNG = {
    ("quadruped", "laufen"): ("Walking (Vorlage)", ""),
    ("quadruped", "flitzen"): ("Running (Vorlage)", ""),
    ("quadruped", "schwimmen"): ("Animate with text", "swimming slowly, only head and back above water"),
    ("custom", "laufen"): ("Animate with text", "walking and pecking, small steps"),
    ("custom", "flitzen"): ("Animate with text", "running fast with quick small steps"),
    ("custom", "fliegen"): ("Animate with text", "flying, flapping wings"),
    ("custom", "schwimmen"): ("Animate with text", "swimming slowly, gliding on the water surface"),
    ("custom", "krabbeln"): ("Animate with text", "scuttling sideways"),
    ("custom", "fahren"): ("Animate with text", "driving forward, wheels turning"),
}
ZUSTAENDE = {"sitzen": "sitting still", "schlafen": "sleeping, curled up", "grasen": "grazing, head down"}
RICHTUNGEN = 4  # rechts, oben, links, unten wie im Spielformat


def prompt(art: Art) -> str:
    """Fertiger PixelLab-Prompt einer Art. Beispiel: „cute chibi RPG animal sprite … peregrine falcon“."""
    return f"{art.motiv}, {STIL}"


def animationen(art: Art, verhalten: dict[str, int]) -> list[tuple[str, str, str]]:
    """(Name, Werkzeug, Beschreibung) der nötigen Animationen und Zustände."""
    werkzeug, text = BEWEGUNG[(art.typ, art.bewegung)]
    liste = [(art.bewegung, werkzeug, text)]
    for v, beschreibung in ZUSTAENDE.items():
        if verhalten.get(v):
            liste.append((v, "New State (v3)", beschreibung))
    return liste


def generierungen(anim: list[tuple[str, str, str]]) -> int:
    """Charakter (v3, 8 Richtungen) + Bewegung je Richtung + ein Zustand je Haltung."""
    return 1 + RICHTUNGEN + (len(anim) - 1)


def standbild(privat: Path, art: str) -> Image.Image | None:
    """Erstes Standbild (rechts) aus dem heutigen Bogen, zugeschnitten auf das Sichtbare."""
    pfad = privat / "spiel" / "tiere" / f"{art}.png"
    angabe = json.loads(tp.TIERARTEN.read_text(encoding="utf-8"))["arten"].get(art)
    if not pfad.exists() or not angabe:
        return None
    bild = Image.open(pfad).convert("RGBA").crop((0, 0, angabe["breite"], angabe["hoehe"]))
    box = bild.getchannel("A").getbbox()
    return bild.crop(box) if box else None


def messe(privat: Path) -> dict[str, int]:
    """Größte sichtbare Höhe der vier Standbilder je Bogen (für GEMESSEN)."""
    arten = json.loads(tp.TIERARTEN.read_text(encoding="utf-8"))["arten"]
    hoehen = {}
    for art, a in arten.items():
        bogen = Image.open(privat / "spiel" / "tiere" / f"{art}.png").convert("RGBA")
        boxen = [
            bogen.crop((i * a["breite"], 0, (i + 1) * a["breite"], a["hoehe"])).getchannel("A").getbbox()
            for i in range(4)
        ]
        hoehen[art] = max(b[3] - b[1] for b in boxen if b)
    return hoehen


def _auf_hoehe(bild: Image.Image, hoehe: int) -> Image.Image:
    breite = max(1, round(bild.width * hoehe / bild.height))
    return bild.resize((breite, hoehe), Image.NEAREST)


def skizze(privat: Path, art: Art, bildart: str | None) -> str:
    """Vergleich im Spielmaß: Erwachsener (20), Kind (14), Tier in Zielhöhe; als Daten-URL."""
    coach = privat / "spiel" / "figuren-neu" / "coach-delgado" / "rotations" / "south.png"
    figur = Image.open(coach).convert("RGBA")
    figur = figur.crop(figur.getchannel("A").getbbox())
    tier = standbild(privat, bildart) if bildart else None
    ziel = tp.zielhoehe(art)
    if tier is None:
        tier = Image.new("RGBA", (tp.ziellaenge(art), ziel), (150, 150, 150, 255))
    teile = [_auf_hoehe(figur, tp.ERWACHSENER_PX), _auf_hoehe(figur, tp.KIND_PX), _auf_hoehe(tier, ziel)]
    breite = sum(t.width + 4 for t in teile) + 4
    flaeche = Image.new("RGBA", (breite, SKIZZE_HOEHE), (122, 170, 96, 255))
    x = 4
    for t in teile:
        flaeche.paste(t, (x, SKIZZE_HOEHE - 2 - t.height), t)
        x += t.width + 4
    flaeche = flaeche.resize((flaeche.width * ZOOM, flaeche.height * ZOOM), Image.NEAREST)
    puffer = io.BytesIO()
    flaeche.save(puffer, "PNG")
    return "data:image/png;base64," + base64.b64encode(puffer.getvalue()).decode()


def eintraege() -> list[dict]:
    """Je Art alle Angaben, neue Arten nach Vorrang und Stellen, danach die bleibenden."""
    b, ink = tp.bestand(), tp.inkstellen()
    liste = []
    for name, stellen in b.stellen.items():
        art = ARTEN[name]
        zaehler = {z: 0 for z in ("richtig", "ersatz", "fehlt")}
        for bild, k in b.bild[name].items():
            zaehler[tp.zustand(art, bild)] += k
        anim = animationen(art, b.verhalten[name])
        liste.append(
            {
                "art": art,
                "stellen": stellen,
                "zaehler": zaehler,
                "neu": art.limezu is None,
                "bild": art.limezu or max(b.bild[name], key=lambda k: (k is not None, b.bild[name][k])),
                "ink": ink.get(name, []),
                "vorrang": tp.vorrang(name, stellen),
                "verhalten": dict(b.verhalten[name]),
                "orte": sorted(b.orte[name]),
                "anim": anim,
                "generierungen": generierungen(anim),
            }
        )
    return sorted(liste, key=lambda e: (not e["neu"], e["vorrang"], -e["stellen"], e["art"].name))


def zeilen() -> list[str]:
    """Kurzliste für die Befehlszeile."""
    aus = []
    for e in eintraege():
        a = e["art"]
        dateien = sorted(set(e["ink"]))[:3]
        aus.append(
            f"{'NEU' if e['neu'] else 'bleibt'} V{e['vorrang']} {a.name}: "
            f"{e['stellen']} Stellen {e['zaehler']}, "
            f"{a.typ}, {a.bewegung}, Ziel {tp.zielhoehe(a)} px, Leinwand {tp.leinwand(a)}, "
            f"Ink {len(e['ink'])} {dateien}, Gen. {e['generierungen']}"
        )
    neu = [e for e in eintraege() if e["neu"]]
    aus.append(f"Neu: {len(neu)} Arten, {sum(e['generierungen'] for e in neu)} Generierungen")
    return aus

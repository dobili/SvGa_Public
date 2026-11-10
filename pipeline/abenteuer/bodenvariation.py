"""Bodenvariation: Beläge draußen sehen nicht mehr überall gleich aus (Wunsch des Autors, 10.11.2026).

Warum: Pflaster und Asphalt waren auf jeder Karte dieselbe Kachel und wirkten zu regelmäßig. Der
Autor wünscht zufällige Abweichungen, leichte Verschmutzung, Verfärbung und ausgebesserte Stellen.

Wie: Ein Nachlauf über den fertigen Hintergrund von ``kartenbild``. Je Feld eines Belags mit
``variation`` in ``materialien.json``:
- Kachel: Innenkacheln (nicht Ränder) werden gewichtet gegen gleichwertige Kacheln aus dem
  LimeZu-Bogen getauscht (``kacheln``: [Spalte, Reihe, Gewicht]).
- Überlagerungen (auf eigener Schicht gemalt und dann gemischt, sonst schriebe ImageDraw
  die halbdurchsichtige Farbe hart in die Kachel), selten und dezent: Flecken, Risse, Moos in
  den Fugen, Flicken (ausgebesserte Stelle in anderem Ton), Verfärbung der ganzen Kachel, Gullys
  (mit Mindestabstand).
Der Zufall ist fest je Karte und Feld (sha256 aus Kennung, x, y), also gleiches Bild bei jedem Lauf
und keine Muster wie bei einer Formel über x und y.

Schalter: ``"bodenvariation": true/false`` in der Szene; ohne Angabe gilt
``bodenvariation_standard`` aus ``materialien.json`` (vorerst aus, bis der Autor die Probe an
Campus Silicon Bay und Hafen gesehen hat).
"""

import hashlib
import random
from pathlib import Path

from PIL import Image, ImageDraw

K = 16
VOLL = 255
# Abstand zwischen zwei Gullys in Feldern (sonst stünden sie in Reihen).
GULLY_ABSTAND = 6
FLECK = (40, 34, 30)
RISS = (45, 40, 38, 150)
MOOS = ((86, 120, 60), (70, 104, 52), (104, 134, 70))
GITTER = (52, 50, 54, 255)
GITTERRAND = (120, 118, 122, 255)
# Wie dunkel eine Fuge im Pflaster ist (Summe der Kanäle), damit Moos nur dort wächst.
FUGE = 330


def zufall(karte: str, x: int, y: int) -> random.Random:
    """Fester Zufall je Karte und Feld (unabhängig von PYTHONHASHSEED)."""
    samen = hashlib.sha256(f"{karte}:{x}:{y}".encode()).digest()
    return random.Random(int.from_bytes(samen[:8], "big"))


def aktiv(szene: dict, materialien: dict) -> bool:
    """Ob die Szene Bodenvariation bekommt (Schalter der Szene, sonst der Standard)."""
    return bool(szene.get("bodenvariation", materialien.get("bodenvariation_standard", False)))


def _waehle(kacheln: list[list[int]], r: random.Random) -> list[int]:
    """Eine Kachel nach Gewicht ([Spalte, Reihe, Gewicht])."""
    gesamt = sum(k[2] for k in kacheln)
    wurf = r.uniform(0, gesamt)
    for k in kacheln:
        wurf -= k[2]
        if wurf <= 0:
            return k[:2]
    return kacheln[-1][:2]


def _fleck(teil: Image.Image, r: random.Random) -> None:
    """Ein unregelmäßiger, halbdurchsichtiger dunkler Fleck (Öl, Nässe)."""
    ebene = Image.new("RGBA", (K, K))
    maler = ImageDraw.Draw(ebene)
    mx, my = r.randint(3, K - 4), r.randint(3, K - 4)
    for _ in range(r.randint(3, 6)):
        dx, dy, rad = r.randint(-2, 2), r.randint(-2, 2), r.randint(1, 3)
        maler.ellipse(
            (mx + dx - rad, my + dy - rad, mx + dx + rad, my + dy + rad), fill=(*FLECK, r.randint(28, 48))
        )
    teil.alpha_composite(ebene)


def _riss(teil: Image.Image, r: random.Random) -> None:
    """Ein feiner Riss aus wenigen Knicken."""
    ebene = Image.new("RGBA", (K, K))
    maler = ImageDraw.Draw(ebene)
    x, y = r.randint(2, K - 3), r.randint(2, K - 3)
    for _ in range(r.randint(3, 5)):
        nx, ny = max(0, min(K - 1, x + r.randint(-3, 3))), max(0, min(K - 1, y + r.randint(-3, 3)))
        maler.line((x, y, nx, ny), fill=RISS)
        x, y = nx, ny
    teil.alpha_composite(ebene)


def _moos(teil: Image.Image, r: random.Random) -> None:
    """Moos in den Fugen: einige dunkle Fugenpixel werden grün."""
    px = teil.load()
    for yy in range(K):
        for xx in range(K):
            rr, gg, bb, aa = px[xx, yy]
            if aa and rr + gg + bb < FUGE and r.random() < 0.35:
                px[xx, yy] = (*r.choice(MOOS), aa)


def _flicken(teil: Image.Image, r: random.Random) -> None:
    """Eine ausgebesserte Stelle: rechteckig, etwas heller oder dunkler, mit feinem Rand."""
    ebene = Image.new("RGBA", (K, K))
    maler = ImageDraw.Draw(ebene)
    b, h = r.randint(6, 11), r.randint(5, 10)
    x, y = r.randint(0, K - b), r.randint(0, K - h)
    ton = (VOLL, VOLL, VOLL, 22) if r.random() < 0.5 else (0, 0, 0, 26)
    maler.rectangle((x, y, x + b - 1, y + h - 1), fill=ton, outline=(0, 0, 0, 40))
    teil.alpha_composite(ebene)


def _verfaerbe(teil: Image.Image, r: random.Random) -> None:
    """Die ganze Kachel leicht heller, dunkler oder wärmer."""
    ton = r.choice([(VOLL, VOLL, VOLL, 14), (0, 0, 0, 16), (120, 90, 50, 14)])
    teil.alpha_composite(Image.new("RGBA", (K, K), ton))


def _gully(teil: Image.Image) -> None:
    """Ein Gullydeckel mit Gitter in der Mitte der Kachel."""
    maler = ImageDraw.Draw(teil, "RGBA")
    maler.rectangle((3, 4, 12, 11), fill=GITTERRAND)
    maler.rectangle((4, 5, 11, 10), fill=GITTER)
    for xx in range(5, 11, 2):
        maler.line((xx, 5, xx, 10), fill=GITTERRAND)


UEBERLAGERUNGEN = (("flecken", _fleck), ("risse", _riss), ("flicken", _flicken), ("farbe", _verfaerbe))


def _variiere_feld(teil: Image.Image, v: dict, r: random.Random, gully: bool) -> Image.Image:
    """Überlagerungen eines Feldes; ``gully`` sagt, ob hier ein Gully stehen darf."""
    for name, malen in UEBERLAGERUNGEN:
        if r.random() < v.get(name, 0):
            malen(teil, r)
    if r.random() < v.get("moos", 0):
        _moos(teil, r)
    if gully:
        _gully(teil)
    return teil


def variiere(szene: dict, grund: Image.Image, gezeichnet: dict, materialien: dict, kachel_aus) -> Image.Image:
    """Der Hintergrund mit Bodenvariation (unverändert, wenn sie für die Szene aus ist).

    ``gezeichnet`` ist Feld → (Belag, Kachel) aus ``kartenbild.hintergrund``; ``kachel_aus(art,
    feld)`` liefert eine Kachel aus dem Bogen. Beispiel: Campus Silicon Bay, Pflaster: etwa jede
    sechste Kachel eine andere Pflasterkachel, hier und da ein Fleck, selten ein Gully.
    """
    if not aktiv(szene, materialien):
        return grund
    boeden = materialien["boeden"]
    bild = grund.copy()
    gullys: list[tuple[int, int]] = []
    for (x, y), (name, feld) in sorted(gezeichnet.items(), key=lambda e: (e[0][1], e[0][0])):
        art = boeden.get(name, {})
        v = art.get("variation")
        if not v or list(feld) != list(art["feld"]):
            continue  # nur Innenkacheln; Ränder und Ecken bleiben, wie sie sind
        r = zufall(szene["karte"], x, y)
        teil = (
            kachel_aus(art, _waehle(v["kacheln"], r))
            if v.get("kacheln")
            else bild.crop((x * K, y * K, (x + 1) * K, (y + 1) * K))
        )
        frei = all(abs(x - gx) + abs(y - gy) >= GULLY_ABSTAND for gx, gy in gullys)
        gully = frei and r.random() < v.get("gullys", 0)
        if gully:
            gullys.append((x, y))
        bild.paste(_variiere_feld(teil.copy(), v, r, gully), (x * K, y * K))
    return bild


def lade_kachel(privat: Path, boegen: dict):
    """Eine Kachelquelle für ``variiere`` mit Zwischenspeicher je Bogen."""
    geladen: dict[str, Image.Image] = {}

    def kachel(art: dict, feld: list[int]) -> Image.Image:
        if art["bogen"] not in geladen:
            geladen[art["bogen"]] = Image.open(privat / boegen[art["bogen"]]).convert("RGBA")
        return geladen[art["bogen"]].crop((feld[0] * K, feld[1] * K, (feld[0] + 1) * K, (feld[1] + 1) * K))

    return kachel

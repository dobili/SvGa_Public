"""Bild und Seite zur Hörprobe der räumlichen Geräusche (ausgelagert aus ``raumprobe.py``).

Warum: Der Autor hört auf dem Handy; das Video zeigt dazu, wo der Held gerade steht und wie laut
das Geräusch ist. Die Seite fasst Pegelkurve, Karte mit Ringen und das Messprotokoll zusammen, auch
für den Fall, dass das Video nicht spielt.
Eingaben: Szene und Quellen (geraeuschquellen.py), der Weg und die Kurven aus ``raumprobe.py``.
"""

import base64
import io
import math
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

from pipeline.abenteuer.geraeuschquellen_bild import KOPF, PUNKT, zeichne_karte

BILDER_JE_S = 10
KURVE_HOEHE = 110
UNTEN_DB = -14.0  # unterer Rand der Kurve
GRUND_GRENZE_DB = -10.5  # ab hier gilt eine Sekunde als Grundpegel
SCHRIFT = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")  # mit Umlauten, wenn vorhanden
SCHRIFTGROESSE = 10


def schrift() -> ImageFont.ImageFont | ImageFont.FreeTypeFont:
    """DejaVu, wenn vorhanden (Umlaute), sonst die eingebaute Schrift."""
    return ImageFont.truetype(str(SCHRIFT), SCHRIFTGROESSE) if SCHRIFT.exists() else ImageFont.load_default()


HELD = (220, 20, 60)
LINIE_VORHER = (120, 120, 120)
LINIE_NACHHER = (230, 110, 20)


def kartenbild(szene: dict, quellen: list[dict]) -> Image.Image:
    """Die Karte mit Lautstärke und Ringen (wie die Vorschau des Werkzeugs)."""
    breite = max(len(z) for z in szene["raster"]) * PUNKT
    hoehe = KOPF + len(szene["raster"]) * PUNKT
    bild = Image.new("RGB", (breite + breite % 2, hoehe + hoehe % 2), (255, 255, 255))
    zeichne_karte(bild, ImageDraw.Draw(bild), szene, quellen, 0)
    return bild


def feld_zu(punkte: list, t: float) -> tuple[int, int]:
    """Das Feld des Helden zur Zeit t (wie in raumprobe.py)."""
    aktuell = punkte[0][1]
    for zeit, feld in punkte:
        if zeit <= t:
            aktuell = feld
    return aktuell


def kurve_zeichnen(z: ImageDraw.ImageDraw, k: dict, oben: int, breite: int, farbe, bis: float) -> None:
    """Raumpegel in dB über die Zeit, bis zur Zeit ``bis``."""
    dauer = float(k["zeit"][-1])
    punkte = []
    for t, r in zip(k["zeit"][::10], k["raum"][::10], strict=True):
        if t > bis:
            break
        y = oben + KURVE_HOEHE * (20 * math.log10(float(r)) / UNTEN_DB)
        punkte.append((breite * float(t) / dauer, y))
    if len(punkte) > 1:
        z.line(punkte, fill=farbe, width=2)


def einzelbild(karte: Image.Image, szene: dict, k: dict, punkte: list, t: float, titel: str) -> Image.Image:
    """Ein Bild des Videos: Karte mit Held, darunter die Pegelkurve bis jetzt."""
    bild = Image.new("RGB", (karte.width, karte.height + KURVE_HOEHE + 20), (255, 255, 255))
    bild.paste(karte, (0, 0))
    z = ImageDraw.Draw(bild)
    x, y = feld_zu(punkte, t)
    mx, my = x * PUNKT + PUNKT // 2, KOPF + y * PUNKT + PUNKT // 2
    z.ellipse([mx - 4, my - 4, mx + 4, my + 4], fill=HELD)
    oben = karte.height + 10
    z.rectangle([0, oben, karte.width - 1, oben + KURVE_HOEHE], outline=(200, 200, 200))
    i = min(len(k["raum"]) - 1, int(t * 100))
    pegel = 20 * math.log10(float(k["raum"][i]))
    z.text(
        (4, oben + 2), f"{titel}: Geräusch {pegel:+.1f} dB (0 = wie bisher)", fill=(0, 0, 0), font=schrift()
    )
    farbe = LINIE_NACHHER if titel == "Nachher" else LINIE_VORHER
    kurve_zeichnen(z, k, oben + 14, karte.width, farbe, t)
    return bild


def video(szene, quellen, punkte, vorher, nachher, ton: Path, ziel: Path, pause_s: float) -> None:
    """Video aus Einzelbildern (10 je Sekunde) und dem Ton der Probe."""
    karte = kartenbild(szene, quellen)
    dauer = float(vorher["zeit"][-1])
    with tempfile.TemporaryDirectory() as ordner:
        nummer = 0
        for titel, k in (("Vorher", vorher), ("Pause", None), ("Nachher", nachher)):
            laenge = pause_s if k is None else dauer
            for n in range(int(laenge * BILDER_JE_S)):
                t = n / BILDER_JE_S
                bild = einzelbild(karte, szene, k or nachher, punkte, 0 if k is None else t, titel)
                bild.save(Path(ordner) / f"b{nummer:05d}.png")
                nummer += 1
        befehl = ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(BILDER_JE_S)]
        befehl += ["-i", str(Path(ordner) / "b%05d.png"), "-i", str(ton), "-c:v", "libx264"]
        befehl += [
            "-vf",
            "scale=iw*2:ih*2:flags=neighbor",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "copy",
            "-shortest",
            str(ziel),
        ]
        subprocess.run(befehl, check=True)


def svg_kurve(k: dict) -> str:
    """Die Pegelkurve als SVG: Raumpegel nachher (orange) gegen vorher (grau, 0 dB)."""
    breite, hoehe = 640, 220
    dauer = float(k["zeit"][-1])
    pfad = " ".join(
        f"{breite * float(t) / dauer:.1f},{hoehe * (20 * math.log10(float(r)) / UNTEN_DB):.1f}"
        for t, r in zip(k["zeit"][::10], k["raum"][::10], strict=True)
    )
    raster = "".join(
        f'<line x1="0" x2="{breite}" y1="{hoehe * d / UNTEN_DB:.1f}" y2="{hoehe * d / UNTEN_DB:.1f}" '
        f'class="gitter"/><text x="4" y="{hoehe * d / UNTEN_DB - 3:.1f}">{d} dB</text>'
        for d in (0, -6, -11)
    )
    return (
        f'<svg viewBox="0 -12 {breite} {hoehe + 24}" role="img" aria-label="Pegelkurve">{raster}'
        f'<polyline points="{pfad}" class="nachher"/>'
        f'<text x="{breite - 4}" y="{hoehe + 10}" text-anchor="end">{dauer:.0f} s</text></svg>'
    )


def seite(szene: dict, quellen: list[dict], punkte: list, nachher: dict, zeilen: list[str]) -> str:
    """Die HTML-Seite für den Autor: Video, Kurve, Karte mit Ringen, Messprotokoll."""
    puffer = io.BytesIO()
    kartenbild(szene, quellen).save(puffer, format="PNG")
    bild = base64.b64encode(puffer.getvalue()).decode()
    wege = f"Start {punkte[0][1]}, Wasserfall vor {punkte[-1][1]}"
    # Sekunden auf dem Grundpegel (Raum um −11 dB): dort zählt der Abstand von Musik und Geräusch.
    grund = [float(z.split()[-1]) for z in zeilen[1:] if float(z.split()[1]) <= GRUND_GRENZE_DB]
    mittel = float(np.mean(grund)) if grund else float("nan")
    return f"""<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Räumliche Geräusche</title>
<style>:root{{color-scheme:light dark;--grund:#fff;--text:#222;--gitter:#ccc;--linie:#e06e14}}
@media (prefers-color-scheme:dark){{:root{{--grund:#1b1b1b;--text:#eee;--gitter:#444}}}}
body{{background:var(--grund);color:var(--text);font:16px/1.5 system-ui;
margin:0 auto;max-width:44rem;padding:0 16px}}
video,img,svg{{width:100%;height:auto}} svg text{{fill:var(--text);font-size:11px}}
.gitter{{stroke:var(--gitter)}} .nachher{{fill:none;stroke:var(--linie);stroke-width:2.5}}
pre{{overflow-x:auto;font-size:12px}}</style></head><body>
<h1>Räumliche Geräusche: Park von Maple Falls</h1>
<p>Erst <b>vorher</b> (Wasserfall überall gleich laut), dann <b>nachher</b>: Ankunft aus dem Diner,
das Rauschen schwillt 3,5 s an und sinkt weich auf den Grundpegel. Nach 7 s geht der Held zum
Wasserfall ({wege}); ab 12 Kacheln wird es stetig lauter. Musik und Geräusch mit den Reglern der
Grundeinstellung (60 % und 80 %).</p>
<video controls playsinline src="raumprobe.mp4"></video>
<h2>Pegel des Geräuschs (nachher)</h2><p>0 dB = so laut wie bisher, −11 dB = Grundpegel.</p>
{svg_kurve(nachher)}
<h2>Karte mit Ringen</h2><p>Orange = lauter; rote Punkte: 90 %, 50 % und 10 % der Nähe; schwarzer
Rahmen: Quelle (Wasserfall).</p><img alt="Park mit Ringen" src="data:image/png;base64,{bild}">
<h2>Messung im Mix</h2><p>Abstand Musik zu Geräusch in den Sekunden auf dem Grundpegel: im
Mittel {mittel:.1f} dB (die Musik schwankt mit ihren Phrasen; über das ganze Stück gemessen 12 dB).
Werte je Sekunde:</p>
<pre>{chr(10).join(zeilen)}</pre></body></html>
"""

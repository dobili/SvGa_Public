"""HTML-Seite der Vergleichsseite zur Figurengröße (proportionsvergleich.py), fürs Handy.

Warum: Der Autor wählt auf dem Handy zwischen den Varianten; die Seite zeigt Bilder nebeneinander,
die Zahlen dazu und eine Empfehlung. Rolle: nur Darstellung; gerechnet wird in
proportionsvergleich.py. Abhängigkeiten: Pillow (Galerie der Möbel), proportionen.py.
"""

import collections
import html
from pathlib import Path

from PIL import Image

from pipeline.abenteuer import belebungsvorschau, proportionen
from pipeline.abenteuer.kartenbild import moebelbild
from pipeline.abenteuer.moebelliste import lade_moebel

ZOOM = 3
GALERIE = 10  # so viele Möbel zeigt die Galerie (die häufigsten)
SICHT = (8, 15)  # Kacheln im Hochformat bei ZOOM 3 (KARTENREGELN 7a)

STIL = """
:root{--grund:#fbf8f1;--text:#1f1d1a;--leise:#6b665c;--rand:#ddd5c4;--feld:#fff;--akzent:#8a5a12}
@media (prefers-color-scheme: dark){:root{--grund:#1b1a17;--text:#eee8dc;--leise:#a9a191;
--rand:#3a362e;--feld:#24221e;--akzent:#e2b15c}}
body{margin:0;padding:16px;background:var(--grund);color:var(--text);font:16px/1.5 system-ui,sans-serif}
main{max-width:760px;margin:0 auto}h1{font-size:1.4rem}h2{font-size:1.15rem;margin-top:2rem}
.reihe{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}
figure{margin:0;flex:0 0 auto}figure img{display:block;width:160px;image-rendering:pixelated;
border:1px solid var(--rand)}figcaption{font-size:.8rem;color:var(--leise)}
table{border-collapse:collapse;width:100%;font-size:.85rem}td,th{border-bottom:1px solid var(--rand);
padding:4px;text-align:left;vertical-align:top}.hinweis{background:var(--feld);border-left:4px solid
var(--akzent);padding:8px 12px}
"""

NAMEN = {
    "ist": "heute",
    "A": "A: Möbel × 0,75",
    "B": "B: Raum × 0,75",
    "C": "C: Figuren × 1,33",
    "D": "D: zu große Möbel kleiner",
}


def _e(text: object) -> str:
    return html.escape(str(text))


def galerie(ziel: Path, privat: Path, befunde: list) -> str:
    """Die häufigsten zu großen Möbel: Original, verkleinert (Nächster Nachbar, geglättet), mit Held."""
    katalog = lade_moebel()
    held = belebungsvorschau.figurbild(privat, "figuren/held-0.png", 3, belebungsvorschau.rgba)
    zu_gross = [b for b in befunde if b.verhaeltnis > b.band[1]]
    zu_gross.sort(key=lambda b: -len(b.stellen))
    teile = []
    for nummer, befund in enumerate(zu_gross[:GALERIE]):
        try:
            bild = moebelbild(privat, katalog[befund.moebel]["quelle"]).convert("RGBA")
        except FileNotFoundError:
            continue
        s = befund.vorschlag
        klein = (max(1, round(bild.width * s)), max(1, round(bild.height * s)))
        fassungen = {
            "original": bild,
            "naechster": bild.resize(klein, Image.NEAREST),
            "geglaettet": bild.resize(klein, Image.BOX),
        }
        zellen = []
        for name, fassung in fassungen.items():
            buehne = Image.new("RGBA", (fassung.width + 24, max(fassung.height, 32) + 4), (0, 0, 0, 0))
            buehne.alpha_composite(fassung, (0, buehne.height - fassung.height))
            if held is not None:
                buehne.alpha_composite(held, (fassung.width + 2, buehne.height - held.height))
            datei = f"bilder/moebel-{nummer:02d}-{name}.png"
            buehne.resize((buehne.width * ZOOM, buehne.height * ZOOM), Image.NEAREST).save(ziel / datei)
            zellen.append(f'<figure><img src="{datei}" alt=""><figcaption>{_e(name)}</figcaption></figure>')
        teile.append(
            f"<h3>{_e(befund.moebel)} ({_e(befund.art)}): {befund.verhaeltnis:.2f} der Figur, "
            f"Band {befund.band[0]}–{befund.band[1]}, Maßstab {s} – {len(befund.stellen)} Stellen</h3>"
            f'<div class="reihe">{"".join(zellen)}</div>'
        )
    return "\n".join(teile)


def tabelle_befunde(befunde: list) -> str:
    """Zu groß und zu klein, je Möbel mit Stellen; dazu „wenige oft oder viele einmal“."""
    zeilen = "".join(
        f"<tr><td>{_e(b.moebel)}</td><td>{_e(b.art)}</td><td>{b.verhaeltnis:.2f}</td>"
        f"<td>{b.band[0]}–{b.band[1]}</td><td>{len(b.stellen)}</td></tr>"
        for b in befunde
    )
    kopf = "<tr><th>Möbel</th><th>Art</th><th>Höhe/Figur</th><th>Band</th><th>Stellen</th></tr>"
    return f"<table>{kopf}{zeilen}</table>"


def verteilung(befunde: list) -> str:
    """Kurzer Satz zur Verteilung der zu großen Stellen."""
    gross = [b for b in befunde if b.verhaeltnis > b.band[1]]
    stellen = sum(len(b.stellen) for b in gross)
    einmal = sum(1 for b in gross if len(b.stellen) == 1)
    zaehler = collections.Counter(b.moebel for b in gross)
    oft = sorted(gross, key=lambda b: -len(b.stellen))[:3]
    oft_text = ", ".join(f"{b.moebel} ({len(b.stellen)})" for b in oft)
    return (
        f"{len(zaehler)} Möbel sind zu groß, an {stellen} Stellen; {einmal} davon stehen nur einmal. "
        f"Am häufigsten: {oft_text}."
    )


def sicht(faktor: float) -> str:
    """Sichtbare Kacheln, wenn die ganze Welt mit der Figur wächst (Zoom × faktor)."""
    return f"{SICHT[0] / faktor:.1f} × {SICHT[1] / faktor:.1f}"


def schreibe_seite(ziel: Path, daten: dict, privat: Path) -> None:
    """Schreibt ZIEL/index.html aus den Daten von proportionsvergleich.main."""
    f = daten["figuren"]
    # Ohne PixelLab-Figuren misst der Lauf den alten LimeZu-Helden (22); im Spiel gilt PixelLab mit
    # 20 Kartenpixeln (weltmassstab.ts, 30 Figurenpixel mal 2/3).
    held = f["held"] if f["pixellab"] else proportionen.FIGUR_AUSSEN
    verhaeltnis = f["limezu_median"] / held if f["limezu_median"] and held else 0
    zusatz = "" if f["pixellab"] else " (PixelLab im Spiel; in diesem Lauf fehlen die Bögen)"
    warnung = (
        ""
        if f["pixellab"]
        else (
            '<p class="hinweis">Achtung: In diesem privaten Paket fehlen die PixelLab-Figuren '
            "(spiel/figuren-neu). Die Bilder zeigen die alten LimeZu-Figuren; für die Entscheidung bitte mit "
            "dem vollständigen Paket neu bauen.</p>"
        )
    )
    if daten.get("fehlt"):
        warnung += (
            f'<p class="hinweis">{len(daten["fehlt"])} Möbelbilder fehlen im privaten Paket dieses '
            "Laufs und sind leer gezeichnet; mit dem aktuellen Paket neu bauen.</p>"
        )
    stellen = []
    for s in daten["stellen"]:
        zellen = "".join(
            f'<figure><img src="{d}" alt=""><figcaption>{_e(NAMEN[v])}</figcaption></figure>'
            for v, d in s["bilder"].items()
        )
        stellen.append(f'<h3>{_e(s["titel"])}</h3><div class="reihe">{zellen}</div>')
    boden = "".join(
        f"<tr><td>{_e(b['stelle'])}</td><td>{b['vorher']} von {b['alle']}</td><td>{b['nachher']} "
        f"(+{b['nachher'] - b['vorher']})</td></tr>"
        for b in daten["boden"]
    )
    d12, d16 = daten["durchlass_12"], daten["durchlass_16"]
    eng = "".join(f"<li>{_e(b)}</li>" for b in d16 if b not in d12)
    gross_ist = [b for b in daten["befunde_ist"] if b.verhaeltnis > b.band[1]]
    gross_c = [b for b in daten["befunde_c"] if b.verhaeltnis > b.band[1]]
    seite = f"""<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Figurengröße</title>
<style>{STIL}</style></head><body><main>
<h1>Figurengröße: Varianten zur Wahl</h1>{warnung}
<h2>Messung</h2>
<p>Figuren des Grafiksatzes (LimeZu, {f["limezu_anzahl"]} gemessen): Median {f["limezu_median"]} Pixel hoch.
Unser Held auf der Karte: {held:g} Kartenpixel{zusatz}.
Verhältnis {verhaeltnis:.2f}.</p>
<p>{_e(verteilung(daten["befunde_ist"]))} Mit Figur innen × 1,33 (Variante C) bleiben
{len(gross_c)} statt {len(gross_ist)} Möbel zu groß (die übrigen stehen außen: Variante D).</p>
<h2>Die Stellen</h2><p>Jedes Bild ist ein Ausschnitt von 8 × 11 Kacheln in der Vergrößerung des Spiels.
B ist C verkleinert: dieselbe Anordnung, aber jede Kachel kleiner als außen.</p>
{"".join(stellen)}
<h2>Variante A: Wie viel Boden frei wird</h2>
<table><tr><th>Raum</th><th>frei heute</th><th>frei mit Möbeln × 0,75</th></tr>{boden}</table>
<h2>Variante C: Durchgänge</h2>
<p>Bleibt der Körper 12 Pixel (nur das Bild wächst), ändert sich nichts. Wächst der Körper mit auf 16 Pixel,
werden diese Ziele nur noch durch eine zu enge Lücke erreichbar ({len(eng)}). Regel 10.92 verlangt
schon heute 16 Pixel freie Durchlässe; deshalb passt auch ein breiterer Körper:</p>
<ul>{eng or "<li>keine</li>"}</ul>
<h2>Ganze Welt größer (Figur und Türen mit)</h2>
<table><tr><th>Faktor</th><th>sichtbare Kacheln (hoch)</th></tr>
<tr><td>1 (heute)</td><td>{sicht(1)}</td></tr><tr><td>1,15</td><td>{sicht(1.15)}</td></tr>
<tr><td>1,25</td><td>{sicht(1.25)}</td></tr><tr><td>1,35</td><td>{sicht(1.35)}</td></tr></table>
<p>Ein Zoom von 3 × 1,15 ist nicht ganzzahlig: Jeder Pixel der Karte wird mal 3, mal 4
Bildschirmpixel breit.</p>
<h2>Zu große Möbel im Einzelnen</h2>{galerie(ziel, privat, daten["befunde_ist"])}
<h2>Alle Befunde heute</h2>{tabelle_befunde(daten["befunde_ist"])}
</main></body></html>"""
    (ziel / "index.html").write_text(seite, encoding="utf-8")


__all__ = ["schreibe_seite", "proportionen"]

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
figure{margin:0;flex:0 0 auto}figure.breit img{width:340px}
figure img{display:block;width:160px;image-rendering:pixelated;
border:1px solid var(--rand)}figcaption{font-size:.8rem;color:var(--leise)}
table{border-collapse:collapse;width:100%;font-size:.85rem}td,th{border-bottom:1px solid var(--rand);
padding:4px;text-align:left;vertical-align:top}.hinweis{background:var(--feld);border-left:4px solid
var(--akzent);padding:8px 12px}
"""


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


def _reihe(bilder: dict[str, str], breit: bool = False) -> str:
    klasse = ' class="breit"' if breit else ""
    return (
        '<div class="reihe">'
        + "".join(
            f'<figure{klasse}><a href="{d}"><img src="{d}" alt=""></a>'
            f"<figcaption>{_e(n)}</figcaption></figure>"
            for n, d in bilder.items()
        )
        + "</div>"
    )


def _innen(daten: dict) -> str:
    teile = []
    for raum in daten["innen"]:
        teile.append(f"<h3>{_e(raum['titel'])}</h3>{_reihe(raum['bilder'])}")
    zeilen = "".join(
        f"<tr><td>{f:.2f}</td><td>{len(daten['innen_rest'][f])}</td><td>{len(daten['durchlass'][f])}</td></tr>"
        for f in daten["faktoren"]
    )
    eng = sorted({b for f in daten["faktoren"] for b in daten["durchlass"][f]})
    liste = "".join(f"<li>{_e(b)}</li>" for b in eng) or "<li>keine: kein Gang und keine Tür wird zu eng</li>"
    return (
        "".join(teile)
        + "<table><tr><th>Figur ×</th><th>Möbel innen noch zu groß</th><th>zu enge Stellen</th></tr>"
        + zeilen
        + "</table><p>Zu enge Gänge oder Türen (Körper mit der Figur breiter, 4-Pixel-Raster):</p>"
        + f"<ul>{liste}</ul>"
    )


def _aussen(daten: dict) -> str:
    teile = []
    for karte in daten["aussen"]:
        anteil_v = karte["frei_vorher"] / karte["boden"]
        anteil_n = karte["frei_nachher"] / karte["boden"]
        leer = karte["deckung_vorher"] - karte["deckung_nachher"]
        teile.append(
            f"<h3>{_e(karte['titel'])}</h3><p>{karte['stellen']} Möbel verkleinert. Freier Boden "
            f"{anteil_v:.1%} → {anteil_n:.1%}; von Möbeln bedeckt {karte['deckung_vorher']:.1%} → "
            f"{karte['deckung_nachher']:.1%} (−{leer:.1%} der Fläche). "
            f"{'Verkleinern: ja.' if leer < LEER_MERKLICH else 'Wird merklich leerer: ansehen.'}</p>"
            + _reihe({k: v for k, v in karte["bilder"].items() if k.startswith("Ausschnitt")})
            + _reihe({k: v for k, v in karte["bilder"].items() if k.startswith("karte")}, breit=True)
        )
    return "".join(teile)


LEER_MERKLICH = 0.02  # ab so viel weniger bedeckter Fläche gilt eine Karte als merklich leerer


def empfehlung_innen(daten: dict) -> str:
    """Kleinster Faktor, bei dem innen kein Möbel mehr zu groß ist und kein Gang zu eng wird."""
    passend = [f for f in daten["faktoren"] if not daten["innen_rest"][f] and not daten["durchlass"][f]]
    if not passend:
        return "Kein gezeigter Faktor reicht; siehe Tabelle."
    f = min(passend)
    rest = len(daten["innen_rest"][daten["gemessen"]])
    return (
        f"Figur × {f:.2f}: der kleinste gezeigte Faktor, bei dem innen kein Möbel mehr zu groß ist und kein "
        f"Gang zu eng wird. Mit dem gemessenen Faktor {daten['gemessen']:.2f} bleiben {rest} Möbel "
        "innen zu groß."
    )


def schreibe_seite(ziel: Path, daten: dict, privat: Path) -> None:
    """Schreibt ZIEL/index.html aus den Daten von proportionsvergleich.main."""
    f = daten["figuren"]
    held = f["held"] if f["pixellab"] else proportionen.FIGUR_AUSSEN
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
    aussen = daten["aussen"]
    leerste = max(aussen, key=lambda k: k["deckung_vorher"] - k["deckung_nachher"]) if aussen else None
    seite = f"""<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Figurengröße</title>
<style>{STIL}</style></head><body><main>
<h1>Figurengröße: innen größere Figur, außen kleinere Möbel</h1>{warnung}
<h2>Messung</h2>
<p>Figuren des Grafiksatzes (LimeZu, {f["limezu_anzahl"]} gemessen): Median {f["limezu_median"]} Pixel hoch.
Unser Held auf der Karte: {held:g} Kartenpixel{zusatz}. Gemessener Faktor: <b>{daten["gemessen"]:.2f}</b>.</p>
<h2>Innen: Figur größer</h2>
<p>Ausschnitte von 8 × 11 Kacheln in der Vergrößerung des Spiels. Alle Figuren wachsen (Held, Figuren,
Statisten); Möbel, Wände und Türen bleiben. Antippen öffnet das Bild groß.</p>
{_innen(daten)}
<h2>Außen: zu große Möbel kleiner</h2>
<p>Jedes Möbel, das für unsere Figur zu groß ist, auf seinen Maßstab aus dem Messwerkzeug
({len(daten["aussen_befunde"])} Möbelarten). Erst der Ausschnitt im Spiel, darunter die ganze Karte.</p>
{_aussen(daten)}
<h2>Empfehlung</h2>
<p><b>Innen:</b> {empfehlung_innen(daten)}</p>
<p><b>Außen:</b> verkleinern auf allen gezeigten Karten: Sie werden höchstens um
{max((k["deckung_vorher"] - k["deckung_nachher"] for k in aussen), default=0):.1%} der Fläche leerer
(am meisten {_e(leerste["titel"]) if leerste else "–"}).
Merklich leerer (über {LEER_MERKLICH:.0%}) wird keine.</p>
<h2>Zu große Möbel im Einzelnen</h2>{galerie(ziel, privat, daten["aussen_befunde"])}
<h2>Alle Befunde außen</h2>{tabelle_befunde(daten["aussen_befunde"])}
</main></body></html>"""
    (ziel / "index.html").write_text(seite, encoding="utf-8")

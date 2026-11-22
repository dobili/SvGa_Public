"""Tierplan, HTML-Seite für den Autor (nur lokal, buch/arbeit/tiere/, sie bettet Paketbilder ein).

Warum: Der Autor liest auf dem Handy (21.11.2026). Je Art ein Kärtchen, sortiert nach Vorrang:
heutiges Bild als Vergleichsskizze neben Erwachsenem und Kind, Zielhöhe, Leinwand, fertiger
PixelLab-Prompt mit Typ und Animationen. Oben die Gesamtzahlen und die Arbeitsweise.
"""

import html
from pathlib import Path

from pipeline.abenteuer import tierplan as tp
from pipeline.abenteuer import tierplan_seite as ts
from pipeline.abenteuer.tierplan_daten import GESCHICHTE

KOPF = """<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Tiere für PixelLab</title>
<style>body{font:15px/1.45 system-ui,sans-serif;margin:0 auto;padding:12px 16px;max-width:860px;
background:#f6f3ec;color:#222}h1{font-size:1.4em}.karte{background:#fff;border-radius:10px;
padding:10px 12px;margin:12px 0;box-shadow:0 1px 3px #0002}.karte h2{font-size:1.1em;margin:0 0 4px}
.v1{border-left:6px solid #c0392b}.v2{border-left:6px solid #e67e22}.v3{border-left:6px solid #95a5a6}
.bleibt{border-left:6px solid #27ae60}img{image-rendering:pixelated;max-width:100%}
code{display:block;white-space:pre-wrap;background:#f0ede6;padding:6px;border-radius:6px;font-size:.9em}
td,th{padding:2px 6px;text-align:left;vertical-align:top}.klein{color:#666;font-size:.9em}</style>
</head><body>"""

ARBEITSWEISE = (
    "<p class='klein'>Arbeitsweise: Create from Text, Typ wie angegeben (Quadruped für Vierbeiner, "
    "Custom für Vögel, Fische, Insekten, Krebse und Roboter), v3 für 8 Richtungen, Ansicht low "
    "top-down wie bei den Figuren. Danach die Bewegung je Richtung (Vorlage oder Animate with text, "
    "4 bis 16 Bilder, gerade Zahl) und je Haltung ein Zustand. Leinwand so klein wie angegeben: Das "
    "Tier soll sie füllen, im Spiel wird es wie die Figuren mit 2/3 gezeichnet; der genaue Maßstab "
    "folgt nach dem Export aus der Messung.</p>"
)


def _karte(e: dict, privat: Path) -> str:
    a = e["art"]
    klasse = f"v{e['vorrang']}" if e["neu"] else "bleibt"
    z = e["zaehler"]
    titel = f"Vorrang {e['vorrang']}" if e["neu"] else "bleibt (LimeZu/Gemini)"
    platzhalter = " (heutiges Bild als Platzhalter)" if e["bild"] else " (grau: noch kein Bild)"
    verhalten = ", ".join(f"{k} {v}" for k, v in e["verhalten"].items())
    zeilen = [
        f"<div class='karte {klasse}'><h2>{html.escape(a.name)} · {titel}</h2>",
        f"<img alt='Vergleich' src='{ts.skizze(privat, a, e['bild'])}'>",
        "<div class='klein'>Skizze im Spielmaß: Erwachsener 20, Kind 14, Tier "
        f"{tp.zielhoehe(a)} Spielpixel{platzhalter}</div>",
        "<table>",
        f"<tr><th>Stellen</th><td>{e['stellen']} (richtig {z['richtig']}, Ersatz {z['ersatz']}, "
        f"nichts {z['fehlt']}); "
        f"heute: {html.escape(str(e['bild'] or 'nichts'))}</td></tr>",
        f"<tr><th>Orte</th><td>{html.escape(', '.join(e['orte']))}</td></tr>",
        f"<tr><th>Verhalten</th><td>{html.escape(verhalten)}</td></tr>",
    ]
    if a.name in GESCHICHTE:
        zeilen.append(f"<tr><th>Geschichte</th><td>{html.escape(GESCHICHTE[a.name])}</td></tr>")
    zeilen.append(
        f"<tr><th>Größe</th><td>Ziel {tp.zielhoehe(a)} × {tp.ziellaenge(a)} Spielpixel (Höhe × Länge), "
        f"in PixelLab etwa {round(tp.zielhoehe(a) * 1.5)} px hoch; "
        f"Leinwand {tp.leinwand(a)} × {tp.leinwand(a)}</td></tr>"
    )
    if not e["neu"]:
        alt = ts_massstab(a.name)
        zeilen.append(
            f"<tr><th>Maßstab</th><td>gemessen {tp.GEMESSEN.get(a.name)} px, heute {alt} → "
            f"neu {tp.massstab_vorschlag(a.name)}</td></tr>"
        )
    zeilen.append(
        f"<tr><th>PixelLab</th><td>Create from Text · {a.typ.capitalize()} · v3 "
        "(8 Richtungen)</td></tr></table>"
    )
    zeilen.append(f"<code>{html.escape(ts.prompt(a))}\nNegativ: {html.escape(ts.negativ(a))}</code>")
    anim = "".join(
        f"<li>{html.escape(n)}: {html.escape(w)}{' – „' + html.escape(t) + '“' if t else ''}</li>"
        for n, w, t in e["anim"]
    )
    zeilen.append(f"<ul>{anim}</ul><div class='klein'>Generierungen: {e['generierungen']}</div></div>")
    return "\n".join(zeilen)


def ts_massstab(art: str) -> float:
    """Heutiger Maßstab in tierarten.json (ohne Angabe 1)."""
    import json

    return json.loads(tp.TIERARTEN.read_text(encoding="utf-8"))["arten"].get(art, {}).get("massstab", 1)


def schreibe(privat: Path, ziel: Path) -> Path:
    """Seite nach ZIEL/index.html schreiben; gibt den Pfad zurück."""
    eintraege = ts.eintraege()
    neu = [e for e in eintraege if e["neu"]]
    gen = {v: sum(e["generierungen"] for e in neu if e["vorrang"] == v) for v in (1, 2, 3)}
    teile = [
        KOPF,
        "<h1>Tiere für PixelLab</h1>",
        f"<p>{sum(e['stellen'] for e in eintraege)} Tierstellen in den Szenen, {len(eintraege)} Arten. "
        f"Neu zu machen: {len(neu)} Arten mit {sum(gen.values())} Generierungen "
        f"(Vorrang 1: {gen[1]}, Vorrang 2: {gen[2]}, Vorrang 3: {gen[3]}).</p>",
        ARBEITSWEISE,
    ]
    teile += [_karte(e, privat) for e in eintraege]
    teile.append("</body></html>")
    ziel.mkdir(parents=True, exist_ok=True)
    pfad = ziel / "index.html"
    pfad.write_text("\n".join(teile), encoding="utf-8")
    return pfad

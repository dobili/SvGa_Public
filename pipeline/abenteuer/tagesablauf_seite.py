"""Tagesabläufe als Seite für den Autor: je Ort Figur × Tageszeit, dazu die Wachen je Stunde.

Warum: Auftrag des Hauptchats (22.11.2026). Der Autor liest auf dem Handy und soll auf einen Blick
sehen, wer wann wo ist und ob ein Ort nachts leer wird (Geisterstadt-Prüfung als Balken).
Ausgabe nur lokal: ``python -m pipeline.abenteuer.tagesablauf_seite [ZIEL]`` schreibt
ZIEL/index.html (Standard buch/arbeit/tagesablauf/). Ohne Pillow.
"""

import html
import sys
from functools import lru_cache
from pathlib import Path

from pipeline.abenteuer.tagesablauf import figuren_je_ort, lade, schlafende, stundenplan
from pipeline.abenteuer.tagesablauf_entwurf import STUNDEN, grenze
from pipeline.abenteuer.tagesablauf_grundlagen import rollen

TAGESZEITEN = (("Morgen", 7), ("Tag", 12), ("Abend", 19), ("Nacht", 0))  # je eine Stunde als Stichprobe
STANDARD = Path(__file__).resolve().parents[2] / "buch" / "arbeit" / "tagesablauf"
KOPF = (
    '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width='
    'device-width,initial-scale=1"><title>Tagesabläufe</title><style>body{font:14px/1.4 system-ui,san'
    "s-serif;margin:0 auto;padding:12px 16px;max-width:980px;background:#f6f3ec;color:#222}table{bord"
    "er-collapse:collapse;width:100%;margin:6px 0 4px;font-size:.92em}td,th{border-bottom:1px solid #"
    "ddd;padding:3px 5px;text-align:left;vertical-align:top}.schlaf{color:#888}.ohne{color:#1f6f43}.b"
    "alken{display:flex;align-items:flex-end;gap:2px;height:54px;margin:4px 0 2px}.balken div{flex:1;"
    "background:#4a78b5;position:relative}.balken div.knapp{background:#c0392b}.stunden{display:flex;"
    "gap:2px;font-size:.7em;color:#666}.stunden span{flex:1;text-align:center}.ort{background:#fff;bo"
    "rder-radius:10px;padding:8px 12px;margin:12px 0;box-shadow:0 1px 3px #0002}.klein{color:#666;fon"
    "t-size:.88em}</style></head><body>"
)


def zelle(block: dict) -> str:
    """Ort und Tätigkeit eines Blocks, kurz. Beispiel: „Park (3, 12), sitzt“, „schläft (unsichtbar)“."""
    if not block.get("karte"):
        text = "zu Hause (unsichtbar)" if block["art"] == "zuhause" else "schläft (unsichtbar)"
        return f"<span class='schlaf'>{text}</span>"
    ort = f"{block['karte'].split('.')[1]} ({block['feld'][0]}, {block['feld'][1]})"
    tut = {"liegt": "schläft im Bett"}.get(block.get("tut", ""), block.get("tut", "steht"))
    return f"{html.escape(block['art'])}: {html.escape(ort)}, {html.escape(tut)}"


@lru_cache(maxsize=1)
def alle_rollen() -> dict:
    """Rollen aus Dokument 25, einmal gelesen (die Daten selbst tragen keine Sätze)."""
    return rollen()


LEGENDE = (
    "Wache Figuren je Stunde (rot: mehr als erlaubt schläft; 0 bis 4 Uhr die Hälfte, sonst ein "
    "Drittel; Kinder sind 21 bis 7 Uhr zu Hause und zählen nicht als Schlafende)"
)
GRUENDE = {"geist": "Geist", "roboter": "Roboter", "dienst": "Dienst für den Spieler"}


def tabelle(ort: str, daten: dict) -> str:
    """Figur × Tageszeit für einen Ort, mit Schlafzeit."""
    kopf = "".join(f"<th>{n} ({h} Uhr)</th>" for n, h in TAGESZEITEN)
    zeilen = [f"<div style='overflow-x:auto'><table><tr><th>Figur</th>{kopf}<th>Schlaf</th></tr>"]
    for name, e in sorted(daten.items()):
        if e.get("ort") != ort:
            continue
        plan = stundenplan(e)
        schlaf = next((b for b in e["bloecke"] if b["art"] == "schlaf"), None)
        rest = (
            f"{schlaf['von']}–{schlaf['bis']} Uhr"
            if schlaf
            else "Kind: 21–7 Uhr zu Hause"
            if e.get("kind")
            else f"<span class='ohne'>ohne ({html.escape(GRUENDE.get(e['ohne_schlaf'], ''))})</span>"
        )
        zellen = "".join(f"<td>{zelle(plan[h])}</td>" for _, h in TAGESZEITEN)
        rolle = alle_rollen().get(name, {}).get("rolle", "")
        wer = f"<b>{html.escape(name)}</b><br><span class='klein'>{html.escape(rolle)}</span>"
        zeilen.append(f"<tr><td>{wer}</td>{zellen}<td>{rest}</td></tr>")
    return "\n".join(zeilen) + "</table></div>"


def balken(ort: str, daten: dict, last: list[int]) -> str:
    """Wache je Stunde als Balken; rot, wo mehr als ein Drittel schläft."""
    gesamt = figuren_je_ort(daten)[ort]
    teile = []
    for h in range(STUNDEN):
        wach = gesamt - last[h]
        klasse = " class='knapp'" if last[h] > grenze(h, gesamt) else ""
        teile.append(
            f"<div{klasse} style='height:{100 * wach / max(gesamt, 1):.0f}%' "
            f"title='{h} Uhr: {wach} von {gesamt} wach'></div>"
        )
    stunden = "".join(f"<span>{h}</span>" for h in range(STUNDEN))
    return f"<div class='balken'>{''.join(teile)}</div><div class='stunden'>{stunden}</div>"


def schreibe(ziel: Path = STANDARD) -> Path:
    """Seite schreiben; gibt den Pfad zurück."""
    daten = lade()
    last = schlafende(daten)
    orte = sorted({e["ort"] for e in daten.values() if "ort" in e})
    geschichte = sorted(n for n, e in daten.items() if e.get("folgt_geschichte"))
    teile = [
        KOPF,
        "<h1>Tagesabläufe</h1>",
        f"<p>{len(daten)} Figuren in {len(orte)} Orten. Ohne Ablauf, weil sie der Geschichte folgen: "
        f"{html.escape(', '.join(geschichte))}. Die Geschichte geht immer vor: Ein offener Questschritt hält "
        "seine Figur wach an ihrem Questort.</p>",
    ]
    for ort in orte:
        teile.append(
            f"<div class='ort'><h2>{html.escape(ort)}</h2>{balken(ort, daten, last[ort])}"
            f"<div class='klein'>{LEGENDE}</div>"
            f"{tabelle(ort, daten)}</div>"
        )
    teile.append("</body></html>")
    ziel.mkdir(parents=True, exist_ok=True)
    pfad = ziel / "index.html"
    pfad.write_text("\n".join(teile), encoding="utf-8")
    return pfad


if __name__ == "__main__":
    print(schreibe(Path(sys.argv[1]) if len(sys.argv) > 1 else STANDARD))

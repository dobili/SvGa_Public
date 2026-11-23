"""Welche Figur welche Zustände aus PixelLab braucht: Stuhl, Boden, Liegen.

Warum: Der Autor erzeugt die Figuren neu in PixelLab. Sitzen und Liegen gibt es dort nur als „New
State“, einen eigenen Export je Zustand (Auftrag des Haupt-Chats, 21.11.2026; Ablage und Wortlaut
in docs/spiel/24_Figuren_und_Portraets.md, Punkt 6). Damit er nur erzeugt, was das Spiel zeigt,
listet dieses Werkzeug je Figurenbild die Zustände:

- **stuhl:** Die Figur sitzt in einer Szene (``sitzt``) auf einem Sitzmöbel (Art stuhl, bank,
  sessel, sofa, hocker, couch; dieselbe Regel wie app/src/abenteuer/oberwelt/sitzplatz.ts).
- **boden:** Sie sitzt ohne Sitzmöbel, am Boden (Juno auf der Tribüne, Nova am Podium).
- **liegen:** Ein Dialog legt sie mit ``#stelle:<wer>>x,y>liegt`` ins Bett (der Held in der Nacht).
- **rennen:** Ein Dialog lässt sie mit ``#gehe:<wer>>ziel>rennt`` rennen, oder sie ist ein Statist
  mit Verhalten ``rennen`` (Kinder zwischen den Fahnenmasten). Der Held rennt draußen immer
  (Steuerkreuz weit nach außen, Nachtrag des Haupt-Chats vom 21.11.2026); PixelLab-Animation
  „Running“, Ordner ``animations/Running/``.

Gezählt werden Figuren (``figuren`` der Szenen, Bild aus orte.json) und Statisten mit eigenem Bild
(``belebung``, Eigenschaft ``bild``). Der Held steht für alle Varianten (``held-0`` …).

Aufruf: ``python -m pipeline.abenteuer.figurenzustaende [--privat PFAD_ZU_spiel] [--ziel ORDNER]``.
Schreibt ``zustaende.md`` und ``zustaende.html`` (Vorschaubild je Figur aus
``<privat>/figuren-neu/<name>/rotations/south.png``, eingebettet) nach ``buch/arbeit/zustaende/``.
Die Seite enthält Bilder aus dem privaten Paket und bleibt deshalb lokal.
Abhängigkeiten: figurenort.py (Orte), moebelliste.py (Katalog), Standardbibliothek.
"""

import argparse
import base64
import html
import json
import re
from dataclasses import dataclass, field
from pathlib import Path

from pipeline.abenteuer import figurenzustaende_ablauf as A
from pipeline.abenteuer.figurenort import DATEN, lade_orte
from pipeline.abenteuer.moebelliste import lade_moebel

HAUPT = Path(__file__).resolve().parents[2]
ZIEL = HAUPT / "buch" / "arbeit" / "zustaende"
KACHEL = 16
SITZARTEN = {"stuhl", "bank", "sessel", "sofa", "hocker", "couch"}
ZUSTAENDE = ("stuhl", "boden", "liegen", "rennen")
STELLE_LIEGT = re.compile(r"#stelle:(\w+)>[\d,]+>liegt")
GEHE_RENNT = re.compile(r"#gehe:(\w+)>[^\s>#]+>rennt")
HELD = "held"


@dataclass
class Bedarf:
    """Ein Figurenbild mit seinen Zuständen und den Fundstellen je Zustand."""

    bild: str
    stellen: dict[str, set[str]] = field(default_factory=dict)

    def merke(self, zustand: str, stelle: str) -> None:
        """Hält fest, dass das Bild an dieser Stelle diesen Zustand braucht."""
        self.stellen.setdefault(zustand, set()).add(stelle)


def ist_sitzmoebel(name: str, angabe: dict) -> bool:
    """Wie istSitzmoebel in sitzplatz.ts: die Art, ohne Art ein Wort im Namen."""
    art = angabe.get("art")
    if art is not None:
        return art in SITZARTEN
    return any(wort in name.lower() for wort in SITZARTEN)


def sitzart(feld: list[int], objekte: list[dict], katalog: dict) -> str:
    """„stuhl“, wenn die Mitte der Kachel im Bild eines Sitzmöbels liegt, sonst „boden“.

    Beispiel: Sam im Clubraum auf (5, 8), Schulstuhl auf (5, 7), 16 × 32 → „stuhl“.
    """
    mx, my = (feld[0] + 0.5) * KACHEL, (feld[1] + 0.5) * KACHEL
    for objekt in objekte:
        angabe = katalog.get(objekt.get("moebel", ""))
        if not angabe or "feld" not in objekt or not ist_sitzmoebel(objekt["moebel"], angabe):
            continue
        dx, dy = objekt.get("versatz", [0, 0])
        x, y = objekt["feld"][0] * KACHEL + dx, objekt["feld"][1] * KACHEL + dy
        massstab = objekt.get("massstab", 1)
        if x <= mx < x + angabe["breite"] * massstab and y <= my < y + angabe["hoehe"] * massstab:
            return "stuhl"
    return "boden"


def _bilder_je_figur(orte: list[dict]) -> dict[str, str]:
    """Kennung „ort.objekt“ → Bildname (figuren/<bild>.png)."""
    return {f["kennung"]: Path(f["sprite"]).stem for o in orte for f in o["figuren"] if f.get("sprite")}


def _aus_szenen(daten: Path, bilder: dict[str, str], katalog: dict, bedarf: dict[str, Bedarf]) -> None:
    """Sitzende Figuren und Statisten aller Szenen."""
    for pfad in sorted((daten / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        ort = str(szene.get("karte", "")).split(".")[0]
        objekte = szene.get("objekte", [])
        sitzende = [(bilder.get(f"{ort}.{f['name']}"), f) for f in szene.get("figuren", []) if f.get("sitzt")]
        _rennende_statisten(szene, pfad.stem, bedarf)
        sitzende += [
            (b["eigenschaften"].get("bild"), b)
            for b in szene.get("belebung", [])
            if b.get("eigenschaften", {}).get("sitzt") and b["eigenschaften"].get("bild")
        ]
        for bild, eintrag in sitzende:
            if bild:
                zustand = sitzart(eintrag["feld"], objekte, katalog)
                bedarf.setdefault(bild, Bedarf(bild)).merke(zustand, f"{pfad.stem} ({eintrag['name']})")


def _rennende_statisten(szene: dict, stelle: str, bedarf: dict[str, Bedarf]) -> None:
    """Statisten mit eigenem Bild und Verhalten „rennen“ (ohne Bild: der Name als Hinweis)."""
    for b in szene.get("belebung", []):
        eigenschaften = b.get("eigenschaften", {})
        if b.get("typ") == "statist" and eigenschaften.get("verhalten") == "rennen":
            bild = f"{b['name']} ({eigenschaften.get('bild', 'statist')})"
            bedarf.setdefault(bild, Bedarf(bild)).merke("rennen", stelle)


def _aus_ink(daten: Path, bilder: dict[str, str], bedarf: dict[str, Bedarf]) -> None:
    """Liegende aus ``#stelle … >liegt`` (der Held für alle Varianten)."""
    namen = {k.split(".", 1)[1]: b for k, b in bilder.items()}
    for pfad in sorted((daten / "dialoge" / "de").glob("*.ink")):
        text = pfad.read_text(encoding="utf-8")
        for zustand, muster in (("liegen", STELLE_LIEGT), ("rennen", GEHE_RENNT)):
            for wer in muster.findall(text):
                bild = HELD if wer == HELD else namen.get(wer)
                if bild:
                    bedarf.setdefault(bild, Bedarf(bild)).merke(zustand, pfad.stem)
    bedarf.setdefault(HELD, Bedarf(HELD)).merke("rennen", "draußen (Steuerkreuz)")


def _aus_ablaeufen(daten: Path, bilder: dict[str, str], katalog: dict, bedarf: dict[str, Bedarf]) -> None:
    """Sitzende und Liegende der Tagesabläufe (figurenzustaende_ablauf.py)."""
    karten = A.szenen_je_karte(lade_orte(daten))
    for person, ort, block in A.bloecke(daten):
        szene = karten.get(block.get("karte", ""))
        bild = A.bild_der_person(person, ort, bilder)
        if not szene or not bild:
            continue
        objekte = json.loads((daten / "szenen" / f"{szene}.json").read_text(encoding="utf-8")).get(
            "objekte", []
        )
        zustand = A.zustand_des_blocks(block, objekte, katalog, sitzart)
        if zustand:
            bedarf.setdefault(bild, Bedarf(bild)).merke(zustand, f"Tagesablauf {block['karte']} ({person})")


def ermittle(daten: Path = DATEN) -> dict[str, Bedarf]:
    """Bedarf je Figurenbild aus Szenen, Tagesabläufen und Ink, nach Bildnamen sortiert."""
    orte = lade_orte(daten)
    bilder = _bilder_je_figur(orte)
    bedarf: dict[str, Bedarf] = {}
    katalog = lade_moebel(daten / "moebel")
    _aus_szenen(daten, bilder, katalog, bedarf)
    _aus_ablaeufen(daten, bilder, katalog, bedarf)
    _aus_ink(daten, bilder, bedarf)
    return dict(sorted(bedarf.items()))


def fehlende(bedarf: dict[str, Bedarf], privat: Path) -> list[tuple[str, str, int]]:
    """(Bild, Zustand, Zahl der Stellen) ohne Bild im privaten Ordner, häufigste zuerst."""
    liste = [
        (b.bild, z, len(stellen))
        for b in bedarf.values()
        for z, stellen in b.stellen.items()
        if b.bild and not b.bild.endswith(")") and not A.vorhanden(privat, b.bild, z)
    ]
    return sorted(liste, key=lambda e: (-e[2], e[0]))


def als_markdown(bedarf: dict[str, Bedarf]) -> str:
    """Tabelle Figur × Zustand mit den Fundstellen."""
    zeilen = ["# Zustände je Figur (PixelLab, New State)", "", "| Bild | " + " | ".join(ZUSTAENDE) + " |"]
    zeilen.append("|" + " --- |" * (len(ZUSTAENDE) + 1))
    for b in bedarf.values():
        zellen = ["; ".join(sorted(b.stellen.get(z, set()))) or "–" for z in ZUSTAENDE]
        zeilen.append(f"| {b.bild} | " + " | ".join(zellen) + " |")
    return "\n".join(zeilen) + "\n"


def _vorschau(privat: Path | None, bild: str) -> str:
    """Eingebettetes Südbild aus figuren-neu (beim Helden held-0), sonst ein Hinweis."""
    name = "held-0" if bild == HELD else bild
    pfad = privat / "figuren-neu" / name / "rotations" / "south.png" if privat else None
    if not pfad or not pfad.exists():
        return '<div class="fehlt">noch kein Bild</div>'
    daten = base64.b64encode(pfad.read_bytes()).decode("ascii")
    return f'<img src="data:image/png;base64,{daten}" alt="{html.escape(bild)}">'


def als_html(bedarf: dict[str, Bedarf], privat: Path | None) -> str:
    """Seite für den Autor: Karte je Figur mit Vorschaubild und den gebrauchten Zuständen."""
    karten = []
    for b in bedarf.values():
        punkte = "".join(
            f"<li><b>{z}</b>: {html.escape('; '.join(sorted(b.stellen[z])))}</li>"
            for z in ZUSTAENDE
            if z in b.stellen
        )
        kopf = f"{_vorschau(privat, b.bild)}<h2>{html.escape(b.bild)}</h2>"
        karten.append(f'<div class="karte">{kopf}<ul>{punkte}</ul></div>')
    stil = (
        "body{font-family:sans-serif;margin:16px;background:#f4f1ea;color:#222}"
        ".raster{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}"
        ".karte{background:#fff;border-radius:8px;padding:10px}"
        "img{width:96px;height:96px;image-rendering:pixelated;display:block}"
        ".fehlt{width:96px;height:96px;background:#ddd;font-size:12px;display:flex;align-items:center;justify-content:center}"
        "h2{font-size:16px;margin:6px 0}ul{padding-left:18px;font-size:13px}"
        "@media (prefers-color-scheme:dark){body{background:#1d1d1f;color:#eee}.karte{background:#2c2c2e}}"
    )
    wortlaut = (
        "Stuhl: „Sitting on an invisible chair, eyes open, hands on lap“ · Boden: „sitting down "
        "cross-legged on the floor“ · Liegen: „Sleeping, lying on the side in an invisible bed“ · "
        "Rennen: Animation „Running“ (vier Richtungen)"
    )
    return (
        '<!doctype html><html lang="de"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f"<title>Zustände je Figur</title><style>{stil}</style></head><body>"
        f"<h1>Zustände je Figur</h1><p>{html.escape(wortlaut)}</p>"
        f'<div class="raster">{"".join(karten)}</div></body></html>\n'
    )


WORTLAUT = {
    "stuhl": "Sitting on an invisible chair, eyes open, hands on lap",
    "boden": "sitting down cross-legged on the floor",
    "liegen": "Sleeping, lying on the side in an invisible bed",
    "rennen": "Animation „Running“ (vier Richtungen)",
}


def als_fehlseite(liste: list[tuple[str, str, int]], bedarf: dict[str, Bedarf], privat: Path) -> str:
    """Seite für den Autor: je fehlendem Zustand Vorschau, Wortlaut für PixelLab und Fundstellen.

    Sortiert nach der Zahl der Stellen (häufigstes Sitzen zuerst). Enthält Bilder aus dem privaten
    Paket und bleibt darum privat.
    """
    karten = []
    for bild, zustand, zahl in liste:
        stellen = "; ".join(sorted(bedarf[bild].stellen[zustand]))
        karten.append(
            f'<div class="karte">{_vorschau(privat, bild)}<h2>{html.escape(bild)}: {zustand} ({zahl})</h2>'
            f"<p><b>PixelLab:</b> „{html.escape(WORTLAUT[zustand])}“</p><p>{html.escape(stellen)}</p></div>"
        )
    seite = als_html({}, privat)
    kopf = (
        f"<h1>Fehlende Zustände ({len(liste)})</h1><p>Häufigstes zuerst. Bis das Bild da ist, steht die "
        "Figur im Tagesablauf neben dem Stuhl.</p>"
    )
    return seite.replace("<h1>Zustände je Figur</h1>", kopf).replace(
        '<div class="raster"></div>', f'<div class="raster">{"".join(karten)}</div>'
    )


def main(argumente: list[str] | None = None) -> int:
    """Schreibt Liste und Seite; druckt eine Zusammenfassung."""
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("--privat", type=Path, help="Ordner spiel/ des privaten Repositorys")
    teiler.add_argument("--ziel", type=Path, default=ZIEL)
    args = teiler.parse_args(argumente)
    bedarf = ermittle()
    args.ziel.mkdir(parents=True, exist_ok=True)
    (args.ziel / "zustaende.md").write_text(als_markdown(bedarf), encoding="utf-8")
    (args.ziel / "zustaende.html").write_text(als_html(bedarf, args.privat), encoding="utf-8")
    if args.privat:
        liste = fehlende(bedarf, args.privat)
        (args.ziel / "fehlende.html").write_text(als_fehlseite(liste, bedarf, args.privat), encoding="utf-8")
        katalog = lade_moebel(DATEN / "moebel")
        bilder = _bilder_je_figur(lade_orte(DATEN))
        A.schreibe_app_tabelle(A.ohne_stuhlbild(DATEN, args.privat, bilder, katalog, sitzart))
        neu = [e for e in liste if (e[0], e[1]) not in A.WARTET_AUF_BILD]
        print(f"{len(liste)} fehlende Zustände, davon neu (nicht in WARTET_AUF_BILD): {neu}")
    for z in ZUSTAENDE:
        print(f"{z}: {', '.join(b.bild for b in bedarf.values() if z in b.stellen)}")
    print(f"{len(bedarf)} Figurenbilder, Ziel {args.ziel}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

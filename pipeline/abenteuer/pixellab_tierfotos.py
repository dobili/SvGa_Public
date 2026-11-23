"""Tierfotos im Spiel: Stellenliste aller Arten und Übersichtsseite der Fotos.

Warum: Der Hauptchat baut die Fotos der PixelLab-Tiere selbst nach und legt sie privat ab
(23.11.2026). Dieses Werkzeug liefert die Liste der Fotostellen für tests/durchlauf/tierfoto.spec.ts
und baut aus den Fotos eine Seite.

- ``stellen ORDNER``: je Art die erste Stelle, an der sie in einer Szene vorkommt (Hauptszenen,
  nicht die Varianten), mit Uhrzeit nach ``wann`` (Eule nachts 23 Uhr, Eichelhäher morgens 7 Uhr);
  dazu Größenvergleiche: die kleinsten Arten mit 6 statt 8 Spielpixeln und der Hund mit 9 statt 13
  (Maßstab über window.__tierMassstab). Schreibt ``ORDNER/stellen.json``.
- ``seite ORDNER``: schneidet aus jedem Foto ``<datei>-1.png`` den Ausschnitt um Held und Tier und
  schreibt ``ORDNER/index.html`` (nur lokal oder privat: Paketbilder).

Ablauf: ``python -m pipeline.abenteuer.pixellab_tierfotos stellen ORDNER``, dann die Fotoprobe mit
``TIERFOTO_LISTE=ORDNER/stellen.json TIERFOTO_ORDNER=ORDNER`` (Aufruf in tierfoto.spec.ts), dann
``python -m pipeline.abenteuer.pixellab_tierfotos seite ORDNER``.
Abhängigkeiten: Pillow (nur für ``seite``), tierplan.py.
"""

import html
import json
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parents[2]
SZENEN = WURZEL / "inhalte" / "abenteuer" / "szenen"
INHALTE = WURZEL / "inhalte" / "abenteuer"
TIERARTEN = WURZEL / "app" / "src" / "abenteuer" / "oberwelt" / "tierarten.json"
KACHEL = 16
# Uhrzeit zum Foto je „wann“ der Belebung (Phasen der Spieluhr).
STUNDE = {"morgen": 7, "tag": 12, "abend": 19, "nacht": 23}
ABSTAND = 3  # Held so viele Kacheln über dem Tier (wie tierfoto.spec.ts)
# Größenvergleiche (Hauptchat, 23.11.2026): kleinste Arten früher 6, jetzt 8 Spielpixel; Hund 13 oder 9.
KLEINE = ("maus", "spatz", "specht", "libelle", "krebs")
VERGLEICH = {**{a: (6, 8) for a in KLEINE}, "hund": (9, 13)}
# Ausschnitt eines Fotos (Pixel 7, 1082 × 2202): Held in der Mitte, je Kachel Abstand etwa 125 px.
MITTE_X, MITTE_Y, KACHEL_BILD = 541, 1100, 125
RAND_SEITE, RAND_OBEN, RAND_UNTEN = 400, 250, 300


def _art(name: str, staemme: dict[str, str]) -> str | None:
    """Art eines Belebungsnamens wie tiere.ts (längster Wortstamm)."""
    klein = name.lower().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    treffer = [s for s in staemme if s in klein]
    return staemme[max(treffer, key=len)] if treffer else None


def _kennung(szene: dict) -> str | None:
    karte = INHALTE / szene.get("datei", "")
    if not karte.is_file():
        return None
    eigenschaften = json.loads(karte.read_text(encoding="utf-8")).get("properties", [])
    return next((p["value"] for p in eigenschaften if p["name"] == "kennung"), None)


def stellen() -> list[dict]:
    """Je Art eine Fotostelle, dazu die Vergleiche (siehe Dateikopf)."""
    daten = json.loads(TIERARTEN.read_text(encoding="utf-8"))
    erste: dict[str, dict] = {}
    for pfad in sorted(SZENEN.glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        kennung = _kennung(szene)
        for b in szene.get("belebung", []):
            art = _art(b["name"], daten["staemme"]) if b.get("typ") == "tier" else None
            if not kennung or not art or art in erste:
                continue
            wann = b.get("eigenschaften", {}).get("wann")
            x, y = b["feld"]
            erste[art] = {"karte": kennung, "x": x, "y": y, "datei": art}
            if wann in STUNDE:
                erste[art]["stunde"] = STUNDE[wann]
    liste = [erste[a] for a in sorted(erste)]
    for art, (alt, neu) in VERGLEICH.items():
        if art not in erste:
            continue
        faktor = daten["arten"][art]["massstab"]
        liste.append(
            {**erste[art], "datei": f"{art}-{alt}px", "massstab": {art: round(faktor * alt / neu, 3)}}
        )
    return liste


def seite(ordner: Path) -> Path:
    """Ausschnitte und index.html aus den Fotos in ``ordner`` (Liste stellen.json)."""
    from PIL import Image

    liste = json.loads((ordner / "stellen.json").read_text(encoding="utf-8"))
    arten = json.loads(TIERARTEN.read_text(encoding="utf-8"))["arten"]
    (ordner / "ausschnitt").mkdir(exist_ok=True)
    teile = []
    for s in liste:
        foto = ordner / f"{s['datei']}-1.png"
        if not foto.is_file():
            continue
        unten = MITTE_Y + ABSTAND * KACHEL_BILD + RAND_UNTEN
        Image.open(foto).convert("RGB").crop(
            (MITTE_X - RAND_SEITE, MITTE_Y - RAND_OBEN, MITTE_X + RAND_SEITE, unten)
        ).save(ordner / "ausschnitt" / f"{s['datei']}.png")
        art = s["datei"].split("-")[0]
        faktor = (s.get("massstab") or {}).get(art, arten.get(art, {}).get("massstab"))
        uhr = f" · {s['stunde']} Uhr" if "stunde" in s else ""
        text = f"{s['datei']} · {s['karte']} {s['x']},{s['y']}{uhr} · Faktor {faktor}"
        bild = f'<img src="ausschnitt/{s["datei"]}.png">'
        teile.append(f"<figure>{bild}<figcaption>{html.escape(text)}</figcaption></figure>")
    stil = (
        "body{font-family:system-ui;margin:16px;background:#f4f1ea;color:#222}img{max-width:100%;"
        "image-rendering:pixelated}figure{display:inline-block;width:46%;margin:1%;vertical-align:top}"
        "figcaption{font-size:.8em}@media(prefers-color-scheme:dark){body{background:#1d1d1b;color:#eee}}"
    )
    ziel = ordner / "index.html"
    ziel.write_text(
        f'<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" '
        f'content="width=device-width,initial-scale=1"><title>Tiere im Spiel</title><style>{stil}</style>'
        f"</head><body><h1>Tiere im Spiel ({len(teile)} Fotos)</h1><p>Je Art eine Stelle, an der sie "
        "vorkommt (Held drei Felder darüber, Tiere angehalten). Dateien mit „-6px“ oder „-9px“ sind "
        "Größenvergleiche.</p>" + "".join(teile) + "</body></html>",
        encoding="utf-8",
    )
    return ziel


def main(argv: list[str]) -> int:
    """Befehlszeile; Aufruf im Dateikopf."""
    if len(argv) != 2 or argv[0] not in ("stellen", "seite"):
        print(__doc__)
        return 1
    ordner = Path(argv[1])
    ordner.mkdir(parents=True, exist_ok=True)
    if argv[0] == "stellen":
        liste = stellen()
        (ordner / "stellen.json").write_text(
            json.dumps(liste, ensure_ascii=False, indent=1), encoding="utf-8"
        )
        print(f"{len(liste)} Stellen nach {ordner / 'stellen.json'}")
    else:
        print(seite(ordner))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

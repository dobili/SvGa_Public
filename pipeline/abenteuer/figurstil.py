"""Figurstil: chibi oder realistisch? (Frage des Autors, 21.11.2026).

Warum: Der Autor bemerkte, dass Ambrose und eine Frau mit Dutt und Jeansjacke (Carla) „eine andere
Art Proportionen“ nutzen als der Held, Coach Delgado und die anderen: kleiner Kopf, lange Beine,
gedeckte Farben. Alle PixelLab-Figuren haben denselben Auftrag („slightly stylized proportions with
a larger head, about one third of the body height“, docs/spiel/25_Figurenprompts.md); PixelLab hat
ihn bei einigen dennoch realistisch umgesetzt. Dieses Werkzeug misst jede Figur und teilt sie ein,
damit neue Figuren vor dem Einbau geprüft werden.

Messung:
- Kopfanteil = Kopfhöhe (Scheitel ohne Hut und Dutt bis Kinn, Bart zählt mit) durch Figurhöhe
  (Scheitel bis Sohle), am Standbild „south“ (rotations/south.png, 32 × 32). Kinn und Scheitel
  lassen sich bei 32 Pixeln mit Haaren, Hüten und Bärten nicht verlässlich automatisch finden
  (Versuche mit Halsenge und Hautfarbe lagen bei einem Drittel der Figuren daneben); deshalb steht
  die Messung von Hand in GEMESSEN. Für eine neue Figur schreibt das Werkzeug ein vergrößertes Bild
  mit Zeilenlineal (lineal_<name>.png), aus dem man Scheitel, Kinn und Sohle abliest.
- Konturanteil (dunkle Randpixel) und mittlere Sättigung misst das Werkzeug selbst.
Einteilung: Kopfanteil ab 0,44 chibi, unter 0,40 realistisch, dazwischen Grenzfall; ein Urteil
nach Augenschein darf die Zahl überstimmen (mit Grund in GEMESSEN).

Aufruf: python -m pipeline.abenteuer.figurstil PRIVAT/spiel/figuren-neu ZIEL [--limezu PRIVAT/spiel/figuren]
Schreibt ZIEL/kontaktbogen.html (Bilder eingebettet: nur lokal, buch/arbeit/), ZIEL/tabelle.md, für
ungemessene Figuren ZIEL/lineal_<name>.png und den Neubau-Plan im Stil des Coachs (figurstil_plan.py:
ZIEL/plan.html und plan.md). Abhängigkeiten: Pillow, figurstil_plan.py.
"""

import argparse
import base64
import colorsys
import io
import json
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw

from pipeline.abenteuer import figurstil_plan

CHIBI_AB = 0.44
REALISTISCH_UNTER = 0.40
DECKKRAFT = 128  # Alpha ab hier gilt ein Pixel als Figur
DUNKEL = 70  # Helligkeit, unter der ein Randpixel als Kontur zählt
LINEAL_ZOOM = 14
BOGEN_ZOOM = 4
LIMEZU_RAHMEN = (16, 32)
SCHATTEN = (0x4F, 0x4F, 0x4E)  # Bodenschatten des PixelLab-Exports (skripte/figurenbogen.mjs)
LIMEZU_SUED = 3  # Standbild „unten“ in der Ordnung von LimeZu (rechts, oben, links, unten)

# Rollen nach docs/spiel/25_Figurenprompts.md: Hauptfiguren haben ein Porträtblatt 3×2.
HAUPTFIGUREN = {
    "held-0", "ambrose", "ambrose-jung", "mutter", "juno", "victor", "victor-pullover",
    "graham-hale", "coach-delgado", "sam", "lily", "okafor", "dex", "mae",
}  # fmt: skip

# Von Hand gemessen am 21.11.2026 (Zeilen im 32er-Bild): Scheitel, Kinn, Sohle, Urteil oder None.
GEMESSEN: dict[str, tuple[int, int, int, str | None]] = {
    "abernathy": (2, 15, 29, None),
    "ada": (2, 13, 30, "chibi: großes Gesicht, Dutt hebt den Scheitel nicht"),
    "ambrose": (0, 9, 30, None),
    "ambrose-jung": (1, 11, 30, None),
    "boateng": (2, 14, 30, None),
    "calloway": (1, 13, 29, None),
    "carla": (3, 13, 30, "realistisch: Gesicht nur 4 × 5 Pixel im Haar, schmaler langer Körper"),
    "clover": (4, 16, 30, None),
    "coach-delgado": (1, 14, 30, None),
    "dex": (1, 14, 28, None),
    "dunmore": (1, 15, 30, None),
    "fenwick": (1, 15, 30, None),
    "graham-hale": (0, 15, 30, None),
    "hector": (1, 14, 30, None),
    "held-0": (2, 16, 30, None),
    "ivy": (6, 16, 26, None),
    "joggerin": (3, 15, 29, None),
    "jonah": (5, 16, 26, None),
    "juno": (2, 15, 27, None),
    "kettering": (1, 15, 30, None),
    "lily": (6, 16, 26, None),
    "mae": (4, 14, 26, None),
    "mutter": (1, 15, 30, None),
    "nia": (1, 15, 30, None),
    "okafor": (1, 15, 29, None),
    "oma-miller": (2, 15, 29, None),
    "otis": (1, 16, 30, None),
    "owen": (5, 15, 26, None),
    "patel": (1, 15, 30, None),
    "pratt": (1, 16, 30, None),
    "rosa": (2, 16, 30, None),
    "sam": (1, 15, 30, None),
    "silas": (2, 15, 30, None),
    "skater-jo": (1, 11, 30, None),
    "victor": (1, 15, 30, None),
    "victor-pullover": (1, 13, 30, None),
    "walt": (1, 13, 30, "chibi: Mütze und Bart, Gesicht breit wie beim Helden"),
}


@dataclass
class Messung:
    name: str
    kopfanteil: float | None
    einteilung: str
    kontur: float
    saettigung: float
    rolle: str
    grund: str | None = None
    farben: int = 0  # verschiedene Farben der Figur (Farbtiefe, Schattierung)
    hoehe: int = 0  # gezeichnete Höhe in Pixeln, ohne Bodenschatten
    prompt: str = ""  # PixelLab-Beschreibung aus metadata.json


def kopfanteil(scheitel: int, kinn: int, sohle: int) -> float:
    """Kopfhöhe durch Figurhöhe. Beispiel: Ambrose (0, 9, 30) → 10/31 = 0,32."""
    return (kinn - scheitel + 1) / (sohle - scheitel + 1)


def einteilung(anteil: float) -> str:
    """Chibi, realistisch oder Grenzfall nach dem Kopfanteil. Beispiel: 0,47 → chibi."""
    if anteil >= CHIBI_AB:
        return "chibi"
    if anteil < REALISTISCH_UNTER:
        return "realistisch"
    return "grenzfall"


def rolle(name: str) -> str:
    """Hauptfigur, Statist (Kennung statist-…) oder Nebenfigur."""
    if name in HAUPTFIGUREN:
        return "Hauptfigur"
    return "Statist" if name.startswith("statist") else "Nebenfigur"


def farbwerte(bild: Image.Image) -> tuple[float, float]:
    """Konturanteil (dunkle Randpixel) und mittlere Sättigung der deckenden Pixel."""
    px = bild.load()
    breite, hoehe = bild.size

    def deckt(x: int, y: int) -> bool:
        return 0 <= x < breite and 0 <= y < hoehe and px[x, y][3] > DECKKRAFT

    rand = dunkel = 0
    saettigung = []
    for y in range(hoehe):
        for x in range(breite):
            if not deckt(x, y):
                continue
            r, g, b, _ = px[x, y]
            saettigung.append(colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)[1])
            if not all(deckt(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                rand += 1
                dunkel += (0.3 * r + 0.59 * g + 0.11 * b) < DUNKEL
    return (dunkel / rand if rand else 0.0, sum(saettigung) / len(saettigung) if saettigung else 0.0)


def farbzahl_und_hoehe(bild: Image.Image) -> tuple[int, int]:
    """Zahl der Farben und gezeichnete Höhe; der graue Bodenschatten des Exports zählt nicht."""
    px = bild.load()
    farben, zeilen = set(), set()
    for y in range(bild.height):
        for x in range(bild.width):
            r, g, b, a = px[x, y]
            if a > DECKKRAFT and (r, g, b) != SCHATTEN:
                farben.add((r, g, b))
                zeilen.add(y)
    return len(farben), (max(zeilen) - min(zeilen) + 1) if zeilen else 0


def miss(name: str, bild: Image.Image) -> Messung:
    """Messung einer Figur aus GEMESSEN und dem Bild; ungemessen: Kopfanteil None."""
    kontur, saettigung = farbwerte(bild)
    farben, hoehe = farbzahl_und_hoehe(bild)
    if name not in GEMESSEN:
        return Messung(name, None, "ungemessen", kontur, saettigung, rolle(name), None, farben, hoehe)
    scheitel, kinn, sohle, urteil = GEMESSEN[name]
    anteil = kopfanteil(scheitel, kinn, sohle)
    stufe = urteil.split(":")[0] if urteil else einteilung(anteil)
    return Messung(name, anteil, stufe, kontur, saettigung, rolle(name), urteil, farben, hoehe)


def lies_prompt(pfad: Path) -> str:
    """Die PixelLab-Beschreibung aus metadata.json (erster Zustand), sonst leer."""
    if not pfad.exists():
        return ""
    zustaende = json.loads(pfad.read_text(encoding="utf-8")).get("states", [])
    return zustaende[0].get("character", {}).get("prompt", "") if zustaende else ""


def lineal(bild: Image.Image, name: str) -> Image.Image:
    """Vergrößertes Bild mit Zeilennummern, zum Ablesen von Scheitel, Kinn und Sohle."""
    z = LINEAL_ZOOM
    rand = 30
    blatt = Image.new("RGBA", (bild.width * z + rand, bild.height * z + 20), (210, 210, 210, 255))
    stift = ImageDraw.Draw(blatt)
    for y in range(bild.height):
        farbe = (235, 235, 235, 255) if y % 2 else (190, 190, 190, 255)
        stift.line([(rand, y * z), (blatt.width, y * z)], fill=farbe)
        stift.text((2, y * z), str(y), fill=(0, 0, 0, 255))
    groß = bild.resize((bild.width * z, bild.height * z), Image.NEAREST)
    blatt.alpha_composite(groß, (rand, 0))
    stift.text((rand, bild.height * z + 4), name, fill=(0, 0, 0, 255))
    return blatt


def als_daten(bild: Image.Image) -> str:
    """Bild als data-URI für die eingebettete Seite."""
    puffer = io.BytesIO()
    bild.save(puffer, format="PNG")
    return "data:image/png;base64," + base64.b64encode(puffer.getvalue()).decode()


def kachel(name: str, bild: Image.Image, unterschrift: str) -> str:
    breite = bild.width * BOGEN_ZOOM
    return (
        f'<figure><img src="{als_daten(bild)}" width="{breite}" alt="{name}">'
        f"<figcaption><b>{name}</b><br>{unterschrift}</figcaption></figure>"
    )


def seite(gruppen: list[tuple[str, list[str]]]) -> str:
    """Kontaktbogen: je Gruppe eine Überschrift und die Figuren nebeneinander."""
    teile = [
        "<!doctype html><meta charset='utf-8'><title>Figurstil</title><style>"
        "body{font:14px system-ui;background:#ddd;margin:16px}"
        "figure{display:inline-block;margin:6px;text-align:center;vertical-align:top;width:150px}"
        "img{image-rendering:pixelated;background:#c8c8c8}figcaption{font-size:12px}</style>",
        "<h1>Figurstil: chibi oder realistisch</h1>",
        f"<p>Kopfanteil = Scheitel bis Kinn durch Scheitel bis Sohle (Standbild unten). "
        f"Ab {CHIBI_AB} chibi, unter {REALISTISCH_UNTER} realistisch.</p>",
    ]
    for titel, kacheln in gruppen:
        teile.append(f"<h2>{titel} ({len(kacheln)})</h2>")
        teile.extend(kacheln)
    return "\n".join(teile)


def limezu_sued(pfad: Path) -> Image.Image | None:
    """Standbild unten aus einem LimeZu-Bogen (Rahmen 16 × 32), sonst None."""
    bild = Image.open(pfad).convert("RGBA")
    b, h = LIMEZU_RAHMEN
    if bild.height < h or bild.width < (LIMEZU_SUED + 1) * b:
        return None
    return bild.crop((LIMEZU_SUED * b, 0, (LIMEZU_SUED + 1) * b, h))


def tabelle(messungen: list[Messung]) -> str:
    zeilen = [
        "| Figur | Kopfanteil | Einteilung | Rolle | Kontur | Sättigung | Grund |",
        "|---|---|---|---|---|---|---|",
    ]
    for m in messungen:
        anteil = f"{m.kopfanteil:.2f}" if m.kopfanteil is not None else "–"
        zeilen.append(
            f"| {m.name} | {anteil} | {m.einteilung} | {m.rolle} | {m.kontur:.2f} "
            f"| {m.saettigung:.2f} | {m.grund or ''} |"
        )
    return "\n".join(zeilen) + "\n"


def lauf(figuren: Path, ziel: Path, limezu: Path | None) -> list[Messung]:
    """Misst alle PixelLab-Figuren, schreibt Bogen, Tabelle und Lineale für Ungemessene."""
    ziel.mkdir(parents=True, exist_ok=True)
    messungen, bilder = [], {}
    for ordner in sorted(p for p in figuren.iterdir() if (p / "rotations" / "south.png").exists()):
        bild = Image.open(ordner / "rotations" / "south.png").convert("RGBA")
        bilder[ordner.name] = bild
        messung = miss(ordner.name, bild)
        messung.prompt = lies_prompt(ordner / "metadata.json")
        messungen.append(messung)
        if messung.kopfanteil is None:
            lineal(bild, ordner.name).save(ziel / f"lineal_{ordner.name}.png")
    reihenfolge = ["realistisch", "grenzfall", "chibi", "ungemessen"]
    gruppen = []
    for stufe in reihenfolge:
        auswahl = sorted((m for m in messungen if m.einteilung == stufe), key=lambda m: m.kopfanteil or 0)
        if auswahl:
            gruppen.append(
                (f"PixelLab: {stufe}", [kachel(m.name, bilder[m.name], unterschrift(m)) for m in auswahl])
            )
    if limezu:
        alte = [p for p in sorted(limezu.glob("*.png")) if p.stem not in bilder]
        kacheln = [kachel(p.stem, b, "LimeZu 16 × 32") for p in alte if (b := limezu_sued(p))]
        gruppen.append(("LimeZu-Bögen ohne PixelLab-Fassung (Altbestand, nicht vermessen)", kacheln))
    (ziel / "kontaktbogen.html").write_text(seite(gruppen), encoding="utf-8")
    (ziel / "tabelle.md").write_text(tabelle(messungen), encoding="utf-8")
    alte_namen = {p.stem for p in limezu.glob("*.png")} - set(bilder) if limezu else set()
    figurstil_plan.schreibe(messungen, bilder, alte_namen, ziel)
    return messungen


def unterschrift(m: Messung) -> str:
    anteil = f"{m.kopfanteil:.2f}" if m.kopfanteil is not None else "ungemessen"
    return f"{anteil} · {m.rolle}<br>Kontur {m.kontur:.2f} · Sätt. {m.saettigung:.2f}"


def main() -> None:
    teiler = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    teiler.add_argument("figuren", type=Path, help="Ordner figuren-neu des privaten Repositorys")
    teiler.add_argument("ziel", type=Path, help="Ausgabeordner, etwa buch/arbeit/figurstil")
    teiler.add_argument("--limezu", type=Path, help="Ordner spiel/figuren (alte LimeZu-Bögen)")
    args = teiler.parse_args()
    messungen = lauf(args.figuren, args.ziel, args.limezu)
    for m in messungen:
        anteil = f"{m.kopfanteil:.2f}" if m.kopfanteil is not None else " –  "
        print(f"{m.name:16} {anteil}  {m.einteilung:12} {m.rolle}")
    neu = [m.name for m in messungen if m.kopfanteil is None]
    if neu:
        print(f"Ungemessen (Lineal in {args.ziel}): {', '.join(neu)}")


if __name__ == "__main__":
    main()

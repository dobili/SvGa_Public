"""Boden- und Wandkacheln als einzelne Objekte (Katalog ``inhalte/abenteuer/moebel/bodenkacheln.json``).

Warum: Der Autor baut Treppenabgänge im Karteneditor selbst (Wunsch des Autors, 16.11.2026): Er legt
ein Treppenbild, deckt es teilweise mit Bodenkacheln ab und macht die abgedeckten Kacheln
durchgehbar; nur am Loch bleibt der Übergang. Dafür muss jede Kachel der Materialien als Objekt von
16 × 16 Pixeln in der Bibliothek stehen. Statt Bilder zu zeichnen, schneidet der Katalog sie mit
``ausschnitt`` (links, oben, rechts, unten in Pixeln, wie ``PIL.Image.crop``) aus den Bögen der
Materialien; Kartenbild, Editor-Paket und App-Paket schneiden genauso.

Einträge: je Boden das Grundfeld, die Kachel unter der Wand (``unter_wand``) und die acht Rand- und
Eckkacheln (``rand``, 3 × 3-Block); je Wand die obere und untere Kachel der Wandfläche und die erste
Krone. Alle: ``art`` ``boden_teil``, ``kollision`` false (man läuft darüber), sie liegen über einem
Abgang, den sie abdecken (``bodenteile.py``). Ohne ``zustand`` und ``stil``: Eine Kachel ist Boden
der Karte selbst und passt zu jedem Ort (``kartenregeln.py`` prüft nur, was die Angabe nennt).
Die Säume (``saum.py``) sind gezeichnet, nicht gekachelt; es gibt für sie keine Kacheln.

Aufruf: ``python -m pipeline.abenteuer.bodenkacheln`` schreibt den Katalog neu; der Test
``test_bodenkacheln_katalog_ist_aktuell`` prüft, dass er zu ``materialien.json`` passt.
"""

import json
import sys

from pipeline.abenteuer.moebelliste import ORDNER

K = 16
MATERIALIEN = ORDNER.parent / "materialien.json"
ZIEL = ORDNER / "bodenkacheln.json"
ERKLAERUNG = "Erzeugt von pipeline/abenteuer/bodenkacheln.py aus materialien.json; nicht von Hand ändern."
VORSILBE = "bk"
# Lage der Rand- und Eckkacheln im 3 × 3-Block (Spalte, Reihe) mit Namen; die Mitte ist das Feld.
RANDTEILE = {
    "RandNW": (0, 0),
    "RandN": (1, 0),
    "RandNO": (2, 0),
    "RandW": (0, 1),
    "RandO": (2, 1),
    "RandSW": (0, 2),
    "RandS": (1, 2),
    "RandSO": (2, 2),
}


def _name(material: str, teil: str = "") -> str:
    """Kennung im Katalog. Beispiel: („dielen“, „UnterWand“) → „bkDielenUnterWand“;
    „wasser_moor“ → „bkWasserMoor“."""
    teile = material.split("_")
    return VORSILBE + "".join(t[0].upper() + t[1:] for t in teile) + teil


def _eintrag(bogen: str, feld: list[int], hinweis: str) -> dict:
    """Ein Katalogeintrag für eine Kachel des Bogens an ``feld`` (Spalte, Reihe)."""
    x, y = feld[0] * K, feld[1] * K
    return {
        "quelle": bogen,
        "ausschnitt": [x, y, x + K, y + K],
        "breite": K,
        "hoehe": K,
        "kollision": False,
        "art": "boden_teil",
        "blick": "keine",
        "hinweis": hinweis,
    }


def katalog(materialien: dict) -> dict[str, dict]:
    """Alle Kachelobjekte zu den Materialien, nach Namen sortiert.

    Beispiel: ``dielen`` (Bogen boden, Feld [5, 13], unter_wand [5, 12]) → ``bkDielen`` mit
    ``ausschnitt`` [80, 208, 96, 224] und ``bkDielenUnterWand``.
    """
    boegen = materialien["boegen"]
    eintraege: dict[str, dict] = {}
    for name, art in materialien["boeden"].items():
        bogen = boegen[art["bogen"]]
        eintraege[_name(name)] = _eintrag(bogen, art["feld"], f"Bodenkachel {name}")
        if "unter_wand" in art:
            eintraege[_name(name, "UnterWand")] = _eintrag(bogen, art["unter_wand"], f"{name} unter der Wand")
        if "rand" in art:
            rx, ry = art["rand"]
            for teil, (dx, dy) in RANDTEILE.items():
                eintraege[_name(name, teil)] = _eintrag(bogen, [rx + dx, ry + dy], f"{name}, Rand {teil[4:]}")
    for name, art in materialien["waende"].items():
        bogen = boegen[art["bogen"]]
        for teil, feld in (
            ("Oben", art["oben"]),
            ("Unten", art["unten"]),
            ("Krone", (art.get("krone") or [None])[0]),
        ):
            if feld is not None:
                eintraege[_name(f"wand_{name}", teil)] = _eintrag(bogen, feld, f"Wand {name}, {teil.lower()}")
    return dict(sorted(eintraege.items()))


def katalogtext(materialien: dict) -> str:
    """Der Katalog als Dateitext (Format der Möbeldateien, ``indent=2``)."""
    daten = {
        "erklaerung": ERKLAERUNG,
        "moebel": katalog(materialien),
    }
    return json.dumps(daten, ensure_ascii=False, indent=2) + "\n"


def main() -> int:
    materialien = json.loads(MATERIALIEN.read_text(encoding="utf-8"))
    ZIEL.write_text(katalogtext(materialien), encoding="utf-8")
    print(f"{ZIEL}: {len(katalog(materialien))} Kacheln")
    return 0


if __name__ == "__main__":
    sys.exit(main())

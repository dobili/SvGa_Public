"""Befehl: sichtbare Höhe der PixelLab-Figuren messen und je Figur einen Höhenfaktor festlegen.

Warum: PixelLab liefert alle Menschen auf 32 × 32, hält sich aber nicht an die Größen der Prompts:
Erwachsene sind meist 30 bis 31 Pixel hoch, einige nur 27 bis 28; Jugendliche 30 bis 32 statt 27 bis
28 („short, child height“ wurde übergangen). Damit Kinder, Jugendliche, Erwachsene und Alte im Spiel
nebeneinander stimmen, bekommt jede Figur einen Faktor, mit dem die App sie zeichnet
(app/src/abenteuer/oberwelt/figurhoehen.json, gelesen in figurbogen.ts). Auftrag des Haupt-Chats,
23.11.2026: Zielhöhen Erwachsene 30,5, Alte 29,5, Jugendliche 27,5, Kinder 22; nur verkleinern oder
höchstens × 1,1 vergrößern; der Fuß bleibt auf der Fußzeile (die App skaliert um den Fußpunkt).

Gemessen wird das Standbild Süd (figuren-neu/<name>/rotations/south.png) ohne den Bodenschatten
des Exports (Farbe #4f4f4e unter den Füßen, wie figurenbogen.mjs). Die Altersgruppe kommt aus dem
Prompt der Zuordnung (Alter in Jahren oder in Jahrzehnten), sonst aus pixellabtabelle.ALTER_VON_HAND,
sonst „erwachsen“.

Ablauf (im Hauptordner): python -m pipeline.abenteuer.pixellabhoehen PRIVAT
Abhängigkeiten: Pillow (nur hier, nicht in pipeline/requirements.txt), pixellabtabelle.py.
"""

import argparse
import json
import re
from pathlib import Path

from pipeline.abenteuer import pixellabtabelle as T

ZUORDNUNG = Path("ki-roh") / "zuordnung_23-11.json"
FIGUREN = Path("spiel") / "figuren-neu"
TABELLE = Path(__file__).resolve().parents[2] / "app" / "src" / "abenteuer" / "oberwelt" / "figurhoehen.json"
ZIELHOEHE = {"kind": 22.0, "jugend": 27.5, "erwachsen": 30.5, "alt": 29.5}
HOECHSTENS = 1.1
# Unterschiede unter 2 % bleiben ohne Faktor (ein halbes Pixel bei Erwachsenen).
SCHWELLE = 0.02
STELLEN = 3
SCHATTEN = (0x4F, 0x4F, 0x4E)
SCHATTEN_AB_ZEILE = 24
KIND_BIS = 12
JUGEND_BIS = 17
ALT_AB = 65
JAHRZEHNTE = {
    "twenties": 25,
    "thirties": 35,
    "forties": 45,
    "fifties": 55,
    "sixties": 65,
    "seventies": 75,
    "eighties": 85,
}
GENAUER = {"early": -3, "mid": 0, "late": 3}


def alter_aus_prompt(prompt: str) -> int | None:
    """Alter in Jahren aus einem Prompt. Beispiele: „about 55“ → 55, „early sixties“ → 62, „boy, …, 14“."""
    p = prompt.lower()
    for muster in (r"(\d+)[- ]year[- ]old", r"about (\d+)", r"child height, (\d+)", r", (\d{1,2}),"):
        treffer = re.search(muster, p)
        if treffer:
            return int(treffer.group(1))
    treffer = re.search(
        r"(early|mid|late)[- ](twenties|thirties|forties|fifties|sixties|seventies|eighties)", p
    )
    return JAHRZEHNTE[treffer.group(2)] + GENAUER[treffer.group(1)] if treffer else None


def altersgruppe(name: str, prompt: str) -> str:
    """Kind, Jugend, Erwachsen oder Alt (oder „keine“ für Roboter, ALTER_VON_HAND)."""
    if name in T.ALTER_VON_HAND:
        return T.ALTER_VON_HAND[name]
    alter = alter_aus_prompt(prompt)
    if alter is None:
        return "erwachsen"
    if alter <= KIND_BIS:
        return "kind"
    if alter <= JUGEND_BIS:
        return "jugend"
    return "alt" if alter >= ALT_AB else "erwachsen"


def sichtbare_hoehe(pfad: Path) -> int:
    """Zeilen mit deckenden Pixeln (ohne Bodenschatten) eines Standbilds. Beispiel: Erwachsene 30."""
    from PIL import Image

    bild = Image.open(pfad).convert("RGBA")
    breite, hoehe = bild.size
    pixel = bild.load()
    zeilen = [
        y
        for y in range(hoehe)
        if any(
            pixel[x, y][3] > 0 and not (y >= SCHATTEN_AB_ZEILE and pixel[x, y][:3] == SCHATTEN)
            for x in range(breite)
        )
    ]
    return zeilen[-1] - zeilen[0] + 1 if zeilen else 0


def hoehenfaktor(hoehe: int, gruppe: str) -> float | None:
    """Faktor auf die Zielhöhe der Gruppe (nur verkleinern, höchstens × 1,1); None ohne Änderung."""
    if gruppe not in ZIELHOEHE or hoehe <= 0:
        return None
    faktor = min(HOECHSTENS, ZIELHOEHE[gruppe] / hoehe)
    return None if abs(faktor - 1) < SCHWELLE else round(faktor, STELLEN)


def prompts(privat: Path) -> dict[str, str]:
    """Prompt des ersten Zustands je Figur aus der Zuordnung (Zweitfiguren wie ihre Gruppe)."""
    daten = json.loads((privat / ZUORDNUNG).read_text(encoding="utf-8"))["gruppen"]
    ergebnis: dict[str, str] = {}
    for g in daten:
        ergebnis.setdefault(g["name"], g["zustaende"][0].get("prompt", ""))
    for neu, (quelle, _) in T.ZWEITFIGUR.items():
        ergebnis.setdefault(neu, ergebnis.get(quelle, ""))
    return ergebnis


def messe(privat: Path) -> list[dict]:
    """Je Figur in figuren-neu: Gruppe, Höhe, Faktor (Statisten-Kopien wie ihr Typ)."""
    texte = prompts(privat)
    zeilen = []
    for ordner in sorted(p for p in (privat / FIGUREN).iterdir() if p.is_dir()):
        sued = ordner / "rotations" / "south.png"
        if not sued.exists():
            continue
        quelle = T.statistentyp(int(ordner.name[-2:])) if ordner.name.startswith("statist-") else ordner.name
        hoehe = sichtbare_hoehe(sued)
        # Ohne Export (owen, statist.bauer: alter Ordner) kein Faktor: Alter und Zeichnung unbekannt.
        gruppe = altersgruppe(quelle, texte[quelle]) if quelle in texte else "ohne Export"
        zeilen.append(
            {"name": ordner.name, "gruppe": gruppe, "hoehe": hoehe, "faktor": hoehenfaktor(hoehe, gruppe)}
        )
    return zeilen


def main() -> None:
    """Misst alle Figuren, druckt die Tabelle und schreibt figurhoehen.json."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("privat", type=Path, help="privates Repository (schach-abenteuer-inhalte)")
    args = parser.parse_args()
    zeilen = messe(args.privat)
    for z in zeilen:
        print(f"{z['name']:22} {z['gruppe']:9} {z['hoehe']:3}  {z['faktor'] or ''}")
    faktoren = {z["name"]: z["faktor"] for z in zeilen if z["faktor"]}
    daten = {"ziele": ZIELHOEHE, "hoechstens": HOECHSTENS, "faktoren": faktoren}
    TABELLE.write_text(json.dumps(daten, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(zeilen)} Figuren gemessen, {len(faktoren)} mit Faktor → {TABELLE}")


if __name__ == "__main__":
    main()

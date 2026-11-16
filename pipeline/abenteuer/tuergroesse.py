"""Türen in Menschengröße (KARTENREGELN 10.92): Die Tür eines Hauses draußen ist mindestens so groß
wie die Spielfigur.

Warum: Der Autor hat die Häuser der hinteren Reihe in Maple Falls auf 125 % vergrößert, bis die
Haustür groß genug für die Figur war, und daraus eine Regel gemacht (Antwort zu RO32, 16.11.2026):
„Die Tür eines Hauses auf einer Außenkarte ist mindestens so groß wie die Spielfigur (Breite und
Höhe).“

Maße:
- Spielfigur: Rahmen 16 × 32 (``app/src/abenteuer/oberwelt/figurbilder.ts``), deckend 16 × 22 Pixel
  (``spiel/figuren/held-0.png``, Blick nach unten, mit Armen, ohne den leeren Rand oben).
- Tür: Türrahmen außen im ungeskalierten Bild, abgelesen mit der Lupe und gespeichert in
  ``inhalte/abenteuer/katalog_korrekturen/tuermasse.json`` (öffentlich, ohne Pixel prüfbar). Der
  Maßstab des Eintrags (``massstab``) zählt mit. Gebäude ohne gemessene Tür prüft das Werkzeug nicht;
  ``--offen`` listet sie.

Beispiel: ``haus_hinten_b_blau.png`` hat eine Tür von 14 × 19 Pixeln: zu klein (Figur 16 × 22); mit
``massstab`` 1.25 sind es 17,5 × 23,75, groß genug.

Aufruf: ``python -m pipeline.abenteuer.tuergroesse [--offen]``; im Kartenbau als Hinweis „Tür … zu
klein“, solange die Entscheidung über große Umbauten (Villen, Ladenfassaden) aussteht.
"""

import json
import sys
from functools import cache
from pathlib import Path

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
FIGUR_BREITE, FIGUR_HOEHE = 16, 22
GEBAEUDE = ("gebaeude", "haus")


@cache
def tuermasse() -> dict[str, tuple[int, int, int, int]]:
    """Dateiname des Gebäudebilds → Türrahmen. Dasselbe Bild liegt im Paket teils in zwei Ordnern."""
    daten = json.loads((INHALTE / "katalog_korrekturen" / "tuermasse.json").read_text(encoding="utf-8"))
    return {Path(k).name: tuple(v) for k, v in daten.items() if not k.startswith("_")}


def tuer_von(angabe: dict) -> tuple[int, int, int, int] | None:
    """Gemessener Türrahmen eines Katalogeintrags (None ohne Maß oder mit Ausschnitt)."""
    if "ausschnitt" in angabe:
        return None
    return tuermasse().get(Path(angabe.get("quelle", "")).name)


def pruefe_szene(szene: dict, moebel: dict) -> list[str]:
    """Hinweise: Häuser draußen, deren Tür (mit Maßstab) kleiner ist als die Figur."""
    if szene.get("art") != "aussen":
        return []
    befunde = []
    for eintrag in szene.get("objekte", []):
        angabe = moebel.get(eintrag["moebel"], {})
        tuer = tuer_von(angabe) if angabe.get("art") in GEBAEUDE else None
        if not tuer:
            continue
        massstab = float(eintrag.get("massstab", 1))
        breite, hoehe = (tuer[2] - tuer[0]) * massstab, (tuer[3] - tuer[1]) * massstab
        if breite < FIGUR_BREITE or hoehe < FIGUR_HOEHE:
            noetig = max(FIGUR_BREITE / (tuer[2] - tuer[0]), FIGUR_HOEHE / (tuer[3] - tuer[1]))
            befunde.append(
                f"Tür von {eintrag['moebel']} {tuple(eintrag.get('feld', ()))} ist {breite:g} × {hoehe:g} "
                f"Pixel, kleiner als die Figur ({FIGUR_BREITE} × {FIGUR_HOEHE}): massstab mindestens "
                f"{noetig:.2f} (Regel 10.92)"
            )
    return befunde


def offen(szene: dict, moebel: dict) -> set[str]:
    """Gebäudebilder einer Außenkarte ohne gemessene Tür."""
    if szene.get("art") != "aussen":
        return set()
    return {
        Path(moebel[e["moebel"]]["quelle"]).name
        for e in szene.get("objekte", [])
        if moebel.get(e["moebel"], {}).get("art") in GEBAEUDE and not tuer_von(moebel[e["moebel"]])
    }


def main(argumente: list[str]) -> int:
    from pipeline.abenteuer.moebelliste import lade_moebel

    moebel, anzahl, ohne = lade_moebel(), 0, set()
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        for b in pruefe_szene(szene, moebel):
            print(f"{pfad.name}: {b}")
            anzahl += 1
        ohne |= offen(szene, moebel)
    if "--offen" in argumente:
        print("Ohne gemessene Tür:", ", ".join(sorted(ohne)))
    print(f"{anzahl} Türen kleiner als die Figur, {len(ohne)} Gebäudebilder ohne Maß")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

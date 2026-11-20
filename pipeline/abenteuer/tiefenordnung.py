"""Tiefenordnung vor Gebäuden: Steht eine Figur vor einem Bild, muss sie darüber gezeichnet werden.

Warum: Notiz des Autors (20.11.2026, Foto): „Das Haus des Helden liegt grafisch auf der Figur des
Helden, wenn er das Haus verlässt, vorm Haus steht. Eventuell ist das auch bei anderen Gebäuden
so?“ Ursache war die Zeichentiefe skalierter Gebäude (app/src/abenteuer/oberwelt/zeichentiefe.ts):
Mit Maßstab galt die Bildunterkante statt der Maske, die Villa lag über dem Ankunftsfeld.

Regel wie in der App: Eine Figur hat als Tiefe die Mitte ihrer Kachel (y · 16 + 8). Ein Möbel
hat als Tiefe die Mitte der Reihe seiner letzten ganz gesperrten Maskenreihe, sonst der letzten
Reihe mit einer Sperre, sonst die Bildunterkante (zeichentiefe.ts); eine eigene Tiefe aus der
Karte (an der Wand, auf dem Tisch, Ebene) gilt, außer sie ist die Vorgabe des Kartenbauers
(moebeltiefe).

Geprüft wird jede Fassung jeder Karte (``durchgang.alle_fassungen``): Für jedes Möbel mit Kollision
und jedes begehbare Feld, das in seinem Bild liegt und unterhalb seiner Grundlinie (also vor ihm),
muss die Figur tiefer liegen als das Möbel. Sonst ein Befund, und zwar „Tür“, wenn das Feld neben
einem Übergang liegt (Ankunft nach dem Hinausgehen).

Aufruf: ``python -m pipeline.abenteuer.tiefenordnung [--ort KENNUNG]``; Rückgabe 1 bei Befunden.
Dauertest: pipeline/tests/test_abenteuer_tiefenordnung.py. Abhängigkeiten: kartenbau, durchgang,
uebergaenge, moebelliste.
"""

import sys

from pipeline.abenteuer.durchgang import alle_fassungen, gesperrte_felder
from pipeline.abenteuer.kartenbau import platziere, raster

K = 16  # Kachel in Pixeln
HALB = K // 2


def grundlinie(maske: list[str] | None) -> int | None:
    """Reihe der Grundlinie: letzte ganz gesperrte Reihe, sonst letzte mit Sperre, sonst None.

    Beispiel: [".", "###", "#.#", "..."] → 1 (Veranda darunter ist begehbar).
    """
    if not maske:
        return None
    volle = [r for r, z in enumerate(maske) if z and "." not in z]
    if volle:
        return volle[-1]
    teil = [r for r, z in enumerate(maske) if "#" in z]
    return teil[-1] if teil else None


def zeichentiefe(s: dict, maske: list[str] | None) -> int:
    """Tiefe eines gesetzten Möbels wie moebeltiefe in der App (Pixel)."""
    unten = s["y"] + s["hoehe"] - HALB
    eigene = s.get("tiefe")
    if eigene is not None and eigene != unten:
        return eigene
    reihe = grundlinie(maske)
    return unten if reihe is None else min(unten, s["y"] + (reihe + 1) * K - HALB)


def befunde_der_szene(marke: str, szene: dict, katalog: dict) -> list[str]:
    """Befunde einer Fassung als „Karte: Möbel Feld (x, y): Text“."""
    gesetzt = platziere(szene, katalog)[0]
    zeilen = raster(szene)
    gesperrt = gesperrte_felder(zeilen, gesetzt, szene)
    tueren = {tuple(a["feld"]) for a in szene.get("ausloeser", []) if a.get("name") != "start"}
    befunde = []
    for s in gesetzt:
        if not s.get("kollision"):
            continue
        maske = s.get("maske") or katalog.get(s["name"], {}).get("maske")
        reihe = grundlinie(maske)
        if reihe is None:
            continue
        tiefe = zeichentiefe(s, maske)
        befunde += _vor_dem_bild(marke, s, reihe, tiefe, gesperrt, tueren)
    return befunde


def _vor_dem_bild(marke: str, s: dict, reihe: int, tiefe: int, gesperrt: set, tueren: set) -> list[str]:
    """Begehbare Felder im Bild unterhalb der Grundlinie, auf denen die Figur verdeckt wäre."""
    befunde = []
    x0, x1 = s["x"] // K, (s["x"] + s["breite"] - 1) // K
    y0, y1 = (s["y"] // K) + reihe + 1, (s["y"] + s["hoehe"] - 1) // K
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if (x, y) in gesperrt or y * K + HALB > tiefe:
                continue
            art = "Tür" if any(abs(x - a) + abs(y - b) <= 1 for a, b in tueren) else "Feld"
            befunde.append(f"{marke}: {s['name']} {art} ({x}, {y}): Figur {y * K + HALB} ≤ Tiefe {tiefe}")
    return befunde


def pruefe(ort: str | None = None) -> list[str]:
    """Alle Befunde aller Fassungen (optional nur eines Orts)."""
    from pipeline.abenteuer.moebelliste import lade_moebel
    from pipeline.abenteuer.uebergaenge import szenen

    katalog = lade_moebel()
    befunde = []
    for marke, szene in alle_fassungen(szenen()):
        if ort and szene["karte"].split(".")[0] != ort:
            continue
        befunde += befunde_der_szene(marke, szene, katalog)
    return befunde


def main() -> int:
    """Befehlszeile; Aufruf im Dateikopf."""
    ort = sys.argv[sys.argv.index("--ort") + 1] if "--ort" in sys.argv else None
    befunde = pruefe(ort)
    for b in befunde:
        print(b)
    print(f"{len(befunde)} Befunde")
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main())

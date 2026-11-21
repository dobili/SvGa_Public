"""Tierplan: welche Tiere in PixelLab neu kommen, wie groß jedes Tier im Spiel sein soll, und
korrigierte Maßstäbe für die Tierbilder, die bleiben.

Warum: Auftrag des Hauptchats (21.11.2026). Der Autor hat alle Figuren in PixelLab im Stil von
Coach Delgado neu gemacht und fragt nach den Tieren. Viele Stellen zeigen heute einen Ersatz (der
Falke als Krähe) oder nichts (Eidechse). Dazu sollen die Größen stimmen: Ein Erwachsener ist außen
20 Spielpixel hoch (PixelLab-Bogen 30 bis 31 px mal 2/3), ein Kind 14 bis 15.

Regeln:

- Zielhöhe (``zielhoehe``): echte Scheitelhöhe im Verhältnis zu 1,75 m = 20 Spielpixel, kleine Tiere
  im Chibi-Stil bis 60 % größer, große bis 10 % kleiner (``grundhoehe``). Dazu ein Zuschlag nach
  Größe (``zuschlag``, nach Prüfung im Spiel: bei 0,3 bis 0,4 verloren kleine Tiere ihre Form):
  unter 10 Spielpixeln × 1,5, darüber gleitend weniger, ab 16 nichts; mindestens 5.
- PixelLab-Tiere werden wie die Figuren mit 2/3 gezeichnet (gleiche Pixeldichte): Das Tier ist in
  der Zeichnung Zielhöhe × 1,5 hoch. Die Leinwand (``leinwand``) ist die kleinste übliche Größe, in
  die Höhe und Länge passen; sie wird nur aufgefüllt, die Größe kommt aus der Zeichnung.
- LimeZu- und Gemini-Tiere, die bleiben, bekommen ``massstab`` = Zielhöhe / gemessene Höhe
  (``GEMESSEN``: größte sichtbare Höhe der vier Standbilder im Bogen ``spiel/tiere/<art>.png``,
  gemessen am 21.11.2026 mit ``--messen``).

Aufruf: ``python -m pipeline.abenteuer.tierplan [--messen PRIVAT] [--seite PRIVAT ZIEL]``.
Dauertest: pipeline/tests/test_abenteuer_tierplan.py (Maßstäbe in tierarten.json passen zur Zielhöhe).
"""

import json
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path

from pipeline.abenteuer.tierplan_daten import ARTEN, GESCHICHTE, KEINE_TIERE, STAEMME, Art

WURZEL = Path(__file__).resolve().parents[2]
TIERARTEN = WURZEL / "app/src/abenteuer/oberwelt/tierarten.json"
SZENEN = WURZEL / "inhalte/abenteuer/szenen"
DIALOGE = WURZEL / "inhalte/abenteuer/dialoge/de"

ERWACHSENER_M = 1.75
ERWACHSENER_PX = 20  # Spielpixel außen (30 bis 31 px im Bogen × 2/3)
KIND_PX = 14
MINDESTHOEHE = 5
GRUND_MINDEST = 4  # vor dem Zuschlag: eine Maus bleibt sichtbar (4 × 1,5 = 6)
ZUSCHLAG_KLEIN_BIS = 10  # darunter × 1,5
ZUSCHLAG_KLEIN = 1.5
ZUSCHLAG_KLEIN_HOECHSTENS = 13  # so groß wie ein Tier, das mit 10 beginnt
ZUSCHLAG_MITTEL_BIS = 11  # 10 und 11 × 1,3
ZUSCHLAG_MITTEL = 1.3
ZUSCHLAG_ENDE = 16  # ab hier kein Zuschlag mehr (Pferd, Kuh, Bison, Hirsch bleiben)
CHIBI_KLEIN = 0.6  # bis 60 % größer für kleine Tiere
CHIBI_GROSS = 0.1  # bis 10 % kleiner für sehr große
GRENZE_M = 1.2  # darunter wird vergrößert, darüber verkleinert
FIGURMASSSTAB = 2 / 3  # PixelLab-Bogen → Spielpixel (wie die Figuren)
LEINWAENDE = (16, 24, 32, 40, 48, 64)  # 64 ist die Grenze für „Create animations“ (PixelLab-Doku)
FUELLUNG = 0.9  # so viel der Leinwand füllt die Zeichnung höchstens
MASSSTAB_TOLERANZ = 0.06

# Größte sichtbare Höhe der vier Standbilder im heutigen Bogen (px), gemessen 21.11.2026.
GEMESSEN: dict[str, int] = {
    "taube": 15,
    "kraehe": 18,
    "moewe": 22,
    "drohne": 4,
    "huhn": 14,
    "ente": 22,
    "gans": 22,
    "hase": 21,
    "schwein": 26,
    "ziege": 32,
    "schaf": 26,
    "bison": 36,
    "kuh": 40,
    "esel": 41,
    "hund": 27,
    "katze": 20,
    "reiher": 28,
    "reh": 28,
    "hirsch": 32,
    "lieferroboter": 20,
    "kehrroboter": 16,
    "pferd": 49,
    "schimmel": 50,
    "kojote": 25,
    "fuchs": 20,
}
# Bögen in tierarten.json ohne eigene Art in der Tabelle: gleiche Zielhöhe wie die genannte Art.
GLEICH_WIE = {"esel": "pony", "schimmel": "pferd"}


def chibi(hoehe_m: float) -> float:
    """Faktor des Chibi-Stils: klein bis +60 %, ab 2 m −10 %, dazwischen gleitend."""
    if hoehe_m < GRENZE_M:
        return 1 + CHIBI_KLEIN * min(1.0, (GRENZE_M - hoehe_m) / 1.0)
    return 1 - CHIBI_GROSS * min(1.0, (hoehe_m - GRENZE_M) / 0.8)


def _gerundet(wert: float) -> int:
    """Kaufmännisch gerundet (10,5 → 11; Pythons round rundet auf gerade Zahlen)."""
    return int(wert + 0.5)


def zuschlag(grund: int) -> int:
    """Chibi-Zuschlag nach Größe (Hauptchat nach Prüfung im Spiel, 21.11.2026): unter 10 Spielpixeln
    × 1,5 (höchstens 13, mindestens 5), 10 und 11 × 1,3, von 12 bis 15 gleitend auf × 1, ab 16 nichts.

    Warum gleitend statt „10 bis 14 × 1,3“: sonst überholen mittlere Tiere größere (Reh 18 gegen
    Pony 15, Schaf 17 so hoch wie die Kuh). Beispiel: Hund 10 → 13, Katze 7 → 11, Reh 14 → 16.
    """
    if grund < ZUSCHLAG_KLEIN_BIS:
        return max(MINDESTHOEHE, min(ZUSCHLAG_KLEIN_HOECHSTENS, _gerundet(grund * ZUSCHLAG_KLEIN)))
    if grund <= ZUSCHLAG_MITTEL_BIS:
        return _gerundet(grund * ZUSCHLAG_MITTEL)
    if grund < ZUSCHLAG_ENDE:
        anteil = (grund - ZUSCHLAG_MITTEL_BIS) / (ZUSCHLAG_ENDE - ZUSCHLAG_MITTEL_BIS)
        return _gerundet(grund * (ZUSCHLAG_MITTEL - (ZUSCHLAG_MITTEL - 1) * anteil))
    return grund


def grundhoehe(art: Art) -> int:
    """Höhe vor dem Zuschlag: echte Größe im Maß der Figuren mit dem Chibi-Faktor."""
    return max(GRUND_MINDEST, round(art.hoehe / ERWACHSENER_M * ERWACHSENER_PX * chibi(art.hoehe)))


def zielhoehe(art: Art) -> int:
    """Zielhöhe in Spielpixeln. Beispiel: Pferd 2,1 m → 22, Hund 0,7 m → 13, Maus → 6."""
    return zuschlag(grundhoehe(art))


def ziellaenge(art: Art) -> int:
    """Länge in Spielpixeln im selben Maß (für die Leinwand), mit demselben Zuschlag wie die Höhe."""
    roh = art.laenge / ERWACHSENER_M * ERWACHSENER_PX * chibi(art.hoehe)
    return max(MINDESTHOEHE, round(roh * zielhoehe(art) / grundhoehe(art)))


def leinwand(art: Art) -> int:
    """Kleinste Leinwand, in die das Tier mit 2/3 gezeichnet passt (höchstens 64).

    Beispiel: Hund (10 × 13 Spielpixel → 15 × 20 im Bogen) → 24.
    """
    noetig = max(zielhoehe(art), ziellaenge(art)) / FIGURMASSSTAB / FUELLUNG
    return next((g for g in LEINWAENDE if g >= noetig), LEINWAENDE[-1])


def art_von(name: str) -> str | None:
    """Art eines Belebungsnamens (längster Wortstamm), None für Wind, Nebel, Staubteufel."""
    klein = name.lower()
    if any(k in klein for k in KEINE_TIERE):
        return None
    treffer = [s for s in STAEMME if s in klein]
    return STAEMME[max(treffer, key=len)] if treffer else None


@dataclass
class Bestand:
    """Stellen je Art: Zahl, heutiges Bild je Stelle, Verhalten, Orte."""

    stellen: Counter = field(default_factory=Counter)
    bild: dict = field(default_factory=lambda: defaultdict(Counter))
    verhalten: dict = field(default_factory=lambda: defaultdict(Counter))
    orte: dict = field(default_factory=lambda: defaultdict(set))


def heutiges_bild(name: str, staemme: dict[str, str]) -> str | None:
    """Bild, das die App heute zeigt (Wortstämme aus tierarten.json, wie tiere.ts)."""
    klein = name.lower()
    treffer = [s for s in staemme if s in klein]
    return staemme[max(treffer, key=len)] if treffer else None


def bestand() -> Bestand:
    """Alle Tiere der Belebung in den Szenen (ohne szenen/varianten)."""
    staemme = json.loads(TIERARTEN.read_text(encoding="utf-8"))["staemme"]
    b = Bestand()
    for datei in sorted(SZENEN.glob("*.json")):
        szene = json.loads(datei.read_text(encoding="utf-8"))
        for t in szene.get("belebung") or []:
            art = art_von(t["name"]) if t.get("typ") == "tier" else None
            if not art:
                continue
            b.stellen[art] += 1
            b.bild[art][t.get("bild") or heutiges_bild(t["name"], staemme)] += 1
            b.verhalten[art][(t.get("eigenschaften") or {}).get("verhalten", "stehen")] += 1
            b.orte[art].add(szene.get("karte", "").split(".")[0])
    return b


def zustand(art: Art, bild: str | None) -> str:
    """„richtig“, „ersatz“ oder „fehlt“ für eine Stelle."""
    if bild is None:
        return "fehlt"
    return "richtig" if bild == art.limezu else "ersatz"


def inkstellen() -> dict[str, list[str]]:
    """Je Art die Ink-Dateien, in denen sie genannt wird (Dateiname je Fundzeile)."""
    funde: dict[str, list[str]] = defaultdict(list)
    for datei in sorted(DIALOGE.glob("*.ink")):
        for zeile in datei.read_text(encoding="utf-8").splitlines():
            if zeile.lstrip().startswith("//"):
                continue
            for art in ARTEN.values():
                if art.ink and re.search(art.ink, zeile):
                    funde[art.name].append(datei.stem)
    return funde


def vorrang(art: str, stellen: int) -> int:
    """1 Geschichte (``GESCHICHTE``), 2 häufig (ab 5 Stellen), 3 Rest."""
    if art in GESCHICHTE:
        return 1
    return 2 if stellen >= 5 else 3


def massstab_vorschlag(art_name: str) -> float | None:
    """Maßstab für einen bleibenden Bogen: Zielhöhe / gemessene Höhe, auf 0,05 gerundet, höchstens 1."""
    ziel_art = ARTEN.get(GLEICH_WIE.get(art_name, art_name))
    if not ziel_art or art_name not in GEMESSEN:
        return None
    # Nur verkleinern: Ein vergrößertes LimeZu-Bild würde unscharf (die Drohne bleibt 1).
    return min(1.0, round(zielhoehe(ziel_art) / GEMESSEN[art_name] * 20) / 20)


def main() -> int:
    """Befehlszeile; Aufruf im Dateikopf."""
    if "--messen" in sys.argv:
        from pipeline.abenteuer.tierplan_seite import messe

        for art, h in messe(Path(sys.argv[sys.argv.index("--messen") + 1])).items():
            print(f"{art}: {h}")
        return 0
    if "--seite" in sys.argv:
        from pipeline.abenteuer.tierplan_html import schreibe

        i = sys.argv.index("--seite")
        print(schreibe(Path(sys.argv[i + 1]), Path(sys.argv[i + 2])))
        return 0
    from pipeline.abenteuer.tierplan_seite import zeilen

    for z in zeilen():
        print(z)
    return 0


if __name__ == "__main__":
    sys.exit(main())

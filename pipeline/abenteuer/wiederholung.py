"""Wiederholung: dasselbe Bild zu oft nebeneinander (AP8a, Gutachten des Autors, 24.11.2026).

Warum: Die Gutachter fanden Straßen aus lauter gleichen Häusern, Regale mit demselben Topf viermal in
Reichweite und denselben Teppich in jedem Haus eines Orts. Das Auge erkennt gekachelte Wiederholung
sofort; die Welt wirkt dann gebaut statt gewachsen.

Regeln (Gebäude und Kleinteile je Szene, Blickfänger je Ort):
- Gebäude: dasselbe Gebäudebild (Art ``gebaeude``/``haus``) mehr als ``GEBAEUDE_HOECHSTENS``-mal auf
  einer Karte oder zweimal in derselben Reihe (gleiche Unterkante).
- Kleinteile: dasselbe kleine Teil (höchstens ``KLEIN`` px breit und hoch, nicht aus ``REIHENTEILE``)
  mehr als ``KLEIN_HOECHSTENS``-mal in Sichtweite (``SICHT`` Felder, etwa ein Handybildschirm).
- Blickfänger (``BLICKFAENGER``): dasselbe Bild in mehr als ``ORT_HOECHSTENS`` Karten eines Orts
  (Karte ohne Zustände: ``karte`` der Szene, Ort davor).
Aufruf: ``python -m pipeline.abenteuer.wiederholung [--alle]``. Dauertest mit Obergrenze in
``pipeline/tests/test_abenteuer_querschnitt.py`` (Ziel 0). Ausnahmen mit Grund in ``AUSNAHMEN``.
"""

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

from pipeline.abenteuer.kartenbau import K, platziere
from pipeline.abenteuer.moebelliste import lade_moebel

SZENEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "szenen"
GEBAEUDE = {"gebaeude", "haus"}
GEBAEUDE_HOECHSTENS = 2
KLEIN = 32  # Kartenpixel: bis zwei Kacheln breit und hoch
KLEIN_HOECHSTENS = 3
SICHT = (12, 8)  # Felder quer und hoch
ORT_HOECHSTENS = 2
# Arten, die als Reihe gebaut sind und sich wiederholen sollen (Zaun, Gleis, Boden, Pflanzen …),
# dazu Sitzgruppen: gleiche Stühle um einen Tisch, gleiche Tische im Gastraum, Spinde in der Reihe.
REIHENTEILE = {
    "zaun", "gleis", "boden", "boden_teil", "markierung", "bordstein", "feldfrucht", "blume",
    "busch", "baum", "hecke", "steg", "bruecke", "gelaender", "fenster", "teppich", "schmuck",
    "stein", "pflanze", "ware", "tribuene", "wasser", "heu", "saeule", "stuetze",
    "stuhl", "tisch", "bank", "sessel", "spind", "bett",
}  # fmt: skip
# Bezeichnung → Muster des Katalognamens. Dasselbe Bild ist dieselbe Quelle mit demselben Ausschnitt.
BLICKFAENGER = {
    "Teppich": re.compile(r"Teppich"),
    "runder Holztisch": re.compile(r"Rundtisch"),
    "grüner Schulstuhl": re.compile(r"Schulstuhl"),
}
# (Szenen- oder Ortsanfang, Möbel) → Grund.
AUSNAHMEN: dict[tuple[str, str], str] = {
    ("weg-silicon-delacroix-faehre", "mf9Rundtisch"): "Bordrestaurant der Fähre: gleiche Tische gehören dazu",
    ("cedar-creek-waschsalon", "cc4Waschmaschine"): "Waschsalon: eine Reihe gleicher Maschinen ist der Ort",
    ("ironwood-", "mf2Spind"): "Spindreihe in Umkleide und Kantine: gleiche Spinde wie im echten Werk",
    ("lockport-gasthaus", "ld8Kegelbande"): "Bande der Kegelbahn aus gleichen Stücken (Reihenteil)",
    ("silicon-bay-akademie", "sb8Glaswand"): "Glaswand aus gleichen Stücken (Reihenteil)",
    ("capital-arena-halle", "ca7Brett"): "Turniersaal: gleiche Bretter auf den Tischen sind gewollt",
    ("weg-riverton-ironwood-1", "iw5Schornstein"): "zwei gleiche Schlote einer Fabrik nebeneinander",
    ("weg-silicon-delacroix-deich", "sd6Sandsack"): "Sandsackwall am Deich aus gleichen Säcken (Reihenteil)",
    ("pinewood-camp-aussen", "ld14BlockhuetteKamin"): "Ferienlager: gleiche Blockhütten sind die Bauform (andere Hüttenbilder sind flache Frontansichten, Regel 10.71)",
    ("pinewood-camp-aussen", "ld14BlockhuetteGruen"): "Ferienlager: gleiche Blockhütten sind die Bauform (andere Hüttenbilder sind flache Frontansichten, Regel 10.71)",
    ("riverton-aussen", "rv5Reihenhaus"): "Reihenhaus: zwei gleiche Häuser Wand an Wand sind die Bauform",
    ("riverton-aussen-nachspiel", "rv5Brett"): "Nachspiel im Park: fünf Holztische mit je einem Brett erzählt die Geschichte",
}


def _bild(angabe: dict) -> str:
    """Kennung des Bildes: Quelle und Ausschnitt (zwei Katalognamen können dasselbe Bild sein)."""
    return f"{angabe.get('quelle')}#{angabe.get('ausschnitt')}"


def _ausgenommen(stelle: str, moebel: str) -> bool:
    return any(stelle.startswith(a) and moebel == m for a, m in AUSNAHMEN)


def pruefe_gebaeude(name: str, gesetzt: list[dict], katalog: dict) -> list[str]:
    """Gleiche Gebäudebilder auf einer Karte (zu oft oder in derselben Reihe)."""
    je_bild: dict[str, list[dict]] = defaultdict(list)
    for s in gesetzt:
        if katalog[s["name"]].get("art") in GEBAEUDE:
            je_bild[_bild(katalog[s["name"]])].append(s)
    befunde = []
    for stuecke in je_bild.values():
        moebel = stuecke[0]["name"]
        if _ausgenommen(name, moebel):
            continue
        if len(stuecke) > GEBAEUDE_HOECHSTENS:
            befunde.append(f"Gebäude {moebel} {len(stuecke)}-mal")
            continue
        reihen = [(s["y"] + s["hoehe"]) // K for s in stuecke]
        if len(set(reihen)) < len(reihen):
            befunde.append(f"Gebäude {moebel} zweimal in Reihe {reihen[0]}")
    return befunde


def pruefe_kleinteile(name: str, gesetzt: list[dict], katalog: dict) -> list[str]:
    """Dasselbe Kleinteil mehr als KLEIN_HOECHSTENS-mal in Sichtweite, je Teil einmal gemeldet."""
    je_bild: dict[str, list[tuple[int, int]]] = defaultdict(list)
    namen: dict[str, str] = {}
    for s in gesetzt:
        angabe = katalog[s["name"]]
        if angabe.get("art") in REIHENTEILE or s["breite"] > KLEIN or s["hoehe"] > KLEIN:
            continue
        if angabe.get("art") in GEBAEUDE or _ausgenommen(name, s["name"]):
            continue
        je_bild[_bild(angabe)].append((s["x"] // K, s["y"] // K))
        namen.setdefault(_bild(angabe), s["name"])
    befunde = []
    for bild, orte in sorted(je_bild.items()):
        for x, y in orte:
            nah = [o for o in orte if abs(o[0] - x) < SICHT[0] / 2 and abs(o[1] - y) < SICHT[1] / 2]
            if len(nah) > KLEIN_HOECHSTENS:
                befunde.append(f"{namen[bild]} {len(nah)}-mal in Sichtweite bei {(x, y)}")
                break
    return befunde


def pruefe_blickfaenger(szenen: dict[str, dict], katalog: dict) -> list[str]:
    """Blickfänger in mehr als ORT_HOECHSTENS Karten eines Orts."""
    karten: dict[tuple[str, str, str], set[str]] = defaultdict(set)
    for szene in szenen.values():
        karte = szene.get("karte", "")
        ort = karte.split(".")[0]
        for objekt in szene.get("objekte", []):
            moebel = objekt["moebel"]
            for bezeichnung, muster in BLICKFAENGER.items():
                if muster.search(moebel) and moebel in katalog and not _ausgenommen(ort, moebel):
                    karten[(ort, bezeichnung, _bild(katalog[moebel]))].add(karte)
    befunde = []
    for (ort, bezeichnung, _), menge in sorted(karten.items()):
        if len(menge) > ORT_HOECHSTENS:
            befunde.append(f"{ort}: {bezeichnung} in {len(menge)} Karten ({', '.join(sorted(menge))})")
    return befunde


def pruefe() -> list[str]:
    """Alle Befunde, je Zeile „Szene: Befund“ oder „Ort: Befund“."""
    katalog = lade_moebel()
    szenen = {p.stem: json.loads(p.read_text(encoding="utf-8")) for p in sorted(SZENEN.glob("*.json"))}
    befunde = []
    for name, szene in szenen.items():
        gesetzt, _ = platziere(szene, katalog)
        teile = pruefe_gebaeude(name, gesetzt, katalog) + pruefe_kleinteile(name, gesetzt, katalog)
        befunde += [f"{name}: {b}" for b in teile]
    return befunde + pruefe_blickfaenger(szenen, katalog)


def main() -> int:
    """Befunde drucken (``--alle``: ohne Kürzung)."""
    teile = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teile.add_argument("--alle", action="store_true", help="alle Befunde drucken")
    befunde = pruefe()
    for b in befunde if teile.parse_args().alle else befunde[:40]:
        print(b)
    print(f"{len(befunde)} Befunde")
    return 0


if __name__ == "__main__":
    sys.exit(main())

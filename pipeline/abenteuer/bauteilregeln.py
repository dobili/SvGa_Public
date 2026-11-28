"""Kollision und Zeichentiefe aus den Bauteilen eines zusammengesetzten Bildes (Regel 10.95).

Warum (Wunsch des Autors, 28.11.2026): „Bei den Gebäudeassets muss eine Erkennung drübergehen, die
die enthaltenen Komponenten zuordnet: Wand, Treppe, Fenster, Veranda, Dach usw. […] Nur mit diesem
Wissen lässt sich sinnvoll über die Kollision entscheiden.“ An der Schule (mf4Schule) waren Treppen
und Mauer vertauscht: Die gestreiften Seiten des Treppenabsatzes sind Treppen, die Vorderkante ist
eine Mauer.

Eingabe je Katalogeintrag: Bauteile mit Typ und Rahmen in Bildpixeln [x0, y0, x1, y1] (Ende
ausschließlich), in ``katalog_korrekturen/bauteile.json``, von Claude am vergrößerten Bild bestimmt
(Regel 7a: Gemini nur für Bilderzeugung). Regeln (Blick von oben-vorn):

- **Körper:** Wand oder Sockel mit einem Dach darüber (oder auf gleicher Höhe, Flachdach) ist ein
  Gebäudekörper, ebenso eine Wand ab zwei Kacheln Höhe ohne Dach (Fassade). Er sperrt seinen
  Grundriss: über die Breite der Wand vom Fuß der Wand bis eine Kachel unter die Oberkante des
  Daches (dort darf der Held hinter dem First stehen, verdeckt). Das Dach selbst sperrt nicht:
  Was seitlich übersteht (Vordach, Traufe) verdeckt nur.
- **Verdecken, nicht sperren:** dach, schornstein, markise, schild, fenster (und die obere Wand).
- **Fuß:** freistehende Wand, Sockel, Mauer, Zaun sperren nur ihren Bodenstreifen (FUSS Pixel unten);
  Geländer, Säule, Pflanze einen schmalen (FUSS_SCHMAL); Geländer, Zaun und Mauer, die hoch und
  schmal im Bild stehen, laufen in die Tiefe und sperren ganz; sonstiges die untere Hälfte.
- **Begehbar:** treppe, absatz, veranda, steg, bruecke (Bodenebene). Eine Treppe betritt man nur von
  ihrer offenen Seite (``richtung``); ihre beiden Seiten daneben sperren als Wangen. Ein Absatz oder
  eine Veranda hat links, rechts und vorn eine Mauer, wo keine Treppe anschließt.
- **Tür:** Zugang, frei von der Schwelle bis zum Fuß des Körpers.
- **Sortierlinie:** Fuß des Körpers; ohne Körper die Unterkante der Sperre. Begehbare Teile über der
  Linie sind ``boden_bereiche`` (der Held steht dort auf dem Bild, nicht dahinter). Ohne jede Sperre
  über begehbarem Grund: ``ebene: "boden"``.

Aufruf: ``python -m pipeline.abenteuer.bauteilregeln NAME … [--schreiben]`` zeigt (und schreibt) die
abgeleiteten Katalogfelder; Bögen für die ganze Liste in ``bauteil_bogen.py``.
"""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass, field
from pathlib import Path

from pipeline.abenteuer.kollisionfein import ZP, K
from pipeline.abenteuer.moebelliste import ORDNER

Zelle = tuple[int, int]
Rahmen = list[int]
KORREKTUREN = ORDNER.parent / "katalog_korrekturen"
HANDDATEI = KORREKTUREN / "bauteile.json"
TYPEN = {
    "dach", "wand", "sockel", "fenster", "tuer", "treppe", "absatz", "veranda", "gelaender", "saeule",
    "markise", "schild", "schornstein", "zaun", "mauer", "pflanze", "steg", "bruecke", "sonstiges",
}  # fmt: skip
VERDECKEN = {"dach", "schornstein", "markise", "schild", "fenster", "tuer"}
KOERPERWAND = {"wand", "sockel"}
FUSSTEILE = {"wand", "sockel", "mauer", "zaun"}
SCHMAL = {"gelaender", "saeule", "pflanze"}
LINIENTEILE = {"gelaender", "zaun", "mauer"}  # hoch und schmal im Bild: läuft in die Tiefe
BEGEHBAR = {"treppe", "absatz", "veranda", "steg", "bruecke"}
PODEST = {"absatz", "veranda"}
FUSS = 8  # Bodenstreifen einer Wand oder Mauer (Pixel)
FUSS_SCHMAL = 4  # Fuß einer Säule, eines Geländers, eines Kübels
SONSTIGES_HOECHSTENS = 16  # sonstiges sperrt die untere Hälfte, höchstens eine Kachel
HOHE_WAND = 2 * K  # eine Wand ab zwei Kacheln Höhe ist Fassade eines Körpers
RUECKEN = K  # hinter dem First: eine Kachel, in der der Held verdeckt steht
SCHWELLE = ZP  # die Tür ist ab einer Zelle über ihrer Unterkante Zugang
NAEHE = ZP  # Teile berühren sich, wenn sie höchstens eine Zelle auseinander liegen
LINIE_VERHAELTNIS = 2  # Höhe ≥ 2 × Breite: Geländer oder Zaun in die Tiefe
GEGENSEITE = {"unten": "oben", "oben": "unten", "links": "rechts", "rechts": "links"}
QUER, LAENGS = ("links", "rechts"), ("oben", "unten")
NACHBARSEITEN = {"unten": QUER, "oben": QUER, "links": LAENGS, "rechts": LAENGS}


@dataclass
class Ableitung:
    """Das Ergebnis der Regeln für ein Bild (Zellen von ZP × ZP Pixeln, Pixel ab oben links)."""

    sperre: set[Zelle] = field(default_factory=set)
    boden: set[Zelle] = field(default_factory=set)
    sortierlinie: int | None = None
    ebene: str | None = None
    boden_bereiche: list[Rahmen] = field(default_factory=list)
    zugaenge: list[Rahmen] = field(default_factory=list)
    koerper: list[Rahmen] = field(default_factory=list)


def lade_json(pfad: Path) -> dict:
    """Eine Bauteildatei (Name → {"bauteile": […], "geprueft": …}) oder leer, wenn sie fehlt."""
    return json.loads(pfad.read_text(encoding="utf-8")) if pfad.is_file() else {}


def lade_bauteile(hand: Path = HANDDATEI) -> dict[str, dict]:
    """Alle Bauteillisten aus bauteile.json, von Claude am Bild bestimmt (Regel 7a: kein Gemini).

    Beispiel: mf4Schule → Absatz mit zwei Seitentreppen und Mauer an der Vorderkante.
    """
    return lade_json(hand)


def zellen(rahmen: Rahmen) -> set[Zelle]:
    """Die Zellen, deren Mitte im Rahmen [x0, y0, x1, y1) liegt. Beispiel: [0, 0, 8, 4] → {(0,0), (1,0)}."""
    x0, y0, x1, y1 = rahmen
    return {
        (x, y)
        for y in range(y0 // ZP, -(-y1 // ZP))
        for x in range(x0 // ZP, -(-x1 // ZP))
        if x0 <= x * ZP + ZP / 2 < x1 and y0 <= y * ZP + ZP / 2 < y1
    }


def unten(rahmen: Rahmen, hoehe: int) -> Rahmen:
    """Der Streifen der Höhe ``hoehe`` am unteren Rand (mindestens eine Zelle, nie höher als der Rahmen)."""
    x0, y0, x1, y1 = rahmen
    return [x0, max(y0, y1 - max(hoehe, ZP)), x1, y1]


def rand(rahmen: Rahmen, seite: str) -> Rahmen:
    """Der Rand (eine Zelle breit) auf einer Seite. Beispiel: links von [8,0,40,16] → [8,0,12,16]."""
    x0, y0, x1, y1 = rahmen
    return {
        "links": [x0, y0, x0 + ZP, y1],
        "rechts": [x1 - ZP, y0, x1, y1],
        "oben": [x0, y0, x1, y0 + ZP],
        "unten": [x0, y1 - ZP, x1, y1],
    }[seite]


def beruehrt(a: Rahmen, b: Rahmen, abstand: int = NAEHE) -> bool:
    """Ob zwei Rahmen sich überlappen oder höchstens ``abstand`` Pixel auseinander liegen."""
    return a[0] - abstand < b[2] and b[0] - abstand < a[2] and a[1] - abstand < b[3] and b[1] - abstand < a[3]


def koerper(teile: list[dict]) -> list[Rahmen]:
    """Die Grundrisse der Gebäudekörper, vom Fuß der Wand bis RUECKEN unter die Oberkante.

    Warum: Im Blick von oben-vorn liegt der Grundriss hinter der Fassade unter dem Dach; dort darf
    niemand hin. Körper ist eine Wand (oder ein Sockel) mit einem Dach, das auf ihrer Höhe oder
    darüber beginnt, oder eine hohe Wand (ab HOHE_WAND, Fassade mit Flachdach ohne eigenes Dach).
    Übereinander liegende Körper verschmelzen (gestapelte Wandstücke eines Stadthauses).
    Beispiel Schule: Wand [8,196,376,330], Dach ab 2 → [8,18,376,330]; der Sockel darunter
    [8,322,376,336] hängt an der Wand → Fuß 336.
    """
    daecher = [t["rahmen"] for t in teile if t["typ"] == "dach"]
    waende = [t["rahmen"] for t in teile if t["typ"] in KOERPERWAND]
    grund: list[Rahmen] = []
    for w in waende:
        ueber = [d for d in daecher if d[0] < w[2] and w[0] < d[2] and d[1] <= w[1] and d[3] >= w[1] - K]
        if ueber:
            oben = min(d[1] for d in ueber) + RUECKEN
            grund.append([w[0], min(oben, w[3] - ZP), w[2], w[3]])
        elif w[3] - w[1] >= HOHE_WAND:
            grund.append([w[0], min(w[1] + RUECKEN, w[3] - ZP), w[2], w[3]])
    for w in waende:  # Sockel und Wandstücke direkt unter einem Körper gehören dazu
        for g in grund:
            if w[0] < g[2] and g[0] < w[2] and w[1] <= g[3] + NAEHE and w[3] > g[3]:
                g[3] = w[3]
    return _verschmelzen(grund)


def _verschmelzen(grund: list[Rahmen]) -> list[Rahmen]:
    """Körper, die sich überlappen oder höchstens RUECKEN übereinander liegen, als ein Rahmen."""
    fertig: list[Rahmen] = []
    for g in sorted(grund, key=lambda r: r[1]):
        for f in fertig:
            if g[0] < f[2] and f[0] < g[2] and g[1] <= f[3] + RUECKEN and f[1] <= g[3] + RUECKEN:
                f[:] = [min(f[0], g[0]), min(f[1], g[1]), max(f[2], g[2]), max(f[3], g[3])]
                break
        else:
            fertig.append(list(g))
    return fertig


def fussrahmen(teil: dict) -> Rahmen | None:
    """Der sperrende Teil eines freistehenden Bauteils (Fuß), oder None, wenn es nicht sperrt."""
    typ, r = teil["typ"], teil["rahmen"]
    breite, hoehe = r[2] - r[0], r[3] - r[1]
    if typ in LINIENTEILE and hoehe >= LINIE_VERHAELTNIS * breite:
        return list(r)
    if typ in FUSSTEILE:
        return unten(r, FUSS)
    if typ in SCHMAL:
        return unten(r, FUSS_SCHMAL)
    if typ == "sonstiges":
        return unten(r, min(hoehe // 2, SONSTIGES_HOECHSTENS))
    return None


def richtung(treppe: dict, teile: list[dict]) -> str:
    """Offene Seite einer Treppe: angegeben, sonst gegenüber dem Absatz oder der Tür, an der sie hängt.

    Beispiel: Treppe links an einem Absatz (Absatz rechts von ihr) → „links“. Sonst „unten“.
    """
    if treppe.get("richtung") in GEGENSEITE:
        return treppe["richtung"]
    r = treppe["rahmen"]
    for t in teile:
        if t is treppe or t["typ"] not in PODEST | {"tuer", "wand", "sockel"} or not beruehrt(r, t["rahmen"]):
            continue
        a = t["rahmen"]
        if a[0] >= r[2] - NAEHE:
            return "links"
        if a[2] <= r[0] + NAEHE:
            return "rechts"
        if a[3] <= r[1] + NAEHE or a[1] < r[1]:
            return "unten"
    return "unten"


def liegt_an(a: Rahmen, b: Rahmen, seite: str) -> bool:
    """Ob b auf dieser Seite von a anschließt (berührt, außen davor, mit Überlappung längs der Kante).

    Beispiel: Absatz [112,324,272,352], Treppe [98,324,112,362] → links ja, unten nein.
    """
    if not beruehrt(a, b) or _innen(b, a) or _innen(a, b):
        return False
    return {
        "links": b[0] < a[0] and b[2] <= a[0] + NAEHE,
        "rechts": b[2] > a[2] and b[0] >= a[2] - NAEHE,
        "oben": b[1] < a[1] and b[3] <= a[1] + NAEHE,
        "unten": b[3] > a[3] and b[1] >= a[3] - NAEHE,
    }[seite]


def kanten(teile: list[dict]) -> set[Zelle]:
    """Wangen der Treppen und Mauern der Absätze (Seiten ohne anschließende Treppe), als Zellen."""
    treppen = [t["rahmen"] for t in teile if t["typ"] == "treppe"]
    begehbar = [t["rahmen"] for t in teile if t["typ"] in BEGEHBAR]
    gesperrt: set[Zelle] = set()
    stufen = {z for r in treppen for z in zellen(r)}
    for t in (t for t in teile if t["typ"] == "treppe"):
        for seite in NACHBARSEITEN[richtung(t, teile)]:
            if not any(liegt_an(t["rahmen"], b, seite) for b in begehbar):
                gesperrt |= zellen(rand(t["rahmen"], seite))
    for p in (t["rahmen"] for t in teile if t["typ"] in PODEST):
        for seite in ("links", "rechts", "unten"):
            if not any(liegt_an(p, s, seite) for s in treppen):
                gesperrt |= zellen(rand(p, seite)) - stufen  # eine Treppe im Absatz bleibt offen
    return gesperrt


def _innen(a: Rahmen, b: Rahmen) -> bool:
    """Ob a ganz in b liegt (dann ist a kein Nachbar von b, etwa ein Absatz, der die Treppe enthält)."""
    return b[0] <= a[0] and b[1] <= a[1] and a[2] <= b[2] and a[3] <= b[3]


def zugaenge(teile: list[dict], grund: list[Rahmen]) -> list[Rahmen]:
    """Je Tür im Körper der Zugang: Türbreite, von der Schwelle bis zum Fuß des Körpers."""
    aus = []
    for t in (t for t in teile if t["typ"] == "tuer"):
        x0, _, x1, y1 = t["rahmen"]
        for g in grund:
            if g[0] < x1 and x0 < g[2] and g[1] < y1 <= g[3] + NAEHE:
                aus.append([x0, y1 - SCHWELLE, x1, max(y1, g[3])])
    return aus


def ableiten(teile: list[dict]) -> Ableitung:
    """Sperre, Boden, Sortierlinie und Bodenbereiche aus den Bauteilen (Regeln im Dateikopf).

    Eingabe: Bauteile wie in bauteile.json. Ausgabe: ``Ableitung``.
    Beispiel Schule: Körper bis Pixel 336 sperrt, Seitentreppen des Absatzes begehbar, die
    Vorderkante (Mauer) sperrt, Sortierlinie 336. Sonderfall: nur Steg und Geländer → Bodenebene.
    """
    teile = [t for t in teile if t.get("typ") in TYPEN and len(t.get("rahmen", [])) == 4]
    erg = Ableitung(koerper=koerper(teile))
    for g in erg.koerper:
        erg.sperre |= zellen(g)
    for t in teile:
        if (
            t["typ"] not in SCHMAL
            and (f := fussrahmen(t))
            and not any(_innen(t["rahmen"], g) for g in erg.koerper)
        ):
            erg.sperre |= zellen(f)
    for t in (t for t in teile if t["typ"] in BEGEHBAR):
        erg.boden |= zellen(t["rahmen"])
    erg.sperre -= erg.boden
    erg.sperre |= kanten(teile)
    for t in (t for t in teile if t["typ"] in SCHMAL):
        erg.sperre |= zellen(fussrahmen(t) or t["rahmen"])
    erg.zugaenge = zugaenge(teile, erg.koerper)
    for z in erg.zugaenge:
        erg.sperre -= zellen(z)
    erg.boden -= erg.sperre
    _linie(erg, teile)
    return erg


def _linie(erg: Ableitung, teile: list[dict]) -> None:
    """Sortierlinie, Bodenbereiche und Bodenebene (Regeln im Dateikopf)."""
    if erg.koerper:
        erg.sortierlinie = max(g[3] for g in erg.koerper)
    elif erg.sperre and not (erg.boden and all(t["typ"] in BEGEHBAR | SCHMAL | LINIENTEILE for t in teile)):
        erg.sortierlinie = (max(y for _, y in erg.sperre) + 1) * ZP
    elif erg.boden:
        erg.ebene = "boden"
        return
    linie = erg.sortierlinie or 0
    for t in (t for t in teile if t["typ"] in BEGEHBAR):
        x0, y0, x1, y1 = t["rahmen"]
        if y0 < linie:
            erg.boden_bereiche.append([x0, y0, x1, min(y1, linie)])


def pixelklassen(erg: Ableitung, alpha: bytes, breite: int, hoehe: int, deckend: int = 200) -> list[str]:
    """Je Pixelreihe ein Text: „s“ Sperre, „v“ Held davor oder darauf, „h“ verdeckt, „.“ durchsichtig."""
    reihen = []
    linie = erg.sortierlinie if erg.sortierlinie is not None else hoehe
    for y in range(hoehe):
        zeile = []
        for x in range(breite):
            zelle = (x // ZP, y // ZP)
            if alpha[y * breite + x] <= deckend:
                zeile.append(".")
            elif zelle in erg.sperre:
                zeile.append("s")
            elif erg.ebene == "boden" or zelle in erg.boden or y >= linie:
                zeile.append("v")
            else:
                zeile.append("h")
        reihen.append("".join(zeile))
    return reihen


def katalogfelder(erg: Ableitung, breite: int, hoehe: int, quelle: str) -> dict:
    """Die Katalogfelder aus der Ableitung: maske_fein (mit Grund), sortierlinie, ebene, boden_bereiche.

    Beispiel: Schule → {"maske_fein": […], "maske_fein_von_hand": "Bauteile (…)", "sortierlinie": 336}.
    """
    from pipeline.abenteuer.konturkollision import feine_maske

    felder: dict = {
        "maske_fein": feine_maske(erg.sperre, breite, hoehe),
        "maske_fein_von_hand": f"Bauteile (bauteilregeln.py, Regel 10.95): {quelle}",
    }
    if erg.ebene:
        felder["ebene"] = erg.ebene
    if erg.sortierlinie is not None:
        felder["sortierlinie"] = erg.sortierlinie
    if erg.boden_bereiche:
        felder["boden_bereiche"] = erg.boden_bereiche
    return felder


def schreibe(namen: list[str], bauteile: dict[str, dict], moebel: dict[str, dict]) -> int:
    """Schreibt die abgeleiteten Felder der genannten Einträge in den Katalog (katalogfeld.setze)."""
    from pipeline.abenteuer.katalogfeld import setze
    from pipeline.abenteuer.moebelliste import moebeldateien

    zahl = 0
    for datei in moebeldateien():
        text = neu = datei.read_text(encoding="utf-8")
        for name in set(namen) & set(json.loads(text)["moebel"]):
            a = moebel[name]
            felder = katalogfelder(
                ableiten(bauteile[name]["bauteile"]),
                a["breite"],
                a["hoehe"],
                bauteile[name].get("geprueft", ""),
            )
            for feld_name, wert in felder.items():
                neu = setze(neu, name, feld_name, wert)
            zahl += 1
        if neu != text:
            json.loads(neu)  # bricht ab, statt eine kaputte Datei zu schreiben
            datei.write_text(neu, encoding="utf-8")
    return zahl


def main(argv: list[str] | None = None) -> int:
    """Befehlszeile: abgeleitete Felder zeigen, mit ``--schreiben`` in den Katalog schreiben."""
    from pipeline.abenteuer.moebelliste import lade_moebel

    teil = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teil.add_argument("namen", nargs="+")
    teil.add_argument("--schreiben", action="store_true", help="Felder in den Katalog schreiben")
    args = teil.parse_args(argv)
    bauteile, moebel = lade_bauteile(), lade_moebel()
    fehlend = [n for n in args.namen if n not in bauteile or n not in moebel]
    if fehlend:
        print("Ohne Bauteile oder nicht im Katalog:", ", ".join(fehlend))
        return 1
    for name in args.namen:
        erg = ableiten(bauteile[name]["bauteile"])
        print(
            f"{name}: Sortierlinie {erg.sortierlinie}, Ebene {erg.ebene}, {len(erg.sperre)} Sperrzellen, "
            f"Zugänge {erg.zugaenge}, Bodenbereiche {erg.boden_bereiche}"
        )
    if args.schreiben:
        print(f"{schreibe(args.namen, bauteile, moebel)} Einträge geschrieben")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

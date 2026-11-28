"""Kollision und Zeichentiefe nach der Kontur der Bilder: Vorschläge je Katalogeintrag.

Warum (Auftrag des Autors, 28.11.2026): „Die Kollision der Objekte in allen Karten möglichst genau an
ihre Konturen anpassen. […] Die Assets in der Bibliothek pixelweise beurteilen, ob der Held vor oder
hinter dem Pixel sein darf oder nichts von beiden.“ Beispiele des Autors: hinter der Lehne eines
Stuhls darf der Held entlanglaufen, hinter der Sitzfläche nicht; an der Laterne sperrt nur der
Sockel; die Treppe zum Dachboden liegt unter dem Helden, wenn er sie betritt.

Modell je Katalogeintrag (KARTENREGELN 10.95), drei Angaben im Bild des Katalogs:

- **Sperre** (`maske_fein`, Zellen von 4 × 4 Pixeln, feinmasken.py): wo der Held mit den Füßen
  nicht stehen darf (Sitzfläche und Beine, Sockel, Stamm, Fuß der Mauer). Pixel darin: „weder vor
  noch hinter“ (rot auf dem Bogen).
- **Sortierlinie** (`sortierlinie`, Pixel ab der Oberkante des Bildes): Steht der Fuß des Helden
  darunter, wird er vor dem Bild gezeichnet, darüber dahinter. Ohne Angabe gilt die alte Regel der
  App (oberwelt/zeichentiefe.ts: Mitte der letzten ganz gesperrten Kachelreihe der groben Maske,
  sonst Bildunterkante minus eine halbe Kachel). Deckende Pixel über der Linie verdecken den
  Helden, wenn er dahinter steht (gelb), Pixel darunter liegen unter ihm (grün).
- **Bodenebene** (`ebene: "boden"`): Das ganze Bild liegt unter den Figuren (Treppe, Steg, Brücke,
  Fußmatte); die Sperre (Holme, Geländer) bleibt. Alle deckenden Pixel außerhalb der Sperre grün.

Befunde je Eintrag (nur Vorschläge, nichts ändert sich ohne ``--schreiben``): „Linie zu tief/hoch“
(alte Linie mehr als 6 Pixel unter bzw. über dem Fuß der Sperre; Vorschlag: Unterkante der Sperre),
„Boden“ (Treppe, Steg, Brücke, Matte mit Kollision ohne `ebene: "boden"`, etwa die Dachbodentreppe)
und „von Hand“ (Gebäude mit begehbaren Reihen im Bild wie Vortreppe oder Veranda).

Aufruf: ``python -m pipeline.abenteuer.konturkollision [--alle] [--ort mapleFalls] [--schreiben]
[--boegen ORDNER]``. Vorschläge nach ``inhalte/abenteuer/katalog_korrekturen/kontur.json``; Bögen
nur lokal (Paketbilder), etwa ``buch/arbeit/kontur/``.
"""

import argparse
import json
import re
from dataclasses import dataclass, field
from pathlib import Path

from pipeline.abenteuer.feinmasken import (
    DECKEND,
    FELD_HAND,
    alpha_von,
    alte_zellen,
    genutzte_moebel,
)
from pipeline.abenteuer.kollisionfein import ZP, K, Z
from pipeline.abenteuer.konturkollision_arten import artbefund, automatisch
from pipeline.abenteuer.konturkollision_sitz import sitzflaeche
from pipeline.abenteuer.moebelliste import ORDNER, lade_moebel

Zelle = tuple[int, int]
KONTURDATEI = ORDNER.parent / "katalog_korrekturen" / "kontur.json"
# Von Hand gezeichnete Sperren (Rechtecke in Pixeln des Katalogbilds, Ende ausschließlich) mit Grund.
HANDDATEI = ORDNER.parent / "katalog_korrekturen" / "kontur_hand.json"
SZENEN = ORDNER.parent / "szenen"
# Halbe Höhe des Heldenkörpers (12 Pixel, oberwelt/heldtiefe.ts KOERPER_HALB).
KOERPER_HALB = 6
BODEN = "boden"
# Arten und Namensteile, die man betritt: Das Bild liegt unter den Figuren.
BODEN_ARTEN = {"treppe", "steg", "bruecke", "fussmatte", "matte", "teppich", "boden", "boden_teil"}
BODEN_NAMEN = ("treppe", "stufen", "steg", "bruecke", "fussmatte")
# Diese Namen gehören zu keinem Bodenteil (Treppenloch, Geländer an der Treppe, Poller am Steg).
KEIN_BODEN = ("loch", "gelaender", "schacht", "haus", "turm", "poller", "kiste")
GEBAEUDE = {"gebaeude", "haus", "kiosk", "turm"}
# Sitzmöbel: Sitzfläche und Beine sperren ganz, die Lehne nicht (Beispiel des Autors, 28.11.2026).
SITZ_ARTEN = {"stuhl", "hocker", "sessel", "bank", "sofa"}
HAND_GRUND = "Kontur (konturkollision.py, 28.11.2026): Sitzfläche und Beine ganz, Lehne frei"


@dataclass
class Kontur:
    """Vorschlag für einen Katalogeintrag (Pixel im ungeformten Katalogbild)."""

    name: str
    sperre: set[Zelle]
    linie_alt: int
    sortierlinie: int | None = None
    ebene: str | None = None
    befunde: list[str] = field(default_factory=list)
    neue_sperre: bool = False  # die Sperre ist neu (Sitzfläche, von Hand), nicht die des Katalogs
    flach: bool = False  # ohne Kollision: der Kartenbau legt das Bild unter alle Figuren
    kollision: bool | None = None  # von Hand: Bild ohne Kollision bekommt eine (Felsbogen, Boot an Land)
    teilbereiche: list[dict] | None = None  # Teile mit eigener Tiefe (Veranda), nur von Hand
    breite: int = K
    hoehe: int = K
    grund: str = HAND_GRUND

    @property
    def linie(self) -> int:
        """Die wirksame Sortierlinie: der Vorschlag, sonst die alte."""
        return self.linie_alt if self.sortierlinie is None else self.sortierlinie


def alte_linie(angabe: dict) -> int:
    """Sortierlinie, wie die App sie heute ohne `sortierlinie` rechnet (zeichentiefe.ts).

    Mit grober Katalogmaske: Mitte der letzten ganz gesperrten Reihe, sonst der letzten Reihe mit
    einer Sperre; ohne Maske Bildunterkante minus halbe Kachel (die feine Maske zählt dort nicht).
    Beispiel: Laterne 16 × 64 ohne `maske` → 56; Whitlock-Haus, Reihe 9 ganz gesperrt → 152.
    """
    unten = angabe["hoehe"] - K // 2
    maske = angabe.get("maske")
    if not maske:
        return unten
    volle = [r for r, z in enumerate(maske) if z and "." not in z]
    teils = [r for r, z in enumerate(maske) if "#" in z]
    reihe = (volle or teils or [None])[-1]
    return unten if reihe is None else min(unten, (reihe + 1) * K - K // 2)


def sperrzellen_des_katalogs(angabe: dict) -> set[Zelle]:
    """Die gesperrten Zellen des Eintrags: feine Maske, sonst grobe Regel; ohne Kollision leer."""
    if not angabe.get("kollision"):
        return set()
    fein = angabe.get("maske_fein")
    if fein:
        return {(x, y) for y, z in enumerate(fein) for x, c in enumerate(z) if c == "#"}
    return alte_zellen(angabe)


def ist_boden(name: str, angabe: dict) -> bool:
    """Ob das Bild etwas ist, das man betritt (Treppe, Steg, Brücke, Matte).

    Beispiel: „treppeZumBetrachter“ (Art treppe) → True; „mf15TreppeLochZimmer“ → False (Loch).
    """
    klein = name.lower()
    if any(t in klein for t in KEIN_BODEN) or angabe.get("art") in GEBAEUDE:
        return False
    return angabe.get("art") in BODEN_ARTEN or any(t in klein for t in BODEN_NAMEN)


def linienbefund(sperre: set[Zelle], alt: int) -> tuple[int | None, str | None]:
    """Vorschlag der Sortierlinie und Befund, wenn die alte Linie nicht zur Sperre passt.

    Beispiel: Sperre in den Pixelreihen 16 bis 24, alte Linie 56 → (24, „Linie zu tief …“).
    """
    if not sperre:
        return None, None
    oben = min(y for _, y in sperre) * ZP
    fuss = (max(y for _, y in sperre) + 1) * ZP
    if alt > fuss + KOERPER_HALB:
        return fuss, f"Linie zu tief: {alt} statt {fuss} (Fuß der Sperre)"
    if alt <= oben - KOERPER_HALB:
        return fuss, f"Linie zu hoch: {alt} über der Sperre ab {oben}"
    return None, None


def feine_maske(zellen: set[Zelle], breite: int, hoehe: int) -> list[str]:
    """Zellen als ``maske_fein`` im Raster der ganzen Kacheln (wie feinmasken.py: Zellen in einer
    angefangenen Kachel rechts oder unten fallen weg).

    Beispiel: {(0, 4), (1, 4)} bei 16 × 32 → ["....", "....", "....", "....", "##..", …].
    """
    spalten, reihen = max(1, breite // K) * Z, max(1, hoehe // K) * Z
    return ["".join("#" if (x, y) in zellen else "." for x in range(spalten)) for y in range(reihen)]


def zellen_der_rechtecke(rechtecke: list[list[int]]) -> set[Zelle]:
    """Die Zellen, deren Mitte in einem der Rechtecke [x0, y0, x1, y1) liegt.

    Beispiel: [[0, 0, 8, 4]] → {(0, 0), (1, 0)}.
    """
    zellen: set[Zelle] = set()
    for x0, y0, x1, y1 in rechtecke:
        for y in range(y0 // ZP, -(-y1 // ZP)):
            for x in range(x0 // ZP, -(-x1 // ZP)):
                mx, my = x * ZP + ZP / 2, y * ZP + ZP / 2
                if x0 <= mx < x1 and y0 <= my < y1:
                    zellen.add((x, y))
    return zellen


def lade_hand(pfad: Path = HANDDATEI) -> dict[str, dict]:
    """Die Handangaben (Name → {"sperre": [[x0, y0, x1, y1], …], "grund": Text}) oder leer. Mit
    "szenen" gilt die Sperre nur an der Stelle in diesen Szenen (dort als ``maske_fein`` am Objekt),
    der Katalog bleibt (Fahnenmast: derselbe Mast steht auch anderswo)."""
    return json.loads(pfad.read_text(encoding="utf-8")) if pfad.is_file() else {}


def handkontur(kontur: Kontur, hand: dict, angabe: dict) -> Kontur:
    """Vorschlag aus einer Handangabe: Sperre aus Rechtecken, dazu wahlweise ``kollision`` (true für
    ein Bild ohne Kollision), ``sortierlinie`` und ``ebene``; Befund nur, wo der Katalog abweicht.
    Beispiel: Felsbogen ohne Kollision, Sperre an den Pfeilerfüßen → kollision true, maske_fein."""
    neu = zellen_der_rechtecke(hand.get("sperre", []))
    felder = {f: hand[f] for f in ("kollision", "sortierlinie", "ebene", "teilbereiche") if f in hand}
    if neu != kontur.sperre or any(angabe.get(f) != w for f, w in felder.items()):
        if neu or "sperre" in hand:  # leere Liste: Bild mit Kollision, aber ohne Sperre
            kontur.sperre, kontur.neue_sperre = neu, True
        kontur.grund = hand["grund"]
        kontur.kollision, kontur.ebene = felder.get("kollision"), felder.get("ebene")
        kontur.sortierlinie, kontur.teilbereiche = felder.get("sortierlinie"), felder.get("teilbereiche")
        if kontur.sortierlinie is None and neu and angabe.get("art") not in GEBAEUDE:
            kontur.sortierlinie = mittellinie(neu)  # Möbel: Mitte der Sperre (Fuß), Gebäude: Maske
        kontur.befunde.append(f"von Hand: Kontur aus {len(hand.get('sperre', []))} Rechtecken")
    return kontur


def sitzbefund(name: str, angabe: dict, alpha: bytes) -> set[Zelle] | None:
    """Neue Sperre für ein Sitzmöbel, wenn die Sitzfläche bisher nicht ganz sperrt; sonst None."""
    if angabe.get("art") not in SITZ_ARTEN or not angabe.get("kollision") or FELD_HAND in angabe:
        return None
    flach = angabe.get("art") == "bank" and not any(t in name.lower() for t in ("hinten", "ruecken"))
    neu = sitzflaeche(alpha, angabe["breite"], angabe["hoehe"], flach)
    alt = sperrzellen_des_katalogs(angabe)
    spalten, reihen = max(1, angabe["breite"] // K) * Z, max(1, angabe["hoehe"] // K) * Z
    if any(x >= spalten or y >= reihen for x, y in neu):
        return None  # Bild nicht im Kachelraster (Schaukelstuhl 13 × 26): von Hand
    if not neu or neu <= alt or len(neu - alt) < 2:
        return None
    return neu


def mittellinie(sperre: set[Zelle]) -> int:
    """Sortierlinie in der Mitte der Sperre (Pixel). Warum: Jede Linie zwischen Ober- und Unterkante
    der Sperre ordnet davor und dahinter richtig; die Mitte lässt Nachbarn (Stuhl am Tisch) am
    wenigsten über Kreuz liegen (heldtiefe.karten.test.ts, Widersprüche). Beispiel: Zellreihen 2
    bis 5 (Pixel 8 bis 24) → 16."""
    oben = min(y for _, y in sperre) * ZP
    fuss = (max(y for _, y in sperre) + 1) * ZP
    return (oben + fuss) // 2


def hat_begehbare_reihen(angabe: dict) -> bool:
    """Ob ein Gebäude unter seiner letzten ganz gesperrten Reihe freie Kacheln im Bild hat."""
    maske = angabe.get("maske") or []
    volle = [r for r, z in enumerate(maske) if z and "." not in z]
    return bool(volle) and any("." in z for z in maske[volle[-1] + 1 :]) or "frei_unten" in angabe


def vorschlag(name: str, angabe: dict, alpha: bytes | None = None) -> Kontur:
    """Der Vorschlag für einen Eintrag. Ohne Bild kommen Sperre und Linien aus dem Katalog; mit
    Bild (Alphakanal) prüft er dazu die Sitzfläche von Sitzmöbeln (``sitzbefund``).

    Beispiel: treppeZumBetrachter (Holme sperren, Art treppe) → ebene „boden“, Befund „Boden“.
    """
    sperre = sperrzellen_des_katalogs(angabe)
    kontur = Kontur(name, sperre, alte_linie(angabe), flach=not angabe.get("kollision"))
    kontur.breite, kontur.hoehe = angabe["breite"], angabe["hoehe"]
    hand = lade_hand().get(name)
    if hand and hand.get("szenen"):  # nur an der Stelle in diesen Szenen (``maske_fein`` am Objekt)
        kontur.befunde.append(f"von Hand: an der Stelle in {', '.join(hand['szenen'])}")
        return kontur
    if hand:
        return handkontur(kontur, hand, angabe)

    sitz = sitzbefund(name, angabe, alpha) if alpha is not None else None
    if sitz:
        kontur.sperre, kontur.neue_sperre = sitz, True
        kontur.sortierlinie = mittellinie(sitz)
        kontur.befunde.append(f"Sitzfläche: {len(sitz - sperre)} Zellen mehr, Lehne frei")
        return kontur
    art = artbefund(name, angabe, alpha, sperre) if alpha is not None and automatisch(angabe) else None
    if art:
        kontur.sperre, kontur.neue_sperre, kontur.grund = art.sperre, True, art.grund
        if "sortierlinie" not in angabe:
            kontur.sortierlinie = art.linie or linienbefund(art.sperre, kontur.linie_alt)[0]
        kontur.befunde.append(art.befund)
        return kontur
    if ist_boden(name, angabe):
        if angabe.get("kollision") and angabe.get("ebene") != BODEN:
            kontur.ebene = BODEN
            kontur.befunde.append("Boden: wird betreten, liegt aber über dem Helden")
        return kontur
    if angabe.get("art") in GEBAEUDE or angabe.get("tuer"):
        if hat_begehbare_reihen(angabe):
            kontur.befunde.append("von Hand: begehbare Reihen im Gebäudebild (Vortreppe, Veranda)")
        return kontur
    if "sortierlinie" in angabe:
        return kontur
    kontur.sortierlinie, befund = linienbefund(sperre, kontur.linie_alt)
    if befund:
        kontur.befunde.append(befund)
    return kontur


def pixelklassen(kontur: Kontur, alpha: bytes, breite: int, hoehe: int) -> list[list[str]]:
    """Je Pixel die Klasse: „s“ Sperre, „h“ Held dahinter (verdeckt ihn), „v“ Held davor oder
    darauf, „.“ durchsichtig. Beispiel: Laterne → Sockel „s“, Mast und Kopf „h“."""
    klassen = []
    for y in range(hoehe):
        zeile = []
        for x in range(breite):
            if alpha[y * breite + x] <= DECKEND:
                zeile.append(".")
            elif (x // ZP, y // ZP) in kontur.sperre:
                zeile.append("s")
            elif kontur.ebene == BODEN or kontur.flach or y >= kontur.linie:
                zeile.append("v")
            else:
                zeile.append("h")
        klassen.append(zeile)
    return klassen


def moebel_der_orte(orte: list[str], ordner: Path = SZENEN) -> set[str]:
    """Namen der Möbel in den Szenen der Orte (Kennung wie „mapleFalls“ → maple-falls-*.json)."""
    namen: set[str] = set()
    for ort in orte:
        muster = re.sub(r"([A-Z])", r"-\1", ort).lower() + "-*.json"
        for datei in sorted(ordner.glob(muster)):
            namen |= set(re.findall(r'"moebel":\s*"([^"]+)"', datei.read_text(encoding="utf-8")))
    return namen


def vorschlaege(namen: set[str], moebel: dict[str, dict], privat: Path | None = None) -> dict[str, Kontur]:
    """Name → Vorschlag für alle genannten Einträge mit Befund (mit Paket auch nach dem Bild)."""
    ergebnis = {}
    for name in sorted(namen & set(moebel)):
        alpha = alpha_von(moebel[name], privat) if privat else None
        kontur = vorschlag(name, moebel[name], alpha)
        if kontur.befunde:
            ergebnis[name] = kontur
    return ergebnis


def als_json(konturen: dict[str, Kontur]) -> dict:
    """Die Vorschläge im Format von kontur.json (nur gesetzte Felder)."""
    aus: dict[str, dict] = {}
    for name, k in konturen.items():
        eintrag: dict = {"befunde": k.befunde}
        if k.sortierlinie is not None:
            eintrag["sortierlinie"] = k.sortierlinie
        if k.ebene:
            eintrag["ebene"] = k.ebene
        if k.teilbereiche:
            eintrag["teilbereiche"] = k.teilbereiche
        if k.neue_sperre:
            eintrag["maske_fein"] = feine_maske(k.sperre, k.breite, k.hoehe)
        aus[name] = eintrag
    return aus


def schreibe_katalog(konturen: dict[str, Kontur], ordner: Path = ORDNER) -> int:
    """Schreibt `sortierlinie` und `ebene` der Vorschläge in die Katalogdateien (nur diese Felder,
    ``katalogfeld.setze``). Ausgabe: Zahl geänderter Felder."""
    from pipeline.abenteuer.katalogfeld import setze
    from pipeline.abenteuer.moebelliste import moebeldateien

    geaendert = 0
    for datei in moebeldateien(ordner):
        text = datei.read_text(encoding="utf-8")
        neu = text
        for name in json.loads(text)["moebel"]:
            k = konturen.get(name)
            if k is None:
                continue
            felder = [("kollision", k.kollision), ("sortierlinie", k.sortierlinie), ("ebene", k.ebene)]
            felder.append(("teilbereiche", k.teilbereiche))
            if k.neue_sperre:
                felder += [("maske_fein", feine_maske(k.sperre, k.breite, k.hoehe)), (FELD_HAND, k.grund)]
            for feld_name, wert in felder:
                if wert is not None:
                    neu = setze(neu, name, feld_name, wert)
                    geaendert += 1
        if neu != text:
            json.loads(neu)  # bricht ab, statt eine kaputte Datei zu schreiben
            datei.write_text(neu, encoding="utf-8")
    return geaendert


def main(argv: list[str] | None = None) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    teil = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teil.add_argument("--alle", action="store_true", help="die ganze Bibliothek, nicht nur genutzte")
    teil.add_argument("--ort", action="append", default=[], help="nur Möbel dieser Orte (Kennung)")
    teil.add_argument("--schreiben", action="store_true", help="Vorschläge in den Katalog schreiben")
    teil.add_argument("--boegen", type=Path, default=None, help="Kontaktbögen in diesen Ordner")
    teil.add_argument("--privat", type=Path, default=None, help="privates Paket (Bilder)")
    args = teil.parse_args(argv)
    moebel = lade_moebel()
    namen = set(moebel) if args.alle else genutzte_moebel() & set(moebel)
    if args.ort:
        namen &= moebel_der_orte(args.ort)
    from pipeline.abenteuer.anordnung_bild import privat as privat_paket

    privat = args.privat or privat_paket()
    konturen = vorschlaege(namen, moebel, privat)
    if not args.ort:
        KONTURDATEI.write_text(json.dumps(als_json(konturen), ensure_ascii=False, indent=2) + "\n", "utf-8")
    zahl: dict[str, int] = {}
    for k in konturen.values():
        for b in k.befunde:
            zahl[b.split(":")[0]] = zahl.get(b.split(":")[0], 0) + 1
    print(f"{len(namen)} Einträge geprüft, {len(konturen)} mit Befund: {zahl}")
    if args.schreiben:
        print(f"{schreibe_katalog(konturen)} Katalogfelder geschrieben")
    if args.boegen:
        from pipeline.abenteuer.konturkollision_bogen import kontaktboegen

        if privat is None:
            print("Kein privates Paket: keine Bögen.")
            return 1
        alle = {n: konturen.get(n) or vorschlag(n, moebel[n]) for n in sorted(namen)}
        for pfad in kontaktboegen(args.boegen, privat, moebel, alle, alpha_von):
            print(pfad)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

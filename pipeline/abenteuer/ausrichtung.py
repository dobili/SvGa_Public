"""Ausrichtung der Bilder (KARTENREGELN 10.78): Steht jedes Bild in der Richtung, in der es funktioniert?

Warum: Wunsch des Autors (15.11.2026): „Bei der Bowlingbahn ist dieses Endstück-Asset mit dem
Schacht, wo die Kegel reinfallen, ein Asset, das nur nach unten funktioniert. Das wurde auch so
verwendet, aber die Bowlingbahn geht von links nach rechts. […] Ist die Richtung, in der das Asset
eingesetzt ist, richtig, und steht es nicht in Verbindung mit anderen Assets im Raum, die
eigentlich eine andere Orientierung oder Position voraussetzen?“

Katalogangaben (``inhalte/abenteuer/moebel/``), alle freiwillig:
- ``lauf``: ``waagrecht`` oder ``senkrecht``, die Achse, entlang der das Bild weiterläuft oder
  fährt (Bahn, Gleis, Steg, Brücke, Fahrzeug, Boot, Bett, langer Tresen). Fehlt sie, folgt sie bei
  Fahrzeugen und Booten aus ``blick`` (unten/oben: senkrecht, links/rechts: waagrecht).
- ``ende``: ``nord``, ``sued``, ``west`` oder ``ost``, die Seite, an der das Bild abschließt
  (Kugelfang, Prellbock, Kopfende des Betts); weiter geht es zur Gegenseite.
- ``verbund``: Name einer Anlage aus mehreren Bildern (``kegelbahn``, ``gleis`` …); ``stelle``:
  ``ende`` oder ``anfang``, wo in der Anlage das Bild hingehört (Kegel am Ende, Kugelregal am Abwurf).
- ``varianten``: andere Richtungen desselben Gegenstands, ``{"ost": "spiel/eigene/…png"}``.
- ``blickziel``: ``true`` bei Bühne, Schultafel, Leinwand: Sitze im Raum schauen dorthin.

Regeln (alle aus diesen Angaben, keine Regel nennt eine Karte):
1. Anlage: Die Teile eines Verbunds, die sich berühren, bilden eine Anlage; ist sie deutlich länger
   als breit, läuft jedes Teil mit ``lauf`` in ihrer Richtung. Ein Teil mit ``ende`` liegt an dem
   Ende der Anlage, das ``ende`` nennt; Teile mit ``stelle`` an ihrem Ende bzw. Anfang.
2. Untergrund: Fahrzeuge (ohne Regel 10.65 in ``fahrzeuge.py``) laufen mit ihrer Fahrbahn, Boote mit
   dem Wasserlauf, Brücken quer über das Wasser.
3. Bett: Das Kopfende (``ende``) liegt an einer Wand.
4. Sitze: Ein Stuhl, Hocker oder eine Bank direkt an Tisch, Tresen, Theke oder Pult schaut zu ihm;
   an Tresen und Theke sitzen Gäste auf der Seite, zu der die Theke schaut (``blick``).
5. Blickziel: Stühle ohne Tisch in einem Innenraum mit Blickziel schauen nicht von ihm weg; Bänke
   und Tribünen nicht von einer Bühne weg (zur Tafel müssen sie nicht schauen, Hocker haben keine Lehne).
6. Wandbilder: Was frontal an der Wand hängt (``an_wand``, ``blick`` unten oder ohne), hängt an einer
   Nordwand, nicht an einer Seitenwand.

Aufruf: ``python -m pipeline.abenteuer.ausrichtung [--ort KENNUNG] [--bilder ORDNER --privat PFAD]``.
Im Kartenbau zählen die Befunde als Befund (``kartenbau.baue``, seit 15.11.2026; vorher Hinweis).
"""

import re
import sys
from pathlib import Path

from pipeline.abenteuer.ausrichtung_teile import (
    GEGENSEITE,
    PRIVAT_PAKET,
    RICHTUNG,
    Befund,
    Teil,
    achse_der_anlage,
    anlagen,
    lauf_von,
    teile_der_szene,
    variante,
)
from pipeline.abenteuer.fahrzeuge import EINDEUTIG, FAHRBAHN, _lauf, ansicht

GESPERRT = {"#", "~", " "}
# Sitze, die zu einem Tisch schauen; Sessel, Sofa und Liegestuhl stehen auch neben Beistelltischen.
SITZARTEN = {"stuhl", "bank"}
# Bänke gehören zu Tischen, nicht zu Theken (Wartebank am Fahrkartenschalter, Museum Ironwood).
BEZUG_JE_SITZ = {"stuhl": {"tisch", "tresen", "theke", "schreibtisch"}, "bank": {"tisch", "schreibtisch"}}
# Rundum gleiche Sitze ohne Lehne: keine Blickrichtung (die Lage an der Theke zählt trotzdem).
OHNE_LEHNE = re.compile(r"hocker", re.I)
THEKENARTEN = {"tresen", "theke"}
BOOTSARTEN = {"boot"}
# Bis zu dieser Entfernung (Kacheln) gehört ein Sitz zum Blickziel des Raums.
BLICKZIEL_REICHWEITE = 10
# Wandbilder, die nur frontal (an der Nordwand) funktionieren.
WANDBILD_BLICKE = {None, "unten", "keine"}


def pruefe_anlagen(szene: dict, teile: list[Teil]) -> list[Befund]:
    """Regel 1: Teile einer Anlage laufen in ihrer Richtung, Enden liegen am richtigen Ende.

    Beispiel aus dem Gasthaus Lockport: Bande, Kegel und Kugel liegen in einer Reihe von West nach
    Ost; der Kugelfang (``lauf`` senkrecht, ``ende`` nord) passt nicht, die Variante ``ost`` passt.
    """
    befunde = []
    for anlage in anlagen(teile):
        for teil in anlage:
            befunde += _pruefe_teil(szene, teil, anlage)
        achse = achse_der_anlage(anlage)
        if achse is not None:
            befunde += pruefe_stellen(szene, anlage, achse)
    return befunde


def _pruefe_teil(szene: dict, teil: Teil, anlage: list[Teil]) -> list[Befund]:
    """Ein Teil einer Anlage: läuft wie seine Nachbarn; ein Endstück hat am Ende keinen Nachbarn."""
    lauf = lauf_von(teil.angabe)
    achse = teil.oertliche_achse(anlage)
    if lauf and achse and lauf != achse:
        ziel = teil.ende_fuer(anlage) or achse
        text = f"läuft {lauf}, die anliegenden Teile der Anlage {teil.verbund} laufen {achse}"
        return [Befund(szene["karte"], teil.name, teil.feld, text, variante(teil, ziel))]
    if teil.angabe.get("ende") and lauf and not teil.liegt_am_ende(anlage):
        richtig = teil.ende_fuer(anlage)
        text = f"schließt nach {teil.angabe['ende']} ab, dort liegt aber noch die Anlage {teil.verbund}"
        return [
            Befund(szene["karte"], teil.name, teil.feld, text, variante(teil, richtig) if richtig else "")
        ]
    return []


def pruefe_stellen(szene: dict, anlage: list[Teil], achse: str) -> list[Befund]:
    """Teile mit ``stelle`` ende/anfang liegen in der Hälfte der Anlage beim Endstück bzw. davor."""
    enden = [t for t in anlage if t.angabe.get("ende") and lauf_von(t.angabe) == achse]
    if not enden:
        return []
    befunde = []
    endstueck = enden[0]
    index = 0 if achse == "waagrecht" else 1
    mitte = (min(t.mitte[index] for t in anlage) + max(t.mitte[index] for t in anlage)) / 2
    am_ende = endstueck.mitte[index] >= mitte
    for teil in anlage:
        stelle = teil.angabe.get("stelle")
        if stelle not in ("ende", "anfang") or teil is endstueck:
            continue
        hier = teil.mitte[index] >= mitte
        soll = am_ende if stelle == "ende" else not am_ende
        if hier != soll:
            befunde.append(
                Befund(
                    szene["karte"],
                    teil.name,
                    teil.feld,
                    f"gehört an den {'End' if stelle == 'ende' else 'Anfang'}teil der Anlage {teil.verbund} "
                    f"({endstueck.name} ist das Ende)",
                    "an das andere Ende der Anlage setzen",
                )
            )
    return befunde


def wasserzeichen_der(szene: dict) -> set[str]:
    """Wasserzeichen der Szene (zusammenhang.py), spät geladen, um einen Importkreis zu vermeiden."""
    from pipeline.abenteuer.zusammenhang import wasserzeichen

    return wasserzeichen(szene)


def _achse_am(zeilen: list[str], zeichen: set[str], x: int, y: int) -> str | None:
    """Achse eines Laufs (Fahrbahn, Wasser) durch (x, y), wenn sie eindeutig ist, sonst None."""
    if not (0 <= y < len(zeilen) and 0 <= x < len(zeilen[0])) or zeilen[y][x] not in zeichen:
        return None
    quer, hoch = _lauf(zeilen, zeichen, x, y, 1, 0), _lauf(zeilen, zeichen, x, y, 0, 1)
    if quer >= EINDEUTIG * hoch:
        return "waagrecht"
    if hoch >= EINDEUTIG * quer:
        return "senkrecht"
    return None


def pruefe_untergrund(szene: dict, zeilen: list[str], teile: list[Teil]) -> list[Befund]:
    """Regel 2: Fahrzeuge mit ihrer Fahrbahn, Boote mit dem Wasser, Brücken quer über das Wasser."""
    boeden = szene.get("boeden", {})
    fahrbahn = {z for z, art in boeden.items() if art in FAHRBAHN} | (
        {"."} if szene.get("boden") in FAHRBAHN else set()
    )
    wasser = wasserzeichen_der(szene)
    offen = {"~"} | {z for z, art in boeden.items() if art == "wasser"}
    befunde = []
    for teil in teile:
        lauf = lauf_von(teil.angabe)
        art = teil.angabe.get("art")
        if not lauf:
            continue
        x, y = teil.fuss
        if art == "fahrzeug" and ansicht(teil.angabe["quelle"]) is None and teil.verbund != "gleis":
            bahn = _achse_am(zeilen, fahrbahn, x, y)
            if bahn and bahn != lauf:
                befunde.append(
                    Befund(
                        szene["karte"],
                        teil.name,
                        teil.feld,
                        f"fährt {lauf}, die Fahrbahn läuft {bahn}",
                        variante(teil, bahn),
                    )
                )
        elif art in BOOTSARTEN or (art == "fahrzeug" and zeilen[y][x] in offen):
            # Nur offenes Wasser: Ein Boot an Deck oder längs am Steg liegt richtig (Fähre, Bayou).
            fluss = _achse_am(zeilen, offen, x, y)
            if fluss and fluss != lauf and not _am_steg(zeilen, wasser - offen, teil):
                befunde.append(
                    Befund(
                        szene["karte"],
                        teil.name,
                        teil.feld,
                        f"liegt {lauf}, das Wasser läuft {fluss}",
                        variante(teil, fluss),
                    )
                )
        elif art == "bruecke" and zeilen[y][x] in wasser:
            fluss = _achse_am(zeilen, wasser - set(boeden) - set(szene.get("bruecken", [])) | {"~"}, x, y)
            if fluss and fluss == lauf:
                befunde.append(
                    Befund(
                        szene["karte"],
                        teil.name,
                        teil.feld,
                        f"läuft {lauf} mit dem Wasser statt quer darüber",
                        variante(teil, GEGENSEITE[lauf]),
                    )
                )
    return befunde


def _am_steg(zeilen: list[str], holz: set[str], teil: Teil) -> bool:
    """Grenzt die Fußfläche an Holzboden über dem Wasser (Steg, Deck)?"""
    x0, y0, x1, y1 = teil.bildflaeche
    return any(
        0 <= y < len(zeilen) and 0 <= x < len(zeilen[0]) and zeilen[y][x] in holz
        for x in range(x0 - 1, x1 + 2)
        for y in range(y0 - 1, y1 + 2)
    )


def pruefe_betten(szene: dict, zeilen: list[str], teile: list[Teil]) -> list[Befund]:
    """Regel 3: Das Kopfende eines Betts (``ende``) liegt an einer Wand oder am Kartenrand."""
    befunde = []
    for teil in teile:
        ende = teil.angabe.get("ende")
        if teil.angabe.get("art") != "bett" or not ende:
            continue
        felder = teil.randfelder(ende)
        if not any(_gesperrt(zeilen, x, y) for x, y in felder):
            befunde.append(
                Befund(
                    szene["karte"],
                    teil.name,
                    teil.feld,
                    f"Kopfende ({ende}) steht frei im Raum",
                    "Kopfende an die Wand: " + variante(teil, GEGENSEITE[ende]),
                )
            )
    return befunde


def _gesperrt(zeilen: list[str], x: int, y: int) -> bool:
    return not (0 <= y < len(zeilen) and 0 <= x < len(zeilen[0])) or zeilen[y][x] in GESPERRT


def pruefe_sitze(szene: dict, teile: list[Teil]) -> list[Befund]:
    """Regel 4 und 5: Sitze schauen zu ihrem Tisch, Gäste sitzen vor der Theke, sonst zum Blickziel."""
    befunde = []
    ziele = [t for t in teile if t.angabe.get("blickziel")]
    for sitz in teile:
        blick = sitz.angabe.get("blick")
        art = sitz.angabe.get("art")
        if art not in SITZARTEN or blick not in RICHTUNG or sitz.auf:
            continue
        nah = [
            b
            for b in teile
            if b.angabe.get("art") in BEZUG_JE_SITZ[art] and b.kollision and sitz.abstand(b) <= 1
        ]
        if nah:
            befunde += _sitz_am_bezug(szene, sitz, blick, nah)
        elif _ziele_fuer(sitz, art, szene, ziele):
            ziel = min(_ziele_fuer(sitz, art, szene, ziele), key=sitz.abstand)
            if sitz.abstand(ziel) <= BLICKZIEL_REICHWEITE and sitz.schaut_weg_von(ziel, blick):
                befunde.append(
                    Befund(
                        szene["karte"],
                        sitz.name,
                        sitz.feld,
                        f"schaut ({blick}) von {ziel.name} weg",
                        variante(sitz, sitz.richtung_zu(ziel)),
                    )
                )
    return befunde


def _ziele_fuer(sitz: Teil, art: str, szene: dict, ziele: list[Teil]) -> list[Teil]:
    """Blickziele, die für einen Sitz gelten: für Stühle (mit Lehne) jedes Blickziel eines Innenraums,
    für Bänke und Tribünen nur Bühnen, auch draußen (Jahrmarkt: Zuschauer vor der Bühne)."""
    if art == "stuhl" and szene.get("art") == "innen" and not OHNE_LEHNE.search(sitz.name):
        return ziele
    if art == "bank":
        return [z for z in ziele if z.angabe.get("art") == "buehne"]
    return []


def _sitz_am_bezug(szene: dict, sitz: Teil, blick: str, nah: list[Teil]) -> list[Befund]:
    """Ein Sitz an Tisch oder Theke: schaut zu einem davon; an einer Theke auf der Gästeseite."""
    if not OHNE_LEHNE.search(sitz.name) and not any(sitz.schaut_zu(b, blick) for b in nah):
        bezug = nah[0]
        return [
            Befund(
                szene["karte"],
                sitz.name,
                sitz.feld,
                f"schaut ({blick}) nicht zu {bezug.name}",
                variante(sitz, sitz.richtung_zu(bezug)),
            )
        ]
    befunde = []
    for theke in (b for b in nah if b.angabe.get("art") in THEKENARTEN):
        gaeste = theke.angabe.get("blick")
        seite = sitz.seite_an(theke)
        if gaeste in RICHTUNG and seite and seite != gaeste:
            befunde.append(
                Befund(
                    szene["karte"],
                    sitz.name,
                    sitz.feld,
                    f"sitzt hinter {theke.name} (die Theke schaut {gaeste}, Gäste sitzen dort)",
                    f"auf die Seite {gaeste} der Theke setzen",
                )
            )
    return befunde


def pruefe_wandbilder(szene: dict, zeilen: list[str], teile: list[Teil]) -> list[Befund]:
    """Regel 6: Frontal gezeichnete Wandbilder hängen an einer Nordwand (Boden darunter)."""
    if szene.get("art") != "innen":
        return []
    befunde = []
    for teil in teile:
        if not teil.an_wand or teil.angabe.get("blick") not in WANDBILD_BLICKE:
            continue
        if teil.angabe.get("art") in {"tuer", "treppe", "gebaeude"}:
            continue
        if not teil.ueber_boden(zeilen) and teil.an_seitenwand(zeilen):
            befunde.append(
                Befund(
                    szene["karte"],
                    teil.name,
                    teil.feld,
                    "frontal gezeichnet, hängt aber an einer Seitenwand",
                    "an eine Nordwand hängen oder ein seitliches Bild nehmen",
                )
            )
    return befunde


def pruefe_szene(szene: dict, moebel: dict) -> list[Befund]:
    """Alle Regeln von 10.78 für eine Szene."""
    from pipeline.abenteuer.kartenbau import raster

    zeilen = raster(szene)
    teile = teile_der_szene(szene, moebel)
    return (
        pruefe_anlagen(szene, teile)
        + pruefe_untergrund(szene, zeilen, teile)
        + pruefe_betten(szene, zeilen, teile)
        + pruefe_sitze(szene, teile)
        + pruefe_wandbilder(szene, zeilen, teile)
    )


def pruefe_alle(alle: dict[str, dict], moebel: dict, ort: str | None = None) -> list[Befund]:
    """Befunde aller Grundkarten (oder eines Orts), ohne doppelte."""
    befunde = []
    for karte, szene in sorted(alle.items()):
        if ort and karte.split(".")[0] != ort:
            continue
        befunde += pruefe_szene(szene, moebel)
    return list({str(b): b for b in befunde}.values())


def main(argumente: list[str]) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    from pipeline.abenteuer.katalogausrichtung import pruefe_katalog
    from pipeline.abenteuer.moebelliste import lade_moebel
    from pipeline.abenteuer.uebergaenge import szenen
    from pipeline.abenteuer.uebergangsbogen import PRIVAT

    ort = argumente[argumente.index("--ort") + 1] if "--ort" in argumente else None
    privat = Path(argumente[argumente.index("--privat") + 1]) if "--privat" in argumente else PRIVAT
    PRIVAT_PAKET[0] = privat if (privat / "spiel").exists() else None
    moebel = lade_moebel()
    befunde = pruefe_alle(szenen(), moebel, ort)
    for b in befunde:
        print(f"- {b}")
    for k in pruefe_katalog(moebel):
        print(f"~ Katalog: {k}")
    if "--bilder" in argumente:
        from pipeline.abenteuer.ausrichtungsbilder import befundbilder

        ziel = Path(argumente[argumente.index("--bilder") + 1])
        for pfad in befundbilder(befunde, szenen(), ziel, privat):
            print(f"Bild: {pfad}")
    print(
        "Ausrichtung in Ordnung" if not befunde else f"{len(befunde)} Befunde zur Ausrichtung (Regel 10.78)"
    )
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

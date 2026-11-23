"""Rücklauf des Karteneditors: heruntergeladene Änderungen zurück in die Szenen, mit Bericht.

Warum: Der Autor rückt Karten im Editor zurecht (``werkzeuge/karteneditor/``, Wunsch des Autors,
15.11.2026) und lädt die Änderungsdatei im privaten Repository in ``editor/rueck/`` hoch. Dieses
Skript schreibt die Szenen nach ``inhalte/abenteuer/szenen/``, berichtet je Karte, was verschoben,
gedreht, hinzugefügt, gelöscht oder in der Ebene geändert wurde (mit Koordinaten), welche Kollision an
einer Stelle übersteuert wurde (mit Katalogwert und Grund), welche Kacheln der Kollisionspinsel
sperrt oder freigibt (mit dem Bild darunter, ``kollisionspinsel.py``) und welche Auslöser, Figuren
und Statisten neu oder gelöscht sind (mit Warnung, wenn ein Ink-Knoten oder eine Quest eine Figur braucht,
``editorfiguren.py``), schreibt Varianten (``varianten/…``) an ihren Ort zurück, legt Bericht und
Vorschauen nach ``buch/arbeit/editor/`` (nur lokal) und baut die betroffenen Karten neu.

Aufruf: ``python -m pipeline.abenteuer.editorrueck DATEI.json [--privat PRIVAT]``
Übergänge (Editor ab 1.4): neue, geänderte und gelöschte Definitionen nach ``orte.json``
(``editoruebergaenge.py``); Warnung, wenn ein gelöschter Auslöser noch Ziel eines Übergangs ist.
Optionen: ``--szenen ORDNER`` (anderes Ziel, dann ohne Kartenbau, für Tests), ``--orte DATEI``
(Übergänge in eine Kopie statt nach orte.json, für Tests), ``--bericht ORDNER``,
``--ohne-bau``, ``--erzwingen`` (auch schreiben, wenn die Szene seit dem Paket geändert wurde).
Sicherheit: Weicht die Szene auf der Platte vom „vorher“ der Datei ab, wird sie nicht überschrieben
(jemand hat sie inzwischen geändert); der Bericht nennt sie als Konflikt.
"""

import argparse
import json
import sys
from pathlib import Path
from typing import TYPE_CHECKING

from pipeline.abenteuer.editorfiguren import figurwarnungen
from pipeline.abenteuer.editoruebergaenge import ruecklauf as uebergangsruecklauf
from pipeline.abenteuer.editorzuschnitt import deckkraftzeilen, zuschnittvorschlaege, zuschnittzeilen
from pipeline.abenteuer.feinbericht import feinzeilen
from pipeline.abenteuer.figurzustand import bereinige as bereinige_zustand
from pipeline.abenteuer.figurzustand import zustandstext
from pipeline.abenteuer.kartenbau import HAUPT, INHALTE
from pipeline.abenteuer.kartentiled import figurversatz
from pipeline.abenteuer.kollisionspinsel import pinselzeilen
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.objektkollision import FELDER as KOLLISION
from pipeline.abenteuer.objektkollision import kollisionszeile

if TYPE_CHECKING:  # Pillow nur für die Vorschau
    from PIL.Image import Image as Bild

FORMAT = "karteneditor-aenderungen"
FASSUNG = 1
BERICHTSORDNER = HAUPT / "buch" / "arbeit" / "editor"
BREITE = 100  # Zeilenbreite wie Prettier in diesem Repository (app/.prettierrc.json)
SCHMAL = 80  # Zeilenbreite von orte.json (Prettier-Vorgabe)
LAGE = ("feld", "versatz", "auf")
FORM = ("drehung", "spiegeln", "massstab", "ebene", "zuschnitt", "deckkraft")
MARKIERUNGEN = ("ausloeser", "figuren", "belebung")
FELDER_HOECHSTENS = 20
VARIANTEN = "varianten"  # Unterordner der Varianten B und C (szenen/varianten/README.md)


def _wert(wert: object, einzug: int, vorne: int, breite: int = BREITE) -> str:
    """JSON wie Prettier: Objekte aufgeklappt, kurze Listen einfacher Werte in einer Zeile
    (``breite``: Zeilenbreite; orte.json ist mit 80 formatiert, die Szenen mit 100)."""
    raum = "  " * einzug
    if isinstance(wert, dict) and wert:
        teile = []
        for k, v in wert.items():
            kopf = f"{raum}  {json.dumps(k, ensure_ascii=False)}: "
            teile.append(kopf + _wert(v, einzug + 1, len(kopf), breite))
        return "{\n" + ",\n".join(teile) + "\n" + raum + "}"
    if isinstance(wert, list) and wert:
        if all(not isinstance(x, dict | list) for x in wert):
            zeile = "[" + ", ".join(json.dumps(x, ensure_ascii=False) for x in wert) + "]"
            if vorne + len(zeile) + 1 <= breite:
                return zeile
        innen = [raum + "  " + _wert(x, einzug + 1, len(raum) + 2, breite) for x in wert]
        return "[\n" + ",\n".join(innen) + "\n" + raum + "]"
    return json.dumps(wert, ensure_ascii=False)


def als_text(szene: dict, alt: str | None = None) -> str:
    """Die Szene als Dateitext im Stil der vorhandenen Datei (Prettier oder ``indent=2``).

    Warum: Ein Rücklauf soll im Git-Vergleich nur die echten Änderungen zeigen. Die meisten Szenen
    sind mit Prettier formatiert, einige mit ``json.dumps(indent=2)``; der Stil bleibt erhalten.
    Die Zeilenbreite (100 oder 80, orte.json) übernimmt er, wenn die alte Datei genau so aussieht.
    """
    if alt is not None and json.dumps(json.loads(alt), ensure_ascii=False, indent=2) + "\n" == alt:
        return json.dumps(szene, ensure_ascii=False, indent=2) + "\n"
    for breite in (BREITE, SCHMAL):
        if alt is not None and _wert(json.loads(alt), 0, 0, breite) + "\n" == alt:
            return _wert(szene, 0, 0, breite) + "\n"
    return _wert(szene, 0, 0) + "\n"


def lies(pfad: Path) -> dict:
    """Liest eine Änderungsdatei und prüft Format und Fassung (ValueError sonst)."""
    daten = json.loads(pfad.read_text(encoding="utf-8"))
    if daten.get("format") != FORMAT:
        raise ValueError(f"{pfad.name} ist keine Änderungsdatei des Karteneditors")
    if daten.get("fassung") != FASSUNG:
        raise ValueError(f"{pfad.name}: Fassung {daten.get('fassung')} unbekannt (erwartet {FASSUNG})")
    for eintrag in daten["szenen"]:
        name = eintrag["datei"]
        # Erlaubt: „karte.json“ oder „varianten/karte-b.json“ (Varianten, Editor ab 1.2).
        teile = Path(name).parts
        ordner_gut = len(teile) == 1 or (len(teile) == 2 and teile[0] == VARIANTEN)
        if not ordner_gut or ".." in teile or not name.endswith(".json"):
            raise ValueError(f"Ungültiger Dateiname {name!r}")
    return daten


def ort(eintrag: dict) -> str:
    """Lage eines Objekts als Text. Beispiel: feld [3, 4], versatz [0, 2] → „(3, 4) + (0, 2) px“."""
    if "auf" in eintrag:
        text = f"auf „{eintrag['auf']}“"
    else:
        text = f"({', '.join(map(str, eintrag.get('feld', [])))})"
    if eintrag.get("versatz"):
        text += f" + ({', '.join(map(str, eintrag['versatz']))}) px"
    return text


def objektzeilen(vorher: dict, nachher: dict, moebel: dict | None = None) -> list[str]:
    """Was sich an einem Objekt geändert hat, je Merkmal eine Zeile (Kollision mit Katalogwert)."""
    name = nachher["moebel"]
    zeilen = []
    if any(vorher.get(k) != nachher.get(k) for k in LAGE):
        zeilen.append(f"verschoben: {name} {ort(vorher)} → {ort(nachher)}")
    if vorher.get("drehung", 0) != nachher.get("drehung", 0):
        zeilen.append(f"gedreht: {name} {ort(nachher)} auf {nachher.get('drehung', 0)}°")
    if bool(vorher.get("spiegeln")) != bool(nachher.get("spiegeln")):
        zustand = "gespiegelt" if nachher.get("spiegeln") else "nicht mehr gespiegelt"
        zeilen.append(f"{zustand}: {name} {ort(nachher)}")
    if vorher.get("massstab", 1) != nachher.get("massstab", 1):
        prozent = round(nachher.get("massstab", 1) * 100)
        zeilen.append(f"skaliert: {name} {ort(nachher)} auf {prozent} %")
    if vorher.get("ebene", 0) != nachher.get("ebene", 0):
        zeilen.append(f"Ebene: {name} {ort(nachher)} {vorher.get('ebene', 0)} → {nachher.get('ebene', 0)}")
    angabe = (moebel or {}).get(name)
    zeilen += zuschnittzeilen(vorher, nachher, angabe, ort(nachher))  # Editor 1.5, editorzuschnitt.py
    zeilen += deckkraftzeilen(vorher, nachher, ort(nachher))
    if zeile := kollisionszeile(vorher, nachher, angabe, ort(nachher)):
        zeilen.append(zeile)
    rest = sorted(
        k
        for k in set(vorher) | set(nachher)
        if k not in (*LAGE, *FORM, *KOLLISION) and vorher.get(k) != nachher.get(k)
    )
    if rest:
        zeilen.append(f"geändert: {name} {ort(nachher)}: {', '.join(rest)}")
    return zeilen


def rasterzeilen(vorher: list[str], nachher: list[str]) -> list[str]:
    """Bemalte Felder des Rasters. Beispiel: [„Boden: 3 Felder, (4, 5) . → t, …“]."""
    felder = [
        f"({x}, {y}) {a!r} → {b!r}"
        for y, (alt, neu) in enumerate(zip(vorher, nachher, strict=False))
        for x, (a, b) in enumerate(zip(alt, neu, strict=False))
        if a != b
    ]
    if not felder and len(vorher) == len(nachher):
        return []
    mehr = " …" if len(felder) > FELDER_HOECHSTENS else ""
    return [f"Boden: {len(felder)} Felder bemalt: {', '.join(felder[:FELDER_HOECHSTENS])}{mehr}"]


def markierungszeilen(eintrag: dict) -> list[str]:
    """Verschobene, neue und gelöschte Auslöser, Figuren und Belebung.

    Mit ``markierungen`` (Zuordnung je Liste wie bei den Objekten, Editor ab 1.1) erkennt der
    Bericht neue und gelöschte Einträge; ältere Dateien vergleichen der Reihe nach.
    Beispiel: „hinzugefügt (ausloeser): treppe (3, 6)“.
    """
    vorher, nachher, zeilen = eintrag["vorher"], eintrag["nachher"], []
    for liste in MARKIERUNGEN:
        alt, neu = vorher.get(liste, []), nachher.get(liste, [])
        zuordnung = (eintrag.get("markierungen") or {}).get(liste)
        if zuordnung is None:
            zuordnung = [j if j < len(alt) else None for j in range(len(neu))]
        for j, i in enumerate(zuordnung):
            b = neu[j]
            if i is None:
                zeilen.append(f"hinzugefügt ({liste}): {b['name']} {tuple(b['feld'])}")
            elif alt[i].get("feld") != b.get("feld"):
                zeilen.append(
                    f"verschoben ({liste}): {b['name']} {tuple(alt[i]['feld'])} → {tuple(b['feld'])}"
                )
            if i is not None and liste == "figuren" and figurversatz(alt[i]) != figurversatz(b):
                # Feiner Versatz des Bildes (Editor 1.8), nur Darstellung.
                zeilen.append(f"Versatz (figuren): {b['name']} {_px(alt[i])} → {_px(b)}")
            if i is not None and zustandstext(alt[i]) != zustandstext(b):
                # Zustand und Standbild an dieser Stelle (Editor 1.9, figurzustand.py).
                zeilen.append(f"Zustand ({liste}): {b['name']} {zustandstext(alt[i])} → {zustandstext(b)}")
            if i is not None and _blick(alt[i]) != _blick(b):
                # Blickrichtung (Editor 1.7, R008); ohne Angabe schaut die Person nach unten.
                zeilen.append(f"Blick ({liste}): {b['name']} {_blick(alt[i])} → {_blick(b)}")
        for i in sorted(set(range(len(alt))) - {i for i in zuordnung if i is not None}):
            zeilen.append(f"gelöscht ({liste}): {alt[i]['name']} {tuple(alt[i]['feld'])}")
    return zeilen


def _px(eintrag: dict) -> str:
    """Feiner Versatz einer Figur als Text. Beispiel: [0, -3] → „(0, -3) px“; ohne → „(0, 0) px“."""
    dx, dy = figurversatz(eintrag) or (0, 0)
    return f"({dx}, {dy}) px"


def bereinige_figurversatz(szene: dict) -> None:
    """Versatz der Figuren auf ±8 ganze Pixel begrenzen, (0, 0) weglassen (kartentiled.figurversatz).

    Warum: Der Editor begrenzt schon; die Grenze gilt aber auch, wenn jemand die Datei von Hand
    ändert, damit keine Figur sichtbar auf der Nachbarkachel steht.
    """
    for f in szene.get("figuren", []):
        if "versatz" not in f:
            continue
        if versatz := figurversatz(f):
            f["versatz"] = list(versatz)
        else:
            del f["versatz"]


def _blick(eintrag: dict) -> str:
    """Blickrichtung einer Figur (``blick``) oder eines Statisten (``eigenschaften.blick``), sonst
    „Vorgabe“. Beispiel: {"name": "hector", "blick": "links"} → „links“."""
    return eintrag.get("blick") or eintrag.get("eigenschaften", {}).get("blick") or "Vorgabe"


def berichte(eintrag: dict, moebel: dict | None = None) -> list[str]:
    """Bericht zu einer Karte: Objekte (über die Zuordnung des Editors), Markierungen, Boden."""
    vorher, nachher = eintrag["vorher"], eintrag["nachher"]
    alt, neu = vorher.get("objekte", []), nachher.get("objekte", [])
    zuordnung = eintrag.get("zuordnung") or [None] * len(neu)
    zeilen = []
    for j, i in enumerate(zuordnung):
        if i is None:
            zeilen.append(f"hinzugefügt: {neu[j]['moebel']} {ort(neu[j])}")
            zeilen += zuschnittzeilen({}, neu[j], (moebel or {}).get(neu[j]["moebel"]), ort(neu[j]))
            zeilen += deckkraftzeilen({}, neu[j], ort(neu[j]))
            if zeile := kollisionszeile({}, neu[j], (moebel or {}).get(neu[j]["moebel"]), ort(neu[j])):
                zeilen.append(zeile)
        else:
            zeilen += objektzeilen(alt[i], neu[j], moebel)
    for i in sorted(set(range(len(alt))) - {i for i in zuordnung if i is not None}):
        zeilen.append(f"gelöscht: {alt[i]['moebel']} {ort(alt[i])}")
    zeilen += markierungszeilen(eintrag)
    zeilen += rasterzeilen(vorher.get("raster", []), nachher.get("raster", []))
    # Kollisionspinsel (Editor 1.3): gemalte Sperren und Freigaben mit dem Bild, das dort lag.
    zeilen += pinselzeilen(vorher, nachher, moebel)
    zeilen += feinzeilen(vorher, nachher, moebel)  # Kollision fein (Editor 1.6, feinbericht.py)
    for notiz in eintrag.get("objektnotizen", []):
        zeilen.append(f"Notiz zu {notiz['moebel']} (Objekt {notiz['index']}): {notiz['notiz']}")
    return zeilen


def schreibe(daten: dict, szenen: Path, erzwingen: bool) -> tuple[list[str], list[str]]:
    """Schreibt die Szenen; gibt (geschriebene Dateien, Konflikte) zurück."""
    geschrieben, konflikte = [], []
    for eintrag in daten["szenen"]:
        pfad = szenen / eintrag["datei"]
        alt = pfad.read_text(encoding="utf-8") if pfad.exists() else None
        if alt is not None and json.loads(alt) != eintrag["vorher"] and not erzwingen:
            konflikte.append(eintrag["datei"])
            continue
        bereinige_figurversatz(eintrag["nachher"])
        bereinige_zustand(eintrag["nachher"])
        pfad.write_text(als_text(eintrag["nachher"], alt), encoding="utf-8")
        geschrieben.append(eintrag["datei"])
    return geschrieben, konflikte


def vorschau(szene: dict, privat: Path, markiert: set[int]) -> "Bild":
    """Vorschau wie kartenbild.py, aber mit der Form der Objekte (Drehung, Maßstab, Spiegeln);
    geänderte Objekte rot umrandet. Braucht Pillow und das private Repository."""
    from PIL import Image, ImageDraw

    from pipeline.abenteuer.kartenbau import platziere
    from pipeline.abenteuer.kartenbild import moebelbild, zeichne
    from pipeline.abenteuer.moebelliste import lade_moebel
    from pipeline.abenteuer.objektform import formbild, mit_deckkraft

    grund = zeichne(szene, privat)[0].copy()
    moebel = lade_moebel()
    gesetzt, _ = platziere(szene, moebel)
    for s in sorted(gesetzt, key=lambda s: s["tiefe"]):
        bild = mit_deckkraft(formbild(moebelbild(privat, moebel[s["name"]]), s), s)
        grund.alpha_composite(bild, (max(0, s["x"]), max(0, s["y"])))
    zeichner = ImageDraw.Draw(grund)
    # Kennung wie im Kartenbau (id oder „möbel@index“) → Index des Objekts in der Szene.
    nummern = {o.get("id", f"{o['moebel']}@{j}"): j for j, o in enumerate(szene.get("objekte", []))}
    for s in gesetzt:
        if nummern.get(s["id"]) in markiert:
            zeichner.rectangle(
                (s["x"], s["y"], s["x"] + s["breite"] - 1, s["y"] + s["hoehe"] - 1), outline="red"
            )
    return grund.resize((grund.width * 2, grund.height * 2), Image.NEAREST)


def geaenderte_objekte(eintrag: dict) -> set[int]:
    """Indizes der Objekte im Nachher, die neu sind oder sich geändert haben."""
    alt, neu = eintrag["vorher"].get("objekte", []), eintrag["nachher"].get("objekte", [])
    zuordnung = eintrag.get("zuordnung") or [None] * len(neu)
    return {j for j, i in enumerate(zuordnung) if i is None or alt[i] != neu[j]}


def main(argumente: list[str] | None = None) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    teiler = argparse.ArgumentParser(description="Änderungen des Karteneditors zurückschreiben")
    teiler.add_argument("datei", type=Path)
    teiler.add_argument("--szenen", type=Path, default=INHALTE / "szenen")
    teiler.add_argument("--orte", type=Path, default=INHALTE / "orte.json", help="Ziel der Übergänge")
    teiler.add_argument("--bericht", type=Path, default=BERICHTSORDNER)
    teiler.add_argument("--privat", type=Path, help="privates Repository (für Vorschauen)")
    teiler.add_argument("--ohne-bau", action="store_true")
    teiler.add_argument("--erzwingen", action="store_true")
    a = teiler.parse_args(argumente)
    daten = lies(a.datei)
    geschrieben, konflikte = schreibe(daten, a.szenen, a.erzwingen)
    ordner = a.bericht / a.datei.stem
    ordner.mkdir(parents=True, exist_ok=True)
    text = [
        f"# Rücklauf {a.datei.name}",
        "",
        f"Editor {daten.get('editor_version')}, {daten.get('zeitstempel')}",
    ]
    bauen = not a.ohne_bau and a.szenen.resolve() == (INHALTE / "szenen").resolve()
    moebel, kollisionen, warnungen = lade_moebel(), [], []
    for eintrag in daten["szenen"]:
        text += ["", f"## {eintrag['datei']} ({eintrag.get('karte', '')})", ""]
        if eintrag["datei"] in konflikte:
            text.append("- KONFLIKT: Szene seit dem Paket geändert, nicht geschrieben (--erzwingen)")
        if eintrag.get("notiz"):
            text.append(f"- Notiz des Autors: {eintrag['notiz']}")
        # Figuren und Statisten, die Ink-Knoten oder Quests brauchen (Editor 1.2: löschen, kopieren).
        zeilen = berichte(eintrag, moebel) + figurwarnungen(eintrag, a.szenen)
        warnungen += [f"{eintrag['datei']}: {z}" for z in zeilen if z.startswith("WARNUNG")]
        kollisionen += [
            f"{eintrag['datei']}: {z.removeprefix('Kollision: ')}"
            for z in zeilen
            if z.startswith("Kollision:")
        ]
        text += [f"- {z}" for z in zeilen]
        if a.privat and eintrag["datei"] in geschrieben:
            bild = vorschau(eintrag["nachher"], a.privat, geaendert := geaenderte_objekte(eintrag))
            bild.convert("RGB").save(ordner / f"{Path(eintrag['datei']).stem}.png")
            text.append(
                f"- Vorschau: {Path(eintrag['datei']).stem}.png ({len(geaendert)} Objekte rot umrandet)"
            )
        if bauen and eintrag["datei"] in geschrieben:
            from pipeline.abenteuer.kartenbau import baue

            befunde = baue(a.szenen / eintrag["datei"])
            text.append("- Kartenbau: " + ("in Ordnung" if not befunde else f"{len(befunde)} Befunde"))
            text += [f"  - {b}" for b in befunde]
    # Übergänge (Editor 1.4): neue, geänderte, gelöschte Definitionen in orte.json (editoruebergaenge.py).
    zeilen, orte_konflikte, verweise = uebergangsruecklauf(daten, a.orte)
    if zeilen or orte_konflikte:
        text += ["", f"## Übergänge ({a.orte.name})", ""] + [f"- {z}" for z in zeilen]
        text += [f"- KONFLIKT: {k}" for k in orte_konflikte]
    warnungen += verweise
    if kollisionen:
        # Für den Hauptchat: Welche Katalogeinträge passen an diesen Stellen nicht (objektkollision.py)?
        text += ["", "## Kollision an einzelnen Stellen (Katalog prüfen)", ""] + [
            f"- {z}" for z in kollisionen
        ]
    if vorschlaege := zuschnittvorschlaege(daten["szenen"], moebel):
        text += ["", "## Wiederholte Zuschnitte (eigener Katalogeintrag?)", ""] + [
            f"- {z}" for z in vorschlaege
        ]
    if warnungen:
        text += ["", "## Warnungen (Figuren und Übergänge, die die Handlung braucht)", ""]
        text += [f"- {w}" for w in warnungen]
    (ordner / "bericht.md").write_text("\n".join(text) + "\n", encoding="utf-8")
    print("\n".join(text))
    print(f"\nBericht: {ordner / 'bericht.md'}")
    return 1 if konflikte or orte_konflikte else 0


if __name__ == "__main__":
    sys.exit(main())

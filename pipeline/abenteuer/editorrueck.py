"""Rücklauf des Karteneditors: heruntergeladene Änderungen zurück in die Szenen, mit Bericht.

Warum: Der Autor rückt Karten im Editor zurecht (``werkzeuge/karteneditor/``, Wunsch des Autors,
15.11.2026) und lädt die Änderungsdatei im privaten Repository in ``editor/rueck/`` hoch. Dieses
Skript schreibt die Szenen nach ``inhalte/abenteuer/szenen/``, berichtet je Karte, was verschoben,
gedreht, hinzugefügt, gelöscht oder in der Ebene geändert wurde (mit Koordinaten), welche Kollision an
einer Stelle übersteuert wurde (mit Katalogwert und Grund) und welche Auslöser, Figuren und Statisten neu
oder gelöscht sind (mit Warnung, wenn ein Ink-Knoten oder eine Quest eine Figur braucht,
``editorfiguren.py``), schreibt Varianten (``varianten/…``) an ihren Ort zurück, legt Bericht und
Vorschauen nach ``buch/arbeit/editor/`` (nur lokal) und baut die betroffenen Karten neu.

Aufruf: ``python -m pipeline.abenteuer.editorrueck DATEI.json [--privat PRIVAT]``
Optionen: ``--szenen ORDNER`` (anderes Ziel, dann ohne Kartenbau, für Tests), ``--bericht ORDNER``,
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
from pipeline.abenteuer.kartenbau import HAUPT, INHALTE
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.objektkollision import FELDER as KOLLISION
from pipeline.abenteuer.objektkollision import kollisionszeile

if TYPE_CHECKING:  # Pillow nur für die Vorschau
    from PIL.Image import Image as Bild

FORMAT = "karteneditor-aenderungen"
FASSUNG = 1
BERICHTSORDNER = HAUPT / "buch" / "arbeit" / "editor"
BREITE = 100  # Zeilenbreite wie Prettier in diesem Repository (app/.prettierrc.json)
LAGE = ("feld", "versatz", "auf")
FORM = ("drehung", "spiegeln", "massstab", "ebene")
MARKIERUNGEN = ("ausloeser", "figuren", "belebung")
FELDER_HOECHSTENS = 20
VARIANTEN = "varianten"  # Unterordner der Varianten B und C (szenen/varianten/README.md)


def _wert(wert: object, einzug: int, vorne: int) -> str:
    """JSON wie Prettier: Objekte aufgeklappt, kurze Listen einfacher Werte in einer Zeile."""
    raum = "  " * einzug
    if isinstance(wert, dict) and wert:
        teile = []
        for k, v in wert.items():
            kopf = f"{raum}  {json.dumps(k, ensure_ascii=False)}: "
            teile.append(kopf + _wert(v, einzug + 1, len(kopf)))
        return "{\n" + ",\n".join(teile) + "\n" + raum + "}"
    if isinstance(wert, list) and wert:
        if all(not isinstance(x, dict | list) for x in wert):
            zeile = "[" + ", ".join(json.dumps(x, ensure_ascii=False) for x in wert) + "]"
            if vorne + len(zeile) + 1 <= BREITE:
                return zeile
        innen = [raum + "  " + _wert(x, einzug + 1, len(raum) + 2) for x in wert]
        return "[\n" + ",\n".join(innen) + "\n" + raum + "]"
    return json.dumps(wert, ensure_ascii=False)


def als_text(szene: dict, alt: str | None = None) -> str:
    """Die Szene als Dateitext im Stil der vorhandenen Datei (Prettier oder ``indent=2``).

    Warum: Ein Rücklauf soll im Git-Vergleich nur die echten Änderungen zeigen. Die meisten Szenen
    sind mit Prettier formatiert, einige mit ``json.dumps(indent=2)``; der Stil bleibt erhalten.
    """
    if alt is not None and json.dumps(json.loads(alt), ensure_ascii=False, indent=2) + "\n" == alt:
        return json.dumps(szene, ensure_ascii=False, indent=2) + "\n"
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
        for i in sorted(set(range(len(alt))) - {i for i in zuordnung if i is not None}):
            zeilen.append(f"gelöscht ({liste}): {alt[i]['name']} {tuple(alt[i]['feld'])}")
    return zeilen


def berichte(eintrag: dict, moebel: dict | None = None) -> list[str]:
    """Bericht zu einer Karte: Objekte (über die Zuordnung des Editors), Markierungen, Boden."""
    vorher, nachher = eintrag["vorher"], eintrag["nachher"]
    alt, neu = vorher.get("objekte", []), nachher.get("objekte", [])
    zuordnung = eintrag.get("zuordnung") or [None] * len(neu)
    zeilen = []
    for j, i in enumerate(zuordnung):
        if i is None:
            zeilen.append(f"hinzugefügt: {neu[j]['moebel']} {ort(neu[j])}")
            if zeile := kollisionszeile({}, neu[j], (moebel or {}).get(neu[j]["moebel"]), ort(neu[j])):
                zeilen.append(zeile)
        else:
            zeilen += objektzeilen(alt[i], neu[j], moebel)
    for i in sorted(set(range(len(alt))) - {i for i in zuordnung if i is not None}):
        zeilen.append(f"gelöscht: {alt[i]['moebel']} {ort(alt[i])}")
    zeilen += markierungszeilen(eintrag)
    zeilen += rasterzeilen(vorher.get("raster", []), nachher.get("raster", []))
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
    from pipeline.abenteuer.objektform import formbild

    grund = zeichne(szene, privat)[0].copy()
    moebel = lade_moebel()
    gesetzt, _ = platziere(szene, moebel)
    for s in sorted(gesetzt, key=lambda s: s["tiefe"]):
        bild = formbild(moebelbild(privat, moebel[s["name"]]), s)
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
    teiler = argparse.ArgumentParser(description="Änderungen des Karteneditors zurückschreiben")
    teiler.add_argument("datei", type=Path)
    teiler.add_argument("--szenen", type=Path, default=INHALTE / "szenen")
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
    if kollisionen:
        # Für den Hauptchat: Welche Katalogeinträge passen an diesen Stellen nicht (objektkollision.py)?
        text += ["", "## Kollision an einzelnen Stellen (Katalog prüfen)", ""] + [
            f"- {z}" for z in kollisionen
        ]
    if warnungen:
        text += ["", "## Warnungen (Figuren, die die Handlung braucht)", ""] + [f"- {w}" for w in warnungen]
    (ordner / "bericht.md").write_text("\n".join(text) + "\n", encoding="utf-8")
    print("\n".join(text))
    print(f"\nBericht: {ordner / 'bericht.md'}")
    return 1 if konflikte else 0


if __name__ == "__main__":
    sys.exit(main())

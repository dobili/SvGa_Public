"""Bauteile zusammengesetzter Katalogbilder mit Gemini erkennen (Wand, Treppe, Dach, Veranda …).

Warum (Wunsch des Autors, 28.11.2026): „Bei den Gebäudeassets muss eine Erkennung drübergehen, die
die enthaltenen Komponenten zuordnet: Wand, Treppe, Fenster, Veranda, Dach usw. Das gilt für alle
Assets, die als ein Bild aus mehreren Objekten bestehen. Nur mit diesem Wissen lässt sich sinnvoll
über die Kollision entscheiden.“ Anlass: An der Schule (mf4Schule) waren Treppen und Mauer vertauscht.

Ablauf: Das Katalogbild geht vergrößert (ganzzahlig, Pixel scharf, auf grauem Grund) mit einer
Beschreibung der Bauteilarten an Gemini; die Antwort ist JSON nach festem Schema mit Rahmen im
Gemini-Format (``box_2d`` = [ymin, xmin, ymax, xmax], normiert 0 bis 1000). ``umrechnen`` macht daraus
Rahmen in Pixeln des Katalogbilds [x0, y0, x1, y1] (Ende ausschließlich). Die Vorschläge stehen mit
``"geprueft": "gemini, Datum"`` in ``katalog_korrekturen/bauteile_gemini.json``; von Hand geprüfte
Einträge (``bauteile.json``) gehen immer vor und werden nie überschrieben (``bauteilregeln.lade_bauteile``).

Aufruf (Schlüssel setzt der Proxy als Kopf x-goog-api-key, wie geminibilder.py):
    python -m pipeline.abenteuer.bauteilerkennung liste
    python -m pipeline.abenteuer.bauteilerkennung probe mf4Schule gt7Saloon [--modell M]
    python -m pipeline.abenteuer.bauteilerkennung stapel [--nur A,B]      # halber Preis
    python -m pipeline.abenteuer.bauteilerkennung abholen
    python -m pipeline.abenteuer.bauteilerkennung nachbessern   # bekannte Irrtümer (bauteilregeln)
Bögen und Ableitung: ``bauteil_bogen.py``.
"""

from __future__ import annotations

import argparse
import base64
import datetime
import io
import json
import re
import sys
from pathlib import Path

from pipeline.abenteuer.bauteilpruefung import nachbessern
from pipeline.abenteuer.bauteilregeln import (
    GEMINIDATEI,
    HANDDATEI,
    TYPEN,
    lade_json,
)
from pipeline.abenteuer.geminibilder import _suche, anfrage
from pipeline.abenteuer.moebelliste import lade_moebel

# Gemini 3.5 Flash: im Vergleich an den zehn Testbildern (28.11.2026) die genauesten Rahmen je Preis.
MODELL = "gemini-3.5-flash"
NORM = 1000  # Gemini normiert Rahmen auf 0 bis 1000
ZIELKANTE = 1024  # längste Kante des gesendeten Bildes (ungefähr, ganzzahlige Vergrößerung)
GRUND = (128, 128, 128, 255)  # neutraler Hintergrund statt Durchsichtigkeit
ARBEIT = Path("buch/arbeit/bauteile")
STAPELDATEI = "stapel.json"
# Arten, die als ein Bild aus mehreren Bauteilen bestehen (Gebäude, Bauwerke, Brücken, Stände …).
ARTEN_ZUSAMMEN = {
    "gebaeude", "haus", "kiosk", "turm", "bruecke", "buehne", "stand", "tribuene", "gebaeude_teil",
    "stollen", "zelt", "haltestelle", "denkmal", "brunnen", "tor", "windrad",
}  # fmt: skip
NAMEN_ZUSAMMEN = re.compile(
    r"(?i)bahnhof|pavillon|kiosk|tankstelle|markise|veranda|buehne|marktstand|stand$|bruecke|laden|"
    r"haus|huette|scheune|schuppen|saloon|kirche|tribuene"
)
KLEINSTE_FLAECHE = 32 * 48  # kleinere Bilder sind Einzelteile (Schild, Fenster, Tür)
# Bilder mit dieser Art sind Einzelteile, auch wenn der Name passt (Haustür, Kirchenfenster).
ARTEN_EINZELN = {
    "tuer",
    "fenster",
    "schild",
    "bild",
    "lampe",
    "baum",
    "busch",
    "blume",
    "fahrzeug",
    "schrank",
    "deko",
}

PROMPT = """You analyse one pixel-art sprite from a top-down RPG (camera looks from above and
in front, like Pokemon or Stardew Valley: roofs are seen from above, front walls face the viewer,
the ground is the image plane). The grey background is not part of the sprite.
Sprite name: {name} (category: {art}). Each sprite pixel is shown as a {faktor}x{faktor} block.

Split the sprite into its components and give a bounding box for each as "box_2d":
[ymin, xmin, ymax, xmax], normalized to 0-1000 relative to the whole image (0 = top/left edge,
1000 = bottom/right edge). Types:
- dach: roof surfaces, including eaves, the roof or front beam/fascia of a porch, flat roof,
  canopy of a gas station
- schornstein: chimney, antenna, roof vent
- wand: facade / front wall of the building body (one box for the whole facade between roof
  and ground; windows and doors lie inside it), also side walls that are visible
- sockel: plinth / base strip at the bottom of a facade
- fenster: window
- tuer: door or open doorway (the box ends at the threshold on the ground)
- treppe: steps / stairs. Stairs show parallel step edges (stripes). Give "richtung": the side
  from which a walker steps onto the lowest step ("unten" = from the viewer side / bottom of the
  image, "links", "rechts", "oben"). Side stairs of a landing go down to the left or right.
- absatz: raised landing / platform in front of a door without roof
- veranda: porch floor / deck / boardwalk (wooden or stone floor strip in front of the house,
  often under a roof; a raised wooden sidewalk along a western facade is veranda, not sockel)
- gelaender: railing, balustrade, side cheek of a stair
- saeule: post, column, pillar (also porch posts, canopy pillars)
- markise: awning over a window or a stall
- schild: sign, lettering, signboard, clock face, advertising figure
- zaun: fence, low garden wall in front of the building
- mauer: retaining wall or vertical front edge of a raised landing/platform (no steps)
- pflanze: plant, flower box, bush belonging to the sprite
- steg: walkable boards / pier / deck surface (also a walkable stage floor)
- bruecke: bridge deck
- sonstiges: anything else (counter or stall table, barrel, machine, gas pump, bench, crate)

Rules: Boxes may overlap (a window lies inside the wall box). Be precise to the pixel edges
of each part. Do not confuse stairs (striped, step edges) with walls (flat vertical surface).
A raised landing's front edge without stripes is "mauer". Front steps
show at least two parallel step edges with lit treads between them; a single dark band or a plain
vertical face under a landing is "mauer". If a landing already has stairs at its left and right
ends, its front face is almost always "mauer", not a third stair. List every window, door, stair and
post separately; group identical small repeated details (roof tiles) into the parent part.
"""

SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "bauteile": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "typ": {"type": "STRING", "enum": sorted(TYPEN)},
                    "box_2d": {"type": "ARRAY", "items": {"type": "INTEGER"}},
                    "richtung": {"type": "STRING", "enum": ["unten", "links", "rechts", "oben"]},
                    "hinweis": {"type": "STRING"},
                },
                "required": ["typ", "box_2d"],
            },
        }
    },
    "required": ["bauteile"],
}


def zusammengesetzt(name: str, angabe: dict) -> bool:
    """Ob ein Katalogeintrag ein Bild aus mehreren Bauteilen ist (Gebäude, Bauwerk, Brücke, Stand).

    Warum: Nur für diese lohnt die Erkennung; ein Stuhl oder eine Laterne hat ihre Regeln schon
    (konturkollision.py). Beispiel: mf4Schule (gebaeude, 384 × 368) → True; mf4Laterne → False.
    Sonderfall: Kleine Bilder unter 32 × 48 Pixeln und Einzelteile (Tür, Fenster) nie.
    """
    art = angabe.get("art")
    if angabe["breite"] * angabe["hoehe"] < KLEINSTE_FLAECHE or art in ARTEN_EINZELN:
        return False
    return art in ARTEN_ZUSAMMEN or bool(NAMEN_ZUSAMMEN.search(name))


def faktor(breite: int, hoehe: int) -> int:
    """Ganzzahlige Vergrößerung auf etwa ZIELKANTE (mindestens 1). Beispiel: 384 × 368 → 2."""
    return max(1, ZIELKANTE // max(breite, hoehe))


def bild_fuer_gemini(angabe: dict, privat: Path) -> bytes:
    """Das Katalogbild als PNG: Ausschnitt, auf grauem Grund, ganzzahlig vergrößert (Pixel scharf)."""
    from PIL import Image

    bild = Image.open(privat / angabe["quelle"]).convert("RGBA")
    if "ausschnitt" in angabe:
        bild = bild.crop(tuple(angabe["ausschnitt"]))
    grund = Image.new("RGBA", bild.size, GRUND)
    grund.alpha_composite(bild)
    f = faktor(*bild.size)
    puffer = io.BytesIO()
    grund.convert("RGB").resize((bild.width * f, bild.height * f), Image.NEAREST).save(puffer, "PNG")
    return puffer.getvalue()


def anfrage_fuer(name: str, angabe: dict, png: bytes) -> dict:
    """Die Anfrage (generateContent) mit Bild, Beschreibung und JSON-Schema der Antwort."""
    text = PROMPT.format(name=name, art=angabe.get("art"), faktor=faktor(angabe["breite"], angabe["hoehe"]))
    teile = [
        {"inline_data": {"mime_type": "image/png", "data": base64.b64encode(png).decode()}},
        {"text": text},
    ]
    erzeugung = {"responseMimeType": "application/json", "responseSchema": SCHEMA, "temperature": 0}
    return {"contents": [{"role": "user", "parts": teile}], "generationConfig": erzeugung}


def umrechnen(box: list[int], breite: int, hoehe: int) -> list[int] | None:
    """Gemini-Rahmen [ymin, xmin, ymax, xmax] (0 bis 1000) in Bildpixel [x0, y0, x1, y1].

    Warum: Gemini normiert Rahmen auf das Bild; das gesendete Bild ist ganzzahlig vergrößert, also
    gilt die Normierung auch für das Katalogbild. Gerundet auf ganze Pixel, im Bild beschnitten.
    Beispiel: [500, 0, 1000, 250] bei 384 × 368 → [0, 184, 96, 368]. Sonderfall: leer → None.
    """
    if len(box) != 4:
        return None
    ymin, xmin, ymax, xmax = (min(NORM, max(0, int(v))) for v in box)
    x0, x1 = sorted((round(xmin * breite / NORM), round(xmax * breite / NORM)))
    y0, y1 = sorted((round(ymin * hoehe / NORM), round(ymax * hoehe / NORM)))
    return [x0, y0, x1, y1] if x1 > x0 and y1 > y0 else None


def bauteile_aus_antwort(antwort: dict, angabe: dict) -> list[dict]:
    """Die Bauteile einer Gemini-Antwort im Format von bauteile.json (Rahmen in Bildpixeln)."""
    text = "".join(
        t.get("text", "")
        for k in antwort.get("candidates", [])
        for t in k.get("content", {}).get("parts", [])
        if not t.get("thought")
    )
    try:
        roh = json.loads(text).get("bauteile", [])
    except json.JSONDecodeError as fehler:
        raise ValueError(f"Antwort ist kein JSON: {text[:200]}") from fehler
    teile = []
    for teil in roh:
        rahmen = umrechnen(teil.get("box_2d", []), angabe["breite"], angabe["hoehe"])
        if rahmen is None or teil.get("typ") not in TYPEN:
            continue
        eintrag = {"typ": teil["typ"], "rahmen": rahmen}
        if teil["typ"] == "treppe" and teil.get("richtung"):
            eintrag["richtung"] = teil["richtung"]
        if teil.get("hinweis"):
            eintrag["hinweis"] = teil["hinweis"][:120]
        teile.append(eintrag)
    return teile


def verbrauch(antwort: dict) -> tuple[int, int]:
    """(Eingabe-, Ausgabetoken samt Denken) aus usageMetadata, für die Kostenrechnung."""
    meta = antwort.get("usageMetadata", {})
    aus = meta.get("candidatesTokenCount", 0) + meta.get("thoughtsTokenCount", 0)
    return meta.get("promptTokenCount", 0), aus


def merke(ergebnisse: dict[str, list[dict]], modell: str, datei: Path = GEMINIDATEI) -> int:
    """Schreibt Vorschläge nach bauteile_gemini.json; Einträge aus bauteile.json (von Hand) nie.

    Ausgabe: Zahl geschriebener Einträge. Beispiel: {"gt7Saloon": [...]} → 1.
    """
    hand = lade_json(HANDDATEI)
    alt = lade_json(datei)
    heute = datetime.date.today().isoformat()
    zahl = 0
    for name, teile in sorted(ergebnisse.items()):
        if name in hand or not teile:
            continue
        alt[name] = {"bauteile": nachbessern(teile), "geprueft": f"gemini ({modell}), {heute}"}
        zahl += 1
    datei.write_text(json.dumps(dict(sorted(alt.items())), ensure_ascii=False, indent=1) + "\n", "utf-8")
    return zahl


def kandidaten(moebel: dict[str, dict]) -> list[str]:
    """Alle zusammengesetzten Einträge des Katalogs, nach Namen sortiert."""
    return sorted(n for n, a in moebel.items() if zusammengesetzt(n, a))


def probe(namen: list[str], modell: str, privat: Path, moebel: dict[str, dict]) -> dict[str, list[dict]]:
    """Sofort (voller Preis), Eintrag für Eintrag; meldet Token je Bild."""
    ergebnisse = {}
    for name in namen:
        angabe = moebel[name]
        antwort = anfrage(
            "POST",
            f"models/{modell}:generateContent",
            anfrage_fuer(name, angabe, bild_fuer_gemini(angabe, privat)),
        )
        ergebnisse[name] = bauteile_aus_antwort(antwort, angabe)
        ein, aus = verbrauch(antwort)
        print(f"{name}: {len(ergebnisse[name])} Bauteile, Token {ein} ein, {aus} aus")
    return ergebnisse


def stapel(namen: list[str], modell: str, privat: Path, moebel: dict[str, dict], ziel: Path) -> None:
    """Stapelbetrieb (halber Preis): Anfragen in Teilen unter der Größengrenze, Namen gemerkt."""
    from pipeline.abenteuer.geminibilder import _stapel_teilen

    eintraege = [
        {"request": anfrage_fuer(n, moebel[n], bild_fuer_gemini(moebel[n], privat)), "metadata": {"key": n}}
        for n in namen
        if (privat / moebel[n]["quelle"]).is_file()
    ]
    print(f"{len(eintraege)} von {len(namen)} Bildern vorhanden")
    merker = json.loads((ziel / STAPELDATEI).read_text("utf-8")) if (ziel / STAPELDATEI).exists() else []
    for nummer, teil in enumerate(_stapel_teilen(eintraege), 1):
        inhalt = {
            "batch": {"display_name": f"bauteile-{nummer}", "input_config": {"requests": {"requests": teil}}}
        }
        antwort = anfrage("POST", f"models/{modell}:batchGenerateContent", inhalt)
        merker.append({"name": antwort["name"], "modell": modell, "fertig": False})
        print(f"Stapel {antwort['name']}: {len(teil)} Bilder")
    (ziel / STAPELDATEI).write_text(json.dumps(merker, indent=2), "utf-8")


def abholen(ziel: Path, moebel: dict[str, dict]) -> None:
    """Fertige Stapel abholen, Bauteile nach bauteile_gemini.json, Token zusammenzählen."""
    merker = json.loads((ziel / STAPELDATEI).read_text("utf-8"))
    for s in (s for s in merker if not s["fertig"]):
        antwort = anfrage("GET", s["name"])
        zustand = _suche(antwort, "state")
        print(f"{s['name']}: {zustand}")
        if zustand not in ("BATCH_STATE_SUCCEEDED", "JOB_STATE_SUCCEEDED"):
            continue
        ergebnisse, ein, aus, fehler = {}, 0, 0, []
        liste = _suche(antwort, "inlinedResponses")
        if isinstance(liste, dict):  # die Antwort schachtelt die Liste noch einmal
            liste = liste.get("inlinedResponses", [])
        for e in liste or []:
            name = e.get("metadata", {}).get("key", "")
            try:
                ergebnisse[name] = bauteile_aus_antwort(e["response"], moebel[name])
                ein, aus = ein + verbrauch(e["response"])[0], aus + verbrauch(e["response"])[1]
            except (KeyError, ValueError) as grund:
                fehler.append(f"{name}: {grund}")
        print(f"{merke(ergebnisse, s['modell'])} Einträge geschrieben, Token {ein} ein, {aus} aus")
        for f in fehler:
            print("Fehler", f)
        s["fertig"], s["token"] = True, [ein, aus]
    (ziel / STAPELDATEI).write_text(json.dumps(merker, indent=2), "utf-8")


def main(argv: list[str] | None = None) -> int:
    """Befehlszeile; Aufruf im Dateikopf."""
    teil = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teil.add_argument("befehl", choices=["liste", "probe", "stapel", "abholen", "nachbessern"])
    teil.add_argument("namen", nargs="*")
    teil.add_argument("--nur", default="", help="Namen mit Komma (stapel)")
    teil.add_argument("--neu", action="store_true", help="stapel: nur Einträge ohne Vorschlag")
    teil.add_argument("--modell", default=MODELL)
    teil.add_argument("--ziel", type=Path, default=ARBEIT)
    teil.add_argument("--privat", type=Path, default=None)
    args = teil.parse_args(argv)
    from pipeline.abenteuer.anordnung_bild import privat as privat_paket

    moebel, privat = lade_moebel(), args.privat or privat_paket()
    args.ziel.mkdir(parents=True, exist_ok=True)
    alle = kandidaten(moebel)
    if args.befehl == "liste":
        print(
            "\n".join(
                f"{n} ({moebel[n].get('art')}, {moebel[n]['breite']}×{moebel[n]['hoehe']})" for n in alle
            )
        )
        print(f"{len(alle)} zusammengesetzte Einträge")
        return 0
    if args.befehl == "abholen":
        abholen(args.ziel, moebel)
        return 0
    if args.befehl == "nachbessern":
        daten = lade_json(GEMINIDATEI)
        neu = {n: {**e, "bauteile": nachbessern(e["bauteile"])} for n, e in daten.items()}
        print(f"{sum(neu[n] != daten[n] for n in daten)} Einträge nachgebessert")
        GEMINIDATEI.write_text(json.dumps(neu, ensure_ascii=False, indent=1) + "\n", "utf-8")
        return 0
    if privat is None:
        print("Kein privates Paket (Bilder).")
        return 1
    namen = args.namen or ([n for n in args.nur.split(",") if n] if args.nur else alle)
    if args.neu:
        schon = set(lade_json(GEMINIDATEI)) | set(lade_json(HANDDATEI))
        namen = [n for n in namen if n not in schon]
    if args.befehl == "probe":
        print(f"{merke(probe(namen, args.modell, privat, moebel), args.modell)} Einträge geschrieben")
    else:
        stapel(namen, args.modell, privat, moebel, args.ziel)
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""Kartenbauer des Schach-Abenteuers: aus einer Szenenbeschreibung eine Tiled-Karte.

Warum: Von Hand gesetzte Karten wurden unlogisch (Wände als Blöcke, halbe Möbel, Dinge am Boden statt
auf dem Tisch; Rückmeldung des Autors, 9.11.2026). Der Kartenbauer kennt die Regeln einmal:
Wände aus Wandkrone und Wandfläche, Gegenstände „auf“ einem anderen oder „an der Wand“, nichts über
den Rand, keine Überlappung von Möbeln mit Kollision.

Eingabe: ``inhalte/abenteuer/szenen/<datei>.json`` (Format in ``inhalte/abenteuer/szenen/README.md``).
Ausgabe: die Tiled-Karte (``inhalte/abenteuer/karten/<datei>.json``) im Raster des Platzhalters
(Kollision), Möbel als Objekte; das Hintergrundbild zeichnet ``kartenbild.py`` aus der gekauften
Grafik. Aufruf: ``python -m pipeline.abenteuer.kartenbau inhalte/abenteuer/szenen/*.json``.
"""

import json
import sys
from pathlib import Path

from pipeline.abenteuer.bauweisen import (
    bodenkacheln_mit_kollision,
    darf_ueberlappen,
    doppelte_eintraege,
    gelaender_am_loch,
)
from pipeline.abenteuer.belebung import lade_texte, pruefe_belebung, pruefe_standorte
from pipeline.abenteuer.bodenteile import lege_bodenteile
from pipeline.abenteuer.feinbericht import feinbefunde, feinhinweise
from pipeline.abenteuer.kartenregeln import SITZMOEBEL, pruefe_regeln

# Rasterzeichen und Tiled-Ausgabe stehen in kartentiled.py; viele Module holen sie weiter hier.
from pipeline.abenteuer.kartentiled import (  # noqa: F401
    GESPERRT,
    JAHRESZEITEN,
    LEER,
    RICHTUNGEN,
    TOENUNGEN,
    WAND,
    WASSER,
    K,
    sitzrichtung,
    tiled,
)
from pipeline.abenteuer.kehren import kehrenbefunde
from pipeline.abenteuer.kollisionfein import feinlisten, gib_frei_fein
from pipeline.abenteuer.kollisionspinsel import gib_frei, pinselbefunde, pinselfelder, pinselhinweise
from pipeline.abenteuer.maske import maskenfelder
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.objektform import deckkraftangabe, formangaben, geformt, hat_form
from pipeline.abenteuer.objektkollision import kollision_an, kollisionsbefunde
from pipeline.abenteuer.saum import saumbefunde
from pipeline.abenteuer.stadtgroesse import ortseintrag, pruefe_gebaeude, zaehlt_als_stadtkarte
from pipeline.abenteuer.varianten import vergleiche_mit_a

HAUPT = Path(__file__).resolve().parents[2]
INHALTE = HAUPT / "inhalte" / "abenteuer"
# Wörter in Dateinamen, die auf ein Bauteil statt eines ganzen Gegenstands deuten.
BAUTEIL = ("modular", "_left", "_right", "_top", "_bottom", "_part", "_half", "_layer")


def lade(pfad: Path) -> dict:
    return json.loads(pfad.read_text(encoding="utf-8"))


def raster(szene: dict) -> list[str]:
    zeilen = szene["raster"]
    breite = max(len(z) for z in zeilen)
    return [z.ljust(breite, LEER) for z in zeilen]


def platziere(szene: dict, moebel: dict) -> tuple[list[dict], list[str]]:
    """Die Möbel der Szene in Pixeln, mit Tiefe und Kollision; dazu Befunde der Prüfung.

    ``feld`` = linke obere Kachel; ``auf`` = Kennung eines anderen Möbels (mittig auf dessen
    Oberseite, gezeichnet davor, ohne Kollision); ``an_wand`` = hängt an der Wandfläche (hinter
    allem, ohne Kollision); ``vorn`` = nach dem Fuß gezeichnet, ohne Kollision (Fahnenmast vor einer
    Fassade); ``versatz`` = Feinschub in Pixeln; ``wenn`` = nur sichtbar, wenn die Bedingung beim
    Betreten gilt (app/src/abenteuer/regeln/figurbedingung.ts); Gegenstände darauf erben sie.
    ``kollision``, ``maske`` am Eintrag übersteuern den Katalog an dieser Stelle (objektkollision.py);
    ``freigeben`` der Szene (Kollisionspinsel) nimmt berührte Kacheln aus den Masken (kollisionspinsel.py).
    """
    befunde: list[str] = []
    nach_id: dict[str, dict] = {}
    gesetzt: list[dict] = []
    for nummer, eintrag in enumerate(szene.get("objekte", [])):
        angabe = geformt(moebel.get(eintrag["moebel"]), eintrag)  # Drehung, Maßstab (objektform.py)
        if not angabe:
            befunde.append(f"Möbel {eintrag['moebel']} fehlt in inhalte/abenteuer/moebel/")
            continue
        if any(w in angabe["quelle"].lower() for w in BAUTEIL) and not eintrag.get("bauteil_ok"):
            befunde.append(f"{eintrag['moebel']} ist ein Bauteil ({angabe['quelle'].split('/')[-1]})")
        dx, dy = eintrag.get("versatz", [0, 0])
        if "auf" in eintrag:
            basis = nach_id.get(eintrag["auf"])
            if not basis:
                befunde.append(f"{eintrag['moebel']}: Unterlage {eintrag['auf']} fehlt (vorher nennen)")
                continue
            # Mit „sichtbar_breite“ (Möbelangabe, deckende Pixel) zählt die sichtbare Breite; sonst
            # die Bildbreite mit 4 Pixeln Spiel für den durchsichtigen Rand der Unterlage.
            unterlage = moebel[basis["name"]]
            spiel = 0 if "sichtbar_breite" in unterlage else 4
            sichtbar = angabe.get("sichtbar_breite", angabe["breite"])
            if sichtbar > unterlage.get("sichtbar_breite", unterlage["breite"]) - spiel:
                befunde.append(f"{eintrag['moebel']} ist breiter als die Platte von {eintrag['auf']}")
            x = basis["x"] + (basis["breite"] - angabe["breite"]) // 2 + dx
            # Fuß des Gegenstands auf der Tischplatte: gut die Hälfte der Unterlage von oben.
            y = basis["y"] + basis["hoehe"] * 3 // 5 - angabe["hoehe"] + dy
            tiefe, kollision = basis["tiefe"] + 1, False
        else:
            x, y = eintrag["feld"][0] * K + dx, eintrag["feld"][1] * K + dy
            an_wand = eintrag.get("an_wand", False)
            # „vorn“: nach dem Fuß gezeichnet, aber ohne Kollision und Überlappungsprüfung (Fahnenmast
            # oder Laterne vor einer Fassade, deren Bild bis zur Treppe Kollisionsfläche ist).
            vorn = eintrag.get("vorn", False)
            # Ohne Kollision (Teppich, flache Dinge am Boden) liegt das Möbel unter allem. Die Tiefe
            # folgt dem Katalog: Ein an einer Stelle durchgehbares Sofa bleibt nach dem Fuß gezeichnet.
            flach = not angabe.get("kollision") and not an_wand and not vorn
            tiefe = 0 if an_wand else 1 if flach else y + angabe["hoehe"] - K // 2
            # Übersteuerung „kollision“ am Eintrag (Karteneditor, objektkollision.py).
            kollision = kollision_an(angabe, eintrag) and not an_wand and not vorn
        stueck = {
            "name": eintrag["moebel"],
            "x": x,
            "y": y,
            "breite": angabe["breite"],
            "hoehe": angabe["hoehe"],
            "tiefe": tiefe + eintrag.get("ebene", 0),  # Ebene aus dem Karteneditor (objektform.py)
            **({"ebene": eintrag["ebene"]} if eintrag.get("ebene") else {}),
            "kollision": kollision,
            # Begehbare Reihen unten im Bild (Gang vor dem Motel, Veranda), Angabe „frei_unten“.
            "frei_unten": angabe.get("frei_unten", 0),
            **(({"maske": angabe["maske"]} if "maske" in angabe else {}) | formangaben(eintrag)),
            **deckkraftangabe(eintrag),  # Deckkraft 25 bis 75 % (objektform.py), nur das Bild
            # Eigene Maske der Szene, geformt, für die Eigenschaft „maske“ der Tiled-Karte; die feine
            # Maske (kollisionfein.py) dazu als „maske_fein“.
            **({"objektmaske": angabe["maske"]} if maske_ans_objekt(angabe, eintrag, kollision) else {}),
            **({"maske_fein": angabe["maske_fein"]} if "maske_fein" in angabe else {}),
            **({"objektmaske_fein": angabe["maske_fein"]} if am_objekt(angabe, eintrag) else {}),
            "id": eintrag.get("id", f"{eintrag['moebel']}@{nummer}"),
            **_belegung(moebel.get(eintrag["moebel"]), angabe, eintrag),
        }
        # Bedingte Möbel (wenn, Sprache von bedingung.py): Was auf einem bedingten Möbel steht,
        # erbt dessen Bedingung (Calloways Tisch mit Brett). Die App zeigt sie nur, wenn sie gilt.
        wenn = eintrag.get("wenn") or (nach_id.get(eintrag.get("auf", ""), {}).get("wenn"))
        if wenn:
            stueck["wenn"] = wenn
        nach_id[stueck["id"]] = stueck
        gesetzt.append(stueck)
    lege_bodenteile(gesetzt, moebel)  # Bodenkacheln über einer Treppe (bodenteile.py)
    gib_frei(gesetzt, szene)  # Freigaben des Kollisionspinsels stechen Möbel und Masken
    gib_frei_fein(gesetzt, szene)  # ebenso die feinen Freigaben, Zelle für Zelle (kollisionfein.py)
    return gesetzt, befunde


def maske_ans_objekt(angabe: dict, eintrag: dict, kollision: bool) -> bool:
    """Ob die grobe Maske als Eigenschaft ``maske`` an das Tiled-Objekt muss: eigene Maske der Szene,
    geformte feine Maske oder ein sperrendes Möbel mit ``massstab``.

    Warum: Die App rechnet die Kollision selbst aus Katalog und Objekt (``oberwelt/moebelform.ts``);
    mit Maßstab nähme sie die Standardregel auf dem skalierten Bild. Mit der Maske am Objekt sperrt
    sie dieselben Kacheln wie der Kartenbau (objektmassstab.py).
    Beispiel: ``{"moebel": "iw5Eisenwaren", "massstab": 1.2}`` → True; ein skalierter Teppich → False.
    """
    skaliert = kollision and "maske" in angabe and float(eintrag.get("massstab", 1)) != 1
    return "maske" in eintrag or am_objekt(angabe, eintrag) or skaliert


def am_objekt(angabe: dict, eintrag: dict) -> bool:
    """Ob die feine Maske an das Tiled-Objekt muss: eigene des Eintrags oder geformt (gedreht,
    gespiegelt). Die ungeformte des Katalogs (feinmasken.py) liest die App aus moebel.json; das spart
    gut ein Megabyte im Paket. Gleiche Regel: App ``oberwelt/moebelform.geformtAusObjekt``."""
    return "maske_fein" in angabe and ("maske_fein" in eintrag or hat_form(eintrag))


def _belegung(roh: dict | None, angabe: dict, eintrag: dict) -> dict:
    """Mit feiner Katalogmaske (feinmasken.py, KARTENREGELN 10.88) die grobe Fläche des Möbels ohne
    sie, als ``maske_belegung`` (None: Standardregel): Die Belegung eines Raums (8.2) zählt, wo Möbel
    stehen, nicht nur ihre Standfläche. Ohne feine Katalogmaske: nichts."""
    if roh is None or "maske_fein" not in roh or "maske_fein" not in angabe or "maske_fein" in eintrag:
        return {}
    grob = geformt({k: v for k, v in roh.items() if k != "maske_fein"}, eintrag) or {}
    return {"maske_belegung": grob.get("maske")}


def sperrfelder(stueck: dict) -> set[tuple[int, int]]:
    """Felder, die ein Möbel mit Kollision sperrt (Regel in maske.py: ohne oberste Kachelreihe,
    ``frei_unten`` oder eigene ``maske``)."""
    if not stueck["kollision"]:
        return set()
    x0, y0 = stueck["x"] // K, stueck["y"] // K
    return {(x0 + a, y0 + b) for a, b in maskenfelder(stueck)}


def ist_sitzmoebel(name: str) -> bool:
    """Ist das Möbel ein Sitzplatz? Beispiel: „cc4StuhlVorn“ → ja, „cc5Tisch“ → nein."""
    return any(w in name.lower() for w in SITZMOEBEL)


def pruefe(
    zeilen: list[str],
    gesetzt: list[dict],
    punkte: list[dict],
    aussen: bool = False,
    moebel: dict | None = None,
    betretbar: frozenset = frozenset(),
) -> list[str]:
    """Rand, Wände, Überlappungen und zugestellte Auslöser.

    Außen ist die Randwand nur Kollision und zeigt den Boden dahinter (KARTENREGELN 10.2): Zäune,
    Hecken und Gleise dürfen dort bis in die letzte Spalte oder Reihe stehen.
    Mit ``moebel`` (Katalog) kennt die Prüfung innen das Geländer am Treppenloch (bauweisen.py): Es
    steht am Rand der Leere und seine Teile überlappen sich. ``betretbar``: Kacheln, auf denen die
    Mitte des Helden trotz feiner Sperren stehen kann; ein Auslöser dort ist nicht zugestellt."""
    befunde = []
    breite, hoehe = len(zeilen[0]) * K, len(zeilen) * K
    belegt: dict[tuple[int, int], str] = {}
    for s in gesetzt:
        if s["x"] < 0 or s["y"] < 0 or s["x"] + s["breite"] > breite or s["y"] + s["hoehe"] > hoehe:
            befunde.append(f"{s['name']} ragt über den Kartenrand")
        unten = (s["y"] + s["hoehe"] - 1) // K
        for feld in sperrfelder(s):
            # Hohe Möbel an der Nordwand überdecken die Wandfläche; nur der Fuß muss auf Boden stehen.
            auf_wand = (
                0 <= feld[1] < len(zeilen)
                and 0 <= feld[0] < len(zeilen[0])
                and zeilen[feld[1]][feld[0]] in GESPERRT
            )
            am_rand = feld[0] in (0, len(zeilen[0]) - 1) or feld[1] in (0, len(zeilen) - 1)
            if auf_wand and aussen and am_rand and zeilen[feld[1]][feld[0]] == WAND:
                auf_wand = False
            if auf_wand and not aussen and gelaender_am_loch(s["name"], moebel, zeilen, feld):
                auf_wand = False  # Geländer am Rand eines Treppenlochs (bauweisen.py)
            if auf_wand and feld[1] == unten:
                befunde.append(f"{s['name']} steht auf Wand oder Wasser bei {feld}")
            if feld in belegt and not (not aussen and darf_ueberlappen(s["name"], belegt[feld], moebel)):
                befunde.append(f"{s['name']} überlappt {belegt[feld]} bei {feld}")
            belegt[feld] = s["name"]
    for p in punkte:
        feld = tuple(p["feld"])
        # Gegenstände zum Ansehen dürfen auf einem Möbel liegen (man steht davor, wie beim Brett);
        # eine sitzende Figur sitzt auf einem Stuhl, einer Bank oder einem Sofa.
        sitzplatz = sitzrichtung(p) and feld in belegt and ist_sitzmoebel(belegt[feld])
        if feld in belegt and not p.get("auf_moebel") and not sitzplatz and feld not in betretbar:
            befunde.append(f"{p['name']} ist von {belegt[feld]} zugestellt")
    return befunde


def ist_archiv(pfad: Path) -> bool:
    """Varianten einer Karte, für die der Autor schon gewählt hat (es gibt ``<karte>-a.json``).

    Warum: Nach einer Wahl bleiben die alten A, B und C als Archiv liegen; sie werden nicht mehr
    gepflegt, also prüfen die Regeln 10.51 und 10.53 sie nicht.
    Beispiel: ``varianten/cedar-creek-aussen-b.json`` neben ``cedar-creek-aussen-a.json``.
    """
    if pfad.parent.name != "varianten" or len(pfad.stem) < 3 or pfad.stem[-2] != "-":
        return False
    return (pfad.parent / f"{pfad.stem[:-2]}-a.json").exists()


def baue(pfad: Path) -> list[str]:
    """Baut eine Szene; gibt die Befunde zurück (leer = in Ordnung) und schreibt die Karte."""
    szene = lade(pfad)
    moebel = lade_moebel()
    zeilen = raster(szene)
    gesetzt, befunde = platziere(szene, moebel)
    punkte = szene.get("ausloeser", []) + szene.get("figuren", [])
    from pipeline.abenteuer.durchgang import betretbare_kacheln  # braucht dieses Modul

    betretbar = frozenset(betretbare_kacheln(zeilen, gesetzt, szene))
    befunde += pruefe(zeilen, gesetzt, punkte, szene.get("art") == "aussen", moebel, betretbar)
    befunde += doppelte_eintraege(szene, moebel)  # zweimal übertragen (bauweisen.py)
    befunde += pruefe_regeln(szene, zeilen, gesetzt, moebel)
    befunde += kollisionsbefunde(szene, moebel)  # Übersteuerung im Karteneditor (Regel 10.69)
    befunde += pinselbefunde(szene, zeilen)  # Kollisionspinsel (kollisionspinsel.py)
    befunde += feinbefunde(szene, zeilen, betretbar)  # Kollision fein (kollisionfein.py, feinbericht.py)
    from pipeline.abenteuer.engstelle import pruefe_engstellen  # hier: braucht platziere

    befunde += pruefe_engstellen(szene, zeilen, gesetzt, moebel)[0]
    # Hier eingebunden statt oben: zusammenhang.py nutzt die Konstanten dieses Moduls.
    from pipeline.abenteuer.zusammenhang import pruefe_zusammenhang

    befunde += pruefe_zusammenhang(szene, zeilen, gesetzt, moebel)
    befunde += kehrenbefunde(szene, zeilen)
    befunde += saumbefunde(szene, zeilen, lade(INHALTE / "materialien.json")["boeden"])
    if not ist_archiv(pfad):
        befunde += pruefe_gebaeude(szene, gesetzt, moebel)
        ort = ortseintrag(szene["karte"]) or {}
        stadt = zaehlt_als_stadtkarte(szene) and "groesse" in ort
        befunde += pruefe_belebung(szene, ort.get("art", "stadt"), stadt, lade_texte())
        belegt = {feld: s["name"] for s in gesetzt for feld in sperrfelder(s)}
        belegt |= {feld: "gemalter Sperre" for feld in pinselfelder(szene)[0] | set(feinlisten(szene)[0])}
        befunde += pruefe_standorte(szene, zeilen, GESPERRT, belegt)
    if pfad.parent.name != "varianten":
        # Ausrichtung der Bilder (Regel 10.78): Befund, seit alle Karten nachgezogen sind
        # (15.11.2026); Varianten zur Wahl prüft sie wie das Werkzeug ausrichtung.py nicht.
        from pipeline.abenteuer.ausrichtung import pruefe_szene

        befunde += [f"Ausrichtung: {b.moebel} {b.feld}: {b.text}" for b in pruefe_szene(szene, moebel)]
        # Lage am Tisch (10.79) und Anordnung (10.80 bis 10.87, Befund seit 15.11.2026); was Pixel
        # braucht, nur mit dem privaten Paket.
        from pipeline.abenteuer.anordnung import pruefe_anordnung
        from pipeline.abenteuer.tischlage import BESTAND
        from pipeline.abenteuer.tischlage import pruefe_szene as tischlage

        sitze = BESTAND[0] is not None
        befunde += [f"Tischlage: {b.moebel} {b.feld}: {b.text}" for b in tischlage(szene, moebel, sitze)]
        befunde += [f"Anordnung: {b}" for b in pruefe_anordnung(szene)]
        from pipeline.abenteuer.treppenloch import pruefe_szene as treppenloch  # 10.89

        befunde += [f"Treppenloch: {b}" for b in treppenloch(szene, zeilen, gesetzt, moebel)]
        from pipeline.abenteuer.gedeck import pruefe_szene as gedeck  # 10.91

        befunde += [f"Gedeck: {b}" for b in gedeck(szene, gesetzt, moebel)]
    befunde += vergleiche_mit_a(pfad.resolve(), szene, lade)
    if "toenung" in szene and szene["toenung"] not in TOENUNGEN:
        befunde.append(f"Tönung {szene['toenung']!r} unbekannt (erlaubt: {', '.join(TOENUNGEN)})")
    if "jahreszeit" in szene and szene["jahreszeit"] not in JAHRESZEITEN:
        befunde.append(f"Jahreszeit {szene['jahreszeit']!r} unbekannt (erlaubt: {', '.join(JAHRESZEITEN)})")
    ziel = INHALTE / szene["datei"]
    ziel.parent.mkdir(parents=True, exist_ok=True)  # Varianten: karten/varianten/
    vorlage = lade(INHALTE / "karten" / "maple-falls-dachboden.json")
    ziel.write_text(
        json.dumps(tiled(szene, zeilen, gesetzt, vorlage), ensure_ascii=False, indent=1) + "\n",
        encoding="utf-8",
    )
    return befunde


def hinweise(pfad: Path) -> list[str]:
    """Hinweise, die nicht als Befund zählen: Fahrzeuge quer zur Fahrbahn (10.65), Felswände, die frei
    enden (10.74), überflüssige Pinselkacheln. Ausrichtung (10.78) und Anordnung (10.80–10.87) sind
    Befunde in ``baue``."""
    from pipeline.abenteuer.fahrzeuge import fahrzeughinweise
    from pipeline.abenteuer.hoehen import hoehenhinweise, schleusenfelder

    szene, moebel = lade(pfad), lade_moebel()
    gesetzt = platziere(szene, moebel)[0]
    fahrzeuge = fahrzeughinweise(szene, raster(szene), gesetzt, moebel)
    frei = pinselfelder(szene)[1] or feinlisten(szene)[1]
    ohne_pinsel = platziere({**szene, "freigeben": [], "freigeben_fein": []}, moebel)[0] if frei else gesetzt
    pinsel = pinselhinweise(szene, raster(szene), ohne_pinsel)
    pinsel += feinhinweise(szene, raster(szene), ohne_pinsel)  # Kollision fein (feinbericht.py)
    from pipeline.abenteuer.engstelle import pruefe_engstellen

    pinsel += pruefe_engstellen(szene, raster(szene), gesetzt, moebel)[1]
    doppelt = doppelte_eintraege(szene, moebel, mit_kollision=False)  # flach doppelt gezeichnet
    doppelt += bodenkacheln_mit_kollision(szene, moebel)  # Regel 10.90 (bauweisen.py)
    from pipeline.abenteuer.tuergroesse import pruefe_szene as tuergroesse  # Regel 10.92

    doppelt += tuergroesse(szene, moebel)
    return fahrzeuge + hoehenhinweise(szene, raster(szene), schleusenfelder(gesetzt)) + pinsel + doppelt


def main() -> int:
    fehler = 0
    for name in sys.argv[1:]:
        befunde = baue(Path(name))
        print(f"{name}: {'in Ordnung' if not befunde else ''}")
        for b in befunde:
            print(f"  - {b}")
        for h in hinweise(Path(name)):
            print(f"  ~ Hinweis: {h}")
        fehler += len(befunde)
    return 1 if fehler else 0


if __name__ == "__main__":
    sys.exit(main())

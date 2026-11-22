"""Geräuschquellen je Karte: wo das Dauergeräusch einer Karte herkommt (Auftrag des Hauptchats,
22.11.2026, räumliche Geräusche).

Warum: Das Dauergeräusch einer Karte (orte.json, ``geraeusch``) klang überall gleich laut, nur gut
3 dB unter der Musik. Am Wasserfall im Park war es so laut wie an der Bank am Eingang. Jetzt liegt
es überall auf einem leisen Grundpegel und wird erst in der Nähe seiner Quelle lauter
(app/src/abenteuer/ton/geraeuschraum.ts). Wo die Quellen liegen, leitet dieses Modul aus der Szene
ab und schreibt es als Eigenschaft ``geraeuschquellen`` in die Tiled-Karte. Die App lädt dafür keine
weitere Datei.

Ableitung (Regel: docs/spiel/21_Klangplan.md, B1 „räumlich“):
1. Wasserkacheln (``~`` und Brücken über Wasser, ``bruecken``) sind Quelle, wenn das Geräusch der
   Karte ein Wassergeräusch der Fläche ist (``FLAECHENWASSER``: Fluss, Bach, Meer …). Ein Teich
   klingt nicht nach Wasserfall: Bei ``wasserfall`` zählt nur das Möbel Wasserfall.
2. Möbel nach Namen (``OBJEKTARTEN``): Wasserfall, Brunnen, Turmuhr, Mühle, Grill, Marktstand,
   Bahnhof. Quelle sind sie nur, wenn ihre Art das Geräusch der Karte ist. Die anderen meldet das
   Werkzeug als Hinweis („ohne Schleife“): Dort fehlt der Karte das passende Dauergeräusch.
3. Von Hand in der Szene: ``"geraeuschquellen": false`` schaltet alle ab;
   ``{"ohne": ["wasser"], "dazu": [{"feld": [x, y]}, {"bereich": [x, y, b, h]}]}`` nimmt
   abgeleitete Arten heraus („wasser“ für die Kacheln, sonst die Art) und fügt Stellen hinzu
   (Art: das Geräusch der Karte, wenn nicht ``art`` dabeisteht).

Format der Eigenschaft: JSON ``[{"art": "wasserfall", "felder": [[x, y, b, h], …]}]``, Felder in
Kacheln. Wasser als Läufe je Zeile (Höhe 1), Möbel als ihr Rechteck.

Aufruf (im Hauptordner):
    python -m pipeline.abenteuer.geraeuschquellen [--ort KENNUNG] [--schreiben] [--bild DATEI]
--schreiben trägt die Eigenschaft in alle Karten ein (der Kartenbau tut es bei jedem Bau selbst),
--bild zeichnet eine Vorschau mit Ringen (braucht Pillow, sonst nur die Liste).
"""

import argparse
import json
import math
import re
import sys
from pathlib import Path

HAUPT = Path(__file__).resolve().parents[2]
INHALTE = HAUPT / "inhalte" / "abenteuer"
SZENEN = INHALTE / "szenen"
ORTE = INHALTE / "orte.json"
KACHEL = 16
WASSER = "~"
EIGENSCHAFT = "geraeuschquellen"
# Was für die Kacheln steht, wenn eine Szene sie mit "ohne" abschaltet.
WASSERKACHELN = "wasser"
# Wassergeräusche, die von der ganzen Fläche kommen (bei Wasserfall nur vom Fall).
FLAECHENWASSER = frozenset({"fluss", "bach", "meer", "brandung", "see", "wellen", "hafen", "kanal"})
# Möbelname (Teil, ohne Groß- und Kleinschreibung) → Art des Geräuschs.
OBJEKTARTEN = (
    (re.compile(r"wasserfall", re.I), "wasserfall"),
    (re.compile(r"brunnen", re.I), "brunnen"),
    (re.compile(r"turmuhr|bahnhofsuhr|grosseuhr", re.I), "uhr_ticken"),
    (re.compile(r"muehle|windrad", re.I), "windrad"),
    (re.compile(r"grill", re.I), "grill"),
    (re.compile(r"marktstand", re.I), "markt"),
    (re.compile(r"bahnhof(?!suhr)", re.I), "bahn"),
)
# Bilder, Schilder und Bänke tragen solche Wörter im Namen, machen aber kein Geräusch.
STUMM = re.compile(r"foto|bild|schild|plakat|bank", re.I)
# Art der Musikerquellen (Zusatzspur der Ortsthemen) und die Jukebox, die immer eine ist.
MUSIK = "musik"
JUKEBOX = re.compile(r"jukebox", re.I)
# Ringe der Vorschau in Kacheln: voll bis 2, halb um 7, still ab 12 (wie geraeuschraum.ts).
RINGE = (2, 7, 12)


def lade(pfad: Path) -> dict:
    """Liest eine JSON-Datei."""
    return json.loads(pfad.read_text(encoding="utf-8"))


def kartenart(kennung: str, orte: dict) -> str | None:
    """Das Dauergeräusch einer Karte als Stamm (``klang/wasserfall.m4a`` → ``wasserfall``) oder None.

    Beispiel: ``mapleFalls.park`` → ``wasserfall``; ``mapleFalls.zimmer`` hat auch eins.
    """
    for ort in orte["orte"]:
        for karte in ort.get("karten", []):
            if karte.get("kennung") == kennung and karte.get("geraeusch"):
                return re.sub(r"\.(m4a|ogg)$", "", karte["geraeusch"].split("/")[-1])
    return None


def wasserlaeufe(zeilen: list[str], bruecken: list[str]) -> list[list[int]]:
    """Wasser als Läufe je Zeile ``[x, y, b, 1]``; Brücken liegen über Wasser und zählen mit.

    Beispiel: Zeile 3 ``"..~~~.~"`` → ``[[2, 3, 3, 1], [6, 3, 1, 1]]``.
    """
    nass = {WASSER, *bruecken}
    laeufe: list[list[int]] = []
    for y, zeile in enumerate(zeilen):
        x = 0
        while x < len(zeile):
            if zeile[x] not in nass:
                x += 1
                continue
            anfang = x
            while x < len(zeile) and zeile[x] in nass:
                x += 1
            laeufe.append([anfang, y, x - anfang, 1])
    return laeufe


def objektart(name: str) -> str | None:
    """Die Geräuschart eines Möbels nach seinem Namen; None, wenn es keins macht.

    Beispiel: ``mf12WasserfallBand`` → ``wasserfall``; ``rv5Bahnhofsuhr`` → ``uhr_ticken``.
    """
    if STUMM.search(name):
        return None
    for muster, art in OBJEKTARTEN:
        if muster.search(name):
            return art
    return None


def objektquellen(karte: dict) -> list[tuple[str, list[int], str]]:
    """Möbel der Tiled-Karte, die eine Geräuschart haben: (Art, Rechteck in Kacheln, Name)."""
    treffer = []
    for ebene in karte.get("layers", []):
        for o in ebene.get("objects", []):
            art = objektart(o.get("name", "")) if o.get("type") == "moebel" else None
            if not art:
                continue
            treffer.append((art, rechteck(o), o["name"]))
    return treffer


def handangaben(szene: dict) -> tuple[bool, set[str], list[tuple[str | None, list[int]]]]:
    """Die Angabe ``geraeuschquellen`` der Szene: (an, ohne, dazu). Ohne Angabe (True, {}, [])."""
    angabe = szene.get(EIGENSCHAFT)
    if angabe is False:
        return False, set(), []
    if not isinstance(angabe, dict):
        return True, set(), []
    dazu = []
    for eintrag in angabe.get("dazu", []):
        x, y = eintrag.get("feld", eintrag.get("bereich", [0, 0]))[:2]
        b, h = eintrag["bereich"][2:4] if "bereich" in eintrag else (1, 1)
        dazu.append((eintrag.get("art"), [x, y, b, h]))
    return True, set(angabe.get("ohne", [])), dazu


def rechteck(o: dict) -> list[int]:
    """Das Rechteck eines Tiled-Objekts in Kacheln; Punkte (Figuren) als 1 × 1."""
    x, y = math.floor(o["x"] / KACHEL), math.floor(o["y"] / KACHEL)
    b = max(1, math.ceil(o.get("width", KACHEL) / KACHEL))
    h = max(1, math.ceil(o.get("height", KACHEL) / KACHEL))
    return [x, y, b, h]


def musikquellen(szene: dict, karte: dict) -> list[list[int]]:
    """Wo der Musiker spielt (Zusatzspur der Ortsthemen, app/src/abenteuer/ton/spurenmischung.ts):
    jede Jukebox und jedes Objekt, das die Szene unter ``musikquellen`` nennt (Figur, Möbel,
    Auslöser; Name wie in der Tiled-Karte). Beispiel Diner: mf12JukeboxAn → [[x, y, 1, 2]].
    """
    namen = set(szene.get("musikquellen", []))
    return [
        rechteck(o)
        for ebene in karte.get("layers", [])
        for o in ebene.get("objects", [])
        if o.get("name") in namen or JUKEBOX.search(o.get("name", ""))
    ]


def ableiten(szene: dict, zeilen: list[str], karte: dict, art: str | None) -> list[dict]:
    """Die Quellen der Karte für ihr Dauergeräusch ``art`` und die Musiker (Art ``musik``).

    Beispiel: Park (wasserfall) → ``[{"art": "wasserfall", "felder": [[30, 1, 4, 4]]}]``; der Teich
    zählt nicht. Flussweg (fluss) → alle Läufe der Wasserkacheln.
    """
    musiker = musikquellen(szene, karte)
    musik = [{"art": MUSIK, "felder": musiker}] if musiker else []
    return geraeuschquellen(szene, zeilen, karte, art) + musik


def geraeuschquellen(szene: dict, zeilen: list[str], karte: dict, art: str | None) -> list[dict]:
    """Die Quellen des Dauergeräuschs ``art`` (ohne Geräusch leer)."""
    an, ohne, dazu = handangaben(szene)
    if not art or not an:
        return []
    felder: list[list[int]] = []
    if art in FLAECHENWASSER and WASSERKACHELN not in ohne:
        felder += wasserlaeufe(zeilen, szene.get("bruecken", []))
    if art not in ohne:
        felder += [r for a, r, _ in objektquellen(karte) if a == art]
    felder += [r for a, r in dazu if (a or art) == art]
    return [{"art": art, "felder": felder}] if felder else []


def eigenschaft(quellen: list[dict]) -> list[dict]:
    """Die Tiled-Eigenschaft zu den Quellen; ohne Quellen keine (die Karte bleibt unberührt)."""
    if not quellen:
        return []
    wert = json.dumps(quellen, ensure_ascii=False, separators=(",", ":"))
    return [{"name": EIGENSCHAFT, "type": "string", "value": wert}]


def mit_eigenschaft(karte: dict, quellen: list[dict]) -> dict:
    """Die Karte mit der Eigenschaft (alte ersetzt, ohne Quellen entfernt)."""
    rest = [p for p in karte.get("properties", []) if p.get("name") != EIGENSCHAFT]
    return {**karte, "properties": rest + eigenschaft(quellen)}


def szenen(ort: str | None = None) -> list[Path]:
    """Die Szenen (ohne Varianten zur Wahl), auf einen Ort oder eine Karte eingegrenzt."""
    pfade = sorted(SZENEN.glob("*.json"))
    if not ort:
        return pfade
    return [p for p in pfade if lade(p).get("karte", "").startswith(ort)]


def zeilen_der(szene: dict) -> list[str]:
    """Die Zeilen des Rasters auf gleiche Breite (wie ``kartenbau.raster``)."""
    breite = max(len(z) for z in szene["raster"])
    return [z.ljust(breite) for z in szene["raster"]]


def fuer_szene(pfad: Path, orte: dict) -> tuple[dict, dict, list[dict], list[str]]:
    """Szene, Karte, abgeleitete Quellen und Hinweise (Möbel ohne passende Schleife)."""
    szene = lade(pfad)
    karte = lade(INHALTE / szene["datei"])
    art = kartenart(szene["karte"], orte)
    quellen = ableiten(szene, zeilen_der(szene), karte, art)
    # Hinweis nur, wo die Karte ein anderes Dauergeräusch hat; ohne eins ist nichts zu hören.
    hinweise = [
        f"{name} {rechteck[:2]}: Art {a}, die Karte hat {art} (ohne Schleife)"
        for a, rechteck, name in objektquellen(karte)
        if art and a != art
    ]
    return szene, karte, quellen, hinweise


def zeile(szene: dict, quellen: list[dict]) -> str:
    """Eine Zeile der Liste: Karte, Art, Zahl der Rechtecke und Kacheln."""
    if not quellen:
        return f"{szene['karte']} ({szene['datei']}): keine Quellen"
    teile = []
    for q in quellen:
        kacheln = sum(r[2] * r[3] for r in q["felder"])
        teile.append(f"{q['art']}: {len(q['felder'])} Stellen, {kacheln} Kacheln")
    return f"{szene['karte']} ({szene['datei']}): " + "; ".join(teile)


def hauptprogramm(argv: list[str]) -> int:
    """Liste aller Karten mit Quellen; --schreiben trägt sie ein, --bild zeichnet eine Vorschau."""
    teiler = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    teiler.add_argument("--ort", help="Ort oder Karte, etwa mapleFalls.park")
    teiler.add_argument("--schreiben", action="store_true", help="Eigenschaft in die Karten schreiben")
    teiler.add_argument("--bild", type=Path, help="Vorschau mit Ringen (PNG, braucht Pillow)")
    teiler.add_argument("--alle", action="store_true", help="auch Karten ohne Quellen und Hinweise")
    a = teiler.parse_args(argv)
    orte = lade(ORTE)
    vorschau = []
    for pfad in szenen(a.ort):
        szene, karte, quellen, hinweise = fuer_szene(pfad, orte)
        if quellen or a.alle:
            print(zeile(szene, quellen))
        if a.alle:
            for h in hinweise:
                print(f"  Hinweis: {h}")
        if a.schreiben:
            neu = mit_eigenschaft(karte, quellen)
            if neu != karte:
                ziel = INHALTE / szene["datei"]
                ziel.write_text(json.dumps(neu, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
                print(f"  geschrieben: {szene['datei']}")
        if quellen:
            vorschau.append((szene, quellen))
    if a.bild:
        from pipeline.abenteuer.geraeuschquellen_bild import zeichne

        if not zeichne(vorschau, a.bild):
            print("Pillow fehlt: keine Vorschau gezeichnet", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(hauptprogramm(sys.argv[1:]))

"""Schwenkstellen: Erzählzeilen, die Sichtbares auf der Karte beschreiben, und ihr Kameraschwenk.

Warum: Wunsch des Autors (26.11.2026). Beim Betreten eines Orts beschreibt der Erzähltext oft, was
dort zu sehen ist („In der Mitte, wo woanders eine Kirche steht, steht die Bibliothek“), man sieht
aber nur den Ausschnitt um den Helden. Mit ``#schwenk:ZIEL`` fährt die Kamera dorthin (App:
oberwelt/schwenk.ts). Dieses Werkzeug sucht die Stellen und prüft die gesetzten Tags.

Was es tut:
1. Ankunfts- und Eingangsknoten finden: Eingänge der Karten und Dialoge an Übergängen aus
   orte.json, Knoten namens ``eingang``, ``einleitung`` oder ``ankunft…`` (mit den Knoten, auf die
   sie direkt umleiten). Mit ``--alle`` jede Erzählzeile einer Datei, deren Karte bekannt ist.
2. Je Knoten die Karte, auf der er spielt: Eingang → diese Karte; Übergang → die Karte des
   Auslösers (der Dialog läuft vor dem Wechsel, App: oberwelt/useDialogende.ts); sonst die Karte
   mit dem Namen der Ink-Datei.
3. Erzählzeilen mit Stichwörtern für Sichtbares (Gebäude, Plätze, Wasser, Figuren) den Objekten
   der Karte zuordnen: Möbel und Gebäude (Katalogname), Auslöser, Figuren (Kennung oder Anzeigename).
4. Gesetzte Tags prüfen: Jedes ``#schwenk:ZIEL`` muss auf seiner Karte auflösbar sein, wie in der App
   (Held, ``x,y``, Figur, Auslöser, Kartenobjekt). Das ist ein Befund.

Ausgabe: Liste je Zeile (Datei:Zeile, Karte, Status, Vorschlag). Rückgabe 1 bei Befunden.
Dauertest: pipeline/tests/test_abenteuer_schwenkstellen.py (Befunde 0, offene Vorschläge unter einer
Obergrenze, die nur sinkt). Aufruf: ``python -m pipeline.abenteuer.schwenkstellen [--alle]``.
Abhängigkeiten: nur die Standardbibliothek.
"""

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

DATEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
DIALOGE = DATEN / "dialoge" / "de"

KNOTEN = re.compile(r"^\s*={2,}\s*(?:function\s+)?(\w+)")
STITCH = re.compile(r"^\s*=\s*(\w+)\s*$")
UMLEITUNG = re.compile(r"->\s*(\w+)\s*$")
TAG = re.compile(r"#(\w+)(?::([^#]*))?")
ANKUNFTSKNOTEN = re.compile(r"^(eingang\w*|einleitung\w*|\w*ankunft\w*)$")

# Stichwort im Text (Wortanfang) → Teile von Objektnamen der Karte, die dazu passen.
STICHWORTE: dict[str, tuple[str, ...]] = {
    "Bibliothek": ("bibliothek",),
    "Kirch": ("kirche",),
    "Brunnen": ("brunnen",),
    "Wasserfall": ("wasserfall",),
    "Fluss": ("fluss", "ufer", "steg"),
    "Brücke": ("bruecke", "brücke"),
    "Steg": ("steg",),
    "Statue": ("statue", "denkmal"),
    "Denkmal": ("denkmal", "statue"),
    "Bahnhof": ("bahnhof", "station"),
    "Gleis": ("gleis",),
    "Uhr": ("uhr",),
    "Plakat": ("plakat",),
    "Haltestelle": ("haltestelle", "bushalt"),
    "Kiosk": ("kiosk",),
    "Diner": ("diner",),
    "Schule": ("schule",),
    "Leuchtturm": ("leuchtturm",),
    "Hafen": ("hafen", "kai"),
    "Mühle": ("muehle", "mühle"),
    "Halfpipe": ("halfpipe",),
    "Waschsalon": ("waschsalon",),
    "Drechslerei": ("drechslerei",),
    "Werkstatt": ("werkstatt",),
    "Wohnwagen": ("wohnwagen",),
    "Zelt": ("zelt",),
    "Lagerfeuer": ("feuer",),
    "Pavillon": ("pavillon",),
    "Bühne": ("buehne", "bühne"),
    "Motel": ("motel",),
    "Tankstelle": ("tankstelle", "zapf"),
    "Raststätte": ("raststaette", "diner"),
    "Arena": ("arena",),
    "Halle": ("halle",),
    "Teich": ("teich",),
    "Rathaus": ("rathaus",),
    "Hütte": ("huette", "hütte"),
    "Fähre": ("faehre", "fähre"),
    "Boot": ("boot",),
    "Kran": ("kran",),
    "Turm": ("turm",),
    "Markt": ("markt", "stand"),
    "Laden": ("laden",),
    "Café": ("cafe",),
}


# Angesehen, ohne Schwenk: „datei:Zeilenanfang“ → Grund. Der Dauertest zählt sie nicht als offen.
GEPRUEFT: dict[str, str] = {
    "capital-arena-aussen:Am Abend fahrt ihr in die Hauptstadt": "Das Hotel steht nicht auf der Karte; "
    "der Schwenk folgt zwei Zeilen später zur Arena.",
    "capital-arena-aussen:Nova dreht sich um. Sie sieht dich über die ganze Halle": "Spielt in der "
    "Halle, die Karte zeigt den Vorplatz; Nova steht dort nicht.",
    "cedar-creek-aussen:{not schildCedarGesehen: Zwischen den Bäumen schlägt eine Uhr": "Nur zu hören "
    "(Klang turmuhr4), zu sehen ist die Uhr nicht.",
    "ironwood-aussen:Der Abhang von der Brücke führt hinunter nach Ironwood": "Kurzfassung beim "
    "zweiten Mal; beschreibt den Weg, den der Held gerade gekommen ist.",
    "ironwood-aussen:Über den Hallen leuchtet der Himmel orange auf": "Die Hallen des Werks liegen "
    "außerhalb der Karte; das Leuchten zeigt die Tönung (#licht:ironwood).",
    "maple-falls-wohnzimmer:Mama fragt nicht, wie es dir geht": "Die Kamera steht seit zwei Zeilen bei Mama.",
    "cedar-creek-aussen:Der Flussweg endet an der Bushaltestelle von Cedar Creek": "Kurze Zeile vor "
    "dem Wechsel; die Ankunft selbst läuft als Eingang von Cedar Creek (mittel-4, 25.11.2026).",
    "maple-falls-wohnzimmer:{hectorGetroffen:Hector ruft es in die Küche": "Die Kamera steht seit "
    "der Zeile davor bei Hector.",
    "maple-falls-wohnzimmer:Hector hält das Set ins Licht": "Die Kamera steht bei Hector.",
    "maple-falls-wohnzimmer:Die Pommes kommen. Hector bleibt am Tisch stehen": "Hector steht am "
    "Tisch des Helden; die Kamera ist dort.",
}


@dataclass
class Stelle:
    """Eine Erzählzeile mit ihrer Karte und dem Ergebnis."""

    datei: str
    zeile: int
    knoten: str
    karte: str
    text: str
    status: str  # gesetzt | befund | vorschlag | ohne_ziel | verlegen | geprueft
    ziel: str
    hinweis: str = ""


@dataclass
class Kartenobjekte:
    """Namen der Objekte einer Karte, nach Art."""

    ausloeser: set[str]
    figuren: set[str]
    moebel: list[str]
    breite: int
    hoehe: int


def lies_karte(datei: Path) -> Kartenobjekte:
    """Objekte einer Tiled-Karte (Ebene mit Objekten), nach Art getrennt."""
    karte = json.loads(datei.read_text(encoding="utf-8"))
    obj = Kartenobjekte(set(), set(), [], karte.get("width", 0), karte.get("height", 0))
    for ebene in karte.get("layers", []):
        for o in ebene.get("objects") or []:
            name, art = o.get("name"), o.get("type") or o.get("class")
            if not name:
                continue
            if art == "ausloeser":
                obj.ausloeser.add(name)
            elif art == "figur":
                # Nur Figuren tragen in der App ihren Namen (figurenaufstellung.ts); Statisten und
                # Tiere nicht, ein Schwenk zu ihnen fände nichts.
                obj.figuren.add(name)
            elif art not in ("statist", "tier"):
                obj.moebel.append(name)
    return obj


def aufloesbar(ziel: str, obj: Kartenobjekte) -> bool:
    """Löst die App das Ziel auf dieser Karte auf? (oberwelt/schwenk.ts, schwenkziel)"""
    ziel = ziel.strip()
    if ziel in ("", "held"):
        return True
    feld = re.fullmatch(r"(\d+)\s*,\s*(\d+)", ziel)
    if feld:
        return int(feld[1]) < obj.breite and int(feld[2]) < obj.hoehe
    return ziel in obj.figuren or ziel in obj.ausloeser or ziel in obj.moebel


def tags_von(text: str) -> dict[str, str]:
    """Tags einer Ink-Zeile."""
    return {m[1]: (m[2] or "").strip() for m in TAG.finditer(text)}


def figurnamen() -> dict[str, str]:
    """Anzeigename → Kennung der Figur (texte/de.json, ``figur.KENNUNG.name``)."""
    texte = json.loads((DATEN / "texte" / "de.json").read_text(encoding="utf-8"))
    namen = {}
    for schluessel, wert in texte.items():
        teile = schluessel.split(".")
        if len(teile) == 3 and teile[0] == "figur" and teile[2] == "name" and isinstance(wert, str):
            if "{" not in wert and len(wert) > 2:
                namen[wert] = teile[1]
    return namen


def vorschlag(text: str, obj: Kartenobjekte, namen: dict[str, str]) -> tuple[str, str]:
    """(Stichwort, Ziel) für eine Erzählzeile; Ziel leer, wenn kein Objekt passt."""
    for anzeige, kennung in namen.items():
        if re.search(rf"\b{re.escape(anzeige)}\b", text) and kennung in obj.figuren:
            return anzeige, kennung
    for wort, teile in STICHWORTE.items():
        if not re.search(rf"\b{wort}", text):
            continue
        for gruppe in (sorted(obj.ausloeser), obj.moebel):
            for name in gruppe:
                if any(t in name.lower() for t in teile):
                    return wort, name
        return wort, ""
    return "", ""


@dataclass
class Knoten:
    """Ein Ink-Knoten: Datei, Name, Zeilen (Nummer, Text), Umleitungen."""

    datei: str
    name: str
    zeilen: list[tuple[int, str]]
    ziele: set[str]


def lies_knoten(pfad: Path) -> dict[str, Knoten]:
    """Knoten einer Ink-Datei mit ihren Zeilen (Stitches gehören zum Knoten)."""
    knoten: dict[str, Knoten] = {}
    aktuell: Knoten | None = None
    for nummer, text in enumerate(pfad.read_text(encoding="utf-8").splitlines(), start=1):
        kopf = KNOTEN.match(text)
        if kopf and not STITCH.match(text):
            aktuell = knoten.setdefault(kopf[1], Knoten(pfad.stem, kopf[1], [], set()))
            continue
        if aktuell is None or text.strip().startswith("//"):
            continue
        aktuell.zeilen.append((nummer, text))
        umleitung = UMLEITUNG.search(text)
        if umleitung and umleitung[1] not in ("END", "DONE"):
            aktuell.ziele.add(umleitung[1])
    return knoten


def kartendateien() -> tuple[dict[str, Path], dict[str, str]]:
    """Kennung → Kartendatei, und Dateistamm → Kennung (für Ink-Dateien gleichen Namens)."""
    orte = json.loads((DATEN / "orte.json").read_text(encoding="utf-8"))["orte"]
    dateien, stamm = {}, {}
    for ort in orte:
        for karte in ort["karten"]:
            pfad = DATEN / karte["datei"]
            dateien[karte["kennung"]] = pfad
            stamm.setdefault(pfad.stem, karte["kennung"])
    return dateien, stamm


def ankunftsorte(dateien: dict[str, Path]) -> dict[str, tuple[str, str, str]]:
    """„datei.knoten“ → (Karte, Herkunft, Zielkarte) für Eingänge und Übergänge (orte.json).

    Ein Übergangsdialog läuft vor dem Wechsel auf der Karte seines Auslösers; die Zielkarte zählt
    für Ankunftstexte, die schon beschreiben, was dort zu sehen ist.
    """
    orte = json.loads((DATEN / "orte.json").read_text(encoding="utf-8"))["orte"]
    objekte = {k: lies_karte(p) for k, p in dateien.items() if p.exists()}
    plaetze: dict[str, tuple[str, str, str]] = {}
    for ort in orte:
        for karte in ort["karten"]:
            eingang = karte.get("eingang")
            if eingang:
                plaetze[eingang["dialog"]] = (karte["kennung"], "eingang", karte["kennung"])
        for a in ort["ausloeser"]:
            if a.get("art") != "uebergang" or not a.get("dialog") or not a.get("ziel"):
                continue
            quelle = [
                k["kennung"]
                for k in ort["karten"]
                if k["kennung"] in objekte and a["name"] in objekte[k["kennung"]].ausloeser
            ]
            zielkarte = a["ziel"]["karte"]
            # `nachher` (orte.json): Der Dialog läuft nach dem Wechsel auf der Zielkarte, ohne
            # Bedingung immer; mit Bedingung kann er auch vorher laufen, geprüft wird die Ankunft.
            if a.get("nachher"):
                plaetze.setdefault(a["dialog"], (zielkarte, "eingang", zielkarte))
            elif quelle:
                plaetze.setdefault(a["dialog"], (quelle[0], "uebergang", zielkarte))
    return plaetze


def stellen(alle: bool = False) -> list[Stelle]:
    """Alle Erzählzeilen in Ankunftsknoten (mit ``alle``: in jedem Knoten) mit Status."""
    dateien, stamm = kartendateien()
    objekte = {k: lies_karte(p) for k, p in dateien.items() if p.exists()}
    plaetze = ankunftsorte(dateien)
    namen = figurnamen()
    ergebnis: list[Stelle] = []
    for pfad in sorted(DIALOGE.glob("*.ink")):
        knoten = lies_knoten(pfad)
        gewaehlt = _gewaehlte_knoten(pfad.stem, knoten, plaetze, stamm, alle)
        for name, (karte, herkunft, ziel) in gewaehlt.items():
            vorher = herkunft == "uebergang"
            # Ein Ankunftstext vor dem Wechsel beschreibt die Zielkarte; schwenken geht dort nicht.
            pruefkarte = ziel if vorher else karte
            obj = objekte.get(pruefkarte)
            if obj is None:
                continue
            for nummer, text in knoten[name].zeilen:
                stelle = _pruefe_zeile(pfad.stem, nummer, name, karte, text, objekte[karte], obj, namen)
                if stelle and vorher and stelle.status in ("vorschlag", "ohne_ziel"):
                    stelle.status = "verlegen"
                    stelle.hinweis = f"läuft vor dem Wechsel nach {ziel}"
                if stelle:
                    ergebnis.append(stelle)
    return ergebnis


def _gewaehlte_knoten(
    datei: str,
    knoten: dict[str, Knoten],
    plaetze: dict[str, tuple[str, str, str]],
    stamm: dict[str, str],
    alle: bool,
) -> dict[str, tuple[str, str, str]]:
    """Knoten dieser Datei, die geprüft werden, mit Karte und Herkunft."""
    eigene = stamm.get(datei)
    gewaehlt: dict[str, tuple[str, str]] = {}
    for name in knoten:
        platz = plaetze.get(f"{datei}.{name}")
        ankunft = ANKUNFTSKNOTEN.match(name) is not None
        if platz and (platz[1] == "eingang" or ankunft or alle):
            gewaehlt[name] = platz
        elif not platz and eigene and (alle or ankunft):
            gewaehlt[name] = (eigene, "datei", eigene)
    # Direkte Umleitungen gehören dazu (ankunft_zu_fuss → ankunft), auf derselben Karte.
    for name, platz in list(gewaehlt.items()):
        for ziel in knoten[name].ziele:
            if ziel in knoten and ziel not in gewaehlt:
                gewaehlt[ziel] = platz
    return gewaehlt


def _pruefe_zeile(
    datei: str,
    nummer: int,
    knoten: str,
    karte: str,
    text: str,
    spiel: Kartenobjekte,
    obj: Kartenobjekte,
    namen: dict,
) -> Stelle | None:
    """Status einer Zeile: gesetzter Tag (gegen die Karte, auf der er spielt), sonst Vorschlag."""
    tags = tags_von(text)
    roh = TAG.sub("", text).strip()
    if "schwenk" in tags:
        ok = aufloesbar(tags["schwenk"], spiel)
        status = "gesetzt" if ok else "befund"
        return Stelle(datei, nummer, knoten, karte, roh, status, tags["schwenk"])
    if tags.get("sprecher") != "erzaehler" or "gehe" in tags:
        return None
    wort, ziel = vorschlag(roh, obj, namen)
    if not wort:
        return None
    if any(f"{datei}:{anfang}" in GEPRUEFT for anfang in _anfaenge(roh)):
        return Stelle(datei, nummer, knoten, karte, roh, "geprueft", ziel or wort)
    return Stelle(datei, nummer, knoten, karte, roh, "vorschlag" if ziel else "ohne_ziel", ziel or wort)


def _anfaenge(text: str) -> list[str]:
    """Mögliche Schlüssel für GEPRUEFT: jeder Anfang der Zeile (ohne Sammlerstrich)."""
    rein = text.lstrip("-*+ ").strip()
    return [rein[:n] for n in range(10, len(rein) + 1)]


def main(argv: list[str]) -> int:
    """Liste ausgeben; Rückgabe 1 bei Befunden (Tag, den die Karte nicht auflöst)."""
    liste = stellen("--alle" in argv)
    for s in liste:
        zusatz = f" ({s.hinweis})" if s.hinweis else ""
        print(f"{s.status:9} {s.datei}.ink:{s.zeile} [{s.karte}] {s.ziel}{zusatz}: {s.text[:90]}")
    zaehlung = {
        k: sum(1 for s in liste if s.status == k) for k in ("gesetzt", "befund", "vorschlag", "ohne_ziel")
    }
    print(", ".join(f"{k} {v}" for k, v in zaehlung.items()))
    return 1 if zaehlung["befund"] else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

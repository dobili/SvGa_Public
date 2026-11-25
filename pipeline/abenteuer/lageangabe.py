"""Lage- und Handlungsangaben im Dialog gegen die Karte: steht die Figur da, wo der Text sie hinstellt?

Warum: Befund des Autors (25.11.2026, abends). Auf der Landstraße zwischen Maple Falls und Cedar
Creek erzählt der Dialog „Ein Mädchen mit Skateboard unter dem Arm versperrt halb den Weg“, aber Nia
stand neben der Straße im Gras und versperrte nichts. Das passiert „hin und wieder“: Der Text legt
fest, wo eine Person steht oder was sie tut, die Karte zeigt es anders. Muster wie
``sprecherort.py`` (Haltung der Sprechenden) und ``figurenort.py`` (Ort der Figur).

Vorgehen: Jede Erzählzeile, die vom Dialogeinstieg einer Figur aus erreichbar ist (orte.json, Feld
``dialog``), gehört zu dieser Figur, sofern sie keine andere Figur des Orts mit Namen nennt und nicht
von {held}, Juno oder Ambrose erzählt. Die Angabe wird mit allen Plätzen der Figur auf den Karten
ihres Orts verglichen (Feld in jeder Szene und jeder Block ihres Tagesablaufs auf dieser Karte); sie
gilt als erfüllt, wenn ein Platz passt: Wann die Szene spielt, legt der Text nicht fest.

Prüfungen (``PRUEFUNGEN``):
- **weg:** „versperrt“, „mitten auf dem Weg“, „steht auf der Straße“: Das Feld ist eine Weg- oder
  Straßenkachel (Buchstabe aus ``boeden`` der Szene, kein Gras, kein Wasser).
- **tuer, tresen, fenster, bank, brunnen, zaun:** Ein passendes Möbel (Kennung oder Bildquelle) oder
  ein Auslöser (Tür) liegt höchstens ``NAH`` Felder entfernt.
- **sitzt, liegt:** Die Figur sitzt in der Szene (``sitzt``) oder im Tagesablauf (``tut``).
- **bild:** Die Figur hält etwas „in der Hand“ oder „unter dem Arm“. Das Werkzeug kann das Bild nicht
  sehen; jeder Fall wird einmal angesehen (Bild zeigt es, Text allgemein genug, Bildwunsch).

Jeder Kandidat ist behoben oder steht mit Grund in ``lageangabe_geprueft.GEPRUEFT`` (passt) oder
``GEMELDET`` (Bericht: Bildwunsch, Akt 2 bis 4 noch offen). Der Dauertest
(pipeline/tests/test_abenteuer_lageangabe.py) hält die Zahl der gemeldeten Fälle mit einer Obergrenze,
die nur sinken darf.

Aufruf: ``python -m pipeline.abenteuer.lageangabe [--alle] [--bericht DATEI]`` (Tabelle in Markdown).
Rückgabe 1 bei ungeprüften Kandidaten.
Abhängigkeiten: figurenort.py (Orte, Dialogdateien, Ink-Fluss), inkfluss.py, Standardbibliothek.
"""

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.figurenort import DATEN, _dateiorte, _fluss, lade_orte
from pipeline.abenteuer.inkfluss import erreichbar
from pipeline.abenteuer.lageangabe_geprueft import GEMELDET, GEPRUEFT

KACHEL = 16  # Pixel je Feld
NAH = 2  # höchstens so viele Felder zwischen Figur und Möbel (Schachbrettabstand)
KEIN_WEG = {"gras", "wasser", "wiese"}  # Böden, auf denen niemand „den Weg versperrt“

# Prüfung → (Muster im Text, Muster für Möbelkennung oder Bildquelle; None: keine Möbelprüfung).
PRUEFUNGEN: dict[str, tuple[re.Pattern, re.Pattern | None]] = {
    "weg": (
        re.compile(
            r"\b(versperrt|mitten auf (?:dem|der) (?:Weg|Straße|Pfad|Steg)|"
            r"steht (?:mitten )?auf (?:dem|der) (?:Weg|Straße|Pfad))\b"
        ),
        None,
    ),
    "tuer": (
        re.compile(r"\b(?:lehnt|steht|wartet|sitzt) (?:in|an|vor) der Tür\b|\bim Türrahmen\b"),
        re.compile(r"t(?:ue|ü)r|Door|Ausgang", re.I),
    ),
    "tresen": (
        re.compile(r"\b(?:[Hh]inter|[Aa]n|[Aa]m) (?:dem |der )?(?:Tresen|Theke|Kasse|Ladentisch|Bar)\b"),
        re.compile(r"Tresen|Theke|Kasse|Ladentisch|Counter|Bar(?!re)|Register", re.I),
    ),
    "fenster": (
        re.compile(r"\b(?:steht|sitzt|lehnt|wartet) am Fenster\b"),
        re.compile(r"Fenster|Window", re.I),
    ),
    "bank": (
        re.compile(r"\bauf (?:der|einer) (?:Bank|Parkbank)\b|\bauf dem Sofa\b"),
        re.compile(r"Bank|Bench|Sofa|Couch", re.I),
    ),
    "brunnen": (re.compile(r"\bam Brunnen\b|\bauf dem Brunnenrand\b"), re.compile(r"Brunnen|Fountain", re.I)),
    "zaun": (
        re.compile(r"\b(?:lehnt|steht|wartet) (?:am|an einem) (?:Zaun|Gatter)\b"),
        re.compile(r"Zaun|Gatter|Fence", re.I),
    ),
    "sitzt": (re.compile(r"\b(?:sitzt|hockt)\b"), None),
    "liegt": (
        re.compile(
            r"\bliegt (?:im|auf dem|in der|unter dem) (?:Bett|Gras|Sofa|Liegestuhl|Boden|Hängematte)\b"
        ),
        None,
    ),
    "bild": (re.compile(r"\b(?:unter dem Arm|in der Hand|in den Händen)\b"), None),
}
# Ein Satzteil, der von {held}, Juno oder Ambrose erzählt, gehört nicht zur Figur des Dialogs.
ANDERE = re.compile(
    r"\b(?:[Dd]u|[Dd]ich|[Dd]ir|deine?[mnrs]?|Juno|Ambrose|niemand|[Kk]einer|[Aa]lle|Leute|Kinder)\b|\{held\}"
)
SATZANFANG = re.compile(r"[.!?:;„“]\s*")


@dataclass
class Kandidat:
    """Ein Fund: Prüfung, Figur (Objektname), Fundstelle, Zeile, Angabe und Kartenlage."""

    pruefung: str
    figur: str
    stelle: str
    zeile: int
    text: str
    lage: str

    @property
    def schluessel(self) -> str:
        """Kennung für ``GEPRUEFT``: Prüfung, Figur und Fundstelle (Datei.Knoten)."""
        return f"{self.pruefung}:{self.figur}:{self.stelle}"

    def geprueft(self) -> str | None:
        """Der Grund aus ``GEPRUEFT`` oder ``GEMELDET``, sonst None."""
        return GEPRUEFT.get(self.schluessel) or GEMELDET.get(self.schluessel)


@dataclass(frozen=True)
class Platz:
    """Ein Platz der Figur: Karte, Feld, sitzt oder liegt sie dort, und die Szene dazu."""

    karte: str
    feld: tuple[int, int]
    haltung: str  # steht, sitzt, liegt
    szene: str


def _katalog(daten: Path) -> dict[str, dict]:
    """Alle Möbel aller Katalogdateien."""
    katalog: dict[str, dict] = {}
    for pfad in sorted((daten / "moebel").glob("*.json")):
        katalog.update(json.loads(pfad.read_text(encoding="utf-8")).get("moebel", {}))
    return katalog


def _szenen(daten: Path) -> dict[str, list[dict]]:
    """Karte → alle Szenen (Grundkarte und Fassungen)."""
    ergebnis: dict[str, list[dict]] = {}
    for pfad in sorted((daten / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        szene["_datei"] = pfad.stem
        ergebnis.setdefault(szene.get("karte", ""), []).append(szene)
    return ergebnis


def plaetze(objekt: str, karten: list[str], szenen: dict[str, list[dict]], ablauf: dict) -> list[Platz]:
    """Alle Plätze einer Figur auf den Karten ihres Orts: Szenenfeld und Tagesablauf auf derselben Karte."""
    gefunden = []
    for karte in karten:
        for szene in szenen.get(karte, []):
            for figur in szene.get("figuren", []):
                if figur["name"] == objekt:
                    haltung = "sitzt" if figur.get("sitzt") else "steht"
                    gefunden.append(Platz(karte, tuple(figur["feld"]), haltung, szene["_datei"]))
            for block in (ablauf.get(objekt) or {}).get("bloecke", []):
                if block.get("karte") == karte and block.get("feld"):
                    haltung = (
                        "liegt"
                        if block.get("tut") == "liegt"
                        else "sitzt"
                        if "sitzt" in block.get("tut", "")
                        else "steht"
                    )
                    gefunden.append(Platz(karte, tuple(block["feld"]), haltung, szene["_datei"]))
    return list(dict.fromkeys(gefunden))


def dialogkarten(datei: str, ort: dict, szenen: dict[str, list[dict]]) -> list[str]:
    """Die Karten, auf denen ein Dialog spielt: deren Szenendatei mit dem Dateinamen beginnt
    (maple-falls-clubraum → mapleFalls.clubraum); sonst alle Karten des Orts (Wege, Ortsdialoge).

    Warum: Eine Figur, die nur auf einer anderen Karte steht, ist hier nicht anwesend (das prüft
    figurenort.py); verglichen wird nur, wo der Spieler sie beim Gespräch sieht."""
    alle = [k["kennung"] for k in ort["karten"]]
    eigene = [k for k in alle if any(s["_datei"].startswith(datei) for s in szenen.get(k, []))]
    return eigene or alle


def _belegte_felder(objekt: dict, katalog: dict) -> list[tuple[int, int]]:
    """Felder, die ein Möbel bedeckt (Feld oben links, Größe aus dem Katalog)."""
    eintrag = katalog.get(objekt.get("moebel", ""), {})
    breite = max(1, -(-int(eintrag.get("breite", KACHEL)) // KACHEL))
    hoehe = max(1, -(-int(eintrag.get("hoehe", KACHEL)) // KACHEL))
    x, y = objekt["feld"]
    return [(x + dx, y + dy) for dx in range(breite) for dy in range(hoehe)]


def naehe(platz: Platz, szene: dict, katalog: dict, muster: re.Pattern) -> list[str]:
    """Möbel und Auslöser im Umkreis ``NAH``, deren Kennung, Bildquelle oder Name zum Muster passt."""
    px, py = platz.feld
    treffer = []
    for objekt in szene.get("objekte", []):
        if not objekt.get("feld"):
            continue
        eintrag = katalog.get(objekt.get("moebel", ""), {})
        kennzeichen = f"{objekt.get('moebel', '')} {eintrag.get('quelle', '')} {eintrag.get('art', '')}"
        if muster.search(kennzeichen) and any(
            max(abs(x - px), abs(y - py)) <= NAH for x, y in _belegte_felder(objekt, katalog)
        ):
            treffer.append(objekt["moebel"])
    for ausloeser in szene.get("ausloeser", []):
        x, y = ausloeser.get("feld", (-99, -99))
        if muster.search(ausloeser.get("name", "")) and max(abs(x - px), abs(y - py)) <= NAH:
            treffer.append(f"Auslöser {ausloeser['name']}")
    return treffer


def untergrund(platz: Platz, szene: dict) -> str:
    """Der Boden unter dem Feld: Name aus ``boeden`` der Szene oder ihr Grundboden."""
    x, y = platz.feld
    raster = szene.get("raster") or []
    zeichen = raster[y][x] if 0 <= y < len(raster) and 0 <= x < len(raster[y]) else "."
    return (szene.get("boeden") or {}).get(zeichen, szene.get("boden", "?"))


def passt(pruefung: str, platz: Platz, szene: dict, katalog: dict) -> tuple[bool, str]:
    """Ob die Angabe an diesem Platz stimmt, und eine kurze Beschreibung der Lage."""
    boden = untergrund(platz, szene)
    lage = f"{platz.karte} {list(platz.feld)} {platz.haltung} auf {boden} ({szene['_datei']})"
    muster = PRUEFUNGEN[pruefung][1]
    if pruefung == "weg":
        return boden not in KEIN_WEG and szene.get("art") != "innen", lage
    if pruefung in ("sitzt", "liegt"):
        return platz.haltung == pruefung or (pruefung == "sitzt" and platz.haltung == "liegt"), lage
    if pruefung == "bild":
        return False, lage
    nah = naehe(platz, szene, katalog, muster) if muster else []
    return bool(nah), lage + (f", nah: {', '.join(nah[:3])}" if nah else ", nichts Passendes in der Nähe")


def _namen(ort: dict, texte: dict[str, str]) -> dict[str, str]:
    """Anzeigename (ganz und letztes Wort) → Objektname der Figuren eines Orts."""
    ergebnis = {}
    for figur in ort["figuren"]:
        name = texte.get(figur["name"], "")
        for teil in {name, name.split()[-1] if name else ""} - {""}:
            ergebnis[teil] = figur["kennung"].split(".", 1)[1]
    return ergebnis


def _zeilen_je_figur(fluss, ort: dict, datei: str) -> dict[int, set[str]]:
    """Zeilenindex → Objektnamen der Figuren, von deren Dialogeinstieg die Zeile erreichbar ist."""
    ergebnis: dict[int, set[str]] = {}
    for figur in ort["figuren"]:
        dialog = figur.get("dialog", "")
        if not dialog.startswith(f"{datei}."):
            continue
        start = fluss.namen.get((dialog.split(".", 1)[1],))
        if start is None:
            continue
        for index in erreichbar(fluss, start):
            ergebnis.setdefault(index, set()).add(figur["kennung"].split(".", 1)[1])
    return ergebnis


def subjekt(satzteil: str, namen: dict[str, str], eigene: set[str]) -> set[str]:
    """Die Figuren, von denen der Satzteil vor der Angabe erzählt (leer: {held}, Juno, Ambrose)."""
    genannt = {o for n, o in namen.items() if re.search(rf"\b{re.escape(n)}\b", satzteil)}
    if "{rivale}" in satzteil:
        genannt |= {o for o in namen.values() if o.startswith("victor")}
    if genannt:
        return genannt
    if ANDERE.search(satzteil):
        return set()
    return eigene if len(eigene) == 1 else set()


def _satzteil(text: str, anfang: int) -> str:
    """Der Text vom letzten Satzzeichen vor ``anfang`` bis ``anfang``."""
    davor = text[:anfang]
    grenzen = [m.end() for m in SATZANFANG.finditer(davor)]
    return davor[grenzen[-1] if grenzen else 0 :]


@dataclass
class Umgebung:
    """Was der Abgleich braucht: Szenen je Karte, Katalog, Tagesabläufe, Texte."""

    szenen: dict[str, list[dict]]
    katalog: dict[str, dict]
    ablauf: dict
    texte: dict[str, str]


def _pruefe_zeile(zeile, stelle: str, eigene: set[str], ort: dict, umgebung: Umgebung) -> list[Kandidat]:
    """Alle Kandidaten einer Erzählzeile."""
    text = zeile.text.partition(" #")[0].strip()
    karten = dialogkarten(stelle.split(".")[0], ort, umgebung.szenen)
    funde = []
    for pruefung, (muster, _) in PRUEFUNGEN.items():
        for treffer in muster.finditer(text):
            for figur in subjekt(_satzteil(text, treffer.start()), _namen(ort, umgebung.texte), eigene):
                lagen = []
                for platz in plaetze(figur, karten, umgebung.szenen, umgebung.ablauf):
                    szene = next(s for s in umgebung.szenen[platz.karte] if s["_datei"] == platz.szene)
                    ok, lage = passt(pruefung, platz, szene, umgebung.katalog)
                    if ok:
                        break
                    lagen.append(lage)
                else:
                    if lagen:
                        funde.append(Kandidat(pruefung, figur, stelle, zeile.nummer, text, lagen[0]))
    return funde


def kandidaten(daten: Path = DATEN) -> list[Kandidat]:
    """Alle Kandidaten, je Schlüssel einmal (der erste Text zählt)."""
    orte = {o["kennung"]: o for o in lade_orte(daten)}
    umgebung = Umgebung(
        _szenen(daten),
        _katalog(daten),
        json.loads((daten / "tagesablaeufe.json").read_text(encoding="utf-8"))["figuren"],
        json.loads((daten / "texte" / "de.json").read_text(encoding="utf-8")),
    )
    einmal: dict[str, Kandidat] = {}
    for datei, ortkennungen in sorted(_dateiorte(list(orte.values())).items()):
        fluss = _fluss(daten, datei)
        if fluss is None:
            continue
        for kennung in sorted(ortkennungen):
            ort = orte[kennung]
            je_figur = _zeilen_je_figur(fluss, ort, datei)
            for index, zeile in enumerate(fluss.zeilen):
                if "#sprecher:erzaehler" not in zeile.text:
                    continue
                stelle = f"{datei}.{zeile.knoten}"
                for kandidat in _pruefe_zeile(zeile, stelle, je_figur.get(index, set()), ort, umgebung):
                    einmal.setdefault(kandidat.schluessel, kandidat)
    return list(einmal.values())


def bericht(alle: list[Kandidat]) -> str:
    """Markdown-Tabelle aller Kandidaten: Datei, Knoten, Zeile, Angabe, Kartenlage, Stand und Vorschlag."""
    zeilen = [
        "| Stand | Prüfung | Figur | Datei.Knoten (Zeile) | Angabe | Karte | Vorschlag oder Grund |",
        "| --- | --- | --- | --- | --- | --- | --- |",
    ]
    for k in sorted(alle, key=lambda k: (k.schluessel not in GEMELDET, k.stelle, k.pruefung)):
        stufe = "gemeldet" if k.schluessel in GEMELDET else "geprüft" if k.geprueft() else "offen"
        angabe = k.text.replace("|", "/")[:140]
        zeilen.append(
            f"| {stufe} | {k.pruefung} | {k.figur} | `{k.stelle}` ({k.zeile}) | {angabe} | {k.lage} "
            f"| {k.geprueft() or 'offen'} |"
        )
    return "\n".join(zeilen) + "\n"


def main(argumente: list[str] | None = None) -> int:
    """Druckt die ungeprüften Kandidaten (``--alle``: auch die geprüften); Rückgabe 1 bei offenen."""
    argumente = sys.argv[1:] if argumente is None else argumente
    alle = kandidaten()
    offen = [k for k in alle if k.geprueft() is None]
    for kandidat in alle:
        grund = kandidat.geprueft()
        if grund is None or "--alle" in argumente:
            stufe = "gemeldet" if kandidat.schluessel in GEMELDET else "geprüft" if grund else "offen"
            print(f"{stufe:8} {kandidat.schluessel} (Zeile {kandidat.zeile})")
            print(f"         Angabe: {kandidat.text[:120]}")
            print(f"         Karte:  {kandidat.lage}")
            if grund and "--alle" in argumente:
                print(f"         Grund:  {grund}")
    if "--bericht" in argumente:
        Path(argumente[argumente.index("--bericht") + 1]).write_text(bericht(alle), encoding="utf-8")
    gemeldet = sum(k.schluessel in GEMELDET for k in alle)
    print(f"{len(alle)} Kandidaten, {len(offen)} offen, {gemeldet} gemeldet")
    return 1 if offen else 0


if __name__ == "__main__":
    sys.exit(main())

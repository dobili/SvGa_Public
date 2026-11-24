"""Bild eines Statisten nach seiner Rolle (Kartenblick M05, Auftrag des Hauptchats, 24.11.2026).

Warum: 633 von 682 Statisten hatten kein eigenes Bild; App und Vorschau würfelten es aus dem Namen,
und zwar verschieden (FNV-1a gegen crc32). Die 40 Bögen des Vorrats zeigen nur 11 Bilder, sieben
davon den Arbeiter mit Bauhelm: Die Empfangsdame war ein Bauarbeiter, der Koch eine Rentnerin, und
in London 1851 stand jemand in Warnweste. Jetzt bestimmt die Rolle das Bild: Name, ``tun`` und die
Eigenschaft ``rolle`` führen zu einer Regel aus ``statistenrollen.json`` (gemeinsam mit der App,
``app/src/abenteuer/oberwelt/statistenwahl.ts``), die Regel nennt die passenden Bilder. Unter ihnen
entscheidet ein fester Streuwert des Namens, aber so, dass dasselbe Bild nicht zweimal nah
beieinander steht, das Geschlecht des Namens passt und Sitzende ein Sitzbild haben.

Dieselbe Rechnung wie in der App, Zeile für Zeile; die Probe ``statistenwahl.probe.json`` hält
beide zusammen (pytest schreibt und prüft sie, Vitest rechnet sie nach).

Rolle im Gesamtbild: gelesen von belebungsvorschau.py (Vorschau), editorpersonen.py (Karteneditor),
statistenrolle.py (Dauerprüfung). Abhängigkeiten: nur die JSON-Datei, kein Pillow.
"""

import json
from dataclasses import dataclass
from pathlib import Path

ROLLENDATEI = Path(__file__).resolve().parents[2] / "app/src/abenteuer/oberwelt/statistenrollen.json"
ROLLEN = json.loads(ROLLENDATEI.read_text(encoding="utf-8"))
TYPEN: dict[str, dict] = ROLLEN["typen"]
REGELN: dict[str, dict] = {r["rolle"]: r for r in ROLLEN["regeln"]}

# So nah (in Feldern, waagerecht oder senkrecht) gilt dasselbe Bild als „daneben“ (gesamt.md, M05).
NAH = 6
# Abzüge für ein Bild; das kleinste gewinnt. Jede Stufe wiegt mehr als alle darunter zusammen:
# Lieber ein Ausweichbild ohne Sitzbild mit falschem Geschlecht als dasselbe Bild daneben.
ABZUG_GLEICH_NAH = 8
ABZUG_GESCHLECHT = 4
ABZUG_AUSWEICH = 2
ABZUG_OHNE_SITZBILD = 1
# FNV-1a mit 32 Bit, wie ``streuwert`` in der App.
FNV_START = 0x811C9DC5
FNV_PRIMZAHL = 0x01000193
BIT32 = 0xFFFFFFFF
BYTE = 8
# Alte Bögen des Vorrats: „statist-07“ ist eine Kopie eines Typs (ROLLEN["vorrat"]).
VORRAT_ANFANG = "statist-"
SITZZUSTAENDE = ("sitzstuhl", "sitzboden")
SITZWERTE = ("ja", "rechts", "oben", "links", "unten")

Feld = tuple[int, int]


@dataclass(frozen=True)
class Angabe:
    """Was die Wahl von einem Statisten wissen muss (aus der Szene oder der Tiled-Karte)."""

    name: str
    feld: Feld
    tun: str = ""
    bild: str | None = None
    rolle: str | None = None
    sitzt: bool = False


def streuwert(text: str) -> int:
    """Fester Streuwert eines Namens (FNV-1a über die UTF-16-Einheiten, wie in belebung.ts).

    Beispiel: ``streuwert("passanten")`` gibt in App und Pipeline dieselbe Zahl.
    """
    h = FNV_START
    roh = text.encode("utf-16-le")
    for i in range(0, len(roh), 2):
        h ^= roh[i] | (roh[i + 1] << BYTE)
        h = (h * FNV_PRIMZAHL) & BIT32
    return h


def _laengstes(text: str, schluessel: str) -> dict | None:
    """Regel mit dem längsten Wort aus ``schluessel`` (namen oder tun), das in ``text`` steckt."""
    beste, laenge = None, 0
    for regel in ROLLEN["regeln"]:
        for wort in regel[schluessel]:
            if len(wort) > laenge and wort in text:
                beste, laenge = regel, len(wort)
    return beste


def regel_fuer(name: str, tun: str = "", rolle: str | None = None) -> dict:
    """Die Regel eines Statisten: Eigenschaft ``rolle``, sonst Wort im Namen, sonst im ``tun``.

    Warum der Name zuerst: Er ist die Rollenbezeichnung der Szene; im ``tun`` stehen auch andere
    („erklärt den Kindern …“). Bei gleich langen Wörtern gewinnt die frühere Regel.
    Beispiel: ``regel_fuer("mutterMitKinderwagen")`` → alltag (Kinderwagen schlägt Kind);
    ``regel_fuer("finn", "angelt Flaschen aus dem Becken")`` → wasser.
    Sonderfall: unbekannte ``rolle`` zählt nicht (statistenrolle.py meldet sie).
    """
    if rolle in REGELN:
        return REGELN[rolle]
    return _laengstes(name.lower(), "namen") or _laengstes(tun.lower(), "tun") or REGELN[ROLLEN["sonst"]]


def _kopf(name: str) -> str:
    """Name bis zum ersten Großbuchstaben oder zur ersten Ziffer, klein. „wanderinBeimEssen“ → „wanderin“."""
    for i, zeichen in enumerate(name):
        if i > 0 and ("A" <= zeichen <= "Z" or "0" <= zeichen <= "9"):
            return name[:i].lower()
    return name.lower()


def geschlecht(name: str) -> str | None:
    """„w“, „m“ oder None nach Endung und Anfang des Namens (Listen in statistenrollen.json).

    Beispiel: „fotografin“ → w, „alterHerr“ → m, „touristen“ und „kinder“ → None (Mehrzahl).
    """
    kopf = _kopf(name)
    for eintrag in ROLLEN["geschlecht"]:
        if any(kopf.endswith(e) for e in eintrag["enden"]) or any(
            kopf.startswith(a) for a in eintrag["anfaenge"]
        ):
            return eintrag["ist"] or None
    return None


def kennbild(bild: str) -> str:
    """Das Bild hinter einem Bogennamen: alte Vorratsbögen sind Kopien eines Typs.

    Beispiel: „statist-07“ → „statist.kindA“; „otis“ → „otis“.
    """
    nummer = bild[len(VORRAT_ANFANG) :]
    if bild.startswith(VORRAT_ANFANG) and nummer.isascii() and nummer.isdigit():
        if 1 <= int(nummer) <= len(ROLLEN["vorrat"]):
            return ROLLEN["vorrat"][int(nummer) - 1]
    return bild


def _nah(a: Feld, b: Feld) -> bool:
    """Stehen zwei Felder höchstens NAH auseinander (waagerecht und senkrecht)?"""
    return abs(a[0] - b[0]) <= NAH and abs(a[1] - b[1]) <= NAH


def _abzug(typ: str, ausweich: bool, a: Angabe, vergeben: list[tuple[Feld, str]]) -> int:
    """Abzüge eines Bildes für diesen Statisten (Stufen siehe oben)."""
    angabe = TYPEN[typ]
    eigenes = geschlecht(a.name)
    abzug = ABZUG_AUSWEICH if ausweich else 0
    if any(bild == typ and _nah(feld, a.feld) for feld, bild in vergeben):
        abzug += ABZUG_GLEICH_NAH
    if eigenes and angabe.get("geschlecht") not in (None, eigenes):
        abzug += ABZUG_GESCHLECHT
    if a.sitzt and not angabe["sitzbild"]:
        abzug += ABZUG_OHNE_SITZBILD
    return abzug


def _waehle_eines(a: Angabe, vergeben: list[tuple[Feld, str]]) -> str:
    """Das Bild mit dem kleinsten Abzug; bei Gleichstand das erste ab dem Streuwert des Namens."""
    regel = regel_fuer(a.name, a.tun, a.rolle)
    typen = regel["typen"]
    start = streuwert(a.name) % len(typen)
    folge = [(t, False) for t in typen[start:] + typen[:start]] + [(t, True) for t in regel["ausweich"]]
    bestes, kleinster = folge[0][0], None
    for typ, ausweich in folge:
        abzug = _abzug(typ, ausweich, a, vergeben)
        if kleinster is None or abzug < kleinster:
            bestes, kleinster = typ, abzug
    return bestes


def waehle(angaben: list[Angabe]) -> list[str]:
    """Bogenname je Statist einer Karte, in der Reihenfolge der Eingabe.

    Eingabe: alle Statisten der Karte. Wer ``bild`` trägt, behält es; die übrigen bekommen der Reihe
    nach das beste Bild ihrer Regel, wobei schon vergebene Bilder in der Nähe gemieden werden.
    Ausgabe: Namen wie „statist.service“ oder „otis“ (Pfad im Paket: ``figuren/<name>.png``).
    Beispiel: zwei „rentner“ nebeneinander → „statist.rentner“ und das Ausweichbild „wanderer“.
    Sonderfall: Eine Regel mit nur einem Bild und ohne freies Ausweichbild wiederholt es.
    """
    vergeben = [(a.feld, kennbild(a.bild)) for a in angaben if a.bild]
    ergebnis = []
    for a in angaben:
        if a.bild:
            ergebnis.append(a.bild)
            continue
        bild = _waehle_eines(a, vergeben)
        vergeben.append((a.feld, bild))
        ergebnis.append(bild)
    return ergebnis


def sitzt(eigenschaften: dict) -> bool:
    """Sitzt ein Statist nach seinen Eigenschaften (``sitzt`` oder ``zustand``, wie figurzustand.ts)?"""
    zustand = eigenschaften.get("zustand")
    if zustand == "stehen":
        return False
    return zustand in SITZZUSTAENDE or eigenschaften.get("sitzt") in SITZWERTE


def angaben_der_szene(szene: dict) -> list[Angabe]:
    """Die Statisten einer Szene als Angaben, in der Reihenfolge von ``belebung``."""
    ergebnis = []
    for b in szene.get("belebung", []):
        if b.get("typ") != "statist":
            continue
        e = b.get("eigenschaften", {})
        ergebnis.append(
            Angabe(
                name=b["name"],
                feld=(b["feld"][0], b["feld"][1]),
                tun=e.get("tun", ""),
                bild=e.get("bild") or None,
                rolle=e.get("rolle") or None,
                sitzt=sitzt(e),
            )
        )
    return ergebnis


def bilder_der_szene(szene: dict) -> list[str]:
    """Bogenname je Statist der Szene (Reihenfolge wie ``angaben_der_szene``).

    Beispiel: London, Strand → lauter historische Bilder, kein Bauhelm.
    """
    return waehle(angaben_der_szene(szene))

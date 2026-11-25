"""Wer spricht oder im Text vorkommt, ist anwesend: Dialoge gegen die Figuren auf der Karte.

Warum: Befund des Autors (25.11.2026, eine halbe Stunde Spiel von Anfang an auf dem iPhone): Er habe
„ganz häufig“ gespürt, dass ein Dialog nur passt, wenn der Held woanders wäre. Beispiele: Abends
redet im Wohnzimmer Hector, der im Diner steht, und Mama fragt „Gibt es hier Ketchup?“; im Clubraum
erzählt der Text Victoria, die nie im Bild war, und dann spielt man gegen sie; Mama spricht im Zimmer
des Helden, steht aber nicht dort. Regel des Autors: Wer spricht oder im Text vorkommt, steht auf der
Karte oder kommt sichtbar herein. Erzählt der Text einen anderen Ort, geht die Szene dorthin, oder
der Text wird umgeschrieben.

Baut auf figurenort.py (Kartenbelegung, Ortswörter), sprecherort.py (Haltung) und erzaehlzeit.py
(Weg im Gespräch) auf. Geprüft wird jeder Dialog von seinem Einstieg aus (Figur, Auslöser, Eingang
einer Karte) auf jeder Karte, auf der er beginnt, mit allen Zeilen, die Ink von dort erreicht. Die
Anwesenden einer Karte sind alle Figuren, die auf ihr in irgendeiner Fassung stehen (großzügig: eine
Figur, die nur zu anderer Zeit dort steht, zählt mit; das fängt die groben Fälle ohne Fehlalarme).
Vier Prüfungen:

1. **sprecher:** Eine Zeile mit ``#sprecher:X``, aber X steht nicht auf der Karte. Ausgenommen sind
   Erzähler, Held und Ambrose (er begleitet den Helden als Geist) und Zeilen in Erinnerungen
   (``#erinnerung``, Orte der Art „erinnerung“).
2. **genannt:** Eine Erzählzeile beginnt mit dem Namen einer Figur („Hector bleibt am Tisch stehen“,
   „Coach Delgado schaltet ihn aus“) und erzählt sie damit als da, aber sie steht nicht auf der Karte.
3. **ort:** Eine Zeile nennt einen Innenort als Schauplatz („Im Diner“, „Das Diner an der
   Hauptstraße …“), der nicht zur Karte passt (Ortswörter aus figurenort.py).
4. **tagebuch:** Ein Questschritt erzählt, dass eine Figur mit {held} unterwegs ist („Mit Juno zu Fuß
   nach Cedar Creek gehen“), aber sie ist nirgends Begleiter (BEGLEITUNG, regeln/gefolge.ts).

Jeder Fund ist behoben, steht mit Grund in ``anwesenheit_geprueft.GEPRUEFT`` (passt) oder mit
Vorschlag in ``GEMELDET`` (wartet auf eine Entscheidung, etwa Juno als Mitreisende). Die offenen Funde
zählt der Dauertest (pipeline/tests/test_abenteuer_anwesenheit.py) gegen eine Obergrenze, die nur
sinken darf. Der Bericht ordnet nach Akt (Akt 1 zuerst), Hauptweg vor Nebenweg und Häufigkeit.

Aufruf: ``python -m pipeline.abenteuer.anwesenheit [--alle] [--bericht DATEI]``.
Abhängigkeiten: figurenort.py, inkfluss.py, Standardbibliothek.
"""

import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

from pipeline.abenteuer.anwesenheit_geprueft import GEMELDET, GEPRUEFT
from pipeline.abenteuer.figurenort import DATEN, ORTSWOERTER, _fluss, lade_orte
from pipeline.abenteuer.inkfluss import erreichbar

# Sprecher ohne Platz auf der Karte: Erzähler, Held, Ambrose als Geist neben dem Helden.
OHNE_PLATZ = frozenset({"erzaehler", "held", "ambrose"})
SPRECHER = re.compile(r"#sprecher:(\w+)")
# Ein Ort als Schauplatz: „Im Diner“, „Am Steg“ oder am Satzanfang „Das Diner …“.
SCHAUPLATZ = re.compile(
    r"(?:\b(?:In der|Im|Ins|In die|In den|Am|Auf dem|Durch die)|^(?:Das|Der|Die)) ("
    + "|".join(ORTSWOERTER)
    + r")\b"
)
# Statisten, die eine Figur der Geschichte zeigen, ohne ihren Namen zu tragen ((Karte, Objekt) →
# Sprecher; Karte None: auf jeder Karte). Belegt durch das `tun` der Szene.
STATIST_ALS_FIGUR: dict[tuple[str | None, str], str] = {
    (None, "mutterWartet"): "mutter",
    ("wegMapleCedar.flussweg", "angler"): "silas",  # „Silas angelt am Ende des Stegs“
    ("wegMapleCedar.landstrasse", "verkaeuferin"): "odette",  # Flohmarkt am Wohnmobil „Gambit“
}
# Sprecher, die eine Figur unter anderem Namen ist (Tessa heißt, bis sie sich vorstellt, „Joggerin“).
SPRECHER_ALS_FIGUR = {"joggerin": "tessa"}
# Begleiter (app/src/abenteuer/regeln/gefolge.ts): Wer mit {held} geht, ist auf den Karten dieser
# Orte anwesend. Gesetzt in Ink (`~ begleiter = "juno"`); test_abenteuer_anwesenheit.py prüft, dass
# jeder Eintrag in Ink gesetzt wird. Juno: vom Ortsschild in Maple Falls bis zur Busfahrt zurück.
BEGLEITUNG: dict[str, frozenset[str]] = {
    "juno": frozenset({"wegMapleCedar", "cedarCreek"}),
}
# Mindestlänge eines Nachnamens, der allein als Name gilt („Delgado“, nicht „Joe“ aus „Big Joe“).
NACHNAME_MIN = 4


@dataclass
class Fund:
    """Ein Fund: Prüfung, Figur oder Ortswort, Fundstelle (Datei.Knoten), Karte, Text."""

    pruefung: str
    wer: str
    stelle: str
    karte: str
    text: str
    akt: int = 0
    haupt: bool = False
    zahl: int = 1

    @property
    def schluessel(self) -> str:
        """Kennung für ``GEPRUEFT``: Prüfung, Figur oder Ortswort, Fundstelle, Karte."""
        return f"{self.pruefung}:{self.wer}:{self.stelle}@{self.karte}"

    def geprueft(self) -> str | None:
        """Der Grund aus ``GEPRUEFT`` (passt) oder ``GEMELDET`` (Vorschlag, wartet), sonst None."""
        return GEPRUEFT.get(self.schluessel) or GEMELDET.get(self.schluessel)


@dataclass
class Welt:
    """Was die Prüfung braucht: Anwesende je Karte, Einstiege, Namen, Akt je Ort, Hauptknoten."""

    anwesend: dict[str, set[str]] = field(default_factory=dict)
    einstiege: list[tuple[str, str, str]] = field(default_factory=list)  # (Dialog, Karte, Ort)
    namen: dict[str, set[str]] = field(default_factory=dict)  # Name im Text → Sprecher
    akt: dict[str, int] = field(default_factory=dict)
    hauptknoten: set[str] = field(default_factory=set)
    erinnerungsorte: set[str] = field(default_factory=set)


def _objekte(pfad: Path) -> list[dict]:
    """Objekte einer gebauten Karte (Tiled-JSON); leer, wenn es sie nicht gibt."""
    if not pfad.exists():
        return []
    karte = json.loads(pfad.read_text(encoding="utf-8"))
    return [o for ebene in karte.get("layers", []) for o in ebene.get("objects") or []]


def _sprecher_der_figur(figur: dict) -> str:
    """„figur.coachDelgado.name“ → „coachDelgado“ (so heißt die Figur in ``#sprecher``)."""
    return figur["name"].split(".")[1]


def _karte_lesen(welt: Welt, ort: dict, karte: dict, daten: Path) -> None:
    """Anwesende und Einstiege (Figuren, Auslöser, Eingang) einer Karte in allen Fassungen."""
    dateien = [karte["datei"], *(karte.get("zustaende") or {}).values()]
    objekte = [o for d in dateien for o in _objekte(daten / d)]
    namen = {o.get("name") for o in objekte}
    figuren = {f["kennung"].split(".", 1)[1]: f for f in ort["figuren"]}
    hier = welt.anwesend.setdefault(karte["kennung"], set())
    # Ein Statist mit dem Namen einer Figur ist sie selbst (Juno am Bahndamm, Mama im Clubraum).
    for objekt in (o for o in objekte if o.get("type") == "statist"):
        name = objekt["name"]
        hier.add(
            STATIST_ALS_FIGUR.get((karte["kennung"], name)) or STATIST_ALS_FIGUR.get((None, name)) or name
        )
    for name in namen:
        if figur := figuren.get(name):
            hier.add(_sprecher_der_figur(figur))
            if figur.get("dialog"):
                welt.einstiege.append((figur["dialog"], karte["kennung"], ort["kennung"]))
    for ausloeser in ort.get("ausloeser", []):
        if ausloeser.get("dialog") and ausloeser["name"] in namen:
            welt.einstiege.append((ausloeser["dialog"], karte["kennung"], ort["kennung"]))
    if dialog := (karte.get("eingang") or {}).get("dialog"):
        welt.einstiege.append((dialog, karte["kennung"], ort["kennung"]))


def _akte(orte: list[dict], daten: Path) -> dict[str, int]:
    """Akt je Ort: kleinste Aktnummer der Szenen seiner Quests; Wege erben vom Ort davor.

    Wie aktJeOrt in lesefassung.cjs. Beispiel: mapleFalls → 1, riverton → 2.
    """
    quests = json.loads((daten / "quests.json").read_text(encoding="utf-8"))["quests"]
    akt: dict[str, int] = {}
    for quest in quests:
        for schritt in quest["schritte"]:
            for wirkung in schritt.get("wirkungen", []):
                if wirkung.get("art") == "szene":
                    akt[quest["ort"]] = min(wirkung["akt"], akt.get(quest["ort"], wirkung["akt"]))
    bisher = 1
    for ort in orte:
        bisher = akt.setdefault(ort["kennung"], bisher)
    return akt


def _hauptknoten(daten: Path) -> set[str]:
    """Dialogknoten, die Hauptquests beginnen oder als Ereignis verlangen („datei.knoten“)."""
    quests = json.loads((daten / "quests.json").read_text(encoding="utf-8"))["quests"]
    knoten = set()
    for quest in (q for q in quests if q.get("haupt")):
        if quest.get("start", {}).get("art") == "dialog":
            knoten.add(quest["start"]["knoten"])
        for schritt in quest["schritte"]:
            if schritt.get("ereignis", {}).get("art") == "dialog":
                knoten.add(schritt["ereignis"]["knoten"])
    return knoten


def _namen(orte: list[dict], daten: Path) -> dict[str, set[str]]:
    """Name im Text → Sprecher: der ganze Name aus den Spieltexten und ein langer Nachname."""
    texte = json.loads((daten / "texte" / "de.json").read_text(encoding="utf-8"))
    namen: dict[str, set[str]] = {}
    for figur in (f for ort in orte for f in ort["figuren"]):
        name = texte.get(figur["name"], "")
        sprecher = _sprecher_der_figur(figur)
        if not name or sprecher in OHNE_PLATZ:
            continue
        teile = name.split()
        for form in {name, teile[-1]} if len(teile[-1]) >= NACHNAME_MIN else {name}:
            namen.setdefault(form, set()).add(sprecher)
    return namen


def lade_welt(daten: Path = DATEN) -> Welt:
    """Liest Orte, Karten, Texte und Quests."""
    orte = lade_orte(daten)
    welt = Welt(namen=_namen(orte, daten), akt=_akte(orte, daten), hauptknoten=_hauptknoten(daten))
    for ort in orte:
        if ort.get("art") == "erinnerung" or ort["kennung"].startswith("erinnerung"):
            welt.erinnerungsorte.add(ort["kennung"])
        for karte in ort["karten"]:
            _karte_lesen(welt, ort, karte, daten)
    return welt


def _zeilenfunde(welt: Welt, text: str, marken: str, karte: str) -> list[tuple[str, str]]:
    """Die Funde einer Zeile als (Prüfung, Figur oder Ortswort)."""
    ort = karte.split(".")[0]
    mit = {name for name, orte in BEGLEITUNG.items() if ort in orte}
    hier = welt.anwesend.get(karte, set()) | mit
    funde = []
    sprecher = SPRECHER.search(marken)
    wer = sprecher.group(1) if sprecher else "erzaehler"
    if wer not in OHNE_PLATZ and SPRECHER_ALS_FIGUR.get(wer, wer) not in hier:
        funde.append(("sprecher", wer))
    if wer == "erzaehler":
        for name, figuren in welt.namen.items():
            if text.startswith(name + " ") and not {SPRECHER_ALS_FIGUR.get(f, f) for f in figuren} & hier:
                funde.append(("genannt", sorted(figuren)[0]))
    for treffer in SCHAUPLATZ.finditer(text):
        if karte not in ORTSWOERTER[treffer.group(1)]:
            funde.append(("ort", treffer.group(1)))
    return funde


def _einstiegsfunde(welt: Welt, dialog: str, karte: str, ort: str, daten: Path) -> list[Fund]:
    """Alle Funde eines Einstiegs auf einer Karte (Zeilen, die Ink vom Startknoten erreicht)."""
    datei, _, knoten = dialog.partition(".")
    fluss = _fluss(daten, datei)
    start = fluss.namen.get((knoten,)) if fluss else None
    if start is None or ort in welt.erinnerungsorte:
        return []
    funde = []
    for index in sorted(erreichbar(fluss, start)):
        zeile = fluss.zeilen[index]
        text, _, marken = zeile.text.partition(" #")
        marken = "#" + marken
        if "#erinnerung" in marken or not text.strip() or text.lstrip()[:1] in "~*+-={/":
            continue
        for pruefung, wer in _zeilenfunde(welt, text.strip(), marken, karte):
            stelle = f"{datei}.{zeile.knoten}"
            funde.append(
                Fund(
                    pruefung,
                    wer,
                    stelle,
                    karte,
                    text.strip(),
                    welt.akt.get(ort, 0),
                    stelle in welt.hauptknoten,
                )
            )
    return funde


# Tagebuch: „Mit Juno zu Fuß nach Cedar Creek gehen“ erzählt eine Begleitung unterwegs.
UNTERWEGS_MIT = re.compile(
    r"\b[Mm]it ([A-ZÄÖÜ][\wäöüß.]*(?: [A-ZÄÖÜ][\wäöüß]+)?)\b[^.:]*\b(gehen|fahren|reisen|laufen|wandern)\b"
)


def tagebuchfunde(welt: Welt, daten: Path = DATEN) -> list[Fund]:
    """Prüfung 4: Ein Questschritt erzählt im Tagebuch, dass eine Figur mit {held} unterwegs ist,
    aber sie ist nirgends Begleiter (BEGLEITUNG; app/src/abenteuer/regeln/gefolge.ts).

    Beispiel (vor dem 25.11.2026): quest.besserWerden.schritt5 „Mit Juno zu Fuß nach Cedar Creek
    gehen“, Juno stand nur am Ortsschild im Text → Fund.
    """
    texte = json.loads((daten / "texte" / "de.json").read_text(encoding="utf-8"))
    quests = json.loads((daten / "quests.json").read_text(encoding="utf-8"))["quests"]
    ergebnis = []
    for quest in quests:
        for schritt in quest["schritte"]:
            treffer = UNTERWEGS_MIT.search(texte.get(schritt["text"], ""))
            figuren = welt.namen.get(treffer.group(1), set()) if treffer else set()
            if figuren and not figuren & set(BEGLEITUNG):
                fund = Fund(
                    "tagebuch", sorted(figuren)[0], schritt["text"], quest["ort"], texte[schritt["text"]]
                )
                ergebnis.append(Fund(**{**fund.__dict__, "akt": welt.akt.get(quest["ort"], 0)}))
    return ergebnis


def funde(daten: Path = DATEN) -> list[Fund]:
    """Alle Funde, je Schlüssel einmal (mit Zahl der Zeilen), geordnet für den Bericht."""
    welt = lade_welt(daten)
    einmal: dict[str, Fund] = {}
    for dialog, karte, ort in sorted(set(welt.einstiege)):
        for fund in _einstiegsfunde(welt, dialog, karte, ort, daten):
            if bekannt := einmal.get(fund.schluessel):
                bekannt.zahl += 1
            else:
                einmal[fund.schluessel] = fund
    for fund in tagebuchfunde(welt, daten):
        einmal.setdefault(fund.schluessel, fund)
    return sorted(einmal.values(), key=lambda f: (f.akt, not f.haupt, -f.zahl, f.schluessel))


# Wer mit {held} reist (Juno ab Akt 1, Mama auf der Reise in Akt 3 und 4).
MITREISENDE = frozenset({"juno", "mutter"})


def vorschlag(fund: Fund) -> str:
    """Abhilfe je Fund für den Bericht (die Entscheidung bleibt beim Menschen).

    Beispiel: Juno spricht auf einem Weg → Begleiter setzen; eine Ankunft am Übergang → Eingang der
    Zielkarte (wie Cedar Creek am 25.11.2026); ein fremder Ort → die Szene dorthin verlegen.
    """
    knoten = fund.stelle.split(".")[-1]
    if fund.wer in MITREISENDE and fund.pruefung != "ort":
        return "Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)"
    if "ankunft" in knoten:
        return "Ankunft beim Betreten der Zielkarte spielen (Eingang der Karte), nicht am Übergang"
    if fund.pruefung == "ort":
        return f"Szene ins {fund.wer} verlegen (reise und Eingang dort) oder die Ortsangabe anpassen"
    if fund.pruefung == "genannt":
        return "Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist"
    return "Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen"


def offene(alle: list[Fund]) -> list[Fund]:
    """Die Funde ohne Grund in ``GEPRUEFT``."""
    return [f for f in alle if f.geprueft() is None]


def bericht(alle: list[Fund]) -> str:
    """Bericht als Markdown: je Akt die offenen Funde, Hauptweg zuerst, mit Beispielzeile."""
    zeilen = ["# Anwesenheit in Dialogen", "", f"{len(alle)} Funde, {len(offene(alle))} offen.", ""]
    akt = None
    for fund in offene(alle):
        if fund.akt != akt:
            akt = fund.akt
            zeilen += ["", f"## Akt {akt}", ""]
        weg = "Hauptweg" if fund.haupt else "Nebenweg"
        kopf = f"- {fund.pruefung} · {fund.wer} · {fund.stelle} auf {fund.karte} ({weg}, {fund.zahl}×)"
        zeilen.append(f"{kopf}: „{fund.text[:90]}“")
        zeilen.append(f"  Vorschlag: {vorschlag(fund)}")
    return "\n".join(zeilen) + "\n"


def main(argumente: list[str] | None = None) -> int:
    """Druckt die offenen Funde (mit ``--alle`` auch die geprüften), schreibt auf Wunsch den Bericht."""
    argumente = sys.argv[1:] if argumente is None else argumente
    alle = funde()
    for fund in alle:
        grund = fund.geprueft()
        if grund is None or "--alle" in argumente:
            stufe = "geprüft" if grund else "offen"
            print(f"{stufe:8} A{fund.akt} {fund.schluessel} {fund.text[:80]}")
    if "--bericht" in argumente:
        ziel = Path(argumente[argumente.index("--bericht") + 1])
        ziel.parent.mkdir(parents=True, exist_ok=True)
        ziel.write_text(bericht(alle), encoding="utf-8")
    print(f"{len(alle)} Funde, {len(offene(alle))} offen")
    return 1 if offene(alle) else 0


if __name__ == "__main__":
    sys.exit(main())

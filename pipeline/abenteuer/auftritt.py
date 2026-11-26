"""Auftritte: Wer auf eine Karte kommt oder sie verlässt, während der Held dort ist, kommt sichtbar.

Warum: Befund des Autors (26.11.2026, Spieltest auf beta): „Ich habe meine erste Partie gegen den
Coach beendet und gewonnen … und plötzlich stehen Victoria und der Typ von Perfect Move im Raum.“
Dazu erzählte der Dialog erst danach, wie der Wagen vorfährt und der Mann hereinkommt. Zweiter
Befund: Nach der Partie gegen {rivale} gingen Hale und {rivale} zur Tür (13,13) und blieben dort
stehen. Die App lässt neue Figuren seit dem 26.11.2026 durch den nächsten Übergang hereinkommen und
Figuren, deren Bedingung nicht mehr gilt, hinausgehen (app/src/abenteuer/regeln/auftritt.ts); ein
``#gehe`` in einen Übergang blendet die Figur dort aus (oberwelt/auftrittsbild.ts). Diese Prüfung
sucht im ganzen Spiel die Stellen, an denen das nicht genügt.

Geprüft wird jeder Dialog von seinem Einstieg auf jeder Karte aus (wie anwesenheit.py):

1. **umschlag** (Bericht): Eine Zeile setzt eine Variable aus der Bedingung (``wenn``) einer Figur
   dieser Karte (``~ x = …``, Ergebnis einer Partie oder Runde, Fund). Die Figur kommt oder geht dann
   über den allgemeinen Auftritt. Befund nur, wenn die Karte keinen Übergang hat (**ohne_eingang**)
   oder ein Simultan oder eine Gedächtnisstellung sie setzt (**ohne_neuaufbau**: beide laufen in der
   Oberwelt, die Karte baut sich danach nicht neu auf).
2. **erzaehlt**: Eine Erzählzeile erzählt den Auftritt einer Figur dieser Karte („kommt herein“,
   „steht in der Tür“, „hält vor“ …), aber die Figur wartet nicht (``auftritt.wartet`` in orte.json)
   oder die Zeile holt sie nicht mit ``#gehe`` herein: Sie stünde schon da.
3. **kommt_wieder**: Ein ``#gehe`` führt eine Figur in einen Übergang, ihre Bedingung schlägt in
   diesem Gespräch aber nicht um und es führt nicht fort (``reise``): Nach dem nächsten Aufbau stünde
   sie wieder da.
4. **vor_der_tuer**: Ein ``#gehe`` führt eine Figur auf ein Feld direkt neben einem Übergang, aber
   nicht hinein (sie bliebe davor stehen und versperrte ihn); das Ziel ist der Übergang selbst.
5. **wartet_ohne_gehe**: Eine Figur mit ``auftritt.wartet`` wird auf ihrer Karte nie mit ``#gehe``
   hereingeholt.
6. **spricht_vor_auftritt**: Eine Zeile lässt eine Figur dieser Karte kommen (ihre Bedingung kann
   dadurch wahr werden), und danach spricht sie im selben Gespräch, ohne dass ein ``#gehe`` sie
   hereinholt: Sie käme erst nach dem Gespräch durch die Tür (Juno beim ersten Treffen mit dem
   Coach, Mama in der Kantine von Ironwood).

Jeder Befund ist behoben oder steht mit Grund in ``auftritt_geprueft.GEPRUEFT``. Dauertest:
pipeline/tests/test_abenteuer_auftritt.py („0 Befunde“). Aufruf:
``python -m pipeline.abenteuer.auftritt [--alle] [--bericht DATEI]``.
Abhängigkeiten: anwesenheit.py (Einstiege), figurenort.py, inkfluss.py, bedingung.py, karten.py.
"""

import re
import sys
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.anwesenheit import lade_welt
from pipeline.abenteuer.auftritt_geprueft import GEPRUEFT
from pipeline.abenteuer.bedingung import erfuellt
from pipeline.abenteuer.bedingung import variablen as bedingungsvariablen
from pipeline.abenteuer.figurenort import DATEN, _fluss, lade_orte
from pipeline.abenteuer.inkfluss import erreichbar
from pipeline.abenteuer.karten import lade_karte, objekte

GEHE = re.compile(r"#gehe:(\S+)")
ZUWEISUNG = re.compile(r"^\s*~\s*(\w+)\s*(?:=|\+=|-=|\+\+|--)")
PARTIE = re.compile(r'beginnePartie\(\s*"([\w.]+)"')
RUNDE = re.compile(r'beginne(?:Aufgaben|Simultan|Gedaechtnis)\(\s*"([\w.]+)"')
UEBERLAGERT = re.compile(r"beginne(?:Simultan|Gedaechtnis)\(")
FUND = re.compile(r'gibFund\(\s*"(\w+)"')
REISE = re.compile(r"\breise\(")
FELD = re.compile(r"^(\d+),(\d+)$")
# Wendungen, die einen Auftritt erzählen (Erzählzeilen).
AUFTRITT = re.compile(
    r"kommt? herein|kommen herein|steh(?:t|en) in der Tür|hält vor|h[äa]lt .* vor der|tr(?:itt|eten) ein|"
    r"betr(?:itt|eten)|kommt durch die Tür|kommt zur Tür herein|erscheint in der Tür|kommt angelaufen|"
    r"hereingestürmt|platzt herein|stürmt herein|kommt dazu|kommen dazu|steigt aus"
)


@dataclass
class Fund:
    """Ein Fund: Prüfung, Figur, Fundstelle (Datei.Knoten), Karte, Text."""

    pruefung: str
    figur: str
    stelle: str
    karte: str
    text: str

    @property
    def schluessel(self) -> str:
        """Kennung für ``GEPRUEFT``: Prüfung, Figur, Fundstelle und Karte."""
        return f"{self.pruefung}:{self.figur}:{self.stelle}@{self.karte}"

    def geprueft(self) -> str | None:
        """Der Grund aus ``GEPRUEFT`` oder None."""
        return GEPRUEFT.get(self.schluessel)


def _gross(wort: str) -> str:
    return wort[:1].upper() + wort[1:]


def gesetzte_variablen(zeile: str) -> set[str]:
    """Variablen, die eine Ink-Zeile setzt, auch über Ergebnisse (wie regeln/dialogvariablen.ts).

    Beispiel: ``~ beginnePartie("mapleFalls.clubkampf")`` → ausgangMapleFallsClubkampf,
    siegeMapleFallsClubkampf, nadelMapleFalls; ``~ kenntHale = true`` → kenntHale.
    """
    gesetzt = set()
    if treffer := ZUWEISUNG.match(zeile):
        gesetzt.add(treffer.group(1))
    for kennung in PARTIE.findall(zeile):
        teile = kennung.split(".")
        name = "".join(_gross(t) for t in teile)
        gesetzt |= {f"ausgang{name}", f"siege{name}", f"nadel{_gross(teile[0])}"}
    for kennung in RUNDE.findall(zeile):
        *ort, kurz = kennung.split(".")
        for vorne in (kurz, "".join(ort) + _gross(kurz)):
            gesetzt |= {f"{vorne}Bestanden", f"{vorne}Versucht"}
    gesetzt |= {f"gefunden{_gross(f)}" for f in FUND.findall(zeile)}
    return gesetzt


@dataclass
class Kartenlage:
    """Was eine Karte für die Prüfung hat: Übergänge (Name → Felder) und Figuren (Objektname)."""

    uebergaenge: dict[str, set[tuple[int, int]]]
    figuren: set[str]


def kartenlagen(orte: list[dict], daten: Path = DATEN) -> dict[str, Kartenlage]:
    """Übergänge und Figuren je Karte, über alle Fassungen."""
    lagen = {}
    for ort in orte:
        ueber = [a for a in ort.get("ausloeser", []) if a.get("art") == "uebergang"]
        for karte in ort["karten"]:
            namen = {a["name"] for a in ueber if a.get("karte") in (None, karte["kennung"])}
            lage = Kartenlage({}, set())
            for datei in [karte["datei"], *(karte.get("zustaende") or {}).values()]:
                if not (daten / datei).exists():
                    continue
                for o in objekte(lade_karte(daten / datei)):
                    if o.name in namen:
                        lage.uebergaenge.setdefault(o.name, set()).add(o.feld)
                    if o.figur:
                        lage.figuren.add(o.name)
            lagen[karte["kennung"]] = lage
    return lagen


def _figurenangaben(orte: list[dict]) -> dict[tuple[str, str], dict]:
    """(Ort, Objektname) → Eintrag der Figur in orte.json."""
    return {(o["kennung"], f["kennung"].split(".", 1)[1]): f for o in orte for f in o["figuren"]}


def _ausgangsart(ziel: str, lage: Kartenlage) -> str | None:
    """„hinein“ (Name oder Feld eines Übergangs), „davor“ (Feld daneben) oder None."""
    if ziel in lage.uebergaenge:
        return "hinein"
    feld = FELD.match(ziel)
    if not feld:
        return None
    x, y = int(feld.group(1)), int(feld.group(2))
    felder = {f for alle in lage.uebergaenge.values() for f in alle}
    if (x, y) in felder:
        return "hinein"
    return "davor" if any(abs(x - fx) + abs(y - fy) == 1 for fx, fy in felder) else None


@dataclass
class Einstieg:
    """Ein Dialog auf einer Karte mit seinen erreichbaren Zeilen und dem Fluss der Datei."""

    dialog: str
    karte: str
    ort: str
    zeilen: list  # inkfluss.Zeile
    fluss: object = None  # inkfluss.Fluss

    def danach(self, zeile) -> list:
        """Die Zeilen, die Ink nach dieser Zeile erreicht (ohne sie selbst)."""
        index = next(i for i, z in enumerate(self.fluss.zeilen) if z.nummer == zeile.nummer)
        return [self.fluss.zeilen[i] for i in sorted(erreichbar(self.fluss, index)) if i != index]


def einstiege(daten: Path = DATEN) -> list[Einstieg]:
    """Jeder Dialog von seinem Einstieg auf jeder Karte aus (anwesenheit.lade_welt)."""
    welt = lade_welt(daten)
    ergebnis = []
    for dialog, karte, ort in sorted(set(welt.einstiege)):
        datei, _, knoten = dialog.partition(".")
        fluss = _fluss(daten, datei)
        start = fluss.namen.get((knoten,)) if fluss else None
        if start is None or ort in welt.erinnerungsorte:
            continue
        zeilen = [fluss.zeilen[i] for i in sorted(erreichbar(fluss, start))]
        ergebnis.append(Einstieg(dialog, karte, ort, zeilen, fluss))
    return ergebnis


def _stelle(e: Einstieg, zeile) -> str:
    return f"{e.dialog.partition('.')[0]}.{zeile.knoten}"


def _gehe_auftraege(text: str) -> list[tuple[str, str]]:
    """Die (Figur, Ziel) der ``#gehe``-Tags einer Zeile, ohne den Helden."""
    auftraege = []
    for wert in GEHE.findall(text):
        for teil in wert.split(";"):
            wer, _, rest = teil.partition(">")
            if wer and wer != "held" and rest:
                auftraege.append((wer, rest.split(">")[0]))
    return auftraege


def _umschlaege(e: Einstieg, lage: Kartenlage, angaben: dict) -> list[Fund]:
    """Prüfung 1: Zeilen, die die Bedingung einer Figur dieser Karte umschlagen lassen."""
    funde = []
    for zeile in e.zeilen:
        gesetzt = gesetzte_variablen(zeile.text)
        for name in sorted(lage.figuren):
            wenn = angaben.get((e.ort, name), {}).get("wenn")
            if wenn and gesetzt & bedingungsvariablen(wenn):
                art = "umschlag" if lage.uebergaenge else "ohne_eingang"
                # Simultan und Gedächtnis laufen in der Oberwelt: kein Neuaufbau danach.
                art = "ohne_neuaufbau" if UEBERLAGERT.search(zeile.text) else art
                funde.append(Fund(art, name, _stelle(e, zeile), e.karte, zeile.text.strip()))
    return funde


# Werte, mit denen kann_kommen die übrigen Variablen einer Bedingung durchprobiert.
PROBEWERTE = (None, True, 1, "sieg")
# Neue Werte nach einem Ergebnis (Partie, Runde, Fund).
ERGEBNISWERTE = (True, 1, 2, 3, "sieg", "remis", "niederlage")
WERT = re.compile(r'^\s*~\s*\w+\s*=\s*(true|false|-?\d+|"[^"]*")\s*$')


def _neue_werte(zeile: str) -> tuple:
    """Die Werte, die eine Zeile setzt: das Wörtliche einer Zuweisung, sonst die eines Ergebnisses."""
    treffer = WERT.match(zeile)
    if not treffer:
        return ERGEBNISWERTE
    wort = treffer.group(1)
    if wort in ("true", "false"):
        return (wort == "true",)
    return (wort.strip('"'),) if wort.startswith('"') else (int(wort),)


def kann_kommen(wenn: str, variable: str, neue: tuple) -> bool:
    """Kann die Bedingung durch den neuen Wert von ``variable`` wahr werden?

    Beispiel: „clubBeigetreten und (nicht aufbruchGesehen)“, clubBeigetreten = true → ja;
    „nadelMapleFalls > 0 und nicht heimwegNadelGesehen“, heimwegNadelGesehen = true → nein.
    Die übrigen Variablen nehmen jeden Wert aus PROBEWERTE an (wenige je Bedingung).
    """
    andere = sorted(bedingungsvariablen(wenn) - {variable})
    belegungen: list[dict] = [{}]
    for name in andere:
        belegungen = [{**b, name: w} for b in belegungen for w in PROBEWERTE]
    return any(
        alt != neu
        and not erfuellt(wenn, {**belegung, variable: alt})
        and erfuellt(wenn, {**belegung, variable: neu})
        for belegung in belegungen
        for alt in PROBEWERTE
        for neu in neue
    )


def _sprechen_vorher(e: Einstieg, lage: Kartenlage, angaben: dict) -> list[Fund]:
    """Prüfung 6: Eine Figur kommt durch eine Zeile und spricht danach, ohne hereingeholt zu sein."""
    funde = []
    for zeile in e.zeilen:
        gesetzt = gesetzte_variablen(zeile.text)
        for name in sorted(lage.figuren):
            figur = angaben.get((e.ort, name), {})
            wenn = figur.get("wenn")
            treffer = sorted(gesetzt & bedingungsvariablen(wenn)) if wenn else []
            if not any(kann_kommen(wenn, v, _neue_werte(zeile.text)) for v in treffer):
                continue
            danach = e.danach(zeile)
            sprecher = f"#sprecher:{figur['name'].split('.')[1]}"
            spricht = next((z for z in danach if sprecher in z.text), None)
            geholt = any(name in {w for w, _ in _gehe_auftraege(z.text)} for z in danach)
            if spricht and not geholt:
                text = spricht.text.split(" #")[0].strip()
                funde.append(Fund("spricht_vor_auftritt", name, _stelle(e, zeile), e.karte, text))
    return funde


def _erzaehlte(e: Einstieg, lage: Kartenlage, angaben: dict, namen: dict[str, set[str]]) -> list[Fund]:
    """Prüfung 2: erzählte Auftritte einer Figur, die schon dasteht."""
    funde = []
    for zeile in e.zeilen:
        text = zeile.text.split(" #")[0]
        if "#sprecher:erzaehler" not in zeile.text and "#sprecher" in zeile.text:
            continue
        if not AUFTRITT.search(text):
            continue
        geholt = {wer for wer, _ in _gehe_auftraege(zeile.text)}
        # Nur wer im Satz mit der Wendung steht („Ein Gast kommt herein. Hector dreht sich um.“).
        satz = next((s for s in re.split(r"(?<=[.!?])\s+", text) if AUFTRITT.search(s)), text)
        genannt = {f for n, figuren in namen.items() if n in satz for f in figuren}
        for name in sorted(lage.figuren):
            figur = angaben.get((e.ort, name), {})
            sprecher = figur.get("name", "..").split(".")[1]
            if name not in geholt and sprecher not in genannt:
                continue
            if figur.get("auftritt", {}).get("wartet") and name in geholt:
                continue
            funde.append(Fund("erzaehlt", name, _stelle(e, zeile), e.karte, text.strip()))
    return funde


def _ausgaenge(e: Einstieg, lage: Kartenlage, angaben: dict) -> list[Fund]:
    """Prüfungen 3 und 4: ``#gehe`` in einen Übergang oder davor."""
    gesetzt = set().union(*(gesetzte_variablen(z.text) for z in e.zeilen))
    reist = any(REISE.search(z.text) for z in e.zeilen)
    funde = []
    for zeile in e.zeilen:
        for wer, ziel in _gehe_auftraege(zeile.text):
            art = _ausgangsart(ziel, lage) if wer in lage.figuren else None
            text = zeile.text.split(" #")[0].strip()
            if art == "davor":
                funde.append(Fund("vor_der_tuer", wer, _stelle(e, zeile), e.karte, f"{text} → {ziel}"))
            wenn = angaben.get((e.ort, wer), {}).get("wenn")
            schlaegt_um = bool(wenn) and bool(gesetzt & bedingungsvariablen(wenn))
            if art == "hinein" and not schlaegt_um and not reist:
                funde.append(Fund("kommt_wieder", wer, _stelle(e, zeile), e.karte, f"{text} → {ziel}"))
    return funde


def _wartende(alle: list[Einstieg], lagen: dict[str, Kartenlage], orte: list[dict]) -> list[Fund]:
    """Prüfung 5: Wartende, die auf ihrer Karte nie mit ``#gehe`` hereingeholt werden."""
    geholt = {(e.karte, w) for e in alle for z in e.zeilen for w, _ in _gehe_auftraege(z.text)}
    funde = []
    for figur in (f for ort in orte for f in ort["figuren"] if f.get("auftritt", {}).get("wartet")):
        name = figur["kennung"].split(".", 1)[1]
        for karte in (k for k, lage in lagen.items() if name in lage.figuren and (k, name) not in geholt):
            funde.append(Fund("wartet_ohne_gehe", name, figur["kennung"], karte, figur["auftritt"]["wartet"]))
    return funde


def funde(daten: Path = DATEN) -> list[Fund]:
    """Alle Funde (je Schlüssel einmal), Umschläge mit ``umschlag`` nur für den Bericht."""
    orte = lade_orte(daten)
    lagen = kartenlagen(orte, daten)
    angaben = _figurenangaben(orte)
    # Der Platzhalter des Rivalen (Story-Bibel 5.2a) nennt Victor oder Victoria.
    namen = {**lade_welt(daten).namen, "{rivale}": {"victor"}}
    alle = einstiege(daten)
    einmal: dict[str, Fund] = {}
    for e in alle:
        lage = lagen.get(e.karte)
        if not lage:
            continue
        for fund in [
            *_umschlaege(e, lage, angaben),
            *_erzaehlte(e, lage, angaben, namen),
            *_ausgaenge(e, lage, angaben),
            *_sprechen_vorher(e, lage, angaben),
        ]:
            einmal.setdefault(fund.schluessel, fund)
    for fund in _wartende(alle, lagen, orte):
        einmal.setdefault(fund.schluessel, fund)
    return sorted(einmal.values(), key=lambda f: (f.pruefung, f.karte, f.schluessel))


def befunde(alle: list[Fund]) -> list[Fund]:
    """Die Befunde: alles außer den Umschlägen über den allgemeinen Auftritt, ohne Geprüfte."""
    return [f for f in alle if f.pruefung != "umschlag" and not f.geprueft()]


def bericht(alle: list[Fund]) -> str:
    """Bericht als Markdown: Befunde, Geprüfte mit Grund, Umschläge je Karte."""
    zeilen = ["# Auftritte (pipeline/abenteuer/auftritt.py)", ""]
    offen = befunde(alle)
    zeilen += [f"Befunde: {len(offen)}", ""]
    zeilen += [f"- `{f.schluessel}`: {f.text}" for f in offen]
    zeilen += ["", "## Geprüft (mit Grund)", ""]
    zeilen += [f"- `{f.schluessel}`: {f.geprueft()}" for f in alle if f.geprueft()]
    umschlaege = [f for f in alle if f.pruefung == "umschlag"]
    zeilen += ["", f"## Umschläge über den allgemeinen Auftritt ({len(umschlaege)})", ""]
    zeilen += [f"- {f.karte}: {f.figur} ← `{f.stelle}`: {f.text[:90]}" for f in umschlaege]
    return "\n".join(zeilen) + "\n"


def main(argumente: list[str] | None = None) -> int:
    """Gibt die Befunde aus (mit --alle auch Umschläge und Geprüfte); --bericht schreibt Markdown."""
    argumente = sys.argv[1:] if argumente is None else argumente
    alle = funde()
    if "--bericht" in argumente:
        ziel = Path(argumente[argumente.index("--bericht") + 1])
        ziel.write_text(bericht(alle), encoding="utf-8")
    zeigen = alle if "--alle" in argumente else befunde(alle)
    for f in zeigen:
        grund = f.geprueft()
        print(f"{f.schluessel}  {f.text[:100]}" + (f"  [geprüft: {grund}]" if grund else ""))
    offen = befunde(alle)
    umschlaege = sum(f.pruefung == "umschlag" for f in alle)
    print(f"{len(offen)} Befunde, {umschlaege} Umschläge über den allgemeinen Auftritt")
    return 1 if offen else 0


if __name__ == "__main__":
    sys.exit(main())

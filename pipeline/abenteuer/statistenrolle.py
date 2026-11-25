"""Befehl: Passt das Bild jedes Statisten zu seiner Rolle? (Kartenblick M05, 24.11.2026)

Warum: Der Autor sah auf 38 Karten Statisten, deren Bild nicht zur Rolle passt (Empfangsdame als
Bauarbeiter, Koch als Rentnerin, Warnweste in London 1851), und dieselben drei, vier Gestalten
doppelt nebeneinander. Seit dem 24.11.2026 wählt ``statistenwahl.py`` (in der App
``oberwelt/statistenwahl.ts``) das Bild nach der Rolle. Diese Prüfung hält das fest und findet, was
die Wahl nicht richten kann: von Hand gesetzte Bilder, unbekannte Rollen, zu wenig Bilder.

Befunde, je Szene (jede Fassung für sich):
- ``rolle`` nennt keine Regel aus ``statistenrollen.json``.
- Ein von Hand gesetztes ``bild`` aus dem Vorrat passt nicht zur Regel des Statisten (weder unter
  ``typen`` noch unter ``ausweich``). Bilder eigener Figuren („otis“) sind immer recht.
- Der Bauhelm (``BAUHELM``) steht bei jemandem, dessen Regel nicht ``bau`` ist.
- Dasselbe Bild steht zweimal höchstens ``NAH`` Felder auseinander.
- Auf einer Erinnerungskarte (Kennung beginnt mit „erinnerung“) steht ein Bild, das zu keiner Regel
  der Vergangenheit gehört (``ERINNERUNGSREGELN``: ``london`` für London 1851, seit 25.11.2026,
  ``historisch`` für die übrigen).
Dazu die Liste selbst: Jedes genannte Bild ist ein Typ, der Vorrat stimmt mit
``pixellabtabelle.statistentyp`` überein; mit ``--privat`` auch: Jeder Typ liegt im Paket, und
``sitzbild`` stimmt mit dem Ordner ``zustaende/sitzstuhl`` überein.

Ausnahmen stehen mit Grund in ``GEPRUEFT``. Dauertest (pipeline/tests): „0 Befunde“.

Probe für die App: ``--probe`` schreibt ``app/src/abenteuer/oberwelt/statistenwahl.probe.json``, die
Statisten von ``PROBESZENEN`` mit dem hier gewählten Bild. Der Dauertest verlangt, dass die Datei
zur Rechnung passt; Vitest (statistenwahl.test.ts) rechnet sie in der App nach. So liefern Vorschau
und Spiel dasselbe Bild. Nach jeder Änderung an den Regeln oder an diesen Szenen neu schreiben.

Ablauf (im Hauptordner): python -m pipeline.abenteuer.statistenrolle [--alle] [--privat PRIVAT] [--probe]
"""

import argparse
import json
from pathlib import Path

from pipeline.abenteuer import statistenwahl as W
from pipeline.abenteuer.kartenbau import INHALTE
from pipeline.abenteuer.pixellabtabelle import STATISTEN, statistentyp

SZENEN = INHALTE / "szenen"
BAUHELM = "statist.arbeiter"
BAUREGEL = "bau"
HISTORISCH = "historisch"
# Regeln, deren Bilder auf Erinnerungskarten stehen dürfen (London 1851 hat seit der Lieferung vom
# 25.11.2026 eigene Herren und Damen, Kartenblick B, K11).
ERINNERUNGSREGELN = ("london", HISTORISCH)
ERINNERUNG = "erinnerung"
# (Szene, Statist) → Grund, warum dasselbe Bild in der Nähe stehen darf. Der Eintrag gilt für das
# Paar, wenn einer der beiden genannt ist.
_NUR_DREI_HISTORISCHE = (
    "Im Kaffeehaus sitzen vier Herren in einem Raum; mit Sitzbild gibt es für London 1851 nur den "
    "Herrn mit Zylinder (statist.london-herr, Lieferung 25.11.2026), statist.hist und zeitungsleser "
    "stehen. Sitzende bekommen lieber dasselbe Bild als ein stehendes auf dem Stuhl; Kieseritzky trägt "
    "es von Hand, weil die Wahl an seinem Namen kein Geschlecht erkennt (sonst die Dame)."
)
_NUR_DREI_KINDER = (
    "Vier Kinder stehen als Schachfiguren in einer Reihe, das Paket hat drei Bilder für Kinder und "
    "Jugendliche (statist.kindA, statist.kindB, statist.jugend). Weitere Kinderbilder sind ein "
    "Bildauftrag (Welle 3)."
)
GEPRUEFT: dict[tuple[str, str], str] = {
    ("erinnerung-london-kaffeehaus", "gastAmFenstertisch"): _NUR_DREI_HISTORISCHE,
    ("erinnerung-london-kaffeehaus", "kieseritzky"): _NUR_DREI_HISTORISCHE,
    ("erinnerung-london-kaffeehaus", "zeitungsleserBank"): _NUR_DREI_HISTORISCHE,
    ("weg-crossroads-pinewood-riesenbaeume", "weissesKind4"): _NUR_DREI_KINDER,
    ("weg-crossroads-pinewood-riesenbaeume", "schwarzesKind4"): _NUR_DREI_KINDER,
}

# Szenen der Probe: dichte Plätze, Sitzende, Bilder von Hand, Rollen von Hand, Erinnerung.
PROBESZENEN = (
    "capital-arena-aussen",
    "erinnerung-london-kaffeehaus",
    "ironwood-aussen",
    "ironwood-kantine",
    "lockport-aussen",
    "maple-falls-clubraum",
    "maple-falls-diner",
    "silicon-bay-akademie",
    "weg-crossroads-pinewood-riesenbaeume",
    "weg-riverton-ironwood-2",
)
PROBEDATEI = W.ROLLENDATEI.with_name("statistenwahl.probe.json")

Befund = tuple[str, str]  # (Szene, Satz)


def lade_szenen() -> dict[str, dict]:
    """Alle Szenen mit Statisten: Dateiname ohne Endung → Inhalt."""
    szenen = {}
    for pfad in sorted(SZENEN.glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        if W.angaben_der_szene(szene):
            szenen[pfad.stem] = szene
    return szenen


def _bilder_der_regel(regel: dict) -> list[str]:
    """Alle Bilder, die eine Regel erlaubt (passende und Ausweichbilder)."""
    return regel["typen"] + regel["ausweich"]


def _rollenbefunde(a: W.Angabe, bild: str) -> list[str]:
    """Befunde eines Statisten für sich: unbekannte Rolle, falsches Bild von Hand, Bauhelm."""
    befunde = []
    if a.rolle and a.rolle not in W.REGELN:
        befunde.append(f"{a.name}: rolle „{a.rolle}“ steht nicht in statistenrollen.json")
    regel = W.regel_fuer(a.name, a.tun, a.rolle)
    kenn = W.kennbild(bild)
    if a.bild and kenn in W.TYPEN and kenn not in _bilder_der_regel(regel):
        befunde.append(
            f"{a.name}: bild „{a.bild}“ ({kenn}) passt nicht zur Rolle {regel['rolle']} "
            f"(erlaubt: {', '.join(_bilder_der_regel(regel))}); bild streichen oder rolle setzen"
        )
    if kenn == BAUHELM and regel["rolle"] != BAUREGEL:
        befunde.append(f"{a.name}: Bauhelm ohne Bauarbeit (Rolle {regel['rolle']})")
    return befunde


def _nachbarbefunde(name: str, angaben: list[W.Angabe], bilder: list[str]) -> list[str]:
    """Dasselbe Bild zweimal höchstens NAH Felder auseinander (jedes Paar einmal)."""
    befunde = []
    for i, a in enumerate(angaben):
        for j in range(i + 1, len(angaben)):
            b = angaben[j]
            if W.kennbild(bilder[i]) != W.kennbild(bilder[j]):
                continue
            nah = abs(a.feld[0] - b.feld[0]) <= W.NAH and abs(a.feld[1] - b.feld[1]) <= W.NAH
            if nah and (name, a.name) not in GEPRUEFT and (name, b.name) not in GEPRUEFT:
                befunde.append(
                    f"{a.name} {a.feld} und {b.name} {b.feld}: beide {W.kennbild(bilder[i])}, "
                    f"höchstens {W.NAH} Felder auseinander"
                )
    return befunde


def befunde_der_szene(name: str, szene: dict) -> list[str]:
    """Alle Befunde einer Szene als Sätze.

    Beispiel: London, Strand, „passanten“ ohne ``rolle`` → „… nicht historisch“.
    """
    angaben = W.angaben_der_szene(szene)
    bilder = W.waehle(angaben)
    befunde = []
    historisch = [b for r in ERINNERUNGSREGELN for b in _bilder_der_regel(W.REGELN[r])]
    for a, bild in zip(angaben, bilder, strict=True):
        befunde += _rollenbefunde(a, bild)
        kenn = W.kennbild(bild)
        if szene.get("karte", "").startswith(ERINNERUNG) and kenn in W.TYPEN and kenn not in historisch:
            befunde.append(
                f"{a.name}: {kenn} auf einer Erinnerungskarte; rolle „london“ oder „{HISTORISCH}“ setzen"
            )
    return befunde + _nachbarbefunde(name, angaben, bilder)


def listenbefunde(privat: Path | None = None) -> list[str]:
    """Befunde an statistenrollen.json selbst (siehe Dateikopf); mit ``privat`` gegen das Paket."""
    befunde = []
    for regel in W.ROLLEN["regeln"]:
        befunde += [
            f"Regel {regel['rolle']}: Bild „{t}“ ist kein Typ"
            for t in _bilder_der_regel(regel)
            if t not in W.TYPEN
        ]
        if BAUHELM in _bilder_der_regel(regel) and regel["rolle"] != BAUREGEL:
            befunde.append(f"Regel {regel['rolle']}: Der Bauhelm gehört nur in die Regel {BAUREGEL}")
        befunde += [
            f"Regel {regel['rolle']}: Wort „{w}“ ist nicht klein geschrieben"
            for w in regel["namen"] + regel["tun"]
            if w != w.lower()
        ]
    if W.ROLLEN["sonst"] not in W.REGELN:
        befunde.append("sonst nennt keine Regel")
    erwartet = [statistentyp(n) for n in range(1, STATISTEN + 1)]
    if W.ROLLEN["vorrat"] != erwartet:
        befunde.append("vorrat weicht von pixellabtabelle.statistentyp ab")
    if privat is not None:
        befunde += _paketbefunde(privat)
    return befunde


def _paketbefunde(privat: Path) -> list[str]:
    """Liegt jeder Typ im Paket, und stimmt ``sitzbild`` mit dem Ordner der Sitzbilder überein?"""
    befunde = []
    for typ, angabe in W.TYPEN.items():
        ordner = privat / "spiel" / "figuren-neu" / typ
        if not (ordner / "rotations").is_dir():
            befunde.append(f"Typ {typ}: kein Ordner im Paket (figuren-neu/{typ}/rotations)")
        elif angabe["sitzbild"] != (ordner / "zustaende" / "sitzstuhl").is_dir():
            befunde.append(f"Typ {typ}: sitzbild {angabe['sitzbild']} stimmt nicht mit dem Paket überein")
    return befunde


def alle_befunde(privat: Path | None = None) -> list[Befund]:
    """Alle Befunde: zuerst die Liste (Szene „statistenrollen.json“), dann je Szene."""
    ergebnis = [("statistenrollen.json", satz) for satz in listenbefunde(privat)]
    for name, szene in lade_szenen().items():
        ergebnis += [(name, satz) for satz in befunde_der_szene(name, szene)]
    return ergebnis


def uebersicht() -> str:
    """Alle Statisten mit Regel und Bild, eine Zeile je Statist (für ``--alle``)."""
    zeilen = []
    for name, szene in lade_szenen().items():
        angaben = W.angaben_der_szene(szene)
        for a, bild in zip(angaben, W.waehle(angaben), strict=True):
            regel = W.regel_fuer(a.name, a.tun, a.rolle)["rolle"]
            von_hand = " (von Hand)" if a.bild else ""
            zeilen.append(f"{name}: {a.name} → {regel} → {bild}{von_hand}")
    return "\n".join(zeilen)


def probe() -> dict:
    """Die Probe für die App: je Probeszene die Angaben der Statisten und das gewählte Bild.

    Ausgabe wie die Datei: ``{"erklaerung": …, "szenen": [{"szene": …, "statisten": [{name, x, y,
    tun, bild, rolle, sitzt, erwartet}]}]}``.
    """
    szenen = []
    for name in PROBESZENEN:
        szene = json.loads((SZENEN / f"{name}.json").read_text(encoding="utf-8"))
        angaben = W.angaben_der_szene(szene)
        statisten = [
            {
                "name": a.name,
                "x": a.feld[0],
                "y": a.feld[1],
                "tun": a.tun,
                "bild": a.bild,
                "rolle": a.rolle,
                "sitzt": a.sitzt,
                "erwartet": bild,
            }
            for a, bild in zip(angaben, W.waehle(angaben), strict=True)
        ]
        szenen.append({"szene": name, "statisten": statisten})
    erklaerung = (
        "Probe der Bildwahl für Statisten, geschrieben von pipeline/abenteuer/statistenrolle.py "
        "(--probe), nicht von Hand ändern. pytest prüft sie gegen die Pipeline, Vitest gegen die App."
    )
    return {"erklaerung": erklaerung, "szenen": szenen}


def probentext() -> str:
    """Die Probe als Text der Datei (JSON, eingerückt, mit Zeilenende)."""
    return json.dumps(probe(), ensure_ascii=False, indent=2) + "\n"


def main() -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf. Rückgabe 1 bei Befunden."""
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--alle", action="store_true", help="auch jede Zuordnung zeigen")
    parser.add_argument("--privat", type=Path, help="privates Repository: Typen gegen das Paket prüfen")
    parser.add_argument("--probe", action="store_true", help="Probe für die App neu schreiben")
    argumente = parser.parse_args()
    if argumente.probe:
        PROBEDATEI.write_text(probentext(), encoding="utf-8")
        print(f"Probe geschrieben: {PROBEDATEI.name}")
    if argumente.alle:
        print(uebersicht())
    befunde = alle_befunde(argumente.privat)
    for szene, satz in befunde:
        print(f"{szene}: {satz}")
    print(f"{len(befunde)} Befunde")
    return 1 if befunde else 0


if __name__ == "__main__":
    raise SystemExit(main())

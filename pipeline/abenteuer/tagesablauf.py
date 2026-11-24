"""Prüfung der Tagesabläufe (inhalte/abenteuer/tagesablaeufe.json), Dauertest.

Warum: Auftrag des Hauptchats (22.11.2026) zum Wunsch des Autors nach Tagesabläufen. Ein Ablauf darf
das Spiel nie stören: keine Figur in einer Wand, keine zwei auf einem Feld, kein zugestellter Weg,
keine Geisterstadt in der Nacht, keine Questfigur, die schläft, wenn man sie braucht.

Geprüft je Figur und Stunde (die App stellt die Figuren beim Kartenwechsel nach der Uhr auf):

1. Form: Die Blöcke decken jede Stunde genau einmal; Schlaf genau drei Stunden (ohne Schlaf und
   Kinder: keiner).
2. Platz: Karte bekannt; stehend (oder am Boden sitzend) auf einem begehbaren, vom Start
   erreichbaren Feld, hinter einer Theke nur auf dem eigenen Platz der Szene; sitzend auf einem
   echten Sitzmöbel, liegend auf einem Bett, beides mit erreichbarem Nachbarfeld.
   Außerhalb der Arbeit liegt ein Stehplatz nicht unter einem Bild, das vor der Figur gezeichnet
   wird (Tisch, Dach, Baumkrone; stehplatz.py, Befund aus Fotos mit echten Bildern, 23.11.2026).
3. Nie zwei Figuren auf einem Feld (auch nicht mit Figuren, die der Szene folgen, oder mit
   stehenden Statisten).
4. Keine Figur sperrt einen Weg: Jede Aufstellung einer Karte wird wie die Szene selbst mit
   figurensperre.py geprüft; neue Befunde gegenüber der Szene zählen.
5. Höchstens ein Drittel der Figuren eines Orts schläft gleichzeitig, von 0 bis 4 Uhr die Hälfte
   (Orte unter sechs Figuren außerhalb der tiefen Nacht: eine). Kinder sind von 21 bis 7 Uhr zu Hause
   (Block „zuhause“, unsichtbar): Sie zählen zum Ort, aber nicht als Schlafende (Entscheidung des
   Hauptchats, 22.11.2026). Wege zwischen den Städten sind ausgenommen (keine Geisterstadt möglich).
6. Jede Questfigur hat einen Questort im Ablauf, folgt der Geschichte oder steht mit
   ``festhalten: regel1`` in den Daten (die App hält sie dann für den offenen Schritt fest).
   Damit bleiben pfeilziel.cjs und questverfehlen.py ohne Funde, auch mit Uhr: Regel 1 lässt den
   Questschritt die Aufstellung bestimmen, nicht die Uhr.
7. Jede Person mit Blöcken heißt in ihrem Ort wie eine ihrer Figuren; sonst stellt die App sie
   ein zweites Mal hin, ohne Dialog (die Joggerin heißt auf dem Weg Maple–Cedar „tessa“).

Aufruf: ``python -m pipeline.abenteuer.tagesablauf`` (Befunde, Rückgabe 1 bei Befund).
Dauertest: pipeline/tests/test_abenteuer_tagesablauf.py. Abhängigkeiten ohne Pillow.
"""

import json
import sys
from collections import defaultdict
from pathlib import Path

from pipeline.abenteuer.durchgang import alle_fassungen, gesperrte_felder
from pipeline.abenteuer.figurensperre import erreichbar, nah, pruefe_szene, uebergangsnamen
from pipeline.abenteuer.kartenbau import INHALTE, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.sitzplatz import K, ist_sitzmoebel
from pipeline.abenteuer.stehplatz import verdeckt
from pipeline.abenteuer.tagesablauf_entwurf import (
    SCHLAFDAUER,
    STUNDEN,
    grenze,
    personennamen,
    rollen,
    stunden,
)
from pipeline.abenteuer.uebergaenge import szenen

DATEI = INHALTE / "tagesablaeufe.json"
WEGE = "weg"  # Orte zwischen den Städten (wegMapleCedar …)


def lade() -> dict:
    """Die Abläufe aus inhalte/abenteuer/tagesablaeufe.json."""
    return json.loads(DATEI.read_text(encoding="utf-8"))["figuren"]


def stundenplan(eintrag: dict) -> dict[int, dict]:
    """Stunde → Block. Beispiel: arbeit 9–17 → {9: …, …, 16: …}."""
    plan: dict[int, dict] = {}
    for b in eintrag.get("bloecke", []):
        for h in stunden(b["von"], b["bis"]):
            plan.setdefault(h, b)
    return plan


def pruefe_form(name: str, eintrag: dict) -> list[str]:
    """Regel 1 der Prüfung: jede Stunde genau einmal, Schlaf drei Stunden."""
    if eintrag.get("folgt_geschichte"):
        return [] if not eintrag.get("bloecke") else [f"{name}: folgt der Geschichte, hat aber Blöcke"]
    zaehler = defaultdict(int)
    for b in eintrag["bloecke"]:
        for h in stunden(b["von"], b["bis"]):
            zaehler[h] += 1
    befunde = [f"{name}: Stunde {h} {n}-mal belegt" for h, n in sorted(zaehler.items()) if n != 1]
    befunde += [f"{name}: Stunde {h} fehlt" for h in range(STUNDEN) if h not in zaehler]
    schlaf = sum(len(stunden(b["von"], b["bis"])) for b in eintrag["bloecke"] if b["art"] == "schlaf")
    soll = 0 if eintrag.get("ohne_schlaf") or eintrag.get("kind") else SCHLAFDAUER
    if schlaf != soll:
        befunde.append(f"{name}: {schlaf} Stunden Schlaf statt {soll}")
    return befunde


class Karten:
    """Gesperrte und erreichbare Felder, Sitze und Betten je Karte und Zustand (einmal berechnet).

    Ein Block gilt für alle Zustände einer Karte (Wohnzimmer am Umzugstag, mit Tisch, ausgepackt):
    Die App stellt die Figur in jeder Fassung auf dasselbe Feld. Befund vom 23.11.2026: Die Mutter
    saß abends auf (18, 6), einem Stuhl nur am Umzugstag; danach stand sie neben dem Esstisch.
    """

    def __init__(self) -> None:
        self.szenen, self.katalog = szenen(), lade_moebel()
        self.uebergaenge = uebergangsnamen()
        self.fassungen: dict[str, list[dict]] = defaultdict(list)
        for _, szene in alle_fassungen(self.szenen):
            self.fassungen[szene["karte"]].append(szene)
        self._cache: dict[tuple[str, int], dict] = {}

    def info(self, karte: str, nummer: int = 0) -> dict:
        """Felder einer Fassung (0: Grundkarte, sonst die Zustände wie in alle_fassungen)."""
        if (karte, nummer) not in self._cache:
            szene = self.fassungen[karte][nummer] if nummer else self.szenen[karte]
            zeilen = raster(szene)
            gesetzt = platziere(szene, self.katalog)[0]
            grund = gesperrte_felder(zeilen, gesetzt, szene)
            start = {tuple(a["feld"]) for a in szene.get("ausloeser", []) if a["name"] == "start"}
            start = start or {tuple(a["feld"]) for a in szene.get("ausloeser", [])[:1]}
            frei = erreichbar(start, grund, len(zeilen[0]), len(zeilen))
            info = {"grund": grund, "frei": frei, "gesetzt": gesetzt, "datei": szene.get("datei", "")}
            self._cache[(karte, nummer)] = info
        return self._cache[(karte, nummer)]

    def alle(self, karte: str) -> list[dict]:
        """Die Felder jeder Fassung der Karte (Grundkarte zuerst)."""
        return [self.info(karte, i) for i in range(max(1, len(self.fassungen[karte])))]

    def liegt_auf(self, info: dict, feld: tuple[int, int], sitz: bool) -> bool:
        """Liegt die Mitte des Felds in einem Sitzmöbel (sitz) oder Bett dieser Fassung?"""
        mx, my = feld[0] * K + K / 2, feld[1] * K + K / 2
        for s in info["gesetzt"]:
            art = self.katalog.get(s["name"], {}).get("art")
            passt = ist_sitzmoebel(s["name"], art) if sitz else (art == "bett" or "Bett" in s["name"])
            if passt and s["x"] <= mx < s["x"] + s["breite"] and s["y"] <= my < s["y"] + s["hoehe"]:
                return True
        return False


def pruefe_platz(name: str, b: dict, karten: Karten) -> list[str]:
    """Regel 2 der Prüfung für einen Block mit Karte, in jeder Fassung der Karte."""
    if b["karte"] not in karten.szenen:
        return [f"{name}: Karte {b['karte']} unbekannt"]
    befunde = []
    for info in karten.alle(b["karte"]):
        befunde += [f"{z} (Fassung {Path(info['datei']).stem})" for z in _platz_in(name, b, karten, info)]
    return befunde


def _platz_in(name: str, b: dict, karten: Karten, info: dict) -> list[str]:
    """Regel 2 für eine Fassung der Karte."""
    karte, feld, tut = b["karte"], tuple(b["feld"]), b.get("tut", "steht")
    wo = f"{name} {b['art']} {b['von']}–{b['bis']} {karte} {feld}"
    if tut in ("steht", "sitzt am Boden"):
        # Hinter einer Theke steht man auf einem gesperrten Feld (Hector im Diner, über die Theke
        # angesprochen): Der eigene Platz der Szene ist erlaubt, ihn prüfen Kartenbau und figurensperre.
        szenenplatz = feld in {tuple(f["feld"]) for f in karten.szenen[karte].get("figuren", [])}
        if szenenplatz:
            return []
        if feld not in info["frei"]:
            return [f"{wo}: Feld gesperrt oder nicht erreichbar"]
        # Stehplatz außerhalb der Arbeit: sichtbar, nicht unter Tisch, Dach oder Krone (stehplatz.py).
        bild = verdeckt(feld, info["gesetzt"], karten.katalog) if b["art"] != "arbeit" else None
        return [f"{wo}: steht unter dem Bild von {bild}"] if bild else []
    if not karten.liegt_auf(info, feld, tut == "sitzt"):
        return [f"{wo}: {tut}, aber kein {'Sitzmöbel' if tut == 'sitzt' else 'Bett'} auf dem Feld"]
    if not nah(feld, info["frei"]):
        return [f"{wo}: kein erreichbares Nachbarfeld"]
    return []


def person_der_figur(bekannt: set[str]) -> dict[str, str]:
    """Kennung einer Figur in orte.json („mapleFalls.carlaClub“) → Person („carla“)."""
    from pathlib import Path

    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    namen = personennamen(orte, bekannt)
    return {f["kennung"]: namen[Path(f["sprite"]).stem] for o in orte for f in o["figuren"]}


def ersatzfelder() -> dict[str, dict[str, list[int]]]:
    """Ersatzfelder ohne Stuhlbild wie in der App (regeln/ohnesitzbild.json, standStattSitz)."""
    pfad = INHALTE.parent.parent / "app" / "src" / "abenteuer" / "regeln" / "ohnesitzbild.json"
    return json.loads(pfad.read_text(encoding="utf-8"))["personen"] if pfad.exists() else {}


def platz(name: str, b: dict, ersatz: dict) -> dict:
    """Die Figur eines Blocks so, wie die App sie hinstellt (Ersatzfeld statt Stuhl ohne Sitzbild)."""
    stand = ersatz.get(name, {}).get(f"{b['karte']}@{b['feld'][0]},{b['feld'][1]}")
    if b.get("tut") == "sitzt" and stand:
        return {"name": name, "feld": stand}
    return {
        "name": name,
        "feld": b["feld"],
        **({"sitzt": "unten"} if b.get("tut", "").startswith("sitzt") else {}),
    }


def aufstellungen(
    daten: dict, karten: Karten, nur: str | None = None, ersatz: dict | None = None
) -> dict[str, dict[int, list[dict]]]:
    """Karte → Stunde → Figuren der Aufstellung: feste Figuren der Szene (ohne Ablauf) und die
    Figuren mit Ablauf, die zu dieser Stunde dort sind (sichtbar). ``nur``: nur diese Karte."""
    person = person_der_figur(set(rollen()))
    mit_ablauf = {n for n, e in daten.items() if e.get("bloecke")}
    plan = {n: stundenplan(e) for n, e in daten.items() if e.get("bloecke")}
    ersatz = ersatzfelder() if ersatz is None else ersatz
    ergebnis: dict[str, dict[int, list[dict]]] = {}
    for karte, szene in karten.szenen.items():
        if nur and karte != nur:
            continue
        ort = karte.split(".")[0]
        fest = [f for f in szene.get("figuren", []) if person.get(f"{ort}.{f['name']}") not in mit_ablauf]
        ergebnis[karte] = {
            h: [dict(f) for f in fest]
            + [platz(n, p[h], ersatz) for n, p in plan.items() if p[h].get("karte") == karte]
            for h in range(STUNDEN)
        }
    return ergebnis


def pruefe_aufstellungen(
    daten: dict, karten: Karten, nur: str | None = None, ersatz: dict | None = None
) -> list[str]:
    """Regeln 3 und 4 der Prüfung: kein Feld doppelt, kein neuer gesperrter Weg. ``nur``: eine Karte;
    ``ersatz``: Ersatzfelder statt ohnesitzbild.json (für die Wahl in figurenzustaende_ablauf.py)."""
    befunde: list[str] = []
    for karte, je_stunde in aufstellungen(daten, karten, nur, ersatz).items():
        for szene in karten.fassungen[karte] or [karten.szenen[karte]]:
            befunde += _pruefe_karte(karte, je_stunde, karten, szene)
    return sorted(set(befunde))


def _pruefe_karte(karte: str, je_stunde: dict[int, list[dict]], karten: Karten, szene: dict) -> list[str]:
    """Regeln 3 und 4 für eine Fassung einer Karte, jede verschiedene Aufstellung einmal."""
    befunde: list[str] = []
    uebergaenge = karten.uebergaenge.get(karte, set())
    statisten = {
        tuple(b["feld"])
        for b in szene.get("belebung", [])
        if b.get("typ") == "statist"
        and (b.get("eigenschaften") or {}).get("von") == (b.get("eigenschaften") or {}).get("bis")
    }
    grund = set(pruefe_szene(szene, karten.katalog, uebergaenge))
    gesehen: set[frozenset] = set()
    for h, figuren in je_stunde.items():
        schluessel = frozenset((f["name"], tuple(f["feld"])) for f in figuren)
        if schluessel in gesehen:
            continue
        gesehen.add(schluessel)
        felder = defaultdict(list)
        for f in figuren:
            felder[tuple(f["feld"])].append(f["name"])
        for feld, namen in sorted(felder.items()):
            if len(namen) > 1 or feld in statisten:
                befunde.append(f"{karte} {h} Uhr: {', '.join(namen)} auf demselben Feld {feld}")
        neu = set(pruefe_szene(szene | {"figuren": figuren}, karten.katalog, uebergaenge)) - grund
        befunde += [f"{b} (um {h} Uhr)" for b in sorted(neu)]
    return befunde


def schlafende(daten: dict) -> dict[str, list[int]]:
    """Ort → Zahl der Schlafenden je Stunde."""
    last: dict[str, list[int]] = defaultdict(lambda: [0] * STUNDEN)
    for e in daten.values():
        for b in e.get("bloecke", []):
            if b["art"] == "schlaf":
                for h in stunden(b["von"], b["bis"]):
                    last[e["ort"]][h] += 1
    return last


def figuren_je_ort(daten: dict) -> dict[str, int]:
    """Ort → Zahl der Figuren (mit Ablauf, ohne Schlaf, Kinder und die der Geschichte folgen).
    Kinder gehören zum Ort, ihr Abend zu Hause zählt aber nicht als Schlaf."""
    zahl: dict[str, int] = defaultdict(int)
    for e in daten.values():
        for ort in [e["ort"]] if "ort" in e else e.get("orte", []):
            zahl[ort] += 1
    return zahl


def pruefe_drittel(daten: dict) -> list[str]:
    """Regel 5 der Prüfung: höchstens ein Drittel schläft (kleine Orte: höchstens eine Figur)."""
    zahl = figuren_je_ort(daten)
    befunde = []
    for ort, last in sorted(schlafende(daten).items()):
        if ort.startswith(WEGE):
            continue  # Wege sind keine Städte: Dort droht keine Geisterstadt (Regel des Hauptchats)
        for h, n in enumerate(last):
            if n > grenze(h, zahl[ort]):
                befunde.append(
                    f"{ort} {h} Uhr: {n} von {zahl[ort]} schlafen (höchstens {grenze(h, zahl[ort])})"
                )
    return befunde


def pruefe_quest(daten: dict) -> list[str]:
    """Regel 6 der Prüfung: Questfigur im Ablauf an ihrem Questort oder festgehalten."""
    befunde = []
    for n, e in sorted(daten.items()):
        orte = set(e.get("questorte", []))
        if not orte or e.get("folgt_geschichte") or e.get("festhalten") == "regel1":
            continue
        if not any(b.get("karte") in orte for b in e["bloecke"]):
            befunde.append(f"{n}: Questorte {sorted(orte)} nicht im Ablauf und nicht festgehalten")
    return befunde


def pruefe_zuordnung(daten: dict) -> list[str]:
    """Regel 7 der Prüfung: Jede Person mit Blöcken heißt in ihrem Ort wie eine ihrer Figuren.

    Warum: Die App (regeln/tagesablauf.ts, personenDerFiguren) ordnet die Figuren eines Orts über
    ihren Namen einer Person zu. Hieß die Person anders (die Joggerin heißt auf dem Weg Maple–Cedar
    „tessa“), stand sie nach der Uhr ein zweites Mal da, ohne Dialog, neben der Figur der Geschichte
    (Stehplatzfotos, 24.11.2026).
    """
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    namen = {o["kennung"]: {f["kennung"].split(".", 1)[1] for f in o["figuren"]} for o in orte}
    return [
        f"{n}: keine Figur dieses Namens in {e['ort']} (die App fände die Person nicht)"
        for n, e in sorted(daten.items())
        if e.get("bloecke") and n not in namen.get(e.get("ort", ""), set())
    ]


def pruefe() -> list[str]:
    """Alle Befunde."""
    daten, karten = lade(), Karten()
    befunde = []
    for n, e in sorted(daten.items()):
        befunde += pruefe_form(n, e)
        for b in e.get("bloecke", []):
            if b.get("karte"):
                befunde += pruefe_platz(n, b, karten)
    befunde += pruefe_aufstellungen(daten, karten) + pruefe_drittel(daten) + pruefe_quest(daten)
    return befunde + pruefe_zuordnung(daten)


def main() -> int:
    """Befehlszeile; Aufruf im Dateikopf."""
    befunde = pruefe()
    for b in befunde:
        print(b)
    print(f"{len(befunde)} Befunde")
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main())

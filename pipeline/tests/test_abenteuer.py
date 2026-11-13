"""Die Beispieldaten des Schach-Abenteuers müssen zu ihren Schemas passen und zueinander.

Warum: ``schemas/abenteuer-*.schema.json`` sind der Vertrag für die Spieldaten in
``inhalte/abenteuer/`` (docs/spiel/04_Architektur.md, Abschnitt 12). Die App erzeugt ihre Typen aus
denselben Schemas; dieser Test prüft die eingecheckten Beispiele gegen die Schemas und die
Querverweise zwischen den Dateien (Gegner der Orte, Karten der Quests, Textschlüssel), damit ein
Tippfehler in einer Kennung nicht erst im Spiel auffällt.
"""

import json
import re
from pathlib import Path

import pytest

from pipeline.bauen.__main__ import pruefe_schema

HAUPTORDNER = Path(__file__).resolve().parents[2]
INHALTE = HAUPTORDNER / "inhalte" / "abenteuer"

DATEIEN = {
    "gegner.json": "abenteuer-gegner.schema.json",
    "karten.json": "abenteuer-karten.schema.json",
    "quests.json": "abenteuer-quests.schema.json",
    "orte.json": "abenteuer-orte.schema.json",
    "begegnungen.json": "abenteuer-begegnungen.schema.json",
    "runden.json": "abenteuer-runden.schema.json",
    "funde.json": "abenteuer-funde.schema.json",
    "laeden.json": "abenteuer-laeden.schema.json",
    "vorfuehrungen.json": "abenteuer-vorfuehrungen.schema.json",
    "partieformen.json": "abenteuer-partieformen.schema.json",
    "texte/de.json": "abenteuer-texte.schema.json",
}


def _lade(name: str) -> dict:
    return json.loads((INHALTE / name).read_text(encoding="utf-8"))


@pytest.mark.parametrize(("datei", "schema"), sorted(DATEIEN.items()))
def test_beispiel_passt_zum_schema(datei: str, schema: str):
    assert pruefe_schema(_lade(datei), schema) == []


def test_querverweise_stimmen():
    """Jede Kennung, die eine Datei nennt, gibt es in der Datei, auf die sie zeigt."""
    gegner = {g["kennung"] for g in _lade("gegner.json")["gegner"]}
    karten = {k["kennung"] for k in _lade("karten.json")["karten"]}
    texte = set(_lade("texte/de.json"))
    orte = _lade("orte.json")["orte"]
    quests = _lade("quests.json")["quests"]
    fehler: list[str] = []

    for ort in orte:
        kartenkennungen = {k["kennung"] for k in ort["karten"]}
        figuren = {f["kennung"] for f in ort["figuren"]}
        for figur in ort["figuren"]:
            if "gegner" in figur and figur["gegner"] not in gegner:
                fehler.append(f"{ort['kennung']}: Gegner {figur['gegner']} fehlt in gegner.json")
        club = ort.get("club")
        if club:
            for kennung in [club["chef"], *club["mitglieder"]]:
                if kennung not in figuren or kennung not in gegner:
                    fehler.append(f"{ort['kennung']}: Clubmitglied {kennung} fehlt")
        # Übergänge bleiben im Ort; nur Wege (art weg) verbinden Orte (docs/spiel/08, W1).
        alle = {k["kennung"]: o for o in orte for k in o["karten"]}
        for ausloeser in ort["ausloeser"]:
            ziel = ausloeser.get("ziel")
            if not ziel:
                continue
            zielort = alle.get(ziel["karte"])
            if zielort is None:
                fehler.append(f"{ort['kennung']}: Übergang nach unbekannter Karte {ziel['karte']}")
            elif ziel["karte"] not in kartenkennungen and not {"weg", "erinnerung"} & {
                ort.get("art", "stadt"),
                zielort.get("art", "stadt"),
            }:
                fehler.append(f"{ort['kennung']}: Übergang in anderen Ort ohne Weg: {ziel['karte']}")

    alle_karten = {k["kennung"] for ort in orte for k in ort["karten"]}
    for begegnung in _lade("begegnungen.json")["begegnungen"]:
        if begegnung["gegner"] not in gegner:
            fehler.append(f"{begegnung['kennung']}: Gegner {begegnung['gegner']} fehlt")
    begegnungen = {b["kennung"] for b in _lade("begegnungen.json")["begegnungen"]}
    # Versatzbereiche je Rolle (Regelwerk R4, Vorschlag V9): Straße −150..0 auf A, Clubmitglied
    # −100..+50 auf A, Clubchef genau 160 + 60 · Clubnummer auf E; Story und Turnier sind frei.
    clubnummer = {o["club"]["chef"]: o["nummer"] for o in orte if o.get("club")}
    bereiche = {"strasse": ("aktuell", -150, 0), "clubmitglied": ("aktuell", -100, 50)}
    for profil in _lade("gegner.json")["gegner"]:
        staerke, rolle = profil["staerke"], profil["rolle"]
        if rolle in bereiche:
            art, unten, oben = bereiche[rolle]
            if staerke["art"] != art or not unten <= staerke["versatz"] <= oben:
                fehler.append(f"{profil['kennung']}: Stärke {staerke} passt nicht zur Rolle {rolle}")
        elif rolle == "clubchef":
            soll = 160 + 60 * clubnummer.get(profil["kennung"], 0)
            if staerke != {"art": "eingang", "versatz": soll}:
                fehler.append(f"{profil['kennung']}: Clubchef braucht eingang + {soll}, hat {staerke}")
    # Sprüche (Schritt 13, docs/spiel/10, S2, S4): Immunität nennt nur Spruchkarten, und
    # Straßengegner, gegen die man Sprüche spielen kann, haben Antworten (zwei Zeilen) oder keine.
    sprueche = {k["kennung"] for k in _lade("karten.json")["karten"] if k.get("spruch_art")}
    for profil in _lade("gegner.json")["gegner"]:
        for kennung in profil.get("immunGegen", []):
            if kennung not in sprueche:
                fehler.append(f"{profil['kennung']}: immun gegen {kennung}, das ist kein Spruch")
        name = profil["kennung"].split(".")[-1]
        konter = [f"spruch.konter.{name}.{n}" in texte for n in (1, 2)]
        if any(konter) and not all(konter):
            fehler.append(f"{profil['kennung']}: Antworten auf Sprüche unvollständig")
    # Jede Karte hat Ambroses Erklärung, jede Lernkarte ihren Satz beim Schenken (docs/spiel/11).
    for karte in _lade("karten.json")["karten"]:
        schluessel = [f"karte.{karte['kennung']}.erklaerung"]
        if "kapitel" in karte:
            schluessel.append(f"karte.{karte['kennung']}.geschenkt")
        fehler.extend(f"Text {s} fehlt" for s in schluessel if s not in texte)
    # Partiemomente (Atmosphäre T5): Text und Name des Sprechers stehen in den Spieltexten.
    for begegnung in _lade("begegnungen.json")["begegnungen"]:
        for moment in begegnung.get("momente", []):
            for schluessel in (moment["text"], f"figur.{moment['sprecher']}.name"):
                if schluessel not in texte:
                    fehler.append(f"{begegnung['kennung']}: Moment-Text {schluessel} fehlt")
    # Freie Karten (R29) gibt es in karten.json.
    for begegnung in _lade("begegnungen.json")["begegnungen"]:
        for k in begegnung.get("freieKarten", []):
            if k not in karten:
                fehler.append(f"{begegnung['kennung']}: freie Karte {k} fehlt in karten.json")
    # Erinnerungen (docs/spiel/08, F1): die Partie gibt es unter den Klassikern.
    klassiker = json.loads(
        (HAUPTORDNER / "inhalte" / "zusatzpartien" / "klassiker.json").read_text(encoding="utf-8")
    )
    klassiker_ids = {p["id"] for p in klassiker}
    for runde in _lade("runden.json")["runden"]:
        erinnerung = runde.get("erinnerung")
        if erinnerung and erinnerung["partie"] not in klassiker_ids:
            fehler.append(f"{runde['kennung']}: Partie {erinnerung['partie']} fehlt in klassiker.json")
    # Werkzeugkarten (docs/spiel/11): das Werkzeug gibt es in der App.
    analyse = HAUPTORDNER / "app" / "src" / "analyse"
    for karte in _lade("karten.json")["karten"]:
        werkzeug = karte["wirkung"].get("werkzeug")
        if werkzeug and not (analyse / f"{werkzeug}.ts").exists():
            fehler.append(f"{karte['kennung']}: Werkzeug {werkzeug} fehlt in app/src/analyse")
    for kennung in sprueche:
        for n in range(1, 9):
            if f"spruch.{kennung}.{n}" not in texte:
                fehler.append(f"Spruch spruch.{kennung}.{n} fehlt in texte/de.json")
    runden = _lade("runden.json")["runden"]
    # Läden (G2, G3): Waren existieren, Mentor-Zug, Sanduhr und Vorgaben sind nie zu kaufen.
    laeden = _lade("laeden.json")["laeden"]
    ladenkennungen = {laden["kennung"] for laden in laeden}
    nie_kaeuflich = {"mentorzug", "sanduhr", "bauernvorgabe", "springervorgabe"}
    for laden in laeden:
        if laden["name"] not in texte:
            fehler.append(f"{laden['kennung']}: Text {laden['name']} fehlt")
        for ware in laden["angebot"]:
            if ware["art"] == "karte" and ware["kennung"] not in karten:
                fehler.append(f"{laden['kennung']}: Karte {ware['kennung']} fehlt")
            if ware["kennung"] in nie_kaeuflich:
                fehler.append(f"{laden['kennung']}: {ware['kennung']} ist nie käuflich (G3)")
    funde = _lade("funde.json")["funde"]
    fundkennungen = {f["kennung"] for f in funde}
    ortkennungen = {o["kennung"] for o in orte}
    for fund in funde:
        if fund["ort"] not in ortkennungen:
            fehler.append(f"{fund['kennung']}: Ort {fund['ort']} fehlt in orte.json")
        for schluessel in (fund["name"], fund["text"]):
            if schluessel not in texte:
                fehler.append(f"{fund['kennung']}: Text {schluessel} fehlt")
    rundenkennungen = {r["kennung"] for r in runden}
    # Simultan und Gedächtnisstellung melden beim Bestehen dasselbe Quest-Ereignis wie eine Runde
    # (mittel-2, 5e1afc85); ihre Kennungen stehen in partieformen.json.
    partieformen = json.loads((INHALTE / "partieformen.json").read_text(encoding="utf-8"))
    questrunden = rundenkennungen | {
        p["kennung"] for art in ("simultan", "gedaechtnis") for p in partieformen.get(art, [])
    }
    for runde in runden:
        ort = next((o for o in orte if o["kennung"] == runde["ort"]), None)
        if ort is None:
            fehler.append(f"{runde['kennung']}: Ort {runde['ort']} fehlt")
            continue
        # Ohne Club (Wege) braucht die Runde eine feste Zahl (R30a); das Budget kommt vom Club.
        if not ort.get("club") and "anzahl" not in runde:
            fehler.append(f"{runde['kennung']}: Ort {runde['ort']} ohne Club braucht anzahl")
        # Steller: eine Figur des Ortes oder ein Auslöser mit Namen figur.<name>.name (Tafel).
        figuren_hier = {f["kennung"] for f in ort["figuren"]}
        stellername = runde["steller"].split(".")[-1]
        if runde["steller"] not in figuren_hier and f"figur.{stellername}.name" not in texte:
            fehler.append(f"{runde['kennung']}: Steller {runde['steller']} fehlt in orte.json")
        erlaubt = set(ort["club"]["aufgaben"]["buchuebungen"]) if ort.get("club") else set()
        fremd = set(runde["buchuebungen"]) - erlaubt
        if fremd:
            fehler.append(f"{runde['kennung']}: Buchübungen {sorted(fremd)} nicht beim Club")
        if not runde["themen"] and not runde["buchuebungen"]:
            fehler.append(f"{runde['kennung']}: weder Themen noch Buchübungen")
    for quest in quests:
        for schritt in quest["schritte"]:
            ereignis = schritt["ereignis"]
            if ereignis["art"] == "aufgaben" and ereignis["runde"] not in questrunden:
                fehler.append(f"{quest['kennung']}: Runde {ereignis['runde']} fehlt in runden.json")
    for quest in quests:
        for schritt in quest["schritte"]:
            ereignis = schritt["ereignis"]
            if ereignis["art"] == "partie" and ereignis["begegnung"] not in begegnungen:
                fehler.append(f"{quest['kennung']}: Begegnung {ereignis['begegnung']} fehlt")
    for ink in sorted((INHALTE / "dialoge" / "de").glob("*.ink")):
        quelle = ink.read_text("utf-8")
        for aufruf in re.findall(r'^\s*~\s*beginnePartie\("([^"]+)"\)', quelle, re.M):
            if aufruf not in begegnungen:
                fehler.append(f"{ink.name}: Begegnung {aufruf} fehlt")
        for laden in re.findall(r'^\s*~\s*oeffneLaden\("([^"]+)"\)', quelle, re.M):
            if laden not in ladenkennungen:
                fehler.append(f"{ink.name}: Laden {laden} fehlt in laeden.json")
        for fund in re.findall(r'^\s*~\s*gibFund\("([^"]+)"\)', quelle, re.M):
            if fund not in fundkennungen:
                fehler.append(f"{ink.name}: Fund {fund} fehlt in funde.json")
        for runde in re.findall(r'^\s*~\s*beginneAufgaben\("([^"]+)"\)', quelle, re.M):
            if runde not in rundenkennungen:
                fehler.append(f"{ink.name}: Runde {runde} fehlt in runden.json")
        for karte in re.findall(r'^\s*~\s*reise\("([^"]+)",', quelle, re.M):
            if karte not in alle_karten:
                fehler.append(f"{ink.name}: Reise nach unbekannter Karte {karte}")

    questkennungen = {q["kennung"] for q in quests}
    for quest in quests:
        for voraussetzung in quest.get("voraussetzung", []):
            if voraussetzung not in questkennungen:
                fehler.append(f"{quest['kennung']}: Voraussetzung {voraussetzung} fehlt")
        for schritt in quest["schritte"]:
            for wirkung in schritt.get("wirkungen", []):
                if wirkung["art"] == "karte" and wirkung["karte"] not in karten:
                    fehler.append(f"{quest['kennung']}: Karte {wirkung['karte']} fehlt")
                if wirkung["art"] in ("steckbrief", "zustand") and wirkung["gegner"] not in gegner:
                    fehler.append(f"{quest['kennung']}: Gegner {wirkung['gegner']} fehlt")

    for datei in ("gegner.json", "karten.json", "quests.json", "orte.json"):
        for schluessel in _textschluessel(_lade(datei)):
            if schluessel not in texte:
                fehler.append(f"{datei}: Textschlüssel {schluessel} fehlt in texte/de.json")

    assert fehler == []


TEXTSCHLUESSEL = re.compile(r"^(ort|club|figur|karte|quest|zustand|nadel)\.[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$")


def _textschluessel(daten: object) -> set[str]:
    """Alle Zeichenketten, die wie Textschlüssel aussehen, aus beliebig verschachtelten Daten."""
    if isinstance(daten, str):
        return {daten} if TEXTSCHLUESSEL.match(daten) else set()
    if isinstance(daten, dict):
        return set().union(*(_textschluessel(w) for w in daten.values()))
    if isinstance(daten, list):
        return set().union(*(_textschluessel(w) for w in daten))
    return set()


def test_ink_szene_und_tiled_karte_liegen_bereit():
    """Die Beispielszene und die Beispielkarte existieren und nennen die Auslöser aus orte.json."""
    szene = (INHALTE / "dialoge" / "de" / "maple-falls-dachboden.ink").read_text(encoding="utf-8")
    assert "=== ambrose_erwacht ===" in szene
    assert 'beginnePartie("mapleFalls.ersteLektion")' in szene
    # Belohnungen kommen aus der Quest, nicht doppelt aus dem Dialog.
    assert 'gibKarte("fingerzeig")' not in szene
    karte = json.loads((INHALTE / "karten" / "maple-falls-dachboden.json").read_text(encoding="utf-8"))
    assert karte["width"] * karte["height"] == len(karte["layers"][0]["data"])
    objekte = next(e for e in karte["layers"] if e["type"] == "objectgroup")
    # Möbel, Statisten und Tiere stehen nicht in orte.json.
    namen = {o["name"] for o in objekte["objects"] if o.get("type") not in ("moebel", "statist", "tier")}
    ausloeser = {a["name"] for a in _lade("orte.json")["orte"][0]["ausloeser"]}
    assert namen <= ausloeser


def test_startnummer_nur_bei_schach960():
    # Eine feste Startstellung ergibt nur im Schach960 Sinn (docs/spiel/10, V1); Varianten-Partien
    # beginnen immer aus der Grundreihe, nicht aus einer Buchabbildung.
    for begegnung in _lade("begegnungen.json")["begegnungen"]:
        if "startnummer" in begegnung:
            assert begegnung.get("variante") == "schach960", begegnung["kennung"]
        if begegnung.get("variante") == "schach960":
            assert begegnung["startstellung"] == {"art": "grundstellung"}, begegnung["kennung"]

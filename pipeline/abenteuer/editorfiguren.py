"""Rücklauf des Karteneditors: Warnungen zu gelöschten und kopierten Figuren und Statisten.

Warum: Seit Editor 1.2 kann der Autor Figuren und Belebung löschen (mit Rückfrage) und mit Strg+D
kopieren (Auftrag des Hauptchats, 16.11.2026). Eine Figur gehört aber oft zur Handlung: In
``inhalte/abenteuer/orte.json`` trägt sie unter ``figuren`` einen ``dialog`` (Ink-Knoten
„datei.knoten“ in ``inhalte/abenteuer/dialoge/de/``), und Quests (``quests.json``) beginnen mit
diesem Knoten, warten auf ihn oder zeigen auf die Figur als Ziel (``ziel.objekt``). Fehlt die Figur
danach auf allen Karten ihres Ortes, ist der Knoten im Spiel nicht mehr erreichbar.

Zuordnung wie in der App (``oberwelt/weltdaten.ts``, ``figurZu``): Die Figur „ambrose“ auf einer
Karte des Ortes ``mapleFalls`` ist die Figur ``mapleFalls.ambrose`` aus orte.json.
"""

import json
from collections import Counter
from pathlib import Path

from pipeline.abenteuer.kartenbau import INHALTE


def _lade(name: str) -> dict:
    return json.loads((INHALTE / name).read_text(encoding="utf-8"))


def figurangabe(ort: str, name: str, orte: list[dict] | None = None) -> dict | None:
    """Die Figur aus orte.json zu einem Namen auf einer Karte des Ortes, sonst None.

    Beispiel: („mapleFalls“, „ambrose“) → {"kennung": "mapleFalls.ambrose", "dialog": …, "wenn": …}.
    """
    for o in orte if orte is not None else _lade("orte.json")["orte"]:
        if o["kennung"] != ort:
            continue
        for f in o.get("figuren", []):
            if f["kennung"] in (f"{ort}.{name}", name):
                return f
    return None


def quests_zu(knoten: str | None, karte: str, name: str, quests: list[dict]) -> list[str]:
    """Quests, die den Knoten der Figur brauchen oder die Figur als Ziel nennen.

    Beispiel: Knoten „maple-falls-dachboden.ambrose_erwacht“ → [„mapleFalls.dasBrett (Schritt 2)“].
    """
    treffer = []
    for q in quests:
        if knoten and q.get("start", {}).get("knoten") == knoten:
            treffer.append(f"{q['kennung']} (Start)")
        for nummer, schritt in enumerate(q.get("schritte", []), 1):
            ziel = schritt.get("ziel", {})
            braucht = knoten and schritt.get("ereignis", {}).get("knoten") == knoten
            if braucht or (ziel.get("karte") == karte and ziel.get("objekt") == name):
                treffer.append(f"{q['kennung']} (Schritt {nummer})")
    return list(dict.fromkeys(treffer))


def steht_noch(name: str, ort: str, datei: str, szenen: Path) -> list[str]:
    """Andere Szenen desselben Ortes (ohne Varianten), auf denen die Figur noch steht."""
    orte = []
    for pfad in sorted(szenen.glob("*.json")):
        if pfad.name == datei:
            continue
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        if str(szene.get("karte", "")).split(".")[0] != ort:
            continue
        if any(f.get("name") == name for f in szene.get("figuren", [])):
            orte.append(pfad.name)
    return orte


def figurwarnungen(eintrag: dict, szenen: Path) -> list[str]:
    """Warnungen zu Figuren einer Karte: gelöscht, obwohl ein Ink-Knoten oder eine Quest sie braucht;
    doppelt nach einer Kopie. Belebung: gelöschte Statisten mit Satz (``sagt``) oder Vorführung.

    Beispiel: „WARNUNG: Figur ambrose gelöscht: Ink-Knoten maple-falls-dachboden.ambrose braucht sie,
    Quests mapleFalls.dasBrett (Schritt 2); steht auf keiner anderen Karte von mapleFalls“.
    """
    vorher, nachher = eintrag["vorher"], eintrag["nachher"]
    karte = str(nachher.get("karte", ""))
    ort = karte.split(".")[0]
    alt = Counter(f["name"] for f in vorher.get("figuren", []))
    neu = Counter(f["name"] for f in nachher.get("figuren", []))
    orte, quests = _lade("orte.json")["orte"], _lade("quests.json")["quests"]
    warnungen = []
    for name in sorted(alt.keys() - neu.keys()):
        angabe = figurangabe(ort, name, orte) or {}
        knoten = angabe.get("dialog")
        brauchen = quests_zu(knoten, karte, name, quests)
        if not knoten and not brauchen:
            continue
        gruende = [f"Ink-Knoten {knoten} braucht sie"] if knoten else []
        gruende += [f"Quests {', '.join(brauchen)}"] if brauchen else []
        anderswo = steht_noch(name, ort, Path(eintrag["datei"]).name, szenen)
        wo = (
            f"steht noch auf {', '.join(anderswo)}"
            if anderswo
            else f"steht auf keiner anderen Karte von {ort}"
        )
        warnungen.append(f"WARNUNG: Figur {name} gelöscht: {'; '.join(gruende)}; {wo}")
    for name, zahl in sorted(neu.items()):
        if zahl > max(1, alt.get(name, 0)):
            warnungen.append(f"WARNUNG: Figur {name} steht jetzt {zahl}× auf der Karte (Kopie mit Strg+D?)")
    warnungen += _belebungswarnungen(vorher, nachher)
    return warnungen


def _belebungswarnungen(vorher: dict, nachher: dict) -> list[str]:
    """Gelöschte Statisten, die etwas sagen oder vorführen (Textschlüssel oder Vorführung fehlt dann)."""
    bleibt = {b["name"] for b in nachher.get("belebung", [])}
    warnungen = []
    for b in vorher.get("belebung", []):
        e = b.get("eigenschaften", {})
        if b["name"] in bleibt or not (e.get("sagt") or e.get("zeigt")):
            continue
        was = ", ".join(f"{k} {e[k]}" for k in ("sagt", "zeigt") if e.get(k))
        warnungen.append(f"Hinweis: Statist {b['name']} gelöscht ({was} wird nicht mehr gebraucht)")
    return warnungen

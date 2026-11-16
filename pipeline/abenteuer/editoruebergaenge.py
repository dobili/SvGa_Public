"""Rücklauf der Übergänge des Karteneditors (ab 1.4): neue, geänderte und gelöschte Übergangs-
definitionen nach ``orte.json``, mit Berichtszeilen und Warnungen.

Warum: Der Autor legt im Editor Übergänge zu beliebigen Karten an und ändert ihr Ziel (Wunsch des
Autors, 16.11.2026). Was ein Auslöser tut, steht aber nicht in der Szene, sondern in ``orte.json``
beim Ort unter ``ausloeser`` (``{"name", "karte"?, "art": "uebergang", "ziel": {"karte",
"ausloeser"}}``). Die Änderungsdatei trägt deshalb ``uebergaenge`` mit ``vorher`` und ``nachher``
(je Ort die Liste der Übergänge, nur Name, Karte, Art und Ziel); dieses Modul gleicht beides ab.

Regeln:
- Ein Übergang ist durch Ort, Name und Karte bestimmt (``karte`` fehlt: gilt für den ganzen Ort,
  ``uebergaenge.regel_fuer``).
- Neue Einträge kommen ans Ende der Auslöser des Orts, geänderte behalten ihre übrigen Felder
  (etwa ``wenn``), gelöschte verschwinden.
- Weicht ``orte.json`` inzwischen vom ``vorher`` ab, bleibt der Eintrag unberührt (Konflikt).
- Warnung: Ein Auslöser verschwindet ganz von einer Karte, aber ein Übergang führt noch zu ihm
  (der Held käme dort nirgends an).

Format und Einrückung von ``orte.json`` (Prettier, Breite 80) bleiben erhalten (``editorrueck.als_text``).
"""

import json
from pathlib import Path

ART = "uebergang"
FELDER = ("name", "karte", "art", "ziel")  # Reihenfolge wie in orte.json
VARIANTEN = "varianten/"  # Varianten B und C: kein Spielstand betritt sie


def kurz(eintrag: dict) -> dict:
    """Nur die Felder, die der Editor kennt. Beispiel: mit ``wenn`` → ohne ``wenn``."""
    return {k: eintrag[k] for k in FELDER if k in eintrag}


def schluessel(eintrag: dict) -> tuple[str, str | None]:
    """(Name, Karte oder None). Beispiel: haustuer außen → ("haustuer", "mapleFalls.aussen")."""
    return eintrag["name"], eintrag.get("karte")


def zieltext(eintrag: dict | None) -> str:
    """Ziel als Text. Beispiel: „mapleFalls.zimmer / treppeUnten“."""
    ziel = (eintrag or {}).get("ziel") or {}
    return f"{ziel.get('karte', '?')} / {ziel.get('ausloeser', '?')}"


def benennung(ort: str, eintrag: dict) -> str:
    """Wie ein Übergang im Bericht heißt. Beispiel: „mapleFalls haustuer (mapleFalls.aussen)“."""
    karte = f" ({eintrag['karte']})" if eintrag.get("karte") else ""
    return f"{ort} {eintrag['name']}{karte}"


def unterschiede(uebergaenge: dict) -> list[tuple[str, dict | None, dict | None]]:
    """(Ort, vorher, nachher) je neuem (vorher None), geändertem und gelöschtem (nachher None)
    Übergang. Eingabe: ``uebergaenge`` der Änderungsdatei mit ``vorher`` und ``nachher``."""
    vorher, nachher = uebergaenge.get("vorher", {}), uebergaenge.get("nachher", {})
    ergebnis = []
    for ort in sorted(set(vorher) | set(nachher)):
        alt = {schluessel(d): kurz(d) for d in vorher.get(ort, [])}
        neu = {schluessel(d): kurz(d) for d in nachher.get(ort, [])}
        for k in [*alt, *(k for k in neu if k not in alt)]:
            if alt.get(k) != neu.get(k):
                ergebnis.append((ort, alt.get(k), neu.get(k)))
    return ergebnis


def _finde(ort: dict, eintrag: dict) -> int | None:
    """Index des Übergangs mit gleichem Namen und gleicher Karte in den Auslösern des Orts."""
    for i, a in enumerate(ort.get("ausloeser", [])):
        if a.get("art") == ART and schluessel(a) == schluessel(eintrag):
            return i
    return None


def wende_an(orte: dict, aenderungen: list) -> tuple[list[str], list[str]]:
    """Schreibt die Unterschiede in die geladene orte.json (``{"orte": […]}``).

    Ausgabe: (Berichtszeilen, Konflikte). Beispiel einer Zeile: „Übergang neu: mapleFalls
    treppeDiner (mapleFalls.dachboden) → mapleFalls.diner / treppeDachboden“.
    """
    nach_ort = {o["kennung"]: o for o in orte["orte"]}
    zeilen, konflikte = [], []
    for kennung, alt, neu in aenderungen:
        ort = nach_ort.get(kennung)
        eintrag = neu or alt
        name = benennung(kennung, eintrag)
        if ort is None:
            konflikte.append(f"{name}: Ort {kennung} fehlt in orte.json")
            continue
        liste = ort.setdefault("ausloeser", [])
        i = _finde(ort, eintrag)
        jetzt = kurz(liste[i]) if i is not None else None
        if jetzt != alt and jetzt != neu:
            konflikte.append(f"{name}: in orte.json inzwischen anders ({zieltext(jetzt)}), nicht geschrieben")
            continue
        if jetzt == neu:
            continue  # schon so (etwa ein zweiter Rücklauf derselben Datei)
        if alt is None:
            liste.append({k: neu[k] for k in FELDER if k in neu})
            zeilen.append(f"Übergang neu: {name} → {zieltext(neu)}")
        elif neu is None:
            del liste[i]
            zeilen.append(f"Übergang gelöscht: {name} (führte nach {zieltext(alt)})")
        else:
            liste[i]["ziel"] = neu["ziel"]
            zeilen.append(f"Übergang geändert: {name}: {zieltext(alt)} → {zieltext(neu)}")
    return zeilen, konflikte


def _namen(szene: dict) -> set[str]:
    return {a["name"] for a in szene.get("ausloeser", [])}


def verweiswarnungen(szenen: list[dict], orte: dict) -> list[str]:
    """Warnungen für Auslöser, die ganz von einer Karte verschwinden, auf die aber noch ein
    Übergang zeigt. Eingabe: die Einträge der Änderungsdatei und orte.json (nach dem Rücklauf).
    Beispiel: „WARNUNG: Auslöser haustuer gelöscht, aber mapleFalls haustuer (mapleFalls.aussen)
    führt noch dorthin“.
    """
    warnungen = []
    for eintrag in szenen:
        if eintrag["datei"].startswith(VARIANTEN):
            continue
        weg = _namen(eintrag["vorher"]) - _namen(eintrag["nachher"])
        karte = eintrag["nachher"].get("karte")
        for o in orte["orte"]:
            for a in o.get("ausloeser", []):
                ziel = a.get("ziel") or {}
                if a.get("art") == ART and ziel.get("karte") == karte and ziel.get("ausloeser") in weg:
                    warnungen.append(
                        f"WARNUNG: Auslöser {ziel['ausloeser']} gelöscht, aber "
                        f"{benennung(o['kennung'], a)} führt noch dorthin"
                    )
    return warnungen


def ruecklauf(daten: dict, pfad: Path, schreiben: bool = True) -> tuple[list[str], list[str], list[str]]:
    """Übergänge der Änderungsdatei nach ``pfad`` (orte.json oder eine Kopie im Test).

    Ausgabe: (Berichtszeilen, Konflikte, Warnungen). Ohne ``uebergaenge`` in der Datei (Editor vor
    1.4) wird nichts geschrieben, die Warnungen gelten trotzdem.
    """
    from pipeline.abenteuer.editorrueck import als_text

    alt = pfad.read_text(encoding="utf-8")
    orte = json.loads(alt)
    zeilen, konflikte = wende_an(orte, unterschiede(daten.get("uebergaenge") or {}))
    if zeilen and schreiben:
        pfad.write_text(als_text(orte, alt), encoding="utf-8")
    return zeilen, konflikte, verweiswarnungen(daten["szenen"], orte)

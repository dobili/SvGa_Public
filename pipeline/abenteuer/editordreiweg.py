"""Dreiwege-Rücklauf des Karteneditors: Änderungen des Autors auf den heutigen Stand einer Szene legen.

Warum: Zwischen dem Paket, mit dem der Autor im Editor arbeitet, und dem Rücklauf seiner Datei
ändern wir die Szenen oft weiter (Möbel im Maß, Zauntore, Sitzende, Gegenstände). Bisher wurde eine
solche Szene als Konflikt übersprungen oder mit ``--erzwingen`` überschrieben; beides verliert
Arbeit. Hier wird je Szene die Änderung des Autors (vorher → nachher, über die Zuordnung des
Editors) Objekt für Objekt und Merkmal für Merkmal auf den heutigen Stand übertragen
(Auftrag des Hauptchats, 23.11.2026, Kartenänderungen vom 20.11.):
- Ein Merkmal, das heute noch wie „vorher“ ist, bekommt den Wert des Autors („umgesetzt“).
- Ist es heute schon wie „nachher“, bleibt es („schon so“).
- Ist es inzwischen anders, bleibt der heutige Wert („Konflikt“, im Bericht zu entscheiden).
- Gelöschte Objekte fallen weg, wenn es sie heute noch gibt; neue kommen hinzu, wenn es sie heute
  nicht schon gibt.
Listen außer den Objekten (Auslöser, Figuren, Belebung, feine Sperren) werden elementweise
zusammengeführt, Einträge mit eindeutigem Namen als Änderung desselben Eintrags.
Rolle im Gesamtbild: Teil von editorrueck.py (Option ``--dreiweg``); reine Funktionen, getestet in
pipeline/tests/test_abenteuer_editordreiweg.py.
"""

import json

# Merkmale, an denen man ein Objekt wiedererkennt, wenn es sich sonst geändert hat.
ERKENNUNG = ("moebel", "feld", "auf")
OBJEKTE = "objekte"


def _schluessel(eintrag: dict) -> tuple:
    """Erkennungsmerkmale eines Objekts (Möbel, Feld, Unterlage)."""
    return tuple(json.dumps(eintrag.get(k)) for k in ERKENNUNG)


def finde(heute: list[dict], gesucht: dict, belegt: set[int], bevorzugt: int) -> int | None:
    """Index des heutigen Objekts zu einem Objekt von „vorher“: gleich (am selben Index bevorzugt),
    sonst eindeutig an Möbel, Feld und Unterlage erkannt; None, wenn es heute fehlt."""
    gleich = [i for i, o in enumerate(heute) if i not in belegt and o == gesucht]
    if gleich:
        return bevorzugt if bevorzugt in gleich else gleich[0]
    aehnlich = [i for i, o in enumerate(heute) if i not in belegt and _schluessel(o) == _schluessel(gesucht)]
    return aehnlich[0] if len(aehnlich) == 1 else None


def merkmale(vorher: dict, nachher: dict, heute: dict) -> tuple[dict, list[str]]:
    """Dreiwege je Merkmal eines Objekts. Ausgabe: neues Objekt und Konflikte („feld: heute …“)."""
    ergebnis, konflikte = dict(heute), []
    for k in sorted(set(vorher) | set(nachher)):
        alt, neu = vorher.get(k), nachher.get(k)
        if alt == neu or heute.get(k) == neu:
            continue
        if heute.get(k) == alt:
            if neu is None:
                ergebnis.pop(k, None)
            else:
                ergebnis[k] = neu
        else:
            konflikte.append(f"{k}: vorher {alt}, Autor {neu}, heute {heute.get(k)}")
    return ergebnis, konflikte


def _beschreibe(o: dict) -> str:
    """Kurzname eines Objekts. Beispiel: „mf4Fussmatte (5, 11)“."""
    feld = o.get("feld")
    return f"{o.get('moebel')} ({feld[0]}, {feld[1]})" if feld else f"{o.get('moebel')} auf {o.get('auf')}"


def objekte(vorher: list[dict], nachher: list[dict], zuordnung: list, heute: list[dict]):  # noqa: ANN201
    """Dreiwege der Objektliste. Ausgabe: (neue Liste, Berichtszeilen)."""
    zuordnung = list(zuordnung) + [None] * (len(nachher) - len(zuordnung))
    ergebnis: list[dict | None] = list(heute)
    belegt: set[int] = set()
    lage: dict[int, int] = {}  # Index in vorher → Index heute
    for j, alt in enumerate(vorher):
        if (i := finde(heute, alt, belegt, j)) is not None:
            belegt.add(i)
            lage[j] = i
    zeilen, neue = [], []
    for n, neu in enumerate(nachher):
        j = zuordnung[n]
        if j is None:
            neue.append((n, neu))
        elif vorher[j] != neu:
            zeilen += _aendere(ergebnis, lage.get(j), vorher[j], neu)
    benutzt = {j for j in zuordnung if j is not None}
    for j, alt in enumerate(vorher):
        if j in benutzt:
            continue
        if j in lage and ergebnis[lage[j]] is not None:
            ergebnis[lage[j]] = None
            zeilen.append(f"umgesetzt: gelöscht {_beschreibe(alt)}")
        else:
            zeilen.append(f"schon so: {_beschreibe(alt)} gibt es heute nicht mehr")
    return _mit_neuen(ergebnis, neue, zuordnung, lage, zeilen)


def _aendere(ergebnis: list, i: int | None, alt: dict, neu: dict) -> list[str]:
    """Überträgt die Änderung eines Objekts auf sein heutiges Gegenstück (an Stelle i)."""
    if i is None:
        return [f"obsolet: {_beschreibe(alt)} gibt es heute nicht mehr so (Änderung nicht übertragen)"]
    gemischt, konflikte = merkmale(alt, neu, ergebnis[i])
    geaendert = sorted(k for k in set(alt) | set(neu) if alt.get(k) != neu.get(k))
    ergebnis[i] = gemischt
    zeilen = [f"Konflikt: {_beschreibe(alt)} {k}" for k in konflikte]
    if len(konflikte) < len(geaendert):
        zeilen.append(f"umgesetzt: {_beschreibe(alt)} {', '.join(geaendert)}")
    return zeilen


def _mit_neuen(ergebnis: list, neue: list, zuordnung: list, lage: dict, zeilen: list[str]):  # noqa: ANN202
    """Fügt neue Objekte hinter ihrem Vorgänger im Nachher ein (sonst ans Ende), ohne Doppel."""
    einfuegen: dict[int, list[dict]] = {}
    for n, neu in neue:
        if neu in ergebnis:
            zeilen.append(f"schon so: neu {_beschreibe(neu)}")
            continue
        vorgaenger = [lage[zuordnung[k]] for k in range(n) if zuordnung[k] in lage]
        einfuegen.setdefault(vorgaenger[-1] if vorgaenger else len(ergebnis), []).append(neu)
        zeilen.append(f"umgesetzt: neu {_beschreibe(neu)}")
    liste = list(einfuegen.get(-1, []))
    for i, o in enumerate(ergebnis):
        if o is not None:
            liste.append(o)
        liste += einfuegen.get(i, [])
    return liste + einfuegen.get(len(ergebnis), []), zeilen


def _name(e: object) -> str | None:
    return e.get("name") if isinstance(e, dict) else None


def liste(vorher: list, nachher: list, heute: list) -> tuple[list, list[str]]:
    """Elementweise Zusammenführung (Auslöser, Figuren, Belebung, feine Sperren)."""
    weg = [e for e in vorher if e not in nachher]
    neu = [e for e in nachher if e not in vorher]
    namen_weg = [_name(e) for e in weg]
    namen_neu = [_name(e) for e in neu]
    ergebnis, zeilen = list(heute), []
    for e in weg:
        n = _name(e)
        partner = next(
            (x for x in neu if n and namen_weg.count(n) == 1 and namen_neu.count(n) == 1 and _name(x) == n),
            None,
        )
        if e in ergebnis:
            stelle = ergebnis.index(e)
            if partner is not None:
                ergebnis[stelle] = partner
                neu.remove(partner)
                zeilen.append(f"umgesetzt: {n} geändert")
            else:
                ergebnis.pop(stelle)
                zeilen.append(f"umgesetzt: entfernt {json.dumps(e, ensure_ascii=False)}")
        elif partner is not None:
            neu.remove(partner)
            zeilen.append(f"Konflikt: {n} heute anders, Änderung des Autors nicht übertragen")
        else:
            zeilen.append(f"schon so: {json.dumps(e, ensure_ascii=False)} gibt es heute nicht mehr")
    for e in neu:
        if e in ergebnis:
            zeilen.append(f"schon so: {json.dumps(e, ensure_ascii=False)}")
        else:
            ergebnis.append(e)
            zeilen.append(f"umgesetzt: neu {json.dumps(e, ensure_ascii=False)}")
    return ergebnis, zeilen


def szene(eintrag: dict, heute: dict) -> tuple[dict, list[str]]:
    """Dreiwege einer ganzen Szene (Eintrag der Änderungsdatei, heutiger Stand).
    Ausgabe: zusammengeführte Szene und Berichtszeilen („umgesetzt“, „schon so“, „obsolet“, „Konflikt“).
    """
    vorher, nachher = eintrag["vorher"], eintrag["nachher"]
    ergebnis, zeilen = dict(heute), []
    for k in sorted(set(vorher) | set(nachher)):
        alt, neu, jetzt = vorher.get(k), nachher.get(k), heute.get(k)
        if alt == neu or jetzt == neu:
            continue
        if k == OBJEKTE:
            ergebnis[k], z = objekte(alt or [], neu or [], eintrag.get("zuordnung") or [], jetzt or [])
        elif jetzt == alt:
            ergebnis[k], z = neu, [f"umgesetzt: {k}"]
        elif isinstance(neu, list) and isinstance(jetzt, list):
            ergebnis[k], z = liste(alt or [], neu, jetzt)
        else:
            z = [f"Konflikt: {k} heute anders als vorher und als beim Autor"]
        zeilen += [f"{k}: {x}" if not x.startswith(k) else x for x in z]
        if neu is None:
            ergebnis.pop(k, None)
    return ergebnis, zeilen

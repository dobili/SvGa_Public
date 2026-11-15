"""Katalogangaben zur Ausrichtung prüfen und Varianten anderer Richtungen im Grafikbestand finden.

Warum: Die Ausrichtungsprüfung (``ausrichtung.py``, KARTENREGELN 10.78) ist nur so gut wie die
Angaben ``lauf``, ``ende``, ``verbund``, ``stelle`` und ``varianten`` im Möbelkatalog. Dieses Modul
meldet widersprüchliche oder unvollständige Angaben (dasselbe Bild mit verschiedenem ``lauf``, ein
unbekannter Wert, ein Fahrzeug ohne Richtung) und schlägt Bilder anderer Richtung vor, die im
privaten Grafikbestand liegen (Namen mit getauschtem Richtungswort: ``_laengs`` ↔ ``_quer``,
``_Left`` ↔ ``_Down`` …).

Maßgeblich ist das Bild, nicht der Dateiname; deshalb steht ``lauf`` ausdrücklich im Katalog. Ein
einzelnes Gleisstück täuscht: ``Rail_Modular_Horizontal`` sieht allein wie Schienen von Nord nach
Süd aus, aneinandergereiht läuft es von West nach Ost (am Kartenbild von Riverton geprüft). Und
``leitplanke_laengs`` meint die lange Seite, das Bild läuft waagrecht.
"""

import re
from pathlib import Path

LAEUFE = {"waagrecht", "senkrecht"}
ENDEN = {"nord", "sued", "west", "ost"}
STELLEN = {"ende", "anfang"}
# Richtungswörter in Dateinamen, die sich gegenseitig ersetzen (eine Gruppe je Bildfamilie).
TAUSCHGRUPPEN = (
    ("_laengs", "_quer"),
    ("_Left", "_Right", "_Up", "_Down"),
    ("_links", "_rechts", "_oben", "_unten", "_vorn", "_hinten"),
    ("_Horizontal", "_Vertical"),
    ("_waagrecht", "_senkrecht"),
    ("_Front_Side", "_Back_Side", "_Left_Side", "_Right_Side"),
    ("_ab_ost", "_ab_west"),
    ("kugelfang", "hell_ende"),
)


def varianten_im_bestand(quelle: str, privat: Path | None) -> list[str]:
    """Bilder anderer Richtung zu ``quelle`` im privaten Bestand (Pfade wie im Katalog).

    Beispiel: ``spiel/eigene/feldbahn_laengs.png`` → ``["spiel/eigene/feldbahn_quer.png"]``;
    ``…Car_Down_4.png`` → ``[…Car_Left_4.png, …Car_Right_4.png, …Car_Up_4.png]``, soweit vorhanden.
    Ohne privates Paket: leer.
    """
    if privat is None or not (privat / "spiel").exists():
        return []
    gefunden = []
    for gruppe in TAUSCHGRUPPEN:
        for wort in gruppe:
            if wort not in quelle:
                continue
            for ersatz in gruppe:
                if ersatz == wort:
                    continue
                kandidat = quelle.replace(wort, ersatz)
                if (privat / kandidat).exists() and kandidat not in gefunden:
                    gefunden.append(kandidat)
    return gefunden


def pruefe_eintrag(name: str, angabe: dict) -> list[str]:
    """Befunde zu einem Katalogeintrag: unbekannte Werte und Widersprüche zwischen den Angaben."""
    befunde = []
    if "lauf" in angabe and angabe["lauf"] not in LAEUFE:
        befunde.append(f"{name}: lauf „{angabe['lauf']}“ unbekannt (waagrecht, senkrecht)")
    if "ende" in angabe and angabe["ende"] not in ENDEN:
        befunde.append(f"{name}: ende „{angabe['ende']}“ unbekannt (nord, sued, west, ost)")
    if "stelle" in angabe and angabe["stelle"] not in STELLEN:
        befunde.append(f"{name}: stelle „{angabe['stelle']}“ unbekannt (ende, anfang)")
    if "stelle" in angabe and "verbund" not in angabe:
        befunde.append(f"{name}: stelle ohne verbund")
    ende, lauf = angabe.get("ende"), angabe.get("lauf")
    if ende in ENDEN and lauf in LAEUFE and (ende in {"nord", "sued"}) != (lauf == "senkrecht"):
        befunde.append(f"{name}: ende {ende} passt nicht zu lauf {lauf}")
    for richtung, quelle in angabe.get("varianten", {}).items():
        if richtung not in LAEUFE | ENDEN | {"unten", "oben", "links", "rechts"}:
            befunde.append(f"{name}: Variante mit unbekannter Richtung „{richtung}“")
        if quelle == angabe.get("quelle"):
            befunde.append(f"{name}: Variante {richtung} ist das Bild selbst")
    return befunde


def pruefe_katalog(moebel: dict, benutzt: set[str] | None = None) -> list[str]:
    """Befunde über den ganzen Katalog: Einträge einzeln und dasselbe Bild mit verschiedenen Angaben.

    ``benutzt``: Namen der Möbel in Szenen; dann werden auch benutzte Fahrzeuge und Boote ohne jede
    Richtung (weder ``lauf`` noch ``blick``) gemeldet.
    """
    befunde = []
    je_bild: dict[str, dict[str, set]] = {}
    for name, angabe in sorted(moebel.items()):
        befunde += pruefe_eintrag(name, angabe)
        werte = je_bild.setdefault(angabe.get("quelle", ""), {"lauf": set(), "ende": set()})
        for feld in ("lauf", "ende"):
            if feld in angabe:
                werte[feld].add(angabe[feld])
        ohne = angabe.get("art") in {"fahrzeug", "boot"} and not angabe.get("lauf")
        if benutzt and name in benutzt and ohne and angabe.get("blick") in (None, "keine"):
            befunde.append(f"{name}: Fahrzeug ohne Richtung (lauf oder blick eintragen)")
    for quelle, werte in sorted(je_bild.items()):
        for feld, menge in werte.items():
            if len(menge) > 1:
                befunde.append(f"{Path(quelle).name}: {feld} widersprüchlich ({', '.join(sorted(menge))})")
    return befunde


NAMENSRICHTUNG = re.compile(r"_(laengs|quer|waagrecht|senkrecht)(_\d+)?\.png$")


def namenshinweis(angabe: dict) -> str | None:
    """Hinweis, wenn ``lauf`` dem Richtungswort im Dateinamen widerspricht (bitte Bild ansehen).

    Kein Fehler: Bei ``leitplanke_laengs`` meint „längs“ die lange Seite, das Bild läuft waagrecht.
    """
    treffer = NAMENSRICHTUNG.search(angabe.get("quelle", ""))
    if not treffer or "lauf" not in angabe:
        return None
    wort = treffer.group(1)
    erwartet = "senkrecht" if wort in ("laengs", "senkrecht") else "waagrecht"
    if angabe["lauf"] != erwartet:
        return f"{Path(angabe['quelle']).name}: Name sagt {wort}, lauf ist {angabe['lauf']}"
    return None

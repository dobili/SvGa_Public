"""Befunde am Möbelbild einer Karte: angeschnittene Bauteile, grauer Festschatten, Fußmatten (Pillow).

Warum: Diese Prüfungen brauchen die Bilder aus dem privaten Paket und liefen bisher in
``kartenbild.py``; dort wurde die Datei zu lang, als die weichen Ränder dazukamen (24.11.2026).
Rolle im Gesamtbild: ``kartenbild.main`` druckt ``bildbefunde`` und ``mattenbefunde`` je Szene;
``moebelbild`` liefert das Bild eines Möbels für Vorschau, Fußmatten- und Proportionsprüfung.
"""

from pathlib import Path

from PIL import Image

from pipeline.abenteuer.kartenbau import platziere
from pipeline.abenteuer.katalog import katalogbefund, katalogeintraege
from pipeline.abenteuer.moebelliste import lade_moebel

# Größter erlaubter Spalt zwischen Fußmatte und Tür in Pixeln (KARTENREGELN 10.8).
MATTE_ABSTAND = 3
# Deckender Festschatten der Standardbilder von LimeZu (wirkt auf unseren Böden wie ein Schleier).
GRAUSCHATTEN = (167, 151, 150, 255)


def moebelbild(privat: Path, quelle: str | dict) -> Image.Image:
    """Das Bild eines Möbels (Quelle oder ganze Angabe); die umgefärbte Fassung (spiel/schatten/) geht
    vor, wie im Paketbau. Eine Angabe mit ``ausschnitt`` (bodenkacheln.py) gibt nur diesen Teil."""
    angabe = quelle if isinstance(quelle, dict) else {"quelle": quelle}
    umgefaerbt = privat / "spiel" / "schatten" / angabe["quelle"]
    bild = Image.open(umgefaerbt if umgefaerbt.exists() else privat / angabe["quelle"]).convert("RGBA")
    return bild.crop(tuple(angabe["ausschnitt"])) if "ausschnitt" in angabe else bild


def grauer_schatten(privat: Path, quelle: str) -> bool:
    """Ob das Möbel ohne umgefärbte Fassung noch den deckenden grauen Schatten von LimeZu trägt."""
    return GRAUSCHATTEN in set(moebelbild(privat, quelle).get_flattened_data())


# Ab so vielen hellen, deckenden Pixeln an der linken, rechten oder oberen Bildkante gilt ein Bild als
# angeschnitten (ein Bauteil eines größeren Möbels); die Unterkante zählt nicht (Schatten am Boden).
ANSCHNITT = 6


def angeschnitten(bild: Image.Image) -> list[str]:
    """Kanten, an denen das Bild angeschnitten wirkt (deckende, helle Pixel statt dunklem Umriss).

    Warum: Viele Einzelbilder von LimeZu sind Teile größerer Möbel (halber Tisch, Regalstück); allein
    gesetzt wirken sie abgeschnitten (Rückmeldung des Autors, 9.11.2026)."""
    rgba = bild.convert("RGBA")
    breite, hoehe = rgba.size
    px = rgba.load()

    def hell(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        return a > 0 and r * 0.3 + g * 0.59 + b * 0.11 > 100

    kanten = {
        "oben": sum(hell(x, 0) for x in range(breite)),
        "links": sum(hell(0, y) for y in range(hoehe)),
        "rechts": sum(hell(breite - 1, y) for y in range(hoehe)),
    }
    return [k for k, n in kanten.items() if n >= ANSCHNITT]


def bildbefunde(szene: dict, privat: Path) -> list[str]:
    """Befunde, die nur mit den Bildern prüfbar sind: angeschnittene Bauteile, unsichere Einträge."""
    moebel = lade_moebel()
    katalog = katalogeintraege(privat)
    befunde = []
    for eintrag in szene.get("objekte", []):
        angabe = moebel.get(eintrag["moebel"])
        if angabe and "ausschnitt" not in angabe and grauer_schatten(privat, angabe["quelle"]):
            befunde.append(
                f"{eintrag['moebel']} hat den grauen Festschatten: werkzeuge/schatten.py im privaten "
                "Repository laufen lassen (oder die Black_Shadow-Fassung nehmen)"
            )
        if not angabe or eintrag.get("bauteil_ok") or "ausschnitt" in angabe:
            continue  # Kacheln aus einem Bogen (bodenkacheln.py) sind gewollt geschnitten
        # Eigene Bilder (spiel/eigene/, werkzeuge/schilder.py) stehen nicht im Katalog der Pakete.
        eigen = angabe["quelle"].startswith("spiel/eigene/")
        befund = None if eigen else katalogbefund(eintrag["moebel"], katalog.get(angabe["quelle"]))
        if befund:
            befunde.append(befund)
        # Eigene Bilder dürfen offene Ränder haben (Brücken enden am Ufer, werkzeuge/bruecken.py).
        kanten = [] if eigen else angeschnitten(Image.open(privat / angabe["quelle"]))
        if kanten:
            befunde.append(f"{eintrag['moebel']} wirkt angeschnitten ({', '.join(kanten)}): Bauteil?")
    return befunde


def mattenbefunde(szene: dict, privat: Path) -> list[str]:
    """Fußmatten liegen sichtbar an ihrer Tür (KARTENREGELN 10.8): höchstens MATTE_ABSTAND Pixel
    zwischen den deckenden Pixeln von Matte und Tür, oben oder unten.

    Warum: Die Matten lagen in fünf Räumen eine Handbreit über dem Türbild der Südwand, mit einem
    Streifen Boden dazwischen (Bildprüfung 9.11.2026); im Raster stand alles richtig."""
    moebel = lade_moebel()
    gesetzt, _ = platziere(szene, moebel)

    def sichtbar(st: dict) -> tuple[int, int, int, int]:
        rand = Image.open(privat / moebel[st["name"]]["quelle"]).getbbox() or (
            0,
            0,
            st["breite"],
            st["hoehe"],
        )
        return (st["x"] + rand[0], st["y"] + rand[1], st["x"] + rand[2], st["y"] + rand[3])

    tueren = [st for st in gesetzt if moebel[st["name"]].get("art") == "tuer"]
    befunde = []
    for matte in (st for st in gesetzt if "matte" in st["name"].lower()):
        m = sichtbar(matte)
        abstaende = [
            min(abs(t[1] - m[3]), abs(m[1] - t[3]))
            for t in map(sichtbar, tueren)
            if m[0] < t[2] and t[0] < m[2]
        ]
        if abstaende and min(abstaende) > MATTE_ABSTAND:
            befunde.append(
                f"{matte['name']} liegt {min(abstaende)} px von der Tür entfernt (versatz anpassen)"
            )
    return befunde

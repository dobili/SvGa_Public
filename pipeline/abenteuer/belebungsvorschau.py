"""Statisten und Tiere in den Vorschaubildern der Karten (kartenbild.py).

Warum: Der Autor beurteilt die Karten auf der Revisionsseite nach den Vorschaubildern. Seit Runde 7
(Rückmeldung vom 10.11.2026: „erheblich mehr Figuren, Menschen, auch Tiere“) gehören Statisten und
Tiere dazu; ohne sie sähe er die neue Belebung nicht. Statisten bekommen dasselbe Bild wie in der
App: nach der Rolle, für die ganze Karte gewählt (statistenwahl.py, in der App
``oberwelt/statistenwahl.ts``; bis 24.11.2026 würfelte die Vorschau mit crc32, die App mit FNV-1a,
nur 88 von 633 sahen gleich aus). Tiere bekommen den Bogen ihrer Art oder einen nahen Ersatz
(``app/src/abenteuer/oberwelt/tiere.ts``). Das Standbild „von vorn“ ist bei LimeZu das vierte der
oberen Reihe.

Sitzende Figuren und Statisten rücken auf ihr Sitzmöbel wie in der App (sitzplatz.py; Spieltest
Variante B, 16.11.2026, F2) und zeigen ihr Sitzbild, wenn das Paket eins hat (``sitzbild``;
Kartenblick M26: Vorher stand in der Vorschau das Standbild auf dem Stuhl). Der Vordergrund des
Möbels über der Sitzenden (oberwelt/vordergrund.ts) fehlt in der Vorschau noch. Die festen Figuren
der Szene zeichnet ``figurenteile``.

Abhängigkeiten: Pillow (nur über kartenbild.py, lokal), kartentiled.py, sitzplatz.py, statistenwahl.py.
"""

import json
from pathlib import Path

from PIL import Image

from pipeline.abenteuer.kartentiled import blickrichtung, figurversatz, sitzrichtung
from pipeline.abenteuer.sitzplatz import am_boden, sitzlage_auf
from pipeline.abenteuer.statistenwahl import Angabe, bilder_der_szene, waehle

K = 16
VORN = 3  # Reihenfolge der Standbilder: rechts, oben, links, unten
SITZ_RAHMEN = ("rechts", "oben", "links", "unten")
# Zeile der Füße im 32er-Rahmen (app/skripte/figurenbogen.mjs, FUSSZEILE); in hohen Rahmen
# (32 × 48, Schiffskoch, 25.11.2026) ebenso FUSSRAND Zeilen über dem unteren Rand.
FUSSZEILE = 30
FUSSRAND = 2
# Richtungen der PixelLab-Exporte in derselben Ordnung.
PIXELLAB = ("east", "north", "west", "south")
SITZ_HUB = 6  # sitzende Statisten stehen so viel höher (oberwelt/sitzrichtung.ts)
# Sitzbilder im PixelLab-Ordner einer Figur: auf dem Stuhl, am Boden (Schneidersitz).
SITZ_STUHL = "sitzstuhl"
SITZ_BODEN = "sitzboden"
# Kinder sitzen auf einem Möbel höher (oberwelt/figurensitz.ts, kinderhub): halber Unterschied zur
# sichtbaren Höhe eines erwachsenen Sitzbilds, in Figurenpixeln.
ERWACHSEN_SITZHOEHE = 31
KINDERHUB_ANTEIL = 0.5
# Arten und Wortstämme wie in der App (app/src/abenteuer/oberwelt/tierarten.json, eine Quelle).
_TIERARTEN = json.loads(
    (Path(__file__).resolve().parents[2] / "app/src/abenteuer/oberwelt/tierarten.json").read_text(
        encoding="utf-8"
    )
)
TIERBILDER = {art: (a["breite"], a["hoehe"]) for art, a in _TIERARTEN["arten"].items()}
STAEMME = _TIERARTEN["staemme"]
# Zeichengröße je Art im Verhältnis zum Bogen (Feld massstab, ohne Angabe 1), wie in der App.
MASSSTAB = {art: a.get("massstab", 1) for art, a in _TIERARTEN["arten"].items()}
# Tiere von der Seite (Standbild „rechts“): Von vorn wirken Hund und Fuchs, als stünden sie aufrecht
# (Gutachter 10.11.2026); Statisten weiter von vorn.
SEITE = 0
# Schwimmer zeigen nur den Teil über der Wasserlinie (Regel 10.55), wie in der App.
WASSERLINIE = 0.85
SCHAR = (
    "tauben",
    "moewen",
    "kraehen",
    "enten",
    "gaense",
    "huehner",
    "ziegen",
    "schafe",
    "kuehe",
    "herde",
    "spatzen",
)


def tierart(name: str) -> str | None:
    """Art eines Tiers nach seinem Namen; längster passender Wortstamm gewinnt, sonst None."""
    klein = name.lower()
    treffer = [s for s in STAEMME if s in klein]
    return STAEMME[max(treffer, key=len)] if treffer else None


def statistenbogen(name: str, bild: str | None = None) -> str:
    """Bogen eines einzelnen Statisten: eigenes Bild („statist-07“ oder Name einer Figur wie „otis“),
    sonst das Bild seiner Rolle (statistenwahl.py), ohne Blick auf die Nachbarn.

    Für eine ganze Szene ``statistenboegen`` nehmen: Nur dort wird dasselbe Bild in der Nähe gemieden.
    Beispiel: ``statistenbogen("schuelerin", "statist-07")`` → „figuren/statist-07.png“;
    ``statistenbogen("bauarbeiter")`` → „figuren/statist.arbeiter.png“.
    """
    return f"figuren/{waehle([Angabe(name=name, feld=(0, 0), bild=bild)])[0]}.png"


def statistenboegen(szene: dict) -> list[str]:
    """Bogen je Statist der Szene, in der Reihenfolge von ``belebung`` (ohne die Tiere), wie in der App.

    Beispiel: Akademie Silicon Bay → die Empfangsdame bekommt „figuren/statist.konzern.png“.
    """
    return [f"figuren/{bild}.png" for bild in bilder_der_szene(szene)]


def rgba(pfad: Path) -> Image.Image:
    """Öffnet ein Bild als RGBA (``oeffne`` für teile und figurbild)."""
    return Image.open(pfad).convert("RGBA")


# PixelLab-Figuren stehen mit 2/3 auf der Karte (Variante B, Wunsch des Autors, 16.11.2026; wie
# GROSS_MASSSTAB in app/src/abenteuer/oberwelt/weltmassstab.ts): In der App zwei Bildschirmpixel je
# Figurenpixel, drei je Kartenpixel. Die Vorschau zeichnet die Karte in Kartenpixeln, die Figur
# deshalb geglättet verkleinert (BOX), damit Gesichter und Kinder erkennbar bleiben.
PIXELLAB_MASSSTAB = 2 / 3


def _auf_fusszeile(bild: Image.Image) -> Image.Image | None:
    """PixelLab-Bild mit den Füßen auf der Fußzeile (32 × 32: FUSSZEILE; höhere Bilder FUSSRAND
    über dem Rand), auf PIXELLAB_MASSSTAB verkleinert; leer → None."""
    umriss = bild.getbbox()
    if not umriss:
        return None
    fusszeile = bild.height - FUSSRAND
    # Füße auf der Fußzeile wie im Paketbau (Kinder stehen im Export oft höher).
    gesetzt = Image.new("RGBA", bild.size)
    gesetzt.paste(bild, (0, fusszeile + 1 - umriss[3]))
    # Wie die App (oberwelt/weltmassstab.ts, GROSS_MASSSTAB): PixelLab-Figuren mit 2/3, Füße bleiben.
    seite = round(bild.width * PIXELLAB_MASSSTAB)
    hoch = round(bild.height * PIXELLAB_MASSSTAB)
    klein = gesetzt.resize((seite, hoch), Image.Resampling.BOX)
    verkleinert = Image.new("RGBA", bild.size)
    fuss = round((fusszeile + 1) * PIXELLAB_MASSSTAB)
    verkleinert.paste(klein, ((bild.width - seite) // 2, fusszeile + 1 - fuss))
    return verkleinert


def sitzbild(privat: Path, bogen: str, rahmen: int, oeffne, boden: bool = False) -> Image.Image | None:
    """Sitzbild einer Figur in Blickrichtung ``rahmen`` aus dem PixelLab-Ordner, sonst None.

    Wie die App (oberwelt/sitzrichtung.ts, ``sitzbild``): am Boden (``boden``, kein Sitzmöbel unter
    dem Feld) der Schneidersitz ``zustaende/sitzboden``, wenn es ihn gibt, sonst und auf einem Möbel
    ``zustaende/sitzstuhl``. Ohne Sitzbild (etwa statist.arbeiter) gilt das angehobene Standbild.
    Beispiel: „figuren/statist.rentner.png“, 3 → figuren-neu/statist.rentner/zustaende/sitzstuhl/
    rotations/south.png.
    """
    ordner = privat / "spiel" / "figuren-neu" / Path(bogen).stem / "zustaende"
    for zustand in (SITZ_BODEN, SITZ_STUHL) if boden else (SITZ_STUHL,):
        pfad = ordner / zustand / "rotations" / f"{PIXELLAB[rahmen]}.png"
        if pfad.exists():
            return _auf_fusszeile(oeffne(pfad))
    return None


def figurbild(privat: Path, bogen: str, rahmen: int, oeffne) -> Image.Image | None:
    """Standbild einer Figur in Blickrichtung ``rahmen`` (Ordnung wie SITZ_RAHMEN).

    Zuerst der PixelLab-Export ``figuren-neu/<name>/rotations/<richtung>.png`` (32 × 32, wie der
    Paketbau in app/skripte/figurenbogen.mjs), sonst der alte Bogen ``figuren/<name>.png`` (16 × 32),
    sonst None. Beispiel: „figuren/ada.png“, 3 → figuren-neu/ada/rotations/south.png.
    """
    neu = privat / "spiel" / "figuren-neu" / Path(bogen).stem / "rotations" / f"{PIXELLAB[rahmen]}.png"
    if neu.exists():
        return _auf_fusszeile(oeffne(neu))
    alt = privat / "spiel" / bogen
    return oeffne(alt).crop((rahmen * K, 0, (rahmen + 1) * K, 2 * K)) if alt.exists() else None


def _kinderhub(bild) -> int:
    """So viel höher sitzt eine kleine Figur auf einem Möbel (Kartenpixel; figurensitz.ts, kinderhub)."""
    umriss = bild.getbbox()
    if not umriss:
        return 0
    fehlt = max(0.0, ERWACHSEN_SITZHOEHE * PIXELLAB_MASSSTAB - (umriss[3] - umriss[1]))
    return round(fehlt * KINDERHUB_ANTEIL)


def sitzend(
    bild, teil: tuple, feld: tuple[int, int], sitzt: str | None, sitze, mit_sitzbild: bool = False
) -> tuple:
    """Bildteil (tiefe, x, y, bild) einer Figur, sitzend auf ihr Sitzmöbel gerückt.

    Ohne Sitzbild hebt SITZ_HUB das Standbild an (in Figurenpixeln; PixelLab-Figuren, 32 breit,
    stehen mit 2/3 auf der Karte). Mit Sitzbild (``mit_sitzbild``) entfällt der Hub wie in der App;
    Kinder sitzen dann um den Kinderhub höher.
    Beispiel: Sam auf dem Schulstuhl im Clubraum → 6 nach rechts, 9 nach oben, Tiefe 141,5.
    """
    tiefe, x, y = teil
    if sitzt not in SITZ_RAHMEN:
        return tiefe, x, y, bild
    lage = sitzlage_auf(sitze, feld)
    if lage is None:
        return tiefe, x, y, bild  # am Boden (Bordstein, sitzplatz.BODENSITZ): kein Hub, nicht verschoben
    if mit_sitzbild:
        y -= _kinderhub(bild)
    else:
        y -= round(SITZ_HUB * (PIXELLAB_MASSSTAB if bild.width >= 2 * K else 1))
    return lage[2], x + lage[0], y + lage[1], bild


def _bild_mit_haltung(privat: Path, bogen: str, rahmen: int, oeffne, sitzt: str | None, boden: bool) -> tuple:
    """(Bild, ist Sitzbild): für Sitzende das Sitzbild, wenn es eins gibt, sonst das Standbild."""
    sitz = sitzbild(privat, bogen, rahmen, oeffne, boden) if sitzt in SITZ_RAHMEN else None
    if sitz is not None:
        return sitz, True
    return figurbild(privat, bogen, rahmen, oeffne), False


def figurenteile(szene: dict, privat: Path, figuren: list[dict], sitze, oeffne) -> list[tuple]:
    """Bildteile der festen Figuren einer Szene (``figuren``: Einträge des Orts aus orte.json).

    Wie die App: Füße am unteren Rand des Feldes, Tiefe die Feldmitte; Sitzende über ``sitzend``.
    """
    ergebnis = []
    for f in szene.get("figuren", []):
        figur = next((x for x in figuren if x["kennung"].split(".", 1)[1] == f["name"]), None)
        sitzt = sitzrichtung(f)
        rahmen = SITZ_RAHMEN.index(sitzt or blickrichtung(f) or "unten")
        fx, fy = f["feld"]
        boden = am_boden(sitze, (fx, fy))
        teil, sitz = None, False
        if figur:
            teil, sitz = _bild_mit_haltung(privat, figur["sprite"], rahmen, oeffne, sitzt, boden)
        if teil:
            dx, dy = figurversatz(f) or (0, 0)  # feiner Versatz aus dem Editor, nur das Bild
            lage = (fy * K + K // 2, fx * K + (K - teil.width) // 2 + dx, (fy + 1) * K - teil.height + dy)
            ergebnis.append(sitzend(teil, lage, (fx, fy), sitzt, sitze, sitz))
    return ergebnis


def teile(szene: dict, privat: Path, oeffne, sitze=()) -> list[tuple[int, int, int, object]]:
    """Bildteile (tiefe, x, y, bild) für alle Statisten und Tiere einer Szene.

    Eingaben: Szene, privates Repository, ``oeffne(pfad) -> Image`` (RGBA), Sitzmöbel der Karte
    (sitzplatz.sitzmoebel).
    Sonderfall: Ohne Bogen (Art unbekannt oder Datei fehlt) wird nichts gezeichnet, wie in der App;
    Schwimmer (``verhalten: schwimmen``) nur bis zur Wasserlinie.
    """
    ergebnis = []
    boegen = iter(statistenboegen(szene))  # Bild nach der Rolle, für die ganze Karte gewählt
    for b in szene.get("belebung", []):
        x, y = b["feld"][0] * K, b["feld"][1] * K
        if b.get("typ") == "statist":
            ergebnis += _statist(b, privat, oeffne, (x, y), sitze, next(boegen))
            continue
        art = tierart(b["name"])
        pfad = privat / "spiel" / "tiere" / f"{art}.png"
        if art is None or not pfad.exists():
            continue
        breite, hoehe = TIERBILDER[art]
        sichtbar = _sichtbar(b, hoehe)
        bild = oeffne(pfad).crop((SEITE * breite, 0, (SEITE + 1) * breite, sichtbar))
        massstab = MASSSTAB.get(art, 1)
        if massstab != 1:
            breite, sichtbar = round(breite * massstab), round(sichtbar * massstab)
            bild = bild.resize((breite, sichtbar), Image.Resampling.NEAREST)
        anzahl = 3 if any(w in b["name"].lower() for w in SCHAR) else 1
        for i in range(anzahl):
            dx, dy = i * (breite // 2 + 4), (i % 2) * 6
            ergebnis.append((y + K + dy, x + dx, y + K - sichtbar + dy, bild))
    return ergebnis


def _sichtbar(b: dict, hoehe: int) -> int:
    """Sichtbare Höhe: Schwimmer (``verhalten: schwimmen``) nur bis zur Wasserlinie (Regel 10.55)."""
    if b.get("eigenschaften", {}).get("verhalten") == "schwimmen":
        return round(hoehe * WASSERLINIE)
    return hoehe


def _statist(b: dict, privat: Path, oeffne, ecke: tuple[int, int], sitze, bogen: str) -> list[tuple]:
    """Bildteil eines Statisten: Standbild von vorn oder nach ``blick`` (R008), sitzend in seiner
    Blickrichtung mit Sitzbild (sonst SITZ_HUB höher, R020) auf seinem Sitzmöbel, unten mittig auf
    seinem Feld; PixelLab 32 × 32 oder LimeZu 16 × 32 (figurbild). ``bogen`` kommt aus statistenboegen."""
    x, y = ecke
    feld = (x // K, y // K)
    eigenschaften = b.get("eigenschaften", {})
    sitzt = "unten" if eigenschaften.get("sitzt") == "ja" else eigenschaften.get("sitzt")
    blick = eigenschaften.get("blick")  # stehender Statist mit Blickrichtung (R008)
    rahmen = SITZ_RAHMEN.index(sitzt or blick) if (sitzt or blick) in SITZ_RAHMEN else VORN
    bild, sitz = _bild_mit_haltung(privat, bogen, rahmen, oeffne, sitzt, am_boden(sitze, feld))
    if bild is None:
        return []
    sichtbar = _sichtbar(b, bild.height)
    bild = bild.crop((0, 0, bild.width, sichtbar))
    lage = (y + K, x + (K - bild.width) // 2, y + K - sichtbar)
    return [sitzend(bild, lage, feld, sitzt, sitze, sitz)]

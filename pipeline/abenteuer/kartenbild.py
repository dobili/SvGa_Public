"""Hintergrundbild und Vorschau einer gebauten Karte aus der gekauften Grafik (braucht Pillow).

Warum: Wände im Stil von LimeZu sind mehr als eine Kachel: weiße Wandkrone mit dunklem Rand, darunter
zwei Reihen Wandfläche (oben, unten mit Sockelleiste). Der Kartenbauer legt nur das Raster fest; dieses
Skript zeichnet daraus den Hintergrund (``spiel/grafik/karten/<kennung>.png`` im privaten Repository)
und eine Vorschau mit Möbeln und Figuren für die Bildprüfung.
Aufruf: ``python -m pipeline.abenteuer.kartenbild PRIVAT VORSCHAUORDNER inhalte/abenteuer/szenen/*.json``
"""

import sys
from functools import cache
from pathlib import Path

from PIL import Image, ImageDraw

from pipeline.abenteuer.belebungsvorschau import figurenteile, rgba
from pipeline.abenteuer.belebungsvorschau import teile as belebungsteile
from pipeline.abenteuer.bodenraster import (
    bodenfeld,
    brueckenzeichen,
    eckzusaetze,
    randergaenzt,
    randkachel,
    randnachbar,
    randsichten,
    uferfelder,
)
from pipeline.abenteuer.bodenvariation import lade_kachel, variiere
from pipeline.abenteuer.kartenbau import (
    GESPERRT,
    INHALTE,
    LEER,
    WAND,
    WASSER,
    K,
    lade,
    platziere,
    raster,
)
from pipeline.abenteuer.klippe import (
    HOEHE_STANDARD,
    REIHE_RAND,
    grasboden,
    klippenbogen,
    klippenfeld,
    vorhandene_fassung,
)
from pipeline.abenteuer.klippenbild import veredle
from pipeline.abenteuer.moebelbefunde import bildbefunde, mattenbefunde, moebelbild
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.objektform import formbild, mit_deckkraft
from pipeline.abenteuer.randspur import randhang, randluecken
from pipeline.abenteuer.saum import belaguebergaenge
from pipeline.abenteuer.sitzplatz import sitzmoebel
from pipeline.abenteuer.strasse import kehrenfelder, markiere
from pipeline.abenteuer.toenung import schleier
from pipeline.abenteuer.treppenrand import stirnkanten
from pipeline.abenteuer.uferart import gezeichnetes_raster, uferbogen
from pipeline.abenteuer.weichrand import weiche_raender
from pipeline.abenteuer.winter import ist_winter, winterbefunde, winterlich, winterliche_moebel
from pipeline.abenteuer.zusammenhang import HOLZ
from pipeline.abenteuer.zustaende import bildname

KRONE = (246, 246, 248, 255)
KRONENRAND = (58, 58, 80, 255)
# Breite des dunklen Rands der Wandkrone in Pixeln.
KRONENRAND_BREITE = 2
DUNKEL = (26, 22, 18, 255)


@cache
def _bogen(pfad: Path) -> Image.Image:
    """Ein Kachelbogen, je Lauf nur einmal geladen (vorher je Kachel neu: Minuten je Karte)."""
    return Image.open(pfad).convert("RGBA")


def kachel(privat: Path, boegen: dict, angabe: dict, feld: list[int]) -> Image.Image:
    """Eine Kachel (16 × 16) aus dem Bogen der Angabe am Feld (Spalte, Zeile)."""
    bogen = _bogen(privat / boegen[angabe["bogen"]])
    return bogen.crop((feld[0] * K, feld[1] * K, (feld[0] + 1) * K, (feld[1] + 1) * K))


def wellenbild(art: dict, feld: list[int], x: int, y: int) -> str | None:
    """Ein Wellen- oder Glanzbild für offenes Wasser an (x, y), oder None.

    Warum: Einfarbiges Wasser wirkte auf den Autor langweilig (KARTENREGELN 10.4). Nur auf
    Mittelstücken (kein Ufer), fest je Ort gestreut, damit das Bild bei jedem Bau gleich bleibt."""
    wellen = art.get("wellen")
    if not wellen or feld != [art["rand"][0] + 1, art["rand"][1] + 1]:
        return None
    wurf = (x * 92821 + y * 68917 + x * y * 31) % 100
    if wurf >= wellen["anteil"]:
        return None
    return wellen["bilder"][(x * 13 + y * 7) % len(wellen["bilder"])]


def wasserkachel(
    privat: Path, mat: dict, name: str, zeilen: list[str], feld: tuple[int, int], ueber: frozenset[str]
) -> tuple[Image.Image, list[int], list[int]]:
    """Die Kachel eines Wasserfelds aus dem Bogen der Bodenart ``name``, mit allen Innenecken.

    Warum: Eine Kachel zeigt höchstens eine Innenecke; an schrägen Knicken blieb die zweite Ecke
    ein Wasserquadrat ohne Rand (Kartenblick 24.11.2026, M03). Für jede weitere Ecke kommt das
    Viertel der passenden Innenecken-Kachel darüber (``bodenraster.eckzusaetze``).
    Ausgabe: (Bild, Feld im gewöhnlichen Wasserbogen für die Randspur, Feld im eigenen Bogen).
    Beispiel: Canyonrand (65, 25), Land oben links und unten rechts → beide Ecken tragen Fels.
    """
    halb, art = K // 2, mat["boeden"][name]
    spur, eigen = uferfelder(mat["boeden"], name, zeilen, *feld, ueber)
    teil = kachel(privat, mat["boegen"], art, eigen).copy()
    for ecke, (dx, dy) in eckzusaetze(art["rand"], zeilen, *feld, ueber):
        links, oben = (halb if dx > 0 else 0), (halb if dy > 0 else 0)
        viertel = (links, oben, links + halb, oben + halb)
        teil.paste(kachel(privat, mat["boegen"], art, ecke).crop(viertel), viertel)
    return teil, spur, eigen


def flaechen(zeilen: list[str], innen: bool = False) -> dict[tuple[int, int], str]:
    """Wandflächen: die zwei Wandkacheln direkt über einem Boden werden Fläche (oben, unten).

    Innen (``innen``) nur, wo die Wand seitlich an Wand anschließt: Eine einzelne Wandsäule über
    einem Durchgang in einer Nord-Süd-Wand bleibt Krone. Warum: Sonst steckt mitten in der von oben
    gesehenen Trennwand ein Stück Wandfläche mit Fußleiste über dem Durchgang (Gutachten Runde 8,
    Punkt f: Diner zwischen Küche und Lager, Wohnzimmer zur Küche).
    Beispiel: Boden (24, 5), Wand (24, 4) und (24, 3), daneben Boden bei (23, 4) und (25, 4) → keine
    Fläche, die Wand läuft als Krone bis an den Durchgang."""
    flaeche = {}
    for y in range(2, len(zeilen)):
        for x, z in enumerate(zeilen[y]):
            if z in GESPERRT or zeilen[y - 1][x] != WAND or zeilen[y - 2][x] != WAND:
                continue
            if innen and not _seitlich_wand(zeilen, x, y - 1):
                continue
            flaeche[(x, y - 1)] = "unten"
            flaeche[(x, y - 2)] = "oben"
    return flaeche


def _seitlich_wand(zeilen: list[str], x: int, y: int) -> bool:
    """Ob links oder rechts von (x, y) eine Wand steht (Kartenrand zählt als Wand)."""
    return any(not 0 <= nx < len(zeilen[y]) or zeilen[y][nx] == WAND for nx in (x - 1, x + 1))


def hintergrund(szene: dict, privat: Path, gezeichnet: dict | None = None) -> Image.Image:
    """Hintergrund aus Böden und Wänden; ``gezeichnet`` (falls gegeben) erhält je Feld Bodenart und
    Kachel für die Randspur."""
    mat = lade(INHALTE / "materialien.json")
    boegen, boeden, waende = mat["boegen"], mat["boeden"], mat["waende"]
    # Brückenfelder (Szene „bruecken“) sind begehbar, gezeichnet wird darunter aber Wasser mit
    # durchgehendem Ufer; die Brücke selbst ist ein Bild aus dem Katalog (KARTENREGELN 10.6).
    bruecken = set(szene.get("bruecken", []))
    # Wege und Beläge sehen das Raster ohne diese Umdeutung: Ein Weg läuft ohne Rand auf die Brücke.
    roh = raster(szene)
    zeilen = ["".join(WASSER if z in bruecken else z for z in zeile) for zeile in roh]
    bild = Image.new("RGBA", (len(zeilen[0]) * K, len(zeilen) * K), DUNKEL)
    zeichner = ImageDraw.Draw(bild)
    grund = szene.get("boden", "holzHell")
    sonder = szene.get("boeden", {})
    wand = waende[szene.get("wand", "creme")]
    # Draußen ist „#“ eine Hecke (oder ein anderer Boden aus „wandart“), keine Wandkrone.
    wandart = boeden.get(szene["wandart"]) if szene.get("wandart") else None
    ansicht = gezeichnetes_raster(szene)  # für das Ufer: Randwände zeigen das Feld dahinter
    # Wandstile mit eigener Krone (Fels, Damm) zeichnen ihre Flächen auch draußen neben „wandart“:
    # Der Rand bleibt dann Boden, nur „#“ über einem Boden wird Hang oder Felswand (10.45).
    flaeche = flaechen(zeilen, szene.get("art") == "innen") if not wandart or "krone" in wand else {}
    # Felskanten und Treppen aus LimeZus Klippenkacheln (Szene „kante“: „klippe“, klippe.py).
    klippe, klippenhoehe = szene.get("kante") == "klippe", szene.get("klippenhoehe", HOEHE_STANDARD)
    gras, klippenart = grasboden(szene), {"bogen": klippenbogen(szene, privat)}
    ueber = brueckenzeichen(szene)  # Holzböden, unter denen das Wasser weiterläuft
    sichten = randsichten(roh, sonder, grund, boeden)  # Böden mit „rand_gegen“ (Weg im roten Sand)
    for y, zeile in enumerate(zeilen):
        for x, z in enumerate(zeile):
            ort = (x * K, y * K)
            # Randwände draußen zeigen auch mit Klippen den Boden dahinter (Regel 10.2), sonst wird der
            # Kartenrand zur erdigen Dachfläche (Port Delacroix, Runde 9).
            am_rand = wandart is not None and z == WAND and randnachbar(zeilen, x, y) is not None
            if klippe and not am_rand and (feld := klippenfeld(zeilen, x, y, gras, klippenhoehe)) is not None:
                if feld[1] == REIHE_RAND:  # Rand der Hochfläche: oben schaut der Boden darüber durch
                    art = boeden[sonder.get(roh[y - 1][x], grund)]
                    bild.alpha_composite(kachel(privat, boegen, art, bodenfeld(art, roh, x, y - 1)), ort)
                # Fehlt dem Bogen diese Fassung (roter Fels hat kein Gras), die vorhandene nehmen.
                feld = vorhandene_fassung(
                    feld, lambda f: kachel(privat, boegen, klippenart, list(f)).getbbox()
                )
                bild.alpha_composite(kachel(privat, boegen, klippenart, list(feld)), ort)
                continue
            if z == WASSER:
                # Das Ufer richtet sich je Feld nach dem Nachbarboden (uferart.py): Kaimauer aus
                # dem Steinbogen, sonst der Bogen der Szene; die Randspur rechnet mit LimeZus Wasser.
                art = boeden[ufer := uferbogen(szene, ansicht, x, y)]
                teil, feld, eigen = wasserkachel(privat, mat, ufer, zeilen, (x, y), ueber)
                bild.alpha_composite(teil, ort)
                if gezeichnet is not None:
                    gezeichnet[(x, y)] = ("wasser", feld)
                if (welle := wellenbild(art, eigen, x, y)) is not None:
                    bild.alpha_composite(Image.open(privat / welle).convert("RGBA"), ort)
            elif z == WAND and wandart and (innen := randnachbar(zeilen, x, y)) is not None:
                # Außen ist der Rand nur Kollision: Er zeigt den Boden dahinter, damit Felder und
                # Wege bis an den Bildrand reichen (Regel 5.1, 6.3; Hinweis von niedrig-1).
                # Wasser dahinter behält das Ufer der Szene (bodenraster.randkachel).
                innenart = sonder.get(zeilen[innen[1]][innen[0]], grund)
                ufer = uferbogen(szene, ansicht, x, y)
                artname, bogen, feld, eigen = randkachel(boeden, ufer, (zeilen, roh), innen, innenart, ueber)
                bild.alpha_composite(kachel(privat, boegen, boeden[bogen], eigen), ort)
                if gezeichnet is not None:
                    gezeichnet[(x, y)] = (artname, feld)
            elif z == WAND and szene.get("hang_bis_rand") and (nachbar := randhang(x, y, zeilen, flaeche)):
                # Szenen mit „hang_bis_rand“ (Bahndamm): Die Böschung läuft bis an den linken und
                # rechten Bildrand weiter statt dort als Wiese zu enden (Rückmeldung des Autors, Runde 8).
                bild.alpha_composite(kachel(privat, boegen, wand, wand[flaeche[nachbar]]), ort)
            elif z == WAND and (x, y) in flaeche:
                teil = wand[flaeche[(x, y)]]
                bild.alpha_composite(kachel(privat, boegen, wand, teil), ort)
            elif z == WAND and wandart:
                bild.alpha_composite(kachel(privat, boegen, wandart, wandart["feld"]), ort)
                if gezeichnet is not None:
                    gezeichnet[(x, y)] = (szene["wandart"], wandart["feld"])
            elif z == WAND and "krone" in wand:
                # Wandstile mit eigener Krone (Fels, KARTENREGELN 10.45): Kachel statt weißer Fläche.
                feld = wand["krone"][(x * 7 + y * 3) % len(wand["krone"])]
                bild.alpha_composite(kachel(privat, boegen, wand, feld), ort)
            elif z == WAND:
                zeichner.rectangle((*ort, ort[0] + K - 1, ort[1] + K - 1), fill=KRONE)
            elif z != LEER:
                art = boeden[sonder.get(z, grund)]
                feld = bodenfeld(art, sichten.get(sonder.get(z, grund), roh), x, y)
                bild.alpha_composite(kachel(privat, boegen, art, feld), ort)
                if gezeichnet is not None:
                    gezeichnet[(x, y)] = (sonder.get(z, grund), feld)
    # Mit Klippen zeichnet klippenbild.veredle (in ``zeichne``) Wand, Schatten und Treppen fertig.
    if not klippe and not wandart and not wand.get("ohne_rand"):  # „ohne_rand“: dunkle Krone im Stollen
        _kronenrand(zeichner, zeilen, flaeche)
    return bild


def _kronenrand(zeichner: ImageDraw.ImageDraw, zeilen: list[str], flaeche: dict) -> None:
    """Dunkler Rand der Wandkrone, wo sie an Boden, Fläche oder Leere grenzt (wie bei LimeZu)."""

    def krone(x: int, y: int) -> bool:
        return (
            0 <= y < len(zeilen)
            and 0 <= x < len(zeilen[0])
            and zeilen[y][x] == WAND
            and (x, y) not in flaeche
        )

    breit = KRONENRAND_BREITE
    for y in range(len(zeilen)):
        for x in range(len(zeilen[0])):
            if not krone(x, y):
                continue
            x0, y0, x1, y1 = x * K, y * K, x * K + K - 1, y * K + K - 1
            # Rechtecke statt Linien: ``line`` mit Breite 2 legt senkrechte und waagrechte Striche
            # verschieden ums Pixel, der Rahmen sprang an den oberen Ecken (Kartenblick, M24).
            seiten = {
                (0, -1): (x0, y0, x1, y0 + breit - 1),
                (0, 1): (x0, y1 - breit + 1, x1, y1),
                (-1, 0): (x0, y0, x0 + breit - 1, y1),
                (1, 0): (x1 - breit + 1, y0, x1, y1),
            }
            for (dx, dy), kasten in seiten.items():
                if not krone(x + dx, y + dy):
                    zeichner.rectangle(kasten, fill=KRONENRAND)
            # Innenecken der Krone: Der Rand läuft um die Ecke weiter (ein Quadrat in Randbreite).
            for dx, dy in ((1, 1), (-1, 1), (1, -1), (-1, -1)):
                if krone(x + dx, y) and krone(x, y + dy) and not krone(x + dx, y + dy):
                    ex, ey = (x1 - breit + 1 if dx > 0 else x0), (y1 - breit + 1 if dy > 0 else y0)
                    zeichner.rectangle((ex, ey, ex + breit - 1, ey + breit - 1), fill=KRONENRAND)


# Bildpunkte der Vorschau je Kartenpixel (andere Werkzeuge rechnen mit 2: uebergangsbogen.py).
VORSCHAU_ZOOM = 2


def _gross(teil: Image.Image) -> Image.Image:
    """Ein Teil der Vorschau, pixelgenau auf ``VORSCHAU_ZOOM`` vergrößert."""
    return teil.resize((teil.width * VORSCHAU_ZOOM, teil.height * VORSCHAU_ZOOM), Image.NEAREST)


def _setze(bild: Image.Image, teil: Image.Image, x: int, y: int) -> None:
    """Setzt ein Teil ins Bild; was links oder oben übersteht, wird abgeschnitten wie im Spiel
    (vorher rückte das ganze Teil ins Bild, Kartenblick 24.11.2026, Abschnitt 0)."""
    links, oben = max(0, -x), max(0, -y)
    if links < teil.width and oben < teil.height:
        bild.alpha_composite(teil.crop((links, oben, teil.width, teil.height)), (x + links, y + oben))


def vorschau(szene: dict, privat: Path, grund: Image.Image) -> Image.Image:
    """Hintergrund mit Möbeln (nach Tiefe) und Figuren von vorn, doppelt vergrößert.

    Möbel werden wie in der App in einem Schritt aus dem Original auf Maßstab × Zoom skaliert
    (``objektform.formbild``), nicht erst im Kartenraster und dann verdoppelt (M25)."""
    moebel = lade_moebel()
    gesetzt, _ = platziere(szene, moebel)
    bild = _gross(grund)
    roh = [moebelbild(privat, moebel[s["name"]]) for s in gesetzt]
    bilder = [formbild(b, s) for b, s in zip(roh, gesetzt, strict=True)]
    scharf = [mit_deckkraft(formbild(b, s, VORSCHAU_ZOOM), s) for b, s in zip(roh, gesetzt, strict=True)]
    teile = [(s["tiefe"], s["x"], s["y"], b) for s, b in zip(gesetzt, scharf, strict=True)]
    sitze = sitzmoebel(gesetzt, moebel, bilder)  # Sitzende rücken auf ihr Möbel (sitzplatz.py)
    if ist_winter(szene):
        # Wie die App (oberwelt/winter.ts): Möbel ohne Wasserregel, sonst würden blaue Autos dunkel.
        teile = [(t, x, y, winterliche_moebel(b)) for t, x, y, b in teile]
    orte = {o["kennung"]: o for o in lade(INHALTE / "orte.json")["orte"]}
    ort = orte.get(szene["karte"].split(".")[0], {"figuren": []})
    figuren = figurenteile(szene, privat, ort["figuren"], sitze, rgba)
    figuren += belebungsteile(szene, privat, rgba, sitze)
    teile += [(t, x, y, _gross(b)) for t, x, y, b in figuren]
    for _, x, y, teil in sorted(teile, key=lambda t: t[0]):
        _setze(bild, teil, x * VORSCHAU_ZOOM, y * VORSCHAU_ZOOM)
    return bild


def randspur(szene: dict, gezeichnet: dict) -> list[str]:
    """Ränder von Wasser und Erdwegen an der fertigen Zeichnung nachziehen (randspur.py), draußen."""
    if szene.get("art") != "aussen":
        return []
    boeden = lade(INHALTE / "materialien.json")["boeden"]
    raender = {name: boeden[name]["rand"] for name in ("wasser", "erde")}
    trennt = {szene.get("boden", "gras"), szene.get("wandart", "hecke")}
    return randluecken(gezeichnet, raender, trennt, frozenset(HOLZ))


def zeichne(szene: dict, privat: Path) -> tuple[Image.Image, Image.Image, dict]:
    """Hintergrund (für das Spiel), Vorschau mit Möbeln und Tönung, gezeichnete Felder (Randspur).

    Gemeinsam für main und die Weltkarte (pipeline/abenteuer/weltkarte.py), die nur die Vorschau
    braucht und nichts ins private Paket schreibt."""
    gezeichnet: dict = {}
    grund = hintergrund(szene, privat, gezeichnet)
    mat = lade(INHALTE / "materialien.json")
    grund = variiere(szene, grund, gezeichnet, mat, lade_kachel(privat, mat["boegen"]))
    grund = veredle(szene, grund, privat)  # Felskanten als Gelände (nach der Bodenvariation)
    ergaenzt = randergaenzt(raster(szene), "wandart" in szene)
    markiere(grund, ergaenzt, szene, gezeichnet, mat["boeden"])
    # Zuletzt die weichen Ränder von Wegen und Wasser (weichrand.py): über Variation und Säumen.
    boeden = mat["boeden"]
    weiche_raender(
        grund,
        szene,
        gezeichnet,
        boeden,
        lambda art: kachel(privat, mat["boegen"], boeden[art], boeden[art]["feld"]),
        stirnkanten(szene, lade_moebel()),
    )
    # Danach, damit die neu gemalten Randfelder ihre Verzahnung mit dem Nachbarbelag behalten.
    belaguebergaenge(grund, gezeichnet, boeden, kehrenfelder(szene, ergaenzt))
    if ist_winter(szene):
        grund = winterlich(grund)
    return grund, schleier(vorschau(szene, privat, grund), szene.get("toenung")), gezeichnet


def main() -> None:
    privat, vorschauordner = Path(sys.argv[1]), Path(sys.argv[2])
    vorschauordner.mkdir(parents=True, exist_ok=True)
    (privat / "spiel" / "grafik" / "karten").mkdir(parents=True, exist_ok=True)
    for name in sys.argv[3:]:
        szene = lade(Path(name))
        grund, bild, gezeichnet = zeichne(szene, privat)
        name, spielbild = bildname(szene)
        if spielbild:
            grund.convert("RGB").save(privat / "spiel" / "grafik" / "karten" / f"{name}.png")
        bild.convert("RGB").save(vorschauordner / f"{name}.png")
        befunde = sorted(set(bildbefunde(szene, privat))) + randspur(szene, gezeichnet)
        if not spielbild and not szene.get("variante"):
            befunde.append(f"{szene['datei']} ist weder Grundkarte noch Zustand in orte.json: nur Vorschau")
        befunde += mattenbefunde(szene, privat)
        befunde += winterbefunde(szene)
        print(f"{name}: Hintergrund und Vorschau gezeichnet")
        for b in befunde:
            print(f"  - {b}")


if __name__ == "__main__":
    main()

"""Hintergrundbild und Vorschau einer gebauten Karte aus der gekauften Grafik (braucht Pillow).

Warum: Wände im Stil von LimeZu sind mehr als eine Kachel: weiße Wandkrone mit dunklem Rand, darunter
zwei Reihen Wandfläche (oben, unten mit Sockelleiste). Der Kartenbauer legt nur das Raster fest; dieses
Skript zeichnet daraus den Hintergrund (``spiel/grafik/karten/<kennung>.png`` im privaten Repository)
und eine Vorschau mit Möbeln und Figuren für die Bildprüfung.
Aufruf: ``python -m pipeline.abenteuer.kartenbild PRIVAT VORSCHAUORDNER inhalte/abenteuer/szenen/*.json``
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

from pipeline.abenteuer.belebungsvorschau import teile as belebungsteile
from pipeline.abenteuer.bodenraster import bodenfeld, brueckenzeichen, randnachbar
from pipeline.abenteuer.bodenvariation import lade_kachel, variiere
from pipeline.abenteuer.kartenbau import GESPERRT, INHALTE, LEER, WAND, WASSER, K, lade, platziere, raster
from pipeline.abenteuer.katalog import katalogbefund, katalogeintraege
from pipeline.abenteuer.klippe import (
    REIHE_RAND,
    grasboden,
    klippenbogen,
    klippenfeld,
    strassenzeichen,
    treppenfelder,
)
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.randspur import randhang, randluecken
from pipeline.abenteuer.strasse import markiere
from pipeline.abenteuer.toenung import schleier
from pipeline.abenteuer.winter import ist_winter, winterbefunde, winterlich, winterliche_moebel
from pipeline.abenteuer.zusammenhang import HOLZ
from pipeline.abenteuer.zustaende import zustandsname

KRONE = (246, 246, 248, 255)
KRONENRAND = (58, 58, 80, 255)
DUNKEL = (26, 22, 18, 255)
# Größter erlaubter Spalt zwischen Fußmatte und Tür in Pixeln (KARTENREGELN 10.8).
MATTE_ABSTAND = 3
# Deckender Festschatten der Standardbilder von LimeZu (wirkt auf unseren Böden wie ein Schleier).
GRAUSCHATTEN = (167, 151, 150, 255)


def kachel(privat: Path, boegen: dict, angabe: dict, feld: list[int]) -> Image.Image:
    bogen = Image.open(privat / boegen[angabe["bogen"]]).convert("RGBA")
    return bogen.crop((feld[0] * K, feld[1] * K, (feld[0] + 1) * K, (feld[1] + 1) * K))


def moebelbild(privat: Path, quelle: str) -> Image.Image:
    """Das Bild eines Möbels; die umgefärbte Fassung (spiel/schatten/, durchscheinender statt grauer
    Festschatten, werkzeuge/schatten.py) geht vor, wie im Paketbau der App."""
    umgefaerbt = privat / "spiel" / "schatten" / quelle
    return Image.open(umgefaerbt if umgefaerbt.exists() else privat / quelle).convert("RGBA")


def grauer_schatten(privat: Path, quelle: str) -> bool:
    """Ob das Möbel ohne umgefärbte Fassung noch den deckenden grauen Schatten von LimeZu trägt."""
    return GRAUSCHATTEN in set(moebelbild(privat, quelle).get_flattened_data())


def wellenbild(art: dict, feld: list[int], x: int, y: int) -> str | None:
    """Ein Wellen- oder Glanzbild für offenes Wasser an (x, y), oder None.

    Warum: Einfarbiges Wasser wirkte auf den Autor langweilig (KARTENREGELN 10.4). Nur auf
    Mittelstücken (kein Ufer), fest je Ort gestreut, damit das Bild bei jedem Bau gleich bleibt.
    """
    wellen = art.get("wellen")
    if not wellen or feld != [art["rand"][0] + 1, art["rand"][1] + 1]:
        return None
    wurf = (x * 92821 + y * 68917 + x * y * 31) % 100
    if wurf >= wellen["anteil"]:
        return None
    return wellen["bilder"][(x * 13 + y * 7) % len(wellen["bilder"])]


def flaechen(zeilen: list[str], innen: bool = False) -> dict[tuple[int, int], str]:
    """Wandflächen: die zwei Wandkacheln direkt über einem Boden werden Fläche (oben, unten).

    Innen (``innen``) nur, wo die Wand seitlich an Wand anschließt: Eine einzelne Wandsäule über
    einem Durchgang in einer Nord-Süd-Wand bleibt Krone. Warum: Sonst steckt mitten in der von oben
    gesehenen Trennwand ein Stück Wandfläche mit Fußleiste über dem Durchgang (Gutachten Runde 8,
    Punkt f: Diner zwischen Küche und Lager, Wohnzimmer zur Küche).
    Beispiel: Boden (24, 5), Wand (24, 4) und (24, 3), daneben Boden bei (23, 4) und (25, 4) → keine
    Fläche, die Wand läuft als Krone bis an den Durchgang.
    """
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
    ufer = f"wasser_{szene['ufer']}" if szene.get("ufer") else "wasser"
    # Wandstile mit eigener Krone (Fels, Damm) zeichnen ihre Flächen auch draußen neben „wandart“:
    # Der Rand bleibt dann Boden, nur „#“ über einem Boden wird Hang oder Felswand (10.45).
    flaeche = flaechen(zeilen, szene.get("art") == "innen") if not wandart or "krone" in wand else {}
    # Felskanten und Treppen aus LimeZus Klippenkacheln (Szene „kante“: „klippe“, klippe.py).
    klippe = szene.get("kante") == "klippe"
    gras, klippenart = grasboden(szene), {"bogen": klippenbogen(szene, privat)}
    ueber = brueckenzeichen(szene)  # Holzböden, unter denen das Wasser weiterläuft
    for y, zeile in enumerate(zeilen):
        for x, z in enumerate(zeile):
            ort = (x * K, y * K)
            # Randwände draußen zeigen auch mit Klippen den Boden dahinter (Regel 10.2), sonst wird der
            # Kartenrand zur erdigen Dachfläche (Port Delacroix, Runde 9).
            am_rand = wandart is not None and z == WAND and randnachbar(zeilen, x, y) is not None
            if klippe and not am_rand and (feld := klippenfeld(zeilen, x, y, gras)) is not None:
                if feld[1] == REIHE_RAND:  # Rand der Hochfläche: oben schaut der Boden darüber durch
                    art = boeden[sonder.get(roh[y - 1][x], grund)]
                    bild.alpha_composite(kachel(privat, boegen, art, bodenfeld(art, roh, x, y - 1)), ort)
                bild.alpha_composite(kachel(privat, boegen, klippenart, list(feld)), ort)
                continue
            if z == WASSER:
                # Ufer aus Stein (Szene „ufer“: „stein“, KARTENREGELN 10.6): dieselbe Kachelwahl,
                # gezeichnet aus dem eigenen Bogen; die Randspur rechnet mit LimeZus Wasser.
                feld = bodenfeld(boeden["wasser"], zeilen, x, y, ueber)
                art = boeden[ufer]
                eigen = [art["rand"][i] + feld[i] - boeden["wasser"]["rand"][i] for i in (0, 1)]
                bild.alpha_composite(kachel(privat, boegen, art, eigen), ort)
                if gezeichnet is not None:
                    gezeichnet[(x, y)] = ("wasser", feld)
                if (welle := wellenbild(art, eigen, x, y)) is not None:
                    bild.alpha_composite(Image.open(privat / welle).convert("RGBA"), ort)
            elif z == WAND and wandart and (innen := randnachbar(zeilen, x, y)) is not None:
                # Außen ist der Rand nur Kollision: Er zeigt den Boden dahinter, damit Felder und
                # Wege bis an den Bildrand reichen (Regel 5.1, 6.3; Hinweis von niedrig-1).
                nz = zeilen[innen[1]][innen[0]]
                artname = "wasser" if nz == WASSER else sonder.get(nz, grund)
                art, quelle = boeden[artname], zeilen if nz == WASSER else roh
                feld = bodenfeld(art, quelle, *innen, ueber)
                bild.alpha_composite(kachel(privat, boegen, art, feld), ort)
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
                feld = bodenfeld(art, roh, x, y)
                bild.alpha_composite(kachel(privat, boegen, art, feld), ort)
                if gezeichnet is not None:
                    gezeichnet[(x, y)] = (sonder.get(z, grund), feld)
    if klippe:
        for x, y, feld in treppenfelder(zeilen, strassenzeichen(szene)):
            bild.alpha_composite(kachel(privat, boegen, klippenart, list(feld)), (x * K, y * K))
    elif not wandart and not wand.get("ohne_rand"):  # „ohne_rand“: dunkle Krone im Stollen
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

    for y in range(len(zeilen)):
        for x in range(len(zeilen[0])):
            if not krone(x, y):
                continue
            x0, y0, x1, y1 = x * K, y * K, x * K + K - 1, y * K + K - 1
            if not krone(x, y - 1):
                zeichner.line((x0, y0, x1, y0), fill=KRONENRAND, width=2)
            if not krone(x, y + 1):
                zeichner.line((x0, y1 - 1, x1, y1 - 1), fill=KRONENRAND, width=2)
            if not krone(x - 1, y):
                zeichner.line((x0, y0, x0, y1), fill=KRONENRAND, width=2)
            if not krone(x + 1, y):
                zeichner.line((x1 - 1, y0, x1 - 1, y1), fill=KRONENRAND, width=2)


# Ab so vielen hellen, deckenden Pixeln an der linken, rechten oder oberen Bildkante gilt ein Bild als
# angeschnitten (ein Bauteil eines größeren Möbels); die Unterkante zählt nicht (Schatten am Boden).
ANSCHNITT = 6


def angeschnitten(bild: Image.Image) -> list[str]:
    """Kanten, an denen das Bild angeschnitten wirkt (deckende, helle Pixel statt dunklem Umriss).

    Warum: Viele Einzelbilder von LimeZu sind Teile größerer Möbel (halber Tisch, Regalstück); allein
    gesetzt wirken sie abgeschnitten (Rückmeldung des Autors, 9.11.2026).
    """
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
        if angabe and grauer_schatten(privat, angabe["quelle"]):
            befunde.append(
                f"{eintrag['moebel']} hat den grauen Festschatten: werkzeuge/schatten.py im privaten "
                "Repository laufen lassen (oder die Black_Shadow-Fassung nehmen)"
            )
        if not angabe or eintrag.get("bauteil_ok"):
            continue
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
    Streifen Boden dazwischen (Bildprüfung 9.11.2026); im Raster stand alles richtig.
    """
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


def vorschau(szene: dict, privat: Path, grund: Image.Image) -> Image.Image:
    """Hintergrund mit Möbeln (nach Tiefe) und Figuren von vorn, doppelt vergrößert."""
    moebel = lade_moebel()
    gesetzt, _ = platziere(szene, moebel)
    bild = grund.copy()
    teile = [(s["tiefe"], s["x"], s["y"], moebelbild(privat, moebel[s["name"]]["quelle"])) for s in gesetzt]
    if ist_winter(szene):
        # Wie die App (oberwelt/winter.ts): Möbel ohne Wasserregel, sonst würden blaue Autos dunkel.
        teile = [(t, x, y, winterliche_moebel(b)) for t, x, y, b in teile]
    orte = {o["kennung"]: o for o in lade(INHALTE / "orte.json")["orte"]}
    ort = orte.get(szene["karte"].split(".")[0], {"figuren": []})
    for f in szene.get("figuren", []):
        figur = next((x for x in ort["figuren"] if x["kennung"].split(".", 1)[1] == f["name"]), None)
        sprite = privat / "spiel" / figur["sprite"] if figur else None
        if sprite and sprite.exists():
            teil = Image.open(sprite).convert("RGBA").crop((48, 0, 64, 32))
            x, y = f["feld"][0] * K, f["feld"][1] * K - K
            teile.append((y + K + K // 2, x, y, teil))
    teile += belebungsteile(szene, privat, lambda pfad: Image.open(pfad).convert("RGBA"))
    for _, x, y, teil in sorted(teile, key=lambda t: t[0]):
        bild.alpha_composite(teil, (max(0, x), max(0, y)))
    return bild.resize((bild.width * 2, bild.height * 2), Image.NEAREST)


def randspur(szene: dict, gezeichnet: dict) -> list[str]:
    """Ränder von Wasser und Erdwegen an der fertigen Zeichnung nachziehen (randspur.py), draußen."""
    if szene.get("art") != "aussen":
        return []
    boeden = lade(INHALTE / "materialien.json")["boeden"]
    raender = {name: boeden[name]["rand"] for name in ("wasser", "erde")}
    trennt = {szene.get("boden", "gras"), szene.get("wandart", "hecke")}
    return randluecken(gezeichnet, raender, trennt, frozenset(HOLZ))


def bildname(szene: dict) -> tuple[str, bool]:
    """Name des Bildes und ob es ein Bild für das Spiel ist (sonst nur Vorschau).

    Die Grundkarte heißt „<kennung>“, ein Zustand (``zustaende`` in orte.json, Runde 8)
    „<kennung>-<zustand>“ mit dem Teil des Dateinamens hinter der Grundkarte, wie die App ihn lädt
    (oberwelt/kartenfassung.ts). Varianten (KARTENREGELN 10.37) bekommen nur eine Vorschau
    „…-<variante>“; eine Szene, die weder Grundkarte noch Zustand ist, ebenfalls, damit sie das Bild
    der Grundkarte nicht überschreibt. Beispiel: port-delacroix-musikhaus-neu.json →
    („portDelacroix.musikhaus-neu“, True).
    """
    name = szene["karte"]
    karte = next(
        (k for o in lade(INHALTE / "orte.json")["orte"] for k in o["karten"] if k["kennung"] == name),
        {},
    )
    datei = szene.get("datei", "")
    zustand = datei in karte.get("zustaende", {}).values() and datei != karte.get("datei")
    if zustand:
        name += f"-{zustandsname(datei, karte['datei'])}"
    if szene.get("variante"):
        return f"{name}-{szene['variante']}", False
    return name, zustand or datei == karte.get("datei")


def main() -> None:
    privat, vorschauordner = Path(sys.argv[1]), Path(sys.argv[2])
    vorschauordner.mkdir(parents=True, exist_ok=True)
    (privat / "spiel" / "grafik" / "karten").mkdir(parents=True, exist_ok=True)
    for name in sys.argv[3:]:
        szene = lade(Path(name))
        gezeichnet: dict = {}
        grund = hintergrund(szene, privat, gezeichnet)
        mat = lade(INHALTE / "materialien.json")
        grund = variiere(szene, grund, gezeichnet, mat, lade_kachel(privat, mat["boegen"]))
        markiere(grund, raster(szene), szene)
        if ist_winter(szene):
            grund = winterlich(grund)
        name, spielbild = bildname(szene)
        if spielbild:
            grund.convert("RGB").save(privat / "spiel" / "grafik" / "karten" / f"{name}.png")
        schleier(vorschau(szene, privat, grund), szene.get("toenung")).convert("RGB").save(
            vorschauordner / f"{name}.png"
        )
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

"""Treppenrand: Wo sehen Ufer und Wegränder noch wie Treppen aus? (ohne Pillow) Dazu die Wegenden.

Warum: Die Gutachter sahen „geschwungene“ Wege, die alle zwei, drei Kacheln um eine Kachel
springen, Ufer in Rechteckstufen und Stichwege, die mit runder Kappe im Rasen vor der Tür enden
(Kartenblick 24.11.2026, M03 und M04). Seit ``weichrand.py`` malt der Zeichner die Ränder von
Wasser und Wegen als geglätteten Umriss. Diese Prüfung hält fest, was davon ausgenommen bleibt:

1. **Kacheltreppe:** eine Kante von Wasser, die weiter aus Kacheln gezeichnet wird (Kaimauer,
   eigenes Ufer, ``uferart.weich`` ist falsch) und in ``STUFEN`` oder mehr Stufen von einer Kachel
   Höhe hintereinander springt. Ausnahme ohne Eintrag: Ufer mit Schrägkacheln (``diagonalen``),
   wenn jede Stufe genau eine Kachel lang ist. Wegränder sind immer weich und können hier nicht
   auffallen; die Prüfung stellt das sicher (jede Bodenart mit ``rand`` bekommt einen Auftrag).
2. **Belag an Belag:** zwei verschiedene Böden stoßen aneinander, und keiner zeichnet einen
   Übergang (Saum aus saum.py, Bruchkante aus strassenart.py, Randkacheln oder weicher Rand).
3. **Stichweg** (nur als Hinweis, ``--hinweise``): ein Wegende von höchstens ``STICHBREITE``
   Kacheln ohne Tür, Tor, Haus oder Steg davor. Das ist ein Fehler der Szene, nicht des Zeichners.

Für den Zeichner liefert ``stirnkanten`` die Wegenden, die an Tür oder Tor gerade abschließen.

Ablauf (im Hauptordner): python -m pipeline.abenteuer.treppenrand [--hinweise] [--muster MUSTER]
Dauertest (pipeline/tests): „0 Befunde“; Ausnahmen mit Grund in ``GEPRUEFT``.
"""

import argparse
import re

from pipeline.abenteuer.bodenraster import HOLZ_BOEDEN
from pipeline.abenteuer.kartenbau import INHALTE, WAND, WASSER, K, lade, platziere
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.randzug import SEITEN, umrisse
from pipeline.abenteuer.saum import GLEICHER_BELAG, GRUEN, saumart, uebergangsart
from pipeline.abenteuer.strassenart import RANG
from pipeline.abenteuer.uferart import bodenart, gezeichnetes_raster, uferbogen, weich

# Ab so vielen Stufen von einer Kachel Höhe hintereinander ist eine Kachelkante eine Treppe.
STUFEN = 3
# Ein Wegende bis zu dieser Breite (Kacheln) ist ein Stichweg.
STICHBREITE = 3
# Arten im Katalog, vor denen ein Weg gerade abschließt, und Namen von Toren.
ZIELARTEN = frozenset({"tuer", "gebaeude", "haus", "steg", "treppe", "bruecke"})
TORNAME = re.compile(r"Tor(\d|bogen|Offen|$)")
RICHTUNGEN = tuple(SEITEN)
# Szene → Grund, warum ihre Kacheltreppen bleiben.
GEPRUEFT: dict[str, str] = {
    "weg-summit-crossroads-geysirbecken": (
        "Sinterterrassen am Geysir: Die Stufen der Becken sind die Terrassen selbst (eigener Bogen "
        "„wasser_sinter“ ohne Schrägkacheln)."
    ),
}
# (Bodenart, Bodenart) in Buchstabenfolge → Grund, warum die gerade Kante zwischen ihnen stimmt.
GERADE_RICHTIG: dict[tuple[str, str], str] = {}

Feld = tuple[int, int]


def zielfelder(szene: dict, moebel: dict) -> set[Feld]:
    """Felder, an denen ein Weg ankommt: Fußreihe von Tür, Haus, Steg, Treppe, Tor und die Reihe
    davor, dazu Auslöser und Figuren (wie ``zusammenhang.pruefe_enden``).

    Beispiel: Blockhütte mit Fuß in Reihe 7, Spalten 80 bis 84 → (80, 7) … (84, 8).
    """
    ziele = {tuple(a["feld"]) for a in szene.get("ausloeser", []) + szene.get("figuren", [])}
    for s in platziere(szene, moebel)[0]:
        if moebel.get(s["name"], {}).get("art") in ZIELARTEN or TORNAME.search(s["name"]):
            x0, x1 = s["x"] // K, (s["x"] + s["breite"] - 1) // K
            fuss = (s["y"] + s["hoehe"] - 1) // K
            ziele |= {(x, fuss + d) for x in range(x0, x1 + 1) for d in (0, 1)}
    return ziele


def _freie_kanten(szene: dict, zeilen: list[str]) -> set[tuple[Feld, Feld]]:
    """Kanten (Feld, Richtung) von Sonderböden zum Grundboden oder zur Wand."""
    grund = {".", WAND}
    kanten = set()
    for y, zeile in enumerate(zeilen):
        for x, z in enumerate(zeile):
            if z not in szene.get("boeden", {}) or z == WASSER:
                continue
            for dx, dy in RICHTUNGEN:
                if 0 <= y + dy < len(zeilen) and 0 <= x + dx < len(zeile) and zeilen[y + dy][x + dx] in grund:
                    kanten.add(((x, y), (dx, dy)))
    return kanten


def stirnkanten(szene: dict, moebel: dict) -> set[tuple[Feld, Feld]]:
    """Kanten von Wegfeldern, die an einem Ziel gerade abschließen statt mit runder Kappe.

    Warum: Stichwege zur Hütte endeten als runder Erdfleck im Rasen vor der Tür (M04). Liegt das
    Feld hinter der Kante an einem Ziel, bleibt die Kante gerade und ohne Rand: Der Weg läuft bis
    unter die Schwelle.
    Eingaben: Szene, Katalog (Name → Angabe). Ausgabe: Menge (Feld, Richtung).
    Beispiel: Pfad zur Schutzhütte (Hütten), oberstes Wegfeld unter der Tür → Kante nach oben.
    Sonderfall: Liegt das Wegfeld selbst in der Fußreihe eines Hauses, zählt nur die Kante nach
    oben (unter das Haus), nicht die Seiten.
    """
    ziele = zielfelder(szene, moebel)
    kanten = set()
    for feld, (dx, dy) in _freie_kanten(szene, gezeichnetes_raster(szene)):
        dahinter = (feld[0] + dx, feld[1] + dy)
        if dahinter in ziele or (feld in ziele and (dx, dy) == (0, -1)):
            kanten.add((feld, (dx, dy)))
    return kanten


def _strecken(umriss: list[tuple[Feld, bool]]) -> list[tuple[Feld, int, bool, Feld]]:
    """Der Umriss als Strecken: (Richtung, Länge in Kacheln, ganz fest, Anfangsecke)."""
    strecken: list[tuple[Feld, int, bool, Feld]] = []
    for i, (ecke, fest) in enumerate(umriss):
        ziel = umriss[(i + 1) % len(umriss)][0]
        richtung = (ziel[0] - ecke[0], ziel[1] - ecke[1])
        if strecken and strecken[-1][0] == richtung:
            r, laenge, f, anfang = strecken[-1]
            strecken[-1] = (r, laenge + 1, f and fest, anfang)
        else:
            strecken.append((richtung, 1, fest, ecke))
    if len(strecken) > 1 and strecken[0][0] == strecken[-1][0]:
        r, laenge, f, anfang = strecken.pop()
        strecken[0] = (r, laenge + strecken[0][1], f and strecken[0][2], anfang)
    return strecken


def _drehung(a: Feld, b: Feld) -> int:
    """+1 für eine Rechtsdrehung von Richtung ``a`` nach ``b``, −1 für links (Bild, y nach unten)."""
    return a[0] * b[1] - a[1] * b[0]


def treppen(strecken: list[tuple[Feld, int, bool, Feld]], schraeg: bool) -> list[tuple[Feld, int]]:
    """Treppen in einem Umriss: (Anfangsecke, Zahl der Stufen) für jede Folge fester Strecken, die
    abwechselnd links und rechts abbiegt und ``STUFEN`` oder mehr Stufen von einer Kachel hat.

    Eingaben: Strecken aus ``_strecken``; ``schraeg``: Der Bogen hat Schrägkacheln, eine Treppe
    aus lauter Ein-Kachel-Strecken ist dann gezeichnet und zählt nicht.
    Beispiel: Kaimauer, die dreimal um eine Kachel nach rechts unten springt → [(Ecke, 3)].
    """
    zahl, funde, i = len(strecken), [], 0
    while i < zahl:
        lauf = [strecken[i]]
        while len(lauf) < zahl:
            vor, hier, nach = lauf[-1], strecken[(i + len(lauf)) % zahl], strecken[(i + len(lauf) + 1) % zahl]
            wechsel = len(lauf) < 2 or _drehung(lauf[-2][0], vor[0]) == -_drehung(vor[0], hier[0])
            if not (hier[2] and vor[2] and wechsel and nach is not None):
                break
            lauf.append(hier)
        innen = lauf[1:-1]
        stufen = max(sum(1 for s in innen[p::2] if s[1] == 1) for p in (0, 1)) if innen else 0
        if stufen >= STUFEN and not (schraeg and all(s[1] == 1 for s in innen)):
            funde.append((lauf[0][3], stufen))
        i += max(1, len(lauf) - 1)
    return funde


def kacheltreppen(name: str, szene: dict, boeden: dict) -> list[str]:
    """Befunde zu Punkt 1: Treppen in Uferkanten, die aus Kacheln gezeichnet bleiben."""
    if name in GEPRUEFT:
        return []
    zeilen = gezeichnetes_raster(szene)
    wasser = {(x, y) for y, zeile in enumerate(zeilen) for x, z in enumerate(zeile) if z == WASSER}

    def fest(feld: Feld, richtung: Feld) -> bool:
        nachbar = bodenart(szene, zeilen, feld[0] + richtung[0], feld[1] + richtung[1])
        return not weich(szene, zeilen, *feld) and nachbar is not None and nachbar not in HOLZ_BOEDEN

    befunde = []
    for umriss in umrisse(wasser, fest):
        feld = umriss[0][0]
        bogen = uferbogen(szene, zeilen, min(feld[0], len(zeilen[0]) - 1), min(feld[1], len(zeilen) - 1))
        for ecke, stufen in treppen(_strecken(umriss), bool(boeden.get(bogen, {}).get("diagonalen"))):
            befunde.append(f"{name}: Kacheltreppe am Ufer ab Ecke {ecke}, {stufen} Stufen")
    return befunde


def _uebergang(boeden: dict, a: str, b: str, land: set[str]) -> bool:
    """Ob zwischen den Böden ``a`` und ``b`` ein Übergang gezeichnet wird (oder keiner nötig ist).

    ``land``: Grundboden und Heckenrand der Szene; gegen sie zeigt ein Boden mit ``rand`` seinen
    weichen Rand (weichrand.py), ebenso gegen Gras und was er in ``rand_gegen`` nennt.
    """
    gleich = GLEICHER_BELAG.get(a, a) == GLEICHER_BELAG.get(b, b)
    if gleich or {a, b} & HOLZ_BOEDEN or {a, b} <= GRUEN or (min(a, b), max(a, b)) in GERADE_RICHTIG:
        return True
    if a.startswith("wasser") or b.startswith("wasser"):
        return True  # am Wasser zeichnet das Ufer (uferart.py)
    if any(f(boeden, *paar) for f in (saumart, uebergangsart) for paar in ((a, b), (b, a))):
        return True
    if a in RANG and b in RANG and RANG[a] != RANG[b]:
        return True
    for boden, nachbar in ((a, b), (b, a)):
        angabe = boeden.get(boden, {})
        if "rand" in angabe and nachbar in land | GRUEN | set(angabe.get("rand_gegen", [])):
            return True
    return False


def belagkanten(name: str, szene: dict, boeden: dict) -> list[str]:
    """Befunde zu Punkt 2: gerade Kanten zwischen zwei Böden ohne Übergang (je Paar einmal)."""
    zeilen = gezeichnetes_raster(szene)
    land = {szene.get("boden", "gras"), szene.get("wandart", "hecke")}
    gemeldet: dict[tuple[str, str], Feld] = {}
    for y, zeile in enumerate(zeilen):
        for x in range(len(zeile)):
            a = bodenart(szene, zeilen, x, y)
            for dx, dy in ((1, 0), (0, 1)):
                b = bodenart(szene, zeilen, x + dx, y + dy)
                if a is None or b is None or _uebergang(boeden, a, b, land):
                    continue
                gemeldet.setdefault((min(a, b), max(a, b)), (x, y))
    return [f"{name}: {a} stößt bei {feld} ohne Übergang an {b}" for (a, b), feld in sorted(gemeldet.items())]


# Laufrichtung einer Kante → (Richtung zum Nachbarn außen, Lage der Anfangsecke im Feld).
KANTENLAGE = {(bis[0] - von[0], bis[1] - von[1]): (nach, von) for nach, (von, bis) in SEITEN.items()}


def stichwege(name: str, szene: dict, moebel: dict, boeden: dict) -> list[str]:
    """Hinweise zu Punkt 3: Wegenden ohne Ziel (Kappe im Rasen); nur Böden mit Randkacheln."""
    zeilen = gezeichnetes_raster(szene)
    stirn, frei, hinweise = stirnkanten(szene, moebel), _freie_kanten(szene, zeilen), []
    wege = sorted(z for z, art in szene.get("boeden", {}).items() if "rand" in boeden.get(art, {}))
    for zeichen in wege:
        felder = {(x, y) for y, zeile in enumerate(zeilen) for x, z in enumerate(zeile) if z == zeichen}
        for umriss in umrisse(felder, lambda f, r: (f, r) not in frei):
            strecken = _strecken(umriss)
            for i, (richtung, laenge, fest, ecke) in enumerate(strecken):
                davor, danach = strecken[i - 1], strecken[(i + 1) % len(strecken)]
                kappe = _drehung(davor[0], richtung) == 1 == _drehung(richtung, danach[0])
                lang = min(davor[1], danach[1]) >= 2 and not davor[2] and not danach[2]
                nach, lage = KANTENLAGE[richtung]
                feld = (ecke[0] - lage[0], ecke[1] - lage[1])
                if kappe and lang and not fest and laenge <= STICHBREITE and (feld, nach) not in stirn:
                    hinweise.append(f"{name}: Weg „{zeichen}“ endet bei {feld} ohne Ziel (Kappe im Rasen)")
    return hinweise


def befunde(name: str, szene: dict, boeden: dict) -> list[str]:
    """Alle Befunde einer Szene (Kacheltreppen, Belag an Belag); nur Außenkarten.

    Beispiel: Hütten am Long Ridge Trail → []: Weg und Bach sind weich, Erde hat Randkacheln.
    """
    if szene.get("art") != "aussen":
        return []
    return kacheltreppen(name, szene, boeden) + belagkanten(name, szene, boeden)


def alle_befunde(muster: str = "*.json", hinweise: bool = False) -> list[str]:
    """Befunde (oder mit ``hinweise`` die Stichwege) aller Szenen, deren Name auf ``muster`` passt."""
    boeden, moebel, meldungen = lade(INHALTE / "materialien.json")["boeden"], lade_moebel(), []
    for pfad in sorted((INHALTE / "szenen").glob(muster)):
        szene = lade(pfad)
        if hinweise and szene.get("art") == "aussen":
            meldungen += stichwege(pfad.stem, szene, moebel, boeden)
        elif not hinweise:
            meldungen += befunde(pfad.stem, szene, boeden)
    return meldungen


def main() -> None:
    eingabe = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    eingabe.add_argument("--hinweise", action="store_true", help="auch Stichwege ohne Ziel nennen")
    eingabe.add_argument("--muster", default="*.json", help="Dateimuster der Szenen")
    wahl = eingabe.parse_args()
    meldungen = alle_befunde(wahl.muster)
    for meldung in meldungen:
        print(f"- {meldung}")
    if wahl.hinweise:
        offen = alle_befunde(wahl.muster, hinweise=True)
        for hinweis in offen:
            print(f"  Hinweis: {hinweis}")
        print(f"{len(offen)} Hinweise (Stichwege, Sache der Szenen)")
    for szene, grund in sorted(GEPRUEFT.items()):
        print(f"Ausnahme {szene}: {grund}")
    print(f"{len(meldungen)} Befunde")


if __name__ == "__main__":
    main()

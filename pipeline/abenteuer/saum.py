"""Säume an Bodenkanten: Randstein, Bankett und weicher Rand (Rückmeldung R041, R042, R049).

Warum: Der Autor sah befestigte Flächen (Flohmarktplatz, Pflaster am Flussweg), die mit einer
nackten geraden Kante im Gras enden: „als wäre das Boden-Asset auf das Gras geklebt“. Der Erdweg
hat dafür Randkacheln, Pflaster, Platten, Asphalt, Stein, Sand und Schotter haben keine. Statt je
Material einen Kachelbogen zu malen, zeichnet dieses Modul den Saum ins fertige Bodenbild.

Rolle im Gesamtbild: ``kartenbild.main`` ruft ``saeume`` nach der Bodenvariation auf. Welcher Boden
welchen Saum bekommt, steht in ``materialien.json`` (``"saum"``):

- ``randstein``: Reihe heller Kantensteine mit Fugen (Pflaster, Platten, Stein).
- ``bankett``: dunkler, ausgefranster Streifen ohne Bordstein (Asphalt der Landstraße).
- ``weich``: Der Nachbarboden greift unregelmäßig ein bis drei Pixel herein (Sand, Schotter, Fels).

Gezeichnet wird nur an Kanten zu Naturboden (``NATUR``; für ``weich`` nur zu Gras), nie zu Wasser
(das hat sein Ufer), zu Wänden oder zu anderem befestigtem Boden. ``saumbefunde`` meldet im
Kartenbau Böden, die an Gras grenzen und weder Randkacheln noch einen Saum haben.
"""

K = 16
# Naturböden, gegen die ein befestigter Boden einen Saum zeigt.
NATUR = frozenset(
    {"gras", "hecke", "erde", "sand", "strand", "sandRot", "sandRotRand", "erdeRot", "sumpfboden"}
)
# Gras und seine Verwandten: Nur dagegen bekommt Naturboden (Sand, Schotter) seinen weichen Rand.
GRUEN = frozenset({"gras", "hecke"})
ARTEN = ("randstein", "bankett", "weich")
# Holzböden draußen sind Stege und Brücken mit eigener Kante (wie bodenraster.HOLZ_BOEDEN; dort
# nicht importiert, weil bodenraster den Kartenbau lädt und der dieses Modul).
HOLZ_BOEDEN = frozenset({"dielen", "holzDunkel", "holzHell"})
# Randstein: Breite in Pixeln, Abstand der Fugen, Farben (Schattenfuge außen, Stein, Glanzkante).
STEIN_BREITE, FUGE = 3, 8
STEIN_DUNKEL, STEIN, STEIN_HELL = (96, 92, 96, 255), (176, 172, 168, 255), (204, 200, 194, 255)
# Bankett: Breite und Abdunklung des Streifens.
BANKETT_BREITE, ABDUNKELN = 2, 0.8
# Weicher Rand: so tief greift der Nachbarboden höchstens herein.
WEICH_TIEFE = 3
RICHTUNGEN = ((0, -1), (0, 1), (-1, 0), (1, 0))


def _zufall(x: int, y: int) -> int:
    """Fester Zufall je Pixel (0 bis 255), damit das Bild bei jedem Bau gleich bleibt."""
    wert = (x * 374761393 + y * 668265263) & 0xFFFFFFFF
    wert = ((wert ^ (wert >> 13)) * 1274126177) & 0xFFFFFFFF
    return (wert ^ (wert >> 16)) & 0xFF


def saumart(boeden: dict, art: str, nachbar: str | None) -> str | None:
    """Welcher Saum an der Kante von ``art`` zu ``nachbar`` gezeichnet wird, oder None.

    Eingaben: Böden aus materialien.json, Name des Bodens und des Nachbarbodens (None: kein Boden,
    etwa Felswand oder Kartenrand). Beispiel: „pflaster“ neben „gras“ → „randstein“; „pflaster“
    neben „asphalt“ → None; „sand“ neben „erde“ → None (weich nur gegen Gras).
    """
    saum = boeden.get(art, {}).get("saum")
    if saum is None or nachbar is None or nachbar == art:
        return None
    if saum == "weich":
        return saum if nachbar in GRUEN else None
    return saum if nachbar in NATUR else None


def _pixel(x: int, y: int, dx: int, dy: int, tiefe: int, laengs: int) -> tuple[int, int]:
    """Pixel im Feld (x, y): ``tiefe`` Pixel von der Kante in Richtung (dx, dy) nach innen,
    ``laengs`` Pixel entlang der Kante."""
    if dx:
        return (x * K + (K - 1 - tiefe if dx > 0 else tiefe), y * K + laengs)
    return (x * K + laengs, y * K + (K - 1 - tiefe if dy > 0 else tiefe))


def _randstein(px, x: int, y: int, dx: int, dy: int) -> None:
    """Kantensteine: außen eine dunkle Fuge, dann Stein; unten und rechts die Glanzkante innen."""
    for laengs in range(K):
        welt = (x if dy else y) * K + laengs
        for tiefe, farbe in enumerate((STEIN_DUNKEL, STEIN, STEIN_HELL)[:STEIN_BREITE]):
            if tiefe and welt % FUGE == 0:
                farbe = STEIN_DUNKEL
            px[_pixel(x, y, dx, dy, tiefe, laengs)] = farbe


def _bankett(px, x: int, y: int, dx: int, dy: int) -> None:
    """Bankett: Der Asphalt wird am Rand dunkler; außen bricht er unregelmäßig aus."""
    for laengs in range(K):
        for tiefe in range(BANKETT_BREITE):
            ort = _pixel(x, y, dx, dy, tiefe, laengs)
            if tiefe == 0 and _zufall(*ort) < 96:
                px[ort] = px[_pixel(x + dx, y + dy, -dx, -dy, 0, laengs)]
            else:
                r, g, b, a = px[ort]
                px[ort] = (int(r * ABDUNKELN), int(g * ABDUNKELN), int(b * ABDUNKELN), a)


def _weich(px, x: int, y: int, dx: int, dy: int) -> None:
    """Weicher Rand: Der Nachbarboden greift je Pixel der Kante null bis drei Pixel herein."""
    for laengs in range(K):
        welt = ((x if dy else y) * K + laengs) // 2  # je zwei Pixel dieselbe Tiefe: Büschel
        reihe = y * K if dy else x * K
        for tiefe in range(_zufall(welt, reihe + 7 * (dx + 2 * dy)) % (WEICH_TIEFE + 1)):
            px[_pixel(x, y, dx, dy, tiefe, laengs)] = px[_pixel(x + dx, y + dy, -dx, -dy, tiefe, laengs)]


ZEICHNER = {"randstein": _randstein, "bankett": _bankett, "weich": _weich}


def saeume(bild, gezeichnet: dict, boeden: dict, ohne: frozenset = frozenset()) -> int:
    """Zeichnet alle Säume ins Bodenbild und gibt die Zahl der gezeichneten Kanten zurück.

    Eingaben: ``bild`` (Pillow, K Pixel je Feld), ``gezeichnet`` aus ``kartenbild.hintergrund``
    (Feld → (Bodenart, Kachel)), Böden aus materialien.json, ``ohne``: Felder, die ausgelassen
    werden (Quadrate runder Kehren, dort zeichnet kehren.py den Rand).
    Beispiel: Flohmarktplatz aus Pflaster im Gras → ringsum eine Reihe Kantensteine.
    Sonderfall: Felder ohne Eintrag in ``gezeichnet`` (Felswand, Klippe) sind kein Nachbar.
    """
    px, kanten = bild.load(), 0
    # Erst die weichen Ränder, dann Bankett, zuletzt Randsteine: Steine liegen obenauf.
    for art_saum in ("weich", "bankett", "randstein"):
        for (x, y), (art, _) in gezeichnet.items():
            if (x, y) in ohne:
                continue
            for dx, dy in RICHTUNGEN:
                nachbar = gezeichnet.get((x + dx, y + dy), (None, None))[0]
                if saumart(boeden, art, nachbar) == art_saum:
                    ZEICHNER[art_saum](px, x, y, dx, dy)
                    kanten += 1
    return kanten


def saumbefunde(szene: dict, zeilen: list[str], boeden: dict) -> list[str]:
    """Befunde für den Kartenbau: Böden, die mit nackter Kante an Gras grenzen (Regel 10.72).

    Ein Boden ist in Ordnung, wenn er Randkacheln hat (``rand``) oder einen Saum (``saum``). Geprüft
    werden nur Außenkarten mit Gras als Grundboden. Beispiel: ein neuer Boden „beton“ ohne ``saum``
    neben „.“ → „Boden beton („b“) endet bei (12, 7) mit nackter Kante im Gras“ (einmal je Boden).
    """
    if szene.get("art") != "aussen" or szene.get("boden", "gras") != "gras":
        return []
    arten = {".": "gras", **szene.get("boeden", {})}
    befunde, gemeldet = [], set()
    for y, zeile in enumerate(zeilen):
        for x, zeichen in enumerate(zeile):
            art = arten.get(zeichen)
            if art is None or art in GRUEN | HOLZ_BOEDEN or art in gemeldet or art.startswith("wasser"):
                continue
            angabe = boeden.get(art, {})
            if "rand" in angabe or angabe.get("saum") in ARTEN:
                continue
            for dx, dy in RICHTUNGEN:
                nx, ny = x + dx, y + dy
                if 0 <= ny < len(zeilen) and 0 <= nx < len(zeile) and arten.get(zeilen[ny][nx]) == "gras":
                    befunde.append(
                        f"Boden {art} („{zeichen}“) endet bei ({x}, {y}) mit nackter Kante im Gras: "
                        "in materialien.json „saum“ oder Randkacheln ergänzen (Regel 10.72)"
                    )
                    gemeldet.add(art)
                    break
    return befunde

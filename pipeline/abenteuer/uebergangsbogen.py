"""Kontaktbögen der Übergänge: beide Seiten jedes Übergangs als Ausschnitt nebeneinander.

Warum: Reine Datenregeln sehen nicht alles (Wunsch des Autors, 14.11.2026, KARTENREGELN 10.77).
Ob eine Tür wie eine Tür aussieht, ob die Treppe im Bild nach unten führt und ob die Holztür innen
zum Backsteinhaus außen passt, sieht man am Bild. Je Übergang zeigt der Bogen einen Ausschnitt von
FENSTER × FENSTER Kacheln um den Auslöser auf beiden Karten, vierfach vergrößert, mit roten Rahmen
um die Felder des Auslösers und einer Beschriftung (Karte, Auslöser, Ziel, erwartete und erkannte
Art). Gezeichnet wird die Vorschau mit Möbeln auf dem Hintergrund aus dem privaten Paket
(``spiel/grafik/karten/<kennung>.png``); ohne privates Paket gibt es keine Bögen.

Aufruf: ``python -m pipeline.abenteuer.uebergangsbilder --boegen ORDNER [--ort KENNUNG]``.
"""

from pathlib import Path

from PIL import Image, ImageDraw

from pipeline.abenteuer.kartenbau import HAUPT, K
from pipeline.abenteuer.uebergangsarten import Seite, erwartet, paare

# Vorgabe für das private Paket: neben dem Repository (/home/user/schach-abenteuer-inhalte neben
# /home/user/SvGa_Public); aus einer Arbeitskopie heraus mit --privat PFAD angeben.
PRIVAT = HAUPT.parent / "schach-abenteuer-inhalte"
FENSTER = 7
# Die Vorschau ist schon doppelt groß; noch einmal verdoppelt ergibt das Vierfache.
VORSCHAU = 2
ZOOM = 2
PAARE_JE_BOGEN = 6
SCHRIFT = 14
RAND = 8
ROT = (230, 40, 40, 255)
GRUND = (30, 30, 36, 255)
WEISS = (240, 240, 240, 255)


def kartenbild(szene: dict, privat: Path, zwischen: dict) -> Image.Image | None:
    """Vorschau einer Karte (mit Möbeln und Figuren), einmal je Karte gezeichnet."""
    from pipeline.abenteuer.kartenbild import vorschau
    from pipeline.abenteuer.zustaende import bildname

    name = bildname(szene)[0]
    if name not in zwischen:
        pfad = privat / "spiel" / "grafik" / "karten" / f"{name}.png"
        zwischen[name] = vorschau(szene, privat, Image.open(pfad).convert("RGBA")) if pfad.exists() else None
    return zwischen[name]


def ausschnitt(seite: Seite, bild: Image.Image | None) -> Image.Image:
    """FENSTER × FENSTER Kacheln um die Mitte des Auslösers, vergrößert, Auslöserfelder rot umrandet."""
    seitenlaenge = FENSTER * K * VORSCHAU
    if bild is None:
        return Image.new("RGBA", (seitenlaenge * ZOOM, seitenlaenge * ZOOM), GRUND)
    mx, my = seite.mitte
    x0 = int(mx - FENSTER // 2) * K * VORSCHAU
    y0 = int(my - FENSTER // 2) * K * VORSCHAU
    teil = Image.new("RGBA", (seitenlaenge, seitenlaenge), GRUND)
    teil.alpha_composite(bild.crop((x0, y0, x0 + seitenlaenge, y0 + seitenlaenge)).convert("RGBA"))
    zeichner = ImageDraw.Draw(teil)
    for fx, fy in seite.felder:
        a, b = (fx * K * VORSCHAU - x0, fy * K * VORSCHAU - y0)
        zeichner.rectangle((a, b, a + K * VORSCHAU - 1, b + K * VORSCHAU - 1), outline=ROT, width=1)
    return teil.resize((seitenlaenge * ZOOM, seitenlaenge * ZOOM), Image.NEAREST)


def beschriftung(seite: Seite | None, gegen: Seite | None, reise: bool) -> list[str]:
    """Zeilen unter einem Ausschnitt: Karte und Auslöser, Ziel, erwartete und erkannte Art."""
    if seite is None:
        return ["(keine Szene oder kein Auslöser)"]
    moebel = ", ".join(sorted({f"{s['name']}={a}" for s, _, a in seite.moebel})) or "-"
    return [
        f"{seite.karte} · {seite.name} {seite.felder[0]}",
        f"-> {gegen.karte + ' · ' + gegen.name if gegen else '?'}",
        f"erwartet {erwartet(seite, gegen, reise)}, erkannt {', '.join(sorted(seite.bildarten())) or '-'}",
        moebel[:70],
    ]


def paarbild(seite: Seite, gegen: Seite | None, reise: bool, privat: Path, zwischen: dict) -> Image.Image:
    """Beide Seiten eines Übergangs nebeneinander mit Beschriftung."""
    links = ausschnitt(seite, kartenbild(seite.szene, privat, zwischen))
    rechts = ausschnitt(gegen, kartenbild(gegen.szene, privat, zwischen)) if gegen else None
    breite = links.width
    hoehe = links.height + 4 * (SCHRIFT + 2) + RAND
    bild = Image.new("RGBA", (2 * breite + 3 * RAND, hoehe + RAND), GRUND)
    zeichner = ImageDraw.Draw(bild)
    for nummer, (teil, zeilen) in enumerate(
        ((links, beschriftung(seite, gegen, reise)), (rechts, beschriftung(gegen, seite, reise)))
    ):
        x = RAND + nummer * (breite + RAND)
        if teil is not None:
            bild.alpha_composite(teil, (x, RAND))
        for i, zeile in enumerate(zeilen):
            zeichner.text((x, RAND + links.height + 2 + i * (SCHRIFT + 2)), zeile, fill=WEISS)
    return bild


def kontaktboegen(ziel: Path, ort: str | None = None, privat: Path = PRIVAT) -> list[Path]:
    """Alle Übergänge (oder die eines Orts) als Bögen mit je PAARE_JE_BOGEN Paaren.

    Ausgabe: die Pfade der Bögen ``ziel/uebergaenge-01.png`` …; leer ohne privates Paket.
    """
    from pipeline.abenteuer.moebelliste import lade_moebel
    from pipeline.abenteuer.uebergaenge import szenen, uebergaenge

    if not (privat / "spiel").exists():
        return []
    ziel.mkdir(parents=True, exist_ok=True)
    liste = [
        p
        for p in paare(szenen(), uebergaenge(), lade_moebel())
        if ort is None or ort in (p[0].karte.split(".")[0], p[1].karte.split(".")[0] if p[1] else "")
    ]
    zwischen: dict = {}
    pfade = []
    for start in range(0, len(liste), PAARE_JE_BOGEN):
        bilder = [paarbild(s, g, r, privat, zwischen) for s, g, r in liste[start : start + PAARE_JE_BOGEN]]
        bogen = Image.new("RGBA", (bilder[0].width, sum(b.height for b in bilder)), GRUND)
        y = 0
        for b in bilder:
            bogen.alpha_composite(b, (0, y))
            y += b.height
        pfad = ziel / f"uebergaenge-{start // PAARE_JE_BOGEN + 1:02d}{'-' + ort if ort else ''}.png"
        bogen.convert("RGB").save(pfad)
        pfade.append(pfad)
    return pfade

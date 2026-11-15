"""Lage am Tisch (KARTENREGELN 10.79): Bretter mittig, Uhr daneben, Hocker an der Theke, Stühle mittig.

Warum: Rückmeldungen des Autors zur Ausrichtungsrunde (15.11.2026): „Bretter mittig auf die Tische“
(Pavillon Riverton, Summit-Hütte), „Bretter nicht ganz auf dem Tresen, Hocker zu weit weg vom
Tresen“ (Raststätte Crossroads), „Stühle mittig vor die Bildschirme“ (Akademie Silicon Bay), dazu
allgemein „Schachuhr seitlich neben dem Brett“ und „Tische mittig zwischen Stühlen“.

Grundlage ist die Katalogangabe ``platte`` eines Tischs: das Rechteck der Tischplatte im Bild in
Pixeln ``[links, oben, rechts, unten]`` (rechts und unten ausschließlich). Ein Tisch aus mehreren
Bildern (Langtisch aus Anfang, Mittelstücken und Ende) zählt als eine Platte, wenn die Platten
lückenlos nebeneinanderliegen. Für Hocker und Stühle zählt die deckende Fläche der Bilder; ohne
privates Grafikpaket das ganze Bild (dann meldet die Prüfung eher zu wenig als zu viel).

Regeln (keine nennt eine Karte):
1. Platte: Brett und Schachuhr auf einem Tisch, Tresen oder Schreibtisch liegen ganz auf der Platte.
   Ein solcher Tisch ohne ``platte`` ist ein Befund (die Prüfung kann ihn sonst nicht messen).
2. Brett mittig: Liegen n Bretter auf einer Platte, teilt die Platte sich längs in n gleiche Plätze;
   jedes Brett liegt (allein oder zusammen mit seiner Uhr) höchstens TOLERANZ Pixel neben der Mitte.
3. Uhr: Eine Schachuhr liegt direkt neben einem Brett (Lücke 0 bis LUECKE_UHR): seitlich auf gleicher
   Höhe oder davor bzw. dahinter in derselben Spalte (welche Seite, prüft anordnung.py mit den Stühlen).
4. Hocker: Ein Hocker an Tisch oder Theke steht direkt daran (vorn an der Vorderkante, hinten verdeckt
   der Tisch den Fuß, seitlich höchstens LUECKE_SEITE Pixel).
5. Stühle (mit ``zu``): Stühle links und rechts eines Tischs haben gleichen Abstand (der Tisch steht
   mittig), keiner steht weiter als LUECKE_STUHL weg; Stühle oben und unten stehen mittig vor ihrem
   Platz (n Stühle auf einer Seite: n gleiche Plätze, ``plaetze`` aus dem Katalog wie die zwei
   Bildschirme des Bildschirmtischs; passen die Stühle nicht in gleiche Plätze, stehen sie
   nebeneinander mittig vor dem Tisch).

Aufruf: ``python -m pipeline.abenteuer.tischlage [--ort KENNUNG] [--privat PFAD]`` (alle Grundkarten
oder die eines Orts). Im Kartenbau als Befund „Tischlage:“.
"""

import sys
from pathlib import Path

from pipeline.abenteuer.ausrichtung_teile import Befund
from pipeline.abenteuer.kartenbau import K
from pipeline.abenteuer.tischlage_teile import (
    BESTAND,
    BRETT,
    HOCKER,
    UHR,
    Rechteck,
    Stueck,
    _sitzplaetze,
    ist_tisch,
    mitte,
    plaetze,
    stuecke_der_szene,
    tischgruppen,
    vereinige,
)

# Abweichung von der Mitte, die das Auge nicht sieht (Pixel).
TOLERANZ = 2
# Überstand über den Rand der Platte, der nicht auffällt (durchsichtiger Bildrand, Pixel).
UEBERSTAND = 1
LUECKE_UHR = 3
# Hocker stehen seitlich höchstens so weit (Pixel) von Tisch oder Theke; vorn berühren sie die
# Vorderkante (Lücke höchstens LUECKE_VORN, wie die vier Hocker im Gasthaus Lockport, vom Autor
# abgenommen); hinten steckt ihr Fuß mindestens VERDECKT_HINTEN Pixel hinter der Oberkante der Platte.
LUECKE_SEITE = 3
# Hocker bis zu so vielen Kacheln Abstand der Fußflächen gehören zu Tisch oder Theke (ohne oberste Reihe).
NAH = 2
LUECKE_VORN = 1
# Vor einem Tisch mit Beinen beginnt die Sitzfläche so weit unter der Vorderkante der Platte.
UNTER_PLATTE = 3
VERDECKT_HINTEN = 2
# Stühle links und rechts eines Tischs: höchstens so weit weg (die Sitzfläche steht vor der Lehne;
# 5 Pixel an den Rundtischen im Gasthaus Lockport hat der Autor abgenommen).
LUECKE_STUHL = 6


def _befund(szene: dict, st: Stueck, text: str, vorschlag: str = "") -> Befund:
    return Befund(szene["karte"], st.name, st.feld, text, vorschlag)


def pruefe_auflagen(szene: dict, stuecke: list[Stueck]) -> list[Befund]:
    """Regeln 1 bis 3: Bretter und Uhren auf Tischen."""
    nach_id = {st.s["id"]: st for st in stuecke}
    gruppen = tischgruppen(stuecke)
    befunde = []
    auf_tisch: dict[int, list[Stueck]] = {}
    for st in stuecke:
        if not (BRETT.match(st.datei) or UHR.match(st.datei)) or "auf" not in st.eintrag:
            continue
        basis = nach_id.get(st.eintrag["auf"])
        if basis is None or not ist_tisch(basis):
            continue
        if not basis.platte:
            befunde.append(_befund(szene, basis, "Tisch ohne Katalogangabe platte (Regel 10.79)"))
            continue
        nummer = next(i for i, g in enumerate(gruppen) if basis in g)
        auf_tisch.setdefault(nummer, []).append(st)
    for nummer, liegend in auf_tisch.items():
        platte = vereinige([t.platte for t in gruppen[nummer]])
        befunde += _pruefe_platte(szene, platte, liegend)
    return befunde


def _pruefe_platte(szene: dict, platte: Rechteck, liegend: list[Stueck]) -> list[Befund]:
    """Alles liegt auf der Platte, Bretter mittig auf ihrem Platz, Uhren neben einem Brett."""
    befunde = []
    for st in liegend:
        r = st.rahmen
        if (
            r[0] < platte[0] - UEBERSTAND
            or r[1] < platte[1] - UEBERSTAND
            or r[2] > platte[2] + UEBERSTAND
            or r[3] > platte[3] + UEBERSTAND
        ):
            befunde.append(_befund(szene, st, "liegt nicht ganz auf der Tischplatte"))
    bretter = sorted((st for st in liegend if BRETT.match(st.datei)), key=lambda st: mitte(st.rahmen))
    uhren = [st for st in liegend if UHR.match(st.datei)]
    for brett, platz in zip(bretter, plaetze(platte, len(bretter)) if bretter else [], strict=True):
        befunde += _brett_mittig(szene, brett, platz, uhren)
    for uhr in uhren:
        befunde += _uhr_daneben(szene, uhr, bretter, platte)
    return befunde


def _brett_mittig(
    szene: dict, brett: Stueck, platz: tuple[float, float], uhren: list[Stueck]
) -> list[Befund]:
    """Regel 2: Brett (oder Brett mit seiner Uhr) mittig auf seinem Platz."""
    kandidaten = [brett.rahmen] + [
        vereinige([brett.rahmen, u.rahmen]) for u in uhren if _neben(u.rahmen, brett.rahmen)
    ]
    for r in kandidaten:
        mx, my = mitte(r)
        if abs(mx - platz[0]) <= TOLERANZ and abs(my - platz[1]) <= TOLERANZ:
            return []
    mx, my = mitte(brett.rahmen)
    dx, dy = platz[0] - mx, platz[1] - my
    text = f"liegt nicht mittig auf dem Tisch ({dx:+.0f}, {dy:+.0f} Pixel zur Mitte)"
    return [_befund(szene, brett, text, brett.versatz_plus(dx, dy))]


def _neben(uhr: Rechteck, brett: Rechteck) -> bool:
    """Liegt die Uhr direkt am Brett, seitlich (gleiche Höhe) oder davor bzw. dahinter (gleiche Spalte),
    mit einer Lücke von 0 bis LUECKE_UHR? Welche Seite für die Spieler „neben“ ist, hängt davon ab, wo
    sie sitzen: An einem Tisch mit Stühlen links und rechts liegt die Uhr hinter oder vor dem Brett
    (Kartennotiz des Autors 15.11.2026, Clubraum Maple Falls: „Jetzt steht die Uhr genau vorm Brett aus
    der Perspektive eines der Stühle“); das prüft ``anordnung.py`` (Regel 10.80) mit den Stühlen."""
    gleich_hoch = abs(mitte(uhr)[1] - mitte(brett)[1]) <= TOLERANZ + 1
    luecke = max(uhr[0] - brett[2], brett[0] - uhr[2])
    gleiche_spalte = abs(mitte(uhr)[0] - mitte(brett)[0]) <= TOLERANZ + 1
    luecke_senkrecht = max(uhr[1] - brett[3], brett[1] - uhr[3])
    return (gleich_hoch and 0 <= luecke <= LUECKE_UHR) or (
        gleiche_spalte and 0 <= luecke_senkrecht <= LUECKE_UHR
    )


def _uhr_daneben(szene: dict, uhr: Stueck, bretter: list[Stueck], platte: Rechteck) -> list[Befund]:
    """Regel 3: Die Uhr liegt seitlich neben einem Brett derselben Platte."""
    if any(_neben(uhr.rahmen, b.rahmen) for b in bretter):
        return []
    if not bretter:
        return [_befund(szene, uhr, "Schachuhr ohne Brett auf demselben Tisch")]
    brett = min(bretter, key=lambda b: abs(mitte(b.rahmen)[0] - mitte(uhr.rahmen)[0]))
    b, u = brett.rahmen, uhr.rahmen
    breite = u[2] - u[0]
    ziel_x = b[2] + 1 if b[2] + 1 + breite <= platte[2] else b[0] - 1 - breite
    ziel_y = mitte(b)[1] - (u[3] - u[1]) / 2
    return [
        _befund(
            szene, uhr, "liegt nicht seitlich neben dem Brett", uhr.versatz_plus(ziel_x - u[0], ziel_y - u[1])
        )
    ]


def seite(sitz: Rechteck, tisch: Rechteck) -> str | None:
    """Seite des Tischs (oben, unten, links, rechts), an der ein Sitz steht; None bei schräg."""
    mx, my = mitte(sitz)
    if tisch[0] <= mx <= tisch[2]:
        return "unten" if my > mitte(tisch)[1] else "oben"
    if tisch[1] - K <= my <= tisch[3] + K:
        return "rechts" if mx > mitte(tisch)[0] else "links"
    return None


def pruefe_hocker(szene: dict, stuecke: list[Stueck]) -> list[Befund]:
    """Regel 4: Hocker an Tisch, Tresen oder Theke stehen direkt daran."""
    tische = [t for t in stuecke if ist_tisch(t) and "auf" not in t.eintrag]
    befunde = []
    for hocker in (st for st in stuecke if HOCKER.search(st.name) and st.angabe.get("art") == "stuhl"):
        nah = [t for t in tische if _kachelabstand(hocker, t) <= NAH]
        if not nah:
            continue
        # Bei einem Langtisch das Stück, vor dem der Hocker steht (Mitte über dessen Breite).
        mx = mitte(hocker.deckend)[0]
        tisch = min(nah, key=lambda t: (not t.rahmen[0] <= mx < t.rahmen[2], _kachelabstand(hocker, t)))
        befunde += _hocker_am_tisch(szene, hocker, tisch)
    return befunde


def _kachelabstand(a: Stueck, b: Stueck) -> int:
    from pipeline.abenteuer.kartenregeln import _felder

    fa, fb = _felder(a.s), _felder(b.s)
    return max(0, fb[0] - fa[2], fa[0] - fb[2], fb[1] - fa[3], fa[1] - fb[3])


def _hocker_am_tisch(szene: dict, hocker: Stueck, tisch: Stueck) -> list[Befund]:
    """Abstand eines Hockers zur Vorder-, Hinter- oder Seitenkante, mit Vorschlag."""
    h = hocker.deckend
    t = tisch.deckend
    oben = tisch.platte[1] if tisch.platte else t[1]
    lage = seite(h, t)
    # Vorderkante: bei Tischen mit Beinen die Kante der Platte, bei Theken die Unterkante des Bilds.
    vorn = tisch.platte[3] + UNTER_PLATTE if tisch.platte else t[3]
    if lage == "unten" and h[1] > vorn + LUECKE_VORN:
        text = f"steht {h[1] - vorn:+.0f} Pixel vor der Vorderkante von {tisch.name}"
        return [_befund(szene, hocker, text, hocker.versatz_plus(0, vorn - h[1]))]
    if lage == "oben" and h[3] < oben + VERDECKT_HINTEN:
        dy = oben + VERDECKT_HINTEN - h[3]
        return [
            _befund(
                szene,
                hocker,
                f"steht {oben - h[3]:.0f} Pixel hinter {tisch.name}",
                hocker.versatz_plus(0, dy),
            )
        ]
    if lage in ("links", "rechts"):
        luecke = t[0] - h[2] if lage == "links" else h[0] - t[2]
        if luecke > LUECKE_SEITE:
            dx = luecke if lage == "links" else -luecke
            return [
                _befund(
                    szene, hocker, f"steht {luecke:.0f} Pixel neben {tisch.name}", hocker.versatz_plus(dx, 0)
                )
            ]
    return []


def pruefe_stuehle(szene: dict, stuecke: list[Stueck]) -> list[Befund]:
    """Regel 5: Stühle links und rechts gleich weit weg, oben und unten mittig vor ihrem Platz."""
    nach_id = {st.s["id"]: st for st in stuecke}
    je_tisch: dict[str, list[Stueck]] = {}
    for st in stuecke:
        if st.angabe.get("art") != "stuhl" or HOCKER.search(st.name) or "auf" in st.eintrag:
            continue
        tisch = nach_id.get(st.eintrag.get("zu", ""))
        if tisch is None or not tisch.platte:
            continue
        je_tisch.setdefault(tisch.s["id"], []).append(st)
    befunde = []
    for kennung, stuehle in je_tisch.items():
        befunde += _stuehle_am_tisch(szene, nach_id[kennung], stuehle)
    return befunde


def _stuehle_am_tisch(szene: dict, tisch: Stueck, stuehle: list[Stueck]) -> list[Befund]:
    t, platte = tisch.deckend, tisch.platte
    seiten: dict[str, list[Stueck]] = {}
    for st in stuehle:
        seiten.setdefault(seite(st.deckend, t) or "schraeg", []).append(st)
    befunde = _seitliche_stuehle(szene, tisch, seiten)
    for lage in ("oben", "unten"):
        reihe = sorted(seiten.get(lage, []), key=lambda st: mitte(st.deckend)[0])
        if not reihe:
            continue
        breite = (platte[0], platte[1], platte[2], platte[1] + 1)
        stuhlbreite = max(st.deckend[2] - st.deckend[0] for st in reihe)
        for st, platz in zip(reihe, _sitzplaetze(tisch, breite, len(reihe), stuhlbreite), strict=True):
            dx = platz[0] - mitte(st.deckend)[0]
            if abs(dx) > TOLERANZ:
                text = f"steht nicht mittig vor seinem Platz an {tisch.name}"
                befunde.append(_befund(szene, st, text, st.versatz_plus(dx, 0)))
    return befunde


def _seitliche_stuehle(szene: dict, tisch: Stueck, seiten: dict[str, list[Stueck]]) -> list[Befund]:
    """Stühle links und rechts: nicht zu weit weg, und der Tisch steht mittig zwischen ihnen."""
    t = tisch.deckend
    luecken: dict[str, list[tuple[Stueck, float]]] = {}
    for lage in ("links", "rechts"):
        for st in seiten.get(lage, []):
            d = st.deckend
            luecken.setdefault(lage, []).append((st, t[0] - d[2] if lage == "links" else d[0] - t[2]))
    befunde = []
    for lage, liste in luecken.items():
        for st, luecke in liste:
            if luecke > LUECKE_STUHL:
                schub = luecke - LUECKE_SEITE
                dx = schub if lage == "links" else -schub
                text = f"steht {luecke:.0f} Pixel neben {tisch.name}"
                befunde.append(_befund(szene, st, text, st.versatz_plus(dx, 0)))
    if not befunde and len(luecken) == 2:
        links = min(luecke for _, luecke in luecken["links"])
        rechts = min(luecke for _, luecke in luecken["rechts"])
        if abs(links - rechts) > TOLERANZ:
            text = (
                f"steht nicht mittig zwischen seinen Stühlen (links {links:.0f}, rechts {rechts:.0f} Pixel)"
            )
            befunde.append(_befund(szene, tisch, text, tisch.versatz_plus((rechts - links) / 2, 0)))
    return befunde


def pruefe_szene(szene: dict, moebel: dict, mit_sitzen: bool = True) -> list[Befund]:
    """Alle Regeln von 10.79 für eine Szene.

    ``mit_sitzen=False``: nur Bretter und Uhren (Regeln 1 bis 3). Der Kartenbau prüft Hocker und
    Stühle nur mit dem Grafikpaket, weil ihre Lücken an der deckenden Fläche hängen; mit ganzen Bildern
    gäbe es Befunde, die das Auge nicht sieht.
    """
    stuecke = stuecke_der_szene(szene, moebel)
    befunde = pruefe_auflagen(szene, stuecke)
    if mit_sitzen:
        befunde += pruefe_hocker(szene, stuecke) + pruefe_stuehle(szene, stuecke)
    return befunde


def main(argumente: list[str]) -> int:
    from pipeline.abenteuer.kartenbau import INHALTE, lade
    from pipeline.abenteuer.moebelliste import lade_moebel
    from pipeline.abenteuer.uebergangsbogen import PRIVAT

    ort = argumente[argumente.index("--ort") + 1] if "--ort" in argumente else None
    privat = Path(argumente[argumente.index("--privat") + 1]) if "--privat" in argumente else PRIVAT
    BESTAND[0] = privat if (privat / "spiel").exists() else None
    moebel = lade_moebel()
    befunde = []
    # Alle Szenen samt Zuständen (der Kartenbau prüft jede), ohne die Varianten zur Wahl.
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = lade(pfad)
        if ort and szene["karte"].split(".")[0] != ort:
            continue
        befunde += [
            Befund(f"{pfad.stem}", b.moebel, b.feld, b.text, b.vorschlag) for b in pruefe_szene(szene, moebel)
        ]
    for b in befunde:
        print(f"- {b}")
    print(
        "Tischlage in Ordnung" if not befunde else f"{len(befunde)} Befunde zur Lage am Tisch (Regel 10.79)"
    )
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

"""Türen zwischen Innenraum und Gebäude: Wand, Drittel, Türstelle, Türbild, Stil, Geschosse.

Warum: Teil der Übergangsprüfung (KARTENREGELN 10.77, Wunsch des Autors 14.11.2026). Die Tür innen
und die Tür am Gebäudebild sind ein Paar: „außen links ↔ innen links“ (10.75), die Tür sitzt außen
an einer Türstelle des Grundrisses (10.74), innen in der Wand, die zur selben Seite zeigt, mit einem
Türbild, das zu dieser Wand gehört, und im Stil des Hauses. Ein Gebäude hat innen nicht mehr
Geschosse als außen.
"""

import math

from pipeline.abenteuer.kartenbau import K
from pipeline.abenteuer.uebergangsarten import Seite, wand_der_tuer
from pipeline.abenteuer.uebergangsbilder import (
    STILGRUPPE,
    Befund,
    drittel,
    ebene,
    gebaeude_an,
    lage_am_gebaeude,
    raumspanne,
)

# Türbilder bis zu dieser Höhe in Pixeln sind flach (Schwelle in der Südwand, von oben gesehen).
FLACHE_TUER = 16
# Bis zu dieser Abweichung vom Faktor 1 gilt ein Gebäude als ungeskaliert (Rundung der Breite).
MASSSTAB_SPIEL = 0.05
# Aufschlag beim Runden der skalierten Türbreite: 1,5 Kacheln bleiben eine Tür, 1,7 werden zwei.
TUER_RUNDUNG = 0.4
SEITENNAME = {"sued": "Süd", "nord": "Nord", "west": "West", "ost": "Ost"}


def gebaeude_der_innenkarten(
    liste: list[tuple[Seite, Seite | None, bool]], grundrisse: dict
) -> dict[str, dict]:
    """Innenkarte → Gebäude außen: {stueck, angabe, grundriss, aussen (Seite)}.

    Erst die Karten mit Tür nach draußen, dann über Treppen und Innentüren weitergereicht (das
    Obergeschoss gehört zum Haus der Haustür). Beispiel: mapleFalls.wohnzimmer, .zimmer und
    .dachboden → mf4VillaWhitlock.
    """
    haus: dict[str, dict] = {}
    for a, b, _ in liste:
        for innen, aussen in ((a, b), (b, a)):
            if innen and aussen and innen.innen and not aussen.innen and (g := gebaeude_an(aussen)):
                s, angabe = g
                haus.setdefault(
                    innen.karte,
                    {
                        "stueck": s,
                        "angabe": angabe,
                        "aussen": aussen,
                        "grundriss": grundrisse.get(angabe.get("quelle", ""), {}),
                    },
                )
    geaendert = True
    while geaendert:
        geaendert = False
        for a, b, _ in liste:
            if a and b and a.innen and b.innen:
                for von, zu in ((a, b), (b, a)):
                    if von.karte in haus and zu.karte not in haus:
                        haus[zu.karte] = haus[von.karte]
                        geaendert = True
    return haus


def tuerbilder(seite: Seite) -> list[tuple[dict, dict]]:
    return [(s, a) for s, a, art in seite.moebel if art == "tuer"]


def pruefe_haustuer(innen: Seite, aussen: Seite, grundrisse: dict) -> list[Befund]:
    """Tür eines Innenraums nach draußen gegen die Tür am Gebäudebild (Regeln 2 und 4)."""
    g = gebaeude_an(aussen)
    if not g:
        return []
    stueck, angabe = g
    befunde = _pruefe_grundriss(aussen, stueck, grundrisse.get(angabe.get("quelle", "")))
    wand, seite_aussen = wand_der_tuer(innen), lage_am_gebaeude(aussen, stueck)
    if wand and wand != seite_aussen:
        befunde.append(
            Befund(
                innen.karte,
                innen.name,
                f"Tür innen in der {SEITENNAME[wand]}wand, außen liegt sie auf der "
                f"{SEITENNAME[seite_aussen]}seite von {stueck['name']}",
                f"Tür innen in die {SEITENNAME[seite_aussen]}wand legen",
            )
        )
    if wand in ("sued", "nord") and seite_aussen in ("sued", "nord"):
        x0, x1 = stueck["x"] // K, (stueck["x"] + stueck["breite"] - 1) // K
        r0, r1 = raumspanne(innen.szene)
        aussen_d, innen_d = drittel(aussen.mitte[0], x0, x1), drittel(innen.mitte[0], r0, r1)
        if abs(aussen_d - innen_d) > 1:
            lage = ("links", "in der Mitte", "rechts")
            befunde.append(
                Befund(
                    innen.karte,
                    innen.name,
                    f"Tür innen {lage[innen_d]}, außen an {stueck['name']} {lage[aussen_d]} (10.75)",
                    f"Tür innen nach {lage[aussen_d]} legen oder außen anpassen",
                )
            )
    breite_aussen = tuerbreite(aussen, stueck, grundrisse.get(angabe.get("quelle", "")))
    if len(innen.felder) != breite_aussen:
        befunde.append(
            Befund(
                innen.karte,
                innen.name,
                f"Tür innen {len(innen.felder)} Feld(er) breit, außen an {stueck['name']} {breite_aussen}",
                "Türbild in derselben Breite (Doppeltür ↔ Doppeltür)",
            )
        )
    befunde += _pruefe_tuerbild(innen, wand)
    befunde += _pruefe_stil(innen, angabe)
    return befunde


def tuerbreite(aussen: Seite, stueck: dict, grundriss: dict | None) -> int:
    """Breite der Tür außen: die Türstelle des Grundrisses am Auslöser (10.74), sonst die Breite des
    Auslösers. Warum: Vor einer einfachen Tür mit breiter Treppe ist der Auslöser so breit wie die
    Treppe (durchgang.py), die Tür selbst bleibt eine Kachel (Musikhaus in Port Delacroix)."""
    x0 = stueck["x"] // K
    spalten = {x - x0 + 1 for x, _ in aussen.felder}
    for von, bis in tuerstellen(stueck, grundriss):
        if any(von - 1 <= s <= bis + 1 for s in spalten):
            return bis - von + 1
    return len(aussen.felder)


def tuerstellen(stueck: dict, grundriss: dict | None) -> list[tuple[int, int]]:
    """Türstellen des Grundrisses in Kachelspalten des gesetzten Stücks (ab 1, von–bis).

    Warum: Der Grundriss zählt Spalten des ungeskalierten Bildes. Steht das Gebäude mit
    ``massstab`` auf der Karte, liegen seine Türen entsprechend weiter rechts und sind breiter;
    ohne die Umrechnung meldet die Prüfung einen Auslöser, der im Bild genau vor der Tür liegt.
    Der Faktor ergibt sich aus der gesetzten Breite des Stücks und der Breite im Grundriss.
    Beispiel: Kantine Ironwood, Halle 13 Kacheln breit mit Tür in Spalte 8, gesetzt mit 1,7:
    Türstelle 12–13. Eine einflügelige Tür bleibt bis Faktor 1,5 eine Kachel breit.
    Sonderfall: ohne Breite im Grundriss oder ohne Maßstab bleiben die Spalten.
    """
    tueren = (grundriss or {}).get("tueren") or []
    breite = (grundriss or {}).get("breite")
    faktor = stueck["breite"] / (breite * K) if breite and "breite" in stueck else 1.0
    if abs(faktor - 1) < MASSSTAB_SPIEL:
        return [(t["von"], t["bis"]) for t in tueren]
    stellen = []
    for t in tueren:
        von = math.floor((t["von"] - 1) * faktor) + 1
        breite = max(1, math.floor((t["bis"] - t["von"] + 1) * faktor + TUER_RUNDUNG))
        stellen.append((von, von + breite - 1))
    return stellen


def _pruefe_grundriss(aussen: Seite, stueck: dict, grundriss: dict | None) -> list[Befund]:
    """10.74: Der Auslöser liegt vor einer Türstelle des Gebäudebilds (Spalten ab 1, ±1 Spiel)."""
    if not grundriss or grundriss.get("form") in ("fassade", "sonder", "bauteil"):
        return []
    x0 = stueck["x"] // K
    spalten = {x - x0 + 1 for x, _ in aussen.felder}
    tueren = tuerstellen(stueck, grundriss)
    if not tueren:
        return [
            Befund(
                aussen.karte,
                aussen.name,
                f"{stueck['name']} hat laut Grundriss keine Tür im Bild (10.74)",
                "Gebäudebild mit Tür nehmen oder Tür ansetzen (10.2 Punkt 9)",
            )
        ]
    if any(von - 1 <= s <= bis + 1 for von, bis in tueren for s in spalten):
        return []
    stellen = ", ".join(f"{von}–{bis}" for von, bis in tueren)
    return [
        Befund(
            aussen.karte,
            aussen.name,
            f"Auslöser in Spalte {sorted(spalten)} von {stueck['name']}, Türen laut Grundriss in {stellen}",
            "Auslöser vor die Türstelle legen (Möbelangabe tuer prüfen)",
        )
    ]


def _pruefe_tuerbild(innen: Seite, wand: str | None) -> list[Befund]:
    """Das Türbild gehört zur Wand: Südwand flach (Schwelle), Nordwand hoch (Türblatt)."""
    befunde = []
    for s, angabe in tuerbilder(innen):
        flach = angabe["hoehe"] <= FLACHE_TUER or "sued" in angabe.get("quelle", "")
        if wand == "sued" and not flach:
            befunde.append(
                Befund(
                    innen.karte,
                    innen.name,
                    f"{s['name']} ist ein hohes Türbild in der Südwand",
                    "Südtür (tuer_sued_*.png) nehmen",
                )
            )
        if wand == "nord" and flach:
            befunde.append(
                Befund(
                    innen.karte,
                    innen.name,
                    f"{s['name']} ist eine Südtür in der Nordwand",
                    "hohe Tür (generic_073/074) nehmen",
                )
            )
    return befunde


def _pruefe_stil(innen: Seite, gebaeude: dict) -> list[Befund]:
    """Stil der Tür innen gegen den Stil des Gebäudes außen (modern gegen alt/rustikal)."""
    haus = STILGRUPPE.get(gebaeude.get("stil", ""))
    befunde = []
    for s, angabe in tuerbilder(innen):
        tuer = STILGRUPPE.get(angabe.get("stil", ""))
        if haus and tuer and haus != tuer:
            befunde.append(
                Befund(
                    innen.karte,
                    innen.name,
                    f"{s['name']} ({angabe.get('stil')}) passt nicht zum Gebäude ({gebaeude.get('stil')})",
                    "Tür im Stil des Hauses nehmen",
                )
            )
    return befunde


def pruefe_geschosse(haus: dict[str, dict]) -> list[Befund]:
    """Ein Gebäude hat innen nicht mehr Geschosse über dem Erdgeschoss als außen (mit Dachgeschoss)."""
    befunde = []
    for karte, g in sorted(haus.items()):
        grundriss = g["grundriss"]
        if not grundriss:
            continue
        oben = grundriss.get("geschosse", 1) - 1 + (1 if "DG" in grundriss.get("fenster", {}) else 0)
        if ebene(karte) > max(oben, 0):
            befunde.append(
                Befund(
                    karte,
                    "-",
                    f"Geschoss {ebene(karte)} innen, {g['stueck']['name']} hat außen "
                    f"{grundriss.get('geschosse', 1)} Geschoss(e)",
                    "höheres Gebäudebild nehmen oder Geschoss streichen",
                )
            )
    return befunde

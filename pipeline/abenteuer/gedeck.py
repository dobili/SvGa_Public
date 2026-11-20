"""Frisches Essen nur an Tischen mit Gast (KARTENREGELN 10.91).

Warum: Notiz des Autors zum Diner in Maple Falls (16.11.2026), als Regel bestätigt in der Antwort zu
RO32: „An Tischen, wo frisches Essen steht, sollten auch Personen sitzen. Andernfalls dreckiges
Geschirr oder nichts.“ Ein voller Teller an einem leeren Tisch sieht aus wie ein vergessener Gast.

Regel: Ein Bild mit ``essen: "frisch"`` im Katalog (Teller mit Essen, Kuchen, Pfannkuchen, volles Glas,
Kaffee) steht auf einem Tisch, an dem eine Figur oder ein Statist sitzt (``sitzt`` an der Figur oder
in den Eigenschaften des Statisten). Sonst steht dort benutztes Geschirr (``essen: "benutzt"``, etwa
``mf16TellerBenutzt``) oder nichts.

Zuordnung: Jede sitzende Person gehört zu dem Tisch, dessen Bild ihrer Kachelmitte am nächsten ist
(höchstens eine Kachel entfernt), so zählt eine Person in der Nische nicht auch für den Nachbartisch.
Der Tisch eines Essens ist der, auf dem es steht (``auf``), sonst der Tisch unter seiner Mitte.

Aufruf: ``python -m pipeline.abenteuer.gedeck`` listet die Befunde aller Szenen; im Kartenbau als
Befund „Gedeck:“. Beispiel: Diner Maple Falls, Pfannkuchen auf dem Tisch n3 ohne Gast → Befund.
"""

import sys

K = 16
FRISCH = "frisch"
# Weiter als eine Kachel vom Tisch entfernt sitzt niemand an ihm.
REICHWEITE = K
Rechteck = tuple[int, int, int, int]


def _rechteck(s: dict) -> Rechteck:
    return s["x"], s["y"], s["x"] + s["breite"], s["y"] + s["hoehe"]


def _abstand(punkt: tuple[float, float], r: Rechteck) -> float:
    """Abstand eines Punkts von einem Rechteck in Pixeln (0 innen)."""
    dx = max(r[0] - punkt[0], 0, punkt[0] - r[2])
    dy = max(r[1] - punkt[1], 0, punkt[1] - r[3])
    return (dx * dx + dy * dy) ** 0.5


def sitzende(szene: dict) -> list[tuple[str, tuple[float, float]]]:
    """(Name, Kachelmitte in Pixeln) aller sitzenden Figuren und Statisten."""
    personen = [(f["name"], f["feld"]) for f in szene.get("figuren", []) if f.get("sitzt")]
    personen += [
        (b["name"], b["feld"])
        for b in szene.get("belebung", [])
        if b.get("typ") == "statist" and b.get("eigenschaften", {}).get("sitzt")
    ]
    return [(name, ((x + 0.5) * K, (y + 0.5) * K)) for name, (x, y) in personen]


def _tische(szene: dict, gesetzt: list[dict]) -> dict[str, dict]:
    """Stücke, auf denen etwas steht (Ziel von ``auf``), nach Kennung."""
    ziele = {o["auf"] for o in szene.get("objekte", []) if "auf" in o}
    return {s["id"]: s for s in gesetzt if s["id"] in ziele}


def _tisch_von(eintrag: dict, stueck: dict, tische: dict[str, dict]) -> str | None:
    if "auf" in eintrag:
        return eintrag["auf"]
    mitte = (stueck["x"] + stueck["breite"] / 2, stueck["y"] + stueck["hoehe"] / 2)
    return next((k for k, t in tische.items() if _abstand(mitte, _rechteck(t)) == 0), None)


def besetzte_tische(szene: dict, tische: dict[str, dict]) -> set[str]:
    """Kennungen der Tische, an denen jemand sitzt (nächster Tisch je Person)."""
    besetzt = set()
    for _, punkt in sitzende(szene):
        abstaende = sorted((_abstand(punkt, _rechteck(t)), k) for k, t in tische.items())
        if abstaende and abstaende[0][0] <= REICHWEITE:
            besetzt.add(abstaende[0][1])
    return besetzt


def pruefe_szene(szene: dict, gesetzt: list[dict], moebel: dict) -> list[str]:
    """Befunde: frisches Essen auf einem Tisch ohne sitzenden Gast."""
    tische = _tische(szene, gesetzt)
    besetzt = besetzte_tische(szene, tische)
    nummern = {o.get("id", f"{o['moebel']}@{i}"): o for i, o in enumerate(szene.get("objekte", []))}
    befunde = []
    for s in gesetzt:
        if moebel.get(s["name"], {}).get("essen") != FRISCH:
            continue
        tisch = _tisch_von(nummern.get(s["id"], {}), s, tische)
        if tisch is not None and tisch not in besetzt:
            befunde.append(
                f"{s['name']} auf {tisch}: frisches Essen an einem Tisch ohne Gast "
                "(benutztes Geschirr wie mf16TellerBenutzt, nichts oder einen sitzenden Gast)"
            )
    return befunde


def main() -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    from pipeline.abenteuer.kartenbau import INHALTE, lade, platziere
    from pipeline.abenteuer.moebelliste import lade_moebel

    moebel, anzahl = lade_moebel(), 0
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = lade(pfad)
        for b in pruefe_szene(szene, platziere(szene, moebel)[0], moebel):
            print(f"{pfad.name}: {b}")
            anzahl += 1
    print(f"{anzahl} Befunde an Gedecken")
    return 1 if anzahl else 0


if __name__ == "__main__":
    sys.exit(main())

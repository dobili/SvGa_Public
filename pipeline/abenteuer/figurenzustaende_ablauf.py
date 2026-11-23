"""Zustände aus den Tagesabläufen und die Prüfung, ob die Bilder da sind (Wunsch des Autors, 23.11.2026).

Warum: „Schau, dass für alle Figuren, die in unseren Karten auf Stühlen gezeichnet werden, wirklich
eine Sitzanimation gewählt ist und überhaupt vorhanden ist.“ figurenzustaende.py las bisher nur
Szenen und Ink. Die Tagesabläufe (inhalte/abenteuer/tagesablaeufe.json) setzen aber rund 70 Figuren
auf Stühle und Bänke, einige ins Bett. Dieses Modul
- liest die Blöcke der Tagesabläufe (``tut``: sitzt, sitzt am Boden, liegt) über die echte
  Bildzuordnung (Figur → Bogen aus orte.json),
- prüft im privaten Ordner, ob der Zustand da ist (figuren-neu/<bild>/zustaende/sitzstuhl,
  sitzboden, schlaf; Rennen: animations/Running),
- schreibt für die App die Personen der Tagesabläufe ohne Stuhlbild mit einem freien Nachbarfeld
  (app/src/abenteuer/regeln/ohnesitzbild.json): Dort steht die Figur neben dem Stuhl, bis ihr Bild
  da ist (regeln/tagesablauf.ts). In Szenen gilt der Ersatz wie bisher (angehobenes Standbild).
Figuren in WARTET_AUF_BILD fehlen bewusst (mit Grund); der Dauertest verlangt für alle übrigen den
Zustand.
Rolle im Gesamtbild: Teil von figurenzustaende.py (Aufruf, Seite für den Autor).
"""

import json
from pathlib import Path

ABLAEUFE = "tagesablaeufe.json"
KACHEL = 16
ORDNER = {"stuhl": "sitzstuhl", "boden": "sitzboden", "liegen": "schlaf"}
RENNEN = Path("animations") / "Running"
# Grund für die Liste: Die Seite fehlende.html mit Vorschau und Wortlaut je Figur ging am 23.11.2026
# an den Autor; bis dahin stehen diese Figuren im Tagesablauf neben dem Stuhl (ohnesitzbild.json).
SEITE = "Zustand noch nicht erzeugt; Seite fehlende.html an den Autor (23.11.2026)."
# (Bild, Zustand) → Grund: fehlt bewusst, bis der Autor es liefert. Neue Lücken meldet der Dauertest.
WARTET_AUF_BILD: dict[tuple[str, str], str] = {
    ("statist-18", "stuhl"): "Neu dem Typ studentin zugeordnet; gilt, sobald pixellabimport neu läuft.",
    ("owen", "stuhl"): "Der Autor erzeugt Owen gerade neu in PixelLab (23.11.2026).",
    ("bea", "stuhl"): SEITE,
    ("coach-delgado", "stuhl"): SEITE,
    ("graham-hale", "stuhl"): SEITE,
    ("gus", "stuhl"): SEITE,
    ("hank", "stuhl"): SEITE,
    ("harlan", "stuhl"): SEITE,
    ("juno", "stuhl"): SEITE,
    ("kade", "stuhl"): SEITE,
    ("kiki", "stuhl"): SEITE,
    ("marcus", "stuhl"): SEITE,
    ("priya", "stuhl"): SEITE,
    ("skater-jo", "stuhl"): SEITE,
    ("teague", "stuhl"): SEITE,
    ("tobias", "stuhl"): SEITE,
    ("turnierleiterin", "stuhl"): SEITE,
    ("ada", "stuhl"): SEITE,
    ("batiste", "stuhl"): SEITE,
    ("blaeser", "stuhl"): SEITE,
    ("boateng", "stuhl"): SEITE,
    ("celeste", "stuhl"): SEITE,
    ("dale", "stuhl"): SEITE,
    ("dime", "stuhl"): SEITE,
    ("dolores", "stuhl"): SEITE,
    ("dunmore", "stuhl"): SEITE,
    ("earl", "stuhl"): SEITE,
    ("fenwick", "stuhl"): SEITE,
    ("greta", "stuhl"): SEITE,
    ("guidry", "stuhl"): SEITE,
    ("henri", "stuhl"): SEITE,
    ("holloway", "stuhl"): SEITE,
    ("joggerin", "stuhl"): SEITE,
    ("juniper", "stuhl"): SEITE,
    ("kit", "stuhl"): SEITE,
    ("lin", "stuhl"): SEITE,
    ("lou", "stuhl"): SEITE,
    ("lucia", "stuhl"): SEITE,
    ("lucia", "liegen"): SEITE,
    ("mira", "stuhl"): SEITE,
    ("ngata", "stuhl"): SEITE,
    ("nia", "stuhl"): SEITE,
    ("odette", "stuhl"): SEITE,
    ("odile", "stuhl"): SEITE,
    ("okafor", "stuhl"): SEITE,
    ("oma-ruth", "stuhl"): SEITE,
    ("oma-ruth", "liegen"): SEITE,
    ("pratt", "stuhl"): SEITE,
    ("pruitt", "stuhl"): SEITE,
    ("ray-castillo", "stuhl"): SEITE,
    ("remy", "stuhl"): SEITE,
    ("rosa", "stuhl"): SEITE,
    ("ruth-keene", "stuhl"): SEITE,
    ("schaffner", "stuhl"): SEITE,
    ("schiffskoch", "stuhl"): SEITE,
    ("sol", "stuhl"): SEITE,
    ("tamsin", "stuhl"): SEITE,
    ("tomas", "stuhl"): SEITE,
}
# Nachbarfelder in der Reihenfolge, in der eine Figur neben ihren Stuhl tritt: vor, links, rechts, hinter.
NACHBARN = ((0, 1), (-1, 0), (1, 0), (0, -1))
APP_TABELLE = (
    Path(__file__).resolve().parents[2] / "app" / "src" / "abenteuer" / "regeln" / "ohnesitzbild.json"
)


def bild_der_person(person: str, ort: str, bilder: dict[str, str]) -> str | None:
    """Bogen einer Person der Tagesabläufe: „ort.person“, sonst jede Kennung „*.person“."""
    if f"{ort}.{person}" in bilder:
        return bilder[f"{ort}.{person}"]
    return next((b for k, b in bilder.items() if k.endswith(f".{person}")), None)


def szenen_je_karte(orte: list[dict]) -> dict[str, str]:
    """Kartenkennung → Szenenname (Datei ohne Endung). Beispiel: mapleFalls.park → maple-falls-park."""
    return {k["kennung"]: Path(k["datei"]).stem for o in orte for k in o.get("karten", []) if k.get("datei")}


def bloecke(daten: Path) -> list[tuple[str, str, dict]]:
    """(Person, Ort, Block) aller Tagesabläufe."""
    figuren = json.loads((daten / ABLAEUFE).read_text(encoding="utf-8"))["figuren"]
    return [(p, a.get("ort", ""), b) for p, a in figuren.items() for b in a.get("bloecke", [])]


def zustand_des_blocks(block: dict, objekte: list[dict], katalog: dict, sitzart) -> str | None:  # noqa: ANN001
    """„stuhl“, „boden“ oder „liegen“ für einen Block, sonst None (stehen, arbeiten)."""
    tut = block.get("tut", "")
    if tut == "liegt":
        return "liegen"
    if tut == "sitzt am Boden":
        return "boden"
    if tut == "sitzt":
        return sitzart(block["feld"], objekte, katalog)
    return None


def vorhanden(privat: Path, bild: str, zustand: str) -> bool:
    """Ist der Zustand im privaten Ordner (spiel/figuren-neu/<bild>/…) da?"""
    figur = privat / "figuren-neu" / ("held-0" if bild == "held" else bild)
    if zustand == "rennen":
        return (figur / RENNEN).exists()
    return (figur / "zustaende" / ORDNER[zustand] / "rotations").exists()


def belegt(feld: tuple[int, int], objekte: list[dict], katalog: dict) -> bool:
    """Steht ein Möbel (mit Kollision) auf diesem Feld?"""
    mx, my = (feld[0] + 0.5) * KACHEL, (feld[1] + 0.5) * KACHEL
    for o in objekte:
        angabe = katalog.get(o.get("moebel", ""))
        if not angabe or "feld" not in o or not angabe.get("kollision", True):
            continue
        dx, dy = o.get("versatz", [0, 0])
        x, y = o["feld"][0] * KACHEL + dx, o["feld"][1] * KACHEL + dy
        if x <= mx < x + angabe["breite"] and y <= my < y + angabe["hoehe"]:
            return True
    return False


def nachbarfeld(feld: list[int], objekte: list[dict], katalog: dict) -> list[int]:
    """Erstes freies Nachbarfeld (NACHBARN), sonst das Feld selbst."""
    for dx, dy in NACHBARN:
        neu = (feld[0] + dx, feld[1] + dy)
        if not belegt(neu, objekte, katalog):
            return list(neu)
    return list(feld)


def ohne_stuhlbild(daten: Path, privat: Path, bilder: dict[str, str], katalog: dict, sitzart) -> dict:  # noqa: ANN001
    """Personen der Tagesabläufe ohne Stuhlbild: „karte@x,y“ → freies Nachbarfeld."""
    karten = szenen_je_karte(json.loads((daten / "orte.json").read_text(encoding="utf-8"))["orte"])
    ergebnis: dict[str, dict[str, list[int]]] = {}
    for person, ort, block in bloecke(daten):
        szene = karten.get(block.get("karte", ""))
        bild = bild_der_person(person, ort, bilder)
        if not szene or not bild or block.get("tut") != "sitzt":
            continue
        objekte = json.loads((daten / "szenen" / f"{szene}.json").read_text(encoding="utf-8")).get(
            "objekte", []
        )
        if sitzart(block["feld"], objekte, katalog) != "stuhl" or vorhanden(privat, bild, "stuhl"):
            continue
        schluessel = f"{block['karte']}@{block['feld'][0]},{block['feld'][1]}"
        ergebnis.setdefault(person, {})[schluessel] = nachbarfeld(block["feld"], objekte, katalog)
    return dict(sorted(ergebnis.items()))


def schreibe_app_tabelle(tabelle: dict) -> None:
    """Schreibt die Tabelle für regeln/tagesablauf.ts."""
    daten = {"erklaerung": "Personen ohne Stuhlbild: stehen neben dem Stuhl (figurenzustaende_ablauf.py)"}
    daten["personen"] = tabelle
    APP_TABELLE.write_text(json.dumps(daten, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

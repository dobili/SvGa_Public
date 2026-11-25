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
    # Leer seit 25.11.2026: Die Sitzbilder von 53 Figuren, dazu Dime als ganze Figur mit Sitzbild
    # und die Liegebilder von Lucia und Oma Ruth sind da (privat: werkzeuge/sitzbilder_2511.py,
    # pixellabimport.py). Ohne Stuhlbild stünde eine Person neben dem Stuhl (ohnesitzbild.json).
}
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


def besetzte_felder(person: str, block: dict, daten: Path, szene: dict) -> set[tuple[int, int]]:
    """Felder, die zur Zeit des Blocks auf seiner Karte schon jemand braucht: Figuren und Statisten
    der Szene und die Blöcke anderer Personen mit gemeinsamer Stunde."""
    from pipeline.abenteuer.tagesablauf import stunden

    besetzt = {tuple(f["feld"]) for f in szene.get("figuren", []) + szene.get("belebung", [])}
    zeit = set(stunden(block["von"], block["bis"]))
    for andere, _, b in bloecke(daten):
        if andere != person and b.get("karte") == block["karte"] and zeit & set(stunden(b["von"], b["bis"])):
            besetzt.add(tuple(b["feld"]))
    return besetzt


def nachbarfeld(person: str, block: dict, daten: Path, karten, ersatz: dict) -> list[int] | None:  # noqa: ANN001
    """Ersatzfeld neben dem Stuhl: erreichbar, nicht unter einem Bild, das vor der Figur liegt (Wand,
    Dach, Tisch; stehplatz.py), nicht besetzt und ohne neuen versperrten Weg (tagesablauf.py); sonst
    None: Dann sitzt die Figur wie in den Szenen mit angehobenem Standbild (besser als auf dem
    Stuhl zu stehen). ``ersatz``: die bisher gewählten Ersatzfelder.
    Beispiel: Coach Delgado an der Nischenbank im Diner (14, 4) → kein Feld hinter der rechten Wand.
    """
    from pipeline.abenteuer.stehplatz import stehplaetze
    from pipeline.abenteuer.tagesablauf import lade, pruefe_aufstellungen

    info, karte = karten.info(block["karte"]), block["karte"]
    besetzt = besetzte_felder(person, block, daten, karten.szenen[karte])
    ablaeufe = lade()
    schluessel = f"{karte}@{block['feld'][0]},{block['feld'][1]}"
    vorher = set(pruefe_aufstellungen(ablaeufe, karten, karte, ersatz))
    for neu in stehplaetze(tuple(block["feld"]), info["frei"], info["gesetzt"], karten.katalog, besetzt):
        probe = {**ersatz, person: {**ersatz.get(person, {}), schluessel: list(neu)}}
        if not set(pruefe_aufstellungen(ablaeufe, karten, karte, probe)) - vorher:
            return list(neu)
    return None


def ohne_stuhlbild(daten: Path, privat: Path, bilder: dict[str, str], katalog: dict, sitzart) -> dict:  # noqa: ANN001
    """Personen der Tagesabläufe ohne Stuhlbild: „karte@x,y“ → freies Nachbarfeld."""
    from pipeline.abenteuer.tagesablauf import Karten

    karten = szenen_je_karte(json.loads((daten / "orte.json").read_text(encoding="utf-8"))["orte"])
    plaetze = Karten()
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
        if (feld := nachbarfeld(person, block, daten, plaetze, ergebnis)) is not None:
            ergebnis.setdefault(person, {})[schluessel] = feld
    return dict(sorted(ergebnis.items()))


def schreibe_app_tabelle(tabelle: dict) -> None:
    """Schreibt die Tabelle für regeln/tagesablauf.ts."""
    daten = {"erklaerung": "Personen ohne Stuhlbild: stehen neben dem Stuhl (figurenzustaende_ablauf.py)"}
    daten["personen"] = tabelle
    APP_TABELLE.write_text(json.dumps(daten, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

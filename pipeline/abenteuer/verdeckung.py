"""Befehl: Wo sitzt oder liegt jemand, und verdeckt das Möbel die Figur richtig? (Vordergrund, 23.11.2026)

Warum: Wunsch des Autors: Wer sitzt, wird vom vorderen Teil seines Möbels verdeckt (Vorderkante,
Beine; von hinten die Lehne), wer liegt, von der Bettdecke. Die App legt dafür einen Ausschnitt des
Möbelbilds über die Figur (app/src/abenteuer/oberwelt/vordergrund.ts). Dieses Werkzeug findet alle
Stellen und prüft, ob es dort einen Vordergrund gibt:
- Sitzende aus den Szenen (`figuren[].sitzt`), aus den Tagesabläufen (`tut: sitzt`) und Liegende
  aus den Tagesabläufen (`tut: liegt`) und aus Ink (`#stelle:wer>x,y>liegt`).
- Je Stelle das Möbel unter dem Feld (Szene, Katalog moebel/*.json) und seine Art.
- Befund, wenn eine Sitzende auf einem Möbel sitzt, das keine Sitzart ist (kein Vordergrund), oder
  wenn eine Liegende kein Bett mit bekannter Kopfseite hat (KopfRechts/KopfLinks im Namen).
  Sitzen am Boden (kein Möbel) braucht keinen Vordergrund.
Ausnahmen mit Grund stehen in GEPRUEFT. Dauertest (pipeline/tests): „0 Befunde“.

Die Vorgaben je Art sind dieselben wie in vordergrund.ts (VORGABE_AB, VORGABE_KOPF); ein Möbel im
Katalog kann `vordergrund: {"ab": …, "kopf": …}` tragen. Vorschaubilder vorher/nachher brauchen die
privaten Möbel- und Figurenbilder und entstehen im Spiel (Bildschirmfotos).

Ablauf (im Hauptordner): python -m pipeline.abenteuer.verdeckung [--bericht DATEI]
"""

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path

WURZEL = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
KACHEL = 16
SITZARTEN = ("stuhl", "bank", "sessel", "sofa", "hocker", "couch")
KOPFSEITE = re.compile(r"Kopf(Rechts|Links|Ost|West)", re.IGNORECASE)
STELLE = re.compile(r"#stelle:([^>\s#]+)>(\d+),(\d+)>liegt")
# Stellen, die so stimmen (Szene, Feld) → Grund.
GEPRUEFT: dict[tuple[str, tuple[int, int]], str] = {
    ("crossroads-aussen", (34, 27)): "Mira sitzt auf dem Bordstein: niedrig wie der Boden, nichts verdeckt.",
    ("crossroads-aussen-gatter-offen", (34, 27)): "wie crossroads-aussen: Bordstein.",
    ("ironwood-mamas-zimmer", (8, 4)): (
        "Bett ohne Kopfseite im Namen: Liegebild und Decke nehmen die Vorgabe Kopf rechts "
        "(fuehrungsschicht.ts, figurenaufstellung.ts); im Bild prüfen, sonst Katalog vordergrund.kopf."
    ),
    ("maple-falls-dachboden", (13, 8)): (
        "Das Bett im Dachboden ist Teil der Kachelgrafik, kein Möbel: keine Decke möglich; "
        "an den Haupt-Chat gemeldet (Bett als Möbel aufstellen, dann deckt die App zu)."
    ),
}


@dataclass(frozen=True)
class Stelle:
    """Eine Figur, die sitzt oder liegt: Quelle, Szene, Feld, Haltung, Blick."""

    quelle: str
    szene: str
    feld: tuple[int, int]
    haltung: str
    richtung: str = ""


def katalog() -> dict[str, dict]:
    """Alle Möbel aus moebel/*.json (Name → Angabe)."""
    alle: dict[str, dict] = {}
    for datei in sorted((WURZEL / "moebel").glob("*.json")):
        alle.update(json.loads(datei.read_text(encoding="utf-8")).get("moebel", {}))
    return alle


def szenen_je_karte() -> dict[str, str]:
    """Kartenkennung → Szene (Dateiname ohne Endung). Beispiel: mapleFalls.park → maple-falls-park."""
    orte = json.loads((WURZEL / "orte.json").read_text(encoding="utf-8"))["orte"]
    return {k["kennung"]: Path(k["datei"]).stem for o in orte for k in o["karten"] if k.get("datei")}


def stellen() -> list[Stelle]:
    """Alle Sitz- und Liegestellen aus Szenen, Tagesabläufen und Ink."""
    gefunden = []
    for datei in sorted((WURZEL / "szenen").glob("*.json")):
        for f in json.loads(datei.read_text(encoding="utf-8")).get("figuren", []):
            if f.get("sitzt"):
                gefunden.append(
                    Stelle(f"szene {f['name']}", datei.stem, tuple(f["feld"]), "sitzt", f["sitzt"])
                )
    karten = szenen_je_karte()
    ablaeufe = json.loads((WURZEL / "tagesablaeufe.json").read_text(encoding="utf-8"))["figuren"]
    for name, ablauf in ablaeufe.items():
        for block in ablauf.get("bloecke", []) if isinstance(ablauf, dict) else []:
            tut = block.get("tut", "")
            if tut in ("sitzt", "liegt") and block.get("karte") in karten:
                haltung = "liegt" if tut == "liegt" else "sitzt"
                gefunden.append(
                    Stelle(f"ablauf {name}", karten[block["karte"]], tuple(block["feld"]), haltung)
                )
    for datei in sorted((WURZEL / "dialoge" / "de").glob("*.ink")):
        for wer, x, y in STELLE.findall(datei.read_text(encoding="utf-8")):
            gefunden.append(Stelle(f"ink {datei.stem} {wer}", datei.stem, (int(x), int(y)), "liegt"))
    return gefunden


def moebel_unter(szene: str, feld: tuple[int, int], moebel: dict[str, dict]) -> tuple[str, dict] | None:
    """Das Möbel der Karte unter der Mitte des Feldes: zuerst Sitzmöbel und Betten, sonst das kleinste.

    Gelesen wird die gebaute Karte (karten/<szene>.json, Objekte mit Lage und Größe), wie die App;
    Teppiche unter einem Stuhl zählen nur, wenn dort kein Sitzmöbel steht.
    """
    pfad = WURZEL / "karten" / f"{szene}.json"
    if not pfad.exists():
        return None
    mx, my = (feld[0] + 0.5) * KACHEL, (feld[1] + 0.5) * KACHEL
    treffer = []
    for ebene in json.loads(pfad.read_text(encoding="utf-8")).get("layers", []):
        for o in ebene.get("objects", []):
            name, breite, hoehe = o.get("name", ""), o.get("width", 0), o.get("height", 0)
            if name not in moebel or not (o["x"] <= mx < o["x"] + breite and o["y"] <= my < o["y"] + hoehe):
                continue
            vorrang = 0 if art_von(name, moebel[name]) in (*SITZARTEN, "bett") else 1
            treffer.append((vorrang, breite * hoehe, name))
    if not treffer:
        return None
    name = min(treffer)[2]
    return name, moebel[name]


def art_von(name: str, angabe: dict) -> str:
    """Art im Katalog, sonst aus dem Namen (Sitzart oder „bett“), sonst „sonst“."""
    if angabe.get("art"):
        return angabe["art"]
    klein = name.lower()
    return next((a for a in (*SITZARTEN, "bett") if a in klein), "sonst")


def pruefe(stelle: Stelle, moebel: dict[str, dict]) -> tuple[str, str | None]:
    """Beschreibung der Stelle und ein Befund (oder None)."""
    unter = moebel_unter(stelle.szene, stelle.feld, moebel)
    if (stelle.szene, stelle.feld) in GEPRUEFT:
        return f"geprüft: {GEPRUEFT[(stelle.szene, stelle.feld)]}", None
    if stelle.haltung == "sitzt":
        if unter is None:
            return "am Boden (kein Vordergrund nötig)", None
        name, angabe = unter
        art = art_von(name, angabe)
        if art in SITZARTEN or "vordergrund" in angabe:
            return f"{name} ({art}), Vordergrund", None
        return f"{name} ({art})", f"sitzt auf {name} ({art}): keine Sitzart, kein Vordergrund"
    if unter is None:
        return "kein Möbel", "liegt ohne Bett: keine Decke"
    name, angabe = unter
    if "bett" in name.lower() and (KOPFSEITE.search(name) or "vordergrund" in angabe):
        return f"{name}, Decke", None
    return name, f"liegt auf {name}: kein Bett mit Kopfseite im Namen, Decke unbekannt"


def bericht(ergebnisse: list[tuple[Stelle, str, str | None]]) -> str:
    """Markdown: alle Stellen mit Möbel und Befund, Befunde zuerst."""
    zeilen = [
        "# Verdeckung beim Sitzen und Liegen",
        "",
        "| Quelle | Szene | Feld | Haltung | Möbel | Befund |",
    ]
    zeilen.append("|---|---|---|---|---|---|")
    for s, text, befund in sorted(ergebnisse, key=lambda e: (e[2] is None, e[0].szene)):
        zeilen.append(
            f"| {s.quelle} | {s.szene} | {s.feld} | {s.haltung} {s.richtung} | {text} | {befund or ''} |"
        )
    return "\n".join(zeilen) + "\n"


def befunde() -> list[str]:
    """Alle Befunde als Sätze (für den Dauertest)."""
    moebel = katalog()
    return [f"{s.quelle} in {s.szene} {s.feld}: {b}" for s in stellen() if (b := pruefe(s, moebel)[1])]


def main() -> None:
    """Prüft alle Stellen und schreibt den Bericht."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--bericht", type=Path, default=Path("buch/arbeit/verdeckung/bericht.md"))
    args = parser.parse_args()
    moebel = katalog()
    ergebnisse = [(s, *pruefe(s, moebel)) for s in stellen()]
    args.bericht.parent.mkdir(parents=True, exist_ok=True)
    args.bericht.write_text(bericht(ergebnisse), encoding="utf-8")
    zahl = sum(1 for e in ergebnisse if e[2])
    print(f"{len(ergebnisse)} Stellen, {zahl} Befunde → {args.bericht}")
    for e in ergebnisse:
        if e[2]:
            print(f"  {e[0].quelle} in {e[0].szene} {e[0].feld}: {e[2]}")


if __name__ == "__main__":
    main()

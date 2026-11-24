"""Befehl: Wo sitzt oder liegt jemand, und verdeckt das Möbel die Figur richtig? (Vordergrund, 23.11.2026)

Warum: Wunsch des Autors: Wer sitzt, wird vom vorderen Teil seines Möbels verdeckt (Vorderkante,
Beine; von hinten die Lehne), wer liegt, von der Bettdecke. Die App legt dafür einen Ausschnitt des
Möbelbilds über die Figur (app/src/abenteuer/oberwelt/vordergrund.ts). Dieses Werkzeug findet alle
Stellen und prüft, ob es dort einen Vordergrund gibt:
- Sitzende aus den Szenen (`figuren[].sitzt`), aus den Tagesabläufen (`tut: sitzt`) und Liegende
  aus den Tagesabläufen (`tut: liegt`) und aus Ink (`#stelle:wer>x,y>liegt`).
- Je Stelle das Möbel unter dem Feld (Szene, Katalog moebel/*.json) und seine Art.
- Befund, wenn eine Sitzende auf einem Möbel sitzt, das keine Sitzart ist (kein Vordergrund), oder
  wenn eine Liegende kein Bett mit bekannter Kopfseite hat (KopfRechts/KopfLinks im Namen oder
  Katalogangabe `ende`, die Seite des Kopfendes eines waagrechten Betts).
  Sitzen am Boden (kein Möbel) braucht keinen Vordergrund.
Ausnahmen mit Grund stehen in GEPRUEFT. Dauertest (pipeline/tests): „0 Befunde“.

Regel je Blick (Korrektur 23.11.2026 nach Fotos aus dem Clubraum, wie vordergrund.ts):
- „unten“ (zum Betrachter): nichts davor.
- „links“/„rechts“: nur unter der Sitzfläche (Beine, Unterkante als 1-px-Kante); die Grenze ist die
  unterste Zeile des untersten Bands breiter Zeilen (sitzgrenze), sonst VORGABE_SEITE. Rumpf und
  Oberschenkel bleiben frei. Ruhende Tiere schauen „links“ und bekommen dieselbe Regel.
- „oben“ (Rücken zum Betrachter): die Lehne ab VORGABE_AB der sichtbaren Höhe; der Kopf ragt darüber.
Die Vorgaben sind dieselben wie in vordergrund.ts; ein Möbel im Katalog kann
`vordergrund: {"ab": …, "seite": …, "kopf": …}` tragen. Vorschaubilder vorher/nachher brauchen die
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
VORGABE_AB = {"stuhl": 0.55, "hocker": 0.45, "bank": 0.55, "sessel": 0.6, "sofa": 0.6, "couch": 0.6}
VORGABE_AB_SONST = 0.55
VORGABE_SEITE = 0.8
SITZFLAECHE_BREIT = 0.6  # Anteil der sichtbaren Breite, ab dem eine Zeile zur Sitzfläche zählt
SITZFLAECHE_ZEILEN = 2  # so viele breite Zeilen bilden eine Sitzfläche (eine Querstrebe ist eine)
KOPFSEITE = re.compile(r"Kopf(Rechts|Links|Ost|West)", re.IGNORECASE)
STELLE = re.compile(r"#stelle:([^>\s#]+)>(\d+),(\d+)>liegt")
# Stellen, die so stimmen (Szene, Feld) → Grund.
GEPRUEFT: dict[tuple[str, tuple[int, int]], str] = {
    ("crossroads-aussen", (34, 27)): "Mira sitzt auf dem Bordstein: niedrig wie der Boden, nichts verdeckt.",
    ("crossroads-aussen-gatter-offen", (34, 27)): "wie crossroads-aussen: Bordstein.",
}


@dataclass(frozen=True)
class Stelle:
    """Eine Figur, die sitzt oder liegt: Quelle, Szene, Feld, Haltung, Blick."""

    quelle: str
    szene: str
    feld: tuple[int, int]
    haltung: str
    richtung: str = ""


def sitzunterkante(deckend: list[int], oben: int, breite: int) -> int | None:
    """Unterste Zeile der Sitzfläche: von unten das erste Band aus SITZFLAECHE_ZEILEN breiten Zeilen.

    Eingaben: deckende Pixel je Zeile des sichtbaren Teils (von oben), dessen erste Zeile und Breite.
    Beispiel: Schulstuhl von der Seite, Sitzblock in den Zeilen 11 bis 13 → 13.
    """
    band = 0
    for i in range(len(deckend) - 1, -1, -1):
        band = band + 1 if deckend[i] >= breite * SITZFLAECHE_BREIT else 0
        if band >= SITZFLAECHE_ZEILEN:
            return oben + i + SITZFLAECHE_ZEILEN - 1
    return None


def sitzgrenze(deckend: list[int], sichtbar: tuple[int, int, int, int], richtung: str, art: str,
               angabe: dict | None = None) -> int | None:  # fmt: skip
    """Erste verdeckende Zeile im Rahmen je Blick (wie sitzausschnitt in vordergrund.ts), sonst None.

    ``sichtbar`` ist (x, y, Breite, Höhe) des sichtbaren Teils, ``deckend`` die deckenden Pixel je
    seiner Zeilen. Sonderfall: ``ab`` ab 1 im Katalog heißt kein Vordergrund.
    """
    angabe = angabe or {}
    _, y, breite, hoehe = sichtbar
    ab = angabe.get("ab", VORGABE_AB.get(art, VORGABE_AB_SONST))
    if richtung == "unten" or ab >= 1:
        return None
    if richtung == "oben":
        return round(y + hoehe * ab)
    if "seite" in angabe:
        return round(y + hoehe * angabe["seite"])
    gemessen = sitzunterkante(deckend, y, breite)
    return gemessen if gemessen is not None else round(y + hoehe * VORGABE_SEITE)


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
        szene = json.loads(datei.read_text(encoding="utf-8"))
        for b in szene.get("belebung", []):
            if b.get("typ") == "tier" and b.get("eigenschaften", {}).get("verhalten") in (
                "sitzen",
                "schlafen",
            ):
                gefunden.append(Stelle(f"tier {b['name']}", datei.stem, tuple(b["feld"]), "ruht"))
        for f in szene.get("figuren", []):
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
            feld = (int(x), int(y))
            gefunden.append(
                Stelle(f"ink {datei.stem} {wer}", karte_mit_bett(datei.stem, feld), feld, "liegt")
            )
    return gefunden


def karte_mit_bett(szene: str, feld: tuple[int, int]) -> str:
    """Die Karte, auf der ein ``#stelle … >liegt`` spielt: die gleichnamige, sonst eine Karte desselben
    Orts mit einem Bett unter dem Feld.

    Warum: Ein Dialog spielt nicht immer auf der Karte seines Namens. Die erste Nacht steht in
    maple-falls-dachboden.ink, spielt aber im Zimmer des Helden (Bett rv5BettKopfRechts auf 12,7).
    """
    moebel = katalog()
    if (unter := moebel_unter(szene, feld, moebel)) and "bett" in unter[0].lower():
        return szene
    ort = "-".join(szene.split("-")[:2])
    for pfad in sorted((WURZEL / "karten").glob(f"{ort}-*.json")):
        if (unter := moebel_unter(pfad.stem, feld, moebel)) and "bett" in unter[0].lower():
            return pfad.stem
    return szene


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
    if stelle.haltung == "ruht":
        # Tiere: auf einem Sitzmöbel der Vordergrund wie bei Sitzenden (belebungsschicht.ts), sonst nichts.
        if unter and art_von(*unter) in SITZARTEN:
            return f"{unter[0]}, Vordergrund", None
        return "kein Sitzmöbel (nichts zu verdecken)", None
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
    if "bett" in name.lower() and (KOPFSEITE.search(name) or angabe.get("ende") or "vordergrund" in angabe):
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

"""Türen in Menschengröße (KARTENREGELN 10.92): Die Tür eines Hauses draußen ist mindestens so groß
wie die Spielfigur.

Warum: Der Autor hat die Häuser der hinteren Reihe in Maple Falls auf 125 % vergrößert, bis die
Haustür groß genug für die Figur war, und daraus eine Regel gemacht (Antwort zu RO32, 16.11.2026):
„Die Tür eines Hauses auf einer Außenkarte ist mindestens so groß wie die Spielfigur (Breite und
Höhe).“

Maße:
- Spielfigur: der Held aus PixelLab (``spiel/figuren-neu/held-0/rotations/south.png``, Rahmen
  32 × 32), deckend 17 × 30 Figurenpixel. Seit Variante B (Wunsch des Autors, 16.11.2026) steht
  er mit 2/3 auf der Karte (``app/src/abenteuer/oberwelt/weltmassstab.ts``: zwei Bildschirmpixel
  je Figurenpixel, drei je Kartenpixel), also 17/1,5 × 30/1,5 = 11⅓ × 20 Kartenpixel. Vorher galt
  die LimeZu-Figur mit 16 × 22.
- Tür: Türrahmen außen im ungeskalierten Bild, abgelesen mit der Lupe („von Hand“) oder automatisch
  gemessen (``tuermessung.py``, „gemessen“, seit 17.11.2026), gespeichert in
  ``inhalte/abenteuer/katalog_korrekturen/tuermasse.json`` (öffentlich, ohne Pixel prüfbar). Der
  Maßstab des Eintrags (``massstab``) zählt mit. Gebäude ohne gemessene Tür prüft das Werkzeug nicht;
  ``--offen`` listet sie.

Beispiel: ``haus_hinten_b_blau.png`` hat eine Tür von 14 × 19 Pixeln: zu klein (Figur 11⅓ × 20); mit
``massstab`` 1.25 sind es 17,5 × 23,75, groß genug.

Aufruf: ``python -m pipeline.abenteuer.tuergroesse [--offen] [--bericht DATEI]``; im Kartenbau als
Hinweis „Tür … zu klein“, solange die Entscheidung über große Umbauten (Villen, Ladenfassaden) aussteht.
"""

import json
import sys
from collections import Counter
from functools import cache
from pathlib import Path

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
# Held in Figurenpixeln (deckend, von vorn) und sein Maßstab auf der Karte (Variante B).
HELD_BREITE, HELD_HOEHE = 17, 30
FIGUR_MASSSTAB = 2 / 3
FIGUR_BREITE, FIGUR_HOEHE = HELD_BREITE * FIGUR_MASSSTAB, HELD_HOEHE * FIGUR_MASSSTAB
GEBAEUDE = ("gebaeude", "haus")
BERICHTSKOPF = """# Türmaße der Gebäude auf Außenkarten (Regel 10.92), 17.11.2026

Erzeugt mit `python -m pipeline.abenteuer.tuergroesse --bericht <diese Datei>`. Türmaße aus
`inhalte/abenteuer/katalog_korrekturen/tuermasse.json`: „von Hand“ mit der Lupe abgelesen,
„gemessen“ automatisch (`python -m pipeline.abenteuer.tuermessung PRIVAT`) und im Bild geprüft.
Die Gebäude selbst sind unverändert; der nötige massstab ist ein Vorschlag.

"""


@cache
def tuerangaben() -> dict[str, dict]:
    """Dateiname des Gebäudebilds → Eintrag aus tuermasse.json (``rahmen``, ``herkunft``, ``grund``).

    Herkunft „von Hand“ (Lupe), „gemessen“ (``tuermessung.py``, im Bild geprüft) oder „verworfen“
    (Messung falsch, ohne Rahmen). Ältere Einträge als bloße Liste gelten als „von Hand“.
    Dasselbe Bild liegt im Paket teils in zwei Ordnern, deshalb zählt der Dateiname.
    """
    daten = json.loads((INHALTE / "katalog_korrekturen" / "tuermasse.json").read_text(encoding="utf-8"))
    return {
        Path(k).name: {"rahmen": v, "herkunft": "von Hand"} if isinstance(v, list) else v
        for k, v in daten.items()
        if not k.startswith("_")
    }


@cache
def tuermasse() -> dict[str, tuple[int, int, int, int]]:
    """Dateiname des Gebäudebilds → Türrahmen (nur Einträge mit ``rahmen``, also nicht „verworfen“)."""
    return {name: tuple(e["rahmen"]) for name, e in tuerangaben().items() if e.get("rahmen")}


def tuer_von(angabe: dict) -> tuple[int, int, int, int] | None:
    """Gemessener Türrahmen eines Katalogeintrags (None ohne Maß oder mit Ausschnitt)."""
    if "ausschnitt" in angabe:
        return None
    return tuermasse().get(Path(angabe.get("quelle", "")).name)


def pruefe_szene(szene: dict, moebel: dict) -> list[str]:
    """Hinweise: Häuser draußen, deren Tür (mit Maßstab) kleiner ist als die Figur."""
    if szene.get("art") != "aussen":
        return []
    befunde = []
    for eintrag in szene.get("objekte", []):
        angabe = moebel.get(eintrag["moebel"], {})
        tuer = tuer_von(angabe) if angabe.get("art") in GEBAEUDE else None
        if not tuer:
            continue
        massstab = float(eintrag.get("massstab", 1))
        breite, hoehe = (tuer[2] - tuer[0]) * massstab, (tuer[3] - tuer[1]) * massstab
        if breite < FIGUR_BREITE or hoehe < FIGUR_HOEHE:
            noetig = max(FIGUR_BREITE / (tuer[2] - tuer[0]), FIGUR_HOEHE / (tuer[3] - tuer[1]))
            befunde.append(
                f"Tür von {eintrag['moebel']} {tuple(eintrag.get('feld', ()))} ist {breite:g} × {hoehe:g} "
                f"Pixel, kleiner als die Figur ({FIGUR_BREITE:.3g} × {FIGUR_HOEHE:.3g}): massstab mindestens "
                f"{noetig:.2f} (Regel 10.92)"
            )
    return befunde


def offen(szene: dict, moebel: dict) -> set[str]:
    """Gebäudebilder einer Außenkarte ohne gemessene Tür."""
    if szene.get("art") != "aussen":
        return set()
    return {
        Path(moebel[e["moebel"]]["quelle"]).name
        for e in szene.get("objekte", [])
        if moebel.get(e["moebel"], {}).get("art") in GEBAEUDE and not tuer_von(moebel[e["moebel"]])
    }


def gebaeude_auf_karten(moebel: dict) -> dict[str, dict]:
    """Je Gebäude (Möbelkennung) auf Außenkarten: Bild, Karten mit Feld und Maßstab.

    Beispiel: {"mf4Diner": {"bild": "fassade_diner.png", "orte": [("mapleFalls.aussen", (30, 14), 1.0)]}}.
    """
    ergebnis: dict[str, dict] = {}
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        if szene.get("art") != "aussen":
            continue
        for e in szene.get("objekte", []):
            angabe = moebel.get(e["moebel"], {})
            if angabe.get("art") not in GEBAEUDE or "ausschnitt" in angabe:
                continue
            eintrag = ergebnis.setdefault(e["moebel"], {"bild": Path(angabe["quelle"]).name, "orte": []})
            ort = (pfad.stem, tuple(e.get("feld", ())), float(e.get("massstab", 1)))
            if ort not in eintrag["orte"]:
                eintrag["orte"].append(ort)
    return ergebnis


def _zeile_zu_klein(kennung: str, g: dict, angabe: dict) -> str | None:
    """Tabellenzeile für ein Gebäude, dessen Tür auf mindestens einer Karte zu klein ist, sonst None."""
    tb, th = angabe["rahmen"][2] - angabe["rahmen"][0], angabe["rahmen"][3] - angabe["rahmen"][1]
    noetig = max(FIGUR_BREITE / tb, FIGUR_HOEHE / th)
    zu_klein = [o for o in g["orte"] if o[2] < noetig]
    if not zu_klein:
        return None
    orte = ", ".join(f"{datei} {feld} ×{m:g}" for datei, feld, m in zu_klein)
    return f"| {kennung} | {g['bild']} | {tb} × {th} | {angabe['herkunft']} | {noetig:.2f} | {orte} |"


def liste_zu_klein(gebaeude: dict, angaben: dict) -> list[str]:
    """Je zu kleiner Tür auf einer Karte eine Zeile: Gebäude, Karte, Feld, massstab jetzt und nötig.

    Beispiel: „mf4Diner auf maple-falls-aussen (30, 14): massstab 1 → mindestens 1.18“.
    """
    zeilen = []
    for kennung, g in sorted(gebaeude.items()):
        rahmen = angaben.get(g["bild"], {}).get("rahmen")
        if not rahmen:
            continue
        noetig = max(FIGUR_BREITE / (rahmen[2] - rahmen[0]), FIGUR_HOEHE / (rahmen[3] - rahmen[1]))
        zeilen += [
            f"- {kennung} auf {datei} {feld}: massstab {m:g} → mindestens {noetig:.2f}"
            for datei, feld, m in g["orte"]
            if m < noetig
        ]
    return zeilen


def bericht(moebel: dict) -> str:
    """Bericht (Markdown): zu kleine Türen je Gebäude mit Karten und nötigem Maßstab, dann Gebäude
    ohne Maß mit Grund. Grundlage für ``docs/spiel/auftraege/rueckmeldung/tuermasse_17-11.md``."""
    angaben, gebaeude = tuerangaben(), gebaeude_auf_karten(moebel)
    zeilen_klein, ohne, gut = [], [], 0
    for kennung, g in sorted(gebaeude.items()):
        angabe = angaben.get(g["bild"], {})
        if not angabe.get("rahmen"):
            grund = angabe.get("grund", "noch nicht gemessen")
            ohne.append(f"| {kennung} | {g['bild']} | {angabe.get('herkunft', 'offen')} | {grund} |")
        elif zeile := _zeile_zu_klein(kennung, g, angabe):
            zeilen_klein.append(zeile)
        else:
            gut += 1
    figur = f"{FIGUR_BREITE:.3g} × {FIGUR_HOEHE:.3g}"
    stand = Counter(e["herkunft"] for e in angaben.values())
    stand_text = ", ".join(f"{n} {h}" for h, n in sorted(stand.items()))
    return "\n".join(
        [
            f"Stand der Türmaße (Gebäudebilder): {stand_text}.",
            "",
            f"## Türen kleiner als die Figur ({figur} Kartenpixel)",
            "",
            f"{len(zeilen_klein)} Gebäude; Tür im ungeskalierten Bild, „nötig“ ist der kleinste",
            f"massstab, bei dem die Tür die Figur fasst. Groß genug: {gut} Gebäude.",
            "",
            "| Gebäude | Bild | Tür | Herkunft | nötig | Karten (Feld, massstab jetzt) |",
            "| ------- | ---- | --- | -------- | ----- | ----------------------------- |",
            *zeilen_klein,
            "",
            f"## Gebäude ohne Türmaß ({len(ohne)})",
            "",
            "| Gebäude | Bild | Stand | Grund |",
            "| ------- | ---- | ----- | ----- |",
            *ohne,
            "",
            "## Liste: alle zu kleinen Türen (Gebäude, Karte, Feld, nötiger massstab)",
            "",
            *liste_zu_klein(gebaeude, angaben),
            "",
        ]
    )


def main(argumente: list[str]) -> int:
    from pipeline.abenteuer.moebelliste import lade_moebel

    moebel, anzahl, ohne = lade_moebel(), 0, set()
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        for b in pruefe_szene(szene, moebel):
            print(f"{pfad.name}: {b}")
            anzahl += 1
        ohne |= offen(szene, moebel)
    if "--bericht" in argumente:
        datei = Path(argumente[argumente.index("--bericht") + 1])
        datei.write_text(BERICHTSKOPF + bericht(moebel), encoding="utf-8")
        print(f"Bericht in {datei}")
    if "--offen" in argumente:
        print("Ohne gemessene Tür:", ", ".join(sorted(ohne)))
    print(f"{anzahl} Türen kleiner als die Figur, {len(ohne)} Gebäudebilder ohne Maß")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

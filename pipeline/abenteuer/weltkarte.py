"""Weltkarte des Schach-Abenteuers: alle Karten als Bilder mit ihren Ausgängen auf einer Seite.

Warum: Der Haupt-Chat und der Autor wollen sehen, wie die Karten zusammenhängen (welcher Ausgang
wohin führt, welche Reise mit Bus, Zug oder Fähre), mit allen Zuständen einer Karte. Bisher lag das
als Skript mit festen Arbeitsordnern beim Haupt-Chat; jetzt ist es ein Werkzeug (Auftrag des
Haupt-Chats, 13.11.2026).

Aufruf: ``python -m pipeline.abenteuer.weltkarte PRIVAT ZIEL [--orte mapleFalls,cedarCreek,…]``.
PRIVAT ist das private Grafikpaket (wie bei kartenbild.py), ZIEL ein Ordner. Geschrieben werden
``ZIEL/bilder/<kennung>[-<zustand>].png`` (Vorschau mit Möbeln, kartenbild.zeichne),
``ZIEL/daten.json`` und ``ZIEL/weltkarte.html`` (Vorlage weltkarte_vorlage.html mit eingebetteten
Daten). Ins private Paket wird nichts geschrieben. ``--orte`` grenzt auf Orte und Wege ein
(Präfix der Kartenkennung); Ausgänge zu Karten außerhalb fallen dann weg.

Datenformat je Karte (gelesen von der Vorlage): id, name, ort, w/h (Bildgröße), k (Pixel je Kachel),
tb/th (Kacheln), f (Fassungen: n Name, d Bild, t Zustandssatz), a (Ausgänge: n Auslöser, art „weg“
oder „reise“, z Zielkarte, za Zielauslöser, x/y/b/h Feld der Auslöser, zm Mitte des Ziels oder null).
"""

import json
import re
import sys
from pathlib import Path

from pipeline.abenteuer import uebergaenge
from pipeline.abenteuer.zustaende import bildname
from pipeline.abenteuer.zustaende import liste as zustandsliste

HAUPT = Path(__file__).resolve().parents[2]
INHALTE = HAUPT / "inhalte" / "abenteuer"
VORLAGE = Path(__file__).with_name("weltkarte_vorlage.html")
PLATZHALTER = "/*DATEN*/[]"
START = "mapleFalls.dachboden"
# Wie tief Dialogknoten verfolgt werden, um Reisen (~ reise("karte", "auslöser")) zu finden.
KNOTENTIEFE = 4
REISE = re.compile(r'~\s*reise\("([^"]+)",\s*"([^"]+)"\)')
HALBE = 0.5


def knotentext(ink: dict[str, str], datei: str, name: str, tiefe: int = KNOTENTIEFE, gesehen=None) -> str:
    """Text eines Ink-Knotens samt der Knoten, zu denen er springt (bis ``tiefe``).

    Beispiel: maple-falls-aussen.bus → Text von „bus“ und „bus_fahrt“, darin ``~ reise(…)``.
    """
    gesehen = set() if gesehen is None else gesehen
    if (datei, name) in gesehen or datei not in ink:
        return ""
    gesehen.add((datei, name))
    treffer = re.search(r"^===\s*" + re.escape(name) + r"\s*===\s*$(.*?)(?=^===|\Z)", ink[datei], re.M | re.S)
    if not treffer:
        return ""
    text = treffer.group(1)
    if tiefe:
        for ziel in sorted(set(re.findall(r"->\s*([a-z_0-9]+)", text))):
            text += knotentext(ink, datei, ziel, tiefe - 1, gesehen)
    return text


def mitte(felder: list[tuple[int, int]]) -> list[float]:
    """Mitte einer Gruppe von Feldern in Kacheln (Ziel des Pfeils)."""
    return [
        sum(f[0] for f in felder) / len(felder) + HALBE,
        sum(f[1] for f in felder) / len(felder) + HALBE,
    ]


def _ziele(regel: dict, ink: dict[str, str]) -> list[tuple[str, str | None, str]]:
    """(Zielkarte, Zielauslöser, Art) eines Auslösers: Übergang direkt, Dialog über seine Reisen."""
    if regel["art"] == "uebergang":
        return [(regel["ziel"]["karte"], regel["ziel"].get("ausloeser"), "weg")]
    if not regel.get("dialog"):
        return []
    datei, _, knoten = regel["dialog"].partition(".")
    return [(k, a, "reise") for k, a in dict.fromkeys(REISE.findall(knotentext(ink, datei, knoten)))]


def ausgaenge(kennung: str, szene: dict, szenen: dict, regeln: list[dict], ink: dict) -> list[dict]:
    """Die Ausgänge einer Karte zu Karten in ``szenen`` (Reisen zur eigenen Karte zählen nicht)."""
    ergebnis = []
    for name in sorted({a["name"] for a in szene.get("ausloeser", [])}):
        regel = uebergaenge.regel_fuer(regeln, kennung, name)
        if not regel:
            continue
        felder = uebergaenge.felder(szene, name)
        xs, ys = [f[0] for f in felder], [f[1] for f in felder]
        for ziel, zielausloeser, art in _ziele(regel, ink):
            if ziel not in szenen or (ziel == kennung and art == "reise"):
                continue
            zielfelder = uebergaenge.felder(szenen[ziel], zielausloeser) if zielausloeser else []
            ergebnis.append(
                {
                    "n": name,
                    "art": art,
                    "z": ziel,
                    "za": zielausloeser,
                    "x": min(xs),
                    "y": min(ys),
                    "b": max(xs) - min(xs) + 1,
                    "h": max(ys) - min(ys) + 1,
                    "zm": mitte(zielfelder) if zielfelder else None,
                }
            )
    return ergebnis


def kartendaten(
    szenen: dict[str, dict],
    zustaende: list[dict],
    groessen: dict[str, tuple[int, int]],
    regeln: list[dict],
    texte: dict[str, str],
    ink: dict[str, str],
) -> list[dict]:
    """Die Daten der Weltkarte (Format im Dateikopf); nur Karten mit Bild (``groessen``).

    Eingaben: Grundszenen je Kennung, Zustandsliste (zustaende.liste), Bildgröße je Bildname,
    Übergänge und Dialogauslöser (regeln), Spieltexte, Ink-Texte je Datei.
    """
    karten = {}
    for kennung, szene in szenen.items():
        if kennung not in groessen:
            continue
        breite, hoehe = groessen[kennung]
        kacheln_breit = max(len(z) for z in szene["raster"])
        fassungen = [{"n": "Grundzustand", "d": f"bilder/{kennung}.png"}]
        for z in zustaende:
            name = f"{kennung}-{z['zustand']}"
            if z["karte"] == kennung and name in groessen:
                satz = z.get("satz") or ""
                satz = satz[:1].upper() + satz[1:]
                fassungen.append({"n": z["zustand"], "d": f"bilder/{name}.png", "t": satz})
        karten[kennung] = {
            "id": kennung,
            "name": texte.get(f"ort.{kennung}", kennung),
            "ort": texte.get(f"ort.{kennung.split('.')[0]}.name", ""),
            "w": breite,
            "h": hoehe,
            "k": breite / kacheln_breit,
            "tb": kacheln_breit,
            "th": len(szene["raster"]),
            "f": fassungen,
            "a": [],
        }
    for kennung, karte in karten.items():
        karte["a"] = ausgaenge(kennung, szenen[kennung], {k: szenen[k] for k in karten}, regeln, ink)
    return list(karten.values())


def erreichbar(karten: list[dict], start: str = START) -> set[str]:
    """Alle Karten, die vom Start über Ausgänge erreichbar sind (Prüfung in der Ausgabe)."""
    nach = {k["id"]: k for k in karten}
    erreicht, offen = {start}, [start]
    while offen:
        for a in nach.get(offen.pop(), {}).get("a", []):
            if a["z"] not in erreicht:
                erreicht.add(a["z"])
                offen.append(a["z"])
    return erreicht


def html(karten: list[dict]) -> str:
    """Die Seite mit eingebetteten Daten (Platzhalter ``/*DATEN*/[]`` der Vorlage)."""
    vorlage = VORLAGE.read_text(encoding="utf-8")
    if PLATZHALTER not in vorlage:
        raise ValueError(f"{VORLAGE.name}: Platzhalter {PLATZHALTER} fehlt")
    # „</“ im JSON würde das Skript beenden; als Unicode-Folge bleibt es dasselbe JSON.
    daten = json.dumps(karten, ensure_ascii=False).replace("</", "<\\/")
    return vorlage.replace(PLATZHALTER, daten)


def regeln() -> list[dict]:
    """Übergänge und alle Auslöser mit Dialog, je mit Ort; Reisen beginnen als Dialog."""
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    return [
        {**a, "ort": o["kennung"]}
        for o in orte
        for a in o.get("ausloeser", [])
        if a.get("art") == "uebergang" or a.get("dialog")
    ]


def _alle_szenen() -> list[dict]:
    """Alle Szenen der Grundkarten und Zustände (keine Varianten B und C)."""
    return [json.loads(p.read_text(encoding="utf-8")) for p in sorted((INHALTE / "szenen").glob("*.json"))]


def rendere(privat: Path, bilder: Path, szenen: list[dict]) -> dict[str, tuple[int, int]]:
    """Zeichnet je Szene die Vorschau nach ``bilder``; Ausgabe: Bildname → Größe in Pixeln."""
    from pipeline.abenteuer.kartenbild import zeichne  # Pillow und Grafik erst beim Zeichnen

    bilder.mkdir(parents=True, exist_ok=True)
    groessen = {}
    for szene in szenen:
        name, spielbild = bildname(szene)
        if not spielbild:
            continue
        try:
            _, bild, _ = zeichne(szene, privat)
        except FileNotFoundError as fehler:
            # Ein fehlendes Bild im Paket betrifft nur diese Karte; die Weltkarte entsteht ohne sie.
            print(f"{name}: nicht gezeichnet, Bild fehlt im Paket: {fehler.filename}")
            continue
        bild.convert("RGB").save(bilder / f"{name}.png")
        groessen[name] = bild.size
        print(f"{name}: gezeichnet")
    return groessen


def main(argv: list[str]) -> int:
    orte = None
    if "--orte" in argv:
        i = argv.index("--orte")
        orte = set(argv[i + 1].split(","))
        argv = argv[:i] + argv[i + 2 :]
    if len(argv) != 2:
        print(__doc__)
        return 1
    privat, ziel = Path(argv[0]), Path(argv[1])
    passt = (lambda k: k.split(".")[0] in orte) if orte else (lambda k: True)
    szenen = [s for s in _alle_szenen() if passt(s["karte"]) and not s.get("variante")]
    groessen = rendere(privat, ziel / "bilder", szenen)
    grund = {k: s for k, s in uebergaenge.szenen().items() if passt(k)}
    texte = json.loads((INHALTE / "texte" / "de.json").read_text(encoding="utf-8"))
    ink = {p.stem: p.read_text(encoding="utf-8") for p in (INHALTE / "dialoge" / "de").glob("*.ink")}
    zustaende, _ = zustandsliste()
    karten = kartendaten(grund, zustaende, groessen, regeln(), texte, ink)
    (ziel / "daten.json").write_text(json.dumps(karten, ensure_ascii=False), encoding="utf-8")
    (ziel / "weltkarte.html").write_text(html(karten), encoding="utf-8")
    zahl = sum(len(k["a"]) for k in karten)
    reisen = sum(1 for k in karten for a in k["a"] if a["art"] == "reise")
    print(f"{len(karten)} Karten, {zahl} Ausgänge, davon {reisen} Reisen → {ziel / 'weltkarte.html'}")
    if any(k["id"] == START for k in karten):
        fehlt = sorted({k["id"] for k in karten} - erreichbar(karten))
        print(f"Vom Dachboden nicht erreichbar: {', '.join(fehlt) or 'keine'}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

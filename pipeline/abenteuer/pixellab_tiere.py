"""PixelLab-Tiere: Bögen im Spielformat aus den Exporten des Autors, Maße für tierarten.json.

Warum: Der Autor hat die Tiere in PixelLab neu gemacht (Auftrag des Hauptchats, 23.11.2026, nach
buch/arbeit/tiere/plan.md). Die Exporte liegen im privaten Repository als
``ki-roh/selected_characters*.zip``; welche Gruppe welche Art ist, steht in
``ki-roh/zuordnung_23-11.json`` (Namen „tier.<art>“). Dieses Werkzeug liest die ZIP-Dateien
direkt, wählt je Art die Zustände nach ``pixellab_tierwahl.WAHL`` und schreibt den Bogen nach
``spiel/tiere/<art>.png`` (wie belebungsbilder.py die übrigen Tiere).

Bogen (Rahmen F × F, 24 Rahmen breit, Richtungen rechts, oben, links, unten):
- Reihe 0: vier Standbilder, Reihe 1: Bewegung, sechs Bilder je Richtung (PixelLab liefert 9 oder
  15; gleichmäßig ausgewählt), Reihe 2: Zustände (je vier Bilder in der Ordnung von
  ``zustaende``), Reihe 3: Schwimmen still, Reihe 4: Schwimmen in Bewegung (nur Schwimmer).
- F ist die Leinwand der Art plus ein Rand, damit ausladende Flügel nicht abgeschnitten werden; die
  Animationsbilder (größer als die Leinwand, Leinwand mittig, geprüft am 23.11.2026) werden auf
  dieselbe Mitte gelegt.
- Fehlt eine Richtung, wird links aus rechts gespiegelt (und umgekehrt); fehlt oben oder unten,
  gilt die Seitenansicht; gibt es nur unten, gilt sie für alle.
- Wasser der Schwimmbilder: auf unsere Palette gezogen (pixellab_wasser.py).

Aufruf: ``python -m pipeline.abenteuer.pixellab_tiere PRIVAT [--tierarten]`` (``--tierarten``
schreibt die Maße nach app/src/abenteuer/oberwelt/tierarten.json; danach im Ordner app
``npx prettier --write src/abenteuer/oberwelt/tierarten.json``).
Abhängigkeiten: Pillow, pixellab_tierwahl.py, pixellab_wasser.py, tierplan.py (Zielhöhen).
"""

import io
import json
import sys
import zipfile
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

from pipeline.abenteuer import pixellab_wasser as wasser
from pipeline.abenteuer.pixellab_tierwahl import WAHL, Wahl

ZUORDNUNG = "ki-roh/zuordnung_23-11.json"
RICHTUNGEN = ("east", "north", "west", "south")  # Reihenfolge im Bogen wie LimeZu
GEGENUEBER = {"east": "west", "west": "east"}
SPALTEN = 24
BILDER = 6  # Bewegungsbilder je Richtung
WIPPEN = (0, 1, 1, 0, 1, 1)  # wie belebungsbilder.py: Standbild hebt sich um 1 Pixel
REIHE_ZUSTAENDE = 2
REIHE_SCHWIMMEN = 3
DECKEND_AB = wasser.DECKEND_AB
# Bevorzugte Animation, wenn ein Zustand mehrere hat (Schwein: Traben statt Rennen).
VORZUG = ("trot", "walk")


def _norm(name: str) -> str:
    """Zustandsname klein, ohne Anführungszeichen: „„swimming sl“ → „swimming sl“."""
    return name.lower().strip('„“" ')


@dataclass
class Export:
    """Eine Tiergruppe im ZIP: Zugriff auf Standbilder und Animationen ihrer Zustände."""

    zip: zipfile.ZipFile
    zustaende: list[dict]

    def zustand(self, kurz: str) -> dict:
        """Der Zustand, dessen Name mit ``kurz`` beginnt (KeyError, wenn keiner)."""
        for z in self.zustaende:
            if _norm(z["name"]).startswith(kurz):
                return z
        raise KeyError(f"Zustand „{kurz}“ fehlt: {[z['name'] for z in self.zustaende]}")

    def _bild(self, pfad: str) -> Image.Image | None:
        try:
            return Image.open(io.BytesIO(self.zip.read(pfad))).convert("RGBA")
        except KeyError:
            return None

    def standbild(self, z: dict, richtung: str) -> Image.Image | None:
        return self._bild(f"{z['ordner']}/rotations/{richtung}.png")

    def animation(self, z: dict, richtung: str) -> list[Image.Image]:
        """Alle Bilder der (bevorzugten) Animation eines Zustands in einer Richtung, sonst []."""
        namen = sorted(z["animationen"], key=lambda n: not any(v in n.lower() for v in VORZUG))
        if not namen or richtung not in z["animationen"][namen[0]]:
            return []
        anzahl = z["animationen"][namen[0]][richtung]
        bilder = [
            self._bild(f"{z['ordner']}/animations/{namen[0]}/{richtung}/frame_{i:03d}.png")
            for i in range(anzahl)
        ]
        return [b for b in bilder if b is not None]


def lade_exporte(privat: Path) -> dict[str, tuple[Export, int]]:
    """Art → (Export, Leinwand) für alle Tiergruppen der Zuordnung (doppelte Gruppen einmal)."""
    daten = json.loads((privat / ZUORDNUNG).read_text(encoding="utf-8"))
    zips: dict[str, zipfile.ZipFile] = {}
    exporte = {}
    for g in daten["gruppen"]:
        if not g["name"].startswith("tier.") or g["name"][5:] in exporte:
            continue
        datei = zips.setdefault(g["zip"], zipfile.ZipFile(privat / g["zip"]))
        exporte[g["name"][5:]] = (Export(datei, g["zustaende"]), g["zustaende"][0]["groesse"])
    return exporte


def mit_richtungen(hole) -> dict[str, list[Image.Image]]:
    """Bilder je Richtung mit Ersatz (siehe Dateikopf). ``hole(richtung) -> list``; leer = fehlt."""
    roh = {r: hole(r) for r in RICHTUNGEN}
    seite = roh["east"] or [b.transpose(Image.Transpose.FLIP_LEFT_RIGHT) for b in roh["west"]]
    fertig: dict[str, list[Image.Image]] = {}
    for r in RICHTUNGEN:
        if roh[r]:
            fertig[r] = roh[r]
        elif r in GEGENUEBER and roh[GEGENUEBER[r]]:
            fertig[r] = [b.transpose(Image.Transpose.FLIP_LEFT_RIGHT) for b in roh[GEGENUEBER[r]]]
        else:
            fertig[r] = seite or roh["south"] or roh["north"]
    if not fertig["east"]:  # nur oben oder unten vorhanden
        for r in ("east", "west"):
            fertig[r] = roh["south"] or roh["north"]
    return fertig


def sechs(bilder: list[Image.Image]) -> list[Image.Image]:
    """Sechs Bilder gleichmäßig aus einer Animation. Beispiel: 9 → Bilder 0, 2, 3, 5, 6, 8."""
    n = len(bilder)
    return [bilder[min(n - 1, int(i * n / BILDER + 0.5))] for i in range(BILDER)]


def standbilder(e: Export, kurz: str) -> dict[str, list[Image.Image]]:
    z = e.zustand(kurz)
    return mit_richtungen(lambda r: [b] if (b := e.standbild(z, r)) else [])


def bewegung(e: Export, spec: str) -> dict[str, list[Image.Image]]:
    """Sechs Bewegungsbilder je Richtung nach der Angabe der Tabelle (Animation, wippen, wechsel)."""
    teile = spec.split(":")
    if teile[0] == "wippen":
        stand = standbilder(e, teile[1])
        return {r: [_gehoben(b[0], h) for h in WIPPEN] for r, b in stand.items()}
    if teile[0] == "wechsel":
        a, b = standbilder(e, teile[1]), standbilder(e, teile[2])
        return {r: [a[r][0], a[r][0], b[r][0], b[r][0], b[r][0], a[r][0]] for r in RICHTUNGEN}
    z = e.zustand(spec)
    return {r: sechs(b) for r, b in mit_richtungen(lambda r: e.animation(z, r)).items()}


def _gehoben(bild: Image.Image, pixel: int) -> Image.Image:
    neu = Image.new("RGBA", bild.size)
    neu.paste(bild, (0, -pixel))
    return neu


@dataclass
class Teile:
    """Alle Bilder einer Art vor dem Zusammensetzen (je Reihe: Richtung → Bilder)."""

    stand: dict[str, list[Image.Image]]
    bewegung: dict[str, list[Image.Image]]
    zustaende: list[dict[str, list[Image.Image]]]
    schwimmen: dict[str, list[Image.Image]] | None
    schwimmbewegung: dict[str, list[Image.Image]] | None


# Ruhezustände der Exporte (Namensanfang) → Verhalten der Belebung, in Bogenreihenfolge.
RUHEZUSTAENDE = {"sitzen": "sitting", "schlafen": "sleeping", "grasen": "grazing"}


def ruhezustaende(e: Export, w: Wahl) -> dict[str, str]:
    """Alle vorhandenen Ruhezustände einer Art (sitzen, schlafen, grasen), nicht nur die genutzten.

    Warum: Im Editor wählt der Autor den Zustand je Tier (mittel-1, Hauptchat 23.11.2026); dafür
    muss Reihe 2 jeden Ruhezustand haben, den PixelLab geliefert hat. Eine Wahl in der Tabelle geht
    vor (eigener Zustandsname). Beispiel Kuh: sitzen, grasen; Katze: sitzen, schlafen.
    """
    namen = [_norm(z["name"]) for z in e.zustaende]
    gefunden = {v: k for v, k in RUHEZUSTAENDE.items() if any(n.startswith(k) for n in namen)}
    return {
        v: w.zustaende.get(v, gefunden.get(v, "")) for v in RUHEZUSTAENDE if v in w.zustaende or v in gefunden
    }


def teile_von(e: Export, w: Wahl) -> Teile:
    """Die Bilder einer Art nach ihrer Wahl, Schwimmbilder mit umgefärbtem Wasser."""
    zustaende = [standbilder(e, k) for k in ruhezustaende(e, w).values()]
    schwimm = schwimmbew = None
    if w.schwimmen:
        schwimm = standbilder(e, w.schwimmen)
        schwimmbew = bewegung(e, w.schwimmen)
    t = Teile(standbilder(e, w.stand), bewegung(e, w.bewegung), zustaende, schwimm, schwimmbew)
    if w.schwimmen:
        _faerbe(e, w, t)
    return t


def _faerbe(e: Export, w: Wahl, t: Teile) -> None:
    """Wasser in allen Bildern, die aus dem Schwimmzustand kommen, auf die Palette ziehen."""
    schutz = [
        b
        for z in e.zustaende
        if "swimming" not in _norm(z["name"])
        for r in RICHTUNGEN
        if (b := e.standbild(z, r))
    ]
    farben = wasser.tierfarben_aus(schutz)
    reihen = [t.schwimmen, t.schwimmbewegung]
    if w.stand.startswith("swimming"):
        reihen.append(t.stand)
    if w.bewegung.startswith("swimming"):
        reihen.append(t.bewegung)
    alle = [b for reihe in reihen if reihe for bilder in reihe.values() for b in bilder]
    hell = wasser.mittlere_helligkeit(alle, farben)
    for reihe in reihen:
        if reihe:
            for r, bilder in reihe.items():
                reihe[r] = [wasser.umfaerben(b, farben, w.wasser, hell) for b in bilder]


def _alle(t: Teile) -> list[Image.Image]:
    reihen = [t.stand, t.bewegung, *t.zustaende, t.schwimmen or {}, t.schwimmbewegung or {}]
    return [b for reihe in reihen for bilder in reihe.values() for b in bilder]


def rahmen(t: Teile, leinwand: int) -> int:
    """Rahmengröße: Leinwand plus gerader Rand für alles, was über sie hinausragt (mittig gelegt)."""
    rand = 0
    for b in _alle(t):
        kasten = b.getchannel("A").point(lambda a: 255 if a >= DECKEND_AB else 0).getbbox()
        if not kasten:
            continue
        versatz = (b.width - leinwand) // 2
        links, oben, rechts, unten = (k - versatz for k in kasten)
        rand = max(rand, -links, -oben, rechts - leinwand, unten - leinwand)
    return leinwand + 2 * (rand + rand % 2)


def setze(bogen: Image.Image, bild: Image.Image, spalte: int, reihe: int, f: int) -> None:
    """Ein Bild mittig in Rahmen (spalte, reihe) legen (Mitte der Leinwand = Mitte des Rahmens)."""
    x = spalte * f + (f - bild.width) // 2
    y = reihe * f + (f - bild.height) // 2
    bogen.alpha_composite(bild, (x, y)) if x >= 0 and y >= 0 else bogen.paste(bild, (x, y), bild)


def bogen(t: Teile, leinwand: int) -> Image.Image:
    """Der fertige Bogen (siehe Dateikopf)."""
    f = rahmen(t, leinwand)
    reihen = REIHE_SCHWIMMEN + 2 if t.schwimmen else (REIHE_ZUSTAENDE + 1 if t.zustaende else 2)
    ziel = Image.new("RGBA", (SPALTEN * f, reihen * f))
    for i, r in enumerate(RICHTUNGEN):
        setze(ziel, t.stand[r][0], i, 0, f)
        for j, b in enumerate(t.bewegung[r]):
            setze(ziel, b, i * BILDER + j, 1, f)
        for k, zustand in enumerate(t.zustaende):
            setze(ziel, zustand[r][0], k * len(RICHTUNGEN) + i, REIHE_ZUSTAENDE, f)
        if t.schwimmen and t.schwimmbewegung:
            setze(ziel, t.schwimmen[r][0], i, REIHE_SCHWIMMEN, f)
            for j, b in enumerate(t.schwimmbewegung[r]):
                setze(ziel, b, i * BILDER + j, REIHE_SCHWIMMEN + 1, f)
    return ziel


def _kasten(bilder: list[Image.Image]) -> tuple[int, int, int, int]:
    """Gemeinsamer Kasten (links, oben, rechts, unten) der deckenden Pixel mehrerer Bilder."""
    kaesten = [
        k for b in bilder if (k := b.getchannel("A").point(lambda a: 255 if a >= DECKEND_AB else 0).getbbox())
    ]
    return (
        min(k[0] for k in kaesten),
        min(k[1] for k in kaesten),
        max(k[2] for k in kaesten),
        max(k[3] for k in kaesten),
    )


def gemessene_groesse(e: Export, w: Wahl, t: Teile) -> tuple[int, int]:
    """Höhe und Länge des gezeichneten Tiers in den Standbildern von der Seite (rechts, links), px.

    Warum gemessen statt der Leinwand: Der Autor konnte die Leinwand nicht immer wie geplant
    einstellen (Hauptchat, 23.11.2026); zählt, was gezeichnet ist. Warum nur die Seite: Die
    Zielhöhe ist der Scheitel im Stehen (tierplan_daten.py); von oben oder unten zählte bei langen
    Tieren die Körperlänge mit (Alligator 54 statt 34 px). Wer nur schwimmt, wird ohne Wasser
    gemessen (Idle; Beispiel Delfin), damit die Wasserfläche den Maßstab nicht verfälscht.
    """
    stand = standbilder(e, "idle") if w.stand.startswith("swimming") else t.stand
    kaesten = [_kasten([stand[r][0]]) for r in ("east", "west")]
    return max(k[3] - k[1] for k in kaesten), max(k[2] - k[0] for k in kaesten)


# Ab diesem Verhältnis Länge zu Höhe (echte Maße, tierplan_daten) bestimmt auch die Länge den Maßstab.
LANG_AB = 1.5
# Höchste Vergrößerung; darüber ist das Bild zu klein erzeugt und wird gemeldet (Hauptchat).
HOECHSTENS_VERGROESSERN = 1.1


def massstab(art: str, hoehe: int, laenge: int) -> tuple[float, str]:
    """Faktor, mit dem das Tier im Spiel die Zielhöhe des Tierplans hat, und wonach er sich richtet.

    Lange Tiere (Alligator, Delfin, Dackel) dürfen auch die Ziellänge nicht überschreiten: dann
    gilt der kleinere der beiden Faktoren. Ein Faktor für den ganzen Bogen (Bewegung und Zustände
    springen nicht). Beispiel: Ente, Höhe 21, Ziel 11 → 0.52 nach der Höhe.
    """
    from pipeline.abenteuer import tierplan
    from pipeline.abenteuer.tierplan_daten import ARTEN

    a = ARTEN[art]
    nach_hoehe = tierplan.zielhoehe(a) / hoehe
    if a.laenge >= LANG_AB * a.hoehe:
        nach_laenge = tierplan.ziellaenge(a) / laenge
        if nach_laenge < nach_hoehe:
            return round(nach_laenge, 2), "laenge"
    return round(nach_hoehe, 2), "hoehe"


def eintrag(art: str, e: Export, leinwand: int, w: Wahl, t: Teile) -> dict:
    """Eintrag für tierarten.json: Rahmen, Maßstab (massstab()), gemessene Höhe und Länge,
    Fußzeile, Zustände, Schwimmen. Beispiel Ente: Rahmen 36, gemessen 21, Ziel 11 → 0.52."""
    f = rahmen(t, leinwand)
    hoehe, laenge = gemessene_groesse(e, w, t)
    faktor, nach = massstab(art, hoehe, laenge)
    rand = (f - leinwand) // 2
    daten: dict = {
        "quelle": ZUORDNUNG + "#tier." + art,
        "breite": f,
        "hoehe": f,
        "schnitt": "pixellab",
        "massstab": faktor,
        "massstab_nach": nach,
        "gemessen": hoehe,
        "gemessen_laenge": laenge,
        "fuss": rand + _kasten([b[0] for b in t.stand.values()])[3],
    }
    if ruhe := ruhezustaende(e, w):
        daten["zustaende"] = list(ruhe)
    if t.schwimmen:
        oben, unten = _kasten([b[0] for b in t.schwimmen.values()])[1::2]
        daten["schwimmen"] = {"mitte": rand + (oben + unten) // 2, "wasser": w.wasser}
    return daten


def baue(privat: Path, nur: set[str] | None = None) -> dict[str, dict]:
    """Alle Bögen nach ``spiel/tiere/<art>.png``; Ausgabe: Einträge für tierarten.json je Art."""
    exporte = lade_exporte(privat)
    ziel = privat / "spiel" / "tiere"
    ziel.mkdir(parents=True, exist_ok=True)
    eintraege = {}
    for art, w in WAHL.items():
        if nur and art not in nur:
            continue
        e, leinwand = exporte[art]
        t = teile_von(e, w)
        bogen(t, leinwand).save(ziel / f"{art}.png")
        eintraege[art] = eintrag(art, e, leinwand, w, t)
    return eintraege


TIERARTEN = Path(__file__).resolve().parents[2] / "app" / "src" / "abenteuer" / "oberwelt" / "tierarten.json"


def schreibe_tierarten(eintraege: dict[str, dict]) -> None:
    """Die PixelLab-Einträge in tierarten.json setzen (übrige Arten bleiben, Reihenfolge stabil)."""
    daten = json.loads(TIERARTEN.read_text(encoding="utf-8"))
    daten["arten"].update(eintraege)
    TIERARTEN.write_text(json.dumps(daten, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main(argv: list[str]) -> int:
    """Befehlszeile; Aufruf im Dateikopf."""
    pfade = [a for a in argv if not a.startswith("--")]
    if len(pfade) != 1:
        print(__doc__)
        return 1
    eintraege = baue(Path(pfade[0]))
    if "--tierarten" in argv:
        schreibe_tierarten(eintraege)
    for art, d in eintraege.items():
        print(
            f"{art:14} Rahmen {d['breite']:3}  Höhe {d['gemessen']:3}  Länge {d['gemessen_laenge']:3}"
            f"  massstab {d['massstab']} nach {d['massstab_nach']}"
        )
    zu_klein = [art for art, d in eintraege.items() if d["massstab"] > HOECHSTENS_VERGROESSERN]
    if zu_klein:
        print(f"Zu klein erzeugt (Vergrößerung über {HOECHSTENS_VERGROESSERN}): {', '.join(zu_klein)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

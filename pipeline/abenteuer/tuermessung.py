"""Türmaß automatisch aus dem Gebäudebild messen (KARTENREGELN 10.92, Prüfung ``tuergroesse.py``).

Warum: Die Prüfung der Türgröße kannte nur Türen, die mit der Lupe abgelesen waren; 172 Gebäudebilder
auf Außenkarten blieben ungeprüft (Auftrag des Hauptchats, 17.11.2026). Dieses Werkzeug misst sie
aus dem Bild und schreibt sie nach ``katalog_korrekturen/tuermasse.json`` mit ``"herkunft":
"gemessen"``; von Hand abgelesene Maße (``"von Hand"``) gehen immer vor und werden nie überschrieben.

Verfahren (je Gebäudebild):
1. Wo die Tür liegt: die Spalten aus ``tuer`` im Möbelkatalog (Kacheln vor der Tür), sonst aus dem
   Grundriss (``grundrisse.json``, ``tueren`` mit ``von``/``bis``, Spalten ab 1). Ohne beides misst
   das Werkzeug nicht (Silos, Wassertürme, Zelte ohne Türangabe).
2. Türblatt: Von mehreren Punkten über der Unterkante des Gebäudes in der Türspalte wächst eine
   Fläche gleicher Farbe (Abweichung je Kanal höchstens ``TOLERANZ``). Gültig ist eine Fläche, die
   den Suchbereich nicht berührt (sonst ist es Wand) und nicht zu klein ist; hochkant stehende Flächen
   gehen vor (flache sind meist Stufen vor der Tür), unter ihnen gewinnt die größte.
3. Rahmen: Nach links, rechts und oben kommt jede Reihe dazu, die sich überwiegend von der Wand
   daneben unterscheidet, höchstens ``RAHMEN`` Pixel (wie „Türrahmen außen“ beim Ablesen).
Geprüft an den 13 von Hand gemessenen Bildern mit Grundriss: Abweichung je Kante höchstens 6 Pixel,
meist 3 bis 4; nur die breiten Glastüren von Diner und Waschsalon liegen 12 daneben (Test
``test_abenteuer_tuermessung.py`` mit einem gezeichneten Haus).

Aufruf: ``python -m pipeline.abenteuer.tuermessung PRIVAT [--schreiben] [--bilder ORDNER]``. Ohne
``--schreiben`` nur die Liste; ``--bilder`` legt Kontaktbögen der Grenzfälle ab (nur lokal, die Bilder
sind privat). Braucht Pillow und numpy (beide nur hier, die Prüfung selbst nicht). Ein neuer Lauf
misst nur Bilder ohne Eintrag; wer neu messen will, löscht den Eintrag. Durchsicht der Kontaktbögen:
Fehlmessungen mit ``verwirf`` als „verworfen“ eintragen (17.11.2026: 45 von 119, danach alle
von Hand im vergrößerten Bild mit Raster abgelesen).
"""

import json
import sys
from collections import Counter, deque
from dataclasses import dataclass
from pathlib import Path

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
TUERMASSE = INHALTE / "katalog_korrekturen" / "tuermasse.json"
GRUNDRISSE = INHALTE / "katalog_korrekturen" / "grundrisse.json"
K = 16
TOLERANZ = 22  # gleiche Farbe: Abweichung je Kanal (0 bis 255)
RAHMEN = 4  # so viele Pixel Türrahmen kommen höchstens dazu
DECKEND = 128  # Alpha ab hier zählt ein Pixel zum Bild
UNTERKANTE_ANTEIL = 0.6  # Reihe gehört zum Gebäude, wenn so viel der Türspalte deckt
SUCHHOEHE = 90  # Pixel über der Unterkante, in denen die Tür liegen kann
SAAT_HOEHEN = range(3, 46, 2)  # Startpunkte über der Unterkante (Treppen vor Villen bis 45)
SAAT_VERSATZ = (-2, 0, 2)
HOECHSTFLAECHE = 4000  # größere Flächen sind Wand oder Himmel
MINDEST_BREITE, MINDEST_HOEHE, MINDEST_PUNKTE = 5, 8, 20
ANDERS_ANTEIL = 0.6  # Rahmenreihe: so viel unterscheidet sich von der Wand
HOCHKANT = 0.5  # Höhe mindestens halb so groß wie die Breite, sonst Stufe (Diner 29 × 17 ist eine Tür)


@dataclass
class Messung:
    """Ergebnis einer Messung: Rahmen [links, oben, rechts, unten) im Bildpixel oder None, mit Grund."""

    quelle: str
    rahmen: list[int] | None
    grund: str = ""

    @property
    def masse(self) -> tuple[int, int]:
        return (self.rahmen[2] - self.rahmen[0], self.rahmen[3] - self.rahmen[1]) if self.rahmen else (0, 0)


def tuerspalten(angabe: dict, grundriss: dict | None, bildbreite: int) -> list[tuple[int, int]]:
    """Pixelspalten [von, bis) jeder Tür im Bild: aus ``tuer`` im Katalog, sonst aus dem Grundriss.

    Beispiel: Grundriss Farmhaus 8 Spalten, Tür ``von`` 6 ``bis`` 6, Bild 128 breit → [(80, 96)].
    """
    if angabe.get("tuer"):
        faktor = bildbreite / angabe["breite"]
        xs = sorted({x for x, _ in angabe["tuer"]})
        return [(round(xs[0] * K * faktor), round((xs[-1] + 1) * K * faktor))]
    if grundriss and grundriss.get("tueren") and grundriss.get("breite"):
        spalte = bildbreite / grundriss["breite"]
        return [(round((t["von"] - 1) * spalte), round(t["bis"] * spalte)) for t in grundriss["tueren"]]
    return []


def _flaeche(farbe, deckt, saat: tuple[int, int], suche: tuple[int, int, int, int]) -> list | None:
    """Pixel gleicher Farbe um ``saat`` innerhalb von ``suche`` (4er-Nachbarschaft); None bei Wand."""
    xa, ya, xb, yb = suche
    sx, sy = saat
    if not (xa <= sx < xb and ya <= sy < yb) or not deckt[sy, sx]:
        return None
    ref, gesehen, schlange, punkte = farbe[sy, sx], {saat}, deque([saat]), []
    while schlange:
        x, y = schlange.popleft()
        punkte.append((x, y))
        if len(punkte) > HOECHSTFLAECHE:
            return None
        for n in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if n in gesehen or not (xa <= n[0] < xb and ya <= n[1] < yb) or not deckt[n[1], n[0]]:
                continue
            if abs(farbe[n[1], n[0]] - ref).max() <= TOLERANZ:
                gesehen.add(n)
                schlange.append(n)
    return punkte


def tuerblatt(farbe, deckt, spalten: tuple[int, int]) -> list[int] | None:
    """Umriss des Türblatts in einer Türspalte (Schritt 2), sonst None."""
    x0, x1 = spalten
    breite, mitte = x1 - x0, (x0 + x1) // 2
    x0 = max(0, min(x0, deckt.shape[1] - 1))
    x1 = max(x0 + 1, min(x1, deckt.shape[1]))
    reihen = [y for y in range(deckt.shape[0]) if deckt[y, x0:x1].mean() > UNTERKANTE_ANTEIL]
    if not reihen:
        return None
    unten = reihen[-1]
    suche = (max(0, x0 - breite), max(0, unten - SUCHHOEHE), min(deckt.shape[1], x1 + breite), unten + 1)
    bestes = None
    for dy in SAAT_HOEHEN:
        for dx in SAAT_VERSATZ:
            punkte = _flaeche(farbe, deckt, (mitte + dx, unten - dy), suche)
            if not punkte or len(punkte) < MINDEST_PUNKTE:
                continue
            xs, ys = [p[0] for p in punkte], [p[1] for p in punkte]
            umriss = [min(xs), min(ys), max(xs) + 1, max(ys) + 1]
            if umriss[0] <= suche[0] or umriss[2] >= suche[2] or umriss[1] <= suche[1]:
                continue  # berührt den Suchbereich: Wand
            b, h = umriss[2] - umriss[0], umriss[3] - umriss[1]
            if b < MINDEST_BREITE or h < MINDEST_HOEHE or b > 2 * breite + 2 * RAHMEN:
                continue
            # Türen stehen hochkant; flache breite Flächen sind meist Stufen davor (Wohnwagen, Villen).
            rang = (h >= HOCHKANT * b, b * h)
            if bestes is None or rang > bestes[0]:
                bestes = (rang, umriss)
    # Nur flache Flächen: Stufen oder Sockel, keine Tür (Palast mit Freitreppe).
    return bestes[1] if bestes and bestes[0][0] else None


def _wand(farbe, deckt, xs: range, ys: range):
    """Häufigste deckende Farbe in einem Streifen (die Wand neben der Tür), sonst None."""
    hoehe, breite = deckt.shape
    zaehler = Counter(
        tuple(farbe[y, x]) for x in xs for y in ys if 0 <= x < breite and 0 <= y < hoehe and deckt[y, x]
    )
    return zaehler.most_common(1)[0][0] if zaehler else None


def _anders(farbe, deckt, punkte: list, wand) -> bool:
    """Unterscheidet sich die Reihe ``punkte`` überwiegend von der Wandfarbe?"""
    if wand is None or not punkte:
        return False
    hoehe, breite = deckt.shape
    zaehl = sum(
        1
        for x, y in punkte
        if 0 <= x < breite and 0 <= y < hoehe and deckt[y, x] and abs(farbe[y, x] - wand).max() > TOLERANZ
    )
    return zaehl / len(punkte) >= ANDERS_ANTEIL


def mit_rahmen(farbe, deckt, blatt: list[int]) -> list[int]:
    """Türblatt um den Rahmen erweitert (Schritt 3): links, rechts, oben je bis ``RAHMEN`` Pixel."""
    x0, y0, x1, y1 = blatt
    for _ in range(RAHMEN):
        wand = _wand(farbe, deckt, range(x0 - RAHMEN - 2, x0 - RAHMEN), range(y0, y1))
        if not _anders(farbe, deckt, [(x0 - 1, y) for y in range(y0, y1)], wand):
            break
        x0 -= 1
    for _ in range(RAHMEN):
        wand = _wand(farbe, deckt, range(x1 + RAHMEN, x1 + RAHMEN + 2), range(y0, y1))
        if not _anders(farbe, deckt, [(x1, y) for y in range(y0, y1)], wand):
            break
        x1 += 1
    for _ in range(RAHMEN):
        wand = _wand(farbe, deckt, range(x0, x1), range(y0 - RAHMEN - 2, y0 - RAHMEN))
        if not _anders(farbe, deckt, [(x, y0 - 1) for x in range(x0, x1)], wand):
            break
        y0 -= 1
    return [int(x0), int(y0), int(x1), int(y1)]


def miss_bild(bild, spalten: list[tuple[int, int]]) -> list[int] | None:
    """Größte Tür eines Bildes (RGBA, Pillow) über alle Türspalten, mit Rahmen; sonst None."""
    import numpy as np

    pixel = np.asarray(bild.convert("RGBA"), dtype=np.int32)
    farbe, deckt = pixel[..., :3], pixel[..., 3] > DECKEND
    tueren = [t for t in (tuerblatt(farbe, deckt, s) for s in spalten) if t]
    if not tueren:
        return None
    groesste = max(tueren, key=lambda t: (t[2] - t[0]) * (t[3] - t[1]))
    return mit_rahmen(farbe, deckt, groesste)


# Grenzfälle: unplausible Maße oder knapp an der Figur (dann lohnt der Blick ins Bild).
KNAPP = 0.15  # höchstens 15 % über oder unter der Figur
SEITENVERHAELTNIS = 2.5


def grundrisse() -> dict[str, dict]:
    """Dateiname des Gebäudebilds → Grundriss (``grundrisse.json``)."""
    daten = json.loads(GRUNDRISSE.read_text(encoding="utf-8"))
    return {Path(k).name: v.get("grundriss", {}) for k, v in daten.items() if not k.startswith("_")}


def offene_bilder(moebel: dict) -> dict[str, tuple[str, dict]]:
    """Gebäudebilder auf Außenkarten ohne Türmaß: Dateiname → (Quelle, Katalogeintrag)."""
    from pipeline.abenteuer.tuergroesse import GEBAEUDE, offen

    namen = set()
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        namen |= offen(json.loads(pfad.read_text(encoding="utf-8")), moebel)
    ergebnis = {}
    for angabe in moebel.values():
        name = Path(angabe.get("quelle", "")).name
        if angabe.get("art") in GEBAEUDE and name in namen and "ausschnitt" not in angabe:
            vorher = ergebnis.get(name)
            if vorher is None or (angabe.get("tuer") and not vorher[1].get("tuer")):
                ergebnis[name] = (angabe["quelle"], angabe)
    return ergebnis


def miss_alle(privat: Path, offene: dict[str, tuple[str, dict]]) -> list[Messung]:
    """Misst jedes offene Gebäudebild (Bild wie im Spiel: Schattenfassung vor dem Original)."""
    from PIL import Image

    from pipeline.abenteuer.editorpaket import bildpfad

    plaene, ergebnis = grundrisse(), []
    for name, (quelle, angabe) in sorted(offene.items()):
        pfad = bildpfad(privat, quelle)
        if pfad is None:
            ergebnis.append(Messung(quelle, None, "Bild fehlt im privaten Repository"))
            continue
        bild = Image.open(pfad)
        spalten = tuerspalten(angabe, plaene.get(name), bild.width)
        if not spalten:
            ergebnis.append(Messung(quelle, None, "keine Türangabe (Katalog „tuer“ oder Grundriss)"))
            continue
        rahmen = miss_bild(bild, spalten)
        ergebnis.append(Messung(quelle, rahmen, "" if rahmen else "keine Türfläche gefunden"))
    return ergebnis


def grenzfall(m: Messung) -> str:
    """Grund, das Bild anzusehen, sonst „“: keine Tür, unplausible Form, knapp an der Figur."""
    from pipeline.abenteuer.tuergroesse import FIGUR_BREITE, FIGUR_HOEHE

    if not m.rahmen:
        return m.grund
    b, h = m.masse
    if h > SEITENVERHAELTNIS * b or b > SEITENVERHAELTNIS * h:
        return "Form unplausibel"
    knapp_b = abs(b - FIGUR_BREITE) <= KNAPP * FIGUR_BREITE
    knapp_h = abs(h - FIGUR_HOEHE) <= KNAPP * FIGUR_HOEHE
    return "knapp an der Figurgröße" if knapp_b or knapp_h else ""


def schreibe(messungen: list[Messung], datei: Path = TUERMASSE) -> int:
    """Trägt Messungen ein: ``herkunft`` „gemessen“ mit Rahmen, sonst „nicht messbar“ mit Grund.
    Vorhandene Einträge (von Hand, verworfen) bleiben; Ausgabe: Zahl der neuen Einträge."""
    daten = json.loads(datei.read_text(encoding="utf-8"))
    namen = {Path(k).name for k in daten if not k.startswith("_")}
    neu = 0
    for m in messungen:
        if Path(m.quelle).name in namen:
            continue
        if m.rahmen:
            daten[m.quelle] = {"rahmen": m.rahmen, "herkunft": "gemessen"}
        else:
            daten[m.quelle] = {"herkunft": "nicht messbar", "grund": m.grund}
        neu += 1
    datei.write_text(json.dumps(daten, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return neu


def verwirf(verworfen: dict[str, str], messungen: list[Messung], datei: Path = TUERMASSE) -> int:
    """Trägt im Bild geprüfte Fehlmessungen als „verworfen“ ein (Dateiname → Grund), ohne Rahmen.

    Warum: Die Durchsicht der Kontaktbögen soll nicht verloren gehen; ein neuer Lauf überschreibt
    vorhandene Einträge nicht, die Prüfung zählt sie als offen und nennt den Grund im Bericht.
    """
    daten = json.loads(datei.read_text(encoding="utf-8"))
    vorhanden = {Path(k).name for k in daten if not k.startswith("_")}
    neu = 0
    for m in messungen:
        name = Path(m.quelle).name
        if name in verworfen and name not in vorhanden:
            daten[m.quelle] = {"herkunft": "verworfen", "grund": verworfen[name]}
            vorhanden.add(name)
            neu += 1
    datei.write_text(json.dumps(daten, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return neu


def kontaktbogen(privat: Path, messungen: list[Messung], ziel: Path) -> None:
    """Bild der Grenzfälle: je Gebäude der untere Teil vierfach, Türrahmen magenta (nur lokal)."""
    from PIL import Image, ImageDraw

    from pipeline.abenteuer.editorpaket import bildpfad

    VERGROESSERUNG, RAND, SPALTEN = 4, 24, 5
    kacheln = []
    for m in messungen:
        pfad = bildpfad(privat, m.quelle)
        if pfad is None:
            continue
        bild = Image.open(pfad).convert("RGBA")
        r = m.rahmen or [0, max(0, bild.height - 64), bild.width, bild.height]
        kasten = (max(0, r[0] - RAND), max(0, r[1] - RAND), min(bild.width, r[2] + RAND), bild.height)
        teil = bild.crop(kasten).resize(
            ((kasten[2] - kasten[0]) * VERGROESSERUNG, (kasten[3] - kasten[1]) * VERGROESSERUNG),
            Image.NEAREST,
        )
        zeichnen = ImageDraw.Draw(teil)
        if m.rahmen:
            ecke = [(v - kasten[i % 2]) * VERGROESSERUNG for i, v in enumerate(r)]
            zeichnen.rectangle(
                (ecke[0], ecke[1], ecke[2] - 1, ecke[3] - 1), outline=(255, 0, 255, 255), width=2
            )
        zeichnen.text(
            (2, 2), f"{Path(m.quelle).stem[:28]} {m.masse[0]}×{m.masse[1]}", fill=(255, 255, 0, 255)
        )
        kacheln.append(teil)
    _bogen(kacheln, SPALTEN).save(ziel)


def _bogen(kacheln: list, spalten: int):
    """Kacheln in Reihen zu einem Bild (dunkler Grund)."""
    from PIL import Image

    reihen = [kacheln[i : i + spalten] for i in range(0, len(kacheln), spalten)] or [[]]
    breite = max((sum(k.width for k in r) for r in reihen), default=1) or 1
    hoehe = sum(max((k.height for k in r), default=0) for r in reihen) or 1
    bogen, y = Image.new("RGBA", (breite, hoehe), (40, 40, 40, 255)), 0
    for r in reihen:
        x = 0
        for k in r:
            bogen.alpha_composite(k, (x, y))
            x += k.width
        y += max((k.height for k in r), default=0)
    return bogen


def main(argumente: list[str]) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    from pipeline.abenteuer.moebelliste import lade_moebel

    privat = Path(argumente[0])
    messungen = miss_alle(privat, offene_bilder(lade_moebel()))
    faelle = [(m, grenzfall(m)) for m in messungen]
    for m, fall in faelle:
        print(f"{Path(m.quelle).name}: {m.rahmen or '-'} {m.masse[0]}×{m.masse[1]} {fall}")
    if "--bilder" in argumente:
        ordner = Path(argumente[argumente.index("--bilder") + 1])
        ordner.mkdir(parents=True, exist_ok=True)
        kontaktbogen(privat, [m for m, fall in faelle if fall], ordner / "tuer_grenzfaelle.png")
    if "--schreiben" in argumente:
        print(f"{schreibe(messungen)} Türmaße neu in {TUERMASSE.name}")
    gemessen = sum(1 for m in messungen if m.rahmen)
    print(f"{len(messungen)} Bilder, {gemessen} gemessen, {sum(1 for _, f in faelle if f)} Grenzfälle")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

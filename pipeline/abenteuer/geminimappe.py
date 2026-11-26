"""Gemini-Aufträge aus der Bildauftragsmappe lesen (Schach-Abenteuer).

Zweck: Die Mappe (fuer_autor/18_Bildauftraege_offen_*.html) ist die einzige Quelle der
Bildaufträge. Bisher hat der Autor jeden Prompt von Hand in den Gemini-Chat kopiert. Seit dem
26.11.2026 soll das über die Gemini-Schnittstelle laufen (geminibilder.py). Dieses Modul liest
dafür die Gemini-Abschnitte der Mappe aus: Nummer, Titel, Prompts (ein Schritt bei Kartenbildern,
zwei Schritte bei Porträtblättern), das eingebettete Standbild und die nötige Stilvorlage.

Die Mappe enthält Paketbilder und liegt nie im öffentlichen Repository; das Modul selbst enthält
keine Bilder und keine Prompts.
"""

from __future__ import annotations

import base64
import html
import re
from dataclasses import dataclass, field
from pathlib import Path

# Abschnitt eines Auftrags in der Mappe (mappe15/bau.py, Funktion auftrag)
ABSCHNITT = re.compile(r'<section class="auftrag"[^>]*>(.*?)</section>', re.S)
NUMMER = re.compile(r'<span class="nr">([^<]+)</span>(.*?)</h3>', re.S)
MARKUP = re.compile(r"<[^>]+>")
PROMPT = re.compile(r"<pre>(.*?)</pre>", re.S)
STANDBILD = re.compile(r'<img class="stand" src="data:image/png;base64,([^"]+)"')
MARKE_PIXELLAB = 'class="marke pixellab"'

# Dateinamen der Stilvorlagen im Vorlagenordner (Vorlagen-ZIP der Mappe 18, LIESMICH.txt)
STILVORLAGE_PORTRAET = "Bild1_Stilvorlage_Portraet_fuer_alle_B.png"
STILVORLAGE_KARTE = "Stilvorlage_Karte_und_Dinge_fuer_K.png"


@dataclass
class Auftrag:
    """Ein Gemini-Auftrag der Mappe.

    schritte: Prompts in Reihenfolge; Schritt 2 eines Porträtblatts bekommt das Ergebnis von
    Schritt 1 als Bild (so wie der Autor im selben Chat weitergeschrieben hat).
    vorlagen: Bilder für Schritt 1 als PNG-Bytes, in der Reihenfolge, die der Prompt nennt
    (Bild 1 Stilvorlage, Bild 2 Standbild).
    """

    nr: str
    titel: str
    schritte: list[str]
    vorlagen: list[bytes] = field(default_factory=list)

    @property
    def ist_portraet(self) -> bool:
        """Porträtblätter haben zwei Schritte (Porträt, dann Blatt); Groß- und Fundbilder einen."""
        return len(self.schritte) == 2


def auftraege_lesen(mappe: Path, vorlagenordner: Path) -> list[Auftrag]:
    """Alle offenen Gemini-Aufträge der Mappe mit ihren Vorlagebildern.

    Eingaben: Pfad der Mappe (HTML), Ordner mit den entpackten Vorlagen der Mappe.
    Ausgabe: Aufträge in der Reihenfolge der Mappe.
    Beispiel: B14 Porträtblatt Wren Okoro: zwei Schritte, eine Vorlage (Stilvorlage Porträt).
    Sonderfall: Fehlt eine Stilvorlage im Ordner, bricht das Lesen mit FileNotFoundError ab,
    statt Aufträge ohne Vorlage zu schicken (die Bilder kämen im falschen Stil zurück).
    """
    text = mappe.read_text(encoding="utf-8")
    auftraege = []
    for abschnitt in ABSCHNITT.findall(text):
        kopf = NUMMER.search(abschnitt)
        # PixelLab-Aufträge und die Vorlagen selbst (ohne Prompt) gehören nicht zu Gemini
        if MARKE_PIXELLAB in abschnitt or not kopf or "<pre>" not in abschnitt:
            continue
        nr = kopf.group(1).strip()
        titel = html.unescape(" ".join(MARKUP.sub("", kopf.group(2)).split()))
        schritte = [html.unescape(p).strip() for p in PROMPT.findall(abschnitt)]
        auftrag = Auftrag(nr, titel, schritte)
        auftrag.vorlagen = _vorlagen(auftrag, abschnitt, vorlagenordner)
        auftraege.append(auftrag)
    return auftraege


def _vorlagen(auftrag: Auftrag, abschnitt: str, ordner: Path) -> list[bytes]:
    """Stilvorlage zuerst, dann das eingebettete Standbild, falls der Abschnitt eins hat."""
    # Mappe: Vorlage P für alle Porträtblätter, Vorlage K für Karten-, Fund- und Großbilder
    name = STILVORLAGE_PORTRAET if auftrag.ist_portraet else STILVORLAGE_KARTE
    pfad = ordner / name
    if not pfad.exists():
        raise FileNotFoundError(f"Stilvorlage fehlt: {pfad} (aus Vorlagen_Mappe18.zip entpacken)")
    bilder = [pfad.read_bytes()]
    standbild = STANDBILD.search(abschnitt)
    if standbild:
        bilder.append(base64.b64decode(standbild.group(1)))
    return bilder

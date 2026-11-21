"""Figurstil, Teil 2: Vorbild Coach, Alter und Höhe, Animationen, Neubau-Reihenfolge (21.11.2026).

Warum: Der Autor mag den Stil von Coach Delgado am liebsten und will alle Figuren in diesem Stil
neu erzeugen, Erwachsene größer als der Held, mit den Animationen, die jede Figur im Spiel
wirklich braucht. Dieses Modul liest dafür, was die Figuren tun (orte.json, Szenen, Ink-Tags),
ihr Alter und ihre Rolle (docs/spiel/25_Figurenprompts.md) und vergleicht die gemessenen
PixelLab-Figuren mit dem Coach. figurstil.py schreibt daraus den Kontaktbogen.

Was die App heute zeichnet (Stand 21.11.2026):
- Bogen mit Rahmen 32 × 32 (skripte/figurenbogen.mjs): Reihe 1 vier Standbilder (rechts, oben,
  links, unten), Reihe 2 Laufen mit sechs Bildern je Richtung (laufname), Reihe 3 wahlweise ein
  Sitzbild je Richtung (sitzrichtung.ts, ab Rahmen 48). Ohne Sitzbild: Standbild 6 Pixel höher.
- Liegen (`#stelle:…>liegt`) kippt das Standbild um eine Vierteldrehung (fuehrungsschicht.ts).
- Blickrichtung (`blick`) zeigt das Standbild der Richtung; Statisten laufen von–bis und halten an.
- Geister (`geist`) färbt die App selbst (geistfigur.ts); dafür braucht es kein eigenes Bild.
Abhängigkeiten: keine außer der Standardbibliothek.
"""

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

WURZEL = Path(__file__).resolve().parents[2]
INHALTE = WURZEL / "inhalte" / "abenteuer"
PROMPTS = WURZEL / "docs" / "spiel" / "25_Figurenprompts.md"

COACH = "coach-delgado"
HELD = "held-0"
ZIEL_KOPF = (0.45, 0.50)
TOLERANZ_SAETTIGUNG = 0.15
TOLERANZ_KONTUR = 0.12
TOLERANZ_FARBEN = 0.35  # Anteil Abweichung in der Zahl der Farben
KIND_BIS = 12
JUGEND_BIS = 17
ALT_AB = 65
LAUFBILDER = 6
RICHTUNGEN = 4

# Zielhöhen in Pixeln (Sohle bis Scheitel im 32er-Bild), bezogen auf den Coach (31) und den Helden.
ZIELHOEHE = {
    "Erwachsen": "30–31 (wie der Coach)",
    "Alt": "29–30",
    "Jugendlich": "27–28 (unter den Erwachsenen)",
    "Kind": "21–23 (Leinwand 24 × 24)",
}
ZAHLWORT = {
    "twenties": 25,
    "thirties": 35,
    "forties": 45,
    "fifties": 55,
    "sixties": 65,
    "seventies": 75,
    "eighties": 85,
}


def kebab(kennung: str) -> str:
    """coachDelgado → coach-delgado (Dateiname des Bogens)."""
    return re.sub(r"(?<!^)([A-Z])", r"-\1", kennung).lower()


def altersgruppe(prompt: str) -> str:
    """Kind, Jugendlich, Erwachsen oder Alt aus dem PixelLab-Prompt. Beispiel: „14 year old“ → Jugendlich."""
    text = prompt.lower()
    zahl = re.search(r"(\d+) year old|about (\d+)|aged? (\d+)", text)
    jahre = next((int(g) for g in zahl.groups() if g), None) if zahl else None
    if jahre is None:
        wort = re.search(r"(twenties|thirties|forties|fifties|sixties|seventies|eighties)", text)
        jahre = ZAHLWORT[wort.group(1)] if wort else None
    if jahre is None:
        jahre = 75 if re.search(r"\bold (man|woman)|grand(mother|father)", text) else 35
    if jahre <= KIND_BIS:
        return "Kind"
    if jahre <= JUGEND_BIS:
        return "Jugendlich"
    return "Alt" if jahre >= ALT_AB else "Erwachsen"


@dataclass
class Eintrag:
    """Eine Figur aus docs/spiel/25: Rolle, Akt, Alter, Prompt."""

    kennung: str
    rolle: str
    akt: str
    alter: str
    prompt: str


def lies_prompts(pfad: Path = PROMPTS) -> dict[str, Eintrag]:
    """Je Bogenname (kebab) der Eintrag aus dem Prompt-Dokument; Statisten-Typen als statist.<typ>."""
    text = pfad.read_text(encoding="utf-8")
    eintraege = {}
    for abschnitt in text.split("\n### ")[1:]:
        kopf = re.match(r"`([^`]+)`", abschnitt)
        prompt = re.search(r"```\n([^`]+?)\n```", abschnitt)
        if not kopf or not prompt:
            continue
        kennung = kopf.group(1)
        akt = re.search(r"\*\*Akt:\*\*\s*([^\n]+)", abschnitt)
        statist = kennung.startswith("statist.")
        haupt = kennung == "held" or ("3×2" in abschnitt and not statist)
        rolle = "Statist" if statist else ("Hauptfigur" if haupt else "Nebenfigur")
        name = kennung if statist else ("held-0" if kennung == "held" else kebab(kennung))
        eintraege[name] = Eintrag(
            kennung,
            rolle,
            akt.group(1).strip() if akt else "?",
            altersgruppe(prompt.group(1)),
            prompt.group(1),
        )
    return eintraege


@dataclass
class Nutzung:
    """Was eine Figur (ein Bogen) im Spiel tut."""

    sitzt: set = field(default_factory=set)
    blick: set = field(default_factory=set)
    karten: set = field(default_factory=set)
    geht: bool = False
    liegt: bool = False
    geist: bool = False
    statist: int = 0  # so oft als Statist der Belebung


def _sprite_je_name(orte: dict) -> dict[str, str]:
    """Lokaler Figurname (letzter Teil der Kennung) → Bogenname. Beispiel: carlaClub → carla."""
    karte = {}
    for ort in orte["orte"]:
        for figur in ort.get("figuren", []):
            stamm = Path(figur["sprite"]).stem
            karte.setdefault(figur["kennung"].split(".")[-1], stamm)
    return karte


def lies_nutzung(inhalte: Path = INHALTE) -> dict[str, Nutzung]:
    """Sitzen, Blick, Laufen, Liegen, Geist und Statistenrollen je Bogen aus Orten, Szenen und Ink."""
    orte = json.loads((inhalte / "orte.json").read_text(encoding="utf-8"))
    namen = _sprite_je_name(orte)
    nutzung: dict[str, Nutzung] = {}
    for ort in orte["orte"]:
        for figur in ort.get("figuren", []):
            eintrag = nutzung.setdefault(Path(figur["sprite"]).stem, Nutzung())
            eintrag.geist |= bool(figur.get("geist"))
    for datei in sorted((inhalte / "szenen").glob("*.json")):
        szene = json.loads(datei.read_text(encoding="utf-8"))
        for figur in szene.get("figuren", []):
            eintrag = nutzung.setdefault(namen.get(figur["name"], figur["name"]), Nutzung())
            eintrag.karten.add(datei.stem)
            if figur.get("sitzt"):
                eintrag.sitzt.add("unten" if figur["sitzt"] is True else figur["sitzt"])
            if figur.get("blick"):
                eintrag.blick.add(figur["blick"])
        _belebung(szene, nutzung)
    _ink(inhalte, namen, nutzung)
    return nutzung


def _belebung(szene: dict, nutzung: dict[str, Nutzung]) -> None:
    """Statisten mit eigenem Bild (bild: statist-07 oder eine Figur) zählen und Sitzen merken."""
    for b in szene.get("belebung", []):
        if b.get("typ") != "statist":
            continue
        e = b.get("eigenschaften", {})
        bild = e.get("bild", "statist (Vorrat)")
        eintrag = nutzung.setdefault(bild, Nutzung())
        eintrag.statist += 1
        eintrag.geht = True
        if e.get("sitzt"):
            eintrag.sitzt.add(e["sitzt"] if isinstance(e["sitzt"], str) else "unten")


def _ink(inhalte: Path, namen: dict[str, str], nutzung: dict[str, Nutzung]) -> None:
    """#gehe:<figur>>… (läuft geführt) und #stelle:<figur>>…>liegt (liegt) aus allen Ink-Dateien."""
    for datei in (inhalte / "dialoge" / "de").glob("*.ink"):
        for art, wer, rest in re.findall(
            r"#(gehe|stelle):([A-Za-z]+)>([^#\n]*)", datei.read_text(encoding="utf-8")
        ):
            stamm = HELD if wer == "held" else namen.get(wer, kebab(wer))
            eintrag = nutzung.setdefault(stamm, Nutzung())
            eintrag.geht |= art == "gehe"
            eintrag.liegt |= art == "stelle" and "liegt" in rest


def animationen(name: str, n: Nutzung | None) -> tuple[list[str], list[str], list[str]]:
    """Pflicht, nach Bedarf und Wunsch für eine Figur. Beispiel: Sam sitzt rechts → Sitzen rechts."""
    pflicht = [f"Stehen {RICHTUNGEN} Richtungen", f"Laufen {RICHTUNGEN} × {LAUFBILDER} Bilder"]
    bedarf, wunsch = [], []
    if n and n.sitzt:
        seiten = sorted(n.sitzt)
        bedarf.append(f"Sitzen {', '.join(seiten)}")
        wunsch.append("Zug am Brett")
    if n and n.liegt:
        bedarf.append("Liegen (heute gekippt)")
        wunsch.append("eigenes Liegebild")
    if n and n.karten and not n.geht and not n.sitzt:
        wunsch.append("Atmen im Stand")
    if name in {HELD, "juno", "ambrose"}:
        wunsch.append("Nicken und Gestik")
    return pflicht, bedarf, wunsch


def gruppe_zum_coach(m, coach) -> str:
    """„wie der Coach“, „nah dran“ oder „anders“ aus Kopfanteil, Sättigung, Kontur und Farbzahl."""
    if m.einteilung != "chibi":
        return "anders"
    unten, oben = ZIEL_KOPF
    kopf = m.kopfanteil is not None and unten <= m.kopfanteil <= oben
    saettigung = abs(m.saettigung - coach.saettigung) <= TOLERANZ_SAETTIGUNG
    kontur = abs(m.kontur - coach.kontur) <= TOLERANZ_KONTUR
    farben = abs(m.farben - coach.farben) <= TOLERANZ_FARBEN * coach.farben
    return "wie der Coach" if kopf and saettigung and kontur and farben else "nah dran"


ALTER_SCHLUSS = re.compile(
    r",?\s*slightly stylized proportions with a larger head \(about one third of the body height\),.*$", re.S
)
SCHLANK = re.compile(r"\b(thin|slim|skinny|lanky|narrow|long|oversized)\b,?\s*", re.I)
COACH_SCHLUSS = (
    "chibi proportions like a cute RPG sprite: big round head about half the body height, wide face, "
    "big dark eyes with white highlight, bold dark outline, saturated colours, short legs, soft shading"
)
PROMPT_HOECHSTENS = 400
ALT_ZUSATZ = "slightly stooped, "


def neuer_prompt(alt: str, gruppe: str) -> str:
    """Prompt im Stil des Coachs: alter Schluss ersetzt, schlanke Wörter gestrichen, Alte leicht gebeugt.

    Beispiel: „man about 35, thin, upright …, slightly stylized proportions …“ →
    „man about 35, upright …, chibi proportions: big round head …“. Über 400 Zeichen (Grenze von
    PixelLab) wird die Beschreibung vor dem Schluss gekürzt, an einem Komma.
    """
    kern = SCHLANK.sub("", ALTER_SCHLUSS.sub("", alt)).strip().rstrip(",")
    if gruppe == "Alt" and "stooped" not in kern:
        kern = kern.replace(", ", ", " + ALT_ZUSATZ, 1)
    platz = PROMPT_HOECHSTENS - len(COACH_SCHLUSS) - 2
    while len(kern) > platz and "," in kern:
        kern = kern.rsplit(",", 1)[0]
    return f"{kern}, {COACH_SCHLUSS}"


def vollstaendig(alt: str, neu: str) -> bool:
    """Ob der neue Prompt die ganze Beschreibung behielt (sonst wurde vor dem Schluss gekürzt)."""
    kern = SCHLANK.sub("", ALTER_SCHLUSS.sub("", alt)).strip().rstrip(",")
    letztes = kern.rsplit(",", 1)[-1].strip()
    return letztes in neu

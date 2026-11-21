"""Figurstil, Teil 3: Neubau-Plan im Stil von Coach Delgado (Wunsch des Autors, 21.11.2026).

Warum: Der Autor mag den Stil des Coachs am liebsten. Alle Figuren sollen in diesem Stil kommen,
Erwachsene größer als der Held, jede mit den Animationen, die sie im Spiel braucht. Dieses Modul
setzt die Messungen (figurstil.py) und die Nutzung (figurstil_bedarf.py) zu einem Plan zusammen:
Abstand jeder PixelLab-Figur zum Coach, Alter und Höhe, Animationen je Figur, Reihenfolge des
Neubaus mit Gesamtzahlen. Ausgabe: ZIEL/plan.html (Coach eingebettet, nur lokal) und ZIEL/plan.md.
Abhängigkeiten: Pillow, figurstil_bedarf.py.
"""

import base64
import io
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

from pipeline.abenteuer import figurstil_bedarf as bedarf

# Statisten-Typen aus docs/spiel/25 in Bündeln gleicher Rollen; sie ersetzen den LimeZu-Vorrat von 40.
BUENDEL = {
    "Passanten": [
        "statist.kindA",
        "statist.kindB",
        "statist.jugend",
        "statist.studentin",
        "statist.rentner",
        "statist.rentnerin",
    ],
    "Arbeit und Dienst": [
        "statist.service",
        "statist.fahrer",
        "statist.arbeiter",
        "statist.bauer",
        "statist.fischer",
    ],
    "Stadt und Konzern": ["statist.anzug", "statist.konzern"],
    "Draußen": ["statist.wanderer", "statist.ranger", "statist.musik"],
    "Erinnerungen": ["statist.hist"],
}
# Wer davon sitzt (Szenen: Club, Diner, Bibliothek, Akademie, Bank): Sitzen in drei Richtungen.
STATIST_SITZT = {
    "statist.kindA",
    "statist.kindB",
    "statist.jugend",
    "statist.studentin",
    "statist.rentner",
    "statist.rentnerin",
    "statist.fahrer",
}
STATIST_SITZRICHTUNGEN = {"oben", "unten", "links"}
VARIANTEN = {"ambrose-jung": "ambrose", "victor-pullover": "victor"}  # Fassung → Eintrag im Prompt-Dokument
FIGUR_GENERIERUNGEN = 2  # Figur aus Text, wie docs/spiel/25


@dataclass
class Plan:
    """Eine Figur im Neubau-Plan."""

    name: str
    rolle: str
    akt: str
    alter: str
    quelle: str  # PixelLab oder LimeZu oder Typ
    gruppe: str  # zum Coach
    pflicht: list
    noetig: list
    wunsch: list
    sitz_richtungen: int
    prompt: str = ""  # neuer Prompt im Stil des Coachs
    gekuerzt: bool = False

    @property
    def generierungen(self) -> int:
        return FIGUR_GENERIERUNGEN + bedarf.RICHTUNGEN + self.sitz_richtungen


def sitz_richtungen(seiten: set) -> int:
    """Zu erzeugende Sitzrichtungen; links und rechts sind spiegelbar (figurenbogen.mjs)."""
    if not seiten:
        return 0
    return len({"seite" if s in {"links", "rechts"} else s for s in seiten})


def eintrag_fuer(name: str, prompts: dict) -> bedarf.Eintrag | None:
    return prompts.get(name) or prompts.get(VARIANTEN.get(name, ""))


def plane(name: str, quelle: str, gruppe: str, prompts: dict, nutzung: dict, alt: str = "") -> Plan:
    """Plan einer Figur: Rolle, Akt, Alter aus dem Prompt-Dokument, Animationen aus der Nutzung.

    `alt` ist die echte PixelLab-Beschreibung (metadata.json); sonst gilt die aus docs/spiel/25.
    """
    e = eintrag_fuer(name, prompts)
    n = nutzung.get(name)
    if name.startswith("statist."):
        n = bedarf.Nutzung(sitzt=STATIST_SITZRICHTUNGEN if name in STATIST_SITZT else set(), geht=True)
    pflicht, noetig, wunsch = bedarf.animationen(name, n)
    sitz = sitz_richtungen(n.sitzt) if n else 0
    rolle = e.rolle if e else "Nebenfigur"
    alter = e.alter if e else "?"
    vorher = alt or (e.prompt if e else "")
    neu = bedarf.neuer_prompt(vorher, alter) if vorher else ""
    gekuerzt = bool(vorher) and not bedarf.vollstaendig(vorher, neu)
    return Plan(
        name, rolle, e.akt if e else "?", alter, quelle, gruppe, pflicht, noetig, wunsch, sitz, neu, gekuerzt
    )


def reihenfolge(plaene: list[Plan]) -> list[tuple[str, list[Plan]]]:
    """Neubau in Stufen: Hauptfiguren zuerst, Statisten in Bündeln, Ambrose zuletzt und gesondert."""

    def akt(p: Plan) -> str:
        return p.akt.replace("–", ",").split(",")[0].strip()

    def waehle(bedingung) -> list[Plan]:
        return sorted((p for p in plaene if bedingung(p)), key=lambda p: (akt(p), p.name))

    ohne = [p for p in plaene if p.name != "ambrose"]
    stufen = [
        (
            "1 Hauptfiguren, PixelLab, Stil anders",
            lambda p: p.rolle == "Hauptfigur" and p.quelle == "PixelLab" and p.gruppe == "anders",
        ),
        (
            "2 Hauptfiguren, LimeZu (noch ohne PixelLab)",
            lambda p: p.rolle == "Hauptfigur" and p.quelle == "LimeZu",
        ),
        (
            "3 Nebenfiguren, PixelLab, Stil anders",
            lambda p: p.rolle == "Nebenfigur" and p.quelle == "PixelLab" and p.gruppe == "anders",
        ),
        ("4 Nebenfiguren, LimeZu, nach Akt", lambda p: p.rolle == "Nebenfigur" and p.quelle == "LimeZu"),
        (
            "5 Wahlweise: PixelLab „nah dran“ (nur für den genauen Coach-Stil)",
            lambda p: p.quelle == "PixelLab" and p.gruppe == "nah dran",
        ),
    ]
    ergebnis = [(titel, waehle(lambda p, b=b: p in ohne and b(p))) for titel, b in stufen]
    for buendel, typen in BUENDEL.items():
        ergebnis.append((f"6 Statisten: {buendel}", [p for p in plaene if p.name in typen]))
    ergebnis.append(
        (
            "7 Ambrose, gesondert (der Autor entscheidet, ob der Geist anders aussehen darf)",
            [p for p in plaene if p.name == "ambrose"],
        )
    )
    return [(t, ps) for t, ps in ergebnis if ps]


def hoehenbefunde(messungen: list, prompts: dict) -> list[str]:
    """Jedes Kind und jede jugendliche Figur, die größer gezeichnet ist als ein Erwachsener."""
    alter = {
        m.name: (eintrag_fuer(m.name, prompts).alter if eintrag_fuer(m.name, prompts) else "?")
        for m in messungen
    }
    erwachsene = [m for m in messungen if alter[m.name] in {"Erwachsen", "Alt"}]
    befunde = []
    for m in messungen:
        if alter[m.name] not in {"Kind", "Jugendlich"}:
            continue
        kleiner = sorted(e.name for e in erwachsene if e.hoehe < m.hoehe)
        if kleiner:
            befunde.append(f"{m.name} ({alter[m.name]}, {m.hoehe} px) ist größer als {', '.join(kleiner)}")
    return befunde


def daten_uri(bild: Image.Image) -> str:
    puffer = io.BytesIO()
    bild.save(puffer, format="PNG")
    return "data:image/png;base64," + base64.b64encode(puffer.getvalue()).decode()


def schreibe(messungen: list, bilder: dict, alte_namen: set, ziel: Path) -> list[Plan]:
    """Plan für PixelLab-Figuren, LimeZu-Altbestand und Statisten-Typen; schreibt plan.html und plan.md."""
    from pipeline.abenteuer import figurstil_seite  # spät: Seite und Plan hängen voneinander ab

    prompts, nutzung = bedarf.lies_prompts(), bedarf.lies_nutzung()
    coach = next(m for m in messungen if m.name == bedarf.COACH)
    plaene = [
        plane(m.name, "PixelLab", bedarf.gruppe_zum_coach(m, coach), prompts, nutzung, m.prompt)
        for m in messungen
    ]
    for name in sorted(n for n in alte_namen if not n.startswith("statist-")):
        plaene.append(plane(name, "LimeZu", "anders", prompts, nutzung))
    for typen in BUENDEL.values():
        plaene.extend(
            plane(t, "Typ (ersetzt 40 LimeZu-Statisten)", "anders", prompts, nutzung) for t in typen
        )
    stufen = reihenfolge(plaene)
    befunde = hoehenbefunde(messungen, prompts)
    coachbild = daten_uri(bilder[bedarf.COACH].resize((128, 128), Image.NEAREST))
    (ziel / "plan.html").write_text(
        figurstil_seite.html(messungen, plaene, stufen, befunde, coach, coachbild, prompts), encoding="utf-8"
    )
    (ziel / "plan.md").write_text(
        figurstil_seite.markdown(messungen, plaene, stufen, befunde, coach, prompts), encoding="utf-8"
    )
    return plaene

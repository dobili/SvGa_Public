"""Aufgabe 2c: Aufgaben für den Strukturerkenner (Kapitel 5) → ``inhalte/de/trainer/struktur.json``.

Wozu diese Datei da ist:
    Pflichtenheft 7: „Nur das Skelett ist sichtbar. Der Leser beantwortet die vier Leitfragen
    durch Antippen (Löcher, schwache Bauern, Richtung, guter oder schlechter Läufer) und wählt
    den passenden Plan-Satz.“ Die Antworten auf die Leitfragen rechnet die App aus der Stellung
    (Werkzeuge k5-felder, k5-bauern, k5-richtung, k5-figuren); die Daten hier nennen je Aufgabe
    die Struktur, die Seite und den Plan-Satz (als Schlüssel) sowie die Merkmale, die die
    Pipeline im Skelett gefunden hat.

    Quellen: 1. Die Abbildungen aus Kapitel 5 mit Struktur und Plan nach dem Unterabschnitt, in
    dem das Buch sie zeigt (Tabelle BUCHSTRUKTUREN, Vorschlag; der Autor entscheidet).
    2. Weitere Abbildungen des Buches (Kapitel 2, 3, 6, 11, 12), in denen die Pipeline eine
    einzige klare Struktur findet (Isolani, hängende Bauern, Doppelbauer, Minderheitsangriff,
    Bauernkette, Mehrheit) — Regeln unten, nur mit Bauern geprüft, keine Engine.

    Schwierigkeit (ohne Engine; eine Stellungsbewertung sagt nichts über das Erkennen einer
    Struktur): 1, +1 ab drei Merkmalen beider Seiten, +1 ab fünf, +1 ab acht Figuren außer
    Bauern und Königen, +1 ab zwölf (mehr Figuren verdecken das Skelett).

Aufruf (im Hauptordner): python -m pipeline.trainer.struktur
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path

import chess

from pipeline.trainer.daten import DATENORDNER, TRAINERORDNER, lies_json, schreibe_daten

SCHEMA = "trainer-struktur.schema.json"
ZIELDATEI = TRAINERORDNER / "struktur.json"
WEITERE_KAPITEL = (2, 3, 6, 11, 12)
MINDESTENS_BAUERN = 10
MERKMALE_STUFE_2 = 3
MERKMALE_STUFE_3 = 5
FIGUREN_STUFE_PLUS = (8, 12)
DAMENFLUEGEL = range(0, 4)
KOENIGSFLUEGEL = range(4, 8)

# Abbildungen aus Kapitel 5: Struktur, Seite des Plans, Plan (nach dem Unterabschnitt des Buches).
BUCHSTRUKTUREN: dict[str, tuple[str, str, str]] = {
    "5.3": ("kette", "b", "kettenbasisAngreifen"),
    "5.4": ("kette", "b", "kettenbasisAngreifen"),
    "5.5": ("kette", "w", "fluegelDerKette"),
    "5.6": ("loch", "w", "vorpostenBesetzen"),
    "5.7": ("vorposten", "w", "vorpostenBesetzen"),
    "5.8": ("vorposten", "w", "vorpostenBesetzen"),
    "5.9": ("haken", "w", "luftlochSchaffen"),
    "5.10": ("loch", "w", "lochVermeiden"),
    "5.11": ("haken", "w", "lochVermeiden"),
    "5.12": ("haken", "w", "luftlochSchaffen"),
    "5.13": ("haken", "w", "luftlochSchaffen"),
    "5.14": ("vorposten", "w", "vorpostenBesetzen"),
    "5.15": ("doppelbauer", "w", "doppelbauerAngreifen"),
    "5.16": ("doppelbauer", "b", "doppelbauerAngreifen"),
    "5.17": ("isolani", "w", "isolaniVorstossen"),
    "5.18": ("isolani", "w", "isolaniBlockieren"),
    "5.19": ("isolani", "w", "isolaniVorstossen"),
    "5.20": ("haengendeBauern", "w", "haengendeAngreifen"),
    "5.21": ("haengendeBauern", "w", "haengendeAngreifen"),
    "5.22": ("haengendeBauern", "b", "haengendeVorstossen"),
    "5.23": ("haengendeBauern", "w", "haengendeVorstossen"),
    "5.24": ("raum", "w", "raumNutzen"),
    "5.25": ("kette", "b", "kettenbasisAngreifen"),
    "5.26": ("kette", "b", "kettenbasisAngreifen"),
    "5.27": ("kette", "w", "fluegelDerKette"),
    "5.28": ("kette", "w", "fluegelDerKette"),
    "5.29": ("mehrheit", "w", "mehrheitVorstossen"),
    "5.30": ("mehrheit", "w", "mehrheitVorstossen"),
    "5.31": ("mehrheit", "w", "mehrheitVorstossen"),
    "5.32": ("minderheitsangriff", "w", "minderheitsangriff"),
    "5.33": ("minderheitsangriff", "w", "minderheitsangriff"),
    "5.34": ("minderheitsangriff", "w", "minderheitsangriff"),
    "5.35": ("geschlossen", "w", "stellungSchliessen"),
    "5.36": ("offen", "w", "stellungOeffnen"),
    "5.37": ("offen", "b", "stellungOeffnen"),
    "5.38": ("offen", "w", "stellungOeffnen"),
    "5.39": ("geschlossen", "w", "springerStattLaeufer"),
    "5.40": ("laeufer", "b", "schlechtenLaeuferTauschen"),
    "5.41": ("laeufer", "w", "gutenLaeuferBehalten"),
    "5.42": ("laeufer", "w", "gutenLaeuferBehalten"),
    "5.43": ("laeufer", "w", "gutenLaeuferBehalten"),
    "5.44": ("kette", "w", "fluegelDerKette"),
    "5.45": ("loch", "w", "vorpostenBesetzen"),
    "5.46": ("isolani", "w", "isolaniBlockieren"),
    "5.47": ("laeufer", "w", "gutenLaeuferBehalten"),
    "5.48": ("kette", "b", "kettenbasisAngreifen"),
}
# Plan je Struktur für die Seite, der die Struktur gehört (Besitzer) oder die ihr gegenübersteht.
PLAN_BESITZER = {
    "isolani": "isolaniVorstossen",
    "haengendeBauern": "haengendeVorstossen",
    "doppelbauer": "doppelbauerAufloesen",
    "kette": "fluegelDerKette",
    "mehrheit": "mehrheitVorstossen",
}
PLAN_GEGNER = {
    "isolani": "isolaniBlockieren",
    "haengendeBauern": "haengendeAngreifen",
    "doppelbauer": "doppelbauerAngreifen",
    "kette": "kettenbasisAngreifen",
    "minderheitsangriff": "minderheitsangriff",
}


@dataclass(frozen=True)
class Merkmale:
    """Bauernmerkmale einer Seite (Standardbegriffe, Kapitel 5)."""

    isolierte: list[int]
    doppelte: list[int]
    rueckstaendige: list[int]
    freibauern: list[int]
    inseln: int
    ketten: list[list[int]]  # Bauern, die sich schräg decken, von der Basis aus

    def anzahl(self) -> int:
        return len(self.isolierte) + len(self.doppelte) + len(self.rueckstaendige) + len(self.freibauern)


def bauernfelder(brett: chess.Board, farbe: chess.Color) -> list[int]:
    return sorted(brett.pieces(chess.PAWN, farbe))


def _vorn(feld: int, farbe: chess.Color, schritte: int = 1) -> int | None:
    reihe = chess.square_rank(feld) + (schritte if farbe else -schritte)
    return chess.square(chess.square_file(feld), reihe) if 0 <= reihe <= 7 else None


def merkmale(brett: chess.Board, farbe: chess.Color) -> Merkmale:
    """Isolierte, doppelte, rückständige Bauern, Freibauern, Inseln und Ketten einer Seite.

    Regeln (Kapitel 5): isoliert = kein eigener Bauer auf einer Nachbarlinie; doppelt = zwei auf
    einer Linie; rückständig = kein eigener Bauer auf den Nachbarlinien gleich hoch oder dahinter
    und das Feld davor von einem gegnerischen Bauern beherrscht; Freibauer = kein gegnerischer
    Bauer davor auf derselben oder einer Nachbarlinie. Beispiel: Abb. 5.19 (Weiß) → Isolani d4.
    """
    eigene, fremde = bauernfelder(brett, farbe), bauernfelder(brett, not farbe)
    linien = {chess.square_file(f) for f in eigene}
    isolierte, doppelte, rueckstaendige, freibauern = [], [], [], []
    for feld in eigene:
        linie, reihe = chess.square_file(feld), chess.square_rank(feld)
        nachbarn = [f for f in eigene if abs(chess.square_file(f) - linie) == 1]
        if not nachbarn:
            isolierte.append(feld)
        if any(f != feld and chess.square_file(f) == linie for f in eigene):
            doppelte.append(feld)
        vor = _vorn(feld, farbe)
        hinten_oder_gleich = [
            f for f in nachbarn if (chess.square_rank(f) <= reihe if farbe else chess.square_rank(f) >= reihe)
        ]
        gegner_kontrolliert = vor is not None and any(
            abs(chess.square_file(g) - linie) == 1
            and _vorn(g, not farbe) is not None
            and chess.square_rank(_vorn(g, not farbe)) == chess.square_rank(vor)  # type: ignore[arg-type]
            for g in fremde
        )
        if nachbarn and not hinten_oder_gleich and gegner_kontrolliert:
            rueckstaendige.append(feld)
        voraus = [
            g
            for g in fremde
            if abs(chess.square_file(g) - linie) <= 1
            and (chess.square_rank(g) > reihe if farbe else chess.square_rank(g) < reihe)
        ]
        if not voraus:
            freibauern.append(feld)
    inseln = sum(1 for linie in linien if linie - 1 not in linien)
    return Merkmale(isolierte, doppelte, rueckstaendige, freibauern, inseln, _ketten(eigene, farbe))


def _ketten(eigene: list[int], farbe: chess.Color) -> list[list[int]]:
    """Ketten aus mindestens drei Bauern, die sich schräg nach vorn decken (von der Basis aus)."""
    menge = set(eigene)
    ketten = []
    for feld in eigene:
        kette = [feld]
        aktuell = feld
        while True:
            vor = _vorn(aktuell, farbe)
            weiter = [
                n
                for n in (vor - 1 if vor is not None else None, vor + 1 if vor is not None else None)
                if n is not None
                and n in menge
                and abs(chess.square_file(n) - chess.square_file(aktuell)) == 1
            ]
            if not weiter:
                break
            aktuell = weiter[0]
            kette.append(aktuell)
        if len(kette) >= 3 and not any(set(kette) < set(k) for k in ketten):
            ketten.append(kette)
    return [k for k in ketten if not any(set(k) < set(o) for o in ketten)]


def erkenne(brett: chess.Board) -> tuple[str, chess.Color] | None:
    """Die eine klare Struktur einer Stellung (Struktur, Besitzer) oder None.

    Reihenfolge: Isolani (ein isolierter Bauer auf d, der Gegner hat keinen d-Bauern), hängende
    Bauern (c und d nebeneinander, keine b- und e-Bauern), Minderheitsangriff (a, b gegen a, b, c
    bei festem d-Bauernpaar), Doppelbauer, Kette ab drei Bauern, Mehrheit (ein Flügel 3 gegen 2).
    """
    w, b = merkmale(brett, chess.WHITE), merkmale(brett, chess.BLACK)
    for farbe, m, gegner in ((chess.WHITE, w, b), (chess.BLACK, b, w)):
        linien = sorted(chess.square_file(f) for f in bauernfelder(brett, farbe))
        gegnerlinien = sorted(chess.square_file(f) for f in bauernfelder(brett, not farbe))
        if (
            len(m.isolierte) == 1
            and chess.square_file(m.isolierte[0]) == 3
            and 3 not in gegnerlinien
            and not gegner.isolierte
        ):
            return "isolani", farbe
        if {2, 3} <= set(linien) and not {1, 4} & set(linien) and not {2, 3} & set(gegnerlinien):
            return "haengendeBauern", farbe
    for farbe, linien_eigen, linien_gegner in (
        (
            chess.WHITE,
            [chess.square_file(f) for f in bauernfelder(brett, chess.WHITE)],
            [chess.square_file(f) for f in bauernfelder(brett, chess.BLACK)],
        ),
        (
            chess.BLACK,
            [chess.square_file(f) for f in bauernfelder(brett, chess.BLACK)],
            [chess.square_file(f) for f in bauernfelder(brett, chess.WHITE)],
        ),
    ):
        if sorted(x for x in linien_eigen if x < 4) == [0, 1, 3] and sorted(
            x for x in linien_gegner if x < 4
        ) == [0, 1, 2, 3]:
            return "minderheitsangriff", farbe
    for farbe, m, gegner in ((chess.WHITE, w, b), (chess.BLACK, b, w)):
        if m.doppelte and not gegner.doppelte:
            return "doppelbauer", farbe
    for farbe, m, gegner in ((chess.WHITE, w, b), (chess.BLACK, b, w)):
        if m.ketten and not gegner.ketten and len(m.ketten[0]) >= 3:
            return "kette", farbe
    for farbe in (chess.WHITE, chess.BLACK):
        eigene = [chess.square_file(f) for f in bauernfelder(brett, farbe)]
        fremde = [chess.square_file(f) for f in bauernfelder(brett, not farbe)]
        for fluegel in (DAMENFLUEGEL, KOENIGSFLUEGEL):
            if sum(1 for x in eigene if x in fluegel) == 3 and sum(1 for x in fremde if x in fluegel) == 2:
                return "mehrheit", farbe
    return None


def skelett(brett: chess.Board) -> str:
    """Nur die Bauern beider Seiten als Schlüssel, damit gleiche Skelette nur einmal vorkommen."""
    return " ".join(
        f"{'w' if farbe else 'b'}:" + ",".join(chess.square_name(f) for f in bauernfelder(brett, farbe))
        for farbe in (chess.WHITE, chess.BLACK)
    )


def figuren_ausser_bauern(brett: chess.Board) -> int:
    return sum(
        len(brett.pieces(typ, farbe))
        for farbe in (chess.WHITE, chess.BLACK)
        for typ in (chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN)
    )


def schwierigkeit(brett: chess.Board) -> tuple[int, int, int]:
    """(Stufe, Merkmale beider Seiten, Figuren) nach der Regel im Dateikopf."""
    anzahl = merkmale(brett, chess.WHITE).anzahl() + merkmale(brett, chess.BLACK).anzahl()
    figuren = figuren_ausser_bauern(brett)
    stufe = (
        1
        + (anzahl >= MERKMALE_STUFE_2)
        + (anzahl >= MERKMALE_STUFE_3)
        + sum(1 for g in FIGUREN_STUFE_PLUS if figuren >= g)
    )
    return min(stufe, 5), anzahl, figuren


def _namen(felder: list[int]) -> list[str]:
    return [chess.square_name(f) for f in felder]


def _aufgabe(kennung: str, brett: chess.Board, struktur: str, seite: str, plan: str, herkunft: dict) -> dict:
    w, b = merkmale(brett, chess.WHITE), merkmale(brett, chess.BLACK)
    stufe, anzahl, figuren = schwierigkeit(brett)
    return {
        "id": kennung,
        "fen": brett.fen(),
        "seite": seite,
        "struktur": struktur,
        "plan": plan,
        "merkmale": {
            "isolierte": _namen(w.isolierte + b.isolierte),
            "doppelte": _namen(w.doppelte + b.doppelte),
            "rueckstaendige": _namen(w.rueckstaendige + b.rueckstaendige),
            "freibauern": _namen(w.freibauern + b.freibauern),
            "inseln": {"w": w.inseln, "b": b.inseln},
        },
        "schwierigkeit": stufe,
        "herkunft": herkunft,
        "messung": {"merkmale": anzahl, "figuren": figuren},
    }


def aus_kapitel_5(datenordner: Path = DATENORDNER) -> list[dict]:
    daten = lies_json(datenordner / "kap05.json")
    aufgaben = []
    for a in daten["abbildungen"]:
        eintrag = BUCHSTRUKTUREN.get(a["id"])
        if eintrag is None:
            continue
        struktur, seite, plan = eintrag
        aufgaben.append(
            _aufgabe(
                f"struktur-b-{a['id']}",
                chess.Board(a["fen"]),
                struktur,
                seite,
                plan,
                {"quelle": "buch", "abbildung": a["id"]},
            )
        )
    return aufgaben


def aus_weiteren_kapiteln(datenordner: Path = DATENORDNER) -> list[dict]:
    """Abbildungen anderer Kapitel mit einer klaren Struktur; der Plan gilt für die Seite am Zug."""
    aufgaben = []
    gesehen: set[str] = set()
    for kapitel in WEITERE_KAPITEL:
        for a in lies_json(datenordner / f"kap{kapitel:02d}.json")["abbildungen"]:
            brett = chess.Board(a["fen"])
            schluessel = skelett(brett)
            anzahl_bauern = len(brett.pieces(chess.PAWN, True)) + len(brett.pieces(chess.PAWN, False))
            if anzahl_bauern < MINDESTENS_BAUERN or schluessel in gesehen:
                continue
            erkannt = erkenne(brett)
            if erkannt is None:
                continue
            struktur, besitzer = erkannt
            am_zug = brett.turn
            plan = (PLAN_BESITZER if am_zug == besitzer else PLAN_GEGNER).get(struktur)
            if plan is None:
                continue
            gesehen.add(schluessel)
            aufgaben.append(
                _aufgabe(
                    f"struktur-b-{a['id']}",
                    brett,
                    struktur,
                    "w" if am_zug else "b",
                    plan,
                    {"quelle": "buch", "abbildung": a["id"]},
                )
            )
    return aufgaben


def baue(ziel: Path = ZIELDATEI) -> dict:
    aufgaben = aus_kapitel_5() + aus_weiteren_kapiteln()
    daten = {
        "schemaVersion": 1,
        "trainer": "struktur",
        "erzeugt": {
            "datum": date.today().isoformat(),
            "engine": None,
            "skript": "pipeline/trainer/struktur.py",
        },
        "quellen": [
            {
                "kennung": "buch",
                "name": "Schach von Grund auf, Abbildungen (Kapitel 5; weitere Kapitel nach Regeln)",
                "lizenz": "Alle Rechte vorbehalten (nur Stellungen)",
                "anzahl": len(aufgaben),
            },
        ],
        "aufgaben": aufgaben,
    }
    schreibe_daten(ziel, daten, SCHEMA)
    return daten


if __name__ == "__main__":
    ergebnis = baue()
    print(f"{len(ergebnis['aufgaben'])} Aufgaben", file=sys.stderr)

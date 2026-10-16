"""Aufgabe 1: Lösungen der 86 Übungen mit Stockfish gegenprüfen → ``inhalte/de/trainer/uebungen-engine.json``.

Wozu diese Datei da ist:
    Beim Lösen in der App (AP 13) soll außer der Buchlösung auch jeder gleich gute Zug als richtig
    gelten. Für jede Übung mit Stellung und Lösungszug fragt die Pipeline die Engine: Hält die
    Buchlösung? Welche anderen Züge sind gleich gut (Vorschlag für „akzeptiert“)? Wo führt nur
    ein Zug zum Ziel? Die freigegebenen Lösungstexte bleiben unverändert; Abweichungen sind
    Vorschläge, der Autor entscheidet (CLAUDE.md, Regel 1).

Maßstab (Startwerte, wie bei der Engine-Prüfung der Zugzeichen):
    gleichwertig   höchstens 0,3 Bauerneinheiten schlechter als der beste Zug
    schwächer      bis 1,0 schlechter
    widerlegt      mehr als 1,0 schlechter, oder der beste Zug setzt matt und die Buchlösung nicht
    einziger Zug   jeder andere Zug ist mindestens 1,0 schlechter (Matt gegen kein Matt zählt auch)
    Ein längeres Matt gilt als gleichwertig zu einem kürzeren (beide gewinnen); ein Matt gilt nie
    als gleichwertig zu einem Zug ohne Matt. Erster Zug: erst Tiefe 14 über alle Züge, dann Tiefe
    20 für Buchzug, akzeptierte Züge und alles, was höchstens 0,6 hinter dem besten liegt
    („searchmoves“); die weiteren eigenen Züge der Buchlinie: Tiefe 18 gegen den besten Zug.
    Ist die Buchlösung widerlegt oder schwächer, gibt es keinen Vorschlag für „akzeptiert“: Dann
    muss der Autor die Lösung selbst ansehen (der bessere Zug steht in der Begründung).

Aufruf (im Hauptordner, Engine über ``cd app && npm ci``):
    python -m pipeline.trainer.uebungen
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path

import chess

from pipeline.trainer.daten import DATENORDNER, INHALTE, TRAINERORDNER, lies_json, schreibe_daten
from pipeline.trainer.engine import Engine, Zugwert, engine_vorhanden
from pipeline.trainer.notation import deutsch, erster_zug, spiele_linie, zuege_aus_text

GLEICHWERTIG_BIS = 0.3
SCHWAECHER_BIS = 1.0
EINZIGER_ZUG_AB = 1.0
TIEFE_ALLE = 14
TIEFE_GENAU = 20
TIEFE_LINIE = 18
# Züge, die nach der breiten Suche höchstens so viel hinter dem besten liegen, kommen in die genaue.
GENAU_BIS = 0.6
# So viele Züge je Übung kommen in die Datei (die besten, dazu immer Buchzug und akzeptierte).
HOECHSTENS_ZUEGE = 6
SCHEMA = "trainer-uebungen-engine.schema.json"
ZIELDATEI = TRAINERORDNER / "uebungen-engine.json"


@dataclass(frozen=True)
class Uebung:
    """Eine Übung mit Stellung und den Angaben des Autors."""

    kennung: str
    nummer: int
    kapitel: int
    abbildung: str | None
    fen: str | None
    loesung: str | None
    akzeptiert: list[str]
    motiv: str | None


@dataclass(frozen=True)
class Zugurteil:
    san: str
    wert: float
    matt: int | None
    verlust: float
    status: str  # „buch“, „akzeptiert“, „gleichwertig“, „schwaecher“, „widerlegt“


@dataclass(frozen=True)
class Urteil:
    """Das Urteil über den ersten Zug einer Übung (rein, testbar ohne Engine)."""

    urteil: str  # „haelt“, „gleichwertig“, „schwaecher“, „widerlegt“
    verlust: float
    bester: str
    einziger_zug: bool
    abstand_zweiter: float | None
    zuege: list[Zugurteil]
    vorschlag_akzeptiert: list[str]
    akzeptiert_fraglich: list[str]


def lies_uebungen(datenordner: Path = DATENORDNER, inhalte: Path = INHALTE) -> list[Uebung]:
    """Alle Übungen aus den Kapiteldateien mit Stellung und den Lösungsangaben des Autors."""
    uebungen: list[Uebung] = []
    for kapitel in range(13):
        daten = lies_json(datenordner / f"kap{kapitel:02d}.json")
        abbildungen = {a["id"]: a["fen"] for a in daten["abbildungen"]}
        erklaerungen = {
            e["uebung"]: e
            for e in lies_json(inhalte / "texte" / f"loesungen-kap{kapitel:02d}.json")["erklaerungen"]
        }
        for u in daten["uebungen"]:
            e = erklaerungen.get(u["id"], u.get("erklaerung") or {})
            abbildung = u["abbildungen"][0] if len(u["abbildungen"]) == 1 else None
            uebungen.append(
                Uebung(
                    u["id"],
                    u["nummer"],
                    kapitel,
                    abbildung,
                    abbildungen.get(abbildung) if abbildung else None,
                    e.get("loesung"),
                    list(e.get("akzeptiert") or []),
                    e.get("motiv"),
                )
            )
    return uebungen


def _gewinnt_matt(z: Zugwert) -> bool:
    return z.matt is not None and z.matt > 0


def _verlust(bester: Zugwert, zug: Zugwert) -> float:
    """Verlust gegenüber dem besten Zug; zwei Matts derselben Seite gelten als gleich gut."""
    if _gewinnt_matt(bester) and _gewinnt_matt(zug):
        return 0.0
    return round(bester.wert - zug.wert, 2)


def _status(verlust: float, bester: Zugwert, zug: Zugwert) -> str:
    if _gewinnt_matt(bester) and not _gewinnt_matt(zug):
        return "widerlegt"
    if verlust <= GLEICHWERTIG_BIS:
        return "gleichwertig"
    return "schwaecher" if verlust <= SCHWAECHER_BIS else "widerlegt"


def beurteile(zuege: list[Zugwert], buchzug: chess.Move, akzeptiert: list[chess.Move]) -> Urteil:
    """Beurteilt den Buchzug und findet gleichwertige Züge.

    Eingaben: alle Züge mit Wert (bester zuerst), der Buchzug, die vom Autor akzeptierten Züge.
    Beispiel: Übung 5 (1.41), Buch 1. cxd5, akzeptiert 1. exd5: Beide gleichwertig → „haelt“ und
    kein neuer Vorschlag. Sonderfall: Ein Buchzug, der nicht unter den Zügen ist, gilt als widerlegt.
    """
    bester = zuege[0]
    urteile: list[Zugurteil] = []
    for z in zuege:
        verlust = _verlust(bester, z)
        status = _status(verlust, bester, z)
        if z.zug == buchzug:
            status = "buch"
        elif z.zug in akzeptiert:
            status = "akzeptiert"
        urteile.append(Zugurteil(z.san, z.wert, z.matt, verlust, status))
    buch = next((u for u in urteile if u.status == "buch"), None)
    buchwert = next((z for z in zuege if z.zug == buchzug), None)
    if buch is None or buchwert is None:
        verlust_buch, urteil = SCHWAECHER_BIS + 1, "widerlegt"
    else:
        verlust_buch = buch.verlust
        status_buch = _status(verlust_buch, bester, buchwert)
        urteil = "haelt" if verlust_buch == 0 and status_buch == "gleichwertig" else status_buch
    andere = [u for u in urteile if u.status != "buch"]
    abstand = min((u.verlust for u in andere), default=None)
    einziger = abstand is None or abstand >= EINZIGER_ZUG_AB
    if buch is not None and buch.verlust > 0:
        einziger = False
    vorschlag = (
        [u.san for u in urteile if u.status == "gleichwertig" and not _nur_matt_fehlt(bester, u)]
        if urteil in ("haelt", "gleichwertig")
        else []
    )
    fraglich = [u.san for u in urteile if u.status == "akzeptiert" and u.verlust > GLEICHWERTIG_BIS]
    return Urteil(urteil, verlust_buch, bester.san, einziger, abstand, urteile, vorschlag, fraglich)


def _nur_matt_fehlt(bester: Zugwert, u: Zugurteil) -> bool:
    """Ein Zug ohne Matt ist nie ein Vorschlag, wenn der beste Zug matt setzt."""
    return _gewinnt_matt(bester) and not (u.matt is not None and u.matt > 0)


def _wert_text(wert: float, matt: int | None) -> str:
    if matt is not None:
        return f"M{matt}"
    return f"{wert:+.2f}"


def _pruefe_linie(engine: Engine, brett: chess.Board, zuege: list[str]) -> dict | None:
    """Prüft die eigenen Züge der Buchlinie nach dem ersten: der erste, der mehr als 0,3 verliert."""
    linie = spiele_linie(brett, zuege)
    if linie is None:
        return {"geprueft": False, "grund": "Zug der Linie geht nicht in der Stellung"}
    kopie = brett.copy()
    eigene_farbe = kopie.turn
    for halbzug, zug in enumerate(linie):
        if halbzug > 0 and kopie.turn == eigene_farbe and not kopie.is_game_over():
            bester = engine.bester(kopie, TIEFE_LINIE)
            gespielt = engine.alle_zuege(kopie, TIEFE_LINIE, nur=[zug])
            if bester is not None and gespielt:
                verlust = _verlust(bester, gespielt[0])
                if verlust > GLEICHWERTIG_BIS:
                    return {
                        "geprueft": True,
                        "abweichung": {
                            "halbzug": halbzug + 1,
                            "zug": deutsch(kopie, zug),
                            "verlust": verlust,
                            "besser": deutsch(kopie, bester.zug),
                        },
                    }
        kopie.push(zug)
    return {"geprueft": True, "abweichung": None}


def zuege_genau(engine: Engine, brett: chess.Board, immer: list[chess.Move]) -> list[Zugwert]:
    """Alle Züge bewertet: breit mit Tiefe 14, die aussichtsreichen (und ``immer``) genau mit Tiefe 22.

    Warum zwei Stufen: Tiefe 22 über alle 30 bis 40 Züge einer Stellung dauert Minuten; die
    breite Suche sortiert die aussichtslosen aus, die genaue entscheidet über „gleichwertig“.
    """
    breit = engine.alle_zuege(brett, TIEFE_ALLE)
    if not breit:
        return []
    naeher = {z.zug for z in breit if _verlust(breit[0], z) <= GENAU_BIS} | set(immer)
    genau = engine.alle_zuege(brett, TIEFE_GENAU, nur=[z.zug for z in breit if z.zug in naeher])
    rest = [z for z in breit if z.zug not in naeher]
    return sorted(genau + rest, key=lambda z: z.wert, reverse=True)


def _begruendung(brett: chess.Board, urteil: Urteil, zuege: list[Zugwert], buchzug: str) -> str:
    """Ein Satz für den Autor, in der Notation des Buches."""
    bester = zuege[0]
    teile = [f"Buch {buchzug}: {_wert_text(zuege[[z.san for z in zuege].index(buchzug)].wert, None)}"]
    if urteil.urteil == "gleichwertig":
        teile.append(
            f"bester Zug laut Engine {deutsch(brett, bester.zug)} ({_wert_text(bester.wert, bester.matt)})"
        )
    elif urteil.urteil != "haelt":
        teile.append(f"besser {deutsch(brett, bester.zug)} ({_wert_text(bester.wert, bester.matt)})")
    if urteil.vorschlag_akzeptiert:
        namen = ", ".join(deutsch(brett, brett.parse_san(san)) for san in urteil.vorschlag_akzeptiert)
        teile.append(f"gleichwertig: {namen}")
    if urteil.einziger_zug:
        abstand = "" if urteil.abstand_zweiter is None else f" ({urteil.abstand_zweiter:.1f} Abstand)"
        teile.append(f"einziger Zug{abstand}")
    if urteil.akzeptiert_fraglich:
        teile.append("akzeptiert, aber schwächer: " + ", ".join(urteil.akzeptiert_fraglich))
    return "; ".join(teile)


def pruefe_uebung(engine: Engine, u: Uebung) -> dict:
    """Prüft eine Übung und liefert ihren Eintrag für die Datei."""
    eintrag: dict = {
        "uebung": u.kennung,
        "nummer": u.nummer,
        "kapitel": u.kapitel,
        "abbildung": u.abbildung,
        "fen": u.fen,
        "motiv": u.motiv,
        "buchloesung": u.loesung,
        "akzeptiertBuch": u.akzeptiert,
    }
    if u.fen is None:
        return {**eintrag, "art": "ohneStellung", "amZug": None}
    brett = chess.Board(u.fen)
    eintrag["amZug"] = "w" if brett.turn == chess.WHITE else "b"
    buchzug = erster_zug(brett, u.loesung)
    akzeptiert = [z for san in u.akzeptiert if (z := erster_zug(brett, san)) is not None]
    alle = zuege_genau(engine, brett, [z for z in [buchzug, *akzeptiert] if z is not None])
    if not alle:
        return {**eintrag, "art": "ohneZug"}
    bester = alle[0]
    eintrag["besterZug"] = bester.san
    eintrag["wert"] = _wert_text(bester.wert, bester.matt)
    if buchzug is None:
        return {**eintrag, "art": "ohneZug"}
    urteil = beurteile(alle, buchzug, akzeptiert)
    gezeigt = [z for z in urteil.zuege if z.status in ("buch", "akzeptiert")]
    weitere = [z for z in urteil.zuege if z.status not in ("buch", "akzeptiert")]
    gezeigt += weitere[: HOECHSTENS_ZUEGE - len(gezeigt)]
    gezeigt.sort(key=lambda z: z.verlust)
    return {
        **eintrag,
        "art": "zug",
        "buchzug": brett.san(buchzug),
        "urteil": urteil.urteil,
        "verlust": urteil.verlust,
        "einzigerZug": urteil.einziger_zug,
        "abstandZweiter": urteil.abstand_zweiter,
        "zuege": [
            {"san": z.san, "wert": _wert_text(z.wert, z.matt), "verlust": z.verlust, "status": z.status}
            for z in gezeigt
        ],
        "vorschlagAkzeptiert": urteil.vorschlag_akzeptiert,
        "akzeptiertFraglich": urteil.akzeptiert_fraglich,
        "linie": _pruefe_linie(engine, brett, zuege_aus_text(u.loesung or "")),
        "begruendung": _begruendung(brett, urteil, alle, brett.san(buchzug)),
    }


def baue(ziel: Path = ZIELDATEI, nur: set[str] | None = None) -> dict:
    """Prüft alle Übungen und schreibt die Datei; ``nur`` begrenzt auf Kennungen (zum Probieren)."""
    uebungen = [u for u in lies_uebungen() if nur is None or u.kennung in nur]
    with Engine() as engine:
        eintraege = []
        for u in uebungen:
            print(f"Übung {u.nummer:2d} {u.kennung}", file=sys.stderr)
            eintraege.append(pruefe_uebung(engine, u))
    daten = {
        "schemaVersion": 1,
        "engine": {
            "name": "Stockfish 19 lite (ein Kern)",
            "tiefe": TIEFE_GENAU,
            "datum": date.today().isoformat(),
        },
        "massstab": {
            "gleichwertigBis": GLEICHWERTIG_BIS,
            "schwaecherBis": SCHWAECHER_BIS,
            "einzigerZugAb": EINZIGER_ZUG_AB,
        },
        "uebungen": eintraege,
    }
    schreibe_daten(ziel, daten, SCHEMA)
    return daten


def zusammenfassung(daten: dict) -> str:
    """Kurze Übersicht für docs/TRAINERDATEN.md (nur Nummern, Züge, Urteile)."""
    zeilen = []
    for e in daten["uebungen"]:
        if e["art"] != "zug":
            continue
        teile = [f"- Übung {e['nummer']} ({e['abbildung']}): {e['urteil']}"]
        if e["vorschlagAkzeptiert"]:
            teile.append("Vorschlag akzeptiert: " + ", ".join(e["vorschlagAkzeptiert"]))
        if e["einzigerZug"]:
            teile.append("einziger Zug")
        zeilen.append(", ".join(teile))
    return "\n".join(zeilen)


if __name__ == "__main__":
    if not engine_vorhanden():
        sys.exit("Engine fehlt: cd app && npm ci")
    ergebnis = baue()
    print(json.dumps({"uebungen": len(ergebnis["uebungen"])}))

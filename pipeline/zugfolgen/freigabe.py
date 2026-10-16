"""Prüfhilfe für die Freigabe der Zugfolgen (AP 4): je Kapitel eine lesbare Übersicht.

Wozu diese Datei da ist:
    Der Autor gibt die PGN-Entwürfe in ``inhalte/de/zugfolgen/`` frei (siehe ``inhalte/de/README.md``).
    PGN in englischer Notation ist dafür mühsam. Die Prüfhilfe ``buch/arbeit/freigabe/kapNN.md``
    (nur lokal) zeigt
    jedes Beispiel in deutscher Notation wie im Buch: Hauptlinie, Abzweigungen mit Fundstelle,
    an welchem Zug welche Abbildung steht, und die Befunde der Pipeline zu diesem Beispiel. Zu
    Befunden, die schon geprüft sind, steht die Einschätzung mit Korrekturvorschlag dabei
    (``inhalte/de/einschaetzungen.json``, von Hand gepflegt).

Rolle im Gesamtbild:
    Wird bei jedem Datenlauf neu geschrieben (``python -m pipeline.bauen``), nie von Hand
    geändert. Die Prüfhilfe zitiert keine Buchsätze, nur Züge, Nummern und Fundstellen, weil das
    Repository öffentlich wird (CLAUDE.md, Regel 2).
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import chess

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.zugfolgen import auf_deutsch
from pipeline.zugfolgen.baum import Beispiel, Knoten
from pipeline.zugfolgen.empfehlungen import (
    Einschaetzung,
    Empfehlungen,
    lies_einschaetzungen,
    tabelle_ohne_zugfolge,
    zeilen_zum_beispiel,
)
from pipeline.zugfolgen.pgn import STATUS_FREIGEGEBEN, STATUS_VERWORFEN, lies_status

# Befunde, die das Nachspielen der Zugfolgen betreffen; nur sie gehören in die Prüfhilfe.
ZUGFOLGEN_KENNUNGEN = (
    "zug-illegal",
    "zugfolge-unlesbar",
    "zugfolge-ohne-anschluss",
    "unterschrift-stellung",
    "unterschrift-ohne-anschluss",
    "zugnummer",
    "schachzeichen",
    "zugzeichen",
    "fen-rochade",
    "entwurf-abweichend",
)
_SCHWERE = {Schwere.FEHLER: "Fehler", Schwere.WARNUNG: "Warnung", Schwere.HINWEIS: "Hinweis"}


@dataclass
class Kapitelpruefhilfe:
    """Alles, was die Prüfhilfe eines Kapitels braucht."""

    kapitel: int
    titel: str
    quelldatei: str  # etwa „kap07_taktik.tex“, um die Befunde des Kapitels zu finden
    beispiele: list[Beispiel]
    ohne_zugfolge: list[str]  # Abbildungsnummern ohne Zugfolge


def schreibe_pruefhilfe(
    hilfe: Kapitelpruefhilfe,
    befunde: list[Befund],
    einschaetzungen: list[Einschaetzung],
    zugfolgenordner: Path,
    ziel: Path,
    datum: str,
    empfehlungen: Empfehlungen | None = None,
) -> Path:
    """Schreibt ``kapNN.md`` mit allen Beispielen eines Kapitels und liefert den Pfad.

    Beispiel: ``buch/arbeit/freigabe/kap10.md`` zeigt unter „k10-10“ die Hauptlinie
    „1. Kg7! h4 2. Kf7!“ mit Abb. 10.26 an der Wurzel und die Abzweigungen „statt 1. Kg7!:
    1. d6?“ und „statt 1... h4: 1... Kc7 2. Kf6! …“.
    """
    eigene = [
        b
        for b in befunde
        if b.kennung in ZUGFOLGEN_KENNUNGEN and b.fundstelle.partition(":")[0] == hilfe.quelldatei
    ]
    zuordnung = _ordne_befunde_zu(hilfe.beispiele, eigene)
    empfehlungen = empfehlungen or Empfehlungen()
    zeilen = _kopf(hilfe, datum, eigene)
    zeilen += _uebersicht(hilfe, zugfolgenordner, zuordnung)
    for beispiel in hilfe.beispiele:
        zeilen += _beispiel(
            beispiel, hilfe.beispiele, zugfolgenordner, zuordnung.get(beispiel.id, []), einschaetzungen
        )
        zeilen += zeilen_zum_beispiel(beispiel.id, empfehlungen) if beispiel.anzahl_zuege() else []
    zeilen += _uebrige(hilfe, zuordnung.get("", []), einschaetzungen, empfehlungen)
    ziel.mkdir(parents=True, exist_ok=True)
    pfad = ziel / f"kap{hilfe.kapitel:02d}.md"
    pfad.write_text("\n".join(zeilen).rstrip() + "\n", encoding="utf-8")
    return pfad


def schreibe_freigabeuebersicht(
    hilfen: list[Kapitelpruefhilfe],
    befunde: list[Befund],
    einschaetzungen: list[Einschaetzung],
    ziel: Path,
    datum: str,
) -> Path:
    """Schreibt ``buch/arbeit/freigabe/README.md``: je Kapitel Beispiele, Befunde und offene Einschätzungen.

    „Offen“ heißt: Warnung ohne Einschätzung. Einschätzungen, zu denen kein Befund mehr passt,
    stehen am Ende; sie sind erledigt (etwa weil das Buch korrigiert ist) und können entfallen.
    """
    zugfolgenbefunde = [b for b in befunde if b.kennung in ZUGFOLGEN_KENNUNGEN]
    zeilen = [
        "# Freigabe der Zugfolgen (AP 4)",
        "",
        f"Stand: Datenlauf vom {datum}. Je Kapitel eine Prüfhilfe; sie wird bei jedem Datenlauf neu "
        "geschrieben. Anleitung zur Freigabe: `inhalte/de/README.md`.",
        "",
        "| Kapitel | Beispiele | Befunde | Warnungen | davon ohne Einschätzung |",
        "|---|---|---|---|---|",
    ]
    for hilfe in hilfen:
        eigene = [b for b in zugfolgenbefunde if b.fundstelle.partition(":")[0] == hilfe.quelldatei]
        warnungen = [b for b in eigene if b.schwere != Schwere.HINWEIS]
        offen = [b for b in warnungen if not any(e.passt(b) for e in einschaetzungen)]
        zeilen.append(
            f"| [{hilfe.kapitel}: {hilfe.titel}](kap{hilfe.kapitel:02d}.md) | {len(hilfe.beispiele)} "
            f"| {len(eigene)} | {len(warnungen)} | {len(offen)} |"
        )
    erledigt = [e for e in einschaetzungen if not any(e.passt(b) for b in zugfolgenbefunde)]
    if erledigt:
        zeilen += ["", "Einschätzungen ohne passenden Befund (erledigt):", ""]
        zeilen += [f"- {e.datei}, {e.kennung}: „{e.enthaelt}“" for e in erledigt]
    ziel.mkdir(parents=True, exist_ok=True)
    pfad = ziel / "README.md"
    pfad.write_text("\n".join(zeilen) + "\n", encoding="utf-8")
    return pfad


def _kopf(hilfe: Kapitelpruefhilfe, datum: str, befunde: list[Befund]) -> list[str]:
    warnungen = sum(1 for b in befunde if b.schwere != Schwere.HINWEIS)
    return [
        f"# Freigabe Kapitel {hilfe.kapitel}: {hilfe.titel}",
        "",
        f"Stand: Datenlauf vom {datum}. Diese Datei schreibt die Pipeline bei jedem Datenlauf neu; "
        "Änderungen bitte in den PGN-Dateien, nicht hier.",
        "",
        "So prüfst du ein Beispiel: Hauptlinie und Abzweigungen mit dem Buch vergleichen, die "
        "Abbildungen (in eckigen Klammern) müssen nach genau diesem Zug stehen. Passt alles, in der "
        'PGN-Datei `[Status "entwurf"]` durch `[Status "freigegeben"]` ersetzen. Fehlt etwas oder ist '
        "etwas falsch angehängt, die PGN-Datei korrigieren und dann freigeben "
        "(Anleitung: `inhalte/de/README.md`).",
        "",
        f"Beispiele: {len(hilfe.beispiele)}, Befunde zu den Zugfolgen: {len(befunde)} "
        f"(davon {warnungen} Warnungen), Abbildungen ohne Zugfolge: {len(hilfe.ohne_zugfolge)}.",
        "",
    ]


def _uebersicht(
    hilfe: Kapitelpruefhilfe, zugfolgenordner: Path, zuordnung: dict[str, list[Befund]]
) -> list[str]:
    zeilen = [
        "| Beispiel | Abschnitt | Titel | Züge | Abzweigungen | Abbildungen | Befunde | Status |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for b in hilfe.beispiele:
        status = _status(b, zugfolgenordner)
        zeilen.append(
            f"| [{b.id}](#{b.id}) | {b.abschnitt or '–'} | {b.titel} | {b.anzahl_zuege()} "
            f"| {b.anzahl_abzweigungen()} | {', '.join(b.abbildungen()) or '–'} "
            f"| {len(zuordnung.get(b.id, []))} | {status} |"
        )
    return [*zeilen, ""]


def _status(beispiel: Beispiel, zugfolgenordner: Path) -> str:
    pfad = zugfolgenordner / f"kap{beispiel.kapitel:02d}" / f"{beispiel.id}.pgn"
    return lies_status(pfad) if pfad.exists() else "ohne Datei"


def _beispiel(
    beispiel: Beispiel,
    alle: list[Beispiel],
    zugfolgenordner: Path,
    befunde: list[Befund],
    einschaetzungen: list[Einschaetzung],
) -> list[str]:
    """Abschnitt eines Beispiels: Start, Hauptlinie, Abzweigungen, Befunde."""
    if beispiel.anzahl_zuege() == 0:
        return []
    datei = f"inhalte/de/zugfolgen/kap{beispiel.kapitel:02d}/{beispiel.id}.pgn"
    status = _status(beispiel, zugfolgenordner)
    hauptlinie, abzweigungen = _hauptlinie(beispiel.wurzel)
    zeilen = [
        f'<a id="{beispiel.id}"></a>',
        f"## {beispiel.id} · {beispiel.titel}",
        "",
        f"Abschnitt {beispiel.abschnitt or '–'} · Datei `{datei}` · Status: {status}",
        "",
        f"Start: {_start(beispiel)}",
        "",
        f"Hauptlinie: {hauptlinie}",
        "",
    ]
    if status in (STATUS_FREIGEGEBEN, STATUS_VERWORFEN):
        zeilen += [f"Bereits {status}: Die Datei bleibt unverändert; dieser Baum ist der neue Vorschlag.", ""]
    if abzweigungen:
        zeilen += ["Abzweigungen:", ""]
        zeilen += [
            f"- statt {_zug(haupt, True)}: {_variante(neben)} · {_zeile(neben.fundstelle)}"
            for haupt, neben in abzweigungen
        ]
        zeilen.append("")
    zeilen += _doppelte_startstellung(beispiel, alle)
    zeilen += _befundliste(befunde, einschaetzungen)
    return zeilen


def _doppelte_startstellung(beispiel: Beispiel, alle: list[Beispiel]) -> list[str]:
    """Hinweis, wenn die Startstellung auch mitten in einem anderen Beispiel des Kapitels vorkommt.

    Warum: Steht der Text vor seinen Diagrammen, beginnt ein Teil der Züge manchmal ein eigenes
    Beispiel an einer späteren Abbildung (Saavedra-Studie: Abb. 10.2). Ob beide zusammengehören
    oder getrennt bleiben sollen (eine Übung zu einer Partiestellung), entscheidet der Autor.
    """
    if beispiel.wurzel_abbildung is None:
        return []
    zeilen = []
    for anderes in alle:
        if anderes is beispiel:
            continue
        knoten = next(
            (
                k
                for k in anderes.knoten()
                if k.eltern is not None and k.schluessel == beispiel.wurzel.schluessel
            ),
            None,
        )
        if knoten is not None:
            uebung = any((b.abschnitt or "").startswith("Übung") for b in (beispiel, anderes))
            rat = (
                "Empfehlung: getrennt lassen, eine Übung bleibt ein eigenes Beispiel."
                if uebung
                else "Gehören beide zusammen, die Züge dort anhängen und diese Datei verwerfen."
            )
            zeilen.append(
                f"Hinweis: Die Startstellung kommt auch in [{anderes.id}](#{anderes.id}) nach "
                f"{_zug(knoten, True)} vor. {rat}"
            )
    return [*zeilen, ""] if zeilen else []


def _start(beispiel: Beispiel) -> str:
    brett = beispiel.wurzel.brett
    seite = "Weiß" if brett.turn == chess.WHITE else "Schwarz"
    if beispiel.wurzel_abbildung:
        return f"Abb. {beispiel.wurzel_abbildung}, {seite} am Zug (Zug {brett.fullmove_number})"
    if brett.fen() == chess.STARTING_FEN:
        return "Grundstellung"
    return f"`{brett.fen()}`, {seite} am Zug"


def _hauptlinie(wurzel: Knoten) -> tuple[str, list[tuple[Knoten, Knoten]]]:
    """Die Hauptlinie ab der Wurzel und alle Abzweigungen davon als (Hauptzug, Alternative)."""
    teile, abzweigungen = [], []
    knoten, nummer = wurzel, True
    while knoten.kinder:
        haupt, *neben = knoten.kinder
        teile.append(_zug(haupt, nummer) + _marke(haupt))
        abzweigungen += [(haupt, alternative) for alternative in neben]
        nummer = bool(haupt.abbildungen)
        knoten = haupt
    return " ".join(teile), abzweigungen


def _variante(start: Knoten) -> str:
    """Eine Abzweigung mit ihren eigenen Unterabzweigungen in Klammern, wie in PGN."""
    teile = [_zug(start, True) + _marke(start)]
    knoten, nummer = start, bool(start.abbildungen)
    while knoten.kinder:
        haupt, *neben = knoten.kinder
        teile.append(_zug(haupt, nummer) + _marke(haupt))
        teile += [f"({_variante(alternative)})" for alternative in neben]
        nummer = bool(neben) or bool(haupt.abbildungen)
        knoten = haupt
    return " ".join(teile)


def _zug(knoten: Knoten, mit_nummer: bool) -> str:
    """„5. Sc3“, „5... a6“ oder (mitten in der Linie) „a6“; Zugzeichen wie im Buch."""
    assert knoten.eltern is not None
    davor = knoten.eltern.brett
    text = auf_deutsch(knoten.san) + knoten.zeichen
    if davor.turn == chess.WHITE:
        return f"{davor.fullmove_number}. {text}"
    return f"{davor.fullmove_number}... {text}" if mit_nummer else text


def _marke(knoten: Knoten) -> str:
    return f" **[Abb. {', '.join(knoten.abbildungen)}]**" if knoten.abbildungen else ""


def _zeile(fundstelle: str) -> str:
    _, _, zeile = fundstelle.partition(":")
    return f"Z. {zeile}" if zeile else fundstelle or "–"


def _ordne_befunde_zu(beispiele: list[Beispiel], befunde: list[Befund]) -> dict[str, list[Befund]]:
    """Ordnet jeden Befund dem Beispiel zu, dessen Abbildung oder Zugfolge er betrifft ("" = keinem)."""
    nach_abbildung = {nummer: b.id for b in beispiele for nummer in b.abbildungen()}
    nach_fundstelle: dict[str, str] = {}
    for beispiel in beispiele:
        for knoten in beispiel.knoten():
            nach_fundstelle.setdefault(knoten.fundstelle, beispiel.id)
    zuordnung: dict[str, list[Befund]] = {}
    for befund in befunde:
        kennung = nach_abbildung.get(befund.abbildung or "") or nach_fundstelle.get(befund.fundstelle, "")
        zuordnung.setdefault(kennung, []).append(befund)
    return zuordnung


def _befundliste(befunde: list[Befund], einschaetzungen: list[Einschaetzung]) -> list[str]:
    if not befunde:
        return []
    zeilen = ["Befunde:", ""]
    for befund in befunde:
        abbildung = f"Abb. {befund.abbildung}, " if befund.abbildung else ""
        zeilen.append(
            f"- {_SCHWERE[befund.schwere]} ({befund.kennung}, {abbildung}{_zeile(befund.fundstelle)}): "
            f"{befund.text}"
        )
        einschaetzung = next((e for e in einschaetzungen if e.passt(befund)), None)
        if einschaetzung is not None:
            zeilen.append(f"  - **{einschaetzung.urteil}.** {einschaetzung.begruendung}")
            zeilen.append(f"  - Vorschlag: {einschaetzung.vorschlag}")
    return [*zeilen, ""]


def _uebrige(
    hilfe: Kapitelpruefhilfe,
    befunde: list[Befund],
    einschaetzungen: list[Einschaetzung],
    empfehlungen: Empfehlungen,
) -> list[str]:
    """Befunde ohne Beispiel und Abbildungen ohne Zugfolge am Ende der Datei."""
    zeilen: list[str] = []
    if befunde:
        zeilen += ["## Befunde ohne Beispiel", ""]
        zeilen += _befundliste(befunde, einschaetzungen)[2:]
    if hilfe.ohne_zugfolge:
        zeilen += [
            "## Abbildungen ohne Zugfolge",
            "",
            "Diese Abbildungen zeigt die App als einzelne Stellung. Wo „Zugfolge möglich“ steht, "
            "kann Claude bei der Freigabe eine Zugfolge anlegen, wenn Sie zustimmen.",
            "",
            *tabelle_ohne_zugfolge(hilfe.ohne_zugfolge, empfehlungen),
        ]
    return zeilen


__all__ = [
    "Einschaetzung",
    "Kapitelpruefhilfe",
    "ZUGFOLGEN_KENNUNGEN",
    "lies_einschaetzungen",
    "schreibe_freigabeuebersicht",
    "schreibe_pruefhilfe",
]

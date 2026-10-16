"""Prüfungen der Abbildungen eines Kapitels.

Wozu diese Datei da ist:
    Schritt 2 „Prüfen“ der Pipeline (Konzept Abschnitt 5). Jede Abbildung wird
    geprüft, bevor sie in die App kommt. Gefundene Probleme werden Befunde für den
    Autor, nie stille Korrekturen.

Geprüft wird:
    FEN       lesbar und regelgerecht (python-chess, ``Board.status``)
    Zugseite  passt zur Unterschrift („Weiß am Zug“, „Nach 5... Db6“)
    Nummern   eindeutig, zum Kapitel passend, ohne Lücken
    Verweise  ``\\abb{x.y}`` innerhalb des Kapitels zeigt auf eine vorhandene Abbildung

    Matt      eine Mattstellung wird in der Unterschrift genannt (Hinweis)

Die buchweiten Prüfungen aus ``pruefe_buch.py`` stehen in ``pruefen/buch.py``.
"""

from __future__ import annotations

import re

import chess

from pipeline.befunde import Befund, Schwere

# Ein Zug in deutscher Kurznotation, wie er in Bildunterschriften steht,
# mit optionalen Zeichen für Schach, Matt und Bewertung („Sxc7+!“, „O-O“).
_ZUG = re.compile(r"^(O-O-O|O-O|[KDTLS]?[a-h]?[1-8]?x?[a-h][1-8](=[DTLS])?)[+#]?[!?]*$")
_ZUGNUMMER = re.compile(r"^(\d+)\.(\.\.)?$")
_SATZZEICHEN_AM_ENDE = ",;:)"


# Lehrbilder ohne Könige (Gangarten, leeres Brett) sind erlaubt (pruefe_buch.py, Teil 1).
_ERLAUBT_OHNE_KOENIG = (
    chess.STATUS_NO_WHITE_KING | chess.STATUS_NO_BLACK_KING | chess.STATUS_EMPTY | chess.STATUS_OPPOSITE_CHECK
)


def pruefe_fen(fen: str, fundstelle: str) -> list[Befund]:
    """Prüft, ob die FEN lesbar und die Stellung regelgerecht ist.

    Regelgerecht heißt: je ein König, kein Bauer auf der ersten oder achten Reihe,
    die Seite, die nicht am Zug ist, steht nicht im Schach (python-chess prüft das).
    Ausnahme wie in ``pruefe_buch.py``: Fehlt ein König, ist es ein Lehrbild (Gangarten in
    Kapitel 0, Bauernstrukturen in Kapitel 5). Das ist erlaubt und wird nur als Hinweis
    gemeldet, weil die App dort keine Engine anbieten kann.
    Beispiel: Die FEN von Abb. 1.26 ist regelgerecht; Abb. 0.3 (leeres Brett) ist ein Lehrbild.
    """
    try:
        brett = chess.Board(fen)
    except ValueError as fehler:
        return [Befund(Schwere.FEHLER, "fen", f"FEN nicht lesbar: {fehler}", fundstelle)]
    status = brett.status()
    if status == chess.STATUS_VALID:
        return []
    ohne_koenig = brett.king(chess.WHITE) is None or brett.king(chess.BLACK) is None
    rest = status & ~_ERLAUBT_OHNE_KOENIG if ohne_koenig else status
    if rest:
        gruende = [name for name, wert in chess.Status.__members__.items() if wert and rest & wert]
        return [
            Befund(Schwere.FEHLER, "fen", f"Stellung nicht regelgerecht: {', '.join(gruende)}", fundstelle)
        ]
    return [Befund(Schwere.HINWEIS, "ohne-koenig", "Lehrbild ohne König: in der App ohne Engine", fundstelle)]


def pruefe_matt(fen: str, text: str, fundstelle: str) -> list[Befund]:
    """Hinweis, wenn die Stellung matt ist, die Unterschrift es aber nicht sagt (pruefe_buch.py).

    Beispiel: Abb. 1.15 nach 4. Dxf7# nennt das Matt, also kein Hinweis.
    """
    try:
        brett = chess.Board(fen)
    except ValueError:
        return []  # meldet pruefe_fen
    if brett.is_valid() and brett.is_checkmate() and "matt" not in text.lower() and "#" not in text:
        return [
            Befund(
                Schwere.HINWEIS,
                "matt-ungenannt",
                "Stellung ist matt, die Unterschrift sagt es nicht",
                fundstelle,
            )
        ]
    return []


def zugseite_laut_text(text: str) -> str | None:
    """Liest aus der Unterschrift, wer am Zug ist: ``"w"``, ``"b"`` oder ``None``.

    Zuerst zählen ausdrückliche Angaben („Weiß am Zug“, „Schwarz am Zug“). Sonst wird
    die einleitende Zugfolge „Nach …“ ausgewertet: Nach einem weißen Zug ist Schwarz
    am Zug und umgekehrt.

    Beispiele: „Nach 2. Lf4 – Ziel 1“ → ``"b"``; „Nach 5... Db6, Weiß am Zug“ → ``"w"``;
    „Nach 2... Kg8 3. Dh5“ → ``"b"``.
    """
    ausdruecklich = re.search(r"(Weiß|Schwarz) am Zug", text)  # die erste Nennung zählt
    if ausdruecklich:
        return "w" if ausdruecklich.group(1) == "Weiß" else "b"
    treffer = re.match(r"\s*Nach\s+(.*)", text)
    if not treffer:
        return None
    return _seite_nach_zugfolge(treffer.group(1))


def _seite_nach_zugfolge(text: str) -> str | None:
    """Geht die Zugfolge am Anfang des Textes durch und liefert, wer danach zieht."""
    naechste_seite: str | None = None
    zuege_gesehen = 0
    for wort in text.split():
        wort = wort.rstrip(_SATZZEICHEN_AM_ENDE)
        nummer = _ZUGNUMMER.match(wort)
        if nummer:
            naechste_seite = "b" if nummer.group(2) else "w"
            continue
        # Ein Satzende-Punkt hinter dem letzten Zug („5. Se5.“) gehört nicht zum Zug.
        if naechste_seite and _ZUG.match(wort.rstrip(".")):
            zuege_gesehen += 1
            naechste_seite = "b" if naechste_seite == "w" else "w"
            continue
        break  # Ende der Zugfolge: Gedankenstrich, Wort, Satzzeichen
    return naechste_seite if zuege_gesehen else None


def pruefe_zugseite(fen: str, text: str, fundstelle: str) -> list[Befund]:
    """Vergleicht die Zugseite der FEN mit der Unterschrift."""
    erwartet = zugseite_laut_text(text)
    if erwartet is None:
        return []
    teile = fen.split()
    tatsaechlich = teile[1] if len(teile) > 1 else "w"
    if erwartet == tatsaechlich:
        return []
    namen = {"w": "Weiß", "b": "Schwarz"}
    return [
        Befund(
            Schwere.WARNUNG,
            "zugseite",
            f"Laut Unterschrift ist {namen[erwartet]} am Zug, laut FEN {namen[tatsaechlich]}",
            fundstelle,
        )
    ]


def _nummer_als_paar(nummer: str) -> tuple[int, int]:
    kapitel, _, laufend = nummer.partition(".")
    return int(kapitel), int(laufend)


def pruefe_nummern(kapitel: int, nummern: list[tuple[str, str]]) -> list[Befund]:
    """Prüft Abbildungsnummern eines Kapitels: eindeutig, passend, lückenlos.

    Eingabe: Kapitelnummer und Liste aus (Nummer, Fundstelle) in Textreihenfolge.
    Lücken sind nur ein Hinweis: Auch Fotos belegen eine Nummer. Ob jede Nummer ein Ziel
    hat, prüft ``pruefen/buch.py`` über alle ``\\abbziel``.
    """
    befunde: list[Befund] = []
    gesehen: dict[str, str] = {}
    for nummer, fundstelle in nummern:
        if nummer in gesehen:
            befunde.append(
                Befund(
                    Schwere.FEHLER,
                    "nummer-doppelt",
                    f"Abb. {nummer} doppelt (auch {gesehen[nummer]})",
                    fundstelle,
                    nummer,
                )
            )
        gesehen[nummer] = fundstelle
        if _nummer_als_paar(nummer)[0] != kapitel:
            befunde.append(
                Befund(
                    Schwere.FEHLER,
                    "nummer-kapitel",
                    f"Abb. {nummer} steht in Kapitel {kapitel}",
                    fundstelle,
                    nummer,
                )
            )
    laufende = sorted(_nummer_als_paar(n)[1] for n in gesehen if _nummer_als_paar(n)[0] == kapitel)
    fehlende = sorted(set(range(1, (laufende[-1] if laufende else 0) + 1)) - set(laufende))
    if fehlende:
        liste = ", ".join(f"{kapitel}.{n}" for n in fehlende)
        befunde.append(
            Befund(
                Schwere.HINWEIS, "nummer-luecke", f"Ohne Diagramm (Bild): Abb. {liste}", f"Kapitel {kapitel}"
            )
        )
    return befunde


def pruefe_verweise(kapitel: int, verweise: list[tuple[str, str, str]], vorhandene: set[str]) -> list[Befund]:
    """Prüft Verweise auf Abbildungen desselben Kapitels.

    Eingabe: Liste aus (Ziel-Nummer, verweisende Abbildung, Fundstelle).
    Verweise in andere Kapitel prüft der Bau des Verzeichnisses, sobald alle
    Kapitel gelesen sind (AP 2).
    """
    befunde = []
    for ziel, quelle, fundstelle in verweise:
        if _nummer_als_paar(ziel)[0] == kapitel and ziel not in vorhandene:
            befunde.append(
                Befund(
                    Schwere.WARNUNG, "verweis", f"Verweis auf Abb. {ziel} ohne Diagramm", fundstelle, quelle
                )
            )
    return befunde

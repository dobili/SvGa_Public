"""Schachliche Prüfung der Brettbeispiele im Dialog (``inhalte/abenteuer/brettbeispiele.json``).

Warum (Wunsch des Autors, 22.11.2026): Erklärt eine Figur im Spiel ein Schachkonzept, zeigt sie es
an einem kleinen Brett. Das Gezeigte muss stimmen: Eine Gabel greift wirklich zwei Figuren an, eine
Fesselung fesselt wirklich, jede Stellung ist legal. Diese Prüfung läuft als Dauertest
(``pipeline/tests/test_abenteuer_brettbeispiel.py``); sie meldet Befunde als Text.

Prüfarten (Feld ``pruefung`` je Beispiel, ``bild`` = Index in ``bilder``):
- ``gabel``: Die Figur auf ``feld`` greift jedes Feld in ``ziele`` an, dort steht eine gegnerische
  Figur (Regel: Kapitel 7, Doppelangriff und Gabel).
- ``fesselung``: Die Figur auf ``feld`` ist gefesselt, durch ``durch`` an ``an`` (Kapitel 7).
- ``spiess``: ``feld`` greift ``vorne`` an, dahinter auf derselben Linie ``hinten``, dazwischen frei.
- ``opposition``: Die Könige stehen auf einer Linie oder Reihe mit einem Feld dazwischen.
- ``quadrat``: Ob der König den Bauern einholt (``faengt``), nach der Regel des Quadrats (Kapitel 8).
- ``matt``: Im Bild ist Schachmatt. ``zaehlen``: Angreifer und Verteidiger auf ``feld`` (Kapitel 1).
- ``springerfarbe``: Die markierten Ziele (Pfeile oder Felder) sind genau die Springerzüge, alle auf
  der anderen Farbe.
- ``turm_hinter_freibauer``: Turm auf der Linie des Freibauern, dahinter (Tarrasch-Regel, Kapitel 9).
- ``aus_grundstellung``: Die Stellung entsteht aus der Grundstellung mit ``zuege``.
- ``start960``: gültige Grundstellung für Schach960. ``legal``: nur die Grundprüfungen.
Grundprüfungen für jedes Beispiel: FEN gültig, Züge legal, jeder Pfeil im Bild beginnt auf einer
Figur und ist ein Angriff oder Zug dieser Figur, oder er setzt einen Pfeil fort (Linie dahinter).
Ausgenommen sind graue Hilfslinien und der Weg eines Bauern geradeaus nach vorn.
"""

import chess

FARBEN = {"gold", "rot", "grau", "gruen", "blau"}
# Graue Pfeile sind Hilfslinien (Rand des Quadrats im Buch): nur Farbe und Felder zählen.
HILFSLINIE = "grau"


def stellung(beispiel: dict, nach: int) -> chess.Board:
    """Die Stellung nach ``nach`` Zügen des Beispiels (Schach960, wenn die Prüfung es verlangt)."""
    neun60 = any(p["art"] == "start960" for p in beispiel["pruefung"])
    brett = chess.Board(beispiel["fen"], chess960=neun60)
    for zug in beispiel["zuege"][:nach]:
        brett.push_san(zug)
    return brett


def feld(name: str) -> int:
    return chess.parse_square(name)


def pfeil_befunde(brett: chess.Board, bild: dict) -> list[str]:
    """Jeder Pfeil: von einer Figur, als Angriff oder Zug; oder Fortsetzung eines Pfeils (Linie)."""
    befunde = []
    enden = {p["nach"] for p in bild["pfeile"]}
    for p in bild["pfeile"]:
        von, nach = feld(p["von"]), feld(p["nach"])
        if p["farbe"] not in FARBEN:
            befunde.append(f"Pfeil {p['von']}-{p['nach']}: Farbe {p['farbe']}")
        figur = brett.piece_at(von)
        if p["farbe"] == HILFSLINIE or ist_laufweg(figur, von, nach):
            continue
        if figur is None:
            if p["von"] not in enden and not linie(von, nach):
                befunde.append(f"Pfeil {p['von']}-{p['nach']}: kein Stein und keine Fortsetzung")
            continue
        zug = chess.Move(von, nach)
        if not (brett.attacks(von) & chess.BB_SQUARES[nach]) and zug not in brett.pseudo_legal_moves:
            # Langschrittige Figuren dürfen durch den angegriffenen Stein weiterzeigen (Spieß, Fesselung).
            if not (linie(von, nach) and figur.piece_type in (chess.BISHOP, chess.ROOK, chess.QUEEN)):
                befunde.append(f"Pfeil {p['von']}-{p['nach']}: weder Angriff noch Zug")
    return befunde


def ist_laufweg(figur: chess.Piece | None, von: int, nach: int) -> bool:
    """Ein Bauernpfeil geradeaus nach vorn ist sein Weg (Quadratregel, Freibauer), kein Zug."""
    if figur is None or figur.piece_type != chess.PAWN or chess.square_file(von) != chess.square_file(nach):
        return False
    vorn = 1 if figur.color == chess.WHITE else -1
    return (chess.square_rank(nach) - chess.square_rank(von)) * vorn > 0


def linie(a: int, b: int) -> bool:
    """Liegen zwei Felder auf einer Linie, Reihe oder Diagonale?"""
    return bool(chess.BB_RAYS[a][b])


def zwischen_frei(brett: chess.Board, a: int, b: int) -> bool:
    return not (chess.SquareSet(chess.between(a, b)) & chess.SquareSet(brett.occupied))


def pruefe_gabel(brett: chess.Board, p: dict) -> list[str]:
    figur = brett.piece_at(feld(p["feld"]))
    if figur is None:
        return [f"Gabel: kein Stein auf {p['feld']}"]
    befunde = []
    for ziel in p["ziele"]:
        opfer = brett.piece_at(feld(ziel))
        if opfer is None or opfer.color == figur.color:
            befunde.append(f"Gabel: auf {ziel} steht keine gegnerische Figur")
        elif not brett.is_attacked_by(figur.color, feld(ziel)) or feld(p["feld"]) not in brett.attackers(
            figur.color, feld(ziel)
        ):
            befunde.append(f"Gabel: {p['feld']} greift {ziel} nicht an")
    return befunde


def pruefe_spiess(brett: chess.Board, p: dict) -> list[str]:
    a, v, h = feld(p["feld"]), feld(p["vorne"]), feld(p["hinten"])
    figur, vorne, hinten = brett.piece_at(a), brett.piece_at(v), brett.piece_at(h)
    if not (figur and vorne and hinten) or vorne.color == figur.color or hinten.color == figur.color:
        return ["Spieß: Steine fehlen oder gehören der falschen Seite"]
    befunde = []
    if a not in brett.attackers(figur.color, v):
        befunde.append(f"Spieß: {p['feld']} greift {p['vorne']} nicht an")
    if v not in chess.SquareSet(chess.between(a, h)) or not zwischen_frei(brett, v, h):
        befunde.append(f"Spieß: {p['hinten']} steht nicht frei hinter {p['vorne']}")
    return befunde


def pruefe_fesselung(brett: chess.Board, p: dict) -> list[str]:
    f = feld(p["feld"])
    figur = brett.piece_at(f)
    if figur is None or not brett.is_pinned(figur.color, f):
        return [f"Fesselung: {p['feld']} ist nicht gefesselt"]
    if f not in chess.SquareSet(chess.between(feld(p["durch"]), feld(p["an"]))):
        return [f"Fesselung: {p['feld']} steht nicht zwischen {p['durch']} und {p['an']}"]
    return []


def pruefe_opposition(brett: chess.Board, _p: dict) -> list[str]:
    w, s = brett.king(chess.WHITE), brett.king(chess.BLACK)
    df = abs(chess.square_file(w) - chess.square_file(s))
    dr = abs(chess.square_rank(w) - chess.square_rank(s))
    return [] if sorted((df, dr)) == [0, 2] else ["Opposition: Könige nicht mit einem Feld dazwischen"]


def pruefe_quadrat(brett: chess.Board, p: dict) -> list[str]:
    """Regel des Quadrats (Kapitel 8): Der König holt den Bauern ein, wenn er (am Zug mitgezählt)
    höchstens so viele Züge bis zum Umwandlungsfeld braucht wie der Bauer."""
    b, k = feld(p["bauer"]), feld(p["koenig"])
    bauer = brett.piece_at(b)
    if not bauer or bauer.piece_type != chess.PAWN:
        return [f"Quadrat: kein Bauer auf {p['bauer']}"]
    ziel = chess.square(chess.square_file(b), 7 if bauer.color == chess.WHITE else 0)
    schritte = abs(chess.square_rank(ziel) - chess.square_rank(b))
    if chess.square_rank(b) in (1, 6) and abs(chess.square_rank(ziel) - chess.square_rank(b)) == 6:
        schritte -= 1  # Doppelschritt aus der Grundstellung
    koenig = chess.square_distance(k, ziel) - (0 if brett.turn == bauer.color else 1)
    faengt = koenig <= schritte
    return [] if faengt == p["faengt"] else [f"Quadrat: König fängt {'doch' if faengt else 'nicht'}"]


def pruefe_zaehlen(brett: chess.Board, p: dict) -> list[str]:
    f = feld(p["feld"])
    ziel = brett.piece_at(f)
    verteidiger_farbe = ziel.color if ziel else not brett.turn
    angreifer = len(brett.attackers(not verteidiger_farbe, f))
    verteidiger = len(brett.attackers(verteidiger_farbe, f))
    if (angreifer, verteidiger) != (p["angreifer"], p["verteidiger"]):
        return [f"Zählen: {angreifer} Angreifer, {verteidiger} Verteidiger auf {p['feld']}"]
    return []


def pruefe_springerfarbe(brett: chess.Board, p: dict, bild: dict) -> list[str]:
    von = feld(p["feld"])
    ziele = {feld(x["nach"]) for x in bild["pfeile"]} | {feld(x["feld"]) for x in bild["felder"]}
    alle = set(chess.SquareSet(chess.BB_KNIGHT_ATTACKS[von]))
    farbe = (chess.square_file(von) + chess.square_rank(von)) % 2
    befunde = [] if ziele == alle else ["Springer: Ziele sind nicht genau seine Züge"]
    if any((chess.square_file(z) + chess.square_rank(z)) % 2 == farbe for z in ziele):
        befunde.append("Springer: ein Ziel hat dieselbe Farbe")
    return befunde


def pruefe_turm_hinter_freibauer(brett: chess.Board, p: dict) -> list[str]:
    t, b = feld(p["turm"]), feld(p["bauer"])
    turm, bauer = brett.piece_at(t), brett.piece_at(b)
    if not (turm and bauer and turm.piece_type == chess.ROOK and bauer.piece_type == chess.PAWN):
        return ["Freibauer: Turm oder Bauer fehlt"]
    vorn = 1 if bauer.color == chess.WHITE else -1
    befunde = []
    if (
        chess.square_file(t) != chess.square_file(b)
        or (chess.square_rank(b) - chess.square_rank(t)) * vorn <= 0
    ):
        befunde.append("Freibauer: Turm steht nicht hinter dem Bauern")
    for linie_nr in range(max(0, chess.square_file(b) - 1), min(7, chess.square_file(b) + 1) + 1):
        for r in range(8):
            if (r - chess.square_rank(b)) * vorn > 0:
                stein = brett.piece_at(chess.square(linie_nr, r))
                if stein and stein.piece_type == chess.PAWN and stein.color != bauer.color:
                    befunde.append("Freibauer: Ein gegnerischer Bauer hält ihn auf")
    return befunde


def pruefe_start960(brett: chess.Board) -> list[str]:
    """Gültige Schach960-Grundstellung: Läufer auf verschiedenen Farben, König zwischen den Türmen."""
    return [] if brett.chess960_pos() is not None else ["Schach960: keine gültige Grundstellung"]


def pruefe_aus_grundstellung(beispiel: dict, p: dict) -> list[str]:
    brett = chess.Board()
    for zug in p["zuege"]:
        brett.push_san(zug)
    return [] if brett.fen() == beispiel["fen"] else ["Grundstellung: Züge ergeben eine andere Stellung"]


def pruefe_art(beispiel: dict, p: dict) -> list[str]:
    """Eine Prüfung (Feld ``pruefung``) an ihrem Bild."""
    bild = beispiel["bilder"][p.get("bild", 0)]
    brett = stellung(beispiel, bild["nach"])
    pruefer = {
        "gabel": lambda: pruefe_gabel(brett, p),
        "spiess": lambda: pruefe_spiess(brett, p),
        "fesselung": lambda: pruefe_fesselung(brett, p),
        "opposition": lambda: pruefe_opposition(brett, p),
        "quadrat": lambda: pruefe_quadrat(brett, p),
        "zaehlen": lambda: pruefe_zaehlen(brett, p),
        "springerfarbe": lambda: pruefe_springerfarbe(brett, p, bild),
        "turm_hinter_freibauer": lambda: pruefe_turm_hinter_freibauer(brett, p),
        "matt": lambda: [] if brett.is_checkmate() else ["Matt: Die Stellung ist kein Matt"],
        "start960": lambda: pruefe_start960(brett),
        "aus_grundstellung": lambda: pruefe_aus_grundstellung(beispiel, p),
        "legal": lambda: [],
    }
    if p["art"] not in pruefer:
        return [f"unbekannte Prüfart {p['art']}"]
    return pruefer[p["art"]]()


def pruefe_beispiel(beispiel: dict) -> list[str]:
    """Alle Befunde eines Beispiels, mit seiner Kennung davor; leer, wenn alles stimmt."""
    k = beispiel["kennung"]
    try:
        stellung(beispiel, len(beispiel["zuege"]))
    except ValueError as fehler:
        return [f"{k}: Stellung oder Zug ungültig ({fehler})"]
    befunde = []
    neun60 = any(p["art"] == "start960" for p in beispiel["pruefung"])
    brett = chess.Board(beispiel["fen"], chess960=neun60)
    if brett.status() != chess.STATUS_VALID:
        befunde.append(f"Stellung nicht legal ({brett.status()!r})")
    for i, bild in enumerate(beispiel["bilder"]):
        if not 0 <= bild["nach"] <= len(beispiel["zuege"]):
            befunde.append(f"Bild {i}: nach {bild['nach']} Zügen gibt es nicht")
            continue
        befunde += [f"Bild {i}: {b}" for b in pfeil_befunde(stellung(beispiel, bild["nach"]), bild)]
    for p in beispiel["pruefung"]:
        befunde += pruefe_art(beispiel, p)
    return [f"{k}: {b}" for b in befunde]

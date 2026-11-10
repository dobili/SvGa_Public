"""Bedingungen über Dialogvariablen und Besitz (``wenn`` an Übergängen, Schlüssel von ``zustaende``).

Warum: Runde 8, Technik der Zustände. Dieselbe Sprache wie ``app/src/abenteuer/regeln/bedingung.ts``
und ``pipeline/abenteuer/bedingung.cjs`` (Gesamtsimulation); Änderungen gehören in alle drei.

Sprache: eine Variable (``musikhausOffen``, ``hatLaterne``), ein Vergleich mit einer Zahl, einem
Text in Anführungszeichen oder wahr/falsch (``nadelMapleFalls >= 1``), verknüpft mit ``nicht``,
``und``, ``oder`` und Klammern; ``und`` bindet stärker als ``oder``. Eine fehlende Variable zählt in
Vergleichen als 0, leerer Text oder falsch.

Beispiel: ``erfuellt("nadelMapleFalls >= 1 und nicht hatLaterne", {"nadelMapleFalls": 2})`` → True;
``variablen("szene13Gesehen und nicht szene14Gesehen")`` → {"szene13Gesehen", "szene14Gesehen"}.
"""

import re

ZEICHEN = re.compile(r'\s*(\(|\)|==|!=|>=|<=|>|<|"[^"]*"|-?\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_]*)')
VERGLEICHE = ("==", "!=", ">=", "<=", ">", "<")
WORTWERTE = {"wahr": True, "true": True, "falsch": False, "false": False}
SCHLUESSELWOERTER = {"und", "oder", "nicht"}


class Bedingungsfehler(ValueError):
    """Eine Bedingung lässt sich nicht lesen (Fehler in den Spieldaten)."""


def zerlege(text: str) -> list[str]:
    """Die Zeichen einer Bedingung; wirft Bedingungsfehler bei Unlesbarem."""
    zeichen, i = [], 0
    while text[i:].strip():
        t = ZEICHEN.match(text, i)
        if not t:
            raise Bedingungsfehler(f"Bedingung „{text}“: unlesbar ab Stelle {i}")
        zeichen.append(t.group(1))
        i = t.end()
    return zeichen


def _wert(z: str, text: str):
    if z.startswith('"'):
        return z[1:-1]
    if re.match(r"-?\d", z):
        return float(z) if "." in z else int(z)
    if z in WORTWERTE:
        return WORTWERTE[z]
    raise Bedingungsfehler(f"Bedingung „{text}“: „{z}“ ist kein Wert")


def _vergleiche(links, op: str, rechts) -> bool:
    if links is None:
        links = False if isinstance(rechts, bool) else 0 if isinstance(rechts, (int, float)) else ""
    if op in ("==", "!="):
        return _gleich(links, rechts) == (op == "==")
    if not (_zahl(links) and _zahl(rechts)):
        return False
    return {">=": links >= rechts, "<=": links <= rechts, ">": links > rechts, "<": links < rechts}[op]


def _gleich(a, b) -> bool:
    """Gleich wie ``===`` in JavaScript: wahr/falsch nur mit wahr/falsch, Zahl nur mit Zahl."""
    if isinstance(a, bool) or isinstance(b, bool):
        return isinstance(a, bool) and isinstance(b, bool) and a == b
    if _zahl(a) or _zahl(b):
        return _zahl(a) and _zahl(b) and a == b
    return a == b


def _zahl(w) -> bool:
    return isinstance(w, (int, float)) and not isinstance(w, bool)


class _Leser:
    def __init__(self, text: str, variablen: dict):
        self.text, self.z, self.i, self.v = text, zerlege(text), 0, variablen
        self.namen: set[str] = set()

    def fehler(self, was: str):
        raise Bedingungsfehler(f"Bedingung „{self.text}“: {was}")

    def nimm(self):
        t = self.z[self.i] if self.i < len(self.z) else None
        self.i += 1
        return t

    def schau(self):
        return self.z[self.i] if self.i < len(self.z) else None

    def ganz(self) -> bool:
        w = self.oder()
        if self.i < len(self.z):
            self.fehler(f"unerwartet „{self.z[self.i]}“")
        return w

    def oder(self) -> bool:
        w = self.und()
        while self.schau() == "oder":
            self.i += 1
            w = self.und() or w
        return w

    def und(self) -> bool:
        w = self.nicht()
        while self.schau() == "und":
            self.i += 1
            w = self.nicht() and w
        return w

    def nicht(self) -> bool:
        if self.schau() != "nicht":
            return self.einfach()
        self.i += 1
        return not self.nicht()

    def einfach(self) -> bool:
        t = self.nimm()
        if t == "(":
            w = self.oder()
            if self.nimm() != ")":
                self.fehler("„)“ fehlt")
            return w
        if not t or not re.match(r"[A-Za-z_]", t) or t in WORTWERTE or t in SCHLUESSELWOERTER:
            self.fehler("Variable erwartet")
        self.namen.add(t)
        if self.schau() not in VERGLEICHE:
            return bool(self.v.get(t))
        op = self.nimm()
        rechts = self.nimm()
        if rechts is None:
            self.fehler("Wert fehlt")
        return _vergleiche(self.v.get(t), op, _wert(rechts, self.text))


def erfuellt(bedingung: str, variablen: dict) -> bool:
    """Ob die Bedingung für diese Variablen gilt; wirft Bedingungsfehler bei fehlerhafter Bedingung."""
    return _Leser(bedingung, variablen).ganz()


def variablen(bedingung: str) -> set[str]:
    """Die Variablen, nach denen eine Bedingung fragt (prüft dabei die Schreibweise)."""
    leser = _Leser(bedingung, {})
    leser.ganz()
    return leser.namen

"""Dauerprüfung der Codepflege in pipeline/abenteuer (CLAUDE.md Regel 4, Auftrag 20.11.2026).

Warum: Die Regel „Dateien unter 400 Zeilen, kein ``any``“ wurde nur von Hand geprüft; die
Gesamtsimulation war auf 421 Zeilen gewachsen. Geprüft werden Python, Node (``.cjs``, ``.mjs``)
und für Python ``typing.Any``. Die App-Seite prüft ``app/src/abenteuer/codepflege.test.ts``.
Ausnahmen stehen in ``AUSNAHMEN``, je mit Grund.
"""

import ast
from pathlib import Path

ORDNER = Path(__file__).resolve().parents[1] / "abenteuer"
HOECHSTENS_ZEILEN = 400
ENDUNGEN = (".py", ".cjs", ".mjs")
# Pfad relativ zu pipeline/abenteuer → Grund. Derzeit keine.
AUSNAHMEN: dict[str, str] = {}


def dateien() -> list[Path]:
    """Alle Python- und Node-Dateien unter pipeline/abenteuer (ohne Zwischenspeicher)."""
    return sorted(p for p in ORDNER.rglob("*") if p.suffix in ENDUNGEN and "__pycache__" not in p.parts)


def test_findet_dateien():
    assert len(dateien()) > 50


def test_keine_datei_ueber_400_zeilen():
    zu_lang = [
        f"{p.relative_to(ORDNER)}: {n} Zeilen"
        for p in dateien()
        if (n := len(p.read_text(encoding="utf-8").splitlines())) > HOECHSTENS_ZEILEN
        and str(p.relative_to(ORDNER)) not in AUSNAHMEN
    ]
    assert zu_lang == []


def test_kein_any_in_python():
    funde = []
    for p in dateien():
        if p.suffix != ".py":
            continue
        for knoten in ast.walk(ast.parse(p.read_text(encoding="utf-8"))):
            if (isinstance(knoten, ast.Name) and knoten.id == "Any") or (
                isinstance(knoten, ast.Attribute) and knoten.attr == "Any"
            ):
                funde.append(f"{p.relative_to(ORDNER)}:{knoten.lineno}")
    assert funde == []

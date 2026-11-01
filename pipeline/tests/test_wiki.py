"""Tests für das Wiki des Dashboards (Paket D)."""

from __future__ import annotations

from collections import Counter

from pipeline.wiki import abschnitte, baue_seiten, kennung, ohne_buchbefunde


def test_kennung() -> None:
    assert kennung("30.10.2026 – Orden (0.3.7)") == "30-10-2026-orden-0-3-7"
    assert kennung("Größe ändern") == "groesse-aendern"


def test_abschnitte_mit_einleitung() -> None:
    teile = abschnitte("Vorwort\n## Eins\nA\n## Zwei\nB")
    assert teile == [("Einleitung", "Vorwort"), ("Eins", "A"), ("Zwei", "B")]


def test_seiten_eindeutig_und_ohne_buchbefunde() -> None:
    seiten = baue_seiten()
    assert len(seiten) > 50
    assert not [p for p, n in Counter(s.pfad for s in seiten).items() if n > 1]
    assert not [s for s in seiten if "buchbefund" in s.titel.lower()]
    assert {s.bereich for s in seiten} == {"projekt", "code"}


def test_wichtige_seiten_da() -> None:
    pfade = {s.pfad for s in baue_seiten()}
    for pfad in ("projekt/arbeitsregeln", "projekt/architektur", "projekt/fortschritt", "code/begriffe"):
        assert pfad in pfade
    assert any(p.startswith("code/module-") for p in pfade)


def test_ohne_buchbefunde_unterabschnitt_und_punkt() -> None:
    text = "\n".join(
        [
            "- **Buchbefund B7:** Link fehlt",
            "  Folgezeile des Befunds",
            "- Bleibt",
            "#### B. Buchbefunde aus der Textarbeit",
            "- B6. Befund mit Zitat",
            "#### S. Spielbewertung",
            "- S20. Bleibt auch",
            "- **Befund an den Autor (S17):** Abb. 11.4",
            "Absatz bleibt",
        ]
    )
    assert ohne_buchbefunde(text) == "\n".join(
        ["- Bleibt", "#### S. Spielbewertung", "- S20. Bleibt auch", "Absatz bleibt"]
    )


def test_seiten_ohne_befundpunkte() -> None:
    for seite in baue_seiten():
        if seite.bereich != "projekt":
            continue
        for zeile in seite.inhalt.splitlines():
            assert not zeile.lstrip().startswith(("- **Buchbefund", "- **Befund an den Autor")), seite.pfad
            assert not (zeile.startswith("###") and "buchbefund" in zeile.lower()), seite.pfad

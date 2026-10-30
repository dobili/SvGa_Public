"""Tests der Wartungsprüfungen (R57) ohne Netz: Abrufe werden nachgebildet."""

from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path

from pipeline.wartung.links import bewerte, fremde_weiterleitung, pruefe_links, urls_in
from pipeline.wartung.live import ampel_nach_tagen, pruefe_seiten, pruefe_version
from pipeline.wartung.netz import Antwort
from pipeline.wartung.projekt import bewerte_audit, bewerte_laeufe, hauptversion, pruefe_aufgaben
from pipeline.wartung.punkte import Ampel, Pruefpunkt, markdown, schlimmste

JETZT = datetime(2026, 10, 24, 12, tzinfo=UTC)


def test_urls_in_ohne_satzzeichen_und_eigene_domain() -> None:
    text = 'Siehe https://lichess.org/learn. Und "https://schach-von-grund-auf.com/app/" sowie (https://syzygy-tables.info)'
    assert urls_in(text) == {"https://lichess.org/learn", "https://syzygy-tables.info"}


def test_urls_in_findet_nackte_github_adressen() -> None:
    text = "Quellcode: github.com/niklasf/chessops; über Lichess (github.com/lichess-org/lila, public/piece). https://github.com/x/y"
    assert urls_in(text) == {
        "https://github.com/niklasf/chessops",
        "https://github.com/lichess-org/lila",
        "https://github.com/x/y",
    }


def test_fremde_weiterleitung_nur_bei_anderer_domain() -> None:
    ziele = {
        "https://365chess.com": "https://www.365chess.com/",
        "https://chessgames.com": "https://www.chessgames.com:443/",
        "https://listudy.org": "/en",
        "https://verwaist.example.net": "https://sedo.com/search/?domain=verwaist.example.net",
    }

    def abruf(url: str, methode: str = "GET", **optionen: object) -> Antwort:
        assert optionen.get("weiterleiten") is False
        return Antwort(301, ziel=ziele[url]) if url in ziele else Antwort(200)

    assert fremde_weiterleitung("https://365chess.com", abruf) is None
    assert fremde_weiterleitung("https://chessgames.com", abruf) is None
    assert fremde_weiterleitung("https://listudy.org", abruf) is None
    assert fremde_weiterleitung("https://lichess.org", abruf) is None
    assert fremde_weiterleitung("https://verwaist.example.net", abruf) == (
        "https://sedo.com/search/?domain=verwaist.example.net"
    )


def test_pruefe_links_gelb_bei_umleitung_auf_andere_domain(tmp_path: Path) -> None:
    texte = tmp_path / "app/src/i18n"
    texte.mkdir(parents=True)
    (texte / "de.json").write_text('{"a": "Quelle: https://alt.example.net/x"}', encoding="utf-8")

    def abruf(url: str, methode: str = "GET", **optionen: object) -> Antwort:
        if optionen.get("weiterleiten") is False:
            return Antwort(302, ziel="https://parkplatz.example.net/")
        return Antwort(200)

    punkte = {p.id: p for p in pruefe_links(tmp_path, abruf)}
    assert punkte["links-app"].ampel == Ampel.GELB
    erwartet = "umgeleitet nach https://parkplatz.example.net/: https://alt.example.net/x"
    assert erwartet in punkte["links-app"].text


def test_bewerte_status() -> None:
    assert bewerte(Antwort(200)) == Ampel.GRUEN
    assert bewerte(Antwort(301)) == Ampel.GRUEN
    assert bewerte(Antwort(404)) == Ampel.ROT
    assert bewerte(Antwort(403)) == Ampel.GELB
    assert bewerte(Antwort(None, fehler="Zeitüberschreitung")) == Ampel.GELB


def test_pruefe_links_rot_bei_toter_seite(tmp_path: Path) -> None:
    daten = tmp_path / "app/public/daten/de"
    daten.mkdir(parents=True)
    (daten / "glossar.json").write_text(
        '["https://gut.example.net", "https://weg.example.net"]', encoding="utf-8"
    )

    def abruf(url: str, methode: str = "GET", **_: object) -> Antwort:
        return Antwort(404 if "weg" in url else 200)

    punkte = {p.id: p for p in pruefe_links(tmp_path, abruf)}
    assert punkte["links-buch"].ampel == Ampel.ROT
    assert "404: https://weg.example.net (app/public/daten/de/glossar.json)" in punkte["links-buch"].text
    assert punkte["links-website"].ampel == Ampel.GRUEN


def test_version_und_seiten() -> None:
    def abruf(url: str, methode: str = "GET", **optionen: object) -> Antwort:
        if "version.json" in url:
            return Antwort(200, text='{"version": "0.2.124"}')
        if url.endswith("/api/admin/uebersicht"):
            return Antwort(200)  # Fehler: Schnittstelle des Dashboards ohne Anmeldung offen
        if "/admin/" in url and optionen.get("weiterleiten") is False:
            return Antwort(302, ziel="https://team.cloudflareaccess.com/")
        return Antwort(200, kopf={"x-content-type-options": "nosniff"})

    assert pruefe_version("0.2.124", 0, abruf).ampel == Ampel.GRUEN
    assert pruefe_version("0.2.125", 0, abruf).ampel == Ampel.ROT
    punkte = {p.id: p for p in pruefe_seiten(abruf)}
    assert punkte["live-seiten"].ampel == Ampel.GRUEN
    assert punkte["live-kopfzeilen"].ampel == Ampel.GELB
    assert "x-frame-options" in punkte["live-kopfzeilen"].text
    assert punkte["live-dashboard"].ampel == Ampel.ROT  # /api/admin/uebersicht lieferte 200


def test_ablauf_grenzen() -> None:
    assert ampel_nach_tagen(5, (7, 14)) == Ampel.ROT
    assert ampel_nach_tagen(10, (7, 14)) == Ampel.GELB
    assert ampel_nach_tagen(30, (7, 14)) == Ampel.GRUEN


def test_ci_laeufe_und_wackelige() -> None:
    laeufe = [
        {"status": "in_progress", "conclusion": None, "run_number": 9},
        {
            "status": "completed",
            "conclusion": "failure",
            "run_number": 8,
            "run_attempt": 1,
            "created_at": "2026-10-23T10:00:00Z",
        },
        {
            "status": "completed",
            "conclusion": "success",
            "run_number": 7,
            "run_attempt": 2,
            "created_at": "2026-10-20T10:00:00Z",
        },
        {
            "status": "completed",
            "conclusion": "success",
            "run_number": 3,
            "run_attempt": 2,
            "created_at": "2026-09-01T10:00:00Z",
        },
    ]
    ampel, text, wackelig = bewerte_laeufe(laeufe, JETZT)
    assert ampel == Ampel.ROT
    assert "#8: failure" in text
    assert wackelig == ["#7 erst im 2. Versuch grün"]
    assert bewerte_laeufe([], JETZT)[0] == Ampel.GELB


def test_audit_und_hauptversionen() -> None:
    assert bewerte_audit({"metadata": {"vulnerabilities": {"high": 1}}})[0] == Ampel.ROT
    assert bewerte_audit({"metadata": {"vulnerabilities": {"moderate": 2}}})[0] == Ampel.GELB
    assert bewerte_audit({"metadata": {"vulnerabilities": {}}})[0] == Ampel.GRUEN
    assert hauptversion("^19.3.0") == 19
    assert hauptversion("0.15.1") == 0


def test_aufgaben_zaehlt_offene(tmp_path: Path) -> None:
    (tmp_path / "docs").mkdir()
    (tmp_path / "docs/AUFGABEN_AUTOR.md").write_text(
        "- [ ] N638. Test\n- [x] N637. erledigt\n- [ ] P1-A. Frage\n", encoding="utf-8"
    )
    assert pruefe_aufgaben(tmp_path).text == "1 Testpunkte, 1 weitere offene Punkte"


def test_markdown_und_schlimmste() -> None:
    punkte = [
        Pruefpunkt("a", "Links", "Buch", Ampel.GRUEN, ""),
        Pruefpunkt("b", "Live", "Version", Ampel.ROT, "live 1 | main 2"),
    ]
    text = markdown(punkte, "2026-10-24")
    assert text.index("Version") < text.index("Buch")
    assert "live 1 \\| main 2" in text
    assert schlimmste([Ampel.INFO, Ampel.GRUEN]) == Ampel.GRUEN
    assert schlimmste([Ampel.GELB, Ampel.ROT]) == Ampel.ROT

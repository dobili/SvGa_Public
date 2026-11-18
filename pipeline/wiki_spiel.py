"""Wiki des Spiels: die Seiten des Schach-Abenteuers für das Dashboard bauen.

Rolle im Gesamtbild: Wunsch des Autors (17.11.2026): ein eigenes Wiki für das Schach-Abenteuer
auf derselben Plattform wie das Wiki der Schach-App, mit Umschalter „Schach-App / Spiel“, aber
ohne die beiden ineinander zu weben (das Spiel soll später auch eigenständig erscheinen). Dieses
Modul baut die Seiten im Speicher aus `docs/spiel/` und dem Code; `pipeline/wiki.py` schickt sie
mit der Wiki-Kennung „spiel“ an denselben Worker.
Projekt-Teil: Überblick, Story-Bibel (nur Kern der Akte und Szenentitel), Welt, Regelwerk,
Kartenregeln, Kartenprüfung, Karteneditor, Lizenzen, Entscheidungen je Abschnitt, Fortschritt.
Code-Teil: Begriffe, Codeführer (`docs/spiel/codefuehrer/`), Module je Ordner von
`app/src/abenteuer/` und die Werkzeuge in `pipeline/abenteuer/`, beide aus den Dateiköpfen.
Nie im Wiki: `docs/spiel/roman/` und andere Romantexte, Buchtexte, Buchbefunde, Zugangsdaten.

Aufruf: über `python -m pipeline.wiki --zeigen` oder `--senden` (beide Wikis).
"""

from __future__ import annotations

import ast
import re
from pathlib import Path

from pipeline.wiki import (
    AUSGESCHLOSSEN,
    FORTSCHRITT_STAENDE,
    HAUPTORDNER,
    LAENGSTE_SEITE,
    Wikiseite,
    abschnitte,
    kennung,
    ohne_buchbefunde,
)

#: Kennung des Wikis im Worker (app/worker/wiki.ts, WIKIS).
WIKI = "spiel"
#: Szenenzeile der Story-Bibel: „**68. Die Familie** · `akt3.nachfahren` · …“.
SZENENZEILE = re.compile(r"^\*\*\d+[a-z]?\. ")
#: Stände des Fortschritts, die das Spiel betreffen.
SPIELSTAND = re.compile(r"abenteuer", re.IGNORECASE)

#: Ganze Dateien aus docs/spiel für den Projekt-Teil: (Pfad, Titel, Datei).
PROJEKTDATEIEN = (
    ("projekt/welt", "Welt", "09_Weltbeschreibung.md"),
    ("projekt/regelwerk", "Regelwerk", "06_Regelwerk.md"),
    ("projekt/kartenregeln", "Kartenregeln", "KARTENREGELN.md"),
    ("projekt/kartenpruefung", "Kartenprüfung", "KARTENPRUEFUNG.md"),
    ("projekt/karteneditor", "Karteneditor (Anleitung)", "KARTENEDITOR.md"),
    ("projekt/lizenzen", "Lizenzen des Spiels", "LIZENZEN.md"),
)

#: Gruppen der Pipeline-Werkzeuge: (Kennung, Titel, Muster auf den Dateinamen). Die erste passende
#: Gruppe gilt; was keine trifft, kommt zu „Kartenbau und Bilder“.
WERKZEUGGRUPPEN = (
    (
        "simulation",
        "Simulation und Lesefassung",
        re.compile(r"^(gesamtsimulation|lesefassung|bedingung\.cjs)"),
    ),
    ("editor", "Karteneditor", re.compile(r"^editor")),
    ("ton", "Ton und Musik", re.compile(r"^ton/")),
    (
        "pruefungen",
        "Prüfungen",
        re.compile(
            r"^(__init__|abkuerzung|ankunftsfeld|anordnung|ausrichtung|blickrichtung|durchgang|engstelle|"
            r"fahrzeuge|feinmasken_pruefung|figurensperre|gedeck|hoehen|inkbesuche|inkfluss|karten\.py|"
            r"kopfkachel|raumgroesse|sprache|stadtgroesse|tischlage|tuergroesse|tuermessung|uebergae|uebergang|"
            r"varianten|weltpuzzle|zusammenhang|belebung\.py|vorfuehrungen)"
        ),
    ),
)
SONSTIGE_GRUPPE = ("kartenbau", "Kartenbau und Bilder")


def _ohne_kommentarzeichen(zeilen: list[str]) -> str:
    """Kommentarzeilen ohne „/**“, „ * “, „*/“ und „// “; leere Zeilen bleiben als Absatzgrenze."""
    sauber = []
    for zeile in zeilen:
        zeile = re.sub(r"^\s*(/\*\*|\*/|\*|//)\s?", "", zeile.rstrip())
        sauber.append(zeile.removesuffix("*/").rstrip())
    return "\n".join(sauber).strip()


def dateikopf(datei: Path) -> str:
    """Der Kopfkommentar einer Code-Datei als Text (Python: Docstring; TS/JS: erster Kommentar).

    Beispiel: „/**\\n * Tönung einer Karte …\\n */“ → „Tönung einer Karte …“. Ohne Kopf: "".
    """
    text = datei.read_text(encoding="utf-8")
    if datei.suffix == ".py":
        try:
            return ast.get_docstring(ast.parse(text)) or ""
        except SyntaxError:
            return ""
    zeilen = text.splitlines()
    if zeilen and zeilen[0].startswith("/**"):
        ende = next((i for i, z in enumerate(zeilen) if "*/" in z), 0)
        return _ohne_kommentarzeichen(zeilen[: ende + 1])
    kopf = []
    for zeile in zeilen:
        if not zeile.startswith("//"):
            break
        kopf.append(zeile)
    return _ohne_kommentarzeichen(kopf)


def erster_absatz(text: str) -> str:
    """Erster Absatz eines Kopfes, zu einer Zeile zusammengezogen."""
    return " ".join(text.split("\n\n")[0].split())


def aufrufe(text: str) -> list[str]:
    """Absätze oder Zeilen, die mit „Aufruf“ beginnen (so schreiben die Werkzeuge ihren Aufruf)."""
    funde = []
    for absatz in text.split("\n\n"):
        zeilen = absatz.splitlines()
        for i, zeile in enumerate(zeilen):
            if zeile.lstrip().startswith("Aufruf"):
                funde.append("\n".join(zeilen[i:]).strip())
                break
    return funde


def story_bibel(wurzel: Path) -> Wikiseite:
    """Überblick der Story-Bibel: Teile, der Kern jedes Akts und nur die Titelzeilen der Szenen.

    Warum: Die Szenenbeschreibungen enthalten Handlungsdetails und Sätze, die dem Roman nahe sind;
    ins Wiki kommt nur, was zur Orientierung reicht (Wunsch: keine Romantexte über kurze Zitate).
    """
    datei = wurzel / "docs" / "spiel" / "05_Story_Bibel.md"
    teile: list[str] = []
    im_kern = in_szenen = False
    for zeile in datei.read_text(encoding="utf-8").splitlines():
        if zeile.startswith("# "):
            teile.append(f"\n## {zeile[2:].strip()}\n")
            im_kern = in_szenen = False
        elif zeile.startswith("## "):
            im_kern, in_szenen = "Der Kern" in zeile, "Szenenliste" in zeile
            if im_kern or in_szenen:
                teile.append(f"\n#{zeile}\n")
        elif zeile.startswith("### ") and in_szenen:
            teile.append(f"\n#{zeile}\n")
        elif im_kern:
            teile.append(zeile)
        elif in_szenen and SZENENZEILE.match(zeile):
            teile.append(f"- {zeile.strip()}")
    inhalt = re.sub(
        r"\n{3,}", "\n\n", "Kern der Akte und Szenentitel aus der Story-Bibel.\n" + "\n".join(teile)
    )
    return Wikiseite(
        "projekt/story-bibel",
        "projekt",
        "Story-Bibel (Überblick)",
        inhalt.strip(),
        "docs/spiel/05_Story_Bibel.md",
    )


def projektdatei(wurzel: Path, pfad: str, titel: str, name: str) -> Wikiseite:
    """Eine ganze Datei aus docs/spiel als Projektseite, ohne Buchbefunde."""
    datei = wurzel / "docs" / "spiel" / name
    inhalt = ohne_buchbefunde(datei.read_text(encoding="utf-8"))
    return Wikiseite(pfad, "projekt", titel, inhalt, f"docs/spiel/{name}")


def entscheidungen_spiel(wurzel: Path) -> list[Wikiseite]:
    """Je Abschnitt von docs/spiel/ENTSCHEIDUNGEN.md eine Seite, ohne Buchbefunde."""
    quelle = "docs/spiel/ENTSCHEIDUNGEN.md"
    seiten: list[Wikiseite] = []
    vergeben: set[str] = set()
    for titel, inhalt in abschnitte((wurzel / quelle).read_text(encoding="utf-8")):
        if AUSGESCHLOSSEN.search(titel):
            continue
        pfad, nummer = f"entscheidungen/{kennung(titel)}", 2
        while pfad in vergeben:
            pfad, nummer = f"entscheidungen/{kennung(titel)}-{nummer}", nummer + 1
        vergeben.add(pfad)
        seiten.append(Wikiseite(pfad, "projekt", titel, ohne_buchbefunde(inhalt), quelle))
    return seiten


def fortschritt_spiel(wurzel: Path) -> Wikiseite:
    """Die neuesten Stände aus docs/FORTSCHRITT.md, die das Schach-Abenteuer betreffen."""
    text = (wurzel / "docs" / "FORTSCHRITT.md").read_text(encoding="utf-8")
    staende = [a.strip() for a in text.split("\n\n") if a.startswith("Stand:") and SPIELSTAND.search(a)]
    return Wikiseite(
        "projekt/fortschritt",
        "projekt",
        "Fortschritt des Spiels (neueste Stände)",
        ohne_buchbefunde("\n\n".join(staende[:FORTSCHRITT_STAENDE])),
        "docs/FORTSCHRITT.md",
    )


def module(wurzel: Path) -> list[Wikiseite]:
    """Je Ordner von app/src/abenteuer eine Seite: jede Datei mit Zeilenzahl und erstem Absatz."""
    basis = wurzel / "app" / "src" / "abenteuer"
    seiten = []
    for ordner in sorted(p for p in basis.iterdir() if p.is_dir()):
        dateien = sorted(
            d for d in ordner.iterdir() if d.suffix in (".ts", ".tsx") and ".test." not in d.name
        )
        if not dateien:
            continue
        zeilen = []
        for datei in dateien:
            laenge = len(datei.read_text(encoding="utf-8").splitlines())
            zeilen.append(f"### {datei.name} ({laenge} Zeilen)\n\n{erster_absatz(dateikopf(datei))}")
        seiten.append(
            Wikiseite(
                f"code/module-{kennung(ordner.name)}",
                "code",
                f"Module: abenteuer/{ordner.name}",
                "\n\n".join(zeilen),
                f"app/src/abenteuer/{ordner.name}/",
            )
        )
    return seiten


def _gruppe(name: str) -> tuple[str, str]:
    for schluessel, titel, muster in WERKZEUGGRUPPEN:
        if muster.match(name):
            return schluessel, titel
    return SONSTIGE_GRUPPE


def werkzeuge(wurzel: Path) -> list[Wikiseite]:
    """Die Werkzeuge in pipeline/abenteuer nach Gruppen: Zweck (erster Absatz) und Aufruf."""
    basis = wurzel / "pipeline" / "abenteuer"
    dateien = sorted([*basis.glob("*.py"), *basis.glob("*.cjs"), *basis.glob("ton/*.py")])
    gruppen: dict[tuple[str, str], list[str]] = {}
    for datei in dateien:
        name = datei.relative_to(basis).as_posix()
        kopf = dateikopf(datei)
        eintrag = f"### {name}\n\n{erster_absatz(kopf)}"
        for aufruf in aufrufe(kopf):
            eintrag += f"\n\n{aufruf}"
        gruppen.setdefault(_gruppe(name), []).append(eintrag)
    return [
        Wikiseite(
            f"code/werkzeuge-{schluessel}",
            "code",
            f"Werkzeuge: {titel}",
            "\n\n".join(eintraege),
            "pipeline/abenteuer/",
        )
        for (schluessel, titel), eintraege in sorted(gruppen.items())
    ]


def codefuehrer(wurzel: Path) -> list[Wikiseite]:
    """Die Codeführer aus docs/spiel/codefuehrer/ (Dateiname mit Nummer für die Reihenfolge)."""
    seiten = []
    for datei in sorted((wurzel / "docs" / "spiel" / "codefuehrer").glob("*.md")):
        text = datei.read_text(encoding="utf-8")
        titel = next((z[2:].strip() for z in text.splitlines() if z.startswith("# ")), datei.stem)
        pfad = f"code/{kennung(re.sub(r'^[0-9]+-', '', datei.stem))}"
        seiten.append(Wikiseite(pfad, "code", titel, text, str(datei.relative_to(wurzel))))
    return seiten


def baue_spielseiten(wurzel: Path = HAUPTORDNER) -> list[Wikiseite]:
    """Alle Seiten des Spiel-Wikis, Projekt-Teil zuerst."""
    spiel = wurzel / "docs" / "spiel"
    seiten = [
        Wikiseite(
            "projekt/ueberblick",
            "projekt",
            "Überblick",
            (spiel / "UEBERBLICK.md").read_text(encoding="utf-8"),
            "docs/spiel/UEBERBLICK.md",
        ),
        story_bibel(wurzel),
        *(projektdatei(wurzel, pfad, titel, name) for pfad, titel, name in PROJEKTDATEIEN),
        fortschritt_spiel(wurzel),
        *entscheidungen_spiel(wurzel),
        Wikiseite(
            "code/begriffe",
            "code",
            "Begriffe des Spiels",
            (spiel / "BEGRIFFE.md").read_text(encoding="utf-8"),
            "docs/spiel/BEGRIFFE.md",
        ),
        *codefuehrer(wurzel),
        *module(wurzel),
        *werkzeuge(wurzel),
    ]
    return [s for s in seiten if len(s.inhalt) <= LAENGSTE_SEITE]

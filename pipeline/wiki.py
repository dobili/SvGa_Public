"""Wiki des Dashboards: Seiten aus den Projektunterlagen bauen und an den Worker schicken.

Rolle im Gesamtbild: Paket D der Ideensammlung (Wunsch des Autors, 26.10.2026): ein Wiki im
Dashboard mit einem Code-Teil (Konzeptkarte, Module, Begriffe, Suche) und einem Projekt-Teil
(Entscheidungen, Fortschritt, Architektur, Arbeitsregeln), aufbereitet und handytauglich, ohne
Buchtexte und ohne Buchbefunde. Gespeichert wird nur in D1 hinter Cloudflare Access, nie als Datei
im Repository und nie unter app/public: Dieser Lauf baut die Seiten im Speicher aus `docs/` und
`CLAUDE.md` und schickt sie an POST /api/wiki (Schlüssel BERICHT_SCHLUESSEL wie der Prüfbericht).
Er läuft im Lauf „Wartung“ nach jedem Push nach main.

Aufruf: python -m pipeline.wiki [--senden] [--zeigen]
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

HAUPTORDNER = Path(__file__).resolve().parents[1]
SEITE = "https://schach-von-grund-auf.com"
ERFOLG = 200
#: Abschnitte mit diesen Wörtern im Titel bleiben weg (Buchbefunde gehören nicht ins Wiki).
AUSGESCHLOSSEN = re.compile(r"buchbefund", re.IGNORECASE)
#: So viele Stände des Fortschritts kommen ins Wiki (die neuesten).
FORTSCHRITT_STAENDE = 40
#: Längster Seitentext in Zeichen (Grenze des Workers mit Luft).
LAENGSTE_SEITE = 400_000


@dataclass(frozen=True)
class Wikiseite:
    """Eine Seite: eindeutiger Pfad, Bereich („projekt“ oder „code“), Titel, Markdown, Quelle."""

    pfad: str
    bereich: str
    titel: str
    inhalt: str
    quelle: str


def kennung(text: str) -> str:
    """Pfadteil aus einem Titel. Beispiel: „30.10.2026 – Orden (0.3.7)“ → „30-10-2026-orden-0-3-7“."""
    ersetzt = text.lower().translate(str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"}))
    return re.sub(r"[^a-z0-9]+", "-", ersetzt).strip("-")[:80]


def abschnitte(text: str, ebene: str = "## ") -> list[tuple[str, str]]:
    """Teilt Markdown an Überschriften der Ebene; Text davor heißt „Einleitung“."""
    teile: list[tuple[str, str]] = []
    titel, zeilen = "Einleitung", []
    for zeile in text.splitlines():
        if zeile.startswith(ebene):
            if any(z.strip() for z in zeilen):
                teile.append((titel, "\n".join(zeilen).strip()))
            titel, zeilen = zeile[len(ebene) :].strip(), []
        else:
            zeilen.append(zeile)
    if any(z.strip() for z in zeilen):
        teile.append((titel, "\n".join(zeilen).strip()))
    return teile


def ganze_datei(pfad: str, bereich: str, titel: str, datei: Path) -> Wikiseite:
    return Wikiseite(
        pfad, bereich, titel, datei.read_text(encoding="utf-8"), str(datei.relative_to(HAUPTORDNER))
    )


def entscheidungen(wurzel: Path) -> list[Wikiseite]:
    """Je Abschnitt von ENTSCHEIDUNGEN.md eine Seite, ohne Buchbefunde."""
    datei = wurzel / "docs" / "ENTSCHEIDUNGEN.md"
    seiten: list[Wikiseite] = []
    vergeben: set[str] = set()
    for titel, inhalt in abschnitte(datei.read_text(encoding="utf-8")):
        if AUSGESCHLOSSEN.search(titel):
            continue
        pfad, nummer = f"entscheidungen/{kennung(titel)}", 2
        while pfad in vergeben:  # gleiche Überschrift zweimal: Nummer anhängen
            pfad, nummer = f"entscheidungen/{kennung(titel)}-{nummer}", nummer + 1
        vergeben.add(pfad)
        seiten.append(Wikiseite(pfad, "projekt", titel, inhalt, "docs/ENTSCHEIDUNGEN.md"))
    return seiten


def fortschritt(wurzel: Path) -> Wikiseite:
    """Die neuesten Stände aus FORTSCHRITT.md (je Absatz „Stand: …“)."""
    text = (wurzel / "docs" / "FORTSCHRITT.md").read_text(encoding="utf-8")
    staende = [a.strip() for a in text.split("\n\n") if a.startswith("Stand:")][:FORTSCHRITT_STAENDE]
    return Wikiseite(
        "projekt/fortschritt",
        "projekt",
        "Fortschritt (neueste Stände)",
        "\n\n".join(staende),
        "docs/FORTSCHRITT.md",
    )


def konzeptkarte(wurzel: Path) -> list[Wikiseite]:
    """Je Ordner der App eine Seite mit den Modulen: Zweck, Rolle, öffentliche Teile."""
    roh = (wurzel / "docs" / "konzeptkarte-daten.js").read_text(encoding="utf-8")
    module = json.loads(roh[roh.index("[") : roh.rindex("]") + 1])
    je_ordner: dict[str, list[dict]] = {}
    for modul in module:
        je_ordner.setdefault(modul["ordner"], []).append(modul)
    seiten = []
    for ordner, liste in sorted(je_ordner.items()):
        zeilen = []
        for m in sorted(liste, key=lambda x: x["pfad"]):
            zeilen.append(f"### {m['pfad']} ({m['zeilen']} Zeilen)\n\n{m['zweck']}")
            if m.get("rolle"):
                zeilen.append(m["rolle"])
            exporte = [f"- `{e['name']}` ({e['art']}): {e['satz']}" for e in m.get("exporte", [])]
            if exporte:
                zeilen.append("\n".join(exporte))
        seiten.append(
            Wikiseite(
                f"code/module-{kennung(ordner)}",
                "code",
                f"Module: {ordner}",
                "\n\n".join(zeilen),
                "docs/konzeptkarte-daten.js",
            )
        )
    return seiten


def baue_seiten(wurzel: Path = HAUPTORDNER) -> list[Wikiseite]:
    """Alle Seiten des Wikis, Projekt-Teil zuerst."""
    docs = wurzel / "docs"
    seiten = [
        ganze_datei("projekt/arbeitsregeln", "projekt", "Arbeitsregeln (CLAUDE.md)", wurzel / "CLAUDE.md"),
        ganze_datei("projekt/architektur", "projekt", "Architektur", docs / "ARCHITEKTUR.md"),
        fortschritt(wurzel),
        ganze_datei("projekt/lizenzen", "projekt", "Lizenzen", docs / "LIZENZEN.md"),
        *entscheidungen(wurzel),
        ganze_datei("code/begriffe", "code", "Begriffe im Code", docs / "BEGRIFFE.md"),
    ]
    for datei in sorted((docs / "codefuehrer").glob("*.md")):
        titel = next(
            (z[2:].strip() for z in datei.read_text(encoding="utf-8").splitlines() if z.startswith("# ")),
            datei.stem,
        )
        seiten.append(ganze_datei(f"code/{kennung(datei.stem)}", "code", titel, datei))
    seiten += konzeptkarte(wurzel)
    return [s for s in seiten if len(s.inhalt) <= LAENGSTE_SEITE]


def sende(seiten: list[Wikiseite]) -> bool:
    """Schickt alle Seiten an POST /api/wiki; ohne Schlüssel nichts (gilt als erfolgreich)."""
    from pipeline.wartung.netz import abrufen

    schluessel = os.environ.get("BERICHT_SCHLUESSEL")
    if not schluessel:
        print("BERICHT_SCHLUESSEL fehlt: Wiki nicht hochgeladen.")
        return True
    daten = {"stand": os.environ.get("GITHUB_SHA"), "seiten": [asdict(s) for s in seiten]}
    antwort = abrufen(
        f"{SEITE}/api/wiki",
        "POST",
        kopf={"Authorization": f"Bearer {schluessel}", "Content-Type": "application/json"},
        daten=json.dumps(daten, ensure_ascii=False).encode("utf-8"),
    )
    if antwort.status != ERFOLG:
        print(f"Wiki nicht hochgeladen: {antwort.status or antwort.fehler}", file=sys.stderr)
        return False
    print(f"Wiki hochgeladen: {len(seiten)} Seiten.")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Wiki des Dashboards (Paket D)")
    parser.add_argument("--senden", action="store_true", help="an das Dashboard schicken")
    parser.add_argument("--zeigen", action="store_true", help="Titel und Größen ausgeben")
    argumente = parser.parse_args()
    seiten = baue_seiten()
    if argumente.zeigen:
        for s in seiten:
            print(f"{s.bereich:8} {len(s.inhalt):7} {s.pfad}  {s.titel}")
    print(f"{len(seiten)} Seiten, {sum(len(s.inhalt) for s in seiten)} Zeichen.")
    return 0 if not argumente.senden or sende(seiten) else 1


if __name__ == "__main__":
    sys.exit(main())

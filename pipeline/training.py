"""Trainingskästen des Buches als Inhalte der Website (Entscheidung des Autors, 15./16.10.2026).

Aufruf (im Hauptordner des Repositorys):

    python -m pipeline.training --buch buch/a1     # schreibt inhalte/de/training/*.json

Rolle im Gesamtbild:
    Die 13 Kästen „Training zu diesem Kapitel“ (Kapitel 0 bis 12) und der Abschnitt „Dein
    Werkzeugkasten“ (Kapitel 12) verweisen auf Webangebote, die sich ändern. Der Autor verlagert
    sie auf die Website (``schach-von-grund-auf.com/training/kapNN/``); im Buch bleiben ein kurzer
    Hinweis, Link und QR-Code. Diese Datei liest die Kästen einmalig aus dem LaTeX und schreibt je
    Kapitel eine Datei nach ``inhalte/de/training/``. Danach sind diese Dateien die Quelle: Die
    Website (``app/vite.config.ts`` mit ``app/src/startseite/trainingsrahmen.ts``) baut daraus
    statische Seiten, und Änderungen geschehen dort, ohne neuen Druck. Solange die Kästen noch im
    Buch stehen, lässt sich der Lauf wiederholen. Steht im Buch schon der kurze Verweis
    (``\\trainingsverweis``), bricht der Lauf ab,
    damit er die gepflegten Dateien nicht überschreibt.

Umwandlung: Text, Züge und Abbildungsverweise wie bei den Bildunterschriften
(``lesen/text.py``); dazu Links für Adressen (``\\texttt{lichess.org}``, Lichess-Pfade wie
``/training/coordinate``), für Quellen (``\\cite``) und für die Tabelle „Werkzeugkasten“, die
auf der Website eine eigene Seite hat. Unbekannte Befehle brechen den Lauf ab (nie raten).
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
from pathlib import Path

from jsonschema import Draft202012Validator

from pipeline.befunde import Befund
from pipeline.lesen.diagramme import _kapitelkopf
from pipeline.lesen.quellen import Quelldatei, lies_quellen
from pipeline.lesen.text import Textteil, wandle_text
from pipeline.lesen.verzeichnis import Verweisverzeichnis, baue_verzeichnis
from pipeline.training_bloecke import bloecke_aus

HAUPTORDNER = Path(__file__).resolve().parent.parent
ZIELORDNER = HAUPTORDNER / "inhalte" / "de" / "training"
SCHEMA = HAUPTORDNER / "schemas" / "training.schema.json"
SCHEMAORDNER = HAUPTORDNER / "schemas"

# Feste Adressen der Website (ändern sich nie, sie stehen gedruckt im Buch).
ADRESSE_KAPITEL = "/training/kap{:02d}/"
ADRESSE_WERKZEUGKASTEN = "/training/werkzeugkasten/"
LICHESS = "https://lichess.org"

_KASTEN = re.compile(r"\\begin\{trainingskasten\}(.*?)\\end\{trainingskasten\}", re.S)
_WERKZEUGKASTEN = re.compile(r"\\section\{Dein Werkzeugkasten\}(.*?)\\section\{", re.S)
_SEITE = re.compile(r"auf\s+Seite~\\pageref\{[^}]+\}")
_URL = re.compile(r"\\url\{([^}]+)\}")
# Marken für Links, die lesen/text.py nicht kennt; sie trennen den Text in Stücke.
_MARKE = re.compile(
    r"(?P<tabelle>Tabelle~\\ref\{tab:werkzeugkasten\})"
    r"|(?P<cite>~?\\cite\{(?P<schluessel>[^}]+)\})"
    r"|\\texttt\{(?P<adresse>[^}]+)\}"
)


class Trainingsfehler(Exception):
    """Der LaTeX-Text enthält etwas, das die Umwandlung nicht kennt; nichts wird geschrieben."""


_VERWEIS = "\\trainingsverweis"


def pruefe_alte_kaesten(quellen: list[Quelldatei]) -> None:
    """Bricht ab, wenn das Buch statt der Kästen schon auf die Website verweist.

    Warum: Nach der Umstellung des Buches sind ``inhalte/de/training/*.json`` die einzige Quelle
    und werden dort gepflegt; ein neuer Lauf würde sie mit leeren oder alten Daten überschreiben.
    Beispiel: ``\\trainingsverweis{07}{…}{…}`` in kap07_taktik.tex → Trainingsfehler.
    """
    for quelle in quellen:
        if _VERWEIS in quelle.text:
            raise Trainingsfehler(
                f"{quelle.name}: Das Buch verweist schon auf die Website ({_VERWEIS}). Die Dateien in "
                "inhalte/de/training/ sind jetzt die Quelle; nichts geschrieben."
            )


def adresse_als_link(adresse: str) -> str | None:
    """Ziel eines Links zu einer Adresse aus ``\\texttt``.

    Beispiel: ``lichess.org`` → ``https://lichess.org``, ``/training/coordinate`` →
    ``https://lichess.org/training/coordinate`` (im Buch stehen Lichess-Pfade ohne Domain).
    Sonderfall: Text ohne Punkt und ohne Schrägstrich ist keine Adresse (None).
    """
    adresse = adresse.strip()
    if adresse.startswith("/"):
        return LICHESS + adresse
    if "." in adresse and " " not in adresse:
        return "https://" + adresse
    return None


def quellenadressen(quellen: list[Quelldatei]) -> dict[str, str]:
    """Adressen der Literatur (``\\bibitem{schluessel} … \\url{…}``) aus den Anhängen."""
    adressen: dict[str, str] = {}
    for quelle in quellen:
        for teil in re.split(r"\\bibitem", quelle.text)[1:]:
            schluessel = re.match(r"(?:\[[^\]]*\])?\{([^}]+)\}", teil)
            url = _URL.search(teil)
            if schluessel and url:
                adressen[schluessel.group(1)] = url.group(1)
    return adressen


def _ohne_rand(teile: list[Textteil], vorne: bool, hinten: bool) -> list[Textteil]:
    """Setzt das Leerzeichen wieder, das wandle_text an Stückgrenzen entfernt."""
    if vorne:
        teile.insert(0, Textteil("text", " "))
    if hinten:
        teile.append(Textteil("text", " "))
    return teile


def wandle(
    latex: str, fundstelle: str, verzeichnis: Verweisverzeichnis, adressen: dict[str, str]
) -> list[dict[str, str]]:
    """Wandelt einen Absatz in Teile wie bei den Bildunterschriften, mit Links.

    Eingabe: LaTeX eines Absatzes, Fundstelle, Verweisverzeichnis, Adressen der Literatur.
    Ausgabe: Teile als Daten (``{"art": "link", "text": …, "ziel": …}`` zusätzlich zu den Arten
    aus ``lesen/text.py``). Beispiel aus Kapitel 0: „… stellt die deutsche Fassung der
    FIDE-Regeln bereit~\\cite{dsb-regeln}“ → Text und Link „schachbund.de“.
    Sonderfall: unbekannte Befehle → Trainingsfehler mit allen Befunden.
    """
    # Seitenzahlen gibt es auf der Website nicht: „auf Seite~\\pageref{merkseite}“ → „im Buch“.
    latex = _SEITE.sub("im Buch", latex)
    teile: list[Textteil] = []
    befunde: list[Befund] = []
    stand = 0
    for treffer in [*_MARKE.finditer(latex), None]:
        ende = treffer.start() if treffer else len(latex)
        stueck = latex[stand:ende]
        if stueck.strip():
            umwandlung = wandle_text(stueck, fundstelle, verzeichnis)
            befunde += umwandlung.befunde
            teile += _ohne_rand(umwandlung.teile, stueck[:1].isspace() and bool(teile), stueck[-1:].isspace())
        elif stueck and teile:
            teile.append(Textteil("text", " "))
        if treffer:
            link = _link(treffer, adressen, fundstelle)
            if isinstance(link, dict) and link.pop("klammer", None):
                teile += [Textteil("text", " ("), link, Textteil("text", ")")]
            else:
                teile.append(link)
            stand = treffer.end()
    if befunde:
        raise Trainingsfehler("; ".join(f"{b.fundstelle}: {b.text}" for b in befunde))
    return _zusammen([t.als_daten() if isinstance(t, Textteil) else t for t in teile])


def _link(treffer: re.Match[str], adressen: dict[str, str], fundstelle: str) -> Textteil | dict[str, str]:
    """Ein Link zu einer Marke aus _MARKE (Werkzeugkasten, Quelle oder Adresse)."""
    if treffer.group("tabelle"):
        return {"art": "link", "text": "die Tabelle „Werkzeugkasten“", "ziel": ADRESSE_WERKZEUGKASTEN}
    if treffer.group("cite"):
        url = adressen.get(treffer.group("schluessel"))
        if url is None:
            raise Trainingsfehler(f"{fundstelle}: Quelle {treffer.group('schluessel')} ohne Adresse")
        anzeige = re.sub(r"^https?://(www\.)?", "", url).rstrip("/")
        return {"art": "link", "text": anzeige, "ziel": url, "klammer": "ja"}
    adresse = treffer.group("adresse")
    ziel = adresse_als_link(adresse)
    return {"art": "link", "text": adresse, "ziel": ziel} if ziel else Textteil("text", adresse)


def _zusammen(teile: list[dict[str, str]]) -> list[dict[str, str]]:
    """Fasst benachbarte Textteile gleichen Stils zusammen und doppelte Leerzeichen."""
    ergebnis: list[dict[str, str]] = []
    for teil in teile:
        vorher = ergebnis[-1] if ergebnis else None
        if (
            vorher is not None
            and teil["art"] == "text"
            and vorher["art"] == "text"
            and vorher.get("stil", "normal") == teil.get("stil", "normal")
        ):
            vorher["text"] = re.sub(r"  +", " ", vorher["text"] + teil["text"])
        else:
            ergebnis.append(dict(teil))
    # Leerraum am Rand des Blocks entfernen; zwischen zwei Teilen bleibt er (Wortgrenze).
    while ergebnis and ergebnis[0]["art"] == "text" and not ergebnis[0]["text"].strip():
        ergebnis.pop(0)
    while ergebnis and ergebnis[-1]["art"] == "text" and not ergebnis[-1]["text"].strip():
        ergebnis.pop()
    return [t for t in ergebnis if t["text"]]


def kapiteltitel(quelle: Quelldatei) -> str:
    """Titel wie in den App-Daten: aus ``\\kapitelauftakt{N}{Titel}``, in Kapitel 0 aus ``\\chapter*``."""
    befunde: list[Befund] = []
    _, titel = _kapitelkopf(quelle.text, quelle.name, befunde)
    if befunde or not titel:
        raise Trainingsfehler(f"{quelle.name}: kein Kapiteltitel")
    return titel


def kasten(
    quelle: Quelldatei, verzeichnis: Verweisverzeichnis, adressen: dict[str, str], datum: str
) -> dict[str, object] | None:
    """Der Trainingskasten eines Kapitels als Daten, oder None ohne Kasten (Anhänge)."""
    treffer = _KASTEN.search(quelle.text)
    if not treffer or quelle.kapitel is None:
        return None
    zeile = quelle.text.count("\n", 0, treffer.start()) + 1
    fundstelle = f"{quelle.name}:{zeile}"
    return {
        "kapitel": quelle.kapitel,
        "titel": kapiteltitel(quelle),
        "adresse": ADRESSE_KAPITEL.format(quelle.kapitel),
        "bloecke": bloecke_aus(
            treffer.group(1), lambda text: wandle(text, fundstelle, verzeichnis, adressen)
        ),
        "quelle": {"datei": quelle.name, "zeile": zeile},
        "stand": datum,
    }


def werkzeugkasten(
    quellen: list[Quelldatei], verzeichnis: Verweisverzeichnis, adressen: dict[str, str], datum: str
) -> dict[str, object]:
    """Der Abschnitt „Dein Werkzeugkasten“ aus Kapitel 12 als Daten (Tabelle, Liste, Absätze)."""
    for quelle in quellen:
        treffer = _WERKZEUGKASTEN.search(quelle.text)
        if treffer:
            zeile = quelle.text.count("\n", 0, treffer.start()) + 1
            fundstelle = f"{quelle.name}:{zeile}"
            # Auf der eigenen Seite verweist die Tabelle nicht auf sich selbst.
            inhalt = treffer.group(1).replace("Tabelle~\\ref{tab:werkzeugkasten}", "die Tabelle unten")
            return {
                "titel": "Dein Werkzeugkasten",
                "adresse": ADRESSE_WERKZEUGKASTEN,
                "bloecke": bloecke_aus(
                    inhalt, lambda text, f=fundstelle: wandle(text, f, verzeichnis, adressen)
                ),
                "quelle": {"datei": quelle.name, "zeile": zeile},
                "stand": datum,
            }
    raise Trainingsfehler("Abschnitt „Dein Werkzeugkasten“ nicht gefunden")


def pruefe(daten: object) -> list[str]:
    """Prüft eine Datei gegen ``schemas/training.schema.json`` (leer = gültig)."""
    from pipeline.bauen.__main__ import _schemaregister  # gleiche Schemaauflösung wie der Datenlauf

    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    pruefer = Draft202012Validator(schema, registry=_schemaregister())
    return [f"{'/'.join(map(str, f.absolute_path))}: {f.message}" for f in pruefer.iter_errors(daten)]


def main(argumente: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Trainingskästen des Buches für die Website")
    parser.add_argument("--buch", type=Path, required=True, help="Ordner mit main.tex und chapters/")
    parser.add_argument("--ziel", type=Path, default=ZIELORDNER)
    parser.add_argument("--datum", default=dt.date.today().isoformat())
    einstellungen = parser.parse_args(argumente)
    quellen = lies_quellen(einstellungen.buch)
    pruefe_alte_kaesten(quellen)
    verzeichnis = baue_verzeichnis(quellen)
    adressen = quellenadressen(quellen)
    dateien = {
        f"kap{q.kapitel:02d}.json": kasten(q, verzeichnis, adressen, einstellungen.datum)
        for q in quellen
        if q.kapitel is not None
    }
    dateien["werkzeugkasten.json"] = werkzeugkasten(quellen, verzeichnis, adressen, einstellungen.datum)
    einstellungen.ziel.mkdir(parents=True, exist_ok=True)
    for name, daten in dateien.items():
        if daten is None:
            continue
        fehler = pruefe(daten)
        if fehler:
            raise Trainingsfehler(f"{name}: " + "; ".join(fehler))
        (einstellungen.ziel / name).write_text(
            json.dumps(daten, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    print(f"{sum(d is not None for d in dateien.values())} Dateien nach {einstellungen.ziel} geschrieben.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

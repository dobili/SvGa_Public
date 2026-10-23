"""Die Übersetzungstabellen in ``inhalte/en/a1/``: je Datendatei eine Tabelle Kennung → Englisch.

Wozu diese Datei da ist:
    Das Repository ist öffentlich, die Buchtexte sind geschützt (CLAUDE.md, „Öffentlich“). Die
    Tabellen enthalten deshalb keinen deutschen Text, nur die englische Vorlage, geschlüsselt mit
    einer Kennung aus der deutschen Vorlage (die ersten zwölf Stellen ihres SHA-1). Ändert der
    Autor einen Satz im Buch, ändert sich die Kennung: Die alte Übersetzung passt nicht mehr, der
    Satz erscheint als offen (und bis zur neuen Übersetzung deutsch). Zum Lesen nebeneinander
    schreibt ``__main__.py`` eine Prüfhilfe nach ``buch/arbeit/uebersetzung/`` (nur lokal).

    Format: {"schemaVersion": 1, "datei": "kap01.json", "texte": {"3f2a…": "After {z1} …"}}.

Rolle im Gesamtbild: Teil der Übersetzungsschicht ``pipeline/uebersetzen``.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

TABELLENVERSION = 1
KENNUNG_STELLEN = 12


class TabellenFehler(ValueError):
    """Eine Übersetzungstabelle hat nicht das erwartete Format."""


def kennung(vorlage: str) -> str:
    """Kennung einer deutschen Vorlage: die ersten zwölf Stellen ihres SHA-1.

    Beispiel: kennung("Weiß am Zug.") liefert immer dieselben zwölf Zeichen; ein geändertes
    Satzzeichen ergibt eine andere Kennung.
    """
    return hashlib.sha1(vorlage.encode("utf-8")).hexdigest()[:KENNUNG_STELLEN]


def lies_tabelle(pfad: Path) -> dict[str, str]:
    """Liest eine Tabelle; fehlt die Datei, ist sie leer.

    Sonderfall: falsches Format (Version, Datei, Werte keine Texte) → TabellenFehler, nie raten.
    """
    if not pfad.exists():
        return {}
    daten = json.loads(pfad.read_text(encoding="utf-8"))
    if daten.get("schemaVersion") != TABELLENVERSION or daten.get("datei") != pfad.name:
        raise TabellenFehler(f"{pfad}: schemaVersion {TABELLENVERSION} und datei „{pfad.name}“ erwartet")
    texte = daten.get("texte")
    if not isinstance(texte, dict) or not all(
        isinstance(k, str) and isinstance(v, str) for k, v in texte.items()
    ):
        raise TabellenFehler(f"{pfad}: „texte“ muss Kennung → Text sein")
    return texte


def schreibe_tabelle(pfad: Path, texte: dict[str, str], reihenfolge: list[str]) -> None:
    """Schreibt eine Tabelle in Lesereihenfolge der Daten; Kennungen ohne Stelle kommen ans Ende.

    Warum die Reihenfolge: Änderungen im Versionsverlauf stehen dort, wo der Satz im Buch steht.
    """
    geordnet = {k: texte[k] for k in dict.fromkeys(reihenfolge) if k in texte}
    geordnet.update({k: v for k, v in texte.items() if k not in geordnet})
    inhalt = {"schemaVersion": TABELLENVERSION, "datei": pfad.name, "texte": geordnet}
    pfad.parent.mkdir(parents=True, exist_ok=True)
    pfad.write_text(json.dumps(inhalt, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

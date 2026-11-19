"""Jeder Sprecher eines Dialogs hat einen Namen (pipeline/tests).

Warum: Das Dialogfenster zeigt über einer Zeile `figur.<sprecher>.name` aus texte/de.json. Fehlt der
Eintrag, steht der Schlüssel selbst im Spiel. Fund im Spieler-Durchlauf (19.11.2026): Der letzte
Satz des Epilogs stand unter „figur.held.name“.
"""

import json
import re
from pathlib import Path

DATEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
SPRECHER = re.compile(r"#sprecher:(\w+)")


def test_jeder_sprecher_hat_einen_namen():
    """Alle Sprecher außer dem Erzähler stehen als figur.<sprecher>.name in texte/de.json."""
    texte = json.loads((DATEN / "texte" / "de.json").read_text(encoding="utf-8"))
    fehlend = []
    for pfad in sorted((DATEN / "dialoge" / "de").glob("*.ink")):
        for nummer, zeile in enumerate(pfad.read_text(encoding="utf-8").splitlines(), 1):
            for sprecher in SPRECHER.findall(zeile.split("//", 1)[0]):
                if sprecher != "erzaehler" and f"figur.{sprecher}.name" not in texte:
                    fehlend.append(f"{pfad.name}:{nummer} {sprecher}")
    assert fehlend == [], "Sprecher ohne Namen in texte/de.json:\n" + "\n".join(fehlend)

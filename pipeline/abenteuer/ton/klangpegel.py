"""Befehl: misst leise Dauergeräusche und schreibt ihre Verstärkung nach ``spiel/klang/pegel.json``.

Warum: Einige Dauergeräusche sind bewusst leise aufgenommen (Uhr, Kerze, stiller Wald: −28 bis
−37 dBFS mittlere Lautheit statt −24 wie die übrigen). Neben der Musik gehen sie unter. Statt die
Dateien neu zu kodieren, steht in einer kleinen Tabelle, um wie viel Dezibel der Tonspieler sie
anhebt (``app/src/abenteuer/ton/tonangaben.ts``); der Paketbau übernimmt sie als
``klang/pegel.json`` (``app/skripte/baue-abenteuerpaket.mjs``, ``kopiereTon``).

Gemessen wird die mittlere Lautheit mit ffmpeg (Filter ``volumedetect``). Ziel −24 dBFS, aber
höchstens +8 dB: Mehr hebt das Rauschen der Aufnahme zu stark an. Spitzen fängt der Tonspieler
weich ab (tanh wie ``musikbau.angleichen``).

Aufruf (im Hauptordner; braucht ffmpeg):
    python -m pipeline.abenteuer.ton.klangpegel PRIVAT [--namen uhr_ticken kerze …]
"""

import argparse
import json
import re
import subprocess
from pathlib import Path

# Die bewusst leisen Dauergeräusche (Messung 14.11.2026).
LEISE = (
    "uhr_ticken",
    "holzknacken",
    "archiv",
    "kerze",
    "wald_still",
    "feder",
    "dachboden",
    "regen_blech",
    "reifen_erde",
)
ZIEL_DB = -24.0
HOECHSTENS_DB = 8.0
# Kleinere Unterschiede hört man nicht; sie kommen nicht in die Tabelle.
UNHOERBAR_DB = 0.5
PEGELTABELLE = "pegel.json"
MITTEL = re.compile(r"mean_volume:\s*(-?[\d.]+) dB")


def ausgleich(mittel_db: float) -> float:
    """Anhebung in dB bis zum Ziel, höchstens ``HOECHSTENS_DB``, nie Absenkung.

    Beispiele: −34,0 → 8,0 (gedeckelt); −27,7 → 3,7; −23,5 → 0,0.
    """
    return round(min(HOECHSTENS_DB, max(0.0, ZIEL_DB - mittel_db)), 1)


def mittel_aus(ausgabe: str) -> float:
    """Die mittlere Lautheit aus der Ausgabe von ``volumedetect``; ohne Angabe ein Fehler."""
    treffer = MITTEL.search(ausgabe)
    if not treffer:
        raise ValueError("volumedetect lieferte keine mittlere Lautheit")
    return float(treffer.group(1))


def finde(klang: Path, name: str) -> Path:
    """Die Datei eines Geräuschs in ``klang/`` oder ``klang/aktN``; fehlt sie, ein Fehler."""
    for datei in [klang / f"{name}.m4a", *sorted(klang.glob(f"akt*/{name}.m4a"))]:
        if datei.exists():
            return datei
    raise FileNotFoundError(f"Geräusch fehlt: {name}")


def miss(datei: Path) -> float:
    """Mittlere Lautheit einer Tondatei in dBFS (ffmpeg ``volumedetect``)."""
    befehl = ["ffmpeg", "-nostats", "-i", str(datei), "-af", "volumedetect", "-f", "null", "-"]
    lauf = subprocess.run(befehl, capture_output=True, text=True, check=True)
    return mittel_aus(lauf.stderr)


def pegeltabelle(klang: Path, namen: list[str]) -> dict[str, float]:
    """Anhebung je Geräusch, nur hörbare Werte. Beispiel: ``{"kerze": 8.0, "regen_blech": 3.7}``."""
    tabelle: dict[str, float] = {}
    for name in sorted(namen):
        mittel = miss(finde(klang, name))
        db = ausgleich(mittel)
        print(f"{name}: {mittel:.1f} dBFS, +{db:.1f} dB")
        if db >= UNHOERBAR_DB:
            tabelle[name] = db
    return tabelle


def main() -> None:
    """Liest die Argumente, misst und schreibt die Tabelle."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("privat", type=Path, help="privates Repository (schach-abenteuer-inhalte)")
    parser.add_argument("--namen", nargs="*", default=list(LEISE), help="Geräusche ohne Endung")
    argumente = parser.parse_args()
    klang = argumente.privat / "spiel" / "klang"
    ziel = klang / PEGELTABELLE
    tabelle = pegeltabelle(klang, argumente.namen)
    ziel.write_text(json.dumps(tabelle, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(ziel)


if __name__ == "__main__":
    main()

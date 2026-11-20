"""Prüft die Bilder des Abenteuers: jedes ``#bild:…`` der Ink-Dialoge und jeder Bildpfad der
Daten gegen die Bilder im privaten Paket (``schach-abenteuer-inhalte/spiel/bilder``).

Warum: Bilder kommen von Gemini in Lieferungen, die Dialoge verlangen sie schon vorher. Ohne
Abgleich blieb unbemerkt, welche Bilder noch fehlen (die Zeile erscheint dann ohne Großansicht),
welche geliefert, aber nirgends benutzt sind, und welche die falsche Größe haben (Auftrag
20.11.2026, „Bilder für den Morgen“).

Gemeldet wird:
- fehlend: benutzt (Ink oder Daten), aber nicht im Paket; mit Fundstelle. Ein Fund ohne Feld
  ``bild`` in funde.json zählt mit seinem Namen nach der Regel ``fund-<kennung>``;
- ungenutzt: im Paket, aber nirgends benutzt;
- Größe und Format: Szenen 1024 × 768 (Raster 256 × 192, vierfach), Fundbilder (``fund-…``)
  512 × 512, verlustfreies WebP. Ein hochgeladenes PNG oder JPG mit dem richtigen Namen ist kein
  Fehler: Der Paketbau wandelt es um (``app/skripte/grossbilder.mjs``); es wird als „wird beim
  Bau umgewandelt“ gemeldet.

Pfad zur Kennung wie in der App (``app/src/abenteuer/dialog/grossbild.ts``):
``#bild:sternenHimmel`` → ``sternen-himmel``, ``#bild:blaues_heft`` → ``blaues-heft``.
Der Bericht nennt nur Namen und Maße, keine Bildinhalte (das Repository ist öffentlich).

Aufruf: ``python -m pipeline.abenteuer.bildpruefung --privat PFAD [--bericht DATEI]``.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image

HAUPT = Path(__file__).resolve().parents[2]
DIALOGE = HAUPT / "inhalte" / "abenteuer" / "dialoge"
# Nur das Abenteuer: app/public/bilder (Startbild der App) gehört nicht zum Spielpaket.
DATENORDNER = (HAUPT / "inhalte" / "abenteuer", HAUPT / "app" / "src" / "abenteuer")
BILD_TAG = re.compile(r"#\s*bild:\s*([A-Za-z0-9_]+)")
BILD_PFAD = re.compile(r"bilder/([a-z0-9-]+)\.(?:webp|png)")
AUS = "aus"
SZENE = (1024, 768)
FUND = (512, 512)
HOCHGELADEN = (".png", ".jpg", ".jpeg")


def dateiname(kennung: str) -> str:
    """Dateiname ohne Endung wie in grossbild.ts. Beispiel: ``sternenHimmel`` → ``sternen-himmel``."""
    return re.sub(r"[A-Z]", lambda m: "-" + m.group(0).lower(), kennung).replace("_", "-")


def sollmass(name: str) -> tuple[int, int]:
    """Erwartete Größe: Fundbilder quadratisch, alles andere eine Szene im Format 4:3."""
    return FUND if name.startswith("fund-") else SZENE


@dataclass
class Bildlage:
    """Ergebnis der Prüfung, je Name sortierbar."""

    benutzt: dict[str, list[str]] = field(default_factory=dict)
    vorhanden: dict[str, Path] = field(default_factory=dict)

    @property
    def fehlend(self) -> list[str]:
        return sorted(n for n in self.benutzt if n not in self.vorhanden)

    @property
    def ungenutzt(self) -> list[str]:
        return sorted(n for n in self.vorhanden if n not in self.benutzt)


def kurzpfad(datei: Path) -> str:
    """Pfad relativ zum Repository, sonst der Name (Tests mit eigenen Ordnern)."""
    return str(datei.relative_to(HAUPT)) if datei.is_relative_to(HAUPT) else datei.name


def merke(lage: Bildlage, name: str, fundstelle: str) -> None:
    lage.benutzt.setdefault(name, [])
    if fundstelle not in lage.benutzt[name]:
        lage.benutzt[name].append(fundstelle)


def sammle_benutzte(lage: Bildlage, dialoge: Path, datenordner: tuple[Path, ...]) -> None:
    """``#bild:`` aus allen Ink-Dateien (alle Sprachen) und Bildpfade aus Daten und Code."""
    for ink in sorted(dialoge.rglob("*.ink")):
        for nummer, zeile in enumerate(ink.read_text(encoding="utf-8").splitlines(), 1):
            for kennung in BILD_TAG.findall(zeile):
                if kennung != AUS:
                    merke(lage, dateiname(kennung), f"{ink.relative_to(dialoge)}:{nummer}")
    for ordner in datenordner:
        for datei in sorted([*ordner.rglob("*.json"), *ordner.rglob("*.ts"), *ordner.rglob("*.tsx")]):
            if ".test." in datei.name:
                continue
            for zeile in datei.read_text(encoding="utf-8").splitlines():
                # Beispiele in Kommentaren („bilder/sternen-himmel.webp“) sind keine Benutzung.
                if zeile.lstrip().startswith(("*", "//", "/*")):
                    continue
                for name in BILD_PFAD.findall(zeile):
                    merke(lage, name, kurzpfad(datei))


def sammle_funde(lage: Bildlage, datenordner: tuple[Path, ...]) -> None:
    """Funde ohne Feld ``bild``: Ihr Bild heißt nach der Regel ``fund-<kennung>`` (wie
    ``bildDesFundes`` in der App) und gilt als benutzt, solange es fehlt als offen."""
    for ordner in datenordner:
        datei = ordner / "funde.json"
        if not datei.is_file():
            continue
        for fund in json.loads(datei.read_text(encoding="utf-8")).get("funde", []):
            if not fund.get("bild"):
                merke(lage, "fund-" + dateiname(fund["kennung"]), f"funde.json: {fund['kennung']}")


def sammle_vorhandene(lage: Bildlage, bilder: Path) -> None:
    """Bilder im privaten Ordner; ein WebP geht einem hochgeladenen PNG oder JPG vor."""
    if not bilder.is_dir():
        return
    for datei in sorted(bilder.iterdir()):
        endung = datei.suffix.lower()
        if endung == ".webp" or (endung in HOCHGELADEN and datei.stem not in lage.vorhanden):
            lage.vorhanden[datei.stem] = datei


def befund(datei: Path) -> str | None:
    """Was an Größe oder Format nicht stimmt, sonst None."""
    soll = sollmass(datei.stem)
    if datei.suffix.lower() in HOCHGELADEN:
        return "wird beim Bau umgewandelt"
    with Image.open(datei) as bild:
        mass = bild.size
    if mass != soll:
        return f"{mass[0]} × {mass[1]} statt {soll[0]} × {soll[1]}"
    return None


def bericht(lage: Bildlage) -> str:
    """Markdown mit fehlenden, ungenutzten und falsch geformten Bildern (nur Namen und Maße)."""
    zeilen = ["# Bilder des Abenteuers: Abgleich", ""]
    zeilen.append(
        f"Benutzt {len(lage.benutzt)}, im privaten Paket {len(lage.vorhanden)}, "
        f"fehlend {len(lage.fehlend)}, ungenutzt {len(lage.ungenutzt)}."
    )
    zeilen += ["", "## Fehlend (bei Gemini offen)", ""]
    zeilen += [f"- `{n}` ({', '.join(lage.benutzt[n][:3])})" for n in lage.fehlend] or ["keine"]
    zeilen += ["", "## Im Paket, aber nirgends benutzt", ""]
    zeilen += [f"- `{n}`" for n in lage.ungenutzt] or ["keine"]
    zeilen += ["", "## Größe und Format", ""]
    falsch = [(n, befund(p)) for n, p in sorted(lage.vorhanden.items())]
    zeilen += [f"- `{n}`: {b}" for n, b in falsch if b] or ["alle in Ordnung"]
    return "\n".join(zeilen) + "\n"


def pruefe(privat: Path, dialoge: Path = DIALOGE, datenordner: tuple[Path, ...] = DATENORDNER) -> Bildlage:
    """Die ganze Prüfung. ``privat`` ist das private Repository (oder sein Ordner ``spiel``)."""
    bilder = privat / "spiel" / "bilder" if (privat / "spiel").is_dir() else privat / "bilder"
    lage = Bildlage()
    sammle_benutzte(lage, dialoge, datenordner)
    sammle_funde(lage, datenordner)
    sammle_vorhandene(lage, bilder)
    return lage


def main() -> None:
    teile = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    teile.add_argument("--privat", type=Path, required=True, help="Pfad zu schach-abenteuer-inhalte")
    teile.add_argument("--bericht", type=Path, help="Markdown-Bericht hierhin schreiben")
    args = teile.parse_args()
    text = bericht(pruefe(args.privat))
    if args.bericht:
        args.bericht.write_text(text, encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()

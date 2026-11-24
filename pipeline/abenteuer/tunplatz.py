"""Befehl: Steht ein Statist so da, wie sein ``tun`` es sagt? (Kartenblick M11, 24.11.2026)

Warum: Der Autor las „sitzt auf der Bank und füttert Tauben“ und sah jemanden neben der Bank
stehen. 65 Statisten haben „sitzt“ im ``tun``, aber keine Eigenschaft ``sitzt``; die App und die
Vorschau zeichnen sie stehend. ``verhalten: sitzen`` hilft nicht: Das Verhalten gilt nur für Tiere
(oberwelt/belebung.ts), ein Statist sitzt allein über ``sitzt`` (Blickrichtung) oder ``zustand``.

Befunde, je Szene (jede Fassung für sich):
- ``sitzt_fehlt``: ``tun`` sagt „sitzt“ oder „sitzen“, die Eigenschaft ``sitzt`` (oder ein
  Sitz-``zustand``) fehlt. Dazu steht, welches Möbel unter dem Feld liegt: ein Sitzmöbel (dann
  reicht die Blickrichtung), ein anderes Möbel oder keins (dann gehört der Statist auf ein Feld mit
  Sitzmöbel oder bekommt ``zustand: sitzboden``).
- ``laeuft``: ``tun`` sagt „sitzt“, aber ``von`` und ``bis`` sind verschieden (er liefe hin und her).
- ``verhalten``: ein Statist trägt ``verhalten: sitzen`` ohne ``sitzt``; das Verhalten ist wirkungslos.

Die Liste ist die Arbeitsvorlage für Welle 2 (Regionspakete AP5 bis AP8), keine Null-Prüfung: Der
Dauertest hält nur fest, dass die Zahl nicht wächst (``OFFEN_HOECHSTENS``). Wer Stellen behebt, senkt
die Zahl; am Ende von Welle 2 steht sie auf 0, Ausnahmen mit Grund in ``GEPRUEFT``.

Ablauf (im Hauptordner): python -m pipeline.abenteuer.tunplatz [--muster MUSTER] [--bericht DATEI]
"""

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer import statistenwahl
from pipeline.abenteuer.kartenbau import INHALTE
from pipeline.abenteuer.verdeckung import SITZARTEN, art_von, katalog, moebel_unter

SZENEN = INHALTE / "szenen"
# „sitzt“ und „sitzen“ als ganzes Wort („besitzt“ zählt nicht).
SITZWORT = re.compile(r"\bsitz(t|en)\b")
# Stand 24.11.2026: 65 Statisten mit „sitzt“ ohne Eigenschaft, einer davon läuft, 17 mit wirkungslosem
# Verhalten. Welle 2 senkt die Zahl; sie darf nicht wachsen.
OFFEN_HOECHSTENS = 83
# (Szene, Statist) → Grund, warum die Stelle so stimmt.
GEPRUEFT: dict[tuple[str, str], str] = {}

Feld = tuple[int, int]


@dataclass(frozen=True)
class Befund:
    """Ein Statist, der anders dasteht, als sein ``tun`` sagt."""

    szene: str
    name: str
    feld: Feld
    art: str
    tun: str
    moebel: str

    def text(self) -> str:
        """Eine Zeile für die Liste."""
        return f"{self.szene}: {self.name} {self.feld} [{self.art}] „{self.tun}“ – {self.moebel}"


def moebel_am_platz(szene: str, feld: Feld, moebel: dict[str, dict]) -> str:
    """Was unter dem Feld steht, als Hinweis für die Behebung.

    Beispiel: Rentner im Park auf (12, 9) → „Sitzmöbel mf2Parkbank (bank)“; daneben → „kein Möbel“.
    """
    unter = moebel_unter(szene, feld, moebel)
    if unter is None:
        return "kein Möbel unter dem Feld"
    art = art_von(unter[0], unter[1])
    return f"Sitzmöbel {unter[0]} ({art})" if art in SITZARTEN else f"Möbel {unter[0]} ({art}), kein Sitz"


def arten(eigenschaften: dict) -> list[str]:
    """Befundarten eines Statisten nach seinen Eigenschaften (siehe Dateikopf).

    Beispiel: ``{"tun": "sitzt am Tresen"}`` → ["sitzt_fehlt"]; mit ``"sitzt": "oben"`` → [].
    """
    if statistenwahl.sitzt(eigenschaften):
        return []
    gefunden = []
    sagt_sitzen = bool(SITZWORT.search(eigenschaften.get("tun", "").lower()))
    if sagt_sitzen:
        gefunden.append("sitzt_fehlt")
    if sagt_sitzen and eigenschaften.get("von") != eigenschaften.get("bis"):
        gefunden.append("laeuft")
    if eigenschaften.get("verhalten") == "sitzen":
        gefunden.append("verhalten")
    return gefunden


def befunde_der_szene(name: str, szene: dict, moebel: dict[str, dict]) -> list[Befund]:
    """Alle Befunde einer Szene (ohne die Stellen in GEPRUEFT)."""
    ergebnis = []
    for b in szene.get("belebung", []):
        if b.get("typ") != "statist" or (name, b["name"]) in GEPRUEFT:
            continue
        eigenschaften = b.get("eigenschaften", {})
        feld = (b["feld"][0], b["feld"][1])
        for art in arten(eigenschaften):
            platz = moebel_am_platz(name, feld, moebel)
            ergebnis.append(Befund(name, b["name"], feld, art, eigenschaften.get("tun", ""), platz))
    return ergebnis


def alle_befunde(muster: str = "*") -> list[Befund]:
    """Befunde aller Szenen, deren Dateiname zum Muster passt. Beispiel: ``alle_befunde("riverton-*")``."""
    moebel = katalog()
    ergebnis = []
    for pfad in sorted(SZENEN.glob(f"{muster}.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        ergebnis += befunde_der_szene(pfad.stem, szene, moebel)
    return ergebnis


def bericht(befunde: list[Befund]) -> str:
    """Markdown-Liste, nach Szene geordnet, mit der Zahl je Befundart."""
    je_art: dict[str, int] = {}
    for b in befunde:
        je_art[b.art] = je_art.get(b.art, 0) + 1
    kopf = ", ".join(f"{art}: {zahl}" for art, zahl in sorted(je_art.items()))
    zeilen = [f"# Stellung der Statisten gegen ihr tun ({len(befunde)} offen; {kopf})", ""]
    zeilen += [f"- {b.text()}" for b in befunde]
    return "\n".join(zeilen) + "\n"


def main() -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf. Rückgabe 1, wenn die Zahl gewachsen ist."""
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--muster", default="*", help="Dateimuster der Szenen, etwa riverton-*")
    parser.add_argument("--bericht", type=Path, help="Liste als Markdown in diese Datei (nur lokal)")
    argumente = parser.parse_args()
    befunde = alle_befunde(argumente.muster)
    for b in befunde:
        print(b.text())
    if argumente.bericht:
        argumente.bericht.write_text(bericht(befunde), encoding="utf-8")
    print(f"{len(befunde)} offene Befunde (höchstens {OFFEN_HOECHSTENS})")
    return 1 if argumente.muster == "*" and len(befunde) > OFFEN_HOECHSTENS else 0


if __name__ == "__main__":
    raise SystemExit(main())

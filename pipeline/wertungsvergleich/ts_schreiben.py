"""Schreibt die gemessenen Bereiche als TypeScript-Datei für die App.

Rolle im Gesamtbild: ``auswerten.py`` misst je Zeitklasse und Liste eine Tabelle
[Lichess, von, Mitte, bis, Zahl der Spieler]; diese Datei macht daraus
``app/src/spiel/plattformvergleich-daten.ts`` (erzeugt, nicht von Hand ändern). Nur Kennzahlen,
keine Profile: Das Repository ist öffentlich.
"""

from __future__ import annotations

import datetime
import json
from pathlib import Path

KOPF = """/**
 * Gemessene Bereiche der eigenen Wertung (Lichess-Maßstab) auf FIDE und chess.com, je Zeitklasse.
 * Erzeugt von pipeline/wertungsvergleich/auswerten.py am {datum}, nicht von Hand ändern.
 *
 * Herkunft: {profile} öffentliche Lichess-Profile mit FIDE-Angabe oder chess.com-Link aus den
 * Mitgliederlisten großer Lichess-Teams. FIDE: abgeglichen mit der offiziellen FIDE-Liste
 * (Klarname und Zahl), offizielle Standard-Wertung, nur aktive Spieler. chess.com: verlinkte
 * Konten mit ihrer aktuellen Wertung (Klassisch → chess.com Schnellschach).
 * Je Zeile [Lichess, von, Mitte, bis, Spieler]: Median und Viertel (25 %, 75 %) der Zielwertung bei
 * Spielern mit Lichess-Zahl ±100, die Ränder um eine Standardabweichung der Messung (Bootstrap)
 * nach außen geschoben. FIDE erst ab dem Band, an dem die Mitte um mindestens die Hälfte jedes
 * Lichess-Zuwachses steigt (darunter stehen fast alle FIDE-Spieler am Boden der FIDE-Wertung).
 * Paare: {paare}.
 * Abhängigkeiten: spiel/elomodell-daten.ts (Zeitklasse).
 */
import type {{ Wertungstempo }} from "./elomodell-daten";

/** Eine Zeile: [Lichess, von, Mitte, bis, Zahl der Spieler im Fenster]. */
export type Vergleichsband = readonly [number, number, number, number, number];

/** Je Liste und Zeitklasse die Bänder, aufsteigend; leer, wo zu wenige Paare sind. */
export const GEMESSEN: Readonly<
  Record<"fide" | "chesscom", Readonly<Record<Wertungstempo, readonly Vergleichsband[]>>>
> = {{
{inhalt}}};
"""


def schreiben(ergebnis: dict, ziel: Path) -> None:
    """Schreibt die Tabellen aus ``ergebnis`` (siehe auswerten.py) nach ``ziel``."""
    teile = []
    for liste in ("fide", "chesscom"):
        teile.append(f"  {liste}: {{\n")
        for tempo in ("blitz", "rapid", "classical"):
            zeilen = "".join(f"      {json.dumps(z).replace(',', ', ')},\n" for z in ergebnis[liste][tempo])
            teile.append(f"    {tempo}: [\n{zeilen}    ],\n" if zeilen else f"    {tempo}: [],\n")
        teile.append("  },\n")
    paare = ";\n *   ".join(
        f"{liste} {', '.join(f'{t} {n}' for t, n in werte.items())}"
        for liste, werte in ergebnis["paare"].items()
    )
    text = KOPF.format(
        datum=datetime.date.today().strftime("%d.%m.%Y"),
        profile=ergebnis["profile"],
        paare=paare,
        inhalt="".join(teile),
    )
    ziel.write_text(text, encoding="utf-8")

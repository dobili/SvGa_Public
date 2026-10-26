/**
 * Rechnung der Werkzeuge in der Partie gegen die Engine; die Knöpfe, die Leiste und die Karten
 * stehen in PartieWerkzeuge.tsx, die Wahl verwaltet useWerkzeugwahl.ts wie an den Abbildungen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors P1 und Vorschlag B2 (16.10.2026): zuerst Zählen, Röntgen
 * und W1–W7 als Symbole am Brett, dann die Bündel. Eigene Datei, weil React-Komponenten und
 * Hilfsfunktionen getrennt liegen sollen (schnelles Neuladen beim Entwickeln).
 * Abhängigkeiten: werkzeugergebnis.ts, werkzeugordnung.ts, useEngineMarkierungen.ts,
 * useEroeffnungsindex.ts.
 */
import type { Markierung, Werkzeugergebnis } from "../../../analyse/werkzeug";
import type { Eroeffnungsindex } from "../../../schach/eroeffnungsindex";
import type { Farbe, Stellung } from "../../../schach/stellung";
import type { Verlauf } from "../../../schach/todsuenden";
import {
  useEngineMarkierungen,
  type Enginemarkierungen,
} from "../werkzeugkarten/useEngineMarkierungen";
import { useEroeffnungsindex } from "../bausteine/useEroeffnungsindex";
import { werkzeugergebnis } from "../werkzeugwahl/werkzeugergebnis";
import type { Werkzeugwahl } from "../werkzeugwahl/Werkzeugleiste";
import type { Buendelkennung } from "../werkzeugwahl/werkzeugordnung";

/** In der Partie gilt das ganze Buch: alle Werkzeuge bis Kapitel 12, keines als Vorschau. */
export const PARTIEKAPITEL = 12;

/**
 * Die Bündel in der Partie, wie der Autor sie wünscht (P1), in der Reihenfolge ihrer Einführung
 * im Buch (wie an den Abbildungen seit 0.2.31). Fallencheck und Angriffsregel fehlen: Die
 * Angriffsregel steckt in der Planfindung, der Fallencheck braucht den geplanten Zug des Buches.
 */
export const PARTIEBUENDEL: readonly Buendelkennung[] = [
  "eroeffnung",
  "skelett",
  "planfindung",
  "taktik",
  "endspiel",
  "denkroutine",
];

/**
 * Ergebnis des gewählten Werkzeugs für die gezeigte Stellung der Partie.
 *
 * Eingaben: Wahl, gezähltes Feld, Stellung, bisheriger Verlauf der Partie, Farbe des Lesers,
 * Eröffnungsindex (für „Eröffnung“, sobald geladen).
 * Ausgabe: das Ergebnis wie an den Abbildungen, oder null (nichts gewählt, Zählen ohne Feld).
 * Beispiel: Partie aus Abb. 1.26, Röntgen → die drei Fragen der Schach-Röntgen-Regel für den
 * Leser. Sonderfall: ohne Buchdaten (Fallencheck, Bilanz, Übung), wie bei eigenen Zügen an einer
 * Abbildung.
 */
export function partieErgebnis(
  wahl: Werkzeugwahl | null,
  zaehlfeld: string | null,
  stellung: Stellung,
  verlauf: Verlauf,
  sicht: Farbe,
  eroeffnungen: Eroeffnungsindex | undefined,
): Werkzeugergebnis | null {
  return werkzeugergebnis(wahl, zaehlfeld, stellung, {
    sicht,
    naechsterZug: null,
    verlauf,
    eroeffnungen,
    fallencheck: undefined,
    bilanz: undefined,
    fortsetzung: [],
    uebung: undefined,
    abschnitt: undefined,
  });
}

/** Was die Partie für Brett und Karten braucht. */
export interface Partierechnung {
  readonly ergebnis: Werkzeugergebnis | null;
  /** Markierungen des Werkzeugs samt Engine (Plan des Gegners, Ruhe); leer ohne Werkzeug. */
  readonly markierungen: readonly Markierung[];
  readonly gegnerplan: Enginemarkierungen;
  readonly erzwingend: Enginemarkierungen;
  readonly ruhe: Enginemarkierungen;
}

/**
 * Rechnet das gewählte Werkzeug für die gezeigte Stellung, mit Eröffnungsindex und den
 * Engine-Markierungen von „Gegner?“, „Erzwingende Züge“ und „Ruhe“ (wie an den Abbildungen).
 *
 * Eingaben: Wahl, gezähltes Feld, Stellung (null, wenn nicht lesbar), Verlauf, Farbe des Lesers.
 * Beispiel: Planfindung › Gegner? → Ergebnis der Planfragen, dazu der rote Pfeil der Engine.
 */
export function usePartierechnung(
  wahl: Werkzeugwahl | null,
  zaehlfeld: string | null,
  stellung: Stellung | null,
  verlauf: Verlauf,
  sicht: Farbe,
): Partierechnung {
  const eroeffnungen = useEroeffnungsindex(PARTIEKAPITEL);
  const gegnerplan = useEngineMarkierungen(stellung, wahl === "k6-gegner");
  const erzwingend = useEngineMarkierungen(stellung, wahl === "k7-erzwingend");
  const ruhe = useEngineMarkierungen(stellung, wahl === "k7-ruhe");
  const ergebnis = stellung
    ? partieErgebnis(wahl, zaehlfeld, stellung, verlauf, sicht, eroeffnungen)
    : null;
  // Hat die Engine die Kandidaten eingestuft, ersetzen ihre Markierungen die des Werkzeugs.
  const eigene = erzwingend.markierungen.length > 0 ? erzwingend.markierungen : null;
  const markierungen = ergebnis
    ? [...(eigene ?? ergebnis.markierungen), ...gegnerplan.markierungen, ...ruhe.markierungen]
    : [];
  return { ergebnis, markierungen, gegnerplan, erzwingend, ruhe };
}

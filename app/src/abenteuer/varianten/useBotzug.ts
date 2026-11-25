/**
 * Gemeinsame Bausteine der Brettansichten der Sonderformen: Ergebnis aus Sicht des Helden,
 * Umgebung der Partie (Engine, Stil, Farbe, Ende) und der Bot-Zug mit kurzer Pause.
 *
 * Warum: Nebel, Ente und Tandem lassen den Bot gleich ziehen: Wenn er dran ist, rechnet er, wartet
 * einen Augenblick (sonst springt die Figur, bevor man den eigenen Zug gesehen hat) und meldet die
 * neue Partie. Wird die Ansicht vorher geschlossen, verfällt der Zug.
 * Abhängigkeiten: React, botwahl.ts.
 */
import { useEffect } from "react";
import type { Color } from "chessops/types";
import type { Botstil, Zugbewerter } from "./botwahl";

/** Das Ergebnis aus Sicht des Helden, wie es die Partiehülle braucht. */
export type Variantenergebnis = "sieg" | "remis" | "niederlage";

/** Was eine Brettansicht von der Hülle bekommt. */
export interface Variantenumgebung {
  readonly bewerter: Zugbewerter;
  readonly stil: Botstil;
  /** Farbe des Helden (im Tandem auf Brett A). */
  readonly heldFarbe: Color;
  /** Startstellung der Partie (FEN); fehlt: Grundstellung. Tests beginnen kurz vor dem Ende. */
  readonly startFen?: string;
  /** Name des Gegners für die Zeile „… überlegt“. */
  readonly gegner: string;
  /** Ende mit Ergebnis und den gespielten Zügen (UCI; im Tandem erst Brett A, dann B). */
  readonly beiEnde: (ergebnis: Variantenergebnis, zuege: readonly string[]) => void;
}

/** Pause vor dem Zug des Bots in Millisekunden (der eigene Zug soll erst zu sehen sein). */
export const BOTPAUSE_MS = 450;

/** Sieger (Farbe, null bei Remis) → Ergebnis aus Sicht des Helden. */
export function ergebnisFuer(sieger: Color | null, held: Color): Variantenergebnis {
  if (sieger === null) return "remis";
  return sieger === held ? "sieg" : "niederlage";
}

/**
 * Lässt den Bot ziehen, wenn `dran` gilt: `rechne` liefert den nächsten Stand, `setze` übernimmt
 * ihn. `schluessel` muss sich mit jedem Zug ändern (etwa die Zahl der Züge).
 * Sonderfall: Ein Fehler beim Rechnen wird gemeldet und lässt die Partie stehen (kein Absturz);
 * die Bots fallen schon selbst auf einen Notzug zurück, das ist die letzte Sicherung.
 */
export function useBotzug<T>(
  dran: boolean,
  schluessel: string,
  rechne: () => Promise<T>,
  setze: (neu: T) => void,
): void {
  useEffect(() => {
    if (!dran) return undefined;
    let aktiv = true;
    const uhr = setTimeout(() => {
      rechne()
        .then((neu) => {
          if (aktiv) setze(neu);
        })
        .catch((fehler: unknown) => console.error("Bot der Sonderform ohne Zug:", fehler));
    }, BOTPAUSE_MS);
    return () => {
      aktiv = false;
      clearTimeout(uhr);
    };
    // rechne und setze sind je Zug neu; der Schlüssel steht für den Zug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dran, schluessel]);
}

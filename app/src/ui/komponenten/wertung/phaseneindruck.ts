/**
 * Die Stärke je Phase (Eröffnung, Mittelspiel, Endspiel) für die Balken der Karte „Deine Wertung“
 * (Profil neu, 31.10.2026). Reine Funktion ohne Oberfläche.
 *
 * Rolle im Gesamtbild: Früher zeigte die Karte jede Phase als eigenen Reiter mit Kurve, und erst
 * wenn die Spanne schmal war (spiel/wertung.ts, phasenverlauf). Einsteiger sahen dort meist „noch
 * zu wenige Partien“. Jetzt stehen die drei Phasen als einfache Balken nebeneinander: bis zehn
 * Partien als Eindruck (blass), danach genau. Gerechnet wird mit demselben Elo-Modell
 * (spiel/elomodell.ts, schaetzung) aus den Kennzahlen der letzten zehn ausgewerteten Partien der
 * Zeitklasse; an der Rechnung selbst ändert sich nichts.
 * Abhängigkeiten: spiel/elomodell.ts, spiel/wertung.ts, spiel/phasen.ts, speicher/partien.ts (Typ).
 */
import {
  HOECHSTENS_PARTIEN,
  istSchmal,
  kennzahlenMittel,
  schaetzung,
  type Wertungstempo,
} from "../../../spiel/elomodell";
import { PHASEN, type Phase } from "../../../spiel/phasen";
import type { Partieeintrag } from "../../../speicher/partien";
import { ANFANGSPARTIEN, kennzahlenJePartie, type Wertungspunkt } from "../../../spiel/wertung";

/** Eine Phase: Schätzung (Mitte, Maßstab von Lichess) und ob sie schon als genau gilt. */
export interface Phaseneindruck {
  readonly phase: Phase;
  /** null: noch keine ausgewertete Partie in dieser Zeitklasse. */
  readonly mitte: number | null;
  /** Ab zehn Partien und schmaler Spanne genau; vorher nur ein Eindruck. */
  readonly genau: boolean;
}

/**
 * Die drei Phasen einer Zeitklasse.
 * Warum zehn Partien: Erst über zehn Partien wird die Spanne einer Phase schmal genug
 * (spiel/elomodell.ts, SCHMAL); vorher ist die Zahl ein Eindruck und wird blass gezeigt.
 * Beispiel: drei ausgewertete Schnellschach-Partien → drei Eindrücke mit Mitte, genau = false.
 * Sonderfall: keine ausgewertete Partie → alle mit Mitte null.
 */
export function phaseneindruecke(
  kette: readonly Wertungspunkt[],
  partien: readonly Partieeintrag[],
  tempo: Wertungstempo,
): Phaseneindruck[] {
  const kennzahlen = kennzahlenJePartie(partien, new Set(kette.map((p) => p.partieId)));
  const fenster = kette
    .flatMap((p) => {
      const k = kennzahlen.get(p.partieId);
      return k ? [k] : [];
    })
    .slice(-HOECHSTENS_PARTIEN);
  return PHASEN.map((phase) => {
    if (fenster.length === 0) return { phase, mitte: null, genau: false };
    const s = schaetzung(tempo, kennzahlenMittel(fenster), fenster.length, phase);
    return { phase, mitte: s.mitte, genau: kette.length >= ANFANGSPARTIEN && istSchmal(s) };
  });
}

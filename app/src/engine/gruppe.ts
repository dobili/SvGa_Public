/**
 * Gruppenmodus einer Bot-Kategorie (Wunsch des Autors, 24.10.2026): Alle Bots einer Stufe spielen
 * zugleich und beraten sich; die Gruppe ist ein eigener Gegner mit der Kennung „gruppe-N“.
 *
 * Rolle im Gesamtbild: Hat der Leser jeden Bot einer Stufe in einer gewerteten Partie besiegt
 * (egal in welcher Zeitklasse, speicher/besiegt.ts), ist der Gruppenmodus der Stufe frei. Die
 * Gruppe zieht, indem jeder Bot seinen Zug wählt und die Gruppe davon den Zug mit dem kleinsten
 * Verlust spielt (engine/gruppenwahl.ts). Ihre Stärke wird vorab gemessen
 * (engine/gruppenstaerke-daten.ts), aber erst gezeigt, wenn der Leser die Gruppe einmal besiegt
 * hat; bis dahin steht „Stärke unbekannt“. Für die Elo-Wertung gilt die gemessene Zahl von Anfang
 * an; ohne Messung die Zahl des stärksten Bots plus einem Zuschlag.
 * Abhängigkeiten: engine/gegner.ts, engine/botstaerke.ts, engine/gruppenstaerke-daten.ts,
 * speicher/besiegt.ts (Typ), engine/stufen.ts (Typ).
 */
import type { Phase } from "../schach/phase";
import { irgendwoBesiegt, type Besiegte } from "../speicher/besiegt";
import { staerkeAusStufen, staerkeDesBots } from "./botstaerke";
import { gegnerDerStufe, type Gegner } from "./gegner";
import { GRUPPEN_STAERKE } from "./gruppenstaerke-daten";
import { STUFEN_ZAHL, type Stufennummer } from "./stufen";

export const GRUPPEN_VORSILBE = "gruppe-";
/** Ohne Messung: die Zahl des stärksten Bots plus dieser Zuschlag (acht Köpfe, der beste Zug). */
const ZUSCHLAG_OHNE_MESSUNG = 150;
const PHASEN: readonly Phase[] = ["eroeffnung", "mittelspiel", "endspiel"];

/** Ist die Kennung eine Gruppe („gruppe-3“)? */
export function istGruppe(kennung: string | null | undefined): boolean {
  return typeof kennung === "string" && kennung.startsWith(GRUPPEN_VORSILBE);
}

/** Die Kennung der Gruppe einer Stufe. Beispiel: 3 → „gruppe-3“. */
export function gruppenkennung(stufe: Stufennummer): string {
  return `${GRUPPEN_VORSILBE}${stufe}`;
}

/** Die Stufe einer Gruppenkennung; null für alles andere. Beispiel: „gruppe-3“ → 3. */
export function gruppenstufe(kennung: string | null | undefined): Stufennummer | null {
  if (!istGruppe(kennung) || !kennung) return null;
  const nummer = Number(kennung.slice(GRUPPEN_VORSILBE.length));
  return Number.isInteger(nummer) && nummer >= 1 && nummer <= STUFEN_ZAHL
    ? (nummer as Stufennummer)
    : null;
}

/** Die Bots der Gruppe (die vorgefertigten Bots der Stufe, ohne Spaß-Bots). */
export function mitgliederDerGruppe(stufe: Stufennummer): Gegner[] {
  return gegnerDerStufe(stufe);
}

/**
 * Ist der Gruppenmodus frei? Jeder Bot der Stufe in irgendeiner Zeitklasse gewertet besiegt.
 * Beispiel: Stufe 2 mit acht Bots, sieben besiegt → false; der achte fällt → true.
 * Sonderfall: eine Stufe ohne Bots ist nie frei.
 */
export function gruppeFrei(besiegt: Besiegte, stufe: Stufennummer): boolean {
  const bots = mitgliederDerGruppe(stufe);
  return bots.length > 0 && bots.every((g) => irgendwoBesiegt(besiegt, g.kennung));
}

/** Alle Stufen, deren Gruppenmodus frei ist. */
export function freieGruppen(besiegt: Besiegte): Stufennummer[] {
  const alle = Array.from({ length: STUFEN_ZAHL }, (_, i) => (i + 1) as Stufennummer);
  return alle.filter((n) => gruppeFrei(besiegt, n));
}

/** Die Stufen je Phase der Gruppe: je Phase die höchste Stufe ihrer Bots (für Bedenkzeit, Anzeige). */
export function gruppenstufen(stufe: Stufennummer): Readonly<Record<Phase, Stufennummer>> {
  const bots = mitgliederDerGruppe(stufe);
  const je = (ph: Phase) =>
    bots.reduce<Stufennummer>(
      (max, g) => (g.stufenJePhase[ph] > max ? g.stufenJePhase[ph] : max),
      1,
    );
  return {
    eroeffnung: je(PHASEN[0] ?? "eroeffnung"),
    mittelspiel: je("mittelspiel"),
    endspiel: je("endspiel"),
  };
}

/** Die gemessene Zahl der Gruppe; null, solange nicht gemessen. */
export function gemesseneGruppenstaerke(stufe: Stufennummer): number | null {
  return GRUPPEN_STAERKE[stufe] ?? null;
}

/**
 * Die Zahl der Gruppe für die Elo-Wertung: gemessen, sonst der stärkste Bot plus Zuschlag.
 * Beispiel: Stufe 3, Bots bis 1020, nicht gemessen → 1170.
 */
export function gruppenwertung(stufe: Stufennummer): number {
  const gemessen = gemesseneGruppenstaerke(stufe);
  if (gemessen !== null) return gemessen;
  const zahlen = mitgliederDerGruppe(stufe).map(
    (g) => staerkeDesBots(g.kennung) ?? staerkeAusStufen(g.stufenJePhase),
  );
  return (
    (zahlen.length > 0 ? Math.max(...zahlen) : staerkeAusStufen(gruppenstufen(stufe))) +
    ZUSCHLAG_OHNE_MESSUNG
  );
}

/** Zeigt die App die Zahl? Erst nach dem ersten Sieg gegen die Gruppe (Wunsch des Autors). */
export function gruppenstaerkeSichtbar(besiegt: Besiegte, stufe: Stufennummer): boolean {
  return irgendwoBesiegt(besiegt, gruppenkennung(stufe)) && gemesseneGruppenstaerke(stufe) !== null;
}

/**
 * Welcher Brettstil gilt: für eine Partie aus Begegnung und Ort, für eine Rätselrunde aus dem Ort
 * der Runde, für eine Erinnerung Sepia.
 *
 * Rolle im Gesamtbild: docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 5: „Jeder Ort bekommt
 * einen Stil, einzelne Gegner dürfen ihn ändern (Feld `brett` in begegnungen.json, Vorgabe aus
 * orte.json).“ Die Wahl ist hier rein und ohne React, damit sie sich prüfen lässt; der Hook in
 * useAbenteuerBrettstil.ts lädt die Daten und setzt den Stil.
 * Abhängigkeiten: brettstile.ts.
 */
import { istBrettstil, VORGABESTIL, type Brettstilkennung } from "./brettstile";

/** Woher eine Ansicht ihren Stil nimmt; null für keinen Stil (Blindschach, nichts geladen). */
export type Brettquelle =
  | { readonly art: "partie"; readonly begegnung: string }
  | { readonly art: "runde"; readonly runde: string; readonly erinnerung: boolean };

/** Was die Wahl aus den Spieldaten braucht: nur Kennungen, Orte der Runden und „brett“. */
export interface Stildaten {
  readonly orte: readonly { readonly kennung: string; readonly brett?: string }[];
  readonly begegnungen: readonly { readonly kennung: string; readonly brett?: string }[];
  readonly runden: readonly { readonly kennung: string; readonly ort: string }[];
}

/** Der Ort einer Kennung wie „ironwood.clubkampf“: der Teil vor dem ersten Punkt. */
export function ortAusKennung(kennung: string): string {
  return kennung.split(".")[0] ?? "";
}

/** Der Stil eines Ortes oder die Vorgabe. */
function stilDesOrtes(daten: Stildaten, ort: string): Brettstilkennung {
  const wert = daten.orte.find((o) => o.kennung === ort)?.brett;
  return istBrettstil(wert) ? wert : VORGABESTIL;
}

/**
 * Wählt den Stil.
 *
 * Eingaben: Quelle der Ansicht, Spieldaten. Ausgabe: Stilkennung, oder null ohne Quelle.
 * Beispiele: Begegnung „ironwood.clubkampf“ → Ort Ironwood → „stahl“; Begegnung
 * „reisebrett.ambrose“ mit „brett: dachboden“ → „dachboden“; Runde „summitCity.reiheWard“ →
 * „schiefer“; eine Erinnerung Ambroses → „sepia“.
 * Sonderfälle: Unbekannte Kennungen in den Daten zählen nicht (Schema und Tests prüfen sie);
 * eine Begegnung an einem Ort ohne Stil (Wege, Dörfer) bekommt „abgegriffen“.
 */
export function waehleBrettstil(
  quelle: Brettquelle | null,
  daten: Stildaten,
): Brettstilkennung | null {
  if (!quelle) return null;
  if (quelle.art === "partie") {
    const eigener = daten.begegnungen.find((b) => b.kennung === quelle.begegnung)?.brett;
    if (istBrettstil(eigener)) return eigener;
    return stilDesOrtes(daten, ortAusKennung(quelle.begegnung));
  }
  if (quelle.erinnerung) return "sepia";
  const ort = daten.runden.find((r) => r.kennung === quelle.runde)?.ort;
  return stilDesOrtes(daten, ort ?? ortAusKennung(quelle.runde));
}

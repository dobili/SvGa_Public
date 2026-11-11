/**
 * „Meine Partien“ im Clubtagebuch: die beendeten Partien des Abenteuers als knappe Liste.
 *
 * Rolle im Gesamtbild: Die Partien des Abenteuers liegen wie alle Partien in der App
 * (speicher/partien.ts). Das Tagebuch zeigt sie im Aussehen des Spiels und öffnet eine davon zum
 * Nachspielen in der Hülle (anbindung/PartieHuelle.tsx), statt in die Partienliste der App zu
 * springen (docs/spiel/18_Spielhuelle.md, Abschnitt 8).
 * Abhängigkeiten: speicher/partien.ts (Typ), anbindung/partieergebnis.ts, anbindung/huellentexte.ts.
 */
import type { Spielstand } from "../../speicher/partien";
import type { Ausgang } from "../schnittstelle/partie";
import { gegnerName } from "./huellentexte";
import { ausgangAus } from "./partieergebnis";

/** So viele Partien zeigt das Tagebuch höchstens (neueste zuerst). */
export const MEINE_PARTIEN_HOECHSTENS = 12;

/** Eine Zeile der Liste. */
export interface Partiezeile {
  /** Id der Partie in der App, zum Öffnen in der Hülle. */
  readonly id: string;
  readonly gegner: string;
  readonly ausgang: Ausgang;
  /** Ganze Züge, wie man sie am Brett zählt. */
  readonly zuege: number;
}

/**
 * Die beendeten Partien des Abenteuers, neueste zuerst.
 *
 * Warum nur beendete: Die laufende Partie setzt der Leser über „Weiterspielen“ fort; hier geht es
 * ums Nachspielen. Eingaben: Spielstand der App, Höchstzahl. Ausgabe: die Zeilen der Liste.
 * Beispiel: Sieg gegen Skater Jo nach 47 Halbzügen → { gegner: "Skater Jo", ausgang: "sieg",
 * zuege: 24 }. Sonderfall: Partien ohne Abenteuer-Angabe (freie Partien der App) fehlen.
 */
export function meinePartien(
  spiel: Pick<Spielstand, "partien">,
  hoechstens: number = MEINE_PARTIEN_HOECHSTENS,
): Partiezeile[] {
  return spiel.partien
    .map((e) => e.partie)
    .filter((p) => p.einstellung.abenteuer && p.ende)
    .slice(0, hoechstens)
    .map((p) => ({
      id: p.id,
      gegner: gegnerName(p),
      ausgang: ausgangAus(p),
      zuege: Math.ceil(p.zuege.length / 2),
    }));
}

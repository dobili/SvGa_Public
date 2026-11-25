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
import { besprechbarePartie } from "../regeln/besprechung";
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
  /** Nach normalen Regeln gespielt (regeln/besprechung.ts, besprechbarePartie)? */
  readonly besprechbar: boolean;
  /** Liegen die Züge in der Partie (sonst spielte eine eigene Komponente, nichts zum Ansehen)? */
  readonly nachspielbar: boolean;
}

/** Halbzüge einer Partie: die gespeicherten Züge, sonst die Zahl im Ende (eigene Varianten). */
function halbzuegeVon(p: Spielstand["partien"][number]["partie"]): number {
  if (p.zuege.length > 0) return p.zuege.length;
  const ende = p.ende;
  return ende && "halbzuege" in ende ? (ende.halbzuege ?? 0) : 0;
}

/**
 * Die beendeten Partien des Abenteuers, neueste zuerst.
 *
 * Warum nur beendete: Die laufende Partie setzt der Leser über „Weiterspielen“ fort; hier geht es
 * ums Nachspielen. Eingaben: Spielstand der App, Höchstzahl. Ausgabe: die Zeilen der Liste.
 * Nur dieser Spieldurchlauf (Befund des Autors, 25.11.2026: nach einem neuen Spiel standen noch
 * die Partien des vorigen da): Partien, die nach `seit` begannen, dem Beginn des Spielstands
 * (Abenteuerstand.begonnen; jeder Neubeginn setzt ihn neu, ohne neues Speicherformat).
 * Beispiel: Sieg gegen Skater Jo nach 47 Halbzügen → { gegner: "Skater Jo", ausgang: "sieg",
 * zuege: 24 }. Sonderfälle: Partien ohne Abenteuer-Angabe (freie Partien der App) fehlen; eine
 * Variante in eigener Komponente (Ente, Nebel, Tandem) zählt die Züge aus ihrem Ende und ist nicht
 * nachspielbar (ihre Züge liegen nicht in der Partie; vorher stand dort „0 Züge“).
 */
export function meinePartien(
  spiel: Pick<Spielstand, "partien">,
  seit: string | null = null,
  hoechstens: number = MEINE_PARTIEN_HOECHSTENS,
): Partiezeile[] {
  return spiel.partien
    .map((e) => e.partie)
    .filter((p) => p.einstellung.abenteuer && p.ende && (seit === null || p.begonnen >= seit))
    .slice(0, hoechstens)
    .map((p) => ({
      id: p.id,
      gegner: gegnerName(p),
      ausgang: ausgangAus(p),
      zuege: Math.ceil(halbzuegeVon(p) / 2),
      besprechbar: besprechbarePartie(p.einstellung) && p.zuege.length > 0,
      nachspielbar: p.zuege.length > 0,
    }));
}

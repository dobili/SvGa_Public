/**
 * Namen von Eröffnungen außerhalb des Buches, aus der freien Liste von Lichess.
 *
 * Rolle im Gesamtbild: Vorschlag G („Eröffnung außerhalb des Buches“, Entscheidung des Autors vom
 * 15.10.2026: zuerst die Offline-Liste). Das Werkzeug k2-eroeffnung kennt die Eröffnungen des
 * Buches; steht eine Stellung nicht im Buch, nennt es mit dieser Liste den üblichen Namen
 * („Nicht im Buch – bekannt als …“). Die Liste ist gemeinfrei (CC0) und liegt offline in der App
 * (`public/daten/de/eroeffnungen-lichess.json`, erzeugt von `pipeline/eroeffnungsliste.py`). Die
 * Schlüssel sind dieselben wie im Eröffnungsindex (Figuren, Zugrecht, Rochaderechte).
 * Abhängigkeiten: chessops, schach/eroeffnungsindex.ts (Schlüssel), daten/generiert,
 * schach/eroeffnungsnamen-typen.ts (Typen, hier weitergereicht).
 */
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import type { Eroeffnungsliste } from "../daten/generiert/eroeffnungsliste";
import { stellungsschluessel } from "./eroeffnungsindex";
import type { BekannteEroeffnung, Eroeffnungsnamen } from "./eroeffnungsnamen-typen";
export type { BekannteEroeffnung, Eroeffnungsnamen } from "./eroeffnungsnamen-typen";

/** Fundstelle in einer Partie: die Eröffnung und wie viele Halbzüge bis dorthin gespielt sind. */
export interface Fundstelle {
  readonly eroeffnung: BekannteEroeffnung;
  readonly halbzuege: number;
  /** Ist es die gezeigte Stellung selbst (oder eine frühere des Verlaufs)? */
  readonly genau: boolean;
}

/** Die Liste aus der Datei; Einträge mit falscher Form werden übersprungen. */
export function eroeffnungsnamenAus(liste: Eroeffnungsliste): Eroeffnungsnamen {
  const namen = new Map<string, BekannteEroeffnung>();
  for (const [schluessel, eco, name] of liste.stellungen) {
    if (typeof schluessel === "string" && typeof eco === "string" && typeof name === "string") {
      namen.set(schluessel, { eco, name });
    }
  }
  return namen;
}

/** Die Schlüssel aller Stellungen eines Verlaufs (Start und nach jedem Zug); bricht still ab. */
function schluesselImVerlauf(startFen: string, zuege: readonly string[]): string[] {
  const setup = parseFen(startFen);
  const start = setup.isOk ? Chess.fromSetup(setup.value) : null;
  if (!start?.isOk) return [];
  const pos = start.value;
  const schluessel = [stellungsschluessel(startFen)];
  for (const san of zuege) {
    const zug = parseSan(pos, san);
    if (!zug) break;
    pos.play(zug);
    schluessel.push(stellungsschluessel(makeFen(pos.toSetup())));
  }
  return schluessel;
}

/**
 * Die bekannte Eröffnung zur gezeigten Stellung: die Stellung selbst, sonst die letzte benannte
 * Stellung davor im Verlauf (die Partie hat die bekannten Wege dann verlassen).
 *
 * Eingaben: Namen, FEN der gezeigten Stellung, Verlauf (Start und Züge, englisch).
 * Beispiel: 1. e4 c5 2. Sf3 d6 3. d4 cxd4 4. Sxd4 Sf6 5. Sc3 a6 → „Sizilianische Verteidigung:
 * Najdorf Variation“ (genau); ein ungewöhnlicher 6. Zug danach → dieselbe, nach 10 Halbzügen.
 * Sonderfall: Ohne Verlauf zählt nur die gezeigte Stellung.
 */
export function bekannteEroeffnung(
  namen: Eroeffnungsnamen,
  fen: string,
  verlauf?: { readonly startFen: string; readonly zuege: readonly string[] },
): Fundstelle | null {
  const hier = namen.get(stellungsschluessel(fen));
  if (hier) return { eroeffnung: hier, halbzuege: verlauf?.zuege.length ?? 0, genau: true };
  if (!verlauf) return null;
  const schluessel = schluesselImVerlauf(verlauf.startFen, verlauf.zuege);
  for (let stelle = schluessel.length - 1; stelle >= 0; stelle -= 1) {
    const eintrag = namen.get(schluessel[stelle] ?? "");
    if (eintrag) return { eroeffnung: eintrag, halbzuege: stelle, genau: false };
  }
  return null;
}

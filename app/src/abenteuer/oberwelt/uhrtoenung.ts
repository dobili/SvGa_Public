/**
 * Tönung nach der Spieluhr (Wunsch des Autors, 22.11.2026): Auf Außenkarten wird es morgens
 * dämmrig, abends warm, nachts dunkelblau; am Tag gibt es keinen Schleier. Innenräume bleiben
 * ohne Tönung, nachts nur etwas gedämpft.
 *
 * Geschichte geht vor: Was Dialog, orte.json oder Szene festlegen (Nebel, Sepia, dunkel, die erste
 * Nacht …), gilt vor der Uhr. Reihenfolge: Dialogvariable `toenung.<karte>` („keine“ hebt auf),
 * dann ein Licht aus orte.json, dann die Tönung der Szene, dann die Uhr. `licht: tag` in orte.json
 * heißt hier „kein besonderes Licht“: Dann gilt die Uhr. Erinnerungen (Ambroses Zeit) bleiben ohne
 * Uhr. Die Tönungsschicht blendet beim Wechsel weich über (toenungsschicht.ts).
 * Rolle im Gesamtbild: gerufen beim Laden der Karte (useWeltladen.ts), bei Dialogwirkungen
 * (dialogwirkungen.ts) und beim Stundenwechsel (useSpieluhr.ts). Abhängigkeiten: toenung.ts,
 * regeln/spieluhr.ts.
 */
import { phase, stundeJetzt, type Tagesphase } from "../regeln/spieluhr";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import {
  istToenung,
  KEINE_TOENUNG,
  lichtAusOrten,
  toenungAusKarte,
  toenungsvariable,
  type Lichtangabe,
  type Toenung,
} from "./toenung";

/** Schleier je Tagesphase draußen; am Tag keiner. */
const DRAUSSEN: Readonly<Record<Tagesphase, Toenung | null>> = {
  morgen: "morgen",
  tag: null,
  abend: "abend",
  nacht: "nacht",
};

/** Die Tönung der Uhr allein. Beispiel: nacht, draußen → „nacht“; nacht, innen → „innennacht“. */
export function uhrToenung(tagesphase: Tagesphase, innen: boolean): Toenung | null {
  if (innen) return tagesphase === "nacht" ? "innennacht" : null;
  return DRAUSSEN[tagesphase];
}

/** Was von der Welt für die Tönung zählt. */
export interface Toenungswelt {
  readonly karte: object;
  readonly kennung: string;
  readonly innen: boolean;
  readonly erinnerung: boolean;
  readonly ort: { readonly karten: readonly ({ readonly kennung: string } & Lichtangabe)[] };
}

/**
 * Die Tönung, die jetzt gilt (Reihenfolge im Dateikopf).
 * Beispiel: Maple Falls außen ohne Szenentönung um 22 Uhr → „nacht“; Bayou mit Nebel → „nebel“.
 */
export function toenungJetzt(
  w: Toenungswelt,
  stand: Pick<Abenteuerstand, "dialogvariablen" | "spieluhr">,
): Toenung | null {
  const variablen = stand.dialogvariablen;
  const gesetzt = variablen[toenungsvariable(w.kennung)];
  if (gesetzt === KEINE_TOENUNG) return null;
  if (istToenung(gesetzt)) return gesetzt;
  const eintrag = w.ort.karten.find((x) => x.kennung === w.kennung);
  const ausOrten = lichtAusOrten(eintrag, variablen);
  if (ausOrten) return ausOrten;
  const ausKarte = ausOrten === undefined ? toenungAusKarte(w.karte) : null;
  if (ausKarte) return ausKarte;
  if (w.erinnerung) return null;
  return uhrToenung(phase(stundeJetzt(stand)), w.innen);
}

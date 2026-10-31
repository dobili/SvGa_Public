/**
 * Die zuletzt gewählten Einstellungen eines Trainers, gemerkt auf dem Gerät.
 *
 * Rolle im Gesamtbild: Entwurf G1 „Startkarte“: Der große Knopf startet die Runde mit den
 * zuletzt gewählten Werten. Die Werte sind eine Bequemlichkeit, die verloren gehen darf; sie
 * stehen deshalb als Merker (app/merker.ts, ein Eintrag je Trainer als JSON), nicht in den
 * Nutzerdaten (Speicherformat bleibt unverändert).
 * Abhängigkeiten: app/merker.ts.
 */
import { useState } from "react";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import type { Trainerstufe } from "../../../training/stufen";
import {
  ALLE,
  GEEICHTE_STUFEN,
  GEMISCHT,
  stufeAus,
  stufenwert,
  WORTSTUFENWERTE,
  wortstufeAus,
  zahlstufen,
} from "./einstellung";

/** Name des Merkers eines Trainers, etwa „trainerstart.taktik“. */
function merkername(trainer: string): string {
  return `trainerstart.${trainer}`;
}

/** Alle gemerkten Werte eines Trainers; Unlesbares ergibt eine leere Liste. */
function gemerkteWerte(trainer: string): Readonly<Record<string, string>> {
  const roh = liesMerker(merkername(trainer));
  if (!roh) return {};
  try {
    const wert: unknown = JSON.parse(roh);
    if (typeof wert !== "object" || wert === null) return {};
    return Object.fromEntries(
      Object.entries(wert).filter((e): e is [string, string] => typeof e[1] === "string"),
    );
  } catch (fehler) {
    console.warn("Gemerkte Trainerwahl nicht lesbar:", fehler);
    return {};
  }
}

/**
 * Liest den gemerkten Wert eines Feldes, wenn er erlaubt ist; sonst die Vorgabe.
 *
 * Beispiel: gemerkterWert("taktik", "stufe", ["alle", "1", …], "alle") → „3“.
 */
export function gemerkterWert<T extends string>(
  trainer: string,
  feld: string,
  erlaubt: readonly T[],
  vorgabe: T,
): T {
  const wert = gemerkteWerte(trainer)[feld];
  return erlaubt.find((e) => e === wert) ?? vorgabe;
}

/** Merkt einen Wert eines Feldes (die anderen Felder bleiben). */
export function merkeWert(trainer: string, feld: string, wert: string): void {
  schreibeMerker(merkername(trainer), JSON.stringify({ ...gemerkteWerte(trainer), [feld]: wert }));
}

/**
 * Zustand einer Einstellung, der beim nächsten Öffnen des Trainers wieder da ist.
 *
 * Eingaben: Trainer, Feld, erlaubte Werte, Vorgabe; `vorwahl` (etwa ein Thema aus „Dein nächster
 * Schritt“) geht dem gemerkten Wert vor.
 * Beispiel: useGemerkt("falle", "stufe", ["alle", "1", …], "alle").
 * Sonderfall: Die erlaubten Werte dürfen erst nach dem Laden feststehen (Themen der
 * Zusatzaufgaben); geprüft wird bei jeder Anzeige, bis dahin gilt die Vorgabe.
 */
export function useGemerkt<T extends string>(
  trainer: string,
  feld: string,
  erlaubt: readonly T[],
  vorgabe: T,
  vorwahl: T | null = null,
): [T, (wert: T) => void] {
  const [roh, setzeRoh] = useState<string | null>(
    () => vorwahl ?? gemerkteWerte(trainer)[feld] ?? null,
  );
  const setze = (neu: T) => {
    merkeWert(trainer, feld, neu);
    setzeRoh(neu);
  };
  return [erlaubt.find((e) => e === roh) ?? vorgabe, setze];
}

/**
 * Die gemerkte Stufe 1 bis 5 eines Trainers (null: alle Stufen).
 *
 * Beispiel: useGemerkteStufe("struktur") → [3, setze] nach einer Runde auf Stufe 3.
 */
export function useGemerkteStufe(trainer: string): [number | null, (s: number | null) => void] {
  const erlaubt = zahlstufen(GEEICHTE_STUFEN).map((o) => o.wert);
  const [wert, setze] = useGemerkt(trainer, "stufe", erlaubt, ALLE);
  return [stufeAus(wert), (stufe) => setze(stufenwert(stufe))];
}

/**
 * Die gemerkte Wortstufe eines Trainers (null: gemischt); `feld` trennt Übungen mit eigener
 * Stufe (Koordinaten „felder“, Planbilanz „lap“).
 *
 * Beispiel: useGemerkteWortstufe("roentgen") → ["mittel", setze].
 */
export function useGemerkteWortstufe(
  trainer: string,
  feld = "stufe",
): [Trainerstufe | null, (s: Trainerstufe | null) => void] {
  const [wert, setze] = useGemerkt(trainer, feld, WORTSTUFENWERTE, GEMISCHT);
  return [wortstufeAus(wert), (stufe) => setze(stufe ?? GEMISCHT)];
}

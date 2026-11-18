/**
 * Meldungen der Oberwelt („Neu im Tagebuch …“, „Erledigt …“, Funde) warten, solange ein Dialog
 * offen ist, und kommen danach der Reihe nach.
 *
 * Warum: Am Übergang im Zedernwald erschien „Neu im Tagebuch: Das Testteam“ über dem laufenden
 * Gespräch mit der Truppe (Befund im Browser, 18.11.2026). Die Leiste lenkt vom Dialog ab und liegt
 * hoch über dem Namensschild; außerdem überschrieb eine zweite Meldung im selben Dialog die erste
 * (Fund und danach „Erledigt“), bevor jemand sie lesen konnte.
 *
 * Rolle im Gesamtbild: reine Logik für oberwelt/kern.ts, das den Stau als Zustand hält.
 * useDialogende.ts sagt dem Kern, wann ein Dialog offen ist; Oberwelt.tsx zeigt `gezeigt` in der
 * Meldungsleiste. Abhängigkeiten: keine.
 */

/** Eine Meldung: Text und, im Zusatzpaket, das Bild eines Fundes. */
export interface Meldung {
  readonly text: string;
  readonly bild?: string;
}

/** Die Meldung, die gerade zu sehen ist, und die, die noch warten (älteste zuerst). */
export interface Meldungsstau {
  readonly gezeigt: Meldung | null;
  readonly wartend: readonly Meldung[];
}

/** Keine Meldung, nichts wartet. */
export const LEERER_STAU: Meldungsstau = { gezeigt: null, wartend: [] };

/** Zeigt die älteste wartende Meldung, wenn gerade keine zu sehen ist. */
function rueckeNach(stau: Meldungsstau): Meldungsstau {
  const [naechste, ...rest] = stau.wartend;
  if (stau.gezeigt !== null || naechste === undefined) return stau;
  return { gezeigt: naechste, wartend: rest };
}

/**
 * Eine neue Meldung. Ohne offenen Dialog ersetzt sie die gezeigte, wie bisher; warten aber noch
 * Meldungen aus einem Dialog, stellt sie sich hinten an, damit keine verloren geht. Mit offenem
 * Dialog wartet sie immer.
 * Eingaben: Stau, Meldung, ob ein Dialog offen ist. Ausgabe: der neue Stau.
 * Beispiel: Im Gespräch mit der Truppe beginnt die Quest „Das Testteam“ → die Meldung wartet;
 * `nachDialog` zeigt sie nach „Später.“.
 */
export function mitMeldung(stau: Meldungsstau, neu: Meldung, dialogOffen: boolean): Meldungsstau {
  if (dialogOffen || stau.wartend.length > 0) return { ...stau, wartend: [...stau.wartend, neu] };
  return { gezeigt: neu, wartend: [] };
}

/**
 * Die gezeigte Meldung schließen („Weiter“). Ohne offenen Dialog rückt die nächste wartende nach.
 * Beispiel: Fund und „Erledigt“ aus demselben Dialog → nach „Weiter“ am Fund steht „Erledigt“ da.
 */
export function ohneGezeigte(stau: Meldungsstau, dialogOffen: boolean): Meldungsstau {
  const leer = { gezeigt: null, wartend: stau.wartend };
  return dialogOffen ? leer : rueckeNach(leer);
}

/**
 * Der Dialog ist zu: Die älteste wartende Meldung erscheint. Sonderfall: Stand vor dem Dialog schon
 * eine Meldung da, bleibt sie, und die wartenden folgen nach „Weiter“.
 */
export function nachDialog(stau: Meldungsstau): Meldungsstau {
  return rueckeNach(stau);
}

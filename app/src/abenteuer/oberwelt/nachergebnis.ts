/**
 * Rückmeldung nach dem Ergebnis: Nach einer Partie, Aufgabenrunde, einem Rätsel, Simultan oder
 * einer Gedächtnisstellung aus einem Dialog spricht die Figur von selbst weiter.
 *
 * Warum (Wunsch des Autors nach dem ersten Anspielen, 19.11.2026): „Bei der ersten Partie gegen
 * Ambrose wird man danach einfach in die Spielwelt geworfen, keine Reaktion von Ambrose.“ Die
 * Dialoge kannten die Reaktion schon (etwa maple-falls-dachboden.nach_erster_partie), aber nur,
 * wenn man die Figur noch einmal ansprach. Jetzt merkt sich der Spielstand den Dialog, der die
 * Folge gestartet hat (`nachErgebnis`), und die Oberwelt öffnet ihn wieder, sobald die
 * Ergebniskarte geschlossen ist. Der Einstiegsknoten verzweigt über die Dialogvariablen nach dem
 * Ausgang. `danach` in begegnungen.json oder runden.json geht vor.
 *
 * Rolle im Gesamtbild: useDialogende.ts merkt den Dialog, Oberwelt.tsx ruft `reagiere` beim
 * Schließen der Ergebniskarte, useAufgabenrunde.ts nach Simultan und Gedächtnisstellung. Die
 * Gesamtsimulation macht dasselbe (pipeline/abenteuer/gesamtsimulation-dialoge.cjs), das
 * Prüfwerkzeug pipeline/abenteuer/rueckmeldung.cjs prüft jede Rückmeldung.
 * Abhängigkeiten: schnittstelle/spielstand.ts, kern.ts.
 */
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import type { Oberweltkern } from "./kern";

/**
 * Der Dialog der Rückmeldung: `danach` der Daten, sonst der gemerkte Dialog; null ohne beides.
 * Beispiel: ohne `danach`, gemerkt „maple-falls-dachboden.dachboden_brett“ → derselbe Verweis.
 */
export function rueckmeldedialog(
  stand: Pick<Abenteuerstand, "nachErgebnis">,
  danach: string | undefined,
): string | null {
  return danach ?? stand.nachErgebnis ?? null;
}

/**
 * Der Stand nach dem Ende eines Dialogs: Startet er eine Folge (Partie, Runde, Simultan,
 * Gedächtnis), merkt er sich den Dialog; sonst bleibt der Stand, wie er ist.
 * Beispiel: Dialog „maple-falls-park.skater_jo“ startet eine Partie → nachErgebnis gesetzt.
 */
export function mitGemerktemDialog(
  stand: Abenteuerstand,
  verweis: string | null,
  folgeStartet: boolean,
): Abenteuerstand {
  if (!folgeStartet || !verweis) return stand;
  return { ...stand, nachErgebnis: verweis };
}

/** Die Rückmeldung der Oberwelt: zeigen (und vergessen) oder nur vergessen. */
export interface NachErgebnis {
  /** Öffnet den Dialog der Rückmeldung (`danach` geht vor) und vergisst den gemerkten Dialog. */
  readonly reagiere: (danach?: string) => void;
  /** Vergisst den gemerkten Dialog (Abbruch: Deckwahl, offene Partie oder Runde aufgegeben). */
  readonly vergiss: () => void;
}

/** Rückmeldung über den Kern der Oberwelt; `oeffneDialog` öffnet einen Ink-Knoten. */
export function nachErgebnis(
  k: Oberweltkern,
  oeffneDialog: (verweis: string) => void,
): NachErgebnis {
  const vergiss = () => {
    const aktuell = k.standRef.current;
    if (aktuell?.nachErgebnis) k.schreibe({ ...aktuell, nachErgebnis: null });
  };
  return {
    reagiere: (danach) => {
      const aktuell = k.standRef.current;
      if (!aktuell) return;
      const verweis = rueckmeldedialog(aktuell, danach);
      vergiss();
      if (verweis) oeffneDialog(verweis);
    },
    vergiss,
  };
}

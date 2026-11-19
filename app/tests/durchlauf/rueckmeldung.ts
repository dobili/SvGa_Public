/**
 * Rückmeldung nach dem Ergebnis im Spieler-Durchlauf: Hat ein Dialog eine Partie oder Runde
 * gestartet (Spielstand `nachErgebnis`), muss sich nach der Ergebniskarte ein Dialog öffnen, der
 * auf das Ergebnis eingeht (Wunsch des Autors, 19.11.2026; App: oberwelt/nachergebnis.ts).
 *
 * Warum im Browser: pipeline/abenteuer/rueckmeldung.cjs prüft das mit der Gesamtsimulation; ob die
 * App den Dialog nach Niederlage, Aufgeben und Neuladen wirklich öffnet, sieht nur der Browser.
 * Die erste Zeile jeder Rückmeldung steht im Protokoll („RÜCKMELDUNG …“), Ambroses Zeilen sind
 * daran zu erkennen; bleibt der Dialog aus, ist das ein Fund.
 * Abhängigkeiten: eingabe.ts (Lauf), lage.ts.
 * Beispiel: Niederlage gegen Rosa, nachErgebnis „maple-falls-waschsalon.rosa“ → nach der Karte
 * „RÜCKMELDUNG nach Partie mapleFalls.rosa (niederlage): Rosa: …“.
 */
import type { Lauf } from "./eingabe";
import type { Lage } from "./lage";

/** So lange darf die Welt nach der Ergebniskarte ohne Dialog frei sein (ms). */
const OHNE_DIALOG_MS = 12_000;

/** Die erwartete Rückmeldung: was gespielt wurde und welcher Dialog sie gestartet hat. */
interface Erwartung {
  readonly was: string;
  readonly knoten: string;
  /** Seit wann die Welt frei ist (0: noch ein Fenster offen). */
  frei: number;
}

/** Beobachtet, ob nach Partien und Runden die Rückmeldung kommt. */
export class Rueckmeldungsbeobachter {
  private erwartet: Erwartung | null = null;
  private knoten: string | null = null;

  /** Während der Partie oder Runde: der gemerkte Dialog aus dem Spielstand. */
  vorher(nachErgebnis: string | null | undefined): void {
    this.knoten = nachErgebnis ?? null;
  }

  /** Nach der Partie oder Runde; `beendet` false (Neuladen) erwartet nichts. */
  nachher(was: string, beendet: boolean): void {
    this.erwartet = beendet && this.knoten ? { was, knoten: this.knoten, frei: 0 } : null;
    this.knoten = null;
  }

  /** In der Welt: Dialog offen → Rückmeldung festhalten; zu lange frei → Fund. */
  welt(lauf: Lauf, lage: Lage, frei: boolean): void {
    const e = this.erwartet;
    if (!e) return;
    if (lage.dialog) {
      const d = lage.dialog;
      lauf.messung.log(
        `RÜCKMELDUNG nach ${e.was} (${e.knoten}): ${d.sprecher}: ${d.text.slice(0, 160)}`,
      );
      this.erwartet = null;
      return;
    }
    if (!frei) {
      e.frei = 0;
      return;
    }
    if (e.frei === 0) e.frei = Date.now();
    if (Date.now() - e.frei > OHNE_DIALOG_MS) {
      lauf.messung.fund("rueckmeldung", `Nach ${e.was}: kein Dialog (${e.knoten} öffnete nicht)`);
      this.erwartet = null;
    }
  }
}

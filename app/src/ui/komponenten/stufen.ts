/**
 * Gestufte Werkzeugkarten: welche Befunde eine Karte auf welcher Stufe zeigt.
 *
 * Rolle im Gesamtbild: Vorschlag D6 (Rückmeldung zu 0.2.26, vom Autor angenommen): Alle Werkzeuge
 * rechnen drei Stufen (kurz, mehr, alles), die Karte zeigte aber immer alles. Seit 0.2.30 zeigt sie
 * zuerst Stufe 1 und darunter „Mehr …“; das passt zu „Erst selbst denken“ und hält die Karten
 * kurz. Das Fazit steht immer da. Abhängigkeiten: analyse/werkzeug.ts.
 */
import type { Befund, Werkzeugergebnis } from "../../analyse/werkzeug";

/** Stufen 1 und 2 aus dem Ergebnis, Stufe 3 zeigt immer alle Befunde. */
const LETZTE_STUFE = 2;

/** Die Befunde einer Stufe (0, 1 oder 2) in ihrer Reihenfolge. */
function befundeDerStufe(ergebnis: Werkzeugergebnis, stufe: number): Befund[] {
  const kennungen = stufe < LETZTE_STUFE ? ergebnis.stufen[stufe] : undefined;
  return kennungen
    ? ergebnis.befunde.filter((b) => kennungen.includes(b.kennung))
    : [...ergebnis.befunde];
}

/** Was die Karte auf einer Stufe zeigt und welche Stufe „Mehr …“ öffnet (null: alles da). */
export interface Stufenansicht {
  readonly befunde: readonly Befund[];
  readonly naechste: number | null;
}

/**
 * Die Ansicht einer Karte auf der gewünschten Stufe. Leere Stufen werden übersprungen, ebenso
 * Stufen, die nichts Neues zeigen.
 * Beispiel: Prüffragen an Abb. 4.2 mit Stufen [f1], [f1, f2], [f1, f2, f3, f3-nach] → Stufe 0
 * zeigt F1 und bietet „Mehr …“ (Stufe 1), Stufe 1 zeigt F1 und F2, Stufe 2 alles.
 */
export function stufenansicht(ergebnis: Werkzeugergebnis, gewuenscht: number): Stufenansicht {
  let stufe = Math.min(Math.max(gewuenscht, 0), LETZTE_STUFE);
  while (stufe < LETZTE_STUFE && befundeDerStufe(ergebnis, stufe).length === 0) stufe += 1;
  const befunde = befundeDerStufe(ergebnis, stufe);
  let naechste: number | null = null;
  for (let kandidat = stufe + 1; kandidat <= LETZTE_STUFE; kandidat += 1) {
    if (befundeDerStufe(ergebnis, kandidat).length > befunde.length) {
      naechste = kandidat;
      break;
    }
  }
  return { befunde, naechste };
}

/**
 * Ein Bot als ein Mensch mit drei Wertungen (Wunsch des Autors, 25.10.2026): Aus der
 * Schnellschach-Zahl wird die Blitz- und die Klassisch-Zahl desselben Menschen.
 *
 * Rolle im Gesamtbild: Die Daten der Menschen, an denen die Bots geeicht sind (Wahlmodell,
 * Zeitnot, Bedenkzeit, Praxisbuch), sind nach der Wertung in der jeweiligen Zeitklasse geordnet.
 * Ein Bot, der in Blitz dieselbe Zahl übergäbe wie in Schnellschach, spielte wie ein anderer,
 * stärkerer Mensch (gemessen am 25.10.2026: Blitz-Zahlen der Bots so hoch wie Schnellschach, bei
 * echten Spielern 90 bis 215 tiefer). Mit dieser Umrechnung übergibt er in jeder Zeitklasse die
 * Zahl, die ein Mensch seiner Stärke dort hätte, und die App zeigt und wertet mit derselben Zahl.
 * Abhängigkeiten: engine/zeitklassenabstand-daten.ts (Lichess-Profile), spiel/elomodell-daten.ts (Typ).
 */
import type { Wertungstempo } from "../spiel/elomodell-daten";
import { ABSTAND_ZU_SCHNELLSCHACH, type Abstandspunkt } from "./zeitklassenabstand-daten";

/** Lichess vergibt keine Zahl unter 400; tiefer rechnet die Umrechnung angezeigte Zahlen nicht. */
export const LICHESS_UNTERGRENZE = 400;
/** Schritte der Fixpunktrechnung (der Abstand hängt vom Mittel beider Zahlen ab); 8 genügen auf 1 Elo. */
const SCHRITTE = 8;

/** Der Abstand bei einem Mittel beider Wertungen: zwischen den Bändern linear, außen der Randwert. */
function abstandBei(punkte: readonly Abstandspunkt[], mittel: number): number {
  const erster = punkte[0];
  const letzter = punkte[punkte.length - 1];
  if (!erster || !letzter) return 0;
  if (mittel <= erster[0]) return erster[1];
  if (mittel >= letzter[0]) return letzter[1];
  for (let i = 1; i < punkte.length; i += 1) {
    const a = punkte[i - 1];
    const b = punkte[i];
    if (a && b && mittel <= b[0]) return a[1] + ((b[1] - a[1]) * (mittel - a[0])) / (b[0] - a[0]);
  }
  return letzter[1];
}

/**
 * Die Wertung desselben Menschen in einer Zeitklasse, aus seiner Schnellschach-Wertung.
 * Warum: Siehe Dateikopf; so geben die Bots an Wahlmodell, Zeitnot, Bedenkzeit und Praxisbuch
 * die Zahl, nach der deren Menschendaten geordnet sind.
 * Eingaben: Schnellschach-Wertung, Zeitklasse. Ausgabe: Wertung in der Zeitklasse (Schnellschach
 * unverändert). Beispiel: 1500 in Schnellschach → in Blitz etwa 1300, in Klassisch etwa 1650.
 * Sonderfall: außerhalb der gemessenen Bänder gilt der Abstand des äußersten Bandes.
 */
export function wertungInZeitklasse(schnellschach: number, tempo: Wertungstempo): number {
  if (tempo === "rapid") return schnellschach;
  const punkte = ABSTAND_ZU_SCHNELLSCHACH[tempo];
  let wert = schnellschach;
  for (let i = 0; i < SCHRITTE; i += 1) {
    wert = schnellschach + abstandBei(punkte, (schnellschach + wert) / 2);
  }
  return wert;
}

/**
 * Die angezeigte und gewertete Zahl eines Bots oder einer Stufe in einer Zeitklasse: die
 * umgerechnete Zahl, aber nicht unter der Lichess-Untergrenze 400, außer die Schnellschach-Zahl
 * liegt selbst darunter (dann nie unter ihr, damit Blitz nicht über Schnellschach rutscht).
 * Beispiel: Tom (347 in Schnellschach) → Blitz 347, Klassisch etwa 580.
 */
export function zahlInZeitklasse(schnellschach: number, tempo: Wertungstempo): number {
  if (tempo === "rapid") return schnellschach;
  const boden = Math.min(schnellschach, LICHESS_UNTERGRENZE);
  return Math.round(Math.max(boden, wertungInZeitklasse(schnellschach, tempo)));
}

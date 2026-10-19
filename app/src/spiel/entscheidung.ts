/**
 * Bis wann eine Partie für die Spielstärke zählt: bis sie dauerhaft entschieden ist.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (19.10.2026): Eine Partie, die in den ersten Zügen
 * verschenkt und dann lange weitergespielt wird, darf keine hohe Spielstärke ergeben. Die
 * Genauigkeit nach Lichess zählt jeden Zug in einer längst entschiedenen Stellung als fast
 * perfekt (es gibt keine Gewinnchance mehr zu verlieren); eine Engine der Stufe 1, die nach einem
 * Damenverlust noch 34 Züge weiterspielte, kam so auf 89 % und „etwa 1700“. Darum zählen für die
 * Spielstärke (und das Urteilswort je Phase) nur die Züge bis zum Entscheidungspunkt: der erste
 * Zug, ab dem eine Seite bis zum Ende der Partie mindestens 90 % Gewinnchance behält. Schwankt die
 * Chance später noch einmal unter 90 %, rückt der Punkt nach hinten. Die angezeigte Genauigkeit
 * („wie Lichess / App / chess.com“) bleibt wie bei diesen Seiten über alle Züge.
 * Abhängigkeiten: keine (reine Rechnung auf den Gewinnchancen je Stellung).
 */

/** Ab dieser Gewinnchance (Prozent) einer Seite gilt eine Stellung als entschieden. */
export const DAUERHAFT_ENTSCHIEDEN_AB = 90;
const PROZENT = 100;

/**
 * Wie viele Halbzüge von Anfang an für die Spielstärke zählen.
 *
 * Warum: siehe Dateikopf. Eingaben: Gewinnchance von Weiß je Stellung in Prozent (Startstellung
 * bis Ende, also ein Eintrag mehr als Halbzüge). Ausgabe: Zahl k; die Halbzüge 0 bis k − 1 zählen,
 * auch der Zug, der in die entschiedene Stellung führt. Bleibt die Partie bis zum Ende offen,
 * zählen alle Halbzüge.
 * Beispiel: Chancen 50, 55, 60, 92, 95, 97 (fünf Halbzüge) → 3: Der dritte Halbzug führte zu 92 %,
 * danach blieb es über 90 %; die Halbzüge 4 und 5 zählen nicht.
 * Sonderfall: Ist schon die Startstellung entschieden (etwa ein gewonnenes Endspiel aus einer
 * Abbildung), zählen alle Halbzüge; sonst gäbe es gar keine Schätzung.
 */
export function gewerteteHalbzuege(chancen: readonly number[]): number {
  const halbzuege = Math.max(0, chancen.length - 1);
  let ab = chancen.length;
  for (const seite of [weissEntschieden, schwarzEntschieden]) {
    let k = chancen.length;
    while (k > 0 && seite(chancen[k - 1] ?? 0)) k -= 1;
    if (k < chancen.length) ab = Math.min(ab, k);
  }
  if (ab >= chancen.length) return halbzuege;
  return ab === 0 ? halbzuege : ab;
}

function weissEntschieden(chance: number): boolean {
  return chance >= DAUERHAFT_ENTSCHIEDEN_AB;
}

function schwarzEntschieden(chance: number): boolean {
  return chance <= PROZENT - DAUERHAFT_ENTSCHIEDEN_AB;
}

/**
 * Antworten im Spieler-Durchlauf einordnen: Aufschub („Nicht jetzt.“) und Wiederholung
 * („Noch eine.“).
 *
 * Warum: ausgelagert aus fenster.ts (Größengrenze 400 Zeilen, 20.11.2026). Wer aufschiebt, kommt
 * aus jeder Fragerunde heraus; wer immer wiederholt, spielt endlos Revanche.
 * Abhängigkeiten: keine.
 * Beispiel: schiebtAuf("Nicht jetzt.") → true; wiederholtePartie("Noch eine.") → true.
 */
/** Antworten, mit denen ein Spieler aufschiebt oder ablehnt (wie pipeline/abenteuer/lesefassung-spieler.cjs). */
const AUFSCHUB = [
  "nicht jetzt",
  "gleich",
  "noch nicht",
  "später",
  "ein andermal",
  "noch einen moment",
  "nach dem essen",
  "lieber nicht",
  "morgen",
  "bis morgen",
  "bis später",
  "ich bin zu müde",
  "vielleicht später",
  "weitergehen",
  "liegen lassen",
  "nichts fragen",
  "nicht hinsehen",
  "doch nicht",
  "ich muss weiter",
];
const NUR_GANZ = ["nein", "gehen", "hinausgehen"];
/**
 * Antworten, die dieselbe Partie gleich noch einmal starten. Nachtauftrag 19.11.2026: Nach jedem Sieg
 * gegen Rangerin Hollis war der Spielstand neu, die Zählung je Stand begann von vorn, und der
 * Durchlauf nahm zwanzigmal „Noch eine.“. Jetzt nimmt er solche Antworten auf dieselbe Frage nur
 * einmal im ganzen Lauf.
 */
const WIEDERHOLUNG = ["noch eine", "noch einmal", "noch mal", "revanche"];

/** Startet die Antwort dieselbe Partie gleich noch einmal? Beispiel: „Noch eine.“ → true. */
export function wiederholtePartie(antwort: string): boolean {
  const kern = antwort.toLowerCase().replace(/[„“”"]/g, "");
  return WIEDERHOLUNG.some((a) => kern.startsWith(a));
}

/** Schiebt die Antwort auf oder lehnt sie ab? Beispiel: „Nicht jetzt.“ → true. */
export function schiebtAuf(antwort: string): boolean {
  const kern = antwort
    .toLowerCase()
    .replace(/[„“”"]/g, "")
    .replace(/[.!?…]+$/, "")
    .trim();
  return NUR_GANZ.includes(kern) || AUFSCHUB.some((a) => kern.startsWith(a));
}

/**
 * Wo eine Übung der Trainingsseiten stattfindet: auf Lichess, in der App zum Buch oder am
 * echten Brett. Wunsch des Autors (19.10.2026): Auf den Seiten soll immer klar sein, ob man die
 * App oder eine Website benutzt.
 *
 * Rolle im Gesamtbild: Die Trainingsseiten (trainingsrahmen.ts) setzen vor jede Übung kleine
 * Marken. Die Texte selbst bleiben, wie sie im Buch standen; erkannt wird an Links, Verweisen auf
 * Abbildungen und den Namen der Lichess-Funktionen aus dem Werkzeugkasten (Kapitel 12).
 * Abhängigkeiten: trainingsseiten.ts (Typen).
 */
import type { Trainingsblock, Trainingsteil } from "./trainingsseiten";

export type Uebungsort = "lichess" | "web" | "app" | "brett" | "partie";

/**
 * Namen der Lichess-Funktionen, wie sie Kapitel 12 und die deutsche Lichess-Oberfläche nennen
 * (am 19.10.2026 gegen das Menü von Lichess geprüft).
 */
const LICHESS_FUNKTIONEN = [
  "Lichess",
  "Online-Partie",
  "Aufgabenthemen",
  "Aufgabenübersicht",
  "Analysebrett",
  "Stellung aufbauen",
  "Von hier aus weiterspielen",
  "Computer-Analyse",
  "Lerne aus deinen Fehlern",
  "Partie importieren",
  "Eröffnungsdatenbank",
  "Puzzle Streak",
  "Puzzle Storm",
  "Puzzle Racer",
  "Übertragungen",
  "Lernen →",
  "Studie",
  "Tablebase",
  "Fernschach",
  "Masters",
  "Schach-Einblicke",
  "Nach Eröffnungen",
];

/** Hinweise auf das echte Brett im Text der Übung. */
const BRETT = ["echten Brett", "echtes Brett", "Holzbrett", "am Brett aufgestellt"];

/**
 * Hinweise auf die eigenen Partien, wo immer man spielt: Gewohnheiten wie das Stopp-Ritual
 * (Kapitel 4) oder die Bilanz nach dem Gambit (Kapitel 3).
 */
const PARTIE = ["eigenen Partie", "eigene Partie", "nach der Partie", "Spiele dafür", "im Turnier"];

function teileVon(block: Trainingsblock): readonly Trainingsteil[] {
  if (block.art === "absatz" || block.art === "klein") return block.teile;
  if (block.art === "liste") return block.punkte.flat();
  return [...block.zeilen.flat(2), ...block.unterschrift];
}

/**
 * Die Orte einer Übung in fester Reihenfolge (Lichess, andere Website, App, Brett, eigene
 * Partien).
 *
 * Beispiel aus Kapitel 1: „Schäfermatt … Abb. 1.15 mit ‚Stellung aufbauen‘ …“ → Lichess und App.
 * Sonderfälle: Ein Block ohne Hinweis bekommt keine Marke (etwa der Satz zum Werkzeugkasten);
 * „Lichess“ zählt in jeder Schreibweise; „Online-Partie“ zählt als Lichess, weil das Buch Lichess
 * für alle Online-Übungen nimmt (Kapitel 0); die Marke „eigene Partien“ steht nur, wenn kein
 * anderer Ort genannt ist, damit die Marken nicht überladen.
 */
export function orteDerUebung(block: Trainingsblock): Uebungsort[] {
  const teile = teileVon(block);
  const text = teile.map((t) => t.text).join("");
  const kleinText = text.toLowerCase();
  const links = teile.flatMap((t) => (t.art === "link" && t.ziel ? [t.ziel] : []));
  const nennt = (woerter: readonly string[]) =>
    woerter.some((wort) => kleinText.includes(wort.toLowerCase()));
  const orte: Uebungsort[] = [];
  if (links.some((ziel) => ziel.includes("lichess")) || nennt(LICHESS_FUNKTIONEN))
    orte.push("lichess");
  if (links.some((ziel) => /^https?:/.test(ziel) && !ziel.includes("lichess"))) orte.push("web");
  if (teile.some((t) => t.art === "verweis") || text.includes("in der App")) orte.push("app");
  if (nennt(BRETT)) orte.push("brett");
  if (orte.length === 0 && nennt(PARTIE)) orte.push("partie");
  return orte;
}

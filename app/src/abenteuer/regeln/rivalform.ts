/**
 * Rivale Victor oder Rivalin Victoria (Wunsch des Autors, 22.11.2026: „dasselbe für den Rivalen“).
 *
 * Warum Variablen: Victor spricht und wird besprochen in 18 Dialogen, im Tagebuch, in Quests und
 * im Abspann. Statt jede Stelle doppelt zu schreiben, stehen dort Platzhalter: {rivale} für den
 * Namen, {rv_er}, {rv_ihn}, {rv_ihm}, {rv_sein} (mit Endung: {rv_sein}e) und groß {rv_Er} …,
 * alles Übrige als Ink-Bedingung {rivalin:die Rivalin|der Rivale}. Die Wörter stehen in
 * inhalte/abenteuer/rivalformen.json (dieselbe Datei liest die Gesamtsimulation).
 * Die Wahl liegt als Dialogvariable `rivalin` im Spielstand; so sehen sie Ink, Questbedingungen
 * und die Simulation ohne eigenes Feld.
 * Rolle im Gesamtbild: dialog/geschichte.ts setzt die Formen als Ink-Variablen; texte/texte.ts
 * füllt sie in Spieltexte (modul/abenteuer.tsx verbindet die Quelle).
 * Abhängigkeiten: inhalte/abenteuer/rivalformen.json.
 */
import formen from "../../../../inhalte/abenteuer/rivalformen.json";
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/** Name der Dialogvariable mit der Wahl (true = Rivalin Victoria). */
export const RIVALIN = "rivalin";

/** Die Wörter einer Fassung: Name des Platzhalters → Wort. */
export type Rivalformen = Readonly<Record<string, string>>;

/**
 * Ob der Spielstand die Rivalin gewählt hat. Beispiel: rivalinGewaehlt({ rivalin: true }) → true;
 * ohne Angabe false (Victor, wie im Roman des Autors).
 */
export function rivalinGewaehlt(variablen: Readonly<Record<string, unknown>>): boolean {
  return variablen[RIVALIN] === true;
}

/**
 * Die Wörter der gewählten Fassung. Beispiel: rivalformen(true).rv_sein → „ihr“,
 * rivalformen(false).rivale → „Victor“.
 */
export function rivalformen(rivalin: boolean): Rivalformen {
  return rivalin ? formen.de.rivalin : formen.de.rivale;
}

/**
 * Der Spielstand mit der Wahl Rivale oder Rivalin (Startkarte und Spielmenü).
 * Beispiel: mitRivalwahl(stand, true).dialogvariablen.rivalin → true.
 */
export function mitRivalwahl(stand: Abenteuerstand, rivalin: boolean): Abenteuerstand {
  return { ...stand, dialogvariablen: { ...stand.dialogvariablen, [RIVALIN]: rivalin } };
}

/** Bögen von Victor (victor, victor-pullover) im Paket. */
const VICTORBOGEN = /^figuren\/victor(-[\w-]+)?\.png$/;

/**
 * Der Bogen der Rivalin zu einem Bogen von Victor, sonst null. Bis der Autor Victoria in PixelLab
 * erstellt hat, fehlt er im Paket; dann zeigt die Welt Victors Bogen (weltdaten.ts).
 * Beispiel: rivalinbogen("figuren/victor-pullover.png", true) → "figuren/victoria-pullover.png";
 * rivalinbogen("figuren/juno.png", true) → null; ohne Rivalin immer null.
 */
export function rivalinbogen(sprite: string, rivalin: boolean): string | null {
  const treffer = rivalin ? VICTORBOGEN.exec(sprite) : null;
  return treffer ? `figuren/victoria${treffer[1] ?? ""}.png` : null;
}

/** Sprecher des Rivalen in Ink (#sprecher:victor) und der Rivalin bei den Porträts. */
const RIVALE_SPRECHER = "victor";
const RIVALIN_SPRECHER = "victoria";

/**
 * Wessen Porträt zuerst gesucht wird: in der Rivalin-Fassung für #sprecher:victor die Rivalin
 * (portraets/victoria…), sonst null. Fehlt ihr Porträt (Bilder des Autors stehen noch aus), zeigt der
 * Dialog kein Porträt, nur den Namen „Victoria Hale“: Victors Gesicht wäre der falsche Ersatz
 * (Prüfung 23.11.2026). Ihre Weltbögen victoria und victoria-pullover sind da.
 * Beispiel: rivalinsprecher("victor", true) → "victoria"; rivalinsprecher("juno", true) → null.
 */
export function rivalinsprecher(sprecher: string, rivalin: boolean): string | null {
  return rivalin && sprecher === RIVALE_SPRECHER ? RIVALIN_SPRECHER : null;
}

/** Woher die Wahl kommt (modul/abenteuer.tsx verbindet den Spielstand); ohne Stand Victor. */
let wahlquelle: () => boolean = () => false;

/**
 * Verbindet die Wahl mit dem Spielstand, einmal beim Start des Bausteins. Warum keine React-Hook:
 * Porträt und Spieltexte brauchen sie auch außerhalb des Speicher-Kontexts (Server-Renderer in
 * Tests, Texte ohne Komponente).
 */
export function verbindeRivalwahl(quelle: () => boolean): void {
  wahlquelle = quelle;
}

/** Ob gerade die Rivalin gewählt ist. Beispiel: nach mitRivalwahl(stand, true) → true. */
export function rivalinJetzt(): boolean {
  return wahlquelle();
}

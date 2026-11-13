/**
 * Zugerraten im Halbfinale (Story-Bibel, Szene 106 und Technikliste 34.3; Wunsch des Haupt-Chats,
 * 13.11.2026): Im geführten Moment sieht der Held den Turmzug selbst. Der Spieler soll ihn finden,
 * ob er die Karte Mentor-Zug spielt oder nicht. Solange er sucht, steht seine Uhr; Versuche gibt
 * es beliebig viele; nach drei Fehlversuchen kommt ein Hinweis, der keinen Zug nennt.
 *
 * Rolle im Gesamtbild: reine Regeln ohne React für anbindung/useZugerraten.ts. Welcher Moment das
 * Zugerraten auslöst, steht in begegnungen.json (`zugerraten: true` am Moment). Gesucht ist der
 * beste Zug der Engine in der Stellung, in der der Held nach dem Moment am Zug ist: Die Partie
 * beginnt in der Grundstellung, der Turmzug ist also nicht vorher bekannt.
 * Abhängigkeiten: regeln/partiemomente.ts, spiel/zuege.ts, schach/stellung.ts.
 */
import { parseSquare } from "chessops/util";
import { stellungAusFen } from "../../schach/stellung";
import { sanZuUci } from "../../spiel/zuege";
import { gesprocheneMomente, type Partiemoment, type Partieverlauf } from "./partiemomente";

/** Nach so vielen Fehlversuchen erscheint der Hinweis. */
export const FEHLVERSUCHE_BIS_HINWEIS = 3;

/** Textschlüssel der Hinweise: für einen Turmzug und für jeden anderen Zug. */
export const HINWEIS_TURM = "zugerraten.hinweis.turm";
export const HINWEIS_ALLGEMEIN = "zugerraten.hinweis.allgemein";

/**
 * Läuft das Zugerraten? Ja, wenn ein Moment mit `zugerraten` gesprochen hat und der Held seitdem
 * noch nicht gezogen hat. Ob der Held gerade am Zug ist, prüft der Aufrufer.
 * Beispiel: Moment mit `abZug: 21` spricht nach dem 21. Zug des Helden; bis zu seinem 22. Zug
 * läuft das Zugerraten, danach nie wieder in dieser Partie.
 */
export function zugerratenLaeuft(
  momente: readonly Partiemoment[],
  verlauf: Partieverlauf,
): boolean {
  return gesprocheneMomente(momente, verlauf).some(
    ({ index, halbzug }) =>
      momente[index]?.zugerraten === true && !verlauf.vomHelden.slice(halbzug).some(Boolean),
  );
}

/**
 * Trifft der Versuch den gesuchten Zug? Verglichen wird in UCI, damit Schreibweisen wie „Txf7+“
 * und „Txf7“ gleich zählen. Beispiel: Stellung mit Turm f1, gesucht „f1f7“, Versuch „Txf7+“ → ja.
 */
export function versuchTrifft(fen: string, gesuchtUci: string, san: string): boolean {
  return sanZuUci(fen, san) === gesuchtUci;
}

/**
 * Ist der gesuchte Zug ein Turmzug? Setzt vor dem Momentdialog die Ink-Variable zugerratenTurm,
 * damit der Text („Einen Turm …“) zum Zug passt (Wunsch des Haupt-Chats, 13.11.2026).
 * Beispiel: Turm f1, gesucht „f1f7“ → ja; „h2h3“ → nein; unlesbare Stellung → nein.
 */
export function istTurmzug(fen: string, gesuchtUci: string): boolean {
  const gelesen = stellungAusFen(fen);
  const von = parseSquare(gesuchtUci.slice(0, 2));
  if (!gelesen.ok || von === undefined) return false;
  return gelesen.wert.brett.get(von)?.role === "rook";
}

/**
 * Der Hinweis nach drei Fehlversuchen: beim Turmzug die Frage nach dem Turm, sonst eine
 * allgemeine Frage. Beide nennen keinen Zug und kein Feld.
 */
export function hinweisschluessel(fen: string, gesuchtUci: string): string {
  return istTurmzug(fen, gesuchtUci) ? HINWEIS_TURM : HINWEIS_ALLGEMEIN;
}

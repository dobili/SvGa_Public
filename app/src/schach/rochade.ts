/**
 * Hat eine Seite rochiert? Aus den Zügen bis zur Stellung, nicht nur aus dem Standort des Königs.
 *
 * Rolle im Gesamtbild: Baustein der Phase nach dem Glossar (S17, schach/phase.ts): „Das
 * Mittelspiel beginnt, sobald beide Seiten entwickelt und rochiert haben.“ Ein König, der rochiert
 * hat und danach gejagt wird (Colle–O'Hanlon nach Lxh7+, Lasker–Thomas nach Dxh7+), hat weiter
 * rochiert, auch wenn er nicht mehr am Rand steht.
 * Abhängigkeiten: chessops (Fen), zielbilanz.ts (Standort des Königs), todsuenden.ts (Verlauf).
 * Buchbezug: Anhang, Glossar „Mittelspiel“; Kapitel 1, Eröffnungsziel Königssicherheit.
 */
import { parseFen } from "chessops/fen";
import type { Color } from "chessops/types";
import type { Stellung } from "./stellung";
import type { Verlauf } from "./todsuenden";
import { koenigRochiert } from "./zielbilanz";

/** Rochaden in der Kurznotation, auch mit Null statt O geschrieben. */
const ROCHADE = /^(O-O|0-0)/;

/** Wer zu Beginn des Verlaufs am Zug ist; ohne lesbare FEN Weiß. */
function amZugAmAnfang(startFen: string): Color {
  const gelesen = parseFen(startFen);
  return gelesen.isOk ? gelesen.value.turn : "white";
}

/** Rochiert die Seite im Verlauf, oder stand ihr König schon zu Beginn rochiert? */
function imVerlauf(verlauf: Verlauf, farbe: Color): boolean {
  const gelesen = parseFen(verlauf.startFen);
  if (gelesen.isOk && koenigRochiert(gelesen.value.board, farbe)) return true;
  const erster = amZugAmAnfang(verlauf.startFen);
  return verlauf.zuege.some((zug, i) => {
    const amZug = i % 2 === 0 ? erster : erster === "white" ? "black" : "white";
    return amZug === farbe && ROCHADE.test(zug);
  });
}

/**
 * Hat diese Seite rochiert?
 *
 * Warum: Das Glossar fragt, ob beide Seiten „rochiert haben“, also nach der Geschichte der Partie.
 * Eingaben: Stellung, Farbe, die Züge bis zur Stellung (falls bekannt). Ausgabe: true, wenn der
 * König jetzt rochiert steht oder die Seite im Verlauf rochiert hat.
 * Beispiel: Abb. 11.18 (Lasker–Thomas, schwarzer König nach 8… O-O gejagt) → Schwarz ja,
 * Weiß nein (König e1).
 * Sonderfall: Ohne Verlauf (Lehrbild) zählt allein der Standort des Königs.
 */
export function hatRochiert(stellung: Stellung, farbe: Color, verlauf?: Verlauf): boolean {
  if (koenigRochiert(stellung.brett, farbe)) return true;
  return verlauf !== undefined && imVerlauf(verlauf, farbe);
}

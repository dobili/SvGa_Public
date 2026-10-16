/**
 * Züge in der Notation des Buches schreiben: deutsche Figurenbuchstaben, Zugnummern.
 *
 * Rolle im Gesamtbild: Die Engine liefert Züge als „g1f3“, das Buch schreibt „Sf3“
 * (Konzept 6.2, „zugAlsText“). Die Oberfläche zeigt nur diese Schreibweise.
 * Abhängigkeiten: chessops, i18n.
 * Buchbezug: Kapitel 0, „Wie liest man Schachzüge?“.
 */
import type { Chess } from "chessops/chess";
import { makeSanAndPlay } from "chessops/san";
import { parseUci } from "chessops/util";
import { figurenbuchstaben } from "../i18n/sprache";

/**
 * Ersetzt die englischen Figurenbuchstaben einer SAN-Angabe durch die der Sprache.
 *
 * Beispiel: „Qb6“ → „Db6“ (Abb. 1.26), „exd8=Q+“ → „exd8=D+“. Rochade und Bauernzüge bleiben.
 */
export function sanInSprache(san: string, sprachcode: string): string {
  const buchstaben = figurenbuchstaben(sprachcode);
  return san.replace(/[KQRBN]/g, (b) => buchstaben[b] ?? b);
}

/**
 * Schreibt eine Zugfolge in der Notation des Buches.
 *
 * Warum: Die besten Züge der Engine sollen so aussehen wie die Züge im Buch.
 * Eingaben: Stellung mit Regeln, Züge in UCI-Schreibweise, Sprache, höchstens so viele Halbzüge.
 * Ausgabe: Text wie „6. Le2 Sh6 7. b4“, bei Schwarz am Zug beginnend mit „6... cxd4“.
 * Beispiel: Abb. 1.28 (Schwarz am Zug), [„c8d7“] → „7... Ld7“.
 * Sonderfälle: Ein ungültiger Zug beendet die Folge an dieser Stelle; die Stellung selbst bleibt
 * unverändert, weil auf einer Kopie gezogen wird.
 */
export function zugfolgeAlsText(
  stellung: Chess,
  uciZuege: readonly string[],
  sprachcode: string,
  hoechstens = Number.POSITIVE_INFINITY,
): string {
  const kopie = stellung.clone();
  const teile: string[] = [];
  for (const uci of uciZuege.slice(0, hoechstens)) {
    const zug = parseUci(uci);
    if (!zug || !kopie.isLegal(zug)) {
      break;
    }
    const nummer = kopie.fullmoves;
    if (kopie.turn === "white") {
      teile.push(`${nummer}.`);
    } else if (teile.length === 0) {
      teile.push(`${nummer}...`);
    }
    teile.push(sanInSprache(makeSanAndPlay(kopie, zug), sprachcode));
  }
  return teile.join(" ");
}

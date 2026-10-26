/**
 * Zug erraten: der Stand einer Aufgabe (Züge, Treffer, letzter Rateversuch, Hinweis, Blättern,
 * Analyse) und das Raten selbst.
 *
 * Rolle im Gesamtbild: Logik hinter Zugerratenaufgabe.tsx. Ein Treffer mit Hinweis zählt als
 * Versuch, aber nicht als Treffer (R45). Am Ende der Partie beantwortet der Stand die Runde und
 * speichert den Durchgang (speicher/trainerverlauf.ts).
 * Abhängigkeiten: training/repertoiretrainer.ts, training/studientrainer.ts, speicher, React.
 */
import { useState } from "react";
import { aendere } from "../../speicher/speicher";
import { mitRatedurchgang } from "../../speicher/trainerverlauf";
import {
  anfang,
  istBuchzug,
  mitAntwort,
  type Repertoireaufgabe as Aufgabe,
} from "../../training/repertoiretrainer";
import { gutGeraten, type Ratestand } from "../../training/studientrainer";
import { stellungNach } from "../../training/uebungsaufgabe";
import type { Fehlversuch } from "./useRatevergleich";
import type { Runde } from "./useRunde";
import type { Rateversuch } from "./Zugkommentare";

/**
 * Kennung einer Partie für den Verlauf: Titel und Seite des Lesers (die Aufgaben haben keine
 * eigene Kennung). Beispiel: „Opernpartie (white)“.
 */
export function partieKennung(aufgabe: Aufgabe): string {
  return `${aufgabe.titel} (${aufgabe.seite})`;
}

/** Speichert einen beendeten Durchgang (Fehler beim Speichern meldet speicher.ts selbst). */
function speichereDurchgang(partie: string, stand: Ratestand): void {
  const eintrag = { datum: new Date().toISOString(), ...stand };
  void aendere((d) => ({ ...d, zugErraten: mitRatedurchgang(d.zugErraten, partie, eintrag) }));
}

/** Der Stand der Aufgabe: Züge, Treffer, letzter Versuch, Hinweis, Blättern und Analyse. */
export function useRatestand(aufgabe: Aufgabe, runde: Runde) {
  const [zuege, setzeZuege] = useState<readonly string[]>(() => anfang(aufgabe));
  const [stand, setzeStand] = useState<Ratestand>({ versuche: 0, treffer: 0 });
  const [versuch, setzeVersuch] = useState<Rateversuch | null>(null);
  const [hinweis, setzeHinweis] = useState(false);
  const [stelle, setzeStelle] = useState<number | null>(null);
  const [analyse, setzeAnalyse] = useState<readonly string[] | null>(null);
  const fen = stellungNach(aufgabe.startFen, zuege);
  const rate = (san: string) => {
    const index = zuege.length;
    const partie = aufgabe.linie[index] ?? "";
    const getroffen = istBuchzug(aufgabe, index, san);
    const neuerStand = {
      versuche: stand.versuche + 1,
      treffer: stand.treffer + (getroffen && !hinweis ? 1 : 0),
    };
    const fehlversuch: Fehlversuch | null = getroffen
      ? null
      : { vorherFen: fen, eigen: san, partie };
    const davorFen = index > 0 ? stellungNach(aufgabe.startFen, zuege.slice(0, -1)) : null;
    setzeVersuch({
      index,
      vorherFen: fen,
      davorFen,
      eigen: san,
      partie,
      getroffen,
      mitHinweis: hinweis,
      fehlversuch,
    });
    const neu = mitAntwort(aufgabe, zuege);
    setzeStand(neuerStand);
    setzeZuege(neu);
    setzeHinweis(false);
    if (neu.length >= aufgabe.linie.length) {
      runde.beantworte(gutGeraten(neuerStand));
      speichereDurchgang(partieKennung(aufgabe), neuerStand);
    }
  };
  return {
    zuege,
    stand,
    versuch,
    hinweis,
    setzeHinweis,
    stelle,
    setzeStelle,
    analyse,
    setzeAnalyse,
    fen,
    rate,
  };
}

/** Der Stand, wie Zugerratenaufgabe.tsx ihn bekommt. */
export type Ratezustand = ReturnType<typeof useRatestand>;

/**
 * Stufen im Schach-Röntgen-Trainer: leicht, mittel, schwer nach der Zahl der Pfeile, dazu
 * Stellungen aus den Partien und Zugfolgen des Buches.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (30.10.2026): Meist gab es nur ein Schach oder einen
 * Schlag zu finden, der Trainer war zu leicht. Die Stufe misst, wie viel man gleichzeitig sehen
 * muss: leicht 2 bis 3 Pfeile, mittel 4 bis 6, schwer 7 bis 10, verteilt auf mindestens zwei
 * Schritte mit je zwei Pfeilen. Die Abbildungen sind oft ruhige Lehrstellungen; volle Stellungen
 * liefern die Hauptvarianten der Zugfolgen des Buches (ab Zug 8), damit bleibt das Buch die
 * einzige Quelle.
 * Abhängigkeiten: training/roentgentrainer.ts, training/uebungsaufgabe.ts, daten/laden.ts.
 * Buchbezug: Kapitel 1, „Dein eingebauter Fehler-Radar: die Schach-Röntgen-Regel“.
 */
import type { Kapitel } from "../daten/generiert/kapitel";
import type { Knoten } from "../daten/generiert/beispiel";
import { stellungAusFen } from "../schach/stellung";
import type { Buchstellung } from "./buchstellungen";
import { roentgenaufgabe, SCHRITTE, type Roentgenaufgabe } from "./roentgentrainer";
import { stellungNach } from "./uebungsaufgabe";
import { mische, type Zufall } from "./zufall";

export type Roentgenstufe = "leicht" | "mittel" | "schwer";
export const ROENTGENSTUFEN: readonly Roentgenstufe[] = ["leicht", "mittel", "schwer"];

/** Bis zu so vielen Pfeilen ist eine Aufgabe leicht, bis zu MITTEL_BIS mittel. */
const LEICHT_BIS = 3;
const MITTEL_BIS = 6;
/** Schwer heißt auch: mindestens zwei Schritte mit je mindestens zwei Pfeilen. */
const SCHWER_SCHRITTE = 2;
const SCHWER_JE_SCHRITT = 2;
/** Stellungen aus Zugfolgen erst ab diesem Zug (die Eröffnung ist dann meist vorbei). */
const ZUGFOLGE_AB_ZUG = 8;
/** Halbzüge je Zug. */
const HALBZUEGE_JE_ZUG = 2;

/**
 * Die Stufe einer Röntgen-Aufgabe.
 * Beispiel: zwei Schachs und ein Schlag → 3 Pfeile → leicht.
 * Sonderfall: 7 bis 10 Pfeile, aber fast alle in einem Schritt → mittel.
 */
export function roentgenstufe(aufgabe: Roentgenaufgabe): Roentgenstufe {
  const jeSchritt = SCHRITTE.map((s) => aufgabe.schritte[s].verlangt.length);
  const summe = jeSchritt.reduce((a, b) => a + b, 0);
  if (summe <= LEICHT_BIS) return "leicht";
  const verteilt = jeSchritt.filter((n) => n >= SCHWER_JE_SCHRITT).length >= SCHWER_SCHRITTE;
  return summe > MITTEL_BIS && verteilt ? "schwer" : "mittel";
}

/** Die Züge der Hauptvariante eines Zugbaums (immer die erste Fortsetzung). */
function hauptlinie(zuege: readonly Knoten[]): string[] {
  const linie: string[] = [];
  let knoten = zuege[0];
  while (knoten) {
    linie.push(knoten.zug);
    knoten = knoten.weiter[0];
  }
  return linie;
}

/**
 * Stellungen aus den Hauptvarianten der Zugfolgen aller Kapitel, ab Zug 8, ohne doppelte Bretter.
 * Die Nummer ist die Kennung der Zugfolge; Titel und Zug stehen in `zugfolge` (für die
 * Beschriftung „Stellung aus der Zugfolge „Spanische Partie“ nach dem 12. Zug“).
 */
export function zugfolgenstellungen(kapitel: readonly Kapitel[]): Buchstellung[] {
  const gesehen = new Set<string>();
  const ergebnis: Buchstellung[] = [];
  for (const k of kapitel) {
    for (const beispiel of k.beispiele) {
      const linie = hauptlinie(beispiel.zuege);
      for (let halbzug = ZUGFOLGE_AB_ZUG * HALBZUEGE_JE_ZUG; halbzug <= linie.length; halbzug++) {
        const fen = stellungNach(beispiel.startFen, linie.slice(0, halbzug));
        const brett = fen.split(" ")[0] ?? "";
        const gelesen = stellungAusFen(fen);
        if (gesehen.has(brett) || !gelesen.ok || !gelesen.wert.regeln) continue;
        gesehen.add(brett);
        const zug = Math.ceil(halbzug / HALBZUEGE_JE_ZUG);
        ergebnis.push({
          nummer: beispiel.id,
          kapitel: k.kapitel,
          stellung: gelesen.wert,
          zugfolge: { titel: beispiel.titel, zug },
        });
      }
    }
  }
  return ergebnis;
}

/**
 * Eine Runde Röntgen-Aufgaben einer Stufe (oder gemischt, Stufe null), zufällig aus allen
 * Stellungen. Rechnet nur so viele Stellungen, bis die Runde voll ist.
 */
export function roentgenrundeNachStufe(
  stellungen: readonly Buchstellung[],
  stufe: Roentgenstufe | null,
  anzahl: number,
  zufall: Zufall,
): Roentgenaufgabe[] {
  const runde: Roentgenaufgabe[] = [];
  for (const buch of mische(stellungen, zufall)) {
    const aufgabe = roentgenaufgabe(buch);
    if (aufgabe && (stufe === null || roentgenstufe(aufgabe) === stufe)) runde.push(aufgabe);
    if (runde.length >= anzahl) break;
  }
  return runde;
}

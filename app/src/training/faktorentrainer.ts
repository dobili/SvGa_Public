/**
 * Faktorenbilanz-Trainer (Kapitel 3): je Faktor sagen, wer vorn liegt, und mit der App vergleichen.
 *
 * Rolle im Gesamtbild: Trainer „faktorenbilanz“ (Pflichtenheft 7, AP 13). Der Leser stellt die
 * Waage für Material und Zeit und sagt, wer bei Königssicherheit und Aktivität besser steht
 * (Weiß, gleich oder Schwarz). Die richtige Antwort liefert dieselbe Rechnung wie das Werkzeug
 * „Faktorenbilanz“ (analyse/k3-faktorenbilanz.ts, faktorwertungen). Stellungen im Schach oder
 * mit entschiedener Partie fallen weg (dort steht im Werkzeug erst die Taktik). Reine Funktionen.
 * Abhängigkeiten: analyse/k3-faktorenbilanz.ts, analyse/faktorenschach.ts, training/zufall.ts.
 * Buchbezug: Kapitel 3, „Kompensation messen statt fühlen: die Faktorenbilanz“.
 */
import type { Color } from "chessops/types";
import { entschieden } from "../analyse/faktorenschach";
import { faktorwertungen } from "../analyse/k3-faktorenbilanz";
import type { Einschaetzung } from "../schach/faktoreinschaetzung";
import type { Buchstellung } from "./buchstellungen";
import { mische, type Zufall } from "./zufall";

/** Die vier Faktoren in Buchreihenfolge. */
export const FAKTOREN = ["material", "zeit", "koenig", "aktivitaet"] as const;
export type Faktor = (typeof FAKTOREN)[number];
/** Wer bei einem Faktor vorn liegt; „gleich“, wenn keiner. */
export type Vorn = Color | "gleich";
export const ANTWORTEN: readonly Vorn[] = ["white", "gleich", "black"];

/** Kapitel mit Gambits und Faktorenbilanzen. */
const KAPITEL = new Set([3]);
const RANG: Readonly<Record<Einschaetzung, number>> = { gut: 2, teils: 1, schlecht: 0 };

export type Faktorantwort = Readonly<Record<Faktor, Vorn>>;

export interface Faktorenaufgabe {
  readonly nummer: string;
  readonly fen: string;
  readonly loesung: Faktorantwort;
}

function vergleiche(weiss: Einschaetzung, schwarz: Einschaetzung): Vorn {
  const unterschied = RANG[weiss] - RANG[schwarz];
  if (unterschied === 0) return "gleich";
  return unterschied > 0 ? "white" : "black";
}

/**
 * Die Aufgabe zu einer Buchstellung, oder null (anderes Kapitel, Lehrbild, Schach, entschieden).
 *
 * Beispiel: Abb. 3.10 (Muzio-Gambit): Material Schwarz, Zeit Weiß, Königssicherheit Weiß.
 */
export function faktorenaufgabe(buch: Buchstellung): Faktorenaufgabe | null {
  const { stellung } = buch;
  if (!KAPITEL.has(buch.kapitel) || !stellung.regeln) return null;
  if (stellung.regeln.isCheck() || entschieden(stellung)) return null;
  const w = faktorwertungen(stellung, "white");
  return {
    nummer: buch.nummer,
    fen: stellung.fen,
    loesung: {
      material: w.material.vorn ?? "gleich",
      zeit: w.zeit.vorn ?? "gleich",
      koenig: vergleiche(w.koenig.eigen.wertung, w.koenig.gegner.wertung),
      aktivitaet: vergleiche(w.aktivitaet.eigen.wertung, w.aktivitaet.gegner.wertung),
    },
  };
}

/** Eine Runde aus zufälligen passenden Stellungen. */
export function faktorenrunde(
  stellungen: readonly Buchstellung[],
  anzahl: number,
  zufall: Zufall,
): Faktorenaufgabe[] {
  const passende = stellungen.flatMap((b) => faktorenaufgabe(b) ?? []);
  return mische(passende, zufall).slice(0, anzahl);
}

/** Die Faktoren, bei denen die Antwort von der Rechnung der App abweicht. */
export function falscheFaktoren(aufgabe: Faktorenaufgabe, antwort: Faktorantwort): Faktor[] {
  return FAKTOREN.filter((f) => antwort[f] !== aufgabe.loesung[f]);
}

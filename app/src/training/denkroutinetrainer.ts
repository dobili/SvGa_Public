/**
 * Denkroutine-Trainer (Kapitel 12): eine feste Minute in einer Stellung, dann zwei Kandidatenzüge
 * und je die stärkste Antwort des Gegners; die App prüft, ob zu jedem Kandidaten eine Antwort
 * steht, und vergleicht mit der Engine.
 *
 * Rolle im Gesamtbild: Trainer „denkroutine“ (Pflichtenheft 5.3, AP 13 Stufe 3). Die Stellungen
 * stammen aus dem Buch (Kapitel 7, 11 und 12: Taktik, Meisterpartien, Denkroutine), nur solche
 * mit beiden Königen, ohne Schach, mit mindestens zehn Steinen und einigen Zügen zur Wahl. Die
 * Züge zieht der Leser am Brett (seit 0.2.117, Denkeingabe.tsx); gelesen werden sie hier als
 * Kurznotation, auch in der Notation des Buches. Rechnen tut die Engine in ui/trainer/useDenkvergleich.ts; hier stehen die reinen
 * Teile: Stellungen, Lesen der Eingaben, Urteil.
 * Abhängigkeiten: training/uebungsaufgabe.ts (zuegeAusText), spiel/zuege.ts, chessops,
 * training/zufall.ts.
 * Buchbezug: Kapitel 12, Denkroutine Schritt 2 und 3 (Kandidaten und stärkste Antwort).
 */
import { makeSan, parseSan } from "chessops/san";
import type { Buchstellung } from "./buchstellungen";
import { zuegeAusText } from "./uebungsaufgabe";
import { fenNach, regelstellung } from "../spiel/zuege";
import { mische, type Zufall } from "./zufall";

/** Feste Denkzeit in Sekunden (Kapitel 12: eine Minute). */
export const DENKZEIT_S = 60;
/** So viele Kandidaten mit Antwort fragt die Aufgabe ab. */
export const KANDIDATEN = 2;
/** Gut, wenn der bessere eigene Kandidat höchstens so viel schlechter ist als der Engine-Zug. */
export const VERLUST_GRENZE = 0.5;
const KAPITEL = new Set([7, 11, 12]);
const MINDESTENS_STEINE = 10;
const MINDESTENS_ZUEGE = 8;

export interface Denkaufgabe {
  readonly nummer: string;
  readonly fen: string;
}

/**
 * Die Aufgabe zu einer Buchstellung, oder null (anderes Kapitel, Schach, zu wenig Steine).
 * Beispiel: Abb. 12.1 (griechisches Geschenk, Weiß am Zug) → Aufgabe.
 */
export function denkaufgabe(buch: Buchstellung): Denkaufgabe | null {
  const regeln = buch.stellung.regeln;
  if (!KAPITEL.has(buch.kapitel) || !regeln || regeln.isCheck() || regeln.isEnd()) return null;
  if (buch.stellung.brett.occupied.size() < MINDESTENS_STEINE) return null;
  let zuege = 0;
  for (const ziele of regeln.allDests().values()) zuege += ziele.size();
  return zuege < MINDESTENS_ZUEGE ? null : { nummer: buch.nummer, fen: buch.stellung.fen };
}

/** Eine Runde aus zufälligen passenden Stellungen. */
export function denkrunde(
  stellungen: readonly Buchstellung[],
  anzahl: number,
  zufall: Zufall,
): Denkaufgabe[] {
  return mische(
    stellungen.flatMap((b) => denkaufgabe(b) ?? []),
    zufall,
  ).slice(0, anzahl);
}

/** Ein Zug aus der Eingabe des Lesers in einer Stellung: Kurznotation wie chessops, oder null. */
function liesZug(fen: string, eingabe: string): { san: string; fenDanach: string } | null {
  const pos = regelstellung(fen);
  const [roh] = zuegeAusText(eingabe.trim());
  const zug = pos && roh ? parseSan(pos, roh) : undefined;
  if (!pos || !zug) return null;
  const san = makeSan(pos, zug);
  const fenDanach = fenNach(fen, san);
  return fenDanach ? { san, fenDanach } : null;
}

/** Ergebnis der Prüfung je Kandidat. */
export type Kandidatpruefung =
  | { readonly art: "leer" }
  | { readonly art: "kandidatUngueltig"; readonly eingabe: string }
  | { readonly art: "antwortFehlt"; readonly kandidat: string }
  | { readonly art: "antwortUngueltig"; readonly kandidat: string; readonly eingabe: string }
  | {
      readonly art: "vollstaendig";
      readonly kandidat: string;
      readonly antwort: string;
      /** Stellung nach dem Kandidaten (für die stärkste Antwort der Engine). */
      readonly fenDanach: string;
    };

/**
 * Prüft einen Kandidaten mit Antwort: Sind beide Züge da und regelgerecht?
 *
 * Regel: Kapitel 12, Denkroutine: zu jedem Kandidaten die stärkste Antwort des Gegners.
 * Beispiel: Abb. 12.1, „Lxh7+“ und „Kxh7“ → vollständig; „Lxh7+“ ohne Antwort → antwortFehlt.
 * Sonderfall: Ein Kandidat, der matt oder patt setzt, ist ohne Antwort vollständig (antwort „“).
 */
export function pruefeKandidat(fen: string, kandidat: string, antwort: string): Kandidatpruefung {
  if (kandidat.trim() === "") return { art: "leer" };
  const k = liesZug(fen, kandidat);
  if (!k) return { art: "kandidatUngueltig", eingabe: kandidat.trim() };
  if (antwort.trim() === "") {
    // Setzt der Kandidat matt oder patt, gibt es keine Antwort: vollständig ohne Antwort.
    if (regelstellung(k.fenDanach)?.isEnd()) {
      return { art: "vollstaendig", kandidat: k.san, antwort: "", fenDanach: k.fenDanach };
    }
    return { art: "antwortFehlt", kandidat: k.san };
  }
  const a = liesZug(k.fenDanach, antwort);
  if (!a) return { art: "antwortUngueltig", kandidat: k.san, eingabe: antwort.trim() };
  return { art: "vollstaendig", kandidat: k.san, antwort: a.san, fenDanach: k.fenDanach };
}

/** Die Rechnung der Engine, aus Sicht der Seite am Zug (Bauerneinheiten). */
export interface Denkvergleich {
  readonly besterZug: string;
  readonly besterWert: number;
  /** Je Kandidat (Kurznotation) sein Wert und die stärkste Antwort der Engine. */
  readonly kandidaten: readonly {
    readonly zug: string;
    readonly wert: number;
    readonly antwort: string | null;
  }[];
}

/**
 * Gilt die Aufgabe als gelöst? Beide Kandidaten vollständig, und der bessere liegt höchstens
 * 0,5 Bauern hinter dem Zug der Engine.
 * Beispiel: Engine +2,0 mit Lxh7+, Kandidaten Lxh7+ (+2,0) und Dc2 (+0,3) → gelöst.
 */
export function geloest(
  pruefungen: readonly Kandidatpruefung[],
  vergleich: Denkvergleich | null,
): boolean {
  const vollstaendig = pruefungen.filter((p) => p.art === "vollstaendig").length === KANDIDATEN;
  if (!vollstaendig || !vergleich) return false;
  const bester = Math.max(...vergleich.kandidaten.map((k) => k.wert));
  return vergleich.besterWert - bester <= VERLUST_GRENZE;
}

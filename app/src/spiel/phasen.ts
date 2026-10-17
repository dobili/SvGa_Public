/**
 * Phasen einer Partie je Stellung: Eröffnung, Mittelspiel, Endspiel, mit den Übergängen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (17.10.2026): In der Verlaufskurve stehen die Übergänge
 * als senkrechte Linien, die Spielstärke wird je Phase gerechnet, und die Stärke der Engine folgt
 * der Phase. Die Regel ist die des Werkzeugs „Welche Phase, welches Werkzeug?“ (Kapitel 11,
 * schach/phase.ts): Eröffnung, solange eine Seite zwei oder mehr Leichtfiguren zu Hause hat;
 * Endspiel, sobald die Endspielfragen aus Kapitel 8 überwiegend Ja ergeben; dazwischen
 * Mittelspiel. Damit die Phase in einer Partie nicht zurückspringt (eine Rückentwicklung macht
 * aus dem Mittelspiel keine Eröffnung), gilt eine Phase ab ihrem ersten Auftreten.
 * Abhängigkeiten: schach/phase.ts, analyse/stellungsprofil.ts, schach/stellung.ts, spiel/partie.ts.
 */
import { profil } from "../analyse/stellungsprofil";
import { phase, type Phase, type Phasenbefund } from "../schach/phase";
import { stellungAusFen } from "../schach/stellung";
import { stellungen, type Partie } from "./partie";

export type { Phase };

/** Reihenfolge der Phasen für den Vergleich. */
const RANG: Readonly<Record<Phase, number>> = { eroeffnung: 0, mittelspiel: 1, endspiel: 2 };
export const PHASEN: readonly Phase[] = ["eroeffnung", "mittelspiel", "endspiel"];

/**
 * Die Phase einer Stellung; null bei unlesbarer Stellung oder ohne Könige.
 * Beispiel: Grundstellung → Eröffnung; Abb. 8.1 (nur Könige und Bauern) → Endspiel.
 */
export function phaseVon(fen: string): Phase | null {
  return phasenbefundVon(fen)?.phase ?? null;
}

/** Der ganze Befund zur Phase einer Stellung (mit Grund); null bei unlesbarer Stellung. */
export function phasenbefundVon(fen: string): Phasenbefund | null {
  const stellung = stellungAusFen(fen);
  if (!stellung.ok) return null;
  const p = profil(stellung.wert);
  return phase(stellung.wert, p.angriffskarte, p.drohungen);
}

/**
 * Die Phase je Stellung der Partie (Startstellung bis Ende), nie rückwärts.
 * Beispiel: 1. e4 e5 … bis zum Abtausch der Damen und Leichtfiguren: Eröffnung, dann
 * Mittelspiel, dann Endspiel; eine Stellung ohne Phase übernimmt die vorige.
 */
export function phasenJeStellung(partie: Partie): Phase[] {
  let bisher: Phase = "eroeffnung";
  return stellungen(partie).map((fen) => {
    const jetzt = phaseVon(fen);
    if (jetzt && RANG[jetzt] > RANG[bisher]) bisher = jetzt;
    return bisher;
  });
}

/** Die Stelle (Index der Stellung), ab der eine Phase gilt; null, wenn sie nicht erreicht wird. */
export function phasenwechsel(phasen: readonly Phase[]): Readonly<Record<Phase, number | null>> {
  const erste = (ph: Phase) => {
    const i = phasen.indexOf(ph);
    return i < 0 ? null : i;
  };
  return { eroeffnung: 0, mittelspiel: erste("mittelspiel"), endspiel: erste("endspiel") };
}

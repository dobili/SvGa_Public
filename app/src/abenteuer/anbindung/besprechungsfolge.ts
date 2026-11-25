/**
 * Die Folge, die die Besprechung auf Wunsch vorspielt („Soll ich es dir zeigen?“, Wunsch des
 * Autors, 26.11.2026; Entwurf docs/spiel/auftraege/partiebesprechung_25-11.md, Abschnitt 10).
 *
 * Rolle im Gesamtbild: reine Rechnung aus dem gespeicherten Eintrag (beste Züge und Hauptvarianten
 * der Auswertung, ohne neue Engine-Rechnung) für anbindung/Zeigefolge.tsx. Bei Fehlern, Patzern,
 * ungenauen Zügen und verpassten Chancen ist es der bessere Weg aus der Stellung vor dem Zug; beim
 * Fehler des Gegners die beste Antwort des Helden; beim brillanten Zug ab Stufe 2 die Fortsetzung
 * des gespielten Zuges. Die Länge regelt regeln/zeigefolge.ts.
 * Abhängigkeiten: regeln/zeigefolge.ts, spiel/erklaerung.ts (widerlegungAus), spiel/zuege.ts,
 * schach/weiterspielen.ts (zugFelder), schach/notation.ts, spiel/partie.ts.
 */
import { sprache } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { zugFelder } from "../../schach/weiterspielen";
import { widerlegungAus } from "../../spiel/erklaerung";
import { stellungen } from "../../spiel/partie";
import { fenNach, uciZuSan } from "../../spiel/zuege";
import type { Partieeintrag } from "../../speicher/partien";
import type { Besprechungsstufe } from "../regeln/besprechung";
import type { Besprechungsmoment, Momentkategorie } from "../regeln/besprechungsmomente";
import { zeigelaenge } from "../regeln/zeigefolge";

/** Ein Halbzug der gezeigten Folge: Stellung danach, Felder für die Hervorhebung, Text. */
export interface Zeigeschritt {
  readonly fen: string;
  readonly von: string;
  readonly nach: string;
  /** Der Zug in der Sprache des Spiels („Sxe5“). */
  readonly zug: string;
}

/** Die ganze Folge eines Moments: Stellung am Anfang, Halbzüge, ob es der bessere Weg ist. */
export interface Zeigefolge {
  readonly start: string;
  readonly schritte: readonly Zeigeschritt[];
  /** true: der bessere Weg; false: die Fortsetzung des gespielten (brillanten) Zuges. */
  readonly besser: boolean;
}

/** Kategorien mit einem besseren Weg. */
const MIT_BESSEREM_WEG: ReadonlySet<Momentkategorie> = new Set<Momentkategorie>([
  "fehler",
  "patzer",
  "verpasst",
  "ungenau",
  "gegnerfehler",
]);
/** Ab dieser Stufe zeigt die Besprechung auch, wie es nach einem brillanten Zug weitergeht. */
const BRILLANT_AB: Besprechungsstufe = 2;

/** Die Folge in UCI als Halbzüge mit Stellung, Feldern und SAN; bricht beim ersten falschen Zug ab. */
function schritteAus(
  fen: string,
  folge: readonly string[],
): { san: string; schritt: Zeigeschritt }[] {
  const liste: { san: string; schritt: Zeigeschritt }[] = [];
  let stand = fen;
  for (const uci of folge) {
    const san = uciZuSan(stand, uci);
    const felder = san ? zugFelder(stand, san) : null;
    const danach = san ? fenNach(stand, san) : null;
    if (!san || !felder || !danach) break;
    liste.push({ san, schritt: { fen: danach, ...felder, zug: sanInSprache(san, sprache()) } });
    stand = danach;
  }
  return liste;
}

/**
 * Die Folge, die die Besprechung zu einem Moment zeigen kann, oder null.
 * Beispiel: Patzer 3... Sf6?? im Schäfermatt, besser 3... De7 mit Folge De7 Sf3 Sf6 → Stufe 1
 * zeigt De7, Stufe 2 De7 Sf3, Stufe 3 alle drei Halbzüge.
 * Sonderfälle: Theorie, starke Züge, ohne gespeicherte Folge oder wenn der beste Zug der gespielte
 * war (außer beim brillanten Zug) → null.
 */
export function zeigefolge(
  eintrag: Partieeintrag,
  moment: Besprechungsmoment,
  stufe: Besprechungsstufe,
): Zeigefolge | null {
  const i = moment.index;
  const brillant = moment.kategorie === "brillant" && stufe >= BRILLANT_AB;
  if (!brillant && !MIT_BESSEREM_WEG.has(moment.kategorie)) return null;
  const stelle = moment.kategorie === "gegnerfehler" ? i + 1 : i;
  const fen = stellungen(eintrag.partie)[stelle];
  if (!fen) return null;
  const alle = schritteAus(fen, widerlegungAus(eintrag.beste[stelle], eintrag.varianten[stelle]));
  const gespielt = stelle === i && alle[0]?.san === eintrag.partie.zuege[i]?.san;
  if (brillant !== gespielt) return null;
  const halbzuege = alle.map((h) => ({ schlag: h.san.includes("x"), matt: h.san.endsWith("#") }));
  const anzahl = zeigelaenge(stufe, halbzuege);
  if (anzahl === 0) return null;
  return { start: fen, schritte: alle.slice(0, anzahl).map((h) => h.schritt), besser: !brillant };
}

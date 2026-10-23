/**
 * Lernsammlung (Kapitel 12): eigene Stellungen mit Notiz und einem Plan-Satz, geordnet nach
 * Eröffnung, mit Abfrage und Ausgabe als PGN für eine Lichess-Studie.
 *
 * Rolle im Gesamtbild: Pflichtenheft Stufe 3 (AP 15), Konzept 4.7 („Lernsammlung“ in den
 * Nutzerdaten). Die Einträge liegen in den Nutzerdaten (speicher/format.ts, Feld „sammlung“ ab
 * Format 5) und ziehen mit der Datensicherung um. Ein Eintrag kommt aus einer Abbildung, aus
 * dem Rückblick einer Partie, aus einer Trainer-Aufgabe oder als FEN von Hand. Die Eröffnung
 * bestimmt die App beim Speichern (Buchvarianten aus Kapitel 2 und 3, sonst die Lichess-Liste);
 * der Leser darf sie ändern. Reine Funktionen.
 * Abhängigkeiten: schach/eroeffnungsindex.ts, schach/eroeffnungsnamen.ts,
 * schach/weiterspielen.ts.
 * Buchbezug: Kapitel 12, Abschnitt 12.4 „Lernsammlung“ (wichtigste Stellungen, Varianten und
 * Pläne sammeln; bei Lichess heißt die passende Funktion „Studien“).
 */
import { stellungsschluessel, type Eroeffnungsindex } from "../schach/eroeffnungsindex";
import { bekannteEroeffnung } from "../schach/eroeffnungsnamen";
import { fenNachZuegen } from "../schach/weiterspielen";

/** Woher ein Eintrag stammt. */
export const HERKUENFTE = ["abbildung", "partie", "trainer", "fen"] as const;
export type Herkunft = (typeof HERKUENFTE)[number];

/** Start und Züge (englische Kurznotation) bis zur gesammelten Stellung. */
export interface Sammelverlauf {
  readonly startFen: string;
  readonly zuege: readonly string[];
}

/** Ein Eintrag der Lernsammlung. */
export interface Sammeleintrag {
  readonly id: string;
  /** Wann gespeichert, ISO 8601. */
  readonly datum: string;
  readonly fen: string;
  readonly herkunft: Herkunft;
  /** Fundstelle: Abbildungsnummer („1.26“), Kennung des Trainers, sonst leer. */
  readonly quelle: string;
  /** Eröffnung, nach der die Sammlung ordnet; leer, wenn keine bekannt ist. */
  readonly eroeffnung: string;
  /** Ein Satz: der Plan in dieser Stellung. */
  readonly plan: string;
  /** Freie Notiz des Lesers. */
  readonly notiz: string;
  /** Der Weg zur Stellung, wenn bekannt (Abbildung mit Zugfolge, Partie). */
  readonly verlauf?: Sammelverlauf;
}

/** Höchstens so viele Einträge; ältere fallen weg, damit der Speicher klein bleibt. */
export const HOECHSTENS_SAMMLUNG = 1000;
export const PLAN_HOECHSTENS = 200;
export const NOTIZ_HOECHSTENS = 1000;
export const EROEFFNUNG_HOECHSTENS = 100;
/** Längster gespeicherter Weg (Halbzüge), damit eine lange Partie die Sammlung nicht aufbläht. */
const VERLAUF_HOECHSTENS = 300;
export const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

type Roh = Record<string, unknown>;
const istObjekt = (w: unknown): w is Roh =>
  typeof w === "object" && w !== null && !Array.isArray(w);
const text = (w: unknown, laenge: number): string =>
  typeof w === "string" ? w.slice(0, laenge) : "";

function verlaufAus(roh: unknown): Sammelverlauf | null {
  if (!istObjekt(roh) || typeof roh.startFen !== "string" || !Array.isArray(roh.zuege)) {
    return null;
  }
  const zuege = roh.zuege.filter((z): z is string => typeof z === "string");
  if (zuege.length !== roh.zuege.length) return null;
  return { startFen: roh.startFen, zuege: zuege.slice(0, VERLAUF_HOECHSTENS) };
}

/** Ein Eintrag aus Rohdaten, oder null, wenn Kennung, Datum oder Stellung fehlen. */
function eintragAus(roh: unknown): Sammeleintrag | null {
  if (!istObjekt(roh)) return null;
  const { id, datum, fen, herkunft } = roh;
  if (typeof id !== "string" || typeof datum !== "string" || typeof fen !== "string") return null;
  const verlauf = verlaufAus(roh.verlauf);
  return {
    id,
    datum,
    fen,
    herkunft: HERKUENFTE.find((h) => h === herkunft) ?? "fen",
    quelle: text(roh.quelle, EROEFFNUNG_HOECHSTENS),
    eroeffnung: text(roh.eroeffnung, EROEFFNUNG_HOECHSTENS),
    plan: text(roh.plan, PLAN_HOECHSTENS),
    notiz: text(roh.notiz, NOTIZ_HOECHSTENS),
    ...(verlauf ? { verlauf } : {}),
  };
}

/**
 * Die Lernsammlung aus Rohdaten (Speicher oder Sicherung); Unlesbares fällt weg.
 * Beispiel: undefined (Format 4 und älter) → [].
 */
export function sammlungAus(roh: unknown): Sammeleintrag[] {
  if (!Array.isArray(roh)) return [];
  return roh.flatMap((r) => eintragAus(r) ?? []).slice(-HOECHSTENS_SAMMLUNG);
}

/** Hängt einen Eintrag an; der älteste fällt weg, wenn die Sammlung voll ist. */
export function mitSammeleintrag(
  liste: readonly Sammeleintrag[],
  eintrag: Sammeleintrag,
): Sammeleintrag[] {
  return [...liste, eintrag].slice(-HOECHSTENS_SAMMLUNG);
}

/** Ändert Plan, Notiz oder Eröffnung eines Eintrags (Kennung und Stellung bleiben). */
export function geaenderterEintrag(
  liste: readonly Sammeleintrag[],
  id: string,
  teil: Partial<Pick<Sammeleintrag, "plan" | "notiz" | "eroeffnung">>,
): Sammeleintrag[] {
  return liste.map((e) => (e.id === id ? { ...e, ...teil } : e));
}

export function ohneSammeleintrag(liste: readonly Sammeleintrag[], id: string): Sammeleintrag[] {
  return liste.filter((e) => e.id !== id);
}

/** Eine Gruppe der Sammlung: Eröffnung (leer: ohne Eröffnung) und ihre Einträge, älteste zuerst. */
export interface Sammelgruppe {
  readonly eroeffnung: string;
  readonly eintraege: readonly Sammeleintrag[];
}

/**
 * Ordnet die Sammlung nach Eröffnung: Gruppen alphabetisch, „ohne Eröffnung“ zuletzt.
 * Beispiel: Einträge „Spanische Partie“, „“, „Französische Verteidigung“ → Französische,
 * Spanische, ohne.
 */
export function nachEroeffnung(liste: readonly Sammeleintrag[]): Sammelgruppe[] {
  const gruppen = new Map<string, Sammeleintrag[]>();
  for (const e of liste) gruppen.set(e.eroeffnung, [...(gruppen.get(e.eroeffnung) ?? []), e]);
  return [...gruppen.entries()]
    .sort(([a], [b]) => (a === "" ? 1 : b === "" ? -1 : a.localeCompare(b, "de")))
    .map(([eroeffnung, eintraege]) => ({
      eroeffnung,
      eintraege: [...eintraege].sort((x, y) => x.datum.localeCompare(y.datum)),
    }));
}

/** Namen der Buch-Eröffnungen zu einer Stellung, mit Steckbrief bevorzugt (wie k2-eroeffnung). */
function buchnamen(index: Eroeffnungsindex, fen: string): string[] {
  const alle = index.stellungen.get(stellungsschluessel(fen)) ?? [];
  const mitSteckbrief = alle.filter((e) => e.steckbrief !== null);
  return [...new Set((mitSteckbrief.length > 0 ? mitSteckbrief : alle).map((e) => e.name))];
}

/**
 * Die Eröffnung zu einer gesammelten Stellung.
 *
 * Warum: Die Sammlung ordnet nach Eröffnung (Kapitel 12: Stellungen aus dem eigenen Repertoire
 * wiederholen). Eingaben: Eröffnungsindex (undefined, solange er lädt), Stellung, Weg dorthin.
 * Ausgabe: Name aus den Buchvarianten (die Stellung selbst, sonst die letzte Buchstellung des
 * Weges), sonst die Familie aus der Lichess-Liste („Sizilianische Verteidigung“ ohne Variante),
 * sonst leer. Beispiel: Abb. 2.2 (nach 3. Lb5) → „Spanische Partie“.
 */
export function eroeffnungsnameFuer(
  index: Eroeffnungsindex | undefined,
  fen: string,
  verlauf?: Sammelverlauf,
): string {
  if (!index) return "";
  const hier = buchnamen(index, fen)[0];
  if (hier) return hier;
  for (let stelle = (verlauf?.zuege.length ?? 0) - 1; verlauf && stelle >= 0; stelle -= 1) {
    const davor = fenNachZuegen(verlauf.startFen, verlauf.zuege, stelle);
    const name = davor ? buchnamen(index, davor)[0] : undefined;
    if (name) return name;
  }
  const fund = index.bekannte ? bekannteEroeffnung(index.bekannte, fen, verlauf) : null;
  return fund ? (fund.eroeffnung.name.split(":")[0] ?? "").trim() : "";
}

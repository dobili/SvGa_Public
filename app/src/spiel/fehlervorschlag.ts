/**
 * Vorschlag für die Fehlerdatenbank aus der Auswertung: Kapitel der Gesamt-Checkliste
 * (Fehlerart des Buches) und ein Satz, wenn ein Zug aus einer eigenen Partie eingetragen wird.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (27.10.2026): Beim Hinzufügen aus einer ausgewerteten
 * Partie sollen die Felder schon einen Vorschlag tragen; dazu ein Algorithmus, der den Fehler mit
 * dem Buch verbindet. Die Fehlererkennung der Auswertung (engine/fehlerart.ts) kennt rund zwanzig
 * Fehlerarten; jede gehört zu einem Kapitel der Gesamt-Checkliste (Kapitel 12, Spalte „Fehlerart“).
 * Der Leser kann beides ändern; ohne klare Zuordnung bleibt die Fehlerart leer.
 * Abhängigkeiten: engine/fehlerart.ts (Fehlerbefund), spiel/zuege.ts.
 * Buchbezug: Kapitel 12, Gesamt-Checkliste („Welche Fehlerart war es?“).
 */
import { fehlerbefundIn, lageVon, type Fehlerart } from "../engine/fehlerart";
import { sanZuUci } from "./zuege";

/** Kapitel der Gesamt-Checkliste, deren Fehlerarten die Auswertung erkennen kann. */
const SCHLAG_UEBERSEHEN = 1;
const EROEFFNUNGSIDEE = 2;
const FALLE_ODER_KOEDER = 4;
const BAUERNSTRUKTUR = 5;
const PLAN_ODER_AKTIVITAET = 6;
const TAKTIK_UEBERSEHEN = 7;
const ELEMENTARENDSPIEL = 8;
const ENDSPIELTECHNIK = 9;

/**
 * Zu welchem Kapitel der Checkliste eine erkannte Fehlerart gehört.
 * Regel: Kapitel 1 (Schach oder Schlag übersehen: hängende Figur, stehengelassene Drohung),
 * Kapitel 2 (Eröffnungsidee), Kapitel 4 (Falle oder Köder: Schlagreflex, vergifteter Bauer),
 * Kapitel 5 (Bauernstruktur), Kapitel 7 (Taktik), Kapitel 8 und 9 (Endspiel).
 */
const KAPITEL_JE_ART: Readonly<Partial<Record<Fehlerart, number>>> = {
  figurHaengen: SCHLAG_UEBERSEHEN,
  drohungIgnoriert: SCHLAG_UEBERSEHEN,
  bauerEingestellt: SCHLAG_UEBERSEHEN,
  verfruehteDame: EROEFFNUNGSIDEE,
  koenigMitte: EROEFFNUNGSIDEE,
  tempoverlust: EROEFFNUNGSIDEE,
  schlagreflex: FALLE_ODER_KOEDER,
  bauernraub: FALLE_ODER_KOEDER,
  koenigsschild: BAUERNSTRUKTUR,
  bauernvorstoss: BAUERNSTRUKTUR,
  bauernzugOhneNot: BAUERNSTRUKTUR,
  falscherAbtausch: PLAN_ODER_AKTIVITAET,
  koenigszugOhneNot: PLAN_ODER_AKTIVITAET,
  taktikUebersehen: TAKTIK_UEBERSEHEN,
  schlagVerpasst: TAKTIK_UEBERSEHEN,
  pattGesetzt: ELEMENTARENDSPIEL,
  koenigPassiv: ENDSPIELTECHNIK,
};

/**
 * Das Kapitel der Checkliste für einen Zug der eigenen Partie, oder null ohne klare Zuordnung.
 *
 * Eingaben: Stellung vor dem Zug, Zug (Kurznotation), Antwort der Engine (UCI, leer, wenn
 * unbekannt), Verlust in Bauerneinheiten, bester Zug (UCI) oder null.
 * Beispiel: Rückblick, 12... Sxe4?? lässt Dxh7# zu → Drohung ignoriert → Kapitel 1.
 * Sonderfall: „ungenau“ und blinde Flecken haben kein Kapitel; unlesbare Stellung → null.
 */
export function kapitelvorschlag(
  vorherFen: string,
  san: string,
  antwort: string,
  verlust: number,
  bester: string | null,
): number | null {
  const lage = lageVon(vorherFen);
  const uci = sanZuUci(vorherFen, san);
  if (!lage || !uci) return null;
  const befund = fehlerbefundIn(lage, uci, antwort ? [antwort] : [], verlust, bester);
  return KAPITEL_JE_ART[befund.art] ?? null;
}

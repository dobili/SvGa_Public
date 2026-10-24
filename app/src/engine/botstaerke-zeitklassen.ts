/**
 * Zahlen der Bots und Stufen je Zeitklasse (Blitz, Klassisch), gemessen in den Gruppen-Chats
 * (docs/MESSUNG_ZEITKLASSEN.md) und vom Koordinierungschat eingetragen. Leer, bis die Messung
 * vorliegt; dann gilt für diese Zeitklasse die Zahl von hier, sonst die Schnellschach-Zahl aus
 * engine/botstaerke-daten.ts (R51: drei Zahlen je Bot).
 * Abhängigkeiten: spiel/elomodell.ts (Typ), engine/stufen.ts (Typ).
 */
import type { Wertungstempo } from "../spiel/elomodell";
import type { Stufennummer } from "./stufen";

/** Je Zeitklasse (nur Blitz und Klassisch) die Zahl je Bot-Kennung. */
export const BOT_STAERKE_JE_ZEITKLASSE: Readonly<
  Partial<Record<Wertungstempo, Readonly<Record<string, number>>>>
> = {};

/** Je Zeitklasse die Zahl je Stufe. */
export const STUFEN_STAERKE_JE_ZEITKLASSE: Readonly<
  Partial<Record<Wertungstempo, Readonly<Partial<Record<Stufennummer, number>>>>>
> = {};

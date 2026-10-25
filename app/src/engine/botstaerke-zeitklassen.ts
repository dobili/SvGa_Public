/**
 * Zahlen der Bots und Stufen je Zeitklasse (Blitz, Klassisch), gemessen in den Gruppen-Chats
 * (docs/MESSUNG_ZEITKLASSEN.md) und vom Koordinierungschat eingetragen (seit 0.2.129). Für eine
 * gemessene Zeitklasse gilt die Zahl von hier, sonst die Schnellschach-Zahl aus
 * engine/botstaerke-daten.ts (R51: drei Zahlen je Bot).
 * Abhängigkeiten: engine/botstaerke-daten-blitz.ts und -klassisch.ts (erzeugt), spiel/elomodell.ts (Typ),
 * engine/stufen.ts (Typ).
 */
import type { Wertungstempo } from "../spiel/elomodell";
import * as blitz from "./botstaerke-daten-blitz";
import * as klassisch from "./botstaerke-daten-klassisch";
import type { Stufennummer } from "./stufen";

/** Je Zeitklasse (nur Blitz und Klassisch) die Zahl je Bot-Kennung. */
export const BOT_STAERKE_JE_ZEITKLASSE: Readonly<
  Partial<Record<Wertungstempo, Readonly<Record<string, number>>>>
> = { blitz: blitz.BOT_STAERKE, classical: klassisch.BOT_STAERKE };

/** Je Zeitklasse die Zahl je Stufe. */
export const STUFEN_STAERKE_JE_ZEITKLASSE: Readonly<
  Partial<Record<Wertungstempo, Readonly<Partial<Record<Stufennummer, number>>>>>
> = { blitz: blitz.STUFEN_STAERKE, classical: klassisch.STUFEN_STAERKE };

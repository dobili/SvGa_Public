/**
 * Gruppenmodus einer Bot-Kategorie (Wunsch des Autors, 24.10.2026): Alle Bots einer Stufe spielen
 * zugleich und beraten sich; die Gruppe ist ein eigener Gegner mit der Kennung „gruppe-N“.
 *
 * Rolle im Gesamtbild: Hat der Leser jeden Bot einer Stufe in einer gewerteten Partie besiegt
 * (egal in welcher Zeitklasse, speicher/besiegt.ts), ist der Gruppenmodus der Stufe frei. Die
 * Gruppe zieht, indem jeder Bot seinen Zug wählt und die Gruppe davon den Zug mit dem kleinsten
 * Verlust spielt (engine/gruppenwahl.ts). Ihre Stärke wird vorab gemessen
 * (engine/gruppenstaerke-daten.ts), aber erst gezeigt, wenn der Leser die Gruppe einmal besiegt
 * hat; bis dahin steht „Stärke unbekannt“. Für die Elo-Wertung gilt die gemessene Zahl von Anfang
 * an; ohne Messung die Zahl des stärksten Bots plus einem Zuschlag.
 * Die Grundlagen (Kennung, Mitglieder, gemessene Zahl) stehen in engine/gruppenbasis.ts, die Zahl
 * für die Elo-Wertung (gruppenwertung) in engine/botstaerke.ts; beide reicht diese Datei weiter,
 * damit sich engine/botstaerke.ts und engine/gruppe.ts nicht gegenseitig importieren.
 * Abhängigkeiten: engine/gruppenbasis.ts, engine/botstaerke.ts, speicher/besiegt.ts (Typ),
 * engine/stufen.ts (Typ).
 */
import { irgendwoBesiegt, type Besiegte } from "../speicher/besiegt";
import { gemesseneGruppenstaerke, gruppenkennung, mitgliederDerGruppe } from "./gruppenbasis";
import { STUFEN_ZAHL, type Stufennummer } from "./stufen";
export {
  GRUPPEN_VORSILBE,
  gemesseneGruppenstaerke,
  gruppenkennung,
  gruppenstufe,
  gruppenstufen,
  istGruppe,
  mitgliederDerGruppe,
} from "./gruppenbasis";
export { gruppenwertung } from "./botstaerke";

/**
 * Ist der Gruppenmodus frei? Jeder Bot der Stufe in irgendeiner Zeitklasse gewertet besiegt.
 * Beispiel: Stufe 2 mit acht Bots, sieben besiegt → false; der achte fällt → true.
 * Sonderfall: eine Stufe ohne Bots ist nie frei.
 */
export function gruppeFrei(besiegt: Besiegte, stufe: Stufennummer): boolean {
  const bots = mitgliederDerGruppe(stufe);
  return bots.length > 0 && bots.every((g) => irgendwoBesiegt(besiegt, g.kennung));
}

/** Alle Stufen, deren Gruppenmodus frei ist. */
export function freieGruppen(besiegt: Besiegte): Stufennummer[] {
  const alle = Array.from({ length: STUFEN_ZAHL }, (_, i) => (i + 1) as Stufennummer);
  return alle.filter((n) => gruppeFrei(besiegt, n));
}

/** Zeigt die App die Zahl? Erst nach dem ersten Sieg gegen die Gruppe (Wunsch des Autors). */
export function gruppenstaerkeSichtbar(besiegt: Besiegte, stufe: Stufennummer): boolean {
  return irgendwoBesiegt(besiegt, gruppenkennung(stufe)) && gemesseneGruppenstaerke(stufe) !== null;
}

/**
 * Grundschicht der Stufen: die Engine bewertet Züge in begrenzter Tiefe und wählt gewichtet.
 *
 * Rolle im Gesamtbild: Allein die Grundschicht bestimmt die Stärke einer Stufe (engine/stufen.ts;
 * Vorschlag des Autors vom 21.10.2026); Zusatzfehler und blinde Flecken
 * (engine/menschenwahl.ts) kommen nur bei Bots dazu. Die Engine bewertet in den unteren Stufen
 * alle legalen Züge in kleiner Tiefe; jeder bekommt das Gewicht (1 + Verlust/tau)^(−Exponent).
 * Mit großem tau zieht die Stufe fast beliebig (auch Figuren ins Schlagfeld), mit kleinem fast
 * immer den besten Zug ihrer Suche; die Tiefe begrenzt, wie weit sie vorausschaut.
 * Abhängigkeiten: engine/spielbewerter.ts, engine/menschlich.ts (gewichtete Wahl).
 */
import { gewichteteZugwahl } from "./menschlich";
import { wertFuer, type Spielbewerter } from "./spielbewerter";
import type { Variante } from "./uci";

export interface Grundschicht {
  /** Suchtiefe der Bewertung. */
  readonly tiefe: number;
  /** So viele Züge bewertet die Engine (MultiPV); alle legalen in den unteren Stufen. */
  readonly breite: number;
  /** Breite des Kerns in Bauern: groß = fast beliebig, klein = fast immer der beste. */
  readonly tau: number;
  readonly exponent: number;
}

/** Ein Zug der Grundschicht mit seinem Verlust gegenüber dem besten der Suche. */
export interface Grundkandidat {
  readonly uci: string;
  readonly verlust: number;
}

/** Die Kandidaten aus den Varianten, mit Verlust aus Sicht der Seite am Zug. */
export function kandidatenAusVarianten(
  varianten: readonly Variante[],
  weiss: boolean,
): Grundkandidat[] {
  const erste = varianten[0];
  if (!erste) return [];
  const bester = wertFuer(erste.wert, weiss);
  return varianten.flatMap((v) => {
    const uci = v.zuege[0];
    return uci ? [{ uci, verlust: Math.max(0, bester - wertFuer(v.wert, weiss)) }] : [];
  });
}

/**
 * Der Zug der Grundschicht.
 *
 * Eingaben: Bewerter, Stellung, Grundschicht, Rechenzeit, Faktor auf tau (Tagesform, Zeitnot,
 * Fehlerhäufigkeit), Zufall, ausgeschlossene Züge (blinder Fleck; bleibt sonst nichts, gelten
 * alle). Ausgabe: gewählter Zug mit Verlust und alle Varianten (für den Stil), null ohne Zug.
 * Beispiel: Stufe 1 (Tiefe 1, tau 3): nach 1. e4 e5 2. Dh5 zieht Schwarz oft vernünftig, aber
 * mit merklicher Wahrscheinlichkeit auch 2... g6?? oder einen beliebigen Randzug.
 */
export async function grundzug(
  bewerter: Spielbewerter,
  fen: string,
  grund: Grundschicht,
  rechenzeitMs: number,
  faktor: number,
  zufall: () => number,
  ausgeschlossen: (uci: string) => boolean = () => false,
): Promise<{ zug: Grundkandidat; varianten: readonly Variante[] } | null> {
  const staerke = { art: "tiefe", tiefe: grund.tiefe } as const;
  const b = await bewerter.bewerte(fen, rechenzeitMs, grund.breite, staerke);
  const weiss = fen.split(" ")[1] !== "b";
  const alle = kandidatenAusVarianten(b.varianten, weiss);
  const sichtbar = alle.filter((k) => !ausgeschlossen(k.uci));
  const auswahl = sichtbar.length > 0 ? sichtbar : alle;
  const zug = gewichteteZugwahl(auswahl, grund.tau * faktor, zufall, grund.exponent);
  return zug ? { zug, varianten: b.varianten } : null;
}

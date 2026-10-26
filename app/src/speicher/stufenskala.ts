/**
 * Umrechnung gespeicherter Stufen von acht auf zehn Stufen (Format 5 → 6).
 *
 * Rolle im Gesamtbild: Teil der Formatumwandlung (speicher/format.ts). Früher gab es acht
 * Stufen, heute zehn von etwa 300 bis 3000 Elo (engine/stufen.ts, Vorschlag des Autors
 * vom 21.10.2026). Eine alte Stufe wird die neue mit der nächsten Elo-Zahl, nach den Zahlen, die
 * die App zu den acht Stufen zuletzt zeigte (983, 1319, 1698, 1868, 2147, 2383, 2699, 3011). So
 * spielen laufende Partien, eigene Gegner und Vorlieben etwa so stark weiter wie vorher.
 * Abhängigkeiten: keine.
 */

/** Alte Stufe → neue Stufe (nächste Elo-Zahl, 300 je Stufe). */
const NEU_FUER_ALT: Readonly<Record<number, number>> = {
  1: 3,
  2: 4,
  3: 6,
  4: 6,
  5: 7,
  6: 8,
  7: 9,
  8: 10,
};

function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

function neueStufe(wert: unknown): unknown {
  return typeof wert === "number" ? (NEU_FUER_ALT[wert] ?? wert) : wert;
}

/**
 * Rechnet alle Stufen im Spielstand um: jedes Feld „stufe“ (Partie, Zug, Vorlieben) und jedes
 * Feld in „stufenJePhase“ (Partien, Vorlieben, eigene Gegner). Rein, die Eingabe bleibt gleich.
 * Beispiel: {vorlieben: {stufe: 2, stufenJePhase: {eroeffnung: 1, …}}} → stufe 4, eroeffnung 3.
 * Sonderfall: Unbekannte Zahlen bleiben; das Lesen prüft sie danach ohnehin.
 */
export function stufenUmgerechnet(roh: unknown): unknown {
  if (Array.isArray(roh)) return roh.map(stufenUmgerechnet);
  if (!istObjekt(roh)) return roh;
  return Object.fromEntries(
    Object.entries(roh).map(([schluessel, wert]) => {
      if (schluessel === "stufe") return [schluessel, neueStufe(wert)];
      if (schluessel === "stufenJePhase" && istObjekt(wert)) {
        const je = Object.entries(wert).map(([phase, s]) => [phase, neueStufe(s)]);
        return [schluessel, Object.fromEntries(je)];
      }
      return [schluessel, stufenUmgerechnet(wert)];
    }),
  );
}

/**
 * Wann die Auswertung während der Partie im Hintergrund rechnet.
 *
 * Rolle im Gesamtbild: Seit 0.3.40 hat die Auswertung eine eigene Engine (engine/engineDienst.ts,
 * auswertungsEngine) in einem eigenen Worker. Frage des Autors (31.10.2026): Kann sie durchgängig
 * laufen, ohne den Zug des Gegners zu verlängern? Ja, wenn das Gerät genug Kerne hat: Bot-Engine,
 * Auswertung und Oberfläche bekommen dann je einen Kern. Auf Geräten mit wenigen Kernen rechnet
 * sie wie bisher nur, solange der Leser am Zug ist, damit der Bot seinen Kern für sich hat.
 * Abhängigkeiten: keine (reine Rechnung); Partie.tsx liest die Zahl der Kerne des Geräts.
 */

/**
 * Ab so vielen logischen Kernen läuft die Auswertung durchgängig: einer für die Oberfläche, einer
 * für den Bot (Stockfish), einer für die Auswertung, einer für Maia und das System. Ältere
 * Mittelklasse-Handys haben 8, Einsteigergeräte oft 4, sehr alte 2.
 */
export const KERNE_FUER_DURCHGEHEND = 4;

/**
 * Soll die Auswertung jetzt im Hintergrund rechnen?
 * Eingaben: Partie läuft noch, Leser am Zug, Zahl der logischen Kerne (navigator.hardwareConcurrency;
 * fehlt sie, gilt das Gerät als knapp). Ausgabe: true, wenn sie rechnen soll.
 * Beispiel: 8 Kerne, der Bot denkt nach → true; 2 Kerne, der Bot denkt nach → false.
 * Sonderfall: Nach dem Ende entscheidet useAuswertung selbst (Auswertung bis zum Schluss).
 */
export function auswertungImHintergrund(
  partieLaeuft: boolean,
  leserAmZug: boolean,
  kerne: number | undefined,
): boolean {
  if (!partieLaeuft) return false;
  return leserAmZug || (kerne ?? 0) >= KERNE_FUER_DURCHGEHEND;
}

/** Die Zahl der logischen Kerne des Geräts (undefined, wenn der Browser sie nicht nennt). */
export function kerneDesGeraets(): number | undefined {
  return typeof navigator === "undefined" ? undefined : navigator.hardwareConcurrency;
}

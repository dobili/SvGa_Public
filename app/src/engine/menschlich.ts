/**
 * Bausteine der menschlichen Zugwahl: Verlauf der Partie, Tagesform, Temperatur, gewichtete Wahl.
 *
 * Rolle im Gesamtbild: Seit 0.2.52 (Empfehlung R4) wählt die Engine in den unteren Stufen
 * gewichtet zufällig unter ihren Kandidaten mit einer „Temperatur“: Jeder Kandidat bekommt das
 * Gewicht e^(−Verlust/Temperatur). Kleine Fehler sind so häufig, große selten, und in erzwungenen
 * Lagen bleibt der beste Zug sehr wahrscheinlich. Seit 0.2.117 nutzt die Grundschicht der Stufen
 * (engine/grundschicht.ts) diese Wahl mit dem Potenzkern, Breite und Tiefe je Stufe geeicht; die
 * Zusatzfehler stehen in engine/menschenwahl.ts. Hier bleiben die Bausteine. Von den alten
 * Faustregeln bleibt nur die
 * Tagesform (im Mittel 1). Strähne (mehr Fehler nach Fehlern) und Lage (Schach, viele Züge) sind
 * entfallen: Die geeichten Raten der Menschen enthalten sie schon im Mittel, ein Faktor obendrauf
 * zählte doppelt (Messung vom 21.10.2026: Stufe 1 machte in eigenen Partien 42 % Fehlerzüge statt
 * etwa 30 % wie Menschen ihres Bandes).
 * Abhängigkeiten: keine.
 */

/** Was der Verlauf der Partie zur Fehlerneigung beiträgt. */
export interface Verlauf {
  /** Tagesform je Partie, Faktor um 1 (0,6 bis 1,4). */
  readonly tagesform: number;
}

export const RUHIGER_VERLAUF: Verlauf = { tagesform: 1 };

/** Die Tagesform liegt zwischen 1 − Spanne und 1 + Spanne. */
/**
 * Halbe Spanne der Tagesform. Seit 0.2.125 0,4 statt 0,25: Als Temperatur des Wahlmodells
 * (engine/wahlmodell.ts) erzeugt eine gleichverteilte Temperatur zwischen 0,6 und 1,4 je Partie
 * eine Streuung der Fehlerrate zwischen Partien von etwa 4 bis 5 Fehlern je 100 Züge, wie sie das
 * Beta-Binomial-Modell der Spielerprofile misst (Tagesform 5,0 bis 5,7; mit 0,25 nur etwa 3);
 * lokal buch/arbeit/zugwahl/temperatur.py.
 */
const TAGESFORM_SPANNE = 0.4;
/** Streuung der Saat in der Tagesform (einfacher Zeichenmischer). */
const SAAT_FAKTOR = 31;
const SAAT_MODUL = 1_000_003;
/** Unter dieser Temperatur zieht die Engine praktisch immer den besten Zug. */
const KALT = 0.01;

/**
 * Tagesform aus einer Saat (der Kennung der Partie): fest je Partie, zwischen 0,6 und 1,4.
 * Beispiel: zwei Partien mit verschiedenen Kennungen bekommen verschiedene, aber je Partie
 * gleichbleibende Tagesformen.
 */
export function tagesform(saat: string): number {
  let stand = 0;
  for (const zeichen of saat) stand = (stand * SAAT_FAKTOR + zeichen.charCodeAt(0)) % SAAT_MODUL;
  const anteil = stand / SAAT_MODUL;
  return 1 - TAGESFORM_SPANNE + 2 * TAGESFORM_SPANNE * anteil;
}

/** Faktor des Verlaufs auf Fehler und Breite der Wahl: die Tagesform. Beispiel: 1,2 → 1,2. */
export function verlaufsfaktor(verlauf: Verlauf): number {
  return verlauf.tagesform;
}

/** Ein Kandidat mit seinem Verlust gegenüber dem besten Zug (aus Sicht der Seite am Zug). */
export interface Kandidat {
  readonly uci: string;
  readonly verlust: number;
}

/**
 * Wählt unter den Kandidaten gewichtet zufällig: Gewicht e^(−Verlust/Temperatur).
 *
 * Eingaben: Kandidaten (bester zuerst), Temperatur, Zufall (0 bis 1; für Tests fest). Ausgabe: der
 * gewählte Kandidat oder null ohne Kandidaten.
 * Beispiel: Verluste 0, 0,5, 3 bei Temperatur 1: Gewichte 1, 0,61, 0,05 → der beste zu 60 %, der
 * zweite zu 37 %, der dritte zu 3 %. Bei Temperatur 0,45: 1, 0,33, 0,001 → 75 %, 25 %, 0 %.
 * Mit Exponent (seit 0.2.117, menschliche Bots) gilt der Potenzkern (1 + Verlust/Temperatur)^
 * (−Exponent): Verluste 0 und 3 bei Temperatur 0,25 und Exponent 1 → Gewichte 1 und 1/13.
 * Sonderfall: Zufall 0 ergibt immer den besten Zug.
 */
export function gewichteteZugwahl(
  kandidaten: readonly Kandidat[],
  temperatur: number,
  zufall: () => number,
  exponent?: number,
): Kandidat | null {
  if (kandidaten.length === 0) return null;
  const breite = Math.max(KALT, temperatur);
  const gewichte = kandidaten.map((k) =>
    exponent === undefined
      ? Math.exp(-k.verlust / breite)
      : Math.pow(1 + k.verlust / breite, -exponent),
  );
  const summe = gewichte.reduce((a, b) => a + b, 0);
  let rest = zufall() * summe;
  for (const [i, gewicht] of gewichte.entries()) {
    rest -= gewicht;
    if (rest < 0) return kandidaten[i] ?? null;
  }
  return kandidaten[kandidaten.length - 1] ?? null;
}

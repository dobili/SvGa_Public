/**
 * Verläufe einzelner Trainer in den Nutzerdaten: Trefferzahlen bei „Zug erraten“ je Partie und
 * der Stand des 30-Minuten-Plans.
 *
 * Rolle im Gesamtbild: Pflichtenheft 7 verlangt beim Zugerraten den Vergleich mit früheren
 * Versuchen („Wiederholung derselben Partie nach Wochen“). Deshalb stehen die Trefferzahlen und
 * der 30-Minuten-Plan in den Nutzerdaten (speicher/format.ts) und damit auch in der
 * Datensicherung, nicht nur im Bildschirm oder als Merker im Gerät.
 * Ältere Stände ohne diese Einträge lesen sich als leer; das Format bleibt dasselbe.
 * Abhängigkeiten: keine.
 */

/** Ein Durchgang „Zug erraten“ einer Partie: Datum, getroffene und geratene Züge. */
export interface Rateeintrag {
  readonly datum: string;
  readonly treffer: number;
  readonly versuche: number;
}

/** Je Partie (Kennung der Aufgabe) die letzten Durchgänge, der neueste zuletzt. */
export type Rateverlauf = Readonly<Record<string, readonly Rateeintrag[]>>;

/** So viele Durchgänge je Partie bleiben gespeichert (genug für den Vergleich über Wochen). */
const DURCHGAENGE_HOECHSTENS = 10;

function istZahl(wert: unknown): wert is number {
  return typeof wert === "number" && Number.isInteger(wert) && wert >= 0;
}

function rateeintragAus(roh: unknown): Rateeintrag | null {
  if (typeof roh !== "object" || roh === null) return null;
  const r = roh as Record<string, unknown>;
  if (typeof r.datum !== "string" || !istZahl(r.treffer) || !istZahl(r.versuche)) return null;
  return { datum: r.datum, treffer: Math.min(r.treffer, r.versuche), versuche: r.versuche };
}

/** Der Rateverlauf aus Rohdaten; Unlesbares fällt weg. Beispiel: {} → {}. */
export function rateverlaufAus(roh: unknown): Rateverlauf {
  if (typeof roh !== "object" || roh === null || Array.isArray(roh)) return {};
  const ergebnis: Record<string, readonly Rateeintrag[]> = {};
  for (const [partie, liste] of Object.entries(roh)) {
    if (!Array.isArray(liste)) continue;
    const eintraege = liste.map(rateeintragAus).filter((e): e is Rateeintrag => e !== null);
    if (eintraege.length > 0) ergebnis[partie] = eintraege.slice(-DURCHGAENGE_HOECHSTENS);
  }
  return ergebnis;
}

/**
 * Hängt einen Durchgang an den Verlauf einer Partie an (höchstens zehn bleiben).
 * Beispiel: Opernpartie mit 7 von 12 → {"opern": [{datum, treffer: 7, versuche: 12}]}.
 */
export function mitRatedurchgang(
  verlauf: Rateverlauf,
  partie: string,
  eintrag: Rateeintrag,
): Rateverlauf {
  const alt = verlauf[partie] ?? [];
  return { ...verlauf, [partie]: [...alt, eintrag].slice(-DURCHGAENGE_HOECHSTENS) };
}

/** Der Stand des 30-Minuten-Plans als JSON-Text (training/dreissigminuten.ts liest ihn). */
export function planstandTextAus(roh: unknown): string | null {
  return typeof roh === "string" ? roh : null;
}

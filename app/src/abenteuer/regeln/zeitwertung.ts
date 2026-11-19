/**
 * Zeitwertung: In welcher Zeitklasse eine Partie gespielt wurde, gemessen an der genutzten
 * Bedenkzeit statt an der eingestellten.
 *
 * Rolle im Gesamtbild: Idee des Autors (19.11.2026): Wer eine Partie mit 15 Minuten spielt, aber
 * nur 2 Minuten nutzt, hat in Wahrheit geblitzt. Diese Datei ist absichtlich eigenständig (keine
 * Importe): Das Spiel nutzt sie für Ambroses Zeit-Hinweise, die App kann sie später für ihre
 * Wertung je Zeitklasse übernehmen, ohne am Spielcode zu hängen (Vorschlag:
 * docs/spiel/auftraege/rueckmeldung/zeitwertung_app_vorschlag.md).
 * Regel (Empfehlung des Hauptchats, 19.11.2026): genutzte Zeit = Grundzeit + Zuschläge −
 * Restzeit am Ende; Schnitt je eigenem Zug mal 40 Züge, eingeordnet mit den Grenzen von Lichess
 * (geschätzte Dauer unter 3 Minuten Bullet, unter 8 Blitz, unter 25 Schnellschach, sonst
 * klassisch; dieselbe Regel wie spiel/zeitklasse.ts für die Einstellung). Nur herabstufen, nie in
 * eine langsamere Klasse heben, und erst ab 20 eigenen Zügen: Ein frühes Matt oder eine frühe
 * Aufgabe sagt nichts über das Tempo.
 * Quelle der Grenzen: Lichess, „Time controls“ (estimated game duration = initial time +
 * 40 × increment).
 * Abhängigkeiten: keine.
 */

/** Die Zeitklassen von der schnellsten zur langsamsten (Namen wie spiel/zeitklasse.ts). */
export const ZEITWERTUNG_KLASSEN = ["bullet", "blitz", "schnell", "klassisch"] as const;
export type Zeitwertungsklasse = (typeof ZEITWERTUNG_KLASSEN)[number];

/** Erst ab so vielen eigenen Zügen zählt die genutzte Zeit. */
export const MINDESTZUEGE_ZEITWERTUNG = 20;
/** Lichess rechnet mit 40 Zügen je Partie. */
const ZUEGE_JE_PARTIE = 40;
const SEKUNDE_MS = 1000;
/** Obergrenzen der geschätzten Dauer je Seite in Sekunden (Lichess). */
const GRENZE_BULLET_S = 180;
const GRENZE_BLITZ_S = 480;
const GRENZE_SCHNELL_S = 1500;

/** Was die Uhr am Ende einer Partie über den Leser weiß. */
export interface Uhrbilanz {
  readonly grundzeitMs: number;
  readonly zuschlagMs: number;
  /** Züge des Lesers in der Partie. */
  readonly eigeneZuege: number;
  /** Machte der Leser den ersten Zug der Partie? Der bekommt keinen Zuschlag (spiel/uhr.ts). */
  readonly begann: boolean;
  /** Restzeit des Lesers am Ende. */
  readonly restMs: number;
}

/** Ergebnis der Zeitwertung. */
export interface Zeitwertung {
  readonly genutztMs: number;
  /** Mittlere Bedenkzeit je eigenem Zug. */
  readonly schnittMs: number;
  /** Die Klasse der eingestellten Bedenkzeit. */
  readonly eingestellt: Zeitwertungsklasse;
  /** Die Klasse, in der gewertet wird: die schnellere aus Einstellung und genutzter Zeit. */
  readonly gewertet: Zeitwertungsklasse;
}

/**
 * Die Zeitklasse einer geschätzten Dauer je Seite (Millisekunden).
 * Beispiel: 260 000 ms (3 + 2) → „blitz“; 160 000 ms (4 s je Zug über 40 Züge) → „bullet“.
 */
export function klasseDerDauer(dauerMs: number): Zeitwertungsklasse {
  const sekunden = dauerMs / SEKUNDE_MS;
  if (sekunden < GRENZE_BULLET_S) return "bullet";
  if (sekunden < GRENZE_BLITZ_S) return "blitz";
  if (sekunden < GRENZE_SCHNELL_S) return "schnell";
  return "klassisch";
}

/** Die Klasse einer eingestellten Bedenkzeit (Grundzeit + 40 × Zuschlag). Beispiel: 15 + 10 → „schnell“. */
export function klasseDerBedenkzeit(grundzeitMs: number, zuschlagMs: number): Zeitwertungsklasse {
  return klasseDerDauer(grundzeitMs + ZUEGE_JE_PARTIE * zuschlagMs);
}

/**
 * Die Zeitwertung einer Partie; null mit weniger als 20 eigenen Zügen.
 *
 * Eingabe: Uhrbilanz am Ende der Partie.
 * Ausgabe: genutzte Zeit, Schnitt je Zug, eingestellte und gewertete Klasse.
 * Beispiel: 15 + 10, Leser (Weiß) mit 20 Zügen, am Ende 16:50 übrig → genutzt 15:00 + 19 × 10 s
 * − 16:50 = 80 s, 4 s je Zug, 160 s über 40 Züge → gewertet „bullet“ statt „schnell“.
 * Sonderfälle: Eine Pause, in der die Uhr stand, kann einen Zuschlag kosten; dann wirkt die
 * genutzte Zeit etwas länger, die Partie also eher langsamer (nie zu Unrecht herabgestuft).
 * Eine Zeitüberschreitung nutzt die ganze Zeit; die Klasse bleibt dann die eingestellte.
 */
export function zeitwertung(bilanz: Uhrbilanz): Zeitwertung | null {
  const { grundzeitMs, zuschlagMs, eigeneZuege, begann, restMs } = bilanz;
  if (eigeneZuege < MINDESTZUEGE_ZEITWERTUNG) return null;
  const zuschlaege = begann ? eigeneZuege - 1 : eigeneZuege;
  const genutztMs = Math.max(0, grundzeitMs + zuschlaege * zuschlagMs - restMs);
  const schnittMs = genutztMs / eigeneZuege;
  const eingestellt = klasseDerBedenkzeit(grundzeitMs, zuschlagMs);
  const effektiv = klasseDerDauer(schnittMs * ZUEGE_JE_PARTIE);
  return { genutztMs, schnittMs, eingestellt, gewertet: schnellere(eingestellt, effektiv) };
}

/** Die schnellere zweier Klassen. Beispiel: „schnell“ und „blitz“ → „blitz“. */
export function schnellere(a: Zeitwertungsklasse, b: Zeitwertungsklasse): Zeitwertungsklasse {
  return ZEITWERTUNG_KLASSEN.indexOf(a) <= ZEITWERTUNG_KLASSEN.indexOf(b) ? a : b;
}

/** Wurde herabgestuft? Beispiel: eingestellt „schnell“, gewertet „blitz“ → true. */
export function herabgestuft(wertung: Zeitwertung | null): boolean {
  return wertung !== null && wertung.gewertet !== wertung.eingestellt;
}

/**
 * Eröffnungen nach Spielstärke: die häufigsten Eröffnungen echter Menschen je 200er-Band, für
 * Weiß und für Schwarz, mit Varianten, Gambit- und Buchmarke.
 *
 * Rolle im Gesamtbild: Eröffnungspaket der Ideensammlung (26.10.2026, Wunsch des Autors):
 * „Eröffnungen über das Buch hinaus nach Elo-Band: je Band die drei häufigsten für Weiß und
 * Schwarz, Bänder anhakbar von … bis …, mit jedem Band drei neue Eröffnungen, Bucheröffnungen
 * markiert.“ Die Daten baut pipeline/praxisbuch/baender.py aus demselben Lichess-Monat wie das
 * Praxisbuch (CC0) nach public/daten/eroeffnungsbaender.json. Diese Datei liest sie und wählt
 * aus; die Oberfläche steht in ui/komponenten/spielstart/Staerkewahl.tsx.
 * Abhängigkeiten: keine (reine Daten und Rechnung).
 */

/** Weiß („w“) oder Schwarz („s“): wer die Eröffnung wählt. */
export type Eroeffnungsseite = "w" | "s";

/** Eine Variante einer Eröffnung (voller Lichess-Name). */
export interface Bandvariante {
  readonly name: string;
  /** Zugfolge in englischer Kurznotation mit Leerzeichen. */
  readonly folge: string;
  readonly gambit: boolean;
  /** Wie oft sie im Monat erreicht wurde, über alle Bänder. */
  readonly anzahl: number;
}

/** Eine Eröffnung (Familie nach Lichess) mit ihrem Anteil je Band. */
export interface Bandfamilie {
  /** Englischer Name nach Lichess, zugleich Schlüssel. */
  readonly name: string;
  readonly nameDe: string;
  readonly seite: Eroeffnungsseite;
  readonly folge: string;
  readonly gambit: boolean;
  /** Abschnitt des Buches („2.3“), wenn das Buch sie behandelt. */
  readonly buch: string | null;
  /** Anteil an allen Partien des Bandes in Prozent, je Band. */
  readonly anteil: readonly number[];
  readonly varianten: readonly Bandvariante[];
}

export interface Eroeffnungsbaender {
  /** Untergrenzen der Bänder (400, 600, … 2800). */
  readonly baender: readonly number[];
  readonly familien: readonly Bandfamilie[];
}

/** Eine gewählte Eröffnung mit dem Band, in dem sie dazukam. */
export interface Staerkeeintrag {
  readonly familie: Bandfamilie;
  /** Index des Bandes, das sie in die Liste brachte. */
  readonly band: number;
}

/** So viele neue Eröffnungen bringt jedes Band (Wunsch des Autors). */
export const JE_BAND = 3;

/** Prüft die Datei grob; null bei unbekanntem Format. */
export function eroeffnungsbaenderAus(roh: unknown): Eroeffnungsbaender | null {
  if (typeof roh !== "object" || roh === null) return null;
  const r = roh as Record<string, unknown>;
  if (!Array.isArray(r.baender) || !Array.isArray(r.familien)) return null;
  const familien = r.familien.filter(
    (f): f is Bandfamilie =>
      typeof f === "object" &&
      f !== null &&
      typeof (f as Bandfamilie).name === "string" &&
      Array.isArray((f as Bandfamilie).anteil),
  );
  return { baender: r.baender as number[], familien };
}

/**
 * Die Eröffnungen einer Seite für die Bänder von `von` bis `bis` (Indizes, beide eingeschlossen):
 * je Band die drei häufigsten, die noch nicht in der Liste stehen.
 *
 * Warum: Wer mehrere Bänder anhakt, soll mit jedem Band etwas Neues sehen; kommt eine Eröffnung
 * in zwei Bändern unter die ersten drei, rückt im zweiten Band die vierte nach (Wunsch des Autors).
 * Beispiel (Lichess 2026-09, Weiß): Band 1200 → Italienisch, Läuferspiel, London; dazu Band 1400
 * → Damengambit, Schottisch, Englisch (Italienisch, London und Läuferspiel stehen schon da).
 * Sonderfälle: `von` > `bis` wird getauscht; Bänder außerhalb der Daten werden begrenzt.
 */
export function auswahlNachStaerke(
  daten: Eroeffnungsbaender,
  seite: Eroeffnungsseite,
  von: number,
  bis: number,
  jeBand: number = JE_BAND,
): readonly Staerkeeintrag[] {
  const letztes = daten.baender.length - 1;
  const [a, b] = [Math.min(von, bis), Math.max(von, bis)].map((i) =>
    Math.max(0, Math.min(letztes, i)),
  ) as [number, number];
  const eigene = daten.familien.filter((f) => f.seite === seite);
  const aus: Staerkeeintrag[] = [];
  for (let band = a; band <= b; band++) {
    const neu = eigene
      .filter((f) => (f.anteil[band] ?? 0) > 0 && !aus.some((e) => e.familie === f))
      .sort((x, y) => (y.anteil[band] ?? 0) - (x.anteil[band] ?? 0))
      .slice(0, jeBand);
    aus.push(...neu.map((familie) => ({ familie, band })));
  }
  return aus;
}

/**
 * Die Eröffnungen als Einträge für die Liste der Praxis-Eröffnungen (engine/praxisbuch.ts):
 * [Name, Zugfolge, Gewicht]. So folgt ein Bot einer Eröffnung nach Spielstärke genau wie einer
 * aus der bisherigen Liste, und die Wahl wird im selben Format gespeichert.
 * Beispiel: Italian Game → ["Italian Game", "e4 e5 Nf3 Nc6 Bc4", 0].
 */
export function alsPraxiseintraege(
  daten: Eroeffnungsbaender,
): readonly (readonly [string, string, number])[] {
  return daten.familien.map((f) => [f.name, f.folge, 0] as const);
}

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

/** Ein Gambit (voller Lichess-Name, auch eine Variante) mit Anteil je Band. */
export interface Bandgambit {
  readonly name: string;
  readonly familie: string | null;
  readonly familieDe: string;
  readonly folge: string;
  readonly seite: Eroeffnungsseite;
  readonly anteil: readonly number[];
}

export interface Eroeffnungsbaender {
  /** Untergrenzen der Bänder (400, 600, … 2800). */
  readonly baender: readonly number[];
  /** Gezählte Partien je Band (Grundlage der Anteile). */
  readonly partienJeBand: readonly number[];
  readonly familien: readonly Bandfamilie[];
  readonly gambits: readonly Bandgambit[];
}

/** Ein Knoten im Variantenbaum: Variante, Anteil an der Eröffnung, Fortsetzungen. */
export interface Variantenknoten {
  readonly variante: Bandvariante;
  /** Anteil an allen Partien der Eröffnung in Prozent. */
  readonly anteil: number;
  readonly kinder: readonly Variantenknoten[];
}

/** Eine gewählte Eröffnung mit dem Band, in dem sie dazukam. */
export interface Staerkeeintrag<T = Bandfamilie> {
  readonly familie: T;
  /** Index des Bandes, das sie in die Liste brachte. */
  readonly band: number;
}

/** Prozent: 100. */
const HUNDERT = 100;

/** So viele neue Eröffnungen bringt jedes Band (Wunsch des Autors). */
export const JE_BAND = 3;

/** Prüft die Datei grob; null bei unbekanntem Format. */
export function eroeffnungsbaenderAus(roh: unknown): Eroeffnungsbaender | null {
  if (typeof roh !== "object" || roh === null) return null;
  const r = roh as Record<string, unknown>;
  if (!Array.isArray(r.baender) || !Array.isArray(r.familien)) return null;
  const mitAnteil = <T extends { name: string; anteil: readonly number[] }>(liste: unknown) =>
    (Array.isArray(liste) ? liste : []).filter(
      (f): f is T =>
        typeof f === "object" &&
        f !== null &&
        typeof (f as T).name === "string" &&
        Array.isArray((f as T).anteil),
    );
  return {
    baender: r.baender as number[],
    partienJeBand: Array.isArray(r.partienJeBand) ? (r.partienJeBand as number[]) : [],
    familien: mitAnteil<Bandfamilie>(r.familien),
    gambits: mitAnteil<Bandgambit>(r.gambits),
  };
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
  const eigene = daten.familien.filter((f) => f.seite === seite);
  return neueJeBand(eigene, daten.baender.length, von, bis, jeBand);
}

/**
 * Die Gambits für die Bänder von `von` bis `bis`, beide Seiten zusammen, je Band drei neue.
 * Beispiel (Lichess 2026-09): Band 800 → Englund-Gambit, Busch-Gass-Gambit, Königsgambit.
 */
export function gambitsNachStaerke(
  daten: Eroeffnungsbaender,
  von: number,
  bis: number,
  jeBand: number = JE_BAND,
): readonly Staerkeeintrag<Bandgambit>[] {
  return neueJeBand(daten.gambits, daten.baender.length, von, bis, jeBand);
}

/** Je Band die häufigsten Einträge, die noch nicht gewählt sind (gemeinsame Rechnung). */
function neueJeBand<T extends { readonly anteil: readonly number[] }>(
  liste: readonly T[],
  anzahlBaender: number,
  von: number,
  bis: number,
  jeBand: number,
): Staerkeeintrag<T>[] {
  const letztes = anzahlBaender - 1;
  const [a, b] = [Math.min(von, bis), Math.max(von, bis)].map((i) =>
    Math.max(0, Math.min(letztes, i)),
  ) as [number, number];
  const aus: Staerkeeintrag<T>[] = [];
  for (let band = a; band <= b; band++) {
    const neu = liste
      .filter((f) => (f.anteil[band] ?? 0) > 0 && !aus.some((e) => e.familie === f))
      .sort((x, y) => (y.anteil[band] ?? 0) - (x.anteil[band] ?? 0))
      .slice(0, jeBand);
    aus.push(...neu.map((familie) => ({ familie, band })));
  }
  return aus;
}

/** Wie oft die Eröffnung im ganzen Monat gewählt wurde (aus den Anteilen je Band). */
function anzahlDer(daten: Eroeffnungsbaender, familie: Bandfamilie): number {
  return familie.anteil.reduce(
    (summe, anteil, i) => summe + (anteil * (daten.partienJeBand[i] ?? 0)) / HUNDERT,
    0,
  );
}

/** Liegt die Zugfolge `kurz` am Anfang von `lang` (ganze Züge, nicht gleich)? */
function istAnfang(kurz: string, lang: string): boolean {
  return lang.length > kurz.length && lang.startsWith(`${kurz} `);
}

/**
 * Der Variantenbaum einer Eröffnung: Jede Variante hängt unter der längsten anderen, mit der ihre
 * Zugfolge beginnt; sie verzweigt also ab dem ersten abweichenden Zug. Geschwister nach
 * Häufigkeit. Wunsch des Autors (Ideensammlung, „Nur notiert“ Nr. 2).
 * Beispiel: Italienisch → Zweispringerspiel (…Sf6) mit „Modern Bishop's Opening“ (d3) und
 * „Knight Attack“ (Sg5) darunter, daneben Giuoco Piano (…Lc5).
 */
export function variantenbaum(
  daten: Eroeffnungsbaender,
  familie: Bandfamilie,
): readonly Variantenknoten[] {
  const gesamt = anzahlDer(daten, familie);
  const vater = (v: Bandvariante) =>
    familie.varianten
      .filter((w) => istAnfang(w.folge, v.folge))
      .sort((x, y) => y.folge.length - x.folge.length)[0] ?? null;
  const knoten = (eltern: Bandvariante | null): Variantenknoten[] =>
    familie.varianten
      .filter((v) => vater(v) === eltern)
      .sort((x, y) => y.anzahl - x.anzahl)
      .map((variante) => ({
        variante,
        anteil: gesamt > 0 ? Math.min(HUNDERT, (HUNDERT * variante.anzahl) / gesamt) : 0,
        kinder: knoten(variante),
      }));
  return knoten(null);
}

/**
 * Die Eröffnungen als Einträge für die Liste der Praxis-Eröffnungen (engine/praxisbuch.ts):
 * [Name, Zugfolge, Gewicht]. So folgt ein Bot einer Eröffnung nach Spielstärke genau wie einer
 * aus der bisherigen Liste, und die Wahl wird im selben Format gespeichert.
 * Beispiel: Italian Game → ["Italian Game", "e4 e5 Nf3 Nc6 Bc4", 0]. Doppelte Namen (eine Variante,
 * die auch Gambit ist) stören nicht: Die erste Zugfolge gilt (daten/laden.ts).
 */
export function alsPraxiseintraege(
  daten: Eroeffnungsbaender,
): readonly (readonly [string, string, number])[] {
  // Seit 0.3.11 auch Varianten und Gambits: Sie sind im Variantenbaum und in der Gambit-Liste wählbar.
  return [
    ...daten.familien.map((f) => [f.name, f.folge, 0] as const),
    ...daten.familien.flatMap((f) => f.varianten.map((v) => [v.name, v.folge, 0] as const)),
    ...daten.gambits.map((g) => [g.name, g.folge, 0] as const),
  ];
}

/**
 * Praxisbuch (0.2.127): die Eröffnungszüge echter Menschen je Zeitklasse und Wertungsband, gezählt
 * aus einem ganzen Monat der Lichess-Datenbank (CC0), und die Wahl eines Zuges daraus.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (24.10.2026): Bots eröffnen wie Menschen ihrer Stärke,
 * nicht nur mit den Anfänger-Eröffnungen des Buches. Ein 2200er spielt also Najdorf oder
 * Damengambit, ein 600er auch die Wayward Queen. Die Daten liegen in public/daten/praxisbuch.json
 * (erzeugt lokal in buch/arbeit/praxisbuch/, nicht von Hand ändern): je Zugfolge ab der
 * Grundstellung und je Zelle (Zeitklasse und 200er-Band der ziehenden Seite) die Summe aller
 * gezählten Antworten und die häufigen Züge mit ihrer Anzahl. Ein Bot zieht nach dieser
 * Häufigkeit. Die seltenen, nicht aufgenommenen Züge sind der Anteil, mit dem ein Mensch hier
 * eigene Wege geht; dann endet das Buch und das Wahlmodell übernimmt (engine/zugwahl.ts). Es endet
 * auch, wenn die Zugfolge zu selten ist oder die Buchtiefe des Bots erreicht ist: Theoretiker
 * spielen länger Theorie, Hektiker kürzer (BUCHTIEFE).
 * Abhängigkeiten: keine (reine Daten und Rechnung; Laden in ui/ und in den Messläufen).
 */

/** Zeitklassen wie im Elo-Modell (spiel/elomodell.ts). */
export type Praxistempo = "blitz" | "rapid" | "classical";

export interface Praxisbuch {
  readonly zeitklassen: readonly Praxistempo[];
  /** Untergrenzen der Bänder, aufsteigend (400, 600, …). */
  readonly baender: readonly number[];
  /**
   * Zugfolge (SAN mit Leerzeichen, "" für die Grundstellung) → Zelle (Index) → [Summe, Zug,
   * Anzahl, Zug, Anzahl, …]. Zelle = Zeitklasse · Zahl der Bänder + Band.
   */
  readonly knoten: Readonly<Record<string, Readonly<Record<string, readonly (string | number)[]>>>>;
  /** Die häufigsten benannten Eröffnungen der Lichess-Liste: [Name, Zugfolge (SAN), Anzahl]. */
  readonly eroeffnungen?: readonly (readonly [string, string, number])[];
}

/** Die Zugfolge einer benannten Eröffnung aus der Praxis, leer, wenn es sie nicht gibt. */
export function praxislinie(buch: Praxisbuch, name: string): readonly string[] {
  const eintrag = (buch.eroeffnungen ?? []).find(([n]) => n === name);
  return eintrag ? eintrag[1].split(" ") : [];
}

/**
 * Der Zug einer festgelegten Linie, solange die Partie ihr folgt, sonst null.
 * Beispiel: Linie e4 c5 Nf3, bisher e4 c5 → Nf3; bisher e4 e5 → null.
 */
export function linienzug(linie: readonly string[], verlauf: readonly string[]): string | null {
  if (linie.length <= verlauf.length) return null;
  return verlauf.every((san, i) => linie[i] === san) ? (linie[verlauf.length] ?? null) : null;
}

/** Wie viele Halbzüge ein Bot höchstens aus dem Praxisbuch spielt, je nach Persönlichkeit. */
export const BUCHTIEFE = { theoretiker: 20, standard: 16, hektiker: 10 } as const;

/** Die Buchtiefe zu einer Persönlichkeit (Charaktername in engine/gegnerbau.ts). */
export function buchtiefeVon(charakter: string | undefined): number {
  if (charakter === "theoretiker") return BUCHTIEFE.theoretiker;
  if (charakter === "hektiker") return BUCHTIEFE.hektiker;
  return BUCHTIEFE.standard;
}

/** Ein Zug des Praxisbuchs mit seiner Anzahl. */
export interface Praxiszug {
  readonly san: string;
  readonly anzahl: number;
}

/** Die Verteilung an einer Stelle: häufige Züge und Anteil der übrigen (Buchende). */
export interface Praxisverteilung {
  readonly zuege: readonly Praxiszug[];
  /** Anteil der Menschen, die hier einen seltenen Zug spielen (0 bis 1). */
  readonly rest: number;
}

function bandindex(buch: Praxisbuch, wertung: number): number {
  let index = 0;
  buch.baender.forEach((untergrenze, i) => {
    if (wertung >= untergrenze) index = i;
  });
  return index;
}

/**
 * Die Zellen, in denen gesucht wird, der Reihe nach: eigene Zeitklasse und eigenes Band, dann
 * Schnellschach im selben Band, dann die Nachbarbänder der eigenen Zeitklasse (dünne Zellen wie
 * Klassisch über 2400 haben wenige Stellungen).
 * Beispiel: Klassisch, 2500 → Klassisch 2400, Schnellschach 2400, Klassisch 2200, Klassisch 2600.
 */
export function zellenFuer(buch: Praxisbuch, tempo: Praxistempo, wertung: number): number[] {
  const anzahl = buch.baender.length;
  const band = bandindex(buch, wertung);
  const klasse = Math.max(0, buch.zeitklassen.indexOf(tempo));
  const schnell = Math.max(0, buch.zeitklassen.indexOf("rapid"));
  const paare: readonly (readonly [number, number])[] = [
    [klasse, band],
    [schnell, band],
    [klasse, band - 1],
    [klasse, band + 1],
  ];
  const zellen = paare.filter(([, b]) => b >= 0 && b < anzahl).map(([k, b]) => k * anzahl + b);
  return [...new Set(zellen)];
}

/**
 * Die Verteilung nach einer Zugfolge in der ersten Zelle, die Daten hat; null außerhalb des Buches.
 * Beispiel: [] in Schnellschach 1600 → e4 etwa 55 %, d4 etwa 25 %, …, Rest wenige Prozent.
 */
export function praxisverteilung(
  buch: Praxisbuch,
  verlauf: readonly string[],
  zellen: readonly number[],
): Praxisverteilung | null {
  const knoten = buch.knoten[verlauf.join(" ")];
  if (!knoten) return null;
  for (const zelle of zellen) {
    const eintrag = knoten[String(zelle)];
    if (!eintrag || eintrag.length < 3) continue;
    const summe = Number(eintrag[0]);
    const zuege: Praxiszug[] = [];
    for (let i = 1; i + 1 < eintrag.length; i += 2) {
      zuege.push({ san: String(eintrag[i]), anzahl: Number(eintrag[i + 1]) });
    }
    const genommen = zuege.reduce((s, z) => s + z.anzahl, 0);
    if (summe <= 0 || genommen <= 0) continue;
    return { zuege, rest: Math.max(0, 1 - genommen / summe) };
  }
  return null;
}

/**
 * Wählt einen Zug aus dem Praxisbuch oder null (Buch zu Ende: zu tief, unbekannte Zugfolge oder
 * ein Mensch würde hier einen seltenen Zug spielen).
 * Eingaben: Buch, bisherige Züge ab der Grundstellung (SAN), Zeitklasse, Wertung der Seite am Zug,
 * Buchtiefe, Zufallsquelle. Beispiel: 1600, Schnellschach, nach 1. e4 c5 → meist 2. Sf3, oft 2. Sc3.
 */
export function praxiszug(
  buch: Praxisbuch,
  verlauf: readonly string[],
  lage: { readonly tempo: Praxistempo; readonly wertung: number; readonly tiefe: number },
  zufall: () => number,
): string | null {
  if (verlauf.length >= lage.tiefe) return null;
  const verteilung = praxisverteilung(buch, verlauf, zellenFuer(buch, lage.tempo, lage.wertung));
  if (!verteilung || zufall() < verteilung.rest) return null;
  const summe = verteilung.zuege.reduce((s, z) => s + z.anzahl, 0);
  let wurf = zufall() * summe;
  for (const zug of verteilung.zuege) {
    wurf -= zug.anzahl;
    if (wurf < 0) return zug.san;
  }
  return verteilung.zuege[verteilung.zuege.length - 1]?.san ?? null;
}

/** Prüft die Rohdaten (aus JSON) und gibt das Buch zurück, sonst null. */
export function praxisbuchAus(roh: unknown): Praxisbuch | null {
  if (typeof roh !== "object" || roh === null) return null;
  const r = roh as Record<string, unknown>;
  if (!Array.isArray(r.zeitklassen) || !Array.isArray(r.baender)) return null;
  if (typeof r.knoten !== "object" || r.knoten === null) return null;
  return r as unknown as Praxisbuch;
}

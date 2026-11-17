/**
 * Auswahl einer Startstellung aus dem Vorrat Bot gegen Bot (inhalte/abenteuer/stellungsvorrat.json,
 * erzeugt von pipeline/abenteuer/stellungsvorrat.py): passend zur Stärke des Gegners, zufällig und
 * ohne Wiederholung, bis der Vorrat eines Formats durch ist (Wunsch des Autors, 17.11.2026).
 *
 * Rolle im Gesamtbild: Reine Regel ohne Speicher und Engine. Die Anbindung (anbindung/dienste.ts)
 * lädt den Vorrat, ruft `waehleAusVorrat`, merkt die Kennung im Spielstand (`vorratGenutzt`) und
 * baut daraus Startstellung, Farbe und Vorgeschichte des Auftrags.
 * Abhängigkeiten: keine.
 * Beispiel: Gegner mit Zielstärke 1300, Format „vorteil“ → ein Eintrag aus „band3“, den der Leser
 * noch nicht hatte.
 */

/** Ein Eintrag des Vorrats. */
export interface Vorratseintrag {
  readonly kennung: string;
  readonly fen: string;
  /** Zugfolge ab der Grundstellung (SAN, englisch) für den erzählten Einstieg. */
  readonly zuege: readonly string[];
  /** Bewertung aus Sicht der Seite am Zug, wie geprüft (Bauern). */
  readonly bewertung: number;
}

/** Die Formate des Vorrats (Startstellung `vorrat` in begegnungen.json). */
export type Vorratsformat = "stellungsduell" | "vorteil" | "endspielSieg" | "endspielRemis";

/** Ein Stärkeband des Vorrats. */
export interface Vorratsband {
  readonly kennung: string;
  readonly eloVon: number;
  readonly eloBis: number;
  readonly formate: Readonly<Record<Vorratsformat, readonly Vorratseintrag[]>>;
}

/** Der ganze Vorrat. */
export interface Stellungsvorrat {
  readonly baender: readonly Vorratsband[];
}

/**
 * Das Band zu einer Stärke; außerhalb aller Bänder das nächste am Rand.
 * Beispiel: 1300 bei Bändern 900–1200, 1200–1500 → das zweite.
 */
export function bandZu(vorrat: Stellungsvorrat, elo: number): Vorratsband | null {
  const passend = vorrat.baender.find((b) => elo >= b.eloVon && elo < b.eloBis);
  if (passend) return passend;
  const sortiert = [...vorrat.baender].sort((a, b) => a.eloVon - b.eloVon);
  const erstes = sortiert[0];
  if (!erstes) return null;
  return elo < erstes.eloVon ? erstes : (sortiert[sortiert.length - 1] ?? null);
}

/**
 * Wählt einen Eintrag: zufällig unter denen, die der Leser noch nicht hatte; sind alle schon
 * gespielt, beginnt der Vorrat von vorn (dann zufällig unter allen).
 * Eingaben: Vorrat, Format, Zielstärke des Gegners, genutzte Kennungen, Zufall in [0, 1).
 * Ausgabe: der Eintrag oder null, wenn das Format im Band leer ist.
 */
export function waehleAusVorrat(
  vorrat: Stellungsvorrat,
  format: Vorratsformat,
  elo: number,
  genutzt: readonly string[],
  zufall: () => number,
): Vorratseintrag | null {
  const eintraege = bandZu(vorrat, elo)?.formate[format] ?? [];
  if (eintraege.length === 0) return null;
  const frisch = eintraege.filter((e) => !genutzt.includes(e.kennung));
  const auswahl = frisch.length > 0 ? frisch : eintraege;
  return auswahl[Math.floor(zufall() * auswahl.length)] ?? auswahl[0] ?? null;
}

/**
 * Die genutzten Kennungen nach einer Wahl; ist ein Format durch, fällt seine alte Liste weg,
 * damit die Runde von vorn wieder ohne Wiederholung läuft.
 * Beispiel: Band mit a, b; genutzt [a], gewählt b → [a, b]; danach a → [a] (neue Runde).
 */
export function genutztNach(
  genutzt: readonly string[],
  eintrag: Vorratseintrag,
  alleDesFormats: readonly Vorratseintrag[],
): string[] {
  const kennungen = new Set(alleDesFormats.map((e) => e.kennung));
  const warDurch = alleDesFormats.every((e) => genutzt.includes(e.kennung));
  const bleibt = warDurch ? genutzt.filter((k) => !kennungen.has(k)) : genutzt;
  return [...bleibt.filter((k) => k !== eintrag.kennung), eintrag.kennung];
}

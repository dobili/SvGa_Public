/**
 * Kleine Tabellen zum Ton aus dem Paket: welche Musikstücke nur einmal spielen
 * (`musik/einmal.json`) und um wie viel Dezibel leise Geräusche angehoben werden
 * (`klang/pegel.json`).
 *
 * Rolle im Gesamtbild: ton/tonspieler.ts liest die Tabellen einmal und fragt hier je Datei nach.
 * Erzeugt werden sie im privaten Repository (pipeline/abenteuer/ton/musikbau.py, Satzplan
 * `schleife=False`; pipeline/abenteuer/ton/klangpegel.py), der Paketbau übernimmt sie
 * (app/skripte/baue-abenteuerpaket.mjs, `kopiereTon`). Fehlt eine Tabelle oder ist sie kaputt,
 * gilt: alles als Schleife, nichts angehoben (docs/spiel/23_Technik_Atmosphaere.md, Grundsätze:
 * Das Spiel läuft auch ohne Tondateien fehlerfrei).
 * Abhängigkeiten: keine (Laden kommt von außen).
 */

/** Liest eine Paketdatei als Bytes; null, wenn es sie nicht gibt (wie im Tonspieler). */
export type Bytesladen = (pfad: string) => Promise<ArrayBuffer | null>;

export interface Tonangaben {
  /** Dateinamen ohne Endung der Stücke, die nicht als Schleife laufen (etwa „ambrose.walzer“). */
  readonly einmalig: ReadonlySet<string>;
  /** Anhebung in Dezibel je Geräusch ohne Endung (etwa „kerze“ → 8). */
  readonly anhebungDb: ReadonlyMap<string, number>;
}

export const KEINE_TONANGABEN: Tonangaben = { einmalig: new Set(), anhebungDb: new Map() };

export const EINMAL_PFAD = "musik/einmal.json";
export const PEGEL_PFAD = "klang/pegel.json";
/** Obergrenze der Anhebung wie in klangpegel.py; mehr hebt das Rauschen der Aufnahme zu stark. */
export const HOECHSTE_ANHEBUNG_DB = 8;
const DB_JE_FAKTOR_10 = 20;

/**
 * Der Dateiname ohne Ordner und Endung, unter dem die Tabellen eine Datei führen.
 * Beispiel: „musik/ambrose.walzer.m4a“ → „ambrose.walzer“; „klang/kerze.ogg“ → „kerze“.
 */
export function stammVon(pfad: string): string {
  return (pfad.split("/").pop() ?? pfad).replace(/\.(m4a|ogg)$/, "");
}

/**
 * Lineare Verstärkung zu einer Anhebung in Dezibel, begrenzt auf 0 bis `HOECHSTE_ANHEBUNG_DB`.
 * Beispiele: 0 → 1; 6 → etwa 2; 20 (zu viel) → wie 8, etwa 2,5.
 */
export function verstaerkung(db: number): number {
  const begrenzt = Math.min(HOECHSTE_ANHEBUNG_DB, Math.max(0, db));
  return 10 ** (begrenzt / DB_JE_FAKTOR_10);
}

/** Punkte der Kennlinie für die weiche Begrenzung (genug für einen glatten Verlauf). */
const KENNLINIE_PUNKTE = 2049;
/** Spitzen bleiben unter −1 dBFS wie in musikbau.py (`SPITZE_DB`). */
const SPITZE_DB = -1;
const SPITZE = 10 ** (SPITZE_DB / DB_JE_FAKTOR_10);

/**
 * Hebt um `db` an und fängt Spitzen weich ab: ein Wellenformer mit der Kennlinie
 * Spitze · tanh(Faktor · x / Spitze), wie musikbau.py `angleichen`. Warum nicht nur ein Regler:
 * Die leisen Geräusche (Uhr, Holzknacken) haben kurze Spitzen bei −4 dBFS; um 8 dB angehoben
 * würden sie hart übersteuern und knacken. Leise Stellen bleiben nahezu linear.
 */
export function weicheAnhebung(ctx: BaseAudioContext, db: number): WaveShaperNode {
  const faktor = verstaerkung(db);
  const kennlinie = new Float32Array(KENNLINIE_PUNKTE);
  const mitte = (KENNLINIE_PUNKTE - 1) / 2;
  for (let i = 0; i < KENNLINIE_PUNKTE; i++) {
    const x = (i - mitte) / mitte;
    kennlinie[i] = SPITZE * Math.tanh((faktor * x) / SPITZE);
  }
  const former = ctx.createWaveShaper();
  former.curve = kennlinie;
  former.oversample = "2x";
  return former;
}

/** Liest eine JSON-Tabelle; fehlt sie oder ist sie kaputt, null (mit Warnung bei Kaputtem). */
async function liesJson(lade: Bytesladen, pfad: string): Promise<unknown> {
  const bytes = await lade(pfad);
  if (!bytes) return null;
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch (fehler: unknown) {
    console.warn(`Tontabelle nicht lesbar: ${pfad}`, fehler);
    return null;
  }
}

/** Die Liste der einmaligen Stücke; nur Zeichenketten zählen. */
export function einmaligAus(roh: unknown): Set<string> {
  if (!Array.isArray(roh)) return new Set();
  return new Set(roh.filter((eintrag): eintrag is string => typeof eintrag === "string"));
}

/** Die Pegeltabelle; nur endliche Zahlen zählen. Beispiel: {"kerze": 8} → Map(kerze → 8). */
export function anhebungAus(roh: unknown): Map<string, number> {
  const tabelle = new Map<string, number>();
  if (typeof roh !== "object" || roh === null || Array.isArray(roh)) return tabelle;
  for (const [name, wert] of Object.entries(roh)) {
    if (typeof wert === "number" && Number.isFinite(wert)) tabelle.set(name, wert);
  }
  return tabelle;
}

/** Lädt beide Tabellen; was fehlt, bleibt leer. */
export async function ladeTonangaben(lade: Bytesladen): Promise<Tonangaben> {
  const [einmal, pegel] = await Promise.all([
    liesJson(lade, EINMAL_PFAD),
    liesJson(lade, PEGEL_PFAD),
  ]);
  return { einmalig: einmaligAus(einmal), anhebungDb: anhebungAus(pegel) };
}

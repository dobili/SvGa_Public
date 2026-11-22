/**
 * Musik in Spuren (Klangplan A0.1 und A0.6, Auftrag des Hauptchats, 22.11.2026): Welche Spuren
 * eines Ortsthemas wie laut klingen.
 *
 * Warum: Die neuen Ortsthemen kommen in bis zu drei Spuren gleicher Länge (Grund = Begleitung und
 * Bass, Melodie, Zusatz in Mono für Musiker, Jukebox und Steigerung). Die App mischt sie je Lage:
 * - Tag: Grund und Melodie; Innenraum: dieselben, 2 dB leiser (Ziel −20 statt −18 LUFS).
 * - Gegen Ermüdung: nach `vollSchleifen` vollen Schleifen auf derselben Karte eine Schleife nur
 *   der Grund, dann wieder voll (Regel 3 in A0, „Spuren weg statt Pause“).
 * - Musiker nah: Die Zusatzspur folgt der Abstandskurve der räumlichen Geräusche
 *   (ton/geraeuschraum.ts) zur Figur oder Jukebox, die die Szene markiert.
 * - Steigerung (Clubkampf, Turnier, Simultan; Stück mit `kampf` in spuren.json): Grund, nach dem
 *   ersten Sieg die Melodie, nach dem zweiten der Zusatz.
 * - Dünne Mischungen sind leiser; `ausgleichDb` hebt sie auf das Ziel (A0.6: −18 bis −20 LUFS).
 * Die Nachtfassung ist ein eigenes Stück (orte.json `musik_nacht`) und mischt wie jedes andere.
 *
 * Vertrag mit der Pipeline (`musik/spuren.json` im Paket, geschrieben von mittel-4):
 *   { "maple-falls": { "form": 2205000, "rate": 44100, "spuren": ["grund", "melodie", "zusatz"],
 *     "kampf": false, "lufs": { "grund": -24.1, "grund+melodie": -18.3 } } }
 * Dateien: `musik/<stamm>.<spur>.m4a` (etwa musik/maple-falls.grund.m4a). Steht ein Stück nicht
 * in der Tabelle, spielt die volle Mischung `musik/<stamm>.m4a` wie bisher.
 * Abhängigkeiten: keine (reine Rechnung; Web Audio in ton/spurenspieler.ts).
 */

/** Die drei Spuren in fester Reihenfolge (so wächst auch die Steigerung). */
export const SPUREN = ["grund", "melodie", "zusatz"] as const;
export type Spurname = (typeof SPUREN)[number];

/** Angaben eines Stücks aus spuren.json. */
export interface Spurangabe {
  /** Länge der Form in Abtastwerten (ohne AAC-Vorlauf). */
  readonly form: number;
  readonly rate: number;
  readonly spuren: readonly Spurname[];
  /** Kampfthema: Steigerung je Sieg statt Ausdünnen. */
  readonly kampf: boolean;
  /** Gemessene Lautheit je Mischung (Schlüssel: Spuren mit „+“), wo die Pipeline sie kennt. */
  readonly lufs: Readonly<Record<string, number>>;
}

/** Was die Regie über die Lage weiß. */
export interface Mischlage {
  readonly innen: boolean;
  /** Gewonnene Partien oder bestandene Runden, seit das Kampfthema spielt. */
  readonly siege: number;
  /** Nähe 0 bis 1 zum Musiker oder zur Jukebox (Abstandskurve der Geräusche). */
  readonly musikerNaehe: number;
}

export const GRUNDLAGE: Mischlage = { innen: false, siege: 0, musikerNaehe: 0 };

/** Ziel der Lautheit am Tag und im Innenraum (LUFS, A0.6). */
export const ZIEL_LUFS = -18;
export const ZIEL_INNEN_LUFS = -20;
/** Höchstens so viel hebt der Ausgleich an (wie die Anhebung leiser Geräusche). */
export const HOECHSTER_AUSGLEICH_DB = 8;
/**
 * Ausgleich ohne Messung (dB), aus den Messungen des Probestücks (A0.6: dünne Mischungen −22,6 bis
 * −27,6 LUFS gegen −18): nur Grund +5, Grund und Melodie wie gerendert.
 */
const AUSGLEICH_OHNE_MESSUNG: Readonly<Record<string, number>> = { grund: 5 };
/** Mindestens so viele volle Schleifen vor dem Ausdünnen, höchstens so viele (A0: 2 bis 3). */
const VOLL_MINDESTENS = 2;
const VOLL_HOECHSTENS = 3;
/** Voll klingt das Thema mindestens so lange am Stück (Sekunden), bevor es ausdünnt. */
const VOLL_SEKUNDEN = 120;

/** Abtastrate der Pipeline, wenn spuren.json keine nennt. */
const RATE_VORGABE = 44100;
const DEZIBEL_JE_ZEHNFACH = 20;
const ZEHN = 10;

/** Die Länge der Form in Sekunden. Beispiel: 2 205 000 bei 44 100 → 50 s. */
export function formSekunden(a: Spurangabe): number {
  return a.form / a.rate;
}

/**
 * So viele volle Schleifen, bevor eine ausgedünnte kommt: genug für zwei Minuten, aber 2 bis 3.
 * Beispiele: 50 s → 3; 64 s → 2; 30 s → 3.
 */
export function vollSchleifen(a: Spurangabe): number {
  const noetig = Math.ceil(VOLL_SEKUNDEN / formSekunden(a));
  return Math.min(VOLL_HOECHSTENS, Math.max(VOLL_MINDESTENS, noetig));
}

/**
 * Ist die Schleife Nummer `n` (ab 0, gezählt seit dem Betreten der Karte) ausgedünnt? Nach
 * `voll` vollen eine dünne, dann wieder `voll` volle. Beispiel voll = 3: 0, 1, 2 voll, 3 dünn.
 */
export function istAusgeduennt(n: number, voll: number): boolean {
  return n >= voll && n % (voll + 1) === voll;
}

/** Anteile 0 bis 1 je Spur ohne Ausgleich. */
export type Anteile = Readonly<Record<Spurname, number>>;

/** Welche Spuren in dieser Lage klingen (vor Ausgleich). */
export function anteile(a: Spurangabe, lage: Mischlage, schleife: number): Anteile {
  const da = (s: Spurname) => (a.spuren.includes(s) ? 1 : 0);
  if (a.kampf) {
    // Steigerung: Grund, dann Melodie, dann Zusatz (Battle Subway, A0.1 Punkt 3).
    const stufe = Math.min(SPUREN.length, 1 + lage.siege);
    return {
      grund: da("grund"),
      melodie: stufe >= 2 ? da("melodie") : 0,
      zusatz: stufe >= 3 ? da("zusatz") : 0,
    };
  }
  const duenn = !lage.innen && istAusgeduennt(schleife, vollSchleifen(a));
  return {
    grund: da("grund"),
    melodie: duenn ? 0 : da("melodie"),
    zusatz: da("zusatz") * Math.min(1, Math.max(0, lage.musikerNaehe)),
  };
}

/** Schlüssel einer Mischung für die Messungen: „grund+melodie“ (Zusatz ab der Hälfte dabei). */
export function mischungsschluessel(t: Anteile): string {
  const halb = 0.5;
  return SPUREN.filter((s) => t[s] >= halb).join("+");
}

/**
 * Ausgleich in dB, damit die Mischung beim Ziel liegt: gemessen (spuren.json), sonst die Vorgabe;
 * nie leiser als gerendert und höchstens +8 dB. Im Innenraum 2 dB weniger.
 * Beispiel: nur Grund, gemessen −24,1 LUFS, draußen → +6,1 dB.
 */
export function ausgleichDb(a: Spurangabe, t: Anteile, innen: boolean): number {
  const schluessel = mischungsschluessel(t);
  const gemessen = a.lufs[schluessel];
  const roh =
    gemessen === undefined ? (AUSGLEICH_OHNE_MESSUNG[schluessel] ?? 0) : ZIEL_LUFS - gemessen;
  const begrenzt = Math.min(HOECHSTER_AUSGLEICH_DB, Math.max(0, roh));
  return begrenzt + (innen ? ZIEL_INNEN_LUFS - ZIEL_LUFS : 0);
}

/**
 * Verstärkung je Spur für Web Audio: Anteil mal Ausgleich der Mischung.
 * Beispiel: Tag, ohne Musiker, Schleife 0 → { grund: 1, melodie: 1, zusatz: 0 }.
 */
export function mischung(a: Spurangabe, lage: Mischlage, schleife: number): Anteile {
  const t = anteile(a, lage, schleife);
  const faktor = ZEHN ** (ausgleichDb(a, t, lage.innen) / DEZIBEL_JE_ZEHNFACH);
  return { grund: t.grund * faktor, melodie: t.melodie * faktor, zusatz: t.zusatz * faktor };
}

/** Ist der Wert eine gültige Angabe (Form und Rate positiv, Spuren bekannt, Grund dabei)? */
function alsAngabe(roh: unknown): Spurangabe | null {
  if (typeof roh !== "object" || roh === null) return null;
  const r = roh as Record<string, unknown>;
  const spuren = Array.isArray(r.spuren)
    ? r.spuren.filter((s): s is Spurname => SPUREN.includes(s as Spurname))
    : [];
  if (typeof r.form !== "number" || r.form <= 0 || !spuren.includes("grund")) return null;
  const rate = typeof r.rate === "number" && r.rate > 0 ? r.rate : RATE_VORGABE;
  const lufs: Record<string, number> = {};
  if (typeof r.lufs === "object" && r.lufs !== null)
    for (const [k, v] of Object.entries(r.lufs)) if (typeof v === "number") lufs[k] = v;
  return { form: r.form, rate, spuren, kampf: r.kampf === true, lufs };
}

/** Die Tabelle aus spuren.json (Stamm → Angabe); Ungültiges fällt weg. */
export function spurtabelleAus(roh: unknown): Map<string, Spurangabe> {
  const tabelle = new Map<string, Spurangabe>();
  if (typeof roh !== "object" || roh === null) return tabelle;
  for (const [stamm, wert] of Object.entries(roh)) {
    const angabe = alsAngabe(wert);
    if (angabe) tabelle.set(stamm, angabe);
  }
  return tabelle;
}

/** Pfad einer Spurdatei. Beispiel: („maple-falls“, „grund“) → musik/maple-falls.grund.m4a. */
export function spurpfad(stamm: string, spur: Spurname): string {
  return `musik/${stamm}.${spur}.m4a`;
}

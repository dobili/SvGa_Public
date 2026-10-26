/**
 * Hilfe des Messlaufs spiel/zugklassen.messung.ts: aus den Zählungen je Spieler die Quantile je
 * Zeitklasse und Band, die Datei spiel/zugklassenvergleich-daten.ts und ein Bericht mit dem
 * Vergleich zur bisherigen Tabelle.
 *
 * Warum eigene Datei: Der Messlauf bliebe sonst über 400 Zeilen (Regel 4 in CLAUDE.md).
 * Abhängigkeiten: spiel/zugklassenvergleich-daten.ts (bisherige Tabelle, nur für den Vergleich).
 */
import type { Zugklasse } from "../auswertung";
import { ZUGKLASSEN_UEBLICH } from "../zugklassenvergleich-daten";

const PROZENT = 100;
const QUANTILE = [0.05, 0.5, 0.95] as const;

/** Quantil einer sortierten Liste, linear zwischen den Nachbarn. */
function quantil(sortiert: readonly number[], q: number): number {
  if (sortiert.length === 0) return 0;
  const lage = (sortiert.length - 1) * q;
  const unten = Math.floor(lage);
  const a = sortiert[unten] ?? 0;
  const b = sortiert[Math.min(sortiert.length - 1, unten + 1)] ?? a;
  return a + (lage - unten) * (b - a);
}

const zahl = (x: number) => (Math.round(x * 10) / 10).toFixed(1);
/** Zwei Nachkommastellen, damit seltene Klassen (brillant um 0,3 %) nicht auf 0 fallen. */
const genau = (x: number) => (Math.round(x * 100) / 100).toString();

/** Die Anteile (Prozent) je Zeitklasse, Band und Klasse über die Spieler mit genug Zügen. */
function anteile(
  zaehlung: Readonly<Record<string, Readonly<Record<string, number>>>>,
  klassen: readonly Zugklasse[],
  mindestens: number,
) {
  const je = new Map<string, Map<Zugklasse, number[]>>();
  for (const [schluessel, z] of Object.entries(zaehlung)) {
    const [tempo, band] = schluessel.split("|");
    const summe = Object.values(z).reduce((s, n) => s + n, 0);
    if (summe < mindestens || !tempo || !band) continue;
    const ziel = `${tempo}|${band}`;
    if (!je.has(ziel)) je.set(ziel, new Map(klassen.map((k) => [k, []])));
    for (const k of klassen)
      je.get(ziel)
        ?.get(k)
        ?.push(((z[k] ?? 0) / summe) * PROZENT);
  }
  return je;
}

/**
 * Tabelle und Bericht. Eingaben: Zählungen „Zeitklasse|Band|Spieler“ → Klasse → Zahl, die
 * Klassen, die Mindestzahl der Züge je Spieler. Bänder mit weniger als 30 Spielern fehlen.
 */
export function zugklassenTabelle(
  zaehlung: Readonly<Record<string, Readonly<Record<string, number>>>>,
  klassen: readonly Zugklasse[],
  mindestens: number,
): { tabelle: string; bericht: string } {
  const MINDEST_SPIELER = 30;
  const je = anteile(zaehlung, klassen, mindestens);
  const bericht: string[] = ["Zeitklasse Band Spieler | Klasse: neu [5 %, Median, 95 %] / bisher"];
  const tempi: Record<string, string[]> = { blitz: [], rapid: [], classical: [] };
  const sortiert = [...je.entries()].sort(([a], [b]) => {
    const [ta, ba] = a.split("|");
    const [tb, bb] = b.split("|");
    return (ta ?? "").localeCompare(tb ?? "") || Number(ba) - Number(bb);
  });
  for (const [schluessel, werte] of sortiert) {
    const [tempo = "", band = ""] = schluessel.split("|");
    const spieler = werte.get(klassen[0] ?? "bester")?.length ?? 0;
    if (spieler < MINDEST_SPIELER) continue;
    bericht.push(`${tempo} ${band}: ${spieler} Spieler`);
    const zeilen: string[] = [];
    for (const k of klassen) {
      const liste = [...(werte.get(k) ?? [])].sort((a, b) => a - b);
      const q = QUANTILE.map((x) => quantil(liste, x));
      // Seltene Klassen (brillant): Der Median der Spieler ist oft 0; dann gilt das Mittel.
      if (q[1] === 0) q[1] = liste.reduce((s, x) => s + x, 0) / Math.max(1, liste.length);
      zeilen.push(`      ${k}: [${q.map(genau).join(", ")}],`);
      const alt = (
        ZUGKLASSEN_UEBLICH as Record<string, Record<string, Record<string, readonly number[]>>>
      )[tempo]?.[band]?.[k];
      bericht.push(`  ${k}: [${q.map(zahl).join(", ")}]${alt ? ` / [${alt.join(", ")}]` : ""}`);
    }
    tempi[tempo]?.push(`    "${band}": {\n${zeilen.join("\n")}\n    },`);
  }
  const kopf = `/**
 * Übliche Anteile aller zehn Zugklassen (Prozent der eigenen Züge) je Zeitklasse und Elo-Band aus
 * den Spielerprofilen (77 000 Lichess-Partien, 3 900 Spieler), erzeugt am ${new Date().toISOString().slice(0, 10)} vom Messlauf
 * spiel/zugklassen.messung.ts (nicht von Hand ändern). Die Klasse jedes Zuges ist mit der Regel
 * der App bestimmt (spiel/auswertung.ts, klasseVon; Opfer, Theoriekette und Gambit wie in der
 * App). Je Klasse [5-%-Quantil, Median, 95-%-Quantil] über die Spieler mit mindestens ${mindestens}
 * Zügen in Band und Zeitklasse; ist der Median 0 (seltene Klassen wie brillant), steht in der
 * Mitte das Mittel der Spieler. Bänder 400 breit nach der Elo der Partie, mit mindestens 30
 * Spielern.
 */
import type { Wertungstempo } from "../elomodell-daten";

export type Quantilklasse =
  ${klassen.map((k) => `"${k}"`).join(" | ")};

export const ZUGKLASSEN_UEBLICH: Readonly<
  Record<
    Wertungstempo,
    Readonly<Record<string, Readonly<Record<Quantilklasse, readonly [number, number, number]>>>>
  >
> = {
${Object.entries(tempi)
  .map(([tempo, baender]) => `  ${tempo}: {\n${baender.join("\n")}\n  },`)
  .join("\n")}
};
`;
  return { tabelle: kopf, bericht: bericht.join("\n") };
}

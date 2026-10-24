/**
 * Regler eigener Gegner auf den menschlichen Quantilen (Teil E, Oberfläche; 0.2.126): Stufe je
 * Fehlerart und blindem Fleck, daraus die Gewichte der Zugwahl, und die Menschlichkeit der
 * ganzen Kombination.
 *
 * Rolle im Gesamtbild: Die vorgefertigten Bots tragen seit 0.2.125 Stufen statt freier Faktoren
 * (engine/gegnerbau.ts, engine/spielerbereiche.ts). Eigene Gegner hatten im erweiterten Modus noch
 * freie Gewichte (0 bis 3, speicher/menschenwerte.ts). Jetzt stellt der Leser dieselben Stufen −4
 * bis 4 ein (−2 bis 2 menschlich, darüber „unmenschlich“; Entscheidung des Autors, 23.10.2026,
 * „Zugwahl der Bots, Plan“). Ältere Gegner mit Gewichten spielen unverändert weiter, bis der Leser
 * einen Regler bewegt; dann übersetzt naechsteStufe ihre Gewichte in Stufen.
 * Abhängigkeiten: engine/spielerbereiche.ts, engine/menschenprofil.ts, engine/blindeFlecken.ts.
 */
import { BLINDE_FLECKEN, type BlinderFleck } from "./blindeFlecken";
import type { Fehlerart } from "./fehlerart";
import { GELEGENHEITSARTEN } from "./menschenprofil";
import {
  faktorFuerStufe,
  MENSCHLICH_MAX,
  MENSCHLICH_MIN,
  STUFE_MAX,
  STUFE_MIN,
  type Bereichsteil,
} from "./spielerbereiche";

/** Stufen je Fehlerart und Fleck; fehlend heißt 0 (wie der Median der Spieler). */
export type Reglerstufen = Readonly<Partial<Record<Fehlerart | BlinderFleck, number>>>;

/** Die Arten mit Regler: Fehlerarten mit Daten der Spieler und alle blinden Flecken. */
export const REGLERARTEN: readonly (Fehlerart | BlinderFleck)[] = [
  ...GELEGENHEITSARTEN,
  ...BLINDE_FLECKEN,
];

function teilVon(art: Fehlerart | BlinderFleck): Bereichsteil {
  return (BLINDE_FLECKEN as readonly string[]).includes(art) ? "flecken" : "arten";
}

/** Eine Stufe aus Rohdaten: ganze Zahl von −4 bis 4, sonst undefined. */
export function reglerstufeAus(wert: unknown): number | undefined {
  if (typeof wert !== "number" || !Number.isInteger(wert)) return undefined;
  return wert >= STUFE_MIN && wert <= STUFE_MAX ? wert : undefined;
}

/**
 * Die Gewichte der Zugwahl aus den Stufen für die Wertung des Gegners: je Art mit Stufe der
 * Faktor zum Median der Spieler dieser Stärke (engine/spielerbereiche.ts).
 * Beispiel: { verfruehteDame: 2 } bei 1300 → verfruehteDame etwa 2,4; Stufe 0 → 1.
 */
export function gewichteAusStufen(
  stufen: Reglerstufen,
  wertung: number,
): Partial<Record<Fehlerart | BlinderFleck, number>> {
  const aus: Partial<Record<Fehlerart | BlinderFleck, number>> = {};
  for (const art of REGLERARTEN) {
    const stufe = stufen[art];
    if (stufe !== undefined) aus[art] = faktorFuerStufe(teilVon(art), art, stufe, wertung);
  }
  return aus;
}

/**
 * Die Stufe, deren Faktor einem alten Gewicht am nächsten liegt (logarithmisch); Gewicht 0 wird
 * zur niedrigsten Stufe. Beispiel: Gewicht 1 → 0; Gewicht 3 bei „bauernraub“ und 1300 → etwa 3.
 */
export function naechsteStufe(
  art: Fehlerart | BlinderFleck,
  gewicht: number,
  wertung: number,
): number {
  if (gewicht <= 0) return STUFE_MIN;
  let beste = 0;
  let abstand = Number.POSITIVE_INFINITY;
  for (let s = STUFE_MIN; s <= STUFE_MAX; s += 1) {
    const d = Math.abs(Math.log(faktorFuerStufe(teilVon(art), art, s, wertung) / gewicht));
    if (d < abstand) [beste, abstand] = [s, d];
  }
  return beste;
}

/**
 * Anteil der Spieler, die in einer Stufe mindestens so auffällig sind (beidseitig): 0 → alle,
 * ±1 (Quartile) → die Hälfte, ±2 (5- und 95-%-Quantil) → ein Zehntel, darüber niemand.
 */
const ANTEIL_JE_STUFE: Readonly<Record<number, number>> = { 0: 1, 1: 0.5, 2: 0.1 };

/** Ab diesem Anteil heißt eine Kombination „menschlich“, darunter „ungewöhnlich“. */
export const MENSCHLICH_AB = 0.05;
/** Unter diesem Anteil heißt sie „kaum noch menschlich“. */
export const UNGEWOEHNLICH_AB = 0.001;

export type Menschlichkeit = "menschlich" | "ungewoehnlich" | "kaumMenschlich" | "unmenschlich";

/**
 * Wie menschlich ist eine Kombination? Unter der vereinfachenden Annahme, dass die Arten
 * unabhängig streuen, ist der Anteil der Spieler, die in allen eingestellten Punkten mindestens so
 * auffällig sind, das Produkt der Anteile je Stufe. Eine Stufe über ±2 gibt es bei Menschen nicht.
 * Beispiel: zwei Regler auf 2, einer auf −1 → 0,1 · 0,1 · 0,5 = 0,5 % → „ungewöhnlich“.
 * Sonderfall: keine Stufe gesetzt → Anteil 1, „menschlich“.
 */
export function menschlichkeit(stufen: Reglerstufen): {
  readonly anteil: number;
  readonly urteil: Menschlichkeit;
  readonly unmenschlich: number;
} {
  const werte = REGLERARTEN.map((a) => stufen[a] ?? 0);
  const unmenschlich = werte.filter((s) => s < MENSCHLICH_MIN || s > MENSCHLICH_MAX).length;
  const anteil =
    unmenschlich > 0 ? 0 : werte.reduce((p, s) => p * (ANTEIL_JE_STUFE[Math.abs(s)] ?? 0), 1);
  const urteil: Menschlichkeit =
    unmenschlich > 0
      ? "unmenschlich"
      : anteil >= MENSCHLICH_AB
        ? "menschlich"
        : anteil >= UNGEWOEHNLICH_AB
          ? "ungewoehnlich"
          : "kaumMenschlich";
  return { anteil, urteil, unmenschlich };
}

/** Ab diesem mittleren Faktor (oder unter seinem Kehrwert) weicht die Fehlerlast deutlich ab. */
const DEUTLICH = 1.25;

/**
 * Richtung, in die die Regler die Spielstärke schieben: Das geometrische Mittel der Faktoren
 * aller Regler (Fehler öfter als Menschen → schwächer). Eine Zahl dazu gibt es erst mit einer
 * Messung; die Schätzung aus den Stufen je Phase bleibt die angezeigte Zahl.
 * Beispiel: alle Regler auf 2 → „schwaecher“; alle auf 0 → „gleich“.
 */
export function staerkerichtung(
  stufen: Reglerstufen,
  wertung: number,
): "staerker" | "gleich" | "schwaecher" {
  const g = gewichteAusStufen(stufen, wertung);
  const logs = REGLERARTEN.map((a) => Math.log(g[a] ?? 1));
  const mittel = Math.exp(logs.reduce((s, x) => s + x, 0) / logs.length);
  if (mittel >= DEUTLICH) return "schwaecher";
  if (mittel <= 1 / DEUTLICH) return "staerker";
  return "gleich";
}

/**
 * Lage einer Sprechblase neben dem Brett: Sie darf das Brett nie verdecken.
 *
 * Warum (Wunsch des Autors, 19.11.2026): Ambroses Blase lag im Hochformat auf kleinen Handys
 * teilweise auf dem Brett. Die Blasen sind fest am oberen und unteren Rand verankert
 * (huelle.css); passt eine dort nicht zwischen Rand und Brett, rückt sie auf die andere Seite
 * des Bretts, und passt sie nirgends ganz, wird sie in der größeren Lücke rollbar.
 * Abhängigkeiten: keine (reine Rechnung); angewandt von anbindung/brettfrei.ts.
 * Sonderfälle: Liegt die Blase waagerecht neben dem Brett (Querformat, rechte Spalte), bleibt
 * alles wie in der CSS.
 */

/** Senkrechte und waagerechte Grenzen eines Rechtecks in Bildschirmpunkten. */
export interface Rechteck {
  readonly top: number;
  readonly bottom: number;
  readonly left: number;
  readonly right: number;
}

/** Wo die Blase am Rand verankert ist (wie data-lage). */
export type Anker = "oben" | "unten";

/** Was die Blase an Lage überschreiben muss; null = die Lage aus der CSS passt. */
export interface Blasenstil {
  readonly top?: number;
  readonly bottom?: number;
  readonly maxHeight?: number;
}

/** Abstand zwischen Blase und Brett sowie zum Bildschirmrand, in Punkten. */
export const BLASENABSTAND = 8;

function ueberlappt(a: Rechteck, b: Rechteck): boolean {
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}

/**
 * Berechnet eine Lage der Blase, die das Brett nicht berührt.
 * Eingaben: Rechteck der Blase in ihrer CSS-Lage, Rechteck des Bretts, Höhe des Fensters, Anker.
 * Ausgabe: null, wenn die Blase das Brett nicht schneidet; sonst neue top/bottom und, falls nötig,
 * eine Höchsthöhe. Beispiel: iPhone SE hoch, Ambrose unten mit drei Zeilen (120 Punkte), unter dem
 * Brett nur 90 Punkte frei, darüber 140 → { bottom: Fenster − Brettoberkante + 8 }.
 */
export function brettfreieLage(
  blase: Rechteck,
  brett: Rechteck,
  fensterhoehe: number,
  anker: Anker,
): Blasenstil | null {
  if (!ueberlappt(blase, brett)) return null;
  const hoehe = blase.bottom - blase.top;
  const darueber = brett.top - 2 * BLASENABSTAND;
  const darunter = fensterhoehe - brett.bottom - 2 * BLASENABSTAND;
  const ueber: Blasenstil = { bottom: fensterhoehe - brett.top + BLASENABSTAND };
  const unter: Blasenstil = { top: brett.bottom + BLASENABSTAND };
  const oben = { platz: darueber, lage: ueber };
  const unten = { platz: darunter, lage: unter };
  const [zuerst, sonst] = anker === "oben" ? [oben, unten] : [unten, oben];
  if (hoehe <= zuerst.platz) return zuerst.lage;
  if (hoehe <= sonst.platz) return sonst.lage;
  const groesser = zuerst.platz >= sonst.platz ? zuerst : sonst;
  return { ...groesser.lage, maxHeight: Math.max(0, groesser.platz) };
}

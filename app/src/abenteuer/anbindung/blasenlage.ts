/**
 * Lage einer Sprechblase neben dem Brett: Sie darf das Brett nie verdecken.
 *
 * Warum (Wunsch des Autors, 19.11.2026): Ambroses Blase lag im Hochformat auf kleinen Handys
 * teilweise auf dem Brett. Die Blasen sind fest am oberen und unteren Rand verankert
 * (huelle.css); passt eine dort nicht zwischen Rand und Brett, rückt sie auf die andere Seite
 * des Bretts, und passt sie nirgends ganz, wird sie in der größeren Lücke rollbar.
 * Abhängigkeiten: keine (reine Rechnung); angewandt von anbindung/brettfrei.ts.
 * Sonderfälle: Liegt die Blase waagerecht neben dem Brett (Querformat, rechte Spalte), bleibt
 * sie, wo die CSS sie hinlegt, außer sie liegt auf einem Hauptknopf derselben Spalte
 * (knopfflaeche).
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

/**
 * Die Fläche, die eine Blase meiden muss: das Brett und die Hauptknöpfe direkt darunter oder
 * darüber.
 *
 * Warum (Spieler-Durchlauf Akt 4 mit dem schwachen Spieler, 24.11.2026): Nach einer falschen
 * Antwort erscheint unter dem Brett „Weiter“, und Ambrose spricht im selben Augenblick unten.
 * Seine Blase lag dann sekundenlang auf dem Knopf, den der Spieler gerade braucht. Rückt die
 * Blase über die ganze Fläche statt nur über das Brett, bleibt der Knopf frei.
 * Eingaben: Rechteck des Bretts, Rechtecke der sichtbaren Hauptknöpfe.
 * Ausgabe: das kleinste Rechteck um Brett und alle Knöpfe, die waagerecht unter oder über dem
 * Brett liegen. Sonderfall: Knöpfe neben dem Brett (Querformat, rechte Spalte) zählen nicht, sonst
 * fände die Blase dort keinen Platz mehr.
 */
export function sperrflaeche(brett: Rechteck, knoepfe: readonly Rechteck[]): Rechteck {
  let flaeche = brett;
  for (const k of knoepfe) {
    if (k.left >= brett.right || k.right <= brett.left || k.bottom <= k.top) continue;
    flaeche = {
      top: Math.min(flaeche.top, k.top),
      bottom: Math.max(flaeche.bottom, k.bottom),
      left: Math.min(flaeche.left, k.left),
      right: Math.max(flaeche.right, k.right),
    };
  }
  return flaeche;
}

/**
 * Die Hauptknöpfe neben dem Brett, die in der Spalte der Blase liegen (Querformat).
 *
 * Warum (schwacher Spieler-Durchlauf Akt 4 im Querformat, 24.11.2026): Quer liegen Blasen und
 * Knöpfe gemeinsam in der rechten Spalte. Nach dem Ende einer Aufgabe (Ward in der Hütte, die
 * Tafel im Diner) lag die untere Blase sekundenlang auf „Weiter“. sperrflaeche lässt solche Knöpfe
 * bewusst aus, damit die Blase am Brett Platz findet; ihnen weicht sie in einem zweiten Schritt
 * aus (brettfrei.ts), genauso wie dem Brett.
 * Eingaben: Rechtecke von Brett, Blase und den sichtbaren Hauptknöpfen.
 * Ausgabe: das kleinste Rechteck um alle Knöpfe, die waagerecht neben dem Brett und unter der
 * Blase liegen, oder null, wenn es keine gibt. Beispiel: Brett links (0 bis 400), Blase und
 * „Weiter“ rechts (420 bis 900) → das Rechteck von „Weiter“.
 */
export function knopfflaeche(
  brett: Rechteck,
  blase: Rechteck,
  knoepfe: readonly Rechteck[],
): Rechteck | null {
  let flaeche: Rechteck | null = null;
  for (const k of knoepfe) {
    const nebenBrett = k.left >= brett.right || k.right <= brett.left;
    const inSpalte = k.left < blase.right && blase.left < k.right;
    if (!nebenBrett || !inSpalte || k.bottom <= k.top) continue;
    flaeche = flaeche
      ? {
          top: Math.min(flaeche.top, k.top),
          bottom: Math.max(flaeche.bottom, k.bottom),
          left: Math.min(flaeche.left, k.left),
          right: Math.max(flaeche.right, k.right),
        }
      : k;
  }
  return flaeche;
}

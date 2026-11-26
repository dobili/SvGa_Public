/**
 * Ziele der Auftritte ohne Phaser (auftrittsbild.ts): die Übergänge einer Karte, ob ein `#gehe` in
 * einen hineinführt, und der Auslöser, der mit der Figur rückt.
 *
 * Rolle im Gesamtbild: reine Hilfen für auftrittsbild.ts, auftrittsschicht.ts und fuehrungsschicht.ts,
 * ausgelagert, damit sie ohne Phaser (das ein Fenster braucht) getestet werden können.
 * Abhängigkeiten: gefuehrterweg.ts und fuehrungsschicht.ts (nur Typen).
 */
import type { Feld, Wegziel } from "./gefuehrterweg";
import type { Fuehrungszugang } from "./fuehrungsschicht";

/** Die Felder der Übergänge dieser Karte (Auslöser mit dem Namen eines Übergangs). */
export function uebergangsfelder(z: Fuehrungszugang): { name: string; x: number; y: number }[] {
  return z.ausloeser
    .filter((a) => a.typ === "ausloeser" && z.uebergaenge.includes(a.name))
    .map((a) => ({ name: a.name, x: a.x, y: a.y }));
}

/**
 * Führt ein `#gehe` in einen Übergang? Ein Name eines Übergangs oder ein Feld auf einem.
 * Beispiel: „prattClub>schule“ → ja; „haleClub>18,5“ → nein.
 */
export function istAusgang(z: Fuehrungszugang, ziel: Wegziel): boolean {
  if ("name" in ziel) return z.uebergaenge.includes(ziel.name);
  return uebergangsfelder(z).some((u) => u.x === ziel.feld.x && u.y === ziel.feld.y);
}

/** Der Auslöser der Figur rückt mit ihr (wie ansprechschicht.ts), damit man sie dort anspricht. */
export function rueckeAusloeser(z: Fuehrungszugang, name: string, feld: Feld): void {
  const i = z.ausloeser.findIndex((a) => a.name === name && a.typ === "figur");
  const alt = z.ausloeser[i];
  if (alt) z.ausloeser[i] = { ...alt, x: feld.x, y: feld.y };
}

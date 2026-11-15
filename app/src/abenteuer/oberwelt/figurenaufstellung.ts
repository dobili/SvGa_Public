/**
 * Figuren der Karte aufstellen: feste Sprites mit Kollision auf ihren Kacheln, sitzend oder als
 * Geist, wer weiter unten steht, wird davor gezeichnet.
 *
 * Rolle im Gesamtbild: ausgelagert aus oberwelt/szene.ts (Größengrenze 400 Zeilen, Spieltest
 * „einstieg“: Zielhinweis und Tippschritt kamen dazu). Abhängigkeiten: Phaser, ausloeserebene.ts,
 * figurbilder.ts, figurensitz.ts, geistfigur.ts, szenentypen.ts.
 */
import type Phaser from "phaser";
import type { Ausloeser } from "./ausloeserebene";
import { standbild, stelleAufKachel } from "./figurbilder";
import { setzeSitzend } from "./figurensitz";
import { zeigeAlsGeist } from "./geistfigur";
import type { Szenendaten } from "./szenentypen";

/**
 * Stellt alle Figuren (Auslöser mit typ „figur“) auf und lässt den Helden mit ihnen kollidieren.
 * Eingaben: Szene, Held, Auslöser der Karte, Szenendaten (Bögen, Geister), Kachelgröße und das
 * Bild „Blick nach unten“ im Platzhalterbogen. Beispiel: Mama im Wohnzimmer auf Kachel 16,7.
 * Sonderfall: Figur ohne eigenen Bogen → Platzhalterbild „figur“.
 */
export function stelleFigurenAuf(
  szene: Phaser.Scene,
  held: Phaser.Physics.Arcade.Sprite,
  ausloeser: readonly Ausloeser[],
  daten: Pick<Szenendaten, "figurenbilder" | "geister">,
  kachel: number,
  platzhalterUnten: number,
): void {
  const gruppe = szene.physics.add.staticGroup();
  for (const a of ausloeser) {
    if (a.typ !== "figur") continue;
    const eigenes = daten.figurenbilder?.[a.name] !== undefined;
    const figur = gruppe.create(
      a.x * kachel + kachel / 2,
      a.y * kachel + kachel / 2,
      eigenes ? `figur:${a.name}` : "figur",
      eigenes ? standbild("unten") : platzhalterUnten,
    ) as Phaser.Physics.Arcade.Sprite;
    figur.setName(a.name);
    if (eigenes) stelleAufKachel(figur, kachel);
    if (eigenes && a.sitzt) setzeSitzend(figur, a.sitzt);
    if (daten.geister?.has(a.name)) zeigeAlsGeist(szene, figur);
    figur.setDepth(figur.y);
  }
  szene.physics.add.collider(held, gruppe);
}

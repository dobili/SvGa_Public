/**
 * Figuren der Karte aufstellen: feste Sprites mit Kollision auf ihren Kacheln, sitzend oder als
 * Geist, wer weiter unten steht, wird davor gezeichnet.
 *
 * Rolle im Gesamtbild: ausgelagert aus oberwelt/szene.ts (Größengrenze 400 Zeilen, Spieltest
 * „einstieg“: Zielhinweis und Tippschritt kamen dazu). Abhängigkeiten: Phaser, ausloeserebene.ts,
 * figurbilder.ts, figurensitz.ts, geistfigur.ts, sitzplatz.ts, szenentypen.ts.
 */
import type Phaser from "phaser";
import type { Ausloeser } from "./ausloeserebene";
import { standbild, stelleAufKachel } from "./figurbilder";
import { setzeSitzend } from "./figurensitz";
import { zeigeAlsGeist } from "./geistfigur";
import { sitzlageAuf, type Sitzmoebel } from "./sitzplatz";
import type { Szenendaten } from "./szenentypen";

/**
 * Stellt alle Figuren (Auslöser mit typ „figur“) auf und lässt den Helden mit ihnen kollidieren.
 * Eingaben: Szene, Held, Auslöser der Karte, Szenendaten (Bögen, Geister), Kachelgröße und das
 * Bild „Blick nach unten“ im Platzhalterbogen. Beispiel: Mama im Wohnzimmer auf Kachel 16,7.
 * Sonderfall: Figur ohne eigenen Bogen → Platzhalterbild „figur“. Eine stehende Figur mit `blick`
 * (R008, etwa „links“ zur Kundschaft am Tresen) zeigt das Standbild dieser Richtung. Eine
 * Sitzende rückt auf ihr Sitzmöbel aus `sitze` (sitzplatz.ts, sitzmoebelAus) und liegt in der
 * Tiefe knapp darüber (Spieltest Variante B, F2: Sam saß neben dem Stuhl unter der Lehne).
 */
export function stelleFigurenAuf(
  szene: Phaser.Scene,
  held: Phaser.Physics.Arcade.Sprite,
  ausloeser: readonly Ausloeser[],
  daten: Pick<Szenendaten, "figurenbilder" | "geister">,
  kachel: number,
  platzhalterUnten: number,
  sitze: readonly Sitzmoebel[] = [],
): void {
  const gruppe = szene.physics.add.staticGroup();
  for (const a of ausloeser) {
    if (a.typ !== "figur") continue;
    const eigenes = daten.figurenbilder?.[a.name] !== undefined;
    const figur = gruppe.create(
      a.x * kachel + kachel / 2,
      a.y * kachel + kachel / 2,
      eigenes ? `figur:${a.name}` : "figur",
      // Stehende schauen nach `blick` (R008), sonst nach unten; der Platzhalter immer nach unten.
      eigenes ? standbild(a.blick ?? "unten") : platzhalterUnten,
    ) as Phaser.Physics.Arcade.Sprite;
    figur.setName(a.name);
    if (eigenes) stelleAufKachel(figur, kachel);
    const sitz = a.sitzt ? sitzlageAuf(sitze, a, kachel) : null;
    if (eigenes && a.sitzt) setzeSitzend(figur, a.sitzt, sitz);
    if (daten.geister?.has(a.name)) zeigeAlsGeist(szene, figur);
    figur.setDepth(sitz?.tiefe ?? figur.y);
  }
  szene.physics.add.collider(held, gruppe);
}

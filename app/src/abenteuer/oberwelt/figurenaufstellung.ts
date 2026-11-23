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
import { erzeugeLaufanimationen, standbild, stelleAufKachel } from "./figurbilder";
import { rahmenzahl, setzeSitzend, verschiebeFigurbild } from "./figurensitz";
import { haltungAus, standbildrahmen } from "./figurzustand";
import { liegebild } from "./sitzrichtung";
import { deckeZu } from "./vordergrund";
import { zeigeAlsGeist } from "./geistfigur";
import { BODENSITZ, sitzlageAuf, type Sitzlage, type Sitzmoebel } from "./sitzplatz";
import type { Szenendaten } from "./szenentypen";

/** Liegend: eine Vierteldrehung, zwei Kacheln tiefer gezeichnet (wie fuehrungsschicht.ts). */
const LIEGEN = Math.PI / 2;
const LIEGETIEFE_KACHELN = 2;

/**
 * Stellt alle Figuren (Auslöser mit typ „figur“) auf und lässt den Helden mit ihnen kollidieren.
 * Eingaben: Szene, Held, Auslöser der Karte, Szenendaten (Bögen, Geister), Kachelgröße und das
 * Bild „Blick nach unten“ im Platzhalterbogen. Beispiel: Mama im Wohnzimmer auf Kachel 16,7.
 * Sonderfall: Figur ohne eigenen Bogen → Platzhalterbild „figur“. Eine stehende Figur mit `blick`
 * (R008, etwa „links“ zur Kundschaft am Tresen) zeigt das Standbild dieser Richtung. Eine
 * Sitzende rückt auf ihr Sitzmöbel aus `sitze` (sitzplatz.ts, sitzmoebelAus) und liegt in der
 * Tiefe knapp darüber (Spieltest Variante B, F2: Sam saß neben dem Stuhl unter der Lehne). Ein
 * feiner `versatz` (figurversatz.ts, Editor) rückt danach nur das Bild, stehend wie sitzend.
 * `zustand` und `standbild` (Karteneditor 1.9, figurzustand.ts) wählen an dieser Stelle Haltung
 * und Standbild statt der Regel.
 */
export function stelleFigurenAuf(
  szene: Phaser.Scene,
  held: Phaser.Physics.Arcade.Sprite,
  ausloeser: readonly Ausloeser[],
  daten: Pick<Szenendaten, "figurenbilder" | "geister" | "figurstandbilder">,
  kachel: number,
  platzhalterUnten: number,
  sitze: readonly Sitzmoebel[] = [],
): void {
  const gruppe = szene.physics.add.staticGroup();
  for (const a of ausloeser) {
    if (a.typ !== "figur") continue;
    const eigenes = daten.figurenbilder?.[a.name] !== undefined;
    // Zustand an dieser Stelle (Editor 1.9, figurzustand.ts); ohne ihn die Regel wie bisher.
    const haltung = haltungAus(a.zustand, a.sitzt, a.blick);
    const richtung = haltung.sitzt ?? a.blick ?? a.sitzt ?? "unten";
    const weiteres = standbildrahmen(daten.figurstandbilder?.[a.name], a.standbild, richtung);
    const figur = gruppe.create(
      a.x * kachel + kachel / 2,
      a.y * kachel + kachel / 2,
      eigenes ? `figur:${a.name}` : "figur",
      // Stehende schauen nach `blick` (R008), sonst nach unten; der Platzhalter immer nach unten.
      eigenes ? (weiteres ?? standbild(richtung)) : platzhalterUnten,
    ) as Phaser.Physics.Arcade.Sprite;
    figur.setName(a.name);
    // Lauf- und Rennanimation für geführte Wege (fuehrungsschicht.ts, `#gehe`).
    if (eigenes) erzeugeLaufanimationen(szene, `figur:${a.name}`);
    if (eigenes) stelleAufKachel(figur, kachel);
    const sitz = haltung.sitzt ? sitzlageAuf(sitze, a, kachel) : null;
    const gesessen =
      eigenes && haltung.sitzt
        ? setzeSitzend(figur, haltung.sitzt, sitzlageMitZustand(sitz, haltung.amBoden))
        : undefined;
    // Feiner Versatz aus dem Editor (figurversatz.ts): nur das Bild, nach dem Sitzen.
    if (eigenes && a.versatz) verschiebeFigurbild(figur, a.versatz, kachel, gesessen);
    if (daten.geister?.has(a.name)) zeigeAlsGeist(szene, figur);
    figur.setDepth(sitz?.tiefe ?? figur.y);
    // Liegen (Schlaf im Bett aus dem Tagesablauf oder Zustand der Szene): Liegebild aus dem Bogen,
    // sonst das gekippte Standbild, über dem Bett und unter seiner Decke (vordergrund.ts).
    if (a.liegt || haltung.liegt) legeHin(figur, eigenes, kachel);
  }
  szene.physics.add.collider(held, gruppe);
}

/**
 * Lage einer Sitzenden nach dem Zustand: auf dem Stuhl auch ohne Sitzmöbel (mit Hub, ohne
 * Verschiebung), am Boden auch auf einem Stuhl (Schneidersitz auf dessen Lage), sonst die Regel
 * (Sitzmöbel, ohne es am Boden). Beispiel: (null, false) → Stuhl ohne Möbel; (null, null) → BODENSITZ.
 */
export function sitzlageMitZustand(sitz: Sitzlage | null, amBoden: boolean | null): Sitzlage {
  if (amBoden === true) return { ...(sitz ?? BODENSITZ), amBoden: true };
  if (amBoden === false) return { ...(sitz ?? OHNE_MOEBEL), amBoden: false };
  return sitz ?? BODENSITZ;
}

/** Stuhl ohne Möbel: nicht verschoben, mit Hub (figurensitz.ts). */
const OHNE_MOEBEL: Sitzlage = { dx: 0, dy: 0, tiefe: 0, amBoden: false };

/**
 * Legt eine Figur hin: Liegebild (Kopf rechts), wenn der Bogen es hat, sonst gekippt; tiefer
 * gezeichnet, damit sie über dem Bett liegt. Auch für liegende Statisten (belebungsschicht.ts).
 */
export function legeHin(figur: Phaser.GameObjects.Sprite, eigenes: boolean, kachel: number): void {
  const bild = eigenes ? liegebild(rahmenzahl(figur), "rechts") : null;
  if (bild !== null) figur.setFrame(bild);
  else figur.setRotation(LIEGEN);
  figur.setDepth(figur.y + LIEGETIEFE_KACHELN * kachel);
  // Unter die Decke (vordergrund.ts), wie beim `#stelle … >liegt` (fuehrungsschicht.ts).
  deckeZu(figur, figur.x, figur.y, "rechts");
}

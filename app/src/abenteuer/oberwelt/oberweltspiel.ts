/**
 * Start und Ende des Phaser-Spiels der Oberwelt: Spiel in einem Element starten, sauber beenden,
 * die laufende Szene finden.
 *
 * Rolle im Gesamtbild: Hülle um oberwelt/szene.ts für oberwelt/Oberwelt.tsx, ausgelagert, damit die
 * Szene unter 400 Zeilen bleibt. Ändert sich die Größe des Elements (Gerät gedreht,
 * docs/spiel/30, Abschnitt 3), wächst das Spiel mit, und die Kamera bekommt neue Grenzen; der Held
 * bleibt, wo er ist.
 * Abhängigkeiten: phaser, szene.ts, kamera.ts.
 */
import Phaser from "phaser";
import { kameragrenzen } from "./kamera";
import { Oberweltszene, ZOOM, type Szenendaten } from "./szene";

/** Spielgröße zu einem Element: seine Fläche in Spielpixeln, mindestens ein Pixel. */
function spielgroesse(element: HTMLElement): { breite: number; hoehe: number } {
  return {
    breite: Math.max(1, Math.floor(element.clientWidth / ZOOM)),
    hoehe: Math.max(1, Math.floor(element.clientHeight / ZOOM)),
  };
}

/**
 * Passt Spiel und Kamera an die neue Größe des Elements an. Beispiel: Drehen von 390 × 844 auf
 * 844 × 390 → Spiel 281 × 130 Spielpixel (bei ZOOM 3), Kameragrenzen neu, kleine Räume mittig.
 * Sonderfall: Läuft die Szene noch nicht, genügt die neue Spielgröße (create rechnet die Grenzen).
 */
function passeAn(spiel: Phaser.Game, element: HTMLElement): void {
  const { breite, hoehe } = spielgroesse(element);
  if (breite === spiel.scale.width && hoehe === spiel.scale.height) return;
  spiel.scale.resize(breite, hoehe);
  const szene = szeneVon(spiel);
  if (!szene?.sys.isActive()) return;
  const welt = szene.physics.world.bounds;
  const kamera = szene.cameras.main;
  kamera.setSize(breite, hoehe);
  const g = kameragrenzen(welt.width, welt.height, breite, hoehe);
  kamera.setBounds(g.x, g.y, g.breite, g.hoehe);
}

/** Startet Phaser in einem Element; die Breite folgt dem Element, gezeichnet mit ZOOM. */
export function starteOberwelt(element: HTMLElement, daten: Szenendaten): Phaser.Game {
  const szene = new Oberweltszene(daten);
  const { breite, hoehe } = spielgroesse(element);
  const spiel = new Phaser.Game({
    type: Phaser.AUTO,
    parent: element,
    width: breite,
    height: hoehe,
    zoom: ZOOM,
    pixelArt: true,
    backgroundColor: "#1a1612",
    physics: { default: "arcade", arcade: { debug: false } },
    scene: szene,
    // Die App regelt Ton und Blattstapel selbst; Phaser soll keine Tastatur-Scrolls abfangen.
    input: { keyboard: { capture: [] } },
    audio: { noAudio: true },
  });
  // Drehen des Geräts: Das Spiel folgt der Größe des Elements (ohne Beobachter in alten Browsern
  // bleibt die Größe vom Start).
  if (typeof ResizeObserver !== "undefined") {
    const beobachter = new ResizeObserver(() => {
      if (spiel.isBooted) passeAn(spiel, element);
    });
    beobachter.observe(element);
    spiel.events.once(Phaser.Core.Events.DESTROY, () => beobachter.disconnect());
  }
  return spiel;
}

/**
 * Beendet ein Spiel sauber: Läuft Phaser noch hoch (der Leser hat die Ansicht sofort wieder
 * verlassen), erst nach dem Start zerstören; ein Fehler dabei darf die App nicht abstürzen lassen.
 */
export function beendeOberwelt(spiel: Phaser.Game): void {
  const zerstoere = () => {
    try {
      spiel.destroy(true);
    } catch (fehler) {
      console.warn("Oberwelt konnte nicht sauber beendet werden:", fehler);
    }
  };
  if (spiel.isBooted) zerstoere();
  else spiel.events.once(Phaser.Core.Events.READY, zerstoere);
}

/** Die laufende Szene eines Spiels (nach dem Start). */
export function szeneVon(spiel: Phaser.Game): Oberweltszene | null {
  const szene = spiel.scene.getScene("oberwelt");
  return szene instanceof Oberweltszene ? szene : null;
}

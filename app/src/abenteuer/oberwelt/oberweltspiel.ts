/**
 * Start und Ende des Phaser-Spiels der Oberwelt: Spiel in einem Element starten, sauber beenden,
 * die laufende Szene finden.
 *
 * Rolle im Gesamtbild: Hülle um oberwelt/szene.ts für oberwelt/Oberwelt.tsx, ausgelagert, damit die
 * Szene unter 400 Zeilen bleibt.
 * Abhängigkeiten: phaser, szene.ts.
 */
import Phaser from "phaser";
import { Oberweltszene, ZOOM, type Szenendaten } from "./szene";

/** Startet Phaser in einem Element; die Breite folgt dem Element, gezeichnet mit ZOOM. */
export function starteOberwelt(element: HTMLElement, daten: Szenendaten): Phaser.Game {
  const szene = new Oberweltszene(daten);
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: element,
    width: Math.max(1, Math.floor(element.clientWidth / ZOOM)),
    height: Math.max(1, Math.floor(element.clientHeight / ZOOM)),
    zoom: ZOOM,
    pixelArt: true,
    backgroundColor: "#1a1612",
    physics: { default: "arcade", arcade: { debug: false } },
    scene: szene,
    // Die App regelt Ton und Blattstapel selbst; Phaser soll keine Tastatur-Scrolls abfangen.
    input: { keyboard: { capture: [] } },
    audio: { noAudio: true },
  });
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

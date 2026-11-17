/**
 * Start und Ende des Phaser-Spiels der Oberwelt: Spiel in einem Element starten, sauber beenden,
 * die laufende Szene finden.
 *
 * Rolle im Gesamtbild: Hülle um oberwelt/szene.ts für oberwelt/Oberwelt.tsx, ausgelagert, damit die
 * Szene unter 400 Zeilen bleibt. Ändert sich die Größe des Elements (Gerät gedreht,
 * docs/spiel/30, Abschnitt 3), wächst das Spiel mit, und die Kamera bekommt neue Grenzen; der Held
 * bleibt, wo er ist.
 * Abhängigkeiten: phaser, szene.ts (Kamera über kameraregie.ts).
 */
import Phaser from "phaser";
import { Oberweltszene, type Szenendaten } from "./szene";

/**
 * Spielgröße zu einem Element: seine Fläche in Bildschirmpixeln (CSS), mindestens ein Pixel. Das
 * Bild hat volle Auflösung, damit Kartenpixel (×3) und Figurenpixel (×2) beide ganzzahlig auf dem
 * Schirm landen; vergrößert wird mit der Kamera (Variante B, weltmassstab.ts).
 */
function spielgroesse(element: HTMLElement): { breite: number; hoehe: number } {
  return {
    breite: Math.max(1, Math.floor(element.clientWidth)),
    hoehe: Math.max(1, Math.floor(element.clientHeight)),
  };
}

/**
 * Passt Spiel und Kamera an die neue Größe des Elements an. Beispiel: Drehen von 390 × 844 auf
 * 844 × 390 → Bild 844 × 390, bei ZOOM 3 sichtbar 281⅓ × 130 Kartenpixel, Kameragrenzen neu.
 * Sonderfall: Läuft die Szene noch nicht, genügt die neue Spielgröße (create rechnet die Grenzen).
 */
function passeAn(spiel: Phaser.Game, element: HTMLElement): void {
  const { breite, hoehe } = spielgroesse(element);
  if (breite === spiel.scale.width && hoehe === spiel.scale.height) return;
  spiel.scale.resize(breite, hoehe);
  const szene = szeneVon(spiel);
  if (!szene?.sys.isActive()) return;
  szene.cameras.main.setSize(breite, hoehe);
  // Grenzen und Versatz über den Knöpfen neu (kameraregie.ts), etwa beim Drehen ins Hochformat.
  szene.passeKameraAn();
}

/** Startet Phaser in einem Element; die Breite folgt dem Element, die Kamera vergrößert mit ZOOM. */
export function starteOberwelt(element: HTMLElement, daten: Szenendaten): Phaser.Game {
  const szene = new Oberweltszene(daten);
  const { breite, hoehe } = spielgroesse(element);
  const spiel = new Phaser.Game({
    type: Phaser.AUTO,
    parent: element,
    width: breite,
    height: hoehe,
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
      // Phaser entfernt die Leinwand erst beim nächsten Bildaufbau; in einem gedrosselten Tab
      // (WebKit im Hintergrund) standen so beim Reisen kurz zwei Leinwände nebeneinander.
      spiel.canvas?.remove();
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

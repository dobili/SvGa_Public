/**
 * Farbschema der App: hell, dunkel (Nachtmodus) oder wie das Gerät.
 *
 * Rolle im Gesamtbild: Wunsch des Autors nach dem Test von 0.2.30: Der Nachtmodus soll sich in
 * den Einstellungen dauerhaft ein- und ausschalten lassen und nicht nur der Systemeinstellung
 * folgen. Die Wahl ist ein Merker auf dem Gerät (wie die Koordinaten), denn Helligkeit hängt am
 * Gerät, nicht am Lernstand. Die Stile lesen das Attribut `data-farbschema` am Wurzelelement
 * (basis.css): „dunkel“ erzwingt den Nachtmodus, „hell“ verhindert ihn, ohne Attribut gilt das
 * Gerät. Ein kleines Skript in app/index.html setzt das Attribut schon vor dem ersten Zeichnen,
 * damit nichts aufblitzt; es liest denselben Merker („svga.farbschema“).
 * Abhängigkeiten: app/merker.ts.
 */
import { liesMerker, schreibeMerker } from "./merker";

export const FARBSCHEMATA = ["geraet", "hell", "dunkel"] as const;
export type Farbschema = (typeof FARBSCHEMATA)[number];

const MERKER = "farbschema";

/** Die gespeicherte Wahl; ohne Wahl (oder unbekannt) „wie das Gerät“. */
export function liesFarbschema(): Farbschema {
  const wert = liesMerker(MERKER);
  return wert === "hell" || wert === "dunkel" ? wert : "geraet";
}

/** Setzt das Attribut am Wurzelelement passend zur Wahl. */
export function wendeFarbschemaAn(wahl: Farbschema = liesFarbschema()): void {
  const wurzel = document.documentElement;
  if (wahl === "geraet") delete wurzel.dataset["farbschema"];
  else wurzel.dataset["farbschema"] = wahl;
}

/**
 * Speichert die Wahl und wendet sie sofort an.
 * Beispiel: setzeFarbschema("dunkel") → Nachtmodus, auch wenn das Gerät hell eingestellt ist.
 */
export function setzeFarbschema(wahl: Farbschema): void {
  schreibeMerker(MERKER, wahl);
  wendeFarbschemaAn(wahl);
}

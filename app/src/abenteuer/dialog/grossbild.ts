/**
 * Großansicht eines Bildes im Dialog (Atmosphäre T7, docs/spiel/23_Technik_Atmosphaere.md):
 * aus dem Tag `#bild:kennung` den Dateinamen im Zusatzpaket bilden.
 *
 * Rolle im Gesamtbild: dialog/Grossansicht.tsx zeigt das Bild über der Zeile, die den Tag trägt;
 * „Weiter“ führt zur nächsten Zeile und schließt es damit. `#bild:aus` zeigt ausdrücklich keines.
 * Abhängigkeiten: dialog/geschichte.ts (Tags).
 */
import type { Dialogzeile } from "./geschichte";

/** Ordner der Bilder im Zusatzpaket (Gruppe grafik). */
const ORDNER = "bilder";
const ENDUNG = "webp";
const AUS = "aus";
/** Erlaubte Kennungen: Buchstaben, Ziffern, Bindestrich; camelCase wird kebab-case. */
const KENNUNG = /^[A-Za-z0-9-]+$/;

/**
 * Pfad des Bildes zur Zeile oder null, wenn die Zeile keines zeigt.
 *
 * Warum: Eine Zeitung von 1858 oder ein Foto erzählt mehr als ein Satz; das Bild gehört zur Zeile,
 * damit ein Zurückblättern oder ein Dialogende nie ein Bild stehen lässt.
 * Beispiel: `#bild:zeitung1858` → „bilder/zeitung1858.webp“, `#bild:sternenHimmel` →
 * „bilder/sternen-himmel.webp“. Sonderfälle: `#bild:aus`, leere oder unsinnige Kennung → null.
 */
export function bildpfad(tags: Dialogzeile["tags"]): string | null {
  const kennung = tags.bild?.trim() ?? "";
  if (kennung === "" || kennung === AUS || !KENNUNG.test(kennung)) return null;
  const datei = kennung.replace(/[A-Z]/g, (b) => `-${b.toLowerCase()}`);
  return `${ORDNER}/${datei}.${ENDUNG}`;
}

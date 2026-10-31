/**
 * Schalter „Feiereffekte“ (Gamifizierung G3, Entscheidung E10): Feuerwerk, Funkeln und Glanz bei
 * Feiern an oder aus, Vorgabe an.
 *
 * Rolle im Gesamtbild: Feiern sollen kurz und abschaltbar sein (Leitlinien der Vorrecherche). Ton
 * und „Bewegung reduzieren“ des Geräts gab es schon; dieser Schalter nimmt die Effekte auch ohne
 * Systemeinstellung weg. Feuerwerk.tsx fragt ihn ab; neue Effekte (Kombo P10 und weitere) ebenso.
 * Die Meldung selbst (Text, Bild) bleibt immer, nur der Schmuck fällt weg.
 * Abhängigkeiten: app/merker.ts.
 */
import { liesMerker } from "./merker";

/** Merker des Schalters; „aus“ schaltet die Effekte ab, alles andere gilt als an. */
export const MERKER_FEIEREFFEKTE = "feiereffekte";

/** Sind Feiereffekte an? Beispiel: Merker fehlt → true. */
export function feiereffekteAn(): boolean {
  return liesMerker(MERKER_FEIEREFFEKTE) !== "aus";
}

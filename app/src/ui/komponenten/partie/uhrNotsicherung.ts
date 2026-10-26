/**
 * Sofortige Sicherung der Schachuhr beim Verlassen der App (N180).
 *
 * Rolle im Gesamtbild: Die Partie steht in IndexedDB, und das Schreiben dorthin ist asynchron.
 * Beim schnellen Neuladen oder Schließen bricht der Browser es ab; dann stand die Uhr danach
 * wieder auf der Zeit beim letzten Zug, und die Bedenkzeit seit dem Zug fehlte (Befund am
 * Rechner, 0.2.36). Deshalb legt die App beim Verlassen den angehaltenen Uhrstand zusätzlich
 * sofort (synchron) in den Gerätespeicher; beim nächsten Öffnen der Partie übernimmt sie ihn,
 * wenn er zur gespeicherten Partie passt (gleiche Kennung, gleiche Zahl der Züge).
 * Abhängigkeiten: app/merker.ts, speicher/partienLesen.ts, spiel/partie.ts.
 */
import { entferneMerker, liesMerker, schreibeMerker } from "../../../app/merker";
import { uhrstandAus } from "../../../speicher/partienLesen";
import { mitUhr, type Partie } from "../../../spiel/partie";

const MERKER = "uhrNotsicherung";

/**
 * Legt den Uhrstand einer (angehaltenen) Partie sofort in den Gerätespeicher.
 *
 * Warum: localStorage schreibt synchron und übersteht auch ein abgebrochenes Neuladen.
 * Sonderfall: Ohne Uhr oder nach dem Ende gibt es nichts zu sichern; ein alter Merker wird
 * dann entfernt, damit er keine spätere Partie verstellt.
 */
export function sichereUhr(partie: Partie): void {
  if (!partie.uhr || partie.ende) {
    entferneMerker(MERKER);
    return;
  }
  const eintrag = { id: partie.id, zuege: partie.zuege.length, uhr: partie.uhr };
  schreibeMerker(MERKER, JSON.stringify(eintrag));
}

/** Entfernt die Sicherung (die Partie ist wieder sichtbar und in IndexedDB aktuell). */
export function verwerfeUhrsicherung(): void {
  entferneMerker(MERKER);
}

/** Liest die Sicherung; unlesbare Einträge gelten als keine Sicherung. */
function liesSicherung(): { id: string; zuege: number; uhr: unknown } | null {
  const text = liesMerker(MERKER);
  if (!text) return null;
  try {
    const roh: unknown = JSON.parse(text);
    if (typeof roh !== "object" || roh === null) return null;
    const { id, zuege, uhr } = roh as Record<string, unknown>;
    if (typeof id !== "string" || typeof zuege !== "number") return null;
    return { id, zuege, uhr };
  } catch (fehler) {
    console.warn("Uhrsicherung unlesbar, verworfen:", fehler);
    return null;
  }
}

/**
 * Übernimmt den gesicherten Uhrstand in die Partie, wenn er zu ihr passt.
 *
 * Ausgabe: die Partie mit der angehaltenen Uhr aus der Sicherung, sonst unverändert.
 * Beispiel: 15+10, Weiß denkt 2 Minuten nach seinem 12. Zug, Neuladen → 13:00 statt 15:00.
 * Sonderfälle: andere Partie, inzwischen weitergezogen (andere Zahl der Züge), Partie beendet
 * oder ohne Uhr: unverändert. Die Uhr aus der Sicherung steht (laeuft null), sie läuft erst mit
 * setzeUhrFort weiter.
 */
export function mitGesicherterUhr(partie: Partie): Partie {
  const sicherung = liesSicherung();
  if (!sicherung || sicherung.id !== partie.id) return partie;
  if (sicherung.zuege !== partie.zuege.length || !partie.uhr || partie.ende) return partie;
  const uhr = uhrstandAus(sicherung.uhr);
  return uhr ? mitUhr(partie, uhr) : partie;
}

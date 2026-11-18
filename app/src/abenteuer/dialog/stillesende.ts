/**
 * Stilles Ende: Läuft ein Dialogknoten ohne Zeile, ohne Auswahl und ohne Wirkung bis END?
 *
 * Rolle im Gesamtbild: Ein Übergang mit Dialog (orte.json, `dialog` am Übergang) fragt Ink, ob es
 * etwas zu sagen gibt. Bei offener Wegsperre (docs/spiel/32_Wegsperren.md, Knoten
 * `testteam_wald_tor`) endet der Knoten sofort. Früher öffnete die Oberwelt dafür trotzdem das
 * Dialogfenster: Es blieb leer, aber Steuerkreuz und Knöpfe verschwanden für ein Bild, und der
 * Kartenwechsel kam später als an einem Übergang ohne Dialog (Befund im Browser, 18.11.2026).
 * Mit dieser Probe wechselt die Oberwelt gleich (oberwelt/useDialogende.ts).
 * Abhängigkeiten: dialog/geschichte.ts.
 */
import { Geschichte, type Dialogvariablen, type Wirkungen } from "./geschichte";

/**
 * Spielt den Knoten zur Probe ohne Wirkungen.
 * Eingaben: übersetzte Geschichte (JSON-Text), Knoten, Dialogvariablen und Name des Helden, wie
 * sie auch der Dialog bekäme.
 * Ausgabe: die Variablen nach dem Durchlauf, wenn der Knoten still endet; sonst null (dann zeigt
 * der Aufrufer den Dialog wie immer, und Ink läuft dort noch einmal von vorn).
 * Beispiel: `testteam_wald_tor` mit `testteamWaldDurch` → Variablen; ohne → null (Zoe spricht).
 * Sonderfälle: Ruft der Knoten vor dem Ende eine externe Funktion (`beginnePartie`, `reise` …),
 * gilt er nicht als still, weil die Probe keine Wirkung auslösen darf; ein Knoten, den es nicht
 * gibt, ist ebenfalls nicht still (den Fehler meldet der Dialog).
 */
export function stillesEnde(
  json: string,
  knoten: string,
  variablen: Dialogvariablen,
  heldname: string,
): Dialogvariablen | null {
  let gerufen = false;
  // Jede Wirkung, auch eine künftige oder wahlfreie, merkt nur, dass sie gerufen wurde.
  const lauscher = new Proxy<Wirkungen>({} as Wirkungen, {
    get: () => () => {
      gerufen = true;
    },
  });
  try {
    const probe = new Geschichte(json, lauscher, variablen, heldname);
    probe.starte(knoten);
    const schritt = probe.weiter();
    return schritt.art === "ende" && !gerufen ? probe.variablen() : null;
  } catch {
    // Kaputte Daten: nicht still, der Dialog zeigt den Fehler an seiner üblichen Stelle.
    return null;
  }
}

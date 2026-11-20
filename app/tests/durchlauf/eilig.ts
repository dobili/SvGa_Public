/**
 * Der eilige Spieler des Spieler-Durchlaufs (DURCHLAUF_SPIELER=eilig): Er tippt „Weiter“, sobald
 * es geht, oft zweimal hintereinander, nimmt immer die erste Antwort, schließt Läden und das
 * Tagebuch gleich wieder, tippt den Aktionsknopf doppelt und dreht nach einem Kartenwechsel sofort
 * wieder um.
 *
 * Warum: Auftrag des Hauptchats (20.11.2026): Wettläufe finden, die ein ruhiger Spieler nie
 * auslöst, also doppelte Dialoge, verlorene Rückmeldungen, hängende Eingabepausen und Meldungen
 * über offenen Fenstern. Gemeldet werden sie von der Wache (wache.ts) und vom
 * Rückmeldungsbeobachter (rueckmeldung.ts); dieser Spieler sorgt nur für die Hast.
 * Damit er trotzdem vorankommt, nimmt er dieselbe erste Antwort auf dieselbe Frage höchstens
 * ERSTE_MAX-mal (danach wählt er wie der gewöhnliche Durchlauf), bricht jeden Laden nur beim
 * ersten Besuch ab und dreht je Karte nur einmal um.
 * Abhängigkeiten: eingabe.ts, lage.ts, laufen.ts, welt.ts.
 * Beispiel: Rosa fragt „Willst du spielen?“ → er tippt die erste Antwort, ohne zu lesen.
 */
import { tippe, tippePunkt, type Lauf } from "./eingabe";
import type { Knopf } from "./lage";
import { geheDurch } from "./laufen";
import { ausgaengeVon, kartenwissen, type Spieldaten } from "./welt";
import type { Locator } from "@playwright/test";
import type { Abenteuerstand } from "../../src/abenteuer/schnittstelle/spielstand";

/** Ist der eilige Spieler eingeschaltet? */
export const EILIG = process.env.DURCHLAUF_SPIELER === "eilig";

/** So oft nimmt er dieselbe erste Antwort auf dieselbe Frage, dann wählt er wie gewöhnlich. */
export const ERSTE_MAX = 2;
/** Jedes so vielte „Weiter“ tippt er doppelt. */
const DOPPELT_ALLE = 2;
/** Abstand der beiden Tipper eines Doppeltipps (ms): schneller als ein Bild der App. */
export const DOPPELTIPP_MS = 15;
/** Nach so vielen Schritten in der Welt öffnet er das Tagebuch (und schließt es gleich). */
const TAGEBUCH_ALLE = 6;
/** Jede so vielte neue Karte verlässt er gleich wieder durch den Eingang. */
const UMDREHEN_ALLE = 2;

/** Das Gedächtnis des eiligen Spielers (nur für diesen Lauf). */
export class Eiliger {
  private readonly erste = new Map<string, number>();
  private readonly abgebrochen = new Set<string>();
  private readonly umgedreht = new Set<string>();
  private weiterZahl = 0;
  private schritte = 0;
  private neueKarten = 0;

  /** `an`: hetzt er überhaupt (Vorgabe DURCHLAUF_SPIELER=eilig; Tests schalten es ein). */
  constructor(readonly an: boolean = EILIG) {}

  /**
   * Die Antwort des eiligen Spielers: die erste, solange er sie auf diese Frage nicht schon
   * ERSTE_MAX-mal genommen hat; sonst null (dann wählt der gewöhnliche Durchlauf).
   * Beispiel: „Noch eine Partie?“ → 0, 0, dann null (sonst spielte er ewig Revanche).
   */
  antwort(frage: string, wahlen: readonly string[]): number | null {
    if (!this.an || wahlen.length === 0) return null;
    const schluessel = `${frage}|${wahlen[0] ?? ""}`;
    const n = this.erste.get(schluessel) ?? 0;
    if (n >= ERSTE_MAX) return null;
    this.erste.set(schluessel, n + 1);
    return 0;
  }

  /** Tippt er dieses „Weiter“ doppelt? (Jedes DOPPELT_ALLE-te.) */
  doppelt(): boolean {
    if (!this.an) return false;
    this.weiterZahl += 1;
    return this.weiterZahl % DOPPELT_ALLE === 0;
  }

  /** Bricht er diesen Laden ab, statt zu kaufen? Nur beim ersten Besuch je Karte. */
  brichLadenAb(karte: string): boolean {
    if (!this.an || this.abgebrochen.has(karte)) return false;
    this.abgebrochen.add(karte);
    return true;
  }

  /** Öffnet er in diesem Weltschritt das Tagebuch? (Jeder TAGEBUCH_ALLE-te.) */
  tagebuchJetzt(): boolean {
    if (!this.an) return false;
    this.schritte += 1;
    return this.schritte % TAGEBUCH_ALLE === 0;
  }

  /** Dreht er auf dieser neuen Karte gleich wieder um? Je Karte höchstens einmal. */
  drehtUm(karte: string): boolean {
    if (!this.an || this.umgedreht.has(karte)) return false;
    this.umgedreht.add(karte);
    this.neueKarten += 1;
    return this.neueKarten % UMDREHEN_ALLE === 0;
  }
}

/**
 * Tippt ein Element an seiner Mitte an, mit `doppelt` gleich ein zweites Mal an derselben Stelle,
 * ohne nachzusehen, was dort jetzt liegt (wie ein ungeduldiger Daumen). Ausgabe: ob getippt wurde.
 */
export async function hastigTippen(lauf: Lauf, ziel: Locator, doppelt: boolean): Promise<boolean> {
  const box = await ziel
    .last()
    .boundingBox({ timeout: 500 })
    .catch(() => null);
  if (!box) return false;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await tippePunkt(lauf, x, y);
  if (doppelt) {
    await lauf.seite.waitForTimeout(DOPPELTIPP_MS);
    await tippePunkt(lauf, x, y);
  }
  return true;
}

/** Der Knopf, der den Laden schließt (unten im Fenster). */
export function ladenZu(knoepfe: readonly Knopf[]): Knopf | undefined {
  return knoepfe.find((k) => k.fenster === "abenteuer-laden" && k.klasse.includes("knopf-haupt"));
}

/**
 * Laden gleich wieder zu, ohne zu kaufen. Liegt „Schließen“ unter dem Rand (viele Waren im
 * Hochformat), rollt er hin; sonst verfiele der Abbruch, und er kaufte doch (Kiosk, 20.11.2026).
 */
export async function schliesseLaden(lauf: Lauf, knoepfe: readonly Knopf[]): Promise<void> {
  lauf.messung.log("  EILIG: Laden gleich wieder zu");
  const zu = ladenZu(knoepfe);
  if (zu) await tippePunkt(lauf, zu.x, zu.y);
  else
    await tippe(
      lauf,
      lauf.seite.locator("[data-testid='abenteuer-laden'] > .knopf-haupt"),
      "Laden „Schließen“",
    );
}

/**
 * Tagebuch auf und gleich wieder zu; jedes zweite Mal tippt er vorher den ersten Zielpfeil an
 * (Verfolgen an oder aus). Ausgabe: ob das Tagebuch aufging.
 */
export async function blaettereTagebuch(lauf: Lauf, mitPfeil: boolean): Promise<boolean> {
  const seite = lauf.seite;
  if (!(await tippe(lauf, seite.getByTestId("abenteuer-tagebuchknopf"), "Tagebuch"))) return false;
  lauf.messung.log(`  EILIG: Tagebuch auf${mitPfeil ? ", Zielpfeil" : ""} und gleich zu`);
  const buch = seite.getByTestId("abenteuer-tagebuch");
  await buch.waitFor({ state: "visible", timeout: 2000 }).catch(() => undefined);
  if (mitPfeil) {
    await tippe(lauf, buch.locator("[data-testid^='abenteuer-zielpfeil-']"), "Zielpfeil");
  }
  await tippe(lauf, buch.locator(":scope > .knopf-haupt"), "Tagebuch „Schließen“");
  return true;
}

/**
 * Nach einem Kartenwechsel sofort zurück durch den Eingang, aus dem er kam (ohne auf die neue
 * Welt zu warten), wenn die Karte einen Ausgang dorthin hat. Der nächste Weltschritt plant von
 * der alten Karte neu. Ausgabe: ob er es versucht hat.
 */
export async function dreheUm(
  lauf: Lauf,
  daten: Spieldaten,
  stand: Abenteuerstand,
  vorher: string,
): Promise<boolean> {
  const zurueck = ausgaengeVon(daten, stand.position.karte).find((a) => a.nach === vorher);
  if (!zurueck || zurueck.wenn || zurueck.dialog) return false;
  const wissen = kartenwissen(daten, stand.position.karte, stand);
  const ergebnis = await geheDurch(lauf, wissen, zurueck.name);
  lauf.messung.log(`  EILIG: gleich wieder zurück durch ${zurueck.name}: ${ergebnis}`);
  return true;
}
